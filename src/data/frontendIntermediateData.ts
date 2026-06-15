
import {
  module5Lesson4, module5Lesson5, module5Lesson6, module5Lesson7, module5Lesson8, module5Lesson9,
  module6Lesson1, module6Lesson2, module6Lesson3, module6Lesson4, module6Lesson5, module6Lesson6
} from '../components/CourseLearningFrontendIntermediatepart2';
import { CourseModule, Lesson } from './types';

const intermediateStructure = [
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

export const defaultLiveCode = `<!DOCTYPE html>
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
    
  </script>

</body>
</html>`;

const lesson1_1_content = `
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
        <pre class="text-sm overflow-x-auto"><code>
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
    `;

const lesson1_1_syntax = [
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
        content: ' // undefined\nvar x = 5;'
      },
      {
        title: 'Stack Overflow Example',
        content: 'function test() {\n    test();\n}\n\ntest();'
      }
    ];

const lesson1_1_liveCode = `



var a = 10;

function greet() {
  var message = "Hello World";
  
}

greet();





function one() {
  
  two();
}

function two() {
  
  three();
}

function three() {
  
}

one();`;

const lesson1_1_liveCodeExplanation = `
      <p class="mb-2 text-gray-300">
        This live code demonstrates how execution contexts and the call stack work for both simple function calls and
        nested function chains.
      </p>
      <h3 class="text-lg font-semibold text-white mb-2">Example 1: Execution Context</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <code></code> runs in the global execution context and prints the first message.
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
          <code></code> runs back in the global context.
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
          Inside <code>two</code>, calling <code>three();</code> pushes another context. It logs
          <code>"Inside Three"</code>.
        </li>
        <li>
          As each function returns, its context is popped off the stack in reverse order (LIFO).
        </li>
      </ul></p>
    `;

const lesson1_2_content = `
      <h2 class="text-2xl font-bold text-white mb-4">1.2 Closures and Lexical Scope</h2>
      <p class="text-gray-300 mb-4">
        A <strong>closure</strong> is one of the most powerful and often misunderstood features of JavaScript. 
        It gives you access to an outer function's scope from an inner function. In JavaScript, closures are created 
        every time a function is created, at function creation time.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Lexical Scope</h3>
      <p class="text-gray-300 mb-3">
        To understand closures, you first need to understand <strong>Lexical Scope</strong>. Lexical scope means that 
        scope is determined by the position of variables and blocks in the source code.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>A child function has access to variables defined in its parent function.</li>
        <li>The parent function does <strong>not</strong> have access to variables defined in the child function.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">How Closures Work</h3>
      <p class="text-gray-300 mb-3">
        Usually, when a function finishes executing, its local variables are removed from memory. 
        However, if an inner function continues to exist (e.g., it is returned or assigned to a global variable), 
        it "closes over" the variables it needs from the outer scope, keeping them alive.
      </p>
      
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>function outer() {
  const secret = "I am hidden";
  
  function inner() {
     // Accesses variable from outer scope
  }
  
  return inner;
}

const myFunc = outer();
myFunc(); // Logs: "I am hidden"</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Practical Use Cases</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Data Privacy:</strong> Emulating private methods and variables.</li>
        <li><strong>Function Factories:</strong> Creating functions with preset arguments (Currying/Partial Application).</li>
        <li><strong>Event Handlers:</strong> Maintaining state in asynchronous callbacks.</li>
        <li><strong>Memoization:</strong> Caching results of expensive function calls.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Common Pitfalls</h3>
      <p class="text-gray-300 mb-3">
        <strong>Memory Leaks:</strong> Since closures hold references to outer variables, they can prevent garbage collection 
        if not managed correctly, leading to memory leaks in large applications.
      </p>
      <p class="text-gray-300 mb-3">
        <strong>Loop Variable Issue (var vs let):</strong> Using <code>var</code> in a loop with a closure often leads to 
        unexpected behavior because <code>var</code> is function-scoped. Using <code>let</code> (block-scoped) fixes this.
      </p>
    `;

const lesson1_2_syntax = [
      {
        title: 'Basic Closure',
        content: `function outer() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}`
      },
      {
        title: 'Immediately Invoked Function Expression (IIFE)',
        content: `const counter = (function() {
  let privateCount = 0;
  return {
    increment: function() { privateCount++; }
  };
})();`
      }
    ];

const lesson1_2_liveCode = `

function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment: function() {
      count++;
      
    },
    decrement: function() {
      count--;
      
    },
    getCount: function() {
      return count;
    }
  };
}

const counterA = createCounter();
const counterB = createCounter();


counterA.increment();
counterA.increment();


counterB.increment();



function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);


`;

const lesson1_2_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Example 1: Data Privacy with Closures</h3>
      <p class="text-gray-300 mb-3">
        Here, <code>createCounter</code> returns an object with methods. These methods form a closure over the 
        <code>count</code> variable. 
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>You cannot access <code>count</code> directly from the outside.</li>
        <li><code>counterA</code> and <code>counterB</code> maintain their own independent copies of <code>count</code>.</li>
      </ul>

      <h3 class="text-lg font-semibold text-white mb-2">Example 2: Function Factories</h3>
      <p class="text-gray-300 mb-3">
        <code>createMultiplier</code> takes a <code>multiplier</code> and returns a new function.
      </p>
      <ul class="list-disc list-inside text-gray-300">
        <li><code>double</code> remembers that <code>multiplier</code> was 2.</li>
        <li><code>triple</code> remembers that <code>multiplier</code> was 3.</li>
        <li>This pattern is very useful for creating reusable utility functions.</li>
      </ul>
    `;

const lesson1_3_content = `
      <h2 class="text-2xl font-bold text-white mb-4">1.3 Higher-Order Functions</h2>
      <p class="text-gray-300 mb-4">
        A <strong>Higher-Order Function (HOF)</strong> is a function that does at least one of the following:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Takes one or more functions as arguments (callbacks).</li>
        <li>Returns a function as its result.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        In JavaScript, functions are <strong>First-Class Citizens</strong>, meaning they can be treated like any other variable—assigned to variables, passed as arguments, and returned from other functions.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Common Higher-Order Functions</h3>
      <p class="text-gray-300 mb-3">
        You likely use HOFs every day without realizing it. Array methods like <code>map</code>, <code>filter</code>, and <code>reduce</code> are all higher-order functions.
      </p>
      
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>const numbers = [1, 2, 3];

