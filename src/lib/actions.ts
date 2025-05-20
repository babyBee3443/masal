
'use server';

import type { Story, StoryGenre, ScheduledGeneration, WeeklyScheduleItem, DayOfWeek, StorySubGenre } from '@/lib/types';
import type { StoryLength, StoryComplexity } from '@/lib/constants';
import { sendApprovalEmail } from '@/lib/email-service';
import { generateStory as aiGenerateStory } from '@/ai/flows/generate-story';
import { regenerateAIImage as aiRegenerateAIImage } from '@/ai/flows/generate-image';
import { randomUUID } from 'crypto'; // For generating unique IDs

// Client components will call mock-db functions directly for localStorage modifications.
// Server actions are now primarily for:
// 1. AI interactions (which must run server-side).
// 2. Data validation/preparation before client handles localStorage.
// 3. Triggering side effects like sending emails.

export async function publishStoryAction(storyId: string) {
  console.warn("[Action] publishStoryAction: Client should handle localStorage update. This action now only returns data for the client to act upon.");
  return { 
      success: true, 
      storyDataToUpdate: { 
          id: storyId, 
          status: 'published' as 'published', 
          publishedAt: new Date().toISOString(),
          scheduledAtDate: undefined, 
          scheduledAtTime: undefined 
      } 
  };
}

export async function deleteStoryAction(storyId: string) {
  console.warn("[Action] deleteStoryAction: Client should handle localStorage deletion. This action only returns an ID for the client.");
  return { success: true, storyIdToDelete: storyId }; 
}

export async function updateStoryCategoryAction(storyId: string, newGenre: StoryGenre, newSubGenre?: StorySubGenre) {
  console.warn("[Action] updateStoryCategoryAction: Client should handle localStorage update. This action returns data for client update.");
  return { success: true, storyDataToUpdate: { id: storyId, genre: newGenre, subGenre: newSubGenre } };
}

export async function approveStoryAction(storyId: string): Promise<{ success: boolean; storyDataToUpdate?: Partial<Story> & {id: string}; error?: string}> {
    console.warn("[Action] approveStoryAction: Client handles localStorage update. This returns data for client update.");
    return {
        success: true,
        storyDataToUpdate: {
            id: storyId,
            status: 'pending'
        }
    };
}


export async function generateNewStoryAction(
  genre: StoryGenre, 
  length?: StoryLength, 
  complexity?: StoryComplexity,
  subGenre?: StorySubGenre,
  // adminRecipientEmail?: string // Future: Client can pass recipient from localStorage settings
): Promise<{ success: boolean; storyData?: Omit<Story, 'summary' | 'createdAt'> & {id: string} ; error?: string }> {
  try {
    console.log(`[Action] generateNewStoryAction: Generating story for genre: ${genre}, subGenre: ${subGenre}, length: ${length}, complexity: ${complexity}`);
    const aiResult = await aiGenerateStory({ genre, length, complexity, subGenre }); 
    console.log(`[Action] generateNewStoryAction: AI result received: Title: ${aiResult?.title ? 'Yes' : 'No'}, Content: ${aiResult?.content ? 'Yes' : 'No'}, ImageUrl: ${aiResult?.imageUrl ? 'Yes' : 'No'}`);

    if (!aiResult || !aiResult.title || !aiResult.content || !aiResult.imageUrl) {
      console.error("[Action] generateNewStoryAction: AI did not return expected title, content, or imageUrl.", aiResult);
      let specificError = 'Yapay zeka hikaye başlığı, içeriği veya görseli oluşturamadı.';
      if (!aiResult?.title) specificError += ' Başlık eksik.';
      if (!aiResult?.content) specificError += ' İçerik eksik.';
      if (!aiResult?.imageUrl) specificError += ' Görsel URL eksik.';
      throw new Error(specificError);
    }
    
    const storyId = randomUUID(); 

    const newStoryData: Omit<Story, 'summary' | 'createdAt'> & { id: string } = {
      id: storyId, 
      title: aiResult.title,
      content: aiResult.content,
      imageUrl: aiResult.imageUrl, 
      genre: genre,
      subGenre: subGenre,
      status: 'awaiting_approval', 
    };
    console.log(`[Action] generateNewStoryAction: Story data prepared successfully. ID: ${storyId}, Genre: ${genre}, SubGenre: ${subGenre}, Status: 'awaiting_approval'`);
    
    // Send approval email - recipient will be taken from .env by default if not passed as param
    const emailSent = await sendApprovalEmail(newStoryData.id, newStoryData.title, newStoryData.content /*, adminRecipientEmail */);
    if (emailSent) {
      console.log(`[Action] generateNewStoryAction: Approval email successfully queued for "${newStoryData.title}" (ID: ${newStoryData.id}).`);
    } else {
      console.warn(`[Action] generateNewStoryAction: Failed to send approval email for "${newStoryData.title}". Proceeding without email, but story is ready for localStorage.`);
    }

    return { success: true, storyData: newStoryData };
  } catch (error) {
    console.error(`[Action] generateNewStoryAction: Error generating new story for genre ${genre}:`, error);
    let errorMessage = 'Yapay zeka ile hikaye oluşturulamadı.';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    // @ts-ignore
    if (error?.details?.code === 'ABORTED' && error?.details?.message?.includes('SafetyPolicyViolation')) {
      errorMessage = 'Hikaye üretimi güvenlik politikalarını ihlal ettiği için engellendi. Lütfen farklı bir tür veya konu deneyin.';
    }
    // @ts-ignore
    else if (error?.cause?.code === 'blocked' && error?.cause?.message?.includes('SAFETY')) {
        errorMessage = 'Hikaye üretimi güvenlik filtreleri tarafından engellendi. İçerik uygunsuz olabilir.';
    }
    
    return { success: false, error: errorMessage };
  }
}

