export interface RecommendedLessonDto {
  lessonId: number;
  levelNumber: number;
  topicTitle: string;
  lessonTitle: string;
  durationMinutes: number;
  videoUrl: string;
}

export interface DashboardSummaryDto {
  overallMasteryPct: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  totalPracticeMinutes: number;
  totalXP: number;
  nextRecommendedLesson: RecommendedLessonDto;
}

export interface TodoDto {
  id: number;
  taskDescription: string;
  isCompleted: boolean;
  createdAt: string;
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryDto> {
  try {
    const response = await fetch('/api/dashboard/summary', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch summary: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend API offline, returning fallback dashboard summary:', error);
    return getFallbackSummary();
  }
}

export async function fetchTodos(): Promise<TodoDto[]> {
  try {
    const response = await fetch('/api/dashboard/todos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch todos: ${response.status}`);
    return await response.json();
  } catch (error) {
    return [
      { id: 1, taskDescription: 'Practice C Major scale 2 octaves', isCompleted: false, createdAt: new Date().toISOString() },
      { id: 2, taskDescription: 'Review jazz voicings for Misty', isCompleted: true, createdAt: new Date().toISOString() }
    ];
  }
}

export async function createTodo(taskDescription: string): Promise<TodoDto> {
  try {
    const response = await fetch('/api/dashboard/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      },
      body: JSON.stringify({ taskDescription })
    });
    if (!response.ok) throw new Error(`Failed to create todo: ${response.status}`);
    return await response.json();
  } catch (error) {
    return {
      id: Date.now(),
      taskDescription,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
  }
}

function getFallbackSummary(): DashboardSummaryDto {
  return {
    overallMasteryPct: 33,
    completedLessonsCount: 5,
    totalLessonsCount: 15,
    totalPracticeMinutes: 640,
    totalXP: 1250,
    nextRecommendedLesson: {
      lessonId: 6,
      levelNumber: 2,
      topicTitle: 'C Major & A Minor',
      lessonTitle: 'The A Minor Scale',
      durationMinutes: 14,
      videoUrl: 'https://www.youtube.com/embed/opeWi7v1Lqc'
    }
  };
}
