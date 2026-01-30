import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen,
  Briefcase,
  Lightbulb,
  Star,
  Clock,
  Users,
  Award,
  TrendingUp,
  Code,
  Smartphone,
  Brain,
  Shield,
  Database,
  Cloud,
  ArrowRight,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

const Career = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [hoveredCard, setHoveredCard] = useState(null);

  const [verifyStudentId, setVerifyStudentId] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<any | null>(null);

  const handleVerify = async () => {
    const id = verifyStudentId.trim();
    if (!id) {
      setVerifyError('Please enter a valid student ID');
      setVerifyResult(null);
      return;
    }
    try {
      setVerifyLoading(true);
      setVerifyError(null);
      setVerifyResult(null);
      const res = await fetch(`${BASE_URL}/api/certificates/verify/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data?.success) {
        setVerifyResult(data.data);
      } else {
        setVerifyError(data?.message || 'No certificate found for this student ID');
      }
    } catch (e) {
      setVerifyError('Verification failed. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const stats = [
    { label: 'Students Trained', value: '500+', icon: Users },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
    { label: 'Industry Partners', value: '50+', icon: Briefcase },
    { label: 'Course Completion', value: '98%', icon: Award }
  ];

  const courses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      category: "Web Development",
      level: "Beginner to Advanced",
      description: "Master modern web development with React, Node.js, and cloud deployment.",
      duration: "12 weeks",
      projects: 8,
      price: "₹29,999",
      originalPrice: "₹49,999",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      features: ["Live Projects", "Industry Mentorship", "Job Guarantee", "24/7 Support"]
    },
    {
      id: 2,
      title: "AI & Machine Learning",
      category: "Artificial Intelligence",
      level: "Intermediate",
      description: "Build intelligent systems with Python, TensorFlow, and deep learning.",
      duration: "16 weeks",
      projects: 10,
      price: "₹39,999",
      originalPrice: "₹59,999",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      features: ["AI Projects", "Research Papers", "Industry Certification", "Career Support"]
    },
    {
      id: 3,
      title: "Mobile App Development",
      category: "Mobile Development",
      level: "Intermediate",
      description: "Create cross-platform mobile apps with React Native and Flutter.",
      duration: "14 weeks",
      projects: 6,
      price: "₹34,999",
      originalPrice: "₹54,999",
      icon: Smartphone,
      color: "from-green-500 to-teal-500",
      features: ["App Store Deploy", "UI/UX Design", "Monetization", "Portfolio Building"]
    },
    {
      id: 4,
      title: "Data Science & Analytics",
      category: "Data Science",
      level: "Beginner",
      description: "Analyze data and build predictive models with Python and SQL.",
      duration: "10 weeks",
      projects: 7,
      price: "₹27,999",
      originalPrice: "₹44,999",
      icon: Database,
      color: "from-orange-500 to-red-500",
      features: ["Real Datasets", "Visualization", "Statistical Analysis", "Industry Tools"]
    },
    {
      id: 5,
      title: "DevOps & Cloud Computing",
      category: "Cloud & DevOps",
      level: "Advanced",
      description: "Master cloud platforms, containers, and CI/CD pipelines.",
      duration: "18 weeks",
      projects: 9,
      price: "₹44,999",
      originalPrice: "₹64,999",
      icon: Cloud,
      color: "from-indigo-500 to-blue-500",
      features: ["AWS/Azure", "Docker/K8s", "Automation", "Infrastructure"]
    },
    {
      id: 6,
      title: "Cybersecurity Specialist",
      category: "Security",
      level: "Intermediate",
      description: "Learn ethical hacking, network security, and threat analysis.",
      duration: "15 weeks",
      projects: 8,
      price: "₹32,999",
      originalPrice: "₹52,999",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      features: ["Ethical Hacking", "Security Tools", "Compliance", "Incident Response"]
    }
  ];

  const internshipPrograms = [
    {
      id: 1,
      title: "Software Development Intern",
      department: "Engineering",
      duration: "3-6 months",
      stipend: "₹15,000-25,000/month",
      description: "Work on real client projects with our development team.",
      requirements: ["Basic programming knowledge", "Problem-solving skills", "Team collaboration"],
      benefits: ["Mentorship", "Certificate", "Job Opportunity", "Skill Development"]
    },
    {
      id: 2,
      title: "AI Research Intern",
      department: "Research & Development",
      duration: "4-8 months",
      stipend: "₹20,000-30,000/month",
      description: "Contribute to cutting-edge AI research and development.",
      requirements: ["Python proficiency", "ML fundamentals", "Research mindset"],
      benefits: ["Research Papers", "Conference Talks", "Industry Exposure", "Academic Credit"]
    },
    {
      id: 3,
      title: "UI/UX Design Intern",
      department: "Design",
      duration: "3-6 months",
      stipend: "₹12,000-20,000/month",
      description: "Design user experiences for web and mobile applications.",
      requirements: ["Design tools knowledge", "Creative thinking", "User empathy"],
      benefits: ["Portfolio Projects", "Design Mentorship", "Client Interaction", "Tool Access"]
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Career Overview', icon: Target },
    { id: 'courses', label: 'Training Programs', icon: BookOpen },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'verify', label: 'Verify Certificate', icon: Shield }
  ];

  const successStories = [
    {
      name: "Priya Sharma",
      role: "Full Stack Developer at TCS",
      course: "Web Development Bootcamp",
      salary: "₹8 LPA",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      testimonial: "The hands-on projects and mentorship helped me land my dream job!"
    },
    {
      name: "Rahul Kumar",
      role: "AI Engineer at Wipro",
      course: "AI & Machine Learning",
      salary: "₹12 LPA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      testimonial: "From zero AI knowledge to building production models in 4 months!"
    },
    {
      name: "Sneha Patel",
      role: "Mobile Developer at Infosys",
      course: "Mobile App Development",
      salary: "₹9 LPA",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      testimonial: "The course structure and real-world projects were game-changers!"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
              <Zap className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">Launch Your Tech Career</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              <span className="text-white">Your Future</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join India's most comprehensive tech training programs. From beginner to expert, 
              we'll guide you every step of the way to your dream career.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Learning Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('internships')}
                className="border border-purple-500 text-purple-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply for Internship
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-2 flex space-x-2 border border-gray-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-6">Why Choose BluNet IT Services for Your Career?</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  We don't just teach technology - we build careers. Our comprehensive approach ensures 
                  you're not just job-ready, but career-ready.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Target,
                    title: "Industry-Aligned Curriculum",
                    description: "Learn exactly what companies are looking for with our industry-vetted curriculum."
                  },
                  {
                    icon: Users,
                    title: "Expert Mentorship",
                    description: "Get guidance from industry professionals with 10+ years of experience."
                  },
                  {
                    icon: Briefcase,
                    title: "Job Guarantee Program",
                    description: "95% of our students get placed within 6 months of course completion."
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <Icon className="w-12 h-12 text-purple-400 mb-4" />
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Training Programs Tab */}
          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">Professional Training Programs</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Comprehensive courses designed by industry experts to make you job-ready in months, not years.
                </p>
                
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-800 rounded-2xl p-12">
                  <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Expert-Led Curriculum</h3>
                      <p className="text-gray-400 text-sm">Learn from industry professionals with 10+ years of experience</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Job-Ready Skills</h3>
                      <p className="text-gray-400 text-sm">Practical training focused on real-world applications and projects</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Industry Recognition</h3>
                      <p className="text-gray-400 text-sm">Certificates valued by top companies and hiring managers</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Career?</h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                      Our training programs are designed to bridge the gap between academic learning and industry requirements. 
                      With hands-on projects, personalized mentorship, and job placement assistance, we ensure you're not just 
                      trained but truly prepared for your dream career.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.button
                        onClick={() => navigate('/courses')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View All Programs
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.button>
                      
                      <motion.button
                        onClick={() => navigate('/contact')}
                        className="border border-purple-500 text-purple-400 px-8 py-3 rounded-lg font-semibold hover:bg-purple-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Get Consultation
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Internships Tab */}
          {activeTab === 'internships' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">Internship Opportunities</h2>
                <p className="text-xl text-gray-300 mb-8">
                  We are currently inviting applications for design internships at BluNet IT Services.
                  Build your portfolio while working on real branding and web projects.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-800 rounded-2xl p-12">
                <div className="mb-10 text-center max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold mb-3">Current Internship Openings</h3>
                  <p className="text-gray-300">
                    We have two internship openings in our creative team: Graphic Designer and Web Designer.
                    Last date to apply is <span className="text-yellow-300 font-semibold">22/01/2026</span>.
                    Interested students can mail their resume to
                    <span className="text-blue-400 font-semibold"> support@blunetitservices.in</span>.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/60 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="pr-4">
                        <h3 className="text-xl font-bold text-white mb-1">Graphic Designer Intern</h3>
                        <p className="text-sm text-gray-400">
                          Help shape the visual identity of BluNet across social media, branding and marketing assets.
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="mb-4 text-sm text-gray-300">
                      <div className="flex items-center mb-2">
                        <Clock className="w-4 h-4 text-blue-400 mr-2" />
                        <span>Internship • Flexible timings</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">What you will do</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2" />
                          <span>Design social media posts, banners and promotional creatives.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2" />
                          <span>Create graphics for web pages, presentations and internal branding.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2" />
                          <span>Collaborate with the marketing and web teams to maintain a consistent visual style.</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Preferred skills</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 mr-2" />
                          <span>Good knowledge of tools like Figma, Photoshop, Illustrator or similar.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 mr-2" />
                          <span>Strong sense of color, typography and layout.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 mr-2" />
                          <span>A small portfolio of design work or college projects.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/60 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="pr-4">
                        <h3 className="text-xl font-bold text-white mb-1">Web Designer Intern</h3>
                        <p className="text-sm text-gray-400">
                          Design modern, responsive web pages and improve the user experience of our digital products.
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Code className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="mb-4 text-sm text-gray-300">
                      <div className="flex items-center mb-2">
                        <Clock className="w-4 h-4 text-purple-400 mr-2" />
                        <span>Internship • Project based</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">What you will do</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-2" />
                          <span>Design landing pages and UI layouts for BluNet products and campaigns.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-2" />
                          <span>Work closely with developers to translate designs into responsive web experiences.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-2" />
                          <span>Contribute ideas to improve usability and visual consistency across pages.</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Preferred skills</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2" />
                          <span>Basic understanding of HTML, CSS and modern web layouts.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2" />
                          <span>Experience designing in tools like Figma, Adobe XD or similar.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2" />
                          <span>Attention to detail and an eye for clean, modern UI.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 border border-blue-500/40 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-300">
                    Last date to apply:
                    <span className="text-yellow-300 font-semibold ml-1">22/01/2026</span>.
                    Interested students can mail their resume to
                    <a
                      href="mailto:support@blunetitservices.in"
                      className="text-blue-400 font-semibold ml-1"
                    >
                      support@blunetitservices.in
                    </a>
                    . Please mention
                    <span className="text-gray-100 font-medium"> "Internship Application - Graphic Designer" </span>
                    or
                    <span className="text-gray-100 font-medium"> "Internship Application - Web Designer"</span>
                    in the subject line.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Verify Certificate Tab */}
          {activeTab === 'verify' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">Verify Certificate</h2>
                <p className="text-gray-300 mb-6">
                  Enter a student ID to verify if their certificate is officially certified by the BluNet IT Services.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                  <input
                    type="text"
                    value={verifyStudentId}
                    onChange={(e) => setVerifyStudentId(e.target.value)}
                    placeholder="Enter Student ID"
                    className="w-full sm:w-96 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                  <motion.button
                    onClick={handleVerify}
                    disabled={verifyLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {verifyLoading ? 'Verifying...' : 'Verify'}
                  </motion.button>
                </div>
                {verifyError && (
                  <div className="text-red-400 text-sm mt-3">{verifyError}</div>
                )}
              </div>

              {verifyResult && (
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-800 rounded-2xl p-6">
                  <div className="mb-4">
                    <div className="text-white text-lg font-semibold">Certificate Details</div>
                    <div className="text-white/70 text-sm">Student: {verifyResult.studentName || verifyResult.studentId}</div>
                    {verifyResult.courseTitle && (
                      <div className="text-white/70 text-sm">Course: {verifyResult.courseTitle}</div>
                    )}
                    <div className="text-green-400 text-sm mt-2">{verifyResult.message}</div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    {verifyResult.mimeType === 'application/pdf' ? (
                      <iframe
                        src={verifyResult.fileUrl}
                        title="Certificate PDF"
                        className="w-full h-[800px] bg-black rounded-lg"
                      />
                    ) : (
                      <img
                        src={verifyResult.fileUrl}
                        alt="Certificate"
                        className="max-h-[800px] w-full object-contain mx-auto rounded-lg"
                      />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Success Stories Tab */}
          {activeTab === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-6">Success Stories</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Meet our alumni who transformed their careers and are now working at top companies.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {successStories.map((story, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center mb-6">
                      <img 
                        src={story.image} 
                        alt={story.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-bold">{story.name}</h3>
                        <div className="text-blue-400 text-sm">{story.role}</div>
                        <div className="text-green-400 font-semibold">{story.salary}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-purple-400 text-sm font-medium mb-2">Course: {story.course}</div>
                    </div>
                    
                    <blockquote className="text-gray-300 italic">
                      "{story.testimonial}"
                    </blockquote>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Career;
