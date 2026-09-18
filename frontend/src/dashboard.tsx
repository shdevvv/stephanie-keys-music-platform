import { useState, useEffect } from 'react'
import { ApiService } from './services/api'
import { levels } from './courseData'
import { initialCompletedSeed } from './accomplishmentHelper'
import { BadgeShowcaseWidget, type LevelBadgeItem } from './components/BadgeShowcaseWidget'
import { BadgeCelebrationModal } from './components/BadgeCelebrationModal'
import { type UserBadgeDto } from './services/badgeApi'
import { NextRecommendedLessonCard } from './components/NextRecommendedLessonCard'
import { fetchDashboardSummary, type DashboardSummaryDto } from './services/dashboardApi'
import { downloadLevelCertificate } from './utils/certificateGenerator'

interface DashboardProps {
  onNavigate: (view: 'home' | 'dashboard' | 'library' | 'courses' | 'sessions' | 'forums') => void
}

const LEVEL_BADGES_CONFIG = [
  { levelNumber: 1, name: 'First Notes', icon: '🥚', subtitle: 'Absolute Fundamentals', requirement: 'Complete Lv.1' },
  { levelNumber: 2, name: 'Keyboard Explorer', icon: '🐣', subtitle: 'Beginner', requirement: 'Complete Lv.2' },
  { levelNumber: 3, name: 'Diatonic Navigator', icon: '🐥', subtitle: 'Elementary', requirement: 'Complete Lv.3' },
  { levelNumber: 4, name: 'Harmony Architect', icon: '🦅', subtitle: 'Pre-Intermediate', requirement: 'Complete Lv.4' },
  { levelNumber: 5, name: 'Groove Master', icon: '🐉', subtitle: 'Intermediate', requirement: 'Complete Lv.5' },
  { levelNumber: 6, name: 'Improv Virtuoso', icon: '👑', subtitle: 'Upper Intermediate', requirement: 'Complete Lv.6' },
  { levelNumber: 7, name: 'Grand Maestro', icon: '🧙‍♂️', subtitle: 'Jazz Foundations', requirement: 'Complete Lv.7' },
  { levelNumber: 8, name: 'Stephanie\'s Circle', icon: '⚡', subtitle: 'Jazz Advanced', requirement: 'Complete Lv.8' },
];

