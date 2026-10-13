import { CloudSun } from 'lucide-react';
import type { Destination, Region } from '../types';
import { DestinationCard } from './DestinationCard';

interface RegionSectionProps {
  region: Region;
  destinations: Destination[];
  /** Off-screen panels are hidden from keyboard and assistive technology. */
  active: boolean;
  tiltEnabled: boolean;
  onOpen: (id: string) => void;
  onHover: (id: string | null) => void;
}

/** One leg of the journey: the region's story and the places within it. */
export function RegionSection({
  region,
  destinations,
  active,
  tiltEnabled,
  onOpen,
  onHover,
}: RegionSectionProps) {
  return (
    <div
      role="group"
      aria-label={region.name}
      inert={!active}
      className="flex h-full w-full shrink-0 flex-col justify-end gap-6 px-5 pb-6 sm:px-10 sm:pb-10 lg:flex-row lg:items-end lg:gap-12"
    >
      <div className="pointer-events-auto max-w-md shrink-0 lg:pb-2">
        <h3 className="display-title">{region.name}</h3>
        <p className="mt-2 font-display text-lg text-saffron italic sm:text-xl">{region.tagline}</p>
        <p className="mt-4 line-clamp-3 text-mist/85 sm:line-clamp-none">{region.description}</p>
        <p className="mt-4 hidden items-start gap-2 text-sm font-normal text-mist/70 sm:flex">
          <CloudSun className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {region.climate}
        </p>
      </div>

      <ul
        aria-label={`Places in ${region.name}`}
        className="no-scrollbar pointer-events-auto -mx-5 flex min-w-0 snap-x gap-4 overflow-x-auto px-5 pt-2 pb-4 sm:-mx-10 sm:px-10 lg:mx-0 lg:flex-1 lg:px-1"
      >
        {destinations.map((destination) => (
          <li key={destination.id} className="shrink-0">
            <DestinationCard
              destination={destination}
              variant="compact"
              tiltEnabled={tiltEnabled}
              onOpen={onOpen}
              onHover={onHover}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
