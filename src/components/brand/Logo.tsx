import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTamil?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showTamil = true,
  className = '',
  theme = 'light',
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 44, text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 58, text: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 76, text: 'text-3xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  // SVG Seed + Sprout + Paddy Grain + Farming Cycle
  const LogoIcon = (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:rotate-6"
      >
        <defs>
          <linearGradient id="v2aGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F6E7BF" />
            <stop offset="50%" stop-color="#E4B94F" />
            <stop offset="100%" stop-color="#C99E35" />
          </linearGradient>
          <linearGradient id="v2aGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#477A42" />
            <stop offset="100%" stop-color="#173C2C" />
          </linearGradient>
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Circular Farming Cycle Symbol */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill={theme === 'dark' ? '#173C2C' : '#F8F5E9'}
          stroke="#477A42"
          strokeWidth="2.5"
          strokeDasharray="7 3.5"
        />

        {/* Inner glow ring */}
        <circle cx="32" cy="32" r="26" fill="none" stroke="#DCE8D3" strokeWidth="1" />

        {/* V2A dynamic letterform stylized into furrow lines */}
        <path
          d="M 18 42 L 24 50 L 32 46"
          stroke="#173C2C"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Terracotta Seed in Soil */}
        <path
          d="M 28 48 C 23 45 22 39 25 35 C 27 31 33 32 35 36 C 37 41 34 47 28 48 Z"
          fill="#C76E48"
          filter="url(#shadowFilter)"
        />

        {/* Sprouting Stem with Paddy Green */}
        <path
          d="M 30 36 Q 30 20 42 14"
          stroke="#477A42"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* First Sprout Leaf */}
        <path
          d="M 30 28 C 22 26 19 21 18 16 C 23 15 29 20 30 28 Z"
          fill="#477A42"
        />

        {/* Second Leaf emerging into Harvest Gold */}
        <path
          d="M 33 22 C 38 19 44 19 47 15 C 47 19 41 23 33 22 Z"
          fill="url(#v2aGoldGrad)"
        />

        {/* Clustered Golden Paddy Grains (Harvest) */}
        <g filter="url(#shadowFilter)">
          <ellipse
            cx="44"
            cy="19"
            rx="3.8"
            ry="2.2"
            transform="rotate(-30 44 19)"
            fill="url(#v2aGoldGrad)"
            stroke="#7F5E16"
            strokeWidth="0.8"
          />
          <ellipse
            cx="47"
            cy="25"
            rx="3.8"
            ry="2.2"
            transform="rotate(-15 47 25)"
            fill="url(#v2aGoldGrad)"
            stroke="#7F5E16"
            strokeWidth="0.8"
          />
          <ellipse
            cx="49"
            cy="32"
            rx="3.8"
            ry="2.2"
            transform="rotate(10 49 32)"
            fill="url(#v2aGoldGrad)"
            stroke="#7F5E16"
            strokeWidth="0.8"
          />
          <ellipse
            cx="47"
            cy="39"
            rx="3.5"
            ry="2"
            transform="rotate(35 47 39)"
            fill="url(#v2aGoldGrad)"
            stroke="#7F5E16"
            strokeWidth="0.8"
          />
        </g>

        {/* Center Seedling Heart */}
        <circle cx="30" cy="36" r="2.2" fill="#E4B94F" />
      </svg>

      {/* Micro V2A Monogram Tag */}
      {variant === 'badge' && (
        <span className="absolute -bottom-1 -right-1 bg-forest-800 text-harvest-400 font-bold text-[9px] px-1.5 py-0.5 rounded-full border border-harvest-500 shadow-sm">
          V2A
        </span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {LogoIcon}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span
            className={`font-display font-extrabold tracking-tight ${
              theme === 'dark' ? 'text-cream-100' : 'text-forest-900'
            } ${currentSize.text}`}
          >
            VITHAI TO ARUVADAI
          </span>
          <span className="bg-forest-800 text-harvest-400 font-bold text-xs px-2 py-0.5 rounded border border-forest-600 shadow-sm tracking-wider">
            V2A
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`font-medium ${
              theme === 'dark' ? 'text-harvest-400' : 'text-forest-700'
            } ${currentSize.sub}`}
          >
            From Seed to Harvest. Every Step Connected.
          </span>
          {showTamil && (
            <>
              <span className="text-terracotta-400 font-bold">•</span>
              <span
                className={`font-tamil font-semibold ${
                  theme === 'dark' ? 'text-sage-200' : 'text-paddy-700'
                } ${currentSize.sub}`}
              >
                விதை முதல் அறுவடை வரை
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
