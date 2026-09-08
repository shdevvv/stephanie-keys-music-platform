import { useState, useEffect } from 'react'
import { type Sheet, sheets as localSheets } from './sheetsData'
import { fetchSheetMusicCatalog } from './services/sheetMusicApi'
import type { ViewType } from './layout'

interface CoverProps {
  onNavigate?: (view: ViewType | string) => void;
  onSetBuyNowSheet?: (sheet: Sheet) => void;
  initialTab?: "videos" | "sheets" | "all";
}

interface Cover {
  title: string
  description: string
  categories: ('Jazz Standards' | 'Gospel' | 'Christmas' | 'English-Indonesian Christian Songs' | 'Disney')[]
  thumbnail: string
  videoUrl: string // Simulated iframe video embed
}


function CoversSheets({ onNavigate, onSetBuyNowSheet, initialTab = "all" }: CoverProps) {
  const [activeTab, setActiveTab] = useState<"videos" | "sheets" | "all">(initialTab)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [dbSheets, setDbSheets] = useState<Sheet[]>(localSheets)
  // State for modals
  const [activeVideo, setActiveVideo] = useState<Cover | null>(null)
  const [activePreview, setActivePreview] = useState<Sheet | null>(null)

  const [cartItems, setCartItems] = useState<string[]>([])
  const [purchasedSheets, setPurchasedSheets] = useState<string[]>([])

  useEffect(() => {
    fetchSheetMusicCatalog().then(catalog => {
      if (catalog && catalog.length > 0) {
        const mapped: Sheet[] = catalog.map(s => ({
          title: s.title,
          description: `Arrangement by ${s.arranger || s.composer}. Key of ${s.keySignature || 'C Major'}. Difficulty: ${s.difficulty}.`,
          price: `$${s.priceUSD ? s.priceUSD.toFixed(2) : '5.00'}`,
          genres: [(s.genre || 'Gospel') as any],
          image: s.thumbnailUrl || '/coversheets/sheet1.png',
          previews: ['/coversheets/sheet1.png', '/coversheets/sheet2.png']
        }));
        setDbSheets(mapped);
      }
    }).catch(err => console.error("Error loading DB sheet music catalog:", err));
  }, []);

  useEffect(() => {
    const updateStatus = () => {
      try {
        const cartSaved = localStorage.getItem('phanilie_cart')
        const cartArr = cartSaved ? JSON.parse(cartSaved) : []
        setCartItems(cartArr.map((item: any) => item.sheet.title))
      } catch (e) {
        setCartItems([])
      }

      try {
        const purchasedSaved = localStorage.getItem('purchased_sheets')
        const purchasedArr = purchasedSaved ? JSON.parse(purchasedSaved) : ['Mercy in the Keys']
        setPurchasedSheets(purchasedArr)
      } catch (e) {
        setPurchasedSheets(['Mercy in the Keys'])
      }
    }

    updateStatus()
    window.addEventListener('storage', updateStatus)
    return () => window.removeEventListener('storage', updateStatus)
  }, [])

  const handleAddToCart = (sheet: Sheet) => {
    const cartSaved = localStorage.getItem('phanilie_cart');
    const cartArr = cartSaved ? JSON.parse(cartSaved) : [];
    const normalizedCart = cartArr.map((item: any) => {
      const freshSheet = dbSheets.find(s => s.title === item.sheet.title);
      return { ...item, sheet: freshSheet || item.sheet };
    });
    const existingItem = normalizedCart.find((item: any) => item.sheet.title === sheet.title);
    if (!existingItem) {
      normalizedCart.push({ sheet, quantity: 1 });
      localStorage.setItem('phanilie_cart', JSON.stringify(normalizedCart));
    }
    window.dispatchEvent(new Event('storage'));
    setCartItems(prev => prev.includes(sheet.title) ? prev : [...prev, sheet.title]);
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: `"${sheet.title}" ditambahkan ke keranjang` } 
    }));
    window.dispatchEvent(new Event('open-slide-cart'));
  };

  const handleDirectBuy = (sheet: Sheet) => {
    if (onSetBuyNowSheet) {
      onSetBuyNowSheet(sheet);
    } else {
      const cartSaved = localStorage.getItem('phanilie_cart');
      const cartArr = cartSaved ? JSON.parse(cartSaved) : [];
      const normalizedCart = cartArr.map((item: any) => {
        const freshSheet = dbSheets.find(s => s.title === item.sheet.title);
        return { ...item, sheet: freshSheet || item.sheet };
      });
      const exists = normalizedCart.some((item: any) => item.sheet.title === sheet.title);
      if (!exists) {
        normalizedCart.push({ sheet, quantity: 1 });
        localStorage.setItem('phanilie_cart', JSON.stringify(normalizedCart));
      }
      if (onNavigate) onNavigate('checkout');
    }
  };

  // Multiselect Filters State for Covers
  const [selectedCoverCategories, setSelectedCoverCategories] = useState<string[]>(['All'])
  const [currentPage, setCurrentPage] = useState(1)



  // Multiselect Filters & Search State for Sheets
  const [selectedSheetGenres, setSelectedSheetGenres] = useState<string[]>(['All'])
  const [currentSheetPage, setCurrentSheetPage] = useState(1)
  const [sheetSearchQuery, setSheetSearchQuery] = useState<string>('')

  /*
  // Smooth looping background video cross-fade logic
  const sheetVideoARef = useRef<HTMLVideoElement | null>(null)
  const sheetVideoBRef = useRef<HTMLVideoElement | null>(null)
  const [sheetVideoActive, setSheetVideoActive] = useState<'A' | 'B'>('A')
  */

  /*
  const handleSheetVideoTimeUpdate = (key: 'A' | 'B') => {
    const activeEl = key === 'A' ? sheetVideoARef.current : sheetVideoBRef.current
    const inactiveEl = key === 'A' ? sheetVideoBRef.current : sheetVideoARef.current

    if (activeEl && inactiveEl && activeEl.duration) {
      const timeRemaining = activeEl.duration - activeEl.currentTime
      if (sheetVideoActive === key && timeRemaining < 2) {
        inactiveEl.currentTime = 0
        inactiveEl.play().catch(() => {})
        setSheetVideoActive(key === 'A' ? 'B' : 'A')

        setTimeout(() => {
          if (activeEl) {
            activeEl.pause()
            activeEl.currentTime = 0
          }
        }, 2000)
      }
    }
  }
  */

  // Covers Toggle Category
  const toggleCoverCategory = (cat: string) => {
    setCurrentPage(1)
    if (cat === 'All') {
      setSelectedCoverCategories(['All'])
    } else {
      let next = selectedCoverCategories.filter(c => c !== 'All')
      if (next.includes(cat)) {
        next = next.filter(c => c !== cat)
      } else {
        next.push(cat)
      }
      if (next.length === 0) {
        next = ['All']
      }
      setSelectedCoverCategories(next)
    }
  }

  // Sheets Toggle Genre
  const toggleSheetGenre = (genre: string) => {
    setCurrentSheetPage(1)
    if (genre === 'All') {
      setSelectedSheetGenres(['All'])
    } else {
      let next = selectedSheetGenres.filter(g => g !== 'All')
      if (next.includes(genre)) {
        next = next.filter(g => g !== genre)
      } else {
        next.push(genre)
      }
      if (next.length === 0) {
        next = ['All']
      }
      setSelectedSheetGenres(next)
    }
  }

  // Covers Mock Data (Tuned with multiple categories per song)
  const covers: Cover[] = [
    {
      title: "Fly Me to the Moon",
      description: "An elegant jazz swing arrangement featuring walking basslines, modern bebop extensions, and premium block chord voicings.",
      categories: ["Jazz Standards"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "Amazing Grace (Gospel Reharmonization)",
      description: "Lush gospel passing chords, 2-5-1 turnarounds, tritone substitutions, and warm neo-soul movements in F Major.",
      categories: ["Gospel", "Jazz Standards"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "O Holy Night",
      description: "A magical, flowing Christmas piano cover blending classical touch with smooth jazz voicings and sparkling arpeggios.",
      categories: ["Christmas", "Gospel"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "Bapa Sentuh Hatiku (Father Touch My Heart)",
      description: "A peaceful, reflective prayer-like Indonesian Christian piano arrangement with gentle reharmonizations.",
      categories: ["English-Indonesian Christian Songs", "Gospel"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "A Whole New World (Disney's Aladdin)",
      description: "Sparkling, dream-like Disney piano arrangement featuring running right-hand arpeggios, pentatonic fills, and lush 9th/11th chords.",
      categories: ["Disney"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "Over the Rainbow",
      description: "Lush jazz ballad cover with delicate voice-leading, chromatic alterations, and sophisticated extensions.",
      categories: ["Jazz Standards", "Disney"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "Total Praise (Richard Smallwood Cover)",
      description: "Majestic gospel chords, massive triadic structures, and dramatic dynamic builds in Eb Major.",
      categories: ["Gospel"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "Beauty and the Beast",
      description: "A warm and nostalgic rendition of the Disney classic, focusing on gentle flow and lyrical melody projection.",
      categories: ["Disney", "Jazz Standards"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "Can You Feel the Love Tonight",
      description: "A romantic Disney ballad arranged with rich warm extensions, elegant classical touch, and flowing arpeggios.",
      categories: ["Disney"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "Moon River",
      description: "An elegant, cinematic jazz standard arrangement in 3/4 waltz time with lush extensions and voice-leading.",
      categories: ["Jazz Standards"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "He Ain't Heavy, He's My Brother",
      description: "A moving, warm Indonesian-English Christian arrangement focusing on deep expression and soulful voicings.",
      categories: ["English-Indonesian Christian Songs", "Gospel"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "What a Wonderful World",
      description: "A peaceful, dream-like jazz standard cover featuring sparkling upper-structure triads and smooth voice leading.",
      categories: ["Jazz Standards"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    }
  ]

  // Sheets array is now imported from sheetsData.ts

  // Filtered Covers (Supporting select one or more)
  const filteredCovers = selectedCoverCategories.includes('All')
    ? covers
    : covers.filter(c => c.categories.some(cat => selectedCoverCategories.includes(cat)))

  // Pagination logic for Covers
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredCovers.length / itemsPerPage)
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)
  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCovers = filteredCovers.slice(startIndex, endIndex)

  // Filtered Sheets (Supporting select one or more)
  const filteredSheets = dbSheets.filter(sheet => {
    const matchesGenre = selectedSheetGenres.includes('All') ||
                         sheet.genres.some(g => selectedSheetGenres.includes(g))
    const matchesSearch = sheet.title.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ||
                          sheet.description.toLowerCase().includes(sheetSearchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  // Pagination logic for Sheets
  const sheetsPerPage = 10
  const totalSheetPages = Math.ceil(filteredSheets.length / sheetsPerPage)
  const validCurrentSheetPage = Math.min(Math.max(1, currentSheetPage), totalSheetPages || 1)
  const sheetStartIndex = (validCurrentSheetPage - 1) * sheetsPerPage
  const sheetEndIndex = sheetStartIndex + sheetsPerPage
  const paginatedSheets = filteredSheets.slice(sheetStartIndex, sheetEndIndex)

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null)
        setActivePreview(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Redirect link support from Dashboard favorites
  useEffect(() => {
    const targetTitle = localStorage.getItem('redirect_cover_title');
    if (targetTitle) {
      const match = covers.find(c => c.title === targetTitle);
      if (match) {
        setActiveVideo(match);
      }
      localStorage.removeItem('redirect_cover_title');
    }
  }, []);

  return (
    <main className={`bg-[#fffcf9] ${activeTab === "videos" ? "h-auto flex-grow-0" : "flex-grow flex flex-col"}`}>

      {/* SECTION 1: COVERS SHOWCASE */}
      {(activeTab === "all" || activeTab === "videos") && (
        <section className={`pt-10 pb-12 relative overflow-hidden flex flex-col ${activeTab === "all" ? "border-b border-[#e8cdc1]/20 flex-grow" : "h-auto flex-grow-0"}`}>
          {/* Background image layer - Studio Keyboard setup */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: "url('/video-studio-bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* High white overlay opacity */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-white/78 via-white/82 to-white/86"
          />
          {/* Ambient background decoration */}
          <div className="absolute top-12 left-1/4 w-72 h-72 bg-[#ffd89b]/10 rounded-full blur-[80px] pointer-events-none z-0"></div>
          <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-[#dfa38f]/8 rounded-full blur-[90px] pointer-events-none z-0"></div>

          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10 space-y-6">
            {/* Video Covers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
              {covers.slice(0, 10).map((cover, index) => (
                <div
                  key={index}
                  onClick={() => setActiveVideo(cover)}
                  className="group relative flex flex-col bg-white/35 hover:bg-white/50 border-2 border-[#e2b0a4] hover:border-[#c88879] rounded-[8px] shadow-[0_8px_24px_rgba(189,129,116,0.12)] hover:shadow-[0_12px_32px_rgba(189,129,116,0.22)] hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Thumbnail Layer */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#5c4337] rounded-t-[6px]">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                      src={cover.thumbnail}
                      alt={cover.title}
                    />
                    {/* Play Overlay with Rose Gold Circle & Outlined Triangle (No blur) */}
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-11 h-11 rounded-full bg-black/55 border-2 border-[#f0c3b7] shadow-[0_0_14px_rgba(226,176,164,0.7)] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-5 h-5 translate-x-[1.5px] transition-transform duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                          viewBox="0 0 24 24"
                          fill="#fceee9"
                          stroke="#bd8174"
                          strokeWidth="2.2"
                          strokeLinejoin="round"
                        >
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content details - Clean Calm Song Title */}
                  <div className="p-3 flex-grow flex flex-col justify-center">
                    <h3 className="font-sans text-xs font-medium text-[#73574b] group-hover:text-[#b56e60] transition-colors leading-snug line-clamp-2">
                      {cover.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* WATCH MORE Button -> YouTube Channel (No blur, no black hover outline) */}
            <div className="flex justify-center items-center pt-2">
              <a
                href="https://www.youtube.com/@stephaniekeyss"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-2.5 rounded-[6px] bg-white/40 hover:bg-white/60 border-2 border-[#dca698] hover:border-[#c88879] shadow-[0_4px_16px_rgba(220,166,152,0.2)] hover:shadow-[0_6px_22px_rgba(220,166,152,0.35)] text-[#73574b] hover:text-[#52352b] font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 active:scale-95 no-underline cursor-pointer outline-none focus:outline-none ring-0 focus:ring-0"
              >
                WATCH MORE
              </a>
            </div>

            {filteredCovers.length === 0 && (
              <div className="text-center py-16 bg-white/40 rounded-[6px] border border-dashed border-[#e8cdc1]/30">
                <span className="material-symbols-outlined text-4xl text-[#ab7e66]/40 select-none">video_library</span>
                <p className="font-sans text-sm text-[#7c6a60] mt-2 font-medium">No covers found matching these categories.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: SHEET MUSIC SHOP */}
      {(activeTab === "all" || activeTab === "sheets") && (
        <section 
          className="py-20 relative overflow-hidden flex-grow flex flex-col"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/sheetss.png')",
            backgroundSize: "150%",
            backgroundPosition: "center",
          }}
        >

        <div className="max-w-[1200px] mx-auto px-6 space-y-12 relative z-10">
          {/* Section Header */}
          <div className="pb-6 border-b border-[#dfa38f]/30 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display-lg text-2xl md:text-3xl text-[#3d251c] font-black tracking-tight">
                Sheet Music Shop
              </h2>
              <p className="font-sans text-xs text-[#8a6858] font-bold mt-2 tracking-widest uppercase">
                GET HIGH-QUALITY PDF TRANSCRIPTIONS AND LEARN TO PLAY THEM YOURSELF.
              </p>
            </div>
            
            {/* Compact Top Pagination Controls for Sheets */}
            {totalSheetPages > 1 && (
              <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-md px-2.5 py-1.5 rounded-[4px] border border-[#e8cdc1]/30 text-xs text-[#5c453c] font-bold shadow-sm ml-auto">
                <button
                  type="button"
                  disabled={validCurrentSheetPage === 1}
                  onClick={() => setCurrentSheetPage(prev => Math.max(prev - 1, 1))}
                  className="p-0.5 hover:bg-[#f6eae0] text-[#ab7e66] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border-none bg-transparent flex items-center justify-center rounded"
                  title="Previous Page"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <span className="select-none text-[#4a372e] font-sans">
                  Page {validCurrentSheetPage} of {totalSheetPages}
                </span>
                <button
                  type="button"
                  disabled={validCurrentSheetPage === totalSheetPages}
                  onClick={() => setCurrentSheetPage(prev => Math.min(prev + 1, totalSheetPages))}
                  className="p-0.5 hover:bg-[#f6eae0] text-[#ab7e66] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border-none bg-transparent flex items-center justify-center rounded"
                  title="Next Page"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* Unified 1-Row Control Bar (Search left, Filters right) */}
          <div className="flex flex-wrap items-center gap-4 bg-white/60 backdrop-blur-md p-3 rounded-[6px] border border-white/50">
            {/* Search Input inline (LEFT) */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-60">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#ab7e66] select-none">
                search
              </span>
              <input
                type="text"
                value={sheetSearchQuery}
                onChange={(e) => {
                  setSheetSearchQuery(e.target.value)
                  setCurrentSheetPage(1)
                }}
                placeholder="Search sheet music..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#e8cdc1]/40 rounded-[4px] text-xs text-[#4a372e] focus:outline-none focus:ring-2 focus:ring-[#856758]/30 placeholder-[#ab7e66]/50 shadow-xs"
              />
            </div>

            {/* Vertical Divider (Hidden on small screens) */}
            <div className="hidden lg:block w-px h-6 bg-[#dfa38f]/30 mx-2"></div>

            {/* Filter pills (RIGHT) */}
            <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
              <span className="text-xs font-extrabold text-[#4a372e] uppercase tracking-wider whitespace-nowrap">
                Filter by Genre:
              </span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Jazz', 'Gospel', 'Christmas', 'Disney'].map((genre) => {
                  const isSelected = selectedSheetGenres.includes(genre)
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleSheetGenre(genre)}
                      className={`px-5 py-2.5 rounded-[4px] text-xs font-bold transition-all duration-300 border cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#d29070] via-[#ab7e66] to-[#856758] border-none text-white shadow-md'
                          : 'bg-white/70 backdrop-blur-md border-[#e8cdc1]/30 text-[#6e5a51] hover:bg-white hover:border-[#ab7e66]'
                      }`}
                    >
                      {genre} {isSelected && genre !== 'All' && '✓'}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sheets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {paginatedSheets.map((sheet, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-xl border border-white rounded-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#fcf8f6] border-b border-[#e8cdc1]/20 rounded-t-[6px]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 select-none"
                    src={sheet.image}
                    alt={sheet.title}
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-0.5 max-w-[65%]">
                    {sheet.genres.map((g, i) => (
                      <span key={i} className="bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-[2px] text-[8px] font-extrabold text-[#856758] uppercase tracking-wider border border-[#e8cdc1]/25 select-none">
                        {g}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Content and Buy triggers */}
                <div className="p-3.5 flex-grow flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-sans text-xs font-bold text-[#4a372e] leading-snug group-hover:text-[#856758] transition-colors duration-250 truncate">
                      {sheet.title}
                    </h3>
                    <p className="font-sans text-[10px] text-[#7c6a60] leading-relaxed line-clamp-2">
                      {sheet.description}
                    </p>
                  </div>

                  <div className="flex gap-1 pt-3 border-t border-dashed border-[#e8cdc1]/40 mt-auto">
                    <button
                      onClick={() => setActivePreview(sheet)}
                      className="flex-1 py-2 px-1 bg-[#f3ecea] hover:bg-[#e8cdc1] text-[#6e5a51] font-bold text-[9px] rounded-[4px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-0.5 border-none active:scale-[0.97]"
                    >
                      Preview
                    </button>
                    {(() => {
                      const isOwned = purchasedSheets.includes(sheet.title);
                      const isInCart = cartItems.includes(sheet.title);
                      if (isOwned) {
                        return (
                          <button
                            disabled
                            className="flex-1 py-2 px-1 bg-[#e3dbd8] text-[#8b7a72] font-bold text-[9px] rounded-[4px] cursor-default flex items-center justify-center gap-0.5 border-none opacity-85"
                          >
                            <span className="material-symbols-outlined text-xs select-none font-bold">check</span>
                            Owned
                          </button>
                        );
                      }
                      return (
                        <>
                          {isInCart ? (
                            <button
                              onClick={() => window.dispatchEvent(new Event('open-slide-cart'))}
                              className="flex-1 py-2 px-1 bg-[#f5e2dc] hover:bg-[#eed5cb] text-[#c28472] font-bold text-[9px] rounded-[4px] cursor-pointer flex items-center justify-center gap-0.5 border-none transition-all"
                              title="View in cart"
                            >
                              <span className="material-symbols-outlined text-xs select-none font-bold">shopping_cart</span>
                              In Cart
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(sheet)}
                              className="flex-1 py-2 px-1 bg-[#fbf3ef] hover:bg-[#f3e4dc] border border-[#dfa38f]/40 text-[#856758] font-bold text-[9px] rounded-[4px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-0.5 active:scale-[0.97]"
                              title="Add to cart"
                            >
                              <span className="material-symbols-outlined text-xs select-none font-bold">add_shopping_cart</span>
                              Cart
                            </button>
                          )}
                          <button
                            onClick={() => handleDirectBuy(sheet)}
                            className="flex-1 py-2 px-1 bg-gradient-to-br from-[#d29070] via-[#ab7e66] to-[#856758] text-white hover:shadow-md font-bold text-[9px] rounded-[4px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-0.5 border-none active:scale-[0.97]"
                            title="Buy Now"
                          >
                            <span className="material-symbols-outlined text-xs select-none font-bold">bolt</span>
                            Buy
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSheets.length === 0 && (
            <div className="text-center py-20 bg-white/90 border border-dashed border-[#e8cdc1]/30 rounded-[6px] max-w-md mx-auto">
              <span className="material-symbols-outlined text-4xl text-[#ab7e66]/40 select-none">library_books</span>
              <p className="font-sans text-sm text-[#4a372e] mt-3 font-bold">No sheet music found</p>
              <p className="font-sans text-xs text-[#7c6a60] mt-1 max-w-xs mx-auto leading-relaxed">
                We couldn't find any sheet music matching "{sheetSearchQuery}". Try looking for another title or genre.
              </p>
            </div>
          )}
        </div>
      </section>
      )}

      {/* MODAL 1: SIMULATED VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-[100] bg-black/[0.04] backdrop-blur-[1px] flex items-center justify-center p-4 sm:p-6 animate-modal-backdrop"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-gradient-to-b from-[#fffcfb] via-[#fdf7f4] to-[#faede6] rounded-[8px] p-1.5 sm:p-2 shadow-[0_16px_40px_rgba(100,50,40,0.18),0_0_24px_rgba(220,166,152,0.4)] border-2 border-[#dca698] animate-modal-card flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Close Button on Corner (No extra white space at top) */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-[#faeee8] text-[#7a483b] border-2 border-[#dca698] shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90 hover:scale-105"
              title="Close"
            >
              <span className="material-symbols-outlined text-sm sm:text-base font-bold select-none">close</span>
            </button>

            {/* Video Frame - Symmetrical Padding All Around */}
            <div className="aspect-[16/9] bg-black w-full rounded-[6px] overflow-hidden shadow-xs border border-[#e2b0a4]/40 relative">
              <iframe
                title={activeVideo.title}
                className="w-full h-full border-none"
                src={activeVideo.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SHEET MUSIC PREVIEW OVERLAY */}
      {activePreview && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setActivePreview(null)}
        >
          <div 
            className="max-w-5xl w-full h-full max-h-[90vh] bg-white border border-[#e8cdc1]/30 shadow-2xl rounded-[6px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-[#e8cdc1]/20">
              <div>
                <h2 className="font-sans text-base font-bold text-[#4a372e]">{activePreview.title} - Arrangement Preview</h2>
                <p className="text-[#7c6a60] text-[11px] font-medium mt-0.5">Previewing first 2 pages of the arrangement</p>
              </div>
              <button 
                className="w-9 h-9 flex items-center justify-center rounded-[4px] bg-[#f3ecea] hover:bg-[#e8cdc1] transition-colors border-none cursor-pointer" 
                onClick={() => setActivePreview(null)}
              >
                <span className="material-symbols-outlined text-lg select-none">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow flex flex-col md:flex-row gap-6 p-6 overflow-hidden bg-[#fcf8f6]">
              {/* Preview Pages Scroll */}
              <div className="flex-grow bg-[#fff5f2]/80 border border-[#e8cdc1]/10 rounded-[6px] p-6 md:p-10 overflow-y-auto shadow-inner relative max-h-[50vh] md:max-h-full">
                <div className="max-w-2xl mx-auto space-y-8">
                  {activePreview.previews.map((src, index) => (
                    <img 
                      key={index}
                      className="w-full shadow-md border border-[#e8cdc1]/20 bg-white" 
                      alt={`Page ${index + 1} of ${activePreview.title}`}
                      src={src}
                    />
                  ))}
                </div>
                {/* Watermark overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                  <span className="font-display-lg text-6xl md:text-8xl text-primary -rotate-12">PREVIEW ONLY</span>
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="w-full md:w-64 shrink-0 flex flex-col justify-between gap-6 overflow-y-auto pr-1">
                <div className="bg-white p-5 rounded-[6px] border border-[#e8cdc1]/20 space-y-4">
                  <h4 className="font-sans text-xs font-bold text-[#4a372e] uppercase tracking-wider">Transcribed Package</h4>
                  <ul className="space-y-3 list-none p-0 m-0">
                    <li className="flex items-center gap-2.5 text-xs text-[#7c6a60] font-medium">
                      <span className="material-symbols-outlined text-[#856758] text-base select-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      PDF Transcribed Sheets
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-[#7c6a60] font-medium">
                      <span className="material-symbols-outlined text-[#856758] text-base select-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      MIDI Playback File
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-[#7c6a60] font-medium">
                      <span className="material-symbols-outlined text-[#856758] text-base select-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Lush Chord Chart
                    </li>
                  </ul>
                </div>
                             <div className="space-y-3">
                  {(() => {
                    const isOwned = purchasedSheets.includes(activePreview.title);
                    const isInCart = cartItems.includes(activePreview.title);
                    if (isOwned) {
                      return (
                        <button 
                          disabled
                          className="w-full bg-[#e3dbd8] text-[#8b7a72] py-3.5 rounded-[4px] font-bold text-sm border-none cursor-default opacity-85 text-center flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-base select-none">check</span>
                          Owned / In Library
                        </button>
                      );
                    }
                    return (
                      <div className="flex flex-col gap-2">
                        {isInCart ? (
                          <button 
                            onClick={() => {
                              setActivePreview(null);
                              window.dispatchEvent(new Event('open-slide-cart'));
                            }}
                            className="w-full bg-[#f5e2dc] hover:bg-[#eed5cb] text-[#c28472] py-3 rounded-[4px] font-bold text-xs border-none cursor-pointer text-center flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-base select-none">shopping_cart</span>
                            View In Cart
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              handleAddToCart(activePreview);
                              setActivePreview(null);
                            }}
                            className="w-full bg-white border border-[#dfa38f]/60 hover:bg-[#fbf3ef] text-[#856758] py-3 rounded-[4px] font-bold text-xs cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base select-none">add_shopping_cart</span>
                            Add to Cart
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            const sheetToBuy = activePreview;
                            setActivePreview(null);
                            handleDirectBuy(sheetToBuy);
                          }}
                          className="w-full bg-gradient-to-br from-[#d29070] via-[#ab7e66] to-[#856758] text-white py-3 rounded-[4px] font-bold text-xs shadow-md hover:shadow-lg transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.97]"
                        >
                          <span className="material-symbols-outlined text-base select-none">bolt</span>
                          Buy Now
                        </button>
                      </div>
                    );
                  })()}
                  <button 
                    onClick={() => setActivePreview(null)}
                    className="w-full py-3 rounded-[4px] border border-[#856758]/30 hover:bg-[#f3ecea] text-[#856758] font-bold text-xs transition-colors cursor-pointer bg-transparent"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default CoversSheets
