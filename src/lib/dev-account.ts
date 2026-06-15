export const DEV_ACCOUNT_USERNAME = 'jashwanth8328246413';

export function isDevAccount(username?: string | null): boolean {
  return username?.trim() === DEV_ACCOUNT_USERNAME;
}

export function getStoredUsername(): string | null {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u.username || null;
  } catch {
    return null;
  }
}
