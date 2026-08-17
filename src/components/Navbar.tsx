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

const SERVICES_DROPDOWN_TRANSLATIONS: Record<string, string[]> = {
  en: [
    "Digital Product Development",
    "AI & Business Automation",
    "Cloud & Infrastructure",
    "24/7 Support",
    "Digital Business analyst",
    "E-Commerce",
    "Education & Career",
    "Learning & Training Software Solutions",
    "Interior & Space Design",
    "Global Trade & Commerce (Upcoming)"
  ],
  hi: [
    "डिजिटल उत्पाद विकास",
    "एआई और व्यावसायिक स्वचालन",
    "क्लाउड और इन्फ्रास्ट्रक्चर",
    "24/7 सहायता",
    "डिजिटल बिजनेस विश्लेषक",
    "ई-कॉमर्स",
    "शिक्षा और कैरियर",
    "प्रायोगिक शिक्षण और प्रशिक्षण",
    "इंटीरियर और स्पेस डिज़ाइन",
    "वैश्विक व्यापार (आगामी)"
  ],
  kn: [
    "ಡಿಜಿಟಲ್ ಉತ್ಪನ್ನ ಅಭಿವೃದ್ಧಿ",
    "ಎಐ ಮತ್ತು ವ್ಯವಹಾರ ಯಾಂತ್ರೀಕರಣ",
    "ಕ್ಲೌಡ್ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ",
    "24/7 ಸಹಾಯ",
    "ಡಿಜಿಟಲ್ ವ್ಯವಹಾರ ವಿಶ್ಲೇಷಕ",
    "ಇ-ಕಾಮರ್ಸ್",
    "ಶಿಕ್ಷಣ och ವೃತ್ತಿಜೀವನ",
    "ತರಬೇತಿ ಮತ್ತು ಶಿಕ್ಷಣ ಸಾಫ್ಟ್‌ವೇರ್",
    "ಇಂಟೀರಿಯರ್ ಮತ್ತು ಸ್ಪೇಸ್ ಡಿಸೈನ್",
    "ಜಾಗತಿಕ ವ್ಯಾಪาร (ಮುಂಬರುವ)"
  ],
  ar: [
    "تطوير المنتجات الرقمية",
    "الذكاء الاصطناعي وأتمتة الأعمال",
    "السحابة والبنية التحتية",
    "دعم فني 24/7",
    "محلل الأعمال الرقمية",
    "التجارة الإلكترونية",
    "التعليم والمهنة",
    "برمجيات التدريب والتعليم",
    "التصاميم الداخلية والمساحات",
    "التجارة العالمية (قريباً)"
  ],
  'zh-CN': [
    "数字化产品开发",
    "人工智能与业务自动化",
    "云计算与基础设施",
    "24/7 支持",
    "数字化业务分析师",
    "电子商务",
    "教育与职业",
    "学习与培训软件",
    "室内与空间设计",
    "全球贸易与商业 (即将推出)"
  ],
  fr: [
    "Développement de Produits Numériques",
    "IA & Automatisation Commerciale",
    "Cloud & Infrastructure",
    "Support Informatique 24/7",
    "Analyste d'Affaires Numériques",
    "Commerce Électronique",
    "Éducation & Carrière",
    "Solutions d'Apprentissage & Formation",
    "Design d'Intérieur & d'Espace",
    "Commerce Global (À venir)"
  ],
  de: [
    "Digitale Produktentwicklung",
    "KI & Geschäftsautomatisierung",
    "Cloud & Infrastruktur",
    "24/7 IT-Support",
    "Digitaler Business Analyst",
    "E-Commerce",
    "Bildung & Karriere",
    "Lern- & Schulungssoftware",
    "Innen- & Raumdesign",
    "Welthandel & Commerce (In Kürze)"
  ],
  pt: [
    "Desenvolvimento de Produtos Digitais",
    "IA e Automação de Negócios",
    "Nuvem e Infraestrutura",
    "Suporte de TI 24/7",
    "Analista de Negócios Digitais",
    "Comércio Eletrônico",
    "Educação e Carreira",
    "Software de Aprendizado e Treinamento",
    "Design de Interiores e Espaços",
    "Comércio Global (Em breve)"
  ],
  es: [
    "Desarrollo de Productos Digitales",
    "IA y Automatización de Negocios",
    "Nube e Infraestructura",
    "Soporte de TI 24/7",
    "Analista de Negocios Digitales",
    "Comercio Electrónico",
    "Educación y Carrera",
    "Software de Aprendizaje y Capacitación",
    "Diseño de Interiores y Espacio",
    "Comercio Global (Próximamente)"
  ],
  th: [
    "การพัฒนาผลิตภัณฑ์ดิจิทัล",
    "เอไอและการจัดการอัตโนมัติของธุรกิจ",
    "คลาวด์และโครงสร้างพื้นฐาน",
    "ฝ่ายสนับสนุนด้านไอที 24/7",
    "นักวิเคราะห์ธุรกิจดิจิทัล",
    "อีคอมเมิร์ซ",
    "การศึกษาและอาชีพ",
    "โซลูชันซอฟต์แวร์การเรียนรู้และฝึกอบรม",
    "การออกแบบภายในและพื้นที่",
    "การค้าระดับโลก (เร็วๆ นี้)"
  ]
};

