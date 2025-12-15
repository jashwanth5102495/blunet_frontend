import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import VideoPlaceholder from './VideoPlaceholder';

import { ArrowLeft, Play, Book, Code, CheckCircle, XCircle, Lightbulb, Clock, Award, Users, Star, Monitor, Send, Sun, Moon, RotateCcw, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import teacherSticker from '../../video-explanations/teacher.png';
import MagnetLines from './MagnetLines';
import StarBorder from './StarBorder';
import ClickSpark from './ClickSpark';
import htmlpart1 from '../../video-explanations/topics/html/htmlpart1.mp4';
import htmlpart2 from '../../video-explanations/topics/html/htmlpart2.mp4';
import htmlHeadings from '../../video-explanations/topics/html/HTML Headings (h1-h6).mp4';
import htmlParagraphs from '../../video-explanations/topics/html/HTML Paragraphs and Text Formatting.mp4';
import listsVideo from '../../video-explanations/topics/html/list.mp4';
import linksVideo from '../../video-explanations/topics/html/links.mp4';
import imagesVideo from '../../video-explanations/topics/html/images.mp4';
import tablesVideo from '../../video-explanations/topics/html/tables.mp4';
import formsVideo from '../../video-explanations/topics/html/forms.mp4';
import cssWhatIs from '../../video-explanations/topics/html/what is css.mp4';
import cssInline from '../../video-explanations/topics/html/inline css.mp4';
import cssInternal from '../../video-explanations/topics/html/internal css.mp4';
import cssExternal from '../../video-explanations/topics/html/external css.mp4';
import cssTypography from '../../video-explanations/topics/html/Typography.mp4';
import htmlSemanticVideo from '../../video-explanations/topics/html/sem.mp4';
import cssLayoutVideo from '../../video-explanations/topics/javascript-basics/box done.mp4';
import jsIntroVideo from '../../video-explanations/topics/javascript-basics/javas.mp4';
import jsVariablesVideo from '../../video-explanations/topics/javascript-basics/var.mp4';
import jsFunctionsVideo from '../../video-explanations/topics/javascript-basics/fundd.mp4';
import jsDomVideo from '../../video-explanations/topics/javascript-basics/DOMM.mp4';
import jsEventsVideo from '../../video-explanations/topics/javascript-basics/finalevents.mp4';
import resVideo from '../../video-explanations/topics/css-grid/res.mp4';
import pythonIntroVideo from '../../video-explanations/topics/py/pyinto.mp4';
import pythonDataTypesVideo from '../../video-explanations/topics/py/datatypes.mp4';
import pythonControlFlowVideo from '../../video-explanations/topics/py/python-control-flow.mp4';

// Helper to generate preview HTML for code editor output (supports JS-only and HTML)
const generatePreviewHtml = (code: string): string => {
  const hasHtmlStructure = /<\s*(html|body|head|!DOCTYPE)/i.test(code);
  const hasAnyTag = /<\s*[a-zA-Z]+[\s>]/.test(code);
  const isLikelyJsOnly = !hasAnyTag;

  const consoleCapture = `
    <script>
      (function(){
        const out = document.getElementById('output');
        function write(type, args){
          const div = document.createElement('div');
          div.className = type;
          try {
            div.textContent = args.map(a => {
              if (typeof a === 'object') {
                try { return JSON.stringify(a); } catch(e){ return String(a); }
              }
              return String(a);
            }).join(' ');
          } catch(e) {
            div.textContent = String(args);
          }
          if (out) out.appendChild(div);
        }
        const origLog = console.log, origErr = console.error;
        console.log = function(...args){ write('log', args); origLog.apply(console, args); };
        console.error = function(...args){ write('error', args); origErr.apply(console, args); };
        window.onerror = function(msg){ write('error', [msg]); };
      })();
    </script>`;

  if (isLikelyJsOnly) {
    return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:monospace;background:#fff;color:#222}#output{white-space:pre-wrap;padding:8px;border-top:1px solid #ddd}</style></head><body><div>Program Output:</div><div id="output"></div>${consoleCapture}<script>try{${code}}catch(e){console.error(e && e.stack ? e.stack : e);}</script></body></html>`;
  }

  const userHtml = hasHtmlStructure ? code : `<div>${code}</div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui}</style></head><body>${userHtml}<div id="output" style="position:fixed;bottom:0;left:0;right:0;max-height:40%;overflow:auto;background:#f7f7f7;border-top:1px solid #ddd;padding:6px;font-family:monospace"></div>${consoleCapture}</body></html>`;
};

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

const CourseLearning = () => {
  const { courseId, moduleId, lessonId } = useParams();
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
  // const [exerciseProgress, setExerciseProgress] = useState<{[key: string]: number}>({});
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isAudioFullscreen, setIsAudioFullscreen] = useState(false);

  // Sample file contents
  const fileContents: {[key: string]: string} = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h1>Welcome to My Portfolio</h1>
            <p>I'm a frontend developer passionate about creating amazing web experiences.</p>
        </section>
        
        <section id="about">
            <h2>About Me</h2>
            <p>I love building responsive and interactive websites using modern web technologies.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 My Portfolio. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`,
    'styles.css': `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

/* Header styles */
header {
    background: #2c3e50;
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
}

nav a:hover {
    color: #3498db;
}

/* Main content */
main {
    margin-top: 80px;
    padding: 2rem;
}

section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 0;
}

h1, h2 {
    margin-bottom: 1rem;
    color: #2c3e50;
}

/* Footer */
footer {
    background: #34495e;
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}`,
    'script.js': `// Portfolio JavaScript functionality

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active class to current section
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});

