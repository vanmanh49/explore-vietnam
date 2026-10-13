import { CATEGORIES } from '../data/categories';
import { REGIONS } from '../data/regions';
import type { CategoryId, DestinationFilters, RegionId } from '../types';

interface FilterPanelProps {
  filters: DestinationFilters;
  onRegionChange: (region: RegionId | 'all') => void;
  onCategoryChange: (category: CategoryId | 'all') => void;
}

interface Option<T extends string> {
  id: T;
  label: string;
}

const REGION_OPTIONS: Option<RegionId | 'all'>[] = [
  { id: 'all', label: 'All regions' },
  ...REGIONS.map((region) => ({ id: region.id, label: region.shortName })),
];

const CATEGORY_OPTIONS: Option<CategoryId | 'all'>[] = [
  { id: 'all', label: 'Everything' },
  ...CATEGORIES.map((category) => ({ id: category.id, label: category.label })),
];

interface FilterGroupProps<T extends string> {
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

function FilterGroup<T extends string>({ legend, options, value, onChange }: FilterGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
      <legend className="float-left w-20 shrink-0 text-sm font-normal text-mist/60">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                selected
                  ? 'bg-mist font-medium text-ink-deep'
                  : 'glass-light font-normal text-mist/85 hover:bg-mist/20 hover:text-mist'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterPanel({ filters, onRegionChange, onCategoryChange }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <FilterGroup
        legend="Region"
        options={REGION_OPTIONS}
        value={filters.region}
        onChange={onRegionChange}
      />
      <FilterGroup
        legend="Interest"
        options={CATEGORY_OPTIONS}
        value={filters.category}
        onChange={onCategoryChange}
      />
    </div>
  );
}
