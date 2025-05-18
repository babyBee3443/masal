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
