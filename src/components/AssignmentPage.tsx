import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpenIcon, 
  ClipboardDocumentCheckIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import MagnetLines from './MagnetLines';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper: derive courseId and moduleId from assignmentId
const getCourseAndModuleForAssignment = (id: string, title?: string) => {
  let courseId: string | null = null;
  let moduleId = 'assignments';
  if (id?.startsWith('frontend-beginner')) {
    courseId = 'frontend-beginner';
  } else if (id?.startsWith('devops-beginner')) {
    courseId = 'devops-beginner';
  } else if (id?.startsWith('networking-beginner')) {
    courseId = 'networking-beginner';
  } else if (id?.startsWith('networking-intermediate')) {
    courseId = 'networking-intermediate';
  } else if (id?.startsWith('frontend-intermediate')) {
    courseId = 'frontend-intermediate';
  } else if (id?.startsWith('ai-tools')) {
    courseId = 'ai-tools-mastery';
    const numMatch = id.match(/ai-tools-(\d+)/);
    if (numMatch) moduleId = `module_${numMatch[1]}`;
  } else if (id?.startsWith('cyber-security-intermediate')) {
      courseId = 'cyber-security-intermediate';
      const numMatch = id.match(/cyber-security-intermediate-(\d+)/);
      if (numMatch) moduleId = `module_${numMatch[1]}`;
    }
    else if (id?.startsWith('cyber-security')) {
      courseId = 'cyber-security-beginner';
      const numMatch = id.match(/cyber-security-(\d+)/);
      if (numMatch) moduleId = `module_${numMatch[1]}`;
    }
  return { courseId, moduleId, assignmentTitle: title || id };
};
interface Question {
  questionId: number;
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface Topic {
  topicId: string;
  title: string;
  content: string;
  examples?: string[];
  syntax?: string;
  explanation?: string;
  id?: string; // fallback id from backend topics
}

interface Assignment {
  assignmentId: string;
  courseId: string | null;
  title: string;
  description: string;
  topics: Topic[];
  questions: Question[];
  totalQuestions: number;
  passingPercentage: number;
}

interface AttemptHistory {
  _id: string;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  createdAt: string;
}

const AssignmentPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  // Use the assignmentId directly without remapping
  const effectiveAssignmentId = assignmentId;
  
