import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { useCallback, type PointerEvent } from 'react';
import { CARD_TILT_DEGREES } from '../config/constants';

interface Tilt {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/** Subtle 3D tilt that follows the pointer. Disabled for touch input. */
export function useTilt(enabled: boolean): Tilt {
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const rotateX = useSpring(targetX, SPRING);
  const rotateY = useSpring(targetY, SPRING);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetX.set(-py * 2 * CARD_TILT_DEGREES);
      targetY.set(px * 2 * CARD_TILT_DEGREES);
    },
    [enabled, targetX, targetY],
  );

  const onPointerLeave = useCallback(() => {
    targetX.set(0);
    targetY.set(0);
  }, [targetX, targetY]);

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
}
