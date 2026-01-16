import axios from 'axios';

// Backend URL configuration
const ENV_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;
console.log(ENV_URL);
const DEFAULTS = ['http://localhost:5000'];
const BASE_CANDIDATES = ENV_URL ? [ENV_URL, ...DEFAULTS.filter(u => u !== ENV_URL)] : DEFAULTS;

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
  // Increased timeout to 120 seconds for slower machines running local LLMs
  const { systemPrompt, courseContext, timeout = 120000 } = options;
  
  let lastErr: Error | null = null;
  
  console.log('🤖 [LLM] Starting askLLM request (timeout:', timeout, 'ms)');
  console.log('🤖 [LLM] BASE_CANDIDATES:', BASE_CANDIDATES);
  
  for (const base of BASE_CANDIDATES) {
    try {
      console.log(`🤖 [LLM] Trying: ${base}/api/llm/chat`);
      const resp = await axios.post(
        `${base}/api/llm/chat`, 
        { 
          question, 
          history,
          systemPrompt,
          courseContext
        }, 
        { timeout }
      );
      
      console.log('🤖 [LLM] Response received:', resp.status, resp.data?.success);
      
      if (resp.data?.success) {
        console.log('🤖 [LLM] SUCCESS! Answer length:', resp.data.answer?.length);
        return resp.data.answer as string;
      }
      
      // Non-success response from backend
      console.log('🤖 [LLM] Backend returned success=false:', resp.data?.message);
      lastErr = new Error(resp.data?.message || 'LLM backend error');
    } catch (err: unknown) {
      // Network, CORS, or timeout error; try next candidate
      console.log(`🤖 [LLM] Error with ${base}:`, err);
      lastErr = err instanceof Error ? err : new Error('Unknown error');
      continue;
    }
  }
  
  // All candidates failed
  const message = (lastErr as Error & { response?: { data?: { message?: string } } })?.response?.data?.message 
    || lastErr?.message 
    || 'AI tutor is temporarily unavailable';
  console.log('🤖 [LLM] All candidates failed. Final error:', message);
  throw new Error(message);
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
  for (const base of BASE_CANDIDATES) {
    try {
      const resp = await axios.get(`${base}/api/llm/health`, { timeout: 5000 });
      if (resp.data?.success) {
        return resp.data;
      }
    } catch {
      continue;
    }
  }
  return { success: false, error: 'LLM service unavailable' };
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