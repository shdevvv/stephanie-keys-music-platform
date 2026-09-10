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


const cleanTitle = (title: string) => title.replace(/\s*\([^)]*\)/g, '').trim();

const TrebleClefCartIcon = ({ className = "w-3 h-3.5 text-current" }: { className?: string }) => (
  <svg className={`${className} fill-current shrink-0`} viewBox="0 0 100 140">
    <path d="M 54.7 115.5 C 50.5 119.3 45.3 121.2 39.7 120.7 C 33.2 120.1 27.7 116.5 24.9 110.6 C 22.2 104.9 22.8 98.3 26.4 93 C 30.5 87 37.3 83.2 44.6 82.8 L 44.6 45.8 C 41.5 47 38.6 48.9 36.1 51.3 C 30.2 57.1 27.1 64.8 27.5 73 C 27.9 81.5 32.2 89 39.3 93.4 C 41.4 94.7 42 97.5 40.7 99.6 C 39.4 101.7 36.6 102.3 34.5 101 C 25.2 95.2 19.5 85.3 19 74.2 C 18.5 63.5 22.5 53.5 30.2 45.9 C 34.2 41.9 39 39 44.3 37.4 L 44.3 25 C 44.3 20.4 46.3 16.1 49.7 13.2 C 53.5 10 58.4 8.5 63.4 9.1 C 68.4 9.7 72.8 12.5 75.5 16.7 C 78.2 20.9 78.9 26.1 77.4 30.9 C 76.1 35.1 73.2 38.6 69.3 40.6 C 67.1 41.7 64.5 41 63.4 38.8 C 62.3 36.6 63 34 65.2 32.9 C 67.7 31.6 69.6 29.4 70.4 26.7 C 71.3 23.6 70.9 20.2 69.2 17.5 C 67.5 14.8 64.6 13 61.4 12.6 C 58.1 12.2 54.9 13.2 52.4 15.3 C 50.3 17.1 49 19.8 49 22.7 L 49 36.2 C 53.7 37.3 58.1 39.6 61.8 42.9 C 67.7 48.2 71 55.5 71 63.3 C 71 71.4 67.4 78.9 61.1 83.9 C 55.3 88.5 48 90.7 40.7 90 C 42.7 87.4 46.1 85.6 49.8 84.8 L 49.8 110.7 C 53.7 110.5 57.4 108.9 60.1 106.2 C 63.8 102.6 65.9 97.6 65.9 92.4 C 65.9 88 63.6 83.8 59.7 81 C 57.5 79.4 57 76.6 58.6 74.4 C 60.2 72.2 63 71.7 65.2 73.3 C 70.7 77.3 73.9 83.5 73.9 90.1 C 73.9 99 69.9 107.5 63 113.5 C 60.6 115.6 57.7 116.5 54.7 115.5 Z M 39.7 112.5 C 43.5 112.5 46.5 109.5 46.5 105.7 C 46.5 101.9 43.5 98.9 39.7 98.9 C 35.9 98.9 32.9 101.9 32.9 105.7 C 32.9 109.5 35.9 112.5 39.7 112.5 Z" />
  </svg>
);

