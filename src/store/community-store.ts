import { create } from 'zustand';

export type CommunityMessage = {
  id: string;
  userId: string;
  username: string;
  profileImage: string;
  message: string;
  images?: string[];
  timestamp: string;
  likesCount: number;
  replyCount: number;
  parentId: string | null;
  likedByMe?: boolean;
  editedAt?: string | null;
};

export type SubscriptionState = {
  plan: 'none' | 'trial' | 'basic' | 'premium';
  messageLimit: number;
  messagesUsed: number;
  messagesRemaining: number;
  viewLimit?: number | null;
  viewsUsed?: number | null;
  viewsRemaining?: number | null;
  hasAccess: boolean;
  canPost?: boolean;
  premiumAccess: boolean;
  sendLimitReached?: boolean;
  viewLimitReached?: boolean;
  trialExhausted?: boolean;
  trialFullyExhausted?: boolean;
  trialAvailable?: boolean;
  canContinueTrial?: boolean;
  trialUsed?: boolean;
  maxImagesPerPost?: number;
  expiresAt?: string | null;
  isExpired?: boolean;
  renewalRequired?: boolean;
};

type CommunityStore = {
  messages: CommunityMessage[];
  repliesByParent: Record<string, CommunityMessage[]>;
  subscription: SubscriptionState | null;
  nextCursor: string | null;
  hasMore: boolean;
  loading: boolean;
  posting: boolean;
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
  setSubscription: (sub: SubscriptionState | null) => void;
  setMessages: (messages: CommunityMessage[], nextCursor: string | null, hasMore: boolean, append?: boolean) => void;
  prependMessage: (msg: CommunityMessage) => void;
  updateMessage: (msg: CommunityMessage) => void;
  removeMessage: (id: string, parentId: string | null) => void;
  updateLike: (id: string, likesCount: number, likedByMe: boolean) => void;
  setReplies: (parentId: string, replies: CommunityMessage[]) => void;
  addReply: (parentId: string, reply: CommunityMessage) => void;
  setLoading: (v: boolean) => void;
  setPosting: (v: boolean) => void;
  reset: () => void;
};

const defaultSub: SubscriptionState = {
  plan: 'none',
  messageLimit: 0,
  messagesUsed: 0,
  messagesRemaining: 0,
  hasAccess: false,
  premiumAccess: false,
};

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  messages: [],
  repliesByParent: {},
  subscription: null,
  nextCursor: null,
  hasMore: false,
  loading: false,
  posting: false,
  currentUserId: null,

  setCurrentUserId: (id) => set({ currentUserId: id }),

  setSubscription: (sub) => set({ subscription: sub ?? defaultSub }),

  setMessages: (messages, nextCursor, hasMore, append = false) =>
    set((s) => ({
      messages: append ? [...s.messages, ...messages] : messages,
      nextCursor,
      hasMore,
    })),

  prependMessage: (msg) =>
    set((s) => {
      if (msg.parentId) return s;
      if (s.messages.some((m) => m.id === msg.id)) return s;
      return { messages: [msg, ...s.messages] };
    }),

  updateMessage: (msg) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)),
      repliesByParent: Object.fromEntries(
        Object.entries(s.repliesByParent).map(([pid, list]) => [
          pid,
          list.map((r) => (r.id === msg.id ? { ...r, ...msg } : r)),
        ])
      ),
    })),

  removeMessage: (id, parentId) =>
    set((s) => {
      if (parentId) {
        const list = s.repliesByParent[parentId] || [];
        return {
          repliesByParent: {
            ...s.repliesByParent,
            [parentId]: list.filter((r) => r.id !== id),
          },
          messages: s.messages.map((m) =>
            m.id === parentId ? { ...m, replyCount: Math.max(0, m.replyCount - 1) } : m
          ),
        };
      }
      return { messages: s.messages.filter((m) => m.id !== id) };
    }),

  updateLike: (id, likesCount, likedByMe) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, likesCount, likedByMe } : m)),
      repliesByParent: Object.fromEntries(
        Object.entries(s.repliesByParent).map(([pid, list]) => [
          pid,
          list.map((r) => (r.id === id ? { ...r, likesCount, likedByMe } : r)),
        ])
      ),
    })),

  setReplies: (parentId, replies) =>
    set((s) => ({
      repliesByParent: { ...s.repliesByParent, [parentId]: replies },
    })),

  addReply: (parentId, reply) =>
    set((s) => {
      const list = s.repliesByParent[parentId] || [];
      if (list.some((r) => r.id === reply.id)) return s;
      return {
        repliesByParent: { ...s.repliesByParent, [parentId]: [...list, reply] },
        messages: s.messages.map((m) =>
          m.id === parentId ? { ...m, replyCount: m.replyCount + 1 } : m
        ),
      };
    }),

  setLoading: (loading) => set({ loading }),
  setPosting: (posting) => set({ posting }),

  reset: () =>
    set({
      messages: [],
      repliesByParent: {},
      subscription: null,
      nextCursor: null,
      hasMore: false,
      loading: false,
      posting: false,
    }),
}));
