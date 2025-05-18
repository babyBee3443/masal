import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getStoryById, getStories } from '@/lib/mock-db';
import type { Story } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/site/StoryCard';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Separator } from '@/components/ui/separator';

interface StoryPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.filter(s => s.status === 'published').map(story => ({
    id: story.id,
  }));
}

export async function generateMetadata({ params }: StoryPageProps) {
  const story = await getStoryById(params.id);
  if (!story || story.status !== 'published') {
    return { title: 'Story Not Found' };
  }
  return {
    title: story.title,
    description: story.summary,
  };
}

async function RelatedStories({ currentStoryId, currentGenre }: { currentStoryId: string; currentGenre: Story['genre'] }) {
  let stories = await getStories();
  stories = stories.filter(story => 
    story.status === 'published' && 
    story.id !== currentStoryId &&
    story.genre === currentGenre
  ).slice(0, 3); // Get up to 3 related stories

  if (stories.length === 0) { // If no stories in same genre, get any 3 other stories
     stories = (await getStories()).filter(story => 
        story.status === 'published' && 
        story.id !== currentStoryId
      ).slice(0, 3);
  }
  
  if (stories.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16 animate-fadeIn" style={{animationDelay: '0.6s'}}>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">Similar Tales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}


export default async function StoryPage({ params }: StoryPageProps) {
  const story = await getStoryById(params.id);

  if (!story || story.status !== 'published') {
    notFound();
  }

  const paragraphs = story.content.split('\n').filter(p => p.trim() !== '');

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <article className="max-w-3xl mx-auto">
          <div className="mb-6 animate-fadeIn">
            <Button variant="outline" asChild>
              <Link href={searchParamsReferrer() || "/"}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stories
              </Link>
            </Button>
          </div>

          <header className="mb-8 animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <Badge variant="secondary" className="mb-3 bg-accent/20 text-accent-foreground">{story.genre}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">{story.title}</h1>
            {story.publishedAt && (
              <p className="text-sm text-muted-foreground">
                Published on {new Date(story.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </header>
          
          <div className="mb-8 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <Image
              src={story.imageUrl || `https://placehold.co/800x500.png`}
              alt={`Illustration for ${story.title}`}
              width={800}
              height={500}
              className="w-full h-auto rounded-xl object-cover shadow-xl"
              priority
              data-ai-hint="story main illustration"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 animate-fadeIn" style={{animationDelay: '0.3s'}}>
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-6 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          
          <Separator className="my-12" />

          <RelatedStories currentStoryId={story.id} currentGenre={story.genre} />
        </article>
      </main>
      <Footer />
    </>
  );
}

// Helper for back button. In a real app, use router history or more robust referrer check.
// For this simulation, it will default to home.
function searchParamsReferrer(): string | null {
  // This is a placeholder. Proper referrer handling is complex with SSR/caching.
  // In a client component, one might use `document.referrer` or router state.
  return null; 
}
