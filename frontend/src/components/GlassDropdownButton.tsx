import React, { useState, useRef, useEffect } from 'react'

export interface GlassDropdownButtonProps {
  label?: string
  options?: Array<{
    id: string
    label: string
    icon?: React.ReactNode
    onClick?: () => void
  }>
  onMainClick?: () => void
  className?: string
}

export const GlassDropdownButton: React.FC<GlassDropdownButtonProps> = ({
  label = 'Tambah',
  options = [
    {
      id: 'tambah-data',
      label: 'Tambah Data',
      icon: (
        <svg className="w-4 h-4 text-[#E1B5A3] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      id: 'import-excel',
      label: 'Import Excel',
      icon: (
        <svg className="w-4 h-4 text-[#E1B5A3] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 14.5 4.5M12 3v13.5" />
        </svg>
      ),
    },
  ],
  onMainClick,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* MAIN BUTTON (Strict 120px x 40px Specification - Crystal Clear Glass) */}
      <div
        style={{
          width: '120px',
          height: '40px',
          background: 'linear-gradient(155deg, rgba(255, 235, 230, 0.28) 0%, rgba(75, 48, 55, 0.48) 45%, rgba(32, 20, 24, 0.62) 100%)',
          backdropFilter: 'blur(16px) saturate(190%)',
          WebkitBackdropFilter: 'blur(16px) saturate(190%)',
          border: '1px solid #E1B5A3',
          borderRadius: '12px',
          boxShadow: '0px 4px 14px rgba(225, 181, 163, 0.18), inset 0px 1px 1.5px 0px rgba(255, 255, 255, 0.6), inset 0px -1px 2px 0px rgba(180, 110, 90, 0.2)',
        }}
        className="relative flex items-center justify-between px-2.5 overflow-hidden select-none transition-all duration-200 hover:brightness-115 active:scale-[0.98] group"
      >
        {/* Top Curved Specular Gloss Highlight (Clean Crystal Glare) */}
        <div className="absolute top-0 left-0 right-0 h-[48%] pointer-events-none bg-gradient-to-b from-white/35 via-white/10 to-transparent rounded-t-[11px]" />

        {/* Left Action Area (+ Label) */}
        <button
          type="button"
          onClick={() => {
            if (onMainClick) onMainClick()
            else setIsOpen((prev) => !prev)
          }}
          className="flex items-center gap-1.5 h-full flex-1 bg-transparent border-none outline-none cursor-pointer text-left z-10"
        >
          <svg className="w-4 h-4 text-[#E1B5A3] shrink-0 drop-shadow-2xs" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-[13px] font-semibold text-[#E1B5A3] tracking-wide leading-none truncate drop-shadow-2xs"
          >
            {label}
          </span>
        </button>

        {/* Vertical Separator Line */}
        <div className="w-[1px] h-4 bg-[#E1B5A3]/45 shrink-0 mx-1 z-10" />

        {/* Right Dropdown Toggle Arrow (∨) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center justify-center w-5 h-full bg-transparent border-none outline-none cursor-pointer text-[#E1B5A3] z-10 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-label="Toggle Dropdown"
        >
          <svg className="w-3.5 h-3.5 text-[#E1B5A3] drop-shadow-2xs" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* DROPDOWN MENU (Stacked Items: Each exact 120px x 40px) */}
      {isOpen && (
        <div
          className="absolute left-0 top-[48px] z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ width: '120px' }}
        >
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                if ('onClick' in opt && typeof opt.onClick === 'function') {
                  opt.onClick()
                }
                setIsOpen(false)
              }}
              style={{
                width: '120px',
                height: '40px',
                background: 'linear-gradient(155deg, rgba(255, 235, 230, 0.32) 0%, rgba(75, 48, 55, 0.52) 45%, rgba(32, 20, 24, 0.68) 100%)',
                backdropFilter: 'blur(16px) saturate(190%)',
                WebkitBackdropFilter: 'blur(16px) saturate(190%)',
                border: '1px solid #E1B5A3',
                borderRadius: '12px',
                boxShadow: '0px 4px 14px rgba(225, 181, 163, 0.18), inset 0px 1px 1.5px 0px rgba(255, 255, 255, 0.6), inset 0px -1px 2px 0px rgba(180, 110, 90, 0.2)',
              }}
              className="relative flex items-center justify-start gap-2 px-3 overflow-hidden select-none cursor-pointer transition-all duration-200 hover:brightness-120 active:scale-[0.98] z-10 group"
            >
              {/* Top Curved Specular Gloss Highlight */}
              <div className="absolute top-0 left-0 right-0 h-[48%] pointer-events-none bg-gradient-to-b from-white/35 via-white/10 to-transparent rounded-t-[11px]" />

              {/* Icon */}
              <div className="shrink-0 text-[#E1B5A3] z-10 drop-shadow-2xs">
                {opt.icon || (
                  <svg className="w-4 h-4 text-[#E1B5A3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                )}
              </div>

              {/* Label */}
              <span
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-[12px] font-semibold text-[#E1B5A3] tracking-wide leading-none truncate z-10 drop-shadow-2xs"
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default GlassDropdownButton
