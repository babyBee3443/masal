
import type { StoryGenre, StorySubGenre } from './types';

export const GENRES: StoryGenre[] = ["Korku", "Macera", "Romantik", "Bilim Kurgu", "Fabl", "Felsefi"];

export const APP_NAME = "DüşBox";

export const STORY_LENGTHS = [
  { value: "kısa", label: "Kısa" },
  { value: "orta", label: "Orta Uzunlukta" },
  { value: "uzun", label: "Uzun" },
] as const;
export type StoryLength = typeof STORY_LENGTHS[number]['value'];

export const STORY_COMPLEXITIES = [
  { value: "basit", label: "Basit Anlatım" },
  { value: "orta", label: "Orta Detaylı" },
  { value: "detaylı", label: "Çok Detaylı" },
] as const;
export type StoryComplexity = typeof STORY_COMPLEXITIES[number]['value'];

// Ana Kategori ve Alt Kategori Eşleştirmeleri
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

// Hedef Kitle Seçenekleri (Örnek)
export const TARGET_AUDIENCES = [
  { value: "cocuk-3-6", label: "Çocuk (3-6 Yaş)" },
  { value: "cocuk-7-10", label: "Çocuk (7-10 Yaş)" },
  { value: "genc-yetiskin", label: "Genç Yetişkin (11-17 Yaş)" },
  { value: "yetiskin", label: "Yetişkin (18+)" },
] as const;
export type TargetAudience = typeof TARGET_AUDIENCES[number]['value'];
