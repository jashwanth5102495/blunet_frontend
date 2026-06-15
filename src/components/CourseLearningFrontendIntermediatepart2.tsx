
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

export const module5Lesson4 = {
  title: '5.4 Context API for Global State Management',
  duration: '45 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">5.4 Context API for Global State Management</h2>
      <p class="text-gray-300 mb-4">
        In large applications built with React, multiple components often need access to the same data.
      </p>
      <p class="text-gray-300 mb-4">
        For example:
        <ul class="list-disc list-inside ml-4">
          <li>Logged-in user information</li>
          <li>Application theme (dark/light mode)</li>
          <li>Language settings</li>
          <li>Shopping cart data</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Passing this data manually from one component to another through props can become complicated when many nested components are involved. This problem is known as <strong>Prop Drilling</strong>.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Example: Prop Drilling</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm">App
 └── Dashboard
      └── Sidebar
           └── Profile
                └── Avatar</pre>
      </div>
      <p class="text-gray-300 mb-4">
        If App contains the user data, it must pass that data through every intermediate component even if they do not use it.
      </p>
      <p class="text-gray-300 mb-4">
        To solve this problem, React provides the <strong>Context API</strong>.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is Context API?</h3>
      <p class="text-gray-300 mb-4">
        The Context API allows developers to share data globally across components without passing props manually at every level.
        It provides a way to create a global data store that any component in the application can access.
      </p>
      <p class="text-gray-300 mb-4">
        <strong>Conceptually:</strong><br/>
        Context Provider → provides data<br/>
        Context Consumer → receives data
      </p>
      <p class="text-gray-300 mb-4">
        The provider wraps components that need access to the data.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Key Components of Context API</h3>
      <p class="text-gray-300 mb-4">The Context API consists of three main parts.</p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">1. createContext()</h4>
      <p class="text-gray-300 mb-2">This function creates a new context object.</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>const MyContext = createContext();</code></pre>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">2. Provider</h4>
      <p class="text-gray-300 mb-2">The Provider component makes the data available to all child components.</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>&lt;MyContext.Provider value={data}&gt;
   &lt;Component /&gt;
&lt;/MyContext.Provider&gt;</code></pre>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">3. Consumer / useContext Hook</h4>
      <p class="text-gray-300 mb-2">Components can access the data using the useContext hook.</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>const data = useContext(MyContext);</code></pre>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Example Scenario</h3>
      <p class="text-gray-300 mb-4">
        Imagine a user authentication system. User information should be available across multiple components like Navbar, ProfilePage, Dashboard, Settings.
        Instead of passing user data through props repeatedly, the Context API allows all these components to access the user information directly.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Advantages of Context API</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Eliminates prop drilling</li>
        <li>Simplifies state sharing between components</li>
        <li>Improves code readability</li>
        <li>Makes application architecture cleaner</li>
        <li>Supports scalable application design</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Large applications like Facebook and Instagram rely on similar global state mechanisms.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Best Practices</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Use Context API for global data only.</li>
        <li>Avoid storing too much data inside a single context.</li>
        <li>Use multiple contexts for different data domains.</li>
        <li>Combine Context API with hooks for better architecture.</li>
      </ul>
      <p class="text-gray-300 mb-4">Example professional structure:</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300"><code>src
 ├── context
 │     └── UserContext.js
 ├── components
 ├── pages
 └── App.js</code></pre>
    `,
  syntax: [
    {
      title: 'Creating a Context',
      content: `import { createContext } from "react";

const MyContext = createContext();

export default MyContext;`
    },
    {
      title: 'Creating a Provider',
      content: `<MyContext.Provider value={data}>
   <ChildComponent />
</MyContext.Provider>`
    },
    {
      title: 'Accessing Context using useContext',
      content: `import { useContext } from "react";
import MyContext from "./MyContext";

const data = useContext(MyContext);`
    },
    {
      title: 'Complete Context Example Syntax',
      content: `import { createContext, useContext } from "react";

const ThemeContext = createContext();

function App() {

  return (
    <ThemeContext.Provider value="dark">
      <Component />
    </ThemeContext.Provider>
  );
}

function Component() {

  const theme = useContext(ThemeContext);

  return <div>{theme}</div>;
}`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Context API Example</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 20px; }
    .card { background: #222; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-top: 20px; }
    .highlight { color: #00bceb; font-weight: bold; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { createContext, useContext, useState } = React;

    // Step 1: Create Context
    const UserContext = createContext();

    // Step 2: Provide Data in App Component
    function App() {
      const user = {
        name: "Jashwanth",
        role: "Developer"
      };

      return (
        <UserContext.Provider value={user}>
          <div className="card">
            <h2>App Component</h2>
            <p>Providing user data to children...</p>
            <Profile />
          </div>
        </UserContext.Provider>
      );
    }

    // Step 3: Access Context in Child Component
    function Profile() {
      // Consuming the context
      const user = useContext(UserContext);

      return (
        <div className="card" style={{borderColor: '#00bceb'}}>
          <h3>Profile Component</h3>
          <p>Accessing data directly from Context:</p>
          <p>Name: <span className="highlight">{user.name}</span></p>
          <p>Role: <span className="highlight">{user.role}</span></p>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">How this works</h3>
      <p class="text-gray-300 mb-3">
        1. <strong>UserContext</strong> is created using <code>createContext()</code>.
      </p>
      <p class="text-gray-300 mb-3">
        2. The <strong>App</strong> component wraps the <strong>Profile</strong> component with <code>UserContext.Provider</code> and passes the <code>user</code> object as the <code>value</code>.
      </p>
      <p class="text-gray-300 mb-3">
        3. The <strong>Profile</strong> component uses the <code>useContext(UserContext)</code> hook to access the <code>user</code> object directly, without receiving it via props from App.
      </p>
      <p class="text-gray-300">
        This demonstrates how data can "teleport" from a parent provider to a deep child component, skipping any intermediate levels (though here we only have one level for simplicity).
      </p>
    `
};

