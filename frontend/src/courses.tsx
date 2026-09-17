import { useState, useEffect } from "react";
import { levels as localLevels } from "./courseData";
import type { Level } from "./courseData";
import { fetchCourseTree } from "./services/courseApi";

const LESSON_VIDEOS = [
  "/dummy-piano-lesson.mp4",
  "/videos/pricing.mp4",
  "/videos/cathedral1.mp4",
  "/videos/sheets.mp4",
  "/videos/fountain.mp4",
  "/videos/cave.mp4",
  "/videos/bible.mp4",
];

const LESSON_POSTERS = [
  "/glowing-3d-piano-keys.png",
  "/hero-piano-cozy.png",
  "/cozy-piano-bg.png",
  "/piano-warm-room.jpg",
  "/hero-palace-piano.jpg",
  "/grand-marble-hall.jpg",
  "/pink-piano-hero.jpg",
];


function Courses() {
  const [dbLevels, setDbLevels] = useState<Level[]>(localLevels);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [selectedLessonMap, setSelectedLessonMap] = useState<Record<string, number>>({});
  
  // Modals
  const [activeVideo, setActiveVideo] = useState<{ 
    code?: string;
    title: string; 
    topicTitle: string; 
    levelNumber: number;
    pdf?: string;
  } | null>(null);
  const [showPlacementTest, setShowPlacementTest] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseTree().then(courses => {
      if (courses && courses.length === localLevels.length) {
        // Map backend courses if available, keeping user level structure fallback
        const mappedLevels: Level[] = courses.map((c, idx) => {
          const fallbackLvl = localLevels[idx] || localLevels[0];
          return {
            ...fallbackLvl,
            number: c.id,
            title: c.title,
            subtitle: c.description,
            topics: c.topics.map(t => ({
              title: t.title,
              lessons: t.lessons.map(l => ({
                title: l.title
              }))
            }))
          };
        });
        setDbLevels(mappedLevels);
      }
    }).catch(err => console.error("Error loading DB courses:", err));
  }, []);

  // Saved for Later state
  const [savedItems, setSavedItems] = useState<{ id: string; type: 'pdf' | 'video'; title: string; meta: string }[]>(() => {
    try {
      const saved = localStorage.getItem('saved_later_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('saved_later_items', JSON.stringify(savedItems));
    window.dispatchEvent(new Event('storage'));
  }, [savedItems]);

  const toggleSaveLater = (type: 'pdf' | 'video', item: { id: string; title: string; meta: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    const exists = savedItems.some(s => s.id === item.id);
    if (exists) {
      setSavedItems(savedItems.filter(s => s.id !== item.id));
    } else {
      setSavedItems([...savedItems, { ...item, type }]);
    }
  };

  const isSavedLater = (id: string) => savedItems.some(s => s.id === id);

  // Completed Lessons State
  const [completedLessons, setCompletedLessons] = useState<{ title: string; day: string }[]>(() => {
    try {
      const saved = localStorage.getItem('completed_lessons');
      return saved ? JSON.parse(saved) : [
        { title: "V0.1.1", day: "Mon" },
        { title: "V0.1.2", day: "Mon" },
        { title: "V0.1.3", day: "Tue" }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('completed_lessons', JSON.stringify(completedLessons));
    window.dispatchEvent(new Event('storage'));
  }, [completedLessons]);

  const toggleLessonCompleted = (lessonKey: string) => {
    const exists = completedLessons.some(c => c.title === lessonKey);
    if (exists) {
      setCompletedLessons(completedLessons.filter(c => c.title !== lessonKey));
    } else {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
      const currentDay = days[new Date().getDay()];
      setCompletedLessons([...completedLessons, { title: lessonKey, day: currentDay }]);
    }
  };

  const isLessonCompleted = (lessonKey: string) => {
    return completedLessons.some(c => c.title === lessonKey);
  };

  // Redirect handling from other pages
  useEffect(() => {
    const targetLevel = localStorage.getItem('redirect_level');
    const targetTopic = localStorage.getItem('redirect_topic');
    const targetLesson = localStorage.getItem('redirect_lesson');
    
    if (targetLevel !== null) {
      const lvlNum = Number(targetLevel);
      setSelectedLevel(lvlNum);
      localStorage.removeItem('redirect_level');
      
      const targetLvl = dbLevels.find(l => l.number === lvlNum);
      if (targetLvl && targetTopic) {
        const topicIdx = targetLvl.topics.findIndex(t => t.title === targetTopic);
        if (topicIdx !== -1) {
          setExpandedTopic(`${lvlNum}-${topicIdx}`);
        }
        localStorage.removeItem('redirect_topic');
      }
      
      if (targetLesson && targetTopic) {
        setActiveVideo({
          title: targetLesson,
          topicTitle: targetTopic,
          levelNumber: lvlNum
        });
        localStorage.removeItem('redirect_lesson');
      }
    }
  }, [dbLevels]);

  const activeLevel = dbLevels.find((l) => l.number === selectedLevel);

  const getTotalLessons = (level: Level) =>
    level.topics.reduce((sum, t) => sum + t.lessons.length, 0);

  const getCompletedLessonsInLevel = (level: Level) => {
    let count = 0;
    level.topics.forEach(t => {
      t.lessons.forEach(l => {
        const key = `${level.number}-${t.title}-${l.code || l.title}`;
        if (isLessonCompleted(key)) count++;
      });
    });
    return count;
  };

  const handleSelectLevel = (num: number) => {
    setSelectedLevel(num);
    setExpandedTopic(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main
      className="pt-6 pb-20 flex-grow flex flex-col min-h-screen text-[#3d251c] relative"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255, 252, 250, 0.45) 0%, rgba(255, 245, 240, 0.35) 100%), url('/skeys-building.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* ── Level Grid ── */}
      {!selectedLevel && (
        <section className="px-6 max-w-[1240px] mx-auto w-full mb-16 pt-4 animate-in fade-in duration-300">
          <div className="relative w-full pt-4 pb-10 text-center max-w-4xl mx-auto flex flex-col items-center justify-center">
            {/* Elegant Header Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-4 bg-white border border-[#e8cdc1]/60 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a06e5e] animate-pulse"></span>
              <span 
                className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#7c5a4d]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Curriculum Roadmap
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a06e5e] animate-pulse"></span>
            </div>

            {/* Main Luxurious Heading split in two lines */}
            <h1 className="text-center drop-shadow-xs py-1 flex flex-col items-center justify-center gap-1">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
                  fontSize: 'clamp(1.15rem, 2.3vw, 1.75rem)',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#4e3328',
                  textShadow: '0 2px 10px rgba(255, 255, 255, 0.9)'
                }}
              >
                Your Complete Roadmap from Absolute
              </span>
              <span
                style={{
                  fontFamily: "'Pinyon Script', 'Alex Brush', 'Great Vibes', cursive",
                  fontSize: 'clamp(2.4rem, 5.2vw, 3.8rem)',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  background: 'linear-gradient(135deg, #2c1a14 0%, #5e3b2e 35%, #965c49 70%, #4a281e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 14px rgba(255, 255, 255, 0.9)'
                }}
              >
                Zero to Mastery
              </span>
            </h1>

            {/* Luxurious Ornamental Divider */}
            <div className="flex items-center justify-center gap-3 mt-4 w-full max-w-xs">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c89482]/70 to-transparent"></div>
              <span className="text-[#a06e5e] text-xs">❖</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c89482]/70 to-transparent"></div>
            </div>
          </div>

          {/* Grid of 8 Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dbLevels.map((level) => {
              const totalLessons = getTotalLessons(level);
              const completedCount = getCompletedLessonsInLevel(level);
              const progressPct = Math.round((completedCount / Math.max(totalLessons, 1)) * 100);

              return (
                <div
                  key={level.number}
                  onClick={() => handleSelectLevel(level.number)}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl cursor-pointer bg-white/85 hover:bg-white/95 transition-all duration-700 ease-out hover:scale-[1.028] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.95),0_20px_45px_-6px_rgba(184,124,109,0.3)] overflow-hidden"
                  style={{
                    border: '1.5px solid #e8cdc1',
                    boxShadow: '0 20px 38px -6px rgba(184, 124, 109, 0.22), 0 10px 18px -4px rgba(166, 95, 80, 0.14)'
                  }}
                >
                  {/* Top Level Pill */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase text-[#6e4336] flex items-center bg-white/90 border border-[#e8cdc1] shadow-xs"
                        style={{
                          fontFamily: "'Cinzel', serif"
                        }}
                      >
                        Level {level.number}
                      </span>
                    </div>

                    {/* Subtitle / Title */}
                    <h3
                      className="text-[1.3rem] font-bold text-[#341f18] mb-2 leading-snug"
                      style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                    >
                      {level.subtitle}
                    </h3>

                    {/* Target Student */}
                    <p 
                      className="text-[0.88rem] text-[#6e564c] mb-5 min-h-[40px] line-clamp-2 leading-relaxed"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
                    >
                      {level.targetStudent}
                    </p>
                  </div>

                  {/* Level Details */}
                  <div className="relative z-10 pt-1 mt-2">
                    {/* Thicker Metallic Rose Gold Divider Line */}
                    <div className="w-full h-[2px] bg-gradient-to-r from-[#e8b4a2]/20 via-[#b86d5c] to-[#e8b4a2]/20 mb-3.5 rounded-full" />

                    <div 
                      className="flex items-center justify-between text-[0.78rem] text-[#6e564c] font-medium mb-3"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <span>{level.topics.length} Modules • {totalLessons} Videos</span>
                    </div>

                    {/* Level Progress Bar */}
                    <div className="w-full">
                      <div 
                        className="flex justify-between items-center text-[0.75rem] text-[#7a645b] mb-1 font-medium"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span>Progress Level</span>
                        <span className="font-bold text-[#341f18]">{progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#f3ece8] rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${progressPct}%`,
                            background: 'linear-gradient(90deg, #b87c6d 0%, #e8b4a2 50%, #8e5849 100%)'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── SELECTED LEVEL DETAIL VIEW ── */}
      {selectedLevel !== null && activeLevel && (
        <section className="px-6 max-w-[1240px] mx-auto w-full mb-16 animate-in fade-in duration-300">
          {/* Level Header Banner & Back Button */}
          <div 
            className="bg-white/85 border-[1.5px] border-[#e8cdc1] rounded-2xl p-6 md:p-7 mb-8 relative overflow-hidden transition-all duration-300"
            style={{
              boxShadow: "0 20px 50px rgba(184, 124, 109, 0.18), 0 0 30px rgba(255, 255, 255, 0.95), inset 0 2px 4px rgba(255, 255, 255, 0.95)"
            }}
          >
            {/* Top Gloss Sheen Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/35 to-transparent z-0" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="px-3.5 py-0.5 rounded-full text-xs font-bold text-[#6e4336] bg-white/90 border border-[#e8cdc1] shadow-xs"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Level {activeLevel.number}
                    </span>
                    <span className="text-xs font-medium text-[#7a645b]">{activeLevel.targetStudent}</span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#341f18]"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                  >
                    {activeLevel.subtitle}
                  </h2>
                </div>

                {/* Vertical Divider on Desktop */}
                <div className="hidden lg:block w-[1.5px] h-10 bg-gradient-to-b from-transparent via-[#c89482]/60 to-transparent shrink-0" />

                {/* Quick Info Metrics (Inline beside Level title!) */}
                <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-xs text-[#6e564c] font-medium">
                  <span className="flex items-center gap-1.5 bg-white/90 border border-[#e8cdc1] px-3 py-1.5 rounded-xl shadow-2xs">
                    <span className="text-[10px] text-[#8a6858] font-bold uppercase tracking-wider">Total Modules:</span>
                    <span className="font-bold text-[#341f18]">{activeLevel.topics.length}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/90 border border-[#e8cdc1] px-3 py-1.5 rounded-xl shadow-2xs">
                    <span className="text-[10px] text-[#8a6858] font-bold uppercase tracking-wider">Total Video:</span>
                    <span className="font-bold text-[#341f18]">{getTotalLessons(activeLevel)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/90 border border-[#e8cdc1] px-3 py-1.5 rounded-xl shadow-2xs">
                    <span className="text-[10px] text-[#8a6858] font-bold uppercase tracking-wider">Badge Reward:</span>
                    <span className="font-bold text-[#6e4336]">🏆 {activeLevel.badge.name}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedLevel(null);
                  setExpandedTopic(null);
                }}
                className="px-6 py-2 rounded-xl text-xs font-bold text-[#5e382b] bg-white/95 border-[1.5px] border-[#c89482] hover:bg-[#8a6858] hover:text-white hover:border-[#8a6858] hover:shadow-md transition-all duration-300 cursor-pointer shadow-xs w-fit shrink-0 self-start lg:self-center"
              >
                Back
              </button>
            </div>
          </div>

          {/* Topics Accordion List */}
          <div className="space-y-5 w-full">
            {activeLevel.topics.map((topic, topicIdx) => {
              const topicKey = `${activeLevel.number}-${topicIdx}`;
              const isExpanded = expandedTopic === topicKey;

              return (
                <div
                  key={topicKey}
                  className="bg-white/85 border-[1.5px] border-[#e8cdc1] rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: "0 12px 35px rgba(184, 124, 109, 0.14), 0 0 20px rgba(255, 255, 255, 0.95), inset 0 1.5px 3px rgba(255, 255, 255, 0.95)"
                  }}
                >
                  {/* Topic Header Button */}
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : topicKey)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left bg-transparent border-none cursor-pointer hover:bg-white/60 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0 pr-4">
                      <span 
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f8e3db] via-white to-[#e8cdc1] border border-[#d9a998] shadow-xs flex items-center justify-center font-mono text-xs font-bold text-[#6e4336] shrink-0"
                      >
                        {String(topicIdx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 
                          className="text-base md:text-lg font-bold text-[#341f18] group-hover:text-[#8a6858] transition-colors" 
                          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                        >
                          {topic.title}
                        </h3>
                        <span className="text-xs font-medium text-[#7a645b]">
                          {topic.lessons.length} Video Lessons {topic.pdfSummary && `• PDF: ${topic.pdfSummary}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="w-8 h-8 rounded-full bg-white/90 border border-[#e8cdc1] shadow-xs flex items-center justify-center text-[#5e382b] group-hover:bg-[#fdeee8] transition-all duration-300"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <span className="material-symbols-outlined text-lg">expand_more</span>
                      </span>
                    </div>
                  </button>

                  {/* Expanded Lessons Content: 2-Column Split View (Left: Video Player, Right: Lesson List) */}
                  {isExpanded && (() => {
                    const activeLessonIdx = selectedLessonMap[topicKey] ?? 0;
                    const currentLesson = topic.lessons[activeLessonIdx] || topic.lessons[0];
                    const lessonKeyIndex = (activeLessonIdx + topicIdx) % LESSON_VIDEOS.length;
                    const videoSrc = (currentLesson as any).video || LESSON_VIDEOS[lessonKeyIndex];
                    const posterSrc = (currentLesson as any).poster || LESSON_POSTERS[lessonKeyIndex];
                    const currentLessonKey = `${activeLevel.number}-${topic.title}-${currentLesson.code || currentLesson.title}-${videoSrc}`;

                    return (
                      <div className="border-t border-[#e8cdc1]/40 bg-[#fdf9f7]/60 p-4 md:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          
                          {/* LEFT COLUMN: Video Player Screen */}
                          <div className="lg:col-span-7 flex flex-col gap-3">
                            <div className="bg-[#1f1512] rounded-2xl border-2 border-[#e8cdc1] overflow-hidden shadow-xl relative group">
                              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                                <video
                                  key={currentLessonKey}
                                  controls
                                  playsInline
                                  poster={posterSrc}
                                  className="w-full h-full object-cover"
                                >
                                  <source src={videoSrc} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT COLUMN: Scrollable Lesson List (Click to switch video) */}
                          <div className="lg:col-span-5 flex flex-col gap-2.5">
                            <div className="flex items-center justify-between mb-1 px-1">
                              <span className="text-xs font-bold text-[#6e4336] uppercase tracking-wider flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm text-[#8a6858]">playlist_play</span>
                                Lessons ({topic.lessons.length})
                              </span>
                              <span className="text-[11px] text-[#7a645b] italic font-medium">Click lesson to play</span>
                            </div>

                            {/* Scrollable Container with Custom Scrollbar & Compact Height */}
                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">

                              {topic.lessons.map((lesson, lessonIdx) => {
                                const lessonKey = `${activeLevel.number}-${topic.title}-${lesson.code || lesson.title}`;
                                const isCompleted = isLessonCompleted(lessonKey);
                                const isSelected = activeLessonIdx === lessonIdx;

                                return (
                                  <div
                                    key={lessonIdx}
                                    onClick={() => {
                                      setSelectedLessonMap(prev => ({ ...prev, [topicKey]: lessonIdx }));
                                    }}
                                    className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                                      isSelected
                                        ? "bg-white border-[#c89482] shadow-[0_0_22px_rgba(255,255,255,0.95),0_4px_16px_rgba(184,124,109,0.22)] ring-1 ring-[#c89482]/50"
                                        : "bg-white/85 border-[#e8cdc1]/80 hover:bg-white hover:border-[#c89482] hover:shadow-[0_0_18px_rgba(255,255,255,0.95)]"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      {/* Completion Status Checkmark on the Left */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleLessonCompleted(lessonKey);
                                        }}
                                        className="w-5 h-5 rounded-full border border-[#8a6858]/40 hover:border-[#8a6858] flex items-center justify-center transition-colors cursor-pointer bg-transparent shrink-0"
                                        title="Toggle Complete"
                                      >
                                        {isCompleted ? (
                                          <div className="w-4 h-4 rounded-full bg-[#8a6858] text-white flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                          </div>
                                        ) : (
                                          <div className="w-3.5 h-3.5 rounded-full border border-[#ab7e66]/40 bg-white/50" />
                                        )}
                                      </button>

                                      {/* Lesson Code & Title */}
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                          {lesson.code && (
                                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md border ${
                                              isSelected 
                                                ? "bg-[#8a6858] text-white border-[#8a6858]" 
                                                : "bg-[#f8e3db] text-[#6e4336] border-[#e8cdc1]"
                                            }`}>
                                              {lesson.code}
                                            </span>
                                          )}
                                          {isSelected && (
                                            <span className="text-[10px] font-bold text-[#8a6858] animate-pulse flex items-center gap-0.5">
                                              <span className="material-symbols-outlined text-xs">play_arrow</span>
                                              PLAYING
                                            </span>
                                          )}
                                        </div>
                                        <h4 className={`text-xs font-bold truncate ${isSelected ? "text-[#5e382b]" : "text-[#341f18]"}`}>
                                          {lesson.title}
                                        </h4>
                                      </div>
                                    </div>

                                    {/* Action Right: Single Download PDF button if PDF exists */}
                                    {lesson.pdf && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          alert(`Downloading PDF: ${lesson.pdf}`);
                                        }}
                                        className="px-2.5 py-1 text-[11px] font-bold bg-[#f8e3db] text-[#6e4336] border border-[#e8cdc1] hover:bg-[#8a6858] hover:text-white hover:border-[#8a6858] rounded-lg flex items-center gap-1 transition-all shrink-0 cursor-pointer shadow-2xs"
                                        title={`Download PDF: ${lesson.pdf}`}
                                      >
                                        <span className="material-symbols-outlined text-[13px]">download</span>
                                        PDF
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── VIDEO PLAYER MODAL ── */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#fffcf9] rounded-2xl border border-[#e8cdc1]/40 overflow-hidden w-full max-w-[800px] shadow-2xl relative z-50">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8cdc1]/20">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#8a6858]">
                  Level {activeVideo.levelNumber} {activeVideo.code && `• ${activeVideo.code}`} • {activeVideo.topicTitle}
                </span>
                <h4 className="text-[#3d251c] font-bold text-base leading-tight mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {activeVideo.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1] text-[#6e5a51] border-none cursor-pointer flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Magical Piano Preview Box */}
            <div className="relative aspect-video bg-[#190f0c] flex items-center justify-center overflow-hidden">
              <img
                src="/glowing-3d-piano-keys.png"
                alt={activeVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 bg-[#fcf8f6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-[#e8cdc1]/20">
              <div className="flex items-center gap-2 text-[#81756f]">
                <span className="material-symbols-outlined text-[#8a6858]">info</span>
                <span>Modul {activeVideo.code || 'Video'} — Lengkapi minimal 90% untuk membuka video berikutnya.</span>
              </div>

              {activeVideo.pdf && (
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8a6858] text-white rounded-xl font-bold hover:bg-[#5d453b] transition-all border-none cursor-pointer">
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  Download {activeVideo.pdf}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PLACEMENT TEST MODAL ── */}
      {showPlacementTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#fffcf9] rounded-2xl border border-[#e8cdc1]/40 overflow-hidden w-full max-w-[600px] p-6 shadow-2xl relative z-50 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8cdc1]/20 pb-3">
              <h3 className="text-lg font-bold text-[#3d251c]" style={{ fontFamily: "'Playfair Display', serif" }}>
                🎹 Tes Penempatan Level (Placement Test)
              </h3>
              <button 
                onClick={() => setShowPlacementTest(false)}
                className="w-8 h-8 rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1] text-[#6e5a51] border-none cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <p className="text-xs text-[#6e5a51] leading-relaxed">
              Sudah memiliki pengalaman bermain piano sebelumnya? Ikuti tes cepat ini untuk melompati level pemula tanpa harus menonton video dasar satu per satu.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#e8cdc1]/30">
                <span className="font-bold text-[#3d251c] block mb-1">Soal 1: Manakah inversi pertama dari akor C Major (C - E - G)?</span>
                <div className="space-y-1 text-[#6e5a51]">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" /> E - G - C</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" /> G - C - E</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" /> C - G - E</label>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#e8cdc1]/30">
                <span className="font-bold text-[#3d251c] block mb-1">Soal 2: Apakah nada dasar yang memiliki 1 tanda Flat (♭) pada Key Signature?</span>
                <div className="space-y-1 text-[#6e5a51]">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" /> F Major</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" /> G Major</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" /> Bb Major</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowPlacementTest(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs font-bold border-none cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  alert('Selamat! Berdasarkan tes penempatan, Anda direkomendasikan memulai dari Level 3 (Pre-Intermediate).');
                  setShowPlacementTest(false);
                  handleSelectLevel(3);
                }}
                className="px-4 py-2 bg-[#8a6858] text-white rounded-xl text-xs font-bold border-none cursor-pointer hover:bg-[#5d453b]"
              >
                Kirim & Dapatkan Penempatan Level
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End of main container */}
    </main>
  );
}

export default Courses;
