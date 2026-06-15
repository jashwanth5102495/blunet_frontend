import React, { useState } from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";

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
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="w-full bg-black py-20">
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center border border-gray-200/10 dark:border-gray-800 p-6 rounded-3xl bg-black">
        {/* Left Side */}
        <div>
        <p className="uppercase text-sm font-semibold text-gray-400">
          Components
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4 text-white">
          Build the Future with Intelligent Software
        </h2>
        <p className="text-gray-400 mb-6 text-lg">
          We craft high-performance web applications, mobile experiences, AI automations, and scalable digital products that help businesses innovate, streamline operations, and grow faster.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline" 
            className="border-gray-600 text-white hover:bg-white/10 px-5 py-2 rounded-lg font-medium bg-transparent cursor-pointer"
            onClick={() => setShowCalendar(true)}
          >
            Schedule Appointment &rarr;
          </Button>
        </div>
      </div>

      {/* Right Side */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {integrations.map((url, idx) => (
          <div
            key={idx}
            className="relative w-14 h-14 md:w-16 md:h-16 p-2 bg-gray-900 shadow-sm border border-gray-800 flex items-center justify-center"
            style={{
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <img
              src={url}
              alt={`integration-${idx}`}
              className="w-full h-full object-contain p-1.5 filter invert opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </section>

    {/* Calendar Modal Popup */}
    {showCalendar && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button 
            onClick={() => setShowCalendar(false)}
            className="absolute -top-4 -right-4 md:top-4 md:right-4 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 border border-gray-600"
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
