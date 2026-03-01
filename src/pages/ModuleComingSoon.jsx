import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Module3Topic5Lesson, Module3Topic5Syntax, buildModule3Topic5LiveFiles } from './ModuleComingSoonpart1';
import { Module3Topic6Lesson, Module3Topic6Syntax, buildModule3Topic6LiveFiles, buildModule4Topic1LiveFiles } from './ModuleComingSoonpart2';
import { Module3Topic7Lesson, Module3Topic7Syntax, buildModule3Topic7LiveFiles, Module4Topic3Lesson, Module4Topic3Syntax, buildModule4Topic3LiveFiles, Module4Topic4Lesson, Module4Topic4Syntax, buildModule4Topic4LiveFiles, Module4Topic5Lesson, Module4Topic5Syntax, buildModule4Topic5LiveFiles, Module4Topic6Lesson, Module4Topic6Syntax, buildModule4Topic6LiveFiles } from './ModuleComingSoonpart3';
import { Module3Topic9Lesson, Module3Topic9Syntax, buildModule3Topic9LiveFiles } from './ModuleComingSoonpart4';

export default function ModuleComingSoon() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const titles = {
    'intro-react': 'Intro Module: React Overview & Setup',
    'module-1': 'Module 1: Advanced HTML, CSS & Responsive Design',
    'module-2': 'Module 2: JavaScript & React.js Essentials',
    'module-3': 'Module 3: Backend Integration with Django & MongoDB',
    'module-4': 'Module 4: Full-Stack Application & Deployment',
  };
  const title = titles[slug] || 'Module';

  const moduleOrder = ['intro-react', 'module-1', 'module-2', 'module-3', 'module-4'];
  const currentIndex = Math.max(0, moduleOrder.indexOf(slug));
  const nextIndex = Math.min(moduleOrder.length - 1, currentIndex + 1);
  const nextSlug = moduleOrder[nextIndex];
  const isLastModule = currentIndex === moduleOrder.length - 1;

  const initialTopic = useMemo(() => 0, [slug]);
  const [tab, setTab] = useState('lesson');
  const [currentTopic, setCurrentTopic] = useState(initialTopic);

  // Force light theme for modules pages
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    if (hadDark) root.classList.remove('dark');
    root.classList.add('force-light');
    return () => {
      root.classList.remove('force-light');
      if (hadDark) root.classList.add('dark');
    };
  }, [slug]);

  // Live Code state and helpers
  const buildLiveFiles = () => {
  // Intro React — Topic 5: Docs & Resources Live Examples
  if (slug === 'intro-react' && currentTopic === 4) {
    const files = {
      'index.html': `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Docs & Resources Live Demo</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; margin: 1rem; }
      .toolbar { display: flex; gap: .5rem; margin-bottom: 1rem; flex-wrap: wrap; }
      button { padding: .5rem .75rem; border: 1px solid #ccc; border-radius: 6px; background: #fff; cursor: pointer; }
      button.active { background: #111; color: #fff; border-color: #111; }
      .env { margin-left: auto; }
      .note { color: #555; font-size: .9rem; }
    </style>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div class="toolbar">
      <button id="ex1" class="active">Example 1: useState (Docs)</button>
      <button id="ex2">Example 2: useEffect Timer</button>
      <button id="ex3">Example 3: Passing Props</button>
      <button id="ex4">Example 4: import.meta.env (Vite)</button>
      <span class="env">
        <button id="envCra" class="active">Pretend: CRA</button>
        <button id="envVite">Pretend: Vite</button>
      </span>
    </div>
    <p class="note">Examples mirror patterns from the official docs. Env variables are simulated for clarity.</p>
    <div id="root"></div>
    <script type="text/babel" data-presets="env,react" src="/App.js"></script>
    <script>
      const buttons = ['ex1','ex2','ex3','ex4'];
      function setActive(id) {
        buttons.forEach(b => {
          const el = document.getElementById(b);
          if (!el) return;
          el.classList.toggle('active', b === id);
        });
      }
      window.__isVite = false; // default CRA
      function setEnv(vite) {
        window.__isVite = !!vite;
        document.getElementById('envCra').classList.toggle('active', !vite);
        document.getElementById('envVite').classList.toggle('active', !!vite);
        if (window.__currentEx) window.renderExample(window.__currentEx);
      }
      document.getElementById('ex1').addEventListener('click', () => { window.renderExample(1); setActive('ex1'); });
      document.getElementById('ex2').addEventListener('click', () => { window.renderExample(2); setActive('ex2'); });
      document.getElementById('ex3').addEventListener('click', () => { window.renderExample(3); setActive('ex3'); });
      document.getElementById('ex4').addEventListener('click', () => { window.renderExample(4); setActive('ex4'); });
      document.getElementById('envCra').addEventListener('click', () => setEnv(false));
      document.getElementById('envVite').addEventListener('click', () => setEnv(true));
    </script>
  </body>
</html>`,

      'App.js': `import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

function UseStateExample() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Clicks: {count}</button>
  );
}

function TimerExample() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  return <h2>Seconds: {seconds}</h2>;
}

function Greeting({ name }) {
  return <h3>Hello, {name}!</h3>;
}
function PassingPropsExample() {
  return (
    <>
      <Greeting name="React Learner" />
      <Greeting name="Developer" />
    </>
  );
}

function EnvironmentInfo() {
  const isVite = !!window.__isVite;
  return (
    <p>Mode: {isVite ? 'development (simulated Vite import.meta.env.MODE)' : 'CRA: import.meta.env not available by default'}</p>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

window.renderExample = (n) => {
  window.__currentEx = n;
  switch (n) {
    case 1: root.render(<UseStateExample />); break;
    case 2: root.render(<TimerExample />); break;
    case 3: root.render(<PassingPropsExample />); break;
    case 4: root.render(<EnvironmentInfo />); break;
    default: root.render(<UseStateExample />);
  }
};

window.renderExample(1);`
    };

    return files;
  }

  // Intro React — Topic 2: CRA vs Vite Live Examples
  if (slug === 'intro-react' && currentTopic === 2) {
    const files = {
      'index.html': `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CRA vs Vite Live Demo</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; margin: 1rem; }
      .toolbar { display: flex; gap: .5rem; margin-bottom: 1rem; flex-wrap: wrap; }
      button { padding: .5rem .75rem; border: 1px solid #ccc; border-radius: 6px; background: #fff; cursor: pointer; }
      button.active { background: #111; color: #fff; border-color: #111; }
      .env { margin-left: auto; }
      .note { color: #555; font-size: .9rem; }
    </style>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div class="toolbar">
      <button id="ex1" class="active">Example 1: Simple App</button>
      <button id="ex2">Example 2: Counter</button>
      <button id="ex3">Example 3: import.meta.env</button>
      <span class="env">
        <button id="envCra" class="active">Pretend: CRA</button>
        <button id="envVite">Pretend: Vite</button>
      </span>
    </div>
    <p class="note">Toggle the environment to see text change. This runner cannot truly detect Vite vs CRA, so we simulate it for clarity.</p>
    <div id="root"></div>
    <script type="text/babel" data-presets="env,react" src="/App.js"></script>
    <script>
      const buttons = ['ex1','ex2','ex3'];
      function setActive(id) {
        buttons.forEach(b => {
          const el = document.getElementById(b);
          if (!el) return;
          el.classList.toggle('active', b === id);
        });
      }
      window.__isVite = false; // default CRA
      function setEnv(vite) {
        window.__isVite = !!vite;
        document.getElementById('envCra').classList.toggle('active', !vite);
        document.getElementById('envVite').classList.toggle('active', !!vite);
        // re-render current example to reflect env label
        if (window.__currentEx) window.renderExample(window.__currentEx);
      }
      document.getElementById('ex1').addEventListener('click', () => { window.renderExample(1); setActive('ex1'); });
      document.getElementById('ex2').addEventListener('click', () => { window.renderExample(2); setActive('ex2'); });
      document.getElementById('ex3').addEventListener('click', () => { window.renderExample(3); setActive('ex3'); });
      document.getElementById('envCra').addEventListener('click', () => setEnv(false));
      document.getElementById('envVite').addEventListener('click', () => setEnv(true));
    </script>
  </body>
</html>`,

      'App.js': `import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function SimpleApp() {
  const isVite = !!window.__isVite;
  return (
    <div>
      <h1>Hello from React!</h1>
      <p>This project was created with {isVite ? 'Vite' : 'CRA'}</p>
    </div>
  );
}

function CounterApp() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h2>Counter Demo</h2>
      <button onClick={() => setCount(count + 1)}>You clicked {count} times</button>
    </div>
  );
}

function ImportMetaCheck() {
  const [log, setLog] = useState('');
  function check() {
    try {
      // Real import.meta.env only exists in Vite. We simulate output here.
      const isVite = !!window.__isVite;
      if (isVite) {
        setLog('import.meta.env → { VITE_APP_EXAMPLE: "true" } (simulated)');
        console.log('import.meta.env (simulated):', { VITE_APP_EXAMPLE: 'true' });
      } else {
        setLog('CRA: import.meta.env is not available by default');
        console.log('CRA: import.meta.env is not available by default');
      }
    } catch (e) {
      setLog('Environment check failed: ' + e.message);
    }
  }
  return (
    <div>
      <h2>Check if using Vite (Vite-specific)</h2>
      <button onClick={check}>Log import.meta.env</button>
      <pre style={{ marginTop: '.5rem' }}>{log}</pre>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

window.renderExample = (n) => {
  window.__currentEx = n;
  switch (n) {
    case 1: root.render(<SimpleApp />); break;
    case 2: root.render(<CounterApp />); break;
    case 3: root.render(<ImportMetaCheck />); break;
    default: root.render(<SimpleApp />);
  }
};

window.renderExample(1);`
    };

    return files;
  }

  // Intro React — Topic 3: Project Structure Live Examples
  if (slug === 'intro-react' && currentTopic === 3) {
    const files = {
      'index.html': `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React Project Structure Demo</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; margin: 1rem; }
      .toolbar { display: flex; gap: .5rem; margin-bottom: 1rem; flex-wrap: wrap; }
      button { padding: .5rem .75rem; border: 1px solid #ccc; border-radius: 6px; background: #fff; cursor: pointer; }
      button.active { background: #111; color: #fff; border-color: #111; }
      .card { border: 1px solid #ddd; border-radius: 8px; padding: .75rem; margin: .5rem 0; }
    </style>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div class="toolbar">
      <button id="ex1" class="active">Example 1: components/Card</button>
      <button id="ex2">Example 2: pages/HomePage</button>
      <button id="ex3">Example 3: hooks/useWelcome</button>
    </div>
    <div id="root"></div>
    <script type="text/babel" data-presets="env,react" src="/App.js"></script>
    <script>
      // simple toggle of active button styles
      const buttons = ['ex1','ex2','ex3'];
      function setActive(id) {
        buttons.forEach(b => {
          const el = document.getElementById(b);
          if (!el) return;
          el.classList.toggle('active', b === id);
        });
      }
      document.getElementById('ex1').addEventListener('click', () => { window.renderExample(1); setActive('ex1'); });
      document.getElementById('ex2').addEventListener('click', () => { window.renderExample(2); setActive('ex2'); });
      document.getElementById('ex3').addEventListener('click', () => { window.renderExample(3); setActive('ex3'); });
    </script>
  </body>
</html>`,

      // Keep components in components/ so the in-browser transformer can wire imports/exports
      'components/Card.js': `export default function Card(props) {
  return (
    <div className=\"card\">
      <h3>{props.title}</h3>
      <p>{props.text}</p>
    </div>
  );
}`,

      // App hosts three mini examples; HomePage and useWelcome are defined here for simplicity
      'App.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import Card from './components/Card';

function Example1() {
  return (
    <div>
      <h1>Project Structure Example</h1>
      <Card title=\"First Card\" text=\"This is a reusable component.\" />
      <Card title=\"Second Card\" text=\"Components help keep code clean.\" />
    </div>
  );
}

// In a real project, this would live in src/pages/HomePage.js
function HomePage() {
  return <h1>Welcome to the Home Page</h1>;
}
function Example2() { return <HomePage />; }

// In a real project, this would live in src/hooks/useWelcome.js
function useWelcome() {
  return 'Hello from Custom Hook!';
}
function Example3() {
  const message = useWelcome();
  return <h2>{message}</h2>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

window.renderExample = (n) => {
  switch (n) {
    case 1: root.render(<Example1 />); break;
    case 2: root.render(<Example2 />); break;
    case 3: root.render(<Example3 />); break;
    default: root.render(<Example1 />);
  }
};

// initial render
window.renderExample(1);`
    };

    return files;
  }

    // Early return: Module 4 Topic 3 (State management & protected routes)
    if (slug === 'module-4' && currentTopic === 2) {
      return buildModule4Topic3LiveFiles();
    }
    // Early return: Module 4 Topic 4 (Securing API calls)
    if (slug === 'module-4' && currentTopic === 3) {
      return buildModule4Topic4LiveFiles();
    }
    // Early return: Module 4 Topic 5 (Deployment)
    if (slug === 'module-4' && currentTopic === 4) {
      return buildModule4Topic5LiveFiles();
    }
    // Early return: Module 4 Topic 6 (Final Capstone Project)
    if (slug === 'module-4' && currentTopic === 5) {
      return buildModule4Topic6LiveFiles();
    }
    // Module 1 samples
    if (slug === 'module-1') {
      if (currentTopic === 1) {
        return {
          'index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CSS Grid & Flexbox Layouts</title>
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <header>Header</header>
  <nav class="flex-nav">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </nav>

  <main class="grid-layout">
    <aside>Sidebar</aside>
    <section>Main Content</section>
  </main>

  <footer>Footer</footer>
  <script src="js/main.js" defer></script>
</body>
</html>
`,
          'css/styles.css': `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: Arial, sans-serif;
  background: #f8f9fa;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

header, nav, main, footer, section, aside {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1rem;
  width: 90%;
  background: white;
}

/* Grid layout for the page content */
.grid-layout {
  display: grid;
  grid-template-areas:
    "aside section";
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
}

/* Flexbox navigation */
.flex-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  background: #e3f2fd;
}
.flex-nav a {
  text-decoration: none;
  background: #2196f3;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  transition: 0.2s;
}
.flex-nav a:hover {
  background: #1565c0;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .grid-layout {
    grid-template-areas:
      "section"
      "aside";
    grid-template-columns: 1fr;
  }
}
`,
          'js/main.js': `document.addEventListener("DOMContentLoaded", () => {
  console.log("CSS Grid & Flexbox Layout Demo Loaded");
});
`,
        };
      }
      if (currentTopic === 0) {
        return {
          'index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Semantic HTML5 Demo</title>
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <header>Header</header>

  <nav>Navigation</nav>

  <main>
    <article>
      <h1>Article Title</h1>
      <section>
        <p>This is a content section inside the article.</p>
      </section>
    </article>

    <aside>Sidebar / Related Links</aside>
  </main>

  <footer>Footer Content © 2025</footer>

  <script src="js/main.js" defer></script>
</body>
</html>
`,
          'css/styles.css': `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: Arial, sans-serif;
  background-color: #fafafa;
  color: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

header, nav, main, footer, article, aside, section {
  border: 1px solid #ddd;
  padding: 1rem;
  width: 90%;
  border-radius: 6px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

header { background-color: #f5f5f5; font-weight: bold; }
nav { background-color: #e9ecef; }
article { background-color: #fff3cd; }
aside { background-color: #e2f0d9; }
footer { background-color: #f8d7da; }

main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

@media (max-width: 720px) {
  main {
    grid-template-columns: 1fr;
  }
}
`,
          'js/main.js': `// Simple script to confirm the page is interactive
document.addEventListener("DOMContentLoaded", () => {
  console.log("Semantic HTML5 Demo Loaded");
});
`,
        };
      }
      if (currentTopic === 1) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOM Manipulation Demo</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1 id="heading">Hello, DOM!</h1>
  <button id="btn">Change Color</button>
  <script src="js/app.js"></script>
</body>
</html>
`,
          'css/styles.css': `body {
  text-align: center;
  font-family: Arial, sans-serif;
  margin-top: 100px;
  transition: background-color 0.5s ease;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 6px;
}

button:hover {
  background-color: #0056b3;
}`,
          'js/app.js': `const heading = document.getElementById("heading");
const button = document.getElementById("btn");

button.addEventListener("click", () => {
  const colors = ["#FF6347", "#3CB371", "#FFD700", "#1E90FF"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  document.body.style.backgroundColor = randomColor;
  heading.textContent = \`Background: \${randomColor}\`;
});`,
        };
      }
      if (currentTopic === 2) {
        return {
          'index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fetch API & JSON Handling</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1>Fetch API Demo</h1>
  <button id="load">Load Users</button>
  <ul id="userList"></ul>
  <script src="js/main.js"></script>
</body>
</html>
`,
          'css/styles.css': `body { font-family: sans-serif; background: #f8f9fa; text-align: center; padding: 20px; }
button { padding: 10px 20px; border: none; border-radius: 6px; background: #007bff; color: white; cursor: pointer; }
button:hover { background: #0056b3; }
ul { list-style: none; margin-top: 20px; }
li { background: white; margin: 8px auto; padding: 10px; width: 60%; border-radius: 5px; }`,
          'js/main.js': 'document.getElementById("load").addEventListener("click", async () => {\n  const userList = document.getElementById("userList");\n  userList.innerHTML = "<li>Loading...</li>";\n\n  try {\n    const response = await fetch("https://jsonplaceholder.typicode.com/users");\n    const users = await response.json();\n    userList.innerHTML = users\n      .map(u => `<li>${u.name} — ${u.email}</li>`)\n      .join("");\n  } catch (err) {\n    userList.innerHTML = "<li>Error loading data.</li>";\n  }\n});',
        };
      }
      if (currentTopic === 3) {
        return {
          'index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Responsive UI Design</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header><h1>My Responsive Website</h1></header>

  <section class="grid">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
    <div class="card">Card 4</div>
  </section>

  <footer>© 2025 Responsive UI Demo</footer>
</body>
</html>
`,
          'css/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  background: #f8f9fa;
  text-align: center;
}
header, footer {
  background: #007bff;
  color: white;
  padding: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
@media (max-width: 768px) {
  header, footer { font-size: 0.9rem; }
  .card { padding: 15px; }
}
@media (max-width: 480px) {
  .card { font-size: 0.8rem; }
}
`,
          'js/main.js': 'console.log("Responsive UI Design Demo Ready");',
        };
      }
      if (currentTopic === 3) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Introduction</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
</head>
<body>
  <div id="root"></div>
  <script src="js/app.js"></script>
</body>
</html>`,
          'js/app.js': `const root = ReactDOM.createRoot(document.getElementById('root'));

function Welcome(props) {
  return React.createElement('h1', null, 'Hello, ', props.name, '! 👋');
}

function App() {
  return React.createElement('div', null,
    React.createElement(Welcome, { name: 'Student' }),
    React.createElement(Welcome, { name: 'Developer' }),
    React.createElement(Welcome, { name: 'Learner' })
  );
}

root.render(React.createElement(App));`,
        };
      }
      if (currentTopic === 4) {
        return {
          'index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tailwind & Bootstrap Demo</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-4 bg-gray-50">
  <h1 class="text-2xl font-bold mb-4 text-center">Tailwind + Bootstrap Demo</h1>

  <div class="grid grid-cols-2 gap-4 mb-6">
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Tailwind Button</button>
    <button class="btn btn-success">Bootstrap Button</button>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-md-4 bg-light p-3 border">Bootstrap Grid</div>
      <div class="col-md-4 bg-light p-3 border">Bootstrap Grid</div>
      <div class="col-md-4 bg-light p-3 border">Bootstrap Grid</div>
    </div>
  </div>
</body>
</html>`,
        };
      }
      if (currentTopic === 5) {
        return {
          'index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Form Validation</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1>Signup Form</h1>
  <form id="signupForm">
    <label>Name:</label>
    <input type="text" id="name" required minlength="3" placeholder="Enter name">
    <label>Email:</label>
    <input type="email" id="email" required placeholder="Enter email">
    <button type="submit">Submit</button>
  </form>
  <script src="js/main.js" defer></script>
</body>
</html>`,
          'css/styles.css': `body { font-family: Arial; background: #f5f5f5; text-align: center; padding: 2rem; }
form { display: inline-block; background: white; padding: 2rem; border-radius: 8px; }
input { display: block; margin: 10px auto; padding: 8px; border-radius: 5px; border: 1px solid #ccc; width: 80%; }
button { padding: 8px 16px; border: none; background: #007bff; color: white; border-radius: 5px; cursor: pointer; }
input:valid { border: 2px solid green; }
input:invalid { border: 2px solid red; }`,
          'js/main.js': `const form = document.getElementById("signupForm");

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (name.trim().length < 3) {
    alert("Name must be at least 3 characters!");
    return;
  }
  if (!email.includes("@")) {
    alert("Invalid email address!");
    return;
  }
  alert(\`Welcome, \${name}!\`);
});`,
        };
      }
      if (currentTopic === 6) {
        return {
          'index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Module 1 Summary</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header><h1>Module 1 Overview</h1></header>
  <main>
    <section>
      <h2>What You Learned</h2>
      <ul>
        <li>Semantic HTML & Accessibility</li>
        <li>Advanced CSS Layouts</li>
        <li>Fetch API & Data Handling</li>
        <li>Responsive Design Principles</li>
        <li>Framework-based Styling</li>
        <li>Form Validation & UX</li>
      </ul>
    </section>
  </main>
  <footer>© 2025 Frontend Developer Intermediate Course</footer>
</body>
</html>`,
          'css/styles.css': `body { font-family: sans-serif; background: #f9f9f9; text-align: center; }
header, footer { background: #007bff; color: white; padding: 1rem; }
main { padding: 2rem; }
ul { list-style: none; padding: 0; }
li { background: white; margin: 10px auto; padding: 10px; width: 60%; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }`,
        };
      }
      if (currentTopic === 1) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Topic 2 — Building REST APIs</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <header style="padding:16px;background:#0f172a;color:#fff;text-align:center">🧩 Topic 2: Building REST APIs for Frontend Consumption</header>
  <main style="padding:16px">
    <div id="root"></div>
  </main>
  <footer style="padding:12px;background:#0f172a;color:#fff;text-align:center">This demo fetches /api/products/ from Django (with fallback)</footer>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'css/styles.css': `body{font-family:system-ui,sans-serif;background:#f9fafb;color:#111} .box{border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:#fff} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px} .card{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff}`,
          'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));
function App(){
  const [products, setProducts] = React.useState([]);
  const [error, setError] = React.useState('');
  const API_URL = 'http://127.0.0.1:8000/api/products/';

  React.useEffect(() => {
    async function load(){
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('HTTP '+res.status);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : (data.results || []));
      } catch (err) {
        setError('Could not reach Django API. Start it with: cd backend && python manage.py runserver');
        setProducts([
          { id: 1, name: 'iPhone 16', price: '799.99', description: 'Latest model with AI features' },
          { id: 2, name: 'Pixel 9', price: '699.99', description: 'Clean Android experience' }
        ]);
      }
    }
    load();
  }, []);

  return (
    <div style={{padding:'16px'}}>
      <h2 style={{margin:'0 0 12px'}}>Products API Response</h2>
      {error && <p style={{color:'#b91c1c'}}>{error}</p>}
      <div className="grid">
        {products.map(function(p){
          return <div key={p.id || p.name} className="card"><strong>{p.name}</strong><div>{p.price}</div><p>{p.description}</p></div>;
        })}
      </div>
      <div className="box" style={{marginTop:'12px'}}>
        <strong>File Structure</strong>
        <pre style={{whiteSpace:'pre-wrap'}}>{'/backend\n│\n├── backend/\n│   └── urls.py\n├── products/\n│   ├── models.py\n│   ├── serializers.py\n│   ├── views.py\n│   └── admin.py\n└── manage.py'}</pre>
      </div>
    </div>
  );
}

root.render(<App />);`,
          'backend/products/models.py': `from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name`,
          'backend/products/serializers.py': `from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`,
          'backend/products/views.py': `from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)`,
          'backend/urls.py': `from django.contrib import admin
from django.urls import path
from products.views import get_products

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', get_products),
]`,
        };
      }
      if (currentTopic === 7) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Assisted Development Demo</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <h1>AI-Assisted Web Development</h1>
    <nav>
      <a href="#">Home</a>
      <a href="#">Modules</a>
      <a href="#">Contact</a>
    </nav>
  </header>

  <main>
    <section class="intro">
      <h2>Using ChatGPT and Claude for Module 1</h2>
      <p>This layout is generated and refined using AI prompts to speed up development.</p>
    </section>

    <section class="grid-demo">
      <div class="card">HTML5 Semantic Layout</div>
      <div class="card">Flexbox Design</div>
      <div class="card">Responsive UI</div>
    </section>
  </main>

  <footer>
    <p>Built with ♥ and AI Assistance</p>
  </footer>
  <script src="js/main.js"></script>
</body>
</html>`,
          'css/styles.css': `body {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  background-color: #f4f4f9;
}

header {
  background-color: #222;
  color: white;
  padding: 1.5rem;
  text-align: center;
}

nav a {
  color: #fff;
  margin: 0 10px;
  text-decoration: none;
}

.grid-demo {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 2rem;
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin: 10px;
  width: 250px;
  text-align: center;
}

footer {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
}`,
          'js/main.js': `document.addEventListener("DOMContentLoaded", () => {
  console.log("AI-assisted development demo running...");

  const cards = document.querySelectorAll(".card");
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      alert("You clicked on " + card.textContent + "!");
    });
  });
});`,
        };
      }
    }

    // Module 2 samples
    if (slug === 'module-2') {
      if (currentTopic === 0) {
        return {
          'index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Modern JavaScript (ES6+)</title>
</head>
<body>
  <h1>Modern JavaScript Demo</h1>
  <p>Open your console to view the output.</p>

  <script type="module" src="js/app.js"></script>
</body>
</html>
`,
          'js/math.js': `// math.js — reusable module
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => (b !== 0 ? a / b : "Error: Divide by 0");`,
          'js/app.js': `// app.js — main module
import { add, subtract, multiply, divide } from './math.js';

const student = "Ava";
const greet = (name) => \`Welcome, \${name}!\`;

console.log(greet(student));
console.log(\`2 + 3 = \${add(2, 3)}\`);
console.log(\`10 - 4 = \${subtract(10, 4)}\`);
console.log(\`6 × 5 = \${multiply(6, 5)}\`);
console.log(\`10 ÷ 2 = \${divide(10, 2)}\`);`,
        };
      }
      if (currentTopic === 1) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOM Manipulation Demo</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1 id="heading">Hello, DOM!</h1>
  <button id="btn">Change Color</button>
  <script src="js/app.js"></script>
</body>
</html>
`,
          'css/styles.css': `body {
  text-align: center;
  font-family: Arial, sans-serif;
  margin-top: 100px;
  transition: background-color 0.5s ease;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 6px;
}

button:hover {
  background-color: #0056b3;
}`,
          'js/app.js': `const heading = document.getElementById("heading");
const button = document.getElementById("btn");

button.addEventListener("click", () => {
  const colors = ["#FF6347", "#3CB371", "#FFD700", "#1E90FF"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  document.body.style.backgroundColor = randomColor;
  heading.textContent = \`Background: \${randomColor}\`;
});`,
        };
      }
      if (currentTopic === 2) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fetch API & JSON Demo</title>
</head>
<body>
  <h1>Users List</h1>
  <ul id="user-list"></ul>
  <script src="js/app.js"></script>
</body>
</html>`,
          'js/app.js': `const userList = document.getElementById("user-list");

fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => {
    if (!response.ok) throw new Error('Network error: ' + response.status);
    return response.json();
  })
  .then((users) => {
    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user.name + " — " + user.email;
      userList.appendChild(li);
    });
  })
  .catch((error) => console.error("Error fetching users:", error));`,
        };
      }
      if (currentTopic === 3) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Introduction</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));

function Welcome(props) {
  return <h1>Hello, {props.name}! 👋</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Student" />
      <Welcome name="Developer" />
      <Welcome name="Learner" />
    </div>
  );
}

root.render(<App />);`,
        };
      }
      if (currentTopic === 4) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Introduction</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));

function Welcome(props) {
  return <h1>Hello, {props.name}! 👋</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Student" />
      <Welcome name="Developer" />
      <Welcome name="Learner" />
    </div>
  );
}

root.render(<App />);`,
        };
      }
      if (currentTopic === 5) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Hooks — useState & useEffect</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'components/Counter.js': `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Clicked \${count} times\`;
    console.log('Effect: Count updated to', count);
  }, [count]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>React useState & useEffect Example</h2>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
    </div>
  );
}

export default Counter;`,
          'App.js': `import React from 'react';
import Counter from './components/Counter';

function App() {
  return (
    <div>
      <Counter />
    </div>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
        };
      }
      if (currentTopic === 6) {
        return {
          'index.html': '<div id="app"><h1>🛍 Products</h1><div id="grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px"></div></div>',
          'css/styles.css': 'body{font-family:system-ui,sans-serif;padding:16px} .card{border:1px solid #ccc;padding:10px;border-radius:8px} img{max-width:100px}',
          'js/main.js': `fetch('https://fakestoreapi.com/products?limit=6').then(r=>r.json()).then(items=>{const grid=document.getElementById('grid');items.forEach(p=>{const card=document.createElement('div');card.className='card';card.innerHTML='<img src="'+p.image+'" /><h4>'+p.title+'</h4><p>'+p.price+'</p>';grid.appendChild(card);});});`,
        };
      }
      if (currentTopic === 7) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module 2 Overview — JavaScript & React.js Essentials</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body style="font-family:system-ui,sans-serif;padding:24px">
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'App.js': `function App() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🚀 JavaScript & React.js Essentials</h1>
      <p>Welcome to Module 2 of your Frontend Developer journey!</p>
      <p>You’ll learn how to make your web pages interactive, dynamic, and alive.</p>
    </div>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
        };
      }
      if (currentTopic === 8) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI-Generated Product Listing</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body style="font-family:system-ui,sans-serif;padding:24px">
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'components/ProductGrid.js': `import React, { useEffect, useState } from 'react';

function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {products.map(product => (
        <div key={product.id} className="p-4 border rounded-lg shadow bg-white">
          <img src={product.image} alt={product.title} className="h-40 mx-auto" />
          <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
          <p className="text-gray-600">{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;`,
          'App.js': `import React from 'react';
import ProductGrid from './components/ProductGrid';

function App() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold mt-6">AI-Generated Product Listing</h1>
      <ProductGrid />
    </div>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
        };
      }
    }

    // Intro React live files — Topic 1 (React introduction & why React)
    if (slug === 'intro-react' && currentTopic === 0) {
      return {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Intro React — Live Demo</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body style="font-family:system-ui,sans-serif;padding:24px">
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
        'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));

function SimpleComponent() {
  return (
    <div>
      <h1>Welcome to React!</h1>
      <p>This is your first React component.</p>
    </div>
  );
}

function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ marginTop: '16px' }}>
      <h2>React Counter</h2>
      <button onClick={() => setCount(count + 1)}>
        Clicked: {count} times
      </button>
    </div>
  );
}

function Card(props) {
  return <h3>Hi, I am {props.name}!</h3>;
}

function App() {
  return (
    <div>
      <SimpleComponent />
      <Counter />
      <div style={{ marginTop: '16px' }}>
        <Card name="React" />
        <Card name="Reusable Component" />
        <Card name="Amazing UI Library" />
      </div>
    </div>
  );
}

root.render(<App />);`
      };
    }

    // Intro React live files — Topic 1 (Installing Node.js and verifying)
    if (slug === 'intro-react' && currentTopic === 1) {
      return {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node.js Installation — Live Demos</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; }
    button { margin-right: 8px; margin-bottom: 12px; }
    pre { background: #f3f4f6; padding: 12px; border-radius: 6px; }
  </style>
</head>
<body>
  <h1>Node.js Installation — Try It Yourself</h1>
  <p>These demos simulate files you’d run with <code>node</code> in your terminal.</p>
  <div>
    <button id="run-hello">Run hello.js</button>
    <button id="run-sum">Run sum.js</button>
    <button id="run-cow">Run cowsay.js (browser mimic)</button>
  </div>
  <pre id="output">Output will appear here...</pre>
  <script type="module">
    import { runHello } from './hello.js';
    import { runSum } from './sum.js';
    import { cowsay } from './cowsay.js';

    const out = document.getElementById('output');
    const log = (text) => { out.textContent = String(text); };

    document.getElementById('run-hello').addEventListener('click', () => {
      log(runHello());
    });
    document.getElementById('run-sum').addEventListener('click', () => {
      log(runSum());
    });
    document.getElementById('run-cow').addEventListener('click', () => {
      log(cowsay('Node.js works!', { e: 'OO', T: 'U ' }));
    });
  </script>
</body>
</html>`,
        'hello.js': `export function runHello() {
  return 'Node.js is successfully installed!';
}`,
        'sum.js': `export function runSum() {
  const a = 10;
  const b = 20;
  return 'Sum is: ' + (a + b);
}`,
        'cowsay.js': `export function cowsay(text, opts = {}) {
  const eyes = opts.e || 'OO';
  const tongue = opts.T || '  ';
  const bubble = '  ' + text + '\n' + '   ---------';
  const cow = '\n        \\   ^__^\n         \\  (' + eyes + ')\\_______\n            (__)\\       )\\/\\\n             ' + tongue + '  |----w |\n                 ||     ||';
  return bubble + cow;
}`
      };
    }

    // Module 3 samples
    if (slug === 'module-3') {
      if (currentTopic === 0) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Django Backend Setup — Live Overview</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <header style="padding:16px;background:#0f172a;color:#fff;text-align:center">🧩 Topic 1: Setting up Django as Backend Server</header>
  <main style="padding:16px">
    <div id="root"></div>
  </main>
  <footer style="padding:12px;background:#0f172a;color:#fff;text-align:center">This demo attempts to fetch from Django at 127.0.0.1:8000</footer>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'css/styles.css': `body{font-family:system-ui,sans-serif;background:#f9fafb;color:#111} .box{border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:#fff} code,pre{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}`,
          'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));

function App(){
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function check(){
      try {
        const res = await fetch('http://127.0.0.1:8000/', { mode: 'cors' });
        const text = await res.text();
        setMessage(text.slice(0, 200));
      } catch (e){
        setError('Could not reach Django. Start it with: cd backend && python manage.py runserver');
      }
    }
    check();
  }, []);

  return (
    <div style={{padding:'16px'}}>
      <h2 style={{margin:'0 0 12px'}}>Django Project + Products App</h2>
      <div className="box" style={{marginBottom:'12px'}}>
        <strong>Directory Structure</strong>
        <pre style={{whiteSpace:'pre-wrap'}}>{\`/backend
│
├── manage.py
├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
└── products/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── views.py
    └── tests.py\`}</pre>
      </div>
      <div className="box" style={{marginBottom:'12px'}}>
        <strong>Sample View (products/views.py)</strong>
        <pre style={{whiteSpace:'pre-wrap'}}>{\`from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello from Django Backend!")\`}</pre>
      </div>
      <div className="box" style={{marginBottom:'12px'}}>
        <strong>URLs (backend/urls.py)</strong>
        <pre style={{whiteSpace:'pre-wrap'}}>{\`from django.contrib import admin
from django.urls import path
from products.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
]\`}</pre>
      </div>
      <div className="box">
        <strong>Fetch Result</strong>
        <div style={{marginTop:'8px'}}>
          {message && <div dangerouslySetInnerHTML={{__html: message}} />}
          {error && <p style={{color:'#b91c1c'}}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

root.render(<App />);`,
          // Illustrative backend file stubs
          'backend/manage.py': `# Django manage.py placeholder for live demo`,
          'backend/backend/settings.py': `# settings.py placeholder`,
          'backend/backend/urls.py': `from django.contrib import admin\nfrom django.urls import path\nfrom products.views import home\n\nurlpatterns = [\n    path('admin/', admin.site.urls),\n    path('', home),\n]`,
          'backend/backend/asgi.py': `# asgi.py placeholder`,
          'backend/backend/wsgi.py': `# wsgi.py placeholder`,
          'backend/products/__init__.py': `# products app init`,
          'backend/products/admin.py': `# admin registrations`,
          'backend/products/apps.py': `from django.apps import AppConfig\n\nclass ProductsConfig(AppConfig):\n    default_auto_field = 'django.db.models.BigAutoField'\n    name = 'products'`,
          'backend/products/models.py': `# models placeholder`,
          'backend/products/views.py': `from django.http import HttpResponse\n\ndef home(request):\n    return HttpResponse('Hello from Django Backend!')`,
          'backend/products/tests.py': `# tests placeholder`,
        };
      }
      if (currentTopic === 7) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React + Django + MongoDB Integration Demo</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <header style="padding:16px;background:#111;color:#fff;text-align:center">Backend Integration with Django & MongoDB</header>
  <main style="padding:16px">
    <div id="root"></div>
  </main>
  <footer style="padding:12px;background:#111;color:#fff;text-align:center">Live demo fetches from Django API (with fallback)</footer>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'css/styles.css': `body{font-family:system-ui,sans-serif;background:#f5f7fb;color:#222} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px} .card{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.05)} .img{width:120px;height:120px;object-fit:contain;margin:auto;display:block}`,
          'components/ProductCard.js': `function ProductCard({ item }){\n  return (\n    <div className="card">\n      <img className="img" src={item.image || item.image_url || ''} alt={item.name || item.title || 'Product'} />\n      <h4>{item.name || item.title}</h4>\n      <p>{item.price}</p>\n    </div>\n  );\n}\nwindow.ProductCard = ProductCard;`,
          'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));\n\nfunction App(){\n  const [products, setProducts] = React.useState([]);\n  const API_URL = 'http://localhost:8000/api/products/';\n  const FALLBACK_URL = 'https://fakestoreapi.com/products?limit=8';\n\n  React.useEffect(() => {\n    async function load(){\n      try {\n        const res = await fetch(API_URL);\n        if (!res.ok) throw new Error('HTTP '+res.status);\n        const data = await res.json();\n        setProducts(Array.isArray(data) ? data : (data.results || []));\n      } catch (err) {\n        console.warn('Fallback to FakeStore API:', err.message);\n        try {\n          const res = await fetch(FALLBACK_URL);\n          const data = await res.json();\n          setProducts(Array.isArray(data) ? data : []);\n        } catch(e){ console.error(e); }\n      }\n    }\n    load();\n  }, []);\n\n  const ProductCard = window.ProductCard;\n  return (\n    <div style={{padding:'16px'}}>\n      <h2 style={{margin:'0 0 16px'}}>React → Django REST → MongoDB</h2>\n      <div className="grid">\n        {products.map(function(item){\n          return <ProductCard key={item.id || item._id || item.name} item={item}/>;\n        })}\n      </div>\n    </div>\n  );\n}\n\nroot.render(<App />);`,
          'backend/settings.py': `DATABASES = {\n  'default': {\n    'ENGINE': 'djongo',\n    'NAME': 'productdb',\n  }\n}\nINSTALLED_APPS = [\n  'rest_framework',\n  'products',\n]`,
          'backend/products/models.py': `from djongo import models\n\nclass Product(models.Model):\n    name = models.CharField(max_length=100)\n    price = models.FloatField()\n    description = models.TextField()\n    image = models.URLField()\n\n    def __str__(self):\n        return self.name`,
          'backend/products/serializers.py': `from rest_framework import serializers\nfrom .models import Product\n\nclass ProductSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Product\n        fields = '__all__'`,
          'backend/products/views.py': `from rest_framework import viewsets\nfrom .models import Product\nfrom .serializers import ProductSerializer\n\nclass ProductViewSet(viewsets.ModelViewSet):\n    queryset = Product.objects.all()\n    serializer_class = ProductSerializer`,
          'backend/urls.py': `from django.contrib import admin\nfrom django.urls import path, include\nfrom rest_framework import routers\nfrom products.views import ProductViewSet\n\nrouter = routers.DefaultRouter()\nrouter.register(r'products', ProductViewSet)\n\nurlpatterns = [\n  path('admin/', admin.site.urls),\n  path('api/', include(router.urls)),\n]`,
        };
      }
    }

    // Module 3 samples
    if (slug === 'module-3') {
      if (currentTopic === 1) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Topic 2 — Building REST APIs</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <header style="padding:16px;background:#0f172a;color:#fff;text-align:center">🧩 Topic 2: Building REST APIs for Frontend Consumption</header>
  <main style="padding:16px">
    <div id="root"></div>
  </main>
  <footer style="padding:12px;background:#0f172a;color:#fff;text-align:center">This demo fetches /api/products/ from Django (with fallback)</footer>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'css/styles.css': `body{font-family:system-ui,sans-serif;background:#f9fafb;color:#111} .box{border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:#fff} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px} .card{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff}`,
          'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));
function App(){
  const [products, setProducts] = React.useState([]);
  const [error, setError] = React.useState('');
  const API_URL = 'http://127.0.0.1:8000/api/products/';

  React.useEffect(() => {
    async function load(){
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('HTTP '+res.status);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : (data.results || []));
      } catch (err) {
        setError('Could not reach Django API. Start it with: cd backend && python manage.py runserver');
        setProducts([
          { id: 1, name: 'iPhone 16', price: '799.99', description: 'Latest model with AI features' },
          { id: 2, name: 'Pixel 9', price: '699.99', description: 'Clean Android experience' }
        ]);
      }
    }
    load();
  }, []);

  return (
    <div style={{padding:'16px'}}>
      <h2 style={{margin:'0 0 12px'}}>Products API Response</h2>
      {error && <p style={{color:'#b91c1c'}}>{error}</p>}
      <div className="grid">
        {products.map(function(p){
          return <div key={p.id || p.name} className="card"><strong>{p.name}</strong><div>{p.price}</div><p>{p.description}</p></div>;
        })}
      </div>
      <div className="box" style={{marginTop:'12px'}}>
        <strong>File Structure</strong>
        <pre style={{whiteSpace:'pre-wrap'}}>{'/backend\n\nbackend/\n  urls.py\nproducts/\n  models.py\n  serializers.py\n  views.py\nmanage.py'}</pre>
      </div>
    </div>
  );
}

