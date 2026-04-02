import React from 'react';

type PageMeta = {
  title: string;
  description: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

function upsertMeta(selector: string, attr: 'name' | 'property', value: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

export function usePageMeta({ title, description }: PageMeta) {
  React.useEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  }, [description, title]);
}

export function useStructuredData(
  id: string,
  data: Record<string, unknown> | Record<string, unknown>[],
) {
  React.useEffect(() => {
    const selector = `script[data-seo-ld="${id}"]`;
    let script = document.head.querySelector<HTMLScriptElement>(selector);

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-ld', id);
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);

    return () => {
      script?.remove();
    };
  }, [data, id]);
}
