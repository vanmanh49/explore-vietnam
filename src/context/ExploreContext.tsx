import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { DESTINATION_BY_ID } from '../data/destinations';
import { useDestinationRoute } from '../hooks/useDestinationRoute';
import { scrollToTop } from '../lib/dom';
import type { Destination, MapFocus, RegionId, StageMode } from '../types';

interface JourneyState {
  /** True while the scroll journey section fills the viewport. */
  active: boolean;
  region: RegionId;
}

interface ExploreContextValue {
  mode: StageMode;
  focus: MapFocus;
  viewNonce: number;
  hoveredId: string | null;
  journey: JourneyState;
  journeyProgress: RefObject<number>;
  /** False once the page has scrolled past everything that shows the 3D scene. */
  sceneVisible: boolean;
  /** On touch devices the map only captures drags after the visitor unlocks it. */
  touchUnlocked: boolean;
  activeDestination: Destination | null;
  enterExplore: () => void;
  exitExplore: () => void;
  focusRegion: (region: RegionId | 'all') => void;
  resetView: () => void;
  setHoveredId: (id: string | null) => void;
  setJourney: (journey: JourneyState) => void;
  setSceneVisible: (visible: boolean) => void;
  setTouchUnlocked: (unlocked: boolean) => void;
  openDestination: (id: string) => void;
  closeDestination: () => void;
  /** Closes any open detail view and flies the map to the destination. */
  showOnMap: (id: string) => void;
}

const ExploreContext = createContext<ExploreContextValue | null>(null);

const OVERVIEW: MapFocus = { kind: 'overview' };

export function ExploreProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StageMode>('intro');
  const [focus, setFocus] = useState<MapFocus>(OVERVIEW);
  const [viewNonce, setViewNonce] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [journey, setJourneyState] = useState<JourneyState>({ active: false, region: 'north' });
  const [sceneVisible, setSceneVisible] = useState(true);
  const [touchUnlocked, setTouchUnlocked] = useState(false);
  const journeyProgress = useRef(0);
  const route = useDestinationRoute();

  const activeDestination = route.slug ? (DESTINATION_BY_ID.get(route.slug) ?? null) : null;

  const enterExplore = useCallback(() => {
    setMode('explore');
    setViewNonce((value) => value + 1);
    scrollToTop();
  }, []);

  const exitExplore = useCallback(() => {
    setMode('intro');
    setFocus(OVERVIEW);
    setTouchUnlocked(false);
    scrollToTop();
  }, []);

  const focusRegion = useCallback((region: RegionId | 'all') => {
    setFocus(region === 'all' ? OVERVIEW : { kind: 'region', region });
    setViewNonce((value) => value + 1);
  }, []);

  const resetView = useCallback(() => setViewNonce((value) => value + 1), []);

  const setJourney = useCallback((next: JourneyState) => {
    setJourneyState((previous) =>
      previous.active === next.active && previous.region === next.region ? previous : next,
    );
  }, []);

  const { open: openRoute, close: closeRoute } = route;

  const showOnMap = useCallback(
    (id: string) => {
      closeRoute();
      setMode('explore');
      setFocus({ kind: 'destination', id });
      setViewNonce((value) => value + 1);
      scrollToTop();
    },
    [closeRoute],
  );

  const value = useMemo<ExploreContextValue>(
    () => ({
      mode,
      focus,
      viewNonce,
      hoveredId,
      journey,
      journeyProgress,
      sceneVisible,
      touchUnlocked,
      activeDestination,
      enterExplore,
      exitExplore,
      focusRegion,
      resetView,
      setHoveredId,
      setJourney,
      setSceneVisible,
      setTouchUnlocked,
      openDestination: openRoute,
      closeDestination: closeRoute,
      showOnMap,
    }),
    [
      mode,
      focus,
      viewNonce,
      hoveredId,
      journey,
      sceneVisible,
      touchUnlocked,
      activeDestination,
      enterExplore,
      exitExplore,
      focusRegion,
      resetView,
      setJourney,
      openRoute,
      closeRoute,
      showOnMap,
    ],
  );

  return <ExploreContext value={value}>{children}</ExploreContext>;
}

export function useExplore(): ExploreContextValue {
  const context = use(ExploreContext);
  if (!context) throw new Error('useExplore must be used inside ExploreProvider');
  return context;
}