export const module6Lesson6: Lesson = {
  title: "6.6 Angular Routing and Navigation",
  duration: "25 min",
  content: `
    <div class="space-y-6 text-gray-300">
      
      <!-- Introduction -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Introduction</h2>
        <p class="mb-4">
          Modern web applications often contain multiple pages such as:
        </p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
          <li>Dashboard</li>
        </ul>
        <p class="mb-4">
          In Angular, navigation between different views is handled using the <strong>Angular Router</strong>.
        </p>
        <p class="mb-4">
          The router enables developers to build <strong>Single Page Applications (SPA)</strong> where the page does not reload completely. Instead, Angular dynamically updates the content displayed in the browser.
        </p>
        <p class="mb-4">Angular routing helps:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Navigate between components</li>
          <li>Manage application URLs</li>
          <li>Load different views dynamically</li>
        </ul>
      </section>

      <!-- What is Angular Routing? -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">What is Angular Routing?</h2>
        <p class="mb-4">
          Routing is the process of mapping a URL path to a specific component.
        </p>
        
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left">URL</th>
                <th class="px-4 py-2 text-left">Component</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="px-4 py-2 font-mono text-green-300">/home</td>
                <td class="px-4 py-2">HomeComponent</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-mono text-green-300">/about</td>
                <td class="px-4 py-2">AboutComponent</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-mono text-green-300">/contact</td>
                <td class="px-4 py-2">ContactComponent</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>When the user visits <code>/home</code>, Angular loads the <code>HomeComponent</code> automatically.</p>
      </section>

      <!-- Angular Router Module -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Angular Router Module</h2>
        <p class="mb-4">
          Angular routing is managed using the <code>RouterModule</code>. It is part of Angular and must be imported into the application module.
        </p>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-sm font-mono text-blue-300">
import { RouterModule, Routes } from '@angular/router';</pre>
        <p>The <code>Routes</code> array defines how URLs map to components.</p>
      </section>

      <!-- Defining Routes -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Defining Routes</h2>
        <p class="mb-4">Routes are defined in a routing configuration file.</p>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-sm font-mono overflow-x-auto">
<span class="text-purple-400">const</span> routes: Routes = [
  { path: <span class="text-green-300">'home'</span>, component: <span class="text-yellow-300">HomeComponent</span> },
  { path: <span class="text-green-300">'about'</span>, component: <span class="text-yellow-300">AboutComponent</span> },
  { path: <span class="text-green-300">'contact'</span>, component: <span class="text-yellow-300">ContactComponent</span> }
];</pre>
        
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left">Property</th>
                <th class="px-4 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="px-4 py-2 font-mono text-blue-300">path</td>
                <td class="px-4 py-2">URL path</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-mono text-blue-300">component</td>
                <td class="px-4 py-2">Component to load</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Router Outlet -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Router Outlet</h2>
        <p class="mb-4">
          The router outlet is a placeholder where Angular loads the component for the active route.
        </p>
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-1">// Syntax</p>
          <p class="text-blue-300 font-mono">&lt;router-outlet&gt;&lt;/router-outlet&gt;</p>
        </div>
        <p>Whenever the user navigates to a route, Angular displays the corresponding component inside this outlet.</p>
      </section>

      <!-- Navigation Using RouterLink -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Navigation Using RouterLink</h2>
        <p class="mb-4">
          Angular provides a directive called <code>routerLink</code> to create navigation links.
        </p>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-sm font-mono text-blue-300">
&lt;a routerLink="/home"&gt;Home&lt;/a&gt;
&lt;a routerLink="/about"&gt;About&lt;/a&gt;
&lt;a routerLink="/contact"&gt;Contact&lt;/a&gt;</pre>
        <p class="mb-4">When the user clicks a link, Angular updates the URL and loads the corresponding component.</p>
        
        <h3 class="text-xl font-semibold text-blue-400 mb-2">Example Navigation Menu</h3>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-sm font-mono text-blue-300">
&lt;nav&gt;
  &lt;a routerLink="/home"&gt;Home&lt;/a&gt;
  &lt;a routerLink="/about"&gt;About&lt;/a&gt;
  &lt;a routerLink="/contact"&gt;Contact&lt;/a&gt;
&lt;/nav&gt;

&lt;router-outlet&gt;&lt;/router-outlet&gt;</pre>
        <p>This creates a simple navigation system.</p>
      </section>

      <!-- Programmatic Navigation -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Programmatic Navigation</h2>
        <p class="mb-4">Navigation can also be triggered using TypeScript code.</p>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-sm font-mono overflow-x-auto">
<span class="text-purple-400">import</span> { Router } <span class="text-purple-400">from</span> <span class="text-green-300">'@angular/router'</span>;

<span class="text-blue-300">constructor</span>(<span class="text-purple-400">private</span> router: Router){}

<span class="text-blue-300">goToHome</span>(){
  <span class="text-purple-400">this</span>.router.navigate([<span class="text-green-300">'/home'</span>]);
}</pre>
        <p class="mb-2">This allows navigation after events such as:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Form submission</li>
          <li>Login success</li>
          <li>Button click</li>
        </ul>
      </section>

      <!-- Default & Wildcard Routes -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Default & Wildcard Routes</h2>
        
        <h3 class="text-xl font-semibold text-blue-400 mb-2">Default Route</h3>
        <p class="mb-2">Sometimes a default page should load when the application starts.</p>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-sm font-mono text-blue-300">
{ path: '', redirectTo: '/home', pathMatch: 'full' }</pre>
        <p class="mb-4">This redirects the root URL to <code>/home</code>.</p>

        <h3 class="text-xl font-semibold text-blue-400 mb-2">Wildcard Route (404 Page)</h3>
        <p class="mb-2">Angular can also handle invalid routes.</p>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-sm font-mono text-blue-300">
{ path: '**', component: PageNotFoundComponent }</pre>
        <p>This route handles unknown URLs and displays a 404 page.</p>
      </section>

      <!-- Advantages -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Advantages of Angular Routing</h2>
        <p class="mb-4">Routing provides many benefits:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Supports single-page applications</li>
          <li>Improves user experience</li>
          <li>Enables structured navigation</li>
          <li>Allows deep linking using URLs</li>
          <li>Supports lazy loading for performance</li>
        </ul>
        <p>Large-scale applications built by companies such as Google, Microsoft, and Upwork frequently use Angular routing for complex navigation systems.</p>
      </section>

    </div>
  `,
  syntax: [
    {
      title: "Import Router Module",
      content: `import { RouterModule, Routes } from '@angular/router';`
    },
    {
      title: "Define Routes",
      content: `const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent }
];`
    },
    {
      title: "Router Outlet",
      content: `<router-outlet></router-outlet>`
    },
    {
      title: "RouterLink Navigation",
      content: `<a routerLink="/home">Home</a>`
    },
    {
      title: "Programmatic Navigation",
      content: `this.router.navigate(['/home']);`
    },
    {
      title: "Default Route",
      content: `{ path: '', redirectTo: '/home', pathMatch: 'full' }`
    },
    {
      title: "Wildcard Route",
      content: `{ path: '**', component: PageNotFoundComponent }`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angular Routing Simulation</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #1e1e1e;
      color: #d4d4d4;
      padding: 20px;
      margin: 0;
    }
    h1 {
      color: #dd0031; /* Angular Red */
      border-bottom: 1px solid #333;
      padding-bottom: 10px;
    }
    nav {
      background-color: #252526;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      display: flex;
      gap: 15px;
    }
    nav a {
      color: #569cd6;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    nav a:hover {
      background-color: #3e3e42;
      color: #9cdcfe;
    }
    nav a.active {
      background-color: #007acc;
      color: white;
    }
    .router-outlet-container {
      border: 2px dashed #444;
      padding: 20px;
      border-radius: 4px;
      min-height: 150px;
      background-color: #1e1e1e;
    }
    .component-content {
      animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .url-bar {
      background-color: #333;
      color: #aaa;
      padding: 5px 10px;
      font-family: monospace;
      font-size: 12px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>

  <h1>Angular Routing Example</h1>

  <!-- Simulated URL Bar -->
  <div class="url-bar">Current URL: <span id="currentUrl">http://localhost:4200/home</span></div>

  <!-- Navigation Menu -->
  <nav>
    <a data-link="/home" class="active">Home</a>
    <a data-link="/about">About</a>
    <a data-link="/contact">Contact</a>
  </nav>

  <!-- Router Outlet -->
  <div class="router-outlet-container">
    <div style="color: #666; font-size: 12px; margin-bottom: 10px;">&lt;router-outlet&gt;</div>
    <div id="routerOutlet">
      <!-- Dynamic Content Loads Here -->
    </div>
    <div style="color: #666; font-size: 12px; margin-top: 10px;">&lt;/router-outlet&gt;</div>
  </div>

  <script>
    // --- 1. Define Components (Templates) ---
    const components = {
      '/home': \`
        <div class="component-content">
          <h2 style="color: #4ec9b0;">HomeComponent</h2>
          <p>Welcome to the Home Page!</p>
          <p>This is the default landing page of the application.</p>
        </div>
      \`,
      '/about': \`
        <div class="component-content">
          <h2 style="color: #ce9178;">AboutComponent</h2>
          <p>This is the About Page.</p>
          <p>Here you can find information about our company and team.</p>
        </div>
      \`,
      '/contact': \`
        <div class="component-content">
          <h2 style="color: #569cd6;">ContactComponent</h2>
          <p>Contact Us at: <a href="#" style="color: #9cdcfe;">support@example.com</a></p>
          <button style="background-color: #007acc; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin-top: 10px;">Send Message</button>
        </div>
      \`
    };

    // --- 2. Router Logic ---
    const routerOutlet = document.getElementById('routerOutlet');
    const currentUrlDisplay = document.getElementById('currentUrl');
    const navLinks = document.querySelectorAll('nav a');

    function navigate(path) {
      // Update Content
      if (components[path]) {
        routerOutlet.innerHTML = components[path];
      } else {
        routerOutlet.innerHTML = '<p style="color: red;">404 - Page Not Found</p>';
      }

      // Update URL Display
      currentUrlDisplay.textContent = 'http://localhost:4200' + path;

      // Update Active Link Styling
      navLinks.forEach(link => {
        if (link.getAttribute('data-link') === path) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // --- 3. Initialize Navigation ---
    
    // Add click event listeners to links (Simulate routerLink)
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('data-link');
        navigate(path);
      });
    });

    // Default Route (Redirect to /home)
    navigate('/home');

  </script>

</body>
</html>`,
  liveCodeExplanation: `
    <h3 class="text-xl font-bold text-white mb-3">Understanding the Simulation</h3>
    <div class="space-y-4 text-gray-300">
      <div>
        <h4 class="font-semibold text-blue-400">1. Defining Routes</h4>
        <p>
          In the code, we mapped paths (<code>/home</code>, <code>/about</code>) to specific HTML content. 
          In a real Angular app, this would be the <code>Routes</code> array mapping paths to Component Classes.
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-blue-400">2. routerLink Directive</h4>
        <p>
          The navigation links use <code>routerLink="/home"</code> (simulated here with data attributes). 
          Clicking a link tells the router to update the view without reloading the page.
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-blue-400">3. &lt;router-outlet&gt;</h4>
        <p>
          The dashed box represents the <code>&lt;router-outlet&gt;</code>. 
          Notice how the header and navigation bar stay constant, while only the content inside the outlet changes dynamically. 
          This is the core concept of a Single Page Application (SPA).
        </p>
      </div>
    </div>
  `
};

export const module6Lesson5: Lesson = {
  title: "6.5 Angular Services and Dependency Injection",
  duration: "20 min",
  content: `
    <div class="space-y-6 text-gray-300">
      
      <!-- Introduction -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Introduction</h2>
        <p class="mb-4">
          In Angular, services are used to organize and share reusable business logic across multiple components.
        </p>
        <p class="mb-4">
          Instead of writing the same code in many components, developers place common logic inside a service and reuse it wherever needed.
        </p>
        <p class="mb-4">
          Angular uses a powerful design pattern called Dependency Injection to provide services to components automatically.
        </p>
        <p class="mb-4">This makes applications:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Modular</li>
          <li>Maintainable</li>
          <li>Scalable</li>
        </ul>
      </section>

      <!-- What is an Angular Service? -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">What is an Angular Service?</h2>
        <p class="mb-4">
          An Angular Service is a class that contains reusable logic such as:
        </p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Data fetching</li>
          <li>Business calculations</li>
          <li>Logging</li>
          <li>API communication</li>
          <li>Data sharing between components</li>
        </ul>
        <p class="mb-4">Services help keep components clean and focused on UI logic.</p>
        
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-1">// Example service</p>
          <pre class="text-green-400 font-mono">
export class DataService {
  getMessage(){
    return "Welcome to Angular Service";
  }
}</pre>
        </div>
        <p>Components can use this service to access the message.</p>
      </section>

      <!-- Why Services are Important -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Why Services are Important</h2>
        <p class="mb-4">Without services, components may become very large and difficult to maintain.</p>
        <p class="mb-4">Using services provides several advantages:</p>
        
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left">Benefit</th>
                <th class="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="px-4 py-2 font-semibold text-blue-400">Code Reusability</td>
                <td class="px-4 py-2">Logic can be reused in many components</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold text-blue-400">Separation of Concerns</td>
                <td class="px-4 py-2">UI and business logic remain separate</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold text-blue-400">Easier Maintenance</td>
                <td class="px-4 py-2">Changes are made in one place</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold text-blue-400">Better Testing</td>
                <td class="px-4 py-2">Services are easier to test independently</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Creating an Angular Service -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Creating an Angular Service</h2>
        <p class="mb-4">Angular CLI provides a command to generate services automatically.</p>
        
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-1">// Command</p>
          <p class="text-blue-300 font-mono mb-2">ng generate service service-name</p>
          <p class="text-gray-400 mb-1">// Shortcut</p>
          <p class="text-blue-300 font-mono mb-2">ng g s service-name</p>
          <p class="text-gray-400 mb-1">// Example</p>
          <p class="text-blue-300 font-mono">ng g s user</p>
        </div>
        <p class="mb-4">This generates two files:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li class="font-mono text-sm text-green-300">user.service.ts</li>
          <li class="font-mono text-sm text-green-300">user.service.spec.ts</li>
        </ul>

        <h3 class="text-xl font-semibold text-blue-400 mb-2">Service Structure</h3>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-sm font-mono overflow-x-auto">
<span class="text-purple-400">import</span> { Injectable } <span class="text-purple-400">from</span> <span class="text-green-300">'@angular/core'</span>;

<span class="text-yellow-400">@Injectable</span>({
  providedIn: <span class="text-green-300">'root'</span>
})
<span class="text-purple-400">export class</span> <span class="text-yellow-300">UserService</span> {

  <span class="text-blue-300">constructor</span>() {}

  <span class="text-blue-300">getUsers</span>(){
    <span class="text-purple-400">return</span> [<span class="text-green-300">"Rahul"</span>,<span class="text-green-300">"Anita"</span>,<span class="text-green-300">"John"</span>];
  }

}</pre>
        
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left">Part</th>
                <th class="px-4 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="px-4 py-2 font-mono text-yellow-400">@Injectable</td>
                <td class="px-4 py-2">Marks the class as injectable</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-mono text-green-300">providedIn: 'root'</td>
                <td class="px-4 py-2">Makes service available across the application</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-mono text-blue-300">constructor</td>
                <td class="px-4 py-2">Used for dependency injection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- What is Dependency Injection? -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">What is Dependency Injection?</h2>
        <p class="mb-4">
          Dependency Injection (DI) is a design pattern where Angular automatically provides required services to components.
        </p>
        <p class="mb-4">
          Instead of creating services manually, Angular injects them through the constructor.
        </p>
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-1">// Example Injection</p>
          <pre class="text-blue-300 font-mono">constructor(private userService: UserService){}</pre>
        </div>
        <p class="mb-4">
          Angular automatically creates and provides the service instance. This feature is built into Angular and simplifies service management.
        </p>
      </section>

      <!-- Using Services in Components -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Using Services in Components</h2>
        <p class="mb-4">Here is a complete example of a service being used in a component.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800 p-4 rounded-lg">
            <p class="text-gray-400 text-sm mb-2 font-bold">user.service.ts</p>
            <pre class="text-xs font-mono text-green-300">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUsers(){
    return ["Rahul","Anita","John"];
  }
}</pre>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <p class="text-gray-400 text-sm mb-2 font-bold">app.component.ts</p>
            <pre class="text-xs font-mono text-blue-300">
import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  users: string[] = [];

  constructor(private userService: UserService){
    this.users = this.userService.getUsers();
  }
}</pre>
          </div>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg mb-6">
          <p class="text-gray-400 text-sm mb-2 font-bold">app.component.html</p>
          <pre class="text-sm font-mono text-yellow-300">
&lt;h2&gt;User List&lt;/h2&gt;
&lt;ul&gt;
  &lt;li *ngFor="let user of users"&gt;
     {{user}}
  &lt;/li&gt;
&lt;/ul&gt;</pre>
        </div>

        <h3 class="text-xl font-semibold text-blue-400 mb-2">Service Scope</h3>
        <p class="mb-4">Services can be provided at different levels.</p>
        
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left">Scope</th>
                <th class="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="px-4 py-2 font-semibold">Root Level</td>
                <td class="px-4 py-2">Available across entire application</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">Module Level</td>
                <td class="px-4 py-2">Available within a specific module</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-semibold">Component Level</td>
                <td class="px-4 py-2">Available only in one component</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mb-4">Most services are provided at the root level using <code class="bg-gray-800 px-1 rounded">providedIn: 'root'</code>.</p>
      </section>

      <!-- Advantages -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Advantages of Dependency Injection</h2>
        <p class="mb-4">Dependency Injection improves application design. Benefits include:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Loose coupling between components and services</li>
          <li>Easier code testing</li>
          <li>Improved code reusability</li>
          <li>Better scalability for large applications</li>
          <li>Automatic service management</li>
        </ul>
        <p>Many large-scale applications built with Angular rely heavily on services and dependency injection.</p>
      </section>

    </div>
  `,
  syntax: [
    {
      title: "Generate Service",
      content: `ng generate service service-name
// or
ng g s service-name`
    },
    {
      title: "Service Example",
      content: `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getMessage(){
    return "Hello Angular";
  }
}`
    },
    {
      title: "Inject Service in Component",
      content: `constructor(private dataService: DataService){}`
    },
    {
      title: "Use Service Method",
      content: `this.dataService.getMessage();`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angular Service Simulation</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #1e1e1e;
      color: #d4d4d4;
      padding: 20px;
    }
    h2 {
      color: #4fc08d;
      border-bottom: 1px solid #333;
      padding-bottom: 10px;
    }
    .component-box {
      border: 1px solid #444;
      padding: 15px;
      margin-top: 20px;
      border-radius: 4px;
      background-color: #252526;
    }
    .service-box {
      border: 1px solid #007acc;
      padding: 15px;
      margin-top: 20px;
      border-radius: 4px;
      background-color: #001f3f;
    }
    .arrow {
      font-size: 24px;
      text-align: center;
      margin: 10px 0;
      color: #569cd6;
    }
    button {
      background-color: #007acc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover {
      background-color: #005999;
    }
    .log {
      font-family: monospace;
      color: #ce9178;
      margin-top: 10px;
    }
  </style>
</head>
<body>

  <h2>Dependency Injection Simulation</h2>

  <!-- Visual Representation of Service -->
  <div class="service-box">
    <h3 style="margin-top:0; color: #569cd6;">MessageService (Injectable)</h3>
    <p>Contains Method: <code>getMessage()</code></p>
    <p><i>Status: Ready to be injected</i></p>
  </div>

  <div class="arrow">⬇️ Injected into ⬇️</div>

  <!-- Visual Representation of Component -->
  <div class="component-box">
    <h3 style="margin-top:0; color: #4ec9b0;">AppComponent</h3>
    <p>Constructor: <code>constructor(private messageService: MessageService)</code></p>
    
    <button id="fetchBtn">Call this.messageService.getMessage()</button>
    
    <div style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">
      <strong>Component View (HTML):</strong>
      <h2 id="outputDisplay" style="color: #d4d4d4;">{{message}}</h2>
    </div>
  </div>

  <script>
    // --- 1. Service Definition ---
    class MessageService {
      constructor() {
        
      }

      getMessage() {
        return "Hello from Angular Service";
      }
    }

    // --- 2. Component Definition ---
    class AppComponent {
      // In Angular, the service is passed automatically via DI
      constructor(messageService) {
        this.messageService = messageService;
        this.message = "";
        
      }

      // Method to simulate ngOnInit or user action
      updateMessage() {
        this.message = this.messageService.getMessage();
        this.render();
      }

      render() {
        const display = document.getElementById('outputDisplay');
        display.textContent = this.message;
        display.style.color = "#4fc08d"; // Highlight change
      }
    }

    // --- 3. Angular Framework Simulation (Dependency Injection) ---
    // Angular creates the service instance (Singleton)
    const angularInjector = {
      services: new Map(),
      get(ServiceClass) {
        if (!this.services.has(ServiceClass)) {
          this.services.set(ServiceClass, new ServiceClass());
        }
        return this.services.get(ServiceClass);
      }
    };

    // Get the service instance from "Angular"
    const messageServiceInstance = angularInjector.get(MessageService);

    // Create the component and inject the service
    const appComponent = new AppComponent(messageServiceInstance);

    // --- UI Interaction ---
    document.getElementById('fetchBtn').addEventListener('click', () => {
      appComponent.updateMessage();
    });

  </script>

</body>
</html>`,
  liveCodeExplanation: `
    <h3 class="text-xl font-bold text-white mb-3">Understanding the Simulation</h3>
    <div class="space-y-4 text-gray-300">
      <div>
        <h4 class="font-semibold text-blue-400">1. The Service (Provider)</h4>
        <p>
          The <code>MessageService</code> class holds the business logic (the <code>getMessage</code> method).
          In Angular, the <code>@Injectable</code> decorator registers this service with the injector.
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-blue-400">2. The Component (Consumer)</h4>
        <p>
          The <code>AppComponent</code> needs the service to function. It declares this dependency in its constructor:
          <code class="text-sm bg-gray-800 px-1 rounded">constructor(private messageService: MessageService)</code>.
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-blue-400">3. Dependency Injection (The Wiring)</h4>
        <p>
          In the example, when you click the button, the component calls the service's method.
          Angular's DI system has already "injected" the service instance into the component, so <code>this.messageService</code> is available immediately without manually using <code>new MessageService()</code> inside the component.
        </p>
      </div>
    </div>
  `
};

export const module6Lesson4: Lesson = {
  title: "6.4 Data Binding and Directives in Angular",
  duration: "25 min",
  content: `
    <div class="space-y-6 text-gray-300">
      
      <!-- Introduction -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Introduction</h2>
        <p class="mb-4">
          In Angular, Data Binding and Directives are powerful features that connect the application logic with the user interface.
        </p>
        <p class="mb-4">They allow developers to:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Display dynamic data in the UI</li>
          <li>Handle user interactions</li>
          <li>Modify the structure and behavior of HTML elements</li>
        </ul>
        <p>These features make Angular applications interactive and dynamic.</p>
      </section>

      <!-- Data Binding in Angular -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Data Binding in Angular</h2>
        <h3 class="text-xl font-semibold text-blue-400 mb-2">What is Data Binding?</h3>
        <p class="mb-4">
          Data Binding is the process of synchronizing data between:
        </p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>The component class (TypeScript)</li>
          <li>The template (HTML view)</li>
        </ul>
        <p class="mb-4">Angular automatically keeps the UI and data synchronized.</p>
        
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-green-400 font-mono mb-2">title = "Angular Learning";</p>
          <p class="text-blue-300 font-mono">&lt;h1&gt;{{title}}&lt;/h1&gt;</p>
        </div>
        <p class="mb-4">When the value of title changes, the UI updates automatically.</p>

        <h3 class="text-xl font-semibold text-blue-400 mb-2">Types of Data Binding</h3>
        <p class="mb-4">Angular supports four types of data binding.</p>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left">Type</th>
                <th class="px-4 py-2 text-left">Symbol</th>
                <th class="px-4 py-2 text-left">Direction</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="px-4 py-2">Interpolation</td>
                <td class="px-4 py-2 font-mono">{{ }}</td>
                <td class="px-4 py-2">Component → View</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Property Binding</td>
                <td class="px-4 py-2 font-mono">[ ]</td>
                <td class="px-4 py-2">Component → View</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Event Binding</td>
                <td class="px-4 py-2 font-mono">( )</td>
                <td class="px-4 py-2">View → Component</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Two-Way Binding</td>
                <td class="px-4 py-2 font-mono">[( )]</td>
                <td class="px-4 py-2">Both Directions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 1. Interpolation -->
      <section>
        <h3 class="text-xl font-semibold text-blue-400 mb-2">1. Interpolation</h3>
        <p class="mb-2">Interpolation displays data from the component into the template.</p>
        <p class="mb-2"><strong>Syntax:</strong> <code class="bg-gray-800 px-1 rounded">{{ expression }}</code></p>
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-1">// Component</p>
          <p class="text-green-400 font-mono mb-2">name = "John";</p>
          <p class="text-gray-400 mb-1">// Template</p>
          <p class="text-blue-300 font-mono">&lt;p&gt;Hello {{name}}&lt;/p&gt;</p>
          <p class="text-gray-400 mt-2">// Output</p>
          <p class="text-white font-mono">Hello John</p>
        </div>
      </section>

      <!-- 2. Property Binding -->
      <section>
        <h3 class="text-xl font-semibold text-blue-400 mb-2">2. Property Binding</h3>
        <p class="mb-2">Property binding binds component data to HTML element properties.</p>
        <p class="mb-2"><strong>Syntax:</strong> <code class="bg-gray-800 px-1 rounded">[property]="expression"</code></p>
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-1">// Component</p>
          <p class="text-green-400 font-mono mb-2">imageUrl = "logo.png";</p>
          <p class="text-gray-400 mb-1">// Template</p>
          <p class="text-blue-300 font-mono">&lt;img [src]="imageUrl"&gt;</p>
        </div>
        <p>This dynamically sets the image source.</p>
      </section>

      <!-- 3. Event Binding -->
      <section>
        <h3 class="text-xl font-semibold text-blue-400 mb-2">3. Event Binding</h3>
        <p class="mb-2">Event binding allows the component to respond to user actions.</p>
        <p class="mb-2"><strong>Syntax:</strong> <code class="bg-gray-800 px-1 rounded">(event)="method()"</code></p>
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-1">// Template</p>
          <p class="text-blue-300 font-mono mb-2">&lt;button (click)="showMessage()"&gt;Click&lt;/button&gt;</p>
          <p class="text-gray-400 mb-1">// Component</p>
          <pre class="text-green-400 font-mono">
showMessage(){
  alert("Button clicked");
}</pre>
        </div>
      </section>

      <!-- 4. Two-Way Data Binding -->
      <section>
        <h3 class="text-xl font-semibold text-blue-400 mb-2">4. Two-Way Data Binding</h3>
        <p class="mb-2">Two-way binding synchronizes data between the UI and component.</p>
        <p class="mb-2"><strong>Syntax:</strong> <code class="bg-gray-800 px-1 rounded">[(ngModel)]="variable"</code></p>
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-1">// Component</p>
          <p class="text-green-400 font-mono mb-2">username = "";</p>
          <p class="text-gray-400 mb-1">// Template</p>
          <p class="text-blue-300 font-mono">&lt;input [(ngModel)]="username"&gt;</p>
          <p class="text-blue-300 font-mono">&lt;p&gt;{{username}}&lt;/p&gt;</p>
        </div>
        <p class="mb-2">If the user types in the input field, the value updates automatically.</p>
        <p class="text-yellow-400 text-sm">To use ngModel, developers must import FormsModule.</p>
      </section>

      <!-- Angular Directives -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4 mt-8">Angular Directives</h2>
        <h3 class="text-xl font-semibold text-blue-400 mb-2">What are Directives?</h3>
        <p class="mb-4">
          Directives are special instructions that tell Angular how to modify the DOM (HTML elements).
        </p>
        <p class="mb-2">They help:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Add behavior to elements</li>
          <li>Change layout dynamically</li>
          <li>Control the display of elements</li>
        </ul>
        <p class="mb-4">Angular provides three main types of directives.</p>
        
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left">Directive Type</th>
                <th class="px-4 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="px-4 py-2">Component Directives</td>
                <td class="px-4 py-2">UI components</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Structural Directives</td>
                <td class="px-4 py-2">Change DOM structure</td>
              </tr>
              <tr>
                <td class="px-4 py-2">Attribute Directives</td>
                <td class="px-4 py-2">Change element appearance or behavior</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 1. Component Directives -->
        <h3 class="text-xl font-semibold text-blue-400 mb-2">1. Component Directives</h3>
        <p class="mb-2">Components themselves are directives with templates.</p>
        <pre class="bg-gray-800 p-4 rounded-lg mb-4 text-green-400 font-mono">
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})</pre>
        <p class="mb-4">Components control sections of the UI.</p>

        <!-- 2. Structural Directives -->
        <h3 class="text-xl font-semibold text-blue-400 mb-2">2. Structural Directives</h3>
        <p class="mb-2">Structural directives change the structure of the DOM. They add or remove elements from the page.</p>
        <p class="mb-4">Common structural directives:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li><strong>*ngIf</strong>: Conditional display</li>
          <li><strong>*ngFor</strong>: Loop through data</li>
          <li><strong>*ngSwitch</strong>: Multiple condition control</li>
        </ul>

        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-2 font-bold">Example: ngIf</p>
          <p class="text-blue-300 font-mono mb-2">&lt;p *ngIf="isLoggedIn"&gt;Welcome User&lt;/p&gt;</p>
          <p class="text-green-400 font-mono mb-2">isLoggedIn = true;</p>
          <p class="text-gray-400 text-sm">If isLoggedIn is false, the paragraph will not appear.</p>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-2 font-bold">Example: ngFor</p>
          <p class="text-gray-400 text-sm mb-2">ngFor is used to loop through lists.</p>
          <p class="text-green-400 font-mono mb-2">students = ["Rahul", "Anita", "John"];</p>
          <p class="text-blue-300 font-mono mb-2">
&lt;ul&gt;
  &lt;li *ngFor="let student of students"&gt;
     {{student}}
  &lt;/li&gt;
&lt;/ul&gt;</p>
          <p class="text-gray-400 text-sm mt-2">Output:</p>
          <ul class="list-disc list-inside ml-4 text-white">
            <li>Rahul</li>
            <li>Anita</li>
            <li>John</li>
          </ul>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-2 font-bold">Example: ngSwitch</p>
          <pre class="text-blue-300 font-mono">
&lt;div [ngSwitch]="role"&gt;
  &lt;p *ngSwitchCase="'admin'"&gt;Admin Panel&lt;/p&gt;
  &lt;p *ngSwitchCase="'user'"&gt;User Dashboard&lt;/p&gt;
  &lt;p *ngSwitchDefault&gt;Guest&lt;/p&gt;
&lt;/div&gt;</pre>
        </div>

        <!-- 3. Attribute Directives -->
        <h3 class="text-xl font-semibold text-blue-400 mb-2">3. Attribute Directives</h3>
        <p class="mb-2">Attribute directives modify the appearance or behavior of an element.</p>
        <p class="mb-4">Examples:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li><strong>ngClass</strong>: Add/remove CSS classes</li>
          <li><strong>ngStyle</strong>: Apply styles dynamically</li>
        </ul>

        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-2 font-bold">Example: ngClass</p>
          <p class="text-blue-300 font-mono mb-2">
&lt;p [ngClass]="{'highlight': isActive}"&gt;
  Angular Directive Example
&lt;/p&gt;</p>
          <p class="text-green-400 font-mono">isActive = true;</p>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <p class="text-gray-400 mb-2 font-bold">Example: ngStyle</p>
          <p class="text-blue-300 font-mono">
&lt;p [ngStyle]="{'color': 'blue'}"&gt;
  Styled Text
&lt;/p&gt;</p>
        </div>
      </section>

      <!-- Advantages -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Advantages of Data Binding and Directives</h2>
        <p class="mb-4">These features make Angular very powerful. Benefits include:</p>
        <ul class="list-disc list-inside ml-4 space-y-2 mb-4">
          <li>Automatic UI updates</li>
          <li>Reduced manual DOM manipulation</li>
          <li>Cleaner code structure</li>
          <li>Easier application maintenance</li>
          <li>Dynamic user interfaces</li>
        </ul>
        <p>Large enterprise applications built by organizations like Google, Microsoft, and IBM rely on these Angular features for complex UI management.</p>
      </section>

    </div>
  `,
  syntax: [
    {
      title: "Interpolation",
      content: `{{variable}}`
    },
    {
      title: "Property Binding",
      content: `[property]="value"

// Example:
<img [src]="imageUrl">`
    },
    {
      title: "Event Binding",
      content: `(event)="method()"

// Example:
<button (click)="submit()">Submit</button>`
    },
    {
      title: "Two-Way Binding",
      content: `[(ngModel)]="variable"`
    },
    {
      title: "ngIf Directive",
      content: `<p *ngIf="condition">Content</p>`
    },
    {
      title: "ngFor Directive",
      content: `<li *ngFor="let item of items">
  {{item}}
</li>`
    },
    {
      title: "ngClass",
      content: `<p [ngClass]="{'active': isActive}">`
    },
    {
      title: "ngStyle",
      content: `<p [ngStyle]="{'color':'red'}">`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angular Data Binding & Directives</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #1e1e1e;
      color: #d4d4d4;
      padding: 20px;
    }
    h2 {
      color: #4fc08d; /* Angular Greenish */
      border-bottom: 1px solid #333;
      padding-bottom: 5px;
      margin-top: 20px;
    }
    input {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #333;
      background-color: #252526;
      color: white;
      margin-bottom: 10px;
      width: 100%;
      box-sizing: border-box;
    }
    ul {
      list-style-type: disc;
      padding-left: 20px;
    }
    li {
      margin-bottom: 5px;
      padding: 5px;
      background-color: #2d2d2d;
      border-radius: 4px;
    }
    .hidden {
      display: none;
    }
    button {
      background-color: #007acc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 10px;
    }
    button:hover {
      background-color: #005999;
    }
  </style>
</head>
<body>

  <!-- Two-Way Binding Section -->
  <h2>Two Way Binding</h2>
  <label style="display:block; margin-bottom:5px;">Enter Name:</label>
  <input type="text" id="usernameInput" placeholder="Type here...">
  <p>Welcome <span id="usernameDisplay" style="color: #569cd6; font-weight: bold;"></span></p>

  <!-- ngIf Section -->
  <h2>ngIf Example</h2>
  <button id="toggleAuthBtn">Toggle Logged In</button>
  <p id="loggedInMsg" style="color: #4ec9b0;">User Logged In</p>
  <p id="loggedOutMsg" class="hidden" style="color: #f44747;">User Logged Out</p>

  <!-- ngFor Section -->
  <h2>ngFor Example</h2>
  <ul id="studentsList">
    <!-- List items will be injected here -->
  </ul>

  <script>
    // --- Simulation State ---
    const state = {
      username: "",
      isLoggedIn: true,
      students: ["Rahul", "Anita", "John"]
    };

    // --- DOM Elements ---
    const usernameInput = document.getElementById('usernameInput');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    const toggleAuthBtn = document.getElementById('toggleAuthBtn');
    const loggedInMsg = document.getElementById('loggedInMsg');
    const loggedOutMsg = document.getElementById('loggedOutMsg');
    
    const studentsList = document.getElementById('studentsList');

    // --- Two-Way Binding Logic ---
    usernameInput.addEventListener('input', (e) => {
      state.username = e.target.value;
      updateView();
    });

    // --- ngIf Logic ---
    toggleAuthBtn.addEventListener('click', () => {
      state.isLoggedIn = !state.isLoggedIn;
      updateView();
    });

    // --- View Update Function (Angular Change Detection Simulation) ---
    function updateView() {
      // 1. Update Interpolation
      usernameDisplay.textContent = state.username;

      // 2. Update ngIf
      if (state.isLoggedIn) {
        loggedInMsg.classList.remove('hidden');
        loggedOutMsg.classList.add('hidden');
      } else {
        loggedInMsg.classList.add('hidden');
        loggedOutMsg.classList.remove('hidden');
      }
    }

    // --- Initial Render (ngFor) ---
    function renderStudents() {
      studentsList.innerHTML = '';
      state.students.forEach(student => {
        const li = document.createElement('li');
        li.textContent = student;
        studentsList.appendChild(li);
      });
    }

    // Initialize
    renderStudents();
    updateView();

  </script>

</body>
</html>`,
  liveCodeExplanation: `
    <h3 class="text-xl font-bold text-white mb-3">Understanding the Example</h3>
    <div class="space-y-4 text-gray-300">
      <div>
        <h4 class="font-semibold text-blue-400">1. Two-Way Binding <code>[(ngModel)]</code></h4>
        <p>
          The input field is bound to the <code>username</code> variable. When you type:
        </p>
        <ul class="list-disc list-inside ml-4 mt-1 text-sm">
          <li>The <strong>Model</strong> (variable) updates with the new text.</li>
          <li>The <strong>View</strong> (interpolation <code>{{username}}</code>) updates instantly to reflect the change.</li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold text-blue-400">2. Structural Directive <code>*ngIf</code></h4>
        <p>
          The "User Logged In" message is conditionally displayed based on the <code>isLoggedIn</code> boolean.
          Clicking "Toggle Logged In" switches this state, showing/hiding the element in the DOM.
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-blue-400">3. Structural Directive <code>*ngFor</code></h4>
        <p>
          The list of students is generated by looping through the <code>students</code> array.
          In the code, <code>*ngFor="let student of students"</code> creates a <code>&lt;li&gt;</code> for each item.
        </p>
      </div>
    </div>
  `
};

export const module5Lesson8 = {
  title: '5.8 Form Handling and Controlled Components',
  duration: '50 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">5.8 Form Handling and Controlled Components</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Introduction</h3>
      <p class="text-gray-300 mb-4">
        Forms are an essential part of modern web applications. They allow users to provide input such as:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>Login credentials</li>
        <li>Registration details</li>
        <li>Contact information</li>
        <li>Payment information</li>
        <li>Search queries</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Applications built with React manage form data differently compared to traditional HTML forms.
        In React, form inputs are usually controlled using state variables, which ensures that the application has full control over user input.
        This concept is known as <strong>Controlled Components</strong>.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Traditional HTML Forms</h3>
      <p class="text-gray-300 mb-4">
        In traditional HTML, form elements manage their own state.
      </p>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <p class="font-semibold mb-2">Example:</p>
        <pre class="text-sm">&lt;input type="text"&gt;</pre>
      </div>
      <p class="text-gray-300 mb-4">
        The browser automatically stores and updates the value.
        However, React applications require better control and synchronization with component state.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Controlled Components</h3>
      <p class="text-gray-300 mb-4">
        A Controlled Component is a form element whose value is controlled by the React state.
      </p>
      <p class="text-gray-300 mb-4">
        This means: <strong>User Input → React State → UI Update</strong>
      </p>
      <p class="text-gray-300 mb-4">
        Whenever the user types something, React updates the state and the UI reflects that change.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>const [name, setName] = useState("");</code></pre>
      <p class="text-gray-300 mb-4">
        The input field value is connected to this state variable.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Handling Input Changes</h3>
      <p class="text-gray-300 mb-4">
        React uses the <code>onChange</code> event handler to capture user input.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>&lt;input 
  type="text" 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
/&gt;</code></pre>
      <p class="text-gray-300 mb-4">
        Here:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li><code>value</code> connects the input to the state.</li>
          <li><code>onChange</code> updates the state when the user types.</li>
        </ul>
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Handling Form Submission</h3>
      <p class="text-gray-300 mb-4">
        Forms usually require processing data when the user clicks the Submit button.
        React uses the <code>onSubmit</code> event for this purpose.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>&lt;form onSubmit={handleSubmit}&gt;</code></pre>
      <p class="text-gray-300 mb-4">
        The <code>handleSubmit</code> function processes the form data.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Types of Form Inputs</h3>
      <p class="text-gray-300 mb-4">
        Common input types used in React forms:
      </p>
      <table class="w-full text-left text-gray-300 mb-4 border-collapse">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="py-2">Input Type</th>
            <th class="py-2">Example</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-800">
            <td class="py-2">Text Input</td>
            <td class="py-2">Username</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2">Password Input</td>
            <td class="py-2">Login Password</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2">Email Input</td>
            <td class="py-2">Email Address</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2">Checkbox</td>
            <td class="py-2">Accept Terms</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2">Radio Button</td>
            <td class="py-2">Gender Selection</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2">Select Dropdown</td>
            <td class="py-2">Country Selection</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2">Textarea</td>
            <td class="py-2">Comments</td>
          </tr>
        </tbody>
      </table>
      <p class="text-gray-300 mb-4">
        All these elements can be managed using React state.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Example Scenario</h3>
      <p class="text-gray-300 mb-4">
        Consider a user registration form. Inputs may include:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Name</li>
          <li>Email</li>
          <li>Password</li>
          <li>Confirm Password</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        React stores all these values inside the component state and processes them when the user submits the form.
        Applications such as Amazon, Google, and LinkedIn rely heavily on controlled forms for secure data handling.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Advantages of Controlled Components</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>React controls the form data.</li>
        <li>Easy validation and error handling.</li>
        <li>Predictable form behavior.</li>
        <li>Improved debugging and testing.</li>
        <li>Better integration with APIs.</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Best Practices</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Store form inputs inside state variables.</li>
        <li>Use a single handler for multiple inputs when possible.</li>
        <li>Validate user input before submission.</li>
        <li>Prevent default browser form submission behavior.</li>
      </ul>
      <p class="text-gray-300 mb-2">Example folder structure:</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300"><code>src
 ├── components
 │     └── LoginForm.js
 ├── pages
 └── App.js</code></pre>
  `,
  syntax: [
    {
      title: 'Importing useState',
      content: 'import { useState } from "react";'
    },
    {
      title: 'Creating State for Input Field',
      content: 'const [name, setName] = useState("");'
    },
    {
      title: 'Controlled Input Syntax',
      content: `<input 
  type="text" 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
/>`
    },
    {
      title: 'Handling Form Submission',
      content: `function handleSubmit(event) {
  event.preventDefault();
  
}`
    },
    {
      title: 'Form Structure',
      content: `<form onSubmit={handleSubmit}>

  <input type="text" />

  <button type="submit">Submit</button>

</form>`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Form Example</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 20px; }
    .container { max-width: 500px; margin: 0 auto; background: #222; padding: 30px; border-radius: 8px; border: 1px solid #333; }
    h2 { color: #00bceb; text-align: center; margin-bottom: 20px; }
    input { width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 4px; border: 1px solid #444; background: #111; color: white; box-sizing: border-box; }
    input:focus { border-color: #00bceb; outline: none; }
    button { width: 100%; padding: 10px; background: #00bceb; color: black; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #00a0c8; }
    .output { margin-top: 20px; padding: 15px; background: #111827; border-radius: 4px; border: 1px solid #333; font-family: monospace; }
    .label { display: block; margin-bottom: 5px; color: #aaa; font-size: 0.9em; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;

    function App() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [submittedData, setSubmittedData] = useState(null);

      const handleSubmit = (event) => {
        event.preventDefault();
        
        
        setSubmittedData({ email, password });
      };

      return (
        <div className="container">
          <h2>Login Form</h2>
          <form onSubmit={handleSubmit}>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />

            <label className="label">Password</label>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />

            <button type="submit">Login</button>
          </form>

          {submittedData && (
            <div className="output">
              <div style={{color: '#4ade80', marginBottom: '10px'}}>Login Successful!</div>
              <div>Email: {submittedData.email}</div>
              <div>Password: {submittedData.password}</div>
              <div style={{color: '#666', fontSize: '0.8em', marginTop: '10px'}}>(Check console for logs)</div>
            </div>
          )}
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">How this works</h3>
      <p class="text-gray-300 mb-3">
        1. <strong>State Variables:</strong> We create two state variables, <code>email</code> and <code>password</code>, using <code>useState</code> to store the input values.
      </p>
      <p class="text-gray-300 mb-3">
        2. <strong>Two-Way Binding:</strong> The <code>value</code> prop of each input is set to the corresponding state variable, and the <code>onChange</code> handler updates the state whenever the user types. This ensures the React state is always in sync with the input field.
      </p>
      <p class="text-gray-300 mb-3">
        3. <strong>Form Submission:</strong> The <code>handleSubmit</code> function is triggered when the form is submitted. It calls <code>event.preventDefault()</code> to stop the page from reloading (the default browser behavior) and then logs the current state values.
      </p>
    `
};

export const module5Lesson7 = {
  title: '5.7 Performance Optimization (memo, useMemo, useCallback)',
  duration: '60 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">5.7 Performance Optimization</h2>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Optimization Matters?</h3>
      <p class="text-gray-300 mb-4">
        React is generally fast, but as applications grow, unnecessary re-renders can slow down the user interface.
        React provides three main hooks to optimize performance by memoizing values, functions, and components.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">1. React.memo()</h3>
      <p class="text-gray-300 mb-4">
        <code>React.memo</code> is a higher-order component that memoizes a functional component.
        It prevents a component from re-rendering if its props have not changed.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});</code></pre>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">2. useMemo()</h3>
      <p class="text-gray-300 mb-4">
        The <code>useMemo</code> hook returns a memoized value.
        It is used to cache the result of an expensive calculation so that it is not re-calculated on every render unless dependencies change.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);</code></pre>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">3. useCallback()</h3>
      <p class="text-gray-300 mb-4">
        The <code>useCallback</code> hook returns a memoized callback function.
        It is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);</code></pre>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">When to Optimize?</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>When a component renders often with the same props.</li>
        <li>When you have expensive calculations.</li>
        <li>When passing functions to child components wrapped in <code>React.memo</code>.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        <strong>Note:</strong> Do not optimize prematurely. Memoization has a cost (memory allocation), so only use it when necessary.
      </p>
  `,
  syntax: [
    {
      title: 'React.memo Syntax',
      content: `const Child = React.memo(({ name }) => {
  
  return <div>{name}</div>;
});`
    },
    {
      title: 'useMemo Syntax',
      content: `const expensiveResult = useMemo(() => {
  return heavyCalculation(count);
}, [count]);`
    },
    {
      title: 'useCallback Syntax',
      content: `const handleClick = useCallback(() => {
  
}, []);`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Performance Optimization</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
    .tab { background: transparent; border: 1px solid #333; color: #aaa; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
    .tab.active { background: #00bceb; color: #000; border-color: #00bceb; font-weight: bold; }
    .card { background: #222; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-top: 20px; }
    button { background: #333; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; }
    button:hover { background: #444; }
    .log-box { background: #111827; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em; margin-top: 10px; max-height: 150px; overflow-y: auto; border: 1px solid #333; }
    .highlight { color: #4ade80; }
    .warn { color: #fbbf24; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useMemo, useCallback, memo, useEffect } = React;

    // --- 1. React.memo Example Components ---
    
    // Regular Component (Re-renders every time parent renders)
    const RegularChild = ({ count }) => {
      return <div className="card" style={{borderColor: '#ef4444'}}>Regular Child Rendered: {Math.random().toFixed(4)}</div>;
    };

    // Memoized Component (Only re-renders if props change)
    const MemoizedChild = memo(({ count }) => {
      return <div className="card" style={{borderColor: '#4ade80'}}>Memoized Child Rendered: {Math.random().toFixed(4)}</div>;
    });

    function MemoExample() {
      const [count, setCount] = useState(0);
      const [otherState, setOtherState] = useState(0);

      return (
        <div>
          <h3>1. React.memo Example</h3>
          <p>Clicking "Update Parent State" forces the parent to re-render.</p>
          <div style={{marginBottom: '20px'}}>
            <button onClick={() => setCount(c => c + 1)}>Update Prop (Count: {count})</button>
            <button onClick={() => setOtherState(s => s + 1)}>Update Unrelated State ({otherState})</button>
          </div>
          
          <p className="warn">Regular Child re-renders on ANY parent update:</p>
          <RegularChild count={count} />
          
          <p className="highlight" style={{marginTop: '20px'}}>Memoized Child re-renders ONLY when 'count' prop changes:</p>
          <MemoizedChild count={count} />
        </div>
      );
    }

    // --- 2. useMemo Example Components ---

    function slowFunction(num) {
      
      for (let i = 0; i < 100000000; i++) {} // Artificial delay
      return num * 2;
    }

    function UseMemoExample() {
      const [number, setNumber] = useState(0);
      const [dark, setDark] = useState(false);

      // Without useMemo, this runs on every render
      // const doubleNumber = slowFunction(number); 

      // With useMemo, this only runs when 'number' changes
      const doubleNumber = useMemo(() => {
        return slowFunction(number);
      }, [number]);

      const themeStyles = {
        backgroundColor: dark ? '#333' : '#FFF',
        color: dark ? '#FFF' : '#333',
        padding: '10px',
        marginTop: '10px',
        borderRadius: '4px'
      };

      return (
        <div>
          <h3>2. useMemo Example</h3>
          <p>The "slow function" loops 100M times. useMemo caches the result.</p>
          
          <div className="card">
            <input 
              type="number" 
              value={number} 
              onChange={e => setNumber(parseInt(e.target.value))} 
              style={{padding: '5px', marginRight: '10px'}}
            />
            <button onClick={() => setDark(prev => !prev)}>Toggle Theme</button>
            
            <div style={themeStyles}>
              Double Number: {doubleNumber}
            </div>
            
            <p style={{fontSize: '0.9em', color: '#aaa', marginTop: '10px'}}>
              Open Console to see when "Calling slow function..." runs.
              <br/>
              Without useMemo, toggling theme would lag.
            </p>
          </div>
        </div>
      );
    }

    // --- 3. useCallback Example Components ---

    const List = memo(({ getItems }) => {
      const [items, setItems] = useState([]);

      useEffect(() => {
        setItems(getItems());
        
      }, [getItems]);

      return (
        <div className="card">
          {items.map(item => <div key={item}>{item}</div>)}
        </div>
      );
    });

    function UseCallbackExample() {
      const [number, setNumber] = useState(1);
      const [dark, setDark] = useState(false);

      // Without useCallback, this function is recreated on every render
      // causing the child (List) to re-render because the prop changed.
      const getItems = useCallback(() => {
        return [number, number + 1, number + 2];
      }, [number]);

      const theme = {
        backgroundColor: dark ? '#333' : '#FFF',
        color: dark ? '#FFF' : '#333'
      };

      return (
        <div style={theme}>
          <h3>3. useCallback Example</h3>
          <p>Prevents function recreation on re-renders.</p>
          
          <input 
            type="number" 
            value={number} 
            onChange={e => setNumber(parseInt(e.target.value))}
            style={{padding: '5px', marginRight: '10px'}}
          />
          <button onClick={() => setDark(prev => !prev)}>Toggle Theme</button>
          
          <List getItems={getItems} />
          
          <p style={{fontSize: '0.9em', color: '#aaa', marginTop: '10px'}}>
            Open Console. "Updating Items" only logs when number changes, not when theme changes.
          </p>
        </div>
      );
    }

    // --- Main App with Tabs ---

    function App() {
      const [activeTab, setActiveTab] = useState('memo');

      return (
        <div className="container">
          <div className="tabs">
            <button 
              className={activeTab === 'memo' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('memo')}
            >
              React.memo
            </button>
            <button 
              className={activeTab === 'useMemo' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('useMemo')}
            >
              useMemo
            </button>
            <button 
              className={activeTab === 'useCallback' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('useCallback')}
            >
              useCallback
            </button>
          </div>

          {activeTab === 'memo' && <MemoExample />}
          {activeTab === 'useMemo' && <UseMemoExample />}
          {activeTab === 'useCallback' && <UseCallbackExample />}
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">Understanding the Optimization Hooks</h3>
      
      <div class="mb-4">
        <h4 class="text-lg font-bold text-white mb-2">1. React.memo (Component Memoization)</h4>
        <p class="text-gray-300">
          Prevents a child component from re-rendering if its props haven't changed.
          In the example, the "Regular Child" re-renders even when we update unrelated state in the parent. The "Memoized Child" stays stable.
        </p>
      </div>

      <div class="mb-4">
        <h4 class="text-lg font-bold text-white mb-2">2. useMemo (Value Memoization)</h4>
        <p class="text-gray-300">
          Caches the result of an expensive function.
          In the example, calculating the "Double Number" is slow. <code>useMemo</code> ensures we only pay that cost when the input number changes, not when we toggle the theme.
        </p>
      </div>

      <div class="mb-4">
        <h4 class="text-lg font-bold text-white mb-2">3. useCallback (Function Memoization)</h4>
        <p class="text-gray-300">
          Caches a function definition between renders.
          This is critical when passing functions as props to memoized child components. Without it, the function is "new" on every render, breaking the child's memoization.
        </p>
      </div>
  `
};

