import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Book, 
  Code, 
  Play, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  Folder, 
  FolderOpen, 
  Send, 
  Lightbulb,
  Menu,
  X
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  codeExample: string;
}

interface Exercise {
  id: string;
  question: string;
  hint: string;
  solution: string;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
  exercises: Exercise[];
}

const CourseLearningFrontendAdvanced: React.FC = () => {
  const { theme } = useTheme();
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercise'>('theory');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [selectedFile, setSelectedFile] = useState('App.tsx');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [submittedExercises, setSubmittedExercises] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Advanced Frontend files structure
  const fileContents: { [key: string]: string } = {
    'App.tsx': `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { store } from './store/store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ErrorFallback from './components/ErrorFallback';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </Router>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;`,

    'store/store.ts': `import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import themeSlice from './slices/themeSlice';
import { api } from './api/apiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'],
};

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  theme: themeSlice,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,

    'hooks/useOptimistic.ts': `import { useState, useCallback } from 'react';

interface OptimisticState<T> {
  data: T;
  isOptimistic: boolean;
  error?: Error;
}

export function useOptimistic<T>(
  initialData: T,
  updateFn: (data: T, optimisticUpdate: Partial<T>) => Promise<T>
) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isOptimistic: false,
  });

  const updateOptimistic = useCallback(
    async (optimisticUpdate: Partial<T>) => {
      // Apply optimistic update immediately
      const optimisticData = { ...state.data, ...optimisticUpdate };
      setState({
        data: optimisticData,
        isOptimistic: true,
      });

      try {
        // Perform actual update
        const actualData = await updateFn(state.data, optimisticUpdate);
        setState({
          data: actualData,
          isOptimistic: false,
        });
      } catch (error) {
        // Revert on error
        setState({
          data: state.data,
          isOptimistic: false,
          error: error as Error,
        });
      }
    },
    [state.data, updateFn]
  );

  return [state, updateOptimistic] as const;
}`,

    'components/VirtualizedList.tsx': `import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
}: VirtualizedListProps<T>) {
  const Row = useMemo(
    () =>
      ({ index, style }: { index: number; style: React.CSSProperties }) => (
        <div style={style}>
          {renderItem(items[index], index)}
        </div>
      ),
    [items, renderItem]
  );

  return (
    <List
      className={className}
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
}

export default VirtualizedList;`,

    'utils/performance.ts': `// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string): void {
    performance.mark(\`\${name}-start\`);
  }

  endMeasure(name: string): number {
    performance.mark(\`\${name}-end\`);
    performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);
    
    const measure = performance.getEntriesByName(name)[0];
    const duration = measure.duration;
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
    
    return duration;
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name) || [];
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  reportMetrics(): void {
    console.group('Performance Metrics');
    this.metrics.forEach((times, name) => {
      const avg = this.getAverageTime(name);
      console.log(\`\${name}: \${avg.toFixed(2)}ms (avg of \${times.length} measurements)\`);
    });
    console.groupEnd();
  }
}`,

    'package.json': `{
  "name": "advanced-frontend-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@tanstack/react-query": "^4.29.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.0",
    "react-router-dom": "^6.11.0",
    "react-window": "^1.8.8",
    "redux-persist": "^6.0.0",
    "framer-motion": "^10.12.0",
    "react-error-boundary": "^4.0.11",
    "web-vitals": "^3.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/react-window": "^1.8.5",
    "typescript": "^5.0.0",
    "webpack-bundle-analyzer": "^4.9.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.0",
    "cypress": "^12.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  }
}`
  };

  // Advanced Frontend Course - Module-based
  const courseModules: CourseModule[] = [
    {
      id: 'advanced-state-management',
      title: 'Advanced State Management',
      lessons: [
        {
          id: 'redux-toolkit-advanced',
          title: 'Redux Toolkit Advanced Patterns',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🏪 Advanced Redux Toolkit Patterns</h2>
            <p>Master advanced state management patterns with Redux Toolkit for complex applications.</p>
            
            <h3>🎯 Advanced Concepts</h3>
            <ul>
              <li><strong>RTK Query:</strong> Powerful data fetching and caching solution</li>
              <li><strong>Entity Adapters:</strong> Normalized state management for collections</li>
              <li><strong>Async Thunks:</strong> Complex async logic with error handling</li>
              <li><strong>Middleware:</strong> Custom middleware for logging and analytics</li>
              <li><strong>Selectors:</strong> Memoized selectors with Reselect</li>
              <li><strong>Persistence:</strong> State persistence with Redux Persist</li>
            </ul>
            
            <h3>🔧 Performance Optimization</h3>
            <ul>
              <li><strong>Normalized State:</strong> Flat state structure for better performance</li>
              <li><strong>Memoization:</strong> Prevent unnecessary re-renders</li>
              <li><strong>Code Splitting:</strong> Lazy loading of reducers</li>
              <li><strong>DevTools:</strong> Time-travel debugging and state inspection</li>
              <li><strong>Immutability:</strong> Immer for immutable updates</li>
            </ul>
            
            <h3>📊 Real-world Patterns</h3>
            <ul>
              <li><strong>Feature-based Structure:</strong> Organize by features, not file types</li>
              <li><strong>Slice Patterns:</strong> Co-locate actions, reducers, and selectors</li>
              <li><strong>API Integration:</strong> Seamless backend integration</li>
              <li><strong>Error Boundaries:</strong> Graceful error handling</li>
              <li><strong>Testing Strategies:</strong> Unit and integration testing</li>
            </ul>
          `,
          codeExample: `// Advanced Redux Toolkit Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { api } from './api/apiSlice';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'],
  blacklist: ['api'], // Don't persist API cache
};

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store with middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// RTK Query API Slice
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', \`Bearer \${token}\`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => \`users/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: \`users/\${id}\`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
  }),
});