const SEARCHABLE_ITEMS = [
  // Services
  { name: "Digital Product Development", type: "Service", href: "/#services" },
  { name: "AI & Business Automation", type: "Service", href: "/#services" },
  { name: "Cloud & Infrastructure", type: "Service", href: "/#services" },
  { name: "24/7 Support", type: "Service", href: "/#services" },
  { name: "Digital Business Analyst", type: "Service", href: "/#services" },
  { name: "E-Commerce", type: "Service", href: "/#services" },
  { name: "Education & Career Solutions", type: "Service", href: "/student-page" },
  { name: "Learning & Training Software Solutions", type: "Service", href: "/student-page" },
  { name: "Interior & Space Design", type: "Service", href: "/#services" },
  { name: "Global Trade & Commerce (Upcoming)", type: "Service", href: "#" },
  
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

  // Monitor scroll for glassmorphic navbar effect (completely transparent while in Hero section)
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
        // Subpage: apply glassmorphism on normal scroll threshold
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

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Language selector keyboard handlers
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
  const dropdownServices = SERVICES_DROPDOWN_TRANSLATIONS[language] || SERVICES_DROPDOWN_TRANSLATIONS['en'];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      className="relative py-4"
                      onMouseEnter={() => setServicesHovered(true)}
                      onMouseLeave={() => setServicesHovered(false)}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`text-xs tracking-widest font-medium uppercase transition-colors duration-200 ${
                          theme === 'dark' ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'
                        }`}
                      >
                        {item.name}
                      </a>
                      
                      {/* Services Dropdown */}
                      <AnimatePresence>
                        {servicesHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className={`absolute top-full mt-2 w-[480px] backdrop-blur-xl border rounded-2xl p-4 shadow-2xl z-[9999] grid grid-cols-2 gap-2 text-left ${
                              theme === 'dark' 
                                ? 'bg-black/95 border-white/10' 
                                : 'bg-white/95 border-gray-200'
                            } ${
                              dir === 'rtl' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
                            }`}
                          >
                            {dropdownServices.map((service, sIdx) => {
                              const isUpcoming = sIdx === 9;
                              const isEducation = sIdx === 6 || sIdx === 7;
                              const targetHref = isEducation ? '/student-page' : '/#services';
                              
                              return (
                                <a
                                  key={sIdx}
                                  href={targetHref}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setServicesHovered(false);
                                    if (isUpcoming) {
                                      const chatBtn = document.querySelector('button[aria-label="Chat with Blu"]');
                                      if (chatBtn instanceof HTMLButtonElement) {
                                        chatBtn.click();
                                      }
                                      return;
                                    }
                                    if (isEducation) {
                                      navigate('/student-page');
                                    } else {
                                      if (location.pathname === '/') {
                                        const element = document.getElementById('services');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                      } else {
                                        navigate('/#services');
                                      }
                                    }
                                  }}
                                  className={`p-2 rounded-lg border border-transparent hover:bg-cyan-500/10 transition ${
                                    theme === 'dark' ? 'hover:border-white/5' : 'hover:border-black/5'
                                  } ${
                                    dir === 'rtl' ? 'text-right' : 'text-left'
                                  }`}
                                >
                                  <span className={`text-[11px] font-bold block ${
                                    isUpcoming 
                                      ? 'text-gray-500 font-mono' 
                                      : theme === 'dark'
                                        ? 'text-gray-300 hover:text-cyan-400' 
                                        : 'text-gray-700 hover:text-cyan-600'
                                  }`}>
                                    {service}
                                  </span>
                                </a>
                              );
                            })}
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
                    className={`text-xs tracking-widest font-medium uppercase transition-colors duration-200 py-4 ${
                      theme === 'dark' ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>

            {/* Right Section: Search & Language Dropdown */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Search Icon (Triggers functional search overlay) */}
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
                      theme === 'dark' ? 'bg-black/95 border-white/10' : 'bg-white border-gray-200'
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
            {navItems.map((item) => (
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
            ))}
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