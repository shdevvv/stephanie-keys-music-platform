import React from 'react';
import type { RecommendedLessonDto } from '../services/dashboardApi';

interface NextRecommendedLessonCardProps {
  recommendedLesson: RecommendedLessonDto;
  onNavigate: (view: 'home' | 'dashboard' | 'library' | 'courses' | 'sessions' | 'forums') => void;
}

export const NextRecommendedLessonCard: React.FC<NextRecommendedLessonCardProps> = ({ recommendedLesson, onNavigate }) => {
  return (
    <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-xl p-4 md:p-5 shadow-md space-y-3 sm:space-y-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-lg bg-[#dfa38f]/20 text-[#854d38] text-[10px] font-extrabold uppercase tracking-wider border border-[#dfa38f]/50">
            🎯 Next Recommended Lesson
          </span>
          <span className="text-xs text-[#8b7368] font-bold">
            Level {recommendedLesson.levelNumber} &bull; {recommendedLesson.durationMinutes} Mins
          </span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-base md:text-lg font-bold text-[#4a372e] leading-tight">{recommendedLesson.lessonTitle}</h3>
        <p className="text-xs text-[#8b7368] font-medium">{recommendedLesson.topicTitle}</p>
      </div>

      <button
        type="button"
        onClick={() => onNavigate('courses')}
        style={{ backgroundImage: 'linear-gradient(135deg, #dfa38f 0%, #ab7e66 100%)' }}
        className="py-2.5 px-5 rounded-lg text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-[#dfa38f]"
      >
        <span className="material-symbols-outlined text-lg">play_circle</span>
        Resume Pathway
      </button>
    </div>
  );
};
