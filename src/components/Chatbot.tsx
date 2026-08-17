import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Minus, Send, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'blu';
  timestamp: Date;
  isLeadCard?: boolean;
  leadData?: Record<string, string>;
}

const Chatbot: React.FC = () => {
  const { t, dir } = useTranslation();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Lead Qualification State Machine
  const [leadStep, setLeadStep] = useState<number>(-1); // -1 means inactive
  const [leadData, setLeadData] = useState<Record<string, string>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Welcome message when opened the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: 'welcome',
            text: `Hi! I'm Blu 👋\n\nI'm your BluNet AI Consultant.\n\nI can help you explore our software, AI automation, cloud, e-commerce, logistics, 24/7 Support, training, education, and design services.\n\nWhat are you looking to build or improve today?`,
            sender: 'blu',
            timestamp: new Date()
          }
        ]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const quickActions = [
    { label: "Explore Services", text: "What services does BluNet provide?" },
    { label: "AI Automation", text: "I want to automate my business operations." },
    { label: "Build a Website/App", text: "I want to build a software application." },
    { label: "24/7 Support", text: "I need 24/7 Support." },
    { label: "Cloud & Infrastructure", text: "I need help with cloud hosting." },
    { label: "Training & Education", text: "I need career or technical training guidance." },
    { label: "Get a Project Consultation", text: "I want to request a project consultation." }
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Process lead flow or normal AI query
    if (leadStep >= 0) {
      processLeadFlow(textToSend);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyText = generateBotReply(textToSend);
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          text: replyText,
          sender: 'blu',
          timestamp: new Date()
        }]);
      }, 1200);
    }
  };

  // Lead qualification flow
  const startLeadFlow = () => {
    setLeadStep(0);
    setLeadData({});
    setMessages(prev => [...prev, {
      id: Math.random().toString(),
      text: "That sounds like a project BluNet can help with! Let's get your requirements set up for the team.\n\nFirst, what is your **full name**?",
      sender: 'blu',
      timestamp: new Date()
    }]);
  };

  const processLeadFlow = (input: string) => {
    const currentStep = leadStep;
    let nextStep = currentStep + 1;
    let nextReply = '';

    const updatedData = { ...leadData };

    switch (currentStep) {
      case 0:
        updatedData.name = input;
        nextReply = `Nice to meet you, ${input}! What is the name of your **company or organization**?`;
        break;
      case 1:
        updatedData.company = input;
        nextReply = "Got it. What **email address** should we use to reach you?";
        break;
      case 2:
        if (!input.includes('@') || !input.includes('.')) {
          setMessages(prev => [...prev, {
            id: Math.random().toString(),
            text: "Please enter a valid email address so our team can contact you.",
            sender: 'blu',
            timestamp: new Date()
          }]);
          return;
        }
        updatedData.email = input;
        nextReply = "Thanks! Please **describe your project** briefly or what you are trying to build.";
        break;
      case 3:
        updatedData.description = input;
        nextReply = "What is your estimated **budget range** for this project? (e.g. $1,000 - $5,000, or 'To be discussed')";
        break;
      case 4:
        updatedData.budget = input;
        nextReply = "Last question! What is your **target launch timeline**? (e.g. 1 month, 3 months, or 'Flexible')";
        break;
      case 5:
        updatedData.timeline = input;
        setLeadStep(-1);
        
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: Math.random().toString(),
            text: "Perfect! I have summarized your project details. Let's submit this to the BluNet team:",
            sender: 'blu',
            timestamp: new Date(),
            isLeadCard: true,
            leadData: updatedData
          }]);
        }, 1000);
        return;
    }

    setLeadData(updatedData);
    setLeadStep(nextStep);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        text: nextReply,
        sender: 'blu',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const generateBotReply = (input: string): string => {
    const cleanInput = input.toLowerCase();

    if (
      cleanInput.includes('import') || 
      cleanInput.includes('export') || 
      cleanInput.includes('trade') || 
      cleanInput.includes('sourcing') || 
      cleanInput.includes('shipping') || 
      cleanInput.includes('customs')
    ) {
      return "Global Trade & Commerce is an upcoming BluNet service. We are currently preparing infrastructure to support cross-border trade, customs clearance, and global distribution. However, this service is not currently available.\n\nCurrently, I can help you explore our active technology, automation, cloud, logistics, support, and design solutions. What can I help you build today?";
    }

    if (
      cleanInput.includes('price') || 
      cleanInput.includes('pricing') || 
      cleanInput.includes('cost') || 
      cleanInput.includes('how much') || 
      cleanInput.includes('quote') || 
      cleanInput.includes('quotation') ||
      cleanInput.includes('fee')
    ) {
      return "Project pricing depends entirely on the scope of work, features, integrations, and complexity. Since every application is unique, our team provides a customized quotation after understanding your requirements.\n\nIf you'd like to get a consultation and quote, just let me know or click the **Consultation** reply button!";
    }

    if (
      cleanInput.includes('timeline') || 
      cleanInput.includes('duration') || 
      cleanInput.includes('how long') || 
      cleanInput.includes('timeframe') || 
      cleanInput.includes('delivery time')
    ) {
      return "The project timeline depends on the overall scope, features, and technical complexity of the solutions. A typical web or mobile project can range from 3 weeks to a few months. Our specialists will provide an estimated delivery timeline after reviewing your requirements.";
    }

    if (
      cleanInput.includes('consult') || 
      cleanInput.includes('consultation') || 
      cleanInput.includes('start project') || 
      cleanInput.includes('hire') || 
      cleanInput.includes('contact') || 
      cleanInput.includes('lead') || 
      cleanInput.includes('meeting')
    ) {
      setTimeout(() => startLeadFlow(), 100);
      return "Sure! I can help you compile your requirements to submit to our software team.";
    }

    if (cleanInput.includes('services') || cleanInput.includes('what do you do') || cleanInput.includes('what you provide')) {
      return `BluNet provides high-quality technology, education, and design solutions:\n\n• **Digital Product Development** (Web apps, SaaS, Mobile Apps)\n• **AI & Business Automation** (AI agents, automated workflows)\n• **Cloud & Infrastructure** (Hosting, hosting setups, backups)\n• **24/7 Support** (SLA support, monitoring)\n• **E-Commerce Solutions** (Online stores, product catalogs)\n• **Logistics & Fleet Solutions** (Driver tracking, dispatch boards)\n• **Education & Career Solutions** (Career guidance, academic pathways)\n• **Learning & Training Software Solutions** (Practical tech courses)\n• **Interior & Space Design** (Office and residential spaces)\n\nWe also have **Global Trade & Commerce** on our upcoming roadmap.\n\nWhich of these services are you interested in?`;
    }

    if (cleanInput.includes('website') || cleanInput.includes('web app') || cleanInput.includes('application') || cleanInput.includes('mobile app') || cleanInput.includes('ios') || cleanInput.includes('android') || cleanInput.includes('saas') || cleanInput.includes('software')) {
      return "Our **Digital Product Development** team builds custom web apps, native iOS/Android mobile apps, SaaS dashboards, and administrative software.\n\nWe manage the entire lifecycle: from UI/UX design, database configuration, frontend development, to final deployment and support.\n\nAre you looking to build a web-based portal, a mobile app, or both?";
    }

    if (cleanInput.includes('automate') || cleanInput.includes('automation') || cleanInput.includes('ai workflow') || cleanInput.includes('bot') || cleanInput.includes('agent')) {
      return "BluNet's **AI & Business Automation** helps companies streamline repetitive work. We build automated email triggers, lead categorization systems, document parsers, and custom chat assistants to increase operational efficiency.\n\nWhat manual process would you like to automate in your operations?";
    }

    if (cleanInput.includes('cloud') || cleanInput.includes('hosting') || cleanInput.includes('server') || cleanInput.includes('aws') || cleanInput.includes('azure') || cleanInput.includes('devops') || cleanInput.includes('database')) {
      return "We offer complete **Cloud & Infrastructure** services, including application hosting, remote databases, auto-scaling configuration, CI/CD pipeline automation, and backup systems on cloud providers like AWS and Azure.\n\nDo you need hosting setup for a new product, or cloud migration for an existing system?";
    }

    if (cleanInput.includes('support') || cleanInput.includes('maintenance') || cleanInput.includes('fix bug') || cleanInput.includes('troubleshoot') || cleanInput.includes('it support') || cleanInput.includes('24/7')) {
      return "We provide ongoing **24/7 Support & Maintenance** contracts. This covers server uptime monitoring, software patch updates, database maintenance, and priority bug troubleshooting under flexible Service Level Agreements (SLAs).\n\nDo you have an existing system that needs regular updates and tech support?";
    }

    if (cleanInput.includes('ecommerce') || cleanInput.includes('store') || cleanInput.includes('shop') || cleanInput.includes('sell product') || cleanInput.includes('checkout') || cleanInput.includes('cart')) {
      return "Our **E-Commerce Solutions** deliver complete custom online stores, secure checkout integrations, order monitoring dashboards, and real-time inventory synchronizations.\n\nWhat types of products are you selling, and do you have an existing physical store?";
    }

    if (cleanInput.includes('logistics') || cleanInput.includes('fleet') || cleanInput.includes('delivery') || cleanInput.includes('driver') || cleanInput.includes('route') || cleanInput.includes('warehouse')) {
      return "We design custom **Logistics & Fleet Solutions**, including dispatcher monitoring boards, driver tracking companion apps, warehouse inventory scanners, and client parcel tracking dashboards.\n\nHow many active drivers or vehicles does your business currently manage?";
    }

    if (cleanInput.includes('career') || cleanInput.includes('guidance') || cleanInput.includes('student') || cleanInput.includes('consultation') || cleanInput.includes('academic') || cleanInput.includes('college')) {
      return "Through our **Education & Career Solutions**, we offer students and young professionals personalized tech pathway planning, career path advice, course selections, and higher education academic assistance.\n\nAre you looking for career roadmap guidance, or academic project mentorship?";
    }

    if (cleanInput.includes('training') || cleanInput.includes('learn code') || cleanInput.includes('course') || cleanInput.includes('practical') || cleanInput.includes('programming') || cleanInput.includes('coding')) {
      return "Our **Learning & Training Software Solutions** provide hands-on coding training in trending stacks, cloud operations, AI integration, and app development with practical exercises.\n\nAre you seeking technical training to prepare for an internship or job placement?";
    }

    if (cleanInput.includes('interior') || cleanInput.includes('design') || cleanInput.includes('space') || cleanInput.includes('furniture') || cleanInput.includes('room')) {
      return "Alongside our IT services, BluNet provides professional **Interior & Space Design** for residential and commercial office properties. This includes layouts, concept boards, lighting plans, and 3D visual blueprints.\n\nIs this design project for a home space or an office workspace?";
    }

    if (cleanInput.includes('hi') || cleanInput.includes('hello') || cleanInput.includes('hey') || cleanInput.includes('greetings')) {
      return "Hi there! I'm Blu, your AI Consultant. How can I help you with BluNet's services, custom software, training, or design options today?";
    }

    return "I appreciate you sharing that! To recommend the most suitable BluNet service, could you tell me a little more about what your business does, or what specific technical help you are looking for?\n\nIf I'm unable to resolve your inquiry directly, please connect with our team on WhatsApp for prompt manual assistance: [+91 83282 46413](https://wa.me/918328246413)";
  };

  const handleQuickActionClick = (actionText: string) => {
    handleSendMessage(actionText);
  };

  const handleLeadSubmit = (data: Record<string, string>) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev.filter(m => !m.isLeadCard),
        {
          id: Math.random().toString(),
          text: `Thank you, ${data.name}! Your consultation request has been submitted successfully. A BluNet technology representative will review your project details and reach out to you at **${data.email}** within 24 hours.`,
          sender: 'blu',
          timestamp: new Date()
        }
      ]);
    }, 1500);
  };

  return (
    <div dir={dir} className="fixed bottom-6 right-6 z-[9999] select-none font-sora">
      
      {/* Floating chatbot trigger */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-20 h-20 p-0 cursor-pointer overflow-visible transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 bg-transparent border-none outline-none focus:outline-none flex items-center justify-center animate-pulse"
          style={{ animationDuration: '3s' }}
          aria-label="Chat with Blu"
        >
          <img src="/cb.webp" alt="Blu Mascot" className="w-full h-full object-contain" />
        </button>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className={`absolute bottom-20 bg-gray-900 border border-white/10 text-white text-xs font-bold font-mono py-2 px-4 rounded-xl whitespace-nowrap shadow-xl z-50 ${
                dir === 'rtl' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'
              }`}
            >
              Chat with Blu
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed bottom-24 w-[92vw] sm:w-[420px] h-[78vh] sm:h-[620px] max-h-[85vh] backdrop-blur-xl border rounded-2xl shadow-2xl z-[10000] flex flex-col overflow-hidden ${
              theme === 'dark'
                ? 'bg-[#0c0d14]/95 border-white/10 text-white'
                : 'bg-white/95 border-gray-200 text-black shadow-2xl'
            } ${
              dir === 'rtl' ? 'left-6' : 'right-6'
            }`}
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between border-b ${
              theme === 'dark' ? 'bg-[#121422] border-white/10' : 'bg-gray-100 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`relative w-10 h-10 rounded-full border overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-950 border-white/10' : 'bg-white border-gray-200'
                }`}>
                  <img src="/cb.webp" alt="Blu Mascot" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-transparent"></div>
                </div>
                <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                  <h3 className={`text-sm font-black tracking-wide font-poppins ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Blu</h3>
                  <p className={`text-[10px] font-mono tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Your BluNet AI Consultant</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-1 space-x-reverse">
                <button
                  onClick={() => setIsMinimized(true)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-600 hover:text-black'
                  }`}
                  title="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-600 hover:text-black'
                  }`}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-2 space-x-reverse max-w-[85%]">
                    {msg.sender === 'blu' && (
                      <div className={`w-7 h-7 rounded-full flex-shrink-0 overflow-hidden border ${
                        theme === 'dark' ? 'bg-gray-950 border-white/10' : 'bg-white border-gray-200'
                      }`}>
                        <img src="/cb.webp" alt="avatar" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      {msg.isLeadCard && msg.leadData ? (
                        <div className={`border rounded-2xl p-4 text-left font-sora ${
                          theme === 'dark' 
                            ? 'bg-blue-950/40 border-cyan-500/30' 
                            : 'bg-cyan-50 border-cyan-400/40 text-black'
                        }`}>
                          <div className="flex items-center space-x-2 mb-3">
                            <Check className="w-4 h-4 text-cyan-500" />
                            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Lead Summary Card</h4>
                          </div>
                          <div className={`space-y-2 text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            <p><span className="text-gray-400 font-bold">Name:</span> {msg.leadData.name}</p>
                            <p><span className="text-gray-400 font-bold">Company:</span> {msg.leadData.company}</p>
                            <p><span className="text-gray-400 font-bold">Email:</span> {msg.leadData.email}</p>
                            <p className="line-clamp-2"><span className="text-gray-400 font-bold">Project:</span> {msg.leadData.description}</p>
                            <p><span className="text-gray-400 font-bold">Budget:</span> {msg.leadData.budget}</p>
                            <p><span className="text-gray-400 font-bold">Timeline:</span> {msg.leadData.timeline}</p>
                          </div>
                          <button
                            onClick={() => handleLeadSubmit(msg.leadData!)}
                            className="mt-4 w-full bg-cyan-500 text-black font-bold font-mono text-[10px] uppercase py-2.5 rounded-lg hover:bg-cyan-400 transition shadow-md cursor-pointer"
                          >
                            Submit Request
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start">
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed font-sora whitespace-pre-wrap ${
                              msg.sender === 'user'
                                ? 'bg-cyan-500 text-black font-semibold rounded-tr-none'
                                : `${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-gray-200' : 'bg-gray-100 border-gray-200 text-gray-800'} rounded-tl-none text-left border`
                            }`}
                          >
                            {msg.text}
                          </div>
                          
                          {msg.sender === 'blu' && msg.text.includes("wa.me/918328246413") && (
                            <a
                              href="https://wa.me/918328246413"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2.5 inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-colors shadow-md w-fit cursor-pointer self-start"
                            >
                              <svg className="w-4 h-4 fill-current mr-1.5" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              <span>Chat on WhatsApp</span>
                            </a>
                          )}
                        </div>
                      )}
                      
                      <span className={`text-[9px] text-gray-500 mt-1 font-mono ${
                        msg.sender === 'user' ? 'self-end' : 'self-start'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 space-x-reverse max-w-[85%]">
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 overflow-hidden border ${
                      theme === 'dark' ? 'bg-gray-950 border-white/10' : 'bg-white border-gray-200'
                    }`}>
                      <img src="/cb.webp" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className={`px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5 border ${
                      theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-gray-100 border-gray-200'
                    }`}>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {leadStep === -1 && (
              <div className={`border-t py-3.5 px-3 flex flex-wrap gap-2 justify-center max-h-[140px] overflow-y-auto ${
                theme === 'dark' ? 'bg-[#0b0c12]/80 border-white/5' : 'bg-gray-50 border-gray-100'
              }`}>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickActionClick(action.text)}
                    className={`px-3 py-1.5 border rounded-lg text-[10px] sm:text-xs font-mono font-medium transition cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-cyan-500/10 border-white/10 hover:border-cyan-500/30 text-white hover:text-cyan-400'
                        : 'bg-white hover:bg-cyan-500/5 border-gray-200 hover:border-cyan-500/20 text-gray-700 hover:text-cyan-600'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className={`p-3.5 flex items-center space-x-2 space-x-reverse border-t ${
                theme === 'dark' ? 'bg-[#121422] border-white/10' : 'bg-gray-100 border-gray-200'
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={leadStep >= 0 ? "Type answer..." : "Ask Blu a question..."}
                className={`flex-1 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none font-mono border focus:border-cyan-400 ${
                  theme === 'dark'
                    ? 'bg-gray-950 border-white/10 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-black placeholder-gray-400'
                }`}
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black p-2.5 rounded-xl cursor-pointer transition shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
