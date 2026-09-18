import React from "react";
import type { RecommendedLessonDto } from "../services/dashboardApi";

interface NextRecommendedLessonCardProps {
  recommendedLesson: RecommendedLessonDto;
  onNavigate: (
    view: "home" | "dashboard" | "library" | "courses" | "sessions" | "forums",
  ) => void;
}

export const NextRecommendedLessonCard: React.FC<
  NextRecommendedLessonCardProps
> = ({ recommendedLesson, onNavigate }) => {
  return (
    <div className="bg-white/35 border-2 border-[#dfa38f] rounded-lg p-4 md:p-5 shadow-md space-y-3 sm:space-y-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-lg bg-[#dfa38f]/20 text-[#854d38] text-[10px] font-extrabold uppercase tracking-wider border border-[#dfa38f]/50">
            WHERE YOU LEFT OF
          </span>
          <span className="text-xs text-[#8b7368] font-bold">
            Level {recommendedLesson.levelNumber} &bull;{" "}
            {recommendedLesson.durationMinutes} Mins
          </span>
        </div>
        <h3
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-base md:text-lg font-bold text-[#4a372e] leading-tight"
        >
          {recommendedLesson.lessonTitle}
        </h3>
        <p className="text-xs text-[#8b7368] font-medium">
          {recommendedLesson.topicTitle}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("courses")}
        style={{
          background:
            "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
          boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
          border: "1px solid #D9A998",
        }}
        className="h-9 py-2.5 px-5 rounded-lg text-white text-xs font-bold uppercase tracking-wider hover:brightness-115 hover:scale-[1.03] active:scale-95 transition-all duration-300 ease-out cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-none"
      >
        <span className="material-symbols-outlined text-lg">play_circle</span>
        Resume Pathway
      </button>
    </div>
  );
};
