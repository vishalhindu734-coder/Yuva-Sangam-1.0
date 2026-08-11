import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Registration } from '../types';
import { saveRegistration, calculateAgeYears, getAgeNumber } from '../utils/storage';
import { MANDAL_VILLAGE_DATA, VillageEntry, MANDALS_LIST } from '../constants/villages';
import { FastDobInput } from './FastDobInput';
import confetti from 'canvas-confetti';
import { User, Calendar, MapPin, Phone, FileText, ShieldCheck, ArrowRight, RotateCcw, Check, Building2, Sparkles, Search } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess: (reg: Registration) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  
  // Village & Mandal State
  const [villageInput, setVillageInput] = useState('');
  const [mandalInput, setMandalInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState('');
  const [otherInfo, setOtherInfo] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regretState, setRegretState] = useState<{ name: string; age: number | null } | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter village entries based on Gram input (matching against Gram name, case-insensitive)
  const cleanQuery = villageInput.trim().toLowerCase();
  const matchingVillages = useMemo(() => {
    if (cleanQuery.length < 2) return [];
    return MANDAL_VILLAGE_DATA.filter((item) =>
      item.gram.toLowerCase().includes(cleanQuery)
    );
  }, [cleanQuery]);

  // Real-time auto-fill if single remaining match exists
  useEffect(() => {
    if (cleanQuery.length >= 2 && matchingVillages.length === 1) {
      const match = matchingVillages[0];
      if (villageInput !== match.gram || mandalInput !== match.mandal) {
        setVillageInput(match.gram);
        setMandalInput(match.mandal);
        setIsDropdownOpen(false);
      }
    }
  }, [cleanQuery, matchingVillages, villageInput, mandalInput]);

  const handleVillageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setVillageInput(val);
    setIsDropdownOpen(val.trim().length >= 2);

    // If exact match found in database while typing, sync mandal
    const exactMatch = MANDAL_VILLAGE_DATA.find(
      (item) => item.gram.toLowerCase() === val.trim().toLowerCase()
    );
    if (exactMatch) {
      setMandalInput(exactMatch.mandal);
    }
  };

  const handleSelectVillage = (entry: VillageEntry) => {
    setVillageInput(entry.gram);
    setMandalInput(entry.mandal);
    setIsDropdownOpen(false);
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const finalVillage = villageInput.trim();
    const finalMandal = mandalInput.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!dob) {
      setError('Please select your Date of Birth.');
      return;
    }

    if (!finalVillage) {
      setError('Please enter or select your Village / Gram Name.');
      return;
    }

    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 10) {
      setError('Please enter a valid 10-digit mobile contact number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let formattedPhone = cleanPhone;
      if (digitsOnly.length === 10 && !cleanPhone.startsWith('+')) {
        formattedPhone = `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
      }

      // Save attendee registration details
      const newReg = saveRegistration({
        name: cleanName,
        dob: dob,
        village: finalVillage,
        subDivision: finalMandal || undefined,
        phone: formattedPhone,
        otherInfo: otherInfo.trim(),
      });

      setIsSubmitting(false);

      const calculatedAge = getAgeNumber(dob);
      const isEligible = calculatedAge !== null && calculatedAge >= 15 && calculatedAge <= 35;

      if (isEligible) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D97706', '#EA580C', '#B45309', '#78350F'],
        });
        onSuccess(newReg);
      } else {
        setRegretState({
          name: cleanName,
          age: calculatedAge,
        });
      }
    }, 400);
  };

  // Render regret message after capturing details if user is outside 15-35 age range
  if (regretState) {
    return (
      <div className="bg-gradient-to-b from-amber-50/90 via-white to-orange-50/40 rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-md p-5 sm:p-7 text-center relative overflow-hidden animate-fade-in">
        <div className="w-12 h-12 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-800 shadow-2xs">
          <ShieldCheck className="w-6 h-6 text-orange-600" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
          Details Recorded • Pass Criteria Notice
        </span>

        <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          Registration Recorded
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto mb-4 leading-relaxed">
          Thank you <strong className="text-slate-900 font-bold">{regretState.name}</strong>. Your attendee details have been captured and recorded in our system. However, official event entry passes are strictly generated for <strong className="text-orange-700 font-bold">male youth aged between 15 and 35 years</strong>.
        </p>

        <div className="bg-white border border-amber-200/80 rounded-xl p-3 max-w-sm mx-auto mb-5 text-left text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span>Registration Status:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Details Captured
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span>Attendee Name:</span>
            <span className="font-bold text-slate-900">{regretState.name}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span>Calculated Age:</span>
            <span className="font-black font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {regretState.age !== null ? `${regretState.age} Years` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-medium border-t border-slate-100 pt-1.5">
            <span>Pass Generation Criteria:</span>
            <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              15 to 35 Years
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setRegretState(null);
            setName('');
            setDob('');
            setVillageInput('');
            setMandalInput('');
            setPhone('');
            setOtherInfo('');
          }}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Register Another Candidate</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-50/60 via-white to-orange-50/30 rounded-2xl sm:rounded-3xl border border-amber-200/80 shadow-md shadow-orange-900/5 p-4 sm:p-7 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-3.5 pb-2.5 sm:pb-3.5 border-b border-amber-100">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-rozha text-amber-800 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-full tracking-wider">
              युवा शक्ति • राष्ट्र निर्माण
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Yuva Registration Form</span>
            <span className="text-amber-800 font-rozha text-sm sm:text-base font-normal">| युवा संगम</span>
          </h2>
          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
            Fill attendee details to generate your verified Mathedi Yuva Sangam 2026 pass. <span className="font-bold text-orange-700">(Invited: Male youth aged 15 to 35 years)</span>
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {error && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        {/* Grid layout for fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* 1) Name Field */}
          <div className="sm:col-span-2">
            <label htmlFor="user-name" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              1) Full Name <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600/70">
                <User className="w-4 h-4" />
              </div>
              <input
                id="user-name"
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-amber-50/40 border border-amber-200/90 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* 2) Date of Birth Field (Fast Keyboard Entry) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900/70">
                2) Date of Birth (जन्म तिथि) <span className="text-orange-600">*</span>
              </label>
            </div>
            <FastDobInput
              value={dob}
              onChange={(iso) => setDob(iso)}
            />
          </div>

          {/* 3) Village & Mandal Auto-complete Field */}
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Gram (Village) Field */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="village-input" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900/70">
                  3) Village / Gram (ग्राम) <span className="text-orange-600">*</span>
                </label>
                {matchingVillages.length > 0 && cleanQuery.length >= 2 && (
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                    {matchingVillages.length} {matchingVillages.length === 1 ? 'match' : 'matches'}
                  </span>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600/70">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="village-input"
                  type="text"
                  required
                  placeholder="Type at least 2 letters (e.g. Matedi, Bhano, Jal...)"
                  value={villageInput}
                  onChange={handleVillageInputChange}
                  onFocus={() => {
                    if (cleanQuery.length >= 2) setIsDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (matchingVillages.length > 0) {
                        handleSelectVillage(matchingVillages[0]);
                      } else {
                        setIsDropdownOpen(false);
                        phoneInputRef.current?.focus();
                      }
                    } else if (e.key === 'Tab' && !e.shiftKey) {
                      if (matchingVillages.length > 0 && cleanQuery.length >= 2) {
                        handleSelectVillage(matchingVillages[0]);
                      } else {
                        setIsDropdownOpen(false);
                      }
                    }
                  }}
                  className="w-full pl-9 pr-8 py-2 sm:py-2.5 bg-amber-50/40 border border-amber-200/90 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium placeholder:text-slate-400"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-amber-600/60">
                  <Search className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Dynamic Dropdown List */}
              {isDropdownOpen && matchingVillages.length > 0 && (
                <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-amber-300 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-amber-100/60 animate-fade-in">
                  <div className="p-2 bg-amber-50/80 border-b border-amber-200/60 text-[10px] font-bold text-amber-900/70 uppercase tracking-wider flex items-center justify-between">
                    <span>Matching Villages (Gram - Mandal)</span>
                    <span className="text-[9px] font-mono text-amber-700">English Format</span>
                  </div>
                  {matchingVillages.map((item, idx) => (
                    <button
                      key={`${item.gram}-${item.mandal}-${idx}`}
                      type="button"
                      onClick={() => handleSelectVillage(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-amber-100/60 text-xs text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 group-hover:text-amber-950">
                        {item.formatted}
                      </span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200/70">
                        Gram: {item.gram}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mandal (Division) Field - Auto-filled & skipped on Tab */}
            <div>
              <label htmlFor="mandal-input" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
                4) Mandal Division (मंडल) <span className="text-[9px] text-amber-700/70 font-normal ml-1">(Auto-filled)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600/70">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="mandal-input"
                  type="text"
                  tabIndex={-1}
                  readOnly
                  placeholder="Auto-filled Mandal Name"
                  value={mandalInput}
                  onChange={(e) => setMandalInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-amber-100/30 border border-amber-200/90 rounded-xl text-slate-900 text-xs sm:text-sm font-bold focus:outline-none cursor-default select-none"
                />
              </div>
              <p className="text-[10px] text-amber-900/60 font-medium mt-1">
                Automatically assigned from village selection
              </p>
            </div>
          </div>

          {/* 5) Mobile Number Field */}
          <div>
            <label htmlFor="user-phone" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              5) Mobile Number <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600/70">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="user-phone"
                ref={phoneInputRef}
                type="tel"
                required
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-amber-50/40 border border-amber-200/90 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* 6) Additional Info Field (Optional) */}
          <div>
            <label htmlFor="user-info" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              6) Additional Note <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600/70">
                <FileText className="w-4 h-4" />
              </div>
              <input
                id="user-info"
                type="text"
                placeholder="e.g. Student, Volunteer"
                value={otherInfo}
                onChange={(e) => setOtherInfo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-amber-50/40 border border-amber-200/90 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1 font-semibold text-amber-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            Verified entry pass • Males 15–35 Years
          </span>
          <span className="font-mono text-slate-500">Aug 23, 2026</span>
        </div>

        {/* Submit Button */}
        <button
          id="btn-submit-registration"
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-orange-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registering Attendee...</span>
            </div>
          ) : (
            <>
              <span>Complete Registration & Generate Pass</span>
              <ArrowRight className="w-4 h-4 text-amber-200" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};




