'use server';

import { revalidatePath } from 'next/cache';
import type { Story, StoryGenre } from '@/lib/types';
import { addStory as dbAddStory, deleteStoryById as dbDeleteStoryById, updateStory as dbUpdateStory, getStoryById as dbGetStoryById } from '@/lib/mock-db';
import { generateStory as aiGenerateStory } from '@/ai/flows/generate-story';
import { regenerateAIImage as aiRegenerateAIImage } from '@/ai/flows/generate-image';

export async function publishStoryAction(storyId: string) {
  try {
    const updatedStory = await dbUpdateStory(storyId, { status: 'published', publishedAt: new Date().toISOString() });
    if (!updatedStory) throw new Error('Hikaye bulunamadı');
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/story/${storyId}`);
    revalidatePath(`/categories/${updatedStory.genre}`);
    return { success: true, story: updatedStory };
  } catch (error) {
    console.error("Hikaye yayınlanamadı:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Hikaye yayınlanamadı' };
  }
}

export async function deleteStoryAction(storyId: string) {
  try {
    const deleted = await dbDeleteStoryById(storyId);
    if (!deleted) throw new Error('Hikaye bulunamadı veya zaten silinmiş');
    revalidatePath('/');
    revalidatePath('/admin');
    // Potentially revalidate category pages if you list counts or specific stories
    return { success: true };
  } catch (error) {
    console.error("Hikaye silinemedi:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Hikaye silinemedi' };
  }
}

export async function updateStoryCategoryAction(storyId: string, newGenre: StoryGenre) {
  try {
    const oldStory = await dbGetStoryById(storyId);
    if (!oldStory) throw new Error('Hikaye bulunamadı');

    const updatedStory = await dbUpdateStory(storyId, { genre: newGenre });
    if (!updatedStory) throw new Error('Hikaye kategorisi güncellenemedi');
    
    revalidatePath('/admin');
    revalidatePath(`/story/${storyId}`);
    revalidatePath(`/categories/${oldStory.genre}`); // Revalidate old category page
    revalidatePath(`/categories/${newGenre}`);     // Revalidate new category page
    if (oldStory.status === 'published') {
      revalidatePath('/'); // Revalidate home if it was published
    }
    return { success: true, story: updatedStory };
  } catch (error) {
    console.error("Hikaye kategorisi güncellenemedi:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Kategori güncellenemedi' };
  }
}

export async function generateNewStoryAction(genre: StoryGenre): Promise<{ success: boolean; story?: Story; error?: string }> {
  try {
    const aiResult = await aiGenerateStory({ genre });
    const newStoryData: Omit<Story, 'id' | 'summary' | 'createdAt'> = {
      title: aiResult.title,
      content: aiResult.content,
      imageUrl: aiResult.imageUrl || 'https://placehold.co/600x480.png', // Fallback image
      genre: genre,
      status: 'pending',
    };
    const savedStory = await dbAddStory(newStoryData);
    revalidatePath('/admin');
    return { success: true, story: savedStory };
  } catch (error) {
    console.error("Yeni hikaye oluşturulamadı:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Yapay zeka ile hikaye oluşturulamadı' };
  }
}

export async function regenerateStoryImageAction(storyId: string, storyText: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const aiResult = await aiRegenerateAIImage({ storyText });
    if (!aiResult.imageUrl) {
      throw new Error('Yapay zeka yeni bir görsel URLsi oluşturamadı.');
    }
    const updatedStory = await dbUpdateStory(storyId, { imageUrl: aiResult.imageUrl });
    if (!updatedStory) throw new Error('Görsel güncellemesi için hikaye bulunamadı');
    
    revalidatePath('/admin');
    revalidatePath(`/story/${storyId}`);
    if (updatedStory.status === 'published') {
      revalidatePath('/');
      revalidatePath(`/categories/${updatedStory.genre}`);
    }
    return { success: true, imageUrl: aiResult.imageUrl };
  } catch (error) {
    console.error("Görsel yeniden oluşturulamadı:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Görsel yeniden oluşturulamadı' };
  }
}
