import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Check, Globe, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' }
] as const;

const SEARCHABLE_ITEMS = [
  // Services
  { name: "Digital Product Development", type: "Service", href: "/services/digital-product-development" },
  { name: "AI & Business Automation", type: "Service", href: "/services/ai-and-business-automation" },
  { name: "Cloud & Infrastructure", type: "Service", href: "/services/cloud-and-infrastructure" },
  { name: "24/7 Support", type: "Service", href: "/services/24-7-support" },
  { name: "Digital Business Analyst", type: "Service", href: "/services/digital-business-analyst" },
  { name: "E-Commerce Solutions", type: "Service", href: "/services/e-commerce-solutions" },
  { name: "Education & Career Solutions", type: "Service", href: "/student-page" },
  { name: "Learning & Training Software Solutions", type: "Service", href: "/student-page" },
  { name: "Interior & Space Design", type: "Service", href: "/services/interior-and-space-design" },
  { name: "Global Trade & Commerce (Upcoming)", type: "Service", href: "/services/global-trade-and-commerce" },
  
  // Courses
  { name: "Frontend Development Beginner", type: "Course", href: "/courses" },
  { name: "Frontend Development Intermediate", type: "Course", href: "/courses" },
  { name: "DevOps Beginner", type: "Course", href: "/courses" },
  { name: "Networking Beginner", type: "Course", href: "/courses" },
  { name: "Networking Intermediate", type: "Course", href: "/courses" },
  { name: "Data Science Beginner", type: "Course", href: "/courses" },
  { name: "Cyber Security Beginner", type: "Course", href: "/courses" },
  { name: "Cyber Security Intermediate", type: "Course", href: "/courses" }
];

