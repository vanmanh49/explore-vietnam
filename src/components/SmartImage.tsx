import { memo, useMemo, useState } from 'react';
import { sizedImage } from '../lib/image';
import { hashString, seededRandom } from '../lib/noise';

const PLACEHOLDER_SKIES: [string, string, string][] = [
  ['#0d2b3e', '#86a0aa', '#f2b38c'],
  ['#2b2f57', '#a58e8c', '#f7a866'],
  ['#0b3b45', '#7fae9e', '#f5d08a'],
];
const PLACEHOLDER_HILLS = ['#2b6157', '#1a4250', '#0f2f3a'];

function hillPath(random: () => number, base: number, amplitude: number): string {
  const a = random() * 6.28;
  const b = random() * 6.28;
  const points: string[] = [];
  for (let x = 0; x <= 400; x += 20) {
    const y =
      base -
      amplitude * (0.6 * Math.sin(x * 0.012 + a) + 0.4 * Math.sin(x * 0.031 + b)) -
      amplitude * 0.5;
    points.push(`${x} ${y.toFixed(1)}`);
  }
  return `M0 300L${points.join('L')}L400 300Z`;
}

/** A drawn landscape shown while a photo loads, or in its place if it fails. */
const ScenicPlaceholder = memo(function ScenicPlaceholder({ seed }: { seed: string }) {
  const art = useMemo(() => {
    const hash = hashString(seed);
    const random = seededRandom(hash);
    return {
      id: `sky-${hash}`,
      sky: PLACEHOLDER_SKIES[hash % PLACEHOLDER_SKIES.length]!,
      sunX: 90 + random() * 220,
      hills: [
        hillPath(random, 190, 34),
        hillPath(random, 225, 26),
        hillPath(random, 262, 18),
      ],
    };
  }, [seed]);

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={art.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={art.sky[0]} />
          <stop offset="0.55" stopColor={art.sky[1]} />
          <stop offset="0.8" stopColor={art.sky[2]} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${art.id})`} />
      <circle cx={art.sunX} cy="168" r="22" fill="#ffe2b8" opacity="0.85" />
      {art.hills.map((path, index) => (
        <path key={index} d={path} fill={PLACEHOLDER_HILLS[index]} />
      ))}
    </svg>
  );
});

interface SmartImageProps {
  src: string | undefined;
  alt: string;
  /** Rendered width in CSS pixels, used to request a suitably small file. */
  width: number;
  /** Seeds the placeholder artwork so each subject gets its own. */
  seed: string;
  className?: string;
  imageClassName?: string;
  eager?: boolean;
}

type Status = 'loading' | 'loaded' | 'failed';

/** Lazy-loaded photo that degrades to drawn artwork instead of a broken icon. */
export function SmartImage({
  src,
  alt,
  width,
  seed,
  className = '',
  imageClassName = '',
  eager = false,
}: SmartImageProps) {
  const [status, setStatus] = useState<Status>(src ? 'loading' : 'failed');
  const [trackedSrc, setTrackedSrc] = useState(src);

  // Reset when the component is reused for a different photo.
  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setStatus(src ? 'loading' : 'failed');
  }

  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      {status !== 'loaded' && <ScenicPlaceholder seed={seed} />}
      {src && status !== 'failed' && (
        <img
          src={sizedImage(src, width)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('failed')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imageClassName}`}
        />
      )}
      {status === 'failed' && <span className="sr-only">{alt}</span>}
    </div>
  );
}
