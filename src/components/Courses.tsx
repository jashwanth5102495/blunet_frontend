import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';
import { Search, ChevronDown, User, Star, History, UserCircle, X, CheckCircle2, Clock, BookOpen, Shield, Zap, Layout, Code, Terminal, Server, Smartphone, Globe, Database, ClipboardList } from 'lucide-react';
import { INITIAL_COURSES } from '../data/courses';
import { Course } from '../data/types';
import { getAssignmentDefinitions, normalizeCourseKey } from '../data/courseAssignments';

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses = INITIAL_COURSES;

  useEffect(() => {
    const state = location.state as { selectedCourseId?: string };
    if (state?.selectedCourseId) {
      const course = courses.find(c => c.id === state.selectedCourseId);
      if (course) {
        setSelectedCourse(course);
      }
      // Clear state after reading to prevent popup reopening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, courses, navigate]);

  const categories = [
    { id: 'all', name: 'All Category', count: courses.length },
    { id: 'ai', name: 'AI & Machine Learning', count: courses.filter(c => c.category === 'ai').length },
    { id: 'frontend', name: 'Developments', count: courses.filter(c => c.category === 'frontend').length },
    { id: 'devops', name: 'DevOps & Cloud', count: courses.filter(c => c.category === 'devops').length },
    { id: 'networking', name: 'Networking', count: courses.filter(c => c.category === 'networking').length },
    { id: 'cyber', name: 'Cyber Security', count: courses.filter(c => c.category === 'cyber').length },
    { id: 'data-science', name: 'Data Science', count: courses.filter(c => c.category === 'data-science').length },
    { id: 'mobile', name: 'Mobile Dev', count: courses.filter(c => c.category === 'mobile').length },
  ];

  const filteredCourses = courses.filter(course => {
    if (selectedCategory !== 'all' && course.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (priceRange !== 'all') {
      if (priceRange === 'low' && course.price > 1500) return false;
      if (priceRange === 'medium' && (course.price <= 1500 || course.price > 5000)) return false;
      if (priceRange === 'high' && course.price <= 5000) return false;
    }
    
    return true;
  });

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleEnroll = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    navigate('/student-login');
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] border shadow-2xl ${
                theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className={`p-2 rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-full overflow-y-auto custom-scrollbar">
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Image & Quick Info */}
                  <div className="lg:w-2/5 relative">
                    <div className="sticky top-0 h-[300px] lg:h-[600px]">
                      <img
                        src={selectedCourse.image}
                        alt={selectedCourse.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-8 left-8 right-8 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {selectedCourse.category === 'frontend' ? 'Developments' : selectedCourse.category.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                            <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                            <span className="text-[10px] font-black text-white">{selectedCourse.rating}</span>
                          </div>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight italic uppercase">
                          {selectedCourse.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="lg:w-3/5 p-8 lg:p-12 space-y-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Duration</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-bold">{selectedCourse.duration.split(' + ')[0]}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Projects</p>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-bold">{selectedCourse.projects} Real Projects</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Certification</p>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-bold">Industry Recognized</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">Program Overview</h3>
                      <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedCourse.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">What you'll master</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCourse.technologies.map((tech, i) => (
                          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
                            theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'
                          }`}>
                            <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-xs font-bold">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">Curriculum</h3>
                        <div className="space-y-4">
                          {selectedCourse.modules.map((module, i) => (
                            <div key={i} className={`p-6 rounded-2xl border ${
                              theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-black italic uppercase tracking-tight">{module.title}</h4>
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-md">{module.duration}</span>
                              </div>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                {module.topics.map((topic, j) => (
                                  <li key={j} className="flex items-start gap-2 text-[11px] text-gray-500">
                                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assignments Section */}
                    {normalizeCourseKey(selectedCourse.id) && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">Practical Assignments</h3>
                          <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getAssignmentDefinitions(normalizeCourseKey(selectedCourse.id) || '').map((assignment, i) => (
                            <div key={assignment.id} className={`flex items-center gap-4 p-4 rounded-2xl border group/assign transition-all duration-300 ${
                              theme === 'dark' 
                                ? 'bg-zinc-900/50 border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5' 
                                : 'bg-gray-50 border-gray-100 hover:border-blue-500/30 hover:bg-blue-500/5'
                            }`}>
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                theme === 'dark' ? 'bg-white/5 text-gray-400 group-hover/assign:text-blue-500' : 'bg-white text-gray-400 group-hover/assign:text-blue-500 shadow-sm'
                              }`}>
                                <ClipboardList className="w-5 h-5" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assignment {i + 1}</p>
                                <p className="text-xs font-black italic uppercase tracking-tight">{assignment.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Program Investment</p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl font-black tracking-tighter text-blue-500">₹{selectedCourse.price.toLocaleString()}</span>
                          {selectedCourse.originalPrice && (
                            <span className="text-lg text-gray-500 line-through font-bold">₹{selectedCourse.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4 w-full md:w-auto">
                        <button 
                          onClick={(e) => handleEnroll(e, selectedCourse.id)}
                          className="flex-1 md:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 group"
                        >
                          <Zap className="w-4 h-4 fill-white" />
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation - Glassmorphic Floating Island */}
      <div className="hidden lg:block w-[22rem] relative flex-shrink-0">
        <aside className={`fixed top-24 left-8 bottom-8 w-72 border transition-all duration-300 rounded-[2.5rem] overflow-hidden z-20 ${
          theme === 'dark' 
            ? 'bg-zinc-900/60 border-white/20 backdrop-blur-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)]' 
            : 'bg-white/80 border-gray-200 backdrop-blur-xl shadow-xl'
        } flex flex-col`}>
          <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
          <div className="p-8 space-y-8 overflow-y-auto relative z-10 custom-scrollbar">
            {/* Subject Filter */}
            <div className="space-y-4">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Category
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="peer appearance-none w-4 h-4 border-2 rounded-full border-zinc-700 checked:border-blue-500 transition-all cursor-pointer"
                      />
                      <div className="absolute w-2 h-2 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                    <span className={`ml-3 text-xs font-semibold transition-colors ${
                      selectedCategory === category.id
                        ? 'text-blue-500'
                        : theme === 'dark' ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'
                    }`}>
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-4">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Experience
              </h3>
              <div className="space-y-3">
                {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                  <label key={level} className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={selectedLevel === level}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="peer appearance-none w-4 h-4 border-2 rounded-full border-zinc-700 checked:border-blue-500 transition-all cursor-pointer"
                      />
                      <div className="absolute w-2 h-2 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                    <span className={`ml-3 text-xs font-semibold capitalize transition-colors ${
                      selectedLevel === level
                        ? 'text-blue-500'
                        : theme === 'dark' ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'
                    }`}>
                      {level === 'all' ? 'All Levels' : level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Price
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'all', label: 'Any Price' },
                  { value: 'low', label: 'Under ₹1,500' },
                  { value: 'medium', label: '₹1,501 - ₹5,000' },
                  { value: 'high', label: '₹5,000+' }
                ].map((price) => (
                  <label key={price.value} className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="price"
                        value={price.value}
                        checked={priceRange === price.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="peer appearance-none w-4 h-4 border-2 rounded-full border-zinc-700 checked:border-blue-500 transition-all cursor-pointer"
                      />
                      <div className="absolute w-2 h-2 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                    <span className={`ml-3 text-xs font-semibold transition-colors ${
                      priceRange === price.value
                        ? 'text-blue-500'
                        : theme === 'dark' ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'
                    }`}>
                      {price.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSelectedDuration('all');
                setPriceRange('all');
                setSearchQuery('');
              }}
              className={`w-full py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-2xl border transition-all active:scale-[0.98] ${
                theme === 'dark'
                  ? 'border-white/5 text-gray-500 hover:bg-white/5 hover:text-white'
                  : 'border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-black'
              }`}
            >
              Reset
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className={`h-16 flex-shrink-0 border-b sticky top-0 backdrop-blur-md transition-colors ${
          theme === 'dark' ? 'bg-black/50 border-white/5' : 'bg-white/50 border-gray-100'
        } flex items-center justify-between px-8 z-10`}>
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search programs..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all outline-none text-xs ${
                  theme === 'dark' ? 'bg-zinc-900/50 border-white/5 focus:border-blue-500' : 'bg-gray-100 border-transparent focus:bg-white focus:border-blue-500'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer`}>
              <History className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-8 lg:p-12">
          <div className="max-w-6xl">
            {/* Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tight italic uppercase">Courses</h1>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-blue-600 rounded-full" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {filteredCourses.length} Available Programs
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`appearance-none pl-4 pr-10 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer min-w-[180px] ${
                      theme === 'dark' ? 'bg-zinc-900/50 border-white/5 hover:border-white/20' : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option value="latest">Sort by Latest</option>
                    <option value="popular">Popular</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onClick={() => handleCourseClick(course)} 
                  onEnroll={(e) => handleEnroll(e, course.id)}
                  theme={theme} 
                />
              ))}
            </div>

            {/* No Results */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const CourseCard = ({ course, onClick, onEnroll, theme }: { course: Course; onClick: () => void; onEnroll: (e: React.MouseEvent) => void; theme: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    onClick={onClick}
    className={`group cursor-pointer rounded-3xl overflow-hidden border transition-all duration-500 ${
      theme === 'dark' ? 'bg-zinc-900/40 border-white/5 hover:border-white/20 hover:bg-zinc-900/60' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'
    }`}
  >
    <div className="relative aspect-[16/10] overflow-hidden">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-600/20">
          {course.category === 'frontend' ? 'Developments' : course.category.toUpperCase()}
        </span>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800/50 rounded-lg border border-white/5">
          <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
          <span className="text-[10px] font-black text-white">{course.rating}</span>
        </div>
      </div>

      <h3 className="text-xl font-black leading-tight group-hover:text-blue-500 transition-colors h-14 line-clamp-2 italic uppercase">
        {course.title}
      </h3>

      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <UserCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{course.instructor.split(' - ')[0]}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <History className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{course.duration.split(' + ')[0]}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-blue-500 font-black text-2xl tracking-tighter">
            ₹{course.price.toLocaleString()}
          </div>
          <button 
            onClick={onEnroll}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default Courses;
