// Minimal shared assignment definitions per course for AdminPanel summaries.
// Expand as needed to cover all courses.

export interface AssignmentDef {
  id: string;
  title: string;
}

export function getAssignmentDefinitions(courseKey: string): AssignmentDef[] {
  switch (courseKey) {
    case 'frontend-beginner':
      return [
        { id: 'html-part-1', title: 'HTML Part 1' },
        { id: 'html-part-2', title: 'HTML Part 2' },
        { id: 'css-part-1', title: 'CSS Part 1' },
        { id: 'css-part-2', title: 'CSS Part 2' },
        { id: 'javascript-part-1', title: 'JavaScript Part 1' },
        { id: 'javascript-part-2', title: 'JavaScript Part 2' }
      ];
    case 'ai-tools-mastery':
      return [
        { id: 'ai-fundamentals', title: 'AI Fundamentals' },
        { id: 'language-models', title: 'ChatGPT & Language Models' },
        { id: 'ai-images', title: 'AI Image Tools' },
        { id: 'ai-video', title: 'AI Video Tools' },
        { id: 'ai-automation', title: 'AI Automation & Workflows' },
        { id: 'ai-capstone', title: 'AI Capstone Project' }
      ];
    case 'devops-beginner':
      return [
        { id: 'linux-basics', title: 'Linux Basics' },
        { id: 'version-control', title: 'Git & Version Control' },
        { id: 'ci-cd', title: 'CI/CD Foundations' },
        { id: 'containers', title: 'Containers & Docker' }
      ];
    case 'networking-beginner':
      return [
        { id: 'networking-fundamentals', title: 'Networking Fundamentals' },
        { id: 'packet-tracer-basics', title: 'Cisco Packet Tracer Basics' },
        { id: 'tools-and-troubleshooting', title: 'Ping, Traceroute, Netstat' },
        { id: 'nmap-basics', title: 'Nmap Scanning Basics' }
      ];
    case 'networking-intermediate':
      return [
        { id: 'advanced-linux-network-isolation', title: 'Advanced Linux Network Isolation' },
        { id: 'dynamic-firewall-and-security-rules', title: 'Dynamic Firewall and Security Rules' },
        { id: 'high-availability-networking', title: 'High Availability Networking' },
        { id: 'enterprise-routing-and-segmentation', title: 'Enterprise Routing & Segmentation' },
        { id: 'secure-network-tunnels-and-vpns', title: 'Secure Network Tunnels and VPNs' },
        { id: 'monitoring-logging-and-performance-tools', title: 'Monitoring, Logging, and Performance Tools' }
      ];
    case 'cyber-security-beginner':
      return [
        { id: 'cyber-security-1', title: 'Fundamentals of Cyber Security Governance & Risk' },
        { id: 'cyber-security-2', title: 'Secure Software Development & Web Vulnerabilities' },
        { id: 'cyber-security-3', title: 'Malware, Threat Intelligence & Incident Response' },
        { id: 'cyber-security-4', title: 'Advanced Network Security & Defense Mechanisms' },
        { id: 'cyber-security-5', title: 'Ethical Hacking Tools, OSINT & Exploit Techniques' },
        { id: 'cyber-security-6', title: 'Emerging Technologies & Cybersecurity Trends' }
      ];
    default:
      return [];
  }
}

// Helper to normalize possible course identifiers to known keys
export function normalizeCourseKey(input: any): string | null {
  if (!input) return null;
  const str = typeof input === 'string' ? input : (input.courseId || input._id || input.id || '').toString();
  if (!str) return null;
  const s = str.toLowerCase();
  if (s.includes('frontend') && s.includes('beginner')) return 'frontend-beginner';
  if (s.includes('ai') && s.includes('tools')) return 'ai-tools-mastery';
  if (s.includes('devops') && s.includes('beginner')) return 'devops-beginner';
  if (s.includes('network') && s.includes('beginner')) return 'networking-beginner';
  if (s.includes('network') && s.includes('intermediate')) return 'networking-intermediate';
  // Allow exact keys
  if (s.includes('cyber') && s.includes('security') && s.includes('beginner')) return 'cyber-security-beginner';
  if (s === 'frontend-beginner' || s === 'ai-tools-mastery' || s === 'devops-beginner' || s === 'networking-beginner' || s === 'networking-intermediate' || s === 'cyber-security-beginner') return s;
  return null;
}

// Shared mapping for display titles from normalized keys
export function getCourseTitleFromKey(key: string | null | undefined): string | null {
  if (!key) return null;
  switch (key) {
    case 'frontend-beginner':
      return 'Frontend Development - Beginner';
    case 'ai-tools-mastery':
      return 'A.I Tools Mastery';
    case 'devops-beginner':
      return 'DevOps – Beginner';
    case 'networking-beginner':
      return 'Networking - Beginner';
    case 'networking-intermediate':
      return 'Networking - Intermediate';
    case 'cyber-security-beginner':
      return 'Cyber Security - Beginner';
    default:
      return null;
  }
}
