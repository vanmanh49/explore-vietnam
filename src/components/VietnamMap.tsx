import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Hand, Lock, RotateCcw } from 'lucide-react';
import { useMemo } from 'react';
import { SECTION_IDS } from '../config/constants';
import { useExplore } from '../context/ExploreContext';
import { CATEGORY_BY_ID } from '../data/categories';
import { DESTINATIONS } from '../data/destinations';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import { scrollToSection } from '../lib/dom';
import type { Destination } from '../types';
import { RegionTabs } from './RegionTabs';

const CONTROL_BUTTON =
  'glass flex h-11 items-center gap-2 rounded-full px-4 text-sm font-normal whitespace-nowrap text-mist transition-colors duration-200 hover:bg-ink-soft/80';

const POINTER_HINTS = ['Drag to rotate', 'Scroll to zoom', 'Right-drag to pan'];

interface PlaceButtonProps {
  destination: Destination;
  highlighted: boolean;
  compact: boolean;
  onHover: (id: string | null) => void;
  onOpen: (id: string) => void;
}

function PlaceButton({ destination, highlighted, compact, onHover, onOpen }: PlaceButtonProps) {
  const category = CATEGORY_BY_ID[destination.categories[0]!].label;
  const shared = {
    type: 'button' as const,
    onClick: () => onOpen(destination.id),
    onPointerEnter: () => onHover(destination.id),
    onPointerLeave: () => onHover(null),
    onFocus: () => onHover(destination.id),
    onBlur: () => onHover(null),
  };

  if (compact) {
    return (
      <button
        {...shared}
        className="glass-light shrink-0 snap-start rounded-full px-4 py-2 text-sm font-normal whitespace-nowrap text-mist"
      >
        {destination.name}
      </button>
    );
  }

  return (
    <button
      {...shared}
      className={`flex w-full items-baseline justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 ${
        highlighted ? 'bg-mist/12' : 'hover:bg-mist/8'
      }`}
    >
      <span>
        <span className="block font-display text-lg leading-tight text-mist">
          {destination.name}
        </span>
        <span className="block text-xs font-normal text-mist/60">{destination.province}</span>
      </span>
      <span className="shrink-0 text-xs font-normal text-saffron">{category}</span>
    </button>
  );
}

/** Controls laid over the 3D map while exploring. */
export function VietnamMap() {
  const {
    focus,
    hoveredId,
    touchUnlocked,
    focusRegion,
    resetView,
    exitExplore,
    setHoveredId,
    setTouchUnlocked,
    openDestination,
  } = useExplore();
  const device = useDeviceProfile();

  const region = focus.kind === 'region' ? focus.region : 'all';
  const places = useMemo(
    () => DESTINATIONS.filter((place) => region === 'all' || place.region === region),
    [region],
  );

  const renderPlaces = (compact: boolean) =>
    places.map((destination) => (
      <li key={destination.id} className={compact ? 'shrink-0' : undefined}>
        <PlaceButton
          destination={destination}
          highlighted={hoveredId === destination.id}
          compact={compact}
          onHover={setHoveredId}
          onOpen={openDestination}
        />
      </li>
    ));

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Desktop: side panel */}
      <aside
        aria-label="Places on the map"
        className="glass pointer-events-auto absolute top-24 bottom-6 left-6 hidden w-[22rem] flex-col rounded-3xl p-5 lg:flex"
      >
        <h2 className="text-3xl">Choose a place</h2>
        <p className="mt-2 mb-4 text-sm font-normal text-mist/75">
          Select a lantern on the map, or a name from the list, to open its guide.
        </p>
        <RegionTabs value={region} onChange={focusRegion} label="Show region on the map" />
        <ul className="no-scrollbar -mx-2 mt-3 flex-1 overflow-y-auto">{renderPlaces(false)}</ul>
        <div className="mt-3 flex gap-2 border-t border-mist/10 pt-4">
          <button type="button" onClick={exitExplore} className={`${CONTROL_BUTTON} flex-1 justify-center`}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to start
          </button>
          <button type="button" onClick={resetView} className={`${CONTROL_BUTTON} flex-1 justify-center`}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset view
          </button>
        </div>
      </aside>

      {/* Desktop: how to move, and the way onwards */}
      <div className="absolute right-6 bottom-6 hidden flex-col items-end gap-3 lg:flex">
        <ul className="flex gap-2 text-xs font-normal text-mist/80" aria-label="Map controls">
          {POINTER_HINTS.map((hint) => (
            <li key={hint} className="glass rounded-full px-3 py-1.5">
              {hint}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => scrollToSection(SECTION_IDS.regions)}
          className={`${CONTROL_BUTTON} pointer-events-auto`}
        >
          Travel north to south
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Phone and tablet: compact controls */}
      <div className="pointer-events-auto absolute inset-x-3 top-20 flex justify-between gap-2 lg:hidden">
        <button type="button" onClick={exitExplore} className={CONTROL_BUTTON}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Start
        </button>
        <div className="flex gap-2">
          {device.coarsePointer && (
            <button
              type="button"
              aria-pressed={touchUnlocked}
              onClick={() => setTouchUnlocked(!touchUnlocked)}
              className={CONTROL_BUTTON}
            >
              {touchUnlocked ? (
                <Lock className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Hand className="h-4 w-4" aria-hidden="true" />
              )}
              {touchUnlocked ? 'Lock map' : 'Move map'}
            </button>
          )}
          <button type="button" onClick={resetView} className={CONTROL_BUTTON} aria-label="Reset view">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="glass pointer-events-auto absolute inset-x-3 bottom-3 rounded-3xl p-3 lg:hidden">
        <p className="mb-2 px-1 text-sm font-normal text-mist/80">
          Tap a lantern or a name to open its guide.
        </p>
        <RegionTabs value={region} onChange={focusRegion} label="Show region on the map" />
        <ul className="no-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
          {renderPlaces(true)}
        </ul>
      </div>
    </motion.div>
  );
}
