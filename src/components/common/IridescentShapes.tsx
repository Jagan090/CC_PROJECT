import React from 'react';

export const IridescentCylinder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        className="w-32 h-32 sm:w-40 sm:h-40"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cylinderBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c2f866" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="cylinderTop" cx="40%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Cylinder Body tilted 3D effect */}
        <g transform="rotate(-25 80 80)">
          {/* Back edge */}
          <ellipse cx="80" cy="50" rx="36" ry="18" fill="url(#cylinderTop)" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
          {/* Sides */}
          <path
            d="M 44 50 L 44 110 A 36 18 0 0 0 116 110 L 116 50 Z"
            fill="url(#cylinderBody)"
            opacity="0.85"
            stroke="#ffffff"
            strokeWidth="0.75"
          />
          {/* Bottom curve highlight */}
          <ellipse cx="80" cy="110" rx="36" ry="18" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" />
          {/* Inner crystal reflection cut */}
          <ellipse cx="80" cy="50" rx="24" ry="12" fill="#0b0f19" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

export const IridescentSpiral: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        className="w-36 h-36 sm:w-44 sm:h-44"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spiralRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="25%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="75%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <g transform="rotate(-15 90 90)">
          {/* Spiraling rings stacked with 3D depth */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse
              key={i}
              cx="90"
              cy={50 + i * 16}
              rx={46 - i * 3}
              ry={18 - i * 1}
              stroke="url(#spiralRainbow)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity={0.85 - i * 0.08}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