// map takes a function as an argument
const doubled = numbers.map(num => num * 2); 

 // [2, 4, 6]</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why use HOFs?</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Abstraction:</strong> HOFs allow you to abstract over actions, not just values.</li>
        <li><strong>Composition:</strong> You can build complex logic by combining small, simple functions.</li>
        <li><strong>Cleaner Code:</strong> Declarative code (what to do) is often easier to read than imperative code (how to do it).</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Callbacks vs HOFs</h3>
      <p class="text-gray-300 mb-3">
        A <strong>callback</strong> is the function passed <em>into</em> another function. <br/>
        The function <em>receiving</em> the callback is the <strong>Higher-Order Function</strong>.
      </p>
    `;

const lesson1_3_syntax = [
      {
        title: 'HOF accepting a function',
        content: `function operate(fn, a, b) {
  return fn(a, b);
}`
      },
      {
        title: 'HOF returning a function',
        content: `function createGreeter(greeting) {
  return function(name) {
    
  };
}`
      }
    ];

const lesson1_3_liveCode = `

// A custom HOF that mimics Array.map
function myMap(array, transformFunction) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    // Call the passed function for each element
    const transformed = transformFunction(array[i], i);
    result.push(transformed);
  }
  return result;
}

const numbers = [10, 20, 30, 40];
const halved = myMap(numbers, (num) => num / 2);






// HOF that returns a function
function greaterThan(n) {
  return function(m) {
    return m > n;
  };
}

const greaterThan10 = greaterThan(10);
const greaterThan100 = greaterThan(100);






const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
];

// Filter users over 28
const olderUsers = users.filter(user => user.age > 28);
`;

const lesson1_3_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Example 1: Custom Map</h3>
      <p class="text-gray-300 mb-3">
        <code>myMap</code> is a Higher-Order Function because it accepts <code>transformFunction</code> as an argument.
        It applies this function to every element in the array.
      </p>

      <h3 class="text-lg font-semibold text-white mb-2">Example 2: Returning Functions</h3>
      <p class="text-gray-300 mb-3">
        <code>greaterThan(n)</code> returns a new function that checks if a value is greater than <code>n</code>.
        This allows us to create specialized checking functions like <code>greaterThan10</code> easily.
      </p>
    `;

const lesson1_4_content = `
      <h2 class="text-2xl font-bold text-white mb-4">1.4 Event Loop, Microtasks, and Macrotasks</h2>
      <p class="text-gray-300 mb-4">
        JavaScript is <strong>single-threaded</strong>, meaning it can only do one thing at a time. However, it can perform 
        non-blocking asynchronous operations (like fetching data or setting timers) using the <strong>Event Loop</strong>.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">How JavaScript Executes Code</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
        <li><strong>Call Stack:</strong> Executes synchronous code (LIFO).</li>
        <li><strong>Web APIs:</strong> Browser features (setTimeout, DOM events, fetch) run outside the main thread.</li>
        <li><strong>Callback Queue (Macrotasks):</strong> Stores callbacks from Web APIs (e.g., setTimeout).</li>
        <li><strong>Microtask Queue:</strong> Stores high-priority tasks (Promises, queueMicrotask).</li>
        <li><strong>Event Loop:</strong> Constantly checks if the Call Stack is empty. If empty, it pushes tasks from the queues to the stack.</li>
      </ol>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Microtasks vs Macrotasks</h3>
      <p class="text-gray-300 mb-3">
        The Event Loop prioritizes the <strong>Microtask Queue</strong> over the <strong>Macrotask Queue</strong>.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Microtasks:</strong> Promise.then(), catch(), finally(), queueMicrotask(), MutationObserver.</li>
        <li><strong>Macrotasks:</strong> setTimeout, setInterval, setImmediate, I/O, UI rendering.</li>
      </ul>
      <p class="text-gray-300 mb-3">
        <strong>Rule:</strong> The Event Loop will process <em>all</em> microtasks before moving to the next macrotask.
      </p>

      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>

setTimeout(() =>  // Macrotask

Promise.resolve().then(() =>  // Microtask



// Output:
// Start
// End
// Promise
// Timeout</code></pre>
      </div>
    `;

const lesson1_4_syntax = [
      {
        title: 'setTimeout (Macrotask)',
        content: `setTimeout(() => {
  
}, 1000);`
      },
      {
        title: 'Promise (Microtask)',
        content: `Promise.resolve().then(() => {
  
});`
      },
      {
        title: 'queueMicrotask',
        content: `queueMicrotask(() => {
  
});`
      }
    ];

const lesson1_4_liveCode = `



setTimeout(() => {
  
}, 0);

Promise.resolve()
  .then(() => {
    
  })
  .then(() => {
    
  });

queueMicrotask(() => {
  
});



// Try to predict the order before running!`;

const lesson1_4_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Execution Order Explained</h3>
      <ul class="list-decimal list-inside text-gray-300 space-y-2">
        <li><strong>"Script Start"</strong> and <strong>"Script End"</strong> are synchronous, so they run immediately.</li>
        <li><code>setTimeout</code> is a <strong>Macrotask</strong>, so it goes to the Callback Queue.</li>
        <li><code>Promise.then</code> and <code>queueMicrotask</code> are <strong>Microtasks</strong>, so they go to the Microtask Queue.</li>
        <li>The Event Loop checks the Call Stack. It's empty after "Script End".</li>
        <li>It checks the <strong>Microtask Queue</strong> first. It runs "Promise 1", "Promise 2", and "queueMicrotask" in order.</li>
        <li>Finally, it checks the <strong>Macrotask Queue</strong> and runs "setTimeout".</li>
      </ul>
    `;

const lesson1_5_content = `
      <h2 class="text-2xl font-bold text-white mb-4">1.5 Promises and Async/Await Deep Dive</h2>
      <p class="text-gray-300 mb-4">
        Asynchronous programming allows your code to run in the background without blocking the main thread. 
        <strong>Promises</strong> and <strong>Async/Await</strong> are the modern standards for handling async operations 
        like fetching data from an API.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">The Promise Object</h3>
      <p class="text-gray-300 mb-3">
        A Promise represents a value that may be available now, in the future, or never. It has three states:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Pending:</strong> Initial state, neither fulfilled nor rejected.</li>
        <li><strong>Fulfilled:</strong> Operation completed successfully (resolve).</li>
        <li><strong>Rejected:</strong> Operation failed (reject).</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Async / Await</h3>
      <p class="text-gray-300 mb-3">
        Introduced in ES2017, <code>async/await</code> is syntactic sugar built on top of Promises. 
        It makes asynchronous code look and behave like synchronous code, making it much easier to read and debug.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><code>async</code>: Ensures the function returns a Promise.</li>
        <li><code>await</code>: Pauses the execution of the function until the Promise is resolved.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Error Handling</h3>
      <p class="text-gray-300 mb-3">
        With raw Promises, we use <code>.catch()</code>. With async/await, we use <code>try...catch</code> blocks, 
        which is the standard way to handle errors in synchronous code as well.
      </p>
    `;

const lesson1_5_syntax = [
      {
        title: 'Creating a Promise',
        content: `const myPromise = new Promise((resolve, reject) => {
  if (success) resolve("Success!");
  else reject("Error!");
});`
      },
      {
        title: 'Consuming a Promise',
        content: `myPromise
  .then(data => `
      },
      {
        title: 'Async / Await',
        content: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    
  }
}`
      }
    ];

