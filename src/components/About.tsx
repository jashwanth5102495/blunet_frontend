import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';

const ABOUT_LOCAL_TRANSLATIONS: Record<string, {
  badge: string;
  title: string;
  desc: string;
  skillsTitle: string;
  skillsDesc: string;
  skill1: string;
  skill2: string;
  skill3: string;
  stat1: string;
  stat2: string;
  stat3: string;
  stat4: string;
  contactBtn: string;
}> = {
  en: {
    badge: "About Us",
    title: "We Always Make The Best",
    desc: "At BluNet IT Services, we are focused on productivity and creating smooth workflows that drive business success. We specialize in building modern, scalable, and user-friendly software solutions that help businesses optimize their operations and achieve seamless digital transformation.",
    skillsTitle: "Our Skills",
    skillsDesc: "We combine technical mastery, industry-leading automated pipelines, and creative design systems to build high-performance applications.",
    skill1: "Web & Mobile Development",
    skill2: "AI & Business Automation",
    skill3: "Cloud & DevOps",
    stat1: "Years Of Experience",
    stat2: "Projects Done",
    stat3: "Satisfied Clients",
    stat4: "Certified Awards",
    contactBtn: "Contact Us"
  },
  hi: {
    badge: "हमारे बारे में",
    title: "हम हमेशा सर्वश्रेष्ठ बनाते हैं",
    desc: "ब्लूनेट आईटी सर्विसेज में, हम उत्पादकता और सुचारू कार्यप्रवाह बनाने पर ध्यान केंद्रित करते हैं जो व्यावसायिक सफलता को बढ़ावा देते हैं। हम आधुनिक, स्केलेबल और उपयोगकर्ता के अनुकूल सॉफ्टवेयर समाधान बनाने में विशेषज्ञ हैं जो व्यवसायों को उनके संचालन को अनुकूलित करने और निर्बाध डिजिटल परिवर्तन प्राप्त करने में मदद करते हैं।",
    skillsTitle: "हमारा कौशल",
    skillsDesc: "हम उच्च प्रदर्शन वाले अनुप्रयोगों के निर्माण के लिए तकनीकी महारत, उद्योग-अग्रणी स्वचालित पाइपलाइनों और रचनात्मक डिजाइन प्रणालियों को जोड़ते हैं।",
    skill1: "वेब और मोबाइल विकास",
    skill2: "एआई और व्यावसायिक स्वचालन",
    skill3: "क्लाउड और डेवऑप्स",
    stat1: "वर्षों का अनुभव",
    stat2: "परियोजनाएं पूरी हुईं",
    stat3: "संतुष्ट ग्राहक",
    stat4: "प्रमाणित पुरस्कार",
    contactBtn: "संपर्क करें"
  },
  kn: {
    badge: "ನಮ್ಮ ಬಗ್ಗೆ",
    title: "ನಾವು ಯಾವಾಗಲೂ ಅತ್ಯುತ್ತมವಾದುದನ್ನು ಮಾಡುತ್ತೇವೆ",
    desc: "ಬ್ಲೂನೆಟ್ ಐಟಿ ಸಂಸ್ಥೆಯಲ್ಲಿ, ನಾವು ವ್ಯವಹಾರದ ಯಶಸ್ಸನ್ನು ಹೆಚ್ಚಿಸುವ ಸುಗಮ ಕೆಲಸದ ಹರಿವುಗಳನ್ನು ರಚಿಸುವತ್ತ ಗಮನ ಹರಿಸುತ್ತೇವೆ. ಕಂಪನಿಗಳು ತಮ್ಮ ಕಾರ್ಯಾಚರಣೆಗಳನ್ನು ಅತ್ಯುತ್ತมವಾಗಿಸಲು ಮತ್ತು ತಡೆರಹಿತ ಡಿಜಿตಲ್ ರೂಪಾಂತರವನ್ನು ಸಾಧಿಸಲು ಸಹಾಯ ಮಾಡಲು ಆಧುನಿಕ, ಸ್ಕೇಲೆಬಲ್ ಮತ್ತು ಬಳಕೆದಾರ ಸ್ನೇಹಿ ಸಾಫ್ಟ್‌ವೇರ್ ಪರಿಹಾರಗಳನ್ನು ನಿರ್ಮಿಸುವಲ್ಲಿ ನಾವು ಪರಿಣತಿ ಹೊಂದಿದ್ದೇವೆ.",
    skillsTitle: "ನಮ್ಮ ಕೌಶಲ್ಯಗಳು",
    skillsDesc: "ನಮ್ಮ ಕೌಶಲ್ಯಗಳೊಂದಿಗೆ ಉನ್ನತ-ಕಾರ್ಯಕ್ಷಮತೆಯ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ನಿರ್ಮಿಸಲು ನಾವು ತಾಂತ್ರಿการ ವಿನ್ಯಾಸ ಮತ್ತು ತಾಂತ್ರಿಕ ಪ್ರಾವೀಣ್ಯತೆಯನ್ನು ಬಳಸುತ್ತೇವೆ.",
    skill1: "ವೆಬ್ ಮತ್ತು ಮೊಬೈಲ್ ಅಭಿವೃದ್ಧಿ",
    skill2: "ಎಐ ಮತ್ತು ವ್ಯವಹಾರ ಯಾಂತ್ರೀಕರಣ",
    skill3: "ಕ್ಲೌಡ್ ಮತ್ತು ಡೆವ್‌ಆಪ್ಸ್",
    stat1: "ವರ್ಷಗಳ ಅನುಭವ",
    stat2: "ಯೋಜನೆಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ",
    stat3: "ತೃಪ್ತಿಕರ ಗ್ರಾหಕರು",
    stat4: "ಪ್ರಮಾಣೀಕೃತ ಪ್ರಶಸ್ತಿಗಳು",
    contactBtn: "ಸಂಪರ್ಕಿಸಿ"
  },
  ar: {
    badge: "من نحن",
    title: "نحن نصنع الأفضل دائماً",
    desc: "في بلو نت لخدمات تكنولوجيا المعلومات، نركز على الإنتاجية وإنشاء سير عمل سلس يدفع نجاح الأعمال. نحن متخصصون في بناء حلول برمجية حديثة وقابلة للتطوير وسهلة الاستخدام تساعد الشركات على تحسين عملياتها وتحقيق التحول الرقمي السلس.",
    skillsTitle: "مهاراتنا",
    skillsDesc: "نحن نجمع بين الإتقان التقني، وخطوط الأنابيب المؤتمتة الرائدة في الصناعة، وأنظمة التصميم الإبداعي لبناء تطبيقات عالية الأداء.",
    skill1: "تطوير الويب والهاتف المحمول",
    skill2: "الذكاء الاصطناعي وأتمتة الأعمال",
    skill3: "السحابة والعمليات السحابية",
    stat1: "سنوات من الخبرة",
    stat2: "مشاريع منجزة",
    stat3: "عملاء راضون",
    stat4: "جوائز معتمدة",
    contactBtn: "اتصل بنا"
  },
  'zh-CN': {
    badge: "关于我们",
    title: "我们始终追求卓越",
    desc: "在 BluNet IT 服务，我们专注于提高生产力并创建推动业务成功的流畅工作流。我们专注于构建现代、可扩展且用户友好的软件解决方案，帮助企业优化运营并实现无缝的数字化转型。",
    skillsTitle: "我们的技能",
    skillsDesc: "我们将技术精湛、行业领先的自动化管道和创意设计系统相结合，构建高性能应用程序。",
    skill1: "Web 和移动开发",
    skill2: "人工智能与业务自动化",
    skill3: "云计算与运维",
    stat1: "行业经验年限",
    stat2: "已完成项目数",
    stat3: "满意客户数",
    stat4: "获得行业奖项",
    contactBtn: "联系我们"
  },
  fr: {
    badge: "À Propos de Nous",
    title: "Nous faisons toujours le meilleur",
    desc: "Chez BluNet IT Services, nous nous concentrons sur la productivité et la création de flux de travail fluides qui favorisent le succès de l'entreprise. Nous sommes spécialisés dans la création de solutions logicielles modernes, évolutives et conviviales qui aident les entreprises à optimiser leurs opérations et à réaliser une transformation numérique transparente.",
    skillsTitle: "Nos Compétences",
    skillsDesc: "We combine technical mastery, industry-leading automated pipelines, and creative design systems to build high-performance applications.",
    skill1: "Développement Web & Mobile",
    skill2: "IA & Automatisation des Affaires",
    skill3: "Cloud & DevOps",
    stat1: "Années d'Expérience",
    stat2: "Projets Réalisés",
    stat3: "Clients Satisfaits",
    stat4: "Prix Certifiés",
    contactBtn: "Contactez-nous"
  },
  de: {
    badge: "Über Uns",
    title: "Wir machen immer das Beste",
    desc: "Bei BluNet IT Services konzentrieren wir uns auf Produktivität und die Erstellung reibungsloser Arbeitsabläufe, die den Geschäftserfolg vorantreiben. Wir sind darauf spezialisiert, moderne, skalierbare und benutzerfreundliche Softwarelösungen zu entwickeln, die Unternehmen dabei helfen, ihre Abläufe zu optimieren und eine nahtlose digitale Transformation zu erreichen.",
    skillsTitle: "Unsere Fähigkeiten",
    skillsDesc: "Wir kombinieren technisches Können, branchenführende automatisierte Pipelines und kreative Designsysteme, um leistungsstarke Anwendungen zu erstellen.",
    skill1: "Web- & Mobilentwicklung",
    skill2: "KI & Geschäftsautomatisierung",
    skill3: "Cloud & DevOps",
    stat1: "Jahre Erfahrung",
    stat2: "Abgeschlossene Projekte",
    stat3: "Zufriedene Kunden",
    stat4: "Zertifizierte Auszeichnungen",
    contactBtn: "Kontaktieren Sie uns"
  },
  pt: {
    badge: "Sobre Nós",
    title: "Nós sempre fazemos o melhor",
    desc: "Na BluNet IT Services, focamo-nos na produtividade e na criação de fluxos de trabalho suaves que impulsionam o sucesso empresarial. Especializamo-nos na construção de soluções de software modernas, escaláveis e fáceis de usar que ajudam as empresas a otimizar as suas operações e a alcançar uma transformação digital perfeita.",
    skillsTitle: "Nossas Habilidades",
    skillsDesc: "Combinamos domínio técnico, pipelines automatizados líderes do setor e sistemas de design criativo para criar aplicações de alto desempenho.",
    skill1: "Desenvolvimento Web e Móvel",
    skill2: "IA e Automação de Negócios",
    skill3: "Nuvem e DevOps",
    stat1: "Anos de Experiência",
    stat2: "Projetos Concluídos",
    stat3: "Clientes Satisfeitos",
    stat4: "Prêmios Certificados",
    contactBtn: "Contate-nos"
  },
  es: {
    badge: "Sobre Nosotros",
    title: "Siempre hacemos lo mejor",
    desc: "En BluNet IT Services, nos enfocamos en la productividad y en la creación de flujos de trabalho fluidos que impulsen el éxito comercial. Nos especializamos en crear soluciones de software modernas, escalables y fáciles de usar que ayuden a las empresas a optimizar sus operaciones y lograr una transformación digital perfecta.",
    skillsTitle: "Nuestras Habilidades",
    skillsDesc: "Combinamos dominio técnico, pipelines automatizados líderes en la industria y sistemas de diseño creativo para crear aplicaciones de alto rendimiento.",
    skill1: "Desarrollo Web y Móvil",
    skill2: "IA y Automatización de Negocios",
    skill3: "Nube y DevOps",
    stat1: "Años de Experiencia",
    stat2: "Proyectos Realizados",
    stat3: "Clientes Satisfechos",
    stat4: "Premios Certificados",
    contactBtn: "Contáctenos"
  },
  th: {
    badge: "เกี่ยวกับเรา",
    title: "เราสรรสร้างสิ่งที่ดีที่สุดเสมอ",
    desc: "ที่ BluNet IT Services เรามุ่งเน้นที่การเพิ่มผลผลิตและสร้างเวิร์กโฟลว์ที่ราบรื่นซึ่งขับเคลื่อนความสำเร็จของธุรกิจ เราเชี่ยวชาญในการสร้างซอฟต์แวร์โซลูชันที่ทันสมัย รองรับการขยายตัว และใช้งานง่าย ซึ่งช่วยให้ธุรกิจต่างๆ สามารถปรับปรุงการดำเนินงานและบรรลุการเปลี่ยนแปลงทางดิจิทัลได้อย่างราบรื่น",
    skillsTitle: "ทักษะของเรา",
    skillsDesc: "เราผสมผสานความเชี่ยวชาญทางเทคนิค ไพพ์ไลน์การทำงานอัตโนมัติชั้นนำของอุตสาหกรรม และระบบการออกแบบที่สร้างสรรค์เพื่อสร้างแอปพลิเคชันที่มีประสิทธิภาพสูง",
    skill1: "การพัฒนาเว็บและมือถือ",
    skill2: "เอไอและการจัดการอัตโนมัติ",
    skill3: "คลาวด์และเดฟออปส์",
    stat1: "ปีแห่งประสบการณ์",
    stat2: "โครงการที่เสร็จสิ้น",
    stat3: "ลูกค้าพึงพอใจ",
    stat4: "รางวัลการรับรอง",
    contactBtn: "ติดต่อเรา"
  }
};

