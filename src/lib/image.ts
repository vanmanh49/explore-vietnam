/** Widths each local photo is stored at, smallest first. */
const LOCAL_WIDTHS = [500, 1280] as const;
const LOCAL_SIZE = /-\d+(\.\w+)$/;

/**
 * Requests an image no larger than needed. Photos in `public/images` are
 * named `<name>-<width>.jpg`, so a smaller rendition is one substitution
 * away. Any other URL is returned unchanged.
 */
export function sizedImage(url: string, width: number): string {
  if (!url.startsWith('/images/')) return url;
  const step = LOCAL_WIDTHS.find((candidate) => candidate >= width) ?? 1280;
  const sized = LOCAL_SIZE.test(url) ? url.replace(LOCAL_SIZE, `-${step}$1`) : url;
  // Respect the base path when the site is served from a sub-folder.
  return import.meta.env.BASE_URL + sized.slice(1);
}