// Add some interactive features
function addInteractivity() {
    // Add hover effects to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize when page loads
window.addEventListener('load', addInteractivity);`
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    if (fileContents[fileName]) {
      setCode(fileContents[fileName]);
    }
  };

  // Start a simple teacher voice line on Teacher tab click (for lessons without a dedicated script)
  const startTeacherAudio = () => {
    try {
      if (!('speechSynthesis' in window)) return;
      // Stop any ongoing speech before starting
      window.speechSynthesis.cancel();
      const message = `Welcome to ${currentLesson.title}. I will guide you with key points. Click play to continue or switch back anytime.`;
      const utter = new SpeechSynthesisUtterance(message);
      utter.rate = 1.04;
      utter.pitch = 1.0;
      utter.volume = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => /en|English/i.test(v.lang)) || voices[0];
      if (preferred) utter.voice = preferred;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      // no-op: keep UI stable if speech fails
    }
  };

  // Pause/stop teacher audio whenever leaving Teacher tab
  useEffect(() => {
    try {
      if (activeTab !== 'teacher') {
        window.speechSynthesis.cancel();
      }
    } catch {}
  }, [activeTab]);

  // Function to process content and replace video placeholders
  const processContent = (content: string) => {
    // Replace inline video placeholders with a marker FIRST to avoid regex mismatch after normalization
    const videoPlaceholderRegex = /<div style="margin-bottom: 20px; text-align:\s*(center|left);">[\s\S]*?<div style="width: 100%; max-width: 800px; height: 400px;[^>]*>[\s\S]*?<\/div>[\s\S]*?<p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!<\/p>[\s\S]*?<\/div>/g;
    const withMarkers = content.replace(videoPlaceholderRegex, '[VIDEO_PLACEHOLDER]');

    // Normalize text alignment to left in any inline styles
    const leftAligned = withMarkers.replace(/text-align\s*:\s*center/gi, 'text-align: left');

    // Remove emojis for professional presentation
    const withoutEmojis = leftAligned
      // Strip common emoji Unicode ranges and variation selectors
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u200D\uFE0F]/gu, '');

    // Normalize inline text color to inherit so content respects theme
    const withoutInlineColors = withoutEmojis
      .replace(/color\s*:\s*(#[0-9a-fA-F]{3,6}|rgb\s*\([^\)]*\)|[a-zA-Z]+)\s*;?/gi, 'color: inherit;');

    // Remove hard white backgrounds that clash with dark mode
    const withoutHardBackgrounds = withoutInlineColors
      .replace(/background-color\s*:\s*(#fff|white|rgb\s*\(\s*255\s*,\s*255\s*,\s*255\s*\))\s*;?/gi, 'background-color: transparent;');

    // Neon yellow highlight for emphasized text with high-contrast text
    const highlighted = withoutHardBackgrounds.replace(
      /<strong>/g,
      '<strong style="background-color:#FFF200;color:#111;padding:0 3px;border-radius:3px;box-shadow:0 0 10px rgba(255,242,0,0.6);font-weight:600;">'
    );

    return highlighted;
  };

  // HTML Intro dedicated carousel component
  const HtmlIntroVideoCarousel: React.FC = () => {
    const [showSecond, setShowSecond] = useState(false);
    return (
      <div className="relative w-full max-w-3xl mx-auto">
        {!showSecond ? (
          <video className="w-full h-auto bg-black rounded-lg border border-gray-700" controls preload="metadata" src={htmlpart1} />
        ) : (
          <video className="w-full h-auto bg-black rounded-lg border border-gray-700" controls preload="metadata" src={htmlpart2} />
        )}
        {!showSecond && (
          <button onClick={() => setShowSecond(true)} className="absolute top-1/2 -translate-y-1/2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md flex items-center gap-1" title="Play Part 2">
            <span className="text-sm">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {showSecond && (
          <button onClick={() => setShowSecond(false)} className="absolute top-1/2 -translate-y-1/2 left-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md flex items-center gap-1" title="Back to Part 1">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
        )}
      </div>
    );
  };

  // Reusable whiteboard with a visible drag handle for resizing
  const ResizableWhiteboard: React.FC<{
    children: React.ReactNode;
    minWidth?: number;
    minHeight?: number;
    initialWidth?: number;
    initialHeight?: number;
    contentRef?: React.RefObject<HTMLDivElement>;
  }> = ({ children, minWidth = 240, minHeight = 120, initialWidth, initialHeight, contentRef }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState<{ width: number; height: number }>({
      width: initialWidth || 560,
      height: initialHeight || 220,
    });

    useEffect(() => {
      // Set sensible defaults based on rendered size
      if (containerRef.current && (!initialWidth || !initialHeight)) {
        const rect = containerRef.current.getBoundingClientRect();
        setSize({
          width: Math.max(minWidth, Math.floor(rect.width)),
          height: Math.max(minHeight, Math.floor(rect.height)),
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      const onMove = (ev: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newW = Math.max(minWidth, Math.round(ev.clientX - rect.left));
        const newH = Math.max(minHeight, Math.round(ev.clientY - rect.top));
        setSize({ width: newW, height: newH });
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    const startTouchDrag = (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      const onMove = (ev: TouchEvent) => {
        const t = ev.touches[0];
        if (!containerRef.current || !t) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newW = Math.max(minWidth, Math.round(t.clientX - rect.left));
        const newH = Math.max(minHeight, Math.round(t.clientY - rect.top));
        setSize({ width: newW, height: newH });
      };
      const onUp = () => {
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
      };
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
    };

    return (
      <div
        ref={containerRef}
        className="mt-4 bg-white text-black rounded-lg border border-gray-300 shadow"
        style={{
          width: size.width,
          height: size.height,
          minWidth,
          minHeight,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <div ref={contentRef} className="p-2 text-base md:text-lg font-medium whitespace-pre-wrap">{children}</div>
      {/* Drag handle */}
        <div
          onMouseDown={startDrag}
          onTouchStart={startTouchDrag}
          className="absolute bottom-1 right-1 w-3 h-3 bg-gray-400 rounded-sm cursor-se-resize"
          title="Drag to resize"
          style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.1)' }}
        />
      </div>
    );
  };

  // Audio Teacher for CSS Box Model & Layout
  const CssBoxModelAudioTeacher: React.FC<{ autoStart?: boolean; isFullscreen?: boolean; onFullscreenChange?: (isFullscreen: boolean) => void }> = ({ autoStart = false, isFullscreen = false, onFullscreenChange }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentSegment, setCurrentSegment] = useState(0);
    const [typedText, setTypedText] = useState('');
    const whiteboardRef = useRef<HTMLDivElement | null>(null);
    const [showQuestionBox, setShowQuestionBox] = useState(false);
    const [questionText, setQuestionText] = useState('');
    const [submittedMsg, setSubmittedMsg] = useState('');
    
    // Use the fullscreen state from parent instead of local state
    const showFullscreen = isFullscreen;
    
    // Notify parent component when fullscreen changes
    const toggleFullscreen = (value: boolean) => {
      if (onFullscreenChange) {
        onFullscreenChange(value);
      }
    };
    const [codeEditorText, setCodeEditorText] = useState(
      `<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Web Page</title>\n</head>\n<body>\n  <h1>Welcome to HTML</h1>\n  <p>This is my first paragraph.</p>\n</body>\n</html>`
    );
    const [showRenderedOutput, setShowRenderedOutput] = useState(false);
    const [renderedHtml, setRenderedHtml] = useState('');
    const autoStartedRef = useRef(false);

    const segments = [
      'Welcome! Let’s explore the CSS Box Model and how layout actually works.',
      'Every element is a rectangle. Inside is the content. Around it is padding. Then the border. Finally, margin outside the border.',
      'Padding adds space inside the box around the content. Border draws an outline around the padding and content.',
      'Margin creates space outside the box between this element and others. Margins can collapse vertically for block elements.',
      'Box sizing: content-box calculates width excluding padding and border. Border-box includes padding and border in the width—much easier for layout.',
      'Layout tip: use border-box globally, then adjust padding and margin to position cards, buttons, and inputs consistently.',
      'That’s the core idea. Let’s practice by changing padding, border, and margin to see their visual effects!',
    ];

    // Helper: speak a single text and sync whiteboard typing
    // Select a more realistic English voice if available
    const chooseBestVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
      if (!voices || voices.length === 0) return null;
      const nameHints = /(Natural|Neural|Microsoft|Google|Cloud|US English)/i;
      return (
        voices.find(v => /en-US/i.test(v.lang) && nameHints.test(v.name)) ||
        voices.find(v => /en-US/i.test(v.lang)) ||
        voices.find(v => /English/i.test(v.lang)) ||
        voices[0] || null
      );
    };

    const [preferredVoice, setPreferredVoice] = useState<SpeechSynthesisVoice | null>(null);
    useEffect(() => {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const best = chooseBestVoice(voices);
        if (best) setPreferredVoice(best);
      };
      updateVoices();
      try { window.speechSynthesis.addEventListener('voiceschanged', updateVoices); } catch {}
      return () => { try { window.speechSynthesis.removeEventListener('voiceschanged', updateVoices); } catch {} };
    }, []);

    const speakText = async (text: string) => {
      return new Promise<void>((resolve) => {
        if (!('speechSynthesis' in window)) {
          setTypedText(prev => prev + (prev ? '\n' : '') + text);
          resolve();
          return;
        }

        // Add a new line before appending this utterance
        setTypedText(prev => (prev ? prev + '\n' : prev));

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1.0; // natural speed
        utter.pitch = 1.02; // slight brightness
        utter.volume = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const best = preferredVoice || chooseBestVoice(voices);
        if (best) utter.voice = best;

        // Word-level sync when boundary events are supported
        const words = text.split(/\s+/);
        let wordIndex = 0;
        const appendWord = () => {
          setTypedText(prev => prev + (prev && !/\s$/.test(prev) ? ' ' : '') + (words[wordIndex] ?? ''));
          wordIndex++;
        };

        // Character-level fallback typing for smoother feel
        let charIndex = 0;
        const chars = text.split('');
        const typeChar = () => {
          const ch = chars[charIndex] ?? '';
          setTypedText(prev => prev + ch);
          charIndex++;
        };

        // Start a paced typewriter fallback; speed adapts to text length
        const intervalMs = Math.max(25, Math.min(85, Math.floor(1200 / Math.max(words.length, 8))));
        const typeInterval = setInterval(() => {
          if (!isSpeaking) { clearInterval(typeInterval); return; }
          if (wordIndex < words.length && chars[charIndex] === ' ') {
            appendWord();
          } else if (charIndex < chars.length) {
            typeChar();
          } else {
            clearInterval(typeInterval);
          }
        }, intervalMs);

        // Try boundary callbacks for precise word sync
        (utter as any).onboundary = (event: any) => {
          if (event && event.name === 'word') {
            if (wordIndex < words.length) appendWord();
          }
        };

        utter.onend = () => {
          clearInterval(typeInterval);
          resolve();
        };
        window.speechSynthesis.speak(utter);
      });
    };

    const speakSegments = async () => {
      if (!('speechSynthesis' in window)) {
        alert('Speech synthesis not supported in this browser.');
        return;
      }
      if (isSpeaking) return; // guard against duplicate starts
      // Clear any queued or ongoing speech before starting fresh
      try { window.speechSynthesis.cancel(); } catch {}
      setIsSpeaking(true);
      for (let i = 0; i < segments.length; i++) {
        if (!isSpeaking) break;
        setCurrentSegment(i);
        const text = segments[i];
        await speakText(text);
      }
      setIsSpeaking(false);
    };

    const stopSpeaking = () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };

    useEffect(() => {
      // Auto-scroll to bottom as new text is typed
      if (whiteboardRef.current) {
        whiteboardRef.current.scrollTop = whiteboardRef.current.scrollHeight;
      }
    }, [typedText]);

    useEffect(() => {
      if (autoStart && !autoStartedRef.current) {
        autoStartedRef.current = true;
        speakSegments();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoStart]);

    // Generate a simple explanation for a student question
    const generateAnswer = (q: string) => {
      const lower = q.toLowerCase();
      if (lower.includes('padding')) return 'Padding adds space inside the element around the content. Increase padding to push content away from the border.';
      if (lower.includes('margin')) return 'Margin is the space outside the element. It separates this box from others. Vertical margins between blocks may collapse.';
      if (lower.includes('border-box') || lower.includes('content-box') || lower.includes('box sizing')) return 'Box sizing controls width calculations. Use border-box so padding and border are included in the declared width; it simplifies layout.';
      if (lower.includes('border')) return 'The border outlines the box around padding and content. It does not add inner space; pair it with padding for breathing room.';
      if (lower.includes('flex')) return 'Flexbox is for one-dimensional layout: rows or columns. It distributes space and aligns items dynamically.';
      if (lower.includes('grid')) return 'CSS Grid is two-dimensional. Define rows and columns and place items precisely for complex layouts.';
      if (lower.includes('collapse')) return 'Margin collapsing occurs when two vertical margins touch; they combine into a single margin. Add padding or borders to prevent it.';
      return 'Great question! In simple terms: think of the element as a box—content inside, padding for inner spacing, border for outline, and margin for outer spacing. Adjust each to achieve the layout you want.';
    };

    const submitQuestion = async () => {
      if (!questionText.trim()) return;
      // Stop any ongoing explanation immediately
      try { window.speechSynthesis.cancel(); } catch {}
      setIsSpeaking(false);

      // Placeholder submission; integrate with backend later
      setSubmittedMsg('Your doubt has been noted — we will respond soon.');
      const answer = generateAnswer(questionText);
      setQuestionText('');
      setShowQuestionBox(false);

      // Speak and type the answer on the whiteboard
      setIsSpeaking(true);
      await speakText(`Answer: ${answer}`);
      setIsSpeaking(false);
    };

    return (
      <div className="mt-4 p-4 rounded-lg border border-gray-600 bg-gray-800/50 text-white" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <style>{`
          @keyframes shake {
            0% { transform: translate(0, 0) rotate(0deg); }
            20% { transform: translate(-1px, 0) rotate(-1deg); }
            40% { transform: translate(1px, 0) rotate(1deg); }
            60% { transform: translate(-1px, 0) rotate(-1deg); }
            80% { transform: translate(1px, 0) rotate(1deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
        `}</style>
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold">Audio Teacher: CSS Box Model & Layout</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (isSpeaking ? stopSpeaking() : speakSegments())}
              className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2"
              title={isSpeaking ? 'Stop' : 'Play explanation'}
            >
              <img
                src={teacherSticker}
                alt="Teacher"
                className="rounded"
                style={
                  isSpeaking
                    ? { width: 28, height: 28, objectFit: 'contain', animation: 'shake 0.6s infinite' }
                    : { width: 28, height: 28, objectFit: 'contain' }
                }
              />
              <span className="text-xs md:text-sm">{isSpeaking ? 'Stop' : 'Play'}</span>
            </button>
            <button
              onClick={() => toggleFullscreen(true)}
              className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs md:text-sm"
              title="Open fullscreen view"
            >
              Fullscreen
            </button>
          </div>
        </div>

        {/* Whiteboard typing area (resizable with visible handle, keeps history) */}
        <ResizableWhiteboard minWidth={260} minHeight={160} contentRef={whiteboardRef}>
          {typedText}
        </ResizableWhiteboard>

        {/* Live explanation segments with highlight */}
        <div className="mt-3 space-y-2">
          {segments.map((text, idx) => (
            <div
              key={idx}
              className={`text-xs md:text-sm rounded-md px-2 py-1 ${idx === currentSegment && isSpeaking ? 'bg-yellow-300 text-black shadow-sm' : 'bg-gray-700/60'}`}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Question input */}
        <div className="mt-3 p-3 rounded-md bg-gray-700/60 border border-gray-600">
          <label className="block text-xs mb-1">Ask your doubt about the Box Model:</label>
          <textarea
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuestion(); } }}
            className="w-full text-white bg-gray-900 rounded-md p-2 text-sm placeholder-gray-400 caret-white"
            rows={3}
            placeholder="Type your question here"
          />
          <div className="mt-2 flex items-center gap-2">
            <button onClick={submitQuestion} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Submit</button>
            {submittedMsg && <span className="text-xs text-green-300">{submittedMsg}</span>}
          </div>
        </div>

        {/* Fullscreen Popup */}
        {showFullscreen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg w-screen h-screen relative p-4">
              <button
                onClick={() => toggleFullscreen(false)}
                className="absolute top-3 right-3 text-white hover:text-red-400"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
              <div className="h-full flex gap-4">
                {/* Left: stacked panels */}
                <div className="w-[45%] min-w-[340px] flex flex-col gap-4">
                  {/* Question panel */}
                  <div className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-3">
                    <div className="text-xs text-gray-300 mb-2">Ask your question</div>
                    <textarea
                      value={questionText}
                      onChange={e => setQuestionText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuestion(); } }}
                      className="w-full h-[calc(100%-40px)] text-white bg-gray-900 rounded-md p-2 text-sm placeholder-gray-400 caret-white"
                      placeholder="Type your question here"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={submitQuestion} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Submit</button>
                      {submittedMsg && <span className="text-xs text-green-300">{submittedMsg}</span>}
                    </div>
                  </div>
                  {/* Code editor panel */}
                  <div className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-300">Code Editor</span>
                      <div className="flex items-center gap-2">
                        {showRenderedOutput && (
                          <button className="px-2 py-1 text-xs rounded bg-blue-700 text-white hover:bg-blue-600" title="Edit" onClick={() => setShowRenderedOutput(false)}>Edit</button>
                        )}
                        <button className="px-2 py-1 text-xs rounded bg-gray-700 text-white hover:bg-gray-600" title="Reset" onClick={() => { setCodeEditorText(''); setShowRenderedOutput(false); setRenderedHtml(''); }}>Reset</button>
                        <button className="px-2 py-1 text-xs rounded bg-green-700 text-white hover:bg-green-600" title="Run" onClick={() => { setRenderedHtml(generatePreviewHtml(codeEditorText)); setShowRenderedOutput(true); }}>Run</button>
                      </div>
                    </div>
                    <div className="w-full h-[calc(100%-8px)]" style={{ perspective: '1000px' }}>
                      <div
                        className="relative w-full h-full transform-gpu transition-transform duration-500"
                        style={{ transform: showRenderedOutput ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
                      >
                        {/* Front: Textarea */}
                        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
                          <textarea
                            value={codeEditorText}
                            onChange={e => setCodeEditorText(e.target.value)}
                            className="w-full h-full bg-gray-900 text-green-200 rounded-md p-2 text-xs font-mono"
                            placeholder="Write code here"
                          />
                        </div>
                        {/* Back: Output */}
                        <div className="absolute inset-0" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                          <div className="w-full h-full bg-white rounded-md overflow-hidden">
                            <iframe title="code-output" className="w-full h-full" srcDoc={renderedHtml}></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right: whiteboard tall rectangle */}
                <div className="flex-1">
                  <ResizableWhiteboard minWidth={300} minHeight={220} initialWidth={window.innerWidth / 2 + 50} initialHeight={window.innerHeight-200} contentRef={whiteboardRef}>
                    {typedText}
                  </ResizableWhiteboard>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Generic Audio Teacher for other lessons (whiteboard typing + Q&A)
  const GenericAudioTeacher: React.FC<{ autoStart?: boolean; isFullscreen?: boolean; onFullscreenChange?: (isFullscreen: boolean) => void }> = ({ autoStart = false, isFullscreen = false, onFullscreenChange }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [submittedMsg, setSubmittedMsg] = useState('');
    
    // Use the fullscreen state from parent instead of local state
    const showFullscreen = isFullscreen;
    
    // Notify parent component when fullscreen changes
    const toggleFullscreen = (value: boolean) => {
      if (onFullscreenChange) {
        onFullscreenChange(value);
      }
    };
    const [codeEditorText, setCodeEditorText] = useState(
      `<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Web Page</title>\n</head>\n<body>\n  <h1>Welcome to HTML</h1>\n  <p>This is my first paragraph.</p>\n</body>\n</html>`
    );
    const [showRenderedOutput, setShowRenderedOutput] = useState(false);
    const [renderedHtml, setRenderedHtml] = useState('');
    const whiteboardRef = useRef<HTMLDivElement | null>(null);

    // Refs to prevent stale state in intervals and allow immediate stop
    const speakingRef = useRef(false);
    const intervalRef = useRef<number | null>(null);
    const autoStartedRef = useRef(false);

    const baseScript = [
      `Welcome! Let’s explore ${currentLesson?.title ?? 'this topic'}.`,
      'I will summarize the most important points in simple terms.',
      'You can ask a question below and I will explain it as well.',
    ];

    const getTopicSegments = (): string[] => {
      const id = (currentLesson?.id || '').toLowerCase();
      const title = (currentLesson?.title || '').toLowerCase();
      if (id.includes('html-intro') || /introduction to html|html introduction/.test(title)) {
        return [
          'HTML stands for HyperText Markup Language — it structures web pages.',
          'An HTML element has an opening tag, content, and a closing tag.',
          'The basic document structure uses <!DOCTYPE html>, html, head, and body.',
          'Head contains metadata like title and links to styles; body holds visible content.',
          'Use semantic tags like header, main, article, and footer for meaning and accessibility.',
        ];
      }
      return baseScript;
    };

    const speakText = async (text: string) => {
      return new Promise<void>((resolve) => {
        if (!('speechSynthesis' in window)) {
          setTypedText(prev => prev + (prev ? '\n' : '') + text);
          resolve();
          return;
        }
        // Clear previous interval if any
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // Add a new line before appending this utterance, keep history
        setTypedText(prev => (prev ? prev + '\n' : prev));
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1.02;
        utter.pitch = 1.0;
        utter.volume = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => /en|English/i.test(v.lang)) || voices[0];
        if (preferred) utter.voice = preferred;
        
        // Character-level typing synchronized with audio, stoppable instantly
        const chars = text.split('');
        let charIndex = 0;
        const intervalMs = Math.max(25, Math.min(85, Math.floor(1200 / Math.max(chars.length, 30))));
        intervalRef.current = window.setInterval(() => {
          if (!speakingRef.current) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return;
          }
          if (charIndex < chars.length) {
            const ch = chars[charIndex] ?? '';
            setTypedText(prev => prev + ch);
            charIndex++;
          } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }, intervalMs);

        utter.onend = () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          resolve();
        };
        window.speechSynthesis.speak(utter);
      });
    };

    const speakSegments = async () => {
      if (!('speechSynthesis' in window)) {
        alert('Speech synthesis not supported in this browser.');
        return;
      }
      if (speakingRef.current) return; // prevent duplicate starts
      try { window.speechSynthesis.cancel(); } catch {}
      speakingRef.current = true;
      setIsSpeaking(true);
      const segments = getTopicSegments();
      for (let i = 0; i < segments.length; i++) {
        if (!speakingRef.current) break;
        await speakText(segments[i]);
      }
      // After the basic explanation, prompt the student for doubts
      if (speakingRef.current) {
        await speakText('Do you have any doubts? Ask below and press Submit or Enter.');
      }
      speakingRef.current = false;
      setIsSpeaking(false);
    };

    const stopSpeaking = () => {
      window.speechSynthesis.cancel();
      speakingRef.current = false;
      setIsSpeaking(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    useEffect(() => {
      // Auto-scroll to bottom as new text is typed
      if (whiteboardRef.current) {
        whiteboardRef.current.scrollTop = whiteboardRef.current.scrollHeight;
      }
    }, [typedText]);

    // Small web-backed lookup using Wikipedia REST + MediaWiki APIs
    const wikipediaAPI = {
      async searchTitle(query: string): Promise<string | null> {
        try {
          const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json&origin=*`;
          const res = await fetch(url);
          const data = await res.json();
          const titles = data?.[1];
          if (Array.isArray(titles) && titles[0]) return titles[0];
          return null;
        } catch {
          return null;
        }
      },
      async querySearch(query: string): Promise<string | null> {
        try {
          const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
          const res = await fetch(url);
          const data = await res.json();
          const results: Array<{ title: string }> = data?.query?.search || [];
          if (!results.length) return null;
          // Prefer programming/computing related titles if present
          const preferred = results.find(r => /(programming language|computer science|software|computing)/i.test(r.title));
          return (preferred?.title || results[0].title) || null;
        } catch {
          return null;
        }
      },
      async getSummary(title: string): Promise<{ extract: string; url?: string; type?: string; title?: string } | null> {
        try {
          const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
          const res = await fetch(url);
          if (!res.ok) return null;
          const data = await res.json();
          return {
            extract: data?.extract || '',
            url: data?.content_urls?.desktop?.page || data?.content_urls?.mobile?.page,
            type: data?.type,
            title: data?.title
          };
        } catch {
          return null;
        }
      },
      async searchBestTitle(subject: string): Promise<string | null> {
        // Try a direct title first
        let title = await this.searchTitle(subject);
        if (title) {
          const s = await this.getSummary(title);
          const looksDisambiguation = s?.type === 'disambiguation' || /\bdisambiguation\b/i.test(title);
          const isGeneric = title.toLowerCase() === subject.toLowerCase();
          if (!looksDisambiguation && !isGeneric) return title;
        }
        // Refine search for computing topics
        const refinedTitle = await this.querySearch(`${subject} programming language`) || await this.querySearch(`${subject} computer science`) || await this.querySearch(subject);
        return refinedTitle || title || null;
      }
    };

    const detectIntent = (q: string): { type: 'when_introduced' | 'who_created' | 'summary'; subject: string } | null => {
      const lower = q.toLowerCase();
      // who created <subject>
      let m = lower.match(/who\s+(?:created|invented|developed|designed|wrote|authored)\s+(.+?)\??$/);
      if (m?.[1]) return { type: 'who_created', subject: m[1].trim() };
      // when was <subject> introduced/released/invented/created/first appeared
      m = lower.match(/when\s+(?:was|did)\s+(.+?)\s+(?:introduced|released|invented|created|first\s+appeared|start|begin|come\s*out)\??$/);
      if (m?.[1]) return { type: 'when_introduced', subject: m[1].trim() };
      // what is <subject>
      m = lower.match(/what\s+is\s+(.+?)\??$/);
      if (m?.[1]) return { type: 'summary', subject: m[1].trim() };
      return null;
    };

    const extractCreator = (text: string): string | null => {
      const m = text.match(/(?:invented|created|developed|designed)\s+by\s+([A-Z][A-Za-z.\- ]+(?:\s+[A-Z][A-Za-z.\- ]+)*)/);
      return m?.[1]?.trim() || null;
    };

    const extractYear = (text: string): string | null => {
      const years = text.match(/\b(19|20)\d{2}\b/g);
      return years?.[0] || null; // Prefer earliest mention in summary
    };

    const normalizeSubject = (s: string): string => {
      const raw = (s || "").trim().toLowerCase();
      if (!raw) return "";
      if (raw === "js" || raw === "java script" || raw === "javascript") return "JavaScript";
      if (raw === "ecmascript" || raw === "es6" || raw === "es2015") return "JavaScript";
      if (raw === "node" || raw === "nodejs" || raw === "node.js") return "Node.js";
      if (raw === "c sharp" || raw === "c#") return "C#";
      if (raw === "cpp" || raw === "c++") return "C++";
      return s;
    };

    const isCodeIntent = (q: string): boolean => {
      const lower = q.toLowerCase();
      return (
        /(code|snippet|example|sample|template|boilerplate)/.test(lower) ||
        /(write|generate|create)\s+(.*\s)?(code|html|css|javascript|react|python|java)/.test(lower) ||
        /<html>|<!doctype html>/i.test(lower) ||
        /html\s+code/i.test(lower)
      );
    };

    const answerQuestion = async (q: string): Promise<string> => {
      const asked = q.trim();
      const intro = asked ? `You asked: "${asked}"\n` : '';
      const intent = detectIntent(q);
      const subject = normalizeSubject(intent?.subject || asked);
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const LLM_PROVIDER = (import.meta.env.VITE_LLM_PROVIDER || "ollama");
      const LLM_MODEL = (import.meta.env.VITE_LLM_MODEL || "qwen2.5-coder:1.5b");
      const codeIntent = isCodeIntent(q);

      // 1) Try local LLM via backend proxy for a dynamic explanation
      try {
        const res = await fetch(`${BASE_URL}/api/llm/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: asked, provider: LLM_PROVIDER, model: LLM_MODEL })
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data?.answer) {
            // Always prefer the local LLM answer directly
            return `${intro}${data.answer}`;
          }
        }
      } catch {}
      // 3) If LLM unavailable:
      // For code requests, provide a helpful static snippet instead of Wikipedia
      if (codeIntent) {
        if (/html/i.test(q)) {
          return (
            intro +
            "Here is a simple HTML page:\n" +
            "<!doctype html>\n" +
            "<html lang=\"en\">\n" +
            "  <head>\n" +
            "    <meta charset=\"utf-8\" />\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n" +
            "    <title>Sample Page</title>\n" +
            "    <style> body { font-family: system-ui, sans-serif; padding: 24px; } .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; } </style>\n" +
            "  </head>\n" +
            "  <body>\n" +
            "    <h1>Hello, world!</h1>\n" +
            "    <div class=\"card\">\n" +
            "      <p>This is a sample HTML card.</p>\n" +
            "      <a href=\"https://example.com\">Visit example.com</a>\n" +
            "    </div>\n" +
            "  </body>\n" +
            "</html>"
          );
        }
      }
      // Otherwise attempt Wikipedia summary for factual answers
      if (subject) {
        const title = await wikipediaAPI.searchBestTitle(subject);
        if (title) {
          const summary = await wikipediaAPI.getSummary(title);
          if (summary) {
            const citeUrl = summary.url || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
            const cite = `\nSource: ${citeUrl}`;
            // Provide tailored response for intents when possible
            if (intent?.type === 'who_created') {
              const creator = extractCreator(summary.extract);
              if (creator) return `${intro}${title} was created/invented by ${creator}.${cite}`;
            }
            if (intent?.type === 'when_introduced') {
              const year = extractYear(summary.extract);
              if (year) return `${intro}${title} was introduced around ${year}.${cite}`;
            }
            // Default to a clear explanation from the summary extract
            return `${intro}${summary.extract}${cite}`;
          }
        }
      }
      // Fallback to our explainer when web data isn't definitive
      return generateAnswer(q);
    };

    const generateAnswer = (q: string) => {
      const lower = q.toLowerCase();
      const asked = q.trim();
      const intro = asked ? `You asked: "${asked}"\n` : '';

      // Specific factual question: "when was HTML introduced"
      if (
        /when\s+was\s+html\s+introduced/.test(lower) ||
        /when\s+did\s+html\s+(start|begin|come\s*out)/.test(lower)
      ) {
        return (
          intro +
          "HTML was created by Tim Berners‑Lee at CERN in the early 1990s.\n" +
          "• Introduced publicly in 1991 (early HTML documentation).\n" +
          "• First formal description published in 1993.\n" +
          "• HTML 2.0 standardized in 1995 (RFC 1866)."
        );
      }

      // HTML-focused
      if (lower.includes('html') || /<\w+>/.test(lower) || lower.includes('tag') || lower.includes('element')) {
        return (
          intro +
          "Here's a concise explanation:\n" +
          "- HTML defines the structure of a page using tags (elements).\n" +
          "- Common tags: <div>, <p>, <a>, <img>, <ul>/<li>, <form>.\n" +
          "- Attributes add details: e.g., <a href=\"/\">.\n" +
          "Example:\n<a href=\"https://example.com\">Visit</a> — creates a clickable link."
        );
      }

      // CSS-focused
      if (lower.includes('css') || lower.includes('style') || lower.includes('selector') || lower.includes('flex') || lower.includes('grid')) {
        return (
          intro +
          "CSS controls presentation (colors, layout, spacing).\n" +
          "- Selectors target elements (e.g., .card, #main, h1).\n" +
          "- Declarations: property: value; (e.g., color: #fff).\n" +
          "- Layouts: flexbox (one‑dimensional), grid (two‑dimensional).\n" +
          "Example:\n.card { display: flex; gap: 12px; padding: 16px; }"
        );
      }

      // JavaScript
      if (lower.includes('javascript') || lower.includes('js') || lower.includes('function') || lower.includes('array')) {
        return (
          intro +
          "JavaScript adds interactivity and logic.\n" +
          "- Variables store data; functions encapsulate reusable logic.\n" +
          "- Arrays and objects organize data; DOM APIs update the page.\n" +
          "Example:\nfunction greet(name){ return `Hello, ${name}!`; }"
        );
      }

      // React
      if (lower.includes('react') || lower.includes('component') || lower.includes('state') || lower.includes('props')) {
        return (
          intro +
          "React builds UI from components.\n" +
          "- Props pass data in; state stores local, changeable data.\n" +
          "- Use hooks like useState/useEffect for logic.\n" +
          "Example:\nconst [count,setCount]=useState(0);\n<button onClick={()=>setCount(count+1)}>+1</button>"
        );
      }

      // APIs/HTTP
      if (lower.includes('api') || lower.includes('http') || lower.includes('fetch') || lower.includes('request')) {
        return (
          intro +
          "APIs let apps communicate over HTTP.\n" +
          "- GET reads data; POST creates; PUT/PATCH updates; DELETE removes.\n" +
          "Example:\nfetch(\"/api/items\").then(r=>r.json()).then(data=>console.log(data));"
        );
      }

      // Databases/SQL
      if (lower.includes('sql') || lower.includes('database') || lower.includes('mysql') || lower.includes('postgres') || lower.includes('query')) {
        return (
          intro +
          "SQL queries data in relational databases.\n" +
          "- SELECT chooses columns; WHERE filters; JOIN relates tables.\n" +
          "Example:\nSELECT name, price FROM products WHERE price > 100;"
        );
      }

      // General fallback
      return (
        intro +
        "Here's a clear, general approach:\n" +
        "- Define the concept in simple terms.\n" +
        "- Break it into 3–4 key ideas.\n" +
        "- Show a tiny example to make it concrete.\n" +
        "If you share more context, I can tailor deeper details."
      );
    };

    const submitQuestion = async () => {
      if (!questionText.trim()) return;

      // Stop any ongoing speech/typing
      try { window.speechSynthesis.cancel(); } catch {}
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

      const q = questionText;
      setQuestionText('');
      speakingRef.current = true;
      setIsSpeaking(true);
      setSubmittedMsg('Answering your question…');

      const answer = await answerQuestion(q);
      await speakText(`Question: ${q}\n\n${answer}`);

      setSubmittedMsg('Answered.');
      speakingRef.current = false;
      setIsSpeaking(false);
    };

    useEffect(() => {
      if (autoStart && !autoStartedRef.current) {
        autoStartedRef.current = true;
        speakSegments();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoStart]);

    return (
      <div className="mt-4 p-4 rounded-lg border border-gray-600 bg-gray-800/50 text-white" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold">Audio Teacher</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (isSpeaking ? stopSpeaking() : speakSegments())}
              className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2"
              title={isSpeaking ? 'Stop' : 'Play explanation'}
            >
              <img src={teacherSticker} alt="Teacher" className="rounded" style={isSpeaking ? { width: 28, height: 28, objectFit: 'contain', animation: 'shake 0.6s infinite' } : { width: 28, height: 28, objectFit: 'contain' }} />
              <span className="text-xs md:text-sm">{isSpeaking ? 'Stop' : 'Play'}</span>
            </button>
            <button
              onClick={() => toggleFullscreen(true)}
              className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs md:text-sm"
              title="Open fullscreen view"
            >
              Fullscreen
            </button>
          </div>
        </div>

        {/* Whiteboard typing area (resizable with visible handle, keeps history) */}
        <ResizableWhiteboard minWidth={280} minHeight={160} initialWidth={560} initialHeight={220} contentRef={whiteboardRef}>
          {typedText}
        </ResizableWhiteboard>

        {/* Question input */}
        <div className="mt-3 p-3 rounded-md bg-gray-700/60 border border-gray-600">
          <label className="block text-xs mb-1">Ask a question:</label>
          <textarea
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuestion(); } }}
            className="w-full text-white bg-gray-900 rounded-md p-2 text-sm placeholder-gray-400 caret-white"
            rows={3}
            placeholder="Type your question here"
          />
          <div className="mt-2 flex items-center gap-2">
            <button onClick={submitQuestion} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Submit</button>
            {submittedMsg && <span className="text-xs text-green-300">{submittedMsg}</span>}
          </div>
        </div>

        {/* Fullscreen Popup */}
        {showFullscreen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg w-screen h-screen relative p-4">
              <button
                onClick={() => toggleFullscreen(false)}
                className="absolute top-3 right-3 text-white hover:text-red-400"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
              <div className="h-full flex gap-4">
                {/* Left: stacked panels */}
                <div className="w-[45%] min-w-[340px] flex flex-col gap-4">
                  {/* Question panel */}
                  <div className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-3">
                    <div className="text-xs text-gray-300 mb-2">Ask your question</div>
                    <textarea
                      value={questionText}
                      onChange={e => setQuestionText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuestion(); } }}
                      className="w-full h-[calc(100%-40px)] text-white bg-gray-900 rounded-md p-2 text-sm placeholder-gray-400 caret-white"
                      placeholder="Type your question here"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={submitQuestion} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Submit</button>
                      {submittedMsg && <span className="text-xs text-green-300">{submittedMsg}</span>}
                    </div>
                  </div>
                  {/* Code editor panel */}
                  <div className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-300">Code Editor</span>
                      <div className="flex items-center gap-2">
                        {showRenderedOutput && (
                          <button className="px-2 py-1 text-xs rounded bg-blue-700 text-white hover:bg-blue-600" title="Edit" onClick={() => setShowRenderedOutput(false)}>Edit</button>
                        )}
                        <button className="px-2 py-1 text-xs rounded bg-gray-700 text-white hover:bg-gray-600" title="Reset" onClick={() => { setCodeEditorText(''); setShowRenderedOutput(false); setRenderedHtml(''); }}>Reset</button>
                        <button className="px-2 py-1 text-xs rounded bg-green-700 text-white hover:bg-green-600" title="Run" onClick={() => { setRenderedHtml(generatePreviewHtml(codeEditorText)); setShowRenderedOutput(true); }}>Run</button>
                      </div>
                    </div>
                    <div className="w-full h-[calc(100%-8px)]" style={{ perspective: '1000px' }}>
                      <div
                        className="relative w-full h-full transform-gpu transition-transform duration-500"
                        style={{ transform: showRenderedOutput ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
                      >
                        {/* Front: Textarea */}
                        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
                          <textarea
                            value={codeEditorText}
                            onChange={e => setCodeEditorText(e.target.value)}
                            className="w-full h-full bg-gray-900 text-green-200 rounded-md p-2 text-xs font-mono"
                            placeholder="Write code here"
                          />
                        </div>
                        {/* Back: Output */}
                        <div className="absolute inset-0" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                          <div className="w-full h-full bg-white rounded-md overflow-hidden">
                            <iframe title="code-output" className="w-full h-full" srcDoc={renderedHtml}></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right: whiteboard tall rectangle */}
                <div className="flex-1">
                  <ResizableWhiteboard minWidth={300} minHeight={220} initialWidth={window.innerWidth / 2 + 50} initialHeight={window.innerHeight - 50} contentRef={whiteboardRef}>
                    {typedText}
                  </ResizableWhiteboard>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Map lesson IDs to their corresponding video sources
  const lessonVideos: Record<string, string[]> = {
    // HTML Module
    'html-intro': [htmlpart1, htmlpart2],
    'html-headings': [htmlHeadings],
    'html-paragraphs': [htmlParagraphs],
    'html-links': [linksVideo],
    'html-lists': [listsVideo],
    'html-images': [imagesVideo],
    'html-tables': [tablesVideo],
    'html-forms': [formsVideo],
    'html-semantic': [htmlSemanticVideo],
    // CSS Module
    'css-intro': [cssWhatIs],
    'css-inline': [cssInline],
    'css-internal': [cssInternal],
    'css-external': [cssExternal],
    'css-colors-fonts': [cssTypography],
    // CSS Advanced Module
    'css-layout': [cssLayoutVideo],
    // JavaScript Module
    'js-intro': [jsIntroVideo],
    'js-variables': [jsVariablesVideo],
    'js-functions': [jsFunctionsVideo],
    'js-dom': [jsDomVideo],
    'js-events': [jsEventsVideo],
    'responsive-basics': [resVideo],
    // Python Module
    'python-intro': [pythonIntroVideo],
    'python-data-types': [pythonDataTypesVideo],
    'python-control-flow': [pythonControlFlowVideo],
  };

  // Function to render content with video placeholders
  const renderContentWithVideos = (content: string, videos?: string[], useHtmlIntro?: boolean) => {
    const processedContent = processContent(content);
    const parts = processedContent.split('[VIDEO_PLACEHOLDER]');

    // Suppress placeholder box for specific Beginner lessons
    const suppressPlaceholder = !!(currentLesson && (
      currentLesson.id === 'css-box-model' ||
      currentLesson.id === 'responsive-basics'
    ));
    
    const elements = [];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        elements.push(
          <div key={`content-${i}`} style={{ textAlign: 'left' }} className="text-left" dangerouslySetInnerHTML={{ __html: parts[i] }} />
        );
      }
      if (i < parts.length - 1) {
        if (useHtmlIntro && videos && videos.length >= 2) {
          elements.push(
            <HtmlIntroVideoCarousel key={`video-${i}`} />
          );
        } else if (videos && videos.length > 0) {
          elements.push(
            <video key={`video-${i}`} className="w-full h-auto bg-black rounded-lg border border-gray-700" controls preload="metadata" src={videos[0]} />
          );
        } else if (!suppressPlaceholder) {
          elements.push(
            <VideoPlaceholder 
              key={`video-${i}`} 
              title="Video Explanation Coming Soon"
              subtitle="Video explanation coming soon - stay tuned!"
            />
          );
        }
      }
    }
    
    return elements;
  };

  // Lightweight additional explanations per topic to enrich content
  const additionalExplanations: Record<string, string> = {
    'html-intro': `
      <h3>🧠 Deeper Insight: Why Semantic HTML Matters</h3>
      <p>Semantic tags (like <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>) describe meaning, not appearance. They improve accessibility, SEO, and developer clarity. Screen readers and search engines rely on this structure to understand your page.</p>
      <ul>
        <li>Use meaningful elements instead of generic <code>&lt;div&gt;</code> blocks.</li>
        <li>Pair semantic tags with ARIA attributes only when necessary.</li>
        <li>Keep a logical outline using headings <code>&lt;h1&gt;</code> → <code>&lt;h6&gt;</code>.</li>
      </ul>
    `,
    'html-forms': `
      <h3>🧾 Extra Notes: Building Accessible Forms</h3>
      <p>Always link labels to inputs using <code>for</code>/<code>id</code>. Provide helpful <code>placeholder</code> and <code>aria-describedby</code> for hints and errors. Group related inputs with <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code>.</p>
      <ul>
        <li>Validate on both client and server for robustness.</li>
        <li>Use input types (email, number, date) to get native UX benefits.</li>
        <li>Provide clear error messages and success states.</li>
      </ul>
    `,
    'html-tables': `
      <h3>📊 Extra Notes: Structuring Data in Tables</h3>
      <p>Use <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, and <code>&lt;tfoot&gt;</code> to organize rows. Add <code>scope</code> to headers for accessibility and consider <code>caption</code> for a concise table description.</p>
      <ul>
        <li>Do not use tables for layout—stick to CSS layout systems.</li>
        <li>Keep columns consistent and avoid merging cells excessively.</li>
      </ul>
    `,
    'html-semantic': `
      <h3>🧩 Extra Notes: Semantic Structure Patterns</h3>
      <p>A common layout: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code> (with <code>&lt;article&gt;</code>/<code>&lt;section&gt;</code>), <code>&lt;aside&gt;</code>, and <code>&lt;footer&gt;</code>. This pattern scales across pages and improves maintainability.</p>
      <ul>
        <li>Prefer <code>&lt;section&gt;</code> for grouped content with a heading.</li>
        <li>Use <code>&lt;article&gt;</code> for standalone, reusable content blocks.</li>
      </ul>
    `,
    'week2-css-grid': `
      <h3>🧱 Extra Notes: Practical CSS Grid Tips</h3>
      <p>Start with a simple grid using <code>repeat()</code> and <code>minmax()</code>, then refine with areas. Combine grid with flexbox for inner alignment.</p>
      <ul>
        <li>Use <code>grid-template-areas</code> for readable page layouts.</li>
        <li>Leverage <code>auto-fit</code>/<code>auto-fill</code> for responsive galleries.</li>
      </ul>
    `,
    'week3-css-animations': `
      <h3>🎞️ Extra Notes: Animation Best Practices</h3>
      <p>Prefer transform and opacity for smooth animations; avoid animating layout-affecting properties (like width/left) when possible. Keep durations consistent for a cohesive feel.</p>
      <ul>
        <li>Use <code>will-change</code> sparingly to hint performance optimization.</li>
        <li>Reduce motion for accessibility with <code>@media (prefers-reduced-motion)</code>.</li>
      </ul>
    `,
    'css-box-model': `
      <h3>📦 Deeper Explanation: Box Model & box-sizing</h3>
      <p>The browser computes an element’s rendered size from four layers: <strong>content</strong>, <strong>padding</strong>, <strong>border</strong>, and <strong>margin</strong>. Margin is always outside the box and doesn’t affect width/height.</p>
      <ul>
        <li><strong>content-box</strong> (default): <code>width</code> excludes padding and border.</li>
        <li><strong>border-box</strong>: <code>width</code> includes padding and border; simplifies layouts.</li>
      </ul>
      <pre><code>/* Recommended baseline */
*, *::before, *::after { box-sizing: border-box; }</code></pre>
      <h4>🧭 Spacing strategy</h4>
      <ul>
        <li>Use <strong>padding</strong> for inner breathing room; <strong>margin</strong> for external separation.</li>
        <li>Inline elements ignore top/bottom margins; set <code>display: block</code> or <code>inline-block</code> when needed.</li>
        <li>Prefer consistent spacing scales (4/8/12/16px or rem equivalents) across components.</li>
      </ul>
      <h4>⬇️ Margin collapsing (vertical)</h4>
      <p>For block elements, adjacent vertical margins can collapse into a single margin (the larger value wins). It occurs between siblings, parent ⇄ first/last child, and empty blocks.</p>
      <pre><code>.a { margin-bottom: 20px; }
.b { margin-top: 30px; }
/* Actual vertical space is 30px, not 50px */</code></pre>
      <h4>📐 Layout tips</h4>
      <ul>
        <li>Avoid relying on <code>width + padding + border</code> math—use <strong>border-box</strong>.</li>
        <li>Use Flexbox or Grid for alignment and two-dimensional layouts instead of floats.</li>
        <li>Set <code>max-width</code> for readable text blocks and allow containers to shrink on mobile.</li>
      </ul>
    `,
    'responsive-basics': `
      <h3>📱 Deeper Explanation: Mobile‑first Responsive Flow</h3>
      <p>Design for small screens first, then progressively enhance for larger viewports using <code>@media (min-width)</code> queries.</p>
      <ul>
        <li>Prefer fluid units: <code>%</code>, <code>vw</code>, and <code>rem</code> over fixed <code>px</code>.</li>
        <li>Images and media: <code>max-width: 100%</code>, <code>height: auto</code>.</li>
        <li>Use content‑driven breakpoints; common examples: 480px, 768px, 1024px, 1280px.</li>
        <li>Structure with Flexbox/Grid; avoid absolute positioning for general layout.</li>
      </ul>
      <pre><code>/* Typography scales smoothly */
h1 { font-size: clamp(1.5rem, 2.5vw, 2.25rem); }

/* Container centers and caps width */
.container { width: min(92%, 72rem); margin-inline: auto; }

/* Mobile-first media queries */
@media (min-width: 768px) {
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}</code></pre>
      <p>Test across devices and orientations. Use browser devtools for responsive simulation and keep touch targets large enough (≈44×44px).</p>
    `,
  };

  // Complete Frontend Development Beginner Course - Module-based
  const courseModules: CourseModule[] = [
    {
      id: 'html-module',
      title: 'HTML Module: Complete Guide to HTML Tags',
      lessons: [
        {
          id: 'html-intro',
          title: 'Introduction to HTML',
          content: `
            [VIDEO_PLACEHOLDER]
            <h2>🌟 What is HTML?</h2>
            <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using markup tags.</p>
            
            <h3>🏗️ HTML Elements</h3>
            <p>HTML elements are the building blocks of HTML pages. An HTML element is defined by a start tag, some content, and an end tag:</p>
            <code>&lt;tagname&gt;Content goes here...&lt;/tagname&gt;</code>
            
            <h3>📋 Basic HTML Structure</h3>
            <p>Every HTML document has a basic structure:</p>
            <ul>
              <li><code>&lt;!DOCTYPE html&gt;</code> - Document type declaration</li>
              <li><code>&lt;html&gt;</code> - Root element</li>
              <li><code>&lt;head&gt;</code> - Contains metadata</li>
              <li><code>&lt;body&gt;</code> - Contains visible content</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is my first paragraph.</p>
</body>
</html>`,
          exercises: [
            {
              id: 'ex1',
              question: 'Create a basic HTML page with a title and paragraph',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Your Title Here</title>\n</head>\n<body>\n    <!-- Add your content here -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Web Page</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>This is my first web page.</p>\n</body>\n</html>',
              hint: 'Use h1 for the main heading and p for paragraphs'
            }
          ]
        },
        {
          id: 'html-headings',
          title: 'HTML Headings (h1-h6)',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🎯 HTML Headings</h2>
            <p>HTML headings are defined with the &lt;h1&gt; to &lt;h6&gt; tags. &lt;h1&gt; defines the most important heading. &lt;h6&gt; defines the least important heading.</p>
            
            <h3>📏 Heading Hierarchy</h3>
            <ul>
              <li><code>&lt;h1&gt;</code> - Main heading (largest)</li>
              <li><code>&lt;h2&gt;</code> - Section heading</li>
              <li><code>&lt;h3&gt;</code> - Subsection heading</li>
              <li><code>&lt;h4&gt;</code> - Sub-subsection heading</li>
              <li><code>&lt;h5&gt;</code> - Minor heading</li>
              <li><code>&lt;h6&gt;</code> - Smallest heading</li>
            </ul>
            
            <h3>💡 Best Practices</h3>
            <p>Use headings to create a logical structure. Don't skip heading levels (don't use h4 after h2).</p>
          `,
          codeExample: `<h1>Main Title</h1>
<h2>Chapter Title</h2>
<h3>Section Title</h3>
<h4>Subsection Title</h4>
<h5>Minor Heading</h5>
<h6>Smallest Heading</h6>

<h1>Article Title</h1>
<h2>Introduction</h2>
<p>This is the introduction paragraph.</p>
<h2>Main Content</h2>
<h3>First Point</h3>
<p>Details about the first point.</p>
<h3>Second Point</h3>
<p>Details about the second point.</p>`,
          exercises: [
            {
              id: 'ex2',
              question: 'Create a document structure with proper heading hierarchy',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create a main title -->\n    <!-- Add two section headings -->\n    <!-- Add subsections under each section -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>My Blog</h1>\n    <h2>About Me</h2>\n    <h3>My Background</h3>\n    <h3>My Interests</h3>\n    <h2>My Projects</h2>\n    <h3>Web Development</h3>\n    <h3>Mobile Apps</h3>\n</body>\n</html>',
              hint: 'Use h1 for main title, h2 for sections, h3 for subsections'
            }
          ]
        },
        {
          id: 'html-paragraphs',
          title: 'HTML Paragraphs and Text Formatting',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>📝 HTML Paragraphs</h2>
            <p>The &lt;p&gt; tag defines a paragraph. Browsers automatically add space before and after paragraphs.</p>
            
            <h3>✨ Text Formatting Tags</h3>
            <ul>
              <li><code>&lt;strong&gt;</code> - Important text (bold)</li>
              <li><code>&lt;em&gt;</code> - Emphasized text (italic)</li>
              <li><code>&lt;mark&gt;</code> - Highlighted text</li>
              <li><code>&lt;small&gt;</code> - Smaller text</li>
              <li><code>&lt;del&gt;</code> - Deleted text (strikethrough)</li>
              <li><code>&lt;ins&gt;</code> - Inserted text (underlined)</li>
              <li><code>&lt;sub&gt;</code> - Subscript text</li>
              <li><code>&lt;sup&gt;</code> - Superscript text</li>
            </ul>
            
            <h3>🔄 Line Breaks and Horizontal Rules</h3>
            <ul>
              <li><code>&lt;br&gt;</code> - Line break</li>
              <li><code>&lt;hr&gt;</code> - Horizontal rule (line)</li>
            </ul>
          `,
          codeExample: `<p>This is a normal paragraph.</p>
<p>This paragraph contains <strong>bold text</strong> and <em>italic text</em>.</p>
<p>You can <mark>highlight text</mark> and make it <small>smaller</small>.</p>
<p>This shows <del>deleted text</del> and <ins>inserted text</ins>.</p>
<p>Chemical formula: H<sub>2</sub>O</p>
<p>Mathematical expression: E=mc<sup>2</sup></p>

<p>This is the first line.<br>This is the second line.</p>
<hr>
<p>Content after horizontal rule.</p>`,
          exercises: [
            {
              id: 'ex3',
              question: 'Create a paragraph with various text formatting',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create paragraphs with bold, italic, highlighted, and subscript text -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <p>This is <strong>important text</strong> and <em>emphasized text</em>.</p>\n    <p>Here is <mark>highlighted text</mark> and <small>small text</small>.</p>\n    <p>Water formula: H<sub>2</sub>O</p>\n    <hr>\n    <p>Content after line.</p>\n</body>\n</html>',
              hint: 'Use <strong>, <em>, <mark>, <small>, <sub> for different formatting'
            }
          ]
        },
        {
          id: 'html-links',
          title: 'HTML Links and Navigation',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🔗 HTML Links</h2>
            <p>Links are created with the &lt;a&gt; tag. The href attribute specifies the destination.</p>
            
            <h3>🎯 Types of Links</h3>
            <ul>
              <li><strong>External links:</strong> Link to other websites</li>
              <li><strong>Internal links:</strong> Link to other pages on your site</li>
              <li><strong>Anchor links:</strong> Link to sections within the same page</li>
              <li><strong>Email links:</strong> Open email client</li>
              <li><strong>Phone links:</strong> Dial phone numbers</li>
            </ul>
            
            <h3>🎨 Link Attributes</h3>
            <ul>
              <li><code>href</code> - Destination URL</li>
              <li><code>target</code> - Where to open the link</li>
              <li><code>title</code> - Tooltip text</li>
            </ul>
          `,
          codeExample: `<!-- External link -->
<a href="https://www.google.com">Visit Google</a>

<!-- Link opens in new tab -->
<a href="https://www.github.com" target="_blank">GitHub (New Tab)</a>

<!-- Internal link -->
<a href="about.html">About Us</a>

<!-- Anchor link -->
<a href="#section1">Go to Section 1</a>

<!-- Email link -->
<a href="mailto:someone@example.com">Send Email</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call Us</a>

<!-- Link with tooltip -->
<a href="https://www.example.com" title="Visit Example Site">Example</a>

<!-- Anchor target -->
<h2 id="section1">Section 1</h2>
<p>This is section 1 content.</p>`,
          exercises: [
            {
              id: 'ex4',
              question: 'Create different types of links',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create an external link -->\n    <!-- Create a link that opens in new tab -->\n    <!-- Create an email link -->\n    <!-- Create an anchor link -->\n    \n    <h2 id="bottom">Bottom Section</h2>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <a href="https://www.w3schools.com">Visit W3Schools</a><br>\n    <a href="https://www.mozilla.org" target="_blank">Mozilla (New Tab)</a><br>\n    <a href="mailto:test@example.com">Send Email</a><br>\n    <a href="#bottom">Go to Bottom</a>\n    \n    <h2 id="bottom">Bottom Section</h2>\n</body>\n</html>',
              hint: 'Use href for URLs, target="_blank" for new tabs, mailto: for emails, # for anchors'
            }
          ]
        },
        {
          id: 'html-lists',
          title: 'HTML Lists (Ordered, Unordered, Description)',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>📋 HTML Lists</h2>
            <p>HTML supports three types of lists: ordered, unordered, and description lists.</p>
            
            <h3>🔢 Ordered Lists (&lt;ol&gt;)</h3>
            <p>Use for numbered or lettered lists. Each item is wrapped in &lt;li&gt; tags.</p>
            
            <h3>🔸 Unordered Lists (&lt;ul&gt;)</h3>
            <p>Use for bullet point lists. Each item is wrapped in &lt;li&gt; tags.</p>
            
            <h3>📖 Description Lists (&lt;dl&gt;)</h3>
            <p>Use for term-definition pairs. Uses &lt;dt&gt; for terms and &lt;dd&gt; for definitions.</p>
            
            <h3>🎨 List Attributes</h3>
            <ul>
              <li><code>type</code> - Changes numbering/bullet style</li>
              <li><code>start</code> - Starting number for ordered lists</li>
            </ul>
          `,
          codeExample: `<!-- Ordered List -->
<h3>Steps to Make Coffee</h3>
<ol>
    <li>Boil water</li>
    <li>Add coffee grounds</li>
    <li>Pour hot water</li>
    <li>Stir and enjoy</li>
</ol>

<!-- Ordered list with different type -->
<ol type="A">
    <li>First item</li>
    <li>Second item</li>
</ol>

<!-- Unordered List -->
<h3>Shopping List</h3>
<ul>
    <li>Milk</li>
    <li>Bread</li>
    <li>Eggs</li>
    <li>Butter</li>
</ul>

<!-- Nested Lists -->
<ul>
    <li>Fruits
        <ul>
            <li>Apples</li>
            <li>Bananas</li>
        </ul>
    </li>
    <li>Vegetables
        <ul>
            <li>Carrots</li>
            <li>Broccoli</li>
        </ul>
    </li>
</ul>

<!-- Description List -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
    <dt>JS</dt>
    <dd>JavaScript</dd>
</dl>`,
          exercises: [
            {
              id: 'ex5',
              question: 'Create different types of lists',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create an ordered list of your daily routine -->\n    <!-- Create an unordered list of hobbies -->\n    <!-- Create a description list of programming terms -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <h3>Daily Routine</h3>\n    <ol>\n        <li>Wake up</li>\n        <li>Brush teeth</li>\n        <li>Have breakfast</li>\n        <li>Go to work</li>\n    </ol>\n    \n    <h3>My Hobbies</h3>\n    <ul>\n        <li>Reading</li>\n        <li>Gaming</li>\n        <li>Coding</li>\n    </ul>\n    \n    <h3>Programming Terms</h3>\n    <dl>\n        <dt>Variable</dt>\n        <dd>A storage location with a name</dd>\n        <dt>Function</dt>\n        <dd>A reusable block of code</dd>\n    </dl>\n</body>\n</html>',
              hint: 'Use <ol> for ordered, <ul> for unordered, <dl><dt><dd> for description lists'
            }
          ]
        },
        {
          id: 'html-images',
          title: 'HTML Images and Media',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🖼️ HTML Images</h2>
            <p>The &lt;img&gt; tag is used to embed images. It's a self-closing tag with important attributes.</p>
            
            <h3>🎯 Image Attributes</h3>
            <ul>
              <li><code>src</code> - Image source URL (required)</li>
              <li><code>alt</code> - Alternative text (required for accessibility)</li>
              <li><code>width</code> - Image width</li>
              <li><code>height</code> - Image height</li>
              <li><code>title</code> - Tooltip text</li>
            </ul>
            
            <h3>📱 Responsive Images</h3>
            <p>Use CSS or responsive attributes to make images adapt to different screen sizes.</p>
            
            <h3>🎵 Other Media Elements</h3>
            <ul>
              <li><code>&lt;audio&gt;</code> - Embed audio files</li>
              <li><code>&lt;video&gt;</code> - Embed video files</li>
              <li><code>&lt;iframe&gt;</code> - Embed other web pages</li>
            </ul>
          `,
          codeExample: `<!-- Basic image -->
<img src="https://via.placeholder.com/300x200" alt="Placeholder image">

<!-- Image with dimensions -->
<img src="https://via.placeholder.com/400x300" alt="Large placeholder" width="200" height="150">

<!-- Image with title tooltip -->
<img src="https://via.placeholder.com/150x150" alt="Small image" title="This is a tooltip">

<!-- Audio element -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>

<!-- Video element -->
<video width="320" height="240" controls>
    <source src="movie.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

<!-- Iframe for embedding -->
<iframe src="https://www.google.com/maps/embed" width="300" height="200"></iframe>`,
          exercises: [
            {
              id: 'ex6',
              question: 'Add images with proper attributes',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <!-- Add an image with src, alt, and title -->\n    <!-- Add an image with specific width and height -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <img src="https://via.placeholder.com/300x200" alt="Sample image" title="This is a sample image">\n    <img src="https://via.placeholder.com/400x300" alt="Large image" width="200" height="150">\n</body>\n</html>',
              hint: 'Always include src and alt attributes. Use width/height for sizing.'
            }
          ]
        },
        {
          id: 'html-tables',
          title: 'HTML Tables',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>📊 HTML Tables</h2>
            <p>Tables are used to display data in rows and columns. They consist of several elements working together.</p>
            
            <h3>🏗️ Table Structure</h3>
            <ul>
              <li><code>&lt;table&gt;</code> - Table container</li>
              <li><code>&lt;thead&gt;</code> - Table header section</li>
              <li><code>&lt;tbody&gt;</code> - Table body section</li>
              <li><code>&lt;tfoot&gt;</code> - Table footer section</li>
              <li><code>&lt;tr&gt;</code> - Table row</li>
              <li><code>&lt;th&gt;</code> - Table header cell</li>
              <li><code>&lt;td&gt;</code> - Table data cell</li>
            </ul>
            
            <h3>🎨 Table Attributes</h3>
            <ul>
              <li><code>colspan</code> - Span multiple columns</li>
              <li><code>rowspan</code> - Span multiple rows</li>
              <li><code>border</code> - Table border</li>
            </ul>
          `,
          codeExample: `<!-- Basic Table -->
<table border="1">
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John</td>
            <td>25</td>
            <td>New York</td>
        </tr>
        <tr>
            <td>Jane</td>
            <td>30</td>
            <td>London</td>
        </tr>
        <tr>
            <td>Bob</td>
            <td>35</td>
            <td>Paris</td>
        </tr>
    </tbody>
</table>

<!-- Table with colspan and rowspan -->
<table border="1">
    <tr>
        <th colspan="2">Sales Report</th>
    </tr>
    <tr>
        <td>Product</td>
        <td>Revenue</td>
    </tr>
    <tr>
        <td>Laptops</td>
        <td rowspan="2">$50,000</td>
    </tr>
    <tr>
        <td>Phones</td>
    </tr>
</table>`,
          exercises: [
            {
              id: 'ex7',
              question: 'Create a table with student information',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create a table with columns: Student Name, Subject, Grade -->\n    <!-- Add at least 3 rows of data -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <table border="1">\n        <thead>\n            <tr>\n                <th>Student Name</th>\n                <th>Subject</th>\n                <th>Grade</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td>Alice</td>\n                <td>Math</td>\n                <td>A</td>\n            </tr>\n            <tr>\n                <td>Bob</td>\n                <td>Science</td>\n                <td>B+</td>\n            </tr>\n            <tr>\n                <td>Carol</td>\n                <td>English</td>\n                <td>A-</td>\n            </tr>\n        </tbody>\n    </table>\n</body>\n</html>',
              hint: 'Use <table>, <thead>, <tbody>, <tr>, <th>, and <td> elements'
            }
          ]
        },
        {
          id: 'html-forms',
          title: 'HTML Forms and Input Elements',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>📝 HTML Forms</h2>
            <p>Forms are used to collect user input. The &lt;form&gt; element contains various input elements.</p>
            
            <h3>🎯 Input Types</h3>
            <ul>
              <li><code>text</code> - Single-line text input</li>
              <li><code>password</code> - Password input (hidden)</li>
              <li><code>email</code> - Email input with validation</li>
              <li><code>number</code> - Numeric input</li>
              <li><code>date</code> - Date picker</li>
              <li><code>checkbox</code> - Checkbox for multiple selections</li>
              <li><code>radio</code> - Radio button for single selection</li>
              <li><code>submit</code> - Submit button</li>
              <li><code>reset</code> - Reset button</li>
            </ul>
            
            <h3>🏷️ Form Elements</h3>
            <ul>
              <li><code>&lt;label&gt;</code> - Labels for inputs</li>
              <li><code>&lt;textarea&gt;</code> - Multi-line text input</li>
              <li><code>&lt;select&gt;</code> - Dropdown list</li>
              <li><code>&lt;fieldset&gt;</code> - Group related inputs</li>
            </ul>
          `,
          codeExample: `<form action="/submit" method="post">
    <fieldset>
        <legend>Personal Information</legend>
        
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br><br>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br><br>
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br><br>
        
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" min="1" max="120"><br><br>
        
        <label for="birthdate">Birth Date:</label>
        <input type="date" id="birthdate" name="birthdate"><br><br>
    </fieldset>
    
    <fieldset>
        <legend>Preferences</legend>
        
        <label>Gender:</label><br>
        <input type="radio" id="male" name="gender" value="male">
        <label for="male">Male</label><br>
        <input type="radio" id="female" name="gender" value="female">
        <label for="female">Female</label><br><br>
        
        <label>Interests:</label><br>
        <input type="checkbox" id="coding" name="interests" value="coding">
        <label for="coding">Coding</label><br>
        <input type="checkbox" id="music" name="interests" value="music">
        <label for="music">Music</label><br><br>
        
        <label for="country">Country:</label>
        <select id="country" name="country">
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
        </select><br><br>
        
        <label for="comments">Comments:</label><br>
        <textarea id="comments" name="comments" rows="4" cols="50"></textarea><br><br>
    </fieldset>
    
    <input type="submit" value="Submit">
    <input type="reset" value="Reset">
</form>`,
          exercises: [
            {
              id: 'ex8',
              question: 'Create a contact form',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create a form with name, email, message fields and submit button -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <form>\n        <label for="name">Name:</label><br>\n        <input type="text" id="name" name="name" required><br><br>\n        \n        <label for="email">Email:</label><br>\n        <input type="email" id="email" name="email" required><br><br>\n        \n        <label for="message">Message:</label><br>\n        <textarea id="message" name="message" rows="4" cols="50"></textarea><br><br>\n        \n        <input type="submit" value="Send Message">\n    </form>\n</body>\n</html>',
              hint: 'Use <form>, <label>, <input>, <textarea> elements with proper attributes'
            }
          ]
        },
        {
          id: 'html-semantic',
          title: 'HTML5 Semantic Elements',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🏗️ HTML5 Semantic Elements</h2>
            <p>Semantic elements clearly describe their meaning to both the browser and the developer.</p>
            
            <h3>📋 Main Semantic Elements</h3>
            <ul>
              <li><code>&lt;header&gt;</code> - Header of a document or section</li>
              <li><code>&lt;nav&gt;</code> - Navigation links</li>
              <li><code>&lt;main&gt;</code> - Main content of the document</li>
              <li><code>&lt;article&gt;</code> - Independent, self-contained content</li>
              <li><code>&lt;section&gt;</code> - Thematic grouping of content</li>
              <li><code>&lt;aside&gt;</code> - Content aside from main content</li>
              <li><code>&lt;footer&gt;</code> - Footer of a document or section</li>
            </ul>
            
            <h3>🎯 Content Semantic Elements</h3>
            <ul>
              <li><code>&lt;figure&gt;</code> - Self-contained content (images, diagrams)</li>
              <li><code>&lt;figcaption&gt;</code> - Caption for figure</li>
              <li><code>&lt;time&gt;</code> - Date/time</li>
              <li><code>&lt;mark&gt;</code> - Highlighted text</li>
              <li><code>&lt;details&gt;</code> - Collapsible content</li>
              <li><code>&lt;summary&gt;</code> - Summary for details</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>Semantic HTML Example</title>
</head>
<body>
    <header>
        <h1>My Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <header>
                <h2>Article Title</h2>
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>
            
            <section>
                <h3>Introduction</h3>
                <p>This is the introduction section.</p>
            </section>
            
            <section>
                <h3>Main Content</h3>
                <p>This is the main content section.</p>
                
                <figure>
                    <img src="image.jpg" alt="Example image">
                    <figcaption>This is an image caption</figcaption>
                </figure>
            </section>
            
            <details>
                <summary>More Information</summary>
                <p>This content is hidden by default and can be expanded.</p>
            </details>
        </article>
        
        <aside>
            <h3>Related Links</h3>
            <ul>
                <li><a href="#">Related Article 1</a></li>
                <li><a href="#">Related Article 2</a></li>
            </ul>
        </aside>
    </main>
    
    <footer>
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
</body>
</html>`,
          exercises: [
            {
              id: 'ex9',
              question: 'Create a semantic HTML page structure',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create a page with header, nav, main, article, aside, and footer -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <header>\n        <h1>My Blog</h1>\n        <nav>\n            <a href="#home">Home</a> | <a href="#about">About</a>\n        </nav>\n    </header>\n    \n    <main>\n        <article>\n            <h2>Blog Post Title</h2>\n            <p>This is my blog post content.</p>\n        </article>\n        \n        <aside>\n            <h3>Sidebar</h3>\n            <p>Additional information here.</p>\n        </aside>\n    </main>\n    \n    <footer>\n        <p>Copyright 2024</p>\n    </footer>\n</body>\n</html>',
              hint: 'Use semantic elements: <header>, <nav>, <main>, <article>, <aside>, <footer>'
            }
          ]
        }
      ]
    },
    {
      id: 'css-module',
      title: 'CSS Module: Complete Styling Guide',
      lessons: [
        {
          id: 'css-intro',
          title: 'Introduction to CSS',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🎨 What is CSS?</h2>
            <p>CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, positioning, and much more.</p>
            
            <h3>🎯 CSS Syntax</h3>
            <p>CSS rules consist of a selector and declaration block:</p>
            <code>selector { property: value; }</code>
            
            <h3>📝 Why Use CSS?</h3>
            <ul>
              <li>Separates content from presentation</li>
              <li>Makes websites more maintainable</li>
              <li>Enables responsive design</li>
              <li>Improves loading speed</li>
              <li>Provides consistent styling</li>
            </ul>
            
            <h3>🔧 CSS Selectors</h3>
            <ul>
              <li><code>element</code> - Selects all elements of that type</li>
              <li><code>.class</code> - Selects elements with that class</li>
              <li><code>#id</code> - Selects element with that ID</li>
            </ul>
          `,
          codeExample: `/* CSS Syntax Examples */

/* Element selector */
h1 {
    color: blue;
    font-size: 36px;
}

/* Class selector */
.highlight {
    background-color: yellow;
    padding: 10px;
}

/* ID selector */
#header {
    text-align: center;
    margin-bottom: 20px;
}

/* Multiple properties */
p {
    color: #333;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 10px 0;
}`,
          exercises: [
            {
              id: 'ex10',
              question: 'Create CSS rules using different selectors',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        /* Add CSS rules here */\n    </style>\n</head>\n<body>\n    <h1 id="main-title">Welcome</h1>\n    <p class="intro">This is an introduction.</p>\n    <p>This is a regular paragraph.</p>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        h1 { color: navy; }\n        #main-title { text-align: center; }\n        .intro { font-weight: bold; background: lightblue; }\n        p { font-family: Arial; }\n    </style>\n</head>\n<body>\n    <h1 id="main-title">Welcome</h1>\n    <p class="intro">This is an introduction.</p>\n    <p>This is a regular paragraph.</p>\n</body>\n</html>',
              hint: 'Use h1 for element, #main-title for ID, .intro for class selectors'
            }
          ]
        },
        {
          id: 'css-inline',
          title: 'Inline CSS',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>

            <h2>📝 Inline CSS</h2>
            <p>Inline CSS is applied directly to HTML elements using the <code>style</code> attribute. It has the highest specificity and overrides other CSS.</p>
            
            <h3>✅ Advantages</h3>
            <ul>
              <li>Quick and easy for single elements</li>
              <li>Highest priority (overrides other styles)</li>
              <li>Good for testing styles</li>
              <li>No external files needed</li>
            </ul>
            
            <h3>❌ Disadvantages</h3>
            <ul>
              <li>Hard to maintain</li>
              <li>Increases HTML file size</li>
              <li>No reusability</li>
              <li>Mixes content with presentation</li>
            </ul>
            
            <h3>🎯 When to Use</h3>
            <p>Use inline CSS for:</p>
            <ul>
              <li>Quick testing and debugging</li>
              <li>One-time styling needs</li>
              <li>Email templates (limited CSS support)</li>
              <li>Overriding specific styles</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>Inline CSS Example</title>
</head>
<body>
    <!-- Inline CSS using style attribute -->
    <h1 style="color: red; text-align: center; font-size: 48px;">Main Title</h1>
    
    <p style="color: blue; font-family: Georgia; font-size: 18px; line-height: 1.8;">
        This paragraph is styled with inline CSS. Notice how the styles are applied directly to the element.
    </p>
    
    <div style="background-color: lightgreen; padding: 20px; border: 2px solid darkgreen; border-radius: 10px;">
        <h2 style="color: darkgreen; margin-top: 0;">Styled Box</h2>
        <p style="color: #333; margin-bottom: 0;">This div has inline styles for background, padding, and border.</p>
    </div>
    
    <!-- Multiple style properties -->
    <button style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
        Styled Button
    </button>
    
    <!-- Inline styles with hover effects (limited) -->
    <a href="#" style="color: purple; text-decoration: none; font-weight: bold; border-bottom: 2px solid purple;">
        Styled Link
    </a>
</body>
</html>`,
          exercises: [
            {
              id: 'ex11',
              question: 'Apply inline styles to different elements',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>Style this heading with inline CSS</h1>\n    <p>Make this paragraph blue and italic</p>\n    <div>Give this div a background color and padding</div>\n    <button>Style this button</button>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <h1 style="color: orange; text-align: center;">Style this heading with inline CSS</h1>\n    <p style="color: blue; font-style: italic;">Make this paragraph blue and italic</p>\n    <div style="background-color: lightcoral; padding: 15px;">Give this div a background color and padding</div>\n    <button style="background-color: green; color: white; padding: 8px 16px; border: none;">Style this button</button>\n</body>\n</html>',
              hint: 'Use style="property: value;" directly on each element'
            }
          ]
        },
        {
          id: 'css-internal',
          title: 'Internal CSS',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>

            <h2>🏠 Internal CSS</h2>
            <p>Internal CSS is defined within the <code>&lt;style&gt;</code> tag in the HTML document's <code>&lt;head&gt;</code> section. It applies to the entire document.</p>
            
            <h3>✅ Advantages</h3>
            <ul>
              <li>Styles are contained within the HTML file</li>
              <li>Can style multiple elements at once</li>
              <li>Better organization than inline CSS</li>
              <li>Supports all CSS features (selectors, pseudo-classes, etc.)</li>
              <li>Good for single-page websites</li>
            </ul>
            
            <h3>❌ Disadvantages</h3>
            <ul>
              <li>Increases HTML file size</li>
              <li>Styles can't be reused across multiple pages</li>
              <li>Harder to maintain for large websites</li>
              <li>No caching benefits</li>
            </ul>
            
            <h3>🎯 When to Use</h3>
            <p>Use internal CSS for:</p>
            <ul>
              <li>Single-page websites</li>
              <li>Page-specific styles</li>
              <li>Prototyping and development</li>
              <li>Small projects</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>Internal CSS Example</title>
    <style>
        /* Internal CSS goes here */
        
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .highlight {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .button {
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        
        .button:hover {
            background-color: #2980b9;
        }
        
        ul {
            list-style-type: none;
            padding: 0;
        }
        
        li {
            background-color: #ecf0f1;
            margin: 5px 0;
            padding: 10px;
            border-left: 4px solid #3498db;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Internal CSS Demo</h1>
        
        <div class="highlight">
            <p>This is a highlighted section styled with internal CSS.</p>
        </div>
        
        <h2>Features:</h2>
        <ul>
            <li>Organized styling in the head section</li>
            <li>Supports all CSS features</li>
            <li>Can use classes and IDs</li>
            <li>Supports pseudo-classes like :hover</li>
        </ul>
        
        <button class="button">Hover Over Me!</button>
    </div>
</body>
</html>`,
          exercises: [
            {
              id: 'ex12',
              question: 'Create internal CSS with classes and hover effects',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        /* Add your internal CSS here */\n    </style>\n</head>\n<body>\n    <h1>My Website</h1>\n    <div class="card">\n        <h2>Card Title</h2>\n        <p>Card content goes here.</p>\n        <button class="btn">Click Me</button>\n    </div>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        body { font-family: Arial; background: #f0f0f0; }\n        h1 { color: #333; text-align: center; }\n        .card { background: white; padding: 20px; margin: 20px; border-radius: 8px; }\n        .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; }\n        .btn:hover { background: #0056b3; }\n    </style>\n</head>\n<body>\n    <h1>My Website</h1>\n    <div class="card">\n        <h2>Card Title</h2>\n        <p>Card content goes here.</p>\n        <button class="btn">Click Me</button>\n    </div>\n</body>\n</html>',
              hint: 'Define styles in <style> tag, use classes with dots, add :hover for effects'
            }
          ]
        },
        {
          id: 'css-external',
          title: 'External CSS',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>

            <h2>🔗 External CSS</h2>
            <p>External CSS is stored in separate .css files and linked to HTML documents using the <code>&lt;link&gt;</code> tag. This is the most common and recommended method.</p>
            
            <h3>✅ Advantages</h3>
            <ul>
              <li>Complete separation of content and presentation</li>
              <li>Reusable across multiple HTML pages</li>
              <li>Easier to maintain and update</li>
              <li>Smaller HTML file sizes</li>
              <li>Browser caching improves performance</li>
              <li>Better organization for large projects</li>
            </ul>
            
            <h3>❌ Disadvantages</h3>
            <ul>
              <li>Requires additional HTTP request</li>
              <li>Slightly more complex setup</li>
              <li>Need to manage multiple files</li>
            </ul>
            
            <h3>🎯 When to Use</h3>
            <p>Use external CSS for:</p>
            <ul>
              <li>Multi-page websites</li>
              <li>Production websites</li>
              <li>Large projects</li>
              <li>When you need consistent styling across pages</li>
              <li>Team development projects</li>
            </ul>
            
            <h3>📁 File Structure</h3>
            <p>Organize your files like this:</p>
            <ul>
              <li>📁 project-folder/</li>
              <li>&nbsp;&nbsp;📄 index.html</li>
              <li>&nbsp;&nbsp;📁 css/</li>
              <li>&nbsp;&nbsp;&nbsp;&nbsp;📄 styles.css</li>
            </ul>
          `,
          codeExample: `<!-- HTML File (index.html) -->
<!DOCTYPE html>
<html>
<head>
    <title>External CSS Example</title>
    <!-- Link to external CSS file -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <h1>My Website</h1>
        <nav class="navigation">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="main-content">
        <section class="hero">
            <h2>Welcome to My Site</h2>
            <p>This page is styled with external CSS.</p>
            <button class="cta-button">Get Started</button>
        </section>
        
        <section class="features">
            <div class="feature-card">
                <h3>Feature 1</h3>
                <p>Description of feature 1.</p>
            </div>
            <div class="feature-card">
                <h3>Feature 2</h3>
                <p>Description of feature 2.</p>
            </div>
        </section>
    </main>
</body>
</html>

/* CSS File (styles.css) */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 0;
}

.header h1 {
    text-align: center;
    margin-bottom: 1rem;
}

.navigation ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 2rem;
}

.navigation a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.navigation a:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    padding: 4rem 0;
    background-color: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 3rem;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.cta-button {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-card h3 {
    color: #3498db;
    margin-bottom: 1rem;
}`,
          exercises: [
            {
              id: 'ex13',
              question: 'Create an HTML file that links to external CSS',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>External CSS Practice</title>\n    <!-- Add link to external CSS here -->\n</head>\n<body>\n    <h1 class="title">My Page</h1>\n    <p class="content">This should be styled with external CSS.</p>\n    <button class="button">Click Me</button>\n</body>\n</html>\n\n/* Create styles.css file with these styles: */\n/* .title - blue color, center aligned */\n/* .content - gray color, larger font */\n/* .button - green background, white text */',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>External CSS Practice</title>\n    <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n    <h1 class="title">My Page</h1>\n    <p class="content">This should be styled with external CSS.</p>\n    <button class="button">Click Me</button>\n</body>\n</html>\n\n/* styles.css */\n.title {\n    color: blue;\n    text-align: center;\n}\n\n.content {\n    color: gray;\n    font-size: 18px;\n}\n\n.button {\n    background-color: green;\n    color: white;\n    padding: 10px 20px;\n    border: none;\n}',
              hint: 'Use <link rel="stylesheet" href="styles.css"> in the head section'
            }
          ]
        },
        {
          id: 'css-colors-fonts',
          title: 'CSS Colors and Typography',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🎨 CSS Colors</h2>
            <p>CSS provides multiple ways to specify colors for text, backgrounds, borders, and other elements.</p>
            
            <h3>🌈 Color Methods</h3>
            <ul>
              <li><strong>Named Colors:</strong> red, blue, green, etc.</li>
              <li><strong>Hex Colors:</strong> #FF0000, #00FF00, #0000FF</li>
              <li><strong>RGB Colors:</strong> rgb(255, 0, 0)</li>
              <li><strong>RGBA Colors:</strong> rgba(255, 0, 0, 0.5) - with transparency</li>
              <li><strong>HSL Colors:</strong> hsl(0, 100%, 50%)</li>
            </ul>
            
            <h3>✍️ Typography Properties</h3>
            <ul>
              <li><code>font-family</code> - Font type</li>
              <li><code>font-size</code> - Text size</li>
              <li><code>font-weight</code> - Text thickness (bold, normal)</li>
              <li><code>font-style</code> - Italic, normal</li>
              <li><code>text-align</code> - Text alignment</li>
              <li><code>text-decoration</code> - Underline, strikethrough</li>
              <li><code>line-height</code> - Space between lines</li>
              <li><code>letter-spacing</code> - Space between letters</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        /* Color Examples */
        .named-color { color: red; }
        .hex-color { color: #3498db; }
        .rgb-color { color: rgb(46, 204, 113); }
        .rgba-color { color: rgba(231, 76, 60, 0.7); }
        .hsl-color { color: hsl(271, 76%, 53%); }
        
        /* Background Colors */
        .bg-gradient {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            padding: 20px;
            color: white;
        }
        
        /* Typography Examples */
        .serif-font {
            font-family: 'Times New Roman', serif;
            font-size: 18px;
        }
        
        .sans-serif-font {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            font-weight: bold;
        }
        
        .custom-text {
            font-family: Georgia, serif;
            font-size: 20px;
            font-style: italic;
            text-align: center;
            text-decoration: underline;
            letter-spacing: 2px;
            line-height: 1.8;
        }
        
        .monospace-font {
            font-family: 'Courier New', monospace;
            background-color: #f4f4f4;
            padding: 10px;
            border-left: 4px solid #007bff;
        }
        
        /* Text Effects */
        .shadow-text {
            font-size: 24px;
            color: #333;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .uppercase-text {
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <h1>CSS Colors and Typography</h1>
    
    <h2>Color Examples:</h2>
    <p class="named-color">Named color: red</p>
    <p class="hex-color">Hex color: #3498db</p>
    <p class="rgb-color">RGB color: rgb(46, 204, 113)</p>
    <p class="rgba-color">RGBA color with transparency</p>
    <p class="hsl-color">HSL color: hsl(271, 76%, 53%)</p>
    
    <div class="bg-gradient">
        <p>Gradient background with white text</p>
    </div>
    
    <h2>Typography Examples:</h2>
    <p class="serif-font">This uses a serif font (Times New Roman)</p>
    <p class="sans-serif-font">This uses a sans-serif font (Arial) and is bold</p>
    <p class="custom-text">Custom styled text with multiple properties</p>
    <p class="monospace-font">Monospace font for code examples</p>
    <p class="shadow-text">Text with shadow effect</p>
    <p class="uppercase-text">Uppercase transformed text</p>
</body>
</html>`,
          exercises: [
            {
              id: 'ex14',
              question: 'Style text with different colors and typography',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        /* Style the elements below */\n    </style>\n</head>\n<body>\n    <h1 class="main-title">Website Title</h1>\n    <p class="intro">This is the introduction paragraph.</p>\n    <p class="highlight">This paragraph should be highlighted.</p>\n    <p class="code">This looks like code.</p>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        .main-title {\n            color: #2c3e50;\n            font-family: Arial, sans-serif;\n            text-align: center;\n            font-size: 32px;\n        }\n        .intro {\n            color: #7f8c8d;\n            font-size: 18px;\n            line-height: 1.6;\n        }\n        .highlight {\n            background-color: #f1c40f;\n            padding: 10px;\n            font-weight: bold;\n        }\n        .code {\n            font-family: monospace;\n            background-color: #ecf0f1;\n            padding: 8px;\n            border-left: 3px solid #3498db;\n        }\n    </style>\n</head>\n<body>\n    <h1 class="main-title">Website Title</h1>\n    <p class="intro">This is the introduction paragraph.</p>\n    <p class="highlight">This paragraph should be highlighted.</p>\n    <p class="code">This looks like code.</p>\n</body>\n</html>',
              hint: 'Use color, background-color, font-family, font-size, and other typography properties'
            }
          ]
        },
        {
          id: 'css-box-model',
          title: 'CSS Box Model and Layout',
          content: `
            
            <h2>📦 The CSS Box Model</h2>
            <p>Every HTML element is a rectangular box. The CSS box model describes how the size of these boxes is calculated.</p>
            
            <h3>🏗️ Box Model Components</h3>
            <ul>
              <li><strong>Content:</strong> The actual content (text, images)</li>
              <li><strong>Padding:</strong> Space between content and border</li>
              <li><strong>Border:</strong> Line around the padding</li>
              <li><strong>Margin:</strong> Space outside the border</li>
            </ul>
            
            <h3>📏 Size Properties</h3>
            <ul>
              <li><code>width</code> - Element width</li>
              <li><code>height</code> - Element height</li>
              <li><code>max-width</code> - Maximum width</li>
              <li><code>min-width</code> - Minimum width</li>
              <li><code>box-sizing</code> - How size is calculated</li>
            </ul>
            
            <h3>🎨 Border Properties</h3>
            <ul>
              <li><code>border-width</code> - Border thickness</li>
              <li><code>border-style</code> - solid, dashed, dotted</li>
              <li><code>border-color</code> - Border color</li>
              <li><code>border-radius</code> - Rounded corners</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        /* Box Model Demonstration */
        .box-example {
            width: 200px;
            height: 100px;
            padding: 20px;
            border: 5px solid #3498db;
            margin: 30px;
            background-color: #ecf0f1;
        }
        
        /* Different Border Styles */
        .border-solid { border: 3px solid #e74c3c; }
        .border-dashed { border: 3px dashed #f39c12; }
        .border-dotted { border: 3px dotted #27ae60; }
        .border-double { border: 5px double #9b59b6; }
        
        /* Border Radius Examples */
        .rounded-corners {
            border: 2px solid #34495e;
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
        }
        
        .circle {
            width: 100px;
            height: 100px;
            border: 3px solid #e67e22;
            border-radius: 50%;
            background-color: #f39c12;
        }
        
        /* Padding and Margin Examples */
        .padding-example {
            background-color: #3498db;
            color: white;
            padding: 20px 40px; /* top/bottom: 20px, left/right: 40px */
        }
        
        .margin-example {
            background-color: #e74c3c;
            color: white;
            margin: 20px auto; /* top/bottom: 20px, left/right: auto (center) */
            width: 300px;
            text-align: center;
            padding: 10px;
        }
        
        /* Box Sizing */
        .content-box {
            box-sizing: content-box; /* default */
            width: 200px;
            padding: 20px;
            border: 5px solid #2c3e50;
            background-color: #bdc3c7;
        }
        
        .border-box {
            box-sizing: border-box;
            width: 200px;
            padding: 20px;
            border: 5px solid #2c3e50;
            background-color: #95a5a6;
        }
        
        /* Container for comparison */
        .container {
            display: flex;
            gap: 20px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>CSS Box Model Examples</h1>
    
    <h2>Basic Box Model:</h2>
    <div class="box-example">
        Content area with padding, border, and margin
    </div>
    
    <h2>Border Styles:</h2>
    <div class="border-solid">Solid Border</div>
    <div class="border-dashed">Dashed Border</div>
    <div class="border-dotted">Dotted Border</div>
    <div class="border-double">Double Border</div>
    
    <h2>Border Radius:</h2>
    <div class="rounded-corners">Rounded corners with border-radius: 10px</div>
    <div class="circle">Circle</div>
    
    <h2>Padding and Margin:</h2>
    <div class="padding-example">This div has padding: 20px 40px</div>
    <div class="margin-example">This div is centered with margin: 20px auto</div>
    
    <h2>Box Sizing Comparison:</h2>
    <div class="container">
        <div class="content-box">content-box (default)<br>Total width > 200px</div>
        <div class="border-box">border-box<br>Total width = 200px</div>
    </div>
</body>
</html>`,
          exercises: [
            {
              id: 'ex15',
              question: 'Create boxes with different padding, borders, and margins',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        /* Create styles for the boxes below */\n    </style>\n</head>\n<body>\n    <div class="box1">Box 1: Add padding and solid border</div>\n    <div class="box2">Box 2: Add margin and dashed border</div>\n    <div class="box3">Box 3: Make this a circle</div>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        .box1 {\n            padding: 15px;\n            border: 2px solid #007bff;\n            background-color: #e7f3ff;\n            margin-bottom: 10px;\n        }\n        .box2 {\n            margin: 20px;\n            border: 3px dashed #28a745;\n            padding: 10px;\n            background-color: #d4edda;\n        }\n        .box3 {\n            width: 80px;\n            height: 80px;\n            border-radius: 50%;\n            background-color: #ffc107;\n            border: 2px solid #fd7e14;\n            text-align: center;\n            line-height: 80px;\n        }\n    </style>\n</head>\n<body>\n    <div class="box1">Box 1: Add padding and solid border</div>\n    <div class="box2">Box 2: Add margin and dashed border</div>\n    <div class="box3">Box 3: Make this a circle</div>\n</body>\n</html>',
              hint: 'Use padding, margin, border properties. For circle: equal width/height + border-radius: 50%'
            }
          ]
        }
      ]
    },
    {
      id: 'css-advanced-module',
      title: 'CSS Advanced: Layout & Responsive Design',
      lessons: [
        {
          id: 'css-layout',
          title: 'CSS Box Model and Layout',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>📦 The CSS Box Model</h2>
            <p>Every HTML element is a rectangular box with:</p>
            <ul>
              <li><strong>Content:</strong> The actual content</li>
              <li><strong>Padding:</strong> Space inside the border</li>
              <li><strong>Border:</strong> Line around the padding</li>
              <li><strong>Margin:</strong> Space outside the border</li>
            </ul>
            
            <h3>🎨 Background and Colors</h3>
            <p>Style elements with background colors, images, and borders.</p>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        .box {
            background-color: lightblue;
            padding: 20px;
            margin: 10px;
            border: 2px solid navy;
            width: 200px;
        }
    </style>
</head>
<body>
    <div class="box">
        <p>This is a styled box!</p>
    </div>
</body>
</html>`,
          exercises: [
            {
              id: 'ex5',
              question: 'Create a styled box with padding, margin, and border',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        .my-box {\n            /* Add your styles here */\n        }\n    </style>\n</head>\n<body>\n    <div class="my-box">\n        <h2>My Box</h2>\n        <p>Style this box!</p>\n    </div>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        .my-box {\n            background-color: lightgreen;\n            padding: 15px;\n            margin: 20px;\n            border: 3px solid darkgreen;\n            width: 250px;\n        }\n    </style>\n</head>\n<body>\n    <div class="my-box">\n        <h2>My Box</h2>\n        <p>Style this box!</p>\n    </div>\n</body>\n</html>',
              hint: 'Use background-color, padding, margin, border, and width properties'
            }
          ]
        },
        {
          id: 'responsive-basics',
          title: 'Responsive Design Basics',
          content: `
            
            [VIDEO_PLACEHOLDER]
            <h2>📱 What is Responsive Design?</h2>
            <p>Responsive design makes websites look good on all devices - desktops, tablets, and phones.</p>
            
            <h3>🔧 Key Techniques</h3>
            <ul>
              <li><strong>Flexible layouts:</strong> Use percentages instead of fixed pixels</li>
              <li><strong>Media queries:</strong> Different styles for different screen sizes</li>
              <li><strong>Flexible images:</strong> Images that scale with the container</li>
            </ul>
            
            <h3>📐 Viewport Meta Tag</h3>
            <p>Always include this in your HTML head:</p>
            <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        .container {
            width: 90%;
            max-width: 800px;
            margin: 0 auto;
        }
        
        @media (max-width: 600px) {
            .container {
                width: 95%;
            }
            h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Responsive Design</h1>
        <p>This layout adapts to different screen sizes!</p>
    </div>
</body>
</html>`,
          exercises: [
            {
              id: 'ex6',
              question: 'Create a responsive layout that changes on mobile devices',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <style>\n        .content {\n            /* Add responsive styles */\n        }\n        \n        /* Add media query for mobile */\n    </style>\n</head>\n<body>\n    <div class="content">\n        <h1>My Responsive Site</h1>\n        <p>This should look good on all devices!</p>\n    </div>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <style>\n        .content {\n            width: 80%;\n            margin: 0 auto;\n            padding: 20px;\n        }\n        \n        @media (max-width: 768px) {\n            .content {\n                width: 95%;\n                padding: 10px;\n            }\n            h1 {\n                font-size: 20px;\n            }\n        }\n    </style>\n</head>\n<body>\n    <div class="content">\n        <h1>My Responsive Site</h1>\n        <p>This should look good on all devices!</p>\n    </div>\n</body>\n</html>',
              hint: 'Use percentages for width and @media queries for different screen sizes'
            }
          ]
        }
      ]
    },
    {
      id: 'javascript-module',
      title: 'JavaScript Module: Complete Programming Guide',
      lessons: [
        {
          id: 'js-intro',
          title: 'Introduction to JavaScript',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>⚡ What is JavaScript?</h2>
            <p>JavaScript is a powerful programming language that makes websites interactive and dynamic. It runs in web browsers and can respond to user actions, manipulate content, and create engaging user experiences.</p>
            
            <h3>🌟 What Can JavaScript Do?</h3>
            <ul>
              <li>Change HTML content and attributes</li>
              <li>Modify CSS styles dynamically</li>
              <li>Respond to user events (clicks, typing, etc.)</li>
              <li>Validate form data</li>
              <li>Create animations and effects</li>
              <li>Communicate with servers (AJAX)</li>
              <li>Store data locally in the browser</li>
            </ul>
            
            <h3>🔧 Adding JavaScript to HTML</h3>
            <ul>
              <li><strong>Inline JavaScript:</strong> Using event attributes like onclick</li>
              <li><strong>Internal JavaScript:</strong> Using &lt;script&gt; tags in HTML</li>
              <li><strong>External JavaScript:</strong> Linking separate .js files</li>
            </ul>
            
            <h3>📝 JavaScript Syntax Basics</h3>
            <ul>
              <li>JavaScript is case-sensitive</li>
              <li>Statements end with semicolons (;)</li>
              <li>Use camelCase for variable names</li>
              <li>Comments: // for single line, /* */ for multi-line</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>JavaScript Introduction</title>
</head>
<body>
    <h1 id="welcome">Welcome to JavaScript!</h1>
    <p id="demo">This text will change.</p>
    
    <!-- Inline JavaScript -->
    <button onclick="alert('Hello from inline JavaScript!')">Inline JS</button>
    
    <!-- Internal JavaScript -->
    <button onclick="changeContent()">Change Content</button>
    <button onclick="changeStyle()">Change Style</button>
    
    <script>
        // Internal JavaScript
        console.log("JavaScript is running!");
        
        function changeContent() {
            document.getElementById('demo').innerHTML = 'Content changed by JavaScript!';
        }
        
        function changeStyle() {
            const element = document.getElementById('welcome');
            element.style.color = 'blue';
            element.style.fontSize = '36px';
        }
        
        // This runs when the page loads
        window.onload = function() {
            console.log("Page loaded successfully!");
        };
    </script>
</body>
</html>`,
          exercises: [
            {
              id: 'ex16',
              question: 'Create buttons that demonstrate different JavaScript capabilities',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <h1 id="title">JavaScript Practice</h1>\n    <p id="text">Original text</p>\n    \n    <button onclick="changeText()">Change Text</button>\n    <button onclick="changeColor()">Change Color</button>\n    <button onclick="showAlert()">Show Alert</button>\n    \n    <script>\n        function changeText() {\n            // Change the paragraph text\n        }\n        \n        function changeColor() {\n            // Change the title color to red\n        }\n        \n        function showAlert() {\n            // Show an alert message\n        }\n    </script>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <h1 id="title">JavaScript Practice</h1>\n    <p id="text">Original text</p>\n    \n    <button onclick="changeText()">Change Text</button>\n    <button onclick="changeColor()">Change Color</button>\n    <button onclick="showAlert()">Show Alert</button>\n    \n    <script>\n        function changeText() {\n            document.getElementById("text").innerHTML = "Text changed by JavaScript!";\n        }\n        \n        function changeColor() {\n            document.getElementById("title").style.color = "red";\n        }\n        \n        function showAlert() {\n            alert("Hello from JavaScript!");\n        }\n    </script>\n</body>\n</html>',
              hint: 'Use document.getElementById(), innerHTML for text, style.color for colors, and alert() for messages'
            }
          ]
        },
        {
          id: 'js-variables',
          title: 'JavaScript Variables and Data Types',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>📊 Variables in JavaScript</h2>
            <p>Variables are containers that store data values. JavaScript has different ways to declare variables and various data types.</p>
            
            <h3>🏷️ Variable Declaration</h3>
            <ul>
              <li><strong>let:</strong> Block-scoped, can be reassigned</li>
              <li><strong>const:</strong> Block-scoped, cannot be reassigned</li>
              <li><strong>var:</strong> Function-scoped, avoid in modern JavaScript</li>
            </ul>
            
            <h3>🎯 Data Types</h3>
            <ul>
              <li><strong>String:</strong> Text data ("Hello", 'World')</li>
              <li><strong>Number:</strong> Integers and decimals (42, 3.14)</li>
              <li><strong>Boolean:</strong> True or false values</li>
              <li><strong>Array:</strong> List of values [1, 2, 3]</li>
              <li><strong>Object:</strong> Key-value pairs {name: "John"}</li>
              <li><strong>Undefined:</strong> Variable declared but not assigned</li>
              <li><strong>Null:</strong> Intentionally empty value</li>
            </ul>
            
            <h3>🔧 Variable Naming Rules</h3>
            <ul>
              <li>Must start with letter, underscore, or dollar sign</li>
              <li>Can contain letters, numbers, underscores, dollar signs</li>
              <li>Cannot use JavaScript reserved words</li>
              <li>Use camelCase convention (firstName, lastName)</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<body>
    <h1>JavaScript Variables Demo</h1>
    <div id="output"></div>
    <button onclick="demonstrateVariables()">Show Variables</button>
    <button onclick="demonstrateDataTypes()">Show Data Types</button>
    
    <script>
        // Variable declarations
        let userName = "Alice";
        const PI = 3.14159;
        let age = 25;
        let isStudent = true;
        
        function demonstrateVariables() {
            let message = "Variable Examples:\n";
            message += "Name: " + userName + "\n";
            message += "Age: " + age + "\n";
            message += "PI: " + PI + "\n";
            message += "Is Student: " + isStudent;
            
            document.getElementById('output').innerHTML = message.replace(/\n/g, '<br>');
        }
        
        function demonstrateDataTypes() {
            // Different data types
            let text = "Hello World";           // String
            let number = 42;                    // Number
            let decimal = 3.14;                 // Number (decimal)
            let boolean = true;                 // Boolean
            let array = [1, 2, 3, "four"];     // Array
            let object = {                      // Object
                name: "John",
                age: 30,
                city: "New York"
            };
            let undefinedVar;                   // Undefined
            let nullVar = null;                 // Null
            
            let output = "Data Types:\n";
            output += "String: " + text + " (type: " + typeof text + ")\n";
            output += "Number: " + number + " (type: " + typeof number + ")\n";
            output += "Decimal: " + decimal + " (type: " + typeof decimal + ")\n";
            output += "Boolean: " + boolean + " (type: " + typeof boolean + ")\n";
            output += "Array: [" + array.join(", ") + "] (type: " + typeof array + ")\n";
            output += "Object: " + JSON.stringify(object) + " (type: " + typeof object + ")\n";
            output += "Undefined: " + undefinedVar + " (type: " + typeof undefinedVar + ")\n";
            output += "Null: " + nullVar + " (type: " + typeof nullVar + ")";
            
            document.getElementById('output').innerHTML = output.replace(/\n/g, '<br>');
        }
    </script>
</body>
</html>`,
          exercises: [
            {
              id: 'ex17',
              question: 'Create variables of different types and display them',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>My Variables</h1>\n    <div id="result"></div>\n    <button onclick="showMyVariables()">Show Variables</button>\n    \n    <script>\n        // Create variables here\n        let myName = "";\n        let myAge = 0;\n        let isLearning = false;\n        let hobbies = [];\n        \n        function showMyVariables() {\n            // Display all variables in the result div\n        }\n    </script>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>My Variables</h1>\n    <div id="result"></div>\n    <button onclick="showMyVariables()">Show Variables</button>\n    \n    <script>\n        let myName = "John Doe";\n        let myAge = 25;\n        let isLearning = true;\n        let hobbies = ["reading", "coding", "gaming"];\n        \n        function showMyVariables() {\n            let output = "My Information:<br>";\n            output += "Name: " + myName + "<br>";\n            output += "Age: " + myAge + "<br>";\n            output += "Learning: " + isLearning + "<br>";\n            output += "Hobbies: " + hobbies.join(", ");\n            \n            document.getElementById("result").innerHTML = output;\n        }\n    </script>\n</body>\n</html>',
              hint: 'Assign values to variables and use innerHTML to display them with <br> tags for line breaks'
            }
          ]
        },
        {
          id: 'js-functions',
          title: 'JavaScript Functions',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🔧 Functions in JavaScript</h2>
            <p>Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.</p>
            
            <h3>📝 Function Declaration</h3>
            <p>There are several ways to create functions:</p>
            <ul>
              <li><strong>Function Declaration:</strong> function name() {}</li>
              <li><strong>Function Expression:</strong> const name = function() {}</li>
              <li><strong>Arrow Function:</strong> const name = () => {}</li>
            </ul>
            
            <h3>📥 Parameters and Arguments</h3>
            <ul>
              <li><strong>Parameters:</strong> Variables listed in function definition</li>
              <li><strong>Arguments:</strong> Values passed to function when called</li>
              <li><strong>Default Parameters:</strong> Default values for parameters</li>
            </ul>
            
            <h3>📤 Return Values</h3>
            <p>Functions can return values using the <code>return</code> statement. If no return statement, function returns <code>undefined</code>.</p>
            
            <h3>🎯 Function Scope</h3>
            <p>Variables declared inside functions are local to that function and cannot be accessed from outside.</p>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<body>
    <h1>JavaScript Functions Demo</h1>
    <div id="output"></div>
    
    <button onclick="basicFunctions()">Basic Functions</button>
    <button onclick="parameterFunctions()">Functions with Parameters</button>
    <button onclick="returnFunctions()">Functions with Return</button>
    <button onclick="arrowFunctions()">Arrow Functions</button>
    
    <script>
        // Basic function declaration
        function greet() {
            return "Hello from a basic function!";
        }
        
        // Function with parameters
        function greetPerson(name, age = 18) {
            return "Hello " + name + ", you are " + age + " years old.";
        }
        
        // Function that returns a value
        function add(a, b) {
            return a + b;
        }
        
        function multiply(a, b) {
            return a * b;
        }
        
        // Function expression
        const subtract = function(a, b) {
            return a - b;
        };
        
        // Arrow functions
        const divide = (a, b) => {
            return a / b;
        };
        
        // Short arrow function
        const square = x => x * x;
        
        function basicFunctions() {
            let result = greet();
            document.getElementById('output').innerHTML = result;
        }
        
        function parameterFunctions() {
            let result = "";
            result += greetPerson("Alice") + "<br>";
            result += greetPerson("Bob", 25) + "<br>";
            result += greetPerson("Charlie", 30);
            document.getElementById('output').innerHTML = result;
        }
        
        function returnFunctions() {
            let result = "Math Operations:<br>";
            result += "5 + 3 = " + add(5, 3) + "<br>";
            result += "5 - 3 = " + subtract(5, 3) + "<br>";
            result += "5 * 3 = " + multiply(5, 3) + "<br>";
            result += "15 / 3 = " + divide(15, 3);
            document.getElementById('output').innerHTML = result;
        }
        
        function arrowFunctions() {
            let result = "Arrow Functions:<br>";
            result += "Square of 5: " + square(5) + "<br>";
            result += "10 / 2 = " + divide(10, 2);
            document.getElementById('output').innerHTML = result;
        }
    </script>
</body>
</html>`,
          exercises: [
            {
              id: 'ex18',
              question: 'Create functions for a simple calculator',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>Calculator Functions</h1>\n    <div id="result"></div>\n    \n    <button onclick="testCalculator()">Test Calculator</button>\n    \n    <script>\n        // Create these functions:\n        function add(a, b) {\n            // Return sum of a and b\n        }\n        \n        function subtract(a, b) {\n            // Return difference of a and b\n        }\n        \n        function multiply(a, b) {\n            // Return product of a and b\n        }\n        \n        function divide(a, b) {\n            // Return quotient of a and b\n        }\n        \n        function testCalculator() {\n            // Test all functions and display results\n        }\n    </script>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>Calculator Functions</h1>\n    <div id="result"></div>\n    \n    <button onclick="testCalculator()">Test Calculator</button>\n    \n    <script>\n        function add(a, b) {\n            return a + b;\n        }\n        \n        function subtract(a, b) {\n            return a - b;\n        }\n        \n        function multiply(a, b) {\n            return a * b;\n        }\n        \n        function divide(a, b) {\n            return a / b;\n        }\n        \n        function testCalculator() {\n            let output = "Calculator Results:<br>";\n            output += "10 + 5 = " + add(10, 5) + "<br>";\n            output += "10 - 5 = " + subtract(10, 5) + "<br>";\n            output += "10 * 5 = " + multiply(10, 5) + "<br>";\n            output += "10 / 5 = " + divide(10, 5);\n            \n            document.getElementById("result").innerHTML = output;\n        }\n    </script>\n</body>\n</html>',
              hint: 'Use return statements in each function and test them in testCalculator()'
            }
          ]
        },
        {
          id: 'js-dom',
          title: 'DOM Manipulation',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🌐 What is the DOM?</h2>
            <p>The DOM (Document Object Model) is a programming interface that represents HTML documents as a tree of objects. JavaScript can manipulate these objects to change content, structure, and styling.</p>
            
            <h3>🎯 Selecting Elements</h3>
            <ul>
              <li><code>getElementById()</code> - Select by ID</li>
              <li><code>getElementsByClassName()</code> - Select by class name</li>
              <li><code>getElementsByTagName()</code> - Select by tag name</li>
              <li><code>querySelector()</code> - Select first matching CSS selector</li>
              <li><code>querySelectorAll()</code> - Select all matching CSS selectors</li>
            </ul>
            
            <h3>🔧 Modifying Elements</h3>
            <ul>
              <li><code>innerHTML</code> - Change HTML content</li>
              <li><code>textContent</code> - Change text content</li>
              <li><code>style</code> - Change CSS styles</li>
              <li><code>className</code> - Change CSS classes</li>
              <li><code>setAttribute()</code> - Set attributes</li>
            </ul>
            
            <h3>➕ Creating and Removing Elements</h3>
            <ul>
              <li><code>createElement()</code> - Create new elements</li>
              <li><code>appendChild()</code> - Add child elements</li>
              <li><code>removeChild()</code> - Remove child elements</li>
              <li><code>remove()</code> - Remove element</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        .highlight { background-color: yellow; padding: 5px; }
        .red-text { color: red; }
        .blue-box { background-color: lightblue; padding: 10px; margin: 5px; }
    </style>
</head>
<body>
    <h1 id="main-title">DOM Manipulation Demo</h1>
    
    <div class="container">
        <p id="demo-text">This text will be changed.</p>
        <p class="sample-text">Sample paragraph 1</p>
        <p class="sample-text">Sample paragraph 2</p>
    </div>
    
    <div id="dynamic-content"></div>
    
    <button onclick="changeById()">Change by ID</button>
    <button onclick="changeByClass()">Change by Class</button>
    <button onclick="changeStyles()">Change Styles</button>
    <button onclick="addElement()">Add Element</button>
    <button onclick="removeElement()">Remove Element</button>
    
    <script>
        function changeById() {
            // Select element by ID and change content
            const element = document.getElementById('demo-text');
            element.innerHTML = '<strong>Text changed by ID selection!</strong>';
        }
        
        function changeByClass() {
            // Select elements by class name
            const elements = document.getElementsByClassName('sample-text');
            for (let i = 0; i < elements.length; i++) {
                elements[i].textContent = 'Changed by class selection ' + (i + 1);
                elements[i].className += ' highlight';
            }
        }
        
        function changeStyles() {
            // Change styles using JavaScript
            const title = document.getElementById('main-title');
            title.style.color = 'blue';
            title.style.fontSize = '36px';
            title.style.textAlign = 'center';
            
            // Using querySelector
            const container = document.querySelector('.container');
            container.style.border = '2px solid green';
            container.style.padding = '20px';
        }
        
        let elementCounter = 1;
        
        function addElement() {
            // Create new element
            const newDiv = document.createElement('div');
            newDiv.className = 'blue-box';
            newDiv.innerHTML = 'Dynamic element ' + elementCounter;
            newDiv.id = 'dynamic-' + elementCounter;
            
            // Add to container
            document.getElementById('dynamic-content').appendChild(newDiv);
            elementCounter++;
        }
        
        function removeElement() {
            // Remove the last added element
            if (elementCounter > 1) {
                const elementToRemove = document.getElementById('dynamic-' + (elementCounter - 1));
                if (elementToRemove) {
                    elementToRemove.remove();
                    elementCounter--;
                }
            }
        }
    </script>
</body>
</html>`,
          exercises: [
            {
              id: 'ex19',
              question: 'Create a dynamic list manager using DOM manipulation',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>My Todo List</h1>\n    <input type="text" id="taskInput" placeholder="Enter a task">\n    <button onclick="addTask()">Add Task</button>\n    \n    <ul id="taskList"></ul>\n    \n    <script>\n        function addTask() {\n            // Get input value\n            // Create new list item\n            // Add to the list\n            // Clear input\n        }\n        \n        function removeTask(button) {\n            // Remove the task when delete button is clicked\n        }\n    </script>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>My Todo List</h1>\n    <input type="text" id="taskInput" placeholder="Enter a task">\n    <button onclick="addTask()">Add Task</button>\n    \n    <ul id="taskList"></ul>\n    \n    <script>\n        function addTask() {\n            const input = document.getElementById("taskInput");\n            const taskText = input.value.trim();\n            \n            if (taskText !== "") {\n                const li = document.createElement("li");\n                li.innerHTML = taskText + " <button onclick=\"removeTask(this)\">Delete</button>";\n                \n                document.getElementById("taskList").appendChild(li);\n                input.value = "";\n            }\n        }\n        \n        function removeTask(button) {\n            button.parentElement.remove();\n        }\n    </script>\n</body>\n</html>',
              hint: 'Use getElementById() to get input, createElement() to make list items, and appendChild() to add them'
            }
          ]
        },
        {
          id: 'js-events',
          title: 'JavaScript Events',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>⚡ JavaScript Events</h2>
            <p>Events are actions that happen in the browser, such as clicking a button, typing in a text field, or loading a page. JavaScript can respond to these events.</p>
            
            <h3>🎯 Common Events</h3>
            <ul>
              <li><strong>click:</strong> Mouse click on element</li>
              <li><strong>mouseover/mouseout:</strong> Mouse enters/leaves element</li>
              <li><strong>keydown/keyup:</strong> Key pressed/released</li>
              <li><strong>load:</strong> Page or image finished loading</li>
              <li><strong>submit:</strong> Form submitted</li>
              <li><strong>change:</strong> Input value changed</li>
              <li><strong>focus/blur:</strong> Element gains/loses focus</li>
            </ul>
            
            <h3>🔧 Adding Event Listeners</h3>
            <ul>
              <li><strong>HTML attributes:</strong> onclick="function()"</li>
              <li><strong>DOM properties:</strong> element.onclick = function</li>
              <li><strong>addEventListener():</strong> element.addEventListener('click', function)</li>
            </ul>
            
            <h3>📝 Event Object</h3>
            <p>Event handlers receive an event object with information about the event:</p>
            <ul>
              <li><code>event.target</code> - Element that triggered the event</li>
              <li><code>event.type</code> - Type of event</li>
              <li><code>event.preventDefault()</code> - Prevent default behavior</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        .box {
            width: 100px;
            height: 100px;
            background-color: lightblue;
            margin: 10px;
            display: inline-block;
            text-align: center;
            line-height: 100px;
            cursor: pointer;
        }
        .active { background-color: orange; }
        #output { margin: 20px 0; padding: 10px; background-color: #f0f0f0; }
    </style>
</head>
<body>
    <h1>JavaScript Events Demo</h1>
    
    <div id="output">Event information will appear here...</div>
    
    <!-- Different ways to handle events -->
    <button onclick="showAlert()">Inline Event</button>
    
    <button id="dom-button">DOM Property Event</button>
    
    <button id="listener-button">Event Listener</button>
    
    <br><br>
    
    <!-- Interactive elements -->
    <div class="box" onmouseover="handleMouseOver(this)" onmouseout="handleMouseOut(this)">Hover Me</div>
    <div class="box" onclick="toggleActive(this)">Click Me</div>
    
    <br>
    
    <input type="text" id="text-input" placeholder="Type something...">
    <br><br>
    
    <form id="demo-form">
        <input type="text" placeholder="Enter name" required>
        <button type="submit">Submit</button>
    </form>
    
    <script>
        // Inline event handler
        function showAlert() {
            alert('Inline event triggered!');
            updateOutput('Inline event: Button clicked');
        }
        
        // DOM property event
        document.getElementById('dom-button').onclick = function() {
            updateOutput('DOM property event: Button clicked');
        };
        
        // Event listener (recommended method)
        document.getElementById('listener-button').addEventListener('click', function(event) {
            updateOutput('Event listener: Button clicked at ' + new Date().toLocaleTimeString());
            console.log('Event object:', event);
        });
        
        // Mouse events
        function handleMouseOver(element) {
            element.style.backgroundColor = 'yellow';
            updateOutput('Mouse over: Element hovered');
        }
        
        function handleMouseOut(element) {
            element.style.backgroundColor = 'lightblue';
            updateOutput('Mouse out: Element left');
        }
        
        // Click event with toggle
        function toggleActive(element) {
            element.classList.toggle('active');
            const isActive = element.classList.contains('active');
            updateOutput('Click event: Element is now ' + (isActive ? 'active' : 'inactive'));
        }
        
        // Keyboard events
        document.getElementById('text-input').addEventListener('keyup', function(event) {
            updateOutput('Key event: Typed "' + event.target.value + '" (Key: ' + event.key + ')');
        });
        
        // Form submit event
        document.getElementById('demo-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form from actually submitting
            updateOutput('Form event: Form submitted (prevented default behavior)');
        });
        
        // Page load event
        window.addEventListener('load', function() {
            updateOutput('Page event: Page fully loaded');
        });
        
        function updateOutput(message) {
            document.getElementById('output').innerHTML = message;
        }
    </script>
</body>
</html>`,
          exercises: [
            {
              id: 'ex20',
              question: 'Create an interactive color picker using events',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        .color-box {\n            width: 50px;\n            height: 50px;\n            display: inline-block;\n            margin: 5px;\n            cursor: pointer;\n            border: 2px solid black;\n        }\n        #display-box {\n            width: 200px;\n            height: 100px;\n            border: 2px solid black;\n            margin: 20px 0;\n        }\n    </style>\n</head>\n<body>\n    <h1>Color Picker</h1>\n    \n    <div class="color-box" style="background-color: red;"></div>\n    <div class="color-box" style="background-color: blue;"></div>\n    <div class="color-box" style="background-color: green;"></div>\n    <div class="color-box" style="background-color: yellow;"></div>\n    \n    <div id="display-box"></div>\n    <p id="color-info">Click a color above</p>\n    \n    <script>\n        // Add event listeners to color boxes\n        // When clicked, change the display box color\n        // Update the color info text\n    </script>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        .color-box {\n            width: 50px;\n            height: 50px;\n            display: inline-block;\n            margin: 5px;\n            cursor: pointer;\n            border: 2px solid black;\n        }\n        #display-box {\n            width: 200px;\n            height: 100px;\n            border: 2px solid black;\n            margin: 20px 0;\n        }\n    </style>\n</head>\n<body>\n    <h1>Color Picker</h1>\n    \n    <div class="color-box" style="background-color: red;"></div>\n    <div class="color-box" style="background-color: blue;"></div>\n    <div class="color-box" style="background-color: green;"></div>\n    <div class="color-box" style="background-color: yellow;"></div>\n    \n    <div id="display-box"></div>\n    <p id="color-info">Click a color above</p>\n    \n    <script>\n        const colorBoxes = document.getElementsByClassName("color-box");\n        \n        for (let i = 0; i < colorBoxes.length; i++) {\n            colorBoxes[i].addEventListener("click", function() {\n                const color = this.style.backgroundColor;\n                document.getElementById("display-box").style.backgroundColor = color;\n                document.getElementById("color-info").innerHTML = "Selected color: " + color;\n            });\n        }\n    </script>\n</body>\n</html>',
              hint: 'Use getElementsByClassName() and addEventListener() to handle clicks on color boxes'
            }
          ]
        },
        {
          id: 'js-conditionals',
          title: 'Conditionals and Loops',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <video controls style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <source src="/video-explanations/topics/javascript-basics/try2.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Watch this video explanation before diving into the concepts below.</p>
            </div>
            
            <h2>🔀 Conditional Statements</h2>
            <p>Conditionals allow your program to make decisions and execute different code based on conditions.</p>
            
            <h3>🎯 If Statements</h3>
            <ul>
              <li><strong>if:</strong> Execute code if condition is true</li>
              <li><strong>else if:</strong> Check additional conditions</li>
              <li><strong>else:</strong> Execute code if all conditions are false</li>
              <li><strong>switch:</strong> Multiple condition checking</li>
            </ul>
            
            <h3>🔄 Loops</h3>
            <ul>
              <li><strong>for:</strong> Repeat code a specific number of times</li>
              <li><strong>while:</strong> Repeat while condition is true</li>
              <li><strong>do...while:</strong> Execute at least once, then repeat while condition is true</li>
              <li><strong>for...of:</strong> Loop through array elements</li>
            </ul>
            
            <h3>⚖️ Comparison Operators</h3>
            <ul>
              <li><code>==</code> - Equal (loose comparison)</li>
              <li><code>===</code> - Strict equal (recommended)</li>
              <li><code>!=</code> - Not equal</li>
              <li><code>!==</code> - Strict not equal</li>
              <li><code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code> - Comparison</li>
            </ul>
            
            <h3>🔗 Logical Operators</h3>
            <ul>
              <li><code>&&</code> - AND (both conditions must be true)</li>
              <li><code>||</code> - OR (at least one condition must be true)</li>
              <li><code>!</code> - NOT (reverses the condition)</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<body>
    <h1>Conditionals and Loops Demo</h1>
    
    <div>
        <h3>Age Checker</h3>
        <input type="number" id="age-input" placeholder="Enter your age">
        <button onclick="checkAge()">Check Age</button>
        <div id="age-result"></div>
    </div>
    
    <div>
        <h3>Grade Calculator</h3>
        <input type="number" id="score-input" placeholder="Enter score (0-100)">
        <button onclick="calculateGrade()">Calculate Grade</button>
        <div id="grade-result"></div>
    </div>
    
    <div>
        <h3>Loop Demonstrations</h3>
        <button onclick="showForLoop()">For Loop</button>
        <button onclick="showWhileLoop()">While Loop</button>
        <button onclick="showArrayLoop()">Array Loop</button>
        <div id="loop-result"></div>
    </div>
    
    <script>
        function checkAge() {
            const age = parseInt(document.getElementById('age-input').value);
            let message;
            
            if (age < 0) {
                message = "Please enter a valid age.";
            } else if (age < 13) {
                message = "You are a child.";
            } else if (age < 20) {
                message = "You are a teenager.";
            } else if (age < 65) {
                message = "You are an adult.";
            } else {
                message = "You are a senior.";
            }
            
            document.getElementById('age-result').innerHTML = message;
        }
        
        function calculateGrade() {
            const score = parseInt(document.getElementById('score-input').value);
            let grade;
            
            // Using switch statement
            switch (true) {
                case (score >= 90):
                    grade = "A";
                    break;
                case (score >= 80):
                    grade = "B";
                    break;
                case (score >= 70):
                    grade = "C";
                    break;
                case (score >= 60):
                    grade = "D";
                    break;
                default:
                    grade = "F";
            }
            
            let message = "Score: " + score + ", Grade: " + grade;
            
            // Additional feedback using logical operators
            if (score >= 90 && score <= 100) {
                message += " - Excellent work!";
            } else if (score >= 70 || score === 69) {
                message += " - Good job!";
            } else if (score < 60 && score >= 0) {
                message += " - Need improvement.";
            }
            
            document.getElementById('grade-result').innerHTML = message;
        }
        
        function showForLoop() {
            let result = "For Loop (1 to 10):<br>";
            
            for (let i = 1; i <= 10; i++) {
                result += i + " ";
            }
            
            result += "<br><br>Even numbers (2 to 20):<br>";
            for (let i = 2; i <= 20; i += 2) {
                result += i + " ";
            }
            
            document.getElementById('loop-result').innerHTML = result;
        }
        
        function showWhileLoop() {
            let result = "While Loop (countdown from 10):<br>";
            let count = 10;
            
            while (count > 0) {
                result += count + " ";
                count--;
            }
            
            result += "<br><br>Do-While Loop (at least once):<br>";
            let num = 0;
            do {
                result += "Executed: " + num + "<br>";
                num++;
            } while (num < 3);
            
            document.getElementById('loop-result').innerHTML = result;
        }
        
        function showArrayLoop() {
            const fruits = ["apple", "banana", "orange", "grape", "kiwi"];
            const numbers = [1, 2, 3, 4, 5];
            
            let result = "For...of Loop (fruits):<br>";
            for (const fruit of fruits) {
                result += fruit + " ";
            }
            
            result += "<br><br>Traditional for loop with array:<br>";
            for (let i = 0; i < numbers.length; i++) {
                result += "Index " + i + ": " + numbers[i] + "<br>";
            }
            
            document.getElementById('loop-result').innerHTML = result;
        }
    </script>
</body>
</html>`,
          exercises: [
            {
              id: 'ex21',
              question: 'Create a number guessing game using conditionals and loops',
              initialCode: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>Number Guessing Game</h1>\n    <p>Guess a number between 1 and 10!</p>\n    \n    <input type="number" id="guess-input" min="1" max="10">\n    <button onclick="checkGuess()">Guess</button>\n    <button onclick="newGame()">New Game</button>\n    \n    <div id="game-result"></div>\n    <div id="attempts"></div>\n    \n    <script>\n        let secretNumber = Math.floor(Math.random() * 10) + 1;\n        let attempts = 0;\n        \n        function checkGuess() {\n            // Get user guess\n            // Increment attempts\n            // Check if guess is correct, too high, or too low\n            // Display appropriate message\n        }\n        \n        function newGame() {\n            // Reset the game\n        }\n    </script>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>Number Guessing Game</h1>\n    <p>Guess a number between 1 and 10!</p>\n    \n    <input type="number" id="guess-input" min="1" max="10">\n    <button onclick="checkGuess()">Guess</button>\n    <button onclick="newGame()">New Game</button>\n    \n    <div id="game-result"></div>\n    <div id="attempts"></div>\n    \n    <script>\n        let secretNumber = Math.floor(Math.random() * 10) + 1;\n        let attempts = 0;\n        \n        function checkGuess() {\n            const guess = parseInt(document.getElementById("guess-input").value);\n            attempts++;\n            \n            let message;\n            if (guess === secretNumber) {\n                message = "Congratulations! You guessed it in " + attempts + " attempts!";\n            } else if (guess < secretNumber) {\n                message = "Too low! Try again.";\n            } else {\n                message = "Too high! Try again.";\n            }\n            \n            document.getElementById("game-result").innerHTML = message;\n            document.getElementById("attempts").innerHTML = "Attempts: " + attempts;\n        }\n        \n        function newGame() {\n            secretNumber = Math.floor(Math.random() * 10) + 1;\n            attempts = 0;\n            document.getElementById("game-result").innerHTML = "";\n            document.getElementById("attempts").innerHTML = "";\n            document.getElementById("guess-input").value = "";\n        }\n    </script>\n</body>\n</html>',
              hint: 'Use if/else statements to compare guess with secretNumber, and increment attempts counter'
            }
          ]
        }
      ]
    },
    {
      id: 'portfolio-project',
      title: 'Portfolio Project',
      lessons: [
        {
          id: 'portfolio-planning',
          title: 'Planning Your Portfolio',
          content: `
            <h2>🎯 Portfolio Project Overview</h2>
            <p>In this final week, you'll create an interactive personal portfolio website that showcases everything you've learned!</p>
            
            <h3>📋 Project Requirements</h3>
            <ul>
              <li><strong>HTML Structure:</strong> Semantic elements, proper headings</li>
              <li><strong>CSS Styling:</strong> Responsive design, attractive layout</li>
              <li><strong>JavaScript Interactivity:</strong> Dynamic content, user interactions</li>
            </ul>
            
            <h3>🏗️ Portfolio Sections</h3>
            <ul>
              <li>Header with navigation</li>
              <li>About me section</li>
              <li>Skills showcase</li>
              <li>Projects gallery</li>
              <li>Contact form</li>
            </ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: #333;
            color: white;
            padding: 1rem 0;
        }
        
        nav ul {
            list-style: none;
            display: flex;
        }
        
        nav li {
            margin-right: 20px;
        }
        
        nav a {
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <main>
        <section id="home" class="container">
            <h1>Welcome to My Portfolio</h1>
            <p>I'm a web developer passionate about creating amazing websites!</p>
        </section>
    </main>
</body>
</html>`,
          exercises: [
            {
              id: 'ex9',
              question: 'Create the basic structure for your portfolio website',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>My Portfolio</title>\n    <style>\n        /* Add your CSS styles here */\n    </style>\n</head>\n<body>\n    <!-- Create header with navigation -->\n    <!-- Add main content sections -->\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>My Portfolio</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 0;\n            padding: 0;\n        }\n        header {\n            background: #2c3e50;\n            color: white;\n            padding: 1rem;\n        }\n        nav ul {\n            list-style: none;\n            display: flex;\n            margin: 0;\n            padding: 0;\n        }\n        nav li {\n            margin-right: 20px;\n        }\n        nav a {\n            color: white;\n            text-decoration: none;\n        }\n        .container {\n            max-width: 1000px;\n            margin: 0 auto;\n            padding: 20px;\n        }\n    </style>\n</head>\n<body>\n    <header>\n        <nav>\n            <ul>\n                <li><a href="#home">Home</a></li>\n                <li><a href="#about">About</a></li>\n                <li><a href="#projects">Projects</a></li>\n                <li><a href="#contact">Contact</a></li>\n            </ul>\n        </nav>\n    </header>\n    \n    <main class="container">\n        <section id="home">\n            <h1>My Portfolio</h1>\n            <p>Welcome to my personal website!</p>\n        </section>\n    </main>\n</body>\n</html>',
              hint: 'Create a header with navigation, use CSS for styling, and add main content sections'
            }
          ]
        },
        {
          id: 'portfolio-interactive',
          title: 'Adding Interactivity',
          content: `
            <h2>⚡ Making Your Portfolio Interactive</h2>
            <p>Let's add JavaScript to make your portfolio come alive with interactive features!</p>
            
            <h3>🎨 Interactive Features to Add</h3>
            <ul>
              <li><strong>Smooth scrolling:</strong> Navigate between sections</li>
              <li><strong>Dynamic content:</strong> Show/hide project details</li>
              <li><strong>Form validation:</strong> Check contact form inputs</li>
              <li><strong>Theme toggle:</strong> Light/dark mode switch</li>
            </ul>
            
            <h3>🚀 Final Touches</h3>
            <p>Polish your portfolio with animations, hover effects, and responsive design!</p>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>Interactive Portfolio</title>
    <style>
        .project {
            border: 1px solid #ddd;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
        }
        
        .project-details {
            display: none;
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
        }
        
        .btn {
            background: #3498db;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn:hover {
            background: #2980b9;
        }
    </style>
</head>
<body>
    <div class="project">
        <h3>My First Website</h3>
        <p>A responsive website built with HTML, CSS, and JavaScript</p>
        <button class="btn" onclick="toggleDetails('project1')">View Details</button>
        <div id="project1" class="project-details">
            <p>This project demonstrates my skills in:</p>
            <ul>
                <li>Semantic HTML structure</li>
                <li>Responsive CSS design</li>
                <li>Interactive JavaScript features</li>
            </ul>
        </div>
    </div>
    
    <script>
        function toggleDetails(projectId) {
            const details = document.getElementById(projectId);
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
        }
    </script>
</body>
</html>`,
          exercises: [
            {
              id: 'ex10',
              question: 'Complete your interactive portfolio with all sections and JavaScript features',
              initialCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Complete Portfolio</title>\n    <style>\n        /* Add all your styles here */\n    </style>\n</head>\n<body>\n    <!-- Complete portfolio structure -->\n    <!-- Add all sections: header, about, projects, contact -->\n    \n    <script>\n        // Add your JavaScript functions here\n    </script>\n</body>\n</html>',
              solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Complete Portfolio</title>\n    <style>\n        * { margin: 0; padding: 0; box-sizing: border-box; }\n        body { font-family: Arial, sans-serif; line-height: 1.6; }\n        header { background: #2c3e50; color: white; padding: 1rem; position: fixed; width: 100%; top: 0; z-index: 1000; }\n        nav ul { list-style: none; display: flex; }\n        nav li { margin-right: 20px; }\n        nav a { color: white; text-decoration: none; }\n        main { margin-top: 80px; }\n        section { padding: 60px 20px; max-width: 1000px; margin: 0 auto; }\n        .project { border: 1px solid #ddd; margin: 20px 0; padding: 20px; border-radius: 8px; }\n        .btn { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }\n        .btn:hover { background: #2980b9; }\n        .hidden { display: none; }\n        @media (max-width: 768px) { nav ul { flex-direction: column; } section { padding: 40px 15px; } }\n    </style>\n</head>\n<body>\n    <header>\n        <nav>\n            <ul>\n                <li><a href="#home" onclick="scrollToSection(\'home\')">Home</a></li>\n                <li><a href="#about" onclick="scrollToSection(\'about\')">About</a></li>\n                <li><a href="#projects" onclick="scrollToSection(\'projects\')">Projects</a></li>\n                <li><a href="#contact" onclick="scrollToSection(\'contact\')">Contact</a></li>\n            </ul>\n        </nav>\n    </header>\n    \n    <main>\n        <section id="home">\n            <h1>Welcome to My Portfolio</h1>\n            <p>I\'m a passionate web developer creating amazing digital experiences!</p>\n        </section>\n        \n        <section id="about">\n            <h2>About Me</h2>\n            <p>I\'ve completed a comprehensive web development course covering HTML, CSS, and JavaScript.</p>\n        </section>\n        \n        <section id="projects">\n            <h2>My Projects</h2>\n            <div class="project">\n                <h3>Interactive Portfolio</h3>\n                <p>A responsive portfolio website with JavaScript interactivity</p>\n                <button class="btn" onclick="toggleProject(\'proj1\')">View Details</button>\n                <div id="proj1" class="hidden">\n                    <p>Technologies: HTML5, CSS3, JavaScript</p>\n                </div>\n            </div>\n        </section>\n        \n        <section id="contact">\n            <h2>Contact Me</h2>\n            <form onsubmit="submitForm(event)">\n                <input type="text" id="name" placeholder="Your Name" required>\n                <input type="email" id="email" placeholder="Your Email" required>\n                <button type="submit" class="btn">Send Message</button>\n            </form>\n        </section>\n    </main>\n    \n    <script>\n        function scrollToSection(sectionId) {\n            document.getElementById(sectionId).scrollIntoView({ behavior: \'smooth\' });\n        }\n        \n        function toggleProject(projectId) {\n            const project = document.getElementById(projectId);\n            project.classList.toggle(\'hidden\');\n        }\n        \n        function submitForm(event) {\n            event.preventDefault();\n            const name = document.getElementById(\'name\').value;\n            const email = document.getElementById(\'email\').value;\n            alert(\'Thank you \' + name + \'! Your message has been sent.\');\n        }\n    </script>\n</body>\n</html>',
              hint: 'Include all sections, add smooth scrolling, project toggles, and form handling'
            }
          ]
        }
      ]
    },
    {
      id: 'python-module',
      title: 'Python Basics',
      description: 'Learn the fundamentals of Python programming',
      lessons: [
        {
          id: 'python-intro',
          title: 'Introduction to Python',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🐍 Welcome to Python Programming</h2>
            <p>Python is a high-level, interpreted programming language known for its simplicity and readability. It's perfect for beginners and widely used in web development, data science, artificial intelligence, and automation.</p>
            
            <h3>Why Learn Python?</h3>
            <ul>
              <li><strong>Easy to Learn:</strong> Simple, readable syntax</li>
              <li><strong>Versatile:</strong> Used in web development, data science, AI, automation</li>
              <li><strong>Large Community:</strong> Extensive libraries and support</li>
              <li><strong>High Demand:</strong> Popular in the job market</li>
            </ul>
            
            <h3>Python Syntax Basics</h3>
            <p>Python uses indentation to define code blocks, making it clean and readable:</p>
            
            <h4>Print Statement</h4>
            <p>The <code>print()</code> function displays output to the console.</p>
            
            <h4>Comments</h4>
            <p>Use <code>#</code> for single-line comments and <code>"""</code> for multi-line comments.</p>
            
            <h4>Variables</h4>
            <p>Python variables don't need explicit declaration - just assign a value!</p>
          `,
          codeExample: `# Welcome to Python!
# This is a comment

# Print statement
print("Hello, World!")
print("Welcome to Python programming!")

# Variables - no need to declare type
name = "Alice"
age = 25
height = 5.6
is_student = True

# Print variables
print("Name:", name)
print("Age:", age)
print("Height:", height, "feet")
print("Is student:", is_student)

# String formatting
print(f"Hi, I'm {name} and I'm {age} years old.")

# Multi-line comment
"""
This is a multi-line comment.
You can write multiple lines here.
Useful for documentation.
"""

# Simple calculation
result = age * 2
print(f"Double the age: {result}")

# Input from user (commented out for demo)
# user_name = input("What's your name? ")
# print(f"Nice to meet you, {user_name}!")

print("\nPython is awesome! 🐍")`,
          exercises: [
            {
              id: 'ex22',
              question: 'Create a simple Python program that introduces yourself',
              initialCode: `# Create a program that introduces yourself
# Use variables for your information

# Your code here:
name = ""
age = 0
city = ""
hobby = ""

# Print introduction using the variables`,
              solution: `# Create a program that introduces yourself
# Use variables for your information

name = "John Doe"
age = 20
city = "New York"
hobby = "programming"

# Print introduction using the variables
print("Hello! Let me introduce myself:")
print(f"My name is {name}")
print(f"I am {age} years old")
print(f"I live in {city}")
print(f"My favorite hobby is {hobby}")
print("Nice to meet you!")

# Alternative way
print("\n--- Alternative Introduction ---")
print("Name:", name)
print("Age:", age)
print("City:", city)
print("Hobby:", hobby)`,
              hint: 'Use variables to store your information and f-strings or comma-separated values in print() to display them'
            }
          ]
        },
        {
          id: 'python-data-types',
          title: 'Python Data Types and Operations',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>📊 Python Data Types</h2>
            <p>Python has several built-in data types that help you store and manipulate different kinds of information.</p>
            
            <h3>Basic Data Types</h3>
            <ul>
              <li><strong>String (str):</strong> Text data - "Hello", 'Python'</li>
              <li><strong>Integer (int):</strong> Whole numbers - 42, -10, 0</li>
              <li><strong>Float:</strong> Decimal numbers - 3.14, -2.5, 0.0</li>
              <li><strong>Boolean (bool):</strong> True or False</li>
            </ul>
            
            <h3>Collection Data Types</h3>
            <ul>
              <li><strong>List:</strong> Ordered, changeable collection - [1, 2, 3]</li>
              <li><strong>Tuple:</strong> Ordered, unchangeable collection - (1, 2, 3)</li>
              <li><strong>Dictionary:</strong> Key-value pairs - {"name": "Alice", "age": 25}</li>
            </ul>
            
            <h3>Type Checking</h3>
            <p>Use <code>type()</code> function to check the data type of a variable.</p>
            
            <h3>Type Conversion</h3>
            <p>Convert between different data types using <code>int()</code>, <code>float()</code>, <code>str()</code>, etc.</p>
            
            <h3>String Operations</h3>
            <p>Python provides many useful string methods like <code>.upper()</code>, <code>.lower()</code>, <code>.split()</code>, etc.</p>
          `,
          codeExample: `# Python Data Types Examples

# Basic Data Types
name = "Python"  # String
age = 30         # Integer
pi = 3.14159     # Float
is_fun = True    # Boolean

print("=== Basic Data Types ===")
print(f"Name: {name} (type: {type(name)})")
print(f"Age: {age} (type: {type(age)})")
print(f"Pi: {pi} (type: {type(pi)})")
print(f"Is fun: {is_fun} (type: {type(is_fun)})")

# Collection Data Types
fruits = ["apple", "banana", "orange"]  # List
coordinates = (10, 20)                   # Tuple
person = {"name": "Alice", "age": 25}    # Dictionary

print("\n=== Collection Data Types ===")
print(f"Fruits: {fruits} (type: {type(fruits)})")
print(f"Coordinates: {coordinates} (type: {type(coordinates)})")
print(f"Person: {person} (type: {type(person)})")

# Type Conversion
num_str = "42"
num_int = int(num_str)  # Convert string to integer
num_float = float(num_str)  # Convert string to float

print("\n=== Type Conversion ===")
print(f"Original: '{num_str}' (type: {type(num_str)})")
print(f"As integer: {num_int} (type: {type(num_int)})")
print(f"As float: {num_float} (type: {type(num_float)})")

# String Operations
text = "Hello, Python World!"
print("\n=== String Operations ===")
print(f"Original: {text}")
print(f"Uppercase: {text.upper()}")
print(f"Lowercase: {text.lower()}")
print(f"Length: {len(text)}")
print(f"Split by comma: {text.split(', ')}")
print(f"Replace 'Python' with 'Amazing': {text.replace('Python', 'Amazing')}")

# List Operations
print("\n=== List Operations ===")
print(f"Original fruits: {fruits}")
fruits.append("grape")  # Add item
print(f"After adding grape: {fruits}")
print(f"First fruit: {fruits[0]}")
print(f"Last fruit: {fruits[-1]}")
print(f"Number of fruits: {len(fruits)}")

# Dictionary Operations
print("\n=== Dictionary Operations ===")
print(f"Person's name: {person['name']}")
print(f"Person's age: {person['age']}")
person['city'] = 'New York'  # Add new key-value pair
print(f"Updated person: {person}")
print(f"Dictionary keys: {list(person.keys())}")
print(f"Dictionary values: {list(person.values())}")`,
          exercises: [
            {
              id: 'ex23',
              question: 'Create a student information system using different data types',
              initialCode: `# Student Information System
# Create variables for student data using appropriate data types

# Student basic info (use appropriate data types)
student_name = ""
student_id = 0
gpa = 0.0
is_enrolled = True

# Student subjects (use a list)
subjects = []

# Student details (use a dictionary)
student_info = {}

# Your task:
# 1. Fill in the student information
# 2. Add at least 3 subjects to the list
# 3. Create a dictionary with student details
# 4. Print all information in a formatted way
# 5. Demonstrate type conversion (convert GPA to string)

print("=== Student Information System ===")
# Add your code here`,
              solution: `# Student Information System
# Create variables for student data using appropriate data types

# Student basic info (use appropriate data types)
student_name = "Emma Johnson"
student_id = 12345
gpa = 3.85
is_enrolled = True

# Student subjects (use a list)
subjects = ["Mathematics", "Computer Science", "Physics", "English"]

# Student details (use a dictionary)
student_info = {
    "name": student_name,
    "id": student_id,
    "gpa": gpa,
    "enrolled": is_enrolled,
    "year": "Junior",
    "major": "Computer Science"
}

print("=== Student Information System ===")
print(f"Student Name: {student_name} (Type: {type(student_name)})")
print(f"Student ID: {student_id} (Type: {type(student_id)})")
print(f"GPA: {gpa} (Type: {type(gpa)})")
print(f"Enrolled: {is_enrolled} (Type: {type(is_enrolled)})")

print(f"\nSubjects ({len(subjects)} total):")
for i, subject in enumerate(subjects, 1):
    print(f"  {i}. {subject}")

print("\nComplete Student Information:")
for key, value in student_info.items():
    print(f"  {key.capitalize()}: {value}")

# Type conversion demonstration
gpa_as_string = str(gpa)
print(f"\nGPA as string: '{gpa_as_string}' (Type: {type(gpa_as_string)})")

# Additional operations
print(f"\nStudent's first subject: {subjects[0]}")
print(f"Is 'Mathematics' in subjects? {('Mathematics' in subjects)}")
print(f"Student info keys: {list(student_info.keys())}")

# Add a new subject
subjects.append("Chemistry")
print(f"\nAfter adding Chemistry: {subjects}")`,
              hint: 'Use strings for names, integers for IDs, floats for GPA, booleans for enrollment status, lists for subjects, and dictionaries for complete information'
            }
          ]
        },
        {
          id: 'python-control-flow',
          title: 'Python Control Flow (If Statements and Loops)',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🔄 Python Control Flow</h2>
            <p>Control flow statements allow you to control the execution of your program based on conditions and repetition.</p>
            
            <h3>If Statements</h3>
            <p>Use <code>if</code>, <code>elif</code>, and <code>else</code> to make decisions in your code:</p>
            <ul>
              <li><strong>if:</strong> Execute code if condition is True</li>
              <li><strong>elif:</strong> Check additional conditions</li>
              <li><strong>else:</strong> Execute code if all conditions are False</li>
            </ul>
            
            <h3>Comparison Operators</h3>
            <ul>
              <li><code>==</code> Equal to</li>
              <li><code>!=</code> Not equal to</li>
              <li><code>&lt;</code> Less than</li>
              <li><code>&gt;</code> Greater than</li>
              <li><code>&lt;=</code> Less than or equal to</li>
              <li><code>&gt;=</code> Greater than or equal to</li>
            </ul>
            
            <h3>Logical Operators</h3>
            <ul>
              <li><code>and</code> Both conditions must be True</li>
              <li><code>or</code> At least one condition must be True</li>
              <li><code>not</code> Reverses the condition</li>
            </ul>
            
            <h3>Loops</h3>
            <p><strong>For Loop:</strong> Iterate over a sequence (list, string, range)</p>
            <p><strong>While Loop:</strong> Repeat while a condition is True</p>
            
            <h3>Range Function</h3>
            <p><code>range(start, stop, step)</code> generates a sequence of numbers.</p>
          `,
          codeExample: `# Python Control Flow Examples

# If Statements
print("=== If Statements ===")
age = 18
name = "Alice"

if age >= 18:
    print(f"{name} is an adult")
else:
    print(f"{name} is a minor")

# Multiple conditions with elif
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Score: {score}, Grade: {grade}")

# Logical operators
temperature = 75
is_sunny = True

if temperature > 70 and is_sunny:
    print("Perfect weather for a picnic!")
elif temperature > 70 or is_sunny:
    print("Good weather, but could be better")
else:
    print("Not great weather today")

# Checking membership
fruits = ["apple", "banana", "orange"]
fruit_to_check = "banana"

if fruit_to_check in fruits:
    print(f"{fruit_to_check} is in the fruit list")
else:
    print(f"{fruit_to_check} is not in the fruit list")

print("\n=== For Loops ===")

# For loop with list
colors = ["red", "green", "blue", "yellow"]
print("Colors:")
for color in colors:
    print(f"  - {color}")

# For loop with range
print("\nNumbers 1 to 5:")
for i in range(1, 6):
    print(f"Number: {i}")

# For loop with string
word = "Python"
print(f"\nLetters in '{word}':")
for letter in word:
    print(f"  {letter}")

# For loop with enumerate (get index and value)
print("\nFruits with index:")
for index, fruit in enumerate(fruits):
    print(f"  {index}: {fruit}")

print("\n=== While Loops ===")

# While loop
count = 1
print("Counting to 5:")
while count <= 5:
    print(f"  Count: {count}")
    count += 1  # Same as count = count + 1

# While loop with user input simulation
numbers = [3, 7, 2, 9, 1]
total = 0
i = 0

print(f"\nAdding numbers: {numbers}")
while i < len(numbers):
    total += numbers[i]
    print(f"  Added {numbers[i]}, total now: {total}")
    i += 1

print(f"Final total: {total}")

print("\n=== Nested Loops ===")

# Nested loops - multiplication table
print("3x3 Multiplication Table:")
for i in range(1, 4):
    for j in range(1, 4):
        result = i * j
        print(f"{i} x {j} = {result:2d}", end="  ")
    print()  # New line after each row

print("\n=== Loop Control ===")

# Break and continue
print("Numbers 1-10, but skip 5 and stop at 8:")
for num in range(1, 11):
    if num == 5:
        continue  # Skip this iteration
    if num == 8:
        break     # Exit the loop
    print(f"  {num}")

print("\n=== Practical Example ===")

# Grade calculator
students = [
    {"name": "Alice", "score": 92},
    {"name": "Bob", "score": 78},
    {"name": "Charlie", "score": 85},
    {"name": "Diana", "score": 96}
]

print("Student Grades:")
for student in students:
    name = student["name"]
    score = student["score"]
    
    if score >= 90:
        grade = "A"
        status = "Excellent!"
    elif score >= 80:
        grade = "B"
        status = "Good job!"
    elif score >= 70:
        grade = "C"
        status = "Keep trying!"
    else:
        grade = "D"
        status = "Need improvement"
    
    print(f"  {name}: {score}% - Grade {grade} ({status})")

# Find highest score
highest_score = 0
top_student = ""

for student in students:
    if student["score"] > highest_score:
        highest_score = student["score"]
        top_student = student["name"]

print(f"\nTop student: {top_student} with {highest_score}%")`,
          exercises: [
            {
              id: 'ex24',
              question: 'Create a number guessing game using Python control flow',
              initialCode: `# Number Guessing Game
# The computer picks a random number between 1-10
# User has 3 attempts to guess it

import random

# Generate random number
secret_number = random.randint(1, 10)
max_attempts = 3
attempts = 0

print("=== Number Guessing Game ===")
print("I'm thinking of a number between 1 and 10")
print(f"You have {max_attempts} attempts to guess it!")

# Your task: Create the game logic
# 1. Use a while loop for the game
# 2. Get user input (simulate with a list of guesses for demo)
# 3. Use if statements to check if guess is correct, too high, or too low
# 4. Keep track of attempts
# 5. End game when correct or out of attempts

# Simulated user guesses for demo (replace with input() for real game)
user_guesses = [5, 8, 7]  # Example guesses

# Add your game logic here
print(f"\n(Secret number is {secret_number} - for demo purposes)")

# Your code here:`,
              solution: `# Number Guessing Game
# The computer picks a random number between 1-10
# User has 3 attempts to guess it

import random

# Generate random number
secret_number = random.randint(1, 10)
max_attempts = 3
attempts = 0
game_won = False

print("=== Number Guessing Game ===")
print("I'm thinking of a number between 1 and 10")
print(f"You have {max_attempts} attempts to guess it!")

# Simulated user guesses for demo (replace with input() for real game)
user_guesses = [5, 8, 7]  # Example guesses

print(f"\n(Secret number is {secret_number} - for demo purposes)")

# Game logic
while attempts < max_attempts and not game_won:
    attempts += 1
    
    # In a real game, use: guess = int(input(f"Attempt {attempts}: Enter your guess: "))
    # For demo, we'll use predefined guesses
    if attempts <= len(user_guesses):
        guess = user_guesses[attempts - 1]
        print(f"Attempt {attempts}: Your guess is {guess}")
    else:
        guess = random.randint(1, 10)  # Random guess if we run out
        print(f"Attempt {attempts}: Random guess: {guess}")
    
    # Check the guess
    if guess == secret_number:
        print(f"🎉 Congratulations! You guessed it in {attempts} attempts!")
        game_won = True
    elif guess < secret_number:
        print("📈 Too low! Try a higher number.")
    else:
        print("📉 Too high! Try a lower number.")
    
    # Show remaining attempts
    if not game_won and attempts < max_attempts:
        remaining = max_attempts - attempts
        print(f"You have {remaining} attempt(s) left.\n")

# Game over message
if not game_won:
    print(f"\n😞 Game Over! The number was {secret_number}")
    print("Better luck next time!")
else:
    print("\n🏆 You're a great guesser!")

# Game statistics
print(f"\n=== Game Statistics ===")
print(f"Secret number: {secret_number}")
print(f"Total attempts: {attempts}")
print(f"Game won: {'Yes' if game_won else 'No'}")

# Bonus: Show all guesses
print(f"\nYour guesses: {user_guesses[:attempts]}")

# Performance rating
if game_won:
    if attempts == 1:
        rating = "Amazing! First try!"
    elif attempts == 2:
        rating = "Excellent! Very quick!"
    else:
        rating = "Good job! You got it!"
    print(f"Performance: {rating}")

print("\nThanks for playing! 🎮")`,
              hint: 'Use a while loop to continue until max attempts or correct guess. Use if/elif/else to compare guess with secret number. Track attempts and game_won status.'
            }
          ]
        }
      ]
    },
    {
      id: 'frontend-development-intermediate',
      title: 'Frontend Development - Intermediate',
      description: '8-week comprehensive course covering advanced CSS, modern JavaScript, and MongoDB integration',
      lessons: [
        {
          id: 'week1-advanced-css-intro',
          title: 'Week 1: Advanced CSS - Flexbox Fundamentals',
          content: `
<div style="margin-bottom: 20px; text-align: center;">
  <h3>📹 Video Explanation</h3>
  <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
    📹 Video Explanation Coming Soon
  </div>
  <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
</div>

# Advanced CSS - Flexbox Fundamentals

## What is Flexbox?

Flexbox (Flexible Box Layout) is a powerful CSS layout method that provides an efficient way to arrange, distribute, and align items in a container, even when their size is unknown or dynamic.

## Key Concepts

### Flex Container and Flex Items
- **Flex Container**: The parent element with \`display: flex\`
- **Flex Items**: Direct children of the flex container

### Main Axis and Cross Axis
- **Main Axis**: Primary axis along which flex items are laid out
- **Cross Axis**: Perpendicular to the main axis

## Essential Flexbox Properties

### Container Properties
- \`display: flex\` - Creates a flex container
- \`flex-direction\` - Defines the main axis direction
- \`justify-content\` - Aligns items along the main axis
- \`align-items\` - Aligns items along the cross axis
- \`flex-wrap\` - Controls wrapping of flex items

### Item Properties
- \`flex-grow\` - Defines how much an item should grow
- \`flex-shrink\` - Defines how much an item should shrink
- \`flex-basis\` - Defines the initial size before free space is distributed
- \`align-self\` - Overrides the container's align-items for individual items

## Practical Examples

### Centering Content
\`\`\`css
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
\`\`\`

### Navigation Bar
\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
\`\`\`

### Card Layout
\`\`\`css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px; /* grow, shrink, basis */
}
\`\`\`
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        .flex-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 200px;
            background-color: #f0f0f0;
            border: 2px solid #333;
        }
        
        .flex-item {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            margin: 5px;
            text-align: center;
            border-radius: 5px;
        }
        
        .item1 { flex-grow: 1; }
        .item2 { flex-grow: 2; }
        .item3 { flex-grow: 1; }
    </style>
</head>
<body>
    <h2>Flexbox Layout Example</h2>
    <div class="flex-container">
        <div class="flex-item item1">Item 1</div>
        <div class="flex-item item2">Item 2 (grows more)</div>
        <div class="flex-item item3">Item 3</div>
    </div>
</body>
</html>`,
          exercises: [
            {
              id: 'flexbox-navbar',
              title: 'Create a Navigation Bar',
              description: 'Build a responsive navigation bar using flexbox with logo on the left and menu items on the right.',
              startingCode: `<nav class="navbar">
  <div class="logo">MyLogo</div>
  <ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>

<style>
/* Add your flexbox CSS here */
</style>`,
              solution: `<nav class="navbar">
  <div class="logo">MyLogo</div>
  <ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: white;
  text-decoration: none;
}
</style>`
            }
          ]
        },
        {
          id: 'week2-css-grid',
          title: 'Week 2: CSS Grid Layout System',
          content: `
<div style="margin-bottom: 20px; text-align: center;">
  <h3>📹 Video Explanation</h3>
  <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
    📹 Video Explanation Coming Soon
  </div>
  <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
</div>

<h2>🎯 CSS Grid Layout System</h2>

<p>CSS Grid is a powerful 2D layout system that allows you to create complex layouts with rows and columns simultaneously. Unlike Flexbox, which is designed for one-dimensional layouts, CSS Grid excels at handling both horizontal and vertical alignment in a single container.</p>

<h3>📋 Core Concepts</h3>
<p>Understanding these fundamental concepts is essential for mastering CSS Grid:</p>
<ul>
  <li><strong>Grid Container:</strong> The parent element with 'display: grid' applied</li>
  <li><strong>Grid Items:</strong> Direct children of the grid container</li>
  <li><strong>Grid Lines:</strong> The dividing lines that create the grid structure</li>
  <li><strong>Grid Tracks:</strong> The space between two adjacent grid lines (rows or columns)</li>
  <li><strong>Grid Cells:</strong> Individual spaces where content is placed</li>
  <li><strong>Grid Areas:</strong> Rectangular spaces spanning multiple cells</li>
</ul>

<h3>🏗️ Container Properties</h3>
<p>These properties are applied to the grid container to define the overall grid structure:</p>
<ul>
  <li><strong>display: grid</strong> - Establishes the element as a grid container</li>
  <li><strong>grid-template-columns/rows</strong> - Defines the size and number of columns/rows</li>
  <li><strong>gap</strong> - Sets the spacing between grid items</li>
  <li><strong>grid-template-areas</strong> - Creates named sections for easier layout management</li>
</ul>

<h3>📦 Item Properties</h3>
<p>These properties control how individual grid items behave within the grid:</p>
<ul>
  <li><strong>grid-column/row</strong> - Controls how many columns or rows an item spans</li>
  <li><strong>grid-area</strong> - Assigns an item to a specific named area</li>
</ul>

<h3>🔧 Key Units & Functions</h3>
<p>CSS Grid introduces several powerful units and functions for flexible layouts:</p>
<ul>
  <li><strong>fr unit:</strong> Represents fractional space (e.g., 1fr 2fr 1fr = 25% 50% 25%)</li>
  <li><strong>repeat():</strong> Simplifies repetitive patterns (repeat(3, 1fr) = 1fr 1fr 1fr)</li>
  <li><strong>minmax():</strong> Sets minimum and maximum size constraints (minmax(250px, 1fr))</li>
  <li><strong>auto-fit/auto-fill:</strong> Creates responsive columns that adapt to content</li>
</ul>

<h3>🎨 Common Layout Patterns</h3>

<h4>1. Holy Grail Layout</h4>
<p>A classic three-column layout with header and footer:</p>
<pre><code>.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 200px;
}</code></pre>

<h4>2. Responsive Card Grid</h4>
<p>Automatically adjusting card layout that responds to screen size:</p>
<pre><code>.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}</code></pre>

<h3>✨ Key Advantages</h3>
<p>CSS Grid offers numerous benefits over traditional layout methods:</p>
<ul>
  <li><strong>No Hacks Required:</strong> Eliminates the need for float or positioning workarounds</li>
  <li><strong>Responsive by Design:</strong> Built-in tools for creating adaptive layouts</li>
  <li><strong>Clean HTML:</strong> Maintains semantic markup without layout-specific elements</li>
  <li><strong>Excellent Support:</strong> Widely supported across modern browsers</li>
  <li><strong>Perfect for 2D Layouts:</strong> Ideal for complex layouts (use Flexbox for simpler 1D layouts)</li>
</ul>
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        .grid-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: auto 200px auto;
            grid-template-areas:
                "header header header"
                "sidebar main aside"
                "footer footer footer";
            gap: 10px;
            height: 400px;
            background-color: #f0f0f0;
            padding: 10px;
        }
        
        .grid-item {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
        }
        
        .header { grid-area: header; background-color: #2196F3; }
        .sidebar { grid-area: sidebar; background-color: #FF9800; }
        .main { grid-area: main; background-color: #4CAF50; }
        .aside { grid-area: aside; background-color: #9C27B0; }
        .footer { grid-area: footer; background-color: #F44336; }
    </style>
</head>
<body>
    <h2>CSS Grid Layout Example</h2>
    <div class="grid-container">
        <div class="grid-item header">Header</div>
        <div class="grid-item sidebar">Sidebar</div>
        <div class="grid-item main">Main Content</div>
        <div class="grid-item aside">Aside</div>
        <div class="grid-item footer">Footer</div>
    </div>
</body>
</html>`,
          exercises: [
            {
              id: 'grid-dashboard',
              title: 'Create a Dashboard Layout',
              description: 'Build a responsive dashboard layout using CSS Grid with header, sidebar, main content, and footer areas.',
              startingCode: `<div class="dashboard">
  <header class="header">Dashboard Header</header>
  <nav class="sidebar">Navigation</nav>
  <main class="main">Main Content</main>
  <footer class="footer">Footer</footer>
</div>

<style>
/* Add your grid CSS here */
</style>`,
              solution: `<div class="dashboard">
  <header class="header">Dashboard Header</header>
  <nav class="sidebar">Navigation</nav>
  <main class="main">Main Content</main>
  <footer class="footer">Footer</footer>
</div>

<style>
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-rows: 60px 1fr 40px;
  grid-template-columns: 250px 1fr;
  height: 100vh;
  gap: 1px;
}

.header {
  grid-area: header;
  background-color: #2196F3;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

.sidebar {
  grid-area: sidebar;
  background-color: #f5f5f5;
  padding: 1rem;
}

.main {
  grid-area: main;
  background-color: white;
  padding: 2rem;
}

.footer {
  grid-area: footer;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}
</style>`
            }
          ]
        },
        {
          id: 'week3-css-animations',
          title: 'Week 3: CSS Animations and Transitions',
          content: `
<div style="margin-bottom: 20px; text-align: center;">
  <h3>📹 Video Explanation</h3>
  <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
    📹 Video Explanation Coming Soon
  </div>
  <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
</div>

# CSS Animations and Transitions

## CSS Transitions

Transitions allow you to change property values smoothly over a given duration.

### Transition Properties
- \`transition-property\` - Specifies which properties to animate
- \`transition-duration\` - How long the transition takes
- \`transition-timing-function\` - Speed curve of the transition
- \`transition-delay\` - Delay before the transition starts

### Shorthand Syntax
\`\`\`css
.element {
  transition: property duration timing-function delay;
}
\`\`\`

### Common Timing Functions
- \`ease\` - Slow start, fast middle, slow end (default)
- \`linear\` - Same speed from start to end
- \`ease-in\` - Slow start
- \`ease-out\` - Slow end
- \`ease-in-out\` - Slow start and end
- \`cubic-bezier(n,n,n,n)\` - Custom timing function

## CSS Animations

Animations allow you to create more complex animations with keyframes.

### @keyframes Rule
Defines the animation sequence:

\`\`\`css
@keyframes animationName {
  0% { /* starting styles */ }
  50% { /* middle styles */ }
  100% { /* ending styles */ }
}
\`\`\`

### Animation Properties
- \`animation-name\` - Name of the @keyframes animation
- \`animation-duration\` - How long the animation takes
- \`animation-timing-function\` - Speed curve
- \`animation-delay\` - Delay before starting
- \`animation-iteration-count\` - How many times to repeat
- \`animation-direction\` - Direction of the animation
- \`animation-fill-mode\` - Styles applied before/after animation
- \`animation-play-state\` - Whether animation is running or paused

### Animation Shorthand
\`\`\`css
.element {
  animation: name duration timing-function delay iteration-count direction fill-mode;
}
\`\`\`

## Transform Property

The \`transform\` property allows you to rotate, scale, skew, or translate elements.

### Transform Functions
- \`translate(x, y)\` - Move element
- \`rotate(angle)\` - Rotate element
- \`scale(x, y)\` - Scale element size
- \`skew(x-angle, y-angle)\` - Skew element

### 3D Transforms
- \`translate3d(x, y, z)\`
- \`rotate3d(x, y, z, angle)\`
- \`scale3d(x, y, z)\`

## Performance Tips

1. **Use transform and opacity** for animations when possible
2. **Avoid animating layout properties** (width, height, margin, padding)
3. **Use will-change property** to optimize animations
4. **Use transform3d()** to enable hardware acceleration

## Common Animation Patterns

### Hover Effects
\`\`\`css
.button {
  transition: transform 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
}
\`\`\`

### Loading Spinner
\`\`\`css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
\`\`\`

### Fade In Animation
\`\`\`css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}
\`\`\`
          `,
          codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        .animation-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 300px;
            background-color: #f0f0f0;
            padding: 20px;
        }
        
        .box {
            width: 80px;
            height: 80px;
            background-color: #4CAF50;
            border-radius: 10px;
            cursor: pointer;
        }
        
        /* Hover transition */
        .hover-box {
            transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        .hover-box:hover {
            transform: translateY(-10px) scale(1.1);
            background-color: #45a049;
        }
        
        /* Rotation animation */
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .rotate-box {
            animation: rotate 2s linear infinite;
            background-color: #2196F3;
        }
        
        /* Pulse animation */
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .pulse-box {
            animation: pulse 1.5s ease-in-out infinite;
            background-color: #FF9800;
        }
        
        .label {
            text-align: center;
            margin-top: 10px;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <h2>CSS Animations and Transitions</h2>
    <div class="animation-container">
        <div>
            <div class="box hover-box"></div>
            <div class="label">Hover Me</div>
        </div>
        <div>
            <div class="box rotate-box"></div>
            <div class="label">Rotating</div>
        </div>
        <div>
            <div class="box pulse-box"></div>
            <div class="label">Pulsing</div>
        </div>
    </div>
</body>
</html>`,
          exercises: [
            {
              id: 'button-animations',
              title: 'Create Animated Buttons',
              description: 'Design a set of buttons with different hover animations using CSS transitions and transforms.',
              startingCode: `<div class="button-container">
  <button class="btn btn-slide">Slide</button>
  <button class="btn btn-bounce">Bounce</button>
  <button class="btn btn-glow">Glow</button>
</div>

<style>
.btn {
  padding: 12px 24px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

/* Add your animation CSS here */
</style>`,
              solution: `<div class="button-container">
  <button class="btn btn-slide">Slide</button>
  <button class="btn btn-bounce">Bounce</button>
  <button class="btn btn-glow">Glow</button>
</div>

<style>
.btn {
  padding: 12px 24px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-slide {
  background-color: #4CAF50;
  color: white;
  position: relative;
  overflow: hidden;
}

.btn-slide:hover {
  transform: translateX(5px);
}

.btn-bounce {
  background-color: #2196F3;
  color: white;
}

.btn-bounce:hover {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.btn-glow {
  background-color: #FF9800;
  color: white;
}

.btn-glow:hover {
  box-shadow: 0 0 20px rgba(255, 152, 0, 0.6);
  transform: scale(1.05);
}
</style>`
            }
           ]
         },
         {
           id: 'week4-responsive-design',
           title: 'Week 4: Responsive Web Design',
           content: `
<div style="margin-bottom: 20px; text-align: center;">
  <h3>📹 Video Explanation</h3>
  <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
    📹 Video Explanation Coming Soon
  </div>
  <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
</div>

# Responsive Web Design

## What is Responsive Design?

Responsive web design is an approach that makes web pages render well on a variety of devices and window or screen sizes. It uses flexible layouts, images, and CSS media queries.

## Core Principles

### 1. Fluid Grids
Use relative units like percentages instead of fixed units like pixels.

### 2. Flexible Images
Images should scale nicely within their containing elements.

### 3. Media Queries
Apply different styles based on device characteristics.

## Viewport Meta Tag

Essential for responsive design:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

## CSS Media Queries

Media queries allow you to apply CSS rules based on device characteristics.

### Basic Syntax
\`\`\`css
@media screen and (max-width: 768px) {
  /* Styles for screens smaller than 768px */
}
\`\`\`

### Common Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px and above

### Media Query Features
- \`width\` and \`height\`
- \`min-width\` and \`max-width\`
- \`orientation\` (portrait/landscape)
- \`resolution\`
- \`aspect-ratio\`

## Mobile-First Approach

Start with mobile styles and progressively enhance for larger screens:

\`\`\`css
/* Mobile styles (default) */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet styles */
@media screen and (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* Desktop styles */
@media screen and (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}
\`\`\`

## Responsive Units

### Relative Units
- \`%\` - Percentage of parent element
- \`em\` - Relative to font-size of element
- \`rem\` - Relative to font-size of root element
- \`vw\` - Viewport width (1vw = 1% of viewport width)
- \`vh\` - Viewport height (1vh = 1% of viewport height)
- \`vmin\` - Smaller of vw or vh
- \`vmax\` - Larger of vw or vh

## Responsive Images

### CSS Approach
\`\`\`css
img {
  max-width: 100%;
  height: auto;
}
\`\`\`

### HTML Picture Element
\`\`\`html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image">
</picture>
\`\`\`

## Container Queries (Modern)

Container queries allow styling based on container size:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
  }
}
\`\`\`

## Best Practices

1. **Start with mobile-first design**
2. **Use flexible layouts (Flexbox/Grid)**
3. **Optimize images for different screen sizes**
4. **Test on real devices**
5. **Consider touch interactions**
6. **Ensure readable font sizes**
7. **Provide adequate touch targets (44px minimum)**
           `,
           codeExample: `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
        }
        
        .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .card {
            background-color: #f0f0f0;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
        }
        
        .card h3 {
            color: #333;
            margin-bottom: 1rem;
        }
        
        /* Tablet styles */
        @media screen and (min-width: 768px) {
            .grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .container {
                padding: 2rem;
            }
        }
        
        /* Desktop styles */
        @media screen and (min-width: 1024px) {
            .grid {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .card {
                padding: 3rem;
            }
        }
        
        /* Large desktop */
        @media screen and (min-width: 1400px) {
            .grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Responsive Grid Layout</h1>
        <div class="grid">
            <div class="card">
                <h3>Card 1</h3>
                <p>This layout adapts to different screen sizes using CSS Grid and media queries.</p>
            </div>
            <div class="card">
                <h3>Card 2</h3>
                <p>Resize your browser window to see the responsive behavior.</p>
            </div>
            <div class="card">
                <h3>Card 3</h3>
                <p>Mobile-first approach ensures optimal experience on all devices.</p>
            </div>
            <div class="card">
                <h3>Card 4</h3>
                <p>Grid columns adjust automatically based on screen size.</p>
            </div>
        </div>
    </div>
</body>
</html>`,
           exercises: [
             {
               id: 'responsive-navbar',
               title: 'Create a Responsive Navigation',
               description: 'Build a navigation bar that collapses to a hamburger menu on mobile devices.',
               startingCode: `<nav class="navbar">
  <div class="nav-brand">Brand</div>
  <div class="nav-toggle">☰</div>
  <ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>

<style>
/* Add your responsive CSS here */
</style>`,
               solution: `<nav class="navbar">
  <div class="nav-brand">Brand</div>
  <div class="nav-toggle">☰</div>
  <ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-toggle {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: white;
  text-decoration: none;
}

/* Mobile styles */
@media screen and (max-width: 768px) {
  .nav-toggle {
    display: block;
  }
  
  .nav-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #333;
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-menu.active {
    display: flex;
  }
}
</style>`
             }
           ]
         },
         {
           id: 'week5-modern-javascript',
           title: 'Week 5: Modern JavaScript (ES6+)',
           content: `
<div style="margin-bottom: 20px; text-align: center;">
  <h3>📹 Video Explanation</h3>
  <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
    📹 Video Explanation Coming Soon
  </div>
  <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
</div>

# Modern JavaScript (ES6+)

## ES6+ Features Overview

ECMAScript 6 (ES2015) and later versions introduced many powerful features that make JavaScript more expressive and easier to work with.

## Let and Const

### Block Scope
\`\`\`javascript
// var is function-scoped
function example() {
  if (true) {
    var x = 1;
    let y = 2;
    const z = 3;
  }
  console.log(x); // 1 (accessible)
  console.log(y); // ReferenceError
  console.log(z); // ReferenceError
}
\`\`\`

### Const Rules
- Must be initialized when declared
- Cannot be reassigned
- Objects and arrays can still be mutated

## Arrow Functions

### Syntax
\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Multiple lines
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
\`\`\`

### Key Differences
- Lexical \`this\` binding
- Cannot be used as constructors
- No \`arguments\` object

## Template Literals

\`\`\`javascript
const name = 'John';
const age = 30;

// Old way
const message = 'Hello, my name is ' + name + ' and I am ' + age + ' years old.';

// Template literals
const message = \`Hello, my name is \${name} and I am \${age} years old.\`;

// Multi-line strings
const html = \`
  <div>
    <h1>\${name}</h1>
    <p>Age: \${age}</p>
  </div>
\`;
\`\`\`

## Destructuring

### Array Destructuring
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]
\`\`\`

### Object Destructuring
\`\`\`javascript
const person = {
  name: 'John',
  age: 30,
  city: 'New York'
};

const { name, age, city } = person;

// With different variable names
const { name: fullName, age: years } = person;
\`\`\`

## Spread and Rest Operators

### Spread Operator (...)
\`\`\`javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }
\`\`\`

### Rest Parameters
\`\`\`javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3, 4); // 10
\`\`\`

## Default Parameters

\`\`\`javascript
function greet(name = 'World', greeting = 'Hello') {
  return \`\${greeting}, \${name}!\`;
}

greet(); // "Hello, World!"
greet('John'); // "Hello, John!"
greet('John', 'Hi'); // "Hi, John!"
\`\`\`

## Enhanced Object Literals

\`\`\`javascript
const name = 'John';
const age = 30;

// Shorthand property names
const person = { name, age };

// Method definitions
const calculator = {
  add(a, b) {
    return a + b;
  },
  
  // Computed property names
  [\`method_\${Math.random()}\`]() {
    return 'dynamic method';
  }
};
\`\`\`

## Classes

\`\`\`javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
  
  static species() {
    return 'Homo sapiens';
  }
}

class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }
  
  study() {
    return \`\${this.name} is studying\`;
  }
}
\`\`\`

## Modules

### Export
\`\`\`javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export default function multiply(a, b) {
  return a * b;
}
\`\`\`

### Import
\`\`\`javascript
// main.js
import multiply, { PI, add } from './math.js';

console.log(PI); // 3.14159
console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
\`\`\`
           `,
           codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f5f5f5;
        }
        
        .container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .user-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            background: #f9f9f9;
        }
        
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin: 0.25rem;
        }
        
        button:hover {
            background: #0056b3;
        }
        
        #output {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 1rem;
            margin-top: 1rem;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Modern JavaScript Features Demo</h1>
        
        <div class="user-card">
            <h3>ES6+ Features</h3>
            <button onclick="demoArrowFunctions()">Arrow Functions</button>
            <button onclick="demoDestructuring()">Destructuring</button>
            <button onclick="demoSpreadOperator()">Spread Operator</button>
            <button onclick="demoTemplateStrings()">Template Literals</button>
            <button onclick="demoClasses()">Classes</button>
        </div>
        
        <div id="output"></div>
    </div>
    
    <script>
        const output = document.getElementById('output');
        
        function log(message) {
            output.textContent += message + '\n';
        }
        
        function clearOutput() {
            output.textContent = '';
        }
        
        function demoArrowFunctions() {
            clearOutput();
            log('=== Arrow Functions Demo ===');
            
            // Traditional function
            function traditionalAdd(a, b) {
                return a + b;
            }
            
            // Arrow function
            const arrowAdd = (a, b) => a + b;
            
            // Array methods with arrows
            const numbers = [1, 2, 3, 4, 5];
            const doubled = numbers.map(n => n * 2);
            const evens = numbers.filter(n => n % 2 === 0);
            
            log(\`Traditional: \${traditionalAdd(5, 3)}\`);
            log(\`Arrow: \${arrowAdd(5, 3)}\`);
            log(\`Doubled: [\${doubled.join(', ')}]\`);
            log(\`Evens: [\${evens.join(', ')}]\`);
        }
        
        function demoDestructuring() {
            clearOutput();
            log('=== Destructuring Demo ===');
            
            // Array destructuring
            const colors = ['red', 'green', 'blue', 'yellow'];
            const [primary, secondary, ...others] = colors;
            
            log(\`Primary: \${primary}\`);
            log(\`Secondary: \${secondary}\`);
            log(\`Others: [\${others.join(', ')}]\`);
            
            // Object destructuring
            const person = {
                name: 'Alice',
                age: 28,
                city: 'Boston',
                country: 'USA'
            };
            
            const { name, age, ...location } = person;
            
            log(\`Name: \${name}\`);
            log(\`Age: \${age}\`);
            log(\`Location: \${JSON.stringify(location)}\`);
        }
        
        function demoSpreadOperator() {
            clearOutput();
            log('=== Spread Operator Demo ===');
            
            // Array spread
            const arr1 = [1, 2, 3];
            const arr2 = [4, 5, 6];
            const combined = [...arr1, ...arr2];
            
            log(\`Array 1: [\${arr1.join(', ')}]\`);
            log(\`Array 2: [\${arr2.join(', ')}]\`);
            log(\`Combined: [\${combined.join(', ')}]\`);
            
            // Object spread
            const defaults = { theme: 'light', language: 'en' };
            const userPrefs = { language: 'es', fontSize: 14 };
            const settings = { ...defaults, ...userPrefs };
            
            log(\`Settings: \${JSON.stringify(settings)}\`);
        }
        
        function demoTemplateStrings() {
            clearOutput();
            log('=== Template Literals Demo ===');
            
            const user = { name: 'Bob', score: 95 };
            const grade = user.score >= 90 ? 'A' : 'B';
            
            // Template literal with expressions
            const message = \`Hello \${user.name}!
Your score is \${user.score}.
Grade: \${grade}
Status: \${user.score >= 90 ? 'Excellent!' : 'Good job!'}\`;
            
            log(message);
        }
        
        function demoClasses() {
            clearOutput();
            log('=== Classes Demo ===');
            
            class Animal {
                constructor(name, species) {
                    this.name = name;
                    this.species = species;
                }
                
                speak() {
                    return \`\${this.name} makes a sound\`;
                }
                
                static getKingdom() {
                    return 'Animalia';
                }
            }
            
            class Dog extends Animal {
                constructor(name, breed) {
                    super(name, 'Canine');
                    this.breed = breed;
                }
                
                speak() {
                    return \`\${this.name} barks!\`;
                }
                
                fetch() {
                    return \`\${this.name} fetches the ball\`;
                }
            }
            
            const dog = new Dog('Rex', 'Golden Retriever');
            
            log(\`Kingdom: \${Animal.getKingdom()}\`);
            log(\`Name: \${dog.name}\`);
            log(\`Species: \${dog.species}\`);
            log(\`Breed: \${dog.breed}\`);
            log(\`Sound: \${dog.speak()}\`);
            log(\`Action: \${dog.fetch()}\`);
        }
    </script>
</body>
</html>`,
           exercises: [
             {
               id: 'es6-refactor',
               title: 'Refactor to ES6+',
               description: 'Convert the given ES5 code to use modern ES6+ features like arrow functions, destructuring, and template literals.',
               startingCode: `// ES5 Code - Refactor this to ES6+
function UserManager() {
  this.users = [];
}

UserManager.prototype.addUser = function(name, email, age) {
  var user = {
    id: this.users.length + 1,
    name: name,
    email: email,
    age: age
  };
  this.users.push(user);
  return user;
};

UserManager.prototype.getUser = function(id) {
  for (var i = 0; i < this.users.length; i++) {
    if (this.users[i].id === id) {
      return this.users[i];
    }
  }
  return null;
};

UserManager.prototype.getUserInfo = function(id) {
  var user = this.getUser(id);
  if (user) {
    return 'User: ' + user.name + ', Email: ' + user.email + ', Age: ' + user.age;
  }
  return 'User not found';
};`,
               solution: `// ES6+ Refactored Code
class UserManager {
  constructor() {
    this.users = [];
  }
  
  addUser(name, email, age) {
    const user = {
      id: this.users.length + 1,
      name,
      email,
      age
    };
    this.users.push(user);
    return user;
  }
  
  getUser(id) {
    return this.users.find(user => user.id === id) || null;
  }
  
  getUserInfo(id) {
    const user = this.getUser(id);
    if (user) {
      const { name, email, age } = user;
      return \`User: \${name}, Email: \${email}, Age: \${age}\`;
    }
    return 'User not found';
  }
  
  // Bonus: Additional ES6+ methods
  getAllUsers() {
    return [...this.users]; // Spread operator for shallow copy
  }
  
  updateUser(id, updates) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      return this.users[userIndex];
    }
    return null;
  }
}`
             }
           ]
         },
         {
           id: 'week6-async-javascript',
           title: 'Week 6: Asynchronous JavaScript & APIs',
           content: `
<div style="margin-bottom: 20px; text-align: center;">
  <h3>📹 Video Explanation</h3>
  <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
    📹 Video Explanation Coming Soon
  </div>
  <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
</div>

# Asynchronous JavaScript & APIs

## Understanding Asynchronous Programming

JavaScript is single-threaded, but it can handle asynchronous operations through the event loop, callbacks, promises, and async/await.

## Callbacks

Callbacks are functions passed as arguments to other functions, executed after some operation completes.

\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: 'John' };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log('Data received:', data);
});
\`\`\`

### Callback Hell
Nested callbacks can become difficult to read and maintain:

\`\`\`javascript
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // This nesting can go on...
    });
  });
});
\`\`\`

## Promises

Promises provide a cleaner way to handle asynchronous operations.

### Creating Promises
\`\`\`javascript
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  
  setTimeout(() => {
    if (success) {
      resolve('Operation successful!');
    } else {
      reject('Operation failed!');
    }
  }, 1000);
});
\`\`\`

### Using Promises
\`\`\`javascript
myPromise
  .then(result => {
    console.log(result); // 'Operation successful!'
    return 'Next step';
  })
  .then(nextResult => {
    console.log(nextResult); // 'Next step'
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log('Promise completed');
  });
\`\`\`

### Promise.all() and Promise.race()
\`\`\`javascript
// Wait for all promises to resolve
Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log('All promises resolved:', results);
  });

// Get the first promise to resolve
Promise.race([promise1, promise2, promise3])
  .then(result => {
    console.log('First promise resolved:', result);
  });
\`\`\`

## Async/Await

Async/await provides a more synchronous-looking way to write asynchronous code.

\`\`\`javascript
async function fetchUserData(id) {
  try {
    const user = await getUser(id);
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    
    return { user, posts, comments };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Usage
fetchUserData(1)
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

## Fetch API

The Fetch API provides a modern way to make HTTP requests.

### Basic GET Request
\`\`\`javascript
fetch('https://api.example.com/users')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Users:', data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
\`\`\`

### POST Request with Data
\`\`\`javascript
const userData = {
  name: 'John Doe',
  email: 'john@example.com'
};

fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => {
  console.log('User created:', data);
});
\`\`\`

### Using Fetch with Async/Await
\`\`\`javascript
async function getUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
\`\`\`

## Error Handling

### Try-Catch with Async/Await
\`\`\`javascript
async function handleAsyncOperation() {
  try {
    const result = await someAsyncOperation();
    console.log('Success:', result);
  } catch (error) {
    if (error.name === 'NetworkError') {
      console.error('Network problem:', error.message);
    } else if (error.name === 'ValidationError') {
      console.error('Data validation failed:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
\`\`\`

## Working with APIs

### RESTful API Patterns
- **GET** /api/users - Get all users
- **GET** /api/users/1 - Get user with ID 1
- **POST** /api/users - Create new user
- **PUT** /api/users/1 - Update user with ID 1
- **DELETE** /api/users/1 - Delete user with ID 1

### API Wrapper Class
\`\`\`javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  async get(endpoint) {
    return this.request(endpoint);
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}
\`\`\`
           `,
           codeExample: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f5f5f5;
        }
        
        .container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .api-demo {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            background: #f9f9f9;
        }
        
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin: 0.25rem;
        }
        
        button:hover {
            background: #0056b3;
        }
        
        button:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }
        
        .loading {
            color: #007bff;
            font-style: italic;
        }
        
        .error {
            color: #dc3545;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 0.5rem;
            border-radius: 4px;
            margin: 0.5rem 0;
        }
        
        .success {
            color: #155724;
            background: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 0.5rem;
            border-radius: 4px;
            margin: 0.5rem 0;
        }
        
        .user-card {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 1rem;
            margin: 0.5rem 0;
            background: white;
        }
        
        #output {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 1rem;
            margin-top: 1rem;
            max-height: 300px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Async JavaScript & API Demo</h1>
        
        <div class="api-demo">
            <h3>JSONPlaceholder API Demo</h3>
            <button onclick="fetchUsers()" id="fetchBtn">Fetch Users</button>
            <button onclick="createUser()" id="createBtn">Create User</button>
            <button onclick="demoPromises()" id="promiseBtn">Promise Demo</button>
            <button onclick="demoAsyncAwait()" id="asyncBtn">Async/Await Demo</button>
            <button onclick="clearOutput()">Clear</button>
        </div>
        
        <div id="status"></div>
        <div id="output"></div>
    </div>
    
    <script>
        const output = document.getElementById('output');
        const status = document.getElementById('status');
        
        function setStatus(message, type = 'info') {
            status.innerHTML = \`<div class="\${type}">\${message}</div>\`;
        }
        
        function clearStatus() {
            status.innerHTML = '';
        }
        
        function addToOutput(content) {
            const div = document.createElement('div');
            div.innerHTML = content;
            output.appendChild(div);
            output.scrollTop = output.scrollHeight;
        }
        
        function clearOutput() {
            output.innerHTML = '';
            clearStatus();
        }
        
        // Simulate API delay
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        async function fetchUsers() {
            const btn = document.getElementById('fetchBtn');
            btn.disabled = true;
            setStatus('Fetching users...', 'loading');
            
            try {
                // Using JSONPlaceholder API for demo
                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }
                
                const users = await response.json();
                
                setStatus(\`Successfully fetched \${users.length} users\`, 'success');
                
                // Display first 3 users
                users.slice(0, 3).forEach(user => {
                    addToOutput(\`
                        <div class="user-card">
                            <strong>\${user.name}</strong> (\${user.username})<br>
                            Email: \${user.email}<br>
                            City: \${user.address.city}
                        </div>
                    \`);
                });
                
            } catch (error) {
                setStatus(\`Error: \${error.message}\`, 'error');
                console.error('Fetch error:', error);
            } finally {
                btn.disabled = false;
            }
        }
        
        async function createUser() {
            const btn = document.getElementById('createBtn');
            btn.disabled = true;
            setStatus('Creating user...', 'loading');
            
            try {
                const newUser = {
                    name: 'John Doe',
                    username: 'johndoe',
                    email: 'john@example.com'
                };
                
                const response = await fetch('https://jsonplaceholder.typicode.com/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser)
                });
                
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }
                
                const createdUser = await response.json();
                
                setStatus('User created successfully!', 'success');
                addToOutput(\`
                    <div class="user-card">
                        <strong>Created User:</strong><br>
                        ID: \${createdUser.id}<br>
                        Name: \${createdUser.name}<br>
                        Email: \${createdUser.email}
                    </div>
                \`);
                
            } catch (error) {
                setStatus(\`Error: \${error.message}\`, 'error');
                console.error('Create error:', error);
            } finally {
                btn.disabled = false;
            }
        }
        
        function demoPromises() {
            const btn = document.getElementById('promiseBtn');
            btn.disabled = true;
            setStatus('Running Promise demo...', 'loading');
            
            // Create some demo promises
            const promise1 = delay(1000).then(() => 'First promise resolved');
            const promise2 = delay(1500).then(() => 'Second promise resolved');
            const promise3 = delay(800).then(() => 'Third promise resolved');
            
            addToOutput('<h4>Promise Demo Started</h4>');
            
            // Promise.all example
            Promise.all([promise1, promise2, promise3])
                .then(results => {
                    setStatus('All promises resolved!', 'success');
                    addToOutput(\`
                        <div class="success">
                            <strong>Promise.all results:</strong><br>
                            \${results.map((result, index) => \`\${index + 1}. \${result}\`).join('<br>')}
                        </div>
                    \`);
                })
                .catch(error => {
                    setStatus(\`Promise error: \${error.message}\`, 'error');
                })
                .finally(() => {
                    btn.disabled = false;
                });
            
            // Promise.race example
            Promise.race([promise1, promise2, promise3])
                .then(result => {
                    addToOutput(\`
                        <div class="success">
                            <strong>Promise.race winner:</strong> \${result}
                        </div>
                    \`);
                });
        }
        
        async function demoAsyncAwait() {
            const btn = document.getElementById('asyncBtn');
            btn.disabled = true;
            setStatus('Running Async/Await demo...', 'loading');
            
            try {
                addToOutput('<h4>Async/Await Demo</h4>');
                
                // Sequential execution
                addToOutput('Step 1: Starting...');
                await delay(500);
                
                addToOutput('Step 2: Fetching data...');
                await delay(800);
                
                addToOutput('Step 3: Processing...');
                await delay(600);
                
                addToOutput('Step 4: Complete!');
                
                setStatus('Async/Await demo completed!', 'success');
                
            } catch (error) {
                setStatus(\`Async error: \${error.message}\`, 'error');
            } finally {
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>`,
           exercises: [
             {
               id: 'weather-api',
               title: 'Build a Weather App',
               description: 'Create a simple weather application that fetches weather data from an API using async/await.',
               startingCode: `// Weather API Demo (using OpenWeatherMap-like structure)
// Note: This is a simulation - replace with real API

class WeatherApp {
  constructor() {
    this.apiKey = 'demo-key';
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
  }
  
  // TODO: Implement async method to fetch weather by city
  async getWeatherByCity(city) {
    // Your code here
  }
  
  // TODO: Implement method to display weather data
  displayWeather(weatherData) {
    // Your code here
  }
  
  // TODO: Implement error handling
  handleError(error) {
    // Your code here
  }
}

// Usage
const app = new WeatherApp();
// app.getWeatherByCity('London');`,
               solution: `// Weather API Demo - Complete Implementation

class WeatherApp {
  constructor() {
    this.apiKey = 'demo-key';
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
  }
  
  async getWeatherByCity(city) {
    try {
      // Simulate API call (replace with real API)
      const mockData = {
        name: city,
        main: {
          temp: Math.round(Math.random() * 30 + 5),
          feels_like: Math.round(Math.random() * 30 + 5),
          humidity: Math.round(Math.random() * 100)
        },
        weather: [{
          main: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
          description: 'clear sky'
        }],
        wind: {
          speed: Math.round(Math.random() * 20)
        }
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Real API call would look like:
      // const response = await fetch(\`\${this.baseURL}/weather?q=\${city}&appid=\${this.apiKey}&units=metric\`);
      // if (!response.ok) throw new Error('Weather data not found');
      // const data = await response.json();
      
      this.displayWeather(mockData);
      return mockData;
      
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  displayWeather(weatherData) {
    const weatherInfo = \`
      🌍 **\${weatherData.name}**
      🌡️ Temperature: \${weatherData.main.temp}°C
      🤔 Feels like: \${weatherData.main.feels_like}°C
      ☁️ Condition: \${weatherData.weather[0].main}
      💧 Humidity: \${weatherData.main.humidity}%
      💨 Wind Speed: \${weatherData.wind.speed} m/s
    \`;
    
    console.log(weatherInfo);
    
    // Update DOM if elements exist
    const weatherDisplay = document.getElementById('weather-display');
    if (weatherDisplay) {
      weatherDisplay.innerHTML = \`
        <div class="weather-card">
          <h2>\${weatherData.name}</h2>
          <div class="temp">\${weatherData.main.temp}°C</div>
          <div class="condition">\${weatherData.weather[0].main}</div>
          <div class="details">
            <p>Feels like: \${weatherData.main.feels_like}°C</p>
            <p>Humidity: \${weatherData.main.humidity}%</p>
            <p>Wind: \${weatherData.wind.speed} m/s</p>
          </div>
        </div>
      \`;
    }
  }
  
  handleError(error) {
    const errorMessage = \`❌ Error: \${error.message}\`;
    console.error(errorMessage);
    
    const errorDisplay = document.getElementById('error-display');
    if (errorDisplay) {
      errorDisplay.innerHTML = \`<div class="error">\${errorMessage}</div>\`;
    }
  }
  
  // Bonus: Get weather for multiple cities
  async getMultipleCitiesWeather(cities) {
    try {
      const weatherPromises = cities.map(city => this.getWeatherByCity(city));
      const results = await Promise.allSettled(weatherPromises);
      
      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');
      
      console.log(\`✅ Successfully fetched weather for \${successful.length} cities\`);
      if (failed.length > 0) {
        console.log(\`❌ Failed to fetch weather for \${failed.length} cities\`);
      }
      
      return results;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Usage Examples
const app = new WeatherApp();

// Single city
app.getWeatherByCity('London')
  .then(data => console.log('Weather data received:', data))
  .catch(error => console.error('Failed to get weather:', error));

// Multiple cities
// app.getMultipleCitiesWeather(['London', 'Paris', 'Tokyo']);`
             }
           ]
         },
         {
           id: 'week7-mongodb-basics',
           title: 'Week 7: MongoDB Fundamentals',
           content: `
<div style="margin-bottom: 20px; text-align: center;">
  <h3>📹 Video Explanation</h3>
  <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
    📹 Video Explanation Coming Soon
  </div>
  <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
</div>

# MongoDB Fundamentals

## What is MongoDB?

MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents. It's designed for scalability, performance, and ease of development.

## Key Features

- **Document-Oriented**: Stores data in BSON (Binary JSON) format
- **Schema-less**: No predefined structure required
- **Scalable**: Horizontal scaling through sharding
- **High Performance**: Optimized for read and write operations
- **Rich Query Language**: Powerful querying capabilities

## Installation

### MongoDB Community Server

1. **Download MongoDB**:
   - Visit [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select your operating system
   - Download and install

2. **Start MongoDB Service**:
   \`\`\`bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   \`\`\`

3. **Verify Installation**:
   \`\`\`bash
   mongosh --version
   \`\`\`

### MongoDB Atlas (Cloud)

Alternatively, use MongoDB Atlas for a cloud-hosted solution:
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string

## MongoDB Shell (mongosh)

The MongoDB Shell is an interactive JavaScript interface to MongoDB.

### Basic Commands
\`\`\`javascript
// Show databases
show dbs

// Use/create database
use myDatabase

// Show collections
show collections

// Show current database
db

// Get help
help
\`\`\`

## CRUD Operations

### Create (Insert)

#### Insert One Document
\`\`\`javascript
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  city: "New York"
})
\`\`\`

#### Insert Multiple Documents
\`\`\`javascript
db.users.insertMany([
  {
    name: "Alice Smith",
    email: "alice@example.com",
    age: 25,
    city: "Boston"
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    city: "Chicago"
  }
])
\`\`\`

### Read (Find)

#### Find All Documents
\`\`\`javascript
db.users.find()
\`\`\`

#### Find with Query
\`\`\`javascript
// Find by field
db.users.find({ city: "New York" })

// Find with conditions
db.users.find({ age: { $gte: 30 } })

// Find one document
db.users.findOne({ email: "john@example.com" })
\`\`\`

#### Query Operators
\`\`\`javascript
// Comparison operators
db.users.find({ age: { $gt: 25 } })        // greater than
db.users.find({ age: { $gte: 25 } })       // greater than or equal
db.users.find({ age: { $lt: 35 } })        // less than
db.users.find({ age: { $lte: 35 } })       // less than or equal
db.users.find({ age: { $ne: 30 } })        // not equal
db.users.find({ city: { $in: ["New York", "Boston"] } }) // in array

// Logical operators
db.users.find({ $and: [{ age: { $gte: 25 } }, { city: "New York" }] })
db.users.find({ $or: [{ age: { $lt: 25 } }, { city: "Boston" }] })
\`\`\`

### Update

#### Update One Document
\`\`\`javascript
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { age: 31, city: "San Francisco" } }
)
\`\`\`

#### Update Multiple Documents
\`\`\`javascript
db.users.updateMany(
  { city: "New York" },
  { $set: { country: "USA" } }
)
\`\`\`

#### Update Operators
\`\`\`javascript
// Set field value
db.users.updateOne({ _id: ObjectId("...") }, { $set: { status: "active" } })

// Increment numeric value
db.users.updateOne({ _id: ObjectId("...") }, { $inc: { age: 1 } })

// Add to array
db.users.updateOne({ _id: ObjectId("...") }, { $push: { hobbies: "reading" } })

// Remove field
db.users.updateOne({ _id: ObjectId("...") }, { $unset: { temporaryField: "" } })
\`\`\`

### Delete

#### Delete One Document
\`\`\`javascript
db.users.deleteOne({ email: "john@example.com" })
\`\`\`

#### Delete Multiple Documents
\`\`\`javascript
db.users.deleteMany({ city: "Chicago" })
\`\`\`

## Data Types

MongoDB supports various data types:

\`\`\`javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),  // ObjectId
  name: "John Doe",                           // String
  age: 30,                                    // Number (Int32)
  salary: 75000.50,                          // Number (Double)
  isActive: true,                            // Boolean
  birthDate: new Date("1993-05-15"),         // Date
  address: {                                 // Embedded Document
    street: "123 Main St",
    city: "New York",
    zipCode: "10001"
  },
  hobbies: ["reading", "swimming", "coding"], // Array
  metadata: null,                            // Null
  binaryData: BinData(0, "base64string")     // Binary Data
}
\`\`\`

## Indexing

Indexes improve query performance:

\`\`\`javascript
// Create index
db.users.createIndex({ email: 1 })        // Ascending
db.users.createIndex({ age: -1 })         // Descending
db.users.createIndex({ name: 1, age: -1 }) // Compound index

// List indexes
db.users.getIndexes()

// Drop index
db.users.dropIndex({ email: 1 })
\`\`\`

## Aggregation Pipeline

Powerful data processing and analysis:

\`\`\`javascript
// Basic aggregation
db.users.aggregate([
  { $match: { age: { $gte: 25 } } },
  { $group: { _id: "$city", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Common pipeline stages
// $match - Filter documents
// $group - Group documents
// $sort - Sort documents
// $project - Select/transform fields
// $limit - Limit number of documents
// $skip - Skip documents
\`\`\`
           `,
           codeExample: `// MongoDB Shell Commands Demo
// Run these commands in MongoDB Shell (mongosh)

// 1. Create and use database
use learningMongoDB

// 2. Insert sample data
db.students.insertMany([
  {
    name: "Alice Johnson",
    email: "alice@university.edu",
    age: 20,
    major: "Computer Science",
    gpa: 3.8,
    courses: ["CS101", "MATH201", "PHYS101"],
    address: {
      street: "123 College Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02101"
    },
    enrollmentDate: new Date("2022-09-01")
  },
  {
    name: "Bob Smith",
    email: "bob@university.edu",
    age: 22,
    major: "Mathematics",
    gpa: 3.6,
    courses: ["MATH301", "STAT201", "CS102"],
    address: {
      street: "456 University Blvd",
      city: "Cambridge",
      state: "MA",
      zipCode: "02139"
    },
    enrollmentDate: new Date("2021-09-01")
  },
  {
    name: "Carol Davis",
    email: "carol@university.edu",
    age: 21,
    major: "Computer Science",
    gpa: 3.9,
    courses: ["CS201", "CS301", "MATH301"],
    address: {
      street: "789 Academic Way",
      city: "Boston",
      state: "MA",
      zipCode: "02115"
    },
    enrollmentDate: new Date("2022-01-15")
  }
])

// 3. Basic queries
// Find all students
db.students.find()

// Find students by major
db.students.find({ major: "Computer Science" })

// Find students with GPA >= 3.7
db.students.find({ gpa: { $gte: 3.7 } })

// Find students in Boston
db.students.find({ "address.city": "Boston" })

// 4. Update operations
// Update one student's GPA
db.students.updateOne(
  { email: "alice@university.edu" },
  { $set: { gpa: 3.85 } }
)

// Add a course to a student
db.students.updateOne(
  { email: "bob@university.edu" },
  { $push: { courses: "PHYS201" } }
)

// 5. Aggregation examples
// Group students by major and count
db.students.aggregate([
  { $group: { _id: "$major", count: { $sum: 1 }, avgGPA: { $avg: "$gpa" } } }
])

// Find students with high GPA and project specific fields
db.students.aggregate([
  { $match: { gpa: { $gte: 3.7 } } },
  { $project: { name: 1, major: 1, gpa: 1, _id: 0 } },
  { $sort: { gpa: -1 } }
])

// 6. Create indexes for better performance
db.students.createIndex({ email: 1 })
db.students.createIndex({ major: 1, gpa: -1 })

// 7. Text search (create text index first)
db.students.createIndex({ name: "text", major: "text" })
db.students.find({ $text: { $search: "Computer Science" } })

// 8. Delete operations
// Delete one student
// db.students.deleteOne({ email: "example@university.edu" })

// Delete students with low GPA (commented out for safety)
// db.students.deleteMany({ gpa: { $lt: 3.0 } })`,
           exercises: [
             {
               id: 'mongodb-library',
               title: 'Library Management System',
               description: 'Create a library management system using MongoDB. Design collections for books, authors, and borrowers.',
               startingCode: `// Library Management System
// Design and implement the following collections:

// 1. Books collection
// Fields: title, author, isbn, publishYear, genre, available, borrowedBy

// 2. Authors collection  
// Fields: name, birthYear, nationality, biography

// 3. Borrowers collection
// Fields: name, email, phone, membershipDate, borrowedBooks

// TODO: Insert sample data for each collection
// TODO: Write queries to:
// - Find all available books
// - Find books by a specific author
// - Find all books borrowed by a specific person
// - Update book availability when borrowed/returned
// - Create appropriate indexes`,
               solution: `// Library Management System - Complete Implementation

// 1. Create and use database
use libraryDB

// 2. Insert Authors
db.authors.insertMany([
  {
    _id: ObjectId(),
    name: "J.K. Rowling",
    birthYear: 1965,
    nationality: "British",
    biography: "British author, best known for the Harry Potter series"
  },
  {
    _id: ObjectId(),
    name: "George Orwell",
    birthYear: 1903,
    nationality: "British",
    biography: "English novelist and essayist, known for 1984 and Animal Farm"
  },
  {
    _id: ObjectId(),
    name: "Agatha Christie",
    birthYear: 1890,
    nationality: "British",
    biography: "English writer known for detective novels"
  }
])

// 3. Insert Books
db.books.insertMany([
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "978-0747532699",
    publishYear: 1997,
    genre: "Fantasy",
    available: true,
    borrowedBy: null,
    borrowDate: null
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "978-0451524935",
    publishYear: 1949,
    genre: "Dystopian Fiction",
    available: false,
    borrowedBy: ObjectId("user1_id"),
    borrowDate: new Date("2024-01-15")
  },
  {
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    isbn: "978-0062693662",
    publishYear: 1934,
    genre: "Mystery",
    available: true,
    borrowedBy: null,
    borrowDate: null
  }
])

// 4. Insert Borrowers
db.borrowers.insertMany([
  {
    _id: ObjectId("user1_id"),
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    membershipDate: new Date("2023-06-01"),
    borrowedBooks: ["978-0451524935"]
  },
  {
    _id: ObjectId("user2_id"),
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-0456",
    membershipDate: new Date("2023-08-15"),
    borrowedBooks: []
  }
])

// 5. Queries

// Find all available books
db.books.find({ available: true })

// Find books by specific author
db.books.find({ author: "J.K. Rowling" })

// Find all books borrowed by a specific person
db.books.find({ borrowedBy: ObjectId("user1_id") })

// Find borrower details with their borrowed books
db.borrowers.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "borrowedBooks",
      foreignField: "isbn",
      as: "bookDetails"
    }
  }
])

// 6. Update operations

// Borrow a book
function borrowBook(isbn, borrowerId) {
  // Update book as borrowed
  db.books.updateOne(
    { isbn: isbn, available: true },
    {
      $set: {
        available: false,
        borrowedBy: ObjectId(borrowerId),
        borrowDate: new Date()
      }
    }
  )
  
  // Add book to borrower's list
  db.borrowers.updateOne(
    { _id: ObjectId(borrowerId) },
    { $push: { borrowedBooks: isbn } }
  )
}

// Return a book
function returnBook(isbn, borrowerId) {
  // Update book as available
  db.books.updateOne(
    { isbn: isbn },
    {
      $set: {
        available: true,
        borrowedBy: null,
        borrowDate: null
      }
    }
  )
  
  // Remove book from borrower's list
  db.borrowers.updateOne(
    { _id: ObjectId(borrowerId) },
    { $pull: { borrowedBooks: isbn } }
  )
}

// 7. Create indexes for better performance
db.books.createIndex({ isbn: 1 })
db.books.createIndex({ author: 1 })
db.books.createIndex({ available: 1 })
db.borrowers.createIndex({ email: 1 })
db.authors.createIndex({ name: 1 })

// 8. Advanced queries

// Books borrowed for more than 30 days
db.books.find({
  available: false,
  borrowDate: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
})

// Most popular genres
db.books.aggregate([
  { $group: { _id: "$genre", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Authors with most books in library
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } }
])`
             }
           ]
         },
         {
           id: 'week8-mongodb-nodejs',
           title: 'Week 8: MongoDB with Node.js Integration',
           content: `
<div style="margin-bottom: 20px; text-align: center;">
  <h3>📹 Video Explanation</h3>
  <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
    📹 Video Explanation Coming Soon
  </div>
  <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
</div>

# MongoDB with Node.js Integration

## MongoDB Drivers

There are several ways to connect MongoDB with Node.js:

1. **MongoDB Native Driver** - Official MongoDB driver
2. **Mongoose** - Object Document Mapper (ODM) with schema validation
3. **Prisma** - Modern database toolkit

## Setting Up MongoDB with Node.js

### Installation

\`\`\`bash
# MongoDB Native Driver
npm install mongodb

# Mongoose (recommended for beginners)
npm install mongoose

# Additional packages
npm install dotenv express
\`\`\`

### Environment Configuration

Create a \`.env\` file:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/myapp
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp
PORT=3000
\`\`\`

## Using MongoDB Native Driver

### Basic Connection
\`\`\`javascript
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db('myapp');
    const collection = database.collection('users');
    
    // Perform operations
    const result = await collection.insertOne({
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    console.log('Inserted document:', result.insertedId);
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await client.close();
  }
}

connectToMongoDB();
\`\`\`

### CRUD Operations with Native Driver
\`\`\`javascript
class UserService {
  constructor(database) {
    this.collection = database.collection('users');
  }
  
  // Create
  async createUser(userData) {
    try {
      const result = await this.collection.insertOne(userData);
      return { success: true, id: result.insertedId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Read
  async getUser(id) {
    try {
      const user = await this.collection.findOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {
      throw new Error('User not found');
    }
  }
  
  async getAllUsers(filter = {}) {
    try {
      const users = await this.collection.find(filter).toArray();
      return users;
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }
  
  // Update
  async updateUser(id, updateData) {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw new Error('Error updating user');
    }
  }
  
  // Delete
  async deleteUser(id) {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error('Error deleting user');
    }
  }
}
\`\`\`

## Using Mongoose ODM

### Connection Setup
\`\`\`javascript
const mongoose = require('mongoose');
require('dotenv').config();

// Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB with Mongoose');
});
\`\`\`

### Schema Definition
\`\`\`javascript
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    bio: String,
    website: String,
    social: {
      twitter: String,
      linkedin: String
    }
  },
  tags: [String]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Instance methods
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    isActive: this.isActive
  };
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Middleware (hooks)
userSchema.pre('save', function(next) {
  console.log('About to save user:', this.name);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
\`\`\`

### CRUD Operations with Mongoose
\`\`\`javascript
const User = require('./models/User');

class UserController {
  // Create user
  static async createUser(req, res) {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({
        success: true,
        data: user.getPublicProfile()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Get all users
  static async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const query = search ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      } : {};
      
      const users = await User.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
        
      const total = await User.countDocuments(query);
      
      res.json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Get user by ID
  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Update user
  static async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Delete user
  static async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UserController;
\`\`\`

## Express.js API Routes

\`\`\`javascript
const express = require('express');
const UserController = require('./controllers/UserController');

const router = express.Router();

// Routes
router.post('/users', UserController.createUser);
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;
\`\`\`

## Advanced MongoDB Features

### Aggregation Pipeline
\`\`\`javascript
// Complex aggregation example
const getUserStats = async () => {
  const stats = await User.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        averageAge: { $avg: '$age' },
        oldestUser: { $max: '$age' },
        youngestUser: { $min: '$age' }
      }
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        averageAge: { $round: ['$averageAge', 2] },
        oldestUser: 1,
        youngestUser: 1
      }
    }
  ]);
  
  return stats[0];
};
\`\`\`

### Transactions
\`\`\`javascript
const mongoose = require('mongoose');

async function transferOperation(fromUserId, toUserId, amount) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    // Deduct from sender
    await User.findByIdAndUpdate(
      fromUserId,
      { $inc: { balance: -amount } },
      { session }
    );
    
    // Add to receiver
    await User.findByIdAndUpdate(
      toUserId,
      { $inc: { balance: amount } },
      { session }
    );
    
    await session.commitTransaction();
    console.log('Transaction completed successfully');
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
}
\`\`\`

## Best Practices

1. **Connection Management**:
   - Use connection pooling
   - Handle connection errors gracefully
   - Close connections properly

2. **Schema Design**:
   - Use appropriate data types
   - Add validation rules
   - Create necessary indexes

3. **Error Handling**:
   - Implement proper error handling
   - Use try-catch blocks
   - Return meaningful error messages

4. **Security**:
   - Validate input data
   - Use environment variables for sensitive data
   - Implement authentication and authorization

5. **Performance**:
   - Use indexes for frequently queried fields
   - Implement pagination for large datasets
   - Use aggregation for complex queries
           `,
           codeExample: `// Complete Node.js + MongoDB Application
// File: app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  tags: [String],
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);

// Routes

// GET /api/tasks - Get all tasks with filtering and pagination
app.get('/api/tasks', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      createdBy,
      search
    } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (createdBy) query.createdBy = createdBy;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Task.countDocuments(query);
    
    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/tasks - Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/tasks/:id - Get task by ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/stats - Get task statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          statusCounts: {
            $push: {
              status: '$_id',
              count: '$count'
            }
          },
          totalTasks: { $sum: '$count' }
        }
      }
    ]);
    
    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        statusBreakdown: stats[0]?.statusCounts || [],
        priorityBreakdown: priorityStats,
        totalTasks: stats[0]?.totalTasks || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});`,
           exercises: [
             {
               id: 'blog-api',
               title: 'Build a Blog API',
               description: 'Create a complete blog API with MongoDB, including posts, comments, and user management.',
               startingCode: `// Blog API Exercise
              
// Create the following:

// 1. User Schema (name, email, password, role)
// 2. Post Schema (title, content, author, tags, publishDate)
// 3. Comment Schema (content, author, post, createdAt)

// TODO: Implement the following endpoints:
// - POST /api/users (register user)
// - GET /api/posts (get all posts with pagination)
// - POST /api/posts (create post)
// - GET /api/posts/:id (get single post with comments)
// - PUT /api/posts/:id (update post)
// - DELETE /api/posts/:id (delete post)
// - POST /api/posts/:id/comments (add comment)
// - GET /api/users/:id/posts (get user's posts)

// Bonus: Add search functionality and post categories`,
               solution: `// Complete Blog API Implementation

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogapi');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: String,
  avatar: String
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 200 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  category: { type: String, default: 'general' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishDate: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

postSchema.index({ title: 'text', content: 'text' });
const Post = mongoose.model('Post', postSchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

// Routes

// Register User
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get All Posts
app.get('/api/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, author } = req.query;
    
    const query = { status: 'published' };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (author) query.author = author;
    
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments(query);
    
    res.json({
      success: true,
      data: posts,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Post
app.post('/api/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    await post.populate('author', 'name email');
    
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get Single Post with Comments
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar bio');
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    // Increment views
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    // Get comments
    const comments = await Comment.find({ post: req.params.id, parentComment: null })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: { post, comments } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete Post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    // Delete associated comments
    await Comment.deleteMany({ post: req.params.id });
    
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add Comment
app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const comment = new Comment({
      ...req.body,
      post: req.params.id
    });
    
    await comment.save();
    await comment.populate('author', 'name avatar');
    
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get User's Posts
app.get('/api/users/:id/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments({ author: req.params.id });
    
    res.json({
      success: true,
      data: posts,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Blog Statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          avgViews: { $avg: '$views' }
        }
      }
    ]);
    
    const categoryStats = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();
    
    res.json({
      success: true,
      data: {
        ...stats[0],
        totalUsers,
        totalComments,
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Blog API running on port \${PORT}\`);
});`
             }
           ]
         }
       ]
     }
   ];

  useEffect(() => {
    const firstModule = courseModules[0];
    const firstLesson = firstModule?.lessons[0];

    // If params are missing, normalize to first valid module/lesson
    if (!moduleId || !lessonId) {
      if (firstModule && firstLesson) {
        setCurrentModule(firstModule);
        setCurrentLesson(firstLesson);
        setCode(firstLesson.codeExample);
        if (courseId) {
          navigate(`/course-learning/${courseId}/${firstModule.id}/${firstLesson.id}`, { replace: true });
        }
      }
      return;
    }

    // Try to find the requested module
    const module = courseModules.find(m => m.id === moduleId);
    if (!module) {
      // Invalid moduleId, normalize URL to first valid module/lesson
      if (firstModule && firstLesson && courseId) {
        setCurrentModule(firstModule);
        setCurrentLesson(firstLesson);
        setCode(firstLesson.codeExample);
        navigate(`/course-learning/${courseId}/${firstModule.id}/${firstLesson.id}`, { replace: true });
      }
      return;
    }

    // Valid module
    setCurrentModule(module);
    const lesson = module.lessons.find(l => l.id === lessonId) || module.lessons[0];
    if (lesson) {
      setCurrentLesson(lesson);
      setCode(lesson.codeExample);
    }
  }, [moduleId, lessonId, courseId, navigate]);

  const runCode = () => {
    setIsFlipping(true);
    
    setTimeout(() => {
      try {
        // Check if it's Python code
        if (code.includes('print(') || code.includes('def ') || code.includes('import ') || 
            code.includes('# ') || code.includes('"""') || code.includes("'''") ||
            code.startsWith('#') || /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(code)) {
          // Execute Python code
          executePythonCode(code);
        } else if (code.includes('<!DOCTYPE html>') || code.includes('<html>')) {
          // For complete HTML documents
          setOutput(code);
          setShowPreview(true);
        } else {
          // For HTML snippets, wrap them in a basic HTML structure
          const wrappedCode = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; padding: 16px; line-height: 1.6; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
    </style>
</head>
<body>
    ${code}
</body>
</html>`;
          setOutput(wrappedCode);
          setShowPreview(true);
        }
      } catch (error) {
        setOutput('Error: ' + error);
        setShowPreview(true);
      }
      
      setTimeout(() => {
        setIsFlipping(false);
      }, 300);
    }, 300);
  };

  const executePythonCode = (pythonCode: string) => {
    try {
      // Create a simple Python interpreter simulation
      let output = '';
      const lines = pythonCode.split('\n');
      const variables: { [key: string]: any } = {};
      
      // Simple Python execution simulation
      for (let line of lines) {
        line = line.trim();
        
        // Skip empty lines and comments
        if (!line || line.startsWith('#')) continue;
        
        // Handle print statements
        if (line.includes('print(')) {
          const printMatch = line.match(/print\((.*)\)/);
          if (printMatch) {
            let content = printMatch[1];
            
            // Handle f-strings
            if (content.startsWith('f"') || content.startsWith("f'")) {
              content = content.substring(2, content.length - 1);
              // Replace f-string variables
              content = content.replace(/\{([^}]+)\}/g, (match, varName) => {
                if (variables[varName] !== undefined) {
                  return variables[varName];
                }
                return match;
              });
            }
            // Handle regular strings
            else if ((content.startsWith('"') && content.endsWith('"')) || 
                     (content.startsWith("'") && content.endsWith("'"))) {
              content = content.substring(1, content.length - 1);
            }
            // Handle variables
            else if (variables[content] !== undefined) {
              content = variables[content];
            }
            // Handle comma-separated values
            else if (content.includes(',')) {
              const parts = content.split(',').map(part => {
                part = part.trim();
                if ((part.startsWith('"') && part.endsWith('"')) || 
                    (part.startsWith("'") && part.endsWith("'"))) {
                  return part.substring(1, part.length - 1);
                }
                if (variables[part] !== undefined) {
                  return variables[part];
                }
                return part;
              });
              content = parts.join(' ');
            }
            
            output += content + '\n';
          }
        }
        // Handle variable assignments
        else if (line.includes('=') && !line.includes('==')) {
          const [varName, varValue] = line.split('=').map(s => s.trim());
          
          // Handle string values
          if ((varValue.startsWith('"') && varValue.endsWith('"')) || 
              (varValue.startsWith("'") && varValue.endsWith("'"))) {
            variables[varName] = varValue.substring(1, varValue.length - 1);
          }
          // Handle numeric values
          else if (!isNaN(Number(varValue))) {
            variables[varName] = varValue.includes('.') ? parseFloat(varValue) : parseInt(varValue);
          }
          // Handle boolean values
          else if (varValue === 'True') {
            variables[varName] = true;
          }
          else if (varValue === 'False') {
            variables[varName] = false;
          }
          // Handle lists
          else if (varValue.startsWith('[') && varValue.endsWith(']')) {
            try {
              variables[varName] = JSON.parse(varValue.replace(/'/g, '"'));
            } catch {
              variables[varName] = varValue;
            }
          }
          // Handle dictionaries
          else if (varValue.startsWith('{') && varValue.endsWith('}')) {
            try {
              variables[varName] = JSON.parse(varValue.replace(/'/g, '"'));
            } catch {
              variables[varName] = varValue;
            }
          }
          else {
            variables[varName] = varValue;
          }
        }
      }
      
      // Create HTML output for Python results
      const pythonOutput = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
          font-family: 'Courier New', monospace; 
          padding: 20px; 
          background: #1e1e1e; 
          color: #d4d4d4; 
          margin: 0;
        }
        .python-output {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 16px;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.5;
        }
        .python-header {
          color: #58a6ff;
          font-weight: bold;
          margin-bottom: 10px;
          border-bottom: 1px solid #30363d;
          padding-bottom: 8px;
        }
        .output-line {
          margin: 4px 0;
        }
    </style>
</head>
<body>
    <div class="python-header">🐍 Python Output</div>
    <div class="python-output">${output || 'No output generated'}</div>
</body>
</html>`;
      
      setOutput(pythonOutput);
      setShowPreview(true);
    } catch (error) {
      const errorOutput = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
          font-family: 'Courier New', monospace; 
          padding: 20px; 
          background: #1e1e1e; 
          color: #f85149; 
          margin: 0;
        }
        .error-output {
          background: #0d1117;
          border: 1px solid #f85149;
          border-radius: 8px;
          padding: 16px;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.5;
        }
        .error-header {
          color: #f85149;
          font-weight: bold;
          margin-bottom: 10px;
          border-bottom: 1px solid #f85149;
          padding-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="error-header">❌ Python Error</div>
    <div class="error-output">Error executing Python code: ${error}</div>
</body>
</html>`;
      
      setOutput(errorOutput);
      setShowPreview(true);
    }
  };

  const resetCode = () => {
    if (currentLesson) {
      setCode(currentLesson.codeExample);
    }
  };

  const startExercise = (exercise: Exercise) => {
    setCurrentExerciseId(exercise.id);
    setCode(exercise.initialCode.replace(/\\n/g, '\n'));
    setHtmlCode(exercise.initialCode);
    setActiveTab('html');
  };

  const validateExercise = (exerciseId: string, userCode: string): boolean => {
    const exercise = currentLesson?.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return false;

    // Basic validation - check if code contains key elements from solution
    const solution = exercise.solution.toLowerCase();
    const userCodeLower = userCode.toLowerCase();

    // For HTML exercises, check for essential elements
    if (exerciseId === 'ex1') {
      return userCodeLower.includes('<h1>') && userCodeLower.includes('</h1>');
    } else if (exerciseId === 'ex2') {
      return userCodeLower.includes('<p>') && userCodeLower.includes('</p>');
    } else if (exerciseId === 'ex3') {
      return userCodeLower.includes('<ul>') && userCodeLower.includes('<li>');
    } else if (exerciseId === 'ex4') {
      return userCodeLower.includes('<a href=') && userCodeLower.includes('</a>');
    } else if (exerciseId === 'ex5') {
      return userCodeLower.includes('<img') && userCodeLower.includes('src=');
    } else if (exerciseId === 'ex6') {
      return userCodeLower.includes('color:') || userCodeLower.includes('background');
    } else if (exerciseId === 'ex7') {
      return userCodeLower.includes('getelementbyid') && userCodeLower.includes('innerhtml');
    } else if (exerciseId === 'ex8') {
      return userCodeLower.includes('let ') || userCodeLower.includes('const ');
    } else if (exerciseId === 'ex9') {
      return userCodeLower.includes('function') && userCodeLower.includes('return');
    } else if (exerciseId === 'ex10') {
      return userCodeLower.includes('<header>') && userCodeLower.includes('<section>');
    }

    return true; // Default to true for other exercises
  };

  const submitExercise = async () => {
    if (!currentExerciseId || !currentLesson) return;

    setIsSubmitting(true);
    
    try {
      // Validate the exercise
      const isValid = validateExercise(currentExerciseId, code);
      
      if (isValid) {
        // Mark exercise as submitted
        const newSubmittedExercises = new Set([...submittedExercises, currentExerciseId]);
        setSubmittedExercises(newSubmittedExercises);
        
        // Update lesson progress
        const totalExercises = currentLesson.exercises.length;
        const completedCount = newSubmittedExercises.size;
        const progressPercentage = Math.round((completedCount / totalExercises) * 100);
        
        const newExerciseProgress = {
          ...exerciseProgress,
          [currentLesson.id]: progressPercentage
        };
        
        setExerciseProgress(newExerciseProgress);
        
        // Save progress to localStorage for StudentPortal to track
        const courseId = 'web-development'; // This should be dynamic based on the actual course
        const existingProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        
        // Calculate lesson progress for all lessons
        const lessonProgress: {[key: string]: number} = {};
        courseModules.forEach(module => {
          module.lessons.forEach(lesson => {
            const lessonExercises = lesson.exercises;
            const completedInLesson = lessonExercises.filter(ex => 
              newSubmittedExercises.has(ex.id || '')
            ).length;
            const lessonProgressPercent = Math.round((completedInLesson / lessonExercises.length) * 100);
            lessonProgress[lesson.id] = lessonProgressPercent;
          });
        });
        
        existingProgress[courseId] = lessonProgress;
        localStorage.setItem('courseProgress', JSON.stringify(existingProgress));
        
        // Trigger storage event for StudentPortal to listen
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'courseProgress',
          newValue: JSON.stringify(existingProgress)
        }));
        
        setSubmissionMessage('🎉 Exercise completed successfully! Great work!');
        setShowSubmissionModal(true);
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          setShowSubmissionModal(false);
          setCurrentExerciseId(null);
        }, 3000);
      } else {
        setSubmissionMessage('❌ Exercise not quite right. Please check the requirements and try again.');
        setShowSubmissionModal(true);
        
        setTimeout(() => {
          setShowSubmissionModal(false);
        }, 3000);
      }
    } catch (error) {
      setSubmissionMessage('❌ Error submitting exercise. Please try again.');
      setShowSubmissionModal(true);
      
      setTimeout(() => {
        setShowSubmissionModal(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentModule || !currentLesson) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Header />
        <div className="pt-24 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <button 
              onClick={() => navigate('/student-portal')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Scrolling banner keyframes (local to this component) */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      {/* MagnetLines Background */}
      <div className="fixed inset-0 z-0">
        <MagnetLines 
          rows={12}
          columns={12}
          containerSize="100vw"
          lineColor="#333333"
          lineWidth="0.5vmin"
          lineHeight="4vmin"
          baseAngle={0}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            opacity: 0.4
          }}
        />
      </div>
      <Header hideDock={true} />
      
      {/* Top Navigation Bar */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm border-b border-gray-800/50 pt-4 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4">
             <div className="flex items-center space-x-2 lg:space-x-4">
               <button
                 onClick={() => setSidebarOpen(!sidebarOpen)}
                 className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                 title="Toggle sidebar"
               >
                 <Book className="h-5 w-5 text-gray-600 dark:text-gray-300" />
               </button>
               <button
                 onClick={() => navigate('/student-portal')}
                 className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
               >
                 <ArrowLeft className="h-5 w-5 flex-shrink-0" />
                 <span className="font-medium hidden sm:inline">Back to Dashboard</span>
                 <span className="font-medium sm:hidden">Back</span>
               </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base lg:text-lg font-semibold text-white truncate">
                    Frontend Development - Beginner
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Module-based course</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Progress section commented out */}
              {/* <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Progress</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Module 2 of 3 • 33% Complete</div>
              </div>
              <div className="w-24 lg:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '33%'}}></div>
              </div> */}
            </div>
          </div>
          {/* Scrolling Feedback & Contact Banner */}
          <div className="mt-2 mb-2 border-t border-b border-gray-800/50 bg-black/30">

          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative w-full">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar Navigation - Glass Island */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-20'} relative z-20 m-4 rounded-2xl bg-black/20 backdrop-blur-md border border-gray-700/50 shadow-2xl transition-all duration-300 flex flex-col ${sidebarOpen ? 'fixed lg:relative z-50 lg:z-auto' : 'relative'} lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{height: 'calc(100vh - 2rem)'}}>
          {/* Fixed Header */}
          <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              {sidebarOpen && <h2 className="text-lg font-semibold text-white">Course Content</h2>}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors ml-auto"
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-5 w-5 text-gray-300" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 h-full overflow-y-auto overscroll-contain p-4 pr-2">
            
            {/* Module Navigation */}
            <div className="mb-6">
              {sidebarOpen && <h3 className="text-sm font-semibold text-white mb-3">Course Modules</h3>}
              <div className="space-y-2 mb-4">
                {courseModules.filter(module => module.id !== 'frontend-development-intermediate').map((module, index) => (
                  <ClickSpark key={module.id} sparkColor="#f59e0b" sparkSize={6} sparkRadius={10} sparkCount={5} duration={250}>
                    <button
                      onClick={() => {
                        const firstLesson = module.lessons[0];
                        if (firstLesson) {
                          navigate(`/course-learning/${courseId}/${module.id}/${firstLesson.id}`);
                        }
                      }}
                      className={`w-full text-left ${sidebarOpen ? 'p-3' : 'p-2'} rounded-lg transition-all duration-200 ${
                        module.id === moduleId
                          ? 'bg-blue-50 dark:bg-blue-800/40 border border-blue-400 text-blue-900 dark:text-white'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-200 border border-gray-700/40'
                      }`}
                      title={!sidebarOpen ? module.title : undefined}
                    >
                    <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
                      <div className={`${sidebarOpen ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center text-xs font-medium ${
                        module.id === moduleId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200'
                      }`}>
                        {index + 1}
                      </div>
                      {sidebarOpen && (
                        <div className="flex-1">
                          <div className="text-sm font-medium">{module.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {module.lessons.length} lessons
                          </div>
                        </div>
                      )}
                    </div>
                    </button>
                  </ClickSpark>
                ))}
              </div>
            </div>
            
            {/* Current Module Lessons */}
            {sidebarOpen && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">Current Module: {currentModule.title}</h3>
              </div>
            )}
            
            <div className="space-y-2 flex-1">
              {currentModule.lessons.map((lesson, index) => (
                <ClickSpark key={lesson.id} sparkColor="#8b5cf6" sparkSize={6} sparkRadius={10} sparkCount={5} duration={250}>
                  <button
                    onClick={() => navigate(`/course-learning/${courseId}/${currentModule.id}/${lesson.id}`)}
                    className={`w-full text-left ${sidebarOpen ? 'p-4' : 'p-2'} rounded-lg transition-all duration-200 ${
                      lesson.id === lessonId 
                        ? 'bg-blue-50 dark:bg-blue-800/40 border-l-4 border-blue-500 text-blue-900 dark:text-white' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-200'
                    }`}
                    title={!sidebarOpen ? lesson.title : undefined}
                  >
                  <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
                    <div className={`${sidebarOpen ? 'w-8 h-8' : 'w-6 h-6'} rounded-full flex items-center justify-center text-sm font-medium ${
                      lesson.id === lessonId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200'
                    }`}>
                      {index + 1}
                    </div>
                    {sidebarOpen && (
                      <div className="flex-1">
                        <div className="text-sm font-medium">{lesson.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 min</div>
                      </div>
                    )}
                    {sidebarOpen && lesson.id === lessonId && (
                      <Play className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  </button>
                </ClickSpark>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex h-full">
          {/* File Explorer Glass Island */}
          {showFileExplorer && (
            <div className="w-80 relative z-20 m-4 mr-2 rounded-2xl bg-black/20 backdrop-blur-md border border-gray-700/50 shadow-2xl flex flex-col transition-all duration-300" style={{height: 'calc(100vh - 2rem)'}}>
              {/* Explorer Header */}
              <div className="px-4 py-3 border-b border-gray-700/50 bg-gray-800/60">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-white uppercase tracking-wide">
                    Explorer
                  </span>
                </div>
              </div>
              
              {/* Project Name */}
              <div className="px-4 py-2 border-b border-gray-700/50">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-white">
                    frontend-course-project
                  </span>
                </div>
              </div>

              {/* File Structure */}
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                  {/* Sample file structure */}
                  <div className="flex items-center py-1 px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">📁 src</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div 
                      onClick={() => handleFileClick('index.html')}
                      className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 ${selectedFile === 'index.html' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                    >
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">index.html</span>
                    </div>
                    <div 
                      onClick={() => handleFileClick('styles.css')}
                      className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 ${selectedFile === 'styles.css' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                    >
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">styles.css</span>
                    </div>
                    <div 
                      onClick={() => handleFileClick('script.js')}
                      className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 ${selectedFile === 'script.js' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                    >
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">script.js</span>
                    </div>
                  </div>
                  <div className="flex items-center py-1 px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">📁 assets</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="flex items-center py-1 px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">logo.png</span>
                    </div>
                    <div className="flex items-center py-1 px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">background.jpg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Left Panel - Content & Exercise Glass Island */}
          <StarBorder className={`${showFileExplorer ? 'w-1/3' : 'w-1/2'} relative z-20 m-4 mr-2 transition-all duration-300 min-w-0`} color="#60a5fa" speed="4s">
            <div className="h-full flex flex-col" style={{height: 'calc(100vh - 2rem)'}}>
            <div className="border-b border-gray-700/50 p-4 lg:p-6">
              <div className="flex space-x-1 bg-gray-800/60 rounded-lg p-1">
                <ClickSpark sparkColor="#60a5fa" sparkSize={8} sparkRadius={12} sparkCount={6} duration={300}>
                  <button
                    onClick={() => { setActiveTab('theory'); try { window.speechSynthesis.cancel(); } catch {} }}
                    className={`flex-1 px-2 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'theory'
                        ? 'bg-gray-700/80 text-white shadow-sm'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center space-x-1 lg:space-x-2">
                      <Book className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline">Content</span>
                    </span>
                  </button>
                </ClickSpark>
                <ClickSpark sparkColor="#10b981" sparkSize={8} sparkRadius={12} sparkCount={6} duration={300}>
                  <button
                    onClick={() => { setActiveTab('teacher'); startTeacherAudio(); }}
                    className={`flex-1 px-2 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'teacher'
                        ? 'bg-gray-700/80 text-white shadow-sm'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center space-x-1 lg:space-x-2">
                      <img src={teacherSticker} alt="Teacher" className="rounded" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                      <span className="hidden sm:inline">Teacher</span>
                    </span>
                  </button>
                </ClickSpark>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 lg:p-4">
              {activeTab === 'theory' ? (
                <div className="max-w-4xl h-full overflow-y-auto">
                  <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{currentLesson.title}</h1>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>5 min read</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>Beginner</span>
                      </div>
                      {/* Exercise completion counter commented out */}
                      {/* <div className="flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>{submittedExercises.size}/{currentLesson.exercises.length} exercises completed</span>
                      </div> */}
                    </div>
                    {/* Progress Bar commented out */}
                    {/* <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${exerciseProgress[currentLesson.id] || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Progress: {exerciseProgress[currentLesson.id] || 0}% complete
                    </p> */}
                  </div>
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700/50 dark:border-gray-700 max-h-[calc(100vh-340px)] overflow-y-auto">
                  <div className="prose prose-lg max-w-none dark:prose-invert text-left">
            {renderContentWithVideos(
              currentLesson.content,
              lessonVideos[currentLesson.id],
              currentLesson.id === 'html-intro'
            )}

                      {/* Audio Teacher for CSS Box Model & Layout */}
                      {currentLesson.id === 'css-box-model' && (
                        <CssBoxModelAudioTeacher />
                      )}
                      
                      {/* Additional Explanation (lightweight, lesson-specific) */}
                      {additionalExplanations[currentLesson.id] && (
                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                          <div className="text-sm md:text-base text-yellow-900 dark:text-yellow-100" dangerouslySetInnerHTML={{ __html: processContent(additionalExplanations[currentLesson.id]) }} />
                        </div>
                      )}
                      
                      {/* Enhanced Learning Tips with neon yellow highlight */}
                      <div className="mt-6 p-4 rounded-lg border-l-4 border-yellow-500" style={{ backgroundColor: '#FFF9A8', boxShadow: '0 0 12px rgba(255, 234, 0, 0.6)' }}>
                        <h3 className="text-sm font-semibold mb-2 flex items-center text-gray-900 dark:text-black">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Key Learning Points
                        </h3>
                        <ul className="text-xs space-y-1">
                          <li><span className="px-1 rounded" style={{ backgroundColor: '#FFF200', color: '#111' }}>• Practice the code examples in the editor</span></li>
                          <li><span className="px-1 rounded" style={{ backgroundColor: '#FFF200', color: '#111' }}>• Experiment with different values and attributes</span></li>
                          <li><span className="px-1 rounded" style={{ backgroundColor: '#FFF200', color: '#111' }}>• Complete all exercises to master the concept</span></li>
                          <li><span className="px-1 rounded" style={{ backgroundColor: '#FFF200', color: '#111' }}>• Use the preview to see your changes in real-time</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'teacher' ? (
                <div className="h-full overflow-y-auto">
                  {/* Centered teacher image */}
                  <div className="flex flex-col items-center justify-center text-center min-h-[280px]">
                    <img
                      src={teacherSticker}
                      alt="Teacher"
                      className="rounded shadow-lg"
                      style={{ width: 120, height: 120, objectFit: 'contain' }}
                    />
                    <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">Your Teacher</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Click the Teacher tab to hear guidance.</p>
                    {/* Removed inline Play/Stop controls to declutter the header */}
                  </div>
                  {currentLesson.id === 'css-box-model' ? (
                    <CssBoxModelAudioTeacher autoStart isFullscreen={isAudioFullscreen} onFullscreenChange={setIsAudioFullscreen} />
                  ) : (
                    <GenericAudioTeacher autoStart isFullscreen={isAudioFullscreen} onFullscreenChange={setIsAudioFullscreen} />
                  )}
                </div>
              ) : null}
            </div>
            </div>
          </StarBorder>

          {/* Right Panel - Code Editor Glass Island - Hidden when audio is fullscreen */}
          {!isAudioFullscreen && (
          <div className={`${showFileExplorer ? 'w-1/3' : 'w-1/2'} relative z-20 m-4 ml-2 rounded-2xl bg-black backdrop-blur-md border border-gray-700/50 shadow-2xl flex flex-col transition-all duration-300`} style={{height: 'calc(100vh - 2rem)'}}>
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {showPreview ? (
                      <>
                        <Monitor className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 font-medium text-sm">Live Preview</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300 font-medium text-sm">
                          {selectedFile ? selectedFile : 'Code Editor'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {showPreview && (
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-md transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Code className="h-3 w-3" />
                      <span>Back to Code</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowFileExplorer(!showFileExplorer)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors duration-200 flex items-center space-x-1"
                    title={showFileExplorer ? 'Hide File Explorer' : 'Show File Explorer'}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      {showFileExplorer ? (
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span>Files</span>
                  </button>
                  <button
                    onClick={resetCode}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-md transition-colors duration-200 flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={runCode}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Play className="h-3 w-3" />
                    <span>Run</span>
                  </button>
                  {/* Submit exercise button commented out */}
                  {/* {currentExerciseId && !submittedExercises.has(currentExerciseId) && (
                    <button
                      onClick={submitExercise}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-md transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Send className="h-3 w-3" />
                      <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                    </button>
                  )} */}
                  {/* Completed exercise indicator commented out */}
                  {/* {currentExerciseId && submittedExercises.has(currentExerciseId) && (
                    <div className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Completed</span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden h-full">
              {/* Flip Container */}
              <div className={`absolute inset-0 transition-transform duration-700 ${isFlipping ? 'animate-pulse' : ''} ${showPreview ? 'transform rotateY-180' : ''}`}>
                {!showPreview ? (
                  /* Code Editor */
                  <div className="h-full flex flex-col">
                    <div className="flex-1 relative">
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 leading-relaxed placeholder-gray-500"
                        placeholder="// Write your HTML code here...\n// Press 'Run' to see the output\n// Use modern HTML5 elements and CSS for best results"
                        spellCheck={false}
                      />
                      {/* Teacher sticker overlay on Code Editor (CSS Box Model only) */}
                      {currentLesson.id === 'css-box-model' && (
                        <img
                          src={teacherSticker}
                          alt="Teacher"
                          className="absolute top-2 right-2 rounded"
                          style={{ width: 36, height: 36, objectFit: 'contain', pointerEvents: 'none', zIndex: 9999 }}
                        />
                      )}
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                        Lines: {code.split('\n').length} | Chars: {code.length}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Live Preview */
                  <div className="h-full flex flex-col bg-white">
                    <div className="flex-1 p-2">
                      {output ? (
                        <iframe
                          srcDoc={output}
                          className="w-full h-full border border-gray-200 rounded-lg bg-white shadow-sm"
                          title="Live Preview"
                        />
                      ) : (
                        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          <div className="text-center">
                            <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <div className="text-gray-600 font-medium text-lg">Ready to Preview</div>
                            <div className="text-gray-500 text-sm mt-2">Your HTML output will render here</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {submissionMessage.includes('🎉') ? '🎉' : '❌'}
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-4">
                {submissionMessage}
              </p>
              {/* Submission modal progress bar commented out */}
              {/* <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${exerciseProgress[currentLesson?.id || ''] || 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lesson Progress: {exerciseProgress[currentLesson?.id || ''] || 0}%
              </p> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLearning;
function setHtmlCode(initialCode: string) {
  setCode(initialCode);
}
function setCode(initialCode: string) {
  throw new Error('Function not implemented.');
}

