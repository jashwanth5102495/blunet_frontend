import React, { memo, useCallback, useRef, useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommunityChat } from '@/components/ui/community-chat';
import { SubscriptionExpiredOverlay } from '@/components/ui/community-free-trial';
import { TrialUsagePopup, TrialUpgradeOverlay } from '@/components/ui/trial-usage-popup';
import { useCommunityStore } from '@/store/community-store';
import { PostCard } from './post-card';
import {
  fetchMessages,
  fetchReplies,
  postMessage,
  uploadCommunityImages,
  toggleLike,
  editMessage,
  deleteMessage,
  fetchSubscription,
} from '@/lib/community-api';

type CommunityFeedProps = {
  token: string;
  onBack?: () => void;
  onUpgrade?: () => void;
  onRefreshSubscription?: () => void;
};

export const CommunityFeed = memo(function CommunityFeed({
  token,
  onBack,
  onUpgrade,
  onRefreshSubscription,
}: CommunityFeedProps) {
  const messages = useCommunityStore((s) => s.messages);
  const repliesByParent = useCommunityStore((s) => s.repliesByParent);
  const subscription = useCommunityStore((s) => s.subscription);
  const loading = useCommunityStore((s) => s.loading);
  const posting = useCommunityStore((s) => s.posting);
  const hasMore = useCommunityStore((s) => s.hasMore);
  const currentUserId = useCommunityStore((s) => s.currentUserId);

  const [draft, setDraft] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [hasPosted, setHasPosted] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isTrial = subscription?.plan === 'trial';
  const isExpired = subscription?.isExpired ?? false;
  const messagesUsed = subscription?.messagesUsed ?? 0;
  const messageLimit = subscription?.messageLimit ?? 5;
  const viewsUsed = subscription?.viewsUsed ?? 0;
  const viewLimit = subscription?.viewLimit ?? 10;
  const sendLimitReached = subscription?.sendLimitReached ?? false;
  const viewLimitReached = subscription?.viewLimitReached ?? false;
  const trialFullyExhausted =
    subscription?.trialFullyExhausted ??
    (sendLimitReached && viewLimitReached);

  const canPost = !isExpired && !sendLimitReached && subscription?.canPost !== false;
  const inputDisabled = !canPost || isExpired || (isTrial && sendLimitReached);

  /** API returns newest-first; show oldest at top like WhatsApp */
  const chronologicalMessages = [...messages].reverse();

  const syncSubscription = useCallback(
    async (sub?: typeof subscription) => {
      if (sub) {
        useCommunityStore.getState().setSubscription(sub);
      } else {
        const fresh = await fetchSubscription(token);
        useCommunityStore.getState().setSubscription(fresh);
      }
      onRefreshSubscription?.();
    },
    [token, onRefreshSubscription]
  );

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const loadFeed = useCallback(
    async (append = false) => {
      const store = useCommunityStore.getState();
      store.setLoading(true);
      try {
        const data = await fetchMessages(token, append ? store.nextCursor : null);
        if (data.subscription) {
          store.setSubscription(data.subscription);
        }
        store.setMessages(data.messages, data.nextCursor, data.hasMore, append);
      } catch (e: unknown) {
        const err = e as Error & { code?: string; data?: typeof subscription };
        if (err.data) {
          store.setSubscription(err.data);
        }
        console.error(e);
      } finally {
        store.setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadFeed(false);
  }, [loadFeed]);

  useEffect(() => {
    if (!loading) {
      scrollToBottom(messages.length <= 1 ? 'auto' : 'smooth');
    }
  }, [messages.length, loading, scrollToBottom]);

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current || viewLimitReached || isExpired || isTrial) return;
    const el = loadMoreRef.current;
    const root = scrollContainerRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasMore) {
          loadFeed(true);
        }
      },
      { root: root ?? null, rootMargin: '120px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, loadFeed, viewLimitReached, isExpired, isTrial]);

  const handlePost = async () => {
    if (isExpired || inputDisabled) return;
    const text = draft.trim();
    if ((!text && files.length === 0) || posting) return;
    useCommunityStore.getState().setPosting(true);
    try {
      let imageUrls: string[] = [];
      if (files.length > 0) {
        const uploaded = await uploadCommunityImages(token, files);
        imageUrls = uploaded.urls;
      }
      const { message, subscription: sub } = await postMessage(token, text, undefined, imageUrls);
      useCommunityStore.getState().prependMessage(message);
      setDraft('');
      setFiles([]);
      setHasPosted(true);
      await syncSubscription(sub);
      requestAnimationFrame(() => scrollToBottom('smooth'));
    } catch (e: unknown) {
      const err = e as Error & { data?: typeof subscription };
      if (err.data) {
        useCommunityStore.getState().setSubscription(err.data);
      }
      alert(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      useCommunityStore.getState().setPosting(false);
    }
  };

  const handleLike = useCallback(
    async (id: string) => {
      if (isExpired || trialFullyExhausted) return;
      try {
        const data = await toggleLike(token, id);
        useCommunityStore.getState().updateLike(data.id, data.likesCount, data.likedByMe);
      } catch (e) {
        console.error(e);
      }
    },
    [token, isExpired, trialFullyExhausted]
  );

  const handleReply = useCallback(
    async (parentId: string, text: string) => {
      if (isExpired || inputDisabled) return;
      try {
        const { subscription: sub } = await postMessage(token, text, parentId);
        const replies = await fetchReplies(token, parentId);
        useCommunityStore.getState().setReplies(parentId, replies);
        await syncSubscription(sub);
      } catch (e: unknown) {
        const err = e as Error & { data?: typeof subscription };
        if (err.data) {
          useCommunityStore.getState().setSubscription(err.data);
        }
        alert(err instanceof Error ? err.message : 'Failed to reply');
      }
    },
    [token, inputDisabled, isExpired, syncSubscription]
  );

  const handleLoadReplies = useCallback(
    async (parentId: string) => {
      if (isExpired) return;
      try {
        const replies = await fetchReplies(token, parentId);
        useCommunityStore.getState().setReplies(parentId, replies);
      } catch (e) {
        console.error(e);
      }
    },
    [token, isExpired]
  );

  const maxImages = subscription?.maxImagesPerPost ?? 0;
  const showTrialOverlay = isTrial && trialFullyExhausted && !isExpired;

  return (
    <div className="relative flex flex-col w-full max-w-3xl mx-auto px-4 md:px-0 h-[calc(100vh-7.5rem)] min-h-[420px] max-h-[900px]">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 shrink-0 pb-3 border-b border-slate-200/80 dark:border-white/10">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium',
              'text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition-colors group'
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 group-hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:group-hover:bg-white/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Back to membership plans
          </button>
        ) : (
          <div />
        )}

        {isTrial && !isExpired && (
          <TrialUsagePopup
            messagesUsed={messagesUsed}
            messageLimit={messageLimit}
            viewsUsed={viewsUsed}
            viewLimit={viewLimit}
            className="shrink-0"
          />
        )}
      </div>

      <div
        className={cn(
          'relative flex flex-col flex-1 min-h-0 mt-3',
          (isExpired || showTrialOverlay) && 'pointer-events-none select-none blur-[6px] opacity-70'
        )}
      >
        {/* Messages — scrollable, above composer */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-4 space-y-4"
        >
          <div ref={loadMoreRef} className="h-2 shrink-0" />
          {loading && messages.length === 0 && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-slate-400 dark:text-white/50 animate-spin" />
            </div>
          )}
          {chronologicalMessages.length === 0 && !loading && (
            <p className="text-center text-slate-500 dark:text-white/40 text-sm py-12">
              No posts yet. Say hello to the community!
            </p>
          )}
          {chronologicalMessages.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwn={post.userId === currentUserId}
              replies={repliesByParent[post.id]}
              onLike={handleLike}
              onReply={handleReply}
              onEdit={async (id, text) => {
                try {
                  const updated = await editMessage(token, id, text);
                  useCommunityStore.getState().updateMessage(updated);
                } catch (e: unknown) {
                  alert(e instanceof Error ? e.message : 'Edit failed');
                }
              }}
              onDelete={async (id) => {
                if (!confirm('Delete this message?')) return;
                try {
                  await deleteMessage(token, id);
                  useCommunityStore.getState().removeMessage(id, null);
                } catch (e: unknown) {
                  alert(e instanceof Error ? e.message : 'Delete failed');
                }
              }}
              onLoadReplies={handleLoadReplies}
            />
          ))}
          {viewLimitReached && isTrial && !trialFullyExhausted && (
            <p className="text-center text-sm text-slate-500 dark:text-white/50 py-2">
              10/10 messages received — new incoming posts are hidden
            </p>
          )}
          {loading && messages.length > 0 && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 text-slate-400 dark:text-white/50 animate-spin" />
            </div>
          )}
          <div ref={messagesEndRef} className="h-1 shrink-0" />
        </div>

        {/* Composer — fixed at bottom like WhatsApp */}
        <div className="shrink-0 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/95 dark:bg-gray-950/95 backdrop-blur-sm pt-3 pb-1">
          {sendLimitReached && isTrial && !isExpired && (
            <p className="text-center text-xs text-amber-600 dark:text-amber-400/90 mb-2">
              5/5 messages sent — posting is disabled
            </p>
          )}
          <CommunityChat
            draft={draft}
            onDraftChange={setDraft}
            onPost={handlePost}
            posting={posting}
            compact
            files={files}
            onFilesChange={setFiles}
            maxImages={maxImages}
            disabled={inputDisabled}
            isTrial={isTrial}
            messagesUsed={messagesUsed}
            messageLimit={messageLimit}
            viewsUsed={viewsUsed}
            viewLimit={viewLimit}
          />
        </div>
      </div>

      {isExpired && <SubscriptionExpiredOverlay onRenew={onUpgrade} />}
      {showTrialOverlay && <TrialUpgradeOverlay onUpgrade={onUpgrade} />}
    </div>
  );
});