const lesson1_5_liveCode = `

function simulateApiCall(id) {
  return new Promise((resolve, reject) => {
    
    setTimeout(() => {
      if (id > 0) {
        resolve({ id: id, name: "User " + id });
      } else {
        reject("Invalid ID");
      }
    }, 1000);
  });
}

async function getUserData() {
  try {
    
    const user1 = await simulateApiCall(1);
    
    
    const user2 = await simulateApiCall(2);
    
    
    
  } catch (error) {
    
  }
}

getUserData();



async function getParallel() {
  
  // Start both requests at the same time
  const p1 = simulateApiCall(3);
  const p2 = simulateApiCall(4);
  
  // Wait for both to finish
  const [u3, u4] = await Promise.all([p1, p2]);
  
}

// Note: getParallel will start after getUserData yields, 
// but since both are async, they overlap in the event loop.
setTimeout(getParallel, 2500);`;

const lesson1_5_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Sequential vs Parallel</h3>
      <p class="text-gray-300 mb-3">
        <strong>Example 1</strong> shows <strong>sequential</strong> execution. We wait for user 1 before starting to fetch user 2.
        This takes 1s + 1s = 2s total.
      </p>
      <p class="text-gray-300 mb-3">
        <strong>Example 2</strong> shows <strong>parallel</strong> execution using <code>Promise.all</code>. 
        We start both requests immediately and wait for both to complete. This takes roughly 1s total.
      </p>
    `;

const lesson1_6_content = `
      <h2 class="text-2xl font-bold text-white mb-4">1.6 ES6+ Advanced Features</h2>
      <p class="text-gray-300 mb-4">
        ES6 (ECMAScript 2015) and later versions introduced features that make JavaScript code more concise and readable. 
        <strong>Destructuring</strong>, <strong>Spread</strong>, and <strong>Rest</strong> are essential tools for modern development.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Destructuring</h3>
      <p class="text-gray-300 mb-3">
        Destructuring allows you to unpack values from arrays or properties from objects into distinct variables.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>// Object Destructuring
const user = { name: "Alex", age: 30 };
const { name, age } = user;

// Array Destructuring
const coords = [10, 20];
const [x, y] = coords;</code></pre>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Spread Operator (...)</h3>
      <p class="text-gray-300 mb-3">
        The spread operator expands an iterable (like an array or string) into more elements. It is great for cloning 
        arrays/objects or merging them.
      </p>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Rest Parameters (...)</h3>
      <p class="text-gray-300 mb-3">
        The rest syntax looks exactly like spread, but it's used in function parameters to collect multiple arguments into a single array.
      </p>
    `;

const lesson1_6_syntax = [
      {
        title: 'Object Destructuring',
        content: `const { prop1, prop2 } = object;
const { prop1: newName } = object; // Renaming`
      },
      {
        title: 'Spread Syntax',
        content: `const newArray = [...oldArray, 4, 5];
const newObject = { ...oldObject, newProp: 'value' };`
      },
      {
        title: 'Rest Parameters',
        content: `function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}`
      }
    ];

const lesson1_6_liveCode = `
const developer = {
  firstName: "Sarah",
  tech: "React",
  experience: 5
};

const { firstName, tech } = developer;



const teamA = ["Alice", "Bob"];
const teamB = ["Charlie", "Dave"];

const allTeam = [...teamA, ...teamB, "Eve"];


const originalObj = { a: 1, b: 2 };
const updatedObj = { ...originalObj, b: 99, c: 3 }; // Overwrites b, adds c



function multiply(multiplier, ...numbers) {
  return numbers.map(n => n * multiplier);
}

const result = multiply(2, 1, 2, 3, 4);
`;

const lesson1_6_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Code Analysis</h3>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>
          <strong>Destructuring:</strong> We extracted <code>firstName</code> and <code>tech</code> directly from the object.
        </li>
        <li>
          <strong>Spread:</strong> We combined two arrays into <code>allTeam</code> without using <code>concat()</code>. 
          We also created a shallow copy of an object and updated properties in one line.
        </li>
        <li>
          <strong>Rest:</strong> The <code>multiply</code> function takes one regular argument and gathers all remaining arguments into an array called <code>numbers</code>.
        </li>
      </ul>
    `;

const lesson1_7_content = `
      <h2 class="text-2xl font-bold text-white mb-4">1.7 JavaScript Modules (Import and Export)</h2>
      <p class="text-gray-300 mb-4">
        As applications grow, keeping all code in a single file becomes unmanageable. 
        <strong>ES6 Modules</strong> allow you to split your code into separate files and share functionality between them.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Exporting</h3>
      <p class="text-gray-300 mb-3">
        You can export functions, objects, or primitive values from a module so they can be used by other programs.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Named Export:</strong> Export multiple values. Import them by their exact names.</li>
        <li><strong>Default Export:</strong> Export a single main value. Import it with any name.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Importing</h3>
      <p class="text-gray-300 mb-3">
        Use the <code>import</code> keyword to bring in exported functionality.
      </p>
    `;

const lesson1_7_syntax = [
      {
        title: 'Named Export/Import',
        content: `// math.js
export const add = (a, b) => a + b;

// main.js
import { add } from './math.js';`
      },
      {
        title: 'Default Export/Import',
        content: `// User.js
export default class User { ... }

// main.js
import User from './User.js';`
      },
      {
        title: 'Import All',
        content: `import * as MathUtils from './math.js';
MathUtils.add(1, 2);`
      }
    ];

const lesson1_7_liveCode = `// In a real environment, these would be separate files.
// Here we simulate module behavior.

// === module.js ===
const libraryName = "MathLib v1.0";

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Simulating exports
const exports = { add, subtract, libraryName };

// === main.js ===


const sum = exports.add(10, 5);


const diff = exports.subtract(10, 5);


// Dynamic Import simulation (Promise-based)
// import('./module.js').then(module => ...)
`;

const lesson1_7_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Module Simulation</h3>
      <p class="text-gray-300 mb-3">
        Since this is a single-file playground, we cannot create actual files. However, the concept is shown:
      </p>
      <ul class="list-disc list-inside text-gray-300">
        <li>We defined functions and variables in a "module" scope.</li>
        <li>We bundled them into an <code>exports</code> object.</li>
        <li>We accessed them as if we had imported them.</li>
      </ul>
      <p class="text-gray-300 mt-2">
        In a real project (like with Vite or Webpack), the browser or bundler handles the actual file loading.
      </p>
    `;

