import type { SVGProps } from 'react';
import { APP_NAME } from '@/lib/constants';

export function Logo(props: SVGProps<SVGSVGElement>) {
  // Adjusted viewBox for a tighter composition and better icon-text integration.
  // Original: viewBox="0 0 230 52"
  // New: viewBox="0 0 190 52" (significantly tighter)
  const defaultHeight = props.height || 40;
  // Adjusted defaultWidth calculation based on the new viewBox aspect ratio (190/52)
  const defaultWidth = props.width || (Number(defaultHeight) * (190 / 52));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 190 52" // Tighter viewBox
      width={defaultWidth}
      height={defaultHeight}
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
            font-size: 24px; 
            fill: url(#logoGradient);
            letter-spacing: 0.5px;
          }
        `}
      </style>
      
      {/* Icon: Open Book - Adjusted scale and position for better integration */}
      {/* Original transform: translate(10, 12.5) scale(1.15) */}
      {/* New transform moves icon right, slightly down, and makes it a bit smaller */}
      <g transform="translate(35, 14) scale(0.95)" fill="url(#logoGradient)"> 
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </g>
      
      {/* Text: App Name - Adjusted x coordinate for closer placement to the icon */}
      {/* Original x: 135 */}
      {/* New x: 122 (center of text shifted left) */}
      <text x="122" y="36.5" textAnchor="middle" className="logo-text">
        {APP_NAME}
      </text>
    </svg>
  );
}