const OrnateDownloadIcon = ({ className = "w-3.5 h-3.5 text-current" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none">
    <path 
      d="M12 2.5V13.5M12 13.5L8.5 10M12 13.5L15.5 10" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M4 16.5C4 18.5 7.58 20 12 20C16.42 20 20 18.5 20 16.5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    <circle cx="12" cy="13.5" r="0.8" fill="currentColor" />
  </svg>
);

function CoversSheets({ onNavigate, onSetBuyNowSheet, initialTab = "all" }: CoverProps) {
  const [activeTab, setActiveTab] = useState<"videos" | "sheets" | "all">(initialTab)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [dbSheets, setDbSheets] = useState<Sheet[]>(localSheets)
  // State for modals with smooth 2-phase entry & exit transitions
  const [activeVideo, setActiveVideoState] = useState<Cover | null>(null);
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const [activePreview, setActivePreviewState] = useState<Sheet | null>(null);
  const [isPreviewMounted, setIsPreviewMounted] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const setActivePreview = (sheet: Sheet | null) => {
    if (sheet) {
      setActivePreviewState(sheet);
      setIsPreviewMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsPreviewVisible(true);
        });
      });
    } else {
      setIsPreviewVisible(false);
      setTimeout(() => {
        setIsPreviewMounted(false);
        setActivePreviewState(null);
      }, 300);
    }
  };

  const setActiveVideo = (cover: Cover | null) => {
    if (cover) {
      setActiveVideoState(cover);
      setIsVideoMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVideoVisible(true);
        });
      });
    } else {
      setIsVideoVisible(false);
      setTimeout(() => {
        setIsVideoMounted(false);
        setActiveVideoState(null);
      }, 300);
    }
  };

  const [cartItems, setCartItems] = useState<string[]>([])
  const [purchasedSheets, setPurchasedSheets] = useState<string[]>([])

  useEffect(() => {
    fetchSheetMusicCatalog().then(catalog => {
      if (catalog && catalog.length > 0) {
        const mapped: Sheet[] = catalog.map(s => ({
          title: s.title,
          description: '',
          price: `$${s.priceUSD ? s.priceUSD.toFixed(2) : '5.00'}`,
          genres: [(s.genre || 'Gospel') as any],
          image: s.thumbnailUrl || '/over-the-rainbow-cover.png',
          previews: [
            '/over-the-rainbow-page1.png',
            '/over-the-rainbow-page2.png',
            '/over-the-rainbow-page3.png',
            '/over-the-rainbow-page4.png',
            '/over-the-rainbow-page5.png',
            '/over-the-rainbow-page6.png'
          ],
          keySignature: s.keySignature,
          difficulty: s.difficulty,
          pageCount: s.pageCount,
          arranger: s.arranger || s.composer
        }));
        // Ensure at least 5 items for display
        if (mapped.length < 5) {
          const existingTitles = new Set(mapped.map(m => m.title));
          const extra = localSheets.filter(ls => !existingTitles.has(ls.title)).slice(0, 5 - mapped.length);
          setDbSheets([...mapped, ...extra]);
        } else {
          setDbSheets(mapped);
        }
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
        const purchasedArr = purchasedSaved ? JSON.parse(purchasedSaved) : []
        setPurchasedSheets(purchasedArr)
      } catch (e) {
        setPurchasedSheets([])
      }
    }

    updateStatus()
    window.addEventListener('storage', updateStatus)
    return () => window.removeEventListener('storage', updateStatus)
  }, [])

  const handleToggleCart = (sheet: Sheet) => {
    const cartSaved = localStorage.getItem('phanilie_cart');
    const cartArr = cartSaved ? JSON.parse(cartSaved) : [];
    const normalizedCart = cartArr.map((item: any) => {
      const freshSheet = dbSheets.find(s => s.title === item.sheet.title);
      return { ...item, sheet: freshSheet || item.sheet };
    });
    const existingIndex = normalizedCart.findIndex((item: any) => item.sheet.title === sheet.title);

    if (existingIndex >= 0) {
      // Remove from cart
      normalizedCart.splice(existingIndex, 1);
      localStorage.setItem('phanilie_cart', JSON.stringify(normalizedCart));
      window.dispatchEvent(new Event('storage'));
      setCartItems(prev => prev.filter(t => t !== sheet.title));
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: `"${cleanTitle(sheet.title)}" dihapus dari keranjang` }
      }));
    } else {
      // Add to cart
      normalizedCart.push({ sheet, quantity: 1 });
      localStorage.setItem('phanilie_cart', JSON.stringify(normalizedCart));
      window.dispatchEvent(new Event('storage'));
      setCartItems(prev => prev.includes(sheet.title) ? prev : [...prev, sheet.title]);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: `"${cleanTitle(sheet.title)}" ditambahkan ke keranjang` }
      }));
    }
  };
  const handleAddToCart = handleToggleCart;
  void cartItems;
  void handleAddToCart;

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

  const handleDownloadSheet = (sheetTitle: string) => {
    const link = document.createElement('a');
    link.href = '/Over the Rainbow.pdf';
    link.download = `${cleanTitle(sheetTitle)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message: `Mengunduh "${cleanTitle(sheetTitle)}.pdf"...` }
    }));
  };

  // Multiselect Filters State for Covers
  const [selectedCoverCategories] = useState<string[]>(['All'])
  // const [currentPage] = useState(1)



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

  /*
  // Covers Toggle Category
  const _toggleCoverCategory = (cat: string) => {
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
  */

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
    },
    {
      title: "How Great Is Our God (Indonesian-English)",
      description: "A triumphant, rich worship piano cover blending grand gospel chords with delicate melodic embellishments.",
      categories: ["English-Indonesian Christian Songs", "Gospel"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "When You Wish Upon a Star",
      description: "An enchanting Disney classic arranged with delicate jazz extensions, lush counter-point, and sparkling runs.",
      categories: ["Disney", "Jazz Standards"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    },
    {
      title: "Silent Night (Lush Gospel Jazz Ballad)",
      description: "A serene Christmas ballad featuring sophisticated gospel reharmonization, tritone passes, and warm voicings.",
      categories: ["Christmas", "Gospel", "Jazz Standards"],
      thumbnail: "/stephanie-piano-cover-thumb.jpg",
      videoUrl: "https://www.youtube.com/embed/opeWi7v1Lqc"
    }
  ]

  // Sheets array is now imported from sheetsData.ts

  // Filtered Covers (Supporting select one or more)
  const filteredCovers = selectedCoverCategories.includes('All')
    ? covers
    : covers.filter(c => c.categories.some(cat => selectedCoverCategories.includes(cat)))

  /*
  // Pagination logic for Covers
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredCovers.length / itemsPerPage)
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)
  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  // const _paginatedCovers = filteredCovers.slice(startIndex, endIndex)
  */

  // Filtered Sheets (Supporting select one or more)
  const filteredSheets = dbSheets.filter(sheet => {
    const matchesGenre = selectedSheetGenres.includes('All') ||
      sheet.genres.some(g => selectedSheetGenres.includes(g))
    const matchesSearch = sheet.title.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ||
      sheet.description.toLowerCase().includes(sheetSearchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  // Pagination logic for Sheets
  const sheetsPerPage = 5
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
    <main className="bg-[#fffcf9] flex flex-col h-auto">

      {/* SECTION 1: COVERS SHOWCASE */}
      {(activeTab === "all" || activeTab === "videos") && (
        <section className="pt-10 pb-6 relative overflow-hidden flex flex-col h-auto">
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
              {covers.slice(0, 15).map((cover, index) => (
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
                    <h3 
                      style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                      className="text-[12.5px] font-bold text-[#4a2c20] group-hover:text-[#9e5241] transition-colors leading-snug line-clamp-2 tracking-tight"
                    >
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
        <section className="py-20 relative overflow-hidden flex-grow flex flex-col">
          {/* Zoomed Background Image Layer (Cropping plants/leaves on left & right) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            <img
              src="/stephanie-music-shop.png"
              alt="Sheet Music Shop Background"
              className="w-full h-full object-cover object-center scale-135 sm:scale-140 md:scale-145 lg:scale-150 transition-transform duration-500"
            />
            {/* White overlay 0.45 */}
            <div className="absolute inset-0 bg-white/45" />
          </div>

          <div className="max-w-[1200px] mx-auto px-6 space-y-12 relative z-10">
            {/* LUXURY 1-LINE HORIZONTAL BAR IN GLOSSY ROSE GOLD */}
            <div 
              style={{
                background: "linear-gradient(135deg, #FAF0EB 0%, #F5DACE 30%, #E8BCAC 60%, #D49C8B 85%, #C28675 100%)",
                boxShadow: "inset 0 1.5px 2px #FFFFFF, inset 0 -2px 4px #996252, 0 8px 30px rgba(181, 114, 98, 0.22)",
                border: "2px solid #EAC4B1",
              }}
              className="relative rounded-2xl p-3.5 md:p-4 overflow-hidden"
            >
              {/* Single Horizontal Flex Row */}
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 lg:gap-6 relative z-10">
                {/* 1. Refined, Elegant & Compact Title (Sharp Vector Text) */}
                <h2 
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                  className="font-display-lg text-lg md:text-xl lg:text-[22px] text-[#5e2b1e] font-extrabold tracking-tight whitespace-nowrap shrink-0 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
                >
                  Sheet Music Shop
                </h2>

                {/* 2. Light Soft Translucent Search Bar (Rose Gold Border From Start) */}
                <div className="relative flex-grow min-w-[200px] max-w-sm lg:max-w-md">
                  <input
                    type="text"
                    value={sheetSearchQuery}
                    onChange={(e) => {
                      setSheetSearchQuery(e.target.value)
                      setCurrentSheetPage(1)
                    }}
                    placeholder="Search sheet music..."
                    className="w-full pl-9.5 pr-3.5 py-2 md:py-2.5 bg-white/85 hover:bg-white focus:bg-white border-2 border-[#dfa38f] hover:border-[#c58270] focus:border-[#c58270] focus:ring-2 focus:ring-[#e8b4a2]/40 rounded-xl text-xs font-semibold text-[#52352b] placeholder-[#8c675a] transition-all duration-300 outline-none shadow-xs"
                  />
                    {/* Ornate Metallic Rose-Gold Magnifying Glass Icon (Matching Navbar Precision Exactly) */}
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0 pointer-events-none" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M10.5 3a7.5 7.5 0 104.83 13.25l4.71 4.71a1 1 0 001.42-1.42l-4.71-4.71A7.5 7.5 0 0010.5 3zm0 2a5.5 5.5 0 110 11 5.5 5.5 0 010-11z"
                        fill="url(#sheet-magnifier-gold)"
                      />
                      <path
                        d="M10.5 5.5a5 5 0 100 10 5 5 0 000-10z"
                        fill="none"
                        stroke="url(#sheet-magnifier-gold)"
                        strokeWidth="0.6"
                      />
                      <circle cx="10.5" cy="10.5" r="3.2" fill="none" stroke="url(#sheet-magnifier-highlight)" strokeWidth="0.5" strokeDasharray="1 1" />
                      <defs>
                        <linearGradient id="sheet-magnifier-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f8e8df" />
                          <stop offset="35%" stopColor="#eac4b1" />
                          <stop offset="70%" stopColor="#dfa38f" />
                          <stop offset="100%" stopColor="#996252" />
                        </linearGradient>
                        <linearGradient id="sheet-magnifier-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#eac4b1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* 3. Filter by Genre (Light Soft Translucent Buttons, Zero Blur) */}
                  <div className="flex items-center gap-2.5 flex-wrap shrink-0 ml-auto">
                    <span className="text-[11px] md:text-xs font-black text-[#5e2b1e] uppercase tracking-wider whitespace-nowrap">
                      FILTER BY GENRE:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {['All', 'Jazz', 'Gospel', 'Christmas'].map((genre) => {
                        const isSelected = selectedSheetGenres.includes(genre)
                        return (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => toggleSheetGenre(genre)}
                            style={{
                              outline: 'none',
                              WebkitTapHighlightColor: 'transparent',
                              ...(isSelected ? {
                                background: "linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 50%, #FCE8DF 100%)",
                                boxShadow: "0 2px 8px rgba(181, 116, 98, 0.3), inset 0 1px 1px #FFFFFF",
                                border: "1.5px solid #d48f7d"
                              } : {
                                background: "rgba(255, 255, 255, 0.65)",
                                border: "1px solid #e5c3b6"
                              })
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-250 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none ${isSelected
                              ? 'text-[#5e2b1e] font-extrabold shadow-sm'
                              : 'text-[#6b463b] hover:bg-white/95 hover:text-[#5e2b1e] hover:border-[#c58270]'
                              }`}
                          >
                            {genre} {isSelected && genre !== 'All' && <span className="text-[#c55338] font-black ml-0.5">✓</span>}
                          </button>
                        )
                      })}
                    </div>

                    {/* 4. Compact Pagination Controls */}
                    {totalSheetPages > 1 && (
                      <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#e5b3a3] text-xs text-[#5c453c] font-bold shrink-0 ml-1">
                        <button
                          type="button"
                          disabled={validCurrentSheetPage === 1}
                          onClick={() => setCurrentSheetPage(prev => Math.max(prev - 1, 1))}
                          className="p-0.5 hover:bg-[#f6eae0] text-[#a65d4c] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border-none bg-transparent flex items-center justify-center rounded-full"
                          title="Previous Page"
                        >
                          <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <span className="select-none text-[#4a372e] font-sans font-extrabold px-1 text-[11px]">
                          {validCurrentSheetPage}/{totalSheetPages}
                        </span>
                        <button
                          type="button"
                          disabled={validCurrentSheetPage === totalSheetPages}
                          onClick={() => setCurrentSheetPage(prev => Math.min(prev + 1, totalSheetPages))}
                          className="p-0.5 hover:bg-[#f6eae0] text-[#a65d4c] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border-none bg-transparent flex items-center justify-center rounded-full"
                          title="Next Page"
                        >
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            {/* Sheets Grid Wrapper with Fixed Minimum Height so box doesn't shrink when empty or low items */}
            <div className="min-h-[440px] flex flex-col justify-start">
              {filteredSheets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {paginatedSheets.map((sheet, index) => (
                    <div
                      key={index}
                      className="group bg-white border-[2.5px] border-[#dfa38f] hover:border-[#c58270] rounded-xl shadow-[0_4px_16px_rgba(223,163,143,0.2)] hover:shadow-[0_8px_24px_rgba(197,130,112,0.3)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      {/* Image Preview Container - Taller Portrait Sheet View */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-white border-b border-[#e8cdc1]/40 rounded-t-lg">
                        <img
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102 select-none"
                          src={sheet.image}
                          alt={sheet.title}
                        />
                      </div>

                      {/* Content and Buy triggers */}
                      <div className="p-3 flex-grow flex flex-col justify-between gap-2.5">
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <h3 
                            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                            className="text-[13px] md:text-[13.5px] font-bold text-[#4a2c20] leading-snug group-hover:text-[#995343] transition-colors duration-250 truncate flex-1 tracking-tight" 
                            title={cleanTitle(sheet.title)}
                          >
                            {cleanTitle(sheet.title)}
                          </h3>
                          {(() => {
                            const isOwned = purchasedSheets.includes(sheet.title);
                            const isInCart = cartItems.includes(sheet.title);
                            if (isOwned) return null;
                            return (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(sheet);
                                }}
                                style={{
                                  outline: "none",
                                  WebkitTapHighlightColor: "transparent",
                                  boxShadow: "none",
                                }}
                                className={`w-6.5 h-6.5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-out border-[1.5px] shrink-0 select-none outline-none focus:outline-none focus-visible:outline-none ${
                                  isInCart
                                    ? "bg-[#b58474] border-[#a47363] text-white scale-105"
                                    : "bg-white border-[#dfa38f] text-[#dfa38f] hover:border-[#c58270] hover:scale-110 active:scale-95"
                                }`}
                                title={isInCart ? "In Cart (Click to remove)" : "Add to Cart"}
                              >
                                <svg className="w-3.5 h-3.5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="9" cy="21" r="1" fill="currentColor" />
                                  <circle cx="20" cy="21" r="1" fill="currentColor" />
                                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                              </button>
                            );
                          })()}
                        </div>

                        <div className="flex gap-2 pt-2.5 border-t border-dashed border-[#e8cdc1]/40 mt-auto">
                          <button
                            onClick={() => {
                              setActivePreview(sheet);
                            }}
                            className="flex-1 py-2 px-2 bg-[#faf5f2] hover:bg-[#f3ece8] text-[#644137] font-semibold text-xs rounded-[4px] transition-all duration-300 ease-out cursor-pointer flex items-center justify-center border-[1.5px] border-[#dfa38f] hover:border-[#c58270] shadow-[0_2px_6px_rgba(223,163,143,0.15)] active:scale-[0.98]"
                          >
                            View
                          </button>
                          {(() => {
                            const isOwned = purchasedSheets.includes(sheet.title);
                            if (isOwned) {
                              return (
                                <button
                                  onClick={() => handleDownloadSheet(sheet.title)}
                                  style={{
                                    background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                                    boxShadow: "inset 0 1px 1px #FFFFFF, inset 0 -1.5px 2px #854a3c, 0 3px 8px rgba(181, 116, 98, 0.28)",
                                  }}
                                  className="flex-1 py-2 px-2 text-white font-bold text-xs rounded-[4px] border border-[#dfa38f] hover:brightness-110 transition-all duration-300 ease-out cursor-pointer flex items-center justify-center gap-1 active:scale-[0.98]"
                                  title="Download PDF"
                                >
                                  <OrnateDownloadIcon className="w-3.5 h-3.5 text-white" />
                                  Download
                                </button>
                              );
                            }
                            return (
                              <button
                                onClick={() => handleDirectBuy(sheet)}
                                style={{
                                  background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                                  boxShadow: "inset 0 1px 1px #FFFFFF, inset 0 -1.5px 2px #854a3c, 0 3px 8px rgba(181, 116, 98, 0.28)",
                                }}
                                className="flex-1 py-2 px-2 text-white font-bold text-xs rounded-[4px] border border-[#dfa38f] hover:brightness-110 transition-all duration-300 ease-out cursor-pointer flex items-center justify-center gap-1 active:scale-[0.98]"
                                title="Buy Sheet Music"
                              >
                                <TrebleClefCartIcon className="w-3 h-3 text-white" />
                                Buy
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#fdf9f7] rounded-2xl p-8 md:p-10 text-center border-[2.5px] border-[#dfa38f] shadow-[0_8px_30px_rgba(223,163,143,0.22)] max-w-md mx-auto my-auto flex flex-col items-center justify-center space-y-3.5 w-full">
                  <div 
                    style={{
                      background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 30%, #D9A998 60%, #B58474 100%)",
                      boxShadow: "inset 0 1px 1px #FFFFFF, inset 0 -1.5px 2px #854a3c, 0 4px 12px rgba(181, 116, 98, 0.25)",
                      border: "1.5px solid #F5D3C4",
                    }}
                    className="w-13 h-13 rounded-full flex items-center justify-center text-white shrink-0 mb-0.5"
                  >
                    <span className="material-symbols-outlined text-2xl select-none font-bold drop-shadow-[0_1px_2px_rgba(100,40,30,0.4)]">queue_music</span>
                  </div>
                  <h3 className="font-sans text-base md:text-[17px] font-semibold text-[#543d33] tracking-tight">
                    No sheet music found
                  </h3>
                  <p 
                    style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                    className="text-sm md:text-base text-[#7d5e52] italic leading-relaxed max-w-xs font-semibold tracking-wide"
                  >
                    Try looking for another title or genre.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {/* MODAL 1: SIMULATED VIDEO PLAYER MODAL */}
      {isVideoMounted && activeVideo && (
        <div
          className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${
            isVideoVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setActiveVideo(null)}
        >
          <div
            className={`relative w-full max-w-2xl bg-white rounded-[10px] p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(100,50,40,0.22)] border-2 border-[#dca698] flex flex-col items-center transition-all duration-300 ease-out transform ${
              isVideoVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Frame - Symmetrical Tight Padding All Around */}
            <div className="aspect-[16/9] bg-black w-full rounded-[6px] overflow-hidden shadow-xs border border-[#e2b0a4]/30 relative">
              <iframe
                title={activeVideo.title}
                className="w-full h-full border-none"
                src={activeVideo.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Flat Slim CLOSE Button Straddling Outer Bottom Border Line */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-[1px] rounded-full bg-white hover:bg-[#faeee8] text-[#7a483b] hover:text-[#4a2e23] border-[1.5px] border-[#dca698] shadow-sm text-[8px] font-sans font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer active:scale-95 outline-none focus:outline-none"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: SHEET MUSIC PREVIEW OVERLAY (Compact Size & Clean Portrait Paper) */}
      {isPreviewMounted && activePreview && (
        <div
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 transition-all duration-300 ease-out ${
            isPreviewVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setActivePreview(null)}
        >
          <div
            className={`relative w-full max-w-[680px] max-h-[85vh] bg-white border border-[#dfa38f] shadow-[0_20px_60px_rgba(100,50,40,0.25)] rounded-xl flex flex-col overflow-hidden mx-auto transition-all duration-300 ease-out transform ${
              isPreviewVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right - Rose Gold Outline & Cross Icon */}
            <button
              onClick={() => setActivePreview(null)}
              className="absolute top-3 right-3 z-30 w-7.5 h-7.5 flex items-center justify-center rounded-full bg-white hover:bg-[#fbf2ee] text-[#c58270] hover:text-[#995343] border-[1.5px] border-[#dfa38f] hover:border-[#c58270] transition-all duration-200 cursor-pointer active:scale-95 shadow-xs"
              title="Close"
            >
              <span className="material-symbols-outlined text-base select-none font-bold">close</span>
            </button>

            {/* Modal Content - Equal height stretch */}
            <div className="flex-grow flex flex-col md:flex-row items-stretch gap-4 p-5 pt-6 overflow-y-auto bg-[#fffcfb]">
              {/* Main Left: Sheet Music Portrait Paper - Height matched with right panel */}
              <div className="flex justify-center items-center shrink-0 mx-auto md:mx-0">
                <div className="relative flex items-center justify-center rounded-md shadow-md border border-[#e8cdc1]/40 bg-white overflow-hidden p-1 max-h-[58vh] aspect-[1/1.414] shrink-0">
                  <img
                    className="w-full h-full object-contain select-none transition-all duration-300 rounded-xs"
                    alt={`Page 1 Preview of ${cleanTitle(activePreview.title)}`}
                    src={activePreview.previews?.[0] || activePreview.image}
                  />
                  {/* Watermark overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none">
                    <span className="font-display-lg text-3xl md:text-5xl text-primary -rotate-12">PREVIEW ONLY</span>
                  </div>
                </div>
              </div>

              {/* Main Right: Product Information & Purchase CTAs - Matched height */}
              <div className="flex-1 w-full min-w-[240px] flex flex-col justify-between gap-3 overflow-y-auto pr-0.5">
                <div className="space-y-4">
                  <div>
                    <h3 
                      style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                      className="text-base md:text-[18px] font-bold text-[#4a241b] leading-snug tracking-tight"
                    >
                      {cleanTitle(activePreview.title)}
                    </h3>
                    <div className="text-2xl font-black text-[#5e2b1e] mt-1.5">{activePreview.price}</div>
                  </div>

                  {/* Metadata Specs Grid - 6 Items */}
                  <div className="grid grid-cols-2 gap-2.5 bg-[#fdf9f7] p-3.5 rounded-xl border-2 border-[#dfa38f] text-xs">
                    <div>
                      <span className="text-[#8c7467] font-semibold block text-[10px] uppercase tracking-wider">Key</span>
                      <span className="font-bold text-[#6e5448]">{activePreview.keySignature || 'C Major'}</span>
                    </div>
                    <div>
                      <span className="text-[#8c7467] font-semibold block text-[10px] uppercase tracking-wider">Difficulty</span>
                      <span className="font-bold text-[#6e5448]">{activePreview.difficulty || 'Intermediate'}</span>
                    </div>
                    <div>
                      <span className="text-[#8c7467] font-semibold block text-[10px] uppercase tracking-wider">Pages</span>
                      <span className="font-bold text-[#6e5448]">{activePreview.pageCount ? `${activePreview.pageCount} Pages` : '4 Pages'}</span>
                    </div>
                    <div>
                      <span className="text-[#8c7467] font-semibold block text-[10px] uppercase tracking-wider">Format</span>
                      <span className="font-bold text-[#6e5448]">Digital PDF</span>
                    </div>
                    <div>
                      <span className="text-[#8c7467] font-semibold block text-[10px] uppercase tracking-wider">Genre / Style</span>
                      <span className="font-bold text-[#6e5448] truncate block">{activePreview.genres?.join(', ') || 'Gospel / Jazz'}</span>
                    </div>
                    <div>
                      <span className="text-[#8c7467] font-semibold block text-[10px] uppercase tracking-wider">Arranged By</span>
                      <span className="font-bold text-[#6e5448] truncate block">{activePreview.arranger || 'Stephanie Halim'}</span>
                    </div>
                  </div>

                  {/* Description & Purchase Note */}
                  <div className="space-y-2">
                    <p className="text-xs text-[#6e5a51] leading-relaxed font-medium">
                      Complete solo piano score in high-resolution PDF. Instant download with lifetime access to your file.
                    </p>
                    <p className="text-xs text-[#6e5a51] leading-relaxed font-medium italic">
                      The download link will be sent automatically to your email immediately after purchase.
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5 pt-1">
                  {(() => {
                    const isOwned = purchasedSheets.includes(activePreview.title);
                    if (isOwned) {
                      return (
                        <button
                          onClick={() => handleDownloadSheet(activePreview.title)}
                          style={{
                            background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                            boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #854a3c, 0 3px 10px rgba(181, 116, 98, 0.3)",
                          }}
                          className="w-full py-2.5 rounded-[4px] text-white font-bold text-xs cursor-pointer text-center flex items-center justify-center gap-1.5 border border-[#dfa38f] transition-all duration-300 ease-out hover:brightness-110 active:scale-[0.98]"
                          title="Download PDF Sheet Music"
                        >
                          <OrnateDownloadIcon className="w-4 h-4 text-white" />
                          Download Sheet Music (PDF)
                        </button>
                      );
                    }
                    return (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            const sheetToBuy = activePreview;
                            setActivePreview(null);
                            handleDirectBuy(sheetToBuy);
                          }}
                          style={{
                            background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                            boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #854a3c, 0 3px 10px rgba(181, 116, 98, 0.3)",
                          }}
                          className="w-full py-2.5 rounded-[4px] text-white font-bold text-xs cursor-pointer text-center flex items-center justify-center border border-[#dfa38f] transition-all duration-300 ease-out hover:brightness-110 active:scale-[0.98]"
                        >
                          Buy Now
                        </button>
                      </div>
                    );
                  })()}
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
