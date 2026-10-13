import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, MapPinned } from 'lucide-react';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { CATEGORY_BY_ID } from '../data/categories';
import { DESTINATIONS } from '../data/destinations';
import { REGION_BY_ID } from '../data/regions';
import { useDialog } from '../hooks/useDialog';
import type { Destination } from '../types';
import { LanternIcon } from './BrandMark';
import { DestinationCard } from './DestinationCard';
import { SmartImage } from './SmartImage';

interface DestinationDetailProps {
  destination: Destination;
  onClose: () => void;
  onShowOnMap: (id: string) => void;
  onOpen: (id: string) => void;
}

const TOP_BUTTON =
  'glass flex h-11 items-center gap-2 rounded-full px-4 text-sm font-normal text-mist transition-colors duration-200 hover:bg-ink-soft/80';

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-mist/15 pt-8">
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function LanternList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-mist/90">
          <LanternIcon className="mt-1.5 h-3.5 w-3.5 shrink-0 text-saffron" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Full-screen guide to one destination. */
export default function DestinationDetail({
  destination,
  onClose,
  onShowOnMap,
  onOpen,
}: DestinationDetailProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useDialog(dialogRef, onClose);

  const region = REGION_BY_ID[destination.region];
  const related = useMemo(
    () =>
      DESTINATIONS.filter(
        (place) => place.region === destination.region && place.id !== destination.id,
      ),
    [destination],
  );

  // Moving between related places reuses the dialog: start each at the top.
  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 });
  }, [destination.id]);

  const facts: { term: string; detail: string }[] = [
    { term: 'Location', detail: destination.province },
    { term: 'Region', detail: region.name },
    { term: 'Best time to visit', detail: destination.bestTime },
    {
      term: 'Good for',
      detail: destination.categories.map((id) => CATEGORY_BY_ID[id].label).join(', '),
    },
  ];

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-ink-deep"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none sticky top-0 z-10 flex justify-between gap-3 p-3 sm:p-5">
        <button
          type="button"
          data-autofocus
          onClick={onClose}
          className={`${TOP_BUTTON} pointer-events-auto`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={() => onShowOnMap(destination.id)}
          className={`${TOP_BUTTON} pointer-events-auto`}
        >
          <MapPinned className="h-4 w-4" aria-hidden="true" />
          Show on map
        </button>
      </div>

      <header className="relative -mt-[4.25rem] sm:-mt-[5.25rem]">
        <SmartImage
          key={destination.id}
          src={destination.images[0]}
          alt={`${destination.name}, ${destination.province}`}
          width={1280}
          seed={destination.id}
          eager
          className="h-[68svh] min-h-[26rem] w-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgb(10 34 43 / 0.45) 0%, transparent 30%, rgb(10 34 43 / 0.35) 60%, #0a222b 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-8 sm:px-10">
          <p lang="vi" className="font-display text-xl text-sand italic sm:text-2xl">
            {destination.localName}
          </p>
          <h1
            id="detail-title"
            className="mt-1 text-[clamp(2.6rem,9vw,7rem)] leading-[0.92] font-light tracking-[0.02em] uppercase"
          >
            {destination.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg font-normal text-mist/90">
            {destination.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-14 px-5 pt-10 pb-24 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <section aria-labelledby="detail-about">
            <h2 id="detail-about" className="text-3xl sm:text-4xl">
              About
            </h2>
            <p className="mt-6 max-w-[38rem] text-xl leading-relaxed text-mist/95">
              {destination.longDescription}
            </p>
            <h3 className="mt-10 text-2xl">History</h3>
            <p className="mt-3 max-w-[38rem] text-mist/85">{destination.history}</p>
            <h3 className="mt-8 text-2xl">Culture</h3>
            <p className="mt-3 max-w-[38rem] text-mist/85">{destination.culture}</p>
          </section>

          <aside aria-label="At a glance" className="glass self-start rounded-3xl p-6">
            <dl className="space-y-5">
              {facts.map((fact) => (
                <div key={fact.term}>
                  <dt className="text-sm font-normal text-mist/60">{fact.term}</dt>
                  <dd className="mt-0.5 font-display text-xl">{fact.detail}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => onShowOnMap(destination.id)}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-5 py-3 font-medium text-ink-deep transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MapPinned className="h-4 w-4" aria-hidden="true" />
              Show on map
            </button>
          </aside>
        </div>

        <DetailSection title="Highlights">
          <LanternList items={destination.attractions} />
        </DetailSection>

        <DetailSection title="Things to do">
          <LanternList items={destination.activities} />
        </DetailSection>

        {destination.images.length > 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {destination.images.slice(1, 3).map((image) => (
              <SmartImage
                key={image}
                src={image}
                alt={`A view of ${destination.name}`}
                width={960}
                seed={image}
                className="aspect-[4/3] rounded-3xl"
              />
            ))}
          </div>
        )}

        <DetailSection title="Local food">
          <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {destination.foods.map((dish) => (
              <li key={dish.name}>
                <p lang="vi" className="font-display text-2xl text-saffron">
                  {dish.name}
                </p>
                <p className="mt-1 text-mist/85">{dish.description}</p>
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection title="Travel tips">
          <ul className="max-w-[40rem] space-y-3">
            {destination.travelTips.map((tip) => (
              <li key={tip} className="flex items-start gap-3 text-mist/90">
                <LanternIcon className="mt-1.5 h-3.5 w-3.5 shrink-0 text-saffron" />
                {tip}
              </li>
            ))}
          </ul>
        </DetailSection>

        {related.length > 0 && (
          <DetailSection title={`More in ${region.name}`}>
            <ul className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:-mx-10 sm:px-10">
              {related.map((place) => (
                <li key={place.id} className="shrink-0">
                  <DestinationCard
                    destination={place}
                    variant="compact"
                    tiltEnabled={false}
                    onOpen={onOpen}
                  />
                </li>
              ))}
            </ul>
          </DetailSection>
        )}
      </div>
    </motion.div>
  );
}
