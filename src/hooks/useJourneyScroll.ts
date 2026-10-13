import { useEffect, useState, type RefObject } from 'react';

interface JourneyScroll {
  /** Index of the step currently on screen. */
  step: number;
  /** True while the section is pinned across the middle of the viewport. */
  pinned: boolean;
  /** True until the section has scrolled completely off the top. */
  reached: boolean;
}

/**
 * Tracks scroll progress through a tall, pinned section. Continuous progress
 * is written to a ref (read every frame by the 3D camera) so that scrolling
 * only re-renders React when the step or pinned state actually changes.
 */
export function useJourneyScroll(
  sectionRef: RefObject<HTMLElement | null>,
  progressRef: RefObject<number>,
  steps: number,
): JourneyScroll {
  const [state, setState] = useState<JourneyScroll>({ step: 0, pinned: false, reached: true });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const scrollable = Math.max(1, rect.height - viewport);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      progressRef.current = progress;

      const step = Math.min(steps - 1, Math.floor(progress * steps));
      const pinned = rect.top < viewport * 0.5 && rect.bottom > viewport * 0.5;
      const reached = rect.bottom > 0;
      setState((previous) =>
        previous.step === step && previous.pinned === pinned && previous.reached === reached
          ? previous
          : { step, pinned, reached },
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sectionRef, progressRef, steps]);

  return state;
}
