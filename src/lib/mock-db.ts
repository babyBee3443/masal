
import type { Story, StoryGenre, ScheduledGeneration, ScheduledGenerationStatus, WeeklyScheduleItem, DayOfWeek } from '@/lib/types';

const STORIES_KEY = 'masalDunyasi_stories';
const SCHEDULED_GENERATIONS_KEY = 'masalDunyasi_scheduledGenerations';
const WEEKLY_SCHEDULES_KEY = 'masalDunyasi_weeklySchedules';
const LAST_WEEKLY_CHECK_KEY = 'masalDunyasi_lastWeeklyCheck';

// Helper to generate summary
const generateSummary = (content: string, wordCount: number = 30): string => {
  const words = content.split(/\s+/); // split by any whitespace
  return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
};

const initialStoriesData: Story[] = [
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
].map(story => ({ ...story, summary: generateSummary(story.content) }));


const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    console.warn(`localStorage is not available. Skipping save for key “${key}”.`);
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key “${key}”:`, error);
  }
};

export const getStories = async (): Promise<Story[]> => {
  // await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async
  const stories = getFromLocalStorage<Story[]>(STORIES_KEY, initialStoriesData);
  if (stories === initialStoriesData && stories.length > 0 && typeof window !== 'undefined' && !window.localStorage.getItem(STORIES_KEY)) {
      saveToLocalStorage(STORIES_KEY, initialStoriesData);
  }
  return JSON.parse(JSON.stringify(stories));
};

export const getStoryById = async (id: string): Promise<Story | undefined> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const stories = getFromLocalStorage<Story[]>(STORIES_KEY, []);
  const story = stories.find(s => s.id === id);
  return story ? JSON.parse(JSON.stringify(story)) : undefined;
};

export const addStory = async (storyData: Omit<Story, 'id' | 'summary' | 'createdAt'>): Promise<Story> => {
  // await new Promise(resolve => setTimeout(resolve, 50));
  let stories = getFromLocalStorage<Story[]>(STORIES_KEY, []);
  const newStory: Story = {
    ...storyData,
    id: String(Date.now() + Math.random()),
    summary: generateSummary(storyData.content),
    createdAt: new Date().toISOString(),
  };
  stories.unshift(newStory);
  saveToLocalStorage(STORIES_KEY, stories);
  return JSON.parse(JSON.stringify(newStory));
};

export const updateStory = async (id: string, updates: Partial<Omit<Story, 'id'>>): Promise<Story | undefined> => {
  // await new Promise(resolve => setTimeout(resolve, 50));
  let stories = getFromLocalStorage<Story[]>(STORIES_KEY, []);
  const storyIndex = stories.findIndex(s => s.id === id);
  if (storyIndex === -1) {
    return undefined;
  }
  const originalStory = stories[storyIndex];
  stories[storyIndex] = { ...originalStory, ...updates };
  if (updates.content && (!updates.summary || updates.summary === originalStory.summary)) {
    stories[storyIndex].summary = generateSummary(updates.content);
  }
  saveToLocalStorage(STORIES_KEY, stories);
  return JSON.parse(JSON.stringify(stories[storyIndex]));
};

export const deleteStoryById = async (id: string): Promise<boolean> => {
  // await new Promise(resolve => setTimeout(resolve, 50));
  let stories = getFromLocalStorage<Story[]>(STORIES_KEY, []);
  const initialLength = stories.length;
  stories = stories.filter(s => s.id !== id);
  saveToLocalStorage(STORIES_KEY, stories);
  return stories.length < initialLength;
};

// Scheduled Generations
export const getScheduledGenerations = async (): Promise<ScheduledGeneration[]> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  if(items.length === 0 && typeof window !== 'undefined' && !window.localStorage.getItem(SCHEDULED_GENERATIONS_KEY)) {
    saveToLocalStorage(SCHEDULED_GENERATIONS_KEY, []);
  }
  return JSON.parse(JSON.stringify(items)).sort((a: ScheduledGeneration, b: ScheduledGeneration) => {
    const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
    const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
    return dateA.getTime() - dateB.getTime();
  });
};

export const addScheduledGeneration = async (data: Omit<ScheduledGeneration, 'id' | 'status' | 'createdAt'>): Promise<ScheduledGeneration> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  let items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  const newScheduledGeneration: ScheduledGeneration = {
    ...data,
    id: `sg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  items.push(newScheduledGeneration);
  saveToLocalStorage(SCHEDULED_GENERATIONS_KEY, items);
  return JSON.parse(JSON.stringify(newScheduledGeneration));
};

