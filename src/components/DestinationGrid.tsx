import { AnimatePresence, motion } from 'framer-motion';
import type { Destination } from '../types';
import { DestinationCard } from './DestinationCard';

interface DestinationGridProps {
  destinations: Destination[];
  tiltEnabled: boolean;
  onOpen: (id: string) => void;
  onClearFilters: () => void;
}

export function DestinationGrid({
  destinations,
  tiltEnabled,
  onOpen,
  onClearFilters,
}: DestinationGridProps) {
  if (destinations.length === 0) {
    return (
      <div className="glass rounded-3xl px-6 py-14 text-center">
        <p className="font-display text-2xl">No places match that search.</p>
        <p className="mt-2 text-mist/75">
          Try a different word, such as “beach” or “caves”, or remove a filter.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 rounded-full bg-saffron px-6 py-3 font-medium text-ink-deep transition-transform duration-300 hover:-translate-y-0.5"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {destinations.map((destination) => (
          <motion.li
            key={destination.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <DestinationCard destination={destination} tiltEnabled={tiltEnabled} onOpen={onOpen} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
