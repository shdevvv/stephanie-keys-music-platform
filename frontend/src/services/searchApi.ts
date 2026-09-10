export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Lesson' | 'Performance Cover' | 'Sheet Music';
  subtitle: string;
  thumbnailUrl: string;
  badgeText: string;
  priceOrDuration: string;
  routeUrl: string;
}

export interface SearchResponse {
  query: string;
  totalCount: number;
  lessons: SearchResultItem[];
  covers: SearchResultItem[];
  sheetMusic: SearchResultItem[];
}

export async function fetchSearchResults(query: string): Promise<SearchResponse> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return {
      query: trimmed,
      totalCount: 0,
      lessons: [],
      covers: [],
      sheetMusic: []
    };
  }

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
    if (!response.ok) {
      throw new Error(`Search request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Search API call failed, falling back to local search matching:', error);
    // Client-side fallback if backend API is offline during local preview
    return simulateClientSearch(trimmed);
  }
}

/**
 * Fallback client-side search simulation for preview environment without running backend API
 */
function simulateClientSearch(query: string): SearchResponse {
  const q = query.toLowerCase();
  
  const mockLessons: SearchResultItem[] = [
    {
      id: 'les-1',
      title: 'Mastering Gospel & Jazz Progression Essentials',
      category: 'Lesson' as const,
      subtitle: 'Advanced Chords • Stephanie Halim',
      thumbnailUrl: '/over-the-rainbow-cover.png',
      badgeText: 'Video Lesson',
      priceOrDuration: '24 mins',
      routeUrl: '/courses'
    },
    {
      id: 'les-2',
      title: 'Classical Piano Technique: Beethoven & Chopin',
      category: 'Lesson' as const,
      subtitle: 'Classical Mastery • Phanilie',
      thumbnailUrl: '/over-the-rainbow-cover.png',
      badgeText: 'Video Lesson',
      priceOrDuration: '30 mins',
      routeUrl: '/courses'
    }
  ].filter(item => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q));

  const mockCovers: SearchResultItem[] = [
    {
      id: 'cov-1',
      title: 'Moonlight Sonata (Gospel Jazz Re-Arrangement)',
      category: 'Performance Cover' as const,
      subtitle: 'Arranged by Phanilie',
      thumbnailUrl: '/over-the-rainbow-cover.png',
      badgeText: 'Performance Video',
      priceOrDuration: '4 mins',
      routeUrl: '/covers-sheets'
    },
    {
      id: 'cov-2',
      title: 'Fur Elise (Jazz Ballad Solo Piano)',
      category: 'Performance Cover' as const,
      subtitle: 'Arranged by Stephanie Halim',
      thumbnailUrl: '/over-the-rainbow-cover.png',
      badgeText: 'Performance Video',
      priceOrDuration: '5 mins',
      routeUrl: '/covers-sheets'
    }
  ].filter(item => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q));

  const mockSheetMusic: SearchResultItem[] = [
    {
      id: 'sh-1',
      title: 'Moonlight Sonata - Full Piano Sheet PDF',
      category: 'Sheet Music' as const,
      subtitle: 'L. v. Beethoven • Arr. Stephanie',
      thumbnailUrl: '/over-the-rainbow-cover.png',
      badgeText: 'PDF Score',
      priceOrDuration: '$14.99',
      routeUrl: '/covers-sheets'
    },
    {
      id: 'sh-2',
      title: 'Amazing Grace (Modern Jazz Re-Harmonization)',
      category: 'Sheet Music' as const,
      subtitle: 'Gospel Jazz • Arr. Phanilie',
      thumbnailUrl: '/over-the-rainbow-cover.png',
      badgeText: 'PDF Score',
      priceOrDuration: '$12.00',
      routeUrl: '/covers-sheets'
    }
  ].filter(item => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q));

  const totalCount = mockLessons.length + mockCovers.length + mockSheetMusic.length;

  return {
    query,
    totalCount,
    lessons: mockLessons,
    covers: mockCovers,
    sheetMusic: mockSheetMusic
  };
}
