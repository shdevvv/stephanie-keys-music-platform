import { useState, useEffect, useRef } from "react";
import Layout, { type ViewType } from "./layout";
import CoversSheets from "./coversSheets";
import Dashboard from "./dashboard";
import Courses from "./courses";
import LiveSessions from "./liveSessions";
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

const videoList = [
  "/videos/cathedral1.mp4",
  "/videos/cave.mp4",
];

const WELCOME_SPARKLES = [
  { left: "5%", size: 11, delay: "0s", duration: "9s" },
  { left: "12%", size: 15, delay: "3s", duration: "11s" },
  { left: "19%", size: 9, delay: "1.5s", duration: "8s" },
  { left: "26%", size: 13, delay: "5s", duration: "10s" },
  { left: "32%", size: 10, delay: "2s", duration: "12s" },
  { left: "38%", size: 18, delay: "0.5s", duration: "9s" },
  { left: "44%", size: 9, delay: "4s", duration: "8s" },
  { left: "50%", size: 13, delay: "2.5s", duration: "10s" },
  { left: "56%", size: 15, delay: "6s", duration: "13s" },
  { left: "62%", size: 11, delay: "1s", duration: "9s" },
  { left: "68%", size: 14, delay: "4.5s", duration: "10s" },
  { left: "74%", size: 10, delay: "7s", duration: "9s" },
  { left: "80%", size: 12, delay: "5.5s", duration: "12s" },
  { left: "86%", size: 16, delay: "1.8s", duration: "9.5s" },
  { left: "93%", size: 11, delay: "3.2s", duration: "11.5s" },
  { left: "9%", size: 12, delay: "2.2s", duration: "8.5s" },
  { left: "22%", size: 16, delay: "4.1s", duration: "10.5s" },
  { left: "36%", size: 9, delay: "0.8s", duration: "7.5s" },
  { left: "47%", size: 14, delay: "3.7s", duration: "9.8s" },
  { left: "60%", size: 13, delay: "1.9s", duration: "11.2s" },
  { left: "71%", size: 19, delay: "5.2s", duration: "8.8s" },
  { left: "83%", size: 11, delay: "2.8s", duration: "12.5s" },
  { left: "90%", size: 15, delay: "4.8s", duration: "10.2s" },
  { left: "15%", size: 10, delay: "6.5s", duration: "9.2s" },
  { left: "29%", size: 13, delay: "0.3s", duration: "11.8s" },
  { left: "53%", size: 16, delay: "3.1s", duration: "8.3s" },
  { left: "65%", size: 10, delay: "5.9s", duration: "10.7s" },
  { left: "77%", size: 14, delay: "1.2s", duration: "9.0s" },
];

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


  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [prevVideoIdx, setPrevVideoIdx] = useState<number | null>(null);

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

  useEffect(() => {
    const videoTimer = setInterval(() => {
      setPrevVideoIdx(currentVideoIdx);
      setCurrentVideoIdx((prev) => (prev + 1) % videoList.length);
    }, 7000); // Switch video every 7 seconds
    return () => clearInterval(videoTimer);
  }, [currentVideoIdx]);


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
      case "sessions":
        return <LiveSessions />;
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
            {/* Hero Section */}
            <section className="relative min-h-[600px] lg:min-h-0 lg:aspect-[16/9] flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#fff8f6] via-[#fff8f6]/80 to-transparent z-10"></div>
                <img
                  className="w-full h-full object-cover object-right"
                  alt="A white grand piano in a sun-drenched luxury minimalist studio"
                  src="/white-grand-piano-hero.jpg"
                />
              </div>
              <div className="relative z-20 px-6 max-w-[1200px] mx-auto w-full">
                <div className="max-w-2xl space-y-8">
                  <h1 className="font-curvy-vibes text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-[#5a453d] to-[#8b7368] bg-clip-text text-transparent leading-tight py-2">
                    Learn Gospel, Jazz, and Classical Piano Step by Step
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg font-medium text-[#4f4540] leading-relaxed max-w-xl">
                    Transform your playing with a step-by-step method that takes
                    you from beginner to advanced.
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setView("dashboard")}
                      className="bg-gradient-to-br from-[#dcc1b5] to-[#f9ddd1] text-[#271811] px-8 py-4 rounded-xl font-bold text-sm md:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-none"
                    >
                      Start Learning
                    </button>
                    <button
                      onClick={() => setView("videos")}
                      className="border-2 border-[#b5a39a] text-[#4a372e] px-8 py-4 rounded-xl font-bold text-sm md:text-base hover:bg-[#e8cdc1]/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer bg-transparent"
                    >
                      Watch S Keys Videos
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Current Musical Limitations Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-[#dfa38f] via-[#5c4033] to-[#251610] border-y border-[#251610]/30 relative overflow-hidden">
              {/* Background Image Layer */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none select-none"
                style={{
                  backgroundImage: "url('/keys.png')",
                  opacity: 0.22,
                }}
              />
              <div className="relative z-10 max-w-[1200px] mx-auto space-y-12">
                {/* Centered Editorial Intro */}
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="font-curvy-vibes text-4xl md:text-5xl lg:text-6xl text-white leading-normal py-1 drop-shadow-sm">
                    Feeling stuck on the piano?
                  </h2>
                </div>

                {/* 5-Column Grid Card Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    {
                      title: "Melodic Stagnation",
                      desc: "Finding it hard to create melodies on the spot.",
                    },
                    {
                      title: "Sheet Music Dependency",
                      desc: "Relying too much on sheet music to play.",
                    },
                    {
                      title: "Harmonic Limitations",
                      desc: "Having limited knowledge of chords, scales, and harmony.",
                    },
                    {
                      title: "Translational Deficit",
                      desc: "Not knowing how to turn musical ideas into sound.",
                    },
                    {
                      title: "Improvisational Anxiety",
                      desc: "Feeling unsure when improvising creatively at the piano.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 border border-white/45 p-5 rounded-2xl shadow-sm hover-move flex flex-col gap-3 text-center min-h-[160px] justify-center cursor-pointer"
                    >
                      <h4 className="font-bold text-xs md:text-sm text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] md:text-xs text-white/80 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Faith, Creativity, and Technique Section (Merged Background with Crystal Heaven Vibes & Looping Video) */}
            <section className="py-24 px-6 bg-gradient-to-b from-white to-[#fff3ef] border-b border-[#ebd3cb]/30 overflow-hidden relative">
              {/* Background Video Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
                {/* Tone matching color overlay (Adjust color and opacity here) */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none mix-blend-color"
                  style={{
                    backgroundColor: "#5a453d", // Warm dark brown theme color
                    opacity: 0.08, // Adjustable overlay color strength
                  }}
                />
                {/* Readability softening overlay - warm soft peach/champagne gradient to tint the background */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom, rgba(255, 235, 228, 0.45) 0%, rgba(255, 220, 205, 0.35) 100%)",
                  }}
                />

                {/* Videos Container (Increased video background opacity for better visibility) */}
                <div className="w-full h-full opacity-[0.88]">
                  {videoList.map((src, idx) => {
                    const isActive = idx === currentVideoIdx;
                    const isPrev = idx === prevVideoIdx;

                    return (
                      <video
                        key={src}
                        ref={(el) => {
                          if (el) {
                            if (isActive || isPrev) {
                              el.play().catch(() => { });
                            } else {
                              el.pause();
                            }
                          }
                        }}
                        src={src}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
                        style={{
                          filter: "sepia(30%) hue-rotate(345deg) saturate(112%) brightness(96%) contrast(100%)",
                          zIndex: isActive ? 20 : isPrev ? 10 : 0,
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Decorative glowing 3D crystal heaven-like orbs for a peaceful, calm, royal ambiance */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[550px] h-[320px] bg-white/45 rounded-full blur-[140px] opacity-90"></div>
              </div>

              <div className="relative z-20 max-w-[1200px] mx-auto flex flex-col items-center">
                {/* Unified Glassmorphic Canvas Card */}
                <div className="w-full max-w-3xl bg-white/45 backdrop-blur-lg border border-white/60 p-8 md:p-12 rounded-3xl shadow-sm space-y-10 text-center">

                  {/* Quote Block */}
                  <div className="space-y-4">
                    <p className="font-display-lg text-lg md:text-xl lg:text-2xl italic text-[#5a453d] leading-relaxed font-bold">
                      "You’re already in the right place where God-given
                      creativity can grow, and music becomes a way to express joy,
                      faith, and purpose."
                    </p>
                  </div>

                  {/* Elegant Glossy Rose Gold Gradient Divider */}
                  <div className="h-[2px] w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-[#c58b73] via-[#dfa38f] via-[#c58b73] to-transparent rounded-full" />

                  {/* Checklist Block */}
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="py-1">
                      <h3 className="font-sans text-xs md:text-sm text-[#7c6a60] font-bold uppercase tracking-widest">
                        You will be able to:
                      </h3>
                    </div>

                    <div className="w-full max-w-md mx-auto">
                      <ul className="flex flex-col gap-3 list-none p-0 m-0 text-left">
                        {[
                          "Play what you hear",
                          "Worship without limitation",
                          "Express the music already inside you",
                          "Grow in confidence at the piano",
                          "Use your gift to serve others",
                        ].map((text, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-4 py-3.5 px-5 rounded-2xl border border-[#dfa38f]/30 bg-white/20 transition-all duration-250 hover:bg-white/85 hover:border-white hover:scale-[1.02] hover:shadow-md cursor-pointer"
                          >
                            {/* Premium Gold/Bronze Gradient Check Circle */}
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffd89b] to-[#c98d4c] text-white flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(201,141,76,0.15)]">
                              <span className="material-symbols-outlined text-xs select-none font-bold">
                                check
                              </span>
                            </div>
                            <span className="font-sans text-sm md:text-base lg:text-lg font-bold text-[#5a453d]">
                              {text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </section>


            <section className="py-24 px-6 border-b border-[#ebd3cb]/25 relative overflow-hidden">
              {/* Background Marble Image Layer with smooth fade-in mask at the top */}
              <div
                className="absolute inset-0 z-0 pointer-events-none select-none opacity-100"
                style={{
                  backgroundImage: "url('/marble.png')",
                  backgroundSize: "180%",
                  backgroundPosition: "center -360px",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 30px)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30px)",
                  filter: "hue-rotate(-14deg) saturate(75%)",
                }}
              />
              {/* Soft overlay with a white-to-soft-whitish-peach-pink blend */}
              <div
                className="absolute inset-0 z-10 bg-gradient-to-b from-[#fff6f3] via-white/20 to-[#fff2ee]/10 pointer-events-none select-none"
              />

              {/* Floating Sparkling Elements (Moving from bottom to top, glossy gold stars with warm glows) */}
              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes sparkleFloat {
                  0% {
                    transform: translateY(0) scale(0) rotate(0deg);
                    opacity: 0;
                  }
                  10% {
                    opacity: 0.9;
                    transform: translateY(-80px) scale(1) rotate(30deg);
                  }
                  90% {
                    opacity: 0.9;
                  }
                  100% {
                    transform: translateY(-650px) scale(0.2) rotate(220deg);
                    opacity: 0;
                  }
                }
                .animate-sparkle-float {
                  animation-name: sparkleFloat;
                }
              `}} />
              <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
                {WELCOME_SPARKLES.map((spark, idx) => (
                  <svg
                    key={idx}
                    viewBox="0 0 24 24"
                    fill="white"
                    className="absolute animate-sparkle-float opacity-0"
                    style={{
                      left: spark.left,
                      width: `${spark.size}px`,
                      height: `${spark.size}px`,
                      bottom: "-20px",
                      animationDelay: spark.delay,
                      animationDuration: spark.duration,
                      animationIterationCount: "infinite",
                      animationTimingFunction: "linear",
                      filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.65))",
                    }}
                  >
                    <path d="M12,0 L15,9 L24,12 L15,15 L12,24 L9,15 L0,12 L9,9 Z" />
                  </svg>
                ))}
              </div>
              <div className="relative z-20 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left Column: Text & Timeline Stepper */}
                <div className="lg:col-span-7 space-y-10 text-left max-w-xl mx-auto lg:mx-0 relative z-10">
                  <div className="space-y-3 pl-2">
                    <h2 className="font-display-lg text-3xl md:text-4xl lg:text-5xl text-[#3d251c] font-black leading-tight tracking-tight">
                      Welcome to Stephanie Keys.
                    </h2>
                    <p className="font-sans text-[10px] md:text-xs text-[#a27866] font-bold uppercase tracking-[0.2em] block">
                      Your core focus
                    </p>
                  </div>

                  {/* Vertical Timeline Stepper */}
                  <div className="relative text-left w-full mt-8">
                    {/* Step 1: Music Foundation */}
                    <div className="relative flex items-start gap-6 pb-10 group">
                      {/* Line segment from Circle 1 center to bottom of Step 1 container (connecting directly to Step 2 top) */}
                      <div className="absolute left-[20px] md:left-[24px] top-[20px] md:top-[24px] bottom-0 w-[2px] bg-gradient-to-b from-[#cda195]/20 to-[#cda195]/40 -translate-x-1/2"></div>

                      <div className="relative z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#cda195]/50 text-[#cda195] flex-shrink-0 shadow-[0_4px_12px_rgba(205,161,149,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#cda195] group-hover:shadow-[0_6px_16px_rgba(205,161,149,0.3)]">
                        <span className="material-symbols-outlined text-lg md:text-xl select-none font-medium drop-shadow-[0_1px_3px_rgba(201,141,128,0.25)]">
                          widgets
                        </span>
                      </div>

                      {/* Individual Glassmorphic Card for Step 1 */}
                      <div className="flex-grow bg-white/45 backdrop-blur-md border border-white/50 rounded-2xl p-5 md:p-6 shadow-[0_8px_30px_rgba(205,161,149,0.03)] transition-all duration-300 hover:bg-white/65 hover:border-[#cda195]/40 hover:shadow-[0_12px_35px_rgba(205,161,149,0.08)] group-hover:translate-x-1">
                        <h3 className="font-display-lg text-lg md:text-xl font-bold text-[#3d251c] tracking-tight transition-colors duration-300 group-hover:text-[#a27866]">
                          Music Foundation
                        </h3>
                        <p className="font-sans text-xs md:text-sm text-[#5c4a41] leading-relaxed font-medium mt-2">
                          Master the core essentials of the keyboard. Learn the
                          fundamental rhythms, chords, scales, and music theory
                          required to build a rock-solid musical floor.
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Music Skills */}
                    <div className="relative flex items-start gap-6 pb-10 group">
                      {/* Line segment from top of Step 2 container (touching Step 1 line) to bottom of Step 2 (touching Circle 3 top) */}
                      <div className="absolute left-[20px] md:left-[24px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#cda195]/40 to-[#cda195]/30 -translate-x-1/2"></div>

                      <div className="relative z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#cda195]/50 text-[#cda195] flex-shrink-0 shadow-[0_4px_12px_rgba(205,161,149,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#cda195] group-hover:shadow-[0_6px_16px_rgba(205,161,149,0.3)]">
                        <span className="material-symbols-outlined text-lg md:text-xl select-none font-medium drop-shadow-[0_1px_3px_rgba(201,141,128,0.25)]">
                          music_note
                        </span>
                      </div>

                      {/* Individual Glassmorphic Card for Step 2 */}
                      <div className="flex-grow bg-white/45 backdrop-blur-md border border-white/50 rounded-2xl p-5 md:p-6 shadow-[0_8px_30px_rgba(205,161,149,0.03)] transition-all duration-300 hover:bg-white/65 hover:border-[#cda195]/40 hover:shadow-[0_12px_35px_rgba(205,161,149,0.08)] group-hover:translate-x-1">
                        <h3 className="font-display-lg text-lg md:text-xl font-bold text-[#3d251c] tracking-tight transition-colors duration-300 group-hover:text-[#a27866]">
                          Music Skills
                        </h3>
                        <p className="font-sans text-xs md:text-sm text-[#5c4a41] leading-relaxed font-medium mt-2">
                          Unlock your creative freedom. Develop advanced skills in
                          practical improvisation, rich chord voicings, harmonic
                          progressions, and the art of reharmonization.
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Music Genres */}
                    <div className="relative flex items-start gap-6 group">
                      {/* NO LINE SEGMENT AT ALL for Step 3 - so the line stops exactly at the top of Circle 3! */}
                      <div className="relative z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#cda195]/50 text-[#cda195] flex-shrink-0 shadow-[0_4px_12px_rgba(205,161,149,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#cda195] group-hover:shadow-[0_6px_16px_rgba(205,161,149,0.3)]">
                        <span className="material-symbols-outlined text-lg md:text-xl select-none font-medium drop-shadow-[0_1px_3px_rgba(201,141,128,0.25)]">
                          equalizer
                        </span>
                      </div>

                      {/* Individual Glassmorphic Card for Step 3 */}
                      <div className="flex-grow bg-white/45 backdrop-blur-md border border-white/50 rounded-2xl p-5 md:p-6 shadow-[0_8px_30px_rgba(205,161,149,0.03)] transition-all duration-300 hover:bg-white/65 hover:border-[#cda195]/40 hover:shadow-[0_12px_35px_rgba(205,161,149,0.08)] group-hover:translate-x-1">
                        <h3 className="font-display-lg text-lg md:text-xl font-bold text-[#3d251c] tracking-tight transition-colors duration-300 group-hover:text-[#a27866]">
                          Music Genres
                        </h3>
                        <p className="font-sans text-xs md:text-sm text-[#5c4a41] leading-relaxed font-medium mt-2">
                          Bring the music to life. Apply your foundations and
                          skills across a diverse range of genres, from the deep
                          roots of blues, gospel, christian music, and R&B to the
                          complex worlds of jazz swing, smooth jazz, bebop, funk,
                          and classic performance styles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Glowing 3D Piano Keys */}
                <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-[450px] flex justify-center lg:justify-end items-end z-0">
                  {/* Ambient light glow */}
                  <div className="absolute w-72 h-72 bg-[#ffd89b]/12 rounded-full blur-3xl right-0 bottom-0 z-0"></div>
                  {/* Soft floor shadow to ground the keys */}
                  <div className="absolute right-[-280px] bottom-[-265px] w-[420px] h-16 bg-[#5a453d]/20 rounded-full blur-2xl pointer-events-none transform rotate-[-22deg] z-0"></div>

                  {/* Crystalline keys image wrapper (Scaled significantly down to fit beautifully inside the 5-column space) */}
                  <div className="absolute right-[-380px] bottom-[-440px] w-[140%] sm:w-[110%] md:w-[90%] lg:w-[168%] max-w-none origin-bottom-right transform scale-125 lg:scale-145 z-10">
                    <img
                      className="w-full h-auto object-contain select-none"
                      alt="Glowing 3D crystalline piano keys"
                      src="/glowing-3d-piano-keys.png?v=2"
                      style={{
                        maskImage:
                          "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 55%)",
                        WebkitMaskImage:
                          "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 55%)",
                        filter: "drop-shadow(-15px 15px 25px rgba(90, 69, 61, 0.28))",
                      }}
                    />
                  </div>

                  {/* 3D Glass Floor Reflection (Mirrored, flipped vertically, blurred, and faded out) */}
                  <div className="absolute right-[-380px] bottom-[-675px] w-[140%] sm:w-[110%] md:w-[90%] lg:w-[168%] max-w-none origin-top-right transform scale-125 lg:scale-145 scale-y-[-1] opacity-25 blur-[1px] pointer-events-none z-0">
                    <img
                      className="w-full h-auto object-contain select-none"
                      alt="Glowing 3D crystalline piano keys reflection"
                      src="/glowing-3d-piano-keys.png?v=2"
                      style={{
                        maskImage:
                          "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 65%)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 65%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
            {/* Feedbacks / Testimonials Section (Clean Soft White-Brown Blend with Chocolate Cards) */}
            <section className="py-24 px-6 border-b border-[#ebd3cb]/15 relative overflow-hidden bg-gradient-to-b from-[#21110a] to-[#170a04]">
              {/* Background Palace Image Layer */}
              <div
                className="absolute inset-0 z-0 pointer-events-none select-none opacity-[0.35]"
                style={{
                  backgroundImage: "url('/palacey.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
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

              {/* Ambient decorative glowing blobs */}
              <div className="absolute top-12 left-1/4 w-72 h-72 bg-[#ffd89b]/12 rounded-full blur-[90px] pointer-events-none z-0"></div>
              <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-[#dfa38f]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

              <div className="max-w-[1200px] mx-auto space-y-16 relative z-10">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h2 className="font-display-lg text-3xl md:text-4xl text-[#fff0ea] font-bold leading-tight">
                    Students Feedbacks
                  </h2>
                  <p className="font-sans text-sm md:text-base text-[#ebd3c7]/80 leading-relaxed">
                    Discover how pianists of all backgrounds found their creative freedom and built a solid foundation with Stephanie Keys.
                  </p>
                </div>

                {/* Testimonial Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      name: "Sarah Jenkins",
                      role: "Worship Keyboardist",
                      date: "June 14, 2025",
                      stars: 5,
                      comment:
                        "I was stuck relying 100% on sheet music for years. Phanilie taught me how to actually listen to chords and play by ear. Within 3 months, I was playing worship songs at my church without any paper!",
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
                        "I used to feel so anxious trying to improvise on the spot. Now, the music just flows. It's truly helped me connect my faith with my playing. Highly recommend Phanilie!",
                      avatar:
                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden p-8 rounded-[24px] border-2 border-[#dfa38f] shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col justify-between gap-6 group cursor-pointer bg-transparent"
                    >
                      {/* Decorative quote mark */}
                      <span className="absolute top-1 right-6 text-6xl font-serif text-white/5 select-none group-hover:scale-105 transition-transform duration-300">
                        “
                      </span>

                      <div className="space-y-4 relative z-10">
                        {/* Rating Stars (Luxurious Rose-Bronze Gold) */}
                        <div className="flex gap-0.5 text-[#dfa38f]">
                          {[...Array(item.stars)].map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-base"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        {/* Comment */}
                        <p className="font-sans text-[13px] text-[#f4eae4] leading-relaxed italic">
                          "{item.comment}"
                        </p>
                      </div>

                      {/* Profile Details */}
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-auto relative z-10">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-zinc-800 shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src={item.avatar}
                            alt={item.name}
                          />
                        </div>
                        <div>
                          <h4 className="font-sans text-[13px] font-bold text-white leading-tight">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5 text-[10.5px] text-[#d5c2b7] font-sans">
                            <span>{item.role}</span>
                            <span className="text-[#dfa38f]">•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* About Mentor Section (Jonny May Style Full-Height Image Split Layout with Soft Parent Marble Background) */}
            <section
              className="bg-[#fffbf9] overflow-hidden border-b border-[#e5d5cd]/30 relative"
              style={{
                backgroundImage: "url('/mar.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* White overlay to soften the marble background texture across the entire section */}
              <div className="absolute inset-0 bg-white/65 pointer-events-none z-0" />

              <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px] relative z-10">
                {/* Left Column: Full-height Mentor Image */}
                <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-0 overflow-hidden">
                  <img
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="/profile-photo.jpg"
                    alt="Stephanie Halim - Mentor"
                  />
                </div>

                {/* Right Column: About Mentor Text with vertical alignment and paddings */}
                <div className="lg:col-span-7 py-16 lg:py-24 px-8 lg:px-16 flex flex-col justify-center text-left space-y-8">
                  <div>
                    <span className="font-curvy-vibes text-4xl text-[#cda195] block mb-1">
                      The Founder's Story
                    </span>
                    <h2 className="font-display-lg text-2xl md:text-3xl lg:text-4xl text-[#4a372e] font-bold leading-tight tracking-tight">
                      About Mentor
                    </h2>
                  </div>

                  <div className="space-y-5 font-sans text-sm md:text-base text-[#6e5a51] leading-relaxed">
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

                    <div className="pl-4 border-l-2 border-[#cda195] pt-1 pb-1">
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

            {/* What You Will Get Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-[#614639] via-[#543c31] to-[#664b3f] border-b border-[#ebd3cb]/15 text-center relative overflow-hidden">
              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes sparkleFloat1 {
                  0% { transform: translate(0, 15px) scale(0.3) rotate(0deg); opacity: 0; }
                  35% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 8px #ffd89b); }
                  75% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 8px #ffd89b); }
                  100% { transform: translate(10px, -45px) scale(0.85) rotate(90deg); opacity: 0; }
                }
                @keyframes sparkleFloat2 {
                  0% { transform: translate(0, 8px) scale(0.2) rotate(0deg); opacity: 0; }
                  50% { opacity: 1; filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 9px #ffffff); }
                  100% { transform: translate(-15px, -55px) scale(0.95) rotate(-120deg); opacity: 0; }
                }
                @keyframes sparkleFloat3 {
                  0% { transform: translate(0, 12px) scale(0.25) rotate(0deg); opacity: 0; }
                  30% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 7px #ffd89b); }
                  80% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 7px #ffd89b); }
                  100% { transform: translate(20px, -50px) scale(0.9) rotate(140deg); opacity: 0; }
                }
              `}} />

              {/* Background Strings Image Layer */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none select-none opacity-[0.08]"
                style={{
                  backgroundImage: "url('/strings.png')",
                }}
              />

              {/* Floating Sparkle Elements */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                {/* Sparkle 1 (Top Left) */}
                <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '10%', left: '5%', width: '10px', height: '10px', animation: 'sparkleFloat1 5s infinite ease-in-out' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 2 (Top Right) */}
                <svg className="absolute text-white fill-current" style={{ top: '15%', left: '92%', width: '8px', height: '8px', animation: 'sparkleFloat2 4s infinite ease-in-out', animationDelay: '1.2s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 3 (Mid Left) */}
                <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '25%', left: '12%', width: '12px', height: '12px', animation: 'sparkleFloat3 6s infinite ease-in-out', animationDelay: '0.5s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 4 (Mid Right) */}
                <svg className="absolute text-white fill-current" style={{ top: '32%', left: '88%', width: '9px', height: '9px', animation: 'sparkleFloat1 5.5s infinite ease-in-out', animationDelay: '2.0s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 5 (Bottom Left) */}
                <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '40%', left: '4%', width: '11px', height: '11px', animation: 'sparkleFloat2 4.8s infinite ease-in-out', animationDelay: '1.0s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 6 (Bottom Right) */}
                <svg className="absolute text-white fill-current" style={{ top: '48%', left: '94%', width: '8px', height: '8px', animation: 'sparkleFloat3 5.2s infinite ease-in-out', animationDelay: '2.5s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 7 (Top Mid-Left) */}
                <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '60%', left: '15%', width: '10px', height: '10px', animation: 'sparkleFloat1 6.2s infinite ease-in-out', animationDelay: '0.2s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 8 (Bottom Mid-Right) */}
                <svg className="absolute text-white fill-current" style={{ top: '65%', left: '85%', width: '12px', height: '12px', animation: 'sparkleFloat2 5s infinite ease-in-out', animationDelay: '1.8s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 9 */}
                <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '75%', left: '8%', width: '8px', height: '8px', animation: 'sparkleFloat3 4.5s infinite ease-in-out', animationDelay: '3.0s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 10 */}
                <svg className="absolute text-white fill-current" style={{ top: '85%', left: '90%', width: '11px', height: '11px', animation: 'sparkleFloat1 5.8s infinite ease-in-out', animationDelay: '0.7s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 11 */}
                <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '8%', left: '30%', width: '9px', height: '9px', animation: 'sparkleFloat2 6.5s infinite ease-in-out', animationDelay: '2.2s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 12 */}
                <svg className="absolute text-white fill-current" style={{ top: '18%', left: '70%', width: '10px', height: '10px', animation: 'sparkleFloat3 5.4s infinite ease-in-out', animationDelay: '0.9s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 13 */}
                <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '78%', left: '25%', width: '12px', height: '12px', animation: 'sparkleFloat1 5.2s infinite ease-in-out', animationDelay: '1.5s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 14 */}
                <svg className="absolute text-white fill-current" style={{ top: '88%', left: '75%', width: '8px', height: '8px', animation: 'sparkleFloat2 6s infinite ease-in-out', animationDelay: '3.2s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 15 */}
                <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '35%', left: '20%', width: '9px', height: '9px', animation: 'sparkleFloat3 5.1s infinite ease-in-out', animationDelay: '0.4s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                {/* Sparkle 16 */}
                <svg className="absolute text-white fill-current" style={{ top: '50%', left: '80%', width: '10px', height: '10px', animation: 'sparkleFloat1 4.7s infinite ease-in-out', animationDelay: '1.1s' }} viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>

              <div className="relative z-10 max-w-[1200px] mx-auto space-y-16">
                {/* Header */}
                <div className="space-y-3">
                  <h2 className="font-display-lg text-3xl md:text-4xl text-white font-bold leading-tight tracking-tight">
                    What You Will Get
                  </h2>
                  <p className="font-sans text-[10px] md:text-xs text-[#ffdcd3] font-bold uppercase tracking-[0.2em] block">
                    Your enrollment package includes
                  </p>
                </div>

                {/* Horizontal Features Grid (5 columns on desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-[1200px] mx-auto">
                  {[
                    {
                      title: "Structured Learning Path",
                      desc: "A clear, step-by-step roadmap to guide your daily practice.",
                      icon: "route",
                    },
                    {
                      title: "All-Access Pass",
                      desc: "Instant, unlimited access to the entire library of music courses.",
                      icon: "key",
                    },
                    {
                      title: "Monthly Group Coaching",
                      desc: "Interactive live sessions with our team of instructors.",
                      icon: "groups",
                    },
                    {
                      title: "Downloadable PDF Notes",
                      desc: "High-quality worksheets, charts, and guides to practice offline.",
                      icon: "description",
                    },
                    {
                      title: "Interactive Quizzes",
                      desc: "Fun ear-training and music theory challenges to test your progress.",
                      icon: "quiz",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center p-6 md:p-8 rounded-[36px] border-[3.5px] border-[#cda195] bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:border-[#cda195] hover:shadow-[0_15px_45px_rgba(205,161,149,0.3),_0_0_25px_rgba(205,161,149,0.25)] transition-all duration-300 cursor-pointer w-full group text-center"
                    >
                      {/* Icon inside premium glowing circle */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ffdcd3] to-[#cda195] text-[#4a372e] flex items-center justify-center flex-shrink-0 shadow-[0_6px_16px_rgba(205,161,149,0.25)] mb-6 transition-transform duration-300 group-hover:scale-110">
                        <span className="material-symbols-outlined text-xl select-none">
                          {item.icon}
                        </span>
                      </div>
                      {/* Title & Description stacked */}
                      <div className="space-y-3 flex-grow flex flex-col justify-start">
                        <h3 className="font-display-lg text-base md:text-[17px] font-bold text-white tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <p className="font-sans text-xs text-[#f5e1d8] leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            {/* FAQ Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-[#a38777] via-[#94786d] to-[#c4a296] border-b border-[#e8cdc1]/20 relative overflow-hidden">
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

              {/* Background Piano Grand Image Layer */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none select-none opacity-[0.16]"
                style={{
                  backgroundImage: "url('/pianogrand.jpg')",
                }}
              />

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

              <div className="relative z-10 max-w-[1100px] mx-auto space-y-12">
                <div className="text-center space-y-3">
                  <h2
                    className="font-display-lg text-3xl md:text-4xl text-white font-bold leading-tight tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Frequently Asked Questions
                  </h2>
                  <p className="text-[#ffebe6] font-sans text-xs font-bold uppercase tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                    Everything you need to know about the membership
                  </p>
                </div>

                {/* 2-Column Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    {[
                      {
                        idx: 0,
                        question:
                          "Why choose this membership over free tutorials on YouTube?",
                        answer:
                          "While YouTube has plenty of quick tutorials, it lacks a structured path. Free videos often leave you guessing what to practice next, leading to bad habits or gaps in your playing. This platform provides a step-by-step, organized curriculum that guarantees steady progress without the confusion.",
                      },
                      {
                        idx: 2,
                        question: "Are the video lessons available for download?",
                        answer:
                          "No, the video lessons are streaming-only and require an internet connection to watch. This allows us to constantly update our library and ensure you always have access to the highest-quality video playback on any device.",
                      },
                      {
                        idx: 4,
                        question: "How easy is it to cancel my subscription?",
                        answer:
                          "Very easy. You have complete control over your subscription and can cancel at any time directly from your account settings with just a few clicks. There are no hidden fees, contracts, or cancellation penalties.",
                      },
                      {
                        idx: 6,
                        question:
                          "Am I allowed to keep the downloaded PDF resources forever?",
                        answer:
                          "Yes! Any sheet music, chord charts, or practice worksheets you download during your active membership period are yours to keep and use offline forever.",
                      },
                      {
                        idx: 8,
                        question:
                          "Are private, 1-on-1 coaching sessions included?",
                        answer:
                          "If private 1-on-1 lessons are preferred, please reach out to the support team for upgrade options.",
                      },
                    ].map((item) => (
                      <div
                        key={item.idx}
                        className={`border rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-lg ${openFaq === item.idx
                            ? "border-[#cda195] shadow-[0_12px_30px_rgba(0,0,0,0.15)] bg-black/50"
                            : "border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-black/20 hover:bg-black/30 hover:border-white/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                          }`}
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === item.idx ? null : item.idx)}
                          className="w-full py-4.5 px-5 flex items-center justify-between gap-4 cursor-pointer text-left bg-transparent border-none focus:outline-none"
                        >
                          <span
                            className={`font-sans text-[13px] md:text-sm font-bold transition-colors duration-200 ${openFaq === item.idx
                                ? "text-[#ffdcd3]"
                                : "text-white"
                              }`}
                          >
                            {item.question}
                          </span>
                          <span
                            className={`material-symbols-outlined text-white/70 text-lg transition-transform duration-300 select-none ${openFaq === item.idx ? "rotate-180 text-[#cda195]" : ""
                              }`}
                          >
                            expand_more
                          </span>
                        </button>

                        <div
                          className="grid transition-all duration-300 ease-in-out"
                          style={{
                            gridTemplateRows: openFaq === item.idx ? "1fr" : "0fr",
                            opacity: openFaq === item.idx ? 1 : 0,
                          }}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-white/10 py-4 px-5 bg-black/10">
                              <p className="font-sans text-[12.5px] text-[#f5e1d8] leading-relaxed font-semibold">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    {[
                      {
                        idx: 1,
                        question:
                          "Is it possible to buy a single course instead of a membership?",
                        answer:
                          "Our courses are designed to work together as a complete learning ecosystem, which is why we offer them exclusively through our all-access membership. This gives you the freedom to move between foundations, skills, and various styles at your own pace without paying for individual packages.",
                      },
                      {
                        idx: 3,
                        question:
                          "What is the core learning approach of Phanilie Music?",
                        answer:
                          "Phanilie Music bridges the gap between structured music theory and creative expression. We guide you through essential keyboard foundations first, immediately showing you how to turn those concepts into practical improvisation, and applying them across a rich variety of gospel, jazz, and popular music styles at your own comfortable pace.",
                      },
                      {
                        idx: 5,
                        question: "Do you provide a lifetime access option?",
                        answer:
                          "We currently focus on monthly, 3 months, and annual membership plans to ensure we can continually support our community, host live events, and release fresh course content for our active members.",
                      },
                      {
                        idx: 7,
                        question:
                          "What happens when my free trial period finishes?",
                        answer:
                          "Once your trial ends, your selected membership plan (monthly or annual) will automatically begin using the payment method you provided. If you choose to cancel before the trial period is up, you will not be charged a single cent.",
                      },
                      {
                        idx: 9,
                        question:
                          "Will I lose access to the platform immediately after canceling?",
                        answer:
                          "No, you will retain full access to all courses, live sessions, and downloadable resources until the final day of your current billing cycle. After that date, your account will simply pause, and you won't be billed again.",
                      },
                    ].map((item) => (
                      <div
                        key={item.idx}
                        className={`border rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-lg ${openFaq === item.idx
                            ? "border-[#cda195] shadow-[0_12px_30px_rgba(0,0,0,0.15)] bg-black/50"
                            : "border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-black/20 hover:bg-black/30 hover:border-white/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                          }`}
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === item.idx ? null : item.idx)}
                          className="w-full py-4.5 px-5 flex items-center justify-between gap-4 cursor-pointer text-left bg-transparent border-none focus:outline-none"
                        >
                          <span
                            className={`font-sans text-[13px] md:text-sm font-bold transition-colors duration-200 ${openFaq === item.idx
                                ? "text-[#ffdcd3]"
                                : "text-white"
                              }`}
                          >
                            {item.question}
                          </span>
                          <span
                            className={`material-symbols-outlined text-white/70 text-lg transition-transform duration-300 select-none ${openFaq === item.idx ? "rotate-180 text-[#cda195]" : ""
                              }`}
                          >
                            expand_more
                          </span>
                        </button>

                        <div
                          className="grid transition-all duration-300 ease-in-out"
                          style={{
                            gridTemplateRows: openFaq === item.idx ? "1fr" : "0fr",
                            opacity: openFaq === item.idx ? 1 : 0,
                          }}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-white/10 py-4 px-5 bg-black/10">
                              <p className="font-sans text-[12.5px] text-[#f5e1d8] leading-relaxed font-semibold">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Section (Vintage Manuscript Paper Backdrop + Compact Luxury Cards) */}
            <section
              className="py-12 lg:py-16 px-4 border-b border-[#e8cdc1]/20 relative overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: "linear-gradient(180deg, rgba(38, 22, 16, 0.82) 0%, rgba(26, 14, 10, 0.88) 100%), url('/vintage-manuscript-paper.jpg')",
              }}
            >
              {/* Symmetrical Ambient Warm Rose Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 bg-[#dfa38f]/10 rounded-full blur-[100px] pointer-events-none z-0" />

              <div className="relative z-10 max-w-[860px] mx-auto space-y-8 lg:space-y-10 w-full">
                {/* Section Header */}
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h2 className="font-display-lg text-2xl md:text-3xl lg:text-4xl text-[#fceee8] font-bold leading-tight drop-shadow-sm">
                    Start Your Musical Journey
                  </h2>
                  <p className="text-[#d8bead] font-sans text-xs md:text-sm font-bold uppercase tracking-widest">
                    Choose the plan that fits your pace of learning.
                  </p>
                </div>

                {/* 2 Compact Price Cards in 1 Row (Exact Layout & Content matching Reference Screenshot) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch max-w-[720px] mx-auto w-full">
                  
                  {/* Card 1: Annual Plan */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
                    }}
                    className="relative rounded-[20px] pt-9 p-6 lg:p-7 flex flex-col justify-between text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden border border-white/60"
                  >
                    {/* BEST VALUE Banner */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#44ab96] to-[#369c88] text-white flex items-center justify-center text-[11px] font-bold uppercase tracking-widest shadow-xs">
                      BEST VALUE
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-sans text-lg font-bold text-[#2399a0] tracking-tight">
                        Annual Plan
                      </h3>

                      <div className="space-y-1">
                        <div className="text-3xl lg:text-4xl font-sans font-bold tracking-tight text-[#2b2523]">
                          $14.16 <span className="text-base lg:text-lg font-normal text-[#655b56]">/ month</span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="font-sans text-sm font-bold text-[#38c172] block">
                          Free 14-Day Trial
                        </span>
                        <p className="text-xs text-[#786b65] font-medium leading-normal">
                          Then billed annually at $169.99
                        </p>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => setView("dashboard")}
                        className="w-full py-3 rounded-full font-sans text-sm font-bold text-white bg-gradient-to-r from-[#17a2b8] to-[#138496] hover:from-[#138496] hover:to-[#117a8b] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer border-none flex items-center justify-center"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Monthly Plan */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
                    }}
                    className="relative rounded-[20px] pt-9 p-6 lg:p-7 flex flex-col justify-between text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden border border-white/60"
                  >
                    <div className="space-y-4">
                      <h3 className="font-sans text-lg font-bold text-[#2399a0] tracking-tight">
                        Monthly Plan
                      </h3>

                      <div className="space-y-1">
                        <div className="text-3xl lg:text-4xl font-sans font-bold tracking-tight text-[#2b2523]">
                          $18.99 <span className="text-base lg:text-lg font-normal text-[#655b56]">/ month</span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="font-sans text-sm font-bold text-[#38c172] block">
                          Free 14-Day Trial
                        </span>
                        <p className="text-xs text-[#786b65] font-medium leading-normal">
                          Then billed monthly at $18.99
                        </p>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => setView("dashboard")}
                        className="w-full py-3 rounded-full font-sans text-sm font-bold text-white bg-gradient-to-r from-[#17a2b8] to-[#138496] hover:from-[#138496] hover:to-[#117a8b] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer border-none flex items-center justify-center"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Shared Features Checklist */}
                <div className="pt-2 max-w-[720px] mx-auto w-full">
                  <div className="bg-white/10 backdrop-blur-md rounded-[16px] p-4 border border-white/20 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
                    <div className="shrink-0 pr-3 md:border-r border-white/20">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#e2b0a4] block">
                        Included in Every Plan
                      </span>
                      <span className="font-display-lg text-xs font-bold text-white">
                        Full Access Pass
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                      {[
                        "All Courses Access",
                        "Live Group Coaching",
                        "Sheet Music Library",
                        "Community Forum",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#38c172] p-[1px] flex items-center justify-center shrink-0 shadow-xs">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-[#fceee8] leading-tight">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </section>
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
