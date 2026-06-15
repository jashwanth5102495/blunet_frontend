import React, { memo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Loader2, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from '@/components/ui/prompt-input';
import { cn } from '@/lib/utils';

const QUICK_TAGS = [
  { label: 'Share Project 🚀', fill: 'Today I completed ' },
  { label: 'Ask Doubt 💡', fill: 'Can someone help me understand ' },
  { label: 'Placement Talk 🎯', fill: 'Regarding placements, I wanted to share ' },
  { label: 'AI Tools 🤖', fill: 'I discovered this AI tool useful for ' },
  { label: 'Career Help 📈', fill: 'Looking for career advice on ' },
] as const;

export type CommunityChatProps = {
  draft: string;
  onDraftChange: (value: string) => void;
  onPost: () => void;
  posting: boolean;
  compact?: boolean;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  maxImages?: number;
  messagesRemaining?: number;
  viewsRemaining?: number;
  isTrial?: boolean;
  messagesUsed?: number;
  messageLimit?: number;
  viewsUsed?: number;
  viewLimit?: number;
  disabled?: boolean;
};

export const CommunityChat = memo(function CommunityChat({
  draft,
  onDraftChange,
  onPost,
  posting,
  compact = false,
  files = [],
  onFilesChange,
  maxImages = 0,
  messagesRemaining,
  viewsRemaining,
  isTrial,
  messagesUsed = 0,
  messageLimit = 5,
  viewsUsed = 0,
  viewLimit = 10,
  disabled,
}: CommunityChatProps) {
  const uploadRef = useRef<HTMLInputElement>(null);
  const canAttach = maxImages > 0;
  const canSubmit = (!disabled && !posting && (draft.trim().length > 0 || files.length > 0));

  const applyTag = useCallback(
    (fill: string) => {
      onDraftChange(fill);
    },
    [onDraftChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFilesChange || !e.target.files) return;
    const picked = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
    const merged = [...files, ...picked].slice(0, maxImages);
    onFilesChange(merged);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    if (!onFilesChange) return;
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const attachControl = (
    <PromptInputAction tooltip={canAttach ? `Attach up to ${maxImages} image(s)` : 'Images require membership'}>
      <label
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
          canAttach && !disabled
            ? 'cursor-pointer text-white/80 hover:bg-white/10 hover:text-white'
            : 'cursor-not-allowed text-white/25'
        )}
      >
        <input
          ref={uploadRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple={maxImages > 1}
          disabled={!canAttach || disabled || posting}
          onChange={handleFileChange}
          className="hidden"
        />
        <Paperclip className="size-5" />
      </label>
    </PromptInputAction>
  );

  const sendControl = (
    <PromptInputAction tooltip={posting ? 'Posting...' : 'Post to community'}>
      <Button
        type="button"
        variant="default"
        size="icon"
        disabled={!canSubmit}
        onClick={onPost}
        className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-40"
      >
        {posting ? <Loader2 className="size-5 animate-spin" /> : <ArrowUp className="size-5" />}
      </Button>
    </PromptInputAction>
  );

  const filePreview =
    files.length > 0 ? (
      <div className="flex flex-wrap gap-2 px-1 pb-2">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="relative flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs text-white/80"
          >
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="h-8 w-8 rounded object-cover"
            />
            <span className="max-w-[80px] truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="rounded-full p-0.5 hover:bg-white/10"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    ) : null;

  if (compact) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <PromptInput
          value={draft}
          onValueChange={onDraftChange}
          isLoading={posting}
          onSubmit={onPost}
          disabled={disabled}
          className="w-full"
        >
          {filePreview}
          <PromptInputTextarea placeholder="Let's Post" disabled={disabled || posting} />
          <PromptInputActions className="flex items-center justify-between gap-2 px-1 pb-1 pt-1">
            {attachControl}
            {sendControl}
          </PromptInputActions>
        </PromptInput>
        {isTrial ? (
          <p className="mt-2 text-xs text-slate-500 dark:text-white/40 text-center tabular-nums">
            {messagesUsed}/{messageLimit} messages
            {' · '}
            {viewsUsed}/{viewLimit} new received
          </p>
        ) : (
          typeof messagesRemaining === 'number' && (
            <p className="mt-2 text-xs text-slate-500 dark:text-white/40 text-center">
              {messagesRemaining} posts left
              {typeof viewsRemaining === 'number' && ` · ${viewsRemaining} views left`}
              {maxImages > 0 && ` · up to ${maxImages} image${maxImages > 1 ? 's' : ''} per post`}
            </p>
          )
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[min(100%,520px)] h-[200px] rounded-full bg-white/[0.03] blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          What&apos;s Your Thought for Today?
        </h2>
        <p className="mt-2 text-sm md:text-base text-white/50 max-w-lg mx-auto">
          Share ideas, projects, doubts, or achievements with the community.
        </p>
        {isTrial ? (
          <p className="mt-2 text-xs text-slate-500 dark:text-white/40 tabular-nums">
            {messagesUsed}/{messageLimit} sent · {viewsUsed}/{viewLimit} new received
          </p>
        ) : (
          typeof messagesRemaining === 'number' && (
            <p className="mt-2 text-xs text-slate-500 dark:text-white/40">
              {messagesRemaining} posts remaining
              {typeof viewsRemaining === 'number' && ` · ${viewsRemaining} views remaining`}
            </p>
          )
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
      >
        <PromptInput
          value={draft}
          onValueChange={onDraftChange}
          isLoading={posting}
          onSubmit={onPost}
          disabled={disabled}
          className="w-full"
        >
          {filePreview}
          <PromptInputTextarea
            placeholder="Share something with the BluNet community..."
            disabled={disabled || posting}
            className="min-h-[80px] px-2"
          />
          <PromptInputActions className="flex items-center justify-between gap-2 px-1 pb-1 pt-2">
            {attachControl}
            {sendControl}
          </PromptInputActions>
        </PromptInput>

        <AnimatePresence>
          {posting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                BN
              </span>
              <span className="text-sm text-white/60">Posting to Community...</span>
              <Loader2 className="w-4 h-4 text-white/50 animate-spin ml-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => applyTag(tag.fill)}
            disabled={disabled || posting}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              'border-white/15 bg-white/[0.04] text-white/70',
              'hover:border-white/30 hover:bg-white/10 hover:text-white',
              'disabled:opacity-40'
            )}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
});
