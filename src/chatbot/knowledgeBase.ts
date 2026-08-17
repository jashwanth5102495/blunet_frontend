export interface ServiceDetail {
  id: number;
  name: string;
  category: string;
  description: string;
  capabilities: string[];
  targetCustomers: string;
  exampleSolutions: string[];
  discoveryQuestions: string[];
  status: 'available' | 'upcoming';
}

export const BLUNET_KNOWLEDGE = {
  company: {
    name: "BluNet IT Services",
    tagline: "Intelligent Software & Automation Solutions",
    description: "BluNet IT Services is a full-service software company specializing in building modern, scalable, and user-friendly technology solutions that maximize productivity and streamline workflows.",
    process: [
      "Requirement analysis",
      "Business understanding",
      "Solution planning",
      "UI/UX design",
      "Architecture planning",
      "Frontend development",
      "Backend development",
      "Database development",
      "API integration",
      "Testing",
      "Deployment",
      "Cloud setup",
      "Monitoring",
      "Maintenance",
      "Updates",
      "Technical support"
    ]
  },
  services: [
    {
      id: 1,
      name: "Digital Product Development",
      category: "Software Engineering",
      description: "Build custom high-performance web applications, corporate websites, SaaS platforms, and mobile apps tailored to business operations.",
      capabilities: [
        "SaaS development",
        "React/Vite frontend apps",
        "Custom CRM and ERP platforms",
        "iOS & Android mobile development",
        "Admin dashboards and booking portals"
      ],
      targetCustomers: "Businesses needing custom digital tools, platforms, or applications.",
      exampleSolutions: [
        "Client booking portals",
        "Inventory dashboards",
        "Company scheduling apps"
      ],
      discoveryQuestions: [
        "What problem are you trying to solve?",
        "Do you need web development, mobile apps, or both?",
        "What major features do you require?"
      ],
      status: "available"
    },
    {
      id: 2,
      name: "AI & Business Automation",
      category: "Artificial Intelligence",
      description: "Automate repetitive manual business operations and workflows using AI assistants, email automations, and intelligent document parsers.",
      capabilities: [
        "AI customer support chatbots",
        "Automated lead sorting workflows",
        "Email trigger automations",
        "Document data extraction"
      ],
      targetCustomers: "Businesses looking to cut down on manual admin work and accelerate response times.",
      exampleSolutions: [
        "Automated support desks",
        "Lead scoring triggers",
        "AI database entry tools"
      ],
      discoveryQuestions: [
        "What process are you currently doing manually?",
        "What tools or systems do you currently use?",
        "What would you like the automation to accomplish?"
      ],
      status: "available"
    },
    {
      id: 3,
      name: "Cloud & Infrastructure",
      category: "DevOps",
      description: "Host, migrate, and configure scalable servers and databases with monitoring, backups, and modern CI/CD pipelines.",
      capabilities: [
        "AWS, Azure, and Google Cloud setups",
        "Docker container orchestrations",
        "CI/CD release workflows",
        "Database hosting and backup management"
      ],
      targetCustomers: "Companies needing reliable, scalable, and secure application hosting.",
      exampleSolutions: [
        "Auto-scaling cloud infrastructure",
        "Secure remote database backups",
        "Automated build pipelines"
      ],
      discoveryQuestions: [
        "Where is your application currently hosted?",
        "What level of traffic or scaling capacity do you expect?",
        "Do you require continuous deployment pipelines?"
      ],
      status: "available"
    },
    {
      id: 4,
      name: "24/7 IT Support",
      category: "Maintenance",
      description: "Ongoing support and software maintenance contracts for troubleshooting, server issues, security patches, and application updates.",
      capabilities: [
        "Bug fixing and code updates",
        "Server status monitoring",
        "Database optimization",
        "Security patching"
      ],
      targetCustomers: "Businesses with active platforms requiring regular maintenance and tech assistance.",
      exampleSolutions: [
        "Website SLA support",
        "Emergency server restoration support",
        "Active monitoring services"
      ],
      discoveryQuestions: [
        "Does your platform experience frequent bugs or downtime?",
        "Do you have a dedicated in-house technical team?",
        "What level of response time (SLA) does your business require?"
      ],
      status: "available"
    },
    {
      id: 5,
      name: "E-Commerce Solutions",
      category: "Software Engineering",
      description: "Build custom digital stores, shopping carts, inventory integrations, checkout systems, and client dashboards.",
      capabilities: [
        "Custom online storefronts",
        "Secure checkout integrations",
        "Inventory syncing systems",
        "Customer accounts portal"
      ],
      targetCustomers: "Retailers and brands wanting to sell products online with custom features.",
      exampleSolutions: [
        "E-commerce apps",
        "B2B bulk purchase platforms",
        "Subscription-based shops"
      ],
      discoveryQuestions: [
        "What kind of products do you sell?",
        "Do you have an existing physical or digital store?",
        "Do you require custom shipping or payment configurations?"
      ],
      status: "available"
    },
    {
      id: 6,
      name: "Logistics & Fleet Solutions",
      category: "Software Engineering",
      description: "Custom dispatch dashboards, driver apps, delivery monitors, and warehouse tracking platforms built around your operations.",
      capabilities: [
        "Driver schedule management",
        "Delivery route mapping",
        "Warehouse shipment tracking",
        "Fleet tracking monitors"
      ],
      targetCustomers: "Delivery companies, logistics hubs, and fleet operators.",
      exampleSolutions: [
        "Driver mobile apps",
        "Dispatcher control screens",
        "Warehouse tracking boards"
      ],
      discoveryQuestions: [
        "How many vehicles or drivers do you manage?",
        "What type of cargo or delivery flows do you handle?",
        "Do you require real-time vehicle tracking?"
      ],
      status: "available"
    },
    {
      id: 7,
      name: "Education & Career Solutions",
      category: "Consultation",
      description: "Provide personalized career consultation, higher education direction, technology pathway planning, and academic project mentorship.",
      capabilities: [
        "IT career planning",
        "Course path evaluation",
        "Academic project planning",
        "Tech skills pathway guidance"
      ],
      targetCustomers: "Students and young professionals looking to navigate tech career lanes.",
      exampleSolutions: [
        "One-on-one career roadmaps",
        "Student academic assistance plans",
        "Skill pathway sheets"
      ],
      discoveryQuestions: [
        "What are you currently studying or working as?",
        "What tech fields interest you the most?",
        "What is your primary professional or educational goal?"
      ],
      status: "available"
    },
    {
      id: 8,
      name: "Learning & Training Software Solutions",
      category: "Education",
      description: "Real-world oriented, practical coding training in web technologies, app development, cloud infrastructure, and AI engineering.",
      capabilities: [
        "Web engineering modules",
        "Cloud/DevOps learning materials",
        "Practical coding workspace training",
        "Industry skill training courses"
      ],
      targetCustomers: "Students wanting practical coding experience and technical training.",
      exampleSolutions: [
        "Coding workshops",
        "Internship-integrated training modules",
        "Skill bootcamp programs"
      ],
      discoveryQuestions: [
        "Have you done any programming before?",
        "Which technologies do you wish to gain practical training in?",
        "Are you looking for student projects or internship preparation?"
      ],
      status: "available"
    },
    {
      id: 9,
      name: "Interior & Space Design",
      category: "Design",
      description: "Complete design layout, space planning, lighting concepts, 3D interior renderings, and furniture selection for homes and offices.",
      capabilities: [
        "Office workspace design",
        "Residential interiors",
        "3D interior blueprints",
        "Space optimization layouts"
      ],
      targetCustomers: "Homeowners and office managers seeking custom room layouts.",
      exampleSolutions: [
        "Modern office design plans",
        "Residential visual layouts",
        "Commercial retail interior setups"
      ],
      discoveryQuestions: [
        "Is this design for a home or commercial office?",
        "What is the approximate size of the space?",
        "What design style do you prefer?"
      ],
      status: "available"
    },
    {
      id: 10,
      name: "Global Trade & Commerce",
      category: "Global Trade",
      description: "Preparing to expand into international logistics coordination, customs navigation assistance, product sourcing, and export-import coordination.",
      capabilities: [
        "Future supplier networking",
        "Upcoming custom validation support",
        "Cross-border commerce roadmaps"
      ],
      targetCustomers: "Upcoming global businesses looking for export/import infrastructure.",
      exampleSolutions: [],
      discoveryQuestions: [],
      status: "upcoming"
    }
  ] as ServiceDetail[],
  leadQuestions: {
    name: "What is your full name?",
    email: "What email address should we contact you at?",
    company: "What is the name of your company or organization?",
    description: "Please briefly describe your project or what you would like to build.",
    budget: "What is your estimated budget range for this project?",
    timeline: "What is your target launch timeline?"
  }
};
