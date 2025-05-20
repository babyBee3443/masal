import type { SVGProps } from 'react';
import { APP_NAME } from '@/lib/constants';

export function Logo(props: SVGProps<SVGSVGElement>) {
  // Yeni viewBox'a göre en-boy oranını (120/130) kullanarak varsayılan genişlik ve yüksekliği ayarla
  const defaultHeight = props.height || 50; // Logoyu biraz daha belirgin yapmak için varsayılan yüksekliği artırdım
  const defaultWidth = props.width || (Number(defaultHeight) * (120 / 130));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 130" // Daha dikey bir alana yayılacak şekilde viewBox ayarlandı
      width={defaultWidth}
      height={defaultHeight}
      aria-label={`${APP_NAME} Logosu`}
      {...props}
    >
      <defs>
        <linearGradient id="logoTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="sphereGalaxyGradient" cx="50%" cy="45%" r="55%" fx="50%" fy="40%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.9 }} />
          <stop offset="50%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--background))', stopOpacity: 0.7 }} />
        </radialGradient>
         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
          .logo-text {
            font-family: 'Cinzel', serif;
            fill: url(#logoTextGradient);
            letter-spacing: 0.5px;
          }
        `}
      </style>
      
      <g id="logo-icon-group">
        {/* Basit bir kutu tabanı */}
        <rect 
            x="30" 
            y="58" 
            width="60" 
            height="18" 
            rx="3" 
            ry="3" 
            fill="hsl(var(--card) / 0.8)" 
            stroke="hsl(var(--border) / 0.5)" 
            strokeWidth="1"
        />
        {/* Ön yüzey efekti için daha parlak bir çizgi */}
         <path d="M 30 60 L 90 60" stroke="hsl(var(--card-foreground) / 0.2)" strokeWidth="1.5" />


        {/* "Galaksi" efektli küre */}
        <circle 
            cx="60" 
            cy="45" 
            r="30" 
            fill="url(#sphereGalaxyGradient)" 
            opacity="0.95"
            filter="url(#glow)"
        />
         {/* Küreye parlaklık katmanı */}
        <circle 
            cx="55" 
            cy="35" 
            r="8" 
            fill="white" 
            opacity="0.3"
        />


        {/* Etrafa yayılan devre/enerji çizgileri (daha soyut) */}
        <g strokeWidth="1" opacity="0.7" strokeLinecap="round">
          <line x1="60" y1="45" x2="20" y2="20" stroke="hsl(var(--primary))" />
          <line x1="60" y1="45" x2="100" y2="20" stroke="hsl(var(--primary))" />
          <line x1="60" y1="45" x2="60" y2="0" stroke="hsl(var(--primary))" />
          
          <line x1="60" y1="45" x2="30" y2="70" stroke="hsl(var(--accent))" />
          <line x1="60" y1="45" x2="90" y2="70" stroke="hsl(var(--accent))" />

          <circle cx="15" cy="15" r="1.5" fill="hsl(var(--primary))" />
          <circle cx="105" cy="15" r="1.5" fill="hsl(var(--primary))" />
          <circle cx="60" cy="-5" r="1.5" fill="hsl(var(--primary))" />
        </g>
      </g>
      
      {/* DüşBox Metni */}
      <text 
        x="60" 
        y="112"  // Metni biraz yukarı aldım
        textAnchor="middle" 
        className="logo-text"
        style={{ fontSize: '26px' }} // Font boyutunu biraz küçülttüm, ikonla daha dengeli olması için
      >
        {APP_NAME}
      </text>
    </svg>
  );
}