root.render(<App />);`,
          'backend/products/models.py': `from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name`,
          'backend/products/serializers.py': `from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`,
          'backend/products/views.py': `from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)`,
          'backend/urls.py': `from django.contrib import admin
from django.urls import path
from products.views import get_products

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', get_products),
]`,
        };
      }
      if (currentTopic === 2) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Topic 3 — Django Models and Views</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <header style="padding:16px;background:#0f172a;color:#fff;text-align:center">🧩 Topic 3: Django Models and Views</header>
  <main style="padding:16px">
    <div id="root"></div>
  </main>
  <footer style="padding:12px;background:#0f172a;color:#fff;text-align:center">FBV renders HTML via templates — see products.html</footer>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'css/styles.css': `body{font-family:system-ui,sans-serif;background:#f9fafb;color:#111} .card{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff;margin:8px 0} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}`,
          'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));
function App(){
  const sample = [
    { name: 'MacBook Air', price: 1199.99 },
    { name: 'Pixel 9', price: 699.99 },
    { name: 'iPhone 16', price: 799.99 }
  ];
  return (
    <div style={{padding:'16px'}}>
      <h2 style={{margin:'0 0 12px'}}>Server-side render with Django template</h2>
      <p style={{margin:'0 0 12px'}}>Start Django then visit <code>http://127.0.0.1:8000/products/</code>. Below is a client-side preview of the same output:</p>
      <div className="grid">
        {sample.map((p, i) => (
          <div key={i} className="card"><strong>{p.name}</strong><div>₹{p.price}</div></div>
        ))}
      </div>
      <div className="card" style={{marginTop:'12px'}}>
        <strong>File Structure</strong>
        <pre style={{whiteSpace:'pre-wrap'}}>{'/backend\n\nbackend/\n  urls.py\nproducts/\n  models.py\n  views.py\n  templates/\n    products.html\nmanage.py'}</pre>
      </div>
    </div>
  );
}
root.render(<App />);`,
          'backend/urls.py': `from django.urls import path\nfrom products.views import product_list\n\nurlpatterns = [\n    path('products/', product_list),\n]`,
          'products/models.py': `from django.db import models\n\nclass Product(models.Model):\n    name = models.CharField(max_length=100)\n    category = models.CharField(max_length=50)\n    price = models.DecimalField(max_digits=8, decimal_places=2)\n`,
          'products/views.py': `from django.shortcuts import render\nfrom .models import Product\n\n\ndef product_list(request):\n    products = Product.objects.all()\n    return render(request, 'products.html', {'products': products})\n`,
          'products/templates/products.html': `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Product List</title>\n</head>\n<body>\n  <h1>Available Products</h1>\n  <ul>\n    {% for product in products %}\n      <li>{{ product.name }} - ₹{{ product.price }}</li>\n    {% endfor %}\n  </ul>\n</body>\n</html>\n`,
          'manage.py': `# Django manage helper (placeholder in live preview)`,
        };
      }
      if (currentTopic === 3) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Topic 4 — Django + MongoDB (Djongo) + DRF</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <header style="padding:16px;background:#0f172a;color:#fff;text-align:center">🧩 Topic 4: Connect Django with MongoDB using Djongo / DRF</header>
  <main style="padding:16px">
    <div id="root"></div>
  </main>
  <footer style="padding:12px;background:#0f172a;color:#fff;text-align:center">This demo fetches /api/products/ from Django (with fallback)</footer>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'css/styles.css': `body{font-family:system-ui,sans-serif;background:#f9fafb;color:#111} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px} .card{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff} .img{width:120px;height:120px;object-fit:contain;margin:auto;display:block}`,
          'components/ProductCard.js': `function ProductCard({ item }){\n  return (\n    <div className="card">\n      <img className="img" src={item.image || item.image_url || ''} alt={item.name || item.title || 'Product'} />\n      <h4>{item.name || item.title}</h4>\n      <p>{item.price}</p>\n    </div>\n  );\n}\nwindow.ProductCard = ProductCard;`,
          'App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));\n\nfunction App(){\n  const [products, setProducts] = React.useState([]);\n  const [error, setError] = React.useState('');\n  const API_URL = 'http://127.0.0.1:8000/api/products/';\n  const FALLBACK_URL = 'https://fakestoreapi.com/products?limit=6';\n\n  React.useEffect(() => {\n    async function load(){\n      try {\n        const res = await fetch(API_URL);\n        if (!res.ok) throw new Error('HTTP '+res.status);\n        const data = await res.json();\n        setProducts(Array.isArray(data) ? data : (data.results || []));\n      } catch (err) {\n        setError('Could not reach Django API. Start it with: cd backend && python manage.py runserver');\n        try {\n          const res = await fetch(FALLBACK_URL);\n          const data = await res.json();\n          setProducts(Array.isArray(data) ? data : []);\n        } catch(e){ console.error(e); }\n      }\n    }\n    load();\n  }, []);\n\n  const ProductCard = window.ProductCard;\n  return (\n    <div style={{padding:'16px'}}>\n      <h2 style={{margin:'0 0 12px'}}>Django REST + MongoDB via Djongo</h2>\n      {error && <p style={{color:'#b91c1c'}}>{error}</p>}\n      <div className="grid">\n        {products.map(function(item){\n          return <ProductCard key={item.id || item._id || item.name} item={item}/>;\n        })}\n      </div>\n      <div className="card" style={{marginTop:'12px'}}>\n        <strong>Backend Files</strong>\n        <pre style={{whiteSpace:'pre-wrap'}}>{'/backend\\n\\nbackend/\\n  settings.py\\n  urls.py\\nproducts/\\n  models.py\\n  serializers.py\\n  views.py\\nmanage.py'}</pre>\n      </div>\n    </div>\n  );\n}\n\nroot.render(<App />);`,
          'backend/settings.py': `DATABASES = {\n  'default': {\n    'ENGINE': 'djongo',\n    'NAME': 'productdb',\n  }\n}\nINSTALLED_APPS = [\n  'rest_framework',\n  'products',\n]`,
          'backend/products/models.py': `from djongo import models\n\nclass Product(models.Model):\n    name = models.CharField(max_length=100)\n    price = models.FloatField()\n    description = models.TextField(blank=True)\n    image = models.URLField(blank=True)\n\n    def __str__(self):\n        return self.name`,
          'backend/products/serializers.py': `from rest_framework import serializers\nfrom .models import Product\n\nclass ProductSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Product\n        fields = '__all__'`,
          'backend/products/views.py': `from rest_framework import viewsets\nfrom .models import Product\nfrom .serializers import ProductSerializer\n\nclass ProductViewSet(viewsets.ModelViewSet):\n    queryset = Product.objects.all()\n    serializer_class = ProductSerializer`,
          'backend/urls.py': `from django.contrib import admin\nfrom django.urls import path, include\nfrom rest_framework import routers\nfrom products.views import ProductViewSet\n\nrouter = routers.DefaultRouter()\nrouter.register(r'products', ProductViewSet)\n\nurlpatterns = [\n  path('admin/', admin.site.urls),\n  path('api/', include(router.urls)),\n]`,
        };
      }
      if (slug === 'module-3' && currentTopic === 4) {
        return buildModule3Topic5LiveFiles();
      }
      if (slug === 'module-3' && currentTopic === 5) {
        return buildModule3Topic6LiveFiles();
      }
      if (slug === 'module-3' && currentTopic === 6) {
        return buildModule3Topic7LiveFiles();
      }
      if (slug === 'module-3' && currentTopic === 8) {
        return buildModule3Topic9LiveFiles();
      }
      // Module 4 live files — Topic 1 (React ↔ Django)
      if (slug === 'module-4' && currentTopic === 0) {
        return buildModule4Topic1LiveFiles();
      }
      // Module 4 live files — Topic 3 (State management & protected routes)
      if (slug === 'module-4' && currentTopic === 2) {
        return buildModule4Topic3LiveFiles();
      }
      // Module 4 live files — Topic 4 (Securing API calls)
      if (slug === 'module-4' && currentTopic === 3) {
        return buildModule4Topic4LiveFiles();
      }
      // Shadowed legacy inline block remains below for reference
      if (slug === 'module-4' && currentTopic === 0) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Module 4 — React ↔ Django</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'css/styles.css': `*{box-sizing:border-box} body{font-family:system-ui,sans-serif;background:#f8fafc;color:#111827;margin:0;padding:24px} .container{max-width:900px;margin:0 auto} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px} .card{border:1px solid #e5e7eb;border-radius:8px;background:#fff;padding:12px}`,
          'App.js': `const { useEffect, useState } = React;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products/')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to fetch from backend. Showing demo data.');
        setProducts([
          { id: 1, name: 'Demo MacBook Air', price: 1199.99 },
          { id: 2, name: 'Demo iPhone', price: 999.0 },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1>React ↔ Django Integration</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      <div className="grid">
        {products.map((p) => (
          <div key={p.id ?? Math.random()} className="card">
            <div style={{ fontWeight: '600' }}>{p.name}</div>
            <div>₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,

          // Backend reference files for exploration (not executed in preview)
          'backend/product_app/models.py': `from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField(blank=True)
    def __str__(self):
        return self.name`,
          'backend/product_app/serializers.py': `from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`,
          'backend/product_app/views.py': `from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`,
          'backend/product_app/urls.py': `from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)

