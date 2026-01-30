import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function DevOpsBeginnerIntroductionPage() {
  const navigate = useNavigate();

  const modules = [
    {
      slug: 'module-1',
      title: 'Module 1 — Introduction to DevOps',
      desc: 'Understand DevOps culture, lifecycle, CI/CD concepts, toolchain, and roles.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Devops-toolchain.svg',
      topics: [
        'What is DevOps?',
        'Traditional SDLC vs DevOps',
        'DevOps Lifecycle',
        'Continuous Integration / Delivery / Deployment',
        'Toolchain overview',
        'DevOps Engineer responsibilities'
      ]
    },
    {
      slug: 'module-2',
      title: 'Module 2 — Linux Fundamentals for DevOps',
      desc: 'Work confidently in Linux: files, permissions, processes, networking, packages, and logs.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png',
      topics: [
        'Why Linux for DevOps',
        'File System Hierarchy & Navigation',
        'Users, Groups & Sudo',
        'Permissions & Ownership',
        'Package Management (apt/yum)',
        'Processes & Monitoring',
        'Networking & Firewalls'
      ]
    },
    {
      slug: 'module-3',
      title: 'Module 3 — Version Control & Collaboration',
      desc: 'Master Git fundamentals, workflows, branching, merging, best practices, and GitHub collaboration.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg',
      topics: [
        'Why Version Control?',
        'Git Basics (Hands-On)',
        'Git Workflow Explained',
        'Remote Repositories (GitHub)',
        'Branching & Merging',
        'Git Best Practices',
        'Collaboration & Pull Requests'
      ]
    },
    {
      slug: 'module-4',
      title: 'Module 4 — Build Tools & CI Basics',
      desc: 'Understand build automation with Maven/MSBuild and continuous integration with Jenkins.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg',
      topics: [
        'Build Automation Concepts',
        'Maven (Java) & MSBuild (.NET)',
        'Build Lifecycles',
        'Introduction to CI',
        'Jenkins Basics',
        'Creating Jenkins Jobs',
        'Automating Builds'
      ]
    },
    {
      slug: 'module-5',
      title: 'Module 5 — Containers & Docker',
      desc: 'Learn containerization concepts, Docker architecture, images, Dockerfiles, and pipelines.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg',
      topics: [
        'Containers vs Virtual Machines',
        'Docker Architecture',
        'Docker Images & Containers',
        'Dockerfile Basics',
        'Container Best Practices',
        'Docker in DevOps Pipelines'
      ]
    },
    {
      slug: 'module-6',
      title: 'Module 6 — Cloud Basics for DevOps',
      desc: 'Introduction to Cloud Computing, AWS basics, security, and deploying apps to the cloud.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
      topics: [
        'Cloud Service Models (IaaS, PaaS, SaaS)',
        'Introduction to AWS',
        'Compute (EC2) & Storage (S3)',
        'Cloud Security Basics',
        'DevOps in Cloud',
        'Cost Awareness'
      ]
    },
    {
      slug: 'module-7',
      title: 'Module 7 — Infrastructure as Code & Automation',
      desc: 'Automate infrastructure provisioning with Terraform and integrate with CI pipelines.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Terraform_Logo.svg',
      topics: [
        'Infrastructure as Code (IaC) Concepts',
        'Terraform Overview & Architecture',
        'Terraform Workflow (Init, Plan, Apply)',
        'Terraform with Cloud',
        'Automation in DevOps',
        'Terraform Best Practices'
      ]
    },
    {
      slug: 'module-8',
      title: 'Module 8 — Beginner Monitoring & DevOps Workflow',
      desc: 'End-to-end DevOps workflow, monitoring importance, logs basics, and DevOps career roadmap.',
      bgImage: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png',
      topics: [
        'Why Monitoring Matters',
        'DevOps End-to-End Workflow',
        'Logs vs Monitoring Basics',
        'DevOps Best Practices',
        'DevOps Career Roadmap',
        'Mini Project: Code to Deploy'
      ]
    },
    {
      slug: 'module-9',
      title: 'Module 9 — Beginner Capstone Project',
      desc: 'Build a complete DevOps pipeline: GitHub, Maven/MSBuild, Jenkins, Docker, and Cloud deployment.',
      bgImage: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png',
      topics: [
        'Capstone Overview & Requirements',
        'Setup & Planning',
        'Implementation: Code & Build',
        'Implementation: Containerization',
        'Implementation: CI/CD Pipeline',
        'Implementation: Deployment',
        'Final Review & Submission'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-20 pb-16">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/student-portal')} className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50">
            Back to Portal
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              DevOps — Beginner
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-700">
              Learn CI/CD, Docker, Git, Linux, AWS, and automation. Build reliable delivery pipelines.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-800">Beginner level</span>
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-800">9 modules</span>
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-800">Hands-on labs</span>
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate('/course-learning-devops-beginner/devops-beginner/devops-fundamentals/intro-devops')}
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
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg"
              alt="DevOps introduction"
              className="w-full rounded-xl border border-gray-200 shadow-sm bg-white"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
          <h2 className="text-2xl font-semibold">What you'll learn</h2>
          <ul className="mt-6 grid md:grid-cols-2 gap-4 text-gray-700">
            <li className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm">Use Git & GitHub for collaborative version control.</li>
            <li className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm">Build and run containers with Docker & Compose.</li>
            <li className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm">Automate builds with Jenkins and MSBuild.</li>
            <li className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm">Deploy on AWS EC2 with proper networking & security.</li>
          </ul>
        </div>
      </section>

      {/* Syllabus */}
      <section id="syllabus" className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <h2 className="text-2xl font-semibold">Course syllabus</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {modules.map((m) => (
            <button
              key={m.title}
              onClick={() => navigate(`/devops-beginner/module/${m.slug}`)}
              className="text-left rounded-xl bg-white border border-gray-200 shadow-sm p-6 cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Open ${m.title}`}
            >
              <div className="flex items-start gap-4">
                <img src={m.bgImage} alt="" className="w-24 h-24 rounded-lg border border-gray-200 object-contain bg-white" />
                <div>
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <p className="mt-2 text-gray-700">{m.desc}</p>
                  <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
                    {m.topics.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Instructor */}
      <section className="bg-gray-50 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold">Meet your instructor</h2>
              <p className="mt-3 text-gray-700">Learn from a practitioner focused on clarity, best practices, and hands-on labs across real DevOps tooling.</p>
            </div>
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" alt="Docker" className="w-10 h-10" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg" alt="Jenkins" className="w-10 h-10" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Terraform_Logo.svg" alt="Terraform" className="w-10 h-10" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg" alt="Git" className="w-10 h-10" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}