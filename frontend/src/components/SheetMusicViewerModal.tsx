import React, { useState } from 'react';
import type { SheetMusicDto } from '../services/sheetMusicApi';

interface SheetMusicViewerModalProps {
  sheet: SheetMusicDto | null;
  isPreviewMode?: boolean;
  onClose: () => void;
}

export const SheetMusicViewerModal: React.FC<SheetMusicViewerModalProps> = ({
  sheet,
  isPreviewMode = false,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!sheet) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, sheet.pageCount));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-[#ffe5db] to-[#fff8f6] border border-[#dfa38f]/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#dfa38f]/20 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display-sm text-xl font-bold text-[#4a372e]">{sheet.title}</h2>
              {isPreviewMode && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                  Watermarked Preview
                </span>
              )}
            </div>
            <p className="text-xs text-[#8b7368]">
              Composer: {sheet.composer} • Key: {sheet.keySignature} • {sheet.pageCount} Pages
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 border border-[#dfa38f]/30 flex items-center justify-center text-[#6a564d] hover:bg-[#dfa38f]/20 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center justify-between gap-4 bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl border border-[#dfa38f]/30 shrink-0 text-xs font-semibold text-[#4a372e]">
          {!isPreviewMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-white border border-[#dfa38f]/30 disabled:opacity-40 hover:bg-[#dfa38f]/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">navigate_before</span>
              </button>
              <span>
                Page {currentPage} of {sheet.pageCount}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === sheet.pageCount}
                className="p-1.5 rounded-lg bg-[#dfa38f]/10 text-[#4a372e] border border-[#dfa38f]/30 disabled:opacity-40 hover:bg-[#dfa38f]/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">navigate_next</span>
              </button>
            </div>
          ) : (
            <div className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
              Page 1 of 1 (Sample Preview)
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-white border border-[#dfa38f]/30 hover:bg-[#dfa38f]/10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">zoom_out</span>
            </button>
            <span>{zoomLevel}%</span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-white border border-[#dfa38f]/30 hover:bg-[#dfa38f]/10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">zoom_in</span>
            </button>
          </div>

          {!isPreviewMode && (
            <button
              type="button"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Over the Rainbow.pdf';
                link.download = `${sheet.title.replace(/[^a-zA-Z0-9\s]/g, '')} - Sheet Music.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download PDF
            </button>
          )}
        </div>

        {/* Score Canvas / Container */}
        <div className="relative flex-1 overflow-auto bg-white rounded-2xl p-6 shadow-inner border border-[#dfa38f]/30 flex items-center justify-center min-h-[350px]">
          <div
            className="relative transition-all duration-200 border shadow-md bg-white p-6 rounded-lg text-center"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Watermark Overlay for Preview Mode */}
            {isPreviewMode && (
              <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden">
                <span className="text-4xl md:text-5xl font-black text-rose-500/20 rotate-[-30deg] uppercase tracking-widest select-none">
                  Watermarked Preview • Phanilie Piano Academy
                </span>
              </div>
            )}

            <img
              src={`/over-the-rainbow-page${currentPage <= 6 ? currentPage : 1}.png`}
              alt={`Score Page ${currentPage}`}
              className="w-full max-w-lg h-auto rounded shadow-sm mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/over-the-rainbow-cover.png';
              }}
            />

            <div className="pt-4 space-y-1 text-[#4a372e]">
              <h3 className="font-bold text-sm">{sheet.title}</h3>
              <p className="text-[10px] text-[#8b7368]">Page {currentPage} - Arranged by {sheet.arranger}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