urlpatterns = router.urls`,
          'backend/settings.py': `INSTALLED_APPS = [
  'corsheaders',
  'rest_framework',
  'product_app',
]
MIDDLEWARE = [
  'corsheaders.middleware.CorsMiddleware',
  'django.middleware.common.CommonMiddleware',
]
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']`,
        };
      }

      // Module 4 live files — Topic 2 (JWT Authentication Demo)
      if (slug === 'module-4' && currentTopic === 1) {
        return {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Module 4 — JWT Auth Demo</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
  <div id="root"></div>
  
  <main class="container" style="margin-top:16px">
    <section class="card">
      <h2 class="text-lg font-semibold">File Structure</h2>
      <pre style="white-space:pre-wrap">/auth_token_demo
  ├── backend/
  │   ├── manage.py
  │   ├── settings.py
  │   ├── urls.py
  ├── frontend/
  │   ├── src/
  │   │   ├── Login.js
  │   │   ├── App.js
  │   ├── package.json</pre>
    </section>
    <section class="card">
      <h2 class="text-lg font-semibold">Django URLs</h2>
      <pre style="white-space:pre-wrap"># backend/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]</pre>
    </section>
    <section class="card">
      <h2 class="text-lg font-semibold">React API Integration</h2>
      <pre style="white-space:pre-wrap">// api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

API.interceptors.request.use(config => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

export default API;</pre>
    </section>
    <p class="status">✅ Test Login → Verify Token → Access Protected Endpoints.</p>
  </main>

  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
          'css/styles.css': `*{box-sizing:border-box} body{font-family:system-ui,sans-serif;background:#f8fafc;color:#111827;margin:0;padding:24px} .container{max-width:900px;margin:0 auto} .card{border:1px solid #e5e7eb;border-radius:8px;background:#fff;padding:12px;margin-bottom:12px} .login-grid{display:grid;grid-template-columns:1fr 1fr auto;gap:8px} .actions{display:flex;gap:8px;margin-top:8px} .status{color:#334155}`,
          'App.js': `const { useState } = React;

function App(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [tokenInfo, setTokenInfo] = useState({ access: localStorage.getItem('access') || '', refresh: localStorage.getItem('refresh') || '' });

  const API = React.useMemo(() => {
    const instance = axios.create({ baseURL: 'http://localhost:8000' });
    instance.interceptors.request.use(config => {
      const access = localStorage.getItem('access');
      if (access) config.headers.Authorization = 'Bearer ' + access;
      return config;
    });
    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response && error.response.status === 401) {
          const refresh = localStorage.getItem('refresh');
          if (!refresh) return Promise.reject(error);
          try {
            const r = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
            localStorage.setItem('access', r.data.access);
            setTokenInfo(t => ({ ...t, access: r.data.access }));
            error.config.headers.Authorization = 'Bearer ' + r.data.access;
            return axios(error.config);
          } catch (e) {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            setTokenInfo({ access: '', refresh: '' });
            setStatus('Session expired; please log in again.');
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
    return instance;
  }, []);

  async function handleLogin(e){
    e.preventDefault();
    setStatus('Logging in...');
    try {
      const res = await axios.post('http://localhost:8000/api/token/', { username, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      setTokenInfo({ access: res.data.access, refresh: res.data.refresh });
      setStatus('Login successful! Access token stored.');
    } catch (err) {
      setStatus('Invalid credentials or backend not running.');
    }
  }

  async function testProtected(){
    setStatus('Calling protected endpoint...');
    try {
      const res = await API.get('/api/products/');
      const count = Array.isArray(res.data) ? res.data.length : (Array.isArray(res.data?.results) ? res.data.results.length : 0);
      setStatus('Protected request OK. Items: ' + count);
    } catch (err) {
      setStatus('Protected request failed. Ensure backend & permissions.');
    }
  }

  function logout(){
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setTokenInfo({ access: '', refresh: '' });
    setStatus('Logged out and storage cleared.');
  }

  return (
    <div className="container">
      <h1>JWT Authentication Demo</h1>

      <div className="card">
        <form onSubmit={handleLogin} className="login-grid">
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Login</button>
        </form>
        <div className="actions">
          <button onClick={testProtected}>Test Protected Request</button>
          <button onClick={logout}>Logout</button>
        </div>
        <p className="status">{status}</p>
      </div>

      <div className="card">
        <strong>Token Storage</strong>
        <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(tokenInfo, null, 2)}</pre>
      </div>

      <div className="card">
        <strong>Backend Reference Files</strong>
        <pre style={{whiteSpace:'pre-wrap'}}>{"/auth_token_demo\n  backend/\n    manage.py\n    settings.py\n    urls.py\n  frontend/\n    package.json\n    src/\n      Login.js\n      App.js\n      api.js"}</pre>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,

          // Backend reference files — JWT
          'auth_token_demo/backend/urls.py': `from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]`,
          'auth_token_demo/backend/settings.py': `INSTALLED_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'product_app',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}`,
          'auth_token_demo/backend/manage.py': `#!/usr/bin/env python3\n# Placeholder manage.py for demo structure\nprint('Run: python manage.py runserver (in a real Django project)')`,

          // Frontend reference files — JWT
          'auth_token_demo/frontend/src/Login.js': `import axios from "axios";
import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      alert("Login successful!");
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="p-4">
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;`,
          'auth_token_demo/frontend/src/api.js': `import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

API.interceptors.request.use(config => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

export default API;`,
          'auth_token_demo/frontend/src/App.js': `import React from 'react';
import API from './api';

export default function App(){
  return (
    <div style={{padding:'12px'}}>
      <h2>Frontend Reference App.js</h2>
      <p>This file demonstrates using API with token attached.</p>
      <button onClick={async () => {
        try {
          const res = await API.get('/api/products/');
          alert('Fetched products: ' + (Array.isArray(res.data) ? res.data.length : 0));
        } catch (e) {
          alert('Request failed. Ensure backend is running.');
        }
      }}>Test Request</button>
    </div>
  );
}`,
          'auth_token_demo/frontend/package.json': `{
  "name": "auth_token_demo",
  "private": true,
  "dependencies": {
    "axios": "^1.6.8",
    "react": "^18.2.0"
  }
}`,
        };
      }
    }

    // Module 4 live files — Topic 7 (Module Overview)
    if (slug === 'module-4' && currentTopic === 6) {
      return {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Module 4 — Overview</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
        'css/styles.css': `*{box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8fafc;color:#111827;margin:0;padding:24px}.container{max-width:960px;margin:0 auto}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.card{border:1px solid #e5e7eb;border-radius:8px;background:#fff;padding:12px}.badge{display:inline-block;padding:4px 8px;border-radius:999px;background:#e0f2fe;color:#0ea5e9;font-size:12px;margin-left:8px}`,
        'App.js': `const { useMemo } = React;

function App(){
  const topics = useMemo(() => ([
    { id: 1, title: 'Integrating React \u2194 Django', status: 'Implemented', demo: 'Product list fetch' },
    { id: 2, title: 'Auth Tokens & Sessions', status: 'Implemented', demo: 'JWT login & refresh' },
    { id: 3, title: 'State & Protected Routes', status: 'Implemented', demo: 'Context + router' },
    { id: 4, title: 'Securing API Calls', status: 'Implemented', demo: 'Axios interceptors' },
    { id: 5, title: 'Deploying Full-Stack Apps', status: 'Implemented', demo: 'Env + build files' },
    { id: 6, title: 'Final Capstone Project', status: 'Implemented', demo: 'E-commerce skeleton' },
    { id: 7, title: 'Module Overview', status: 'Implemented', demo: 'This page' },
    { id: 8, title: 'AI Assistance', status: 'Implemented', demo: 'Prompt composer' },
  ]), []);

  return (
    React.createElement('div', { className: 'container' }, [
      React.createElement('h1', { key: 'h', style: { marginBottom: '12px' } }, 'Module 4 Overview'),
      React.createElement('p', { key: 'p', style: { color: '#334155', marginBottom: '16px' } }, 'Quick summary of all topics and their demo focus.'),
      React.createElement('div', { key: 'g', className: 'grid' }, topics.map((t) => (
        React.createElement('div', { key: t.id, className: 'card' }, [
          React.createElement('div', { key: 'ttl', style: { fontWeight: 600 } }, t.title),
          React.createElement('div', { key: 'demo', style: { marginTop: 6, color: '#475569' } }, 'Demo: ' + t.demo),
          React.createElement('div', { key: 'st', style: { marginTop: 8 } }, [
            'Status: ',
            React.createElement('span', { key: 'bdg', className: 'badge' }, t.status)
          ])
        ])
      )))
    ])
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));`,
      };
    }

    // Module 4 live files — Topic 8 (AI Assistance)
    if (slug === 'module-4' && currentTopic === 7) {
      return {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Module 4 — AI Assistance</title>
  <link rel="stylesheet" href="css/styles.css" />
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
</body>
</html>`,
        'css/styles.css': `*{box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8fafc;color:#111827;margin:0;padding:24px}.container{max-width:960px;margin:0 auto}.card{border:1px solid #e5e7eb;border-radius:8px;background:#fff;padding:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.input{width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:6px}.btn{padding:8px 12px;background:#111827;color:#fff;border:none;border-radius:6px;cursor:pointer}`,
        'App.js': `function App(){
  const [goal, setGoal] = React.useState('Build React \u2194 Django integration with JWT auth');
  const [context, setContext] = React.useState('Frontend uses React 18; backend Django REST; MongoDB via Djongo.');
  const [constraints, setConstraints] = React.useState('Use axios; handle 401 with refresh; show errors clearly.');
  const [outputs, setOutputs] = React.useState('Provide code snippets, folder structure, and deployment steps.');
  const prompt = React.useMemo(() => {
    return [
      'You are an AI coding partner. Help me with the following:',
      '',
      'Goal:', goal,
      '',
      'Context:', context,
      '',
      'Constraints:', constraints,
      '',
      'Outputs:', outputs,
    ].join('\n');
  }, [goal, context, constraints, outputs]);

  function copy(){
    navigator.clipboard.writeText(prompt).then(() => alert('Prompt copied to clipboard')); 
  }

  return (
    React.createElement('div', { className: 'container' }, [
      React.createElement('h1', { key: 'h', style: { marginBottom: 12 } }, 'AI Assistance — Prompt Composer'),
      React.createElement('div', { key: 'g', className: 'grid' }, [
        React.createElement('div', { key: 'left' }, [
          React.createElement('label', { key: 'l1' }, 'Goal'),
          React.createElement('input', { key: 'i1', className: 'input', value: goal, onChange: e => setGoal(e.target.value) }),
          React.createElement('label', { key: 'l2', style: { display: 'block', marginTop: 8 } }, 'Context'),
          React.createElement('textarea', { key: 'i2', className: 'input', rows: 4, value: context, onChange: e => setContext(e.target.value) }),
          React.createElement('label', { key: 'l3', style: { display: 'block', marginTop: 8 } }, 'Constraints'),
          React.createElement('textarea', { key: 'i3', className: 'input', rows: 3, value: constraints, onChange: e => setConstraints(e.target.value) }),
          React.createElement('label', { key: 'l4', style: { display: 'block', marginTop: 8 } }, 'Outputs'),
          React.createElement('textarea', { key: 'i4', className: 'input', rows: 3, value: outputs, onChange: e => setOutputs(e.target.value) }),
          React.createElement('div', { key: 'btns', style: { marginTop: 10 } }, [
            React.createElement('button', { key: 'copy', className: 'btn', onClick: copy }, 'Copy Prompt')
          ])
        ]),
        React.createElement('div', { key: 'right' }, [
          React.createElement('label', { key: 'lab' }, 'Composed Prompt'),
          React.createElement('pre', { key: 'pre', className: 'card', style: { whiteSpace: 'pre-wrap' } }, prompt)
        ])
      ])
    ])
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));`,
      };
    }

    // Default playground
    return {
      'index.html': '<h2>Live Code Playground</h2><p>Edit files and see changes instantly.</p>',
      'css/styles.css': 'body{font-family:system-ui,sans-serif;padding:16px} h2{margin:0 0 8px}',
      'js/main.js': 'console.log("Hello from Live Code")',
    };
  };

  const [files, setFiles] = useState(buildLiveFiles());
  const [selectedFile, setSelectedFile] = useState('index.html');

  useEffect(() => {
    setFiles(buildLiveFiles());
    setSelectedFile('index.html');
  }, [slug, currentTopic]);

  const cssBundle = Object.keys(files).filter(k => k.endsWith('.css')).map(k => files[k]).join('\n');
  const jsBundle = Object.keys(files).filter(k => k.endsWith('.js')).map(k => files[k]).join('\n');
  const bodyContent = files['index.html'] || '';
  const isFullDoc = /<html[\s\S]*?>/i.test(bodyContent) || /<!doctype html>/i.test(bodyContent);
  let srcDoc = '';
  if (isFullDoc) {
    // Inject CSS/JS into a full HTML document by replacing link/script placeholders
    let doc = bodyContent;
    // Replace linked CSS with inline bundle
    doc = doc.replace(/<link[^>]+href=["']css\/styles\.css["'][^>]*>/i, `<style>${cssBundle}</style>`);
    // Detect script types present
    const hasModuleScript = /<script[^>]+type=["']module["'][^>]*>/i.test(bodyContent);
    const hasBabelScript = /<script[^>]+type=["']text\/babel["'][^>]*>/i.test(bodyContent);

    // If Babel App.js is referenced, transform multi-file content for in-browser execution
    let jsBundleToInject = jsBundle;
    const hasBabelAppSrc = /<script[^>]+type=["']text\/babel["'][^>]*src=["']App\.js["'][^>]*><\/script>/i.test(bodyContent);
    if (hasBabelAppSrc) {
      const appRaw = files['App.js'] || '';
      // Collect and transform all components under components/*.js
      const componentPaths = Object.keys(files).filter((k) => /^components\/.+\.js$/.test(k));
      const transformedComponents = componentPaths.map((path) => {
        const raw = files[path] || '';
        const defaultFuncMatch = raw.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
        const namedFuncMatch = raw.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
        const defaultExportMatch = raw.match(/export\s+default\s+([A-Za-z0-9_]+)/);
        const compName = (defaultFuncMatch && defaultFuncMatch[1]) || (defaultExportMatch && defaultExportMatch[1]) || (namedFuncMatch && namedFuncMatch[1]) || path.replace(/^components\//, '').replace(/\.js$/, '');
        let transformed = raw
          .replace(/^[\t ]*import\s+React[^\n]*$/m, 'const { useState, useEffect } = React;')
          .replace(/^[\t ]*export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/m, 'function $1(')
          .replace(/^[\t ]*export\s+default\s+([A-Za-z0-9_]+);?/m, `window.${compName} = ${compName};`);
        if (/export\s+default\s+function\s+([A-Za-z0-9_]+)/.test(raw)) {
          transformed += `\nwindow.${compName} = ${compName};`;
        }
        return transformed;
      });
      const appTransformed = appRaw
        .replace(/^[\t ]*import\s+React[^\n]*$/m, '')
        .replace(/^[\t ]*export\s+default\s+App;?/m, '')
        .replace(/^[\t ]*import\s+([A-Za-z0-9_]+)\s+from\s+['"]\.\/components\/\1['"][^\n]*$/mg, 'const $1 = window.$1;');
      jsBundleToInject = [...transformedComponents, appTransformed].join('\n');
    }

    // Replace normal JS script tag with inline bundle
    if (/<script[^>]+src=["']js\/main\.js["'][^>]*><\/script>/i.test(bodyContent)) {
      doc = doc.replace(/<script[^>]+src=["']js\/main\.js["'][^>]*><\/script>/i, `<script>${jsBundleToInject}</script>`);
    }
    // Replace non-module script tag (e.g., js/app.js) with inline bundle
    if (/<script[^>]+src=["']js\/app\.js["'][^>]*><\/script>/i.test(bodyContent)) {
      doc = doc.replace(/<script[^>]+src=["']js\/app\.js["'][^>]*><\/script>/i, `<script>${jsBundleToInject}</script>`);
    }
    // Replace App.js script tag (common for React UMD demos)
    if (/<script[^>]+src=["']App\.js["'][^>]*><\/script>/i.test(bodyContent)) {
      doc = doc.replace(/<script[^>]+src=["']App\.js["'][^>]*><\/script>/i, `<script>${jsBundleToInject}</script>`);
    }
    // Replace Babel script tag referencing App.js with inline bundle
    if (hasBabelAppSrc) {
      doc = doc.replace(/<script[^>]+type=["']text\/babel["'][^>]*src=["']App\.js["'][^>]*><\/script>/i, `<script type=\"text/babel\">${jsBundleToInject}</script>`);
    }
    // Replace ES module script tag (e.g., js/app.js) with inline bundle as a module
    if (/<script[^>]+type=["']module["'][^>]*src=["']js\/app\.js["'][^>]*><\/script>/i.test(bodyContent)) {
      doc = doc.replace(/<script[^>]+type=["']module["'][^>]*src=["']js\/app\.js["'][^>]*><\/script>/i, `<script type=\"module\">${jsBundleToInject}</script>`);
    }
    // If no link/script placeholders exist, inject before closing head/body
    if (!/href=["']css\/styles\.css["']/i.test(bodyContent)) {
      doc = doc.replace(/<\/head>/i, `<style>${cssBundle}</style></head>`);
    }
    if (!/(src=["']js\/main\.js["']|src=["']js\/app\.js["']|src=["']App\.js["']|type=["']module["'][^>]*src=["']js\/app\.js["']|type=["']text\/babel["'][^>]*src=["']App\.js["'])/i.test(bodyContent)) {
      doc = doc.replace(/<\/body>/i, hasModuleScript ? `<script type=\"module\">${jsBundleToInject}</script></body>` : hasBabelScript ? `<script type=\"text/babel\">${jsBundleToInject}</script></body>` : `<script>${jsBundleToInject}</script></body>`);
    }
    srcDoc = doc;
  } else {
    srcDoc = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${cssBundle}</style></head><body>${bodyContent}<script>${jsBundle}</script></body></html>`;
  }

  const moduleTopics = useMemo(
    () => ({
      'intro-react': [
        'React introduction and why React',
        'Installing Node.js and verifying',
        'Create React App vs Vite',
        'React project structure overview'
      ],
      'module-1': [
        'Deep dive into semantic HTML5',
        'CSS Grid & Flexbox layouts',
        'Fetch API & JSON handling',
        'Building responsive UIs for mobile and desktop',
        'Tailwind CSS / Bootstrap for modern layouts',
        'Forms, validation, and client-side UX',
        'Module Overview',
        'AI Assistance — Accelerating Web Development with GPT & Claude',
      ],
      'module-2': [
        'Modern JavaScript (ES6+): let, const, arrow functions, modules',
        'DOM manipulation and events',
        'Fetch API & JSON handling',
        'Introduction to React.js',
        'Components, Props, and State',
        'React Hooks (useState, useEffect)',
        'Mini Project: Product Listing Interface',
        'Module Overview',
        'AI Assistance — Accelerating Web Development with GPT & Claude',
      ],
      'module-3': [
        'Setting up Django as backend server',
        'Building REST APIs for frontend consumption',
        'Django Models and Views',
        'Connecting Django with MongoDB using Djongo / REST Framework',
        'Fetching and posting data from React to Django',
        'Authentication & environment variable management',
        'Mini Project: Product Database API',
        'Module Overview',
        'AI Assistance — Accelerating Web Development with GPT & Claude',
      ],
      'module-4': [
        'Integrating frontend (React) with backend (Django API)',
        'Managing authentication tokens and sessions',
        'State management & protected routes',
        'Securing API calls',
        'Deploying full-stack apps (Vercel / Render / AWS)',
        'Final Capstone Project: E-commerce Web Application',
        'Module Overview',
        'AI Assistance — Accelerating Web Development with GPT & Claude',
      ],
    }),
    [slug]
  );

  const getLessonContent = () => {
  // Intro React — Topic 2: Create React App vs Vite
  if (slug === 'intro-react' && currentTopic === 2) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold"> Lesson Tab — Create React App vs Vite</h2>
        <p className="text-gray-700">React apps can be created using different tools, but the two most popular options are:</p>
        <ul className="list-disc pl-5 text-gray-700">
          <li><strong>Create React App (CRA)</strong> — Older, official starter tool</li>
          <li><strong>Vite</strong> — Modern, faster, next-generation build tool</li>
        </ul>
        <p className="text-gray-700">Both help you create and run React projects, but they work very differently.</p>

        <div>
          <h3 className="text-base font-semibold">🆚 1. What is Create React App (CRA)?</h3>
          <p className="text-gray-700">Create React App is Facebook’s original tool for setting up React applications.</p>
          <p className="text-gray-700 font-medium mt-2">Key Features</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Pre-configured Webpack setup</li>
            <li>Lots of built-in features</li>
            <li>Wide community support</li>
            <li>Uses Babel + Webpack under the hood</li>
          </ul>
          <p className="text-gray-700 font-medium mt-2">Limitations</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Slow startup time</li>
            <li>Heavy bundling</li>
            <li>Long build times</li>
            <li>Difficult to customize without ejecting</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold">⚡ 2. What is Vite?</h3>
          <p className="text-gray-700">Vite is a modern, super-fast frontend tool created by Evan You (creator of Vue.js).</p>
          <p className="text-gray-700 font-medium mt-2">Key Features</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Uses ESBuild for lightning-fast dependency handling</li>
            <li>Development server starts in under 1 second</li>
            <li>Faster Hot Module Replacement (HMR)</li>
            <li>Modern and lightweight</li>
            <li>Easy to configure</li>
            <li>Supports multiple frameworks (React, Vue, Svelte, etc.)</li>
          </ul>
          <p className="text-gray-700 font-medium mt-2">Why Vite is faster</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Native ES Modules in the browser</li>
            <li>ESBuild for extremely fast processing</li>
            <li>Only rebuilds code you actually use</li>
          </ul>
          <p className="text-gray-700">These make Vite significantly faster than CRA during development.</p>
        </div>

        <div>
          <h3 className="text-base font-semibold">🥊 3. CRA vs Vite — Key Differences</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pr-6 py-2">Feature</th>
                  <th className="pr-6 py-2">Create React App (CRA)</th>
                  <th className="py-2">Vite</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr><td className="pr-6 py-1">Speed</td><td className="pr-6">Slow</td><td>Extremely fast</td></tr>
                <tr><td className="pr-6 py-1">Bundler</td><td className="pr-6">Webpack</td><td>ESBuild + Rollup</td></tr>
                <tr><td className="pr-6 py-1">Start Time</td><td className="pr-6">3–30 sec</td><td>&lt; 1 sec</td></tr>
                <tr><td className="pr-6 py-1">HMR</td><td className="pr-6">Slow & heavy</td><td>Very fast</td></tr>
                <tr><td className="pr-6 py-1">Config File</td><td className="pr-6">Hard to customize</td><td>Simple and flexible</td></tr>
                <tr><td className="pr-6 py-1">Build Output</td><td className="pr-6">Larger</td><td>Smaller & optimized</td></tr>
                <tr><td className="pr-6 py-1">Recommended in 2025?</td><td className="pr-6">❌ No</td><td>✅ Yes</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold">🎯 4. When to Use What?</h3>
          <p className="text-gray-700 font-medium">✔ Use Vite when:</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>You want speed</li>
            <li>You want a modern setup</li>
            <li>You’re building a new React project</li>
            <li>You want easy configurations</li>
          </ul>
          <p className="text-gray-700 font-medium mt-2">✔ Use CRA only when:</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>You are maintaining older CRA projects</li>
            <li>You must follow legacy tutorials</li>
          </ul>
          <p className="text-gray-700">For new development → Vite is the clear winner.</p>
        </div>
      </div>
    );
  }

  // Intro React — Topic 3: React Project Structure Overview
  if (slug === 'intro-react' && currentTopic === 3) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">📘 Lesson Tab — React Project Structure Overview</h2>
        <p className="text-gray-700">When you create a React project (using CRA or Vite), your folder contains several files and directories. Understanding this structure helps you know where to write code, where to store assets, and how React works internally.</p>
        <p className="text-gray-700">Below is the standard structure of a modern React app:</p>

        <div>
          <h3 className="text-base font-semibold">📂 1. Project Root Structure</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`my-app/\n│\n├── node_modules/\n├── public/          (CRA only)\n├── src/\n├── .gitignore\n├── index.html       (Vite)\n├── package.json\n├── package-lock.json / pnpm-lock.yaml / yarn.lock\n└── README.md`}</code></pre>
        </div>

        <div>
          <h3 className="text-base font-semibold">🔍 2. Important Folders Explained</h3>
          <p className="text-gray-700 font-medium">📁 node_modules /</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Stores all installed npm packages</li>
            <li>Automatically created when you install dependencies</li>
            <li>You never manually edit files here</li>
          </ul>

          <p className="text-gray-700 font-medium">📁 public / (CRA only)</p>
          <p className="text-gray-700">Contains static files that don’t get processed by bundlers.</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`public/\n│── index.html\n│── favicon.ico\n│── logo192.png\n│── logo512.png\n└── robots.txt`}</code></pre>
          <p className="text-gray-700"><code>public/index.html</code> is the main HTML file React injects into. React renders your app inside:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`<div id="root"></div>`}</code></pre>

          <p className="text-gray-700 font-medium">📁 src / — The Heart of a React App</p>
          <p className="text-gray-700">All your React code lives here. Default structure:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`src/\n│── App.jsx / App.js\n│── App.css\n│── index.js / main.jsx (Vite)\n│── index.css\n└── assets/ (optional)`}</code></pre>
          <p className="text-gray-700"><strong>src/index.js (CRA) or src/main.jsx (Vite)</strong> — Entry file renders your App component:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`ReactDOM.createRoot(document.getElementById('root')).render(<App />);`}</code></pre>
          <p className="text-gray-700"><strong>App.js / App.jsx</strong> — Your main UI component that is first loaded.</p>
          <p className="text-gray-700"><strong>assets</strong> — Optional folder to store images, icons, fonts, etc. e.g., <code>src/assets/logo.png</code></p>
        </div>

        <div>
          <h3 className="text-base font-semibold">🧱 3. Typical Folder Structure in Real Projects</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`src/\n│── components/\n│── pages/\n│── hooks/\n│── context/\n│── services/\n│── utils/\n│── assets/\n│── styles/\n└── App.jsx`}</code></pre>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>components/</strong> — Reusable UI parts (Button, Navbar, Card)</li>
            <li><strong>pages/</strong> — Page-level screens (HomePage, LoginPage)</li>
            <li><strong>hooks/</strong> — Custom hooks (useAuth, useFetch)</li>
            <li><strong>context/</strong> — React context providers (ThemeContext)</li>
            <li><strong>services/</strong> — API calls (axios files)</li>
            <li><strong>utils/</strong> — Helper functions (formatDate)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold">🧩 4. What Happens When You Run React?</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Browser loads <code>index.html</code></li>
            <li>React mounts <code>&lt;App /&gt;</code> inside the root div</li>
            <li>App renders your components</li>
            <li>UI automatically updates when state changes</li>
          </ul>
          <p className="text-gray-700">This is the foundation of React’s component-based architecture.</p>
        </div>
      </div>
    );
  }

  // Intro React — Topic 1: Installing Node.js and Verifying
  if (slug === 'intro-react' && currentTopic === 1) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">📘 Lesson Tab — Installing Node.js and Verifying</h2>
        <div>
          <h3 className="text-base font-semibold">What is Node.js?</h3>
          <p className="text-gray-700">Node.js is a JavaScript runtime that allows you to run JavaScript outside the browser. You need Node.js to:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Run React projects</li>
            <li>Install packages using npm</li>
            <li>Use build tools like Vite, Webpack, Babel, etc.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold">Why Do We Need Node.js for React?</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>npm (Node Package Manager)</strong> — to install libraries</li>
            <li><strong>Development servers</strong> — to preview your app locally</li>
            <li><strong>Build tools</strong> — to optimize and bundle your project</li>
          </ul>
          <p className="text-gray-700">Without Node.js, you cannot run modern React apps.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold">🛠 Steps to Install Node.js</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>
              <span className="font-medium">Step 1 — Go to Node.js Official Website</span><br/>
              Visit: <a href="https://nodejs.org" className="text-blue-600 underline">https://nodejs.org</a><br/>
              You will see two versions: <strong>LTS (Recommended)</strong> — Stable, safe for beginners; <strong>Current</strong> — Latest features, not always stable. 👉 Choose <strong>LTS</strong>.
            </li>
            <li>
              <span className="font-medium">Step 2 — Download Installer</span><br/>
              Click the installer for your OS: Windows (.msi), macOS (.pkg), Linux (.tar.xz or package manager).
            </li>
            <li>
              <span className="font-medium">Step 3 — Run Installer</span><br/>
              Follow the setup wizard: Click Next → Accept the license → Keep default options → Click Install. It installs: Node.js runtime and npm (Node Package Manager).
            </li>
          </ol>
        </div>
        <div>
          <h3 className="text-base font-semibold">🔍 Verifying Installation</h3>
          <p className="text-gray-700">Open your terminal (Windows: PowerShell/CMD; macOS/Linux: Terminal), then run:</p>
          <div className="space-y-2">
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>node -v</code></pre>
            <p className="text-gray-700">Expected output example: <code className="bg-gray-100 px-1 py-0.5 rounded">v20.x.x</code></p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>npm -v</code></pre>
            <p className="text-gray-700">Expected output example: <code className="bg-gray-100 px-1 py-0.5 rounded">10.x.x</code></p>
            <p className="text-gray-700">This confirms both Node.js and npm are installed successfully.</p>
          </div>
        </div>
      </div>
    );
  }
    // Intro React lessons
    if (slug === 'intro-react') {
      switch (currentTopic) {
        case 0:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">📘 Lesson Tab — React Introduction & Why React</h2>
              <div>
                <h3 className="text-base font-semibold">What is React?</h3>
                <p className="text-gray-700">React is a JavaScript library developed by Facebook (Meta) for building modern, fast, and dynamic user interfaces — especially Single Page Applications (SPAs).</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Build UI using components</li>
                  <li>Manage data through state</li>
                  <li>Update the screen efficiently without reloading pages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Why React? Key Reasons</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>Component-Based Architecture</strong> — Breaks UI into reusable pieces; modular, clean, and scalable.</li>
                  <li><strong>Virtual DOM (Speed & Performance)</strong> — React uses a lightweight copy of the real DOM and updates only what changes → faster rendering.</li>
                  <li><strong>Declarative UI</strong> — You tell React what the UI should look like; React updates the UI when the data (state) changes.</li>
                  <li><strong>Huge Community & Ecosystem</strong> — Libraries, tools, tutorials, and jobs. Used by Meta, Netflix, Uber, Airbnb, etc.</li>
                  <li><strong>Reusable & Maintainable Code</strong> — Write a component once, reuse it many times. Reduces bugs and speeds up development.</li>
                  <li><strong>Strong Industry Adoption</strong> — One of the most demanded frontend technologies; high‑paying and beginner‑friendly.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Where React Is Commonly Used</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Dashboards</li>
                  <li>E‑commerce websites</li>
                  <li>Social media apps</li>
                  <li>Real‑time apps (chat apps)</li>
                  <li>Mobile apps (React Native)</li>
                  <li>Complex UIs needing speed & interactivity</li>
                </ul>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">How to Install Node.js</h2>
              <p className="text-gray-700">Node.js provides the JavaScript runtime and npm packages required for React tooling.</p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>
                  Download the LTS version from <a className="text-blue-700 underline" href="https://nodejs.org" target="_blank" rel="noreferrer">https://nodejs.org</a> (recommended).
                </li>
                <li>Run installer → Next → Accept Terms → Next → keep defaults → Install.</li>
                <li>
                  Verify installation in Terminal / CMD / PowerShell:
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`node -v\nnpm -v`}</pre>
                  <p className="text-gray-700">You should see versions like <code>v20.x.x</code> and <code>10.x.x</code>.</p>
                </li>
              </ol>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Create a React Project — CRA vs Vite</h2>
              <div>
                <h3 className="text-base font-semibold">Method 1: Create React App (CRA)</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`npx create-react-app my-app\ncd my-app\nnpm start`}</pre>
                <p className="text-gray-700">Runs at <code>http://localhost:3000</code>.</p>
              </div>
              <div>
                <h3 className="text-base font-semibold">Method 2: Vite (Recommended — Faster)</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`npm create vite@latest my-app --template react\ncd my-app\nnpm install\nnpm run dev`}</pre>
                <p className="text-gray-700">Runs at <code>http://localhost:5173</code>.</p>
              </div>
              <p className="text-gray-700">Choose Vite for speed and modern tooling; CRA is familiar but slower.</p>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">React Project File Structure (Explained)</h2>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`my-app/\n│\n├── node_modules/          → All installed packages\n├── public/                → Static files (images, favicon, index.html)\n│    └── index.html\n│\n├── src/                   → Main source code\n│    ├── App.js            → Main React component\n│    ├── App.css           → Styles for App component\n│    ├── index.js          → Entry point that renders <App />\n│    ├── index.css         → Global styles\n│    └── assets/           → Images, icons, etc. (optional)\n│\n├── package.json           → Project info + dependencies\n├── package-lock.json      → Exact versions of installed packages\n├── .gitignore             → Files to ignore in Git\n└── README.md              → Project documentation`}</pre>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>public/index.html</strong> — HTML template where React mounts.</li>
                <li><strong>src/index.js</strong> — Entry point that renders <code>&lt;App /&gt;</code>.</li>
                <li><strong>src/App.js</strong> — Main component shown on screen.</li>
                <li><strong>package.json</strong> — scripts and dependencies.</li>
              </ul>
            </div>
          );
        case 4:
          return (
            <div className="space-y-6">
<h2 className="text-xl font-semibold">Official Documentation and Learning Resources</h2>

<div className="space-y-4 leading-relaxed text-gray-800">

  <p>
    Learning React becomes much easier when you know where to find trusted, official, and beginner-friendly resources.
    This section covers the best official websites, documentation, tools, and recommended learning platforms.
  </p>

  <h3 className="text-lg font-semibold">1. Official React Documentation</h3>
  <p>
    React Official Website is the main source for learning React, maintained by Meta.
  </p>
  <p>
    It includes beginner tutorials, hooks explanation, component patterns, interactive examples, and advanced guides.
    This is the most accurate place to learn React.
  </p>
  <a href="https://react.dev/" target="_blank" rel="noreferrer" className="text-blue-700 underline">
    React Official Documentation
  </a>

  <h3 className="text-lg font-semibold">2. React API References (Important)</h3>
  <p>
    Hooks Reference includes official documentation for useState, useEffect, useContext, useRef, and more.
    React DOM Reference explains rendering root elements.
  </p>
  <a href="https://react.dev/reference" target="_blank" rel="noreferrer" className="text-blue-700 underline">
    React API Reference
  </a>

  <h3 className="text-lg font-semibold">3. Node.js Official Documentation</h3>
  <p>
    Node.js is required for running React. Its documentation contains installation guides, npm explanation,
    package management, and asynchronous programming concepts.
  </p>
  <a href="https://nodejs.org/en/learn" target="_blank" rel="noreferrer" className="text-blue-700 underline">
    Node.js Documentation
  </a>

  <h3 className="text-lg font-semibold">4. Vite Official Documentation</h3>
  <p>
    If you create React apps using Vite, this documentation is essential. It includes Vite features,
    project creation steps, environment variables, and plugins.
  </p>
  <a href="https://vitejs.dev/guide/" target="_blank" rel="noreferrer" className="text-blue-700 underline">
    Vite Documentation
  </a>

  <h3 className="text-lg font-semibold">5. NPM (Node Package Manager) Documentation</h3>
  <p>
    React uses npm to install libraries. Learn npm commands, package.json, and dependency handling.
  </p>
  <a href="https://docs.npmjs.com/" target="_blank" rel="noreferrer" className="text-blue-700 underline">
    NPM Documentation
  </a>

  <h3 className="text-lg font-semibold">6. Free Learning Resources</h3>
  <p>
    React Tutorial by FreeCodeCamp and various React crash courses on YouTube are highly recommended.
    Search for React Crash Course videos by Net Ninja, Traversy Media, and Codevolution.
  </p>

  <h3 className="text-lg font-semibold">7. Useful Tools for React Development</h3>
  <p>
    CodeSandbox and StackBlitz are excellent online editors for React and Vite.
    ESLint rules and Prettier help maintain clean and consistent code formatting.
  </p>

  <h3 className="text-lg font-semibold">Which Resources Should Beginners Use First?</h3>
  <p>Start with the React Official Docs.</p>
  <p>Use Vite documentation if you are building React apps with Vite.</p>
  <p>Practice with FreeCodeCamp React exercises.</p>
  <p>Build simple projects to gain hands-on experience.</p>
  <p>Learn hooks in depth.</p>
  <p>Explore advanced patterns once comfortable.</p>

</div>

            </div>
          );
        default:
          return <p className="text-gray-700">Select a topic to view content.</p>;
      }
    }

    // Module 1 lessons (HTML/CSS/Responsive)
    if (slug === 'module-1') {
      switch (currentTopic) {
        case 0:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Deep Dive into Semantic HTML5</h2>
              <p className="text-gray-700 dark:text-gray-300">Semantic HTML5 means using elements that describe what your content represents, not just how it looks.</p>
              <p className="text-gray-700 dark:text-gray-300">Instead of writing everything inside generic <code>&lt;div&gt;</code> tags, you use meaningful elements such as <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;footer&gt;</code>.</p>

              <div>
                <h3 className="text-base font-semibold">These elements:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Improve accessibility (screen readers can navigate by landmarks)</li>
                  <li>Help SEO (search engines understand structure and importance)</li>
                  <li>Enhance maintainability (cleaner, self-documenting markup)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Why It Matters</h3>
                <p className="text-gray-700 dark:text-gray-300">Imagine reading a book without chapters or headings — that’s how browsers feel when a page is made only with <code>&lt;div&gt;</code>s. Semantic tags provide context, letting both humans and machines understand the page hierarchy.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Common Semantic Elements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="text-left p-2 border-b">Tag</th>
                        <th className="text-left p-2 border-b">Purpose</th>
                        <th className="text-left p-2 border-b">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b"><code>&lt;header&gt;</code></td>
                        <td className="p-2 border-b">Introductory content or site header</td>
                        <td className="p-2 border-b"><code>&lt;header&gt;&lt;h1&gt;My Site&lt;/h1&gt;&lt;/header&gt;</code></td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>&lt;nav&gt;</code></td>
                        <td className="p-2 border-b">Group of navigation links</td>
                        <td className="p-2 border-b"><code>&lt;nav&gt;&lt;a href="#about"&gt;About&lt;/a&gt;&lt;/nav&gt;</code></td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>&lt;main&gt;</code></td>
                        <td className="p-2 border-b">Main content unique to the page</td>
                        <td className="p-2 border-b"><code>&lt;main&gt;...&lt;/main&gt;</code></td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>&lt;section&gt;</code></td>
                        <td className="p-2 border-b">Thematic grouping of content with a heading</td>
                        <td className="p-2 border-b"><code>&lt;section&gt;&lt;h2&gt;Projects&lt;/h2&gt;&lt;/section&gt;</code></td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>&lt;article&gt;</code></td>
                        <td className="p-2 border-b">Self-contained content like a blog post</td>
                        <td className="p-2 border-b"><code>&lt;article&gt;&lt;h2&gt;Post Title&lt;/h2&gt;&lt;/article&gt;</code></td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>&lt;aside&gt;</code></td>
                        <td className="p-2 border-b">Complementary info (sidebar, related links)</td>
                        <td className="p-2 border-b"><code>&lt;aside&gt;Related Posts&lt;/aside&gt;</code></td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>&lt;footer&gt;</code></td>
                        <td className="p-2 border-b">Closing or summary section</td>
                        <td className="p-2 border-b"><code>&lt;footer&gt;© 2025 You&lt;/footer&gt;</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">Example Structure</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`<header>Site header</header>
<nav>Primary navigation</nav>
<main>
  <article>
    <h1>Blog post title</h1>
    <section>Content chunk</section>
  </article>
  <aside>Related links</aside>
</main>
<footer>Copyright ©</footer>`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Use one <code>&lt;main&gt;</code> per page.</li>
                  <li>Each section should have a heading.</li>
                  <li><code>&lt;article&gt;</code> = independent block of content.</li>
                  <li>Use <code>&lt;aside&gt;</code> for supplementary or sidebar content.</li>
                  <li><code>&lt;header&gt;</code> and <code>&lt;footer&gt;</code> can appear inside sections too.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Folder Structure</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`index.html
css/
  styles.css
js/
  main.js`}</pre>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">CSS Grid & Flexbox Layouts</h2>

              <p className="text-gray-700 dark:text-gray-300">Before Grid and Flexbox, developers relied on floats and tables to arrange elements — messy, rigid, and unresponsive. Now, CSS Grid and Flexbox provide elegant, modern tools for structuring responsive layouts that adapt beautifully across devices.</p>
              <p className="text-gray-700 dark:text-gray-300">They share a goal — layout control — but differ in approach:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>Flexbox</strong>: Best for 1D layouts — aligning items in a row or a column.</li>
                <li><strong>Grid</strong>: Best for 2D layouts — arranging items across rows and columns simultaneously.</li>
              </ul>

              <div>
                <h3 className="text-base font-semibold">When to Use Each</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="text-left p-2 border-b">Feature</th>
                        <th className="text-left p-2 border-b">Flexbox</th>
                        <th className="text-left p-2 border-b">Grid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b">Axis control</td>
                        <td className="p-2 border-b">One direction (row or column)</td>
                        <td className="p-2 border-b">Both directions (rows & columns)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Alignment</td>
                        <td className="p-2 border-b">Powerful alignment along one axis</td>
                        <td className="p-2 border-b">Powerful alignment in two axes</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Responsiveness</td>
                        <td className="p-2 border-b">Great for small UI parts (buttons, cards)</td>
                        <td className="p-2 border-b">Great for page-level or large layouts</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Item order</td>
                        <td className="p-2 border-b">Can easily reorder flex items</td>
                        <td className="p-2 border-b">Grid supports explicit positioning</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">CSS Flexbox Example</h3>
                <p className="text-gray-700 dark:text-gray-300">Flexbox treats each child inside a container as a flex item, adjusting space automatically.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`<div class="flex-container">
  <div>Box 1</div>
  <div>Box 2</div>
  <div>Box 3</div>
</div>`}</pre>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`.flex-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 150px;
  background: #eaf4fc;
}
.flex-container div {
  background: #a5d8ff;
  padding: 20px;
  border-radius: 8px;
}`}</pre>
                <p className="text-gray-700 dark:text-gray-300">This creates a single-row layout where boxes stretch and align evenly.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">CSS Grid Example</h3>
                <p className="text-gray-700 dark:text-gray-300">CSS Grid defines both rows and columns, creating a matrix-style layout.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`<div class="grid-container">
  <div>Header</div>
  <div>Sidebar</div>
  <div>Main</div>
  <div>Footer</div>
</div>`}</pre>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`.grid-container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 1fr 3fr;
  grid-gap: 10px;
}
.grid-container div {
  background: #fff3bf;
  padding: 20px;
  border-radius: 8px;
}`}</pre>
                <p className="text-gray-700 dark:text-gray-300">Here we define named grid areas for semantic layout — great for entire web page sections.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Combining Grid & Flexbox</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Use Grid for overall page layout (header, sidebar, footer).</li>
                  <li>Use Flexbox inside those sections for internal alignment (e.g., centering nav items).</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">A common pattern: a page layout built with Grid, and a navigation bar aligned with Flexbox.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Flexbox = 1D, Grid = 2D.</li>
                  <li>Use Grid for overall layout, Flexbox for components.</li>
                  <li>Combine both for modern, scalable design.</li>
                  <li>Use <code>gap</code> instead of margins for cleaner spacing.</li>
                  <li>Both support responsive units like <code>fr</code>, <code>%</code>, and <code>minmax()</code>.</li>
                </ul>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Fetch API & JSON Handling</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Modern web applications frequently communicate with external APIs to retrieve live data, post user inputs,
                or synchronize with databases. The Fetch API is the native JavaScript interface for making HTTP requests,
                replacing the older XMLHttpRequest. It’s promise-based, cleaner, and simpler.
              </p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`}</pre>

              <h3 className="text-lg font-semibold">What is JSON?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                JSON (JavaScript Object Notation) is a lightweight text format for exchanging data between a client and a server.
                It uses key-value pairs and supports arrays and nested objects.
              </p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`{
  "name": "Sai",
  "age": 21,
  "skills": ["HTML", "CSS", "JS"]
}`}</pre>
              <p className="text-gray-700 dark:text-gray-300">You can parse JSON into JavaScript objects using:</p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const obj = JSON.parse(jsonString);`}</pre>
              <p className="text-gray-700 dark:text-gray-300">And convert back to JSON using:</p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const jsonString = JSON.stringify(obj);`}</pre>

              <h3 className="text-lg font-semibold">Common Use Cases</h3>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                <li>Fetching data from REST APIs (e.g., GitHub, OpenWeather).</li>
                <li>Submitting form data to a backend.</li>
                <li>Updating UI dynamically with asynchronous results.</li>
                <li>Handling errors and loading states gracefully.</li>
              </ul>

              <h3 className="text-lg font-semibold">Async / Await Version</h3>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`async function getData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
getData();`}</pre>

              <h3 className="text-lg font-semibold">Key Takeaways</h3>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                <li><code>fetch()</code> returns a Promise.</li>
                <li>Always handle network errors with <code>try…catch</code>.</li>
                <li>Convert data to JSON using the <code>.json()</code> method.</li>
                <li>Use <code>async/await</code> for clean asynchronous code.</li>
              </ul>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Building Responsive UIs for Mobile and Desktop</h2>

              <div>
                <h3 className="text-base font-semibold">What is Responsive Design?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Responsive Design ensures that a website looks and functions well across devices — mobiles, tablets, and desktops.
                  It’s achieved using fluid layouts, flexible images, and media queries.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Key Principles</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Fluid Grids — use relative units like %, vw, vh, or fr instead of pixels.</li>
                  <li>Flexible Images — images scale using <code>max-width: 100%;</code>.</li>
                  <li>Media Queries — apply different styles for different screen sizes.</li>
                  <li>Mobile-First Approach — design for small screens first, then enhance for larger devices.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Example Media Query</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`}</pre>
                <p className="text-gray-700 dark:text-gray-300">This rule makes a layout stack vertically on mobile devices.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Tools for Responsive UIs</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>
                    Viewport Meta Tag: Ensures the page scales correctly.
                    <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`<meta name="viewport" content="width=device-width, initial-scale=1.0">`}</pre>
                  </li>
                  <li>CSS Frameworks: Bootstrap, Tailwind CSS simplify responsive design.</li>
                  <li>Testing: Use Chrome DevTools to simulate devices.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Best Practices</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Keep font sizes legible (1rem+).</li>
                  <li>Avoid fixed heights or widths.</li>
                  <li>Test layouts on multiple screen sizes.</li>
                  <li>Use <code>minmax()</code> and <code>auto-fit</code> in CSS Grid for fluid behaviour.</li>
                </ul>
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Tailwind CSS / Bootstrap for Modern Layouts</h2>

              <div>
                <h3 className="text-base font-semibold">Introduction</h3>
                <p className="text-gray-700 dark:text-gray-300">Modern web developers rely on CSS frameworks like Tailwind CSS and Bootstrap to create fast, responsive, and professional UIs without writing every style from scratch.</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Bootstrap gives prebuilt components and grid systems.</li>
                  <li>Tailwind CSS gives utility-first classes for total customization.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Tailwind CSS Overview</h3>
                <p className="text-gray-700 dark:text-gray-300">Tailwind is a utility-first framework that lets you style using classes directly in HTML.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`<button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Click Me
</button>`}</pre>
                <p className="text-gray-700 dark:text-gray-300">No need for custom CSS — every class is atomic and modular.</p>
                <h4 className="font-medium">Advantages</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Faster development</li>
                  <li>Full control (no design constraints)</li>
                  <li>Easy dark/light theme switching</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Bootstrap Overview</h3>
                <p className="text-gray-700 dark:text-gray-300">Bootstrap is a component-based framework that uses pre-styled UI elements.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`<button class="btn btn-primary">Click Me</button>`}</pre>
                <p className="text-gray-700 dark:text-gray-300">Bootstrap’s 12-column grid system:</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`<div class="container">
  <div class="row">
    <div class="col-md-6">Left</div>
    <div class="col-md-6">Right</div>
  </div>
</div>`}</pre>
                <h4 className="font-medium">Advantages</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Prebuilt responsive layout system</li>
                  <li>Ready-to-use components (modals, navbars, carousels)</li>
                  <li>Consistent design patterns</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">When to Use What</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="text-left p-2 border-b">Use Case</th>
                        <th className="text-left p-2 border-b">Tailwind CSS</th>
                        <th className="text-left p-2 border-b">Bootstrap</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b">Custom design systems</td>
                        <td className="p-2 border-b">✅</td>
                        <td className="p-2 border-b">❌</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Rapid prototyping</td>
                        <td className="p-2 border-b">✅</td>
                        <td className="p-2 border-b">✅</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Prebuilt components</td>
                        <td className="p-2 border-b">❌</td>
                        <td className="p-2 border-b">✅</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Performance optimization</td>
                        <td className="p-2 border-b">✅</td>
                        <td className="p-2 border-b">⚙️ Requires customization</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Tailwind = design freedom with utility classes.</li>
                  <li>Bootstrap = structured, consistent components.</li>
                  <li>Both ensure responsive layouts and cross-browser compatibility.</li>
                </ul>
              </div>
            </div>
          );
        case 5:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Forms, Validation, and Client-Side UX</h2>

              <div>
                <h3 className="text-base font-semibold">Introduction</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Forms are the gateway to user interaction — registration, login, feedback, payments, and more.
                  Front-end validation ensures users submit accurate and safe data before sending it to the server.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold">HTML Form Basics</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`<form id="signupForm">
  <label for="name">Name:</label>
  <input type="text" id="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" required>

  <button type="submit">Submit</button>
</form>`}</pre>
                <div>
                  <h4 className="font-medium">Key attributes:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li><code>required</code> → ensures field is not empty</li>
                    <li><code>type="email"</code> → validates format automatically</li>
                    <li><code>pattern</code> → defines custom regex rules</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">JavaScript Validation Example</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const form = document.getElementById("signupForm");
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  if (name.trim().length < 3) {
    alert("Name must be at least 3 characters long");
    return;
  }
  alert("Form submitted successfully!");
});`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">UX Enhancements</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Provide real-time feedback using <code>input</code> event listeners.</li>
                  <li>Highlight invalid fields using CSS <code>:invalid</code> pseudo-class.</li>
                  <li>Use ARIA attributes (<code>aria-label</code>, <code>aria-invalid</code>) for accessibility.</li>
                </ul>
              </div>
            </div>
          );
        case 6:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Module Overview</h2>

              <div>
                <h3 className="text-base font-semibold">Summary of Module 1: Advanced HTML, CSS & Responsive Design</h3>
                <p className="text-gray-700 dark:text-gray-300">This module established the foundation of professional front-end structure and styling. Students learned to:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Write semantic HTML5 for SEO and accessibility.</li>
                  <li>Master Flexbox and Grid for layout control.</li>
                  <li>Handle asynchronous data using Fetch API and JSON.</li>
                  <li>Build responsive UIs for multiple devices.</li>
                  <li>Use Tailwind CSS and Bootstrap for rapid prototyping.</li>
                  <li>Implement client-side validation for better UX.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Mini Project Recap: Portfolio Landing Page</h3>
                <p className="text-gray-700 dark:text-gray-300">By the end of this module, students build a personal portfolio that includes:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Semantic HTML structure (header, nav, main, footer)</li>
                  <li>Responsive Grid/Flexbox layout</li>
                  <li>Fetch API to load dynamic project data</li>
                  <li>Tailwind/Bootstrap for styling</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">This project acts as a bridge between foundational and real-world front-end skills.</p>
              </div>
            </div>
          );

        case 7:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">AI Assistance — Accelerating Web Development with GPT & Claude</h2>

              <div>
                <h3 className="text-base font-semibold">What This Topic Covers</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Write effective prompts for ChatGPT and Claude AI.</li>
                  <li>Use AI tools to generate HTML, CSS, and JavaScript efficiently.</li>
                  <li>Validate, modify, and integrate AI-generated code into real projects.</li>
                  <li>Speed up module creation, debug errors, and enhance UI/UX with AI help.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Why AI in Web Development?</h3>
                <p className="text-gray-700 dark:text-gray-300">AI tools like ChatGPT and Claude AI act as coding partners — they write, explain, and optimize code in seconds.</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Draft a base version of your HTML, CSS, and JS.</li>
                  <li>Quickly test ideas and iterate faster.</li>
                  <li>Generate responsive layouts and components.</li>
                  <li>Ask for optimization suggestions and performance tips.</li>
                  <li>Convert plain English into working prototypes.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Example Workflow</h3>
                <p className="text-gray-700 dark:text-gray-300">Prompts for Module 1 (Advanced HTML, CSS & Responsive Design):</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Prompt Example 1</h4>
                    <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`Generate semantic HTML5 code for a personal blog layout with a header, nav, main article, aside, and footer.`}</pre>
                  </div>
                  <div>
                    <h4 className="font-medium">Prompt Example 2</h4>
                    <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`Create a responsive Flexbox layout for a product page using Tailwind CSS, including an image gallery and a details section.`}</pre>
                  </div>
                  <div>
                    <h4 className="font-medium">Prompt Example 3</h4>
                    <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`Debug this Fetch API code that doesn’t return data properly and show how to handle JSON errors gracefully.`}</pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">Best Practices for Using AI</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Be specific — include language, framework, and design concept.</li>
                  <li>Iterate — refine prompts; AI works best with clear guidance.</li>
                  <li>Validate — run and test AI-generated code before deploying.</li>
                  <li>Learn — understand the logic, not just copy/paste.</li>
                  <li>Combine tools — ChatGPT for prototyping, Claude for structure/documentation.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">What You’ll Achieve</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Write AI prompts like a developer, not a casual user.</li>
                  <li>Use AI to build HTML/CSS layouts (aligned with Module 1 topics).</li>
                  <li>Collaborate with AI for design ideas, bug fixes, and documentation.</li>
                  <li>Save 60–70% of development time through smart AI integration.</li>
                </ul>
              </div>
            </div>
          );
        default:
          return <p className="text-gray-700 dark:text-gray-300">Select a topic to view content.</p>;
      }
    }

    // Module 2 lessons (JS/React)
    if (slug === 'module-2') {
      switch (currentTopic) {
        case 0:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Modern JavaScript (ES6+) — let, const, arrow functions, and modules</h2>
              <p className="text-gray-700 dark:text-gray-300">The release of ES6 (ECMAScript 2015) transformed JavaScript from a simple scripting tool into a modern language for building scalable web apps.</p>
              <p className="text-gray-700 dark:text-gray-300">It introduced block-scoped variables, arrow functions, and modules — foundational features you’ll use constantly (especially in React).</p>

              <div>
                <h3 className="text-base font-semibold">Why Learn ES6+</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Better readability</li>
                  <li>Modular code organization</li>
                  <li>Safer variable handling</li>
                  <li>Cleaner function syntax</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">1. let and const — Modern Variable Declarations</h3>
                <p className="text-gray-700 dark:text-gray-300">Before ES6, <code>var</code> was function-scoped and often caused bugs due to leaking outside blocks. Prefer <code>let</code> and <code>const</code>:</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`let user = "Alex";
const API_URL = "https://api.example.com";

user = "Jordan";  // valid
API_URL = "https://newapi.com"; // Error — cannot reassign a constant`}</pre>
                <p className="text-gray-700 dark:text-gray-300"><strong>Tip:</strong> Always prefer <code>const</code> unless you must reassign.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">2. Arrow Functions — Cleaner and Shorter</h3>
                <p className="text-gray-700 dark:text-gray-300">Arrow functions simplify how we write functions and make code more readable.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`// Traditional function
function greet(name) {
  return "Hello, " + name;
}

// Arrow function
const greet = (name) => ` + "`Hello, ${name}`" + `;`}</pre>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Implicit return for single expressions</li>
                  <li>No need for <code>.bind(this)</code> in class methods</li>
                  <li>Compact and modern syntax</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">3. Modules — Writing Reusable Code</h3>
                <p className="text-gray-700 dark:text-gray-300">Split code into files and import/export only what’s needed as apps grow.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">math.js</h4>
                    <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;`}</pre>
                  </div>
                  <div>
                    <h4 className="font-medium">app.js</h4>
                    <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`import { add, multiply } from './math.js';
console.log(add(2, 3));
console.log(multiply(4, 5));`}</pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">Key ES6+ Benefits</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Better readability</li>
                  <li>Safer variable scoping</li>
                  <li>Reusable modules</li>
                  <li>Cleaner functional programming</li>
                  <li>Foundation for React components and hooks</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Real‑World Example</h3>
                <p className="text-gray-700 dark:text-gray-300">React apps use <code>import</code>/<code>export</code> in nearly every file — mastering ES6 modules makes React development natural.</p>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">DOM Manipulation & Events</h2>
              <div>
                <h3 className="text-base font-semibold">Introduction</h3>
                <p className="text-gray-700 dark:text-gray-300">The DOM (Document Object Model) is how your browser represents a web page. It’s a live tree of elements that JavaScript can access, modify, and interact with.</p>
                <p className="text-gray-700 dark:text-gray-300">Understanding DOM manipulation is the first step toward building interactive web pages, and it’s the foundation of modern UI frameworks like React.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">What Is DOM Manipulation?</h3>
                <p className="text-gray-700 dark:text-gray-300">DOM manipulation is the process of dynamically changing HTML elements using JavaScript. You can:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Add or remove elements</li>
                  <li>Change text, attributes, or CSS styles</li>
                  <li>Respond to user interactions like clicks or keypresses</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Common DOM Methods</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="text-left p-2 border-b">Method</th>
                        <th className="text-left p-2 border-b">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b"><code>document.getElementById(id)</code></td>
                        <td className="p-2 border-b">Selects an element by ID</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>document.querySelector(selector)</code></td>
                        <td className="p-2 border-b">Selects first matching element</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>element.textContent</code></td>
                        <td className="p-2 border-b">Gets or sets the text inside an element</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>element.innerHTML</code></td>
                        <td className="p-2 border-b">Gets or sets the HTML content</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>element.style.property</code></td>
                        <td className="p-2 border-b">Changes inline CSS styles</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b"><code>element.classList.add()</code> / <code>.remove()</code></td>
                        <td className="p-2 border-b">Adds or removes classes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">Events in JavaScript</h3>
                <p className="text-gray-700 dark:text-gray-300">Events are actions performed by users — clicking a button, typing, scrolling, etc. We use event listeners to respond to those actions.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const button = document.querySelector('button');
button.addEventListener("click", () => {
  alert("Button clicked!");
});`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">Real‑Life Example</h3>
                <p className="text-gray-700 dark:text-gray-300">Imagine a “Change Theme” button that toggles light/dark mode — this is DOM manipulation with an event listener!</p>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Fetch API & JSON Handling</h2>

              <div>
                <h3 className="text-base font-semibold">Introduction</h3>
                <p className="text-gray-700 dark:text-gray-300">The Fetch API allows JavaScript to communicate with servers — fetching or sending data asynchronously.</p>
                <p className="text-gray-700 dark:text-gray-300">You’ll use Fetch extensively when working with APIs in React or when building dashboards, e-commerce sites, or any data‑driven apps.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">What Is Fetch?</h3>
                <p className="text-gray-700 dark:text-gray-300"><code>fetch()</code> is a built‑in JavaScript function that makes HTTP requests (GET, POST, PUT, DELETE) and returns a Promise that resolves with a Response object.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`fetch("https://api.example.com/data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">Working with JSON</h3>
                <p className="text-gray-700 dark:text-gray-300">Most APIs send data in JSON (JavaScript Object Notation) — a lightweight format for storing and exchanging data.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`{
  "name": "John",
  "age": 25,
  "skills": ["JavaScript", "React"]
}`}</pre>
                <p className="text-gray-700 dark:text-gray-300">You can parse JSON with: <code>response.json()</code></p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Real Use Case</h3>
                <p className="text-gray-700 dark:text-gray-300">You might fetch a list of products, user profiles, or posts and display them dynamically on your webpage using the DOM.</p>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Introduction to React.js</h2>

              <div>
                <h3 className="text-base font-semibold">Introduction</h3>
                <p className="text-gray-700 dark:text-gray-300">React.js is a JavaScript library developed by Facebook for building fast, interactive UIs.</p>
                <p className="text-gray-700 dark:text-gray-300">It uses components, props, and state to manage the UI efficiently.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Why React?</h3>
                <p className="text-gray-700 dark:text-gray-300">Traditional DOM manipulation updates the entire page, but React updates only what changes — using a Virtual DOM for high performance.</p>
                <p className="text-gray-700 dark:text-gray-300">React encourages a component-based architecture where each part of the UI (button, navbar, card) is its own self-contained block of code.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Core Concepts</h3>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="font-semibold p-2 border-b">Concept</th>
                      <th className="font-semibold p-2 border-b">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b">Component</td>
                      <td className="p-2 border-b">A reusable piece of UI (function or class)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">JSX</td>
                      <td className="p-2 border-b">HTML-like syntax used in React</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">Props</td>
                      <td className="p-2 border-b">Data passed into components</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">State</td>
                      <td className="p-2 border-b">Internal data that changes over time</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-base font-semibold">Example Component</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="Student" />`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">Virtual DOM</h3>
                <p className="text-gray-700 dark:text-gray-300">React keeps a lightweight copy of the DOM in memory. When data changes, it only updates the parts that actually changed — improving performance drastically.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Real-Life Analogy</h3>
                <p className="text-gray-700 dark:text-gray-300">Instead of repainting the entire house when one wall changes color, React only repaints that single wall.</p>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Components, Props, and State</h2>
              <p className="text-gray-700 dark:text-gray-300">
                        React applications are built from components—the building blocks of the UI. Each component is an independent, reusable piece of code that defines how a part of the interface should appear and behave. Components can accept inputs (props) and manage their own data (state).
<br/>
<mark>1. Components</mark>
<br/>
A Component is like a function that returns UI (JSX).

It can be a Functional Component or a Class Component (modern React prefers functional).

Each component should be small and focused on a single task.
<br/>
<mark>2. Props (Properties)</mark>
<br/>
Props are read-only inputs passed from a parent component to a child component.

They allow components to be dynamic and reusable.

Props are immutable, meaning they cannot be changed by the component receiving them.
<br/>
<mark>3. State</mark>
<br/>
State is data that can change over time.

Managed inside the component.

When state changes, the component re-renders automatically.

Controlled using React’s useState hook (in functional components).

              </p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`function Product({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{price}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <Product name="Headphones" price="59" />
      <Product name="Keyboard" price="79" />
    </div>
  );
}`}</pre>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const { useState } = React;
function Counter(){
  const [count, setCount] = useState(0);
  return (<div><p>Count: {count}</p><button onClick={() => setCount(count + 1)}>+</button></div>);
}`}</pre>
            </div>
          );
        case 5:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">React Hooks (useState, useEffect)</h2>
              <p className="text-gray-700 dark:text-gray-300">React Hooks are special functions that let you “hook into” React features—like state and lifecycle—without writing classes.</p>

              <div>
                <h3 className="text-base font-semibold">Two essential hooks</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><code>useState</code> — Manage local component state.</li>
                  <li><code>useEffect</code> — Run side effects (fetching data, subscriptions, timers, DOM updates).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">1. useState</h3>
                <p className="text-gray-700 dark:text-gray-300">Initializes and updates local state in a functional component.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const [value, setValue] = useState(initialValue);`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">2. useEffect</h3>
                <p className="text-gray-700 dark:text-gray-300">Handles side effects; runs after render by default and can be controlled with a dependency array.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`useEffect(() => {
  // side effect
}, [dep]); // runs when 'dep' changes`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">Counter Example</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Clicked \${count} times\`;
    console.log('Count updated:', count);
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
    </div>
  );
}

export default Counter;`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">Real‑world analogy</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><code>useState</code> is like a notebook inside a component where you write and update values.</li>
                  <li><code>useEffect</code> is like a reminder that triggers after something changes.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Learning Outcome</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Understand the relationship between components, props, and state.</li>
                  <li>Build dynamic, reactive UIs with <code>useState</code>.</li>
                  <li>Control side effects (like API calls) using <code>useEffect</code>.</li>
                  <li>Be ready to build the Mini Project: Product Listing Interface next.</li>
                </ul>
              </div>
            </div>
          );
        case 6:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Mini Project: Product Listing Interface</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Build a React app that fetches products, displays image/title/price, and uses a simple grid.
              </p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`function App(){
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=6')
      .then(res => res.json())
      .then(setProducts);
  }, []);
  return (
    <div>
      <h1>🛍 Product Listing</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
        {products.map(p => (
          <div key={p.id} style={{border:'1px solid #ccc',padding:'10px'}}>
            <img src={p.image} width="100"/>
            <h4>{p.title}</h4>
            <p>{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`}</pre>
            </div>
          );
        case 7:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">🧭 Module 2 Overview: JavaScript & React.js Essentials</h2>
              <p className="text-gray-700 dark:text-gray-300">After mastering the visual foundation of the web in Module 1, it’s time to bring your interfaces to life. Module 2 is where design meets logic — where static pages become interactive, dynamic, and reactive.</p>
              <p className="text-gray-700 dark:text-gray-300">This module introduces modern JavaScript (ES6+) and React.js — the two most in-demand technologies in frontend development. You’ll learn to think like a frontend architect: design, structure, and manage data flow across an application.</p>

              <div>
                <h3 className="text-base font-semibold">What You’ll Learn</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Write modern JavaScript with ES6+: let, const, arrow functions, modules.</li>
                  <li>Manipulate the DOM to update content and handle user interactions.</li>
                  <li>Fetch and display data from real APIs using async JS and JSON.</li>
                  <li>Build with React.js — powering today’s top web apps.</li>
                  <li>Understand Components, Props, and State — the DNA of React UIs.</li>
                  <li>Master React Hooks (useState, useEffect) for state and side effects.</li>
                  <li>Create a Mini Project: Product Listing Interface.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Why This Module Matters</h3>
                <p className="text-gray-700 dark:text-gray-300">Every interactive feature — from cart buttons to dynamic feeds — is powered by JavaScript and React. Companies like Netflix, Airbnb, and Instagram use React for fast, modular, scalable UIs. This module prepares you to enter that world with understanding, not copy-paste.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">You’ll Go From</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Writing basic HTML/CSS →</li>
                  <li>Creating stateful components that talk to APIs and re-render in milliseconds.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Real‑World Relevance</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Build single‑page applications (SPAs).</li>
                  <li>Create component‑based UIs that are easy to maintain.</li>
                  <li>Think in data flows — a foundation for backend/full‑stack expansion.</li>
                  <li>Prepare for frameworks like Next.js, React Native, or Vue.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Module Flow</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="text-left p-2 border-b">Week</th>
                        <th className="text-left p-2 border-b">Topic</th>
                        <th className="text-left p-2 border-b">Focus</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b">1</td>
                        <td className="p-2 border-b">Modern JavaScript (ES6+)</td>
                        <td className="p-2 border-b">Core syntax, variables, functions, modules</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">1</td>
                        <td className="p-2 border-b">DOM Manipulation & Events</td>
                        <td className="p-2 border-b">Making the UI interactive</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">2</td>
                        <td className="p-2 border-b">Fetch API & JSON Handling</td>
                        <td className="p-2 border-b">Working with real data</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">2</td>
                        <td className="p-2 border-b">Introduction to React.js</td>
                        <td className="p-2 border-b">Core React concepts and JSX</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">2</td>
                        <td className="p-2 border-b">Components, Props, and State</td>
                        <td className="p-2 border-b">Modular UI design</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">3</td>
                        <td className="p-2 border-b">React Hooks (useState, useEffect)</td>
                        <td className="p-2 border-b">State management and side effects</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">3</td>
                        <td className="p-2 border-b">Mini Project: Product Listing Interface</td>
                        <td className="p-2 border-b">Real‑world project combining all skills</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">🎯 Learning Outcome</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Be fluent in ES6+ JavaScript and DOM operations.</li>
                  <li>Understand React’s component‑based philosophy.</li>
                  <li>Create data‑driven UIs with state, hooks, and API integration.</li>
                  <li>Be ready for full‑featured projects and advanced React.</li>
                </ul>
              </div>
            </div>
          );
        case 8:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">9. AI Assistance — Accelerating Web Development with GPT & Claude</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Modern frontend developers harness AI tools like ChatGPT and Claude to accelerate design, debugging, and documentation. This topic teaches how to strategically use AI in real projects without becoming over-dependent on it.
              </p>

              <div>
                <h3 className="text-base font-semibold">1. Why Use AI in Frontend Development</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Generate starter code structures faster (React components, HTML, CSS snippets)</li>
                  <li>Debug complex issues and get context-aware solutions</li>
                  <li>Optimize UI layouts using modern frameworks (Tailwind / Bootstrap)</li>
                  <li>Learn new patterns and convert pseudocode into production-ready logic</li>
                  <li>Automate documentation, test cases, and refactoring suggestions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">2. AI Workflow for Module 1 & 2</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="text-left p-2 border-b">Task</th>
                        <th className="text-left p-2 border-b">Manual Way</th>
                        <th className="text-left p-2 border-b">AI-Assisted Way</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b">Create component structure</td>
                        <td className="p-2 border-b">Write folders and imports manually</td>
                        <td className="p-2 border-b">Ask GPT / Claude to generate React component tree</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Design responsive layout</td>
                        <td className="p-2 border-b">Experiment with CSS rules</td>
                        <td className="p-2 border-b">Ask AI to convert Figma design to responsive Tailwind CSS</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Manage state logic</td>
                        <td className="p-2 border-b">Manually write hooks and reducers</td>
                        <td className="p-2 border-b">Prompt AI to scaffold hooks for state and side effects</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Fetch & display data</td>
                        <td className="p-2 border-b">Write full Fetch API boilerplate</td>
                        <td className="p-2 border-b">Ask AI to generate sample code for REST/GraphQL calls</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Debug errors</td>
                        <td className="p-2 border-b">Trial and error in console</td>
                        <td className="p-2 border-b">Paste error trace into AI for step-by-step fix</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">Document project</td>
                        <td className="p-2 border-b">Write README manually</td>
                        <td className="p-2 border-b">Ask AI to generate README and component documentation</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">3. Prompt Engineering for Developers</h3>
                <p className="text-gray-700 dark:text-gray-300">Prompts are the new programming interface. Good developers learn to “talk to AI” precisely.</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>🧠 “Generate a React functional component for a responsive product card using TailwindCSS.”</li>
                  <li>⚙️ “Explain how to optimize a useEffect hook to prevent unnecessary re-renders.”</li>
                  <li>💡 “Convert this JavaScript Fetch API call into async/await syntax with error handling.”</li>
                  <li>📘 “Write a professional README file for a portfolio project built with React and TailwindCSS.”</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">4. Best Practices</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Always review AI-generated code before use.</li>
                  <li>Use AI for scaffolding, not final logic.</li>
                  <li>Combine your understanding of JavaScript, React, and CSS to validate the output.</li>
                  <li>Use version control (Git) to track changes and compare AI-generated improvements.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">🎯 Learning Outcome</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Understand how to use ChatGPT and Claude as development partners.</li>
                  <li>Write high-impact prompts that produce accurate, reusable frontend code.</li>
                  <li>Integrate AI into workflow for faster prototyping, debugging, and optimization.</li>
                  <li>Strengthen judgment to validate and refine AI output based on human understanding.</li>
                </ul>
              </div>
            </div>
          );
        default:
          return <p className="text-gray-700 dark:text-gray-300">Select a topic to view content.</p>;
      }
    }

    // Module 3 lessons (Backend integration with Django & MongoDB)
    if (slug === 'module-3') {
      switch (currentTopic) {
        case 0:
          return (
            <div className="space-y-4 text-sm">
              <h2 className="text-base font-semibold">🧩 Topic 1: Setting up Django as Backend Server</h2>
              <p className="text-gray-700 dark:text-gray-300">Frontend applications like React rely on backends to handle data storage, authentication, and business logic. Django provides routing, models, admin, and APIs to build robust backends quickly.</p>

              <h3 className="font-semibold text-base">1. What is Django?</h3>
              <p className="text-gray-700 dark:text-gray-300">Django is a high-level Python web framework following the MVT architecture. It emphasizes rapid development with batteries included: ORM, admin, authentication, and security.</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Built-in admin panel</li>
                <li>ORM (Object Relational Mapper)</li>
                <li>High security defaults</li>
                <li>Rapid development via reusable apps</li>
                <li>Great fit for REST APIs powering frontends</li>
              </ul>

              <h3 className="font-semibold text-base">2. Prerequisites</h3>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python --version
pip --version`}</pre>

              <h3 className="font-semibold text-base">3. Django Installation and Setup</h3>
              <h4 className="font-medium">Step 1: Create a Virtual Environment</h4>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# Create a new virtual environment
python -m venv env

# Activate the environment (Windows)
env\\Scripts\\activate

# On Mac/Linux
source env/bin/activate`}</pre>

              <h4 className="font-medium">Step 2: Install Django</h4>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`pip install django

django-admin --version`}</pre>

              <h4 className="font-medium">Step 3: Create a New Django Project</h4>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# Start a new project named "backend"
django-admin startproject backend`}</pre>
              <p className="text-gray-700 dark:text-gray-300">Project folder structure:</p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`backend/
├── manage.py
└── backend/
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── wsgi.py`}</pre>

              <h4 className="font-medium">Step 4: Run Development Server</h4>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`cd backend
python manage.py runserver`}</pre>
              <p className="text-gray-700 dark:text-gray-300">You should see: <code>Starting development server at http://127.0.0.1:8000/</code>. Open in browser for the welcome page.</p>

              <h4 className="font-medium">Step 5: Create a Django App</h4>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py startapp products`}</pre>
              <p className="text-gray-700 dark:text-gray-300">Add the app to <code>backend/settings.py</code>:</p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'products',
]`}</pre>

              <h4 className="font-medium">Step 6: Verify Everything Works</h4>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py runserver`}</pre>
              <p className="text-gray-700 dark:text-gray-300">Backend is active at <code>http://127.0.0.1:8000/</code>.</p>

              <h3 className="font-semibold text-base">Example: Simple Django View</h3>
              <p className="text-gray-700 dark:text-gray-300">Create a quick route that returns "Hello from Django Backend!"</p>
              <p className="text-gray-700 dark:text-gray-300">products/views.py</p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello from Django Backend!")`}</pre>
              <p className="text-gray-700 dark:text-gray-300">backend/urls.py</p>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.contrib import admin
from django.urls import path
from products.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),  # root URL mapped to home view
]`}</pre>
              <p className="text-gray-700 dark:text-gray-300">Restart server and visit <code>http://127.0.0.1:8000/</code> to see the message.</p>

              <h4 className="font-medium">Directory Structure (Live Code)</h4>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`/backend
│
├── manage.py
├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
└── products/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── views.py
    └── tests.py`}</pre>
            </div>
          );
        case 1:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Topic 2 — Building REST APIs</h2>
              <p className="text-gray-700 dark:text-gray-300">In this lesson, you will create a Django REST API that your React app can consume. We will define a <code>Product</code> model, expose CRUD endpoints via Django REST Framework, and test the API with a simple React fetch.</p>

              <h3 className="text-base font-semibold">1) Install and Configure DRF</h3>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# In your Django project virtualenv
pip install djangorestframework djongo

# settings.py
INSTALLED_APPS = [
  'rest_framework',
  'products',
]

DATABASES = {
  'default': {
    'ENGINE': 'djongo',
    'NAME': 'productdb',
  }
}`}</pre>

              <h3 className="text-base font-semibold">2) Define Product Model</h3>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# products/models.py
from djongo import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField()
    image = models.URLField()

    def __str__(self):
        return self.name`}</pre>

              <h3 className="text-base font-semibold">3) Create Serializer</h3>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# products/serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`}</pre>

              <h3 className="text-base font-semibold">4) Create ViewSet</h3>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# products/views.py
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`}</pre>

              <h3 className="text-base font-semibold">5) Wire Up Routes</h3>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from products.views import ProductViewSet

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
  path('admin/', admin.site.urls),
  path('api/', include(router.urls)),
]`}</pre>

              <h3 className="text-base font-semibold">6) Run and Test</h3>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# Start Django
