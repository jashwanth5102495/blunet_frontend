import { cn } from '@/lib/utils';

type TrialUsagePopupProps = {
  messagesUsed: number;
  messageLimit: number;
  viewsUsed: number;
  viewLimit: number;
  className?: string;
};

/** Floating trial counters: X/5 sent, X/10 received */
export function TrialUsagePopup({
  messagesUsed,
  messageLimit,
  viewsUsed,
  viewLimit,
  className,
}: TrialUsagePopupProps) {
  const sendAtLimit = messagesUsed >= messageLimit;
  const viewAtLimit = viewsUsed >= viewLimit;

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-sm',
        'dark:border-white/15 dark:bg-gray-900/95',
        'px-4 py-3 space-y-2 text-sm',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-6">
        <span className="text-slate-500 dark:text-white/50">Messages sent</span>
        <span
          className={cn(
            'font-semibold tabular-nums',
            sendAtLimit ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
          )}
        >
          {messagesUsed}/{messageLimit}
        </span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="text-slate-500 dark:text-white/50" title="Only new live posts from others count">
          New received
        </span>
        <span
          className={cn(
            'font-semibold tabular-nums',
            viewAtLimit ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
          )}
        >
          {viewsUsed}/{viewLimit}
        </span>
      </div>
    </div>
  );
}

export function TrialUpgradeOverlay({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-labelledby="trial-upgrade-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      <div
        className="relative z-10 max-w-md w-full rounded-2xl border border-white/20 bg-white dark:bg-gray-900 p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">
          Free trial complete
        </p>
        <h3 id="trial-upgrade-title" className="text-xl font-bold text-slate-900 dark:text-white">
          Upgrade your plan
        </h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/60 leading-relaxed">
          You&apos;ve used all 5 trial messages and viewed 10 community posts. Choose a membership
          plan to keep learning and connecting with peers.
        </p>
        <div className="mt-4 space-y-1 text-sm font-medium text-slate-700 dark:text-white/80">
          <p>5/5 messages sent</p>
          <p>10/10 messages received</p>
        </div>
        {onUpgrade && (
          <button
            type="button"
            onClick={onUpgrade}
            className="mt-6 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-colors"
          >
            Upgrade plan
          </button>
        )}
      </div>
    </div>
  );
}
