import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Compass } from 'lucide-react';
import { SECTION_IDS, SITE } from '../config/constants';
import { useExplore } from '../context/ExploreContext';
import { scrollToSection } from '../lib/dom';

const LETTERS = SITE.title.split('');
const EASE = [0.22, 1, 0.36, 1] as const;

interface HeroProps {
  /** Starts the entrance once the loading screen has cleared. */
  ready: boolean;
}

export function Hero({ ready }: HeroProps) {
  const { enterExplore } = useExplore();
  const reducedMotion = useReducedMotion();
  const state = ready ? 'shown' : 'hidden';

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-end"
      initial={false}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Scrim so the type holds against a bright horizon */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(10 34 43 / 0.35) 0%, transparent 28%, transparent 42%, rgb(10 34 43 / 0.82) 100%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 sm:px-10 sm:pb-14">
        <h1
          aria-label={SITE.title}
          className="pointer-events-auto flex font-display text-[clamp(3.6rem,17.5vw,16rem)] leading-[0.82] font-light tracking-[0.03em] text-mist"
        >
          {LETTERS.map((letter, index) => (
            <span key={index} aria-hidden="true" className="overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial="hidden"
                animate={state}
                variants={{
                  hidden: { y: reducedMotion ? 0 : '105%', opacity: reducedMotion ? 0 : 1 },
                  shown: { y: 0, opacity: 1 },
                }}
                transition={{ duration: 1.1, delay: 0.15 + index * 0.07, ease: EASE }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-6 flex flex-col gap-7 sm:mt-8 sm:flex-row sm:items-end sm:justify-between"
          initial="hidden"
          animate={state}
          variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
          transition={{ duration: 0.9, delay: 0.9, ease: 'easeOut' }}
        >
          <div className="pointer-events-auto max-w-md">
            <p className="text-lg font-normal text-mist sm:text-xl">{SITE.subtitle}</p>
            <p className="mt-1 font-display text-lg text-sand italic">{SITE.tagline}</p>
          </div>

          <div className="pointer-events-auto flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={enterExplore}
              className="group flex items-center gap-3 rounded-full bg-saffron py-3.5 pr-7 pl-5 text-base font-medium text-ink-deep shadow-[0_14px_40px_-12px_rgb(244_176_74/0.7)] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass
                className="h-5 w-5 transition-transform duration-500 ease-out group-hover:rotate-45"
                aria-hidden="true"
              />
              Explore Vietnam
            </button>
            <button
              type="button"
              onClick={() => scrollToSection(SECTION_IDS.regions)}
              className="glass-light flex items-center gap-2 rounded-full py-3.5 pr-5 pl-6 text-base font-normal text-mist transition-colors duration-300 hover:bg-mist/20"
            >
              Travel north to south
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
