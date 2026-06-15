import React from 'react';

// Topic 5: Fetching and Posting Data from React to Django
export function Module3Topic5Lesson() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">🧩 Topic 5: Fetching and Posting Data from React to Django</h2>

      <div>
        <h3 className="text-base font-semibold">Lesson</h3>
        <p className="text-gray-700 dark:text-gray-300">Now that you have a working backend (Django + MongoDB) and REST APIs, it’s time to connect your frontend (React) to it.</p>
        <p className="text-gray-700 dark:text-gray-300">This is where Fetch API (or Axios) in React comes into play. We’ll create a React component that:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Fetches product data from Django REST API (GET)</li>
          <li>Sends new data to the API (POST)</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">This forms the complete frontend-backend communication loop.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">1. Overview of Communication Flow</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>React sends a request (GET or POST)</li>
          <li>Django receives it and processes it via REST API</li>
          <li>Django sends JSON response back to React</li>
          <li>React updates the UI dynamically</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold">2. CORS (Cross-Origin Resource Sharing)</h3>
        <p className="text-gray-700 dark:text-gray-300">When your frontend and backend run on different ports (React on 3000, Django on 8000), you need to enable CORS.</p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto"><code>{`# Install CORS headers in Django
pip install django-cors-headers

# Add to INSTALLED_APPS in backend/settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

// just for versal pushing Topic 5: Fetching and Posting Data from React to Django


# Add middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

# Allow all origins (development)
CORS_ALLOW_ALL_ORIGINS = True
`}</code></pre>
        <p className="text-gray-700 dark:text-gray-300">Now Django can accept requests from your React app.</p>
      </div>

      <div>
        <h3 className="text-base font-semibold">Key Takeaways</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>React fetches and posts data to Django REST API</li>
          <li>Django handles GET &amp; POST with serializers</li>
          <li>CORS enabled for secure cross-origin communication</li>
          <li>You’ve built a full-stack data loop 🔁</li>
        </ul>
      </div>
    </div>
  );
}

export function Module3Topic5Syntax() {
  return (
    <div className="space-y-6 text-sm">
      <h3 className="text-base font-semibold">Django API (Backend)</h3>
      <div>
        <p className="text-gray-700 dark:text-gray-300">products/views.py</p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto"><code>{`from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET', 'POST'])
def product_api(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
`}</code></pre>
      </div>

      <div>
        <p className="text-gray-700 dark:text-gray-300">backend/urls.py</p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto"><code>{`from django.urls import path
from products.views import product_api

urlpatterns = [
    path('api/products/', product_api),
]
`}</code></pre>
      </div>

      <h3 className="text-base font-semibold">React Frontend (Frontend)</h3>
      <div>
        <p className="text-gray-700 dark:text-gray-300">App.js</p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto"><code>{`import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "" });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => setProducts([...products, data]));
  };

  return (
    <div className="App">
      <h1>Product Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ₹{p.price} ({p.category})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
`}</code></pre>
      </div>
    </div>
  );
}

// Live Code builder for Module 3 Topic 5
export function buildModule3Topic5LiveFiles() {
  return {
    'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Topic 5: React ↔ Django</title>
    <link rel="stylesheet" href="styles.css" />
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel" src="App.js"></script>
  </body>
</html>`,
    'styles.css': `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; padding: 20px; background: #f7fafc; }
.App { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
h1 { margin-bottom: 16px; }
form { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 8px; margin-bottom: 16px; }
input, button { padding: 8px 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
button { background: #111827; color: white; cursor: pointer; }
ul { list-style: none; padding: 0; }
li { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }`,
    'App.js': `const { useEffect, useState } = React;

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '' });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/products/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => setProducts([...products, data]))
      .catch(() => {});
  };

  return (
    <div className="App">
      <h1>Product Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      <ul>
        {products.map((p) => (
          <li key={p.id ?? Math.random()}>
            {p.name} - ₹{p.price} ({p.category})
          </li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
  };
}