import React from 'react';

// Topic 7: Mini Project — Product Database API
export function Module3Topic7Lesson() {
  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-xl font-semibold">🧩 Topic 7: Mini Project — Product Database API</h2>

      <div>
        <h3 className="text-base font-semibold">Lesson</h3>
        <p className="text-gray-700 dark:text-gray-300">This mini project brings together everything you’ve learned in Module 3 — Django setup, REST APIs, MongoDB via Djongo, authentication, and React integration.</p>
        <p className="text-gray-700 dark:text-gray-300">You’ll build a Product Database API that allows CRUD operations (Create, Read, Update, Delete) and connect it with a React frontend to manage products.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧱 Project Goal</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Add new products</li>
          <li>Fetch all products</li>
          <li>Edit product details</li>
          <li>Delete products</li>
          <li>Require authentication for all actions</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧩 Tools & Tech</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Django REST Framework (DRF)</li>
          <li>MongoDB via Djongo</li>
          <li>React for frontend interaction</li>
          <li>Token-based authentication</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold">⚙️ Project Flow</h3>
        <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Backend Setup (Django + MongoDB)</li>
          <li>Model Definition — Define Product model</li>
          <li>API Views — Create CRUD endpoints</li>
          <li>Frontend — Fetch, display, edit, and delete products</li>
          <li>Authentication — Secure endpoints using tokens</li>
        </ol>
      </div>

      <div>
        <h3 className="text-base font-semibold">Run the servers</h3>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# Django backend\npython manage.py runserver\n\n# React frontend\nnpm start`}</pre>
      </div>

      <div>
        <h3 className="text-base font-semibold">✅ End of Module 3 — Key Learning Outcomes</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Built a scalable Django backend with MongoDB.</li>
          <li>Designed REST APIs for data operations.</li>
          <li>Implemented authentication & secure configurations.</li>
          <li>Connected React with Django to create a full‑stack product management system.</li>
        </ul>
      </div>
    </div>
  );
}

