import type { SVGProps } from 'react';
import { APP_NAME } from '@/lib/constants';

export function Logo(props: SVGProps<SVGSVGElement>) {
  // viewBox'a göre en-boy oranını (120/130) kullanarak varsayılan genişlik ve yüksekliği ayarla
  const defaultHeight = props.height || 50; 
  const defaultWidth = props.width || (Number(defaultHeight) * (120 / 130));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 130" // viewBox sabit kalıyor
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
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/> {/* Hafifçe artırılmış bulanıklık */}
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
        {/* Kutu tabanı - Biraz daha büyük */}
        <rect 
            x="25"  // (120-70)/2
            y="70"  // Kürenin altına gelecek şekilde ayarlandı
            width="70" 
            height="20" 
            rx="4" 
            ry="4" 
            fill="hsl(var(--card) / 0.8)" 
            stroke="hsl(var(--border) / 0.5)" 
            strokeWidth="1.5" // Kenarlık biraz daha belirgin
        />
        {/* Ön yüzey efekti */}
         <path d="M 25 72 L 95 72" stroke="hsl(var(--card-foreground) / 0.2)" strokeWidth="2" />

        {/* "Galaksi" efektli küre - Daha büyük */}
        <circle 
            cx="60" 
            cy="40"  // Biraz yukarı çekildi
            r="35"    // Yarıçap artırıldı
            fill="url(#sphereGalaxyGradient)" 
            opacity="0.95"
            filter="url(#glow)"
        />
         {/* Küreye parlaklık katmanı - Biraz daha büyük ve farklı konumda */}
        <circle 
            cx="53"  // Konum ayarlandı
            cy="30"  // Konum ayarlandı
            r="10"   // Boyut artırıldı
            fill="white" 
            opacity="0.25" // Opaklık biraz düşürüldü
        />

        {/* Etrafa yayılan devre/enerji çizgileri (yeni küre konumuna göre ayarlandı) */}
        <g strokeWidth="1.5" opacity="0.75" strokeLinecap="round"> {/* Çizgi kalınlığı ve opaklık artırıldı */}
          <line x1="60" y1="40" x2="15" y2="10" stroke="hsl(var(--primary))" />
          <line x1="60" y1="40" x2="105" y2="10" stroke="hsl(var(--primary))" />
          <line x1="60" y1="40" x2="60" y2="-5" stroke="hsl(var(--primary))" /> {/* Biraz daha yukarı uzasın */}
          
          <line x1="60" y1="40" x2="25" y2="70" stroke="hsl(var(--accent))" />
          <line x1="60" y1="40" x2="95" y2="70" stroke="hsl(var(--accent))" />

          {/* Noktalar biraz daha büyük */}
          <circle cx="10" cy="5" r="2" fill="hsl(var(--primary))" />
          <circle cx="110" cy="5" r="2" fill="hsl(var(--primary))" />
          <circle cx="60" cy="-10" r="2" fill="hsl(var(--primary))" />
        </g>
      </g>
      
      {/* DüşBox Metni - Daha büyük ve kutuya göre ayarlanmış */}
      <text 
        x="60" 
        y="122"  // Yeni kutu konumuna göre ayarlandı
        textAnchor="middle" 
        className="logo-text"
        style={{ fontSize: '30px' }} // Font boyutu artırıldı
      >
        {APP_NAME}
      </text>
    </svg>
  );
}