export const module5Lesson5 = {
  title: '5.5 React Router for Navigation',
  duration: '45 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">5.5 React Router for Navigation</h2>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Introduction</h3>
      <p class="text-gray-300 mb-4">
        Modern web applications built with React are typically <strong>Single Page Applications (SPA)</strong>. In a single-page application, the entire application runs on one HTML page, and the content dynamically updates without refreshing the page.
      </p>
      <p class="text-gray-300 mb-4">
        However, users still expect navigation between different pages such as:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Home Page</li>
          <li>Products Page</li>
          <li>About Page</li>
          <li>Contact Page</li>
          <li>Profile Page</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        To handle navigation in React applications, developers use <strong>React Router</strong>.
        React Router enables navigation between different components while keeping the application as a single-page application.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is React Router?</h3>
      <p class="text-gray-300 mb-4">
        React Router is a routing library for React that allows developers to manage navigation and URL paths in a React application.
        It allows different components to be rendered depending on the URL path.
      </p>
      
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <p class="font-semibold mb-2">Example:</p>
        <pre class="text-sm">
/ → Home Page
/products → Products Page
/contact → Contact Page
/profile → Profile Page</pre>
      </div>
      <p class="text-gray-300 mb-4">
        Each URL corresponds to a specific component.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why React Router is Important</h3>
      <p class="text-gray-300 mb-4">
        Without React Router, React applications would require manual logic to switch between components.
      </p>
      <p class="text-gray-300 mb-4">React Router provides:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Clean URL structure</li>
        <li>Dynamic navigation</li>
        <li>Browser history management</li>
        <li>Route-based component rendering</li>
      </ul>
      <p class="text-gray-300 mb-4">
        It makes React applications behave like traditional multi-page websites while still being a single-page application.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Installing React Router</h3>
      <p class="text-gray-300 mb-4">
        React Router is installed using npm.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>npm install react-router-dom</code></pre>
      <p class="text-gray-300 mb-4">
        The <code>react-router-dom</code> package contains all routing utilities required for web applications.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Core Components of React Router</h3>
      
      <h4 class="text-lg font-semibold text-white mt-4 mb-2">1. BrowserRouter</h4>
      <p class="text-gray-300 mb-2">This component wraps the entire application and enables routing functionality.</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>&lt;BrowserRouter&gt;
   &lt;App /&gt;
&lt;/BrowserRouter&gt;</code></pre>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">2. Routes</h4>
      <p class="text-gray-300 mb-2">The Routes component acts as a container for all route definitions.</p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">3. Route</h4>
      <p class="text-gray-300 mb-2">The Route component defines which component should render for a specific path.</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>&lt;Route path="/about" element={&lt;About /&gt;} /&gt;</code></pre>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">4. Link</h4>
      <p class="text-gray-300 mb-2">The Link component is used for navigation between routes without refreshing the page.</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>&lt;Link to="/about"&gt;About&lt;/Link&gt;</code></pre>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Example Navigation Structure</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <pre class="text-sm">App
 ├── Navbar
 │      ├── Home Link
 │      ├── Products Link
 │      └── Contact Link
 └── Routes
        ├── Home Page
        ├── Products Page
        └── Contact Page</pre>
      </div>
      <p class="text-gray-300 mb-4">
        When users click a link, React Router changes the displayed component.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Advantages of React Router</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Enables smooth navigation without page refresh.</li>
        <li>Supports dynamic routing.</li>
        <li>Improves user experience.</li>
        <li>Maintains browser history.</li>
        <li>Enables scalable application architecture.</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Large web platforms like Netflix, Airbnb, and Shopify rely on similar routing techniques in their frontend architecture.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Best Practices</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Keep routes organized in a central location.</li>
        <li>Use separate files for each page component.</li>
        <li>Use <code>Link</code> instead of traditional <code>&lt;a&gt;</code> tags.</li>
        <li>Organize routes in a logical structure.</li>
      </ul>
      <p class="text-gray-300 mb-2">Example folder structure:</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300"><code>src
 ├── components
 ├── pages
 │     ├── Home.js
 │     ├── Products.js
 │     └── Contact.js
 ├── App.js
 └── index.js</code></pre>
  `,
  syntax: [
    {
      title: 'Installing React Router',
      content: 'npm install react-router-dom'
    },
    {
      title: 'Importing Router Components',
      content: 'import { BrowserRouter, Routes, Route, Link } from "react-router-dom";'
    },
    {
      title: 'Basic Routing Syntax',
      content: `<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
</BrowserRouter>`
    },
    {
      title: 'Navigation Links',
      content: `<Link to="/">Home</Link>
<Link to="/about">About</Link>
<Link to="/contact">Contact</Link>`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Router Example</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- React Router DOM (Version 6) -->
  <script src="https://unpkg.com/history@5/umd/history.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-router@6.3.0/umd/react-router.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-router-dom@6.3.0/umd/react-router-dom.development.js" crossorigin></script>
  
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 20px; }
    .nav-link { color: #00bceb; text-decoration: none; margin-right: 15px; font-weight: bold; }
    .nav-link:hover { text-decoration: underline; }
    .page-container { background: #222; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-top: 20px; }
    nav { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #333; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    // Destructuring from global objects
    const { HashRouter, Routes, Route, Link } = ReactRouterDOM;

    // Page Components
    function Home() {
      return (
        <div className="page-container">
          <h2>Welcome to Home Page</h2>
          <p>This is the main landing page of the application.</p>
        </div>
      );
    }

    function About() {
      return (
        <div className="page-container">
          <h2>About Us Page</h2>
          <p>We are learning React Router to build Single Page Applications.</p>
        </div>
      );
    }

    function Contact() {
      return (
        <div className="page-container">
          <h2>Contact Page</h2>
          <p>Contact us at example@email.com</p>
        </div>
      );
    }

    function App() {
      return (
        // Using HashRouter for this standalone example to work without server config
        <HashRouter>
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </HashRouter>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">How this works</h3>
      <p class="text-gray-300 mb-3">
        1. <strong>Router Setup:</strong> We wrap the entire application in <code>HashRouter</code> (similar to BrowserRouter but easier for standalone demos). This enables the routing context.
      </p>
      <p class="text-gray-300 mb-3">
        2. <strong>Navigation:</strong> The <code>&lt;nav&gt;</code> section contains <code>Link</code> components. Unlike standard anchor tags (<code>&lt;a&gt;</code>), these change the URL without reloading the page.
      </p>
      <p class="text-gray-300 mb-3">
        3. <strong>Route Definitions:</strong> The <code>Routes</code> container holds individual <code>Route</code> definitions.
        <ul>
          <li>Path <code>"/"</code> renders the <strong>Home</strong> component.</li>
          <li>Path <code>"/about"</code> renders the <strong>About</strong> component.</li>
          <li>Path <code>"/contact"</code> renders the <strong>Contact</strong> component.</li>
        </ul>
      </p>
      <p class="text-gray-300">
        As you click the links, notice that the content below the navigation bar updates instantly, and the page does not flash or reload. This is the power of client-side routing.
      </p>
    `
};

