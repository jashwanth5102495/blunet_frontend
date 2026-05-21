import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { BorderTrail } from './border-trail';

export type PlanTier = 'basic' | 'pro' | 'premium';

export type PlanFeature = {
  label: string;
  included: boolean;
  subItems?: string[];
};

export type CommunityPlan = {
  id: PlanTier;
  tier: PlanTier;
  title: string;
  price: string;
  subtitle: string;
  badge: string;
  buttonText: string;
  features: PlanFeature[];
};

const TIER_STYLES: Record<
  PlanTier,
  {
    card: string;
    badge: string;
    button: string;
    delay: number;
    floating: string;
  }
> = {
  basic: {
    card: 'border border-slate-200 bg-white shadow-sm hover:border-slate-300 dark:border-white/20 dark:bg-black/40 dark:backdrop-blur-md dark:hover:border-white/35',
    badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-white/80 dark:border-white/20',
    button: 'border-2 border-slate-800 bg-transparent text-slate-900 hover:bg-slate-50 dark:border-white dark:text-white dark:hover:bg-white/10',
    delay: 0,
    floating: '',
  },
  pro: {
    card: 'border border-slate-300 bg-slate-50 shadow-md hover:border-slate-400 md:scale-[1.02] dark:border-white/30 dark:bg-black/60 dark:backdrop-blur-md dark:shadow-[0_0_24px_rgba(255,255,255,0.06)]',
    badge: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-white/15 dark:text-white dark:border-white/25',
    button: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-white/90',
    delay: 0.08,
    floating: 'bg-slate-800 text-white border border-slate-700 dark:bg-white/10 dark:text-white dark:border-white/25 dark:backdrop-blur-sm',
  },
  premium: {
    card: 'border border-slate-700 bg-slate-950 backdrop-blur-xl shadow-xl md:scale-[1.05] z-10 dark:border-white/40 dark:bg-black/80 dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]',
    badge: 'bg-white text-black border-white',
    button: 'bg-white text-black hover:bg-white/95 shadow-[0_0_20px_rgba(255,255,255,0.15)]',
    delay: 0.16,
    floating: 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]',
  },
};

