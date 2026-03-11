import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import { ArrowLeft, Play, Book, Code, CheckCircle, Lightbulb, Award, Send, Sun, Moon, RotateCcw, FolderOpen, File } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  codeExample: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  question: string;
  initialCode: string;
  solution: string;
  hint: string;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

const CourseLearningMobileIntermediate = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercise'>('theory');
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [submittedExercises, setSubmittedExercises] = useState<Set<string>>(new Set());
  const [, setExerciseProgress] = useState<{[key: string]: number}>({});
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Mobile app files
  const fileContents: {[key: string]: string} = {
    'App.js': `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen 
            name="Main" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}`,
    'HomeScreen.js': `import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, likePost } from '../store/slices/postsSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(state => state.posts);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchPosts());
    setRefreshing(false);
  };

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Text style={[styles.actionText, item.liked && styles.liked]}>
            ❤️ {item.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 {item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>🔄 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (error) {
    Alert.alert('Error', error);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  postContainer: {
    backgroundColor: 'white',
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    color: '#666',
    fontSize: 14,
  },
  liked: {
    color: '#ff3040',
  },
});

export default HomeScreen;`,
    'store.js': `import { configureStore } from '@reduxjs/toolkit';
import postsSlice from './slices/postsSlice';
import userSlice from './slices/userSlice';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    posts: postsSlice,
    user: userSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
    'postsSlice.js': `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.example.com/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for liking a post
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(\`https://api.example.com/posts/\${postId}/like\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePost: (state, action) => {
      const { postId, updates } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const postId = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.liked = !post.liked;
          post.likes += post.liked ? 1 : -1;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, updatePost } = postsSlice.actions;
export default postsSlice.reducer;`,
    'package.json': `{
  "name": "MobileAppIntermediate",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo eject"
  },
  "dependencies": {
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/stack": "^6.3.17",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.2",
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.3",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-gesture-handler": "~2.12.0",
    "expo-status-bar": "~1.6.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14",
    "@types/react-native": "~0.72.2",
    "typescript": "^5.1.3"
  }
}`
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    if (fileContents[fileName]) {
      setCode(fileContents[fileName]);
    }
  };

  // Mobile App Development - Intermediate Course
  const courseModules: CourseModule[] = [
    {
      id: 'react-native-advanced',
      title: 'Advanced React Native',
      lessons: [
        {
          id: 'navigation-patterns',
          title: 'Navigation Patterns',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🧭 Advanced Navigation in React Native</h2>
            <p>Learn how to implement complex navigation patterns including stack navigation, tab navigation, and drawer navigation using React Navigation v6.</p>
            
            <h3>📱 Navigation Types</h3>
            <ul>
              <li><strong>Stack Navigator:</strong> Manages a stack of screens with push/pop transitions</li>
              <li><strong>Tab Navigator:</strong> Bottom or top tab-based navigation</li>
              <li><strong>Drawer Navigator:</strong> Side drawer navigation menu</li>
              <li><strong>Modal Navigation:</strong> Present screens as modals</li>
            </ul>
            
            <h3>🔧 Key Features</h3>
            <ul>
              <li><strong>Nested Navigation:</strong> Combine different navigators</li>
              <li><strong>Deep Linking:</strong> Handle URLs and universal links</li>
              <li><strong>Navigation State:</strong> Manage and persist navigation state</li>
              <li><strong>Custom Transitions:</strong> Create custom screen transitions</li>
              <li><strong>Header Customization:</strong> Customize navigation headers</li>
            </ul>
            
            <h3>🎯 Best Practices</h3>
            <ul>
              <li>Use TypeScript for type-safe navigation</li>
              <li>Implement proper screen options and params</li>
              <li>Handle navigation events and listeners</li>
              <li>Optimize performance with lazy loading</li>
            </ul>
          `,
          codeExample: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Tab Navigator Component
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App with Nested Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={({ route }) => ({ 
            title: route.params.title,
            headerBackTitleVisible: false,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
          exercises: [
            {
              id: 'ex1',
              question: 'Create a Tab Navigator with three screens: Home, Search, and Profile. Include proper icons and styling.',
              initialCode: `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';\n\nconst Tab = createBottomTabNavigator();\n\nfunction TabNavigator() {\n  return (\n    // Add Tab.Navigator here\n  );\n}`,
              solution: `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';\nimport Icon from 'react-native-vector-icons/Ionicons';\n\nconst Tab = createBottomTabNavigator();\n\nfunction TabNavigator() {\n  return (\n    <Tab.Navigator\n      screenOptions={({ route }) => ({\n        tabBarIcon: ({ focused, color, size }) => {\n          let iconName;\n          if (route.name === 'Home') {\n            iconName = focused ? 'home' : 'home-outline';\n          } else if (route.name === 'Search') {\n            iconName = focused ? 'search' : 'search-outline';\n          } else if (route.name === 'Profile') {\n            iconName = focused ? 'person' : 'person-outline';\n          }\n          return <Icon name={iconName} size={size} color={color} />;\n        },\n        tabBarActiveTintColor: '#007AFF',\n        tabBarInactiveTintColor: 'gray',\n      })}\n    >\n      <Tab.Screen name="Home" component={HomeScreen} />\n      <Tab.Screen name="Search" component={SearchScreen} />\n      <Tab.Screen name="Profile" component={ProfileScreen} />\n    </Tab.Navigator>\n  );\n}`,
              hint: 'Use screenOptions to configure icons and colors for each tab'
            }
          ]
        },
        {
          id: 'state-management-redux',
          title: 'State Management with Redux Toolkit',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🔄 Redux Toolkit for State Management</h2>
            <p>Master advanced state management patterns using Redux Toolkit, including async operations, middleware, and performance optimization.</p>
            
            <h3>🛠️ Redux Toolkit Features</h3>
            <ul>
              <li><strong>createSlice:</strong> Simplified reducer and action creation</li>
              <li><strong>createAsyncThunk:</strong> Handle async operations</li>
              <li><strong>RTK Query:</strong> Powerful data fetching and caching</li>
              <li><strong>configureStore:</strong> Store setup with good defaults</li>
            </ul>
            
            <h3>📊 Advanced Patterns</h3>
            <ul>
              <li><strong>Normalized State:</strong> Structure data efficiently</li>
              <li><strong>Selectors:</strong> Compute derived state with reselect</li>
              <li><strong>Middleware:</strong> Custom middleware for side effects</li>
              <li><strong>DevTools:</strong> Debug with Redux DevTools</li>
            </ul>
            
            <h3>⚡ Performance Optimization</h3>
            <ul>
              <li>Use React.memo and useCallback for components</li>
              <li>Implement proper selector patterns</li>
              <li>Avoid unnecessary re-renders</li>
              <li>Use RTK Query for efficient data fetching</li>
            </ul>
          `,
          codeExample: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for API calls
export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(\`/api/users/\${userId}/posts\`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice with reducers and extraReducers
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filter: 'all',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    addPost: (state, action) => {
      state.items.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const { id, updates } = action.payload;
      const existingPost = state.items.find(post => post.id === id);
      if (existingPost) {
        Object.assign(existingPost, updates);
      }
    },
    removePost: (state, action) => {
      state.items = state.items.filter(post => post.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, addPost, updatePost, removePost } = postsSlice.actions;
export default postsSlice.reducer;`,
          exercises: [
            {
              id: 'ex2',
              question: 'Create a Redux slice for managing a shopping cart with actions to add, remove, and update item quantities.',
              initialCode: `import { createSlice } from '@reduxjs/toolkit';\n\nconst cartSlice = createSlice({\n  name: 'cart',\n  initialState: {\n    items: [],\n    total: 0,\n  },\n  reducers: {\n    // Add reducers here\n  },\n});\n\nexport default cartSlice.reducer;`,
              solution: `import { createSlice } from '@reduxjs/toolkit';\n\nconst cartSlice = createSlice({\n  name: 'cart',\n  initialState: {\n    items: [],\n    total: 0,\n  },\n  reducers: {\n    addItem: (state, action) => {\n      const existingItem = state.items.find(item => item.id === action.payload.id);\n      if (existingItem) {\n        existingItem.quantity += 1;\n      } else {\n        state.items.push({ ...action.payload, quantity: 1 });\n      }\n      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);\n    },\n    removeItem: (state, action) => {\n      state.items = state.items.filter(item => item.id !== action.payload);\n      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);\n    },\n    updateQuantity: (state, action) => {\n      const { id, quantity } = action.payload;\n      const item = state.items.find(item => item.id === id);\n      if (item) {\n        item.quantity = quantity;\n        if (quantity <= 0) {\n          state.items = state.items.filter(item => item.id !== id);\n        }\n      }\n      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);\n    },\n    clearCart: (state) => {\n      state.items = [];\n      state.total = 0;\n    },\n  },\n});\n\nexport const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;\nexport default cartSlice.reducer;`,
              hint: 'Include actions for addItem, removeItem, updateQuantity, and clearCart. Remember to update the total.'
            }
          ]
        }
      ]
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization',
      lessons: [
        {
          id: 'rendering-optimization',
          title: 'Rendering Optimization',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>⚡ React Native Performance Optimization</h2>
            <p>Learn advanced techniques to optimize your React Native app's performance, including rendering optimization, memory management, and bundle size reduction.</p>
            
            <h3>🎯 Rendering Optimization</h3>
            <ul>
              <li><strong>React.memo:</strong> Prevent unnecessary re-renders</li>
              <li><strong>useMemo & useCallback:</strong> Memoize expensive calculations</li>
              <li><strong>FlatList optimization:</strong> Efficient list rendering</li>
              <li><strong>Image optimization:</strong> Lazy loading and caching</li>
            </ul>
            
            <h3>📱 Native Performance</h3>
            <ul>
              <li><strong>Bridge optimization:</strong> Minimize bridge calls</li>
              <li><strong>Native modules:</strong> Move heavy operations to native</li>
              <li><strong>Threading:</strong> Use background threads for processing</li>
              <li><strong>Memory management:</strong> Prevent memory leaks</li>
            </ul>
            
            <h3>📦 Bundle Optimization</h3>
            <ul>
              <li><strong>Code splitting:</strong> Dynamic imports and lazy loading</li>
              <li><strong>Tree shaking:</strong> Remove unused code</li>
              <li><strong>Asset optimization:</strong> Compress images and fonts</li>
              <li><strong>Metro bundler:</strong> Configure for optimal builds</li>
            </ul>
          `,
          codeExample: `import React, { memo, useMemo, useCallback } from 'react';
import { FlatList, View, Text, Image, TouchableOpacity } from 'react-native';

// Memoized list item component
const ListItem = memo(({ item, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.item}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
});

// Optimized list component
const OptimizedList = ({ data, onItemPress }) => {
  // Memoize filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => item.isVisible);
  }, [data]);

  // Memoize render item function
  const renderItem = useCallback(({ item }) => (
    <ListItem item={item} onPress={onItemPress} />
  ), [onItemPress]);

  // Memoize key extractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <FlatList
      data={filteredData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: 80,
        offset: 80 * index,
        index,
      })}
    />
  );
};

