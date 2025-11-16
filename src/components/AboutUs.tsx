import React from 'react';
import { ArrowLeft, Users, Award, Target, Zap, Code, Shield, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: 'Team Members', value: '50+', color: 'from-blue-500 to-cyan-500' },
    { icon: Award, label: 'Years Experience', value: '8+', color: 'from-purple-500 to-pink-500' },
    { icon: Target, label: 'Success Rate', value: '99%', color: 'from-green-500 to-emerald-500' },
    { icon: Zap, label: 'Projects Delivered', value: '200+', color: 'from-orange-500 to-red-500' }
  ];

  const services = [
    {
      icon: Code,
      title: 'Software Development',
      description: 'Custom web and mobile applications built with cutting-edge technologies'
    },
    {
      icon: Shield,
      title: 'Cybersecurity Solutions',
      description: 'Comprehensive security services to protect your digital assets'
    },
    {
      icon: Brain,
      title: 'AI Integration',
      description: 'Intelligent automation and AI-powered solutions for modern businesses'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Back Button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              About Us
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                About Our Company
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We believe technology should do more than just keep up—it should set the trend.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-all duration-300 hover:scale-105">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Our Story
              </span>
            </h2>
            
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                At <strong className="text-white">BluNet IT Services</strong>, we are focused on productivity and creating smooth workflows that drive business success. We are a full-service software company specializing in building modern, scalable, and user-friendly solutions that help businesses optimize their operations and achieve seamless digital transformation.
              </p>
              
              <p>
                From end-to-end project management to delivering web applications, mobile applications, and e-commerce platforms, our team ensures every project enhances productivity and creates smooth workflows. With expertise in AI integration and automation, we streamline your business processes and eliminate bottlenecks to maximize efficiency.
              </p>
              
              <p>
                Beyond client success, we are equally committed to shaping the next generation of innovators. Through our training programs and internship opportunities, we provide students with hands-on experience in trending technologies, preparing them for real-world challenges.
              </p>
              
              <p className="text-cyan-400 font-semibold text-xl">
                Our promise is simple—modern solutions, reliable delivery, and 24/7 support. Whether you are a startup looking to launch or an enterprise seeking to scale, we're here to make technology your greatest advantage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              What We Do
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Ready to Transform Your Business?
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Let's discuss how we can help you achieve your digital goals with cutting-edge technology solutions.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 InnovateTech Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;