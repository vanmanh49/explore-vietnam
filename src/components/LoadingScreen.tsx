import { AnimatePresence, motion } from 'framer-motion';
import { VietnamOutline } from './BrandMark';

interface LoadingScreenProps {
  visible: boolean;
  /** 0..1 */
  progress: number;
}

export function LoadingScreen({ visible, progress }: LoadingScreenProps) {
  const percent = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-ink-deep"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Dawn glow behind the emblem */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 45% at 50% 62%, rgb(242 179 140 / 0.22), transparent 70%), radial-gradient(90% 60% at 50% 100%, rgb(79 179 154 / 0.14), transparent 70%)',
            }}
          />
          <VietnamOutline animated className="relative h-44 w-auto text-saffron sm:h-56" />
          <div className="relative flex flex-col items-center gap-4">
            <p className="font-display text-lg tracking-[0.28em] text-mist uppercase">
              Discovering Vietnam
            </p>
            <div
              className="h-px w-52 overflow-hidden bg-mist/20"
              role="progressbar"
              aria-label="Loading"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <div
                className="h-full origin-left bg-saffron transition-transform duration-300 ease-out"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