python manage.py runserver

# Visit API in browser
http://127.0.0.1:8000/api/products/

# Example JSON
[
  {"name":"Laptop","price":1299.99,"description":"Powerful laptop","image":"https://..."}
]`}</pre>

              <h4 className="font-medium">Directory Structure</h4>
              <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`backend/
  manage.py
  backend/
    settings.py
    urls.py
    asgi.py
    wsgi.py
  products/
    __init__.py
    admin.py
    apps.py
    models.py
    views.py
    serializers.py
`}</pre>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6 text-sm">
              <h2 className="text-base font-semibold">🧩 Topic 3: Django Models and Views</h2>
              <p className="text-gray-700 dark:text-gray-300">Django’s Models and Views form the foundation of how your backend interacts with data.</p>
              <p className="text-gray-700 dark:text-gray-300">Models define how your data is structured (tables in the database).</p>
              <p className="text-gray-700 dark:text-gray-300">Views define how the server processes requests and sends responses.</p>
              <p className="text-gray-700 dark:text-gray-300">Together, they create the MVT architecture — Model, View, Template — where logic and data flow are clearly separated.</p>

              <div>
                <h3 className="text-base font-semibold">1. Django Models</h3>
                <p className="text-gray-700 dark:text-gray-300">Models are Python classes that represent database tables. Each attribute in a model maps to a database column.</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)

`}</pre>
                <p className="text-gray-700 dark:text-gray-300">Django automatically handles migrations and table creation — no SQL needed.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">2. Django Views</h3>
                <p className="text-gray-700 dark:text-gray-300">Views handle the logic for a request. They fetch data from models, process it, and send back a response.</p>
                <p className="text-gray-700 dark:text-gray-300">There are two main types: Function-based views (FBVs) and Class-based views (CBVs).</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">3. Workflow</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Request hits a URL</li>
                  <li>URL triggers a View</li>
                  <li>View interacts with Model</li>
                  <li>Response (HTML or JSON) is sent to the client</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Syntax: Function-Based View</h3>
                <p className="text-gray-700 dark:text-gray-300">Below is a minimal setup using function-based views to render an HTML template with products.</p>

                <div className="space-y-2">
                  <p className="font-medium">products/models.py</p>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=8, decimal_places=2)
