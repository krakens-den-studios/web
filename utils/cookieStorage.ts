'use client';

const DEFAULT_MAX_AGE_DAYS = 365;

const isBrowser = () => typeof document !== 'undefined';

const getExpiresString = (days: number) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return expires.toUTCString();
};

export const cookieStorage = {
  getItem(key: string): string | null {
    if (!isBrowser()) return null;
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie of cookies) {
      const [cookieKey, ...rest] = cookie.split('=');
      if (cookieKey === key) {
        return decodeURIComponent(rest.join('='));
      }
    }
    return null;
  },

  setItem(key: string, value: string, days: number = DEFAULT_MAX_AGE_DAYS) {
    if (!isBrowser()) return;
    const expires = getExpiresString(days);
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  },

  removeItem(key: string) {
    if (!isBrowser()) return;
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  }
};