const lesson1_8_content = `
      <h2 class="text-2xl font-bold text-white mb-4">1.8 Error Handling and Debugging</h2>
      <p class="text-gray-300 mb-4">
        Errors are inevitable. Professional developers don't just fix errors; they <strong>handle</strong> them gracefully so the application doesn't crash.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">The try...catch Statement</h3>
      <p class="text-gray-300 mb-3">
        The <code>try...catch</code> block allows you to test a block of code for errors and handle them if they occur.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">The Error Object</h3>
      <p class="text-gray-300 mb-3">
        When an error occurs, JavaScript generates an object containing details about it.
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><code>name</code>: The type of error (e.g., ReferenceError).</li>
        <li><code>message</code>: The error description.</li>
        <li><code>stack</code>: The stack trace (where the error happened).</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Custom Errors</h3>
      <p class="text-gray-300 mb-3">
        You can throw your own errors using the <code>throw</code> keyword to enforce rules in your application.
      </p>
    `;

const lesson1_8_syntax = [
      {
        title: 'Basic try...catch',
        content: `try {
  // Code that might fail
  const data = JSON.parse(badJson);
} catch (error) {
  
} finally {
  
}`
      },
      {
        title: 'Throwing Errors',
        content: `if (!user) {
  throw new Error("User not found");
}`
      }
    ];

const lesson1_8_liveCode = `

function safeDivide(a, b) {
  try {
    if (b === 0) {
      throw new Error("Division by zero is not allowed.");
    }
    return a / b;
  } catch (err) {
    
    return null; // Return a safe fallback value
  } finally {
    
  }
}






function parseUserData(jsonString) {
  try {
    const user = JSON.parse(jsonString);
    
  } catch (e) {
    
  }
}

parseUserData('{ "name": "Alice" }'); // Valid
parseUserData('Invalid JSON'); // Invalid`;

const lesson1_8_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Key Takeaways</h3>
      <ul class="list-disc list-inside text-gray-300">
        <li>
          <strong>Graceful Failure:</strong> Instead of crashing the script, <code>safeDivide</code> returns <code>null</code> when an error occurs.
        </li>
        <li>
          <strong>Custom Errors:</strong> We manually threw an error when <code>b === 0</code> because JavaScript normally returns <code>Infinity</code> for division by zero, which might not be what we want.
        </li>
        <li>
          <strong>Finally:</strong> The <code>finally</code> block runs whether an error occurred or not, useful for cleanup (e.g., closing connections).
        </li>
      </ul>
    `;

const lesson1_9_content = `
      <h2 class="text-2xl font-bold text-white mb-4">1.9 Memory Management and Performance Basics</h2>
      <p class="text-gray-300 mb-4">
        JavaScript automatically manages memory, but understanding how it works helps you avoid <strong>memory leaks</strong> 
        that slow down your app over time.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Garbage Collection (GC)</h3>
      <p class="text-gray-300 mb-3">
        The JavaScript engine (like V8 in Chrome) periodically checks for objects that are no longer reachable from the 
        <strong>Root</strong> (global object). If an object cannot be reached, it is deleted to free up memory.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Common Memory Leaks</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>Global Variables:</strong> Accidentally creating globals that stay in memory forever.</li>
        <li><strong>Forgotten Timers:</strong> <code>setInterval</code> that runs forever even after the component is removed.</li>
        <li><strong>DOM References:</strong> Keeping references to removed DOM elements in JavaScript variables.</li>
        <li><strong>Closures:</strong> Holding onto large scopes unnecessarily.</li>
      </ul>
    `;

const lesson1_9_syntax = [
      {
        title: 'Clearing Timers',
        content: `const timerId = setInterval(doWork, 1000);

// When done:
clearInterval(timerId);`
      },
      {
        title: 'Removing Event Listeners',
        content: `element.removeEventListener('click', handler);`
      }
    ];

const lesson1_9_liveCode = `

let registry = [];

function createLargeObject(id) {
  return {
    id: id,
    data: new Array(1000).fill("Some data")
  };
}

function addToRegistry() {
  const obj = createLargeObject(registry.length);
  registry.push(obj);
  
}

function clearRegistry() {
  registry = []; // Remove references
  
}

addToRegistry();
addToRegistry();
addToRegistry();

// At this point, 3 large objects are in memory.

clearRegistry();

// Now they are unreachable and will be collected.`;

const lesson1_9_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">How GC Works Here</h3>
      <p class="text-gray-300 mb-3">
        1. <code>registry</code> is a global array (reachable from Root).
      </p>
      <p class="text-gray-300 mb-3">
        2. When we push objects into it, they are reachable, so they stay in memory.
      </p>
      <p class="text-gray-300 mb-3">
        3. When we set <code>registry = []</code>, the array loses references to those objects.
      </p>
      <p class="text-gray-300">
        4. The next time the Garbage Collector runs, it sees those objects have no references and deletes them.
      </p>
    `;

const lesson2_1_content = `
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
    `;

const lesson2_1_syntax = [
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
    ];

const lesson2_1_liveCode = `git init
git status
git add index.html
git commit -m "Added index.html"
git log`;

const lesson2_1_liveCodeExplanation = `
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
    `;

const lesson2_2_content = `
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
    `;

const lesson2_2_syntax = [
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
    ];

const lesson2_2_liveCode = `git init
git status
git add index.html
git commit -m "Initial project setup with index file"
git log`;

const lesson2_2_liveCodeExplanation = `
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
    `;

const lesson2_3_content = `
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
    `;

const lesson2_3_syntax = [
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
    ];

const lesson2_3_liveCode = `git branch
git branch feature-login
git checkout feature-login
git checkout -b feature-dashboard
git branch --show-current
git checkout main`;

const lesson2_3_liveCodeExplanation = `
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
    `;

const lesson2_4_content = `
      <h2 class="text-2xl font-bold text-white mb-4">2.4 Merging and Resolving Merge Conflicts</h2>
      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is Merging?</h3>
      <p class="text-gray-300 mb-3">
        Merging is the process of combining changes from one branch into another. The most common case is merging a
        completed feature branch back into the <strong>main</strong> branch.
      </p>
      
      <h3 class="text-xl font-semibold text-white mt-4 mb-2">Types of Merges</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
        <li>
          <strong>Fast-forward merge:</strong><br />
          Happens when the main branch has not changed since you created your feature branch. Git simply moves the pointer forward.
        </li>
        <li>
          <strong>Recursive (Three-way) merge:</strong><br />
          Happens when the main branch has new commits that are not in your feature branch. Git creates a new "merge commit" to join the histories.
        </li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-4 mb-2">What is a Merge Conflict?</h3>
      <p class="text-gray-300 mb-3">
        A merge conflict occurs when Git cannot automatically resolve differences in code between two commits. This usually happens when:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Two people changed the same lines in a file.</li>
        <li>One person deleted a file while another person modified it.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Git will stop the merge and ask you to resolve the conflict manually.
      </p>
    `;

const lesson2_4_syntax = [
      {
        title: 'Switch to Target Branch',
        content: 'git checkout main'
      },
      {
        title: 'Merge Branch',
        content: 'git merge feature-branch'
      },
      {
        title: 'Abort Merge',
        content: 'git merge --abort'
      }
    ];

const lesson2_4_liveCode = `// 1. Switch to the branch you want to merge INTO
git checkout main

