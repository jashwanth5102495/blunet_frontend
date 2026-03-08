
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
  console.log(name);
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
        console.log("Email:", email);
        console.log("Password:", password);
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
  console.log("Child rendered");
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
  console.log("Clicked");
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
      console.log('Calling slow function...');
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
        console.log('Updating Items');
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
    console.log(data);
  })
  .catch(error => {
    console.error(error);
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
    console.log(response.data);
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
            console.error("Error fetching data:", error);
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
