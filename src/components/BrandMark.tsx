import { OUTLINE_PATH, OUTLINE_VIEWBOX } from '../lib/outlinePath';

interface OutlineProps {
  className?: string;
  /** Draws the coastline stroke by stroke, used on the loading screen. */
  animated?: boolean;
  filled?: boolean;
}

/** The outline of Vietnam, used as the site's emblem. */
export function VietnamOutline({ className, animated = false, filled = false }: OutlineProps) {
  return (
    <svg viewBox={OUTLINE_VIEWBOX} className={className} aria-hidden="true">
      <path
        d={OUTLINE_PATH}
        pathLength={1}
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? 0.12 : undefined}
        stroke="currentColor"
        strokeWidth={0.07}
        strokeLinejoin="round"
        strokeDasharray={animated ? 1 : undefined}
        style={animated ? { animation: 'draw-outline 2.2s ease-in-out both' } : undefined}
      />
    </svg>
  );
}

/** A small silk lantern, the same shape as the map markers. */
export function LanternIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <ellipse cx="12" cy="12" rx="5.2" ry="6.6" fill="currentColor" />
      <path
        d="M9.2 4.6h5.6M9.2 19.4h5.6M12 2v2.6M12 19.4V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** The flag of Vietnam: a yellow star on a red field, in 3:2 proportions. */
export function FlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" rx="2" fill="#da251d" />
      <path
        fill="#ffff00"
        d="M15 4l1.35 4.15h4.36l-3.53 2.56 1.35 4.150L15 12.29l-3.53 2.57 1.35-4.15-3.53-2.56h4.360z"
      />
    </svg>
  );
}
