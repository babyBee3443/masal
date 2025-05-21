
import type { StoryLength, TargetAudience } from './constants'; // TargetAudience import edildi

export type StoryGenre = "Korku" | "Macera" | "Romantik" | "Bilim Kurgu" | "Fabl" | "Felsefi";
export type StorySubGenre = string; 

export interface Story {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  genre: StoryGenre;
  subGenre?: StorySubGenre;
  status: 'awaiting_approval' | 'pending' | 'published';
  createdAt: string; // ISO date string
  publishedAt?: string; // ISO date string
  scheduledAtDate?: string; // YYYY-MM-DD for publication scheduling
  scheduledAtTime?: string; // HH:MM for publication scheduling
  length?: StoryLength; // Uzunluk eklendi
  targetAudience?: TargetAudience; // Hedef Kitle eklendi
}

export type ScheduledGenerationStatus = 'pending' | 'generated' | 'failed';

export interface ScheduledGeneration {
  id: string;
  scheduledDate: string; // YYYY-MM-DD format
  scheduledTime: string; // HH:MM format
  genre: StoryGenre;
  status: ScheduledGenerationStatus;
  createdAt: string; // ISO date string
  generatedStoryId?: string; // ID of the story once generated
  errorMessage?: string; // If status is 'failed'
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeeklyScheduleItem {
  id: string;
  dayOfWeek: DayOfWeek; 
  time: string; 
  genre: StoryGenre;
  createdAt: string; 
  updatedAt: string; 
}
