import { useState, useEffect, useRef } from "react";
import Layout, { type ViewType } from "./layout";
import CoversSheets from "./coversSheets";
import Dashboard from "./dashboard";
import Courses from "./courses";
import FAQ from "./faq";
import PrivacyPolicy from "./privacyPolicy";
import TermsOfService from "./termsOfService";
import SignUp from "./signUp";
import SignIn from "./signIn";
import ForgotPassword from "./forgotPassword";
import SheetPurchaseFlow from "./sheetPurchaseFlow";
import Forums from "./forums";
import UserProfile from "./userProfile";
import { type Sheet } from "./sheetsData";


const TESTIMONIAL_GLITTERS = [
  { left: "3%", size: 4, delay: "0s", duration: "7s" },
  { left: "8%", size: 6, delay: "2.5s", duration: "9s" },
  { left: "15%", size: 3, delay: "1.2s", duration: "6s" },
  { left: "21%", size: 5, delay: "4.5s", duration: "11s" },
  { left: "28%", size: 4, delay: "0.8s", duration: "8s" },
  { left: "34%", size: 7, delay: "3s", duration: "10s" },
  { left: "40%", size: 3, delay: "5.5s", duration: "7.5s" },
  { left: "46%", size: 5, delay: "1.7s", duration: "9.5s" },
  { left: "53%", size: 4, delay: "2.2s", duration: "8.5s" },
  { left: "59%", size: 6, delay: "0.3s", duration: "11.5s" },
  { left: "65%", size: 3, delay: "4.8s", duration: "6.5s" },
  { left: "72%", size: 5, delay: "3.7s", duration: "10.5s" },
  { left: "78%", size: 4, delay: "1.5s", duration: "7s" },
  { left: "84%", size: 7, delay: "5.1s", duration: "12s" },
  { left: "91%", size: 3, delay: "2.9s", duration: "8s" },
  { left: "96%", size: 5, delay: "0.6s", duration: "9.5s" }
];

