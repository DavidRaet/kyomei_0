import type { FilterKey } from '../types/types';
import { IconCheck } from './icons';
interface FilterDropdownProps {
  filterKey: FilterKey;
  options: readonly string[];
  selected: readonly string[] | null;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectOption: (option: string) => void;
}

export function FilterDropdown({
  filterKey,
  options,
  selected,
  isOpen,
  onToggleOpen,
  onSelectOption,
}: FilterDropdownProps) {
  const hasSelection = selected !== null && selected.length > 0;
  const label = hasSelection ? `${filterKey}: ${selected.join(', ')}` : filterKey;

  return (
    <div className="filter-root" data-filter-root={filterKey}>
      <button
        type="button"
        className={`chip ${hasSelection ? 'active' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={onToggleOpen}
      >
        <span className="filter-label-text">{label}</span>
        <span className={`caret ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="filter-panel" role="listbox">
          {options.map((option) => {
            const isSelected = selected?.includes(option) ?? false;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`filter-option ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectOption(option)}
              >
                <span className={`filter-option-check ${isSelected ? 'on' : ''}`}>
                  {isSelected && <IconCheck />}
                </span>
                <span className="filter-option-label">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
