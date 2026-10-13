import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { filterDestinations } from '../lib/search';
import type { CategoryId, Destination, DestinationFilters, RegionId } from '../types';

interface FilterContextValue {
  filters: DestinationFilters;
  results: Destination[];
  setQuery: (query: string) => void;
  setRegion: (region: RegionId | 'all') => void;
  setCategory: (category: CategoryId | 'all') => void;
  clearFilters: () => void;
}

const EMPTY_FILTERS: DestinationFilters = { query: '', region: 'all', category: 'all' };

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DestinationFilters>(EMPTY_FILTERS);

  const setQuery = useCallback((query: string) => setFilters((f) => ({ ...f, query })), []);
  const setRegion = useCallback(
    (region: RegionId | 'all') => setFilters((f) => ({ ...f, region })),
    [],
  );
  const setCategory = useCallback(
    (category: CategoryId | 'all') => setFilters((f) => ({ ...f, category })),
    [],
  );
  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const results = useMemo(() => filterDestinations(DESTINATIONS, filters), [filters]);

  const value = useMemo(
    () => ({ filters, results, setQuery, setRegion, setCategory, clearFilters }),
    [filters, results, setQuery, setRegion, setCategory, clearFilters],
  );

  return <FilterContext value={value}>{children}</FilterContext>;
}

export function useFilters(): FilterContextValue {
  const context = use(FilterContext);
  if (!context) throw new Error('useFilters must be used inside FilterProvider');
  return context;
}
