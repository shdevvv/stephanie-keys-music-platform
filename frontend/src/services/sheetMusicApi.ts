export interface SheetMusicDto {
  id: number;
  title: string;
  composer: string;
  arranger: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  genre: 'Gospel' | 'Jazz' | 'Classical';
  keySignature: string;
  pageCount: number;
  priceIDR: number;
  priceUSD: number;
  thumbnailUrl: string;
  previewPdfUrl?: string;
  fullPdfUrl?: string;
  isOwned?: boolean;
}

export interface UserLibraryDto {
  libraryId: number;
  sheetMusicId: number;
  title: string;
  arranger: string;
  purchasedAt: string;
  sheetMusic: SheetMusicDto;
}

export async function fetchSheetMusicCatalog(difficulty?: string, genre?: string): Promise<SheetMusicDto[]> {
  try {
    const query = new URLSearchParams();
    if (difficulty && difficulty !== 'All') query.append('difficulty', difficulty);
    if (genre && genre !== 'All') query.append('genre', genre);

    const response = await fetch(`/api/sheetmusic?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API offline, returning fallback sheet music store catalog:', error);
    return getFallbackCatalog();
  }
}

export async function fetchUserLibrary(): Promise<UserLibraryDto[]> {
  try {
    const response = await fetch('/api/sheetmusic/library', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch library: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API offline, returning fallback user library:', error);
    return getFallbackLibrary();
  }
}

export async function unlockSheetMusic(sheetMusicId: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/sheetmusic/${sheetMusicId}/unlock`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    return response.ok;
  } catch (error) {
    return true;
  }
}

function getFallbackCatalog(): SheetMusicDto[] {
  return [
    {
      id: 1,
      title: 'Amazing Grace (Advanced Gospel Arrangement)',
      composer: 'John Newton',
      arranger: 'Stephanie Halim',
      difficulty: 'Intermediate',
      genre: 'Gospel',
      keySignature: 'Ab Major',
      pageCount: 4,
      priceIDR: 75000,
      priceUSD: 5.00,
      thumbnailUrl: '/over-the-rainbow-cover.png',
      isOwned: false
    },
    {
      id: 2,
      title: 'Fly Me to the Moon (Jazz Lead Sheet & Solo)',
      composer: 'Bart Howard',
      arranger: 'Stephanie Halim',
      difficulty: 'Beginner',
      genre: 'Jazz',
      keySignature: 'C Major',
      pageCount: 3,
      priceIDR: 75000,
      priceUSD: 5.00,
      thumbnailUrl: '/over-the-rainbow-cover.png',
      isOwned: false
    },
    {
      id: 3,
      title: 'Clair de Lune (Romantic Piano Transcription)',
      composer: 'Claude Debussy',
      arranger: 'Stephanie Halim',
      difficulty: 'Advanced',
      genre: 'Classical',
      keySignature: 'Db Major',
      pageCount: 6,
      priceIDR: 75000,
      priceUSD: 5.00,
      thumbnailUrl: '/over-the-rainbow-cover.png',
      isOwned: true
    }
  ];
}

function getFallbackLibrary(): UserLibraryDto[] {
  return [
    {
      libraryId: 101,
      sheetMusicId: 3,
      title: 'Clair de Lune (Romantic Piano Transcription)',
      arranger: 'Stephanie Halim',
      purchasedAt: '2026-08-06T18:00:00Z',
      sheetMusic: {
        id: 3,
        title: 'Clair de Lune (Romantic Piano Transcription)',
        composer: 'Claude Debussy',
        arranger: 'Stephanie Halim',
        difficulty: 'Advanced',
        genre: 'Classical',
        keySignature: 'Db Major',
        pageCount: 6,
        priceIDR: 75000,
        priceUSD: 5.00,
        thumbnailUrl: '/over-the-rainbow-cover.png',
        isOwned: true
      }
    }
  ];
}
