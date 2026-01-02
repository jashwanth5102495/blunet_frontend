import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import { Play, Book, CheckCircle, Clock, Send, File } from 'lucide-react';

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

const CourseLearningMobileAdvanced: React.FC = () => {
  const { _courseId, _moduleId, _lessonId } = useParams();
  const _navigate = useNavigate();
  const { _theme, _toggleTheme } = useTheme();
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [sidebarOpen, _setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercise'>('theory');
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [submittedExercises, setSubmittedExercises] = useState<Set<string>>(new Set());
  const [_exerciseProgress, _setExerciseProgress] = useState<{[key: string]: number}>({});
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_showPreview, _setShowPreview] = useState(false);
  const [_isFlipping, _setIsFlipping] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Advanced mobile app files
  const fileContents: {[key: string]: string} = {
    'App.tsx': `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import MainNavigator from './src/navigation/MainNavigator';
import LoadingScreen from './src/screens/LoadingScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

// Enable screens for better performance
enableScreens();

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
              <NavigationContainer>
                <MainNavigator />
              </NavigationContainer>
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}`,
    'CameraScreen.tsx': `import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isRecording, setIsRecording] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const recordingAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted' && mediaStatus === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });
        
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        Alert.alert('Success', 'Photo saved to gallery!');
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flashMode}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});`,
    'MapScreen.tsx': `import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      const geocoded = await Location.geocodeAsync(searchQuery);
      if (geocoded.length > 0) {
        const { latitude, longitude } = geocoded[0];
        const newMarker = {
          id: Date.now(),
          coordinate: { latitude, longitude },
          title: searchQuery,
        };
        
        setMarkers(prev => [...prev, newMarker]);
        setSearchQuery('');
      }
    } catch (error) {
      Alert.alert('Error', 'Location not found');
    }
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchLocation}
        />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
  },
  map: { flex: 1 },
});`,
    'store.ts': `import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import postsSlice from './slices/postsSlice';
import mediaSlice from './slices/mediaSlice';
import locationSlice from './slices/locationSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'media'],
};

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  posts: postsSlice,
  media: mediaSlice,
  location: locationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
    'package.json': `{
  "name": "MobileAppAdvanced",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  },
  "dependencies": {
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/native-stack": "^6.9.13",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.2",
    "redux-persist": "^6.0.0",
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.3",
    "expo-camera": "~13.4.2",
    "expo-location": "~16.1.0",
    "react-native-maps": "1.7.1"
  }
}`
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    if (fileContents[fileName]) {
      setCode(fileContents[fileName]);
    }
  };

  // Mobile App Development - Advanced Course
  const courseModules: CourseModule[] = [
    {
      id: 'native-modules-apis',
      title: 'Native Modules & APIs',
      lessons: [
        {
          id: 'camera-media',
          title: 'Camera & Media Integration',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>📸 Advanced Camera & Media Integration</h2>
            <p>Master advanced camera functionality, media processing, and multimedia features in React Native applications.</p>
            
            <h3>📱 Camera Features</h3>
            <ul>
              <li><strong>Photo Capture:</strong> High-quality image capture with custom settings</li>
              <li><strong>Video Recording:</strong> Record videos with quality controls</li>
              <li><strong>Camera Controls:</strong> Flash, focus, zoom, and camera switching</li>
              <li><strong>Real-time Processing:</strong> Apply filters and effects in real-time</li>
            </ul>
            
            <h3>🎬 Media Processing</h3>
            <ul>
              <li><strong>Image Manipulation:</strong> Resize, crop, and apply filters</li>
              <li><strong>Video Editing:</strong> Trim, merge, and add effects to videos</li>
              <li><strong>Audio Recording:</strong> Record and process audio files</li>
              <li><strong>Media Library:</strong> Access and manage device media</li>
            </ul>
            
            <h3>🔧 Advanced Features</h3>
            <ul>
              <li><strong>Custom Camera UI:</strong> Build custom camera interfaces</li>
              <li><strong>AR Integration:</strong> Augmented reality features</li>
              <li><strong>Machine Learning:</strong> Object detection and recognition</li>
              <li><strong>Cloud Storage:</strong> Upload and sync media to cloud services</li>
            </ul>
          `,
          codeExample: `import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

export default function AdvancedCameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isRecording, setIsRecording] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const recordingAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted' && mediaStatus === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: true,
          skipProcessing: false,
        });
        
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        
        // Apply custom processing
        await processImage(photo.uri);
        
        Alert.alert('Success', 'Photo captured and processed!');
      } catch (error) {
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const processImage = async (uri) => {
    // Custom image processing logic
    console.log('Processing image:', uri);
  };

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        
        // Start recording animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(recordingAnimation, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(recordingAnimation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();

        const video = await cameraRef.current.recordAsync({
          quality: Camera.Constants.VideoQuality['1080p'],
          maxDuration: 60,
          mute: false,
        });
        
        const asset = await MediaLibrary.createAssetAsync(video.uri);
        Alert.alert('Success', 'Video recorded successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to record video');
      } finally {
        setIsRecording(false);
        recordingAnimation.setValue(1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flashMode}
        zoom={zoom}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          {/* Recording Indicator */}
          {isRecording && (
            <Animated.View 
              style={[styles.recordingIndicator, { opacity: recordingAnimation }]}
            >
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>REC</Text>
            </Animated.View>
          )}

          {/* Camera Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              onLongPress={startRecording}
            >
              <View style={[styles.captureInner, isRecording && styles.recording]} />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between' },
  recordingIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: { alignItems: 'center', paddingBottom: 50 },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  recording: { backgroundColor: 'red', borderRadius: 8 },
});`,
          exercises: [
            {
              id: 'ex1',
              question: 'Implement a custom camera component with photo capture, video recording, and flash toggle functionality.',
              initialCode: `import React, { useState, useRef } from 'react';\nimport { View, TouchableOpacity } from 'react-native';\nimport { Camera } from 'expo-camera';\n\nexport default function CustomCamera() {\n  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);\n  const cameraRef = useRef(null);\n\n  const takePicture = async () => {\n    // Implement photo capture\n  };\n\n  const toggleFlash = () => {\n    // Implement flash toggle\n  };\n\n  return (\n    <View style={{ flex: 1 }}>\n      {/* Add Camera component and controls */}\n    </View>\n  );\n}`,
              solution: `import React, { useState, useRef, useEffect } from 'react';\nimport { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';\nimport { Camera } from 'expo-camera';\nimport * as MediaLibrary from 'expo-media-library';\nimport { Ionicons } from '@expo/vector-icons';\n\nexport default function CustomCamera() {\n  const [hasPermission, setHasPermission] = useState(null);\n  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);\n  const [isRecording, setIsRecording] = useState(false);\n  const cameraRef = useRef(null);\n\n  useEffect(() => {\n    (async () => {\n      const { status } = await Camera.requestCameraPermissionsAsync();\n      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();\n      setHasPermission(status === 'granted' && mediaStatus === 'granted');\n    })();\n  }, []);\n\n  const takePicture = async () => {\n    if (cameraRef.current) {\n      try {\n        const photo = await cameraRef.current.takePictureAsync({\n          quality: 0.8,\n          base64: false,\n        });\n        await MediaLibrary.createAssetAsync(photo.uri);\n        Alert.alert('Success', 'Photo saved!');\n      } catch (error) {\n        Alert.alert('Error', 'Failed to take picture');\n      }\n    }\n  };\n\n  const toggleFlash = () => {\n    setFlashMode(\n      flashMode === Camera.Constants.FlashMode.off\n        ? Camera.Constants.FlashMode.on\n        : Camera.Constants.FlashMode.off\n    );\n  };\n\n  if (hasPermission === null) {\n    return <View><Text>Requesting permissions...</Text></View>;\n  }\n  if (hasPermission === false) {\n    return <View><Text>No access to camera</Text></View>;\n  }\n\n  return (\n    <View style={styles.container}>\n      <Camera\n        style={styles.camera}\n        flashMode={flashMode}\n        ref={cameraRef}\n      >\n        <View style={styles.overlay}>\n          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>\n            <Ionicons \n              name={flashMode === Camera.Constants.FlashMode.off ? \"flash-off\" : \"flash\"} \n              size={30} \n              color=\"white\" \n            />\n          </TouchableOpacity>\n          \n          <View style={styles.controls}>\n            <TouchableOpacity\n              style={styles.captureButton}\n              onPress={takePicture}\n            >\n              <View style={styles.captureInner} />\n            </TouchableOpacity>\n          </View>\n        </View>\n      </Camera>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1 },\n  camera: { flex: 1 },\n  overlay: { flex: 1, justifyContent: 'space-between' },\n  flashButton: {\n    position: 'absolute',\n    top: 50,\n    right: 20,\n    backgroundColor: 'rgba(0,0,0,0.5)',\n    padding: 10,\n    borderRadius: 25,\n  },\n  controls: { alignItems: 'center', paddingBottom: 50 },\n  captureButton: {\n    width: 80,\n    height: 80,\n    borderRadius: 40,\n    backgroundColor: 'white',\n    justifyContent: 'center',\n    alignItems: 'center',\n  },\n  captureInner: {\n    width: 60,\n    height: 60,\n    borderRadius: 30,\n    backgroundColor: 'white',\n  },\n});`,
              hint: 'Use Camera component with ref, implement takePictureAsync for photos, and toggle flash mode'
            }
          ]
        },
        {
          id: 'location-maps',
          title: 'Location & Maps Integration',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🗺️ Advanced Location & Maps Integration</h2>
            <p>Implement sophisticated location-based features, interactive maps, and geospatial functionality in your React Native applications.</p>
            
            <h3>📍 Location Services</h3>
            <ul>
              <li><strong>GPS Tracking:</strong> Real-time location tracking and monitoring</li>
              <li><strong>Geofencing:</strong> Create virtual boundaries and trigger events</li>
              <li><strong>Location History:</strong> Track and store user movement patterns</li>
              <li><strong>Background Location:</strong> Continue tracking when app is backgrounded</li>
            </ul>
            
            <h3>🗺️ Interactive Maps</h3>
            <ul>
              <li><strong>Custom Markers:</strong> Add interactive markers and annotations</li>
              <li><strong>Route Planning:</strong> Calculate and display optimal routes</li>
              <li><strong>Clustering:</strong> Group nearby markers for better performance</li>
              <li><strong>Offline Maps:</strong> Cache map data for offline usage</li>
            </ul>
            
            <h3>🌐 Advanced Features</h3>
            <ul>
              <li><strong>Geocoding:</strong> Convert addresses to coordinates and vice versa</li>
              <li><strong>Places API:</strong> Search for nearby places and points of interest</li>
              <li><strong>Navigation:</strong> Turn-by-turn navigation integration</li>
              <li><strong>AR Maps:</strong> Augmented reality map overlays</li>
            </ul>
          `,
          codeExample: `import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function AdvancedMapScreen() {
  const [location, setLocation] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [geofences, setGeofences] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const startLocationTracking = async () => {
    setIsTracking(true);
    
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (newLocation) => {
        const newCoord = {
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        };
        
        setLocation(newLocation);
        setRoute(prevRoute => [...prevRoute, newCoord]);
        
        // Check geofences
        checkGeofences(newCoord);
      }
    );

    return subscription;
  };

  const checkGeofences = (currentLocation) => {
    geofences.forEach(geofence => {
      const distance = calculateDistance(
        currentLocation,
        geofence.center
      );
      
      if (distance <= geofence.radius) {
        Alert.alert('Geofence Alert', \`Entered \${geofence.name}\`);
      }
    });
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI/180;
    const φ2 = point2.latitude * Math.PI/180;
    const Δφ = (point2.latitude-point1.latitude) * Math.PI/180;
    const Δλ = (point2.longitude-point1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      const geocoded = await Location.geocodeAsync(searchQuery);
      if (geocoded.length > 0) {
        const { latitude, longitude } = geocoded[0];
        const newMarker = {
          id: Date.now(),
          coordinate: { latitude, longitude },
          title: searchQuery,
          description: 'Search result',
        };
        
        setMarkers(prev => [...prev, newMarker]);
        
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        
        setSearchQuery('');
      }
    } catch (error) {
      Alert.alert('Error', 'Location not found');
    }
  };

  const addGeofence = (event) => {
    const { coordinate } = event.nativeEvent;
    const newGeofence = {
      id: Date.now(),
      center: coordinate,
      radius: 100, // 100 meters
      name: \`Geofence \${geofences.length + 1}\`,
    };
    
    setGeofences(prev => [...prev, newGeofence]);
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchLocation}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onLongPress={addGeofence}
        showsUserLocation={true}
        followsUserLocation={isTracking}
      >
        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}

        {/* Route */}
        {route.length > 1 && (
          <Polyline
            coordinates={route}
            strokeColor="#007AFF"
            strokeWidth={3}
          />
        )}

        {/* Geofences */}
        {geofences.map((geofence) => (
          <Circle
            key={geofence.id}
            center={geofence.center}
            radius={geofence.radius}
            fillColor="rgba(0, 122, 255, 0.2)"
            strokeColor="rgba(0, 122, 255, 0.8)"
            strokeWidth={2}
          />
        ))}
      </MapView>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isTracking && styles.trackingActive]} 
          onPress={isTracking ? () => setIsTracking(false) : startLocationTracking}
        >
          <Ionicons name={isTracking ? "stop" : "play"} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: { flex: 1 },
  controlsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    zIndex: 1,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingActive: { backgroundColor: '#FF3B30' },
});`,
          exercises: [
            {
              id: 'ex2',
              question: 'Create a map component with location search, custom markers, and geofencing capabilities.',
              initialCode: `import React, { useState, useEffect } from 'react';\nimport { View, TextInput, TouchableOpacity } from 'react-native';\nimport MapView, { Marker } from 'react-native-maps';\nimport * as Location from 'expo-location';\n\nexport default function MapComponent() {\n  const [location, setLocation] = useState(null);\n  const [searchQuery, setSearchQuery] = useState('');\n  const [markers, setMarkers] = useState([]);\n\n  const searchLocation = async () => {\n    // Implement location search\n  };\n\n  const addMarker = (event) => {\n    // Implement marker addition\n  };\n\n  return (\n    <View style={{ flex: 1 }}>\n      {/* Add search input and map */}\n    </View>\n  );\n}`,
              solution: `import React, { useState, useEffect, useRef } from 'react';\nimport { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';\nimport MapView, { Marker, Circle } from 'react-native-maps';\nimport * as Location from 'expo-location';\nimport { Ionicons } from '@expo/vector-icons';\n\nexport default function MapComponent() {\n  const [location, setLocation] = useState(null);\n  const [searchQuery, setSearchQuery] = useState('');\n  const [markers, setMarkers] = useState([]);\n  const [geofences, setGeofences] = useState([]);\n  const mapRef = useRef(null);\n\n  useEffect(() => {\n    (async () => {\n      const { status } = await Location.requestForegroundPermissionsAsync();\n      if (status === 'granted') {\n        const currentLocation = await Location.getCurrentPositionAsync({});\n        setLocation(currentLocation);\n      }\n    })();\n  }, []);\n\n  const searchLocation = async () => {\n    if (!searchQuery.trim()) return;\n\n    try {\n      const geocoded = await Location.geocodeAsync(searchQuery);\n      if (geocoded.length > 0) {\n        const { latitude, longitude } = geocoded[0];\n        const newMarker = {\n          id: Date.now(),\n          coordinate: { latitude, longitude },\n          title: searchQuery,\n        };\n        \n        setMarkers(prev => [...prev, newMarker]);\n        \n        mapRef.current?.animateToRegion({\n          latitude,\n          longitude,\n          latitudeDelta: 0.01,\n          longitudeDelta: 0.01,\n        });\n        \n        setSearchQuery('');\n      }\n    } catch (error) {\n      Alert.alert('Error', 'Location not found');\n    }\n  };\n\n  const addMarker = (event) => {\n    const { coordinate } = event.nativeEvent;\n    const newMarker = {\n      id: Date.now(),\n      coordinate,\n      title: 'Custom Marker',\n    };\n    setMarkers(prev => [...prev, newMarker]);\n  };\n\n  const addGeofence = (event) => {\n    const { coordinate } = event.nativeEvent;\n    const newGeofence = {\n      id: Date.now(),\n      center: coordinate,\n      radius: 100,\n      name: \`Geofence \${geofences.length + 1}\`,\n    };\n    setGeofences(prev => [...prev, newGeofence]);\n  };\n\n  if (!location) {\n    return <View style={styles.container}><Text>Loading...</Text></View>;\n  }\n\n  return (\n    <View style={styles.container}>\n      <View style={styles.searchContainer}>\n        <TextInput\n          style={styles.searchInput}\n          placeholder=\"Search location...\"\n          value={searchQuery}\n          onChangeText={setSearchQuery}\n          onSubmitEditing={searchLocation}\n        />\n        <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>\n          <Ionicons name=\"search\" size={20} color=\"white\" />\n        </TouchableOpacity>\n      </View>\n\n      <MapView\n        ref={mapRef}\n        style={styles.map}\n        initialRegion={{\n          latitude: location.coords.latitude,\n          longitude: location.coords.longitude,\n          latitudeDelta: 0.01,\n          longitudeDelta: 0.01,\n        }}\n        onPress={addMarker}\n        onLongPress={addGeofence}\n        showsUserLocation={true}\n      >\n        {markers.map((marker) => (\n          <Marker\n            key={marker.id}\n            coordinate={marker.coordinate}\n            title={marker.title}\n          />\n        ))}\n        \n        {geofences.map((geofence) => (\n          <Circle\n            key={geofence.id}\n            center={geofence.center}\n            radius={geofence.radius}\n            fillColor=\"rgba(0, 122, 255, 0.2)\"\n            strokeColor=\"rgba(0, 122, 255, 0.8)\"\n            strokeWidth={2}\n          />\n        ))}\n      </MapView>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1 },\n  searchContainer: {\n    position: 'absolute',\n    top: 50,\n    left: 20,\n    right: 20,\n    zIndex: 1,\n    flexDirection: 'row',\n  },\n  searchInput: {\n    flex: 1,\n    backgroundColor: 'white',\n    paddingHorizontal: 15,\n    paddingVertical: 10,\n    borderRadius: 25,\n    fontSize: 16,\n  },\n  searchButton: {\n    backgroundColor: '#007AFF',\n    paddingHorizontal: 15,\n    paddingVertical: 10,\n    borderRadius: 25,\n    marginLeft: 10,\n    justifyContent: 'center',\n    alignItems: 'center',\n  },\n  map: { flex: 1 },\n});`,
              hint: 'Use expo-location for geocoding, MapView for displaying maps, and event handlers for adding markers and geofences'
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
          id: 'memory-management',
          title: 'Memory Management & Optimization',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>⚡ Advanced Performance Optimization</h2>
            <p>Master advanced techniques for optimizing React Native app performance, memory usage, and user experience.</p>
            
            <h3>🧠 Memory Management</h3>
            <ul>
              <li><strong>Memory Leaks:</strong> Identify and prevent common memory leak patterns</li>
              <li><strong>Component Lifecycle:</strong> Proper cleanup in useEffect and component unmounting</li>
              <li><strong>Image Optimization:</strong> Efficient image loading and caching strategies</li>
              <li><strong>Large Lists:</strong> Virtualization and optimization for large datasets</li>
            </ul>
            
            <h3>🚀 Rendering Optimization</h3>
            <ul>
              <li><strong>React.memo:</strong> Prevent unnecessary re-renders</li>
              <li><strong>useMemo & useCallback:</strong> Optimize expensive calculations and functions</li>
              <li><strong>FlatList Optimization:</strong> Advanced FlatList performance techniques</li>
              <li><strong>Native Driver:</strong> Use native animations for better performance</li>
            </ul>
            
            <h3>📊 Performance Monitoring</h3>
            <ul>
              <li><strong>Flipper Integration:</strong> Debug performance issues with Flipper</li>
              <li><strong>Performance Metrics:</strong> Measure and track app performance</li>
              <li><strong>Bundle Analysis:</strong> Optimize bundle size and loading times</li>
              <li><strong>Profiling Tools:</strong> Use React DevTools and native profilers</li>
            </ul>
          `,
          codeExample: `import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

// Memoized list item component
const ListItem = memo(({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={() => onPress(item.id)}>
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
        // Optimize image loading
        loadingIndicatorSource={{ uri: 'placeholder.jpg' }}
      />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
});

const OptimizedListScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Memoize expensive calculations
  const filteredData = useMemo(() => {
    return data.filter(item => item.isActive);
  }, [data]);

  // Memoize callback functions
  const handleItemPress = useCallback((itemId) => {
    console.log('Item pressed:', itemId);
    // Navigate or perform action
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Fetch fresh data
      const newData = await fetchData();
      setData(newData);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Optimize FlatList rendering
  const renderItem = useCallback(({ item }) => (
    <ListItem item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        const result = await fetchData();
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load data:', error);
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        // Pull to refresh
        refreshing={refreshing}
        onRefresh={handleRefresh}
        // Memory optimization
        onEndReachedThreshold={0.5}
        onEndReached={loadMoreData}
      />
    </View>
  );
};

// Memory management utilities
class MemoryManager {
  static imageCache = new Map();
  static maxCacheSize = 50;

  static cacheImage(uri, imageData) {
    if (this.imageCache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.imageCache.keys().next().value;
      this.imageCache.delete(firstKey);
    }
    this.imageCache.set(uri, imageData);
  }

  static getCachedImage(uri) {
    return this.imageCache.get(uri);
  }

  static clearCache() {
    this.imageCache.clear();
  }
}

// Performance monitoring hook
const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // 60fps threshold
        console.warn(\`\${componentName} render time: \${renderTime}ms\`);
      }
    };
  });
};

const ITEM_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: ITEM_HEIGHT,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default OptimizedListScreen;`,
          exercises: [
            {
              id: 'ex3',
              question: 'Optimize a FlatList component for better performance with large datasets, including memoization and proper cleanup.',
              initialCode: `import React, { useState, useEffect } from 'react';\nimport { View, Text, FlatList, TouchableOpacity } from 'react-native';\n\nconst ListScreen = () => {\n  const [data, setData] = useState([]);\n\n  const renderItem = ({ item }) => (\n    <TouchableOpacity>\n      <Text>{item.title}</Text>\n    </TouchableOpacity>\n  );\n\n  useEffect(() => {\n    // Load data\n    fetchData().then(setData);\n  }, []);\n\n  return (\n    <View>\n      <FlatList\n        data={data}\n        renderItem={renderItem}\n      />\n    </View>\n  );\n};\n\nexport default ListScreen;`,
              solution: `import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';\nimport { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';\n\n// Memoized list item component\nconst ListItem = memo(({ item, onPress }) => {\n  return (\n    <TouchableOpacity style={styles.listItem} onPress={() => onPress(item.id)}>\n      <Text style={styles.itemTitle}>{item.title}</Text>\n      <Text style={styles.itemDescription}>{item.description}</Text>\n    </TouchableOpacity>\n  );\n});\n\nconst ITEM_HEIGHT = 80;\n\nconst OptimizedListScreen = () => {\n  const [data, setData] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  // Memoize filtered data\n  const filteredData = useMemo(() => {\n    return data.filter(item => item.isActive);\n  }, [data]);\n\n  // Memoize callback functions\n  const handleItemPress = useCallback((itemId) => {\n    console.log('Item pressed:', itemId);\n  }, []);\n\n  const renderItem = useCallback(({ item }) => (\n    <ListItem item={item} onPress={handleItemPress} />\n  ), [handleItemPress]);\n\n  const getItemLayout = useCallback((data, index) => ({\n    length: ITEM_HEIGHT,\n    offset: ITEM_HEIGHT * index,\n    index,\n  }), []);\n\n  const keyExtractor = useCallback((item) => item.id.toString(), []);\n\n  useEffect(() => {\n    let isMounted = true;\n    \n    const loadData = async () => {\n      try {\n        const result = await fetchData();\n        if (isMounted) {\n          setData(result);\n          setLoading(false);\n        }\n      } catch (error) {\n        if (isMounted) {\n          console.error('Failed to load data:', error);\n          setLoading(false);\n        }\n      }\n    };\n\n    loadData();\n\n    // Cleanup function to prevent memory leaks\n    return () => {\n      isMounted = false;\n    };\n  }, []);\n\n  if (loading) {\n    return (\n      <View style={styles.loadingContainer}>\n        <Text>Loading...</Text>\n      </View>\n    );\n  }\n\n  return (\n    <View style={styles.container}>\n      <FlatList\n        data={filteredData}\n        renderItem={renderItem}\n        keyExtractor={keyExtractor}\n        getItemLayout={getItemLayout}\n        // Performance optimizations\n        removeClippedSubviews={true}\n        maxToRenderPerBatch={10}\n        updateCellsBatchingPeriod={50}\n        initialNumToRender={10}\n        windowSize={10}\n      />\n    </View>\n  );\n};\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    backgroundColor: '#f5f5f5',\n  },\n  loadingContainer: {\n    flex: 1,\n    justifyContent: 'center',\n    alignItems: 'center',\n  },\n  listItem: {\n    padding: 16,\n    backgroundColor: 'white',\n    marginVertical: 4,\n    marginHorizontal: 16,\n    borderRadius: 8,\n    height: ITEM_HEIGHT,\n  },\n  itemTitle: {\n    fontSize: 16,\n    fontWeight: 'bold',\n    color: '#333',\n  },\n  itemDescription: {\n    fontSize: 14,\n    color: '#666',\n    marginTop: 4,\n  },\n});\n\nexport default OptimizedListScreen;`,
              hint: 'Use React.memo for list items, useCallback for functions, useMemo for expensive calculations, and FlatList performance props'
            }
          ]
        }
      ]
    }
  ];

  // Initialize with first module and lesson
  useEffect(() => {
    if (courseModules.length > 0) {
      const firstModule = courseModules[0];
      const firstLesson = firstModule.lessons[0];
      setCurrentModule(firstModule);
      setCurrentLesson(firstLesson);
      setCode(firstLesson.codeExample);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunCode = () => {
    try {
      // Simulate code execution
      setOutput('Code executed successfully!\n\nOutput:\nComponent rendered with advanced mobile features.');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleSubmitExercise = async () => {
    if (!currentExerciseId) return;
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setSubmittedExercises(prev => new Set([...prev, currentExerciseId]));
      setSubmissionMessage('Exercise submitted successfully! Great work on the mobile app development.');
      setShowSubmissionModal(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleNextLesson = () => {
    // Navigate to next lesson logic
    console.log('Navigate to next lesson');
  };

  if (!currentModule || !currentLesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mobile App Development - Advanced
            </h2>
          </div>
          
          <div className="overflow-y-auto flex-1 pb-20">
            {courseModules.map((module) => (
              <div key={module.id} className="border-b border-gray-100 dark:border-gray-700">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300">
                  {module.title}
                </div>
                <div>
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setCurrentModule(module);
                        setCurrentLesson(lesson);
                        setCode(lesson.codeExample);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        currentLesson?.id === lesson.id
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-r-4 border-purple-600'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {lesson.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
             <div>
               <h1 className="text-xl font-bold text-gray-900 dark:text-white">{currentLesson.title}</h1>
               <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                 <span className="flex items-center"><Book className="w-4 h-4 mr-1" /> {currentModule.title}</span>
                 <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> 45 min</span>
               </div>
             </div>
             <div className="flex space-x-2">
               {['theory', 'exercise'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                     activeTab === tab
                       ? 'bg-purple-600 text-white'
                       : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                   }`}
                 >
                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'theory' ? (
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                  <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Code Example</h3>
                    <pre className="text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                      <code>{currentLesson.codeExample}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentLesson.exercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exercise</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">{exercise.question}</p>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Hint</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{exercise.hint}</p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setCurrentExerciseId(exercise.id);
                            handleSubmitExercise();
                          }}
                          disabled={submittedExercises.has(exercise.id) || isSubmitting}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                            submittedExercises.has(exercise.id)
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {submittedExercises.has(exercise.id) ? (
                            <><CheckCircle className="w-4 h-4 mr-2" /> Completed</>
                          ) : isSubmitting && currentExerciseId === exercise.id ? (
                            <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" /> Submitting...</>
                          ) : (
                            <><Send className="w-4 h-4 mr-2" /> Submit Solution</>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel: Code Editor & Files */}
            <div className="w-96 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
              {/* File Explorer Header */}
              <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex space-x-2">
                 <button 
                   onClick={() => setShowFileExplorer(!showFileExplorer)}
                   className={`flex-1 py-1 px-2 rounded text-xs font-medium ${showFileExplorer ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Files
                 </button>
                 <button 
                   onClick={() => setShowFileExplorer(false)}
                   className={`flex-1 py-1 px-2 rounded text-xs font-medium ${!showFileExplorer ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Editor
                 </button>
              </div>

              {showFileExplorer ? (
                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Project Files</h3>
                  <div className="space-y-1">
                    {Object.keys(fileContents).map(fileName => (
                      <button
                        key={fileName}
                        onClick={() => handleFileClick(fileName)}
                        className={`w-full flex items-center p-2 rounded-md text-sm ${
                          selectedFile === fileName 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                            : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <File className="w-4 h-4 mr-2 opacity-70" />
                        {fileName}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 relative">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-xs resize-none focus:outline-none"
                      placeholder="// Write your React Native code here..."
                    />
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500">Console Output</span>
                      <button
                        onClick={handleRunCode}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center"
                      >
                        <Play className="w-3 h-3 mr-1" /> Run
                      </button>
                    </div>
                    <div className="h-32 bg-gray-900 rounded-lg p-2 font-mono text-xs text-green-400 overflow-y-auto whitespace-pre-wrap">
                      {output || '> Ready to execute...'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 text-center transform transition-all scale-100">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Excellent Work!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{submissionMessage}</p>
            <button
              onClick={() => setShowSubmissionModal(false)}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLearningMobileAdvanced;