function Dashboard({ onNavigate }: DashboardProps) {
  
  // Settings & testing
  const [apiUrl, setApiUrl] = useState(ApiService.getEffectiveBaseUrl())
  const [showSettings, setShowSettings] = useState(false)
  const [connectionTest, setConnectionTest] = useState<{ status: 'idle' | 'testing' | 'success' | 'failed', message?: string }>({ status: 'idle' })

  // Celebration state
  const [celebrationBadge, setCelebrationBadge] = useState<UserBadgeDto | null>(null)

  // Dashboard summary state
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummaryDto | null>(null)

  useEffect(() => {
    fetchDashboardSummary().then(summary => setDashboardSummary(summary))
  }, [])

  // Sync state from local storage mutations
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedCompleted = localStorage.getItem('completed_lessons')
        if (savedCompleted) {
          setCompletedLessons(prev => {
            if (JSON.stringify(prev) === savedCompleted) return prev
            return JSON.parse(savedCompleted)
          })
        } else {
          setCompletedLessons(initialCompletedSeed)
        }
      } catch (err) {
        console.error(err)
      }
    }
    window.addEventListener('storage', handleSync)
    return () => window.removeEventListener('storage', handleSync)
  }, [])

  // Completed lessons state
  const [completedLessons, setCompletedLessons] = useState<{ title: string; day: string }[]>(() => {
    try {
      const saved = localStorage.getItem('completed_lessons')
      return saved ? JSON.parse(saved) : initialCompletedSeed
    } catch {
      return initialCompletedSeed
    }
  })

  // Calculate level progress & 8 Level Badges
  const getLevelTotalLessons = (lvlNum: number): number => {
    const lvl = levels.find(l => l.number === lvlNum);
    if (!lvl) return 1;
    return lvl.topics.reduce((sum, t) => sum + t.lessons.length, 0);
  };

  const getLevelCompletedLessons = (lvlNum: number): number => {
    const lvl = levels.find(l => l.number === lvlNum);
    if (!lvl) return 0;
    let count = 0;
    lvl.topics.forEach(t => {
      t.lessons.forEach(l => {
        const key = `${lvl.number}-${t.title}-${l.code || l.title}`;
        if (completedLessons.some(c => c.title === key)) count++;
      });
    });
    return count;
  };

  const levelBadges: LevelBadgeItem[] = LEVEL_BADGES_CONFIG.map(cfg => {
    const total = getLevelTotalLessons(cfg.levelNumber);
    const completed = getLevelCompletedLessons(cfg.levelNumber);
    const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    return {
      levelNumber: cfg.levelNumber,
      name: cfg.name,
      icon: cfg.icon,
      subtitle: cfg.subtitle,
      requirement: cfg.requirement,
      completedLessons: completed,
      totalLessons: total,
      isUnlocked: pct >= 100,
      progressPercentage: pct,
    };
  });

  const overallCompletedLessons = completedLessons.length;
  const overallTotalLessons = levels.reduce((sum, lvl) => sum + lvl.topics.reduce((sum2, t) => sum2 + t.lessons.length, 0), 0);
  const mastery = overallTotalLessons > 0 ? Math.min(100, Math.round((overallCompletedLessons / overallTotalLessons) * 100)) : 0;

  const handleUnsaveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = savedItems.filter(item => item.id !== id)
    setSavedItems(updated)
    localStorage.setItem('saved_later_items', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  const handleSaveApiUrl = () => {
    ApiService.setBaseUrl(apiUrl)
    setShowSettings(false)
  }

  const handleAddOrUpdateTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (editingId) {
      setTodos(todos.map(t => t.id === editingId ? { ...t, title: title.trim() } : t))
      setEditingId(null)
    } else {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        title: title.trim(),
        isCompleted: false
      }
      setTodos([newTodo, ...todos])
    }
    setTitle('')
  }

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
  }

  const handleEditTodo = (todo: TodoItem) => {
    setEditingId(todo.id)
    setTitle(todo.title)
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setTitle('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setTitle('')
  }

  const testConnection = async () => {
    setConnectionTest({ status: 'testing' })
    try {
      const res = await fetch(`${apiUrl}/todos`)
      if (res.ok) {
        setConnectionTest({ status: 'success', message: 'Connected to API Gateway!' })
      } else {
        setConnectionTest({ status: 'failed', message: `Server error code: ${res.status}` })
      }
    } catch (err: any) {
      setConnectionTest({ status: 'failed', message: 'Connection timed out or refused.' })
    }
  }

  return (
    <main className="py-6 md:py-8 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6 md:gap-7 min-h-0">
      
      {/* Connection Settings panel (overlay modal) */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-lg border-2 border-[#dfa38f] rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative">
            <button 
              type="button"
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-[#f3ecea] hover:bg-[#e8cdc1] transition-colors border border-[#dfa38f]/50 cursor-pointer text-[#6e5a51]"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-base font-bold flex items-center gap-2 text-[#6e5a51]">
              <span className="material-symbols-outlined">settings</span>
              API Gateway Database Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4f4540] mb-1.5">
                  C# Gateway API Endpoint Base URL
                </label>
                <input 
                  type="text" 
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full bg-transparent border border-[#dfa38f] rounded-lg py-2 px-3 focus:ring-1 focus:ring-[#dfa38f] focus:outline-none text-xs text-[#5a3a2e]"
                  placeholder="http://localhost:5000"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={testConnection}
                  className="bg-transparent hover:bg-white/30 text-[#6e5a51] font-bold px-3 py-1.5 rounded-lg transition duration-200 text-xs border border-[#dfa38f] flex items-center justify-center gap-1 cursor-pointer"
                >
                  Test Connection
                </button>
                <button 
                  type="button"
                  onClick={handleSaveApiUrl}
                  className="bg-gradient-to-r from-[#ab7e66] to-[#dfa38f] text-white px-5 py-1.5 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all border border-[#dfa38f] cursor-pointer text-xs"
                >
                  Save
                </button>
              </div>
            </div>
            {connectionTest.status !== 'idle' && (
              <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                connectionTest.status === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800' 
                  : 'bg-red-500/10 border-red-500/40 text-red-800'
              }`}>
                <span className="material-symbols-outlined shrink-0 text-base mt-0.5">info</span>
                <div>
                  <p className="font-bold">{connectionTest.status === 'success' ? 'Connected successfully' : 'Connection failed'}</p>
                  <p className="text-[11px] mt-0.5 opacity-90">{connectionTest.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        
      {/* 1. Header Welcome Banner */}
      <section className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-xl px-5 py-4 flex items-center justify-between gap-4 shrink-0 shadow-md">
        <div className="flex items-center gap-3 animate-in fade-in duration-300">
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-lg md:text-xl text-[#5a3a2e] font-extrabold tracking-tight">Welcome back, Julian!</h1>
          <span className="px-3 py-1 rounded-lg bg-transparent text-[#7a4b3d] text-xs font-black uppercase tracking-wider border border-[#dfa38f] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs font-black text-[#d4af37]">workspace_premium</span>
            Active Student
          </span>
        </div>
      </section>

      {/* 8 Level Achievement Badges Showcase & Modal (1x Only) */}
      <BadgeShowcaseWidget badges={levelBadges} />
      <BadgeCelebrationModal badge={celebrationBadge} onClose={() => setCelebrationBadge(null)} />

      {/* Main Grid Layout: Left (Col 1 & 2), Right (Col 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 min-h-0">
        
        {/* Left Column Span (Col 1 & 2) */}
        <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
          
          {/* Next Recommended Lesson Card (Spans from Overall Progress to Weekly Intensity) */}
          {dashboardSummary?.nextRecommendedLesson && (
            <NextRecommendedLessonCard
              recommendedLesson={dashboardSummary.nextRecommendedLesson}
              onNavigate={onNavigate}
            />
          )}

          {/* Cards 1 & 2: Overall Progress + Weekly Practice Intensity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 flex-grow">
            
            {/* Card 1: Overall Progress */}
            <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-xl p-5 md:p-6 flex flex-col justify-between min-h-[235px] shrink-0 gap-3 shadow-md">
              <div className="flex justify-between items-center shrink-0">
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs md:text-sm uppercase tracking-wider text-[#6e5a51]">Overall Progress</h3>
              </div>
              <div className="flex flex-col flex-grow justify-between py-1">
                <div className="flex items-center justify-around gap-4 my-auto">
                  {/* Circular Meter */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <defs>
                        <linearGradient id="masteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ab7e66" />
                          <stop offset="100%" stopColor="#dfa38f" />
                        </linearGradient>
                      </defs>
                      <circle cx="40" cy="40" fill="transparent" r="32" stroke="#f2dfd7" strokeWidth="5"></circle>
                      <circle 
                        className="progress-circle text-[#6e5a51]" 
                        cx="40" 
                        cy="40" 
                        fill="transparent" 
                        r="32" 
                        stroke="url(#masteryGrad)" 
                        strokeLinecap="round" 
                        strokeWidth="5.5"
                        style={{
                          strokeDasharray: '201',
                          strokeDashoffset: `calc(201 - (201 * ${mastery}) / 100)`
                        }}
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-display-lg text-sm text-[#3d251c] font-black">{mastery}%</span>
                      <span className="text-[7.5px] font-bold text-[#81756f] uppercase tracking-widest leading-none mt-0.5">Mastery</span>
                    </div>
                  </div>

                  {/* Progress Text Details */}
                  <div className="flex flex-col min-w-0">
                    <p className="text-[9.5px] font-bold uppercase tracking-widest text-[#81756f]">Julian's Progress</p>
                    <p className="text-xl font-black text-[#3d251c] leading-tight mt-0.5">{overallCompletedLessons}</p>
                    <p className="text-xs text-[#6e5a51] font-semibold">Lessons Completed</p>
                    <p className="text-[8.5px] text-[#ab7e66] italic mt-0.5">Keep practicing daily!</p>
                  </div>
                </div>

                {/* Resume Button */}
                <button 
                  onClick={() => onNavigate('courses')}
                  className="w-full bg-gradient-to-r from-[#ab7e66] to-[#dfa38f] hover:from-[#856758] hover:to-[#ab7e66] text-white font-bold text-xs uppercase tracking-wider py-2 rounded-lg shadow-xs transition-all duration-300 border border-[#dfa38f] cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 shrink-0 mt-2"
                >
                  <span className="material-symbols-outlined text-base">play_circle</span>
                  Resume Curriculum
                </button>
              </div>
            </div>

            {/* Card 2: Weekly Practice Intensity */}
            <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-xl p-5 md:p-6 flex flex-col justify-between min-h-[235px] shrink-0 gap-3 shadow-md">
              <div className="flex justify-between items-center shrink-0">
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs md:text-sm uppercase tracking-wider text-[#6e5a51]">Weekly Practice Intensity</h3>
              </div>
              <div className="flex items-end justify-between gap-2.5 px-1 h-[125px] mt-2 shrink-0">
                {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => {
                  const dayCompletedCount = completedLessons.filter(c => c.day === day).length
                  const barHeight = `${Math.min(95, 10 + dayCompletedCount * 18)}px`

                  return (
                    <div key={day} className="flex flex-col items-center gap-1.5 w-full justify-end animate-in fade-in duration-300">
                      <div className="w-full flex flex-col justify-end h-[95px]">
                        <div 
                          className="bg-gradient-to-t from-[#ab7e66] to-[#dfa38f] hover:to-[#eec0b2] rounded-md w-full transition-all duration-300 border border-[#dfa38f]/40" 
                          style={{ height: barHeight }} 
                          title={`${dayCompletedCount} Lessons Completed`}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-[#4f4540]">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column Span (Col 3): Live Studio (Scrollable Upcoming + Google Drive Past Replays) */}
        <div className="lg:col-span-1">
          <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-xl p-5 md:p-6 flex flex-col justify-between h-full min-h-[320px] shrink-0 gap-3 shadow-md">
            <div className="flex justify-between items-center shrink-0 border-b border-[#dfa38f]/30 pb-2.5">
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs md:text-sm uppercase tracking-wider text-[#6e5a51]">Live Studio</h3>
                <p className="text-[9px] text-[#81756f] font-medium">Scroll down for past video replays</p>
              </div>
              <span className="text-[9.5px] font-bold text-[#8a6858] bg-[#dfa38f]/20 px-2 py-0.5 rounded border border-[#dfa38f]/50">
                Live &amp; Replays
              </span>
            </div>

            {/* Scrollable Container for Upcoming & Past Sessions */}
            <div className="flex-grow min-h-0 overflow-y-auto pr-1 custom-scrollbar space-y-2.5 max-h-[290px]">
              
              {/* 1. UPCOMING LIVE SESSION */}
              <div className="p-3 rounded-lg bg-white/20 border border-[#dfa38f] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="bg-[#dfa38f]/30 border border-[#dfa38f] text-[#524037] px-2 py-0.5 rounded-md text-[8.5px] font-extrabold uppercase tracking-wider">
                    🔴 Oct 26 • 2:00 PM
                  </span>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-400/30">
                    Upcoming
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-[#1d1b1a] leading-tight">Advanced Jazz Voicings &amp; Transitional Runs</h4>
                  <p className="text-[9.5px] text-[#4f4540] mt-0.5 font-medium">with Stephanie Halim</p>
                </div>
                <button 
                  onClick={() => {
                    alert("Redirecting to Live Studio Zoom Session...\nMeeting Link: https://zoom.us/j/8889991111\n\n(Simulated Zoom link)");
                    window.open("https://zoom.us/j/8889991111", "_blank");
                  }}
                  className="w-full bg-gradient-to-r from-[#ab7e66] to-[#dfa38f] hover:brightness-110 text-white font-bold text-xs py-1.5 rounded-md transition-all border border-[#dfa38f] cursor-pointer shrink-0 shadow-2xs"
                >
                  Join Waiting Room (Zoom)
                </button>
              </div>

              {/* SECTION DIVIDER: PAST REPLAYS */}
              <div className="flex items-center gap-2 pt-1">
                <div className="h-[1px] flex-1 bg-[#dfa38f]/40"></div>
                <span className="text-[9px] font-bold text-[#81756f] uppercase tracking-wider">Past Replays (Google Drive)</span>
                <div className="h-[1px] flex-1 bg-[#dfa38f]/40"></div>
              </div>

              {/* 2. PAST HISTORY SESSIONS (SCROLL DOWN - CLICK TO OPEN GOOGLE DRIVE LINK) */}
              {[
                {
                  title: "Jazz Improvisation & Scale Mastery",
                  date: "Oct 12 • 65 Mins • Level 4",
                  gdriveUrl: "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P/view"
                },
                {
                  title: "Hand Coordination & Independent Drills",
                  date: "Sep 28 • 55 Mins • Level 3",
                  gdriveUrl: "https://drive.google.com/file/d/2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q/view"
                },
                {
                  title: "Beginner Piano Touch & Tone Production",
                  date: "Sep 14 • 48 Mins • Level 1",
                  gdriveUrl: "https://drive.google.com/file/d/3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R/view"
                },
                {
                  title: "Modern Gospel Re-Harmonization",
                  date: "Aug 30 • 70 Mins • Level 5",
                  gdriveUrl: "https://drive.google.com/file/d/4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S/view"
                },
                {
                  title: "Understanding Key Signatures & Fifths",
                  date: "Aug 15 • 60 Mins • Level 2",
                  gdriveUrl: "https://drive.google.com/file/d/5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T/view"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    alert(`Opening Past Session Video in Google Drive:\n${item.title}\n\nLink: ${item.gdriveUrl}`);
                    window.open(item.gdriveUrl, '_blank');
                  }}
                  className="p-2.5 rounded-lg bg-transparent hover:bg-white/30 border border-[#dfa38f]/50 hover:border-[#dfa38f] cursor-pointer transition-all duration-200 flex items-center justify-between gap-2.5 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-[#dfa38f]/20 text-[#6e4336] group-hover:bg-[#ab7e66] group-hover:text-white transition-colors flex items-center justify-center shrink-0 border border-[#dfa38f]/40">
                      <span className="material-symbols-outlined text-base">play_circle</span>
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-[#1d1b1a] truncate group-hover:text-[#6e4336] transition-colors">{item.title}</h5>
                      <p className="text-[9px] font-medium text-[#7a645b] truncate">{item.date}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-xs text-[#81756f] group-hover:text-[#6e4336] shrink-0">open_in_new</span>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>

    </main>
  );
}

export default Dashboard;
