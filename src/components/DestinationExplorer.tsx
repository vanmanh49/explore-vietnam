import { SECTION_IDS } from '../config/constants';
import { useExplore } from '../context/ExploreContext';
import { useFilters } from '../context/FilterContext';
import { DESTINATIONS } from '../data/destinations';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import { hasActiveFilters } from '../lib/search';
import { DestinationGrid } from './DestinationGrid';
import { FilterPanel } from './FilterPanel';
import { SearchBar } from './SearchBar';

/** Search, filters and the full grid of destinations. */
export function DestinationExplorer() {
  const { filters, results, setQuery, setRegion, setCategory, clearFilters } = useFilters();
  const { openDestination } = useExplore();
  const device = useDeviceProfile();
  const filtered = hasActiveFilters(filters);

  return (
    <section
      id={SECTION_IDS.destinations}
      aria-labelledby="destinations-title"
      className="pointer-events-auto relative bg-ink px-5 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
          <div>
            <h2 id="destinations-title" className="display-title">
              Where to begin
            </h2>
            <p className="mt-5 max-w-md text-lg text-mist/80">
              Search by name, by what you want to eat, or by what you want to do. Open any card
              for the full guide.
            </p>
          </div>
          <SearchBar value={filters.query} onChange={setQuery} />
        </div>

        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <FilterPanel filters={filters} onRegionChange={setRegion} onCategoryChange={setCategory} />
          <p className="shrink-0 text-sm font-normal text-mist/70" aria-live="polite">
            {results.length === DESTINATIONS.length
              ? `All ${DESTINATIONS.length} places`
              : `${results.length} of ${DESTINATIONS.length} places`}
            {filtered && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-3 text-saffron underline decoration-saffron/40 underline-offset-4 hover:decoration-saffron"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>

        <div className="mt-10">
          <DestinationGrid
            destinations={results}
            tiltEnabled={!device.coarsePointer && !device.reducedMotion}
            onOpen={openDestination}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </section>
  );
}
