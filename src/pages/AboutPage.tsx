import React from 'react';
import { Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      {/* Navigation */}
      <nav className="bg-white/95 dark:bg-deep-blue/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <Code className="h-8 w-8 text-neon-cyan" />
                <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-blue-500 bg-clip-text text-transparent">
                  InnovateTech
                </span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-neon-cyan px-3 py-2 rounded-md text-sm font-medium">
                  About Us
                </Link>
                <a href="#careers" className="text-gray-700 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Career
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="text-neon-cyan">BluNet IT Services</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Pioneering the Future of Digital Solutions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative py-16 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed mb-6">
                At <span className="font-semibold text-neon-cyan">InnovateTech</span>, we believe technology should do more than just keep up—it should set the trend. We are a full-service software company specializing in building modern, scalable, and user-friendly solutions that help businesses grow and succeed in the digital age.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                From end-to-end project management to delivering web applications, mobile applications, and e-commerce platforms, our team ensures every project is completed on time, with precision, and with world-class design. With expertise in AI integration and automation, we bring the future into today's solutions, empowering our clients to stay ahead of the curve.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Beyond client success, we are equally committed to shaping the next generation of innovators. Through our training programs and internship opportunities, we provide students with hands-on experience in trending technologies, preparing them for real-world challenges.
              </p>
              
              <p className="text-lg leading-relaxed">
                Our promise is simple—modern solutions, reliable delivery, and 24/7 support. Whether you are a startup looking to launch or an enterprise seeking to scale, we're here to make technology your greatest advantage.
              </p>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { number: '150+', label: 'Team Members' },
                { number: '10+', label: 'Years Experience' },
                { number: '99%', label: 'Success Rate' },
                { number: '100%', label: 'Client Satisfaction' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-neon-cyan">{stat.number}</div>
                  <div className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-neon-cyan to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your next project?</span>
            <span className="block text-blue-100">Get in touch today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