// Entity Adapter for normalized state
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {
    userAdded: usersAdapter.addOne,
    userUpdated: usersAdapter.updateOne,
    userRemoved: usersAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        usersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state: RootState) => state.users);`
        }
      ],
      exercises: [
        {
          id: 'redux-toolkit-exercise',
          question: 'Create a Redux Toolkit slice for managing a shopping cart with items, quantities, and total calculation. Include actions for adding items, removing items, and updating quantities.',
          hint: 'Use createSlice with reducers for add, remove, and update actions. Consider using Immer for immutable updates.',
          solution: `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
  },
});

export const { addItem, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;`
        }
      ]
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization',
      lessons: [
        {
          id: 'react-performance',
          title: 'React Performance Optimization',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>⚡ React Performance Optimization</h2>
            <p>Master advanced techniques to optimize React application performance for production-scale applications.</p>
            
            <h3>🎯 Core Optimization Techniques</h3>
            <ul>
              <li><strong>React.memo:</strong> Prevent unnecessary re-renders of components</li>
              <li><strong>useMemo:</strong> Memoize expensive calculations</li>
              <li><strong>useCallback:</strong> Memoize function references</li>
              <li><strong>Code Splitting:</strong> Lazy loading with React.lazy and Suspense</li>
              <li><strong>Virtualization:</strong> Render only visible items in large lists</li>
              <li><strong>Bundle Analysis:</strong> Identify and eliminate bundle bloat</li>
            </ul>
            
            <h3>🔧 Advanced Patterns</h3>
            <ul>
              <li><strong>Concurrent Features:</strong> useTransition and useDeferredValue</li>
              <li><strong>Error Boundaries:</strong> Graceful error handling</li>
              <li><strong>Profiler API:</strong> Measure component performance</li>
              <li><strong>Web Workers:</strong> Offload heavy computations</li>
              <li><strong>Service Workers:</strong> Caching and offline functionality</li>
            </ul>
            
            <h3>📊 Performance Monitoring</h3>
            <ul>
              <li><strong>Core Web Vitals:</strong> LCP, FID, CLS measurements</li>
              <li><strong>React DevTools Profiler:</strong> Component performance analysis</li>
              <li><strong>Lighthouse:</strong> Automated performance audits</li>
              <li><strong>Real User Monitoring:</strong> Production performance tracking</li>
              <li><strong>Performance API:</strong> Custom performance metrics</li>
            </ul>
          `,
          codeExample: `// Performance Optimization Examples

// 1. React.memo for component memoization
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyCalculation(item)
    }));
  }, [data]);

  const handleClick = useCallback((id) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.processed}
        </div>
      ))}
    </div>
  );
});

// 2. Virtualized List for large datasets
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <div className="item">
        {items[index].name}
      </div>
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};

// 3. Code Splitting with React.lazy
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// 4. useTransition for non-urgent updates
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value) => {
    setQuery(value);
    startTransition(() => {
      // This update is marked as non-urgent
      setResults(searchData(value));
    });
  };

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <div>Searching...</div>}
      <ResultsList results={results} />
    </div>
  );
}

// 5. Performance monitoring
const PerformanceMonitor = () => {
  useEffect(() => {
    // Measure component mount time
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(\`Component was mounted for \${endTime - startTime} milliseconds\`);
    };
  }, []);

  // Report Core Web Vitals
  useEffect(() => {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }, []);

  return null;
};

// 6. Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}`
        }
      ],
      exercises: [
        {
          id: 'performance-exercise',
          question: 'Create a performance-optimized component that renders a large list of items with search functionality. Use virtualization, memoization, and debouncing to ensure smooth performance.',
          hint: 'Combine react-window for virtualization, useMemo for filtered results, useCallback for event handlers, and a custom debounce hook.',
          solution: `import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useDebounce } from './hooks/useDebounce';

interface Item {
  id: string;
  name: string;
  description: string;
}

interface OptimizedListProps {
  items: Item[];
}

const OptimizedList: React.FC<OptimizedListProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoize filtered results
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [items, debouncedSearchTerm]);

  // Memoize search handler
  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  // Memoize row renderer
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="flex items-center p-4 border-b">
      <div>
        <h3 className="font-semibold">{filteredItems[index].name}</h3>
        <p className="text-gray-600">{filteredItems[index].description}</p>
      </div>
    </div>
  ), [filteredItems]);

  return (
    <div className="w-full h-full">
      <div className="p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search items..."
          className="w-full p-2 border rounded"
        />
      </div>
      <List
        height={400}
        itemCount={filteredItems.length}
        itemSize={80}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default React.memo(OptimizedList);`
        }
      ]
    },
    {
      id: 'advanced-patterns',
      title: 'Advanced React Patterns',
      lessons: [
        {
          id: 'compound-components',
          title: 'Compound Components & Render Props',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🧩 Advanced React Patterns</h2>
            <p>Master sophisticated React patterns for building flexible and reusable component architectures.</p>
            
            <h3>🎯 Compound Components</h3>
            <ul>
              <li><strong>Implicit State:</strong> Share state between parent and children</li>
              <li><strong>Flexible API:</strong> Allow consumers to compose UI as needed</li>
              <li><strong>Context Pattern:</strong> Use React Context for component communication</li>
              <li><strong>Clone Element:</strong> Pass props to children dynamically</li>
              <li><strong>Validation:</strong> Ensure proper component composition</li>
            </ul>
            
            <h3>🔧 Render Props Pattern</h3>
            <ul>
              <li><strong>Logic Sharing:</strong> Share stateful logic between components</li>
              <li><strong>Inversion of Control:</strong> Let consumers control rendering</li>
              <li><strong>Function as Children:</strong> Use children as render function</li>
              <li><strong>Higher-Order Components:</strong> Alternative pattern for logic sharing</li>
              <li><strong>Custom Hooks:</strong> Modern approach to logic sharing</li>
            </ul>
            
            <h3>📊 Advanced Hooks Patterns</h3>
            <ul>
              <li><strong>Custom Hooks:</strong> Extract and reuse stateful logic</li>
              <li><strong>useReducer:</strong> Complex state management</li>
              <li><strong>useImperativeHandle:</strong> Expose imperative API</li>
              <li><strong>useLayoutEffect:</strong> Synchronous side effects</li>
              <li><strong>useDebugValue:</strong> Custom hook debugging</li>
            </ul>
          `,
          codeExample: `// Advanced React Patterns Examples

// 1. Compound Components Pattern
const Tabs = ({ children, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabList = ({ children }) => {
  return <div className="tab-list">{children}</div>;
};

const Tab = ({ index, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={\`tab \${activeTab === index ? 'active' : ''}\`}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};

const TabPanels = ({ children }) => {
  return <div className="tab-panels">{children}</div>;
};

const TabPanel = ({ index, children }) => {
  const { activeTab } = useContext(TabsContext);
  
  return activeTab === index ? (
    <div className="tab-panel">{children}</div>
  ) : null;
};

// Usage
<Tabs defaultTab={0}>
  <TabList>
    <Tab index={0}>Tab 1</Tab>
    <Tab index={1}>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel index={0}>Content 1</TabPanel>
    <TabPanel index={1}>Content 2</TabPanel>
  </TabPanels>
</Tabs>

// 2. Render Props Pattern
const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return children({ data, loading, error });
};

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
      <ul>
        {data.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  }}
</DataFetcher>

// 3. Custom Hook Pattern
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// 4. Higher-Order Component Pattern
const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent(props) {
    if (props.loading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
};

// Usage
const UserList = withLoading(({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
));

// 5. useReducer for Complex State
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.text, completed: false }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        )
      };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
};

const TodoApp = () => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  });

  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', text });
  };

  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', id });
  };

  return (
    <div>
      {/* Todo app UI */}
    </div>
  );
};`
        }
      ],
      exercises: [
        {
          id: 'patterns-exercise',
          question: 'Create a Modal compound component that includes Modal, Modal.Header, Modal.Body, and Modal.Footer. The Modal should manage its own open/close state and provide context to its children.',
          hint: 'Use React Context to share state between compound components. Create a provider that manages the modal state and expose it through context.',
          solution: `import React, { createContext, useContext, useState } from 'react';

// Create Modal Context
const ModalContext = createContext();

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within Modal');
  }
  return context;
};

// Main Modal Component
const Modal = ({ children, isOpen: controlledIsOpen, onClose: controlledOnClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use controlled or uncontrolled state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const onClose = controlledOnClose || (() => setInternalIsOpen(false));
  const onOpen = () => setInternalIsOpen(true);

  const value = {
    isOpen,
    onClose,
    onOpen,
  };

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={value}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

// Modal Header
Modal.Header = ({ children, showCloseButton = true }) => {
  const { onClose } = useModalContext();
  
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h2 className="text-xl font-semibold">{children}</h2>
      {showCloseButton && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
};

// Modal Body
Modal.Body = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

// Modal Footer
Modal.Footer = ({ children }) => {
  return (
    <div className="flex justify-end space-x-2 p-6 border-t bg-gray-50">
      {children}
    </div>
  );
};

// Modal Trigger (optional)
Modal.Trigger = ({ children, asChild = false }) => {
  const { onOpen } = useModalContext();
  
  if (asChild) {
    return React.cloneElement(children, { onClick: onOpen });
  }
  
  return (
    <button onClick={onOpen} className="px-4 py-2 bg-blue-600 text-white rounded">
      {children}
    </button>
  );
};

// Usage Example
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Confirm Action</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this item?</p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-gray-600 border rounded"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              // Handle delete
              setIsModalOpen(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Modal;`
        }
      ]
    }
  ];

  // Initialize with first module and lesson
  useEffect(() => {
    if (courseModules.length > 0) {
      setCurrentModule(courseModules[0]);
      setCurrentLesson(courseModules[0].lessons[0]);
      setCode(courseModules[0].lessons[0].codeExample);
    }
  }, []);

  const navigateToLesson = (moduleId: string, lessonId: string) => {
    const module = courseModules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    
    if (module && lesson) {
      setCurrentModule(module);
      setCurrentLesson(lesson);
      setCode(lesson.codeExample);
      setActiveTab('theory');
    }
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    setCode(fileContents[fileName] || '// File content not available');
  };

  const runCode = () => {
    try {
      setOutput('✅ Code executed successfully!\n\nNote: This is a simulated environment. In a real application, your code would be processed by the appropriate runtime.');
    } catch (error) {
      setOutput(`❌ Error: ${error}`);
    }
  };

  const resetCode = () => {
    if (currentLesson) {
      setCode(currentLesson.codeExample);
      setOutput('');
    }
  };

  const handleSubmitExercise = async () => {
    if (!currentModule || !currentLesson) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const exerciseId = `${currentModule.id}-${currentLesson.id}`;
    setSubmittedExercises(prev => new Set([...prev, exerciseId]));
    setSubmissionMessage('Great work! Your solution has been submitted successfully.');
    setShowSubmissionModal(true);
    setIsSubmitting(false);
  };

  // Get current exercise
  const currentExercise = currentModule?.exercises.find(ex => 
    ex.id === `${currentLesson?.id?.replace('-', '-')}-exercise`
  );

  // Navigation helpers
  const allLessons = courseModules.flatMap(module => 
    module.lessons.map(lesson => ({ ...lesson, moduleId: module.id }))
  );
  
  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === currentLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  if (!currentModule || !currentLesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-lg font-semibold">Frontend Advanced</h2>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {sidebarOpen && (
              <div className="space-y-4">
                {courseModules.map((module, moduleIdx) => (
                  <div key={module.id} className="space-y-2">
                    <h3 className="font-semibold text-sm text-purple-600 dark:text-purple-400">
                      Module {moduleIdx + 1}: {module.title}
                    </h3>
                    <div className="space-y-1 ml-4">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(module.id, lesson.id)}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            currentLesson.id === lesson.id
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : theme === 'dark' 
                                ? 'hover:bg-gray-700 text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          {lessonIdx + 1}. {lesson.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="flex items-center">
                    <Book className="w-4 h-4 mr-1" />
                    {currentModule.title}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    45 min
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Advanced
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Content Area */}
            <div className="flex-1 p-6">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6">
                {['theory', 'exercise'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-purple-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tab === 'theory' && <Book className="w-4 h-4 inline mr-2" />}
                    {tab === 'exercise' && <Code className="w-4 h-4 inline mr-2" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Theory Tab */}
              {activeTab === 'theory' && (
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
                  <div 
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                  />
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">📝 Code Example</h3>
                    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg p-4 overflow-x-auto`}>
                      <pre className="text-sm">
                        <code>{currentLesson.codeExample}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Exercise Tab */}
              {activeTab === 'exercise' && currentExercise && (
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">🎯 Exercise</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{currentExercise.question}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Your Solution:</h4>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={`w-full h-64 p-4 font-mono text-sm border rounded-lg ${
                          theme === 'dark' 
                            ? 'bg-gray-900 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Write your solution here..."
                      />
                      
                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => setCode(currentExercise.solution)}
                          className="flex items-center px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Show Solution
                        </button>
                        
                        <button
                          onClick={handleSubmitExercise}
                          disabled={isSubmitting || submittedExercises.has(`${currentModule.id}-${currentLesson.id}`)}
                          className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                            submittedExercises.has(`${currentModule.id}-${currentLesson.id}`)
                              ? 'bg-green-600 text-white cursor-not-allowed'
                              : isSubmitting
                                ? 'bg-purple-400 text-white cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : submittedExercises.has(`${currentModule.id}-${currentLesson.id}`) ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit Solution
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Hint:</h4>
                      <div className={`${theme === 'dark' ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
                        <p className="text-yellow-800 dark:text-yellow-200">{currentExercise.hint}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => prevLesson && navigateToLesson(prevLesson.moduleId, prevLesson.id)}
                  disabled={!prevLesson}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    !prevLesson
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Lesson
                </button>

                <button
                  onClick={() => nextLesson && navigateToLesson(nextLesson.moduleId, nextLesson.id)}
                  disabled={!nextLesson}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    !nextLesson
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500'
                  }`}
                >
                  Next Lesson
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* File Explorer */}
            <div className={`w-80 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Project Files
                </h3>
              </div>
              
              <div className="p-4">
                <div className="space-y-1">
                  {Object.keys(fileContents).map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => handleFileClick(fileName)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors flex items-center ${
                        selectedFile === fileName
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : theme === 'dark' 
                            ? 'hover:bg-gray-700 text-gray-300' 
                            : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {fileName.includes('/') ? (
                        <Folder className="w-4 h-4 mr-2 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      )}
                      {fileName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">Code Editor</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={runCode}
                        className="flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Run
                      </button>
                      <button
                        onClick={resetCode}
                        className="flex items-center px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`w-full h-64 p-3 font-mono text-xs border rounded ${
                      theme === 'dark' 
                        ? 'bg-gray-900 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Your code here..."
                  />
                  
                  {output && (
                    <div className="mt-3">
                      <h5 className="font-semibold text-xs mb-1">Output:</h5>
                      <div className={`p-2 rounded text-xs font-mono ${
                        theme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {output}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4`}>
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exercise Completed!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{submissionMessage}</p>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLearningFrontendAdvanced;