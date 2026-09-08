import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { sheets } from './sheetsData';
import { GlobalSearchInput } from './components/GlobalSearchInput';

function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }>>([]);
  const lastSpawn = useRef(0);
  const animFrameRef = useRef<number>(0);

  const animate = useCallback(() => {
    // Ring follows cursor with slight smooth delay
    const ringLerp = 0.25;
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ringLerp;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ringLerp;

    const ring = ringRef.current;
    const glow = glowRef.current;

    if (ring) {
      const ringSize = isHovering.current ? 48 : 32;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      ring.style.opacity = isHovering.current ? '0.85' : '0.45';
    }

    if (glow) {
      glow.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      glow.style.opacity = isHovering.current ? '0.45' : '0.2';
    }

    // Trail particles on canvas
    const canvas = trailCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn sparkles based on movement speed
        const now = Date.now();
        const dx = mousePos.current.x - ringPos.current.x;
        const dy = mousePos.current.y - ringPos.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 2 && now - lastSpawn.current > 35) {
          const count = Math.min(Math.floor(speed / 5), 3);
          for (let i = 0; i < count; i++) {
            particles.current.push({
              x: ringPos.current.x + (Math.random() - 0.5) * 10,
              y: ringPos.current.y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1 - 0.4,
              life: 1,
              maxLife: 0.5 + Math.random() * 0.5,
              size: 1.2 + Math.random() * 2,
            });
          }
          lastSpawn.current = now;
        }

        // Update and draw particles (white/shining)
        particles.current = particles.current.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.01;
          p.life -= 0.025 / p.maxLife;

          if (p.life <= 0) return false;

          const alpha = p.life * 0.6;

          // Bright white core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          // Soft white glow halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
          ctx.fill();

          return true;
        });
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .cursor-pointer, .hover-move, input, select, textarea, [onclick]')) {
        isHovering.current = true;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .cursor-pointer, .hover-move, input, select, textarea, [onclick]')) {
        isHovering.current = false;
      }
    };

    const onMouseLeave = () => {
      mousePos.current = { x: -100, y: -100 };
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate]);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Text selection highlight */
        ::selection {
          background-color: #ffffff !important;
          color: #3d251c !important;
        }
        ::-moz-selection {
          background-color: #ffffff !important;
          color: #3d251c !important;
        }

        /* Ring shimmer */
        @keyframes ringShimmer {
          0%, 100% { opacity: 0.35; border-color: rgba(255,255,255,0.35); }
          50% { opacity: 0.7; border-color: rgba(255,255,255,0.6); }
        }
      `}} />

      {/* Sparkle trail canvas */}
      <canvas
        ref={trailCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99997,
        }}
      />

      {/* Soft white glow blob */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 99997,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
        }}
      />

      {/* White shining ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
          animation: 'ringShimmer 2.5s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </>
  );
}

export type ViewType =
  | "home"
  | "dashboard"
  | "library"
  | "videos"
  | "sheets"
  | "courses"
  | "sessions"
  | "forums"
  | "faq"
  | "privacy"
  | "terms"
  | "signup"
  | "signin"
  | "forgotpassword"
  | "cart"
  | "checkout"
  | "my-library"
  | "download-page"
  | "invoice"
  | "profile"
  | "subscription";

export interface LayoutProps {
  children: ReactNode;
  view: ViewType;
  onNavigate: (view: ViewType) => void;
}

function Layout({ children, view, onNavigate }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") !== "false",
  );
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("guest_name") || localStorage.getItem("user_name") || "Student";
  });
  const [cartCount, setCartCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateCartCount = () => {
    try {
      const saved = localStorage.getItem('phanilie_cart');
      if (saved) {
        const cartArr = JSON.parse(saved);
        const count = cartArr.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const [isSlideCartOpen, setIsSlideCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [view]);

  const refreshCart = () => {
    try {
      const saved = localStorage.getItem('phanilie_cart');
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener('storage', refreshCart);
    return () => window.removeEventListener('storage', refreshCart);
  }, []);

  useEffect(() => {
    const handleOpenSlideCart = () => {
      refreshCart();
      setIsSlideCartOpen(true);
    };

    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      setToastMessage(customEvent.detail?.message || 'Item added to cart');
      setShowToast(true);
    };

    window.addEventListener('open-slide-cart', handleOpenSlideCart);
    window.addEventListener('show-toast', handleShowToast);

    return () => {
      window.removeEventListener('open-slide-cart', handleOpenSlideCart);
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Modals for Footer links
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isNewsletterSent, setIsNewsletterSent] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to cross-component contact triggers
  useEffect(() => {
    const handleOpenContact = () => setShowContactModal(true);
    window.addEventListener("open-contact-modal", handleOpenContact);
    return () =>
      window.removeEventListener("open-contact-modal", handleOpenContact);
  }, []);

  // Listen to storage events to sync login state across tabs/actions
  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") !== "false");
      const currentName = localStorage.getItem("guest_name") || localStorage.getItem("user_name") || "Student";
      setUserName(currentName);
    };
    syncLoginState();
    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  // Dynamically set HTML/Body background colors to prevent gaps when zoomed out
  useEffect(() => {
    if (view === "dashboard") {
      document.body.style.backgroundColor = "#eae3e0";
      document.documentElement.style.backgroundColor = "#eae3e0";
    } else {
      document.body.style.backgroundColor = "#fff8f6";
      document.documentElement.style.backgroundColor = "#fff8f6";
    }
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, [view]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("guest_name");
    localStorage.removeItem("guest_email");
    localStorage.removeItem("guest_country");
    window.dispatchEvent(new Event("storage")); // Trigger sync in current window
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsNewsletterSent(true);
    }
  };

  return (
    <div className={`w-full ${view === "dashboard" ? "h-auto bg-[#eae3e0]" : "h-auto bg-[#fff8f6]"} text-[#1d1b1a] font-body-md antialiased flex flex-col`}>
      <style>{`
        ::selection,
        ::-moz-selection,
        *::selection,
        *::-moz-selection,
        body *::selection,
        body *::-moz-selection,
        header *::selection,
        header *::-moz-selection,
        nav *::selection,
        nav *::-moz-selection,
        footer *::selection,
        footer *::-moz-selection,
        p::selection,
        span::selection,
        h1::selection,
        h2::selection,
        h3::selection,
        h4::selection,
        h5::selection,
        a::selection,
        button::selection,
        input::selection,
        div::selection {
          background-color: #F9ECE6 !important;
          color: #5A3A2E !important;
          -webkit-text-fill-color: #5A3A2E !important;
          text-shadow: none !important;
        }
      `}</style>
      <CustomCursor />
      <div className={`max-w-[1440px] mx-auto w-full overflow-x-hidden ${view === "dashboard" ? "h-auto bg-[#fff8f6]" : (view === "my-library" || view === "download-page" || view === "invoice" ? "h-auto bg-transparent" : "h-auto bg-[#fff8f6]")} flex flex-col shadow-[0_0_80px_rgba(45,41,38,0.08)] relative`}>
        {/* Top Navigation Bar */}
        <nav
          className={`sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? "bg-white/85 backdrop-blur-xl border-b border-[#e8cdc1]/30 shadow-[0px_40px_80px_rgba(45,41,38,0.05)]"
            : "bg-white/60 backdrop-blur-md border-b border-[#e8cdc1]/10"
            }`}
        >
          <div className="flex justify-between items-center h-20 md:h-24 px-3 sm:px-6 md:px-12 w-full">
            {/* Left side: Logo + Search Bar */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
              <button
                onClick={() => {
                  onNavigate("home");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center bg-transparent border-none cursor-pointer focus:outline-none group text-left p-0 shrink-0"
              >
                <img
                  src="/stephanie-logo.png"
                  alt="Stephanie Keys"
                  className="h-9 sm:h-11 md:h-15 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              <GlobalSearchInput onNavigate={(v) => {
                onNavigate(v);
                setIsMobileMenuOpen(false);
              }} />
            </div>

            {/* Right side: Nav Links + Shopping Cart & Account Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-8">
              <div className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-4 -ml-2 lg:-ml-3.5">
                {/* 1. HOME */}
                <button
                  onClick={() => onNavigate("home")}
                  className="relative font-sans text-[12.5px] uppercase tracking-[0.06em] font-semibold px-2 py-1 rounded-[4px] border border-transparent hover:border-[#dfa38f] hover:bg-white/50 transition-all duration-300 ease-out cursor-pointer bg-transparent focus:outline-none group"
                >
                  <span
                    className={`${view === "home" ? "text-[#8a5d4c] font-bold" : "text-[#9c6a58] group-hover:text-[#8a5d4c]"} transition-colors duration-300`}
                  >
                    Home
                  </span>
                  {view === "home" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3.5px] h-[3.5px] rounded-full bg-gradient-to-tr from-[#996252] via-[#dfa38f] to-[#fce2db]"></span>
                  )}
                </button>

                {/* 2. VIDEOS */}
                <button
                  onClick={() => onNavigate("videos")}
                  className="relative font-sans text-[12.5px] uppercase tracking-[0.06em] font-semibold px-2 py-1 rounded-[4px] border border-transparent hover:border-[#dfa38f] hover:bg-white/50 transition-all duration-300 ease-out cursor-pointer bg-transparent focus:outline-none group"
                >
                  <span
                    className={`${(view === "videos" || view === "library") ? "text-[#8a5d4c] font-bold" : "text-[#9c6a58] group-hover:text-[#8a5d4c]"} transition-colors duration-300`}
                  >
                    Videos
                  </span>
                  {(view === "videos" || view === "library") && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3.5px] h-[3.5px] rounded-full bg-gradient-to-tr from-[#996252] via-[#dfa38f] to-[#fce2db]"></span>
                  )}
                </button>

                {/* 3. LEARN */}
                <button
                  onClick={() => onNavigate("courses")}
                  className="relative font-sans text-[12.5px] uppercase tracking-[0.06em] font-semibold px-2 py-1 rounded-[4px] border border-transparent hover:border-[#dfa38f] hover:bg-white/50 transition-all duration-300 ease-out cursor-pointer bg-transparent focus:outline-none group"
                >
                  <span
                    className={`${view === "courses" ? "text-[#8a5d4c] font-bold" : "text-[#9c6a58] group-hover:text-[#8a5d4c]"} transition-colors duration-300`}
                  >
                    Learn
                  </span>
                  {view === "courses" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3.5px] h-[3.5px] rounded-full bg-gradient-to-tr from-[#996252] via-[#dfa38f] to-[#fce2db]"></span>
                  )}
                </button>

                {/* 4. PROGRESS */}
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="relative font-sans text-[12.5px] uppercase tracking-[0.06em] font-semibold px-2 py-1 rounded-[4px] border border-transparent hover:border-[#dfa38f] hover:bg-white/50 transition-all duration-300 ease-out cursor-pointer bg-transparent focus:outline-none group"
                >
                  <span
                    className={`${view === "dashboard" ? "text-[#8a5d4c] font-bold" : "text-[#9c6a58] group-hover:text-[#8a5d4c]"} transition-colors duration-300`}
                  >
                    Progress
                  </span>
                  {view === "dashboard" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3.5px] h-[3.5px] rounded-full bg-gradient-to-tr from-[#996252] via-[#dfa38f] to-[#fce2db]"></span>
                  )}
                </button>

                {/* 5. SHEETS */}
                <button
                  onClick={() => onNavigate("sheets")}
                  className="relative font-sans text-[12.5px] uppercase tracking-[0.06em] font-semibold px-2 py-1 rounded-[4px] border border-transparent hover:border-[#dfa38f] hover:bg-white/50 transition-all duration-300 ease-out cursor-pointer bg-transparent focus:outline-none group"
                >
                  <span
                    className={`${view === "sheets" ? "text-[#8a5d4c] font-bold" : "text-[#9c6a58] group-hover:text-[#8a5d4c]"} transition-colors duration-300`}
                  >
                    Sheets
                  </span>
                  {view === "sheets" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3.5px] h-[3.5px] rounded-full bg-gradient-to-tr from-[#996252] via-[#dfa38f] to-[#fce2db]"></span>
                  )}
                </button>
              </div>

              {/* Shopping Cart Pill Button (Ornate White Treble Clef, Readable Calligraphy 'Cart' font, Luxury Italic Serif Number 1) */}
              <button
                onClick={() => setIsSlideCartOpen(true)}
                style={{
                  background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                  boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                  border: "1px solid #D9A998",
                }}
                className="relative h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full cursor-pointer transition-all duration-300 ease-out hover:brightness-120 hover:scale-[1.03] active:scale-95 text-[#FFFFFF] flex items-center gap-1 sm:gap-1.5 shadow-none group shrink-0"
                aria-label="View Shopping Cart"
              >
                {/* Classic Treble Clef (Kunci G) Icon Matching User's Image 1 Reference Exactly */}
                <svg className="w-[11px] sm:w-[13px] h-[16px] sm:h-[20px] fill-current text-white shrink-0 drop-shadow-2xs transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 140">
                  <path d="M 54.7 115.5 C 50.5 119.3 45.3 121.2 39.7 120.7 C 33.2 120.1 27.7 116.5 24.9 110.6 C 22.2 104.9 22.8 98.3 26.4 93 C 30.5 87 37.3 83.2 44.6 82.8 L 44.6 45.8 C 41.5 47 38.6 48.9 36.1 51.3 C 30.2 57.1 27.1 64.8 27.5 73 C 27.9 81.5 32.2 89 39.3 93.4 C 41.4 94.7 42 97.5 40.7 99.6 C 39.4 101.7 36.6 102.3 34.5 101 C 25.2 95.2 19.5 85.3 19 74.2 C 18.5 63.5 22.5 53.5 30.2 45.9 C 34.2 41.9 39 39 44.3 37.4 L 44.3 25 C 44.3 20.4 46.3 16.1 49.7 13.2 C 53.5 10 58.4 8.5 63.4 9.1 C 68.4 9.7 72.8 12.5 75.5 16.7 C 78.2 20.9 78.9 26.1 77.4 30.9 C 76.1 35.1 73.2 38.6 69.3 40.6 C 67.1 41.7 64.5 41 63.4 38.8 C 62.3 36.6 63 34 65.2 32.9 C 67.7 31.6 69.6 29.4 70.4 26.7 C 71.3 23.6 70.9 20.2 69.2 17.5 C 67.5 14.8 64.6 13 61.4 12.6 C 58.1 12.2 54.9 13.2 52.4 15.3 C 50.3 17.1 49 19.8 49 22.7 L 49 36.2 C 53.7 37.3 58.1 39.6 61.8 42.9 C 67.7 48.2 71 55.5 71 63.3 C 71 71.4 67.4 78.9 61.1 83.9 C 55.3 88.5 48 90.7 40.7 90 C 42.7 87.4 46.1 85.6 49.8 84.8 L 49.8 110.7 C 53.7 110.5 57.4 108.9 60.1 106.2 C 63.8 102.6 65.9 97.6 65.9 92.4 C 65.9 88 63.6 83.8 59.7 81 C 57.5 79.4 57 76.6 58.6 74.4 C 60.2 72.2 63 71.7 65.2 73.3 C 70.7 77.3 73.9 83.5 73.9 90.1 C 73.9 99 69.9 107.5 63 113.5 C 60.6 115.6 57.7 116.5 54.7 115.5 Z M 39.7 112.5 C 43.5 112.5 46.5 109.5 46.5 105.7 C 46.5 101.9 43.5 98.9 39.7 98.9 C 35.9 98.9 32.9 101.9 32.9 105.7 C 32.9 109.5 35.9 112.5 39.7 112.5 Z" />
                </svg>

                {/* Readable Calligraphy 'Cart' Font */}
                <span
                  style={{ fontFamily: "'Great Vibes', 'Alex Brush', 'Playfair Display', cursive, serif" }}
                  className="text-xs sm:text-[15px] font-medium text-[#FFFFFF] tracking-wide drop-shadow-2xs leading-none pt-0.5"
                >
                  Cart
                </span>

                {/* Transparent Count Badge with Thin White Border */}
                {cartCount > 0 && (
                  <span
                    className="bg-transparent text-white border border-white/85 font-sans font-bold text-[10px] sm:text-[11px] px-1 sm:px-1.5 min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 rounded-[5px] flex items-center justify-center text-center ml-0.5 shadow-2xs leading-none select-none shrink-0 transition-transform duration-300 group-hover:scale-105"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Sign In / Sign Up / Account Action Controls */}
              {isLoggedIn ? (
                /* Logged In User Button with Dropdown */
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    style={{
                      background: "linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(135deg, #F8E3DB 0%, #E2B0A4 40%, #C48B7C 75%, #8C5446 100%) border-box",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1.5px solid transparent",
                      boxShadow: "0 4px 14px rgba(140, 85, 70, 0.15)",
                    }}
                    className="relative h-8 sm:h-9 px-2.5 sm:px-4 rounded-[8px] cursor-pointer transition-all duration-300 ease-out hover:brightness-105 hover:scale-[1.02] focus:outline-none flex items-center justify-center gap-1 sm:gap-1.5 shadow-none"
                  >
                    {/* Glossy Specular Rose-Gold Semiquaver Icon */}
                    <svg className="w-3.5 h-4 shrink-0 drop-shadow-2xs hidden sm:block" viewBox="0 0 100 130">
                      <defs>
                        <linearGradient id="note-glossy-gold-user" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="25%" stopColor="#FFF0EB" />
                          <stop offset="55%" stopColor="#E2B0A4" />
                          <stop offset="85%" stopColor="#C48B7C" />
                          <stop offset="100%" stopColor="#8C5446" />
                        </linearGradient>
                      </defs>
                      <ellipse cx="28" cy="98" rx="18" ry="12" transform="rotate(-25 28 98)" fill="url(#note-glossy-gold-user)" />
                      <rect x="42" y="10" width="9" height="88" rx="2" fill="url(#note-glossy-gold-user)" />
                      <path d="M 50 10 C 68 22, 82 42, 75 66 C 72 72, 68 76, 65 80 C 72 65, 75 48, 50 32 Z" fill="url(#note-glossy-gold-user)" />
                      <path d="M 50 35 C 68 47, 82 67, 75 91 C 72 96, 68 100, 65 104 C 72 90, 75 73, 50 57 Z" fill="url(#note-glossy-gold-user)" />
                    </svg>

                    <span
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      className="text-[11px] sm:text-xs font-bold text-[#3d2319] tracking-wider truncate max-w-[80px] sm:max-w-none"
                    >
                      {userName}
                    </span>

                    {/* Royal Ruby Red Dropdown Arrow with Smooth Click Rotation */}
                    <svg
                      className={`w-3 h-3 shrink-0 ml-0.5 transition-transform duration-300 ease-out ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#800A1D"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 top-full pt-2 w-44 flex flex-col z-50 transition-all duration-300 ease-out ${
                      isProfileMenuOpen
                        ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
                        : "pointer-events-none opacity-0 -translate-y-1 scale-95"
                    }`}
                  >
                    <div
                      style={{
                        background: "linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(135deg, #F8E3DB 0%, #E2B0A4 40%, #C48B7C 75%, #8C5446 100%) border-box",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: "1.5px solid transparent",
                        boxShadow: "0 8px 24px rgba(140, 85, 70, 0.18)",
                      }}
                      className="p-1.5 rounded-[12px] flex flex-col gap-1 overflow-hidden"
                    >
                      {/* Profile Button */}
                      <button
                        onClick={() => {
                          onNavigate("profile");
                          setIsProfileMenuOpen(false);
                        }}
                        className="relative h-9 px-3 w-full rounded-[8px] cursor-pointer transition-all duration-200 ease-out hover:bg-[#F8E3DB]/60 active:scale-98 focus:outline-none flex items-center justify-start gap-2.5 shrink-0 text-[#3d2319] hover:text-[#800A1D]"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0 text-[#8C5446]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          className="text-xs font-bold tracking-wider"
                        >
                          Profile
                        </span>
                      </button>

                      {/* Subscription Button */}
                      <button
                        onClick={() => {
                          onNavigate("subscription");
                          setIsProfileMenuOpen(false);
                        }}
                        className="relative h-9 px-3 w-full rounded-[8px] cursor-pointer transition-all duration-200 ease-out hover:bg-[#F8E3DB]/60 active:scale-98 focus:outline-none flex items-center justify-start gap-2.5 shrink-0 text-[#3d2319] hover:text-[#800A1D]"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0 text-[#8C5446]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        <span
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          className="text-xs font-bold tracking-wider"
                        >
                          Subscription
                        </span>
                      </button>

                      <div className="h-[1px] bg-[#E2B0A4]/40 my-0.5 mx-1" />

                      {/* Log Out Button */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="relative h-9 px-3 w-full rounded-[8px] cursor-pointer transition-all duration-200 ease-out hover:bg-[#800A1D]/10 active:scale-98 focus:outline-none flex items-center justify-start gap-2.5 shrink-0 text-[#800A1D]"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0 text-[#800A1D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          className="text-xs font-bold tracking-wider"
                        >
                          Log Out
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Not Logged In: Clear Liquid Glass Controls */
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => onNavigate("signin")}
                    style={{
                      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.06) 100%)",
                      backdropFilter: "blur(16px) saturate(180%)",
                      WebkitBackdropFilter: "blur(16px) saturate(180%)",
                      border: "1.5px solid rgba(255, 255, 255, 0.85)",
                      boxShadow: "inset 0 1.5px 1px 0 #FFFFFF, inset 0 -1px 2px 0 rgba(0, 0, 0, 0.04)",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                    className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-[8px] text-[11px] sm:text-xs font-bold text-[#3d2319] hover:text-[#800A1D] hover:scale-[1.02] transition-all duration-200 cursor-pointer focus:outline-none flex items-center justify-center shrink-0"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate("signup")}
                    style={{
                      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.16) 100%)",
                      backdropFilter: "blur(18px) saturate(190%)",
                      WebkitBackdropFilter: "blur(18px) saturate(190%)",
                      border: "1.5px solid rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 6px 18px -2px rgba(0, 0, 0, 0.06), inset 0 1.5px 1px 0 #FFFFFF, inset 0 -1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                    className="relative h-8 sm:h-9 px-3 sm:px-4 rounded-[8px] cursor-pointer transition-all duration-300 ease-out hover:brightness-120 hover:scale-[1.02] active:scale-97 focus:outline-none flex items-center justify-center gap-1 sm:gap-1.5 text-[#3d2319] shadow-none shrink-0"
                  >
                    <svg className="w-3.5 h-4 shrink-0 drop-shadow-2xs hidden sm:block" viewBox="0 0 100 130">
                      <defs>
                        <linearGradient id="note-glossy-gold-su" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="25%" stopColor="#FFF0EB" />
                          <stop offset="55%" stopColor="#E2B0A4" />
                          <stop offset="85%" stopColor="#C48B7C" />
                          <stop offset="100%" stopColor="#8C5446" />
                        </linearGradient>
                      </defs>
                      <ellipse cx="28" cy="98" rx="18" ry="12" transform="rotate(-25 28 98)" fill="url(#note-glossy-gold-su)" />
                      <rect x="42" y="10" width="9" height="88" rx="2" fill="url(#note-glossy-gold-su)" />
                      <path d="M 50 10 C 68 22, 82 42, 75 66 C 72 72, 68 76, 65 80 C 72 65, 75 48, 50 32 Z" fill="url(#note-glossy-gold-su)" />
                      <path d="M 50 35 C 68 47, 82 67, 75 91 C 72 96, 68 100, 65 104 C 72 90, 75 73, 50 57 Z" fill="url(#note-glossy-gold-su)" />
                    </svg>
                    <span
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      className="text-[11px] sm:text-xs font-bold text-[#4A2B20] tracking-wider"
                    >
                      Sign Up
                    </span>
                  </button>
                </div>
              )}

              {/* Mobile Hamburger Drawer Toggle Button (Visible on HP & Tablet < lg) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/80 border border-[#dfa38f] flex items-center justify-center text-[#8a5d4c] hover:bg-[#f8e3db]/60 transition-all cursor-pointer shadow-none shrink-0 ml-1"
                aria-label="Toggle Mobile Menu"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">
                  {isMobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer Overlay (Visible on HP & Tablet < lg) */}
          {isMobileMenuOpen && (
            <div className="lg:hidden w-full bg-white/95 backdrop-blur-xl border-b border-[#e8cdc1]/40 shadow-xl p-4 sm:p-5 transition-all duration-300 animate-in slide-in-from-top-3">
              <div className="flex flex-col gap-2.5 max-w-md mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ab7e66] px-2">Navigation</span>
                <button
                  onClick={() => { onNavigate("home"); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider transition-all border-none cursor-pointer ${view === "home" ? "bg-[#f8e3db] text-[#8a5d4c]" : "bg-transparent text-[#7a594e] hover:bg-[#faf0ed]"}`}
                >
                  <span>Home</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
                <button
                  onClick={() => { onNavigate("videos"); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider transition-all border-none cursor-pointer ${(view === "videos" || view === "library") ? "bg-[#f8e3db] text-[#8a5d4c]" : "bg-transparent text-[#7a594e] hover:bg-[#faf0ed]"}`}
                >
                  <span>Videos</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
                <button
                  onClick={() => { onNavigate("courses"); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider transition-all border-none cursor-pointer ${view === "courses" ? "bg-[#f8e3db] text-[#8a5d4c]" : "bg-transparent text-[#7a594e] hover:bg-[#faf0ed]"}`}
                >
                  <span>Learn</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
                <button
                  onClick={() => { onNavigate("dashboard"); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider transition-all border-none cursor-pointer ${view === "dashboard" ? "bg-[#f8e3db] text-[#8a5d4c]" : "bg-transparent text-[#7a594e] hover:bg-[#faf0ed]"}`}
                >
                  <span>Progress</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
                <button
                  onClick={() => { onNavigate("sheets"); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider transition-all border-none cursor-pointer ${view === "sheets" ? "bg-[#f8e3db] text-[#8a5d4c]" : "bg-transparent text-[#7a594e] hover:bg-[#faf0ed]"}`}
                >
                  <span>Sheets</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content Area */}
        <div
          className="flex flex-col h-auto flex-grow-0"
          style={
            view === "dashboard" ? {
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('/sonata.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#ffffff'
            } : (view === "privacy" || view === "terms" ? {
              backgroundImage: `url('/white-peach-marble.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#faf0ed'
            } : (view === "my-library" || view === "download-page" || view === "invoice" ? {
              backgroundImage: `linear-gradient(rgba(255, 248, 246, 0.50), rgba(255, 248, 246, 0.50)), url('/library-sheet3.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#fff8f6'
            } : undefined))
          }
        >{children}</div>

        {/* Footer */}
        <footer className="w-full mt-0 bg-[#fffdfb] relative">
          {/* Glossy Delicate Soft-Rose Gold Divider Line between Content & Footer */}
          <div className="w-full h-[1.5px] bg-gradient-to-r from-[#bd8174] via-[#e2aba0] via-[#f0c3b7] to-[#bd8174] z-20 relative opacity-90" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-start gap-x-8 gap-y-8 py-8 md:py-10 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
            {/* Column 1: Brand Info */}
            <div className="flex flex-col gap-3.5 w-full">
              <div className="w-fit flex flex-col gap-1.5 h-9 justify-between">
                <h5
                  style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
                  className="text-xs md:text-[13px] font-bold uppercase tracking-[0.18em] text-[#8a5d4c]"
                >
                  STEPHANIE KEYS
                </h5>
                <div
                  style={{
                    backgroundImage: "linear-gradient(90deg, #dfa38f 0%, #ab7e66 50%, #d9a998 100%)",
                  }}
                  className="h-[1.5px] w-full rounded-full"
                />
              </div>
              <p
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-[11.5px] md:text-xs leading-relaxed font-semibold text-[#7a594e] tracking-wide"
              >
                Premium Gospel and Jazz Piano Lessons. Elevating your full-piano potential.
              </p>
            </div>

            {/* Solid Clear 3D Metallic Rose-Gold Vertical Divider */}
            <div className="hidden lg:flex flex-col items-center justify-center self-stretch px-1">
              <svg className="w-4 h-28 shrink-0 drop-shadow-2xs" viewBox="0 0 20 160" fill="none">
                <defs>
                  <linearGradient id="clear-metal-line-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D6CB" />
                    <stop offset="50%" stopColor="#D9A998" />
                    <stop offset="100%" stopColor="#B58474" />
                  </linearGradient>
                </defs>
                <rect x="9" y="0" width="2.5" height="68" rx="1" fill="url(#clear-metal-line-1)" />
                <path d="M 10 68 L 16 78 L 10 88 L 4 78 Z" fill="url(#clear-metal-line-1)" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="10" cy="78" r="2" fill="#FFFFFF" />
                <rect x="9" y="88" width="2.5" height="68" rx="1" fill="url(#clear-metal-line-1)" />
              </svg>
            </div>
            <div className="block lg:hidden h-[2px] w-full bg-[#dfa38f] my-1" />

            {/* Column 2: Connect */}
            <div className="flex flex-col gap-3.5 w-full">
              <div className="w-fit flex flex-col gap-1.5 h-9 justify-between">
                <h5
                  style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
                  className="text-xs md:text-[13px] font-bold uppercase tracking-[0.18em] text-[#8a5d4c]"
                >
                  CONNECT
                </h5>
                <div
                  style={{
                    backgroundImage: "linear-gradient(90deg, #dfa38f 0%, #ab7e66 50%, #d9a998 100%)",
                  }}
                  className="h-[1.5px] w-full rounded-full"
                />
              </div>
              {/* SVG Gradient definitions for darker glossy rose gold icon fills */}
              <svg className="w-0 h-0 absolute">
                <defs>
                  <linearGradient
                    id="glossy-rosegold-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8A5647" />
                    <stop offset="50%" stopColor="#B37868" />
                    <stop offset="100%" stopColor="#6E3E32" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Social Media Icons (Elegant Slow Hover Transition, Smaller Icons) */}
              <div className="flex flex-row items-center gap-3.5 mt-1">
                <a
                  href="https://www.youtube.com/@phanilie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-0.5 flex items-center justify-center transition-all duration-500 ease-out hover:opacity-80 hover:scale-[1.08] active:scale-95 cursor-pointer flex-shrink-0"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-4 h-4 block flex-shrink-0"
                    fill="url(#glossy-rosegold-grad)"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/phanilie_?igsh=c2hzOWJpZ3lyN2l6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-0.5 flex items-center justify-center transition-all duration-500 ease-out hover:opacity-80 hover:scale-[1.08] active:scale-95 cursor-pointer flex-shrink-0"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-4 h-4 block flex-shrink-0"
                    fill="url(#glossy-rosegold-grad)"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@phanilie_?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-0.5 flex items-center justify-center transition-all duration-500 ease-out hover:opacity-80 hover:scale-[1.08] active:scale-95 cursor-pointer flex-shrink-0"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-4 h-4 block flex-shrink-0"
                    fill="url(#glossy-rosegold-grad)"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.43 6.1a8.18 8.18 0 0 1-5.1-1.77v9.4a7.73 7.73 0 1 1-7.73-7.73 7.6 7.6 0 0 1 1.72.2V10a3.68 3.68 0 0 0-1.72-.4 3.73 3.73 0 1 0 3.73 3.73V0h4a8.14 8.14 0 0 0 5.1 1.77z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Solid Clear 3D Metallic Rose-Gold Vertical Divider */}
            <div className="hidden lg:flex flex-col items-center justify-center self-stretch px-1">
              <svg className="w-4 h-28 shrink-0 drop-shadow-2xs" viewBox="0 0 20 160" fill="none">
                <defs>
                  <linearGradient id="clear-metal-line-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D6CB" />
                    <stop offset="50%" stopColor="#D9A998" />
                    <stop offset="100%" stopColor="#B58474" />
                  </linearGradient>
                </defs>
                <rect x="9" y="0" width="2.5" height="68" rx="1" fill="url(#clear-metal-line-2)" />
                <path d="M 10 68 L 16 78 L 10 88 L 4 78 Z" fill="url(#clear-metal-line-2)" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="10" cy="78" r="2" fill="#FFFFFF" />
                <rect x="9" y="88" width="2.5" height="68" rx="1" fill="url(#clear-metal-line-2)" />
              </svg>
            </div>
            <div className="block lg:hidden h-[2px] w-full bg-[#dfa38f] my-1" />

            {/* Column 3: Legal & Support */}
            <div className="flex flex-col gap-3.5 w-full">
              <div className="w-fit flex flex-col gap-1.5 h-9 justify-between">
                <h5
                  style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
                  className="text-xs md:text-[13px] font-bold uppercase tracking-[0.18em] text-[#8a5d4c]"
                >
                  Legal &amp; Support
                </h5>
                <div
                  style={{
                    backgroundImage: "linear-gradient(90deg, #dfa38f 0%, #ab7e66 50%, #d9a998 100%)",
                  }}
                  className="h-[1.5px] w-full rounded-full"
                />
              </div>
              <div className="flex flex-col gap-2 mt-0.5">
                <button
                  onClick={() => onNavigate("faq")}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-[11.5px] md:text-xs text-left bg-transparent border-none cursor-pointer p-0 font-bold text-[#7a594e] hover:text-[#5a3a2e] hover:underline underline-offset-4 decoration-[#dfa38f]/50 transition-colors tracking-wide"
                >
                  FAQ
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-[11.5px] md:text-xs text-left bg-transparent border-none cursor-pointer p-0 font-bold text-[#7a594e] hover:text-[#5a3a2e] hover:underline underline-offset-4 decoration-[#dfa38f]/50 transition-colors tracking-wide"
                >
                  Contact Phanilie
                </button>
              </div>
            </div>

            {/* Solid Clear 3D Metallic Rose-Gold Vertical Divider */}
            <div className="hidden lg:flex flex-col items-center justify-center self-stretch px-1">
              <svg className="w-4 h-28 shrink-0 drop-shadow-2xs" viewBox="0 0 20 160" fill="none">
                <defs>
                  <linearGradient id="clear-metal-line-3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D6CB" />
                    <stop offset="50%" stopColor="#D9A998" />
                    <stop offset="100%" stopColor="#B58474" />
                  </linearGradient>
                </defs>
                <rect x="9" y="0" width="2.5" height="68" rx="1" fill="url(#clear-metal-line-3)" />
                <path d="M 10 68 L 16 78 L 10 88 L 4 78 Z" fill="url(#clear-metal-line-3)" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="10" cy="78" r="2" fill="#FFFFFF" />
                <rect x="9" y="88" width="2.5" height="68" rx="1" fill="url(#clear-metal-line-3)" />
              </svg>
            </div>
            <div className="block lg:hidden h-[2px] w-full bg-[#dfa38f] my-1" />

            {/* Column 4: Piano Tips */}
            <div className="flex flex-col gap-3.5 w-full">
              <div className="w-fit flex flex-col gap-1.5 h-9 justify-between">
                <h5
                  style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
                  className="text-xs md:text-[13px] font-bold uppercase tracking-[0.18em] text-[#8a5d4c]"
                >
                  PIANO TIPS
                </h5>
                <div
                  style={{
                    backgroundImage: "linear-gradient(90deg, #dfa38f 0%, #ab7e66 50%, #d9a998 100%)",
                  }}
                  className="h-[1.5px] w-full rounded-full"
                />
              </div>
              {isNewsletterSent ? (
                <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-700 bg-emerald-100/60 border border-emerald-200/50 py-2 px-4 rounded-xl w-fit animate-in fade-in duration-300">
                  <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                  Subscribed! Thank you.
                </div>
              ) : (
                <form
                  className="flex flex-col gap-1.5 w-full max-w-[200px] mt-0"
                  onSubmit={handleNewsletterSubmit}
                >
                  <input
                    style={{
                      background: "#fffcfb",
                      border: "1.5px solid #dfa38f",
                      boxShadow: "inset 0 1px 3px rgba(223,163,143,0.1)",
                    }}
                    className="rounded-xl px-3.5 py-1.5 text-[11.5px] h-8 w-full text-[#7a594e] placeholder-[#ab7e66]/60 focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] transition-all font-semibold"
                    placeholder="Enter your email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    style={{
                      fontFamily: "'Great Vibes', 'Dancing Script', 'Playfair Display', cursive, serif",
                      background: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1.5px 2px rgba(92,58,46,0.3)",
                      border: "1px solid #D9A998",
                    }}
                    className="w-full h-8 rounded-xl flex items-center justify-center cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xs text-base font-medium text-white tracking-wide capitalize"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </footer>

        {/* Bright Rose-Gold Separator Line (No Glow) */}
        <div
          style={{
            background: "linear-gradient(90deg, #EBC0B2 0%, #DFA898 50%, #EBC0B2 100%)",
            boxShadow: "none",
          }}
          className="h-[1.5px] w-full relative z-20"
        />

        {/* Sub-footer Section (Ultra-Lighter Delicate Blush Rose-Cream Solid Color) */}
        <div
          style={{
            background: "#FAF0EB",
            backgroundColor: "#FAF0EB",
            backgroundImage: "none",
            boxShadow: "none",
            border: "none",
          }}
          className="py-3.5 px-6 md:px-12 w-full text-xs text-[#7A594E] relative z-20"
        >
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 justify-between">
              <p className="whitespace-nowrap font-sans font-normal text-[#7A594E] tracking-normal text-[10.5px] md:text-xs">
                © 2026 Stephanie Keys. All rights reserved.
              </p>

              <div className="flex flex-row items-center gap-3.5 flex-wrap">
                <button
                  onClick={() => onNavigate("privacy")}
                  className="font-sans font-normal text-[#7A594E] hover:text-[#4A2E23] transition-colors bg-transparent border-none cursor-pointer p-0 text-[10.5px] md:text-xs whitespace-nowrap focus:outline-none hover:underline underline-offset-4"
                >
                  Privacy Policy
                </button>

                <span className="text-[#7A594E]/40 font-light text-[10px]">|</span>

                <button
                  onClick={() => onNavigate("terms")}
                  className="font-sans font-normal text-[#7A594E] hover:text-[#4A2E23] transition-colors bg-transparent border-none cursor-pointer p-0 text-[10.5px] md:text-xs whitespace-nowrap focus:outline-none hover:underline underline-offset-4"
                >
                  Terms of Use
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white/95 border border-[#e8cdc1]/40 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactSubmitted(false);
                }}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1] transition-colors border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              {!contactSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                    setContactForm({ name: "", email: "", message: "" });
                  }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-xl font-bold text-[#6e5a51] font-display-lg">
                      Secure Contact Form
                    </h3>
                    <p className="text-xs text-[#81756f] mt-1">
                      Get in touch directly with our administration.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4f4540] uppercase tracking-wider mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full bg-[#f3ecea] border-none rounded-xl py-3 px-4 text-sm text-[#4f4540] focus:ring-2 focus:ring-[#e8cdc1] outline-none"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4f4540] uppercase tracking-wider mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-[#f3ecea] border-none rounded-xl py-3 px-4 text-sm text-[#4f4540] focus:ring-2 focus:ring-[#e8cdc1] outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4f4540] uppercase tracking-wider mb-1.5">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            message: e.target.value,
                          })
                        }
                        className="w-full bg-[#f3ecea] border-none rounded-xl py-3 px-4 text-sm text-[#4f4540] focus:ring-2 focus:ring-[#e8cdc1] outline-none resize-none"
                        placeholder="write your questions"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-br from-[#e8cdc1] to-[#f9ddd1] text-[#6a564d] py-3.5 rounded-xl font-bold hover:shadow-lg active:scale-95 transition-all border-none cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <span
                    className="material-symbols-outlined text-5xl text-emerald-600"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#6e5a51]">
                      Message Sent!
                    </h3>
                    <p className="text-xs text-[#81756f] mt-1">
                      Thank you for reaching out. We will get back to you
                      shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      setContactSubmitted(false);
                    }}
                    className="px-6 py-2.5 bg-[#6e5a51] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all border-none cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-28 right-6 z-[120] bg-white border border-[#dfa38f]/40 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-3 animate-in slide-in-from-top-6 duration-300">
            <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base font-bold">check</span>
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-[#4a372e] uppercase tracking-wider">Success</p>
              <p className="text-xs text-[#8b7368] mt-0.5">{toastMessage}</p>
            </div>
          </div>
        )}

        {/* Slide Cart / Mini Cart (Samping) */}
        {isSlideCartOpen && (
          <div
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex justify-end"
            onClick={() => setIsSlideCartOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white border-l border-[#dfa38f]/20 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-[#e8cdc1]/20">
                <h3 className="font-display-lg text-lg text-[#4a372e] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Shopping Cart
                </h3>
                <button
                  onClick={() => setIsSlideCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1] text-[#6e5a51] flex items-center justify-center cursor-pointer border-none transition-colors"
                >
                  <span className="material-symbols-outlined text-sm select-none">close</span>
                </button>
              </div>

              {/* Item list */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.sheet.title} className="flex gap-4 items-center bg-[#fbf5f1]/60 p-3.5 rounded-xl border border-[#e8cdc1]/10 text-left">
                      <img
                        src={item.sheet.image}
                        alt={item.sheet.title}
                        className="w-16 h-16 object-cover rounded-lg border border-[#e8cdc1]/25"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold text-[#4a372e] truncate">{item.sheet.title}</h4>
                        <p className="text-[10px] text-[#8b7368] mt-0.5">{item.sheet.genres.join(', ')}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-[#856758]">{item.sheet.price}</span>
                          <span className="text-[10px] bg-[#e8cdc1]/20 text-[#856758] font-bold px-1.5 py-0.5 rounded">Qty: 1</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updated = cartItems.filter(i => i.sheet.title !== item.sheet.title);
                          localStorage.setItem('phanilie_cart', JSON.stringify(updated));
                          window.dispatchEvent(new Event('storage'));
                          refreshCart();
                        }}
                        className="w-7 h-7 rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1]/40 text-[#ab7e66] hover:text-[#5a3d31] flex items-center justify-center transition-all border border-[#e8cdc1]/30 cursor-pointer shadow-2xs shrink-0"
                        title="Remove from Cart"
                      >
                        <span className="material-symbols-outlined text-xs font-bold">close</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-[#8b7368]/60 space-y-3">
                    <span className="material-symbols-outlined text-4xl font-light">shopping_basket</span>
                    <span className="text-xs font-semibold">Your cart is empty.</span>
                  </div>
                )}
              </div>

              {/* Bottom Panel */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#e8cdc1]/20 bg-[#fcfaf9] space-y-4">
                  <div className="flex justify-between text-xs text-[#5a4740] font-semibold">
                    <span>Items: <strong className="text-[#4a372e]">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</strong></span>
                    <span>Subtotal: <strong className="text-[#856758]">{
                      (() => {
                        const subtotal = cartItems.reduce((acc, item) => {
                          const freshSheet = sheets.find(s => s.title === item.sheet.title);
                          const priceStr = freshSheet ? freshSheet.price : item.sheet.price;
                          const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
                          return acc + price * item.quantity;
                        }, 0);
                        return `$${subtotal.toFixed(2)}`;
                      })()
                    }</strong></span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => {
                        setIsSlideCartOpen(false);
                        onNavigate('cart');
                      }}
                      className="w-full py-3 bg-[#856758] hover:bg-[#785b4c] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer border-none shadow-md hover:shadow-lg"
                    >
                      View Shopping Cart
                    </button>
                    <button
                      onClick={() => {
                        setIsSlideCartOpen(false);
                        onNavigate('checkout');
                      }}
                      style={{
                        backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                      }}
                      className="w-full text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl border border-white/20 cursor-pointer shadow-md hover:scale-[1.01] transition-all"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