// 2. Merge the feature branch
git merge feature-login

// If successful: "Fast-forward" or "Merge made by the 'recursive' strategy."

// If conflict:
// "CONFLICT (content): Merge conflict in index.html"
// "Automatic merge failed; fix conflicts and then commit the result."`;

const lesson2_4_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Resolving Conflicts</h3>
      <p class="text-gray-300 mb-3">
        When a conflict occurs, Git marks the file with special markers:
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code><<<<<<< HEAD
var x = 10;
=======
var x = 20;
>>>>>>> feature-login</code></pre>
      </div>
      <p class="text-gray-300 mb-2">To fix it:</p>
      <ol class="list-decimal list-inside text-gray-300 space-y-1 mb-4">
        <li>Open the file.</li>
        <li>Decide which code is correct (or combine them).</li>
        <li>Delete the markers (<<<<<<<, =======, >>>>>>>).</li>
        <li>Save the file.</li>
        <li>Run <code>git add filename</code>.</li>
        <li>Run <code>git commit</code> to finish the merge.</li>
      </ol>
    `;

const lesson2_5_content = `
      <h2 class="text-2xl font-bold text-white mb-4">2.5 Working with Remote Repositories (GitHub)</h2>
      <p class="text-gray-300 mb-4">
        While Git manages version control locally, <strong>Remote Repositories</strong> (like GitHub, GitLab, Bitbucket)
        host your code in the cloud. This enables backup, sharing, and team collaboration.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Key Concepts</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
        <li><strong>Remote:</strong> A common repository on a server (e.g., origin).</li>
        <li><strong>Push:</strong> Uploading your local commits to the remote repository.</li>
        <li><strong>Pull:</strong> Downloading changes from the remote repository to your local machine.</li>
        <li><strong>Clone:</strong> Downloading a repository from a remote server for the first time.</li>
      </ul>
    `;

const lesson2_5_syntax = [
      {
        title: 'Clone Repository',
        content: 'git clone https://github.com/user/repo.git'
      },
      {
        title: 'Add Remote',
        content: 'git remote add origin https://github.com/user/repo.git'
      },
      {
        title: 'Push Changes',
        content: 'git push -u origin main'
      },
      {
        title: 'Pull Changes',
        content: 'git pull origin main'
      }
    ];

const lesson2_5_liveCode = `git remote add origin https://github.com/username/project.git
git branch -M main
git push -u origin main`;

const lesson2_5_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">Connecting to GitHub</h3>
      <p class="text-gray-300 mb-3">
        1. <strong>Create a repo</strong> on GitHub.
      </p>
      <p class="text-gray-300 mb-3">
        2. <strong>Link local repo:</strong> <code>git remote add origin URL</code> tells Git where to push code.
      </p>
      <p class="text-gray-300 mb-3">
        3. <strong>Rename branch:</strong> <code>git branch -M main</code> ensures the main branch is named "main".
      </p>
      <p class="text-gray-300">
        4. <strong>Push:</strong> <code>git push -u origin main</code> uploads your code. The <code>-u</code> flag links your local branch to the remote one, so you can just type <code>git push</code> next time.
      </p>
    `;

const lesson2_6_content = `
      <h2 class="text-2xl font-bold text-white mb-4">2.6 Collaboration Workflow (Pull Requests)</h2>
      <p class="text-gray-300 mb-4">
        In a professional team, you never push directly to the main branch. Instead, you use <strong>Pull Requests (PRs)</strong>.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">The PR Workflow</h3>
      <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
        <li><strong>Fork/Clone</strong> the repository.</li>
        <li>Create a <strong>feature branch</strong> (<code>git checkout -b feature-new</code>).</li>
        <li>Make changes and <strong>commit</strong>.</li>
        <li><strong>Push</strong> the branch to GitHub (<code>git push origin feature-new</code>).</li>
        <li>Open a <strong>Pull Request</strong> on GitHub.</li>
        <li>Team members <strong>review</strong> the code.</li>
        <li>Once approved, the PR is <strong>merged</strong> into main.</li>
      </ol>
    `;

const lesson2_6_syntax = [
      {
        title: 'Push Feature Branch',
        content: 'git push origin feature-branch-name'
      }
    ];

const lesson2_6_liveCode = `git checkout -b feature-dark-mode
// ... write code ...
git add .
git commit -m "Added dark mode support"
git push origin feature-dark-mode`;

const lesson2_6_liveCodeExplanation = `
      <h3 class="text-lg font-semibold text-white mb-2">After Pushing</h3>
      <p class="text-gray-300">
        After running these commands, go to the GitHub repository page. You will see a "Compare & pull request" button.
        Click it to start the code review process.
      </p>
    `;

const lesson2_7_content = `
      <h2 class="text-2xl font-bold text-white mb-4">2.7 Git Best Practices and Conventions</h2>
      <p class="text-gray-300 mb-4">
        Following best practices ensures a clean history and happy team members.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Do's and Don'ts</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
        <li><strong>Do:</strong> Commit often (small, logical chunks).</li>
        <li><strong>Do:</strong> Write clear, imperative commit messages ("Add feature" not "Added feature").</li>
        <li><strong>Do:</strong> Pull the latest changes before starting work.</li>
        <li><strong>Don't:</strong> Commit secrets (API keys, passwords).</li>
        <li><strong>Don't:</strong> Commit large binary files (use Git LFS).</li>
        <li><strong>Don't:</strong> Rewrite history (force push) on shared branches.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Conventional Commits</h3>
      <p class="text-gray-300 mb-2">Many teams use a standard format:</p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-3 mb-4 text-gray-200">
        <pre class="text-sm overflow-x-auto"><code>type(scope): description

feat(auth): add google login
fix(navbar): correct alignment issue
docs(readme): update installation steps</code></pre>
      </div>
    `;

const lesson2_7_syntax = [
      {
        title: 'Conventional Commit',
        content: 'git commit -m "feat(api): add new endpoint"'
      }
    ];

const lesson2_7_liveCode = `// Bad
git commit -m "fix"

// Good
git commit -m "fix(header): resolve z-index issue on mobile"`;

