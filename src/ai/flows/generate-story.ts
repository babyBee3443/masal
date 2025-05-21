
'use server';
/**
 * @fileOverview Bir hikaye üretme yapay zeka ajanı.
 *
 * - generateStory - Hikaye üretme sürecini yöneten bir fonksiyon.
 * - GenerateStoryInput - generateStory fonksiyonu için giriş tipi.
 * - GenerateStoryOutput - generateStory fonksiyonu için dönüş tipi.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { StoryLength, StoryComplexity, TargetAudience } from '@/lib/constants';
import type { StorySubGenre } from '@/lib/types';

const GenerateStoryInputSchema = z.object({
  genre: z
    .string()
    .describe("Üretilecek hikayenin türü (örn. Korku, Macera, Romantik, Bilim Kurgu, Fabl, Felsefi)."),
  subGenre: z.string().optional().describe("Belirtilmişse, hikayenin daha spesifik alt türü (örn. Keşif ve Yolculuk, Hayalet Hikayeleri)."),
  length: z.string().optional().describe("İstenen hikaye uzunluğu (örn. kısa, orta, uzun). Boş bırakılırsa model varsayılan uzunluğu kullanır."),
  complexity: z.string().optional().describe("İstenen hikaye karmaşıklığı ve detay seviyesi (örn. basit, orta, detaylı). Boş bırakılırsa model varsayılan karmaşıklığı kullanır."),
  targetAudience: z.string().optional().describe("Hikayenin hedeflendiği yaş grubu veya kitle (örn. Çocuk (3-6 Yaş), Genç (11-18 Yaş), Yetişkin). Boş bırakılırsa genel bir kitle hedeflenir."), // Yeni alan
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const StoryTextOutputSchema = z.object({
  title: z.string().describe("Üretilen masalın başlığı."),
  content: z.string().describe("Üretilen masalın tam metin içeriği (belirtilen tüm bölümleri içermeli)."),
});
type StoryTextOutput = z.infer<typeof StoryTextOutputSchema>;

const GenerateStoryOutputSchemaInternal = z.object({
  title: z.string().describe("Üretilen hikayenin başlığı."),
  content: z.string().describe("Üretilen hikayenin tam metin içeriği."),
  imageUrl: z.string().describe("Üretilen görseli içeren bir data URI. Beklenen format: 'data:<mimetype>;base64,<encoded_data>'"),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchemaInternal>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  console.log("[AI Flow] generateStory called with input:", input);
  return generateStoryFlow(input);
}

const generateStoryPrompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: {schema: GenerateStoryInputSchema},
  output: {schema: StoryTextOutputSchema},
  prompt: `Yaratıcı bir hikaye yazarısın.
Aşağıdaki ana türde bir hikaye yaz: {{{genre}}}.
{{#if subGenre}}
Hikayenin alt türü: "{{subGenre}}" olmalıdır. Lütfen bu alt türe uygun öğeler ve temalar kullan.
{{/if}}
{{#if length}}
Hikayenin uzunluğu yaklaşık olarak "{{length}}" olmalıdır. ("kısa": 1-3 dk okuma, "orta": 4-7 dk, "uzun": 8+ dk)
{{else}}
Hikayenin uzunluğu modelin takdirine bırakılmıştır.
{{/if}}
{{#if complexity}}
Hikayenin karmaşıklığı ve detay seviyesi "{{complexity}}" olmalıdır.
{{else}}
Hikayenin karmaşıklığı ve detay seviyesi modelin takdirine bırakılmıştır.
{{/if}}
{{#if targetAudience}}
Bu hikaye "{{targetAudience}}" hedef kitlesine uygun olmalıdır. Lütfen dil, konu ve karmaşıklık açısından bu kitleye hitap et.
{{/if}}

"kısa" uzunluk genellikle 3-5 paragraf, "orta" uzunluk 6-10 paragraf, "uzun" ise 10'dan fazla paragraf anlamına gelir.
"basit" karmaşıklık daha az karakter ve olay, doğrudan bir anlatım; "orta" karmaşıklık birkaç yan karakter ve olay örgüsü; "detaylı" karmaşıklık ise zengin karakter gelişimi, çoklu olay örgüleri ve derinlemesine bir anlatım anlamına gelir.

Bu hikayeyi Türkçe bir masal formatında oluşturmalısın. Masal yazarken aşağıdaki kurallara ve aşamalara uymalısın:

**Masal Yazma Kuralları ve Yapısı:**
1.  **Başlangıç (Döşeme Bölümü):** Masalına "Bir varmış bir yokmuş..." veya "Evvel zaman içinde..." gibi geleneksel bir tekerleme ile başla.
2.  **Kahramanlar ve Konu (Serim ve Hazırlık Aşaması):** Ana ve yan karakterleri belirginleştir. Masalın ana konusunu ve temel sorununu ortaya koy. Karakterlerin (insanlar, hayvanlar, olağanüstü varlıklar) özelliklerini ve yer/zamanı genel ifadelerle belirt.
3.  **Gelişme ve Problem Çözümü (Düğüm ve Planlama Aşaması):** Olayları geliştir. Merak duygusunu canlı tutarak olayları detaylandır. Kahramanın problemi nasıl çözeceğine dair bir plan oluştur.
4.  **Sonuç (Çözüm Aşaması):** Sorunlar çözüme kavuşur. İyiler kazanır, kötüler cezalandırılır.
5.  **Bitiş ve İyi Dilekler (Dilek Bölümü):** "Onlar ermiş muradına, biz çıkalım kerevetine." gibi kalıplaşmış sözlerle veya benzeri iyi dilek ifadeleriyle sonlandır.

**İstenen Çıktı (Sadece Metin):**
Bu masalla ilişkili olarak aşağıdaki bilgileri JSON formatında döndürmelisin:
*   \`title\`: Üretilen masalın başlığı.
*   \`content\`: Üretilen masalın tam metin içeriği (yukarıdaki tüm bölümleri içermeli).

Lütfen hikayeyi akıcı bir Türkçe ile yaz ve masalın büyülü atmosferini yansıt. Görsel üretimi bu adımın bir parçası DEĞİLDİR. ÖNEMLİ: Lütfen ürettiğin içerikte HİÇBİR şekilde markdown formatlaması (örneğin **, __, *, # vb.) KULLANMA. Sadece düz metin olsun.`,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchemaInternal,
  },
  async (input: GenerateStoryInput) => {
    console.log("[AI Flow] generateStoryFlow started with input:", input);
    const storyTextResult = await generateStoryPrompt(input);
    console.log("[AI Flow] storyTextResult output:", storyTextResult.output);

    if (!storyTextResult.output || !storyTextResult.output.title || !storyTextResult.output.content) {
      console.error("[AI Flow] Hikaye başlığı veya içeriği üretilemedi. AI Output:", storyTextResult.output);
      throw new Error('Hikaye başlığı veya içeriği üretilemedi.');
    }

    const { title, content } = storyTextResult.output;

    let imagePromptText = `"${title}" başlıklı, "${input.genre}" ana türünde`;
    if (input.subGenre) {
      imagePromptText += ` ve "${input.subGenre}" alt türünde`;
    }
    if (input.targetAudience) {
      imagePromptText += `, özellikle "{{targetAudience}}" hedef kitlesi için uygun olacak şekilde`;
    }
    imagePromptText += ` olan masal için fantastik ve masalsı bir illüstrasyon oluştur. Masalın konusu: ${content.substring(0, 200)}...\n\nÖNEMLİ: Lütfen oluşturulan görselde HİÇBİR yazı, harf veya kelime KULLANMA. Sadece görsel öğeler olsun.`;
    
    console.log("[AI Flow] Image generation prompt:", imagePromptText);
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: imagePromptText,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    console.log("[AI Flow] Image generation media output:", media);

    if (!media || !media.url) {
      console.error("[AI Flow] Hikaye için görsel üretilemedi veya görsel URLsi alınamadı. Media:", media);
      throw new Error('Hikaye için görsel üretilemedi veya görsel URLsi alınamadı.');
    }
    
    const finalOutput = {
      title: title,
      content: content,
      imageUrl: media.url,
    };
    console.log("[AI Flow] generateStoryFlow completed. Final output:", finalOutput);
    return finalOutput;
  }
);
