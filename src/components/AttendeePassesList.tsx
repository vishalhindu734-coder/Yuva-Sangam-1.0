import React, { useState, useEffect } from 'react';
import { Registration } from '../types';
import { getRegistrations, getMyPassIds, saveMyPassId, findRegistration, formatDisplayPhone, getAgeCategoryDetails, syncLocalToCloud, exportToCSV } from '../utils/storage';
import { EventPass } from './EventPass';
import { shareWhatsAppWithPassImage } from '../utils/whatsapp';
import { Search, PlusCircle, Ticket, User, CheckCircle2, QrCode, Phone, SearchCheck, Cloud, RefreshCw, Users, Download, Check } from 'lucide-react';

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface AttendeePassesListProps {
  onRegisterNew: () => void;
  initialSelectedPass?: Registration | null;
}

export const AttendeePassesList: React.FC<AttendeePassesListProps> = ({
  onRegisterNew,
  initialSelectedPass,
}) => {
  const [passes, setPasses] = useState<Registration[]>([]);
  const [selectedPass, setSelectedPass] = useState<Registration | null>(initialSelectedPass || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');
  const [lookupInput, setLookupInput] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [lookupSuccess, setLookupSuccess] = useState('');

  const loadPasses = () => {
    const all = getRegistrations();
    const myIds = getMyPassIds();
    
    // Filter to passes registered on this device or looked up via phone/ID
    const displayPasses = all.filter(r => myIds.includes(r.ticketId));

    setPasses(displayPasses);
    return displayPasses;
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncNotice('');
    const success = await syncLocalToCloud();
    setIsSyncing(false);
    if (success) {
      setSyncNotice('Cloud Sync Complete!');
      loadPasses();
      setTimeout(() => setSyncNotice(''), 3000);
    } else {
      setSyncNotice('Sync failed. Please check internet connection.');
      setTimeout(() => setSyncNotice(''), 3000);
    }
  };

  const handleLookupPass = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLookupError('');
    setLookupSuccess('');

    if (!lookupInput.trim()) {
      setLookupError('Please enter your Mobile Number or Ticket ID.');
      return;
    }

    const match = findRegistration(lookupInput);
    if (match) {
      saveMyPassId(match.ticketId);
      loadPasses();
      setSelectedPass(match);
      setLookupSuccess(`Verified pass found for ${match.name}!`);
      setLookupInput('');
    } else {
      setLookupError(`No registration found for "${lookupInput}". Please verify phone number.`);
    }
  };

  useEffect(() => {
    const activePasses = loadPasses();
    if (initialSelectedPass) {
      setSelectedPass(initialSelectedPass);
    } else if (activePasses.length > 0 && !selectedPass) {
      setSelectedPass(activePasses[0]);
    }

    const handleUpdate = () => {
      loadPasses();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('yuva_sangam_registration_added', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('yuva_sangam_registration_added', handleUpdate);
    };
  }, [initialSelectedPass]);

  const filteredPasses = passes.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.ticketId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'ALL') return true;

    const cat = getAgeCategoryDetails(p.dob);
    return cat?.id === selectedCategory;
  });

  const handleWhatsAppShareForPass = async (pass: Registration) => {
    if (selectedPass?.ticketId !== pass.ticketId) {
      setSelectedPass(pass);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    const elId = `event-pass-card-${pass.ticketId}`;
    await shareWhatsAppWithPassImage(pass, document.getElementById(elId) ? elId : undefined);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Event Passes
              </h2>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[11px] font-black rounded-full">
                {passes.length}
              </span>
              {syncNotice && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full animate-fade-in flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  {syncNotice}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Select a pass to view, download JPEG, or share on WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Cloud Sync Button */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer disabled:opacity-50"
            title="Sync with Cloud Firestore"
          >
            <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce text-orange-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <button
            onClick={onRegisterNew}
            className="px-3.5 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>+ New</span>
          </button>
        </div>
      </div>

      {passes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 text-center space-y-6 max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center mx-auto shadow-2xs">
            <Ticket className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">No Saved Passes on this Device</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              If you already registered, enter your registered 10-digit mobile number or Ticket ID below to retrieve your pass instantly.
            </p>
          </div>

          {/* Quick Phone / Ticket ID Lookup Form */}
          <form onSubmit={handleLookupPass} className="space-y-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="text-[11px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              <span>Look Up Existing Registration</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Mobile Number or Ticket ID (e.g. 9876543210)"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <SearchCheck className="w-4 h-4 text-amber-400" />
                <span>Find Pass</span>
              </button>
            </div>

            {lookupError && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                {lookupError}
              </p>
            )}

            {lookupSuccess && (
              <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {lookupSuccess}
              </p>
            )}
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">Need a new registration?</span>
            <button
              onClick={onRegisterNew}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              + Register New Attendee
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Pass Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search name, phone, or pass ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black font-medium"
              />
            </div>

            {/* Age Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-bold scrollbar-none">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => setSelectedCategory('cat_15_20')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'cat_15_20'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Shivaji (15–20)</span>
              </button>
              <button
                onClick={() => setSelectedCategory('cat_20_25')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'cat_20_25'
                    ? 'bg-sky-700 text-white border-sky-700 shadow-2xs'
                    : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                <span>Azad (20–25)</span>
              </button>
              <button
                onClick={() => setSelectedCategory('cat_25_30')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'cat_25_30'
                    ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                    : 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Pratap (25–30)</span>
              </button>
              <button
                onClick={() => setSelectedCategory('cat_30_35')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'cat_30_35'
                    ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                    : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span>Savarkar (30–35)</span>
              </button>
              <button
                onClick={() => setSelectedCategory('cat_35_40')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'cat_35_40'
                    ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                    : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>Banda Bahadur (35–40)</span>
              </button>
            </div>

            {/* Passes list - Compact List View */}
            <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
              <div className="px-3.5 py-2 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Attendee & Category</span>
                <span>Status & Action</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {filteredPasses.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No passes match "{searchQuery}"
                  </div>
                ) : (
                  filteredPasses.map((pass) => {
                    const isSelected = selectedPass?.ticketId === pass.ticketId;
                    const catDetails = getAgeCategoryDetails(pass.dob);
                    return (
                      <div
                        key={pass.ticketId}
                        onClick={() => setSelectedPass(pass)}
                        className={`px-3.5 py-2.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'hover:bg-amber-50/60 text-slate-800'
                        }`}
                      >
                        {/* Left: Name, Phone, Village & Category */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {pass.name ? pass.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs tracking-tight truncate">
                                {pass.name}
                              </span>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                isSelected
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {pass.ticketId}
                              </span>
                              {catDetails && (
                                <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border shrink-0 ${
                                  isSelected ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : catDetails.fullBadgeClass
                                }`}>
                                  {catDetails.shortLabel}
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] font-mono flex items-center gap-2 mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              <span>{formatDisplayPhone(pass.phone)}</span>
                              {pass.village && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{pass.village}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Status & WhatsApp Action */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            pass.checkedIn
                              ? 'text-emerald-400'
                              : isSelected ? 'text-amber-300' : 'text-slate-500'
                          }`}>
                            {pass.checkedIn ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span className="hidden sm:inline">Checked-In</span>
                              </>
                            ) : (
                              <>
                                <QrCode className="w-3 h-3 text-amber-500" />
                                <span className="hidden sm:inline">Ready</span>
                              </>
                            )}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsAppShareForPass(pass);
                            }}
                            className="p-1.5 sm:px-2 sm:py-1 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded text-[9px] font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                            title={`Share pass on WhatsApp with ${pass.phone}`}
                          >
                            <WhatsAppIcon className="w-2.5 h-2.5 text-white" />
                            <span className="hidden sm:inline">Share</span>
                          </button>

                          <a
                            href={`tel:${pass.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 sm:px-2 sm:py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[9px] font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                            title={`Direct call to ${pass.phone}`}
                          >
                            <Phone className="w-2.5 h-2.5 text-white" />
                            <span className="hidden sm:inline">Call</span>
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Pass Preview */}
          <div className="lg:col-span-7">
            {selectedPass ? (
              <EventPass registration={selectedPass} onRegisterAnother={onRegisterNew} />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 text-xs font-medium">
                Select a pass from the list to view or download.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


