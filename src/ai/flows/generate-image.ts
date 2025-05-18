'use server';

/**
 * @fileOverview Bir hikaye için yapay zeka tarafından üretilen görseli yeniden oluşturan AI ajanı.
 *
 * - regenerateAIImage - Bir hikaye için AI görselinin yeniden oluşturulmasını yöneten bir fonksiyon.
 * - RegenerateAIImageInput - regenerateAIImage fonksiyonu için giriş tipi.
 * - RegenerateAIImageOutput - regenerateAIImage fonksiyonu için dönüş tipi.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateAIImageInputSchema = z.object({
  storyText: z.string().describe('Görsel oluşturulacak hikayenin metni.'),
});
export type RegenerateAIImageInput = z.infer<typeof RegenerateAIImageInputSchema>;

const RegenerateAIImageOutputSchema = z.object({
  imageUrl: z.string().describe('Yeni oluşturulan görselin data URIsi.'),
});
export type RegenerateAIImageOutput = z.infer<typeof RegenerateAIImageOutputSchema>;

export async function regenerateAIImage(input: RegenerateAIImageInput): Promise<RegenerateAIImageOutput> {
  return regenerateAIImageFlow(input);
}

const regenerateAIImagePrompt = ai.definePrompt({
  name: 'regenerateAIImagePrompt',
  input: {schema: RegenerateAIImageInputSchema},
  // output: {schema: RegenerateAIImageOutputSchema}, // Output schema is handled by the image generation model directly
  prompt: `Aşağıdaki hikayenin özünü yakalayan görsel olarak çarpıcı bir resim oluşturun:\n\n{{{storyText}}}\n\nLütfen oluşturulan görselin tüm kitleler için uygun olduğundan emin olun.`,
});

const regenerateAIImageFlow = ai.defineFlow(
  {
    name: 'regenerateAIImageFlow',
    inputSchema: RegenerateAIImageInputSchema,
    outputSchema: RegenerateAIImageOutputSchema,
  },
  async input => {
    // Using regenerateAIImagePrompt to potentially process text before image generation if needed, though here it's direct.
    // For this specific case, the prompt text for image generation is simple enough.
    // const processedInput = await regenerateAIImagePrompt(input); // If pre-processing was needed

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: `Aşağıdaki hikayenin özünü yakalayan görsel olarak çarpıcı bir resim oluşturun: ${input.storyText}`, // Directly use input or processed input
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Görsel oluşturulamadı veya URL alınamadı.');
    }

    return {imageUrl: media.url};
  }
);
