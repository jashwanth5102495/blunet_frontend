import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  PlayIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon,
  ShoppingCartIcon,
  TrophyIcon,
  PencilIcon,
  CameraIcon,
  FilmIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

interface CreativeProject {
  id: string;
  title: string;
  category: string;
  status: string;
  progress: number;
  createdDate: string;
  completedTasks: number;
  totalTasks: number;
  nextTask: string;
  published?: boolean;
  views: number;
  likes: number;
  comments: number;
  collaborators: number;
  deadline: string;
  client: string;
  budget: string;
  illustration: string;
}

interface CreatorProfile {
  name: string;
  email: string;
  joinDate: string;
  totalProjects: number;
  completedProjects: number;
  totalEarnings: number;
  followers: number;
}

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: string;
  description?: string;
}

const CreatorPortal = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('projects');
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [creativeProjects, setCreativeProjects] = useState<CreativeProject[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  // Helper function to get project illustration based on category
  const getProjectIllustration = (category: string): string => {
    const illustrations: { [key: string]: string } = {
      'Web Design': '🎨',
      'Mobile App': '📱',
      'Brand Identity': '🏷️',
      'Video Production': '🎬',
      'Photography': '📸',
      'UI/UX Design': '✨',
      'Content Writing': '✍️',
      'Social Media': '📱',
      'Marketing Campaign': '📢',
      'E-commerce': '🛒',
      'Animation': '🎭'
    };
    return illustrations[category] || '💼';
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'projects', label: 'My Projects', icon: PencilIcon },
    { id: 'browse-gigs', label: 'Browse Gigs', icon: ShoppingCartIcon },
    { id: 'earnings', label: 'Earnings', icon: CreditCardIcon },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ];

  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      title: 'Brand Logo Design',
      time: '09:00 - 11:00 AM',
      type: 'Design Review',
      description: 'Client feedback session'
    },
    {
      id: '2', 
      title: 'Website Mockups',
      time: '02:00 - 04:00 PM',
      type: 'Design Phase',
      description: 'Homepage wireframes'
    },
    {
      id: '3',
      title: 'Video Editing',
      time: '07:00 - 09:00 PM', 
      type: 'Post Production',
      description: 'Final cut review'
    },
    {
      id: '4',
      title: 'Content Strategy',
      time: '10:00 - 12:00 PM',
      type: 'Planning',
      description: 'Social media calendar'
    },
    {
      id: '5',
      title: 'Client Meeting',
      time: '03:00 - 04:00 PM',
      type: 'Consultation', 
      description: 'Project kickoff'
    }
  ];

  useEffect(() => {
    const loadCreatorData = async () => {
      try {
        // Simulate loading creator profile
        setCreatorProfile({
          name: 'Alex Creative',
          email: 'alex@creative.com',
          joinDate: new Date().toLocaleDateString(),
          totalProjects: 24,
          completedProjects: 18,
          totalEarnings: 45000,
          followers: 1250
        });
        
        // Sample creative projects
        const sampleProjects: CreativeProject[] = [
          {
            id: 'brand-identity-startup',
            title: 'Brand Identity for Tech Startup',
            category: 'Brand Identity',
            status: 'In Progress',
            progress: 75,
            createdDate: '2024-01-15',
            completedTasks: 6,
            totalTasks: 8,
            nextTask: 'Business card design',
            published: false,
            views: 0,
            likes: 0,
            comments: 0,
            collaborators: 2,
            deadline: '2024-02-15',
            client: 'TechFlow Inc.',
            budget: '$2,500',
            illustration: getProjectIllustration('Brand Identity')
          },
          {
            id: 'ecommerce-website',
            title: 'E-commerce Website Design',
            category: 'Web Design',
            status: 'Completed',
            progress: 100,
            createdDate: '2024-01-01',
            completedTasks: 12,
            totalTasks: 12,
            nextTask: 'Project delivered',
            published: true,
            views: 1250,
            likes: 89,
            comments: 23,
            collaborators: 3,
            deadline: '2024-01-30',
            client: 'Fashion Hub',
            budget: '$4,200',
            illustration: getProjectIllustration('Web Design')
          },
          {
            id: 'mobile-app-ui',
            title: 'Fitness Mobile App UI',
            category: 'Mobile App',
            status: 'Review',
            progress: 90,
            createdDate: '2024-01-20',
            completedTasks: 9,
            totalTasks: 10,
            nextTask: 'Client approval',
            published: false,
            views: 0,
            likes: 0,
            comments: 0,
            collaborators: 1,
            deadline: '2024-02-10',
            client: 'FitLife App',
            budget: '$3,800',
            illustration: getProjectIllustration('Mobile App')
          }
        ];
        
        setCreativeProjects(sampleProjects);
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCreatorData();
  }, [navigate]);

  const handleLogout = () => {
    navigate('/student-login');
  };

  const handleContinueProject = (projectId: string) => {
    // Navigate to project workspace
  };

  const handleStartGig = (gigId: string, gigName: string, budget: string) => {
    // Handle gig application logic
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading your creative workspace...</p>
        </div>
      </div>
    );
  }

  const renderProjects = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>My Creative Projects</h2>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            New Project
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creativeProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{project.illustration}</div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'Completed' 
                      ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                      : project.status === 'In Progress'
                      ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800')
                      : (darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                  }`}>
                    {project.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{project.title}</h3>
              
              <p className={`text-sm mb-3 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Client: {project.client}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Progress</span>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{project.progress}%</span>
              </div>
              
              <div className={`w-full bg-gray-200 rounded-full h-2 mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center space-x-4">
                    <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                    <span>👥 {project.collaborators}</span>
                    <span className="font-semibold text-green-600">{project.budget}</span>
                  </div>
                </div>
              </div>
              
              {project.published && (
                <div className={`flex items-center space-x-4 mb-4 text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span>👁️ {project.views}</span>
                  <span>❤️ {project.likes}</span>
                  <span>💬 {project.comments}</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleContinueProject(project.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    project.status === 'Completed'
                      ? (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                  disabled={project.status === 'Completed'}
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>{project.status === 'Completed' ? 'View Project' : 'Continue Work'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderSchedule = () => (
    <div className={`rounded-2xl p-6 shadow-sm border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Today's Schedule</h3>
        <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
          See All
        </button>
      </div>
      <div className="space-y-4">
        {scheduleItems.map((item, index) => (
          <div key={item.id} className={`flex items-center justify-between py-3 border-b last:border-b-0 ${
            darkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="text-orange-500 font-bold text-lg">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div>
                <h4 className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{item.title}</h4>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{item.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>{item.time}</p>
              <p className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-600'
              }`}>{item.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className={`rounded-2xl p-6 shadow-sm border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>{currentMonth}</h3>
          <div className="flex space-x-2">
            <button className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}>
              <svg className={`w-4 h-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}>
              <svg className={`w-4 h-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className={`text-center text-sm font-medium py-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer ${
                day === currentDate.getDate() 
                  ? 'bg-orange-500 text-white font-medium' 
                  : day 
                    ? `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50'}` 
                    : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className={`flex items-center justify-between h-16 px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <PaintBrushIcon className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CreativeHub</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 mb-1 ${
                  activeTab === item.id
                    ? `${darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-50 text-orange-600'} border-r-2 border-orange-500`
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeTab === 'projects' ? 'My Projects' : 
                   activeTab === 'browse-gigs' ? 'Browse Gigs' :
                   activeTab === 'overview' ? 'Creative Overview' :
                   activeTab === 'earnings' ? 'Earnings & Analytics' :
                   activeTab === 'messages' ? 'Messages' : 'Creative Dashboard'}
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>January 2024</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{creatorProfile?.name || 'Alex Creative'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {renderProjects()}
              </div>
              <div className="space-y-6">
                {renderCalendar()}
                {renderSchedule()}
              </div>
            </div>
          )}
          
          {activeTab === 'browse-gigs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Available Gigs</h2>
                <div className="flex space-x-2">
                  <select className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option>All Categories</option>
                    <option>Web Design</option>
                    <option>Brand Identity</option>
                    <option>Mobile App Design</option>
                    <option>Video Production</option>
                    <option>Content Writing</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample Gig 1 */}
                <div className={`rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="text-4xl mb-4">🎨</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}>URGENT</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>2 weeks</span>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>E-commerce Website Redesign</h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Looking for a creative designer to redesign our e-commerce platform with modern UI/UX principles</p>
                  
                  <div className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Figma</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">React</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Responsive</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Remote</span>
                      <span>⭐ 4.9 Client Rating</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">$3,500</span>
                      <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fixed Price</span>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      💰 High Budget
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleStartGig('ecommerce-redesign', 'E-commerce Website Redesign', '$3,500')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Sample Gig 2 */}
                <div className={`rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="text-4xl mb-4">📱</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                    }`}>NEW</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>1 month</span>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mobile App UI Design</h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Design a modern and intuitive mobile app interface for a fitness tracking application</p>
                  
                  <div className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">Sketch</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Prototyping</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">iOS</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Remote</span>
                      <span>⭐ 4.7 Client Rating</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">$2,200</span>
                      <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fixed Price</span>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      🚀 Featured
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleStartGig('mobile-app-ui', 'Mobile App UI Design', '$2,200')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Sample Gig 3 */}
                <div className={`rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="text-4xl mb-4">🏷️</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                    }`}>ONGOING</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>3 weeks</span>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Brand Identity Package</h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Complete brand identity design including logo, business cards, letterhead, and brand guidelines</p>
                  
                  <div className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Illustrator</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Branding</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Print</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Remote</span>
                      <span>⭐ 5.0 Client Rating</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">$1,800</span>
                      <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fixed Price</span>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                      ⚡ Quick Start
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleStartGig('brand-identity', 'Brand Identity Package', '$1,800')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Projects</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{creatorProfile?.totalProjects}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PencilIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{creatorProfile?.completedProjects}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Earnings</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>${creatorProfile?.totalEarnings?.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CreditCardIcon className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Followers</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{creatorProfile?.followers?.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <StarIcon className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Projects</h3>
                  <div className="space-y-3">
                    {creativeProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center space-x-3">
                        <div className="text-2xl">{project.illustration}</div>
                        <div className="flex-1">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.client}</p>
                        </div>
                        <div className={`text-sm font-medium ${
                          project.status === 'Completed' ? 'text-green-600' :
                          project.status === 'In Progress' ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {project.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming Deadlines</h3>
                  <div className="space-y-3">
                    {creativeProjects.filter(p => p.status !== 'Completed').map((project) => (
                      <div key={project.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{project.illustration}</div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.deadline}</p>
                          </div>
                        </div>
                        <div className={`w-12 h-2 rounded-full ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Earnings & Analytics</h2>
              
              {/* Earnings Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>This Month</h3>
                  <p className="text-3xl font-bold text-green-600">$8,450</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>+12% from last month</p>
                </div>
                
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pending</h3>
                  <p className="text-3xl font-bold text-orange-600">$3,200</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>2 projects in review</p>
                </div>
                
                <div className={`rounded-2xl p-6 shadow-sm border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Available</h3>
                  <p className="text-3xl font-bold text-blue-600">$5,250</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ready to withdraw</p>
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div className={`rounded-2xl p-6 shadow-sm border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold">+</span>
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>E-commerce Website Design</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fashion Hub - Completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+$4,200</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jan 30, 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">⏳</span>
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mobile App UI Design</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>FitLife App - In Review</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">$3,800</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">🎨</span>
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Brand Identity Package</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>TechFlow Inc. - In Progress</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">$2,500</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>75% Complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Messages</h2>
              
              <div className={`rounded-2xl p-6 shadow-sm border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="text-center py-12">
                  <ChatBubbleLeftRightIcon className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Messages Yet</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your client messages will appear here</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CreatorPortal;