function FeatureRow({ feature, darkCard }: { feature: PlanFeature; darkCard?: boolean }) {
  return (
    <li
      className={cn(
        'text-sm',
        feature.included
          ? darkCard
            ? 'text-white/90'
            : 'text-slate-700 dark:text-white/90'
          : darkCard
            ? 'text-white/35'
            : 'text-slate-400 dark:text-white/35'
      )}
    >
      <div className="flex items-start gap-2.5">
        {feature.included ? (
          <Check className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" strokeWidth={2.5} />
        ) : (
          <X
            className={cn(
              'w-4 h-4 shrink-0 mt-0.5',
              darkCard ? 'text-white/25' : 'text-slate-300 dark:text-white/25'
            )}
          />
        )}
        <span className="leading-snug">{feature.label}</span>
      </div>
      {feature.subItems && feature.included && (
        <ul className="mt-1.5 ml-6 space-y-0.5">
          {feature.subItems.map((sub) => (
            <li
              key={sub}
              className={cn(
                'text-xs flex items-center gap-1.5',
                darkCard ? 'text-white/55' : 'text-slate-500 dark:text-white/55'
              )}
            >
              <span
                className={cn(
                  'w-1 h-1 rounded-full shrink-0',
                  darkCard ? 'bg-white/40' : 'bg-slate-400 dark:bg-white/40'
                )}
              />
              {sub}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function PlanCardBody({
  plan,
  onSelect,
  loading,
  showInlineBadge = true,
}: {
  plan: CommunityPlan;
  onSelect: () => void;
  loading?: boolean;
  showInlineBadge?: boolean;
}) {
  const styles = TIER_STYLES[plan.tier];
  const darkCard = plan.tier === 'premium';

  return (
    <div className={cn('relative flex flex-col h-full rounded-2xl p-6 md:p-7 transition-all duration-300', styles.card)}>
      {showInlineBadge ? (
        <Badge variant="outline" className={cn('w-fit mb-5 text-[10px] uppercase tracking-widest font-bold', styles.badge)}>
          {plan.badge}
        </Badge>
      ) : (
        <div className="mb-5 h-5" aria-hidden />
      )}

      <h3
        className={cn(
          'text-xl font-bold tracking-tight',
          darkCard ? 'text-white' : 'text-slate-900 dark:text-white'
        )}
      >
        {plan.title}
      </h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className={cn(
            'text-4xl md:text-[2.75rem] font-extrabold tracking-tighter',
            darkCard ? 'text-white' : 'text-slate-900 dark:text-white'
          )}
        >
          {plan.price}
        </span>
        <span
          className={cn(
            'text-sm font-medium',
            darkCard ? 'text-white/45' : 'text-slate-500 dark:text-white/45'
          )}
        >
          per month
        </span>
      </div>
      <p
        className={cn(
          'mt-3 text-sm leading-relaxed min-h-[2.5rem]',
          darkCard ? 'text-white/55' : 'text-slate-600 dark:text-white/55'
        )}
      >
        {plan.subtitle}
      </p>

      <ul
        className={cn(
          'mt-6 space-y-3 flex-1 border-t pt-6',
          darkCard ? 'border-white/10' : 'border-slate-200 dark:border-white/10'
        )}
      >
        {plan.features.map((f) => (
          <FeatureRow key={f.label} feature={f} darkCard={darkCard} />
        ))}
      </ul>

      <Button
        type="button"
        onClick={onSelect}
        disabled={loading}
        className={cn('mt-8 w-full h-11 rounded-xl font-semibold text-sm transition-all duration-300', styles.button, loading && 'opacity-60 cursor-not-allowed')}
      >
        {loading ? 'Activating...' : plan.buttonText}
      </Button>
    </div>
  );
}

export function CommunityCard({
  plan,
  onSelect,
  loading,
}: {
  plan: CommunityPlan;
  onSelect: () => void;
  loading?: boolean;
}) {
  const styles = TIER_STYLES[plan.tier];
  const floatingBadge = plan.tier === 'pro' ? 'Most Popular' : plan.tier === 'premium' ? 'Elite Access' : null;

  const card = <PlanCardBody plan={plan} onSelect={onSelect} loading={loading} showInlineBadge={!floatingBadge} />;

  const wrapped = plan.tier === 'premium' ? <BorderTrail className="h-full">{card}</BorderTrail> : card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: styles.delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative h-full', plan.tier === 'premium' && 'md:-mt-2 md:mb-2')}
    >
      {floatingBadge && (
        <div
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap',
            styles.floating
          )}
        >
          {floatingBadge}
        </div>
      )}
      {wrapped}
    </motion.div>
  );
}

export const BASIC_PLAN: CommunityPlan = {
  id: 'basic',
  tier: 'basic',
  title: 'Basic Community',
  price: '₹99',
  subtitle: 'Perfect for students starting their learning journey.',
  badge: 'Starter',
  buttonText: 'Get Basic Access',
  features: [
    { label: '40 Community Messages', included: true },
    { label: 'Access to Student Community', included: true },
    { label: '2 Resume Reviews', included: true },
    { label: 'No Job Assistance', included: false },
    { label: 'No Mock Interviews', included: false },
    { label: 'No Placement Support', included: false },
  ],
};

export const PRO_PLAN: CommunityPlan = {
  id: 'pro',
  tier: 'pro',
  title: 'Pro Community',
  price: '₹199',
  subtitle: 'Best for students preparing for placements and career growth.',
  badge: 'Most Popular',
  buttonText: 'Join Pro Community',
  features: [
    { label: '99 Community Messages', included: true },
    { label: '3 Resume Reviews', included: true },
    { label: '3 Mock Interviews', included: true },
    {
      label: '3 Company References for Placement Support',
      included: true,
      subItems: ['2 Non-IT Companies', '1 IT Company'],
    },
    { label: 'New Tools & Technology Exposure', included: true },
    { label: 'Premium Community Access', included: true },
  ],
};

export const PREMIUM_PLAN: CommunityPlan = {
  id: 'premium',
  tier: 'premium',
  title: 'Premium Community',
  price: '₹299',
  subtitle: 'Complete career-focused premium membership with advanced placement support.',
  badge: 'Elite Access',
  buttonText: 'Unlock Premium',
  features: [
    { label: '149 Community Messages', included: true },
    { label: '3 Resume Reviews', included: true },
    { label: '5 Mock Interviews', included: true },
    {
      label: '5 Company References for Placement Support',
      included: true,
      subItems: ['3 Non-IT Companies', '2 IT Companies'],
    },
    { label: 'New Tools & Technology Exposure', included: true },
    { label: 'Advanced Career Guidance', included: true },
    { label: 'Priority Community Support', included: true },
  ],
};

export const COMMUNITY_PLANS: CommunityPlan[] = [BASIC_PLAN, PRO_PLAN, PREMIUM_PLAN];