export function Module3Topic7Syntax() {
  return (
    <div className="space-y-6 text-sm">
      <h3 className="text-base font-semibold">Syntax — Product API with Authentication</h3>

      <div>
        <p className="text-gray-700 dark:text-gray-300">models.py</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.db import models\n\nclass Product(models.Model):\n    name = models.CharField(max_length=100)\n    price = models.FloatField()\n    description = models.TextField()\n    stock = models.IntegerField()\n\n    def __str__(self):\n        return self.name`}</pre>
      </div>

      <div>
        <p className="text-gray-700 dark:text-gray-300">serializers.py</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework import serializers\nfrom .models import Product\n\nclass ProductSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Product\n        fields = '__all__'`}</pre>
      </div>

      <div>
        <p className="text-gray-700 dark:text-gray-300">views.py</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from rest_framework import viewsets\nfrom .models import Product\nfrom .serializers import ProductSerializer\nfrom rest_framework.permissions import IsAuthenticated\n\nclass ProductViewSet(viewsets.ModelViewSet):\n    queryset = Product.objects.all()\n    serializer_class = ProductSerializer\n    permission_classes = [IsAuthenticated]`}</pre>
      </div>

      <div>
        <p className="text-gray-700 dark:text-gray-300">urls.py</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`from django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\nfrom .views import ProductViewSet\n\nrouter = DefaultRouter()\nrouter.register('products', ProductViewSet)\n\nurlpatterns = [\n    path('', include(router.urls)),\n]`}</pre>
      </div>
    </div>
  );
}

// Live Code builder for Module 3 Topic 7
export function buildModule3Topic7LiveFiles() {
  return {
    'index.html': `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Topic 7 — Product Database API</title>\n  <link rel="stylesheet" href="styles.css" />\n  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>\n  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\n  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n</head>\n<body>\n  <main class="container">\n    <h1>Product Database API — Mini Project</h1>\n    <div id="root"></div>\n  </main>\n  <script type="text/babel" src="frontend/App.js"></script>\n</body>\n</html>`,

    'styles.css': `body{font-family:system-ui,sans-serif;background:#f8fafc;color:#111827;margin:0;padding:24px}.container{max-width:900px;margin:0 auto}.card{border:1px solid #e5e7eb;border-radius:8px;background:#fff;padding:12px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.row{display:flex;gap:8px;align-items:center}.btn{padding:8px 10px;border:1px solid #cbd5e1;border-radius:6px;background:#111827;color:#fff;cursor:pointer}`,

    // Backend files
    'product_api/manage.py': `# Placeholder manage.py for structure preview\n# Use: python manage.py runserver`,
    'product_api/product_api/settings.py': `# Minimal settings excerpt for preview\nINSTALLED_APPS = [\n  'rest_framework',\n  'product_app',\n]\nREST_FRAMEWORK = {\n  'DEFAULT_AUTHENTICATION_CLASSES': [\n    'rest_framework.authentication.TokenAuthentication',\n  ]\n}`,

    'product_api/product_app/models.py': `from django.db import models\n\nclass Product(models.Model):\n    name = models.CharField(max_length=100)\n    price = models.FloatField()\n    description = models.TextField()\n    stock = models.IntegerField()\n\n    def __str__(self):\n        return self.name`,

    'product_api/product_app/serializers.py': `from rest_framework import serializers\nfrom .models import Product\n\nclass ProductSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Product\n        fields = '__all__'`,

    'product_api/product_app/views.py': `from rest_framework import viewsets\nfrom rest_framework.permissions import IsAuthenticated\nfrom .models import Product\nfrom .serializers import ProductSerializer\n\nclass ProductViewSet(viewsets.ModelViewSet):\n    queryset = Product.objects.all()\n    serializer_class = ProductSerializer\n    permission_classes = [IsAuthenticated]`,

    'product_api/product_app/urls.py': `from django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\nfrom .views import ProductViewSet\n\nrouter = DefaultRouter()\nrouter.register('products', ProductViewSet)\n\nurlpatterns = [\n    path('', include(router.urls)),\n]`,

    // Frontend files
    'frontend/App.js': `const root = ReactDOM.createRoot(document.getElementById('root'));\n\nfunction App(){\n  return (\n    <div>\n      <ProductList />\n    </div>\n  );\n}\n\nfunction ProductList(){\n  const [products, setProducts] = React.useState([]);\n  React.useEffect(() => {\n    fetch('http://localhost:8000/products/', {\n      headers: { Authorization: 'Token ' + (localStorage.getItem('token') || '') },\n    })\n      .then(res => res.json())\n      .then(data => setProducts(Array.isArray(data) ? data : (data.results || [])))\n      .catch(() => setProducts([]));\n  }, []);\n\n  return (\n    <div className="card">\n      <h2>Product Database</h2>\n      <ul>\n        {products.map(p => (\n          <li key={p.id || p._id}>\n            {p.name} — $ {p.price}\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nroot.render(<App />);`,
  };
}

export function Module4Topic3Lesson() {
  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-xl font-semibold">🧩 Topic 3: State Management & Protected Routes</h2>

      <div>
        <h3 className="text-base font-semibold">Lesson</h3>
        <p className="text-gray-700 dark:text-gray-300">State management ensures your React application knows whether a user is logged in, what data belongs to them, and whether they can access a protected page.</p>
        <p className="text-gray-700 dark:text-gray-300">This topic introduces React Context API and Protected Routes, so that authenticated users stay logged in and unauthorized users are redirected automatically.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">⚛️ Why State Management Matters</h3>
        <p className="text-gray-700 dark:text-gray-300">React’s local state (<code>useState</code>) is great for UI, but not ideal for global logic like authentication status, token storage, and user roles.</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Authentication status</li>
          <li>Token storage</li>
          <li>User role (admin/user)</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">Using Context API (or tools like Redux), you can share state globally across components.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧭 Protected Route Concept</h3>
        <p className="text-gray-700 dark:text-gray-300">A protected route checks if a user is authenticated before rendering a page:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>If token exists → Allow access</li>
          <li>If not → Redirect to Login page</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">This ensures pages like <code>/dashboard</code> or <code>/profile</code> are secure.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">⚙️ Steps to Implement Protected Routes</h3>
        <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Create <code>AuthContext</code> to hold authentication state.</li>
          <li>Create <code>ProtectedRoute</code> wrapper that checks <code>auth</code>.</li>
          <li>Wrap <code>&lt;App /&gt;</code> with <code>AuthProvider</code>.</li>
          <li>Use <code>ProtectedRoute</code> in your <code>Routes</code> for pages like <code>/dashboard</code>.</li>
        </ol>
      </div>

      <div>
        <h3 className="text-base font-semibold">Run the demo</h3>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`# React router demo (preview only)\n# The Login button sets a mock token in localStorage\n# Navigate to /dashboard after login to see access granted`}</pre>
      </div>
    </div>
  );
}

