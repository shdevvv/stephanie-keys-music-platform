import React from 'react';

export interface LevelBadgeItem {
  levelNumber: number;
  name: string;
  icon: string;
  subtitle: string;
  requirement: string;
  completedLessons: number;
  totalLessons: number;
  isUnlocked: boolean;
  progressPercentage: number;
}

interface BadgeShowcaseWidgetProps {
  badges: LevelBadgeItem[];
}

export const BadgeShowcaseWidget: React.FC<BadgeShowcaseWidgetProps> = ({ badges }) => {
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-xl p-4 md:p-5 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-[#dfa38f]/40 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#dfa38f] to-[#ab7e66] text-white flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-xl">workspace_premium</span>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-base font-bold text-[#4a372e]">
              8 Level Badges &amp; Certificates
            </h3>
            <p className="text-xs text-[#8b7368] font-semibold">
              Complete 100% of each level to unlock its badge &amp; downloadable certificate
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg bg-[#dfa38f]/20 text-[#8a6858] text-xs font-extrabold border border-[#dfa38f]/50">
          {unlockedCount} / {badges.length} Levels Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {badges.map((badge) => (
          <div
            key={badge.levelNumber}
            className={`relative p-3 md:p-3.5 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
              badge.isUnlocked
                ? 'bg-transparent border-[#dfa38f] shadow-xs ring-1 ring-[#dfa38f]/40'
                : 'bg-transparent border-[#dfa38f]/30 opacity-75'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl select-none">{badge.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#dfa38f]/15 text-[#6e4336] border border-[#dfa38f]/40">
                    Lv.{badge.levelNumber}
                  </span>
                </div>
                {badge.isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 text-[9px] font-bold uppercase tracking-wider border border-emerald-400/40">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-700 text-[9px] font-bold uppercase tracking-wider border border-gray-400/30">
                    In Progress
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#4a372e] flex items-center gap-1">
                  {badge.name}
                </h4>
                <p className="text-[10px] text-[#8b7368] font-medium line-clamp-1 mt-0.5">{badge.subtitle}</p>
              </div>
            </div>

            <div className="pt-2.5 mt-2.5 border-t border-[#dfa38f]/30 space-y-1.5">
              <div className="flex justify-between text-[9.5px] text-[#8b7368] font-semibold">
                <span>Completed</span>
                <span className="font-bold text-[#5a3a2e]">
                  {badge.completedLessons} / {badge.totalLessons} ({badge.progressPercentage}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-md bg-white/30 border border-[#dfa38f]/30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#dfa38f] to-[#ab7e66] rounded-md transition-all duration-500"
                  style={{ width: `${badge.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
