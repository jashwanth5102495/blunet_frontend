import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { askLLM, ChatMessage } from '../services/llm';
import { Paperclip, Mic, Send, BookOpen, FileText, Search, CheckCircle, ChevronDown, ChevronRight, ChevronLeft, Home, PlayCircle, Terminal, Code, ArrowLeft, ArrowRight, Copy, Check, Menu, X, Video, Lock, Book } from 'lucide-react';
import { clsx } from 'clsx';

// --- Types ---

interface Lesson {
  title: string;
  content: string; // HTML content
  duration?: string;
  videoUrl?: string; // URL for the lesson video
  syntax?: { title: string; content: string }[];
  terminalCommands?: string[];
  liveCode?: string; // Default code for the live editor
  language?: 'html' | 'python';
}

interface Module {
  id: string; // e.g., 'module-1'
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
  videoLinks?: { label: string; url: string }[];
}

interface Resource {
  type: 'video' | 'document';
  title: string;
  duration: string;
  description: string;
}

// --- Data ---

const resources: Resource[] = [
  {
    type: 'video',
    title: 'Frontend Overview',
    duration: '15 min',
    description: 'Introduction to Frontend Development'
  },
  {
    type: 'document',
    title: 'Course Handbook',
    duration: '20 min read',
    description: 'Guide to course structure and requirements'
  }
];

