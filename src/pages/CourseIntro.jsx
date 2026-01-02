import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSwitch from '../components/ThemeSwitch';
import SafeImage from '../components/SafeImage';
import EtheralShadow from '../components/ui/etheral-shadow';
import { getIntroBySlug } from '../data/courseIntroData';
import AnimatedBackdrop from '../components/ui/animated-backdrop';
import CourseDock from '../components/ui/CourseDock';
import { Clock, Award, Shield, Bug, Search, Lock, ClipboardList, Mail, Wifi, Laptop, Cloud, Magnet, FileCheck, ShieldCheck, User, Sun, Moon } from 'lucide-react';

export default function CourseIntro({ courseSlug }) {
  const navigate = useNavigate();
  const data = getIntroBySlug(courseSlug);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="%23bbbbbb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="3" ry="3"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="16" cy="10" r="1"/><path d="M3 18h18"/></svg>';

  const isCiscoStyle = courseSlug === 'cyber-security-beginner' || courseSlug === 'ethical-hacker' || courseSlug === 'cyber-security-intermediate';

  if (!data && !isCiscoStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold">Course not found</h1>
          <p className="mt-2 text-gray-700">We couldn't find the requested course introduction page.</p>
          <button onClick={() => navigate('/courses')} className="mt-6 px-4 py-2 rounded bg-blue-600 text-white">Back to Courses</button>
        </div>
      </div>
    );
  }

  const firstModuleSlug = data.modules?.[0]?.slug || 'module-1';
  // Special styling boost for Networking - Intermediate page
  const isNetworkingIntermediate = courseSlug === 'networking-intermediate';

  if (isCiscoStyle) {
    // Dynamic content selection based on course slug
    const isIntermediate = courseSlug === 'cyber-security-intermediate';
    
    const title = isIntermediate 
      ? 'Cyber Security — Intermediate Level' 
      : 'Cyber Security — Beginner Level';
      
    const duration = isIntermediate ? '80 Hours' : '70 Hours';
    
    const overview = isIntermediate
      ? 'Deepen your offensive and defensive skills with advanced scanning, exploitation frameworks, and web application security. Master network traffic analysis and secure wireless environments.'
      : 'Build practical offensive security skills to systematically uncover weaknesses before cybercriminals do. Learn scoping, reconnaissance, vulnerability analysis, and reporting with hands-on labs.';
      
    const prerequisites = isIntermediate
      ? ['Completion of Cyber Security Beginner', 'Solid Networking Knowledge', 'Familiarity with Linux Command Line']
      : ['Basic IT or networking knowledge', 'Familiarity with Linux/Windows basics', 'Willingness to follow an ethical code of conduct'];
      
    const skills = isIntermediate 
      ? [
          { icon: Shield, label: 'Network Defense' },
          { icon: Search, label: 'Traffic Analysis' },
          { icon: Bug, label: 'Metasploit' },
          { icon: Lock, label: 'Web Security' }
        ]
      : [
          { icon: Shield, label: 'Cybersecurity' },
          { icon: Search, label: 'Recon & Analysis' },
          { icon: Bug, label: 'Penetration Testing' },
          { icon: Lock, label: 'Vulnerability Assessment' }
        ];

    const syllabusModules = isIntermediate 
       ? [
          {
            id: 'module-1',
            title: 'Module 1: Viruses & Malware Engineering',
            duration: '1 week',
            topics: [
              'What is a Computer Virus?',
              'Worms vs Viruses',
              'Trojans & RATs',
              'File Infectors',
              'Macro & Script-based Viruses',
              'Boot Sector Viruses',
              'Polymorphic & Metamorphic Viruses',
              'Ransomware Fundamentals',
              'How AI Can Generate a Virus (Ethical Demonstration)'
            ]
          },
          {
            id: 'module-2',
            title: 'Module 2: Password Cracking in Kali Linux',
            duration: '1 week',
            topics: [
              'Introduction to Password Cracking',
              'John the Ripper Basics',
              'John the Ripper Wordlist Attacks',
              'Introduction to Hydra',
              'Password Cracking with Hydra (SSH, FTP, HTTP)',
              'Hashcat Basics & GPU Cracking',
              'CeWL – Wordlist Generator',
              'Medusa – Parallel Bruteforce Tool',
              'Ethical Use of Password Cracking Tools'
            ]
          },
          {
            id: 'module-3',
            title: 'Module 3: Backdoors & Persistence',
            duration: '1 week',
            topics: [
              'What is a Backdoor?',
              'Remote Access Trojans (RATs)',
              'Bind Shells vs Reverse Shells',
              'Netcat Backdoor Techniques',
              'msfvenom Payload Creation',
              'Meterpreter Backdoor Sessions',
              'Persistence Mechanisms in Linux',
              'Persistence Techniques in Windows',
              'How to Create a Backdoor (Ethical Demo)'
            ]
          },
          {
            id: 'module-4',
            title: 'Module 4: SQL Injection & Bug Bounty Introduction',
            duration: '1 week',
            topics: [
              'What is SQL Injection?',
              'Types of SQL Injection (Union, Blind, Error-Based)',
              'SQLMap Tool Basics',
              'Manual SQL Injection Testing',
              'Database Fingerprinting',
              'Boolean-Based Blind SQL Injection',
              'Time-Based Blind SQL Injection',
              'Automating SQL Injection with SQLMap',
              'Bypassing Login Panels',
              'Preventing SQL Injection',
              'What is Bug Bounty Hunting?'
            ]
          },
          {
            id: 'module-5',
            title: 'Module 5: Social Engineering Attacks',
            duration: '1 week',
            topics: [
              'Introduction to Social Engineering',
              'Pretexting Techniques',
              'Impersonation Attacks',
              'Physical Social Engineering Attacks',
              'Tailgating & Dumpster Diving',
              'Social Engineering Toolkits (SET)',
              'Methods of Influence',
              'Psychological Manipulation Techniques',
              'Summary & Real-World Examples'
            ]
          },
          {
            id: 'module-6',
            title: 'Module 6: Everything About Phishing Attacks',
            duration: '1 week',
            topics: [
              'What is Phishing?',
              'Email Phishing Attacks',
              'Spear Phishing',
              'Whaling Attacks',
              'Clone Phishing',
              'SMS Phishing (Smishing)',
              'Voice Phishing (Vishing)',
              'Phishing Toolkits & Frameworks',
              'Real-World Case Study'
            ]
          },
          {
            id: 'module-7',
            title: 'Module 7: Cloud, Mobile & IoT Security',
            duration: '1 week',
            topics: [
              'Introduction to Cloud & IoT Threats',
              'Cloud Attack Vectors',
              'Vulnerabilities in Cloud Platforms',
              'Attacking Containers & Virtual Machines',
              'Mobile OS Vulnerabilities (Android/iOS)',
              'IoT Device Exploitation Basics',
              'Common Attacks on Specialized Systems',
              'Securing Cloud & IoT',
              'Summary'
            ]
          },
          {
            id: 'module-8',
            title: 'Module 8: Post-Exploitation Techniques',
            duration: '1 week',
            topics: [
              'Introduction to Post-Exploitation',
              'Privilege Escalation Basics',
              'Creating Foothold in a System',
              'Maintaining Persistence',
              'Lateral Movement Techniques',
              'Tokens & Credential Dumping',
              'Detection Avoidance Techniques',
              'Internal Network Enumeration',
              'Summary'
            ]
          },
          {
            id: 'module-9',
            title: 'Module 9: Reporting & Communication in Cyber Security',
            duration: '1 week',
            topics: [
              'Introduction to Security Reporting',
              'Components of a Good Penetration Testing Report',
              'Writing Executive Summaries',
              'Documenting Vulnerabilities & Evidence',
              'Remediation Recommendations',
              'Communication with Clients During Pentesting',
              'Report Delivery Best Practices',
              'Ethics & Confidentiality',
              'Summary'
            ]
          },
          {
            id: 'module-10',
            title: 'Module 10: Tools & Code Analysis',
            duration: '1 week',
            topics: [
              'Introduction to Scripting for Cyber Security',
              'Understanding Python & Bash Basics',
              'Analyzing Exploit Code',
              'Common Automation Scripts for Pentesting',
              'Working with GitHub Exploits',
              'Using Metasploit Modules',
              'Static vs Dynamic Code Analysis',
              'Identifying Malicious Code Patterns',
              'Summary'
            ]
          }
         ]
      : [
      {
        id: 'module-1',
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
        id: 'module-2',
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
        id: 'module-3',
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
        id: 'module-4',
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
        id: 'module-5',
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
        id: 'module-6',
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
    ];
    return (
      <main className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
        <nav className={`sticky top-0 z-40 border-b ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-600" />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        <section className="max-w-screen-2xl mx-auto px-6 md:px-10 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2.5 py-1 rounded-full border ${isDark ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>Course</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Learn practical offensive security to uncover threats and strengthen defenses.</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm"><Clock className="w-4 h-4" />{duration}</span>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${isDark ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{isIntermediate ? 'Intermediate' : 'Beginner'}</span>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${isDark ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>Self-paced</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button onClick={() => navigate(`/${courseSlug}/module/${firstModuleSlug}`)} className="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Start Learning</button>
                <button onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })} className={`px-5 py-2.5 rounded-md border ${isDark ? 'border-gray-700 bg-black text-white hover:bg-gray-900' : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'}`}>Course Overview</button>
              </div>
            </div>
            <div className="lg:sticky lg:top-20">
              <div className={`rounded-xl overflow-hidden border shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <SafeImage
                  srcs={['/cy.webp', data?.heroImg, 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=1200&fit=crop&crop=center', FALLBACK_SVG].filter(Boolean)}
                  alt="Course banner"
                  className="w-full h-[300px] md:h-[340px] object-cover"
                />
                <div className={`grid grid-cols-4 gap-4 p-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex flex-col items-center gap-2">
                    <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-700'}`} />
                    <span className="text-xs">{duration}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs">{isIntermediate ? 'Intermediate' : 'Beginner'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs">Labs</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs">Self-paced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="max-w-screen-2xl mx-auto px-6 md:px-10 pb-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className={`rounded-xl border shadow-sm p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{overview}</p>
              </div>
              <div className={`rounded-xl border shadow-sm p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h2 className="text-xl font-semibold mb-3">What You’ll Learn</h2>
                <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Array.isArray(data.whatYouWillLearn) ? data.whatYouWillLearn.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 w-2 h-2 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  )) : null}
                </ul>
              </div>
              <div className={`rounded-xl border shadow-sm p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h2 className="text-xl font-semibold mb-3">Prerequisites</h2>
                <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {prerequisites.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1 w-2 h-2 rounded-full bg-blue-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <aside className="space-y-6">
              <div className={`w-full rounded-xl border shadow-sm p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-3">Skills Covered</h3>
                <div className="grid grid-cols-2 gap-3">
                  {skills.map(({ icon: Icon, label }) => (
                    <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDark ? 'border-gray-800 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`w-full rounded-xl border shadow-sm p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold">Achievements</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Badges you can earn in this course.</p>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    User,
                    ClipboardList,
                    Bug,
                    Search,
                    Mail,
                    Wifi,
                    Laptop,
                    Cloud,
                    Magnet,
                    FileCheck,
                    ShieldCheck
                  ].map((IconComp, idx) => (
                    <div key={idx} className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-green-400">
                      <IconComp className="w-6 h-6 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="max-w-screen-2xl mx-auto px-6 md:px-10 py-6">
          <div className={`flex items-center gap-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <button className={`py-3 px-1 font-medium border-b-2 border-blue-600 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Curriculum</button>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-4">
              {syllabusModules.map((m) => (
                <details key={m.id} className={`group rounded-xl border shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                  <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-100 border-green-300'}`}>
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{m.title}</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{m.duration}</div>
                      </div>
                    </div>
                    <div className="text-gray-500 group-open:rotate-180 transition-transform">▾</div>
                  </summary>
                  <div className="px-5 pb-4">
                    <ul className={`list-disc pl-6 space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {m.topics.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <button onClick={() => navigate(`/${courseSlug}/module/${m.id}`)} className="mt-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Start Module</button>
                  </div>
                </details>
              ))}
            </div>
            <aside className="space-y-6">
              <div className={`rounded-xl border shadow-sm p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-3">Skills You Will Learn</h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Reconnaissance, vulnerability analysis, exploitation basics, reporting and mitigation recommendations.</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
          <h2 className="text-2xl font-semibold mb-4">Related Courses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Network Security Basics', d: 'Foundations of secure network design and controls' },
              { t: 'Penetration Testing Essentials', d: 'Practical methodology for structured assessments' },
              { t: 'Web Application Security', d: 'OWASP-aligned testing and defenses' }
            ].map((c) => (
              <div key={c.t} className={`rounded-xl border shadow-sm p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{c.t}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{c.d}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <button onClick={() => navigate('/courses')} className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Explore</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`max-w-7xl mx-auto px-6 md:px-10 py-8 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            <div className="flex flex-wrap gap-4">
              <a href="/about" className="hover:text-blue-700">About</a>
              <a href="/courses" className="hover:text-blue-700">Courses</a>
              <a href="/contact" className="hover:text-blue-700">Support</a>
              <a href="#" className="hover:text-blue-700">Privacy</a>
            </div>
            <div className="mt-3 text-gray-500">© BluNet Academy</div>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className={`relative min-h-screen pt-24 ${isDark ? 'bg-black text-white' : 'bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900'}`}>
      {/* Scoped animated backdrop: header + hero only in dark mode */}
      <div className="relative">
        {isDark && (
          <AnimatedBackdrop className="absolute inset-0" dark opacity={0.28} />
        )}
        <div className={`${isNetworkingIntermediate ? 'max-w-screen-2xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 relative z-10`}>
          <div className="flex justify-end items-center mb-8">
            <ThemeSwitch />
          </div>
        </div>

        {/* Hero */}
        <section className={`${isNetworkingIntermediate ? 'max-w-screen-2xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 pb-12 relative z-10`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {/* Larger title and tagline for Networking - Intermediate */}
              <h1 className={`${isNetworkingIntermediate ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'} font-bold`}>
                {data.title}
              </h1>
              <p className={`mt-4 ${isNetworkingIntermediate ? 'text-lg md:text-xl' : ''} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{data.tagline}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm">{data.levelLabel}</span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm">{data.modules?.length || 0} modules</span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-sm">Hands-on projects</span>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => navigate(`/${courseSlug}/module/${firstModuleSlug}`)}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition"
                >
                  Start Learning
                </button>
                <button
                  onClick={() => document.getElementById('syllabus')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 transition"
                >
                  View Syllabus
                </button>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                srcs={[data.heroImg, 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&fit=crop&crop=center', FALLBACK_SVG]}
                alt="Course introduction"
                className={`w-full ${isNetworkingIntermediate ? 'h-72 sm:h-80 md:h-96' : ''} rounded-xl border border-gray-200 shadow-sm object-cover bg-white`}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Floating Dock */}
      <CourseDock courseSlug={courseSlug} firstModuleSlug={firstModuleSlug} />

      {/* What you'll learn */}
      {Array.isArray(data.whatYouWillLearn) && (
        <section className={isDark ? 'bg-black border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'}>
          <div className={`${isNetworkingIntermediate ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 py-14`}>
            <h2 className="text-2xl font-semibold">What you'll learn</h2>
            <ul className="mt-6 grid md:grid-cols-2 gap-4">
              {data.whatYouWillLearn.map((item) => (
                <li key={item} className={`p-4 rounded-lg shadow-sm border ${isDark ? 'bg-white/5 border-white/15 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Syllabus */}
      <section id="syllabus" className={`${isNetworkingIntermediate ? 'max-w-screen-2xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 py-14`}>
        <h2 className="text-2xl font-semibold">Course syllabus</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {data.modules?.map((m) => (
            <button
              key={m.title}
              onClick={() => navigate(`/${courseSlug}/module/${m.slug}`)}
              className={`text-left rounded-xl ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white/60 border-gray-200 text-gray-900'} backdrop-blur-xl shadow-sm p-6 cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={`Open ${m.title}`}
            >
              <div className="flex items-start gap-4">
                <SafeImage srcs={[m.bgImage, 'https://cdn.jsdelivr.net/gh/tabler/tabler-icons@2.47.0/icons/svg/network.svg', FALLBACK_SVG]} alt="" className="w-24 h-24 rounded-lg border border-gray-200 object-contain bg-white" />
                <div>
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{m.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Instructor (generic) */}
      <section className={isDark ? 'bg-black border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'}>
        <div className={`${isNetworkingIntermediate ? 'max-w-screen-2xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 py-14`}>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold">Meet your instructor</h2>
              <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Learn from practitioners with a focus on clarity, best practices, and hands-on learning.</p>
            </div>
            <div className="md:col-span-1">
              <div className={`rounded-xl shadow-sm p-6 border ${isDark ? 'bg-white/5 border-white/15' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 border border-indigo-200" />
                  <div>
                    <p className="font-semibold">Expert Instructor</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Industry experience, student-focused teaching.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
