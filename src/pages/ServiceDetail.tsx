import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, MessageSquare, Terminal, Shield, Cpu, Zap, Settings, Globe, Award } from 'lucide-react';
import Footer from '../components/Footer';

interface ServiceContent {
  title: string;
  badge: string;
  heroDesc: string;
  aboutTitle: string;
  aboutDesc: string;
  imageUrl: string;
  features: { title: string; desc: string; icon: any }[];
  processSteps: { title: string; desc: string; label: string }[];
  metrics: string[];
  techStack: string[];
  accentColor: string;
  glowColor: string;
}

const SERVICE_DATA: Record<string, Record<string, ServiceContent>> = {
  en: {
    'digital-product-development': {
      title: "Digital Product Development",
      badge: "ENGINEERING SUITE",
      heroDesc: "We build custom, enterprise-grade web applications, native iOS/Android mobile apps, and administrative SaaS platforms tailored to modern scale.",
      aboutTitle: "Strategic Engineering & Scalable Design",
      aboutDesc: "Our engineering division turns complex ideas into production-ready software. We manage the entire lifecycle of your application, combining user-centric UI/UX design with reliable backend architectures, secure API gateways, and responsive layouts that perform flawlessly across all devices.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      features: [
        { title: "Enterprise Web Systems", desc: "React, Next.js, and solid frontend structures designed for fast render times and SEO compatibility.", icon: Cpu },
        { title: "Native Mobile Stacks", desc: "Native iOS & Android application development delivering optimal device performance and fluid gestures.", icon: Zap },
        { title: "SaaS & Admin Hubs", desc: "Multi-tenant dashboards, secure administrative centers, and scalable database integrations.", icon: Settings }
      ],
      processSteps: [
        { label: "Phase 01", title: "Technical Blueprinting", desc: "We map out user flows, compile technical database schemas, and define milestones." },
        { label: "Phase 02", title: "Aesthetic Mockups", desc: "Designing visual wireframes, component layouts, and interactive dark/light layouts." },
        { label: "Phase 03", title: "Agile Development", desc: "Writing clean, commented, and modular code backed by unit tests and security lint checks." },
        { label: "Phase 04", title: "CI/CD Deployment", desc: "Setting up hosting pipelines, SSL layers, and scaling configurations for launching." }
      ],
      metrics: ["API-FIRST DESIGN", "COMPACT BUNDLES", "99.9% UPTIME SCORES"],
      techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
      accentColor: "from-cyan-500 to-blue-600",
      glowColor: "rgba(6,182,212,0.15)"
    },
    'cloud-and-infrastructure': {
      title: "Cloud & Infrastructure",
      badge: "OPS & DevOps SYSTEMS",
      heroDesc: "Establish secure, high-availability server ecosystems, cloud databases, automated backups, and CI/CD pipelines.",
      aboutTitle: "High-Availability Infrastructure & Hosting Solutions",
      aboutDesc: "We construct and maintain secure, reliable server structures on AWS and Azure. Our infrastructure team specializes in automated scaling configurations, load balancer setups, encrypted backup procedures, and continuous deployment workflows to keep your applications online 24/7.",
      imageUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800",
      features: [
        { title: "Cloud Deployments", desc: "AWS, Azure, and Google Cloud configurations utilizing secure private networks (VPCs).", icon: Globe },
        { title: "CI/CD Pipelines", desc: "Automated test runs and production deployments triggered directly from your repository.", icon: Zap },
        { title: "Backup Security", desc: "Encrypted, cross-region backups and quick disaster recovery pipelines for zero data loss.", icon: Shield }
      ],
      processSteps: [
        { label: "Phase 01", title: "Architecture Audit", desc: "Reviewing your current hosting parameters, database bottlenecks, and security exposures." },
        { label: "Phase 02", title: "Eco Blueprinting", desc: "Designing secure network topographies, database clusters, and scaling triggers." },
        { label: "Phase 03", title: "Pipeline Integration", desc: "Provisioning systems, writing infra-as-code scripts, and setting up repository triggers." },
        { label: "Phase 04", title: "Traffic Verification", desc: "Running stress loads, validating fallback clusters, and establishing live monitors." }
      ],
      metrics: ["ZERO-DOWNTIME DEPLOY", "GEO-REDUNDANT BACKUPS", "AWS & AZURE PARTNER"],
      techStack: ["AWS", "Terraform", "Docker", "GitHub Actions", "Kubernetes"],
      accentColor: "from-indigo-500 to-blue-600",
      glowColor: "rgba(99,102,241,0.15)"
    },
    '24-7-support': {
      title: "24/7 Technical Support",
      badge: "MAINTENANCE & SLAs",
      heroDesc: "Continuous application monitoring, regular system patches, database maintenance, and prompt troubleshooting.",
      aboutTitle: "Proactive Monitoring & Instant Issue Resolution",
      aboutDesc: "We provide comprehensive Service Level Agreements (SLAs) tailored to support your operations round-the-clock. Our system checks monitor servers for downtime, address priority bug fixes, and patch security vulnerabilities to give you absolute peace of mind.",
      imageUrl: "https://images.unsplash.com/photo-1521791136364-728685002795?auto=format&fit=crop&q=80&w=800",
      features: [
        { title: "Active Health Scans", desc: "Server uptime, memory leaks, and CPU load monitoring running continuously.", icon: Cpu },
        { title: "SLA Guaranteed Response", desc: "Priority tickets addressed within contractual window timelines by dedicated engineers.", icon: Shield },
        { title: "Regular Patches", desc: "Routine security upgrades, third-party library patches, and database optimization.", icon: Settings }
      ],
      processSteps: [
        { label: "Phase 01", title: "System Onboarding", desc: "Setting up server agent hooks, log collectors, and monitoring dashboards." },
        { label: "Phase 02", title: "Escalation Matrices", desc: "Defining contact protocols, severity thresholds, and response targets." },
        { label: "Phase 03", title: "Automated Alerts", desc: "Deploying bots to check network statuses and notify on anomalies." },
        { label: "Phase 04", title: "Ongoing Optimizations", desc: "Conducting monthly performance reviews, database cleaning, and report summaries." }
      ],
      metrics: ["SLA SECURED TIMELINES", "HEARTBEAT SCAN RATE", "PROACTIVE RESOLUTION"],
      techStack: ["Datadog", "Sentry", "New Relic", "PagerDuty", "Grafana"],
      accentColor: "from-emerald-500 to-teal-600",
      glowColor: "rgba(16,185,129,0.15)"
    },
    'ai-and-business-automation': {
      title: "AI & Business Automation",
      badge: "INTELLIGENT WORKFLOWS",
      heroDesc: "Optimize operations, categorize data, and automate customer interactions with custom AI agents and triggers.",
      aboutTitle: "Operational Leverage Through AI Systems",
      aboutDesc: "We build tailored AI models and automate manual pipelines to reduce operational friction. From custom customer consulting chatbots, email routing scripts, invoice extractors, to automated spreadsheets, we empower companies to work smarter and faster.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800",
      features: [
        { title: "Custom Agent Frameworks", desc: "Mascot chatbots, lead qualificators, and automated support agents backed by LLMs.", icon: Cpu },
        { title: "Information Extraction", desc: "Parsing invoices, categorizing emails, and sorting user files dynamically.", icon: Terminal },
        { title: "System Orchestrations", desc: "Connecting CRMs, database sheets, and message alerts with webhooks.", icon: Zap }
      ],
      processSteps: [
        { label: "Phase 01", title: "Process Diagnostics", desc: "Identifying repetitive tasks, manual reports, and operational friction points." },
        { label: "Phase 02", title: "Agent Prototyping", desc: "Drafting conversational prompts, fine-tuning scripts, and validation steps." },
        { label: "Phase 03", title: "API Integrations", desc: "Binding large language models to your existing internal database pipelines." },
        { label: "Phase 04", title: "Output Auditing", desc: "Running response validation filters, token budget checks, and system scale." }
      ],
      metrics: ["LLM-AGNOSTIC FLOWS", "SECURE DATA PARSING", "REDUCED PROCESS TIMEFRAME"],
      techStack: ["OpenAI API", "LangChain", "Python", "FastAPI", "VectorDB"],
      accentColor: "from-purple-500 to-indigo-600",
      glowColor: "rgba(168,85,247,0.15)"
    },
    'digital-business-analyst': {
      title: "Digital Business Analyst",
      badge: "STRATEGY & ARCHITECTURE",
      heroDesc: "Align corporate operations, design user flows, and compile concrete technical project requirements.",
      aboutTitle: "Aligning Business Objectives with Technical Implementation",
      aboutDesc: "We analyze your existing workflows and draft clear, implementable technical roadmaps. Our analysis services ensure that project stakeholders, developers, and designers stay completely aligned, reducing project delivery times and scoping errors.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      features: [
        { title: "User Flow Mapping", desc: "Detailed step-by-step layout diagrams and interface navigations for application development.", icon: Settings },
        { title: "Functional Specifications", desc: "Clear software requirements, sprint breakdown charts, and data structure plans.", icon: Terminal },
        { title: "Risk Assessments", desc: "Mitigation boards detailing scaling issues, third-party limits, and security protocols.", icon: Shield }
      ],
      processSteps: [
        { label: "Phase 01", title: "Discovery Sessions", desc: "Conducting interviews with stakeholders to identify operational goals." },
        { label: "Phase 02", title: "Information Structuring", desc: "Drafting process maps, database structures, and integration dependencies." },
        { label: "Phase 03", title: "Requirement Drafts", desc: "Creating functional requirement documents (FRDs) and user stories." },
        { label: "Phase 04", title: "Implementation Handover", desc: "Aligning frontend/backend teams, scoping budgets, and scheduling sprint milestones." }
      ],
      metrics: ["100% ALIGNED SPECS", "SPRINT-READY ROADMAPS", "ROI-DRIVEN ANALYSIS"],
      techStack: ["Jira", "Confluence", "Figma", "Lucidchart", "Miro"],
      accentColor: "from-amber-500 to-orange-600",
      glowColor: "rgba(245,158,11,0.15)"
    },
    'e-commerce-solutions': {
      title: "E-Commerce Solutions",
      badge: "STOREFRONT ENGINEERING",
      heroDesc: "Develop custom digital storefronts, secure checkout integrations, order panels, and real-time inventory tools.",
      aboutTitle: "High-Performance Stores Designed for Conversions",
      aboutDesc: "We build high-conversion online stores tailored to your product catalog. Our designs focus on loading speeds, secure checkouts, seamless payment gateway integrations, admin inventory tracking, and client order summaries that drive conversions.",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
      features: [
        { title: "Conversion Storefronts", desc: "Lightweight, responsive layouts optimized for fast navigation speeds on mobile.", icon: Zap },
        { title: "Merchant Integrations", desc: "Stripe, Razorpay, and PayPal gateways configured with secure token authorization.", icon: Shield },
        { title: "Real-time Sync", desc: "Live inventory updates, auto email receipts, and dispatch webhook structures.", icon: Settings }
      ],
      processSteps: [
        { label: "Phase 01", title: "Catalog Structuring", desc: "Defining product options, inventory bounds, and multi-currency rules." },
        { label: "Phase 02", title: "Storefront UX Design", desc: "Designing fast-loading cart overlays and high-conversion checkouts." },
        { label: "Phase 03", title: "Gateway Configuration", desc: "Integrating checkout hooks, tax setups, and coupon verification systems." },
        { label: "Phase 04", title: "Live Orders Validation", desc: "Conducting end-to-end sandbox payments, invoice emails, and carrier alerts." }
      ],
      metrics: ["LIGHTNING LOAD SPEED", "SECURE API PAYMENTS", "MOBILE-FIRST DESIGN"],
      techStack: ["Shopify API", "React", "Stripe API", "Node.js", "Redis"],
      accentColor: "from-blue-500 to-teal-600",
      glowColor: "rgba(59,130,246,0.15)"
    },
    'interior-and-space-design': {
      title: "Interior & Space Design",
      badge: "SPATIAL ARCHITECTURE",
      heroDesc: "Aesthetic conceptual spatial maps, commercial office designs, spatial blueprints, and 3D visual plans.",
      aboutTitle: "Ergonomic & Modern Space Planning",
      aboutDesc: "Our spatial design unit crafts functional, modern environments for office workspaces and residential homes. We supply detailed 3D renderings, lighting outlines, furniture placements, and color schemes to transform physical spaces into productive, beautiful settings.",
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
      features: [
        { title: "Workspace Layouts", desc: "Commercial floor blueprints designed to maximize collaboration and productivity.", icon: Globe },
        { title: "Interactive 3D Renders", desc: "High-fidelity digital layouts showing textures, fabrics, and furniture alignments.", icon: Award },
        { title: "Material Schedules", desc: "Sourcing specifications, lighting outputs, and color coordinates.", icon: Settings }
      ],
      processSteps: [
        { label: "Phase 01", title: "Site Measurement", desc: "Documenting spatial dimensions, lighting structures, and functional preferences." },
        { label: "Phase 02", title: "2D Plan Drafts", desc: "Creating space flow options, wall alignments, and furniture positions." },
        { label: "Phase 03", title: "3D Digital Modeling", desc: "Rendering realistic digital models with custom colors and materials." },
        { label: "Phase 04", title: "Technical Blueprints", desc: "Delivering finalized blueprints, electrical charts, and vendor instructions." }
      ],
      metrics: ["ERGONOMIC WORKFLOWS", "DETAILED 3D BLUEPRINTS", "COMMERCIAL CLASS DESIGNS"],
      techStack: ["AutoCAD", "SketchUp", "3ds Max", "V-Ray", "Photoshop"],
      accentColor: "from-yellow-500 to-amber-600",
      glowColor: "rgba(234,179,8,0.15)"
    },
    'global-trade-and-commerce': {
      title: "Global Trade & Commerce",
      badge: "LOGISTICS ARCHITECTURE",
      heroDesc: "Cross-border distribution, customs clearances, global import-export frameworks, and logistics sourcing pipelines.",
      aboutTitle: "Connected Sourcing & International Distribution",
      aboutDesc: "As part of BluNet's upcoming roadmap, we are establishing the tech infrastructure and logistic partnerships for international trade. This includes automated supply auditing, digital customs documentation flows, and global warehousing networks.",
      imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800",
      features: [
        { title: "Supply Chains", desc: "International manufacturer sourcing, compliance checks, and cargo routing.", icon: Globe },
        { title: "Clearance Frameworks", desc: "Digital systems mapping import duties, custom keys, and tariff rates.", icon: Shield },
        { title: "Warehousing Systems", desc: "Traceability frameworks linking inventory locations with logistics dashboards.", icon: Settings }
      ],
      processSteps: [
        { label: "Phase 01", title: "Compliance Review", desc: "Checking shipping regulations, certifications, and target market tariffs." },
        { label: "Phase 02", title: "Logistics Mapping", desc: "Designing warehouse positions, freight pipelines, and carrier routes." },
        { label: "Phase 03", title: "Tech Integration", desc: "Configuring digital customs tracking databases and verification hooks." },
        { label: "Phase 04", title: "Beta Shipments", desc: "Deploying logistics panels to coordinate early international shipments." }
      ],
      metrics: ["CROSS-BORDER DEPLOY", "DIGITAL CUSTOMS STACK", "GLOBAL PARTNERSHIP CODES"],
      techStack: ["Logistics API", "Customs Data Hub", "Node.js", "PostgreSQL", "Google Maps Platform"],
      accentColor: "from-rose-500 to-red-600",
      glowColor: "rgba(244,63,94,0.15)"
    }
  }
};

