import { memo, type KeyboardEvent } from 'react';
import { project } from '../lib/geo';
import type { Destination } from '../types';

interface DestinationMarkerProps {
  destination: Destination;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/** Marker for the 2D map, in the same map units as the outline path. */
export const DestinationMarker = memo(function DestinationMarker({
  destination,
  highlighted,
  onHover,
  onSelect,
}: DestinationMarkerProps) {
  const { x, z } = project(destination.coordinates);

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(destination.id);
    }
  };

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${destination.name}, open details`}
      transform={`translate(${x} ${z})`}
      className="cursor-pointer text-saffron outline-none [&:focus-visible>circle:last-of-type]:stroke-mist"
      onClick={() => onSelect(destination.id)}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => onHover(destination.id)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(destination.id)}
      onBlur={() => onHover(null)}
    >
      <circle r={0.42} fill="transparent" />
      <circle r={highlighted ? 0.32 : 0.22} fill="currentColor" opacity={0.25} />
      <circle
        r={highlighted ? 0.14 : 0.1}
        fill={highlighted ? '#fff3d6' : 'currentColor'}
        stroke="transparent"
        strokeWidth={0.04}
      />
      {highlighted && (
        // Browsers enforce a minimum font size, so draw large and scale down.
        <text
          transform="scale(0.02)"
          y={-21}
          textAnchor="middle"
          fontSize={18}
          fontWeight={500}
          fill="#eef1ea"
          stroke="#0a222b"
          strokeWidth={4.5}
          paintOrder="stroke"
          className="pointer-events-none font-sans"
        >
          {destination.name}
        </text>
      )}
    </g>
  );
});
