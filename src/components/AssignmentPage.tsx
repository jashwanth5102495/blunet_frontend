import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpenIcon, 
  ClipboardDocumentCheckIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import MagnetLines from './MagnetLines';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper: derive courseId and moduleId from assignmentId
const getCourseAndModuleForAssignment = (id: string, title?: string) => {
  let courseId: string | null = null;
  let moduleId = 'assignments';
  if (id?.startsWith('frontend-beginner')) {
    courseId = 'frontend-beginner';
  } else if (id?.startsWith('devops-beginner')) {
    courseId = 'devops-beginner';
  } else if (id?.startsWith('frontend-intermediate')) {
    courseId = 'frontend-intermediate';
  } else if (id?.startsWith('ai-tools')) {
    courseId = 'ai-tools-mastery';
    const numMatch = id.match(/ai-tools-(\d+)/);
    if (numMatch) moduleId = `module_${numMatch[1]}`;
  }
  return { courseId, moduleId, assignmentTitle: title || id };
};
interface Question {
  questionId: number;
  question: string;
  options: string[];
}

interface Topic {
  topicId: string;
  title: string;
  content: string;
  examples?: string[];
  syntax?: string;
  explanation?: string;
  id?: string; // fallback id from backend topics
}

interface Assignment {
  assignmentId: string;
  courseId: string | null;
  title: string;
  description: string;
  topics: Topic[];
  questions: Question[];
  totalQuestions: number;
  passingPercentage: number;
}

interface AttemptHistory {
  _id: string;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  createdAt: string;
}

const AssignmentPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  // Use the assignmentId directly without remapping
  const effectiveAssignmentId = assignmentId;
  
  const [currentView, setCurrentView] = useState<'study' | 'test' | 'results'>('study');
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [testResult, setTestResult] = useState<any>(null);
  const [attemptHistory, setAttemptHistory] = useState<AttemptHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        const userData = JSON.parse(currentUser);
        
        const response = await fetch(`${BASE_URL}/api/assignments/${effectiveAssignmentId}`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch assignment');
        }
        
        if (result.success) {
          setAssignment(result.data);
          if (result.data.topics && result.data.topics.length > 0) {
            const first = result.data.topics[0];
            const tid = first.topicId || first.id || first.title;
            setSelectedTopic(tid);
          }
        } else {
          throw new Error(result.message || 'Assignment not found');
        }
      } catch (err: any) {
        console.error('Error fetching assignment:', err);
        setError(err.message || 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };
    
    if (effectiveAssignmentId) {
      fetchAssignment();
    }
  }, [effectiveAssignmentId, navigate]);

  const fetchAttemptHistory = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return;
      
      const userData = JSON.parse(currentUser);
      
      const response = await fetch(`${BASE_URL}/api/assignments/${effectiveAssignmentId}/attempts`, {
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success && result.data.attempts) {
        setAttemptHistory(result.data.attempts);
      }
    } catch (err) {
      console.error('Error fetching attempt history:', err);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchAttemptHistory();
    }
  }, [showHistory]);

  const handleSubmitTest = async () => {
    if (!assignment) return;
    
    const unansweredCount = assignment.questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }
    
    try {
      setSubmitting(true);
      
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      const userData = JSON.parse(currentUser);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      const response = await fetch(`${BASE_URL}/api/assignments/${effectiveAssignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: selectedAnswers,
          timeSpent
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit assignment');
      }
      
      if (result.success) {
        setTestResult(result.data);

        // Record progress in backend (assignments summary)
        try {
          const { courseId, moduleId, assignmentTitle } = getCourseAndModuleForAssignment(effectiveAssignmentId, assignment?.title);
          const percentage = typeof result?.data?.percentage === 'number' ? Math.round(result.data.percentage) : null;
          const passed = Boolean(result?.data?.passed);
          if (courseId && percentage !== null) {
            await fetch(`${BASE_URL}/api/progress/student/${userData.id}/assignment`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${userData.token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                courseId,
                moduleId,
                assignmentId: effectiveAssignmentId,
                assignmentTitle,
                status: passed ? 'graded' : 'submitted',
                score: percentage,
                maxScore: 100,
                timeSpent
              })
            });
          }
        } catch (progressErr) {
          console.error('Failed to record assignment progress:', progressErr);
        }

        setCurrentView('results');
        await fetchAttemptHistory();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('Error submitting assignment:', err);
      alert(err.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (assignment && currentQuestionIndex < assignment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRetakeTest = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTestResult(null);
    setCurrentView('study');
  };

  const handleStartTest = () => {
    setCurrentView('test');
    setStartTime(Date.now());
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const selectedTopicData = assignment?.topics.find(topic => (topic.topicId || topic.id || topic.title) === selectedTopic);

  // Auto-expand Explanation when available for the selected topic
  React.useEffect(() => {
    if (selectedTopicData?.explanation) {
      const key = `explanation-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`;
      setExpandedSections(prev => ({
        ...prev,
        [key]: prev[key] ?? true,
      }));
    }
  }, [selectedTopic, selectedTopicData?.explanation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading assignment...</div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl mb-4">Error Loading Assignment</h2>
          <p className="text-gray-400 mb-6">{error || 'Assignment not found'}</p>
          <button
            onClick={() => navigate('/student-portal')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <MagnetLines
          rows={12}
          columns={12}
          containerSize="100vmin"
          lineColor="#3b82f6"
          lineWidth="0.6vmin"
          lineHeight="4vmin"
          baseAngle={0}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            opacity: 0.15,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/student-portal')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{assignment.title}</h1>
                  <p className="text-sm text-gray-400">
                    {assignment.totalQuestions} questions • Pass: {assignment.passingPercentage}%+
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  <TrophyIcon className="w-5 h-5 inline mr-2" />
                  History
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setShowHistory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Attempt History</h2>
                {attemptHistory.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No attempts yet. Take the test to get started!</p>
                ) : (
                  <div className="space-y-3">
                    {attemptHistory.map((attempt) => (
                      <div
                        key={attempt._id}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-white">
                              Attempt #{attempt.attemptNumber}
                            </span>
                            {attempt.passed && (
                              <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                                ✓ Passed
                              </span>
                            )}
                          </div>
                          <span className="text-2xl font-bold text-white">
                            {attempt.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>
                            Score: {attempt.score}/{attempt.totalQuestions}
                          </span>
                          <span>
                            {new Date(attempt.createdAt).toLocaleDateString()} at{' '}
                            {new Date(attempt.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {attempt.timeSpent > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            <ClockIcon className="w-4 h-4 inline mr-1" />
                            Time: {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className="mt-6 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* View Selector */}
          {currentView !== 'results' && (
            <div className="flex justify-center mb-8 space-x-4">
              <button
                onClick={() => setCurrentView('study')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentView === 'study'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <BookOpenIcon className="w-5 h-5 inline mr-2" />
                Study Material
              </button>
              <button
                onClick={handleStartTest}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentView === 'test'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <ClipboardDocumentCheckIcon className="w-5 h-5 inline mr-2" />
                Take Test
              </button>
            </div>
          )}

          {/* Study Material View */}
          {currentView === 'study' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Topic Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <h3 className="text-white font-semibold mb-4">Topics</h3>
                  <div className="space-y-2">
                    {assignment.topics.map((topic) => (
                      <button
                        key={topic.topicId || topic.id || topic.title}
                        onClick={() => setSelectedTopic(topic.topicId || topic.id || topic.title)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedTopic === (topic.topicId || topic.id || topic.title)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">{topic.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Topic Content */}
              <div className="lg:col-span-3">
                {selectedTopicData && (
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                    <h2 className="text-3xl font-bold text-white mb-6">
                      {selectedTopicData.title}
                    </h2>
                    
                    {/* Content */}
                    <div className="prose prose-invert max-w-none mb-6">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {selectedTopicData.content}
                      </div>
                    </div>

                    {/* Explanation */}
                    {selectedTopicData.explanation && (
                      <div className="mb-6">
                        <button
                          onClick={() => toggleSection(`explanation-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`)}
                          className="w-full flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors mb-2"
                        >
                          <span className="text-white font-medium">Explanation</span>
                          {expandedSections[`explanation-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] ? (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedSections[`explanation-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] && (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-sm text-gray-300 whitespace-pre-line">{selectedTopicData.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Topic navigation */}
                    <div className="flex items-center justify-between mt-4">
                      {(() => {
                        const idx = assignment.topics.findIndex(t => (t.topicId || t.id || t.title) === selectedTopic);
                        const prev = idx > 0 ? assignment.topics[idx - 1] : null;
                        const next = idx >= 0 && idx < assignment.topics.length - 1 ? assignment.topics[idx + 1] : null;
                        const prevId = prev && (prev.topicId || prev.id || prev.title);
                        const nextId = next && (next.topicId || next.id || next.title);
                        return (
                          <>
                            <button
                              disabled={!prev}
                              onClick={() => prevId && setSelectedTopic(prevId)}
                              className={`px-4 py-2 rounded-lg ${prev ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                            >
                              ← Previous
                            </button>
                            <button
                              disabled={!next}
                              onClick={() => nextId && setSelectedTopic(nextId)}
                              className={`px-4 py-2 rounded-lg ${next ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                            >
                              Next →
                            </button>
                          </>
                        );
                      })()}
                    </div>
                    {/* Syntax */}
                    {selectedTopicData.syntax && (
                      <div className="mb-6">
                        <button
                          onClick={() => toggleSection(`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`)}
                          className="w-full flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors mb-2"
                        >
                          <span className="text-white font-medium">Syntax</span>
                          {expandedSections[`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] ? (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedSections[`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] && (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <pre className="text-sm text-green-400 overflow-x-auto">
                              <code>{selectedTopicData.syntax}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Examples */}
                    {selectedTopicData.examples && selectedTopicData.examples.length > 0 && (
                      <div>
                        <button
                          onClick={() => toggleSection(`examples-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`)}
                          className="w-full flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors mb-2"
                        >
                          <span className="text-white font-medium">Examples</span>
                          {expandedSections[`examples-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] ? (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedSections[`examples-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] && (
                          <div className="space-y-4">
                            {selectedTopicData.examples.map((example, index) => (
                              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                                <pre className="text-sm text-blue-400 overflow-x-auto">
                                  <code>{example}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Test View */}
          {currentView === 'test' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">
                      Question {currentQuestionIndex + 1} of {assignment.questions.length}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Answered: {Object.keys(selectedAnswers).length}/{assignment.questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / assignment.questions.length) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {assignment.questions[currentQuestionIndex].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {assignment.questions[currentQuestionIndex].options.map((option, index) => {
                      const questionId = assignment.questions[currentQuestionIndex].questionId;
                      const isSelected = selectedAnswers[questionId] === index;

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(questionId, index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-600/20 text-white'
                              : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-600'
                              }`}
                            >
                              {isSelected && (
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <span className="flex-1">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {currentQuestionIndex === assignment.questions.length - 1 ? (
                    <button
                      onClick={handleSubmitTest}
                      disabled={submitting}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Test'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results View */}
          {currentView === 'results' && testResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mb-6"
                >
                  {testResult.passed ? (
                    <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto" />
                  ) : (
                    <XCircleIcon className="w-24 h-24 text-red-500 mx-auto" />
                  )}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  {testResult.passed ? 'Congratulations! 🎉' : 'Keep Learning! 📚'}
                </motion.h2>

                {/* Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <div className="text-3xl font-bold mb-2 text-white">
                    {testResult.score} / {testResult.totalQuestions}
                  </div>
                  <div className="text-lg text-gray-400 mb-4">
                    {testResult.percentage.toFixed(1)}% Score
                  </div>
                  <div className="w-64 bg-gray-700 rounded-full h-4 mx-auto overflow-hidden">
                    <motion.div
                      className={`h-4 rounded-full ${
                        testResult.passed
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${testResult.percentage}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <p className="text-gray-300 text-lg mb-4">{testResult.message}</p>
                  {!testResult.passed && (
                    <p className="text-gray-400">
                      You need to score more than {assignment.passingPercentage}% to pass this assignment.
                      Review the study material and try again when you're ready.
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Attempt #{testResult.attemptNumber}
                  </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center space-x-4"
                >
                  {!testResult.passed && (
                    <motion.button
                      onClick={handleRetakeTest}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 font-medium shadow-lg"
                    >
                      📚 Study & Retake Test
                    </motion.button>
                  )}
                  {testResult.passed && (
                    <motion.button
                      onClick={handleRetakeTest}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
                    >
                      🔄 Take Again
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => navigate('/student-portal')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all duration-200 font-medium"
                  >
                    🏠 Back to Portal
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;