const ServiceDetail: React.FC = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  const { language, dir } = useTranslation();
  const { theme } = useTheme();

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const activeLang = SERVICE_DATA[language] ? language : 'en';
  const slug = serviceSlug || 'digital-product-development';
  const service = SERVICE_DATA[activeLang][slug] || SERVICE_DATA['en']['digital-product-development'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const whatsappMessage = `Hello BluNet IT Services, I am interested in your "${service.title}" service.

Name: ${formData.name}
Phone: ${formData.phone}
Message: ${formData.message || 'Not Specified'}`;

    window.open(`https://wa.me/918328246413?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 font-sora ${
      theme === 'dark' ? 'bg-[#030408] text-white' : 'bg-gray-50 text-black'
    }`} dir={dir}>
      
      {/* Decorative Grid Overlay & Ambient Radial Glows (SaaS Premium Visuals) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)]'
        } bg-[size:4rem_4rem]`} />
      </div>

      <div 
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-500"
        style={{ backgroundColor: theme === 'dark' ? service.glowColor : 'transparent' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-500"
        style={{ backgroundColor: theme === 'dark' ? service.glowColor : 'transparent' }}
      />

      {/* Immersive Cover Image Hero Section (Matching Full-bleed Mockup) */}
      <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden bg-black z-10">
        
        {/* Background Image */}
        <img
          src={service.imageUrl}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Dark overlay gradient (strong on the left & bottom to make text legible) */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/60 to-black/20 z-10" />

        {/* Content container aligned with max-w-7xl site grid */}
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-32 pb-14 relative z-20">
          
          {/* Top Row: Back to Home */}
          <div className="flex items-center justify-start">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer font-mono text-white/70 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Bottom Row Left: Title, Description, Metrics & Primary CTA */}
          <div className="max-w-2xl space-y-4 md:space-y-6 text-left">
            <h1 className="text-3xl sm:text-5.5xl font-black font-poppins leading-[1.05] tracking-tight uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {service.title}
            </h1>
            
            <p className="text-white/80 text-xs md:text-sm max-w-lg font-light leading-relaxed drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">
              {service.heroDesc}
            </p>

            {/* Tech stack badges instead of metrics for visual richness */}
            <div className="flex flex-wrap gap-2 pt-1">
              {service.techStack.map((tech, tIdx) => (
                <span 
                  key={tIdx} 
                  className="text-[9px] font-bold font-mono px-2.5 py-1 rounded backdrop-blur-md bg-black/60 text-white border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('consultation-form-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-3 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3.5 rounded-full font-bold font-mono text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-500/20"
              >
                <span>GET A QUOTE</span>
                <span className="text-xs">→</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Right: Overlapping White Box Card (Flush with edge of screen) */}
        <div className="hidden lg:block absolute bottom-0 right-0 w-[420px] bg-white text-black p-8 rounded-tl-[2rem] shadow-2xl border-l border-t border-gray-150 z-30">
          <div className="space-y-3.5 text-left">
            <h3 className="text-sm font-black font-poppins uppercase tracking-wide text-gray-900">
              Book your service today
            </h3>
            <p className="text-[11px] leading-relaxed text-gray-500 font-light font-poppins">
              Submit your contact number to initiate a prompt, tailored WhatsApp consultation regarding this service.
            </p>
            
            <form onSubmit={handleSubmit} className="flex items-center space-x-2 pt-2">
              <input
                type="tel"
                required
                placeholder="Enter your phone number..."
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 font-mono text-black placeholder-gray-400"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-colors cursor-pointer"
                title="Send Enquiry"
              >
                <span className="text-sm font-bold">→</span>
              </button>
            </form>
          </div>
        </div>

      </section>

      {/* Details Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Details & Immersive Offerings Grid */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* About Narrative Block */}
            <div className="space-y-4">
              <h2 className={`text-2xl md:text-3xl font-black font-poppins uppercase tracking-wide leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-zinc-900'
              }`}>
                {service.aboutTitle}
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}>
                {service.aboutDesc}
              </p>
            </div>

            {/* Immersive Capabilities Grid (Replacing standard checkbox bullets) */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] font-mono text-cyan-400">
                // System Capabilities
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {service.features.map((feature, idx) => {
                  const IconComponent = feature.icon;
                  return (
                    <div 
                      key={idx} 
                      className={`p-6 rounded-[1.8rem] border flex flex-col justify-between transition duration-300 relative group overflow-hidden ${
                        theme === 'dark' 
                          ? 'bg-[#0c0d14]/80 border-white/5 hover:border-cyan-500/30' 
                          : 'bg-white border-gray-200 hover:border-cyan-500/40 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {/* Background Hover Radial Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="space-y-4 relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          theme === 'dark' 
                            ? 'bg-zinc-950 border-white/10 text-cyan-400' 
                            : 'bg-cyan-50 border-cyan-100 text-cyan-600'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        <h4 className="text-xs font-bold uppercase tracking-wider font-poppins leading-snug">
                          {feature.title}
                        </h4>
                      </div>

                      <p className={`text-[10px] leading-relaxed mt-4 relative z-10 ${
                        theme === 'dark' ? 'text-gray-450' : 'text-gray-650'
                      }`}>
                        {feature.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pipeline Process Line (Sleek Horizontal Dot Track) */}
            <div className="space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] font-mono text-cyan-400">
                // Deployment Pipeline
              </h3>
              
              <div className="relative border-l-2 border-cyan-400/20 pl-6 ml-3 space-y-8">
                {service.processSteps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    
                    {/* Glowing Node Dot */}
                    <div className="absolute left-[-31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 bg-[#030408] border-cyan-400 flex items-center justify-center shadow-[0_0_8px_#22d3ee] transition duration-300 group-hover:scale-110" />

                    <div className={`p-5 rounded-2xl border transition duration-300 ${
                      theme === 'dark' 
                        ? 'bg-zinc-900/40 border-white/5 hover:border-white/10' 
                        : 'bg-white border-gray-200/50 hover:border-gray-200 shadow-sm'
                    }`}>
                      <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{step.label}</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider mt-1.5 mb-2 font-poppins">{step.title}</h4>
                      <p className={`text-[11px] leading-relaxed ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Premium Form Widget */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className={`p-6 rounded-[2rem] border relative overflow-hidden shadow-2xl ${
              theme === 'dark' 
                ? 'bg-[#090a10]/90 border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              {/* Form header */}
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
                <div className={`p-3 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#0f111a] border-cyan-500/20' : 'bg-cyan-50 border-cyan-100'
                }`}>
                  <Terminal className="w-5 h-5 text-cyan-455 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono text-cyan-400">Consultation Terminal</h3>
                  <p className={`text-[9px] font-mono tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-450'}`}>Establish project specs</p>
                </div>
              </div>

              {/* Console Inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 block ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    01 // USERNAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full text-xs p-3.5 rounded-xl border focus:outline-none focus:border-cyan-400 font-mono transition duration-200 ${
                      theme === 'dark' 
                        ? 'bg-black border-white/5 text-white hover:border-white/10' 
                        : 'bg-gray-50 border-gray-250 text-black hover:border-gray-300'
                    }`}
                    placeholder="e.g. Alice Mercer"
                  />
                </div>

                <div>
                  <label className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 block ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    02 // CONTACT CODE
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full text-xs p-3.5 rounded-xl border focus:outline-none focus:border-cyan-400 font-mono transition duration-200 ${
                      theme === 'dark' 
                        ? 'bg-black border-white/5 text-white hover:border-white/10' 
                        : 'bg-gray-50 border-gray-250 text-black hover:border-gray-300'
                    }`}
                    placeholder="e.g. +91 83282 46413"
                  />
                </div>

                <div>
                  <label className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 block ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    03 // CONSOLE LOG / REQUIREMENTS
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className={`w-full text-xs p-3.5 rounded-xl border focus:outline-none focus:border-cyan-400 font-mono resize-none transition duration-200 ${
                      theme === 'dark' 
                        ? 'bg-black border-white/5 text-white hover:border-white/10' 
                        : 'bg-gray-50 border-gray-250 text-black hover:border-gray-300'
                    }`}
                    placeholder={`Describe requirement bounds for ${service.title}...`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-400 text-black py-4 rounded-xl font-bold font-mono tracking-widest text-[10px] uppercase hover:bg-cyan-300 transition duration-200 shadow-md hover:shadow-cyan-400/20 cursor-pointer mt-4 flex items-center justify-center space-x-2"
                >
                  <span>EXECUTE CONSULTATION REQUEST</span>
                  <span className="text-xs">→</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
