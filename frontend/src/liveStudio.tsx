import { useState } from 'react';

interface PastSession {
  id: string;
  title: string;
  date: string;
  duration: string;
  level: string;
  instructor: string;
  thumbnail: string;
  videoUrl: string;
  pdfSummary?: string;
}

interface LiveStudioProps {
  onNavigate?: (view: string) => void;
}

const PAST_SESSIONS: PastSession[] = [
  {
    id: '1',
    title: 'Jazz Improvisation & Scale Mastery Masterclass',
    date: 'Oct 12, 2026',
    duration: '65 Mins',
    level: 'Level 4',
    instructor: 'Stephanie Halim',
    thumbnail: '/glowing-3d-piano-keys.png',
    videoUrl: '/dummy-piano-lesson.mp4',
    pdfSummary: 'Jazz Improvisation Guide.pdf'
  },
  {
    id: '2',
    title: 'Hand Coordination & Independent Rhythm Drills',
    date: 'Sep 28, 2026',
    duration: '55 Mins',
    level: 'Level 3',
    instructor: 'Stephanie Halim',
    thumbnail: '/white-grand-piano-hero.jpg',
    videoUrl: '/dummy-piano-lesson.mp4',
    pdfSummary: 'Rhythm Drills Cheat Sheet.pdf'
  },
  {
    id: '3',
    title: 'Beginner Piano Touch & Tone Production',
    date: 'Sep 14, 2026',
    duration: '48 Mins',
    level: 'Level 1',
    instructor: 'Stephanie Halim',
    thumbnail: '/skeys-building.png',
    videoUrl: '/dummy-piano-lesson.mp4',
    pdfSummary: 'Posture & Touch Basics.pdf'
  },
  {
    id: '4',
    title: 'Modern Gospel Re-Harmonization Techniques',
    date: 'Aug 30, 2026',
    duration: '70 Mins',
    level: 'Level 5',
    instructor: 'Stephanie Halim',
    thumbnail: '/glowing-3d-piano-keys.png',
    videoUrl: '/dummy-piano-lesson.mp4',
    pdfSummary: 'Gospel Voicings PDF.pdf'
  },
  {
    id: '5',
    title: 'Understanding Key Signatures & Circle of Fifths',
    date: 'Aug 15, 2026',
    duration: '60 Mins',
    level: 'Level 2',
    instructor: 'Stephanie Halim',
    thumbnail: '/white-grand-piano-hero.jpg',
    videoUrl: '/dummy-piano-lesson.mp4',
    pdfSummary: 'Circle of Fifths Diagram.pdf'
  }
];

