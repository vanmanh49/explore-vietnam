import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { SECTION_IDS } from '../config/constants';
import { useExplore } from '../context/ExploreContext';
import { DESTINATIONS } from '../data/destinations';
import { REGIONS } from '../data/regions';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import { useJourneyScroll } from '../hooks/useJourneyScroll';
import { prefersReducedMotion } from '../lib/dom';
import { RegionSection } from './RegionSection';

const STEP_COUNT = REGIONS.length;

/**
 * Scroll-driven journey from north to south. The section is tall and its
 * content pinned: scrolling moves the 3D camera down the country while the
 * region panels slide sideways in step.
 */
export function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { journeyProgress, setJourney, setSceneVisible, setHoveredId, openDestination } =
    useExplore();
  const device = useDeviceProfile();
  const reducedMotion = useReducedMotion();
  const { step, pinned, reached } = useJourneyScroll(sectionRef, journeyProgress, STEP_COUNT);

  useEffect(() => {
    setJourney({ active: pinned, region: REGIONS[step]!.id });
  }, [pinned, step, setJourney]);

  useEffect(() => {
    setSceneVisible(reached);
  }, [reached, setSceneVisible]);

  const destinationsByRegion = useMemo(
    () => REGIONS.map((region) => DESTINATIONS.filter((place) => place.region === region.id)),
    [],
  );

  const goToStep = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollable = section.offsetHeight - window.innerHeight;
    const top = section.offsetTop + ((index + 0.5) / STEP_COUNT) * scrollable;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.regions}
      aria-labelledby="journey-title"
      className="pointer-events-none relative h-[360svh]"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgb(10 34 43 / 0.5) 0%, transparent 26%, transparent 38%, rgb(10 34 43 / 0.9) 82%)',
          }}
        />

        <header className="relative px-5 pt-24 sm:px-10 sm:pt-28">
          <h2 id="journey-title" className="sr-only">
            The journey from north to south
          </h2>
          <ol className="pointer-events-auto mx-auto flex max-w-xl items-center">
            {REGIONS.map((region, index) => {
              const current = index === step;
              const passed = index < step;
              return (
                <li key={region.id} className="flex flex-1 items-center last:flex-none">
                  <button
                    type="button"
                    onClick={() => goToStep(index)}
                    aria-current={current ? 'step' : undefined}
                    className="group flex items-center gap-2.5 rounded-full py-1 pr-1"
                  >
                    <span
                      className={`h-3 w-3 rounded-full border transition-all duration-500 ${
                        current
                          ? 'scale-125 border-saffron bg-saffron shadow-[0_0_0_5px_rgb(244_176_74/0.25)]'
                          : passed
                            ? 'border-saffron bg-saffron/70'
                            : 'border-mist/70 bg-transparent group-hover:border-mist'
                      }`}
                    />
                    <span
                      className={`text-sm tracking-wide transition-colors duration-300 ${
                        current ? 'font-medium text-mist' : 'font-normal text-mist/70 group-hover:text-mist'
                      }`}
                    >
                      {region.shortName}
                    </span>
                  </button>
                  {index < STEP_COUNT - 1 && (
                    <span className="relative mx-3 h-px flex-1 bg-mist/30" aria-hidden="true">
                      <span
                        className="absolute inset-0 origin-left bg-saffron transition-transform duration-700 ease-out"
                        style={{ transform: `scaleX(${passed ? 1 : 0})` }}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </header>

        <div className="relative min-h-0 flex-1">
          <motion.div
            className="flex h-full"
            style={{ width: `${STEP_COUNT * 100}%` }}
            animate={{ x: `${(-step * 100) / STEP_COUNT}%` }}
            transition={
              reducedMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {REGIONS.map((region, index) => (
              <div key={region.id} className="h-full" style={{ width: `${100 / STEP_COUNT}%` }}>
                <RegionSection
                  region={region}
                  destinations={destinationsByRegion[index]!}
                  active={index === step}
                  tiltEnabled={!device.coarsePointer && !device.reducedMotion}
                  onOpen={openDestination}
                  onHover={setHoveredId}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
