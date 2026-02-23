import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { askLLM, ChatMessage } from '../services/llm';
import {
  Paperclip,
  Mic,
  Send,
  BookOpen,
  FileText,
  Search,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  PlayCircle,
  Terminal,
  Code,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Menu,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

interface Lesson {
  title: string;
  content: string;
  duration?: string;
  syntax?: { title: string; content: string }[];
  terminalCommands?: string[];
  liveCode?: string;
   liveCodeExplanation?: string;
  liveCodeIsJsSnippet?: boolean;
  language?: 'html' | 'python' | 'java';
}

interface Module {
  id: string;
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
}

interface SidebarProps {
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  completedLessons: Set<string>;
}

const intermediateStructure: {
  id: string;
  title: string;
  duration: string;
  description: string;
  topics: string[];
}[] = [
  {
    id: 'module-1',
    title: 'Module 1: Advanced JavaScript for Professional Development',
    duration: '90 min',
    description: 'Deepen your understanding of how JavaScript really works under the hood.',
    topics: [
      '1.1 Execution Context and Call Stack',
      '1.2 Closures and Lexical Scope',
      '1.3 Higher-Order Functions and Functional Programming',
      '1.4 Event Loop, Microtasks, and Macrotasks',
      '1.5 Promises and Async/Await Deep Dive',
      '1.6 ES6+ Advanced Features (Destructuring, Spread, Rest)',
      '1.7 JavaScript Modules (Import and Export)',
      '1.8 Error Handling and Debugging',
      '1.9 Memory Management and Performance Basics'
    ]
  },
  {
    id: 'module-2',
    title: 'Module 2: Git, GitHub, and Professional Workflow',
    duration: '80 min',
    description: 'Use Git and GitHub like a professional in real team environments.',
    topics: [
      '2.1 Git Architecture and Version Control Concepts',
      '2.2 Repository Initialization and Commit Workflow',
      '2.3 Branching Strategy and Branch Management',
      '2.4 Merging and Resolving Merge Conflicts',
      '2.5 GitHub Repository Management',
      '2.6 Pull Requests and Code Review Workflow',
      '2.7 Collaboration and Team Workflow',
      '2.8 Managing Releases and Versioning',
      '2.9 Debugging and Recovering from Git Errors'
    ]
  },
  {
    id: 'module-3',
    title: 'Module 3: Advanced CSS and Modern UI Engineering',
    duration: '90 min',
    description: 'Build production-ready layouts and animations with modern CSS.',
    topics: [
      '3.1 CSS Flexbox Complete Layout Control',
      '3.2 CSS Grid Complete Layout System',
      '3.3 Responsive Design Professional Techniques',
      '3.4 CSS Architecture and Maintainable Styling',
      '3.5 SCSS for Scalable Styling',
      '3.6 Writing Professional README Files',
      '3.7 CSS Animations and Transitions',
      '3.8 Responsive Web Design (Media Queries)',
      '3.9 CSS Performance Optimization'
    ]
  },
  {
    id: 'module-4',
    title: 'Module 4: React Fundamentals (Core Foundation)',
    duration: '90 min',
    description: 'Learn the core React concepts every frontend engineer must master.',
    topics: [
      '4.1 React Architecture and Virtual DOM',
      '4.2 Project Setup using Vite',
      '4.3 JSX and Rendering Logic',
      '4.4 Functional Components and Component Design',
      '4.5 Props and Component Communication',
      '4.6 State Management using useState',
      '4.7 Event Handling in React',
      '4.8 Conditional Rendering and Lists',
      '4.9 Component Lifecycle and useEffect'
    ]
  },
  {
    id: 'module-5',
    title: 'Module 5: Advanced React and Scalable Architecture',
    duration: '90 min',
    description: 'Design scalable React apps with reusable patterns and performance best practices.',
    topics: [
      '5.1 Component Reusability and Composition',
      '5.2 Custom Hooks for Logic Reuse',
      '5.3 useRef and DOM Interaction',
      '5.4 Context API for Global State Management',
      '5.5 React Router for Navigation',
      '5.6 API Integration using Fetch and Axios',
      '5.7 Performance Optimization (memo, useMemo, useCallback)',
      '5.8 Form Handling and Controlled Components',
      '5.9 Professional React Project Structure'
    ]
  },
  {
    id: 'module-6',
    title: 'Module 6: Angular Framework (Enterprise Frontend Development)',
    duration: '90 min',
    description: 'Get comfortable with Angular fundamentals and how it fits into enterprise apps.',
    topics: [
      '6.1 Angular Architecture and Ecosystem',
      '6.2 Angular Project Setup and CLI',
      '6.3 Angular Components and Templates',
      '6.4 Data Binding and Directives',
      '6.5 Services and Dependency Injection',
      '6.6 Angular Routing and Navigation',
      '6.7 HTTP Client and API Integration',
      '6.8 State and Component Communication',
      '6.9 Angular Application Structure'
    ]
  },
  {
    id: 'module-7',
    title: 'Module 7: Backend Integration with Node.js and Express',
    duration: '80 min',
    description: 'Connect your frontend to real Node.js and Express backends.',
    topics: [
      '7.1 Node.js Runtime and Architecture',
      '7.2 Express.js Server Development',
      '7.3 REST API Architecture and Design',
      '7.4 Handling HTTP Requests and Responses',
      '7.5 Middleware and Request Processing',
      '7.6 Connecting Frontend with Backend APIs',
      '7.7 Error Handling and Debugging APIs',
      '7.8 Environment Variables and Configuration',
      '7.9 Backend Project Structure'
    ]
  },
  {
    id: 'module-8',
    title: 'Module 8: Database Integration using MongoDB',
    duration: '80 min',
    description: 'Use MongoDB effectively in modern JavaScript applications.',
    topics: [
      '8.1 MongoDB Architecture and NoSQL Concepts',
      '8.2 MongoDB Installation and Setup',
      '8.3 CRUD Operations in MongoDB',
      '8.4 Schema Design and Data Modeling',
      '8.5 Connecting MongoDB with Node.js',
      '8.6 MongoDB Atlas Cloud Database',
      '8.7 Query Optimization and Indexing',
      '8.8 Data Validation and Integrity',
      '8.9 Database Integration with Frontend'
    ]
  },
  {
    id: 'module-9',
    title: 'Module 9: Django Backend Integration for Frontend Developers',
    duration: '90 min',
    description: 'Learn how to connect React frontends to Django backends.',
    topics: [
      '9.1 Django Architecture and Project Structure',
      '9.2 Django Models and Database Interaction',
      '9.3 Django Views and Request Handling',
      '9.4 Django REST API Development',
      '9.5 Connecting React with Django Backend',
      '9.6 Authentication and Session Handling',
      '9.7 API Response Handling in Frontend',
      '9.8 Backend-Frontend Communication Workflow',
      '9.9 Django Deployment Basics'
    ]
  },
  {
    id: 'module-10',
    title: 'Module 10: Production-Level Frontend Engineering and Deployment',
    duration: '90 min',
    description: 'Ship reliable production builds and deploy them with confidence.',
    topics: [
      '10.1 Modern Build Tools and Vite Deep Dive',
      '10.2 Package Management using npm',
      '10.3 Environment Variables and Configuration',
      '10.4 Authentication using JWT',
      '10.5 Protected Routes and Authorization',
      '10.6 Application Performance Optimization',
      '10.7 Code Splitting and Lazy Loading',
      '10.8 Production Build and Optimization',
      '10.9 Deployment using Netlify and Vercel'
    ]
  }
];

const buildLessonContent = (moduleTitle: string, topicTitle: string) => {
  return `
    <h2 class="text-2xl font-bold text-white mb-4">${topicTitle}</h2>
    <p class="text-gray-300 mb-4">
      This lesson is part of <strong>${moduleTitle}</strong> in the Frontend Development – Intermediate course.
      You will understand the core ideas behind <strong>${topicTitle}</strong> with examples, diagrams, and
      practical explanations written specifically for frontend engineers.
    </p>
    <p class="text-gray-300 mb-4">
      As you progress through this module, focus on how these concepts apply to real-world projects.
      Each topic is designed to build your confidence so that you can use it in professional frontend work,
      interviews, and production-grade applications.
    </p>
    <p class="text-gray-300">
      Read through the lesson, review the Syntax tab for quick reference, and practice in the Live Code tab
      or in your own editor. This combination of theory and practice will make the concept stick.
    </p>
  `;
};

const defaultLiveCode = `<!DOCTYPE html>
<html>
<head>
  <title>Frontend Intermediate Playground</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; color: #f5f5f5; background: #121212; }
    h1 { color: #00bceb; }
    p { line-height: 1.6; max-width: 640px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #00bceb; color: #000; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>

  <span class="badge">Frontend Intermediate</span>
  <h1>Welcome to your live playground</h1>
  <p>
    Use this panel to experiment with HTML, CSS, and JavaScript while you read the lesson.
    Try recreating small pieces of the examples or test your own ideas.
  </p>

  <script>
    console.log("Happy learning from the intermediate course!");
  </script>

</body>
</html>`;

const courseData: Module[] = intermediateStructure.map((m) => ({
  id: m.id,
  title: m.title,
  duration: m.duration,
  description: m.description,
  lessons: m.topics.map((topic) => ({
    title: topic,
    duration: '10 min',
    content: buildLessonContent(m.title, topic),
    language: 'html',
    liveCode: defaultLiveCode
  }))
}));

const module1 = courseData.find((m) => m.id === 'module-1');

if (module1 && module1.lessons[0]) {
  module1.lessons[0] = {
    ...module1.lessons[0],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.1 Execution Context and Call Stack</h2>
      <p class="text-gray-300 mb-4">
        Every time JavaScript runs code, it creates an <strong>Execution Context</strong> – a container where
        your code is evaluated and executed. Understanding execution context and the call stack is the
        foundation for mastering JavaScript behavior, especially hoisting, scope, and asynchronous code.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is Execution Context?</h3>
      <p class="text-gray-300 mb-3">
        You can think of an execution context as a box that contains everything JavaScript needs to run a piece
        of code: variables, functions, and the value of <code>this</code>. JavaScript creates a new execution
        context for the global code and for every function call.
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">Types of Execution Contexts</h4>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>
          <strong>Global Execution Context (GEC)</strong> – created once when the JavaScript file first runs.
          In the browser it creates the <code>window</code> object; in Node.js it creates the <code>global</code>
          object. Here, <code>this</code> refers to the global object.
        </li>
        <li>
          <strong>Function Execution Context (FEC)</strong> – created every time a function is invoked. Each
          function call gets its own local variables, scope chain, and <code>this</code> binding.
        </li>
        <li>
          <strong>Eval Execution Context</strong> – created when using <code>eval()</code>. This is rarely used
          in modern professional code and generally discouraged.
        </li>
      </ul>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">What lives inside a Function Execution Context?</h4>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Variable Environment</strong> – local variables and function declarations.</li>
        <li><strong>Scope Chain</strong> – access to outer scopes, including the global scope.</li>
        <li><strong><code>this</code> binding</strong> – value of <code>this</code> for that function call.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Phases of an Execution Context</h3>
      <p class="text-gray-300 mb-3">
        Every execution context is created in two phases: the <strong>Memory Creation Phase</strong> and the
        <strong>Code Execution Phase</strong>. Understanding these phases explains why variables can be accessed
        before their declaration (hoisting) and why the value is <code>undefined</code> instead of throwing an error.
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">1️⃣ Memory Creation Phase</h4>
      <p class="text-gray-300 mb-3">
        Before running the code line by line, JavaScript scans the entire scope:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Allocates memory for <code>var</code> variables and sets them to <code>undefined</code>.</li>
        <li>Stores function <strong>declarations</strong> as full functions in memory.</li>
        <li>Builds the scope chain and sets up <code>this</code>.</li>
      </ul>

      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>console.log(a);
var a = 10;</code></pre>
        <p class="text-gray-300 mt-2">
          Output: <code>undefined</code><br />
          During the memory creation phase, <code>a</code> is created and initialized with
          <code>undefined</code>. In the execution phase, the assignment <code>a = 10</code> happens.
        </p>
      </div>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">2️⃣ Code Execution Phase</h4>
      <p class="text-gray-300 mb-3">
        After memory is set up, JavaScript executes the code line by line:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Assigns actual values to variables.</li>
        <li>Executes function bodies when functions are called.</li>
        <li>Evaluates expressions and runs statements in order.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is the Call Stack?</h3>
      <p class="text-gray-300 mb-3">
        JavaScript is <strong>single-threaded</strong>, meaning it can execute only one piece of code at a time.
        To manage which execution context is currently running, it uses a data structure called the
        <strong>Call Stack</strong>.
      </p>
      <p class="text-gray-300 mb-3">
        The call stack follows the <strong>LIFO (Last In, First Out)</strong> principle:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>When JavaScript starts, the <strong>Global Execution Context</strong> is pushed onto the stack.</li>
        <li>Each time a function is called, a new <strong>Function Execution Context</strong> is pushed.</li>
        <li>When a function finishes, its context is popped from the stack and control returns to the previous one.</li>
      </ul>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">Example: Call Stack Flow</h4>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function first() {
  second();
}

function second() {
  console.log("Hello");
}

first();</code></pre>
        <p class="text-gray-300 mt-2">
          Stack flow:<br />
          1️⃣ Global context is created.<br />
          2️⃣ <code>first()</code> is pushed onto the stack.<br />
          3️⃣ Inside <code>first</code>, <code>second()</code> is called and pushed onto the stack.<br />
          4️⃣ <code>second()</code> logs <code>"Hello"</code> and then its context is popped.<br />
          5️⃣ <code>first()</code> finishes and is popped.<br />
          6️⃣ Global context stays until the program ends.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why This Matters in Real Projects</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Helps you debug <strong>stack overflow</strong> errors from uncontrolled recursion.</li>
        <li>Makes recursion and nested function calls easier to reason about.</li>
        <li>Builds the foundation for understanding the <strong>event loop</strong> and asynchronous JavaScript.</li>
        <li>Improves performance intuition – you know what is currently on the stack and how deep your call chain is.</li>
      </ul>

      <p class="text-gray-300">
        Almost every advanced JavaScript topic—closures, async/await, promises, and event loop behavior—relies on a
        solid understanding of execution context and the call stack. Master this topic and the rest of the module
        will feel much easier.
      </p>
    `,
    syntax: [
      {
        title: 'Function Declaration',
        content: 'function functionName(parameters) {\n    // code\n}'
      },
      {
        title: 'Function Invocation',
        content: 'functionName();'
      },
      {
        title: 'Variable Hoisting Example',
        content: 'console.log(x); // undefined\nvar x = 5;'
      },
      {
        title: 'Stack Overflow Example',
        content: 'function test() {\n    test();\n}\n\ntest();'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Example 1: Execution Context ===");

console.log("Start");

var a = 10;

function greet() {
  var message = "Hello World";
  console.log(message);
}

greet();

console.log("End");

console.log("=== Example 2: Call Stack Flow ===");

function one() {
  console.log("Inside One");
  two();
}

function two() {
  console.log("Inside Two");
  three();
}

function three() {
  console.log("Inside Three");
}

one();`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This live code demonstrates how execution contexts and the call stack work for both simple function calls and
        nested function chains.
      </p>
      <h3 class="text-lg font-semibold text-white mb-2">Example 1: Execution Context</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <code>console.log("Start");</code> runs in the global execution context and prints the first message.
        </li>
        <li>
          <code>var a = 10;</code> creates a global variable inside the global execution context.
        </li>
        <li>
          <code>function greet() { ... }</code> defines a function. The function code is stored in memory, but not yet
          executed.
        </li>
        <li>
          When <code>greet();</code> is called, a new Function Execution Context is pushed onto the call stack. Inside
          it, <code>message</code> is created and <code>"Hello World"</code> is logged.
        </li>
        <li>
          After <code>greet</code> finishes, its execution context is popped off the stack and
          <code>console.log("End");</code> runs back in the global context.
        </li>
      </ul>
      <h3 class="text-lg font-semibold text-white mb-2">Example 2: Call Stack Flow</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>
          Calling <code>one();</code> pushes the <code>one</code> execution context onto the stack and logs
          <code>"Inside One"</code>.
        </li>
        <li>
          Inside <code>one</code>, calling <code>two();</code> pushes a new context. It logs
          <code>"Inside Two"</code> and then calls <code>three();</code>.
        </li>
        <li>
          <code>three</code> is pushed last, logs <code>"Inside Three"</code>, and then its context is popped.
        </li>
        <li>
          After that, <code>two</code> finishes and is popped, then <code>one</code> finishes and is popped. The call
          stack ends with only the global execution context.
        </li>
        <li>
          This illustrates how the call stack grows with nested calls and then unwinds in reverse order.
        </li>
      </ul>
    `
  };
}

if (module1 && module1.lessons[1]) {
  module1.lessons[1] = {
    ...module1.lessons[1],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.2 Closures and Lexical Scope</h2>
      <p class="text-gray-300 mb-4">
        <strong>Lexical Scope</strong> and <strong>Closures</strong> are two of the most important concepts in
        JavaScript. They explain how functions access variables and how a function can remember values even after
        its outer function has finished executing.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is Lexical Scope?</h3>
      <p class="text-gray-300 mb-3">
        Lexical scope means that a function can access variables from its outer scope based on where the function
        is <strong>defined</strong>, not where it is called. In JavaScript, scope is determined at code write-time,
        not at runtime.
      </p>

      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function outer() {
  var name = "Sai";

  function inner() {
    console.log(name);
  }

  inner();
}

outer();</code></pre>
        <p class="text-gray-300 mt-2">
          Output: <code>Sai</code><br />
          Here, <code>inner()</code> can access <code>name</code> because it is defined inside
          <code>outer()</code>. This is lexical scope.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is a Closure?</h3>
      <p class="text-gray-300 mb-3">
        A closure is created when a function remembers variables from its lexical scope even after the outer
        function has finished executing.
      </p>
      <p class="text-gray-300 mb-3">
        You can think of it as:
        <strong>Closure = Function + Remembered Scope</strong>.
      </p>
      <p class="text-gray-300 mb-3">
        Closures allow functions to retain access to variables even after the parent function has been removed from
        the call stack.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Do Closures Exist?</h3>
      <p class="text-gray-300 mb-3">
        Normally, when a function finishes execution:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Its execution context is removed from the call stack.</li>
        <li>Its local variables are destroyed.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        But if an inner function still references those variables, JavaScript keeps them in memory. This preserved
        memory forms a closure.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Example of a Closure</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function outer() {
  var count = 0;

  function inner() {
    count++;
    console.log(count);
  }

  return inner;
}

var counter = outer();

counter();
counter();
counter();</code></pre>
        <p class="text-gray-300 mt-2">
          Output:<br />
          <code>1</code><br />
          <code>2</code><br />
          <code>3</code><br />
          Even though <code>outer()</code> has finished executing, <code>inner()</code> still remembers
          <code>count</code>. This is a closure.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Real-World Example: Private Variables</h3>
      <p class="text-gray-300 mb-3">
        Closures are often used to create <strong>private variables</strong> – values that cannot be accessed
        directly from the outside but can be read or updated through functions.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function bankAccount() {
  var balance = 1000;

  return function() {
    balance += 500;
    console.log("Balance:", balance);
  };
}

var deposit = bankAccount();

deposit();
deposit();</code></pre>
        <p class="text-gray-300 mt-2">
          Output:<br />
          <code>Balance: 1500</code><br />
          <code>Balance: 2000</code><br />
          The <code>balance</code> variable cannot be accessed directly from outside <code>bankAccount()</code>.
          This creates data privacy.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Closures in Professional Development</h3>
      <p class="text-gray-300 mb-3">
        Closures are heavily used in real-world JavaScript and frontend engineering:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>React hooks (like <code>useState</code> and <code>useEffect</code>).</li>
        <li>Event handlers (like button click listeners).</li>
        <li>Timers (<code>setTimeout</code>, <code>setInterval</code>).</li>
        <li>Callbacks and asynchronous code.</li>
        <li>Data privacy and encapsulation.</li>
        <li>State management patterns.</li>
      </ul>

      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <h4 class="text-lg font-semibold text-white mb-2">Example: Event Listener with Closure</h4>
        <pre class="text-sm overflow-x-auto"><code>function setupButton() {
  var count = 0;

  document.getElementById("btn").onclick = function() {
    count++;
    console.log(count);
  };
}</code></pre>
        <p class="text-gray-300 mt-2">
          Each click remembers the previous value of <code>count</code>. The anonymous function assigned to
          <code>onclick</code> is a closure over <code>count</code>.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Closures and Memory</h3>
      <p class="text-gray-300 mb-3">
        Because closures keep variables alive in memory, they must be used thoughtfully. Keeping many unnecessary
        references can increase memory usage and, in extreme cases, contribute to memory leaks.
      </p>
      <p class="text-gray-300 mb-6">
        Professional developers use closures carefully—to model state and privacy—while avoiding holding onto large
        objects or DOM nodes longer than necessary.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Professional Insight</h3>
      <p class="text-gray-300 mb-3">
        Closures are the foundation of many patterns you will use daily as a frontend engineer:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>React hooks and other stateful abstractions.</li>
        <li>The module pattern and encapsulation.</li>
        <li>State persistence across function calls.</li>
        <li>Event handlers and callbacks.</li>
        <li>Asynchronous programming and timer-based logic.</li>
      </ul>
      <p class="text-gray-300">
        Without closures, modern frontend frameworks and many JavaScript design patterns would simply not exist.
      </p>
    `,
    syntax: [
      {
        title: 'Basic Closure Syntax',
        content:
          'function outerFunction() {\n    var variable = value;\n\n    function innerFunction() {\n        // access variable\n    }\n\n    return innerFunction;\n}'
      },
      {
        title: 'Closure with Parameters',
        content:
          'function outer(x) {\n    return function inner(y) {\n        console.log(x + y);\n    };\n}\n\nvar add = outer(5);\nadd(10);'
      },
      {
        title: 'Closure with Private Variable',
        content:
          'function createCounter() {\n    var count = 0;\n\n    return function() {\n        count++;\n        return count;\n    };\n}'
      },
      {
        title: 'Lexical Scope Example',
        content:
          'function parent() {\n    var name = "JavaScript";\n\n    function child() {\n        console.log(name);\n    }\n\n    child();\n}'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Example 1: Simple Closure ===");

function greetUser(name) {
  function greet() {
    console.log("Hello " + name);
  }
  return greet;
}

var greetSai = greetUser("Sai");
greetSai();

console.log("=== Example 2: Counter Application ===");

function createCounter() {
  var count = 0;
  return function() {
    count++;
    console.log("Count:", count);
  };
}

var counter = createCounter();
counter();
counter();
counter();

console.log("=== Example 3: Private Variable Protection ===");

function createBankAccount() {
  var balance = 1000;
  return {
    deposit: function(amount) {
      balance += amount;
      console.log("Deposited:", amount);
    },
    getBalance: function() {
      console.log("Balance:", balance);
    }
  };
}

var account = createBankAccount();
account.deposit(500);
account.getBalance();

console.log("=== Example 4: Interview-Level Closure Question ===");

function test() {
  var x = 10;
  return function() {
    console.log(x);
  };
}

var fn = test();
fn();`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This live code shows different real-world uses of closures: remembering a value, keeping state, protecting
        private data, and common interview-style questions.
      </p>
      <h3 class="text-lg font-semibold text-white mb-2">Example 1: Simple Closure</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <code>greetUser(name)</code> defines an inner function <code>greet</code> that uses <code>name</code> from
          the outer scope.
        </li>
        <li>
          When <code>greetUser("Sai")</code> is called, it returns the inner function, which still remembers the value
          of <code>name</code>.
        </li>
        <li>
          Calling <code>greetSai()</code> prints <code>"Hello Sai"</code> even though
          <code>greetUser</code> has already finished. That memory is the closure.
        </li>
      </ul>
      <h3 class="text-lg font-semibold text-white mb-2">Example 2: Counter Application</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <code>createCounter()</code> creates a local variable <code>count</code> and returns an inner function that
          increments and logs it.
        </li>
        <li>
          Each call to <code>counter()</code> increases <code>count</code> and logs the new value, even though the
          outer function has finished.
        </li>
        <li>
          This is a closure used to model state across multiple calls.
        </li>
      </ul>
      <h3 class="text-lg font-semibold text-white mb-2">Example 3: Private Variable Protection</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <code>createBankAccount()</code> defines a private <code>balance</code> variable.
        </li>
        <li>
          It returns an object with methods <code>deposit</code> and <code>getBalance</code> that close over
          <code>balance</code>.
        </li>
        <li>
          Outside code cannot access <code>balance</code> directly; it must go through these functions. This is a
          common pattern for data privacy.
        </li>
      </ul>
      <h3 class="text-lg font-semibold text-white mb-2">Example 4: Interview-Level Closure</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>
          <code>test()</code> defines <code>x</code> and returns a function that logs it.
        </li>
        <li>
          The returned function, stored in <code>fn</code>, still remembers <code>x</code> when called later, and logs
          <code>10</code>.
        </li>
        <li>
          This is a classic closure example used frequently in technical interviews.
        </li>
      </ul>
    `
  };
}

if (module1 && module1.lessons[2]) {
  module1.lessons[2] = {
    ...module1.lessons[2],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.3 Higher-Order Functions and Functional Programming</h2>
      <p class="text-gray-300 mb-4">
        A <strong>Higher-Order Function (HOF)</strong> is any function that takes another function as an argument,
        returns a function, or does both. In simple terms, it is a function that works with other functions.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is a Higher-Order Function?</h3>
      <p class="text-gray-300 mb-3">
        JavaScript treats functions as <strong>first-class citizens</strong>. This means functions can be stored in
        variables, passed as arguments, and returned from other functions. Higher-order functions are a direct result
        of this capability.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Takes another function as an argument.</li>
        <li>Returns another function.</li>
      </ul>

      <p class="text-gray-300 mb-3">
        This style of programming is a core part of <strong>functional programming</strong> and appears everywhere in
        modern JavaScript.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Higher-Order Functions Exist</h3>
      <p class="text-gray-300 mb-3">
        Higher-order functions help you:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Write cleaner, more expressive code.</li>
        <li>Avoid repetition by capturing reusable patterns.</li>
        <li>Improve reusability and scalability as your codebase grows.</li>
        <li>Follow functional programming principles such as composition.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        They are heavily used in:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>React (hooks, render props, component factories).</li>
        <li>Event handling and listeners.</li>
        <li>Array methods like <code>map</code>, <code>filter</code>, and <code>reduce</code>.</li>
        <li>Middleware and plugin systems.</li>
        <li>Callback-based and asynchronous flows.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Normal Function vs Higher-Order Function</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <h4 class="text-lg font-semibold text-white mb-2">Normal function</h4>
        <pre class="text-sm overflow-x-auto"><code>function greet(name) {
  return "Hello " + name;
}</code></pre>
        <h4 class="text-lg font-semibold text-white mt-4 mb-2">Higher-order function</h4>
        <pre class="text-sm overflow-x-auto"><code>function processUser(callback) {
  callback("Sai");
}</code></pre>
        <p class="text-gray-300 mt-2">
          Here, <code>callback</code> is a function passed as an argument. That makes
          <code>processUser</code> a higher-order function.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Real-World Professional Use Case</h3>
      <p class="text-gray-300 mb-3">
        In real projects, higher-order functions are used to process data dynamically. Instead of writing separate
        functions for every operation, you create one flexible higher-order function and pass in the behavior as a
        callback.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Transforming arrays of API responses.</li>
        <li>Composing React component logic.</li>
        <li>Building middleware chains in Express or similar frameworks.</li>
        <li>Implementing plugin systems and extensible architectures.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Common Built-in Higher-Order Functions</h3>
      <p class="text-gray-300 mb-3">
        JavaScript arrays include several built-in higher-order functions:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong><code>map()</code></strong> – transforms every element and returns a new array.</li>
        <li><strong><code>filter()</code></strong> – keeps elements that match a condition.</li>
        <li><strong><code>reduce()</code></strong> – reduces the array to a single accumulated value.</li>
        <li><strong><code>forEach()</code></strong> – runs a function for each element (primarily for side effects).</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Professional Insight</h3>
      <p class="text-gray-300 mb-3">
        Higher-order functions are a backbone of modern JavaScript architecture. They make code more modular,
        testable, and composable by letting you pass behavior as data.
      </p>
      <p class="text-gray-300">
        This pattern is used in React hooks, Redux middleware, routing libraries, logging pipelines, and many other
        production systems. Mastering higher-order functions will make it easier to reason about complex flows.
      </p>
    `,
    syntax: [
      {
        title: 'Higher-Order Function (Function as Argument)',
        content: 'function higherOrderFunction(callback) {\n    callback();\n}'
      },
      {
        title: 'Higher-Order Function (Function Returning Function)',
        content:
          'function outerFunction() {\n    return function innerFunction() {\n        // code\n    };\n}'
      },
      {
        title: 'Higher-Order Function with Parameters',
        content:
          'function process(callback, value) {\n    return callback(value);\n}'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Higher-Order Function Example ===");

function calculate(operation, a, b) {
  return operation(a, b);
}

function add(x, y) {
  return x + y;
}

function multiply(x, y) {
  return x * y;
}

var result1 = calculate(add, 5, 3);
var result2 = calculate(multiply, 5, 3);

console.log("Addition:", result1);
console.log("Multiplication:", result2);`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example shows how a higher-order function can receive different operations (functions) as arguments and
        reuse the same logic to compute different results.
      </p>
      <ul class="list-disc list-inside text-gray-300">
        <li>
          <code>function calculate(operation, a, b)</code> is a higher-order function because it expects
          <code>operation</code> to be another function.
        </li>
        <li>
          <code>add</code> and <code>multiply</code> are simple functions that implement specific behaviors
          (addition and multiplication).
        </li>
        <li>
          <code>calculate(add, 5, 3)</code> calls <code>add(5, 3)</code> internally and returns <code>8</code>.
        </li>
        <li>
          <code>calculate(multiply, 5, 3)</code> calls <code>multiply(5, 3)</code> and returns <code>15</code>.
        </li>
        <li>
          The final logs, <code>"Addition: 8"</code> and <code>"Multiplication: 15"</code>, show how the same
          higher-order function can flexibly work with different operations.
        </li>
      </ul>
    `
  };
}

if (module1 && module1.lessons[3]) {
  module1.lessons[3] = {
    ...module1.lessons[3],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.4 Event Loop, Microtasks, and Macrotasks</h2>
      <p class="text-gray-300 mb-4">
        JavaScript is a <strong>single-threaded</strong> language, which means it can execute only one task at a
        time on the <strong>call stack</strong>. Yet it can still handle timers, API calls, user events, and promises
        without blocking the main thread.
      </p>
      <p class="text-gray-300 mb-4">
        This is possible because of the combination of <strong>Web APIs</strong>, the
        <strong>Event Loop</strong>, and two special queues: the <strong>Microtask Queue</strong> and the
        <strong>Macrotask (Callback) Queue</strong>.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Components of the JavaScript Async System</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
        <li>
          <strong>Call Stack</strong> – Executes synchronous code line by line.
          <br />
          Example: <code>console.log("Hello");</code>
        </li>
        <li>
          <strong>Web APIs (Browser Features)</strong> – Handle async tasks such as
          <code>setTimeout</code>, <code>fetch</code>, and DOM events.
        </li>
        <li>
          <strong>Macrotask Queue (Callback Queue)</strong> – Stores callbacks from
          <code>setTimeout</code>, <code>setInterval</code>, and DOM events.
        </li>
        <li>
          <strong>Microtask Queue</strong> – Stores callbacks from Promises
          (<code>.then</code>, <code>.catch</code>) and <code>queueMicrotask</code>.
          Microtasks have <strong>higher priority</strong> than macrotasks.
        </li>
        <li>
          <strong>Event Loop</strong> – Continuously checks:
          <ul class="list-disc list-inside ml-5 mt-1 space-y-1">
            <li>If the Call Stack is empty.</li>
            <li>Then runs all Microtasks.</li>
            <li>Then runs one Macrotask.</li>
          </ul>
        </li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Priority Order</h3>
      <p class="text-gray-300 mb-2">
        The general execution priority is:
      </p>
      <ol class="list-decimal list-inside text-gray-300 space-y-1 mb-4">
        <li>Call Stack (synchronous code)</li>
        <li>Microtask Queue (Promises, queueMicrotask)</li>
        <li>Macrotask Queue (setTimeout, DOM events)</li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Execution Order Example</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>console.log("Start");

setTimeout(() =&gt; console.log("Timeout"), 0);

Promise.resolve().then(() =&gt; console.log("Promise"));

console.log("End");</code></pre>
        <p class="text-gray-300 mt-2">
          Output order:<br />
          <code>Start</code><br />
          <code>End</code><br />
          <code>Promise</code><br />
          <code>Timeout</code>
        </p>
        <p class="text-gray-300 mt-2">
          <strong>Reason:</strong> <code>Promise</code> callbacks are scheduled in the Microtask Queue, which is
          processed before the Macrotask Queue where <code>setTimeout</code> callbacks live.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why This Matters Professionally</h3>
      <p class="text-gray-300 mb-3">
        Understanding the Event Loop is critical for professional frontend development, especially when working with:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>React rendering behavior and state updates.</li>
        <li>API calls and async flows.</li>
        <li>Performance optimization and avoiding main-thread blocking.</li>
        <li>Debugging race conditions and timing-related bugs.</li>
        <li>Smooth user experiences during intensive interactions.</li>
      </ul>
    `,
    syntax: [
      {
        title: 'setTimeout (Macrotask)',
        content: 'setTimeout(function, delay);'
      },
      {
        title: 'Promise (Microtask)',
        content: 'Promise.resolve().then(function);'
      },
      {
        title: 'Async Operation Order Example',
        content:
          'console.log("Start");\n\nsetTimeout(() => {}, 0);\n\nPromise.resolve().then(() => {});\n\nconsole.log("End");'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("Step 1: Start");

setTimeout(function timeoutFunction() {
  console.log("Step 4: setTimeout executed");
}, 0);

Promise.resolve().then(function promiseFunction() {
  console.log("Step 3: Promise executed");
});

console.log("Step 2: End");`,
    liveCodeExplanation: `
      <p class="mb-2">
        This example shows how the Event Loop, Microtasks (Promises), and Macrotasks (setTimeout) affect execution order.
      </p>
      <ul class="list-disc list-inside space-y-2">
        <li>
          <code>console.log("Step 1: Start");</code><br />
          Runs immediately on the call stack. Marks the beginning of the program.
        </li>
        <li>
          <code>setTimeout(function timeoutFunction() { ... }, 0);</code><br />
          Schedules <code>timeoutFunction</code> as a <strong>Macrotask</strong>. It is moved to the
          Macrotask Queue and will run only after the call stack is empty and all microtasks have finished.
        </li>
        <li>
          <code>Promise.resolve().then(function promiseFunction() { ... });</code><br />
          Schedules <code>promiseFunction</code> in the <strong>Microtask Queue</strong>. Microtasks have higher
          priority than macrotasks, so this callback will run before the timeout callback.
        </li>
        <li>
          <code>console.log("Step 2: End");</code><br />
          Another synchronous log. It runs right after <code>"Step 1: Start"</code> and before any async callbacks.
        </li>
        <li>
          After the call stack is empty, the Event Loop processes microtasks first:<br />
          <code>console.log("Step 3: Promise executed");</code>
        </li>
        <li>
          Then it runs one macrotask from the Macrotask Queue:<br />
          <code>console.log("Step 4: setTimeout executed");</code>
        </li>
        <li>
          Final output order in the preview:<br />
          <code>Step 1: Start</code><br />
          <code>Step 2: End</code><br />
          <code>Step 3: Promise executed</code><br />
          <code>Step 4: setTimeout executed</code>
        </li>
      </ul>
    `
  };
}

if (module1 && module1.lessons[4]) {
  module1.lessons[4] = {
    ...module1.lessons[4],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.5 Promises and Async/Await Deep Dive</h2>
      <p class="text-gray-300 mb-4">
        A <strong>Promise</strong> is an object that represents the future result of an asynchronous operation.
        It is used when a task takes time, such as API calls, database requests, file loading, or timers.
      </p>
      <p class="text-gray-300 mb-4">
        Instead of blocking the program while waiting, JavaScript continues executing other code and handles the
        result of the Promise later.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Promise States</h3>
      <p class="text-gray-300 mb-3">
        A Promise can be in one of three states:
      </p>
      <ol class="list-decimal list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Pending</strong> – initial state, operation is still running.</li>
        <li><strong>Fulfilled</strong> – operation completed successfully.</li>
        <li><strong>Rejected</strong> – operation failed.</li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Promises Exist</h3>
      <p class="text-gray-300 mb-3">
        Before Promises, JavaScript used callbacks for asynchronous work. This often led to:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Callback hell with deeply nested code.</li>
        <li>Hard-to-read and hard-to-maintain logic.</li>
        <li>More difficult debugging and error handling.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        Promises provide a cleaner structure, better readability, and more robust error handling for async code.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What are <code>async</code> and <code>await</code>?</h3>
      <p class="text-gray-300 mb-3">
        <strong>async/await</strong> is a modern way to work with Promises that makes asynchronous code look and feel
        more like synchronous code.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>async</strong> – declares a function as asynchronous.</li>
        <li><strong>await</strong> – pauses the async function until the Promise resolves or rejects.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        Using async/await improves readability, maintainability, and debugging because control flow is easier to follow.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Real-World Example</h3>
      <p class="text-gray-300 mb-3">
        A common use case is fetching user data from a server:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Request is sent to the server.</li>
        <li>Client waits while the server processes.</li>
        <li>Response is received and processed in the UI.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        Promises and async/await handle this flow efficiently and make it easier to manage success, failure, and loading
        states in professional frontend applications.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Professional Importance</h3>
      <p class="text-gray-300 mb-3">
        Promises and async/await are used across almost every modern frontend codebase:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>API calls using <code>fetch</code> or libraries like <code>axios</code>.</li>
        <li>Database operations in full-stack JavaScript apps.</li>
        <li>React applications managing remote data and side effects.</li>
        <li>Backend communication and microservice integration.</li>
        <li>Authentication flows and token handling.</li>
      </ul>
      <p class="text-gray-300">
        Mastering Promises and async/await is mandatory for any professional JavaScript or React developer. Almost every
        modern frontend feature depends on them in some way.
      </p>
    `,
    syntax: [
      {
        title: 'Creating a Promise',
        content:
          'var promise = new Promise(function(resolve, reject) {\n    resolve(value);\n    reject(error);\n});'
      },
      {
        title: 'Using Promise (then / catch)',
        content:
          'promise.then(function(result) {\n    // success\n}).catch(function(error) {\n    // error\n});'
      },
      {
        title: 'Async Function',
        content: 'async function functionName() {\n    // code\n}'
      },
      {
        title: 'Await Syntax',
        content: 'var result = await promise;'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `function fetchUserData() {
  return new Promise(function(resolve, reject) {
    console.log("Fetching user data...");
    setTimeout(function() {
      resolve("User data received");
    }, 2000);
  });
}

async function getUserData() {
  console.log("Request started");
  var result = await fetchUserData();
  console.log(result);
  console.log("Request finished");
}

getUserData();`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example combines Promises with <code>async</code> and <code>await</code> to model a typical asynchronous
        operation like fetching user data from a server.
      </p>
      <ul class="list-disc list-inside text-gray-300">
        <li>
          <code>fetchUserData()</code> returns a new Promise. Inside the Promise, a message
          <code>"Fetching user data..."</code> is logged, and <code>setTimeout</code> simulates a 2-second network
          delay before calling <code>resolve("User data received")</code>.
        </li>
        <li>
          <code>async function getUserData()</code> is an async function that uses <code>await</code> to pause until the
          Promise from <code>fetchUserData</code> is fulfilled.
        </li>
        <li>
          <code>console.log("Request started");</code> runs immediately when <code>getUserData</code> starts.
        </li>
        <li>
          <code>var result = await fetchUserData();</code> waits for the Promise to resolve and stores
          <code>"User data received"</code> in <code>result</code>.
        </li>
        <li>
          After the Promise resolves, <code>console.log(result);</code> prints the resolved value, followed by
          <code>"Request finished"</code>.
        </li>
        <li>
          The overall console output is:
          <br /><code>Request started</code>
          <br /><code>Fetching user data...</code>
          <br /><code>User data received</code>
          <br /><code>Request finished</code>
        </li>
      </ul>
    `
  };
}

if (module1 && module1.lessons[5]) {
  module1.lessons[5] = {
    ...module1.lessons[5],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.6 ES6+ Advanced Features (Destructuring, Spread, Rest)</h2>
      <p class="text-gray-300 mb-4">
        ES6 introduced powerful features that make JavaScript more clean, readable, and professional. Three of the most
        important and widely used features are <strong>Destructuring</strong>, the <strong>Spread Operator</strong>, and
        the <strong>Rest Operator</strong>.
      </p>
      <p class="text-gray-300 mb-4">
        These are heavily used in React, API handling, state management, function parameters, and object/array
        manipulation across modern frontend projects.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">1. Destructuring</h3>
      <p class="text-gray-300 mb-3">
        Destructuring allows you to extract values from arrays or objects and store them into variables easily.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <h4 class="text-lg font-semibold text-white mb-2">Without destructuring</h4>
        <pre class="text-sm overflow-x-auto"><code>var user = { name: "Sai", age: 20 };

var name = user.name;
var age = user.age;</code></pre>
        <h4 class="text-lg font-semibold text-white mt-4 mb-2">With destructuring</h4>
        <pre class="text-sm overflow-x-auto"><code>var { name, age } = user;</code></pre>
        <p class="text-gray-300 mt-2">
          This is cleaner, more expressive, and considered a professional standard in modern JavaScript.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">2. Spread Operator (<code>...</code>)</h3>
      <p class="text-gray-300 mb-3">
        The spread operator is used to <strong>expand</strong> elements of an array or object.
      </p>
      <p class="text-gray-300 mb-2">
        Common uses:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Copying arrays.</li>
        <li>Merging arrays.</li>
        <li>Merging or cloning objects.</li>
      </ul>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>var arr1 = [1, 2];
var arr2 = [...arr1, 3, 4];

// Result:
// [1, 2, 3, 4]</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">3. Rest Operator (<code>...</code>)</h3>
      <p class="text-gray-300 mb-3">
        The rest operator collects multiple values into a single variable, usually as an array, making functions more
        flexible.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function sum(...numbers) {
  // numbers is an array of all arguments
}</code></pre>
        <p class="text-gray-300 mt-2">
          Here, <code>numbers</code> will contain all arguments passed to <code>sum</code>.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Difference Between Spread and Rest</h3>
      <p class="text-gray-300 mb-3">
        Although both use the same symbol (<code>...</code>), their behavior depends on where they are used:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Spread</strong> – expands values (used when passing or building arrays/objects).</li>
        <li><strong>Rest</strong> – collects values (used in function parameters or destructuring patterns).</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Professional Use Cases</h3>
      <p class="text-gray-300 mb-3">
        These features are used constantly in professional frontend development:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Passing and spreading React props.</li>
        <li>Updating React state immutably.</li>
        <li>Handling API responses and normalizing data.</li>
        <li>Working with flexible function arguments.</li>
        <li>Cloning and merging objects in a clean way.</li>
      </ul>
      <p class="text-gray-300">
        These ES6 features are mandatory knowledge for React and modern frontend development. You will use them daily
        in real projects.
      </p>
    `,
    syntax: [
      {
        title: 'Object Destructuring',
        content: 'var { variable1, variable2 } = object;'
      },
      {
        title: 'Array Destructuring',
        content: 'var [variable1, variable2] = array;'
      },
      {
        title: 'Spread Operator',
        content: 'var newArray = [...oldArray];\nvar newObject = { ...oldObject };'
      },
      {
        title: 'Rest Operator',
        content: 'function functionName(...parameters) {\n  // code\n}'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `var student = {
  name: "sai",
  age: 30,
  course: "Computer Science"
};

var { name, age } = student;

var updatedStudent = {
  ...student,
  city: "Bangalore"
};

function displayStudent(...details) {
  console.log("Student Details:");
  details.forEach(function(detail) {
    console.log(detail);
  });
}

displayStudent(name, age, updatedStudent.city);`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example shows object destructuring, the spread operator for cloning and extending objects, and the rest
        parameter for flexible function arguments.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <code>var student = { name: "sai", age: 30, course: "Computer Science" };</code><br />
          Creates a base object representing a student.
        </li>
        <li>
          <code>var {'{'} name, age {'}'} = student;</code><br />
          Uses object destructuring to pull <code>name</code> and <code>age</code> into their own variables.
        </li>
        <li>
          <code>var updatedStudent = {'{'} ...student, city: "Bangalore" {'}'};</code><br />
          Uses the spread operator to copy all properties from <code>student</code> into a new object and then adds a
          new <code>city</code> property.
        </li>
        <li>
          <code>function displayStudent(...details)</code> uses the rest parameter to accept any number of arguments as
          an array called <code>details</code>.
        </li>
        <li>
          Inside <code>displayStudent</code>, <code>details.forEach</code> loops over each argument and logs it under
          the heading <code>"Student Details:"</code>.
        </li>
        <li>
          The call <code>displayStudent(name, age, updatedStudent.city);</code> passes three values, which are printed
          in order: the name, the age, and the city.
        </li>
      </ul>
    `
  };
}

if (module1 && module1.lessons[6]) {
  module1.lessons[6] = {
    ...module1.lessons[6],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.7 JavaScript Modules (Import and Export)</h2>
      <p class="text-gray-300 mb-4">
        JavaScript modules allow you to split your code into multiple files and share code between them. This helps you
        organize logic, reuse functions, and build applications that are easier to maintain and scale.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What Are JavaScript Modules?</h3>
      <p class="text-gray-300 mb-3">
        Instead of writing everything in one file, you separate functionality into different modules and connect them
        using <code>export</code> and <code>import</code>.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Organizing code into logical pieces.</li>
        <li>Reusing functions and utilities across files.</li>
        <li>Improving maintainability and readability.</li>
        <li>Scaling projects as they grow in size.</li>
      </ul>

      <p class="text-gray-300 mb-4">
        Example project structure:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><code>math.js</code> – math-related functions.</li>
        <li><code>app.js</code> – main application logic.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Modules Are Important</h3>
      <p class="text-gray-300 mb-3">
        In real-world applications, codebases can grow to thousands of lines. Keeping everything in a single file would be
        impossible to manage. Modules let you divide logic into separate, focused files.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><code>auth.js</code> – authentication logic.</li>
        <li><code>api.js</code> – API calls.</li>
        <li><code>utils.js</code> – helper or utility functions.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        This improves scalability, readability, and makes debugging much easier.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Using the <code>export</code> Keyword</h3>
      <p class="text-gray-300 mb-3">
        The <code>export</code> keyword is used to make variables or functions available to other files.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>export function add(a, b) {
  return a + b;
}</code></pre>
        <p class="text-gray-300 mt-2">
          This function is now exported and can be imported in another file.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Using the <code>import</code> Keyword</h3>
      <p class="text-gray-300 mb-3">
        The <code>import</code> keyword is used to bring in exported values from another module.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>import { add } from "./math.js";</code></pre>
        <p class="text-gray-300 mt-2">
          Here we are importing the <code>add</code> function from <code>math.js</code> into our current file.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Types of Exports</h3>
      <h4 class="text-lg font-semibold text-white mb-2">1. Named Export</h4>
      <p class="text-gray-300 mb-3">
        With named exports, you can export multiple functions or variables from the same file.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}</code></pre>
        <p class="text-gray-300 mt-2">
          These can be imported using their names in curly braces:
          <code>import { add, subtract } from "./file.js";</code>
        </p>
      </div>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">2. Default Export</h4>
      <p class="text-gray-300 mb-3">
        Each file can have only one default export. This is often used when a module represents one main thing.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>export default function add(a, b) {
  return a + b;
}</code></pre>
        <p class="text-gray-300 mt-2">
          Default exports are imported without curly braces:
          <code>import add from "./file.js";</code>
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Professional Use Cases</h3>
      <p class="text-gray-300 mb-3">
        JavaScript modules are used everywhere in modern development:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>React applications – each component is usually a separate module.</li>
        <li>Angular and other SPA frameworks.</li>
        <li>Backend Node.js applications using ES modules.</li>
        <li>Utility libraries that share helper functions.</li>
      </ul>
      <p class="text-gray-300">
        Almost every professional JavaScript project uses modules. Understanding import and export is essential for
        working with modern toolchains, bundlers, and frameworks.
      </p>
    `,
    syntax: [
      {
        title: 'Named Export',
        content: 'export function functionName() {}\nexport var variableName = value;'
      },
      {
        title: 'Named Import',
        content: 'import { functionName } from "./file.js";'
      },
      {
        title: 'Default Export',
        content: 'export default functionName;'
      },
      {
        title: 'Default Import',
        content: 'import functionName from "./file.js";'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `// math.js (module with exported functions)
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// app.js (simulated consumer of the math module)
// In a real project you would write:
// import { add, multiply } from "./math.js";

var sum = add(5, 3);
var product = multiply(5, 3);

console.log("Sum:", sum);
console.log("Product:", product);`,
    liveCodeExplanation: `
      <h3 class="text-lg font-semibold text-white mb-2">math.js Explanation</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <strong>Line 2 – <code>function add(a, b)</code>:</strong>
          Defines an <code>add</code> function that will be exported in a real module and used by other files.
        </li>
        <li>
          <strong>Line 3 – <code>return a + b;</code>:</strong>
          Returns the sum of two numbers.
        </li>
        <li>
          <strong>Line 6 – <code>function multiply(a, b)</code>:</strong>
          Defines a <code>multiply</code> function that multiplies two numbers.
        </li>
        <li>
          <strong>Line 7 – <code>return a * b;</code>:</strong>
          Returns the product of the two inputs.
        </li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-2">app.js Explanation</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <strong>Import concept:</strong>
          In a real ES module setup you would write
          <code>import { add, multiply } from "./math.js";</code> to use these functions from another file.
        </li>
        <li>
          <strong>Line 16 – <code>var sum = add(5, 3);</code>:</strong>
          Calls the <code>add</code> function with <code>5</code> and <code>3</code>. The result is <code>8</code>.
        </li>
        <li>
          <strong>Line 17 – <code>var product = multiply(5, 3);</code>:</strong>
          Calls <code>multiply</code> with the same numbers. The result is <code>15</code>.
        </li>
        <li>
          <strong>Lines 19–20 – <code>console.log</code> lines:</strong>
          Print the final output:
          <br />Sum: 8
          <br />Product: 15
        </li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-2">Professional Importance</h3>
      <p class="text-gray-300">
        In real projects, you place <code>add</code> and <code>multiply</code> in <code>math.js</code>, export them, and
        then import them into <code>app.js</code>. This pattern is used for React components, utility files, API
        services, authentication logic, and almost every part of large-scale frontend applications.
      </p>
    `
  };
}

if (module1 && module1.lessons[7]) {
  module1.lessons[7] = {
    ...module1.lessons[7],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.8 Error Handling and Debugging</h2>
      <p class="text-gray-300 mb-4">
        <strong>Error handling</strong> is the process of managing runtime errors so that your application does not crash
        unexpectedly. Instead of stopping execution, the application can react gracefully, show helpful messages, and
        continue running safely.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Do Errors Happen?</h3>
      <p class="text-gray-300 mb-3">
        Errors can appear for many reasons during real-world development:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Invalid user input.</li>
        <li>API failures or server downtime.</li>
        <li>Accessing undefined variables or properties.</li>
        <li>Network issues or timeouts.</li>
        <li>Logical mistakes in calculations or conditions.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Without proper error handling, a single unexpected case can cause the entire application to stop.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What Good Error Handling Provides</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Shows clear, user-friendly error messages.</li>
        <li>Prevents the application from crashing completely.</li>
        <li>Allows the rest of the system to keep working.</li>
        <li>Improves user trust and overall experience.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Common Error Types in JavaScript</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
        <li>
          <strong>Syntax Error</strong> – mistake in writing code.
          <br />
          Example:
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>var a = ; // Missing value</code></pre>
          </div>
        </li>
        <li>
          <strong>Reference Error</strong> – using a variable that is not defined.
          <br />
          Example:
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>console.log(x); // x is not defined</code></pre>
          </div>
        </li>
        <li>
          <strong>Type Error</strong> – using a value in an invalid way.
          <br />
          Example:
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>null.toUpperCase(); // Cannot read properties of null</code></pre>
          </div>
        </li>
        <li>
          <strong>Logical Error</strong> – code runs but gives the wrong result.
          <br />
          Example: incorrect formula or wrong condition in an <code>if</code> statement.
        </li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">The <code>try...catch</code> Statement</h3>
      <p class="text-gray-300 mb-3">
        JavaScript provides <code>try...catch</code> to handle errors safely and prevent crashes.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>try {
  // code that may cause error
} catch (error) {
  // code to handle error
}</code></pre>
        <p class="text-gray-300 mt-2">
          Code inside <code>try</code> is monitored for errors. If an error occurs, control jumps to the
          <code>catch</code> block instead of stopping the program.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Error Handling Matters Professionally</h3>
      <p class="text-gray-300 mb-3">
        Robust error handling is mandatory in production environments. It is heavily used in:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>API calls and network communication.</li>
        <li>User input and form validation.</li>
        <li>Authentication and authorization flows.</li>
        <li>Database operations and file handling.</li>
        <li>Payment processing and critical business logic.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Without structured error handling, applications become fragile and unreliable.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Debugging in JavaScript</h3>
      <p class="text-gray-300 mb-3">
        <strong>Debugging</strong> is the process of finding and fixing errors. It is a daily activity for frontend
        developers.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><code>console.log()</code> – quick checks for values and program flow.</li>
        <li><strong>Browser DevTools</strong> – inspect variables, call stack, and network requests.</li>
        <li><strong>Breakpoints</strong> – pause code execution at a specific line to inspect state.</li>
        <li><code>try...catch</code> – capture and log unexpected errors in production.</li>
      </ul>
      <p class="text-gray-300">
        Strong debugging skills help you diagnose problems quickly, communicate issues clearly, and ship stable
        features faster.
      </p>
    `,
    syntax: [
      {
        title: 'Basic try...catch',
        content: 'try {\\n    // risky code\\n} catch (error) {\\n    console.log(error.message);\\n}'
      },
      {
        title: 'try...catch with finally',
        content: 'try {\\n    // code\\n} catch (error) {\\n    // handle error\\n} finally {\\n    // always executes\\n}'
      },
      {
        title: 'Throw Custom Error',
        content: 'throw new Error("Custom error message");'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `function divideNumbers(a, b) {

  try {

    if (b === 0) {
      throw new Error("Division by zero is not allowed");
    }

    var result = a / b;

    console.log("Result:", result);

  } catch (error) {

    console.log("Error:", error.message);

  } finally {

    console.log("Execution completed");

  }

}

divideNumbers(10, 2);
divideNumbers(10, 0);`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This program demonstrates how <code>try...catch</code> and <code>finally</code> work together to handle errors
        safely without crashing the application.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <strong>Line 1 – <code>function divideNumbers(a, b) {'{'} </code>:</strong><br />
          Defines a function that divides two numbers <code>a</code> and <code>b</code>. In real projects, this could
          represent any calculation based on user input or API data.
        </li>
        <li>
          <strong>Line 3 – <code>try {'{'} </code>:</strong><br />
          Wraps the "risky" code. Any error inside this block will be caught instead of stopping the script.
        </li>
        <li>
          <strong>Lines 5–7 – division by zero check:</strong><br />
          <code>if (b === 0) {'{'} throw new Error("Division by zero is not allowed"); {'}'}</code><br />
          Checks if the denominator is zero and throws a custom error if it is. This prevents invalid calculations and
          shows how to validate input before using it.
        </li>
        <li>
          <strong>Line 9 – <code>var result = a / b;</code>:</strong><br />
          Performs the actual division. This line only runs when no error has been thrown above.
        </li>
        <li>
          <strong>Line 11 – <code>console.log("Result:", result);</code>:</strong><br />
          Logs the computed result. For the first call with <code>(10, 2)</code>, the output is
          <code>Result: 5</code>.
        </li>
        <li>
          <strong>Line 14 – <code}catch (error) {'{'} </code>:</strong><br />
          Runs only if an error occurs inside the <code>try</code> block. This prevents the program from crashing and
          lets you handle the problem gracefully.
        </li>
        <li>
          <strong>Line 16 – <code>console.log("Error:", error.message);</code>:</strong><br />
          Logs a readable error message. For the second call with <code>(10, 0)</code>, the output is
          <code>Error: Division by zero is not allowed</code>.
        </li>
        <li>
          <strong>Line 19 – <code>finally {'{'} </code>:</strong><br />
          The <code>finally</code> block always executes, whether there was an error or not. It is useful for cleanup
          tasks such as closing connections or hiding loading indicators.
        </li>
        <li>
          <strong>Line 21 – <code>console.log("Execution completed");</code>:</strong><br />
          Prints <code>Execution completed</code> after each function call, showing that the cleanup step runs both in
          success and error cases.
        </li>
        <li>
          <strong>Lines 28–29 – function calls:</strong><br />
          <code>divideNumbers(10, 2);</code> triggers the success path:
          <br />Result: 5
          <br />Execution completed
          <br />
          <code>divideNumbers(10, 0);</code> triggers the error path:
          <br />Error: Division by zero is not allowed
          <br />Execution completed
        </li>
      </ul>
      <p class="text-gray-300">
        In professional applications, this exact pattern is used around API requests, payment processing, form
        validation, and any other critical logic where failures must be handled gracefully instead of crashing the app.
      </p>
    `
  };
}

if (module1 && module1.lessons[8]) {
  module1.lessons[8] = {
    ...module1.lessons[8],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">1.9 Memory Management and Performance Basics</h2>
      <p class="text-gray-300 mb-4">
        <strong>Memory management</strong> is how JavaScript allocates memory, uses it while your program runs, and
        frees it when it is no longer needed. Even though JavaScript has automatic garbage collection, developers still
        need to write efficient code to avoid memory leaks and performance issues.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">How Memory Works in JavaScript</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
        <li>
          <strong>Memory Allocation</strong><br />
          Memory is automatically allocated when you create variables, objects, functions, and arrays.
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>var num = 10;
var user = { name: "Test" };</code></pre>
          </div>
        </li>
        <li>
          <strong>Memory Usage</strong><br />
          During execution, the program reads and writes values stored in memory (for example updating state, processing
          arrays, or handling API responses).
        </li>
        <li>
          <strong>Garbage Collection</strong><br />
          When an object is no longer referenced by any part of the code, JavaScript's garbage collector can remove it
          from memory. Modern engines typically use a <strong>mark-and-sweep</strong> algorithm: reachable objects are
          "marked", and everything else is cleaned up.
        </li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What Causes Memory Leaks?</h3>
      <p class="text-gray-300 mb-3">
        A memory leak happens when memory is not released even though it is no longer needed. Over time this leads to
        higher RAM usage and a slower, less responsive UI.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Global variables that live for the entire lifetime of the app.</li>
        <li>Forgotten timers (for example, <code>setInterval</code> that is never cleared).</li>
        <li>Event listeners that are not removed when components unmount.</li>
        <li>Closures holding references to large objects that are no longer needed.</li>
        <li>Large arrays or caches that are never cleared.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Performance Basics</h3>
      <p class="text-gray-300 mb-3">
        Performance in JavaScript applications depends on both CPU usage and memory usage. Some key practices include:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Writing efficient loops and avoiding unnecessary repeated work.</li>
        <li>Reducing unnecessary DOM updates and re-renders.</li>
        <li>Minimizing memory usage by cleaning up references when they are no longer needed.</li>
        <li>Avoiding heavy synchronous operations on the main thread.</li>
        <li>Choosing appropriate data structures for the job (arrays, maps, sets, etc.).</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Professional Importance</h3>
      <p class="text-gray-300 mb-3">
        Memory optimization is critical in modern frontend environments, especially when applications run for a long time
        in the browser:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Large React applications with many components and stateful hooks.</li>
        <li>Real-time dashboards that stream live data.</li>
        <li>Enterprise web apps used all day in corporate environments.</li>
        <li>Mobile web apps running on devices with limited RAM.</li>
      </ul>
      <p class="text-gray-300">
        Poor memory handling can lead to slow UI, browser tab freezes, crashes, and high CPU usage. Understanding memory
        management basics is essential for building smooth, scalable frontend systems.
      </p>
    `,
    syntax: [
      {
        title: 'Clearing Interval',
        content: 'clearInterval(intervalId);'
      },
      {
        title: 'Removing Event Listener',
        content: 'element.removeEventListener("click", handler);'
      },
      {
        title: 'Avoiding Global Variable',
        content: 'function test() {\\n    var localVariable = 10;\\n}'
      },
      {
        title: 'Nullifying Reference',
        content: 'object = null;'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `function startCounter() {

  var count = 0;

  var intervalId = setInterval(function() {

    count++;
    console.log("Count:", count);

    if (count === 5) {
      clearInterval(intervalId);
      console.log("Interval cleared to prevent memory leak");
    }

  }, 1000);

}

startCounter();`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This program demonstrates how a repeating timer can be cleaned up properly to avoid memory leaks and
        unnecessary background work.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <strong>Line 1 – <code>function startCounter() {'{'} </code>:</strong><br />
          Declares a function that will start a counter. In real projects this pattern appears in timers, polling APIs,
          and real-time dashboards.
        </li>
        <li>
          <strong>Line 3 – <code>var count = 0;</code>:</strong><br />
          Allocates memory for the <code>count</code> variable that tracks how many times the interval has fired.
        </li>
        <li>
          <strong>Line 5 – <code>var intervalId = setInterval(function() {'{'} ... {'}'}, 1000);</code>:</strong><br />
          Creates a repeating timer that runs every 1000 milliseconds (1 second). The returned <code>intervalId</code>
          is a reference used later to clear the timer. If this interval is never cleared, it can keep running forever
          and contribute to a memory leak.
        </li>
        <li>
          <strong>Lines 7–8 – <code>count++;</code> and <code>console.log("Count:", count);</code>:</strong><br />
          Increments the counter and logs the current value every second.<br />
          Example output:<br />
          <code>Count: 1</code><br />
          <code>Count: 2</code><br />
          <code>Count: 3</code><br />
          <code>Count: 4</code><br />
          <code>Count: 5</code>
        </li>
        <li>
          <strong>Lines 10–13 – stop condition:</strong><br />
          <code>if (count === 5) {'{'} clearInterval(intervalId); console.log("Interval cleared to prevent memory leak"); {'}'}</code><br />
          When <code>count</code> reaches <code>5</code>, the interval is cleared. This stops future executions and
          releases the associated resources, preventing the timer from running forever.
        </li>
        <li>
          <strong>Line 19 – <code>startCounter();</code>:</strong><br />
          Starts the counter. The final output sequence is:<br />
          <code>Count: 1</code><br />
          <code>Count: 2</code><br />
          <code>Count: 3</code><br />
          <code>Count: 4</code><br />
          <code>Count: 5</code><br />
          <code>Interval cleared to prevent memory leak</code>
        </li>
      </ul>
      <p class="text-gray-300">
        In professional applications, similar cleanup is required for intervals in React <code>useEffect</code> hooks,
        event listeners on DOM elements, and long-running API polling. Always cleaning up timers and references is a
        core performance and memory management principle.
      </p>
    `
  };
}

const module2 = courseData.find((m) => m.id === 'module-2');

if (module2 && module2.lessons[0]) {
  module2.lessons[0] = {
    ...module2.lessons[0],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.1 Git Architecture and Version Control Concepts</h2>
      <p class="text-gray-300 mb-4">
        <strong>Version control</strong> is a system that helps developers track changes in code, restore previous
        versions, collaborate with teams, and manage the entire project history safely. Without version control, it is
        almost impossible to work in a professional software environment.
      </p>
      <p class="text-gray-300 mb-4">
        <strong>Git</strong> is the most widely used version control system today. It is a distributed system that keeps
        track of changes in your files and lets you save versions, create branches, merge code, and collaborate safely.
        Git mainly runs locally on your machine, while platforms like <strong>GitHub</strong> host Git repositories in
        the cloud for backup and collaboration.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Core Components of Git Architecture</h3>
      <p class="text-gray-300 mb-3">
        Git thinks about your project in three main areas:
      </p>
      <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
        <li>
          <strong>Working Directory</strong><br />
          This is your actual project folder where you write and edit code.
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>project-folder/
  index.html
  script.js
  style.css</code></pre>
          </div>
          <p class="text-gray-300 mt-2">
            This is your active development area where files start their journey before being tracked by Git.
          </p>
        </li>
        <li>
          <strong>Staging Area (Index)</strong><br />
          This is a middle layer where you prepare files before permanently saving them in the repository. Git only
          includes staged files in the next commit.
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>git add filename</code></pre>
          </div>
        </li>
        <li>
          <strong>Repository (.git folder)</strong><br />
          This hidden folder stores all commits, version history, and branch information.
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>git commit -m "message"</code></pre>
          </div>
        </li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Git Workflow Overview</h3>
      <p class="text-gray-300 mb-3">
        A typical professional Git workflow moves changes through these three areas:
      </p>
      <p class="text-gray-300 mb-2">
        <strong>Working Directory → Staging Area → Repository</strong>
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Step 1: Modify files in the working directory.</li>
        <li>Step 2: Stage the relevant files using <code>git add</code>.</li>
        <li>Step 3: Commit the staged changes using <code>git commit</code>.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is a Commit?</h3>
      <p class="text-gray-300 mb-3">
        A <strong>commit</strong> is a snapshot of your project at a specific point in time. Each commit records exactly
        what changed and who made the change.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Unique commit ID (hash).</li>
        <li>Author information.</li>
        <li>Timestamp.</li>
        <li>Commit message describing the change.</li>
      </ul>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>git commit -m "Added login feature"</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Git is Important Professionally</h3>
      <p class="text-gray-300 mb-3">
        Git is a non-negotiable skill in modern software development. It is used in:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>All software companies for day-to-day development.</li>
        <li>Team collaboration and feature development.</li>
        <li>Deployment pipelines and CI/CD workflows.</li>
        <li>Open source projects and community contributions.</li>
      </ul>
      <p class="text-gray-300">
        Every frontend, backend, and full stack developer is expected to use Git daily to manage code safely, work with
        branches, and recover from mistakes without losing work.
      </p>
    `,
    syntax: [
      {
        title: 'Initialize Git Repository',
        content: 'git init'
      },
      {
        title: 'Check Status',
        content: 'git status'
      },
      {
        title: 'Add File to Staging Area',
        content: 'git add filename'
      },
      {
        title: 'Add All Files',
        content: 'git add .'
      },
      {
        title: 'Commit Files',
        content: 'git commit -m "commit message"'
      },
      {
        title: 'View Commit History',
        content: 'git log'
      }
    ],
    liveCode: `git init
git status
git add index.html
git commit -m "Added index.html"
git log`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example walks through a complete basic Git workflow from repository initialization to viewing commit
        history. Think of it as the minimum professional flow every developer must know.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <strong>Step 1 – <code>git init</code>:</strong><br />
          Initializes a new Git repository in the current project folder. Git creates a hidden <code>.git</code> directory
          and starts tracking the project. Output is typically:
          <br /><code>Initialized empty Git repository</code>.
        </li>
        <li>
          <strong>Step 2 – <code>git status</code>:</strong><br />
          Shows the current state of the working directory. You can see:
          untracked files, modified files, and which files are staged. For a new file like <code>index.html</code>, it
          appears as untracked.
        </li>
        <li>
          <strong>Step 3 – <code>git add index.html</code>:</strong><br />
          Moves <code>index.html</code> from the working directory into the staging area. Git now prepares this file to
          be included in the next commit. Only staged files are saved when you run <code>git commit</code>.
        </li>
        <li>
          <strong>Step 4 – <code>git commit -m "Added index.html"</code>:</strong><br />
          Creates a permanent snapshot of the current staged changes. The commit stores the file contents, a unique ID,
          author, timestamp, and the message <code>"Added index.html"</code>.
        </li>
        <li>
          <strong>Step 5 – <code>git log</code>:</strong><br />
          Displays the commit history. You will see entries similar to:
          <br /><code>commit 7d9a1234</code>
          <br /><code>Author: Developer</code>
          <br /><code>Message: Added index.html</code>
        </li>
      </ul>
      <p class="text-gray-300">
        The execution flow can be summarized as: create or modify files → <code>git add</code> → <code>git commit</code>
        → <code>git log</code>. In real-world projects this pattern is used every day for saving code versions, enabling
        team collaboration, managing large codebases, deployment systems, and recovering previous working states when
        something goes wrong.
      </p>
    `
  };
}

if (module2 && module2.lessons[1]) {
  module2.lessons[1] = {
    ...module2.lessons[1],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.2 Repository Initialization and Commit Workflow</h2>
      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is Repository Initialization?</h3>
      <p class="text-gray-300 mb-3">
        Repository initialization is the process of converting a normal project folder into a Git-tracked project.
        After initialization, Git starts tracking changes, a hidden <code>.git</code> folder is created, and the folder
        becomes a local repository.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>git init</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is Commit Workflow?</h3>
      <p class="text-gray-300 mb-3">
        Commit workflow is the professional process of saving code changes in Git. It follows a structured pipeline:
      </p>
      <p class="text-gray-300 mb-3">
        <strong>Working Directory → Staging Area → Repository</strong>
      </p>

      <h3 class="text-lg font-semibold text-white mt-4 mb-2">Professional Commit Workflow Steps</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
        <li>
          <strong>Step 1: Modify Files</strong><br />
          You write or update your code in the working directory.
        </li>
        <li>
          <strong>Step 2: Check Status</strong><br />
          See what files changed:
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>git status</code></pre>
          </div>
        </li>
        <li>
          <strong>Step 3: Stage Changes</strong><br />
          Select files to be included in the next commit:
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>git add filename</code></pre>
          </div>
        </li>
        <li>
          <strong>Step 4: Commit Changes</strong><br />
          Create a version snapshot:
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>git commit -m "message"</code></pre>
          </div>
        </li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why This Workflow Matters</h3>
      <p class="text-gray-300 mb-2">Professional teams use this workflow to:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Commit small, logical changes.</li>
        <li>Write meaningful commit messages.</li>
        <li>Track history clearly.</li>
        <li>Avoid committing broken code.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        This workflow ensures clean history, easier debugging, and better collaboration.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What Makes a Good Commit Message?</h3>
      <p class="text-gray-300 mb-2">Bad example:</p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>fixed stuff</code></pre>
      </div>
      <p class="text-gray-300 mb-2">Good example:</p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>Added login validation logic</code></pre>
      </div>
      <p class="text-gray-300">
        Professional rule: a commit message should explain <strong>why</strong> the change was made, not just
        <strong>what</strong> changed.
      </p>
    `,
    syntax: [
      {
        title: 'Initialize Repository',
        content: 'git init'
      },
      {
        title: 'Check Status',
        content: 'git status'
      },
      {
        title: 'Add Specific File',
        content: 'git add filename'
      },
      {
        title: 'Add All Files',
        content: 'git add .'
      },
      {
        title: 'Commit Changes',
        content: 'git commit -m "meaningful message"'
      },
      {
        title: 'View Commit History',
        content: 'git log'
      }
    ],
    liveCode: `git init
git status
git add index.html
git commit -m "Initial project setup with index file"
git log`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example demonstrates a complete repository initialization and commit workflow using Git commands. It follows
        the exact professional sequence used in real projects.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4 space-y-2">
        <li>
          <strong>Step 1: Initialize Repository – <code>git init</code></strong><br />
          Creates a hidden <code>.git</code> folder in the current directory, starts tracking the project, and converts
          the folder into a Git repository.<br />
          <span class="text-gray-400">Output:</span> <code>Initialized empty Git repository</code>
        </li>
        <li>
          <strong>Step 2: Check Current Status – <code>git status</code></strong><br />
          Shows untracked, modified, and staged files.<br />
          <span class="text-gray-400">Example output:</span><br />
          <code>Untracked files:</code><br />
          <code>  index.html</code><br />
          Meaning: Git sees <code>index.html</code> but is not tracking it yet.
        </li>
        <li>
          <strong>Step 3: Stage File – <code>git add index.html</code></strong><br />
          Moves <code>index.html</code> from the working directory to the staging area.<br />
          Git now prepares this file to be included in the next commit.
        </li>
        <li>
          <strong>Step 4: Commit File – <code>git commit -m "Initial project setup with index file"</code></strong><br />
          Creates the first snapshot and permanently saves the current state.<br />
          Stores a commit ID, author details, timestamp, and the message
          <code>Initial project setup with index file</code>.<br />
          <span class="text-gray-400">Example output:</span><br />
          <code>[main abc1234] Initial project setup with index file</code><br />
          <code> 1 file changed</code>
        </li>
        <li>
          <strong>Step 5: Verify Commit History – <code>git log</code></strong><br />
          Displays the commit history including:<br />
          commit ID, author, date, and message.<br />
          <span class="text-gray-400">Example output:</span><br />
          <code>commit abc1234</code><br />
          <code>Author: Developer</code><br />
          <code>Message: Initial project setup with index file</code>
        </li>
      </ul>
      <h4 class="text-lg font-semibold text-white mb-2">Execution Flow Summary</h4>
      <p class="text-gray-300 mb-3">
        Create file → <code>git status</code> → <code>git add</code> → <code>git commit</code> → <code>git log</code>
      </p>
      <h4 class="text-lg font-semibold text-white mb-2">Professional Best Practices</h4>
      <ul class="list-disc list-inside text-gray-300 space-y-1">
        <li>Commit frequently.</li>
        <li>Keep commits small and focused.</li>
        <li>Write clear, meaningful commit messages.</li>
        <li>Never commit sensitive data.</li>
        <li>Always check <code>git status</code> before committing.</li>
      </ul>
    `
  };
}

if (module2 && module2.lessons[2]) {
  module2.lessons[2] = {
    ...module2.lessons[2],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.3 Branching Strategy and Branch Management</h2>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is a Branch in Git?</h3>
      <p class="text-gray-300 mb-3">
        A branch is a separate version of your code that allows you to work on new features or fixes without affecting
        the main project. By default, Git creates a branch called <strong>main</strong>, which is the primary branch.
      </p>
      <p class="text-gray-300 mb-4">
        Branches allow developers to:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Develop new features safely.</li>
        <li>Fix bugs without affecting stable code.</li>
        <li>Work in teams without conflicts.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why Branching is Important</h3>
      <p class="text-gray-300 mb-2">Without branches:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Every change affects the main project.</li>
        <li>Bugs can break production code.</li>
        <li>Team collaboration becomes unsafe.</li>
      </ul>
      <p class="text-gray-300 mb-2">With branches:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Developers work independently.</li>
        <li>Code remains stable.</li>
        <li>Features can be tested safely.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Real Professional Workflow Example</h3>
      <p class="text-gray-300 mb-3">
        In a real project, branches are mapped to features and fixes, for example:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><code>main</code> → production code</li>
        <li><code>feature-login</code> → login feature development</li>
        <li><code>feature-dashboard</code> → dashboard development</li>
        <li><code>bugfix-header</code> → fixing header issue</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Each feature is developed in its own branch. After completion and testing, it is merged into
        <strong>main</strong>.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">How Branch Works Internally</h3>
      <p class="text-gray-300 mb-3">
        Git does not copy all the files when you create a branch. Instead, it creates a lightweight pointer to commits.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>main    → Commit A → Commit B
feature → Commit B → Commit C</code></pre>
      </div>
      <p class="text-gray-300 mb-4">
        This is why branches are fast and cheap to create, even in large repositories.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Branch Workflow</h3>
      <p class="text-gray-300 mb-3">
        A professional branch workflow typically looks like:
      </p>
      <p class="text-gray-300 mb-4">
        <strong>Create branch → Switch branch → Work → Commit → Merge</strong>
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Types of Branches Used in Industry</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
        <li>
          <strong>main branch</strong><br />
          Holds stable production-ready code.
        </li>
        <li>
          <strong>feature branch</strong><br />
          Used for new features.<br />
          Examples: <code>feature-login</code>, <code>feature-payment</code>
        </li>
        <li>
          <strong>bugfix branch</strong><br />
          Used to fix specific bugs.<br />
          Example: <code>bugfix-navbar</code>
        </li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why Branch Management is Critical</h3>
      <p class="text-gray-300 mb-3">
        Branching and branch management are used in:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Team development.</li>
        <li>Feature development.</li>
        <li>Production deployment.</li>
        <li>CI/CD pipelines.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Proper branching strategies prevent breaking stable code and enable safe, scalable development for growing
        teams and projects.
      </p>
    `,
    syntax: [
      {
        title: 'View Branches',
        content: 'git branch'
      },
      {
        title: 'Create Branch',
        content: 'git branch branch-name'
      },
      {
        title: 'Switch Branch',
        content: 'git checkout branch-name'
      },
      {
        title: 'Create and Switch Branch (Professional)',
        content: 'git checkout -b branch-name'
      },
      {
        title: 'View Current Branch',
        content: 'git branch --show-current'
      },
      {
        title: 'Delete Branch',
        content: 'git branch -d branch-name'
      }
    ],
    liveCode: `git branch
git branch feature-login
git checkout feature-login
git checkout -b feature-dashboard
git branch --show-current
git checkout main`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example demonstrates a complete branching workflow in Git: creating, switching, and managing branches while
        keeping the main codebase stable.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4 space-y-2">
        <li>
          <strong>Step 1: Check Current Branch – <code>git branch</code></strong><br />
          Lists all branches in the repository.<br />
          <span class="text-gray-400">Example output:</span><br />
          <code>* main</code><br />
          The <code>*</code> symbol indicates the current active branch.
        </li>
        <li>
          <strong>Step 2: Create New Branch – <code>git branch feature-login</code></strong><br />
          Creates a new branch named <code>feature-login</code> based on the current branch.<br />
          Important: this does <strong>not</strong> switch to the new branch yet.
        </li>
        <li>
          <strong>Step 3: Switch to New Branch – <code>git checkout feature-login</code></strong><br />
          Switches your working directory to the <code>feature-login</code> branch.<br />
          All new commits now belong to this branch.<br />
          <span class="text-gray-400">Example output:</span> <code>Switched to branch 'feature-login'</code>
        </li>
        <li>
          <strong>Step 4: Create and Switch Branch (Professional) – <code>git checkout -b feature-dashboard</code></strong><br />
          Creates a new branch and switches to it in one command.<br />
          Equivalent to running:<br />
          <code>git branch feature-dashboard</code><br />
          <code>git checkout feature-dashboard</code><br />
          Most professionals prefer this shorter form.
        </li>
        <li>
          <strong>Step 5: Verify Current Branch – <code>git branch --show-current</code></strong><br />
          Prints the name of the active branch.<br />
          <span class="text-gray-400">Example output:</span> <code>feature-dashboard</code>
        </li>
        <li>
          <strong>Step 6: Switch Back to Main Branch – <code>git checkout main</code></strong><br />
          Returns you to the <code>main</code> branch where production code lives.<br />
          This ensures that experimental or in-progress features do not affect stable code.
        </li>
      </ul>
      <h4 class="text-lg font-semibold text-white mb-2">Execution Flow Summary</h4>
      <p class="text-gray-300 mb-3">
        <code>git branch</code> → <code>git branch feature-name</code> → <code>git checkout feature-name</code> →
        <code>git checkout main</code>
      </p>
      <h4 class="text-lg font-semibold text-white mb-2">Professional Real-World Example</h4>
      <p class="text-gray-300 mb-2">
        Typical branches in a real project:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><code>main</code></li>
        <li><code>feature-authentication</code></li>
        <li><code>feature-payment</code></li>
        <li><code>feature-profile</code></li>
        <li><code>bugfix-login-error</code></li>
      </ul>
      <p class="text-gray-300">
        Each developer works in a separate branch. After completion, the branch is reviewed, tested, and merged into
        <code>main</code>. Branching is used in React projects, enterprise applications, team development, and
        deployment pipelines to ensure safe and scalable development.
      </p>
    `
  };
}

if (module2 && module2.lessons[3]) {
  module2.lessons[3] = {
    ...module2.lessons[3],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.4 Merging and Resolving Merge Conflicts</h2>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is Merging in Git?</h3>
      <p class="text-gray-300 mb-3">
        Merging is the process of combining changes from one branch into another. The most common case is merging a
        completed feature branch back into the <strong>main</strong> branch.
      </p>
      <p class="text-gray-300 mb-4">
        After completing a feature, it is merged into the main branch so that production code receives the new changes.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why Merging is Important</h3>
      <p class="text-gray-300 mb-2">Merging allows:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Feature integration.</li>
        <li>Team collaboration.</li>
        <li>Code consolidation.</li>
        <li>Safe production updates.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Without merging, branches would stay isolated and changes would never reach the main project.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Types of Merge in Git</h3>
      <h4 class="text-lg font-semibold text-white mt-3 mb-1">1️⃣ Fast-Forward Merge</h4>
      <p class="text-gray-300 mb-2">
        A fast-forward merge occurs when the main branch has no new commits after the feature branch was created.
      </p>
      <p class="text-gray-300 mb-3">Example:</p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>main    → A
feature → A → B → C</code></pre>
      </div>
      <p class="text-gray-300 mb-4">
        Merging simply moves the <strong>main</strong> pointer forward to commit C. No extra merge commit is created.
      </p>

      <h4 class="text-lg font-semibold text-white mt-3 mb-1">2️⃣ Three-Way Merge</h4>
      <p class="text-gray-300 mb-2">
        A three-way merge occurs when both branches have new commits since the branch was created.
      </p>
      <p class="text-gray-300 mb-3">Example:</p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>main    → A → D
feature → A → B → C</code></pre>
      </div>
      <p class="text-gray-300 mb-4">
        Git compares both histories and creates a new merge commit that combines the changes from both branches.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is a Merge Conflict?</h3>
      <p class="text-gray-300 mb-3">
        A merge conflict happens when the same file, on the same line, is modified differently in two branches. Git
        cannot automatically decide which version to keep, so manual resolution is required.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Conflict Example Structure</h3>
      <p class="text-gray-300 mb-2">
        When a conflict occurs, the file will contain conflict markers like:
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
Code from main branch
=======
Code from feature branch
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-branch</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        You must edit the file, remove the conflict markers, keep the correct final code, and then commit again.
      </p>
    `,
    syntax: [
      {
        title: 'Switch to Main Branch',
        content: 'git checkout main'
      },
      {
        title: 'Merge Branch',
        content: 'git merge branch-name'
      },
      {
        title: 'Abort Merge (if needed)',
        content: 'git merge --abort'
      },
      {
        title: 'Stage After Resolving Conflict',
        content: 'git add filename'
      },
      {
        title: 'Commit Conflict Resolution',
        content: 'git commit -m "Resolved merge conflict"'
      }
    ],
    liveCode: `git checkout -b feature-message
git add index.html
git commit -m "Updated heading in feature branch"
git checkout main
git add index.html
git commit -m "Updated heading in main branch"
git merge feature-message
git add index.html
git commit -m "Resolved merge conflict between main and feature-message"`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example walks through a realistic merge scenario where both branches change the same line, causing a merge
        conflict that must be resolved manually.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4 space-y-2">
        <li>
          <strong>Step 1: Create Feature Branch – <code>git checkout -b feature-message</code></strong><br />
          Creates a new branch named <code>feature-message</code> and switches to it.<br />
          Development begins safely without affecting the <code>main</code> branch.
        </li>
        <li>
          <strong>Step 2: Modify a File and Commit – <code>git add index.html</code> + commit</strong><br />
          You update <code>index.html</code> in the feature branch, stage it with <code>git add index.html</code>, and
          save the snapshot using:<br />
          <code>git commit -m "Updated heading in feature branch"</code><br />
          The change now lives only in <code>feature-message</code>.
        </li>
        <li>
          <strong>Step 3: Switch Back to Main Branch – <code>git checkout main</code></strong><br />
          Returns to the production (main) branch so you can make independent changes there.
        </li>
        <li>
          <strong>Step 4: Modify Same Line and Commit – <code>git add index.html</code> + commit</strong><br />
          You change the same line in <code>index.html</code> on <code>main</code> and commit with:<br />
          <code>git commit -m "Updated heading in main branch"</code><br />
          Now both branches have different changes on the same line.
        </li>
        <li>
          <strong>Step 5: Merge Feature into Main – <code>git merge feature-message</code></strong><br />
          Git attempts to merge <code>feature-message</code> into <code>main</code>. Because the same line was modified
          differently, Git cannot auto-merge.<br />
          <span class="text-gray-400">Typical terminal message:</span><br />
          <code>CONFLICT (content): Merge conflict in index.html</code>
        </li>
        <li>
          <strong>Step 6: Open File and Resolve Conflict</strong><br />
          The file shows conflict markers:
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 mb-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
&lt;h1&gt;Main Version&lt;/h1&gt;
=======
&lt;h1&gt;Feature Version&lt;/h1&gt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-message</code></pre>
          </div>
          Explanation of markers:<br />
          <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> → code from the main branch<br />
          <code>=======</code> → separator between versions<br />
          <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-message</code> → code from the feature branch<br />
          You must choose the correct final version (for example,
          <code>&lt;h1&gt;Final Updated Version&lt;/h1&gt;</code>), remove all markers, and save the file.
        </li>
        <li>
          <strong>Step 7: Stage Resolved File – <code>git add index.html</code></strong><br />
          Marks the conflict as resolved and prepares the fixed file for the merge commit.
        </li>
        <li>
          <strong>Step 8: Commit Resolution – <code>git commit -m "Resolved merge conflict between main and feature-message"</code></strong><br />
          Creates a merge commit that combines both branches. The branches are now successfully merged.
        </li>
      </ul>
      <h4 class="text-lg font-semibold text-white mb-2">Execution Flow Summary</h4>
      <p class="text-gray-300 mb-3">
        Create branch → make changes → switch to main → merge branch → resolve conflict → commit resolution
      </p>
      <h4 class="text-lg font-semibold text-white mb-2">Professional Best Practices</h4>
      <ul class="list-disc list-inside text-gray-300 mb-3 space-y-1">
        <li>Pull the latest changes before merging.</li>
        <li>Keep branches small and focused.</li>
        <li>Merge frequently to reduce conflicts.</li>
        <li>Write clear commit messages for merge resolutions.</li>
        <li>Resolve conflicts immediately instead of postponing them.</li>
      </ul>
      <p class="text-gray-300">
        Merging is used in team projects, pull requests, production deployments, CI/CD pipelines, and enterprise
        software development. Understanding merge conflicts and how to resolve them is mandatory for professional
        developers.
      </p>
    `
  };
}

if (module2 && module2.lessons[4]) {
  module2.lessons[4] = {
    ...module2.lessons[4],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.5 Introduction to GitHub and Remote Repositories</h2>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is GitHub?</h3>
      <p class="text-gray-300 mb-3">
        GitHub is a cloud platform that allows you to store your code online, manage versions, collaborate with other
        developers, and back up your projects.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Store code online.</li>
        <li>Track versions of your project.</li>
        <li>Collaborate with teammates.</li>
        <li>Keep a safe backup of your work.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        GitHub works together with Git:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Git</strong> → Version control tool on your system.</li>
        <li><strong>GitHub</strong> → Online platform that hosts Git repositories.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is a Repository?</h3>
      <p class="text-gray-300 mb-3">
        A repository (repo) is a project folder tracked by Git. It contains your source code, supporting files, and
        complete version history.
      </p>
      <pre class="bg-gray-900 text-gray-100 p-3 rounded mb-3 overflow-x-auto"><code>project/
  ├── index.html
  ├── style.css
  └── script.js</code></pre>
      <p class="text-gray-300 mb-4">
        This folder becomes a repository after you initialize it with Git.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Local Repository vs Remote Repository</h3>
      <p class="text-gray-300 mb-2">
        <strong>Local repository</strong> – lives on your computer and is used for development.
      </p>
      <p class="text-gray-300 mb-2">
        <strong>Remote repository</strong> – lives on GitHub servers and is used for backup and collaboration.
      </p>
      <p class="text-gray-300 mb-3">
        Typical workflow:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Local Repository → <strong>push</strong> → GitHub Repository</li>
        <li>GitHub Repository → <strong>pull</strong> → Local Repository</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why GitHub is Used in Professional Development</h3>
      <p class="text-gray-300 mb-3">
        In real-world frontend and full-stack projects, GitHub is used for:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Version tracking and history.</li>
        <li>Team collaboration with branches and pull requests.</li>
        <li>Code backup and disaster recovery.</li>
        <li>Integrating with CI/CD pipelines and deployments.</li>
        <li>Code review and quality control.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Every professional frontend project uses GitHub or a similar platform for source control.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">GitHub Workflow Overview</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-1 mb-4">
        <li>Create local project folder.</li>
        <li>Initialize Git in the folder.</li>
        <li>Create a GitHub repository.</li>
        <li>Connect local repo to GitHub (remote).</li>
        <li>Push your code to GitHub.</li>
      </ol>
    `,
    syntax: [
      {
        title: 'Initialize Git Repository',
        content: 'git init'
      },
      {
        title: 'Connect to GitHub Remote',
        content: 'git remote add origin https://github.com/username/repository.git'
      },
      {
        title: 'Push Code to GitHub',
        content: 'git push -u origin main'
      },
      {
        title: 'Check Remote Repository',
        content: 'git remote -v'
      }
    ],
    liveCode: `# Step 1: Create project folder
mkdir frontend-project
cd frontend-project

# Step 2: Initialize Git
git init

# Step 3: Create example file
echo "<h1>Frontend Project</h1>" > index.html

# Step 4: Add file to Git
git add index.html

# Step 5: Commit file
git commit -m "Initial commit"

# Step 6: Connect to GitHub remote repository
git remote add origin https://github.com/username/frontend-project.git

# Step 7: Push to GitHub
git push -u origin main
`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This live example walks through the complete flow of taking a brand new local frontend project and pushing it to
        GitHub. Read each step carefully and map it to what you see in the editor and the Git commands.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Step 1: Create Project Folder</h3>
      <p class="text-gray-300 mb-1">
        <code>mkdir frontend-project</code> creates a new folder called <code>frontend-project</code>. This will contain
        your HTML, CSS, and JavaScript files.
      </p>
      <p class="text-gray-300 mb-3">
        <code>cd frontend-project</code> moves into that folder so all further commands run inside the project directory.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Step 2: Initialize Git</h3>
      <p class="text-gray-300 mb-3">
        <code>git init</code> creates a hidden <code>.git</code> folder. This converts your normal project folder into a
        Git repository with version history capability.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Step 3: Create Example File</h3>
      <p class="text-gray-300 mb-3">
        <code>echo "&lt;h1&gt;Frontend Project&lt;/h1&gt;" &gt; index.html</code> creates a simple
        <code>index.html</code> file and writes a heading into it. This simulates your first project file.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Step 4: Add File to Git</h3>
      <p class="text-gray-300 mb-3">
        <code>git add index.html</code> moves the file into the <strong>staging area</strong>. Staged files are prepared
        to be included in the next commit (snapshot).
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Step 5: Commit File</h3>
      <p class="text-gray-300 mb-3">
        <code>git commit -m "Initial commit"</code> creates the first snapshot of your project. Git stores the current
        state of <code>index.html</code> in the local repository with the message "Initial commit".
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Step 6: Connect to GitHub Remote Repository</h3>
      <p class="text-gray-300 mb-2">
        <code>git remote add origin https://github.com/username/frontend-project.git</code> links your local repository
        to a GitHub repository.
      </p>
      <p class="text-gray-300 mb-3">
        <code>origin</code> is the short name for the remote, and the URL is the exact GitHub repository address.
        Together they tell Git where to push and pull code.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Step 7: Push to GitHub</h3>
      <p class="text-gray-300 mb-2">
        <code>git push -u origin main</code> uploads your local commits to the <code>main</code> branch on GitHub.
      </p>
      <p class="text-gray-300 mb-3">
        <code>-u</code> sets the upstream, so in the future you can simply run <code>git push</code> without specifying
        the remote and branch.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Execution Flow</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Create project folder and move into it.</li>
        <li>Initialize Git to start tracking changes.</li>
        <li>Create project files.</li>
        <li>Add and commit files to local repository.</li>
        <li>Connect local repository to GitHub.</li>
        <li>Push commits so code is stored online.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">What Happens Internally</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>The local <code>.git</code> folder stores your entire version history.</li>
        <li>The remote repository on GitHub stores the same history online.</li>
        <li><strong>push</strong> sends new commits from local to remote.</li>
        <li><strong>pull</strong> brings new commits from remote to local.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Real-World Professional Usage</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>Frontend projects (React, Angular, Vue) are always stored in GitHub repos.</li>
        <li>Teams use branches and pull requests on top of this basic push/pull flow.</li>
        <li>CI/CD pipelines trigger automatically when code is pushed to GitHub.</li>
        <li>This workflow is standard for enterprise applications and startup projects.</li>
      </ul>
    `
  };
}

if (module2 && module2.lessons[5]) {
  module2.lessons[5] = {
    ...module2.lessons[5],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.6 Pull Requests and Code Review Workflow</h2>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is a Pull Request?</h3>
      <p class="text-gray-300 mb-3">
        A Pull Request (PR) is a request to merge your code changes from one branch into another branch.
      </p>
      <p class="text-gray-300 mb-2">It allows teams to:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Review code.</li>
        <li>Suggest improvements.</li>
        <li>Detect bugs.</li>
        <li>Maintain code quality.</li>
        <li>Approve before merging.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        Pull Requests are essential in professional development. On platforms like GitHub, Pull Requests are the core
        collaboration feature.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why Pull Requests Are Used</h3>
      <p class="text-gray-300 mb-3">
        In professional teams, developers do not directly push to the <strong>main</strong> branch. Instead, they follow
        a controlled workflow:
      </p>
      <p class="text-gray-300 mb-3">
        <strong>Create branch → Make changes → Push branch → Create Pull Request → Review → Merge</strong>
      </p>
      <p class="text-gray-300 mb-3">
        This prevents breaking production code, introducing bugs, and lowering code quality.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Real-World Example Workflow</h3>
      <p class="text-gray-300 mb-3">
        <strong>main branch</strong> → stable production code<br />
        <strong>feature branch</strong> → new feature development<br />
        <strong>Pull Request</strong> → request to merge feature into main
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Pull Request Lifecycle</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-1 mb-4">
        <li>Step 1: Create feature branch.</li>
        <li>Step 2: Make changes.</li>
        <li>Step 3: Commit changes.</li>
        <li>Step 4: Push branch to GitHub.</li>
        <li>Step 5: Create Pull Request.</li>
        <li>Step 6: Code review.</li>
        <li>Step 7: Approve and merge.</li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why Code Review is Important</h3>
      <p class="text-gray-300 mb-2">
        Code review helps:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Find bugs early.</li>
        <li>Improve code quality.</li>
        <li>Maintain consistency.</li>
        <li>Improve team collaboration.</li>
        <li>Share knowledge.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        Professional companies never skip code reviews. Every important change is reviewed before being merged.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Branch Example</h3>
      <p class="text-gray-300 mb-3">
        <strong>main branch</strong> → production<br />
        <strong>feature-login</strong> → new feature branch<br />
        <strong>Pull Request</strong> → <code>feature-login</code> → <code>main</code>
      </p>
      <p class="text-gray-300 mb-4">
        Once the Pull Request is approved, the code moves into the main branch.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Types of Pull Request Merging</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Merge commit.</li>
        <li>Squash merge.</li>
        <li>Rebase merge.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Most commonly used in many teams is <strong>squash merge</strong>, which combines all commits from the feature
        branch into a single commit to keep the main branch history clean.
      </p>
    `,
    syntax: [
      {
        title: 'Create Feature Branch',
        content: 'git checkout -b feature-branch'
      },
      {
        title: 'Add and Commit Changes',
        content: 'git add . && git commit -m "Added new feature"'
      },
      {
        title: 'Push Branch to GitHub',
        content: 'git push origin feature-branch'
      },
      {
        title: 'Create Pull Request (GitHub UI)',
        content: 'Open GitHub → Click "Compare & pull request" → Create Pull Request'
      },
      {
        title: 'Merge Pull Request (After Review)',
        content: 'On GitHub → Click "Merge pull request" after approval'
      }
    ],
    liveCode: `git checkout -b feature-navbar
git add navbar.js
git commit -m "Added navbar feature"
git push origin feature-navbar`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example demonstrates a complete Pull Request workflow: creating a feature branch, committing changes, pushing
        to GitHub, and merging through a Pull Request.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4 space-y-2">
        <li>
          <strong>Step 1: Create New Branch – <code>git checkout -b feature-navbar</code></strong><br />
          <code>git checkout</code> switches branches, and the <code>-b</code> flag creates a new branch named
          <code>feature-navbar</code> and switches to it immediately.<br />
          From now on, all changes will be isolated from <code>main</code>.
        </li>
        <li>
          <strong>Step 2: Create Example File – <code>navbar.js</code></strong><br />
          File content:<br />
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 mb-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>function createNavbar() {
  console.log("Navbar created successfully");
}

createNavbar();</code></pre>
          </div>
          Explanation:<br />
          <code>function createNavbar() {</code> → defines a function named <code>createNavbar</code>.<br />
          <code>console.log("Navbar created successfully");</code> → prints a success message to the console.<br />
          <code>}</code> → ends the function.<br />
          <code>createNavbar();</code> → calls the function and executes it.<br />
          Output: <code>Navbar created successfully</code>.
        </li>
        <li>
          <strong>Step 3: Stage Changes – <code>git add navbar.js</code></strong><br />
          Stages <code>navbar.js</code> so it will be included in the next commit.
        </li>
        <li>
          <strong>Step 4: Commit Changes – <code>git commit -m "Added navbar feature"</code></strong><br />
          Creates a commit snapshot with a clear, meaningful message describing the change.
        </li>
        <li>
          <strong>Step 5: Push Branch to GitHub – <code>git push origin feature-navbar</code></strong><br />
          <code>git push</code> uploads the local commits to the remote repository.<br />
          <code>origin</code> is the remote name, and <code>feature-navbar</code> is the branch name.<br />
          After this, the branch is available on GitHub for review.
        </li>
        <li>
          <strong>Step 6: Create Pull Request (On GitHub)</strong><br />
          In the GitHub UI, you click <strong>“Compare &amp; pull request”</strong> and then
          <strong>“Create pull request”</strong> to open a PR from <code>feature-navbar</code> into
          <code>main</code>.
        </li>
        <li>
          <strong>Step 7: Merge Pull Request</strong><br />
          After code review and approval, you click <strong>“Merge pull request”</strong> in GitHub.<br />
          The feature branch changes are merged into <code>main</code>, and production code is updated safely.
        </li>
      </ul>
      <h4 class="text-lg font-semibold text-white mb-2">Execution Flow Summary</h4>
      <p class="text-gray-300 mb-3">
        <code>git checkout -b feature-navbar</code> → make changes → <code>git add .</code> → <code>git commit</code> →
        <code>git push origin feature-navbar</code> → create Pull Request → merge Pull Request
      </p>
      <h4 class="text-lg font-semibold text-white mb-2">Real Professional Workflow Example</h4>
      <p class="text-gray-300 mb-2">
        Pull Requests are used daily in:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>React projects.</li>
        <li>Startup teams.</li>
        <li>Enterprise applications.</li>
        <li>Open source projects.</li>
      </ul>
      <p class="text-gray-300">
        Every professional developer is expected to work with feature branches and Pull Requests to ensure safe,
        reviewed, and high-quality code changes.
      </p>
    `
  };
}

if (module2 && module2.lessons[6]) {
  module2.lessons[6] = {
    ...module2.lessons[6],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.7 Collaboration and Team Workflow</h2>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is Team Collaboration in Git?</h3>
      <p class="text-gray-300 mb-3">
        Team collaboration means multiple developers working on the same project without breaking each other's code.
        Git makes this possible using branches, Pull Requests, remote repositories, and a robust merge system. Platforms
        like GitHub enable structured collaboration on top of Git.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Problem Without Proper Collaboration</h3>
      <p class="text-gray-300 mb-2">
        If multiple developers directly modify the main branch:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Code gets overwritten.</li>
        <li>Bugs increase.</li>
        <li>Conflicts occur.</li>
        <li>The project becomes unstable.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Git solves this using branches and Pull Requests so that changes are isolated, reviewed, and merged safely.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Professional Team Workflow Structure</h3>
      <p class="text-gray-300 mb-3">
        <strong>main branch</strong> → production code<br />
        <strong>feature branches</strong> → developer work<br />
        <strong>Pull Requests</strong> → review and merge
      </p>
      <p class="text-gray-300 mb-4">
        The main branch is always stable, while developers work on separate feature branches and submit Pull Requests
        for review.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Real Team Example</h3>
      <p class="text-gray-300 mb-3">
        Assume a project has 3 developers:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Developer A → login feature.</li>
        <li>Developer B → dashboard feature.</li>
        <li>Developer C → navbar feature.</li>
      </ul>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>main
 ├── feature-login
 ├── feature-dashboard
 └── feature-navbar</code></pre>
      </div>
      <p class="text-gray-300 mb-4">
        Each developer works independently on their own branch while the main branch remains stable and deployable.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Team Collaboration Workflow</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-1 mb-4">
        <li>Step 1: Pull latest code.</li>
        <li>Step 2: Create feature branch.</li>
        <li>Step 3: Write code.</li>
        <li>Step 4: Commit changes.</li>
        <li>Step 5: Push branch.</li>
        <li>Step 6: Create Pull Request.</li>
        <li>Step 7: Review and merge.</li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why Feature Branches Are Important</h3>
      <p class="text-gray-300 mb-2">
        Feature branches:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Prevent breaking main code.</li>
        <li>Allow safe development.</li>
        <li>Enable parallel work.</li>
        <li>Improve overall stability.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Important Team Commands</h3>
      <p class="text-gray-300 mb-2">
        Always pull the latest code before starting work:
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>git pull origin main</code></pre>
      </div>
      <p class="text-gray-300 mb-2">
        Create a feature branch:
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>git checkout -b feature-name</code></pre>
      </div>
      <p class="text-gray-300 mb-2">
        Push your branch:
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>git push origin feature-name</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Main Branch Rules in Professional Teams</h3>
      <p class="text-gray-300 mb-3">
        Developers never directly push to the main branch. Only Pull Requests can modify main. This protects production
        code and ensures every change is reviewed.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Collaboration Flow Diagram</h3>
      <p class="text-gray-300 mb-4">
        <strong>Developer → Branch → Commit → Push → Pull Request → Review → Merge → Main</strong>
      </p>
    `,
    syntax: [
      {
        title: 'Pull Latest Code',
        content: 'git pull origin main'
      },
      {
        title: 'Create Feature Branch',
        content: 'git checkout -b feature-profile'
      },
      {
        title: 'Stage Changes',
        content: 'git add .'
      },
      {
        title: 'Commit Changes',
        content: 'git commit -m "Added profile feature"'
      },
      {
        title: 'Push Branch',
        content: 'git push origin feature-profile'
      }
    ],
    liveCode: `git pull origin main
git checkout -b feature-profile
git add profile.js
git commit -m "Added profile feature"
git push origin feature-profile`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example demonstrates a typical team workflow where a developer pulls the latest code, creates a feature
        branch, implements a feature, and pushes the branch for review.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4 space-y-2">
        <li>
          <strong>Step 1: Pull Latest Code – <code>git pull origin main</code></strong><br />
          <code>git pull</code> downloads the latest changes from the remote repository.<br />
          <code>origin</code> is the remote name, and <code>main</code> is the main branch.<br />
          This ensures you start from the latest version and helps prevent merge conflicts.
        </li>
        <li>
          <strong>Step 2: Create Feature Branch – <code>git checkout -b feature-profile</code></strong><br />
          <code>git checkout</code> switches branches, and <code>-b</code> creates a new branch named
          <code>feature-profile</code> and switches to it.<br />
          You now work safely without affecting the main branch.
        </li>
        <li>
          <strong>Step 3: Create Example File – <code>profile.js</code></strong><br />
          File content:<br />
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 mb-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>function loadProfile() {
  console.log("Profile loaded successfully");
}

loadProfile();</code></pre>
          </div>
          Explanation:<br />
          <code>function loadProfile() {</code> → creates a function named <code>loadProfile</code>.<br />
          <code>console.log("Profile loaded successfully");</code> → prints a success message to the console.<br />
          <code>}</code> → ends the function.<br />
          <code>loadProfile();</code> → executes the function.<br />
          Output: <code>Profile loaded successfully</code>.
        </li>
        <li>
          <strong>Step 4: Stage Changes – <code>git add profile.js</code></strong><br />
          Adds the <code>profile.js</code> file to the staging area so it is included in the next commit.
        </li>
        <li>
          <strong>Step 5: Commit Changes – <code>git commit -m "Added profile feature"</code></strong><br />
          Creates a snapshot of the new feature with a clear, descriptive commit message.
        </li>
        <li>
          <strong>Step 6: Push Branch – <code>git push origin feature-profile</code></strong><br />
          <code>git push</code> uploads your commits to the remote repository.<br />
          <code>origin</code> is the remote name, and <code>feature-profile</code> is the branch name.<br />
          The branch is now available for the team to review via a Pull Request.
        </li>
        <li>
          <strong>Step 7: Create Pull Request</strong><br />
          On GitHub, you open a Pull Request from <code>feature-profile</code> into <code>main</code> so the team can
          review and merge the changes safely.
        </li>
      </ul>
      <h4 class="text-lg font-semibold text-white mb-2">Execution Flow Summary</h4>
      <p class="text-gray-300 mb-3">
        <code>git pull origin main</code> → <code>git checkout -b feature-profile</code> → create code →
        <code>git add .</code> → <code>git commit</code> → <code>git push origin feature-profile</code> → create Pull
        Request → merge
      </p>
      <h4 class="text-lg font-semibold text-white mb-2">Real Professional Use Case</h4>
      <p class="text-gray-300 mb-2">
        This collaboration workflow is used in:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>React development teams.</li>
        <li>Startup frontend teams.</li>
        <li>Enterprise companies.</li>
        <li>Open source projects.</li>
      </ul>
      <p class="text-gray-300">
        Following this pattern ensures stability, safety, and scalability as teams grow and projects become more
        complex.
      </p>
    `
  };
}

if (module2 && module2.lessons[7]) {
  module2.lessons[7] = {
    ...module2.lessons[7],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.8 Managing Releases and Versioning</h2>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is Versioning?</h3>
      <p class="text-gray-300 mb-3">
        Versioning is the practice of assigning unique version numbers to different releases of a software project.
      </p>
      <p class="text-gray-300 mb-2">It helps:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Track software updates.</li>
        <li>Identify bug fixes.</li>
        <li>Manage feature additions.</li>
        <li>Maintain release history.</li>
        <li>Support production deployments.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Professional software always uses versioning to keep releases organized and predictable.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is a Release?</h3>
      <p class="text-gray-300 mb-3">
        A release is a stable version of the software made available to users.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>Version 1.0.0 → Initial release
Version 1.1.0 → Added new feature
Version 1.1.1 → Bug fix</code></pre>
      </div>
      <p class="text-gray-300 mb-4">
        Releases are usually created using Git tags that mark specific commits as stable versions.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Semantic Versioning (Industry Standard)</h3>
      <p class="text-gray-300 mb-3">
        Most companies follow Semantic Versioning (SemVer), which uses the format:
        <strong> MAJOR.MINOR.PATCH</strong>
      </p>
      <p class="text-gray-300 mb-3">
        Example: <strong>2.5.3</strong>
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>MAJOR</strong> → Breaking changes.</li>
        <li><strong>MINOR</strong> → New features (backward compatible).</li>
        <li><strong>PATCH</strong> → Bug fixes.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Semantic Versioning Breakdown</h3>
      <h4 class="text-lg font-semibold text-white mt-3 mb-1">1️⃣ MAJOR (1.x.x)</h4>
      <p class="text-gray-300 mb-2">Changed when:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Breaking API change.</li>
        <li>Major redesign.</li>
        <li>Incompatible updates.</li>
      </ul>
      <p class="text-gray-300 mb-3">Example: <strong>1.0.0 → 2.0.0</strong></p>

      <h4 class="text-lg font-semibold text-white mt-3 mb-1">2️⃣ MINOR (x.1.x)</h4>
      <p class="text-gray-300 mb-2">Changed when:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>New features are added.</li>
        <li>Changes remain backward compatible.</li>
      </ul>
      <p class="text-gray-300 mb-3">Example: <strong>1.2.0 → 1.3.0</strong></p>

      <h4 class="text-lg font-semibold text-white mt-3 mb-1">3️⃣ PATCH (x.x.1)</h4>
      <p class="text-gray-300 mb-2">Changed when:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Bug fixes are released.</li>
        <li>Small improvements are made.</li>
      </ul>
      <p class="text-gray-300 mb-4">Example: <strong>1.3.4 → 1.3.5</strong></p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is a Git Tag?</h3>
      <p class="text-gray-300 mb-3">
        A tag is a label attached to a specific commit. Tags are used to mark releases.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>v1.0.0
v2.1.3</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        Tags do not move like branches. They permanently mark a release version and always point to the same commit.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why Tags Are Important</h3>
      <p class="text-gray-300 mb-2">Tags are used for:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-3">
        <li>Production deployment.</li>
        <li>CI/CD pipelines.</li>
        <li>Release tracking.</li>
        <li>Rolling back to a stable version.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Professional deployment systems typically deploy using tags to ensure that a specific, tested version goes to
        production.
      </p>
    `,
    syntax: [
      {
        title: 'Create Annotated Tag (Recommended)',
        content: 'git tag -a v1.0.0 -m "Initial stable release"'
      },
      {
        title: 'View Tags',
        content: 'git tag'
      },
      {
        title: 'Push Single Tag to Remote',
        content: 'git push origin v1.0.0'
      },
      {
        title: 'Push All Tags',
        content: 'git push origin --tags'
      },
      {
        title: 'Delete Local Tag',
        content: 'git tag -d v1.0.0'
      }
    ],
    liveCode: `git log --oneline
git tag -a v1.0.0 -m "Initial stable release"
git tag
git push origin v1.0.0
git commit -m "Fixed login validation bug"
git tag -a v1.0.1 -m "Bug fix release"`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example demonstrates a complete release and versioning workflow using Git tags to mark stable versions of
        your application.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4 space-y-2">
        <li>
          <strong>Step 1: Check Current Commits – <code>git log --oneline</code></strong><br />
          <code>git log</code> shows the commit history, and <code>--oneline</code> displays a short, one-line format
          for each commit.<br />
          Example output:<br />
          <code>a3c45d2 Added login feature</code><br />
          <code>b7e91f1 Initial setup</code>
        </li>
        <li>
          <strong>Step 2: Create Version Tag – <code>git tag -a v1.0.0 -m "Initial stable release"</code></strong><br />
          Explanation:<br />
          <code>git tag</code> → create or manage tags.<br />
          <code>-a</code> → creates an annotated tag (includes message, author, and date).<br />
          <code>v1.0.0</code> → version number following SemVer.<br />
          <code>-m</code> → adds a descriptive message for the tag.<br />
          This marks the current commit as version <code>1.0.0</code>.
        </li>
        <li>
          <strong>Step 3: Verify Tag – <code>git tag</code></strong><br />
          Lists all tags in the repository.<br />
          Example output: <code>v1.0.0</code><br />
          Confirms that the release tag has been created.
        </li>
        <li>
          <strong>Step 4: Push Tag to Remote – <code>git push origin v1.0.0</code></strong><br />
          <code>git push</code> uploads changes to the remote.<br />
          <code>origin</code> → remote name.<br />
          <code>v1.0.0</code> → tag name.<br />
          After this, the release is available on the remote (for example, on GitHub).
        </li>
        <li>
          <strong>Step 5: Create New Patch Version</strong><br />
          After fixing a bug, you create a new commit:<br />
          <code>git commit -m "Fixed login validation bug"</code><br />
          Then you tag it as a patch release:<br />
          <code>git tag -a v1.0.1 -m "Bug fix release"</code><br />
          Interpretation of <code>1.0.1</code>:<br />
          <strong>1</strong> → Major version.<br />
          <strong>0</strong> → Minor version.<br />
          <strong>1</strong> → Patch update for bug fixes.
        </li>
      </ul>
      <h4 class="text-lg font-semibold text-white mb-2">Execution Flow Summary</h4>
      <p class="text-gray-300 mb-3">
        <code>git commit</code> → <code>git tag -a v1.0.0 -m "Release"</code> → <code>git push origin v1.0.0</code> →
        fix bug → <code>git tag -a v1.0.1 -m "Bug fix release"</code>
      </p>
      <h4 class="text-lg font-semibold text-white mb-2">Real Professional Workflow</h4>
      <p class="text-gray-300 mb-2">
        Typical release cycle in professional environments:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Develop features.</li>
        <li>Merge to main.</li>
        <li>Test the application.</li>
        <li>Create a version tag.</li>
        <li>Push the tag.</li>
        <li>Deploy to production using the tagged version.</li>
      </ul>
      <p class="text-gray-300">
        Release management and versioning are used in production deployments, mobile app updates, SaaS applications,
        enterprise software, and continuous integration pipelines. Every professional project relies on clear versioning
        to manage releases safely.
      </p>
    `
  };
}

if (module2 && module2.lessons[8]) {
  module2.lessons[8] = {
    ...module2.lessons[8],
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">2.9 Debugging and Recovering from Git Errors</h2>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Why Git Error Recovery is Important</h3>
      <p class="text-gray-300 mb-3">
        Mistakes are common in development. Developers often commit wrong files, delete important code, switch branches
        incorrectly, overwrite changes, or lose commits.
      </p>
      <p class="text-gray-300 mb-3">
        Git provides powerful recovery tools to fix these mistakes safely. Professional developers recover code using
        Git every day.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Common Git Mistakes</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
        <li>
          <strong>Mistake 1: Wrong Commit Message</strong><br />
          Example: <code>git commit -m "wrong message"</code>.<br />
          Can be fixed using <strong>amend</strong>.
        </li>
        <li>
          <strong>Mistake 2: Forgot to Add File</strong><br />
          Example: <code>git commit -m "Added feature"</code> but file was not staged.<br />
          Can be fixed using <strong>amend</strong>.
        </li>
        <li>
          <strong>Mistake 3: Accidentally Deleted File</strong><br />
          Git can restore deleted files from the last commit.
        </li>
        <li>
          <strong>Mistake 4: Need to Undo Commit</strong><br />
          Git allows safe undo without losing code.
        </li>
        <li>
          <strong>Mistake 5: Lost Changes After Checkout</strong><br />
          Git can recover changes using <code>git stash</code>.
        </li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Important Recovery Tools</h3>
      <div class="overflow-x-auto mb-4">
        <table class="min-w-full text-left text-sm text-gray-300">
          <thead>
            <tr class="border-b border-[#333]">
              <th class="py-2 pr-4">Tool</th>
              <th class="py-2">Purpose</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#333]">
            <tr>
              <td class="py-2 pr-4"><code>git restore</code></td>
              <td class="py-2">Restore file content from a commit.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4"><code>git reset</code></td>
              <td class="py-2">Undo commits (move HEAD).</td>
            </tr>
            <tr>
              <td class="py-2 pr-4"><code>git revert</code></td>
              <td class="py-2">Undo a commit safely by creating a new commit.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4"><code>git stash</code></td>
              <td class="py-2">Save temporary changes without committing.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4"><code>git reflog</code></td>
              <td class="py-2">Recover lost commits by viewing HEAD history.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4"><code>git checkout</code></td>
              <td class="py-2">Restore file or branch to a specific commit.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Difference: Reset vs Revert</h3>
      <p class="text-gray-300 mb-3">
        <code>git reset</code> moves the current branch pointer and can remove commits. If used with <code>--hard</code>
        after pushing, it can be dangerous because it rewrites history.
      </p>
      <p class="text-gray-300 mb-3">
        <code>git revert</code> creates a new commit that undoes the changes from a previous commit without deleting
        history. Professional teams prefer <strong>revert</strong> for shared branches.
      </p>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is Git Reflog?</h3>
      <p class="text-gray-300 mb-3">
        Git reflog tracks every Git action, including branch moves and resets. Even deleted commits can often be
        recovered using reflog. It is considered the ultimate recovery tool when things go wrong.
      </p>
    `,
    syntax: [
      {
        title: 'Undo Last Commit (Keep Changes)',
        content: 'git reset --soft HEAD~1'
      },
      {
        title: 'Undo Last Commit (Delete Changes)',
        content: 'git reset --hard HEAD~1'
      },
      {
        title: 'Restore Deleted File',
        content: 'git restore filename'
      },
      {
        title: 'Undo Commit Safely',
        content: 'git revert commit-id'
      },
      {
        title: 'Save Temporary Changes',
        content: 'git stash'
      },
      {
        title: 'Restore Stash',
        content: 'git stash pop'
      },
      {
        title: 'Recover Lost Commit',
        content: 'git reflog'
      }
    ],
    liveCode: `git add app.js
git commit -m "Added application start function"
rm app.js
git status
git restore app.js
git status
git reflog
git checkout a3c45d2`,
    liveCodeExplanation: `
      <p class="mb-2 text-gray-300">
        This example demonstrates how to recover a deleted file using <code>git restore</code>, and introduces
        <code>git reflog</code> as a way to recover lost commits.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4 space-y-2">
        <li>
          <strong>Step 1: Create Example File – <code>app.js</code></strong><br />
          File content:<br />
          <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mt-2 mb-2 text-gray-200">
            <pre class="text-sm overflow-x-auto"><code>function startApplication() {
  console.log("Application started successfully");
}

startApplication();</code></pre>
          </div>
          Explanation:<br />
          <code>function startApplication() {</code> → creates a function named <code>startApplication</code>.<br />
          <code>console.log("Application started successfully");</code> → prints a message.<br />
          <code>}</code> → ends the function.<br />
          <code>startApplication();</code> → executes the function.<br />
          Output: <code>Application started successfully</code>.
        </li>
        <li>
          <strong>Step 2: Commit File – <code>git add app.js</code> and <code>git commit -m "Added application start function"</code></strong><br />
          Stages <code>app.js</code> and creates a commit. The file is now safely stored in Git history.
        </li>
        <li>
          <strong>Step 3: Accidentally Delete File – <code>rm app.js</code></strong><br />
          Deletes the file from the working directory.
        </li>
        <li>
          <strong>Step 4: Check Git Status – <code>git status</code></strong><br />
          Output shows <code>deleted: app.js</code>. Git detects that the tracked file has been removed.
        </li>
        <li>
          <strong>Step 5: Recover Deleted File – <code>git restore app.js</code></strong><br />
          Explanation:<br />
          <code>git restore</code> → restores file content from the last commit.<br />
          <code>app.js</code> → file to restore.<br />
          Git recreates the file exactly as it was in the most recent commit. File recovered successfully.
        </li>
        <li>
          <strong>Step 6: Verify Recovery – <code>git status</code></strong><br />
          Output becomes <code>nothing to commit, working tree clean</code>, confirming that the file is fully restored
          and matches the last committed state.
        </li>
        <li>
          <strong>Most Powerful Recovery Command – <code>git reflog</code></strong><br />
          Running <code>git reflog</code> shows a history of where <code>HEAD</code> has pointed, for example:<br />
          <code>a3c45d2 HEAD@{0}: commit: Added feature</code><br />
          <code>b7e91f1 HEAD@{1}: commit: Initial commit</code><br />
          To recover a lost commit, you can run:<br />
          <code>git checkout a3c45d2</code><br />
          This moves you to that commit so you can inspect or restore the lost work.
        </li>
      </ul>
      <h4 class="text-lg font-semibold text-white mb-2">Execution Flow Summary</h4>
      <p class="text-gray-300 mb-3">
        Create file → commit file → delete file accidentally → <code>git status</code> → <code>git restore app.js</code>
        → file recovered. When commits are lost, use <code>git reflog</code> to find and restore them.
      </p>
      <h4 class="text-lg font-semibold text-white mb-2">Real Professional Use Case</h4>
      <p class="text-gray-300 mb-2">
        Git recovery commands are used when:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>A developer deletes code accidentally.</li>
        <li>A wrong commit is made.</li>
        <li>A merge mistake happens.</li>
        <li>A production bug is introduced and needs rollback.</li>
      </ul>
      <p class="text-gray-300">
        Professional developers must know how to use <code>git restore</code>, <code>git reset</code>, <code>git revert</code>,
        <code>git stash</code>, and <code>git reflog</code> to prevent permanent code loss and keep projects safe.
      </p>
    `
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  activeModuleId,
  setActiveModuleId,
  activeLessonIndex,
  setActiveLessonIndex,
  completedLessons
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set(['module-1']));
  const [activeTab, setActiveTab] = useState<'outline' | 'resources'>('outline');

  const filteredModules = useMemo(() => {
    if (!searchTerm.trim()) return courseData;
    const term = searchTerm.toLowerCase();
    return courseData
      .map((module) => {
        const matchingLessons = module.lessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(term)
        );
        if (
          module.title.toLowerCase().includes(term) ||
          matchingLessons.length > 0
        ) {
          return { ...module, lessons: matchingLessons.length > 0 ? matchingLessons : module.lessons };
        }
        return null;
      })
      .filter((m): m is Module => m !== null);
  }, [searchTerm]);

  const toggleModule = (id: string) => {
    setOpenModules((prev) => {
      if (prev.has(id)) {
        return prev;
      }
      return new Set([id]);
    });
  };

  return (
    <aside
      className={`bg-[#181818] border-r border-[#333] text-gray-200 flex flex-col transition-all duration-200 ${
        collapsed ? 'w-14' : 'w-80'
      }`}
    >
      <div className="border-b border-[#333] flex items-center justify-between">
        {!collapsed && (
          <div className="flex flex-1">
            <button
              onClick={() => setActiveTab('outline')}
              className={clsx(
                'flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2',
                activeTab === 'outline'
                  ? 'border-[#00bceb] text-white bg-[#252526]'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
              )}
            >
              <BookOpen className="w-4 h-4" />
              <span>Course Outline</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={clsx(
                'flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2',
                activeTab === 'resources'
                  ? 'border-[#00bceb] text-white bg-[#252526]'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
              )}
            >
              <FileText className="w-4 h-4" />
              <span>Resources</span>
            </button>
          </div>
        )}
        <button
          className="p-1.5 mr-2 rounded hover:bg-[#262626] text-gray-400"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && activeTab === 'outline' && (
        <div className="p-3 border-b border-[#333]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search course outline"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded bg-[#111] border border-[#333] text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00bceb]"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!collapsed && activeTab === 'outline' && (
          <>
            <div className="px-3 py-3 border-b border-[#333] space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Course Introduction</span>
                <span className="text-[#00bceb] font-semibold">Intermediate</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#222] overflow-hidden">
                <div className="h-full w-[8%] bg-[#00bceb]" />
              </div>
            </div>

            <div className={collapsed ? 'px-1 py-2' : 'px-2 py-3'}>
              {filteredModules.map((module, moduleIndex) => {
                const isOpen = openModules.has(module.id);
                return (
                  <div key={module.id} className="mb-2">
                    <button
                      onClick={() => {
                        toggleModule(module.id);
                        setActiveModuleId(module.id);
                        setActiveLessonIndex(0);
                      }}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-2 rounded text-left text-sm',
                        'min-w-0',
                        activeModuleId === module.id
                          ? 'bg-[#262626] text-gray-50'
                          : 'text-gray-300 hover:bg-[#222]'
                      )}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <ChevronDown
                          className={clsx(
                            'w-4 h-4 transition-transform',
                            isOpen ? 'rotate-0' : '-rotate-90'
                          )}
                        />
                        {!collapsed && (
                          <span className="truncate">
                            {(() => {
                              const parts = module.title.split(':');
                              const label = parts.length > 1 ? parts.slice(1).join(':').trim() : module.title;
                              return `M${moduleIndex + 1}: ${label}`;
                            })()}
                          </span>
                        )}
                      </span>
                      {!collapsed && (
                        <span className="text-[11px] text-gray-500 ml-2 shrink-0">
                          {module.duration}
                        </span>
                      )}
                    </button>

                    {!collapsed && (
                      <div
                        className={clsx(
                          'ml-6 space-y-1 overflow-hidden transition-all duration-300',
                          isOpen ? 'mt-1 max-h-[480px] opacity-100' : 'mt-0 max-h-0 opacity-0'
                        )}
                      >
                        {module.lessons.map((lesson, lessonIndex) => {
                          const lessonKey = `${module.id}-${lessonIndex}`;
                          const isActive =
                            activeModuleId === module.id && activeLessonIndex === lessonIndex;
                          const isCompleted = completedLessons.has(lessonKey);
                          return (
                            <button
                              key={lesson.title}
                              onClick={() => {
                                setActiveModuleId(module.id);
                                setActiveLessonIndex(lessonIndex);
                              }}
                              className={clsx(
                                'w-full flex items-center justify-between px-3 py-1.5 rounded text-left text-xs',
                                'min-w-0',
                                isActive
                                  ? 'bg-[#1f2933] text-white'
                                  : 'text-gray-300 hover:bg-[#1a1a1a]'
                              )}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-[10px]">
                                  {isCompleted ? (
                                    <CheckCircle className="w-3 h-3 text-[#00bceb]" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                  )}
                                </span>
                                <span className="truncate">{lesson.title}</span>
                              </span>
                              <span className="text-[10px] text-gray-500 ml-2 shrink-0">
                                {lesson.duration}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!collapsed && activeTab === 'resources' && (
          <div className="p-4 space-y-4">
            <div className="mb-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
              Resources for this course are in development.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

const ChatSidebar: React.FC<{
  messages: ChatMessage[];
  onSend: (text: string) => Promise<void>;
  loading: boolean;
}> = ({ messages, onSend, loading }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (text.trim() && !loading) {
      void onSend(text.trim());
      setText('');
    }
  };

  return (
    <aside
      className={clsx(
        isDark
          ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/20 ring-white/10'
          : 'bg-gradient-to-br from-white/70 to-white/40 border-gray-300/40 ring-white/60',
        'backdrop-blur-2xl backdrop-saturate-150 w-full lg:sticky lg:top-4 lg:self-start',
        'h-[calc(100vh-240px)] min-h-[520px] rounded-2xl border p-4 flex flex-col shadow-lg ring-1 transition-all duration-300'
      )}
    >
      <div
        className={clsx(
          'flex flex-col items-start gap-0.5 pb-3 border-b rounded-lg px-3 py-2',
          isDark ? 'border-white/20 bg-white/10' : 'border-[#00bceb]/30 bg-white/60',
          'backdrop-blur-xl'
        )}
      >
        <h3 className={clsx('text-sm font-medium', isDark ? 'text-white' : 'text-[#00bceb]')}>
          Personal Teacher
        </h3>
        <span className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
          Ask me anything about the components
        </span>
      </div>

      <div
        className={clsx(
          'flex-1 min-h-0 overflow-y-auto space-y-4 py-4 custom-scrollbar',
          isDark ? 'text-gray-200' : 'text-gray-800'
        )}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={clsx(
              'flex',
              msg.role === 'assistant' ? 'justify-start' : 'justify-end'
            )}
          >
            <div
              className={clsx(
                msg.role === 'assistant'
                  ? isDark
                    ? 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                    : 'bg-[#00bceb] text-white border border-[#00bceb]'
                  : isDark
                  ? 'bg-black/60 backdrop-blur-xl text-white border border-white/20'
                  : 'bg-blue-600/70 backdrop-blur-xl text-white border border-blue-300/40',
                'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap break-words leading-relaxed text-[15px]'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className={clsx(
                isDark
                  ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                  : 'bg-[#00bceb] border border-[#00bceb]',
                'rounded-2xl px-4 py-3 shadow-sm'
              )}
            >
              <span className={clsx('text-sm', isDark ? 'text-white/70' : 'text-white/90')}>
                Thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 border-t space-y-3 border-white/10">
        <div
          className={clsx(
            'flex items-center gap-2 rounded-xl border p-2 shadow-sm',
            isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40',
            'backdrop-blur-xl'
          )}
        >
          <button
            className={clsx(
              'p-2 rounded shrink-0',
              isDark ? 'hover:bg-white/15' : 'hover:bg-white'
            )}
            aria-label="Voice input (not implemented)"
          >
            <Mic className={clsx('h-5 w-5', isDark ? 'text-white/80' : 'text-gray-700')} />
          </button>
          <input
            type="text"
            className={clsx(
              'flex-1 bg-transparent outline-none min-w-0 text-sm',
              isDark ? 'text-white placeholder-white/60' : 'text-gray-900 placeholder-gray-600'
            )}
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
          />
          <button
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-md disabled:opacity-50 shrink-0',
              isDark ? 'bg-white text-gray-900' : 'bg-[#00bceb] text-white'
            )}
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
};

const module3 = courseData.find((m) => m.id === 'module-3');

if (module3 && module3.lessons[0]) {
  module3.lessons[0] = {
    ...module3.lessons[0],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[0].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">CSS Flexbox: Complete Layout Control</h2>
      
      <p class="text-gray-300 mb-4">Flexbox (Flexible Box Layout) is a CSS layout system used to arrange elements in a row or column with powerful control over alignment, spacing, and positioning. It was designed to solve layout problems that older techniques like floats and manual positioning could not handle properly.</p>
      
      <p class="text-gray-300 mb-4">Flexbox makes layouts flexible, responsive, and much easier to align both horizontally and vertically. It is used in almost all modern frontend applications for building navigation bars, dashboards, card layouts, and centered sections.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Flexbox Has Two Main Parts</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Flex Container</strong> – The parent element that controls the layout behavior of its children. It is enabled using <code>display: flex;</code>.</li>
        <li><strong>Flex Items</strong> – The child elements inside the container. Once Flexbox is enabled on the container, these items automatically follow Flexbox rules.</li>
      </ul>
      
      <p class="text-gray-300 mb-4">Example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>&lt;div class="container"&gt;
  &lt;div class="item"&gt;&lt;/div&gt;
  &lt;div class="item"&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre>
      <p class="text-gray-300 mb-4">Here, the <code>div</code> with class <code>container</code> is the flex container, and the inner <code>div</code> elements with class <code>item</code> are flex items.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Default Flex Direction</h3>
      <p class="text-gray-300 mb-4">By default, Flexbox arranges items horizontally in a row:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>flex-direction: row;</code></pre>
      <p class="text-gray-300 mb-4">This means items are placed from left to right.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Main Axis and Cross Axis</h3>
      <p class="text-gray-300 mb-4">When <code>flex-direction: row;</code> is used:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Main axis</strong> – Horizontal (left to right).</li>
        <li><strong>Cross axis</strong> – Vertical (top to bottom).</li>
      </ul>
      <p class="text-gray-300 mb-4">Flexbox alignment properties such as <code>justify-content</code> and <code>align-items</code> work based on these axes.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Important Flexbox Properties (Container)</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Enable Flexbox:</strong> <code>display: flex;</code></li>
        <li><strong>Change Direction:</strong> <code>flex-direction: row;</code> or <code>flex-direction: column;</code></li>
        <li><strong>Horizontal Alignment (Main Axis):</strong> <code>justify-content: center;</code>, with options:
          <ul class="list-disc pl-6 mt-2 space-y-1">
            <li><code>flex-start</code> – Align items to the start.</li>
            <li><code>center</code> – Center items.</li>
            <li><code>flex-end</code> – Align items to the end.</li>
            <li><code>space-between</code> – Equal space between items.</li>
            <li><code>space-around</code> – Equal space around items.</li>
          </ul>
        </li>
        <li><strong>Vertical Alignment (Cross Axis):</strong> <code>align-items: center;</code>, with options:
          <ul class="list-disc pl-6 mt-2 space-y-1">
            <li><code>flex-start</code> – Align items to the top.</li>
            <li><code>center</code> – Center items vertically.</li>
            <li><code>flex-end</code> – Align items to the bottom.</li>
            <li><code>stretch</code> – Stretch items to fill the container.</li>
          </ul>
        </li>
      </ul>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Why Flexbox is Important</h3>
      <p class="text-gray-300 mb-4">Flexbox is used heavily in modern frontend development for:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Navigation bars</li>
        <li>Dashboards and sidebars</li>
        <li>Card layouts</li>
        <li>Centering elements both horizontally and vertically</li>
        <li>Responsive layouts that adapt to screen size</li>
      </ul>
      <p class="text-gray-300 mb-4">Every professional frontend developer uses Flexbox daily to build clean, responsive, and maintainable layouts.</p>
    `,
    syntax: [
      {
        title: 'Basic Flexbox Syntax',
        content: `.container {
  display: flex;
}`
      },
      {
        title: 'Direction',
        content: `.container {
  display: flex;
  flex-direction: row;
}`
      },
      {
        title: 'Horizontal Alignment',
        content: `.container {
  display: flex;
  justify-content: center;
}`
      },
      {
        title: 'Vertical Alignment',
        content: `.container {
  display: flex;
  align-items: center;
}`
      },
      {
        title: 'Center Both Horizontally and Vertically',
        content: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`
      }
    ],
    liveCode: `<!DOCTYPE html>
<html>
<head>
  <title>Flexbox Example</title>

  <style>
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      background-color: lightgray;
    }

    .box {
      width: 150px;
      height: 150px;
      background-color: steelblue;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
    }
  </style>

</head>
<body>

  <div class="container">
    <div class="box">Centered Box</div>
  </div>

</body>
</html>`
  };
}

if (module3 && module3.lessons[1]) {
  module3.lessons[1] = {
    ...module3.lessons[1],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[1].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">CSS Grid: Complete Layout System</h2>
      
      <p class="text-gray-300 mb-4">CSS Grid is a powerful two-dimensional layout system in CSS. It allows you to design layouts using rows, columns, and grid areas with precise control. Unlike Flexbox, which is mainly one-dimensional, Grid works in both horizontal and vertical directions, making it ideal for full-page layouts.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Grid Container and Grid Items</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Grid Container</strong> – The parent element that defines the grid. You enable it using <code>display: grid;</code>.</li>
        <li><strong>Grid Items</strong> – The child elements inside the grid container. They automatically follow grid rules for placement and sizing.</li>
      </ul>
      
      <p class="text-gray-300 mb-4">Example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>&lt;div class="container"&gt;
  &lt;div class="item"&gt;&lt;/div&gt;
  &lt;div class="item"&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre>
      <p class="text-gray-300 mb-4">Here, the <code>container</code> is the grid container, and each <code>item</code> inside it is a grid item.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Why CSS Grid is Powerful</h3>
      <p class="text-gray-300 mb-4">CSS Grid allows you to:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Create complex layouts easily using rows and columns.</li>
        <li>Define exact column widths and row heights.</li>
        <li>Overlap elements if needed.</li>
        <li>Create responsive designs that adapt to any screen size.</li>
      </ul>
      <p class="text-gray-300 mb-4">It is widely used in dashboards, admin panels, full website layouts, and image galleries.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Important Grid Properties</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Define Columns:</strong> <code>grid-template-columns: 200px 200px 200px;</code></li>
        <li><strong>Dynamic Columns:</strong> <code>grid-template-columns: repeat(3, 1fr);</code></li>
        <li><strong>Define Rows:</strong> <code>grid-template-rows: 100px 200px;</code></li>
        <li><strong>Gap Between Items:</strong> <code>gap: 20px;</code> adds space between rows and columns.</li>
        <li><strong>Grid Area Placement:</strong> <code>grid-column: 1 / 3;</code> and <code>grid-row: 1 / 2;</code> let an item span multiple columns or rows.</li>
      </ul>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Fraction Unit (fr)</h3>
      <p class="text-gray-300 mb-4">The <code>fr</code> unit represents a fraction of the available space in the grid container.</p>
      <p class="text-gray-300 mb-4">Example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>grid-template-columns: 1fr 1fr 1fr;</code></pre>
      <p class="text-gray-300 mb-4">This creates three equal columns, each taking one-third of the available width.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Grid vs Flexbox</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Flexbox</strong> – Best for one-dimensional layouts (a single row or column), such as navigation bars and simple alignments.</li>
        <li><strong>Grid</strong> – Best for two-dimensional layouts (rows and columns together), such as full page structures and complex sections.</li>
      </ul>
      <p class="text-gray-300 mb-4">In real projects, Flexbox and Grid are often used together to build professional, responsive layouts.</p>
    `,
    syntax: [
      {
        title: 'Basic Grid Container',
        content: `.container {
  display: grid;
}`
      },
      {
        title: 'Define 3 Equal Columns',
        content: `.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}`
      },
      {
        title: 'Add Gap',
        content: `.container {
  gap: 20px;
}`
      },
      {
        title: 'Span Across Columns',
        content: `.item {
  grid-column: 1 / 3;
}`
      }
    ],
    liveCode: `<!DOCTYPE html>
<html>
<head>
  <title>CSS Grid Example</title>

  <style>
    .container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 20px;
      background-color: lightgray;
    }

    .box {
      background-color: steelblue;
      color: white;
      padding: 40px;
      text-align: center;
      font-size: 18px;
    }
  </style>

</head>
<body>

  <div class="container">
    <div class="box">Box 1</div>
    <div class="box">Box 2</div>
    <div class="box">Box 3</div>
    <div class="box">Box 4</div>
    <div class="box">Box 5</div>
    <div class="box">Box 6</div>
  </div>

</body>
</html>`
  };
}

if (module3 && module3.lessons[2]) {
  module3.lessons[2] = {
    ...module3.lessons[2],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[2].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">Responsive Design Professional Techniques</h2>
      
      <p class="text-gray-300 mb-4">Responsive Design is the technique of making a website automatically adapt to different screen sizes. A responsive website looks good and remains usable on mobile phones, tablets, laptops, and large desktop monitors.</p>
      
      <p class="text-gray-300 mb-4">Responsive design ensures a better user experience across all devices. Without it, layouts can break on mobile, text becomes unreadable, and pages become difficult to use. Modern professional frontend development always applies responsive design.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Why Responsive Design is Critical</h3>
      <p class="text-gray-300 mb-4">Today, most users access websites from mobile devices. If a website is not responsive:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Layouts break on small screens.</li>
        <li>Text becomes too small or requires horizontal scrolling.</li>
        <li>Buttons and links are hard to tap.</li>
      </ul>
      <p class="text-gray-300 mb-4">A professional frontend must work flawlessly on all screen sizes.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Core Components of Responsive Design</h3>
      <p class="text-gray-300 mb-4">Responsive design is built using a combination of:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Flexible layouts.</li>
        <li>Flexible images.</li>
        <li>Media queries.</li>
        <li>Responsive units (%, vw, vh, rem, em).</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">What are Media Queries?</h3>
      <p class="text-gray-300 mb-4">Media queries allow CSS to apply specific styles based on screen size or device characteristics.</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>@media (max-width: 768px) {
  body {
    background-color: red;
  }
}</code></pre>
      <p class="text-gray-300 mb-4">In this example, the styles inside the media query apply only when the screen width is less than or equal to 768px.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Common Breakpoints (Industry Standard)</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Mobile:</strong> 0px – 480px</li>
        <li><strong>Tablet:</strong> 481px – 768px</li>
        <li><strong>Laptop:</strong> 769px – 1024px</li>
        <li><strong>Desktop:</strong> 1025px and above</li>
      </ul>
      <p class="text-gray-300 mb-4">These breakpoints are commonly used in professional frontend development to adjust layouts per device type.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Responsive Units</h3>
      <p class="text-gray-300 mb-4">Instead of fixed pixel-based sizes like <code>width: 500px;</code>, responsive designs use flexible units such as:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>%</strong> – Percentage of the parent element.</li>
        <li><strong>vw</strong> – Viewport width (1vw = 1% of viewport width).</li>
        <li><strong>vh</strong> – Viewport height (1vh = 1% of viewport height).</li>
        <li><strong>rem</strong> – Based on the root font size.</li>
        <li><strong>em</strong> – Based on the font size of the current element.</li>
      </ul>
      <p class="text-gray-300 mb-4">A common pattern is <code>width: 100%;</code> with <code>max-width: 1200px;</code> so content scales but does not grow too wide on large screens.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Mobile First Approach (Professional Standard)</h3>
      <p class="text-gray-300 mb-4">In a mobile-first approach, developers design for mobile as the default and then use media queries to enhance the layout for larger screens. This approach improves performance and scalability.</p>
      <p class="text-gray-300 mb-4">Workflow:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Write base styles optimized for mobile.</li>
        <li>Add media queries for tablets, laptops, and desktops.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Responsive Flexbox Layout Example</h3>
      <p class="text-gray-300 mb-4">Below is a simple responsive layout that changes from a horizontal layout on desktop to a vertical layout on smaller screens.</p>
      <p class="text-gray-300 mb-4">On desktop, the boxes appear in a row. On mobile and tablet (width ≤ 768px), the layout changes to a column.</p>
    `,
    syntax: [
      {
        title: 'Basic Media Query',
        content: `@media (max-width: 768px) { 
  selector { 
    property: value; 
  } 
}`
      },
      {
        title: 'Multiple Breakpoints',
        content: `@media (max-width: 768px) { 
  /* tablet */ 
} 

@media (max-width: 480px) { 
  /* mobile */ 
}`
      },
      {
        title: 'Responsive Width Example',
        content: `.container { 
  width: 100%; 
  max-width: 1200px; 
}`
      },
      {
        title: 'Responsive Flexbox Example',
        content: `.container { 
  display: flex; 
} 

@media (max-width: 768px) { 
  .container { 
    flex-direction: column; 
  } 
}`
      }
    ],
    liveCode: `<!DOCTYPE html> 
<html> 
<head> 
  <title>Responsive Design Example</title> 

  <style> 
    .container { 
      display: flex; 
      gap: 20px; 
      padding: 20px; 
    } 

    .box { 
      flex: 1; 
      padding: 40px; 
      background-color: steelblue; 
      color: white; 
      text-align: center; 
      font-size: 18px; 
    } 

    @media (max-width: 768px) { 
      .container { 
        flex-direction: column; 
      } 
    } 
  </style> 

</head> 
<body> 

  <div class="container"> 
    <div class="box">Box 1</div> 
    <div class="box">Box 2</div> 
    <div class="box">Box 3</div> 
  </div> 

</body> 
</html>`
  };
}

if (module3 && module3.lessons[3]) {
  module3.lessons[3] = {
    ...module3.lessons[3],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[3].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">CSS Architecture and Maintainable Styling</h2>
      
      <p class="text-gray-300 mb-4">CSS Architecture is the structured way of organizing CSS code so that it is maintainable, scalable, reusable, and easy to debug. Without a proper architecture, CSS quickly becomes messy and hard to manage in large projects.</p>
      
      <p class="text-gray-300 mb-4">Professional applications always use a structured CSS architecture to keep styling predictable and easy to extend.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Problem Without CSS Architecture</h3>
      <p class="text-gray-300 mb-4">A bad CSS example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>div {
  color: red;
}</code></pre>
      <p class="text-gray-300 mb-4">This affects <strong>all</strong> <code>div</code> elements, is hard to control, and causes conflicts. This style is not scalable.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Solution: Structured CSS Architecture</h3>
      <p class="text-gray-300 mb-4">Professional developers avoid targeting generic tags directly and instead use:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Class-based styling.</li>
        <li>Modular CSS.</li>
        <li>Naming conventions.</li>
        <li>Separation of concerns between layout and components.</li>
      </ul>
      <p class="text-gray-300 mb-4">Example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.button {
  color: white;
}</code></pre>
      <p class="text-gray-300 mb-4">This only affects elements with the <code>button</code> class and is much safer in large codebases.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Most Popular CSS Architecture Method: BEM</h3>
      <p class="text-gray-300 mb-4">BEM (Block Element Modifier) is an industry-standard naming convention for CSS classes.</p>
      <p class="text-gray-300 mb-4">Structure format:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>block__element--modifier</code></pre>
      <p class="text-gray-300 mb-4">Example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.card {}
.card__title {}
.card__button {}
.card__button--primary {}</code></pre>
      <p class="text-gray-300 mb-2"><strong>Explanation:</strong></p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Block</strong> – Standalone component (e.g., <code>.card</code>, <code>.button</code>).</li>
        <li><strong>Element</strong> – Part of the block (e.g., <code>.card__title</code>, <code>.card__button</code>).</li>
        <li><strong>Modifier</strong> – Variation of a block or element (e.g., <code>.button--primary</code>, <code>.button--secondary</code>).</li>
      </ul>
      <p class="text-gray-300 mb-4">Example variations:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.button {}
.button--primary {}
.button--secondary {}</code></pre>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Benefits of BEM</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>No naming conflicts.</li>
        <li>Easy to scale as the project grows.</li>
        <li>Easy to maintain and refactor.</li>
        <li>Easy for new developers to understand.</li>
      </ul>
      <p class="text-gray-300 mb-4">BEM is used widely in large applications and enterprise frontends.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">CSS File Organization (Professional Structure)</h3>
      <p class="text-gray-300 mb-4">A common CSS project structure:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>css/
  ├── base.css
  ├── layout.css
  ├── components.css
  ├── utilities.css
  ├── main.css</code></pre>
      <p class="text-gray-300 mb-2">Purpose of each file:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>base.css</strong> – Global styles (resets, typography).</li>
        <li><strong>layout.css</strong> – Layout structure (header, footer, grid).</li>
        <li><strong>components.css</strong> – Reusable components (buttons, cards, modals).</li>
        <li><strong>utilities.css</strong> – Helper classes (margin, padding, text utilities).</li>
        <li><strong>main.css</strong> – Imports all other CSS files.</li>
      </ul>
      <p class="text-gray-300 mb-4">Example of <code>main.css</code>:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>@import "base.css";
@import "layout.css";
@import "components.css";</code></pre>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Benefits of Proper CSS Architecture</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Clean, well-structured code.</li>
        <li>Easier debugging and refactoring.</li>
        <li>Scalable projects that grow without chaos.</li>
        <li>Professional workflow used in production frontend systems.</li>
      </ul>
      <p class="text-gray-300 mb-4">CSS architecture is mandatory for scalable frontend development, especially in React apps, dashboards, SaaS products, and other large systems.</p>
    `,
    syntax: [
      {
        title: 'Class-based Styling',
        content: `.button {
  background-color: blue;
}`
      },
      {
        title: 'BEM Naming',
        content: `.card {}
.card__title {}
.card__button {}
.card__button--active {}`
      },
      {
        title: 'Modular CSS Import',
        content: `@import "components.css";`
      },
      {
        title: 'Component Styling',
        content: `.navbar {
  display: flex;
}`
      }
    ],
    liveCode: `<!DOCTYPE html> 
<html> 
<head> 
  <title>CSS Architecture Example</title> 

  <style> 
    .card { 
      width: 300px; 
      padding: 20px; 
      background-color: lightgray; 
      border-radius: 10px; 
    } 

    .card__title { 
      font-size: 22px; 
      margin-bottom: 10px; 
    } 

    .card__button { 
      padding: 10px; 
      background-color: steelblue; 
      color: white; 
      border: none; 
      cursor: pointer; 
    } 

    .card__button--active { 
      background-color: green; 
    } 
  </style> 

</head> 
<body> 

  <div class="card"> 
    <div class="card__title">Product Card</div> 
    <button class="card__button card__button--active"> 
      Buy Now 
    </button> 
  </div> 

</body> 
</html>`
  };
}

if (module3 && module3.lessons[4]) {
  module3.lessons[4] = {
    ...module3.lessons[4],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[4].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">SCSS for Scalable Styling</h2>
      
      <p class="text-gray-300 mb-4">SCSS (Sassy CSS) is an advanced version of CSS that adds programming-like features such as variables, nesting, functions, mixins, and reusable code. It makes CSS more powerful, clean, and scalable.</p>
      <p class="text-gray-300 mb-4">SCSS is widely used in professional frontend development in frameworks like React, Angular, and enterprise dashboards.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Why SCSS is Needed</h3>
      <p class="text-gray-300 mb-4">In normal CSS, you often repeat the same values in many places:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.button {
  background-color: blue;
}

.card {
  background-color: blue;
}</code></pre>
      <p class="text-gray-300 mb-4">If the brand color changes, you must update it in many locations. This is error-prone and not scalable.</p>
      <p class="text-gray-300 mb-4">SCSS solves this using <strong>variables</strong>, so you change the value in one place and it updates everywhere.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">SCSS Variables</h3>
      <p class="text-gray-300 mb-4">Variables allow you to store reusable values (colors, sizes, fonts) and use them across your styles.</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>$primary-color: blue;

.button {
  background-color: $primary-color;
}</code></pre>
      <p class="text-gray-300 mb-4">Change <code>$primary-color</code> once, and all elements using it are updated automatically.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">SCSS Nesting</h3>
      <p class="text-gray-300 mb-4">SCSS allows nested selectors to mirror HTML structure which keeps styles cleaner and grouped by component.</p>
      <p class="text-gray-300 mb-4">Normal CSS:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.card {}
.card h1 {}
.card button {}</code></pre>
      <p class="text-gray-300 mb-4">SCSS version:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.card {
  h1 {
    color: red;
  }

  button {
  }
}</code></pre>
      <p class="text-gray-300 mb-4">This is cleaner, more readable, and easier to maintain.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">SCSS Mixins (Reusable Code)</h3>
      <p class="text-gray-300 mb-4">Mixins allow you to define reusable chunks of styling and include them wherever needed.</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  @include center;
}</code></pre>
      <p class="text-gray-300 mb-4">This avoids repeating the same flexbox centering code in multiple places.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">SCSS Compilation</h3>
      <p class="text-gray-300 mb-4">Browsers do not understand SCSS directly. SCSS is compiled (or built) into normal CSS.</p>
      <p class="text-gray-300 mb-4">Example flow:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>style.scss → style.css</code></pre>
      <p class="text-gray-300 mb-4">You write SCSS, a build tool compiles it, and the browser reads the final CSS file.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Professional SCSS Folder Structure</h3>
      <p class="text-gray-300 mb-4">A common SCSS project structure:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>scss/
  ├── base/
  ├── components/
  ├── layout/
  ├── utilities/
  ├── main.scss</code></pre>
      <p class="text-gray-300 mb-4">This keeps styles modular and easier to scale in large projects.</p>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">Benefits of SCSS</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Cleaner and more organized styling.</li>
        <li>Reusable styling with variables and mixins.</li>
        <li>Easier maintenance and refactoring.</li>
        <li>Professional structure used in real-world frontend systems.</li>
        <li>Faster development for large teams and enterprise applications.</li>
      </ul>
    `,
    syntax: [
      {
        title: 'Variable',
        content: `$color: blue;`
      },
      {
        title: 'Nesting',
        content: `.card {
  h1 {
    color: red;
  }
}`
      },
      {
        title: 'Mixin',
        content: `@mixin center {
  display: flex;
}`
      },
      {
        title: 'Include Mixin',
        content: `.container {
  @include center;
}`
      },
      {
        title: 'Import SCSS File',
        content: `@import "components";`
      }
    ],
    liveCode: `<!DOCTYPE html> 
<html> 
<head> 
  <title>SCSS Example</title> 

  <!-- SCSS File (style.scss) --> 
  <!-- 
  $primary-color: steelblue; 
  $text-color: white; 

  @mixin center { 
    display: flex; 
    justify-content: center; 
    align-items: center; 
  } 

  .card { 
    width: 300px; 
    height: 200px; 
    background-color: $primary-color; 

    @include center; 

    .card-text { 
      color: $text-color; 
      font-size: 20px; 
    } 
  } 
  --> 

  <style> 
    .card { 
      width: 300px; 
      height: 200px; 
      background-color: steelblue; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
    } 

    .card .card-text { 
      color: white; 
      font-size: 20px; 
    } 
  </style> 

</head> 
<body> 

  <div class="card"> 
    <div class="card-text">SCSS Styled Card</div> 
  </div> 

</body> 
</html>`
  };
}

if (module3 && module3.lessons[5]) {
  module3.lessons[5] = {
    ...module3.lessons[5],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[5].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">Writing Professional README Files</h2>
      
      <p class="text-gray-300 mb-4">A README file is the official documentation of your project. It tells other developers what the project is, what it does, how to install it, and how to use it. It is usually the first file someone reads when they open your repository.</p>
      
      <p class="text-gray-300 mb-4">The file name is typically <code>README.md</code>, where <code>.md</code> stands for Markdown format.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Why README is Important</h3>
      <p class="text-gray-300 mb-4">Without a README, your project looks incomplete and is hard to understand:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>No one understands your project.</li>
        <li>It becomes difficult to use or contribute.</li>
        <li>The repository appears unprofessional.</li>
      </ul>
      <p class="text-gray-300 mb-4">With a good README:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>There is a clear project explanation.</li>
        <li>Installation and setup are easy to follow.</li>
        <li>The project looks professional and well maintained.</li>
        <li>It becomes essential for open source work and job portfolios.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Professional README Structure</h3>
      <p class="text-gray-300 mb-4">Most professional README files follow a consistent structure:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Project Title</li>
        <li>Project Description</li>
        <li>Features</li>
        <li>Installation Steps</li>
        <li>Usage Instructions</li>
        <li>Project Structure</li>
        <li>Technologies Used</li>
        <li>Author Information</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">What is Markdown?</h3>
      <p class="text-gray-300 mb-4">Markdown is a lightweight formatting language used to create structured documents. It is easy to write and easy to read in plain text form.</p>
      <p class="text-gray-300 mb-4">Common Markdown syntax:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code># Heading
## Subheading
- Bullet points
**Bold text**</code></pre>
      <p class="text-gray-300 mb-4">Platforms like GitHub automatically render Markdown into formatted documents.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Where README is Used</h3>
      <p class="text-gray-300 mb-4">README files are used everywhere in professional software development:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>GitHub repositories.</li>
        <li>Company codebases.</li>
        <li>Open source projects.</li>
        <li>Portfolio projects.</li>
      </ul>
      <p class="text-gray-300 mb-4">Your README represents your professionalism as a developer.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Professional Workflow</h3>
      <p class="text-gray-300 mb-4">A typical README workflow looks like this:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Create <code>README.md</code>.</li>
        <li>Write clear project documentation.</li>
        <li>Commit the README to your repository.</li>
        <li>Push it to GitHub or your remote platform.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Always include a README in every project.</li>
        <li>Keep it clear, structured, and up to date.</li>
        <li>Explain installation and usage step by step.</li>
        <li>Use proper headings and bullet points.</li>
        <li>Update the README as the project evolves.</li>
      </ul>
    `,
    syntax: [
      {
        title: 'Create README File',
        content: 'touch README.md'
      },
      {
        title: 'Heading',
        content: '# Project Title'
      },
      {
        title: 'Subheading',
        content: '## Features'
      },
      {
        title: 'Bullet Points',
        content: '- Feature 1\n- Feature 2'
      },
      {
        title: 'Bold Text and Code Block',
        content: '**Important**\n\n```\ncode here\n```'
      }
    ],
    language: 'html',
    liveCode: `<!DOCTYPE html>
<html>
<head>
  <title>README.md Example</title>
  <meta charset="UTF-8" />
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; background: #0b1120; color: #e5e7eb; }
    h1 { color: #38bdf8; margin-bottom: 12px; }
    pre { background: #020617; padding: 16px; border-radius: 8px; overflow-x: auto; line-height: 1.6; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; }
  </style>
</head>
<body>

  <h1>README.md – Student Management System</h1>
  <p>This is an example of a professional project README written in Markdown.</p>

  <pre><code># Student Management System

## Description
This project is a simple application to manage student records. It allows adding, viewing, and storing student information.

## Features
- Add student records
- View student records
- Store data locally

## Installation
git clone https://github.com/project/student-system
cd student-system

## Usage
Run the application file.

## Project Structure
student-system/
├── index.html
├── script.js
└── README.md

## Technologies Used
- HTML
- JavaScript
- Git

## Author
Developer</code></pre>

</body>
</html>`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This explanation walks through the example <code>README.md</code> line by line so you understand exactly what
        each section means and why it is written this way.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Line 1</h3>
      <p class="text-gray-300 mb-3">
        <code># Student Management System</code><br />
        The <code>#</code> symbol creates the main heading in Markdown. This is the project title and is the first thing
        readers see.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Lines 3–4</h3>
      <p class="text-gray-300 mb-3">
        <code>## Description</code> followed by a sentence that explains the project.<br />
        This section clearly states what the project does – managing student records – in one or two lines.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Lines 6–9</h3>
      <p class="text-gray-300 mb-3">
        <code>## Features</code> and a bullet list:<br />
        <code>- Add student records</code>, <code>- View student records</code>, <code>- Store data locally</code>.<br />
        This lists the main capabilities of the application in a quick, scannable format.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Lines 11–17</h3>
      <p class="text-gray-300 mb-3">
        <code>## Installation</code> plus the commands:<br />
        <code>git clone https://github.com/project/student-system</code><br />
        <code>cd student-system</code><br />
        These lines show how to download the project and move into the project folder. Any developer can copy and paste
        these commands into their terminal.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Lines 19–22</h3>
      <p class="text-gray-300 mb-3">
        <code>## Usage</code> and a short description: <code>Run the application file.</code><br />
        This section explains how to start or run the project after installation. In real projects you would include the
        exact command, such as <code>npm start</code> or <code>python app.py</code>.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Lines 24–29</h3>
      <p class="text-gray-300 mb-3">
        <code>## Project Structure</code> followed by a tree view of the folder:<br />
        <code>student-system/</code> with <code>index.html</code>, <code>script.js</code>, and <code>README.md</code>.<br />
        This helps readers quickly understand how the codebase is organized.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Lines 31–35</h3>
      <p class="text-gray-300 mb-3">
        <code>## Technologies Used</code> and a bullet list:<br />
        <code>- HTML</code>, <code>- JavaScript</code>, <code>- Git</code>.<br />
        This tells recruiters and collaborators which tools and technologies are used in the project.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Lines 37–39</h3>
      <p class="text-gray-300 mb-3">
        <code>## Author</code> and <code>Developer</code> as the author name.<br />
        This section credits the creator of the project. In real projects you would use your full name, contact links,
        or GitHub profile.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Final Workflow</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Create <code>README.md</code>.</li>
        <li>Write clear documentation following this structure.</li>
        <li>Commit the README file to your repository.</li>
        <li>Push the changes to GitHub so others can see it.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Professional Best Practices</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>Always include a README for every project you share.</li>
        <li>Keep the content simple, clear, and well organized.</li>
        <li>Update the README whenever installation or usage changes.</li>
        <li>Use headings, bullet points, and code blocks to improve readability.</li>
      </ul>
    `
  };
}

if (module3 && module3.lessons[6]) {
  module3.lessons[6] = {
    ...module3.lessons[6],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[6].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">CSS Animations and Transitions</h2>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">What are CSS Transitions?</h3>
      <p class="text-gray-300 mb-4">CSS Transitions allow smooth changes between property values. Instead of instantly jumping from one state to another, transitions make the change happen gradually over time.</p>
      <p class="text-gray-300 mb-4">Without a transition, the change happens instantly. With a transition, the change feels smooth and professional.</p>

      <p class="text-gray-300 mb-4">Common use cases include:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Button hover effects.</li>
        <li>Color changes.</li>
        <li>Size scaling.</li>
        <li>Opacity fade in or fade out.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Transition Syntax</h3>
      <p class="text-gray-300 mb-4">General syntax:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>transition: property duration timing-function delay;</code></pre>
      <p class="text-gray-300 mb-4">Example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>transition: background-color 0.3s ease;</code></pre>
      <p class="text-gray-300 mb-4">This makes the <code>background-color</code> change smoothly over 0.3 seconds using an <code>ease</code> timing function.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">What are CSS Animations?</h3>
      <p class="text-gray-300 mb-4">CSS Animations use <code>@keyframes</code> to define multi-step animations. They can run automatically, repeat infinitely, and control multiple stages of an animation.</p>
      <p class="text-gray-300 mb-4">Unlike transitions:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Animations do not always need a trigger (they can start on page load).</li>
        <li>They can have multiple steps, not just a start and end state.</li>
        <li>They provide more control over timing and repetition.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Animation Syntax</h3>
      <p class="text-gray-300 mb-4">Basic keyframes syntax:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>@keyframes animation-name {
  from { }
  to { }
}</code></pre>
      <p class="text-gray-300 mb-4">To apply the animation:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.box {
  animation: animation-name 2s;
}</code></pre>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Difference Between Transition and Animation</h3>
      <p class="text-gray-300 mb-4">You should use transitions and animations for different purposes:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Transition:</strong> Triggered by an event such as hover or focus, and usually moves between two states (start → end).</li>
        <li><strong>Animation:</strong> Can run automatically, can contain multiple steps, and offers more control over timing and repetition.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Professional Usage</h3>
      <p class="text-gray-300 mb-4">CSS transitions and animations are heavily used in modern web applications for:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Landing page hero animations.</li>
        <li>Interactive buttons and hover states.</li>
        <li>Loading indicators and progress bars.</li>
        <li>UI micro-interactions such as dropdowns and tooltips.</li>
        <li>Modern web applications and dashboards.</li>
      </ul>
    `,
    syntax: [
      {
        title: 'Transition Example',
        content: `.button {
  transition: background-color 0.3s ease;
}`
      },
      {
        title: 'Keyframes Example',
        content: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`
      },
      {
        title: 'Apply Animation',
        content: `.box {
  animation: fadeIn 2s ease-in-out;
}`
      }
    ],
    language: 'html',
    liveCode: `<!DOCTYPE html> 
<html> 
<head> 
  <title>CSS Animation Example</title> 

  <style> 
    .button { 
      padding: 12px 20px; 
      background-color: steelblue; 
      color: white; 
      border: none; 
      cursor: pointer; 
      transition: background-color 0.3s ease, transform 0.3s ease; 
    } 

    .button:hover { 
      background-color: darkblue; 
      transform: scale(1.1); 
    } 

    .box { 
      width: 100px; 
      height: 100px; 
      background-color: coral; 
      margin-top: 40px; 
      animation: slideRight 3s ease-in-out infinite alternate; 
    } 

    @keyframes slideRight { 
      from { 
        transform: translateX(0px); 
      } 
      to { 
        transform: translateX(300px); 
      } 
    } 
  </style> 

</head> 
<body> 

  <button class="button">Hover Me</button> 

  <div class="box"></div> 

</body> 
</html>`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This explanation walks through the CSS for the button transition and the animated box so you understand how
        transitions and animations work together.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Button Styling (.button)</h3>
      <p class="text-gray-300 mb-2">
        <code>.button { ... }</code> creates a reusable class for the button element.
      </p>
      <p class="text-gray-300 mb-2">
        <code>padding: 12px 20px;</code> adds internal spacing so the button is comfortable to click.
      </p>
      <p class="text-gray-300 mb-2">
        <code>background-color: steelblue;</code> sets the default background color of the button.
      </p>
      <p class="text-gray-300 mb-2">
        <code>transition: background-color 0.3s ease, transform 0.3s ease;</code> enables smooth animation for the
        background color and scale:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><code>background-color</code> and <code>transform</code> are the animated properties.</li>
        <li><code>0.3s</code> is the duration of the transition.</li>
        <li><code>ease</code> is the timing function that controls the speed curve.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Hover State (.button:hover)</h3>
      <p class="text-gray-300 mb-2">
        <code>.button:hover { ... }</code> is triggered when the user hovers the mouse over the button.
      </p>
      <p class="text-gray-300 mb-2">
        <code>background-color: darkblue;</code> changes the color smoothly because of the transition.
      </p>
      <p class="text-gray-300 mb-3">
        <code>transform: scale(1.1);</code> increases the size of the button by 10%, creating a subtle zoom effect.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Animated Box (.box)</h3>
      <p class="text-gray-300 mb-2">
        <code>.box { ... }</code> defines a square element that will move horizontally.
      </p>
      <p class="text-gray-300 mb-2">
        <code>animation: slideRight 3s ease-in-out infinite alternate;</code> attaches the animation and configures it:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><code>slideRight</code> is the animation name.</li>
        <li><code>3s</code> is the duration of one full cycle.</li>
        <li><code>ease-in-out</code> slows the movement at the beginning and end.</li>
        <li><code>infinite</code> makes the animation repeat forever.</li>
        <li><code>alternate</code> makes the box move right, then back left, instead of jumping to the start.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Keyframes (@keyframes slideRight)</h3>
      <p class="text-gray-300 mb-2">
        <code>@keyframes slideRight { ... }</code> defines the stages of the animation.
      </p>
      <p class="text-gray-300 mb-2">
        In the <code>from</code> block, <code>transform: translateX(0px);</code> sets the starting position of the box
        on the X-axis.
      </p>
      <p class="text-gray-300 mb-3">
        In the <code>to</code> block, <code>transform: translateX(300px);</code> sets the end position 300 pixels to the
        right. The animation smoothly moves between these two positions.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Execution Flow</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>The page loads.</li>
        <li>The box animation starts automatically using <code>animation</code> and <code>@keyframes</code>.</li>
        <li>When the user hovers over the button, the transition is triggered.</li>
        <li>The button smoothly changes color and scale while the box keeps moving.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Professional Usage</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>Landing pages use animations to draw attention to key sections.</li>
        <li>Buttons and links often use transitions to feel more interactive.</li>
        <li>Loading indicators and spinners are usually built with CSS animations.</li>
        <li>Small micro-interactions improve user experience in modern web apps.</li>
      </ul>
    `
  };
}

if (module3 && module3.lessons[7]) {
  module3.lessons[7] = {
    ...module3.lessons[7],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[7].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">Responsive Web Design (Media Queries)</h2>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">What is Responsive Web Design?</h3>
      <p class="text-gray-300 mb-4">Responsive Web Design ensures a website works correctly on all screen sizes: mobile, tablet, laptop, and desktop. The layout automatically adjusts based on the available screen space.</p>

      <p class="text-gray-300 mb-4">Without responsive design:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>The website can break on mobile.</li>
        <li>Content may overflow off the screen.</li>
        <li>Users have a bad experience and leave quickly.</li>
      </ul>

      <p class="text-gray-300 mb-4">With responsive design:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>The layout looks clean on every device.</li>
        <li>The website appears professional.</li>
        <li>Usability improves significantly.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">What are Media Queries?</h3>
      <p class="text-gray-300 mb-4">Media Queries allow CSS to apply styles based on screen size or other device characteristics.</p>
      <p class="text-gray-300 mb-4">Example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>@media (max-width: 768px) {
  body {
    background-color: red;
  }
}</code></pre>
      <p class="text-gray-300 mb-4">In this example, the background color changes only when the screen width is less than or equal to 768px.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Common Screen Sizes</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li><strong>Mobile:</strong> max-width: 480px</li>
        <li><strong>Tablet:</strong> max-width: 768px</li>
        <li><strong>Laptop:</strong> max-width: 1024px</li>
        <li><strong>Desktop:</strong> min-width: 1025px</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Mobile-First Approach (Professional Method)</h3>
      <p class="text-gray-300 mb-4">In a mobile-first approach, you first design for mobile and then add styles for larger screens using media queries.</p>
      <p class="text-gray-300 mb-4">Example:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>/* Mobile default */
.box {
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .box {
    width: 50%;
  }
}</code></pre>
      <p class="text-gray-300 mb-4">Here, the box takes full width on mobile and 50% width on tablet and larger screens.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Real-World Usage</h3>
      <p class="text-gray-300 mb-4">Responsive design is used in:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>All modern websites.</li>
        <li>React and SPA applications.</li>
        <li>Dashboards and admin panels.</li>
        <li>E-commerce websites.</li>
        <li>Professional frontend systems.</li>
      </ul>
      <p class="text-gray-300 mb-4">Without responsive design, a website is considered broken in professional environments.</p>
    `,
    syntax: [
      {
        title: 'Basic Media Query Syntax',
        content: `@media (condition) {
  selector {
    property: value;
  }
}`
      },
      {
        title: 'Example',
        content: `@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`
      },
      {
        title: 'Multiple Breakpoints',
        content: `@media (max-width: 480px) { }

@media (max-width: 768px) { }

@media (max-width: 1024px) { }`
      }
    ],
    language: 'html',
    liveCode: `<!DOCTYPE html> 
<html> 
<head> 
  <title>Responsive Design Example</title> 

  <style> 
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 20px; 
    } 

    .container { 
      display: flex; 
      gap: 20px; 
    } 

    .card { 
      flex: 1; 
      padding: 20px; 
      background-color: steelblue; 
      color: white; 
      text-align: center; 
      font-size: 20px; 
    } 

    @media (max-width: 768px) { 
      .container { 
        flex-wrap: wrap; 
      } 

      .card { 
        flex: 50%; 
      } 
    } 

    @media (max-width: 480px) { 
      .card { 
        flex: 100%; 
      } 
    } 
  </style> 

</head> 
<body> 

  <div class="container"> 
    <div class="card">Card 1</div> 
    <div class="card">Card 2</div> 
    <div class="card">Card 3</div> 
  </div> 

</body> 
</html>`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This explanation walks through the responsive card layout so you can see exactly how media queries affect the
        design at different screen sizes.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Body Styling</h3>
      <p class="text-gray-300 mb-2">
        <code>body { ... }</code> targets the entire page. Using <code>font-family: Arial, sans-serif;</code> sets a
        clean, readable font, and <code>padding: 20px;</code> adds spacing around the content.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Container (.container)</h3>
      <p class="text-gray-300 mb-2">
        <code>.container { display: flex; }</code> creates a flex layout so the cards are placed in a row by default.
      </p>
      <p class="text-gray-300 mb-3">
        <code>gap: 20px;</code> adds spacing between the cards, making the layout more readable.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Card Styling (.card)</h3>
      <p class="text-gray-300 mb-2">
        <code>.card { flex: 1; }</code> makes each card take equal width in the row. On desktop, this results in three
        cards per row.
      </p>
      <p class="text-gray-300 mb-3">
        The background color, padding, text alignment, and font size make the cards visually clear and easy to read.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Tablet Media Query (@media max-width: 768px)</h3>
      <p class="text-gray-300 mb-2">
        <code>@media (max-width: 768px)</code> triggers when the screen width is 768px or smaller (typical tablets).
      </p>
      <p class="text-gray-300 mb-2">
        Inside it, <code>.container { flex-wrap: wrap; }</code> allows cards to move to the next row instead of shrinking
        too much.
      </p>
      <p class="text-gray-300 mb-3">
        <code>.card { flex: 50%; }</code> makes each card take half the row width, so there are two cards per row on
        tablets.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Mobile Media Query (@media max-width: 480px)</h3>
      <p class="text-gray-300 mb-2">
        <code>@media (max-width: 480px)</code> targets small mobile screens.
      </p>
      <p class="text-gray-300 mb-3">
        <code>.card { flex: 100%; }</code> makes each card take the full width, resulting in one card per row on mobile.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Execution Flow</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Desktop (&gt; 768px): three cards per row.</li>
        <li>Tablet (≤ 768px): two cards per row.</li>
        <li>Mobile (≤ 480px): one card per row.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Real-World Usage</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>All modern websites use media queries to adapt layouts.</li>
        <li>React and SPA applications rely on responsive design for dashboards and pages.</li>
        <li>E-commerce sites use responsive grids for product cards.</li>
        <li>Without responsive design, a site is considered broken on mobile devices.</li>
      </ul>
    `
  };
}

if (module3 && module3.lessons[8]) {
  module3.lessons[8] = {
    ...module3.lessons[8],
    duration: '15 min',
    content:
      buildLessonContent(module3.title, module3.lessons[8].title) +
      `
      <h2 class="text-2xl font-bold text-white mb-4">CSS Performance Optimization</h2>
      
      <h3 class="text-xl font-bold text-white mb-2 mt-6">What is CSS Performance Optimization?</h3>
      <p class="text-gray-300 mb-4">CSS Performance Optimization means writing CSS in a way that loads faster, renders faster, uses fewer resources, and improves overall user experience.</p>

      <p class="text-gray-300 mb-4">In large applications, poorly written CSS can:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Slow down page load.</li>
        <li>Increase render time.</li>
        <li>Cause layout shifts.</li>
        <li>Reduce performance scores.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">How Browsers Render CSS</h3>
      <p class="text-gray-300 mb-4">The browser rendering pipeline looks like this:</p>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>HTML → DOM</li>
        <li>CSS → CSSOM</li>
        <li>DOM + CSSOM → Render Tree</li>
        <li>Render Tree → Layout → Paint → Composite</li>
      </ul>
      <p class="text-gray-300 mb-4">Heavy or inefficient CSS can slow down layout calculation, repainting, and cause frequent reflows.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Common CSS Performance Problems</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Too many unused styles.</li>
        <li>Deep nested selectors.</li>
        <li>Very large CSS files.</li>
        <li>Blocking CSS in the <code>&lt;head&gt;</code>.</li>
        <li>Expensive properties such as <code>box-shadow</code> and complex <code>filter</code> effects.</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">1️⃣ Reduce Unused CSS</h3>
      <p class="text-gray-300 mb-4">Unused CSS increases file size and slows down parsing.</p>
      <p class="text-gray-300 mb-4">Bad:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.box1 {}
.box2 {}
.box3 {}
.box4 {}</code></pre>
      <p class="text-gray-300 mb-4">If only <code>.box1</code> is used, the others are wasteful. Remove unused styles or use build tools (such as purge tools) in production.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">2️⃣ Avoid Deep Selectors</h3>
      <p class="text-gray-300 mb-4">Deep selectors are slower to match and harder to maintain.</p>
      <p class="text-gray-300 mb-4">Bad:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>body div.container ul li a span {
  color: red;
}</code></pre>
      <p class="text-gray-300 mb-4">This is hard for the browser to match efficiently and difficult to maintain over time.</p>
      <p class="text-gray-300 mb-4">Better:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.nav-link {
  color: red;
}</code></pre>
      <p class="text-gray-300 mb-4">Use simple class selectors instead of long element chains.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">3️⃣ Minify CSS</h3>
      <p class="text-gray-300 mb-4">Minification removes unnecessary spaces and characters to reduce file size.</p>
      <p class="text-gray-300 mb-4">Normal CSS:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.box {
  background-color: blue;
  padding: 10px;
}</code></pre>
      <p class="text-gray-300 mb-4">Minified CSS:</p>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>.box{background-color:blue;padding:10px;}</code></pre>
      <p class="text-gray-300 mb-4">Smaller files load faster, especially over mobile networks.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">4️⃣ Use Efficient Properties</h3>
      <p class="text-gray-300 mb-4">Some properties are expensive to animate or change, such as large <code>box-shadow</code>, heavy <code>filter</code> effects, and complex animations that trigger layout.</p>
      <p class="text-gray-300 mb-4">Prefer animating <code>transform</code> and <code>opacity</code>, which are GPU-accelerated and much cheaper.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">5️⃣ Avoid Layout Thrashing</h3>
      <p class="text-gray-300 mb-4">Frequently changing layout-related properties like <code>width</code>, <code>height</code>, <code>margin</code>, <code>top</code>, or <code>left</code> can cause reflows.</p>
      <p class="text-gray-300 mb-4">Instead, use <code>transform: translate()</code> to move elements without triggering layout recalculation.</p>

      <h3 class="text-xl font-bold text-white mb-2 mt-6">Professional Best Practices</h3>
      <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
        <li>Use class selectors instead of deep nested selectors.</li>
        <li>Minify CSS in production builds.</li>
        <li>Remove unused CSS using tooling.</li>
        <li>Prefer <code>transform</code> and <code>opacity</code> for animations.</li>
        <li>Split CSS for large applications into smaller bundles.</li>
      </ul>
    `,
    syntax: [
      {
        title: 'Efficient Animation',
        content: `.box {
  transition: transform 0.3s ease;
}`
      },
      {
        title: 'Avoid Expensive Reflow',
        content: `.box:hover {
  transform: scale(1.1);
}`
      },
      {
        title: 'Minified CSS Example',
        content: `.box{background:#000;color:#fff;}`
      }
    ],
    language: 'html',
    liveCode: `<!DOCTYPE html> 
<html> 
<head> 
  <title>CSS Performance Example</title> 

  <style> 
    .card { 
      width: 200px; 
      height: 150px; 
      background-color: steelblue; 
      color: white; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      transition: transform 0.3s ease, opacity 0.3s ease; 
    } 

    .card:hover { 
      transform: scale(1.1); 
      opacity: 0.9; 
    } 
  </style> 

</head> 
<body> 

  <div class="card"> 
    Optimized Card 
  </div> 

</body> 
</html>`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This explanation walks through the optimized CSS so you understand how selector choice and animation properties
        impact performance.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Simple Class Selector (.card)</h3>
      <p class="text-gray-300 mb-2">
        <code>.card { ... }</code> uses a single class selector. This is fast for the browser to match and easy to reuse
        in your HTML.
      </p>
      <p class="text-gray-300 mb-2">
        <code>width: 200px;</code> and <code>height: 150px;</code> define a fixed size for the card.
      </p>
      <p class="text-gray-300 mb-2">
        <code>display: flex;</code>, <code>justify-content: center;</code>, and <code>align-items: center;</code> center
        the content inside the card efficiently.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Optimized Transition</h3>
      <p class="text-gray-300 mb-2">
        <code>transition: transform 0.3s ease, opacity 0.3s ease;</code> sets up smooth animations only for
        <code>transform</code> and <code>opacity</code>.
      </p>
      <p class="text-gray-300 mb-3">
        These properties are GPU-accelerated, which makes the animation smoother and cheaper than animating layout
        properties like width or height.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Hover Effect (.card:hover)</h3>
      <p class="text-gray-300 mb-2">
        <code>.card:hover { transform: scale(1.1); opacity: 0.9; }</code> scales the card by 10% and slightly reduces its
        opacity when hovered.
      </p>
      <p class="text-gray-300 mb-3">
        Because only <code>transform</code> and <code>opacity</code> change, the browser avoids recalculating layout and
        only updates the composite layer.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Performance Comparison</h3>
      <p class="text-gray-300 mb-2">
        A bad approach would be:
      </p>
      <pre class="bg-gray-900 text-gray-100 p-3 rounded mb-2 overflow-x-auto"><code>.card:hover {
  width: 220px;
}</code></pre>
      <p class="text-gray-300 mb-2">
        Changing <code>width</code> forces the browser to recalculate layout (reflow), which is more expensive.
      </p>
      <p class="text-gray-300 mb-3">
        The better approach is using <code>transform: scale(1.1);</code>, which only affects the visual rendering and
        keeps the layout stable.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Execution Flow</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>The page loads and the browser parses the CSS.</li>
        <li>Simple class selectors are matched quickly.</li>
        <li>When the user hovers the card, the transform and opacity transition is triggered.</li>
        <li>The GPU handles the animation smoothly without heavy layout work.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Professional Best Practices</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>Prefer simple class selectors instead of deep nested selectors.</li>
        <li>Minify CSS and remove unused rules in production.</li>
        <li>Use <code>transform</code> and <code>opacity</code> for smooth, efficient animations.</li>
        <li>Split large CSS files into smaller chunks for faster loading.</li>
        <li>Continuously audit CSS as your application grows to avoid performance regressions.</li>
      </ul>
    `
  };
}

const module4 = courseData.find((m) => m.id === 'module-4');

if (module4 && module4.lessons[0]) {
  module4.lessons[0] = {
    ...module4.lessons[0],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.1 React Architecture and Virtual DOM</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Why React Exists</h3>
      <p class="text-gray-300 mb-3">
        Before React, developers manually manipulated the DOM with libraries like jQuery. As applications grew, this
        became difficult to manage and reason about. React introduced a declarative, component-based architecture that
        lets you describe <strong>what</strong> the UI should look like for a given state.
      </p>
      <p class="text-gray-300 mb-3">
        Instead of updating the DOM directly, you update <strong>state</strong> and <strong>props</strong>. React
        takes care of efficiently updating the UI to match the latest data.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">React Component Tree</h3>
      <p class="text-gray-300 mb-2">
        A React application is built as a tree of components. Each component:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Encapsulates its own UI and logic.</li>
        <li>Receives data via props.</li>
        <li>Can hold internal state.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        The root component is usually called <code>App</code>. It is rendered into a single DOM node (often
        <code>&lt;div id="root"&gt;</code>) and then composes the rest of the UI.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is the Virtual DOM?</h3>
      <p class="text-gray-300 mb-3">
        The <strong>Virtual DOM</strong> is an in-memory representation of the real DOM. When your component&apos;s
        state or props change, React:
      </p>
      <ol class="list-decimal list-inside text-gray-300 mb-3">
        <li>Re-runs the component function to produce new JSX.</li>
        <li>Converts JSX into a new Virtual DOM tree.</li>
        <li>Diffs it with the previous Virtual DOM tree.</li>
        <li>Calculates the minimal set of changes.</li>
        <li>Applies those changes to the real DOM.</li>
      </ol>
      <p class="text-gray-300 mb-3">
        This <strong>diff and patch</strong> process makes updates fast and predictable, even for complex UIs.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Rendering Flow in React</h3>
      <ol class="list-decimal list-inside text-gray-300 mb-3">
        <li>The application starts by rendering the <code>App</code> component into the root DOM node.</li>
        <li><code>App</code> returns JSX describing the UI.</li>
        <li>React builds the initial Virtual DOM and paints the real DOM.</li>
        <li>When state or props change, React rebuilds the Virtual DOM for affected components.</li>
        <li>React compares the old and new Virtual DOM and updates only what changed.</li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Why This Architecture Matters</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>You think in components and data flow instead of manual DOM manipulation.</li>
        <li>Performance is improved through minimal DOM updates.</li>
        <li>Debugging becomes easier because the UI is a pure function of state and props.</li>
        <li>Large teams can collaborate by owning different parts of the component tree.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Learning Outcome</h3>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Understand how React&apos;s component tree maps to the DOM.</li>
        <li>Explain what the Virtual DOM is and why it exists.</li>
        <li>Describe the high-level rendering flow in a React app.</li>
      </ul>
      `,
    syntax: [
      {
        title: 'Root Rendering',
        content:
          'import ReactDOM from "react-dom/client";\\n\\nconst root = ReactDOM.createRoot(document.getElementById("root"));\\nroot.render(<App />);'
      },
      {
        title: 'Simple Component Tree',
        content:
          'function App() {\\n  return (\\n    <div>\\n      <Header />\\n      <Dashboard />\\n      <Footer />\\n    </div>\\n  );\\n}'
      },
      {
        title: 'UI as Function of State',
        content:
          'function Counter() {\\n  const [count, setCount] = useState(0);\\n  return <p>Count: {count}</p>;\\n}'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== React Architecture and Virtual DOM ===");

function renderComponentTree() {
  const app = {
    type: "App",
    children: ["Header", "Dashboard", "Footer"]
  };

  console.log("Component tree:", app);
  console.log("1) Build Virtual DOM for <App />");
  console.log("2) Diff with previous Virtual DOM");
  console.log("3) Apply minimal changes to real DOM");
}

renderComponentTree();`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This example connects the conceptual idea of React&apos;s component tree and Virtual DOM to the actual code you
        write in a typical React project.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Component Tree</h3>
      <p class="text-gray-300 mb-2">
        <code>Header</code>, <code>Dashboard</code>, and <code>Footer</code> are separate functional components. Each
        returns its own piece of JSX and focuses on a single responsibility.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">App Component</h3>
      <p class="text-gray-300 mb-2">
        The <code>App</code> component composes the smaller components inside a parent <code>&lt;div&gt;</code>. This
        forms a small component tree that represents the UI.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Root Rendering</h3>
      <p class="text-gray-300 mb-2">
        <code>ReactDOM.createRoot</code> connects React to the real DOM node with id <code>root</code>. Calling
        <code>root.render(&lt;App /&gt;)</code> tells React to build the Virtual DOM for <code>App</code> and paint it
        to the browser.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Virtual DOM and Updates</h3>
      <p class="text-gray-300 mb-2">
        When state or props change inside any component, React rebuilds the Virtual DOM for that branch of the tree,
        compares it with the previous version, and updates only the parts of the real DOM that changed.
      </p>
    `
  };
}

if (module4 && module4.lessons[1]) {
  module4.lessons[1] = {
    ...module4.lessons[1],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.2 Project Setup using Vite</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Why Use Vite for React?</h3>
      <p class="text-gray-300 mb-3">
        Vite is a fast build tool and development server designed for modern frontend frameworks. Compared to older
        bundlers, Vite offers extremely fast startup, instant hot module replacement (HMR), and a simpler setup.
      </p>
      <p class="text-gray-300 mb-3">
        In professional React projects, Vite is commonly used because it provides a smooth developer experience and
        optimized production builds out-of-the-box.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Prerequisites</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Node.js and npm installed on your system.</li>
        <li>Basic familiarity with the terminal.</li>
        <li>A code editor such as VS Code.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Steps to Create a React App with Vite</h3>
      <ol class="list-decimal list-inside text-gray-300 mb-3">
        <li>Open a terminal and navigate to the folder where you want the project.</li>
        <li>Run the Vite project creation command for React.</li>
        <li>Install dependencies with <code>npm install</code> or <code>yarn</code>.</li>
        <li>Start the development server and open the app in the browser.</li>
      </ol>

      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Key Files in a Vite + React Project</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><code>index.html</code> – entry HTML file with a root <code>div</code>.</li>
        <li><code>src/main.jsx</code> – bootstraps React and renders the <code>App</code> component.</li>
        <li><code>src/App.jsx</code> – main React component where you start building UI.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Learning Outcome</h3>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Create a new React project using Vite from the terminal.</li>
        <li>Understand the purpose of main Vite project files.</li>
        <li>Run and view a React development server locally.</li>
      </ul>
      `,
    syntax: [
      {
        title: 'Create Vite React App',
        content: 'npm create vite@latest my-react-app -- --template react'
      },
      {
        title: 'Install and Run',
        content: 'cd my-react-app\\nnpm install\\nnpm run dev'
      },
      {
        title: 'main.jsx Entry Point',
        content:
          'import ReactDOM from "react-dom/client";\\nimport App from "./App";\\n\\nReactDOM.createRoot(document.getElementById("root")).render(<App />);'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Vite + React Project Setup ===");

const commands = [
  "npm create vite@latest my-react-app -- --template react",
  "cd my-react-app",
  "npm install",
  "npm run dev"
];

commands.forEach((cmd, index) => {
  console.log(index + 1 + ")", cmd);
});`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This example focuses on the three core files you work with after creating a React project using Vite.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">index.html</h3>
      <p class="text-gray-300 mb-2">
        The <code>index.html</code> file contains a single <code>&lt;div id="root"&gt;</code>. React renders the entire
        application inside this container.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">main.jsx</h3>
      <p class="text-gray-300 mb-2">
        <code>main.jsx</code> imports React, ReactDOM, and the <code>App</code> component. It creates a root using
        <code>ReactDOM.createRoot</code> and calls <code>render</code> with <code>&lt;App /&gt;</code>. This is the
        entry point of your React app.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">App.jsx</h3>
      <p class="text-gray-300 mb-2">
        <code>App.jsx</code> defines the first component you see in the browser. You will typically replace the starter
        JSX with your own layout, components, and routes.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Execution Flow</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>You run <code>npm run dev</code> to start the Vite dev server.</li>
        <li>Vite serves <code>index.html</code> and loads <code>main.jsx</code>.</li>
        <li><code>main.jsx</code> renders <code>&lt;App /&gt;</code> into the root <code>div</code>.</li>
        <li>The browser displays the heading from <code>App</code>, confirming your setup works.</li>
      </ul>
    `
  };
}

if (module4 && module4.lessons[2]) {
  module4.lessons[2] = {
    ...module4.lessons[2],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.3 JSX and Rendering Logic</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is JSX?</h3>
      <p class="text-gray-300 mb-3">
        JSX (JavaScript XML) is a syntax extension used in React to write HTML-like UI inside JavaScript.
        It is not HTML – tools like Babel compile JSX into normal JavaScript before it runs in the browser.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>&lt;h1&gt;Hello&lt;/h1&gt;

// Becomes:
React.createElement("h1", null, "Hello");</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        JSX makes your UI code declarative, readable, component-based, and dynamic. Instead of manually changing
        the DOM, you describe what the UI should look like for a given state.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Embedding JavaScript in JSX</h3>
      <p class="text-gray-300 mb-2">
        JSX allows JavaScript expressions inside curly braces. You can use variables, expressions, function calls,
        and ternary operators to generate dynamic UI.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>const name = "React";

function App() {
  return &lt;h1&gt;Hello {name}&lt;/h1&gt;;
}</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        Only expressions are allowed inside curly braces, not statements like if or for. For branching logic you use
        operators such as the ternary operator or logical AND.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Core JSX Rules</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>Components must return a single parent element.</li>
        <li>All tags must be closed properly.</li>
        <li>Use <code>className</code> instead of <code>class</code>.</li>
        <li>Use <code>htmlFor</code> instead of <code>for</code> on labels.</li>
        <li>Only expressions are allowed inside curly braces.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Rendering Logic</h3>
      <p class="text-gray-300 mb-2">
        Rendering logic defines what UI appears based on conditions or data. In React you commonly use:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>Conditional rendering using the ternary operator.</li>
        <li>Logical AND rendering for simple show / hide blocks.</li>
        <li>List rendering using the <code>map</code> function.</li>
      </ul>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">Conditional Rendering Example</h4>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>{isLoggedIn ? &lt;Dashboard /&gt; : &lt;Login /&gt;}</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        If the condition is true, React renders the first component; otherwise it renders the second. This pattern is
        used heavily for authentication and feature flags.
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">List Rendering Example</h4>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>{users.map((user) =&gt; (
  &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;
))}</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        <code>map</code> loops through an array and returns a list of JSX elements. Each list item must have a unique
        <code>key</code> so React can efficiently track and update elements during re-renders.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Learning Outcome</h3>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Understand what JSX is and how it is compiled.</li>
        <li>Embed JavaScript expressions safely inside JSX.</li>
        <li>Apply conditional and list rendering patterns in real components.</li>
      </ul>
      `,
    syntax: [
      {
        title: 'Basic JSX',
        content: 'function App() {\\n  return <h1>Hello React</h1>;\\n}'
      },
      {
        title: 'JSX with Variable',
        content: 'const name = "React";\\n\\n<h1>Hello {name}</h1>;'
      },
      {
        title: 'Conditional Rendering',
        content: '{isLoggedIn ? <Dashboard /> : <Login />}'
      },
      {
        title: 'Logical AND Rendering',
        content: '{condition && <Component />}'
      },
      {
        title: 'List Rendering',
        content:
          'users.map((user, index) => (\\n  <li key={index}>{user}</li>\\n));'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== JSX and Rendering Logic (Simulated) ===");

let isLoggedIn = false;
const users = ["John", "Alice", "Bob"];

function render() {
  const message = isLoggedIn ? "Welcome User" : "Please Login";
  console.log("Message:", message);
  console.log("Users:", users.join(", "));
}

console.log("Initial render:");
render();

isLoggedIn = true;
console.log("After login:");
render();`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This walkthrough explains the JSX rendering example line by line so you can clearly see how JSX, conditional
        rendering, and list rendering work together.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Importing useState</h3>
      <p class="text-gray-300 mb-2">
        The first line imports the <code>useState</code> Hook from React so the component can store and update state.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Defining the Component</h3>
      <p class="text-gray-300 mb-2">
        The <code>App</code> function is a functional component. React calls it to know what UI to render.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">State and Data</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>A boolean state value stores whether the user is logged in.</li>
        <li>An array called <code>users</code> stores a list of user names.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Returning JSX</h3>
      <p class="text-gray-300 mb-2">
        Inside the <code>return</code> statement, JSX describes the UI: a heading, a message, a button, and a list.
      </p>
      <p class="text-gray-300 mb-2">
        The heading is static, but the message and list dynamically depend on state.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Conditional Rendering</h3>
      <p class="text-gray-300 mb-2">
        A ternary expression checks the login state. When the state is true, the component shows a “Welcome User”
        message; otherwise it shows “Please Login”.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Toggle Button</h3>
      <p class="text-gray-300 mb-2">
        The button has a click handler that flips the login state. Each click triggers a re-render, so the text on the
        screen switches between the two messages.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">List Rendering</h3>
      <p class="text-gray-300 mb-2">
        The <code>users</code> array is rendered using <code>map</code>. For each name, a list item is created and
        given a key. React uses these keys to track items efficiently.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Execution Flow</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>The component renders with the initial login state.</li>
        <li>JSX displays the appropriate message and the list of users.</li>
        <li>When the button is clicked, state changes and React re-renders the JSX.</li>
        <li>The UI updates automatically without manual DOM manipulation.</li>
      </ul>
    `
  };
}

if (module4 && module4.lessons[3]) {
  module4.lessons[3] = {
    ...module4.lessons[3],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.4 Functional Components and Component Design</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is a Functional Component?</h3>
      <p class="text-gray-300 mb-3">
        A functional component is a JavaScript function that returns JSX to render UI. This is the modern and
        recommended way to create React components.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function Header() {
  return &lt;h1&gt;Welcome&lt;/h1&gt;;
}</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        This function is a React component because it returns JSX. React calls it whenever this component needs to be
        rendered.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Why Functional Components are Used</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>Better performance and a simpler mental model than class components.</li>
        <li>Cleaner code with less boilerplate.</li>
        <li>Easy state management using Hooks like <code>useState</code>.</li>
        <li>Easy reuse and scalability in large applications.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Component-Based Architecture</h3>
      <p class="text-gray-300 mb-3">
        React follows a component-based architecture. The UI is divided into small reusable blocks that each handle
        their own UI and logic.
      </p>
      <p class="text-gray-300 mb-2">Example structure:</p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>App component</li>
        <li>Header component</li>
        <li>Sidebar component</li>
        <li>Footer component</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Component Reusability and Composition</h3>
      <p class="text-gray-300 mb-2">
        The same component can be reused multiple times:
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>&lt;User /&gt;
&lt;User /&gt;
&lt;User /&gt;</code></pre>
      </div>
      <p class="text-gray-300 mb-2">
        Component composition means combining components to build complex UI:
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>&lt;App&gt;
  &lt;Header /&gt;
  &lt;Dashboard /&gt;
  &lt;Footer /&gt;
&lt;/App&gt;</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Rules for Functional Components</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>Component names must start with a capital letter (for example <code>Header</code>).</li>
        <li>Components must return JSX or <code>null</code>.</li>
        <li>Components must be exported to be used in other files.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Real-World Examples</h3>
      <p class="text-gray-300 mb-2">
        In real applications almost everything is built as a component:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Navbar component</li>
        <li>Product card component</li>
        <li>User profile component</li>
        <li>Dashboard layout component</li>
      </ul>
      <p class="text-gray-300 mb-3">
        Good component design leads to reusability, maintainability, scalability, and cleaner architecture.
      </p>
      `,
    syntax: [
      {
        title: 'Basic Functional Component',
        content: 'function App() {\\n  return <h1>Hello World</h1>;\\n}\\n\\nexport default App;'
      },
      {
        title: 'Multiple Components',
        content:
          'function Header() {\\n  return <h1>Header</h1>;\\n}\\n\\nfunction Footer() {\\n  return <h1>Footer</h1>;\\n}'
      },
      {
        title: 'Using Components inside Component',
        content:
          'function App() {\\n  return (\\n    <div>\\n      <Header />\\n      <Footer />\\n    </div>\\n  );\\n}'
      },
      {
        title: 'Arrow Function Component',
        content: 'const Header = () => {\\n  return <h1>Header</h1>;\\n};'
      },
      {
        title: 'Reusable Component',
        content: 'function User() {\\n  return <h2>User Component</h2>;\\n}'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Functional Components (Simulated) ===");

function Header() {
  return "Header: Welcome to My Application";
}

function UserCard(name, role) {
  return "UserCard: " + name + " (" + role + ")";
}

function Footer() {
  return "Footer: © 2026 My Application";
}

function App() {
  const parts = [
    Header(),
    UserCard("Jashwanth", "Developer"),
    UserCard("Anita", "Designer"),
    Footer()
  ];

  return parts.join(" | ");
}

console.log("App render output:");
console.log(App());`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This example shows how to design UI using small functional components and how they work together.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Header Component</h3>
      <p class="text-gray-300 mb-2">
        <code>function Header()</code> defines a functional component. It returns an <code>&lt;h1&gt;</code> element
        with a welcome message. Whenever <code>&lt;Header /&gt;</code> is used, React runs this function.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">UserCard Component</h3>
      <p class="text-gray-300 mb-2">
        <code>function UserCard()</code> returns a <code>&lt;div&gt;</code> containing user information. This component
        can later be improved to accept props and display dynamic data.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Footer Component</h3>
      <p class="text-gray-300 mb-2">
        <code>function Footer()</code> is responsible only for the footer text. Separating it as a component keeps the
        layout clean and reusable.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">App Component</h3>
      <p class="text-gray-300 mb-2">
        The <code>App</code> component composes all other components: it renders <code>Header</code>,
        <code>UserCard</code> (twice), and <code>Footer</code>. This shows component composition in action.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Exporting App</h3>
      <p class="text-gray-300 mb-2">
        <code>export default App;</code> makes the <code>App</code> component the default export so React can render it
        in the entry file.
      </p>
    `
  };
}

if (module4 && module4.lessons[4]) {
  module4.lessons[4] = {
    ...module4.lessons[4],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.5 Props and Component Communication</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What are Props?</h3>
      <p class="text-gray-300 mb-3">
        Props (short for properties) are used to pass data from one component to another. Props make components
        dynamic and reusable.
      </p>
      <p class="text-gray-300 mb-3">
        Data flows in one direction: <strong>Parent Component → Child Component</strong>. Props are read-only – a child
        cannot modify them directly.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Why Props are Needed</h3>
      <p class="text-gray-300 mb-2">
        Without props, components could only display static data. With props you can:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Render dynamic UI</li>
        <li>Reuse components with different data</li>
        <li>Share data between components</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Basic Example</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>&lt;User name="Jashwanth" /&gt;
&lt;User name="Rahul" /&gt;
&lt;User name="Anita" /&gt;</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        The same <code>User</code> component is reused three times with different data. Only the props change.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">How Props Work</h3>
      <ol class="list-decimal list-inside text-gray-300 mb-3">
        <li>The parent component sends props in JSX.</li>
        <li>The child component receives props as a parameter.</li>
        <li>The child uses props to render UI.</li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Props are Read-Only</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>// Wrong
props.name = "New Name";

// Correct
function User(props) {
  return &lt;h1&gt;{props.name}&lt;/h1&gt;;
}</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Props with Multiple Values</h3>
      <p class="text-gray-300 mb-2">
        Props can carry strings, numbers, booleans, arrays, objects, or even functions.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>&lt;User name="Jashwanth" age={22} role="Developer" /&gt;</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Props Destructuring (Professional Style)</h3>
      <p class="text-gray-300 mb-2">
        Instead of using <code>props.name</code> everywhere, you can destructure props directly:
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function User({ name }) {
  return &lt;h1&gt;{name}&lt;/h1&gt;;
}</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Component Communication Flow</h3>
      <p class="text-gray-300 mb-2">
        React follows one-way data flow: <strong>parent → child</strong>. This makes applications predictable and easier
        to debug.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Learning Outcome</h3>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Understand props and why they are important.</li>
        <li>Pass and receive props between components.</li>
        <li>Build reusable, data-driven components.</li>
      </ul>
      `,
    syntax: [
      {
        title: 'Passing Props',
        content: '<User name="Jashwanth" />'
      },
      {
        title: 'Receiving Props',
        content: 'function User(props) {\\n  return <h1>{props.name}</h1>;\\n}'
      },
      {
        title: 'Destructuring Props',
        content: 'function User({ name }) {\\n  return <h1>{name}</h1>;\\n}'
      },
      {
        title: 'Multiple Props',
        content: '<User name="Jashwanth" age={22} role="Developer" />'
      },
      {
        title: 'Using Props in JSX',
        content: '<h1>{props.name}</h1>\\n<p>{props.role}</p>'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Props and Component Communication (Simulated) ===");

function UserCard(props) {
  console.log("Rendering UserCard for:", props.name);
  console.log("  Role:", props.role);
  console.log("  Experience:", props.experience, "years");
}

function App() {
  UserCard({ name: "Jashwanth", role: "Frontend Developer", experience: 2 });
  UserCard({ name: "Rahul", role: "Backend Developer", experience: 3 });
  UserCard({ name: "Anita", role: "Full Stack Developer", experience: 4 });
}

App();`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This live code shows how a parent component sends props to a reusable child component.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">UserCard Component</h3>
      <p class="text-gray-300 mb-2">
        <code>function UserCard(props)</code> declares a functional component that receives a <code>props</code> object.
        The JSX inside uses <code>{props.name}</code>, <code>{props.role}</code>, and
        <code>{props.experience}</code> to render dynamic data.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">App Component (Parent)</h3>
      <p class="text-gray-300 mb-2">
        <code>function App()</code> is the parent component. It renders three <code>&lt;UserCard /&gt;</code> elements
        and passes different props each time.
      </p>
      <p class="text-gray-300 mb-2">
        For example, the first card passes <code>name="Jashwanth"</code>, <code>role="Frontend Developer"</code>, and
        <code>experience={2}</code>.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Execution Flow</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>The <code>App</code> component renders.</li>
        <li>Each <code>&lt;UserCard /&gt;</code> call creates a new props object.</li>
        <li><code>UserCard</code> reads data from <code>props</code> and displays it.</li>
        <li>The same component is reused three times with different values.</li>
      </ul>
    `
  };
}

if (module4 && module4.lessons[5]) {
  module4.lessons[5] = {
    ...module4.lessons[5],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.6 State Management using useState</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is State in React?</h3>
      <p class="text-gray-300 mb-3">
        State is a built-in object used to store dynamic data inside a component. When state changes, React automatically
        re-renders the component and updates the UI.
      </p>
      <p class="text-gray-300 mb-2">State lets components:</p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Update UI dynamically</li>
        <li>Respond to user interactions</li>
        <li>Store temporary data</li>
        <li>Trigger re-rendering</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is useState?</h3>
      <p class="text-gray-300 mb-2">
        <code>useState</code> is a React Hook that adds state to functional components.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>const [state, setState] = useState(initialValue);</code></pre>
      </div>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><code>state</code> – current value.</li>
        <li><code>setState</code> – function to update the value.</li>
        <li><code>initialValue</code> – starting value.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">How useState Works</h3>
      <ol class="list-decimal list-inside text-gray-300 mb-3">
        <li>The component renders and initializes state.</li>
        <li>User interacts with the UI.</li>
        <li>You call the setter function.</li>
        <li>React updates the state and re-renders the component.</li>
        <li>The UI updates to show the new value.</li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Rules of useState</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Call <code>useState</code> only inside functional components.</li>
        <li>Call it at the top level (not inside loops or conditions).</li>
        <li>Never modify state directly.</li>
      </ul>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>// Wrong
count = count + 1;

// Correct
setCount(count + 1);</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Multiple States</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>const [count, setCount] = useState(0);
const [name, setName] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Learning Outcome</h3>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Understand how state makes UI interactive.</li>
        <li>Use <code>useState</code> safely with multiple variables.</li>
        <li>Update state using the previous value when needed.</li>
      </ul>
      `,
    syntax: [
      {
        title: 'Basic useState',
        content: 'const [count, setCount] = useState(0);'
      },
      {
        title: 'Updating State',
        content: 'setCount(count + 1);'
      },
      {
        title: 'Boolean State',
        content: 'const [isOpen, setIsOpen] = useState(false);'
      },
      {
        title: 'String State',
        content: 'const [name, setName] = useState("");'
      },
      {
        title: 'Using Previous State (Best Practice)',
        content: 'setCount((prevCount) => prevCount + 1);'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== useState Concept using Plain JavaScript ===");

function createCounter() {
  let count = 0;

  return {
    increase() {
      count += 1;
      console.log("Count after increase:", count);
    },
    decrease() {
      count -= 1;
      console.log("Count after decrease:", count);
    },
    getCount() {
      console.log("Current count:", count);
    }
  };
}

const counter = createCounter();
counter.getCount();
counter.increase();
counter.increase();
counter.decrease();`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This code demonstrates how to manage multiple pieces of state using <code>useState</code>.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">State Declarations</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><code>count</code> stores the current counter value.</li>
        <li><code>isVisible</code> controls whether the message is shown.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Increase and Decrease</h3>
      <p class="text-gray-300 mb-2">
        The <code>increase</code> and <code>decrease</code> functions use the previous state value to avoid bugs when
        multiple updates happen quickly.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Toggle Visibility</h3>
      <p class="text-gray-300 mb-2">
        <code>setIsVisible((prev) =&gt; !prev);</code> flips the boolean state. This controls whether the message
        paragraph is rendered.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Rendering</h3>
      <p class="text-gray-300 mb-2">
        The JSX shows the current count and renders buttons that call the handler functions. The message is rendered
        only when <code>isVisible</code> is true.
      </p>
    `
  };
}

if (module4 && module4.lessons[6]) {
  module4.lessons[6] = {
    ...module4.lessons[6],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.7 Event Handling in React</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is Event Handling?</h3>
      <p class="text-gray-300 mb-3">
        Event handling allows React applications to respond to user actions like clicks, typing, mouse movement, key
        presses, and form submissions. Without events, your UI would be static.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Common React Events</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><code>onClick</code> – button click</li>
        <li><code>onChange</code> – input change</li>
        <li><code>onSubmit</code> – form submission</li>
        <li><code>onMouseOver</code> – mouse hover</li>
        <li><code>onKeyDown</code> – keyboard press</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">HTML vs React Events</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>// HTML
&lt;button onclick="handleClick()"&gt;

// React
&lt;button onClick={handleClick}&gt;</code></pre>
      </div>
      <p class="text-gray-300 mb-3">
        React uses camelCase event names and passes a function reference instead of a string.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Event Handler Functions</h3>
      <p class="text-gray-300 mb-2">
        An event handler is a function that runs when a specific event occurs.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function handleClick() {
  console.log("Button clicked");
}</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Event Object and preventDefault</h3>
      <p class="text-gray-300 mb-2">
        React automatically passes an event object to handlers. For forms you often call <code>event.preventDefault()</code>
        to stop the default browser behavior (page reload).
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Real-World Uses</h3>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Handling login/logout buttons.</li>
        <li>Updating search input as the user types.</li>
        <li>Submitting forms without page refresh.</li>
        <li>Triggering navigation and filtering lists.</li>
      </ul>
      `,
    syntax: [
      {
        title: 'Basic Click Event',
        content: '<button onClick={handleClick}>Click</button>'
      },
      {
        title: 'Event Handler Function',
        content: 'function handleClick() {\\n  console.log("Clicked");\\n}'
      },
      {
        title: 'Arrow Function Event',
        content: '<button onClick={() => alert("Clicked")}>'
      },
      {
        title: 'Input Change Event',
        content: '<input onChange={handleChange} />'
      },
      {
        title: 'Form Submit Event',
        content: '<form onSubmit={handleSubmit}>'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Event Handling Simulation ===");

function handleClick() {
  console.log("Button clicked");
}

function handleInputChange(value) {
  console.log("Input changed:", value);
}

console.log("Simulating user events...");
handleClick();
handleInputChange("React Developer");`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This program shows how to handle click, input, and form submit events in a React component.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">State Variables</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><code>message</code> stores the current status text.</li>
        <li><code>name</code> stores the value typed into the input field.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-1">Click Handler</h3>
      <p class="text-gray-300 mb-2">
        <code>handleClick</code> is attached to the button’s <code>onClick</code>. When the button is pressed it calls
        <code>setMessage("Button Clicked")</code>, updating the UI.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Input Change Handler</h3>
      <p class="text-gray-300 mb-2">
        <code>handleInputChange</code> receives an event object. <code>event.target.value</code> gives the current value
        of the input, which is stored in <code>name</code>.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Form Submit Handler</h3>
      <p class="text-gray-300 mb-2">
        <code>handleSubmit</code> is attached to <code>onSubmit</code>. It first calls
        <code>event.preventDefault()</code> to prevent page refresh, then updates the message to greet the entered name.
      </p>
    `
  };
}

if (module4 && module4.lessons[7]) {
  module4.lessons[7] = {
    ...module4.lessons[7],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.8 Conditional Rendering and Lists</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is Conditional Rendering?</h3>
      <p class="text-gray-300 mb-3">
        Conditional rendering means showing different UI based on conditions. React uses normal JavaScript conditions to
        control what appears on screen.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Why Conditional Rendering Matters</h3>
      <p class="text-gray-300 mb-2">
        Without conditional rendering, UI would always remain static. In real applications you use it for:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Login vs logout views</li>
        <li>Showing or hiding dashboards</li>
        <li>Displaying error or success messages</li>
        <li>Rendering data only when it is available</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Methods of Conditional Rendering</h3>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li><strong>if statement</strong></li>
        <li><strong>Ternary operator</strong> – most common in JSX</li>
        <li><strong>Logical AND operator</strong></li>
      </ul>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">Ternary Operator</h4>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>{isLoggedIn ? &lt;h1&gt;Welcome&lt;/h1&gt; : &lt;h1&gt;Please Login&lt;/h1&gt;}</code></pre>
      </div>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">Logical AND Operator</h4>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>{isAdmin && &lt;h1&gt;Admin Panel&lt;/h1&gt;}</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is List Rendering?</h3>
      <p class="text-gray-300 mb-2">
        List rendering means displaying multiple items from an array. React commonly uses <code>map()</code> to render
        lists.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>const users = ["John", "Alice", "Bob"];

{users.map((user) => (
  &lt;li&gt;{user}&lt;/li&gt;
))}</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Keys in Lists</h3>
      <p class="text-gray-300 mb-2">
        Each list element must have a unique <code>key</code> so React can identify and update items efficiently.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>&lt;li key={index}&gt;{user}&lt;/li&gt;</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Conditional Rendering with Lists</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>{users.length &gt; 0 ? (
  users.map((user) => &lt;li key={user}&gt;{user}&lt;/li&gt;)
) : (
  &lt;p&gt;No users found&lt;/p&gt;
)}</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Learning Outcome</h3>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Implement ternary and logical AND rendering.</li>
        <li>Render lists using <code>map()</code> with proper keys.</li>
        <li>Combine conditions and lists to build dynamic interfaces.</li>
      </ul>
      `,
    syntax: [
      {
        title: 'Ternary Operator',
        content: '{condition ? <TrueComponent /> : <FalseComponent />}'
      },
      {
        title: 'Logical AND Operator',
        content: '{condition && <Component />}'
      },
      {
        title: 'if Statement Rendering',
        content: 'if (condition) {\\n  return <Component />;\\n}'
      },
      {
        title: 'List Rendering',
        content:
          'array.map((item, index) => (\\n  <Component key={index} />\\n));'
      },
      {
        title: 'Conditional List Rendering',
        content:
          'array.length > 0 ? (\\n  array.map(item => <li>{item}</li>)\\n) : (\\n  <p>No Data</p>\\n)'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Conditional Rendering and Lists (Simulated) ===");

let isLoggedIn = false;
const users = ["Rahul", "Anita", "Kiran"];

function showScreen() {
  const message = isLoggedIn ? "Welcome User" : "Please Login";
  console.log("Message:", message);

  if (users.length > 0) {
    console.log("User list:");
    users.forEach((user, index) => {
      console.log(" ", index + 1 + ".", user);
    });
  } else {
    console.log("No users available");
  }

  if (isLoggedIn) {
    console.log("Protected content is visible");
  }
}

console.log("Initial screen:");
showScreen();

isLoggedIn = true;
console.log("After login:");
showScreen();`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This example combines conditional rendering with list rendering to build a dynamic UI.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Login State</h3>
      <p class="text-gray-300 mb-2">
        <code>isLoggedIn</code> controls which heading is shown and whether protected content appears.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Ternary Rendering</h3>
      <p class="text-gray-300 mb-2">
        The ternary operator chooses between "Welcome User" and "Please Login" based on <code>isLoggedIn</code>.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">User List</h3>
      <p class="text-gray-300 mb-2">
        <code>users.length &gt; 0</code> checks if there are users. If yes, <code>map()</code> renders each name inside a
        <code>&lt;li&gt;</code> with a key. Otherwise a "No users available" message is shown.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Logical AND Rendering</h3>
      <p class="text-gray-300 mb-2">
        <code>{isLoggedIn && ...}</code> renders the protected content paragraph only when the user is logged in.
      </p>
    `
  };
}

if (module4 && module4.lessons[8]) {
  module4.lessons[8] = {
    ...module4.lessons[8],
    duration: '15 min',
    content: `
      <h2 class="text-2xl font-bold text-white mb-4">4.9 Component Lifecycle and useEffect</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is Component Lifecycle?</h3>
      <p class="text-gray-300 mb-3">
        In React, every component goes through different phases during its existence. These phases together are called
        the <strong>Component Lifecycle</strong>.
      </p>
      <p class="text-gray-300 mb-3">
        Even though functional components do not expose lifecycle methods like class components, the same lifecycle
        concepts still exist and are controlled using hooks such as <code>useEffect</code>.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Lifecycle Phases</h3>
      <ol class="list-decimal list-inside text-gray-300 mb-4">
        <li>
          <strong>Mounting Phase</strong> – when the component is created and added to the DOM.<br />
          Examples: component loads for the first time, UI appears on screen, an API call runs on page load.
        </li>
        <li>
          <strong>Updating Phase</strong> – when component state or props change and the component re-renders.<br />
          Examples: user clicks a button, state updates, part of the UI changes.
        </li>
        <li>
          <strong>Unmounting Phase</strong> – when the component is removed from the DOM.<br />
          Examples: navigating to another page, closing a modal, cleanup tasks running.
        </li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">What is useEffect?</h3>
      <p class="text-gray-300 mb-3">
        <code>useEffect</code> is a React Hook that lets you perform lifecycle operations inside functional components.
        It is used to run side effects such as API calls, timers, event listeners, logging, and cleanup logic.
      </p>
      <p class="text-gray-300 mb-3">
        Side effects are pieces of code that affect something outside the component&apos;s render, such as the browser
        DOM, local storage, or a network request.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Why useEffect is Needed</h3>
      <p class="text-gray-300 mb-3">
        React components can re-render many times. <code>useEffect</code> gives you precise control over when a piece of
        code should run:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-3">
        <li>Only when the component first mounts.</li>
        <li>Whenever specific state or props change.</li>
        <li>On every render (less common).</li>
        <li>When the component is about to unmount (cleanup).</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Common useEffect Patterns</h3>
      <h4 class="text-lg font-semibold text-white mt-4 mb-1">Run only once (Mounting)</h4>
      <p class="text-gray-300 mb-2">
        Used for initial setup such as API calls, analytics events, or setting up subscriptions.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>useEffect(() =&gt; {
  // runs once
}, []);</code></pre>
      </div>

      <h4 class="text-lg font-semibold text-white mt-4 mb-1">Run when state or props change (Updating)</h4>
      <p class="text-gray-300 mb-2">
        Runs only when values in the dependency array change. Common for reacting to user input, URL parameters, or
        other dynamic values.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-3 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>useEffect(() =&gt; {
  // runs when count changes
}, [count]);</code></pre>
      </div>

      <h4 class="text-lg font-semibold text-white mt-4 mb-1">Cleanup on Unmount</h4>
      <p class="text-gray-300 mb-2">
        <code>useEffect</code> can return a cleanup function. React runs this function before the effect runs again and
        when the component unmounts. This is essential for removing event listeners and clearing timers.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>useEffect(() =&gt; {
  // setup code

  return () =&gt; {
    // cleanup code
  };
}, []);</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">Learning Outcome</h3>
      <ul class="list-disc list-inside text-gray-300 mb-2">
        <li>Understand the mounting, updating, and unmounting phases of a component.</li>
        <li>Use <code>useEffect</code> to run code at the right lifecycle moments.</li>
        <li>Add cleanup logic to avoid memory leaks and unexpected behavior.</li>
      </ul>
      `,
    syntax: [
      {
        title: 'Basic useEffect',
        content: 'useEffect(() => {\\n  // code to execute\\n});'
      },
      {
        title: 'Run Once on Mount',
        content: 'useEffect(() => {\\n  // runs once\\n}, []);'
      },
      {
        title: 'Run When State Changes',
        content: 'useEffect(() => {\\n  // runs when count changes\\n}, [count]);'
      },
      {
        title: 'Cleanup Function',
        content:
          'useEffect(() => {\\n  // setup\\n  return () => {\\n    // cleanup\\n  };\\n}, []);'
      }
    ],
    liveCodeIsJsSnippet: true,
    liveCode: `console.log("=== Simulated Component Lifecycle with useEffect ===");

function simulateComponent() {
  console.log("Mount: Component Mounted");
  let count = 0;

  function cleanup() {
    console.log("Cleanup: Component Unmounted or before update");
  }

  function update() {
    count += 1;
    console.log("Update: count is now", count);
  }

  update();
  update();
  cleanup();
}

simulateComponent();`,
    liveCodeExplanation: `
      <p class="mb-3 text-gray-300">
        This example shows how <code>useEffect</code> models component lifecycle behavior in a functional component.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Imports and Component Definition</h3>
      <p class="text-gray-300 mb-2">
        The first line imports React, <code>useState</code> for state management, and <code>useEffect</code> for
        lifecycle control. <code>LifecycleExample</code> is a functional component that uses both.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">State Setup</h3>
      <p class="text-gray-300 mb-2">
        <code>const [count, setCount] = useState(0);</code> creates a state variable. <code>count</code> stores the
        current value, and <code>setCount</code> updates it. The initial value is <code>0</code>.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">useEffect Behavior</h3>
      <p class="text-gray-300 mb-2">
        The <code>useEffect</code> callback runs when the component mounts and whenever <code>count</code> changes. It
        logs <code>"Component Mounted or Updated"</code> each time it runs.
      </p>
      <p class="text-gray-300 mb-2">
        The function returned inside <code>useEffect</code> is the cleanup function. React runs this cleanup before the
        effect runs again and when the component unmounts, logging
        <code>"Component Unmounted or Before Update Cleanup"</code>.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Event Handler</h3>
      <p class="text-gray-300 mb-2">
        <code>increaseCount</code> calls <code>setCount(count + 1)</code>. This updates state, triggers a re-render, and
        causes <code>useEffect</code> to run again with the new value.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Rendered UI</h3>
      <p class="text-gray-300 mb-2">
        The JSX returns a container with a heading showing the current <code>count</code> and a button that calls
        <code>increaseCount</code> when clicked.
      </p>

      <h3 class="text-lg font-semibold text-white mb-1">Execution Steps</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>On first render, <code>count</code> is <code>0</code> and <code>useEffect</code> runs once (mount phase).</li>
        <li>Each button click increments <code>count</code>, triggering a re-render and another effect run.</li>
        <li>Before each new effect, the cleanup function runs, simulating unmount/cleanup behavior.</li>
      </ul>
    `
  };
}

const CourseLearningFrontendIntermediate: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeModuleId, setActiveModuleId] = useState<string>('module-1');
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const [activeContentTab, setActiveContentTab] =
    useState<'lesson' | 'syntax' | 'live-code'>('lesson');
  const [currentVideoSlide] = useState(0);

  const [liveCode, setLiveCode] = useState(defaultLiveCode);
  const [previewKey, setPreviewKey] = useState(0);

  const handleRunCode = () => {
    setPreviewKey((prev) => prev + 1);
  };

  const activeModule = useMemo(
    () => courseData.find((m) => m.id === activeModuleId),
    [activeModuleId]
  );
  const activeLesson = useMemo(
    () => activeModule?.lessons[activeLessonIndex],
    [activeModule, activeLessonIndex]
  );

  useEffect(() => {
    if (activeLesson?.liveCode) {
      setLiveCode(activeLesson.liveCode);
    } else {
      setLiveCode(defaultLiveCode);
    }
  }, [activeLesson]);

  const previewDoc = useMemo(() => {
    if (activeLesson?.liveCodeIsJsSnippet) {
      const safeCode = liveCode.replace(/<\/script/gi, '<\\/script');
      return `<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Playground</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; color: #f5f5f5; background: #121212; }
    h1 { color: #00bceb; margin-bottom: 8px; }
    p { line-height: 1.6; max-width: 720px; }
    pre { background: #111827; padding: 12px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>JavaScript Output Preview</h1>
  <p>console.log output will appear below.</p>
  <pre id="output"></pre>
  <script>
    (function() {
      var originalLog = console.log;
      var outputEl = document.getElementById('output');
      console.log = function() {
        var message = Array.prototype.slice.call(arguments).join(' ');
        if (outputEl) {
          outputEl.textContent += message + '\\n';
        }
        originalLog.apply(console, arguments);
      };
    })();
  </script>
  <script>
${safeCode}
  </script>
</body>
</html>`;
    }
    return liveCode;
  }, [liveCode, activeLesson]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your personal frontend intermediate teacher. Ask me anything about JavaScript, React, or backend integration.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    const newMsg: ChatMessage = { role: 'user', content: text };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const answer = await askLLM(text, updated, {
        courseContext: {
          courseName: 'Frontend Development Intermediate',
          moduleName: activeModule?.title,
          lessonTitle: activeLesson?.title,
          lessonContent: activeLesson?.content.replace(/<[^>]*>/g, '').substring(0, 1500)
        }
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to the AI tutor.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && slug !== activeModuleId) {
      const found = courseData.find((m) => m.id === slug);
      if (found) setActiveModuleId(slug);
    }
  }, [slug, activeModuleId]);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const markLessonComplete = () => {
    const lessonKey = `${activeModuleId}-${activeLessonIndex}`;
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      next.add(lessonKey);
      return next;
    });
  };

  const handlePrev = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    } else {
      const currentModuleIndex = courseData.findIndex((m) => m.id === activeModuleId);
      if (currentModuleIndex > 0) {
        const prevModule = courseData[currentModuleIndex - 1];
        setActiveModuleId(prevModule.id);
        setActiveLessonIndex(prevModule.lessons.length - 1);
      }
    }
  };

  const handleNext = () => {
    markLessonComplete();
    if (activeLessonIndex < (activeModule?.lessons.length || 0) - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else {
      const currentModuleIndex = courseData.findIndex((m) => m.id === activeModuleId);
      if (currentModuleIndex < courseData.length - 1) {
        const nextModule = courseData[currentModuleIndex + 1];
        setActiveModuleId(nextModule.id);
        setActiveLessonIndex(0);
      }
    }
  };

  const isPrevDisabled =
    activeLessonIndex === 0 && activeModuleId === courseData[0].id;
  const isNextDisabled =
    activeLessonIndex === (activeModule?.lessons.length || 0) - 1 &&
    activeModuleId === courseData[courseData.length - 1].id;

  if (!activeModule || !activeLesson) return <div>Loading...</div>;

  return (
    <div className="bg-[#121212] text-white overflow-hidden font-sans h-screen" style={{ zoom: 1.1 }}>
      <div className="flex h-full relative">
        <div
          className={clsx(
            'fixed inset-y-0 left-0 z-40 md:static md:translate-x-0 md:relative transition-transform duration-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          )}
        >
          <Sidebar
            activeModuleId={activeModuleId}
            setActiveModuleId={setActiveModuleId}
            activeLessonIndex={activeLessonIndex}
            setActiveLessonIndex={setActiveLessonIndex}
            completedLessons={completedLessons}
          />
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <div className="h-[50px] bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4 z-20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <button
                className="sm:hidden mr-2 p-1.5 rounded hover:bg-[#333] text-gray-300"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <span
                className="cursor-pointer hover:text-white"
                onClick={() => navigate('/frontend-development-intermediate')}
              >
                Frontend Development Intermediate
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white truncate max-w-[300px]">
                {activeLesson.title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-[#333] rounded-lg p-1 mr-2">
                <button
                  onClick={handlePrev}
                  disabled={isPrevDisabled}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#444] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Previous Lesson"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/student-portal')}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#444] rounded transition-colors"
                  title="Student Portal"
                >
                  <Home className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#444] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Next Lesson"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={toggleTheme}
                className="text-gray-400 hover:text-white"
                title="Toggle Theme"
              >
                {isDark ? '☀' : '☾'}
              </button>
              <span className="text-xs font-bold bg-[#333] px-2 py-1 rounded text-white">
                EN
              </span>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div id="content-scroll-area" className="flex-1 overflow-y-auto relative">
              <div className="relative w-full h-[300px] shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=2070&auto=format&fit=crop"
                  alt="Frontend Development Intermediate"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#00bceb] text-black text-xs font-bold px-2 py-1 rounded">
                        INTERMEDIATE
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                      {activeLesson.title}
                    </h1>
                    <p className="text-gray-200 text-sm md:text-base max-w-2xl drop-shadow-md">
                      {activeModule.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="sticky top-0 z-30 flex items-center gap-6 px-8 lg:px-16 border-b border-[#333] bg-[#1e1e1e] shrink-0">
                <button
                  onClick={() => setActiveContentTab('lesson')}
                  className={clsx(
                    'py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                    activeContentTab === 'lesson'
                      ? 'border-[#00bceb] text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  )}
                >
                  <BookOpen className="w-4 h-4" /> Lesson
                </button>
                <button
                  onClick={() => setActiveContentTab('syntax')}
                  className={clsx(
                    'py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                    activeContentTab === 'syntax'
                      ? 'border-[#00bceb] text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  )}
                >
                  <Code className="w-4 h-4" /> Syntax
                </button>
                <button
                  onClick={() => setActiveContentTab('live-code')}
                  className={clsx(
                    'py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                    activeContentTab === 'live-code'
                      ? 'border-[#00bceb] text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  )}
                >
                  <PlayCircle className="w-4 h-4" /> Live Code
                </button>
              </div>

              <div className="p-8 lg:px-16 w-full">
                <div className="max-w-screen-2xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                    <div className="min-h-[500px]">
                      {activeContentTab === 'lesson' && (
                        <div className="animate-fadeIn">
                          <div
                            className="prose prose-invert prose-lg max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                          ></div>
                        </div>
                      )}

                      {activeContentTab === 'syntax' && (
                        <div className="animate-fadeIn space-y-8">
                          {activeLesson.syntax ? (
                            activeLesson.syntax.map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-[#1e1e1e] rounded-xl border border-gray-700 overflow-hidden"
                              >
                                <div className="p-4 border-b border-gray-700 bg-[#252526] flex justify-between items-center">
                                  <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                                    <Code size={18} className="text-[#00bceb]" />
                                    {item.title}
                                  </h3>
                                  <button
                                    onClick={() => handleCopy(item.content, idx)}
                                    className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs bg-black/20 px-2 py-1 rounded border border-white/5 transition-colors"
                                  >
                                    {copiedIndex === idx ? (
                                      <Check size={12} className="text-green-400" />
                                    ) : (
                                      <Copy size={12} />
                                    )}
                                    {copiedIndex === idx ? 'Copied!' : 'Copy Code'}
                                  </button>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                  <pre className="text-sm font-mono leading-relaxed p-4 text-gray-300">
                                    <code>{item.content}</code>
                                  </pre>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 py-10">
                              <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
                              <p>No syntax examples for this lesson yet.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeContentTab === 'live-code' && (
                        <>
                          <div className="animate-fadeIn flex flex-col border border-[#333] rounded-xl overflow-hidden shadow-2xl bg-[#0d0d0d] min-h-[450px]">
                            <div className="bg-[#1e1e1e] p-2 border-b border-[#333] flex justify-between items-center">
                              <div className="flex items-center gap-2 px-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs text-gray-400 ml-2">
                                  HTML / CSS / JS Playground
                                </span>
                              </div>
                              <button
                                onClick={handleRunCode}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                              >
                                <PlayCircle className="w-4 h-4" /> Run Code
                              </button>
                            </div>

                            <div className="flex-1 flex min-h-[380px]">
                              <div className="w-1/2 border-r border-[#333] flex flex-col bg-[#0d0d0d] relative">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-bl">
                                  EDITOR
                                </div>
                                <textarea
                                  value={liveCode}
                                  onChange={(e) => setLiveCode(e.target.value)}
                                  className="flex-1 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 outline-none resize-none custom-scrollbar"
                                  spellCheck={false}
                                />
                              </div>

                              <div className="w-1/2 bg-white relative">
                                <div className="absolute top-0 right-0 bg-gray-600 text-white text-[10px] px-2 py-0.5 rounded-bl z-10">
                                  PREVIEW
                                </div>
                                <iframe
                                  key={previewKey}
                                  srcDoc={previewDoc}
                                  title="Live Preview"
                                  className="w-full h-full border-none"
                                  sandbox="allow-scripts allow-modals"
                                />
                              </div>
                            </div>
                          </div>
                          {activeLesson.liveCodeExplanation && (
                            <div className="mt-6">
                              <div
                                className="prose prose-invert prose-sm max-w-none text-gray-300"
                                dangerouslySetInnerHTML={{ __html: activeLesson.liveCodeExplanation }}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="hidden xl:block xl:col-span-1 pl-4">
                    <div className="sticky top-6">
                      <ChatSidebar
                        messages={messages}
                        onSend={handleSendMessage}
                        loading={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningFrontendIntermediate;
