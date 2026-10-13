import { Search, X } from 'lucide-react';
import { useRef } from 'react';
import { SEARCH_INPUT_ID } from '../config/constants';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SUGGESTIONS = ['beach', 'caves', 'lanterns', 'rice terraces', 'street food'];

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="glass flex items-center gap-3 rounded-full py-2 pr-2 pl-5 transition-colors duration-200 focus-within:border-saffron/70">
        <Search className="h-5 w-5 shrink-0 text-mist/60" aria-hidden="true" />
        <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
          Search destinations
        </label>
        <input
          ref={inputRef}
          id={SEARCH_INPUT_ID}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by place, food or activity"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 bg-transparent text-base font-normal text-mist placeholder:text-mist/50 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-mist/80 transition-colors duration-200 hover:bg-mist/10 hover:text-mist"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 pl-5 text-sm font-normal text-mist/60">
        <span>Try</span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onChange(suggestion)}
            className="rounded-full px-2 py-0.5 text-mist/85 underline decoration-mist/30 underline-offset-4 transition-colors duration-200 hover:text-saffron hover:decoration-saffron"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
