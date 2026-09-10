export interface Sheet {
  title: string
  description: string
  price: string
  genres: ('Jazz' | 'Gospel' | 'Christmas' | 'Disney')[]
  image: string
  previews: string[]
  keySignature?: string
  difficulty?: string
  pageCount?: number
  arranger?: string
}

export const sheets: Sheet[] = [
  {
    title: 'Mercy in the Keys',
    description: 'A deep, soulful gospel arrangement focusing on inner-voice movements and substitution chords in Ab Major.',
    price: '$5.00',
    genres: ['Gospel', 'Jazz'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'Soulful Progression Vol. 1',
    description: 'Master the 2-5-1 in all 12 keys with these elegant gospel-infused jazz turnarounds.',
    price: '$5.00',
    genres: ['Jazz', 'Gospel'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'Fly Me to the Moon (Sheet)',
    description: "Note-for-note piano arrangement transcription of the popular YouTube jazz cover.",
    price: '$5.00',
    genres: ['Jazz'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'O Holy Night (Sheet)',
    description: 'Lush, classical-jazz crossover arrangement for intermediate-to-advanced players.',
    price: '$5.00',
    genres: ['Christmas', 'Gospel'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'A Whole New World (Sheet)',
    description: 'Lyrical arrangement focusing on projecting melody with running arpeggios.',
    price: '$5.00',
    genres: ['Disney'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'The Complete Soulful Progression',
    description: 'A comprehensive guide to modern harmony, from simple triads to complex 13th chords.',
    price: '$5.00',
    genres: ['Jazz', 'Gospel'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'Moon River (Sheet)',
    description: 'Elegant waltz jazz sheet music with detailed chord voicing diagrams and extensions.',
    price: '$5.00',
    genres: ['Jazz'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'Amazing Grace (Sheet)',
    description: 'Gospel reharmonization arrangement score with modern neo-soul movement guides.',
    price: '$5.00',
    genres: ['Gospel'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'Bapa Sentuh Hatiku (Sheet)',
    description: 'Reflective Indonesian Christian sheet music score with smooth voicings.',
    price: '$5.00',
    genres: ['Gospel'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'What a Wonderful World (Sheet)',
    description: 'Lush jazz piano solo sheet music with running left-hand chords.',
    price: '$5.00',
    genres: ['Jazz'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'Over the Rainbow (Sheet)',
    description: 'Ballad jazz style sheet music with delicate voice leading and alterations.',
    price: '$5.00',
    genres: ['Jazz', 'Disney'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  },
  {
    title: 'Beauty and the Beast (Sheet)',
    description: 'Warm and lyrical Disney classic piano solo arrangement sheet music.',
    price: '$5.00',
    genres: ['Disney', 'Jazz'],
    image: '/over-the-rainbow-cover.png',
    previews: [
      '/over-the-rainbow-page1.png',
      '/over-the-rainbow-page2.png',
      '/over-the-rainbow-page3.png',
      '/over-the-rainbow-page4.png',
      '/over-the-rainbow-page5.png',
      '/over-the-rainbow-page6.png'
    ]
  }
]
