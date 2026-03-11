
import { frontendIntermediateModules } from './frontendIntermediateData';
import { Course, CourseModule } from './types';

export type { Course, CourseModule };

export const INITIAL_COURSES: Course[] = [
  {
    id: 'AI-TOOLS-MASTERY',
    title: 'A.I Tools Mastery - Professional Certification Program',
    category: 'ai',
    level: 'professional',
    description: '🏆 INDUSTRY-LEADING AI MASTERY PROGRAM | Master 50+ cutting-edge AI tools with hands-on industry projects. From DALL-E 3 & Midjourney to Claude API & enterprise automation. Includes 1-on-1 mentorship, portfolio development, job placement assistance, and lifetime access to updates.',
    technologies: ['DALL-E 3', 'Midjourney', 'Runway ML', 'Claude API', 'n8n', 'Promptly AI', 'JSON Prompts', 'Stable Diffusion', 'Synthesia', 'Luma AI', 'Pika Labs', 'Make.com', 'Zapier'],
    price: 12000,
    originalPrice: 25000,
    duration: '24 weeks + Lifetime Access',
    projects: 12,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
    rating: 4.9,
    students: 15000,
    maxStudents: 20000,
    instructor: 'Dr. Sarah Chen - Former OpenAI Research Scientist',
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
    icon: 'Cpu'
  },
  {
    id: 'FRONTEND-BEGINNER',
    title: 'Frontend Development - Beginner',
    category: 'frontend',
    level: 'beginner',
    description: 'Start your web development journey with HTML, CSS, and JavaScript fundamentals',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Git', 'VS Code'],
    price: 1200,
    duration: '8 weeks',
    projects: 5,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&crop=center',
    rating: 4.6,
    students: 15678,
    maxStudents: 20000,
    instructor: 'Mike Chen',
    modules: [
      {
        title: 'HTML Fundamentals',
        duration: '2 weeks',
        topics: ['HTML structure', 'Semantic elements', 'Forms and inputs', 'Accessibility basics']
      },
      {
        title: 'CSS Styling',
        duration: '2 weeks',
        topics: ['CSS selectors', 'Box model', 'Flexbox', 'Grid layout']
      },
      {
        title: 'JavaScript Basics',
        duration: '3 weeks',
        topics: ['Variables and functions', 'DOM manipulation', 'Events', 'ES6 features']
      },
      {
        title: 'Project Development',
        duration: '1 week',
        topics: ['Portfolio website', 'Responsive design', 'Code optimization', 'Deployment']
      }
    ],
    icon: 'Layout'
  },
  {
    id: 'FRONTEND-INTERMEDIATE',
    title: 'Frontend Development - Intermediate',
    category: 'frontend',
    level: 'intermediate',
    description: 'Deepen your understanding of JavaScript, React, and modern CSS.',
    technologies: ['React', 'TypeScript', 'Tailwind', 'Redux', 'Next.js'],
    price: 1950,
    duration: '10 weeks',
    projects: 4,
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=250&fit=crop&crop=center',
    rating: 4.7,
    students: 8453,
    maxStudents: 20000,
    instructor: 'Priya Sharma',
    modules: frontendIntermediateModules,
    icon: 'Code'
  },
  {
    id: 'FRONTEND-ADVANCED',
    title: 'Frontend Development - Advanced',
    category: 'frontend',
    level: 'advanced',
    description: 'Master modern frontend with MongoDB, Node.js, React, Django and similar tools — with integrated prompt engineering for Frontend Development',
    technologies: ['MongoDB', 'Node.js', 'React', 'Django', 'Prompt Engineering'],
    price: 9500,
    duration: '12 weeks',
    projects: 8,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center',
    rating: 4.9,
    students: 15000,
    maxStudents: 12000,
    instructor: 'David Kim',
    modules: [
      {
        title: 'Next.js Mastery',
        duration: '4 weeks',
        topics: ['SSR/SSG', 'API routes', 'Performance optimization', 'Deployment']
      },
      {
        title: 'State Management',
        duration: '3 weeks',
        topics: ['Redux Toolkit', 'Zustand', 'Context patterns', 'Data fetching']
      },
      {
        title: 'Testing & Quality',
        duration: '3 weeks',
        topics: ['Unit testing', 'Integration testing', 'E2E testing', 'Code quality']
      },
      {
        title: 'Advanced Topics',
        duration: '2 weeks',
        topics: ['Micro-frontends', 'PWA', 'Web performance', 'Security']
      }
    ],
    icon: 'Terminal'
  },
  {
    id: 'DEVOPS-BEGINNER',
    title: 'DevOps - Beginner',
    category: 'devops',
    level: 'beginner',
    description: 'Learn the fundamentals of DevOps, CI/CD, and cloud infrastructure',
    technologies: ['Docker', 'Git', 'Linux', 'AWS', 'Jenkins'],
    price: 1000,
    duration: '8 weeks',
    projects: 4,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop&crop=center',
    rating: 4.5,
    students: 8765,
    maxStudents: 20000,
    instructor: 'Alex Thompson',
    modules: [
      {
        title: 'DevOps – Beginner',
        duration: '2 weeks',
        topics: ['DevOps culture', 'Version control', 'Linux basics', 'Command line']
      },
      {
        title: 'Containerization',
        duration: '2 weeks',
        topics: ['Docker basics', 'Container orchestration', 'Docker Compose', 'Best practices']
      },
      {
        title: 'CI/CD Pipelines',
        duration: '2 weeks',
        topics: ['Jenkins setup', 'Pipeline creation', 'Automated testing', 'Deployment strategies']
      },
      {
        title: 'Cloud Basics',
        duration: '2 weeks',
        topics: ['AWS fundamentals', 'EC2 instances', 'S3 storage', 'Basic networking']
      }
    ],
    icon: 'Server'
  },
  {
    id: 'devops-intermediate',
    title: 'DevOps - Intermediate',
    category: 'devops',
    level: 'intermediate',
    description: 'Advanced DevOps practices with Kubernetes, monitoring, and infrastructure as code',
    technologies: ['Kubernetes', 'Terraform', 'Prometheus', 'Grafana', 'Ansible'],
    price: 1400,
    duration: '10 weeks',
    projects: 6,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center',
    rating: 4.6,
    students: 15000,
    maxStudents: 12000,
    instructor: 'Maria Garcia',
    modules: [
      {
        title: 'Kubernetes Fundamentals',
        duration: '3 weeks',
        topics: ['Cluster setup', 'Pods and Services', 'Deployments', 'ConfigMaps and Secrets']
      },
      {
        title: 'Infrastructure as Code',
        duration: '3 weeks',
        topics: ['Terraform basics', 'State management', 'Modules', 'Best practices']
      },
      {
        title: 'Monitoring & Logging',
        duration: '2 weeks',
        topics: ['Prometheus setup', 'Grafana dashboards', 'Log aggregation', 'Alerting']
      },
      {
        title: 'Automation',
        duration: '2 weeks',
        topics: ['Ansible playbooks', 'Configuration management', 'Deployment automation', 'Security']
      }
    ],
    icon: 'Server'
  },
  {
    id: 'mobile-core',
    title: 'Mobile Development - Core',
    category: 'mobile',
    level: 'intermediate',
    description: 'Build cross-platform mobile apps with React Native and modern development practices',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Redux', 'Firebase'],
    price: 3500,
    duration: '14 weeks',
    projects: 10,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&crop=center',
    rating: 4.8,
    students: 15000,
    maxStudents: 12000,
    instructor: 'James Wilson',
    modules: [
      {
        title: 'React Native Basics',
        duration: '4 weeks',
        topics: ['Setup and configuration', 'Components', 'Navigation', 'Styling']
      },
      {
        title: 'Advanced Features',
        duration: '4 weeks',
        topics: ['State management', 'API integration', 'Native modules', 'Performance']
      },
      {
        title: 'Backend Integration',
        duration: '3 weeks',
        topics: ['Firebase setup', 'Authentication', 'Database', 'Push notifications']
      },
      {
        title: 'Publishing & Deployment',
        duration: '3 weeks',
        topics: ['App store guidelines', 'Build process', 'Testing', 'Release management']
      }
    ],
    icon: 'Smartphone'
  },
  {
    id: 'browser-extensions',
    title: 'Browser Extensions Development',
    category: 'web',
    level: 'intermediate',
    description: 'Create powerful browser extensions for Chrome, Firefox, and Edge',
    technologies: ['JavaScript', 'Chrome APIs', 'WebExtensions', 'Manifest V3', 'React'],
    price: 1500,
    duration: '6 weeks',
    projects: 4,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center',
    rating: 4.4,
    students: 15000,
    maxStudents: 12000,
    instructor: 'Lisa Chen',
    modules: [
      {
        title: 'Extension Fundamentals',
        duration: '2 weeks',
        topics: ['Manifest files', 'Background scripts', 'Content scripts', 'Popup interfaces']
      },
      {
        title: 'Advanced APIs',
        duration: '2 weeks',
        topics: ['Storage API', 'Messaging', 'Permissions', 'Cross-browser compatibility']
      },
      {
        title: 'UI Development',
        duration: '1 week',
        topics: ['React integration', 'Styling', 'User experience', 'Accessibility']
      },
      {
        title: 'Publishing & Distribution',
        duration: '1 week',
        topics: ['Store submission', 'Review process', 'Updates', 'Analytics']
      }
    ],
    icon: 'Globe'
  },
  {
    id: 'NETWORKING-BEGINNER',
    title: 'Networking - Beginner',
    category: 'networking',
    level: 'beginner',
    description: 'Build a strong foundation in computer networks, protocols, network devices, and hands-on tools like Cisco Packet Tracer, Nmap, and Wireshark.',
    technologies: ['Cisco Packet Tracer', 'Nmap', 'Wireshark', 'Firewalls', 'Routers & Switches', 'Network Troubleshooting Tools'],
    price: 1500,
    duration: '8 weeks',
    projects: 4,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center',
    rating: 4.7,
    students: 12542,
    maxStudents: 20000,
    instructor: 'Alex Carter',
    modules: [
      {
        title: 'Networking Fundamentals',
        duration: '2 weeks',
        topics: [
          'OSI Model (All 7 Layers)',
          'TCP/IP Model',
          'IP Addressing (IPv4 & IPv6)',
          'TCP vs UDP',
          'MAC Address, ARP, DNS, DHCP',
          'Basic Protocols (HTTP, HTTPS, FTP, SMTP)',
          'Network Topologies & Architecture',
          'Concept of LAN, WAN, MAN, PAN'
        ]
      },
      {
        title: 'Cisco Packet Tracer – Network Building',
        duration: '2 weeks',
        topics: [
          'Installation & Setup',
          'Creating Your First Network',
          'Configuring Routers & Switches',
          'Assigning IP Addresses',
          'Building LAN & WAN Structures',
          'Simulating Real-Time Network Traffic',
          'Creating Your Own Mini-Lab'
        ]
      },
      {
        title: 'Nmap – Network Scanning Basics',
        duration: '1 week',
        topics: [
          'Introduction to Network Scanning',
          'Port Scanning & Host Discovery',
          'Nmap Commands',
          'Scanning Techniques (SYN Scan, UDP Scan)',
          'Detecting Services & OS Fingerprinting'
        ]
      },
      {
        title: 'Wireshark – Packet Analysis',
        duration: '1 week',
        topics: [
          'Introduction to Packet Capturing',
          'Understanding Frames, Packets & Segments',
          'Traffic Filtering',
          'Analyzing TCP/UDP Traffic',
          'Detecting Network Issues with Wireshark'
        ]
      },
      {
        title: 'Networking Troubleshooting',
        duration: '1 week',
        topics: [
          'Common Network Problems',
          'Ping, Traceroute, Netstat, ipconfig',
          'Connectivity Issues',
          'Diagnosing DNS & Routing Problems',
          'Tools and Best Practices for Troubleshooting'
        ]
      },
      {
        title: 'Network Devices & Firewalls',
        duration: '1 week',
        topics: [
          'Routers, Switches, Access Points',
          'Modems, Hubs, Repeaters, Bridges',
          'Introduction to Firewalls',
          'Types of Firewalls',
          'Basic Firewall Rules & Configuration',
          'Overview of Network Security Devices'
        ]
      }
    ],
    icon: 'Globe'
  },
  {
    id: 'NETWORKING-INTERMEDIATE',
    title: 'Networking - Intermediate',
    category: 'networking',
    level: 'intermediate',
    description: 'Master advanced networking skills using Linux-based tools, server configuration, routing, switching, monitoring, and real-world network automation workflows.',
    technologies: [
      'Linux Networking', 'SSH', 'Netcat (nc)', 'Netstat / ss', 'tcpdump', 'Traceroute / MTR',
      'iptables / ufw / firewalld', 'OpenVPN / WireGuard', 'Nagios / Zabbix', 'SNMP',
      'Bonding & VLANs', 'Routing Protocols (OSPF/BGP basics)'
    ],
    price: 2200,
    duration: '10 weeks',
    projects: 6,
    image: 'https://images.pexels.com/photos/2881232/pexels-photo-2881232.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    rating: 4.8,
    students: 9431,
    maxStudents: 20000,
    instructor: 'Nina Patel',
    modules: [
      {
        title: 'Linux Networking Fundamentals (Advanced)',
        duration: '2 weeks',
        topics: [
          'Linux network configuration (ifconfig, ip, nmcli)',
          'Understanding network interfaces, links, routes',
          'Static & dynamic routing in Linux',
          'Host files, resolv.conf, DNS configuration',
          'Socket programming basics (theory)',
          'SSH, SCP, and secure remote access',
          'Network namespaces & virtual interfaces'
        ]
      },
      {
        title: 'Advanced Network Scanning & Analysis Tools',
        duration: '2 weeks',
        topics: [
          'Deep-dive into Nmap scripting engine (NSE)',
          'Masscan for high-speed scanning',
          'Netcat (nc) for port listening & banner grabbing',
          'tcpdump advanced packet capture',
          'ss & netstat for connection tracking',
          'Scanning services, OS fingerprinting, version detection',
          'Real-world enumeration workflows'
        ]
      },
      {
        title: 'Linux-Based Firewall & Security Devices',
        duration: '2 weeks',
        topics: [
          'iptables deep configuration',
          'NAT, DNAT, SNAT, MASQUERADE rules',
          'firewalld zones, policies, and rich rules',
          'ufw for simplified firewall management',
          'Intro to pfSense (overview)',
          'Configuring port forwarding, blocking, filtering',
          'Linux as a router + firewall combo'
        ]
      },
      {
        title: 'VPNs, Tunneling & Secure Communications',
        duration: '1.5 weeks',
        topics: [
          'OpenVPN setup (server + client)',
          'WireGuard VPN configuration',
          'SSH tunneling & port forwarding',
          'SOCKS proxy with SSH',
          'GRE tunnels',
          'IPsec fundamentals',
          'Secure remote access for enterprise networks'
        ]
      },
      {
        title: 'Network Monitoring, Logging & Performance Tools',
        duration: '1.5 weeks',
        topics: [
          'SNMP setup on Linux',
          'Nagios monitoring',
          'Zabbix installation & alerts',
          'Syslog management & rotation',
          'iftop, htop, bmon, nload for bandwidth monitoring',
          'MTR & traceroute advanced usage',
          'Network baseline creation and anomaly detection'
        ]
      },
      {
        title: 'Routing, Switching & VLANs in Linux',
        duration: '1 week',
        topics: [
          'Linux as a router',
          'Routing tables & policy-based routing',
          'VLAN creation with vconfig / ip link',
          'Bonding & link aggregation (LACP)',
          'Bridging interfaces',
          'DHCP server setup (dnsmasq / isc-dhcp)',
          'Mini enterprise network creation in Linux'
        ]
      }
    ],
    icon: 'Globe'
  },
  {
    id: 'NETWORKING-ADVANCED',
    title: 'Networking – Advanced (CCNA Certification Track)',
    category: 'networking',
    level: 'advanced',
    description: 'Master enterprise networking, routing, switching, automation, and security to fully prepare for Cisco CCNA 200-301. Real-world Packet Tracer labs and CLI tasks throughout.',
    technologies: [
      'Cisco IOS CLI',
      'Cisco Packet Tracer',
      'GNS3 / EVE-NG (Intro)',
      'IPv4 & IPv6 Routing',
      'Static Routing',
      'RIP',
      'OSPF',
      'Inter-VLAN Routing',
      'NAT',
      'DHCP',
      'DNS',
      'SNMP',
      'ACLs (Standard & Extended)',
      'STP',
      'Port Security',
      'EtherChannel',
      'Wireless LAN Fundamentals',
      'Network Security Devices',
      'REST APIs',
      'Python for Networking Automation'
    ],
    price: 3000,
    duration: '12 weeks',
    projects: 10,
    image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    rating: 4.9,
    students: 11984,
    maxStudents: 20000,
    instructor: 'Marco Ruiz',
    modules: [
      {
        title: 'CCNA Introduction & Exam Orientation',
        duration: '0.5 week',
        topics: [
          'What is CCNA 200-301',
          'Exam Topics Breakdown',
          'Role of a Network Engineer',
          'Understanding Cisco IOS',
          'How to prepare for the exam',
          'How to practice labs (Packet Tracer & GNS3)'
        ]
      },
      {
        title: 'Network Fundamentals (20%)',
        duration: '1.5 weeks',
        topics: [
          'IPv4 & IPv6 Addressing',
          'Subnetting & VLSM',
          'Cabling Types (UTP, Fiber, Coaxial)',
          'Switching Concepts',
          'Routing Concepts',
          'Collision/Broadcast/Collision Domains',
          'Bandwidth, Latency, Throughput',
          'Interface & Cable Issues',
          'Basic Cisco IOS Configuration'
        ]
      },
      {
        title: 'Network Access (20%)',
        duration: '2 weeks',
        topics: [
          'Switch Operations',
          'MAC Address Table',
          'VLANs & Trunking',
          '802.1Q Tagging',
          'Inter-VLAN Routing',
          'STP (Spanning Tree Protocol)',
          'Port Security',
          'EtherChannel',
          'Labs: VLAN Setup',
          'Labs: Trunk Configuration',
          'Labs: STP Behavior',
          'Labs: Port Security Setup'
        ]
      },
      {
        title: 'IP Connectivity (25%)',
        duration: '2 weeks',
        topics: [
          'Static Routing',
          'Default Routes',
          'OSPF (Single Area)',
          'First-Hop Redundancy Concepts',
          'Router Selection Process',
          'ECMP Routing',
          'Routing Table Lookup',
          'IPv6 Routing',
          'Labs: Static Routing',
          'Labs: OSPF Configuration',
          'Labs: Default Routes',
          'Labs: IPv6 Routing'
        ]
      },
      {
        title: 'IP Services (10%)',
        duration: '1 week',
        topics: [
          'NAT, PAT',
          'DHCP, DNS',
          'SNMP Functions',
          'Syslog',
          'QoS Basics',
          'TFTP/FTP Services',
          'Labs: NAT/PAT Setup',
          'Labs: DHCP Server Config',
          'Labs: Syslog Logging'
        ]
      },
      {
        title: 'Security Fundamentals (15%)',
        duration: '1.5 weeks',
        topics: [
          'AAA Concepts',
          'WPA/WPA2 Security',
          'Secure Administration (SSH)',
          'Device Hardening',
          'Access Lists (Standard & Extended ACLs)',
          'VPN Fundamentals',
          'Firewall Basics',
          'Labs: ACL Filtering',
          'Labs: SSH Device Hardening'
        ]
      },
      {
        title: 'Wireless Networking (CCNA Wireless Basics)',
        duration: '1 week',
        topics: [
          'Wireless Standards (802.11)',
          'Frequencies & Channels',
          'WLC vs Autonomous AP',
          'SSID, Authentication, Encryption',
          'Wireless Troubleshooting'
        ]
      },
      {
        title: 'WAN Technologies',
        duration: '1 week',
        topics: [
          'VPN Concepts (IPsec)',
          'GRE Tunnels',
          'Metro Ethernet',
          'MPLS (overview)',
          'WAN Architecture'
        ]
      },
      {
        title: 'Automation & Programmability (10%)',
        duration: '1 week',
        topics: [
          'SDN Concepts',
          'REST APIs',
          'JSON & YAML',
          'Cisco DNA Center Basics',
          'Controller vs Distributed Networks',
          'Python Basics for Networking',
          'Automation Workflows',
          'Labs: Simple Python Interface Info',
          'Labs: REST API Example'
        ]
      },
      {
        title: 'Full CCNA Lab + Final Exam Simulation',
        duration: '1 week',
        topics: [
          'Complete Enterprise Network Setup',
          'Router & Switch Configuration',
          'OSPF + VLANs + ACLs + NAT',
          'Wireless + DHCP + Syslog',
          'Troubleshooting Scenarios',
          'CCNA-Level Final Exam (Mock Test)'
        ]
      }
    ],
    icon: 'Globe'
  },
  {
    id: 'GENAI-BEGINNER',
    title: "Generative AI (Understanding and Building LLM's) - Beginner Level",
    category: 'ai',
    level: 'beginner',
    description: 'Intro to LLMs, prompt engineering, embeddings, and transformer basics. Build a simple chat assistant.',
    technologies: ['Python', 'OpenAI API', 'Hugging Face', 'Transformers', 'Embeddings', 'LangChain', 'LlamaIndex', 'FastAPI', 'Streamlit'],
    price: 1800,
    duration: '8 weeks',
    projects: 3,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    rating: 4.7,
    students: 4820,
    maxStudents: 20000,
    instructor: 'Ayesha Khan',
    modules: [
      { title: 'Foundations of Generative AI', duration: '1 week', topics: ['Generative models', 'LLMs overview', 'Use cases'] },
      { title: 'Transformers at a Glance', duration: '1 week', topics: ['Attention', 'Tokens', 'Embeddings'] },
      { title: 'Prompt Engineering Basics', duration: '2 weeks', topics: ['Prompt design', 'Chain-of-thought', 'System prompts'] },
      { title: 'APIs and Tooling', duration: '2 weeks', topics: ['OpenAI API', 'Hugging Face', 'LangChain'] },
      { title: 'Retrieval and Embeddings', duration: '1 week', topics: ['Vector stores', 'FAISS', 'Semantic search'] },
      { title: 'Mini Project: Chat Assistant', duration: '1 week', topics: ['Streamlit UI', 'FastAPI backend', 'Evaluation'] }
    ],
    icon: 'Cpu'
  },
  {
    id: 'GENAI-INTERMEDIATE',
    title: "Generative AI (Understanding and Building LLM's) - Intermediate Level",
    category: 'ai',
    level: 'intermediate',
    description: 'RAG systems, fine-tuning (LoRA/PEFT), tokenization, evaluation, and guardrails. Build production-grade apps.',
    technologies: ['PyTorch', 'HuggingFace Transformers', 'Datasets', 'Tokenizers', 'LangChain', 'Vector DB (FAISS/Pinecone)', 'FastAPI', 'Docker', 'Weights & Biases', 'LoRA / PEFT'],
    price: 2400,
    duration: '10 weeks',
    projects: 5,
    image: 'https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    rating: 4.8,
    students: 7210,
    maxStudents: 20000,
    instructor: 'Rahul Mehta',
    modules: [
      { title: 'Tokenization & Datasets', duration: '1 week', topics: ['Subword tokenizers', 'HF Datasets', 'Preprocessing'] },
      { title: 'RAG Architecture', duration: '2 weeks', topics: ['Indexing', 'Query pipelines', 'Context windows'] },
      { title: 'Fine-tuning with LoRA/PEFT', duration: '2 weeks', topics: ['Adapters', 'Training loops', 'Evaluation'] },
      { title: 'Guardrails & Safety', duration: '1 week', topics: ['Prompt safety', 'Content filters', 'OpenAI policies'] },
      { title: 'Observability & Experiment Tracking', duration: '1 week', topics: ['W&B', 'Metrics', 'A/B tests'] },
      { title: 'Packaging & Deployment', duration: '2 weeks', topics: ['Docker', 'FastAPI', 'CI/CD'] }
    ],
    icon: 'Cpu'
  },
  {
    id: 'GENAI-ADVANCED',
    title: "Generative AI (Understanding and Building LLM's) - Advanced Level",
    category: 'ai',
    level: 'advanced',
    description: 'Pretraining, RLHF/DPO, distributed training, quantization, and MLOps for scaling LLMs.',
    technologies: ['PyTorch', 'DeepSpeed', 'FSDP', 'PEFT', 'BitsAndBytes', 'RLHF (PPO/DPO)', 'GGUF/GPTQ', 'Kubernetes', 'Ray', 'Monitoring (Prometheus/W&B)'],
    price: 3500,
    duration: '12 weeks',
    projects: 8,
    image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    rating: 4.9,
    students: 3920,
    maxStudents: 20000,
    instructor: 'Dr. Elena Novikova',
    modules: [
      { title: 'LLM Pretraining Fundamentals', duration: '1 week', topics: ['Objective functions', 'Data pipelines', 'Scaling laws'] },
      { title: 'Distributed Training', duration: '2 weeks', topics: ['FSDP', 'DeepSpeed', 'Sharding'] },
      { title: 'Quantization & Inference', duration: '2 weeks', topics: ['BitsAndBytes', 'GGUF/GPTQ', 'Serving'] },
      { title: 'RLHF & DPO', duration: '2 weeks', topics: ['Reward modeling', 'PPO', 'DPO'] },
      { title: 'Evaluation & Alignment', duration: '1 week', topics: ['Benchmarks', 'Hallucination tests', 'Safety checks'] },
      { title: 'MLOps for LLMs', duration: '2 weeks', topics: ['Kubernetes', 'Ray', 'Monitoring'] },
      { title: 'Capstone: Fine-tuned LLM Service', duration: '2 weeks', topics: ['Data curation', 'Training', 'API serving'] }
    ],
    icon: 'Cpu'
  },
  {
    id: 'CYBER-SECURITY-BEGINNER',
    title: 'Cyber Security - Beginner',
    category: 'cyber',
    level: 'beginner',
    description: 'Start your cybersecurity journey by understanding core security concepts, operating systems, ethical tools, network analysis, firewalls, and foundational attack techniques.',
    technologies: ['Linux', 'Windows', 'Kali Linux', 'Parrot OS', 'Nmap', 'Wireshark', 'Gobuster', 'BloodHound', 'Firewalls', 'IDS/IPS', 'Encryption'],
    price: 1600,
    duration: '8 weeks',
    projects: 6,
    image: 'https://images.pexels.com/photos/5380643/pexels-photo-5380643.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    rating: 4.7,
    students: 12842,
    maxStudents: 20000,
    instructor: 'Rachel Kim',
    modules: [
      {
        title: 'Module 1: Cyber Security Fundamentals',
        duration: '2 weeks',
        topics: [
          'What is Cyber Security?',
          'CIA Triad (Confidentiality, Integrity, Availability)',
          'Threats, Vulnerabilities, and Risks',
          'Malware Types (Virus, Worm, Trojan, Ransomware)',
          'Security Policies & Best Practices',
          'Authentication vs Authorization',
          'Encryption Basics (Symmetric & Asymmetric)',
          'Hashing, Salting & Password Security',
          'Introduction to Ethical Hacking & Cyber Kill Chain'
        ]
      },
      {
        title: 'Module 2: Operating Systems for Cyber Security',
        duration: '2 weeks',
        topics: [
          'Windows OS Basics for Security',
          'Linux OS Basics (Directories & File Permissions)',
          'Kali Linux Overview and Use Cases',
          'Parrot Security OS Overview',
          'Raspberry Pi for Security Projects',
          'Flipper Zero – What It Is & Use Cases',
          'Essential Linux Commands (cd, ls, pwd, chmod, chown, mv, cp, rm)',
          'Package Management (apt, apt-get)',
          'SSH Basics & Creating SSH Keys'
        ]
      },
      {
        title: 'Module 3: Networking Tools – Nmap & Wireshark',
        duration: '1 week',
        topics: [
          'Introduction to Network Scanning',
          'Host Discovery',
          'Port Scanning Techniques',
          'Nmap Basic Commands',
          'OS Fingerprinting (Nmap)',
          'Introduction to Wireshark',
          'Packet Capturing Techniques',
          'Filtering Traffic in Wireshark',
          'Basic TCP/UDP Analysis'
        ]
      },
      {
        title: 'Module 4: Enumeration Tools – Nmap, Gobuster & BloodHound',
        duration: '1 week',
        topics: [
          'Nmap Service Enumeration',
          'Nmap Script Scanning (NSE Introduction)',
          'Understanding Web Enumeration',
          'Gobuster Directory Bruteforcing',
          'Gobuster DNS Enumeration',
          'Active Directory Basics',
          'What is BloodHound?',
          'Mapping AD Relationships with BloodHound',
          'Privilege Escalation Concepts'
        ]
      },
      {
        title: 'Module 5: Firewalls & Network Protection',
        duration: '1 week',
        topics: [
          'What is a Firewall?',
          'Packet Filtering Firewalls',
          'Stateful & Stateless Firewalls',
          'Application-Level Firewalls',
          'IDS vs IPS',
          'Proxy Servers',
          'NAT & Port Forwarding Basics',
          'Basic Firewall Rules & Policies',
          'Real-world Firewall Use Cases'
        ]
      },
      {
        title: 'Module 6: Cyber Attacks & Security Certifications Introduction',
        duration: '1 week',
        topics: [
          'Phishing Attacks',
          'Brute-Force & Password Attacks',
          'Man-in-the-Middle Attacks',
          'Social Engineering Basics',
          'Denial-of-Service (DoS) Attacks',
          'SQL Injection Basics',
          'XSS (Cross-Site Scripting) Basics',
          'Malware Delivery Techniques',
          'Introduction to Certifications (CompTIA Security+, A+, Network+, CEH, OSCP, CC, etc.)'
        ]
      }
    ],
    icon: 'Shield'
  },
  {
    id: 'CYBER-SECURITY-INTERMEDIATE',
    title: 'Cyber Security - Intermediate',
    category: 'cyber',
    level: 'intermediate',
    description: "Master advanced hacking methodologies, virus creation concepts, password cracking, backdoors, SQL injection, social engineering, phishing, cloud & IoT attacks, post-exploitation, reporting, and tool analysis.",
    technologies: ['Kali Linux', 'John the Ripper', 'Hydra', 'Hashcat', 'CeWL', 'Medusa', 'Netcat', 'msfvenom', 'Meterpreter', 'SQLMap', 'SET', 'Metasploit', 'Python', 'Bash', 'GitHub'],
    price: 2400,
    duration: '10 weeks',
    projects: 12,
    image: 'https://images.pexels.com/photos/5380643/pexels-photo-5380643.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    rating: 4.8,
    students: 9560,
    maxStudents: 20000,
    instructor: 'Omar Hassan',
    modules: [
      { title: 'Module 1: Viruses & Malware Engineering', duration: '1 week', topics: [
        'What is a Computer Virus?',
        'Worms vs Viruses',
        'Trojans & RATs',
        'File Infectors',
        'Macro & Script-based Viruses',
        'Boot Sector Viruses',
        'Polymorphic & Metamorphic Viruses',
        'Ransomware Fundamentals',
        'How AI Can Generate a Virus (Ethical Demonstration)'
      ]},
      { title: 'Module 2: Password Cracking in Kali Linux', duration: '1 week', topics: [
        'Introduction to Password Cracking',
        'John the Ripper Basics',
        'John the Ripper Wordlist Attacks',
        'Introduction to Hydra',
        'Password Cracking with Hydra (SSH, FTP, HTTP)',
        'Hashcat Basics & GPU Cracking',
        'CeWL – Wordlist Generator',
        'Medusa – Parallel Bruteforce Tool',
        'Ethical Use of Password Cracking Tools'
      ]},
      { title: 'Module 3: Backdoors & Persistence', duration: '1 week', topics: [
        'What is a Backdoor?',
        'Remote Access Trojans (RATs)',
        'Bind Shells vs Reverse Shells',
        'Netcat Backdoor Techniques',
        'msfvenom Payload Creation',
        'Meterpreter Backdoor Sessions',
        'Persistence Mechanisms in Linux',
        'Persistence Techniques in Windows',
        'How to Create a Backdoor (Ethical Demo)'
      ]},
      { title: 'Module 4: SQL Injection & Bug Bounty Introduction', duration: '1 week', topics: [
        'What is SQL Injection?',
        'Types of SQL Injection (Union, Blind, Error-Based)',
        'SQLMap Tool Basics',
        'Manual SQL Injection Testing',
        'Database Fingerprinting',
        'Bypassing Login Panels',
        'Extracting Data via SQLi',
        'Preventing SQL Injection',
        'What is Bug Bounty Hunting?'
      ]},
      { title: 'Module 5: Social Engineering Attacks', duration: '1 week', topics: [
        'Introduction to Social Engineering',
        'Pretexting Techniques',
        'Impersonation Attacks',
        'Physical Social Engineering Attacks',
        'Tailgating & Dumpster Diving',
        'Social Engineering Toolkits (SET)',
        'Methods of Influence',
        'Psychological Manipulation Techniques',
        'Summary & Real-World Examples'
      ]},
      { title: 'Module 6: Everything About Phishing Attacks', duration: '1 week', topics: [
        'What is Phishing?',
        'Email Phishing Attacks',
        'Spear Phishing',
        'Whaling Attacks',
        'Clone Phishing',
        'SMS Phishing (Smishing)',
        'Voice Phishing (Vishing)',
        'Phishing Toolkits & Frameworks',
        'Real-World Case Study'
      ]},
      { title: 'Module 7: Cloud, Mobile & IoT Security', duration: '1 week', topics: [
        'Introduction to Cloud & IoT Threats',
        'Cloud Attack Vectors',
        'Vulnerabilities in Cloud Platforms',
        'Attacking Containers & Virtual Machines',
        'Mobile OS Vulnerabilities (Android/iOS)',
        'IoT Device Exploitation Basics',
        'Common Attacks on Specialized Systems',
        'Securing Cloud & IoT',
        'Summary'
      ]},
      { title: 'Module 8: Post-Exploitation Techniques', duration: '1 week', topics: [
        'Introduction to Post-Exploitation',
        'Privilege Escalation Basics',
        'Creating Foothold in a System',
        'Maintaining Persistence',
        'Lateral Movement Techniques',
        'Tokens & Credential Dumping',
        'Detection Avoidance Techniques',
        'Internal Network Enumeration',
        'Summary'
      ]},
      { title: 'Module 9: Reporting & Communication in Cyber Security', duration: '1 week', topics: [
        'Introduction to Security Reporting',
        'Components of a Good Penetration Testing Report',
        'Writing Executive Summaries',
        'Documenting Vulnerabilities & Evidence',
        'Remediation Recommendations',
        'Communication with Clients During Pentesting',
        'Report Delivery Best Practices',
        'Ethics & Confidentiality',
        'Summary'
      ]},
      { title: 'Module 10: Tools & Code Analysis', duration: '1 week', topics: [
        'Introduction to Scripting for Cyber Security',
        'Understanding Python & Bash Basics',
        'Analyzing Exploit Code',
        'Common Automation Scripts for Pentesting',
        'Working with GitHub Exploits',
        'Using Metasploit Modules',
        'Static vs Dynamic Code Analysis',
        'Identifying Malicious Code Patterns',
        'Summary'
      ]}
    ],
    icon: 'Shield'
  },
  {
    id: 'CYBER-SECURITY-ADVANCED',
    title: 'Cyber Security - Advanced',
    category: 'cyber',
    level: 'advanced',
    description: 'Master OS, networking, IAM, crypto, hardening, ethical hacking, IR/forensics, cloud, and full Security+/A+ prep with hands-on labs.',
    technologies: ['OS Internals', 'Networking', 'IAM', 'Cryptography', 'Endpoint Hardening', 'Ethical Hacking', 'Incident Response', 'Forensics', 'Cloud Security', 'Virtualization'],
    price: 3200,
    duration: '12 weeks',
    projects: 6,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=60',
    rating: 4.8,
    students: 2750,
    maxStudents: 20000,
    instructor: 'Elena Novikova',
    modules: [
      { title: 'Module 1: Operating System Mastery for Security & IT', duration: '1 week', topics: [
        'Windows OS Architecture',
        'Linux Internals (Advanced)',
        'File systems: NTFS, FAT32, ext4, XFS',
        'System logs & auditing',
        'OS hardening techniques',
        'Boot process & troubleshooting (BIOS/UEFI)',
        'Disk partitioning, imaging & recovery',
        'Hands-On: Windows Admin Tools, systemctl/journalctl, diskpart/gparted, chroot, fsck, dd'
      ]},
      { title: 'Module 2: Networking Mastery for Cybersecurity', duration: '1 week', topics: [
        'Advanced TCP/IP operations',
        'VLANs, Subnets, Routing protocols',
        'Firewalls, NAT, Port Forwarding',
        'Wireless security standards',
        'VPNs (IPSec, OpenVPN, WireGuard)',
        'Network Troubleshooting (A+ Core)',
        'Hands-On: Packet Tracer/GNS3, Wireshark, tcpdump',
        'Hands-On: iptables, ufw, traceroute, mtr, nmap, OpenVPN/WireGuard'
      ]},
      { title: 'Module 3: Hardware & Device Security (A+ Core Coverage)', duration: '1 week', topics: [
        'Computer hardware components',
        'Peripherals, printers, IoT devices',
        'Storage devices & RAID',
        'Mobile device security',
        'BIOS/UEFI security',
        'Safe disposal & data protection',
        'Hands-On: Memtest86, CrystalDiskInfo, SMART monitoring, BIOS security configuration'
      ]},
      { title: 'Module 4: Identity, Access & Authentication', duration: '1 week', topics: [
        'AAA: Authentication, Authorization, Accounting',
        'MFA, RBAC, ABAC, DAC/MAC',
        'SSO & federated identity',
        'Credential management & password policies',
        'Biometrics & zero-trust',
        'Hands-On: FreeIPA, Active Directory, OpenLDAP, SSH key management, Vault'
      ]},
      { title: 'Module 5: Cryptography & Secure Communications', duration: '1 week', topics: [
        'Symmetric / Asymmetric encryption',
        'TLS/SSL, HTTPS',
        'Hashing, Salting',
        'Digital certificates & PKI',
        'VPN cryptography',
        'Cryptographic attacks',
        'Hands-On: OpenSSL, GPG, Hashcat, Wireshark TLS decryption, CA setup'
      ]},
      { title: 'Module 6: Endpoint Security & System Hardening', duration: '1 week', topics: [
        'Endpoint protection, EDR/XDR basics',
        'Host firewalls',
        'Application whitelisting',
        'Patch management',
        'Secure configurations (CIS Benchmarks)',
        'Malware analysis fundamentals',
        'Hands-On: ClamAV, Rkhunter, chkrootkit, Sysinternals, OSQuery, Lynis'
      ]},
      { title: 'Module 7: Ethical Hacking & Penetration Testing', duration: '1 week', topics: [
        'Reconnaissance',
        'Scanning & enumeration',
        'Vulnerability exploitation',
        'Privilege escalation',
        'Web security tests',
        'Practical exploitation labs',
        'Hands-On: Kali, nmap/masscan, Metasploit, Burp, sqlmap, Hydra, John, Nikto'
      ]},
      { title: 'Module 8: Incident Response & Digital Forensics', duration: '1 week', topics: [
        'Incident response lifecycle',
        'Types of attacks',
        'Log analysis',
        'SIEM operations',
        'Disk imaging & volatile memory capture',
        'Forensic chain of custody',
        'Hands-On: Autopsy, FTK Imager, Volatility, Splunk/Wazuh, syslog, tcpdump/Wireshark'
      ]},
      { title: 'Module 9: Cloud Security & Virtualization', duration: '1 week', topics: [
        'Virtualization (VMware, VirtualBox, Proxmox)',
        'Cloud fundamentals (Azure/AWS basics)',
        'IAM cloud policies',
        'Secure cloud networking',
        'Container basics (Docker, image security)',
        'Cloud storage security',
        'Hands-On: VirtualBox labs, Docker, AWS/Azure Free Tier, Minikube (basic)'
      ]},
      { title: 'Module 10: Complete Security+ & A+ Exam Preparation Bootcamp', duration: '1 week', topics: [
        'Complete Security+ Blueprint mapping',
        'A+ Core 1 + Core 2 coverage',
        '200+ scenario-based questions',
        'Attack simulation labs',
        'Troubleshooting war-room practice',
        'OS issues, network issues, security incidents',
        'Hands-On: Boson/SY0-701 tests, VulnHub/TryHackMe, VirtualBox home lab, A+ break-fix'
      ]}
    ],
    icon: 'Shield'
  },
  {
    id: 'DATA-SCIENCE-BEGINNER',
    title: 'Data Science - Beginner',
    category: 'data-science',
    level: 'beginner',
    description: 'Learn Python, statistics, data wrangling, and EDA.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    price: 1800,
    duration: '8 weeks',
    projects: 4,
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=400&h=250&q=60',
    rating: 4.6,
    students: 2100,
    maxStudents: 20000,
    instructor: 'Priya Sharma',
    modules: [
      { title: 'Python Foundations for Data', duration: '2 weeks', topics: ['Syntax', 'Data types', 'Functions'] },
      { title: 'Data Wrangling & Cleaning', duration: '2 weeks', topics: ['Pandas basics', 'Missing values', 'Joins'] },
      { title: 'Exploratory Data Analysis', duration: '2 weeks', topics: ['Descriptive stats', 'Visualization'] },
      { title: 'Mini Project', duration: '2 weeks', topics: ['EDA report'] }
    ],
    icon: 'Database'
  },
  {
    id: 'DATA-SCIENCE-INTERMEDIATE',
    title: 'Data Science - Intermediate',
    category: 'data-science',
    level: 'intermediate',
    description: 'Statistics, feature engineering, model training, and evaluation.',
    technologies: ['Scikit-learn', 'Statsmodels', 'Jupyter', 'Pandas'],
    price: 2400,
    duration: '10 weeks',
    projects: 5,
    image: 'https://images.unsplash.com/photo-1557425493-6f90ae4659fc?auto=format&fit=crop&w=400&h=250&q=60',
    rating: 4.7,
    students: 1750,
    maxStudents: 20000,
    instructor: 'Miguel Alvarez',
    modules: [
      { title: 'Statistics for DS', duration: '2 weeks', topics: ['Probability', 'Distributions', 'Hypothesis tests'] },
      { title: 'Feature Engineering', duration: '2 weeks', topics: ['Encoding', 'Scaling', 'Pipelines'] },
      { title: 'Modeling & Evaluation', duration: '3 weeks', topics: ['Regression', 'Classification', 'Metrics', 'Cross-validation'] },
      { title: 'Capstone Prep', duration: '3 weeks', topics: ['Framing', 'Iteration', 'Interpretation'] }
    ],
    icon: 'Database'
  },
  {
    id: 'DATA-SCIENCE-ADVANCED',
    title: 'Data Science - Advanced',
    category: 'data-science',
    level: 'advanced',
    description: 'Prod ML pipelines, experiment tracking, deployment, and monitoring.',
    technologies: ['XGBoost', 'LightGBM', 'MLflow', 'Docker', 'FastAPI'],
    price: 2900,
    duration: '12 weeks',
    projects: 6,
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=400&h=250&q=60',
    rating: 4.8,
    students: 1320,
    maxStudents: 20000,
    instructor: 'Sara Cohen',
    modules: [
      { title: 'Advanced Modeling', duration: '3 weeks', topics: ['Ensembles', 'Hyperparameters', 'Imbalanced data'] },
      { title: 'Experiment Tracking & Pipelines', duration: '3 weeks', topics: ['MLflow', 'Artifacts', 'Reproducibility'] },
      { title: 'Deployment & Monitoring', duration: '3 weeks', topics: ['FastAPI', 'Docker', 'Serving', 'Drift detection'] },
      { title: 'Capstone: Production ML', duration: '3 weeks', topics: ['Pipeline', 'Docs', 'Presentation'] }
    ],
    icon: 'Database'
  }
];
