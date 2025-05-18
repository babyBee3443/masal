export type StoryGenre = "Horror" | "Adventure" | "Romance" | "Sci-Fi" | "Fable" | "Philosophical";

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
}
