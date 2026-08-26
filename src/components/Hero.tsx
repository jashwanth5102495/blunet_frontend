import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import RotatingBackgrounds from './backgrounds/RotatingBackgrounds';

const SERVICE_TRANSLATIONS: Record<string, string[]> = {
  en: [
    "Digital Product Development",
    "AI & Business Automation",
    "Cloud & Infrastructure",
    "24/7 Support",
    "Digital Business analyst",
    "E-Commerce",
    "Education & Career",
    "Learning & Training Software Solutions"
  ],
  hi: [
    "डिजिटल उत्पाद विकास",
    "एआई और व्यावसायिक स्वचालन",
    "क्लाउड और इन्फ्रास्ट्रक्चर",
    "24/7 सहायता",
    "डिजिटल बिजनेस विश्लेषक",
    "ई-कॉमर्स",
    "शिक्षा और कैरियर",
    "प्रायोगिक शिक्षण और प्रशिक्षण"
  ],
  kn: [
    "ಡಿಜಿಟಲ್ ಉತ್ಪನ್ನ ಅಭಿವೃದ್ಧಿ",
    "ಎಐ ಮತ್ತು ವ್ಯವಹಾರ ಯಾಂತ್ರೀಕರಣ",
    "ಕ್ಲೌಡ್ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ",
    "24/7 ಸಹಾಯ",
    "ಡಿಜಿಟಲ್ ವ್ಯವಹಾರ ವಿಶ್ಲೇಷಕ",
    "ಇ-ಕಾಮರ್ಸ್",
    "ಶಿಕ್ಷಣ och ವೃತ್ತಿಜೀವನ",
    "ತರಬೇತಿ ಮತ್ತು ಶಿಕ್ಷಣ ಸಾಫ್ಟ್‌ವೇರ್"
  ],
  ar: [
    "تطوير المنتجات الرقمية",
    "الذكاء الاصطناعي وأتمتة الأعمال",
    "السحابة والبنية التحتية",
    "دعم فني 24/7",
    "محلل الأعمال الرقمية",
    "التجارة الإلكترونية",
    "التعليم والمهنة",
    "برمجيات التدريب والتعليم"
  ],
  'zh-CN': [
    "数字化产品开发",
    "人工智能与业务自动化",
    "云计算与基础设施",
    "24/7 支持",
    "数字化业务分析师",
    "电子商务",
    "教育与职业",
    "学习与培训软件"
  ],
  fr: [
    "Développement de Produits Numériques",
    "IA & Automatisation Commerciale",
    "Cloud & Infrastructure",
    "Support Informatique 24/7",
    "Analyste d'Affaires Numériques",
    "Commerce Électronique",
    "Éducation & Carrière",
    "Solutions d'Apprentissage & Formation"
  ],
  de: [
    "Digitale Produktentwicklung",
    "KI & Geschäftsautomatisierung",
    "Cloud & Infrastruktur",
    "24/7 IT-Support",
    "Digitaler Business Analyst",
    "E-Commerce",
    "Bildung & Karriere",
    "Lern- & Schulungssoftware"
  ],
  pt: [
    "Desenvolvimento de Produtos Digitais",
    "IA e Automação de Negócios",
    "Nuvem e Infraestrutura",
    "Suporte de TI 24/7",
    "Analista de Negócios Digitais",
    "Comércio Eletrônico",
    "Educação e Carreira",
    "Software de Aprendizado e Treinamento"
  ],
  es: [
    "Desarrollo de Productos Digitales",
    "IA y Automatización de Negocios",
    "Nube e Infraestructura",
    "Soporte de TI 24/7",
    "Analista de Negocios Digitais",
    "Comercio Electrónico",
    "Educación y Carrera",
    "Software de Aprendizaje y Capacitación"
  ],
  th: [
    "การพัฒนาผลิตภัณฑ์ดิจิทัล",
    "เอไอและการจัดการอัตโนมัติของธุรกิจ",
    "คลาวด์และโครงสร้างพื้นฐาน",
    "ฝ่ายสนับสนุนด้านไอที 24/7",
    "นักวิเคราะห์ธุรกิจดิจิทัล",
    "อีคอมเมิร์ซ",
    "การศึกษาและอาชีพ",
    "โซลูชันซอฟต์แวร์การเรียนรู้และฝึกอบรม"
  ]
};

const Hero: React.FC = () => {
  const { t, dir, language } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const langKey = (language as keyof typeof SERVICE_TRANSLATIONS) || 'en';
  const servicesList = SERVICE_TRANSLATIONS[langKey] || SERVICE_TRANSLATIONS['en'];
  const activeService = servicesList[activeIndex % servicesList.length];

  return (
    <section id="hero-section" className="bg-black min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      
      {/* Background Images (cycles across all 10 images) */}
      <RotatingBackgrounds interval={5000} onIndexChange={setActiveIndex} />

      {/* Dark filter overlay to keep the white text visible (darker bg-black/75 on mobile to dim background graphics) */}
      <div className="absolute inset-0 bg-black/75 md:bg-black/50 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 select-none w-full">
        
        {/* Two-Line Centered Header Layout (Resolving Cutoff & Aligning Center) */}
        <div 
          dir={dir}
          className="flex flex-col items-center justify-center text-center w-full select-none"
        >
          {/* Company Title (Normal/Light weight) - Center aligned and static */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-poppins uppercase text-white tracking-widest leading-none">
            {t('hero.title')}
          </h1>

          {/* Small, perfect, non-ugly horizontal divider line */}
          <div className="w-16 h-[1.5px] bg-cyan-400/80 my-4 sm:my-5 rounded-full"></div>
          
          {/* Roller container for dynamic bold service text in next line (Dynamic height on mobile to prevent clipping) */}
          <div className="min-h-[3.2em] sm:min-h-[2.8em] md:h-[1.4em] overflow-hidden relative flex items-center justify-center w-full py-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeService}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-white font-black text-xl sm:text-2xl md:text-4.5xl lg:text-5.5xl whitespace-normal break-words max-w-[90vw] leading-tight block text-center uppercase tracking-wide"
              >
                {activeService}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;