  const [currentView, setCurrentView] = useState<'study' | 'test' | 'results'>('study');
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [testResult, setTestResult] = useState<any>(null);
  const [attemptHistory, setAttemptHistory] = useState<AttemptHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const localAssignmentFallback = (id: string): Assignment | null => {
    if (id === 'cyber-security-1') {
      const topics: Topic[] = [
        { topicId: 'cyber-security-governance', title: 'Cyber Security Governance', content: 'Cyber Security Governance is the framework of policies, procedures, and processes that ensures an organization’s cybersecurity aligns with its business goals, legal requirements, and risk management strategies. It involves establishing roles and responsibilities, setting priorities for security investments, and monitoring security performance across the organization. Governance ensures that cybersecurity decisions are not ad hoc but are strategic, coordinated, and measurable. It also involves integrating regulatory compliance, risk management, and corporate strategy into day-to-day operations, enabling organizations to proactively prevent cyber incidents rather than reacting after the fact.' },
        { topicId: 'security-frameworks', title: 'Security Frameworks (ISO 27001, NIST, COBIT)', content: 'Security frameworks provide structured approaches to manage and improve cybersecurity practices.\n\nISO 27001 is an international standard that defines requirements for an Information Security Management System (ISMS), focusing on risk assessment and continuous improvement.\n\nNIST Cybersecurity Framework is widely used in the U.S., offering a flexible structure of Identify, Protect, Detect, Respond, and Recover, suitable for both public and private sectors.\n\nCOBIT (Control Objectives for Information and Related Technologies) focuses on governance and management of IT, helping organizations ensure IT aligns with business goals while managing risks. Using these frameworks, organizations can standardize security practices, improve compliance, and measure effectiveness.' },
        { topicId: 'risk-management-process', title: 'Risk Management Process', content: 'The Risk Management Process identifies, evaluates, and mitigates potential threats that can impact an organization. It involves several steps:\n\nRisk Identification: Determine assets, threats, and vulnerabilities.\n\nRisk Assessment: Evaluate the likelihood and impact of identified risks.\n\nRisk Mitigation: Implement measures to reduce or control risks.\n\nMonitoring and Review: Continuously track risks and adjust controls.\n\nThe goal is to balance risk and resources, ensuring critical assets are protected without over-investing in low-priority areas. Effective risk management improves decision-making and strengthens overall security posture.' },
        { topicId: 'vuln-vs-pentest', title: 'Vulnerability Assessment vs Penetration Testing', content: 'Although both aim to improve security, they serve different purposes:\n\nVulnerability Assessment (VA): Systematic scanning of systems, networks, or applications to identify known vulnerabilities. It is usually automated, reports weaknesses, and prioritizes remediation.\n\nPenetration Testing (Pen Test): Simulates a real attack by exploiting vulnerabilities to determine how deep an attacker can penetrate. It is more hands-on and reveals practical risks beyond just listing vulnerabilities.\n\nTogether, they help organizations identify weaknesses and validate security measures effectively.' },
        { topicId: 'security-audits-compliance', title: 'Security Audits and Compliance', content: 'Security audits are formal reviews of an organization’s security controls to ensure they meet policies, standards, and regulatory requirements. Compliance refers to adhering to laws, regulations, and industry standards, such as GDPR, HIPAA, or PCI-DSS. Audits evaluate technical controls, processes, and documentation, helping organizations identify gaps and reduce the likelihood of fines, data breaches, or reputational damage. Regular audits ensure that security is continuously aligned with regulatory and business requirements.' },
        { topicId: 'access-control-models', title: 'Access Control Models (MAC, DAC, RBAC)', content: 'Access control defines who can access what resources in a system:\n\nMandatory Access Control (MAC): The system enforces policies set by a central authority. Users cannot change access permissions.\n\nDiscretionary Access Control (DAC): Resource owners control access, assigning permissions as they see fit.\n\nRole-Based Access Control (RBAC): Users are assigned roles, and roles determine access rights.\n\nImplementing the correct model ensures confidentiality and integrity of sensitive information while reducing the risk of unauthorized access.' },
        { topicId: 'mfa', title: 'Multi-Factor Authentication (MFA)', content: 'MFA enhances security by requiring two or more forms of verification to access an account or system. These factors include:\n\nSomething you know: Password or PIN\n\nSomething you have: Security token or smartphone\n\nSomething you are: Biometrics like fingerprint or facial recognition\n\nBy combining multiple factors, MFA significantly reduces the likelihood of unauthorized access, even if one credential is compromised. It is widely adopted in corporate, financial, and cloud environments.' },
        { topicId: 'digital-signatures-certificates', title: 'Digital Signatures & Certificates', content: 'Digital signatures ensure authentication, integrity, and non-repudiation of digital communications. Using public-key cryptography, a sender signs a document or message, and recipients verify it with the sender’s public key. Certificates, issued by a Certificate Authority (CA), confirm the identity of users, websites, or services. Digital signatures and certificates are critical in secure email, HTTPS communications, software signing, and identity verification, ensuring trust in digital interactions.' },
        { topicId: 'network-segmentation', title: 'Network Segmentation & Zoning', content: 'Network segmentation divides a network into smaller, isolated segments to control traffic flow and contain breaches. Zoning defines areas based on security requirements, such as internal, DMZ, and external zones. Segmentation limits the lateral movement of attackers and improves monitoring and performance. For example, critical servers may be isolated in a high-security zone, while general user systems remain in a separate zone. This approach enhances security, improves compliance, and reduces attack surfaces.' },
        { topicId: 'vpns', title: 'Virtual Private Networks (VPNs)', content: 'A VPN creates a secure, encrypted tunnel over the internet between a user and a network. VPNs ensure confidentiality, integrity, and authenticity of transmitted data.\n\nCommon use cases include:\n\nRemote workers accessing corporate networks\n\nSecure communications over public Wi-Fi\n\nProtecting sensitive data from eavesdropping\n\nVPN technologies often use protocols like IPSec, OpenVPN, or SSL/TLS, providing both privacy and secure access for users across unsecured networks.' },
        { topicId: 'cloud-security-basics', title: 'Cloud Security Basics', content: 'Cloud security involves protecting data, applications, and services hosted in the cloud. It addresses challenges such as:\n\nData breaches\n\nMisconfigured services\n\nInsecure APIs\n\nInsider threats\n\nOrganizations implement measures like encryption, identity and access management (IAM), monitoring, and compliance checks. Cloud providers often offer shared responsibility models, where both the provider and customer have security duties. Cloud security ensures confidentiality, integrity, and availability in scalable environments.' },
        { topicId: 'endpoint-security', title: 'Endpoint Security Techniques', content: 'Endpoint security protects devices like laptops, desktops, and mobile phones from cyber threats. Techniques include:\n\nAntivirus and anti-malware software\n\nEndpoint Detection and Response (EDR) solutions\n\nDevice encryption\n\nApplication control\n\nPatch management\n\nEndpoint security is critical because endpoints are often the primary entry points for attackers, and a single compromised device can threaten the entire network.' },
        { topicId: 'mobile-device-security', title: 'Mobile Device Security', content: 'Mobile devices are increasingly targeted due to personal and corporate data access. Key security measures include:\n\nDevice encryption and secure lock screens\n\nMobile Device Management (MDM) solutions\n\nSecure app usage and sandboxing\n\nVPNs for secure connections\n\nRegular OS and app updates\n\nMobile device security ensures confidential data and corporate information remain protected even in mobile work environments.' },
        { topicId: 'security-awareness', title: 'Security Awareness Programs', content: 'Human error is one of the largest causes of security breaches. Security awareness programs educate employees about phishing, social engineering, password hygiene, and safe internet practices. These programs involve training, simulations, and periodic testing to measure understanding. A strong awareness program reduces risk, promotes a security-first culture, and empowers users to act as the first line of defense.' },
        { topicId: 'insider-threats', title: 'Insider Threats & Mitigation', content: 'Insider threats come from employees, contractors, or partners who abuse access intentionally or unintentionally. Threats include data theft, sabotage, or accidental leaks. Mitigation strategies involve:\n\nRole-based access controls\n\nActivity monitoring and auditing\n\nEmployee training and awareness\n\nIncident response planning\n\nBy monitoring, restricting, and educating insiders, organizations minimize the risk of internal breaches, which are often more damaging than external attacks.' }
      ];
      const questions: Question[] = [
        { questionId: 1, question: 'What is the primary purpose of cyber security governance?', options: ['To implement firewalls only', 'To align security strategies with business objectives', 'To write software code', 'To create antivirus software'], correctAnswer: 1 },
        { questionId: 2, question: 'Which of the following frameworks focuses on information security management systems?', options: ['NIST', 'ISO 27001', 'COBIT', 'ITIL'], correctAnswer: 1 },
        { questionId: 3, question: 'Which step in risk management involves implementing measures to reduce or control risks?', options: ['Risk Identification', 'Risk Assessment', 'Risk Mitigation', 'Risk Monitoring'], correctAnswer: 2 },
        { questionId: 4, question: 'What is the key difference between vulnerability assessment and penetration testing?', options: ['VA is hands-on, Pen Test is automated', 'VA finds vulnerabilities, Pen Test exploits them', 'Pen Test is theoretical only', 'VA requires hacking tools'], correctAnswer: 1 },
        { questionId: 5, question: 'Security audits are primarily conducted to:', options: ['Replace firewalls', 'Ensure adherence to policies, standards, and regulations', 'Write code faster', 'Monitor internet speed'], correctAnswer: 1 },
        { questionId: 6, question: 'Which access control model restricts users from changing permissions assigned by a central authority?', options: ['DAC', 'RBAC', 'MAC', 'ABAC'], correctAnswer: 2 },
        { questionId: 7, question: 'Which of the following is not considered a factor in MFA?', options: ['Password', 'Fingerprint', 'Security token', 'Username only'], correctAnswer: 3 },
        { questionId: 8, question: 'Digital signatures provide all of the following EXCEPT:', options: ['Authentication', 'Non-repudiation', 'Confidentiality', 'Integrity'], correctAnswer: 2 },
        { questionId: 9, question: 'What is the primary purpose of network segmentation?', options: ['To increase internet speed', 'To isolate network sections and reduce attack surfaces', 'To reduce hardware cost', 'To increase storage capacity'], correctAnswer: 1 },
        { questionId: 10, question: 'A VPN primarily ensures:', options: ['Faster downloads', 'Secure, encrypted communication over the internet', 'Firewall bypass', 'Cloud hosting'], correctAnswer: 1 },
      ];
      return {
        assignmentId: 'cyber-security-1',
        courseId: 'cyber-security-beginner',
        title: 'Fundamentals of Cyber Security Governance & Risk',
        description: 'Study governance, frameworks, risk processes, controls, and foundational defenses.',
        topics,
        questions,
        totalQuestions: questions.length,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-2') {
      const topics: Topic[] = [
        {
          topicId: 'ssdlc',
          title: 'Secure Software Development Lifecycle (SSDLC)',
          content: 'The Secure Software Development Lifecycle (SSDLC) integrates security at every phase of software development. Unlike traditional SDLC, which focuses mainly on functionality, SSDLC emphasizes risk assessment, secure coding practices, and testing for vulnerabilities. Key phases include requirements analysis, design, coding, testing, deployment, and maintenance, with security checkpoints embedded throughout. Incorporating SSDLC ensures that security is proactive rather than reactive, reducing potential software flaws, breaches, and compliance issues. This approach also enhances trust among users and stakeholders by ensuring the software remains resilient against attacks throughout its lifecycle.'
        },
        {
          topicId: 'threat-modeling',
          title: 'Threat Modeling Techniques',
          content: 'Threat modeling is a structured approach to identify, evaluate, and mitigate potential threats to a system or application. It involves analyzing assets, identifying threat actors, and understanding potential attack vectors. Techniques include STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege), PASTA (Process for Attack Simulation and Threat Analysis), and Attack Trees. Threat modeling helps security teams anticipate attacks, prioritize risks, and implement effective countermeasures before attackers exploit vulnerabilities, making it an essential part of proactive cybersecurity.'
        },
        {
          topicId: 'owasp-top-10',
          title: 'OWASP Top 10 Web Vulnerabilities',
          content: 'The OWASP Top 10 is a widely recognized standard for web application security risks. It identifies the most critical vulnerabilities, such as SQL Injection, Cross-Site Scripting (XSS), Broken Authentication, and Security Misconfigurations. Understanding these vulnerabilities allows developers and security professionals to prioritize security measures and apply preventive coding practices. Regularly reviewing the OWASP Top 10 ensures that web applications are resistant to common attacks and compliant with industry best practices.'
        },
        {
          topicId: 'sql-injection-advanced',
          title: 'SQL Injection Advanced Techniques',
          content: 'SQL Injection occurs when attackers inject malicious SQL commands into user input fields to manipulate databases. Advanced techniques include blind SQL injection, time-based injection, and union-based injection, which can extract sensitive data, modify records, or bypass authentication. Preventive measures include prepared statements, parameterized queries, and proper input validation. Understanding SQL Injection is critical for both developers and security analysts, as it is one of the most common and dangerous web application vulnerabilities.'
        },
        {
          topicId: 'command-injection-file-inclusion',
          title: 'Command Injection & File Inclusion',
          content: 'Command Injection allows attackers to execute arbitrary commands on the host operating system via vulnerable applications. File inclusion vulnerabilities (Local or Remote) allow attackers to include malicious files, potentially leading to code execution. These vulnerabilities typically arise from improper input validation and insecure coding practices. Mitigation includes input sanitization, least privilege execution, and secure coding standards, which help prevent attackers from gaining unauthorized access to systems or executing malicious scripts.'
        },
        {
          topicId: 'session-management',
          title: 'Session Management Vulnerabilities',
          content: 'Session management ensures that user interactions with web applications remain secure and consistent. Vulnerabilities include session fixation, session hijacking, and improper token handling, which can allow attackers to impersonate legitimate users. Secure session management involves using strong session IDs, enforcing timeouts, and ensuring HTTPS transmission. Properly managing sessions protects sensitive user data, maintains application integrity, and prevents unauthorized access.'
        },
        {
          topicId: 'csrf',
          title: 'CSRF (Cross-Site Request Forgery)',
          content: 'CSRF is an attack where malicious websites trick users into performing actions on another site where they are authenticated. For example, changing account settings or initiating transactions without the user’s knowledge. CSRF attacks exploit the trust a website has in the user’s browser, making mitigation critical. Solutions include anti-CSRF tokens, SameSite cookies, and user interaction verification. Educating developers about CSRF strengthens web application resilience against unauthorized actions.'
        },
        {
          topicId: 'clickjacking',
          title: 'Clickjacking Attacks',
          content: 'Clickjacking involves tricking users into clicking hidden or disguised elements on a web page, often resulting in unintended actions like authorizing payments or changing settings. Attackers use iframes or transparent layers to hide malicious elements. Mitigation techniques include X-Frame-Options headers, Content Security Policy (CSP), and user awareness. Understanding clickjacking is vital for developers to protect users from invisible manipulations that compromise security.'
        },
        {
          topicId: 'crypto-algorithms',
          title: 'Cryptography Algorithms Overview (AES, RSA, SHA)',
          content: 'Cryptography is the science of securing data using mathematical algorithms.\n\nAES (Advanced Encryption Standard): Symmetric encryption used for fast, secure data encryption.\n\nRSA: Asymmetric encryption for secure key exchange and digital signatures.\n\nSHA (Secure Hash Algorithm): Generates fixed-length hashes for data integrity verification.\n\nUnderstanding these algorithms is critical for implementing secure communications, data storage, and authentication systems. Proper use ensures confidentiality, integrity, and trust in digital systems.'
        },
        {
          topicId: 'pki',
          title: 'Public Key Infrastructure (PKI)',
          content: 'PKI is a framework that manages digital certificates and public-private key pairs, enabling secure communication and authentication. Components include Certificate Authorities (CAs), Registration Authorities (RAs), and certificate management systems. PKI supports digital signatures, email encryption, SSL/TLS, and identity verification, forming the backbone of secure internet communications. Knowledge of PKI helps professionals establish trust and secure sensitive transactions.'
        },
        {
          topicId: 'secure-protocols',
          title: 'Secure Network Protocols (HTTPS, SSH, SFTP)',
          content: 'Secure network protocols protect data in transit and ensure confidentiality, integrity, and authentication.\n\nHTTPS: Encrypts web traffic using TLS.\n\nSSH (Secure Shell): Provides secure remote administration and file transfers.\n\nSFTP: Securely transfers files over SSH, preventing eavesdropping.\nUsing secure protocols prevents man-in-the-middle attacks, data interception, and unauthorized access, making them essential for network and application security.'
        },
        {
          topicId: 'wireless-security',
          title: 'Wireless Network Security (WEP, WPA, WPA2, WPA3)',
          content: 'Wireless networks are vulnerable due to uncontrolled radio transmission. Security protocols provide layered protection:\n\nWEP: Outdated, weak encryption\n\nWPA/WPA2: Stronger encryption (TKIP/AES)\n\nWPA3: Latest standard with robust protection against brute-force attacks\nSecuring wireless networks prevents unauthorized access, eavesdropping, and network exploitation, which is crucial in corporate and public Wi-Fi environments.'
        },
        {
          topicId: 'iot-security',
          title: 'IoT Security Challenges',
          content: 'IoT devices often have limited processing power and weak security controls, making them attractive targets. Challenges include:\n\nDefault credentials\n\nLack of encryption\n\nFirmware vulnerabilities\n\nPoor update mechanisms\nMitigation involves strong authentication, regular firmware updates, network segmentation, and monitoring. Understanding IoT security is critical as these devices increasingly integrate into industrial, home, and healthcare environments.'
        },
        {
          topicId: 'social-media-security',
          title: 'Social Media Security & Privacy',
          content: 'Social media platforms are frequently targeted due to the large volume of personal data shared. Threats include phishing, account hijacking, and information leakage. Protective measures involve strong passwords, privacy settings, careful sharing, and two-factor authentication. Educating users about social media security reduces identity theft, data misuse, and reputational harm.'
        },
        {
          topicId: 'incident-response',
          title: 'Cybersecurity Incident Response',
          content: 'Incident response is a structured process to detect, analyze, contain, and recover from security incidents. Phases include Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned. A well-defined response plan minimizes damage, reduces recovery time, and prevents recurrence. Organizations practicing incident response are better prepared for ransomware attacks, breaches, and operational disruptions.'
        }
      ];

      const questions = [
        { questionId: 1, question: 'What is the main goal of the Secure Software Development Lifecycle?', options: ['To increase software speed', 'To integrate security throughout all stages of development', 'To focus only on testing', 'To reduce coding effort'], correctAnswer: 1 },
        { questionId: 2, question: 'Which threat modeling technique focuses on categories like Spoofing, Tampering, and Denial of Service?', options: ['PASTA', 'STRIDE', 'OWASP Top 10', 'NIST'], correctAnswer: 1 },
        { questionId: 3, question: 'What is the primary purpose of the OWASP Top 10?', options: ['To list programming languages', 'To identify the most critical web application security risks', 'To provide firewall configurations', 'To replace antivirus solutions'], correctAnswer: 1 },
        { questionId: 4, question: 'Blind SQL Injection allows an attacker to:', options: ['Execute commands without seeing immediate results', 'Encrypt database entries', 'Bypass firewalls', 'Perform phishing attacks'], correctAnswer: 0 },
        { questionId: 5, question: 'Command Injection vulnerabilities occur primarily due to:', options: ['Strong passwords', 'Input not properly validated', 'Encrypted network traffic', 'Secure coding'], correctAnswer: 1 },
        { questionId: 6, question: 'Session hijacking exploits:', options: ['Weak encryption algorithms', 'Unprotected session tokens', 'Firewall misconfigurations', 'Antivirus software'], correctAnswer: 1 },
        { questionId: 7, question: 'CSRF attacks exploit:', options: ['Weak encryption', 'Browser trust in authenticated users', 'Vulnerable firewalls', 'Password complexity'], correctAnswer: 1 },
        { questionId: 8, question: 'Clickjacking typically involves:', options: ['Overloading a network', 'Tricking a user into clicking hidden elements', 'Injecting SQL commands', 'Hijacking email accounts'], correctAnswer: 1 },
        { questionId: 9, question: 'Which algorithm is used for asymmetric encryption?', options: ['AES', 'RSA', 'SHA-256', 'DES'], correctAnswer: 1 },
        { questionId: 10, question: 'What is the main purpose of PKI?', options: ['Encrypt hard drives only', 'Manage digital certificates and public-private key pairs for secure communication', 'Replace firewalls', 'Perform vulnerability scanning'], correctAnswer: 1 }
      ];

      return {
        assignmentId: 'cyber-security-2',
        courseId: 'cyber-security-beginner',
        title: 'Secure Software Development & Web Vulnerabilities',
        description: 'Apply SSDLC, threat modeling and web security best practices.',
        topics,
        questions,
        totalQuestions: questions.length,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-3') {
      const topics: Topic[] = [
        {
          topicId: 'malware-analysis-advanced',
          title: 'Advanced Malware Analysis Techniques',
          content: 'Advanced malware analysis focuses on understanding how malicious software behaves, spreads, and persists inside a system. Unlike basic analysis, which only identifies malware type, advanced analysis examines code behavior, network communication, memory usage, and persistence mechanisms. Techniques include static analysis (examining malware without execution), dynamic analysis (running malware in a sandbox), and behavioral analysis (observing system changes). These techniques help security professionals identify malware capabilities, command-and-control communication, and potential impact, enabling effective detection and response strategies.'
        },
        {
          topicId: 'ransomware-lifecycle',
          title: 'Ransomware Attack Lifecycle',
          content: 'A ransomware attack follows a structured lifecycle starting with initial access, usually through phishing or exploited vulnerabilities. This is followed by execution and privilege escalation, allowing attackers to gain higher system control. Next comes lateral movement, where ransomware spreads across the network. Finally, data is encrypted and a ransom demand is issued. Understanding this lifecycle helps organizations detect attacks early, limit damage, and implement effective recovery strategies, such as backups and incident response plans.'
        },
        {
          topicId: 'spyware-adware',
          title: 'Spyware and Adware Threats',
          content: 'Spyware secretly monitors user activity to steal sensitive information, such as credentials and personal data. Adware, while often less harmful, displays unwanted advertisements and may track user behavior. Both threats degrade system performance and compromise privacy. They often enter systems through bundled software, malicious websites, or phishing links. Preventing these threats requires secure browsing habits, updated antivirus tools, and application control policies.'
        },
        {
          topicId: 'botnets-c2',
          title: 'Botnets & Command & Control Servers',
          content: 'Botnets are networks of compromised devices controlled by attackers through Command and Control (C2) servers. These infected devices, called bots, can perform coordinated attacks such as DDoS, spam campaigns, or credential harvesting. C2 communication may use HTTP, HTTPS, DNS, or even social media platforms to evade detection. Understanding botnets helps security teams identify abnormal traffic patterns and disrupt malicious communication channels.'
        },
        {
          topicId: 'network-traffic-analysis',
          title: 'Network Traffic Analysis Basics',
          content: 'Network traffic analysis involves monitoring and examining data packets flowing through a network to detect suspicious behavior. By analyzing protocols, ports, packet sizes, and communication frequency, security analysts can identify malware activity, unauthorized access, and data exfiltration. Traffic analysis is a fundamental skill in SOC operations and incident response, helping detect threats that bypass traditional security tools.'
        },
        {
          topicId: 'siem',
          title: 'Security Information and Event Management (SIEM)',
          content: 'SIEM systems collect and correlate logs and security events from multiple sources such as firewalls, servers, and endpoints. By analyzing these events in real time, SIEM solutions detect anomalies, policy violations, and potential attacks. They also support compliance reporting and incident investigation. SIEM plays a crucial role in centralized monitoring and threat detection within enterprise environments.'
        },
        {
          topicId: 'log-analysis-forensics',
          title: 'Log Analysis & Forensics',
          content: 'Log analysis involves reviewing system, application, and network logs to identify security incidents and trace attacker activity. Digital forensics extends this by preserving and analyzing evidence for legal or investigative purposes. Together, they help determine what happened, how it happened, and who was responsible. These skills are essential for incident response, compliance, and legal proceedings.'
        },
        {
          topicId: 'honeypots-honeynets',
          title: 'Honeypots & Honeynets',
          content: 'Honeypots are decoy systems designed to attract attackers, allowing security teams to observe malicious behavior safely. Honeynets are networks of honeypots that simulate real environments. They provide valuable intelligence on attack techniques, tools, and attacker intent. Honeypots help improve detection systems and strengthen defenses without risking production assets.'
        },
        {
          topicId: 'threat-intel-sources',
          title: 'Threat Intelligence Sources',
          content: 'Threat intelligence provides actionable information about current and emerging cyber threats. Sources include open-source feeds, commercial intelligence providers, government advisories, and internal incident data. Threat intelligence helps organizations anticipate attacks, prioritize defenses, and respond proactively. Effective intelligence transforms raw data into strategic security decisions.'
        },
        {
          topicId: 'dark-web-ecosystem',
          title: 'Dark Web & Cybercrime Ecosystem',
          content: 'The dark web hosts underground marketplaces, forums, and services used for illegal activities such as selling stolen data, malware, and hacking tools. Understanding the cybercrime ecosystem helps defenders track threat trends, leaked credentials, and planned attacks. Monitoring dark web activity supports early detection and incident prevention strategies.'
        },
        {
          topicId: 'data-breach-investigation',
          title: 'Data Breach Investigation',
          content: 'A data breach investigation aims to identify how sensitive data was accessed, exposed, or stolen. It involves analyzing logs, network traffic, affected systems, and user activity. Investigators determine the scope of the breach, impacted data, and legal obligations. Proper investigation minimizes damage, ensures regulatory compliance, and restores stakeholder trust.'
        },
        {
          topicId: 'incident-reporting',
          title: 'Incident Reporting and Documentation',
          content: 'Incident reporting involves documenting security incidents clearly and accurately. Reports include timelines, impacted systems, attack vectors, and remediation steps. Proper documentation supports legal action, compliance audits, and internal learning. Clear reporting also improves future response by identifying gaps in security controls.'
        },
        { topicId: 'ethical-hacking-methodology', title: 'Ethical Hacking Methodology', content: 'Ethical hacking methodology follows a structured and legal approach to identifying vulnerabilities. It includes reconnaissance, scanning, enumeration, exploitation, post-exploitation, and reporting. This methodology ensures that security testing is systematic, repeatable, and within legal boundaries, helping organizations strengthen defenses without causing harm.' },
        { topicId: 'vulnerability-scanners', title: 'Vulnerability Scanners Overview', content: 'Vulnerability scanners automatically identify known security weaknesses in systems, networks, and applications. They compare targets against vulnerability databases to detect missing patches, misconfigurations, and outdated software. While scanners provide broad visibility, they must be complemented with manual testing and validation to reduce false positives.' },
        { topicId: 'patch-management', title: 'Patch Management & Secure Updates', content: 'Patch management ensures that software and systems receive timely security updates to fix known vulnerabilities. Delayed patching is a major cause of breaches. Secure update mechanisms verify integrity and authenticity of patches to prevent supply-chain attacks. Effective patch management reduces risk and maintains system stability.' }
      ];
      const questions: Question[] = [
        { questionId: 1, question: 'Which malware analysis technique involves examining malware without executing it?', options: ['Dynamic analysis', 'Behavioral analysis', 'Static analysis', 'Network analysis'], correctAnswer: 2 },
        { questionId: 2, question: 'Which stage of a ransomware attack involves encrypting victim data and demanding payment?', options: ['Initial access', 'Lateral movement', 'Payload execution', 'Ransom demand stage'], correctAnswer: 3 },
        { questionId: 3, question: 'The primary purpose of spyware is to:', options: ['Display advertisements', 'Improve system performance', 'Secretly collect user information', 'Encrypt files'], correctAnswer: 2 },
        { questionId: 4, question: 'What is the role of a Command and Control (C2) server in a botnet?', options: ['To encrypt victim data', 'To control and communicate with infected devices', 'To detect malware', 'To block network traffic'], correctAnswer: 1 },
        { questionId: 5, question: 'Network traffic analysis is primarily used to:', options: ['Speed up internet connections', 'Detect abnormal or malicious network behavior', 'Replace firewalls', 'Install security patches'], correctAnswer: 1 },
        { questionId: 6, question: 'SIEM systems are mainly used for:', options: ['Software development', 'Centralized log collection and correlation', 'Data encryption', 'Wireless security'], correctAnswer: 1 },
        { questionId: 7, question: 'Digital forensics focuses on:', options: ['Preventing malware', 'Preserving and analyzing evidence after incidents', 'Speeding up systems', 'Writing security policies'], correctAnswer: 1 },
        { questionId: 8, question: 'The primary purpose of a honeypot is to:', options: ['Protect production servers', 'Attract attackers for monitoring and analysis', 'Block network traffic', 'Replace intrusion detection systems'], correctAnswer: 1 },
        { questionId: 9, question: 'Which of the following is a threat intelligence source?', options: ['Antivirus software', 'Open-source threat feeds', 'Programming IDE', 'Operating system'], correctAnswer: 1 },
        { questionId: 10, question: 'The dark web is commonly used for:', options: ['Legal e-commerce', 'Public social networking', 'Trading stolen data and malware', 'Cloud storage'], correctAnswer: 2 }
      ];
      return {
        assignmentId: 'cyber-security-3',
        courseId: 'cyber-security-beginner',
        title: 'Malware, Threat Intelligence & Incident Response',
        description: 'Analyze malware, leverage threat intel and perform incident response.',
        topics,
        questions,
        totalQuestions: questions.length,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-4') {
      const topics: Topic[] = [
        {
          topicId: 'advanced-firewall-architectures',
          title: 'Advanced Firewall Architectures',
          content: 'Advanced firewall architectures go beyond basic packet filtering and are designed to provide layered, intelligent security controls across a network. These firewalls analyze traffic not only based on IP addresses and ports but also on application behavior, user identity, and traffic patterns. Modern firewall architectures often integrate features such as intrusion prevention, malware detection, SSL inspection, and deep packet inspection into a single platform. Organizations deploy firewalls at multiple points, including perimeter firewalls, internal segmentation firewalls, and cloud-based firewalls, to reduce attack surfaces and prevent lateral movement. Properly designed firewall architecture plays a crucial role in enforcing security policies and maintaining strong network defenses.'
        },
        {
          topicId: 'ngfw',
          title: 'Next-Generation Firewalls (NGFW)',
          content: 'Next-Generation Firewalls are advanced security devices that combine traditional firewall functions with modern threat detection capabilities. Unlike legacy firewalls that rely mainly on ports and protocols, NGFWs inspect application-level traffic and identify threats hidden inside encrypted or legitimate-looking data. They include features such as application awareness, user-based policies, intrusion prevention systems (IPS), and real-time threat intelligence integration. NGFWs are highly effective against modern cyberattacks such as malware, command-and-control communication, and zero-day exploits. They are widely used in enterprise environments to provide centralized, intelligent, and adaptive network security.'
        },
        {
          topicId: 'ids',
          title: 'Intrusion Detection Systems (IDS)',
          content: 'An Intrusion Detection System is a security solution designed to monitor network or system activities and identify suspicious behavior or policy violations. IDS works by analyzing network traffic patterns, system logs, or file integrity changes to detect potential intrusions. It does not actively block traffic but instead generates alerts for security teams to investigate. IDS can be signature-based, which detects known attack patterns, or anomaly-based, which identifies unusual behavior. IDS is critical for early threat detection, forensic analysis, and compliance requirements, helping organizations understand attack attempts before they cause serious damage.'
        },
        {
          topicId: 'ips',
          title: 'Intrusion Prevention Systems (IPS)',
          content: 'Intrusion Prevention Systems extend the functionality of IDS by actively blocking detected threats in real time. IPS systems are placed inline with network traffic, allowing them to inspect packets and immediately drop malicious traffic. They protect against known exploits, brute-force attempts, malware propagation, and protocol violations. IPS solutions use signatures, heuristics, and behavioral analysis to detect attacks accurately. By stopping threats before they reach target systems, IPS significantly reduces the risk of network compromise and data breaches.'
        },
        {
          topicId: 'secure-network-architecture',
          title: 'Secure Network Architecture Design',
          content: 'Secure network architecture focuses on designing networks with security as a core principle rather than an afterthought. This involves segmenting networks, minimizing trust zones, enforcing least privilege access, and placing security controls at strategic points. A well-designed architecture reduces the impact of breaches by isolating sensitive systems and limiting lateral movement. Concepts such as zero trust, defense-in-depth, and network zoning are essential elements of secure design. Strong architecture ensures confidentiality, integrity, and availability across enterprise environments.'
        },
        {
          topicId: 'zero-trust',
          title: 'Zero Trust Network Model',
          content: 'The Zero Trust model operates on the principle of “never trust, always verify.” In this approach, no user or device is trusted by default, even if they are inside the organization’s network. Every access request must be authenticated, authorized, and continuously validated. Zero Trust reduces risks from insider threats, compromised credentials, and lateral movement attacks. It relies on strong identity verification, device health checks, network segmentation, and continuous monitoring. This model is increasingly adopted in modern cloud and remote-work environments.'
        },
        {
          topicId: 'nac',
          title: 'Network Access Control (NAC)',
          content: 'Network Access Control is a security mechanism that enforces policies on devices attempting to connect to a network. NAC verifies device identity, compliance status, and user credentials before granting access. Devices that do not meet security requirements, such as updated antivirus or patches, can be restricted or quarantined. NAC is commonly used in enterprise networks to control BYOD (Bring Your Own Device) access and prevent unauthorized devices from compromising the network. It strengthens overall network hygiene and visibility.'
        },
        {
          topicId: 'secure-wireless-design',
          title: 'Secure Wireless Network Design',
          content: 'Secure wireless network design aims to protect Wi-Fi networks from unauthorized access and attacks. This includes using strong encryption protocols such as WPA3, disabling insecure features like WPS, and separating guest networks from internal systems. Wireless security also involves proper access point placement, signal strength management, and continuous monitoring for rogue access points. Since wireless networks are easily accessible, strong design and configuration are critical to preventing data leakage and unauthorized entry.'
        },
        {
          topicId: 'network-traffic-monitoring',
          title: 'Network Traffic Filtering & Monitoring',
          content: 'Network traffic filtering and monitoring involve inspecting data flowing across the network to detect malicious activity and policy violations. Filtering blocks unwanted or suspicious traffic based on rules, while monitoring provides visibility into network behavior. Together, they help identify malware communication, data exfiltration, and abnormal usage patterns. Continuous monitoring enables faster incident response and better threat detection. These techniques are essential for maintaining network integrity and compliance.'
        },
        {
          topicId: 'secure-dns',
          title: 'Secure DNS Architecture',
          content: 'Secure DNS architecture protects the Domain Name System from attacks such as DNS spoofing, cache poisoning, and malicious redirection. DNS security mechanisms include DNSSEC, filtering malicious domains, and monitoring DNS queries for suspicious behavior. Since DNS is a foundational internet service, attacks against it can disrupt services or redirect users to malicious sites. Securing DNS helps prevent phishing, malware infections, and command-and-control communication.'
        },
        {
          topicId: 'load-balancers',
          title: 'Load Balancers & Security Implications',
          content: 'Load balancers distribute traffic across multiple servers to ensure availability and performance. From a security perspective, load balancers can also provide protection against DDoS attacks, hide backend server details, and enforce SSL/TLS encryption. However, misconfigured load balancers can expose sensitive data or become attack targets themselves. Proper security configuration ensures both performance optimization and protection of backend resources.'
        },
        {
          topicId: 'ddos-mitigation',
          title: 'DDoS Mitigation Techniques',
          content: 'Distributed Denial-of-Service (DDoS) mitigation focuses on protecting systems from traffic floods designed to overwhelm resources. Mitigation techniques include rate limiting, traffic filtering, scrubbing services, and content delivery networks (CDNs). Early detection and automated response are essential for minimizing downtime. Effective DDoS mitigation ensures service availability even under large-scale attack conditions.'
        },
        {
          topicId: 'network-hardening',
          title: 'Network Hardening Techniques',
          content: 'Network hardening involves reducing vulnerabilities by securely configuring network devices and services. This includes disabling unused ports, applying patches, enforcing strong authentication, and restricting management access. Hardening minimizes the attack surface and reduces the likelihood of successful exploitation. Regular audits and configuration reviews are essential to maintain a hardened network environment.'
        },
        {
          topicId: 'secure-routing-switching',
          title: 'Secure Routing & Switching',
          content: 'Secure routing and switching ensure that network traffic follows trusted paths without manipulation or interception. Routing security involves protecting protocols like OSPF and BGP from attacks such as route hijacking. Switching security includes features like port security, VLAN isolation, and MAC address filtering. These controls prevent unauthorized devices and traffic manipulation at the network infrastructure level.'
        },
        {
          topicId: 'defense-in-depth',
          title: 'Defense-in-Depth Strategy',
          content: 'Defense-in-depth is a layered security approach that uses multiple security controls to protect systems. Instead of relying on a single defense, organizations deploy firewalls, IDS/IPS, endpoint protection, access controls, and monitoring tools together. If one layer fails, others continue to protect the system. This strategy significantly improves resilience against sophisticated and multi-stage cyberattacks.'
        }
      ];
      return {
        assignmentId: 'cyber-security-4',
        courseId: 'cyber-security-beginner',
        title: 'Advanced Network Security & Defense Mechanisms',
        description: 'Design and defend networks with modern controls and architectures.',
        topics,
        questions: [
          {
            questionId: 1,
            question: "What is the main advantage of advanced firewall architectures over traditional firewalls?",
            options: [
              "They only filter IP addresses",
              "They analyze application-level traffic and user behavior",
              "They remove the need for encryption",
              "They replace endpoint security"
            ],
            correctAnswer: 1
          },
          {
            questionId: 2,
            question: "Which feature is unique to Next-Generation Firewalls?",
            options: [
              "Packet filtering only",
              "Static rule enforcement",
              "Application awareness and intrusion prevention",
              "Physical network isolation"
            ],
            correctAnswer: 2
          },
          {
            questionId: 3,
            question: "What action does an IDS typically perform when it detects suspicious activity?",
            options: [
              "Blocks traffic immediately",
              "Shuts down the network",
              "Generates alerts for investigation",
              "Deletes system logs"
            ],
            correctAnswer: 2
          },
          {
            questionId: 4,
            question: "How does an IPS differ from an IDS?",
            options: [
              "IPS works offline",
              "IPS only logs events",
              "IPS actively blocks malicious traffic",
              "IPS cannot detect attacks"
            ],
            correctAnswer: 2
          },
          {
            questionId: 5,
            question: "Which principle reduces the impact of a security breach by isolating systems?",
            options: [
              "Network broadcasting",
              "Flat network design",
              "Network segmentation",
              "Open access policies"
            ],
            correctAnswer: 2
          },
          {
            questionId: 6,
            question: "The Zero Trust model is based on which core principle?",
            options: [
              "Trust internal users by default",
              "Never trust, always verify",
              "Only protect the perimeter",
              "Disable authentication"
            ],
            correctAnswer: 1
          },
          {
            questionId: 7,
            question: "What is the primary purpose of Network Access Control?",
            options: [
              "Increase network speed",
              "Allow all devices unrestricted access",
              "Enforce security policies before granting network access",
              "Replace firewalls"
            ],
            correctAnswer: 2
          },
          {
            questionId: 8,
            question: "Which wireless security protocol provides the strongest encryption?",
            options: [
              "WEP",
              "WPA",
              "WPA2",
              "WPA3"
            ],
            correctAnswer: 3
          },
          {
            questionId: 9,
            question: "Why is continuous network traffic monitoring important?",
            options: [
              "To reduce bandwidth usage",
              "To detect abnormal and malicious activity",
              "To replace antivirus software",
              "To block all internet access"
            ],
            correctAnswer: 1
          },
          {
            questionId: 10,
            question: "DNSSEC primarily helps prevent which type of attack?",
            options: [
              "SQL injection",
              "Cache poisoning",
              "Phishing emails",
              "Brute-force attacks"
            ],
            correctAnswer: 1
          }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-5') {
      const topics: Topic[] = [
        {
          topicId: 'ethical-hacking-tools-overview',
          title: 'Ethical Hacking Tools Overview',
          content: 'Ethical hacking tools are specialized software applications used by security professionals to identify vulnerabilities in systems, networks, and applications in a legal and authorized manner. These tools help simulate real-world cyberattacks to understand how attackers exploit weaknesses. Ethical hackers use scanning, enumeration, exploitation, and post-exploitation tools to test security controls. Proper use of these tools requires written permission and adherence to ethical guidelines. Learning these tools helps students understand attacker methodologies and strengthen defensive strategies.'
        },
        {
          topicId: 'information-gathering-techniques',
          title: 'Information Gathering Techniques',
          content: 'Information gathering is the first and most critical phase of ethical hacking. It involves collecting data about a target system, such as domain details, IP addresses, employee information, and technology stacks. This phase can be passive, where no direct interaction with the target occurs, or active, where probing and scanning are used. Accurate information gathering helps attackers and defenders map attack surfaces and identify potential entry points. Ethical hackers use this phase to minimize risks and plan targeted assessments.'
        },
        {
          topicId: 'open-source-intelligence-osint',
          title: 'Open Source Intelligence (OSINT)',
          content: 'OSINT refers to the collection of publicly available information from open sources such as websites, social media, search engines, and public records. Attackers often use OSINT to profile organizations and individuals without triggering security alerts. Ethical hackers leverage OSINT to demonstrate how easily sensitive information can be exposed. OSINT plays a crucial role in social engineering attacks, phishing campaigns, and reconnaissance operations. Understanding OSINT helps organizations improve information control and awareness.'
        },
        {
          topicId: 'network-scanning-tools',
          title: 'Network Scanning Tools',
          content: 'Network scanning tools are used to discover live hosts, open ports, and running services on a network. These tools help identify outdated software, misconfigured services, and exposed interfaces. Ethical hackers use scanning to understand the network layout and detect weaknesses before attackers exploit them. Network scanning is essential for vulnerability management and security auditing. Proper scanning helps maintain visibility and security posture across complex networks.'
        },
        {
          topicId: 'vulnerability-exploitation-basics',
          title: 'Vulnerability Exploitation Basics',
          content: 'Vulnerability exploitation involves taking advantage of identified weaknesses to gain unauthorized access or escalate privileges. Ethical hackers use exploitation techniques to validate whether vulnerabilities are real and impactful. This phase demonstrates the potential damage an attacker could cause if the vulnerability remains unpatched. Exploitation must always be controlled, documented, and authorized. Understanding exploitation helps security teams prioritize patching and remediation efforts.'
        },
        {
          topicId: 'metasploit-framework-introduction',
          title: 'Metasploit Framework Introduction',
          content: 'The Metasploit Framework is one of the most widely used tools for penetration testing and exploitation. It provides a structured platform for developing, testing, and executing exploits against vulnerable systems. Metasploit includes payloads, encoders, and auxiliary modules that help simulate real-world attacks. Ethical hackers use Metasploit to validate vulnerabilities and demonstrate risks to organizations. Learning Metasploit improves students’ understanding of attack workflows and defense planning.'
        },
        {
          topicId: 'password-cracking-techniques',
          title: 'Password Cracking Techniques',
          content: 'Password cracking techniques involve attempting to recover passwords using methods such as brute force, dictionary attacks, and rainbow tables. Weak passwords are a major security risk and often lead to system compromise. Ethical hackers use controlled password testing to assess password policies and strength. Understanding these techniques helps organizations enforce strong authentication measures and educate users about password security.'
        },
        {
          topicId: 'social-engineering-tools',
          title: 'Social Engineering Tools',
          content: 'Social engineering tools are used to exploit human psychology rather than technical vulnerabilities. These tools assist in creating phishing emails, fake websites, or malicious payloads to test user awareness. Ethical hackers use social engineering to demonstrate how easily users can be tricked into revealing sensitive information. Studying social engineering tools highlights the importance of user training and security awareness programs.'
        },
        {
          topicId: 'web-application-exploitation-tools',
          title: 'Web Application Exploitation Tools',
          content: 'Web application exploitation tools focus on identifying and exploiting vulnerabilities in web applications, such as SQL injection, cross-site scripting, and authentication flaws. These tools automate testing and provide detailed reports on security weaknesses. Ethical hackers use them to assess application security before deployment. Understanding these tools helps developers and security professionals build more secure web applications.'
        },
        {
          topicId: 'wireless-attacks-tools',
          title: 'Wireless Attacks & Tools',
          content: 'Wireless attack tools are used to test the security of Wi-Fi networks. These tools can identify weak encryption, capture handshakes, and test password strength. Ethical hackers use wireless testing to assess network configurations and encryption protocols. Wireless security testing is essential because wireless networks are easily accessible and commonly targeted by attackers. Strong wireless security protects against unauthorized access and data interception.'
        },
        {
          topicId: 'post-exploitation-techniques',
          title: 'Post-Exploitation Techniques',
          content: 'Post-exploitation refers to actions taken after successful system access. This includes maintaining persistence, collecting data, and assessing further attack paths. Ethical hackers use post-exploitation to understand the full impact of a breach. These techniques help organizations see how attackers move laterally and escalate privileges. Proper analysis supports improved monitoring and access control.'
        },
        {
          topicId: 'privilege-escalation-basics',
          title: 'Privilege Escalation Basics',
          content: 'Privilege escalation occurs when an attacker gains higher-level permissions than initially authorized. This can happen due to misconfigurations, weak permissions, or unpatched vulnerabilities. Ethical hackers test privilege escalation to identify critical system weaknesses. Understanding privilege escalation helps organizations enforce least privilege and secure configurations.'
        },
        {
          topicId: 'osint-social-engineering',
          title: 'OSINT for Social Engineering',
          content: 'OSINT plays a significant role in social engineering by providing attackers with personal and organizational information. This data is used to craft believable phishing emails and impersonation attacks. Ethical hackers use OSINT-driven social engineering to demonstrate real-world risks. Organizations can reduce exposure by limiting public information and training employees to recognize manipulation attempts.'
        },
        {
          topicId: 'exploit-databases-resources',
          title: 'Exploit Databases & Resources',
          content: 'Exploit databases are repositories that store known vulnerabilities and corresponding exploit code. Ethical hackers use these databases to understand existing threats and test system defenses. These resources highlight the importance of timely patching and vulnerability management. Awareness of exploit databases helps organizations stay informed about emerging threats.'
        },
        {
          topicId: 'legal-ethical-considerations',
          title: 'Legal & Ethical Considerations',
          content: 'Legal and ethical considerations are fundamental to ethical hacking. Unauthorized hacking is illegal and punishable by law. Ethical hackers must obtain written permission, define scope, and follow responsible disclosure practices. Understanding legal boundaries ensures that security testing improves defenses without causing harm or violating regulations.'
        }
      ];
      return {
        assignmentId: 'cyber-security-5',
        courseId: 'cyber-security-beginner',
        title: 'Ethical Hacking Tools, OSINT & Exploit Techniques',
        description: 'Use advanced tools, conduct OSINT and learn exploit fundamentals.',
        topics,
        questions: [
          {
            questionId: 1,
            question: "What is the primary purpose of ethical hacking tools?",
            options: [
              "To perform illegal cyberattacks",
              "To test and improve system security legally",
              "To damage network infrastructure",
              "To bypass laws"
            ],
            correctAnswer: 1
          },
          {
            questionId: 2,
            question: "Which phase of ethical hacking focuses on collecting information about a target?",
            options: [
              "Exploitation",
              "Post-exploitation",
              "Reconnaissance",
              "Reporting"
            ],
            correctAnswer: 2
          },
          {
            questionId: 3,
            question: "OSINT is best described as:",
            options: [
              "Information collected using malware",
              "Confidential company data",
              "Publicly available information",
              "Encrypted network traffic"
            ],
            correctAnswer: 2
          },
          {
            questionId: 4,
            question: "Network scanning tools are mainly used to:",
            options: [
              "Encrypt data",
              "Discover hosts, ports, and services",
              "Remove vulnerabilities",
              "Block traffic"
            ],
            correctAnswer: 1
          },
          {
            questionId: 5,
            question: "Why do ethical hackers exploit vulnerabilities?",
            options: [
              "To destroy systems",
              "To validate the existence and impact of vulnerabilities",
              "To steal data",
              "To avoid patching"
            ],
            correctAnswer: 1
          },
          {
            questionId: 6,
            question: "Metasploit is primarily used for:",
            options: [
              "Network monitoring",
              "Exploit development and penetration testing",
              "Firewall configuration",
              "Log management"
            ],
            correctAnswer: 1
          },
          {
            questionId: 7,
            question: "Which attack tries all possible password combinations?",
            options: [
              "Dictionary attack",
              "Brute-force attack",
              "Phishing attack",
              "Replay attack"
            ],
            correctAnswer: 1
          },
          {
            questionId: 8,
            question: "Social engineering primarily targets:",
            options: [
              "Network devices",
              "Software vulnerabilities",
              "Human behavior",
              "Encryption algorithms"
            ],
            correctAnswer: 2
          },
          {
            questionId: 9,
            question: "Which vulnerability allows attackers to execute unauthorized database queries?",
            options: [
              "XSS",
              "CSRF",
              "SQL Injection",
              "Clickjacking"
            ],
            correctAnswer: 2
          },
          {
            questionId: 10,
            question: "Which wireless security protocol is the most secure?",
            options: [
              "WEP",
              "WPA",
              "WPA2",
              "WPA3"
            ],
            correctAnswer: 3
          }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-6') {
      const topics: Topic[] = [
        {
          topicId: 'emerging-cyber-threat-landscape',
          title: 'Emerging Cyber Threat Landscape',
          content: 'The cyber threat landscape is continuously evolving as technology advances and attackers adopt more sophisticated techniques. Modern threats are no longer limited to basic malware but include advanced persistent threats (APTs), ransomware-as-a-service, and AI-driven attacks. Attackers now focus on long-term access, data theft, and disruption rather than immediate damage. Organizations must stay updated with emerging threats to adapt their defense strategies. Understanding the evolving threat landscape helps security professionals anticipate risks and build proactive security measures.'
        },
        {
          topicId: 'ai-in-cyber-security',
          title: 'Artificial Intelligence in Cyber Security',
          content: 'Artificial Intelligence plays a growing role in modern cybersecurity by enabling faster threat detection and automated responses. AI-powered systems analyze large volumes of data to identify patterns, anomalies, and suspicious behavior that traditional tools may miss. Machine learning models improve over time, making security defenses more adaptive. However, attackers also use AI to automate phishing and malware creation. Understanding AI in cybersecurity helps students grasp both defensive and offensive implications of automation.'
        },
        {
          topicId: 'ml-for-threat-detection',
          title: 'Machine Learning for Threat Detection',
          content: 'Machine learning enhances threat detection by identifying unusual behavior rather than relying solely on known signatures. ML models analyze user activity, network traffic, and system logs to detect anomalies that may indicate attacks. This approach is effective against zero-day attacks and insider threats. Proper training and tuning of ML models are essential to reduce false positives. ML-based detection is becoming a core component of modern security operations centers.'
        },
        {
          topicId: 'cloud-computing-security-challenges',
          title: 'Cloud Computing Security Challenges',
          content: 'Cloud computing introduces unique security challenges due to shared responsibility models, remote access, and dynamic infrastructure. Misconfigurations, insecure APIs, and weak identity management are common cloud security risks. Organizations must implement strong access controls, encryption, and continuous monitoring to protect cloud assets. Understanding cloud security challenges helps students secure data and applications hosted in public, private, and hybrid clouds.'
        },
        {
          topicId: 'container-kubernetes-security',
          title: 'Container & Kubernetes Security',
          content: 'Containers and Kubernetes have transformed application deployment but also introduce new security concerns. Container images may contain vulnerabilities, and misconfigured Kubernetes clusters can expose sensitive services. Security measures include image scanning, role-based access control, and network policies. Securing container environments ensures application integrity and availability. As container adoption grows, container security becomes a critical skill.'
        },
        {
          topicId: 'iot-security',
          title: 'Internet of Things (IoT) Security',
          content: 'IoT devices are widely used in smart homes, healthcare, and industrial environments, but often lack strong security controls. Weak authentication, outdated firmware, and lack of encryption make IoT devices attractive targets. Compromised IoT devices are commonly used in botnets and DDoS attacks. Understanding IoT security helps students design safer connected systems and mitigate large-scale risks.'
        },
        {
          topicId: '5g-network-security-concerns',
          title: '5G Network Security Concerns',
          content: '5G technology enables high-speed connectivity and supports billions of connected devices. However, its complex architecture increases the attack surface. Virtualized infrastructure, edge computing, and software-defined networking introduce new vulnerabilities. Strong encryption, network slicing security, and continuous monitoring are essential for 5G security. Knowledge of 5G security is important as next-generation networks expand globally.'
        },
        {
          topicId: 'blockchain-and-cyber-security',
          title: 'Blockchain & Cyber Security',
          content: 'Blockchain technology enhances security by providing decentralized, tamper-resistant data storage. It is widely used in cryptocurrencies, supply chain management, and identity verification. While blockchain improves integrity and transparency, smart contract vulnerabilities and wallet security issues remain concerns. Understanding blockchain security helps students evaluate both benefits and risks of decentralized systems.'
        },
        {
          topicId: 'quantum-computing-cryptography',
          title: 'Quantum Computing & Cryptography',
          content: 'Quantum computing poses a future threat to traditional cryptographic algorithms. Powerful quantum computers could break widely used encryption methods such as RSA and ECC. Post-quantum cryptography focuses on developing algorithms resistant to quantum attacks. Understanding quantum risks prepares organizations for long-term cryptographic transitions. This topic highlights the importance of future-proof security planning.'
        },
        {
          topicId: 'zero-trust-modern-enterprises',
          title: 'Zero Trust in Modern Enterprises',
          content: 'Zero Trust has become a key trend in enterprise security, especially with remote work and cloud adoption. Instead of relying on network boundaries, Zero Trust continuously verifies user identity, device health, and access permissions. This approach reduces risks from insider threats and compromised credentials. Zero Trust is increasingly adopted as a standard security architecture. Understanding this model is essential for modern security professionals.'
        },
        {
          topicId: 'cyber-security-automation',
          title: 'Cyber Security Automation',
          content: 'Security automation reduces manual workload by automating repetitive tasks such as alert handling, log analysis, and incident response. Automation improves response speed and consistency while reducing human error. However, automation must be carefully configured to avoid false actions. Learning automation concepts helps students understand modern SOC operations and efficiency improvements.'
        },
        {
          topicId: 'privacy-engineering-data-protection',
          title: 'Privacy Engineering & Data Protection',
          content: 'Privacy engineering focuses on embedding privacy controls into system design. This includes data minimization, encryption, access controls, and compliance with data protection laws. With increasing privacy regulations, organizations must protect personal data effectively. Understanding privacy engineering helps align security practices with legal and ethical requirements.'
        },
        {
          topicId: 'cyber-laws-global-regulations',
          title: 'Cyber Laws & Global Regulations',
          content: 'Cyber laws and regulations govern how organizations protect data and respond to incidents. Regulations such as GDPR, HIPAA, and national cyber laws enforce strict security requirements. Non-compliance can lead to heavy fines and reputational damage. Understanding global regulations helps security professionals design compliant systems and policies.'
        },
        {
          topicId: 'security-in-devops-devsecops',
          title: 'Security in DevOps (DevSecOps)',
          content: 'DevSecOps integrates security into the software development lifecycle. Instead of treating security as a final step, DevSecOps embeds security testing and controls from the beginning. This approach reduces vulnerabilities and accelerates secure software delivery. Learning DevSecOps helps students understand modern secure development practices.'
        },
        {
          topicId: 'future-career-paths-cyber-security',
          title: 'Future Career Paths in Cyber Security',
          content: 'Cybersecurity offers diverse career paths, including security analyst, penetration tester, SOC analyst, cloud security engineer, and threat intelligence specialist. As cyber threats grow, demand for skilled professionals continues to rise. Understanding career options helps students plan certifications, skills, and learning paths. This topic encourages long-term growth and specialization in cybersecurity.'
        }
      ];
      return {
        assignmentId: 'cyber-security-6',
        courseId: 'cyber-security-beginner',
        title: 'Emerging Technologies & Cybersecurity Trends',
        description: 'Understand modern threats and defenses across evolving technologies.',
        topics,
        questions: [
          {
            questionId: 1,
            question: "Modern cyber threats are increasingly focused on:",
            options: [
              "Random attacks with no planning",
              "Long-term access and data theft",
              "Only website defacement",
              "Physical system damage"
            ],
            correctAnswer: 1
          },
          {
            questionId: 2,
            question: "AI improves cybersecurity primarily by:",
            options: [
              "Replacing human analysts completely",
              "Detecting patterns and anomalies at scale",
              "Encrypting all data automatically",
              "Blocking all network traffic"
            ],
            correctAnswer: 1
          },
          {
            questionId: 3,
            question: "Machine learning is especially effective against:",
            options: [
              "Known signature-based attacks only",
              "Zero-day and unknown threats",
              "Hardware failures",
              "Physical theft"
            ],
            correctAnswer: 1
          },
          {
            questionId: 4,
            question: "Which is a common cloud security issue?",
            options: [
              "Physical cable damage",
              "Misconfigured access controls",
              "Slow internet speed",
              "Outdated hardware"
            ],
            correctAnswer: 1
          },
          {
            questionId: 5,
            question: "A major security risk in container environments is:",
            options: [
              "Static IP addresses",
              "Vulnerable container images",
              "High CPU usage",
              "Large storage capacity"
            ],
            correctAnswer: 1
          },
          {
            questionId: 6,
            question: "Why are IoT devices frequently targeted by attackers?",
            options: [
              "They are too expensive",
              "They lack basic security controls",
              "They use cloud services",
              "They are offline devices"
            ],
            correctAnswer: 1
          },
          {
            questionId: 7,
            question: "Which factor increases the attack surface in 5G networks?",
            options: [
              "Reduced bandwidth",
              "Virtualized and software-defined infrastructure",
              "Slower data transmission",
              "Fewer connected devices"
            ],
            correctAnswer: 1
          },
          {
            questionId: 8,
            question: "What is a key security benefit of blockchain technology?",
            options: [
              "Centralized control",
              "Tamper-resistant data storage",
              "High processing speed",
              "Simple password authentication"
            ],
            correctAnswer: 1
          },
          {
            questionId: 9,
            question: "Why does quantum computing threaten current encryption methods?",
            options: [
              "It increases network traffic",
              "It can break traditional cryptographic algorithms",
              "It reduces storage requirements",
              "It disables firewalls"
            ],
            correctAnswer: 1
          },
          {
            questionId: 10,
            question: "Zero Trust security requires:",
            options: [
              "Trusting internal users",
              "Continuous verification of access",
              "No authentication",
              "Open network access"
            ],
            correctAnswer: 1
          }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-intermediate-1') {
      return {
        assignmentId: 'cyber-security-intermediate-1',
        courseId: 'cyber-security-intermediate',
        title: 'Assignment 1: Network Security & Fundamentals',
        description: 'Deep dive into network protocols and securing infrastructure.',
        topics: [
          {
            topicId: 'osi-tcp-ip-model',
            title: 'Topic 1: OSI & TCP/IP Model Deep Dive',
            content: 'The OSI and TCP/IP models are foundational concepts in networking and cybersecurity. The OSI model divides network communication into 7 logical layers, allowing security professionals to understand where attacks occur and how defenses should be placed. For example, malware operating at the Application layer behaves very differently from attacks at the Network layer like IP spoofing. The TCP/IP model, with its 4 layers, is the practical model used in real networks and the internet. Understanding how data flows through these layers helps in packet analysis, firewall rule creation, IDS/IPS deployment, and troubleshooting network attacks.',
            examples: ['wireshark', 'tcpdump -i eth0', 'tcpdump -r capture.pcap']
          },
          {
            topicId: 'packet-analysis',
            title: 'Topic 2: Packet Analysis & Sniffing Basics',
            content: 'Packet analysis involves capturing and examining network traffic to understand communication patterns and detect suspicious activity. Sniffing can be legitimate (used by network administrators and security analysts) or malicious (used by attackers to steal credentials). Packets contain headers and payloads that reveal IP addresses, ports, protocols, and sometimes sensitive data. Learning packet analysis is essential for detecting MITM attacks, data exfiltration, malware communication, and protocol misuse.',
            examples: ['wireshark', 'tcpdump -i eth0 -w capture.pcap', 'ettercap -T -i eth0']
          },
          {
            topicId: 'network-segmentation',
            title: 'Topic 3: Network Segmentation & Isolation',
            content: 'Network segmentation divides a network into smaller, controlled segments to limit the impact of breaches. Even if an attacker compromises one system, segmentation prevents easy movement across the network. Segmentation is implemented using VLANs, subnets, firewalls, and access control rules. Isolation is especially important in enterprise environments, cloud infrastructures, and data centers to protect sensitive systems like databases and authentication servers.',
            examples: ['ip link add link eth0 name eth0.10 type vlan id 10', 'iptables -A FORWARD -s 192.168.10.0/24 -j DROP']
          },
          {
            topicId: 'firewall-concepts',
            title: 'Topic 4: Firewall Concepts & Types',
            content: 'Firewalls act as the first line of defense in network security. They monitor and control incoming and outgoing traffic based on predefined rules. Different firewall types include packet-filtering firewalls, stateful firewalls, proxy firewalls, and next-generation firewalls (NGFWs). Misconfigured firewalls are one of the most common causes of breaches, making firewall rule understanding critical for security professionals.',
            examples: ['ufw status', 'iptables -L', 'firewall-cmd --list-all']
          },
          {
            topicId: 'ids-ips',
            title: 'Topic 5: Intrusion Detection & Prevention Systems (IDS/IPS)',
            content: 'IDS and IPS systems analyze network traffic to detect malicious activity. An IDS generates alerts when suspicious behavior is detected, while an IPS actively blocks malicious traffic. These systems use signatures, anomaly detection, and behavioral analysis. IDS/IPS are essential for detecting zero-day attacks, brute force attempts, and exploitation attempts in real time.',
            examples: ['snort -A console -i eth0', 'suricata -c /etc/suricata/suricata.yaml -i eth0']
          },
          {
            topicId: 'vpns-secure-tunneling',
            title: 'Topic 6: VPNs & Secure Tunneling',
            content: 'Virtual Private Networks (VPNs) encrypt traffic between endpoints, protecting data from interception and surveillance. VPNs are widely used for secure remote access, protecting traffic on public Wi‑Fi, and connecting branch offices. Common VPN technologies include OpenVPN, IPsec, and SSL/TLS VPNs. Poor VPN configuration can lead to data leaks or unauthorized access.',
            examples: ['openvpn --config client.ovpn', 'ipsec up vpnconnection']
          },
          {
            topicId: 'network-scanning',
            title: 'Topic 7: Network Scanning Techniques',
            content: 'Network scanning is a reconnaissance technique used to identify live hosts, open ports, and running services. Ethical hackers use scanning to map attack surfaces, while attackers use it to find exploitable systems. Different scan types provide different information, such as stealth scans for evasion or aggressive scans for detailed service detection.',
            examples: ['nmap -sP 192.168.1.0/24', 'nmap -sS -p 1-1000 192.168.1.10', 'masscan 192.168.1.0/24 -p0-65535']
          },
          {
            topicId: 'port-service-enumeration',
            title: 'Topic 8: Port & Service Enumeration',
            content: 'Enumeration goes deeper than scanning by identifying exact services, versions, and configurations. This information helps attackers and pentesters match vulnerabilities to services. Banner grabbing can reveal outdated software or misconfigurations, which often lead to exploitation.',
            examples: ['nmap -sV 192.168.1.10', 'nc -v 192.168.1.10 80']
          },
          {
            topicId: 'arp-spoofing',
            title: 'Topic 9: ARP Spoofing & Poisoning',
            content: 'ARP spoofing is a common LAN attack where an attacker sends forged ARP replies to associate their MAC address with a victim’s IP. This enables MITM attacks, traffic interception, and session hijacking. ARP attacks are difficult to detect without proper monitoring and network protections.',
            examples: ['arpspoof -i eth0 -t victim gateway', 'ettercap -T -M arp:remote']
          },
          {
            topicId: 'mac-filtering',
            title: 'Topic 10: MAC Address Filtering & Spoofing',
            content: 'MAC filtering restricts network access to known devices. However, MAC addresses can be easily spoofed, making MAC filtering an insufficient standalone security control. Understanding MAC spoofing highlights the importance of layered security.',
            examples: ['macchanger -r eth0', 'ifconfig eth0 hw ether XX:XX:XX:XX:XX:XX']
          },
          {
            topicId: 'dhcp-dns-attacks',
            title: 'Topic 11: DHCP & DNS Attacks',
            content: 'DHCP and DNS are critical network services and common attack targets. DHCP starvation attacks exhaust IP pools, while DNS spoofing redirects users to malicious sites. Securing these services is essential to prevent traffic redirection and service disruption.',
            examples: ['dhcpstarv -i eth0', 'dnsspoof -i eth0 -f hosts.txt']
          },
          {
            topicId: 'network-protocol-vulns',
            title: 'Topic 12: Network Protocol Vulnerabilities',
            content: 'Legacy and insecure protocols like FTP, Telnet, and SNMPv1 transmit data in plaintext or use weak authentication. Attackers exploit these weaknesses for credential theft and reconnaissance. Secure alternatives must always be used.',
            examples: ['nmap --script vuln 192.168.1.10', 'snmpwalk -v1 -c public 192.168.1.10']
          },
          {
            topicId: 'wireless-security',
            title: 'Topic 13: Wireless Network Security (WEP, WPA, WPA2, WPA3)',
            content: 'Wireless networks introduce additional attack surfaces. WEP is completely broken, WPA2 is vulnerable to weak passwords, and WPA3 provides improved security. Attacks include handshake capture, Evil Twin attacks, and brute-force cracking.',
            examples: ['airmon-ng start wlan0', 'airodump-ng wlan0mon', 'aircrack-ng -w wordlist.txt capture.cap']
          },
          {
            topicId: 'mitm-attacks',
            title: 'Topic 14: Man-in-the-Middle (MITM) Attacks',
            content: 'MITM attacks intercept and manipulate communication between two parties. These attacks are used to steal credentials, inject malware, or modify data. Encryption and certificate validation are primary defenses.',
            examples: ['ettercap -T -M arp:remote', 'mitmproxy -i eth0']
          },
          {
            topicId: 'packet-crafting',
            title: 'Topic 15: Packet Crafting & Injection Tools',
            content: 'Packet crafting allows security professionals to create custom packets to test firewalls, IDS, and network behavior. It is used for research, testing, and simulation of attacks such as SYN floods or malformed packet attacks.',
            examples: ['scapy', 'hping3 -S -p 80 target_ip']
          }
        ],
        questions: [
          { questionId: 1, question: 'Which OSI layer is responsible for encryption and data formatting?', options: ['Application', 'Presentation', 'Session', 'Transport'], correctAnswer: 1 },
          { questionId: 2, question: 'Which tool is commonly used for packet capture and detailed protocol analysis using a GUI?', options: ['Nmap', 'Metasploit', 'Wireshark', 'Netcat'], correctAnswer: 2 },
          { questionId: 3, question: 'What is the primary goal of network segmentation?', options: ['Increase network speed', 'Reduce attack surface and lateral movement', 'Allow unrestricted access', 'Disable firewall rules'], correctAnswer: 1 },
          { questionId: 4, question: 'Which type of firewall tracks the state of active connections?', options: ['Packet filtering firewall', 'Proxy firewall', 'Stateful firewall', 'Physical firewall'], correctAnswer: 2 },
          { questionId: 5, question: 'What is the key difference between IDS and IPS?', options: ['IDS blocks traffic, IPS only logs', 'IDS detects threats, IPS prevents them', 'IDS is hardware-based, IPS is software-based', 'IDS works only on hosts'], correctAnswer: 1 },
          { questionId: 6, question: 'Which scanning technique is considered stealthy and does not complete the TCP handshake?', options: ['TCP Connect Scan', 'UDP Scan', 'SYN Scan', 'Ping Scan'], correctAnswer: 2 },
          { questionId: 7, question: 'What attack involves sending fake ARP replies to intercept network traffic?', options: ['DNS poisoning', 'MAC flooding', 'ARP spoofing', 'DHCP starvation'], correctAnswer: 2 },
          { questionId: 8, question: 'Why is MAC address filtering alone considered weak security?', options: ['MAC addresses cannot be changed', 'MAC filtering slows down networks', 'MAC addresses can be easily spoofed', 'MAC filtering blocks all attackers'], correctAnswer: 2 },
          { questionId: 9, question: 'Which wireless encryption standard is considered the most secure currently?', options: ['WEP', 'WPA', 'WPA2', 'WPA3'], correctAnswer: 3 },
          { questionId: 10, question: 'Which tool is primarily used for crafting and injecting custom network packets?', options: ['Nmap', 'Scapy', 'Nikto', 'Burp Suite'], correctAnswer: 1 }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-intermediate-2') {
      return {
        assignmentId: 'cyber-security-intermediate-2',
        courseId: 'cyber-security-intermediate',
        title: 'Assignment 2: Web & Application Security',
        description: 'Analyzing and securing web applications against common vulnerabilities.',
        topics: [
          {
            topicId: 'xss-types',
            title: 'Topic 1: Cross-Site Scripting (XSS) Types',
            content: 'Cross-Site Scripting (XSS) is a vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. XSS can steal cookies, session tokens, or perform actions on behalf of the user. There are three main types: Stored XSS: Script is permanently stored on the server (database, comment section). Reflected XSS: Script is reflected off a web server via a URL or input parameter. DOM-based XSS: Script execution occurs entirely on the client side via DOM manipulation.',
            examples: ['OWASP ZAP → active scanning for XSS vulnerabilities', 'Burp Suite → intercept requests and test payloads']
          },
          {
            topicId: 'csrf',
            title: 'Topic 2: Cross-Site Request Forgery (CSRF)',
            content: 'CSRF tricks a victim into performing unwanted actions on a web application where they are authenticated. Attackers use crafted links or forms to execute actions without user consent. Prevention includes anti-CSRF tokens, SameSite cookies, and verifying referrer headers.',
            examples: ['Burp Suite → intercept and modify requests', 'OWASP ZAP → CSRF scan']
          },
          {
            topicId: 'idor',
            title: 'Topic 3: Insecure Direct Object References (IDOR)',
            content: 'IDOR occurs when applications expose object references (IDs, filenames) without proper access checks. Attackers can manipulate these references to access unauthorized resources. Fixes include server-side access control checks and indirect references.',
            examples: ['Burp Suite Intruder → automate IDOR testing', 'Postman → send modified requests']
          },
          {
            topicId: 'ssrf',
            title: 'Topic 4: Server-Side Request Forgery (SSRF)',
            content: 'SSRF allows attackers to make server-side requests to internal or external resources. It’s commonly used to access internal cloud metadata or private servers. Prevention includes input validation, network whitelisting, and request filtering.',
            examples: ['Burp Suite → intercept requests and modify endpoints', 'curl → test URL responses from server']
          },
          {
            topicId: 'rfi-lfi',
            title: 'Topic 5: Remote File Inclusion (RFI) & Local File Inclusion (LFI)',
            content: 'RFI/LFI vulnerabilities occur when applications include files based on user input. LFI: attacker includes local files (e.g., /etc/passwd). RFI: attacker includes remote files via URLs.',
            examples: ['Burp Suite → test file inclusion parameters', 'curl → attempt file inclusion with crafted URLs']
          },
          {
            topicId: 'directory-traversal',
            title: 'Topic 6: Directory Traversal Vulnerabilities',
            content: 'Directory traversal (path traversal) allows attackers to access files outside intended directories. For example, ../../../etc/passwd on Linux. Fixes include input validation and restricting filesystem access.',
            examples: ['Burp Suite → intercept and test paths', 'Gobuster → directory brute-forcing']
          },
          {
            topicId: 'cookie-security',
            title: 'Topic 7: Cookie Security & HttpOnly / Secure Flags',
            content: 'Cookies store session data. Improper cookie attributes can allow theft via XSS or network sniffing. HttpOnly → prevents access via JavaScript. Secure → cookie sent only over HTTPS.',
            examples: ['Browser dev tools → inspect cookies', 'Burp Suite → analyze cookie attributes']
          },
          {
            topicId: 'security-headers',
            title: 'Topic 8: Security Headers (CSP, HSTS, X-Frame-Options)',
            content: 'HTTP security headers prevent common attacks: CSP (Content Security Policy) → prevents XSS. HSTS → enforces HTTPS. X-Frame-Options → prevents clickjacking.',
            examples: ['curl -I https://example.com  → check headers', 'OWASP ZAP → header analysis']
          },
          {
            topicId: 'web-app-testing',
            title: 'Topic 9: Web Application Security Testing Workflow',
            content: 'Testing involves multiple steps: Reconnaissance → gather info about domain and endpoints. Scanning → automated scans for vulnerabilities. Exploitation → safely test vulnerabilities. Reporting → document findings.',
            examples: ['OWASP ZAP → automated scans', 'Burp Suite → manual testing']
          },
          {
            topicId: 'api-security',
            title: 'Topic 10: API Security Basics & Threats',
            content: 'APIs are exposed endpoints for applications. Vulnerabilities include: Broken authentication, Excessive data exposure, Rate limiting bypass, Injection attacks.',
            examples: ['Postman → test API endpoints', 'Burp Suite → intercept API requests']
          },
          {
            topicId: 'jwt-attacks',
            title: 'Topic 11: JWT Token Attacks & Misconfigurations',
            content: 'JWT (JSON Web Token) is used for authentication. Weak secrets, algorithm manipulation (none attack), and token leakage are common vulnerabilities. Security requires strong signing keys and proper validation.',
            examples: ['jwt.io debugger → inspect JWTs', 'Burp Suite → modify tokens for testing']
          },
          {
            topicId: 'input-validation',
            title: 'Topic 12: Input Validation & Sanitization',
            content: 'Improper input validation leads to injection attacks, XSS, SQLi, and command injection. Input should always be validated on server-side and sanitized for special characters.',
            examples: ['OWASP ZAP → test injection points', 'Burp Suite → modify input payloads']
          },
          {
            topicId: 'rate-limiting',
            title: 'Topic 13: Rate Limiting & Brute Force Prevention',
            content: 'Web applications without rate limiting are vulnerable to credential guessing. Implement throttling, account lockouts, and CAPTCHAs to prevent automated attacks.',
            examples: ['hydra → brute-force login testing', 'Burp Suite Intruder → controlled password attacks']
          },
          {
            topicId: 'waf',
            title: 'Topic 14: Web Application Firewall (WAF) Functionality',
            content: 'A WAF filters HTTP requests to block attacks like SQLi, XSS, and file inclusion. WAFs can be cloud-based or hardware-based. Security testing should verify WAF rules without bypassing legal limits.',
            examples: ['wafw00f → detect WAF presence', 'OWASP ZAP → test WAF responses']
          },
          {
            topicId: 'error-handling',
            title: 'Topic 15: Error Handling & Information Leakage',
            content: 'Verbose error messages can reveal server versions, database details, or stack traces. Proper error handling involves: Displaying generic error messages to users. Logging detailed errors securely for administrators.',
            examples: ['curl -I https://example.com  → check server headers', 'Burp Suite → intercept error responses']
          }
        ],
        questions: [
          { questionId: 1, question: 'Which type of XSS stores malicious scripts permanently on the server?', options: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS', 'Blind XSS'], correctAnswer: 1 },
          { questionId: 2, question: 'What is the primary defense against CSRF attacks?', options: ['Strong password policy', 'Anti-CSRF tokens', 'SSL/TLS encryption', 'Input sanitization'], correctAnswer: 1 },
          { questionId: 3, question: 'In an IDOR vulnerability, an attacker typically exploits:', options: ['Cross-site scripts', 'Weak authentication', 'Direct object references without access control', 'DNS misconfigurations'], correctAnswer: 2 },
          { questionId: 4, question: 'SSRF attacks allow attackers to:', options: ['Execute scripts in users’ browsers', 'Make server-side requests to internal or external systems', 'Modify DNS records', 'Steal cookies via XSS'], correctAnswer: 1 },
          { questionId: 5, question: 'LFI stands for:', options: ['Local File Inclusion', 'Limited File Injection', 'Linked File Interface', 'Log File Injection'], correctAnswer: 0 },
          { questionId: 6, question: 'Which HTTP header prevents clickjacking attacks?', options: ['Content-Security-Policy', 'X-Frame-Options', 'Strict-Transport-Security', 'Set-Cookie'], correctAnswer: 1 },
          { questionId: 7, question: 'Why is input validation critical in web applications?', options: ['To improve page load speed', 'To prevent injection attacks and XSS', 'To reduce server memory usage', 'To enable caching'], correctAnswer: 1 },
          { questionId: 8, question: 'JWT tokens should be protected primarily by:', options: ['Storing in localStorage without encryption', 'Using strong signing keys and verifying algorithms', 'Passing tokens via GET parameters', 'Sharing tokens across all users'], correctAnswer: 1 },
          { questionId: 9, question: 'A WAF primarily protects against:', options: ['Physical server theft', 'HTTP-based attacks like SQLi, XSS, file inclusion', 'OS-level malware', 'ARP spoofing'], correctAnswer: 1 },
          { questionId: 10, question: 'What is the main risk of verbose error messages in web applications?', options: ['Slower page rendering', 'Server memory leak', 'Leakage of sensitive information about server or database', 'Invalid SSL certificates'], correctAnswer: 2 }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-intermediate-3') {
      return {
        assignmentId: 'cyber-security-intermediate-3',
        courseId: 'cyber-security-intermediate',
        title: 'Assignment 3: Cryptography & Data Security',
        description: 'Implementing encryption and protecting data at rest and in transit.',
        topics: [
          {
            topicId: 'symmetric-encryption',
            title: 'Topic 1: Symmetric Encryption (AES, DES, 3DES)',
            content: 'Symmetric encryption uses the same key for both encryption and decryption. It is fast and ideal for bulk data encryption but requires secure key management. Common algorithms include DES (outdated, 56-bit key), 3DES (triple encryption with DES), and AES (modern standard with 128/192/256-bit keys). Symmetric encryption is widely used in VPNs, disk encryption, and secure communications.',
            examples: ['openssl enc -aes-256-cbc -in plaintext.txt -out encrypted.txt → AES encryption', 'openssl enc -d -aes-256-cbc -in encrypted.txt -out decrypted.txt → AES decryption']
          },
          {
            topicId: 'asymmetric-encryption',
            title: 'Topic 2: Asymmetric Encryption (RSA, ECC)',
            content: 'Asymmetric encryption uses a public/private key pair. The public key encrypts data, and the private key decrypts it. RSA is widely used for secure communication and digital signatures, while ECC (Elliptic Curve Cryptography) provides similar security with smaller key sizes, making it efficient for mobile devices and IoT.',
            examples: ['openssl genrsa -out private.pem 2048 → generate RSA private key', 'openssl rsa -in private.pem -pubout -out public.pem → extract public key']
          },
          {
            topicId: 'hashing',
            title: 'Topic 3: Hashing Algorithms (SHA-2, SHA-3, MD5)',
            content: 'Hashing transforms data into a fixed-length string (digest) for integrity verification. It is one-way and irreversible. MD5 is considered insecure due to collision vulnerabilities, while SHA-2 and SHA-3 are modern secure alternatives. Hashing is commonly used for password storage, file verification, and digital signatures.',
            examples: ['sha256sum file.txt → compute SHA-256 hash', 'openssl dgst -sha3-512 file.txt → compute SHA3-512 hash']
          },
          {
            topicId: 'digital-signatures',
            title: 'Topic 4: Digital Signatures & Certificates',
            content: 'Digital signatures ensure data authenticity and integrity. A sender signs data with a private key, and the recipient verifies it with the sender’s public key. Certificates issued by trusted CAs verify the identity of websites or users, preventing impersonation.',
            examples: ['openssl dgst -sha256 -sign private.pem -out signature.bin file.txt → create signature', 'openssl dgst -sha256 -verify public.pem -signature signature.bin file.txt → verify signature']
          },
          {
            topicId: 'pki',
            title: 'Topic 5: PKI & Certificate Authorities',
            content: 'Public Key Infrastructure (PKI) manages digital certificates and keys. Certificate Authorities (CAs) issue and validate certificates, creating trust chains. PKI is essential for HTTPS, email encryption, and VPNs. Understanding PKI helps in validating SSL certificates and detecting fake or expired certificates.',
            examples: ['openssl x509 -in cert.pem -text -noout → inspect certificate', 'openssl verify -CAfile ca.pem cert.pem → verify certificate chain']
          },
          {
            topicId: 'ssl-tls',
            title: 'Topic 6: SSL/TLS Handshake & Vulnerabilities',
            content: 'SSL/TLS provides secure communication over networks. During the handshake, client and server negotiate algorithms, exchange keys, and verify certificates. Vulnerabilities like POODLE, BEAST, Heartbleed, or weak ciphers can compromise security. Regularly updating SSL/TLS versions and configurations is critical.',
            examples: ['openssl s_client -connect example.com:443 → test SSL handshake', 'nmap --script ssl-enum-ciphers -p 443 example.com → check SSL cipher strength']
          },
          {
            topicId: 'key-management',
            title: 'Topic 7: Secure Key Management Practices',
            content: 'Keys must be stored securely to prevent unauthorized access. Best practices include hardware security modules (HSMs), key rotation, and limiting key access. Poor key management is a major cause of encryption failure, making encrypted data vulnerable.',
            examples: ['openssl rand -hex 32 → generate secure random key', 'gpg --gen-key → generate PGP key pair']
          },
          {
            topicId: 'data-encryption-types',
            title: 'Topic 8: Data at Rest vs Data in Transit Encryption',
            content: 'Data at Rest: encrypted while stored on disks or databases. Data in Transit: encrypted while moving across networks. Encrypting both ensures confidentiality, even if storage is stolen or network is intercepted.',
            examples: ['openssl enc -aes-256-cbc -in file.txt -out file.enc → encrypt file at rest', 'stunnel → encrypt network traffic in transit']
          },
          {
            topicId: 'steganography',
            title: 'Topic 9: Steganography Basics',
            content: 'Steganography hides data within files (images, audio, video) so attackers may not detect it. It is used for covert communication and sometimes malware delivery. Detection involves analyzing file properties, metadata, and unusual patterns.',
            examples: ['steghide embed -cf image.jpg -ef secret.txt → embed file in image', 'steghide extract -sf image.jpg → extract hidden file']
          },
          {
            topicId: 'cryptanalysis',
            title: 'Topic 10: Cryptanalysis Techniques',
            content: 'Cryptanalysis is the study of breaking encryption. Techniques include brute-force, frequency analysis, side-channel attacks, and padding oracle attacks. Understanding attacks helps implement stronger encryption and prevent leaks.',
            examples: ['hashcat -m 0 hash.txt wordlist.txt → brute-force attack', 'john --wordlist=rockyou.txt hash.txt → password cracking']
          },
          {
            topicId: 'password-storage',
            title: 'Topic 11: Password Storage Best Practices',
            content: 'Passwords must be hashed and salted to prevent compromise. Never store plaintext. Use adaptive hashing algorithms like bcrypt, scrypt, or Argon2. Enforcing strong password policies reduces attack success.',
            examples: ['htpasswd -cB users.htpasswd username → create bcrypt hashed password', 'openssl passwd -6 → generate salted SHA-512 password']
          },
          {
            topicId: 'salting',
            title: 'Topic 12: Salting & Hash Iteration',
            content: 'Salting adds a unique value to passwords before hashing, preventing precomputed attacks like rainbow tables. Iterative hashing slows down brute-force attacks, increasing password security.',
            examples: ['openssl passwd -salt XYZ -6 password → hash with salt', 'python3 bcrypt → implement iterative hashing']
          },
          {
            topicId: 'blockchain-security',
            title: 'Topic 13: Blockchain & Distributed Ledger Security',
            content: 'Blockchain provides tamper-evident, decentralized data storage. Transactions are verified and immutable. Security risks include private key theft, 51% attacks, and smart contract bugs. Understanding blockchain helps in cryptocurrency and secure distributed systems.',
            examples: ['geth → Ethereum node interaction', 'bitcoin-cli getblockchaininfo → blockchain status']
          },
          {
            topicId: 'homomorphic-encryption',
            title: 'Topic 14: Homomorphic Encryption Introduction',
            content: 'Homomorphic encryption allows computation on encrypted data without decrypting it. It’s crucial for secure cloud computing and privacy-preserving analytics. Though computationally intensive, it enables encrypted data processing without exposure.',
            examples: ['PySEAL → Python library for homomorphic encryption', 'Microsoft SEAL → encryption operations on encrypted data']
          },
          {
            topicId: 'crypto-attacks',
            title: 'Topic 15: Common Cryptography Attacks (Padding Oracle, MITM, Replay)',
            content: 'Cryptography is not foolproof. Common attacks include: Padding Oracle – exploits block cipher padding. Man-in-the-Middle (MITM) – intercepts encrypted traffic. Replay attacks – resend captured encrypted messages. Mitigations: proper padding validation, SSL/TLS, nonce usage, and authenticated encryption.',
            examples: ['openssl s_client → test encrypted connections', 'mitmproxy → analyze encrypted traffic']
          }
        ],
        questions: [
          { questionId: 1, question: 'Which type of encryption uses the same key for both encryption and decryption?', options: ['Asymmetric Encryption', 'Symmetric Encryption', 'Hashing', 'Digital Signature'], correctAnswer: 1 },
          { questionId: 2, question: 'RSA encryption relies on which mathematical principle?', options: ['Prime factorization', 'Discrete logarithms', 'Symmetric key exchange', 'Modular addition'], correctAnswer: 0 },
          { questionId: 3, question: 'Which hashing algorithm is considered insecure due to collisions?', options: ['SHA-256', 'SHA-3', 'MD5', 'SHA-512'], correctAnswer: 2 },
          { questionId: 4, question: 'What is the main purpose of a digital signature?', options: ['Encrypt data for storage', 'Ensure data authenticity and integrity', 'Hide data in images', 'Replace passwords'], correctAnswer: 1 },
          { questionId: 5, question: 'SSL/TLS provides protection for:', options: ['Stored files on disk', 'Data in transit over networks', 'Hashing passwords', 'Steganography'], correctAnswer: 1 },
          { questionId: 6, question: 'What is the main benefit of salting a password before hashing?', options: ['Speeds up password verification', 'Prevents rainbow table attacks', 'Makes passwords shorter', 'Allows plaintext storage'], correctAnswer: 1 },
          { questionId: 7, question: 'Which asymmetric encryption algorithm is efficient for mobile devices due to smaller key size?', options: ['DES', '3DES', 'ECC (Elliptic Curve Cryptography)', 'AES'], correctAnswer: 2 },
          { questionId: 8, question: 'What type of attack exploits flaws in block cipher padding?', options: ['MITM Attack', 'Replay Attack', 'Padding Oracle Attack', 'Phishing'], correctAnswer: 2 },
          { questionId: 9, question: 'Homomorphic encryption allows:', options: ['Data to be decrypted automatically', 'Computation on encrypted data without decryption', 'Storing passwords in plaintext', 'Stealing keys from SSL/TLS'], correctAnswer: 1 },
          { questionId: 10, question: 'Which cryptography practice ensures that even if two users have the same password, their stored hash differs?', options: ['Asymmetric encryption', 'Salting', 'Hash iteration', 'SSL/TLS'], correctAnswer: 1 }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-intermediate-4') {
      return {
        assignmentId: 'cyber-security-intermediate-4',
        courseId: 'cyber-security-intermediate',
        title: 'Assignment 4: Malware & Threat Analysis',
        description: 'Deep dive into malware types, analysis techniques, and threat mitigation strategies.',
        topics: [
          {
            topicId: 'malware-types',
            title: 'Topic 1: Introduction to Malware Types',
            content: 'Malware is software designed to damage, disrupt, or gain unauthorized access to systems. Common types include viruses, worms, trojans, ransomware, adware, and spyware. Understanding malware types helps in identifying, containing, and mitigating threats. Each type has unique behavior; for example, worms self-replicate, while trojans hide within legitimate applications.',
            examples: ['ClamAV → clamscan -r /home/user', 'chkrootkit → chkrootkit']
          },
          {
            topicId: 'virus-lifecycle',
            title: 'Topic 2: Virus Lifecycle & Propagation',
            content: 'A virus attaches to host files or programs and spreads when those files are executed. The lifecycle includes infection, replication, payload execution, and concealment. Security measures include antivirus scanning, sandboxing, and monitoring unusual file changes.',
            examples: ['sigcheck → check file signatures', 'rkhunter → detect rootkits']
          },
          {
            topicId: 'worms-propagation',
            title: 'Topic 3: Worms & Self-Replication Mechanisms',
            content: 'Worms spread independently across networks without needing a host file. They exploit vulnerabilities in network services and can cause rapid outbreaks. Understanding propagation methods is key to implementing network segmentation and patch management.',
            examples: ['nmap → check vulnerable services', 'snort → monitor for worm-like behavior']
          },
          {
            topicId: 'trojans-backdoors',
            title: 'Topic 4: Trojan Horses & Backdoors',
            content: 'Trojans disguise as legitimate software but provide attackers with unauthorized access (backdoors). They often bypass antivirus detection by hiding functionality or using social engineering for installation. Defense includes monitoring system behavior and application whitelisting.',
            examples: ['YARA → create rules to detect trojans', 'Process Explorer → inspect suspicious processes']
          },
          {
            topicId: 'ransomware-analysis',
            title: 'Topic 5: Ransomware Analysis & Prevention',
            content: 'Ransomware encrypts user files and demands payment. Prevention includes regular backups, endpoint protection, and user awareness. Analysis involves detecting encryption patterns, monitoring file system changes, and using sandbox environments to study behavior.',
            examples: ['Cuckoo Sandbox → analyze ransomware behavior', 'CryptoPrevent → ransomware prevention']
          },
          {
            topicId: 'spyware-adware',
            title: 'Topic 6: Spyware & Adware Characteristics',
            content: 'Spyware secretly monitors user activity, while adware delivers unwanted advertisements. They can steal sensitive information or degrade system performance. Detecting spyware often requires behavioral analysis and network monitoring.',
            examples: ['Wireshark → detect unusual outbound connections', 'Malwarebytes → scan for spyware/adware']
          },
          {
            topicId: 'rootkits-stealth',
            title: 'Topic 7: Rootkits & Stealth Techniques',
            content: 'Rootkits hide malware presence by modifying system files, drivers, or kernels. They are difficult to detect because they operate at a low level. Tools for rootkit detection and integrity checks are crucial for system security.',
            examples: ['rkhunter → scan for rootkits', 'chkrootkit → detect stealth malware']
          },
          {
            topicId: 'fileless-malware',
            title: 'Topic 8: Fileless Malware & Memory-Based Attacks',
            content: 'Fileless malware resides in memory and does not leave traditional files, making it hard to detect with signature-based antivirus tools. It exploits legitimate processes like PowerShell or WMI. Detection requires monitoring behavior and memory analysis.',
            examples: ['Sysmon → monitor system events', 'PowerShell logging → detect suspicious scripts']
          },
          {
            topicId: 'malware-sandboxing',
            title: 'Topic 9: Malware Sandboxing & Analysis Tools',
            content: 'Sandboxing isolates malware to safely study its behavior without risking the host system. Analysts monitor network activity, file creation, registry changes, and process execution to understand malware operations.',
            examples: ['Cuckoo Sandbox → automated malware analysis', 'Any.Run → interactive online sandbox']
          },
          {
            topicId: 'ioc',
            title: 'Topic 10: Indicators of Compromise (IoC)',
            content: 'IoCs are forensic artifacts indicating malware infection. Examples include unusual file modifications, unknown processes, network connections to malicious IPs, or registry changes. Detecting IoCs helps respond quickly to attacks.',
            examples: ['OSSEC → monitor for IoCs', 'Splunk → correlate logs for compromise indicators']
          },
          {
            topicId: 'reverse-engineering',
            title: 'Topic 11: Malware Reverse Engineering Basics',
            content: 'Reverse engineering involves analyzing malware code to understand its behavior, entry points, and payloads. Analysts use disassemblers and debuggers to study binaries safely. It helps develop detection signatures and mitigation strategies.',
            examples: ['Ghidra → disassemble and analyze binaries', 'IDA Pro → static malware analysis']
          },
          {
            topicId: 'behavior-detection',
            title: 'Topic 12: Behavior-Based Malware Detection',
            content: 'Behavior-based detection monitors program actions rather than relying on known signatures. Suspicious activities like mass file encryption, registry changes, or abnormal network connections trigger alerts.',
            examples: ['Cuckoo Sandbox → dynamic behavior analysis', 'Sysmon → log system behavior for analysis']
          },
          {
            topicId: 'apt-overview',
            title: 'Topic 13: Advanced Persistent Threats (APT) Overview',
            content: 'APTs are stealthy, prolonged attacks often orchestrated by highly skilled actors. They focus on intelligence gathering or strategic sabotage. Detection involves anomaly monitoring, threat intelligence, and endpoint activity analysis.',
            examples: ['MITRE ATT&CK Framework → study TTPs (Tactics, Techniques, Procedures)', 'Splunk → log correlation for APT detection']
          },
          {
            topicId: 'social-engineering-propagation',
            title: 'Topic 14: Malware Propagation via Social Engineering',
            content: 'Attackers distribute malware through phishing emails, malicious links, or infected attachments. User awareness, email filtering, and sandbox testing of attachments reduce risks.',
            examples: ['PhishTool → test phishing simulations', 'Gophish → phishing campaign simulation']
          },
          {
            topicId: 'threat-intelligence',
            title: 'Topic 15: Threat Intelligence & Reporting',
            content: 'Threat intelligence involves collecting, analyzing, and sharing information about cyber threats. It helps organizations anticipate attacks, prioritize defenses, and improve incident response. Reports document indicators, TTPs, and mitigation recommendations.',
            examples: ['MISP → threat intelligence platform', 'OpenCTI → collect and analyze threat data']
          }
        ],
        questions: [
          { questionId: 1, question: 'Which type of malware replicates itself and spreads across networks without user interaction?', options: ['Virus', 'Trojan', 'Worm', 'Ransomware'], correctAnswer: 2 },
          { questionId: 2, question: 'What is the main purpose of a trojan horse?', options: ['Encrypt files for ransom', 'Hide malicious functionality within legitimate software', 'Self-replicate across networks', 'Monitor keyboard input only'], correctAnswer: 1 },
          { questionId: 3, question: 'Fileless malware is difficult to detect because it:', options: ['Uses encryption', 'Resides only in memory and does not leave files', 'Deletes antivirus software', 'Creates hidden files on disk'], correctAnswer: 1 },
          { questionId: 4, question: 'Which tool is commonly used for automated malware analysis in a safe environment?', options: ['Wireshark', 'Cuckoo Sandbox', 'Nmap', 'Metasploit'], correctAnswer: 1 },
          { questionId: 5, question: 'Indicators of Compromise (IoC) can include:', options: ['Unexpected registry changes', 'Unknown network connections', 'Suspicious file modifications', 'All of the above'], correctAnswer: 3 },
          { questionId: 6, question: 'Rootkits are particularly dangerous because they:', options: ['Encrypt files on the system', 'Hide malware presence and tamper with system files', 'Spread automatically through email', 'Only affect network routers'], correctAnswer: 1 },
          { questionId: 7, question: 'Advanced Persistent Threats (APT) are characterized by:', options: ['Fast, widespread attacks', 'Stealthy, long-term targeted attacks', 'Random virus infections', 'Simple adware campaigns'], correctAnswer: 1 },
          { questionId: 8, question: 'Social engineering is often used to:', options: ['Exploit system vulnerabilities automatically', 'Trick users into installing malware or revealing credentials', 'Detect rootkits', 'Encrypt sensitive files'], correctAnswer: 1 },
          { questionId: 9, question: 'Behavior-based malware detection focuses on:', options: ['Matching known malware signatures', 'Monitoring actions of programs to detect anomalies', 'Deleting suspicious files immediately', 'Isolating malware manually'], correctAnswer: 1 },
          { questionId: 10, question: 'Threat intelligence primarily helps organizations to:', options: ['Replace antivirus software', 'Anticipate attacks, prioritize defenses, and respond effectively', 'Encrypt data at rest', 'Create malware samples for testing'], correctAnswer: 1 }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-intermediate-5') {
      return {
        assignmentId: 'cyber-security-intermediate-5',
        courseId: 'cyber-security-intermediate',
        title: 'Assignment 5: Cyber Attack & Defense Techniques',
        description: 'Mastering attack methodologies and implementing robust defense strategies.',
        topics: [
          {
            topicId: 'cyber-attacks-intro',
            title: 'Topic 1: Introduction to Cyber Attacks',
            content: 'Cyber attacks are deliberate attempts to compromise systems, networks, or data. They can be targeted or opportunistic. Understanding attack motives, methods, and targets is essential for designing effective defenses. Attacks include ransomware, phishing, SQL injection, and DoS attacks.',
            examples: ['Nmap → network reconnaissance', 'Metasploit → exploit testing']
          },
          {
            topicId: 'reconnaissance',
            title: 'Topic 2: Reconnaissance & Footprinting Techniques',
            content: 'Reconnaissance is the first step of an attack, gathering information about the target. Footprinting includes domain info, IP ranges, DNS records, and employee data. Defense involves monitoring unusual access, limiting exposed information, and using honeypots.',
            examples: ['whois example.com → domain info', 'theHarvester -d example.com -l 100 -b all → collect emails, subdomains']
          },
          {
            topicId: 'scanning-enumeration',
            title: 'Topic 3: Scanning & Enumeration',
            content: 'Scanning identifies open ports, services, and vulnerabilities. Enumeration extracts system information like user accounts and network shares. Preventive measures include firewall hardening, patch management, and network segmentation.',
            examples: ['nmap -sS -p- target.com → stealth port scan', 'enum4linux -a target_ip → enumerate SMB info']
          },
          {
            topicId: 'dos-ddos',
            title: 'Topic 4: Denial of Service (DoS & DDoS) Attacks',
            content: 'DoS attacks overwhelm a system or network, making it unavailable to users. DDoS attacks amplify this by using multiple machines. Mitigation includes rate limiting, traffic filtering, and cloud-based DDoS protection.',
            examples: ['hping3 --flood --rand-source target_ip → simulate traffic (testing only in lab)', 'LOIC → network stress testing in controlled environment']
          },
          {
            topicId: 'mitm-attacks',
            title: 'Topic 5: Man-in-the-Middle (MITM) Attacks',
            content: 'MITM attacks intercept communication between two parties. Attackers can eavesdrop, modify, or inject data. Defense includes HTTPS, VPNs, certificate pinning, and detecting ARP spoofing.',
            examples: ['Ettercap → MITM attacks and sniffing', 'arpspoof -i eth0 -t target_ip gateway_ip → ARP spoofing']
          },
          {
            topicId: 'phishing-social-engineering',
            title: 'Topic 6: Phishing & Social Engineering Attacks',
            content: 'Phishing deceives users into revealing sensitive info. Techniques include fake emails, links, and attachments. Social engineering exploits human psychology rather than technical vulnerabilities. Defense includes training, email filters, and multi-factor authentication.',
            examples: ['Gophish → simulate phishing campaigns', 'SET (Social Engineering Toolkit) → craft social engineering attacks']
          },
          {
            topicId: 'password-attacks',
            title: 'Topic 7: Password Attacks (Brute Force, Dictionary, Rainbow Tables)',
            content: 'Password attacks attempt to guess or crack credentials. Brute-force tests all combinations, dictionary attacks use common passwords, and rainbow tables exploit precomputed hashes. Defense involves strong passwords, salting, hashing, and account lockouts.',
            examples: ['hydra -l admin -P passwords.txt target.com ssh → brute-force', 'john --wordlist=rockyou.txt hash.txt → password cracking']
          },
          {
            topicId: 'sqli-db-attacks',
            title: 'Topic 8: SQL Injection & Database Attacks',
            content: 'SQL injection exploits improperly sanitized inputs to access or modify databases. Attackers can bypass authentication, dump data, or escalate privileges. Defense includes parameterized queries, input validation, and WAFs.',
            examples: ['sqlmap -u "http://target.com/page?id=1" --dump → automate SQLi', 'Burp Suite → manually test injection points']
          },
          {
            topicId: 'xss-csrf',
            title: 'Topic 9: Cross-Site Scripting (XSS) & CSRF',
            content: 'XSS injects malicious scripts into web pages, while CSRF tricks users into performing unwanted actions. Both exploit trust: XSS affects users, CSRF affects the server. Defense includes input sanitization, CSRF tokens, and secure cookies.',
            examples: ['OWASP ZAP → scan for XSS/CSRF', 'Burp Suite → test scripts and tokens']
          },
          {
            topicId: 'malware-attacks',
            title: 'Topic 10: Malware-Based Attacks (Ransomware, Trojans, Worms)',
            content: 'Malware attacks deploy malicious code to steal data, encrypt files, or disrupt operations. Ransomware encrypts files, trojans provide backdoors, and worms self-replicate. Defense includes endpoint protection, backups, and sandboxing.',
            examples: ['ClamAV → malware scanning', 'Cuckoo Sandbox → analyze malware behavior']
          },
          {
            topicId: 'network-sniffing',
            title: 'Topic 11: Network Sniffing & Packet Analysis',
            content: 'Network sniffing captures network traffic for analysis. Attackers can intercept sensitive data if unencrypted. Defense includes encryption, VLAN segmentation, and monitoring for unusual traffic.',
            examples: ['Wireshark → packet capture and analysis', 'tcpdump -i eth0 → command-line packet capture']
          },
          {
            topicId: 'wireless-attacks',
            title: 'Topic 12: Wireless Network Attacks (WEP/WPA Cracking, Evil Twin)',
            content: 'Wireless attacks target Wi-Fi networks. Weak encryption like WEP is easily cracked; attackers may create rogue access points (evil twin) to steal credentials. Defense includes WPA3, strong passphrases, and monitoring for rogue APs.',
            examples: ['aircrack-ng → crack WEP/WPA', 'fluxion → evil twin attack (lab/testing only)']
          },
          {
            topicId: 'zero-day',
            title: 'Topic 13: Zero-Day Exploits & Vulnerability Analysis',
            content: 'Zero-day exploits target unknown vulnerabilities. Detection requires intrusion detection, patch management, and threat intelligence. Security teams use fuzzing, static, and dynamic analysis to find vulnerabilities proactively.',
            examples: ['OpenVAS → vulnerability scanning', 'Metasploit → test exploits in lab']
          },
          {
            topicId: 'ids-ips',
            title: 'Topic 14: Intrusion Detection & Prevention Systems (IDS/IPS)',
            content: 'IDS monitors traffic for suspicious activity, while IPS can block detected attacks in real-time. Proper configuration and log analysis help detect attacks early. Examples include Snort, Suricata, and OSSEC.',
            examples: ['snort -c /etc/snort/snort.conf -i eth0 → IDS monitoring', 'suricata -c /etc/suricata/suricata.yaml -i eth0 → IPS']
          },
          {
            topicId: 'defense-strategies',
            title: 'Topic 15: Cyber Defense Strategies & Incident Response',
            content: 'Cyber defense combines preventive, detective, and corrective measures. Incident response plans include preparation, identification, containment, eradication, recovery, and lessons learned. A strong strategy minimizes impact and prevents recurrence.',
            examples: ['Splunk → log correlation and alerting', 'OSSEC → host-based monitoring and response']
          }
        ],
        questions: [
          { questionId: 1, question: 'Which phase of a cyber attack involves gathering information about the target?', options: ['Exploitation', 'Reconnaissance', 'Post-exploitation', 'Denial-of-Service'], correctAnswer: 1 },
          { questionId: 2, question: 'Which attack overwhelms a system or network, making it unavailable to users?', options: ['SQL Injection', 'Cross-Site Scripting', 'Denial-of-Service (DoS)', 'Phishing'], correctAnswer: 2 },
          { questionId: 3, question: 'Man-in-the-Middle (MITM) attacks allow attackers to:', options: ['Encrypt data', 'Intercept and modify communication between two parties', 'Spread ransomware', 'Bypass firewalls automatically'], correctAnswer: 1 },
          { questionId: 4, question: 'Social engineering attacks primarily target:', options: ['Software vulnerabilities', 'Human psychology and behavior', 'Weak network protocols', 'Encrypted databases'], correctAnswer: 1 },
          { questionId: 5, question: 'Which tool is commonly used to simulate phishing campaigns?', options: ['Wireshark', 'Gophish', 'Nmap', 'Burp Suite'], correctAnswer: 1 },
          { questionId: 6, question: 'Password attacks using precomputed tables are known as:', options: ['Brute-force attacks', 'Dictionary attacks', 'Rainbow table attacks', 'Phishing attacks'], correctAnswer: 2 },
          { questionId: 7, question: 'Wireless network attacks like Evil Twin primarily involve:', options: ['Cracking passwords only', 'Creating rogue access points to intercept traffic', 'SQL injection in Wi-Fi routers', 'DDoS attacks on wireless networks'], correctAnswer: 1 },
          { questionId: 8, question: 'Zero-day exploits target:', options: ['Known vulnerabilities with patches available', 'Unknown vulnerabilities without patches', 'Outdated antivirus software', 'Encrypted communications only'], correctAnswer: 1 },
          { questionId: 9, question: 'Intrusion Prevention Systems (IPS) differ from IDS in that IPS:', options: ['Only monitors traffic', 'Can block malicious traffic in real-time', 'Is slower than IDS', 'Cannot detect malware'], correctAnswer: 1 },
          { questionId: 10, question: 'Incident response includes all except:', options: ['Preparation', 'Identification', 'Eradication', 'Ignoring alerts'], correctAnswer: 3 }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    } else if (id === 'cyber-security-intermediate-6') {
      return {
        assignmentId: 'cyber-security-intermediate-6',
        courseId: 'cyber-security-intermediate',
        title: 'Assignment 6: Security Tools, Scripting & Automation',
        description: 'Mastering security automation, scripting, and tools for efficient defense.',
        topics: [
          {
            topicId: 'security-automation-intro',
            title: 'Topic 1: Introduction to Security Automation',
            content: 'Security automation uses scripts and tools to perform repetitive tasks like scanning, monitoring, and reporting. It improves efficiency, reduces human error, and allows real-time responses to threats. Automation is widely used in vulnerability scanning, patch management, and log analysis.',
            examples: ['cron → schedule scripts', 'Ansible → automate security configurations']
          },
          {
            topicId: 'python-basics',
            title: 'Topic 2: Python Basics for Cybersecurity',
            content: 'Python is widely used for writing scripts for penetration testing, malware analysis, and automation. It is beginner-friendly and has libraries for networking (socket), web scraping (requests), and cryptography (cryptography).',
            examples: ['import socket; s = socket.socket(); s.connect(("example.com", 80)); print("Connected")']
          },
          {
            topicId: 'bash-scripting',
            title: 'Topic 3: Bash Scripting for Security Tasks',
            content: 'Bash scripts automate Linux commands for scanning, monitoring, and reporting. Tasks include automated port scans, log parsing, and backups.',
            examples: ['#!/bin/bash', 'nmap -p 1-1000 192.168.1.1 > scan_results.txt', 'echo "Scan complete!"']
          },
          {
            topicId: 'openvas-scanning',
            title: 'Topic 4: Vulnerability Scanning with OpenVAS',
            content: 'OpenVAS is a comprehensive vulnerability scanner for network devices and servers. It detects misconfigurations, outdated software, and known vulnerabilities.',
            examples: ['openvas-setup → install OpenVAS', 'openvas-start → start scanner', 'Use web UI to configure scans']
          },
          {
            topicId: 'metasploit-automation',
            title: 'Topic 5: Using Metasploit for Exploit Automation',
            content: 'Metasploit is a popular penetration testing framework. It automates exploit execution, payload delivery, and reporting.',
            examples: ['msfconsole', 'use exploit/windows/smb/ms17_010_eternalblue', 'set RHOSTS 192.168.1.10', 'exploit']
          },
          {
            topicId: 'password-cracking',
            title: 'Topic 6: Automated Password Cracking Tools',
            content: 'Tools like Hydra and John the Ripper automate password attacks to test strength. They support brute-force, dictionary, and hybrid attacks.',
            examples: ['hydra -l admin -P passwords.txt ssh://192.168.1.10', 'john --wordlist=rockyou.txt hash.txt']
          },
          {
            topicId: 'network-monitoring',
            title: 'Topic 7: Network Monitoring Automation',
            content: 'Automated monitoring detects anomalies and potential attacks. Scripts can analyze logs, alert admins, or block suspicious IPs.',
            examples: ['tcpdump -i eth0 -w capture.pcap → automated packet capture', 'snort -c /etc/snort/snort.conf -i eth0 → automated IDS']
          },
          {
            topicId: 'patching-automation',
            title: 'Topic 8: Automating Security Updates & Patching',
            content: 'Automation ensures systems are up-to-date with security patches, reducing vulnerabilities. Tools like Ansible, Puppet, and cron scripts are commonly used.',
            examples: ['sudo apt update && sudo apt upgrade -y', 'ansible-playbook patch_servers.yml']
          },
          {
            topicId: 'siem-automation',
            title: 'Topic 9: Log Analysis & SIEM Automation',
            content: 'Security Information and Event Management (SIEM) tools automate log collection, correlation, and alerting. They help detect threats in real time.',
            examples: ['Splunk → collect and analyze logs', 'OSSEC → host-based log monitoring']
          },
          {
            topicId: 'web-app-automation',
            title: 'Topic 10: Web Application Security Automation',
            content: 'Automation tests web apps for vulnerabilities like SQLi, XSS, and CSRF. Tools reduce manual effort and ensure coverage.',
            examples: ['OWASP ZAP → automated web scanning', 'Nikto -h http://example.com → scan web server']
          },
          {
            topicId: 'malware-analysis-automation',
            title: 'Topic 11: Malware Analysis Automation',
            content: 'Automating malware analysis speeds up detection and understanding of threats. Sandboxes can run multiple samples simultaneously and generate detailed reports.',
            examples: ['Cuckoo Sandbox → automated dynamic analysis', 'Any.Run → online interactive sandbox']
          },
          {
            topicId: 'phishing-simulation',
            title: 'Topic 12: Automated Phishing & Social Engineering Testing',
            content: 'Automation allows safe testing of phishing awareness and social engineering defenses. Campaigns can simulate attacks for training purposes.',
            examples: ['Gophish → phishing simulation', 'SET → social engineering automation']
          },
          {
            topicId: 'github-automation',
            title: 'Topic 13: Using GitHub for Security Script Automation',
            content: 'Many security scripts and exploits are available on GitHub. Automating deployment and execution saves time and ensures repeatable tests.',
            examples: ['git clone https://github.com/username/repo.git', 'cd repo', 'bash script.sh']
          },
          {
            topicId: 'continuous-monitoring',
            title: 'Topic 14: Continuous Security Monitoring',
            content: 'Continuous monitoring automates threat detection, compliance checks, and incident alerts. It ensures organizations remain proactive rather than reactive.',
            examples: ['Nagios → monitor system health', 'Prometheus → metrics collection and alerting']
          },
          {
            topicId: 'automation-best-practices',
            title: 'Topic 15: Summary & Best Practices in Automation',
            content: 'Automation is powerful but requires secure configuration. Scripts should be tested in controlled environments, access should be restricted, and logs must be monitored. Combining automation with human analysis ensures effective security posture.',
            examples: ['Test scripts in lab environments', 'Use version control (Git) for scripts', 'Implement proper logging and alerting']
          }
        ],
        questions: [
          { questionId: 1, question: 'Security automation is primarily used to:', options: ['Replace human analysts entirely', 'Perform repetitive security tasks efficiently and reduce errors', 'Install antivirus software automatically only', 'Encrypt all network traffic'], correctAnswer: 1 },
          { questionId: 2, question: 'Which scripting language is widely used for cybersecurity automation and exploit development?', options: ['Java', 'Python', 'C++', 'HTML'], correctAnswer: 1 },
          { questionId: 3, question: 'Bash scripts are commonly used in cybersecurity to:', options: ['Develop GUI applications', 'Automate Linux commands for scanning, monitoring, and reporting', 'Create malware only', 'Encrypt files without keys'], correctAnswer: 1 },
          { questionId: 4, question: 'OpenVAS is used for:', options: ['Password cracking', 'Network vulnerability scanning and assessment', 'Web scraping', 'Malware analysis'], correctAnswer: 1 },
          { questionId: 5, question: 'Metasploit Framework allows:', options: ['Only antivirus updates', 'Automated exploitation, payload delivery, and reporting', 'Packet capture analysis', 'Phishing simulations'], correctAnswer: 1 },
          { questionId: 6, question: 'Hydra and John the Ripper are used for:', options: ['Network monitoring', 'Password attacks and cracking', 'Log analysis', 'Malware sandboxing'], correctAnswer: 1 },
          { questionId: 7, question: 'Which tool automates network traffic capture for monitoring anomalies?', options: ['Wireshark', 'Snort', 'tcpdump', 'All of the above'], correctAnswer: 3 },
          { questionId: 8, question: 'Automation of patch management helps to:', options: ['Reduce vulnerabilities by applying updates regularly', 'Delete old files automatically', 'Encrypt user data', 'Monitor social engineering attacks'], correctAnswer: 0 },
          { questionId: 9, question: 'Phishing awareness campaigns can be automated using:', options: ['Nikto', 'Gophish', 'Burp Suite', 'OpenVAS'], correctAnswer: 1 },
          { questionId: 10, question: 'Best practices for security automation include:', options: ['Testing scripts in controlled environments', 'Restricting access to scripts', 'Logging and monitoring script execution', 'All of the above'], correctAnswer: 3 }
        ],
        totalQuestions: 10,
        passingPercentage: 70
      };
    }
    return null;
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        const userData = JSON.parse(currentUser);
        
        const response = await fetch(`${BASE_URL}/api/assignments/${effectiveAssignmentId}`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          const local = localAssignmentFallback(effectiveAssignmentId);
          if (local) {
            setAssignment(local);
            const first = local.topics[0];
            const tid = first.topicId || first.id || first.title;
            setSelectedTopic(tid);
            setLoading(false);
            return;
          }
          throw new Error(result.message || 'Failed to fetch assignment');
        }
        
        if (result.success) {
          setAssignment(result.data);
          if (result.data.topics && result.data.topics.length > 0) {
            const first = result.data.topics[0];
            const tid = first.topicId || first.id || first.title;
            setSelectedTopic(tid);
          }
        } else {
          const local = localAssignmentFallback(effectiveAssignmentId);
          if (local) {
            setAssignment(local);
            const first = local.topics[0];
            const tid = first.topicId || first.id || first.title;
            setSelectedTopic(tid);
          } else {
            throw new Error(result.message || 'Assignment not found');
          }
        }
      } catch (err: any) {
        const local = localAssignmentFallback(effectiveAssignmentId);
        if (local) {
          setAssignment(local);
          const first = local.topics[0];
          const tid = first.topicId || first.id || first.title;
          setSelectedTopic(tid);
          setError(null);
        } else {
          setError(err.message || 'Failed to load assignment');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (effectiveAssignmentId) {
      fetchAssignment();
    }
  }, [effectiveAssignmentId, navigate]);

  const fetchAttemptHistory = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return;
      
      const userData = JSON.parse(currentUser);
      
      const response = await fetch(`${BASE_URL}/api/assignments/${effectiveAssignmentId}/attempts`, {
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success && result.data.attempts) {
        setAttemptHistory(result.data.attempts);
      }
    } catch (err) {
      console.error('Error fetching attempt history:', err);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchAttemptHistory();
    }
  }, [showHistory]);

  const handleSubmitTest = async () => {
    if (!assignment) return;
    
    const unansweredCount = assignment.questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }
    
    try {
      setSubmitting(true);
      
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      const userData = JSON.parse(currentUser);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      const response = await fetch(`${BASE_URL}/api/assignments/${effectiveAssignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: selectedAnswers,
          timeSpent
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit assignment');
      }
      
      if (result.success) {
        setTestResult(result.data);

        // Record progress in backend (assignments summary)
        try {
          const { courseId, moduleId, assignmentTitle } = getCourseAndModuleForAssignment(effectiveAssignmentId, assignment?.title);
          const percentage = typeof result?.data?.percentage === 'number' ? Math.round(result.data.percentage) : null;
          const passed = Boolean(result?.data?.passed);
          if (courseId && percentage !== null) {
            await fetch(`${BASE_URL}/api/progress/student/${userData.id}/assignment`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${userData.token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                courseId,
                moduleId,
                assignmentId: effectiveAssignmentId,
                assignmentTitle,
                status: passed ? 'graded' : 'submitted',
                score: percentage,
                maxScore: 100,
                timeSpent
              })
            });
          }
        } catch (progressErr) {
          console.error('Failed to record assignment progress:', progressErr);
        }

        setCurrentView('results');
        await fetchAttemptHistory();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err: any) {
      const hasLocalAnswers = assignment.questions.every(q => typeof q.correctAnswer === 'number');
      if (hasLocalAnswers) {
        const totalQuestions = assignment.questions.length;
        let score = 0;
        for (const q of assignment.questions) {
          const chosen = selectedAnswers[q.questionId];
          if (typeof chosen === 'number' && chosen === q.correctAnswer) {
            score++;
          }
        }
        const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
        const passed = percentage >= assignment.passingPercentage;
        const attemptNumber = (attemptHistory?.length || 0) + 1;
        const localResult = {
          score,
          totalQuestions,
          percentage,
          passed,
          message: passed ? 'You passed using local evaluation.' : 'You did not pass. Review topics and try again.',
          attemptNumber
        };
        setTestResult(localResult);
        try {
          const { courseId, moduleId, assignmentTitle } = getCourseAndModuleForAssignment(effectiveAssignmentId, assignment?.title);
          const pctRounded = Math.round(percentage);
          if (courseId) {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
              const userData = JSON.parse(currentUser);
              await fetch(`${BASE_URL}/api/progress/student/${userData.id}/assignment`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${userData.token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  courseId,
                  moduleId,
                  assignmentId: effectiveAssignmentId,
                  assignmentTitle,
                  status: passed ? 'graded' : 'submitted',
                  score: pctRounded,
                  maxScore: 100,
                  timeSpent: Math.floor((Date.now() - startTime) / 1000)
                })
              });
            }
          }
        } catch (e) {
          console.error('Local progress record failed:', e);
        }
        setCurrentView('results');
      } else {
        console.error('Error submitting assignment:', err);
        alert(err.message || 'Failed to submit assignment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (assignment && currentQuestionIndex < assignment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRetakeTest = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTestResult(null);
    setCurrentView('study');
  };

  const handleStartTest = () => {
    setCurrentView('test');
    setStartTime(Date.now());
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const selectedTopicData = assignment?.topics.find(topic => (topic.topicId || topic.id || topic.title) === selectedTopic);

  // Auto-expand Explanation when available for the selected topic
  React.useEffect(() => {
    if (selectedTopicData?.explanation) {
      const key = `explanation-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`;
      setExpandedSections(prev => ({
        ...prev,
        [key]: prev[key] ?? true,
      }));
    }
  }, [selectedTopic, selectedTopicData?.explanation]);

  // Render Explanation as plain text for networking-beginner-1
  const isNetworkingAssignment1 = assignment?.assignmentId === 'networking-beginner-1';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading assignment...</div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl mb-4">Error Loading Assignment</h2>
          <p className="text-gray-400 mb-6">{error || 'Assignment not found'}</p>
          <button
            onClick={() => navigate('/student-portal')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <MagnetLines
          rows={12}
          columns={12}
          containerSize="100vmin"
          lineColor="#3b82f6"
          lineWidth="0.6vmin"
          lineHeight="4vmin"
          baseAngle={0}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            opacity: 0.15,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/student-portal')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{assignment.title}</h1>
                  <p className="text-sm text-gray-400">
                    {assignment.totalQuestions} questions • Pass: {assignment.passingPercentage}%+
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  <TrophyIcon className="w-5 h-5 inline mr-2" />
                  History
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setShowHistory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Attempt History</h2>
                {attemptHistory.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No attempts yet. Take the test to get started!</p>
                ) : (
                  <div className="space-y-3">
                    {attemptHistory.map((attempt) => (
                      <div
                        key={attempt._id}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-white">
                              Attempt #{attempt.attemptNumber}
                            </span>
                            {attempt.passed && (
                              <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                                ✓ Passed
                              </span>
                            )}
                          </div>
                          <span className="text-2xl font-bold text-white">
                            {attempt.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>
                            Score: {attempt.score}/{attempt.totalQuestions}
                          </span>
                          <span>
                            {new Date(attempt.createdAt).toLocaleDateString()} at{' '}
                            {new Date(attempt.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {attempt.timeSpent > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            <ClockIcon className="w-4 h-4 inline mr-1" />
                            Time: {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className="mt-6 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* View Selector */}
          {currentView !== 'results' && (
            <div className="flex justify-center mb-8 space-x-4">
              <button
                onClick={() => setCurrentView('study')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentView === 'study'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <BookOpenIcon className="w-5 h-5 inline mr-2" />
                Study Material
              </button>
              <button
                onClick={handleStartTest}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentView === 'test'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <ClipboardDocumentCheckIcon className="w-5 h-5 inline mr-2" />
                Take Test
              </button>
            </div>
          )}

          {/* Study Material View */}
          {currentView === 'study' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Topic Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <h3 className="text-white font-semibold mb-4">Topics</h3>
                  <div className="space-y-2">
                    {assignment.topics.map((topic) => (
                      <button
                        key={topic.topicId || topic.id || topic.title}
                        onClick={() => setSelectedTopic(topic.topicId || topic.id || topic.title)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedTopic === (topic.topicId || topic.id || topic.title)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">{topic.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Topic Content */}
              <div className="lg:col-span-3">
                {selectedTopicData && (
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                    <h2 className="text-3xl font-bold text-white mb-6">
                      {selectedTopicData.title}
                    </h2>

                    {/* Explanation (first, plain) */}
                    {(selectedTopicData.explanation || selectedTopicData.content) && (
                      <div className="mb-6">
                        <h3 className="text-white font-semibold mb-2">Explanation</h3>
                        <p className="text-base md:text-lg text-gray-200 whitespace-pre-line leading-relaxed">
                          {selectedTopicData.explanation || selectedTopicData.content}
                        </p>
                      </div>
                    )}

                    {/* Commands (boxed) */}
                    {selectedTopicData.examples && selectedTopicData.examples.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-white font-medium mb-2">Commands</h3>
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <pre className="text-sm text-blue-400 whitespace-pre-wrap">
                            <code>{selectedTopicData.examples.join('\n')}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Topic navigation removed here to avoid duplicate buttons; kept only at footer */}
                    {/* Syntax */}
                    {selectedTopicData.syntax && (
                      <div className="mb-6">
                        <button
                          onClick={() => toggleSection(`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`)}
                          className="w-full flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors mb-2"
                        >
                          <span className="text-white font-medium">Syntax</span>
                          {expandedSections[`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] ? (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedSections[`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] && (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <pre className="text-sm text-green-400 overflow-x-auto">
                              <code>{selectedTopicData.syntax}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Examples removed: commands are shown above in a simple box */}

                    {/* Topic navigation */}
                    <div className="flex items-center justify-between mt-4">
                      {(() => {
                        const idx = assignment.topics.findIndex(t => (t.topicId || t.id || t.title) === selectedTopic);
                        const prev = idx > 0 ? assignment.topics[idx - 1] : null;
                        const next = idx >= 0 && idx < assignment.topics.length - 1 ? assignment.topics[idx + 1] : null;
                        const prevId = prev && (prev.topicId || prev.id || prev.title);
                        const nextId = next && (next.topicId || next.id || next.title);
                        return (
                          <>
                            <button
                              disabled={!prev}
                              onClick={() => prevId && setSelectedTopic(prevId)}
                              className={`px-4 py-2 rounded-lg ${prev ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                            >
                              ← Previous
                            </button>
                            <button
                              disabled={!next}
                              onClick={() => nextId && setSelectedTopic(nextId)}
                              className={`px-4 py-2 rounded-lg ${next ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                            >
                              Next →
                            </button>
                          </>
                        );
                      })()}
                    </div>
                    {/* Syntax */}
                    {selectedTopicData.syntax && (
                      <div className="mb-6">
                        <button
                          onClick={() => toggleSection(`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`)}
                          className="w-full flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors mb-2"
                        >
                          <span className="text-white font-medium">Syntax</span>
                          {expandedSections[`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] ? (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedSections[`syntax-${selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.title}`] && (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <pre className="text-sm text-green-400 overflow-x-auto">
                              <code>{selectedTopicData.syntax}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Examples removed: commands are shown above in a simple box */}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Test View */}
          {currentView === 'test' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">
                      Question {currentQuestionIndex + 1} of {assignment.questions.length}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Answered: {Object.keys(selectedAnswers).length}/{assignment.questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / assignment.questions.length) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {assignment.questions[currentQuestionIndex].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {assignment.questions[currentQuestionIndex].options.map((option, index) => {
                      const questionId = assignment.questions[currentQuestionIndex].questionId;
                      const isSelected = selectedAnswers[questionId] === index;

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(questionId, index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-600/20 text-white'
                              : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-600'
                              }`}
                            >
                              {isSelected && (
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <span className="flex-1">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {currentQuestionIndex === assignment.questions.length - 1 ? (
                    <button
                      onClick={handleSubmitTest}
                      disabled={submitting}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Test'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results View */}
          {currentView === 'results' && testResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mb-6"
                >
                  {testResult.passed ? (
                    <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto" />
                  ) : (
                    <XCircleIcon className="w-24 h-24 text-red-500 mx-auto" />
                  )}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  {testResult.passed ? 'Congratulations! 🎉' : 'Keep Learning! 📚'}
                </motion.h2>

                {/* Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <div className="text-3xl font-bold mb-2 text-white">
                    {testResult.score} / {testResult.totalQuestions}
                  </div>
                  <div className="text-lg text-gray-400 mb-4">
                    {testResult.percentage.toFixed(1)}% Score
                  </div>
                  <div className="w-64 bg-gray-700 rounded-full h-4 mx-auto overflow-hidden">
                    <motion.div
                      className={`h-4 rounded-full ${
                        testResult.passed
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${testResult.percentage}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <p className="text-gray-300 text-lg mb-4">{testResult.message}</p>
                  {!testResult.passed && (
                    <p className="text-gray-400">
                      You need to score more than {assignment.passingPercentage}% to pass this assignment.
                      Review the study material and try again when you're ready.
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Attempt #{testResult.attemptNumber}
                  </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center space-x-4"
                >
                  {!testResult.passed && (
                    <motion.button
                      onClick={handleRetakeTest}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 font-medium shadow-lg"
                    >
                      📚 Study & Retake Test
                    </motion.button>
                  )}
                  {testResult.passed && (
                    <motion.button
                      onClick={handleRetakeTest}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
                    >
                      🔄 Take Again
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => navigate('/student-portal')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all duration-200 font-medium"
                  >
                    🏠 Back to Portal
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
