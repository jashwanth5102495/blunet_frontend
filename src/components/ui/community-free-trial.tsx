import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import MotionButton from './motion-button';
import { AnimatedBorderButton } from './animated-border-card';
import { cn } from '@/lib/utils';
import {
  hasCompletedCommunityIntro,
  markCommunityIntroComplete,
} from '@/lib/community-intro';

type CommunityFreeTrialProps = {
  onStartTrial: () => Promise<void>;
  onEnterChat?: () => void;
  loading?: boolean;
  subscriptionLoading?: boolean;
  plan?: string;
  trialExhausted?: boolean;
  /** Student id — used to remember first visit vs return */
  userId?: string | null;
};

export function CommunityFreeTrialButton({
  onClick,
  disabled,
  label = 'Free Trial',
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <AnimatedBorderButton onClick={onClick} disabled={disabled}>
      {label}
    </AnimatedBorderButton>
  );
}

export function CommunityFreeTrialModal({
  open,
  onClose,
  onStartTrial,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onStartTrial: () => void;
  loading?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full max-w-md rounded-2xl border border-white/15',
              'bg-[#0a0a0a] p-6 shadow-2xl'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-white/50 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-xs font-mono uppercase tracking-widest text-violet-400/90 mb-2">
              Free trial · Rate limits
            </p>
            <h3 className="text-xl font-bold text-white">Try the student community</h3>
            <p className="text-sm text-white/55 mt-2 leading-relaxed">
              Explore posts and discussions before choosing a paid plan.
            </p>

            <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Messages you can send</span>
                <span className="font-bold text-white tabular-nums">0/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">New posts from others (live)</span>
                <span className="font-bold text-white tabular-nums">0/10</span>
              </div>
            </div>

            <p className="text-xs text-white/45 mt-4 text-center leading-relaxed">
              You can read up to 20 past posts from other students for free. Only new live posts count
              toward 0/10. When both reach 5/5 sent and 10/10 received, upgrade to continue.
            </p>

            <div className="mt-8 flex justify-center">
              <MotionButton
                label={loading ? 'Starting...' : 'Get Started'}
                onClick={onStartTrial}
                disabled={loading}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CommunityFreeTrial({
  onStartTrial,
  onEnterChat,
  loading,
  subscriptionLoading,
  plan,
  trialExhausted = false,
  userId,
}: CommunityFreeTrialProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const hasActiveTrial = plan === 'trial' && !trialExhausted;
  const isEnded = trialExhausted;
  const hasEnteredBefore = hasCompletedCommunityIntro(userId);
  /** Continue only after first visit + trial started; first visit always shows Free Trial */
  const showContinue = hasActiveTrial && hasEnteredBefore;

  /** Only disable when trial fully ended or API still loading */
  const buttonDisabled = Boolean(loading || subscriptionLoading || isEnded);

  const label = isEnded ? 'Trial Ended' : showContinue ? 'Continue' : 'Free Trial';

  const enterChat = () => {
    markCommunityIntroComplete(userId);
    onEnterChat?.();
  };

  const handleClick = () => {
    if (buttonDisabled) return;
    if (showContinue) {
      enterChat();
      return;
    }
    setModalOpen(true);
  };

  const handleGetStarted = async () => {
    try {
      if (!hasActiveTrial) {
        await onStartTrial();
      }
      setModalOpen(false);
      enterChat();
    } catch {
      /* parent shows alert */
    }
  };

  return (
    <>
      <CommunityFreeTrialButton onClick={handleClick} disabled={buttonDisabled} label={label} />
      <CommunityFreeTrialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStartTrial={handleGetStarted}
        loading={loading}
      />
    </>
  );
}

export function TrialLimitBanner({
  sendLimitReached,
  viewLimitReached,
  onUpgrade,
}: {
  sendLimitReached?: boolean;
  viewLimitReached?: boolean;
  onUpgrade?: () => void;
}) {
  if (!sendLimitReached && !viewLimitReached) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center mb-6 dark:border-white/20 dark:bg-white/[0.06]">
      <p className="text-lg font-bold text-slate-900 dark:text-white">Free trial ended</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-white/60">
        {sendLimitReached && <li>✓ 5 messages sent</li>}
        {viewLimitReached && <li>✓ 10 new posts received</li>}
      </ul>
      <p className="mt-3 text-sm text-slate-500 dark:text-white/50">
        Choose a membership plan to continue using the community.
      </p>
      {onUpgrade && (
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-4 px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          View membership plans
        </button>
      )}
    </div>
  );
}

export function SubscriptionExpiredOverlay({
  onRenew,
}: {
  onRenew?: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-6 cursor-not-allowed"
      aria-hidden={false}
      role="dialog"
      aria-labelledby="subscription-expired-title"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      <div
        className="relative z-10 max-w-md w-full rounded-2xl border border-white/20 bg-black/60 backdrop-blur-2xl p-8 text-center shadow-2xl pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-white/50 mb-2">Membership ended</p>
        <h3 id="subscription-expired-title" className="text-xl font-bold text-white">
          Renew your community access
        </h3>
        <p className="mt-3 text-sm text-white/60 leading-relaxed">
          Your monthly plan has ended. Renew your membership to post messages, join discussions, and
          access placement support again.
        </p>
        {onRenew && (
          <button
            type="button"
            onClick={onRenew}
            className="mt-6 w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Renew membership
          </button>
        )}
      </div>
    </div>
  );
}
