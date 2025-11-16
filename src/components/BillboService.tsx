import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, DollarSign, Users, Megaphone, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Shuffle from './Shuffle';

const BillboService = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <Shuffle
              text="Introducing "
              tag="span"
              className="inline-block"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={2}
              ease="power3.out"
              stagger={0.05}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
            />
            <Shuffle
              text="Billbo"
              tag="span"
              className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent inline-block"
              style={{ letterSpacing: 'normal' }}
              shuffleDirection="left"
              duration={0.4}
              animationMode="random"
              shuffleTimes={3}
              ease="power3.out"
              stagger={0.01}
              maxDelay={0.1}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              scrambleCharset="BILLBO123456789!@#$%^&*"
              colorFrom="#8b5cf6"
              colorTo="#3b82f6"
            />
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            Our Revolutionary Advertising Platform
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            A child company of BluNet IT Services, bringing affordable advertising solutions to businesses of all sizes
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-6">
                Advertise Smart, Spend Less
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Billbo revolutionizes how businesses connect with their audience. Whether you're a startup or an established enterprise, 
                our platform enables you to create impactful advertisements and heartfelt greetings that reach the right people at the right time.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300">Maximum 15-minute ad duration for optimal engagement</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300">Affordable pricing for businesses of all sizes</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300">Reach both business owners and general public</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300">Perfect for ads, announcements, and greetings</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl p-8 border border-purple-500/30">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-12 h-12 text-white" />
                </div>
                
                <h4 className="text-2xl font-bold text-white">Coming Soon</h4>
                <p className="text-gray-300">
                  Get ready to transform your advertising strategy with Billbo's innovative platform
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">15min</div>
                    <div className="text-sm text-gray-400">Max Duration</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">∞</div>
                    <div className="text-sm text-gray-400">Reach Potential</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Premium Quality</h4>
            <p className="text-gray-400">
              High-quality ad delivery with advanced targeting and analytics to maximize your campaign effectiveness.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Wide Reach</h4>
            <p className="text-gray-400">
              Connect with diverse audiences including business owners, entrepreneurs, and the general public across multiple platforms.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Cost Effective</h4>
            <p className="text-gray-400">
              Affordable pricing plans designed to fit any budget, from small startups to large enterprises.
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-8 border border-blue-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Advertising?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join the waitlist for early access to Billbo and be among the first to experience the future of affordable, effective advertising.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/billbo" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-center">
                More Info
              </Link>
              <button className="border border-purple-500 text-purple-400 px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/10 transition-all duration-300">
                Pre-Orders Opening Soon
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BillboService;