import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import { 
  ArrowLeft, 
  Book, 
  Code, 
  Play, 
  Send, 
  CheckCircle, 
  Lightbulb,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
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

const CourseLearningBrowserExtensions: React.FC = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercise'>('theory');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [currentExerciseId, setCurrentExerciseId] = useState<string>('');
  const [submittedExercises, setSubmittedExercises] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Sample project files for browser extension development
  const fileContents: { [key: string]: string } = {
    'manifest.json': `{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0",
  "description": "A sample browser extension",
  "permissions": [
    "activeTab",
    "storage",
    "tabs"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "My Extension"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}`,
    'popup.html': `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 300px;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .container {
      text-align: center;
    }
    button {
      background: #4285f4;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
    }
    button:hover {
      background: #3367d6;
    }
    #status {
      margin-top: 10px;
      padding: 10px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>My Extension</h2>
    <button id="actionBtn">Click Me!</button>
    <div id="status"></div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`,
    'popup.js': `document.addEventListener('DOMContentLoaded', function() {
  const actionBtn = document.getElementById('actionBtn');
  const status = document.getElementById('status');
  
  actionBtn.addEventListener('click', function() {
    // Get current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      // Send message to content script
      chrome.tabs.sendMessage(currentTab.id, {
        action: 'highlight',
        data: 'Hello from popup!'
      }, function(response) {
        if (response) {
          status.textContent = 'Action completed!';
          status.style.background = '#d4edda';
          status.style.color = '#155724';
        }
      });
    });
  });
  
  // Load saved data
  chrome.storage.sync.get(['extensionData'], function(result) {
    if (result.extensionData) {
      status.textContent = 'Data loaded: ' + result.extensionData;
    }
  });
});`,
    'content.js': `// Content script - runs on web pages
console.log('Content script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'highlight') {
    // Highlight all paragraphs on the page
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.backgroundColor = '#ffff99';
      p.style.transition = 'background-color 0.3s';
    });
    
    // Save data to storage
    chrome.storage.sync.set({
      extensionData: 'Highlighted ' + paragraphs.length + ' paragraphs'
    });
    
    sendResponse({success: true});
  }
});

// Add a floating button to the page
const floatingBtn = document.createElement('div');
floatingBtn.innerHTML = '🔧';
floatingBtn.style.cssText = \`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: #4285f4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10000;
  font-size: 20px;
\`;

floatingBtn.addEventListener('click', function() {
  alert('Extension button clicked!');
});

document.body.appendChild(floatingBtn);`,
    'background.js': `// Service worker for Manifest V3
console.log('Background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    console.log('Extension installed');
    
    // Set default storage values
    chrome.storage.sync.set({
      extensionSettings: {
        enabled: true,
        theme: 'light'
      }
    });
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
    
    // Update badge text
    chrome.action.setBadgeText({
      text: '✓',
      tabId: tabId
    });
    
    chrome.action.setBadgeBackgroundColor({
      color: '#4285f4'
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getData') {
    chrome.storage.sync.get(['extensionData'], function(result) {
      sendResponse({data: result.extensionData});
    });
    return true; // Keep message channel open
  }
});

// Context menu
chrome.contextMenus.create({
  id: 'myExtensionMenu',
  title: 'My Extension Action',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'myExtensionMenu') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'processSelection',
      text: info.selectionText
    });
  }
});`
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    setCode(fileContents[fileName]);
  };

  const courseModules: CourseModule[] = [
    {
      id: 'extension-fundamentals',
      title: 'Extension Fundamentals',
      lessons: [
        {
          id: 'intro-extensions',
          title: 'Introduction to Browser Extensions',
          videoUrl: 'https://example.com/video1',
          content: `
            <h2>🌐 Welcome to Browser Extension Development</h2>
            <p>Browser extensions are small software programs that customize and enhance the browsing experience. They enable users to tailor Chrome functionality and behavior to individual needs or preferences.</p>
            
            <h3>What You'll Learn</h3>
            <ul>
              <li><strong>Extension Architecture:</strong> Understanding the different components and how they interact</li>
              <li><strong>Manifest Files:</strong> The blueprint that defines your extension's capabilities</li>
              <li><strong>Content Scripts:</strong> JavaScript that runs in the context of web pages</li>
              <li><strong>Background Scripts:</strong> Event-driven scripts that handle browser events</li>
              <li><strong>Popup UI:</strong> Creating interactive user interfaces</li>
              <li><strong>Storage & Permissions:</strong> Managing data and requesting necessary permissions</li>
            </ul>
            
            <h3>Extension Types</h3>
            <p><strong>Content Enhancement:</strong> Modify web page content and behavior</p>
            <p><strong>Productivity Tools:</strong> Add functionality to improve user workflow</p>
            <p><strong>Developer Tools:</strong> Extend browser developer capabilities</p>
            <p><strong>Theme Extensions:</strong> Customize browser appearance</p>
            
            <h3>Development Environment</h3>
            <p>You'll need a text editor, Chrome browser, and basic knowledge of HTML, CSS, and JavaScript. Extensions are built using web technologies you already know!</p>
          `,
          codeExample: `// Basic extension structure
{
  "manifest_version": 3,
  "name": "My First Extension",
  "version": "1.0",
  "description": "A simple extension example",
  
  "permissions": ["activeTab"],
  
  "action": {
    "default_popup": "popup.html"
  },
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}`,
          exercises: [
            {
              id: 'ex1',
              question: 'Create a basic manifest.json file for an extension called "Page Highlighter" that can access the current tab and includes a popup interface.',
              initialCode: '// Create your manifest.json structure here\n{\n  \n}',
              solution: '{\n  "manifest_version": 3,\n  "name": "Page Highlighter",\n  "version": "1.0",\n  "description": "Highlight important content on web pages",\n  "permissions": ["activeTab"],\n  "action": {\n    "default_popup": "popup.html",\n    "default_title": "Page Highlighter"\n  }\n}',
              hint: 'Remember to include manifest_version, name, version, description, permissions, and action properties'
            }
          ]
        },
        {
          id: 'manifest-permissions',
          title: 'Manifest Files and Permissions',
          videoUrl: 'https://example.com/video2',
          content: `
            <h2>📋 Understanding Manifest Files</h2>
            <p>The manifest file is the blueprint of your extension. It tells Chrome what your extension does, what permissions it needs, and how it should behave.</p>
            
            <h3>Manifest V3 vs V2</h3>
            <p><strong>Manifest V3</strong> is the latest version with improved security, performance, and privacy features:</p>
            <ul>
              <li>Service workers replace background pages</li>
              <li>Enhanced security with remote code restrictions</li>
              <li>Improved performance with lazy loading</li>
              <li>Better privacy controls</li>
            </ul>
            
            <h3>Essential Manifest Properties</h3>
            <p><strong>manifest_version:</strong> Specifies the manifest format version (use 3)</p>
            <p><strong>name:</strong> Extension name displayed to users</p>
            <p><strong>version:</strong> Extension version for updates</p>
            <p><strong>description:</strong> Brief description of functionality</p>
            
            <h3>Permission Types</h3>
            <p><strong>activeTab:</strong> Access to currently active tab when user invokes extension</p>
            <p><strong>storage:</strong> Use Chrome storage APIs</p>
            <p><strong>tabs:</strong> Access to tab information</p>
            <p><strong>host permissions:</strong> Access to specific websites</p>
            
            <h3>Action vs Page Action</h3>
            <p>Use <code>action</code> for extensions that work on most pages, and <code>page_action</code> for extensions that only work on specific pages.</p>
          `,
          codeExample: `{
  "manifest_version": 3,
  "name": "Advanced Extension",
  "version": "2.1.0",
  "description": "An extension with comprehensive permissions",
  
  "permissions": [
    "activeTab",
    "storage",
    "contextMenus",
    "notifications"
  ],
  
  "host_permissions": [
    "https://*.example.com/*"
  ],
  
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  
  "background": {
    "service_worker": "background.js"
  },
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["styles.css"]
  }],
  
  "web_accessible_resources": [{
    "resources": ["images/*"],
    "matches": ["<all_urls>"]
  }]
}`,
          exercises: [
            {
              id: 'ex2',
              question: 'Create a comprehensive manifest for a "Social Media Manager" extension that needs access to storage, notifications, context menus, and specific social media sites.',
              initialCode: '// Create a complete manifest with all necessary permissions\n{\n  "manifest_version": 3,\n  // Add your configuration here\n}',
              solution: '{\n  "manifest_version": 3,\n  "name": "Social Media Manager",\n  "version": "1.0.0",\n  "description": "Manage your social media presence efficiently",\n  "permissions": [\n    "storage",\n    "notifications",\n    "contextMenus",\n    "activeTab"\n  ],\n  "host_permissions": [\n    "https://*.facebook.com/*",\n    "https://*.twitter.com/*",\n    "https://*.instagram.com/*",\n    "https://*.linkedin.com/*"\n  ],\n  "action": {\n    "default_popup": "popup.html",\n    "default_title": "Social Media Manager"\n  },\n  "background": {\n    "service_worker": "background.js"\n  },\n  "content_scripts": [{\n    "matches": ["https://*.facebook.com/*", "https://*.twitter.com/*"],\n    "js": ["content.js"]\n  }]\n}',
              hint: 'Include permissions for storage, notifications, contextMenus, and host_permissions for social media domains'
            }
          ]
        }
      ]
    },
    {
      id: 'content-background-scripts',
      title: 'Content Scripts & Background Scripts',
      lessons: [
        {
          id: 'content-scripts',
          title: 'Working with Content Scripts',
          videoUrl: 'https://example.com/video3',
          content: `
            <h2>📜 Content Scripts Deep Dive</h2>
            <p>Content scripts are JavaScript files that run in the context of web pages. They can read and modify the DOM, but run in an isolated environment.</p>
            
            <h3>Content Script Capabilities</h3>
            <ul>
              <li><strong>DOM Access:</strong> Read and modify page elements</li>
              <li><strong>CSS Injection:</strong> Add custom styles to pages</li>
              <li><strong>Event Handling:</strong> Listen to page events</li>
              <li><strong>Message Passing:</strong> Communicate with other extension components</li>
            </ul>
            
            <h3>Injection Methods</h3>
            <p><strong>Declarative:</strong> Defined in manifest.json, automatically injected</p>
            <p><strong>Programmatic:</strong> Injected dynamically using chrome.scripting API</p>
            
            <h3>Execution Context</h3>
            <p>Content scripts run in an isolated world - they can access the DOM but not the page's JavaScript variables or functions directly.</p>
            
            <h3>Best Practices</h3>
            <ul>
              <li>Minimize DOM manipulation for performance</li>
              <li>Use event delegation for dynamic content</li>
              <li>Handle page navigation and dynamic loading</li>
              <li>Implement proper error handling</li>
            </ul>
          `,
          codeExample: `// content.js - Advanced content script example
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    initializeExtension();
  }
  
  function initializeExtension() {
    console.log('Extension content script loaded');
    
    // Create floating toolbar
    createFloatingToolbar();
    
    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener(handleMessage);
    
    // Observe DOM changes
    observePageChanges();
  }
  
  function createFloatingToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'extension-toolbar';
    toolbar.innerHTML = \`
      <button id="highlight-btn">Highlight</button>
      <button id="save-btn">Save</button>
      <button id="share-btn">Share</button>
    \`;
    
    // Apply styles
    Object.assign(toolbar.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: '10000',
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    });
    
    document.body.appendChild(toolbar);
    
    // Add event listeners
    toolbar.addEventListener('click', handleToolbarClick);
  }
  
  function handleToolbarClick(event) {
    const action = event.target.id;
    
    switch(action) {
      case 'highlight-btn':
        highlightSelection();
        break;
      case 'save-btn':
        savePageData();
        break;
      case 'share-btn':
        shareContent();
        break;
    }
  }
  
  function highlightSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = '#ffff99';
      span.style.padding = '2px';
      
      try {
        range.surroundContents(span);
        selection.removeAllRanges();
      } catch (e) {
        console.error('Could not highlight selection:', e);
      }
    }
  }
  
  function savePageData() {
    const pageData = {
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      highlights: getHighlights()
    };
    
    chrome.runtime.sendMessage({
      action: 'saveData',
      data: pageData
    });
  }
  
  function getHighlights() {
    const highlights = [];
    const highlightedElements = document.querySelectorAll('span[style*="background-color: rgb(255, 255, 153)"]');
    
    highlightedElements.forEach(el => {
      highlights.push({
        text: el.textContent,
        position: getElementPosition(el)
      });
    });
    
    return highlights;
  }
  
  function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    };
  }
  
  function shareContent() {
    const selectedText = window.getSelection().toString();
    const shareData = {
      title: document.title,
      text: selectedText || 'Check out this page!',
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(\`\${shareData.text} - \${shareData.url}\`);
      showNotification('Content copied to clipboard!');
    }
  }
  
  function handleMessage(request, sender, sendResponse) {
    switch(request.action) {
      case 'getPageInfo':
        sendResponse({
          title: document.title,
          url: window.location.href,
          wordCount: document.body.innerText.split(/\s+/).length
        });
        break;
        
      case 'highlightText':
        highlightTextBySelector(request.selector);
        sendResponse({success: true});
        break;
        
      case 'removeHighlights':
        removeAllHighlights();
        sendResponse({success: true});
        break;
    }
  }
  
  function highlightTextBySelector(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.backgroundColor = '#ffff99';
      el.style.transition = 'background-color 0.3s';
    });
  }
  
  function removeAllHighlights() {
    const highlighted = document.querySelectorAll('[style*="background-color: rgb(255, 255, 153)"]');
    highlighted.forEach(el => {
      el.style.backgroundColor = '';
    });
  }
  
  function observePageChanges() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          // Handle dynamically added content
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Process new elements
              processNewElements(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  function processNewElements(element) {
    // Add functionality to dynamically loaded content
    const buttons = element.querySelectorAll('button, .clickable');
    buttons.forEach(btn => {
      btn.addEventListener('click', function() {
        console.log('Dynamic button clicked:', btn.textContent);
      });
    });
  }
  
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = \`
      position: fixed;
      top: 50px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10001;
      animation: slideIn 0.3s ease-out;
    \`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = \`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  \`;
  document.head.appendChild(style);
  
})();`,
          exercises: [
            {
              id: 'ex3',
              question: 'Create a content script that adds a "Reading Time" indicator to blog posts by calculating words and displaying estimated reading time.',
              initialCode: '// Create a content script that calculates and displays reading time\n(function() {\n  // Your code here\n})();',
              solution: '(function() {\n  function calculateReadingTime() {\n    const text = document.body.innerText;\n    const words = text.split(/\\s+/).length;\n    const wordsPerMinute = 200;\n    const minutes = Math.ceil(words / wordsPerMinute);\n    return minutes;\n  }\n  \n  function addReadingTimeIndicator() {\n    const readingTime = calculateReadingTime();\n    const indicator = document.createElement("div");\n    indicator.innerHTML = `📖 ${readingTime} min read`;\n    indicator.style.cssText = `\n      position: fixed;\n      top: 10px;\n      left: 10px;\n      background: #333;\n      color: white;\n      padding: 8px 12px;\n      border-radius: 20px;\n      font-size: 12px;\n      z-index: 10000;\n    `;\n    document.body.appendChild(indicator);\n  }\n  \n  if (document.readyState === "loading") {\n    document.addEventListener("DOMContentLoaded", addReadingTimeIndicator);\n  } else {\n    addReadingTimeIndicator();\n  }\n})();',
              hint: 'Calculate words by splitting text on whitespace, use average reading speed of 200 words per minute, and create a fixed position indicator'
            }
          ]
        },
        {
          id: 'background-scripts',
          title: 'Background Scripts and Service Workers',
          videoUrl: 'https://example.com/video4',
          content: `
            <h2>⚙️ Background Scripts & Service Workers</h2>
            <p>Background scripts handle events and manage extension lifecycle. In Manifest V3, they're implemented as service workers for better performance and security.</p>
            
            <h3>Service Worker vs Background Page</h3>
            <p><strong>Service Workers (MV3):</strong></p>
            <ul>
              <li>Event-driven and terminate when idle</li>
              <li>Better performance and battery life</li>
              <li>No DOM access</li>
              <li>Persistent storage required for state</li>
            </ul>
            
            <p><strong>Background Pages (MV2):</strong></p>
            <ul>
              <li>Always running or event-based</li>
              <li>Full JavaScript environment</li>
              <li>Higher resource usage</li>
            </ul>
            
            <h3>Common Background Script Tasks</h3>
            <ul>
              <li>Handle extension installation and updates</li>
              <li>Manage context menus and browser actions</li>
              <li>Process messages from content scripts</li>
              <li>Perform background data synchronization</li>
              <li>Handle alarms and scheduled tasks</li>
            </ul>
            
            <h3>Event Listeners</h3>
            <p>Service workers use event listeners to respond to browser events like tab updates, extension installation, and message passing.</p>
          `,
          codeExample: `// background.js - Service Worker for Manifest V3
console.log('Background service worker loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // First time installation
    initializeExtension();
  } else if (details.reason === 'update') {
    // Extension updated
    handleExtensionUpdate(details.previousVersion);
  }
});

function initializeExtension() {
  // Set default settings
  chrome.storage.sync.set({
    settings: {
      enabled: true,
      theme: 'light',
      notifications: true
    },
    userData: {
      installDate: Date.now(),
      usage: 0
    }
  });
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'mainMenu',
    title: 'My Extension',
    contexts: ['selection', 'page']
  });
  
  // Set up alarms
  chrome.alarms.create('dailySync', {
    delayInMinutes: 1,
    periodInMinutes: 1440 // 24 hours
  });
}

function handleExtensionUpdate(previousVersion) {
  console.log('Updated from version:', previousVersion);
  
  // Migrate data if needed
  chrome.storage.sync.get(['settings'], function(result) {
    if (result.settings && !result.settings.newFeature) {
      result.settings.newFeature = true;
      chrome.storage.sync.set({settings: result.settings});
    }
  });
}

// Handle tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab completed loading:', tab.url);
    
    // Update badge
    updateBadge(tabId, tab.url);
    
    // Track page visits
    trackPageVisit(tab.url);
  }
});

function updateBadge(tabId, url) {
  // Show different badge based on site
  if (url.includes('github.com')) {
    chrome.action.setBadgeText({text: 'GH', tabId: tabId});
    chrome.action.setBadgeBackgroundColor({color: '#333'});
  } else if (url.includes('stackoverflow.com')) {
    chrome.action.setBadgeText({text: 'SO', tabId: tabId});
    chrome.action.setBadgeBackgroundColor({color: '#f48024'});
  } else {
    chrome.action.setBadgeText({text: '', tabId: tabId});
  }
}

function trackPageVisit(url) {
  chrome.storage.local.get(['visitHistory'], function(result) {
    const history = result.visitHistory || [];
    history.push({
      url: url,
      timestamp: Date.now()
    });
    
    // Keep only last 100 visits
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    chrome.storage.local.set({visitHistory: history});
  });
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received:', request);
  
  switch(request.action) {
    case 'saveData':
      handleSaveData(request.data, sendResponse);
      break;
      
    case 'getData':
      handleGetData(request.query, sendResponse);
      break;
      
    case 'syncData':
      handleDataSync(sendResponse);
      break;
      
    case 'showNotification':
      showNotification(request.title, request.message);
      sendResponse({success: true});
      break;
      
    default:
      console.log('Unknown action:', request.action);
      sendResponse({error: 'Unknown action'});
  }
  
  return true; // Keep message channel open for async response
});

function handleSaveData(data, sendResponse) {
  const key = 'savedData_' + Date.now();
  chrome.storage.sync.set({[key]: data}, function() {
    if (chrome.runtime.lastError) {
      sendResponse({error: chrome.runtime.lastError.message});
    } else {
      sendResponse({success: true, key: key});
    }
  });
}

function handleGetData(query, sendResponse) {
  chrome.storage.sync.get(null, function(items) {
    const results = [];
    
    for (let key in items) {
      if (key.startsWith('savedData_') && 
          items[key].title && 
          items[key].title.toLowerCase().includes(query.toLowerCase())) {
        results.push({key: key, data: items[key]});
      }
    }
    
    sendResponse({results: results});
  });
}

function handleDataSync(sendResponse) {
  // Simulate API sync
  fetch('https://api.example.com/sync', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({userId: 'user123'})
  })
  .then(response => response.json())
  .then(data => {
    sendResponse({success: true, data: data});
  })
  .catch(error => {
    sendResponse({error: error.message});
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log('Context menu clicked:', info.menuItemId);
  
  if (info.menuItemId === 'mainMenu') {
    if (info.selectionText) {
      // Process selected text
      processSelectedText(info.selectionText, tab);
    } else {
      // Process entire page
      chrome.tabs.sendMessage(tab.id, {
        action: 'processPage'
      });
    }
  }
});

function processSelectedText(text, tab) {
  // Analyze selected text
  const wordCount = text.split(/\s+/).length;
  const charCount = text.length;
  
  // Show notification with analysis
  showNotification('Text Analysis', 
    \`Selected: \${wordCount} words, \${charCount} characters\`);
  
  // Save to storage
  chrome.storage.local.set({
    lastSelection: {
      text: text,
      url: tab.url,
      timestamp: Date.now()
    }
  });
}

// Handle alarms
chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log('Alarm triggered:', alarm.name);
  
  if (alarm.name === 'dailySync') {
    performDailySync();
  }
});

function performDailySync() {
  // Clean up old data
  chrome.storage.local.get(['visitHistory'], function(result) {
    if (result.visitHistory) {
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const recentHistory = result.visitHistory.filter(
        visit => visit.timestamp > oneDayAgo
      );
      
      chrome.storage.local.set({visitHistory: recentHistory});
    }
  });
  
  // Update usage statistics
  chrome.storage.sync.get(['userData'], function(result) {
    if (result.userData) {
      result.userData.usage += 1;
      result.userData.lastSync = Date.now();
      chrome.storage.sync.set({userData: result.userData});
    }
  });
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: title,
    message: message
  });
}

// Handle extension startup
chrome.runtime.onStartup.addListener(function() {
  console.log('Extension started');
  
  // Restore any necessary state
  chrome.storage.local.get(['extensionState'], function(result) {
    if (result.extensionState) {
      console.log('Restored state:', result.extensionState);
    }
  });
});

// Handle extension suspend (cleanup)
chrome.runtime.onSuspend.addListener(function() {
  console.log('Extension suspending');
  
  // Save current state
  chrome.storage.local.set({
    extensionState: {
      suspended: true,
      timestamp: Date.now()
    }
  });
});`,
          exercises: [
            {
              id: 'ex4',
              question: 'Create a background service worker that tracks user productivity by monitoring active tabs and showing daily statistics via notifications.',
              initialCode: '// Create a background service worker for productivity tracking\nchrome.runtime.onInstalled.addListener(function(details) {\n  // Initialize tracking\n});\n\n// Add your tracking logic here',
              solution: 'chrome.runtime.onInstalled.addListener(function(details) {\n  if (details.reason === "install") {\n    chrome.storage.sync.set({\n      productivityData: {\n        dailyStats: {},\n        totalTime: 0\n      }\n    });\n    \n    chrome.alarms.create("dailyReport", {\n      delayInMinutes: 1,\n      periodInMinutes: 1440\n    });\n  }\n});\n\nlet activeTabStart = Date.now();\nlet currentTabId = null;\n\nchrome.tabs.onActivated.addListener(function(activeInfo) {\n  trackTimeSpent();\n  currentTabId = activeInfo.tabId;\n  activeTabStart = Date.now();\n});\n\nchrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {\n  if (changeInfo.status === "complete" && tabId === currentTabId) {\n    trackSiteVisit(tab.url);\n  }\n});\n\nfunction trackTimeSpent() {\n  if (currentTabId) {\n    const timeSpent = Date.now() - activeTabStart;\n    chrome.storage.sync.get(["productivityData"], function(result) {\n      const data = result.productivityData || {dailyStats: {}, totalTime: 0};\n      const today = new Date().toDateString();\n      \n      if (!data.dailyStats[today]) {\n        data.dailyStats[today] = {totalTime: 0, sites: {}};\n      }\n      \n      data.dailyStats[today].totalTime += timeSpent;\n      data.totalTime += timeSpent;\n      \n      chrome.storage.sync.set({productivityData: data});\n    });\n  }\n}\n\nfunction trackSiteVisit(url) {\n  if (!url) return;\n  \n  const domain = new URL(url).hostname;\n  const today = new Date().toDateString();\n  \n  chrome.storage.sync.get(["productivityData"], function(result) {\n    const data = result.productivityData || {dailyStats: {}, totalTime: 0};\n    \n    if (!data.dailyStats[today]) {\n      data.dailyStats[today] = {totalTime: 0, sites: {}};\n    }\n    \n    if (!data.dailyStats[today].sites[domain]) {\n      data.dailyStats[today].sites[domain] = 0;\n    }\n    \n    data.dailyStats[today].sites[domain]++;\n    chrome.storage.sync.set({productivityData: data});\n  });\n}\n\nchrome.alarms.onAlarm.addListener(function(alarm) {\n  if (alarm.name === "dailyReport") {\n    showDailyReport();\n  }\n});\n\nfunction showDailyReport() {\n  chrome.storage.sync.get(["productivityData"], function(result) {\n    const data = result.productivityData;\n    const today = new Date().toDateString();\n    const todayStats = data.dailyStats[today];\n    \n    if (todayStats) {\n      const hours = Math.round(todayStats.totalTime / (1000 * 60 * 60) * 10) / 10;\n      const topSite = Object.keys(todayStats.sites).reduce((a, b) => \n        todayStats.sites[a] > todayStats.sites[b] ? a : b, "");\n      \n      chrome.notifications.create({\n        type: "basic",\n        iconUrl: "icon.png",\n        title: "Daily Productivity Report",\n        message: `Today: ${hours}h active, most visited: ${topSite}`\n      });\n    }\n  });\n}',
              hint: 'Use chrome.tabs.onActivated and chrome.tabs.onUpdated to track tab changes, chrome.storage to persist data, and chrome.alarms for daily reports'
            }
          ]
        }
      ]
    },
    {
      id: 'ui-storage',
      title: 'User Interface & Storage',
      lessons: [
        {
          id: 'popup-ui',
          title: 'Creating Extension Popups',
          videoUrl: 'https://example.com/video5',
          content: `
            <h2>🎨 Building Extension Popups</h2>
            <p>Extension popups provide a quick interface for users to interact with your extension. They appear when users click the extension icon in the toolbar.</p>
            
            <h3>Popup Characteristics</h3>
            <ul>
              <li><strong>Size Constraints:</strong> Minimum 25x25px, maximum 800x600px</li>
              <li><strong>Temporary:</strong> Closes when user clicks outside</li>
              <li><strong>No Persistent State:</strong> Reloads each time it opens</li>
              <li><strong>Limited APIs:</strong> Cannot use some Chrome APIs directly</li>
            </ul>
            
            <h3>Design Best Practices</h3>
            <p><strong>Keep it Simple:</strong> Focus on primary actions</p>
            <p><strong>Fast Loading:</strong> Minimize external resources</p>
            <p><strong>Responsive Design:</strong> Work well at different sizes</p>
            <p><strong>Clear Actions:</strong> Make buttons and controls obvious</p>
            
            <h3>Communication Patterns</h3>
            <p>Popups communicate with background scripts and content scripts through message passing to perform actions and retrieve data.</p>
            
            <h3>State Management</h3>
            <p>Since popups reload each time, use Chrome storage APIs to persist user preferences and application state.</p>
          `,
          codeExample: `<!-- popup.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 350px;
      min-height: 400px;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    
    .header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .content {
      padding: 20px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    
    .stat-number {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 12px;
      opacity: 0.8;
    }
    
    .controls {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .btn-primary {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    .btn-primary:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-1px);
    }
    
    .btn-secondary {
      background: transparent;
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    .btn-secondary:hover {
      background: rgba(255,255,255,0.1);
    }
    
    .toggle-switch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .switch {
      position: relative;
      width: 50px;
      height: 24px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .switch.active {
      background: #4CAF50;
    }
    
    .switch-handle {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s;
    }
    
    .switch.active .switch-handle {
      transform: translateX(26px);
    }
    
    .footer {
      padding: 15px 20px;
      border-top: 1px solid rgba(255,255,255,0.2);
      text-align: center;
    }
    
    .footer a {
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      font-size: 12px;
    }
    
    .loading {
      display: none;
      text-align: center;
      padding: 20px;
    }
    
    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .notification {
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 12px;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1000;
    }
    
    .notification.show {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 Productivity Tracker</h1>
  </div>
  
  <div class="content">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number" id="todayTime">0h</div>
        <div class="stat-label">Today</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="totalSites">0</div>
        <div class="stat-label">Sites Visited</div>
      </div>
    </div>
    
    <div class="toggle-switch">
      <span>Tracking Enabled</span>
      <div class="switch" id="trackingToggle">
        <div class="switch-handle"></div>
      </div>
    </div>
    
    <div class="controls">
      <button class="btn btn-primary" id="highlightBtn">
        ✨ Highlight Page
      </button>
      
      <button class="btn btn-primary" id="savePageBtn">
        💾 Save Current Page
      </button>
      
      <button class="btn btn-secondary" id="viewStatsBtn">
        📊 View Detailed Stats
      </button>
      
      <button class="btn btn-secondary" id="exportDataBtn">
        📤 Export Data
      </button>
    </div>
  </div>
  
  <div class="loading" id="loading">
    <div class="spinner"></div>
    <div>Processing...</div>
  </div>
  
  <div class="footer">
    <a href="#" id="settingsLink">Settings</a> | 
    <a href="#" id="helpLink">Help</a>
  </div>
  
  <div class="notification" id="notification"></div>
  
  <script src="popup.js"></script>
</body>
</html>`,
          exercises: [
            {
              id: 'ex5',
              question: 'Create a popup interface for a "Website Blocker" extension with toggle switches for different categories (social media, news, entertainment) and a timer display.',
              initialCode: '<!-- Create popup.html for Website Blocker -->\n<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    /* Add your styles here */\n  </style>\n</head>\n<body>\n  <!-- Add your HTML structure here -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { width: 300px; padding: 20px; font-family: Arial, sans-serif; }\n    .header { text-align: center; margin-bottom: 20px; }\n    .category { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }\n    .switch { position: relative; width: 50px; height: 24px; background: #ccc; border-radius: 12px; cursor: pointer; }\n    .switch.active { background: #4CAF50; }\n    .switch-handle { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.3s; }\n    .switch.active .switch-handle { transform: translateX(26px); }\n    .timer { text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; color: #333; }\n    .controls { display: flex; flex-direction: column; gap: 10px; }\n    .btn { padding: 10px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }\n    .btn-primary { background: #4285f4; color: white; }\n    .btn-secondary { background: #f1f3f4; color: #333; }\n  </style>\n</head>\n<body>\n  <div class="header">\n    <h2>🚫 Website Blocker</h2>\n  </div>\n  \n  <div class="timer" id="timer">00:00:00</div>\n  \n  <div class="category">\n    <span>Social Media</span>\n    <div class="switch" data-category="social">\n      <div class="switch-handle"></div>\n    </div>\n  </div>\n  \n  <div class="category">\n    <span>News Sites</span>\n    <div class="switch" data-category="news">\n      <div class="switch-handle"></div>\n    </div>\n  </div>\n  \n  <div class="category">\n    <span>Entertainment</span>\n    <div class="switch" data-category="entertainment">\n      <div class="switch-handle"></div>\n    </div>\n  </div>\n  \n  <div class="controls">\n    <button class="btn btn-primary" id="pauseBtn">Pause Blocking</button>\n    <button class="btn btn-secondary" id="statsBtn">View Statistics</button>\n  </div>\n  \n  <script>\n    // Timer functionality\n    let startTime = Date.now();\n    setInterval(() => {\n      const elapsed = Date.now() - startTime;\n      const hours = Math.floor(elapsed / 3600000);\n      const minutes = Math.floor((elapsed % 3600000) / 60000);\n      const seconds = Math.floor((elapsed % 60000) / 1000);\n      document.getElementById("timer").textContent = \n        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;\n    }, 1000);\n    \n    // Switch functionality\n    document.querySelectorAll(".switch").forEach(switch => {\n      switch.addEventListener("click", function() {\n        this.classList.toggle("active");\n        const category = this.dataset.category;\n        const enabled = this.classList.contains("active");\n        chrome.runtime.sendMessage({action: "toggleCategory", category, enabled});\n      });\n    });\n  </script>\n</body>\n</html>',
              hint: 'Create toggle switches using CSS transforms, implement a timer with setInterval, and use data attributes to identify categories'
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
          if (lesson.exercises.length > 0) {
            setCurrentExerciseId(lesson.exercises[0].id);
            setCode(lesson.exercises[0].initialCode);
          }
        }
      }
    }
  }, [moduleId, lessonId]);

  const handleRunCode = () => {
    setOutput('Code executed successfully! Check the console for results.');
  };

  const handleSubmitExercise = async () => {
    if (!currentExerciseId) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmittedExercises(prev => new Set([...prev, currentExerciseId!]));
      setSubmissionMessage('Great job! Your solution has been submitted successfully.');
      setShowSubmissionModal(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleNextLesson = () => {
    if (!currentModule || !currentLesson) return;
    
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    const nextLesson = currentModule.lessons[currentLessonIndex + 1];
    
    if (nextLesson) {
      navigate(`/course/${courseId}/module/${currentModule.id}/lesson/${nextLesson.id}`);
    } else {
      // Find next module
      const currentModuleIndex = courseModules.findIndex(m => m.id === currentModule.id);
      const nextModule = courseModules[currentModuleIndex + 1];
      
      if (nextModule && nextModule.lessons.length > 0) {
        navigate(`/course/${courseId}/module/${nextModule.id}/lesson/${nextModule.lessons[0].id}`);
      }
    }
  };

  if (!currentModule || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Loading Course Content...
            </h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Browser Extensions Development
            </h2>
          </div>
          
          <div className="overflow-y-auto h-full pb-20">
            {courseModules.map((module) => (
              <div key={module.id} className="border-b border-gray-200 dark:border-gray-700">
                <div className="p-4 bg-gray-50 dark:bg-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {module.title}
                  </h3>
                </div>
                
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/course/${courseId}/module/${module.id}/lesson/${lesson.id}`)}
                    className={`w-full text-left p-3 pl-6 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 ${
                      currentLesson.id === lesson.id 
                        ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-l-blue-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lesson.title}
                      </span>
                      {lesson.exercises.every(ex => ex.id && submittedExercises.has(ex.id)) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentLesson.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentModule.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFileExplorer(!showFileExplorer)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Code className="h-4 w-4" />
                <span>Files</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* File Explorer */}
            {showFileExplorer && (
              <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Extension Files
                </h3>
                <div className="space-y-1">
                  {Object.keys(fileContents).map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => handleFileClick(fileName)}
                      className={`w-full text-left p-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 ${
                        selectedFile === fileName 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {fileName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Learning Area */}
            <div className="flex-1 flex flex-col">
              {/* Tab Navigation */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('theory')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'theory'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Book className="h-4 w-4 inline mr-2" />
                    Theory
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('exercise')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'exercise'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Code className="h-4 w-4 inline mr-2" />
                    Exercise
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'theory' && (
                  <div className="h-full overflow-y-auto p-6">
                    {/* Video Section */}
                    <div className="mb-6">
                      <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Video: {currentLesson.title}</p>
                          <p className="text-sm opacity-75">Click to play lesson video</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                    </div>

                    {/* Code Example */}
                    {currentLesson.codeExample && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Code Example
                        </h3>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-green-400 text-sm">
                            <code>{currentLesson.codeExample}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'exercise' && (
                  <div className="h-full flex flex-col">
                    {currentLesson.exercises.length > 0 ? (
                      <>
                        {/* Exercise Header */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Exercise
                            </h3>
                            {currentExerciseId && submittedExercises.has(currentExerciseId) && (
                              <div className="flex items-center text-green-600 dark:text-green-400">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                <span className="text-sm">Completed</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {currentLesson.exercises.find(ex => ex.id === currentExerciseId)?.question}
                          </p>
                          
                          {currentLesson.exercises.find(ex => ex.id === currentExerciseId)?.hint && (
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                              <div className="flex items-start">
                                <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Hint
                                  </p>
                                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    {currentLesson.exercises.find(ex => ex.id === currentExerciseId)?.hint}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Code Editor */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex-1 p-4">
                            <textarea
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                              className="w-full h-full font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Write your code here..."
                            />
                          </div>

                          {/* Output */}
                          {output && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Output:
                              </h4>
                              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-800 dark:text-gray-200">
                                {output}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                            <button
                              onClick={handleRunCode}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <Play className="h-4 w-4" />
                              <span>Run Code</span>
                            </button>

                            <button
                              onClick={handleSubmitExercise}
                              disabled={isSubmitting || (currentExerciseId ? submittedExercises.has(currentExerciseId) : false)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="h-4 w-4" />
                              <span>
                                {isSubmitting ? 'Submitting...' : 
                                 currentExerciseId && submittedExercises.has(currentExerciseId) ? 'Submitted' : 'Submit'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p>No exercises available for this lesson</p>
                        </div>
                      </div>
                    )}
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
                  <Code className="w-4 h-4 mr-2" />
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
                <span>Browser Extensions</span>
                <span>•</span>
                <span>{currentLesson?.title}</span>
              </div>
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
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              ) : (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              )}
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

export default CourseLearningBrowserExtensions;
