import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { courseIntros } from '../data/courseIntroData';
import { askLLM, ChatMessage } from '../services/llm';
import { Paperclip, Mic, Send, BookOpen, FileText, Search, CheckCircle, ChevronDown, ChevronRight, ChevronLeft, PlayCircle, Terminal, Code, Clock } from 'lucide-react';
import { clsx } from 'clsx';

// --- Types ---

interface Lesson {
  title: string;
  content: string; // HTML content
  duration?: string;
  syntax?: { title: string; content: string }[];
  terminalCommands?: string[];
  terminalGuide?: string; // HTML content for terminal instructions
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
    title: 'DevOps Overview',
    duration: '15 min',
    description: 'Introduction to the world of DevOps'
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
    title: 'Module 1 — Introduction to DevOps',
    duration: '1 week',
    description: 'Understand DevOps culture, lifecycle, CI/CD concepts, toolchain, and roles.',
    lessons: [
      {
        title: 'What is DevOps?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why DevOps Exists (The Real Problem)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Before DevOps, software delivery was slow, manual, and unreliable.</p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Traditional Software Process:</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Developers wrote code</li>
            <li>Operations teams deployed code</li>
            <li>Both teams worked separately</li>
            <li>Deployments happened rarely</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Problems Faced:</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Manual server configuration</li>
            <li>Environment mismatch</li>
            <li>Deployment failures</li>
            <li>Delayed releases</li>
            <li>Blame between teams</li>
          </ul>

          <p class="mb-4 text-gray-700 dark:text-gray-300">The core issue was lack of automation and collaboration.</p>

          <div class="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 mb-6">
            <p class="font-medium text-blue-600 dark:text-blue-500">👉 DevOps was introduced to solve this exact problem.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. What DevOps Really Is (Practical Meaning)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps is not a tool, not a software, and not a single job role.</p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Practical Definition:</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps is a set of practices that automates the process of building, testing, packaging, and deploying applications by enabling collaboration between development and operations teams.</p>

          <p class="mb-2 text-gray-700 dark:text-gray-300 font-medium">DevOps focuses on:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Automation</li>
            <li>Speed</li>
            <li>Consistency</li>
            <li>Reliability</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. DevOps Explained with a Real Scenario</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
              <h3 class="font-bold text-red-600 dark:text-red-400 mb-2">Without DevOps:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Code is written</li>
                <li>Files are zipped</li>
                <li>Copied manually to server</li>
                <li>Dependencies installed manually</li>
                <li>Application fails due to missing setup</li>
              </ul>
              <div class="mt-3 pt-3 border-t border-red-200 dark:border-red-800/30">
                <p class="font-semibold text-red-600 dark:text-red-400 text-sm">Result:</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Errors, Delays, Manual fixes</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <h3 class="font-bold text-green-600 dark:text-green-400 mb-2">With DevOps:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Code is pushed to Git</li>
                <li>Build runs automatically</li>
                <li>Application is packaged consistently</li>
                <li>Deployed automatically</li>
                <li>Errors are detected early</li>
              </ul>
              <div class="mt-3 pt-3 border-t border-green-200 dark:border-green-800/30">
                <p class="font-semibold text-green-600 dark:text-green-400 text-sm">Result:</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Faster delivery, Fewer failures, Stable releases</p>
              </div>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. DevOps Workflow (Core Concept)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps follows an automated and continuous workflow.</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center font-mono text-sm mb-4 border border-gray-200 dark:border-gray-700">
            Code → Build → Test → Package → Deploy
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Each step:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Is automated</li>
            <li>Runs every time</li>
            <li>Produces the same result</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 italic">This repeatability is the heart of DevOps.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. DevOps = Culture + Automation + Tools</h2>
          <div class="space-y-4 mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Culture:</h3>
              <p class="text-gray-700 dark:text-gray-300">Shared responsibility, Faster feedback, Collaboration</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Automation:</h3>
              <p class="text-gray-700 dark:text-gray-300">Remove manual steps, Replace with scripts and pipelines</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Tools:</h3>
              <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Git – source code</li>
                <li>Jenkins – automation</li>
                <li>Docker – packaging</li>
                <li>Cloud – deployment</li>
              </ul>
            </div>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-medium">Tools support DevOps, they are not DevOps themselves.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Core DevOps Principles (Only What Matters)</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Automation</strong> – manual work causes errors</li>
            <li><strong>Consistency</strong> – same process, same output</li>
            <li><strong>Continuous Feedback</strong> – detect issues early</li>
            <li><strong>Collaboration</strong> – one team, one goal</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. What a DevOps Engineer Does in Real Life</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Daily responsibilities include:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Writing CI/CD pipelines</li>
            <li>Automating builds and deployments</li>
            <li>Creating Docker images</li>
            <li>Managing cloud infrastructure</li>
            <li>Monitoring systems</li>
            <li>Fixing pipeline failures</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-medium">This course trains exactly these skills.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. What DevOps Is NOT</h2>
          <ul class="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
            <li class="flex items-center gap-2"><span class="text-red-500">❌</span> Not only coding</li>
            <li class="flex items-center gap-2"><span class="text-red-500">❌</span> Not only server administration</li>
            <li class="flex items-center gap-2"><span class="text-red-500">❌</span> Not only Jenkins or Docker</li>
            <li class="flex items-center gap-2 font-bold mt-2"><span class="text-green-500">✔</span> DevOps = Automation-driven software delivery</li>
          </ul>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">Quick Summary (One-Paragraph Explanation)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              DevOps is a practical approach to software delivery that focuses on automating the complete journey of an application from source code to deployment. Instead of developers and operations working separately with manual steps, DevOps brings them together to create automated, repeatable workflows using tools like Git for version control, Jenkins for automation, Docker for packaging, and cloud platforms for deployment. The main goal of DevOps is to remove manual errors, reduce delivery time, ensure consistency across environments, and enable teams to release software frequently and reliably through automated pipelines.
            </p>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Traditional Manual Workflow',
            content: 'Write Code\nZip Files\nCopy to Server\nInstall Dependencies\nRun Application\n\nProblems:\n- Manual errors\n- Slow process\n- No consistency'
          },
          {
            title: 'DevOps Automated Workflow',
            content: 'git push\n↓\nautomated build\n↓\nautomated test\n↓\nautomated package\n↓\nautomated deploy\n\nBenefits:\n- Fast\n- Repeatable\n- Reliable'
          },
          {
            title: 'DevOps Toolchain Flow',
            content: 'Git → Jenkins → Docker → Cloud'
          },
          {
            title: 'Continuous DevOps Loop',
            content: 'Develop → Build → Deploy → Monitor → Improve'
          }
        ],
        terminalCommands: ['whoami', 'uname -a', 'mkdir -p ~/devops/module1/topic1', 'cd ~/devops/module1/topic1', 'nano app.txt', 'cat app.txt', 'mkdir manual_deploy', 'cp app.txt manual_deploy/', 'ls manual_deploy', 'rm -rf manual_deploy'],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Introduce terminal usage and automation mindset from Day 1.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Verify User & System</h3>
              <p class="text-sm text-gray-400 mb-2">Check who you are logged in as and the system details.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">whoami</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">uname -a</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create DevOps Workspace</h3>
              <p class="text-sm text-gray-400 mb-2">Create a structured directory for your work.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir -p ~/devops/module1/topic1</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd ~/devops/module1/topic1</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create Application File</h3>
              <p class="text-sm text-gray-400 mb-2">Create a dummy application file to simulate code.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">nano app.txt</code>
              <p class="text-xs text-gray-500 mb-1">Add the following content inside nano, then save (Ctrl+O, Enter) and exit (Ctrl+X):</p>
              <pre class="bg-gray-800 p-2 rounded text-gray-300 text-xs mb-2">This application will be automated using DevOps practices.</pre>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: View File Content</h3>
              <p class="text-sm text-gray-400 mb-2">Verify the file content.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cat app.txt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Simulate Manual Deployment</h3>
              <p class="text-sm text-gray-400 mb-2">Manually copy the file to a "deployment" folder (the old way).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir manual_deploy</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">cp app.txt manual_deploy/</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ls manual_deploy</code>
              <p class="text-sm text-yellow-500/80 mt-2 italic">Note: This represents old-style manual deployment which is error-prone.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Cleanup (Automation Mindset)</h3>
              <p class="text-sm text-gray-400 mb-2">Clean up the manual deployment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">rm -rf manual_deploy</code>
            </div>
          </div>
        `
      },
      {
        title: 'DevOps Lifecycle (Hands-On Automation Flow)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What is the DevOps Lifecycle? (Practical Meaning)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The DevOps lifecycle represents the real working flow of how software is continuously built, tested, deployed, and improved using automation.</p>
          
          <div class="mb-6 space-y-2">
            <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span class="text-[#00bceb]">👉</span> <span>It is not theory.</span>
            </div>
            <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span class="text-[#00bceb]">👉</span> <span>It is the exact workflow followed in real companies.</span>
            </div>
          </div>

          <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 mb-6">
            <p class="font-bold text-blue-700 dark:text-blue-400 mb-1">Simple Truth:</p>
            <p class="text-gray-700 dark:text-gray-300">Every DevOps engineer works around the DevOps lifecycle daily.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why the DevOps Lifecycle Exists</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
              <h3 class="font-bold text-red-600 dark:text-red-400 mb-2">Without a lifecycle:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Work is random</li>
                <li>Automation is incomplete</li>
                <li>Errors repeat</li>
                <li>No improvement loop</li>
              </ul>
            </div>

            <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <h3 class="font-bold text-green-600 dark:text-green-400 mb-2">With a lifecycle:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Clear workflow</li>
                <li>Automation at every stage</li>
                <li>Continuous improvement</li>
                <li>Faster and safer releases</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. DevOps Lifecycle Stages (Only What’s Necessary)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The beginner-level DevOps lifecycle has 6 practical stages:</p>
          
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center font-mono text-sm mb-4 border border-gray-200 dark:border-gray-700">
            Plan → Code → Build → Test → Package → Deploy
          </div>
          <p class="mb-6 text-sm text-gray-500 italic">Later, this becomes continuous with monitoring and feedback.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Stage 1: PLAN (What Needs to Be Built)</h2>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What Happens in Plan Stage:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Decide what feature to build</li>
              <li>Break work into tasks</li>
              <li>Define requirements</li>
            </ul>
          </div>
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">DevOps Role Here:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Prepare automation mindset</li>
              <li>Ensure deployability</li>
              <li>Think about CI/CD early</li>
            </ul>
            <p class="text-sm text-[#00bceb] font-medium">👉 DevOps engineers don’t code features, but they ensure features can be delivered smoothly.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Stage 2: CODE (Source Code Management)</h2>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What Happens:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Developers write code</li>
              <li>Code is stored in version control</li>
            </ul>
          </div>
          <div class="mb-6">
            <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Tool Used:</strong> Git</p>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Why This Stage is Critical:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Every automation starts with code</li>
              <li>No Git = No DevOps</li>
            </ul>
            <p class="text-sm text-[#00bceb] font-medium">👉 Every change must be tracked, versioned, and reproducible.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Stage 3: BUILD (Turning Code into an Application)</h2>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What Happens:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Dependencies are installed</li>
              <li>Code is compiled</li>
              <li>Application is built</li>
            </ul>
          </div>
          <div class="mb-6">
            <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Tools Used:</strong> Maven (Java), MSBuild (.NET)</p>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">DevOps Focus:</h3>
            <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Automate builds</li>
              <li>Ensure same build every time</li>
              <li>Eliminate “works on my machine” issues</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Stage 4: TEST (Quality Check)</h2>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What Happens:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Automated tests run</li>
              <li>Errors detected early</li>
            </ul>
          </div>
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Why This Matters:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Bugs found early are cheaper to fix</li>
              <li>Prevents broken code from reaching users</li>
            </ul>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">DevOps Responsibility:</h3>
            <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Integrate tests into pipeline</li>
              <li>Stop deployment on failure</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Stage 5: PACKAGE (Preparing for Deployment)</h2>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What Happens:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Application is bundled with dependencies</li>
              <li>Runs the same everywhere</li>
            </ul>
          </div>
          <div class="mb-6">
            <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Tool Used:</strong> Docker</p>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Why Packaging is Critical:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Same app on laptop, server, cloud</li>
              <li>No environment mismatch</li>
            </ul>
            <p class="text-sm text-[#00bceb] font-medium">👉 Packaging guarantees consistency.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">9. Stage 6: DEPLOY (Release to Environment)</h2>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What Happens:</h3>
            <ul class="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Application is deployed to server/cloud</li>
              <li>Users can access it</li>
            </ul>
          </div>
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">DevOps Focus:</h3>
            <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Automated deployments</li>
              <li>Zero manual steps</li>
              <li>Fast rollback if failure occurs</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">10. Continuous Nature of DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps never stops after deployment.</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center font-mono text-sm mb-4 border border-gray-200 dark:border-gray-700">
            Deploy → Monitor → Improve → Code → Deploy
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300">Feedback from deployment improves future releases.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">11. DevOps Lifecycle vs Traditional Lifecycle</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <tr>
                  <th class="px-4 py-2">Traditional</th>
                  <th class="px-4 py-2">DevOps</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2">Manual</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400 font-medium">Automated</td>
                </tr>
                <tr>
                  <td class="px-4 py-2">Slow</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400 font-medium">Fast</td>
                </tr>
                <tr>
                  <td class="px-4 py-2">Risky</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400 font-medium">Reliable</td>
                </tr>
                <tr>
                  <td class="px-4 py-2">One-time</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400 font-medium">Continuous</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">12. How You Will Use This Lifecycle in This Course</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Throughout this course, you will:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Use <strong>Git</strong> for Code</li>
            <li>Use <strong>Maven/MSBuild</strong> for Build</li>
            <li>Use <strong>Jenkins</strong> for Automation</li>
            <li>Use <strong>Docker</strong> for Package</li>
            <li>Use <strong>Cloud</strong> for Deploy</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 italic">This lifecycle will be implemented practically, not memorized.</p>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">Quick Summary (One-Paragraph Explanation)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              The DevOps lifecycle is a continuous and automated workflow that defines how software moves from planning and coding to building, testing, packaging, and deployment. Each stage is automated to reduce manual errors, improve speed, and ensure consistency across environments. By following this lifecycle, DevOps teams are able to deliver software continuously, detect issues early, and improve applications based on real feedback. In real-world DevOps, this lifecycle is implemented using tools like Git, build tools, CI/CD pipelines, containers, and cloud platforms to achieve fast and reliable software delivery.
            </p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'DevOps Lifecycle Flow',
            content: 'Plan\n ↓\nCode\n ↓\nBuild\n ↓\nTest\n ↓\nPackage\n ↓\nDeploy'
          },
          {
            title: 'Tool Mapping to Lifecycle',
            content: 'Plan     → Boards / Docs\nCode     → Git\nBuild    → Maven / MSBuild\nTest     → Automated Tests\nPackage  → Docker\nDeploy   → Cloud'
          },
          {
            title: 'Continuous Loop Representation',
            content: 'Code → Build → Deploy → Monitor → Improve → Code'
          }
        ],
        terminalCommands: [
          'mkdir -p ~/devops/module1/topic2',
          'cd ~/devops/module1/topic2',
          'nano app.txt',
          'cat app.txt',
          'mkdir build',
          'cp app.txt build/',
          'ls build',
          'grep "Version" build/app.txt',
          'mkdir package',
          'cp build/app.txt package/',
          'ls package',
          'mkdir deploy',
          'cp package/app.txt deploy/',
          'cat deploy/app.txt',
          'rm -rf build package deploy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Understand lifecycle stages through real file-based simulation.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Prepare Workspace</h3>
              <p class="text-sm text-gray-400 mb-2">Create the directory structure for this topic.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir -p ~/devops/module1/topic2</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd ~/devops/module1/topic2</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Simulate CODE Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Create a source code file.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">nano app.txt</code>
              <p class="text-xs text-gray-500 mb-1">Add the following content, then save (Ctrl+O) and exit (Ctrl+X):</p>
              <pre class="bg-gray-800 p-2 rounded text-gray-300 text-xs mb-2">Version 1 of application</pre>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Simulate BUILD Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Compile/Build the application (simulated by copying to build folder).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir build</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">cp app.txt build/</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">ls build</code>
              <p class="text-sm text-gray-400 italic">Build stage prepares application for next steps.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Simulate TEST Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Run automated tests (simulated by checking file content).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">grep "Version" build/app.txt</code>
              <p class="text-sm text-green-400 italic">✔ If text exists → test passed</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Simulate PACKAGE Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Package the application (simulated by copying to package folder).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir package</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">cp build/app.txt package/</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ls package</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Simulate DEPLOY Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Deploy to environment (simulated by copying to deploy folder).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir deploy</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">cp package/app.txt deploy/</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cat deploy/app.txt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Cleanup (Automation Thinking)</h3>
              <p class="text-sm text-gray-400 mb-2">Clean up the simulated environment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">rm -rf build package deploy</code>
            </div>
          </div>
        `
      },
      {
        title: 'DevOps Tools Overview & Environment Setup',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why DevOps Needs Tools (Practical Reason)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps is about automation, and automation is impossible without tools.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In real companies:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>No one deploys applications manually</li>
            <li>No one copies files by hand</li>
            <li>No one builds software step by step</li>
          </ul>
          <div class="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 mb-6">
            <p class="font-medium text-blue-600 dark:text-blue-500">👉 Tools replace manual human work with repeatable automation.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. DevOps Toolchain (Beginner-Level Reality)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">At beginner level, you don’t need 50 tools. You need a solid core toolchain.</p>
          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Core DevOps Toolchain You Will Use:</h3>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-left text-sm whitespace-nowrap">
              <thead class="uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-gray-900 dark:text-white">Purpose</th>
                  <th scope="col" class="px-6 py-3 text-gray-900 dark:text-white">Tool</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td class="px-6 py-3 text-gray-700 dark:text-gray-300">Source Code</td><td class="px-6 py-3 text-gray-700 dark:text-gray-300 font-mono text-[#00bceb]">Git</td></tr>
                <tr><td class="px-6 py-3 text-gray-700 dark:text-gray-300">Automation</td><td class="px-6 py-3 text-gray-700 dark:text-gray-300 font-mono text-[#00bceb]">Jenkins</td></tr>
                <tr><td class="px-6 py-3 text-gray-700 dark:text-gray-300">Build</td><td class="px-6 py-3 text-gray-700 dark:text-gray-300 font-mono text-[#00bceb]">Maven / MSBuild</td></tr>
                <tr><td class="px-6 py-3 text-gray-700 dark:text-gray-300">Packaging</td><td class="px-6 py-3 text-gray-700 dark:text-gray-300 font-mono text-[#00bceb]">Docker</td></tr>
                <tr><td class="px-6 py-3 text-gray-700 dark:text-gray-300">Infrastructure</td><td class="px-6 py-3 text-gray-700 dark:text-gray-300 font-mono text-[#00bceb]">Cloud</td></tr>
                <tr><td class="px-6 py-3 text-gray-700 dark:text-gray-300">Terminal</td><td class="px-6 py-3 text-gray-700 dark:text-gray-300 font-mono text-[#00bceb]">Linux CLI</td></tr>
              </tbody>
            </table>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300 italic">This course is built exactly around these tools.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Role of Each Tool (Real Usage, No Theory)</h2>
          <div class="space-y-6 mb-6">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">1️⃣ Git – Source Code Management</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Stores application code</li>
                <li>Tracks changes</li>
                <li>Triggers automation</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Every DevOps pipeline starts with Git</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">2️⃣ Jenkins – Automation Engine</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Runs builds automatically</li>
                <li>Executes pipelines</li>
                <li>Connects all tools together</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Jenkins is the brain of automation</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">3️⃣ Build Tools – Maven / MSBuild</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Convert code into runnable applications</li>
                <li>Manage dependencies</li>
                <li>Produce build artifacts</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Build tools ensure same output every time</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">4️⃣ Docker – Application Packaging</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Packages app with dependencies</li>
                <li>Removes environment mismatch</li>
                <li>Runs same everywhere</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Docker guarantees consistency</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">5️⃣ Cloud – Deployment Platform</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Hosts applications</li>
                <li>Provides scalability</li>
                <li>Enables real deployments</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 DevOps without cloud is incomplete</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">6️⃣ Linux Terminal – Control Center</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Execute commands</li>
                <li>Run automation scripts</li>
                <li>Debug failures</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Terminal is mandatory for DevOps</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. DevOps Environment Setup (Beginner Strategy)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Before automation, you need:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>A working terminal</li>
            <li>Installed tools</li>
            <li>Proper folder structure</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300">We start locally, then move to cloud.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. How All Tools Work Together (Very Important)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">End-to-End DevOps Flow:</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center font-mono text-sm mb-4 border border-gray-200 dark:border-gray-700 space-y-2">
            <p>Developer writes code</p>
            <p>↓</p>
            <p>Git stores code</p>
            <p>↓</p>
            <p>Jenkins triggers build</p>
            <p>↓</p>
            <p>Build tool compiles app</p>
            <p>↓</p>
            <p>Docker packages app</p>
            <p>↓</p>
            <p>Cloud deploys app</p>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300">This flow will be implemented step-by-step in upcoming modules.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. What You Will NOT Learn Here (Important)</h2>
          <ul class="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
            <li class="flex items-center gap-2"><span class="text-red-500">❌</span> Complex Kubernetes</li>
            <li class="flex items-center gap-2"><span class="text-red-500">❌</span> Advanced scripting</li>
            <li class="flex items-center gap-2"><span class="text-red-500">❌</span> Multiple CI tools</li>
            <li class="flex items-center gap-2"><span class="text-red-500">❌</span> Deep cloud architecture</li>
            <li class="flex items-center gap-2 font-bold mt-2"><span class="text-green-500">✔</span> Only necessary beginner tools</li>
            <li class="flex items-center gap-2 font-bold"><span class="text-green-500">✔</span> Only real practical usage</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Why Environment Setup is Critical</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">If environment is wrong:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Pipelines fail</li>
            <li>Tools don’t work</li>
            <li>Learning breaks</li>
          </ul>
          <div class="p-4 rounded-lg border border-yellow-200 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/10 mb-6">
            <p class="font-medium text-yellow-700 dark:text-yellow-400">👉 Good DevOps starts with a clean environment</p>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">Quick Summary (One-Paragraph Explanation)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              DevOps relies on a small but powerful set of tools that work together to automate software delivery from source code to deployment. Git manages and tracks code changes, Jenkins automates the workflow, build tools like Maven or MSBuild convert code into runnable applications, Docker packages applications for consistent execution, and cloud platforms host deployed software. The Linux terminal acts as the control center for running commands and automation. Understanding how these tools connect and setting them up correctly is essential before building any DevOps automation pipeline.
            </p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'DevOps Toolchain Mapping',
            content: 'Code        → Git\nAutomation  → Jenkins\nBuild       → Maven / MSBuild\nPackage     → Docker\nDeploy      → Cloud\nControl     → Linux Terminal'
          },
          {
            title: 'End-to-End Tool Flow',
            content: 'Git → Jenkins → Build Tool → Docker → Cloud'
          },
          {
            title: 'Beginner Environment Folder Structure',
            content: 'devops/\n └── module1/\n     └── topic3/'
          }
        ],
        terminalCommands: [
          'echo "DevOps terminal ready"',
          'mkdir -p ~/devops/module1/topic3',
          'cd ~/devops/module1/topic3',
          'git --version',
          'docker --version',
          'nano tools.txt',
          'cat tools.txt',
          'pwd',
          'ls'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Set up a clean DevOps workspace and verify terminal readiness.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Verify Terminal Access</h3>
              <p class="text-sm text-gray-400 mb-2">Ensure your terminal is working correctly.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">echo "DevOps terminal ready"</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create DevOps Directory Structure</h3>
              <p class="text-sm text-gray-400 mb-2">Organize your workspace for this topic.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir -p ~/devops/module1/topic3</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd ~/devops/module1/topic3</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Verify System Tools</h3>
              <p class="text-sm text-gray-400 mb-2">Check if core tools are available.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git --version</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">docker --version</code>
              <p class="text-xs text-gray-500 italic">(If not installed, they will be installed in next topics)</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Create Tool Reference File</h3>
              <p class="text-sm text-gray-400 mb-2">Create a reference list of tools.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">nano tools.txt</code>
              <p class="text-xs text-gray-500 mb-1">Add the following content, then save (Ctrl+O) and exit (Ctrl+X):</p>
              <pre class="bg-gray-800 p-2 rounded text-gray-300 text-xs mb-2">Git      - Source Code
Jenkins  - Automation
Docker   - Packaging
Cloud    - Deployment
Linux    - Control</pre>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: View Tool List</h3>
              <p class="text-sm text-gray-400 mb-2">Verify the file content.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cat tools.txt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Confirm Workspace</h3>
              <p class="text-sm text-gray-400 mb-2">Check your current location and files.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">pwd</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ls</code>
            </div>
          </div>
        `
      },
      {
        title: 'DevOps Lifecycle (End-to-End Practical Flow)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is the DevOps Lifecycle?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The DevOps lifecycle is a continuous process that defines how an application moves from idea → code → build → test → deploy → operate → monitor → improve. Unlike traditional models, DevOps does not stop after deployment. It keeps running in a loop to continuously improve software quality, speed, and reliability.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In real-time industry usage, the DevOps lifecycle ensures that:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Every code change is tracked</li>
            <li>Every build is automated</li>
            <li>Every deployment is repeatable</li>
            <li>Every failure is monitored and fixed quickly</li>
          </ul>
          <div class="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 mb-6">
            <p class="font-medium text-blue-600 dark:text-blue-500">👉 DevOps lifecycle is commonly represented as infinity loop (∞) because it never ends.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Stages of DevOps Lifecycle (Beginner-Level View)</h2>
          
          <div class="space-y-6 mb-6">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">1️⃣ Plan</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Decide what to build</li>
                <li>Create tasks, user stories, and requirements</li>
                <li>Tools used: Jira, Azure Boards, Trello</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Output: Clear development plan</p>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">2️⃣ Develop</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Developers write code</li>
                <li>Code is stored in a version control system</li>
                <li>Tools used: Git, GitHub, GitLab</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Output: Source code</p>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">3️⃣ Build</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Code is converted into an executable or package</li>
                <li>Build tools compile code and resolve dependencies</li>
                <li>Tools used: Maven, Gradle, MSBuild</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Output: Build artifacts (JAR, WAR, EXE)</p>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">4️⃣ Test</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Automated tests verify code quality</li>
                <li>Detect bugs early</li>
                <li>Tools used: JUnit, Selenium, TestNG</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Output: Test reports</p>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">5️⃣ Release</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Approved build is marked for deployment</li>
                <li>Version tagging happens</li>
                <li>Tools used: Git tags, CI pipelines</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Output: Release-ready version</p>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">6️⃣ Deploy</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Application is deployed to servers or cloud</li>
                <li>Automation avoids manual errors</li>
                <li>Tools used: Jenkins, Docker, Kubernetes</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Output: Live application</p>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">7️⃣ Operate</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Application runs in production</li>
                <li>Servers, containers, and services are managed</li>
                <li>Tools used: Linux, AWS, Azure</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Output: Stable operations</p>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">8️⃣ Monitor</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-2">
                <li>Track performance, errors, uptime</li>
                <li>Logs and metrics are analyzed</li>
                <li>Tools used: Prometheus, Grafana, ELK Stack</li>
              </ul>
              <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">👉 Output: Insights and alerts</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why DevOps Lifecycle is Important</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
              <h3 class="font-bold text-red-600 dark:text-red-400 mb-2">Without DevOps lifecycle:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Deployments are slow</li>
                <li>Errors reach production</li>
                <li>Rollbacks are painful</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <h3 class="font-bold text-green-600 dark:text-green-400 mb-2">With DevOps lifecycle:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Faster releases</li>
                <li>Fewer failures</li>
                <li>Quick recovery</li>
                <li>Better collaboration</li>
              </ul>
            </div>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              The DevOps lifecycle is a continuous loop that automates the entire journey of an application from planning and development to deployment and monitoring. Each stage—plan, develop, build, test, release, deploy, operate, and monitor—works together to ensure fast, reliable, and repeatable software delivery. By automating these stages, DevOps eliminates manual errors, reduces deployment time, and allows teams to continuously improve applications based on real-time feedback from production systems.
            </p>
          </div>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Concept-to-Tool Mapping',
            content: `DevOps Stage | Purpose | Example Tools
Plan | Requirement tracking | Jira
Develop | Write & manage code | Git
Build | Compile & package | Maven
Test | Automated testing | JUnit
Release | Versioning | Git Tags
Deploy | Push to servers | Jenkins
Operate | Manage systems | Linux
Monitor | Logs & metrics | Prometheus`
          },
          {
            title: 'DevOps Lifecycle (Simple Flow Syntax)',
            content: 'Code → Build → Test → Release → Deploy → Monitor → Feedback → Code'
          }
        ],
        terminalCommands: [
          'mkdir devops-lifecycle',
          'cd devops-lifecycle',
          'git init',
          'nano app.txt',
          'git add .',
          'git commit -m "Initial version of application"',
          'mkdir build',
          'cp app.txt build/',
          'ls build'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Walk through the DevOps lifecycle stages with a hands-on simulation.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create a Project Directory</h3>
              <p class="text-sm text-gray-400 mb-2">Set up a dedicated workspace for the lifecycle project.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir devops-lifecycle</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd devops-lifecycle</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Initialize Git (Develop Stage)</h3>
              <p class="text-sm text-gray-400 mb-2">Start version control to track your development.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git init</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create Sample Application File</h3>
              <p class="text-sm text-gray-400 mb-2">Create the initial code for the application.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">nano app.txt</code>
              <p class="text-xs text-gray-500 mb-1">Add the following content, then save (Ctrl+O) and exit (Ctrl+X):</p>
              <pre class="bg-gray-800 p-2 rounded text-gray-300 text-xs mb-2">Hello DevOps Lifecycle</pre>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Track Code Changes</h3>
              <p class="text-sm text-gray-400 mb-2">Stage and commit the changes to the repository.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add .</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git commit -m "Initial version of application"</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Simulate Build Output</h3>
              <p class="text-sm text-gray-400 mb-2">Manually simulate the build process by creating a build artifact.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir build</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cp app.txt build/</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Verify Build Artifact</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm that the build artifact was created successfully.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ls build</code>
            </div>
          </div>
        `
      },
      {
        title: 'DevOps Tools Overview (Beginner-Level Practical Understanding)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why DevOps Tools Are Needed</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps is not a single tool; it is a combination of practices supported by tools. Each DevOps tool automates a specific stage of the DevOps lifecycle. Without tools, DevOps cannot be implemented practically because manual processes are slow, error-prone, and not scalable.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In real-world environments, a DevOps engineer works daily with multiple tools, each responsible for one task such as version control, automation, containerization, infrastructure provisioning, or monitoring.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Major Categories of DevOps Tools</h2>
          
          <div class="space-y-6 mb-6">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">1️⃣ Version Control Tools (Code Management)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Purpose:</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Track code changes</li>
                    <li>Enable team collaboration</li>
                    <li>Roll back to previous versions</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Popular Tools:</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Git, GitHub, GitLab, Bitbucket</p>
                </div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">
                 <p class="text-sm text-blue-800 dark:text-blue-300"><span class="font-bold">Real-World Example:</span> When a developer pushes code, DevOps pipelines automatically trigger builds and tests.</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">2️⃣ CI/CD Tools (Automation & Pipelines)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Purpose:</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Automatically build, test, and deploy code</li>
                    <li>Remove manual deployment steps</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Popular Tools:</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Jenkins, GitHub Actions, GitLab CI</p>
                </div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">
                 <p class="text-sm text-blue-800 dark:text-blue-300"><span class="font-bold">Real-World Example:</span> Every commit triggers a pipeline that builds the application and deploys it to a server.</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">3️⃣ Build Tools (Application Packaging)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Purpose:</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Compile source code</li>
                    <li>Manage dependencies</li>
                    <li>Create deployable artifacts</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Popular Tools:</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Maven (Java), Gradle, MSBuild (.NET)</p>
                </div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">
                 <p class="text-sm text-blue-800 dark:text-blue-300"><span class="font-bold">Real-World Example:</span> Maven converts Java source code into .jar or .war files automatically.</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">4️⃣ Configuration & Infrastructure Tools</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Purpose:</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Provision servers automatically</li>
                    <li>Manage infrastructure as code</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Popular Tools:</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Terraform, Ansible, CloudFormation</p>
                </div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">
                 <p class="text-sm text-blue-800 dark:text-blue-300"><span class="font-bold">Real-World Example:</span> Terraform creates cloud servers using configuration files instead of manual setup.</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">5️⃣ Containerization Tools</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Purpose:</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Package application with dependencies</li>
                    <li>Ensure consistency across environments</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Popular Tools:</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Docker, Podman</p>
                </div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">
                 <p class="text-sm text-blue-800 dark:text-blue-300"><span class="font-bold">Real-World Example:</span> Docker ensures the app runs the same on developer, testing, and production servers.</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">6️⃣ Container Orchestration Tools</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Purpose:</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Manage containers at scale</li>
                    <li>Handle auto-scaling and self-healing</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Popular Tools:</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Kubernetes, OpenShift</p>
                </div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">
                 <p class="text-sm text-blue-800 dark:text-blue-300"><span class="font-bold">Real-World Example:</span> Kubernetes restarts failed containers automatically without downtime.</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">7️⃣ Cloud Platforms</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Purpose:</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Host applications</li>
                    <li>Provide scalable infrastructure</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Popular Platforms:</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">AWS, Azure, Google Cloud</p>
                </div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">
                 <p class="text-sm text-blue-800 dark:text-blue-300"><span class="font-bold">Real-World Example:</span> Applications are deployed on cloud servers instead of physical machines.</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">8️⃣ Monitoring & Logging Tools</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Purpose:</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Monitor performance</li>
                    <li>Detect failures early</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Popular Tools:</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Prometheus, Grafana, ELK Stack</p>
                </div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">
                 <p class="text-sm text-blue-800 dark:text-blue-300"><span class="font-bold">Real-World Example:</span> If CPU usage spikes, alerts are triggered automatically.</p>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              DevOps tools automate each stage of the DevOps lifecycle, making software delivery faster, reliable, and scalable. Version control tools manage code changes, CI/CD tools automate build and deployment, build tools package applications, container tools ensure environment consistency, infrastructure tools provision servers, and monitoring tools track performance. Together, these tools form a complete DevOps ecosystem that eliminates manual work and enables continuous delivery in real-world production environments.
            </p>
          </div>
        `,
        duration: '30 min',
        syntax: [
          {
            title: 'Tool Mapping Overview',
            content: 'Developer Code → Git → Jenkins → Maven → Docker → Kubernetes → Cloud → Monitoring'
          },
          {
            title: 'Tool-to-Stage Mapping Table',
            content: `Stage | Tool Example
Code | Git
Build | Maven / MSBuild
CI/CD | Jenkins
Container | Docker
Orchestration | Kubernetes
Infra | Terraform
Cloud | AWS
Monitoring | Prometheus`
          }
        ],
        terminalCommands: [
          'git --version',
          'mvn -version',
          'docker --version',
          'aws --version'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Identify tools and verify environment setup.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Git Installation</h3>
              <p class="text-sm text-gray-400 mb-2">Verify Git version.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git --version</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Check Build Tool (Maven)</h3>
              <p class="text-sm text-gray-400 mb-2">Verify Maven version (if installed).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn -version</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Check Docker</h3>
              <p class="text-sm text-gray-400 mb-2">Verify Docker version.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker --version</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Check Cloud CLI (Optional)</h3>
              <p class="text-sm text-gray-400 mb-2">Verify AWS CLI version (if installed).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws --version</code>
            </div>
          </div>
        `
      },
      {
        title: 'DevOps Culture & Mindset (Soft Skills for DevOps Engineers)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Culture Matters</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps is not just tools (Jenkins, Docker, Kubernetes). It is <span class="font-bold text-[#00bceb]">50% Technical + 50% Cultural</span>. Even with the best tools, DevOps fails if teams don't collaborate. The goal is to break down "silos" between Development (Dev) and Operations (Ops).</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">The CAMS Model</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The core values of DevOps can be summarized by the acronym <strong>CAMS</strong>:</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <h3 class="font-bold text-purple-700 dark:text-purple-300 mb-2">C - Culture</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">People over processes. Open communication, mutual trust, and shared responsibility.</p>
            </div>
            <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 class="font-bold text-blue-700 dark:text-blue-300 mb-2">A - Automation</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Eliminate toil. Automate repetitive tasks (testing, deployment) to reduce errors.</p>
            </div>
            <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h3 class="font-bold text-green-700 dark:text-green-300 mb-2">M - Measurement</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Data-driven decisions. Measure deployment frequency, failure rate, and recovery time.</p>
            </div>
            <div class="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <h3 class="font-bold text-orange-700 dark:text-orange-300 mb-2">S - Sharing</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Knowledge transfer. No silos. Share successes, failures, and lessons learned.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Core Cultural Principles</h2>
          <div class="space-y-4">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-1">1. You Build It, You Run It</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">Developers are responsible for their code in production. They don't just "throw code over the wall" to Ops. This encourages writing better, more reliable code.</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-1">2. Blameless Post-Mortems</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">When things go wrong (and they will), the focus is on <span class="font-semibold">fixing the process</span>, not blaming the person. "Why did the system allow this error?" instead of "Who made the mistake?"</p>
            </div>
          </div>

          <div class="mt-6 p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              DevOps culture is as important as the tools. It relies on the CAMS model: Culture (shared responsibility), Automation (removing manual work), Measurement (tracking metrics), and Sharing (knowledge exchange). Key principles like "You Build It, You Run It" and "Blameless Post-Mortems" ensure that teams work together to improve quality and speed without fear of failure.
            </p>
          </div>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Mindset Shift: Traditional vs DevOps',
            content: `Traditional | DevOps
----------------|-------
"It works on my machine" | "It works in production"
"That's Ops problem" | "We own this together"
"Hide errors" | "Fail fast, fix fast"
"Manual deployments" | "Automated pipelines"
"Change is dangerous" | "Change is routine"`
          },
          {
            title: 'The CAMS Model Summary',
            content: `C | Culture (Collaboration)
A | Automation (Efficiency)
M | Measurement (Metrics)
S | Sharing (Knowledge)`
          }
        ],
        terminalCommands: [
          'cat /var/log/syslog',
          'ps aux | grep app',
          'echo "Root Cause: Config error" > post-mortem.md',
          'cat post-mortem.md'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Simulate a "Blameless Post-Mortem" scenario: Investigate a failure and document it without blame.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Investigate Failure (Check Logs)</h3>
              <p class="text-sm text-gray-400 mb-2">A deployment failed. Instead of guessing, check the system logs.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cat /var/log/syslog</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Verify Process Status</h3>
              <p class="text-sm text-gray-400 mb-2">Check if the application process is actually running.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ps aux | grep app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create Post-Mortem Report</h3>
              <p class="text-sm text-gray-400 mb-2">Document the findings. Focus on the *cause*, not the *person*.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">echo "Root Cause: Config error" > post-mortem.md</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Share Findings</h3>
              <p class="text-sm text-gray-400 mb-2">Read the report to share with the team.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cat post-mortem.md</code>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Module 2 — Linux Fundamentals for DevOps',
    duration: '1 week',
    description: 'Work confidently in Linux: files, permissions, processes, networking, packages, and logs.',
    lessons: [
      {
        title: 'Linux Basics for DevOps Engineers',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Linux is Important for DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Most DevOps tools such as Docker, Kubernetes, Jenkins, Git servers, cloud VMs run on Linux. DevOps engineers manage servers through the terminal, not GUI. Understanding Linux basics allows you to install tools, troubleshoot issues, automate tasks, and manage production servers confidently.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Linux is preferred because it is: <span class="font-semibold text-[#00bceb]">Stable, Secure, Lightweight, Open-source, Automation-friendly</span>.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is Linux? (Practical View)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Linux is an operating system kernel that manages Files, Processes, Memory, Network, and Users/Permissions. In DevOps, Linux is mainly used in <span class="font-semibold">headless mode</span> (no GUI, only terminal via SSH).</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Linux Distributions Used in DevOps</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Distribution</th>
                  <th scope="col" class="px-4 py-2">Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">Ubuntu</td>
                  <td class="px-4 py-2">Most common for DevOps</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">Amazon Linux</td>
                  <td class="px-4 py-2">AWS servers</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">CentOS / Rocky</td>
                  <td class="px-4 py-2">Enterprise servers</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">Debian</td>
                  <td class="px-4 py-2">Stable servers</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mb-6 text-sm text-gray-600 dark:text-gray-400">👉 In this course, we will use <span class="font-bold text-[#00bceb]">Ubuntu Linux</span>.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Linux Directory Structure (Must Know)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-mono text-[#00bceb] font-bold">/</span> <span class="text-gray-600 dark:text-gray-400">- Root of file system</span>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-mono text-[#00bceb] font-bold">/home</span> <span class="text-gray-600 dark:text-gray-400">- User directories</span>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-mono text-[#00bceb] font-bold">/etc</span> <span class="text-gray-600 dark:text-gray-400">- Configuration files</span>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-mono text-[#00bceb] font-bold">/var</span> <span class="text-gray-600 dark:text-gray-400">- Logs and variable data</span>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-mono text-[#00bceb] font-bold">/usr</span> <span class="text-gray-600 dark:text-gray-400">- Installed software</span>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-mono text-[#00bceb] font-bold">/bin</span> <span class="text-gray-600 dark:text-gray-400">- Basic commands</span>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-mono text-[#00bceb] font-bold">/opt</span> <span class="text-gray-600 dark:text-gray-400">- Optional applications</span>
            </div>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Linux is the backbone of DevOps because almost all servers, cloud instances, and automation tools run on it. DevOps engineers interact with Linux mainly through the terminal to manage files, processes, users, and services. Understanding Linux basics such as directory structure, distributions, and command-line usage is essential for installing tools, troubleshooting systems, and automating infrastructure in real production environments.
            </p>
          </div>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Navigation Commands',
            content: `pwd | Show current directory
ls | List files
cd | Change directory`
          },
          {
            title: 'File & Directory Commands',
            content: `mkdir devops | Create directory
touch file.txt | Create empty file
cp file.txt backup.txt | Copy file
mv file.txt newfile.txt | Move/Rename file
rm newfile.txt | Remove file`
          },
          {
            title: 'Viewing Files',
            content: `cat file.txt | View content
less file.txt | View large files`
          }
        ],
        terminalCommands: [
          'pwd',
          'mkdir devops',
          'cd devops',
          'touch linux.txt',
          'echo "Linux is the backbone of DevOps" > linux.txt',
          'cat linux.txt',
          'cp linux.txt linux_backup.txt',
          'mv linux_backup.txt linux_final.txt',
          'rm linux.txt'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice with basic Linux file and directory management.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Current Location</h3>
              <p class="text-sm text-gray-400 mb-2">See which directory you are currently in.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">pwd</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create DevOps Workspace</h3>
              <p class="text-sm text-gray-400 mb-2">Create a new directory and enter it.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir devops</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd devops</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create a File</h3>
              <p class="text-sm text-gray-400 mb-2">Create a text file and add some content to it.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">touch linux.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">echo "Linux is the backbone of DevOps" > linux.txt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: View File Content</h3>
              <p class="text-sm text-gray-400 mb-2">Read the content of the file you just created.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cat linux.txt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Copy & Rename File</h3>
              <p class="text-sm text-gray-400 mb-2">Make a backup copy, then rename it.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">cp linux.txt linux_backup.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mv linux_backup.txt linux_final.txt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Delete a File</h3>
              <p class="text-sm text-gray-400 mb-2">Remove the original file.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">rm linux.txt</code>
            </div>
          </div>
        `
      },
      {
        title: 'Linux File Permissions & Ownership (Hands-On & Real-World)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why File Permissions Matter in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In real-world DevOps environments, applications run as specific users, CI/CD tools access files automatically, and containers need controlled access. If permissions are incorrect, Jenkins might fail to read build files, Docker containers might fail to start, or applications could crash due to "Access Denied" errors. Linux permissions ensure security and controlled access.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Linux Permission Types</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Each file or directory has three permission types:</p>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Permission</th>
                  <th scope="col" class="px-4 py-2">Symbol</th>
                  <th scope="col" class="px-4 py-2">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">Read</td>
                  <td class="px-4 py-2 font-mono text-[#00bceb]">r</td>
                  <td class="px-4 py-2">View file contents</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">Write</td>
                  <td class="px-4 py-2 font-mono text-[#00bceb]">w</td>
                  <td class="px-4 py-2">Modify file</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">Execute</td>
                  <td class="px-4 py-2 font-mono text-[#00bceb]">x</td>
                  <td class="px-4 py-2">Run file / enter directory</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">User Categories</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb]">User (u)</span> <br/> <span class="text-sm text-gray-600 dark:text-gray-400">Owner of the file</span>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb]">Group (g)</span> <br/> <span class="text-sm text-gray-600 dark:text-gray-400">Group members</span>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb]">Others (o)</span> <br/> <span class="text-sm text-gray-600 dark:text-gray-400">Everyone else</span>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Permission Structure Example</h2>
          <div class="p-4 bg-black/80 rounded-lg font-mono text-green-400 mb-6 text-center text-lg">
            -rwxr-xr--
          </div>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><code class="text-red-500 font-bold">-</code> : File type (file)</li>
            <li><code class="text-blue-500 font-bold">rwx</code> : Owner permissions (Read, Write, Execute)</li>
            <li><code class="text-purple-500 font-bold">r-x</code> : Group permissions (Read, Execute)</li>
            <li><code class="text-yellow-500 font-bold">r--</code> : Others permissions (Read only)</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Numeric Permission Values (Very Important)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Values:</h4>
              <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li><span class="font-mono font-bold">r = 4</span></li>
                <li><span class="font-mono font-bold">w = 2</span></li>
                <li><span class="font-mono font-bold">x = 1</span></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Common DevOps Sets:</h4>
              <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li><span class="font-mono font-bold text-[#00bceb]">755</span> (rwx,r-x,r-x) → Scripts & Apps</li>
                <li><span class="font-mono font-bold text-[#00bceb]">644</span> (rw-,r--,r--) → Config files</li>
                <li><span class="font-mono font-bold text-[#00bceb]">600</span> (rw-------) → Secrets (Keys/Passwords)</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Ownership in Linux</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Every file has an <strong>Owner</strong> and a <strong>Group</strong>. This matters when services like Jenkins or Docker run as specific non-root users.</p>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Linux file permissions control who can read, write, or execute files and are critical in DevOps environments where automation tools and applications run as specific users. By understanding permission types, numeric values, and ownership, DevOps engineers can prevent access errors, improve security, and ensure smooth execution of pipelines, scripts, and services in production systems.
            </p>
          </div>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Permission Commands',
            content: `Check Permissions | ls -l
Change Permissions | chmod 755 script.sh
Add Execute | chmod +x script.sh
Change Ownership | chown user:group file.txt
Recursive Own | chown -R user:group /dir`
          },
          {
            title: 'Special Checks',
            content: `Who am I? | whoami
My Groups | groups`
          }
        ],
        terminalCommands: [
          'touch devops.sh',
          'ls -l devops.sh',
          'echo "echo Hello DevOps" > devops.sh',
          './devops.sh',
          'chmod +x devops.sh',
          './devops.sh'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice setting permissions and executing scripts safely.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create Test File</h3>
              <p class="text-sm text-gray-400 mb-2">Create a shell script file and check its default permissions.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">touch devops.sh</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ls -l devops.sh</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Add Script Content</h3>
              <p class="text-sm text-gray-400 mb-2">Add a simple command to the script.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">echo "echo Hello DevOps" > devops.sh</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Try Executing (Will Fail)</h3>
              <p class="text-sm text-gray-400 mb-2">Attempt to run the script. It should fail because it lacks 'execute' permission.</p>
              <code class="block bg-black/50 p-2 rounded text-red-400 font-mono text-sm">./devops.sh</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Give Execute Permission</h3>
              <p class="text-sm text-gray-400 mb-2">Grant execute permission to the user.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">chmod +x devops.sh</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Execute Successfully</h3>
              <p class="text-sm text-gray-400 mb-2">Run the script again. It should work now.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">./devops.sh</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Change Ownership (Optional)</h3>
              <p class="text-sm text-gray-400 mb-2">Change file owner (requires sudo).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo chown $USER:$USER devops.sh</code>
            </div>
          </div>
        `
      },
      {
        title: 'Users & Groups (Linux Access Management for DevOps)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What are Users & Groups in Linux?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In Linux, <span class="font-bold text-[#00bceb]">users and groups control who can access what</span>. Every file, process, and service runs under a <span class="font-bold text-[#00bceb]">user identity</span> and belongs to a <span class="font-bold text-[#00bceb]">group</span>. In DevOps environments, automation tools, applications, and CI/CD pipelines never run randomly—they always run as <span class="font-bold text-[#00bceb]">specific users</span>.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Managing users and groups correctly is critical to:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Secure servers</li>
            <li>Prevent unauthorized access</li>
            <li>Allow automation tools to work smoothly</li>
            <li>Avoid running everything as root (very dangerous)</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Users & Groups Are Important in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In real-world DevOps environments:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><span class="font-mono text-[#00bceb]">Jenkins</span> runs as <span class="font-mono text-[#00bceb]">jenkins</span> user</li>
            <li><span class="font-mono text-[#00bceb]">Docker</span> uses <span class="font-mono text-[#00bceb]">docker</span> group</li>
            <li>Applications run as non-root users</li>
            <li>Teams share servers using group-based access</li>
          </ul>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <h3 class="font-bold text-red-700 dark:text-red-300 mb-2">❌ Bad Practice</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Running everything as root.</p>
            </div>
            <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h3 class="font-bold text-green-700 dark:text-green-300 mb-2">✅ Good Practice</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Controlled access using users & groups.</p>
            </div>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Incorrect user or group configuration can cause:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Pipeline failures</li>
            <li>Permission denied errors</li>
            <li>Security vulnerabilities</li>
            <li>Accidental system damage</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Types of Users in Linux</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-1">1️⃣ Root User</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Superuser with full control</li>
                <li>User ID (UID): 0</li>
                <li>Can delete system files, users, and services</li>
                <li class="text-red-500 font-bold">⚠️ Root should NOT be used for daily work.</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-1">2️⃣ Normal (Regular) Users</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Used by developers, DevOps engineers</li>
                <li>Limited permissions</li>
                <li>Can use <span class="font-mono text-[#00bceb]">sudo</span> if allowed</li>
                <li>Example: <span class="font-mono text-[#00bceb]">devops</span>, <span class="font-mono text-[#00bceb]">ubuntu</span>, <span class="font-mono text-[#00bceb]">ec2-user</span></li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-1">3️⃣ System / Service Users</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Created for services and tools</li>
                <li>No login access</li>
                <li>Used by applications</li>
                <li>Example: <span class="font-mono text-[#00bceb]">jenkins</span>, <span class="font-mono text-[#00bceb]">nginx</span>, <span class="font-mono text-[#00bceb]">mysql</span>, <span class="font-mono text-[#00bceb]">docker</span></li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Are Groups?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A <span class="font-bold text-[#00bceb]">group</span> is a collection of users. Groups are used to:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Share directory access</li>
            <li>Control file permissions</li>
            <li>Manage team access easily</li>
          </ul>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 mb-6">
            <p class="text-sm text-gray-700 dark:text-gray-300"><span class="font-bold">Example:</span> Group: <span class="font-mono text-[#00bceb]">devops</span> | Users: <span class="font-mono text-[#00bceb]">alice</span>, <span class="font-mono text-[#00bceb]">bob</span>, <span class="font-mono text-[#00bceb]">jenkins</span></p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Instead of giving permissions to each user, we give permissions to the <span class="font-bold">group</span>.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Primary vs Secondary Groups</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Primary Group</h4>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Assigned at user creation</li>
                <li>Files created by user belong to this group</li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Secondary Groups</h4>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Extra groups user belongs to</li>
                <li>Used for shared access</li>
              </ul>
            </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 mb-6">
             <p class="text-sm text-gray-700 dark:text-gray-300"><span class="font-bold">Example:</span> User: <span class="font-mono text-[#00bceb]">devops</span></p>
             <p class="text-sm text-gray-700 dark:text-gray-300">Primary group: <span class="font-mono text-[#00bceb]">devops</span></p>
             <p class="text-sm text-gray-700 dark:text-gray-300">Secondary groups: <span class="font-mono text-[#00bceb]">docker</span>, <span class="font-mono text-[#00bceb]">sudo</span></p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Sudo (Superuser Do)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><span class="font-mono text-[#00bceb]">sudo</span> allows a <span class="font-bold text-[#00bceb]">normal user</span> to run <span class="font-bold text-[#00bceb]">administrative commands</span> safely. Instead of logging in as root: <code class="bg-black/50 p-1 rounded text-green-400 font-mono text-sm">sudo apt update</code></p>
          <h3 class="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-2">Benefits:</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Secure</li>
            <li>Logged actions</li>
            <li>Temporary privilege escalation</li>
          </ul>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Users and groups in Linux define who can access files, run commands, and manage services. In DevOps environments, tools and applications run under specific users, and group-based access ensures secure collaboration. By using normal users with sudo privileges instead of root, DevOps engineers maintain security, stability, and proper access control across servers and automation pipelines.
            </p>
          </div>
        `,
        duration: '40 min',
        syntax: [
          {
            title: 'User Management Commands',
            content: `Create user | adduser username
Delete user | deluser username
User ID info | id username
Current user | whoami`
          },
          {
            title: 'Group Management Commands',
            content: `Create group | groupadd groupname
Delete group | groupdel groupname
Show user groups | groups username`
          },
          {
            title: 'Add User to Group',
            content: `Add to group | usermod -aG groupname username
Note | -a is important (appends)`
          },
          {
            title: 'Sudo Commands',
            content: `Run as root | sudo command
Check privileges | sudo -l`
          }
        ],
        terminalCommands: [
          'whoami',
          'id',
          'sudo adduser devops',
          'sudo groupadd devopsgroup',
          'sudo usermod -aG devopsgroup devops',
          'groups devops',
          'sudo usermod -aG sudo devops',
          'su - devops',
          'sudo apt update',
          'sudo mkdir /app',
          'sudo chown :devopsgroup /app',
          'sudo chmod 770 /app'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice managing users, groups, and sudo access.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Current User</h3>
              <p class="text-sm text-gray-400 mb-2">See who you are currently logged in as.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">whoami</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">id</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create a New User</h3>
              <p class="text-sm text-gray-400 mb-2">Create a new user named 'devops'. (Follow prompts).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo adduser devops</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create a Group</h3>
              <p class="text-sm text-gray-400 mb-2">Create a new group called 'devopsgroup'.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo groupadd devopsgroup</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Add User to Group</h3>
              <p class="text-sm text-gray-400 mb-2">Add the 'devops' user to the 'devopsgroup'.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo usermod -aG devopsgroup devops</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Verify Group Membership</h3>
              <p class="text-sm text-gray-400 mb-2">Check if the user was successfully added to the group.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">groups devops</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Give Sudo Access</h3>
              <p class="text-sm text-gray-400 mb-2">Add 'devops' user to the sudo group.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo usermod -aG sudo devops</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Switch User & Test Sudo</h3>
              <p class="text-sm text-gray-400 mb-2">Switch to the new user and try running an admin command.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">su - devops</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo apt update</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Create Shared Directory</h3>
              <p class="text-sm text-gray-400 mb-2">Create a directory accessible only by group members.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">sudo mkdir /app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">sudo chown :devopsgroup /app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo chmod 770 /app</code>
              <p class="text-sm text-gray-400 mt-2">✔ Only group members can now access /app</p>
            </div>
          </div>
        `
      },
      {
        title: 'Linux File System & Navigation (Hands-On Practical)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why File System Knowledge is Critical</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps engineers spend most of their time navigating servers, editing config files, and managing application directories. Understanding the Linux file system is mandatory because:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><span class="font-semibold text-[#00bceb]">CI/CD pipelines</span> rely on specific directory structures.</li>
            <li><span class="font-semibold text-[#00bceb]">Docker images</span> need proper paths for volumes and configs.</li>
            <li><span class="font-semibold text-[#00bceb]">Logs & Scripts</span> are stored in standard Linux directories.</li>
            <li><span class="font-semibold text-[#00bceb]">Misplacing files</span> leads to failed deployments.</li>
          </ul>

          <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Real Scenario:</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">A Jenkins pipeline fails because <code class="bg-black/10 dark:bg-black/30 px-1 rounded">/app/config/config.yml</code> is missing. Knowing how to navigate and check paths is essential to fix this.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Linux File System Hierarchy (Important Directories)</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Directory</th>
                  <th scope="col" class="px-4 py-2">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">/</td>
                  <td class="px-4 py-2">Root directory (Start of everything)</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">/home</td>
                  <td class="px-4 py-2">User home directories</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">/etc</td>
                  <td class="px-4 py-2">Configuration files</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">/var</td>
                  <td class="px-4 py-2">Logs, variable data</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">/usr</td>
                  <td class="px-4 py-2">Installed software, binaries</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">/bin</td>
                  <td class="px-4 py-2">Basic commands</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">/opt</td>
                  <td class="px-4 py-2">Optional software, tools</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">/tmp</td>
                  <td class="px-4 py-2">Temporary files</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Absolute vs Relative Paths</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">Absolute Path</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Full path starting from root (<code class="text-orange-500">/</code>).</p>
              <div class="p-2 bg-black/80 rounded text-green-400 font-mono text-xs">
                /home/devops/project/app.txt
              </div>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">Relative Path</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Path from current directory.</p>
              <div class="p-2 bg-black/80 rounded text-green-400 font-mono text-xs">
                ./project/app.txt <span class="text-gray-500">or</span> ../app.txt
              </div>
            </div>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Linux file system knowledge is crucial for DevOps because all tools, applications, and pipelines rely on proper file paths and directory structures. Understanding important directories, absolute and relative paths, and navigation commands allows engineers to manage scripts, configurations, logs, and deployments confidently and efficiently in real-world production environments.
            </p>
          </div>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Navigation Commands',
            content: `pwd | Print current directory
ls | List files
ls -l | Detailed list
cd /path | Change directory
cd .. | Go up one level
cd ~ | Go to home directory`
          },
          {
            title: 'File & Directory Commands',
            content: `mkdir project | Create directory
touch file.txt | Create file
cp file.txt backup.txt | Copy file
mv file.txt app.txt | Rename or move
rm file.txt | Delete file`
          },
          {
            title: 'View File Content',
            content: `cat file.txt | View content
less file.txt | View large files
head file.txt | View first 10 lines
tail file.txt | View last 10 lines`
          }
        ],
        terminalCommands: [
          'cd ~',
          'pwd',
          'mkdir -p devops/module2/topic4',
          'cd devops/module2/topic4',
          'touch app.txt config.yml log.txt',
          'ls -l',
          'mkdir scripts build deploy',
          'mv app.txt build/',
          'mv config.yml scripts/',
          'mv log.txt deploy/',
          'ls -R'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Master Linux file navigation and organization structure.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Navigate to Home</h3>
              <p class="text-sm text-gray-400 mb-2">Go to your home directory and check path.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">cd ~</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">pwd</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create Project Structure</h3>
              <p class="text-sm text-gray-400 mb-2">Create nested directories using <code class="text-white">-p</code> flag.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir -p devops/module2/topic4</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd devops/module2/topic4</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create Files</h3>
              <p class="text-sm text-gray-400 mb-2">Create dummy application files.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">touch app.txt config.yml log.txt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: List Files</h3>
              <p class="text-sm text-gray-400 mb-2">View the files you created.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ls -l</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Create Subdirectories</h3>
              <p class="text-sm text-gray-400 mb-2">Create folders for organizing files.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mkdir scripts build deploy</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Move Files into Folders</h3>
              <p class="text-sm text-gray-400 mb-2">Organize the files into their respective directories.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mv app.txt build/</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mv config.yml scripts/</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mv log.txt deploy/</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Verify Structure</h3>
              <p class="text-sm text-gray-400 mb-2">Check the final directory structure (using recursive list).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ls -R</code>
            </div>
          </div>
        `
      },
      {
        title: 'Linux Processes & Monitoring (Hands-On Practical)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Process Management is Important</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps engineers need to monitor running processes, kill stuck processes, and check resource usage to ensure smooth CI/CD pipelines and production environments. Unmanaged processes can consume memory, crash applications, or freeze pipelines.</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><span class="font-semibold text-[#00bceb]">Jenkins pipelines</span> spawn multiple processes.</li>
            <li><span class="font-semibold text-[#00bceb]">Docker containers</span> run in background processes.</li>
            <li><span class="font-semibold text-[#00bceb]">Servers</span> often have multiple applications running.</li>
          </ul>

          <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Real Scenario:</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">A Jenkins pipeline fails because a previous process of the same job is still running. Knowing how to check and kill processes solves the problem immediately.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Process Basics in Linux</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A process is a running program. Each process has:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><span class="font-mono font-bold text-[#00bceb]">PID</span> → Process ID (unique number)</li>
            <li><span class="font-mono font-bold text-[#00bceb]">PPID</span> → Parent process ID</li>
            <li><span class="font-mono font-bold text-[#00bceb]">Status</span> → Running, sleeping, stopped</li>
            <li><span class="font-mono font-bold text-[#00bceb]">Resource usage</span> → CPU, memory</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Process States</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">State</th>
                  <th scope="col" class="px-4 py-2">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">R</td>
                  <td class="px-4 py-2">Running</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">S</td>
                  <td class="px-4 py-2">Sleeping</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">T</td>
                  <td class="px-4 py-2">Stopped</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">Z</td>
                  <td class="px-4 py-2">Zombie (defunct)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Linux process management allows DevOps engineers to monitor and control applications, automation jobs, and background services. Understanding process IDs, states, and resource usage ensures pipelines run smoothly, prevents memory leaks, and allows quick troubleshooting. Skills like listing, killing, and prioritizing processes are essential for maintaining production servers and automation pipelines.
            </p>
          </div>
        `,
        duration: '40 min',
        syntax: [
          {
            title: 'View Running Processes',
            content: `ps aux | List all processes with details
top | Real-time process monitoring
htop | Interactive process monitoring`
          },
          {
            title: 'Find & Kill Process',
            content: `ps aux | grep name | Find specific process
kill PID | Graceful termination
kill -9 PID | Force termination`
          },
          {
            title: 'Check Resource Usage',
            content: `free -h | Memory usage
df -h | Disk usage
uptime | Load average`
          }
        ],
        terminalCommands: [
          'ps aux',
          'top',
          'ps aux | grep bash',
          'sleep 300 &',
          'ps aux | grep sleep',
          'kill $(pgrep sleep)',
          'free -h',
          'df -h',
          'uptime'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice monitoring and managing Linux processes.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: List All Processes</h3>
              <p class="text-sm text-gray-400 mb-2">View a snapshot of all running processes.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ps aux</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Monitor Real-Time Processes</h3>
              <p class="text-sm text-gray-400 mb-2">See processes updating in real-time. (Press 'q' to exit).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">top</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Search for a Process</h3>
              <p class="text-sm text-gray-400 mb-2">Find a specific process (e.g., bash shell).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ps aux | grep bash</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Start a Background Process</h3>
              <p class="text-sm text-gray-400 mb-2">Start a long-running process in the background using '&'.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sleep 300 &</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Find the PID</h3>
              <p class="text-sm text-gray-400 mb-2">Find the Process ID of the sleep command.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ps aux | grep sleep</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Kill the Background Process</h3>
              <p class="text-sm text-gray-400 mb-2">Terminate the process using its PID.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">kill <PID></code>
              <p class="text-xs text-gray-500 mb-1">If it doesn't stop, force kill it:</p>
              <code class="block bg-black/50 p-2 rounded text-red-400 font-mono text-sm">kill -9 <PID></code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Check Resource Usage</h3>
              <p class="text-sm text-gray-400 mb-2">Check memory, disk space, and system load.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">free -h</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">df -h</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">uptime</code>
            </div>
          </div>
        `
      },
      {
        title: 'Linux Networking & Firewall Basics (Hands-On Practical)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Networking is Important for DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Networking is the backbone of DevOps. Without understanding network commands and firewall rules, pipelines, Docker containers, and cloud deployments will fail.</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><span class="font-semibold text-[#00bceb]">CI/CD tools</span> (Jenkins, GitHub Actions) communicate over network.</li>
            <li><span class="font-semibold text-[#00bceb]">Docker containers</span> communicate internally and externally.</li>
            <li><span class="font-semibold text-[#00bceb]">Cloud servers</span> require open ports for services.</li>
            <li><span class="font-semibold text-[#00bceb]">Firewall misconfiguration</span> can block deployments or expose security risks.</li>
          </ul>

          <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Real Scenario:</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">A Jenkins pipeline fails to pull Docker images because port 443 is blocked. Knowing how to check and fix networking solves this immediately.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Linux Networking Basics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-[#00bceb] mb-2">IP Addressing</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Shows machine identity on network.</p>
              <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">ip addr</code>, <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">ifconfig</code>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-[#00bceb] mb-2">Check Connectivity</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Test if server can reach another server.</p>
              <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">ping</code>, <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">curl</code>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-[#00bceb] mb-2">Open Ports</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Check listening services.</p>
              <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">netstat</code>, <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">ss</code>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-[#00bceb] mb-2">Firewall Rules</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Control traffic in/out of server.</p>
              <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">ufw</code>, <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">firewalld</code>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Important Networking Commands</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Command</th>
                  <th scope="col" class="px-4 py-2">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">ping</td>
                  <td class="px-4 py-2">Test connectivity</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">curl</td>
                  <td class="px-4 py-2">Test URL/API access</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">ip addr</td>
                  <td class="px-4 py-2">Show IP address</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">netstat -tulnp</td>
                  <td class="px-4 py-2">Show listening ports</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">ufw status</td>
                  <td class="px-4 py-2">Show firewall rules</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-mono font-bold text-[#00bceb]">ufw allow 8080</td>
                  <td class="px-4 py-2">Open port</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Networking knowledge in Linux is critical for DevOps engineers to ensure CI/CD pipelines, Docker containers, and cloud deployments communicate correctly. Commands like ping, curl, netstat, and ip addr allow checking connectivity, open ports, and IPs. Firewalls (like UFW) control server access and security. Understanding and managing these ensures smooth application deployment and secure server management.
            </p>
          </div>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Networking Basics',
            content: `ip addr | Check IP Address
ping google.com | Ping a Server
netstat -tulnp | Check Open Ports`
          },
          {
            title: 'Firewall (UFW)',
            content: `sudo ufw status | Check Firewall Status
sudo ufw allow 8080 | Open a Port
sudo ufw enable | Enable Firewall`
          }
        ],
        terminalCommands: [
          'ip addr',
          'ping -c 4 google.com',
          'ss -tulnp',
          'sudo ufw status',
          'sudo ufw allow 8080',
          'curl http://localhost:8080'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice essential networking and firewall commands.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check IP Address</h3>
              <p class="text-sm text-gray-400 mb-2">View your machine's network identity.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ip addr</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Test Connectivity</h3>
              <p class="text-sm text-gray-400 mb-2">Check if you can reach the internet (ping 4 times).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ping -c 4 google.com</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Check Listening Ports</h3>
              <p class="text-sm text-gray-400 mb-2">See which services are listening for connections.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ss -tulnp</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Check Firewall Status</h3>
              <p class="text-sm text-gray-400 mb-2">Check if the firewall is active and what rules exist.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo ufw status</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Open Port 8080</h3>
              <p class="text-sm text-gray-400 mb-2">Allow traffic on port 8080 (common for web apps).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">sudo ufw allow 8080</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo ufw status</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Test Connection to Open Port</h3>
              <p class="text-sm text-gray-400 mb-2">Try to connect to the local port (might fail if nothing running, but good practice).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">curl http://localhost:8080</code>
            </div>
          </div>
        `
      },
      {
        title: 'Linux Package Management (Hands-On Practical)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Package Management Matters</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In DevOps, installing, updating, and removing software is a daily task. You cannot manually compile every tool. Package managers automate this process, handling dependencies and security updates.</p>

          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><span class="font-semibold text-[#00bceb]">Environment Setup</span>: Quickly install tools like Git, Docker, Nginx.</li>
            <li><span class="font-semibold text-[#00bceb]">Security Updates</span>: Keep systems safe with the latest patches.</li>
            <li><span class="font-semibold text-[#00bceb]">Dependency Management</span>: Automatically install required libraries.</li>
          </ul>

          <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Real Scenario:</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">You need to set up a web server. Instead of downloading files manually, you run <code>sudo apt install nginx</code>, and the system handles the rest.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Package Managers</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-[#00bceb] mb-2">Debian/Ubuntu</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Uses <code>apt</code> (Advanced Package Tool).</p>
              <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">.deb</code> files
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-[#00bceb] mb-2">RHEL/CentOS</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Uses <code>yum</code> or <code>dnf</code>.</p>
              <code class="text-xs bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">.rpm</code> files
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Actions</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Action</th>
                  <th scope="col" class="px-4 py-2">Command (Ubuntu)</th>
                  <th scope="col" class="px-4 py-2">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-semibold">Update Lists</td>
                  <td class="px-4 py-2 font-mono text-[#00bceb]">sudo apt update</td>
                  <td class="px-4 py-2">Refresh repository info</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-semibold">Install</td>
                  <td class="px-4 py-2 font-mono text-[#00bceb]">sudo apt install [pkg]</td>
                  <td class="px-4 py-2">Install software</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-semibold">Remove</td>
                  <td class="px-4 py-2 font-mono text-[#00bceb]">sudo apt remove [pkg]</td>
                  <td class="px-4 py-2">Uninstall software</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-semibold">Clean</td>
                  <td class="px-4 py-2 font-mono text-[#00bceb]">sudo apt autoremove</td>
                  <td class="px-4 py-2">Remove unused dependencies</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Package management is essential for maintaining a healthy and secure Linux environment. Tools like <code>apt</code> (Ubuntu) and <code>yum/dnf</code> (CentOS) automate the installation, update, and removal of software, handling dependencies automatically. Regular updates and proper cleanup prevent security vulnerabilities and system bloat.
            </p>
          </div>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Basic Commands',
            content: `sudo apt update | Update package lists
sudo apt upgrade | Upgrade installed packages
sudo apt install [name] | Install a package
sudo apt remove [name] | Remove a package`
          },
          {
            title: 'Search & Clean',
            content: `sudo apt search [keyword] | Search for packages
sudo apt autoremove | Remove unused dependencies
sudo apt clean | Clear local cache`
          }
        ],
        terminalCommands: [
          'sudo apt update',
          'sudo apt search nginx',
          'sudo apt install nginx',
          'systemctl status nginx',
          'sudo apt remove nginx',
          'sudo apt autoremove'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice installing, updating, and removing software packages.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Update Package Lists</h3>
              <p class="text-sm text-gray-400 mb-2">Always update repositories before installing anything.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo apt update</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Search for a Package</h3>
              <p class="text-sm text-gray-400 mb-2">Check if 'nginx' is available in the repository.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo apt search nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Install Nginx</h3>
              <p class="text-sm text-gray-400 mb-2">Install the Nginx web server.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo apt install nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Check Status</h3>
              <p class="text-sm text-gray-400 mb-2">Verify that the service was installed and is running.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">systemctl status nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Remove Nginx</h3>
              <p class="text-sm text-gray-400 mb-2">Uninstall the package.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo apt remove nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Clean Up</h3>
              <p class="text-sm text-gray-400 mb-2">Remove unused dependencies to free up space.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo apt autoremove</code>
            </div>
          </div>
        `
      },
      {
        title: 'Users & groups',
        content: '<h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">User Management</h2><p class="mb-4 text-gray-700 dark:text-gray-300">Managing user accounts and groups is crucial for system security. Commands: <code>useradd</code>, <code>usermod</code>, <code>groupadd</code>, <code>passwd</code>.</p>',
        duration: '15 min',
        terminalCommands: ['sudo useradd newuser', 'sudo passwd newuser']
      },
      {
        title: 'systemctl & journalctl (Service Management & Logs for DevOps)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is systemctl?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <code class="text-[#00bceb]">systemctl</code> is a command used to manage services on Linux systems that use <strong>systemd</strong> (most modern Linux distributions like Ubuntu, Amazon Linux, CentOS).
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A service is a background process that:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Starts automatically at boot</li>
            <li>Runs continuously</li>
            <li>Supports applications, servers, and tools</li>
          </ul>

          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-800 dark:text-gray-200 mb-2">In DevOps, almost everything runs as a service:</h4>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
              <div class="bg-white dark:bg-gray-900 p-2 rounded text-center border dark:border-gray-700">Jenkins</div>
              <div class="bg-white dark:bg-gray-900 p-2 rounded text-center border dark:border-gray-700">Docker</div>
              <div class="bg-white dark:bg-gray-900 p-2 rounded text-center border dark:border-gray-700">Nginx</div>
              <div class="bg-white dark:bg-gray-900 p-2 rounded text-center border dark:border-gray-700">Kubernetes</div>
              <div class="bg-white dark:bg-gray-900 p-2 rounded text-center border dark:border-gray-700">Databases</div>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why systemctl is Important in DevOps</h2>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Start and stop applications</li>
            <li>Enable services at system boot</li>
            <li>Restart failed services</li>
            <li>Check service status during deployments</li>
          </ul>

          <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Real Scenario:</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">After deploying a new build, the application doesn’t respond. A DevOps engineer checks the service status and restarts it using <code>systemctl</code>.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Service States</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">State</th>
                  <th scope="col" class="px-4 py-2">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono text-green-600 dark:text-green-400 font-bold">active (running)</td>
                  <td class="px-4 py-2">Service is running</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono text-gray-500">inactive</td>
                  <td class="px-4 py-2">Service stopped</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono text-red-500 font-bold">failed</td>
                  <td class="px-4 py-2">Service crashed</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono text-blue-500">enabled</td>
                  <td class="px-4 py-2">Starts at boot</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-mono text-gray-500">disabled</td>
                  <td class="px-4 py-2">Does not start at boot</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is journalctl?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <code class="text-[#00bceb]">journalctl</code> is used to view logs collected by <strong>systemd-journald</strong>.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Instead of checking multiple log files manually, journalctl provides:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Centralized logs</li>
            <li>Time-based filtering</li>
            <li>Service-specific logs</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why journalctl is Important in DevOps</h2>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>CI/CD failures require log analysis</li>
            <li>Services may start but fail silently</li>
            <li>Logs help identify root causes quickly</li>
          </ul>

          <div class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 class="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Real Scenario:</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">Jenkins service is running, but jobs fail. Logs from <code>journalctl</code> reveal a permission issue.</p>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">One-Paragraph Summary (For Revision)</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              <code>systemctl</code> is used to manage and control Linux services, allowing DevOps engineers to start, stop, restart, and enable applications reliably. <code>journalctl</code> provides centralized logging for system and service events, helping engineers troubleshoot failures and monitor service behavior. Together, these tools form the backbone of service management and debugging in modern DevOps environments.
            </p>
          </div>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'systemctl Commands',
            content: `systemctl status service_name | Check status
systemctl start service_name | Start service
systemctl stop service_name | Stop service
systemctl restart service_name | Restart service
systemctl enable service_name | Enable at boot
systemctl disable service_name | Disable at boot
systemctl is-enabled service_name | Check if enabled
systemctl list-units --type=service | List all services`
          },
          {
            title: 'journalctl Commands',
            content: `journalctl | View all logs
journalctl -u service_name | View service logs
journalctl -f | Follow live logs
journalctl --since "1 hour ago" | Filter by time
journalctl -p err | View errors only
journalctl -xe | View details of recent crash`
          }
        ],
        terminalCommands: [
          'sudo apt update',
          'sudo apt install nginx -y',
          'systemctl status nginx',
          'sudo systemctl stop nginx',
          'sudo systemctl start nginx',
          'sudo systemctl restart nginx',
          'sudo systemctl enable nginx',
          'journalctl -u nginx',
          'journalctl -u nginx -f',
          'journalctl -p err -u nginx',
          'sudo systemctl stop nginx',
          'journalctl -xe'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice managing services with systemctl and debugging with journalctl.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Install Nginx</h3>
              <p class="text-sm text-gray-400 mb-2">We will use Nginx as a real service example.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">sudo apt update</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo apt install nginx -y</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Check Service Status</h3>
              <p class="text-sm text-gray-400 mb-2">Verify if the service is active.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">systemctl status nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Stop the Service</h3>
              <p class="text-sm text-gray-400 mb-2">Stop the Nginx service manually.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo systemctl stop nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Start the Service</h3>
              <p class="text-sm text-gray-400 mb-2">Start the service again.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo systemctl start nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Restart the Service</h3>
              <p class="text-sm text-gray-400 mb-2">Useful when you change configuration files.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo systemctl restart nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Enable Service at Boot</h3>
              <p class="text-sm text-gray-400 mb-2">Ensure Nginx starts automatically when the server reboots.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo systemctl enable nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: View Service Logs</h3>
              <p class="text-sm text-gray-400 mb-2">Check logs specifically for Nginx.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">journalctl -u nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Follow Live Logs</h3>
              <p class="text-sm text-gray-400 mb-2">Watch logs in real-time (Press Ctrl + C to exit).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">journalctl -u nginx -f</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 9: View Recent Errors</h3>
              <p class="text-sm text-gray-400 mb-2">Filter logs to see only errors.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">journalctl -p err -u nginx</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 10: Simulate a Failure</h3>
              <p class="text-sm text-gray-400 mb-2">Stop the service and check the latest events.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">sudo systemctl stop nginx</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">journalctl -xe</code>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Module 3 — Version Control & Collaboration',
    duration: '1 week',
    description: 'Master Git fundamentals, workflows, branching, merging, best practices, and GitHub collaboration.',
    lessons: [
      {
        title: 'Why Version Control?',
        content: `<h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. The Real Problem Before Version Control (Industry Reality)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Before tools like Git existed, developers managed code like this:</p>
          <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">project_final.zip</p>
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">project_final_v2.zip</p>
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">project_final_latest_really_final.zip</p>
          </div>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Code shared via:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Email</li>
            <li>USB drives</li>
            <li>WhatsApp</li>
          </ul>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
              <h3 class="font-bold text-red-600 dark:text-red-400 mb-2">The Issues:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>If something broke → no way to know what changed</li>
                <li>If a teammate deleted code → no recovery</li>
                <li>If two people edited the same file → conflicts & chaos</li>
              </ul>
            </div>
          </div>
          <div class="p-4 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 mb-6">
            <p class="font-medium text-red-600 dark:text-red-500">👉 This approach completely fails in real companies.</p>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Now imagine this in startups with fast releases, enterprises with 50+ developers, or DevOps pipelines where code deploys automatically. <span class="font-bold text-red-500">💥 One small mistake can break production.</span></p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. What Is Version Control? (Simple but Accurate)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Version Control is a system that:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Tracks every change made to code</li>
            <li>Stores complete history of a project</li>
            <li>Allows multiple developers to work together safely</li>
            <li>Enables you to go back in time if something breaks</li>
          </ul>
          <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 mb-6">
            <p class="font-bold text-blue-700 dark:text-blue-400 mb-1">Think of it like:</p>
            <p class="text-gray-700 dark:text-gray-300">Google Docs for code. You can see who changed what, when, and why.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Why Version Control Is Mandatory in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300 font-bold">DevOps = Speed + Stability</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
              <h3 class="font-bold text-red-600 dark:text-red-400 mb-2">Without Version Control:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>CI/CD pipelines cannot work</li>
                <li>Automation becomes dangerous</li>
                <li>Rollbacks are impossible</li>
                <li>Collaboration breaks</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <h3 class="font-bold text-green-600 dark:text-green-400 mb-2">With Version Control:</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Every deployment is traceable</li>
                <li>Builds are reproducible</li>
                <li>Rollbacks are instant</li>
                <li>Automation is safe</li>
              </ul>
            </div>
          </div>
          <div class="p-4 rounded-lg border border-[#00bceb]/30 bg-[#00bceb]/10 mb-6">
            <p class="font-medium text-[#00bceb]">📌 DevOps starts with Git. No Git = No DevOps.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. What Exactly Does Version Control Solve?</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">✅ Problem 1: Losing Code</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">Version control stores every version. Deleted file? → Restore it. Broken feature? → Roll back.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">✅ Problem 2: Multiple Developers</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">Each developer works independently. Changes are merged safely. Conflicts are detected early.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">✅ Problem 3: Tracking Changes</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">Every change has: Author, Time, Reason (commit message).</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">✅ Problem 4: Safe Experimentation</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">Try new ideas without fear. If it fails → revert instantly.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Centralized vs Distributed Version Control</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Centralized (Old Model)</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>One central server</li>
                <li>If server is down → work stops</li>
                <li>Example: SVN</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-[#00bceb]/10 border border-[#00bceb]/30">
              <h3 class="font-bold text-[#00bceb] mb-2">Distributed (Modern & DevOps Standard)</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Every developer has full copy</li>
                <li>Works offline</li>
                <li>Faster, Safer</li>
              </ul>
            </div>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-bold text-center">👉 Git is Distributed Version Control</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Why Git Is Industry Standard</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Git is used by Google, Amazon, Netflix, Startups & Enterprises.</p>
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Reasons:</h3>
            <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Extremely fast</li>
              <li>Works offline</li>
              <li>Handles large projects</li>
              <li>Integrates with Jenkins, Docker, Kubernetes, Cloud platforms</li>
            </ul>
          </div>
          <div class="p-4 rounded-lg border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 mb-6">
            <p class="font-medium text-green-600 dark:text-green-500">📌 If you know Git → you are job-ready for DevOps basics</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Version Control in a Real DevOps Workflow</h2>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center font-mono text-sm mb-4 border border-gray-200 dark:border-gray-700">
            Developer writes code → Code committed to Git → CI pipeline triggers → Build & tests run → Docker image created → Deployment happens
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-bold text-center">👉 Git is the trigger point for automation</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. What You Will Actually Do in This Module</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">By the end of Module 3, you will:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Use Git like a real developer</li>
            <li>Collaborate with others</li>
            <li>Fix mistakes confidently</li>
            <li>Prepare code for CI/CD pipelines</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 italic">No theory-heavy learning. Everything is hands-on.</p>`,
        duration: '15 min',
        syntax: [
          {
            title: 'Key Terminology (Must-Know)',
            content: `Repository | A project tracked by Git
Version | A saved state of code
Commit | A snapshot of changes
History | Timeline of commits
Branch | Independent line of development
Merge | Combining changes
Remote Repo | Repository stored online`
          },
          {
            title: 'Version Control Flow (Conceptual)',
            content: 'Edit Code → Save → Commit → Track History → Collaborate → Deploy'
          },
          {
            title: 'Git’s Core Philosophy',
            content: '- Small changes\\n- Frequent commits\\n- Clear history\\n- Safe collaboration'
          }
        ],
        terminalCommands: ['git --version', 'mkdir devops-git-demo', 'cd devops-git-demo', 'nano app.txt', 'ls'],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">This section is 100% practical. Students should type every command themselves.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check if Git Is Installed</h3>
              <p class="text-sm text-gray-400 mb-2">Verify Git installation.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git --version</code>
              <p class="text-sm text-gray-400 mt-2">✔ If Git is installed → version number appears</p>
              <p class="text-sm text-red-400 mt-1">❌ If not → install Git before continuing</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create a Practice Project</h3>
              <p class="text-sm text-gray-400 mb-2">Create a new directory for this lesson.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir devops-git-demo</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd devops-git-demo</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create a Sample File</h3>
              <p class="text-sm text-gray-400 mb-2">Create a text file to track.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">nano app.txt</code>
              <p class="text-xs text-gray-500 mb-1">Type inside:</p>
              <pre class="bg-gray-800 p-2 rounded text-gray-300 text-xs mb-2">Version Control Demo</pre>
              <p class="text-xs text-gray-500">Save and exit (CTRL + X, then Y, then Enter)</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Observe the Folder State</h3>
              <p class="text-sm text-gray-400 mb-2">Check the file existence.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">ls</code>
              <p class="text-sm text-gray-400 mt-2">You should see: app.txt</p>
              <p class="text-sm text-yellow-500 mt-1">👉 At this stage, Git is NOT tracking anything yet</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Why This Matters (Practical Insight)</h3>
              <div class="p-3 bg-gray-800 rounded border border-gray-700">
                <p class="text-sm text-gray-300">Right now: You have a file, No history, No tracking. If deleted → gone forever.</p>
                <p class="text-sm text-[#00bceb] font-bold mt-2">👉 This is the problem Git solves</p>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <p class="text-sm text-gray-400 mb-2">Ask yourself:</p>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>What if this file breaks production?</li>
                <li>What if another developer edits it?</li>
                <li>What if I need yesterday’s version?</li>
              </ul>
              <p class="text-sm text-green-400 font-bold mt-2">💡 Version control is the safety net</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 3.1</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Why version control exists</li>
              <li>Why Git is mandatory for DevOps</li>
              <li>Real-world problems Git solves</li>
              <li>How Git fits into automation</li>
              <li>Prepared your system for Git usage</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Git Basics (Hands-On Oriented)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Understanding Git at a Beginner Level</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Git is a distributed version control system that allows developers and DevOps engineers to track, manage, and control changes made to source code over time. Unlike simple file storage, Git records every meaningful change in the project and preserves it as a permanent history.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In DevOps, Git acts as the <strong>single source of truth</strong>. Every automation process—whether it is CI/CD, container builds, or cloud deployment—starts with Git.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. What Happens Internally When You Use Git</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">When Git is initialized inside a project, it creates a hidden directory called <code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">.git</code>. This directory stores:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>The complete history of the project</li>
            <li>Metadata about commits</li>
            <li>Branch information</li>
            <li>Configuration details</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">The Three States of a File:</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Untracked</strong> – Git is not aware of the file</li>
            <li><strong>Staged</strong> – File is prepared to be saved</li>
            <li><strong>Committed</strong> – File is permanently stored in Git history</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Why Git Uses Commits Instead of Auto-Save</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In real software development, not every change is meaningful. Git uses <strong>commits</strong> to allow developers to group related changes together.</p>
          <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">Adding a login feature → one commit</p>
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">Fixing a bug → one commit</p>
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">Updating documentation → one commit</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Git as a Safety System in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Git is a risk management system. If a faulty change is deployed, teams can revert to a stable version.</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Jenkins pulls code from Git</li>
            <li>Docker builds images from Git repositories</li>
            <li>Kubernetes deployments reference Git commits</li>
            <li>Infrastructure code is versioned in Git</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-bold">👉 Git is the foundation layer of DevOps automation.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Beginner Mindset</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">As a beginner, treat Git as:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>A backup system for your code</li>
            <li>A journal of your learning progress</li>
            <li>A collaboration tool for future team projects</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Basic Git Commands',
            content: `git init | Initialize Git in a project
git status | Check file states
git add | Stage changes
git commit | Save changes permanently
git log | View commit history`
          },
          {
            title: 'Git File Lifecycle',
            content: 'Untracked → Staged → Committed\\n\\nUntracked: New file created\\nStaged: File added to commit list\\nCommitted: Stored safely in Git history'
          },
          {
            title: 'Commit Message Syntax',
            content: `git commit -m "Short, clear description"

Good: git commit -m "Add initial application file"
Bad: git commit -m "changes"`
          }
        ],
        terminalCommands: [
          'cd devops-git-demo',
          'git init',
          'git status',
          'git add app.txt',
          'git status',
          'git commit -m "Add initial app file"',
          'git log',
          'nano app.txt',
          'git status'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Initialize a repository and perform your first commit lifecycle.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Navigate to Your Project</h3>
              <p class="text-sm text-gray-400 mb-2">Go to the folder we created in the previous lesson.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd devops-git-demo</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Initialize Git Repository</h3>
              <p class="text-sm text-gray-400 mb-2">Turn this folder into a Git repository.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git init</code>
              <p class="text-sm text-gray-400 mt-2">✔ Output indicates Git repository initialized</p>
              <p class="text-sm text-gray-500 mt-1">📌 .git folder is created (hidden)</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Check Git Status</h3>
              <p class="text-sm text-gray-400 mb-2">See what Git sees.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
              <div class="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                Untracked files:<br>
                &nbsp;&nbsp;app.txt
              </div>
              <p class="text-sm text-yellow-500 mt-1">👉 Git sees the file but is not tracking it yet.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Stage the File</h3>
              <p class="text-sm text-gray-400 mb-2">Move file from "Untracked" to "Staged".</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add app.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
              <div class="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                Changes to be committed:<br>
                &nbsp;&nbsp;new file: app.txt
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Commit the File</h3>
              <p class="text-sm text-gray-400 mb-2">Permanently save the snapshot.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git commit -m "Add initial app file"</code>
              <p class="text-sm text-green-400 mt-2">✔ File is now permanently saved in Git history</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Verify Commit History</h3>
              <p class="text-sm text-gray-400 mb-2">View the log of what happened.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git log</code>
              <p class="text-sm text-gray-400 mt-2">👉 This is your first real Git checkpoint</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Make Another Change</h3>
              <p class="text-sm text-gray-400 mb-2">Edit the file and see how Git reacts.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">nano app.txt</code>
              <p class="text-xs text-gray-500 mb-2">Add text: "Learning Git basics for DevOps", then Save/Exit.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
              <p class="text-sm text-gray-400 mt-2">Observe how Git detects the modification.</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 3.2</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>How Git tracks files</li>
              <li>What staging and committing mean</li>
              <li>Why commits matter in DevOps</li>
              <li>How to create and verify Git history</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Git Workflow Explained',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Is a Git Workflow?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A Git workflow defines how code moves from a developer’s laptop into a shared repository and eventually into production systems. It is not just about commands—it is about discipline, order, and safety. In DevOps environments, a proper Git workflow ensures that automation pipelines run smoothly and production systems remain stable.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">At a beginner level, understanding Git workflow helps you avoid common mistakes like committing incomplete code, overwriting someone else’s work, or pushing broken changes into shared repositories.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. The Three Core Areas of Git Workflow</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Git workflow is built around three main areas where your code lives at different times:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Working Directory</strong></li>
            <li><strong>Staging Area</strong></li>
            <li><strong>Repository</strong></li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Each area serves a specific purpose and gives you control over what gets saved and when.</p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">1️⃣ Working Directory – Where You Actually Write Code</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The working directory is your normal project folder. This is where you create files, edit code, fix bugs, and experiment freely.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Git does not automatically track every change you make here. This allows you to experiment safely and decide later what is important.</p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">2️⃣ Staging Area – The Control Gate</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The staging area acts as a filter between your working directory and the repository. It allows you to select specific files, group related changes, and prepare a clean commit.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Think of the staging area as a shopping cart. You choose what goes in before checkout. This is extremely useful when multiple files are changed, but only some are ready.</p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">3️⃣ Repository – Permanent History</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The repository is where committed code lives permanently. Once code reaches this stage, it becomes part of project history, can trigger CI/CD pipelines, and can be deployed automatically.</p>
          <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-[#00bceb]">
            <p class="font-bold text-gray-700 dark:text-gray-300">📌 In DevOps, repository history = deployment history.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Visualizing the Git Workflow</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The basic Git workflow looks like this:</p>
          <div class="flex items-center justify-center space-x-2 mb-6 text-sm md:text-base font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <span class="text-gray-600 dark:text-gray-400">Edit Code</span>
            <span class="text-gray-400">→</span>
            <span class="text-blue-500 font-bold">Stage Changes</span>
            <span class="text-gray-400">→</span>
            <span class="text-green-500 font-bold">Commit</span>
            <span class="text-gray-400">→</span>
            <span class="text-purple-500 font-bold">Automate</span>
            <span class="text-gray-400">→</span>
            <span class="text-orange-500 font-bold">Deploy</span>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Why Git Workflow Matters in Teams</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Fewer production bugs</li>
            <li>Faster debugging</li>
            <li>Clean automation pipelines</li>
            <li>Reliable releases</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Without a workflow, Git becomes chaotic instead of helpful.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Beginner-Friendly Workflow You Will Follow</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">As a beginner, you should follow this simple but professional workflow:</p>
          <ol class="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Make small changes</li>
            <li>Check status</li>
            <li>Stage only required files</li>
            <li>Commit with a clear message</li>
            <li>Repeat frequently</li>
          </ol>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Git Workflow Stages',
            content: `Stage | Description
Working Directory | Where files are edited
Staging Area | Files prepared for commit
Repository | Permanent version history`
          },
          {
            title: 'Commands Used in Workflow',
            content: `Command | Used In
git status | Check current state
git add | Move changes to staging
git commit | Save changes to repo
git log | View history`
          },
          {
            title: 'Workflow Syntax Representation',
            content: `git add <file>
git commit -m "meaningful message"`
          },
          {
            title: 'Professional Commit Message Pattern',
            content: `<action> <what> <why>

Example:
Fix login validation to prevent empty input`
          }
        ],
        terminalCommands: [
          'cd devops-git-demo',
          'git status',
          'nano app.txt',
          'git status',
          'git add app.txt',
          'git status',
          'git commit -m "Add note about Git workflow"',
          'git log --oneline'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice the standard Git workflow: Edit → Stage → Commit.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Enter the Project Directory</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd devops-git-demo</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Check Current Git State</h3>
              <p class="text-sm text-gray-400 mb-2">See what's happening before making changes.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
              <p class="text-sm text-gray-400 mt-2">Observe if there are any modified files or unstaged changes.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Make a New Change</h3>
              <p class="text-sm text-gray-400 mb-2">Edit the file to simulate work.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">nano app.txt</code>
              <p class="text-xs text-gray-500 mb-2">Add text: "Understanding Git workflow", then Save (Ctrl+O) and Exit (Ctrl+X).</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Check Status Again</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
              <div class="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                modified: app.txt
              </div>
              <p class="text-sm text-yellow-500 mt-1">👉 The file is modified but not staged (Working Directory).</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Stage the Change</h3>
              <p class="text-sm text-gray-400 mb-2">Move the change to the Staging Area.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add app.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
              <p class="text-sm text-green-400 mt-2">👉 The change is now ready to be committed (Staging Area).</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Commit the Change</h3>
              <p class="text-sm text-gray-400 mb-2">Save the snapshot to the Repository.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git commit -m "Add note about Git workflow"</code>
              <p class="text-sm text-green-400 mt-2">✔ Change is saved in the repository history.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: View Commit History</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git log --oneline</code>
              <p class="text-sm text-gray-400 mt-2">Shows a clean, readable history of your commits.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Would this commit break a pipeline?</li>
                <li>Is the message clear enough for my team?</li>
                <li>Can I roll back safely?</li>
              </ul>
              <p class="text-sm text-green-400 font-bold mt-2">👉 This mindset is what companies expect.</p>
            </div>
          </div>
        `
      },
      {
        title: 'Working with Remote Repositories',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Is a Remote Repository?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A remote repository is a Git repository that is stored on a remote server instead of your local machine. In real-world DevOps environments, this remote repository acts as the central collaboration point for the entire team. Platforms like GitHub, GitLab, and Bitbucket host these repositories and make it possible for developers and DevOps engineers to work together from different locations.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">While your local repository is private to your system, a remote repository is shared. This shared nature allows teams to build automation around it, such as CI/CD pipelines, automated testing, and deployments.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why Remote Repositories Are Critical in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps is built on automation and collaboration. Remote repositories are the trigger point for most automated processes. Whenever code is pushed to a remote repository:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>CI pipelines start automatically</li>
            <li>Build tools fetch the latest code</li>
            <li>Docker images are generated</li>
            <li>Deployments are executed</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Without a remote repository, DevOps automation cannot exist.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Local vs Remote Repository (Beginner Clarity)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Local Repository</h3>
              <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                <li>Lives on your laptop</li>
                <li>Used for development and testing</li>
                <li>Works offline</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Remote Repository</h3>
              <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                <li>Lives on a server</li>
                <li>Used for collaboration</li>
                <li>Triggers automation</li>
                <li>Acts as backup</li>
              </ul>
            </div>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300 font-bold">👉 Both are equally important and work together.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Understanding the origin Remote</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In Git, a remote repository is usually referenced by a name. The most common name is <code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">origin</code>.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">origin is simply a shortcut name for the remote repository URL.</p>
          <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">origin → https://github.com/company/project.git</p>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This makes commands easier and cleaner.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Push and Pull: Two Core Operations</h2>
          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Push</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Sends your local commits to the remote repository</li>
            <li>Makes your work available to others</li>
            <li>Triggers CI/CD pipelines</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Pull</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Fetches changes from the remote repository</li>
            <li>Keeps your local copy up to date</li>
            <li>Prevents conflicts</li>
          </ul>
          <div class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500">
            <p class="text-gray-700 dark:text-gray-300">📌 <strong>Golden Rule:</strong> Always pull before you push in team environments.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Real DevOps Scenario</h2>
          <ol class="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Developers commit locally</li>
            <li>Code is pushed to GitHub/GitLab</li>
            <li>Jenkins detects changes</li>
            <li>Build and tests run</li>
            <li>Deployment happens automatically</li>
          </ol>
          <p class="mb-4 text-gray-700 dark:text-gray-300 font-bold">👉 Remote repository is the bridge between development and operations.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Remote Repository Commands',
            content: `Command | Purpose
git remote -v | View remote repositories
git remote add | Connect local repo to remote
git push | Send commits to remote
git pull | Get latest changes`
          },
          {
            title: 'Basic Push Syntax',
            content: `git push origin main

origin → remote name
main → branch name`
          },
          {
            title: 'Basic Pull Syntax',
            content: `git pull origin main`
          },
          {
            title: 'Typical Remote Workflow',
            content: `Edit → Commit → Pull → Push → Automate`
          }
        ],
        terminalCommands: [
          'cd devops-git-demo',
          'git status',
          'git remote -v',
          'git remote add origin https://github.com/your-username/devops-git-demo.git',
          'git remote -v',
          'git push -u origin main',
          'git pull origin main',
          'git status'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Connect your local repository to a remote server and practice push/pull operations.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Verify Local Repository</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">cd devops-git-demo</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Check Existing Remotes</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git remote -v</code>
              <p class="text-sm text-gray-400 mt-2">If empty, no remote is connected yet.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Add a Remote Repository</h3>
              <p class="text-sm text-gray-400 mb-2">Connect to a remote server (using a demo URL for practice).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git remote add origin https://github.com/your-username/devops-git-demo.git</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Verify Remote Connection</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git remote -v</code>
              <div class="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                origin https://github.com/your-username/devops-git-demo.git (fetch)<br>
                origin https://github.com/your-username/devops-git-demo.git (push)
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Push Code to Remote</h3>
              <p class="text-sm text-gray-400 mb-2">Send your commits to the server.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push -u origin main</code>
              <p class="text-sm text-gray-400 mt-2">👉 <strong>-u</strong> sets upstream so future pushes are easier.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Simulate Team Update (Pull)</h3>
              <p class="text-sm text-gray-400 mb-2">Fetch the latest changes from the server.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git pull origin main</code>
              <p class="text-sm text-green-400 mt-2">✔ Ensures your local repository is synced.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Real-World Discipline</h3>
              <p class="text-sm text-gray-400 mb-2">Before every push, follow this sequence:</p>
              <div class="bg-black/50 p-2 rounded text-green-400 font-mono text-sm">
                git pull<br>
                git status<br>
                git push
              </div>
              <p class="text-sm text-yellow-500 mt-2">👉 This habit prevents conflicts and broken pipelines.</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 3.4</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>What remote repositories are</li>
              <li>Difference between local and remote Git</li>
              <li>Why remotes are essential for DevOps</li>
              <li>How push and pull work</li>
              <li>Hands-on experience with remote commands</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Branching (Beginner Level)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Is a Branch in Git?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A branch in Git is an independent line of development. It allows you to work on a new feature, fix a bug, or experiment with changes without affecting the main codebase. In simple terms, branching lets multiple versions of the same project exist at the same time.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In real companies, no one directly works on the main code. Every change happens in a branch. This protects the application from accidental breakage and allows teams to work safely in parallel.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why Branching Is Mandatory in Real Projects</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Branching is not optional in professional environments. It is mandatory because:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Multiple developers work simultaneously</li>
            <li>Features take time to complete</li>
            <li>Bugs must be fixed urgently</li>
            <li>Production code must remain stable</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Without branches, one wrong change can break the entire system and stop deployments.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300 font-bold">👉 Branches are safety zones.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Understanding the main Branch</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The <code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">main</code> branch represents:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Stable code</li>
            <li>Production-ready state</li>
            <li>Deployment source</li>
          </ul>
          <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-[#00bceb]">
            <p class="font-bold text-gray-700 dark:text-gray-300">DevOps pipelines usually deploy code only from the main branch. This means any code in main must be tested, and incomplete features must never enter main.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Feature Branch Concept (Beginner Friendly)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A feature branch is created for a specific task, such as adding a login feature, updating UI, or fixing a bug. Each feature branch starts from main, is developed independently, and is merged back after completion.</p>
          <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">Example Branch Names:</h4>
            <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 font-mono text-sm space-y-1">
              <li>feature-login</li>
              <li>bugfix-auth</li>
              <li>update-readme</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. How Branching Helps DevOps Automation</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In DevOps workflows:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Feature branches</strong> → testing</li>
            <li><strong>Main branch</strong> → deployment</li>
            <li><strong>Tags</strong> → releases</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">CI tools can be configured to run tests on every branch but deploy only when main is updated. This keeps automation clean and predictable.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Beginner Branching Workflow (Simple & Safe)</h2>
          <div class="flex items-center justify-center space-x-2 mb-6 text-sm md:text-base font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <span class="text-gray-600 dark:text-gray-400">Main</span>
            <span class="text-gray-400">→</span>
            <span class="text-blue-500 font-bold">New Branch</span>
            <span class="text-gray-400">→</span>
            <span class="text-green-500 font-bold">Commit</span>
            <span class="text-gray-400">→</span>
            <span class="text-purple-500 font-bold">Merge Back</span>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This workflow avoids broken code and prepares students for real company practices.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Branch Commands',
            content: `Command | Purpose
git branch | List branches
git branch <name> | Create new branch
git checkout <name> | Switch branch
git checkout -b <name> | Create & switch
git merge <name> | Merge branch`
          },
          {
            title: 'Branch Naming Pattern',
            content: `feature-<feature-name>
bugfix-<issue-name>

Examples:
feature-login
bugfix-header`
          },
          {
            title: 'Visual Branch Flow',
            content: `main
 └── feature-login
        └── commit changes
              └── merge to main`
          }
        ],
        terminalCommands: [
          'git branch',
          'git checkout -b feature-workflow',
          'git branch',
          'nano app.txt',
          'git add app.txt',
          'git commit -m "Add feature branch content"',
          'git checkout main',
          'cat app.txt',
          'git merge feature-workflow',
          'git branch -d feature-workflow'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Create a feature branch, make changes safely, and merge them back to main.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Confirm Current Branch</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git branch</code>
              <div class="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                * main
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create a Feature Branch</h3>
              <p class="text-sm text-gray-400 mb-2">Create and switch to a new branch for safe development.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git checkout -b feature-workflow</code>
              <p class="text-sm text-green-400 mt-2">✔ Branch created and switched.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Verify Branch</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git branch</code>
              <div class="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                * feature-workflow<br>
                &nbsp;&nbsp;main
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Make Changes in Feature Branch</h3>
              <p class="text-sm text-gray-400 mb-2">Edit the file. These changes are isolated.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">nano app.txt</code>
              <p class="text-xs text-gray-500 mb-2">Add text: "This change is inside a feature branch", then Save/Exit.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Commit Changes</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add app.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git commit -m "Add feature branch content"</code>
              <p class="text-sm text-yellow-500 mt-2">👉 This commit exists ONLY in feature-workflow branch.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Switch Back to Main</h3>
              <p class="text-sm text-gray-400 mb-2">Return to the stable branch.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git checkout main</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cat app.txt</code>
              <p class="text-sm text-gray-400 mt-2">Notice: Feature branch changes are NOT here.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Merge Feature Branch into Main</h3>
              <p class="text-sm text-gray-400 mb-2">Bring the feature into the main codebase.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git merge feature-workflow</code>
              <p class="text-sm text-green-400 mt-2">✔ Changes are now in main.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Clean Up Branch (Optional)</h3>
              <p class="text-sm text-gray-400 mb-2">Delete the branch after merging.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git branch -d feature-workflow</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 9: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Is this branch tested?</li>
                <li>Is main branch stable?</li>
                <li>Will this trigger deployment?</li>
              </ul>
              <p class="text-sm text-green-400 font-bold mt-2">👉 This thinking separates beginners from professionals.</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 3.5</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>What Git branches are</li>
              <li>Why branching is mandatory</li>
              <li>How feature branches work</li>
              <li>Safe development practices</li>
              <li>Real-world branching workflow</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Git Best Practices',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why Git Best Practices Matter</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Git is powerful, but poor usage can make a project messy and dangerous. In DevOps environments, Git repositories are not just code storage—they are automation triggers. A single bad commit can break a CI/CD pipeline, cause deployment failures, or even bring down production systems.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Git best practices exist to ensure clean project history, easy debugging, safe collaboration, and reliable automation.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Commit Often, but Commit Meaningfully</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">One of the most important Git habits is frequent and meaningful commits. Each commit should represent a logical unit of work, not a random collection of changes.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Good Commits</h3>
              <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                <li>Are small</li>
                <li>Solve one problem</li>
                <li>Are easy to understand</li>
              </ul>
            </div>
            <div class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Bad Commits</h3>
              <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                <li>Contain unrelated changes</li>
                <li>Have unclear messages</li>
                <li>Are too large</li>
              </ul>
            </div>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300 font-bold">📌 In DevOps, clean commits = safe rollbacks.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Writing Professional Commit Messages</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A commit message is not a formality—it is documentation. A good commit message starts with an action verb, explains what and why, and is short and clear.</p>
          <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p class="font-mono text-sm text-green-600 dark:text-green-400">✅ Add input validation to login form</p>
            <p class="font-mono text-sm text-red-600 dark:text-red-400 mt-2">❌ update, fix, changes</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Never Commit What Should Not Be Tracked</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Not everything belongs in Git. Some files must always be excluded to protect security and keep repositories clean.</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Passwords</li>
            <li>API keys</li>
            <li>Environment variables</li>
            <li>Build output files</li>
            <li>Logs</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Use .gitignore Correctly</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The <code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">.gitignore</code> file tells Git which files to ignore completely. This is critical in DevOps because build tools generate temporary files and logs change frequently.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Pull Before You Push</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In team environments, always pull latest changes, resolve conflicts if any, and then push your commits. This avoids overwriting others’ work and broken builds.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300 font-bold">📌 This rule is non-negotiable in companies.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Git Best Practices in DevOps Pipelines</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In DevOps, CI tools trust Git history. Automation relies on commit clarity, and rollbacks depend on clean commits. Bad Git habits lead to unreliable pipelines.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Commit Message Pattern',
            content: `<Action> <what changed> <why>

Examples:
Fix API timeout issue in user service
Add Docker ignore file for build optimization`
          },
          {
            title: '.gitignore Example Syntax',
            content: `node_modules/
.env
*.log
dist/`
          },
          {
            title: 'Safe Git Workflow Pattern',
            content: `git pull
git status
git add
git commit
git push`
          },
          {
            title: 'Commands You Should Use Daily',
            content: `Command | Purpose
git status | Check repo state
git log | Review history
git diff | See changes
git pull | Sync with remote
git push | Share changes`
          }
        ],
        terminalCommands: [
          'nano .gitignore',
          'git status',
          'git add .gitignore',
          'git commit -m "Add gitignore for logs and env files"',
          'git log --oneline',
          'echo "password=1234" > secret.txt',
          'git status',
          'rm secret.txt',
          'git pull',
          'git push'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice professional Git habits: ignoring sensitive files, writing clean commits, and safe syncing.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create .gitignore File</h3>
              <p class="text-sm text-gray-400 mb-2">Define what Git should ignore.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">nano .gitignore</code>
              <p class="text-xs text-gray-500 mb-2">Add the following lines, then Save/Exit:</p>
              <div class="bg-gray-800 p-2 rounded text-xs text-gray-300 font-mono mb-2">
                .env<br>
                *.log<br>
                node_modules/
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Check Git Status</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
              <p class="text-sm text-gray-400 mt-2">Notice: .gitignore is untracked.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Commit .gitignore</h3>
              <p class="text-sm text-gray-400 mb-2">Save your ignore rules.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add .gitignore</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git commit -m "Add gitignore for logs and env files"</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: View Commit History</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git log --oneline</code>
              <p class="text-sm text-gray-400 mt-2">Observe clean, readable history.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Simulate a Bad Practice</h3>
              <p class="text-sm text-gray-400 mb-2">Create a sensitive file (for learning purposes).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">echo "password=1234" > secret.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git status</code>
              <p class="text-sm text-red-500 font-bold mt-2">👉 DO NOT COMMIT THIS FILE</p>
              <p class="text-sm text-gray-400 mt-1">Remove it immediately:</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">rm secret.txt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Pull Before Push</h3>
              <p class="text-sm text-gray-400 mb-2">Form the habit of syncing before sharing.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git pull</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a Professional</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Is this commit safe for production?</li>
                <li>Is the message understandable?</li>
                <li>Can CI/CD trust this commit?</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 3.6</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Why clean commits matter for DevOps</li>
              <li>How to write professional commit messages</li>
              <li>How to use .gitignore to protect secrets</li>
              <li>The "Pull Before Push" safety rule</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Git in Team Environments',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why Git Changes When You Work in a Team</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Working alone with Git is simple. Working in a team is completely different. In real companies, multiple developers and DevOps engineers work on the same repository at the same time. This introduces challenges like overlapping changes, conflicting edits, and coordination issues.</p>
          <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Git in team environments is designed to:</h3>
            <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
              <li>Prevent developers from overwriting each other’s work</li>
              <li>Maintain a clean and reliable history</li>
              <li>Support automated testing and deployment</li>
              <li>Enable safe collaboration at scale</li>
            </ul>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Without proper team practices, Git quickly becomes chaotic.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. The Concept of Shared Responsibility</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In a team setup, the repository is a shared asset. Every commit you make affects other developers, CI/CD pipelines, and production systems. This means Git usage is no longer personal—it is collective responsibility.</p>
          <div class="mb-6 p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <p class="font-bold text-yellow-800 dark:text-yellow-200">📌 In DevOps, one careless commit can break everyone’s pipeline.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. How Teams Collaborate Using Git</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In professional environments, teams do not directly edit each other’s code. Instead, they follow a structured flow:</p>
          <ol class="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Clone the shared repository</li>
            <li>Create personal or feature branches</li>
            <li>Make changes independently</li>
            <li>Push changes to the remote repository</li>
            <li>Merge changes safely</li>
          </ol>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This approach ensures parallel development without interference.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Understanding Merge Conflicts (Beginner Friendly)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A merge conflict happens when two people modify the same line of a file and Git cannot decide which change is correct. Conflicts are not errors—they are decision points. Git pauses and asks the developer to manually choose what should remain.</p>
          <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 class="font-bold text-red-700 dark:text-red-300 mb-2">Conflicts happen when:</h4>
              <ul class="list-disc pl-5 text-sm text-red-600 dark:text-red-400">
                <li>Editing same lines</li>
                <li>Deleting files others edited</li>
              </ul>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 class="font-bold text-green-700 dark:text-green-300 mb-2">Avoid conflicts by:</h4>
              <ul class="list-disc pl-5 text-sm text-green-600 dark:text-green-400">
                <li>Communicating before large changes</li>
                <li>Pulling frequently</li>
                <li>Keeping commits small</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Role of Code Reviews</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In most teams, code is reviewed before merging into main. This ensures code quality, security checks, and consistent standards. Even at a beginner level, understanding this concept prepares students for real company workflows.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Git in DevOps Teams</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps teams rely on Git for infrastructure code (Terraform), configuration management, deployment scripts, and monitoring configurations. Because Git triggers automation, team discipline directly affects system reliability.</p>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Team Collaboration Commands',
            content: `Command | Purpose
git clone | Copy shared repository
git pull | Sync latest changes
git push | Share your commits
git fetch | Check updates without merging
git merge | Combine team changes`
          },
          {
            title: 'Typical Team Workflow',
            content: `git pull
git checkout -b feature-name
git add .
git commit -m "Message"
git push origin feature-name`
          },
          {
            title: 'Conflict Markers',
            content: `<<<<<<< HEAD
Your change
=======
Teammate’s change
>>>>>>> branch-name`
          }
        ],
        terminalCommands: [
          'git clone https://github.com/your-username/devops-git-demo.git',
          'cd devops-git-demo',
          'git pull origin main',
          'git checkout -b team-update',
          'nano app.txt',
          'git add app.txt',
          'git commit -m "Add team collaboration note"',
          'git push origin team-update',
          'git checkout main',
          'git pull',
          'git merge team-update',
          'git branch -d team-update'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Simulate a real team workflow: cloning, branching, pushing, and safe merging.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Clone Shared Repository</h3>
              <p class="text-sm text-gray-400 mb-2">Start with a fresh copy of the code.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git clone https://github.com/your-username/devops-git-demo.git</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">cd devops-git-demo</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Pull Latest Changes</h3>
              <p class="text-sm text-gray-400 mb-2">Always sync before starting work.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git pull origin main</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create Team Feature Branch</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git checkout -b team-update</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Make a Change</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">nano app.txt</code>
              <div class="bg-gray-800 p-2 rounded text-xs text-gray-300 font-mono mt-2 mb-2">
                Add line:<br>
                This line was added in a team branch
              </div>
              <p class="text-xs text-gray-500">Save (Ctrl+O) and Exit (Ctrl+X).</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Commit & Push</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add app.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git commit -m "Add team collaboration note"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push origin team-update</code>
              <p class="text-sm text-green-400 font-bold mt-2">👉 Now your teammates can see your work.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Simulate Safe Merge</h3>
              <p class="text-sm text-gray-400 mb-2">Switch to main and pull before merging (simulating a safe workflow).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git checkout main</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git pull</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git merge team-update</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Clean Up</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git branch -d team-update</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Team Discipline Check</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Did I pull before pushing?</li>
                <li>Is my commit message clear?</li>
                <li>Will this affect CI/CD?</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 3.7</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>How to use Git in a team environment</li>
              <li>The importance of "Pull before Push"</li>
              <li>How to handle feature branches and merges safely</li>
              <li>Understanding collective responsibility in DevOps</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Hands-On: Git Collaboration',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Objective of This Hands-On Session</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This hands-on session simulates a real company Git collaboration scenario. You will act as a developer working in a team where multiple people modify the same project, code is shared using a remote repository, changes must be merged safely, and conflicts may occur and must be resolved.</p>
          <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-[#00bceb]">
            <p class="font-bold text-gray-700 dark:text-gray-300">The goal is not just to use commands, but to think like a team-ready DevOps engineer.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Real-World Collaboration Scenario</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Imagine you are working in a company where one developer updates application text and another developer updates configuration. Both push changes to the same repository.</p>
          <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">If Git is used correctly:</h3>
            <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
              <li>No work is lost</li>
              <li>Changes are combined safely</li>
              <li>CI/CD pipelines continue working</li>
            </ul>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300 font-bold">This session teaches you that exact workflow.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. What You Will Practice</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">By the end of this hands-on, you will:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Work with feature branches</li>
            <li>Push changes to a remote repository</li>
            <li>Pull teammate changes</li>
            <li>Resolve a merge conflict</li>
            <li>Complete a full collaboration cycle</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 italic">This is mandatory knowledge for DevOps beginners.</p>
        `,
        duration: '30 min',
        syntax: [
          {
            title: 'End-to-End Collaboration Flow',
            content: 'Clone → Branch → Edit → Commit → Push → Pull → Merge'
          },
          {
            title: 'Commands Used in This Lab',
            content: `Command | Purpose
git clone | Get shared repository
git checkout -b | Create feature branch
git add | Stage changes
git commit | Save changes
git push | Share branch
git pull | Get teammate updates
git merge | Combine changes`
          },
          {
            title: 'Conflict Resolution Keywords',
            content: `<<<<<<< HEAD
=======
>>>>>>>

These markers must be manually resolved.`
          }
        ],
        terminalCommands: [
          'git clone https://github.com/your-username/devops-git-demo.git',
          'cd devops-git-demo',
          'git checkout -b feature-message',
          'nano app.txt',
          'git add app.txt',
          'git commit -m "Add feature message from developer 1"',
          'git push origin feature-message',
          'git checkout main',
          'git pull',
          'git checkout -b feature-config',
          'nano app.txt',
          'git add app.txt',
          'git commit -m "Add feature message from developer 2"',
          'git push origin feature-config',
          'git checkout main',
          'git merge feature-message',
          'git merge feature-config',
          'nano app.txt',
          'git add app.txt',
          'git commit -m "Resolve merge conflict between feature branches"',
          'git branch -d feature-message',
          'git branch -d feature-config',
          'git push origin main'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Simulate a full team collaboration cycle with conflicts and resolution.</p>
          <div class="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-200 text-sm">
            ⚠️ Important: Follow every step in order to simulate the conflict correctly.
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">🔹 PART A: Developer 1 – Feature Update</h3>
              <p class="text-sm text-gray-400 mb-2">Step 1: Clone the Repository</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git clone https://github.com/your-username/devops-git-demo.git</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd devops-git-demo</code>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 2: Create Feature Branch</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git checkout -b feature-message</code>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 3: Edit the File</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">nano app.txt</code>
              <div class="bg-gray-800 p-2 rounded text-xs text-gray-300 font-mono mt-2 mb-2">
                Add line:<br>
                Feature branch update by Developer 1
              </div>
              <p class="text-xs text-gray-500">Save (Ctrl+O) and Exit (Ctrl+X).</p>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 4: Commit & Push</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add app.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git commit -m "Add feature message from developer 1"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push origin feature-message</code>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-700">
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">🔹 PART B: Developer 2 – Conflicting Update</h3>
              <p class="text-sm text-gray-400 mb-2">Step 6: Switch to Main (Simulate teammate)</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git checkout main</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git pull</code>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 7: Create Another Branch</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git checkout -b feature-config</code>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 8: Edit the Same File (Conflict Setup)</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">nano app.txt</code>
              <div class="bg-gray-800 p-2 rounded text-xs text-gray-300 font-mono mt-2 mb-2">
                Modify the SAME line to:<br>
                Feature branch update by Developer 2
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 9: Commit & Push</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add app.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git commit -m "Add feature message from developer 2"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push origin feature-config</code>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-700">
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">🔹 PART C: Merging & Conflict Resolution</h3>
              <p class="text-sm text-gray-400 mb-2">Step 10: Merge First Branch (Success)</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git checkout main</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git merge feature-message</code>
              <p class="text-sm text-green-400 font-bold mt-2">✔ This merge should succeed.</p>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 11: Merge Second Branch (Conflict!)</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git merge feature-config</code>
              <p class="text-sm text-red-500 font-bold mt-2">❗ Git reports a merge conflict.</p>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 12: Resolve Conflict</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">nano app.txt</code>
              <div class="bg-gray-800 p-2 rounded text-xs text-gray-300 font-mono mt-2 mb-2">
                You will see conflict markers.<br>
                Edit the file to keep both lines or choose one.<br>
                Remove &lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt; markers.
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-400 mb-2">Step 14: Complete the Merge</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add app.txt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git commit -m "Resolve merge conflict between feature branches"</code>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-700">
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">🔹 PART D: Cleanup</h3>
              <p class="text-sm text-gray-400 mb-2">Step 15: Delete Branches & Push</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git branch -d feature-message</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git branch -d feature-config</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push origin main</code>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 3.8</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Full Git collaboration lifecycle</li>
              <li>Working with multiple branches</li>
              <li>Pushing and pulling team changes</li>
              <li>Understanding and resolving conflicts</li>
              <li>Real DevOps team workflow simulation</li>
            </ul>
          </div>
        `
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Module 4 — Build Tools & CI Basics',
    duration: '1 week',
    description: 'Understand build automation with Maven/MSBuild and continuous integration with Jenkins.',
    lessons: [
      {
        title: 'What is a Build Tool?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why Build Tools Exist (The Real Problem)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In the early days of software development, developers manually compiled code, copied files, and packaged applications. This worked when applications were small and teams were tiny. But modern applications are:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Large</li>
            <li>Multi-module</li>
            <li>Dependent on external libraries</li>
            <li>Built and deployed multiple times a day</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Manual building quickly becomes slow, error-prone, and impossible to scale.</p>
          <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <p class="font-bold text-gray-900 dark:text-white">👉 Build tools were created to automate this entire process.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. What Is a Build Tool? (Clear & Practical Definition)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A build tool is software that automates the process of converting source code into a runnable or deployable application.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This includes:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Compiling source code</li>
            <li>Downloading dependencies</li>
            <li>Running tests</li>
            <li>Packaging the application</li>
            <li>Preparing it for deployment</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In DevOps, build tools are not optional. They are a core automation component.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. What Happens During a Build (Beginner-Friendly Explanation)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">When a build tool runs, it performs a sequence of actions:</p>
          <ol class="list-decimal pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Reads project configuration</li>
            <li>Resolves required libraries</li>
            <li>Compiles the code (if needed)</li>
            <li>Runs automated tests</li>
            <li>Creates output artifacts (JAR, WAR, EXE, etc.)</li>
          </ol>
          <p class="mb-4 text-gray-700 dark:text-gray-300">All of this happens with a single command. Without a build tool, each of these steps would require manual effort and deep technical knowledge.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Why Build Tools Are Critical in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps focuses on speed, reliability, and repeatability. Build tools ensure:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Builds are consistent across environments</li>
            <li>Applications are reproducible</li>
            <li>Automation pipelines are reliable</li>
            <li>Human errors are minimized</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">CI tools like Jenkins depend on build tools to function. Jenkins does not know how to build an application—it simply executes build tool commands.</p>
          <div class="mb-6 p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <p class="font-bold text-yellow-800 dark:text-yellow-200">📌 No build tool = No CI/CD pipeline</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Real-World Example (Simple Scenario)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Imagine a Java application that uses 10 external libraries, has multiple source files, and needs to be tested before deployment.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 class="font-bold text-red-700 dark:text-red-300 mb-2">Without a Build Tool</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Developers manually download libraries</li>
                <li>Compile files individually</li>
                <li>Hope nothing breaks</li>
              </ul>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 class="font-bold text-green-700 dark:text-green-300 mb-2">With a Build Tool</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>One command builds everything</li>
                <li>Dependencies are handled automatically</li>
                <li>Output is ready for deployment</li>
              </ul>
            </div>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This is why companies never build applications manually.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Common Build Tools Used in Industry</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Depending on the technology stack:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Maven</strong> → Java</li>
            <li><strong>Gradle</strong> → Java, Kotlin</li>
            <li><strong>MSBuild</strong> → .NET</li>
            <li><strong>npm / yarn</strong> → JavaScript</li>
            <li><strong>Make</strong> → C/C++</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In this module, we focus on concepts first, then Maven and MSBuild, aligned with DevOps beginner needs.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Build Tools vs CI Tools (Important Distinction)</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300 border-collapse">
              <thead>
                <tr class="bg-gray-200 dark:bg-gray-700">
                  <th class="p-2 border border-gray-300 dark:border-gray-600">Build Tool</th>
                  <th class="p-2 border border-gray-300 dark:border-gray-600">CI Tool</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-2 border border-gray-300 dark:border-gray-600">Builds the application</td>
                  <td class="p-2 border border-gray-300 dark:border-gray-600">Automates the build process</td>
                </tr>
                <tr>
                  <td class="p-2 border border-gray-300 dark:border-gray-600">Runs locally</td>
                  <td class="p-2 border border-gray-300 dark:border-gray-600">Runs on servers</td>
                </tr>
                <tr>
                  <td class="p-2 border border-gray-300 dark:border-gray-600">Example: Maven</td>
                  <td class="p-2 border border-gray-300 dark:border-gray-600">Example: Jenkins</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-bold">👉 CI tools call build tools. They do not replace them.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. DevOps Mindset (Beginner Takeaway)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">As a DevOps engineer:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>You don’t manually build apps</li>
            <li>You automate builds</li>
            <li>You ensure builds are repeatable</li>
            <li>You integrate build tools with CI/CD</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 italic">This mindset is essential for real jobs.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Build Tool Workflow (Conceptual)',
            content: 'Source Code → Build Tool → Artifact → Deployment'
          },
          {
            title: 'Key Build Terminology',
            content: `Term | Meaning
Source Code | Developer-written code
Dependency | External library
Artifact | Final output (JAR, WAR, EXE)
Build Script | Configuration file
Build Lifecycle | Sequence of build steps`
          },
          {
            title: 'Generic Build Command Pattern',
            content: `build-tool-command build

Examples:
mvn package
npm run build
dotnet build`
          },
          {
            title: 'Where Build Tools Fit in DevOps Pipeline',
            content: 'Git → Build Tool → CI → Docker → Cloud'
          }
        ],
        terminalCommands: [
          'mkdir build-tool-demo',
          'cd build-tool-demo',
          'nano app.txt',
          'cp app.txt app-build.txt'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">This lab builds conceptual clarity, not language-specific complexity. You will simulate a manual build to understand why automation is needed.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create a Sample Project Folder</h3>
              <p class="text-sm text-gray-400 mb-2">Create a dedicated directory.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mkdir build-tool-demo</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">cd build-tool-demo</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create a Sample Source File</h3>
              <p class="text-sm text-gray-400 mb-2">Create a file to represent source code.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">nano app.txt</code>
              <p class="text-xs text-gray-500 mb-1">Type inside:</p>
              <pre class="bg-gray-800 p-2 rounded text-gray-300 text-xs mb-2">This file represents source code.</pre>
              <p class="text-xs text-gray-500">Save and exit (CTRL + X, then Y, then Enter)</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Simulate Manual Build (Why It’s Bad)</h3>
              <p class="text-sm text-gray-400 mb-2">Manually copy the file to simulate a build artifact.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cp app.txt app-build.txt</code>
              <p class="text-sm text-yellow-500 mt-2">👉 This is a manual build simulation</p>
              <div class="mt-2 p-3 bg-red-900/20 rounded border border-red-500/30">
                <p class="text-sm text-red-300 font-bold mb-1">Problems:</p>
                <ul class="list-disc pl-5 text-xs text-red-200 space-y-1">
                  <li>No automation</li>
                  <li>No history</li>
                  <li>No consistency</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Understand Automation Need</h3>
              <div class="p-3 bg-gray-800 rounded border border-gray-700">
                <p class="text-sm text-gray-300 mb-2">Imagine you have:</p>
                <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                  <li>100 files</li>
                  <li>10 dependencies</li>
                  <li>5 environments</li>
                </ul>
                <p class="text-sm text-[#00bceb] font-bold mt-3">👉 Manual builds do not scale. This is why build tools exist.</p>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Think Like a DevOps Engineer</h3>
              <p class="text-sm text-gray-400 mb-2">Ask yourself:</p>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Can this be automated?</li>
                <li>Can this be repeated?</li>
                <li>Can CI execute this?</li>
              </ul>
              <p class="text-sm text-green-400 font-bold mt-2">✅ If yes → use a build tool</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 4.1</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>What a build tool is</li>
              <li>Why manual builds fail</li>
              <li>Role of build tools in DevOps</li>
              <li>Difference between build tools and CI</li>
              <li>How build tools fit in pipelines</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Build Automation Concepts',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why Build Automation Matters</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In modern DevOps, manual builds are no longer acceptable. Applications are updated frequently, often multiple times a day. Manual builds introduce:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Human errors</li>
            <li>Inconsistency between environments</li>
            <li>Slower delivery</li>
            <li>Increased risk of failed deployments</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Build automation solves this by making builds repeatable, consistent, and predictable.</p>
          <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <p class="font-bold text-gray-900 dark:text-white">👉 Automation is not just about speed—it’s about reliability, which is the core principle of DevOps.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. What Is Build Automation?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Build automation is the process of automatically converting source code into deployable artifacts using tools and scripts. It includes:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Compiling code</li>
            <li>Resolving dependencies</li>
            <li>Running unit and integration tests</li>
            <li>Packaging the application</li>
            <li>Generating logs and reports</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Think of it as a factory assembly line for your code. Every step is pre-defined and predictable, ensuring no step is forgotten.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Key Components of Build Automation</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Build Scripts</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">These are files (like pom.xml for Maven or build.gradle for Gradle) that define how to build the project. They include instructions for compiling, testing, and packaging.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Dependencies</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Libraries your code relies on are automatically downloaded and included. Automation ensures all developers and servers use the same versions.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Environment Management</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Build automation ensures the application builds the same way on different machines, reducing "it works on my machine" problems.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Repeatability</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Each build is consistent. Every artifact can be traced back to a specific commit.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Why Automation Is a DevOps Principle</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">DevOps is all about fast, reliable delivery. Build automation ensures:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Continuous Integration (CI) pipelines work correctly</li>
            <li>Teams can merge code frequently without fear</li>
            <li>Testing and deployment happen automatically</li>
            <li>Rollbacks are easier with predictable builds</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Automation reduces human dependency and enables scaling—essential for real-world DevOps.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Real-World Example</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Imagine a Java project with 1000 source files and 50 external libraries that needs testing and packaging daily.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 class="font-bold text-red-700 dark:text-red-300 mb-2">Without Automation</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Developers spend hours compiling manually</li>
                <li>Errors occur frequently</li>
                <li>Deployments are inconsistent</li>
              </ul>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 class="font-bold text-green-700 dark:text-green-300 mb-2">With Automation</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>One command builds, tests, and packages</li>
                <li>CI servers can run builds on every push</li>
                <li>Artifacts are always reliable</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Build Automation Mindset</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">As a DevOps engineer:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>You must think automation first</li>
            <li>Always script repetitive tasks</li>
            <li>Build pipelines should be repeatable</li>
            <li>Manual intervention should be minimized</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-bold">👉 Automation is the backbone of DevOps workflows.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Typical Build Automation Workflow',
            content: 'Source Code → Build Script → Compile → Test → Package → Artifact → Deploy'
          },
          {
            title: 'Key Automation Commands (Conceptual)',
            content: `Command | Purpose
mvn clean install | Compile, test, and package in Maven
gradle build | Compile and package in Gradle
dotnet build | Compile .NET project
npm run build | Compile JS project
make | Compile C/C++ project`
          },
          {
            title: 'Build Script Concept',
            content: `pom.xml (Maven) or build.gradle (Gradle) defines automation steps

Automation scripts replace manual steps
Enables CI/CD integration`
          },
          {
            title: 'Automation Best Practices',
            content: `Keep scripts version-controlled
Make builds reproducible
Run automated tests during builds
Generate logs and artifacts`
          }
        ],
        terminalCommands: [
          'mkdir automation-demo',
          'cd automation-demo',
          'echo "print(\'Hello, DevOps Automation\')" > app.py',
          'cp app.py build/app.py',
          'nano build.sh',
          'chmod +x build.sh',
          './build.sh'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice to simulate automated build using a script vs manual steps.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create Sample Project Folder</h3>
              <p class="text-sm text-gray-400 mb-2">Set up your workspace.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mkdir automation-demo</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">cd automation-demo</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create Sample Source File</h3>
              <p class="text-sm text-gray-400 mb-2">Create a dummy application file.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">echo "print('Hello, DevOps Automation')" > app.py</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Simulate Manual Build</h3>
              <p class="text-sm text-gray-400 mb-2">Try to "build" it manually (by copying).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cp app.py build/app.py</code>
              <p class="text-sm text-red-400 mt-2">❌ Error: 'build' directory doesn't exist yet.</p>
              <p class="text-sm text-yellow-500 mt-1">👉 Notice: Manual steps are slow and error-prone.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Automate Build With Script</h3>
              <p class="text-sm text-gray-400 mb-2">Create a simple build script.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">nano build.sh</code>
              <p class="text-xs text-gray-500 mb-1">Add the following content:</p>
              <pre class="bg-gray-800 p-2 rounded text-gray-300 text-xs mb-2">#!/bin/bash
mkdir -p build
cp app.py build/
echo "Build completed successfully!"</pre>
              <p class="text-xs text-gray-500">Save and exit (CTRL + X, then Y, then Enter)</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Make Script Executable</h3>
              <p class="text-sm text-gray-400 mb-2">Grant permission to run the script.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">chmod +x build.sh</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Run Automated Build</h3>
              <p class="text-sm text-gray-400 mb-2">Run the automation script.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">./build.sh</code>
              <p class="text-sm text-gray-400 mt-2">Output:</p>
              <pre class="bg-black/30 p-2 rounded text-green-300 text-xs">Build completed successfully!</pre>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Observe Benefits</h3>
              <div class="p-3 bg-gray-800 rounded border border-gray-700">
                <ul class="list-disc pl-5 text-sm text-gray-300 space-y-1">
                  <li>Single command builds project</li>
                  <li>Safe and repeatable</li>
                  <li>Easy to integrate into CI/CD</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Think Like a DevOps Engineer</h3>
              <p class="text-sm text-gray-400 mb-2">Ask yourself:</p>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Can this build be run on any machine? ✅</li>
                <li>Can CI call this script automatically? ✅</li>
                <li>Is the build repeatable? ✅</li>
              </ul>
              <p class="text-sm text-green-400 font-bold mt-2">This is the core automation mindset.</p>
            </div>
          </div>
        `
      },
      {
        title: 'Introduction to Maven',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Is Maven?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Apache Maven is a popular build automation and project management tool for Java applications. It simplifies:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Building projects</li>
            <li>Managing dependencies</li>
            <li>Running tests</li>
            <li>Packaging applications</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Think of Maven as an automated factory for your Java project. You don’t have to manually compile code, download libraries, or package artifacts—Maven does it all.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why Maven Is Widely Used in DevOps</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Dependency Management</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Maven automatically downloads external libraries your project needs. Example: If your project uses JUnit for testing, Maven fetches it from a remote repository.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Standard Project Structure</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Maven enforces a uniform folder structure. Teams don’t waste time figuring out where files are located.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Build Lifecycle Management</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Maven has a predefined lifecycle: compile → test → package → deploy. Ensures repeatable builds, which is critical in DevOps pipelines.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Integration with CI/CD</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Maven commands are used by Jenkins, GitLab CI, and other tools to automate builds. Without Maven, automation pipelines become difficult to maintain.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Maven Basics (Beginner-Friendly)</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>POM (Project Object Model):</strong> The <code>pom.xml</code> file is Maven’s configuration file. It defines project name, version, dependencies, and plugins.</li>
            <li><strong>Repository:</strong> Maven uses a central repository (like a library warehouse) to download dependencies automatically.</li>
            <li><strong>Plugin System:</strong> Plugins extend Maven’s capabilities, e.g., running tests or creating reports.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. How Maven Fits in DevOps Pipeline</h2>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <p class="font-mono text-sm text-blue-800 dark:text-blue-300 mb-2">Git Repository → Maven Build → Artifact → CI/CD → Docker/Cloud Deployment</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">Developers commit to Git → Maven automatically builds and tests → Artifacts generated → CI/CD deploys them.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Real-World Example</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 class="font-bold text-red-700 dark:text-red-300 mb-2">Without Maven</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Manually download all jars</li>
                <li>Configure classpath</li>
                <li>Compile and test manually</li>
              </ul>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 class="font-bold text-green-700 dark:text-green-300 mb-2">With Maven</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Define dependencies in pom.xml</li>
                <li>Run <code>mvn package</code> → everything is automated</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Beginner Mindset</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Maven is your automation partner</li>
            <li>Treat <code>pom.xml</code> as the blueprint of your project</li>
            <li>Understand dependencies and build lifecycle</li>
            <li>Maven enables DevOps-ready CI/CD pipelines</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Basic Maven Commands',
            content: `Command | Purpose
mvn clean | Remove previous build files
mvn compile | Compile source code
mvn test | Run unit tests
mvn package | Package project into artifact (JAR/WAR)
mvn install | Install artifact locally
mvn clean install | Clean + compile + test + package + install`
          },
          {
            title: 'POM Example (Minimal)',
            content: `<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.devopsdemo</groupId>
    <artifactId>demo-app</artifactId>
    <version>1.0.0</version>
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>`
          },
          {
            title: 'Maven Lifecycle Summary',
            content: `Phase | Purpose
validate | Validate project structure
compile | Compile source code
test | Run automated tests
package | Create JAR/WAR file
install | Install artifact locally
deploy | Deploy artifact to remote repository`
          }
        ],
        terminalCommands: [
          'mvn -v',
          'mvn archetype:generate -DgroupId=com.devopsdemo -DartifactId=demo-app -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false',
          'cd demo-app',
          'nano pom.xml',
          'mvn compile',
          'mvn test',
          'mvn package'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice to understand Maven from scratch.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Maven Installation</h3>
              <p class="text-sm text-gray-400 mb-2">Verify Maven is installed and check the version.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn -v</code>
              <p class="text-sm text-gray-400 mt-2">Output should show Maven version, Java version, and OS info.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create a Maven Project</h3>
              <p class="text-sm text-gray-400 mb-2">Generate a new project using a template (archetype).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn archetype:generate -DgroupId=com.devopsdemo \\
-DartifactId=demo-app -DarchetypeArtifactId=maven-archetype-quickstart \\
-DinteractiveMode=false</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Navigate to Project Folder</h3>
              <p class="text-sm text-gray-400 mb-2">Go into the newly created directory.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd demo-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Examine POM File</h3>
              <p class="text-sm text-gray-400 mb-2">Look at the configuration file.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">nano pom.xml</code>
              <p class="text-sm text-gray-400">Observe project metadata and dependencies.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Compile Project</h3>
              <p class="text-sm text-gray-400 mb-2">Compile the source code.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn compile</code>
              <p class="text-sm text-gray-400 mt-2">Output shows compilation steps and success/failure status.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Run Tests</h3>
              <p class="text-sm text-gray-400 mb-2">Run the automated unit tests.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn test</code>
              <p class="text-sm text-gray-400 mt-2">Maven automatically runs JUnit tests and outputs results.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Package Project</h3>
              <p class="text-sm text-gray-400 mb-2">Create the distributable artifact.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn package</code>
              <p class="text-sm text-gray-400 mt-2">Generates <code>target/demo-app-1.0.0.jar</code>. This is the artifact ready for deployment.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Think Like a DevOps Engineer</h3>
              <p class="text-sm text-gray-400 mb-2">Ask yourself:</p>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Can CI/CD call this command automatically? ✅</li>
                <li>Are dependencies handled automatically? ✅</li>
                <li>Is the output reproducible across machines? ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 4.3</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>What Maven is and why it’s critical</li>
              <li>Understanding pom.xml and dependencies</li>
              <li>Maven lifecycle basics</li>
              <li>Commands for build, test, and package</li>
              <li>How Maven fits into DevOps pipelines</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Maven Build Lifecycle',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Is a Maven Build Lifecycle?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A Maven Build Lifecycle is a sequence of predefined phases that control how a project is built, tested, and packaged. Instead of manually running multiple commands for compile, test, and package, Maven automates the workflow by executing each phase in order.</p>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <p class="font-bold text-gray-900 dark:text-white mb-2">Think of it as a conveyor belt in a factory:</p>
            <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>Raw material (source code) goes in</li>
              <li>Each phase processes the code</li>
              <li>Final product (artifact) comes out at the end</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why Build Lifecycle Matters in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In DevOps, pipelines rely on predictable builds. Maven lifecycle ensures:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Consistent builds across developers’ machines</li>
            <li>Automation compatibility with CI/CD tools (Jenkins, GitLab CI)</li>
            <li>Proper execution of tests before deployment</li>
            <li>Reliable artifact creation</li>
          </ul>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-6">
            <p class="font-bold text-red-700 dark:text-red-300 mb-1">Risk:</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">Without understanding the lifecycle, you may skip tests accidentally, package incomplete code, or break the CI/CD pipeline.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Core Maven Lifecycles</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">default</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Handles project deployment. Includes phases like compile, test, package, install, deploy.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">clean</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Cleans previous build files. Ensures fresh builds without leftovers from old runs.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">site</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Generates project documentation and reports. Useful for DevOps documentation and team collaboration.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Key Phases of Default Lifecycle</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-left text-sm whitespace-nowrap">
              <thead class="uppercase tracking-wider border-b-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-4 text-gray-900 dark:text-white">Phase</th>
                  <th scope="col" class="px-6 py-4 text-gray-900 dark:text-white">Purpose</th>
                </tr>
              </thead>
              <tbody class="border-b dark:border-gray-700">
                <tr class="border-b dark:border-gray-700">
                  <td class="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">validate</td>
                  <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Validate project structure and configuration</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">compile</td>
                  <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Compile source code</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">test</td>
                  <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Run unit tests</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">package</td>
                  <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Package compiled code into JAR/WAR</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">verify</td>
                  <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Run integration tests and checks</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">install</td>
                  <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Install artifact locally for other projects</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">deploy</td>
                  <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Upload artifact to remote repository (for team use)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Lifecycle in Practice</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">When you run <code>mvn package</code>, Maven automatically executes:</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 font-mono text-sm">
            <p class="text-gray-500">1. validate</p>
            <p class="text-gray-500">2. compile</p>
            <p class="text-gray-500">3. test</p>
            <p class="text-green-600 font-bold">4. package (TARGET)</p>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-bold">✅ Each previous phase is executed automatically—no manual intervention needed.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Best Practices</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Never skip phases manually; Maven ensures dependencies between phases.</li>
            <li>Always clean before build (<code>mvn clean</code>) to avoid old artifacts.</li>
            <li>Use test phases to validate code before packaging.</li>
            <li>Integrate lifecycle commands in CI/CD for automated deployments.</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Common Maven Lifecycle Commands',
            content: `Command | Description
mvn validate | Check project is correct and all info available
mvn compile | Compile source code
mvn test | Run unit tests
mvn package | Package code into artifact (JAR/WAR)
mvn verify | Run additional checks/tests
mvn install | Install artifact locally for other projects
mvn deploy | Upload artifact to remote repository
mvn clean | Delete previous build outputs
mvn clean install | Clean + compile + test + package + install`
          },
          {
            title: 'Maven Lifecycle Visual',
            content: `Clean → Validate → Compile → Test → Package → Verify → Install → Deploy

clean is optional, run if old builds exist
Other phases execute in order automatically`
          },
          {
            title: 'How Phases Trigger Each Other',
            content: `Example: mvn package automatically triggers:
1. validate
2. compile
3. test
4. package

You don’t have to run them individually`
          }
        ],
        terminalCommands: [
          'cd demo-app',
          'mvn clean',
          'mvn validate',
          'mvn compile',
          'mvn test',
          'mvn package',
          'mvn install',
          'mvn deploy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on exercise to practice Maven lifecycle.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Navigate to Maven Project</h3>
              <p class="text-sm text-gray-400 mb-2">Enter the project directory created in the previous topic.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd demo-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Clean Previous Builds</h3>
              <p class="text-sm text-gray-400 mb-2">Remove any old artifacts.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn clean</code>
              <p class="text-sm text-gray-400 mt-2">Output: [INFO] Cleaning target directory...</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Validate Project</h3>
              <p class="text-sm text-gray-400 mb-2">Check project configuration.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn validate</code>
              <p class="text-sm text-gray-400 mt-2">Output confirms all necessary info is available.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Compile Code</h3>
              <p class="text-sm text-gray-400 mb-2">Compile all .java files.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn compile</code>
              <p class="text-sm text-gray-400 mt-2">Outputs compiled .class files in target folder.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Run Unit Tests</h3>
              <p class="text-sm text-gray-400 mb-2">Execute all JUnit tests.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn test</code>
              <p class="text-sm text-gray-400 mt-2">Outputs results with PASS/FAIL status.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Package Project</h3>
              <p class="text-sm text-gray-400 mb-2">Package compiled code into JAR/WAR.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn package</code>
              <p class="text-sm text-gray-400 mt-2">Creates <code>target/demo-app-1.0.0.jar</code>. Automatically ran previous phases.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Install Artifact Locally</h3>
              <p class="text-sm text-gray-400 mb-2">Add artifact to local Maven repository.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn install</code>
              <p class="text-sm text-gray-400 mt-2">Allows other projects to use it as a dependency.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Deploy to Remote Repository (Optional)</h3>
              <p class="text-sm text-gray-400 mb-2">Upload artifact for team usage.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn deploy</code>
              <p class="text-sm text-gray-400 mt-2">Only used in real-world DevOps pipelines with a configured remote repo.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 9: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Every build phase has a purpose</li>
                <li>Pipelines call lifecycle commands automatically</li>
                <li>Builds are reproducible and predictable</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Introduction to MSBuild',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Is MSBuild?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">MSBuild (Microsoft Build Engine) is Microsoft’s official build tool for .NET projects. It automates compiling code, managing dependencies, running tests, and creating deployable artifacts (DLLs, EXEs).</p>
          <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
            <p class="font-bold text-purple-900 dark:text-purple-300 mb-2">Think of it as the Maven equivalent for .NET applications.</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">Just like Maven, it replaces manual compilation and ensures repeatable builds.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why MSBuild Is Important in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In DevOps pipelines targeting Windows environments, MSBuild is critical because it:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Automates compilation for CI/CD</li>
            <li>Integrates with Azure DevOps, Jenkins, and GitHub Actions</li>
            <li>Ensures consistent builds across environments</li>
            <li>Reduces human errors compared to manual builds</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. How MSBuild Works</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">MSBuild uses project files (<code>.csproj</code> or <code>.vbproj</code>) that define project structure, source code, references, and build targets. The engine reads the project file and executes targets in order.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Key MSBuild Concepts</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Solution File (.sln)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Represents the entire project or multiple projects. MSBuild can build the solution as a whole.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Project File (.csproj)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Defines individual project configurations, source files, and dependencies.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Target</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">A unit of work in the build process (e.g., Build, Clean, Rebuild).</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Properties</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Configurations passed to the build, like <code>Configuration=Release</code>.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. MSBuild in DevOps Pipelines</h2>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <p class="font-mono text-sm text-blue-800 dark:text-blue-300 mb-2">CI/CD → MSBuild Command → Artifact (DLL/EXE) → Deploy</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">Jenkins, Azure DevOps, or GitHub Actions call MSBuild commands to automate the compile → test → package → deploy flow.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Example Scenario</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 class="font-bold text-red-700 dark:text-red-300 mb-2">Without MSBuild</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Manually compile each project</li>
                <li>Manually resolve DLL references</li>
                <li>Risk inconsistent builds</li>
              </ul>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 class="font-bold text-green-700 dark:text-green-300 mb-2">With MSBuild</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>One command builds entire solution</li>
                <li>Dependencies handled automatically</li>
                <li>Ready for CI/CD deployment</li>
              </ul>
            </div>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Common MSBuild Commands',
            content: `Command | Purpose
msbuild MyApp.sln /t:Build | Build the solution
msbuild MyApp.sln /t:Clean | Remove previous build artifacts
msbuild MyApp.sln /t:Rebuild | Clean + Build
msbuild MyApp.sln /p:Configuration=Release | Build in Release mode
msbuild MyApp.sln /t:Build /p:Platform="Any CPU" | Specify platform`
          },
          {
            title: 'MSBuild Command Structure',
            content: `msbuild <solution/project> /t:<target> /p:<property=value>

<solution/project> → .sln or .csproj file
<target> → Build, Clean, Rebuild
<property> → Configuration, Platform, etc.`
          },
          {
            title: 'Common Targets',
            content: `Target | Purpose
Build | Compile the project
Clean | Remove old artifacts
Rebuild | Clean + Build
Publish | Package and prepare for deployment`
          }
        ],
        terminalCommands: [
          'cd C:\\Projects\\MyApp',
          'msbuild MyApp.sln /t:Clean',
          'msbuild MyApp.sln /t:Build /p:Configuration=Debug',
          'msbuild MyApp.sln /t:Build /p:Configuration=Release',
          'msbuild MyApp.sln /t:Rebuild',
          'msbuild MyApp.sln /t:Publish /p:Configuration=Release /p:PublishDir=C:\\Deploy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice to build a .NET project using MSBuild.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Open Developer Command Prompt</h3>
              <p class="text-sm text-gray-400 mb-2">On Windows, you would open "Developer Command Prompt for VS". Here, we simulate the environment.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Navigate to Project Folder</h3>
              <p class="text-sm text-gray-400 mb-2">Go to your project directory.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd C:\\Projects\\MyApp</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Clean Previous Builds</h3>
              <p class="text-sm text-gray-400 mb-2">Remove old build artifacts to ensure a fresh start.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">msbuild MyApp.sln /t:Clean</code>
              <p class="text-sm text-gray-400 mt-2">Removes old files from bin/ and obj/ folders.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Build Solution (Debug)</h3>
              <p class="text-sm text-gray-400 mb-2">Compile all projects in the solution.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">msbuild MyApp.sln /t:Build /p:Configuration=Debug</code>
              <p class="text-sm text-gray-400 mt-2">Outputs DLLs and EXEs in <code>bin\\Debug</code> folder.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Build in Release Mode</h3>
              <p class="text-sm text-gray-400 mb-2">Prepare project for deployment with optimizations.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">msbuild MyApp.sln /t:Build /p:Configuration=Release</code>
              <p class="text-sm text-gray-400 mt-2">Outputs files in <code>bin\\Release</code>.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Rebuild Solution</h3>
              <p class="text-sm text-gray-400 mb-2">Perform a clean followed by a build.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">msbuild MyApp.sln /t:Rebuild</code>
              <p class="text-sm text-gray-400 mt-2">Ensures everything is rebuilt from scratch.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Publish Project (Optional)</h3>
              <p class="text-sm text-gray-400 mb-2">Prepare the artifact for deployment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">msbuild MyApp.sln /t:Publish /p:Configuration=Release /p:PublishDir=C:\\Deploy</code>
              <p class="text-sm text-gray-400 mt-2">Copies all necessary files to the publish directory.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 8: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Can CI/CD pipelines call these commands automatically? ✅</li>
                <li>Are builds reproducible? ✅</li>
                <li>Is the artifact ready for deployment? ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 4.5</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>What MSBuild is and why it’s important</li>
              <li>Project and solution structure</li>
              <li>Build targets: Build, Clean, Rebuild, Publish</li>
              <li>Commands to compile, clean, and deploy projects</li>
              <li>How MSBuild fits into DevOps pipelines</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Build Pipelines Explained',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Is a Build Pipeline?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A build pipeline is an automated workflow that takes your source code from version control (like Git) and produces tested, deployable artifacts. It ensures that every commit or change is built and tested consistently.</p>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <p class="font-bold text-blue-900 dark:text-blue-300 mb-2">In simple terms:</p>
            <p class="font-mono text-sm text-blue-800 dark:text-blue-200">Code in → Automated steps → Artifact out → Ready for deployment</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why Build Pipelines Are Critical in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In modern software delivery where developers push code multiple times a day, manual builds are too slow and error-prone. A build pipeline:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Runs automatically on every code commit</li>
            <li>Compiles code and resolves dependencies</li>
            <li>Runs unit and integration tests immediately</li>
            <li>Packages artifacts for deployment</li>
            <li>Provides fast feedback if something breaks</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Key Components of a Build Pipeline</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Source Stage</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Fetches code from Git repository. Ensures latest changes are included.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Build Stage</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Compiles code using tools like Maven or MSBuild. Resolves dependencies and generates artifacts.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Test Stage</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Runs automated unit and integration tests. Prevents broken code from moving forward.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Package Stage</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Packages the compiled code into JAR, WAR, DLL, or EXE. Artifact is ready for deployment.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Deploy/Publish Stage (Optional)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Uploads artifact to staging/production or artifact repository.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. How Build Tools Fit Into Pipelines</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Build tools like Maven or MSBuild handle the <strong>Build</strong> and <strong>Package</strong> stages. CI/CD tools (Jenkins, GitLab, Azure DevOps) orchestrate the process by calling these tools automatically.</p>
          <div class="mb-6 p-4 bg-gray-900 rounded-lg font-mono text-sm text-green-400">
            <p># Maven Example</p>
            <p>mvn clean install</p>
            <br/>
            <p># MSBuild Example</p>
            <p>msbuild MyApp.sln /t:Build</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Visual Representation</h2>
          <div class="flex flex-wrap items-center gap-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <span class="px-3 py-1 bg-white dark:bg-gray-700 rounded shadow-sm">Git Commit</span>
            <span>→</span>
            <span class="px-3 py-1 bg-white dark:bg-gray-700 rounded shadow-sm">CI Server</span>
            <span>→</span>
            <span class="px-3 py-1 bg-white dark:bg-gray-700 rounded shadow-sm">Build Tool</span>
            <span>→</span>
            <span class="px-3 py-1 bg-white dark:bg-gray-700 rounded shadow-sm">Tests</span>
            <span>→</span>
            <span class="px-3 py-1 bg-white dark:bg-gray-700 rounded shadow-sm">Package</span>
            <span>→</span>
            <span class="px-3 py-1 bg-white dark:bg-gray-700 rounded shadow-sm">Deploy</span>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Real-World Scenario</h2>
          <p class="mb-6 text-gray-700 dark:text-gray-300">Imagine a team working on a Java application:</p>
          <ul class="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Developer pushes a new feature to Git.</li>
            <li>Jenkins detects the commit and triggers Maven build.</li>
            <li>Maven compiles code and runs tests.</li>
            <li>Jenkins packages the artifact and stores it in the repository.</li>
            <li>QA or Deployment teams can immediately deploy the tested artifact.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Build Pipeline Mindset</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Think automation first:</strong> Reduce manual steps.</li>
            <li><strong>Quality Assurance:</strong> Pipelines are safety nets.</li>
            <li><strong>Clear Outputs:</strong> Each stage should have logs.</li>
            <li><strong>Fail Fast:</strong> If tests fail, the pipeline should stop immediately.</li>
          </ul>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Common Pipeline Concepts',
            content: `Term | Meaning
Source | Fetch code from Git repository
Build | Compile project using Maven/MSBuild
Test | Run automated unit and integration tests
Package | Create deployable artifact
Deploy | Upload to environment or artifact repository`
          },
          {
            title: 'Example Pipeline Commands',
            content: `Java/Maven Example:
git clone https://github.com/your-username/demo-app.git
cd demo-app
mvn clean install

.NET/MSBuild Example:
git clone https://github.com/your-username/MyApp.git
cd MyApp
msbuild MyApp.sln /t:Rebuild /p:Configuration=Release`
          },
          {
            title: 'Best Practices',
            content: `1. Always start pipelines from a clean workspace
2. Include automated tests
3. Log outputs for debugging
4. Keep stages modular and clear
5. Pipeline should fail fast on errors`
          }
        ],
        terminalCommands: [
          'git clone https://github.com/your-username/demo-app.git',
          'cd demo-app',
          'mvn clean compile',
          'mvn test',
          'mvn package',
          'mkdir -p /tmp/deploy',
          'cp target/demo-app-1.0.0.jar /tmp/deploy/'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on simulation of a basic DevOps build pipeline.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Simulate Source Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Fetch code from the repository.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">git clone https://github.com/your-username/demo-app.git</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd demo-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Simulate Build Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Compile source code and prepare for testing.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn clean compile</code>
              <p class="text-sm text-gray-400 mt-2">Simulates a fresh compilation process.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Simulate Test Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Run all unit tests to verify build quality.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn test</code>
              <p class="text-sm text-gray-400 mt-2">If tests fail, the pipeline would stop here.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Simulate Package Stage</h3>
              <p class="text-sm text-gray-400 mb-2">Create the deployable artifact.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn package</code>
              <p class="text-sm text-gray-400 mt-2">Creates artifact in target folder.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Simulate Deployment Stage (Optional)</h3>
              <p class="text-sm text-gray-400 mb-2">Deploy artifact to a staging folder.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">mkdir -p /tmp/deploy</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cp target/demo-app-1.0.0.jar /tmp/deploy/</code>
              <p class="text-sm text-gray-400 mt-2">In real pipelines, this uploads to a server or cloud storage.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Every stage is automated ✅</li>
                <li>Builds are repeatable and consistent ✅</li>
                <li>Artifacts are ready for deployment ✅</li>
                <li>CI/CD pipeline can run this automatically ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 4.6</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>What a build pipeline is</li>
              <li>Stages: Source → Build → Test → Package → Deploy</li>
              <li>How build tools integrate with pipelines</li>
              <li>Commands used in simple automated pipeline</li>
              <li>Hands-on simulation of a build pipeline</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Introduction to CI (Continuous Integration)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Is Continuous Integration (CI)?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Continuous Integration (CI) is the practice of merging all developers’ code changes into a central repository frequently, usually several times a day.</p>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <p class="font-bold text-blue-900 dark:text-blue-300 mb-2">CI ensures that:</p>
            <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Code is always in a buildable state</li>
              <li>Automated builds and tests run immediately</li>
              <li>Developers get instant feedback if something breaks</li>
            </ul>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Think of CI as a safety net: the moment a developer introduces an error, CI detects it before it affects production.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why CI Is Important in DevOps</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Early Detection of Errors</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Instead of discovering errors weeks later, CI finds problems immediately after code is committed.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Faster Development</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Developers can integrate changes frequently without fear of long, painful merge conflicts.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Automation-Driven</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Builds, tests, and quality checks are automatic. Humans only need to fix failures.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Supports Continuous Delivery</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">CI is the first step in a CI/CD pipeline. Without CI, automated deployment is unreliable.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. CI Components</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Version Control System (VCS)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Stores all code (Git, GitHub, GitLab, Bitbucket).</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">CI Server</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Detects changes in VCS and runs automated build and tests (Jenkins, GitLab CI, GitHub Actions).</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Build Tools</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Maven, MSBuild, Gradle, etc. Used by CI to build and package projects.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Automated Tests</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Unit tests, integration tests. Ensures code quality.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Artifacts / Reports</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Build outputs stored in repository. Test results and logs for feedback.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Real-World Example</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Imagine a Java team using Jenkins and Maven:</p>
          <div class="flex flex-col gap-4 mb-6">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 class="font-bold text-green-700 dark:text-green-300 mb-2">Happy Path (CI Works)</h3>
              <ol class="list-decimal pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Developer A pushes a feature.</li>
                <li>Jenkins detects the commit.</li>
                <li>Jenkins calls Maven to compile and run tests.</li>
                <li>Tests pass → artifact packaged automatically.</li>
              </ol>
            </div>
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 class="font-bold text-red-700 dark:text-red-300 mb-2">Failure Scenario (CI Saves the Day)</h3>
              <ol class="list-decimal pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Developer B pushes broken code.</li>
                <li>Jenkins runs tests.</li>
                <li>Tests fail → developer notified instantly.</li>
                <li>Bad code never reaches production.</li>
              </ol>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. CI Mindset for DevOps Beginners</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Commit small changes frequently:</strong> Avoid "big bang" merges.</li>
            <li><strong>Automate builds and tests:</strong> Don't rely on "it works on my machine".</li>
            <li><strong>Treat CI failures as high-priority:</strong> Fix broken builds immediately.</li>
            <li><strong>Think pipeline-first:</strong> Automation is key.</li>
          </ul>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Typical CI Workflow Commands (Simulated)',
            content: `Java/Maven Project Example:
git pull origin main          # Fetch latest code
mvn clean install             # Build & test

.NET/MSBuild Project Example:
git pull origin main
msbuild MyApp.sln /t:Build /p:Configuration=Release

Note: CI server runs these commands automatically on every commit. Developers typically don’t manually execute these steps in the pipeline.`
          },
          {
            title: 'CI Best Practices',
            content: `1. Commit frequently to VCS
2. Include automated tests in builds
3. Keep builds fast and reliable
4. Fail fast: stop the pipeline if a build or test fails
5. Maintain logs for debugging`
          }
        ],
        terminalCommands: [
          'cd demo-app',
          'echo "// New feature added" >> App.java',
          'git add App.java',
          'git commit -m "Added new feature"',
          'mvn clean install'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on simulation of CI workflow for beginners.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Simulate Code Commit</h3>
              <p class="text-sm text-gray-400 mb-2">Modify code and commit changes to the repository.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">cd demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">echo "// New feature added" >> App.java</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-2">git add App.java</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git commit -m "Added new feature"</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Simulate CI Build Trigger</h3>
              <p class="text-sm text-gray-400 mb-2">In a real scenario, the CI server does this automatically. Here, we trigger it manually.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn clean install</code>
              <ul class="list-disc pl-5 mt-2 text-sm text-gray-400 space-y-1">
                <li>Compiles the code</li>
                <li>Runs automated tests</li>
                <li>Packages artifact</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Observe Feedback</h3>
              <p class="text-sm text-gray-400 mb-2">Check the build output.</p>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>If tests pass → Build succeeds ✅</li>
                <li>If tests fail → Output shows errors ❌</li>
              </ul>
              <p class="text-sm text-gray-400 mt-2">Developers can fix errors before deployment.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>CI detects issues early ✅</li>
                <li>CI reduces manual errors ✅</li>
                <li>CI ensures artifact quality ✅</li>
                <li>Ready to integrate into full CI/CD pipeline ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 4.7</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>CI definition and purpose</li>
              <li>CI components: VCS, CI server, build tools, tests, artifacts</li>
              <li>Benefits of CI for DevOps pipelines</li>
              <li>Hands-on simulation of CI workflow</li>
              <li>CI mindset for beginners</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Jenkins Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Is Jenkins?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Jenkins is the most popular open-source <strong>automation server</strong>. It is the "engine" of many CI/CD pipelines. It automates the parts of software development related to building, testing, and deploying, facilitating continuous integration and continuous delivery.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Jenkins?</h2>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Open Source & Free:</strong> Huge community support and thousands of plugins.</li>
            <li><strong>Extensible:</strong> Plugins for almost every tool (Git, Maven, Docker, AWS, Slack, etc.).</li>
            <li><strong>Distributed:</strong> Can distribute work across multiple machines (Master-Slave/Controller-Agent architecture).</li>
            <li><strong>Platform Independent:</strong> Java-based, runs on Windows, Linux, macOS.</li>
          </ul>

          <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Core Jenkins Concepts</h3>
            <ol class="list-decimal pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Job/Project:</strong> A runnable task controlled by Jenkins (e.g., "Build My App").</li>
              <li><strong>Pipeline:</strong> A suite of plugins which supports implementing and integrating continuous delivery pipelines into Jenkins.</li>
              <li><strong>Build:</strong> A specific run of a Job (e.g., Build #1, Build #2).</li>
              <li><strong>Plugin:</strong> Extensions that add functionality (e.g., Git plugin, Maven plugin).</li>
              <li><strong>Node/Agent:</strong> A machine (server) where the build actually runs. The <strong>Controller</strong> manages the flow.</li>
            </ol>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Jenkins Architecture (Simplified)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Controller (Master)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">The brain. Holds configuration, schedules jobs, serves the UI.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Agent (Slave)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">The muscle. Executes the actual steps (compiling, testing) to offload the master.</p>
            </div>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Common Jenkins Terminology',
            content: `Term | Definition
Job | A defined task (Freestyle or Pipeline).
Build Trigger | What starts the job (e.g., "Poll SCM", "Build periodically", "GitHub Hook").
Workspace | Directory on the agent where files are checked out and built.
Artifact | The final output (e.g., .jar, .war) archived after a build.`
          },
          {
            title: 'Jenkinsfile Syntax (Declarative Pipeline)',
            content: `pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
    }
}`
          },
          {
            title: 'Freestyle vs. Pipeline',
            content: `Freestyle:
- UI-based, click-to-configure.
- Good for simple tasks.
- Hard to version control.

Pipeline:
- Code-based (Groovy), stored in Git.
- Best practice for modern DevOps.`
          }
        ],
        terminalCommands: [
          'sudo systemctl start jenkins',
          'sudo systemctl status jenkins',
          'sudo cat /var/lib/jenkins/secrets/initialAdminPassword',
          'echo "Open browser at http://localhost:8080"'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Explore Jenkins startup and initial configuration steps.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Start Jenkins (Simulation)</h3>
              <p class="text-sm text-gray-400 mb-2">Jenkins usually runs as a background service.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo systemctl start jenkins</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Check Status</h3>
              <p class="text-sm text-gray-400 mb-2">Verify that the service is running correctly.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo systemctl status jenkins</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: View Initial Admin Password</h3>
              <p class="text-sm text-gray-400 mb-2">When installing, Jenkins generates a secure password for first-time login.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo cat /var/lib/jenkins/secrets/initialAdminPassword</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Simulate Access</h3>
              <p class="text-sm text-gray-400 mb-2">In a real scenario, you would open this URL in your browser.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">echo "Open browser at http://localhost:8080"</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Jenkins is the "glue" connecting Git (code) to Maven (build) to Servers (deploy) ✅</li>
                <li>"Configuration as Code" (Jenkinsfile) is better than manual UI clicking ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 4.8</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Jenkins definition and role in DevOps</li>
              <li>Key concepts: Jobs, Pipelines, Agents, Plugins</li>
              <li>Controller vs Agent architecture</li>
              <li>Jenkinsfile syntax basics</li>
              <li>How to start and check Jenkins service</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Hands-On: Build Apps & Jenkins',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Hands-On Jenkins?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Jenkins is a popular CI/CD server that automates builds, tests, and deployments.
            By integrating your build tools (Maven, MSBuild) with Jenkins, you create a repeatable and automated pipeline.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This session is practical:</p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Build a demo project</li>
            <li>Automate compilation and testing</li>
            <li>Observe CI workflow in action</li>
            <li>Prepare for deployment-ready artifacts</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Step 1: Understanding Jenkins Pipeline</h2>
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-800 dark:text-gray-200 mb-2">Jenkins pipeline consists of:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Source stage:</strong> Pull code from Git</li>
              <li><strong>Build stage:</strong> Compile using Maven/MSBuild</li>
              <li><strong>Test stage:</strong> Run automated tests</li>
              <li><strong>Package stage:</strong> Create deployable artifacts</li>
              <li><strong>Optional Deploy stage:</strong> Push artifact to staging/production</li>
            </ul>
            <p class="mt-3 text-sm text-[#00bceb] italic">This pipeline mirrors real-world DevOps practices.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Step 2: Hands-On Goals</h2>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Install and configure Jenkins (local or cloud)</li>
            <li>Create a freestyle job or pipeline</li>
            <li>Connect Git repository</li>
            <li>Run build & test automatically</li>
            <li>Package and store artifacts</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-bold">👉 By the end, you will understand how CI/CD is applied in real scenarios.</p>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Install Jenkins (Ubuntu Example)',
            content: `wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins -y
sudo systemctl start jenkins
sudo systemctl status jenkins

Open Jenkins at http://localhost:8080
Unlock Jenkins with initial admin password`
          },
          {
            title: 'Create a Freestyle Job (Beginner-Friendly)',
            content: `1. New Item → Freestyle Project → Enter Name
2. Source Code Management → Git → Repository URL
3. Build → Execute Shell / Invoke Maven / MSBuild

Maven Example: mvn clean install
MSBuild Example: msbuild MyApp.sln /t:Rebuild /p:Configuration=Release

4. Save and Build Now`
          },
          {
            title: 'Jenkins Pipeline (Declarative Example)',
            content: `pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-username/demo-app.git'
            }
        }
        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        stage('Package') {
            steps {
                sh 'mvn package'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'target/*.jar', allowEmptyArchive: true
        }
    }
}`
          },
          {
            title: 'Benefits of This Hands-On Approach',
            content: `Understand full DevOps workflow
Observe automatic build & test execution
Learn artifact management in Jenkins
Prepare for real-world CI/CD pipelines`
          }
        ],
        terminalCommands: [
          'git clone https://github.com/your-username/demo-app.git',
          'cd demo-app',
          'sudo apt install maven -y',
          'mvn clean install',
          '# Now switch to Jenkins UI to automate this'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Simulate a complete DevOps build using Jenkins.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Pull Demo Project</h3>
              <p class="text-sm text-gray-400 mb-2">Get the source code to your local machine (or Jenkins server).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git clone https://github.com/your-username/demo-app.git</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">cd demo-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Install Required Tools</h3>
              <p class="text-sm text-gray-400 mb-2">Ensure build tools are installed.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sudo apt install maven -y</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Run Manual Build (Pre-Jenkins Simulation)</h3>
              <p class="text-sm text-gray-400 mb-2">Verify the project builds successfully locally before automating.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mvn clean install</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Setup Jenkins Job</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Open Jenkins Dashboard → New Item → Freestyle Project</li>
                <li>Configure Git repository URL</li>
                <li>Add build step → Invoke Maven → <code>clean install</code></li>
                <li>Save → Build Now</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Observe Pipeline Execution</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Jenkins fetches code automatically</li>
                <li>Compiles and runs tests</li>
                <li>Packages artifact in <code>target/</code> folder</li>
                <li>Shows build logs for troubleshooting</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Optional Artifact Archiving</h3>
              <p class="text-sm text-gray-400 mb-2">Configure Post-build Actions → Archive Artifacts. Artifacts are stored in Jenkins for future deployment.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Pipeline runs automatically on commits ✅</li>
                <li>Build and test results are visible to all team members ✅</li>
                <li>Artifacts are reproducible and ready for deployment ✅</li>
                <li>Fully prepares for CI/CD integration ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 4.8</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Hands-on setup of Jenkins</li>
              <li>Creating a freestyle project and pipeline</li>
              <li>Automating build, test, and package using Maven/MSBuild</li>
              <li>Observing logs and artifact management</li>
              <li>Practical DevOps mindset for beginners</li>
            </ul>
          </div>

          <div class="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30">
            <h2 class="text-2xl font-bold mb-4 text-green-400">✅ Module 4 Complete!</h2>
            <h3 class="text-lg font-semibold text-white mb-2">Module 4 Summary:</h3>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Build Automation Concepts</li>
              <li>Introduction to Maven & MSBuild</li>
              <li>Build Lifecycle</li>
              <li>Build Pipelines</li>
              <li>Continuous Integration</li>
              <li>Hands-On Jenkins Practice</li>
            </ul>
            <p class="mt-4 text-green-300 font-medium">This module gives strong foundational skills to manage DevOps builds and pipelines practically.</p>
          </div>
        `
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Module 5 — Containers & Docker',
    duration: '1 week',
    description: 'Learn containerization concepts, Docker architecture, images, Dockerfiles, and pipelines.',
    lessons: [
      {
        title: 'What Are Containers?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Is a Container?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A container is a lightweight, portable, and self-contained environment that includes your application and all its dependencies—like libraries, configuration files, and runtime.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Think of a container as a mini-computer that runs consistently across any system, whether your laptop, a cloud server, or a CI/CD pipeline.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Containers Are Important in DevOps</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Consistency Across Environments</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">“It works on my machine” becomes irrelevant. Containers run the same on development, staging, and production.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Isolation</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Each container is independent. No conflicts between applications or dependencies.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Lightweight</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Containers share the host OS kernel. Faster startup than virtual machines.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Scalability</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Containers can be replicated quickly. Ideal for microservices and cloud deployments.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Containers vs Virtual Machines (Brief)</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Feature</th>
                  <th scope="col" class="px-4 py-2">Container</th>
                  <th scope="col" class="px-4 py-2">Virtual Machine</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Size</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400">Lightweight (MBs)</td>
                  <td class="px-4 py-2">Heavy (GBs)</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Startup Time</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400">Seconds</td>
                  <td class="px-4 py-2">Minutes</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Resource Sharing</td>
                  <td class="px-4 py-2">Shares host OS</td>
                  <td class="px-4 py-2">Includes full OS</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-bold">Isolation</td>
                  <td class="px-4 py-2">Application-level</td>
                  <td class="px-4 py-2">OS-level</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300 italic">Conclusion: Containers are faster, lighter, and easier to manage in DevOps pipelines.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Use Case</h2>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Imagine a team building a web application:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Without containers:</strong> Dev, QA, and Production servers may have different setups → bugs appear.</li>
              <li><strong>With containers:</strong> App + dependencies are packaged once → works everywhere.</li>
              <li>CI/CD pipelines can deploy containers instantly.</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Beginner Mindset</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Containers are portable units of applications.</li>
            <li>Think of them as a consistent mini-environment for DevOps pipelines.</li>
            <li><strong>Docker</strong> is the most widely used tool to create and manage containers.</li>
          </ul>
        `,
        duration: '10 min',
        syntax: [
          {
            title: 'Core Docker Concepts',
            content: `Term | Definition
Image | A read-only template with your application + dependencies.
Container | A running instance of an image.
Dockerfile | A script that defines how to build an image.
Registry | Central repository to store images (e.g., Docker Hub).`
          },
          {
            title: 'Basic Docker Commands',
            content: `Command | Purpose
docker --version | Check Docker version
docker pull <image> | Download image from Docker Hub
docker build -t <name>:<tag> . | Build image from Dockerfile
docker run -d -p 8080:80 <image> | Run container
docker ps | List running containers
docker stop <id> | Stop a container
docker rm <id> | Remove a container
docker rmi <image> | Remove an image`
          },
          {
            title: 'Beginner Dockerfile Example',
            content: `# Base image
FROM openjdk:11-jdk

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Compile and package (Maven example)
RUN mvn clean package

# Run the application
CMD ["java", "-jar", "target/demo-app-1.0.0.jar"]

# Explanation:
# FROM → base image
# WORKDIR → sets folder inside container
# COPY → copy local files
# RUN → execute commands during build
# CMD → command to run container`
          }
        ],
        terminalCommands: [
          'docker --version',
          'docker pull hello-world',
          'docker run hello-world',
          'mkdir demo-app',
          '# Create Dockerfile inside demo-app',
          'docker build -t demo-app:1.0 .',
          'docker run -d -p 8080:8080 demo-app:1.0',
          'docker ps',
          'docker stop <container_id>'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on beginner containerization using Docker.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Docker Installation</h3>
              <p class="text-sm text-gray-400 mb-2">Verify that Docker is installed and running.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker --version</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Pull a Test Image</h3>
              <p class="text-sm text-gray-400 mb-2">Download and run a simple test image to confirm setup.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker pull hello-world</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker run hello-world</code>
              <p class="text-sm text-gray-500 mt-2 italic">Prints “Hello from Docker!” if successful.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Build Your First Image</h3>
              <p class="text-sm text-gray-400 mb-2">Create a <code>demo-app</code> folder and add a <code>Dockerfile</code> (use the example in Syntax tab).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker build -t demo-app:1.0 .</code>
              <ul class="list-disc pl-5 mt-2 text-sm text-gray-400 space-y-1">
                <li><code>-t demo-app:1.0</code> → names your image</li>
                <li><code>.</code> → context directory (current folder)</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Run Your Container</h3>
              <p class="text-sm text-gray-400 mb-2">Start a container instance from your new image.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker run -d -p 8080:8080 demo-app:1.0</code>
              <ul class="list-disc pl-5 mt-2 text-sm text-gray-400 space-y-1">
                <li><code>-d</code> → runs in detached mode (background)</li>
                <li><code>-p 8080:8080</code> → maps container port to host port</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Check Running Containers</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker ps</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Stop and Cleanup</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker stop &lt;container_id&gt;</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker rm &lt;container_id&gt;</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Containers ensure consistency across all environments ✅</li>
                <li>They are fast to start and lightweight ✅</li>
                <li>Can be integrated into CI/CD pipelines easily ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 5.1</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>What is a container and why it matters</li>
              <li>Containers vs. Virtual Machines</li>
              <li>Core Docker concepts (Image, Container, Dockerfile)</li>
              <li>Basic Docker commands for lifecycle management</li>
              <li>Building and running your first container</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Containers vs Virtual Machines (VMs)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Are Virtual Machines?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A <strong>Virtual Machine (VM)</strong> is a full operating system environment that runs on top of a physical host using a hypervisor (e.g., VirtualBox, VMware, Hyper-V).
          </p>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Each VM includes:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Its own OS (Guest OS)</li>
            <li>Allocated CPU, memory, storage</li>
            <li>Applications and dependencies</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-medium">Think of a VM as a computer inside your computer.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Differences Between Containers and VMs</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Feature</th>
                  <th scope="col" class="px-4 py-2">Container</th>
                  <th scope="col" class="px-4 py-2">Virtual Machine</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">OS</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400">Shares host OS</td>
                  <td class="px-4 py-2">Full guest OS required</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Size</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400">Lightweight (MBs)</td>
                  <td class="px-4 py-2">Heavy (GBs)</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Startup Time</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400">Seconds</td>
                  <td class="px-4 py-2">Minutes</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Isolation</td>
                  <td class="px-4 py-2">Application-level</td>
                  <td class="px-4 py-2">OS-level</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Resource Usage</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400">Efficient</td>
                  <td class="px-4 py-2">Resource-intensive</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-bold">Portability</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400">Very portable</td>
                  <td class="px-4 py-2">Less portable</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300 italic bg-gray-100 dark:bg-gray-800 p-3 rounded border-l-4 border-blue-500">
            <strong>Summary:</strong> Containers are faster, lighter, and easier to manage for DevOps workflows, whereas VMs provide full OS isolation but are heavier and slower.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why DevOps Prefers Containers</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Faster Deployment</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Containers start almost instantly, while VMs take minutes to boot up.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Resource Efficiency</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Multiple containers can run on the same host efficiently without needing separate OSs.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Portability</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Containers work anywhere (developer laptop → cloud → CI/CD pipeline). VMs may need adjustments.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Simpler CI/CD Integration</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Pipelines can spin up containers, run builds/tests, and tear them down quickly.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Scenario</h2>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Imagine a team testing a Java web application:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Without containers:</strong> Each developer configures a VM → takes time, may have version conflicts.</li>
              <li><strong>With containers:</strong> All developers use the same Docker image → environment identical everywhere.</li>
            </ul>
            <p class="mt-2 text-sm text-blue-700 dark:text-blue-400">CI/CD pipelines also run faster because containers are lightweight, portable, and start instantly.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Beginner Mindset</h2>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Containers are <strong>mini-VMs focused on apps</strong>.</li>
            <li>VMs are <strong>full OS environments</strong>.</li>
            <li>For DevOps, containers are preferred for <strong>automation, consistency, and resource efficiency</strong>.</li>
          </ul>
        `,
        duration: '10 min',
        syntax: [
          {
            title: 'Hands-On Commands to Compare',
            content: `Step | Command | Purpose
1. Check Existing VMs | \`VBoxManage list vms\` | Lists all VMs on your system (VirtualBox).
2. Check Running VMs | \`VBoxManage list runningvms\` | Shows which VMs are active.
3. Compare with Docker | \`docker ps\` | Shows running containers (instantly).
4. Run Test Container | \`docker run -d -p 8080:80 nginx\` | Container is up in seconds.
5. Start Test VM | \`VBoxManage startvm "UbuntuVM" --type headless\` | VM takes minutes to boot.
6. Stop Container | \`docker stop <id>\` | Stops instantly.
7. Stop VM | \`VBoxManage controlvm "UbuntuVM" acpipowerbutton\` | Triggers OS shutdown (slower).`
          }
        ],
        terminalCommands: [
          'docker pull nginx',
          'docker run -d -p 8080:80 nginx',
          'docker ps',
          'VBoxManage startvm "UbuntuVM" --type headless',
          'docker stop <container_id>',
          'docker rm <container_id>',
          'VBoxManage controlvm "UbuntuVM" acpipowerbutton'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practical comparison of containers vs VMs.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Pull and Run a Container</h3>
              <p class="text-sm text-gray-400 mb-2">Experience the speed of Docker containers.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker pull nginx</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker run -d -p 8080:80 nginx</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker ps</code>
              <p class="text-sm text-gray-500 mt-2 italic">Note: Startup is instantaneous (seconds).</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Start a Virtual Machine</h3>
              <p class="text-sm text-gray-400 mb-2">Simulate starting a VM to compare time and effort.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">VBoxManage startvm "UbuntuVM" --type headless</code>
              <p class="text-sm text-gray-500 mt-2 italic">Note: Startup takes minutes. Consumes more memory/CPU.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Stop & Clean Up</h3>
              <p class="text-sm text-gray-400 mb-2">Compare the shutdown process.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker stop &lt;container_id&gt;</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker rm &lt;container_id&gt;</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">VBoxManage controlvm "UbuntuVM" acpipowerbutton</code>
              <p class="text-sm text-gray-500 mt-2 italic">Containers are fast to stop and remove. VMs take more time.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Use containers for automation, pipelines, and microservices ✅</li>
                <li>VMs are suitable for full OS isolation or legacy apps ✅</li>
                <li>In modern DevOps, containers dominate due to speed, portability, and CI/CD friendliness ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 5.2</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Key differences between Containers and VMs (Size, Speed, Isolation)</li>
              <li>Why DevOps prefers containers (Efficiency, Portability, CI/CD)</li>
              <li>Hands-on command comparison (Docker vs VirtualBox)</li>
              <li>Real-world scenarios for choosing containers</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Docker Architecture',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Is Docker Architecture?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Docker is built on a <strong>client-server model</strong> that separates user commands from the container engine.
            Understanding Docker architecture helps DevOps engineers design, troubleshoot, and optimize pipelines.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Docker has three main components:</h3>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400">1. Docker Client</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">The interface you interact with (CLI or GUI). Sends commands like <code>docker build</code> or <code>docker run</code> to the Docker Engine.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400">2. Docker Daemon (Server)</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">The core engine that builds, runs, and manages containers. Listens for Docker Client commands and manages lifecycle, networking, and storage.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400">3. Docker Objects</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li><strong>Images:</strong> Read-only templates</li>
                <li><strong>Containers:</strong> Running instances of images</li>
                <li><strong>Volumes:</strong> Persistent storage for containers</li>
                <li><strong>Networks:</strong> Communication between containers</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How Docker Works (Step by Step)</h2>
          <ol class="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>User sends command via CLI: <code>docker run nginx</code></li>
            <li>Docker Client communicates with Docker Daemon</li>
            <li>Daemon checks for image locally; if not found, pulls from Docker Hub</li>
            <li>Container is created using the image</li>
            <li>Daemon manages container lifecycle, networking, and storage</li>
          </ol>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Docker Architecture Diagram (Conceptual)</h3>
          <div class="bg-gray-900 p-4 rounded-lg mb-6 overflow-x-auto">
            <pre class="text-green-400 font-mono text-sm leading-relaxed">
      +--------------------+
      |    Docker Client   |
      +---------+----------+
                |
                v
      +--------------------+
      |    Docker Daemon   |
      |  (Engine Server)   |
      +--------------------+
       |       |       |
       v       v       v
  +--------+ +--------+ +--------+
  | Image  | | Container | Volume|
  +--------+ +--------+ +--------+
            </pre>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Understanding Architecture Matters in DevOps</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
              <h4 class="font-bold text-blue-800 dark:text-blue-300">Troubleshooting</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Know where containers fail: client, daemon, or image layer.</p>
            </div>
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
              <h4 class="font-bold text-blue-800 dark:text-blue-300">Pipeline Optimization</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Efficient image building, proper networking, and storage.</p>
            </div>
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
              <h4 class="font-bold text-blue-800 dark:text-blue-300">Scalability</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Knowledge of Docker Engine helps in orchestrating multiple containers.</p>
            </div>
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
              <h4 class="font-bold text-blue-800 dark:text-blue-300">Security</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Understand how containers interact with host OS and networks.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Scenario</h2>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">A DevOps engineer is running a CI/CD pipeline with multiple microservices:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Each service runs in a container.</li>
              <li>Docker Daemon handles isolation, networking, and storage.</li>
              <li>Client commands or automated pipelines trigger container creation and management.</li>
            </ul>
            <p class="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">Understanding the architecture ensures smooth pipeline execution and troubleshooting.</p>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Key Docker Components & Commands',
            content: `Command | Description
docker info | Displays Docker Daemon info: containers, images, storage, and networks.
docker ps | Shows containers managed by Docker Daemon.
docker images | Lists all images available locally.
docker network ls | Shows all container networks.
docker volume ls | Lists persistent storage volumes.`
          }
        ],
        terminalCommands: [
          'docker info',
          'docker run -d --name my-nginx -p 8080:80 nginx',
          'docker network ls',
          'docker network inspect bridge',
          'docker volume create my-data',
          'docker volume ls',
          'docker stop my-nginx',
          'docker rm my-nginx',
          'docker volume rm my-data'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on exploration of Docker architecture components.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Inspect Docker Daemon</h3>
              <p class="text-sm text-gray-400 mb-2">View system-wide information.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker info</code>
              <ul class="list-disc pl-5 mt-2 text-sm text-gray-400 space-y-1">
                <li>Number of running containers</li>
                <li>Storage driver</li>
                <li>Network information</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Run a Container</h3>
              <p class="text-sm text-gray-400 mb-2">Trigger the Client-Daemon interaction.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker run -d --name my-nginx -p 8080:80 nginx</code>
              <p class="text-sm text-gray-500 mt-2 italic">Client sends command → Daemon creates container → Managed by Daemon.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Explore Networks</h3>
              <p class="text-sm text-gray-400 mb-2">See how containers communicate.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker network ls</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker network inspect bridge</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Explore Volumes</h3>
              <p class="text-sm text-gray-400 mb-2">Create persistent storage.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker volume create my-data</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker volume ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Stop & Remove Container</h3>
              <p class="text-sm text-gray-400 mb-2">Clean up resources.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker stop my-nginx</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker rm my-nginx</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker volume rm my-data</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Docker architecture allows scalable, consistent, and isolated deployments ✅</li>
                <li>Understanding client, daemon, images, containers, volumes, and networks is critical for CI/CD pipelines ✅</li>
                <li>Helps troubleshoot build or deployment issues effectively ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 5.3</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Docker’s client-server architecture</li>
              <li>Key components: Client, Daemon, Images, Containers, Volumes, Networks</li>
              <li>Commands to explore Docker components</li>
              <li>Hands-on understanding of container lifecycle and architecture</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Docker Images & Containers',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Understanding Docker Images</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A <strong>Docker Image</strong> is a read-only template that contains your application code, runtime, libraries, and dependencies.
            Think of it as a snapshot of your app ready to be deployed anywhere.
          </p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Immutable:</strong> Cannot be changed once built.</li>
            <li><strong>Reusable:</strong> Multiple containers can run from the same image.</li>
            <li><strong>Versioned:</strong> Tags (e.g., <code>nginx:1.23</code>) manage versions.</li>
            <li><strong>Shareable:</strong> Can be stored in Docker Hub or private registries.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Understanding Docker Containers</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A <strong>Container</strong> is a running instance of an image. Containers are lightweight and isolated.
          </p>
          <p class="mb-2 text-gray-700 dark:text-gray-300 font-medium">Each container has:</p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Its own filesystem</li>
            <li>Its own process space</li>
            <li>Configurable networking</li>
          </ul>

          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Difference between Image and Container</h3>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Feature</th>
                  <th scope="col" class="px-4 py-2">Image</th>
                  <th scope="col" class="px-4 py-2">Container</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">State</td>
                  <td class="px-4 py-2 text-blue-600 dark:text-blue-400">Read-only template</td>
                  <td class="px-4 py-2 text-green-600 dark:text-green-400">Running instance</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Lifecycle</td>
                  <td class="px-4 py-2">Static</td>
                  <td class="px-4 py-2">Dynamic (start/stop)</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-bold">Modification</td>
                  <td class="px-4 py-2">Rebuild needed</td>
                  <td class="px-4 py-2">Can modify at runtime</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Images & Containers Matter in DevOps</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-gray-900 dark:text-white mb-2">Consistency</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Same image → same container → same behavior everywhere.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-gray-900 dark:text-white mb-2">Rapid Deployment</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Containers start almost instantly from images.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-gray-900 dark:text-white mb-2">CI/CD Integration</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Pipelines automate building images and testing containers.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Scenario</h2>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">A DevOps engineer building a CI/CD pipeline:</h4>
            <ol class="list-decimal pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>Code is committed → CI server builds Docker image.</li>
              <li>Container is launched from the image → runs tests.</li>
              <li>If tests pass → image is tagged and pushed to registry.</li>
              <li>Deployment pipeline pulls the image → runs container in staging/production.</li>
            </ol>
            <p class="mt-3 text-sm text-blue-700 dark:text-blue-400 font-medium">This workflow ensures repeatable, reliable deployments.</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Hands-On Commands',
            content: `Step | Command | Purpose
1. List Images | \`docker images\` | Shows all images available locally.
2. Pull Image | \`docker pull nginx:latest\` | Downloads the latest Nginx image.
3. Run Container | \`docker run -d --name webserver -p 8080:80 nginx:latest\` | Runs Nginx in detached mode mapped to port 8080.
4. List Containers | \`docker ps\` | Shows all running containers.
5. Stop Container | \`docker stop webserver\` | Stops the container safely.
6. Remove Container | \`docker rm webserver\` | Removes the container instance.
7. Remove Image | \`docker rmi nginx:latest\` | Removes the image from local storage.`
          },
          {
            title: 'Build a Custom Image',
            content: `# Dockerfile Example
FROM openjdk:11-jdk
WORKDIR /app
COPY . /app
RUN mvn clean package
CMD ["java", "-jar", "target/demo-app-1.0.0.jar"]

# Build Command:
docker build -t demo-app:1.0 .

# Run Command:
docker run -d -p 8080:8080 demo-app:1.0`
          }
        ],
        terminalCommands: [
          'docker pull nginx:latest',
          'docker run -d --name my-nginx -p 8080:80 nginx:latest',
          'docker ps',
          '# Imagine we are in demo-app folder',
          'docker build -t demo-app:1.0 .',
          'docker images',
          'docker run -d -p 8080:8080 demo-app:1.0',
          'docker stop my-nginx',
          'docker rm my-nginx',
          'docker rmi demo-app:1.0'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on exercises for managing images and containers.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Pull & Run Pre-Built Image</h3>
              <p class="text-sm text-gray-400 mb-2">Use a standard image from Docker Hub.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker pull nginx:latest</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker run -d --name my-nginx -p 8080:80 nginx:latest</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker ps</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Build Your Own Image</h3>
              <p class="text-sm text-gray-400 mb-2">Create an image from a Dockerfile (simulated).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker build -t demo-app:1.0 .</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker images</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Run Your Container</h3>
              <p class="text-sm text-gray-400 mb-2">Launch an instance of your custom image.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker run -d -p 8080:8080 demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker ps</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Stop & Remove Container</h3>
              <p class="text-sm text-gray-400 mb-2">Practice lifecycle management.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker stop demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker rm demo-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Remove Image (Cleanup)</h3>
              <p class="text-sm text-gray-400 mb-2">Free up disk space.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker rmi demo-app:1.0</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Images = blueprints ✅</li>
                <li>Containers = running instances ✅</li>
                <li>Build pipelines rely on images for reproducible deployments ✅</li>
                <li>Hands-on practice ensures confidence in container management ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 5.4</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Difference between Images (Blueprints) and Containers (Instances)</li>
              <li>Key commands: build, pull, run, stop, rm, rmi</li>
              <li>How to build a custom image from a Dockerfile</li>
              <li>Real-world CI/CD workflow with Docker images</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Dockerfile Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Is a Dockerfile?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A <strong>Dockerfile</strong> is a text file containing a set of instructions to build a Docker image.
            It automates the creation of images so developers don’t have to manually configure environments.
          </p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Reproducible builds:</strong> Same image every time.</li>
            <li><strong>Easy versioning:</strong> Track changes in Git.</li>
            <li><strong>Automation:</strong> Integrate with CI/CD pipelines.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Key Dockerfile Instructions</h3>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Instruction</th>
                  <th scope="col" class="px-4 py-2">Description</th>
                  <th scope="col" class="px-4 py-2">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold font-mono text-blue-600 dark:text-blue-400">FROM</td>
                  <td class="px-4 py-2">Base image for your application</td>
                  <td class="px-4 py-2 font-mono">FROM openjdk:11-jdk</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold font-mono text-blue-600 dark:text-blue-400">WORKDIR</td>
                  <td class="px-4 py-2">Sets working directory inside container</td>
                  <td class="px-4 py-2 font-mono">WORKDIR /app</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold font-mono text-blue-600 dark:text-blue-400">COPY</td>
                  <td class="px-4 py-2">Copies files from local to container</td>
                  <td class="px-4 py-2 font-mono">COPY . /app</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold font-mono text-blue-600 dark:text-blue-400">RUN</td>
                  <td class="px-4 py-2">Executes commands during build</td>
                  <td class="px-4 py-2 font-mono">RUN mvn clean package</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold font-mono text-blue-600 dark:text-blue-400">CMD</td>
                  <td class="px-4 py-2">Command executed when container starts</td>
                  <td class="px-4 py-2 font-mono">CMD ["java", "-jar", "app.jar"]</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold font-mono text-blue-600 dark:text-blue-400">EXPOSE</td>
                  <td class="px-4 py-2">Indicates listening port</td>
                  <td class="px-4 py-2 font-mono">EXPOSE 8080</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-bold font-mono text-blue-600 dark:text-blue-400">ENV</td>
                  <td class="px-4 py-2">Set environment variables</td>
                  <td class="px-4 py-2 font-mono">ENV APP_ENV=production</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World DevOps Use Case</h2>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Automated Build Pipeline:</h4>
            <ol class="list-decimal pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>Developer writes a Dockerfile for a Java app.</li>
              <li>Jenkins pipeline builds the image automatically.</li>
              <li>Image is pushed to a registry.</li>
              <li>Deployment pipeline pulls the image and runs containers.</li>
            </ol>
            <p class="mt-3 text-sm text-blue-700 dark:text-blue-400 font-medium">Result: identical environments for dev, QA, and production.</p>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Dockerfile Best Practices</h3>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Keep images small and lightweight.</li>
            <li>Use official base images.</li>
            <li>Combine RUN instructions to reduce image layers.</li>
            <li>Avoid storing secrets in Dockerfile.</li>
            <li>Always tag images properly for CI/CD pipelines.</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Example Dockerfile for Java App',
            content: `# Step 1: Base image
FROM openjdk:11-jdk

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy project files
COPY . /app

# Step 4: Build the application
RUN mvn clean package

# Step 5: Expose application port
EXPOSE 8080

# Step 6: Run the application
CMD ["java", "-jar", "target/demo-app-1.0.0.jar"]`
          },
          {
            title: 'Build and Run Commands',
            content: `# Build Docker image
docker build -t demo-app:1.0 .

# Run Docker container
docker run -d -p 8080:8080 demo-app:1.0

# Check running containers
docker ps`
          },
          {
            title: 'Advanced: Multi-stage Builds',
            content: `# Stage 1: Build
FROM maven:3.9.2-openjdk-11 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package

# Stage 2: Runtime (smaller image)
FROM openjdk:11-jre
WORKDIR /app
COPY --from=builder /app/target/demo-app-1.0.0.jar .
CMD ["java", "-jar", "demo-app-1.0.0.jar"]`
          }
        ],
        terminalCommands: [
          'mkdir demo-app',
          'cd demo-app',
          'nano Dockerfile',
          '# Paste Dockerfile content...',
          'docker build -t demo-app:1.0 .',
          'docker run -d -p 8080:8080 demo-app:1.0',
          'docker ps',
          'docker stop demo-app',
          'docker rm demo-app',
          'docker rmi demo-app:1.0'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on Dockerfile practice for beginners.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create Dockerfile</h3>
              <p class="text-sm text-gray-400 mb-2">Set up your project directory and file.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">mkdir demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">cd demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">nano Dockerfile</code>
              <p class="text-sm text-gray-500 mt-2 italic">Paste the example content from Syntax tab.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Build Docker Image</h3>
              <p class="text-sm text-gray-400 mb-2">Convert the Dockerfile into an image.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker build -t demo-app:1.0 .</code>
              <ul class="list-disc pl-5 mt-2 text-sm text-gray-400 space-y-1">
                <li>Observe each layer being created</li>
                <li>Build logs show steps executed</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Run Container</h3>
              <p class="text-sm text-gray-400 mb-2">Test your new image.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker run -d -p 8080:8080 demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker ps</code>
              <p class="text-sm text-gray-500 mt-2 italic">Container is running and accessible on port 8080.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Stop & Remove Container</h3>
              <p class="text-sm text-gray-400 mb-2">Cleanup your workspace.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker stop demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker rm demo-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Remove Image</h3>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker rmi demo-app:1.0</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Dockerfile = blueprint for images ✅</li>
                <li>Multi-stage builds reduce size and complexity ✅</li>
                <li>Properly written Dockerfiles make CI/CD pipelines reliable ✅</li>
                <li>Hands-on practice ensures real-time application of container skills ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 5.5</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Purpose and structure of a Dockerfile</li>
              <li>Key Dockerfile instructions: FROM, WORKDIR, COPY, RUN, CMD, EXPOSE, ENV</li>
              <li>Build and run Docker images from Dockerfile</li>
              <li>Multi-stage builds for optimized images</li>
              <li>Hands-on beginner-level containerization skills</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Container Best Practices',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Container Best Practices Matter</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Containers are powerful tools, but mismanagement can lead to:
          </p>
          <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Large, slow-to-build images</li>
            <li>Resource waste</li>
            <li>Security vulnerabilities</li>
            <li>CI/CD pipeline failures</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            By following best practices, DevOps engineers ensure scalable, efficient, and secure container deployments.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">1. Use Minimal Base Images</h3>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Choose lightweight, official images (e.g., <code>alpine</code>, <code>openjdk:11-jre-slim</code>).</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Reduces image size and build time</li>
            <li>Less attack surface → more secure</li>
          </ul>
          <div class="bg-gray-900 p-3 rounded-lg mb-6">
            <code class="text-green-400 font-mono text-sm">FROM openjdk:11-jre-slim</code>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">2. Keep Images Small and Layered Efficiently</h3>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Combine commands to reduce layers:</p>
          <div class="bg-gray-900 p-3 rounded-lg mb-4 overflow-x-auto">
            <pre class="text-gray-300 font-mono text-sm">
# Bad: multiple RUN commands
RUN apt-get update
RUN apt-get install -y curl

# Good: combine in one layer
RUN apt-get update && apt-get install -y curl
            </pre>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300">Smaller images → faster deployment and CI/CD pipelines.</p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">3. Avoid Storing Secrets in Dockerfiles</h3>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Never hardcode passwords, API keys, or tokens.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Use environment variables, secret managers, or CI/CD variables.</p>
          <div class="bg-gray-900 p-3 rounded-lg mb-6">
            <pre class="text-gray-300 font-mono text-sm">
ENV DB_USER=myuser
# Password should be injected via CI/CD, not in Dockerfile
            </pre>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">4. Tag Images Properly</h3>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Use version tags instead of <code>latest</code> in pipelines.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Helps in rollback and reproducibility.</p>
          <div class="bg-gray-900 p-3 rounded-lg mb-6">
            <code class="text-green-400 font-mono text-sm">docker build -t demo-app:1.0 .</code><br/>
            <code class="text-green-400 font-mono text-sm">docker push myrepo/demo-app:1.0</code>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">5. Use Multi-Stage Builds for Optimized Images</h3>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Separate build and runtime environments. Reduces image size and dependencies.</p>
          <div class="bg-gray-900 p-3 rounded-lg mb-6 overflow-x-auto">
            <pre class="text-gray-300 font-mono text-sm">
# Build Stage
FROM maven:3.9.2-openjdk-11 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package

# Runtime Stage
FROM openjdk:11-jre
WORKDIR /app
COPY --from=builder /app/target/demo-app.jar .
CMD ["java", "-jar", "demo-app.jar"]
            </pre>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">6. Manage Volumes and Data Properly</h3>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Use volumes for persistent storage. Avoid storing logs or data inside container filesystem.</p>
          <div class="bg-gray-900 p-3 rounded-lg mb-4">
            <code class="text-green-400 font-mono text-sm">docker run -v mydata:/app/data demo-app:1.0</code>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300">Keeps containers stateless → easier to scale.</p>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">7. Monitor Resource Usage</h3>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Containers share host resources. Avoid overconsumption → can affect other containers.</p>
          <div class="bg-gray-900 p-3 rounded-lg mb-4">
            <code class="text-green-400 font-mono text-sm">docker stats</code>
          </div>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Limits can be applied in production:</p>
          <div class="bg-gray-900 p-3 rounded-lg mb-6">
            <code class="text-green-400 font-mono text-sm">docker run -d --memory=512m --cpus=1 demo-app:1.0</code>
          </div>

          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">8. Clean Up Unused Containers and Images</h3>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Avoid clutter → frees disk space.</p>
          <div class="bg-gray-900 p-3 rounded-lg mb-4">
            <code class="text-green-400 font-mono text-sm">docker container prune</code><br/>
            <code class="text-green-400 font-mono text-sm">docker image prune</code><br/>
            <code class="text-green-400 font-mono text-sm">docker volume prune</code>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300">Automate cleanup in CI/CD pipelines if needed.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World DevOps Scenario</h2>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">A DevOps engineer deploying microservices:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>Each service has its own optimized container</li>
              <li>Uses multi-stage builds → small images → fast CI/CD</li>
              <li>Environment variables & secrets handled via CI/CD → secure</li>
              <li>Resource limits applied → avoids host overload</li>
              <li>Old containers & images cleaned automatically</li>
            </ul>
            <p class="mt-3 text-sm text-blue-700 dark:text-blue-400 font-medium">✅ Result: efficient, secure, and scalable container management</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Build Optimized Image',
            content: `docker build -t demo-app:1.0 .`
          },
          {
            title: 'Run Container with Resource Limits',
            content: `docker run -d -p 8080:8080 --memory=512m --cpus=1 demo-app:1.0`
          },
          {
            title: 'Use Volume for Persistent Data',
            content: `docker run -d -v mydata:/app/data demo-app:1.0`
          },
          {
            title: 'Clean Unused Containers & Images',
            content: `docker container prune -f
docker image prune -f
docker volume prune -f`
          },
          {
            title: 'Tag & Push Image to Registry',
            content: `docker tag demo-app:1.0 myrepo/demo-app:1.0
docker push myrepo/demo-app:1.0`
          }
        ],
        terminalCommands: [
          'docker build -t demo-app:1.0 .',
          'docker run -d -p 8080:8080 --memory=512m --cpus=1 --name demo-app demo-app:1.0',
          'docker stats',
          'docker run -d -v mydata:/app/data --name demo-app demo-app:1.0',
          'docker volume ls',
          'docker stop demo-app',
          'docker rm demo-app',
          'docker image prune -f',
          'docker volume prune -f'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on exercises for container best practices.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Build Optimized Image</h3>
              <p class="text-sm text-gray-400 mb-2">Observe layer creation and ensure image size is small.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker build -t demo-app:1.0 .</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Run Container with Limits</h3>
              <p class="text-sm text-gray-400 mb-2">Apply memory and CPU limits.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker run -d -p 8080:8080 --memory=512m --cpus=1 --name demo-app demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker stats</code>
              <p class="text-sm text-gray-500 mt-2 italic">Observe memory & CPU usage.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Attach Volume</h3>
              <p class="text-sm text-gray-400 mb-2">Verify persistent storage.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker run -d -v mydata:/app/data --name demo-app demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker volume ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Clean Up Unused Containers/Images</h3>
              <p class="text-sm text-gray-400 mb-2">Cleanup resources.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker stop demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker rm demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker image prune -f</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mt-1">docker volume prune -f</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Containers must be lightweight, secure, and reproducible ✅</li>
                <li>Multi-stage builds and volumes optimize CI/CD pipelines ✅</li>
                <li>Resource limits and cleanup prevent host overload ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 5.6</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Container best practices for DevOps pipelines</li>
              <li>Optimized image creation and multi-stage builds</li>
              <li>Using volumes for persistence</li>
              <li>Running containers with resource limits</li>
              <li>Cleaning up old containers/images for efficient CI/CD</li>
              <li>Hands-on, practical container management skills</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Docker in DevOps Pipelines',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Use Docker in DevOps Pipelines?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Docker allows consistency and automation in CI/CD pipelines:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">Consistent Environments</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Build, test, and production containers are identical</li>
                <li>Avoids “works on my machine” issues</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">Faster Builds and Tests</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Containers start instantly</li>
                <li>Multiple containers can run in parallel</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">Scalable Deployments</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Easily deploy microservices using container orchestration</li>
                <li>Containers can scale automatically</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-[#00bceb] mb-2">Simplified Rollbacks</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Docker images are versioned → easy to rollback to previous stable version</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Docker in a Typical CI/CD Pipeline</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Example Workflow:</p>
          <div class="space-y-3 mb-6">
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb] w-32">Code Commit</span>
              <span class="text-gray-700 dark:text-gray-300">→ Jenkins pipeline triggered</span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb] w-32">Build Stage</span>
              <span class="text-gray-700 dark:text-gray-300">→ Docker image is built from Dockerfile</span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb] w-32">Test Stage</span>
              <span class="text-gray-700 dark:text-gray-300">→ Application runs in a container, automated tests executed</span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb] w-32">Package Stage</span>
              <span class="text-gray-700 dark:text-gray-300">→ Container image is tagged with version</span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb] w-32">Push Stage</span>
              <span class="text-gray-700 dark:text-gray-300">→ Image pushed to Docker registry (Docker Hub or private)</span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="font-bold text-[#00bceb] w-32">Deploy Stage</span>
              <span class="text-gray-700 dark:text-gray-300">→ Deployment server pulls image and runs container</span>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-1">Key Point</h4>
            <p class="text-sm text-blue-700 dark:text-blue-400">CI/CD pipelines rely on Docker images and containers to ensure reproducible builds and deployments.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Scenario</h2>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">A developer pushes code to GitHub:</h4>
            <ol class="list-decimal pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>Jenkins pipeline pulls latest code</li>
              <li>Builds Docker image <code class="text-[#00bceb]">demo-app:1.0</code></li>
              <li>Runs tests in a container</li>
              <li>Pushes image to registry</li>
              <li>Deployment server pulls the image → runs container in production</li>
            </ol>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Outcome: automated, reliable, and scalable deployment</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Step 1: Build Docker Image in Pipeline',
            content: `docker build -t demo-app:1.0 .`
          },
          {
            title: 'Step 2: Run Container for Testing',
            content: `docker run -d --name test-demo-app -p 8080:8080 demo-app:1.0
# Run automated tests inside this container`
          },
          {
            title: 'Step 3: Stop and Remove Test Container',
            content: `docker stop test-demo-app
docker rm test-demo-app`
          },
          {
            title: 'Step 4: Tag and Push Image to Registry',
            content: `docker tag demo-app:1.0 myrepo/demo-app:1.0
docker push myrepo/demo-app:1.0`
          },
          {
            title: 'Step 5: Pull & Deploy in Production',
            content: `docker pull myrepo/demo-app:1.0
docker run -d -p 80:8080 demo-app:1.0`
          },
          {
            title: 'Jenkins Pipeline Example (Declarative)',
            content: `pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-username/demo-app.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t demo-app:1.0 .'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'docker run --name test-demo-app demo-app:1.0 mvn test'
            }
        }
        stage('Push Image') {
            steps {
                sh 'docker tag demo-app:1.0 myrepo/demo-app:1.0'
                sh 'docker push myrepo/demo-app:1.0'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker run -d -p 80:8080 demo-app:1.0'
            }
        }
    }
}`
          }
        ],
        terminalCommands: [
          'docker build -t demo-app:1.0 .',
          'docker run -d --name test-demo-app -p 8080:8080 demo-app:1.0',
          'docker exec -it test-demo-app mvn test',
          'docker stop test-demo-app',
          'docker rm test-demo-app',
          'docker tag demo-app:1.0 myrepo/demo-app:1.0',
          'docker push myrepo/demo-app:1.0',
          'docker pull myrepo/demo-app:1.0',
          'docker run -d -p 80:8080 demo-app:1.0',
          'docker ps'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on Docker integration in a DevOps pipeline.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Build Docker Image</h3>
              <p class="text-sm text-gray-400 mb-2">Simulate the build stage.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker build -t demo-app:1.0 .</code>
              <p class="text-xs text-gray-500 mt-2">Observe build logs.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Run Container for Testing</h3>
              <p class="text-sm text-gray-400 mb-2">Start container and run tests.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker run -d --name test-demo-app -p 8080:8080 demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker exec -it test-demo-app mvn test</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Stop & Remove Test Container</h3>
              <p class="text-sm text-gray-400 mb-2">Cleanup after tests.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker stop test-demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker rm test-demo-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Tag & Push Image</h3>
              <p class="text-sm text-gray-400 mb-2">Prepare for deployment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker tag demo-app:1.0 myrepo/demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker push myrepo/demo-app:1.0</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Deploy Container</h3>
              <p class="text-sm text-gray-400 mb-2">Simulate production deployment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker pull myrepo/demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker run -d -p 80:8080 demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker ps</code>
              <p class="text-xs text-gray-500 mt-2">Verify container is running successfully.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Docker ensures consistent environments across CI/CD stages ✅</li>
                <li>Automated builds and tests reduce manual errors ✅</li>
                <li>Tagged images make version control and rollback simple ✅</li>
                <li>Containers integrate seamlessly into DevOps pipelines ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 5.7</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Docker role in CI/CD pipelines</li>
              <li>Hands-on build, test, tag, push, deploy workflow</li>
              <li>How to run automated tests inside containers</li>
              <li>Practical knowledge of pipeline integration using Docker</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Hands-On: Dockerize Application',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Is Dockerizing an Application?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Dockerizing means packaging an application with all its dependencies into a Docker container so it can run anywhere consistently.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-[#00bceb]">Benefits:</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Eliminates environment mismatch errors</li>
            <li>Enables rapid CI/CD deployment</li>
            <li>Makes scaling and rolling back easy</li>
          </ul>

          <p class="mb-4 text-gray-700 dark:text-gray-300">This exercise combines:</p>
          <div class="flex flex-wrap gap-2 mb-6">
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Dockerfile creation</span>
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Image building</span>
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Container running</span>
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Volume management</span>
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">DevOps workflow</span>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Application Overview</h2>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <p class="mb-2 text-gray-700 dark:text-gray-300">We will dockerize a sample Java Spring Boot application:</p>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><span class="font-bold">Language:</span> Java</li>
              <li><span class="font-bold">Build Tool:</span> Maven</li>
              <li><span class="font-bold">App Function:</span> Simple “Hello World” REST API</li>
            </ul>
            <p class="mt-3 text-sm font-semibold text-[#00bceb]">Objective: Students will create a Dockerfile, build image, run container, and test the application in a hands-on pipeline workflow.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Step-by-Step Plan</h2>
          <ol class="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Prepare the application project</li>
            <li>Write a Dockerfile</li>
            <li>Build Docker image</li>
            <li>Run container locally</li>
            <li>Test container</li>
            <li>Add volume for persistence</li>
            <li>Tag and push image to registry</li>
            <li>Deploy container in a simulated production environment</li>
          </ol>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Dockerfile Example',
            content: `# Base image
FROM openjdk:11-jdk

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Build the application
RUN mvn clean package

# Expose application port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/demo-app-1.0.0.jar"]`
          },
          {
            title: 'Step 1: Build Docker Image',
            content: `docker build -t demo-app:1.0 .
# Builds the application image from Dockerfile`
          },
          {
            title: 'Step 2: Run Container Locally',
            content: `docker run -d -p 8080:8080 --name demo-app demo-app:1.0
docker ps
# Container starts in detached mode, App accessible at http://localhost:8080`
          },
          {
            title: 'Step 3: Test Application',
            content: `curl http://localhost:8080/hello
# Should return: Hello World!`
          },
          {
            title: 'Step 4: Add Volume (Optional for Logs/Storage)',
            content: `docker run -d -p 8080:8080 -v demo-logs:/app/logs --name demo-app demo-app:1.0
# Persists log files even if container is removed`
          },
          {
            title: 'Step 5: Stop & Remove Container',
            content: `docker stop demo-app
docker rm demo-app`
          },
          {
            title: 'Step 6: Tag & Push Image to Registry',
            content: `docker tag demo-app:1.0 myrepo/demo-app:1.0
docker push myrepo/demo-app:1.0
# Push image to Docker Hub or private registry`
          },
          {
            title: 'Step 7: Deploy Container from Registry',
            content: `docker pull myrepo/demo-app:1.0
docker run -d -p 80:8080 demo-app:1.0`
          }
        ],
        terminalCommands: [
          'mkdir demo-app',
          'cd demo-app',
          'nano Dockerfile',
          'docker build -t demo-app:1.0 .',
          'docker run -d -p 8080:8080 --name demo-app demo-app:1.0',
          'docker ps',
          'curl http://localhost:8080/hello',
          'docker stop demo-app',
          'docker rm demo-app',
          'docker tag demo-app:1.0 myrepo/demo-app:1.0',
          'docker push myrepo/demo-app:1.0',
          'docker pull myrepo/demo-app:1.0',
          'docker run -d -p 80:8080 demo-app:1.0',
          'docker ps'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Full Dockerization workflow for beginners.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Prepare Project</h3>
              <p class="text-sm text-gray-400 mb-2">Create project directory.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd demo-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Write Dockerfile</h3>
              <p class="text-sm text-gray-400 mb-2">Define the image build process.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">nano Dockerfile</code>
              <div class="mt-2 bg-gray-800 p-2 rounded text-xs text-gray-300 font-mono">
                FROM openjdk:11-jdk<br>
                WORKDIR /app<br>
                COPY . /app<br>
                RUN mvn clean package<br>
                EXPOSE 8080<br>
                CMD ["java", "-jar", "target/demo-app-1.0.0.jar"]
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Build & Run Image</h3>
              <p class="text-sm text-gray-400 mb-2">Create image and start container.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker build -t demo-app:1.0 .</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker run -d -p 8080:8080 --name demo-app demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker ps</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Test App</h3>
              <p class="text-sm text-gray-400 mb-2">Verify it works.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">curl http://localhost:8080/hello</code>
              <p class="text-xs text-gray-500 mt-2">Should return "Hello World!".</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Cleanup & Push</h3>
              <p class="text-sm text-gray-400 mb-2">Prepare for registry.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker stop demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker rm demo-app</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker tag demo-app:1.0 myrepo/demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker push myrepo/demo-app:1.0</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Deploy Container</h3>
              <p class="text-sm text-gray-400 mb-2">Deploy from registry.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker pull myrepo/demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker run -d -p 80:8080 demo-app:1.0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker ps</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Dockerizing ensures reproducible, portable environments ✅</li>
                <li>CI/CD pipelines rely on images and containers for automation ✅</li>
                <li>Hands-on practice builds confidence for real DevOps projects ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 5.8</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Complete workflow to dockerize an application</li>
              <li>Build image, run container, test app, add volumes</li>
              <li>Push images to registry and deploy in production</li>
              <li>Real hands-on application of all previous Docker topics</li>
            </ul>
          </div>
        `
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Module 6 — Cloud Basics for DevOps',
    duration: '1 week',
    description: 'Introduction to Cloud Computing, AWS basics, security, and deploying apps to the cloud.',
    lessons: [
      {
        title: 'What is Cloud Computing?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Cloud Computing</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Cloud Computing is the delivery of computing services—servers, storage, databases, networking, software, analytics, and more—over the internet (“the cloud”).
          </p>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            Instead of owning physical servers or data centers, DevOps engineers can rent resources on-demand from cloud providers like AWS, Azure, or Google Cloud.
          </p>

          <h3 class="text-lg font-semibold mb-2 text-[#00bceb]">Benefits for DevOps:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-gray-900 dark:text-white mb-1">Scalability</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Automatically scale resources up or down based on demand.</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-gray-900 dark:text-white mb-1">Cost-Efficiency</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Pay only for what you use.</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-gray-900 dark:text-white mb-1">Global Availability</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Deploy applications closer to users worldwide.</p>
            </div>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-gray-900 dark:text-white mb-1">Faster Deployment</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Provision servers, storage, and networking quickly.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Types of Cloud Services</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
              <h3 class="font-bold text-blue-800 dark:text-blue-300">IaaS (Infrastructure as a Service)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Provides virtual machines, storage, and networks. DevOps engineers manage OS, applications, and runtime.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">Example: AWS EC2, Google Compute Engine</p>
            </div>
            <div class="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
              <h3 class="font-bold text-green-800 dark:text-green-300">PaaS (Platform as a Service)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Provides platform and tools to build and deploy applications. DevOps engineers focus on application deployment, not infrastructure.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">Example: AWS Elastic Beanstalk, Google App Engine</p>
            </div>
            <div class="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
              <h3 class="font-bold text-purple-800 dark:text-purple-300">SaaS (Software as a Service)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Delivers fully managed software over the internet. End-users don’t manage infrastructure or platforms.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">Example: Gmail, Salesforce</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How Cloud Supports DevOps</h2>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li><span class="font-bold">Infrastructure on Demand:</span> Spin up test/staging/production servers instantly.</li>
            <li><span class="font-bold">Automation:</span> Use APIs to create, update, and delete resources programmatically.</li>
            <li><span class="font-bold">Collaboration:</span> Teams can share cloud resources globally.</li>
            <li><span class="font-bold">Continuous Deployment:</span> Cloud integrates with CI/CD pipelines to deploy apps in seconds.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Scenario</h2>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">A DevOps team deploying a microservices application:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Each service runs in a Docker container</li>
              <li>Containers are deployed to AWS EC2 instances or ECS</li>
              <li>CI/CD pipeline automatically provisions resources, runs tests, and deploys containers</li>
              <li>The application scales automatically when user traffic increases</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Result: fast, reliable, and scalable deployments without maintaining physical servers</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Step 1: Install AWS CLI',
            content: `# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version`
          },
          {
            title: 'Step 2: Configure AWS CLI',
            content: `aws configure
# Enter:
# AWS Access Key ID
# AWS Secret Access Key
# Default region (e.g., us-east-1)
# Default output format (json)`
          },
          {
            title: 'Step 3: List Available EC2 Instances',
            content: `aws ec2 describe-instances
# Shows all EC2 instances in the selected region`
          },
          {
            title: 'Step 4: Check Available S3 Buckets',
            content: `aws s3 ls
# Lists all storage buckets`
          },
          {
            title: 'Step 5: Launch a Simple EC2 Instance',
            content: `aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro \\
  --key-name MyKeyPair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-6e7f829e
# This launches a cloud server ready for deployment`
          }
        ],
        terminalCommands: [
          'aws --version',
          'aws configure',
          'aws ec2 describe-instances',
          'aws s3 ls',
          'aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on exploration of cloud resources via AWS CLI.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Verify AWS CLI Installation</h3>
              <p class="text-sm text-gray-400 mb-2">Confirms CLI is ready for use.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws --version</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Configure Access</h3>
              <p class="text-sm text-gray-400 mb-2">Enter keys, region, and output format.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws configure</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: List Cloud Resources</h3>
              <p class="text-sm text-gray-400 mb-2">Observe the existing infrastructure.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 describe-instances</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Launch Test Cloud Instance</h3>
              <p class="text-sm text-gray-400 mb-2">Instance ready for testing deployments.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Cloud resources are on-demand and scalable ✅</li>
                <li>CLI access allows automation and integration with pipelines ✅</li>
                <li>Understanding cloud basics is critical for modern DevOps workflows ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 6.1</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Definition and benefits of cloud computing</li>
              <li>Types of cloud services: IaaS, PaaS, SaaS</li>
              <li>How cloud supports DevOps and CI/CD pipelines</li>
              <li>Basic AWS CLI commands to explore resources</li>
              <li>Hands-on practice launching cloud infrastructure</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Cloud Service Models',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Cloud Service Models</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Cloud computing is divided into three main service models that DevOps engineers must understand to deploy and manage applications effectively:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>IaaS</strong> – Infrastructure as a Service</li>
            <li><strong>PaaS</strong> – Platform as a Service</li>
            <li><strong>SaaS</strong> – Software as a Service</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            Each model provides different levels of control, management, and automation.
          </p>

          <div class="space-y-6 mb-8">
            <div class="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <h3 class="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">1. IaaS (Infrastructure as a Service)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Definition:</strong> IaaS provides virtualized computing resources over the internet. It allows teams to rent servers, storage, and networking on-demand.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h4 class="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Key Features</h4>
                  <ul class="list-disc pl-4 text-sm text-gray-600 dark:text-gray-400">
                    <li>Full control of virtual machines</li>
                    <li>Install OS, middleware, and applications</li>
                    <li>Pay only for what you use</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">DevOps Use Case</h4>
                  <ul class="list-disc pl-4 text-sm text-gray-600 dark:text-gray-400">
                    <li>Deploy Docker containers on EC2 instances</li>
                    <li>Automate server provisioning with Terraform/Ansible</li>
                  </ul>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 font-mono">Examples: AWS EC2, Google Compute Engine, Azure VMs</p>
            </div>

            <div class="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <h3 class="text-lg font-bold text-green-800 dark:text-green-300 mb-2">2. PaaS (Platform as a Service)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Definition:</strong> PaaS provides a ready-to-use platform for developing, testing, and deploying applications without worrying about underlying infrastructure.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h4 class="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Key Features</h4>
                  <ul class="list-disc pl-4 text-sm text-gray-600 dark:text-gray-400">
                    <li>Automatic scaling and load balancing</li>
                    <li>Pre-configured runtime environments</li>
                    <li>Integrated databases and monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">DevOps Use Case</h4>
                  <ul class="list-disc pl-4 text-sm text-gray-600 dark:text-gray-400">
                    <li>Deploy containerized apps without managing servers</li>
                    <li>Focus on application logic, platform handles scaling</li>
                  </ul>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 font-mono">Examples: AWS Elastic Beanstalk, Google App Engine, Heroku</p>
            </div>

            <div class="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <h3 class="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">3. SaaS (Software as a Service)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Definition:</strong> SaaS delivers fully managed applications accessible via the internet. Users don’t manage servers, storage, or platform updates.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h4 class="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Key Features</h4>
                  <ul class="list-disc pl-4 text-sm text-gray-600 dark:text-gray-400">
                    <li>Accessible via web or mobile</li>
                    <li>Subscription-based pricing</li>
                    <li>Automatic updates and maintenance</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">DevOps Use Case</h4>
                  <ul class="list-disc pl-4 text-sm text-gray-600 dark:text-gray-400">
                    <li>Use SaaS tools like Jenkins, GitHub, Docker Hub</li>
                    <li>Focus on building pipelines, not hosting tools</li>
                  </ul>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 font-mono">Examples: Gmail, Slack, Salesforce</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Comparison Table</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">Feature</th>
                  <th scope="col" class="px-4 py-2">IaaS</th>
                  <th scope="col" class="px-4 py-2">PaaS</th>
                  <th scope="col" class="px-4 py-2">SaaS</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Control</td>
                  <td class="px-4 py-2 text-green-600">High</td>
                  <td class="px-4 py-2 text-yellow-600">Medium</td>
                  <td class="px-4 py-2 text-red-600">Low</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Infrastructure</td>
                  <td class="px-4 py-2">Managed by User</td>
                  <td class="px-4 py-2">Managed by Provider</td>
                  <td class="px-4 py-2">Managed by Provider</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">Examples</td>
                  <td class="px-4 py-2">EC2, VMs</td>
                  <td class="px-4 py-2">Elastic Beanstalk, Heroku</td>
                  <td class="px-4 py-2">Gmail, Slack</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-bold">DevOps Role</td>
                  <td class="px-4 py-2">Provision & Deploy</td>
                  <td class="px-4 py-2">Deploy Apps</td>
                  <td class="px-4 py-2">Use Services</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Scenario</h2>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">A DevOps engineer deploying a microservice application:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>IaaS:</strong> Creates EC2 instances → deploys containers → manages networking</li>
              <li><strong>PaaS:</strong> Pushes containerized app to Elastic Beanstalk → platform handles scaling</li>
              <li><strong>SaaS:</strong> Uses Jenkins or GitHub Actions to automate CI/CD pipelines</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Result: flexible, automated, and scalable deployment strategy</p>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'IaaS – Launch EC2 Instance',
            content: `aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro`
          },
          {
            title: 'PaaS – Deploy to Elastic Beanstalk (AWS CLI Example)',
            content: `aws elasticbeanstalk create-application \\
  --application-name demo-app

aws elasticbeanstalk create-environment \\
  --application-name demo-app \\
  --environment-name demo-env \\
  --solution-stack-name "64bit Amazon Linux 2 v3.5.7 running Corretto 11" \\
  --version-label v1`
          },
          {
            title: 'SaaS – Access Jenkins (Example)',
            content: `Login to Jenkins SaaS instance
Create a pipeline → pull code from GitHub → build & deploy`
          }
        ],
        terminalCommands: [
          'aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro',
          'aws elasticbeanstalk create-environment --application-name demo-app --environment-name demo-env',
          'echo "Opening Jenkins SaaS..."',
          '# Connect GitHub repository → build → deploy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on exercises for cloud service models (IaaS, PaaS, SaaS).</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Launch IaaS Resource</h3>
              <p class="text-sm text-gray-400 mb-2">Provision a virtual machine using AWS CLI.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro</code>
              <p class="text-sm text-gray-500 mt-2 italic">Observe instance creation.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Deploy App on PaaS</h3>
              <p class="text-sm text-gray-400 mb-2">Let the platform handle infrastructure.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws elasticbeanstalk create-environment \\
  --application-name demo-app \\
  --environment-name demo-env \\
  --solution-stack-name "64bit Amazon Linux 2 v3.5.7 running Corretto 11" \\
  --version-label v1</code>
              <p class="text-sm text-gray-500 mt-2 italic">Platform automatically provisions servers and runtime.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Use SaaS Tool</h3>
              <p class="text-sm text-gray-400 mb-2">Simulate using a managed CI/CD tool.</p>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Open Jenkins SaaS → create pipeline</li>
                <li>Connect GitHub repository → build → deploy</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>IaaS → full control, flexible but manual ✅</li>
                <li>PaaS → fast deployments, less management ✅</li>
                <li>SaaS → leverage managed tools for DevOps workflows ✅</li>
                <li>Choosing the right model depends on project requirements ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 6.2</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Difference between IaaS, PaaS, and SaaS</li>
              <li>Key features and examples of each model</li>
              <li>How each model is used in DevOps pipelines</li>
              <li>Hands-on experience launching IaaS/PaaS resources and using SaaS tools</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Introduction to AWS',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is AWS?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>AWS (Amazon Web Services)</strong> is a comprehensive cloud platform offering over 200 services including computing power, storage, networking, databases, AI/ML tools, and DevOps services.
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>AWS is highly scalable, reliable, and secure</li>
            <li>Used by startups, enterprises, and DevOps teams worldwide</li>
            <li>Core services are often integrated into CI/CD pipelines</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Core AWS Services for DevOps</h2>
          <div class="space-y-4 mb-6">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 class="font-bold text-blue-700 dark:text-blue-300 mb-1">Compute</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                <li><strong>AWS EC2</strong> → virtual servers</li>
                <li><strong>AWS Lambda</strong> → serverless functions</li>
              </ul>
            </div>
            <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <h3 class="font-bold text-green-700 dark:text-green-300 mb-1">Storage</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                <li><strong>Amazon S3</strong> → object storage</li>
                <li><strong>EBS</strong> → block storage for EC2 instances</li>
              </ul>
            </div>
            <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <h3 class="font-bold text-purple-700 dark:text-purple-300 mb-1">Networking</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                <li><strong>VPC</strong> → isolated virtual networks</li>
                <li><strong>ELB</strong> → load balancing for applications</li>
              </ul>
            </div>
            <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <h3 class="font-bold text-yellow-700 dark:text-yellow-300 mb-1">Databases</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                <li><strong>RDS</strong> → managed relational databases</li>
                <li><strong>DynamoDB</strong> → NoSQL databases</li>
              </ul>
            </div>
            <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <h3 class="font-bold text-red-700 dark:text-red-300 mb-1">DevOps Tools</h3>
              <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                <li><strong>AWS CodePipeline</strong> → CI/CD</li>
                <li><strong>AWS CodeBuild</strong> → build automation</li>
                <li><strong>AWS CodeDeploy</strong> → automated deployments</li>
                <li><strong>CloudWatch</strong> → monitoring</li>
              </ul>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why AWS Matters for DevOps</h2>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Infrastructure as Code (IaC):</strong> Automate server and resource provisioning using tools like Terraform</li>
            <li><strong>CI/CD Integration:</strong> Build, test, and deploy applications on AWS automatically</li>
            <li><strong>Scalability:</strong> Automatically scale applications with Elastic Load Balancers and Auto Scaling</li>
            <li><strong>Global Availability:</strong> Deploy applications across multiple regions for low latency</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Scenario</h2>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">A DevOps engineer wants to deploy a containerized application:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Docker container image is pushed to Amazon ECR (Elastic Container Registry)</li>
              <li>AWS ECS (Elastic Container Service) pulls the image and runs containers</li>
              <li>Load balancers and Auto Scaling ensure the app handles high traffic</li>
              <li>CloudWatch monitors performance and alerts the team in case of issues</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Outcome: automated, reliable, and scalable deployment on AWS</p>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Step 1: Verify AWS CLI Installation',
            content: `aws --version`
          },
          {
            title: 'Step 2: Configure AWS CLI',
            content: `aws configure
# Enter:
# AWS Access Key ID
# AWS Secret Access Key
# Default region (e.g., us-east-1)
# Output format (json)`
          },
          {
            title: 'Step 3: List AWS Services – EC2 & S3',
            content: `aws ec2 describe-instances
aws s3 ls`
          },
          {
            title: 'Step 4: Launch EC2 Instance (IaaS Example)',
            content: `aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro \\
  --key-name MyKeyPair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-6e7f829e`
          },
          {
            title: 'Step 5: Create S3 Bucket (Storage Example)',
            content: `aws s3 mb s3://my-devops-bucket
aws s3 ls`
          },
          {
            title: 'Step 6: Monitor Resources',
            content: `aws cloudwatch describe-alarms
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --period 300 --statistics Average`
          }
        ],
        terminalCommands: [
          'aws --version',
          'aws configure',
          'aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro',
          'aws s3 mb s3://my-devops-bucket',
          'aws cloudwatch describe-alarms'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on usage of AWS CLI for EC2, S3, and CloudWatch.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Verify CLI</h3>
              <p class="text-sm text-gray-400 mb-2">Should display AWS CLI version.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws --version</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Configure AWS CLI</h3>
              <p class="text-sm text-gray-400 mb-2">Add credentials, region, and output format.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws configure</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Launch EC2 Instance</h3>
              <p class="text-sm text-gray-400 mb-2">Observe instance creation in CLI output.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Create S3 Bucket</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm bucket creation.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 mb s3://my-devops-bucket
aws s3 ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Monitor Metrics</h3>
              <p class="text-sm text-gray-400 mb-2">View CPU utilization and alarms for your instance.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch describe-alarms
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --period 300 --statistics Average</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>AWS allows on-demand infrastructure provisioning ✅</li>
                <li>CLI enables automation and integration with pipelines ✅</li>
                <li>Core services (EC2, S3, CloudWatch) are essential for DevOps workflows ✅</li>
                <li>Hands-on practice builds confidence for cloud-based deployments ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 6.3</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Introduction to AWS and its core services</li>
              <li>How AWS supports DevOps workflows</li>
              <li>Hands-on usage of AWS CLI for EC2, S3, and CloudWatch</li>
              <li>Practical understanding of cloud resources for CI/CD pipelines</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Compute, Storage & Networking',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Compute in the Cloud</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Compute services provide the processing power needed to run applications.
          </p>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>AWS EC2 (Elastic Compute Cloud):</strong> Virtual servers in the cloud</li>
            <li><strong>AWS Lambda:</strong> Serverless computing to run code without managing servers</li>
          </ul>
          
          <div class="p-4 mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
            <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-2">Key Benefits for DevOps:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Deploy scalable apps quickly</li>
              <li>Integrate containers with ECS or EKS</li>
              <li>Automate provisioning using IaC tools like Terraform</li>
            </ul>
            <div class="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/30">
              <p class="text-xs text-gray-500 dark:text-gray-400 italic">Example Use Case: A DevOps engineer deploys a Docker container on EC2. Auto Scaling allows it to handle increased traffic without manual intervention.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Storage in the Cloud</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Cloud storage provides durable, scalable, and accessible storage for applications.
          </p>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Amazon S3 (Simple Storage Service):</strong> Object storage for files, backups, logs</li>
            <li><strong>Amazon EBS (Elastic Block Store):</strong> Persistent block storage for EC2</li>
            <li><strong>Amazon EFS (Elastic File System):</strong> Shared file storage for multiple instances</li>
          </ul>

          <div class="p-4 mb-6 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
            <h4 class="font-bold text-green-700 dark:text-green-400 mb-2">Key Benefits for DevOps:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Persist data even if containers or instances are destroyed</li>
              <li>Store deployment artifacts, logs, and backups</li>
              <li>Integrate storage into CI/CD pipelines for artifacts</li>
            </ul>
            <div class="mt-3 pt-3 border-t border-green-200 dark:border-green-800/30">
              <p class="text-xs text-gray-500 dark:text-gray-400 italic">Example Use Case: CI/CD pipeline stores Docker images or build artifacts in S3. Applications access these artifacts during deployment.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Networking in the Cloud</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Networking services ensure connectivity, security, and traffic management for applications.
          </p>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>VPC (Virtual Private Cloud):</strong> Isolated virtual networks for resources</li>
            <li><strong>Subnets:</strong> Divide VPC into smaller networks</li>
            <li><strong>Security Groups:</strong> Act as virtual firewalls</li>
            <li><strong>Elastic Load Balancers (ELB):</strong> Distribute traffic across instances</li>
            <li><strong>Route 53:</strong> DNS service for routing traffic globally</li>
          </ul>

          <div class="p-4 mb-6 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
            <h4 class="font-bold text-purple-700 dark:text-purple-400 mb-2">Key Benefits for DevOps:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Securely connect microservices</li>
              <li>Scale applications behind load balancers</li>
              <li>Enable multi-region deployments</li>
            </ul>
            <div class="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800/30">
              <p class="text-xs text-gray-500 dark:text-gray-400 italic">Example Use Case: A microservice application runs multiple EC2 instances behind an ELB. VPC ensures secure communication, and Route 53 routes user requests to the nearest region.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World DevOps Scenario</h2>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>CI/CD pipeline builds a Docker image</li>
              <li>Image pushed to Amazon ECR</li>
              <li>EC2 instances in a VPC run the containers</li>
              <li>ELB distributes incoming requests to instances</li>
              <li>Logs are stored in S3, metrics monitored via CloudWatch</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Outcome: Fully automated, scalable, and secure cloud deployment</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Compute – Launch EC2 Instance',
            content: `aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro \\
  --key-name MyKeyPair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-6e7f829e`
          },
          {
            title: 'Storage – Create S3 Bucket and Upload File',
            content: `# Create S3 bucket
aws s3 mb s3://my-devops-bucket

# Upload file to bucket
aws s3 cp demo-app.jar s3://my-devops-bucket/`
          },
          {
            title: 'Networking – Create Security Group',
            content: `# Create a security group
aws ec2 create-security-group --group-name DevOpsSG --description "Security group for DevOps"

# Allow SSH access
aws ec2 authorize-security-group-ingress --group-name DevOpsSG --protocol tcp --port 22 --cidr 0.0.0.0/0`
          },
          {
            title: 'Networking – Describe VPCs',
            content: `aws ec2 describe-vpcs

# Shows all VPCs and network details`
          }
        ],
        terminalCommands: [
          'aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro',
          'aws s3 mb s3://my-devops-bucket',
          'aws s3 cp demo-app.jar s3://my-devops-bucket/',
          'aws s3 ls s3://my-devops-bucket/',
          'aws ec2 create-security-group --group-name DevOpsSG --description "Security group for DevOps"',
          'aws ec2 authorize-security-group-ingress --group-name DevOpsSG --protocol tcp --port 22 --cidr 0.0.0.0/0',
          'aws ec2 describe-security-groups --group-names DevOpsSG',
          'aws ec2 describe-vpcs'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice with AWS core services (Compute, Storage, Networking).</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Launch EC2 Instance</h3>
              <p class="text-sm text-gray-400 mb-2">Provision virtual compute resources.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro</code>
              <p class="text-sm text-gray-500 mt-2 italic">Observe instance creation.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Create S3 Bucket and Upload File</h3>
              <p class="text-sm text-gray-400 mb-2">Manage object storage.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws s3 mb s3://my-devops-bucket</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws s3 cp demo-app.jar s3://my-devops-bucket/</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls s3://my-devops-bucket/</code>
              <p class="text-sm text-gray-500 mt-2 italic">Confirm file is uploaded.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create Security Group</h3>
              <p class="text-sm text-gray-400 mb-2">Configure network security.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 create-security-group --group-name DevOpsSG --description "Security group for DevOps"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 authorize-security-group-ingress --group-name DevOpsSG --protocol tcp --port 22 --cidr 0.0.0.0/0</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 describe-security-groups --group-names DevOpsSG</code>
              <p class="text-sm text-gray-500 mt-2 italic">Verify security group rules.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Check VPCs</h3>
              <p class="text-sm text-gray-400 mb-2">Inspect network configuration.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 describe-vpcs</code>
              <p class="text-sm text-gray-500 mt-2 italic">Observe network configuration.</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Compute = run scalable applications ✅</li>
                <li>Storage = persist artifacts and logs ✅</li>
                <li>Networking = secure and distribute traffic ✅</li>
                <li>Hands-on practice builds real-world cloud deployment skills ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 6.4</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Core AWS services for compute, storage, and networking</li>
              <li>Hands-on usage of EC2, S3, and VPC security groups</li>
              <li>How these components integrate into DevOps pipelines</li>
              <li>Practical understanding for scalable and secure cloud deployments</li>
            </ul>
          </div>
        `
      },
      {
        title: 'DevOps in Cloud',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why DevOps in Cloud?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Cloud platforms like AWS provide all the tools needed to implement end-to-end DevOps workflows.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Benefits:</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Automation:</strong> Provision infrastructure, deploy apps, and run tests automatically</li>
            <li><strong>Scalability:</strong> Cloud resources scale with traffic, no manual intervention</li>
            <li><strong>Consistency:</strong> Environments (dev, test, prod) are identical</li>
            <li><strong>CI/CD Integration:</strong> Cloud services integrate seamlessly with Jenkins, GitHub Actions, or AWS CodePipeline</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Key Cloud Services for DevOps</h3>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-2">DevOps Task</th>
                  <th scope="col" class="px-4 py-2">AWS Service</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">Version Control</td>
                  <td class="px-4 py-2">CodeCommit / GitHub</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">Build Automation</td>
                  <td class="px-4 py-2">CodeBuild / Jenkins</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">Deployment Automation</td>
                  <td class="px-4 py-2">CodeDeploy / Elastic Beanstalk / ECS</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">CI/CD Orchestration</td>
                  <td class="px-4 py-2">CodePipeline</td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">Monitoring & Logging</td>
                  <td class="px-4 py-2">CloudWatch / CloudTrail</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-4 py-2 font-medium">Infrastructure as Code</td>
                  <td class="px-4 py-2">CloudFormation / Terraform</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Example DevOps Workflow in AWS Cloud</h3>
          <div class="p-4 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <ol class="list-decimal pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Developer pushes code to AWS CodeCommit (Git repository)</li>
              <li>CodePipeline triggers automated build using CodeBuild</li>
              <li>Docker image is built and pushed to Amazon ECR</li>
              <li>Deployment to EC2, ECS, or Elastic Beanstalk</li>
              <li>Logs and metrics monitored via CloudWatch</li>
              <li>Alerts sent automatically on failures</li>
            </ol>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Outcome: fully automated cloud-based DevOps workflow</p>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Advantages of Cloud-based DevOps</h3>
          <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Fast Deployment:</strong> Spin up servers instantly</li>
            <li><strong>Reduced Costs:</strong> Pay only for resources used</li>
            <li><strong>Global Availability:</strong> Deploy applications closer to users</li>
            <li><strong>Infrastructure as Code:</strong> Automate entire environment</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Step 1: Push Code to CodeCommit',
            content: `# Clone repository
git clone https://git-codecommit.us-east-1.amazonaws.com/v1/repos/demo-app
cd demo-app

# Add files and commit
git add .
git commit -m "Initial commit"
git push origin main`
          },
          {
            title: 'Step 2: Build Docker Image in CodeBuild',
            content: `aws codebuild start-build --project-name demo-app-build

# AWS CodeBuild fetches code, runs Docker build, and pushes image to ECR`
          },
          {
            title: 'Step 3: Deploy to ECS Cluster',
            content: `aws ecs create-cluster --cluster-name demo-cluster

aws ecs create-service \\
  --cluster demo-cluster \\
  --service-name demo-service \\
  --task-definition demo-task \\
  --desired-count 1

# Deploy containerized application in ECS cluster`
          },
          {
            title: 'Step 4: Monitor with CloudWatch',
            content: `aws cloudwatch describe-alarms

aws cloudwatch get-metric-statistics \\
  --namespace AWS/ECS \\
  --metric-name CPUUtilization \\
  --period 300 \\
  --statistics Average

# Monitor CPU and memory usage of containers`
          }
        ],
        terminalCommands: [
          'aws configure',
          'git add . && git commit -m "Deploy to cloud" && git push origin main',
          'aws codebuild start-build --project-name demo-app-build',
          'aws ecs create-cluster --cluster-name demo-cluster',
          'aws ecs create-service --cluster demo-cluster --service-name demo-service --task-definition demo-task --desired-count 1',
          'aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name CPUUtilization --period 300 --statistics Average'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice integrating DevOps workflows in the cloud.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Configure AWS CLI</h3>
              <p class="text-sm text-gray-400 mb-2">Enter credentials, region, and output format.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws configure</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Push Code to Cloud Repository</h3>
              <p class="text-sm text-gray-400 mb-2">Verify commit in CodeCommit.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add .</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git commit -m "Deploy to cloud"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push origin main</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Trigger Build in CodeBuild</h3>
              <p class="text-sm text-gray-400 mb-2">Monitor build logs in terminal or AWS console.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws codebuild start-build --project-name demo-app-build</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Deploy Container to ECS</h3>
              <p class="text-sm text-gray-400 mb-2">Verify deployment in ECS console.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ecs create-cluster --cluster-name demo-cluster</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ecs create-service \\
  --cluster demo-cluster \\
  --service-name demo-service \\
  --task-definition demo-task \\
  --desired-count 1</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Monitor Application Metrics</h3>
              <p class="text-sm text-gray-400 mb-2">Check CPU utilization and container health.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch get-metric-statistics \\
  --namespace AWS/ECS \\
  --metric-name CPUUtilization \\
  --period 300 \\
  --statistics Average</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Cloud allows end-to-end DevOps automation ✅</li>
                <li>CI/CD pipelines can build, test, deploy, and monitor apps automatically ✅</li>
                <li>Cloud services reduce manual work and ensure scalable, reliable deployments ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 6.5</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Integration of DevOps workflows in cloud environments</li>
              <li>Hands-on experience with CodeCommit, CodeBuild, ECS, CloudWatch</li>
              <li>How CI/CD pipelines operate fully in the cloud</li>
              <li>Practical skills for deploying scalable and automated applications</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Cloud Security Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Cloud Security</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Cloud security ensures that applications, data, and infrastructure are protected from unauthorized access, data breaches, and cyber threats. In DevOps, security is integrated into every stage of the pipeline, known as <strong>DevSecOps</strong>.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Security Principles:</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Identity & Access Management (IAM):</strong> Control who can access cloud resources</li>
            <li><strong>Encryption:</strong> Protect data at rest and in transit</li>
            <li><strong>Network Security:</strong> Secure communication between resources</li>
            <li><strong>Monitoring & Logging:</strong> Detect suspicious activity</li>
            <li><strong>Compliance:</strong> Meet industry security standards</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Identity & Access Management (IAM)</h2>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>IAM Users & Roles:</strong> Assign permissions to users, groups, or applications</li>
            <li><strong>Least Privilege Principle:</strong> Give only the permissions necessary for a task</li>
            <li><strong>MFA (Multi-Factor Authentication):</strong> Adds extra layer of security</li>
          </ul>
          <div class="p-4 mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
            <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-2">DevOps Example:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Grant Jenkins pipeline role permissions only to deploy apps and access S3/ECR</li>
              <li>Prevent accidental or malicious access to other resources</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Encryption</h2>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Data at Rest:</strong> Encrypt stored data (S3, EBS) using AWS KMS</li>
            <li><strong>Data in Transit:</strong> Use HTTPS/TLS for communication between services</li>
          </ul>
          <div class="p-4 mb-6 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
            <h4 class="font-bold text-green-700 dark:text-green-400 mb-2">DevOps Example:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Docker images stored in ECR are encrypted</li>
              <li>Deployment artifacts in S3 are encrypted</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Network Security</h2>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>VPC Security Groups:</strong> Control inbound/outbound traffic</li>
            <li><strong>Subnets:</strong> Isolate resources based on security requirements</li>
            <li><strong>Firewalls & Load Balancers:</strong> Protect public-facing apps</li>
          </ul>
          <div class="p-4 mb-6 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
            <h4 class="font-bold text-purple-700 dark:text-purple-400 mb-2">DevOps Example:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Only allow traffic on ports 80/443 for web servers</li>
              <li>Restrict database access to app servers within VPC</li>
            </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Monitoring & Logging</h2>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>CloudWatch Logs:</strong> Track application and infrastructure events</li>
            <li><strong>CloudTrail:</strong> Audit API calls and detect suspicious activity</li>
            <li><strong>Alarms:</strong> Automatically notify team of unusual behavior</li>
          </ul>
          
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Compliance & Best Practices</h2>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Follow standards: ISO 27001, GDPR, HIPAA</li>
            <li>Enable logging, encryption, and access controls</li>
            <li>Regularly rotate secrets and API keys</li>
          </ul>

          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p class="text-sm text-green-600 dark:text-green-400 font-bold">✅ Outcome: Secure, compliant, and reliable DevOps pipeline</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Step 1: Create IAM User and Assign Role',
            content: `# Create IAM user
aws iam create-user --user-name devops-user

# Attach AdministratorAccess policy
aws iam attach-user-policy --user-name devops-user --policy-arn arn:aws:iam::aws:policy/AdministratorAccess`
          },
          {
            title: 'Step 2: Enable MFA for IAM User',
            content: `aws iam enable-mfa-device \\
  --user-name devops-user \\
  --serial-number arn:aws:iam::123456789012:mfa/devops-user \\
  --authentication-code1 123456 \\
  --authentication-code2 456789`
          },
          {
            title: 'Step 3: Encrypt S3 Bucket',
            content: `aws s3api put-bucket-encryption \\
  --bucket my-devops-bucket \\
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'`
          },
          {
            title: 'Step 4: Create Security Group (Network Security)',
            content: `aws ec2 create-security-group --group-name DevSecOpsSG --description "Secure DevOps group"

# Allow HTTPS traffic only
aws ec2 authorize-security-group-ingress --group-name DevSecOpsSG --protocol tcp --port 443 --cidr 0.0.0.0/0`
          },
          {
            title: 'Step 5: Enable Logging with CloudTrail',
            content: `aws cloudtrail create-trail --name devops-trail --s3-bucket-name my-devops-bucket

aws cloudtrail start-logging --name devops-trail`
          }
        ],
        terminalCommands: [
          'aws iam create-user --user-name devops-user',
          'aws iam attach-user-policy --user-name devops-user --policy-arn arn:aws:iam::aws:policy/AdministratorAccess',
          'aws iam enable-mfa-device --user-name devops-user --serial-number arn:aws:iam::123456789012:mfa/devops-user --authentication-code1 123456 --authentication-code2 456789',
          'aws s3api put-bucket-encryption --bucket my-devops-bucket --server-side-encryption-configuration \'{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}\'',
          'aws ec2 create-security-group --group-name DevSecOpsSG --description "Secure DevOps group"',
          'aws ec2 authorize-security-group-ingress --group-name DevSecOpsSG --protocol tcp --port 443 --cidr 0.0.0.0/0',
          'aws cloudtrail create-trail --name devops-trail --s3-bucket-name my-devops-bucket',
          'aws cloudtrail start-logging --name devops-trail'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice securing cloud resources with IAM, Encryption, and Logging.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create IAM User</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm user creation and policy attachment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws iam create-user --user-name devops-user</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws iam attach-user-policy --user-name devops-user --policy-arn arn:aws:iam::aws:policy/AdministratorAccess</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Enable MFA</h3>
              <p class="text-sm text-gray-400 mb-2">MFA adds extra login security.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws iam enable-mfa-device --user-name devops-user --serial-number arn:aws:iam::123456789012:mfa/devops-user --authentication-code1 123456 --authentication-code2 456789</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Encrypt S3 Bucket</h3>
              <p class="text-sm text-gray-400 mb-2">Bucket now encrypts all objects by default.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws s3api put-bucket-encryption --bucket my-devops-bucket --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Create Security Group for EC2</h3>
              <p class="text-sm text-gray-400 mb-2">Only HTTPS traffic allowed.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 create-security-group --group-name DevSecOpsSG --description "Secure DevOps group"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 authorize-security-group-ingress --group-name DevSecOpsSG --protocol tcp --port 443 --cidr 0.0.0.0/0</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Enable CloudTrail Logging</h3>
              <p class="text-sm text-gray-400 mb-2">All API activity is now logged for auditing.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws cloudtrail create-trail --name devops-trail --s3-bucket-name my-devops-bucket</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudtrail start-logging --name devops-trail</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>IAM controls who can do what ✅</li>
                <li>Encryption ensures data security at rest and in transit ✅</li>
                <li>Security groups and CloudTrail provide network and audit protection ✅</li>
                <li>Hands-on practice prepares students for real-world secure cloud deployments ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 6.6</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Importance of cloud security in DevOps (DevSecOps)</li>
              <li>Hands-on experience with IAM, MFA, S3 encryption, security groups, and CloudTrail</li>
              <li>How to secure cloud resources while enabling automated DevOps workflows</li>
              <li>Practical knowledge to protect data, infrastructure, and applications</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Cost Awareness',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Cost Awareness Matters in Cloud</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Cloud computing provides on-demand, scalable resources, but if not managed properly, costs can quickly spiral out of control.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            DevOps engineers need to understand cost management to:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Optimize resource usage</li>
            <li>Avoid unnecessary expenses</li>
            <li>Plan budgets for projects</li>
            <li>Ensure cost-efficient scaling of applications</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Cost Factors in Cloud</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Compute Costs:</strong> Charges based on instance type, hours of usage, and region. Idle instances increase costs unnecessarily.</li>
            <li><strong>Storage Costs:</strong> Object storage (S3) billed per GB per month. Block storage (EBS) billed for provisioned size, even if unused.</li>
            <li><strong>Networking Costs:</strong> Data transfer between regions or out to the internet incurs fees. High traffic apps can significantly increase costs.</li>
            <li><strong>Third-Party Services:</strong> Some SaaS or Marketplace tools may have additional charges.</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Strategies for Cost Optimization</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Right-Sizing Instances:</strong> Choose instance types appropriate for workload. Avoid over-provisioning.</li>
            <li><strong>Auto Scaling & Elastic Load Balancing:</strong> Scale resources up/down based on demand. Avoid running large servers at low traffic.</li>
            <li><strong>Monitor and Track Costs:</strong> Use AWS Cost Explorer or CloudWatch metrics. Set alerts for unusual spending.</li>
            <li><strong>Use Reserved or Spot Instances:</strong> Reserved Instances → prepay for predictable workloads. Spot Instances → run flexible workloads at lower cost.</li>
            <li><strong>Clean Up Unused Resources:</strong> Delete idle EC2 instances, unused volumes, or old snapshots.</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World DevOps Scenario</h3>
          <div class="p-4 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p class="mb-2 text-sm text-gray-700 dark:text-gray-300">A DevOps engineer deploying a microservice application:</p>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Monitors EC2 usage and scales automatically using Auto Scaling groups</li>
              <li>Moves static files to S3 with lifecycle policies to reduce storage cost</li>
              <li>Uses Spot Instances for batch processing jobs</li>
              <li>Sets CloudWatch alerts for unexpected spikes in data transfer</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Result: efficient cloud usage, reduced costs, and optimized deployments</p>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Step 1: Check Monthly Cost Using AWS CLI',
            content: `aws ce get-cost-and-usage \\
  --time-period Start=2026-01-01,End=2026-01-31 \\
  --granularity MONTHLY \\
  --metrics "BlendedCost" "UnblendedCost" "UsageQuantity"

# Retrieves usage and cost data for the month`
          },
          {
            title: 'Step 2: List Idle EC2 Instances',
            content: `aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]"

# Identify instances that are running but underutilized`
          },
          {
            title: 'Step 3: Delete Unused EBS Volumes',
            content: `aws ec2 describe-volumes --query "Volumes[*].[VolumeId,State,Size]"

aws ec2 delete-volume --volume-id vol-0123456789abcdef0

# Remove storage that is not attached to any instance`
          },
          {
            title: 'Step 4: Set Billing Alerts',
            content: `aws cloudwatch put-metric-alarm \\
  --alarm-name "High-Cost-Alert" \\
  --metric-name EstimatedCharges \\
  --namespace AWS/Billing \\
  --statistic Maximum \\
  --period 21600 \\
  --threshold 50 \\
  --comparison-operator GreaterThanOrEqualToThreshold \\
  --evaluation-periods 1 \\
  --alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe

# Sends alert if monthly cost exceeds $50`
          }
        ],
        terminalCommands: [
          'aws ce get-cost-and-usage --time-period Start=2026-01-01,End=2026-01-31 --granularity MONTHLY --metrics "BlendedCost" "UsageQuantity"',
          'aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]"',
          'aws ec2 describe-volumes --query "Volumes[*].[VolumeId,State,Size]"',
          'aws ec2 delete-volume --volume-id vol-0123456789abcdef0',
          'aws cloudwatch put-metric-alarm --alarm-name "High-Cost-Alert" --metric-name EstimatedCharges --namespace AWS/Billing --statistic Maximum --period 21600 --threshold 50 --comparison-operator GreaterThanOrEqualToThreshold --evaluation-periods 1 --alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice monitoring and optimizing cloud costs.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Monthly Costs</h3>
              <p class="text-sm text-gray-400 mb-2">Observe cost distribution for compute, storage, and networking.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ce get-cost-and-usage --time-period Start=2026-01-01,End=2026-01-31 --granularity MONTHLY --metrics "BlendedCost" "UsageQuantity"</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Identify Idle Instances</h3>
              <p class="text-sm text-gray-400 mb-2">Note instances in running state but not in use.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]"</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Delete Unused Volumes</h3>
              <p class="text-sm text-gray-400 mb-2">Reduce unnecessary storage cost.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 describe-volumes --query "Volumes[*].[VolumeId,State,Size]"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 delete-volume --volume-id vol-0123456789abcdef0</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Set Billing Alerts</h3>
              <p class="text-sm text-gray-400 mb-2">Monitor costs proactively.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch put-metric-alarm --alarm-name "High-Cost-Alert" --metric-name EstimatedCharges --namespace AWS/Billing --statistic Maximum --period 21600 --threshold 50 --comparison-operator GreaterThanOrEqualToThreshold --evaluation-periods 1 --alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Always track costs and optimize resources ✅</li>
                <li>Automate cost monitoring with CloudWatch alerts ✅</li>
                <li>Combine scaling, reserved instances, and cleanup strategies ✅</li>
                <li>Hands-on practice ensures budget-friendly and efficient DevOps deployments ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 6.7</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>How to monitor and control cloud costs</li>
              <li>Hands-on experience with AWS Cost Explorer and CLI commands</li>
              <li>Strategies for right-sizing, auto-scaling, and resource cleanup</li>
              <li>Importance of cost awareness in cloud-based DevOps workflows</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Hands-On: Cloud Deployment',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In this session, students will deploy a complete application on AWS, covering compute, storage, networking, security, and monitoring.
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Combines EC2, S3, IAM, Security Groups, and CloudWatch</li>
            <li>Demonstrates DevOps in cloud workflow</li>
            <li>Emphasizes hands-on experience for real-world deployment</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Steps in Cloud Deployment</h3>
          <div class="space-y-4 mb-6">
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white">1. Prepare the Application</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Simple web app or Dockerized application. Ensure all artifacts are ready for deployment.</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white">2. Provision Infrastructure</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Launch EC2 instance or ECS cluster. Configure VPC, Subnet, and Security Groups.</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white">3. Setup Storage</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Upload static files, configs, or artifacts to S3. Enable encryption for sensitive files.</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white">4. Configure IAM Roles</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Create a role with minimal permissions for deployment. Attach to EC2 instance or ECS task.</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white">5. Deploy the Application</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Copy files to EC2 or run container in ECS. Ensure proper port access (HTTP/HTTPS).</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white">6. Monitor & Scale</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Configure CloudWatch alarms for CPU, memory, and network. Enable Auto Scaling if needed.</p>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World Scenario</h3>
          <div class="p-4 mb-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <p class="mb-2 text-sm text-gray-700 dark:text-gray-300 font-bold">Imagine a DevOps pipeline for a microservice app:</p>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Code pushed to CodeCommit → triggers CodeBuild</li>
              <li>Docker image pushed to ECR → deployed on ECS</li>
              <li>CloudWatch monitors logs and CPU usage</li>
              <li>Auto Scaling adjusts instance count based on traffic</li>
              <li>S3 stores deployment artifacts securely</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Result: Fully automated, secure, and scalable application deployment</p>
          </div>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Step 1: Launch EC2 Instance',
            content: `aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t2.micro \\
  --key-name MyKeyPair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-6e7f829e`
          },
          {
            title: 'Step 2: Upload Application to S3',
            content: `aws s3 mb s3://my-app-artifacts
aws s3 cp app.zip s3://my-app-artifacts/`
          },
          {
            title: 'Step 3: Create IAM Role for EC2 Deployment',
            content: `aws iam create-role --role-name EC2DeployRole --assume-role-policy-document file://trust-policy.json
aws iam attach-role-policy --role-name EC2DeployRole --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess`
          },
          {
            title: 'Step 4: Configure Security Group',
            content: `aws ec2 create-security-group --group-name AppSG --description "App Security Group"
aws ec2 authorize-security-group-ingress --group-name AppSG --protocol tcp --port 80 --cidr 0.0.0.0/0`
          },
          {
            title: 'Step 5: Deploy Application to EC2',
            content: `# SSH into instance
ssh -i MyKeyPair.pem ec2-user@<EC2_PUBLIC_IP>

# Download artifact from S3
aws s3 cp s3://my-app-artifacts/app.zip ./app.zip

# Unzip and run app
unzip app.zip
python3 app.py`
          },
          {
            title: 'Step 6: Monitor Application with CloudWatch',
            content: `aws cloudwatch put-metric-alarm \\
  --alarm-name HighCPUAlarm \\
  --metric-name CPUUtilization \\
  --namespace AWS/EC2 \\
  --statistic Average \\
  --period 300 \\
  --threshold 70 \\
  --comparison-operator GreaterThanThreshold \\
  --evaluation-periods 1 \\
  --alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe`
          }
        ],
        terminalCommands: [
          'aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro --key-name MyKeyPair --security-group-ids sg-0123456789abcdef0',
          'aws s3 mb s3://my-app-artifacts',
          'aws s3 cp app.zip s3://my-app-artifacts/',
          'aws s3 ls s3://my-app-artifacts/',
          'aws iam create-role --role-name EC2DeployRole --assume-role-policy-document file://trust-policy.json',
          'aws iam attach-role-policy --role-name EC2DeployRole --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess',
          'aws ec2 create-security-group --group-name AppSG --description "App Security Group"',
          'aws ec2 authorize-security-group-ingress --group-name AppSG --protocol tcp --port 80 --cidr 0.0.0.0/0',
          'ssh -i MyKeyPair.pem ec2-user@<EC2_PUBLIC_IP>',
          'aws s3 cp s3://my-app-artifacts/app.zip ./app.zip',
          'unzip app.zip',
          'python3 app.py',
          'aws cloudwatch put-metric-alarm --alarm-name HighCPUAlarm --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 70 --comparison-operator GreaterThanThreshold --evaluation-periods 1 --alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Hands-on practice deploying a complete application on AWS with security and monitoring.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Launch EC2</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm instance launch.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro --key-name MyKeyPair --security-group-ids sg-0123456789abcdef0</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Upload Artifacts to S3</h3>
              <p class="text-sm text-gray-400 mb-2">Verify files uploaded.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws s3 mb s3://my-app-artifacts</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws s3 cp app.zip s3://my-app-artifacts/</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls s3://my-app-artifacts/</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Create IAM Role and Attach Policy</h3>
              <p class="text-sm text-gray-400 mb-2">Role ready for deployment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws iam create-role --role-name EC2DeployRole --assume-role-policy-document file://trust-policy.json</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws iam attach-role-policy --role-name EC2DeployRole --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Configure Security Group</h3>
              <p class="text-sm text-gray-400 mb-2">HTTP access enabled.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 create-security-group --group-name AppSG --description "App Security Group"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws ec2 authorize-security-group-ingress --group-name AppSG --protocol tcp --port 80 --cidr 0.0.0.0/0</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Deploy App on EC2</h3>
              <p class="text-sm text-gray-400 mb-2">Application now running on cloud server.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">ssh -i MyKeyPair.pem ec2-user@<EC2_PUBLIC_IP></code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws s3 cp s3://my-app-artifacts/app.zip ./app.zip</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">unzip app.zip</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">python3 app.py</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Set Monitoring Alarms</h3>
              <p class="text-sm text-gray-400 mb-2">Monitor CPU usage and receive alerts.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch put-metric-alarm --alarm-name HighCPUAlarm --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 70 --comparison-operator GreaterThanThreshold --evaluation-periods 1 --alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>End-to-end deployment covers compute, storage, networking, security, and monitoring ✅</li>
                <li>Students can deploy real apps in cloud environments ✅</li>
                <li>Hands-on practice prepares for real-world DevOps workflows and pipelines ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 6.8</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Full cloud deployment workflow from scratch</li>
              <li>Hands-on experience with EC2, S3, IAM, Security Groups, and CloudWatch</li>
              <li>How to integrate compute, storage, networking, security, and monitoring in cloud deployments</li>
              <li>Practical skills for real-world end-to-end cloud-based DevOps</li>
            </ul>
          </div>
        `
      }
    ]
  },
  {
    id: 'module-7',
    title: 'Module 7 — Infrastructure as Code & Automation',
    duration: '1 week',
    description: 'Automate infrastructure provisioning with Terraform and integrate with CI pipelines.',
    lessons: [
      {
        title: 'What is Infrastructure as Code?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Infrastructure as Code</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Infrastructure as Code (IaC) is the practice of managing and provisioning computing infrastructure using code instead of manual processes.
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Traditionally, servers, networks, and storage were configured manually</li>
            <li>IaC automates the setup and configuration of infrastructure</li>
            <li>Ensures consistency, repeatability, and version control</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Benefits for DevOps Teams:</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Automation:</strong> Provision entire environments with a single command</li>
            <li><strong>Consistency:</strong> Avoid configuration drift between dev, test, and production</li>
            <li><strong>Version Control:</strong> Track changes, rollback, and audit infrastructure like code</li>
            <li><strong>Scalability:</strong> Quickly scale environments up or down programmatically</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Popular IaC Tools</h3>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                <tr>
                  <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">Tool</th>
                  <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">Terraform</td>
                  <td class="px-4 py-2">Cloud-agnostic IaC</td>
                </tr>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">AWS CloudFormation</td>
                  <td class="px-4 py-2">AWS-specific resource provisioning</td>
                </tr>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">Ansible</td>
                  <td class="px-4 py-2">Configuration management and deployment</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">Puppet / Chef</td>
                  <td class="px-4 py-2">Server automation and management</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">How IaC Fits in DevOps</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>IaC enables DevOps pipelines to automatically provision, configure, and deploy infrastructure</li>
            <li>Works with CI/CD tools like Jenkins, GitHub Actions, and CodePipeline</li>
            <li>Reduces human errors and speeds up deployments</li>
          </ul>

          <div class="p-4 mb-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-2">Real-World DevOps Example:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Code changes in a repository → CI/CD pipeline triggers</li>
              <li>IaC script provisions infrastructure → application deployed automatically</li>
              <li>Monitoring tools configured via code → alerts set automatically</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Outcome: Fully automated, reliable, and scalable infrastructure deployment</p>
          </div>
        `,
        duration: '10 min',
        syntax: [
          {
            title: 'Step 1: Install Terraform (if not installed)',
            content: `# Check Terraform version
terraform -v`
          },
          {
            title: 'Step 2: Create a Simple Terraform File (main.tf)',
            content: `provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-devops-bucket"
  acl    = "private"
}`
          },
          {
            title: 'Step 3: Initialize Terraform',
            content: `terraform init

# Downloads provider plugins and prepares workspace`
          },
          {
            title: 'Step 4: Plan Infrastructure',
            content: `terraform plan

# Shows what resources Terraform will create`
          },
          {
            title: 'Step 5: Apply Infrastructure',
            content: `terraform apply

# Type yes when prompted
# Terraform creates the S3 bucket on AWS automatically`
          },
          {
            title: 'Step 6: Destroy Infrastructure (Cleanup)',
            content: `terraform destroy

# Type yes to delete all resources`
          }
        ],
        terminalCommands: [
          'terraform -v',
          'terraform init',
          'terraform plan',
          'terraform apply',
          'aws s3 ls',
          'terraform destroy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Understand the basics of Infrastructure as Code by managing an AWS S3 bucket with Terraform.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Terraform Version</h3>
              <p class="text-sm text-gray-400 mb-2">Ensure Terraform is ready.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform -v</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Initialize Workspace</h3>
              <p class="text-sm text-gray-400 mb-2">Prepares Terraform environment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform init</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Preview Infrastructure Changes</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm what resources will be created.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform plan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Apply Infrastructure</h3>
              <p class="text-sm text-gray-400 mb-2">Observe S3 bucket creation in real-time.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Verify on AWS</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm the bucket is created.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Cleanup Resources</h3>
              <p class="text-sm text-gray-400 mb-2">Verify resources are removed.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform destroy</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>IaC eliminates manual server setup ✅</li>
                <li>Enables repeatable, version-controlled infrastructure ✅</li>
                <li>Students can create, modify, and destroy environments safely ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.1</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Definition and importance of Infrastructure as Code</li>
              <li>How IaC fits into DevOps automation pipelines</li>
              <li>Hands-on experience creating AWS resources with Terraform</li>
              <li>Practical skills for automated, scalable, and reliable infrastructure provisioning</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Terraform Overview',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Terraform</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Terraform is an open-source Infrastructure as Code (IaC) tool created by HashiCorp that allows you to define, provision, and manage infrastructure in a safe and repeatable way. Unlike manually creating resources, Terraform enables automation and consistency, making it a favorite among DevOps teams.
          </p>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            Terraform is cloud-agnostic, meaning it can manage infrastructure across multiple providers like AWS, Azure, Google Cloud, Kubernetes, and more. This flexibility allows teams to adopt a single workflow for multi-cloud deployments, reducing complexity and errors.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Core Concepts of Terraform</h3>
          <div class="space-y-4 mb-6">
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-blue-600 dark:text-blue-400">Providers</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Plugins that allow Terraform to interact with cloud platforms (e.g., aws, google, azurerm). Must be configured with credentials and region.</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-blue-600 dark:text-blue-400">Resources</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Building blocks of infrastructure (e.g., EC2 instance, S3 bucket). Defined in configuration files and managed as a unit.</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-blue-600 dark:text-blue-400">State</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Tracks deployed infrastructure in a state file (terraform.tfstate). Stores metadata and maps real-world resources to your configuration.</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-blue-600 dark:text-blue-400">Modules</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Reusable templates for defining sets of resources once and reusing them across projects or environments.</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-blue-600 dark:text-blue-400">Variables & Outputs</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Variables make scripts dynamic; Outputs display key info like IP addresses after provisioning.</p>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Why Terraform for DevOps?</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Automation & Speed:</strong> Provision entire infrastructure with a single command</li>
            <li><strong>Consistency:</strong> Avoid differences between environments (dev, test, prod)</li>
            <li><strong>Version Control:</strong> Track infrastructure changes like application code</li>
            <li><strong>Collaboration:</strong> Multiple engineers can work on the same infrastructure using remote state</li>
            <li><strong>Cloud-Agnostic:</strong> Manage multi-cloud deployments from one tool</li>
          </ul>

          <div class="p-4 mb-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-2">Real-World DevOps Scenario:</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">A DevOps team wants to deploy a web application on AWS.</p>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Terraform provisions VPC, Subnets, Security Groups, EC2 Instances, S3 Buckets, and RDS database.</li>
              <li>The same Terraform code can also deploy to Azure or Google Cloud with minimal changes.</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Outcome: DevOps teams can move faster, deploy reliably, and manage infrastructure as code.</p>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Terraform Workflow Steps</h3>
          <ol class="list-decimal pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Write Configuration:</strong> Define resources and variables in .tf files.</li>
            <li><strong>Initialize Terraform:</strong> <code>terraform init</code> downloads plugins and sets up workspace.</li>
            <li><strong>Plan Infrastructure:</strong> <code>terraform plan</code> previews changes before applying.</li>
            <li><strong>Apply Changes:</strong> <code>terraform apply</code> provisions or updates infrastructure.</li>
            <li><strong>Manage State:</strong> Track infrastructure and collaborate.</li>
            <li><strong>Destroy Resources:</strong> <code>terraform destroy</code> safely removes infrastructure.</li>
          </ol>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Terraform vs Manual Cloud Management</h3>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                <tr>
                  <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">Feature</th>
                  <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">Terraform</th>
                  <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">Manual</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-2 font-semibold">Provisioning Speed</td>
                  <td class="px-4 py-2 text-green-600">Seconds to minutes</td>
                  <td class="px-4 py-2 text-red-600">Hours to days</td>
                </tr>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-2 font-semibold">Consistency</td>
                  <td class="px-4 py-2 text-green-600">Declarative code ensures same setup</td>
                  <td class="px-4 py-2 text-red-600">High risk of human error</td>
                </tr>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-2 font-semibold">Reusability</td>
                  <td class="px-4 py-2 text-green-600">Modules allow reuse across projects</td>
                  <td class="px-4 py-2 text-red-600">Must manually configure each time</td>
                </tr>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-2 font-semibold">Collaboration</td>
                  <td class="px-4 py-2 text-green-600">State management supports teams</td>
                  <td class="px-4 py-2 text-red-600">Difficult to track changes</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-semibold">Cost Efficiency</td>
                  <td class="px-4 py-2 text-green-600">Auto-destroy resources after use</td>
                  <td class="px-4 py-2 text-red-600">Idle resources cost money</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.2</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Core concepts: Providers, Resources, State, Modules</li>
              <li>Terraform workflow: Init, Plan, Apply, Destroy</li>
              <li>Benefits of declarative IaC over manual provisioning</li>
              <li>How Terraform enables scalable, collaborative DevOps practices</li>
            </ul>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Step 1: Install Terraform',
            content: `terraform -v
# Confirms Terraform is installed`
          },
          {
            title: 'Step 2: Create Configuration File (main.tf)',
            content: `provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "devops_bucket" {
  bucket = "my-devops-terraform-bucket"
  acl    = "private"
}

# Declares AWS provider and creates an S3 bucket`
          },
          {
            title: 'Step 3: Initialize Terraform',
            content: `terraform init
# Downloads provider plugins`
          },
          {
            title: 'Step 4: Preview Changes',
            content: `terraform plan
# Shows what resources Terraform will create`
          },
          {
            title: 'Step 5: Apply Changes',
            content: `terraform apply
# Type yes to create S3 bucket`
          },
          {
            title: 'Step 6: Destroy Resources',
            content: `terraform destroy
# Type yes to delete resources`
          }
        ],
        terminalCommands: [
          'terraform -v',
          'terraform init',
          'terraform plan',
          'terraform apply',
          'aws s3 ls',
          'terraform destroy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Experience the full Terraform lifecycle from initialization to destruction.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Terraform Version</h3>
              <p class="text-sm text-gray-400 mb-2">Ensure Terraform is installed.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform -v</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Initialize Workspace</h3>
              <p class="text-sm text-gray-400 mb-2">Downloads provider plugins.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform init</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Preview Changes</h3>
              <p class="text-sm text-gray-400 mb-2">Shows what resources will be created.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform plan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Apply Configuration</h3>
              <p class="text-sm text-gray-400 mb-2">Provisions the S3 bucket.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Verify on AWS</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm the bucket exists.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Cleanup</h3>
              <p class="text-sm text-gray-400 mb-2">Destroy resources to save costs.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform destroy</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Automated provisioning is faster and safer than manual work ✅</li>
                <li>The state file tracks your infrastructure's reality ✅</li>
                <li>Always cleanup (destroy) unused test resources ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.2</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Core concepts: Providers, Resources, State, Modules</li>
              <li>Terraform workflow: Init, Plan, Apply, Destroy</li>
              <li>Benefits of declarative IaC over manual provisioning</li>
              <li>How Terraform enables scalable, collaborative DevOps practices</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Terraform Architecture',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Terraform Architecture</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Understanding Terraform’s architecture is essential for writing efficient IaC scripts and managing infrastructure at scale. Terraform’s architecture is designed to enable automation, consistency, and collaboration across teams and cloud platforms.
          </p>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            Terraform is divided into several key components that interact with each other to provision, track, and manage infrastructure reliably.
          </p>

          <div class="space-y-6 mb-8">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">1. Terraform CLI (Command Line Interface)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">The primary tool DevOps engineers use to interact with Terraform. Responsible for parsing configuration files, communicating with providers, and managing state.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Commands:</strong> <code>init</code>, <code>plan</code>, <code>apply</code>, <code>destroy</code></li>
                <li><strong>Function:</strong> Reads .tf files, calculates changes, sends instructions to providers.</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">2. Configuration Files (.tf)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Written in HashiCorp Configuration Language (HCL). Declarative code defining resources, providers, variables, and outputs.</p>
              <div class="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono mt-2">
                provider "aws" { region = "us-east-1" }<br>
                resource "aws_instance" "web" { ami = "ami-123" ... }
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">3. Providers</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Plugins that communicate with cloud platforms (AWS, Azure, Google). They translate HCL into API calls.</p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">4. State Management (terraform.tfstate)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">A file that tracks deployed resources. Crucial for mapping configuration to real-world infrastructure.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Local:</strong> Stored on your machine (learning/testing).</li>
                <li><strong>Remote:</strong> Stored in S3/Terraform Cloud (team collaboration).</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">5. Modules</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Reusable blocks of Terraform code. Allow standardizing infrastructure components across environments (dev, test, prod).</p>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World DevOps Scenario</h3>
          <div class="p-4 mb-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-2">Deploying a Multi-Tier App:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Web Layer:</strong> EC2 instances in Auto Scaling group defined in code.</li>
              <li><strong>Database:</strong> RDS instance provisioned via Terraform.</li>
              <li><strong>State:</strong> Stored remotely so the whole team sees the same infrastructure state.</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Result: Consistent, scalable, and version-controlled infrastructure.</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Step 1: Create a Simple Project Structure',
            content: `mkdir terraform-demo
cd terraform-demo
touch main.tf variables.tf outputs.tf

# Organize files for resources, variables, and outputs`
          },
          {
            title: 'Step 2: Add a Provider & Resource (main.tf)',
            content: `provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "demo_bucket" {
  bucket = "terraform-architecture-demo"
  acl    = "private"
}`
          },
          {
            title: 'Step 3: Initialize Terraform',
            content: `terraform init
# Downloads provider plugin`
          },
          {
            title: 'Step 4: Plan Infrastructure',
            content: `terraform plan
# Review proposed infrastructure changes`
          },
          {
            title: 'Step 5: Apply Infrastructure',
            content: `terraform apply
# Type yes to create S3 bucket`
          },
          {
            title: 'Step 6: View State File',
            content: `cat terraform.tfstate
# Inspect JSON-formatted state file showing created resource metadata`
          },
          {
            title: 'Step 7: Destroy Resources',
            content: `terraform destroy
# Type yes to clean up`
          }
        ],
        terminalCommands: [
          'mkdir terraform-demo',
          'cd terraform-demo',
          'touch main.tf variables.tf outputs.tf',
          'terraform init',
          'terraform plan',
          'terraform apply',
          'cat terraform.tfstate',
          'terraform destroy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Explore the internal components of Terraform by creating, inspecting, and destroying resources.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create Project Structure</h3>
              <p class="text-sm text-gray-400 mb-2">Organize your files.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">mkdir terraform-demo</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">cd terraform-demo</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">touch main.tf variables.tf outputs.tf</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Initialize Terraform</h3>
              <p class="text-sm text-gray-400 mb-2">Downloads the AWS provider plugin.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform init</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Plan Deployment</h3>
              <p class="text-sm text-gray-400 mb-2">Preview what Terraform will do.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform plan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Apply Configuration</h3>
              <p class="text-sm text-gray-400 mb-2">Provision the infrastructure.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Inspect State</h3>
              <p class="text-sm text-gray-400 mb-2">See how Terraform tracks your resources.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cat terraform.tfstate</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Destroy Resources</h3>
              <p class="text-sm text-gray-400 mb-2">Cleanup to avoid costs.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform destroy</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Understanding the state file is key to debugging ✅</li>
                <li>Modules and providers are the building blocks of IaC ✅</li>
                <li>Remote backends enable team collaboration ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.3</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Detailed understanding of Terraform architecture: CLI, configuration files, providers, state, modules</li>
              <li>Hands-on project demonstrating structure, initialization, planning, and state management</li>
              <li>How Terraform internals work with cloud APIs</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Terraform Workflow',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Terraform Workflow</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The Terraform workflow is the set of steps DevOps engineers follow to write, test, apply, and manage infrastructure efficiently using Terraform. Understanding the workflow is critical for avoiding mistakes, maintaining consistent environments, and enabling collaboration.
          </p>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            Terraform uses a declarative approach: you define what infrastructure should exist, and Terraform determines how to achieve it. The workflow ensures that changes are planned, reviewed, and applied safely.
          </p>

          <div class="space-y-6 mb-8">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">1. Write Configuration Files (.tf)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Written in HCL. Include Resources, Variables, Outputs, and Modules.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Best Practice:</strong> Organize by purpose (main.tf, variables.tf) and comment code.</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">2. Initialize Terraform (terraform init)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Initializes working directory, downloads providers, and sets up backend.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Best Practice:</strong> Always run after creating new project or adding providers.</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">3. Plan Infrastructure (terraform plan)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Compares current state with desired state. Generates an execution plan.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Why it matters:</strong> Prevents accidental deletion or misconfiguration.</li>
                <li><strong>Best Practice:</strong> Use <code>-out plan.tfplan</code> to save plan for review.</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">4. Apply Changes (terraform apply)</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Applies execution plan to provision/modify infrastructure via provider APIs.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Best Practice:</strong> Apply incrementally in staging before production.</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">5. Manage State & Destroy</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">State tracks resources. <code>terraform destroy</code> removes all resources.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Best Practice:</strong> Lock state in teams. Confirm destroy action carefully.</li>
              </ul>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World DevOps Example</h3>
          <div class="p-4 mb-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-2">Adding an EC2 Instance:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Developer adds resource to config.</li>
              <li><code>terraform plan</code> shows: 1 resource to add.</li>
              <li>Team reviews → <code>terraform apply</code> → instance provisioned.</li>
              <li>After testing, <code>terraform destroy</code> cleans up.</li>
            </ul>
            <p class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">✅ Benefits: Safe, predictable, repeatable, and version-controlled infrastructure.</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Step 1: Initialize Terraform',
            content: `terraform init
# Prepares working directory and downloads provider`
          },
          {
            title: 'Step 2: Plan Infrastructure',
            content: `terraform plan -out=tfplan
# Generates execution plan and saves to tfplan`
          },
          {
            title: 'Step 3: Apply Infrastructure',
            content: `terraform apply tfplan
# Provisions resources as defined`
          },
          {
            title: 'Step 4: View Current State',
            content: `terraform show
terraform state list
# Lists all resources currently managed`
          },
          {
            title: 'Step 5: Modify Configuration (Optional)',
            content: `# Example: Add a second S3 bucket in main.tf
resource "aws_s3_bucket" "demo_bucket2" {
  bucket = "terraform-demo-bucket2"
  acl    = "private"
}

# Plan & apply changes:
terraform plan -out=tfplan
terraform apply tfplan`
          },
          {
            title: 'Step 6: Destroy Infrastructure',
            content: `terraform destroy
# Type yes to confirm deletion`
          }
        ],
        terminalCommands: [
          'terraform init',
          'terraform plan -out=tfplan',
          'terraform apply tfplan',
          'terraform show',
          'terraform state list',
          'terraform plan -out=tfplan',
          'terraform apply tfplan',
          'terraform destroy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Master the standard Terraform workflow: Init, Plan, Apply, State, and Destroy.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Initialize Project</h3>
              <p class="text-sm text-gray-400 mb-2">Prepare the environment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform init</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Preview Changes</h3>
              <p class="text-sm text-gray-400 mb-2">Save the plan to a file.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform plan -out=tfplan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Apply Resources</h3>
              <p class="text-sm text-gray-400 mb-2">Execute the saved plan.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply tfplan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Verify State</h3>
              <p class="text-sm text-gray-400 mb-2">Check managed resources.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">terraform show</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform state list</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Modify & Update</h3>
              <p class="text-sm text-gray-400 mb-2">Add a new resource and apply.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">terraform plan -out=tfplan</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply tfplan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Clean Up</h3>
              <p class="text-sm text-gray-400 mb-2">Remove all resources.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform destroy</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 7: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Reviewing plans prevents production incidents ✅</li>
                <li>Incremental updates are safer than big-bang changes ✅</li>
                <li>Workflow discipline enables automation ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.4</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Complete Terraform workflow: write → init → plan → apply → manage state → destroy</li>
              <li>Importance of reviewing plans before applying changes</li>
              <li>Hands-on commands to provision, update, and remove infrastructure</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Terraform with Cloud',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Terraform with Cloud</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In this topic, students will learn how to provision cloud infrastructure using Terraform in a real-world scenario. By the end of this lesson, you’ll be able to deploy EC2 instances, S3 buckets, and networking components on AWS entirely via Terraform scripts.
          </p>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            Terraform is cloud-agnostic, meaning the same principles apply to Azure, Google Cloud, or other cloud platforms. Learning to integrate Terraform with cloud providers is a core skill for DevOps engineers, as it allows you to automate deployments, reduce errors, and maintain infrastructure as code.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Components for Cloud Deployment</h3>
          <div class="space-y-6 mb-8">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">1. Provider Configuration</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Terraform needs to know which cloud platform to interact with. Requires credentials, region, and optional settings.</p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">2. Resource Declaration</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Define resources like EC2 instances, VPCs, Subnets, Security Groups, and S3 buckets. Terraform manages dependencies automatically.</p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">3. Variables & Outputs</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Variables allow flexibility (e.g., instance type, region). Outputs display critical information after deployment (e.g., public IP).</p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">4. Modules</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Reusable code blocks that define common cloud components (e.g., Web server module with EC2, Security Group, and Elastic IP).</p>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World Scenario: Deploying a Web App</h3>
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Networking:</strong> VPC, Subnets, Internet Gateway, Route Tables</li>
              <li><strong>Compute:</strong> EC2 instances for web servers, Security Groups (HTTP/HTTPS)</li>
              <li><strong>Storage:</strong> S3 bucket for static content and artifacts</li>
              <li><strong>Outputs:</strong> Public IPs for access, Bucket URL</li>
            </ul>
            <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Terraform handles the entire lifecycle: provisioning, updating, and destroying resources with a single workflow.</p>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Why Terraform with Cloud Matters</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Automation:</strong> Provision all infrastructure via code</li>
            <li><strong>Repeatability:</strong> Deploy identical environments for dev, test, prod</li>
            <li><strong>Collaboration:</strong> State files and remote backends allow multi-team collaboration</li>
            <li><strong>Version Control:</strong> Track changes, rollbacks, and updates via Git</li>
          </ul>

          <div class="p-4 mb-6 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
            <p class="font-bold text-green-700 dark:text-green-400">✅ Outcome: Students can deploy scalable, secure cloud infrastructure automatically without manual cloud console operations.</p>
          </div>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Step 1: Configure AWS Provider',
            content: `provider "aws" {
  region  = "us-east-1"
  profile = "default"  # AWS CLI profile with access keys
}`
          },
          {
            title: 'Step 2: Create a VPC (main.tf)',
            content: `resource "aws_vpc" "devops_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "devops-vpc"
  }
}`
          },
          {
            title: 'Step 3: Create a Subnet',
            content: `resource "aws_subnet" "devops_subnet" {
  vpc_id            = aws_vpc.devops_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "devops-subnet"
  }
}`
          },
          {
            title: 'Step 4: Deploy an EC2 Instance',
            content: `resource "aws_instance" "web_server" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.devops_subnet.id
  tags = {
    Name = "Terraform-Web-Server"
  }
}`
          },
          {
            title: 'Step 5: Create an S3 Bucket',
            content: `resource "aws_s3_bucket" "app_bucket" {
  bucket = "terraform-devops-app-bucket"
  acl    = "private"
}`
          },
          {
            title: 'Step 6: Output EC2 Public IP',
            content: `output "web_server_ip" {
  value = aws_instance.web_server.public_ip
}`
          },
          {
            title: 'Step 7: Initialize, Plan, and Apply',
            content: `terraform init       # Initialize the project
terraform plan       # Preview changes
terraform apply      # Deploy infrastructure

# Type yes when prompted`
          },
          {
            title: 'Step 8: Verify Resources',
            content: `aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]"
aws s3 ls

# Confirm EC2 instance and S3 bucket are created`
          },
          {
            title: 'Step 9: Destroy Resources (Cleanup)',
            content: `terraform destroy

# Type yes to remove all resources`
          }
        ],
        terminalCommands: [
          'terraform init',
          'terraform plan -out=tfplan',
          'terraform apply tfplan',
          'aws ec2 describe-instances',
          'aws s3 ls',
          'terraform destroy'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Provision a complete cloud environment (VPC, EC2, S3) using Terraform and AWS CLI.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Initialize Project</h3>
              <p class="text-sm text-gray-400 mb-2">Download providers and set up the backend.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform init</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Preview Deployment</h3>
              <p class="text-sm text-gray-400 mb-2">See exactly what will be created.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform plan -out=tfplan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Deploy Infrastructure</h3>
              <p class="text-sm text-gray-400 mb-2">Provision VPC, Subnet, EC2, and S3.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply tfplan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Verify on AWS</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm resources exist via CLI.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 describe-instances</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Clean Up</h3>
              <p class="text-sm text-gray-400 mb-2">Destroy all resources to avoid costs.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform destroy</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 6: Think Like a DevOps Engineer</h3>
              <ul class="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Infrastructure is now reproducible code ✅</li>
                <li>Dependencies (Subnet → EC2) are handled automatically ✅</li>
                <li>Cloud deployments are consistent and auditable ✅</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.5</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>How to provision VPC, Subnet, EC2, and S3 using Terraform</li>
              <li>Hands-on experience with cloud provider integration</li>
              <li>Using variables, outputs, and modules for scalable infrastructure</li>
              <li>Real-world DevOps skills for automated cloud deployments</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Automation in DevOps',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Automation in DevOps</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Automation is the heart of DevOps. It reduces manual work, eliminates human errors, and ensures fast, reliable, and repeatable processes. In modern DevOps practices, automation is applied across:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Infrastructure provisioning:</strong> using tools like Terraform</li>
            <li><strong>Configuration management:</strong> using Ansible, Puppet, or Chef</li>
            <li><strong>Continuous Integration & Continuous Deployment (CI/CD):</strong> automating build, test, and deployment pipelines</li>
            <li><strong>Monitoring & Alerts:</strong> automatically detecting and responding to issues</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            By combining Infrastructure as Code (IaC) with automation, teams can deploy, scale, and manage complex infrastructure in minutes instead of hours or days.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Areas of Automation</h3>
          <div class="space-y-6 mb-8">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">1. Infrastructure Provisioning</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Terraform scripts define entire environments</li>
                <li>Provisioning can include servers, networks, storage, and security</li>
                <li>Example: One command deploys VPC + Subnet + EC2 + S3 bucket</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">2. Configuration Management</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>After provisioning, servers must be configured</li>
                <li>Tools like Ansible or Chef automate software installation, updates, and system settings</li>
                <li>Ensures every server is configured consistently</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">3. CI/CD Pipelines</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Integrate automated testing, building, and deployment</li>
                <li>Example Workflow: Code pushed → Jenkins triggers → Terraform provisions → App deployed</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">4. Scaling & Self-Healing</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Automation allows Auto Scaling in cloud environments</li>
                <li>Detect failures automatically → replace or restart resources</li>
                <li>Reduces downtime and improves reliability</li>
              </ul>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Benefits of Automation</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Speed:</strong> Deploy infrastructure and applications quickly</li>
            <li><strong>Consistency:</strong> Eliminate human errors and configuration drift</li>
            <li><strong>Scalability:</strong> Easily replicate environments across regions or teams</li>
            <li><strong>Efficiency:</strong> DevOps engineers focus on improving systems rather than repetitive tasks</li>
            <li><strong>Cost Management:</strong> Destroy unused resources automatically to save cloud costs</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World Scenario: Automated Web App Deployment</h3>
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <p class="mb-2 text-gray-700 dark:text-gray-300">Imagine a company deploying a web application:</p>
            <ol class="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Developers push updates to GitHub</li>
              <li>CI/CD pipeline triggers Terraform scripts → provisions updated infrastructure if required</li>
              <li>Application is automatically deployed to EC2 instances</li>
              <li>Auto Scaling adds/removes instances based on traffic</li>
              <li>CloudWatch monitors servers → triggers automated alerts or self-healing scripts</li>
            </ol>
            <p class="mt-4 font-bold text-green-600 dark:text-green-400">✅ Result: Fully automated, scalable, and reliable environment with minimal manual intervention</p>
          </div>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Step 1: Automate Infrastructure Provisioning',
            content: `# Initialize Terraform
terraform init

# Plan resources
terraform plan -out=tfplan

# Apply resources automatically
terraform apply -auto-approve

# -auto-approve skips manual approval
# Deploys all resources in one command`
          },
          {
            title: 'Step 2: Automate Configuration with a Script',
            content: `# Example: Install Nginx on EC2 instance
#!/bin/bash
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Attach this as a user data script in Terraform EC2 resource:
resource "aws_instance" "web_server" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t2.micro"
  user_data     = file("setup.sh")
}`
          },
          {
            title: 'Step 3: CI/CD Integration Example',
            content: `// Jenkinsfile snippet
pipeline {
    agent any
    stages {
        stage('Terraform Init') {
            steps { sh 'terraform init' }
        }
        stage('Terraform Plan') {
            steps { sh 'terraform plan -out=tfplan' }
        }
        stage('Terraform Apply') {
            steps { sh 'terraform apply -auto-approve' }
        }
        stage('Deploy App') {
            steps { sh 'scp -i MyKey.pem app.zip ec2-user@<EC2_IP>:/home/ec2-user/' }
        }
    }
}`
          },
          {
            title: 'Step 4: Automate Monitoring Alerts',
            content: `aws cloudwatch put-metric-alarm \\
--alarm-name HighCPUAlarm \\
--metric-name CPUUtilization \\
--namespace AWS/EC2 \\
--statistic Average \\
--period 300 \\
--threshold 70 \\
--comparison-operator GreaterThanThreshold \\
--evaluation-periods 1 \\
--alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe

# Automatically triggers alerts when CPU exceeds threshold`
          }
        ],
        terminalCommands: [
          'terraform init',
          'terraform plan -out=tfplan',
          'terraform apply -auto-approve',
          'aws cloudwatch put-metric-alarm --alarm-name HighCPUAlarm',
          'aws ec2 describe-instances',
          'aws s3 ls'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Simulate a fully automated deployment workflow using Terraform and CLI tools.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Auto-Provision Infrastructure</h3>
              <p class="text-sm text-gray-400 mb-2">Initialize and deploy without manual approval.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">terraform init</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">terraform plan -out=tfplan</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply -auto-approve</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Automate Configuration</h3>
              <p class="text-sm text-gray-400 mb-2">Simulate attaching a user data script for Nginx.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm"># (Script is applied during instance creation)</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Simulate CI/CD Deployment</h3>
              <p class="text-sm text-gray-400 mb-2">Run a deployment script (mock).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">sh deploy_app.sh</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Configure Monitoring</h3>
              <p class="text-sm text-gray-400 mb-2">Set up an automated alert for high CPU.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch put-metric-alarm --alarm-name HighCPUAlarm ...</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Verify Automation</h3>
              <p class="text-sm text-gray-400 mb-2">Check that resources exist and are healthy.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 describe-instances</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls</code>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.6</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>How to automate provisioning with Terraform (-auto-approve)</li>
              <li>Concept of User Data for configuration automation</li>
              <li>Integrating Infrastructure as Code into CI/CD pipelines</li>
              <li>Setting up automated monitoring alerts</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Terraform Best Practices',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Terraform Best Practices</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Writing Terraform code is easy, but writing maintainable, reusable, and scalable Terraform code requires following best practices. In DevOps environments, these practices are crucial for collaboration, error reduction, and operational efficiency.
          </p>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            Following these guidelines ensures that your Infrastructure as Code (IaC) is reliable, secure, and ready for production.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Top 10 Terraform Best Practices</h3>
          <div class="space-y-6 mb-8">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">1. Use Modules for Reusability</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Modules allow you to encapsulate resources into reusable blocks. Avoid repeating code across projects or environments.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Example: A module for web servers can include EC2 instances, security groups, and IAM roles</li>
                <li>Benefits: Reduces duplication, improves maintainability, makes scaling easier</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">2. Keep Variables Organized</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Use variables for all configurable values: regions, instance types, AMI IDs, bucket names.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Create <code>variables.tf</code> for all definitions</li>
                <li>Use descriptive names and provide default values only when safe</li>
                <li>Store sensitive variables in environment variables or Terraform Cloud</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">3. Use Outputs Wisely</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Outputs provide important information after deployment (e.g., public IP, bucket URL).</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Do not output sensitive data (like passwords) in plaintext</li>
                <li>Use outputs for inter-module communication</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">4. State Management & Remote Backends</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Use remote state for teams to collaborate safely. Backends like S3 with DynamoDB lock prevent race conditions.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Avoid storing state locally in production</li>
                <li>Lock state when applying changes to prevent conflicts</li>
                <li>Enable state encryption</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">5. Use Version Control</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Store Terraform code in Git. Use branches and pull requests for collaboration.</p>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Track infrastructure changes over time</li>
                <li>Enable rollbacks if issues occur</li>
              </ul>
            </div>
            
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">6. Plan Before Apply</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Always run <code>terraform plan</code> before <code>terraform apply</code>. Review changes carefully to avoid accidental deletions.</p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">7. Naming Conventions & Tags</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Use consistent naming conventions and tag resources (Environment, Project, Owner) for billing and identification.</p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">8. Keep Code DRY</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Don't Repeat Yourself. Reuse modules, avoid hardcoding values, and use locals/variables.</p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">9. Format & Linting</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Use <code>terraform fmt</code> for consistency and <code>terraform validate</code> to check for syntax errors.</p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2">10. Security Best Practices</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Never commit secrets. Use Vault or AWS Secrets Manager. Enable encryption.</p>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World Scenario</h3>
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <p class="mb-2 text-gray-700 dark:text-gray-300">A DevOps team manages multiple environments (dev, test, prod). Following best practices:</p>
            <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Modules for web servers, databases, and networking</li>
              <li>Variables for region, instance type, and project name</li>
              <li>Remote state in S3 with locking for safe collaboration</li>
              <li>Outputs used to communicate between modules</li>
              <li>Version control ensures all changes are auditable</li>
            </ul>
            <p class="mt-4 font-bold text-green-600 dark:text-green-400">✅ Result: A scalable, secure, and maintainable IaC setup ready for production.</p>
          </div>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Step 1: Create a Module (web_server)',
            content: `# Directory Structure
terraform-demo/
├── main.tf
├── variables.tf
├── outputs.tf
└── modules/
    └── web_server/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf

# modules/web_server/main.tf
resource "aws_instance" "web" {
  ami           = var.ami
  instance_type = var.instance_type
  tags = {
    Name        = var.name
    Environment = var.environment
  }
}

# modules/web_server/variables.tf
variable "ami" {}
variable "instance_type" {}
variable "name" {}
variable "environment" {}

# modules/web_server/outputs.tf
output "web_instance_ip" {
  value = aws_instance.web.public_ip
}`
          },
          {
            title: 'Step 2: Call Module in Main Project',
            content: `# main.tf (Root)
module "web_server_dev" {
  source        = "./modules/web_server"
  ami           = "ami-0abcdef1234567890"
  instance_type = "t2.micro"
  name          = "dev-web"
  environment   = "dev"
}`
          },
          {
            title: 'Step 3: Initialize & Apply',
            content: `terraform init
terraform plan
terraform apply -auto-approve`
          },
          {
            title: 'Step 4: Format & Validate Code',
            content: `terraform fmt
terraform validate`
          },
          {
            title: 'Step 5: Check Outputs',
            content: `terraform output

# Displays EC2 public IP or other module outputs`
          }
        ],
        terminalCommands: [
          'terraform init',
          'terraform plan',
          'terraform apply -auto-approve',
          'terraform validate',
          'terraform fmt',
          'terraform output',
          'terraform destroy -auto-approve'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice essential Terraform commands for maintaining code quality and deployment safety.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Initialize Project</h3>
              <p class="text-sm text-gray-400 mb-2">Prepare the directory and download providers/modules.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform init</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Plan Changes</h3>
              <p class="text-sm text-gray-400 mb-2">Always preview what will happen.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform plan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Apply & Validate</h3>
              <p class="text-sm text-gray-400 mb-2">Deploy resources and check code syntax.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">terraform apply -auto-approve</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">terraform validate</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform fmt</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: View Outputs</h3>
              <p class="text-sm text-gray-400 mb-2">Retrieve important data (IPs, URLs).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform output</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Clean Up</h3>
              <p class="text-sm text-gray-400 mb-2">Destroy resources to prevent costs.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform destroy -auto-approve</code>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.7</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>How to structure Terraform projects using modules</li>
              <li>Use variables, outputs, and tags for maintainability</li>
              <li>Implement state management, version control, and security best practices</li>
              <li>Hands-on experience creating production-ready Terraform infrastructure</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Hands-On: Provision Infrastructure',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to End-to-End Infrastructure Deployment</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In this topic, students will implement a full end-to-end infrastructure deployment using Terraform, combining everything learned so far:
          </p>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Cloud provider integration</li>
            <li>Modules and variables</li>
            <li>State management and remote backend</li>
            <li>Automation of provisioning</li>
            <li>Best practices for naming, formatting, and security</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            This hands-on session is designed to simulate a real-world DevOps environment, preparing students for actual cloud deployment projects.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Project Scenario: Multi-Tier Web Application</h3>
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">We will deploy a multi-tier web application on AWS:</h4>
            <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
              <li><strong>Networking Layer:</strong> Create a VPC with public and private subnets, Internet Gateway, and Route Tables.</li>
              <li><strong>Compute Layer:</strong> Provision EC2 instances in the public subnet for web servers and configure Security Groups.</li>
              <li><strong>Storage Layer:</strong> Deploy S3 bucket for static assets or backups.</li>
              <li><strong>Outputs:</strong> Provide public IP addresses of EC2 instances and display S3 bucket URL.</li>
            </ul>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Automation & Best Practices</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Use modules for web servers and networking</li>
            <li>Manage variables, outputs, and remote state</li>
            <li>Apply formatting, validation, and CI/CD integration readiness</li>
          </ul>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Step 1: Project Structure',
            content: `terraform-project/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── web_server/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── network/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf`
          },
          {
            title: 'Step 2: Network Module (modules/network/main.tf)',
            content: `resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "terraform-vpc"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "public-subnet"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main_vpc.id
  tags = {
    Name = "internet-gateway"
  }
}`
          },
          {
            title: 'Step 3: Web Server Module (modules/web_server/main.tf)',
            content: `resource "aws_instance" "web" {
  ami           = var.ami
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  tags = {
    Name        = var.name
    Environment = var.environment
  }
  user_data = file("../scripts/setup.sh") # Optional automation script
}`
          },
          {
            title: 'Step 4: Main Configuration (main.tf)',
            content: `module "network" {
  source = "./modules/network"
}

module "web_server" {
  source = "./modules/web_server"
  ami           = "ami-0abcdef1234567890"
  instance_type = "t2.micro"
  subnet_id     = module.network.public_subnet_id
  name          = "web-server-1"
  environment   = "dev"
}

resource "aws_s3_bucket" "app_bucket" {
  bucket = "terraform-project-app-bucket"
  acl    = "private"
}`
          },
          {
            title: 'Step 5: Variables & Outputs',
            content: `# variables.tf
variable "ami" {}
variable "instance_type" {}
variable "subnet_id" {}
variable "name" {}
variable "environment" {}

# outputs.tf
output "web_server_ip" {
  value = module.web_server.web_instance_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.app_bucket.bucket
}`
          },
          {
            title: 'Step 6: Initialize & Apply',
            content: `terraform init
terraform plan -out=tfplan
terraform apply tfplan

# Type yes to approve changes
# Verify resources in AWS Console`
          },
          {
            title: 'Step 7: Verify & Test',
            content: `aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]"
aws s3 ls

# Confirm EC2 instances are running
# Check S3 bucket creation`
          },
          {
            title: 'Step 8: Clean Up',
            content: `terraform destroy -auto-approve

# Removes all resources safely`
          }
        ],
        terminalCommands: [
          'terraform init',
          'terraform plan -out=tfplan',
          'terraform apply tfplan',
          'aws ec2 describe-instances',
          'aws s3 ls',
          'terraform destroy -auto-approve'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Deploy a complete multi-tier infrastructure stack using Terraform best practices.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Initialize Project</h3>
              <p class="text-sm text-gray-400 mb-2">Initialize Terraform and download module plugins.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform init</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Plan Deployment</h3>
              <p class="text-sm text-gray-400 mb-2">Generate and save the execution plan.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform plan -out=tfplan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Apply Infrastructure</h3>
              <p class="text-sm text-gray-400 mb-2">Provision the network, compute, and storage layers.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply tfplan</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Verify Resources</h3>
              <p class="text-sm text-gray-400 mb-2">Check EC2 instances and S3 buckets using AWS CLI.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 describe-instances</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws s3 ls</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Destroy Resources</h3>
              <p class="text-sm text-gray-400 mb-2">Clean up all infrastructure to avoid costs.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform destroy -auto-approve</code>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 7.8</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Applied full end-to-end Terraform deployment</li>
              <li>Integrated networking, compute, and storage layers</li>
              <li>Used modules, variables, outputs, and automation scripts</li>
              <li>Followed best practices for state management, security, and CI/CD readiness</li>
            </ul>
          </div>
        `
      }
    ]
  },
  {
    id: 'module-8',
    title: 'Module 8 — Beginner Monitoring & DevOps Workflow',
    duration: '1 week',
    description: 'End-to-end DevOps workflow, monitoring importance, logs basics, and DevOps career roadmap.',
    lessons: [
      {
        title: 'Why Monitoring Matters',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Monitoring is a critical component of DevOps. It allows teams to track the health, performance, and reliability of applications and infrastructure. Without monitoring, issues may go unnoticed until they escalate, causing downtime, performance degradation, or security vulnerabilities.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Monitoring is not just about observing metrics—it’s about proactive management, helping teams detect problems early, optimize resources, and ensure a smooth end-to-end user experience.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Objectives of Monitoring</h3>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">Detect Problems Early</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Alerts notify teams when something is wrong (e.g., CPU spikes, memory leaks, network latency).</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">Improve Reliability</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Prevent downtime by addressing issues before they affect users and ensure SLAs are met.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">Optimize Performance</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Track metrics to identify bottlenecks and adjust resources dynamically (Auto Scaling).</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">Ensure Security</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Detect unusual activity or unauthorized access and respond quickly to potential threats.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">Support Automation</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Monitoring feeds data into automated workflows to trigger scripts or self-healing processes.</p>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Common Monitoring Metrics</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Infrastructure Metrics:</strong> CPU, memory, disk, network utilization</li>
            <li><strong>Application Metrics:</strong> Response time, error rates, request throughput</li>
            <li><strong>Log Metrics:</strong> Anomalies, exceptions, failed transactions</li>
            <li><strong>User Experience Metrics:</strong> Page load times, API response times, availability</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Tools Used in DevOps Monitoring</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>CloudWatch (AWS)</li>
            <li>Prometheus & Grafana</li>
            <li>Datadog</li>
            <li>Nagios</li>
            <li>ELK Stack (Elasticsearch, Logstash, Kibana)</li>
          </ul>
          <p class="mb-6 text-sm text-gray-600 dark:text-gray-400 italic">
            Why Tools Matter: They collect, visualize, and alert on metrics efficiently. Learning to use these tools is essential for real-world DevOps operations.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World Scenario</h3>
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <p class="mb-2 text-gray-700 dark:text-gray-300">A company runs a web application with multiple EC2 instances, a database, and an S3 bucket:</p>
            <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>CloudWatch monitors EC2 CPU, memory, and network</li>
              <li>Alerts notify the DevOps team when CPU > 80%</li>
              <li>Auto Scaling automatically adds new EC2 instances</li>
              <li>Grafana dashboards visualize metrics for real-time performance insights</li>
            </ul>
            <p class="mt-4 font-bold text-green-600 dark:text-green-400">✅ Outcome: Teams can proactively manage infrastructure, improve uptime, and maintain a smooth user experience.</p>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: 'Step 1: Create a CloudWatch Alarm',
            content: `aws cloudwatch put-metric-alarm \\
  --alarm-name HighCPUAlarm \\
  --metric-name CPUUtilization \\
  --namespace AWS/EC2 \\
  --statistic Average \\
  --period 300 \\
  --threshold 70 \\
  --comparison-operator GreaterThanThreshold \\
  --evaluation-periods 2 \\
  --alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe \\
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0

# Monitors EC2 CPU utilization above 70%
# Sends alerts via SNS`
          },
          {
            title: 'Step 2: List CloudWatch Alarms',
            content: `aws cloudwatch describe-alarms

# Verify alarms are active`
          },
          {
            title: 'Step 3: View Metrics in Terminal',
            content: `aws cloudwatch get-metric-statistics \\
  --metric-name CPUUtilization \\
  --namespace AWS/EC2 \\
  --start-time 2026-01-24T00:00:00Z \\
  --end-time 2026-01-24T23:59:59Z \\
  --period 300 \\
  --statistics Average \\
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0

# Retrieves CPU utilization stats for the EC2 instance`
          },
          {
            title: 'Step 4: Enable Auto Scaling (Basic Example)',
            content: `aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name web-asg \\
  --launch-configuration-name web-launch-config \\
  --min-size 1 --max-size 3 \\
  --desired-capacity 1 \\
  --vpc-zone-identifier subnet-0123456789abcdef0

# Automatically scales EC2 instances based on load`
          }
        ],
        terminalCommands: [
          'aws cloudwatch put-metric-alarm',
          'aws cloudwatch describe-alarms',
          'aws cloudwatch get-metric-statistics',
          'aws autoscaling create-auto-scaling-group',
          'aws ec2 describe-instances'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice setting up CloudWatch monitoring and basic Auto Scaling commands.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Create CPU Alarm</h3>
              <p class="text-sm text-gray-400 mb-2">Set up an alarm to trigger when CPU exceeds 70%.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch put-metric-alarm ...</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: List Alarms</h3>
              <p class="text-sm text-gray-400 mb-2">Verify that the alarm has been created and is active.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch describe-alarms</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Retrieve Metrics</h3>
              <p class="text-sm text-gray-400 mb-2">View historical CPU utilization data.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch get-metric-statistics ...</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Enable Auto Scaling</h3>
              <p class="text-sm text-gray-400 mb-2">Create an Auto Scaling group to handle load changes.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws autoscaling create-auto-scaling-group ...</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 5: Verify Setup</h3>
              <p class="text-sm text-gray-400 mb-2">Check the status of instances and alarms.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws ec2 describe-instances</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch describe-alarms</code>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 8.1</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Importance of monitoring in DevOps</li>
              <li>Key metrics: CPU, memory, network, logs, and application performance</li>
              <li>Tools for monitoring (CloudWatch, Prometheus, Grafana, etc.)</li>
              <li>Hands-on setup of CloudWatch alarms and auto-scaling</li>
              <li>Understanding proactive infrastructure management</li>
            </ul>
          </div>
        `
      },
      {
        title: 'DevOps End-to-End Workflow',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The DevOps workflow connects all stages of software development and IT operations into a continuous, automated pipeline. The goal is to deliver applications faster, reliably, and with higher quality.
          </p>
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            A complete DevOps workflow combines Version control (Git), Continuous Integration (CI), Continuous Delivery/Deployment (CD), Infrastructure as Code (Terraform), Configuration management (Ansible/Chef/Puppet), and Monitoring.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Stages of the DevOps Workflow</h3>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">1. Code & Version Control</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Developers write code and push to a version control system (e.g., Git)</li>
                <li>Branching and pull requests ensure collaboration and code review</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">2. Build & Continuous Integration</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>CI tools (Jenkins, GitHub Actions) automatically build the code</li>
                <li>Unit tests and static code analysis run automatically</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">3. Infrastructure Provisioning</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Terraform or similar tools automate infrastructure deployment</li>
                <li>Creates servers, databases, networks, and storage consistently</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">4. Configuration Management</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Tools like Ansible ensure servers are configured correctly</li>
                <li>Software installation and environment configuration are automated</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">5. Continuous Deployment / Delivery</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>CI/CD pipeline deploys the application to staging or production</li>
                <li>Can include automated integration and acceptance tests</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">6. Monitoring & Feedback</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>CloudWatch, Prometheus, or ELK monitor infrastructure and app health</li>
                <li>Alerts trigger automatic scaling or incident resolution</li>
              </ul>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-World Workflow Example</h3>
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <p class="mb-2 text-gray-700 dark:text-gray-300 font-bold">Scenario: Deploying a web application</p>
            <ol class="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Developer pushes new feature to GitHub</li>
              <li>Jenkins CI pipeline triggers: Runs unit tests & builds artifacts</li>
              <li>Terraform provisions staging infrastructure</li>
              <li>Ansible configures servers</li>
              <li>Application is deployed automatically (CD)</li>
              <li>Monitoring collects metrics (CPU, memory) → Alerts trigger if CPU > 80%</li>
            </ol>
            <p class="mt-4 font-bold text-green-600 dark:text-green-400">✅ Result: Automated, repeatable, and monitored deployments with minimal human intervention</p>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Benefits</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Faster delivery:</strong> Changes reach production in minutes or hours</li>
            <li><strong>Reliability:</strong> Automation reduces human errors</li>
            <li><strong>Scalability:</strong> Easy to replicate environments across dev, test, prod</li>
            <li><strong>Transparency:</strong> Teams can track changes, deployments, and system health</li>
          </ul>
        `,
        duration: '25 min',
        syntax: [
          {
            title: 'Step 1: Git Commit & Push',
            content: `git add .
git commit -m "Added new feature for web app"
git push origin main`
          },
          {
            title: 'Step 2: CI/CD Trigger (Jenkins Example)',
            content: `// Jenkinsfile snippet:
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Terraform Init & Apply') {
            steps {
                sh 'terraform init'
                sh 'terraform apply -auto-approve'
            }
        }
        stage('Deploy App') {
            steps {
                sh 'scp -i MyKey.pem app.zip ec2-user@<EC2_IP>:/home/ec2-user/'
                sh 'ssh -i MyKey.pem ec2-user@<EC2_IP> "unzip app.zip -d /var/www/html/"'
            }
        }
    }
}`
          },
          {
            title: 'Step 3: Monitor Infrastructure',
            content: `# Check EC2 CPU usage
aws cloudwatch get-metric-statistics \\
--metric-name CPUUtilization \\
--namespace AWS/EC2 \\
--start-time 2026-01-24T00:00:00Z \\
--end-time 2026-01-24T23:59:59Z \\
--period 300 \\
--statistics Average \\
--dimensions Name=InstanceId,Value=i-0123456789abcdef0`
          },
          {
            title: 'Step 4: Trigger Auto Scaling (Optional)',
            content: `aws autoscaling update-auto-scaling-group \\
--auto-scaling-group-name web-asg \\
--desired-capacity 3

# Automatically adds EC2 instances if load increases`
          }
        ],
        terminalCommands: [
          'git add .',
          'git commit -m "Deploy new version"',
          'git push origin main',
          'terraform init',
          'terraform apply -auto-approve',
          'aws cloudwatch get-metric-statistics',
          'aws autoscaling update-auto-scaling-group'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Simulate a complete DevOps end-to-end workflow from code commit to scaling.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Code & Version Control</h3>
              <p class="text-sm text-gray-400 mb-2">Commit and push your changes to trigger the pipeline.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add .</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git commit -m "Deploy new version"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push origin main</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Infrastructure Provisioning</h3>
              <p class="text-sm text-gray-400 mb-2">Pipeline automatically runs Terraform to update infrastructure.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">terraform init</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply -auto-approve</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Deploy Application</h3>
              <p class="text-sm text-gray-400 mb-2">Deploy the built artifact to the provisioned servers.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">scp -i MyKey.pem app.zip ...</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Monitor & Scale</h3>
              <p class="text-sm text-gray-400 mb-2">Check metrics and scale up if needed.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws cloudwatch get-metric-statistics ...</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws autoscaling update-auto-scaling-group ...</code>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 8.2</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Complete DevOps end-to-end workflow</li>
              <li>Integrating Git, CI/CD, Terraform, and monitoring</li>
              <li>Hands-on commands for automated deployment and scaling</li>
              <li>Real-world understanding of continuous feedback loops</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Logs vs Monitoring (Basics)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In DevOps, monitoring and logging are two core practices for maintaining healthy, reliable, and performant systems. Although they are often discussed together, they serve different purposes.
          </p>
          <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 class="font-bold text-blue-700 dark:text-blue-300 mb-2">Monitoring</h4>
              <p class="text-sm text-blue-600 dark:text-blue-400">Tracks real-time metrics to detect anomalies or performance issues.</p>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 class="font-bold text-green-700 dark:text-green-300 mb-2">Logging</h4>
              <p class="text-sm text-green-600 dark:text-green-400">Records detailed events and historical data for troubleshooting, auditing, and compliance.</p>
            </div>
          </div>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Understanding the difference is critical for effective incident response and system optimization.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Monitoring</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Definition:</strong> Monitoring involves observing system metrics such as CPU usage, memory, disk I/O, and network traffic.</p>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Purpose:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Detect issues before they impact users</li>
            <li>Trigger automated actions (e.g., auto-scaling)</li>
            <li>Provide dashboards for performance visualization</li>
          </ul>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Common Tools:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>AWS CloudWatch</li>
            <li>Prometheus & Grafana</li>
            <li>Datadog</li>
            <li>New Relic</li>
          </ul>
          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">Example: CPU usage > 80% → send alert to DevOps team → trigger auto-scaling</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Logging</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Definition:</strong> Logging records detailed events generated by applications, servers, and infrastructure. Logs can include:</p>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Application errors and stack traces</li>
            <li>Server startup/shutdown events</li>
            <li>API requests and responses</li>
            <li>User activity and access logs</li>
          </ul>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Purpose:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Debug issues after they occur</li>
            <li>Audit security and compliance</li>
            <li>Analyze trends over time</li>
          </ul>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Common Tools:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>ELK Stack (Elasticsearch, Logstash, Kibana)</li>
            <li>Fluentd</li>
            <li>Splunk</li>
            <li>Graylog</li>
          </ul>
          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
            <p class="font-mono text-sm text-gray-600 dark:text-gray-400">Example: Application returns HTTP 500 error → log stores details → DevOps analyzes root cause</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Differences Between Monitoring and Logging</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <tr>
                  <th class="px-4 py-2 border-b dark:border-gray-700">Feature</th>
                  <th class="px-4 py-2 border-b dark:border-gray-700">Monitoring</th>
                  <th class="px-4 py-2 border-b dark:border-gray-700">Logging</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">Focus</td>
                  <td class="px-4 py-2">Metrics & health</td>
                  <td class="px-4 py-2">Events & details</td>
                </tr>
                <tr class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">Timing</td>
                  <td class="px-4 py-2">Real-time</td>
                  <td class="px-4 py-2">Historical or near real-time</td>
                </tr>
                <tr class="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">Purpose</td>
                  <td class="px-4 py-2">Detect & prevent issues</td>
                  <td class="px-4 py-2">Investigate & analyze issues</td>
                </tr>
                <tr class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                  <td class="px-4 py-2 font-medium">Data Volume</td>
                  <td class="px-4 py-2">Small (aggregated metrics)</td>
                  <td class="px-4 py-2">Large (detailed records)</td>
                </tr>
                <tr class="bg-white dark:bg-gray-900">
                  <td class="px-4 py-2 font-medium">Example Tool</td>
                  <td class="px-4 py-2">CloudWatch, Prometheus</td>
                  <td class="px-4 py-2">ELK Stack, Splunk</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6">
             <p class="font-bold text-yellow-800 dark:text-yellow-200">Takeaway:</p>
             <ul class="list-disc pl-5 text-yellow-700 dark:text-yellow-300">
               <li>Monitoring tells you “something is wrong”</li>
               <li>Logging tells you “what exactly went wrong and why”</li>
             </ul>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World Scenario</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A web application experiences intermittent slow response times:</p>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">Monitoring:</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Grafana dashboard shows high CPU spikes at peak hours</li>
                <li>Alert is triggered to DevOps team</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-green-600 dark:text-green-400 mb-1">Logging:</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>ELK Stack logs show database connection timeouts</li>
                <li>DevOps identifies root cause → optimizes database connections</li>
              </ul>
            </div>
          </div>
          <p class="mt-4 font-bold text-green-600 dark:text-green-400">✅ Outcome: Monitoring alerts the issue, logs provide the solution</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Step 1: Monitor CPU Metrics (CloudWatch)',
            content: `aws cloudwatch get-metric-statistics \\\\
  --metric-name CPUUtilization \\\\
  --namespace AWS/EC2 \\\\
  --start-time 2026-01-24T00:00:00Z \\\\
  --end-time 2026-01-24T23:59:59Z \\\\
  --period 300 \\\\
  --statistics Average \\\\
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0`
          },
          {
            title: 'Step 2: View Application Logs (Linux Example)',
            content: `# View Nginx access logs
tail -f /var/log/nginx/access.log

# View error logs
tail -f /var/log/nginx/error.log`
          },
          {
            title: 'Step 3: Aggregate Logs with ELK Stack (Example)',
            content: `# Start Logstash pipeline (simple example)
bin/logstash -f logstash.conf

# logstash.conf snippet:
input {
  file { path => "/var/log/nginx/access.log" start_position => "beginning" }
}
output {
  elasticsearch { hosts => ["localhost:9200"] index => "nginx-logs" }
  stdout { codec => rubydebug }
}

# Sends Nginx logs to Elasticsearch
# View in Kibana dashboard`
          },
          {
            title: 'Step 4: Correlate Monitoring & Logs',
            content: `Monitoring triggers alert → CPU high
Check logs → Application errors or slow queries
Identify root cause → Fix issue → Monitor improvement`
          }
        ],
        terminalCommands: [
          'aws cloudwatch get-metric-statistics --metric-name CPUUtilization ...',
          'tail -f /var/log/nginx/access.log',
          'tail -f /var/log/nginx/error.log',
          'bin/logstash -f logstash.conf',
          'echo "Logs aggregated to Elasticsearch"'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Practice hands-on commands for CPU monitoring and log inspection, and understand how they work together.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Fetch CPU Metrics</h3>
              <p class="text-sm text-gray-400 mb-2">Retrieve statistics from CloudWatch (simulated).</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">aws cloudwatch get-metric-statistics ...</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Tail Application Logs</h3>
              <p class="text-sm text-gray-400 mb-2">View real-time access and error logs.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">tail -f /var/log/nginx/access.log</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">tail -f /var/log/nginx/error.log</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Aggregate Logs via Logstash</h3>
              <p class="text-sm text-gray-400 mb-2">Start the log pipeline to send data to Elasticsearch.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">bin/logstash -f logstash.conf</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Analyze and troubleshoot</h3>
              <p class="text-sm text-gray-400 mb-2">View Kibana dashboard to analyze logs. Combine alerts with logs to troubleshoot issues in real time.</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 8.3</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Difference between monitoring and logging</li>
              <li>Real-time metrics vs historical event records</li>
              <li>Hands-on commands for CPU monitoring and log inspection</li>
              <li>How monitoring and logs work together to detect and resolve issues</li>
            </ul>
          </div>
        `
      },
      {
        title: 'DevOps Best Practices',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            DevOps best practices are proven guidelines that help teams deliver software faster, safer, and more reliably. Tools alone do not make DevOps successful—how teams use those tools matters more.
          </p>
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">These practices focus on:</h3>
            <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Automation</li>
              <li>Collaboration</li>
              <li>Consistency</li>
              <li>Continuous improvement</li>
              <li>Reliability and security</li>
            </ul>
            <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Following DevOps best practices ensures that systems are scalable, maintainable, and production-ready.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Automate Everything Possible</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Manual tasks are slow, error-prone, and non-scalable. DevOps emphasizes automation at every stage:</p>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Code building and testing</li>
            <li>Infrastructure provisioning</li>
            <li>Application deployment</li>
            <li>Monitoring and alerting</li>
          </ul>
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6">
             <p class="font-bold text-green-800 dark:text-green-200">Example:</p>
             <ul class="list-disc pl-5 text-green-700 dark:text-green-300">
               <li>Instead of manually creating EC2 instances, use Terraform.</li>
               <li>Instead of manually deploying code, use CI/CD pipelines.</li>
             </ul>
             <p class="mt-2 font-bold text-green-600 dark:text-green-400">✅ Result: Faster releases, fewer mistakes.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Use Version Control for Everything</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Version control is not only for application code.</p>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Store the following in Git:</p>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Application source code</li>
            <li>Terraform files</li>
            <li>CI/CD pipeline configurations</li>
            <li>Scripts and configuration files</li>
          </ul>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Why this matters:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Track every change</li>
            <li>Roll back when something breaks</li>
            <li>Collaborate safely with teams</li>
          </ul>
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6">
             <p class="font-bold text-yellow-800 dark:text-yellow-200">Golden rule:</p>
             <p class="text-yellow-700 dark:text-yellow-300">If it changes, it belongs in Git.</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Keep Environments Consistent</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">A common DevOps problem: “It works on my machine, but not in production.”</p>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Best practices to avoid this:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Use Infrastructure as Code</li>
            <li>Use containers (Docker) to standardize runtime environments</li>
            <li>Maintain separate environments (dev, test, prod)</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300">Consistency ensures predictable behavior across all stages.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Implement CI/CD Pipelines</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">CI/CD pipelines automate code integration, testing, and deployment.</p>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Best practices:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Run tests on every commit</li>
            <li>Fail fast if tests break</li>
            <li>Deploy small, frequent changes</li>
          </ul>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Why small deployments matter:</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Easier debugging</li>
            <li>Faster rollbacks</li>
            <li>Reduced risk</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Monitor Everything & Act on Alerts</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Monitoring is useless if alerts are ignored.</p>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Best practices:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Monitor infrastructure + application metrics</li>
            <li>Set meaningful alert thresholds</li>
            <li>Avoid alert fatigue (too many alerts)</li>
          </ul>
          <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 class="font-bold text-green-700 dark:text-green-300 mb-2">Good Alert Example</h4>
              <p class="text-sm text-green-600 dark:text-green-400">CPU > 80% for 5 minutes</p>
            </div>
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 class="font-bold text-red-700 dark:text-red-300 mb-2">Bad Alert Example</h4>
              <p class="text-sm text-red-600 dark:text-red-400">CPU spikes for 5 seconds</p>
            </div>
          </div>
          <p class="mb-6 text-gray-700 dark:text-gray-300">Alerts should be actionable.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Design for Failure (Resilience)</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Failures are inevitable. DevOps systems must expect failure.</p>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Best practices:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Use auto-scaling</li>
            <li>Enable health checks</li>
            <li>Use multiple availability zones</li>
            <li>Implement backups and disaster recovery</li>
          </ul>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
             <p class="font-bold text-blue-800 dark:text-blue-200">Mindset:</p>
             <p class="text-blue-700 dark:text-blue-300">Don’t ask “Will it fail?” Ask “When it fails, how fast can we recover?”</p>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Secure by Default (DevSecOps)</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">Security should be part of DevOps, not an afterthought.</p>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Best practices:</h3>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Never hardcode secrets</li>
            <li>Use IAM roles and least privilege</li>
            <li>Scan code and containers for vulnerabilities</li>
            <li>Encrypt data at rest and in transit</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-bold">Security automation = DevSecOps.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Continuous Feedback & Improvement</h2>
          <p class="mb-2 text-gray-700 dark:text-gray-300">DevOps is not a one-time setup. Teams must:</p>
          <ul class="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Review logs and metrics</li>
            <li>Analyze failures and incidents</li>
            <li>Improve pipelines continuously</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300">Post-incident reviews help teams learn and improve without blame.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-World DevOps Best Practice Flow</h2>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <ol class="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Developer pushes code to Git</li>
              <li>CI pipeline runs tests automatically</li>
              <li>Terraform provisions infrastructure</li>
              <li>Application deploys via CD</li>
              <li>Monitoring tracks performance</li>
              <li>Alerts notify issues</li>
              <li>Feedback improves next deployment</li>
            </ol>
            <p class="mt-4 font-bold text-green-600 dark:text-green-400">✅ Result: Stable, fast, and reliable delivery pipeline</p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Example: Git + Terraform Workflow',
            content: `git checkout -b feature-update
terraform fmt
terraform validate
terraform plan
git add .
git commit -m "Updated infrastructure with best practices"
git push origin feature-update`
          },
          {
            title: 'Example: CI/CD Pipeline Best Practice',
            content: `pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                sh 'terraform apply -auto-approve'
            }
        }
    }
}`
          },
          {
            title: 'Example: Monitoring Threshold Setup',
            content: `aws cloudwatch put-metric-alarm \\\\
--alarm-name StableCPUAlarm \\\\
--metric-name CPUUtilization \\\\
--threshold 80 \\\\
--evaluation-periods 2`
          }
        ],
        terminalCommands: [
          'terraform fmt',
          'terraform validate',
          'git add .',
          'git commit -m "Follow DevOps best practices"',
          'git push origin main',
          'terraform apply -auto-approve',
          'aws cloudwatch describe-alarms'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Apply DevOps best practices in a simulated workflow: Validate, Commit, Deploy, and Monitor.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Validate Infrastructure Code</h3>
              <p class="text-sm text-gray-400 mb-2">Ensure your code is clean and error-free before committing.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">terraform fmt</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform validate</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Commit with Version Control</h3>
              <p class="text-sm text-gray-400 mb-2">Save your changes with a clear message.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git add .</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git commit -m "Follow DevOps best practices"</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">git push origin main</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Deploy via Pipeline</h3>
              <p class="text-sm text-gray-400 mb-2">Simulate an automated deployment.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform apply -auto-approve</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Monitor and Improve</h3>
              <p class="text-sm text-gray-400 mb-2">Check system health and review logs.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">aws cloudwatch describe-alarms</code>
              <p class="text-xs text-gray-500 italic">Review logs and metrics for continuous improvement.</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 8.4</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Core DevOps best practices used in real companies</li>
              <li>Importance of automation, CI/CD, monitoring, and security</li>
              <li>How to build resilient and scalable systems</li>
              <li>Practical commands and workflows for daily DevOps work</li>
            </ul>
          </div>
        `
      },
      {
        title: 'DevOps Career Roadmap',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">The Path Forward</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Congratulations on completing the core modules! You now have a solid foundation in DevOps culture, tools, and practices. But this is just the beginning.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">The "T-Shaped" Engineer</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Successful DevOps engineers often follow a "T-shaped" skill set:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Broad Knowledge (Top of T):</strong> Linux, Networking, Git, Basic Cloud, Scripting (Python/Bash).</li>
            <li><strong>Deep Knowledge (Stem of T):</strong> Master one area, e.g., CI/CD (Jenkins/GitLab), Container Orchestration (Kubernetes), or Infrastructure as Code (Terraform).</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Recommended Certifications</h3>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">Beginner / Associate</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>AWS Certified Cloud Practitioner</li>
                <li>HashiCorp Certified: Terraform Associate</li>
                <li>Docker Certified Associate (DCA)</li>
              </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="font-bold text-purple-600 dark:text-purple-400 mb-1">Advanced / Professional</h4>
              <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>AWS Certified DevOps Engineer - Professional</li>
                <li>Certified Kubernetes Administrator (CKA)</li>
              </ul>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Job Roles & Progression</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Junior DevOps Engineer:</strong> Maintenance, small automations, fixing build failures.</li>
            <li><strong>DevOps Engineer:</strong> Building pipelines, managing cloud infrastructure, monitoring.</li>
            <li><strong>Senior DevOps Engineer:</strong> Architecture design, security, scaling, mentoring.</li>
            <li><strong>Site Reliability Engineer (SRE):</strong> Focus on system stability, SLAs, and incident response.</li>
          </ul>

          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6">
            <p class="font-bold text-green-800 dark:text-green-200">Next Step:</p>
            <p class="text-green-700 dark:text-green-300">
              Start the <strong>Capstone Project (Module 9)</strong> to apply everything you've learned in a real-world scenario.
            </p>
          </div>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Skill Checklist',
            content: `[x] Linux Basics (Commands, Permissions)
[x] Version Control (Git, GitHub)
[x] CI/CD (Jenkins, Pipelines)
[x] Containers (Docker, Dockerfile)
[x] Cloud (AWS EC2, S3)
[ ] Orchestration (Kubernetes) - Next Level
[ ] IaC (Terraform) - Next Level
[ ] Monitoring (Prometheus/Grafana) - Next Level`
          },
          {
            title: 'Learning Path',
            content: `1. Master the Fundamentals (This Course)
2. Build Projects (Capstone)
3. Get Certified (AWS/Terraform)
4. Learn Kubernetes (Deep Dive)
5. Apply for Jobs`
          }
        ],
        terminalCommands: [
          'echo "Checking DevOps Toolkit..."',
          'git --version',
          'docker --version',
          'terraform --version',
          'aws --version',
          'echo "Ready for Capstone!"'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Verify your local environment is ready for the Capstone Project.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check Toolkit</h3>
              <p class="text-sm text-gray-400 mb-2">Run a script to check installed versions of your tools.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">echo "Checking DevOps Toolkit..."</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Verify Versions</h3>
              <p class="text-sm text-gray-400 mb-2">Ensure you have the core tools installed.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git --version</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker --version</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">terraform --version</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Confirmation</h3>
              <p class="text-sm text-gray-400 mb-2">Confirm you are ready to proceed.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">echo "Ready for Capstone!"</code>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ Ready for Module 9?</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>All tools checked</li>
              <li>Mindset ready</li>
              <li>Let's build the pipeline!</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Hands-On: Mini Project',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Mini Project Overview</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This mini project is designed to connect everything the student has learned so far into a single working DevOps workflow.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            By the end of this project, the student will:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Use Git for version control</li>
            <li>Build and deploy an application</li>
            <li>Containerize the application using Docker</li>
            <li>Automate deployment using CI/CD concepts</li>
            <li>Monitor the application and infrastructure</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This project simulates a real DevOps engineer’s daily work.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Project Title</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Deploy a Simple Web Application with CI/CD, Docker, and Monitoring</strong>
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Project Scenario</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A company wants to deploy a simple web application and ensure:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Code is version-controlled</li>
            <li>Deployment is automated</li>
            <li>Application runs consistently using containers</li>
            <li>Basic monitoring is enabled</li>
            <li>System can be debugged using logs</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            You are the DevOps Engineer responsible for setting this up.
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Architecture Overview (Beginner-Friendly)</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Developer writes code</li>
            <li>Code is pushed to GitHub</li>
            <li>CI/CD pipeline builds the app</li>
            <li>Docker container is created</li>
            <li>Application is deployed on a Linux server</li>
            <li>Monitoring checks system health</li>
            <li>Logs are used for troubleshooting</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Tools Used</h3>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Git & GitHub</li>
            <li>Linux</li>
            <li>Docker</li>
            <li>Jenkins (or manual CI simulation)</li>
            <li>Basic AWS EC2 (or local VM)</li>
            <li>CloudWatch / Linux monitoring tools</li>
          </ul>
        `,
        duration: '45 min',
        syntax: [
          {
            title: 'Step 1: Create Simple Web Application',
            content: `mkdir devops-mini-project
cd devops-mini-project

# Create index.html:
<!DOCTYPE html>
<html>
<head>
  <title>DevOps Mini Project</title>
</head>
<body>
  <h1>Welcome to DevOps Mini Project</h1>
  <p>CI/CD, Docker & Monitoring</p>
</body>
</html>`
          },
          {
            title: 'Step 2: Create Dockerfile',
            content: `FROM nginx:latest
COPY index.html /usr/share/nginx/html/index.html

# Build and run container:
docker build -t devops-mini-app .
docker run -d -p 8080:80 devops-mini-app

# Access in browser:
# http://localhost:8080`
          },
          {
            title: 'Step 3: Push Code to GitHub',
            content: `git init
git add .
git commit -m "Initial DevOps mini project"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main`
          },
          {
            title: 'Step 4: CI/CD Pipeline (Beginner Jenkinsfile)',
            content: `pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t devops-mini-app .'
            }
        }
        stage('Run Container') {
            steps {
                sh 'docker run -d -p 8080:80 devops-mini-app || true'
            }
        }
    }
}

# Pipeline outcome:
# Code → Docker build → Deployment`
          },
          {
            title: 'Step 5: Monitor Application & Server',
            content: `# Check container status:
docker ps

# Check server resources:
top
df -h
free -m

# Check Nginx logs:
docker logs <container_id>`
          },
          {
            title: 'Step 6: Basic Alert (Conceptual)',
            content: `# Monitor CPU usage:
uptime

# If load increases → scale container or server.
# This introduces monitoring-driven decisions.`
          }
        ],
        terminalCommands: [
          'git clone <repo-url>',
          'cd devops-mini-project',
          'docker build -t devops-mini-app .',
          'docker run -d -p 8080:80 devops-mini-app',
          'curl http://localhost:8080',
          'docker logs <container_id>',
          'top',
          'free -m',
          'df -h'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Execute a complete DevOps workflow: Code, Build, Deploy, and Monitor.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Setup & Code</h3>
              <p class="text-sm text-gray-400 mb-2">Clone the repository and enter the project directory.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">git clone <repo-url></code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">cd devops-mini-project</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Build & Deploy</h3>
              <p class="text-sm text-gray-400 mb-2">Build the Docker image and run the container.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker build -t devops-mini-app .</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker run -d -p 8080:80 devops-mini-app</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Verify Application</h3>
              <p class="text-sm text-gray-400 mb-2">Ensure the application is running and accessible.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">curl http://localhost:8080</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 4: Monitor & Debug</h3>
              <p class="text-sm text-gray-400 mb-2">Check logs and system resources.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">docker logs <container_id></code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">top</code>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ Deliverables</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>GitHub repository link</li>
              <li>Dockerfile</li>
              <li>Running application screenshot</li>
              <li>Jenkinsfile (or CI steps)</li>
              <li>Monitoring screenshots or commands output</li>
            </ul>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 8.6</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>End-to-end DevOps workflow implementation</li>
              <li>Git-based version control</li>
              <li>Docker containerization</li>
              <li>CI/CD basics</li>
              <li>Monitoring and logging fundamentals</li>
              <li>Real-world DevOps problem-solving</li>
            </ul>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">🚀 Why This Mini Project Matters</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>Added to resume</li>
              <li>Shown in interviews</li>
              <li>Extended into a capstone project</li>
              <li>Used as a foundation for Kubernetes & cloud deployments</li>
            </ul>
          </div>
        `
      },
      {
        title: 'Cost Awareness (Beginner Level)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Is Cost Awareness in DevOps?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Cost awareness means understanding how much money your infrastructure and tools are consuming and making sure you’re not wasting resources.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In real companies:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>DevOps engineers are not only responsible for uptime</li>
            <li>They are also responsible for optimizing cloud and infrastructure costs</li>
          </ul>
          <div class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
            <p class="text-yellow-800 dark:text-yellow-200">
              💡 A system that works but wastes money is considered poorly designed
            </p>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Why Cost Awareness Is Important for Beginners</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Many beginners think: "My job is only to deploy and monitor."
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In reality:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Unused servers = money loss</li>
            <li>Idle containers = money loss</li>
            <li>Over-sized instances = money loss</li>
            <li>Unnecessary logs = money loss</li>
          </ul>
          <p class="mb-6 text-gray-700 dark:text-gray-300 font-semibold">
            Companies love engineers who save money 💰
          </p>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Common Areas Where Cost Is Wasted</h3>
          <div class="space-y-4 mb-6">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">1️⃣ Idle Servers</h4>
              <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li>EC2 running but no traffic</li>
                <li>Test servers left ON after testing</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">2️⃣ Over-Provisioning</h4>
              <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Using large instances when small ones are enough</li>
                <li>Running too many containers</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">3️⃣ Storage Waste</h4>
              <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Old backups</li>
                <li>Unused Docker images</li>
                <li>Unused volumes</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">4️⃣ Logging & Monitoring Costs</h4>
              <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Too many logs stored for too long</li>
                <li>No log rotation</li>
              </ul>
            </div>
          </div>

          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Beginner Cost Awareness Mindset</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Always ask:
          </p>
          <ul class="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>❓ Is this resource really needed?</li>
            <li>❓ Can it be stopped when not in use?</li>
            <li>❓ Can it be scaled down?</li>
            <li>❓ Is there a cheaper alternative?</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This mindset makes you stand out as a DevOps engineer.
          </p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: 'Check Running Resources',
            content: `# Linux Processes
top

# Disk Usage
df -h

# Directory Size
du -sh /var/log/*`
          },
          {
            title: 'Docker Cost Optimization',
            content: `# List Running Containers
docker ps

# List All Containers
docker ps -a

# Remove Stopped Containers
docker container prune

# Remove Unused Images
docker image prune -a

# Remove Unused Volumes
docker volume prune`
          },
          {
            title: 'Log Rotation (Basic)',
            content: `# Check log size:
ls -lh /var/log/

# Rotate logs (concept):
# Keep only last 7–14 days
# Delete older logs automatically`
          },
          {
            title: 'Cloud Cost Basics (Beginner View)',
            content: `# Even without deep cloud knowledge, remember:

# Stop instances when not in use
# Use free-tier when learning
# Avoid running servers 24/7 for practice`
          }
        ],
        terminalCommands: [
          'uptime',
          'free -m',
          'df -h',
          'docker stats'
        ],
        terminalGuide: `
          <h2 class="text-xl font-semibold mb-4 text-white">🎯 Objective</h2>
          <p class="mb-6 text-gray-300">Perform live practical checks to identify resource usage and potential cost savings.</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 1: Check System Health</h3>
              <p class="text-sm text-gray-400 mb-2">Check uptime and memory usage to identify idle or over-utilized resources.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm mb-1">uptime</code>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">free -m</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 2: Check Storage</h3>
              <p class="text-sm text-gray-400 mb-2">Verify disk usage to find wasted storage space.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">df -h</code>
            </div>

            <div>
              <h3 class="text-lg font-medium text-[#00bceb] mb-2">Step 3: Check Docker Resources</h3>
              <p class="text-sm text-gray-400 mb-2">Monitor container resource consumption.</p>
              <code class="block bg-black/50 p-2 rounded text-green-400 font-mono text-sm">docker stats</code>
            </div>

            <div class="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
              <p class="text-gray-300 text-sm">
                <strong>Decision Time:</strong> Based on these outputs, decide whether to scale up, scale down, or stop unused services.
              </p>
            </div>
          </div>

          <div class="mt-8 p-4 rounded-xl bg-gray-800 border border-gray-700">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">📊 Real Interview Question Example</h2>
            <p class="text-gray-300 font-medium mb-2">Q: Why is cost awareness important for a DevOps engineer?</p>
            <div class="bg-black/30 p-3 rounded text-gray-400 italic">
              "Cost awareness helps ensure that infrastructure is efficient, scalable, and does not waste resources. A DevOps engineer optimizes performance while minimizing unnecessary expenses, which directly benefits the business."
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00bceb]/10 to-blue-600/10 border border-[#00bceb]/20">
            <h2 class="text-xl font-bold mb-3 text-[#00bceb]">✅ What You Learned in Topic 8.7</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              <li>What cost awareness means</li>
              <li>Where beginners waste money</li>
              <li>How to identify unnecessary resource usage</li>
              <li>Basic Docker and Linux cleanup</li>
              <li>How DevOps engineers save company costs</li>
            </ul>
          </div>

          <div class="mt-8 p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center">
            <h2 class="text-2xl font-bold mb-2 text-green-400">🎉 Module 8 Completed Successfully</h2>
            <p class="text-gray-300 mb-4">You have completed Module 8: Beginner Monitoring & DevOps Workflow</p>
            <div class="text-left max-w-md mx-auto">
              <p class="text-sm text-gray-400 mb-2">You now understand:</p>
              <ul class="list-disc pl-5 text-gray-300 space-y-1">
                <li>Monitoring basics</li>
                <li>Logs & alerts</li>
                <li>CI/CD flow</li>
                <li>Docker deployments</li>
                <li>Cost-aware infrastructure thinking</li>
              </ul>
            </div>
          </div>
        `
      }
    ]
  }
];

// --- Components ---

type FloatingDockProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  onPrevModule: () => void;
  disabledPrev: boolean;
  onNextModule: () => void;
  disabledNext: boolean;
  onHome: () => void;
};

const FloatingDock = ({ isDark, onToggleTheme, onPrevModule, disabledPrev, onNextModule, disabledNext, onHome }: FloatingDockProps) => (
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

type ChatPanelProps = {
  isDark: boolean;
  messages: ChatMessage[];
  loading: boolean;
  onSend: (text: string) => void;
};

function ChatPanel({ isDark, messages, loading, onSend }: ChatPanelProps) {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (text.trim() && !loading) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <aside
      className={`${
        isDark
          ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/20'
          : 'bg-gradient-to-br from-white/70 to-white/40 border-gray-300/40'
      } backdrop-blur-2xl backdrop-saturate-150 w-full lg:sticky lg:top-4 lg:self-start h-[calc(100vh-240px)] min-h-[520px] rounded-2xl border p-4 flex flex-col shadow-lg ring-1 ${
        isDark ? 'ring-white/10' : 'ring-white/60'
      }`}
    >
      <div
        className={`flex flex-col items-start gap-0.5 pb-3 border-b ${
          isDark ? 'border-white/20 bg-white/10' : 'border-[#00bceb]/30 bg-white/60'
        } backdrop-blur-xl rounded-lg px-3 py-2`}
      >
        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#00bceb]'}`}>Personal Teacher</h3>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ask me anything about the components</span>
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto space-y-4 py-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`${
                msg.role === 'assistant'
                  ? isDark
                    ? 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                    : 'bg-[#00bceb] text-white border border-[#00bceb]'
                  : isDark
                  ? 'bg-black/60 backdrop-blur-xl text-white border border-white/20'
                  : 'bg-blue-600/70 backdrop-blur-xl text-white border border-blue-300/40'
              } max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap break-words leading-relaxed text-[15px]`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className={`${
                isDark ? 'bg-white/10 backdrop-blur-xl border border-white/20' : 'bg-[#00bceb] border border-[#00bceb]'
              } rounded-2xl px-4 py-3 shadow-sm`}
            >
              <span className={`text-sm ${isDark ? 'text-white/70' : 'text-white/90'}`}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 border-t space-y-3">
        <div
          className={`flex items-center gap-2 ${
            isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40'
          } backdrop-blur-xl rounded-xl border p-2 shadow-sm`}
        >
          <button
            className={`p-2 rounded ${isDark ? 'hover:bg-white/15' : 'hover:bg-white'} shrink-0`}
            aria-label="Voice input (not implemented)"
          >
            <Mic className={`h-5 w-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`} />
          </button>
          <input
            type="text"
            className={`flex-1 bg-transparent outline-none min-w-0 ${
              isDark ? 'text-white placeholder-white/60' : 'text-gray-900 placeholder-gray-600'
            }`}
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            disabled={loading}
          />
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isDark ? 'bg-white text-gray-900' : 'bg-[#00bceb] text-white'
            } disabled:opacity-50 shrink-0`}
            onClick={handleSend}
            disabled={loading || !text.trim()}
          >
            <Send className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </aside>
  );
}

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

const CourseLearningDevOpsBeginner: React.FC = () => {
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
    'Welcome to DevOps Terminal!',
    'Type "help" to see available commands.',
    ''
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Identify current module/lesson
  const activeModule = useMemo(() => courseData.find(m => m.id === activeModuleId) || courseData[0], [activeModuleId]);
  const activeLesson = useMemo(() => activeModule?.lessons[activeLessonIndex], [activeModule, activeLessonIndex]);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your personal DevOps teacher. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleSendMessage = async (text: string) => {
    const newMsg: ChatMessage = { role: 'user', content: text };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setLoading(true);

    try {
      // Use course context for better AI responses
      const answer = await askLLM(text, updated, {
        courseContext: {
          courseName: 'DevOps Beginner',
          moduleName: activeModule?.title,
          lessonTitle: activeLesson?.title,
          lessonContent: activeLesson?.content.replace(/<[^>]*>/g, '').substring(0, 1500)
        }
      });
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
        '  docker    - Docker CLI (simulated)',
        '  git       - Git CLI (simulated)',
        '  kubectl   - Kubernetes CLI (simulated)'
      ];
    }
    
    if (cmd === 'clear') return [];
    
    if (cmd === 'whoami') return ['devops-student'];
    
    if (cmd === 'date') return [new Date().toString()];
    
    if (cmd === 'ls') return ['Dockerfile', 'docker-compose.yml', 'src', 'README.md', 'jenkins-pipeline'];
    
    if (cmd === 'pwd') return ['/home/student/project'];

    if (cmd.startsWith('docker')) {
       return [
         'Docker version 20.10.21, build baeda1f',
         'Client: Docker Engine - Community',
         'Server: Docker Engine - Community'
       ];
    }

    if (cmd.startsWith('git')) {
       if (cmd === 'git status') {
         return ['On branch main', 'nothing to commit, working tree clean'];
       }
       return ['git version 2.34.1'];
    }
    
    if (cmd.startsWith('kubectl')) {
       return ['Client Version: v1.25.0', 'Kustomize Version: v4.5.7'];
    }
    
    if (cmd.startsWith('echo ')) return [command.slice(5)];
    
    return [`Command not found: ${cmd}. Type "help" for list of commands.`];
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    if (terminalInput.trim().toLowerCase() === 'clear') {
      setTerminalHistory(['Welcome to DevOps Terminal!', 'Type "help" to see available commands.', '']);
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

  // Sync slug with active module if needed
  useEffect(() => {
    if (slug && slug !== activeModuleId) {
       const found = courseData.find(m => m.id === slug);
       if (found) setActiveModuleId(slug);
    }
  }, [slug]);

  // Navigation handlers (Adapted for FloatingDock)
  const handleNextModule = () => {
    const currentModuleIndex = courseData.findIndex(m => m.id === activeModuleId);
    if (currentModuleIndex < courseData.length - 1) {
      const nextModule = courseData[currentModuleIndex + 1];
      setActiveModuleId(nextModule.id);
      setActiveLessonIndex(0);
    }
  };

  const handlePrevModule = () => {
    const currentModuleIndex = courseData.findIndex(m => m.id === activeModuleId);
    if (currentModuleIndex > 0) {
      const prevModule = courseData[currentModuleIndex - 1];
      setActiveModuleId(prevModule.id);
      setActiveLessonIndex(0);
    }
  };

  const handleHome = () => {
    navigate('/student-portal');
  };
  
  // Calculate disabled states for FloatingDock
  const currentModuleIndex = courseData.findIndex(m => m.id === activeModuleId);
  const disabledPrev = currentModuleIndex === 0;
  const disabledNext = currentModuleIndex === courseData.length - 1;

  return (
    <div className={`flex h-screen ${isDark ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden font-sans`}>
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeModuleId={activeModuleId}
        setActiveModuleId={setActiveModuleId}
        activeLessonIndex={activeLessonIndex}
        setActiveLessonIndex={setActiveLessonIndex}
        completedLessons={completedLessons}
      />

      {/* CENTER - MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#121212]">
         {/* Top Navigation Bar */}
         <div className="h-[50px] bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4 z-20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <span className="cursor-pointer hover:text-white" onClick={() => navigate('/devops-beginner')}>DevOps Beginner</span>
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

         {/* Content Scroll Area */}
         <div id="content-scroll-area" className="flex-1 overflow-y-auto w-full relative">
             {/* Hero / Banner Section */}
             <div className="relative w-full h-[300px] shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60 z-10" />
                <img 
                   src={courseIntros['devops-beginner']?.heroImg || "https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&w=1200"}
                   alt="DevOps Background" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&w=1200";
                   }}
                />
                
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

                <button 
                   className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-blue-600/90 hover:bg-blue-500 text-white p-2 rounded-r-lg shadow-lg transition-transform hover:scale-110"
                   onClick={() => {
                      if (activeLessonIndex > 0) setActiveLessonIndex(activeLessonIndex - 1);
                   }}
                   disabled={activeLessonIndex === 0}
                   style={{ opacity: activeLessonIndex === 0 ? 0 : 1 }}
                >
                   <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <button 
                   className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-blue-600/90 hover:bg-blue-500 text-white p-2 rounded-l-lg shadow-lg transition-transform hover:scale-110"
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

                    {/* Tab Content */}
                    <div className="min-h-[500px]">
                       {activeContentTab === 'lesson' && (
                          <div className="animate-fadeIn">
                             <div 
                               className={`prose ${isDark ? 'prose-invert' : ''} prose-lg max-w-none prose-headings:text-[#00bceb] prose-a:text-blue-400 prose-code:text-[#00bceb] prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-[#333]`}
                               dangerouslySetInnerHTML={{ __html: activeLesson.content }} 
                             />
                             
                             {/* Navigation Buttons */}
                             <div className="mt-12 flex justify-between items-center py-8 border-t border-gray-800">
                                <button 
                                   onClick={() => {
                                      if (activeLessonIndex > 0) {
                                         setActiveLessonIndex(activeLessonIndex - 1);
                                      } else {
                                         handlePrevModule();
                                      }
                                   }}
                                   disabled={activeLessonIndex === 0 && currentModuleIndex === 0}
                                   className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                                      (activeLessonIndex === 0 && currentModuleIndex === 0)
                                      ? 'text-gray-600 cursor-not-allowed' 
                                      : 'bg-[#2d2d2d] hover:bg-[#3e3e42] text-white'
                                   }`}
                                >
                                   <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                
                                <button 
                                   onClick={() => {
                                      // Mark current as completed
                                      setCompletedLessons(prev => new Set(prev).add(`${activeModuleId}-${activeLessonIndex}`));
                                      
                                      if (activeLessonIndex < activeModule.lessons.length - 1) {
                                         setActiveLessonIndex(activeLessonIndex + 1);
                                      } else if (currentModuleIndex < courseData.length - 1) {
                                         handleNextModule();
                                      } else {
                                         setShowCompletionModal(true);
                                      }
                                   }}
                                   className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-[#00bceb] hover:bg-[#00a0c6] text-white transition-colors shadow-lg shadow-[#00bceb]/20"
                                >
                                   {activeLessonIndex === activeModule.lessons.length - 1 && currentModuleIndex === courseData.length - 1 ? 'Finish Course' : 'Next Topic'}
                                   <ChevronRight className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                       )}

                       {activeContentTab === 'syntax' && (
                          <div className="space-y-6 animate-fadeIn">
                             <h2 className="text-2xl font-bold text-white mb-6">Syntax & Resources</h2>
                             {activeLesson.syntax ? (
                                activeLesson.syntax.map((item, idx) => (
                                   <div key={idx} className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden shadow-md">
                                      <div className="px-4 py-3 bg-[#252526] border-b border-[#333] font-mono text-sm text-[#00bceb] font-bold">
                                         {item.title}
                                      </div>
                                      <div className="p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap bg-[#121212]">
                                         {renderContentWithLinks(item.content)}
                                      </div>
                                   </div>
                                ))
                             ) : (
                                <div className="text-center py-16 text-gray-500 bg-[#1e1e1e]/50 rounded-xl border border-[#333] border-dashed">
                                   <Code className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                   <p className="text-lg">No syntax examples available for this lesson.</p>
                                </div>
                             )}
                          </div>
                       )}

                       {activeContentTab === 'terminal' && (
                          <div className="h-full flex flex-col animate-fadeIn">
                             <div className="bg-[#1e1e1e] rounded-lg border border-[#333] shadow-2xl overflow-hidden flex flex-col h-[500px]">
                                <div className="px-4 py-3 bg-[#252526] border-b border-[#333] flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono text-gray-400">devops-student@workstation:~</span>
                                   </div>
                                   <div className="flex gap-1.5">
                                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                   </div>
                                </div>
                                <div 
                                   ref={terminalRef}
                                   className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-[#0a0a0a] text-gray-300 selection:bg-white/20"
                                   onClick={() => document.getElementById('terminal-input')?.focus()}
                                >
                                   {terminalHistory.map((line, idx) => (
                                      <div key={idx} className="whitespace-pre-wrap mb-1.5 leading-relaxed">{line}</div>
                                   ))}
                                   <form onSubmit={handleTerminalSubmit} className="flex items-center mt-2 group">
                                      <span className="mr-3 text-[#00bceb] font-bold">$</span>
                                      <input
                                         id="terminal-input"
                                         type="text"
                                         value={terminalInput}
                                         onChange={(e) => setTerminalInput(e.target.value)}
                                         onKeyDown={handleTerminalKeyDown}
                                         className="flex-1 bg-transparent border-none outline-none text-gray-100 font-mono placeholder-gray-700"
                                         autoComplete="off"
                                         autoFocus
                                         spellCheck="false"
                                      />
                                      <span className="w-2 h-4 bg-gray-500 animate-pulse ml-1 opacity-0 group-focus-within:opacity-100 block" />
                                   </form>
                                </div>
                             </div>
                             
                             {/* Quick Commands */}
                             <div className="mt-8">
                                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                   <div className="w-1 h-4 bg-[#00bceb] rounded-full" />
                                   Available Commands
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                   {activeLesson.terminalCommands?.map(cmd => (
                                      <button
                                         key={cmd}
                                         onClick={() => {
                                            setTerminalInput(cmd);
                                            document.getElementById('terminal-input')?.focus();
                                         }}
                                         className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#333] hover:border-[#00bceb]/50 rounded-lg text-xs font-mono text-[#00bceb] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                      >
                                         {cmd}
                                      </button>
                                   )) || (
                                      <p className="text-sm text-gray-500 italic">No specific commands suggested for this lesson.</p>
                                  )}
                               </div>
                            </div>

                            {/* Terminal Guide */}
                            {activeLesson.terminalGuide && (
                               <div className="mt-8 bg-[#1e1e1e] border border-[#333] rounded-xl p-6 animate-fadeIn">
                                  <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                     <div className="w-1 h-4 bg-green-500 rounded-full" />
                                     Lab Guide
                                  </h3>
                                  <div 
                                     className="prose prose-invert max-w-none text-sm text-gray-300 space-y-2"
                                     dangerouslySetInnerHTML={{ __html: activeLesson.terminalGuide }} 
                                  />
                               </div>
                            )}
                         </div>
                      )}
                    </div>
                 </div>
                 
                 {/* RIGHT COLUMN - CHAT (1/3) */}
                 <div className="hidden xl:block xl:col-span-1 pl-4">
                    <div className="sticky top-6">
                       <ChatPanel 
                          isDark={isDark} 
                          messages={messages} 
                          loading={loading} 
                          onSend={handleSendMessage} 
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl animate-scaleIn">
            <button 
              onClick={() => setShowCompletionModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Course Completed!</h2>
            <p className="text-gray-400 mb-8">
              Congratulations! You have successfully completed the DevOps Beginner course.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/student-portal')}
                className="w-full py-3 bg-[#00bceb] hover:bg-[#00a0c6] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#00bceb]/20"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full py-3 bg-[#2d2d2d] hover:bg-[#3e3e42] text-gray-300 hover:text-white rounded-xl font-medium transition-colors"
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLearningDevOpsBeginner;


