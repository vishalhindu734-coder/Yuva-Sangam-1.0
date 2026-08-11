import React from 'react';

interface GraphicProps {
  className?: string;
  opacity?: number;
}

export const AbstractPassBackgroundSVG: React.FC<GraphicProps> = ({ className = "w-full h-full", opacity = 0.15 }) => {
  return (
    <div className={`pointer-events-none select-none flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 500 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
        style={{ opacity }}
      >
        <defs>
          <radialGradient id="abstractAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#EA580C" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="abstractSaffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="goldStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Central Background Glow */}
        <circle cx="250" cy="300" r="230" fill="url(#abstractAura)" />

        {/* Outer Geometric Frame & Filigree Lines */}
        <g stroke="url(#goldStrokeGrad)" strokeWidth="1.2" opacity="0.6">
          <rect x="25" y="25" width="450" height="550" rx="20" fill="none" strokeDasharray="6 6" />
          <rect x="35" y="35" width="430" height="530" rx="16" fill="none" opacity="0.4" />
        </g>

        {/* Corner Geometric Ornamental Brackets */}
        <g stroke="url(#abstractSaffronGrad)" strokeWidth="2" fill="none" opacity="0.8">
          <path d="M 35 70 L 35 35 L 70 35" />
          <path d="M 465 70 L 465 35 L 430 35" />
          <path d="M 35 530 L 35 565 L 70 565" />
          <path d="M 465 530 L 465 565 L 430 565" />
        </g>

        {/* Radial Sunburst Rays */}
        <g opacity="0.35" stroke="url(#abstractSaffronGrad)" strokeWidth="1">
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((angle, i) => (
            <line
              key={i}
              x1="250"
              y1="300"
              x2={250 + 220 * Math.cos((angle * Math.PI) / 180)}
              y2={300 + 220 * Math.sin((angle * Math.PI) / 180)}
              strokeDasharray={i % 2 === 0 ? "none" : "4 4"}
            />
          ))}
        </g>

        {/* Concentric Geometric Mandala Rings */}
        <g stroke="url(#goldStrokeGrad)" fill="none" opacity="0.7">
          <circle cx="250" cy="300" r="190" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="250" cy="300" r="160" strokeWidth="1.5" />
          <circle cx="250" cy="300" r="130" strokeWidth="1" strokeDasharray="6 4" />
          <circle cx="250" cy="300" r="100" strokeWidth="2" />
          <circle cx="250" cy="300" r="70" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="250" cy="300" r="40" strokeWidth="1.5" />
        </g>

        {/* Central Geometric Lotus Rosette / Star Mandala Motif */}
        <g fill="url(#abstractSaffronGrad)" opacity="0.5">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 250 + 100 * Math.cos(rad);
            const cy = 300 + 100 * Math.sin(rad);
            return (
              <circle key={i} cx={cx} cy={cy} r="18" opacity="0.3" />
            );
          })}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 250 + 130 * Math.cos(rad);
            const y = 300 + 130 * Math.sin(rad);
            return (
              <polygon
                key={i}
                points={`${x},${y - 12} ${x + 12},${y} ${x},${y + 12} ${x - 12},${y}`}
                opacity="0.6"
              />
            );
          })}
        </g>

        {/* Abstract Wave Curves at Top & Bottom */}
        <g stroke="url(#abstractSaffronGrad)" strokeWidth="1.5" fill="none" opacity="0.4">
          <path d="M 40 120 Q 250 180 460 120" />
          <path d="M 40 140 Q 250 200 460 140" strokeDasharray="4 4" />
          <path d="M 40 480 Q 250 420 460 480" />
          <path d="M 40 460 Q 250 400 460 460" strokeDasharray="4 4" />
        </g>
      </svg>
    </div>
  );
};

// Backward compatibility alias for SwamiVivekanandaPortraitSVG
export const SwamiVivekanandaPortraitSVG = AbstractPassBackgroundSVG;

export const AbstractPassEmblem: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-amber-800 p-0.5 shadow-md border border-amber-300/70 ${className}`}
    >
      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden relative p-1">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/90 via-transparent to-amber-500/30" />
        <div className="relative z-10 flex items-center justify-center text-amber-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full p-1.5 drop-shadow-sm">
            <path d="M12 2L14.5 8.5L21 9L16 13.5L17.5 20L12 16.5L6.5 20L8 13.5L3 9L9.5 8.5L12 2Z" fill="url(#emblemGrad)" stroke="url(#emblemStroke)" strokeWidth="1" />
            <defs>
              <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="emblemStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Backward compatibility alias for SwamiVivekanandaEmblem
export const SwamiVivekanandaEmblem = AbstractPassEmblem;

