
import type { Story, StoryGenre, ScheduledGeneration, ScheduledGenerationStatus, WeeklyScheduleItem, DayOfWeek } from '@/lib/types';
import { isValid, parseISO, format } from 'date-fns'; // Added format and isValid for direct use here

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
    status: 'awaiting_approval', // Changed to awaiting_approval for testing
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
  const stories = getFromLocalStorage<Story[]>(STORIES_KEY, initialStoriesData);
  if (stories === initialStoriesData && stories.length > 0 && typeof window !== 'undefined' && !window.localStorage.getItem(STORIES_KEY)) {
      // Initialize localStorage if it's empty and we have initial data
      saveToLocalStorage(STORIES_KEY, initialStoriesData);
  }
  return JSON.parse(JSON.stringify(stories));
};

export const getStoryById = async (id: string): Promise<Story | undefined> => {
  const stories = getFromLocalStorage<Story[]>(STORIES_KEY, []);
  const story = stories.find(s => s.id === id);
  return story ? JSON.parse(JSON.stringify(story)) : undefined;
};

export const addStory = async (storyData: Omit<Story, 'id' | 'summary' | 'createdAt' | 'status'> & { status?: Story['status'] }): Promise<Story> => {
  let stories = getFromLocalStorage<Story[]>(STORIES_KEY, []);
  const newStory: Story = {
    title: storyData.title,
    content: storyData.content,
    imageUrl: storyData.imageUrl,
    genre: storyData.genre,
    id: String(Date.now() + Math.random()),
    summary: generateSummary(storyData.content),
    createdAt: new Date().toISOString(),
    status: storyData.status || 'awaiting_approval', // Default to awaiting_approval
  };
  stories.unshift(newStory);
  saveToLocalStorage(STORIES_KEY, stories);
  console.log('[DB AddStory] Added story:', newStory.id, 'Status:', newStory.status);
  return JSON.parse(JSON.stringify(newStory));
};

export const updateStory = async (id: string, updates: Partial<Omit<Story, 'id'>>): Promise<Story | undefined> => {
  let stories = getFromLocalStorage<Story[]>(STORIES_KEY, []);
  const storyIndex = stories.findIndex(s => s.id === id);
  if (storyIndex === -1) {
    console.error('[DB UpdateStory] Story not found:', id);
    return undefined;
  }
  const originalStory = stories[storyIndex];
  stories[storyIndex] = { ...originalStory, ...updates };
  if (updates.content && (!updates.summary || updates.summary === originalStory.summary)) {
    stories[storyIndex].summary = generateSummary(updates.content);
  }
  saveToLocalStorage(STORIES_KEY, stories);
  console.log('[DB UpdateStory] Updated story:', id, 'New Status:', stories[storyIndex].status, 'Updates:', updates);
  return JSON.parse(JSON.stringify(stories[storyIndex]));
};

export const deleteStoryById = async (id: string): Promise<boolean> => {
  let stories = getFromLocalStorage<Story[]>(STORIES_KEY, []);
  const initialLength = stories.length;
  stories = stories.filter(s => s.id !== id);
  saveToLocalStorage(STORIES_KEY, stories);
  return stories.length < initialLength;
};

// Scheduled Generations
const sortScheduledGenerations = (items: ScheduledGeneration[]): ScheduledGeneration[] => {
  return [...items].sort((a, b) => {
    // Handle cases where scheduledDate or scheduledTime might be undefined or invalid
    const aDateValid = a.scheduledDate && a.scheduledTime;
    const bDateValid = b.scheduledDate && b.scheduledTime;

    if (!aDateValid && !bDateValid) return 0;
    if (!aDateValid) return 1; // Sort items without valid dates to the end
    if (!bDateValid) return -1; // Sort items without valid dates to the end

    try {
      const dateA = parseISO(`${a.scheduledDate}T${a.scheduledTime}`);
      const dateB = parseISO(`${b.scheduledDate}T${b.scheduledTime}`);
      if (!isValid(dateA) && !isValid(dateB)) return 0;
      if (!isValid(dateA)) return 1;
      if (!isValid(dateB)) return -1;
      return dateA.getTime() - dateB.getTime();
    } catch (e) {
      console.error("Error sorting scheduled generations:", e);
      return 0;
    }
  });
};


