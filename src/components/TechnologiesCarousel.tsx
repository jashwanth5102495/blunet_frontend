import React from 'react';
import { LogoCloud } from "./ui/logo-cloud-2";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "../contexts/ThemeContext";

const TechnologiesCarousel: React.FC = () => {
  const { t, dir } = useTranslation();
  const { theme } = useTheme();

  return (
    <section 
      className={`py-24 relative overflow-hidden border-t transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
      }`} 
      dir={dir}
    >
      <div className="min-h-[50vh] w-full flex flex-col items-center justify-center px-4">
        <div className="relative mx-auto grid max-w-5xl w-full">
          <h2 className={`mb-16 text-center font-semibold tracking-tight text-xl md:text-3xl font-sora ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-650'
          }`}>
            {t('technologies.title1')}
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {t('technologies.title2')}
            </span>
            {t('technologies.title3')}
          </h2>

          <LogoCloud />
        </div>
      </div>
    </section>
  );
};

export default TechnologiesCarousel;
