import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { CommunityPricing } from '@/components/ui/community-pricing';
import type { PlanTier } from '@/components/ui/community-card';
import { CommunityFeed } from './community-feed';
import { useCommunityStore } from '@/store/community-store';
import { useCommunitySocket } from '@/hooks/useCommunitySocket';
import { fetchSubscription, activatePlan, skipDevPayment, startFreeTrial } from '@/lib/community-api';
import { getStoredUsername, isDevAccount } from '@/lib/dev-account';
import { hasCompletedCommunityIntro, markCommunityIntroComplete } from '@/lib/community-intro';
import Loader4 from '@/components/ui/loader-4';

/** UI has 3 tiers; backend currently supports basic + premium only */
function toBackendPlan(plan: PlanTier): 'basic' | 'premium' {
  return plan === 'basic' ? 'basic' : 'premium';
}

function getAuthFromStorage(): { token: string; userId: string; username: string | null } | null {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    const u = JSON.parse(raw);
    const token = u.token || localStorage.getItem('authToken');
    const studentId = u._id || u.id;
    if (!token || !studentId) return null;
    return {
      token,
      userId: String(studentId),
      username: u.username || getStoredUsername(),
    };
  } catch {
    return null;
  }
}

export default function CommunityTab() {
  const auth = useMemo(() => getAuthFromStorage(), []);
  const subscription = useCommunityStore((s) => s.subscription);
  const [loadingPlan, setLoadingPlan] = useState<PlanTier | null>(null);
  const [skipping, setSkipping] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);

  const isDev = isDevAccount(auth?.username);
  const plan = subscription?.plan;
  const isExpired = subscription?.isExpired ?? false;
  const isPaidActive = (plan === 'basic' || plan === 'premium') && !isExpired;
  const isActiveTrial = plan === 'trial';
  const trialFullyExhausted =
    subscription?.trialFullyExhausted ??
    (Boolean(subscription?.sendLimitReached) && Boolean(subscription?.viewLimitReached));

  const showFreeTrial = !isPaidActive;

  const loadSubscription = useCallback(async () => {
    if (!auth?.token) return;
    setSubscriptionLoading(true);
    try {
      const sub = await fetchSubscription(auth.token);
      useCommunityStore.getState().setSubscription(sub);
      useCommunityStore.getState().setCurrentUserId(auth.userId);
      setInitError(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load community';
      setInitError(
        msg === 'Route not found'
          ? 'Community API is not available. Restart the backend (npm run dev in nw_it_backend), then refresh this page.'
          : msg
      );
    } finally {
      setSubscriptionLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    loadSubscription();
    return () => {
      useCommunityStore.getState().reset();
    };
  }, [loadSubscription]);

  const handleActivate = async (planTier: PlanTier) => {
    if (!auth?.token) return;
    setLoadingPlan(planTier);
    try {
      await activatePlan(auth.token, toBackendPlan(planTier));
      await loadSubscription();
      setShowPricing(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Could not activate plan');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSkipPayment = async () => {
    if (!auth?.token || !isDev) return;
    setSkipping(true);
    try {
      await skipDevPayment(auth.token);
      await loadSubscription();
      setShowPricing(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Could not skip payment');
    } finally {
      setSkipping(false);
    }
  };

  const handleStartTrial = async () => {
    if (!auth?.token) return;
    setTrialLoading(true);
    try {
      const sub = await startFreeTrial(auth.token);
      useCommunityStore.getState().setSubscription(sub);
      markCommunityIntroComplete(auth.userId);
      setShowPricing(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Could not start free trial');
    } finally {
      setTrialLoading(false);
    }
  };

  const hasChatAccess = isPaidActive || isActiveTrial;
  const hasEnteredCommunityBefore = hasCompletedCommunityIntro(auth?.userId);

  useCommunitySocket(
    auth?.token ?? null,
    hasChatAccess && !isExpired,
    loadSubscription
  );

  /** Paid → chat immediately; trial → chat only after first onboarding (Free Trial flow) */
  const showChat =
    !subscriptionLoading &&
    !initError &&
    !showPricing &&
    (isPaidActive || (isActiveTrial && hasEnteredCommunityBefore));

  if (!auth) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-slate-500 dark:text-white/60">
        Please log in to access the community.
      </div>
    );
  }

  if (subscriptionLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader4 />
      </div>
    );
  }

  if (initError) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-red-500 dark:text-red-400">{initError}</div>
    );
  }

  if (!showChat) {
    return (
      <CommunityPricing
        onPlanSelect={handleActivate}
        loadingPlan={loadingPlan}
        showDevSkip={isDev}
        onDevSkip={handleSkipPayment}
        devSkipLoading={skipping}
        showFreeTrial={showFreeTrial}
        onStartTrial={handleStartTrial}
        onEnterChat={() => {
          markCommunityIntroComplete(auth.userId);
          setShowPricing(false);
        }}
        trialLoading={trialLoading}
        subscriptionLoading={subscriptionLoading}
        plan={plan}
        trialExhausted={trialFullyExhausted}
        userId={auth.userId}
        showTrialLimitMessage={trialFullyExhausted && plan !== 'trial'}
        sendLimitReached={subscription?.sendLimitReached}
        viewLimitReached={subscription?.viewLimitReached}
      />
    );
  }

  return (
    <CommunityFeed
      token={auth.token}
      onBack={() => setShowPricing(true)}
      onUpgrade={() => setShowPricing(true)}
      onRefreshSubscription={loadSubscription}
    />
  );
}