export const getScheduledGenerations = async (): Promise<ScheduledGeneration[]> => {
  let items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  if (typeof window !== 'undefined' && window.localStorage.getItem(SCHEDULED_GENERATIONS_KEY) === null) {
    // Ensure localStorage is initialized if it was never set.
    saveToLocalStorage(SCHEDULED_GENERATIONS_KEY, []);
    items = []; 
  }
  return JSON.parse(JSON.stringify(sortScheduledGenerations(items)));
};

export const addScheduledGeneration = async (
  data: Omit<ScheduledGeneration, 'id' | 'status' | 'createdAt'>
): Promise<{ newScheduledGeneration: ScheduledGeneration; allItems: ScheduledGeneration[] }> => {
  let items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  const newScheduledGeneration: ScheduledGeneration = {
    ...data,
    id: `sg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  items.push(newScheduledGeneration);
  saveToLocalStorage(SCHEDULED_GENERATIONS_KEY, items); // Save the updated array
  
  // Fetch all items again from localStorage to ensure sorted and complete list is returned
  const allCurrentItems = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  return { 
    newScheduledGeneration: JSON.parse(JSON.stringify(newScheduledGeneration)), 
    allItems: JSON.parse(JSON.stringify(sortScheduledGenerations(allCurrentItems)))
  };
};

export const updateScheduledGenerationStatus = async (id: string, status: ScheduledGenerationStatus, generatedStoryId?: string, errorMessage?: string): Promise<ScheduledGeneration | undefined> => {
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
  console.log('[DB UpdateScheduledGen] Updated:', id, 'Status:', status, 'StoryID:', generatedStoryId, 'Error:', errorMessage);
  return JSON.parse(JSON.stringify(items[index]));
};

export const deleteScheduledGenerationById = async (id: string): Promise<boolean> => {
  let items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  const initialLength = items.length;
  items = items.filter(sg => sg.id !== id);
  saveToLocalStorage(SCHEDULED_GENERATIONS_KEY, items);
  return items.length < initialLength;
};

export const getScheduledGenerationById = async (id: string): Promise<ScheduledGeneration | undefined> => {
  console.warn("dbGetScheduledGenerationById is likely called from server action, which cannot access localStorage. This will return undefined on server.");
  if (typeof window === 'undefined') return undefined; // Cannot access localStorage on server
  const items = getFromLocalStorage<ScheduledGeneration[]>(SCHEDULED_GENERATIONS_KEY, []);
  const scheduledItem = items.find(s => s.id === id);
  return scheduledItem ? JSON.parse(JSON.stringify(scheduledItem)) : undefined;
};

// Weekly Recurring Schedules
export const getWeeklySchedules = async (): Promise<WeeklyScheduleItem[]> => {
  const items = getFromLocalStorage<WeeklyScheduleItem[]>(WEEKLY_SCHEDULES_KEY, []);
   if(items.length === 0 && typeof window !== 'undefined' && !window.localStorage.getItem(WEEKLY_SCHEDULES_KEY)) {
    saveToLocalStorage(WEEKLY_SCHEDULES_KEY, []); // Initialize if not set
  }
  return JSON.parse(JSON.stringify(items));
};

export const upsertWeeklySchedule = async (itemData: Omit<WeeklyScheduleItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeeklyScheduleItem> => {
  let items = getFromLocalStorage<WeeklyScheduleItem[]>(WEEKLY_SCHEDULES_KEY, []);
  const existingItemIndex = items.findIndex(ws => ws.dayOfWeek === itemData.dayOfWeek && ws.time === itemData.time);
  const now = new Date().toISOString();

  let savedItem: WeeklyScheduleItem;
  if (existingItemIndex > -1) {
    items[existingItemIndex] = {
      ...items[existingItemIndex],
      genre: itemData.genre,
      updatedAt: now,
    };
    savedItem = items[existingItemIndex];
  } else {
    const newItem: WeeklyScheduleItem = {
      ...itemData,
      id: `ws-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    savedItem = newItem;
  }
  saveToLocalStorage(WEEKLY_SCHEDULES_KEY, items);
  return JSON.parse(JSON.stringify(savedItem));
};

export const deleteWeeklyScheduleByDayTime = async (dayOfWeek: DayOfWeek, time: string): Promise<boolean> => {
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
