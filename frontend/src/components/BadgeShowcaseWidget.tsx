import React from 'react';
import type { UserBadgeDto } from '../services/badgeApi';

interface BadgeShowcaseWidgetProps {
  badges: UserBadgeDto[];
}

export const BadgeShowcaseWidget: React.FC<BadgeShowcaseWidgetProps> = ({ badges }) => {
  return (
    <div className="bg-transparent backdrop-blur-md border-2 border-[#dfa38f] rounded-md p-3 shadow-md space-y-3">
      <div className="flex items-center justify-between border-b border-[#dfa38f]/40 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#dfa38f] to-[#ab7e66] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-lg">military_tech</span>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-sm font-bold text-[#4a372e]">Achievement Badges</h3>
            <p className="text-[10px] text-[#8b7368] font-semibold">Track your milestone progress &amp; unlocked rewards</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-md bg-[#dfa38f]/20 text-[#8a6858] text-[10px] font-bold border border-[#dfa38f]/50">
          {badges.filter((b) => b.isUnlocked).length} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {badges.map((badge) => (
          <div
            key={badge.badgeId}
            className={`relative p-2.5 rounded-md border transition-all duration-300 flex flex-col justify-between ${
              badge.isUnlocked
                ? 'bg-transparent border-[#dfa38f] shadow-xs'
                : 'bg-transparent border-[#dfa38f]/30 opacity-70'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-2xl ${badge.isUnlocked ? 'grayscale-0' : 'grayscale opacity-60'}`}>
                  {badge.iconUrl}
                </span>
                {badge.isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 text-[8.5px] font-bold uppercase tracking-wider border border-emerald-400/40">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-700 text-[8.5px] font-bold uppercase tracking-wider border border-gray-400/30">
                    Locked
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-[11px] text-[#4a372e]">{badge.name}</h4>
                <p className="text-[9.5px] text-[#8b7368] line-clamp-2 mt-0.5 leading-tight">{badge.description}</p>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-[#dfa38f]/30 space-y-1">
              <div className="flex justify-between text-[9px] text-[#8b7368] font-semibold">
                <span>Progress</span>
                <span>
                  {badge.currentValue} / {badge.targetValue}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-md bg-white/20 border border-[#dfa38f]/30 overflow-hidden">
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
