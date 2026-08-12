import React, { useState, useEffect } from 'react';
import { ActiveTab, Registration } from './types';
import { getRegistrations, getMyPassIds } from './utils/storage';
import { Navbar } from './components/Navbar';
import { EventHeader } from './components/EventHeader';
import { RegistrationForm } from './components/RegistrationForm';
import { EventPass } from './components/EventPass';
import { AttendeePassesList } from './components/AttendeePassesList';
import { shareWhatsAppWithPassImage } from './utils/whatsapp';
import { Calendar, MapPin, ShieldCheck, X, CheckCircle2 } from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('register');
  const [currentRegistration, setCurrentRegistration] = useState<Registration | null>(null);
  const [savedPassesCount, setSavedPassesCount] = useState(0);
  const [formKey, setFormKey] = useState(0);

  const updateCounts = () => {
    const myIds = getMyPassIds();
    setSavedPassesCount(myIds.length);
  };

  const handleClosePassView = () => {
    setCurrentRegistration(null);
    setFormKey(prev => prev + 1);
  };

  useEffect(() => {
    updateCounts();
  }, [activeTab, currentRegistration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentRegistration) {
        handleClosePassView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRegistration]);

  const handleRegistrationSuccess = (reg: Registration) => {
    setCurrentRegistration(reg);
    updateCounts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900 flex flex-col antialiased">
      {/* Navbar */}
      <div className="print-hide">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedPassesCount={savedPassesCount}
        />
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-8 flex flex-col justify-center print:p-0 print:m-0">
        {activeTab === 'register' && (
          <div className="space-y-3 sm:space-y-8 my-auto print:space-y-0">
            <div className="print-hide">
              <EventHeader />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
              <div className="lg:col-span-7">
                <RegistrationForm key={formKey} onSuccess={handleRegistrationSuccess} />
              </div>

              <div className="hidden lg:block lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Simple Entry Process
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  How Registration Works
                </h3>

                <ol className="space-y-4 text-xs text-slate-500 leading-relaxed font-medium">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-black text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Provide Full Name and Contact Number in the form.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-black text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Instant Event Pass is generated with your encoded QR code.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-black text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Click <strong>"Save JPEG Pass"</strong> to download pass image to your device.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-black text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Present your pass QR at Maharaja Agrasen Public School, Sonda for instant verification.</span>
                  </li>
                </ol>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-900" /> Aug 23, 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-900" /> Mathedi, Ambala
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'passes' && (
          <AttendeePassesList
            onRegisterNew={() => {
              handleClosePassView();
              setActiveTab('register');
            }}
            initialSelectedPass={currentRegistration}
          />
        )}
      </main>

      {/* Full Page Success & Pass Modal Overlay */}
      {currentRegistration && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 sm:p-6 animate-fade-in print:p-0 print:bg-white print:static print:inset-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClosePassView();
            }
          }}
        >
          {/* Top Header Bar with Success Message, Share Button & Cancel Cross Icon */}
          <div className="w-full max-w-3xl bg-slate-900/95 text-white rounded-2xl border border-slate-800 px-4 py-3 mb-4 shadow-2xl flex items-center justify-between gap-3 sticky top-2 z-10 backdrop-blur-xl print:hidden">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                ✓
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xs sm:text-sm tracking-tight text-white truncate">
                    Registration Successful!
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                    Pass Confirmed
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                  Welcome, {currentRegistration.name}. Pass ID: #{currentRegistration.ticketId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* WhatsApp Share Button */}
              <button
                onClick={() => {
                  const elementId = `event-pass-card-${currentRegistration.ticketId}`;
                  shareWhatsAppWithPassImage(currentRegistration, elementId);
                }}
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                title="Share Pass on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Share Pass</span>
              </button>

              {/* Cancel Button to Cancel View & Start Fresh Registration */}
              <button
                onClick={handleClosePassView}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700/80 shadow-md cursor-pointer active:scale-95 shrink-0"
                title="Cancel pass view and start fresh registration"
                aria-label="Cancel pass view and start fresh registration"
              >
                <span className="hidden sm:inline font-bold">Cancel</span>
                <X className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Centered Event Pass Component with standard action buttons */}
          <div className="w-full max-w-2xl my-auto pb-8 print:p-0">
            <EventPass
              registration={currentRegistration}
              onRegisterAnother={handleClosePassView}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="hidden sm:block bg-white border-t border-slate-100 mt-6 sm:mt-16 py-6 sm:py-10 text-xs text-slate-400 font-medium print-hide">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-slate-900">
            <span>Yuva Sangam 2026</span>
            <span>•</span>
            <span className="text-slate-400">Mathedi, Ambala</span>
          </div>

          <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
            Maharaja Agrasen Public School, Sonda • August 23, 2026
          </div>
        </div>
      </footer>
    </div>
  );
}


