import React, { useState } from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../contexts/ThemeContext";

const integrations = [
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://cdn-icons-png.flaticon.com/512/174/174857.png", // LinkedIn
  "https://cdn-icons-png.flaticon.com/512/2111/2111615.png", // Slack
  "https://cdn-icons-png.flaticon.com/512/174/174872.png", // Spotify
  "https://cdn-icons-png.flaticon.com/512/733/733547.png", // Facebook
  "https://cdn-icons-png.flaticon.com/512/5968/5968381.png", // Stripe
  "https://cdn-icons-png.flaticon.com/512/174/174855.png", // Instagram
  "https://cdn-icons-png.flaticon.com/512/888/888853.png", // Dropbox
  "https://cdn-icons-png.flaticon.com/512/906/906324.png", // Jira
  "https://ruixen.com/ruixen_dark.png",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://cdn-icons-png.flaticon.com/512/5968/5968705.png", // Square
  "https://cdn-icons-png.flaticon.com/512/732/732218.png", // Shopify
  "https://cdn-icons-png.flaticon.com/512/5968/5968755.png", // Zapier
  "https://cdn-icons-png.flaticon.com/512/5968/5968520.png", // Google Drive
  "https://cdn-icons-png.flaticon.com/512/1384/1384060.png", // YouTube
  "https://cdn-icons-png.flaticon.com/512/5968/5968885.png", // Airtable
  "https://cdn-icons-png.flaticon.com/512/2111/2111370.png", // Discord
];

export default function IntegrationsSection() {
  const { t, dir } = useTranslation();
  const { theme } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className={`w-full py-20 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'
    }`} dir={dir}>
      <section className={`max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/10 bg-black' : 'border-gray-200 bg-white shadow-xl'
      }`}>
        {/* Left Side */}
        <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
          <p className="uppercase text-xs font-black tracking-widest text-cyan-400 font-mono">
            {t('solutions.badge')}
          </p>
          <h2 className={`text-3xl md:text-5xl font-black mt-3 mb-5 leading-tight font-poppins uppercase ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            {t('solutions.title')}
          </h2>
          <p className={`mb-8 text-base md:text-lg leading-relaxed font-sora ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('solutions.description')}
          </p>
          <div className="flex">
            <Button 
              variant="outline" 
              className={`px-6 py-3 rounded-full font-bold font-mono tracking-widest text-xs uppercase bg-transparent cursor-pointer border ${
                theme === 'dark' 
                  ? 'border-white/20 text-white hover:bg-white/10' 
                  : 'border-black/20 text-black hover:bg-black/10'
              }`}
              onClick={() => setShowCalendar(true)}
            >
              {t('solutions.cta')} {dir === 'rtl' ? '←' : '→'}
            </Button>
          </div>
        </div>

        {/* Right Side */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {integrations.map((url, idx) => (
            <div
              key={idx}
              className={`relative w-14 h-14 md:w-16 md:h-16 p-2 shadow-sm flex items-center justify-center border transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}
              style={{
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
              }}
            >
              <img
                src={url}
                alt={`integration-${idx}`}
                className={`w-full h-full object-contain p-1.5 opacity-85 hover:opacity-100 transition-opacity ${
                  theme === 'dark' ? 'filter invert' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Calendar Modal Popup */}
      {showCalendar && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm p-4 ${
          theme === 'dark' ? 'bg-black/80' : 'bg-black/50'
        }`}>
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border rounded-2xl ${
            theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-gray-200 text-black'
          }`}>
            {/* Close button */}
            <button 
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 border border-gray-600 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <Calendar />
          </div>
        </div>
      )}
    </div>
  );
}
