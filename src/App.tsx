import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useCallback, useState } from 'react';
import { AboutVietnam } from './components/AboutVietnam';
import { DestinationExplorer } from './components/DestinationExplorer';
import { Experiences } from './components/Experiences';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { SceneStage } from './components/SceneStage';
import { Timeline } from './components/Timeline';
import { VietnamMap } from './components/VietnamMap';
import { SECTION_IDS } from './config/constants';
import { ExploreProvider, useExplore } from './context/ExploreContext';
import { FilterProvider } from './context/FilterContext';
import { useLoadingProgress } from './hooks/useLoadingProgress';

const DestinationDetail = lazy(() => import('./components/DestinationDetail'));

function AppShell() {
  const { mode, activeDestination, openDestination, closeDestination, showOnMap } = useExplore();
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);
  const loading = useLoadingProgress(sceneReady);
  const detailOpen = activeDestination !== null;

  return (
    <>
      <a
        href={`#${SECTION_IDS.destinations}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-saffron focus:px-5 focus:py-3 focus:font-medium focus:text-ink-deep"
      >
        Skip to destinations
      </a>

      <LoadingScreen visible={!loading.done} progress={loading.progress} />
      <SceneStage onReady={handleSceneReady} />

      <div inert={detailOpen}>
        <Navbar />
        {/* Transparent sections let pointer input fall through to the 3D map. */}
        <main className="pointer-events-none relative z-10">
          {/* The 3D scene shows through this section and the journey below it. */}
          <section
            id={SECTION_IDS.home}
            aria-label={mode === 'intro' ? 'Welcome' : 'Interactive map of Vietnam'}
            className="pointer-events-none relative h-svh"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'intro' ? <Hero key="hero" ready={loading.done} /> : <VietnamMap key="map" />}
            </AnimatePresence>
          </section>
          <Timeline />
          <DestinationExplorer />
          <Experiences />
          <AboutVietnam />
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {activeDestination && (
          <Suspense fallback={null}>
            <DestinationDetail
              destination={activeDestination}
              onClose={closeDestination}
              onShowOnMap={showOnMap}
              onOpen={openDestination}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ExploreProvider>
      <FilterProvider>
        <AppShell />
      </FilterProvider>
    </ExploreProvider>
  );
}
