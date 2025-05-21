
'use server';

import type { Story, StoryGenre, ScheduledGeneration, WeeklyScheduleItem, DayOfWeek, StorySubGenre } from '@/lib/types';
import type { StoryLength, StoryComplexity, TargetAudience } from '@/lib/constants';
import { sendApprovalEmail } from '@/lib/email-service';
import { generateStory as aiGenerateStory } from '@/ai/flows/generate-story';
import { regenerateAIImage as aiRegenerateAIImage } from '@/ai/flows/generate-image';
import { randomUUID } from 'crypto';

// Type for successful publish action
type PublishStorySuccessResult = {
  success: true;
  storyDataToUpdate: {
    id: string;
    status: 'published';
    publishedAt: string;
    scheduledAtDate: undefined;
    scheduledAtTime: undefined;
  };
  error?: undefined;
};

// Type for successful delete action
type DeleteStorySuccessResult = {
  success: true;
  storyIdToDelete: string;
  error?: undefined;
};

// Type for successful category update action
type UpdateStoryCategorySuccessResult = {
  success: true;
  storyDataToUpdate: {
    id: string;
    genre: StoryGenre;
    subGenre?: StorySubGenre;
  };
  error?: undefined;
};

// Type for successful approve action
type ApproveStorySuccessResult = {
  success: true;
  storyDataToUpdate: Partial<Story> & { id: string };
  error?: undefined;
};

// Type for successful schedule publication action
type ScheduleStoryPublicationSuccessResult = {
  success: true;
  storyDataToUpdate: Partial<Story> & { id: string };
  error?: undefined;
};

// General failure type for actions
type ActionFailureResult = {
  success: false;
  error: string;
  storyDataToUpdate?: undefined; // Ensure data fields are not present on failure
  storyIdToDelete?: undefined;
};


