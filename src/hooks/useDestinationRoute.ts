import { useCallback, useEffect, useState } from 'react';

const PARAM = 'place';

function readSlug(): string | null {
  return new URLSearchParams(window.location.search).get(PARAM);
}

/**
 * Keeps the open destination in the URL (`?place=hoi-an`) so that detail
 * views can be linked to and the browser back button closes them.
 */
export function useDestinationRoute() {
  const [slug, setSlug] = useState<string | null>(readSlug);

  useEffect(() => {
    const onPopState = () => setSlug(readSlug());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const open = useCallback((next: string) => {
    const url = new URL(window.location.href);
    const replacing = url.searchParams.has(PARAM);
    url.searchParams.set(PARAM, next);
    if (replacing) window.history.replaceState({ place: true }, '', url);
    else window.history.pushState({ place: true }, '', url);
    setSlug(next);
  }, []);

  const close = useCallback(() => {
    if (window.history.state?.place) {
      // Opened from inside the app: step back so history stays clean.
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    window.history.replaceState(null, '', url);
    setSlug(null);
  }, []);

  return { slug, open, close };
}
