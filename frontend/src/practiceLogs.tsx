import { useState } from 'react'
import { levels } from './courseData'
import { GlassDropdownButton } from './components/GlassDropdownButton'


/*
interface FeedbackMessage {
  id: string
  name: string
  rating: number
  message: string
  timeAgo: string
}
*/

interface PracticeLog {
  id: string
  studentName: string
  avatar: string
  date: string
  levelNumber: number
  levelTitle: string
  topicTitle: string
  lessonTitle: string
  notes: string
}

interface PracticeLogsProps {
  onNavigate: (view: 'home' | 'dashboard' | 'library' | 'courses' | 'sessions') => void
}

function PracticeLogs({ onNavigate }: PracticeLogsProps) {
  /*
  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackAlert, setFeedbackAlert] = useState<string | null>(null)
  */

  /*
  // Feedback list state (simulated)
  const [feedbacks] = useState<FeedbackMessage[]>([
    {
      id: '1',
      name: 'Michael K.',
      rating: 5,
      message: 'The breathing rhythm exercise is highly effective. Thank you for designing this mindful sanctuary.',
      timeAgo: 'Just now'
    }
  ])
  */

  // Practice Log Feed State
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([
    {
      id: '1',
      studentName: 'Marcus Sterling',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      date: '2026-07-14',
      levelNumber: 1,
      levelTitle: 'Level 1: Piano Foundations',
      topicTitle: 'Beginner Songs',
      lessonTitle: 'Ode to Joy (Jazz Style)',
      notes: 'Focusing on wrist relaxation and transitioning between chords smoothly. Getting the swing feel down is so rewarding!'
    },
    {
      id: '2',
      studentName: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      date: '2026-07-12',
      levelNumber: 2,
      levelTitle: 'Level 2: The Complete 12-Key System',
      topicTitle: 'C Major & A Minor',
      lessonTitle: 'Chord Inversions',
      notes: "Worked on finger independence when moving from root position to first inversion chords in C Major. It's getting faster!"
    },
    {
      id: '3',
      studentName: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      date: '2026-07-10',
      levelNumber: 1,
      levelTitle: 'Level 1: Piano Foundations',
      topicTitle: 'Piano Basics',
      lessonTitle: 'Proper Posture & Hand Position',
      notes: 'Practicing keeping hands curved and avoiding tension in the shoulders. Sitting up straight helps so much with octave reach!'
    },
    {
      id: '4',
      studentName: 'Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
      date: '2026-07-09',
      levelNumber: 2,
      levelTitle: 'Level 2: The Complete 12-Key System',
      topicTitle: 'C Major & A Minor',
      lessonTitle: 'The C Major Scale',
      notes: 'Mastered the finger tuck technique under the 3rd finger when moving up. Scale transitions are becoming second nature!'
    },
    {
      id: '5',
      studentName: 'James Patterson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      date: '2026-07-08',
      levelNumber: 1,
      levelTitle: 'Level 1: Piano Foundations',
      topicTitle: 'Rhythm Basics',
      lessonTitle: 'Playing on the Beat',
      notes: 'Used a metronome at 60bpm to stay super steady on quarter and eighth notes. Timing feels much tighter now.'
    },
    {
      id: '6',
      studentName: 'Sophia Martinez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      date: '2026-07-07',
      levelNumber: 2,
      levelTitle: 'Level 2: The Complete 12-Key System',
      topicTitle: 'Key Signatures',
      lessonTitle: 'Sharps & Flats Introduction',
      notes: 'Memorizing the order of sharps (FCGDAEB) using mnemonics. Looking forward to practicing in G major next week!'
    },
    {
      id: '7',
      studentName: 'Daniel Kim',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
      date: '2026-07-05',
      levelNumber: 1,
      levelTitle: 'Level 1: Piano Foundations',
      topicTitle: 'Beginner Songs',
      lessonTitle: 'Mary Had a Little Lamb',
      notes: 'Played the melody flawlessly with the right hand. Working on adding basic left-hand drone notes next.'
    },
    {
      id: '8',
      studentName: 'Chloe Bennett',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
      date: '2026-07-04',
      levelNumber: 2,
      levelTitle: 'Level 2: The Complete 12-Key System',
      topicTitle: 'Chord Inversions',
      lessonTitle: 'Introduction to Inversions',
      notes: 'Swapping positions of notes within triads. Triad transitions are becoming incredibly smooth. Extremely helpful concept!'
    }
  ])

  // New Practice Log Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLevelNumber, setSelectedLevelNumber] = useState(1)
  const [selectedTopicTitle, setSelectedTopicTitle] = useState('Piano Basics')
  const [selectedLessonTitle, setSelectedLessonTitle] = useState('Introduction to the Piano')
  const [practiceDate, setPracticeDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [practiceNotes, setPracticeNotes] = useState('')
  const [systemAlert, setSystemAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(practiceLogs.length / itemsPerPage)
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)
  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLogs = practiceLogs.slice(startIndex, endIndex)

  // Get active lists for level logging dropdown selection flow
  const activeLevelObj = levels.find(l => l.number === selectedLevelNumber)
  const availableTopics = activeLevelObj ? activeLevelObj.topics : []
  const activeTopicObj = availableTopics.find(t => t.title === selectedTopicTitle)
  const availableLessons = activeTopicObj ? activeTopicObj.lessons : []

  // Handle Level selection changes in modal
  const handleLevelChange = (levelNum: number) => {
    setSelectedLevelNumber(levelNum)
    const lvl = levels.find(l => l.number === levelNum)
    if (lvl && lvl.topics.length > 0) {
      setSelectedTopicTitle(lvl.topics[0].title)
      if (lvl.topics[0].lessons.length > 0) {
        setSelectedLessonTitle(lvl.topics[0].lessons[0].title)
      } else {
        setSelectedLessonTitle('')
      }
    } else {
      setSelectedTopicTitle('')
      setSelectedLessonTitle('')
    }
  }

  // Handle Topic selection changes in modal
  const handleTopicChange = (title: string) => {
    setSelectedTopicTitle(title)
    const topic = availableTopics.find(t => t.title === title)
    if (topic && topic.lessons.length > 0) {
      setSelectedLessonTitle(topic.lessons[0].title)
    } else {
      setSelectedLessonTitle('')
    }
  }

  /*
  // Handle Feedback Submit
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackName || !feedbackMessage) return

    setFeedbackName('')
    setFeedbackMessage('')
    setFeedbackRating(5)
    setFeedbackAlert("Thank you! Your feedback has been submitted successfully.")
    setTimeout(() => setFeedbackAlert(null), 5000)
  }
  */

  // Handle Log Practice Submit
  const handleLogPracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!practiceNotes.trim()) return

    const lvlObj = levels.find(l => l.number === selectedLevelNumber)
    const newLog: PracticeLog = {
      id: Date.now().toString(),
      studentName: 'You (Student)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      date: practiceDate,
      levelNumber: selectedLevelNumber,
      levelTitle: lvlObj ? `${lvlObj.title}: ${lvlObj.subtitle}` : `Level ${selectedLevelNumber}`,
      topicTitle: selectedTopicTitle,
      lessonTitle: selectedLessonTitle,
      notes: practiceNotes
    }

    setPracticeLogs([newLog, ...practiceLogs])
    setCurrentPage(1)
    setPracticeNotes('')
    setIsModalOpen(false)

    setSystemAlert({
      type: 'success',
      message: 'Your practice session has been logged successfully!'
    })
    setTimeout(() => setSystemAlert(null), 5000)
  }

  return (
    <>
      <main className="pt-16 pb-24 flex-grow relative overflow-hidden bg-[#eedcd5]">
        {/* Luxury Blurred Book Backdrop Background Layer */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/tuts.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(1px) opacity(0.55) scale(1.01)',
          }}
        />
        {/* Soft, balanced custom gradient overlay (cocoa - mocha - latte milk) */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#f4eae4]/85 via-[#eedcd5]/80 to-[#ebd8cf]/85" />
        
        {/* Ambient background decoration blobs */}
        <div className="absolute top-24 left-1/4 w-72 h-72 bg-[#ffd89b]/25 rounded-full blur-[80px] pointer-events-none z-0"></div>
        <div className="absolute bottom-24 right-1/4 w-80 h-80 bg-[#dfa38f]/20 rounded-full blur-[90px] pointer-events-none z-0"></div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 space-y-8">
          
          {/* Global System Alerts */}
          {systemAlert && (
            <div className="max-w-[1200px] mx-auto mb-6 animate-fade-in">
              <div className="p-4 rounded-[6px] border bg-[#faf6f4] border-[#dfa38f]/40 text-[#6e5a51] flex items-start gap-3 shadow-sm">
                <span className="material-symbols-outlined shrink-0 text-base text-[#dfa38f]">check_circle</span>
                <div className="text-xs font-semibold">
                  {systemAlert.message}
                </div>
              </div>
            </div>
          )}

          {/* Content Layout - Stacked Sections */}
          <div className="space-y-12 w-full">
            
            {/* TOP SECTION: Practice Logs Board */}
            <div className="space-y-6">
              
              {/* Header / Log Practice Trigger */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#dfa38f] text-2xl">music_note</span>
                  <h2 className="font-display-lg text-lg font-extrabold text-[#4a372e] tracking-wide uppercase drop-shadow-sm">
                    Practice Logs Board
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <GlassDropdownButton
                    label="Tambah"
                    onMainClick={() => setIsModalOpen(true)}
                    options={[
                      {
                        id: 'tambah-data',
                        label: 'Tambah Data',
                        onClick: () => setIsModalOpen(true),
                        icon: (
                          <svg className="w-3.5 h-3.5 text-[#E1B5A3] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        ),
                      },
                      {
                        id: 'import-excel',
                        label: 'Import Excel',
                        onClick: () => setSystemAlert({ type: 'success', message: 'Import Excel berhasil disimulasikan.' }),
                        icon: (
                          <svg className="w-3.5 h-3.5 text-[#E1B5A3] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 14.5 4.5M12 3v13.5" />
                          </svg>
                        ),
                      },
                    ]}
                  />

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 bg-[#fbece7] hover:bg-[#f6dad0] active:scale-95 text-[#785b4f] border border-[#dfa38f]/30 rounded-[8px] font-bold uppercase tracking-wider text-[10px] shadow-sm transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-1.5 h-[40px]"
                  >
                    <span className="material-symbols-outlined text-sm text-[#785b4f]">edit</span>
                    Log Session
                  </button>
                </div>
              </div>

              {/* Logs Feed Container - Unified Card */}
              <div className="bg-[#fffcfb]/80 backdrop-blur-xl border border-[#e8cdc1]/60 shadow-[0_10px_30px_rgba(45,41,38,0.06)] p-6 rounded-2xl space-y-4">
                {paginatedLogs.length === 0 ? (
                  <p className="text-sm text-[#6e5a51] text-center py-8">
                    No practice logs found. Share your first logged practice session!
                  </p>
                ) : (
                  <div className="divide-y divide-[#dfa38f]/20">
                    {paginatedLogs.map((log, index) => (
                      <div 
                        key={log.id} 
                        className={`flex items-center justify-between gap-4 py-3.5 ${index === 0 ? 'pb-3.5' : ''} ${index > 0 ? 'py-3.5' : ''}`}
                      >
                        {/* Left Side: Avatar + Student info */}
                        <div className="flex items-center gap-3 w-44 shrink-0">
                          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#dfa38f]/30 p-0.5 bg-[#fbece7] flex items-center justify-center">
                            {log.avatar ? (
                              <img className="w-full h-full object-cover rounded-full" alt={log.studentName} src={log.avatar} />
                            ) : (
                              <span className="material-symbols-outlined text-[#e8cdc1] text-lg">person</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#4a372e] text-xs truncate">
                              {log.studentName}
                            </div>
                            <div className="text-[9px] text-[#8a6858]">
                              {log.date}
                            </div>
                          </div>
                        </div>

                        {/* Center Side: Course pathway & compact notes */}
                        <div className="flex-grow min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-[#dfa38f]/10 border border-[#dfa38f]/20 text-[#854d38] px-1.5 py-0.5 rounded-[3px] text-[8px] font-extrabold uppercase tracking-wider">
                              Level {log.levelNumber}
                            </span>
                            <span className="text-[10px] text-[#8a6858] font-bold truncate">
                              {log.topicTitle} &bull; {log.lessonTitle}
                            </span>
                          </div>
                          <p className="text-xs text-[#5c453c] truncate leading-tight" title={log.notes}>
                            {log.notes}
                          </p>
                        </div>

                        {/* Right Side: View Course button */}
                        <div className="shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              localStorage.setItem('redirect_level', log.levelNumber.toString());
                              localStorage.setItem('redirect_topic', log.topicTitle);
                              localStorage.setItem('redirect_lesson', log.lessonTitle);
                              onNavigate('courses');
                            }}
                            className="px-3 py-1.5 bg-[#fdfaf7] hover:bg-[#f6eae0] border border-[#dfa38f]/50 text-[#ab7e66] rounded-[4px] text-[9px] font-extrabold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-xs">menu_book</span>
                            View
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-6 border-t border-[#dfa38f]/20 mt-6 text-xs text-[#5c453c] font-semibold">
                        <button
                          type="button"
                          disabled={validCurrentPage === 1}
                          onClick={() => {
                            setCurrentPage(prev => Math.max(prev - 1, 1))
                          }}
                          className="px-4 py-2 bg-[#fdfaf7] hover:bg-[#f6eae0] border border-[#dfa38f]/50 text-[#ab7e66] disabled:opacity-40 disabled:cursor-not-allowed rounded-[4px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">chevron_left</span>
                          Previous
                        </button>
                        <span className="font-bold text-[#4a372e]">
                          Page {validCurrentPage} of {totalPages}
                        </span>
                        <button
                          type="button"
                          disabled={validCurrentPage === totalPages}
                          onClick={() => {
                            setCurrentPage(prev => Math.min(prev + 1, totalPages))
                          }}
                          className="px-4 py-2 bg-[#fdfaf7] hover:bg-[#f6eae0] border border-[#dfa38f]/50 text-[#ab7e66] disabled:opacity-40 disabled:cursor-not-allowed rounded-[4px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          Next
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Log Practice Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-[#21110a]/50 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-[#fbf3ee] max-w-xl w-full rounded-2xl border-[3px] border-[#dfa38f] shadow-2xl p-8 relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                
                <div className="flex justify-between items-center border-b border-[#e8cdc1]/20 pb-4">
                  <h2 className="font-display-lg text-xl font-bold text-[#4a372e]">
                    Log a Practice Session
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 text-[#b2a49f] hover:text-[#856758] bg-transparent border-none cursor-pointer focus:outline-none transition-colors"
                  >
                    <span className="material-symbols-outlined text-2xl">close</span>
                  </button>
                </div>

                <form onSubmit={handleLogPracticeSubmit} className="space-y-5">
                  
                  {/* Level Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#6e5a51] uppercase tracking-wider mb-2">
                      Select Level
                    </label>
                    <select
                      value={selectedLevelNumber}
                      onChange={(e) => handleLevelChange(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#faf6f4] border border-[#e8cdc1]/50 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] text-[#4f4540] text-sm transition-all"
                    >
                      {levels.map(lvl => (
                        <option key={lvl.number} value={lvl.number}>
                          {lvl.title} - {lvl.subtitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Topic Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#6e5a51] uppercase tracking-wider mb-2">
                      Select Topic
                    </label>
                    <select
                      value={selectedTopicTitle}
                      onChange={(e) => handleTopicChange(e.target.value)}
                      className="w-full px-4 py-3 bg-[#faf6f4] border border-[#e8cdc1]/50 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] text-[#4f4540] text-sm transition-all"
                    >
                      {availableTopics.map(topic => (
                        <option key={topic.title} value={topic.title}>
                          {topic.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lesson Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#6e5a51] uppercase tracking-wider mb-2">
                      Select Lesson
                    </label>
                    <select
                      value={selectedLessonTitle}
                      onChange={(e) => setSelectedLessonTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-[#faf6f4] border border-[#e8cdc1]/50 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] text-[#4f4540] text-sm transition-all"
                    >
                      {availableLessons.map(lesson => (
                        <option key={lesson.title} value={lesson.title}>
                          {lesson.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date of Practice */}
                  <div>
                    <label className="block text-xs font-bold text-[#6e5a51] uppercase tracking-wider mb-2">
                      Date of Practice
                    </label>
                    <input
                      type="date"
                      required
                      value={practiceDate}
                      onChange={(e) => setPracticeDate(e.target.value)}
                      className="w-full px-4 py-3 bg-[#faf6f4] border border-[#e8cdc1]/50 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] text-[#4f4540] text-sm transition-all"
                    />
                  </div>

                  {/* Practice Notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#6e5a51] uppercase tracking-wider mb-2">
                      Practice Notes &amp; Breakthroughs
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={practiceNotes}
                      onChange={(e) => setPracticeNotes(e.target.value)}
                      placeholder="Describe what you focused on today, your struggles, finger patterns, or breakthroughs..."
                       className="w-full px-4 py-3 bg-[#faf6f4] border border-[#e8cdc1]/50 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] text-[#4f4540] text-sm resize-none transition-all"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-[#e8cdc1]/20">
                     <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 bg-transparent text-[#ab7e66] hover:text-[#856758] rounded-[4px] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#fbece7] hover:bg-[#f6dad0] active:scale-95 text-[#785b4f] border border-[#dfa38f]/30 rounded-[4px] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm"
                    >
                      Publish Practice Log
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  )
}

export default PracticeLogs