export function Module4Topic3Syntax() {
  return (
    <div className="space-y-6 text-sm">
      <h3 className="text-base font-semibold">Auth Context</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem("access") ? true : false);
  const login = (token) => { localStorage.setItem("access", token); setAuth(true); };
  const logout = () => { localStorage.removeItem("access"); setAuth(false); };
  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};`}</pre>

      <h3 className="text-base font-semibold">ProtectedRoute</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;`}</pre>

      <h3 className="text-base font-semibold">Usage</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto">{`<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>`}</pre>
    </div>
  );
}

export function buildModule4Topic3LiveFiles() {
  return {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Topic 3 — State Management & Protected Routes</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-router-dom@6/umd/react-router-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-gray-50">
  <main class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">State Management & Protected Routes</h1>
    <p class="text-gray-700 mb-4">Use Login to set a mock token, then open /dashboard.</p>
    <div id="root"></div>
  </main>
  <script type="text/babel" src="state_management_demo/src/index.js"></script>
</body>
</html>`,

    // Context
    'state_management_demo/src/AuthContext.js': `const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = React.useState(Boolean(localStorage.getItem('access')));
  const login = (token) => { localStorage.setItem('access', token || 'demo-token'); setAuth(true); };
  const logout = () => { localStorage.removeItem('access'); setAuth(false); };
  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

window.AuthContext = AuthContext;
window.AuthProvider = AuthProvider;`,

    // ProtectedRoute
    'state_management_demo/src/ProtectedRoute.js': `const ProtectedRoute = ({ children }) => {
  const { auth } = React.useContext(window.AuthContext);
  return auth ? children : React.createElement(ReactRouterDOM.Navigate, { to: '/login' });
};

window.ProtectedRoute = ProtectedRoute;`,

    // Login
    'state_management_demo/src/Login.js': `function Login(){
  const { setAuth } = React.useContext(window.AuthContext);
  return (
    <div className='p-4'>
      <button className='px-3 py-2 rounded border' onClick={() => setAuth(true)}>
        Mock Login
      </button>
    </div>
  );
}

window.Login = Login;`,

    // Dashboard
    'state_management_demo/src/Dashboard.js': `function Dashboard(){
  return <h1 className='text-xl font-semibold'>Welcome to Dashboard — Access Granted ✅</h1>;
}

window.Dashboard = Dashboard;`,

    // App (router)
    'state_management_demo/src/App.js': `function App(){
  const url = window.API_URL || 'http://localhost:8000';
  return React.createElement('div', null, [
    React.createElement('h2', {key:1}, 'API Base URL'),
    React.createElement('code', {key:2}, url),
    React.createElement('p', {key:3}, 'Update this via your hosting provider env settings')
  ]);
}

window.App = App;`,

    // Entry
    'state_management_demo/src/index.js': `const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(window.AuthProvider, null, React.createElement(window.App)));`,
  };
}

export function Module4Topic5Lesson() {
  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-xl font-semibold">🧩 Topic 5: Deploying Full-Stack Apps (Vercel / Render / AWS)</h2>
      <p className="text-gray-700 dark:text-gray-300">After development, deployment turns your local project into a live web application accessible to users worldwide.</p>
      <div>
        <h3 className="text-base font-semibold">You’ll deploy:</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>React frontend on Vercel</li>
          <li>Django backend on Render (or AWS EC2 / Railway)</li>
          <li>Connect both securely using environment variables and API URLs</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold">🚀 Understanding Deployment Workflow</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Frontend → static hosting (Vercel/Netlify)</li>
          <li>Backend → dynamic server (Render/AWS)</li>
          <li>Database → MongoDB Atlas</li>
          <li>Environment Variables → secrets and URLs</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧭 Deploying Django API on Render</h3>
        <p className="text-gray-700 dark:text-gray-300">Create <code>requirements.txt</code>:</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`pip freeze > requirements.txt`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Add <code>Procfile</code>:</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`web: gunicorn backend.wsgi`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Push to GitHub, then create a new Web Service on Render and link your repo. Render installs dependencies and runs your app.</p>
        <p className="text-gray-700 dark:text-gray-300">Once deployed, you’ll get a live API URL like <code>https://my-django-api.onrender.com</code>.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">⚛️ Deploying React Frontend on Vercel</h3>
        <p className="text-gray-700 dark:text-gray-300">Build production:</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`npm run build`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Push to GitHub → Import repo on Vercel → Deploy.</p>
        <p className="text-gray-700 dark:text-gray-300">Update your API base URL in frontend:</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const API = axios.create({ baseURL: 'https://my-django-api.onrender.com' });`}</pre>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧠 Environment Variables</h3>
        <p className="text-gray-700 dark:text-gray-300">Never hardcode URLs or secrets. Use <code>.env</code> files.</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`# React (.env)
REACT_APP_API_URL=https://my-django-api.onrender.com

# Access in code
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

# Django (.env)
SECRET_KEY=your-secret-key
DEBUG=False
MONGODB_URI=your_mongodb_uri`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Load Django env with <code>python-dotenv</code> in <code>settings.py</code>.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧱 Database Hosting with MongoDB Atlas</h3>
        <p className="text-gray-700 dark:text-gray-300">Create a free cluster and use the connection URI in Django:</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`DATABASES = {
  'default': {
    'ENGINE': 'djongo',
    'NAME': 'product_db',
    'CLIENT': { 'host': os.environ.get('MONGODB_URI') }
  }
}`}</pre>
      </div>
    </div>
  );
}

