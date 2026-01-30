import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import StarBorder from './StarBorder';
import PaymentStatusModal from './PaymentStatusModal';
import { ArrowLeft, Clock, Award, CheckCircle, BookOpen, Target, Zap } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface CourseModule {
  title: string;
  duration: string;
  topics: string[];
}

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  detailedDescription: string;
  technologies: string[];
  price: number;
  originalPrice?: number;
  duration: string;
  projects: number;
  certification?: string;
  premiumFeatures?: string[];
  modules: CourseModule[];
  prerequisites: string[];
  whatYouWillLearn: string[];
}

/*
declare global {
  interface Window {
    Razorpay: any;
  }
}
*/

const CourseEnrollment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showQRPayment, setShowQRPayment] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'waiting_for_confirmation' | 'confirmed' | 'rejected' | 'unknown'>('waiting_for_confirmation');

  const handleBackToCourses = () => {
    navigate('/student-portal', { state: { activeTab: 'browse-courses' } });
  };

  const courses: Course[] = [
    {
      id: 'AI-TOOLS-MASTERY',
      title: 'A.I Tools Mastery - Professional Certification Program',
      category: 'ai',
      level: 'professional',
      description: '🏆 INDUSTRY-LEADING AI MASTERY PROGRAM | Master 50+ cutting-edge AI tools with hands-on industry projects. From DALL-E 3 & Midjourney to Claude API & enterprise automation. Includes 1-on-1 mentorship, portfolio development, job placement assistance, and lifetime access to updates.',
      detailedDescription: 'This premium 24-week professional certification program is designed for serious AI practitioners and business professionals. Master 50+ cutting-edge AI tools through hands-on industry projects, build a professional portfolio, and receive personalized mentorship from former OpenAI research scientists. Includes enterprise-grade training, job placement assistance, and lifetime access to course updates.',
      technologies: ['DALL-E 3', 'Midjourney', 'Runway ML', 'Claude API', 'n8n', 'Promptly AI', 'JSON Prompts', 'Stable Diffusion', 'Synthesia', 'Luma AI', 'Pika Labs', 'Make.com', 'Zapier'],
      price: 12000,
      originalPrice: 25000,
      duration: '24 weeks + Lifetime Access',
      projects: 12,
      certification: 'Industry-Recognized AI Tools Professional Certificate',
      premiumFeatures: [
        '🎯 1-on-1 Weekly Mentorship Sessions',
        '💼 Professional Portfolio Development',
        '🚀 Job Placement Assistance Program',
        '🔄 Lifetime Access & Course Updates',
        '🏢 Enterprise Project Simulations',
        '📊 Performance Analytics & Tracking'
      ],
      modules: [
        {
          title: 'Module 1: Professional Image Creation & Brand Design',
          duration: '4 weeks',
          topics: ['DALL-E 3 Enterprise Techniques', 'Midjourney Professional Brand Workflows', 'Stable Diffusion Custom Model Training', 'Promptly AI Advanced Optimization', 'Commercial Image Enhancement', 'Brand Identity Creation', 'Copyright & Licensing Mastery', 'Client Presentation Techniques']
        },
        {
          title: 'Module 2: Cinematic Video Production & AI Storytelling',
          duration: '4 weeks',
          topics: ['Runway ML Professional Video Generation', 'Synthesia Enterprise AI Avatars', 'Luma AI Cinematic Sequences', 'Pika Labs Advanced Animation', 'AI-Powered Video Editing', 'Professional Storytelling Techniques', 'Client Video Production', 'Video Marketing Strategies']
        },
        {
          title: 'Module 3: Advanced Animation & Motion Graphics',
          duration: '4 weeks',
          topics: ['Runway Gen-2 Professional Animation', 'Stable Video Diffusion Mastery', 'Pika Labs Motion Control', 'Advanced Motion Brush Techniques', 'Cinematic Camera Movements', 'Professional Animation Workflows', 'Client Animation Projects', 'Motion Graphics for Business']
        },
        {
          title: 'Module 4: Enterprise Data Solutions & API Mastery',
          duration: '4 weeks',
          topics: ['Advanced JSON Prompt Engineering', 'Enterprise Data Generation', 'Professional API Integration', 'Custom Schema Architecture', 'Automated Business Workflows', 'Data Quality & Validation', 'Enterprise Security Practices', 'Scalable Data Solutions']
        },
        {
          title: 'Module 5: Business Automation & AI Agent Development',
          duration: '4 weeks',
          topics: ['n8n Enterprise Automation', 'Zapier Professional Integrations', 'Make.com Advanced Business Scenarios', 'Custom AI Agent Architecture', 'Multi-Platform Enterprise Integration', 'Business Process Optimization', 'ROI-Driven Automation', 'Client Automation Solutions']
        },
        {
          title: 'Module 6: Claude AI Enterprise Implementation',
          duration: '4 weeks',
          topics: ['Claude API Enterprise Integration', 'Advanced Prompt Engineering Mastery', 'Claude Projects & Custom Artifacts', 'Enterprise Application Development', 'Scalable Claude Implementation', 'API Optimization & Cost Management', 'Security & Compliance', 'Client Solution Development']
        }
      ],
      prerequisites: ['Professional work experience', 'Basic understanding of APIs', 'Commitment to 15+ hours/week study', 'Access to high-speed internet'],
      whatYouWillLearn: [
        '🎯 Master 50+ Enterprise-Grade AI Tools & Platforms',
        '💼 Build Professional AI-Powered Business Solutions',
        '🚀 Create Scalable Enterprise Automation Workflows',
        '📊 Develop Data-Driven AI Applications with APIs',
        '🎨 Generate Professional Visual Content for Clients',
        '🤖 Design Custom AI Agents for Business Processes',
        '💰 Monetize AI Skills with Freelance & Consulting Opportunities',
        '🏆 Earn Industry-Recognized Professional Certification',
        '📈 Implement ROI-Driven AI Solutions for Enterprises',
        '🔒 Apply Enterprise Security & Compliance Best Practices'
      ]
    },
    {
      id: 'FRONTEND-BEGINNER',
      title: 'Frontend Development - Beginner',
      category: 'frontend',
      level: 'beginner',
      description: 'Master the fundamentals of web development with HTML, CSS, JavaScript, and MongoDB basics',
      detailedDescription: 'This comprehensive beginner course will take you from zero to building interactive websites. You\'ll learn the core technologies that power the modern web including HTML structure, CSS styling, JavaScript programming fundamentals, and MongoDB database basics.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'MongoDB'],
      price: 1200,
      duration: '8 weeks',
      projects: 3,
      modules: [
        {
          title: 'HTML Fundamentals',
          duration: '2 weeks',
          topics: ['HTML Structure', 'Semantic HTML', 'Forms and Input', 'HTML5 Features']
        },
        {
          title: 'CSS Styling',
          duration: '3 weeks',
          topics: ['CSS Selectors', 'Box Model', 'Flexbox', 'Grid Layout', 'Responsive Design']
        },
        {
          title: 'JavaScript Basics',
          duration: '3 weeks',
          topics: ['Variables and Data Types', 'Functions', 'DOM Manipulation', 'Event Handling']
        }
      ],
      prerequisites: ['Basic computer skills', 'No prior coding experience required'],
      whatYouWillLearn: [
        'Build responsive websites from scratch',
        'Master HTML5 semantic elements',
        'Style websites with CSS3',
        'Program with JavaScript fundamentals',
        'Create interactive web elements',
        'Deploy websites to the internet'
      ]
    },
    {
      id: 'FRONTEND-INTERMEDIATE',
      title: 'Frontend Development - Intermediate',
      category: 'frontend',
      level: 'intermediate',
      description: 'Learn Django fundamentals, databases (MySQL & MongoDB), API integration, environment configuration, and web security best practices. Build backend-powered web applications while strengthening frontend integration skills.',
      detailedDescription: 'This intermediate course bridges frontend and backend development. You will build web applications using Django (MVC), integrate MySQL and MongoDB, consume and secure REST APIs, manage environment configuration, and apply security best practices to real-world projects.',
      technologies: [
        'HTML', 'Django', 'MySQL', 'MongoDB', 'ORM', 'MVC', 'API Integration', 'Environment Variables', 'Web Security'
      ],
      price: 1950,
      duration: '10 weeks',
      projects: 4,
      modules: [
        {
          title: 'Module 1: Django Fundamentals & MVC',
          duration: '3 weeks',
          topics: ['Project setup', 'Apps & URL routing', 'Views & templates', 'Models & ORM']
        },
        {
          title: 'Module 2: Relational & Document Databases',
          duration: '3 weeks',
          topics: ['MySQL schema design', 'MongoDB collections', 'Data modeling patterns', 'CRUD operations']
        },
        {
          title: 'Module 3: API Integration & Environment Config',
          duration: '2 weeks',
          topics: ['REST APIs & requests', 'Authentication tokens', 'Environment variables (.env)', 'Config management']
        },
        {
          title: 'Module 4: Web Security Best Practices',
          duration: '2 weeks',
          topics: ['Input validation', 'Authentication & sessions', 'CSRF protection', 'Secure deployment']
        }
      ],
      prerequisites: ['Frontend beginner knowledge or equivalent', 'Basic JavaScript', 'Basic database concepts'],
      whatYouWillLearn: [
        'Use Django MVC architecture to build web apps',
        'Design relational and document databases effectively',
        'Integrate REST APIs with secure authentication',
        'Manage environment configuration for deployments',
        'Apply core web security practices in your projects'
      ]
    },
    {
      id: 'FRONTEND-ADVANCED',
      title: 'Frontend Development - Advanced',
      category: 'frontend',
      level: 'advanced',
      description: 'Master advanced frontend concepts including performance optimization and state management',
      detailedDescription: 'Take your frontend development skills to the expert level with advanced React patterns, performance optimization techniques, complex state management, and modern development workflows.',
      technologies: ['React', 'TypeScript', 'Redux', 'Webpack', 'Testing'],
      price: 2500,
      duration: '12 weeks',
      projects: 6,
      modules: [
        {
          title: 'Advanced React Patterns',
          duration: '3 weeks',
          topics: ['Context API', 'Custom Hooks', 'Higher-Order Components', 'Render Props']
        },
        {
          title: 'State Management',
          duration: '3 weeks',
          topics: ['Redux Toolkit', 'Zustand', 'React Query', 'Global State Patterns']
        },
        {
          title: 'Performance Optimization',
          duration: '3 weeks',
          topics: ['Code Splitting', 'Lazy Loading', 'Memoization', 'Bundle Analysis']
        },
        {
          title: 'Advanced Tooling',
          duration: '3 weeks',
          topics: ['Webpack Configuration', 'TypeScript', 'Testing Strategies', 'CI/CD']
        }
      ],
      prerequisites: ['Intermediate React knowledge', 'JavaScript ES6+', 'Basic TypeScript'],
      whatYouWillLearn: [
        'Implement advanced React patterns and architectures',
        'Optimize application performance and bundle size',
        'Master complex state management solutions',
        'Build scalable and maintainable applications',
        'Implement comprehensive testing strategies',
        'Deploy production-ready applications'
      ]
    },
    {
      id: 'DEVOPS-BEGINNER',
      title: 'DevOps - Beginner',
      category: 'devops',
      level: 'beginner',
      description: 'Learn the fundamentals of DevOps with Docker, CI/CD, and cloud deployment basics',
      detailedDescription: 'Start your DevOps journey with this comprehensive beginner course. Learn essential tools and practices including version control, containerization, automation, and cloud deployment fundamentals.',
      technologies: ['Docker', 'Git', 'Linux', 'CI/CD', 'AWS'],
      price: 1000,
      duration: '8 weeks',
      projects: 4,
      modules: [
        {
          title: 'DevOps – Beginner',
          duration: '2 weeks',
          topics: ['DevOps Culture', 'Version Control with Git', 'Linux Basics', 'Command Line']
        },
        {
          title: 'Basic Automation',
          duration: '2 weeks',
          topics: ['Shell Scripting', 'Basic CI/CD', 'Automated Testing', 'Build Tools']
        },
        {
          title: 'Deployment Basics',
          duration: '2 weeks',
          topics: ['Server Management', 'Basic Docker', 'Environment Configuration']
        },
        {
          title: 'Monitoring & Logging',
          duration: '2 weeks',
          topics: ['Basic Monitoring', 'Log Management', 'Performance Metrics']
        }
      ],
      prerequisites: ['Basic computer skills', 'Understanding of software development'],
      whatYouWillLearn: [
        'Understand DevOps culture and practices',
        'Master version control with Git',
        'Learn Linux command line basics',
        'Implement basic CI/CD pipelines',
        'Deploy applications to cloud platforms',
        'Monitor and troubleshoot applications'
      ]
    },
    {
      id: 'DEVOPS-ADVANCED',
      title: 'DevOps - Advanced',
      category: 'devops',
      level: 'advanced',
      description: 'Master advanced DevOps practices with Kubernetes and infrastructure as code',
      detailedDescription: 'Take your DevOps skills to the expert level with advanced container orchestration, infrastructure automation, monitoring strategies, and enterprise-grade deployment practices.',
      technologies: ['Kubernetes', 'Terraform', 'Jenkins', 'Prometheus', 'Grafana'],
      price: 1400,
      duration: '14 weeks',
      projects: 7,
      modules: [
        {
          title: 'Container Orchestration',
          duration: '4 weeks',
          topics: ['Kubernetes Architecture', 'Pod Management', 'Services & Ingress', 'Scaling Strategies']
        },
        {
          title: 'Infrastructure as Code',
          duration: '3 weeks',
          topics: ['Terraform', 'Ansible', 'CloudFormation', 'Infrastructure Automation']
        },
        {
          title: 'Advanced CI/CD',
          duration: '4 weeks',
          topics: ['Jenkins Advanced', 'GitLab CI', 'Blue-Green Deployment', 'Canary Releases']
        },
        {
          title: 'Monitoring & Security',
          duration: '3 weeks',
          topics: ['Prometheus & Grafana', 'ELK Stack', 'Security Best Practices', 'Compliance Automation']
        }
      ],
      prerequisites: ['DevOps Beginner knowledge', 'Linux experience', 'Basic networking'],
      whatYouWillLearn: [
        'Master Kubernetes container orchestration',
        'Implement infrastructure as code with Terraform',
        'Build advanced CI/CD pipelines',
        'Set up comprehensive monitoring and alerting',
        'Implement security best practices',
        'Manage enterprise-scale deployments'
      ]
    },
    {
      id: 'NETWORKING-BEGINNER',
      title: 'Networking - Beginner',
      category: 'networking',
      level: 'beginner',
      description: 'Foundation in networking: OSI/TCP-IP, basic protocols, Packet Tracer, Nmap, Wireshark.',
      detailedDescription: 'Build a strong foundation in computer networks, devices, addressing, and analysis tools with hands-on labs using Cisco Packet Tracer, Nmap, and Wireshark.',
      technologies: ['Cisco Packet Tracer', 'Nmap', 'Wireshark', 'Routers', 'Switches', 'Firewalls'],
      price: 1500,
      duration: '8 weeks',
      projects: 4,
      modules: [
        { title: 'Networking Fundamentals', duration: '2 weeks', topics: ['OSI Model', 'TCP/IP', 'IPv4/IPv6', 'DNS/DHCP'] },
        { title: 'Packet Tracer Basics', duration: '2 weeks', topics: ['Router/Switch setup', 'LAN/WAN topology', 'IP addressing'] },
        { title: 'Nmap & Wireshark', duration: '2 weeks', topics: ['Host discovery', 'Port scanning', 'Packet capture', 'Traffic filtering'] }
      ],
      prerequisites: ['Basic computer knowledge'],
      whatYouWillLearn: ['Understand core networking', 'Configure small networks', 'Analyze traffic with Wireshark']
    },

    {
      id: 'NETWORKING-INTERMEDIATE',
      title: 'Networking - Intermediate',
      category: 'networking',
      level: 'intermediate',
      description: 'Linux networking, routing/switching, VPNs, firewalls, monitoring and automation basics.',
      detailedDescription: 'Advance your networking skills using Linux tooling, routing and switching concepts, VPNs, and real-world monitoring workflows with hands-on labs.',
      technologies: ['Linux', 'SSH', 'tcpdump', 'iptables/ufw', 'OpenVPN', 'WireGuard', 'SNMP', 'Nagios/Zabbix'],
      price: 2200,
      duration: '10 weeks',
      projects: 6,
      modules: [
        { title: 'Linux Networking Advanced', duration: '2 weeks', topics: ['ip/nmcli', 'routes', 'DNS config', 'namespaces'] },
        { title: 'Scanning & Analysis', duration: '2 weeks', topics: ['NSE basics', 'masscan', 'tcpdump filters'] },
        { title: 'Routing/Switching & VPNs', duration: '2 weeks', topics: ['Linux router', 'VLANs', 'Bonding', 'OpenVPN/WireGuard'] },
        { title: 'Firewalls & Monitoring', duration: '2 weeks', topics: ['iptables/ufw', 'Nagios/Zabbix', 'SNMP'] },
        { title: 'Automation & Scripting', duration: '2 weeks', topics: ['Netcat', 'Bash scripting', 'Config automation'] }
      ],
      prerequisites: ['Networking basics or equivalent'],
      whatYouWillLearn: ['Configure routing/switching', 'Set up VPNs/firewalls', 'Monitor and troubleshoot networks']
    },
    {
      id: 'NETWORKING-ADVANCED',
      title: 'Networking – Advanced (CCNA Certification Track)',
      category: 'networking',
      level: 'advanced',
      description: 'Enterprise networking, routing/switching, VLANs, ACLs, NAT, wireless, automation; CCNA-ready.',
      detailedDescription: 'Master enterprise-grade networking aligned to CCNA 200-301 with extensive Packet Tracer labs covering routing, switching, VLANs, ACLs, NAT, wireless, and programmability.',
      technologies: ['Cisco IOS', 'Packet Tracer', 'IPv4/IPv6', 'OSPF', 'VLANs', 'ACLs', 'NAT', 'Wireless', 'REST APIs', 'Python'],
      price: 3000,
      duration: '12 weeks',
      projects: 10,
      modules: [
        { title: 'Network Fundamentals', duration: '2 weeks', topics: ['IP addressing', 'Subnetting', 'Routing basics', 'Switching basics'] },
        { title: 'Network Access', duration: '3 weeks', topics: ['VLANs', 'Trunking', 'STP', 'Port Security', 'EtherChannel'] },
        { title: 'IP Connectivity & Services', duration: '3 weeks', topics: ['Static routing', 'OSPF', 'DHCP', 'DNS', 'NAT'] },
        { title: 'Security & Wireless', duration: '2 weeks', topics: ['ACLs', 'Wireless basics', 'SNMP'] },
        { title: 'Automation & Labs', duration: '2 weeks', topics: ['REST APIs', 'Python basics', 'End-to-end CCNA lab'] }
      ],
      prerequisites: ['Intermediate networking'],
      whatYouWillLearn: ['Configure enterprise networks', 'Prepare for CCNA exam', 'Automate basic tasks']
    },
    {
      id: 'GENAI-BEGINNER',
      title: "Generative AI (Understanding and Building LLM's) - Beginner Level",
      category: 'ai',
      level: 'beginner',
      description: 'Intro to LLMs, transformers, embeddings, APIs, and prompt engineering; build a chat app.',
      detailedDescription: 'Learn the foundations of generative AI and LLMs, prompt engineering, embeddings, and tooling to build a simple assistant end-to-end.',
      technologies: ['Python', 'OpenAI API', 'Hugging Face', 'Transformers', 'Embeddings', 'LangChain'],
      price: 1800,
      duration: '8 weeks',
      projects: 3,
      modules: [
        { title: 'Foundations of Generative AI', duration: '1 week', topics: ['LLMs overview', 'Use cases'] },
        { title: 'Transformers & Embeddings', duration: '2 weeks', topics: ['Attention', 'Tokens', 'Vector stores'] },
        { title: 'Prompt Engineering & APIs', duration: '3 weeks', topics: ['Prompt design', 'OpenAI API', 'LangChain'] },
        { title: 'Mini Project', duration: '2 weeks', topics: ['Streamlit UI', 'FastAPI backend'] }
      ],
      prerequisites: ['Basic Python familiarity'],
      whatYouWillLearn: ['Use LLM APIs', 'Design effective prompts', 'Build a basic chat assistant']
    },
    {
      id: 'GENAI-INTERMEDIATE',
      title: "Generative AI (Understanding and Building LLM's) - Intermediate Level",
      category: 'ai',
      level: 'intermediate',
      description: 'RAG systems, LoRA/PEFT fine-tuning, tokenization, evaluation, and guardrails.',
      detailedDescription: 'Build production-grade LLM applications with RAG pipelines, adapters for fine-tuning, evaluation frameworks, and safety guardrails.',
      technologies: ['PyTorch', 'HF Transformers', 'Datasets', 'Tokenizers', 'LangChain', 'FAISS/Pinecone', 'FastAPI', 'Docker', 'W&B'],
      price: 2400,
      duration: '10 weeks',
      projects: 5,
      modules: [
        { title: 'Tokenization & Datasets', duration: '1 week', topics: ['Subword tokenizers', 'HF Datasets'] },
        { title: 'RAG Architecture', duration: '2 weeks', topics: ['Indexing', 'Query pipelines'] },
        { title: 'Fine-tuning with LoRA/PEFT', duration: '2 weeks', topics: ['Adapters', 'Training loops'] },
        { title: 'Guardrails & Safety', duration: '1 week', topics: ['Prompt safety', 'Content filters'] },
        { title: 'Packaging & Deployment', duration: '2 weeks', topics: ['Docker', 'FastAPI', 'CI/CD'] }
      ],
      prerequisites: ['Beginner GenAI knowledge'],
      whatYouWillLearn: ['Design RAG', 'Fine-tune with adapters', 'Evaluate and deploy LLM apps']
    },
    {
      id: 'GENAI-ADVANCED',
      title: "Generative AI (Understanding and Building LLM's) - Advanced Level",
      category: 'ai',
      level: 'advanced',
      description: 'Pretraining, RLHF/DPO, distributed training, quantization, scaling and MLOps.',
      detailedDescription: 'Master advanced LLM training and serving with distributed strategies, RLHF/DPO, quantization, and robust MLOps.',
      technologies: ['PyTorch', 'DeepSpeed', 'FSDP', 'PEFT', 'BitsAndBytes', 'RLHF/DPO', 'GGUF/GPTQ', 'Kubernetes', 'Ray'],
      price: 3500,
      duration: '12 weeks',
      projects: 8,
      modules: [
        { title: 'LLM Pretraining', duration: '2 weeks', topics: ['Objectives', 'Data pipelines'] },
        { title: 'Distributed Training', duration: '3 weeks', topics: ['FSDP', 'DeepSpeed', 'Sharding'] },
        { title: 'Quantization & Inference', duration: '2 weeks', topics: ['GGUF/GPTQ', 'BitsAndBytes'] },
        { title: 'RLHF & DPO', duration: '3 weeks', topics: ['Reward modeling', 'Policies'] },
        { title: 'MLOps for LLMs', duration: '2 weeks', topics: ['Kubernetes', 'Ray', 'Monitoring'] }
      ],
      prerequisites: ['Intermediate GenAI knowledge'],
      whatYouWillLearn: ['Train/fine-tune at scale', 'Serve optimized models', 'Operate LLMs in production']
    },
    {
      id: 'CYBER-SECURITY-BEGINNER',
      title: 'Cyber Security - Beginner',
      category: 'cyber',
      level: 'beginner',
      description: 'Core security concepts, OS basics, Nmap, Wireshark, firewalls, and attack fundamentals.',
      detailedDescription: 'Start your cybersecurity journey with foundational concepts, hands-on tooling, and introduction to common attacks and defenses.',
      technologies: ['Linux', 'Windows', 'Kali', 'Parrot OS', 'Nmap', 'Wireshark', 'Gobuster', 'BloodHound', 'Firewalls'],
      price: 1600,
      duration: '8 weeks',
      projects: 6,
      modules: [
        { title: 'Security Fundamentals', duration: '2 weeks', topics: ['CIA triad', 'Threats', 'Malware', 'Policies'] },
        { title: 'Operating Systems for Security', duration: '2 weeks', topics: ['Windows', 'Linux', 'Kali/Parrot'] },
        { title: 'Networking Tools', duration: '2 weeks', topics: ['Nmap basics', 'Wireshark capture/filtering'] },
        { title: 'Enumeration & Firewalls', duration: '2 weeks', topics: ['Gobuster', 'BloodHound', 'Firewall rules'] }
      ],
      prerequisites: ['Basic IT knowledge'],
      whatYouWillLearn: ['Use core security tools', 'Analyze network traffic', 'Understand basic attacks']
    },
    {
      id: 'CYBER-SECURITY-INTERMEDIATE',
      title: 'Cyber Security - Intermediate',
      category: 'cyber',
      level: 'intermediate',
      description: 'Advanced hacking methodologies, cracking tools, backdoors, SQLi, social engineering, reporting.',
      detailedDescription: 'Practice offensive security workflows with common tools and methodologies, then learn reporting and defensive measures.',
      technologies: ['Kali', 'John', 'Hydra', 'Hashcat', 'Netcat', 'msfvenom', 'Meterpreter', 'SQLMap', 'SET'],
      price: 2400,
      duration: '10 weeks',
      projects: 12,
      modules: [
        { title: 'Password Cracking & Enumeration', duration: '2 weeks', topics: ['John/Hydra', 'Hashcat', 'CeWL'] },
        { title: 'Exploitation & Backdoors', duration: '3 weeks', topics: ['msfvenom', 'Meterpreter', 'Reverse shells'] },
        { title: 'Web Attacks', duration: '2 weeks', topics: ['SQLi', 'XSS', 'Burp basics'] },
        { title: 'Social Engineering', duration: '1 week', topics: ['Phishing with SET', 'Payload delivery'] },
        { title: 'Post-Exploitation & Reporting', duration: '2 weeks', topics: ['Persistence', 'Lateral movement', 'Documentation'] }
      ],
      prerequisites: ['Beginner cybersecurity knowledge'],
      whatYouWillLearn: ['Conduct basic pentests', 'Use common offensive tools', 'Document findings']
    },
    {
      id: 'CYBER-SECURITY-ADVANCED',
      title: 'Cyber Security - Advanced',
      category: 'cyber',
      level: 'advanced',
      description: 'Security+ mapping, cloud/IAM, crypto, EDR/XDR, forensics, incident response, SIEM.',
      detailedDescription: 'Comprehensive coverage of advanced security domains including identity, cryptography, endpoint hardening, cloud security, SIEM, and digital forensics.',
      technologies: ['OpenSSL', 'GPG', 'EDR/XDR', 'Wireshark', 'tcpdump', 'Splunk/Wazuh', 'Autopsy', 'Volatility', 'Docker', 'AWS/Azure'],
      price: 3000,
      duration: '12 weeks',
      projects: 10,
      modules: [
        { title: 'Identity & Access', duration: '2 weeks', topics: ['MFA', 'RBAC/ABAC', 'SSO'] },
        { title: 'Cryptography & Secure Comms', duration: '2 weeks', topics: ['TLS/SSL', 'PKI', 'Hashing/Salting'] },
        { title: 'Endpoint Security & Hardening', duration: '2 weeks', topics: ['EDR/XDR', 'Whitelisting', 'Patch mgmt'] },
        { title: 'Ethical Hacking & Pentesting', duration: '2 weeks', topics: ['Recon', 'Exploit', 'Escalation'] },
        { title: 'Incident Response & Forensics', duration: '2 weeks', topics: ['IR lifecycle', 'Disk/memory forensics', 'SIEM operations'] } 
      ],
      prerequisites: ['Intermediate cybersecurity knowledge'],
      whatYouWillLearn: ['Design secure architectures', 'Respond to incidents', 'Prepare for certifications']
    },
    {
      id: 'DATA-SCIENCE-BEGINNER',
      title: 'Data Science - Beginner',
      category: 'data-science',
      level: 'beginner',
      description: 'Python, data wrangling, and exploratory analysis fundamentals.',
      detailedDescription: 'Build a solid foundation in Python for data, learn to clean and transform datasets, and perform exploratory analysis and visualization to derive insights.',
      technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
      price: 1600,
      duration: '8 weeks',
      projects: 4,
      modules: [
        { title: 'Python Foundations for Data', duration: '2 weeks', topics: ['Syntax', 'Data types', 'Functions'] },
        { title: 'Data Wrangling & Cleaning', duration: '2 weeks', topics: ['Pandas basics', 'Missing values', 'Joins'] },
        { title: 'Exploratory Data Analysis', duration: '2 weeks', topics: ['Descriptive stats', 'Visualization'] },
        { title: 'Mini Project', duration: '2 weeks', topics: ['EDA report on a public dataset'] }
      ],
      prerequisites: ['Basic programming knowledge'],
      whatYouWillLearn: ['Process data with Pandas', 'Analyze datasets', 'Create compelling visuals']
    },
    {
      id: 'DATA-SCIENCE-INTERMEDIATE',
      title: 'Data Science - Intermediate',
      category: 'data-science',
      level: 'intermediate',
      description: 'Statistics, feature engineering, model training, and validation.',
      detailedDescription: 'Go deeper into statistical concepts and build predictive models using scikit-learn. Learn robust feature engineering and evaluation best practices.',
      technologies: ['Scikit-learn', 'Statsmodels', 'Jupyter', 'Pandas'],
      price: 2200,
      duration: '10 weeks',
      projects: 5,
      modules: [
        { title: 'Statistics for DS', duration: '2 weeks', topics: ['Probability', 'Distributions', 'Hypothesis tests'] },
        { title: 'Feature Engineering', duration: '2 weeks', topics: ['Encoding', 'Scaling', 'Pipelines'] },
        { title: 'Modeling & Evaluation', duration: '3 weeks', topics: ['Regression', 'Classification', 'Metrics', 'Cross-validation'] },
        { title: 'Capstone Prep', duration: '3 weeks', topics: ['Framing', 'Iteration', 'Interpretation'] }
      ],
      prerequisites: ['Beginner data science or equivalent'],
      whatYouWillLearn: ['Engineer features', 'Train models', 'Evaluate with robust metrics']
    },
    {
      id: 'DATA-SCIENCE-ADVANCED',
      title: 'Data Science - Advanced',
      category: 'data-science',
      level: 'advanced',
      description: 'Production ML, experiment tracking, deployment, and monitoring.',
      detailedDescription: 'Design end-to-end ML pipelines, track experiments and artifacts, containerize services, and deploy and monitor models in production.',
      technologies: ['XGBoost', 'LightGBM', 'MLflow', 'Docker', 'FastAPI'],
      price: 2700,
      duration: '12 weeks',
      projects: 6,
      modules: [
        { title: 'Advanced Modeling', duration: '3 weeks', topics: ['Tree ensembles', 'Hyperparameters', 'Imbalanced data'] },
        { title: 'Experiment Tracking & Pipelines', duration: '3 weeks', topics: ['MLflow', 'Artifacts', 'Reproducibility'] },
        { title: 'Deployment & Monitoring', duration: '3 weeks', topics: ['FastAPI', 'Docker', 'Serving', 'Drift detection'] },
        { title: 'Capstone: Production ML', duration: '3 weeks', topics: ['Pipeline', 'Docs', 'Presentation'] }
      ],
      prerequisites: ['Intermediate data science or ML experience'],
      whatYouWillLearn: ['Build production pipelines', 'Deploy models', 'Monitor performance']
    }
  ];

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      setFinalPrice(foundCourse.price);
    } else {
      handleBackToCourses();
    }
  }, [courseId]);

  const applyReferralCode = async () => {
    if (!course || !referralCode.trim()) return;
    
    console.log('Applying referral code:', referralCode.trim());
    console.log('Course price:', course.price);
    
    try {
      // First try faculty referral codes
      console.log('Calling faculty API...');
      const facultyResponse = await fetch(`${BASE_URL}/api/faculty/validate-referral`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode: referralCode.trim(),
          coursePrice: course.price
        }),
      });
      
      let facultyData: any = null;
      let facultyText = '';
      try {
        facultyData = await facultyResponse.json();
      } catch (e) {
        facultyText = await facultyResponse.text();
      }
      console.log('Faculty response status:', facultyResponse.status);
      console.log('Faculty response data:', facultyData || facultyText);
      
      if (facultyResponse.ok && facultyData && facultyData.success && facultyData.data) {
        const discountValue = course.price - facultyData.data.finalPrice;
        setDiscountAmount(discountValue);
        setFinalPrice(facultyData.data.finalPrice);
        setDiscountApplied(true);
        const savings = discountValue;
        const discountPercent = Math.round((savings / course.price) * 100);
        alert(`Referral code applied successfully! You saved ₹${savings.toLocaleString()} (${discountPercent}% off)`);
        return;
      }
      
      // If faculty code fails, try general referral codes
      console.log('Faculty code failed, trying general referral codes...');
      const generalResponse = await fetch(`${BASE_URL}/api/courses/verify-referral`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode: referralCode.toUpperCase()
        })
      });
      
      let generalData: any = null;
      let generalText = '';
      try {
        generalData = await generalResponse.json();
      } catch (e) {
        generalText = await generalResponse.text();
      }
      console.log('General response status:', generalResponse.status);
      console.log('General response data:', generalData || generalText);
      
      if (generalResponse.ok && generalData && generalData.success && generalData.valid) {
        const discount = generalData.discount;
        const discountValue = (course.price * discount) / 100;
        setDiscountAmount(discountValue);
        setFinalPrice(course.price - discountValue);
        setDiscountApplied(true);
        alert(`Referral code applied successfully! You saved ₹${discountValue.toLocaleString()} (${discount}% off)`);
      } else {
        console.log('Both faculty and general referral codes failed');
        alert('Invalid referral code');
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      alert('Error validating referral code. Please try again.');
    }
  };

  const handlePayment = async () => {
    if (!course) return;

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.email) {
      alert('Please login to enroll in the course');
      navigate('/student-login');
      return;
    }

    // Validate payment amount
    if (finalPrice <= 0) {
      alert('Invalid payment amount. Please refresh the page and try again.');
      return;
    }

    // Show QR payment interface
    setShowQRPayment(true);
  };

  const handleSubmitPayment = async () => {
    if (!course || !transactionId.trim()) {
      alert('Please enter a valid transaction ID');
      return;
    }

    setIsSubmittingPayment(true);

    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      console.log('Submitting payment with transaction ID:', {
        course: course.title,
        originalPrice: course.price,
        finalPrice: finalPrice,
        discountApplied: discountApplied,
        discountAmount: discountAmount,
        referralCode: referralCode,
        transactionId: transactionId,
        user: currentUser.email
      });

      // Prepare courseId variants to handle backend differences (prod vs local)
      const baseId = (course.id || '').trim();
      const courseIdVariants = Array.from(new Set([
        baseId,
        baseId.toUpperCase(),
        baseId.toLowerCase()
      ].filter(Boolean)));

      let enrollResponse: Response | null = null;
      let enrollResult: any = null;
      let lastErrorMessage = '';

      for (const variant of courseIdVariants) {
        console.log('Attempting enrollment with courseId variant:', variant);
        const enrollmentData = {
          courseId: variant,
          paymentDetails: {
            amount: finalPrice,
            method: 'upi',
            transactionId: transactionId
          },
          referralCode: referralCode || null
        };

        // Send enrollment to backend
        const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
        const resp = await fetch(`${BASE_URL}/api/students/${currentUser.id}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(enrollmentData)
        });

        enrollResponse = resp;
        try {
          enrollResult = await resp.json();
        } catch (e) {
          // Fallback when response is not JSON
          const txt = await resp.text();
          enrollResult = { success: false, message: txt };
        }
        console.log('Backend enrollment response (variant:', variant, '):', enrollResult);

        if (resp.ok && enrollResult?.success) {
          // Success -> stop retrying
          break;
        }

        // Capture error and retry on known course lookup failures
        lastErrorMessage = String(enrollResult?.message || `HTTP ${resp.status}`);
        const isCourseNotFound = lastErrorMessage.toLowerCase().includes('course not found');
        if (!isCourseNotFound) {
          // Different error -> don't retry further variants
          break;
        }
      }

      if (enrollResponse && enrollResponse.ok && enrollResult?.success) {
        setIsSubmittingPayment(false);
        setShowQRPayment(false);
        setPaymentStatus('waiting_for_confirmation');
        setShowStatusModal(true);
      } else {
        throw new Error(lastErrorMessage || 'Failed to submit payment details');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setIsSubmittingPayment(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`There was an error submitting your payment details: ${errorMessage}. Please try again.`);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Course not found</h2>
            <button
              onClick={handleBackToCourses}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToCourses}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                  {course.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-300 text-lg mb-6">{course.description}</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-400" size={20} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-green-400" size={20} />
                  <span>{course.projects} Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="text-yellow-400" size={20} />
                  <span>Certificate</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Technologies You'll Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {course.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-800 text-blue-400 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
                <ul className="space-y-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Course Modules</h3>
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{module.title}</h4>
                        <span className="text-sm text-gray-400">{module.duration}</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="text-orange-400 mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-300">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 rounded-xl p-6 sticky top-8"
            >
              <h3 className="text-2xl font-bold mb-6">Enroll Now</h3>
              
              {/* Pricing */}
              <div className="mb-6">
                {discountApplied ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Original Price:</span>
                      <span className="text-gray-400 line-through">₹{course.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400">Discount ({referralCode}):</span>
                      <span className="text-green-400">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Final Price:</span>
                      <span className="text-green-400">₹{finalPrice.toLocaleString()}</span>
                    </div>
                    <div className="text-center text-sm text-green-400">
                      You save ₹{discountAmount.toLocaleString()} ({Math.round((discountAmount / course.price) * 100)}%)
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">₹{course.price.toLocaleString()}</div>
                    <div className="text-gray-400">One-time payment</div>
                  </div>
                )}
              </div>

              {/* Referral Code - Conditional Display */}
              {course.id !== 'ai-tools-mastery' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Referral Code (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      disabled={discountApplied}
                    />
                    <button
                      onClick={applyReferralCode}
                      disabled={discountApplied || !referralCode.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discountApplied && (
                    <div className="mt-2 text-green-400 text-sm flex items-center gap-1">
                      <CheckCircle size={16} />
                      Referral code applied successfully!
                    </div>
                  )}
                </div>
              )}

              {/* Payment Button */}
              <StarBorder
                as="button"
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="w-full"
                color="cyan"
                speed="5s"
                style={{
                  opacity: isProcessingPayment ? 0.7 : 1,
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enrolling...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Zap size={20} />
                    Enroll Now
                  </div>
                )}
              </StarBorder>

              {/* QR Payment Interface */}
              {showQRPayment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <h4 className="text-lg font-semibold text-white mb-4 text-center">Complete Your Payment</h4>
                  
                  {/* QR Code */}
                  <div className="mb-6 text-center">
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <img 
                        src="/img/qr.png" 
                        alt="Payment QR Code" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">
                        Scan the QR code above with your UPI app to pay{' '}
                        <span className="text-green-400 font-semibold text-lg">
                          ₹{finalPrice.toLocaleString()}
                        </span>
                      </p>
                      {discountApplied && referralCode && (
                        <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 text-green-300 text-sm">
                          🎉 <strong>Referral Code Applied:</strong> {referralCode}
                          <br />
                          💰 <strong>You're saving:</strong> ₹{(course.price - finalPrice).toLocaleString()}
                          <br />
                          ⚡ <strong>Offer Price:</strong> ₹{finalPrice.toLocaleString()} (instead of ₹{course.price.toLocaleString()})
                        </div>
                      )}
                      <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3 text-blue-300 text-sm">
                        📱 <strong>Payment Instructions:</strong>
                        <br />
                        1. Open any UPI app (PhonePe, Google Pay, Paytm, etc.)
                        <br />
                        2. Scan the QR code above
                        <br />
                        3. Enter the exact amount: ₹{finalPrice.toLocaleString()}
                        <br />
                        4. Complete the payment and copy the transaction ID
                      </div>
                    </div>
                  </div>

                  {/* Transaction ID Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transaction ID *
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter your transaction ID after payment (e.g., 123456789012)"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-400 text-xs">
                        📋 Enter the transaction ID you received after making the payment
                      </p>
                      <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-2 text-yellow-300 text-xs">
                        ⚠️ <strong>Important:</strong> {referralCode ? 'Your referral code will be validated during payment verification.' : 'Make sure to enter the correct transaction ID.'}
                        <br />
                        � The course will appear in your "My Courses" tab immediately (with pending status).
                        <br />
                        � Course access will be granted within 24 hours after admin confirms your payment.
                      </div>
                    </div>
                  </div>

                  {/* Submit Payment Button */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowQRPayment(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitPayment}
                      disabled={!transactionId.trim() || isSubmittingPayment}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      {isSubmittingPayment ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Payment'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {!showQRPayment && (
                <div className="mt-4 text-center text-sm text-gray-400">
                  <p>✓ Lifetime access to course content</p>
                  <p>✓ Certificate of completion</p>
                  <p>✓ 24/7 community support</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          if (paymentStatus === 'waiting_for_confirmation') {
            navigate('/student-portal');
          }
        }}
        status={paymentStatus}
        transactionId={transactionId}
        courseName={course?.title}
        amount={finalPrice}
      />
    </div>
  );
};

export default CourseEnrollment;