export async function regenerateStoryImageAction(storyId: string, storyText: string): Promise<{ success: boolean; imageUrl?: string; storyIdToUpdate?: string; error?: string }> {
  try {
    console.log(`[Action] regenerateStoryImageAction: Regenerating image for storyId: ${storyId}`);
    const aiResult = await aiRegenerateAIImage({ storyText });
    if (!aiResult.imageUrl) {
      throw new Error('Yapay zeka yeni bir görsel URLsi oluşturamadı.');
    }
    console.log(`[Action] regenerateStoryImageAction: Image regenerated successfully for storyId: ${storyId}. Client will update localStorage.`);
    return { success: true, imageUrl: aiResult.imageUrl, storyIdToUpdate: storyId };
  } catch (error) {
    console.error("[Action] regenerateStoryImageAction: Error regenerating image:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Görsel yeniden oluşturulamadı' };
  }
}

export async function scheduleStoryPublicationAction(storyId: string, date: string, time: string): Promise<{ success: boolean; storyDataToUpdate?: Partial<Story> & { id: string }; error?: string }> {
  console.warn("[Action] scheduleStoryPublicationAction: Client handles localStorage update. This action returns data for client update.");
  return { 
    success: true, 
    storyDataToUpdate: { 
      id: storyId, 
      scheduledAtDate: date, 
      scheduledAtTime: time, 
      status: 'pending' 
    } 
  };
}

export async function scheduleStoryGenerationAction(
  scheduledDate: string, 
  scheduledTime: string, 
  genre: StoryGenre
): Promise<{ 
  success: boolean; 
  newScheduledGenerationData?: Omit<ScheduledGeneration, 'id' | 'status' | 'createdAt'>; 
  error?: string 
}> {
  console.log(`[Action] scheduleStoryGenerationAction: Server action received date: ${scheduledDate}, time: ${scheduledTime}, genre: ${genre}. Preparing data for client to add to localStorage.`);
  try {
    if (!scheduledDate || !scheduledTime || !genre) {
      console.error("[Action] scheduleStoryGenerationAction: Missing date, time, or genre from client.");
      return { success: false, error: "Sunucu: Lütfen tarih, saat ve tür bilgilerini eksiksiz girin." };
    }
    
    const newScheduledGenerationData: Omit<ScheduledGeneration, 'id' | 'status' | 'createdAt'> = {
      scheduledDate,
      scheduledTime,
      genre
    };
    console.log("[Action] scheduleStoryGenerationAction: Prepared data for client:", newScheduledGenerationData);
    return { success: true, newScheduledGenerationData };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Planlama sırasında bir sunucu hatası oluştu.";
    console.error("[Action] scheduleStoryGenerationAction: Error on server:", error);
    return { success: false, error };
  }
}

export async function processScheduledGenerationAction(id: string, genre: StoryGenre): Promise<{ 
  success: boolean; 
  storyData?: Omit<Story, 'summary' | 'createdAt'> & {id: string} ;
  error?: string; 
  scheduledGenerationId: string; 
}> {
  console.log(`[Action] processScheduledGenerationAction: Processing scheduled generation ID: ${id} for Genre: ${genre}`);
  
  try {
    // The 'genre' is now passed from the client, so we use it directly.
    // const scheduledItem = await dbGetScheduledGenerationById(id); // No longer needed on server
    // if (!scheduledItem) {
    //   console.error(`[Action] processScheduledGenerationAction: Scheduled generation not found (server read): ${id}`);
    //   return { success: false, error: `Planlanmış üretim bulunamadı (sunucu okuma): ${id}`, scheduledGenerationId: id };
    // }

    const generationResult = await generateNewStoryAction(genre, undefined, undefined, undefined /*, adminRecipientEmail - future */); 

    if (generationResult.success && generationResult.storyData) {
      console.log(`[Action] processScheduledGenerationAction: Story generated successfully by AI for scheduled ID: ${id}, Genre: ${genre}. Story title: "${generationResult.storyData.title}", Story ID: ${generationResult.storyData.id}`);
      return { 
        success: true, 
        storyData: generationResult.storyData, 
        scheduledGenerationId: id,
      };
    } else {
      console.error(`[Action] processScheduledGenerationAction: Story generation failed for scheduled ID: ${id}. Error: ${generationResult.error}`);
      return { 
        success: false, 
        error: generationResult.error || "Hikaye üretilemedi (alt eylem başarısız).", 
        scheduledGenerationId: id,
      };
    }
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Planlanmış üretim işlenirken beklenmedik bir sunucu hatası oluştu.";
    console.error(`[Action] processScheduledGenerationAction: Catch block error for scheduled ID: ${id}:`, e);
    return { 
      success: false, 
      error: errorMsg, 
      scheduledGenerationId: id,
    };
  }
}

export async function deleteScheduledGenerationAction(id: string): Promise<{ success: boolean; error?: string; scheduledGenerationIdToDelete?: string }> {
  console.warn("[Action] deleteScheduledGenerationAction: Client handles localStorage deletion. This action returns ID for client.");
  return { success: true, scheduledGenerationIdToDelete: id };
}


export async function getWeeklySchedulesAction(): Promise<{ success: boolean; schedules?: WeeklyScheduleItem[]; error?: string; }> {
  console.warn("[Action] getWeeklySchedulesAction: Client reads from localStorage. This action is a placeholder if server-side data fetching was needed.");
  return { success: true, schedules: [] }; 
}

export async function saveWeeklyScheduleSlotAction(
  dayOfWeek: DayOfWeek, 
  time: string, 
  genre: StoryGenre | null 
): Promise<{ 
  success: boolean; 
  slotToSave?: { dayOfWeek: DayOfWeek; time: string; genre: StoryGenre | null }; 
  error?: string; 
}> {
  console.log(`[Action] saveWeeklyScheduleSlotAction: Server action received day: ${dayOfWeek}, time: ${time}, genre: ${genre}. Preparing data for client to update localStorage.`);
  try {
    if (genre === "" || genre === undefined) genre = null; // Treat empty string or undefined as clearing the slot

    if (genre && !["Korku", "Macera", "Romantik", "Bilim Kurgu", "Fabl", "Felsefi"].includes(genre)) {
        console.error("[Action] saveWeeklyScheduleSlotAction: Invalid genre provided:", genre);
        return { success: false, error: "Geçersiz tür." };
    }
    const slotToSave = { dayOfWeek, time, genre };
    console.log("[Action] saveWeeklyScheduleSlotAction: Prepared data for client:", slotToSave);
    return { success: true, slotToSave };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Haftalık plan kaydedilirken bir sunucu hatası oluştu.";
    console.error("[Action] saveWeeklyScheduleSlotAction: Error on server:", error);
    return { success: false, error };
  }
}
