import React, { useState, useRef, useEffect } from 'react';
import { getGoogleCalendarUrl, getOutlookCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { Calendar, ChevronDown, Check, Download, ExternalLink, Plus } from 'lucide-react';

interface CalendarButtonsProps {
  variant?: 'compact' | 'full' | 'banner';
  className?: string;
}

export const CalendarButtons: React.FC<CalendarButtonsProps> = ({ variant = 'compact', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIcsDownload = () => {
    downloadIcsFile();
    setDownloaded(true);
    setIsOpen(false);
    setTimeout(() => setDownloaded(false), 3000);
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-amber-50/90 border border-amber-300/80 rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-2xs ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block leading-tight">
              युवा संगम : सोंडा (अंबाला)
            </span>
            <span className="text-[10px] text-amber-900/80 font-bold">
              23 Aug 2026 • 08:00 AM - 11:30 AM IST (With Reminders)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/60 text-slate-900 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
          >
            <span>Google Calendar</span>
            <ExternalLink className="w-3 h-3 text-amber-700" />
          </a>
          <button
            type="button"
            onClick={handleIcsDownload}
            className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            {downloaded ? <Check className="w-3.5 h-3.5 text-amber-200" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloaded ? 'Added!' : 'Apple / iCal'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative z-40 inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 hover:text-white rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
      >
        <Calendar className="w-3.5 h-3.5 text-amber-400" />
        <span>+ Save Event</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-slate-950 border border-amber-500/50 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80 animate-fade-in text-xs ring-1 ring-amber-500/30">
          <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800">
            <div className="text-xs font-bold text-amber-300">
              युवा संगम : सोंडा (अंबाला)
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              23 Aug 2026 • 08:00 AM - 11:30 AM
            </div>
            <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
              <span>🔔 Reminders: 1d, 1h & 30m before</span>
            </div>
          </div>

          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3.5 py-2.5 hover:bg-amber-500/20 text-slate-100 font-bold transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Google Calendar
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={getOutlookCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3.5 py-2.5 hover:bg-amber-500/20 text-slate-100 font-bold transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Outlook Web
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={handleIcsDownload}
            className="w-full text-left flex items-center justify-between px-3.5 py-2.5 hover:bg-amber-500/20 text-slate-100 font-bold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Apple / iCal File (.ics)
            </span>
            <Download className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
};