const courseData: Module[] = [
  {
    id: 'module-1',
    title: 'HTML Module: Complete Guide to HTML Tags',
    duration: '40 min',
    description: 'Master the building blocks of the web.',
    lessons: [
      { 
        title: 'Introduction to HTML', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to HTML</h2>
          <p class="text-gray-300 mb-4">HTML (HyperText Markup Language) is the core building block of the World Wide Web. It is the first language that anyone must learn when starting web development. HTML provides the basic structure of a website and defines how content such as text, images, videos, links, and forms appear in a web browser. Unlike programming languages, HTML does not contain logic or calculations. Instead, it uses predefined tags to organize and describe content in a meaningful way.</p>
          
          <p class="text-gray-300 mb-4">HTML works on the principle of markup, meaning that content is enclosed within tags that describe its purpose. For example, a heading is wrapped inside heading tags, a paragraph inside paragraph tags, and a video inside video tags. When a browser loads an HTML file, it reads these tags and visually displays the content according to their meaning. This is how raw code is transformed into a visually structured web page.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Purpose of HTML in Web Development</h3>
          <p class="text-gray-300 mb-4">HTML plays a crucial role in web development because it defines what content exists on a page, while other technologies enhance it. CSS is used to style the HTML content, and JavaScript is used to add behavior and interactivity. Without HTML, CSS and JavaScript would have nothing to work on. This is why HTML is often referred to as the skeleton of a website, CSS as the skin, and JavaScript as the brain.</p>
          <p class="text-gray-300 mb-4">Every modern website, from simple blogs to complex web applications, begins with HTML. Even mobile apps and desktop applications that use web technologies rely on HTML to structure their interfaces. Learning HTML properly ensures that content is well-organized, readable, and accessible across different devices and browsers.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">How HTML Files Work in a Browser</h3>
          <p class="text-gray-300 mb-4">HTML files are saved with a .html extension and can be opened directly in any web browser. When a browser opens an HTML file, it processes the document from top to bottom. The browser first identifies the document type, then reads the structure, and finally renders the visible content on the screen. HTML does not require compilation; it is interpreted directly by the browser, making it simple and fast to work with.</p>
          <p class="text-gray-300 mb-4">Browsers do not display the HTML code itself. Instead, they interpret the tags and present the formatted output to the user. For example, heading tags appear bold and large, paragraphs appear as readable text blocks, and video tags render an embedded video player instead of raw file data.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Structure of an HTML Document</h3>
          <p class="text-gray-300 mb-4">Every HTML document follows a standard structure that helps browsers understand the content correctly. This structure includes the document type declaration, the root HTML element, the head section, and the body section. The head section contains information about the page such as the title and metadata, which is not visible to users. The body section contains all the content that users see and interact with on the webpage.</p>
          <p class="text-gray-300 mb-4">Following the correct structure is important for browser compatibility, search engine optimization, and accessibility. A well-structured HTML document ensures that content loads properly on desktops, tablets, and mobile devices.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">HTML and Multimedia Content</h3>
          <p class="text-gray-300 mb-4">Modern HTML (HTML5) allows embedding multimedia content such as audio and video directly into web pages without the need for external plugins. The <code>&lt;video&gt;</code> tag makes it possible to display videos with playback controls like play, pause, and volume adjustment. Proper usage of video attributes such as width, height, and controls ensures that videos display correctly and prevents issues like black boxes or invisible players.</p>
          <p class="text-gray-300 mb-4">Using HTML5 multimedia elements improves user experience and makes learning platforms more interactive, especially for online study material where video lessons are essential.</p>
        `,
        syntax: [
          { 
            title: 'Basic HTML Document Syntax', 
            content: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Page Title</title> 
</head> 
<body> 
    Content goes here 
</body> 
</html>` 
          },
          { 
            title: 'HTML Tag Syntax', 
            content: `<tagname>Content</tagname>` 
          },
          { 
            title: 'HTML Video Tag Syntax', 
            content: `<video width="640" height="360" controls> 
    <source src="video.mp4" type="video/mp4"> 
</video>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Introduction to HTML</title>
    <style>
      body { font-family: sans-serif; padding: 20px; color: #333; background: #f4f4f4; }
      h1 { color: #0056b3; }
      p { line-height: 1.6; }
      video { max-width: 100%; height: auto; border: 2px solid #ddd; border-radius: 8px; }
    </style>
</head> 
<body> 

    <h1>Welcome to HTML</h1> 

    <p> 
        HTML is the standard markup language used to create web pages. 
        It provides the basic structure of content on the internet and 
        works together with CSS and JavaScript to build complete websites. 
    </p> 

    <p> 
        Below is an example of an HTML5 video embedded using proper syntax. 
    </p> 

    <!-- Using a sample video since the relative path won't work in this context -->
    <video width="640" height="360" controls> 
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"> 
        Your browser does not support the video tag. 
    </video> 

</body> 
</html>`
      },
      { 
        title: 'HTML Headings (h1-h6)', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">What Are HTML Headings?</h2>
          <p class="text-gray-300 mb-4">HTML headings are used to define titles and subtitles on a web page. They help organize content into clear sections, making the page easier to read for users and easier to understand for browsers and search engines. Headings are one of the most important elements in HTML because they provide a logical structure to the content.</p>
          
          <p class="text-gray-300 mb-4">HTML provides six levels of headings, ranging from <code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code>. Each level represents a different level of importance. <code>&lt;h1&gt;</code> is the most important heading and usually represents the main title of the page, while <code>&lt;h6&gt;</code> is the least important and is used for small subheadings.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Purpose of Headings in Web Pages</h3>
          <p class="text-gray-300 mb-4">Headings serve multiple purposes in web development. For users, headings improve readability by breaking large blocks of text into manageable sections. For developers, headings make the HTML code more organized and easier to maintain. For search engines, headings help understand the topic and hierarchy of the content, which plays a key role in Search Engine Optimization (SEO).</p>
          
          <p class="text-gray-300 mb-4">A well-structured heading system allows readers to quickly scan a page and find the information they are looking for. This is especially important in blogs, documentation, study material, and learning platforms where content is information-heavy.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Hierarchy of HTML Headings</h3>
          <p class="text-gray-300 mb-4">HTML headings follow a hierarchical order, similar to chapters and subchapters in a book. The <code>&lt;h1&gt;</code> tag should be used only once per page and should clearly describe the main topic of the page. <code>&lt;h2&gt;</code> headings represent major sections under the main topic, while <code>&lt;h3&gt;</code> to <code>&lt;h6&gt;</code> are used for sub-sections within those sections.</p>
          
          <p class="text-gray-300 mb-4">Skipping heading levels or using them incorrectly can confuse both users and search engines. For example, using an <code>&lt;h4&gt;</code> directly after an <code>&lt;h1&gt;</code> without an <code>&lt;h2&gt;</code> or <code>&lt;h3&gt;</code> can break the logical structure of the document.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Visual Appearance vs Meaning</h3>
          <p class="text-gray-300 mb-4">By default, browsers display headings in different font sizes and weights. <code>&lt;h1&gt;</code> appears largest, and <code>&lt;h6&gt;</code> appears smallest. However, it is important to understand that headings are not meant for styling purposes. Their main role is to convey meaning and structure. Styling should always be handled using CSS.</p>
          
          <p class="text-gray-300 mb-4">Using headings correctly improves accessibility, allowing screen readers to navigate content efficiently for visually impaired users.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Using Headings</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use only one <code>&lt;h1&gt;</code> per page</li>
              <li>Follow a proper hierarchical order</li>
              <li>Do not use headings just to make text bold or large</li>
              <li>Keep heading text clear and meaningful</li>
              <li>Use headings to describe the section content accurately</li>
          </ul>
          <p class="text-gray-300 mb-4">Following these best practices ensures your HTML pages are clean, professional, and accessible.</p>
        `,
        syntax: [
          { 
            title: 'HTML Headings Syntax', 
            content: `<h1>Main Heading</h1> 
<h2>Sub Heading</h2> 
<h3>Section Heading</h3> 
<h4>Sub Section</h4> 
<h5>Minor Heading</h5> 
<h6>Least Important Heading</h6>` 
          },
          { 
            title: 'Heading Hierarchy Example', 
            content: `<h1>Website Title</h1> 
<h2>Chapter Title</h2> 
<h3>Topic Name</h3>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>HTML Headings Example</title> 
</head> 
<body> 

    <h1>Learn HTML</h1> 

    <h2>Introduction</h2> 
    <p> 
        HTML is the foundation of web development and is used to structure 
        content on web pages. 
    </p> 

    <h2>HTML Headings</h2> 
    <p> 
        Headings help organize content into sections and improve readability. 
    </p> 

    <h3>Why Use Headings?</h3> 
    <p> 
        Headings make content easier to understand for users, browsers, 
        and search engines. 
    </p> 

    <h4>Best Practices</h4> 
    <p> 
        Always follow a proper heading hierarchy and use only one main heading. 
    </p> 

</body> 
</html>`
      },
      { 
        title: 'HTML Paragraphs and Text Formatting', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">HTML Paragraphs</h2>
          <p class="text-gray-300 mb-4">HTML paragraphs are used to display blocks of text on a web page. The <code>&lt;p&gt;</code> tag defines a paragraph and is one of the most commonly used HTML elements. Paragraphs help divide content into readable sections, making information easier to understand for users. When the browser encounters a <code>&lt;p&gt;</code> tag, it automatically adds space before and after the paragraph, improving readability without requiring additional styling.</p>
          
          <p class="text-gray-300 mb-4">Paragraphs are essential in blogs, articles, documentation, study materials, and learning platforms. Without paragraphs, all text would appear as a single continuous line, which would be difficult to read and visually unappealing.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">How Browsers Handle Paragraphs</h3>
          <p class="text-gray-300 mb-4">Browsers ignore extra spaces and line breaks in HTML code. Even if you press the Enter key multiple times in your editor, the browser will display text in a single line unless it is wrapped inside paragraph or line break tags. This is why the <code>&lt;p&gt;</code> tag is important—it tells the browser where a new paragraph starts and ends.</p>
          
          <p class="text-gray-300 mb-4">Each paragraph is treated as a separate block-level element, meaning it always starts on a new line and takes up the full width of its container.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Text Formatting in HTML</h3>
          <p class="text-gray-300 mb-4">Text formatting in HTML allows developers to emphasize, highlight, or modify text appearance to convey meaning. HTML provides specific tags for bold text, italic text, underlined text, highlighted text, and emphasized text. These tags are semantic, meaning they describe the importance or role of the text rather than just its appearance.</p>
          
          <p class="text-gray-300 mb-4">Using proper formatting improves clarity, helps readers focus on key points, and enhances accessibility. Screen readers use these tags to understand how content should be read aloud.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Common Text Formatting Tags</h3>
          <p class="text-gray-300 mb-4">HTML offers both physical and semantic formatting tags. Semantic tags are preferred because they provide meaning to the content. For example, <code>&lt;strong&gt;</code> indicates important text, while <code>&lt;em&gt;</code> indicates emphasized text. Although these tags may look similar to <code>&lt;b&gt;</code> and <code>&lt;i&gt;</code>, they carry additional meaning for accessibility tools and search engines.</p>
          
          <p class="text-gray-300 mb-4">Text formatting is widely used in study materials to highlight definitions, keywords, warnings, and important instructions.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Paragraphs and Formatting</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Always wrap text inside <code>&lt;p&gt;</code> tags</li>
              <li>Use formatting tags only when necessary</li>
              <li>Prefer semantic tags like <code>&lt;strong&gt;</code> and <code>&lt;em&gt;</code></li>
              <li>Avoid over-formatting text</li>
              <li>Use CSS for styling instead of HTML formatting tags</li>
          </ul>
          <p class="text-gray-300 mb-4">Following these best practices ensures clean, readable, and professional HTML content.</p>
        `,
        syntax: [
          { 
            title: 'Paragraph Syntax', 
            content: '<p>This is a paragraph of text.</p>' 
          },
          { 
            title: 'Line Break Syntax', 
            content: '<br>' 
          },
          { 
            title: 'Common Text Formatting Syntax', 
            content: `<b>Bold text</b> 
<strong>Important text</strong> 
<i>Italic text</i> 
<em>Emphasized text</em> 
<u>Underlined text</u> 
<mark>Highlighted text</mark>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>HTML Paragraphs and Text Formatting</title> 
</head> 
<body> 

    <h1>HTML Paragraphs and Formatting</h1> 

    <p> 
        HTML paragraphs are used to present text in a structured and readable 
        format. Each paragraph starts on a new line and creates space around 
        the text automatically. 
    </p> 

    <p> 
        Text formatting allows us to highlight <strong>important concepts</strong>, 
        add <em>emphasis</em> to certain words, and display 
        <mark>key points</mark> clearly in our content. 
    </p> 

    <p> 
        We can also use <b>bold</b>, <i>italic</i>, and <u>underlined</u> text 
        where necessary, but it is always recommended to use semantic tags 
        for better accessibility and clarity. 
    </p> 

</body> 
</html>`
      },
      { 
        title: 'HTML Links and Navigation', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">What Are HTML Links?</h2>
          <p class="text-gray-300 mb-4">HTML links, also known as hyperlinks, are used to connect one web page to another. Links are one of the most powerful features of the web because they allow users to navigate between pages, websites, documents, and different sections of the same page. The entire concept of the World Wide Web is built around hyperlinks.</p>
          
          <p class="text-gray-300 mb-4">In HTML, links are created using the <code>&lt;a&gt;</code> (anchor) tag. When users click a link, the browser loads the destination resource, which could be another webpage, an image, a video, a PDF file, or even an email application.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Importance of Links in Websites</h3>
          <p class="text-gray-300 mb-4">Links make websites interactive and connected. Without links, every webpage would exist in isolation. Navigation menus, buttons, breadcrumbs, and call-to-action elements all rely on links. In learning platforms and study materials, links are commonly used to navigate between lessons, modules, reference pages, and external resources.</p>
          
          <p class="text-gray-300 mb-4">Links also play a major role in search engine optimization (SEO). Search engines use links to discover new pages and understand how content is related. Well-structured internal linking improves page ranking and user experience.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types of HTML Links</h3>
          <p class="text-gray-300 mb-4">HTML supports several types of links based on their purpose:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>External Links</strong> – Navigate to another website</li>
              <li><strong>Internal Links</strong> – Navigate to another page within the same website</li>
              <li><strong>Anchor Links</strong> – Jump to a specific section of the same page</li>
              <li><strong>Email Links</strong> – Open the default email application</li>
              <li><strong>File Links</strong> – Download or open documents, images, or videos</li>
          </ul>
          <p class="text-gray-300 mb-4">Each type of link serves a different purpose but follows the same basic anchor tag structure.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">How Navigation Works Using Links</h3>
          <p class="text-gray-300 mb-4">Navigation menus are built using HTML links grouped together. These links allow users to move across different sections of a website smoothly. Proper navigation improves usability and ensures users can find information easily without confusion.</p>
          
          <p class="text-gray-300 mb-4">HTML links can be displayed as plain text, buttons, images, or menu items. While HTML defines the structure of links, CSS is used to style them, and JavaScript can add interactive behavior.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Target Attribute and User Experience</h3>
          <p class="text-gray-300 mb-4">The target attribute controls where a link opens. By default, links open in the same tab, but using <code>target="_blank"</code> opens the link in a new tab. This is useful when linking to external websites so users don’t lose their place on the current page.</p>
          
          <p class="text-gray-300 mb-4">Using link attributes properly improves user experience and keeps navigation intuitive.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Using Links</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use meaningful link text (avoid “click here”)</li>
              <li>Keep navigation simple and clear</li>
              <li>Use internal links to connect related content</li>
              <li>Open external links in a new tab when necessary</li>
              <li>Ensure links are accessible and readable</li>
          </ul>
          <p class="text-gray-300 mb-4">Following these practices ensures professional and user-friendly navigation.</p>
        `,
        syntax: [
          { 
            title: 'Basic Link Syntax', 
            content: '<a href="url">Link Text</a>' 
          },
          { 
            title: 'External Link Syntax', 
            content: '<a href="https://example.com" target="_blank">Visit Website</a>' 
          },
          { 
            title: 'Anchor Link Syntax', 
            content: '<a href="#section1">Go to Section</a>' 
          },
          { 
            title: 'Email Link Syntax', 
            content: '<a href="mailto:example@email.com">Send Email</a>' 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>HTML Links and Navigation</title> 
</head> 
<body> 

    <h1>HTML Navigation Example</h1> 

    <p> 
        HTML links allow users to move between pages and sections easily. 
        Below is a simple navigation menu created using anchor tags. 
    </p> 

    <nav> 
        <a href="index.html">Home</a> | 
        <a href="about.html">About</a> | 
        <a href="courses.html">Courses</a> | 
        <a href="contact.html">Contact</a> | 
        <a href="https://www.w3.org" target="_blank">W3C</a> 
    </nav> 

    <h2 id="section1">Navigation Section</h2> 
    <p> 
        Clicking navigation links helps users explore content efficiently. 
        External links open in a new tab to maintain user flow. 
    </p> 

</body> 
</html>`
      },
      { 
        title: 'HTML Lists (Ordered, Unordered, Description)', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to HTML Lists</h2>
          <p class="text-gray-300 mb-4">HTML lists are used to group related items together in a structured and readable format. Lists are commonly used in websites to display menus, instructions, features, steps, and collections of data. By using lists, content becomes easier to scan and understand, especially when presenting multiple points or sequences.</p>
          
          <p class="text-gray-300 mb-4">HTML provides three main types of lists: unordered lists, ordered lists, and description lists. Each type serves a specific purpose depending on how the information should be presented.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Unordered Lists</h3>
          <p class="text-gray-300 mb-4">Unordered lists are used when the order of items does not matter. These lists are displayed with bullet points by default. Unordered lists are commonly used for navigation menus, feature lists, and grouped items where sequence is not important.</p>
          
          <p class="text-gray-300 mb-4">An unordered list is created using the <code>&lt;ul&gt;</code> tag, and each item inside the list is defined using the <code>&lt;li&gt;</code> tag. Browsers automatically apply spacing and bullet symbols to list items, making them visually distinct and readable.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Ordered Lists</h3>
          <p class="text-gray-300 mb-4">Ordered lists are used when the sequence or order of items is important. These lists are displayed with numbers or letters. Ordered lists are commonly used for step-by-step instructions, rankings, procedures, and workflows.</p>
          
          <p class="text-gray-300 mb-4">Ordered lists use the <code>&lt;ol&gt;</code> tag, and like unordered lists, each item is placed inside an <code>&lt;li&gt;</code> tag. The browser automatically numbers the list items in the correct order.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Description Lists</h3>
          <p class="text-gray-300 mb-4">Description lists are used to display terms and their descriptions. They are especially useful for glossaries, definitions, FAQs, and study material explanations. Description lists differ from ordered and unordered lists because they do not use bullet points or numbers.</p>
          
          <p class="text-gray-300 mb-4">A description list uses the <code>&lt;dl&gt;</code> tag. Each term is defined using <code>&lt;dt&gt;</code> (description term), and its explanation is placed inside <code>&lt;dd&gt;</code> (description definition).</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Importance of Lists in Web Content</h3>
          <p class="text-gray-300 mb-4">Lists improve readability, organization, and user experience. They help users quickly understand grouped information and reduce cognitive load. In learning platforms and documentation, lists are essential for presenting steps, concepts, and structured knowledge clearly.</p>
          
          <p class="text-gray-300 mb-4">From an accessibility perspective, screen readers can interpret lists properly, allowing users to navigate content efficiently.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Using Lists</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use unordered lists when order does not matter</li>
              <li>Use ordered lists for sequences or steps</li>
              <li>Use description lists for definitions and explanations</li>
              <li>Avoid placing unnecessary content inside list items</li>
              <li>Use CSS for styling lists instead of modifying HTML structure</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Unordered List Syntax', 
            content: `<ul> 
    <li>Item One</li> 
    <li>Item Two</li> 
</ul>` 
          },
          { 
            title: 'Ordered List Syntax', 
            content: `<ol> 
    <li>Step One</li> 
    <li>Step Two</li> 
</ol>` 
          },
          { 
            title: 'Description List Syntax', 
            content: `<dl> 
    <dt>Term</dt> 
    <dd>Description</dd> 
</dl>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>HTML Lists Example</title> 
</head> 
<body> 

    <h1>HTML Lists</h1> 

    <h2>Unordered List</h2> 
    <ul> 
        <li>HTML</li> 
        <li>CSS</li> 
        <li>JavaScript</li> 
    </ul> 

    <h2>Ordered List</h2> 
    <ol> 
        <li>Learn HTML Basics</li> 
        <li>Practice CSS Styling</li> 
        <li>Add JavaScript Interactivity</li> 
    </ol> 

    <h2>Description List</h2> 
    <dl> 
        <dt>HTML</dt> 
        <dd>Markup language used to structure web pages.</dd> 

        <dt>CSS</dt> 
        <dd>Style sheet language used to design web pages.</dd> 

        <dt>JavaScript</dt> 
        <dd>Programming language used to add interactivity.</dd> 
    </dl> 

</body> 
</html>`
      },
      { 
        title: 'HTML Images and Media', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to HTML Images and Media</h2>
          <p class="text-gray-300 mb-4">Images and media play a vital role in modern web pages by making content more engaging, informative, and visually appealing. HTML allows developers to embed images, audio, and video directly into web pages using dedicated tags. In learning platforms and study materials, media elements help explain concepts more clearly and improve user engagement.</p>
          
          <p class="text-gray-300 mb-4">HTML separates content from presentation, meaning HTML defines what media appears on the page, while CSS controls how it looks. Proper use of media elements ensures faster loading, better accessibility, and a smoother user experience.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">HTML Images</h3>
          <p class="text-gray-300 mb-4">Images in HTML are added using the <code>&lt;img&gt;</code> tag. Unlike most HTML tags, the <code>&lt;img&gt;</code> tag is a self-closing tag, meaning it does not have a closing tag. Images can be used for logos, diagrams, illustrations, icons, and educational visuals.</p>
          
          <p class="text-gray-300 mb-4">Each image must have a source (src) attribute that specifies the image file location. The alt attribute provides alternative text that is displayed if the image cannot load and is also used by screen readers for accessibility. Providing meaningful alternative text is a best practice and improves search engine optimization.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Importance of Image Attributes</h3>
          <p class="text-gray-300 mb-4">HTML image attributes help control how images behave on a webpage. Width and height attributes define the size of the image and prevent layout shifts while the page loads. Proper sizing ensures that images fit well within the layout and maintain visual consistency.</p>
          
          <p class="text-gray-300 mb-4">Using descriptive file names and alt text improves both usability and accessibility. In educational content, this ensures that visually impaired users can still understand the purpose of images.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">HTML Video and Audio</h3>
          <p class="text-gray-300 mb-4">HTML5 introduced native support for video and audio, eliminating the need for external plugins. The <code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code> tags allow developers to embed multimedia content with built-in playback controls.</p>
          
          <p class="text-gray-300 mb-4">Videos are commonly used in online courses for tutorials, demonstrations, and explanations. To avoid display issues such as black screens or invisible players, it is important to specify video dimensions and enable controls.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Media Compatibility and Performance</h3>
          <p class="text-gray-300 mb-4">Different browsers support different media formats. HTML allows multiple <code>&lt;source&gt;</code> elements to ensure compatibility. Using optimized media files improves loading speed and reduces bandwidth usage, which is critical for mobile users and online learning platforms.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Using Images and Media</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Always use the alt attribute for images</li>
              <li>Define width and height for images and videos</li>
              <li>Use optimized media files</li>
              <li>Enable controls for audio and video</li>
              <li>Avoid autoplay for better user experience</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Image Tag Syntax', 
            content: '<img src="image.jpg" alt="Description of image" width="300">' 
          },
          { 
            title: 'Video Tag Syntax', 
            content: `<video width="640" height="360" controls> 
    <source src="video.mp4" type="video/mp4"> 
</video>` 
          },
          { 
            title: 'Audio Tag Syntax', 
            content: `<audio controls> 
    <source src="audio.mp3" type="audio/mpeg"> 
</audio>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>HTML Images and Media</title> 
</head> 
<body> 

    <h1>HTML Images and Media</h1> 

    <p> 
        Images and media enhance web content and improve the learning 
        experience by providing visual and interactive elements. 
    </p> 

    <h2>Image Example</h2> 
    <img src="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=300" alt="HTML learning illustration" width="300"> 

    <h2>Video Example</h2> 
    <video width="640" height="360" controls> 
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"> 
        Your browser does not support the video tag. 
    </video> 

</body> 
</html>`
      },
      { 
        title: 'HTML Tables', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to HTML Tables</h2>
          <p class="text-gray-300 mb-4">HTML tables are used to display data in rows and columns, making information easier to read, compare, and analyze. Tables are commonly used for presenting structured data such as schedules, price lists, student records, reports, and comparison charts. In online study materials, tables are especially useful for organizing facts, summaries, and reference information in a clear and compact format.</p>
          
          <p class="text-gray-300 mb-4">HTML tables focus on data presentation, not page layout. While tables were used for layout in older websites, modern web development uses CSS for layout and reserves tables strictly for displaying tabular data.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Structure of an HTML Table</h3>
          <p class="text-gray-300 mb-4">An HTML table is created using the <code>&lt;table&gt;</code> tag. Inside a table, data is organized into rows using the <code>&lt;tr&gt;</code> tag. Each row contains cells, which can be either header cells (<code>&lt;th&gt;</code>) or data cells (<code>&lt;td&gt;</code>).</p>
          
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><code>&lt;th&gt;</code> represents table headings and is usually displayed in bold</li>
              <li><code>&lt;td&gt;</code> represents regular table data</li>
              <li>Each row must have the same logical structure to maintain alignment</li>
          </ul>
          <p class="text-gray-300 mb-4">This structure allows browsers and assistive technologies to interpret table data accurately.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Table Headings and Data Meaning</h3>
          <p class="text-gray-300 mb-4">Table headings help users understand the meaning of each column or row. Proper use of headings improves readability and accessibility, especially for screen readers. In educational platforms, tables with clear headings make learning content easier to reference and revise.</p>
          
          <p class="text-gray-300 mb-4">HTML automatically centers and bolds header cells, but visual styling should be handled using CSS for consistency.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Importance of Tables in Study Material</h3>
          <p class="text-gray-300 mb-4">Tables help break down complex information into structured formats. They reduce cognitive load by allowing learners to compare values quickly. In technical education, tables are commonly used to explain syntax, attributes, differences, and summaries.</p>
          
          <p class="text-gray-300 mb-4">Using tables appropriately enhances clarity and professionalism in online course content.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Using Tables</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use tables only for tabular data</li>
              <li>Always include table headings</li>
              <li>Keep tables simple and readable</li>
              <li>Avoid excessive nesting</li>
              <li>Use CSS for styling instead of HTML attributes</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Basic Table Syntax', 
            content: `<table> 
    <tr> 
        <th>Heading</th> 
        <th>Heading</th> 
    </tr> 
    <tr> 
        <td>Data</td> 
        <td>Data</td> 
    </tr> 
</table>` 
          },
          { 
            title: 'Table Row and Cell Syntax', 
            content: `<tr>  <!-- Table Row --> 
    <th>Header Cell</th> 
    <td>Data Cell</td> 
</tr>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>HTML Tables Example</title> 
</head> 
<body> 

    <h1>HTML Tables</h1> 

    <p> 
        HTML tables are used to display structured data in rows and columns. 
        They are ideal for presenting information clearly and efficiently. 
    </p> 

    <table border="1"> 
        <tr> 
            <th>Technology</th> 
            <th>Purpose</th> 
            <th>Difficulty Level</th> 
        </tr> 
        <tr> 
            <td>HTML</td> 
            <td>Structure of web pages</td> 
            <td>Beginner</td> 
        </tr> 
        <tr> 
            <td>CSS</td> 
            <td>Styling and layout</td> 
            <td>Beginner</td> 
        </tr> 
        <tr> 
            <td>JavaScript</td> 
            <td>Interactivity</td> 
            <td>Intermediate</td> 
        </tr> 
    </table> 

</body> 
</html>`
      },
      { 
        title: 'HTML Forms and Input Elements', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to HTML Forms</h2>
          <p class="text-gray-300 mb-4">HTML forms are used to collect user input and send that data to a server for processing. Forms are one of the most important components of interactive websites. Almost every website uses forms in some way, such as login pages, registration forms, search bars, feedback forms, and contact forms.</p>
          
          <p class="text-gray-300 mb-4">Forms act as a bridge between the user and the backend system. HTML is responsible for creating the form structure, while backend technologies handle the data submitted through the form. In online learning platforms, forms are used for quizzes, assessments, feedback collection, and user authentication.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">How HTML Forms Work</h3>
          <p class="text-gray-300 mb-4">An HTML form is created using the <code>&lt;form&gt;</code> tag. Inside the form, various input elements are placed to collect different types of data. When a user submits the form, the browser sends the entered data to a specified server location using the method defined in the form.</p>
          
          <p class="text-gray-300 mb-4">Forms can send data using:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>GET method</strong> – Sends data through the URL (used for searches)</li>
              <li><strong>POST method</strong> – Sends data securely in the request body (used for sensitive data)</li>
          </ul>
          <p class="text-gray-300 mb-4">HTML defines the structure and type of input, while the server processes the submitted data.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Input Elements in HTML Forms</h3>
          <p class="text-gray-300 mb-4">HTML provides different input types to collect various kinds of data. Common input elements include text fields, password fields, email inputs, number inputs, radio buttons, checkboxes, dropdown lists, and submit buttons. Each input type ensures better validation and improves user experience.</p>
          
          <p class="text-gray-300 mb-4">For example, an email input ensures that users enter a valid email format, while a password input hides the entered text for security.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Labels and Accessibility</h3>
          <p class="text-gray-300 mb-4">The <code>&lt;label&gt;</code> tag is used to describe input fields. Labels improve accessibility by helping screen readers identify form fields correctly. Clicking on a label also focuses the associated input field, improving usability.</p>
          
          <p class="text-gray-300 mb-4">Using labels properly is a best practice and is especially important in educational platforms where clarity is essential.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Importance of Forms in Web Applications</h3>
          <p class="text-gray-300 mb-4">Forms make websites interactive and functional. Without forms, users would not be able to communicate with web applications. Forms enable login systems, surveys, payments, data entry, and user-generated content. In study materials and LMS platforms, forms support student interaction and evaluation.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for HTML Forms</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Always use labels for inputs</li>
              <li>Choose appropriate input types</li>
              <li>Use POST method for sensitive data</li>
              <li>Keep forms simple and user-friendly</li>
              <li>Validate inputs using HTML attributes</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Basic Form Syntax', 
            content: `<form action="server-url" method="post"> 
    <!-- form elements --> 
</form>` 
          },
          { 
            title: 'Common Input Syntax', 
            content: `<input type="text"> 
<input type="email"> 
<input type="password"> 
<input type="radio"> 
<input type="checkbox"> 
<input type="submit">` 
          },
          { 
            title: 'Label Syntax', 
            content: `<label for="inputId">Label Text</label>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>HTML Forms Example</title> 
</head> 
<body> 

    <h1>Student Registration Form</h1> 

    <p> 
        HTML forms are used to collect user input and submit data to a server. 
        Below is a simple example of a registration form. 
    </p> 

    <form action="#" method="post"> 

        <label for="name">Full Name:</label><br> 
        <input type="text" id="name" name="name" required><br><br> 

        <label for="email">Email Address:</label><br> 
        <input type="email" id="email" name="email" required><br><br> 

        <label for="password">Password:</label><br> 
        <input type="password" id="password" name="password" required><br><br> 

        <label>Course Interested:</label><br> 
        <input type="radio" name="course" value="HTML"> HTML<br> 
        <input type="radio" name="course" value="CSS"> CSS<br><br> 

        <label> 
            <input type="checkbox" required> 
            I agree to the terms and conditions 
        </label><br><br> 

        <input type="submit" value="Register"> 

    </form> 

</body> 
</html>`
      }
    ]
  },
  {
    id: 'module-2',
    title: 'CSS Module: Complete Styling Guide',
    duration: '25 min',
    description: 'Learn how to style your HTML documents.',
    lessons: [
      { 
        title: 'Introduction to CSS', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">What is CSS?</h2>
          <p class="text-gray-300 mb-4">CSS stands for Cascading Style Sheets. It is the language used to style and design HTML content. While HTML is responsible for the structure of a webpage, CSS controls how that structure looks. This includes colors, fonts, spacing, alignment, layouts, backgrounds, borders, and responsiveness.</p>
          
          <p class="text-gray-300 mb-4">Without CSS, websites would appear plain and unstructured, showing only raw text and basic elements. CSS transforms simple HTML pages into visually appealing, professional, and user-friendly websites.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Role of CSS in Web Development</h3>
          <p class="text-gray-300 mb-4">CSS plays a critical role in separating content from presentation. This separation allows developers to change the design of a website without modifying its HTML structure. By using CSS, the same HTML page can look completely different across various devices and screen sizes.</p>
          
          <p class="text-gray-300 mb-4">In modern web development, CSS is essential for:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Designing layouts</li>
              <li>Improving user experience</li>
              <li>Making websites responsive</li>
              <li>Maintaining consistency across pages</li>
          </ul>
          <p class="text-gray-300 mb-4">CSS works alongside HTML and JavaScript to build complete web applications.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">How CSS Works</h3>
          <p class="text-gray-300 mb-4">CSS works by selecting HTML elements and applying styles to them. These styles are written as rules, which consist of a selector and a declaration block. The selector identifies which HTML element to style, and the declaration block defines how that element should appear.</p>
          
          <p class="text-gray-300 mb-4">The browser reads HTML first, then applies CSS rules to it. If multiple CSS rules apply to the same element, the browser follows specific priority rules, known as the cascade, to decide which style to apply.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Why CSS is Important</h3>
          <p class="text-gray-300 mb-4">CSS improves:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Visual design</strong> – makes pages attractive</li>
              <li><strong>Readability</strong> – improves spacing and typography</li>
              <li><strong>Accessibility</strong> – supports better content presentation</li>
              <li><strong>Maintainability</strong> – easy updates and consistency</li>
              <li><strong>Performance</strong> – reduces duplicate HTML formatting</li>
          </ul>
          <p class="text-gray-300 mb-4">In online learning platforms, CSS ensures that lessons, videos, tables, and forms are presented in a clean and distraction-free manner.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">CSS and Responsive Design</h3>
          <p class="text-gray-300 mb-4">CSS allows developers to design websites that work well on desktops, tablets, and mobile phones. Using flexible layouts and styling rules, CSS adapts content to different screen sizes, ensuring a smooth learning experience across devices.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Using CSS</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Keep CSS separate from HTML</li>
              <li>Use meaningful class names</li>
              <li>Avoid inline styling when possible</li>
              <li>Maintain consistent design rules</li>
              <li>Write clean and reusable styles</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Basic CSS Syntax', 
            content: `selector { 
    property: value; 
}` 
          },
          { 
            title: 'Example of a CSS Rule', 
            content: `p { 
    color: blue; 
    font-size: 16px; 
}` 
          },
          { 
            title: 'Common CSS Properties', 
            content: `color 
background-color 
font-size 
margin 
padding 
border` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Introduction to CSS</title> 
    <style> 
        body { 
            font-family: Arial, sans-serif; 
            background-color: #f4f4f4; 
        } 

        h1 { 
            color: #2c3e50; 
            text-align: center; 
        } 

        p { 
            color: #333; 
            font-size: 16px; 
            background-color: #ffffff; 
            padding: 15px; 
            border-radius: 5px; 
        } 
    </style> 
</head> 
<body> 

    <h1>Introduction to CSS</h1> 

    <p> 
        CSS is used to style HTML elements and make web pages visually 
        attractive. It controls colors, fonts, spacing, and layout. 
    </p> 

</body> 
</html>`
      },
      { 
        title: 'Inline CSS', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">What is Inline CSS?</h2>
          <p class="text-gray-300 mb-4">Inline CSS is a method of applying CSS styles directly inside an HTML element using the <code>style</code> attribute. This approach allows developers to apply styles to a specific element without affecting other elements on the page. Inline CSS is written within the opening tag of an HTML element and consists of CSS property–value pairs.</p>
          
          <p class="text-gray-300 mb-4">Inline CSS is the simplest and most direct way to style an element, as it does not require a separate CSS file or a <code>&lt;style&gt;</code> block. When the browser reads the HTML, it applies the inline styles immediately to the element.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">How Inline CSS Works</h3>
          <p class="text-gray-300 mb-4">Inline CSS works by attaching CSS rules directly to an element using the <code>style</code> attribute. Each property and value is separated by a colon, and multiple properties are separated by semicolons. These styles apply only to the element where they are defined.</p>
          
          <p class="text-gray-300 mb-4">Inline styles have the highest priority among CSS styles. This means they override internal and external CSS rules. Because of this behavior, inline CSS can be useful for quick testing or specific overrides.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">When to Use Inline CSS</h3>
          <p class="text-gray-300 mb-4">Inline CSS is useful in limited situations, such as:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Quick testing or debugging</li>
              <li>Applying a unique style to a single element</li>
              <li>Dynamic styling generated by JavaScript</li>
              <li>Email templates where external CSS is not supported</li>
          </ul>
          <p class="text-gray-300 mb-4">However, inline CSS is not recommended for large projects or learning platforms due to poor maintainability and code repetition.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Limitations of Inline CSS</h3>
          <p class="text-gray-300 mb-4">While inline CSS is easy to use, it has several drawbacks. It mixes content and design, making HTML code cluttered and harder to maintain. Reusing styles becomes difficult, and updating the design requires editing multiple elements individually. Inline CSS also increases page size and reduces consistency across pages.</p>
          
          <p class="text-gray-300 mb-4">For professional projects and study platforms, internal or external CSS is preferred.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Inline CSS</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use inline CSS sparingly</li>
              <li>Avoid using it for large-scale styling</li>
              <li>Do not use inline CSS for layouts</li>
              <li>Prefer internal or external CSS for maintainability</li>
              <li>Use inline styles mainly for testing or exceptions</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Inline CSS Syntax', 
            content: `<tag style="property: value;"> 
    Content 
</tag>` 
          },
          { 
            title: 'Example Inline Style', 
            content: `<p style="color: red; font-size: 18px;"> 
    This is styled using inline CSS. 
</p>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Inline CSS Example</title> 
</head> 
<body> 

    <h1 style="color: blue; text-align: center;"> 
        Inline CSS Demonstration 
    </h1> 

    <p style="color: #333; font-size: 16px; background-color: #f2f2f2; padding: 15px;"> 
        Inline CSS is applied directly within an HTML element using the 
        style attribute. It affects only the element where it is used 
        and has the highest priority among CSS types. 
    </p> 

</body> 
</html>`
      },
      { 
        title: 'Internal CSS', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">What is Internal CSS?</h2>
          <p class="text-gray-300 mb-4">Internal CSS is a method of applying styles to a web page by placing CSS rules inside the <code>&lt;style&gt;</code> tag within the <code>&lt;head&gt;</code> section of an HTML document. Internal CSS allows developers to style multiple elements on a single page using a centralized set of CSS rules, without creating an external stylesheet.</p>
          
          <p class="text-gray-300 mb-4">This approach is especially useful when a page requires unique styling that does not need to be reused across multiple pages. Internal CSS keeps all styling rules within the same HTML file, making it easy to manage page-specific designs.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">How Internal CSS Works</h3>
          <p class="text-gray-300 mb-4">When a browser loads an HTML document, it first reads the <code>&lt;head&gt;</code> section. If it finds a <code>&lt;style&gt;</code> tag, it processes the CSS rules written inside it and applies them to the matching HTML elements in the <code>&lt;body&gt;</code>.</p>
          
          <p class="text-gray-300 mb-4">Internal CSS uses selectors (such as element selectors, class selectors, and ID selectors) to target HTML elements. All matching elements are styled consistently across the page, improving uniformity and readability.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Advantages of Internal CSS</h3>
          <p class="text-gray-300 mb-4">Internal CSS provides better organization than inline CSS because styles are separated from individual elements. It reduces code repetition and makes it easier to apply consistent design rules across a page. For learning platforms and study materials, internal CSS is useful when styling lesson pages that do not share styles with other modules.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Limitations of Internal CSS</h3>
          <p class="text-gray-300 mb-4">Although internal CSS improves maintainability compared to inline CSS, it is still limited to a single page. If multiple pages use the same styles, internal CSS leads to duplication. It also increases the size of the HTML file and makes global design updates more difficult.</p>
          
          <p class="text-gray-300 mb-4">For larger websites and applications, external CSS is the preferred solution.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">CSS Priority and Internal Styles</h3>
          <p class="text-gray-300 mb-4">Internal CSS has lower priority than inline CSS but higher priority than external CSS (when selectors have the same specificity). Understanding CSS priority helps developers predict how styles are applied and avoid conflicts.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for Internal CSS</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use internal CSS for page-specific styling</li>
              <li>Keep CSS rules well-organized</li>
              <li>Use classes instead of styling elements directly</li>
              <li>Avoid mixing inline and internal styles</li>
              <li>Move styles to external CSS when scaling the project</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Internal CSS Syntax', 
            content: `<head> 
    <style> 
        selector { 
            property: value; 
        } 
    </style> 
</head>` 
          },
          { 
            title: 'Example Internal CSS Rule', 
            content: `<style> 
    p { 
        color: green; 
        font-size: 16px; 
    } 
</style>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Internal CSS Example</title> 
    <style> 
        body { 
            font-family: Arial, sans-serif; 
            background-color: #f5f5f5; 
        } 

        h1 { 
            color: #2c3e50; 
            text-align: center; 
        } 

        p { 
            color: #333; 
            background-color: #ffffff; 
            padding: 15px; 
            border-radius: 5px; 
        } 
    </style> 
</head> 
<body> 

    <h1>Internal CSS</h1> 

    <p> 
        Internal CSS is defined inside the style tag in the head section 
        of an HTML document. It allows consistent styling across a single page. 
    </p> 

</body> 
</html>`
      },
      { 
        title: 'External CSS', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">What is External CSS?</h2>
          <p class="text-gray-300 mb-4">External CSS is a method of styling web pages by writing all CSS rules in a separate <code>.css</code> file and linking that file to one or more HTML documents. This is the most professional and industry-standard approach to styling websites because it allows complete separation of content (HTML) and design (CSS).</p>
          
          <p class="text-gray-300 mb-4">Using external CSS, a single stylesheet can control the appearance of multiple web pages, ensuring design consistency across an entire website or application.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">How External CSS Works</h3>
          <p class="text-gray-300 mb-4">In external CSS, styles are written in a <code>.css</code> file using standard CSS syntax. This file is then connected to an HTML document using the <code>&lt;link&gt;</code> tag inside the <code>&lt;head&gt;</code> section.</p>
          
          <p class="text-gray-300 mb-4">When the browser loads a web page, it first reads the HTML, then fetches the linked CSS file, and finally applies the styles to all matching elements. This process allows efficient rendering and easier maintenance.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Advantages of External CSS</h3>
          <p class="text-gray-300 mb-4">External CSS offers excellent maintainability and scalability. Any design change made in the CSS file is automatically reflected across all linked pages. It also keeps HTML files clean and readable.</p>
          
          <p class="text-gray-300 mb-4">Because browsers cache CSS files, external CSS improves page load performance for multi-page websites.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Limitations of External CSS</h3>
          <p class="text-gray-300 mb-4">External CSS requires an additional HTTP request to load the stylesheet. If the CSS file fails to load, the page may appear unstyled. However, these drawbacks are minimal compared to its benefits and are easily managed in modern web development.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">CSS Priority and External Styles</h3>
          <p class="text-gray-300 mb-4">External CSS has lower priority than internal and inline CSS when selectors have the same specificity. However, proper selector usage and clean architecture usually eliminate priority conflicts.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices for External CSS</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use meaningful class names</li>
              <li>Organize styles logically</li>
              <li>Avoid inline styles</li>
              <li>Reuse styles across pages</li>
              <li>Use comments for clarity</li>
              <li>Minimize and compress CSS for production</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Linking External CSS to HTML', 
            content: `<head> 
    <link rel="stylesheet" href="styles.css"> 
</head>` 
          },
          { 
            title: 'External CSS File Syntax (styles.css)', 
            content: `selector { 
    property: value; 
}` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>External CSS Example</title> 
    <style> 
        /* In a real scenario, this would be in styles.css */
        body { 
            font-family: Arial, sans-serif; 
            background-color: #eef2f3; 
        } 

        h1 { 
            color: #1a5276; 
            text-align: center; 
        } 

        p { 
            background-color: white; 
            padding: 15px; 
            border-radius: 5px; 
            color: #333; 
        }
    </style> 
</head> 
<body> 

    <h1>External CSS</h1> 

    <p> 
        External CSS allows styling multiple pages using one stylesheet. 
        It is the best practice for large websites. 
    </p> 

</body> 
</html>`
      },
      { 
        title: 'CSS Selectors (Element, Class, ID)', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to CSS Selectors</h2>
          <p class="text-gray-300 mb-4">CSS selectors are the foundation of styling in CSS. They determine which HTML elements the styles will apply to. Using selectors effectively allows developers to style specific elements without affecting others. By understanding different selector types, you can write cleaner and more efficient CSS.</p>
          
          <p class="text-gray-300 mb-4">There are several ways to select elements:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Element selectors target all instances of a specific tag.</li>
              <li>Class selectors allow you to style multiple elements that share the same class.</li>
              <li>ID selectors target a unique element on the page.</li>
          </ul>
          <p class="text-gray-300 mb-4">Selectors can also be combined to apply more precise styling. Understanding how and when to use each type is essential for creating maintainable, professional web designs.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types of CSS Selectors</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Element Selector</strong> – Targets all occurrences of a particular HTML tag.</li>
              <li><strong>Class Selector</strong> – Targets elements with a specific class attribute; reusable across multiple elements.</li>
              <li><strong>ID Selector</strong> – Targets a unique element using the <code>id</code> attribute; used only once per page.</li>
          </ul>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Class selectors are prefixed with a dot (<code>.</code>)</li>
              <li>ID selectors are prefixed with a hash (<code>#</code>)</li>
              <li>Element selectors use the tag name directly</li>
              <li>Using selectors properly ensures a clear hierarchy and prevents conflicts</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Element Selector', 
            content: `p { 
    color: blue; 
    font-size: 16px; 
}` 
          },
          { 
            title: 'Class Selector', 
            content: `.highlight { 
    background-color: yellow; 
}` 
          },
          { 
            title: 'ID Selector', 
            content: `#main-title { 
    text-align: center; 
    color: green; 
}` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>CSS Selectors Example</title> 
    <style> 
        /* Element Selector */ 
        p { 
            font-size: 16px; 
            color: #333; 
        } 

        /* Class Selector */ 
        .highlight { 
            background-color: #ffeb3b; 
            padding: 5px; 
        } 

        /* ID Selector */ 
        #main-title { 
            color: #1a5276; 
            text-align: center; 
            font-size: 24px; 
        } 
    </style> 
</head> 
<body> 

    <h1 id="main-title">CSS Selectors</h1> 

    <p>This paragraph uses the element selector.</p> 

    <p class="highlight">This paragraph is highlighted using a class selector.</p> 

</body> 
</html>`
      },
      { 
        title: 'CSS Colors and Typography', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to CSS Colors and Typography</h2>
          <p class="text-gray-300 mb-4">CSS allows you to control the appearance of text and colors on a webpage, which plays a critical role in readability, branding, and user experience. Using colors effectively can draw attention to key elements, create visual hierarchy, and enhance aesthetics. Typography, including font selection, size, weight, and style, ensures that content is legible and visually consistent.</p>
          
          <p class="text-gray-300 mb-4">Proper use of colors and typography is essential in web design. Poor color combinations or inconsistent fonts can make a website look unprofessional and reduce readability. CSS provides a wide range of options, including named colors, hex codes, RGB, RGBA, HSL, and even gradients. Similarly, CSS offers numerous properties to style text, such as font-family, font-size, font-weight, line-height, and text-transform.</p>
          
          <p class="text-gray-300 mb-4">By mastering CSS colors and typography, you can create visually appealing, easy-to-read, and professional-looking web pages that enhance the overall user experience.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Key Types/Properties</h3>
          
          <h4 class="text-lg font-semibold text-white mb-2">Colors</h4>
          <p class="text-gray-300 mb-2">Can be applied to text, backgrounds, borders, and other elements. Methods include:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Named colors:</strong> red, blue, green</li>
              <li><strong>Hex codes:</strong> #ff0000, #00ff00</li>
              <li><strong>RGB/RGBA:</strong> rgb(255,0,0) or rgba(255,0,0,0.5)</li>
              <li><strong>HSL/HSLA:</strong> hsl(0, 100%, 50%)</li>
          </ul>

          <h4 class="text-lg font-semibold text-white mb-2">Typography</h4>
          <p class="text-gray-300 mb-2">Controls the look of text. Important properties:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>font-family:</strong> sets the typeface</li>
              <li><strong>font-size:</strong> defines the size of the text</li>
              <li><strong>font-weight:</strong> makes text bold or light</li>
              <li><strong>line-height:</strong> adjusts spacing between lines</li>
              <li><strong>text-transform:</strong> capitalizes or uppercases text</li>
              <li><strong>letter-spacing:</strong> controls spacing between characters</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Best Practices</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use readable fonts</li>
              <li>Ensure sufficient contrast between text and background</li>
              <li>Avoid using too many font families on a single page</li>
              <li>Use consistent typography across the website</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'CSS Color Syntax', 
            content: `p { 
    color: #1a5276; /* Text color */ 
    background-color: rgb(240, 240, 240); /* Background color */ 
}` 
          },
          { 
            title: 'CSS Typography Syntax', 
            content: `h1 { 
    font-family: Arial, sans-serif; 
    font-size: 32px; 
    font-weight: bold; 
    line-height: 1.5; 
    text-transform: uppercase; 
}` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>CSS Colors and Typography</title> 
    <style> 
        body { 
            background-color: #f0f0f0; 
            font-family: 'Verdana', sans-serif; 
        } 

        h1 { 
            color: #2c3e50; 
            font-size: 36px; 
            font-weight: bold; 
            text-align: center; 
        } 

        p { 
            color: #555; 
            font-size: 16px; 
            line-height: 1.6; 
            margin: 20px; 
            background-color: #ffffff; 
            padding: 15px; 
            border-radius: 5px; 
        } 

        .highlight { 
            color: #e74c3c; 
            font-weight: bold; 
            text-transform: uppercase; 
        } 
    </style> 
</head> 
<body> 

    <h1>CSS Colors and Typography</h1> 

    <p>This paragraph demonstrates standard text styling with proper font size, line height, and background color.</p> 

    <p class="highlight">This highlighted text uses class selectors for color and typography effects.</p> 

</body> 
</html>`
      }
    ]
  },
  {
    id: 'module-3',
    title: 'CSS Advanced: Layout & Responsive Design',
    duration: '10 min',
    description: 'Advanced CSS concepts.',
    lessons: [
      { 
        title: 'CSS Box Model and Layout', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">The CSS Box Model</h2>
          <p class="text-gray-300 mb-4">The CSS Box Model is a fundamental concept in web design that defines how every HTML element is rendered on a webpage. Every element on a page is essentially a rectangular box consisting of four parts: content, padding, border, and margin. Understanding the box model is essential for controlling spacing, sizing, and layout in CSS.</p>
          
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Content</strong> is the actual text, image, or media inside the box.</li>
              <li><strong>Padding</strong> is the space between the content and the border.</li>
              <li><strong>Border</strong> surrounds the padding and content, providing visual separation.</li>
              <li><strong>Margin</strong> is the outermost layer, creating space between elements.</li>
          </ul>

          <p class="text-gray-300 mb-4">By mastering the box model, developers can precisely control element sizes, spacing, alignment, and visual structure, which is crucial for creating clean, professional layouts.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types/Sections of Box Model</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Content</strong> – The actual element content (text, image, video).</li>
              <li><strong>Padding</strong> – Clears space inside the element, between content and border.</li>
              <li><strong>Border</strong> – Wraps the padding and content, can be styled (solid, dashed, etc.).</li>
              <li><strong>Margin</strong> – External spacing, separates elements from each other.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Layout Concepts</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Block vs Inline Elements:</strong> Block elements take the full width, inline elements take only as much width as content.</li>
              <li><strong>Width and Height:</strong> Can be controlled, but padding and border add extra space unless <code>box-sizing: border-box</code> is used.</li>
              <li><strong>Overflow:</strong> Determines how content behaves when it exceeds the box size (visible, hidden, scroll).</li>
              <li><strong>Box-sizing:</strong> <code>content-box</code> vs <code>border-box</code> changes whether padding and border are included in width/height.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'CSS Box Model Syntax', 
            content: `div { 
    width: 300px;      /* content width */ 
    padding: 20px;     /* inner spacing */ 
    border: 5px solid black; /* border width and style */ 
    margin: 15px;      /* spacing outside the element */ 
    box-sizing: border-box; /* include padding and border in width */ 
}` 
          },
          { 
            title: 'Display and Layout Basics', 
            content: `.block { 
    display: block;   /* block-level element */ 
} 

.inline { 
    display: inline;  /* inline element */ 
}` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>CSS Box Model Example</title> 
    <style> 
        .box { 
            width: 300px; 
            padding: 20px; 
            border: 5px solid #2c3e50; 
            margin: 30px auto; 
            background-color: #ecf0f1; 
            box-sizing: border-box; 
            text-align: center; 
        } 

        p { 
            margin: 10px 0; 
            font-size: 16px; 
            color: #34495e; 
        } 
    </style> 
</head> 
<body> 

    <div class="box"> 
        <p>Content Area</p> 
        <p>Padding adds space inside the box.</p> 
        <p>Border surrounds the padding and content.</p> 
        <p>Margin creates space outside the box.</p> 
    </div> 

</body> 
</html>`
      },
      { 
        title: 'Responsive Design Basics', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Responsive Design Basics</h2>
          <p class="text-gray-300 mb-4">Responsive web design ensures that a website adapts seamlessly to different screen sizes and devices, including desktops, tablets, and smartphones. With the variety of devices today, creating flexible layouts is essential for a good user experience. CSS provides tools like media queries, flexible grids, and relative units to make pages responsive.</p>
          
          <p class="text-gray-300 mb-4">Responsive design is not just about shrinking elements to fit smaller screens. It’s about maintaining readability, usability, and visual hierarchy across devices. Proper implementation improves engagement, accessibility, and SEO performance.</p>

          <p class="text-gray-300 mb-4">Key principles include fluid layouts, scalable images, and flexible typography. By mastering responsive design basics, developers can create websites that look professional and function perfectly on any device.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types/Concepts of Responsive Design</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Fluid Layouts</strong> – Uses percentage widths instead of fixed pixels to allow elements to scale naturally.</li>
              <li><strong>Flexible Images</strong> – Images resize based on the container size to prevent overflow or distortion.</li>
              <li><strong>Media Queries</strong> – CSS rules that apply only under certain conditions (e.g., screen width).</li>
              <li><strong>Viewport Meta Tag</strong> – Ensures mobile browsers render the page correctly with proper scaling.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use relative units (%, em, rem) instead of absolute units (px) for flexible layouts.</li>
              <li>Test designs on multiple devices or browser developer tools.</li>
              <li>Combine responsive grids with CSS Flexbox or Grid for professional layouts.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Media Query Syntax', 
            content: `@media (max-width: 768px) { 
    selector { 
        property: value; 
    } 
}` 
          },
          { 
            title: 'Viewport Meta Tag', 
            content: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` 
          },
          { 
            title: 'Example: Flexible Image', 
            content: `img { 
    max-width: 100%; 
    height: auto; 
}` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Responsive Design Example</title> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <style> 
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
        } 

        .container { 
            width: 80%; 
            margin: auto; 
            background-color: #ecf0f1; 
            padding: 20px; 
        } 

        img { 
            max-width: 100%; 
            height: auto; 
        } 

        h1 { 
            color: #2c3e50; 
            text-align: center; 
        } 

        p { 
            color: #34495e; 
            font-size: 16px; 
        } 

        /* Responsive Layout for small screens */ 
        @media (max-width: 600px) { 
            .container { 
                width: 95%; 
                padding: 10px; 
            } 

            p { 
                font-size: 14px; 
            } 
        } 
    </style> 
</head> 
<body> 

    <div class="container"> 
        <h1>Responsive Design Basics</h1> 
        <img src="https://via.placeholder.com/600x300" alt="Responsive Example"> 
        <p> 
            This container and image resize according to the screen width. 
            Text and elements adjust to maintain readability and layout. 
        </p> 
    </div> 

</body> 
</html>`
      }
    ]
  },
  {
    id: 'module-4',
    title: 'JavaScript Module: Complete Programming Guide',
    duration: '25 min',
    description: 'Learn to program the behavior of web pages.',
    lessons: [
      { 
        title: 'Introduction to JavaScript', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to JavaScript</h2>
          <p class="text-gray-300 mb-4">JavaScript (JS) is a high-level, interpreted programming language that adds interactivity and dynamic behavior to web pages. Unlike HTML and CSS, which control structure and styling, JavaScript allows web pages to respond to user actions, modify content in real-time, and communicate with servers.</p>
          
          <p class="text-gray-300 mb-4">JavaScript runs directly in the browser, which makes it essential for front-end development. It is used for tasks like validating forms, creating animations, handling events, and updating web page content without reloading. With the rise of Node.js, JavaScript can also be used on the server side, making it a full-stack language.</p>

          <p class="text-gray-300 mb-4">Learning JavaScript is critical for anyone aiming to build interactive web applications, dynamic dashboards, or modern websites. By understanding JS fundamentals, you gain the ability to make your web pages responsive, intelligent, and user-friendly.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types/Concepts of JavaScript</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Variables and Data Types</strong> – Store information in memory (e.g., numbers, strings, booleans).</li>
              <li><strong>Functions</strong> – Blocks of reusable code to perform tasks.</li>
              <li><strong>Events</strong> – Actions that happen on the page (e.g., clicks, mouse movement).</li>
              <li><strong>DOM Manipulation</strong> – Allows modifying HTML and CSS using JS.</li>
              <li><strong>Control Structures</strong> – Logic like if-else and loops to control behavior.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>JavaScript code can be added inline, internally within <code>&lt;script&gt;</code> tags, or externally using <code>.js</code> files.</li>
              <li>JS is case-sensitive, meaning <code>Variable</code> and <code>variable</code> are different.</li>
              <li>Always place <code>&lt;script&gt;</code> tags at the bottom of <code>&lt;body&gt;</code> or use <code>defer</code> in <code>&lt;head&gt;</code> to avoid blocking HTML rendering.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Basic JavaScript Syntax', 
            content: `// Single line comment 
/* Multi-line comment */ 

let message = "Hello, JavaScript!"; 
console.log(message); // Output to console` 
          },
          { 
            title: 'Function Syntax', 
            content: `function greet(name) { 
    alert("Hello, " + name + "!"); 
}` 
          },
          { 
            title: 'Event Handler Example', 
            content: `<button onclick="greet('John')">Click Me</button>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Introduction to JavaScript</title> 
</head> 
<body> 

    <h1>JavaScript Basics</h1> 
    <p id="demo">This text will change when you click the button.</p> 

    <button onclick="changeText()">Click Me!</button> 

    <script> 
        // Function to change the paragraph text 
        function changeText() { 
            document.getElementById("demo").innerHTML = "Hello! You clicked the button."; 
        } 

        // Simple console log 
        let greeting = "Welcome to JavaScript!"; 
        console.log(greeting); 
    </script> 

</body> 
</html>`
      },
      { 
        title: 'JavaScript Variables and Data Types', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to JavaScript Variables and Data Types</h2>
          <p class="text-gray-300 mb-4">In JavaScript, variables are containers used to store data values, which can be later accessed or modified. A variable is essentially a name that references a value in memory. JavaScript provides different ways to declare variables: <code>var</code>, <code>let</code>, and <code>const</code>. Choosing the right type of declaration is important for scope, mutability, and code maintainability.</p>
          
          <p class="text-gray-300 mb-4">JavaScript also supports several data types, which define the type of value a variable can hold. Data types are divided into primitive types like numbers, strings, booleans, null, undefined, symbols, and non-primitive types like objects and arrays. Understanding data types is critical because it determines how values behave during operations, comparisons, and functions.</p>

          <p class="text-gray-300 mb-4">Proper use of variables and data types forms the foundation for writing clean, efficient, and bug-free code.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types/Concepts of Variables and Data Types</h3>
          
          <h4 class="text-lg font-semibold text-white mb-2">Variable Declarations:</h4>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>var</strong> – Function-scoped, can be redeclared</li>
              <li><strong>let</strong> – Block-scoped, can be reassigned</li>
              <li><strong>const</strong> – Block-scoped, cannot be reassigned</li>
          </ul>

          <h4 class="text-lg font-semibold text-white mb-2">Primitive Data Types:</h4>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Number</strong> – Numeric values (e.g., 10, 3.14)</li>
              <li><strong>String</strong> – Text values (e.g., "Hello")</li>
              <li><strong>Boolean</strong> – true or false</li>
              <li><strong>Null</strong> – Represents intentional absence of value</li>
              <li><strong>Undefined</strong> – Declared but not assigned</li>
              <li><strong>Symbol</strong> – Unique identifiers</li>
          </ul>

          <h4 class="text-lg font-semibold text-white mb-2">Non-Primitive Data Types:</h4>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Object</strong> – Key-value pairs</li>
              <li><strong>Array</strong> – List of values</li>
          </ul>

          <h4 class="text-lg font-semibold text-white mb-2">Dynamic Typing:</h4>
          <p class="text-gray-300 mb-4">Variables in JavaScript are dynamically typed, meaning the type can change at runtime.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Always use meaningful variable names</li>
              <li>Prefer <code>let</code> and <code>const</code> over <code>var</code> for modern JS</li>
              <li>Be aware of type coercion when performing operations</li>
              <li>Primitive types are immutable, objects and arrays are mutable</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Declaring Variables', 
            content: `// Using let 
let name = "John"; 

// Using const 
const pi = 3.14; 

// Using var 
var age = 25;` 
          },
          { 
            title: 'Data Type Examples', 
            content: `let number = 100;         // Number 
let text = "Hello JS";    // String 
let flag = true;          // Boolean 
let emptyValue = null;    // Null 
let notDefined;           // Undefined 
let numbers = [1,2,3];    // Array 
let person = {name: "Alice", age: 30}; // Object` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>JavaScript Variables and Data Types</title> 
</head> 
<body> 

    <h1>JavaScript Variables and Data Types</h1> 

    <p id="demo"></p> 

    <script> 
        // Variable declarations 
        let name = "Alice"; 
        const age = 25; 
        var isStudent = true; 

        // Array and Object 
        let fruits = ["Apple", "Banana", "Mango"]; 
        let person = {firstName: "Alice", lastName: "Smith"}; 

        // Display in the paragraph 
        document.getElementById("demo").innerHTML = 
            "Name: " + name + "<br>" + 
            "Age: " + age + "<br>" + 
            "Is Student: " + isStudent + "<br>" + 
            "First Fruit: " + fruits[0] + "<br>" + 
            "Full Name: " + person.firstName + " " + person.lastName; 
    </script> 

</body> 
</html>`
      },
      { 
        title: 'JavaScript Functions', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to JavaScript Functions</h2>
          <p class="text-gray-300 mb-4">Functions in JavaScript are blocks of reusable code designed to perform a specific task. They help reduce code repetition, improve readability, and make programs modular. Functions can accept input parameters, perform operations, and optionally return a result.</p>
          
          <p class="text-gray-300 mb-4">A well-structured function allows developers to encapsulate logic and reuse it multiple times, which is essential in professional development. Functions can be defined in several ways, including function declarations, function expressions, and arrow functions introduced in ES6. They can also be anonymous or named, and JavaScript functions are first-class citizens, meaning they can be assigned to variables, passed as arguments, or returned from other functions.</p>

          <p class="text-gray-300 mb-4">Understanding functions is fundamental for building interactive, maintainable, and scalable web applications.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types/Concepts of Functions</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Function Declaration</strong> – Standard named function.</li>
              <li><strong>Function Expression</strong> – Function assigned to a variable.</li>
              <li><strong>Arrow Function</strong> – Shorter syntax introduced in ES6.</li>
              <li><strong>Parameters & Arguments</strong> – Inputs passed to functions.</li>
              <li><strong>Return Statement</strong> – Outputs a value from the function.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Functions promote code reusability and modularity.</li>
              <li>Always give meaningful names to functions.</li>
              <li>Functions can access global variables but should minimize side effects.</li>
              <li>Arrow functions are often used for concise code in modern JS.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Function Declaration', 
            content: `function greet(name) { 
    return "Hello, " + name + "!"; 
}` 
          },
          { 
            title: 'Function Expression', 
            content: `const greet = function(name) { 
    return "Hello, " + name + "!"; 
};` 
          },
          { 
            title: 'Arrow Function', 
            content: `const greet = (name) => "Hello, " + name + "!";` 
          },
          { 
            title: 'Calling a Function', 
            content: `let message = greet("Alice"); 
console.log(message);` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>JavaScript Functions Example</title> 
</head> 
<body> 

    <h1>JavaScript Functions</h1> 
    <p id="demo"></p> 

    <script> 
        // Function Declaration 
        function addNumbers(a, b) { 
            return a + b; 
        } 

        // Function Expression 
        const multiplyNumbers = function(a, b) { 
            return a * b; 
        }; 

        // Arrow Function 
        const greet = (name) => "Hello, " + name + "!"; 

        // Using the functions 
        let sum = addNumbers(5, 10); 
        let product = multiplyNumbers(5, 10); 
        let message = greet("Alice"); 

        document.getElementById("demo").innerHTML = 
            "Sum: " + sum + "<br>" + 
            "Product: " + product + "<br>" + 
            message; 
    </script> 

</body> 
</html>`
      },
      { 
        title: 'DOM Manipulation', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to DOM Manipulation</h2>
          <p class="text-gray-300 mb-4">The Document Object Model (DOM) is a structured representation of an HTML document. Every element, attribute, and piece of text in an HTML page becomes a node in this structure. JavaScript can interact with the DOM to read, modify, or remove elements, making web pages dynamic and interactive.</p>
          
          <p class="text-gray-300 mb-4">DOM manipulation allows developers to:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Change content, text, or HTML of elements</li>
              <li>Modify CSS styles dynamically</li>
              <li>Create new elements or remove existing ones</li>
              <li>Respond to user interactions in real-time</li>
          </ul>

          <p class="text-gray-300 mb-4">For example, you can update a greeting message when a user clicks a button or highlight items in a list when hovered. Understanding DOM manipulation is essential for building interactive web applications and is a cornerstone of front-end development.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types/Concepts of DOM Manipulation</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Selecting Elements</strong> – Access HTML elements using <code>getElementById</code>, <code>getElementsByClassName</code>, <code>querySelector</code>, etc.</li>
              <li><strong>Changing Content</strong> – Modify text using <code>.innerHTML</code> or <code>.textContent</code>.</li>
              <li><strong>Modifying Styles</strong> – Change CSS properties dynamically using <code>.style</code>.</li>
              <li><strong>Creating & Removing Elements</strong> – Use <code>createElement</code>, <code>appendChild</code>, <code>removeChild</code>.</li>
              <li><strong>Event Handling</strong> – Attach events to elements to respond to user actions.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>DOM manipulation is key to interactive web pages.</li>
              <li>Use <code>querySelector</code> or <code>querySelectorAll</code> for modern, flexible selection.</li>
              <li>Avoid excessive DOM updates for performance reasons.</li>
              <li>JavaScript frameworks (React, Vue) automate DOM updates for large applications, but understanding vanilla DOM is crucial.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Selecting an Element', 
            content: `let element = document.getElementById("demo"); 
let elements = document.getElementsByClassName("item"); 
let firstElement = document.querySelector(".item");` 
          },
          { 
            title: 'Changing Content', 
            content: `element.innerHTML = "New Content"; 
element.textContent = "Updated Text";` 
          },
          { 
            title: 'Changing Styles', 
            content: `element.style.color = "blue"; 
element.style.fontSize = "20px";` 
          },
          { 
            title: 'Creating and Appending Elements', 
            content: `let newDiv = document.createElement("div"); 
newDiv.innerHTML = "Hello World"; 
document.body.appendChild(newDiv);` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>DOM Manipulation Example</title> 
    <style> 
        .highlight { 
            background-color: yellow; 
            font-weight: bold; 
        } 
    </style> 
</head> 
<body> 

    <h1 id="title">Welcome!</h1> 
    <p id="demo">Click the button to change this text.</p> 

    <button onclick="updateContent()">Click Me</button> 

    <script> 
        function updateContent() { 
            // Change text 
            document.getElementById("demo").textContent = "Text updated dynamically!"; 

            // Change style 
            document.getElementById("title").style.color = "green"; 
            document.getElementById("title").style.textAlign = "center"; 

            // Create new element 
            let newPara = document.createElement("p"); 
            newPara.textContent = "This paragraph was added using DOM!"; 
            newPara.className = "highlight"; 
            document.body.appendChild(newPara); 
        } 
    </script> 

</body> 
</html>`
      },
      { 
        title: 'JavaScript Events', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to JavaScript Events</h2>
          <p class="text-gray-300 mb-4">In JavaScript, events are actions or occurrences that happen in the browser, which the code can detect and respond to. Events can be triggered by the user (like clicks, typing, or mouse movement), by the browser (like page load), or programmatically.</p>
          
          <p class="text-gray-300 mb-4">Event handling allows web pages to react dynamically to user actions, creating interactivity and enhancing the user experience. For example, clicking a button to submit a form, hovering over an image to highlight it, or typing in an input box to validate data in real-time are all managed through events.</p>

          <p class="text-gray-300 mb-4">By understanding JavaScript events, developers can create responsive, interactive, and professional web applications. Events can be handled in multiple ways, such as inline handlers, DOM element properties, or <code>addEventListener</code>, which is the modern standard for attaching multiple event listeners.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types/Concepts of JavaScript Events</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Mouse Events</strong> – Actions like <code>click</code>, <code>dblclick</code>, <code>mouseover</code>, <code>mouseout</code>, <code>mousemove</code>.</li>
              <li><strong>Keyboard Events</strong> – Actions like <code>keydown</code>, <code>keyup</code>, <code>keypress</code>.</li>
              <li><strong>Form Events</strong> – Actions like <code>submit</code>, <code>change</code>, <code>focus</code>, <code>blur</code>.</li>
              <li><strong>Window Events</strong> – Actions like <code>load</code>, <code>resize</code>, <code>scroll</code>.</li>
              <li><strong>Event Listeners</strong> – Modern way to attach multiple events to a single element using <code>addEventListener</code>.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Event listeners are preferred over inline events for cleaner, modular code.</li>
              <li>Event objects contain information about the event, like which key was pressed or which mouse button was clicked.</li>
              <li>Events can be bubbled or captured, controlling how events propagate through nested elements.</li>
              <li>Prevent default browser behavior using <code>event.preventDefault()</code> when needed.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Inline Event Handler', 
            content: `<button onclick="alert('Button clicked!')">Click Me</button>` 
          },
          { 
            title: 'DOM Property Event', 
            content: `document.getElementById("btn").onclick = function() { 
    alert("Button clicked!"); 
};` 
          },
          { 
            title: 'Using addEventListener', 
            content: `let button = document.getElementById("btn"); 
button.addEventListener("click", function() { 
    alert("Button clicked!"); 
});` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>JavaScript Events Example</title> 
    <style> 
        button { 
            padding: 10px 20px; 
            font-size: 16px; 
        } 
        #demo { 
            margin-top: 20px; 
            font-weight: bold; 
        } 
    </style> 
</head> 
<body> 

    <h1>JavaScript Events</h1> 

    <button id="btn">Click Me</button> 
    <input type="text" id="inputBox" placeholder="Type something..."> 
    <p id="demo"></p> 

    <script> 
        // Click Event 
        document.getElementById("btn").addEventListener("click", function() { 
            document.getElementById("demo").textContent = "Button was clicked!"; 
        }); 

        // Keyboard Event 
        document.getElementById("inputBox").addEventListener("keyup", function(event) { 
            document.getElementById("demo").textContent = "You typed: " + event.target.value; 
        }); 
    </script> 

</body> 
</html>`
      },
      { 
        title: 'JavaScript Packages, Node.js, npm, and Lodash', 
        duration: '10 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">JavaScript Packages, Node.js, npm, and Lodash</h2>
          <p class="text-gray-300 mb-4">Modern JavaScript projects rely heavily on packages to simplify development. One of the most popular packages in the JavaScript ecosystem is Lodash.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">What is Lodash?</h3>
          <p class="text-gray-300 mb-4">Lodash is an open-source utility library that provides pre-built functions for common programming tasks like:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Working with arrays, objects, and strings</li>
              <li>Performing mathematical and statistical operations</li>
              <li>Manipulating collections and data structures</li>
              <li>Simplifying complex logic</li>
          </ul>
          <p class="text-gray-300 mb-4">Lodash makes JavaScript code shorter, cleaner, and easier to read. For example, finding the maximum number in an array or sorting a list becomes very simple compared to writing manual loops.</p>
          <p class="text-gray-300 mb-4">Lodash is installed and used via npm, the Node.js package manager. Since it’s open-source, developers can contribute to its improvement, and it’s widely supported in professional projects.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Node.js and npm Recap</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Node.js</strong> is a runtime environment to run JavaScript outside the browser.</li>
              <li><strong>npm</strong> is a package manager to install and manage packages like Lodash.</li>
          </ul>
          <p class="text-gray-300 mb-4">To install Node.js: download from <code>https://nodejs.org</code>, then verify:</p>
          <pre class="bg-gray-800 p-2 rounded text-gray-300 mb-4"><code>node -v   # check Node.js version 
npm -v    # check npm version</code></pre>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Types / Concepts</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Local Packages</strong> – Used in a specific project (e.g., Lodash in a project folder).</li>
              <li><strong>Global Packages</strong> – Accessible in all projects (e.g., nodemon).</li>
              <li><strong>Open-Source Packages</strong> – Free, public packages maintained by communities.</li>
              <li><strong>Private Packages</strong> – Restricted to internal projects.</li>
              <li><strong>Lodash Functions</strong> – <code>_.max()</code>, <code>_.min()</code>, <code>_.sortBy()</code>, <code>_.cloneDeep()</code>, <code>_.uniq()</code>, etc.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Why Use Lodash?</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Reduces manual code and improves readability.</li>
              <li>Handles cross-browser inconsistencies.</li>
              <li>Provides robust utility functions tested by the community.</li>
              <li>Makes your project more maintainable and professional.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Install Lodash', 
            content: `# Initialize project 
npm init -y 

# Install Lodash 
npm install lodash` 
          },
          { 
            title: 'Import Lodash in JavaScript', 
            content: `// Import lodash 
const _ = require('lodash'); 

// Array of numbers 
let numbers = [10, 5, 20, 15]; 

// Using Lodash functions 
console.log("Maximum:", _.max(numbers)); // 20 
console.log("Minimum:", _.min(numbers)); // 5 
console.log("Sorted:", _.sortBy(numbers)); // [5,10,15,20] 
console.log("Unique:", _.uniq([1,2,2,3,3,3])); // [1,2,3]` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Lodash Example</title> 
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
    <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
        .output { background: #f4f4f4; padding: 15px; border-radius: 5px; margin-top: 10px; }
        .log-item { margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    </style>
</head> 
<body> 
    <h2>Lodash Example: Array Operations</h2>
    <p>Check the console for raw output. Below is the rendered output:</p>
    <div id="output" class="output"></div>

    <script> 
        // Note: In a real Node.js environment, you would use: 
        // const _ = require('lodash');
        // In this browser playground, Lodash is loaded via CDN and available as '_' globally.

        // Helper function to display output
        function log(label, value) {
            const outputDiv = document.getElementById('output');
            const item = document.createElement('div');
            item.className = 'log-item';
            item.innerHTML = "<strong>" + label + "</strong> " + JSON.stringify(value);
            outputDiv.appendChild(item);
            console.log(label, value);
        }

        // --- User Code Start ---
        
        let scores = [45, 78, 92, 60, 88, 78]; 
        
        // Find maximum and minimum scores 
        let maxScore = _.max(scores); 
        let minScore = _.min(scores); 
        
        // Sort scores in ascending order 
        let sortedScores = _.sortBy(scores); 
        
        // Remove duplicate scores 
        let uniqueScores = _.uniq(scores); 
        
        log("Original Scores:", scores); 
        log("Highest Score:", maxScore); 
        log("Lowest Score:", minScore); 
        log("Sorted Scores:", sortedScores); 
        log("Unique Scores:", uniqueScores); 

        // --- User Code End ---
    </script> 
</body> 
</html>`
      },
      { 
        title: 'JavaScript Libraries and Frameworks', 
        duration: '10 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">JavaScript Libraries and Frameworks</h2>
          <p class="text-gray-300 mb-4">JavaScript libraries and frameworks are essential for building modern web applications efficiently. They allow developers to write less code while maintaining structure, performance, and scalability.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Library vs. Framework</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Library</strong>: A collection of pre-written code that provides specific functionality (e.g., jQuery, Lodash, D3.js). You call the library functions as needed. It focuses on specific problems like DOM manipulation or data visualization.</li>
              <li><strong>Framework</strong>: Provides a complete structure to build applications (e.g., React, Angular, Vue.js). It enforces architecture and best practices, dictating how your code should be organized ("Inversion of Control").</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Popular JavaScript Libraries & Frameworks</h3>
          <div class="space-y-4">
              <div>
                  <h4 class="text-lg font-bold text-blue-400">React (Library)</h4>
                  <ul class="list-disc pl-6 text-gray-300">
                      <li>Developed by Facebook.</li>
                      <li>Used to build dynamic, component-based UIs.</li>
                      <li>Emphasizes reusable components and state management.</li>
                      <li>Often paired with Redux or Context API for state handling.</li>
                  </ul>
              </div>
              <div>
                  <h4 class="text-lg font-bold text-red-500">Angular (Framework)</h4>
                  <ul class="list-disc pl-6 text-gray-300">
                      <li>Developed by Google.</li>
                      <li>A full-featured framework for building scalable applications.</li>
                      <li>Uses TypeScript, promotes modularity, and supports two-way data binding.</li>
                  </ul>
              </div>
              <div>
                  <h4 class="text-lg font-bold text-green-500">Vue.js (Framework)</h4>
                  <ul class="list-disc pl-6 text-gray-300">
                      <li>Lightweight and flexible.</li>
                      <li>Easy to learn for beginners but powerful enough for large projects.</li>
                      <li>Supports reactive data binding and component-based architecture.</li>
                  </ul>
              </div>
          </div>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Why Use Libraries and Frameworks?</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Speeds up development by providing ready-made functions and components.</li>
              <li>Improves code organization, maintainability, and scalability.</li>
              <li>Facilitates cross-browser compatibility and consistent behavior.</li>
              <li>Enables modern web development features like Single Page Applications (SPAs).</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Choosing a library or framework depends on project requirements.</li>
              <li>Learn one framework deeply rather than many superficially.</li>
              <li>Most modern frameworks support package management with npm.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'React Example', 
            content: `// Import React 
import React from 'react'; 
import ReactDOM from 'react-dom/client'; 

// Functional Component 
function App() { 
  return ( 
    <div> 
      <h1>Hello, React!</h1> 
      <p>Welcome to your first React app.</p> 
    </div> 
  ); 
} 

// Render to the DOM 
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<App />);` 
          },
          { 
            title: 'Angular Example', 
            content: `// app.component.ts 
import { Component } from '@angular/core'; 

@Component({ 
  selector: 'app-root', 
  template: \` 
    <h1>Hello, Angular!</h1> 
    <p>Welcome to your first Angular component.</p> 
  \`, 
  styleUrls: ['./app.component.css'] 
}) 
export class AppComponent { 
  title = 'AngularApp'; 
}` 
          },
          { 
            title: 'Vue.js Example', 
            content: `// main.js 
import { createApp } from 'vue' 
import App from './App.vue' 

createApp(App).mount('#app') 

// App.vue 
<template> 
  <div> 
    <h1>Hello, Vue!</h1> 
    <p>Welcome to your first Vue app.</p> 
  </div> 
</template> 

<script> 
export default { 
  name: 'App' 
} 
</script>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>React Live Example</title> 
    <!-- Load React and ReactDOM from CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Load Babel for JSX support -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #1e1e1e; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        button { padding: 12px 24px; margin: 0 10px; cursor: pointer; background: #61dafb; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; color: #20232a; transition: background 0.3s; }
        button:hover { background: #4fa8d1; }
        h1 { font-size: 3rem; margin-bottom: 30px; }
        .container { text-align: center; background: #282c34; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
    </style>
</head> 
<body> 
    <div id="root"></div> 

    <!-- React Code inside Babel script -->
    <script type="text/babel"> 
        const { useState } = React; 

        function Counter() { 
            const [count, setCount] = useState(0); 

            return ( 
                <div className="container"> 
                    <h1>Counter: {count}</h1> 
                    <div>
                        <button onClick={() => setCount(count + 1)}>Increase</button> 
                        <button onClick={() => setCount(count - 1)}>Decrease</button> 
                    </div>
                </div> 
            ); 
        } 

        const root = ReactDOM.createRoot(document.getElementById('root')); 
        root.render(<Counter />); 
    </script> 
</body> 
</html>` 
      },
      { 
        title: 'JavaScript Modules and Import/Export', 
        duration: '10 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">JavaScript Modules and Import/Export</h2>
          <p class="text-gray-300 mb-4">As projects grow larger, managing all your JavaScript code in a single file becomes unmanageable and error-prone. Modules allow you to break your code into smaller, reusable files, improving readability, maintainability, and scalability.</p>
          <p class="text-gray-300 mb-4">In modern JavaScript (ES6+), you can export functions, objects, or variables from one file and import them into another. This enables developers to:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Reuse code across multiple files and projects</li>
              <li>Avoid name collisions by using module scopes</li>
              <li>Structure applications logically with separation of concerns</li>
          </ul>
          <p class="text-gray-300 mb-4">There are two main types of exports:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Named Exports</strong> – Export multiple items by name.</li>
              <li><strong>Default Exports</strong> – Export a single item as the default for the module.</li>
          </ul>
          <p class="text-gray-300 mb-4">Modules can be used in both browser-based applications and Node.js projects, making them essential for professional-grade applications.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Key Concepts</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Named Exports</strong> – Multiple functions/variables exported from a module.</li>
              <li><strong>Default Export</strong> – Single primary item exported from a module.</li>
              <li><strong>Import Statement</strong> – Used to bring exported items into another file.</li>
              <li><strong>Relative Paths</strong> – Modules are imported using relative or absolute file paths (e.g., <code>./utils.js</code>).</li>
              <li><strong>Benefits</strong> – Improves code organization, reusability, and avoids global scope pollution.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>ES6 modules use the keywords <code>export</code> and <code>import</code>.</li>
              <li>Node.js supports modules with CommonJS (<code>require</code>/<code>module.exports</code>) or ESM (<code>import</code>/<code>export</code>).</li>
              <li>Modular code is easier to test, debug, and extend.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Named Export Example', 
            content: `// mathUtils.js 
export function add(a, b) { 
  return a + b; 
} 

export function multiply(a, b) { 
  return a * b; 
} 

// app.js 
import { add, multiply } from './mathUtils.js'; 

console.log("Sum:", add(5, 3));         // Output: 8 
console.log("Product:", multiply(5, 3)); // Output: 15` 
          },
          { 
            title: 'Default Export Example', 
            content: `// greeting.js 
export default function greet(name) { 
  return \`Hello, \${name}!\`; 
} 

// app.js 
import greet from './greeting.js'; 

console.log(greet("Alice")); // Output: Hello, Alice!` 
          },
          { 
            title: 'Node.js (CommonJS) Example', 
            content: `// utils.js 
function subtract(a, b) { 
  return a - b; 
} 

module.exports = subtract; 

// app.js 
const subtract = require('./utils'); 

console.log(subtract(10, 4)); // Output: 6` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Modules Simulation</title> 
    <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #1e1e1e; color: #fff; }
        .file-block { background: #2d2d2d; padding: 15px; margin-bottom: 20px; border-left: 4px solid #61dafb; border-radius: 4px; }
        .file-title { color: #aaa; font-size: 0.9em; margin-bottom: 10px; font-family: monospace; }
        .output { background: #000; padding: 15px; border-radius: 4px; font-family: monospace; border: 1px solid #333; }
        h3 { border-bottom: 1px solid #444; padding-bottom: 10px; }
    </style>
</head> 
<body> 
    <h2>Project Example: Math Operations</h2>
    <p class="text-gray-400">Since we are in a single-file playground, we are simulating two separate files below.</p>

    <div class="file-block">
        <div class="file-title">// operations.js</div>
        <pre>
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }
export function divide(a, b) { 
    if (b === 0) return "Cannot divide by zero"; 
    return a / b; 
}</pre>
    </div>

    <div class="file-block">
        <div class="file-title">// app.js</div>
        <pre>
import { add, subtract, multiply, divide } from './operations.js';

console.log("5 + 3 =", add(5, 3)); 
console.log("5 - 3 =", subtract(5, 3)); 
...</pre>
    </div>

    <h3>Console Output:</h3>
    <div id="console-output" class="output"></div>

    <script> 
        // --- SIMULATION OF operations.js ---
        const OperationsModule = {
            add: (a, b) => a + b,
            subtract: (a, b) => a - b,
            multiply: (a, b) => a * b,
            divide: (a, b) => (b === 0 ? "Cannot divide by zero" : a / b)
        };

        // --- SIMULATION OF app.js ---
        // Simulating: import { add, subtract, multiply, divide } from './operations.js';
        const { add, subtract, multiply, divide } = OperationsModule;

        // Helper to print to our HTML console
        function log(msg) {
            const out = document.getElementById('console-output');
            out.innerHTML += "<div>> " + msg + "</div>";
        }

        log("Running app.js...");
        log("5 + 3 = " + add(5, 3)); 
        log("5 - 3 = " + subtract(5, 3)); 
        log("5 * 3 = " + multiply(5, 3)); 
        log("5 / 0 = " + divide(5, 0)); 
    </script> 
</body> 
</html>` 
      },
      { 
        title: 'Asynchronous JavaScript', 
        duration: '10 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Asynchronous JavaScript – Promises & Async/Await</h2>
          <p class="text-gray-300 mb-4">In JavaScript, many operations like API requests, file reading, or timers don’t return results instantly—they are asynchronous. If JavaScript executed everything synchronously, the browser would freeze while waiting for slow operations to finish.</p>
          <p class="text-gray-300 mb-4">Asynchronous programming allows JavaScript to handle long-running tasks without blocking the main execution thread. The most common tools for asynchronous code are:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Callbacks</strong> – Functions passed as arguments to be executed later.</li>
              <li><strong>Promises</strong> – Objects representing a value that may be available now, later, or never.</li>
              <li><strong>Async/Await</strong> – Syntactic sugar over Promises, making asynchronous code look synchronous and easier to read.</li>
          </ul>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Promises</h3>
          <p class="text-gray-300 mb-4">A Promise has three states:</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Pending</strong>: Initial state, neither fulfilled nor rejected.</li>
              <li><strong>Fulfilled</strong>: Operation completed successfully.</li>
              <li><strong>Rejected</strong>: Operation failed.</li>
          </ul>
          <p class="text-gray-300 mb-4">Promises help avoid callback hell by chaining <code>.then()</code> and <code>.catch()</code> methods.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Async/Await</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><code>async</code> functions always return a Promise.</li>
              <li><code>await</code> pauses execution inside an async function until the Promise resolves or rejects.</li>
          </ul>
          <p class="text-gray-300 mb-4"><strong>Benefits of Async/Await:</strong></p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Cleaner and more readable code than nested callbacks.</li>
              <li>Easier error handling using <code>try…catch</code>.</li>
              <li>Works seamlessly with Promises.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Modern web development relies heavily on asynchronous operations like fetching data from APIs.</li>
              <li>Combining async code with frameworks like React or Node.js backend ensures smooth user experiences.</li>
              <li>Always avoid blocking the main thread with synchronous code for operations that may take time.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Promise Example', 
            content: `// Create a new Promise 
const fetchData = new Promise((resolve, reject) => { 
  let success = true; // simulate success or failure 
  setTimeout(() => { 
    if(success) { 
      resolve("Data fetched successfully!"); 
    } else { 
      reject("Error fetching data!"); 
    } 
  }, 2000); 
}); 

// Handling the Promise 
fetchData 
  .then((message) => console.log(message)) 
  .catch((error) => console.log(error));` 
          },
          { 
            title: 'Async/Await Example', 
            content: `// Async function 
async function fetchDataAsync() { 
  try { 
    let response = await new Promise((resolve, reject) => { 
      setTimeout(() => resolve("Data fetched successfully!"), 2000); 
    }); 
    console.log(response); 
  } catch (error) { 
    console.log(error); 
  } 
} 

// Call async function 
fetchDataAsync();` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Async/Await Example</title> 
    <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #1e1e1e; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: #2d2d2d; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); width: 300px; text-align: center; }
        button { background: #61dafb; color: #1e1e1e; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 15px; font-size: 16px; transition: 0.3s; }
        button:hover { background: #4fa8d1; }
        button:disabled { background: #555; cursor: not-allowed; }
        #status { margin-top: 20px; font-size: 1.1em; min-height: 24px; color: #aaa; }
        .user-info { margin-top: 20px; text-align: left; background: #333; padding: 15px; border-radius: 4px; display: none; }
        .spinner { border: 4px solid rgba(255,255,255,0.1); width: 24px; height: 24px; border-radius: 50%; border-left-color: #61dafb; animation: spin 1s linear infinite; margin: 20px auto; display: none; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head> 
<body> 
    <div class="card">
        <h2>User Profile</h2>
        <div id="spinner" class="spinner"></div>
        <div id="status">Click to load user data</div>
        
        <div id="userInfo" class="user-info">
            <p><strong>Name:</strong> <span id="userName"></span></p>
            <p><strong>Age:</strong> <span id="userAge"></span></p>
        </div>

        <button id="fetchBtn" onclick="displayUser()">Fetch User Data</button>
    </div>

    <script> 
        // Simulated API fetch using Promise 
        function getUserData() { 
            return new Promise((resolve, reject) => { 
                setTimeout(() => { 
                    const success = true; // toggle for testing 
                    if(success) { 
                        resolve({ name: "Alice", age: 25 }); 
                    } else { 
                        reject("Failed to fetch user data"); 
                    } 
                }, 1500); 
            }); 
        } 

        // Async/Await usage 
        async function displayUser() { 
            const btn = document.getElementById('fetchBtn');
            const status = document.getElementById('status');
            const spinner = document.getElementById('spinner');
            const userInfo = document.getElementById('userInfo');
            
            // Reset UI
            btn.disabled = true;
            status.textContent = "Fetching data...";
            status.style.color = "#aaa";
            spinner.style.display = "block";
            userInfo.style.display = "none";

            try { 
                const user = await getUserData(); 
                
                // Update UI with success
                status.textContent = "Data loaded successfully!";
                status.style.color = "#4caf50";
                document.getElementById('userName').textContent = user.name;
                document.getElementById('userAge').textContent = user.age;
                userInfo.style.display = "block";
                
                console.log("User Details:", user); 
            } catch (error) { 
                // Update UI with error
                status.textContent = "Error: " + error;
                status.style.color = "#f44336";
                console.log("Error:", error); 
            } finally {
                btn.disabled = false;
                spinner.style.display = "none";
            }
        } 
    </script> 
</body> 
</html>` 
      },
      { 
        title: 'Web APIs – Fetch, LocalStorage, and SessionStorage', 
        duration: '10 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Web APIs – Fetch, LocalStorage, and SessionStorage</h2>
          <p class="text-gray-300 mb-4">Modern web applications often need to interact with external data and store information locally in the browser. JavaScript provides Web APIs, which are built-in tools that allow developers to do this easily.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">1. Fetch API</h3>
          <p class="text-gray-300 mb-4">The Fetch API allows developers to make HTTP requests to retrieve or send data to servers. Unlike older methods like XMLHttpRequest, Fetch uses Promises, making code cleaner and easier to manage.</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Asynchronous and Promise-based</strong></li>
              <li><strong>Handles JSON</strong> and other response formats easily</li>
              <li><strong>Works with REST APIs</strong> and server endpoints</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">2. LocalStorage</h3>
          <p class="text-gray-300 mb-4">LocalStorage is a browser storage API that allows developers to store key-value data permanently (until cleared by the user).</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Data persists even after browser is closed.</li>
              <li>Stores only strings (use JSON to store objects/arrays).</li>
              <li>Maximum storage ~5MB.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">3. SessionStorage</h3>
          <p class="text-gray-300 mb-4">SessionStorage is similar to LocalStorage, but data is cleared when the browser tab is closed.</p>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Data is temporary for the session.</li>
              <li>Also stores strings.</li>
              <li>Maximum storage ~5MB.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Always handle errors with Fetch using <code>.catch()</code> or <code>try…catch</code>.</li>
              <li>Use LocalStorage for non-sensitive persistent data.</li>
              <li>Use SessionStorage for temporary session-specific data.</li>
              <li>Both storage APIs are synchronous, so avoid storing very large data.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Fetch API Example', 
            content: `// Fetch user data from an API 
fetch('https://jsonplaceholder.typicode.com/users/1') 
  .then(response => response.json()) 
  .then(data => console.log("User Data:", data)) 
  .catch(error => console.log("Error:", error));` 
          },
          { 
            title: 'LocalStorage Example', 
            content: `// Store data 
localStorage.setItem('username', 'Alice'); 

// Retrieve data 
let name = localStorage.getItem('username'); 
console.log("Stored Name:", name); 

// Remove data 
localStorage.removeItem('username');` 
          },
          { 
            title: 'SessionStorage Example', 
            content: `// Store data for session 
sessionStorage.setItem('sessionID', '12345'); 

// Retrieve data 
let session = sessionStorage.getItem('sessionID'); 
console.log("Session ID:", session); 

// Clear session 
sessionStorage.clear();` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Web APIs Example</title> 
    <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #1e1e1e; color: #fff; }
        .card { background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #61dafb; }
        button { background: #61dafb; color: #1e1e1e; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; margin-right: 10px; transition: 0.3s; }
        button:hover { background: #4fa8d1; }
        .output { background: #000; padding: 10px; border-radius: 4px; font-family: monospace; margin-top: 10px; min-height: 40px; color: #0f0; }
        h3 { margin-top: 0; }
        .label { color: #aaa; font-size: 0.9em; margin-bottom: 5px; display: block; }
    </style>
</head> 
<body> 
    <h2>Web APIs: Fetch + Storage</h2>

    <div class="card">
        <h3>1. Fetch Data</h3>
        <button onclick="getUserData()">Fetch User from API</button>
        <span class="label" style="margin-top:10px">API Response:</span>
        <div id="apiOutput" class="output">Waiting...</div>
    </div>

    <div class="card">
        <h3>2. Local Storage (Persistent)</h3>
        <button onclick="checkLocalStorage()">Check Storage</button>
        <button onclick="clearLocalStorage()" style="background:#f44336; color:white">Clear</button>
        <div id="localOutput" class="output">Empty</div>
    </div>

    <div class="card">
        <h3>3. Session Storage (Temporary)</h3>
        <button onclick="checkSessionStorage()">Check Storage</button>
        <button onclick="clearSessionStorage()" style="background:#f44336; color:white">Clear</button>
        <div id="sessionOutput" class="output">Empty</div>
    </div>

    <script> 
        async function getUserData() { 
            const apiOut = document.getElementById('apiOutput');
            apiOut.textContent = "Fetching...";
            
            try { 
                // Fetch user from API 
                const response = await fetch('https://jsonplaceholder.typicode.com/users/1'); 
                const user = await response.json(); 
            
                // Store user name in LocalStorage 
                localStorage.setItem('username', user.name); 
            
                // Store user ID in SessionStorage 
                sessionStorage.setItem('sessionID', user.id); 
            
                apiOut.textContent = JSON.stringify(user, null, 2);
                
                // Auto-update storage displays
                checkLocalStorage();
                checkSessionStorage();

            } catch (error) { 
                apiOut.textContent = "Error: " + error;
            } 
        } 

        function checkLocalStorage() {
            const val = localStorage.getItem('username');
            document.getElementById('localOutput').textContent = val ? 'username: ' + val : 'Empty';
        }

        function clearLocalStorage() {
            localStorage.removeItem('username');
            checkLocalStorage();
        }

        function checkSessionStorage() {
            const val = sessionStorage.getItem('sessionID');
            document.getElementById('sessionOutput').textContent = val ? 'sessionID: ' + val : 'Empty';
        }

        function clearSessionStorage() {
            sessionStorage.removeItem('sessionID');
            checkSessionStorage();
        }
        
        // Initial check
        checkLocalStorage();
        checkSessionStorage();
    </script> 
</body> 
</html>` 
      },
      {
        title: 'Project: Interactive To-Do List',
        duration: '30 min',
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Project: Interactive To-Do List</h2>
          <p class="text-gray-300 mb-4">In this project, we will combine everything we've learned in this module: DOM manipulation, Event Handling, and LocalStorage. You will build a fully functional To-Do List application that persists data even after the page is refreshed.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Project Requirements</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Add Tasks:</strong> Users should be able to type a task and add it to the list.</li>
              <li><strong>Mark as Done:</strong> Clicking a task should toggle its completion status (e.g., strikethrough).</li>
              <li><strong>Delete Tasks:</strong> Each task should have a delete button to remove it.</li>
              <li><strong>Data Persistence:</strong> The list should be saved in LocalStorage so it remains available after a page reload.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Step-by-Step Guide</h3>
          <ol class="list-decimal pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>HTML Structure:</strong> Create an input field, an "Add" button, and an empty <code>&lt;ul&gt;</code> for the list.</li>
              <li><strong>CSS Styling:</strong> Style the list items, completed state, and buttons for a clean UI.</li>
              <li><strong>JavaScript Logic:</strong>
                  <ul class="list-disc pl-6 mt-1">
                      <li>Select DOM elements using <code>querySelector</code>.</li>
                      <li>Add an event listener to the "Add" button.</li>
                      <li>Create a function to render the list from an array of task objects.</li>
                      <li>Implement <code>localStorage.setItem</code> to save the array and <code>localStorage.getItem</code> to load it on startup.</li>
                  </ul>
              </li>
          </ol>
        `,
        syntax: [
          {
            title: 'Project Structure & Logic',
            content: `// 1. Data Structure
let tasks = [
  { id: 1, text: "Buy groceries", completed: false },
  { id: 2, text: "Learn JavaScript", completed: true }
];

// 2. Save to Storage
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 3. Load from Storage
function load() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

// 4. Render Loop
function render() {
  listElement.innerHTML = '';
  tasks.forEach(task => {
    // Create li, add text, buttons, etc.
  });
}`
          }
        ],
        liveCode: `<!DOCTYPE html>
<html>
<head>
  <title>To-Do List Project</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #1e1e1e; color: #fff; padding: 20px; display: flex; justify-content: center; }
    .container { width: 100%; max-width: 400px; background: #2d2d2d; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
    h2 { text-align: center; color: #61dafb; margin-top: 0; }
    
    .input-group { display: flex; gap: 10px; margin-bottom: 20px; }
    input { flex: 1; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #1e1e1e; color: #fff; }
    button#add { background: #61dafb; color: #000; font-weight: bold; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    button#add:hover { background: #4fa8d1; }

    ul { list-style: none; padding: 0; margin: 0; }
    li { background: #3e3e42; margin-bottom: 8px; padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
    li.completed span { text-decoration: line-through; color: #888; }
    
    .actions { display: flex; gap: 5px; }
    .btn-sm { border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8em; }
    .check-btn { background: #4caf50; color: white; }
    .delete-btn { background: #f44336; color: white; }
    .btn-sm:hover { opacity: 0.8; }
  </style>
</head>
<body>

<div class="container">
  <h2>My Tasks</h2>
  <div class="input-group">
    <input type="text" id="taskInput" placeholder="Add a new task...">
    <button id="add">Add</button>
  </div>
  <ul id="taskList"></ul>
</div>

<script>
  // DOM Elements
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('add');
  const list = document.getElementById('taskList');

  // State
  let tasks = [];

  // Load from Storage
  const stored = localStorage.getItem('myTasks');
  if (stored) {
    tasks = JSON.parse(stored);
    render();
  }

  // Add Task Event
  addBtn.addEventListener('click', addTask);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  function addTask() {
    const text = input.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    input.value = '';
    input.focus();
  }

  function toggleTask(id) {
    tasks = tasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    saveAndRender();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
  }

  function saveAndRender() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    render();
  }

  function render() {
    list.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');

      li.innerHTML = 
        '<span>' + task.text + '</span>' +
        '<div class="actions">' +
          '<button class="btn-sm check-btn" onclick="toggleTask(' + task.id + ')">✓</button>' +
          '<button class="btn-sm delete-btn" onclick="deleteTask(' + task.id + ')">✕</button>' +
        '</div>';
      list.appendChild(li);
    });
  }
</script>

</body>
</html>`
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Portfolio Project',
    duration: '10 min',
    description: 'Build your personal portfolio.',
    lessons: [
      { 
        title: 'Planning Your Portfolio', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Planning Your Portfolio</h2>
          <p class="text-gray-300 mb-4">A portfolio project is a showcase of your skills, projects, and achievements. Planning is the first and most crucial step because a well-structured plan ensures your portfolio is organized, visually appealing, and effectively communicates your abilities.</p>
          
          <p class="text-gray-300 mb-4">The planning stage involves several key steps: defining the purpose of the portfolio, selecting the projects or content to include, deciding on the layout and navigation, and determining the tools and technologies to be used. For a web developer, this could involve HTML, CSS, JavaScript, and frameworks like React. For designers or writers, it could include visuals, documents, and multimedia.</p>

          <p class="text-gray-300 mb-4">Good planning ensures that your portfolio highlights your strengths, creativity, and professionalism, making it easier for potential employers or clients to understand your expertise.</p>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Key Steps in Planning</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Define Purpose</strong> – Decide whether the portfolio is for job applications, freelance work, or personal branding.</li>
              <li><strong>Select Projects</strong> – Choose projects that best demonstrate your skills and experience.</li>
              <li><strong>Design Layout</strong> – Plan sections like About Me, Skills, Projects, and Contact.</li>
              <li><strong>Choose Tools</strong> – Decide the technology stack for building the portfolio.</li>
              <li><strong>Content Strategy</strong> – Prepare descriptions, images, and links for each project.</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Keep the portfolio simple, clean, and responsive.</li>
              <li>Focus on quality over quantity — showcase your best work.</li>
              <li>Include personal branding elements like a logo or consistent color theme.</li>
              <li>Plan interactivity to make the portfolio engaging (hover effects, clickable links).</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'HTML Structure for Portfolio', 
            content: `<!DOCTYPE html> 
<html> 
<head> 
    <title>My Portfolio</title> 
    <link rel="stylesheet" href="style.css"> 
</head> 
<body> 
    <header> 
        <h1>My Portfolio</h1> 
        <nav> 
            <a href="#about">About Me</a> 
            <a href="#projects">Projects</a> 
            <a href="#contact">Contact</a> 
        </nav> 
    </header> 

    <section id="about"> 
        <h2>About Me</h2> 
        <p>Brief introduction and skills.</p> 
    </section> 

    <section id="projects"> 
        <h2>Projects</h2> 
        <!-- Individual project cards --> 
    </section> 

    <section id="contact"> 
        <h2>Contact</h2> 
        <!-- Contact form or details --> 
    </section> 

    <footer> 
        <p>&copy; 2026 Your Name</p> 
    </footer> 
</body> 
</html>` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>My Portfolio</title> 
    <style> 
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4; 
        } 
        header { 
            background-color: #2c3e50; 
            color: white; 
            padding: 20px; 
            text-align: center; 
        } 
        nav a { 
            margin: 0 15px; 
            color: white; 
            text-decoration: none; 
            font-weight: bold; 
        } 
        section { 
            padding: 40px 20px; 
            margin: 10px auto; 
            background-color: white; 
            width: 80%; 
            border-radius: 5px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
        } 
        footer { 
            text-align: center; 
            padding: 20px; 
            background-color: #2c3e50; 
            color: white; 
        } 
    </style> 
</head> 
<body> 

    <header> 
        <h1>My Portfolio</h1> 
        <nav> 
            <a href="#about">About Me</a> 
            <a href="#projects">Projects</a> 
            <a href="#contact">Contact</a> 
        </nav> 
    </header> 

    <section id="about"> 
        <h2>About Me</h2> 
        <p>Hello! I am a web developer passionate about creating interactive and responsive websites.</p> 
    </section> 

    <section id="projects"> 
        <h2>Projects</h2> 
        <p>Project 1: Portfolio Website</p> 
        <p>Project 2: E-commerce Website</p> 
    </section> 

    <section id="contact"> 
        <h2>Contact</h2> 
        <p>Email: yourname@example.com</p> 
        <p>Phone: +91 1234567890</p> 
    </section> 

    <footer> 
        <p>&copy; 2026 Your Name</p> 
    </footer> 

</body> 
</html>`
      },
      { 
        title: 'Adding Interactivity', 
        duration: '5 min', 
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Adding Interactivity</h2>
          <p class="text-gray-300 mb-4">Adding interactivity to a portfolio makes it engaging, user-friendly, and memorable. Interactivity allows users to interact with elements, receive immediate feedback, and explore your work dynamically. Examples include hover effects on project cards, animated transitions, modals, form validations, and responsive navigation menus.</p>
          
          <p class="text-gray-300 mb-4">JavaScript is the primary tool for portfolio interactivity. It can handle events such as clicks, scrolls, key presses, or mouse movements. Combined with CSS animations and transitions, these elements create a polished, modern, and professional feel.</p>
          
          <p class="text-gray-300 mb-4">Interactivity also improves user experience (UX) by guiding visitors through your portfolio efficiently, highlighting important projects, and making your portfolio visually appealing without overwhelming the user.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Key Techniques/Concepts for Interactivity</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Hover Effects</strong> – Change styles when a user hovers over elements.</li>
              <li><strong>Click Events</strong> – Show or hide content, open modals, or navigate sections.</li>
              <li><strong>Animations & Transitions</strong> – Smooth movement or fading effects for elements.</li>
              <li><strong>Form Validations</strong> – Check user input before submission.</li>
              <li><strong>Dynamic Content</strong> – Update portfolio sections dynamically without reloading.</li>
          </ul>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Use event listeners to attach interactivity without cluttering HTML.</li>
              <li>Test interactivity on different devices to ensure responsiveness.</li>
              <li>Avoid overusing animations; keep it subtle and professional.</li>
              <li>Interactive elements can highlight your skills and creativity effectively.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Hover Effect (CSS)', 
            content: `.project-card:hover { 
    transform: scale(1.05); 
    box-shadow: 0 8px 20px rgba(0,0,0,0.2); 
    transition: all 0.3s ease; 
}` 
          },
          { 
            title: 'Click Event (JavaScript)', 
            content: `document.getElementById("btn").addEventListener("click", function() { 
    alert("You clicked the button!"); 
});` 
          },
          { 
            title: 'Form Validation Example', 
            content: `function validateForm() { 
    let name = document.getElementById("name").value; 
    if(name === "") { 
        alert("Name must be filled out!"); 
        return false; 
    } 
    return true; 
}` 
          }
        ],
        liveCode: `<!DOCTYPE html> 
<html> 
<head> 
    <title>Portfolio Interactivity</title> 
    <style> 
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f4f4f4; 
        } 
        .project-card { 
            background-color: white; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 5px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
            transition: all 0.3s ease; 
        } 
        .project-card:hover { 
            transform: scale(1.05); 
            box-shadow: 0 8px 20px rgba(0,0,0,0.2); 
        } 
        button { 
            padding: 10px 20px; 
            font-size: 16px; 
        } 
    </style> 
</head> 
<body> 

    <h1>Portfolio Interactivity</h1> 

    <div class="project-card"> 
        <h2>Project 1: Portfolio Website</h2> 
        <p>Click the button to see interactivity.</p> 
        <button id="btn">Click Me!</button> 
    </div> 

    <script> 
        // Click event for button 
        document.getElementById("btn").addEventListener("click", function() { 
            alert("Welcome to my portfolio!"); 
        }); 
    </script> 

</body> 
</html>`
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Module 6: Python Basics',
    duration: '15 min',
    description: 'Introduction to Python programming.',
    lessons: [
      { 
        title: 'Introduction to Python', 
        duration: '5 min', 
        language: 'python',
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Introduction to Python</h2>
          <p class="text-gray-300 mb-4">Python is a high-level, interpreted programming language known for its simplicity, readability, and versatility. It is widely used in web development, data science, artificial intelligence, automation, and more. Python’s clear syntax allows beginners to write programs efficiently while enabling professionals to build complex applications.</p>
          
          <p class="text-gray-300 mb-4">Python supports multiple programming paradigms, including procedural, object-oriented, and functional programming. It comes with a large standard library that provides pre-built functions and modules to perform common tasks, making development faster and easier.</p>
          
          <p class="text-gray-300 mb-4">Key strengths of Python include cross-platform compatibility, dynamic typing, and ease of integration with other languages. Learning Python lays a strong foundation for software development, data analysis, and modern technologies like AI and machine learning.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Key Concepts/Highlights</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Interpreted Language</strong> – Python code is executed line by line.</li>
              <li><strong>Dynamically Typed</strong> – No need to declare variable types explicitly.</li>
              <li><strong>Indentation-Based Syntax</strong> – Blocks of code are defined by indentation rather than braces.</li>
              <li><strong>Extensive Libraries</strong> – Includes modules for math, data processing, web development, and more.</li>
              <li><strong>Cross-Platform</strong> – Works on Windows, macOS, Linux, and more.</li>
          </ul>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Python uses <code>print()</code> to display output.</li>
              <li>Comments start with <code>#</code> for single-line and <code>''' '''</code> or <code>""" """</code> for multi-line.</li>
              <li>Python encourages clean, readable code following the PEP 8 style guide.</li>
              <li>Ideal for beginners due to simple syntax but powerful enough for professional applications.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Basic Python Syntax', 
            content: `# Single-line comment 
print("Hello, Python!")  # Output to console 

# Multi-line comment 
''' 
This is a multi-line comment 
in Python 
'''` 
          },
          { 
            title: 'Variables and Data Types', 
            content: `name = "Alice"      # String 
age = 25            # Integer 
height = 5.7        # Float 
is_student = True   # Boolean` 
          },
          { 
            title: 'Simple Operation', 
            content: `sum = 10 + 5 
print("Sum:", sum)` 
          }
        ],
        liveCode: `# Python Introduction Example 

# Variables 
name = "Alice" 
age = 25 
is_student = True 

# Print details 
print("Name:", name) 
print("Age:", age) 
print("Is Student:", is_student) 

# Simple operation 
score1 = 85 
score2 = 90 
total_score = score1 + score2 
print("Total Score:", total_score) 

# Conditional 
if total_score > 170: 
    print("Excellent performance!") 
else: 
    print("Keep improving!") 

# Loop Example 
print("Numbers from 1 to 5:") 
for i in range(1, 6): 
    print(i)`
      },
      { 
        title: 'Python Data Types and Operations', 
        duration: '5 min', 
        language: 'python',
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Python Data Types and Operations</h2>
          <p class="text-gray-300 mb-4">Python has a variety of data types that allow you to store, manipulate, and operate on different kinds of data. Choosing the correct data type is crucial for efficient programming and preventing errors. Python automatically assigns a data type when you create a variable, but understanding the type is essential to perform mathematical operations, text processing, logical decisions, and more.</p>
          
          <p class="text-gray-300 mb-4">Common operations include arithmetic operations like addition and multiplication, comparison operations for decision-making, and logical operations to combine conditions. Python also supports sequence operations for strings, lists, and tuples, which allows slicing, indexing, and iteration. Understanding these operations ensures you can manipulate data effectively for practical applications, from simple calculations to complex algorithms.</p>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Key Data Types & Concepts</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Numeric Types</strong> – int, float, complex</li>
              <li><strong>Text Type</strong> – str (strings)</li>
              <li><strong>Boolean Type</strong> – True or False</li>
              <li><strong>Sequence Types</strong> – list, tuple, range</li>
              <li><strong>Set Types</strong> – set, frozenset</li>
              <li><strong>Mapping Type</strong> – dict</li>
              <li><strong>Operations</strong> – Arithmetic (+, -, *, /), Comparison (>, <, ==), Logical (and, or, not)</li>
          </ul>
          
          <h3 class="text-xl font-bold text-white mb-2 mt-6">Additional Notes</h3>
          <ul class="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Strings can be concatenated with <code>+</code> and repeated with <code>*</code></li>
              <li>Lists and tuples support indexing, slicing, and iteration</li>
              <li>Sets store unique elements only</li>
              <li>Dictionaries store key-value pairs for fast lookup</li>
              <li>Python is dynamically typed, so operations adapt based on the data type</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'Numeric Operations', 
            content: `a = 10 
b = 3 

# Arithmetic 
print("Addition:", a + b) 
print("Subtraction:", a - b) 
print("Multiplication:", a * b) 
print("Division:", a / b) 
print("Integer Division:", a // b) 
print("Modulus:", a % b) 
print("Exponent:", a ** b)` 
          },
          { 
            title: 'Boolean Operations', 
            content: `x = True 
y = False 

print("AND:", x and y) 
print("OR:", x or y) 
print("NOT x:", not x)` 
          },
          { 
            title: 'String Operations', 
            content: `text1 = "Hello" 
text2 = "World" 

print("Concatenation:", text1 + " " + text2) 
print("Repetition:", text1 * 3)` 
          },
          { 
            title: 'List & Dictionary Example', 
            content: `fruits = ["Apple", "Banana", "Mango"] 
person = {"name": "Alice", "age": 25} 

print(fruits[0])       # Access first element 
print(person["name"])  # Access dictionary value` 
          }
        ],
        liveCode: `# Python Data Types and Operations Example 

# Numeric 
num1 = 15 
num2 = 4 
print("Sum:", num1 + num2) 
print("Difference:", num1 - num2) 
print("Product:", num1 * num2) 
print("Division:", num1 / num2) 
print("Floor Division:", num1 // num2) 
print("Modulus:", num1 % num2) 
print("Exponent:", num1 ** num2) 

# Boolean 
is_student = True 
has_passed = False 
print("AND:", is_student and has_passed) 
print("OR:", is_student or has_passed) 
print("NOT is_student:", not is_student) 

# String 
greeting = "Hello" 
name = "Alice" 
message = greeting + ", " + name + "!" 
print(message) 
print("Repeat Greeting:", greeting * 2) 

# List 
fruits = ["Apple", "Banana", "Cherry"] 
fruits.append("Mango") 
print("Fruits:", fruits) 

# Dictionary 
person = {"name": "Alice", "age": 25} 
print("Name:", person["name"]) 
print("Age:", person["age"])`
      },
      { 
        title: 'Python Control Flow (If Statements and Loops)', 
        duration: '5 min', 
        language: 'python',
        content: `
          <h2 class="text-2xl font-bold text-white mb-4">Python Control Flow (If Statements and Loops)</h2>
          <p class="text-gray-300 mb-4">Control flow in Python determines the order in which statements are executed. By controlling flow, programs can make decisions, repeat tasks, and respond to different conditions, making them dynamic and intelligent.</p>
          <p class="text-gray-300 mb-4">Python primarily uses conditional statements (if, elif, else) to execute code based on certain conditions. Loops (for and while) are used to repeat tasks efficiently, avoiding repetitive code. Loops can also be combined with conditional statements to create complex logic.</p>
          <p class="text-gray-300 mb-4">Understanding control flow is fundamental for solving real-world problems, automating tasks, and building efficient algorithms. Proper use of control flow improves readability, maintainability, and performance of your programs.</p>

          <h3 class="text-xl font-bold text-white mb-2">Key Concepts/Types of Control Flow</h3>
          <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
            <li><strong>If Statements</strong> – Execute code if a condition is true.</li>
            <li><strong>If-Else Statements</strong> – Execute one block if true, another if false.</li>
            <li><strong>Elif (Else-If)</strong> – Handle multiple conditions sequentially.</li>
            <li><strong>For Loops</strong> – Iterate over sequences like lists, tuples, or ranges.</li>
            <li><strong>While Loops</strong> – Repeat a block while a condition remains true.</li>
            <li><strong>Break & Continue</strong> – Modify loop execution (stop or skip iterations).</li>
          </ul>

          <h3 class="text-xl font-bold text-white mb-2">Additional Notes</h3>
          <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
            <li>Conditions return Boolean values (True or False).</li>
            <li>Python uses indentation to define code blocks instead of braces.</li>
            <li>Nested if statements and loops allow complex logic and multi-level decision-making.</li>
            <li>Always avoid infinite loops by ensuring the condition will eventually become False.</li>
          </ul>
        `,
        syntax: [
          { 
            title: 'If Statement', 
            content: `if condition: 
    # execute this block` 
          },
          { 
            title: 'If-Else Statement', 
            content: `if condition: 
    # code if True 
else: 
    # code if False` 
          },
          { 
            title: 'Elif Statement', 
            content: `if condition1: 
    # code 
elif condition2: 
    # code 
else: 
    # code` 
          },
          { 
            title: 'For Loop', 
            content: `for i in range(5): 
    print(i)` 
          },
          { 
            title: 'While Loop', 
            content: `count = 0 
while count < 5: 
    print(count) 
    count += 1` 
          },
          { 
            title: 'Break & Continue', 
            content: `for i in range(10): 
    if i == 5: 
        break       # stops loop 
    if i % 2 == 0: 
        continue    # skips even numbers 
    print(i)` 
          }
        ],
        liveCode: `# Python Control Flow Example 

# Conditional Statements 
score = 85 

if score >= 90: 
    print("Grade: A") 
elif score >= 75: 
    print("Grade: B") 
elif score >= 60: 
    print("Grade: C") 
else: 
    print("Grade: D") 

# For Loop Example 
print("Numbers from 1 to 5:") 
for i in range(1, 6): 
    print(i) 

# While Loop Example 
count = 1 
print("Counting with while loop:") 
while count <= 5: 
    print(count) 
    count += 1 

# Break & Continue 
print("Odd numbers less than 10:") 
for i in range(10): 
    if i % 2 == 0: 
        continue 
    print(i)`
      }
    ]
  }
];

// --- Components ---

const Sidebar = ({
  activeTab,
  setActiveTab,
  activeModuleId,
  setActiveModuleId,
  activeLessonIndex,
  setActiveLessonIndex,
  completedLessons
}: {
  activeTab: 'outline' | 'resources';
  setActiveTab: (tab: 'outline' | 'resources') => void;
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  completedLessons: Set<string>;
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([activeModuleId]));
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-expand the active module when it changes
  useEffect(() => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      newSet.add(activeModuleId);
      return newSet;
    });
  }, [activeModuleId]);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredModules = courseData.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.lessons.some(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-[350px] bg-[#1e1e1e] border-r border-[#333] flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#333]">
        <button
          onClick={() => setActiveTab('outline')}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'outline'
            ? 'border-[#00bceb] text-white bg-[#252526]'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            Course Outline
          </div>
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'resources'
            ? 'border-[#00bceb] text-white bg-[#252526]'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Resources
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#333]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search course outline"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 pl-9 text-sm text-gray-300 focus:outline-none focus:border-[#00bceb] transition-colors placeholder-gray-600"
          />
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'outline' ? (
          <div className="pb-4">
            <div className="px-4 py-4 flex items-center justify-between hover:bg-[#2d2d2d] cursor-pointer transition-colors border-b border-[#333]">
              <div>
                 <span className="text-sm font-semibold text-white block">Course Introduction</span>
                 <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mt-2 w-32">
                    <div className="bg-green-500 h-full w-full" />
                 </div>
              </div>
              <div className="flex flex-col items-end">
                 <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                 <span className="text-xs text-gray-400">100%</span>
              </div>
            </div>

            {filteredModules.map(module => {
              const isExpanded = expandedModules.has(module.id);
              const isActive = activeModuleId === module.id;
              
              // Calculate progress for this module (mock logic)
              const moduleCompletedLessons = module.lessons.filter((_, idx) =>
                completedLessons.has(`${module.id}-${idx}`)
              ).length;
              const progressPercent = Math.round((moduleCompletedLessons / module.lessons.length) * 100);

              return (
                <div key={module.id} className="border-b border-[#333]">
                  <div
                    onClick={() => toggleModule(module.id)}
                    className={`px-4 py-4 cursor-pointer hover:bg-[#2d2d2d] transition-colors ${isActive ? 'bg-[#2d2d2d]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white leading-tight mb-2">{module.title}</h3>
                        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between h-full gap-2">
                        {isExpanded ? (
                          <div className="bg-[#3e3e42] p-1 rounded hover:bg-[#4e4e52]">
                             <ChevronDown className="w-4 h-4 text-gray-300" />
                          </div>
                        ) : (
                          <div className="bg-[#3e3e42] p-1 rounded hover:bg-[#4e4e52]">
                             <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                        <span className="text-xs text-gray-400">{progressPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-[#121212] py-2">
                      {module.lessons.map((lesson, idx) => {
                        const lessonKey = `${module.id}-${idx}`;
                        const isCompleted = completedLessons.has(lessonKey);
                        const isLessonActive = isActive && activeLessonIndex === idx;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setActiveModuleId(module.id);
                              setActiveLessonIndex(idx);
                            }}
                            className={clsx(
                              'pl-6 pr-4 py-3 cursor-pointer flex items-center gap-3 transition-colors relative',
                              isLessonActive
                                ? 'bg-[#2d2d2d]'
                                : 'hover:bg-[#1e1e1e]'
                            )}
                          >
                             {/* Active indicator line */}
                             {isLessonActive && (
                               <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-500" />
                             )}

                             {/* Status Icon */}
                             <div className="flex-shrink-0 z-10">
                                {isCompleted ? (
                                   <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isLessonActive ? 'border-green-500' : 'border-gray-600'}`}>
                                      {isLessonActive && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                   </div>
                                )}
                             </div>

                             {/* Dashed line connector */}
                             {idx !== module.lessons.length - 1 && (
                                <div className="absolute left-[33px] top-[30px] bottom-[-14px] w-[1px] border-l border-dashed border-gray-600 z-0" />
                             )}

                            <div className="flex-1 min-w-0">
                              <div className={clsx(
                                'text-sm font-medium truncate mb-0.5',
                                isLessonActive ? 'text-white' : 'text-gray-400'
                              )}>
                                {module.id.split('-')[1]}.{idx + 1} {lesson.title}
                              </div>
                            </div>
                            
                            <span className="text-xs text-gray-600">{lesson.duration}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4">
            {resources.map((res, idx) => (
              <div key={idx} className="mb-4 p-3 bg-[#2d2d2d] rounded hover:bg-[#333] transition-colors cursor-pointer border border-[#333]">
                <div className="flex items-center gap-2 mb-2">
                  {res.type === 'video' ? <PlayCircle className="w-4 h-4 text-[#00bceb]" /> : <FileText className="w-4 h-4 text-orange-400" />}
                  <span className="text-xs font-medium text-gray-400 uppercase">{res.type}</span>
                </div>
                <h4 className="text-sm font-medium text-white mb-1">{res.title}</h4>
                <p className="text-xs text-gray-400 mb-2">{res.description}</p>
                <span className="text-xs text-gray-500">{res.duration}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


type ChatPanelProps = {
  isDark: boolean;
  messages: ChatMessage[];
  loading: boolean;
  onSend: (text: string) => void;
};

function ChatPanel({ isDark, messages, loading, onSend }: ChatPanelProps) {
  const [text, setText] = React.useState('');

  const handleSend = () => {
    if (text.trim() && !loading) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <aside
      className={`${
        isDark
          ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/20'
          : 'bg-gradient-to-br from-white/70 to-white/40 border-gray-300/40'
      } backdrop-blur-2xl backdrop-saturate-150 w-full h-full rounded-2xl border p-4 flex flex-col shadow-lg ring-1 ${
        isDark ? 'ring-white/10' : 'ring-white/60'
      }`}
    >
      <div
        className={`flex flex-col items-start gap-0.5 pb-3 border-b ${
          isDark ? 'border-white/20 bg-white/10' : 'border-[#14A38F]/30 bg-white/60'
        } backdrop-blur-xl rounded-lg px-3 py-2`}
      >
        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#14A38F]'}`}>Personal Teacher</h3>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ask me anything about the components</span>
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto space-y-4 py-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`${
                msg.role === 'assistant'
                  ? isDark
                    ? 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                    : 'bg-[#14A38F] text-white border border-[#14A38F]'
                  : isDark
                  ? 'bg-black/60 backdrop-blur-xl text-white border border-white/20'
                  : 'bg-blue-600/70 backdrop-blur-xl text-white border border-blue-300/40'
              } max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap break-words leading-relaxed text-[15px]`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className={`${
                isDark ? 'bg-white/10 backdrop-blur-xl border border-white/20' : 'bg-[#14A38F] border border-[#14A38F]'
              } rounded-2xl px-4 py-3 shadow-sm`}
            >
              <span className={`text-sm ${isDark ? 'text-white/70' : 'text-white/90'}`}>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t space-y-3">
        <div
          className={`flex items-center gap-2 ${
            isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40'
          } backdrop-blur-xl rounded-xl border p-2 shadow-sm`}
        >
          <button
            className={`p-2 rounded ${isDark ? 'hover:bg-white/15' : 'hover:bg-white'} shrink-0`}
            aria-label="Voice input (not implemented)"
          >
            <Mic className={`h-5 w-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`} />
          </button>
          <input
            type="text"
            className={`flex-1 bg-transparent outline-none min-w-0 ${
              isDark ? 'text-white placeholder-white/60' : 'text-gray-900 placeholder-gray-600'
            }`}
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            disabled={loading}
          />
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isDark ? 'bg-white text-gray-900' : 'bg-[#14A38F] text-white'
            } disabled:opacity-50 shrink-0`}
            onClick={handleSend}
            disabled={loading || !text.trim()}
          >
            <Send className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </aside>
  );
}

const CourseLearningFrontendBeginner: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [activeTab, setActiveTab] = useState<'outline' | 'resources'>('outline');
  const [activeModuleId, setActiveModuleId] = useState<string>('module-1');
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(['module-1-0']));
  
  // Content Tab State
  const [activeContentTab, setActiveContentTab] = useState<'lesson' | 'syntax' | 'live-code'>('lesson');

  // Live Code State
  const [liveCode, setLiveCode] = useState(`<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; padding: 20px; color: white; background: #121212; }
  h1 { color: #00bceb; }
</style>
</head>
<body>

<h1>Hello World</h1>
<p>This is a live preview.</p>

<script>
  console.log("Hello from JavaScript!");
</script>

</body>
</html>`);
  const [previewKey, setPreviewKey] = useState(0);

  const handleRunCode = () => {
    setPreviewKey(prev => prev + 1);
  };
  
  // Identify current module/lesson
  const activeModule = useMemo(() => courseData.find(m => m.id === activeModuleId), [activeModuleId]);
  const activeLesson = useMemo(() => activeModule?.lessons[activeLessonIndex], [activeModule, activeLessonIndex]);

  // Update live code when lesson changes
  useEffect(() => {
    if (activeLesson?.liveCode) {
      setLiveCode(activeLesson.liveCode);
    } else {
      // Default code if none provided
      setLiveCode(`<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; padding: 20px; color: white; background: #121212; }
  h1 { color: #00bceb; }
</style>
</head>
<body>

<h1>Hello World</h1>
<p>This is a live preview.</p>

<script>
  console.log("Hello from JavaScript!");
</script>

</body>
</html>`);
    }
  }, [activeLesson]);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your personal frontend development teacher. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    const newMsg: ChatMessage = { role: 'user', content: text };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setLoading(true);

    try {
      // Use course context for better AI responses
      const answer = await askLLM(text, updated, {
        courseContext: {
          courseName: 'Frontend Development Beginner',
          moduleName: activeModule?.title,
          lessonTitle: activeLesson?.title,
          lessonContent: activeLesson?.content.replace(/<[^>]*>/g, '').substring(0, 1500)
        }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI tutor.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render text with clickable links
  const renderContentWithLinks = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#00bceb] hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };



  // Sync slug with active module if needed, or just default to module-1
  useEffect(() => {
    if (slug && slug !== activeModuleId) {
       const found = courseData.find(m => m.id === slug);
       if (found) setActiveModuleId(slug);
    }
  }, [slug]);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Navigation Handlers
  const handlePrev = () => {
    if (activeLessonIndex > 0) {
       setActiveLessonIndex(activeLessonIndex - 1);
    } else {
       const currentModuleIndex = courseData.findIndex(m => m.id === activeModuleId);
       if (currentModuleIndex > 0) {
          const prevModule = courseData[currentModuleIndex - 1];
          setActiveModuleId(prevModule.id);
          setActiveLessonIndex(prevModule.lessons.length - 1);
       }
    }
  };

  const handleNext = () => {
    if (activeLessonIndex < (activeModule?.lessons.length || 0) - 1) {
       setActiveLessonIndex(activeLessonIndex + 1);
    } else {
       const currentModuleIndex = courseData.findIndex(m => m.id === activeModuleId);
       if (currentModuleIndex < courseData.length - 1) {
          const nextModule = courseData[currentModuleIndex + 1];
          setActiveModuleId(nextModule.id);
          setActiveLessonIndex(0);
       }
    }
  };

  const isPrevDisabled = activeLessonIndex === 0 && activeModuleId === courseData[0].id;
  const isNextDisabled = activeLessonIndex === (activeModule?.lessons.length || 0) - 1 && activeModuleId === courseData[courseData.length - 1].id;

  if (!activeModule || !activeLesson) return <div>Loading...</div>;

  return (
    <div className="bg-[#121212] text-white overflow-hidden font-sans h-screen">
      <div className="flex h-full">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          activeModuleId={activeModuleId}
          setActiveModuleId={setActiveModuleId}
          activeLessonIndex={activeLessonIndex}
          setActiveLessonIndex={setActiveLessonIndex}
          completedLessons={completedLessons}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
         {/* Top Navigation Bar (Breadcrumbs & Tools) */}
         <div className="h-[50px] bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4 z-20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <span className="cursor-pointer hover:text-white" onClick={() => navigate('/frontend-development-beginner')}>Frontend Development Beginner</span>
               <ChevronRight className="w-4 h-4" />
               <span className="text-white truncate max-w-[300px]">{activeLesson.title}</span>
            </div>
            <div className="flex items-center gap-4">
               {/* Navigation Controls */}
               <div className="flex items-center gap-1 bg-[#333] rounded-lg p-1 mr-2">
                  <button 
                     onClick={handlePrev}
                     disabled={isPrevDisabled}
                     className="p-1.5 text-gray-400 hover:text-white hover:bg-[#444] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     title="Previous Lesson"
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                     onClick={() => navigate('/student-portal')}
                     className="p-1.5 text-gray-400 hover:text-white hover:bg-[#444] rounded transition-colors"
                     title="Student Portal"
                  >
                     <Home className="w-4 h-4" />
                  </button>
                  <button 
                     onClick={handleNext}
                     disabled={isNextDisabled}
                     className="p-1.5 text-gray-400 hover:text-white hover:bg-[#444] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     title="Next Lesson"
                  >
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>

               <button onClick={toggleTheme} className="text-gray-400 hover:text-white" title="Toggle Theme">
                  {isDark ? '☀' : '☾'}
               </button>
               <span className="text-xs font-bold bg-[#333] px-2 py-1 rounded text-white">EN</span>
            </div>
         </div>

         {/* Main Content & Chat Wrapper */}
         <div className="flex-1 flex overflow-hidden">
             {/* Content Scroll Area - Wraps Hero, Tabs, and Body */}
             <div id="content-scroll-area" className="flex-1 overflow-y-auto relative">
             {/* Hero / Banner Section */}
             <div className="relative w-full h-[300px] shrink-0">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop" 
                  alt="Frontend Development" 
                  className="w-full h-full object-cover"
                />
                
                {/* Content Over Image */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                   <div className="max-w-4xl mx-auto">
                      <div className="flex items-center gap-2 mb-4">
                         <span className="bg-[#00bceb] text-black text-xs font-bold px-2 py-1 rounded">BEGINNER</span>
                         <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> UPDATED 2024
                         </span>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                         {activeLesson.title}
                      </h1>
                      <p className="text-gray-200 text-lg max-w-2xl drop-shadow-md">
                         {activeModule.description}
                      </p>
                   </div>
                </div>
             </div>

             {/* Sticky Tabs Bar */}
             <div className="sticky top-0 z-30 flex items-center gap-6 px-8 lg:px-16 border-b border-[#333] bg-[#1e1e1e] shrink-0">
                <button 
                   onClick={() => setActiveContentTab('lesson')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'lesson' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <BookOpen className="w-4 h-4" /> Lesson
                </button>
                <button 
                   onClick={() => setActiveContentTab('syntax')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'syntax' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <Code className="w-4 h-4" /> Syntax
                </button>
                <button 
                   onClick={() => setActiveContentTab('live-code')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'live-code' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <PlayCircle className="w-4 h-4" /> Live Code
                </button>
             </div>

             {/* Tab Content */}
             <div className="p-8 lg:p-16 max-w-5xl mx-auto min-h-[500px]">
                {activeContentTab === 'lesson' && (
                   <div className="animate-fadeIn">
                      {activeLesson.videoUrl && (
                        <div className="mb-8 aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-[#333]">
                           <iframe 
                              src={activeLesson.videoUrl} 
                              title={activeLesson.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                           />
                        </div>
                      )}
                      <div 
                        className="prose prose-invert prose-lg max-w-none mb-12"
                        dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                      ></div>
                   </div>
                )}

                {activeContentTab === 'syntax' && (
                   <div className="animate-fadeIn space-y-8">
                      {activeLesson.syntax ? (
                         activeLesson.syntax.map((item, idx) => (
                            <div key={idx} className="bg-[#1e1e1e] rounded-xl border border-gray-700 overflow-hidden">
                               <div className="p-4 border-b border-gray-700 bg-[#252526] flex justify-between items-center">
                                  <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                                     <Code size={18} className="text-[#00bceb]" />
                                     {item.title}
                                  </h3>
                                  <button 
                                     onClick={() => handleCopy(item.content, 100 + idx)}
                                     className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs bg-black/20 px-2 py-1 rounded border border-white/5 transition-colors"
                                  >
                                     {copiedIndex === 100 + idx ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                     {copiedIndex === 100 + idx ? 'Copied!' : 'Copy Code'}
                                  </button>
                               </div>
                               <div className="p-0 overflow-x-auto">
                                  <pre className="text-sm font-mono leading-relaxed p-4 text-gray-300">
                                     <code>{item.content}</code>
                                  </pre>
                               </div>
                            </div>
                         ))
                      ) : (
                         <div className="text-center text-gray-500 py-10">
                            <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No syntax examples for this lesson.</p>
                         </div>
                      )}
                   </div>
                )}

                {activeContentTab === 'live-code' && (
                   <div className="animate-fadeIn h-[600px] flex flex-col border border-[#333] rounded-xl overflow-hidden shadow-2xl">
                      {/* Toolbar */}
                      <div className="bg-[#1e1e1e] p-2 border-b border-[#333] flex justify-between items-center">
                         <div className="flex items-center gap-2 px-2">
                           <div className="w-3 h-3 rounded-full bg-red-500"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500"></div>
                           <span className="text-xs text-gray-400 ml-2">
                              {activeLesson.language === 'python' ? 'Python Playground' : 'HTML / CSS / JS Playground'}
                           </span>
                         </div>
                         {activeLesson.language !== 'python' && (
                            <button
                               onClick={handleRunCode}
                               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                            >
                               <PlayCircle className="w-4 h-4" /> Run Code
                            </button>
                         )}
                      </div>

                      <div className="flex-1 flex min-h-0 bg-[#0d0d0d]">
                         {activeLesson.language === 'python' ? (
                            <div className="w-full h-full flex flex-col p-4">
                               <div className="mb-4 bg-[#1e1e1e] p-4 rounded-lg border border-[#333]">
                                  <h4 className="text-white text-sm font-bold mb-2 flex items-center gap-2">
                                     <Code className="w-4 h-4 text-[#00bceb]" />
                                     Sample Code (Copy this to the compiler below)
                                  </h4>
                                  <div className="relative">
                                      <pre className="text-sm font-mono text-gray-300 bg-black/30 p-3 rounded overflow-x-auto">
                                          {activeLesson.liveCode}
                                      </pre>
                                      <button 
                                          onClick={() => {
                                              if (activeLesson.liveCode) {
                                                  navigator.clipboard.writeText(activeLesson.liveCode);
                                                  alert('Code copied to clipboard!');
                                              }
                                          }}
                                          className="absolute top-2 right-2 text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
                                      >
                                          Copy
                                      </button>
                                  </div>
                               </div>
                               <div className="flex-1 rounded-lg overflow-hidden border border-[#333] bg-white">
                                  <iframe 
                                      src="https://trinket.io/embed/python3?runOption=run" 
                                      width="100%" 
                                      height="100%" 
                                      frameBorder="0" 
                                      marginWidth={0} 
                                      marginHeight={0} 
                                      allowFullScreen
                                      title="Python Compiler"
                                  ></iframe>
                               </div>
                            </div>
                         ) : (
                            <>
                               {/* Editor */}
                               <div className="w-1/2 border-r border-[#333] flex flex-col bg-[#0d0d0d] relative">
                                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-bl">EDITOR</div>
                                  <textarea
                                     value={liveCode}
                                     onChange={(e) => setLiveCode(e.target.value)}
                                     className="flex-1 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 outline-none resize-none custom-scrollbar"
                                     spellCheck={false}
                                     placeholder="<!-- Write your HTML, CSS, and JS here -->"
                                  />
                               </div>

                               {/* Preview */}
                               <div className="w-1/2 bg-white relative">
                                   <div className="absolute top-0 right-0 bg-gray-600 text-white text-[10px] px-2 py-0.5 rounded-bl z-10">PREVIEW</div>
                                   <iframe
                                      key={previewKey}
                                      srcDoc={liveCode}
                                      title="Live Preview"
                                      className="w-full h-full border-none"
                                      sandbox="allow-scripts allow-modals"
                                   />
                               </div>
                            </>
                         )}
                      </div>
                   </div>
                )}
             </div>

             {/* Footer Spacer */}
             <div className="h-32"></div>
         </div>

             {/* Right Side Chat Panel (Desktop) */}
              <div className="hidden lg:block w-[350px] shrink-0 border-l border-[#333] bg-[#1e1e1e] p-4">
                  <ChatPanel isDark={isDark} messages={messages} loading={loading} onSend={handleSendMessage} />
              </div>
         </div>
        </div>
      </div>


    </div>
  );
};

export default CourseLearningFrontendBeginner;
