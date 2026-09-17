export interface Lesson {
  code?: string
  title: string
  pdf?: string
  subItems?: string[]
}

export interface Module {
  code: string
  title: string
  lessons: Lesson[]
  pdfSummary?: string
}

export interface LevelBadgeInfo {
  name: string
  icon: string
  requirement: string
  reward: string
}

export interface Level {
  number: number
  title: string
  subtitle: string
  targetStudent: string
  estimatedDuration: string
  modulesCount: number
  videosCount: number
  capstoneDescription?: string
  badge: LevelBadgeInfo
  topics: {
    title: string
    lessons: Lesson[]
    pdfSummary?: string
  }[]
}

export interface SkillBadge {
  id: string
  name: string
  icon: string
  description: string
  category: 'Skill' | 'EasterEgg'
}

export const SKILL_BADGES: SkillBadge[] = [
  { id: 'streak_7', name: '7-Day Streak', icon: 'local_fire_department', description: 'Log in & practice 7 consecutive days', category: 'Skill' },
  { id: 'perfect_quiz', name: 'Perfect Quiz', icon: 'stars', description: 'Score 100% on any level quiz', category: 'Skill' },
  { id: 'golden_ear', name: 'Golden Ear', icon: 'hearing', description: 'Pass all ear training exercises in 1 level without remedial', category: 'Skill' },
  { id: 'composer', name: 'Composer', icon: 'edit_note', description: 'Upload 1 original composition to the community', category: 'Skill' },
  { id: 'stage_debut', name: 'Stage Debut', icon: 'mic', description: 'Upload first performance video to the forum', category: 'Skill' },
  { id: 'metronome_ninja', name: 'Metronome Ninja', icon: 'timer', description: 'Complete all rhythm drills with recorded metronome use', category: 'Skill' },
  { id: 'key_12_explorer', name: '12-Key Explorer', icon: 'public', description: 'Master scales in all 12 keys (self-check quiz)', category: 'Skill' },
  { id: 'sight_reader', name: 'Sight Reader', icon: 'auto_stories', description: 'Pass sight-reading test without preparation', category: 'Skill' },
  { id: 'community_helper', name: 'Community Helper', icon: 'diversity_3', description: 'Help answer 10 questions from other students in the forum', category: 'Skill' },
  { id: 'day_100_club', name: '100-Day Club', icon: 'calendar_month', description: '100 total active days in the course', category: 'Skill' },
  { id: 'transcriber', name: 'Transcriber', icon: 'headphones', description: 'Complete 5 solo transcriptions in Levels 5-7', category: 'Skill' },
  { id: 'reviewer', name: 'Reviewer', icon: 'grade', description: 'Leave a course review + testimonial', category: 'Skill' },
  { id: 'night_owl', name: 'Night Owl', icon: 'dark_mode', description: 'Practice past 11 PM 5x (Easter Egg)', category: 'EasterEgg' },
  { id: 'early_bird', name: 'Early Bird', icon: 'wb_sunny', description: 'Practice before 6 AM 5x (Easter Egg)', category: 'EasterEgg' },
  { id: 'no_skip', name: 'No Skip', icon: 'playlist_add_check_circle', description: 'Complete an entire level WITHOUT skipping any video (Easter Egg)', category: 'EasterEgg' }
]

