import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LunchBuddyLogo: React.FC<LogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
}) => {
  const dimensions = {
    sm: { width: iconOnly ? 36 : 140, height: 36, iconSize: 36 },
    md: { width: iconOnly ? 48 : 180, height: 48, iconSize: 48 },
    lg: { width: iconOnly ? 64 : 240, height: 64, iconSize: 64 },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Tiffin Mascot SVG */}
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Top Handle */}
        <path
          d="M75 35 C75 22, 125 22, 125 35"
          stroke="#0D1D3A"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Main Tiffin Box Outer Outline */}
        <rect
          x="30"
          y="35"
          width="140"
          height="140"
          rx="32"
          fill="#FFFFFF"
          stroke="#0D1D3A"
          strokeWidth="10"
        />

        {/* Mascot Face - Happy Eyes */}
        <path
          d="M65 72 Q75 60 85 72"
          stroke="#0D1D3A"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M115 72 Q125 60 135 72"
          stroke="#0D1D3A"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mascot Smile */}
        <path
          d="M82 92 Q100 110 118 92"
          stroke="#0D1D3A"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Divider Line between Face and Food */}
        <path
          d="M30 115 L170 115"
          stroke="#0D1D3A"
          strokeWidth="8"
        />

        {/* Divider Line between Right Food Sections */}
        <path
          d="M100 115 L100 175"
          stroke="#0D1D3A"
          strokeWidth="8"
        />

        {/* Food Section 1: Rice (Bottom Left) */}
        <path
          d="M35 119 L95 119 L95 148 Q95 170 67 170 L35 170 Z"
          fill="#FFFFFF"
        />
        {/* Rice Dots */}
        <circle cx="55" cy="138" r="3.5" fill="#FF5B00" />
        <circle cx="70" cy="135" r="3" fill="#FF5B00" />
        <circle cx="62" cy="148" r="3.5" fill="#FF5B00" />
        <circle cx="78" cy="145" r="3" fill="#FF5B00" />
        <circle cx="50" cy="152" r="3" fill="#FF5B00" />
        <circle cx="72" cy="158" r="3.5" fill="#FF5B00" />

        {/* Food Section 2: Curry (Top Right) */}
        <rect
          x="105"
          y="119"
          width="60"
          height="24"
          rx="6"
          fill="#FF9500"
        />
        {/* Curry Ring Accents */}
        <circle cx="125" cy="131" r="5" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
        <circle cx="145" cy="131" r="6" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

        {/* Food Section 3: Greens (Bottom Right) */}
        <path
          d="M105 147 L165 147 L165 148 Q165 170 137 170 L105 170 Z"
          fill="#22C55E"
        />
        {/* Leaf Accent */}
        <path
          d="M125 162 C125 152, 145 152, 145 162 C145 165, 130 168, 125 162 Z"
          fill="#FFFFFF"
          opacity="0.85"
        />

        {/* Thumbs Up Hand on Right */}
        <g transform="translate(155, 60)">
          {/* Green Sparkles */}
          <line x1="26" y1="-8" x2="26" y2="-18" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          <line x1="38" y1="-2" x2="46" y2="-8" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          <line x1="42" y1="12" x2="52" y2="12" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />

          {/* Thumbs Up Hand Outline */}
          <path
            d="M 5 22 C 15 22, 18 10, 18 2 C 18 -6, 8 -6, 8 2 L 8 10 C 2 10, -2 14, -2 20 C -2 26, 4 30, 4 30"
            fill="#FFFFFF"
            stroke="#0D1D3A"
            strokeWidth="7"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Brand Text */}
      {!iconOnly && (
        <span className="font-extrabold tracking-tight flex items-center leading-none text-2xl sm:text-3xl">
          <span className="text-[#0D1D3A]">Lunch</span>
          <span className="text-[#FF5B00]">Buddy</span>
        </span>
      )}
    </div>
  );
};
