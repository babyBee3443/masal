'use server';

/**
 * @fileOverview AI agent to regenerate the AI-generated image for a story.
 *
 * - regenerateAIImage - A function that handles the regeneration of the AI image for a story.
 * - RegenerateAIImageInput - The input type for the regenerateAIImage function.
 * - RegenerateAIImageOutput - The return type for the regenerateAIImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateAIImageInputSchema = z.object({
  storyText: z.string().describe('The text of the story to generate an image for.'),
});
export type RegenerateAIImageInput = z.infer<typeof RegenerateAIImageInputSchema>;

const RegenerateAIImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the newly generated image.'),
});
export type RegenerateAIImageOutput = z.infer<typeof RegenerateAIImageOutputSchema>;

export async function regenerateAIImage(input: RegenerateAIImageInput): Promise<RegenerateAIImageOutput> {
  return regenerateAIImageFlow(input);
}

const regenerateAIImagePrompt = ai.definePrompt({
  name: 'regenerateAIImagePrompt',
  input: {schema: RegenerateAIImageInputSchema},
  output: {schema: RegenerateAIImageOutputSchema},
  prompt: `Generate a visually stunning image that captures the essence of the following story:\n\n{{{storyText}}}\n\nPlease ensure the generated image is appropriate for all audiences.`,
});

const regenerateAIImageFlow = ai.defineFlow(
  {
    name: 'regenerateAIImageFlow',
    inputSchema: RegenerateAIImageInputSchema,
    outputSchema: RegenerateAIImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.storyText,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {imageUrl: media.url!};
  }
);