export default OptimizedList;`,
          exercises: [
            {
              id: 'ex3',
              question: 'Optimize a component that renders a list of user profiles. Use React.memo, useMemo, and useCallback appropriately.',
              initialCode: `import React from 'react';\nimport { FlatList, View, Text, Image } from 'react-native';\n\nconst UserProfile = ({ user, onPress }) => {\n  return (\n    <View>\n      <Image source={{ uri: user.avatar }} />\n      <Text>{user.name}</Text>\n      <Text>{user.email}</Text>\n    </View>\n  );\n};\n\nconst UserList = ({ users, onUserPress }) => {\n  return (\n    <FlatList\n      data={users}\n      renderItem={({ item }) => (\n        <UserProfile user={item} onPress={onUserPress} />\n      )}\n    />\n  );\n};`,
              solution: `import React, { memo, useCallback } from 'react';\nimport { FlatList, View, Text, Image, TouchableOpacity } from 'react-native';\n\nconst UserProfile = memo(({ user, onPress }) => {\n  const handlePress = useCallback(() => {\n    onPress(user.id);\n  }, [user.id, onPress]);\n\n  return (\n    <TouchableOpacity onPress={handlePress}>\n      <View style={styles.container}>\n        <Image source={{ uri: user.avatar }} style={styles.avatar} />\n        <View style={styles.info}>\n          <Text style={styles.name}>{user.name}</Text>\n          <Text style={styles.email}>{user.email}</Text>\n        </View>\n      </View>\n    </TouchableOpacity>\n  );\n});\n\nconst UserList = ({ users, onUserPress }) => {\n  const renderItem = useCallback(({ item }) => (\n    <UserProfile user={item} onPress={onUserPress} />\n  ), [onUserPress]);\n\n  const keyExtractor = useCallback((item) => item.id.toString(), []);\n\n  return (\n    <FlatList\n      data={users}\n      renderItem={renderItem}\n      keyExtractor={keyExtractor}\n      removeClippedSubviews={true}\n      maxToRenderPerBatch={10}\n      initialNumToRender={10}\n    />\n  );\n};`,
              hint: 'Use memo for UserProfile, useCallback for event handlers and render functions, and optimize FlatList props'
            }
          ]
        }
      ]
    },
    {
      id: 'testing-debugging',
      title: 'Testing & Debugging',
      lessons: [
        {
          id: 'unit-testing',
          title: 'Unit Testing with Jest',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🧪 Testing React Native Applications</h2>
            <p>Learn comprehensive testing strategies for React Native apps, including unit tests, integration tests, and end-to-end testing.</p>
            
            <h3>🔬 Testing Types</h3>
            <ul>
              <li><strong>Unit Tests:</strong> Test individual components and functions</li>
              <li><strong>Integration Tests:</strong> Test component interactions</li>
              <li><strong>Snapshot Tests:</strong> Prevent unintended UI changes</li>
              <li><strong>E2E Tests:</strong> Test complete user workflows</li>
            </ul>
            
            <h3>🛠️ Testing Tools</h3>
            <ul>
              <li><strong>Jest:</strong> JavaScript testing framework</li>
              <li><strong>React Native Testing Library:</strong> Component testing utilities</li>
              <li><strong>Detox:</strong> End-to-end testing framework</li>
              <li><strong>Flipper:</strong> Debugging and profiling tool</li>
            </ul>
            
            <h3>📋 Best Practices</h3>
            <ul>
              <li>Write tests before implementing features (TDD)</li>
              <li>Test user interactions, not implementation details</li>
              <li>Use meaningful test descriptions</li>
              <li>Mock external dependencies and API calls</li>
              <li>Maintain good test coverage</li>
            </ul>
          `,
          codeExample: `import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginScreen from '../LoginScreen';
import authSlice from '../store/authSlice';

// Mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: initialState,
  });
};

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const store = createMockStore();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const store = createMockStore();
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('submits form with valid credentials', async () => {
    const store = createMockStore();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });

  it('handles login error correctly', async () => {
    const store = createMockStore({
      auth: { error: 'Invalid credentials' }
    });
    
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(getByText('Invalid credentials')).toBeTruthy();
  });
});

// Snapshot test
describe('LoginScreen Snapshots', () => {
  it('matches snapshot', () => {
    const store = createMockStore();
    const tree = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });
});`,
          exercises: [
            {
              id: 'ex4',
              question: 'Write unit tests for a Counter component that has increment, decrement, and reset functionality.',
              initialCode: `import React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport Counter from '../Counter';\n\ndescribe('Counter', () => {\n  it('renders with initial count of 0', () => {\n    // Test initial render\n  });\n\n  it('increments count when + button is pressed', () => {\n    // Test increment functionality\n  });\n\n  // Add more tests\n});`,
              solution: `import React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport Counter from '../Counter';\n\ndescribe('Counter', () => {\n  it('renders with initial count of 0', () => {\n    const { getByText } = render(<Counter />);\n    expect(getByText('Count: 0')).toBeTruthy();\n  });\n\n  it('increments count when + button is pressed', () => {\n    const { getByText } = render(<Counter />);\n    const incrementButton = getByText('+');\n    \n    fireEvent.press(incrementButton);\n    expect(getByText('Count: 1')).toBeTruthy();\n  });\n\n  it('decrements count when - button is pressed', () => {\n    const { getByText } = render(<Counter />);\n    const decrementButton = getByText('-');\n    \n    fireEvent.press(decrementButton);\n    expect(getByText('Count: -1')).toBeTruthy();\n  });\n\n  it('resets count to 0 when reset button is pressed', () => {\n    const { getByText } = render(<Counter />);\n    const incrementButton = getByText('+');\n    const resetButton = getByText('Reset');\n    \n    // Increment first\n    fireEvent.press(incrementButton);\n    fireEvent.press(incrementButton);\n    expect(getByText('Count: 2')).toBeTruthy();\n    \n    // Then reset\n    fireEvent.press(resetButton);\n    expect(getByText('Count: 0')).toBeTruthy();\n  });\n\n  it('handles multiple operations correctly', () => {\n    const { getByText } = render(<Counter />);\n    const incrementButton = getByText('+');\n    const decrementButton = getByText('-');\n    \n    fireEvent.press(incrementButton);\n    fireEvent.press(incrementButton);\n    fireEvent.press(decrementButton);\n    \n    expect(getByText('Count: 1')).toBeTruthy();\n  });\n});`,
              hint: 'Test initial render, increment/decrement functionality, reset functionality, and multiple operations'
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    if (moduleId && lessonId) {
      const module = courseModules.find(m => m.id === moduleId);
      if (module) {
        setCurrentModule(module);
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
          setCurrentLesson(lesson);
          setCode(lesson.codeExample);
        }
      }
    } else if (courseModules.length > 0) {
      setCurrentModule(courseModules[0]);
      setCurrentLesson(courseModules[0].lessons[0]);
      setCode(courseModules[0].lessons[0].codeExample);
    }
  }, [moduleId, lessonId]);

  if (!currentModule || !currentLesson) {
    return <div>Loading...</div>;
  }

  const currentExercise = currentExerciseId 
    ? currentLesson.exercises.find(ex => ex.id === currentExerciseId)
    : null;

  const runCode = () => {
    try {
      setOutput('Code execution simulated successfully!\n\nIn a real mobile development environment, this would:\n- Compile your React Native code\n- Run on iOS/Android simulator\n- Execute the mobile application\n- Show results in the device/simulator');
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  const submitExercise = async () => {
    if (!currentExercise) return;
    
    setIsSubmitting(true);
    setSubmissionMessage('Submitting your solution...');
    setShowSubmissionModal(true);
    
    setTimeout(() => {
      setSubmittedExercises(prev => new Set([...prev, currentExercise.id]));
      setExerciseProgress(prev => ({
        ...prev,
        [currentExercise.id]: 100
      }));
      setSubmissionMessage('Great job! Your solution has been submitted successfully.');
      setIsSubmitting(false);
      
      setTimeout(() => {
        setShowSubmissionModal(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/courses')}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {sidebarOpen && 'Back to Courses'}
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Code className="w-5 h-5" />
              </button>
            </div>
            {sidebarOpen && (
              <div className="mt-4">
                <h3 className="font-semibold text-white mb-2">{currentModule.title}</h3>
                <p className="text-sm text-gray-400">Mobile App Development - Intermediate</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {currentModule.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/course-learning-mobile-intermediate/mobile-intermediate/${moduleId}/${lesson.id}`)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      lesson.id === lessonId
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-xs opacity-75">Lesson {index + 1}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Progress
                </h4>
                <div className="text-sm text-gray-300">
                  <div>Completed: {submittedExercises.size} exercises</div>
                  <div>Current Module: {currentModule.title}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className={`border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex">
              <button
                onClick={() => setActiveTab('theory')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'theory'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Book className="w-4 h-4 inline mr-2" />
                Theory
              </button>
              <button
                onClick={() => setActiveTab('exercise')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'exercise'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Exercise
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Theory/Exercise Content */}
            <div className={`${showFileExplorer ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
              {activeTab === 'theory' && (
                <div className="h-full overflow-y-auto p-6">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">{currentLesson.title}</h1>
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'exercise' && (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Practice Exercises</h2>
                    <div className="flex flex-wrap gap-2">
                      {currentLesson.exercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          onClick={() => {
                            setCurrentExerciseId(exercise.id);
                            setCode(exercise.initialCode);
                          }}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentExerciseId === exercise.id
                              ? 'bg-blue-600 text-white'
                              : submittedExercises.has(exercise.id)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {submittedExercises.has(exercise.id) && <CheckCircle className="w-4 h-4 inline mr-1" />}
                          Exercise {exercise.id.slice(-1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentExercise && (
                    <div className="flex-1 flex">
                      <div className="w-1/2 p-4 border-r border-gray-700">
                        <h3 className="font-semibold mb-2">Question:</h3>
                        <p className="text-gray-300 mb-4">{currentExercise.question}</p>
                        
                        <div className="mb-4">
                          <button
                            onClick={() => setCode(currentExercise.solution)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors mr-2"
                          >
                            <Lightbulb className="w-4 h-4 inline mr-1" />
                            Show Solution
                          </button>
                          <button
                            onClick={() => setCode(currentExercise.initialCode)}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4 inline mr-1" />
                            Reset
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          <strong>Hint:</strong> {currentExercise.hint}
                        </div>
                      </div>

                      <div className="w-1/2 flex flex-col">
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Your Solution:</h3>
                            <div className="flex gap-2">
                              <button
                                onClick={runCode}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                <Play className="w-4 h-4 inline mr-1" />
                                Run
                              </button>
                              <button
                                onClick={submitExercise}
                                disabled={submittedExercises.has(currentExercise.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                <Send className="w-4 h-4 inline mr-1" />
                                Submit
                              </button>
                            </div>
                          </div>
                          <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-64 p-3 bg-gray-800 text-white font-mono text-sm rounded border border-gray-600 resize-none"
                            placeholder="Write your solution here..."
                          />
                        </div>

                        {output && (
                          <div className="p-4 border-t border-gray-700">
                            <h3 className="font-semibold mb-2">Output:</h3>
                            <pre className="bg-gray-800 p-3 rounded text-sm text-green-400 whitespace-pre-wrap">
                              {output}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* File Explorer */}
            {showFileExplorer && (
              <div className="w-1/3 border-l border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Project Files</h3>
                    <button
                      onClick={() => setShowFileExplorer(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {Object.keys(fileContents).map((fileName) => (
                      <button
                        key={fileName}
                        onClick={() => handleFileClick(fileName)}
                        className={`w-full text-left p-2 rounded hover:bg-gray-700 transition-colors ${
                          selectedFile === fileName ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <File className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-sm">{fileName}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Toolbar */}
          <div className={`border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFileExplorer(!showFileExplorer)}
                  className={`flex items-center px-3 py-2 rounded transition-colors ${
                    showFileExplorer 
                      ? 'bg-blue-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Files
                </button>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded transition-colors ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Mobile App Development - Intermediate</span>
                <span>•</span>
                <span>{currentLesson.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              ) : (
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              )}
              <p className="text-white">{submissionMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLearningMobileIntermediate;
