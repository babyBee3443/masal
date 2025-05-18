import type { SVGProps } from 'react';
import { APP_NAME } from '@/lib/constants';

export function Logo(props: SVGProps<SVGSVGElement>) {
  // Adjusted viewBox for better text rendering, especially for Turkish characters.
  // Original: viewBox="0 0 230 50"
  // New: viewBox="0 0 230 52" (slightly taller)
  // Original default height: 37.5, default width: 172.5
  // New aspect ratio: 230/52 = 4.423
  // If default height is 40, default width = 40 * 4.423 = 176.92 -> ~177
  const defaultHeight = props.height || 40;
  const defaultWidth = props.width || (Number(defaultHeight) * (230 / 52));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 230 52" // Increased height
      width={defaultWidth}
      height={defaultHeight}
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
      {/* Adjusted y-translate for icon to center it better in the new viewbox height */}
      <g transform="translate(10, 11) scale(1.25)" fill="url(#logoGradient)">
        {/* Path 1 for open book */}
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        {/* Path 2 for open book */}
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </g>
      
      {/* Text: App Name, positioned next to the icon */}
      {/* Adjusted y coordinate for better vertical centering and to prevent clipping */}
      <text x="135" y="36.5" textAnchor="middle" className="logo-text">
        {APP_NAME}
      </text>
    </svg>
  );
}
