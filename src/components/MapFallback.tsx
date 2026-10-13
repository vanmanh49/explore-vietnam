import { ARCHIPELAGOS } from '../data/archipelagos';
import { DESTINATIONS } from '../data/destinations';
import { project } from '../lib/geo';
import { OUTLINE_PATH, OUTLINE_VIEWBOX } from '../lib/outlinePath';
import { DestinationMarker } from './DestinationMarker';

interface MapFallbackProps {
  hoveredId: string | null;
  /** Markers respond to input only while the visitor is exploring. */
  interactive: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/**
 * Flat map shown when WebGL is unavailable or the 3D scene fails.
 * Every destination stays reachable.
 */
export function MapFallback({ hoveredId, interactive, onHover, onSelect }: MapFallbackProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[12vw]"
      style={{
        background:
          'linear-gradient(180deg, #0d2b3e 0%, #2f5868 45%, #86a0aa 78%, #f2b38c 100%)',
      }}
    >
      <svg
        viewBox={OUTLINE_VIEWBOX}
        role="group"
        aria-label="Map of Vietnam"
        className={`h-[86%] w-auto max-w-full ${interactive ? '' : 'pointer-events-none'}`}
      >
        <path
          d={OUTLINE_PATH}
          fill="#2b6157"
          stroke="#eef1ea"
          strokeOpacity={0.5}
          strokeWidth={0.04}
          strokeLinejoin="round"
        />
        {ARCHIPELAGOS.map((archipelago) => {
          const { x, z } = project(archipelago.labelAt);
          return (
            // Browsers enforce a minimum font size, so draw large and scale down.
            <text
              key={archipelago.id}
              lang="vi"
              transform={`translate(${x} ${z}) scale(0.02)`}
              textAnchor="middle"
              fontSize={15}
              fontStyle="italic"
              fill="#eef1ea"
              fillOpacity={0.85}
              className="pointer-events-none font-display"
            >
              {archipelago.name}
            </text>
          );
        })}
        {interactive &&
          DESTINATIONS.map((destination) => (
            <DestinationMarker
              key={destination.id}
              destination={destination}
              highlighted={hoveredId === destination.id}
              onHover={onHover}
              onSelect={onSelect}
            />
          ))}
      </svg>
    </div>
  );
}
