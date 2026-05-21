import type { CommunityMessage, SubscriptionState } from '@/store/community-store';
import { getApiBaseUrl } from '@/lib/backend-url';

const API_BASE = getApiBaseUrl();

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function parseJsonResponse(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      res.ok ? 'Invalid server response' : `Server error (${res.status}). Is the backend running on port 5000?`
    );
  }
}

export async function fetchSubscription(token: string): Promise<SubscriptionState> {
  const res = await fetch(`${API_BASE}/community/subscription`, {
    headers: authHeaders(token),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to load subscription (${res.status})`);
  }
  return json.data;
}

export async function recordTrialView(
  token: string,
  messageId: string
): Promise<{ allowed: boolean; data: SubscriptionState }> {
  const res = await fetch(`${API_BASE}/community/subscription/record-view`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ messageId }),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to record view');
  }
  return { allowed: json.allowed !== false, data: json.data as SubscriptionState };
}

export async function startFreeTrial(token: string): Promise<SubscriptionState> {
  const res = await fetch(`${API_BASE}/community/subscription/trial`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to start free trial');
  }
  return json.data as SubscriptionState;
}

export async function skipDevPayment(token: string): Promise<SubscriptionState> {
  const res = await fetch(`${API_BASE}/community/subscription/dev-skip`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Dev skip failed');
  }
  return fetchSubscription(token);
}

export async function activatePlan(token: string, plan: 'basic' | 'premium'): Promise<SubscriptionState> {
  const res = await fetch(`${API_BASE}/community/subscription`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ plan }),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Activation failed');
  }
  return fetchSubscription(token);
}

export async function fetchMessages(
  token: string,
  cursor?: string | null
): Promise<{ messages: CommunityMessage[]; nextCursor: string | null; hasMore: boolean }> {
  const params = new URLSearchParams({ limit: '20' });
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`${API_BASE}/community/messages?${params}`, {
    headers: authHeaders(token),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    const err = new Error(json.message || 'Failed to load feed') as Error & {
      code?: string;
      data?: SubscriptionState;
    };
    err.code = json.code;
    err.data = json.data;
    throw err;
  }
  return json.data as {
    messages: import('@/store/community-store').CommunityMessage[];
    nextCursor: string | null;
    hasMore: boolean;
    subscription?: SubscriptionState;
  };
}

export async function fetchReplies(token: string, parentId: string): Promise<CommunityMessage[]> {
  const res = await fetch(`${API_BASE}/community/messages/${parentId}/replies`, {
    headers: authHeaders(token),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to load replies');
  }
  return json.data;
}

export async function uploadCommunityImages(
  token: string,
  files: File[]
): Promise<{ urls: string[]; maxImagesPerPost: number }> {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  const res = await fetch(`${API_BASE}/community/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Image upload failed');
  }
  return json.data;
}

export async function postMessage(
  token: string,
  message: string,
  parentId?: string,
  images?: string[]
): Promise<{ message: CommunityMessage; subscription?: SubscriptionState }> {
  const res = await fetch(`${API_BASE}/community/messages`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ message, parentId, images: images || [] }),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    const err = new Error(json.message || 'Failed to post') as Error & {
      code?: string;
      data?: SubscriptionState;
    };
    err.code = json.code;
    err.data = json.data;
    throw err;
  }
  return { message: json.data, subscription: json.subscription };
}

export async function toggleLike(
  token: string,
  messageId: string
): Promise<{ id: string; likesCount: number; likedByMe: boolean }> {
  const res = await fetch(`${API_BASE}/community/messages/${messageId}/like`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to like');
  }
  return json.data;
}

export async function editMessage(token: string, id: string, message: string): Promise<CommunityMessage> {
  const res = await fetch(`${API_BASE}/community/messages/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ message }),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to edit');
  }
  return json.data;
}

export async function deleteMessage(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/community/messages/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete');
  }
}