export function Module4Topic5Syntax() {
  return (
    <div className="space-y-6 text-sm">
      <h3 className="text-base font-semibold">Django Deployment Essentials</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`pip install gunicorn whitenoise python-dotenv
pip freeze > requirements.txt`}</pre>

      <h3 className="text-base font-semibold">Procfile</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`web: gunicorn backend.wsgi`}</pre>

      <h3 className="text-base font-semibold">Frontend Build</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`npm run build`}</pre>
    </div>
  );
}

export function buildModule4Topic5LiveFiles() {
  return {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Topic 5 — Deploying Full-Stack Apps</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body{font-family:system-ui,sans-serif;background:#f8fafc;color:#111827;margin:0;padding:24px}</style>
</head>
<body>
  <main>
    <h1>Deployment Demo</h1>
    <p>This demo shows how environment variables and deployment files fit together.</p>
    <div id="root"></div>
  </main>
  <script type="text/babel" src="deploy_app_demo/frontend/src/env.js"></script>
  <script type="text/babel" src="deploy_app_demo/frontend/src/App.js"></script>
  <script type="text/babel" src="deploy_app_demo/frontend/src/index.js"></script>
</body>
</html>`,

    // Backend deployment files
    'deploy_app_demo/backend/Procfile': `web: gunicorn backend.wsgi`,
    'deploy_app_demo/backend/requirements.txt': `Django
gunicorn
whitenoise
python-dotenv`,
    'deploy_app_demo/backend/settings.py': `import os
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = False
DATABASES = {
  'default': {
    'ENGINE': 'djongo',
    'NAME': 'product_db',
    'CLIENT': { 'host': os.environ.get('MONGODB_URI') }
  }
}`,

    // Frontend env and files
    'deploy_app_demo/frontend/.env': `REACT_APP_API_URL=https://my-django-api.onrender.com`,
    'deploy_app_demo/frontend/src/env.js': `window.API_URL = 'https://my-django-api.onrender.com';`,
    'deploy_app_demo/frontend/src/App.js': `function App(){
  const url = window.API_URL || 'http://localhost:8000';
  return React.createElement('div', null, [
    React.createElement('h2', {key:1}, 'API Base URL'),
    React.createElement('code', {key:2}, url),
    React.createElement('p', {key:3}, 'Update this via your hosting provider env settings')
  ]);
}

window.App = App;`,
    'deploy_app_demo/frontend/src/index.js': `const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(window.App));`,

    // Placeholder for build output
    'deploy_app_demo/frontend/build/README.txt': `This folder will contain production build artifacts after running: npm run build`,
  };
}

export function Module4Topic4Lesson() {
  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-xl font-semibold">🧩 Topic 4: Securing API Calls</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Security is not just about authentication — it’s about ensuring data integrity, confidentiality, and safety across all client-server communications.
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        When building a Django + React full-stack application, your API calls are the bridge between frontend and backend — and that bridge must be secure by design.
      </p>

      <div>
        <h3 className="text-base font-semibold">In this topic, you’ll learn how to:</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Secure REST API endpoints in Django</li>
          <li>Protect sensitive environment data</li>
          <li>Safely handle tokens in React</li>
          <li>Prevent common attacks like CSRF, CORS abuse, and data exposure</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold">🛡️ Core Security Layers in API Communication</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li><strong>Authentication</strong> — Verify the identity of the user (JWT).</li>
          <li><strong>Authorization</strong> — Limit what the user can access (role-based).</li>
          <li><strong>Encryption</strong> — Secure data over HTTPS.</li>
          <li><strong>Validation</strong> — Sanitize input data on both frontend & backend.</li>
          <li><strong>CORS Control</strong> — Restrict origins allowed to call your API.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold">⚙️ Configuring Django REST Security</h3>
        <p className="text-gray-700 dark:text-gray-300">Enable CORS (Cross-Origin Resource Sharing)</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`pip install django-cors-headers`}</pre>
        <p className="text-gray-700 dark:text-gray-300">In <code>settings.py</code>:</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`INSTALLED_APPS = [
    'corsheaders',
    'rest_framework',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # React app
]`}</pre>
        <p className="text-gray-700 dark:text-gray-300">This ensures that only trusted domains (like your React app) can interact with the Django API.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">🔒 Restricting API Access</h3>
        <p className="text-gray-700 dark:text-gray-300">Use permission classes in Django REST Framework to restrict access:</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`# views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class SecureProductView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Access granted to secure API!"})`}</pre>
        <p className="text-gray-700 dark:text-gray-300">This means only requests with valid tokens can reach this endpoint.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">⚛️ Frontend — Securely Sending Tokens</h3>
        <p className="text-gray-700 dark:text-gray-300">Use Axios interceptors to automatically attach JWT tokens to all outgoing requests.</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`// api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default API;`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Now all requests are protected — if the token is invalid or missing, Django will reject them.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧠 Security Best Practices Checklist</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Always use HTTPS in production.</li>
          <li>Never expose secrets (API keys, DB credentials) in frontend code.</li>
          <li>Use .env files for sensitive configurations.</li>
          <li>Keep your Django SECRET_KEY private.</li>
          <li>Limit public endpoints; protect everything else with authentication.</li>
        </ul>
      </div>
    </div>
  );
}

