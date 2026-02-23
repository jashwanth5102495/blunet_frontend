import { useNavigate } from 'react-router-dom';

export default function IntroductionPage() {
  const navigate = useNavigate();

  const modules = [
    {
      slug: 'intro-react',
      title: 'Intro React — Getting Started',
      desc: 'Set up Node.js and create your first React app. Understand why React, project structure, and the essential tooling (Vite/CRA).',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      topics: [
        'React introduction and why React',
        'Installing Node.js and verifying',
        'Create React App vs Vite',
        'React project structure overview'
      ]
    },
    {
      slug: 'module-1',
      title: 'Module 1 — Advanced HTML, CSS & Responsive Design',
      desc: 'Create fully responsive layouts using HTML5, CSS3, and Tailwind CSS. Master structure, layout, and modern design patterns with clean, scalable UI.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg',
      topics: [
        'Deep dive into semantic HTML5',
        'CSS Grid & Flexbox layouts',
        'Fetch API & JSON handling',
        'Building responsive UIs for mobile and desktop',
        'Tailwind CSS / Bootstrap for modern layouts',
        'Forms, validation, and client-side UX'
      ]
    },
    {
      slug: 'module-2',
      title: 'Module 2 — JavaScript & React.js Essentials',
      desc: 'Build dynamic frontend logic using JavaScript (ES6+) and React components. Work with state, user input, and interactive UI patterns.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      topics: [
        'Modern JavaScript (ES6+): let, const, arrow functions, modules',
        'DOM manipulation and events',
        'Fetch API & JSON handling',
        'Introduction to React.js',
        'Components, Props, and State',
        'React Hooks (useState, useEffect)'
      ]
    },
    {
      slug: 'module-3',
      title: 'Module 3 — Backend Integration with Django & MongoDB',
      desc: 'Connect your frontend to real backends. Design and consume REST APIs, handle tokens, and work with live data using Django and MongoDB.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Django_logo.svg',
      topics: [
        'Setting up Django as backend server',
        'Building REST APIs for frontend consumption',
        'Django Models and Views',
        'Connecting Django with MongoDB using Djongo / REST Framework',
        'Fetching and posting data from React to Django',
        'Authentication & environment variable management'
      ]
    },
    {
      slug: 'module-4',
      title: 'Module 4 — Full-Stack Application & Deployment',
      desc: 'Combine everything into a working full‑stack app. Implement authentication, environment configuration, and deploy your application securely.',
      bgImage: 'https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg',
      topics: [
        'Integrating frontend (React) with backend (Django API)',
        'Managing authentication tokens and sessions',
        'State management & protected routes',
        'Securing API calls',
        'Deploying full-stack apps (Vercel / Render / AWS)',
        'Final Capstone Project: E-commerce Web Application'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-20 pb-16">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/student-portal')}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
          >
            Back to Portal
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Frontend Development — Intermediate
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-200">
              Build modern, responsive UIs with React, integrate real backends, and ship production-ready frontends.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-800">
                Intermediate level
              </span>
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-800">
                5 modules
              </span>
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-800">
                Hands-on projects
              </span>
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate('/frontend-development-intermediate/module/intro-react')}
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
              src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
              alt="Frontend development introduction"
              className="w-full rounded-xl border border-gray-200 shadow-sm bg-white"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
          <h2 className="text-2xl font-semibold">What you'll learn</h2>
          <ul className="mt-6 grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
            <li className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-sm">
              Craft responsive layouts using HTML5, CSS3, and Tailwind CSS.
            </li>
            <li className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-sm">
              Build interactive UIs with modern JavaScript and React components.
            </li>
            <li className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-sm">
              Integrate backends using Django, REST APIs, and MongoDB.
            </li>
            <li className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-sm">
              Deliver end-to-end features and deploy production-ready applications.
            </li>
          </ul>
        </div>
      </section>

      <section id="syllabus" className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <h2 className="text-2xl font-semibold">Course syllabus</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {modules.map((m) => (
            <button
              key={m.title}
              onClick={() => navigate(`/frontend-development-intermediate/module/${m.slug}`)}
              className="text-left rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-sm p-6 cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Open ${m.title}`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={m.bgImage}
                  alt=""
                  className="w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700 object-contain bg-white"
                />
                <div>
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{m.desc}</p>
                  {m.topics && (
                    <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                      {m.topics.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold">Meet your instructor</h2>
              <p className="mt-3 text-gray-700 dark:text-gray-200">
                Learn from a practitioner who builds and ships real products, with a focus on clarity, best practices,
                and hands-on learning across modern frontend stacks.
              </p>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                alt="React"
                className="w-10 h-10"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg"
                alt="HTML5"
                className="w-10 h-10"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
                alt="Tailwind"
                className="w-10 h-10"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/75/Django_logo.svg"
                alt="Django"
                className="w-10 h-10"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
