import { useState, useEffect } from 'react'
import { ApiService } from './services/api'
import { levels } from './courseData'
import { 
  ACCOMPLISHMENTS, 
  initialCompletedSeed, 
  checkAccomplishmentUnlocked 
} from './accomplishmentHelper'
import { BadgeShowcaseWidget } from './components/BadgeShowcaseWidget'
import { BadgeCelebrationModal } from './components/BadgeCelebrationModal'
import { fetchUserBadges, evaluateBadges, type UserBadgeDto } from './services/badgeApi'
import { NextRecommendedLessonCard } from './components/NextRecommendedLessonCard'
import { fetchDashboardSummary, type DashboardSummaryDto } from './services/dashboardApi'


interface TodoItem {
  id: string
  title: string
  description?: string
  isCompleted: boolean
}

interface DashboardProps {
  onNavigate: (view: 'home' | 'dashboard' | 'library' | 'courses' | 'sessions' | 'forums') => void
}



function Dashboard({ onNavigate }: DashboardProps) {
  
  // Settings & testing
  const [apiUrl, setApiUrl] = useState(ApiService.getEffectiveBaseUrl())
  const [showSettings, setShowSettings] = useState(false)
  const [connectionTest, setConnectionTest] = useState<{ status: 'idle' | 'testing' | 'success' | 'failed', message?: string }>({ status: 'idle' })

  // Saved for Later state
  const [savedItems, setSavedItems] = useState<{ id: string; type: 'pdf' | 'video'; title: string; meta: string }[]>(() => {
    try {
      const saved = localStorage.getItem('saved_later_items')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Student To Do List states
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem('student_todos')
      return saved ? JSON.parse(saved) : [
        { id: '1', title: 'Practice C Major scale 2 octaves', isCompleted: false },
        { id: '2', title: 'Review jazz voicings for Misty', isCompleted: true }
      ]
    } catch {
      return []
    }
  })
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Achievement Badges state
  const [userBadges, setUserBadges] = useState<UserBadgeDto[]>([])
  const [celebrationBadge, setCelebrationBadge] = useState<UserBadgeDto | null>(null)

  // Dashboard summary state
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummaryDto | null>(null)

  useEffect(() => {
    fetchUserBadges().then(data => setUserBadges(data))
    evaluateBadges().then(newlyUnlocked => {
      if (newlyUnlocked.length > 0) {
        setCelebrationBadge(newlyUnlocked[0])
      }
    })
    fetchDashboardSummary().then(summary => setDashboardSummary(summary))
  }, [])

  useEffect(() => {
    localStorage.setItem('student_todos', JSON.stringify(todos))
    window.dispatchEvent(new Event('storage'))
  }, [todos])

  // Sync state from local storage mutations
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedLater = localStorage.getItem('saved_later_items')
        if (savedLater) {
          setSavedItems(prev => {
            if (JSON.stringify(prev) === savedLater) return prev
            return JSON.parse(savedLater)
          })
        } else {
          setSavedItems([])
        }

        const savedCompleted = localStorage.getItem('completed_lessons')
        if (savedCompleted) {
          setCompletedLessons(prev => {
            if (JSON.stringify(prev) === savedCompleted) return prev
            return JSON.parse(savedCompleted)
          })
        } else {
          setCompletedLessons(initialCompletedSeed)
        }

        const savedStreak = localStorage.getItem('practice_streak')
        if (savedStreak) {
          setStreak(parseInt(savedStreak, 10))
        } else {
          setStreak(14)
        }

        const savedTodos = localStorage.getItem('student_todos')
        if (savedTodos) {
          setTodos(prev => {
            if (JSON.stringify(prev) === savedTodos) return prev
            return JSON.parse(savedTodos)
          })
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

  // Practice streak state (consecutive practice days)
  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('practice_streak')
      return saved ? parseInt(saved, 10) : 14
    } catch {
      return 14
    }
  })

  const handleUpdateStreak = (delta: number) => {
    setStreak(prev => {
      const next = Math.max(0, prev + delta)
      localStorage.setItem('practice_streak', next.toString())
      window.dispatchEvent(new Event('storage'))
      return next
    })
  }

  // Calculate dynamic lessons count and mastery
  const totalLessons = levels.reduce((acc, lvl) => {
    return acc + lvl.topics.reduce((acc2, topic) => {
      return acc2 + topic.lessons.reduce((acc3, lesson) => {
        if (lesson.subItems && lesson.subItems.length > 0) {
          return acc3 + lesson.subItems.length
        }
        return acc3 + 1
      }, 0)
    }, 0)
  }, 0)
  const completedCount = completedLessons.length

  const lessonXP = completedCount * 10
  const unlockedXP = ACCOMPLISHMENTS.reduce((acc, ach) => {
    const isUnlocked = checkAccomplishmentUnlocked(ach.id, completedLessons.map(c => c.title), streak)
    return acc + (isUnlocked ? ach.xp : 0)
  }, 0)
  const totalCurrentXP = lessonXP + unlockedXP

  // Mastery calculations: 70% Lessons, 30% Badges
  const maxBadgeXP = ACCOMPLISHMENTS.reduce((acc, ach) => acc + ach.xp, 0)
  const lessonProgress = totalLessons > 0 ? (completedCount / totalLessons) * 70 : 0
  const badgeProgress = maxBadgeXP > 0 ? (unlockedXP / maxBadgeXP) * 30 : 0
  const mastery = Math.min(100, Math.round(lessonProgress + badgeProgress))

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
    <main className="py-2 px-3 md:px-5 max-w-[1400px] mx-auto w-full flex flex-col gap-2 min-h-0">
      
      {/* Connection Settings panel (overlay modal) */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-lg border-2 border-[#dfa38f] rounded-md p-5 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative">
            <button 
              type="button"
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md bg-[#f3ecea] hover:bg-[#e8cdc1] transition-colors border border-[#dfa38f]/50 cursor-pointer text-[#6e5a51]"
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
                  className="w-full bg-transparent border border-[#dfa38f] rounded-md py-2 px-3 focus:ring-1 focus:ring-[#dfa38f] focus:outline-none text-xs text-[#5a3a2e]"
                  placeholder="http://localhost:5000"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={testConnection}
                  className="bg-transparent hover:bg-white/30 text-[#6e5a51] font-bold px-3 py-1.5 rounded-md transition duration-200 text-xs border border-[#dfa38f] flex items-center justify-center gap-1 cursor-pointer"
                >
                  Test Connection
                </button>
                <button 
                  type="button"
                  onClick={handleSaveApiUrl}
                  className="bg-gradient-to-r from-[#ab7e66] to-[#dfa38f] text-white px-5 py-1.5 rounded-md font-bold hover:opacity-90 active:scale-95 transition-all border border-[#dfa38f] cursor-pointer text-xs"
                >
                  Save
                </button>
              </div>
            </div>
            {connectionTest.status !== 'idle' && (
              <div className={`p-2.5 rounded-md border text-xs flex items-start gap-2 ${
                connectionTest.status === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800' 
                  : 'bg-red-500/10 border-red-500/40 text-red-800'
              }`}>
                <span className="material-symbols-outlined shrink-0 text-base mt-0.5">info</span>
                <div>
                  <p className="font-bold">{connectionTest.status === 'success' ? 'Connected successfully' : 'Connection failed'}</p>
                  <p className="text-[10.5px] mt-0.5 opacity-90">{connectionTest.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        
      {/* 1. Header Welcome Banner */}
      <section className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-md px-3.5 py-2 flex items-center justify-between gap-3 shrink-0 shadow-md">
        <div className="flex items-center gap-2.5 animate-in fade-in duration-300">
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-base md:text-lg text-[#5a3a2e] font-extrabold tracking-tight">Welcome back, Julian!</h1>
          <span className="px-2.5 py-0.5 rounded-md bg-transparent text-[#7a4b3d] text-[9px] font-black uppercase tracking-wider border border-[#dfa38f] flex items-center gap-1">
            <span className="material-symbols-outlined text-[11px] font-black text-[#d4af37]">workspace_premium</span>
            {totalCurrentXP.toLocaleString()} XP
          </span>
        </div>
      </section>

      {/* Achievement Badges Showcase & Modal */}
      <BadgeShowcaseWidget badges={userBadges} />
      <BadgeCelebrationModal badge={celebrationBadge} onClose={() => setCelebrationBadge(null)} />

      {/* Next Recommended Lesson Card */}
      {dashboardSummary?.nextRecommendedLesson && (
        <NextRecommendedLessonCard
          recommendedLesson={dashboardSummary.nextRecommendedLesson}
          onNavigate={onNavigate}
        />
      )}

      {/* Main Grid Layout (3 on top, 3 at the bottom) - Compact fit for 100% viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 min-h-0">
        
        {/* Card 1: Overall Progress */}
        <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-md p-3 flex flex-col justify-between h-[185px] shrink-0 gap-1.5 shadow-md">
          <div className="flex justify-between items-center shrink-0">
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs uppercase tracking-wider text-[#6e5a51]">Overall Progress</h3>
          </div>
          <div className="flex flex-col flex-grow justify-between py-0.5">
            <div className="flex items-center justify-around gap-2 my-auto">
              {/* Circular Meter */}
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="masteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ab7e66" />
                      <stop offset="100%" stopColor="#dfa38f" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" fill="transparent" r="26" stroke="#f2dfd7" strokeWidth="4"></circle>
                  <circle 
                    className="progress-circle text-[#6e5a51]" 
                    cx="32" 
                    cy="32" 
                    fill="transparent" 
                    r="26" 
                    stroke="url(#masteryGrad)" 
                    strokeLinecap="round" 
                    strokeWidth="4.5"
                    style={{
                      strokeDasharray: '163.3',
                      strokeDashoffset: `calc(163.3 - (163.3 * ${mastery}) / 100)`
                    }}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-display-lg text-xs text-[#3d251c] font-black">{mastery}%</span>
                  <span className="text-[6.5px] font-bold text-[#81756f] uppercase tracking-widest leading-none mt-0.5">Mastery</span>
                </div>
              </div>

              {/* Progress Text Details */}
              <div className="flex flex-col min-w-0">
                <p className="text-[8.5px] font-bold uppercase tracking-widest text-[#81756f]">Julian's Progress</p>
                <p className="text-lg font-black text-[#3d251c] leading-tight mt-0.5">{completedCount}</p>
                <p className="text-[8.5px] text-[#6e5a51] font-semibold">Lessons Completed</p>
                <p className="text-[7.5px] text-[#ab7e66] italic">Keep practicing daily!</p>
              </div>
            </div>

            {/* Resume Button */}
            <button 
              onClick={() => alert("Resuming your last video masterclass...")}
              className="w-full bg-gradient-to-r from-[#ab7e66] to-[#dfa38f] hover:from-[#856758] hover:to-[#ab7e66] text-white font-bold text-[9.5px] uppercase tracking-wider py-1.5 rounded-md shadow-xs transition-all duration-300 border border-[#dfa38f] cursor-pointer flex items-center justify-center gap-1 active:scale-98 shrink-0"
            >
              <span className="material-symbols-outlined text-[13px]">play_circle</span>
              Resume Lesson
            </button>
          </div>
        </div>

        {/* Card 2: Weekly Practice Intensity */}
        <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-md p-3 flex flex-col justify-between h-[185px] shrink-0 gap-1.5 shadow-md">
          <div className="flex justify-between items-center shrink-0">
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs uppercase tracking-wider text-[#6e5a51]">Weekly Practice Intensity</h3>
          </div>
          <div className="flex items-end justify-between gap-2 px-1 h-[100px] mt-1 shrink-0">
            {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => {
              const dayCompletedCount = completedLessons.filter(c => c.day === day).length
              const barHeight = `${Math.min(80, 8 + dayCompletedCount * 14)}px`

              return (
                <div key={day} className="flex flex-col items-center gap-1 w-full justify-end animate-in fade-in duration-300">
                  <div className="w-full flex flex-col justify-end h-[80px]">
                    <div 
                      className="bg-gradient-to-t from-[#ab7e66] to-[#dfa38f] hover:to-[#eec0b2] rounded-xs w-full transition-all duration-300 border border-[#dfa38f]/40" 
                      style={{ height: barHeight }} 
                      title={`${dayCompletedCount} Lessons Completed`}
                    ></div>
                  </div>
                  <span className="text-[9px] font-bold text-[#4f4540]">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Student To Do List */}
        <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-md p-3 flex flex-col h-[185px] shrink-0 gap-2 shadow-md">
          <div className="flex justify-between items-start shrink-0">
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs uppercase tracking-wider text-[#6e5a51]">Student To Do List</h3>
          </div>

          <div className="flex flex-col gap-1.5 flex-grow min-h-0">
            {/* Form */}
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-[8.5px] uppercase tracking-wider text-[#81756f]">
                  {editingId ? 'Edit Task' : 'Add Task'}
                </h4>
                {editingId && (
                  <button 
                    onClick={handleCancelEdit} 
                    className="text-[8.5px] font-bold text-[#81756f] hover:text-red-500 bg-transparent border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <form onSubmit={handleAddOrUpdateTodo} className="flex gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="E.g., Practice Misty chord runs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-grow bg-transparent border border-[#dfa38f]/50 rounded-md px-2.5 py-1 text-[#5a3a2e] placeholder:text-[#ab7e66]/60 focus:outline-none focus:border-[#dfa38f] text-[9.5px] font-medium"
                />
                <button
                  type="submit"
                  className="bg-transparent border border-[#dfa38f] text-[#6e5a51] font-bold px-2.5 py-1 rounded-md text-[9.5px] hover:bg-white/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  {editingId ? 'Save' : 'Add'}
                </button>
              </form>
            </div>

            {/* Items List */}
            <div className="flex flex-col min-h-0 flex-grow gap-1">
              <h4 className="font-bold text-[8.5px] uppercase tracking-wider text-[#81756f] shrink-0">My Tasks ({todos.length})</h4>
              <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                {todos.length === 0 ? (
                  <p className="text-[9.5px] text-[#4f4540] italic py-0.5">No tasks added. Add tasks above to track your practice!</p>
                ) : (
                  todos.map((todo) => (
                    <div key={todo.id} className="p-1.5 bg-transparent border border-[#dfa38f]/40 rounded-md flex items-start justify-between gap-1.5 group animate-in fade-in duration-200 hover:bg-white/10">
                      <button 
                        type="button"
                        onClick={() => handleToggleTodo(todo.id)}
                        className="mt-0.5 shrink-0 bg-transparent border-none cursor-pointer focus:outline-none flex items-center justify-center p-0"
                      >
                        {todo.isCompleted ? (
                          <div className="w-4 h-4 rounded-md bg-transparent border-1.5 border-[#b76e79] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#b76e79] text-[10px] font-black">check</span>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-md bg-transparent border-1.5 border-[#dfa38f]/60 flex items-center justify-center transition-all duration-200"></div>
                        )}
                      </button>
                      <div className="flex-grow min-w-0">
                        <p className={`text-[9.5px] font-semibold truncate ${todo.isCompleted ? 'line-through text-[#81756f]' : 'text-[#5a3a2e]'}`}>{todo.title}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0 self-center">
                        <button 
                          type="button"
                          onClick={() => handleEditTodo(todo)}
                          className="text-[8px] font-bold uppercase text-[#81756f] hover:text-[#3d251c] bg-transparent border-none cursor-pointer"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <span className="text-[#81756f]/40 text-[7px] select-none">•</span>
                        <button 
                          type="button"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-[8px] font-bold uppercase text-[#81756f] hover:text-red-500 bg-transparent border-none cursor-pointer"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Accomplishments */}
        <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-md p-3 flex flex-col h-[185px] shrink-0 gap-2 shadow-md">
          <div className="flex justify-between items-center shrink-0">
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs uppercase tracking-wider text-[#6e5a51]">Accomplishments</h3>
            <div className="flex items-center gap-1 bg-transparent border border-[#dfa38f]/50 px-1.5 py-0.5 rounded-md">
              <button 
                onClick={() => handleUpdateStreak(-1)} 
                className="w-3.5 h-3.5 bg-transparent border-none text-[#6e5a51] hover:text-[#3d251c] flex items-center justify-center font-bold cursor-pointer text-xs focus:outline-none"
                title="Decrease Streak"
              >
                -
              </button>
              <span className="text-[9px] font-bold text-[#6e5a51]" title="Practice Streak (Days)">{streak}d Streak</span>
              <button 
                onClick={() => handleUpdateStreak(1)} 
                className="w-3.5 h-3.5 bg-transparent border-none text-[#6e5a51] hover:text-[#3d251c] flex items-center justify-center font-bold cursor-pointer text-xs focus:outline-none"
                title="Increase Streak"
              >
                +
              </button>
            </div>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-grow pr-1 custom-scrollbar min-h-0">
            {ACCOMPLISHMENTS.map((ach) => {
              const isUnlocked = checkAccomplishmentUnlocked(ach.id, completedLessons.map(c => c.title), streak)
              return (
                <div 
                  key={ach.id} 
                  className={`flex items-start gap-2 p-1.5 rounded-md border border-[#dfa38f]/40 bg-transparent transition-all duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center border border-[#dfa38f]/50 shrink-0 ${isUnlocked ? 'bg-transparent text-[#6e5a51]' : 'bg-transparent text-[#81756f]'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {isUnlocked ? ach.icon : 'lock'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[10px] font-bold text-[#3d251c] truncate">{ach.title}</p>
                      <span className={`text-[7.5px] font-bold px-1 py-0.2 rounded-md shrink-0 border ${isUnlocked ? 'bg-emerald-500/10 text-emerald-800 border-emerald-400/30' : 'bg-gray-500/10 text-gray-600 border-gray-400/30'}`}>
                        +{ach.xp} XP
                      </span>
                    </div>
                    <p className="text-[8.5px] text-[#4f4540] mt-0.5 leading-tight">
                      {isUnlocked ? ach.description : ach.requirementText}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card 5: Live Studio */}
        <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-md p-3 flex flex-col h-[185px] shrink-0 gap-1.5 shadow-md min-h-0">
          <div className="flex justify-between items-center shrink-0">
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs uppercase tracking-wider text-[#6e5a51]">Live Studio</h3>
            <a className="text-[#6e5a51] text-[9.5px] font-bold hover:underline cursor-pointer" onClick={() => onNavigate('sessions')}>View All</a>
          </div>
          <div className="flex-grow flex flex-col justify-between min-h-0 py-0.5 gap-1.5">
            <div className="p-2 rounded-md bg-transparent hover:bg-white/10 transition-colors border border-[#dfa38f]/40 cursor-pointer w-full" onClick={() => onNavigate('sessions')}>
              <div className="flex justify-between items-start mb-0.5 gap-1">
                <span className="bg-transparent border border-[#dfa38f] text-[#524037] px-1.5 py-0.2 rounded-md text-[7.5px] font-bold uppercase tracking-wider">Oct 26 • 2:00 PM</span>
              </div>
              <h4 className="font-bold text-[9.5px] text-[#1d1b1a] truncate">Advanced Jazz Voicings &amp; Transitional Runs</h4>
              <p className="text-[8px] text-[#4f4540]">with Stephanie Halim</p>
            </div>
            <button 
              onClick={() => {
                alert("Redirecting to Live Studio Zoom Session...\nMeeting Link: https://zoom.us/j/8889991111\n\n(Dummy Zoom link generated for simulation)");
                window.open("https://zoom.us/j/8889991111", "_blank");
              }}
              className="w-full bg-transparent hover:bg-white/20 text-[#6e5a51] font-bold text-[9.5px] py-1.5 rounded-md transition-all border border-[#dfa38f] cursor-pointer shrink-0"
            >
              Join Waiting Room
            </button>
          </div>
        </div>

        {/* Card 6: Saved for Later */}
        <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-md p-3 flex flex-col h-[185px] shrink-0 gap-1.5 shadow-md min-h-0">
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-bold text-xs uppercase tracking-wider text-[#6e5a51]">Saved for Later</h3>
          <div className="space-y-1.5 overflow-y-auto flex-grow pr-1 custom-scrollbar min-h-0">
            {savedItems.filter(item => item.type === 'pdf' || item.type === 'video').length === 0 ? (
              <p className="text-[9.5px] text-[#81756f] italic py-1">No saved items. Bookmark lessons or PDFs from the Courses page to save them here.</p>
            ) : (
              savedItems
                .filter(item => item.type === 'pdf' || item.type === 'video')
                .map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 p-1.5 bg-transparent hover:bg-white/10 border border-[#dfa38f]/40 rounded-md cursor-pointer transition-all animate-in fade-in duration-200" 
                    onClick={() => {
                      if (item.type === 'pdf') {
                        localStorage.setItem('redirect_course_pdf', item.title);
                      } else {
                        localStorage.setItem('redirect_lesson', item.title);
                      }
                      onNavigate('courses');
                    }}
                  >
                    <div className="w-7 h-7 rounded-md bg-transparent overflow-hidden shrink-0 border border-[#dfa38f]/50 flex items-center justify-center text-[#6e5a51]">
                      <span className="material-symbols-outlined text-sm">
                        {item.type === 'pdf' ? 'picture_as_pdf' : 'play_circle'}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[9.5px] font-bold text-[#1d1b1a] truncate">{item.title}</p>
                      <p className="text-[8px] text-[#4f4540] truncate">{item.meta}</p>
                    </div>
                    <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleUnsaveItem(item.id, e)}
                        className="text-[7.5px] font-bold uppercase tracking-widest text-[#81756f] hover:text-red-500 bg-transparent border-none cursor-pointer transition-all pr-0.5"
                        title="Unsave"
                      >
                        Unsave
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

      </div>

    </main>
  );
}

export default Dashboard;
