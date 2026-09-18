import { levels } from './courseData'

export interface Accomplishment {
  id: string
  title: string
  tier: string
  xp: number
  description: string
  icon: string
  bgColor: string
  requirementText: string
}

export const initialCompletedSeed = [
  { title: "1-Module 1.1 — Orientation-V1.1.1", day: "Mon" },
  { title: "1-Module 1.1 — Orientation-V1.1.2", day: "Mon" },
  { title: "1-Module 1.1 — Orientation-V1.1.3", day: "Tue" }
]

export const ACCOMPLISHMENTS: Accomplishment[] = [
  {
    id: 'phanilie_foundations',
    title: 'Phanilie Foundations Certificate',
    tier: 'Tier 1',
    xp: 500,
    description: 'Sertifikasi awal berhasil diraih. Anda telah menguasai dasar-dasar mekanika piano, postur bermain yang benar, fundamental ritme, serta pembentukan memori otot jari awal.',
    icon: 'military_tech',
    bgColor: 'bg-[#f9ddd1]',
    requirementText: 'Graduation: Complete at least 37 lessons in Level 1'
  },
  {
    id: '12key_fluency',
    title: '12-Key Fluency Certification',
    tier: 'Special Milestone',
    xp: 2000,
    description: 'Pencapaian luar biasa atas penguasaan seluruh tangga nada mayor, minor, inversi, serta progresi akor diatonis secara merata di seluruh 12 kunci nada.',
    icon: 'workspace_premium',
    bgColor: 'bg-[#f2dfd7]',
    requirementText: 'Milestone: Complete all 168 sub-items in Level 2'
  },
  {
    id: 'applied_harmony',
    title: 'Applied Harmony & Improvisation Certificate',
    tier: 'Tier 2',
    xp: 1000,
    description: 'Sertifikasi tingkat menengah berhasil diselesaikan. Menandakan penguasaan mendalam pada koordinasi dua tangan, pengenalan interval, konstruksi seventh chords, hingga konsep dasar harmoni jazz modern.',
    icon: 'verified',
    bgColor: 'bg-[#e8cdc1]',
    requirementText: 'Complete Levels 3, 4, 5, and 6 (100%)'
  },
  {
    id: 'professional_arranging',
    title: 'Professional Arranging & Voicings Diploma',
    tier: 'Tier 3',
    xp: 1500,
    description: 'Sertifikasi profesional aransemen berhasil dicapai. Anda kini menguasai arsitektur harmoni tingkat tinggi, mulai dari teknik Rootless Voicings, Block Chords, Drop 2, hingga penataan struktur Quartal Voicings.',
    icon: 'school',
    bgColor: 'bg-[#ffd89b]',
    requirementText: 'Complete Levels 7, 8, 9, and 10 (100%)'
  },
  {
    id: 'professional_artist',
    title: 'Phanilie Professional Artist Diploma',
    tier: 'Tier 4 - Highest',
    xp: 3000,
    description: 'Kredensial tertinggi di Phanilie Music. Anda telah membuktikan kemahiran bermain piano tingkat lanjut lintas genre, memimpin ansambel musik secara profesional, serta menuntaskan Final Artist Showcase secara mandiri.',
    icon: 'stars',
    bgColor: 'bg-[#ffd5c2]',
    requirementText: 'Complete Levels 11 and 12 (100%)'
  },
  {
    id: 'consistency_ribbon',
    title: '7-Day Consistency Ribbon',
    tier: 'Practice Engagement',
    xp: 300,
    description: 'Konsistensi adalah kunci kemajuan teknis. Anda berhasil mempertahankan disiplin latihan harian selama 7 hari berturut-turut.',
    icon: 'workspace_premium',
    bgColor: 'bg-[#f3ecea]',
    requirementText: 'Maintain a 7-day practice streak'
  }
]

export const getLevelLessonsCount = (levelNumber: number): number => {
  const lvl = levels.find(l => l.number === levelNumber)
  if (!lvl) return 0
  let total = 0
  lvl.topics.forEach(topic => {
    topic.lessons.forEach(lesson => {
      if (lesson.subItems && lesson.subItems.length > 0) {
        total += lesson.subItems.length
      } else {
        total += 1
      }
    })
  })
  return total
}

export const getLevelCompletedCount = (levelNumber: number, completedList: string[]): number => {
  return completedList.filter(id => id.startsWith(`${levelNumber}-`)).length
}

export const isLevelFullyCompleted = (levelNumber: number, completedList: string[]): boolean => {
  const total = getLevelLessonsCount(levelNumber)
  const completed = getLevelCompletedCount(levelNumber, completedList)
  return total > 0 && completed >= total
}

export const checkAccomplishmentUnlocked = (
  id: string,
  completedList: string[],
  practiceStreak: number
): boolean => {
  switch (id) {
    case 'phanilie_foundations':
      return getLevelCompletedCount(1, completedList) >= 37
    case '12key_fluency':
      return getLevelCompletedCount(2, completedList) >= 168
    case 'applied_harmony':
      return [3, 4, 5, 6].every(num => isLevelFullyCompleted(num, completedList))
    case 'professional_arranging':
      return [7, 8, 9, 10].every(num => isLevelFullyCompleted(num, completedList))
    case 'professional_artist':
      return [11, 12].every(num => isLevelFullyCompleted(num, completedList))
    case 'consistency_ribbon':
      return practiceStreak >= 7
    default:
      return false
  }
}
