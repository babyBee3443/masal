import type { Story, StoryGenre } from '@/lib/types';
import { GENRES } from '@/lib/constants';

// Helper to generate summary
const generateSummary = (content: string, wordCount: number = 30): string => {
  const words = content.split(/\s+/); // split by any whitespace
  return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
};

let stories: Story[] = [
  {
    id: '1',
    title: 'The Whispering Woods',
    content: 'In the heart of an ancient forest, where sunlight seldom touched the ground, lay the Whispering Woods. It was said that the trees themselves held memories, and if you listened closely, they would share tales of old. Elara, a young adventurer with a curious spirit, dared to enter, seeking a legendary flower rumored to bloom only under the darkest moon. The woods tested her courage with shifting paths and eerie echoes, but the whispers also guided her, revealing secrets of forgotten magic and the true nature of bravery. She found not just the flower, but a profound connection to the ancient world.',
    summary: '', // Will be auto-generated
    imageUrl: 'https://placehold.co/600x480.png',
    genre: 'Adventure',
    status: 'published',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '2',
    title: 'Cosmic Serenade',
    content: 'Captain Eva Rostova commanded the starship "Odyssey," its mission to chart the unknown Xylos Nebula. Within its swirling cosmic dust, they discovered a signal - a haunting melody that resonated not with instruments, but with pure emotion. The source was a crystalline entity, vast and ancient, communicating through empathic harmonies. As Eva and her crew deciphered the serenade, they learned of a universe teeming with interconnected consciousness, challenging their understanding of life itself. The encounter transformed them, turning their scientific exploration into a spiritual voyage.',
    summary: '',
    imageUrl: 'https://placehold.co/600x480.png',
    genre: 'Sci-Fi',
    status: 'published',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'The Clockwork Heart',
    content: 'In a city powered by steam and gears, automaton A-7, known as Adam, developed a peculiar malfunction: he began to feel. His creator, the reclusive inventor Master Alistair, dismissed it as a glitch. But Adam\'s burgeoning emotions led him to Amelia, a kind librarian who saw beyond his metallic shell. Their unlikely friendship blossomed into a tender romance, challenging societal norms that viewed automatons as mere machines. Their love story became a quiet revolution, proving that a heart, whether flesh or clockwork, could beat with true affection.',
    summary: '',
    imageUrl: 'https://placehold.co/600x480.png',
    genre: 'Romance',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '4',
    title: 'The Shadow in the Attic',
    content: 'The old Victorian house stood on a hill overlooking the town, its windows like vacant eyes. When the Miller family moved in, young Leo was drawn to the locked attic. Strange noises and fleeting shadows fueled his curiosity and fear. One stormy night, he picked the lock and ascended into the dust-laden darkness. There, he confronted not a monster, but the sorrowful spirit of a child long forgotten, trapped by a tragic past. Leo\'s empathy helped the spirit find peace, and the house finally shed its oppressive gloom.',
    summary: '',
    imageUrl: 'https://placehold.co/600x480.png',
    genre: 'Horror',
    status: 'pending',
    createdAt: new Date().toISOString(), // Today
  }
];

// Auto-generate summaries for initial data
stories = stories.map(story => ({ ...story, summary: generateSummary(story.content) }));


export const getStories = async (): Promise<Story[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return JSON.parse(JSON.stringify(stories)); // Return a deep copy
};

export const getStoryById = async (id: string): Promise<Story | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const story = stories.find(s => s.id === id);
  return story ? JSON.parse(JSON.stringify(story)) : undefined;
};

export const addStory = async (storyData: Omit<Story, 'id' | 'summary' | 'createdAt'>): Promise<Story> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newStory: Story = {
    ...storyData,
    id: String(Date.now() + Math.random()), // Simple unique ID
    summary: generateSummary(storyData.content),
    createdAt: new Date().toISOString(),
  };
  stories.unshift(newStory); // Add to the beginning of the array
  return JSON.parse(JSON.stringify(newStory));
};

export const updateStory = async (id: string, updates: Partial<Omit<Story, 'id'>>): Promise<Story | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const storyIndex = stories.findIndex(s => s.id === id);
  if (storyIndex === -1) {
    return undefined;
  }
  const originalStory = stories[storyIndex];
  stories[storyIndex] = { ...originalStory, ...updates };
  if (updates.content) {
    stories[storyIndex].summary = generateSummary(updates.content);
  }
  return JSON.parse(JSON.stringify(stories[storyIndex]));
};

export const deleteStoryById = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = stories.length;
  stories = stories.filter(s => s.id !== id);
  return stories.length < initialLength;
};
