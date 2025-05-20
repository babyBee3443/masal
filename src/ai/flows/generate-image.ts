
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

// NOT EXPORTED as a const value from 'use server' file
const RegenerateAIImageOutputSchemaInternal = z.object({
  imageUrl: z.string().describe('Yeni oluşturulan görselin data URIsi.'),
});
export type RegenerateAIImageOutput = z.infer<typeof RegenerateAIImageOutputSchemaInternal>; // Type export is fine

export async function regenerateAIImage(input: RegenerateAIImageInput): Promise<RegenerateAIImageOutput> {
  return regenerateAIImageFlow(input);
}

// This prompt is not directly used for image generation model, but can be used for pre-processing text if needed.
// The actual image generation prompt is constructed within the flow.
const regenerateAIImageTextPrompt = ai.definePrompt({
  name: 'regenerateAIImageTextPrompt',
  input: {schema: RegenerateAIImageInputSchema},
  prompt: `Aşağıdaki hikayenin özünü yakalayan görsel olarak çarpıcı bir resim oluşturun:\n\n{{{storyText}}}\n\nLütfen oluşturulan görselin tüm kitleler için uygun olduğundan emin olun. ÖNEMLİ: Lütfen oluşturulan görselde HİÇBİR yazı, harf veya kelime KULLANMA. Sadece görsel öğeler olsun.`,
});

const regenerateAIImageFlow = ai.defineFlow(
  {
    name: 'regenerateAIImageFlow',
    inputSchema: RegenerateAIImageInputSchema,
    outputSchema: RegenerateAIImageOutputSchemaInternal,
  },
  async input => {
    // Construct the prompt for the image generation model directly
    const imagePrompt = `Aşağıdaki hikayenin özünü yakalayan görsel olarak çarpıcı bir resim oluşturun: ${input.storyText.substring(0, 500)}...\n\nÖNEMLİ: Lütfen oluşturulan görselde HİÇBİR yazı, harf veya kelime KULLANMA. Sadece görsel öğeler olsun.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: imagePrompt, 
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