export const module5Lesson6 = {
  title: '5.6 API Integration using Fetch and Axios',
  duration: '45 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">5.6 API Integration using Fetch and Axios</h2>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Introduction</h3>
      <p class="text-gray-300 mb-4">
        Modern web applications rarely work with static data. Instead, they communicate with backend servers and APIs to retrieve and store information.
      </p>
      <p class="text-gray-300 mb-4">
        For example:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Social media platforms fetch posts from servers</li>
          <li>E-commerce websites retrieve product lists from databases</li>
          <li>Weather apps fetch weather data from external APIs</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Applications built with React communicate with servers using HTTP requests.
        These requests are usually made to <strong>REST APIs</strong>, which allow applications to exchange data with backend systems.
      </p>
      <p class="text-gray-300 mb-4">
        In React applications, developers commonly use two methods to interact with APIs:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li><strong>Fetch API</strong></li>
          <li><strong>Axios</strong></li>
        </ul>
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is an API?</h3>
      <p class="text-gray-300 mb-4">
        An API (Application Programming Interface) is a system that allows different software applications to communicate with each other.
      </p>
      
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200">
        <p class="font-semibold mb-2">Example workflow:</p>
        <pre class="text-sm">
React Application → API Request → Backend Server → Database
                                         ↓
                                    Response Data</pre>
      </div>
      <p class="text-gray-300 mb-4">
        The server processes the request and sends data back to the frontend application.
        This data is usually returned in <strong>JSON</strong> format.
      </p>
      <p class="text-gray-300 mb-2">Example response:</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>{
  "id": 1,
  "name": "Laptop",
  "price": 50000
}</code></pre>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Fetch API</h3>
      <p class="text-gray-300 mb-4">
        The Fetch API is a built-in browser feature used to make HTTP requests.
        It allows developers to retrieve data from servers without installing any external libraries.
      </p>
      <p class="text-gray-300 mb-4">Advantages:</p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Built directly into browsers</li>
        <li>No additional installation required</li>
        <li>Supports promises for asynchronous operations</li>
      </ul>
      <p class="text-gray-300 mb-4">
        However, Fetch requires more configuration compared to Axios.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Axios Library</h3>
      <p class="text-gray-300 mb-4">
        Axios is a popular HTTP client used for making API requests in frontend applications.
      </p>
      <p class="text-gray-300 mb-4">
        Axios simplifies API communication and provides additional features such as:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Automatic JSON transformation</li>
        <li>Request and response interception</li>
        <li>Better error handling</li>
        <li>Cleaner syntax</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Many modern applications prefer Axios due to its simplicity.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Types of API Requests</h3>
      <p class="text-gray-300 mb-4">Common HTTP request methods include:</p>
      <table class="w-full text-left border-collapse text-gray-300 mb-4">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="py-2 px-4 font-semibold text-white">Method</th>
            <th class="py-2 px-4 font-semibold text-white">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-800">
            <td class="py-2 px-4">GET</td>
            <td class="py-2 px-4">Retrieve data from server</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2 px-4">POST</td>
            <td class="py-2 px-4">Send data to server</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2 px-4">PUT</td>
            <td class="py-2 px-4">Update existing data</td>
          </tr>
          <tr>
            <td class="py-2 px-4">DELETE</td>
            <td class="py-2 px-4">Remove data from server</td>
          </tr>
        </tbody>
      </table>
      <p class="text-gray-300 mb-2">Example:</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>GET /products
POST /users
DELETE /orders/10</code></pre>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">API Integration Workflow in React</h3>
      <p class="text-gray-300 mb-4">The general workflow for API integration is:</p>
      <ol class="list-decimal list-inside text-gray-300 space-y-1 mb-4">
        <li>Component loads</li>
        <li>API request is sent</li>
        <li>Server processes request</li>
        <li>Response data is returned</li>
        <li>React updates the UI</li>
      </ol>
      <p class="text-gray-300 mb-4">
        This process is usually implemented using the <code>useEffect</code> hook.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Real World Example</h3>
      <p class="text-gray-300 mb-4">
        Consider an online product store. When the user opens the product page:
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>React sends a request to the API</li>
        <li>The server returns product data</li>
        <li>React displays the products on the page</li>
      </ul>
      <p class="text-gray-300 mb-4">
        Many modern applications such as Amazon, Flipkart, and Spotify rely heavily on API communication to deliver dynamic content.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Best Practices</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Always handle API errors.</li>
        <li>Use loading states while fetching data.</li>
        <li>Avoid excessive API calls.</li>
        <li>Store API URLs in configuration files.</li>
        <li>Use Axios for complex API interactions.</li>
      </ul>
      <p class="text-gray-300 mb-2">Example project structure:</p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300"><code>src
 ├── api
 │     └── apiService.js
 ├── components
 ├── pages
 └── App.js</code></pre>
  `,
  syntax: [
    {
      title: 'Fetch API Syntax',
      content: `fetch("API_URL")
  .then(response => response.json())
  .then(data => {
    
  })
  .catch(error => {
    
  });`
    },
    {
      title: 'Fetch API with useEffect',
      content: `import { useEffect, useState } from "react";

function Component() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetch("API_URL")
      .then(response => response.json())
      .then(data => setData(data));

  }, []);

}`
    },
    {
      title: 'Installing Axios',
      content: 'npm install axios'
    },
    {
      title: 'Axios GET Request',
      content: `import axios from "axios";

