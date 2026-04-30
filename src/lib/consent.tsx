import React from 'react';

const CONSENT_COOKIE_NAME = 'site_consent';
const GA_MEASUREMENT_ID = 'G-0TJ7ELB5DC';
const GA_SCRIPT_ID = 'ga4-script';
const ANALYTICS_GRANTED_EVENT = 'analytics-consent-granted';

type ConsentState = {
  necessary: true;
  analytics: boolean;
};

type ConsentContextValue = {
  consent: ConsentState | null;
  hasAnswered: boolean;
  isBannerOpen: boolean;
  saveConsent: (analytics: boolean) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = React.createContext<ConsentContextValue | null>(null);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  const prefix = `${name}=`;
  const parts = document.cookie.split(';').map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function readStoredConsent(): ConsentState | null {
  const raw = getCookie(CONSENT_COOKIE_NAME);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
    };
  } catch {
    return null;
  }
}

function removeAnalyticsRuntime() {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  document.cookie.split(';').forEach((part) => {
    const name = part.trim().split('=')[0];
    if (name === '_ga' || name.startsWith('_ga_')) {
      deleteCookie(name);
    }
  });
}

function loadConsentModeRuntime() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  if (document.getElementById(GA_SCRIPT_ID)) return;

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  const script = document.createElement('script');
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<ConsentState | null>(null);
  const [isBannerOpen, setIsBannerOpen] = React.useState(false);

  React.useLayoutEffect(() => {
    loadConsentModeRuntime();

    const stored = readStoredConsent();
    setConsent(stored);
    setIsBannerOpen(!stored);
  }, []);

  React.useLayoutEffect(() => {
    if (!consent || typeof window.gtag !== 'function') return;

    if (consent.analytics) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      window.dispatchEvent(new Event(ANALYTICS_GRANTED_EVENT));
    } else {
      removeAnalyticsRuntime();
    }
  }, [consent]);

  const saveConsent = React.useCallback((analytics: boolean) => {
    const nextConsent: ConsentState = {
      necessary: true,
      analytics,
    };

    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(nextConsent), 180);
    setConsent(nextConsent);
    setIsBannerOpen(false);
  }, []);

  const openPreferences = React.useCallback(() => {
    setIsBannerOpen(true);
  }, []);

  const closePreferences = React.useCallback(() => {
    if (consent) {
      setIsBannerOpen(false);
    }
  }, [consent]);

  const value = React.useMemo<ConsentContextValue>(
    () => ({
      consent,
      hasAnswered: Boolean(consent),
      isBannerOpen,
      saveConsent,
      openPreferences,
      closePreferences,
    }),
    [closePreferences, consent, isBannerOpen, openPreferences, saveConsent],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = React.useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
}
