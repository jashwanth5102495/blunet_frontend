// Shared course introduction data for multiple courses
export const courseIntros = {
  'frontend-development-beginner': {
    title: 'Frontend Development - Beginner',
    levelLabel: 'Beginner level',
    tagline: 'Master the fundamentals of web development with HTML, CSS, and JavaScript.',
    heroImg: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&crop=center',
    whatYouWillLearn: [
      'Understand the building blocks of the web: HTML5.',
      'Style your pages with CSS3 and responsive design.',
      'Add interactivity with JavaScript.',
      'Build your first portfolio website.'
    ],
    modules: [
      { slug: 'module-1', title: 'HTML Fundamentals', desc: 'HTML Structure, Semantic HTML, Forms and Input, HTML5 Features', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg' },
      { slug: 'module-2', title: 'CSS Styling', desc: 'CSS Selectors, Box Model, Flexbox, Grid Layout, Responsive Design', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg' },
      { slug: 'module-3', title: 'JavaScript Basics', desc: 'Variables, Data Types, Functions, DOM Manipulation, Event Handling', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg' }
    ]
  },

  'frontend-development-intermediate': {
    title: 'Frontend Development – Intermediate',
    levelLabel: 'Intermediate level',
    tagline: 'Build modern, responsive UIs and connect them to real backends.',
    heroImg: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    whatYouWillLearn: [
      'Craft responsive layouts using HTML5, CSS3, and Tailwind CSS.',
      'Build interactive UIs with modern JavaScript and React components.',
      'Integrate backends using Django, REST APIs, and MongoDB.',
      'Deliver end-to-end features and deploy production-ready applications.'
    ],
    modules: [
      { slug: 'intro-react', title: 'Intro React — Getting Started', desc: 'Set up Node.js and create your first React app. Understand why React and essential tooling (Vite/CRA).', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
      { slug: 'module-1', title: 'Advanced HTML, CSS & Responsive Design', desc: 'Responsive layouts with HTML5, CSS3, Tailwind CSS and modern design patterns.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg' },
      { slug: 'module-2', title: 'JavaScript & React.js Essentials', desc: 'ES6+ fundamentals, components, state, events, and interactive UI patterns.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
      { slug: 'module-3', title: 'Backend Integration with Django & MongoDB', desc: 'Design and consume REST APIs, tokens, and data access with Django/MongoDB.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Django_logo.svg' },
      { slug: 'module-4', title: 'Full-Stack Application & Deployment', desc: 'Auth, env configuration, secure deployment, and production readiness.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg' }
    ]
  },

  'networking-beginner': {
    title: 'Networking - Beginner',
    levelLabel: 'Beginner level',
    tagline: 'Build a strong foundation in networks, protocols, and hands-on tools. Learn core models (OSI/TCP-IP), IP addressing, and real-world tooling like Cisco Packet Tracer, Nmap, and Wireshark.',
    heroImg: 'https://images.pexels.com/photos/1054397/pexels-photo-1054397.jpeg?auto=compress&cs=tinysrgb&w=1200',
    whatYouWillLearn: [
      'Understand OSI/TCP-IP models and basic protocols.',
      'Configure small networks in Cisco Packet Tracer.',
      'Scan and analyze traffic using Nmap and Wireshark.',
      'Troubleshoot common network issues with core tools.'
    ],
    modules: [
      { slug: 'module-1', title: 'Networking Fundamentals', desc: 'OSI & TCP/IP models, IP addressing (IPv4/IPv6), DNS/DHCP, protocols.', bgImage: '/img/networking/fundamentals.svg' },
      { slug: 'module-2', title: 'Cisco Packet Tracer – Network Building', desc: 'Routers, switches, LAN/WAN, IP assignment and traffic simulation.', bgImage: '/img/networking/cisco.svg' },
      { slug: 'module-3', title: 'Nmap – Network Scanning Basics', desc: 'Host discovery, port scanning, service detection, OS fingerprinting.', bgImage: '/img/networking/nmap.svg' },
      { slug: 'module-4', title: 'Wireshark – Packet Analysis', desc: 'Packet capture, filters, TCP/UDP analysis, issue detection.', bgImage: '/img/networking/wireshark.svg' },
      { slug: 'module-5', title: 'Networking Troubleshooting', desc: 'Ping, traceroute, netstat, ipconfig and best practices for diagnosis.', bgImage: '/img/networking/troubleshooting.svg' }
    ]
  },

  'networking-intermediate': { 
    title: 'Networking - Intermediate',
    levelLabel: 'Intermediate level',
    tagline: `Master Linux networking, routing/switching, VPNs, firewalls, and monitoring. 
This course covers practical configuration, troubleshooting, and performance analysis to build strong hands-on networking skills.`,
    heroImg: 'https://images.unsplash.com/photo-1581090464777-1c31c5030f88?auto=format&w=1200',
    heroHeight: '480px',

    whatYouWillLearn: [
      'Configure routing, VLANs, and Linux-based networking.',
      'Set up VPNs (OpenVPN/WireGuard) and secure communications.',
      'Build and manage firewalls (iptables/ufw, firewalld).',
      'Monitor networks with SNMP, Nagios, Zabbix, and tcpdump.'
    ],

    modules: [
      {
        slug: 'module-1',
        title: 'Linux Networking Fundamentals (Advanced)',
        desc: 'Interfaces, routes, DNS config, namespaces, secure remote access.',
        bgImage: 'https://cdn-icons-png.flaticon.com/512/6124/6124993.png'
      },
      {
        slug: 'module-2',
        title: 'Advanced Scanning & Analysis',
        desc: 'NSE, masscan, nc, tcpdump, ss/netstat, enumeration workflows.',
        bgImage: 'https://nmap.org/images/nmap-logo-256x256.png'
      },
      {
        slug: 'module-3',
        title: 'Firewall & Security Devices',
        desc: 'iptables, NAT, firewalld zones, ufw policies, overview of pfSense.',
        bgImage: 'https://cdn-icons-png.flaticon.com/512/1048/1048944.png'
      },
      {
        slug: 'module-4',
        title: 'VPNs, Tunneling & Secure Communications',
        desc: 'OpenVPN, WireGuard, SSH tunneling, GRE, IPsec fundamentals.',
        bgImage: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png'
      },
      {
        slug: 'module-5',
        title: 'Monitoring & Logging',
        desc: 'Syslog, SNMP, Zabbix/Nagios basics, log analysis with ELK intro.',
        bgImage: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png'
      }
    ]
  },

  'devops-beginner': {
    title: 'DevOps - Beginner',
    levelLabel: 'Beginner level',
    tagline: 'Master the culture, tools, and workflows of DevOps. From Linux and Git to Docker, Jenkins, and AWS.',
    heroImg: 'https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&w=1200',
    whatYouWillLearn: [
      'Understand DevOps culture, lifecycle, and end-to-end workflows.',
      'Master Linux command line, permissions, and package management.',
      'Version control with Git & GitHub for team collaboration.',
      'Build automation with Maven/MSBuild and CI with Jenkins.',
      'Containerize applications using Docker and best practices.',
      'Deploy to AWS Cloud and manage infrastructure with Terraform.'
    ],
    modules: [
      { 
        slug: 'module-1', 
        title: 'DevOps Introduction & Environment Setup', 
        desc: 'Orientation, DevOps culture, lifecycle, toolchain overview, and setting up your lab environment (Git, Docker, Jenkins, VS Code).', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Devops-toolchain.svg' 
      },
      { 
        slug: 'module-2', 
        title: 'Linux for DevOps', 
        desc: 'Linux file system, permissions, users, processes, networking, packages, and services (systemctl) essential for DevOps.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png' 
      },
      { 
        slug: 'module-3', 
        title: 'Version Control & Collaboration', 
        desc: 'Why version control matters, Git basics, workflow, branching, merging, best practices, and GitHub collaboration.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg' 
      },
      { 
        slug: 'module-4', 
        title: 'Build Tools & CI Basics', 
        desc: 'Build automation concepts, Maven, MSBuild, and Introduction to Continuous Integration with Jenkins.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg' 
      },
      { 
        slug: 'module-5', 
        title: 'Containers & Docker', 
        desc: 'Docker architecture, images, containers, Dockerfile basics, and containerizing applications.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg' 
      },
      { 
        slug: 'module-6', 
        title: 'Cloud Basics for DevOps', 
        desc: 'Cloud computing basics, AWS introduction, compute, storage, networking, and cloud security.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' 
      },
      { 
        slug: 'module-7', 
        title: 'Infrastructure as Code & Automation', 
        desc: 'Infrastructure as Code concepts, Terraform overview, architecture, workflow, and automation in DevOps.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Terraform_Logo.svg' 
      },
      { 
        slug: 'module-8', 
        title: 'Beginner Monitoring & DevOps Workflow', 
        desc: 'End-to-end DevOps workflow, monitoring importance, logs basics, and DevOps career roadmap.', 
        bgImage: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png' 
      },
      { 
        slug: 'module-9', 
        title: 'Beginner Capstone Project', 
        desc: 'Build a complete DevOps pipeline: Code -> Build -> CI -> Docker -> Cloud Deployment.', 
        bgImage: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' 
      }
    ]
  },

  'networking-advanced': {
    title: 'Networking – Advanced (CCNA Certification Track)',
    levelLabel: 'Advanced level',
    tagline: 'Enterprise routing/switching, VLANs, ACLs, NAT, wireless, automation — CCNA ready.',
    heroImg: 'https://images.pexels.com/photos/1054397/pexels-photo-1054397.jpeg?auto=compress&cs=tinysrgb&w=1200',
    whatYouWillLearn: [
      'Design and configure enterprise networks aligned to CCNA.',
      'Implement VLANs, STP, port security and EtherChannel.',
      'Configure routing (static, OSPF), NAT, DHCP/DNS services.',
      'Apply security fundamentals and basic automation with REST/Python.'
    ],
    modules: [
      { slug: 'module-1', title: 'CCNA Introduction & Orientation', desc: 'Exam scope, IOS basics, lab setup for Packet Tracer/GNS3.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cisco_logo.svg' },
      { slug: 'module-2', title: 'Network Fundamentals', desc: 'IPv4/IPv6, subnetting/VLSM, switching & routing concepts.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Network_icon.svg' },
      { slug: 'module-3', title: 'Network Access', desc: 'VLANs, trunking, STP, port security, EtherChannel — with labs.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Network_icon.svg' },
      { slug: 'module-4', title: 'IP Connectivity', desc: 'Static routing, OSPF, default routes, IPv6 routing — with labs.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Network_icon.svg' },
      { slug: 'module-5', title: 'IP Services', desc: 'NAT/PAT, DHCP/DNS, SNMP, Syslog, QoS basics — with labs.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Network_icon.svg' },
      { slug: 'module-6', title: 'Security Fundamentals', desc: 'AAA, secure admin via SSH, ACLs, VPN fundamentals — with labs.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Padlock-white.svg' }
    ]
  },

  'genai-beginner': {
    title: "Generative AI (Understanding and Building LLM's) - Beginner Level",
    levelLabel: 'Beginner level',
    tagline: 'Intro to LLMs, transformers, embeddings, APIs, and prompt engineering.',
    heroImg: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    whatYouWillLearn: [
      'Use LLM APIs and basic tooling effectively.',
      'Design prompts and reasoning chains for robust outputs.',
      'Build simple assistants with embeddings retrieval.',
      'Ship a mini chat app with FastAPI + Streamlit.'
    ],
    modules: [
      { slug: 'module-1', title: 'Foundations of Generative AI', desc: 'Generative models, LLMs overview, practical use cases.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-2', title: 'Transformers at a Glance', desc: 'Attention, tokens, embeddings and representation basics.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-3', title: 'Prompt Engineering Basics', desc: 'Prompt design, system prompts, chain-of-thought strategies.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-4', title: 'APIs and Tooling', desc: 'OpenAI API, Hugging Face, LangChain for fast prototyping.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-5', title: 'Retrieval and Embeddings', desc: 'Vector stores (FAISS), semantic search and RAG basics.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' }
    ]
  },

  'genai-intermediate': {
    title: "Generative AI (Understanding and Building LLM's) - Intermediate Level",
    levelLabel: 'Intermediate level',
    tagline: 'RAG systems, LoRA/PEFT fine-tuning, tokenization, evaluation, and guardrails.',
    heroImg: 'https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=1200',
    whatYouWillLearn: [
      'Design RAG pipelines with solid retrieval.',
      'Fine-tune models with adapters (LoRA/PEFT).',
      'Implement safety guardrails and evaluation.',
      'Package and deploy FastAPI services with Docker.'
    ],
    modules: [
      { slug: 'module-1', title: 'Tokenization & Datasets', desc: 'Subword tokenizers, preprocessing and dataset pipelines.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-2', title: 'RAG Architecture', desc: 'Indexing, query pipelines, context windows.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-3', title: 'Fine-tuning with LoRA/PEFT', desc: 'Adapters, training loops, evaluation patterns.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-4', title: 'Guardrails & Safety', desc: 'Prompt safety, content filters, policy considerations.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-5', title: 'Packaging & Deployment', desc: 'Docker, FastAPI, CI/CD workflows for serving.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' }
    ]
  },

  'genai-advanced': {
    title: "Generative AI (Understanding and Building LLM's) - Advanced Level",
    levelLabel: 'Advanced level',
    tagline: 'Pretraining, RLHF/DPO, distributed training, quantization, and MLOps for scale.',
    heroImg: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1200',
    whatYouWillLearn: [
      'Train and fine-tune models with distributed strategies.',
      'Optimize inference with quantization (GGUF/GPTQ/BnB).',
      'Apply RLHF/DPO for aligned outputs and policies.',
      'Operate production LLMs with Kubernetes/Ray and monitoring.'
    ],
    modules: [
      { slug: 'module-1', title: 'LLM Pretraining Fundamentals', desc: 'Objectives, data pipelines, scaling laws and efficiency.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-2', title: 'Distributed Training', desc: 'FSDP, ZeRO, tensor/pipe parallelism.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-3', title: 'RLHF / DPO', desc: 'Reward models, preference data, policy optimization.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-4', title: 'Inference Optimization', desc: 'Quantization, KV-cache, speculative decoding.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' },
      { slug: 'module-5', title: 'LLMOps & Deployment', desc: 'Kubernetes, Ray, monitoring, scaling.', bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Artificial_Intelligence_logo.svg' }
    ]
  },

  // Cyber Security – Beginner
  'cyber-security-beginner': {
    title: 'Cyber Security - Beginner',
    levelLabel: 'Beginner level',
    tagline: 'Build a solid foundation in security concepts, tools, and defenses with hands-on modules.',
    heroImg: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop',
    whatYouWillLearn: [
      'Understand CIA triad, common threats, and security policies.',
      'Use core security OS tools on Windows, Linux, Kali/Parrot.',
      'Perform basic scanning with Nmap and analyze traffic with Wireshark.',
      'Practice enumeration and firewall basics using Gobuster and rule sets.'
    ],
    modules: [
      { 
        slug: 'module-1', 
        title: 'Security Fundamentals', 
        desc: 'CIA triad, threat landscape, malware types, governance and policy basics.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Padlock-white.svg' 
      },
      { 
        slug: 'module-2', 
        title: 'Operating Systems for Security', 
        desc: 'OS basics across Windows/Linux with security distros (Kali, Parrot) and tooling.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg' 
      },
      { 
        slug: 'module-3', 
        title: 'Networking Tools', 
        desc: 'Nmap scanning fundamentals and Wireshark capture/filtering for traffic analysis.', 
        bgImage: 'https://nmap.org/images/nmap-logo-256x256.png' 
      },
      { 
        slug: 'module-4', 
        title: 'Enumeration & Firewalls', 
        desc: 'Discovery with Gobuster and environment enumeration, firewall rule concepts and practice.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Firewall_%28Font_Awesome%29.svg' 
      }
    ]
  },

  'cyber-security-intermediate': {
    title: 'Cyber Security - Intermediate',
    levelLabel: 'Intermediate level',
    tagline: 'Deepen your offensive and defensive skills with advanced scanning, exploitation frameworks, and web application security.',
    heroImg: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    whatYouWillLearn: [
      'Master advanced network traffic analysis and defense.',
      'Understand and exploit OWASP Top 10 web vulnerabilities.',
      'Use Metasploit for exploitation and payload delivery.',
      'Secure wireless networks and respond to incidents.'
    ],
    modules: [
      {
        slug: 'module-1',
        title: 'Advanced Network Security',
        desc: 'Traffic analysis, IDS/IPS evasion, and advanced firewall configuration.',
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Padlock-white.svg'
      },
      {
        slug: 'module-2',
        title: 'Web Application Security',
        desc: 'OWASP Top 10, SQL Injection, XSS, and CSRF attacks and defenses.',
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg'
      },
      {
        slug: 'module-3',
        title: 'Exploitation Frameworks',
        desc: 'Introduction to Metasploit, payload generation, and post-exploitation.',
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' // Placeholder
      },
      {
        slug: 'module-4',
        title: 'Wireless & Mobile Security',
        desc: 'WiFi security protocols, cracking WPA/WPA2, and mobile app risks.',
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg'
      }
    ]
  },

  'devops-beginner': {
    title: 'DevOps - Beginner',
    levelLabel: 'Beginner level',
    tagline: 'Master the culture, tools, and workflows of DevOps. From Linux and Git to Docker, Jenkins, and AWS.',
    heroImg: 'https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&w=1200',
    whatYouWillLearn: [
      'Understand DevOps culture, lifecycle, and end-to-end workflows.',
      'Master Linux command line, permissions, and package management.',
      'Version control with Git & GitHub for team collaboration.',
      'Build automation with Maven/MSBuild and CI with Jenkins.',
      'Containerize applications using Docker and best practices.',
      'Deploy to AWS Cloud and manage infrastructure with Terraform.'
    ],
    modules: [
      { 
        slug: 'module-1', 
        title: 'DevOps Introduction & Environment Setup', 
        desc: 'Orientation, DevOps culture, lifecycle, toolchain overview, and setting up your lab environment (Git, Docker, Jenkins, VS Code).', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Devops-toolchain.svg' 
      },
      { 
        slug: 'module-2', 
        title: 'Linux for DevOps', 
        desc: 'Linux file system, core commands, permissions, process management, and networking commands essential for DevOps.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png' 
      },
      { 
        slug: 'module-3', 
        title: 'Version Control & Collaboration', 
        desc: 'Git basics, workflow, branching, merging, and collaboration with GitHub.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg' 
      },
      { 
        slug: 'module-4', 
        title: 'Build Tools & CI Basics', 
        desc: 'Build automation with Maven/MSBuild and Introduction to Continuous Integration with Jenkins.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg' 
      },
      { 
        slug: 'module-5', 
        title: 'Containers & Docker', 
        desc: 'Docker architecture, images, containers, Dockerfile, and containerizing applications.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg' 
      },
      { 
        slug: 'module-6', 
        title: 'Cloud Basics for DevOps', 
        desc: 'Introduction to AWS, compute, storage, networking, and deploying applications on the cloud.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' 
      },
      { 
        slug: 'module-7', 
        title: 'Infrastructure as Code & Automation', 
        desc: 'Terraform overview, architecture, workflow, and automating infrastructure provisioning.', 
        bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Terraform_Logo.svg' 
      },
      { 
        slug: 'module-8', 
        title: 'Beginner Monitoring & DevOps Workflow', 
        desc: 'End-to-end DevOps workflow, logs vs monitoring, best practices, and career roadmap.', 
        bgImage: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png' 
      },
      { 
        slug: 'module-9', 
        title: 'Beginner Capstone Project', 
        desc: 'Build a complete DevOps pipeline: Code -> Build -> CI -> Docker -> Cloud Deployment.', 
        bgImage: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' 
      }
    ]
  }
};

export const getIntroBySlug = (slug) => courseIntros[slug];
