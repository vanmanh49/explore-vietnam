import type { Region, RegionId } from '../types';

export const REGIONS: Region[] = [
  {
    id: 'north',
    name: 'Northern Vietnam',
    shortName: 'North',
    tagline: 'Mist, limestone and a thousand-year-old capital',
    description:
      'The north is where Vietnam began. Terraced mountains run up to the Chinese border, limestone towers stand in the sea and in the rice fields, and Hanoi keeps its old trading streets at the centre of it all.',
    focus: [105.4, 21.3],
    climate: 'Four seasons. Cool, dry winters and hot, wet summers.',
  },
  {
    id: 'central',
    name: 'Central Vietnam',
    shortName: 'Central',
    tagline: 'Imperial cities, lantern towns and a long coast',
    description:
      'A narrow strip between the Trường Sơn mountains and the sea. The Nguyễn emperors ruled from Huế, merchants built Hội An, and the world’s largest caves lie under the jungle of Phong Nha.',
    focus: [107.5, 15.4],
    climate: 'Dry and sunny from February to August, with autumn storms.',
  },
  {
    id: 'south',
    name: 'Southern Vietnam',
    shortName: 'South',
    tagline: 'River life, island water and a city that never slows',
    description:
      'The south is warm all year. Ho Chi Minh City sets the pace, the Mekong spreads into a maze of canals and orchards, and the islands of Phú Quốc and Côn Đảo sit in clear water offshore.',
    focus: [105.9, 10.2],
    climate: 'Tropical. Dry from December to April, rainy from May to November.',
  },
];

export const REGION_BY_ID: Record<RegionId, Region> = Object.fromEntries(
  REGIONS.map((region) => [region.id, region]),
) as Record<RegionId, Region>;