axios.get("API_URL")
  .then(response => {
    
  });`
    },
    {
      title: 'Axios POST Request',
      content: `axios.post("API_URL", {
  name: "Product",
  price: 500
});`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Fetch Example</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Axios CDN -->
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 20px; }
    .card { background: #222; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px; }
    .product-title { font-weight: bold; font-size: 1.1em; color: #00bceb; }
    .product-price { color: #4ade80; font-weight: bold; margin-top: 5px; }
    .loading { color: #aaa; font-style: italic; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    function App() {
      const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        // Fetching data from FakeStoreAPI
        fetch("https://fakestoreapi.com/products?limit=5")
          .then(response => response.json())
          .then(data => {
            setProducts(data);
            setLoading(false);
          })
          .catch(error => {
            
            setLoading(false);
          });
          
        /* 
         * Axios Example (Equivalent):
         * 
         * axios.get("https://fakestoreapi.com/products?limit=5")
         *   .then(response => {
         *     setProducts(response.data);
         *     setLoading(false);
         *   });
         */
      }, []);

      return (
        <div>
          <h1>Product List</h1>
          <p style={{color: '#aaa', marginBottom: '20px'}}>Fetching data from fakestoreapi.com...</p>

          {loading ? (
            <p className="loading">Loading products...</p>
          ) : (
            <div>
              {products.map(product => (
                <div key={product.id} className="card">
                  <div className="product-title">{product.title}</div>
                  <div className="product-price">Price: \${product.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">How this works</h3>
      <p class="text-gray-300 mb-3">
        1. <strong>State Management:</strong> We use <code>useState</code> to store the list of <code>products</code> and a <code>loading</code> state to show a loading message while data is being fetched.
      </p>
      <p class="text-gray-300 mb-3">
        2. <strong>Fetching Data:</strong> Inside <code>useEffect</code>, we call <code>fetch()</code> to get data from the public API <code>fakestoreapi.com</code>.
        The <code>useEffect</code> hook with an empty dependency array <code>[]</code> ensures the request runs only once when the component mounts.
      </p>
      <p class="text-gray-300 mb-3">
        3. <strong>Updating UI:</strong> Once the data is received, we convert it to JSON and update the <code>products</code> state. This triggers a re-render, displaying the list of products.
      </p>
      <p class="text-gray-300">
        Note: The commented-out code shows how the same request would look using <strong>Axios</strong>. Axios automatically handles JSON conversion (<code>response.data</code>), making the syntax slightly cleaner.
      </p>
    `
};

