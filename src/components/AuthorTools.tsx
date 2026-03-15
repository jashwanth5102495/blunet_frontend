import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Save, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Layout, 
  ArrowLeft,
  Monitor,
  Server,
  Shield,
  Database,
  Globe,
  Cpu,
  Smartphone,
  Wifi,
  Lock,
  BarChart
} from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { Course, Lesson } from '../data/types';

// Helper to render icons based on string or ReactNode
const renderIcon = (icon: any) => {
  if (React.isValidElement(icon)) return icon;
  
  const iconMap: { [key: string]: React.ReactNode } = {
    'Cpu': <Cpu className="w-6 h-6" />,
    'Layout': <Layout className="w-6 h-6" />,
    'Code': <Code className="w-6 h-6" />,
    'Terminal': <Terminal className="w-6 h-6" />,
    'Server': <Server className="w-6 h-6" />,
    'Smartphone': <Smartphone className="w-6 h-6" />,
    'Globe': <Globe className="w-6 h-6" />,
    'Shield': <Shield className="w-6 h-6" />,
    'Database': <Database className="w-6 h-6" />,
    'Monitor': <Monitor className="w-6 h-6" />,
    'Wifi': <Wifi className="w-6 h-6" />,
    'Lock': <Lock className="w-6 h-6" />,
    'BarChart': <BarChart className="w-6 h-6" />
  };

  return iconMap[icon as string] || <BookOpen className="w-6 h-6" />;
};

const AUTHOR_TAB_EXCLUDED_COURSE_IDS = new Set([
  'ai-tools-mastery',
  'frontend-beginner',
  'devops-beginner',
  'networking-beginner',
  'cyber-security-beginner'
]);

const AUTHOR_TAB_EXCLUDED_COURSE_TITLES = new Set([
  'frontend development - beginner',
  'devops - beginner',
  'networking - beginner',
  'cyber security - beginner'
]);

const normalizeCourseTitle = (title: string | undefined) => (title || '').trim().toLowerCase();

const isExcludedFromAuthorTab = (course: Course) => {
  const id = (course.id || '').trim().toLowerCase();
  if (AUTHOR_TAB_EXCLUDED_COURSE_IDS.has(id)) return true;
  const normalizedTitle = normalizeCourseTitle(course.title);
  if (AUTHOR_TAB_EXCLUDED_COURSE_TITLES.has(normalizedTitle)) return true;
  return normalizedTitle.startsWith('a.i tools mastery');
};

