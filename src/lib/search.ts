import { CATEGORY_BY_ID } from '../data/categories';
import { REGION_BY_ID } from '../data/regions';
import type { Destination, DestinationFilters } from '../types';

/** Lowercases and strips Vietnamese diacritics so "ha noi" matches "Hà Nội". */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd');
}

interface SearchIndexEntry {
  /** Name, place and categories: matches here rank first. */
  primary: string;
  /** Everything else that is searchable. */
  secondary: string;
}

const indexCache = new WeakMap<Destination, SearchIndexEntry>();

function getIndexEntry(destination: Destination): SearchIndexEntry {
  let entry = indexCache.get(destination);
  if (!entry) {
    const region = REGION_BY_ID[destination.region];
    entry = {
      primary: normalizeText(
        [
          destination.name,
          destination.localName,
          destination.province,
          region.name,
          ...destination.categories.map((id) => CATEGORY_BY_ID[id].label),
        ].join(' '),
      ),
      secondary: normalizeText(
        [
          destination.description,
          destination.longDescription,
          destination.culture,
          ...destination.attractions,
          ...destination.activities,
          ...destination.foods.map((dish) => dish.name),
        ].join(' '),
      ),
    };
    indexCache.set(destination, entry);
  }
  return entry;
}

/** Returns a relevance score, or 0 when the destination does not match. */
function scoreQuery(destination: Destination, tokens: string[]): number {
  const entry = getIndexEntry(destination);
  let score = 0;
  for (const token of tokens) {
    if (entry.primary.includes(token)) score += 2;
    else if (entry.secondary.includes(token)) score += 1;
    else return 0;
  }
  return score;
}

export function filterDestinations(
  destinations: readonly Destination[],
  filters: DestinationFilters,
): Destination[] {
  const tokens = normalizeText(filters.query).split(/\s+/).filter(Boolean);

  const matches: { destination: Destination; score: number; order: number }[] = [];
  destinations.forEach((destination, order) => {
    if (filters.region !== 'all' && destination.region !== filters.region) return;
    if (filters.category !== 'all' && !destination.categories.includes(filters.category)) return;
    const score = tokens.length === 0 ? 1 : scoreQuery(destination, tokens);
    if (score > 0) matches.push({ destination, score, order });
  });

  return matches
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((match) => match.destination);
}

export function hasActiveFilters(filters: DestinationFilters): boolean {
  return filters.query.trim() !== '' || filters.region !== 'all' || filters.category !== 'all';
}
