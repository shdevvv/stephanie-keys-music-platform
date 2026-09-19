import React from "react";
import { downloadLevelCertificate } from "../utils/certificateGenerator";

export interface LevelBadgeItem {
  levelNumber: number;
  name: string;
  icon: string;
  imageSrc?: string;
  imagePosition?: { column: number; row: number };
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

export const BadgeShowcaseWidget: React.FC<BadgeShowcaseWidgetProps> = ({
  badges,
}) => {
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="bg-white/55 backdrop-blur-sm border-2 border-[#dfa38f] rounded-lg p-4 md:p-5 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-[#dfa38f]/40 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#dfa38f] to-[#ab7e66] text-white flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-xl">
              workspace_premium
            </span>
          </div>
          <div>
            <h3
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-base font-bold text-[#4a372e]"
            >
              8 Level Badges &amp; Certificates
            </h3>
            <p className="text-xs text-[#8b7368] font-semibold">
              Complete 100% of each level to unlock its badge &amp; downloadable
              certificate
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
            style={{
              background:
                "rgba(255, 255, 255, 0.65) padding-box, linear-gradient(135deg, #fffaf7 0%, #f0c0ae 25%, #b96f5d 56%, #f6cbbb 78%, #874a3d 100%) border-box",
              border: "4px solid transparent",
            }}
            className={`relative p-3 md:p-3.5 rounded-lg border-4 border-transparent ring-1 ring-[#d9a998]/75 transition-all duration-300 flex flex-col justify-between ${
              badge.isUnlocked ? "shadow-xs" : "opacity-95"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {badge.imageSrc && badge.imagePosition ? (
                    <span
                      className="relative w-14 h-[4.7rem] overflow-hidden shrink-0"
                      aria-hidden="true"
                    >
                      <img
                        src={badge.imageSrc}
                        alt=""
                        className="absolute top-0 left-0 max-w-none w-[400%] h-auto"
                        style={{
                          transform: `translate(${-badge.imagePosition.column * 25}%, ${-badge.imagePosition.row * 50}%)`,
                          filter:
                            "brightness(1.08) contrast(0.9) saturate(0.78) sepia(0.14) hue-rotate(350deg)",
                        }}
                      />
                    </span>
                  ) : (
                    <span className="text-2xl select-none">{badge.icon}</span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#dfa38f]/15 text-[#6e4336] border border-[#dfa38f]/40">
                    Lv.{badge.levelNumber}
                  </span>
                </div>
                <div className="flex flex-col items-stretch gap-1.5 w-[88px] shrink-0">
                  {badge.levelNumber <= 2 ? (
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                        boxShadow:
                          "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                        border: "1px solid #D9A998",
                      }}
                      className="w-full text-center px-2 py-0.5 rounded-sm text-white text-[9px] font-bold uppercase tracking-wider"
                    >
                      ACHIEVED
                    </span>
                  ) : badge.isUnlocked ? (
                    <span className="w-full text-center px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-800 text-[9px] font-bold uppercase tracking-wider border border-emerald-400/40">
                      Unlocked
                    </span>
                  ) : (
                    <span className="w-full text-center px-2 py-0.5 rounded-sm bg-gray-500/10 text-gray-700 text-[9px] font-bold uppercase tracking-wider border border-gray-400/30">
                      In Progress
                    </span>
                  )}
                  {badge.levelNumber <= 2 && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadLevelCertificate({
                          studentName: "Julian",
                          levelNumber: badge.levelNumber,
                          levelTitle: `Level ${badge.levelNumber}`,
                          levelSubtitle: badge.subtitle,
                          badgeName: badge.name,
                          badgeIcon: badge.icon,
                        })
                      }
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background:
                          "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                        boxShadow:
                          "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                        border: "1px solid #D9A998",
                      }}
                      className="w-full py-1 px-2 rounded-sm text-white text-[9px] font-semibold uppercase tracking-[0.12em] cursor-pointer transition-all brightness-115 hover:brightness-115 hover:scale-[1.03] shadow-none"
                    >
                      CERTIFICATE
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#4a372e] flex items-center gap-1">
                  {badge.name}
                </h4>
                <p className="text-[10px] text-[#8b7368] font-medium line-clamp-1 mt-0.5">
                  {badge.subtitle}
                </p>
              </div>
            </div>

            <div className="pt-2.5 mt-2.5 border-t border-[#dfa38f]/30 space-y-1.5">
              <div className="flex justify-between text-[9.5px] text-[#8b7368] font-semibold">
                <span>Completed</span>
                <span className="font-bold text-[#5a3a2e]">
                  {badge.completedLessons} / {badge.totalLessons} (
                  {badge.progressPercentage}%)
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