export const module5Lesson9 = {
  title: '5.9 Professional React Project Structure',
  duration: '45 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">5.9 Professional React Project Structure</h2>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Introduction</h3>
      <p class="text-gray-300 mb-4">
        As applications built with React grow in size and complexity, organizing the project properly becomes extremely important.
        A poorly structured project can lead to:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>Difficult code maintenance</li>
        <li>Confusing file organization</li>
        <li>Hard collaboration among developers</li>
        <li>Increased debugging time</li>
      </ul>
      <p class="text-gray-300 mb-4">
        To solve this problem, professional development teams follow standard project structures that organize files based on their purpose.
        Large companies such as Netflix, Airbnb, and Meta organize React applications into well-defined folders to ensure scalability and maintainability.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Why Project Structure is Important</h3>
      <p class="text-gray-300 mb-4">
        A good project structure helps developers:
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li>Quickly locate files</li>
        <li>Improve team collaboration</li>
        <li>Maintain clean code</li>
        <li>Scale applications easily</li>
        <li>Separate concerns within the application</li>
      </ul>
      <p class="text-gray-300 mb-4">
        For example, UI components should be separate from API logic and configuration files.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Basic React Project Structure</h3>
      <p class="text-gray-300 mb-4">
        A simple React application created using tools like Vite or Create React App typically contains the following structure:
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>project-name
├── node_modules
├── public
│   └── index.html
├── src
│   ├── App.js
│   ├── main.js
│   └── index.css
├── package.json
└── vite.config.js</code></pre>
      <p class="text-gray-300 mb-4">
        However, this structure is not suitable for large applications.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Professional React Project Structure</h3>
      <p class="text-gray-300 mb-4">
        Professional React applications organize files into multiple folders based on functionality.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>src
├── assets
│   ├── images
│   └── styles
├── components
│   ├── Navbar
│   ├── Footer
│   └── ProductCard
├── pages
│   ├── Home
│   ├── Products
│   └── Profile
├── hooks
│   └── useAuth.js
├── context
│   └── UserContext.js
├── services
│   └── apiService.js
├── utils
│   └── helpers.js
├── App.js
└── main.js</code></pre>
      <p class="text-gray-300 mb-4">
        Each folder has a specific responsibility.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Folder Explanation</h3>
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-white">assets</h4>
          <p class="text-gray-300">Stores static files such as:</p>
          <ul class="list-disc list-inside text-gray-300">
            <li>Images</li>
            <li>Fonts</li>
            <li>Global styles</li>
          </ul>
          <p class="text-sm text-gray-400 mt-1">Example: <code>assets/images/logo.png</code>, <code>assets/styles/global.css</code></p>
        </div>
        <div>
          <h4 class="font-bold text-white">components</h4>
          <p class="text-gray-300">Reusable UI components used across the application.</p>
          <p class="text-sm text-gray-400 mt-1">Examples: Navbar, Footer, ProductCard, Button</p>
          <p class="text-gray-300">These components are usually small and reusable.</p>
        </div>
        <div>
          <h4 class="font-bold text-white">pages</h4>
          <p class="text-gray-300">Contains major application pages.</p>
          <p class="text-sm text-gray-400 mt-1">Examples: Home Page, Products Page, Dashboard, Login Page</p>
          <p class="text-gray-300">Each page typically combines multiple components.</p>
        </div>
        <div>
          <h4 class="font-bold text-white">hooks</h4>
          <p class="text-gray-300">Contains custom React hooks created for reusable logic.</p>
          <p class="text-sm text-gray-400 mt-1">Example: <code>useAuth.js</code>, <code>useFetch.js</code>, <code>useTheme.js</code></p>
        </div>
        <div>
          <h4 class="font-bold text-white">context</h4>
          <p class="text-gray-300">Stores global state management files using React Context API.</p>
          <p class="text-sm text-gray-400 mt-1">Example: <code>UserContext.js</code>, <code>ThemeContext.js</code></p>
        </div>
        <div>
          <h4 class="font-bold text-white">services</h4>
          <p class="text-gray-300">Contains files responsible for API communication.</p>
          <p class="text-sm text-gray-400 mt-1">Example: <code>apiService.js</code>, <code>authService.js</code></p>
          <p class="text-gray-300">These files handle requests using tools such as Axios.</p>
        </div>
        <div>
          <h4 class="font-bold text-white">utils</h4>
          <p class="text-gray-300">Utility functions used throughout the application.</p>
          <p class="text-sm text-gray-400 mt-1">Examples: <code>dateFormatter.js</code>, <code>validation.js</code>, <code>helperFunctions.js</code></p>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Example Workflow in a React Application</h3>
      <div class="bg-[#111827] border border-[#1f2937] rounded-lg p-4 mb-4 text-gray-200 text-center">
        <p>User Clicks Button</p>
        <p>↓</p>
        <p>Component Handles Event</p>
        <p>↓</p>
        <p>API Request Sent via Service</p>
        <p>↓</p>
        <p>Server Returns Data</p>
        <p>↓</p>
        <p>React Updates UI</p>
      </div>
      <p class="text-gray-300 mb-4">
        Each part of the application is handled by a specific folder, making the system organized and scalable.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Best Practices for Professional React Projects</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Separate components and pages.</li>
        <li>Use meaningful folder names.</li>
        <li>Avoid placing too many files in one folder.</li>
        <li>Use reusable components wherever possible.</li>
        <li>Keep business logic separate from UI components.</li>
        <li>Use environment variables for configuration.</li>
      </ul>
  `,
  syntax: [
    {
      title: 'Example Component File Structure',
      content: `components
└── Navbar
    ├── Navbar.jsx
    └── Navbar.css`
    },
    {
      title: 'Importing Components',
      content: `import Navbar from "./components/Navbar/Navbar";`
    },
    {
      title: 'Example API Service',
      content: `import axios from "axios";

export const getProducts = () => {
  return axios.get("/api/products");
};`
    },
    {
      title: 'Example Custom Hook',
      content: `import { useState } from "react";

function useCounter() {
  const [count, setCount] = useState(0);
  return { count, setCount };
}

export default useCounter;`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Project Structure</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #222; padding: 20px; border-radius: 8px; border: 1px solid #333; }
    h1 { color: #00bceb; text-align: center; }
    h2 { color: #4ade80; border-bottom: 1px solid #333; padding-bottom: 10px; margin-top: 0; }
    .folder { color: #fbbf24; font-family: monospace; font-weight: bold; margin-bottom: 5px; }
    .file { color: #ddd; font-family: monospace; margin-left: 20px; }
    .component-box { border: 1px dashed #555; padding: 10px; margin-bottom: 10px; border-radius: 4px; }
    .label { font-size: 0.8em; color: #aaa; margin-bottom: 5px; display: block; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    // --- Mocking File Structure ---

    // 1. components/Header.js
    function Header() {
      return (
        <div className="component-box" style={{borderColor: '#00bceb'}}>
          <span className="label">components/Header.js</span>
          <h1>My React Application</h1>
        </div>
      );
    }

    // 2. pages/Home.js
    function Home() {
      return (
        <div className="component-box" style={{borderColor: '#4ade80'}}>
          <span className="label">pages/Home.js</span>
          <Header />
          <h2 style={{color: 'white', fontSize: '1.2em', marginTop: '10px'}}>Welcome to the Home Page</h2>
          <p>This page uses the Header component.</p>
        </div>
      );
    }

    // 3. App.js
    function App() {
      return (
        <div className="container">
          <div className="component-box" style={{borderColor: '#fbbf24'}}>
            <span className="label">App.js</span>
            <Home />
          </div>
          
          <div style={{marginTop: '30px', borderTop: '1px solid #333', paddingTop: '20px'}}>
            <h3>Project Structure Visualization</h3>
            <div className="folder">src/</div>
            <div className="folder" style={{marginLeft: '20px'}}>components/</div>
            <div className="file">Header.js</div>
            <div className="folder" style={{marginLeft: '20px'}}>pages/</div>
            <div className="file">Home.js</div>
            <div className="file">App.js</div>
            <div className="file">main.js</div>
          </div>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">Project Structure Breakdown</h3>
      <p class="text-gray-300 mb-3">
        This example demonstrates how a professional React project is structured by separating components and pages.
      </p>
      <ul class="list-disc list-inside text-gray-300 mb-4">
        <li><strong>components/Header.js</strong>: A reusable UI component that displays the application title. It is isolated and can be used in multiple pages.</li>
        <li><strong>pages/Home.js</strong>: A page component that represents a full view. It imports and uses the <code>Header</code> component.</li>
        <li><strong>App.js</strong>: The main entry point that renders the <code>Home</code> page.</li>
      </ul>
      <p class="text-gray-300">
        The visual output shows the hierarchy: App renders Home, and Home renders Header. The folder structure visualization at the bottom reinforces where each file would reside in a real project.
      </p>
    `
};

