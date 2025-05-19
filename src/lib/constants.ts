import type { StoryGenre } from './types';

export const GENRES: StoryGenre[] = ["Korku", "Macera", "Romantik", "Bilim Kurgu", "Fabl", "Felsefi"];

export const APP_NAME = "DüşBox"; // Bu satırın "DüşBox" olduğundan emin olun!

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