`}</pre>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">products/views.py</p>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.shortcuts import render
from .models import Product


def product_list(request):
    products = Product.objects.all()
    return render(request, 'products.html', {'products': products})
`}</pre>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">backend/urls.py</p>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.urls import path
from products.views import product_list

urlpatterns = [
    path('products/', product_list),
]
`}</pre>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">templates/products.html</p>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<!DOCTYPE html>
<html lang="en">
<head>
  <title>Product List</title>
</head>
<body>
  <h1>Available Products</h1>
  <ul>
    {% for product in products %}
      <li>{{ product.name }} - ₹{{ product.price }}</li>
    {% endfor %}
  </ul>
</body>
</html>
`}</pre>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">File Structure</p>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`/backend

backend/
  urls.py
products/
  models.py
  views.py
  templates/
    products.html
manage.py
`}</pre>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Run migrations</p>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py makemigrations
python manage.py migrate
`}</pre>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Create sample data</p>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py shell

from products.models import Product
Product.objects.create(name="MacBook Air", category="Laptop", price=1199.99)
`}</pre>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Run the server</p>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py runserver
`}</pre>
                  <p className="text-gray-700 dark:text-gray-300">Visit <code>http://127.0.0.1:8000/products/</code> to see a clean HTML list of products rendered dynamically from the database.</p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Models represent your database structure</li>
                  <li>Views handle logic and response rendering</li>
                  <li>Clear separation of concerns via MVT architecture</li>
                  <li>Django’s ORM eliminates manual SQL writing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">🚀 Next Topic Preview</h3>
                <p className="text-gray-700 dark:text-gray-300">Connecting Django with MongoDB using Djongo / REST Framework — where we’ll replace the default SQLite with MongoDB for scalable, document-based storage.</p>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6 text-sm">
              <h2 className="text-base font-semibold">🧩 Topic 4: Connecting Django with MongoDB using Djongo / REST Framework</h2>
              <p className="text-gray-700 dark:text-gray-300">Replace the default SQLite database with MongoDB, wire up Django REST Framework, and expose clean JSON endpoints for your React frontend.</p>

              <div>
                <h3 className="text-base font-semibold">1) Why MongoDB for React apps?</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Stores data in JSON-like documents — natural fit for REST.</li>
                  <li>Flexible schema lets you evolve models easily.</li>
                  <li>Great for product catalogs, user profiles, and content feeds.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">2) Install & configure</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`pip install djangorestframework djongo pymongo

