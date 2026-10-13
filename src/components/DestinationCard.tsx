import { motion } from 'framer-motion';
import { CalendarDays, MapPin } from 'lucide-react';
import { memo } from 'react';
import { CATEGORY_BY_ID } from '../data/categories';
import { REGION_BY_ID } from '../data/regions';
import { useTilt } from '../hooks/useTilt';
import type { Destination } from '../types';
import { SmartImage } from './SmartImage';

interface DestinationCardProps {
  destination: Destination;
  /** Compact cards drop the description and facts, for tight rows. */
  variant?: 'full' | 'compact';
  tiltEnabled: boolean;
  onOpen: (id: string) => void;
  onHover?: (id: string | null) => void;
}

export const DestinationCard = memo(function DestinationCard({
  destination,
  variant = 'full',
  tiltEnabled,
  onOpen,
  onHover,
}: DestinationCardProps) {
  const tilt = useTilt(tiltEnabled);
  const compact = variant === 'compact';
  const category = CATEGORY_BY_ID[destination.categories[0]!].label;
  const region = REGION_BY_ID[destination.region].shortName;

  return (
    <motion.article
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 900 }}
      onPointerMove={tilt.onPointerMove}
      onPointerEnter={onHover ? () => onHover(destination.id) : undefined}
      onPointerLeave={() => {
        tilt.onPointerLeave();
        onHover?.(null);
      }}
      className={`group ${compact ? 'glass' : 'card-surface'} relative flex flex-col overflow-hidden rounded-3xl transition-shadow duration-500 hover:shadow-[0_30px_60px_-24px_rgb(4_18_24/0.9)] ${
        compact ? 'w-56 shrink-0 snap-start sm:w-60' : 'h-full'
      }`}
    >
      <div className="relative">
        <SmartImage
          src={destination.images[0]}
          alt={`${destination.name}, ${destination.province}`}
          width={compact ? 330 : 500}
          seed={destination.id}
          className={compact ? 'aspect-[5/3]' : 'aspect-[4/3]'}
          imageClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-ink-deep/85 px-3 py-1 text-xs font-medium text-saffron ">
          {category}
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5 pt-4'}`}>
        <h3 className={compact ? 'text-xl' : 'text-[1.7rem]'}>
          {/* The stretched button makes the whole card one target. */}
          <button
            type="button"
            onClick={() => onOpen(destination.id)}
            className="text-left after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-saffron"
          >
            {destination.name}
          </button>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-normal text-mist/65">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {destination.province}
        </p>

        {!compact && (
          <>
            <p className="mt-3 text-[0.95rem] text-mist/85">{destination.description}</p>
            <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-5 text-sm font-normal text-mist/70">
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Region</dt>
                <dd>{region}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt>
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">Best time to visit</span>
                </dt>
                <dd>{destination.bestTime}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </motion.article>
  );
});
