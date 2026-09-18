import { useState, useEffect } from "react";
import { levels as localLevels } from "./courseData";
import type { Level } from "./courseData";
import { fetchCourseTree } from "./services/courseApi";
import { downloadLevelCertificate } from "./utils/certificateGenerator";

const ELEGANT_PIANO_VIDEO = "/dummy-piano-lesson.mp4";
const ELEGANT_PIANO_POSTER = "/white-grand-piano-hero.jpg";

const LEVEL_BADGES_CONFIG = [
  { levelNumber: 1, name: 'First Notes', icon: '🥚', subtitle: 'Absolute Fundamentals' },
  { levelNumber: 2, name: 'Keyboard Explorer', icon: '🐣', subtitle: 'Beginner' },
  { levelNumber: 3, name: 'Diatonic Navigator', icon: '🐥', subtitle: 'Elementary' },
  { levelNumber: 4, name: 'Harmony Architect', icon: '🦅', subtitle: 'Pre-Intermediate' },
  { levelNumber: 5, name: 'Groove Master', icon: '🐉', subtitle: 'Intermediate' },
  { levelNumber: 6, name: 'Improv Virtuoso', icon: '👑', subtitle: 'Upper Intermediate' },
  { levelNumber: 7, name: 'Grand Maestro', icon: '🧙‍♂️', subtitle: 'Jazz Foundations' },
  { levelNumber: 8, name: 'Stephanie\'s Circle', icon: '⚡', subtitle: 'Jazz Advanced' },
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

  // Sequential Lesson Unlock System
  const getAllLessonsInOrder = () => {
    const list: { key: string; levelNumber: number }[] = [];
    dbLevels.forEach(lvl => {
      lvl.topics.forEach(topic => {
        topic.lessons.forEach(lesson => {
          const key = `${lvl.number}-${topic.title}-${lesson.code || lesson.title}`;
          list.push({ key, levelNumber: lvl.number });
        });
      });
    });
    return list;
  };

  const isLessonUnlocked = (lessonKey: string): boolean => {
    const all = getAllLessonsInOrder();
    const idx = all.findIndex(item => item.key === lessonKey);
    if (idx <= 0) return true; // 1st lesson ever is always unlocked
    // Unlocked ONLY IF preceding lesson is completed!
    const prevLessonKey = all[idx - 1].key;
    return completedLessons.some(c => c.title === prevLessonKey);
  };

  // Completed Lessons State
  const [completedLessons, setCompletedLessons] = useState<{ title: string; day: string }[]>(() => {
    try {
      const saved = localStorage.getItem('completed_lessons');
      return saved ? JSON.parse(saved) : [
        { title: "1-Module 1.1 — Orientation-V1.1.1", day: "Mon" },
        { title: "1-Module 1.1 — Orientation-V1.1.2", day: "Mon" },
        { title: "1-Module 1.1 — Orientation-V1.1.3", day: "Tue" }
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
      className="pt-6 pb-8 flex-grow flex flex-col text-[#3d251c] relative"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255, 252, 250, 0.45) 0%, rgba(255, 245, 240, 0.35) 100%), url('/skeys-building.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* ── Level Grid ── */}
      {!selectedLevel && (
        <section className="px-6 max-w-[1240px] mx-auto w-full mb-8 pt-4 animate-in fade-in duration-300">
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
                  className="group relative flex flex-col justify-between p-6 rounded-lg cursor-pointer bg-white/55 border-[1.5px] border-[#e8cdc1] transition-all duration-700 ease-out hover:scale-[1.028] hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_0_35px_rgba(255,255,255,0.95),0_20px_45px_-6px_rgba(184,124,109,0.35)] overflow-hidden"
                  style={{
                    boxShadow: '0 15px 38px -6px rgba(184, 124, 109, 0.22), 0 0 18px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {/* Glossy Sheen Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/35 to-transparent z-0" />

                  {/* Top Level Pill */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="px-3.5 py-1 rounded-md text-[10px] font-bold tracking-[0.18em] uppercase text-[#6e4336] flex items-center bg-white/75 border border-[#e8cdc1] shadow-xs"
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

                    {/* Download Certificate Button (Visible when level 100% completed) */}
                    {progressPct >= 100 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const cfg = LEVEL_BADGES_CONFIG.find(b => b.levelNumber === level.number) || LEVEL_BADGES_CONFIG[0];
                          downloadLevelCertificate({
                            studentName: 'Julian',
                            levelNumber: level.number,
                            levelTitle: `Level ${level.number}`,
                            levelSubtitle: level.subtitle,
                            badgeName: cfg.name,
                            badgeIcon: cfg.icon,
                          });
                        }}
                        className="w-full mt-3 py-1.5 px-3 rounded-md bg-gradient-to-r from-[#ab7e66] to-[#dfa38f] text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-[#dfa38f] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">workspace_premium</span>
                        Download Certificate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const cfg = LEVEL_BADGES_CONFIG.find(b => b.levelNumber === level.number) || LEVEL_BADGES_CONFIG[0];
                          downloadLevelCertificate({
                            studentName: 'Julian',
                            levelNumber: level.number,
                            levelTitle: `Level ${level.number}`,
                            levelSubtitle: level.subtitle,
                            badgeName: cfg.name,
                            badgeIcon: cfg.icon,
                          });
                        }}
                        className="w-full mt-3 py-1.5 px-3 rounded-md bg-transparent hover:bg-white/40 text-[#6e5a51] font-bold text-[10px] uppercase tracking-wider border border-[#dfa38f]/60 cursor-pointer flex items-center justify-center gap-1 opacity-80 hover:opacity-100 transition-all"
                      >
                        <span className="material-symbols-outlined text-xs">workspace_premium</span>
                        Certificate ({progressPct}%)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── SELECTED LEVEL DETAIL VIEW ── */}
      {selectedLevel !== null && activeLevel && (
        <section className="px-6 max-w-[1240px] mx-auto w-full mb-6 animate-in fade-in duration-300">
          {/* Level Header Banner & Back Button */}
          <div 
            className="bg-white/55 border-[1.5px] border-[#e8cdc1] rounded-md p-6 md:p-7 mb-8 relative overflow-hidden transition-all duration-300"
            style={{
              boxShadow: "0 20px 50px rgba(184, 124, 109, 0.18), 0 0 30px rgba(255, 255, 255, 0.95), inset 0 2px 4px rgba(255, 255, 255, 0.95)"
            }}
          >
            {/* Top Gloss Sheen Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/40 to-transparent z-0" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="px-3 py-0.5 rounded-md text-xs font-bold text-[#6e4336] shadow-xs"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) padding-box, linear-gradient(135deg, #d4a395 0%, #ffffff 50%, #b87c6d 100%) border-box',
                        border: '1px solid transparent'
                      }}
                    >
                      Level {activeLevel.number}
                    </span>
                    <span className="text-xs font-bold text-[#5e4337]">{activeLevel.targetStudent}</span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl text-[#44281d]"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 700 }}
                  >
                    {activeLevel.subtitle}
                  </h2>
                </div>

                {/* Vertical Divider on Desktop */}
                <div className="hidden lg:block w-[1.5px] h-10 bg-gradient-to-b from-transparent via-[#c89482]/60 to-transparent shrink-0" />

                {/* Quick Info Metrics (Inline beside Level title!) */}
                <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-xs text-[#6e564c] font-medium">
                  <span 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md shadow-2xs"
                    style={{
                      background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) padding-box, linear-gradient(135deg, #e8b4a2 0%, #ffffff 50%, #c89482 100%) border-box',
                      border: '1px solid transparent'
                    }}
                  >
                    <span className="text-[10px] text-[#8a6858] font-bold uppercase tracking-wider">Total Modules:</span>
                    <span className="font-bold text-[#341f18]">{activeLevel.topics.length}</span>
                  </span>
                  <span 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md shadow-2xs"
                    style={{
                      background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) padding-box, linear-gradient(135deg, #e8b4a2 0%, #ffffff 50%, #c89482 100%) border-box',
                      border: '1px solid transparent'
                    }}
                  >
                    <span className="text-[10px] text-[#8a6858] font-bold uppercase tracking-wider">Total Videos:</span>
                    <span className="font-bold text-[#341f18]">{getTotalLessons(activeLevel)}</span>
                  </span>
                  <button 
                    type="button"
                    onClick={() => {
                      const cfg = LEVEL_BADGES_CONFIG.find(b => b.levelNumber === activeLevel.number) || LEVEL_BADGES_CONFIG[0];
                      downloadLevelCertificate({
                        studentName: 'Julian',
                        levelNumber: activeLevel.number,
                        levelTitle: `Level ${activeLevel.number}`,
                        levelSubtitle: activeLevel.subtitle,
                        badgeName: cfg.name,
                        badgeIcon: cfg.icon,
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md shadow-2xs bg-gradient-to-r from-[#ab7e66] to-[#dfa38f] text-white font-bold cursor-pointer hover:opacity-90 active:scale-95 transition-all border border-[#dfa38f]"
                  >
                    <span className="material-symbols-outlined text-sm">workspace_premium</span>
                    <span>Download Level {activeLevel.number} Certificate</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedLevel(null);
                  setExpandedTopic(null);
                }}
                className="px-6 py-2 rounded-md text-xs font-bold text-[#5e382b] bg-white/85 border-[1.5px] border-[#c89482] hover:bg-[#8a6858] hover:text-white hover:border-[#8a6858] hover:shadow-md transition-all duration-300 cursor-pointer shadow-xs w-fit shrink-0 self-start lg:self-center"
              >
                Back
              </button>
            </div>
          </div>

          {/* Topics Accordion List (Unified Attached Container) */}
          <div 
            className="bg-white/55 border-[1.5px] border-[#e8cdc1] rounded-md overflow-hidden transition-all duration-300 divide-y divide-[#e8cdc1]/60 w-full"
            style={{
              boxShadow: "0 15px 40px rgba(184, 124, 109, 0.15), 0 0 25px rgba(255, 255, 255, 0.9), inset 0 1.5px 3px rgba(255, 255, 255, 0.95)"
            }}
          >
            {activeLevel.topics.map((topic, topicIdx) => {
              const topicKey = `${activeLevel.number}-${topicIdx}`;
              const isExpanded = expandedTopic === topicKey;

              return (
                <div key={topicKey} className="transition-all duration-300">
                  {/* Topic Header Button */}
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : topicKey)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left bg-transparent border-none cursor-pointer hover:bg-white/35 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0 pr-4">
                      <span 
                        className="w-9 h-9 rounded-md bg-gradient-to-br from-[#f8e3db]/90 via-white/80 to-[#e8cdc1]/90 border border-[#d9a998] shadow-xs flex items-center justify-center font-mono text-xs font-bold text-[#543327] shrink-0"
                      >
                        {String(topicIdx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 
                          className="text-base md:text-lg text-[#44281d] group-hover:text-[#8a6858] transition-colors" 
                          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 700 }}
                        >
                          {topic.title}
                        </h3>
                        <span className="text-xs font-bold text-[#5e4337]">
                          {topic.lessons.length} Video Lessons
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="w-8 h-8 rounded-md bg-white/65 border border-[#e8cdc1] shadow-xs flex items-center justify-center text-[#5e382b] group-hover:bg-[#fdeee8] transition-all duration-300"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <span className="material-symbols-outlined text-lg">expand_more</span>
                      </span>
                    </div>
                  </button>

                  {/* Expanded Lessons Content: Smooth CSS Grid Transition */}
                  {(() => {
                    const activeLessonIdx = selectedLessonMap[topicKey] ?? 0;
                    const currentLesson = topic.lessons[activeLessonIdx] || topic.lessons[0];
                    const videoSrc = (currentLesson as any).video || ELEGANT_PIANO_VIDEO;
                    const posterSrc = (currentLesson as any).poster || ELEGANT_PIANO_POSTER;
                    const currentLessonKey = `${activeLevel.number}-${topic.title}-${currentLesson.code || currentLesson.title}`;

                    return (
                      <div
                        className={`grid transition-all duration-500 ease-in-out ${
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100 border-t border-[#e8cdc1]/40"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="bg-[#fdf9f7]/30 p-4 md:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                              
                              {/* LEFT COLUMN: Video Player Screen (Flush & Seamless with Right List) */}
                              <div className="lg:col-span-6 flex flex-col gap-3">
                                <div className="bg-[#1f1512] rounded-md border-2 border-[#e8cdc1] overflow-hidden shadow-xl relative group w-full">
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
                              <div className="lg:col-span-6 flex flex-col gap-2.5">
                                <div className="flex items-center justify-between mb-1 px-1">
                                  <span className="text-xs font-bold text-[#6e4336] uppercase tracking-wider">
                                    Lessons ({topic.lessons.length})
                                  </span>
                                  <span className="text-[11px] text-[#7a645b] italic font-medium">Click lesson to play</span>
                                </div>

                                {/* Scrollable Container (Only scrolls if > 4 lessons) */}
                                <div className={`space-y-2 ${
                                  topic.lessons.length > 4 
                                    ? "max-h-[285px] overflow-y-auto pr-2 custom-scrollbar" 
                                    : ""
                                }`}>

                                  {topic.lessons.map((lesson, lessonIdx) => {
                                    const lessonKey = `${activeLevel.number}-${topic.title}-${lesson.code || lesson.title}`;
                                    const isCompleted = isLessonCompleted(lessonKey);
                                    const isUnlocked = isLessonUnlocked(lessonKey);
                                    const isSelected = activeLessonIdx === lessonIdx && isUnlocked;

                                    return (
                                      <div
                                        key={lessonIdx}
                                        onClick={() => {
                                          if (!isUnlocked) {
                                            alert("🔒 Modul Terkunci: Anda wajib menyelesaikan video pelajaran sebelumnya terlebih dahulu untuk membuka modul ini.");
                                            return;
                                          }
                                          setSelectedLessonMap(prev => ({ ...prev, [topicKey]: lessonIdx }));
                                        }}
                                        className={`p-3.5 rounded-md border transition-all duration-300 flex items-center justify-between gap-3 ${
                                          !isUnlocked
                                            ? "bg-gray-100/40 border-gray-300/60 opacity-60 cursor-not-allowed"
                                            : isSelected
                                              ? "bg-[#fdeee8]/90 border-[#c89482] shadow-[0_0_20px_rgba(253,238,232,0.95),0_4px_16px_rgba(184,124,109,0.2)] ring-1 ring-[#c89482]/60 cursor-pointer"
                                              : "bg-white/60 border-[#e8cdc1]/80 hover:bg-[#fdeee8]/60 hover:border-[#c89482] hover:shadow-[0_0_18px_rgba(255,255,255,0.95)] cursor-pointer"
                                        }`}
                                      >
                                        <div className="flex items-center gap-3 min-w-0">
                                          {/* Lock / Completion Status Checkmark on the Left */}
                                          {!isUnlocked ? (
                                            <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 border border-gray-300 flex items-center justify-center shrink-0" title="Locked">
                                              <span className="material-symbols-outlined text-[11px] font-bold">lock</span>
                                            </div>
                                          ) : (
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
                                                <div className="w-3.5 h-3.5 rounded-full border border-[#ab7e66]/40 bg-white/25" />
                                              )}
                                            </button>
                                          )}

                                          {/* Lesson Code & Title */}
                                          <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                              {lesson.code && (
                                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md border ${
                                                  !isUnlocked
                                                    ? "bg-gray-200 text-gray-500 border-gray-300"
                                                    : isSelected 
                                                      ? "bg-[#8a6858] text-white border-[#8a6858]" 
                                                      : "bg-[#f8e3db] text-[#6e4336] border-[#e8cdc1]"
                                                }`}>
                                                  {lesson.code}
                                                </span>
                                              )}
                                              {!isUnlocked && (
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-200/80 px-1.5 py-0.2 rounded border border-gray-300">
                                                  Locked
                                                </span>
                                              )}
                                            </div>
                                            <h4 className={`text-xs font-bold truncate ${!isUnlocked ? "text-gray-500" : isSelected ? "text-[#5e382b]" : "text-[#341f18]"}`}>
                                              {lesson.title}
                                            </h4>
                                          </div>
                                        </div>

                                        {/* Action Right: Download PDF button on ALL lesson items */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isUnlocked) {
                                              alert("🔒 Modul Terkunci: Selesaikan video pelajaran sebelumnya terlebih dahulu.");
                                              return;
                                            }
                                            alert(`Downloading PDF: ${lesson.pdf || lesson.title + ' Sheet Music'}`);
                                          }}
                                          disabled={!isUnlocked}
                                          className={`px-3 py-1.5 text-[11px] font-bold rounded-md flex items-center gap-1.5 transition-all duration-300 shrink-0 relative overflow-hidden ${
                                            !isUnlocked
                                              ? "opacity-40 cursor-not-allowed bg-gray-200 text-gray-400 border border-gray-300"
                                              : "text-[#5e382b] hover:text-[#3e2219] cursor-pointer shadow-xs hover:shadow-[0_4px_16px_rgba(184,124,109,0.35)] hover:scale-[1.05] group/pdf"
                                          }`}
                                          style={isUnlocked ? {
                                            background: 'linear-gradient(135deg, #ffffff 0%, #fdeee8 50%, #f9dad0 100%) padding-box, linear-gradient(135deg, #b87c6d 0%, #f7d6cb 30%, #ffffff 50%, #e8b4a2 75%, #8e5849 100%) border-box',
                                            border: '1.5px solid transparent',
                                            boxShadow: '0 3px 12px rgba(184, 124, 109, 0.22), 0 0 10px rgba(255, 255, 255, 0.9), inset 0 1.5px 3px rgba(255, 255, 255, 0.95)'
                                          } : {}}
                                          title={isUnlocked ? `Download PDF: ${lesson.pdf || lesson.title}` : "Locked"}
                                        >
                                          {isUnlocked && (
                                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover/pdf:translate-x-full transition-transform duration-700 z-0" />
                                          )}
                                          
                                          <span className={`material-symbols-outlined text-[15px] ${!isUnlocked ? "text-gray-400" : "text-[#a05240] group-hover/pdf:scale-110"} transition-transform relative z-10`}>
                                            {!isUnlocked ? "lock" : "workspace_premium"}
                                          </span>
                                          <span className="tracking-widest uppercase text-[10px] font-black relative z-10" style={{ fontFamily: "'Cinzel', serif" }}>
                                            PDF
                                          </span>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

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