# backend/settings.py
INSTALLED_APPS += ['rest_framework', 'products']
DATABASES = {
  'default': {
    'ENGINE': 'djongo',
    'NAME': 'productdb',
  }
}`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">3) Model, Serializer, ViewSet</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# products/models.py
from djongo import models
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField(blank=True)

# products/serializers.py
from rest_framework import serializers
from .models import Product
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# products/views.py
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">4) URLs</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from products.views import ProductViewSet
router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
urlpatterns = [
  path('admin/', admin.site.urls),
  path('api/', include(router.urls)),
]`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">5) Run & test</h3>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py makemigrations && python manage.py migrate
python manage.py runserver
# Visit http://127.0.0.1:8000/api/products/`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">Outcome</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Django reads/writes documents in MongoDB via Djongo.</li>
                  <li>DRF exposes <code>/api/products/</code> as JSON endpoints.</li>
                  <li>React can fetch, render, and post product data.</li>
                </ul>
              </div>
            </div>
          );
        case 4:
          return <Module3Topic5Lesson />;
        case 5:
          return <Module3Topic6Lesson />;
        case 6:
          return <Module3Topic7Lesson />;
        case 7:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">🧭 Module 3 Overview: Backend Integration with Django & MongoDB</h2>

              <div>
                <h3 className="text-base font-semibold">Lesson</h3>
                <p className="text-gray-700 dark:text-gray-300">Frontend is only half the story. Every serious web application needs a backend to store, process, and serve data.</p>
                <p className="text-gray-700 dark:text-gray-300">In this module, students will learn to connect their React frontend with a Django + MongoDB backend, creating full-fledged, data-driven applications.</p>
                <p className="text-gray-700 dark:text-gray-300">By the end, they will not just display static products — they’ll store, fetch, and manage them dynamically from a real database.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">1. Why Django + MongoDB?</h3>
                <p className="text-gray-700 dark:text-gray-300">Django is a powerful Python-based backend framework known for its speed, security, and structure. MongoDB is a NoSQL database that stores data in flexible JSON-like documents — perfect for React apps that use JSON APIs.</p>
                <p className="text-gray-700 dark:text-gray-300">Together, they form a modern, scalable backend stack ideal for full‑stack developers.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">2. What You’ll Learn</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Set up Django as a backend server</li>
                  <li>Build REST APIs that send/receive JSON</li>
                  <li>Understand Models and Views</li>
                  <li>Connect Django with MongoDB (Djongo / DRF)</li>
                  <li>Integrate with React — fetch, display, post data</li>
                  <li>Implement authentication & environment management</li>
                  <li>Mini Project: Product Database API</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">3. Real‑World Use Case</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>The frontend (React) shows users the products.</li>
                  <li>The backend (Django) handles authentication and stores product info.</li>
                  <li>The database (MongoDB) keeps data efficient and retrieves it via API calls.</li>
                  <li>This module gives you the same end‑to‑end power.</li>
                </ul>
              </div>
            </div>
          );
        default:
          return <p className="text-gray-700 dark:text-gray-300">Select a topic to view content.</p>;
      }
    }

    // Existing Module 4 lessons (Full-stack & deployment)
    if (slug === 'module-4') {
      switch (currentTopic) {
        case 0:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">⚙️ Topic 1: Integrating Frontend (React) with Backend (Django API)</h2>
              <p className="text-gray-700 dark:text-gray-300">Full-stack development means your frontend (React) and backend (Django) communicate seamlessly — sending, receiving, and updating data via API endpoints.</p>
              <p className="text-gray-700 dark:text-gray-300">This lesson teaches how to connect React with Django REST Framework, handle CORS, and perform real-time CRUD operations through API calls.</p>

              <div>
                <h3 className="text-base font-semibold">🔗 How Frontend & Backend Communicate</h3>
                <p className="text-gray-700 dark:text-gray-300">React interacts with Django through HTTP requests — mainly using the <code>fetch()</code> or <code>axios</code> library.</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><strong>Frontend (React)</strong> — Sends API requests (GET, POST, PUT, DELETE).</li>
                  <li><strong>Backend (Django REST API)</strong> — Receives, processes, and responds with JSON.</li>
                  <li><strong>CORS Middleware</strong> — Ensures browsers allow communication between different origins (e.g., React on <code>localhost:3000</code> and Django on <code>localhost:8000</code>).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">⚙️ Setting Up Django for Integration</h3>
                <p className="text-gray-700 dark:text-gray-300">Install CORS Headers package:</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`pip install django-cors-headers`}</pre>

                <p className="text-gray-700 dark:text-gray-300">Add to <code>settings.py</code>:</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`INSTALLED_APPS = [
    'corsheaders',
    'rest_framework',
    'product_app',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]`}</pre>

                <p className="text-gray-700 dark:text-gray-300">Start Django server:</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`python manage.py runserver`}</pre>
              </div>

              <div>
                <h3 className="text-base font-semibold">⚛️ Setting Up React for API Communication</h3>
                <p className="text-gray-700 dark:text-gray-300">Inside <code>react_app/src</code>, install Axios:</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`npm install axios`}</pre>

                <p className="text-gray-700 dark:text-gray-300">Create a service file for API calls:</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`// api.js
import axios from 'axios';

const API = axios.create({ baseURL: "http://localhost:8000" });

export const getProducts = () => API.get("/products/");
export const addProduct = (data) => API.post("/products/", data);`}</pre>

                <p className="text-gray-700 dark:text-gray-300">Use this in your component:</p>
                <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`useEffect(() => {
  getProducts().then(res => setProducts(res.data));
}, []);`}</pre>

                <p className="text-gray-700 dark:text-gray-300">Now React and Django are fully connected, and you can fetch, post, and modify data directly.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">🧠 Best Practices</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Keep base URLs and tokens in environment variables.</li>
                  <li>Always handle API errors gracefully.</li>
                  <li>Use async/await for clean asynchronous code.</li>
                  <li>Validate backend responses before rendering.</li>
                </ul>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">🧩 Topic 2: Managing Authentication Tokens and Sessions</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Authentication separates public and private access in a full‑stack app. In modern Django + React
                applications, this is done with tokens (typically JSON Web Tokens — JWT). React uses these tokens to
                authenticate users when sending API requests, and Django verifies them server-side.
              </p>

              <div>
                <h3 className="text-lg font-semibold">This topic teaches how to:</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Generate JWT tokens on login</li>
                  <li>Store and manage tokens securely in React</li>
                  <li>Send authenticated requests to Django</li>
                  <li>Maintain sessions without re-login on page reload</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold">🔑 How Token Authentication Works</h3>
                <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>User logs in with username/password.</li>
                  <li>Django REST Framework validates credentials and returns a JWT token pair.</li>
                  <li>React stores the token pair in memory or <code>localStorage</code>.</li>
                  <li>Every subsequent request includes the access token in the <code>Authorization</code> header.</li>
                  <li>Django validates the token before serving the request.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold">⚙️ Setting Up JWT Authentication in Django</h3>
                <p className="text-gray-700 dark:text-gray-300">Install dependencies:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto"><code>pip install djangorestframework-simplejwt</code></pre>

                <p className="mt-3 text-gray-700 dark:text-gray-300">Add to <code>settings.py</code>:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto"><code>{`INSTALLED_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'product_app',
]

