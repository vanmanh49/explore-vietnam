import type { Category, CategoryId } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'nature',
    label: 'Nature',
    description: 'Karst bays, pine highlands, cave systems and national parks.',
  },
  {
    id: 'beach',
    label: 'Beach',
    description: 'White sand and warm water along 3,260 km of coast.',
  },
  {
    id: 'culture',
    label: 'Culture',
    description: 'Highland markets, water puppets, lantern nights and river life.',
  },
  {
    id: 'history',
    label: 'History',
    description: 'Imperial citadels, Cham towers and the places that shaped the country.',
  },
  {
    id: 'adventure',
    label: 'Adventure',
    description: 'Mountain loops by motorbike, summit treks and underground rivers.',
  },
  {
    id: 'food',
    label: 'Food',
    description: 'Street kitchens, floating markets and dishes tied to one town.',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    description: 'Merchant houses, royal tombs, French villas and bold new bridges.',
  },
  {
    id: 'city',
    label: 'City',
    description: 'Old quarters, rooftop views and streets that stay awake.',
  },
];

export const CATEGORY_BY_ID: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;