const lesson2_7_liveCodeExplanation = `
      <p class="text-gray-300">
        Using structured commit messages allows tools to automatically generate changelogs and version numbers.
      </p>
    `;

const lesson2_8_content = `
      <h2 class="text-2xl font-bold text-white mb-4">2.8 Managing Releases and Versioning</h2>
      <p class="text-gray-300 mb-4">
        <strong>Tags</strong> are used to mark specific points in history as important, usually for releases (v1.0, v2.0).
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Semantic Versioning (SemVer)</h3>
      <p class="text-gray-300 mb-3">
        Format: <strong>MAJOR.MINOR.PATCH</strong> (e.g., 1.2.3)
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li><strong>MAJOR:</strong> Breaking changes.</li>
        <li><strong>MINOR:</strong> New features (backward compatible).</li>
        <li><strong>PATCH:</strong> Bug fixes.</li>
      </ul>
    `;

const lesson2_8_syntax = [
      {
        title: 'Create Tag',
        content: 'git tag v1.0.0'
      },
      {
        title: 'Push Tags',
        content: 'git push origin --tags'
      }
    ];

const lesson2_8_liveCode = `git tag v1.0.0
git push origin v1.0.0`;

const lesson2_8_liveCodeExplanation = `
      <p class="text-gray-300">
        Tags are immutable (unchangeable) pointers. Once you tag a release, it stays there forever, making it easy to roll back to a specific stable version.
      </p>
    `;

const lesson2_9_content = `
      <h2 class="text-2xl font-bold text-white mb-4">2.9 Advanced Git Commands and Tips</h2>
      <p class="text-gray-300 mb-4">
        These commands save you when things go wrong.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Lifesaver Commands</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
        <li><strong>git stash:</strong> Temporarily save changes without committing (useful when switching branches).</li>
        <li><strong>git reset:</strong> Undo commits.</li>
        <li><strong>git revert:</strong> Create a new commit that undoes a previous commit (safe for shared branches).</li>
        <li><strong>git reflog:</strong> A log of all reference updates (helps recover "lost" commits).</li>
      </ul>
    `;

const lesson2_9_syntax = [
      {
        title: 'Stash Changes',
        content: 'git stash'
      },
      {
        title: 'Apply Stash',
        content: 'git stash pop'
      },
      {
        title: 'Soft Reset (keep changes)',
        content: 'git reset --soft HEAD~1'
      },
      {
        title: 'Hard Reset (delete changes)',
        content: 'git reset --hard HEAD~1'
      }
    ];

const lesson2_9_liveCode = `// 1. You are working but need to switch branches quickly
git stash

// 2. Switch branch, do work, switch back
git checkout feature-other
// ...
git checkout main

// 3. Bring back your work
git stash pop`;

const lesson2_9_liveCodeExplanation = `
      <p class="text-gray-300">
        <strong>Stashing</strong> is incredibly useful in daily work when you're interrupted or need to check something on another branch without committing incomplete code.
      </p>
    `;

const lesson3_1_content = `
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
    `;

const lesson3_1_syntax = [
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
    ];

const lesson3_1_liveCode = `<!DOCTYPE html>
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
</html>`;

const lesson3_1_liveCodeExplanation = '';

const lesson3_2_content = `
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
    `;

const lesson3_2_syntax = [
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
    ];

const lesson3_2_liveCode = `<!DOCTYPE html>
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
</html>`;

const lesson3_2_liveCodeExplanation = '';

const lesson3_3_content = `
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
    `;

const lesson3_3_syntax = [
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
    ];

const lesson3_3_liveCode = `<!DOCTYPE html> 
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
</html>`;

const lesson3_3_liveCodeExplanation = '';

const lesson3_4_content = `
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
    `;

const lesson3_4_syntax = [
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
    ];

const lesson3_4_liveCode = `<!DOCTYPE html> 
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
</html>`;

const lesson3_4_liveCodeExplanation = '';

const lesson3_5_content = `
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
    `;

const lesson3_5_syntax = [
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
    ];

const lesson3_5_liveCode = `<!DOCTYPE html> 
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
</html>`;

const lesson3_5_liveCodeExplanation = '';

const lesson3_6_content = `
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
    `;

const lesson3_6_syntax = [
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
    ];

const lesson3_6_liveCode = `<!DOCTYPE html> 
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
      </html>`;

const lesson3_6_liveCodeExplanation = `
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
    `;

const lesson3_7_content = `
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
    `;

const lesson3_7_syntax = [
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
    ];

const lesson3_7_liveCode = `<!DOCTYPE html> 
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
      </html>`;

const lesson3_7_liveCodeExplanation = `
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
    `;

const lesson3_8_content = `
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
    `;

const lesson3_8_syntax = [
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
    ];

const lesson3_8_liveCode = `<!DOCTYPE html> 
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
      </html>`;

const lesson3_8_liveCodeExplanation = `
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
    `;


// Module 4 Variables

// Lesson 4.1
const lesson4_1_content = `
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
    The <strong>Virtual DOM</strong> is an in-memory representation of the real DOM. When your component's
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
    <li>Understand how React's component tree maps to the DOM.</li>
    <li>Explain what the Virtual DOM is and why it exists.</li>
    <li>Describe the high-level rendering flow in a React app.</li>
  </ul>
`;

const lesson4_1_syntax = [
  {
    title: 'Root Rendering',
    content:
      'import ReactDOM from "react-dom/client";\n\nconst root = ReactDOM.createRoot(document.getElementById("root"));\nroot.render(<App />);'
  },
  {
    title: 'Simple Component Tree',
    content:
      'function App() {\n  return (\n    <div>\n      <Header />\n      <Dashboard />\n      <Footer />\n    </div>\n  );\n}'
  },
  {
    title: 'UI as Function of State',
    content:
      'function Counter() {\n  const [count, setCount] = useState(0);\n  return <p>Count: {count}</p>;\n}'
  }
];

const lesson4_1_liveCode = `

function renderComponentTree() {
  const app = {
    type: "App",
    children: ["Header", "Dashboard", "Footer"]
  };

  
  
  
  
}

renderComponentTree();`;

const lesson4_1_liveCodeExplanation = `
  <p class="mb-3 text-gray-300">
    This example connects the conceptual idea of React's component tree and Virtual DOM to the actual code you
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
`;

// Lesson 4.2
const lesson4_2_content = `
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
`;

const lesson4_2_syntax = [
  {
    title: 'Create Vite React App',
    content: 'npm create vite@latest my-react-app -- --template react'
  },
  {
    title: 'Install and Run',
    content: 'cd my-react-app\nnpm install\nnpm run dev'
  },
  {
    title: 'main.jsx Entry Point',
    content:
      'import ReactDOM from "react-dom/client";\nimport App from "./App";\n\nReactDOM.createRoot(document.getElementById("root")).render(<App />);'
  }
];

