import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Registration, QRData } from '../types';
import { YUVA_SANGAM_EVENT } from '../constants/eventDetails';
import { calculateAgeYears, getAgeNumber, formatIndianDob, formatDisplayPhone } from '../utils/storage';
import { downloadPassAsJpeg, generatePassJpegFile } from '../utils/downloadPass';
import { shareWhatsAppWithPassImage } from '../utils/whatsapp';
import { AbstractPassBackgroundSVG, AbstractPassEmblem } from './SwamiVivekanandaGraphic';
import { CalendarButtons } from './CalendarButtons';
import { Download, Printer, Share2, Check, CheckCircle2, MapPin, Calendar, User, ShieldCheck, Sparkles, Flame, Clock } from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type PassTheme = 'VIVEKANANDA' | 'ROYAL_GOLD' | 'CLASSIC_BLACK';

interface EventPassProps {
  registration: Registration;
  onRegisterAnother?: () => void;
}

export const EventPass: React.FC<EventPassProps> = ({ registration, onRegisterAnother }) => {
  const [passTheme, setPassTheme] = useState<PassTheme>('VIVEKANANDA');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isWhatsAppSharing, setIsWhatsAppSharing] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const qrPayload: QRData = {
    ticketId: registration.ticketId,
    name: registration.name,
    dob: registration.dob,
    village: registration.village,
    subDivision: registration.subDivision,
    phone: registration.phone,
    event: YUVA_SANGAM_EVENT.title,
    date: YUVA_SANGAM_EVENT.date,
    v: 1,
  };

  const qrString = JSON.stringify(qrPayload);
  const elementId = `event-pass-card-${registration.ticketId}`;
  const filename = `Yuva_Sangam_Pass_${registration.name.replace(/\s+/g, '_')}_${registration.ticketId}.jpg`;

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    const success = await downloadPassAsJpeg(elementId, filename);

    setIsDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } else {
      setShareNotice('Could not generate pass image automatically. Please take a screenshot or use Print.');
      setTimeout(() => setShareNotice(null), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = async () => {
    setIsWhatsAppSharing(true);
    setShareNotice(null);
    try {
      const result = await shareWhatsAppWithPassImage(registration, elementId);
      if (result.message) {
        setShareNotice(result.message);
        setTimeout(() => setShareNotice(null), 5000);
      }
    } catch (err) {
      console.error('WhatsApp share error:', err);
    } finally {
      setIsWhatsAppSharing(false);
    }
  };

  const handleSharePass = async () => {
    setIsSharing(true);
    setShareSuccess(false);
    setShareNotice(null);

    const shareTitle = `${registration.name}'s Yuva Sangam 2026 Pass`;
    const shareText = `🎟️ Mathedi Yuva Sangam 2026 Official Entry Pass\nAttendee: ${registration.name}\nTicket ID: ${registration.ticketId}\nDate: Aug 23, 2026 at 8:00 AM\nVenue: Maharaja Agrasen Public School, Sonda (Ambala)`;

    try {
      const passFile = await generatePassJpegFile(elementId, filename);

      if (passFile && navigator.canShare && navigator.canShare({ files: [passFile] })) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [passFile],
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
        setShareSuccess(true);
        setShareNotice('Pass details shared!');
        setTimeout(() => {
          setShareSuccess(false);
          setShareNotice(null);
        }, 3000);
      } else {
        await navigator.clipboard.writeText(shareText);
        await downloadPassAsJpeg(elementId, filename);
        setShareSuccess(true);
        setShareNotice('Pass copied & JPEG downloaded!');
        setTimeout(() => {
          setShareSuccess(false);
          setShareNotice(null);
        }, 3500);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Share error:', err);
        await downloadPassAsJpeg(elementId, filename);
        setShareNotice('Pass downloaded as JPEG');
        setTimeout(() => setShareNotice(null), 3000);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Theme styling configurations
  const getHeaderStyle = () => {
    switch (passTheme) {
      case 'VIVEKANANDA':
        return 'bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 text-white border-b-2 border-amber-400/30';
      case 'ROYAL_GOLD':
        return 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white border-b-2 border-amber-400/40';
      case 'CLASSIC_BLACK':
      default:
        return 'bg-slate-950 text-white border-b border-slate-800';
    }
  };

  const getBodyBgStyle = () => {
    switch (passTheme) {
      case 'VIVEKANANDA':
        return 'bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-white';
      case 'ROYAL_GOLD':
        return 'bg-gradient-to-b from-slate-50 via-amber-50/30 to-white';
      case 'CLASSIC_BLACK':
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 download-exclude">
        {/* Top Row: Verification Badge & Quick Theme Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              Official Entry Pass Verified
            </span>
          </div>

          {/* Theme Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-[11px] font-bold">
            <span className="text-slate-500 uppercase tracking-widest text-[9px] px-1.5 hidden sm:inline">Theme:</span>
            <button
              onClick={() => setPassTheme('VIVEKANANDA')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                passTheme === 'VIVEKANANDA'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xs font-black'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-200" />
              <span>Saffron</span>
            </button>
            <button
              onClick={() => setPassTheme('ROYAL_GOLD')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                passTheme === 'ROYAL_GOLD'
                  ? 'bg-slate-900 text-amber-300 shadow-2xs font-black'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Royal</span>
            </button>
            <button
              onClick={() => setPassTheme('CLASSIC_BLACK')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                passTheme === 'CLASSIC_BLACK'
                  ? 'bg-black text-white shadow-2xs font-black'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <span>Classic</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Left Group: Calendar & Print */}
          <div className="flex items-center gap-2">
            <CalendarButtons variant="compact" />

            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print Pass"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>

          {/* Right Group: Primary Export CTAs */}
          <div className="flex items-center gap-2">
            {/* WhatsApp */}
            <button
              id="btn-whatsapp-share"
              onClick={handleWhatsAppShare}
              disabled={isWhatsAppSharing}
              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-60"
              title={`Send pass on WhatsApp to ${registration.phone}`}
            >
              {isWhatsAppSharing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Preparing...</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                  <span>WhatsApp</span>
                </>
              )}
            </button>

            {/* Share Pass */}
            <button
              id="btn-share-pass"
              onClick={handleSharePass}
              disabled={isSharing}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
              title="Share pass image via Web Share API"
            >
              {isSharing ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : shareSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Shared!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-200" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Save JPEG */}
            <button
              id="btn-download-pass-jpeg"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-1.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm shadow-slate-200 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Save JPEG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {shareNotice && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in download-exclude">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
            {shareNotice}
          </span>
          <button onClick={() => setShareNotice(null)} className="text-amber-700 hover:text-amber-900 font-bold text-base cursor-pointer">×</button>
        </div>
      )}

      {/* Printable & Downloadable Event Pass Card */}
      <div 
        id={elementId} 
        className={`rounded-3xl border-2 border-amber-300/80 shadow-2xl overflow-hidden max-w-[420px] mx-auto relative flex flex-col ${getBodyBgStyle()}`}
      >
        {/* Pass Header Banner */}
        <div className={`p-3.5 sm:p-4 relative overflow-hidden ${getHeaderStyle()}`}>
          {/* Decorative top border accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />

          {/* Header Background Mandala Glow */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col space-y-2 relative z-10">
            {/* Top Badge Row */}
            <div className="flex items-center justify-between w-full text-[9px]">
              <span className="uppercase tracking-widest font-black text-amber-300 bg-amber-950/80 border border-amber-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                Official Entry Pass
              </span>
              <span className="bg-amber-400/20 border border-amber-300/40 backdrop-blur-xs px-2 py-0.5 rounded-lg font-mono font-black uppercase tracking-widest text-amber-200 shadow-2xs">
                {registration.ticketId}
              </span>
            </div>

            {/* Abstract Event Emblem & Event Title Row */}
            <div className="flex items-center gap-3 pt-0.5">
              <AbstractPassEmblem size={44} className="shrink-0 drop-shadow-md" />
              
              <div className="min-w-0 flex-1">
                <h3 className="font-updock font-bold text-[30px] sm:text-[40px] text-amber-300 leading-none drop-shadow-sm truncate">
                  Yuva Sangam 2026
                </h3>
                <span className="font-rozha text-amber-400 text-xs sm:text-sm leading-tight block mt-0.5">
                  युवा संगम • अंबाला
                </span>
              </div>
            </div>

            {/* Subtitle & Date Row */}
            <div className="flex items-center justify-between w-full pt-1.5 border-t border-amber-400/20 text-[10px]">
              <p className="text-amber-200/90 font-medium truncate pr-2">
                Sonda (Ambala)
              </p>

              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-lg shrink-0">
                <span className="font-black text-amber-300">23 Aug 2026</span>
                <span className="text-amber-400">•</span>
                <span className="font-bold text-amber-200">Sun</span>
              </div>
            </div>
          </div>

          {/* Status badge if checked in */}
          {registration.checkedIn && (
            <div className="mt-2 pt-1.5 border-t border-amber-400/20 flex items-center justify-between text-[10px] text-emerald-300 font-extrabold uppercase tracking-wider relative z-10">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Gate Verified Check-In
              </span>
              <span className="font-mono opacity-90">
                {registration.checkedInAt ? new Date(registration.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified'}
              </span>
            </div>
          )}
        </div>

        {/* Swami Vivekananda Inspiring Quote Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-3 py-1.5 text-center border-y border-amber-400/40 shadow-inner relative z-10">
          <p className="text-[10px] font-serif italic font-semibold tracking-wide flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-200 shrink-0" />
            <span>&ldquo;Arise, awake, and stop not till the goal is reached.&rdquo;</span>
          </p>
        </div>

        {/* Notched Coupon Stub Divider */}
        <div className="relative h-5 bg-amber-100/40 flex items-center justify-between px-2 overflow-hidden border-b border-amber-200/80">
          <div className="w-4 h-4 rounded-full bg-slate-900 border border-amber-300/80 -ml-4 shadow-inner" />
          <div className="w-full border-t-2 border-dashed border-amber-300/80 mx-2" />
          <div className="w-4 h-4 rounded-full bg-slate-900 border border-amber-300/80 -mr-4 shadow-inner" />
        </div>

        {/* Pass Body Content with 2-Column Compact Layout */}
        <div className="p-3.5 sm:p-4 space-y-3 relative">
          {/* ABSTRACT GEOMETRIC MANDALA BACKGROUND WATERMARK */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <AbstractPassBackgroundSVG
              opacity={passTheme === 'VIVEKANANDA' ? 0.25 : 0.15}
              className="w-[95%] h-[95%] max-w-xs scale-105"
            />
          </div>

          {/* Main 2-Column Grid: Left (Attendee & Event Details) + Right (QR Code) */}
          <div className="grid grid-cols-12 gap-2.5 items-stretch relative z-10">
            {/* Left Column (7 cols): Attendee Details + Venue Info */}
            <div className="col-span-7 flex flex-col justify-between space-y-2">
              {/* Attendee Name Card */}
              <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-amber-200/90 shadow-2xs">
                <p className="text-[8px] font-black text-amber-900/70 uppercase tracking-widest block mb-0.5">
                  Attendee Name
                </p>
                <p className="text-sm font-black text-slate-900 flex items-center gap-1.5 leading-tight">
                  <User className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="truncate">{registration.name}</span>
                </p>
              </div>

              {/* Grid: DOB & Contact */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-amber-200/90">
                  <p className="text-[8px] font-black text-amber-900/70 uppercase tracking-widest block mb-0.5">
                    DOB (DD-MM-YYYY)
                  </p>
                  <p className="font-bold text-slate-900 flex items-center gap-1 flex-wrap leading-tight">
                    <span>{formatIndianDob(registration.dob)}</span>
                    {getAgeNumber(registration.dob) !== null && (
                      <span className="text-[8px] font-black font-mono text-orange-950 bg-amber-100 border border-amber-300 px-1 rounded whitespace-nowrap">
                        {getAgeNumber(registration.dob)} Y
                      </span>
                    )}
                  </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-amber-200/90">
                  <p className="text-[8px] font-black text-amber-900/70 uppercase tracking-widest block mb-0.5">
                    Contact
                  </p>
                  <p className="font-bold text-slate-900 font-mono text-[10px] leading-tight whitespace-nowrap">
                    {formatDisplayPhone(registration.phone)}
                  </p>
                </div>
              </div>

              {/* Village & Sub Div */}
              {(registration.village || registration.subDivision) && (
                <div className="bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-amber-200/90">
                  <p className="text-[8px] font-black text-amber-900/70 uppercase tracking-widest block mb-0.5">
                    Location
                  </p>
                  <p className="text-[10px] font-bold text-slate-900 flex items-center gap-1 truncate leading-tight">
                    <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                    <span className="truncate">
                      {registration.village && registration.subDivision
                        ? `${registration.village}, ${registration.subDivision}`
                        : registration.village || registration.subDivision || 'Sonda'}
                    </span>
                  </p>
                </div>
              )}

              {/* Remarks if present */}
              {registration.otherInfo && (
                <div className="bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-amber-200/90">
                  <p className="text-[8px] font-black text-amber-900/70 uppercase tracking-widest block mb-0.5">
                    Remarks
                  </p>
                  <p className="text-[10px] text-slate-800 font-semibold line-clamp-1 leading-tight">
                    {registration.otherInfo}
                  </p>
                </div>
              )}

              {/* Event Details & Venue Card (Compact) */}
              <div className="bg-amber-900/5 backdrop-blur-xs p-2 rounded-xl border border-amber-300/80 space-y-1 text-[10px] mt-auto">
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <Clock className="w-3 h-3 text-orange-600 shrink-0" />
                  <span>8:00 AM – 11:30 AM IST</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Maharaja%20Agrasen%20Public%20School%2C%20Sonda%2C%20Ambala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1 text-slate-900 hover:text-orange-700 hover:underline decoration-orange-500/50 leading-tight transition-colors"
                  title="Open location on Google Maps"
                >
                  <MapPin className="w-3 h-3 text-orange-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 font-bold">Maharaja Agrasen Public School, Sonda (Ambala)</span>
                </a>
              </div>
            </div>

            {/* Right Column (5 cols): QR Code Card */}
            <div className="col-span-5 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border-2 border-amber-300/80 shadow-xs relative text-center">
              <div className="bg-white p-1.5 rounded-xl border-2 border-amber-200 shadow-2xs mb-1.5">
                <QRCodeSVG
                  value={qrString}
                  size={105}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <span className="text-[8px] font-black text-amber-950 uppercase tracking-widest block leading-tight">
                Scan at Gate
              </span>

              {/* Security Seal Badge */}
              <div className="mt-1 text-[7px] font-extrabold font-mono text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-tight flex items-center gap-1">
                <Sparkles className="w-2 h-2 text-orange-600" />
                <span>Verified Entry</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Bar */}
          <div className="pt-1.5 border-t border-amber-200/80 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-amber-900/70 relative z-10">
            <span>ISSUED: {new Date(registration.registeredAt).toLocaleDateString()}</span>
            <span className="text-orange-700">VERIFIED PASS • AMBALA 2026</span>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-950 p-2 text-center border-t border-amber-400/30">
          <p className="text-[8px] text-amber-200/90 font-bold uppercase tracking-widest">
            Organizers: Present QR pass at check-in counter • Yuva Sangam 2026
          </p>
        </div>
      </div>
    </div>
  );
};


