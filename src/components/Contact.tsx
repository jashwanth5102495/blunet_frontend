import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';

const Contact: React.FC = () => {
  const { t, dir } = useTranslation();
  const { theme } = useTheme();

  return (
    <div id="contact" className={`min-h-screen pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'
    }`} dir={dir}>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
            <span className="text-gray-400 text-sm">• {t('contact.badge')}</span>
          </div>
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 font-poppins ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            {t('contact.title')}
          </h1>
          <p className={`text-lg max-w-3xl mx-auto font-sora ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Headquarters and Contact Card (Matches attached mockup layout exactly) */}
        <div className={`rounded-3xl p-6 sm:p-10 border grid md:grid-cols-2 gap-10 items-stretch max-w-5xl mx-auto transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-zinc-950/60 border-white/10' 
            : 'bg-white border-gray-200 shadow-xl'
        }`}>
          
          {/* Left Column: Headquarters Details & Send an Enquiry Form */}
          <div className="flex flex-col justify-between text-left">
            <div>
              {/* Badge */}
              <div className="inline-block px-3.5 py-1 border border-cyan-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-6 font-mono">
                ✦ Our Headquarters ✦
              </div>

              {/* Title */}
              <h2 className={`text-3xl font-black font-poppins uppercase tracking-wider mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                BLUNET
              </h2>

              {/* Contact Info Subgrid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm mb-2">
                    <span className="text-xs">📍</span>
                    <span className="font-poppins uppercase tracking-widest text-[10px] font-bold">Address</span>
                  </div>
                  <p className={`text-xs sm:text-sm font-sora leading-relaxed mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    No.27, 2nd Floor, Sriranga complex 2nd Cross Road, Modi Hospital Rd, Bengaluru, Karnataka 560086
                  </p>
                  <a 
                    href="https://maps.google.com/?q=No.27,2nd%20Floor,%20Sriranga%20complex%202nd%20Cross%20Road,%20Modi%20Hospital%20Rd,%20Bengaluru,%20Karnataka%20560086"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-bold tracking-wider font-mono inline-flex items-center"
                  >
                    Open in Maps ↗
                  </a>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm mb-1">
                      <span className="text-xs">📞</span>
                      <span className="font-poppins uppercase tracking-widest text-[10px] font-bold">Phone</span>
                    </div>
                    <a 
                      href="tel:+918328246413"
                      className={`text-xs sm:text-sm font-mono block hover:text-cyan-400 transition-colors ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      +91 83282 46413
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm mb-1">
                      <span className="text-xs">✉️</span>
                      <span className="font-poppins uppercase tracking-widest text-[10px] font-bold">Email</span>
                    </div>
                    <a 
                      href="mailto:support@blunetitservices.in"
                      className={`text-xs sm:text-sm font-mono block hover:text-cyan-400 transition-colors ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      support@blunetitservices.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Grid Separator line */}
              <div className={`border-t mb-6 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}></div>
            </div>

            {/* enquiry Form */}
            <div>
              <h3 className={`text-lg font-bold uppercase tracking-wider mb-4 font-poppins ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Send an Enquiry
              </h3>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const nameInput = form.elements.namedItem('contactName') as HTMLInputElement;
                  const phoneInput = form.elements.namedItem('contactPhone') as HTMLInputElement;
                  const messageInput = form.elements.namedItem('contactMessage') as HTMLTextAreaElement;

                  const name = nameInput.value.trim();
                  const phone = phoneInput.value.trim();
                  const message = messageInput.value.trim();

                  if (!name || !message) {
                    alert("Please fill in your name and message.");
                    return;
                  }

                  const text = `Hi! I want to start a project with BluNet IT Services.\n\nName: ${name}\nPhone: ${phone || 'Not provided'}\nMessage: ${message}`;
                  window.open(`https://wa.me/918328246413?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    name="contactName"
                    type="text" 
                    required
                    placeholder="Your Name"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sora border ${
                      theme === 'dark' 
                        ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-600' 
                        : 'bg-white border-gray-300 text-black placeholder-gray-400'
                    } ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                  />
                  <input 
                    name="contactPhone"
                    type="text" 
                    placeholder="Phone Number"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sora border ${
                      theme === 'dark' 
                        ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-600' 
                        : 'bg-white border-gray-300 text-black placeholder-gray-400'
                    } ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                  />
                </div>

                <textarea 
                  name="contactMessage"
                  required
                  rows={3}
                  placeholder="How can we help you?"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sora resize-none border ${
                    theme === 'dark' 
                      ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-600' 
                      : 'bg-white border-gray-300 text-black placeholder-gray-400'
                  } ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                />

                <button 
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl font-bold tracking-widest text-xs uppercase transition-colors cursor-pointer font-mono flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 fill-current mr-1.5" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Send via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Google Maps Location Iframe (Matches Mockup Map styling) */}
          <div className="rounded-2xl overflow-hidden border border-white/10 min-h-[320px] shadow-lg relative h-full">
            <iframe
              src="https://maps.google.com/maps?q=No.27,2nd%20Floor,%20Sriranga%20complex%202nd%20Cross%20Road,%20Modi%20Hospital%20Rd,%20Bengaluru,%20Karnataka%20560086&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BluNet Headquarters Location Map"
            ></iframe>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;