export type StoryGenre = "Korku" | "Macera" | "Romantik" | "Bilim Kurgu" | "Fabl" | "Felsefi";

export interface Story {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  genre: StoryGenre;
  status: 'pending' | 'published';
  createdAt: string; // ISO date string
  publishedAt?: string; // ISO date string
  scheduledAtDate?: string; // YYYY-MM-DD for publication scheduling
  scheduledAtTime?: string; // HH:MM for publication scheduling
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

// Represents days of the week, 0 for Monday, 6 for Sunday for UI consistency
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeeklyScheduleItem {
  id: string;
  dayOfWeek: DayOfWeek; // 0 (Pazartesi) to 6 (Pazar)
  time: string; // HH:MM format, e.g., "09:00", "14:30"
  genre: StoryGenre;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