REST_FRAMEWORK = {
  'DEFAULT_AUTHENTICATION_CLASSES': (
    'rest_framework_simplejwt.authentication.JWTAuthentication',
  )
}`}</code></pre>

                <p className="mt-3 text-gray-700 dark:text-gray-300">Add JWT routes:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto"><code>{`# urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
  path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]`}</code></pre>

                <p className="mt-2 text-gray-700 dark:text-gray-300">Django now handles token generation and verification automatically.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">⚛️ Frontend: Managing Tokens in React</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>On login, call the <code>/api/token/</code> endpoint.</li>
                  <li>Store the <code>access</code> and <code>refresh</code> tokens in <code>localStorage</code>.</li>
                  <li>Attach the <code>Authorization: Bearer &lt;access&gt;</code> header for each API request.</li>
                  <li>Use refresh tokens to renew expired access tokens.</li>
                </ul>
                <p className="mt-2 text-gray-700 dark:text-gray-300">Example flow:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto"><code>{`axios.post('http://localhost:8000/api/token/', { username, password })
  .then(res => {
    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
  });`}</code></pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold">🧠 Security Best Practices</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Do not store tokens in cookies (CSRF risk); prefer headers.</li>
                  <li>Always use the <code>Authorization: Bearer &lt;token&gt;</code> header.</li>
                  <li>Auto-refresh tokens silently on <code>401</code> responses.</li>
                  <li>On logout, clear <code>localStorage</code> immediately.</li>
                </ul>
              </div>

              <div className="text-gray-700 dark:text-gray-300">
                ✅ Test Login → Verify Token → Access Protected Endpoints.
              </div>
            </div>
          );
        case 2:
          return <Module4Topic3Lesson />;
        case 3:
          return <Module4Topic4Lesson />;
        case 4:
          return <Module4Topic5Lesson />;
        case 5:
          return <Module4Topic6Lesson />;
        case 6:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">🧭 Module 4 Overview: Full‑Stack Application & Deployment</h2>
              <div>
                <h3 className="text-base font-semibold">Lesson</h3>
                <p className="text-gray-700 dark:text-gray-300">Welcome to Module 4 — the final stage where you bring together all your skills from frontend, backend, database, and AI integration into a complete, production‑ready web application.</p>
                <p className="text-gray-700 dark:text-gray-300">You’ll integrate a React frontend with a Django backend, manage authentication tokens and sessions, handle global state and protected routes, and secure communication with real APIs.</p>
                <p className="text-gray-700 dark:text-gray-300">Finally, you’ll deploy the app to cloud platforms like Vercel and Render (or AWS), linking services with environment variables — just like shipping a real‑world product.</p>
                <p className="text-gray-700 dark:text-gray-300">By the end, you’ll have built, secured, and deployed a functional E‑commerce Web Application that showcases everything from ES6+ JavaScript to Django REST APIs, MongoDB integration, and modern deployment practices.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Module Flow</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Integrate React Frontend with Django Backend via REST APIs.</li>
                  <li>Implement Authentication & Sessions using JWT.</li>
                  <li>Add State Management & Protected Routes with Context/Redux and Router.</li>
                  <li>Secure API Calls with CORS, env vars, and HTTPS.</li>
                  <li>Deploy Frontend (Vercel) and Backend (Render/AWS) with proper configs.</li>
                  <li>Launch the Final Capstone — E‑commerce Web Application.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">🚀 Key Learning Outcomes</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Master frontend‑backend integration for seamless UX.</li>
                  <li>Implement real‑world authentication with tokens and protected routes.</li>
                  <li>Understand secure API communication and environment management.</li>
                  <li>Deploy scalable full‑stack apps using CI/CD‑ready practices.</li>
                  <li>Deliver a portfolio‑ready project demonstrating full‑stack mastery.</li>
                </ul>
              </div>
            </div>
          );
        case 7:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">✅ Topic 8: AI Assistance — Accelerating Web Development with GPT & Claude</h2>
              <p className="text-gray-700 dark:text-gray-300">Artificial Intelligence is no longer just a tool — it’s a co‑developer.</p>
              <p className="text-gray-700 dark:text-gray-300">Use ChatGPT (OpenAI) and Claude (Anthropic) as your coding partners to dramatically accelerate full‑stack web development, especially during integration and deployment stages.</p>
              <p className="text-gray-700 dark:text-gray-300">You’ve built a Django backend, a React frontend, and connected them into a full‑stack system. Real‑world development includes repetitive tasks, deployment challenges, and configuration issues — AI can save hours of trial‑and‑error.</p>

              <div>
                <h3 className="text-base font-semibold">This lesson teaches you how to:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Generate boilerplate code for React, Django, and REST APIs instantly.</li>
                  <li>Debug integration errors using AI suggestions.</li>
                  <li>Automate deployment configuration (Vercel, Render, AWS).</li>
                  <li>Use prompt engineering to get high‑quality, context‑specific code.</li>
                  <li>Build AI‑augmented workflows to think, design, and execute faster.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Guiding Principle</h3>
                <p className="text-gray-700 dark:text-gray-300">Make your workflow 10× more efficient while maintaining human control and understanding. AI should be your assistant — you direct, it executes.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">🧩 Syntax — Example Prompts & Usage Techniques</h3>
                <p className="text-gray-700 dark:text-gray-300">Open the Syntax tab for detailed prompt templates. Highlights include Boilerplate Generation, Debugging Assistance, Deployment Configuration, and Prompt Engineering patterns.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">⚙️ Live Code: Workflow in Action</h3>
                <p className="text-gray-700 dark:text-gray-300">Use the Live tab to experiment with AI‑generated snippets, adapt them, and preview results — just like professional integration work.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold">🚀 AI in Practice — Best Tips</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Don’t copy blindly; understand and adapt the code.</li>
                  <li>Iterate quickly with short, precise prompts; refine step‑by‑step.</li>
                  <li>Never share secrets or tokens; keep environment variables private.</li>
                  <li>Ask the AI to explain decisions to learn effectively.</li>
                  <li>Combine tools — use GPT for logic and Claude for structure and clarity.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">🎯 Key Learning Outcomes</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Apply prompt engineering to get optimal, usable code.</li>
                  <li>Use AI for debugging, integration, and deployment in full‑stack projects.</li>
                  <li>Accelerate delivery without compromising understanding or code quality.</li>
                  <li>Develop AI‑augmented workflows that mirror professional practice.</li>
                </ul>
              </div>
            </div>
          );
        default:
          return <p className="text-gray-700 dark:text-gray-300">Select a topic to view content.</p>;
      }
    }

    return <p className="text-gray-700 dark:text-gray-300">Select a topic to view content.</p>;
  };

  const getSyntaxContent = () => {
  // Intro React — Topic 5: Important Commands & References
  if (slug === 'intro-react' && currentTopic === 4) {
    return (
      <div className="space-y-6">
        <h3 className="text-base font-semibold">🧩 Syntax Tab — Important Commands & References</h3>
        <div>
          <p className="font-medium">Check React version</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npm list react`}</code></pre>
        </div>
        <div>
          <p className="font-medium">Check React DOM version</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npm list react-dom`}</code></pre>
        </div>
        <div>
          <p className="font-medium">Install a package from npm</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npm install package-name`}</code></pre>
        </div>
        <div>
          <p className="font-medium">Open documentation (links)</p>
          <ul className="list-disc pl-5 text-blue-600">
            <li><a href="https://react.dev/reference/react" target="_blank" rel="noreferrer">React Hooks Syntax Link</a></li>
            <li><a href="https://nodejs.org/en/docs" target="_blank" rel="noreferrer">Node.js Docs Link</a></li>
          </ul>
        </div>
        <div>
          <p className="font-medium">Vite Create Command</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npm create vite@latest my-app --template react`}</code></pre>
        </div>
        <div>
          <p className="font-medium">CRA Create Command</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npx create-react-app my-app`}</code></pre>
        </div>
      </div>
    );
  }

  // Intro React — Topic 2: CRA & Vite Commands
  if (slug === 'intro-react' && currentTopic === 2) {
    return (
      <div className="space-y-6">
        <h3 className="text-base font-semibold">🧩 Syntax Tab — Commands for CRA & Vite</h3>

        <div>
          <p className="font-medium">🚀 Create React App Commands</p>
          <p className="text-gray-700">Create a project:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npx create-react-app my-app`}</code></pre>
          <p className="text-gray-700">Run the project:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`cd my-app\nnpm start`}</code></pre>
          <p className="text-gray-700">Build for production:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npm run build`}</code></pre>
        </div>

        <div>
          <p className="font-medium">⚡ Vite Commands</p>
          <p className="text-gray-700">Create a project:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npm create vite@latest my-app --template react`}</code></pre>
          <p className="text-gray-700">Install dependencies:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`cd my-app\nnpm install`}</code></pre>
          <p className="text-gray-700">Run the project:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npm run dev`}</code></pre>
          <p className="text-gray-700">Build for production:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`npm run build`}</code></pre>
        </div>
      </div>
    );
  }

  // Intro React — Topic 3: Common Project Structure Code Snippets
  if (slug === 'intro-react' && currentTopic === 3) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-semibold">🧩 Syntax Tab — Common Project Structure Code Snippets</h3>

        <div>
          <p className="font-medium">1. Rendering App Component</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.jsx';\n\nReactDOM.createRoot(document.getElementById('root')).render(<App />);`}</code></pre>
        </div>

        <div>
          <p className="font-medium">2. Basic App.jsx Structure</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`function App() {\n  return (\n    <div>\n      <h1>React Project Structure</h1>\n      <p>This shows the main App component.</p>\n    </div>\n  );\n}\n\nexport default App;`}</code></pre>
        </div>

        <div>
          <p className="font-medium">3. Example Component in /components/</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`// src/components/Header.jsx\nfunction Header() {\n  return <h2>This is the Header Component</h2>;\n}\n\nexport default Header;`}</code></pre>
        </div>

        <div>
          <p className="font-medium">4. Importing Component in App</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`import Header from "./components/Header";\n\nfunction App() {\n  return (\n    <>\n      <Header />\n      <p>Welcome to my React App!</p>\n    </>\n  );\n}\n\nexport default App;`}</code></pre>
        </div>

        <div>
          <p className="font-medium">5. Using Assets Folder</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`import logo from "./assets/react-logo.png";\n\nfunction App() {\n  return <img src={logo} alt="React Logo" />;\n}\n\nexport default App;`}</code></pre>
        </div>
      </div>
    );
  }

  // Intro React — Topic 1: Node.js Commands & Essential Syntax
  if (slug === 'intro-react' && currentTopic === 1) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">🧩 Syntax Tab — Commands & Essential Syntax</h2>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Check Node.js version</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>node -v</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Check npm version</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>npm -v</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Update npm (optional)</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>npm install -g npm</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Run a JavaScript file using Node</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>node filename.js</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Locate Node.js</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`where node    # Windows
which node    # macOS / Linux`}</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Check npm global packages</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>npm list -g --depth=0</code></pre>
        </div>
      </div>
    );
  }

  // Intro React — Topic 0: Basic React Syntax Concepts
  if (slug === 'intro-react' && currentTopic === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">🧩 Syntax Tab — Basic React Syntax Concepts</h2>
        <p className="text-gray-700">Core syntax pieces a beginner should know while learning React:</p>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">1. React Component</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`function Welcome() {
  return <h1>Hello React!</h1>;
}`}</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">2. JSX (JavaScript + HTML)</h3>
          <p className="text-gray-700">JSX allows writing HTML inside JavaScript.</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`const element = <h2>JSX looks like HTML!</h2>;`}</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">3. Rendering a Component</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);`}</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">4. Props (Passing Data)</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`function Greeting(props) {
  return <p>Hello {props.name}</p>;
}`}</code></pre>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">5. State (Dynamic Data)</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`}</code></pre>
        </div>
      </div>
    );
  }
  // Intro React — Topic 0: Basic React Syntax Concepts
  if (slug === 'intro-react' && currentTopic === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">🧩 Syntax Tab — Basic React Syntax Concepts</h2>
        <p className="text-gray-700">Core syntax pieces a beginner should know while learning React:</p>

        <div className="space-y-3">
          <h3 className="text-base font-semibold">1. React Component</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`function Welcome() {
  return <h1>Hello React!</h1>;
}`}</code></pre>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold">2. JSX (JavaScript + HTML)</h3>
          <p className="text-gray-700">JSX allows writing HTML inside JavaScript.</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`const element = <h2>JSX looks like HTML!</h2>;`}</code></pre>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold">3. Rendering a Component</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);`}</code></pre>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold">4. Props (Passing Data)</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`function Greeting(props) {
  return <p>Hello {props.name}</p>;
}`}</code></pre>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold">5. State (Dynamic Data)</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`}</code></pre>
        </div>
      </div>
    );
  }
    // Module 1 syntax samples
    if (slug === 'module-1' && currentTopic === 0) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Semantic HTML5 Syntax Reference</h3>
          <div>
            <h4 className="font-medium">1. Header</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<header>
  <h1>Website Title</h1>
  <p>Intro text or branding.</p>
</header>`}</pre>
          </div>
          <div>
            <h4 className="font-medium">2. Navigation</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<nav aria-label="Main navigation">
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>`}</pre>
          </div>
          <div>
            <h4 className="font-medium">3. Main Content</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<main>
  <article>
    <h2>Article Heading</h2>
    <p>Article content goes here.</p>
  </article>
</main>`}</pre>
          </div>
          <div>
            <h4 className="font-medium">4. Aside</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<aside>
  <h3>Related Links</h3>
  <ul>
    <li><a href="#">Resource 1</a></li>
  </ul>
</aside>`}</pre>
          </div>
          <div>
            <h4 className="font-medium">5. Footer</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<footer>
  <p>&copy; 2025 Your Name</p>
</footer>`}</pre>
          </div>
          <div>
            <h4 className="font-medium">Nesting Example</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<body>
  <header>Header content</header>
  <nav>Navigation links</nav>
  <main>
    <article>
      <h1>Post Title</h1>
      <section>Paragraphs and images go here.</section>
    </article>
    <aside>Sidebar content</aside>
  </main>
  <footer>Footer content</footer>
</body>`}</pre>
          </div>
        </div>
      );
    }
    if (slug === 'module-1' && currentTopic === 1) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Flexbox Syntax Reference</h3>
          <div>
            <h4 className="font-medium">Container Properties</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`display: flex;                /* activates flex mode */
flex-direction: row | column; /* main axis direction */
justify-content: center;      /* horizontal alignment */
align-items: center;          /* vertical alignment */
gap: 10px;                    /* spacing between items */
flex-wrap: wrap;              /* wraps items to next line */`}</pre>
          </div>
          <div>
            <h4 className="font-medium">Item Properties</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`flex: 1;                      /* flexible growth */
align-self: flex-end;         /* override alignment per item */
order: 2;                     /* change visual order */`}</pre>
          </div>

          <h3 className="font-semibold text-base">Grid Syntax Reference</h3>
          <div>
            <h4 className="font-medium">Container Properties</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`display: grid;                           /* activates grid mode */
grid-template-columns: repeat(3, 1fr);   /* 3 equal columns */
grid-template-rows: auto 1fr auto;       /* header, content, footer */
gap: 10px;                               /* spacing between cells */`}</pre>
          </div>
          <div>
            <h4 className="font-medium">Item Properties</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`grid-column: 1 / 3;     /* span columns 1 to 3 */
grid-row: 2;            /* place in row 2 */
grid-area: header;      /* use named area */`}</pre>
          </div>
          <div>
            <h4 className="font-medium">Grid Area Example</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`grid-template-areas:
  "header header"
  "sidebar main"
  "footer footer";`}</pre>
          </div>
          <div>
            <h4 className="font-medium">Responsive Tricks</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}`}</pre>
          </div>
        </div>
      );
    }
    if (slug === 'module-1' && currentTopic === 2) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Fetch API Syntax</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`fetch(url, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`}</pre>
          <h3 className="font-semibold text-base">Common HTTP Methods</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left p-2 border-b">Method</th>
                  <th className="text-left p-2 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b"><code>GET</code></td>
                  <td className="p-2 border-b">Retrieve data</td>
                </tr>
                <tr>
                  <td className="p-2 border-b"><code>POST</code></td>
                  <td className="p-2 border-b">Send new data</td>
                </tr>
                <tr>
                  <td className="p-2 border-b"><code>PUT</code></td>
                  <td className="p-2 border-b">Update data</td>
                </tr>
                <tr>
                  <td className="p-2 border-b"><code>DELETE</code></td>
                  <td className="p-2 border-b">Remove data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (slug === 'module-1' && currentTopic === 3) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Media Query Syntax</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`@media (max-width: 600px) { /* for phones */
  body { background: #fafafa; }
}
@media (min-width: 601px) and (max-width: 1024px) { /* for tablets */
  body { background: #f0f0f0; }
}`}</pre>

          <h3 className="font-semibold text-base">Fluid Image Syntax</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`img { max-width: 100%; height: auto; display: block; }`}</pre>

          <h3 className="font-semibold text-base">Responsive Grid Syntax</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}`}</pre>
        </div>
      );
    }
    if (slug === 'module-1' && currentTopic === 4) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Tailwind Example</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<div class="grid grid-cols-3 gap-4">
  <div class="bg-gray-200 p-4">1</div>
  <div class="bg-gray-200 p-4">2</div>
  <div class="bg-gray-200 p-4">3</div>
</div>`}</pre>

          <h3 className="font-semibold text-base">Bootstrap Example</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<div class="row">
  <div class="col-4 bg-light p-3">1</div>
  <div class="col-4 bg-light p-3">2</div>
  <div class="col-4 bg-light p-3">3</div>
</div>`}</pre>
        </div>
      );
    }
    if (slug === 'module-1' && currentTopic === 5) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">HTML5 Validation Attributes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left p-2 border-b">Attribute</th>
                  <th className="text-left p-2 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b"><code>required</code></td>
                  <td className="p-2 border-b">Field must be filled</td>
                </tr>
                <tr>
                  <td className="p-2 border-b"><code>minlength</code> / <code>maxlength</code></td>
                  <td className="p-2 border-b">Character limits</td>
                </tr>
                <tr>
                  <td className="p-2 border-b"><code>pattern</code></td>
                  <td className="p-2 border-b">Regex validation</td>
                </tr>
                <tr>
                  <td className="p-2 border-b"><code>type="email"</code></td>
                  <td className="p-2 border-b">Built-in email validation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-base">CSS Validation Styles</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`input:invalid { border: 2px solid red; }
input:valid { border: 2px solid green; }`}</pre>
        </div>
      );
    }
    if (slug === 'module-1' && currentTopic === 6) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Folder Structure Recap</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`frontend-course/
│
├── module1/
│   ├── topic1_semantic_html/
│   ├── topic2_grid_flexbox/
│   ├── topic3_fetch_api/
│   ├── topic4_responsive_ui/
│   ├── topic5_frameworks/
│   ├── topic6_forms_validation/
│   └── mini_project_portfolio/
│
└── assets/
    ├── images/
    ├── css/
    └── js/`}</pre>
        </div>
      );
    }

    if (slug === 'module-1' && currentTopic === 7) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Writing Smart AI Prompts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left p-2 border-b">Goal</th>
                  <th className="text-left p-2 border-b">Example Prompt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b">Generate code</td>
                  <td className="p-2 border-b">“Write semantic HTML5 and CSS for a responsive blog layout with a sidebar and footer.”</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">Debug errors</td>
                  <td className="p-2 border-b">“My JavaScript Fetch API isn’t returning JSON data. Suggest possible fixes.”</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">Explain code</td>
                  <td className="p-2 border-b">“Explain how Flexbox properties justify-content and align-items work with code examples.”</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">Optimize performance</td>
                  <td className="p-2 border-b">“Improve this CSS grid layout for faster rendering on mobile devices.”</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">Create variations</td>
                  <td className="p-2 border-b">“Generate three variations of a responsive navigation bar using Tailwind CSS.”</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">Learn conceptually</td>
                  <td className="p-2 border-b">“Explain how semantic HTML improves accessibility and SEO with examples.”</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-700 dark:text-gray-300"><strong>Tip:</strong> Start prompts with action words — Create, Build, Explain, Debug, Improve, Optimize.</p>
        </div>
      );
    }

    // Module 2 syntax samples
    if (slug === 'module-2' && currentTopic === 1) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">DOM Manipulation & Events</h3>

          <div>
            <h4 className="font-medium">Task → Syntax → Example</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="text-left p-2 border-b">Task</th>
                    <th className="text-left p-2 border-b">Syntax</th>
                    <th className="text-left p-2 border-b">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b">Select element</td>
                    <td className="p-2 border-b"><code>document.querySelector(".btn")</code></td>
                    <td className="p-2 border-b">—</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Change text</td>
                    <td className="p-2 border-b"><code>element.textContent = "Hello!"</code></td>
                    <td className="p-2 border-b">—</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Change style</td>
                    <td className="p-2 border-b"><code>element.style.color = "red"</code></td>
                    <td className="p-2 border-b">—</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Add event</td>
                    <td className="p-2 border-b"><code>element.addEventListener("click", fn)</code></td>
                    <td className="p-2 border-b">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-medium">Event Listener Example</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`const button = document.getElementById("btn");
