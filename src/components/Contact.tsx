import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-400 text-sm">• Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're here to help you with your technology needs. Get in touch with our team.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-12 mb-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse mr-4"></div>
            <h2 className="text-3xl font-bold text-blue-400">Contact Portal Coming Soon!</h2>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Our comprehensive contact portal is currently under development. 
            We're building an advanced system to better serve our clients and provide seamless communication.
          </p>
          <div className="bg-gray-900/50 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">What's Coming:</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Live Chat Support</h4>
                    <p className="text-gray-400 text-sm">Real-time chat with our technical experts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Project Consultation</h4>
                    <p className="text-gray-400 text-sm">Schedule meetings with our development team</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Support Tickets</h4>
                    <p className="text-gray-400 text-sm">Track and manage your support requests</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Video Calls</h4>
                    <p className="text-gray-400 text-sm">Face-to-face meetings with screen sharing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">File Sharing</h4>
                    <p className="text-gray-400 text-sm">Secure document and file exchange</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Progress Tracking</h4>
                    <p className="text-gray-400 text-sm">Monitor your project development status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Contact Information */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Email */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Email</h3>
            </div>
            <p className="text-gray-300 mb-4">Get in touch via email for general inquiries and support.</p>
            <a href="mailto:support@blunetitservices.in" className="text-blue-400 hover:text-blue-300 transition-colors">
                support@blunetitservices.in
            </a>
          </div>



          {/* Address */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Office</h3>
            </div>
            <p className="text-gray-300 mb-4">Visit our office for in-person meetings and consultations.</p>
            <p className="text-purple-400">
              Hyderabad, Telangana<br />
              India<br />
              Austin, Texas<br />
              USA
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Be the first to know when our contact portal launches. Sign up for notifications and get early access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-400 transition-colors">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;