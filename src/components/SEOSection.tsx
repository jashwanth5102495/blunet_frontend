import React from 'react';
import { motion } from 'framer-motion';
import { Users, Code, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SEOSection = () => {
  const navigate = useNavigate();

  const contentBoxes = [
    {
      title: "Software Solutions",
      description: "Custom web applications, mobile apps, and enterprise software solutions tailored to your business needs.",
      icon: <Code className="w-8 h-8" />,
      gradient: "from-blue-500 to-cyan-500",
      features: ["Web Development", "Mobile Apps", "Enterprise Solutions", "API Integration"],
      link: "/#services"
    },
    {
      title: "About Us",
      description: "Leading IT services company specializing in software development, cybersecurity, cloud solutions, and AI-powered applications.",
      icon: <Award className="w-8 h-8" />,
      gradient: "from-purple-500 to-pink-500",
      features: ["10+ Years Experience", "Expert Team", "Quality Assurance", "24/7 Support"],
      link: "/about"
    },
    {
      title: "Student Training",
      description: "Comprehensive training programs in web development, cybersecurity, data science, and emerging technologies.",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-green-500 to-emerald-500",
      features: ["Live Projects", "Industry Mentors", "Certification", "Job Assistance"],
      link: "/student-page"
    }
  ];

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contentBoxes.map((box, index) => (
            <motion.div
              key={box.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => {
                if (box.link.startsWith('/')) {
                  navigate(box.link);
                } else {
                  window.location.href = box.link;
                }
              }}
            >
              <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 transition-all duration-300 group-hover:scale-[1.02] shadow-2xl">
                <div className={`w-16 h-16 bg-gradient-to-r ${box.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {box.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {box.title}
                </h3>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {box.description}
                </p>
                
                <div className="space-y-2">
                  {box.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-300">
                      <div className={`w-2 h-2 bg-gradient-to-r ${box.gradient} rounded-full mr-3`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Learn More</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SEO Keywords Section (Hidden but helps with indexing) */}
        <div className="sr-only">
          <h2>BluNet IT Services - Leading Software Development Company in Bangalore</h2>
          <p>
            Software development, web application development, mobile app development, 
            cybersecurity services, cloud solutions, AI-powered applications, 
            student training programs, IT consulting, digital transformation, 
            enterprise software solutions, API development, database management, 
            UI/UX design, quality assurance testing, DevOps services, 
            Bangalore IT company, Karnataka software services, India technology solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SEOSection;