import type { Story, StoryGenre, ScheduledGeneration, ScheduledGenerationStatus } from '@/lib/types';
import { GENRES } from '@/lib/constants';

// Helper to generate summary
const generateSummary = (content: string, wordCount: number = 30): string => {
  const words = content.split(/\s+/); // split by any whitespace
  return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
};

let stories: Story[] = [
  {
    id: '1',
    title: 'Fısıldayan Orman',
    content: 'Kadim bir ormanın kalbinde, güneş ışığının nadiren toprağa değdiği yerde Fısıldayan Orman uzanırdı. Ağaçların kendilerinin anılar taşıdığı ve eğer yakından dinlerseniz eski masalları paylaşacakları söylenirdi. Meraklı bir ruha sahip genç bir maceracı olan Elara, sadece en karanlık ayda açtığı söylenen efsanevi bir çiçeği aramak için girmeye cesaret etti. Orman, değişen yolları ve ürkütücü yankılarıyla cesaretini sınadı, ama fısıltılar aynı zamanda ona rehberlik etti, unutulmuş sihrin sırlarını ve cesaretin gerçek doğasını ortaya çıkardı. Sadece çiçeği değil, kadim dünyaya derin bir bağ buldu.',
    summary: '',
    imageUrl: 'https://placehold.co/600x480.png',
    genre: 'Macera',
    status: 'published',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Kozmik Serenad',
    content: 'Kaptan Eva Rostova, görevi bilinmeyen Xylos Nebulası\'nı haritalamak olan "Odyssey" adlı yıldız gemisini komuta ediyordu. Dönen kozmik tozunun içinde bir sinyal keşfettiler - enstrümanlarla değil, saf duyguyla rezonansa giren unutulmaz bir melodi. Kaynak, empatik armoniler aracılığıyla iletişim kuran, devasa ve kadim kristal bir varlıktı. Eva ve mürettebatı serenadı deşifre ettikçe, birbirine bağlı bilinçle dolu bir evren hakkında bilgi edindiler ve yaşam anlayışlarını sorguladılar. Karşılaşma onları dönüştürdü, bilimsel keşiflerini ruhsal bir yolculuğa çevirdi.',
    summary: '',
    imageUrl: 'https://placehold.co/600x480.png',
    genre: 'Bilim Kurgu',
    status: 'published',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Kurmalı Kalp',
    content: 'Buhar ve dişlilerle çalışan bir şehirde, Adam olarak bilinen A-7 otomatı tuhaf bir arıza geliştirdi: hissetmeye başladı. Yaratıcısı, münzevi mucit Usta Alistair, bunu bir aksaklık olarak reddetti. Ancak Adam\'ın filizlenen duyguları onu, metalik kabuğunun ötesini gören nazik bir kütüphaneci olan Amelia\'ya götürdü. Beklenmedik dostlukları, otomatları sadece makine olarak gören toplumsal normlara meydan okuyan hassas bir romantizme dönüştü. Aşk hikayeleri sessiz bir devrim oldu ve bir kalbin, ister et ister kurmalı olsun, gerçek sevgiyle atabileceğini kanıtladı.',
    summary: '',
    imageUrl: 'https://placehold.co/600x480.png',
    genre: 'Romantik',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Tavan Arasındaki Gölge',
    content: 'Eski Viktorya dönemi evi, kasabaya bakan bir tepede duruyordu, pencereleri boş gözler gibiydi. Miller ailesi taşındığında, genç Leo kilitli tavan arasına çekildi. Garip sesler ve uçuşan gölgeler merakını ve korkusunu körükledi. Fırtınalı bir gecede kilidi açtı ve tozla kaplı karanlığa çıktı. Orada bir canavarla değil, trajik bir geçmişle hapsolmuş, uzun zaman önce unutulmuş bir çocuğun kederli ruhuyla yüzleşti. Leo\'nun empatisi ruhun huzur bulmasına yardımcı oldu ve ev sonunda baskıcı kasvetini üzerinden attı.',
    summary: '',
    imageUrl: 'https://placehold.co/600x480.png',
    genre: 'Korku',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
];

stories = stories.map(story => ({ ...story, summary: generateSummary(story.content) }));

export const getStories = async (): Promise<Story[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return JSON.parse(JSON.stringify(stories));
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
    id: String(Date.now() + Math.random()),
    summary: generateSummary(storyData.content),
    createdAt: new Date().toISOString(),
  };
  stories.unshift(newStory);
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
  if (updates.content && !updates.summary) { // only update summary if content changed and summary wasn't explicitly provided
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

// Scheduled Generations
let scheduledGenerations: ScheduledGeneration[] = [
  // Example scheduled generation
  // {
  //   id: 'sg1',
  //   scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
  //   scheduledTime: '10:00',
  //   genre: 'Fabl',
  //   status: 'pending',
  //   createdAt: new Date().toISOString(),
  // }
];

export const getScheduledGenerations = async (): Promise<ScheduledGeneration[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  // Sort by scheduledDate and scheduledTime
  return JSON.parse(JSON.stringify(scheduledGenerations)).sort((a: ScheduledGeneration, b: ScheduledGeneration) => {
    const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
    const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
    return dateA.getTime() - dateB.getTime();
  });
};

export const addScheduledGeneration = async (data: Omit<ScheduledGeneration, 'id' | 'status' | 'createdAt'>): Promise<ScheduledGeneration> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const newScheduledGeneration: ScheduledGeneration = {
    ...data,
    id: `sg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  scheduledGenerations.push(newScheduledGeneration);
  return JSON.parse(JSON.stringify(newScheduledGeneration));
};

export const updateScheduledGenerationStatus = async (id: string, status: ScheduledGenerationStatus, generatedStoryId?: string, errorMessage?: string): Promise<ScheduledGeneration | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const index = scheduledGenerations.findIndex(sg => sg.id === id);
  if (index === -1) return undefined;
  scheduledGenerations[index].status = status;
  if (generatedStoryId) {
    scheduledGenerations[index].generatedStoryId = generatedStoryId;
  }
  if (errorMessage) {
    scheduledGenerations[index].errorMessage = errorMessage;
  } else {
    // Clear error message if status is not 'failed'
    delete scheduledGenerations[index].errorMessage;
  }
  return JSON.parse(JSON.stringify(scheduledGenerations[index]));
};

export const deleteScheduledGenerationById = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const initialLength = scheduledGenerations.length;
  scheduledGenerations = scheduledGenerations.filter(sg => sg.id !== id);
  return scheduledGenerations.length < initialLength;
};

export const getScheduledGenerationById = async (id: string): Promise<ScheduledGeneration | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const scheduledItem = scheduledGenerations.find(s => s.id === id);
  return scheduledItem ? JSON.parse(JSON.stringify(scheduledItem)) : undefined;
};