export function Module4Topic4Syntax() {
  return (
    <div className="space-y-6 text-sm">
      <h3 className="text-base font-semibold">CORS Setup (Backend)</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`INSTALLED_APPS = ['corsheaders', 'rest_framework']
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', 'django.middleware.common.CommonMiddleware']
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']`}</pre>

      <h3 className="text-base font-semibold">Protected View</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class SecureView(APIView):
    permission_classes = [IsAuthenticated]`}</pre>

      <h3 className="text-base font-semibold">Frontend Token Interceptor</h3>
      <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`API.interceptors.request.use(config => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});`}</pre>
    </div>
  );
}

export function buildModule4Topic4LiveFiles() {
  return {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Topic 4 — Securing API Calls</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <style>body{font-family:system-ui,sans-serif;background:#f8fafc;color:#111827;margin:0;padding:24px}</style>
</head>
<body>
  <main>
    <h1>Secure API Demo</h1>
    <p>Open console and set a token: localStorage.setItem('access', 'demo'); then refresh.</p>
    <div id="root"></div>
  </main>
  <script type="text/babel" src="secure_api_demo/frontend/src/api.js"></script>
  <script type="text/babel" src="secure_api_demo/frontend/src/SecurePage.js"></script>
  <script type="text/babel" src="secure_api_demo/frontend/src/index.js"></script>
</body>
</html>`,

    // Backend sample files
    'secure_api_demo/backend/settings.py': `INSTALLED_APPS = [
    'corsheaders',
    'rest_framework',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # React app
]`,

    'secure_api_demo/backend/views.py': `from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class SecureProductView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Access granted to secure API!"})`,

    // Frontend files
    'secure_api_demo/frontend/src/api.js': `// Axios instance with token attachment and in-browser mock adapter for demo
const API = axios.create({ baseURL: 'http://localhost:8000' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers = { ...(config.headers || {}), Authorization: \`Bearer \${token}\` };
  }
  // Demo: emulate /secure-endpoint/ response without a real backend
  if (config.url === '/secure-endpoint/') {
    config.adapter = () => {
      const hasAuth = !!(config.headers && config.headers.Authorization);
      return Promise.resolve({
        data: hasAuth ? { message: 'Access granted to secure API!' } : { detail: 'Unauthorized' },
        status: hasAuth ? 200 : 401,
        statusText: hasAuth ? 'OK' : 'Unauthorized',
        headers: {},
        config,
      });
    };
  }
  return config;
});

window.API = API;`,

    'secure_api_demo/frontend/src/SecurePage.js': `function SecurePage() {
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    window.API.get('/secure-endpoint/')
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage('Unauthorized!'));
  }, []);

  return React.createElement('h2', null, message || '');
}

window.SecurePage = SecurePage;`,

    'secure_api_demo/frontend/src/index.js': `const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(window.SecurePage));`,
  };
}

