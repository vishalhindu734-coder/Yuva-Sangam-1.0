import React, { useState, useEffect, useRef } from 'react';
import { calculateAgeYears, getAgeNumber } from '../utils/storage';
import { Sparkles } from 'lucide-react';

interface FastDobInputProps {
  value: string; // ISO YYYY-MM-DD
  onChange: (isoDate: string) => void;
  required?: boolean;
}

export const FastDobInput: React.FC<FastDobInputProps> = ({ value, onChange }) => {
  // Parse initial ISO value if present
  const parseInitial = (val: string) => {
    if (!val) return { day: '', month: '', year: '' };
    const parts = val.split('-');
    if (parts.length === 3) {
      return {
        year: parts[0],
        month: parts[1],
        day: parts[2]
      };
    }
    return { day: '', month: '', year: '' };
  };

  const initial = parseInitial(value);
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  // Sync internal state when parent resets or changes value prop
  useEffect(() => {
    if (!value) {
      setDay('');
      setMonth('');
      setYear('');
    } else {
      const parts = value.split('-');
      if (parts.length === 3) {
        if (parts[2] !== day) setDay(parts[2]);
        if (parts[1] !== month) setMonth(parts[1]);
        if (parts[0] !== year) setYear(parts[0]);
      }
    }
  }, [value]);

  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Sync back to parent whenever D/M/Y change
  useEffect(() => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1930 && y <= 2026) {
      const formattedD = d < 10 ? `0${d}` : `${d}`;
      const formattedM = m < 10 ? `0${m}` : `${m}`;
      const iso = `${y}-${formattedM}-${formattedD}`;
      if (iso !== value) {
        onChange(iso);
      }
    } else {
      if (value !== '') {
        onChange('');
      }
    }
  }, [day, month, year, value, onChange]);

  // Handle Day Input
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setDay(val);
    if (val.length === 2 && monthRef.current) {
      monthRef.current.focus();
    }
  };

  // Handle Month Input
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMonth(val);
    if (val.length === 2 && yearRef.current) {
      yearRef.current.focus();
    }
  };

  // Handle Year Input
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setYear(val);
  };

  const calculatedIso = (day && month && year.length === 4) ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : value;
  const ageString = calculateAgeYears(calculatedIso);
  const ageNum = getAgeNumber(calculatedIso);

  return (
    <div className="space-y-2">
      {/* Fixed 3-column Grid for DD / MM / YYYY inputs - prevents layout distortion */}
      <div className="grid grid-cols-3 gap-2 items-center">
        {/* Day */}
        <div className="min-w-0">
          <label className="block text-[8px] sm:text-[8.5px] font-bold text-amber-900/60 uppercase tracking-widest mb-0.5 text-center">
            Day (DD)
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            placeholder="DD"
            value={day}
            onChange={handleDayChange}
            className="w-full text-center py-1.5 sm:py-1.5 bg-amber-50/50 border border-amber-300 rounded-xl text-slate-900 text-xs sm:text-sm font-black tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-300 shadow-2xs"
          />
        </div>

        {/* Month */}
        <div className="min-w-0">
          <label className="block text-[8px] sm:text-[8.5px] font-bold text-amber-900/60 uppercase tracking-widest mb-0.5 text-center">
            Month (MM)
          </label>
          <input
            ref={monthRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            placeholder="MM"
            value={month}
            onChange={handleMonthChange}
            className="w-full text-center py-1.5 sm:py-1.5 bg-amber-50/50 border border-amber-300 rounded-xl text-slate-900 text-xs sm:text-sm font-black tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-300 shadow-2xs"
          />
        </div>

        {/* Year */}
        <div className="min-w-0">
          <label className="block text-[8px] sm:text-[8.5px] font-bold text-amber-900/60 uppercase tracking-widest mb-0.5 text-center">
            Year (YYYY)
          </label>
          <input
            ref={yearRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            placeholder="YYYY"
            value={year}
            onChange={handleYearChange}
            className="w-full text-center py-1.5 sm:py-1.5 bg-amber-50/50 border border-amber-300 rounded-xl text-slate-900 text-xs sm:text-sm font-black tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-300 shadow-2xs"
          />
        </div>
      </div>

      {/* Calculated Age Live Badge - Rendered below inputs so layout never distorts */}
      {ageString && ageNum !== null && (
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2.5 py-1 rounded-xl shadow-xs border border-amber-300 animate-fade-in mt-1">
          <span className="text-[11px] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>Age:</span>
            <strong className="font-mono text-xs font-black text-amber-100">{ageString}</strong>
          </span>
          {ageNum < 15 ? (
            <span className="text-[9px] font-bold text-rose-950 bg-rose-200 px-1.5 py-0.5 rounded-md">
              Under 15 Yrs (Invited: 15–40)
            </span>
          ) : ageNum <= 40 ? (
            <span className="text-[9px] font-bold text-emerald-950 bg-emerald-200 px-1.5 py-0.5 rounded-md">
              Eligible Youth (15–40 Yrs)
            </span>
          ) : (
            <span className="text-[9px] font-bold text-rose-950 bg-rose-200 px-1.5 py-0.5 rounded-md">
              Above 40 Yrs (Invited: 15–40)
            </span>
          )}
        </div>
      )}
    </div>
  );
};
