import React from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { FileNode } from './FolderStructure';

interface CodeViewerProps {
  file: FileNode | null;
  onCopy?: () => void;
  copied?: boolean;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ file, onCopy, copied }) => {
  if (!file || !file.content) {
    return (
      <div className="h-full bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400 dark:text-gray-500">
          <svg className="w-20 h-20 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">No file selected</h3>
          <p className="text-sm max-w-md mx-auto leading-relaxed">
            Choose a file from the explorer panel to view its contents and understand the project structure.
          </p>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            💡 Tip: Click on any file name in the left panel
          </div>
        </div>
      </div>
    );
  }

  const getLanguageClass = (language?: string) => {
    switch (language?.toLowerCase()) {
      case 'html':
        return 'language-html';
      case 'css':
        return 'language-css';
      case 'javascript':
      case 'js':
        return 'language-javascript';
      case 'typescript':
      case 'ts':
        return 'language-typescript';
      case 'json':
        return 'language-json';
      default:
        return 'language-text';
    }
  };

  const formatCode = (code: string) => {
    // Basic syntax highlighting for common languages
    if (!file.language) return code;

    let formattedCode = code;
    
    switch (file.language.toLowerCase()) {
      case 'html':
        formattedCode = code
          .replace(/(&lt;\/?[^&gt;]+&gt;)/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>')
          .replace(/(\w+)=/g, '<span class="text-green-600 dark:text-green-400">$1</span>=')
          .replace(/="([^"]*)"/g, '="<span class="text-yellow-600 dark:text-yellow-400">$1</span>"');
        break;
      case 'css':
        formattedCode = code
          .replace(/([.#]?[\w-]+)\s*{/g, '<span class="text-blue-600 dark:text-blue-400">$1</span> {')
          .replace(/(\w[\w-]*):([^;]+);/g, '<span class="text-green-600 dark:text-green-400">$1</span>:<span class="text-yellow-600 dark:text-yellow-400">$2</span>;')
          .replace(/\/\*([^*]|\*[^/])*\*\//g, '<span class="text-gray-500 dark:text-gray-400">$&</span>');
        break;
      case 'javascript':
      case 'js':
        formattedCode = code
          .replace(/\b(const|let|var|function|if|else|for|while|return|class|import|export|from)\b/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
          .replace(/\/\/.*$/gm, '<span class="text-gray-500 dark:text-gray-400">$&</span>')
          .replace(/"([^"]*)"/g, '"<span class="text-green-600 dark:text-green-400">$1</span>"')
          .replace(/'([^']*)'/g, "'<span class=\"text-green-600 dark:text-green-400\">$1</span>'");
        break;
    }
    
    return formattedCode;
  };

  const handleCopyCode = async () => {
    if (file.content) {
      try {
        await navigator.clipboard.writeText(file.content);
        onCopy?.();
      } catch (err) {
        
      }
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Action Bar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {file.language && (
            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">
              {file.language.toUpperCase()}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {file.content.split('\n').length} lines
          </span>
        </div>
        
        <button
          onClick={handleCopyCode}
          className={`flex items-center px-3 py-1.5 text-xs rounded font-medium transition-all duration-200 ${
            copied 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <ClipboardIcon className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
      
      {/* Code Content */}
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="relative min-h-full">
            {/* Line numbers background */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"></div>
            
            {/* Line numbers */}
            <div className="absolute left-0 top-0 w-12 text-right pr-3 pt-4 text-xs text-gray-500 dark:text-gray-400 font-mono leading-6 select-none">
              {file.content.split('\n').map((_, index) => (
                <div key={index + 1} className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  {index + 1}
                </div>
              ))}
            </div>
            
            {/* Code content */}
            <div className="ml-14 p-4">
              <pre className="text-sm font-mono leading-6 text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code 
                  className={`${getLanguageClass(file.language)} block`}
                  dangerouslySetInnerHTML={{ __html: formatCode(file.content) }}
                />
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
