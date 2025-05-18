import type { SVGProps } from 'react';
import { APP_NAME } from '@/lib/constants';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 230 50" // Adjusted viewBox for icon + text
      // Default width/height adjusted for new aspect ratio (230/50 = 4.6)
      // Default height remains 37.5, so default width = 37.5 * 4.6 = 172.5
      width={props.width || "172.5"}
      height={props.height || "37.5"}
      aria-label={`${APP_NAME} Logosu`}
      {...props} // Spreading props allows className to override width/height
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
            font-size: 24px; 
            fill: url(#logoGradient);
            letter-spacing: 0.5px;
          }
        `}
      </style>
      
      {/* Icon: Open Book (inspired by Lucide BookOpen) */}
      <g transform="translate(10, 10) scale(1.25)" fill="url(#logoGradient)">
        {/* Path 1 for open book */}
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        {/* Path 2 for open book */}
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </g>
      
      {/* Text: App Name, positioned next to the icon */}
      <text x="135" y="35" textAnchor="middle" className="logo-text">
        {APP_NAME}
      </text>
    </svg>
  );
}
