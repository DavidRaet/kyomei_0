import type { FilterKey } from '../types/types';
import { IconCheck } from './icons';
import { useEffect, useRef } from 'react';
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
  const rootRef = useRef<HTMLDivElement>(null);
  const hasSelection = selected !== null && selected.length > 0;
  const label = hasSelection ? `${filterKey}: ${selected.join(', ')}` : filterKey;

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onToggleOpen();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onToggleOpen();
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onToggleOpen]);

  return (
    <div className="filter-root" data-filter-root={filterKey} ref={rootRef}>
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
        <div className="filter-panel" role="listbox" aria-label={`${filterKey} filters`} aria-multiselectable="true">
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
