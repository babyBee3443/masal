import type { SVGProps } from 'react';
import { APP_NAME } from '@/lib/constants';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50" // Adjusted viewBox for potentially longer Turkish text
      width="150" // Keep width, text will scale
      height="37.5" 
      aria-label={`${APP_NAME} Logosu`}
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
          .logo-text {
            font-family: 'Cinzel', serif;
            font-size: 24px; /* Adjusted font size for potentially longer text */
            fill: url(#logoGradient);
            letter-spacing: 0.5px; /* Adjusted letter spacing */
          }
        `}
      </style>
      {/* Adjust x attribute if text is longer to keep it centered, or use text-anchor="middle" x="50%" */}
      <text x="50%" y="35" textAnchor="middle" className="logo-text">
        {APP_NAME}
      </text>
    </svg>
  );
}