export function Module4Topic6Lesson() {
  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-xl font-semibold">🛍️ Final Capstone Project: E-commerce Web Application</h2>
      <div>
        <h3 className="text-base font-semibold">🎯 Objective</h3>
        <p className="text-gray-700 dark:text-gray-300">Students will build, integrate, and deploy a fully functional E-commerce Web Application where users can browse products, register/login, manage carts, and checkout — powered by React, Django, and MongoDB.</p>
        <p className="text-gray-700 dark:text-gray-300">By completing this project, students will learn how to architect a real-world frontend-backend system, implement JWT authentication, perform CRUD operations using Django REST API, use React state management for cart and user sessions, and securely deploy and manage environment variables.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧩 Project Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="text-left p-2 border-b">Component</th>
                <th className="text-left p-2 border-b">Technology</th>
                <th className="text-left p-2 border-b">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b">Frontend</td>
                <td className="p-2 border-b">React + Tailwind CSS</td>
                <td className="p-2 border-b">User interface, product display, cart management</td>
              </tr>
              <tr>
                <td className="p-2 border-b">Backend</td>
                <td className="p-2 border-b">Django REST Framework</td>
                <td className="p-2 border-b">REST APIs for authentication, product CRUD</td>
              </tr>
              <tr>
                <td className="p-2 border-b">Database</td>
                <td className="p-2 border-b">MongoDB (via Djongo)</td>
                <td className="p-2 border-b">Product and user data storage</td>
              </tr>
              <tr>
                <td className="p-2 border-b">Auth</td>
                <td className="p-2 border-b">JWT Authentication</td>
                <td className="p-2 border-b">Secure login/logout, token-based session</td>
              </tr>
              <tr>
                <td className="p-2 border-b">Deployment</td>
                <td className="p-2 border-b">Render (API) + Vercel (Frontend)</td>
                <td className="p-2 border-b">Fully live cloud-hosted app</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold">⚙️ Key Features to Implement</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>User Authentication (Signup, Login, Logout)</li>
          <li>Product Listing (Fetch from Django API)</li>
          <li>Add to Cart / Remove from Cart</li>
          <li>Checkout Simulation</li>
          <li>Protected Routes (React)</li>
          <li>API Security & Token Storage</li>
          <li>Responsive UI</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧠 System Architecture</h3>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`[React Frontend] ⇄ [Django REST API] ⇄ [MongoDB Database]
         ↓
 [Authentication via JWT Tokens]
         ↓
 [Deployment on Vercel & Render]`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Each component communicates securely — React sends fetch or axios requests to the Django API, which interacts with MongoDB to retrieve and manipulate data.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">🔨 Backend (Django REST API)</h3>
        <p className="text-gray-700 dark:text-gray-300">Setup</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`django-admin startproject ecommerce_backend
cd ecommerce_backend
python manage.py startapp store`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Models</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`# store/models.py
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()
    image = models.URLField()

    def __str__(self):
        return self.name`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Serializers</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`# store/serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Views</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`# store/views.py
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`}</pre>
        <p className="text-gray-700 dark:text-gray-300">URLs</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`# store/urls.py
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)
urlpatterns = router.urls`}</pre>
      </div>

      <div>
        <h3 className="text-base font-semibold">⚛️ Frontend (React)</h3>
        <p className="text-gray-700 dark:text-gray-300">Project Setup</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`npx create-react-app ecommerce_frontend