const About: React.FC = () => {
  const { dir, language } = useTranslation();
  const { theme } = useTheme();

  const activeLang = ABOUT_LOCAL_TRANSLATIONS[language] || ABOUT_LOCAL_TRANSLATIONS['en'];

  const skills = [
    { name: activeLang.skill1, progress: 85 },
    { name: activeLang.skill2, progress: 90 },
    { name: activeLang.skill3, progress: 77 }
  ];

  const stats = [
    { value: "20+", label: activeLang.stat1 },
    { value: "1,000+", label: activeLang.stat2 },
    { value: "300+", label: activeLang.stat3 },
    { value: "64", label: activeLang.stat4 }
  ];

  const handleContactScroll = () => {
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="about" 
      className={`py-24 transition-colors duration-300 font-sora ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Top Section: Photo & Description Block */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Left Column: Cozy warm-lit developer double monitor image (a.webp) */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 group h-full min-h-[300px] sm:min-h-[400px]">
            <img 
              src="/a.webp" 
              alt="About BluNet Developer Workspace" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" 
            />
            {/* Subtle glow filter overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Right Column: Title Description and CTA button */}
          <div className={`flex flex-col justify-center items-start text-left ${dir === 'rtl' ? 'md:pr-6' : 'md:pl-6'}`}>
            <span className="text-cyan-400 font-mono font-bold tracking-widest text-xs uppercase mb-3 block">
              {activeLang.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins mb-6 leading-tight uppercase tracking-wide">
              {activeLang.title}
            </h2>
            <p className={`text-sm leading-relaxed mb-8 font-sora ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-655'
            }`}>
              {activeLang.desc}
            </p>
            <button
              onClick={handleContactScroll}
              className={`px-8 py-3.5 rounded-full font-bold tracking-widest text-xs uppercase transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              {activeLang.contactBtn}
            </button>
          </div>
        </div>

        {/* Bottom Section: Skills Progress Bars & Statistics Grid */}
        <div className={`grid md:grid-cols-2 gap-16 pt-16 border-t ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          
          {/* Left Column: Skills lists */}
          <div className="text-left">
            <h3 className="text-2xl font-extrabold font-poppins uppercase tracking-wider mb-4">
              {activeLang.skillsTitle}
            </h3>
            <p className={`text-sm leading-relaxed mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {activeLang.skillsDesc}
            </p>
            
            <div className="space-y-6">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold uppercase tracking-wider font-mono">
                    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{skill.name}</span>
                    <span className="text-cyan-400">{skill.progress}%</span>
                  </div>
                  {/* Outer track */}
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'
                  }`}>
                    {/* Fill */}
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Statistics Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 items-center text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <span className={`text-4xl sm:text-5xl font-black font-poppins tracking-tight block ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  {stat.value}
                </span>
                <span className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest block leading-snug ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-555'
                }`}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;