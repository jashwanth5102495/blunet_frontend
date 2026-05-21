import { motion } from 'framer-motion';
import { ShieldCheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommunityCard, COMMUNITY_PLANS, type PlanTier } from './community-card';
import { CommunityFreeTrial, TrialLimitBanner } from './community-free-trial';
import { Button } from './button';

type CommunityPricingProps = {
  onPlanSelect?: (plan: PlanTier) => void;
  loadingPlan?: PlanTier | null;
  showDevSkip?: boolean;
  onDevSkip?: () => void;
  devSkipLoading?: boolean;
  showFreeTrial?: boolean;
  onStartTrial?: () => Promise<void>;
  onEnterChat?: () => void;
  trialLoading?: boolean;
  subscriptionLoading?: boolean;
  plan?: string;
  trialUsed?: boolean;
  showTrialLimitMessage?: boolean;
  sendLimitReached?: boolean;
  viewLimitReached?: boolean;
  trialExhausted?: boolean;
  userId?: string | null;
};

export function CommunityPricing({
  onPlanSelect,
  loadingPlan,
  showDevSkip,
  onDevSkip,
  devSkipLoading,
  showFreeTrial,
  onStartTrial,
  onEnterChat,
  trialLoading,
  subscriptionLoading,
  plan,
  trialUsed,
  showTrialLimitMessage,
  sendLimitReached,
  viewLimitReached,
  trialExhausted,
  userId,
}: CommunityPricingProps) {
  return (
    <section className="relative overflow-hidden py-8 md:py-12 px-4 md:px-6">
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-25',
          'bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)]',
          'dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]',
          'bg-[size:32px_32px]'
        )}
      />

      <div className="relative mx-auto max-w-6xl space-y-10">
        {showTrialLimitMessage && (
          <TrialLimitBanner sendLimitReached={sendLimitReached} viewLimitReached={viewLimitReached} />
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-10"
        >
          <div className="text-left max-w-xl space-y-4">
            <span className="inline-block rounded-full border border-slate-200 bg-slate-100 px-4 py-1 font-mono text-xs text-slate-600 tracking-widest uppercase dark:border-white/20 dark:bg-white/5 dark:text-white/70">
              Membership
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight dark:text-white">
              Choose Your Community Access
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed dark:text-white/55">
              Connect with peers, sharpen your career skills, and unlock placement-focused benefits
              tailored to where you are in your journey.
            </p>

            {showDevSkip && (
              <Button
                type="button"
                variant="outline"
                onClick={onDevSkip}
                disabled={devSkipLoading}
                className="border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
              >
                {devSkipLoading ? 'Activating...' : 'Skip Payment (Dev Access)'}
              </Button>
            )}
          </div>

          {showFreeTrial && onStartTrial && (
            <div className="flex shrink-0 justify-end self-start md:pt-2 w-full md:w-auto">
              <CommunityFreeTrial
                onStartTrial={onStartTrial}
                onEnterChat={onEnterChat}
                loading={trialLoading}
                subscriptionLoading={subscriptionLoading}
                plan={plan}
                trialExhausted={trialExhausted}
                userId={userId}
              />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 items-stretch"
        >
          {COMMUNITY_PLANS.map((plan) => (
            <CommunityCard
              key={plan.id}
              plan={plan}
              onSelect={() => onPlanSelect?.(plan.id)}
              loading={loadingPlan === plan.id}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-start gap-2 text-slate-500 text-sm dark:text-white/50"
        >
          <ShieldCheckIcon className="size-4 text-slate-400 shrink-0 dark:text-white/60" />
          <span>Secure payments • Instant activation • Premium student network access</span>
        </motion.div>
      </div>
    </section>
  );
}
