import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface CourseModule {
  title: string;
  duration: string;
  topics: string[];
}

interface CourseAddonModule {
  title: string;
  duration: string;
  topics: string[];
}

interface CourseAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  modules: CourseAddonModule[];
  prerequisites: string[];
  note: string;
}

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  detailedDescription: string;
  technologies: string[];
  price: number;
  originalPrice?: number;
  duration: string;
  projects: number;
  modules: CourseModule[];
  prerequisites: string[];
  whatYouWillLearn: string[];
  certification?: string;
  premiumFeatures?: string[];
  addons?: CourseAddon[];
}

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const courses: Course[] = [
    {
      id: 'AI-TOOLS-MASTERY',
      title: 'A.I Tools Mastery - Professional Certification Program',
      category: 'ai',
      level: 'professional',
      description: '🏆 INDUSTRY-LEADING AI MASTERY PROGRAM | Master 50+ cutting-edge AI tools with hands-on industry projects. From DALL-E 3 & Midjourney to Claude API & enterprise automation. Includes 1-on-1 mentorship, portfolio development, job placement assistance, and lifetime access to updates.',
      detailedDescription: 'This premium 24-week professional certification program is designed for serious AI practitioners and business professionals. Master 50+ cutting-edge AI tools through hands-on industry projects, build a professional portfolio, and receive personalized mentorship from former OpenAI research scientists. Includes enterprise-grade training, job placement assistance, and lifetime access to course updates.',
      technologies: ['DALL-E 3', 'Midjourney', 'Runway ML', 'Claude API', 'n8n', 'Promptly AI', 'JSON Prompts', 'Stable Diffusion', 'Synthesia', 'Luma AI', 'Pika Labs', 'Make.com', 'Zapier'],
      price: 12000,
      originalPrice: 25000,
      duration: '24 weeks + Lifetime Access',
      projects: 12,
      certification: 'Industry-Recognized AI Tools Professional Certificate',
      premiumFeatures: [
        '🎯 1-on-1 Weekly Mentorship Sessions',
        '💼 Professional Portfolio Development',
        '🚀 Job Placement Assistance Program',
        '🔄 Lifetime Access & Course Updates',
        '🏢 Enterprise Project Simulations',
        '📊 Performance Analytics & Tracking'
      ],
      modules: [
        {
          title: 'Module 1: Professional Image Creation & Brand Design',
          duration: '4 weeks',
          topics: ['DALL-E 3 Enterprise Techniques', 'Midjourney Professional Brand Workflows', 'Stable Diffusion Custom Model Training', 'Promptly AI Advanced Optimization', 'Commercial Image Enhancement', 'Brand Identity Creation', 'Copyright & Licensing Mastery', 'Client Presentation Techniques']
        },
        {
          title: 'Module 2: Cinematic Video Production & AI Storytelling',
          duration: '4 weeks',
          topics: ['Runway ML Professional Video Generation', 'Synthesia Enterprise AI Avatars', 'Luma AI Cinematic Sequences', 'Pika Labs Advanced Animation', 'AI-Powered Video Editing', 'Professional Storytelling Techniques', 'Client Video Production', 'Video Marketing Strategies']
        },
        {
          title: 'Module 3: Advanced Animation & Motion Graphics',
          duration: '4 weeks',
          topics: ['Runway Gen-2 Professional Animation', 'Stable Video Diffusion Mastery', 'Pika Labs Motion Control', 'Advanced Motion Brush Techniques', 'Cinematic Camera Movements', 'Professional Animation Workflows', 'Client Animation Projects', 'Motion Graphics for Business']
        },
        {
          title: 'Module 4: Enterprise Data Solutions & API Mastery',
          duration: '4 weeks',
          topics: ['Advanced JSON Prompt Engineering', 'Enterprise Data Generation', 'Professional API Integration', 'Custom Schema Architecture', 'Automated Business Workflows', 'Data Quality & Validation', 'Enterprise Security Practices', 'Scalable Data Solutions']
        },
        {
          title: 'Module 5: Business Automation & AI Agent Development',
          duration: '4 weeks',
          topics: ['n8n Enterprise Automation', 'Zapier Professional Integrations', 'Make.com Advanced Business Scenarios', 'Custom AI Agent Architecture', 'Multi-Platform Enterprise Integration', 'Business Process Optimization', 'ROI-Driven Automation', 'Client Automation Solutions']
        },
        {
          title: 'Module 6: Claude AI Enterprise Implementation',
          duration: '4 weeks',
          topics: ['Claude API Enterprise Integration', 'Advanced Prompt Engineering Mastery', 'Claude Projects & Custom Artifacts', 'Enterprise Application Development', 'Scalable Claude Implementation', 'API Optimization & Cost Management', 'Security & Compliance', 'Client Solution Development']
        }
      ],
      prerequisites: ['Professional work experience', 'Basic understanding of APIs', 'Commitment to 15+ hours/week study', 'Access to high-speed internet'],
      whatYouWillLearn: [
        '🎯 Master 50+ Enterprise-Grade AI Tools & Platforms',
        '💼 Build Professional AI-Powered Business Solutions',
        '🚀 Create Scalable Enterprise Automation Workflows',
        '📊 Develop Data-Driven AI Applications with APIs',
        '🎨 Generate Professional Visual Content for Clients',
        '🤖 Design Custom AI Agents for Business Processes',
        '💰 Monetize AI Skills with Freelance & Consulting Opportunities',
        '🏆 Earn Industry-Recognized Professional Certification',
        '📈 Implement ROI-Driven AI Solutions for Enterprises',
        '🔒 Apply Enterprise Security & Compliance Best Practices'
      ],
      addons: [
        {
          id: 'vibe-coding-addon',
          title: 'Vibe Coding Mastery - Premium Addon',
          description: 'Master the art of Vibe Coding - an advanced AI-powered development methodology',
          price: 10000,
          duration: '8 weeks',
          features: [
            '🚀 Advanced AI-Powered Development Methodology',
            '⚡ Rapid Prototyping & MVP Creation Techniques',
            '🤖 Multi-AI Workflow Integration',
            '💡 Intuitive Coding Patterns & Best Practices',
            '🔧 Custom AI Agent Development',
            '📈 Enterprise-Level Vibe Coding Applications'
          ],
          modules: [
            {
              title: 'Vibe Coding Fundamentals',
              duration: '2 weeks',
              topics: ['Vibe Coding Philosophy', 'Intuitive Development', 'AI-Human Collaboration', 'Rapid Iteration']
            },
            {
              title: 'Advanced AI Integration',
              duration: '2 weeks',
              topics: ['Multi-AI Workflows', 'Custom AI Agents', 'AI Code Generation', 'Intelligent Debugging']
            },
            {
              title: 'Rapid Prototyping Mastery',
              duration: '2 weeks',
              topics: ['Speed Development', 'MVP Creation', 'Iterative Design', 'User Feedback Integration']
            },
            {
              title: 'Professional Vibe Coding',
              duration: '2 weeks',
              topics: ['Enterprise Applications', 'Team Collaboration', 'Scaling Vibe Projects', 'Industry Best Practices']
            }
          ],
          prerequisites: ['A.I Tools Mastery enrollment', 'Advanced programming knowledge', 'Experience with AI tools'],
          note: 'This premium addon extends your A.I Tools Mastery course with cutting-edge development methodologies. Available only to enrolled students.'
        }
      ]
    },
    {
      id: 'FRONTEND-BEGINNER',
      title: 'Frontend Development - Beginner',
      category: 'frontend',
      level: 'beginner',
      description: 'Master the fundamentals of web development with HTML, CSS, JavaScript, and MongoDB basics',
      detailedDescription: 'This comprehensive beginner course will take you from zero to building interactive websites. You\'ll learn the core technologies that power the modern web including HTML structure, CSS styling, JavaScript programming fundamentals, and MongoDB database basics.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'MongoDB'],
      price: 1200,
      duration: '8 weeks',
      projects: 3,
      modules: [
        {
          title: 'HTML Fundamentals',
          duration: '2 weeks',
          topics: ['HTML Structure', 'Semantic HTML', 'Forms and Input', 'HTML5 Features']
        },
        {
          title: 'CSS Styling',
          duration: '3 weeks',
          topics: ['CSS Selectors', 'Box Model', 'Flexbox', 'Grid Layout', 'Responsive Design']
        },
        {
          title: 'JavaScript Basics',
          duration: '3 weeks',
          topics: ['Variables and Data Types', 'Functions', 'DOM Manipulation', 'Event Handling']
        }
      ],
      prerequisites: ['Basic computer skills', 'No prior coding experience required'],
      whatYouWillLearn: [
        'Build responsive websites from scratch',
        'Master HTML5 semantic elements',
        'Style websites with CSS3',
        'Program with JavaScript fundamentals',
        'Create interactive web elements',
        'Deploy websites to the internet'
      ]
    },
    {
      id: 'FRONTEND-ADVANCED',
      title: 'Frontend Development - Advanced',
      category: 'frontend',
      level: 'advanced',
      description: 'Master modern frontend with MongoDB, Node.js, React, Django and similar tools — with integrated prompt engineering for Frontend Development',
      detailedDescription: 'Learn complete, in-depth frontend development with practical projects and a strong foundation across MongoDB, Node.js, React, and Django. Includes integrated prompt engineering to accelerate problem solving, prototyping, and code quality.',
      technologies: ['MongoDB', 'Node.js', 'React', 'Django', 'Prompt Engineering'],
      price: 9500,
      duration: '12 weeks',
      projects: 6,
      modules: [
        {
          title: 'Advanced React Patterns',
          duration: '3 weeks',
          topics: ['Context API', 'Custom Hooks', 'Higher-Order Components', 'Render Props']
        },
        {
          title: 'State Management',
          duration: '3 weeks',
          topics: ['Redux Toolkit', 'Zustand', 'React Query', 'Global State Patterns']
        },
        {
          title: 'Performance Optimization',
          duration: '3 weeks',
          topics: ['Code Splitting', 'Lazy Loading', 'Memoization', 'Bundle Analysis']
        },
        {
          title: 'Advanced Tooling',
          duration: '3 weeks',
          topics: ['Webpack Configuration', 'TypeScript', 'Testing Strategies', 'CI/CD']
        }
      ],
      prerequisites: ['React experience', 'Completed Frontend Intermediate or equivalent'],
      whatYouWillLearn: [
        'Architect scalable frontend applications',
        'Optimize application performance',
        'Implement advanced React patterns',
        'Lead frontend development teams',
        'Master TypeScript for large applications',
        'Set up comprehensive testing strategies'
      ]
    },
    {
      id: 'DEVOPS-BEGINNER',
      title: 'DevOps - Beginner',
      category: 'devops',
      level: 'beginner',
      description: 'Introduction to DevOps practices, version control, and basic automation',
      detailedDescription: 'Learn the fundamentals of DevOps including version control, basic automation, deployment practices, and monitoring.',
      technologies: ['Git', 'Docker', 'Linux', 'CI/CD', 'AWS'],
      price: 1000,
      duration: '8 weeks',
      projects: 4,
      modules: [
        {
          title: 'DevOps – Beginner',
          duration: '2 weeks',
          topics: ['DevOps Culture', 'Version Control with Git', 'Linux Basics', 'Command Line']
        },
        {
          title: 'Basic Automation',
          duration: '2 weeks',
          topics: ['Shell Scripting', 'Basic CI/CD', 'Automated Testing', 'Build Tools']
        },
        {
          title: 'Deployment Basics',
          duration: '2 weeks',
          topics: ['Server Management', 'Basic Docker', 'Environment Configuration']
        },
        {
          title: 'Monitoring & Logging',
          duration: '2 weeks',
          topics: ['Basic Monitoring', 'Log Management', 'Performance Metrics']
        }
      ],
      prerequisites: ['Basic programming knowledge', 'Familiarity with command line'],
      whatYouWillLearn: [
        'Understand DevOps principles and practices',
        'Set up basic CI/CD pipelines',
        'Deploy applications to cloud platforms',
        'Implement basic monitoring and logging',
        'Automate repetitive tasks',
        'Manage server environments'
      ]
    },
    {
      id: 'DEVOPS-ADVANCED',
      title: 'DevOps - Advanced',
      category: 'devops',
      level: 'advanced',
      description: 'Master advanced DevOps practices with Kubernetes and infrastructure as code',
      detailedDescription: 'Advanced DevOps course covering Kubernetes, infrastructure as code, advanced CI/CD, and enterprise-level automation.',
      technologies: ['Kubernetes', 'Terraform', 'Jenkins', 'Prometheus', 'Grafana'],
      price: 1400,
      duration: '14 weeks',
      projects: 7,
      modules: [
        {
          title: 'Container Orchestration',
          duration: '4 weeks',
          topics: ['Kubernetes Architecture', 'Pod Management', 'Services & Ingress', 'Scaling Strategies']
        },
        {
          title: 'Infrastructure as Code',
          duration: '3 weeks',
          topics: ['Terraform', 'Ansible', 'CloudFormation', 'Infrastructure Automation']
        },
        {
          title: 'Advanced CI/CD',
          duration: '4 weeks',
          topics: ['Jenkins Advanced', 'GitLab CI', 'Blue-Green Deployment', 'Canary Releases']
        },
        {
          title: 'Enterprise DevOps',
          duration: '3 weeks',
          topics: ['Security Integration', 'Compliance', 'Multi-Cloud Strategies', 'Team Scaling']
        }
      ],
      prerequisites: ['DevOps fundamentals', 'Docker experience', 'Cloud platform knowledge'],
      whatYouWillLearn: [
        'Design enterprise-level DevOps architectures',
        'Implement advanced container orchestration',
        'Automate infrastructure provisioning',
        'Lead DevOps transformation initiatives',
        'Implement security best practices',
        'Scale DevOps across organizations'
      ]
    }
  ];

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      navigate('/courses');
    }
  }, [courseId, navigate]);

  const handleEnrollNow = () => {
    navigate(`/course-enrollment/${courseId}`);
  };

  const validateReferralCode = async () => {
    if (!referralCode.trim() || !course) return;

    try {
      // Validate via faculty referral first
      const facRes = await fetch(`${BASE_URL}/api/faculty/validate-referral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: referralCode.trim(), coursePrice: course.price })
      });
      let facData: any = null; let facText = '';
      try { facData = await facRes.json(); } catch { facText = await facRes.text(); }
      
      if (facRes.ok && facData && facData.success && facData.data) {
        const savings = course.price - facData.data.finalPrice;
        setDiscountedPrice(facData.data.finalPrice);
        setDiscountApplied(true);
        alert(`Referral code applied successfully! You saved ₹${savings.toLocaleString()} (${Math.round((savings / course.price) * 100)}% off)`);
        return;
      }

      // Fallback to general referral
      const genRes = await fetch(`${BASE_URL}/api/courses/verify-referral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: referralCode.toUpperCase() })
      });
      let genData: any = null; let genText = '';
      try { genData = await genRes.json(); } catch { genText = await genRes.text(); }
      
      if (genRes.ok && genData && genData.success && genData.valid) {
        const discount = genData.discount;
        const discountValue = (course.price * discount) / 100;
        setDiscountedPrice(course.price - discountValue);
        setDiscountApplied(true);
        alert(`Referral code applied successfully! You saved ₹${discountValue.toLocaleString()} (${discount}% off)`);
      } else {
        alert('Invalid referral code');
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      alert('Error validating referral code. Please try again.');
    }
  };

  const removeDiscount = () => {
    setDiscountApplied(false);
    setDiscountedPrice(0);
    setReferralCode('');
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {course.title}
                </h1>
                
                <p className="text-xl text-gray-300 mb-6">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📚</span>
                    <span>{course.modules.length} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🚀</span>
                    <span>{course.projects} Projects</span>
                  </div>
                </div>
              </motion.div>

              {/* Course Description */}
              <motion.div
                className="mb-8 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-300 leading-relaxed">
                  {course.detailedDescription}
                </p>
              </motion.div>

              {/* Technologies */}
              <motion.div
                className="mb-8 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4">Technologies You'll Learn</h2>
                <div className="flex flex-wrap gap-3">
                  {course.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Course Modules */}
              <motion.div
                className="mb-8 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-blue-400">
                          Module {index + 1}: {module.title}
                        </h3>
                        <span className="text-sm text-gray-400">{module.duration}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {module.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex items-center gap-2 text-gray-300">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span className="text-sm">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Prerequisites */}
              <motion.div
                className="mb-8 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      {prereq}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* What You'll Learn */}
              <motion.div
                className="mb-8 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Premium Addons */}
              {course.addons && course.addons.length > 0 && (
                <motion.div
                  className="mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-purple-400">🚀 Premium Course Addons</h2>
                  <div className="space-y-6">
                    {course.addons.map((addon, index) => (
                      <div key={index} className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-purple-300 mb-2">{addon.title}</h3>
                            <p className="text-gray-300 mb-3">{addon.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>⏱️ {addon.duration}</span>
                              <span>💰 ₹{addon.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Addon Features */}
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-purple-400 mb-3">What's Included:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {addon.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-start gap-2 text-gray-300">
                                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Addon Modules */}
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-purple-400 mb-3">Addon Curriculum:</h4>
                          <div className="space-y-3">
                            {addon.modules.map((module, moduleIndex) => (
                              <div key={moduleIndex} className="border border-purple-500/20 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-md font-semibold text-purple-300">
                                    {module.title}
                                  </h5>
                                  <span className="text-xs text-gray-400">{module.duration}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                  {module.topics.map((topic, topicIndex) => (
                                    <div key={topicIndex} className="flex items-center gap-2 text-gray-400">
                                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                      <span className="text-xs">{topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Addon Note */}
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                          <p className="text-sm text-purple-200">
                            💡 <strong>Note:</strong> {addon.note}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-24 bg-gray-900/50 border border-gray-700 rounded-2xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-green-400">
                      ₹{course.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    One-time payment • Lifetime access
                  </div>
                </div>

                {/* Course Info */}
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Level</span>
                    <span className="text-white capitalize">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Projects</span>
                    <span className="text-white">{course.projects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Modules</span>
                    <span className="text-white">{course.modules.length}</span>
                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleEnrollNow}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Enroll Now
                </button>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="font-semibold mb-3">What's Included:</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Lifetime access to course content
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {course.projects} hands-on projects
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      24/7 community support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Regular content updates
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Complete Purchase</h3>
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Course Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">{course.title}</h4>
                
                {/* Pricing Display */}
                {discountApplied && course.id !== 'ai-tools-mastery' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Original Price:</span>
                      <span className="font-bold line-through text-gray-500">
                        ₹{course.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Discounted Price:</span>
                      <span className="font-bold text-green-400 text-xl">
                        ₹{discountedPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 text-sm font-medium">You Save:</span>
                        <span className="text-green-400 font-bold">
                          ₹{(course.price - discountedPrice).toLocaleString()} 
                          ({Math.round(((course.price - discountedPrice) / course.price) * 100)}% OFF)
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Course Price:</span>
                    <span className="font-bold text-green-400 text-xl">
                      ₹{course.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Referral Code Section - Hidden for A.I Tools Mastery; show no-offer note instead */}
              {course.id !== 'ai-tools-mastery' ? (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-medium">Have a referral code?</label>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                      60% OFF
                    </span>
                  </div>
                  
                  {!discountApplied ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Enter referral code"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={validateReferralCode}
                        disabled={!referralCode.trim() || isValidatingCode}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {isValidatingCode ? '...' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-white">Code "{referralCode}" applied!</span>
                      </div>
                      <button
                        onClick={removeDiscount}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4">
                  <p className="text-yellow-300 text-sm">
                    No offers available for A.I Tools Mastery - Professional Certification Program.
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-400">
                    ₹{(course.id === 'ai-tools-mastery' ? course.price : (discountApplied ? discountedPrice : course.price)).toLocaleString()}
                  </span>
                </div>
                {discountApplied && course.id !== 'ai-tools-mastery' && (
                  <div className="text-sm text-green-400 text-right mt-1">
                    You saved ₹{(course.price - discountedPrice).toLocaleString()}!
                  </div>
                )}
              </div>

              {/* QR Code Payment Section */}
              <div className="mb-6 text-center">
                <h4 className="text-lg font-semibold text-white mb-3">Scan QR Code to Pay</h4>
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <img 
                    src="/img/qr.png" 
                    alt="Payment QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-300 text-sm">
                    Scan the QR code above with your UPI app to make the payment of{' '}
                    <span className="text-green-400 font-semibold text-lg">
                      ₹{(course.id === 'ai-tools-mastery' ? course.price : (discountApplied ? discountedPrice : course.price)).toLocaleString()}
                    </span>
                  </p>
                  {discountApplied && referralCode && course.id !== 'ai-tools-mastery' && (
                    <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 text-green-300 text-sm">
                      🎉 <strong>Referral Code Applied:</strong> {referralCode}
                      <br />
                      💰 <strong>You're saving:</strong> ₹{(course.price - discountedPrice).toLocaleString()}
                      <br />
                      ⚡ <strong>Offer Price:</strong> ₹{discountedPrice.toLocaleString()} (instead of ₹{course.price.toLocaleString()})
                    </div>
                  )}
                  <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3 text-blue-300 text-sm">
                    📱 <strong>Payment Instructions:</strong>
                    <br />
                    1. Open any UPI app (PhonePe, Google Pay, Paytm, etc.)
                    <br />
                    2. Scan the QR code above
                    <br />
                    3. Enter the exact amount: ₹{(course.id === 'ai-tools-mastery' ? course.price : (discountApplied ? discountedPrice : course.price)).toLocaleString()}
                    <br />
                    4. Complete the payment and copy the transaction ID
                  </div>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your transaction ID after payment (e.g., 123456789012)"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="mt-2 space-y-1">
                  <p className="text-gray-400 text-xs">
                    📋 Enter the transaction ID you received after making the payment
                  </p>
                  <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-2 text-yellow-300 text-xs">
                    {course.id !== 'ai-tools-mastery' && (
                      <>
                        ⚠️ <strong>Important:</strong> Your referral code will be validated during payment verification.
                        <br />
                      </>
                    )}
                    🕒 Course access will be granted within 24 hours after payment confirmation.
                    <br />
                    📚 Once confirmed, the course will appear in your "My Courses" tab.
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={async () => {
                  try {
                    // Validate transaction ID
                    if (!transactionId.trim()) {
                      alert('Please enter a transaction ID');
                      return;
                    }

                    // Get student info from localStorage
                    const studentData = localStorage.getItem('currentUser');
                    if (!studentData) {
                      alert('Please log in to enroll in courses');
                      navigate('/login');
                      return;
                    }

                    const student = JSON.parse(studentData);
                    // For A.I Tools Mastery, always use original price (no referral codes)
                    const finalPrice = course.id === 'ai-tools-mastery' ? course.price : (discountApplied ? discountedPrice : course.price);
                    const isAIToolsMastery = course.id === 'ai-tools-mastery';

                    setIsValidatingCode(true);

                    // Submit payment details to backend
                    const paymentResponse = await fetch(`${BASE_URL}/api/payments`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        transactionId: transactionId.trim(),
                        courseId: course.id,
                        studentId: student.email,
                        amount: finalPrice,
                        referralCode: isAIToolsMastery ? null : (discountApplied ? referralCode : null),
                        originalPrice: course.price,
                        discountApplied: isAIToolsMastery ? false : discountApplied,
                        savings: isAIToolsMastery ? 0 : (discountApplied ? (course.price - finalPrice) : 0),
                        studentName: student.name,
                        studentEmail: student.email,
                        courseName: course.title
                      })
                    });

                    if (paymentResponse.ok) {
                      const result = await paymentResponse.json();
                      if (result.success) {
                        // Show success message
                        const successMessage = `Payment submitted successfully! Your course will be listed in "My Courses" tab within 24 hours after payment confirmation. Transaction ID: ${transactionId}`;
                        alert(successMessage);
                        
                        // Close payment modal and redirect
                        setShowPayment(false);
                        setTransactionId('');
                        navigate('/student-portal');
                      } else {
                        alert(result.message || 'Failed to submit payment. Please try again.');
                      }
                    } else {
                      const errorData = await paymentResponse.json();
                      alert(errorData.message || 'Failed to submit payment. Please try again.');
                    }
                  } catch (error) {
                    console.error('Payment submission error:', error);
                    alert('Error submitting payment. Please try again.');
                  } finally {
                    setIsValidatingCode(false);
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isValidatingCode || !transactionId.trim()}
              >
                {isValidatingCode ? 'Submitting...' : 'Submit Payment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;