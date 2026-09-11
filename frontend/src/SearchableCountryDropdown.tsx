import { useState, useRef, useEffect } from 'react';
import { countries } from './countriesData';

interface SearchableCountryDropdownProps {
  value: string;
  onChange: (country: string) => void;
  label?: string;
  className?: string;
}

export default function SearchableCountryDropdown({
  value,
  onChange,
  label = "Country / Region",
  className = ""
}: SearchableCountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`space-y-1.5 relative text-left ${className}`}>
      {label && (
        <label className="block text-xs font-black uppercase tracking-wider text-[#3d1810] ml-1">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <div 
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery('');
        }}
        className="w-full bg-white border-2 border-[#e09882] hover:border-[#b8563d] rounded-xl px-4 py-3 text-xs text-[#2c0e07] font-bold cursor-pointer flex justify-between items-center transition-all select-none shadow-xs hover:shadow-md"
      >
        <span>{value || 'Select country...'}</span>
        <span className="material-symbols-outlined text-[#8c351f] text-base select-none transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          expand_more
        </span>
      </div>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-md border-2 border-[#e09882] shadow-[0_12px_30px_rgba(184,86,61,0.2)] rounded-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-1.5 duration-200">
          {/* Search Input Box */}
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#fff7f4] border border-[#e09882] rounded-lg pl-9 pr-3 py-2 text-xs text-[#2c0e07] font-bold placeholder-[#9c6a58] focus:outline-none focus:ring-2 focus:ring-[#b8563d]"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#8c351f] text-sm select-none">
              search
            </span>
          </div>

          {/* List Options */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country === value;
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      onChange(country);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs rounded-lg transition-all cursor-pointer border-none flex items-center justify-between font-bold ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#fceee8] to-[#f8ded6] text-[#8c351f] font-black border border-[#e8a996]' 
                        : 'bg-transparent text-[#3d1810] hover:bg-[#fceee8]/60 hover:text-[#8c351f]'
                    }`}
                  >
                    <span>{country}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-sm font-black text-[#8c351f] select-none">
                        check
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <span className="text-xs font-bold text-[#8c351f]/70 p-3 italic text-center block">
                No countries found
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
