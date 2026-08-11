import React, { useState, useEffect } from 'react';
import { ActiveTab, Registration } from './types';
import { getRegistrations, getMyPassIds } from './utils/storage';
import { Navbar } from './components/Navbar';
import { EventHeader } from './components/EventHeader';
import { RegistrationForm } from './components/RegistrationForm';
import { EventPass } from './components/EventPass';
import { AttendeePassesList } from './components/AttendeePassesList';
import { Calendar, MapPin, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('register');
  const [currentRegistration, setCurrentRegistration] = useState<Registration | null>(null);
  const [savedPassesCount, setSavedPassesCount] = useState(0);

  const updateCounts = () => {
    const all = getRegistrations();
    const myIds = getMyPassIds();
    setSavedPassesCount(myIds.length > 0 ? myIds.length : all.length);
  };

  useEffect(() => {
    updateCounts();
  }, [activeTab, currentRegistration]);

  const handleRegistrationSuccess = (reg: Registration) => {
    setCurrentRegistration(reg);
    updateCounts();
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900 flex flex-col antialiased">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedPassesCount={savedPassesCount}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-8 flex flex-col justify-center">
        {activeTab === 'register' && (
          <div className="space-y-3 sm:space-y-8 my-auto">
            <EventHeader />

            {currentRegistration ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-black text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-lg tracking-tight">Registration Confirmed</h3>
                      <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5">
                        Welcome, {currentRegistration.name}. Your verified event pass is generated below.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentRegistration(null)}
                    className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white text-black hover:bg-slate-200 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    + Register Another
                  </button>
                </div>

                <EventPass
                  registration={currentRegistration}
                  onRegisterAnother={() => setCurrentRegistration(null)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                <div className="lg:col-span-7">
                  <RegistrationForm onSuccess={handleRegistrationSuccess} />
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
            )}
          </div>
        )}

        {activeTab === 'passes' && (
          <AttendeePassesList
            onRegisterNew={() => {
              setCurrentRegistration(null);
              setActiveTab('register');
            }}
            initialSelectedPass={currentRegistration}
          />
        )}
      </main>

      {/* Footer - hidden on small mobile viewports during registration for zero scroll */}
      <footer className="hidden sm:block bg-white border-t border-slate-100 mt-6 sm:mt-16 py-6 sm:py-10 text-xs text-slate-400 font-medium">
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