export default function LiveStudio({ onNavigate }: LiveStudioProps) {
  const [activeVideo, setActiveVideoState] = useState<PastSession | null>(null);
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const openVideoModal = (session: PastSession) => {
    setActiveVideoState(session);
    setIsVideoMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVideoVisible(true);
      });
    });
  };

  const closeVideoModal = () => {
    setIsVideoVisible(false);
    setTimeout(() => {
      setIsVideoMounted(false);
      setActiveVideoState(null);
    }, 300);
  };

  return (
    <main 
      className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full min-h-screen text-[#3d251c]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255, 252, 250, 0.5) 0%, rgba(255, 245, 240, 0.4) 100%), url('/skeys-building.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Top Page Header */}
      <div className="relative w-full pt-2 pb-8 text-center max-w-3xl mx-auto flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-3 bg-white/80 border border-[#e8cdc1]/80 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span 
            className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#7c5a4d]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Live Studio Masterclasses
          </span>
        </div>

        <h1 
          className="text-2xl md:text-4xl font-bold text-[#4e3328] mb-2 text-center"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Interactive Coaching &amp; Session History
        </h1>
        <p 
          className="text-xs md:text-sm text-[#7a645b] max-w-xl mx-auto font-medium"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Join upcoming live masterclasses with Stephanie Halim or watch full HD video replays of past sessions anytime.
        </p>

        <div className="flex items-center justify-center gap-3 mt-4 w-full max-w-xs">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c89482]/70 to-transparent"></div>
          <span className="text-[#a06e5e] text-xs">❖</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c89482]/70 to-transparent"></div>
        </div>
      </div>

      {/* SECTION 1: UPCOMING LIVE MASTERCLASSES */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h2 
              className="text-lg md:text-xl font-bold text-[#4e3328]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Upcoming Live Sessions
            </h2>
          </div>
          <span className="text-xs text-[#7a645b] font-medium">1 Scheduled Session</span>
        </div>

        <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-2xl p-6 md:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#dfa38f]/30 text-[#524037] border border-[#dfa38f] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Oct 26 • 2:00 PM WIB
              </span>
              <span className="bg-emerald-500/15 text-emerald-800 border border-emerald-400/40 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                Live Q&amp;A Included
              </span>
            </div>

            <h3 
              className="text-xl md:text-2xl font-bold text-[#3d251c]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Advanced Jazz Voicings &amp; Transitional Runs
            </h3>
            
            <p className="text-xs text-[#6e5a51] leading-relaxed">
              Explore 9th, 11th, and 13th chord extensions, smooth voice leading, and fast transitional scalar runs with live interactive feedback from Stephanie Halim.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#8a6858] font-bold">
              <span className="material-symbols-outlined text-sm">person</span>
              <span>Instructor: Stephanie Halim</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                alert("Redirecting to Live Studio Zoom Session...\nMeeting Link: https://zoom.us/j/8889991111\n\n(Simulated Zoom link)");
                window.open("https://zoom.us/j/8889991111", "_blank");
              }}
              style={{
                background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d, 0 4px 14px rgba(129, 89, 79, 0.22)",
                border: "1px solid #D9A998",
              }}
              className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-base">video_camera_front</span>
              Join Waiting Room
            </button>
            <span className="text-[10px] text-[#81756f] text-center italic font-medium">Zoom link opens 10 mins before start</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: PAST SESSION HISTORY & REPLAYS (SCROLL DOWN) */}
      <section className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 
              className="text-lg md:text-xl font-bold text-[#4e3328]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Past Sessions History &amp; Replays
            </h2>
            <p className="text-xs text-[#7a645b] font-medium mt-0.5">
              Scroll down to watch full HD video recordings of past masterclasses.
            </p>
          </div>
          <span className="text-xs font-bold text-[#8a6858] bg-[#dfa38f]/20 px-3 py-1 rounded-full border border-[#dfa38f]/50">
            {PAST_SESSIONS.length} Replays Available
          </span>
        </div>

        {/* History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PAST_SESSIONS.map((session) => (
            <div
              key={session.id}
              className="bg-white/60 backdrop-blur-md border-[1.5px] border-[#e8cdc1] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Thumbnail Container */}
              <div 
                className="relative aspect-video bg-[#190f0c] overflow-hidden cursor-pointer"
                onClick={() => openVideoModal(session)}
              >
                <img 
                  src={session.thumbnail} 
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-[#8a5a4c] shadow-lg flex items-center justify-center transition-all group-hover:scale-110">
                    <span className="material-symbols-outlined text-2xl font-bold ml-0.5">play_arrow</span>
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    {session.level}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                    {session.duration}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 md:p-5 flex flex-col justify-between flex-grow space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#81756f] uppercase tracking-wider block mb-1">
                    Recorded on {session.date}
                  </span>
                  <h3 
                    className="font-bold text-sm text-[#3d251c] leading-snug group-hover:text-[#8a6858] transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {session.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-[#e8cdc1]/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openVideoModal(session)}
                    style={{
                      background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                      boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                      border: "1px solid #D9A998",
                    }}
                    className="flex-1 py-2 px-3 text-white font-bold text-xs rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">play_circle</span>
                    Watch Replay
                  </button>

                  {session.pdfSummary && (
                    <button
                      type="button"
                      onClick={() => alert(`Downloading Session PDF Notes: ${session.pdfSummary}`)}
                      className="py-2 px-2.5 rounded-lg border border-[#dfa38f] text-[#6e5a51] hover:bg-white/80 font-bold text-xs transition-all cursor-pointer flex items-center justify-center"
                      title={`Download Notes: ${session.pdfSummary}`}
                    >
                      <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REPLAY VIDEO PLAYER MODAL (EXACT SAME FRAME DESIGN AS S KEYS COVERS PAGE) */}
      {isVideoMounted && activeVideo && (
        <div
          className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${
            isVideoVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeVideoModal}
        >
          <div
            className={`relative w-full max-w-2xl bg-white rounded-[10px] p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(100,50,40,0.22)] border-2 border-[#dca698] flex flex-col items-center transition-all duration-300 ease-out transform ${
              isVideoVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Frame - Symmetrical Tight Padding All Around (Exact S Keys Covers Style) */}
            <div className="aspect-[16/9] bg-black w-full rounded-[6px] overflow-hidden shadow-xs border border-[#e2b0a4]/30 relative">
              <video
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                poster={activeVideo.thumbnail}
              >
                <source src={activeVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Flat Slim CLOSE Button Straddling Outer Bottom Border Line */}
            <button
              onClick={closeVideoModal}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-[1px] rounded-full bg-white hover:bg-[#faeee8] text-[#7a483b] hover:text-[#4a2e23] border-[1.5px] border-[#dca698] shadow-sm text-[8px] font-sans font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer active:scale-95 outline-none focus:outline-none"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