export const levels: Level[] = [
  // ═══════════════════════════════════════════════════════════════
  // LEVEL 1 — ABSOLUTE FUNDAMENTALS
  // ═══════════════════════════════════════════════════════════════
  {
    number: 1,
    title: 'Level 1',
    subtitle: 'Absolute Fundamentals',
    targetStudent: 'Never touched a piano before',
    estimatedDuration: '~4 hours',
    modulesCount: 4,
    videosCount: 20,
    capstoneDescription: 'Play two 5-finger songs from memory',
    badge: {
      name: 'First Notes',
      icon: 'egg',
      requirement: 'Complete all videos + pass Lv.1 quiz',
      reward: 'Digital certificate + community forum access'
    },
    topics: [
      {
        title: 'Module 0.1 — Orientation',
        pdfSummary: 'Printable Roadmap',
        lessons: [
          { code: 'V0.1.1', title: 'Welcome & How to Use This Platform (roadmap, how to access PDFs, how to use badges)', pdf: 'Printable Roadmap' },
          { code: 'V0.1.2', title: 'Getting to Know the Piano: Acoustic vs Digital vs Keyboard vs Synth, which one is right for you' },
          { code: 'V0.1.3', title: 'Piano Anatomy & Pedal Functions (sustain, sostenuto, soft)' },
          { code: 'V0.1.4', title: 'Seating Posture, Bench Height, Correct Arm Position (prevent injury)' },
          { code: 'V0.1.5', title: 'Hand Shape & Ideal Finger Position on the Keys' }
        ]
      },
      {
        title: 'Module 0.2 — Understanding Keys & Notes',
        pdfSummary: 'Keyboard Diagram Labeled with Middle C',
        lessons: [
          { code: 'V0.2.1', title: 'Black Key Patterns (groups of 2 & 3) as the keyboard "map"' },
          { code: 'V0.2.2', title: 'The 7 Note Names: C D E F G A B, and how they repeat per octave' },
          { code: 'V0.2.3', title: 'Quickly Locating Middle C', pdf: 'Keyboard Diagram Labeled with Middle C' },
          { code: 'V0.2.4', title: 'Octave Concepts & Simple Intervals (close vs far)' }
        ]
      },
      {
        title: 'Module 0.3 — Reading Sheet Music from Scratch',
        pdfSummary: 'Note Values Cheat Sheet & Blank Staff',
        lessons: [
          { code: 'V0.3.1', title: 'Staff, Lines, Spaces, and How to Count Note Positions', pdf: 'Blank Staff for Note Writing Practice' },
          { code: 'V0.3.2', title: 'Treble Clef (G Clef): mnemonics for FACE (spaces) & Every Good Boy Does Fine (lines)' },
          { code: 'V0.3.3', title: 'Bass Clef (F Clef): mnemonics for All Cows Eat Grass & Good Boys Do Fine Always' },
          { code: 'V0.3.4', title: 'Grand Staff & Middle C Position in the Center' },
          { code: 'V0.3.5', title: 'Note Values (whole, 1/2, 1/4, 1/8) & Rest Values', pdf: 'Note Values Cheat Sheet' },
          { code: 'V0.3.6', title: 'Time Signatures 4/4, 3/4, 2/4 — how to count beats' }
        ]
      },
      {
        title: 'Module 0.4 — Finger Exercises & First Songs',
        pdfSummary: '10-Minute Daily Warm-Up & Fingering Diagram',
        lessons: [
          { code: 'V0.4.1', title: 'Piano Finger Numbering (1-5 right & left)', pdf: 'Fingering Diagram' },
          { code: 'V0.4.2', title: '5-Finger Exercise in C Position (ascending-descending, basic legato)' },
          { code: 'V0.4.3', title: 'Finger Flexibility & Independence Exercises (without notes, daily drill)', pdf: '10-Minute Daily Warm-Up' },
          { code: 'V0.4.4', title: 'First Song: "Hot Cross Buns" / "Mary Had a Little Lamb" (1 hand)' },
          { code: 'V0.4.5', title: 'Level Recap & Capstone: play two 5-finger songs from memory' }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 2 — BEGINNER
  // ═══════════════════════════════════════════════════════════════
  {
    number: 2,
    title: 'Level 2',
    subtitle: 'Beginner',
    targetStudent: 'Knows keys, cannot read notes fluently',
    estimatedDuration: '~7 hours',
    modulesCount: 5,
    videosCount: 28,
    capstoneDescription: 'Full Sheet Music Capstone Piece',
    badge: {
      name: "Beginner's Touch",
      icon: 'music_note',
      requirement: 'Complete Lv.2 + upload capstone',
      reward: '10% discount on merchandise'
    },
    topics: [
      {
        title: 'Module 1.1 — Expanding Note Reading',
        pdfSummary: 'Interval Practice Guide',
        lessons: [
          { code: 'V1.1.1', title: 'Reading Notes Beyond C Position (stepwise reading)' },
          { code: 'V1.1.2', title: '2nd & 3rd Intervals on Paper & Keyboard', pdf: 'Interval Practice' },
          { code: 'V1.1.3', title: 'Ledger Lines & Notes Above/Below the Staff' },
          { code: 'V1.1.4', title: 'Basic Sight Reading: the "don\'t look at your hands" method' }
        ]
      },
      {
        title: 'Module 1.2 — Advanced Rhythm',
        pdfSummary: 'Rhythm Clapping Sheet',
        lessons: [
          { code: 'V1.2.1', title: 'Dotted Notes & Ties' },
          { code: 'V1.2.2', title: 'Simple Syncopation' },
          { code: 'V1.2.3', title: 'Clapping & Counting Rhythm Practice', pdf: 'Rhythm Clapping Sheet' },
          { code: 'V1.2.4', title: 'Anacrusis / Pick-up Notes' }
        ]
      },
      {
        title: 'Module 1.3 — Scales & Key Signatures',
        pdfSummary: 'C-G-F Scale Diagram',
        lessons: [
          { code: 'V1.3.1', title: 'C, G, F Major Scales (whole-half step pattern)' },
          { code: 'V1.3.2', title: 'Key Signatures: Sharps & Flats, memorization order' },
          { code: 'V1.3.3', title: 'Simple Pentatonic Scales', pdf: 'C-G-F Scale Diagram' },
          { code: 'V1.3.4', title: 'Circle of Fifths — Introduction' }
        ]
      },
      {
        title: 'Module 1.4 — Two Hands & Dynamics',
        pdfSummary: 'Common Musical Symbols (Cheat Sheet)',
        lessons: [
          { code: 'V1.4.1', title: 'Two-Hand Coordination: Simple Parallel Exercises' },
          { code: 'V1.4.2', title: 'Reading the Grand Staff with Both Hands Simultaneously' },
          { code: 'V1.4.3', title: 'Dynamics: p, mf, f, crescendo, decrescendo' },
          { code: 'V1.4.4', title: 'Articulation: Legato vs Staccato' },
          { code: 'V1.4.5', title: 'Basic Sustain Pedal Technique', pdf: 'Common Musical Symbols (Cheat Sheet)' }
        ]
      },
      {
        title: 'Module 1.5 — Basic Chords & Repertoire',
        pdfSummary: 'Full Sheet Music Capstone',
        lessons: [
          { code: 'V1.5.1', title: 'What is a Chord? Basic Major & Minor Triads (C, F, G)' },
          { code: 'V1.5.2', title: 'Broken Chords & Blocked Chords' },
          { code: 'V1.5.3', title: 'Song: "Ode to Joy" 2 Hands' },
          { code: 'V1.5.4', title: 'Song: "Für Elise" (opening section, simplified)' },
          { code: 'V1.5.5', title: 'Level Recap & Capstone Piece', pdf: 'Full Sheet Music Capstone' }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 3 — ELEMENTARY
  // ═══════════════════════════════════════════════════════════════
  {
    number: 3,
    title: 'Level 3',
    subtitle: 'Elementary',
    targetStudent: 'Can play songs fluently with 1 hand',
    estimatedDuration: '~8 hours',
    modulesCount: 5,
    videosCount: 28,
    capstoneDescription: 'Play + Accompany Yourself with Chords',
    badge: {
      name: 'Steady Hands',
      icon: 'front_hand',
      requirement: 'Complete Lv.3',
      reward: 'Access to monthly live Q&A group'
    },
    topics: [
      {
        title: 'Module 2.1 — Advanced Hand Technique',
        pdfSummary: 'Hanon Sheet #1-5',
        lessons: [
          { code: 'V2.1.1', title: '1-Octave Scale Practice with Standard Fingering' },
          { code: 'V2.1.2', title: 'Basic Arpeggios (Broken Triads)' },
          { code: 'V2.1.3', title: 'Hanon Exercises #1-5 for Flexibility', pdf: 'Hanon Sheet' },
          { code: 'V2.1.4', title: 'Left-Right Rhythm Independence Exercises' }
        ]
      },
      {
        title: 'Module 2.2 — Theory: Intervals & Chord Progressions',
        pdfSummary: 'All Triads Chord Chart',
        lessons: [
          { code: 'V2.2.1', title: 'All Intervals from 2nd to Octave' },
          { code: 'V2.2.2', title: 'Major, Minor, Diminished, Augmented Triads', pdf: 'All Triads Chord Chart' },
          { code: 'V2.2.3', title: 'I-IV-V Progression — The Foundation of Pop/Classical Songs' },
          { code: 'V2.2.4', title: 'Chord Inversions (Root, 1st, 2nd Inversion)' }
        ]
      },
      {
        title: 'Module 2.3 — Basic Ear Training',
        pdfSummary: 'Dictation Exercise Sheet',
        lessons: [
          { code: 'V2.3.1', title: 'Recognizing Intervals by Ear' },
          { code: 'V2.3.2', title: 'Recognizing Major vs Minor by Ear' },
          { code: 'V2.3.3', title: 'Simple Rhythmic Dictation', pdf: 'Dictation Exercise Sheet' },
          { code: 'V2.3.4', title: 'Singing Basic Solfege (Do Re Mi)' }
        ]
      },
      {
        title: 'Module 2.4 — Style & Expression',
        pdfSummary: 'Italian Music Terms Glossary',
        lessons: [
          { code: 'V2.4.1', title: 'Rubato & Musical Expression' },
          { code: 'V2.4.2', title: 'Pedaling for Legato (pedal change per chord change)' },
          { code: 'V2.4.3', title: 'Reading Tempo Markings (Andante, Allegro, etc.)', pdf: 'Italian Music Terms Glossary' },
          { code: 'V2.4.4', title: 'Phrasing: When to "Breathe" in Music' }
        ]
      },
      {
        title: 'Module 2.5 — Repertoire & Capstone',
        pdfSummary: 'Full Sheet + Chord Chart',
        lessons: [
          { code: 'V2.5.1', title: 'Song: "Canon in D" (simplified)' },
          { code: 'V2.5.2', title: 'Song: "River Flows in You" (opening part)' },
          { code: 'V2.5.3', title: 'Simple Pop Song with Chords (popular local/contemporary song choices)' },
          { code: 'V2.5.4', title: 'Level Recap' },
          { code: 'V2.5.5', title: 'Capstone: Play + Accompany Yourself with Chords', pdf: 'Full Sheet + Chord Chart' }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 4 — PRE-INTERMEDIATE
  // ═══════════════════════════════════════════════════════════════
  {
    number: 4,
    title: 'Level 4',
    subtitle: 'Pre-Intermediate',
    targetStudent: 'Can play simple 2-handed pieces',
    estimatedDuration: '~8 hours',
    modulesCount: 5,
    videosCount: 26,
    capstoneDescription: 'Compose Your Own 8-Bar Progression',
    badge: {
      name: 'Two-Hand Master',
      icon: 'piano',
      requirement: 'Complete Lv.4',
      reward: '1 free video feedback from mentor'
    },
    topics: [
      {
        title: 'Module 3.1 — Scales & Technique',
        pdfSummary: '12-Key Major & Minor Scale Diagram',
        lessons: [
          { code: 'V3.1.1', title: 'All 12 Major Scales (fast memorization method)' },
          { code: 'V3.1.2', title: 'Minor Scales: Natural, Harmonic, Melodic', pdf: '12-Key Diagram' },
          { code: 'V3.1.3', title: '2-Octave Arpeggios' },
          { code: 'V3.1.4', title: 'Hanon Exercises #6-15 + Basic Czerny' }
        ]
      },
      {
        title: 'Module 3.2 — Advanced Harmony Theory',
        pdfSummary: '7th Chord Chart',
        lessons: [
          { code: 'V3.2.1', title: 'Seventh Chords: Maj7, Min7, Dom7', pdf: '7th Chord Chart' },
          { code: 'V3.2.2', title: 'The ii-V-I Progression — The Foundation of Jazz' },
          { code: 'V3.2.3', title: 'Secondary Dominants (Introduction)' },
          { code: 'V3.2.4', title: 'Simple Modulation' }
        ]
      },
      {
        title: 'Module 3.3 — Complex Rhythms',
        pdfSummary: 'Progressive Rhythm Drills',
        lessons: [
          { code: 'V3.3.1', title: 'Triplets & Compound Rhythms (6/8, 9/8)' },
          { code: 'V3.3.2', title: 'Basic Polyrhythms (2 vs 3)' },
          { code: 'V3.3.3', title: 'Metronome Practice for Precision', pdf: 'Progressive Rhythm Drills' },
          { code: 'V3.3.4', title: 'Fast Note Reading (16th notes)' }
        ]
      },
      {
        title: 'Module 3.4 — Basic Improvisation & Creativity',
        pdfSummary: 'Left-Hand Pattern Guide',
        lessons: [
          { code: 'V3.4.1', title: 'What is Improvisation? Mindset Foundations' },
          { code: 'V3.4.2', title: 'Improvising with Pentatonics over 1 Chord' },
          { code: 'V3.4.3', title: 'Creating Your Own Melody from a Chord Progression' },
          { code: 'V3.4.4', title: 'Left-Hand Accompaniment Patterns (Alberti Bass, Block, Broken)', pdf: 'Left-Hand Pattern Guide' }
        ]
      },
      {
        title: 'Module 3.5 — Repertoire & Capstone',
        pdfSummary: 'Composition Worksheet',
        lessons: [
          { code: 'V3.5.1', title: 'Classical Piece: Minuet in G (Bach)' },
          { code: 'V3.5.2', title: 'Pop/Ballad Song with Left-Hand Patterns' },
          { code: 'V3.5.3', title: 'Level Recap' },
          { code: 'V3.5.4', title: 'Capstone: Compose Your Own 8-Bar Progression', pdf: 'Composition Worksheet' }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 5 — INTERMEDIATE
  // ═══════════════════════════════════════════════════════════════
  {
    number: 5,
    title: 'Level 5',
    subtitle: 'Intermediate',
    targetStudent: 'Can read 2-hand notation + basic chords',
    estimatedDuration: '~9 hours',
    modulesCount: 5,
    videosCount: 26,
    capstoneDescription: 'Rearrange 1 Song in Your Own Style',
    badge: {
      name: 'Theory Builder',
      icon: 'auto_stories',
      requirement: 'Complete Lv.5',
      reward: 'Premium sheet music voucher'
    },
    topics: [
      {
        title: 'Module 4.1 — Basic Virtuoso Technique',
        pdfSummary: 'Ornamentation Guide',
        lessons: [
          { code: 'V4.1.1', title: 'Scales in Thirds & Sixths' },
          { code: 'V4.1.2', title: 'Octave Technique & Wrist Flexibility Exercises' },
          { code: 'V4.1.3', title: 'Trills & Ornamentation (Mordents, Turns)', pdf: 'Ornamentation Guide' },
          { code: 'V4.1.4', title: 'Cross-Hand Technique' }
        ]
      },
      {
        title: 'Module 4.2 — Lead Sheets & Chord Symbols',
        pdfSummary: 'Chord Symbol Cheat Sheet',
        lessons: [
          { code: 'V4.2.1', title: 'How to Read Lead Sheets & Chord Symbols' },
          { code: 'V4.2.2', title: 'Extended Chords: 9, 11, 13 (Introduction)', pdf: 'Chord Symbol Cheat Sheet' },
          { code: 'V4.2.3', title: 'Slash Chords (Chord/Bass)' },
          { code: 'V4.2.4', title: 'Transposing Songs to Other Keys' }
        ]
      },
      {
        title: 'Module 4.3 — Functional Harmony',
        pdfSummary: 'Harmonic Analysis Worksheet',
        lessons: [
          { code: 'V4.3.1', title: 'Roman Numeral Analysis' },
          { code: 'V4.3.2', title: 'Diatonic Chords in One Key' },
          { code: 'V4.3.3', title: 'Borrowed Chords / Basic Modal Mixture', pdf: 'Harmonic Analysis Worksheet' },
          { code: 'V4.3.4', title: 'Cadences: Authentic, Plagal, Deceptive, Half' }
        ]
      },
      {
        title: 'Module 4.4 — Diverse Musical Styles',
        pdfSummary: 'Voicing Examples by Style',
        lessons: [
          { code: 'V4.4.1', title: 'Baroque Style: Simple Counterpoint' },
          { code: 'V4.4.2', title: 'Romantic Style: Rubato & Extreme Dynamics' },
          { code: 'V4.4.3', title: 'Pop/Contemporary Style: Modern Chord Voicings', pdf: 'Voicing Examples by Style' },
          { code: 'V4.4.4', title: 'Basic Latin/Bossa Style (Rhythm Patterns)' }
        ]
      },
      {
        title: 'Module 4.5 — Repertoire & Capstone',
        pdfSummary: 'Arrangement Template',
        lessons: [
          { code: 'V4.5.1', title: 'Piece: Clair de Lune (opening section, simplified)' },
          { code: 'V4.5.2', title: 'Pop Song with Full Chord Voicings' },
          { code: 'V4.5.3', title: 'Level Recap' },
          { code: 'V4.5.4', title: 'Capstone: Rearrange 1 Song in Your Own Style', pdf: 'Arrangement Template' }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 6 — UPPER INTERMEDIATE
  // ═══════════════════════════════════════════════════════════════
  {
    number: 6,
    title: 'Level 6',
    subtitle: 'Upper Intermediate',
    targetStudent: 'Ready for grade 5-6 pieces',
    estimatedDuration: '~9 hours',
    modulesCount: 5,
    videosCount: 24,
    capstoneDescription: 'Full Performance Recording',
    badge: {
      name: 'Concert Ready',
      icon: 'emoji_events',
      requirement: 'Complete Lv.6 + record capstone',
      reward: '"Grade 5-6 Equivalent" Certificate + feature on course IG'
    },
    topics: [
      {
        title: 'Module 5.1 — Advanced Technique',
        pdfSummary: 'Advanced Pedal Guide',
        lessons: [
          { code: 'V5.1.1', title: '4-Octave Scales & Arpeggios in All Keys' },
          { code: 'V5.1.2', title: 'Double Notes & Chord Jumps' },
          { code: 'V5.1.3', title: 'Advanced Pedal Techniques (half pedal, flutter pedal)', pdf: 'Advanced Pedal Guide' },
          { code: 'V5.1.4', title: 'Speed Building Method' }
        ]
      },
      {
        title: 'Module 5.2 — Advanced Theory',
        pdfSummary: '7 Modes Diagram',
        lessons: [
          { code: 'V5.2.1', title: 'Modes (Dorian, Phrygian, Lydian, etc.) — Full Introduction', pdf: '7 Modes Diagram' },
          { code: 'V5.2.2', title: 'Basic Chord Substitutions' },
          { code: 'V5.2.3', title: 'Voice Leading — Principles of Smooth Chord Connections' },
          { code: 'V5.2.4', title: 'Song Form Analysis (AABA, Verse-Chorus, etc.)' }
        ]
      },
      {
        title: 'Module 5.3 — Advanced Ear Training',
        pdfSummary: 'Transcription Worksheet',
        lessons: [
          { code: 'V5.3.1', title: 'Recognizing Chord Progressions by Ear' },
          { code: 'V5.3.2', title: 'Transcribing Melodies from Recordings', pdf: 'Transcription Worksheet' },
          { code: 'V5.3.3', title: 'Recognizing Modes by Ear' },
          { code: 'V5.3.4', title: 'Complex Interval Sight-Singing Drills' }
        ]
      },
      {
        title: 'Module 5.4 — Performance Skills',
        pdfSummary: 'Self-Evaluation Checklist',
        lessons: [
          { code: 'V5.4.1', title: 'Song Memorization — Techniques & Strategies' },
          { code: 'V5.4.2', title: 'Overcoming Stage Fright / Performance Anxiety' },
          { code: 'V5.4.3', title: 'Self-Recording for Evaluation', pdf: 'Self-Evaluation Checklist' },
          { code: 'V5.4.4', title: 'Basic Music Production: Recording Piano via Smartphone/DAW' }
        ]
      },
      {
        title: 'Module 5.5 — Repertoire & Capstone',
        pdfSummary: 'Sheet + Assessment Rubric',
        lessons: [
          { code: 'V5.5.1', title: 'Piece: Chopin Prelude/Nocturne (simplified version)' },
          { code: 'V5.5.2', title: 'Complex Contemporary Piece' },
          { code: 'V5.5.3', title: 'Level Recap' },
          { code: 'V5.5.4', title: 'Capstone: Full Performance Recording', pdf: 'Sheet + Assessment Rubric' }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 7 — JAZZ FOUNDATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    number: 7,
    title: 'Level 7',
    subtitle: 'Jazz Foundations',
    targetStudent: 'Solid piano background, entering jazz',
    estimatedDuration: '~9 hours',
    modulesCount: 5,
    videosCount: 26,
    capstoneDescription: 'Original 12-Bar Blues Solo Improvisation',
    badge: {
      name: 'Jazz Initiate',
      icon: 'equalizer',
      requirement: 'Complete Lv.7',
      reward: 'Exclusive online jam session invitation'
    },
    topics: [
      {
        title: 'Module 6.1 — Jazz Harmony Basics',
        pdfSummary: 'Rootless Voicing Chart & 12-Key ii-V-I',
        lessons: [
          { code: 'V6.1.1', title: 'Brief History & Philosophy of Jazz Piano' },
          { code: 'V6.1.2', title: 'Jazz Chord Voicings: Rootless Voicings (Bill Evans style)', pdf: 'Rootless Voicing Chart' },
          { code: 'V6.1.3', title: 'ii-V-I in All 12 Keys', pdf: '12-Key ii-V-I Workout' },
          { code: 'V6.1.4', title: 'Extended & Altered Chords (7b9, 7#9, 7#11, etc.)' }
        ]
      },
      {
        title: 'Module 6.2 — Blues & Swing',
        pdfSummary: '12-Key Blues Scale Chart',
        lessons: [
          { code: 'V6.2.1', title: '12-Bar Blues Progression' },
          { code: 'V6.2.2', title: 'Swing Feel & Triplet Subdivision' },
          { code: 'V6.2.3', title: 'Blues Scale & Blue Notes', pdf: '12-Key Blues Scale Chart' },
          { code: 'V6.2.4', title: 'Comping Patterns for Blues' }
        ]
      },
      {
        title: 'Module 6.3 — Comping (Jazz Accompaniment)',
        pdfSummary: 'Comping Pattern Library',
        lessons: [
          { code: 'V6.3.1', title: 'What is Comping? Core Principles' },
          { code: 'V6.3.2', title: 'Charleston Rhythm Comping Pattern' },
          { code: 'V6.3.3', title: 'Comping with Bassist/Drummer (Listening Exercise)', pdf: 'Comping Pattern Library' },
          { code: 'V6.3.4', title: 'Left-Hand Shell Voicings (3rd & 7th)' }
        ]
      },
      {
        title: 'Module 6.4 — Basic Jazz Improvisation',
        pdfSummary: 'Bebop Scale Diagram',
        lessons: [
          { code: 'V6.4.1', title: 'Improvising with Chord Tones' },
          { code: 'V6.4.2', title: 'Using Approach Notes' },
          { code: 'V6.4.3', title: 'Bebop Scale — Introduction', pdf: 'Bebop Scale Diagram' },
          { code: 'V6.4.4', title: 'Basic Licks & Vocabulary for Soloing' }
        ]
      },
      {
        title: 'Module 6.5 — Repertoire & Capstone',
        pdfSummary: 'Standards Lead Sheets',
        lessons: [
          { code: 'V6.5.1', title: 'Standard: "Autumn Leaves" — Analysis & Practice' },
          { code: 'V6.5.2', title: 'Standard: "Blue Bossa" — Analysis & Practice' },
          { code: 'V6.5.3', title: 'Level Recap' },
          { code: 'V6.5.4', title: 'Capstone: Original 12-Bar Blues Solo Improvisation', pdf: 'Standards Lead Sheets' }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 8 — JAZZ ADVANCED
  // ═══════════════════════════════════════════════════════════════
  {
    number: 8,
    title: 'Level 8',
    subtitle: 'Jazz Advanced',
    targetStudent: 'Ready for improvisation & gigging',
    estimatedDuration: '~10 hours',
    modulesCount: 5,
    videosCount: 24,
    capstoneDescription: 'Full Solo Performance + Original Composition Improvisation',
    badge: {
      name: 'Jazz Master',
      icon: 'workspace_premium',
      requirement: 'Complete all 202 videos + final capstone',
      reward: 'Official graduation certificate + Lifetime Alumni Badge + 50% discount on advanced course/private mentoring'
    },
    topics: [
      {
        title: 'Module 7.1 — Advanced Harmony & Reharmonization',
        pdfSummary: 'Reharmonization Worksheet',
        lessons: [
          { code: 'V7.1.1', title: 'Tritone Substitution' },
          { code: 'V7.1.2', title: 'Reharmonizing Standard Songs', pdf: 'Reharmonization Worksheet' },
          { code: 'V7.1.3', title: 'Advanced Modal Interchange' },
          { code: 'V7.1.4', title: 'Coltrane Changes & Giant Steps Concept (Introduction)' }
        ]
      },
      {
        title: 'Module 7.2 — Advanced Voicings & Textures',
        pdfSummary: 'Advanced Voicing Chart',
        lessons: [
          { code: 'V7.2.1', title: 'Quartal Voicings (McCoy Tyner style)' },
          { code: 'V7.2.2', title: 'So What Voicings & Modal Voicings', pdf: 'Advanced Voicing Chart' },
          { code: 'V7.2.3', title: 'Two-Handed Voicings for Solo Piano' },
          { code: 'V7.2.4', title: 'Block Chord Style (George Shearing/Red Garland)' }
        ]
      },
      {
        title: 'Module 7.3 — Advanced Improvisation',
        pdfSummary: 'Motif Development Guide',
        lessons: [
          { code: 'V7.3.1', title: 'Chromaticism in Soloing' },
          { code: 'V7.3.2', title: 'Polyrhythms & Odd Time Signatures in Jazz (5/4, 7/8)' },
          { code: 'V7.3.3', title: 'Motif Development — Building Storytelling Solos', pdf: 'Motif Development Guide' },
          { code: 'V7.3.4', title: 'Transcribing Legendary Musician Solos (Method & Drills)' }
        ]
      },
      {
        title: 'Module 7.4 — Style & Genre Exploration',
        pdfSummary: 'Latin Jazz Pattern Library',
        lessons: [
          { code: 'V7.4.1', title: 'Bill Evans Style — Analysis & Drills' },
          { code: 'V7.4.2', title: 'Herbie Hancock Style — Analysis & Drills' },
          { code: 'V7.4.3', title: 'Latin Jazz: Advanced Bossa Nova & Samba', pdf: 'Latin Jazz Pattern Library' },
          { code: 'V7.4.4', title: 'Solo Piano Arrangement (without band)' }
        ]
      },
      {
        title: 'Module 7.5 — Gigging & Career',
        pdfSummary: '50 Must-Know Jazz Standards & Graduation Portfolio',
        lessons: [
          { code: 'V7.5.1', title: 'Playing in a Combo/Band (Trio, Quartet Etiquette)' },
          { code: 'V7.5.2', title: 'Reading Fake Books & Real Books Live' },
          { code: 'V7.5.3', title: 'Building a Standard Repertoire (50 Essential Songs)', pdf: '50 Must-Know Jazz Standards List' },
          { code: 'V7.5.4', title: 'Level Recap & Final Capstone' },
          { code: 'V7.5.5', title: 'Final Capstone: Full Solo Performance + Original Composition Improvisation', pdf: 'Graduation Certificate + Portfolio Template' }
        ]
      }
    ]
  }
]