export async function publishStoryAction(storyId: string): Promise<PublishStorySuccessResult | ActionFailureResult> {
  console.warn("[Action] publishStoryAction: Client should handle localStorage update. This action now only returns data for the client to act upon.");
  // This action is designed to always "succeed" from server perspective for client-side mock.
  // To satisfy type-checking for error handling in component, the return type is a union.
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

export async function deleteStoryAction(storyId: string): Promise<DeleteStorySuccessResult | ActionFailureResult> {
  console.warn("[Action] deleteStoryAction: Client should handle localStorage deletion. This action only returns an ID for the client.");
  return { success: true, storyIdToDelete: storyId }; 
}

export async function updateStoryCategoryAction(storyId: string, newGenre: StoryGenre, newSubGenre?: StorySubGenre): Promise<UpdateStoryCategorySuccessResult | ActionFailureResult> {
  console.warn("[Action] updateStoryCategoryAction: Client should handle localStorage update. This action returns data for client update.");
  return { success: true, storyDataToUpdate: { id: storyId, genre: newGenre, subGenre: newSubGenre } };
}

export async function approveStoryAction(storyId: string): Promise<ApproveStorySuccessResult | ActionFailureResult> {
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
  targetAudience?: TargetAudience,
  adminRecipientEmail?: string 
): Promise<{ success: boolean; storyData?: Story ; error?: string }> { // This one already has a good error structure
  try {
    const storyId = randomUUID();
    console.log(`[Action] generateNewStoryAction: Generating story ID: ${storyId} for genre: ${genre}, subGenre: ${subGenre}, length: ${length}, complexity: ${complexity}, targetAudience: ${targetAudience}`);
    
    const aiResult = await aiGenerateStory({ genre, length, complexity, subGenre, targetAudience }); 
    
    console.log(`[Action] generateNewStoryAction: AI result received for ID ${storyId}: Title: ${aiResult?.title ? 'Yes' : 'No'}, Content: ${aiResult?.content ? 'Yes' : 'No'}, ImageUrl: ${aiResult?.imageUrl ? 'Yes' : 'No'}`);

    if (!aiResult || !aiResult.title || !aiResult.content || !aiResult.imageUrl) {
      let specificError = 'Yapay zeka hikaye başlığı, içeriği veya görseli oluşturamadı.';
      if (!aiResult?.title) {
        console.error(`[Action] generateNewStoryAction: AI did not return title for ID ${storyId}.`);
        specificError += ' Başlık eksik.';
      }
      if (!aiResult?.content) {
        console.error(`[Action] generateNewStoryAction: AI did not return content for ID ${storyId}.`);
        specificError += ' İçerik eksik.';
      }
      if (!aiResult?.imageUrl) {
        console.error(`[Action] generateNewStoryAction: AI did not return imageUrl for ID ${storyId}.`);
        specificError += ' Görsel URL eksik.';
      }
      console.error(`[Action] generateNewStoryAction: AI did not return expected data for ID ${storyId}. Full AI Result:`, aiResult);
      return { success: false, error: specificError };
    }
    
    const newStoryData: Story = {
      id: storyId, 
      title: aiResult.title,
      content: aiResult.content,
      summary: '', // Summary will be generated by client/mock-db
      imageUrl: aiResult.imageUrl, 
      genre: genre,
      subGenre: subGenre,
      status: 'awaiting_approval',
      createdAt: new Date().toISOString(),
      length: length,
      targetAudience: targetAudience,
    };
    console.log(`[Action] generateNewStoryAction: Story data prepared successfully for ID ${storyId}. Status: 'awaiting_approval'`);
    
    if (newStoryData.status === 'awaiting_approval') {
      const emailSent = await sendApprovalEmail(
          newStoryData.id, 
          newStoryData.title, 
          newStoryData.content, // Pass full content for snippet generation in email service
          adminRecipientEmail
      );

      if (emailSent) {
        console.log(`[Action] generateNewStoryAction: Approval email successfully queued for "${newStoryData.title}" (ID: ${newStoryData.id}) to ${adminRecipientEmail || process.env.EMAIL_TO}.`);
      } else {
        console.warn(`[Action] generateNewStoryAction: Failed to send approval email for "${newStoryData.title}". Story data will still be returned for client-side localStorage save.`);
      }
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

export async function regenerateStoryImageAction(storyId: string, storyText: string): Promise<{ success: boolean; imageUrl?: string; storyIdToUpdate?: string; error?: string }> { // Already has good error structure
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

export async function scheduleStoryPublicationAction(storyId: string, date: string, time: string): Promise<ScheduleStoryPublicationSuccessResult | ActionFailureResult> {
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
  success: true; 
  newScheduledGenerationData: Omit<ScheduledGeneration, 'id' | 'status' | 'createdAt'>;
  error?: undefined;
} | ActionFailureResult> {
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
    const errorMsg = e instanceof Error ? e.message : "Planlama sırasında bir sunucu hatası oluştu.";
    console.error("[Action] scheduleStoryGenerationAction: Error on server:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function processScheduledGenerationAction(
  id: string, 
  genre: StoryGenre,
  adminRecipientEmail?: string
): Promise<{ 
  success: boolean; 
  storyData?: Story; // Story data if generation was successful
  error?: string; 
  scheduledGenerationId: string; // Always return the ID of the processed schedule
}> { // This one already has a good error structure
  console.log(`[Action] processScheduledGenerationAction: Processing scheduled generation ID: ${id} for Genre: ${genre}`);
  
  try {
    const generationResult = await generateNewStoryAction(genre, undefined, undefined, undefined, undefined, adminRecipientEmail); 

    if (generationResult.success && generationResult.storyData) {
      console.log(`[Action] processScheduledGenerationAction: Story generated successfully for scheduled ID: ${id}, Genre: ${genre}. Story title: "${generationResult.storyData.title}", Story ID: ${generationResult.storyData.id}`);
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

export async function deleteScheduledGenerationAction(id: string): Promise<{ success: true; scheduledGenerationIdToDelete: string; error?: undefined; } | ActionFailureResult> {
  console.warn("[Action] deleteScheduledGenerationAction: Client handles localStorage deletion. This action returns ID for client.");
  return { success: true, scheduledGenerationIdToDelete: id };
}


export async function getWeeklySchedulesAction(): Promise<{ 
  success: true; 
  schedules: WeeklyScheduleItem[]; 
  error?: undefined; 
} | ActionFailureResult> {
  console.warn("[Action] getWeeklySchedulesAction: Client reads from localStorage. This action is a placeholder if server-side data fetching was needed.");
  // This would ideally fetch from a DB, but for localStorage, client handles it.
  // To satisfy type, we return success with empty array.
  return { success: true, schedules: [] }; 
}

export async function saveWeeklyScheduleSlotAction(
  dayOfWeek: DayOfWeek, 
  time: string, 
  genre: StoryGenre | null 
): Promise<{ 
  success: true; 
  slotToSave: { dayOfWeek: DayOfWeek; time: string; genre: StoryGenre | null }; 
  error?: undefined;
} | ActionFailureResult> {
  console.log(`[Action] saveWeeklyScheduleSlotAction: Server action received day: ${dayOfWeek}, time: ${time}, genre: ${genre}. Preparing data for client to update localStorage.`);
  try {
    const finalGenre = (genre === "" || genre === undefined) ? null : genre;

    if (finalGenre && !["Korku", "Macera", "Romantik", "Bilim Kurgu", "Fabl", "Felsefi"].includes(finalGenre)) {
        console.error("[Action] saveWeeklyScheduleSlotAction: Invalid genre provided:", finalGenre);
        return { success: false, error: "Geçersiz tür." };
    }
    const slotToSave = { dayOfWeek, time, genre: finalGenre };
    console.log("[Action] saveWeeklyScheduleSlotAction: Prepared data for client:", slotToSave);
    return { success: true, slotToSave };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Haftalık plan kaydedilirken bir sunucu hatası oluştu.";
    console.error("[Action] saveWeeklyScheduleSlotAction: Error on server:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

    