button.addEventListener("click", () => {
  alert("Button clicked!");
});`}</pre>
          </div>
        </div>
      );
    }
    if (slug === 'module-2' && currentTopic === 2) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Fetch API & JSON — Syntax</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left p-2 border-b">Operation</th>
                  <th className="text-left p-2 border-b">Syntax</th>
                  <th className="text-left p-2 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b">GET Request</td>
                  <td className="p-2 border-b"><code>fetch(url)</code></td>
                  <td className="p-2 border-b">Retrieves data</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">POST Request</td>
                  <td className="p-2 border-b"><code>fetch(url, {'{'} method: 'POST', body, headers {'}'})</code></td>
                  <td className="p-2 border-b">Sends data</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">Parse JSON</td>
                  <td className="p-2 border-b"><code>response.json()</code></td>
                  <td className="p-2 border-b">Converts to JS object</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">Handle Error</td>
                  <td className="p-2 border-b"><code>.catch(err =&gt; …)</code></td>
                  <td className="p-2 border-b">Catches network errors</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="font-medium">Example</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`}</pre>
          </div>
        </div>
      );
    }
    if (slug === 'module-2' && currentTopic === 2) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Fetch Basics</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`// fetch(url, options) returns a Response
const res = await fetch('https://api.example.com/items');
if (!res.ok) throw new Error('HTTP ' + res.status);
const data = await res.json(); // parse JSON`}</pre>
          <h3 className="font-semibold text-base">GET Example (async/await)</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`async function get(){
  const res = await fetch('https://fakestoreapi.com/products?limit=5');
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  console.log(data);
}`}</pre>
          <h3 className="font-semibold text-base">POST JSON</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`await fetch('https://jsonplaceholder.typicode.com/posts',{
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId: 1, qty: 2 })
})`}</pre>
          <h3 className="font-semibold text-base">Error Handling</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`try { /* await fetch(...) */ } catch (err) { console.error(err); }`}</pre>
          <h3 className="font-semibold text-base">Response Helpers</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`res.ok // boolean
res.status // HTTP code
res.headers.get('content-type')`}</pre>
        </div>
      );
    }
    if (slug === 'module-2' && currentTopic === 3) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">React.js — Syntax Reference</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="font-semibold p-2 border-b">Concept</th>
                <th className="font-semibold p-2 border-b">Syntax</th>
                <th className="font-semibold p-2 border-b">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b">Create Component</td>
                <td className="p-2 border-b"><code>function Comp() {'{'} return &lt;div&gt;...&lt;/div&gt;; {'}'}</code></td>
                <td className="p-2 border-b">—</td>
              </tr>
              <tr>
                <td className="p-2 border-b">Use Props</td>
                <td className="p-2 border-b"><code>&lt;Comp name=&quot;Alex&quot; /&gt;</code></td>
                <td className="p-2 border-b">—</td>
              </tr>
              <tr>
                <td className="p-2 border-b">JSX Expression</td>
                <td className="p-2 border-b"><code>{'{'} variable {'}'}</code></td>
                <td className="p-2 border-b"><code>&lt;h1&gt;{'{'}title{'}'}&lt;/h1&gt;</code></td>
              </tr>
              <tr>
                <td className="p-2 border-b">Render</td>
                <td className="p-2 border-b"><code>ReactDOM.render(&lt;App /&gt;, root)</code></td>
                <td className="p-2 border-b">—</td>
              </tr>
            </tbody>
          </table>

          <div>
            <h4 className="font-medium">Example</h4>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`const root = ReactDOM.createRoot(document.getElementById('root'));

function Welcome(props) {
  return <h1>Hello, {props.name}! 👋</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Student" />
      <Welcome name="Developer" />
      <Welcome name="Learner" />
    </div>
  );
}

root.render(<App />);`}</pre>
          </div>
        </div>
      );
    }
    if (slug === 'module-2' && currentTopic === 4) {
      return (
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`// Functional Component with Props and State
import React, { useState } from 'react';

function Greeting({ name }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
    </div>
  );
}

export default Greeting;`}</pre>
      );
    }
    if (slug === 'module-2' && currentTopic === 5) {
      return (
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const { useState, useEffect } = React;
function Products(){
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=3')
      .then(res => res.json())
      .then(setProducts);
  }, []);
}`}</pre>
      );
    }
    if (slug === 'module-2' && currentTopic === 6) {
      return (
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`function App(){
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=6')
      .then(res => res.json())
      .then(setProducts);
  }, []);
}`}</pre>
      );
    }
    if (slug === 'module-2' && currentTopic === 7) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Module Starter Example</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`}</pre>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`// App.js
import React from 'react';

function App() {
  return (
    <div>
      <h1>Welcome to JavaScript & React Essentials</h1>
      <p>Let\u2019s start building interactive web applications!</p>
    </div>
  );
}

export default App;`}</pre>

          <h3 className="font-semibold text-base">What\u2019s Happening Here</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li><code>ReactDOM.createRoot()</code> mounts your React app into the HTML.</li>
            <li><code>&lt;App /&gt;</code> is your root component.</li>
            <li>From here, add components, props, state, and hooks.</li>
          </ul>

          <h3 className="font-semibold text-base">Live Preview Output</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`🚀 JavaScript & React.js Essentials
Welcome to Module 2 of your Frontend Developer journey!
You\u2019ll learn how to make your web pages interactive, dynamic, and alive.`}</pre>

          <h3 className="font-semibold text-base">File Explorer Structure</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`/src
├── index.js
├── App.js
└── components/`}</pre>
        </div>
      );
    }
    if (slug === 'module-2' && currentTopic === 8) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">AI Assistance — Example Prompts and Outputs</h3>

          <h4 className="font-medium mt-2">Prompt</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`"Create a React component that fetches products from an API and displays them using CSS Grid."`}</pre>

          <h4 className="font-medium">Output: ProductGrid Component</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`import React, { useEffect, useState } from 'react';

function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {products.map(product => (
        <div key={product.id} className="p-4 border rounded-lg shadow">
          <img src={product.image} alt={product.title} className="h-40 mx-auto" />
          <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
          <p className="text-gray-600">{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;`}</pre>

          <h4 className="font-medium">What AI Did Here</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Generated a complete React component with state, <code>useEffect</code>, and fetch logic.</li>
            <li>Used Tailwind-like utility classes for styling.</li>
            <li>Created a responsive grid layout.</li>
          </ul>
        </div>
      );
    }
    // Module 3 syntax samples — Topic 1 (Setting up Django as Backend Server)
    if (slug === 'module-3' && currentTopic === 0) {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">🧩 Setting up Django as Backend Server</h2>
          <p className="text-gray-700 dark:text-gray-300">Django is a high‑level Python web framework that helps you build secure, scalable backends fast. In this lesson, you’ll create a new Django project and an app that serves a simple response — the foundation for building APIs for your React frontend.</p>

          <div>
            <h3 className="text-base font-semibold">Prerequisites</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Python 3.10+ installed (<code>python --version</code>)</li>
              <li>pip available (<code>pip --version</code>)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold">1) Create and activate a virtual environment</h3>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python -m venv env

# Windows
env\\Scripts\\activate

# macOS/Linux
source env/bin/activate`}</pre>
          </div>

          <div>
            <h3 className="text-base font-semibold">2) Install Django</h3>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`pip install django

django-admin --version`}</pre>
          </div>

          <div>
            <h3 className="text-base font-semibold">3) Create a new project</h3>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# Create project named "backend"
django-admin startproject backend`}</pre>
            <p className="text-gray-700 dark:text-gray-300">Initial structure:</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`backend/
├── manage.py
└── backend/
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── wsgi.py`}</pre>
          </div>

          <div>
            <h3 className="text-base font-semibold">4) Run the dev server</h3>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`cd backend
python manage.py runserver`}</pre>
            <p className="text-gray-700 dark:text-gray-300">Visit <code>http://127.0.0.1:8000/</code> to see the Django welcome page.</p>
          </div>

          <div>
            <h3 className="text-base font-semibold">5) Create an app</h3>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py startapp products`}</pre>
            <p className="text-gray-700 dark:text-gray-300">Add it to <code>backend/settings.py</code>:</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'products',
]`}</pre>
          </div>

          <div>
            <h3 className="text-base font-semibold">6) Create a simple view and route</h3>
            <p className="text-gray-700 dark:text-gray-300">products/views.py</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello from Django Backend!")`}</pre>
            <p className="text-gray-700 dark:text-gray-300">backend/urls.py</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.contrib import admin
from django.urls import path
from products.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
]`}</pre>
          </div>

          <div>
            <h3 className="text-base font-semibold">Folder structure recap</h3>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`/backend
│
├── manage.py
├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
└── products/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── views.py
    └── tests.py`}</pre>
          </div>

          <div>
            <h3 className="text-base font-semibold">Next steps</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Connect Django to MongoDB (Djongo/DRF).</li>
              <li>Create REST endpoints for products and test with fetch.</li>
            </ul>
          </div>
        </div>
      );
    }
    // Module 3 syntax samples — Topic 2 (Building REST APIs for Frontend Consumption)
    if (slug === 'module-3' && currentTopic === 1) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Install Django REST Framework</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`pip install djangorestframework`}</pre>

          <h3 className="font-semibold text-base">Add to INSTALLED_APPS</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`INSTALLED_APPS = [
    ...
    'rest_framework',
    'products',
]`}</pre>

          <h3 className="font-semibold text-base">Define Product model (products/models.py)</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name`}</pre>

          <h3 className="font-semibold text-base">Create serializer (products/serializers.py)</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`}</pre>

          <h3 className="font-semibold text-base">Create API view (products/views.py)</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)`}</pre>

          <h3 className="font-semibold text-base">Define route (backend/urls.py)</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.contrib import admin
from django.urls import path
from products.views import get_products

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', get_products),
]`}</pre>

          <h3 className="font-semibold text-base">Run & test</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py makemigrations
python manage.py migrate
python manage.py runserver

# Visit http://127.0.0.1:8000/api/products/`}</pre>

          <h3 className="font-semibold text-base">Sample JSON output</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`[
  {
    "id": 1,
    "name": "iPhone 16",
    "price": "799.99",
    "description": "Latest model with AI features"
  }
]`}</pre>
        </div>
      );
    }
    // Module 3 syntax samples — Topic 3 (Django Models and Views)
    if (slug === 'module-3' && currentTopic === 2) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Django Models and Views — Syntax</h3>

          <h4 className="font-medium">products/models.py</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=8, decimal_places=2)
`}</pre>

          <h4 className="font-medium">products/views.py</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.shortcuts import render
from .models import Product


def product_list(request):
    products = Product.objects.all()
    return render(request, 'products.html', {'products': products})
`}</pre>

          <h4 className="font-medium">backend/urls.py</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.urls import path
from products.views import product_list

urlpatterns = [
    path('products/', product_list),
]
`}</pre>

          <h4 className="font-medium">templates/products.html</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<!DOCTYPE html>
<html lang="en">
<head>
  <title>Product List</title>
</head>
<body>
  <h1>Available Products</h1>
  <ul>
    {% for product in products %}
      <li>{{ product.name }} - ₹{{ product.price }}</li>
    {% endfor %}
  </ul>
</body>
</html>
`}</pre>

          <h4 className="font-medium">File Structure</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`/backend

backend/
  urls.py
products/
  models.py
  views.py
  templates/
    products.html
manage.py
`}</pre>

          <h4 className="font-medium">Run & seed</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py makemigrations
python manage.py migrate
python manage.py shell

from products.models import Product
Product.objects.create(name="MacBook Air", category="Laptop", price=1199.99)

python manage.py runserver

# Visit http://127.0.0.1:8000/products/
`}</pre>
        </div>
      );
    }
    // Module 3 syntax samples — Topic 4 (Connecting Django with MongoDB using Djongo / REST Framework)
    if (slug === 'module-3' && currentTopic === 3) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Connect Django to MongoDB with Djongo + DRF</h3>

          <h4 className="font-medium">Install packages</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`pip install django djangorestframework djongo pymongo`}</pre>

          <h4 className="font-medium">backend/settings.py — DATABASES</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'products',
]

DATABASES = {
  'default': {
    'ENGINE': 'djongo',
    'NAME': 'productdb',
    # Optional auth settings if using MongoDB Atlas
    # 'CLIENT': {
    #   'host': 'mongodb+srv://<user>:<pass>@cluster.mongodb.net',
    # }
  }
}`}</pre>

          <h4 className="font-medium">products/models.py</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from djongo import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)

    def __str__(self):
        return self.name`}</pre>

          <h4 className="font-medium">products/serializers.py</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`}</pre>

          <h4 className="font-medium">products/views.py — DRF ViewSet</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`}</pre>

          <h4 className="font-medium">backend/urls.py — Router</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from products.views import ProductViewSet

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
  path('admin/', admin.site.urls),
  path('api/', include(router.urls)),
]`}</pre>

          <h4 className="font-medium">Migrate & run</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`python manage.py makemigrations
python manage.py migrate
python manage.py runserver

# Test: http://127.0.0.1:8000/api/products/`}</pre>

          <h4 className="font-medium">Folder Structure</h4>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`/backend
backend/
  settings.py
  urls.py
products/
  models.py
  serializers.py
  views.py
manage.py`}</pre>
        </div>
      );
    }
    // Module 3 syntax samples — Topic 5 (Fetching and Posting Data from React to Django)
    if (slug === 'module-3' && currentTopic === 4) {
      return <Module3Topic5Syntax />;
    }
    // Module 3 syntax samples — Topic 6 (Authentication & environment variable management)
    if (slug === 'module-3' && currentTopic === 5) {
      return <Module3Topic6Syntax />;
    }
    // Module 3 syntax samples — Topic 7 (Mini Project — Product Database API)
    if (slug === 'module-3' && currentTopic === 6) {
      return <Module3Topic7Syntax />;
    }
    // Module 3 syntax samples — Topic 9 (AI Assistance — GPT & Claude)
    if (slug === 'module-3' && currentTopic === 8) {
      return <Module3Topic9Syntax />;
    }
    // Module 3 syntax samples — Topic 8 (Overview: Django + MongoDB + React)
    if (slug === 'module-3' && currentTopic === 7) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Step 1: Setting up Django Project</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# Install Django and Djongo
pip install django djangorestframework djongo pymongo

# Create a new Django project
django-admin startproject backend

# Move into project directory
cd backend

# Start a new app
python manage.py startapp products

# Run the development server
python manage.py runserver`}</pre>

          <h3 className="font-semibold text-base">Step 2: Configure MongoDB Connection</h3>
          <p className="text-gray-700 dark:text-gray-300">backend/settings.py</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'productdb',
    }
}`}</pre>

          <h3 className="font-semibold text-base">Step 3: Define a Product Model</h3>
          <p className="text-gray-700 dark:text-gray-300">products/models.py</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from djongo import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField()
    image = models.URLField()

    def __str__(self):
        return self.name`}</pre>

          <h3 className="font-semibold text-base">Step 4: Create REST API Endpoints</h3>
          <p className="text-gray-700 dark:text-gray-300">products/views.py</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`}</pre>

          <p className="text-gray-700 dark:text-gray-300">products/serializers.py</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`}</pre>

          <p className="text-gray-700 dark:text-gray-300">backend/urls.py</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from products.views import ProductViewSet

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]`}</pre>

          <div>
            <p className="text-gray-700 dark:text-gray-300">Now your REST API endpoints are live at</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`http://localhost:8000/api/products/`}</pre>
          </div>

          <h3 className="font-semibold text-base">Step 5: Fetch Data from React</h3>
          <p className="text-gray-700 dark:text-gray-300">App.js</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛍️ Product Database (React + Django + MongoDB)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px' }} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;`}</pre>
        </div>
      );
    }

    // Module 4 syntax samples — Topic 1 (React ↔ Django API)
    if (slug === 'module-4' && currentTopic === 0) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Django Backend Endpoint</h3>
          <p className="text-gray-700 dark:text-gray-300">product_app/views.py</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`}</pre>

          <h3 className="font-semibold text-base">React Frontend Integration</h3>
          <p className="text-gray-700 dark:text-gray-300">App.js</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`import React, { useEffect, useState } from "react";
import { getProducts } from "./api";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="p-4">
      <h1>Product List</h1>
      {products.map(p => (
        <div key={p.id}>{p.name} - $${'{'}p.price{'}'}</div>
      ))}
    </div>
  );
}

export default App;`}</pre>

          <h3 className="font-semibold text-base">api.js</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:8000" });

export const getProducts = () => API.get("/products/");
export const addProduct = (data) => API.post("/products/", data);`}</pre>
        </div>
      );
    }

    // Module 4 syntax samples — Topic 2 (Managing Authentication Tokens and Sessions)
    if (slug === 'module-4' && currentTopic === 1) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Backend — JWT Setup</h3>
          <p className="text-gray-700 dark:text-gray-300">backend/settings.py</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}`}</pre>

          <h3 className="font-semibold text-base">Django URLs</h3>
          <p className="text-gray-700 dark:text-gray-300">backend/urls.py</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]`}</pre>

          <h3 className="font-semibold text-base">Frontend — Login.js</h3>
          <p className="text-gray-700 dark:text-gray-300">frontend/src/Login.js</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`import axios from "axios";
import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      alert("Login successful!");
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="p-4">
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;`}</pre>

          <h3 className="font-semibold text-base">React API Integration</h3>
          <p className="text-gray-700 dark:text-gray-300">frontend/src/api.js</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

API.interceptors.request.use(config => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default API;`}</pre>
        </div>
      );
    }

    // Module 4 syntax samples — Topic 3 (State management & Protected Routes)
    if (slug === 'module-4' && currentTopic === 2) {
      return <Module4Topic3Syntax />;
    }
    // Module 4 syntax samples — Topic 4 (Securing API calls)
    if (slug === 'module-4' && currentTopic === 3) {
      return <Module4Topic4Syntax />;
    }
    // Module 4 syntax samples — Topic 5 (Deploying Full-Stack Apps)
    if (slug === 'module-4' && currentTopic === 4) {
      return <Module4Topic5Syntax />;
    }
    // Module 4 syntax samples — Topic 6 (Final Capstone Project)
    if (slug === 'module-4' && currentTopic === 5) {
      return <Module4Topic6Syntax />;
    }
    // Module 4 syntax samples — Topic 7 (Module Overview)
    if (slug === 'module-4' && currentTopic === 6) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Syntax & Core Concepts</h3>

          <div>
            <h4 className="font-medium">1) Frontend ↔ Backend Integration</h4>
            <p className="text-gray-700 dark:text-gray-300">React fetching data from Django API</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`useEffect(() => {
  fetch("https://api.myecommerceapp.com/products/")
    .then((res) => res.json())
    .then((data) => setProducts(data));
}, []);`}</pre>
          </div>

          <div>
            <h4 className="font-medium">2) Authentication with Tokens</h4>
            <p className="text-gray-700 dark:text-gray-300">Django REST — JWT authentication routes</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]`}</pre>
          </div>

          <div>
            <h4 className="font-medium">3) State Management</h4>
            <p className="text-gray-700 dark:text-gray-300">Global state with Context API</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};`}</pre>
          </div>

          <div>
            <h4 className="font-medium">4) Protected Routes</h4>
            <p className="text-gray-700 dark:text-gray-300">React route guard</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};`}</pre>
          </div>

          <div>
            <h4 className="font-medium">5) Deployment Setup</h4>
            <p className="text-gray-700 dark:text-gray-300">Build and deploy commands</p>
            <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# Frontend (Vercel)
npm run build
vercel --prod

# Backend (Render)
git push render main`}</pre>
          </div>
        </div>
      );
    }

    // Module 4 syntax samples — Topic 8 (AI Assistance)
    if (slug === 'module-4' && currentTopic === 7) {
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">Boilerplate Generation — Prompt</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`Generate a Django REST API with JWT authentication for user login and product listing.
Use Django REST Framework and connect it to MongoDB via Djongo.
Include example serializers and views.`}</pre>

          <h3 className="font-semibold text-base">Debugging Assistance — Prompt</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`My Django API returns a 403 Forbidden error when accessed from React on localhost:3000.
Explain possible CORS issues and show the correct settings for CORS_ALLOWED_ORIGINS.`}</pre>

          <p className="text-gray-700 dark:text-gray-300">Add to settings.py:</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`CORS_ALLOWED_ORIGINS = [
  "http://localhost:3000",
]`}</pre>

          <h3 className="font-semibold text-base">Deployment Configuration — Prompt</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`Help me write a Render YAML deployment file for my Django app that uses environment variables for SECRET_KEY and DATABASE_URL.`}</pre>
          <p className="text-gray-700 dark:text-gray-300">Example render.yaml:</p>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`services:
  - type: web
    name: django-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn backend.wsgi"
    envVars:
      - key: SECRET_KEY
        sync: false
      - key: DATABASE_URL
        sync: false`}</pre>

          <h3 className="font-semibold text-base">Prompt Engineering — 4‑Part Structure</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li><strong>Context</strong> — Describe what the project or module is doing.</li>
            <li><strong>Goal</strong> — Explain what you want to achieve.</li>
            <li><strong>Tech Stack</strong> — List tools/languages (React, Django, MongoDB, etc.).</li>
            <li><strong>Constraints</strong> — Define what to avoid or format to return.</li>
          </ul>

          <h3 className="font-semibold text-base">Example Prompt</h3>
          <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`I’m building a Django + React full‑stack app.
Generate React code for a product listing page that fetches products from /api/products/ and displays them in cards.
Use TailwindCSS and ensure it’s responsive. Only show me the React component code.`}</pre>
        </div>
      );
    }

    return <p className="text-gray-700 dark:text-gray-300">No syntax for this topic yet.</p>;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-transparent text-gray-900">
      <section className="w-full max-w-none mx-auto px-0 md:px-0 pt-16 pb-16">
        <div className="flex items-center justify-between mb-6 px-4 md:px-6">
          <button
            onClick={() => navigate('/student-portal')}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
          >
            Back to Portal
          </button>
          <button
            disabled={isLastModule}
            onClick={() => navigate(`/frontend-development-intermediate/module/${nextSlug}`)}
            className={`px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 ${
              isLastModule ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            Next Module
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <aside className="md:sticky md:top-6 self-start border-y border-r border-gray-200 rounded-none bg-white p-4 md:pl-4">
            <h3 className="text-sm font-semibold mb-3">{title} — Topics</h3>
            <nav aria-label="Module topics">
              <ul className="space-y-2">
                {(moduleTopics[slug] || []).map((t, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setCurrentTopic(i)}
                      className={`w-full text-left text-sm px-3 py-2 rounded transition ${
                        currentTopic === i
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}. {t}
                      {typeof t === 'string' && t.includes('AI Assistance') && (
                        <span className="ml-2 inline-block rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs">New</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            <p className="mt-3 text-gray-700">Each tab has clear explanations and topic-wise code examples.</p>

            <div className="mt-8">
              <div className="flex gap-2 border-b border-gray-200">
                {[
                  { id: 'lesson', label: 'Lesson' },
                  { id: 'syntax', label: 'Syntax' },
                  { id: 'live', label: 'Live Code' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-4 py-2 rounded-t-lg border border-b-0 transition text-sm md:text-base ${
                      tab === t.id
                        ? 'bg-white border-gray-200 font-semibold'
                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="border border-gray-200 rounded-b-lg p-6 bg-white shadow-sm">
                {tab === 'lesson' && getLessonContent()}
                {tab === 'syntax' && getSyntaxContent()}
                {tab === 'live' && (
                  <div className="grid grid-cols-1 xl:grid-cols-[200px_1.2fr_1fr] lg:grid-cols-[200px_1fr] gap-6">
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <h3 className="text-sm font-semibold mb-2">Files</h3>
                      <ul className="text-sm space-y-1">
                        {Object.keys(files).map((path) => (
                          <li key={path}>
                            <button
                              className={`w-full text-left px-2 py-1 rounded ${selectedFile===path?'bg-white':''}`}
                              onClick={() => setSelectedFile(path)}
                            >
                              {path}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <label className="text-sm font-semibold">Editing: {selectedFile}</label>
                      <textarea
                        value={files[selectedFile]}
                        onChange={(e) => setFiles(prev => ({ ...prev, [selectedFile]: e.target.value }))}
                        className="mt-2 w-full h-[500px] rounded border border-gray-300 bg-white p-3 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2">Preview</h3>
                      <iframe
                        title="Live preview"
                        sandbox="allow-scripts allow-same-origin"
                        srcDoc={srcDoc}
                        className="w-full h-[700px] rounded border border-gray-300 bg-white"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
