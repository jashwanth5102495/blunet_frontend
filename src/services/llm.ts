import axios from 'axios';

// Backend URL configuration - use VITE_BACKEND_URL in production, fallback to localhost only in development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string || 'http://localhost:5000';
console.log('🌐 Backend URL:', BACKEND_URL);

/**
 * Chat message interface for conversation history
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Course context for enhanced AI responses
 */
export interface CourseContext {
  courseName: string;
  moduleName?: string;
  lessonTitle?: string;
  lessonContent?: string;
}

/**
 * Options for the askLLM function
 */
export interface AskLLMOptions {
  /** Custom system prompt to override default behavior */
  systemPrompt?: string;
  /** Course context for contextual responses */
  courseContext?: CourseContext;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Send a question to the AI tutor and get a response
 * 
 * @param question - The user's question
 * @param history - Previous conversation messages (optional)
 * @param options - Additional options for customization (optional)
 * @returns The AI's response text
 * @throws Error if all backend candidates fail
 * 
 * @example
 * // Simple question
 * const answer = await askLLM("What is a router?");
 * 
 * @example
 * // With conversation history
 * const answer = await askLLM("Can you explain more?", conversationHistory);
 * 
 * @example
 * // With course context for better responses
 * const answer = await askLLM("Explain this concept", history, {
 *   courseContext: {
 *     courseName: "Networking Beginner",
 *     moduleName: "Module 1",
 *     lessonTitle: "Introduction to Networks"
 *   }
 * });
 */
export async function askLLM(
  question: string, 
  history: ChatMessage[] = [],
  options: AskLLMOptions = {}
): Promise<string> {
  // 5 minute timeout to match backend timeout
  const { systemPrompt, courseContext, timeout = 300000 } = options;
  
  // Validate question before making request
  if (!question || typeof question !== 'string' || question.trim() === '') {
    throw new Error('Question cannot be empty');
  }
  
  const trimmedQuestion = question.trim();
  
  console.log('🤖 [LLM] Starting askLLM request (timeout:', timeout, 'ms)');
  console.log('🤖 [LLM] Backend URL:', BACKEND_URL);
  console.log('🤖 [LLM] Question:', trimmedQuestion.substring(0, 50) + '...');
  
  try {
    console.log(`🤖 [LLM] Sending to: ${BACKEND_URL}/api/llm/chat`);
    console.log('🤖 [LLM] Request body:', { question: trimmedQuestion.substring(0, 50), historyLength: history?.length });
    
    const resp = await axios.post(
      `${BACKEND_URL}/api/llm/chat`, 
      { 
        question: trimmedQuestion, 
        history,
        systemPrompt,
        courseContext
      },
      {
        timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('🤖 [LLM] Response received:', resp.status, resp.data?.success);
    
    if (resp.data?.success) {
      console.log('🤖 [LLM] SUCCESS! Answer length:', resp.data.answer?.length);
      return resp.data.answer as string;
    }
    
    // Non-success response from backend
    console.log('🤖 [LLM] Backend returned success=false:', resp.data?.message);
    throw new Error(resp.data?.message || 'LLM backend error');
  } catch (err: unknown) {
    console.log(`🤖 [LLM] Error:`, err);
    const error = err as Error & { response?: { data?: { message?: string } } };
    const message = error?.response?.data?.message || error?.message || 'AI tutor is temporarily unavailable';
    console.log('🤖 [LLM] Final error:', message);
    throw new Error(message);
  }
}

/**
 * Check the health of the LLM service
 * 
 * @returns Health status object with provider info and available models
 */
export async function checkLLMHealth(): Promise<{
  success: boolean;
  provider?: string;
  model?: string;
  availableModels?: string[];
  error?: string;
}> {
  try {
    const resp = await axios.get(`${BACKEND_URL}/api/llm/health`, { timeout: 5000 });
    if (resp.data?.success) {
      return resp.data;
    }
    return { success: false, error: 'LLM service unavailable' };
  } catch {
    return { success: false, error: 'LLM service unavailable' };
  }
}

/**
 * Build a system prompt for a specific course
 * Helper function to create consistent system prompts across components
 * 
 * @param courseName - Name of the course
 * @param specialization - Optional specialization (e.g., "networking", "cyber security")
 * @returns A formatted system prompt string
 */
export function buildCourseSystemPrompt(
  courseName: string, 
  specialization?: string
): string {
  const specializationText = specialization 
    ? `You specialize in ${specialization} topics.` 
    : '';
    
  return `You are an expert tutor for the "${courseName}" course. ${specializationText}

Your role is to:
- Explain concepts clearly and step-by-step
- Provide practical examples and code snippets when relevant
- Adapt explanations to the student's level
- Be encouraging and supportive
- Answer questions related to the current lesson content

If a question is outside the course scope, politely guide the student back to relevant topics.`;
}