import React from 'react';

const HappyClients = () => {
  const logos = [
    { name: 'Y Combinator', color: '#f26522', initial: 'Y' },
    { name: 'IIT Hyderabad', color: '#ffffff', initial: 'IIT' },
    { name: 'Postman', color: '#ff6c37', initial: 'P' },
    { name: 'Google', color: '#4285f4', initial: 'G' },
    { name: 'Microsoft', color: '#00a4ef', initial: 'M' },
    { name: 'Amazon', color: '#ff9900', initial: 'A' },
  ];

  return (
    <section className="bg-black py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <h2 className="text-2xl md:text-3xl text-gray-300 font-light">
          BluNet works with top Startups and MSMEs from
        </h2>
      </div>
      
      <div className="relative w-full overflow-hidden">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap">
          {/* First set of logos */}
          <div className="flex items-center space-x-16 mx-8">
            {logos.map((logo, index) => (
              <div key={`logo-1-${index}`} className="flex items-center space-x-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl"
                  style={{ backgroundColor: logo.color + '20', color: logo.color }}
                >
                  {logo.initial}
                </div>
                <span className="text-xl font-semibold text-gray-400">{logo.name}</span>
              </div>
            ))}
          </div>

          {/* Duplicate set for infinite scroll */}
          <div className="flex items-center space-x-16 mx-8">
            {logos.map((logo, index) => (
              <div key={`logo-2-${index}`} className="flex items-center space-x-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl"
                  style={{ backgroundColor: logo.color + '20', color: logo.color }}
                >
                  {logo.initial}
                </div>
                <span className="text-xl font-semibold text-gray-400">{logo.name}</span>
              </div>
            ))}
          </div>
           {/* Triplicate set for infinite scroll safety */}
           <div className="flex items-center space-x-16 mx-8">
            {logos.map((logo, index) => (
              <div key={`logo-3-${index}`} className="flex items-center space-x-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl"
                  style={{ backgroundColor: logo.color + '20', color: logo.color }}
                >
                  {logo.initial}
                </div>
                <span className="text-xl font-semibold text-gray-400">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HappyClients;
