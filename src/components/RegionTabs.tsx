import { REGIONS } from '../data/regions';
import type { RegionId } from '../types';

interface RegionTabsProps {
  value: RegionId | 'all';
  onChange: (region: RegionId | 'all') => void;
  label: string;
}

const OPTIONS: { id: RegionId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  ...REGIONS.map((region) => ({ id: region.id, label: region.shortName })),
];

/** Segmented control for choosing a region. */
export function RegionTabs({ value, onChange, label }: RegionTabsProps) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full bg-ink-deep/60 p-1">
      {OPTIONS.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`flex-1 rounded-full px-3 py-2 text-sm transition-colors duration-200 ${
              selected
                ? 'bg-mist font-medium text-ink-deep'
                : 'font-normal text-mist/75 hover:text-mist'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
