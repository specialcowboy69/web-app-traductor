type AnalyticsParams = Record<string, string | number | boolean | undefined>;
const GA_MEASUREMENT_ID = 'G-0TJ7ELB5DC';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, {
    page_path: window.location.pathname,
    ...params,
  });
}

export function trackPageView(path: string, title = document.title) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    page_title: title,
    page_location: window.location.href,
    page_path: path,
  });
}