const Navbar: React.FC = () => {
  const { t, dir, language, setLanguage } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [servicesHovered, setServicesHovered] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('digitalTech');

  // Search functionality
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  // Monitor scroll for transparent navbar in Hero viewport bounds
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        if (window.scrollY > heroHeight - 80) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      } else {
        if (window.scrollY > 20) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };
    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dismiss language dropdown clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideDesktop = desktopDropdownRef.current && desktopDropdownRef.current.contains(target);
      const clickedInsideMobile = mobileDropdownRef.current && mobileDropdownRef.current.contains(target);
      
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDropdownOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % LANGUAGES.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + LANGUAGES.length) % LANGUAGES.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < LANGUAGES.length) {
        setLanguage(LANGUAGES[focusedIndex].code);
        setDropdownOpen(false);
        setFocusedIndex(-1);
      }
    }
  };

  const navItems = [
    { name: t('navbar.services'), href: '/#services' },
    { name: t('navbar.solutions'), href: '/#integrations' },
    { name: t('navbar.industries'), href: '/courses' },
    { name: t('navbar.about'), href: '/about' },
    { name: t('navbar.work'), href: '/career' },
    { name: t('navbar.contact'), href: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(href);
      }
      setIsOpen(false);
    } else {
      e.preventDefault();
      navigate(href);
      setIsOpen(false);
    }
  };

  const activeLangConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const megaMenuData: Record<string, {
    label: string;
    desc: string;
    image: string;
    features: string[];
    offerings: { name: string; desc: string; href: string }[];
  }> = {
    digitalTech: {
      label: "Digital Technologies",
      desc: "Build custom digital products, web and mobile systems optimized for scale and performance.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600&h=400",
      features: ["Custom UI/UX Design", "React & Native Mobile Stacks", "End-to-End Delivery"],
      offerings: [
        { name: "Digital Product Development", desc: "Custom web apps, SaaS dashboards, and native iOS/Android mobile apps.", href: "/services/digital-product-development" },
        { name: "Cloud & Infrastructure", desc: "Database setup, autoscaling configurations, remote servers, and DevOps pipelines.", href: "/services/cloud-and-infrastructure" },
        { name: "24/7 Support", desc: "Priority bug troubleshooting, database health checks, and server monitoring.", href: "/services/24-7-support" }
      ]
    },
    businessAutomation: {
      label: "Business Automation",
      desc: "Optimize operations, categorize data, and automate customer interactions with custom AI agents and triggers.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600&h=400",
      features: ["AI Agents & Chatbots", "Workflow Integrations", "Database Automation"],
      offerings: [
        { name: "AI & Business Automation", desc: "Custom email responders, automated data parsers, and custom AI agents.", href: "/services/ai-and-business-automation" },
        { name: "Digital Business Analyst", desc: "Strategic workflow assessments, pipeline engineering, and process consulting.", href: "/services/digital-business-analyst" },
        { name: "E-Commerce Solutions", desc: "Secure checkout flows, inventory synchronization, and customized storefronts.", href: "/services/e-commerce-solutions" }
      ]
    },
    educationCareers: {
      label: "Education & Careers",
      desc: "Unlock practical technical skills and personalized mentorship to transition into corporate roles.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600&h=400",
      features: ["Hands-on Coding Labs", "AI-assisted Workflows", "Resume & Portfolio Guidance"],
      offerings: [
        { name: "Education & Career Solutions", desc: "Personalized career roadmap planning and academic engineering project guidance.", href: "/student-page" },
        { name: "Learning & Training Software Solutions", desc: "Practical coding labs and interactive technology upskilling programs.", href: "/student-page" }
      ]
    },
    specializedDesign: {
      label: "Specialized Design",
      desc: "Create clean, functional layout spaces and interior systems for residential and commercial spaces.",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600&h=400",
      features: ["3D Blueprint Renderings", "Lighting & Spatial Layouts", "Commercial Office Setup"],
      offerings: [
        { name: "Interior & Space Design", desc: "Aesthetic conceptual spatial maps, commercial office designs, and 3D visual plans.", href: "/services/interior-and-space-design" }
      ]
    },
    globalCommerce: {
      label: "Global Commerce (Upcoming)",
      desc: "Connecting local tech innovations to global distribution pipelines and customs trade clearances.",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600&h=400",
      features: ["Cross-Border Sourcing & Logistics", "Digital Customs Documentation", "Global Supply Warehousing"],
      offerings: [
        { name: "Global Trade & Commerce", desc: "Upcoming logistics pipelines, clearance infrastructure, and global import-export support.", href: "/services/global-trade-and-commerce" }
      ]
    }
  };

  // Filter search results
  const filteredSearchItems = searchQuery.trim() === ""
    ? []
    : SEARCHABLE_ITEMS.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      <nav 
        dir={dir} 
        className={`fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-300 ${
          scrolled 
            ? theme === 'dark'
              ? 'bg-black/85 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3.5 backdrop-blur-md'
              : 'bg-white/85 border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.05)] py-3.5 backdrop-blur-md'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="/logo.png" 
                alt="BluNet" 
                className="h-10 md:h-14 w-auto object-contain hover:brightness-110 transition-all duration-300"
              />
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                if (item.href === '/#services') {
                  return (
                    <div 
                      key={item.href}
                      className="py-4"
                      onMouseEnter={() => setServicesHovered(true)}
                      onMouseLeave={() => setServicesHovered(false)}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className={`text-xs tracking-widest font-medium uppercase transition-colors duration-200 flex items-center space-x-1 cursor-pointer ${
                          theme === 'dark' ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                      </a>
                      
                      {/* Services Mega Menu (Dropdown) */}
                      <AnimatePresence>
                        {servicesHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`absolute left-0 right-0 mx-auto top-full mt-2 w-full max-w-6xl backdrop-blur-xl border rounded-[2rem] p-6 shadow-2xl z-[9999] grid grid-cols-12 gap-6 text-left ${
                              theme === 'dark' 
                                ? 'bg-black/95 border-white/10' 
                                : 'bg-white/95 border-gray-200 text-black shadow-2xl'
                            }`}
                            style={{
                              transformOrigin: "top center"
                            }}
                          >
                            {/* Col 1: Categories Sidebar */}
                            <div className={`col-span-3 border-r pr-4 flex flex-col space-y-2 ${
                              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                            }`}>
                              <h4 className={`text-[9px] font-black uppercase tracking-widest font-mono mb-4 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Categories
                              </h4>
                              {Object.keys(megaMenuData).map((catKey) => (
                                <button
                                  key={catKey}
                                  onMouseEnter={() => setActiveCategory(catKey)}
                                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] tracking-widest font-black uppercase transition-all duration-200 text-left cursor-pointer ${
                                    activeCategory === catKey
                                      ? 'bg-cyan-500 text-black shadow-md'
                                      : theme === 'dark'
                                        ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                                  }`}
                                >
                                  <span>{megaMenuData[catKey].label}</span>
                                  {activeCategory === catKey && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                                </button>
                              ))}
                            </div>

                            {/* Col 2: Services Offerings in selected category */}
                            <div className="col-span-5 px-2">
                              <h4 className="text-[9px] font-black uppercase tracking-widest font-mono text-cyan-400 mb-4">
                                {megaMenuData[activeCategory].label} Offerings
                              </h4>
                              <div className="grid grid-cols-1 gap-2.5">
                                {megaMenuData[activeCategory].offerings.map((srv, srvIdx) => (
                                  <a
                                    key={srvIdx}
                                    href={srv.href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setServicesHovered(false);
                                      if (srv.href === '/services/global-trade-and-commerce') {
                                        const chatBtn = document.querySelector('button[aria-label="Chat with Blu"]');
                                        if (chatBtn instanceof HTMLButtonElement) {
                                          chatBtn.click();
                                        }
                                        return;
                                      }
                                      navigate(srv.href);
                                    }}
                                    className={`group flex flex-col p-3.5 rounded-2xl border border-transparent transition-all duration-250 ${
                                      theme === 'dark' 
                                        ? 'hover:bg-white/5 hover:border-white/5' 
                                        : 'hover:bg-cyan-500/5 hover:border-cyan-500/10'
                                    }`}
                                  >
                                    <span className={`text-xs font-bold transition-colors ${
                                      theme === 'dark' ? 'text-white group-hover:text-cyan-400' : 'text-black group-hover:text-cyan-600'
                                    }`}>
                                      {srv.name}
                                    </span>
                                    <span className={`text-[10px] mt-1 leading-relaxed ${
                                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                      {srv.desc}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>

                            {/* Col 3: Category Spotlight / Overview */}
                            <div className={`col-span-4 border-l pl-4 flex flex-col justify-between ${
                              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                            }`}>
                              <div>
                                <h4 className={`text-[9px] font-black uppercase tracking-widest font-mono mb-3 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Category Overview
                                </h4>
                                <h3 className={`text-sm font-black tracking-wide uppercase font-poppins mb-2 ${
                                  theme === 'dark' ? 'text-white' : 'text-black'
                                }`}>
                                  {megaMenuData[activeCategory].label}
                                </h3>
                                <p className={`text-[10px] leading-relaxed mb-4 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {megaMenuData[activeCategory].desc}
                                </p>
                                
                                <div className="w-full h-24 rounded-2xl overflow-hidden border border-white/5 bg-gray-950">
                                  <img 
                                    src={megaMenuData[activeCategory].image} 
                                    alt={megaMenuData[activeCategory].label} 
                                    className="w-full h-full object-cover opacity-80 hover:scale-103 transition-all duration-300"
                                  />
                                </div>
                              </div>

                              <div className="pt-3">
                                <h5 className={`text-[8px] font-black uppercase tracking-widest font-mono mb-2 ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                  Included Features
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {megaMenuData[activeCategory].features.map((feat, fIdx) => (
                                    <span 
                                      key={fIdx} 
                                      className={`text-[9px] font-bold px-2 py-1 rounded-md border font-mono ${
                                        theme === 'dark' 
                                          ? 'bg-zinc-900 border-white/5 text-gray-300' 
                                          : 'bg-gray-100 border-gray-200 text-gray-700'
                                      }`}
                                    >
                                      {feat}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-xs tracking-widest font-medium uppercase transition-colors duration-200 ${
                      theme === 'dark' ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Search Glass icon */}
              <button 
                onClick={() => setSearchOpen(true)}
                className={`transition-colors p-2 cursor-pointer ${
                  theme === 'dark' ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'
                }`}
                aria-label={t('navbar.search')}
                title="Search website"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Login Person Icon (Beside search glass) */}
              <button 
                onClick={() => navigate('/student-page')}
                className={`transition-colors p-2 cursor-pointer ${
                  theme === 'dark' ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'
                }`}
                aria-label="Student Portal Login"
                title="Student Login"
              >
                <User className="h-4.5 w-4.5" />
              </button>

              {/* Language Selector Container */}
              <div className="relative" ref={desktopDropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onKeyDown={handleDropdownKeyDown}
                  className={`px-6 py-1.5 border bg-transparent text-xs tracking-widest font-black uppercase transition-all focus:outline-none cursor-pointer font-mono ${
                    theme === 'dark' 
                      ? 'border-white/65 text-white hover:text-cyan-400 hover:border-cyan-400/80' 
                      : 'border-black/40 text-black hover:text-cyan-600 hover:border-cyan-600/80'
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  aria-label="Select language"
                >
                  {activeLangConfig.nativeName}
                </button>

                {/* Language Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    className={`absolute mt-2 w-48 rounded-xl border shadow-2xl p-1 z-[9999] transition-all duration-200 origin-top-right ${
                      theme === 'dark' ? 'bg-black/90 border-white/10' : 'bg-white/95 border-gray-200'
                    } ${
                      dir === 'rtl' ? 'left-0' : 'right-0'
                    }`}
                    role="listbox"
                  >
                    {LANGUAGES.map((lang, index) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setDropdownOpen(false);
                          setFocusedIndex(-1);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-mono font-bold transition-colors cursor-pointer ${
                          index === focusedIndex || language === lang.code
                            ? 'bg-cyan-400 text-black'
                            : theme === 'dark'
                              ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                        }`}
                        role="option"
                        aria-selected={language === lang.code}
                      >
                        <span>{lang.nativeName}</span>
                        {language === lang.code && (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Start a Project button */}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSec = document.getElementById('contact');
                  if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/#contact');
                  }
                }}
                className="px-4 py-2 text-[10px] tracking-widest font-black uppercase text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-colors duration-200 cursor-pointer"
              >
                {t('navbar.startProject')}
              </a>

            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-3">
              
              {/* Mobile Student Login Icon */}
              <button 
                onClick={() => navigate('/student-page')}
                className={`transition-colors p-2 cursor-pointer ${
                  theme === 'dark' ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'
                }`}
                aria-label="Student Login"
              >
                <User className="h-4.5 w-4.5" />
              </button>

              {/* Mobile Language Button indicator */}
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`p-2 border text-[10px] tracking-wider uppercase font-mono rounded-lg focus:outline-none cursor-pointer ${
                    theme === 'dark' ? 'border-white/10 bg-white/5 text-gray-300' : 'border-gray-200 bg-gray-100 text-gray-700'
                  }`}
                  aria-label="Select language"
                >
                  <Globe className="h-4 w-4" />
                </button>

                {dropdownOpen && (
                  <div 
                    className={`absolute mt-2 w-40 rounded-xl border shadow-2xl p-1 z-[9999] ${
                      theme === 'dark' ? 'bg-black/95 border-white/10' : 'bg-white border-gray-200 text-black'
                    } ${
                      dir === 'rtl' ? 'left-0' : 'right-0'
                    }`}
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] tracking-wider uppercase font-mono font-bold transition-colors cursor-pointer ${
                          language === lang.code
                            ? 'bg-cyan-400 text-black'
                            : theme === 'dark'
                              ? 'text-gray-300 hover:bg-white/5'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{lang.nativeName}</span>
                        {language === lang.code && (
                          <Check className="h-3 w-3" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 focus:outline-none cursor-pointer ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer menu */}
        {isOpen && (
          <div 
            className={`md:hidden border-b px-4 pt-4 pb-6 space-y-3 ${
              theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-gray-200'
            }`}
            style={{
              animation: 'slideDown 0.3s ease-out forwards'
            }}
          >
            <style>{`
              @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            
            {/* Nav Items */}
            {navItems.map((item) => {
              if (item.href === '/#services') {
                return (
                  <div key={item.href} className="space-y-1">
                    <button
                      onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm tracking-widest font-medium uppercase rounded-lg transition-colors cursor-pointer text-left ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-cyan-400 hover:bg-white/5' 
                          : 'text-gray-755 hover:text-cyan-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {mobileServicesExpanded && (
                      <div className="pl-6 pr-2 py-2 space-y-2">
                        {Object.values(megaMenuData).flatMap(cat => cat.offerings).map((srv, srvIdx) => (
                          <a
                            key={srvIdx}
                            href={srv.href}
                            onClick={(e) => {
                              e.preventDefault();
                              setIsOpen(false);
                              if (srv.href === '/services/global-trade-and-commerce') {
                                const chatBtn = document.querySelector('button[aria-label="Chat with Blu"]');
                                if (chatBtn instanceof HTMLButtonElement) {
                                  chatBtn.click();
                                }
                                return;
                              }
                              navigate(srv.href);
                            }}
                            className={`block p-2 rounded-lg text-xs leading-relaxed transition ${
                              theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-650 hover:text-black hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-bold block">{srv.name}</span>
                            <span className="text-[10px] opacity-80 block">{srv.desc}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block px-3 py-2 text-sm tracking-widest font-medium uppercase rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-white/5' 
                      : 'text-gray-755 hover:text-cyan-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
            
            <div className={`pt-2 border-t flex flex-col space-y-3 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSec = document.getElementById('contact');
                  if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/#contact');
                  }
                  setIsOpen(false);
                }}
                className="w-full text-center px-4 py-3 text-xs tracking-widest font-black uppercase text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-colors duration-200"
              >
                {t('navbar.startProject')}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* FULL SCREEN SEARCH OVERLAY (Properly Functional Search Option) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Close search"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-full max-w-2xl mx-auto flex flex-col">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search services, courses, modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white text-lg focus:outline-none focus:border-cyan-400 font-sora shadow-lg"
                />
              </div>

              {/* Search results container */}
              <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {filteredSearchItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchOpen(false);
                      if (item.href.startsWith('/#')) {
                        const targetId = item.href.replace('/#', '');
                        if (location.pathname === '/') {
                          const element = document.getElementById(targetId);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          navigate(item.href);
                        }
                      } else {
                        navigate(item.href);
                      }
                    }}
                    className="w-full bg-zinc-900/50 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 rounded-xl p-4 flex items-center justify-between text-left transition-all cursor-pointer"
                  >
                    <div>
                      <span className="text-white font-bold block text-sm sm:text-base font-sora">{item.name}</span>
                      <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">{item.type}</span>
                    </div>
                    <span className="text-gray-500 text-xs font-mono">View →</span>
                  </button>
                ))}

                {searchQuery.trim() !== "" && filteredSearchItems.length === 0 && (
                  <p className="text-gray-500 text-center font-sora py-8">No results found for "{searchQuery}"</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;