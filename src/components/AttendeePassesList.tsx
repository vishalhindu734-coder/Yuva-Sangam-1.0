import React, { useState, useEffect } from 'react';
import { Registration } from '../types';
import { getRegistrations, getMyPassIds, formatDisplayPhone } from '../utils/storage';
import { EventPass } from './EventPass';
import { shareWhatsAppWithPassImage } from '../utils/whatsapp';
import { Search, PlusCircle, Ticket, User, CheckCircle2, QrCode } from 'lucide-react';

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

  const loadPasses = () => {
    const all = getRegistrations();
    const myIds = getMyPassIds();
    
    let myPasses = all.filter(r => myIds.includes(r.ticketId));
    if (myPasses.length === 0) {
      myPasses = all;
    }

    setPasses(myPasses);
    return myPasses;
  };

  useEffect(() => {
    const myPasses = loadPasses();
    if (initialSelectedPass) {
      setSelectedPass(initialSelectedPass);
    } else if (myPasses.length > 0) {
      setSelectedPass(myPasses[0]);
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

  const filteredPasses = passes.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Select a pass to view, download JPEG, or share on WhatsApp.
            </p>
          </div>
        </div>

        <button
          onClick={onRegisterNew}
          className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>+ New Registration</span>
        </button>
      </div>

      {passes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Event Passes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            You haven't registered for Yuva Sangam yet or your pass wasn't saved on this device.
          </p>
          <button
            onClick={onRegisterNew}
            className="px-5 py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer"
          >
            Register Now
          </button>
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

            {/* Passes list */}
            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-0.5">
              {filteredPasses.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-100">
                  No passes match "{searchQuery}"
                </div>
              ) : (
                filteredPasses.map((pass) => {
                  const isSelected = selectedPass?.ticketId === pass.ticketId;
                  return (
                    <div
                      key={pass.ticketId}
                      onClick={() => setSelectedPass(pass)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400/50'
                          : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {pass.name ? pass.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </div>

                          <div className="min-w-0">
                            <span className="font-bold text-xs tracking-tight block truncate">
                              {pass.name}
                            </span>
                            <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {formatDisplayPhone(pass.phone)}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {pass.ticketId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] mt-2.5 pt-2 border-t border-slate-100/20">
                        <span className={`font-bold uppercase tracking-wider flex items-center gap-1 ${
                          pass.checkedIn
                            ? 'text-emerald-400'
                            : isSelected ? 'text-amber-300' : 'text-slate-500'
                        }`}>
                          {pass.checkedIn ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Checked-In
                            </>
                          ) : (
                            <>
                              <QrCode className="w-3 h-3 text-amber-500" />
                              Pass Ready
                            </>
                          )}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppShareForPass(pass);
                          }}
                          className="px-2 py-0.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded text-[9px] font-bold flex items-center gap-1 transition-all shadow-2xs"
                          title={`Share pass on WhatsApp with ${pass.phone}`}
                        >
                          <WhatsAppIcon className="w-2.5 h-2.5 text-white" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
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


