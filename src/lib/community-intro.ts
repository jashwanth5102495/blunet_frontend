const STORAGE_PREFIX = 'blu_community_intro_complete_';

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

/** True after student has started trial and entered community chat from this tab */
export function hasCompletedCommunityIntro(userId: string | null | undefined): boolean {
  if (!userId) return false;
  try {
    return localStorage.getItem(storageKey(userId)) === '1';
  } catch {
    return false;
  }
}

export function markCommunityIntroComplete(userId: string | null | undefined): void {
  if (!userId) return;
  try {
    localStorage.setItem(storageKey(userId), '1');
  } catch {
    /* ignore quota / private mode */
  }
}