const AuthorTools: React.FC = () => {
  const { courses, addCourse, deleteCourse, updateCoursePersisted } = useCourses();
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // New Course Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('frontend');
  const [newCourseDescription, setNewCourseDescription] = useState('');

  // Editor State
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lesson' | 'syntax' | 'livecode'>('lesson');
  const [expandedModuleIds, setExpandedModuleIds] = useState<string[]>([]);
  
  // Form State
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);

  const visibleCourses = courses.filter((c) => !isExcludedFromAuthorTab(c));
  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  // --- Handlers ---

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: newCourseTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newCourseTitle,
      category: newCourseCategory,
      level: 'beginner',
      description: newCourseDescription,
      technologies: [],
      price: 0,
      duration: '0 weeks',
      projects: 0,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
      rating: 0,
      students: 0,
      maxStudents: 1000,
      instructor: 'New Instructor',
      modules: [],
      icon: 'BookOpen'
    };
    addCourse(newCourse);
    setShowAddModal(false);
    setNewCourseTitle('');
    setNewCourseDescription('');
  };

  const handleDeleteCourse = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || isExcludedFromAuthorTab(course)) return;
    setSelectedCourseId(courseId);
    setView('editor');
    // Select first lesson of first module if available
    if (course && course.modules && course.modules.length > 0) {
      setActiveModuleId(course.modules[0].id || null);
      if (course.modules[0].id) {
        setExpandedModuleIds([course.modules[0].id]); // Expand first module by default
      }
      if (course.modules[0].lessons && course.modules[0].lessons.length > 0) {
        const firstLesson = course.modules[0].lessons[0];
        setActiveLessonId(firstLesson.id);
        setEditedLesson({ ...firstLesson } as Lesson);
      }
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModuleIds(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonSelect = (moduleId: string, lesson: any) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lesson.id);
    setEditedLesson({ ...lesson });
  };

  const handleSave = async () => {
    if (!selectedCourseId || !activeModuleId || !activeLessonId || !editedLesson || !selectedCourse) return;

    const updatedCourse = {
      ...selectedCourse,
      modules: selectedCourse.modules?.map(mod => {
        if (mod.id !== activeModuleId) return mod;
        return {
          ...mod,
          lessons: mod.lessons?.map(les => {
            if (les.id !== activeLessonId) return les;
            return editedLesson;
          }) || []
        };
      }) || []
    };

    const result = await updateCoursePersisted(updatedCourse);
    if (result.ok) {
      alert('Lesson saved successfully!');
      return;
    }
    alert(`Saved locally, but backend save failed: ${result.message} (status: ${result.status})`);
  };

  const updateSyntaxItem = (index: number, field: 'title' | 'content', value: string) => {
    if (!editedLesson) return;
    const newSyntax = [...editedLesson.syntax];
    newSyntax[index] = { ...newSyntax[index], [field]: value };
    setEditedLesson({ ...editedLesson, syntax: newSyntax });
  };

  const addSyntaxItem = () => {
    if (!editedLesson) return;
    setEditedLesson({
      ...editedLesson,
      syntax: [...editedLesson.syntax, { title: 'New Example', content: '// Code here' }]
    });
  };

  const removeSyntaxItem = (index: number) => {
    if (!editedLesson) return;
    const newSyntax = editedLesson.syntax.filter((_, i) => i !== index);
    setEditedLesson({ ...editedLesson, syntax: newSyntax });
  };

  // --- Render ---

  if (view === 'list') {
    return (
      <div className="p-6 relative h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Course Authoring</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Course
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {visibleCourses.map(course => (
            <div
              key={course.id}
              onClick={() => handleCourseSelect(course.id)}
              className="relative flex flex-col items-start p-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all duration-200 group text-left cursor-pointer"
            >
              <button
                onClick={(e) => handleDeleteCourse(e, course.id)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                title="Delete Course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="p-3 bg-gray-900 rounded-lg text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                {renderIcon(course.icon)}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-gray-900 px-2 py-1 rounded border border-gray-700">{course.modules?.length || 0} Modules</span>
                <span className="bg-gray-900 px-2 py-1 rounded border border-gray-700 capitalize">{course.level}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Course Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Add New Course</h3>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Advanced React Patterns"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="devops">DevOps</option>
                    <option value="mobile">Mobile</option>
                    <option value="ai">AI & Data Science</option>
                    <option value="cybersecurity">Cyber Security</option>
                    <option value="networking">Networking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    required
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 h-24 resize-none"
                    placeholder="Brief description of the course..."
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden">
      {/* Sidebar - Topics */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <button 
            onClick={() => setView('list')}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-white truncate">{selectedCourse?.title}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedCourse?.modules?.map(module => (
            <div key={module.id} className="space-y-2">
              <button 
                onClick={() => module.id && toggleModule(module.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-800 rounded-lg group transition-colors"
              >
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-300 transition-colors text-left flex-1">
                  {module.title}
                </h4>
                {module.id && expandedModuleIds.includes(module.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  module.id && expandedModuleIds.includes(module.id) 
                    ? 'grid-rows-[1fr] opacity-100' 
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1 pb-2">
                    {module.lessons?.map(lesson => (
                      <button
                        key={lesson.id}
                        onClick={() => module.id && handleLessonSelect(module.id, lesson)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeLessonId === lesson.id
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {activeLessonId === lesson.id ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    ))}
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg border border-dashed border-gray-800 hover:border-gray-700 transition-all">
                      <Plus className="w-3 h-3" />
                      Add Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 p-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-dashed border-gray-700 transition-all">
            <Plus className="w-4 h-4" />
            Add New Module
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {editedLesson ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50">
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-800 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('lesson')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'lesson' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Lesson
                  </button>
                  <button
                    onClick={() => setActiveTab('syntax')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'syntax' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    Syntax
                  </button>
                  <button
                    onClick={() => setActiveTab('livecode')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'livecode' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    Live Code
                  </button>
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-900/20"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Meta Data */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Lesson Title</label>
                    <input
                      type="text"
                      value={editedLesson.title}
                      onChange={(e) => setEditedLesson({ ...editedLesson, title: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Duration</label>
                    <input
                      type="text"
                      value={editedLesson.duration}
                      onChange={(e) => setEditedLesson({ ...editedLesson, duration: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'lesson' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
                      <span>HTML Content</span>
                      <span className="text-gray-600 font-normal normal-case">Supports Tailwind classes</span>
                    </label>
                    <textarea
                      value={editedLesson.content}
                      onChange={(e) => setEditedLesson({ ...editedLesson, content: e.target.value })}
                      className="w-full h-[600px] bg-gray-900 border border-gray-800 rounded-lg p-4 text-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed resize-none"
                      placeholder="<h2 class='text-2xl...'>...</h2>"
                    />
                  </div>
                )}

                {activeTab === 'syntax' && (
                  <div className="space-y-6">
                    {editedLesson.syntax.map((item, index) => (
                      <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-4 relative group">
                        <button
                          onClick={() => removeSyntaxItem(index)}
                          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateSyntaxItem(index, 'title', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Code Block</label>
                            <textarea
                              value={item.content}
                              onChange={(e) => updateSyntaxItem(index, 'content', e.target.value)}
                              className="w-full h-32 bg-gray-950 border border-gray-800 rounded-lg p-3 text-blue-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addSyntaxItem}
                      className="w-full py-4 border-2 border-dashed border-gray-800 rounded-xl text-gray-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-900/5 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Add Syntax Example
                    </button>
                  </div>
                )}

                {activeTab === 'livecode' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Live Code Default</label>
                      <textarea
                        value={editedLesson.liveCode}
                        onChange={(e) => setEditedLesson({ ...editedLesson, liveCode: e.target.value })}
                        className="w-full h-[400px] bg-gray-900 border border-gray-800 rounded-lg p-4 text-green-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Explanation (HTML)</label>
                      <textarea
                        value={editedLesson.liveCodeExplanation}
                        onChange={(e) => setEditedLesson({ ...editedLesson, liveCodeExplanation: e.target.value })}
                        className="w-full h-[200px] bg-gray-900 border border-gray-800 rounded-lg p-4 text-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <Layout className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Select a lesson to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorTools;