const lesson4_2_liveCode = `

const commands = [
  "npm create vite@latest my-react-app -- --template react",
  "cd my-react-app",
  "npm install",
  "npm run dev"
];

commands.forEach((cmd, index) => {
  
});`;

const lesson4_2_liveCodeExplanation = `
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
`;

// Lesson 4.3
const lesson4_3_content = `
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
`;

const lesson4_3_syntax = [
  {
    title: 'Basic JSX',
    content: 'function App() {\n  return <h1>Hello React</h1>;\n}'
  },
  {
    title: 'JSX with Variable',
    content: 'const name = "React";\n\n<h1>Hello {name}</h1>;'
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
      'users.map((user, index) => (\n  <li key={index}>{user}</li>\n));'
  }
];

const lesson4_3_liveCode = `

let isLoggedIn = false;
const users = ["John", "Alice", "Bob"];

function render() {
  const message = isLoggedIn ? "Welcome User" : "Please Login";
  
  
}


render();

isLoggedIn = true;

render();`;

const lesson4_3_liveCodeExplanation = `
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
`;

// Lesson 4.4
const lesson4_4_content = `
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
`;

const lesson4_4_syntax = [
  {
    title: 'Basic Functional Component',
    content: 'function App() {\n  return <h1>Hello World</h1>;\n}\n\nexport default App;'
  },
  {
    title: 'Multiple Components',
    content:
      'function Header() {\n  return <h1>Header</h1>;\n}\n\nfunction Footer() {\n  return <h1>Footer</h1>;\n}'
  },
  {
    title: 'Using Components inside Component',
    content:
      'function App() {\n  return (\n    <div>\n      <Header />\n      <Footer />\n    </div>\n  );\n}'
  },
  {
    title: 'Arrow Function Component',
    content: 'const Header = () => {\n  return <h1>Header</h1>;\n};'
  },
  {
    title: 'Reusable Component',
    content: 'function User() {\n  return <h2>User Component</h2>;\n}'
  }
];

const lesson4_4_liveCode = `

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


`;

const lesson4_4_liveCodeExplanation = `
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
`;

// Lesson 4.5
const lesson4_5_content = `
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
`;

const lesson4_5_syntax = [
  {
    title: 'Passing Props',
    content: '<User name="Jashwanth" />'
  },
  {
    title: 'Receiving Props',
    content: 'function User(props) {\n  return <h1>{props.name}</h1>;\n}'
  },
  {
    title: 'Destructuring Props',
    content: 'function User({ name }) {\n  return <h1>{name}</h1>;\n}'
  },
  {
    title: 'Multiple Props',
    content: '<User name="Jashwanth" age={22} role="Developer" />'
  },
  {
    title: 'Using Props in JSX',
    content: '<h1>{props.name}</h1>\n<p>{props.role}</p>'
  }
];

const lesson4_5_liveCode = `

function UserCard(props) {
  
  
  
}

function App() {
  UserCard({ name: "Jashwanth", role: "Frontend Developer", experience: 2 });
  UserCard({ name: "Rahul", role: "Backend Developer", experience: 3 });
  UserCard({ name: "Anita", role: "Full Stack Developer", experience: 4 });
}

App();`;

const lesson4_5_liveCodeExplanation = `
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
`;

