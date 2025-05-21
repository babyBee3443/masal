
import type { StoryGenre, StorySubGenre } from './types';
// Updated import: Comedy -> Smile, Drama -> Theater
import { Baby, School, GraduationCap, Users2, Home, Sparkles, Ghost, Telescope, Heart, Brain, FileText, BookOpen, Smile, Theater, Search, Zap, CalendarDays, Palette, UserCircle, ShieldQuestion, History, PawPrint } from 'lucide-react';

export const GENRES: StoryGenre[] = ["Korku", "Macera", "Romantik", "Bilim Kurgu", "Fabl", "Felsefi"];

export const APP_NAME = "DüşBox";

export const STORY_LENGTHS = [
  { value: "kısa", label: "Kısa (1-3 dk)" },
  { value: "orta", label: "Orta (4-7 dk)" },
  { value: "uzun", label: "Uzun (8+ dk)" },
] as const;
export type StoryLength = typeof STORY_LENGTHS[number]['value'];

export const STORY_COMPLEXITIES = [
  { value: "basit", label: "Basit Anlatım" },
  { value: "orta", label: "Orta Detaylı" },
  { value: "detaylı", label: "Çok Detaylı" },
] as const;
export type StoryComplexity = typeof STORY_COMPLEXITIES[number]['value'];

export const TARGET_AUDIENCES = [
  { value: "cocuk-3-6", label: "Çocuk (3-6 Yaş)", icon: Baby },
  { value: "cocuk-7-10", label: "İlkokul (7-10 Yaş)", icon: School },
  { value: "genc-11-18", label: "Gençler (11-18 Yaş)", icon: GraduationCap },
  { value: "yetiskin", label: "Yetişkinler (18+)", icon: Users2 },
  { value: "aile", label: "Aile İçin Uygun (Her Yaş)", icon: Home },
] as const;
export type TargetAudience = typeof TARGET_AUDIENCES[number]['value'];


export const SUBGENRES_MAP: Record<StoryGenre, { value: StorySubGenre; label: string }[]> = {
  "Macera": [
    { value: "kesif-yolculuk", label: "Keşif ve Yolculuk" },
    { value: "gizem-dedektiflik", label: "Gizem ve Dedektiflik" },
    { value: "hayatta-kalma", label: "Hayatta Kalma" },
    { value: "fantastik-dunyalar", label: "Fantastik Dünyalar" },
  ],
  "Korku": [
    { value: "hayalet-hikayeleri", label: "Hayalet Hikayeleri" },
    { value: "gerilim-gizem", label: "Gerilim ve Gizem" },
    { value: "dogaustu-varliklar", label: "Doğaüstü Varlıklar" },
    { value: "psikolojik-korku", label: "Psikolojik Korku" },
  ],
  "Romantik": [
    { value: "ilk-ask", label: "İlk Aşk" },
    { value: "tarihi-asklar", label: "Tarihi Aşklar" },
    { value: "fantastik-asklar", label: "Fantastik Aşklar" },
    { value: "dramatik-asklar", label: "Dramatik Aşklar" },
  ],
  "Bilim Kurgu": [
    { value: "uzay-maceralari", label: "Uzay Maceraları" },
    { value: "distopik-gelecekler", label: "Distopik Gelecekler" },
    { value: "robotlar-yapay-zeka", label: "Robotlar ve Yapay Zeka" },
    { value: "zaman-yolculugu", label: "Zaman Yolculuğu" },
  ],
  "Fabl": [
    { value: "hayvan-kahramanlar", label: "Hayvan Kahramanlar" },
    { value: "ders-verici", label: "Ders Verici Hikayeler" },
    { value: "mitolojik-fabllar", label: "Mitolojik Fabllar" },
  ],
  "Felsefi": [
    { value: "varolussal-sorgulamalar", label: "Varoluşsal Sorgulamalar" },
    { value: "ahlaki-ikilemler", label: "Ahlaki İkilemler" },
    { value: "toplumsal-elestiriler", label: "Toplumsal Eleştiriler" },
  ],
};