function Homepage() {
  const [view, setView] = useState<ViewType>("home");

  const [buyNowSheet, setBuyNowSheet] = useState<Sheet | null>(null);

  const handleNavigate = (v: ViewType | string) => setView(v as ViewType);


  const [activeFaq, setActiveFaq] = useState<number>(0);


  // Robust double-video looping ref-based system (always mounted)
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  // Pricing video looping ref
  const pricingVideoRef = useRef<HTMLVideoElement>(null);

  /*
  const handleFaqTimeUpdate = (key: "A" | "B") => {
    const activeEl = key === "A" ? videoARef.current : videoBRef.current;
    const inactiveEl = key === "A" ? videoBRef.current : videoARef.current;

    if (activeEl && inactiveEl && activeEl.duration) {
      const timeRemaining = activeEl.duration - activeEl.currentTime;
      if (faqActive === key && timeRemaining < 3.2) {
        inactiveEl.currentTime = 0;
        inactiveEl.play().catch(() => {});
        setFaqActive(key === "A" ? "B" : "A");

        setTimeout(() => {
          if (activeEl) {
            activeEl.pause();
            activeEl.currentTime = 0;
          }
        }, 3200);
      }
    }
  };
  */

  useEffect(() => {
    if (view === "home") {
      const timer = setTimeout(() => {
        if (videoARef.current) {
          videoARef.current.playbackRate = 0.55;
          videoARef.current.play().catch(() => { });
        }
        if (videoBRef.current) {
          videoBRef.current.playbackRate = 0.55;
          videoBRef.current.pause();
          videoBRef.current.currentTime = 0;
        }
        // setFaqActive("A");
        if (pricingVideoRef.current) {
          pricingVideoRef.current.play().catch(() => { });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [view]);



  const renderContent = () => {
    switch (view) {
      case "videos":
        return (
          <CoversSheets
            initialTab="videos"
            onNavigate={handleNavigate}
            onSetBuyNowSheet={(sheet) => {
              setBuyNowSheet(sheet);
              const loggedIn = localStorage.getItem("isLoggedIn") !== "false";
              setView(loggedIn ? "checkout" : "signin");
            }}
          />
        );
      case "sheets":
        return (
          <CoversSheets
            initialTab="sheets"
            onNavigate={handleNavigate}
            onSetBuyNowSheet={(sheet) => {
              setBuyNowSheet(sheet);
              const loggedIn = localStorage.getItem("isLoggedIn") !== "false";
              setView(loggedIn ? "checkout" : "signin");
            }}
          />
        );
      case "library":
        return (
          <CoversSheets
            initialTab="all"
            onNavigate={handleNavigate}
            onSetBuyNowSheet={(sheet) => {
              setBuyNowSheet(sheet);
              const loggedIn = localStorage.getItem("isLoggedIn") !== "false";
              setView(loggedIn ? "checkout" : "signin");
            }}
          />
        );
      case "cart":
        return (
          <SheetPurchaseFlow
            initialStep={2}
            onNavigate={handleNavigate}
            selectedSheetForBuyNow={buyNowSheet}
            clearBuyNowSheet={() => setBuyNowSheet(null)}
          />
        );
      case "checkout":
        return (
          <SheetPurchaseFlow
            initialStep={4}
            onNavigate={handleNavigate}
            selectedSheetForBuyNow={buyNowSheet}
            clearBuyNowSheet={() => setBuyNowSheet(null)}
          />
        );
      case "my-library":
        return (
          <SheetPurchaseFlow
            initialStep={8}
            onNavigate={handleNavigate}
          />
        );
      case "download-page":
        return (
          <SheetPurchaseFlow
            initialStep={9}
            onNavigate={handleNavigate}
          />
        );
      case "invoice":
        return (
          <SheetPurchaseFlow
            initialStep={10}
            onNavigate={handleNavigate}
          />
        );
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "courses":
        return <Courses />;
      case "forums":
        return <Forums onNavigate={handleNavigate} />;
      case "profile":
        return <UserProfile onNavigate={handleNavigate} initialTab="profile" />;
      case "subscription":
        return <UserProfile onNavigate={handleNavigate} initialTab="subscription" />;
      case "faq":
        return <FAQ />;
      case "privacy":
        return <PrivacyPolicy />;
      case "terms":
        return <TermsOfService />;
      case "signup":
        return <SignUp onNavigate={handleNavigate} />;
      case "signin":
        return <SignIn onNavigate={handleNavigate} />;
      case "forgotpassword":
        return <ForgotPassword onNavigate={handleNavigate} />;
      case "home":
      default:
        return (
          <>
            {/* Hero Section (Image Background Exclusive to Hero Section) */}
            <section className="relative h-[calc(100vh-96px)] min-h-[440px] max-h-[640px] md:max-h-[750px] flex items-center overflow-hidden py-10 md:py-0">
              <div className="absolute inset-0 z-0">
                {/* Truly Diagonal White Gradient Fading Overlay Across Entire Hero Image */}
                <div
                  className="absolute inset-0 z-15 pointer-events-none"
                  style={{
                    background: "linear-gradient(125deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 28%, rgba(255, 255, 255, 0.35) 48%, transparent 68%)"
                  }}
                />
                <img
                  className="w-full h-full object-cover object-[85%_25%] transform transition-all duration-500"
                  alt="Luxury grand piano in palace music hall"
                  src="/hero-sheet-palace.jpg?v=5"
                />
              </div>

              <div className="relative z-20 px-6 max-w-[1200px] mx-auto w-full">
                <div className="max-w-md sm:max-w-lg md:max-w-xl space-y-5">
                  <h1 className="font-curvy-vibes text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#5c3328] font-normal leading-tight py-1">
                    Learn Gospel and Jazz Piano Step by Step
                  </h1>
                  <p className="text-xs md:text-sm lg:text-base font-semibold text-[#6e4236] leading-relaxed max-w-lg">
                    Transform your playing with a step-by-step method that takes
                    you from beginner to advanced.
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                    <button
                      onClick={() => setView("dashboard")}
                      className="px-6 py-3 md:px-7 md:py-3.5 rounded-[9px] font-bold text-xs md:text-sm text-[#5c3328] bg-white/40 backdrop-blur-md border-[2.5px] border-[#e2b0a4] shadow-[0_4px_15px_rgba(196,139,124,0.18)] cursor-pointer transition-all duration-300 ease-out hover:bg-white/65 hover:border-[#c48b7c] hover:brightness-110 hover:shadow-[0_0_22px_rgba(226,176,164,0.65),0_0_12px_rgba(255,255,255,0.8),inset_0_0_15px_rgba(255,255,255,0.5)] active:scale-95 flex items-center justify-center gap-2 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none select-none"
                    >
                      Start Learning
                    </button>
                    <button
                      onClick={() => setView("videos")}
                      className="px-6 py-3 md:px-7 md:py-3.5 rounded-[9px] font-bold text-xs md:text-sm text-[#5c3328] bg-white/40 backdrop-blur-md border-[2.5px] border-[#e2b0a4] shadow-[0_4px_15px_rgba(196,139,124,0.18)] cursor-pointer transition-all duration-300 ease-out hover:bg-white/65 hover:border-[#c48b7c] hover:brightness-110 hover:shadow-[0_0_22px_rgba(226,176,164,0.65),0_0_12px_rgba(255,255,255,0.8),inset_0_0_15px_rgba(255,255,255,0.5)] active:scale-95 flex items-center justify-center gap-2 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none select-none"
                    >
                      Watch S Keys Videos
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Glossy Rose Gold Divider Line between Hero Section and Quote Section */}
            <div className="w-full h-[4.5px] bg-gradient-to-r from-[#c48b7c] via-[#e2b0a4] via-[#ffffff] via-[#e2b0a4] to-[#c48b7c] z-20 relative shadow-[0_0_12px_rgba(226,176,164,0.5)]" />

            {/* Standalone God-Given Creativity Quote Section (Pure Clean White Background) */}
            <section className="py-1 md:py-2.5 px-6 bg-white text-center relative overflow-hidden">
              {/* CSS Keyframe Animations for Faster Shiny Rose Gold Sparkles */}
              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes roseGoldSparkle1 {
                  0% { transform: translate(0, 10px) scale(0.3) rotate(0deg); opacity: 0; }
                  40% { opacity: 1; filter: drop-shadow(0 0 6px #e2b0a4) drop-shadow(0 0 14px #ffd0ab) drop-shadow(0 0 18px #ffffff); }
                  80% { opacity: 1; filter: drop-shadow(0 0 6px #e2b0a4) drop-shadow(0 0 14px #ffd0ab) drop-shadow(0 0 18px #ffffff); }
                  100% { transform: translate(14px, -38px) scale(1.05) rotate(120deg); opacity: 0; }
                }
                @keyframes roseGoldSparkle2 {
                  0% { transform: translate(0, 5px) scale(0.25) rotate(0deg); opacity: 0; }
                  50% { opacity: 1; filter: drop-shadow(0 0 7px #f5c6b9) drop-shadow(0 0 16px #ffffff); }
                  100% { transform: translate(-14px, -42px) scale(1.1) rotate(-140deg); opacity: 0; }
                }
                @keyframes roseGoldSparkle3 {
                  0% { transform: translate(0, 8px) scale(0.35) rotate(0deg); opacity: 0; }
                  45% { opacity: 0.95; filter: drop-shadow(0 0 6px #dfa38f) drop-shadow(0 0 12px #f8e3db); }
                  100% { transform: translate(16px, -36px) scale(0.95) rotate(160deg); opacity: 0; }
                }
              `}} />

              {/* Floating Shiny Rose Gold Sparkle Elements */}
              <div className="absolute inset-0 pointer-events-none select-none z-0">
                <svg className="absolute text-[#e2b0a4] fill-current" style={{ top: '12%', left: '4%', width: '15px', height: '15px', animation: 'roseGoldSparkle1 3.2s infinite ease-in-out' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg className="absolute text-[#f8e3db] fill-current" style={{ top: '18%', left: '93%', width: '13px', height: '13px', animation: 'roseGoldSparkle2 2.8s infinite ease-in-out', animationDelay: '0.6s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg className="absolute text-[#dfa38f] fill-current" style={{ top: '8%', left: '20%', width: '11px', height: '11px', animation: 'roseGoldSparkle3 3.5s infinite ease-in-out', animationDelay: '0.3s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>

              {/* Pure Text Block formatted in exactly 2 lines on desktop */}
              <div className="relative z-10 max-w-4xl mx-auto py-0">
                <p
                  className="font-display-lg text-xs sm:text-sm md:text-base lg:text-[16px] italic text-[#8a5d4c] leading-relaxed font-medium tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  "You’re already in the right place where God-given creativity in music can grow"
                </p>
              </div>
            </section>

            {/* Bottom Glossy Thick Rose Gold Divider Line after Quote Section */}
            <div className="w-full h-[4.5px] bg-gradient-to-r from-[#c48b7c] via-[#e2b0a4] via-[#f8e3db] to-[#e2b0a4] z-20 relative shadow-[0_0_10px_rgba(226,176,164,0.4)]" />

            {/* Unified Continuous Palace Background Container for Welcome, About Mentor, and What You Will Get */}
            <div className="relative overflow-hidden bg-[#faf5f0]">
              {/* Single Continuous Background Palace Image Layer Across All 3 Sections */}
              <div
                className="absolute inset-0 z-0 pointer-events-none select-none opacity-80"
                style={{
                  backgroundImage: "url('/palacey.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* White 20% Opacity Brightening Overlay Layer */}
              <div className="absolute inset-0 bg-white/20 z-0 pointer-events-none" />

              {/* CSS Keyframes for falling glitters */}
              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes glitter-fall {
                  0% {
                    transform: translateY(-20px) rotate(0deg);
                    opacity: 0;
                  }
                  10% {
                    opacity: 0.9;
                  }
                  90% {
                    opacity: 0.9;
                  }
                  100% {
                    transform: translateY(1600px) rotate(360deg);
                    opacity: 0;
                  }
                }
              `}} />

              {/* Shared SVG Gradient Definition for Luxury Rose Gold Vector Icons */}
              <svg className="w-0 h-0 absolute overflow-hidden pointer-events-none" aria-hidden="true">
                <defs>
                  <linearGradient id="roseGoldIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f3beae" />
                    <stop offset="50%" stopColor="#dfa38f" />
                    <stop offset="100%" stopColor="#b87463" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Section 1: Welcome to Stephanie Keys */}
              <section className="py-24 px-6 border-b border-[#ebd3cb]/15 relative z-10">
                {/* Glitter Particles (Snowfall) */}
                {TESTIMONIAL_GLITTERS.map((p, idx) => (
                  <div
                    key={idx}
                    className="absolute pointer-events-none rounded-full bg-gradient-to-br from-[#dfa38f] via-[#f5b8c9] to-[#ffd0ab]"
                    style={{
                      left: p.left,
                      top: '-20px',
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      animation: `glitter-fall ${p.duration} linear infinite`,
                      animationDelay: p.delay,
                      boxShadow: `0 0 10px rgba(245, 184, 201, 0.9), 0 0 4px rgba(223, 163, 143, 0.6)`,
                      zIndex: 1
                    }}
                  />
                ))}

                {/* Ambient decorative glowing blobs */}
                <div className="absolute top-12 left-1/4 w-72 h-72 bg-[#ffd89b]/25 rounded-full blur-[90px] pointer-events-none z-0"></div>
                <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-[#dfa38f]/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

                <div className="max-w-[1100px] mx-auto space-y-10 relative z-10">
                  {/* Header */}
                  <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <h2
                      className="font-display-lg text-2xl md:text-3xl lg:text-4xl text-[#885748] font-bold leading-tight tracking-tight drop-shadow-xs"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Welcome to Stephanie Keys.
                    </h2>
                    <p className="font-sans text-[11px] md:text-xs text-[#a06d5e] font-bold uppercase tracking-[0.16em]">
                      If you join Stephanie Keys, you will be able to:
                    </p>
                  </div>

                  {/* 3-Column Luxury Water-Droplet Glassmorphic Treasure Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch w-full">
                    {[
                      {
                        pillar: "PILLAR 01 • HARMONY",
                        title: "Reharms & Voicings",
                        desc: "Revoice, reharm, and transpose any standard by ear using rich rootless voicings, altered extensions, and smooth voice leading without needing sheet music.",
                        renderIcon: () => (
                          <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-700 ease-out shrink-0" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="21" stroke="url(#roseGoldIconGrad)" strokeWidth="1.2" strokeDasharray="1 3" />
                            <path d="M24 2C11.85 2 2 11.85 2 24s9.85 22 22 22 22-9.85 22-22S36.15 2 24 2z" stroke="url(#roseGoldIconGrad)" strokeWidth="1" opacity="0.3" />
                            <path d="M18 10c2 0 3-3 6-3s4 3 6 3" stroke="url(#roseGoldIconGrad)" strokeWidth="1.4" strokeLinecap="round" />
                            <rect x="12" y="16" width="24" height="16" rx="2" stroke="url(#roseGoldIconGrad)" strokeWidth="1.6" fill="url(#roseGoldIconGrad)" fillOpacity="0.08" />
                            <line x1="18" y1="16" x2="18" y2="32" stroke="url(#roseGoldIconGrad)" strokeWidth="1.2" />
                            <line x1="24" y1="16" x2="24" y2="32" stroke="url(#roseGoldIconGrad)" strokeWidth="1.2" />
                            <line x1="30" y1="16" x2="30" y2="32" stroke="url(#roseGoldIconGrad)" strokeWidth="1.2" />
                            <rect x="16" y="16" width="3" height="9" fill="url(#roseGoldIconGrad)" />
                            <rect x="22" y="16" width="3" height="9" fill="url(#roseGoldIconGrad)" />
                            <rect x="28" y="16" width="3" height="9" fill="url(#roseGoldIconGrad)" />
                            <path d="M24 35l1.5 2.5L28 39l-2.5 1.5L24 43l-1.5-2.5L20 39l2.5-1.5z" fill="url(#roseGoldIconGrad)" opacity="0.8" />
                          </svg>
                        ),
                      },
                      {
                        pillar: "PILLAR 02 • RHYTHM",
                        title: "Groove",
                        desc: "Lock down the time pocket, comp responsively with live rhythm sections, and balance independent hands to drive the groove solo or in a full band.",
                        renderIcon: () => (
                          <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-700 ease-out shrink-0" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="21" stroke="url(#roseGoldIconGrad)" strokeWidth="1.2" strokeDasharray="2 2" />
                            <path d="M16 38l6-26c.5-2 3.5-2 4 0l6 26z" stroke="url(#roseGoldIconGrad)" strokeWidth="1.6" fill="url(#roseGoldIconGrad)" fillOpacity="0.08" />
                            <line x1="13" y1="38" x2="35" y2="38" stroke="url(#roseGoldIconGrad)" strokeWidth="1.8" strokeLinecap="round" />
                            <line x1="24" y1="32" x2="33" y2="15" stroke="url(#roseGoldIconGrad)" strokeWidth="1.8" strokeLinecap="round" />
                            <rect x="29" y="18" width="5" height="5" rx="1" fill="url(#roseGoldIconGrad)" stroke="white" strokeWidth="0.8" />
                            <path d="M8 24c0-6 3-10 6-10" stroke="url(#roseGoldIconGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                            <path d="M40 24c0-6-3-10-6-10" stroke="url(#roseGoldIconGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                            <path d="M24 6l1.5 2L27 9l-2 1L24 12l-1-2-2-1 2-1z" fill="url(#roseGoldIconGrad)" />
                          </svg>
                        ),
                      },
                      {
                        pillar: "PILLAR 03 • IMPROV",
                        title: "Solos",
                        desc: "Improvise fluent, expressive solos through rapid changes using authentic bebop vocabulary, chromatic guide tones, and dynamic touch instead of guessing scales.",
                        renderIcon: () => (
                          <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-700 ease-out shrink-0" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="21" stroke="url(#roseGoldIconGrad)" strokeWidth="1.2" strokeDasharray="3 3" />
                            <path d="M26 8v20.5a5.5 5.5 0 1 1-4-5.3V14l12-3v14.5a5.5 5.5 0 1 1-4-5.3V8z" fill="url(#roseGoldIconGrad)" fillOpacity="0.15" stroke="url(#roseGoldIconGrad)" strokeWidth="1.6" strokeLinejoin="round" />
                            <path d="M12 14l1.5 2.5L16 18l-2.5 1.5L12 22l-1.5-2.5L8 18l2.5-1.5z" fill="url(#roseGoldIconGrad)" />
                            <path d="M36 30l1 1.8L39 33l-1.8 1L36 36l-1-1.8L33 33l1.8-1z" fill="url(#roseGoldIconGrad)" opacity="0.8" />
                          </svg>
                        ),
                      },
                    ].map((card, idx) => (
                      <div
                        key={idx}
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(253, 245, 238, 0.78) 50%, rgba(255, 250, 246, 0.88) 100%)",
                          boxShadow:
                            "0 14px 40px rgba(226, 176, 164, 0.18), 0 0 20px rgba(255, 255, 255, 0.8), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)",
                        }}
                        className="relative overflow-hidden p-6 md:p-7 rounded-[28px] md:rounded-tl-[38px] md:rounded-br-[38px] md:rounded-tr-[18px] md:rounded-bl-[18px] border-2 border-[#e2b0a4]/80 backdrop-blur-2xl transition-all duration-700 ease-out hover:border-[#f3beae] hover:bg-white/95 hover:shadow-[0_20px_50px_rgba(226,176,164,0.30)] flex flex-col justify-between group cursor-pointer"
                      >
                        {/* Subtle Glass Reflection */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/50 via-white/10 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

                        <div className="space-y-4 relative z-10">
                          {/* Top Header: Pillar Tag & Ornate Royal Engraved Icon */}
                          <div className="flex items-center justify-between gap-2.5">
                            {/* Glossy Soft Rose Gold Ribbon Tag */}
                            <span className="font-sans text-[9.5px] font-black uppercase tracking-[0.18em] text-[#885748] bg-gradient-to-r from-white via-[#ffd0ab]/60 to-[#e2b0a4]/40 border border-[#e2b0a4]/60 px-3 py-1 rounded-full shadow-xs backdrop-blur-md flex items-center gap-1.5 transition-colors duration-300">
                              <span className="text-[#c48b7c] font-bold text-[8.5px]">✦</span>
                              {card.pillar}
                            </span>

                            {/* Seamless Ornate Royal Engraved Vector Icon */}
                            {card.renderIcon()}
                          </div>

                          {/* Title */}
                          <h3
                            className="font-display-lg text-lg md:text-xl font-bold text-[#885748] tracking-tight group-hover:text-[#78493a] transition-colors duration-300"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {card.title}
                          </h3>

                          {/* Description */}
                          <p className="font-sans text-[11.5px] md:text-xs text-[#9c6d5e] leading-relaxed font-medium">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>


              {/* Top Delicate Rose Gold Divider Line for About Mentor Section */}
              <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#c48b7c] via-[#e2b0a4] via-[#ffffff] via-[#e2b0a4] via-[#c48b7c] to-transparent z-20 relative opacity-90" />

              {/* Section 2: About Mentor Section with 60% White Opacity */}
              <section className="py-16 md:py-20 px-6 relative z-10 overflow-hidden bg-white/60">
                <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
                  {/* Left Column: Rectangular Mentor Photo with Heavy Glossy Rose Gold Luxury Frame */}
                  <div className="lg:col-span-5 flex items-center justify-center relative">
                    {/* Glowing Soft Warm Ambient Blobs behind Photo */}
                    <div className="absolute w-72 h-72 bg-[#ffd89b]/20 rounded-full blur-[80px] pointer-events-none -z-10" />
                    <div className="absolute w-80 h-80 bg-[#dfa38f]/18 rounded-full blur-[90px] pointer-events-none -z-10" />

                    {/* Rectangular Heavy Glossy Rose Gold Frame Container */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FFF0EB 0%, #E2B0A4 35%, #C48B7C 70%, #8C5446 100%) padding-box, linear-gradient(135deg, #ffffff 0%, #f8e3db 20%, #e2b0a4 45%, #c48b7c 75%, #7a4639 100%) border-box",
                        border: "6px solid transparent",
                        boxShadow: "0 22px 55px rgba(160, 105, 90, 0.28), 0 0 30px rgba(226, 176, 164, 0.35), inset 0 2px 3px rgba(255, 255, 255, 0.95)",
                      }}
                      className="relative overflow-hidden w-full max-w-[350px] sm:max-w-[390px] h-[440px] sm:h-[480px] lg:h-[500px] rounded-2xl transition-all duration-500 hover:shadow-[0_28px_65px_rgba(160,105,90,0.35)]"
                    >
                      <img
                        className="w-full h-full object-cover object-[45%_15%] scale-[1.22] transform transition-all duration-700"
                        style={{
                          /* Foto Diterangkan Dikit & Cool Tone Dikit */
                          filter: "brightness(1.12) contrast(1.02) saturate(0.96) hue-rotate(-4deg)",
                        }}
                        src="/profile-photo.jpg"
                        alt="Stephanie Halim - Mentor"
                      />
                    </div>
                  </div>

                  {/* Right Column: About Mentor Text without any card wrapper/box/border/background */}
                  <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                    <div>
                      <span className="font-curvy-vibes text-4xl text-[#ab7e66] block mb-1">
                        The Founder's Story
                      </span>
                      <h2 className="font-display-lg text-2xl md:text-3xl lg:text-4xl text-[#4a372e] font-bold leading-tight tracking-tight">
                        About Mentor
                      </h2>
                    </div>

                    <div className="space-y-4 font-sans text-sm md:text-base text-[#6e5a51] leading-relaxed">
                      <p className="font-semibold text-[#5a453d] text-base md:text-lg">
                        Hello, I’m Stephanie Halim. Welcome to a peaceful space to
                        learn and grow.
                      </p>
                      <p>
                        Music has always been my happy place. My own journey began
                        in the deeply disciplined world of classical music. While
                        I cherish that beautiful foundation, I found a different
                        kind of peace and creative freedom when I began exploring
                        the warm, soulful sounds of jazz and gospel piano.
                      </p>
                      <p>
                        You don’t need a formal music college degree or years of
                        rigid training to experience the joy of sitting down at
                        the keys and playing what's in your heart. I’ve designed
                        this platform to be a structured guide, yet flexible
                        enough to let you explore and express your own musical
                        voice.
                      </p>

                      <div className="pl-4 border-l-2 border-[#ab7e66] pt-1 pb-1 mt-4">
                        <p className="font-display-lg italic text-[#5a453d] font-semibold text-base md:text-lg leading-relaxed">
                          "In Stephanie Keys, we will explore rich chords, and help
                          you find your own voice on the piano at your own
                          comfortable pace."
                        </p>
                        <span className="block mt-2 text-xs md:text-sm font-sans font-bold uppercase tracking-widest text-[#ab7e66]">
                          — Stephanie Halim, 2026
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom Delicate Rose Gold Divider Line for About Mentor Section */}
              <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#c48b7c] via-[#e2b0a4] via-[#ffffff] via-[#e2b0a4] via-[#c48b7c] to-transparent z-20 relative opacity-90" />


              {/* Section 3: What You Will Get Section */}
              <section className="py-14 md:py-18 px-6 text-center relative z-10">
                {/* Floating Sparkle Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                  {/* Sparkle 1 (Top Left) */}
                  <svg className="absolute text-[#d49a8b] fill-current" style={{ top: '10%', left: '5%', width: '10px', height: '10px', animation: 'sparkleFloat1 5s infinite ease-in-out' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 2 (Top Right) */}
                  <svg className="absolute text-[#c58b73] fill-current" style={{ top: '15%', left: '92%', width: '8px', height: '8px', animation: 'sparkleFloat2 4s infinite ease-in-out', animationDelay: '1.2s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 3 (Mid Left) */}
                  <svg className="absolute text-[#d49a8b] fill-current" style={{ top: '25%', left: '12%', width: '12px', height: '12px', animation: 'sparkleFloat3 6s infinite ease-in-out', animationDelay: '0.5s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 4 (Mid Right) */}
                  <svg className="absolute text-[#c58b73] fill-current" style={{ top: '32%', left: '88%', width: '9px', height: '9px', animation: 'sparkleFloat1 5.5s infinite ease-in-out', animationDelay: '2.0s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 5 (Bottom Left) */}
                  <svg className="absolute text-[#d49a8b] fill-current" style={{ top: '40%', left: '4%', width: '11px', height: '11px', animation: 'sparkleFloat2 4.8s infinite ease-in-out', animationDelay: '1.0s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 6 (Bottom Right) */}
                  <svg className="absolute text-[#c58b73] fill-current" style={{ top: '48%', left: '94%', width: '8px', height: '8px', animation: 'sparkleFloat3 5.2s infinite ease-in-out', animationDelay: '2.5s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 7 (Top Mid-Left) */}
                  <svg className="absolute text-[#d49a8b] fill-current" style={{ top: '60%', left: '15%', width: '10px', height: '10px', animation: 'sparkleFloat1 6.2s infinite ease-in-out', animationDelay: '0.2s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 8 (Bottom Mid-Right) */}
                  <svg className="absolute text-[#c58b73] fill-current" style={{ top: '65%', left: '85%', width: '12px', height: '12px', animation: 'sparkleFloat2 5s infinite ease-in-out', animationDelay: '1.8s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                </div>

                <div className="relative z-10 max-w-[1200px] mx-auto space-y-10">
                  {/* Header */}
                  <div className="space-y-1">
                    <h2 className="font-display-lg text-xl md:text-2xl lg:text-[28px] text-[#784d40] font-medium leading-tight tracking-wide">
                      What You Will Get
                    </h2>
                    <p className="font-curvy-vibes text-2xl md:text-3xl lg:text-4xl text-[#a06d5e] block leading-snug">
                      from Stephanie Keys Course
                    </p>
                  </div>

                  {/* Horizontal Features Grid (5 columns on desktop) with Rose Gold Glossy Outline Borders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 max-w-[1200px] mx-auto">
                    {[
                      {
                        title: "Structured Learning",
                        desc: "A clear, step-by-step roadmap to guide your daily practice.",
                        renderIcon: () => (
                          <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 32 32" fill="none">
                            <path d="M5 24C8 24 10 17 16 17C22 17 24 7 27 7" stroke="url(#roseGoldIconGrad)" strokeWidth="2.4" strokeLinecap="round" />
                            <circle cx="5" cy="24" r="3.5" fill="url(#roseGoldIconGrad)" />
                            <circle cx="16" cy="17" r="3" fill="#ffffff" stroke="url(#roseGoldIconGrad)" strokeWidth="2" />
                            <circle cx="27" cy="7" r="3.5" fill="url(#roseGoldIconGrad)" />
                            <path d="M23 5L24.5 6.5L27 7L24.5 7.5L23 9L21.5 7.5L19 7L21.5 6.5Z" fill="#e2b0a4" />
                          </svg>
                        ),
                      },
                      {
                        title: "Full Access",
                        desc: "Unlimited access to the entire music courses.",
                        renderIcon: () => (
                          <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 32 32" fill="none">
                            <circle cx="11" cy="11" r="6.5" stroke="url(#roseGoldIconGrad)" strokeWidth="2.4" fill="url(#roseGoldIconGrad)" fillOpacity="0.15" />
                            <circle cx="11" cy="11" r="2.5" fill="url(#roseGoldIconGrad)" />
                            <path d="M15.5 15.5L25.5 25.5M22 22L24.5 24.5M19.5 24.5L21.5 26.5" stroke="url(#roseGoldIconGrad)" strokeWidth="2.4" strokeLinecap="round" />
                          </svg>
                        ),
                      },
                      {
                        title: "Downloadable PDF Notes",
                        desc: "Guidance to your music practice",
                        renderIcon: () => (
                          <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 32 32" fill="none">
                            <rect x="7" y="4" width="18" height="24" rx="4" stroke="url(#roseGoldIconGrad)" strokeWidth="2.2" fill="url(#roseGoldIconGrad)" fillOpacity="0.1" />
                            <line x1="11" y1="9" x2="21" y2="9" stroke="url(#roseGoldIconGrad)" strokeWidth="2" strokeLinecap="round" />
                            <line x1="11" y1="13" x2="17" y2="13" stroke="url(#roseGoldIconGrad)" strokeWidth="2" strokeLinecap="round" />
                            <path d="M16 16V22M16 22L13 19M16 22L19 19" stroke="url(#roseGoldIconGrad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                      {
                        title: "Drum Tracks",
                        desc: "Practice your improvisation and timing with jazz drum tracks.",
                        renderIcon: () => (
                          <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 32 32" fill="none">
                            <ellipse cx="16" cy="11" rx="9" ry="3.5" stroke="url(#roseGoldIconGrad)" strokeWidth="2" fill="url(#roseGoldIconGrad)" fillOpacity="0.15" />
                            <path d="M7 11V18C7 20.2 11 22 16 22C21 22 25 20.2 25 18V11" stroke="url(#roseGoldIconGrad)" strokeWidth="2" />
                            <path d="M8 12L12 21L16 13L20 21L24 12" stroke="url(#roseGoldIconGrad)" strokeWidth="1.6" opacity="0.8" />
                            <line x1="7" y1="5" x2="25" y2="24" stroke="url(#roseGoldIconGrad)" strokeWidth="2" strokeLinecap="round" />
                            <line x1="25" y1="5" x2="7" y2="24" stroke="url(#roseGoldIconGrad)" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="7" cy="5" r="1.5" fill="url(#roseGoldIconGrad)" />
                            <circle cx="25" cy="5" r="1.5" fill="url(#roseGoldIconGrad)" />
                          </svg>
                        ),
                      },
                      {
                        title: "Monthly Coaching",
                        desc: "Interactive online music live sessions with Stephanie",
                        renderIcon: () => (
                          <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 32 32" fill="none">
                            <path d="M16 5L18.5 9.5L23.5 10L19.5 13.5L20.8 18.5L16 16L11.2 18.5L12.5 13.5L8.5 10L13.5 9.5Z" fill="url(#roseGoldIconGrad)" fillOpacity="0.25" stroke="url(#roseGoldIconGrad)" strokeWidth="2" strokeLinejoin="round" />
                            <circle cx="16" cy="11" r="2.5" fill="url(#roseGoldIconGrad)" />
                            <path d="M9 25C9 21.5 12 19.5 16 19.5C20 19.5 23 21.5 23 25" stroke="url(#roseGoldIconGrad)" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                        ),
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(252, 246, 243, 0.90) 100%) padding-box, linear-gradient(135deg, #ffffff 0%, #f8e3db 20%, #e2b0a4 45%, #c48b7c 75%, #7a4639 100%) border-box",
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                          border: "2.5px solid transparent",
                          boxShadow: "0 10px 30px rgba(160, 110, 95, 0.14), inset 0 1.5px 2px #ffffff",
                        }}
                        className="flex flex-col items-center p-5 md:p-6 rounded-[26px] transition-all duration-500 ease-out hover:scale-[1.04] hover:shadow-[0_18px_40px_rgba(226,176,164,0.35)] cursor-pointer w-full group text-center"
                      >
                        {/* Standalone Ornate Rose Gold Vector Icon (No Square Box Container) */}
                        <div className="mb-4 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center">
                          {item.renderIcon()}
                        </div>

                        {/* Title & Description stacked */}
                        <div className="space-y-2 flex-grow flex flex-col justify-start">
                          <h3 className="font-display-lg text-sm md:text-base font-bold text-[#885748] tracking-tight leading-snug">
                            {item.title}
                          </h3>
                          <p className="font-sans text-[11.5px] md:text-xs text-[#a06d5e] leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Glossy Rose Gold Divider Line between What You Will Get & FAQ */}
            <div className="w-full h-[1.5px] bg-gradient-to-r from-[#b36f61] via-[#d6988c] via-[#ebb1a4] to-[#b36f61] z-20 relative opacity-90" />

            {/* Master Seamless Grand White Marble Hall Container for FAQ, Students Feedbacks, and Pricing */}
            <div className="relative overflow-hidden bg-[#faf5f0]">
              {/* Smooth Medium White Top Gradient above FAQ */}
              <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/90 via-white/50 to-transparent z-10 pointer-events-none" />

              {/* Grand Marble Hall Shared Background Image Layer */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <img
                  className="w-full h-full object-cover object-[50%_30%] transform-gpu"
                  alt="Grand Marble Hall Background"
                  src="/grand-marble-hall.jpg?v=2"
                />
                {/* 
                  Vertical Gradient Overlay across FAQ, Students Feedbacks & Start Your Musical Journey:
                  - Top (FAQ): Silky smooth, feather-blended soft white top glow (from-white/60 via-white/25)
                  - Middle (Students Feedbacks / Mid-Palace): Elegant warm peach tint glow (#fcdcd0 / #f7beae)
                  - Bottom (Start Your Musical Journey): Bright soft white glass finish
                  - 100% smooth, seamless transition without any harsh lines
                */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/25 via-[#faf5f0]/15 via-[#fcdcd0]/30 via-[#f7beae]/35 via-white/50 to-white/78" />
                {/* Soft Low-Opacity White Overlay across FAQ & Students Feedbacks */}
                <div className="absolute inset-0 bg-white/35 z-0 pointer-events-none" />
              </div>

              {/* Section 4: FAQ Section */}
              <section className="py-16 px-6 relative z-10">
                <style dangerouslySetInnerHTML={{
                  __html: `
                  @keyframes faqSparkle1 {
                    0% { transform: translate(0, 15px) scale(0.3) rotate(0deg); opacity: 0; }
                    35% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 8px #ffd89b); }
                    75% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 8px #ffd89b); }
                    100% { transform: translate(10px, -45px) scale(0.85) rotate(90deg); opacity: 0; }
                  }
                  @keyframes faqSparkle2 {
                    0% { transform: translate(0, 8px) scale(0.2) rotate(0deg); opacity: 0; }
                    50% { opacity: 1; filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 9px #ffffff); }
                    100% { transform: translate(-15px, -55px) scale(0.95) rotate(-120deg); opacity: 0; }
                  }
                  @keyframes faqSparkle3 {
                    0% { transform: translate(0, 12px) scale(0.25) rotate(0deg); opacity: 0; }
                    30% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 7px #ffd89b); }
                    80% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 7px #ffd89b); }
                    100% { transform: translate(20px, -50px) scale(0.9) rotate(140deg); opacity: 0; }
                  }
                `}} />

                {/* Floating Sparkle Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                  {/* Sparkle 1 */}
                  <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '8%', left: '4%', width: '10px', height: '10px', animation: 'faqSparkle1 5s infinite ease-in-out' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 2 */}
                  <svg className="absolute text-white fill-current" style={{ top: '12%', left: '94%', width: '8px', height: '8px', animation: 'faqSparkle2 4s infinite ease-in-out', animationDelay: '1.2s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 3 */}
                  <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '22%', left: '10%', width: '12px', height: '12px', animation: 'faqSparkle3 6s infinite ease-in-out', animationDelay: '0.5s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 4 */}
                  <svg className="absolute text-white fill-current" style={{ top: '30%', left: '90%', width: '9px', height: '9px', animation: 'faqSparkle1 5.5s infinite ease-in-out', animationDelay: '2s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 5 */}
                  <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '42%', left: '3%', width: '11px', height: '11px', animation: 'faqSparkle2 4.8s infinite ease-in-out', animationDelay: '1s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 6 */}
                  <svg className="absolute text-white fill-current" style={{ top: '50%', left: '95%', width: '8px', height: '8px', animation: 'faqSparkle3 5.2s infinite ease-in-out', animationDelay: '2.5s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 7 */}
                  <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '65%', left: '12%', width: '10px', height: '10px', animation: 'faqSparkle1 6.2s infinite ease-in-out', animationDelay: '0.2s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 8 */}
                  <svg className="absolute text-white fill-current" style={{ top: '70%', left: '88%', width: '12px', height: '12px', animation: 'faqSparkle2 5s infinite ease-in-out', animationDelay: '1.8s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 9 */}
                  <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '80%', left: '6%', width: '8px', height: '8px', animation: 'faqSparkle3 4.5s infinite ease-in-out', animationDelay: '3s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                  {/* Sparkle 10 */}
                  <svg className="absolute text-white fill-current" style={{ top: '88%', left: '92%', width: '11px', height: '11px', animation: 'faqSparkle1 5.8s infinite ease-in-out', animationDelay: '0.7s' }} viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                </div>

                <div className="relative z-10 max-w-[1000px] mx-auto space-y-10">
                  <div className="text-center space-y-2">
                    <h2
                      className="font-display-lg text-xl md:text-2xl lg:text-3xl text-[#5c3328] font-bold leading-tight tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Frequently Asked Questions
                    </h2>
                    <p className="text-[#8a5a4c] font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                      Click each number to understand everything about the membership
                    </p>
                  </div>

                  {/* Rose Gold Interactive Timeline FAQ Container */}
                  <div className="max-w-[720px] mx-auto space-y-4">
                    {/* Timeline Array Data */}
                    {(() => {
                      const faqItems = [
                        {
                          idx: 0,
                          num: "01",
                          question: "Why choose this membership over free tutorials on YouTube?",
                          answer: "While YouTube has plenty of quick tutorials, it lacks a structured path. Free videos often leave you guessing what to practice next, leading to bad habits or gaps in your playing. This platform provides a step-by-step, organized curriculum that guarantees steady progress without the confusion.",
                        },
                        {
                          idx: 1,
                          num: "02",
                          question: "Is it possible to buy a single course instead of a membership?",
                          answer: "Our courses are designed to work together as a complete learning ecosystem, which is why we offer them exclusively through our all-access membership. This gives you the freedom to move between foundations, skills, and various styles at your own pace without paying for individual packages.",
                        },
                        {
                          idx: 2,
                          num: "03",
                          question: "Are the video lessons available for download?",
                          answer: "No, the video lessons are streaming-only and require an internet connection to watch. This allows us to constantly update our library and ensure you always have access to the highest-quality video playback on any device.",
                        },
                        {
                          idx: 3,
                          num: "04",
                          question: "What is the core learning approach of Stephanie Keys?",
                          answer: "Stephanie Keys bridges the gap between structured music theory and creative expression. We guide you through essential keyboard foundations first, immediately showing you how to turn those concepts into practical improvisation, and applying them across a rich variety of gospel and jazz at your own comfortable pace.",
                        },
                        {
                          idx: 4,
                          num: "05",
                          question: "How easy is it to cancel my subscription?",
                          answer: "Very easy. You have complete control over your subscription and can cancel at any time directly from your account settings with just a few clicks. There are no hidden fees, contracts, or cancellation penalties.",
                        },
                        {
                          idx: 5,
                          num: "06",
                          question: "Do you provide a lifetime access option?",
                          answer: "We currently focus on monthly, 3 months, and annual membership plans to ensure we can continually support our community, host live events, and release fresh course content for our active members.",
                        },
                        {
                          idx: 6,
                          num: "07",
                          question: "Am I allowed to keep the downloaded PDF resources forever?",
                          answer: "Yes! Any sheet music, chord charts, or practice worksheets you download during your active membership period are yours to keep and use offline forever.",
                        },
                        {
                          idx: 7,
                          num: "08",
                          question: "What happens when my free trial period finishes?",
                          answer: "Once your trial ends, your selected membership plan (monthly or annual) will automatically begin using the payment method you provided. If you choose to cancel before the trial period is up, you will not be charged a single cent.",
                        },
                        {
                          idx: 8,
                          num: "09",
                          question: "Are private, 1-on-1 coaching sessions included?",
                          answer: "If private 1-on-1 lessons are preferred, please reach out to the support team for upgrade options.",
                        },
                        {
                          idx: 9,
                          num: "10",
                          question: "Will I lose access to the platform immediately after canceling?",
                          answer: "No, you will retain full access to all courses, live sessions, and downloadable resources until the final day of your current billing cycle. After that date, your account will simply pause, and you won't be billed again.",
                        },
                      ];
                      const currentItem = faqItems[activeFaq] || faqItems[0];

                      return (
                        <>
                          {/* Brown Milk Glass Horizontal Timeline Track */}
                          <div
                            style={{
                              /* Inner Brown Milk (Bisa diatur warna / kepekatannya di sini) */
                              background: "linear-gradient(135deg, rgba(236, 218, 206, 0.95) 0%, rgba(220, 196, 180, 0.90) 50%, rgba(229, 209, 195, 0.96) 100%)",
                              boxShadow: "0 8px 25px rgba(189, 129, 116, 0.22), inset 0 1.5px 2px rgba(255, 255, 255, 0.8)",
                            }}
                            className="relative py-3 px-3 md:px-5 rounded-xl border border-[#bd8174]/80 backdrop-blur-xl"
                          >
                            {/* Background Track Line */}
                            <div className="absolute top-1/2 left-5 right-5 -translate-y-1/2 h-[2.5px] bg-[#d6b4a6] rounded-full hidden sm:block" />
                            {/* Animated Rose Gold Active Progress Line */}
                            <div
                              className="absolute top-1/2 left-5 -translate-y-1/2 h-[2.5px] bg-gradient-to-r from-[#bd8174] via-[#e2aba0] to-[#bd8174] rounded-full transition-all duration-500 ease-out hidden sm:block"
                              style={{
                                width: `calc(${(activeFaq / (faqItems.length - 1)) * 100}% * ((100% - 2.5rem) / 100%))`
                              }}
                            />

                            {/* Timeline Nodes 1 - 10 */}
                            <div className="relative z-10 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5 px-0.5">
                              {faqItems.map((item, idx) => {
                                const isActive = activeFaq === idx;
                                return (
                                  <button
                                    key={item.idx}
                                    onClick={() => setActiveFaq(idx)}
                                    className="group flex flex-col items-center gap-1 cursor-pointer outline-none focus:outline-none focus:ring-0 active:outline-none border-0 flex-shrink-0 transition-transform duration-200 hover:scale-105 select-none"
                                    style={{ WebkitTapHighlightColor: "transparent", outline: "none" }}
                                    title={`Question ${item.num}: ${item.question}`}
                                  >
                                    <div
                                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-display-lg text-[11px] font-bold transition-all duration-300 ${isActive
                                        ? "bg-gradient-to-br from-[#ffffff] via-[#f7e6dc] to-[#e2b0a4] text-[#4d281d] border-2 border-[#bd8174] shadow-[0_0_14px_rgba(189,129,116,0.8)] scale-110 ring-2 ring-[#bd8174]/40"
                                        : "bg-[#f5e3d7] border border-[#bd8174]/50 text-[#6a3d30] group-hover:bg-[#faede4] group-hover:text-[#4d281d] group-hover:shadow-[0_0_8px_rgba(189,129,116,0.3)]"
                                        }`}
                                    >
                                      {item.num}
                                    </div>
                                    <span
                                      className={`text-[8px] md:text-[9px] uppercase font-extrabold tracking-wider transition-colors duration-200 ${isActive ? "text-[#4d281d]" : "text-[#7a493b] group-hover:text-[#4d281d]"
                                        }`}
                                    >
                                      Q{item.num}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Active Question & Answer Brown Milk Glass Display Card */}
                          <div
                            style={{
                              /* Inner Brown Milk (Bisa diatur warna / kepekatannya di sini) */
                              background: "linear-gradient(135deg, rgba(236, 218, 206, 0.96) 0%, rgba(220, 196, 180, 0.92) 50%, rgba(229, 209, 195, 0.97) 100%)",
                              boxShadow: "0 12px 35px rgba(189, 129, 116, 0.22), inset 0 1.5px 2px rgba(255, 255, 255, 0.85)",
                            }}
                            className="border-2 border-[#bd8174] rounded-xl p-4 md:p-5 backdrop-blur-2xl transition-all duration-300"
                          >
                            {/* Header Badge */}
                            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#bd8174]/30">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#bd8174]/20 border border-[#bd8174]/60 text-[#4d281d] text-[10px] font-bold tracking-wider uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#bd8174] animate-pulse" />
                                Question {currentItem.num} of 10
                              </div>
                            </div>

                            {/* Question Title */}
                            <h3
                              className="mt-3 font-display-lg text-sm md:text-lg text-[#4d281d] font-bold leading-relaxed tracking-tight"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {currentItem.question}
                            </h3>

                            {/* Answer Box */}
                            <div className="mt-3 pl-3 border-l-3 border-[#bd8174] bg-[#fffaf6]/85 py-2.5 px-3.5 rounded-r-lg shadow-xs">
                              <p className="font-sans text-[11.5px] md:text-xs text-[#542d20] leading-relaxed font-medium">
                                {currentItem.answer}
                              </p>
                            </div>

                            {/* Navigation Controls */}
                            <div className="mt-4 pt-3 border-t border-[#bd8174]/30 flex items-center justify-between gap-3">
                              <button
                                onClick={() => setActiveFaq(Math.max(0, activeFaq - 1))}
                                disabled={activeFaq === 0}
                                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 group ${activeFaq === 0
                                  ? "opacity-40 cursor-not-allowed text-[#8f6456] border border-[#bd8174]/40 bg-white/40"
                                  : "bg-gradient-to-r from-[#ffffff] via-[#faede4] to-[#f4dfd2] text-[#4d281d] border-2 border-[#bd8174] shadow-[0_2px_10px_rgba(189,129,116,0.22)] hover:shadow-[0_4px_15px_rgba(189,129,116,0.38)] hover:scale-105 active:scale-95 cursor-pointer"
                                  }`}
                              >
                                <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" viewBox="0 0 24 24" fill="none">
                                  <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="#4d281d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Previous
                              </button>

                              {/* Indicator step dots */}
                              <div className="hidden sm:flex items-center gap-1.5">
                                {faqItems.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setActiveFaq(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeFaq === i
                                      ? "w-4 bg-gradient-to-r from-[#e2b0a4] to-[#ffd0ab]"
                                      : "w-1.5 bg-[#e2b0a4]/40 hover:bg-[#e2b0a4]"
                                      }`}
                                  />
                                ))}
                              </div>

                              <button
                                onClick={() => setActiveFaq(Math.min(faqItems.length - 1, activeFaq + 1))}
                                disabled={activeFaq === faqItems.length - 1}
                                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 group ${activeFaq === faqItems.length - 1
                                  ? "opacity-40 cursor-not-allowed text-[#8f6456] border border-[#bd8174]/40 bg-white/40"
                                  : "bg-gradient-to-r from-[#ffffff] via-[#faede4] to-[#f4dfd2] text-[#4d281d] border-2 border-[#bd8174] shadow-[0_2px_10px_rgba(189,129,116,0.22)] hover:shadow-[0_4px_15px_rgba(189,129,116,0.38)] hover:scale-105 active:scale-95 cursor-pointer"
                                  }`}
                              >
                                Next
                                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300 shrink-0" viewBox="0 0 24 24" fill="none">
                                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#4d281d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </section>

              {/* Section 5: Feedbacks / Testimonials Section */}
              <section className="py-16 px-6 relative z-10">
                {/* CSS Keyframes for falling glitters */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                  @keyframes glitter-fall {
                    0% {
                      transform: translateY(-20px) rotate(0deg);
                      opacity: 0;
                    }
                    10% {
                      opacity: 0.9;
                    }
                    90% {
                      opacity: 0.9;
                    }
                    100% {
                      transform: translateY(780px) rotate(360deg);
                      opacity: 0;
                    }
                  }
                `}} />

                {/* Glitter Particles (Snowfall) */}
                {TESTIMONIAL_GLITTERS.map((p, idx) => (
                  <div
                    key={idx}
                    className="absolute pointer-events-none rounded-full bg-gradient-to-br from-[#dfa38f] via-[#f5b8c9] to-[#ffd0ab]"
                    style={{
                      left: p.left,
                      top: '-20px',
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      animation: `glitter-fall ${p.duration} linear infinite`,
                      animationDelay: p.delay,
                      boxShadow: `0 0 10px rgba(245, 184, 201, 0.9), 0 0 4px rgba(223, 163, 143, 0.6)`,
                      zIndex: 1
                    }}
                  />
                ))}


                {/* 1 Master Outer Rose Gold Outline Border Wrapping ALL of Students Feedbacks */}
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(251, 248, 245, 0.35) 0%, rgba(251, 248, 245, 0.05) 50%, rgba(251, 248, 245, 0) 100%)",
                    border: "2px solid #bd8174",
                    boxShadow: "0 0 14px rgba(189, 129, 116, 0.35), 0 10px 30px rgba(160,110,95,0.1)",
                  }}
                  className="max-w-[1100px] mx-auto p-7 md:p-9 rounded-[32px] space-y-10 relative z-10"
                >
                  {/* Header */}
                  <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                    <h2 className="font-display-lg text-2xl md:text-3xl lg:text-4xl text-[#5c3328] font-bold leading-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.7)]">
                      Students Feedbacks
                    </h2>
                    <p className="font-sans text-xs md:text-sm text-[#7a4b3d] font-semibold leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
                      Discover how pianists of all backgrounds found their creative freedom and built a solid foundation with Stephanie Keys.
                    </p>
                  </div>

                  {/* Testimonial Cards Grid (Inner cards bolong / transparent, no background color) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Sarah Jenkins",
                        role: "Worship Keyboardist",
                        date: "June 14, 2025",
                        stars: 5,
                        comment:
                          "I was stuck relying 100% on sheet music for years. Stephanie Keys taught me how to actually listen to chords and play by ear. Within 3 months, I was playing worship songs at my church without any paper!",
                        avatar:
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                      },
                      {
                        name: "David Chen",
                        role: "Jazz Enthusiast",
                        date: "August 2, 2025",
                        stars: 5,
                        comment:
                          "The jazz and gospel progressions taught in the genres section are gold. The way chords are broken down step-by-step made complex voicings feel so simple. Incredible course!",
                        avatar:
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                      },
                      {
                        name: "Jessica Taylor",
                        role: "Classical & Gospel Player",
                        date: "September 28, 2025",
                        stars: 5,
                        comment:
                          "I used to feel so anxious trying to improvise on the spot. Now, the music just flows. It's truly helped me connect my faith with my playing. Highly recommend Stephanie Keys!",
                        avatar:
                          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1.5px solid #bd8174",
                          boxShadow: "0 0 8px rgba(189, 129, 116, 0.2)",
                        }}
                        className="relative overflow-hidden p-6 rounded-[22px] bg-[#FBF8F5] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c48b7c] hover:bg-white flex flex-col justify-between gap-5 group cursor-pointer"
                      >
                        <div className="space-y-3 relative z-10">
                          {/* Comment */}
                          <p className="font-sans text-xs md:text-[12.5px] text-[#5c3328] leading-relaxed italic font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                            "{item.comment}"
                          </p>
                        </div>

                        {/* Profile Details */}
                        <div className="flex items-center gap-3 pt-3.5 border-t-2 border-[#e2b0a4]/60 mt-auto relative z-10">
                          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#e2b0a4] bg-[#f4ebe6] shrink-0 shadow-xs">
                            <img
                              className="w-full h-full object-cover"
                              src={item.avatar}
                              alt={item.name}
                            />
                          </div>
                          <div>
                            <h4 className="font-sans text-xs font-bold text-[#5c3328] leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                              {item.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5 text-[10px] text-[#7a4b3d] font-bold font-sans">
                              <span>{item.role}</span>
                              <span className="text-[#d48b78]">•</span>
                              <span>{item.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Bottom White Soft Fade Gradient Overlay (fading upwards) */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#faf5f0] via-[#faf5f0]/75 to-transparent z-0 pointer-events-none" />
              </section>
            </div>

            {/* Double Glossy Rose-Gold Divider Lines between Students Feedbacks & Start Your Musical Journey */}
            <div className="w-full z-20 relative flex flex-col gap-[2px]">
              {/* Garis Pertama */}
              <div className="w-full h-[1.5px] bg-gradient-to-r from-[#bd8174] via-[#e2aba0] via-[#f0c3b7] to-[#bd8174] opacity-90" />
              {/* Garis Kedua (Jarak dekat di bawahnya) */}
              <div className="w-full h-[1px] bg-gradient-to-r from-[#bd8174] via-[#e2aba0] via-[#f0c3b7] to-[#bd8174] opacity-75" />
            </div>

            {/* Section 6: Dedicated Background Container for Start Your Musical Journey (Focused Piano Keys Background) */}
            <div className="relative overflow-hidden bg-[#faf5f0] flex-grow flex flex-col">
              {/* Zoomed Background Layer focusing EXCLUSIVELY on Piano Keys (No Wooden Frame) */}
              <div
                className="absolute inset-0 z-0 pointer-events-none select-none"
                style={{
                  backgroundImage: "url('/piano%20tuts.png')",
                  backgroundSize: "200%",
                  backgroundPosition: "45% 58%",
                  backgroundRepeat: "no-repeat",
                  filter: "sepia(0.35) saturate(0.40) hue-rotate(-30deg) brightness(0.95)",
                }}
              />
              {/* Overlay Brown Tone (Dibuat dikit banget lebih pink / rosy-mahogany wood) */}
              {/* Bisa Anda atur warna atau kepekatannya langsung di sini */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(126, 68, 60, 0.34) 0%, rgba(118, 62, 54, 0.37) 100%)",
                }}
              />
              {/* Smooth Medium White Gradient from Top (Menghaluskan area judul 'Start Your Musical Journey') */}
              <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/90 via-white/50 to-transparent z-0 pointer-events-none" />

              {/* Pricing Section (Start Your Musical Journey) */}
              <section className="py-16 lg:py-24 px-4 md:px-6 relative z-10">
                <div className="relative z-10 max-w-[1020px] mx-auto space-y-7 w-full">
                  {/* Section Header */}
                  <div className="text-center space-y-1.5 max-w-xl mx-auto">
                    <h2 className="font-display-lg text-xl md:text-2xl lg:text-3xl text-[#5c3328] font-bold leading-tight">
                      Start Your Musical Journey
                    </h2>
                    <p className="text-[#8a5a4c] font-sans text-[11px] md:text-xs font-extrabold uppercase tracking-widest">
                      Choose the plan that fits your pace of learning.
                    </p>
                  </div>

                  {/* 3-Column Grid: Feature List on Left, Monthly Card in Middle, Annual Card on Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch w-full">

                    {/* Left Column: Included in Every Plan */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(253, 245, 238, 0.88) 50%, rgba(255, 250, 246, 0.95) 100%)",
                        boxShadow:
                          "0 12px 32px rgba(116, 66, 50, 0.16), 0 2px 10px rgba(226, 176, 164, 0.18), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)",
                      }}
                      className="lg:col-span-4 backdrop-blur-2xl rounded-[20px] p-4.5 lg:p-5 border-2 border-[#e2b0a4]/80 shadow-md flex flex-col justify-between text-left"
                    >
                      <div className="space-y-4">
                        <div>
                          <span className="font-sans text-[9px] font-black uppercase tracking-[0.18em] text-[#7a4b3d] bg-[#f8e3db] border border-[#e2b0a4]/60 px-2.5 py-0.5 rounded-full inline-block mb-1.5 shadow-xs">
                            Included in Every Plan
                          </span>
                          <h3 className="font-display-lg text-lg font-bold text-[#7a4b3d]">
                            Full Access Pass
                          </h3>
                          <p className="text-[11px] text-[#8d5d4f] font-medium mt-0.5 leading-relaxed">
                            Get immediate access to everything Stephanie Keys has to offer with no restrictions.
                          </p>
                        </div>

                        {/* Feature Items List */}
                        <div className="space-y-2.5 pt-0.5">
                          {[
                            { title: "All Courses Access", desc: "Complete video library & roadmap" },
                            { title: "Live Group Coaching", desc: "Interactive monthly Q&A sessions" },
                            { title: "Sheet Music Library", desc: "Downloadable PDF charts & guides" },
                            { title: "Community Forum", desc: "Connect with fellow pianists" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-4.5 h-4.5 rounded-full bg-[#f8e3db] border border-[#e2b0a4]/80 text-[#7a4b3d] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <svg className="w-2.5 h-2.5 text-[#7a4b3d]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[#7a4b3d] block leading-snug">
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-[#8d5d4f] font-medium block">
                                  {item.desc}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#e2b0a4]/30 mt-4">
                        <p className="text-[10px] text-[#8a5a4c] font-bold italic text-center">
                          Cancel anytime with 1-click in account settings.
                        </p>
                      </div>
                    </div>

                    {/* Middle Column: Monthly Plan Card */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(253, 245, 238, 0.88) 50%, rgba(255, 250, 246, 0.95) 100%)",
                        boxShadow:
                          "0 12px 32px rgba(116, 66, 50, 0.16), 0 2px 10px rgba(226, 176, 164, 0.18), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)",
                      }}
                      className="lg:col-span-4 backdrop-blur-2xl rounded-[20px] p-4.5 lg:p-5 border-2 border-[#e2b0a4]/80 transition-all duration-300 hover:border-[#ffd0ab] hover:bg-white/95 flex flex-col justify-between text-left"
                    >
                      <div className="space-y-4">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[9px] font-black uppercase tracking-[0.18em] text-[#7a4b3d] bg-[#f8e3db] border border-[#e2b0a4]/60 px-2.5 py-0.5 rounded-full inline-block shadow-xs">
                            Flexible Monthly
                          </span>
                          <h3 className="font-display-lg text-lg font-bold text-[#7a4b3d] tracking-tight mt-0.5">
                            Monthly Plan
                          </h3>
                        </div>

                        <div className="space-y-0.5">
                          <div className="text-2xl lg:text-3xl font-sans font-bold tracking-tight text-[#7a4b3d]">
                            $18.99 <span className="text-xs font-medium text-[#8d5d4f]">/ month</span>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <span className="font-sans text-[11px] font-bold text-[#8a5a4c] block">
                            Free 14-Day Trial
                          </span>
                          <p className="text-[11px] text-[#8d5d4f] font-medium leading-normal">
                            Billed monthly after trial ends. Cancel anytime.
                          </p>
                        </div>

                        {/* Included Perks in Card */}
                        <div className="space-y-2 pt-2.5 border-t border-[#e2b0a4]/30">
                          {[
                            "Unlimited Video Lessons Access",
                            "Downloadable Practice Sheets",
                            "Monthly Live Q&A Sessions",
                            "Full 14-Day Trial Guarantee",
                          ].map((perk, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] text-[#7a4b3d]">
                              <span className="w-3.5 h-3.5 rounded-full bg-[#f8e3db] border border-[#e2b0a4]/60 text-[#7a4b3d] flex items-center justify-center text-[9px] shrink-0 font-bold">✓</span>
                              <span className="font-semibold text-[#805244]">{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-3">
                        <button
                          onClick={() => setView("dashboard")}
                          className="w-full py-2.5 px-3 rounded-full font-sans text-xs font-extrabold text-[#5c3a30] bg-gradient-to-r from-[#fff5f2] via-[#ffd0ab] to-[#e2b0a4] hover:brightness-105 border border-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center"
                        >
                          Start 14-Day Free Trial
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Annual Plan Card (Featured Best Value) */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 245, 238, 0.92) 50%, rgba(255, 250, 246, 0.97) 100%)",
                        boxShadow:
                          "0 14px 38px rgba(116, 66, 50, 0.22), 0 2px 12px rgba(226, 176, 164, 0.24), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)",
                      }}
                      className="lg:col-span-4 backdrop-blur-2xl rounded-[20px] p-4.5 lg:p-5 border-2 border-[#d48b78] transition-all duration-300 flex flex-col justify-between text-left relative"
                    >
                      {/* Badge */}
                      <div className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#ffd0ab] via-[#e2b0a4] to-[#c48b7c] text-[#4d2d22] font-sans text-[9px] font-black uppercase tracking-wider shadow-sm">
                        Best Value
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[9px] font-black uppercase tracking-[0.18em] text-[#7a4b3d] bg-[#f8e3db] border border-[#e2b0a4]/60 px-2.5 py-0.5 rounded-full inline-block shadow-xs">
                            Save Over 25%
                          </span>
                          <h3 className="font-display-lg text-lg font-bold text-[#7a4b3d] tracking-tight mt-0.5">
                            Annual Plan
                          </h3>
                        </div>

                        <div className="space-y-0.5">
                          <div className="text-2xl lg:text-3xl font-sans font-bold tracking-tight text-[#7a4b3d]">
                            $14.16 <span className="text-xs font-medium text-[#8d5d4f]">/ month</span>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <span className="font-sans text-[11px] font-bold text-[#8a5a4c] block">
                            Free 14-Day Trial
                          </span>
                          <p className="text-[11px] text-[#8d5d4f] font-medium leading-normal">
                            Billed annually at $169.99 after trial ends.
                          </p>
                        </div>

                        {/* Included Perks in Card */}
                        <div className="space-y-2 pt-2.5 border-t border-[#e2b0a4]/30">
                          {[
                            "All Monthly Perks Included",
                            "Save Over 25% Every Year",
                            "Unlimited Sheet Music & PDFs",
                            "Priority Community & Live Q&A",
                          ].map((perk, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] text-[#7a4b3d]">
                              <span className="w-3.5 h-3.5 rounded-full bg-[#e2b0a4] text-[#4d2d22] flex items-center justify-center text-[9px] shrink-0 font-extrabold">✓</span>
                              <span className="font-bold text-[#7a4b3d]">{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-3">
                        <button
                          onClick={() => setView("dashboard")}
                          className="w-full py-2.5 px-3 rounded-full font-sans text-xs font-extrabold text-[#4d2d22] bg-gradient-to-r from-[#fff0eb] via-[#ffd0ab] to-[#e2b0a4] hover:brightness-105 border border-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center"
                        >
                          Start 14-Day Free Trial
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </section>
            </div>
          </>
        );
    }
  };

  return (
    <Layout view={view} onNavigate={setView}>
      {renderContent()}
    </Layout>
  );
}

export default Homepage;
