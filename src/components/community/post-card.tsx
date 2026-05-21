import React, { memo, useState, useCallback } from 'react';
import { Heart, MessageCircle, Pencil, Trash2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CommunityMessage } from '@/store/community-store';

type PostCardProps = {
  post: CommunityMessage;
  isOwn: boolean;
  replies?: CommunityMessage[];
  /** When false, hide reply composer and edit (delete still allowed on own posts) */
  canPost?: boolean;
  onLike: (id: string) => void;
  onReply: (parentId: string, text: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onLoadReplies?: (parentId: string) => void;
};

function formatTime(ts: string) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export const PostCard = memo(function PostCard({
  post,
  isOwn,
  replies = [],
  canPost = true,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onLoadReplies,
}: PostCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.message);

  const toggleReplies = useCallback(() => {
    const next = !showReplies;
    setShowReplies(next);
    if (next && onLoadReplies) onLoadReplies(post.id);
  }, [showReplies, onLoadReplies, post.id]);

  const submitReply = useCallback(() => {
    const t = replyText.trim();
    if (!t) return;
    onReply(post.id, t);
    setReplyText('');
  }, [onReply, post.id, replyText]);

  const saveEdit = useCallback(() => {
    const t = editText.trim();
    if (!t) return;
    onEdit(post.id, t);
    setEditing(false);
  }, [editText, onEdit, post.id]);

  return (
    <article
      className={cn(
        'rounded-xl border p-4 transition-colors backdrop-blur-md',
        'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:bg-slate-50',
        'dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25 dark:hover:bg-white/[0.06]',
        isOwn && 'ring-1 ring-violet-500/20 dark:ring-violet-400/15'
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border',
            'bg-slate-800 text-white border-slate-700',
            'dark:bg-gradient-to-br dark:from-white/20 dark:to-white/5 dark:border-white/15'
          )}
        >
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-white text-sm">
              {post.username}
            </span>
            <span className="text-xs text-slate-500 dark:text-white/40">
              {formatTime(post.timestamp)}
            </span>
            {post.editedAt && (
              <span className="text-xs text-slate-400 dark:text-white/30">(edited)</span>
            )}
          </div>

          {editing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className={cn(
                  'w-full rounded-lg text-sm p-2 resize-none border',
                  'bg-white border-slate-300 text-slate-900',
                  'dark:bg-black/50 dark:border-white/20 dark:text-white'
                )}
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveEdit}
                  className="text-xs px-3 py-1 rounded-lg bg-slate-900 text-white font-semibold dark:bg-white dark:text-black"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className={cn(
                    'text-xs px-3 py-1 rounded-lg border',
                    'border-slate-300 text-slate-600',
                    'dark:border-white/20 dark:text-white/70'
                  )}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {post.message?.trim() && (
                <p className="mt-2 text-sm text-slate-800 dark:text-white/85 whitespace-pre-wrap break-words">
                  {post.message}
                </p>
              )}
              {post.images && post.images.length > 0 && (
                <div
                  className={cn(
                    'mt-2 grid gap-2',
                    post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  )}
                >
                  {post.images.map((src) => (
                    <a
                      key={src}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-lg border border-slate-200 dark:border-white/10"
                    >
                      <img
                        src={src}
                        alt="Community attachment"
                        className="w-full max-h-64 object-cover hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button
              type="button"
              onClick={() => onLike(post.id)}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors',
                post.likedByMe
                  ? 'text-violet-600 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white'
              )}
            >
              <Heart className={cn('w-4 h-4', post.likedByMe && 'fill-current')} />
              {post.likesCount}
            </button>
            <button
              type="button"
              onClick={toggleReplies}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white"
            >
              <MessageCircle className="w-4 h-4" />
              {post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}
            </button>
            {isOwn && !editing && (
              <>
                {canPost && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(post.id)}
                  className="text-slate-400 hover:text-red-600 dark:text-white/40 dark:hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {showReplies && (
            <div className="mt-4 pl-2 border-l border-slate-200 dark:border-white/10 space-y-3">
              {replies.map((r) => (
                <div key={r.id} className="text-sm">
                  <span className="font-medium text-slate-900 dark:text-white/90">{r.username}</span>
                  <span className="text-slate-500 dark:text-white/40 text-xs ml-2">
                    {formatTime(r.timestamp)}
                  </span>
                  <p className="text-slate-700 dark:text-white/75 mt-1">{r.message}</p>
                </div>
              ))}
              {canPost ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className={cn(
                      'flex-1 rounded-lg text-sm px-3 py-2 border',
                      'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400',
                      'dark:bg-black/40 dark:border-white/15 dark:text-white dark:placeholder:text-white/40'
                    )}
                    onKeyDown={(e) => e.key === 'Enter' && submitReply()}
                  />
                  <button
                    type="button"
                    onClick={submitReply}
                    className="p-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black"
                    aria-label="Send reply"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-white/40">Replies are disabled</p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
});
