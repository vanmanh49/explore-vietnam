import type { QualityTier, RegionId } from '../types';

export const SITE = {
  name: 'Vietnam',
  title: 'VIETNAM',
  subtitle: 'Discover the beauty, culture and stories of Vietnam.',
  tagline: 'One journey, thousands of stories.',
  footerTagline:
    'From mountains to the sea, discover the stories that make Vietnam unforgettable.',
} as const;

export const SECTION_IDS = {
  home: 'home',
  regions: 'regions',
  destinations: 'destinations',
  experiences: 'experiences',
  about: 'about',
} as const;

export const SEARCH_INPUT_ID = 'destination-search';

export type NavAction = 'home' | 'explore' | 'section';

export interface NavLink {
  label: string;
  action: NavAction;
  sectionId?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', action: 'home' },
  { label: 'Explore', action: 'explore' },
  { label: 'Destinations', action: 'section', sectionId: SECTION_IDS.destinations },
  { label: 'Regions', action: 'section', sectionId: SECTION_IDS.regions },
  { label: 'Experiences', action: 'section', sectionId: SECTION_IDS.experiences },
  { label: 'About Vietnam', action: 'section', sectionId: SECTION_IDS.about },
];

export const FOOTER_POPULAR_SLUGS = ['ha-long-bay', 'hoi-an', 'sapa', 'hue', 'phu-quoc'];

export const ABOUT_FACTS: { value: string; label: string }[] = [
  { value: '3,260 km', label: 'of coastline, from the Gulf of Tonkin to the Gulf of Thailand' },
  { value: '54', label: 'ethnic groups, each with its own language and traditions' },
  { value: '9', label: 'UNESCO World Heritage sites' },
  { value: '100 million', label: 'people, and a median age just over thirty' },
];

/** Sky, fog and light colours for each leg of the journey. */
export interface Atmosphere {
  skyTop: string;
  skyGlow: string;
  haze: string;
  sun: string;
}

export const ATMOSPHERES: Record<RegionId, Atmosphere> = {
  north: { skyTop: '#0d2b3e', skyGlow: '#f2b38c', haze: '#86a0aa', sun: '#ffd9a8' },
  central: { skyTop: '#2b2f57', skyGlow: '#f7a866', haze: '#a58e8c', sun: '#ffc27a' },
  south: { skyTop: '#0b3b45', skyGlow: '#f5d08a', haze: '#7fae9e', sun: '#ffe1a0' },
};

export interface QualitySettings {
  /** Terrain grid cells per degree. */
  terrainDensity: number;
  particleCount: number;
  cloudCount: number;
  /** Lowest and highest pixel ratio. The scene moves between them to hold its frame rate. */
  dpr: [number, number];
  antialias: boolean;
}

export const QUALITY: Record<QualityTier, QualitySettings> = {
  high: { terrainDensity: 15, particleCount: 420, cloudCount: 14, dpr: [0.9, 1.75], antialias: true },
  low: { terrainDensity: 9, particleCount: 120, cloudCount: 6, dpr: [0.7, 1.25], antialias: false },
};

export const SCENE = {
  fov: 38,
  /** Direction towards the sun (east-north-east, low on the horizon). */
  sunDirection: [0.55, 0.26, -0.8] as [number, number, number],
  waterDeep: '#0f4f5e',
  waterShallow: '#58b9ab',
  markerColor: '#f4b04a',
  markerActiveColor: '#fff3d6',
  zoom: { min: 2.5, max: 34 },
} as const;

/** Frame rate the scene is held to once a device has shown it cannot keep up. */
export const LITE_FRAME_RATE = 30;

/** How far a card tilts under the pointer, in degrees. */
export const CARD_TILT_DEGREES = 5;

/** Longest the loading screen may stay up, in milliseconds. */
export const LOADING_TIMEOUT_MS = 6000;