// Yeni hiyerarşik kategori yapısı (Header menüsü için)
export const HIERARCHICAL_CATEGORIES_FOR_HEADER = [
  {
    audience: TARGET_AUDIENCES.find(ta => ta.value === "cocuk-3-6")!,
    themes: [
      { value: "Macera", label: "Macera", icon: Telescope },
      { value: "Fabl", label: "Hayvan Masalları", icon: PawPrint },
      { value: "Egitici", label: "Eğitici", icon: Brain },
      { value: "Komedi", label: "Komik", icon: Smile }, // Comedy -> Smile
    ]
  },
  {
    audience: TARGET_AUDIENCES.find(ta => ta.value === "cocuk-7-10")!,
    themes: [
      { value: "Macera", label: "Macera", icon: Telescope },
      { value: "Fantastik", label: "Fantastik", icon: Sparkles },
      { value: "Gizem", label: "Gizem / Dedektiflik", icon: Search },
      { value: "Korku", label: "Gerilim / Heyecan", icon: Ghost },
    ]
  },
  {
    audience: TARGET_AUDIENCES.find(ta => ta.value === "genc-11-18")!,
    themes: [
      { value: "Bilim Kurgu", label: "Bilim Kurgu", icon: Zap },
      { value: "Fantastik", label: "Fantastik", icon: Sparkles },
      { value: "Romantik", label: "Romantik", icon: Heart },
      { value: "Korku", label: "Gerilim / Korku", icon: Ghost },
      { value: "Macera", label: "Macera", icon: Telescope },
    ]
  },
  {
    audience: TARGET_AUDIENCES.find(ta => ta.value === "yetiskin")!,
    themes: [
      { value: "Dram", label: "Dram", icon: Theater }, // Drama -> Theater
      { value: "Korku", label: "Gerilim / Korku", icon: Ghost },
      { value: "Felsefi", label: "Düşündüren / Felsefi", icon: Brain },
      { value: "Romantik", label: "Romantik", icon: Heart },
      { value: "Bilim Kurgu", label: "Bilim Kurgu", icon: Zap },
    ]
  },
  {
    audience: TARGET_AUDIENCES.find(ta => ta.value === "aile")!,
    themes: [
      { value: "Macera", label: "Ailece Macera", icon: Telescope },
      { value: "Fabl", label: "Ailece Fabl", icon: PawPrint },
      { value: "Komedi", label: "Ailece Komedi", icon: Smile }, // Comedy -> Smile
      { value: "Egitici", label: "Ailece Eğitici", icon: Brain },
    ]
  }
];
// Diğer kategorilendirme boyutları için sabitler (gelecekteki filtrelemeler için)
export const STORY_THEMES_EXTENDED = [
  // ... HIERARCHICAL_CATEGORIES_FOR_HEADER içindeki tüm temalar buraya da eklenebilir ...
  { value: "Tarihsel", label: "Tarihsel Hikayeler", icon: History },
  { value: "Mitolojik", label: "Mitolojik Hikayeler", icon: ShieldQuestion },
  // ... vb.
];

export const STORY_MOODS = [
  { value: "gulduren", label: "Güldüren", icon: Smile }, // Comedy -> Smile
  { value: "aglatan", label: "Ağlatan", icon: Theater }, // Drama -> Theater
  { value: "dusunduren", label: "Düşündüren", icon: Brain },
  { value: "motive-eden", label: "Motive Eden", icon: Zap },
  { value: "korkutan", label: "Korkutan", icon: Ghost },
  { value: "sasirtan", label: "Şaşırtan", icon: Sparkles },
];

export const STORY_SETTINGS = [
  { value: "okulda", label: "Okulda Geçen", icon: School },
  { value: "dogada", label: "Doğada Geçen", icon: PawPrint },
  { value: "uzayda", label: "Uzayda Geçen", icon: Zap },
  { value: "sehirde", label: "Şehirde Geçen", icon: Home },
  { value: "tarihte", label: "Tarihte Geçen", icon: History },
  { value: "masal-diyari", label: "Masal Diyarlarında Geçen", icon: Sparkles },
];

// Yapay Zeka Tarzları ve Tarihe Göre kategorileri de benzer şekilde eklenebilir.
// Örnek:
export const AI_STYLES = [
    { value: "ai-ozgun", label: "Yapay Zekanın Özgün Yazdığı", icon: Palette},
    { value: "kullanici-kelimeli", label: "Kullanıcının Kelimelerine Göre", icon: UserCircle }
];

export const DATE_CATEGORIES = [
    { value: "gunun-hikayesi", label: "Günün Hikayesi", icon: CalendarDays },
    // ...
];

// Bu fonksiyon, Header'da kullanılacak ana türlerin ikonlarını döndürür.
// HIERARCHICAL_CATEGORIES_FOR_HEADER içindeki temalar için ikonları oradan alacak şekilde düzenlenebilir
// veya genel GENRES için varsayılan ikonlar burada kalabilir.
export const getGenreIcon = (genre: StoryGenre | string) => {
  switch (genre) {
    case 'Korku': return Ghost;
    case 'Macera': return Telescope;
    case 'Romantik': return Heart;
    case 'Bilim Kurgu': return Zap;
    case 'Fabl': return PawPrint;
    case 'Felsefi': return Brain;
    // HIERARCHICAL_CATEGORIES_FOR_HEADER'da tanımlanmış diğer tema value'ları için de case'ler eklenebilir
    case 'Egitici': return Brain;
    case 'Komedi': return Smile; // Comedy -> Smile
    case 'Fantastik': return Sparkles;
    case 'Gizem': return Search;
    case 'Dram': return Theater; // Drama -> Theater
    default: return BookOpen;
  }
};

    