cd ecommerce_frontend
npm install axios react-router-dom`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Routing Setup</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Fetching Products</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`// src/pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/products/")
      .then(res => setProducts(res.data))
      .catch(err => 
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {products.map(p => (
        <div key={p.id} className="border p-3 rounded-lg shadow">
          <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
          <h3 className="font-bold mt-2">{p.name}</h3>
          <p>${'{'}p.price{'}'}</p>
          <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;`}</pre>
        <p className="text-gray-700 dark:text-gray-300">Cart State Management</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`// src/context/CartContext.js
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (id) => setCart(cart.filter(p => p.id !== id));

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}`}</pre>
      </div>

      <div>
        <h3 className="text-base font-semibold">🧩 Deployment Flow</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Push both frontend and backend repos to GitHub.</li>
          <li>Frontend → Vercel</li>
          <li>Backend → Render</li>
          <li>Database → MongoDB Atlas</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">Update frontend .env with backend API URL:</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`REACT_APP_API_URL= https://your-backend.onrender.com`}</pre>
      </div>
    </div>
  );
}

export function Module4Topic6Syntax() {
  return (
    <div className="space-y-6 text-sm">
      <h3 className="text-base font-semibold">Syntax — Final Capstone Project</h3>
      <div>
        <p className="text-gray-700 dark:text-gray-300">Django REST ProductViewSet</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`}</pre>
      </div>
      <div>
        <p className="text-gray-700 dark:text-gray-300">React Product Fetch</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`useEffect(() => {
  axios.get(\`\${process.env.REACT_APP_API_URL}/products/\`)
    .then(res => setProducts(res.data));
}, []);`}</pre>
      </div>
      <div>
        <p className="text-gray-700 dark:text-gray-300">Cart Management</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`const addToCart = (product) => setCart([...cart, product]);
const removeFromCart = (id) => setCart(cart.filter(p => p.id !== id));`}</pre>
      </div>
      <div>
        <p className="text-gray-700 dark:text-gray-300">Protected Route Example</p>
        <pre className="rounded bg-gray-900 text-gray-100 p-4 overflow-auto text-sm">{`&lt;Route path="/cart" element={isAuthenticated ? &lt;Cart /&gt; : &lt;Navigate to="/login" /&gt;} /&gt;`}</pre>
      </div>
    </div>
  );
}

export function buildModule4Topic6LiveFiles() {
  return {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Topic 6 — Final Capstone: E-commerce App</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#e5e7eb;margin:0} header{padding:16px;text-align:center;background:#111827} main{padding:16px} .btn{background:#2563eb;color:#fff;border:none;border-radius:6px;padding:8px 12px;margin-right:8px;cursor:pointer} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px} .card{border:1px solid #1f2937;border-radius:8px;background:#111827;padding:12px}</style>
</head>
<body>
  <header>🧩 Final Capstone Project: E‑commerce Web Application</header>
  <main>
    <div id="root"></div>
  </main>
  <script type="text/babel" src="ecommerce_project/frontend/src/context/CartContext.js"></script>
  <script type="text/babel" src="ecommerce_project/frontend/src/pages/Home.js"></script>
  <script type="text/babel" src="ecommerce_project/frontend/src/pages/Cart.js"></script>
  <script type="text/babel" src="ecommerce_project/frontend/src/pages/Login.js"></script>
  <script type="text/babel" src="ecommerce_project/frontend/src/App.js"></script>
  <script type="text/babel" src="ecommerce_project/frontend/src/index.js"></script>
</body>
</html>`,

    // Frontend files
    'ecommerce_project/frontend/src/context/CartContext.js': `const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cart, setCart] = React.useState([]);
  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (id) => setCart(cart.filter(p => p.id !== id));
  const clearCart = () => setCart([]);
  return React.createElement(CartContext.Provider, { value: { cart, addToCart, removeFromCart, clearCart } }, children);
}

window.CartContext = CartContext;
window.CartProvider = CartProvider;`,

    'ecommerce_project/frontend/src/pages/Home.js': `function Home(){
  const { addToCart } = React.useContext(window.CartContext);
  const [products] = React.useState([
    { id: 1, name: 'MacBook Air', price: 1199.99 },
    { id: 2, name: 'iPhone 16', price: 999.00 },
    { id: 3, name: 'Pixel 9', price: 699.00 },
  ]);
  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Products</h2>
      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <strong>{p.name}</strong>
            <div>$ {p.price}</div>
            <button className="btn" onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Home = Home;`,

    'ecommerce_project/frontend/src/pages/Cart.js': `function Cart() {
  const { cart, removeFromCart } = React.useContext(window.CartContext);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="border-b py-2 flex justify-between">
            <span>{item.name}</span>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
          </div>
        ))
      )}
    </div>
  );
}