export const frontendIntermediateModules: CourseModule[] = intermediateStructure.map((m) => {
  const lessons: Lesson[] = m.topics.map((topic, index) => {
    let lessonData: Partial<Lesson> = {
      id: topic.split(' ')[0].replace('.', '-'),
      title: topic,
      duration: '10 min',
      content: buildLessonContent(m.title, topic),
      language: 'html',
      liveCode: defaultLiveCode,
      syntax: [],
      liveCodeExplanation: ''
    };

    // Module 1
    if (m.id === 'module-1') {
      if (index === 0) {
        lessonData = {
          ...lessonData,
          content: lesson1_1_content,
          syntax: lesson1_1_syntax,
          liveCode: lesson1_1_liveCode,
          liveCodeExplanation: lesson1_1_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
      if (index === 1) {
        lessonData = {
          ...lessonData,
          content: lesson1_2_content,
          syntax: lesson1_2_syntax,
          liveCode: lesson1_2_liveCode,
          liveCodeExplanation: lesson1_2_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
      if (index === 2) {
        lessonData = {
          ...lessonData,
          content: lesson1_3_content,
          syntax: lesson1_3_syntax,
          liveCode: lesson1_3_liveCode,
          liveCodeExplanation: lesson1_3_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
      if (index === 3) {
        lessonData = {
          ...lessonData,
          content: lesson1_4_content,
          syntax: lesson1_4_syntax,
          liveCode: lesson1_4_liveCode,
          liveCodeExplanation: lesson1_4_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
      if (index === 4) {
        lessonData = {
          ...lessonData,
          content: lesson1_5_content,
          syntax: lesson1_5_syntax,
          liveCode: lesson1_5_liveCode,
          liveCodeExplanation: lesson1_5_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
      if (index === 5) {
        lessonData = {
          ...lessonData,
          content: lesson1_6_content,
          syntax: lesson1_6_syntax,
          liveCode: lesson1_6_liveCode,
          liveCodeExplanation: lesson1_6_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
      if (index === 6) {
        lessonData = {
          ...lessonData,
          content: lesson1_7_content,
          syntax: lesson1_7_syntax,
          liveCode: lesson1_7_liveCode,
          liveCodeExplanation: lesson1_7_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
      if (index === 7) {
        lessonData = {
          ...lessonData,
          content: lesson1_8_content,
          syntax: lesson1_8_syntax,
          liveCode: lesson1_8_liveCode,
          liveCodeExplanation: lesson1_8_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
      if (index === 8) {
        lessonData = {
          ...lessonData,
          content: lesson1_9_content,
          syntax: lesson1_9_syntax,
          liveCode: lesson1_9_liveCode,
          liveCodeExplanation: lesson1_9_liveCodeExplanation,
          liveCodeIsJsSnippet: true
        };
      }
    }

    // Module 2
    if (m.id === 'module-2') {
      if (index === 0) {
        lessonData = {
          ...lessonData,
          content: lesson2_1_content,
          syntax: lesson2_1_syntax,
          liveCode: lesson2_1_liveCode,
          liveCodeExplanation: lesson2_1_liveCodeExplanation,
          language: 'bash'
        };
      }
      if (index === 1) {
        lessonData = {
          ...lessonData,
          content: lesson2_2_content,
          syntax: lesson2_2_syntax,
          liveCode: lesson2_2_liveCode,
          liveCodeExplanation: lesson2_2_liveCodeExplanation,
          language: 'bash'
        };
      }
      if (index === 2) {
        lessonData = {
          ...lessonData,
          content: lesson2_3_content,
          syntax: lesson2_3_syntax,
          liveCode: lesson2_3_liveCode,
          liveCodeExplanation: lesson2_3_liveCodeExplanation,
          language: 'bash'
        };
      }
      if (index === 3) {
        lessonData = {
          ...lessonData,
          content: lesson2_4_content,
          syntax: lesson2_4_syntax,
          liveCode: lesson2_4_liveCode,
          liveCodeExplanation: lesson2_4_liveCodeExplanation,
          language: 'bash'
        };
      }
      if (index === 4) {
        lessonData = {
          ...lessonData,
          content: lesson2_5_content,
          syntax: lesson2_5_syntax,
          liveCode: lesson2_5_liveCode,
          liveCodeExplanation: lesson2_5_liveCodeExplanation,
          language: 'bash'
        };
      }
      if (index === 5) {
        lessonData = {
          ...lessonData,
          content: lesson2_6_content,
          syntax: lesson2_6_syntax,
          liveCode: lesson2_6_liveCode,
          liveCodeExplanation: lesson2_6_liveCodeExplanation,
          language: 'bash'
        };
      }
      if (index === 6) {
        lessonData = {
          ...lessonData,
          content: lesson2_7_content,
          syntax: lesson2_7_syntax,
          liveCode: lesson2_7_liveCode,
          liveCodeExplanation: lesson2_7_liveCodeExplanation,
          language: 'bash' // Git commit messages are conceptually bash/cli
        };
      }
      if (index === 7) {
        lessonData = {
          ...lessonData,
          content: lesson2_8_content,
          syntax: lesson2_8_syntax,
          liveCode: lesson2_8_liveCode,
          liveCodeExplanation: lesson2_8_liveCodeExplanation,
          language: 'bash'
        };
      }
      if (index === 8) {
        lessonData = {
          ...lessonData,
          content: lesson2_9_content,
          syntax: lesson2_9_syntax,
          liveCode: lesson2_9_liveCode,
          liveCodeExplanation: lesson2_9_liveCodeExplanation,
          language: 'bash'
        };
      }
    }

    // Module 3
    if (m.id === 'module-3') {
      if (index === 0) { lessonData = { ...lessonData, content: lesson3_1_content, syntax: lesson3_1_syntax, liveCode: lesson3_1_liveCode, liveCodeExplanation: lesson3_1_liveCodeExplanation }; }
      if (index === 1) { lessonData = { ...lessonData, content: lesson3_2_content, syntax: lesson3_2_syntax, liveCode: lesson3_2_liveCode, liveCodeExplanation: lesson3_2_liveCodeExplanation }; }
      if (index === 2) { lessonData = { ...lessonData, content: lesson3_3_content, syntax: lesson3_3_syntax, liveCode: lesson3_3_liveCode, liveCodeExplanation: lesson3_3_liveCodeExplanation }; }
      if (index === 3) { lessonData = { ...lessonData, content: lesson3_4_content, syntax: lesson3_4_syntax, liveCode: lesson3_4_liveCode, liveCodeExplanation: lesson3_4_liveCodeExplanation }; }
      if (index === 4) { lessonData = { ...lessonData, content: lesson3_5_content, syntax: lesson3_5_syntax, liveCode: lesson3_5_liveCode, liveCodeExplanation: lesson3_5_liveCodeExplanation }; }
      if (index === 5) { lessonData = { ...lessonData, content: lesson3_6_content, syntax: lesson3_6_syntax, liveCode: lesson3_6_liveCode, liveCodeExplanation: lesson3_6_liveCodeExplanation }; }
      if (index === 6) { lessonData = { ...lessonData, content: lesson3_7_content, syntax: lesson3_7_syntax, liveCode: lesson3_7_liveCode, liveCodeExplanation: lesson3_7_liveCodeExplanation }; }
      if (index === 7) { lessonData = { ...lessonData, content: lesson3_8_content, syntax: lesson3_8_syntax, liveCode: lesson3_8_liveCode, liveCodeExplanation: lesson3_8_liveCodeExplanation }; }
    }

    // Module 4
    if (m.id === 'module-4') {
      if (index === 0) { lessonData = { ...lessonData, content: lesson4_1_content, syntax: lesson4_1_syntax, liveCode: lesson4_1_liveCode, liveCodeExplanation: lesson4_1_liveCodeExplanation }; }
      if (index === 1) { lessonData = { ...lessonData, content: lesson4_2_content, syntax: lesson4_2_syntax, liveCode: lesson4_2_liveCode, liveCodeExplanation: lesson4_2_liveCodeExplanation }; }
      if (index === 2) { lessonData = { ...lessonData, content: lesson4_3_content, syntax: lesson4_3_syntax, liveCode: lesson4_3_liveCode, liveCodeExplanation: lesson4_3_liveCodeExplanation }; }
      if (index === 3) { lessonData = { ...lessonData, content: lesson4_4_content, syntax: lesson4_4_syntax, liveCode: lesson4_4_liveCode, liveCodeExplanation: lesson4_4_liveCodeExplanation }; }
      if (index === 4) { lessonData = { ...lessonData, content: lesson4_5_content, syntax: lesson4_5_syntax, liveCode: lesson4_5_liveCode, liveCodeExplanation: lesson4_5_liveCodeExplanation }; }
    }

    // Module 5
    if (m.id === 'module-5') {
      if (index === 3) lessonData = { ...lessonData, ...module5Lesson4, id: '5-4' };
      if (index === 4) lessonData = { ...lessonData, ...module5Lesson5, id: '5-5' };
      if (index === 5) lessonData = { ...lessonData, ...module5Lesson6, id: '5-6' };
      if (index === 6) lessonData = { ...lessonData, ...module5Lesson7, id: '5-7' };
      if (index === 7) lessonData = { ...lessonData, ...module5Lesson8, id: '5-8' };
      if (index === 8) lessonData = { ...lessonData, ...module5Lesson9, id: '5-9' };
    }

    // Module 6
    if (m.id === 'module-6') {
      if (index === 0) lessonData = { ...lessonData, ...module6Lesson1, id: '6-1' };
      if (index === 1) lessonData = { ...lessonData, ...module6Lesson2, id: '6-2' };
      if (index === 2) lessonData = { ...lessonData, ...module6Lesson3, id: '6-3' };
      if (index === 3) lessonData = { ...lessonData, ...module6Lesson4, id: '6-4' };
      if (index === 4) lessonData = { ...lessonData, ...module6Lesson5, id: '6-5' };
      if (index === 5) lessonData = { ...lessonData, ...module6Lesson6, id: '6-6' };
    }

    return lessonData as Lesson;
  });

  return {
      id: m.id,
      title: m.title,
      duration: m.duration,
      topics: m.topics,
      lessons: lessons,
      description: m.description
    };
});


