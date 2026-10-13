import { ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { SECTION_IDS } from '../config/constants';
import { useFilters } from '../context/FilterContext';
import { CATEGORIES } from '../data/categories';
import { DESTINATIONS } from '../data/destinations';
import { scrollToSection } from '../lib/dom';
import type { CategoryId } from '../types';
import { SmartImage } from './SmartImage';

const PREVIEW_COUNT = 3;

/** Ways to travel: each row filters the destinations by one interest. */
export function Experiences() {
  const { setCategory, setRegion, setQuery } = useFilters();

  const groups = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        places: DESTINATIONS.filter((place) => place.categories.includes(category.id)),
      })),
    [],
  );

  const showCategory = (id: CategoryId) => {
    setQuery('');
    setRegion('all');
    setCategory(id);
    scrollToSection(SECTION_IDS.destinations);
  };

  return (
    <section
      id={SECTION_IDS.experiences}
      aria-labelledby="experiences-title"
      className="pointer-events-auto relative bg-ink-deep px-5 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="experiences-title" className="display-title max-w-2xl">
          Travel by what you love
        </h2>
        <p className="mt-5 max-w-lg text-lg text-mist/80">
          Pick an interest to see the places that do it best.
        </p>

        <ul className="mt-14 grid gap-x-16 lg:grid-cols-2">
          {groups.map(({ category, places }) => (
            <li key={category.id} className="border-t border-mist/15">
              <button
                type="button"
                onClick={() => showCategory(category.id)}
                className="group flex w-full items-center gap-5 py-6 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-3xl text-mist transition-colors duration-300 group-hover:text-saffron sm:text-4xl">
                      {category.label}
                    </span>
                    <span className="text-sm font-normal text-mist/55">
                      {places.length} {places.length === 1 ? 'place' : 'places'}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-mist/75">{category.description}</span>
                </span>

                <span className="hidden shrink-0 -space-x-3 sm:flex" aria-hidden="true">
                  {places.slice(0, PREVIEW_COUNT).map((place) => (
                    <SmartImage
                      key={place.id}
                      src={place.images[0]}
                      alt=""
                      width={330}
                      seed={place.id}
                      className="h-14 w-14 rounded-full ring-2 ring-ink-deep transition-transform duration-500 ease-out group-hover:translate-x-1"
                    />
                  ))}
                </span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-mist/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-saffron"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