window.Cart = Cart;`,

    'ecommerce_project/frontend/src/pages/Login.js': `function Login(){
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState('');
  async function handleLogin(e){ e.preventDefault(); setStatus('Logging in...'); setTimeout(()=>setStatus('Demo only: integrate JWT later'), 600); }
  return (
    <form onSubmit={handleLogin} className="card" style={{maxWidth:'360px'}}>
      <h3 className="text-lg font-semibold mb-2">Login</h3>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" style={{padding:'8px',marginBottom:'8px'}} />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{padding:'8px',marginBottom:'8px'}} />
      <button className="btn" type="submit">Sign In</button>
      <p style={{marginTop:'8px'}}>{status}</p>
    </form>
  );
}

window.Login = Login;`,

    'ecommerce_project/frontend/src/App.js': `function App(){
  const [view, setView] = React.useState('home');
  const NavButton = ({label, id}) => <button className="btn" onClick={()=>setView(id)}>{label}</button>;
  return (
    React.createElement(window.CartProvider, null,
      <div>
        <div style={{marginBottom:'12px'}}>
          <NavButton label="Home" id="home" />
          <NavButton label="Cart" id="cart" />
          <NavButton label="Login" id="login" />
        </div>
        {view === 'home' && React.createElement(window.Home)}
        {view === 'cart' && React.createElement(window.Cart)}
        {view === 'login' && React.createElement(window.Login)}
      </div>
    )
  );
}

window.App = App;`,

    'ecommerce_project/frontend/src/index.js': `const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(window.App));`,

    // Backend files (reference only)
    'ecommerce_project/backend/store/models.py': `from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()
    image = models.URLField(blank=True)

    def __str__(self):
        return self.name`,

    'ecommerce_project/backend/store/serializers.py': `from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'`,

    'ecommerce_project/backend/store/views.py': `from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer`,

    'ecommerce_project/backend/store/urls.py': `from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)
urlpatterns = router.urls`,

    'ecommerce_project/backend/settings.py': `INSTALLED_APPS = [
  'rest_framework',
  'store',
]

REST_FRAMEWORK = {
  'DEFAULT_AUTHENTICATION_CLASSES': [],
}

# Add your MongoDB / Djongo settings here as needed`,

    // Project structure reference
    'ecommerce_project/PROJECT_STRUCTURE.txt': `/ecommerce_project/\n  backend/\n    store/\n      models.py\n      views.py\n      serializers.py\n      urls.py\n    settings.py\n  frontend/\n    src/\n      pages/\n        Home.js\n        Cart.js\n        Login.js\n      context/\n        CartContext.js\n      App.js`,

    'ecommerce_project/README.txt': `Outcome:\n- A functioning e-commerce demo (Home, Cart, Login)\n- Reference backend files for Django REST\n- Extensible to full deployment with Vercel/Render`
  };
}