export const updateScheduledGenerationStatus = async (id: string, status: ScheduledGenerationStatus, generatedStoryId?: string, errorMessage?: string): Promise<ScheduledGeneration | undefined> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  let items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  const index = items.findIndex(sg => sg.id === id);
  if (index === -1) return undefined;
  items[index].status = status;
  if (generatedStoryId) {
    items[index].generatedStoryId = generatedStoryId;
  }
  if (errorMessage) {
    items[index].errorMessage = errorMessage;
  } else {
    delete items[index].errorMessage;
  }
  saveToLocalStorage(SCHEDULED_GENERATIONS_KEY, items);
  return JSON.parse(JSON.stringify(items[index]));
};

export const deleteScheduledGenerationById = async (id: string): Promise<boolean> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  let items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  const initialLength = items.length;
  items = items.filter(sg => sg.id !== id);
  saveToLocalStorage(SCHEDULED_GENERATIONS_KEY, items);
  return items.length < initialLength;
};

export const getScheduledGenerationById = async (id: string): Promise<ScheduledGeneration | undefined> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  const scheduledItem = items.find(s => s.id === id);
  return scheduledItem ? JSON.parse(JSON.stringify(scheduledItem)) : undefined;
};

// Weekly Recurring Schedules
export const getWeeklySchedules = async (): Promise<WeeklyScheduleItem[]> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const items = getFromLocalStorage<WeeklyScheduleItem[]>(WEEKLY_SCHEDULES_KEY, []);
   if(items.length === 0 && typeof window !== 'undefined' && !window.localStorage.getItem(WEEKLY_SCHEDULES_KEY)) {
    saveToLocalStorage(WEEKLY_SCHEDULES_KEY, []);
  }
  return JSON.parse(JSON.stringify(items));
};

export const upsertWeeklySchedule = async (item: Omit<WeeklyScheduleItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeeklyScheduleItem> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  let items = getFromLocalStorage<WeeklyScheduleItem[]>(WEEKLY_SCHEDULES_KEY, []);
  const existingItemIndex = items.findIndex(ws => ws.dayOfWeek === item.dayOfWeek && ws.time === item.time);
  const now = new Date().toISOString();

  if (existingItemIndex > -1) {
    items[existingItemIndex] = {
      ...items[existingItemIndex],
      genre: item.genre,
      updatedAt: now,
    };
    saveToLocalStorage(WEEKLY_SCHEDULES_KEY, items);
    return JSON.parse(JSON.stringify(items[existingItemIndex]));
  } else {
    const newItem: WeeklyScheduleItem = {
      ...item,
      id: `ws-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    saveToLocalStorage(WEEKLY_SCHEDULES_KEY, items);
    return JSON.parse(JSON.stringify(newItem));
  }
};

export const deleteWeeklyScheduleByDayTime = async (dayOfWeek: DayOfWeek, time: string): Promise<boolean> => {
  // await new Promise(resolve => setTimeout(resolve, 20));
  let items = getFromLocalStorage<WeeklyScheduleItem[]>(WEEKLY_SCHEDULES_KEY, []);
  const initialLength = items.length;
  items = items.filter(ws => !(ws.dayOfWeek === dayOfWeek && ws.time === time));
  saveToLocalStorage(WEEKLY_SCHEDULES_KEY, items);
  return items.length < initialLength;
};

// Helper for weekly schedule check time
export const getLastWeeklyCheckTime = async (): Promise<string | null> => {
    return getFromLocalStorage<string | null>(LAST_WEEKLY_CHECK_KEY, null);
}

export const setLastWeeklyCheckTime = async (time: string): Promise<void> => {
    saveToLocalStorage(LAST_WEEKLY_CHECK_KEY, time);
}

    