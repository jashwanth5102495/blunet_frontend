import axios from 'axios';

const ENV_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;
const DEFAULTS = ['http://localhost:5000', 'http://localhost:5001'];
const BASE_CANDIDATES = ENV_URL ? [ENV_URL, ...DEFAULTS.filter(u => u !== ENV_URL)] : DEFAULTS;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function askLLM(question: string, history: ChatMessage[] = []): Promise<string> {
  let lastErr: any;
  for (const base of BASE_CANDIDATES) {
    try {
      const resp = await axios.post(`${base}/api/llm/chat`, { question, history }, { timeout: 15000 });
      if (resp.data?.success) {
        return resp.data.answer as string;
      }
      // Non-success with message from backend
      lastErr = new Error(resp.data?.message || 'LLM backend error');
    } catch (err: any) {
      // Network or CORS error; try next candidate
      lastErr = err;
      continue;
    }
  }
  const message = (lastErr?.response?.data?.message) || lastErr?.message || 'LLM backend error';
  throw new Error(message);
}