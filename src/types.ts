/** [longitude, latitude] in degrees. */
export type LonLat = [number, number];

export type RegionId = 'north' | 'central' | 'south';

export type CategoryId =
  | 'nature'
  | 'beach'
  | 'culture'
  | 'history'
  | 'adventure'
  | 'food'
  | 'architecture'
  | 'city';

export interface LocalDish {
  name: string;
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  /** Name with Vietnamese diacritics. */
  localName: string;
  slug: string;
  region: RegionId;
  province: string;
  description: string;
  longDescription: string;
  history: string;
  culture: string;
  coordinates: LonLat;
  /** The first category is the primary one shown on cards. */
  categories: CategoryId[];
  images: string[];
  attractions: string[];
  activities: string[];
  foods: LocalDish[];
  bestTime: string;
  travelTips: string[];
}

export interface Region {
  id: RegionId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Where the camera looks when this region is in focus. */
  focus: LonLat;
  climate: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
}

export interface DestinationFilters {
  query: string;
  region: RegionId | 'all';
  category: CategoryId | 'all';
}

/** What the 3D camera is currently framing. */
export type MapFocus =
  | { kind: 'overview' }
  | { kind: 'region'; region: RegionId }
  | { kind: 'destination'; id: string };

export type StageMode = 'intro' | 'explore';

export type QualityTier = 'high' | 'low';
