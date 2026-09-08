import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { fetchSearchResults } from '../services/searchApi';
import type { SearchResponse, SearchResultItem } from '../services/searchApi';
import { SearchDropdownOverlay } from './SearchDropdownOverlay';

interface GlobalSearchInputProps {
  onNavigate?: (view: any) => void;
}

export const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  // Trigger search API when debounced term updates
  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim();
    if (trimmed.length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetchSearchResults(trimmed)
      .then((data) => {
        if (isMounted) {
          setResults(data);
          setIsLoading(false);
          setSelectedIndex(-1);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute total result items for keyboard navigation
  const allItems: SearchResultItem[] = results
    ? [...results.lessons, ...results.covers, ...results.sheetMusic]
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key === 'ArrowDown') {
      setIsOpen(true);
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsMobileModalOpen(false);
      return;
    }

    if (allItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allItems.length) {
        handleSelectItem(allItems[selectedIndex]);
      } else if (searchTerm.trim().length >= 2) {
        addRecentSearch(searchTerm.trim());
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    addRecentSearch(item.title);
    setIsOpen(false);
    setIsMobileModalOpen(false);

    if (onNavigate) {
      if (item.category === 'Lesson') {
        onNavigate('courses');
      } else if (item.category === 'Performance Cover' || item.category === 'Sheet Music') {
        onNavigate('covers-sheets');
      }
    } else {
      window.location.href = item.routeUrl;
    }
  };

  const handleSelectRecentSearch = (term: string) => {
    setSearchTerm(term);
    setIsOpen(true);
  };

  const handleSelectCategorySuggestion = (category: string) => {
    setSearchTerm(category);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px]">
      {/* Desktop Search Bar */}
      <div className="hidden md:flex items-center relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search lessons, sheets, and more..."
          className="w-full bg-[#fffcfb]/90 border-[1.5px] border-[#dfa38f] hover:border-[#b76e79] focus:border-[#b76e79] rounded-lg py-2.5 pl-9.5 pr-8.5 text-xs text-[#5c3a2e] placeholder-[#a17a6e]/70 focus:outline-none transition-colors duration-200 shadow-none"
        />
        {/* Luxury Ornate Carved Metallic Rose-Gold Magnifying Glass Icon */}
        <svg className="absolute left-3 w-4 h-4 shrink-0 pointer-events-none drop-shadow-2xs" viewBox="0 0 24 24" fill="none">
          <path 
            d="M10.5 3a7.5 7.5 0 104.83 13.25l4.71 4.71a1 1 0 001.42-1.42l-4.71-4.71A7.5 7.5 0 0010.5 3zm0 2a5.5 5.5 0 110 11 5.5 5.5 0 010-11z" 
            fill="url(#magnifier-logo-gold)" 
          />
          <path 
            d="M10.5 5.5a5 5 0 100 10 5 5 0 000-10z" 
            fill="none" 
            stroke="url(#magnifier-logo-gold)" 
            strokeWidth="0.6" 
          />
          {/* Carved Filigree Highlight Ring */}
          <circle cx="10.5" cy="10.5" r="3.2" fill="none" stroke="url(#magnifier-highlight)" strokeWidth="0.5" strokeDasharray="1 1" />
          <defs>
            <linearGradient id="magnifier-logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8e8df" />
              <stop offset="35%" stopColor="#eac4b1" />
              <stop offset="70%" stopColor="#dfa38f" />
              <stop offset="100%" stopColor="#996252" />
            </linearGradient>
            <linearGradient id="magnifier-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#eac4b1" />
            </linearGradient>
          </defs>
        </svg>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setResults(null);
              setIsOpen(false);
            }}
            className="absolute right-3 text-xs text-[#805c51] hover:text-[#5c3a2e] cursor-pointer bg-transparent border-none p-0 flex items-center"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Desktop Dropdown */}
      {isOpen && (
        <div className="hidden md:block">
          <SearchDropdownOverlay
            query={searchTerm}
            isLoading={isLoading}
            results={results}
            selectedIndex={selectedIndex}
            recentSearches={recentSearches}
            onSelectRecentSearch={handleSelectRecentSearch}
            onClearRecentSearches={clearRecentSearches}
            onSelectItem={handleSelectItem}
            onSelectCategorySuggestion={handleSelectCategorySuggestion}
          />
        </div>
      )}

      {/* Mobile Search Button Trigger */}
      <div className="flex md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileModalOpen(true)}
          className="w-9 h-9 rounded-lg bg-white/80 border border-[#dfa38f] flex items-center justify-center text-[#805c51] hover:bg-[#f9f2f0] transition-all cursor-pointer shadow-none"
          aria-label="Open Search"
        >
          <span className="material-symbols-outlined text-lg">search</span>
        </button>
      </div>

      {/* Mobile Full-Screen Search Overlay Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#ffe5db] to-[#cbb2a6] p-4 flex flex-col space-y-4 md:hidden animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Search lessons, sheets, and more..."
                className="w-full bg-white border border-[#dfa38f] focus:border-[#b76e79] rounded-lg py-2.5 pl-10 pr-9 text-[11px] text-[#5c3a2e] focus:outline-none shadow-none"
              />
              <span className="material-symbols-outlined absolute left-3 text-sm text-[#ab7e66]">
                search
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 text-xs text-[#ab7e66]"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsMobileModalOpen(false)}
              className="px-3 py-2 text-xs font-bold text-[#6a564d] hover:text-[#4a372e] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex-grow overflow-y-auto relative">
            <SearchDropdownOverlay
              query={searchTerm}
              isLoading={isLoading}
              results={results}
              selectedIndex={selectedIndex}
              recentSearches={recentSearches}
              onSelectRecentSearch={handleSelectRecentSearch}
              onClearRecentSearches={clearRecentSearches}
              onSelectItem={handleSelectItem}
              onSelectCategorySuggestion={handleSelectCategorySuggestion}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default GlobalSearchInput;