export const module6Lesson1 = {
  title: '6.1 Angular Architecture and Ecosystem',
  duration: '60 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">6.1 Angular Architecture and Ecosystem</h2>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Introduction</h3>
      <p class="text-gray-300 mb-4">
        Angular is a powerful frontend framework used to build large-scale, enterprise-level web applications.
      </p>
      <p class="text-gray-300 mb-4">
        It is developed and maintained by Google and is widely used for building complex applications such as dashboards, enterprise management systems, and large e-commerce platforms.
      </p>
      <p class="text-gray-300 mb-4">
        Unlike simple JavaScript libraries, Angular is a complete framework that provides everything required to build modern web applications, including:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Component-based architecture</li>
          <li>Routing system</li>
          <li>Form handling</li>
          <li>Dependency injection</li>
          <li>HTTP communication</li>
          <li>Testing tools</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Angular applications are written using <strong>TypeScript</strong>, which adds strong typing and advanced features to JavaScript.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is Angular Architecture?</h3>
      <p class="text-gray-300 mb-4">
        Angular follows a modular architecture where the application is divided into smaller parts called modules and components.
      </p>
      <p class="text-gray-300 mb-4">
        This architecture helps developers:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Organize large applications</li>
          <li>Improve maintainability</li>
          <li>Enable team collaboration</li>
          <li>Build scalable systems</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        The core building blocks of Angular architecture include:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Modules</li>
          <li>Components</li>
          <li>Templates</li>
          <li>Services</li>
          <li>Dependency Injection</li>
          <li>Routing</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Each part plays an important role in the application structure.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Core Building Blocks of Angular</h3>
      
      <h4 class="text-lg font-semibold text-white mt-4 mb-2">1. Modules</h4>
      <p class="text-gray-300 mb-2">
        Modules are containers that organize related components and services.
        Every Angular application contains a root module, usually called <strong>AppModule</strong>.
      </p>
      <p class="text-gray-300 mb-2">
        Modules help divide large applications into smaller logical sections.
      </p>
      <p class="text-gray-300 mb-4">
        Example modules: User Module, Product Module, Admin Module.
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">2. Components</h4>
      <p class="text-gray-300 mb-2">
        Components are the core UI building blocks of Angular applications.
        Each component consists of:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Component Class</li>
          <li>HTML Template</li>
          <li>CSS Styles</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Example: UserComponent, ProductComponent, DashboardComponent.
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">3. Templates</h4>
      <p class="text-gray-300 mb-2">
        Templates define the HTML structure of the component.
        Angular templates support special syntax for:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Data binding</li>
          <li>Event handling</li>
          <li>Conditional rendering</li>
          <li>Loops</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Example: <code>&lt;h1&gt;{{ title }}&lt;/h1&gt;</code>
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">4. Services</h4>
      <p class="text-gray-300 mb-2">
        Services are used to share logic and data across multiple components.
        Common uses of services:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>API communication</li>
          <li>Authentication</li>
          <li>Data management</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Example: UserService, AuthService, ProductService.
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">5. Dependency Injection</h4>
      <p class="text-gray-300 mb-2">
        Angular uses a design pattern called Dependency Injection (DI).
        This allows components to receive services automatically instead of creating them manually.
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>constructor(private userService: UserService) {}</code></pre>
      <p class="text-gray-300 mb-4">
        Benefits of dependency injection:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Better code reusability</li>
          <li>Easier testing</li>
          <li>Loose coupling between components</li>
        </ul>
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Angular Ecosystem</h3>
      <p class="text-gray-300 mb-4">
        Angular provides a complete ecosystem that supports full application development.
      </p>
      <table class="w-full text-left border-collapse text-gray-300 mb-4">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="py-2 px-4 font-semibold text-white">Tool</th>
            <th class="py-2 px-4 font-semibold text-white">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-800">
            <td class="py-2 px-4">Angular CLI</td>
            <td class="py-2 px-4">Project creation and management</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2 px-4">RxJS</td>
            <td class="py-2 px-4">Handling asynchronous data</td>
          </tr>
          <tr class="border-b border-gray-800">
            <td class="py-2 px-4">Angular Material</td>
            <td class="py-2 px-4">Ready-to-use UI components</td>
          </tr>
          <tr>
            <td class="py-2 px-4">Node.js</td>
            <td class="py-2 px-4">Development environment</td>
          </tr>
        </tbody>
      </table>
      <p class="text-gray-300 mb-4">
        These tools make Angular suitable for enterprise-grade applications.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Angular Application Structure</h3>
      <p class="text-gray-300 mb-4">
        A typical Angular project looks like this:
      </p>
      <pre class="bg-[#111827] p-2 rounded text-gray-300 mb-4"><code>project-name
 ├── node_modules
 ├── src
 │     ├── app
 │     │     ├── components
 │     │     ├── services
 │     │     ├── app.component.ts
 │     │     └── app.module.ts
 │     ├── assets
 │     ├── environments
 │     └── index.html
 ├── angular.json
 ├── package.json
 └── tsconfig.json</code></pre>
      <p class="text-gray-300 mb-4">
        The <code>src/app</code> folder contains the main application logic.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Real-World Use of Angular</h3>
      <p class="text-gray-300 mb-4">
        Angular is widely used for enterprise-level web applications because of its structured architecture.
        Companies using Angular include: Microsoft, PayPal, Upwork.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Advantages of Angular</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
        <li>Complete full-featured framework</li>
        <li>Strong architecture for large projects</li>
        <li>Type safety using TypeScript</li>
        <li>Built-in tools for testing and routing</li>
        <li>Excellent support for enterprise applications</li>
      </ul>
  `,
  syntax: [
    {
      title: 'Basic Angular Component Structure',
      content: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello Angular</h1>'
})

export class AppComponent {
}`
    },
    {
      title: 'Component with Template File',
      content: `@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})`
    },
    {
      title: 'Service Example',
      content: `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  getUsers() {
    return ["User1", "User2"];
  }

}`
    },
    {
      title: 'Dependency Injection Example',
      content: `constructor(private userService: UserService) {}`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angular Component Example</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #222; padding: 20px; border-radius: 8px; border: 1px solid #333; }
    h1 { color: #dd0031; /* Angular Red */ }
    .code-box { background: #111827; padding: 15px; border-radius: 4px; font-family: monospace; color: #ddd; margin-top: 20px; border: 1px solid #333; }
    .output-box { background: #fff; color: #000; padding: 20px; border-radius: 4px; margin-top: 20px; }
    .keyword { color: #c586c0; }
    .string { color: #ce9178; }
    .class-name { color: #4ec9b0; }
  </style>
</head>
<body>
  <div class="container">
    <div id="app-root">
      <!-- Simulated Output -->
      <h1>Welcome to Angular</h1>
      <p>Angular Architecture Example</p>
    </div>

    <div style="margin-top: 30px; border-top: 1px solid #333; padding-top: 20px;">
      <h3 style="color: #aaa;">Source Code (app.component.ts)</h3>
      <div class="code-box">
        <div><span class="keyword">import</span> { Component } <span class="keyword">from</span> <span class="string">'@angular/core'</span>;</div>
        <br>
        <div>@Component({</div>
        <div style="padding-left: 20px;">selector: <span class="string">'app-root'</span>,</div>
        <div style="padding-left: 20px;">template: <span class="string">\`</span></div>
        <div style="padding-left: 40px;"><span class="string">&lt;h1&gt;Welcome to Angular&lt;/h1&gt;</span></div>
        <div style="padding-left: 40px;"><span class="string">&lt;p&gt;{{ message }}&lt;/p&gt;</span></div>
        <div style="padding-left: 20px;"><span class="string">\`</span></div>
        <div>})</div>
        <br>
        <div><span class="keyword">export class</span> <span class="class-name">AppComponent</span> {</div>
        <br>
        <div style="padding-left: 20px;">message = <span class="string">"Angular Architecture Example"</span>;</div>
        <br>
        <div>}</div>
      </div>
      
      <p style="color: #888; font-size: 0.9em; margin-top: 20px;">
        * Note: This is a simulation of the Angular component output. Angular applications require a build step (Angular CLI) to run in the browser.
      </p>
    </div>
  </div>
</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">How Angular Components Work</h3>
      <p class="text-gray-300 mb-3">
        1. <strong>Component Decorator:</strong> The <code>@Component</code> decorator marks the class as an Angular component and provides metadata like the selector and template.
      </p>
      <p class="text-gray-300 mb-3">
        2. <strong>Template:</strong> The <code>template</code> defines the HTML view. It uses double curly braces <code>{{ }}</code> for data binding.
      </p>
      <p class="text-gray-300 mb-3">
        3. <strong>Class:</strong> The <code>AppComponent</code> class contains the logic and data (state). In this example, the <code>message</code> property is bound to the template.
      </p>
      <p class="text-gray-300">
        When the application runs, Angular replaces the <code>&lt;app-root&gt;</code> tag in <code>index.html</code> with the component's template, substituting <code>{{ message }}</code> with the actual value "Angular Architecture Example".
      </p>
  `
};

export const module6Lesson2 = {
  title: '6.2 Angular Project Setup and CLI',
  duration: '60 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">6.2 Angular Project Setup and CLI</h2>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Introduction</h3>
      <p class="text-gray-300 mb-4">
        To develop applications using Angular, developers require a proper development environment and tools that simplify project creation and management.
      </p>
      <p class="text-gray-300 mb-4">
        Angular provides an official tool called <strong>Angular CLI</strong>.
      </p>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is Angular CLI?</h3>
      <p class="text-gray-300 mb-4">
        Angular CLI is a command-line tool that helps developers:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Create Angular projects</li>
          <li>Generate components and services</li>
          <li>Run development servers</li>
          <li>Build applications for production</li>
          <li>Manage project configuration</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        This tool significantly speeds up development and ensures that projects follow a standard structure.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Prerequisites for Angular Development</h3>
      <p class="text-gray-300 mb-4">
        Before installing Angular, developers must install some basic software.
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">1. Node.js</h4>
      <p class="text-gray-300 mb-4">
        Angular applications require Node.js. Node.js allows developers to run JavaScript outside the browser and manage project dependencies.
      </p>
      <p class="text-gray-300 mb-4">
        <strong>Installation steps:</strong>
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Visit the Node.js website.</li>
          <li>Download the LTS (Long Term Support) version.</li>
          <li>Install it on your system.</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        After installation, verify using:
        <code class="block bg-gray-800 p-2 rounded mt-2">node -v</code>
      </p>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">2. npm (Node Package Manager)</h4>
      <p class="text-gray-300 mb-4">
        npm is automatically installed with Node.js. It is used to install packages required for Angular development.
      </p>
      <p class="text-gray-300 mb-4">
        Check npm installation:
        <code class="block bg-gray-800 p-2 rounded mt-2">npm -v</code>
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Installing Angular CLI</h3>
      <p class="text-gray-300 mb-4">
        Once Node.js is installed, Angular CLI can be installed globally using npm.
      </p>
      <div class="bg-gray-800 p-3 rounded mb-4 font-mono text-sm text-green-400">
        npm install -g @angular/cli
      </div>
      <p class="text-gray-300 mb-4">
        The <code>-g</code> flag installs the CLI globally so it can be used from any directory.
      </p>
      <p class="text-gray-300 mb-4">
        After installation, verify using:
        <code class="block bg-gray-800 p-2 rounded mt-2">ng version</code>
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Creating a New Angular Project</h3>
      <p class="text-gray-300 mb-4">
        Angular CLI provides a command to create a new project.
      </p>
      <div class="bg-gray-800 p-3 rounded mb-4 font-mono text-sm text-green-400">
        ng new project-name
      </div>
      <p class="text-gray-300 mb-4">
        Example:
        <code class="block bg-gray-800 p-2 rounded mt-2">ng new my-angular-app</code>
      </p>
      <p class="text-gray-300 mb-4">
        During project creation, the CLI may ask configuration questions such as:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Whether to enable routing</li>
          <li>Which stylesheet format to use (CSS, SCSS, etc.)</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Once the setup is completed, Angular generates the full project structure automatically.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Angular Project Folder Structure</h3>
      <p class="text-gray-300 mb-4">
        A newly created Angular project contains several important folders.
      </p>
      <pre class="bg-gray-800 p-4 rounded mb-4 text-sm text-gray-300 overflow-x-auto">
my-angular-app
 ├── node_modules
 ├── src
 │     ├── app
 │     │     ├── app.component.ts
 │     │     ├── app.component.html
 │     │     ├── app.component.css
 │     │     └── app.module.ts
 │     ├── assets
 │     ├── environments
 │     └── index.html
 ├── angular.json
 ├── package.json
 └── tsconfig.json</pre>
      
      <h4 class="text-lg font-semibold text-white mt-4 mb-2">Important Folders</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="p-2 border-b border-gray-700 text-white">Folder/File</th>
              <th class="p-2 border-b border-gray-700 text-white">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border-b border-gray-800 text-green-400 font-mono">src</td>
              <td class="p-2 border-b border-gray-800 text-gray-300">Main application source code</td>
            </tr>
            <tr>
              <td class="p-2 border-b border-gray-800 text-green-400 font-mono">app</td>
              <td class="p-2 border-b border-gray-800 text-gray-300">Core Angular components and modules</td>
            </tr>
            <tr>
              <td class="p-2 border-b border-gray-800 text-green-400 font-mono">assets</td>
              <td class="p-2 border-b border-gray-800 text-gray-300">Images and static files</td>
            </tr>
            <tr>
              <td class="p-2 border-b border-gray-800 text-green-400 font-mono">node_modules</td>
              <td class="p-2 border-b border-gray-800 text-gray-300">Installed dependencies</td>
            </tr>
            <tr>
              <td class="p-2 border-b border-gray-800 text-green-400 font-mono">angular.json</td>
              <td class="p-2 border-b border-gray-800 text-gray-300">Angular project configuration</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Running Angular Application</h3>
      <p class="text-gray-300 mb-4">
        To start the Angular development server, navigate to the project folder and run:
      </p>
      <div class="bg-gray-800 p-3 rounded mb-4 font-mono text-sm text-green-400">
        ng serve
      </div>
      <p class="text-gray-300 mb-4">
        This command:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>Compiles the Angular application</li>
          <li>Starts a development server</li>
          <li>Automatically reloads the browser when code changes</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        By default, the application runs at: <a href="http://localhost:4200" class="text-blue-400 hover:underline">http://localhost:4200</a>
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Generating Angular Components</h3>
      <p class="text-gray-300 mb-4">
        Angular CLI can automatically generate components.
      </p>
      <div class="bg-gray-800 p-3 rounded mb-4 font-mono text-sm text-green-400">
        ng generate component component-name
      </div>
      <p class="text-gray-300 mb-4">
        Shortcut command:
        <code class="block bg-gray-800 p-2 rounded mt-2">ng g c component-name</code>
      </p>
      <p class="text-gray-300 mb-4">
        This command creates:
        <ul class="list-disc list-inside ml-4 mt-2 font-mono text-sm text-green-400">
          <li>component-name.component.ts</li>
          <li>component-name.component.html</li>
          <li>component-name.component.css</li>
          <li>component-name.component.spec.ts</li>
        </ul>
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Advantages of Angular CLI</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-2">
        <li><strong>Automatic project setup:</strong> Sets up the environment with one command.</li>
        <li><strong>Standardized project structure:</strong> Ensures all developers follow the same folder structure.</li>
        <li><strong>Faster development workflow:</strong> Automates repetitive tasks like creating components.</li>
        <li><strong>Built-in development server:</strong> Provides live reloading.</li>
        <li><strong>Easy code generation:</strong> Generates boilerplate code instantly.</li>
      </ul>
      <p class="text-gray-300 mt-4">
        Many enterprise applications built by companies like Microsoft, PayPal, and Forbes use Angular CLI for efficient development.
      </p>
  `,
  syntax: [
    {
      title: 'Install Angular CLI',
      content: `npm install -g @angular/cli`
    },
    {
      title: 'Create Angular Project',
      content: `ng new project-name`
    },
    {
      title: 'Run Angular Application',
      content: `ng serve`
    },
    {
      title: 'Generate Component',
      content: `ng generate component component-name
# OR
ng g c component-name`
    },
    {
      title: 'Build Application for Production',
      content: `ng build`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angular CLI Simulation</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .terminal-window {
      background: #1e1e1e;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      font-family: 'Consolas', 'Monaco', monospace;
      overflow: hidden;
      border: 1px solid #333;
    }
    .terminal-header {
      background: #2d2d2d;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #333;
    }
    .dots { display: flex; gap: 6px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .red { background: #ff5f56; }
    .yellow { background: #ffbd2e; }
    .green { background: #27c93f; }
    .title { flex: 1; text-align: center; color: #999; font-size: 12px; }
    .terminal-body { padding: 16px; color: #d4d4d4; font-size: 14px; line-height: 1.5; }
    .prompt { color: #27c93f; font-weight: bold; }
    .path { color: #569cd6; font-weight: bold; }
    .branch { color: #f1fa8c; }
    .cmd { color: #fff; }
    .output { color: #a0a0a0; margin-bottom: 12px; display: block; }
    .success { color: #50fa7b; }
    .browser-window {
      margin-top: 30px;
      background: #fff;
      border-radius: 6px;
      overflow: hidden;
      color: #000;
    }
    .browser-header {
      background: #e0e0e0;
      padding: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #ccc;
    }
    .url-bar {
      background: #fff;
      flex: 1;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 13px;
      color: #555;
      border: 1px solid #ccc;
    }
    .browser-content { padding: 40px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h2 style="margin-bottom: 20px; color: #ddd;">Terminal Simulation</h2>
    
    <div class="terminal-window">
      <div class="terminal-header">
        <div class="dots">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
        </div>
        <div class="title">bash — 80x24</div>
      </div>
      <div class="terminal-body">
        <div><span class="prompt">➜</span> <span class="path">~</span> <span class="cmd">npm install -g @angular/cli</span></div>
        <div class="output">
          changed 196 packages, and audited 197 packages in 2s<br>
          found 0 vulnerabilities
        </div>
        
        <div><span class="prompt">➜</span> <span class="path">~</span> <span class="cmd">ng new angular-demo</span></div>
        <div class="output">
          ? Would you like to add Angular routing? Yes<br>
          ? Which stylesheet format would you like to use? CSS<br>
          CREATE angular-demo/angular.json (3074 bytes)<br>
          CREATE angular-demo/package.json (1074 bytes)<br>
          ...<br>
          <span class="success">✔ Packages installed successfully.</span>
        </div>

        <div><span class="prompt">➜</span> <span class="path">~</span> <span class="cmd">cd angular-demo</span></div>
        <div><span class="prompt">➜</span> <span class="path">angular-demo</span> <span class="branch">(master)</span> <span class="cmd">ng serve</span></div>
        <div class="output">
          Initial Chunk Files | Names         |  Raw Size<br>
          vendor.js           | vendor        |   2.11 MB<br>
          polyfills.js        | polyfills     | 314.28 kB<br>
          styles.css          | styles        | 209.43 kB<br>
          main.js             | main          |  48.33 kB<br>
          runtime.js          | runtime       |   6.52 kB<br>
          <br>
          Build at: 2023-10-27T10:30:00.000Z - Hash: a1b2c3d4e5f6<br>
          <span class="success">** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **</span>
        </div>
      </div>
    </div>

    <h2 style="margin: 40px 0 20px 0; color: #ddd;">Browser Preview</h2>
    <div class="browser-window">
      <div class="browser-header">
        <div class="dots">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
        </div>
        <div class="url-bar">http://localhost:4200</div>
      </div>
      <div class="browser-content">
        <h1 style="color: #333;">Welcome to angular-demo</h1>
        <p style="color: #666;">This confirms that the Angular project is successfully created and running.</p>
        <div style="margin-top: 20px;">
          <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="Angular Logo" width="60" style="opacity: 0.8;">
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">Understanding the Workflow</h3>
      <p class="text-gray-300 mb-3">
        1. <strong>Installation:</strong> We installed the Angular CLI globally using <code>npm install -g @angular/cli</code>. This gives us access to the <code>ng</code> command anywhere on our system.
      </p>
      <p class="text-gray-300 mb-3">
        2. <strong>Project Creation:</strong> The <code>ng new</code> command scaffolded a complete project structure, including configuration files, dependencies, and initial components.
      </p>
      <p class="text-gray-300 mb-3">
        3. <strong>Development Server:</strong> The <code>ng serve</code> command compiled the application and started a local web server. It watches for file changes and automatically reloads the browser.
      </p>
      <p class="text-gray-300">
        This workflow is standard for professional Angular development, allowing you to focus on building features rather than configuring build tools.
      </p>
  `
};

export const module6Lesson3 = {
  title: '6.3 Angular Components and Templates',
  duration: '60 min',
  content: `
      <h2 class="text-2xl font-bold text-white mb-4">6.3 Angular Components and Templates</h2>
      
      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Introduction</h3>
      <p class="text-gray-300 mb-4">
        In Angular, the <strong>component</strong> is the fundamental building block used to create the user interface of an application.
      </p>
      <p class="text-gray-300 mb-4">
        Every Angular application is built using multiple components, each responsible for a specific part of the UI.
      </p>
      <p class="text-gray-300 mb-4">
        A component consists of three main parts:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li><strong>TypeScript Class</strong> – controls the logic</li>
          <li><strong>HTML Template</strong> – defines the view</li>
          <li><strong>CSS Styles</strong> – defines the appearance</li>
        </ul>
      </p>
      <p class="text-gray-300 mb-4">
        Angular uses component-based architecture, meaning the entire UI is divided into reusable and manageable components.
      </p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">What is an Angular Component?</h3>
      <p class="text-gray-300 mb-4">
        An Angular component is a TypeScript class decorated with the <code>@Component</code> decorator.
      </p>
      <p class="text-gray-300 mb-4">
        This decorator provides metadata that tells Angular:
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>How the component should be processed</li>
          <li>Which HTML template to use</li>
          <li>Which styles belong to the component</li>
        </ul>
      </p>
      
      <div class="bg-gray-800 p-4 rounded mb-4">
        <p class="text-green-400 font-mono text-sm mb-2">// Example</p>
        <pre class="text-gray-300 font-mono text-sm">import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '&lt;h1&gt;Hello Angular&lt;/h1&gt;'
})
export class HelloComponent {}</pre>
      </div>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">Metadata Properties</h4>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="p-2 border-b border-gray-700 text-white">Property</th>
              <th class="p-2 border-b border-gray-700 text-white">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border-b border-gray-800 text-green-400 font-mono">selector</td>
              <td class="p-2 border-b border-gray-800 text-gray-300">HTML tag used to display the component (e.g., <code>&lt;app-hello&gt;</code>)</td>
            </tr>
            <tr>
              <td class="p-2 border-b border-gray-800 text-green-400 font-mono">template</td>
              <td class="p-2 border-b border-gray-800 text-gray-300">HTML structure of the component (inline or external file)</td>
            </tr>
            <tr>
              <td class="p-2 border-b border-gray-800 text-green-400 font-mono">styles</td>
              <td class="p-2 border-b border-gray-800 text-gray-300">CSS styles for the component</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Component Structure</h3>
      <p class="text-gray-300 mb-4">
        A typical Angular component contains the following files:
      </p>
      <pre class="bg-gray-800 p-4 rounded mb-4 text-sm text-gray-300 overflow-x-auto">
component-name/
 ├── component-name.component.ts   (Logic)
 ├── component-name.component.html (View)
 ├── component-name.component.css  (Styles)
 └── component-name.component.spec.ts (Tests)</pre>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">1. Component Class (TypeScript)</h4>
      <p class="text-gray-300 mb-2">This file contains the logic and data (state) of the component.</p>
      <pre class="bg-gray-800 p-3 rounded mb-4 text-sm text-gray-300">
import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  title = "Welcome to Angular";
}</pre>

      <h4 class="text-lg font-semibold text-white mt-4 mb-2">2. Component Template (HTML)</h4>
      <p class="text-gray-300 mb-2">The template defines how the UI appears. It binds to the class data.</p>
      <pre class="bg-gray-800 p-3 rounded mb-4 text-sm text-gray-300">
&lt;h1&gt;{{ title }}&lt;/h1&gt;</pre>
      <p class="text-gray-300 mb-4">Angular automatically updates the view when the data changes.</p>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Template Syntax in Angular</h3>
      <p class="text-gray-300 mb-4">Angular templates use special syntax for dynamic content.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-800 p-4 rounded border border-gray-700">
          <h4 class="text-green-400 font-bold mb-2">1. Interpolation {{ }}</h4>
          <p class="text-gray-400 text-sm mb-2">Displays data from the component class.</p>
          <code class="block bg-gray-900 p-2 rounded text-sm">&lt;h2&gt;{{ title }}&lt;/h2&gt;</code>
        </div>
        <div class="bg-gray-800 p-4 rounded border border-gray-700">
          <h4 class="text-green-400 font-bold mb-2">2. Property Binding [ ]</h4>
          <p class="text-gray-400 text-sm mb-2">Binds data to HTML element properties.</p>
          <code class="block bg-gray-900 p-2 rounded text-sm">&lt;img [src]="imageUrl"&gt;</code>
        </div>
        <div class="bg-gray-800 p-4 rounded border border-gray-700">
          <h4 class="text-green-400 font-bold mb-2">3. Event Binding ( )</h4>
          <p class="text-gray-400 text-sm mb-2">Listens for user actions like clicks.</p>
          <code class="block bg-gray-900 p-2 rounded text-sm">&lt;button (click)="showMessage()"&gt;Click&lt;/button&gt;</code>
        </div>
        <div class="bg-gray-800 p-4 rounded border border-gray-700">
          <h4 class="text-green-400 font-bold mb-2">4. Two-Way Binding [( )]</h4>
          <p class="text-gray-400 text-sm mb-2">Keeps UI and component data synchronized.</p>
          <code class="block bg-gray-900 p-2 rounded text-sm">&lt;input [(ngModel)]="username"&gt;</code>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-white mt-6 mb-3">Advantages of Angular Components</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-2">
        <li><strong>Modular architecture:</strong> Breaks down complex UIs into manageable pieces.</li>
        <li><strong>Reusable UI elements:</strong> Components can be reused across the application.</li>
        <li><strong>Easier debugging:</strong> Isolated logic makes it easier to find and fix issues.</li>
        <li><strong>Separation of concerns:</strong> Clear separation between logic (TS) and view (HTML).</li>
      </ul>
  `,
  syntax: [
    {
      title: 'Basic Component',
      content: `import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {}`
    },
    {
      title: 'Interpolation',
      content: `{{ variable }}`
    },
    {
      title: 'Property Binding',
      content: `<img [src]="imageUrl">`
    },
    {
      title: 'Event Binding',
      content: `<button (click)="submit()">Submit</button>`
    },
    {
      title: 'Two-Way Binding',
      content: `<input [(ngModel)]="variable">`
    }
  ],
  liveCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angular Component Simulation</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #111; color: white; padding: 20px; display: flex; gap: 20px; flex-wrap: wrap; }
    .column { flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 20px; }
    
    .editor-container {
      background: #1e1e1e;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #333;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .editor-header {
      background: #252526;
      padding: 8px 15px;
      font-size: 13px;
      color: #ccc;
      border-bottom: 1px solid #333;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .file-icon { width: 14px; height: 14px; display: inline-block; }
    .ts-icon { background: #3178c6; border-radius: 2px; }
    .html-icon { background: #e34c26; border-radius: 2px; }
    
    .code-content {
      padding: 15px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 14px;
      line-height: 1.5;
      color: #d4d4d4;
    }
    .kwd { color: #569cd6; } /* keyword */
    .str { color: #ce9178; } /* string */
    .cls { color: #4ec9b0; } /* class */
    .fn { color: #dcdcaa; } /* function */
    .prop { color: #9cdcfe; } /* property */
    
    .preview-container {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      color: #333;
      min-height: 300px;
      display: flex;
      flex-direction: column;
    }
    .preview-header {
      background: #f0f0f0;
      padding: 8px 15px;
      border-bottom: 1px solid #ddd;
      color: #555;
      font-size: 13px;
      font-weight: bold;
    }
    .app-root {
      padding: 30px;
      flex: 1;
    }
    
    /* Interactive Elements */
    input {
      padding: 8px 12px;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      width: 100%;
      box-sizing: border-box;
      margin: 10px 0;
      transition: border-color 0.2s;
    }
    input:focus { border-color: #dd0031; outline: none; }
    button {
      background: #dd0031;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-right: 10px;
    }
    button:hover { background: #c3002f; }
    
    .binding-highlight {
      background: #e6f7ff;
      border: 1px dashed #1890ff;
      padding: 2px 5px;
      border-radius: 3px;
      transition: all 0.3s;
    }
  </style>
</head>
<body>

  <!-- Left Column: Code -->
  <div class="column">
    <div class="editor-container">
      <div class="editor-header">
        <span class="file-icon ts-icon"></span> app.component.ts
      </div>
      <div class="code-content">
        <div><span class="kwd">import</span> { Component } <span class="kwd">from</span> <span class="str">'@angular/core'</span>;</div>
        <br>
        <div>@Component({</div>
        <div style="padding-left: 20px;">selector: <span class="str">'app-root'</span>,</div>
        <div style="padding-left: 20px;">templateUrl: <span class="str">'./app.component.html'</span></div>
        <div>})</div>
        <div><span class="kwd">export class</span> <span class="cls">AppComponent</span> {</div>
        <br>
        <div style="padding-left: 20px;">title = <span class="str">"Angular Tutorial"</span>;</div>
        <br>
        <div style="padding-left: 20px;"><span class="fn">showMessage</span>() {</div>
        <div style="padding-left: 40px;"><span class="fn">alert</span>(<span class="str">"Welcome to Angular"</span>);</div>
        <div style="padding-left: 20px;">}</div>
        <br>
        <div>}</div>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-header">
        <span class="file-icon html-icon"></span> app.component.html
      </div>
      <div class="code-content">
        <div>&lt;h1&gt;{{ title }}&lt;/h1&gt;</div>
        <br>
        <div>&lt;button (click)=<span class="str">"showMessage()"</span>&gt;Click Me&lt;/button&gt;</div>
        <br>
        <div>&lt;input [(ngModel)]=<span class="str">"title"</span>&gt;</div>
        <br>
        <div>&lt;p&gt;You typed: {{ title }}&lt;/p&gt;</div>
      </div>
    </div>
  </div>

  <!-- Right Column: Preview -->
  <div class="column">
    <div class="preview-container">
      <div class="preview-header">Browser Preview (localhost:4200)</div>
      <div class="app-root" id="app">
        <h1 id="header-title">Angular Tutorial</h1>
        
        <button id="btn-click" onclick="alert('Welcome to Angular')">Click Me</button>
        
        <div style="margin-top: 20px;">
          <label style="display:block; margin-bottom:5px; color:#666; font-size:12px;">Edit title (Two-way binding):</label>
          <input type="text" id="input-title" value="Angular Tutorial">
        </div>
        
        <p>You typed: <span id="text-title" class="binding-highlight">Angular Tutorial</span></p>
      </div>
    </div>
    
    <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; font-size: 14px; color: #aaa;">
      <strong style="color: #fff;">Interactive Demo:</strong>
      <ul style="margin-top: 8px; padding-left: 20px;">
        <li>Type in the input box to see <strong>Two-Way Binding</strong> in action.</li>
        <li>Click the button to test <strong>Event Binding</strong>.</li>
        <li>Notice how the text updates instantly in multiple places!</li>
      </ul>
    </div>
  </div>

  <script>
    // Simulation logic for Two-Way Binding
    const input = document.getElementById('input-title');
    const headerTitle = document.getElementById('header-title');
    const textTitle = document.getElementById('text-title');

    input.addEventListener('input', function(e) {
      const newValue = e.target.value;
      // Update the model (simulated) and view
      headerTitle.textContent = newValue;
      textTitle.textContent = newValue;
    });
  </script>

</body>
</html>`,
  liveCodeExplanation: `
      <h3 class="text-xl font-bold text-white mb-3">How Data Binding Works Here</h3>
      <p class="text-gray-300 mb-3">
        1. <strong>Interpolation <code>{{ title }}</code></strong>: The <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code> tags display the value of the <code>title</code> property from the component class. Initially, it's "Angular Tutorial".
      </p>
      <p class="text-gray-300 mb-3">
        2. <strong>Event Binding <code>(click)</code></strong>: The button listens for the click event and executes the <code>showMessage()</code> method, showing the alert.
      </p>
      <p class="text-gray-300 mb-3">
        3. <strong>Two-Way Binding <code>[(ngModel)]</code></strong>: The input field is bound to the <code>title</code> property. 
        When you type in the input:
        <ul class="list-disc list-inside ml-4 mt-1">
          <li>The <strong>View</strong> updates the <strong>Model</strong> (the <code>title</code> variable changes).</li>
          <li>The <strong>Model</strong> updates the <strong>View</strong> (the <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code> update instantly).</li>
        </ul>
      </p>
      <p class="text-gray-300">
        This automatic synchronization is one of Angular's most powerful features, reducing the amount of manual DOM manipulation code you need to write.
      </p>
  `
};


