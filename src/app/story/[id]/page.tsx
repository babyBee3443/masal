
'use client'; 
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import Image from 'next/image';
import { getStoryById, getStories } from '@/lib/mock-db';
import type { Story } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, BookText, Sparkles } from 'lucide-react'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/site/StoryCard';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Separator } from '@/components/ui/separator';
import { APP_NAME, SUBGENRES_MAP } from '@/lib/constants';


function RelatedStories({ currentStoryId, currentGenre }: { currentStoryId: string; currentGenre: Story['genre'] }) {
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);
      let allStories = await getStories();
      let filtered = allStories.filter(story => 
        story.status === 'published' && 
        story.id !== currentStoryId &&
        story.genre === currentGenre
      ).slice(0, 3);

      if (filtered.length === 0) {
         filtered = allStories.filter(story => 
            story.status === 'published' && 
            story.id !== currentStoryId
          ).slice(0, 3);
      }
      setRelatedStories(filtered);
      setIsLoading(false);
    };
    fetchRelated();
  }, [currentStoryId, currentGenre]);

  if (isLoading) {
    return (
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_,i) => (
                <div key={i} className="bg-card p-4 rounded-lg shadow-md animate-pulse">
                    <div className="w-full h-40 bg-muted rounded-md mb-3"></div>
                    <div className="w-2/3 h-5 bg-muted rounded-md mb-2"></div>
                    <div className="w-full h-4 bg-muted rounded-md"></div>
                </div>
            ))}
        </div>
    );
  }
  
  if (relatedStories.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16 animate-fadeIn" style={{animationDelay: '0.6s'}}>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">Benzer Masallar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedStories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}


export default function StoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [story, setStory] = useState<Story | null | undefined>(undefined); 

  useEffect(() => {
    const fetchStory = async () => {
      if (id) {
        const fetchedStory = await getStoryById(id);
        if (fetchedStory && fetchedStory.status === 'published') {
          setStory(fetchedStory);
          document.title = `${fetchedStory.title} | ${APP_NAME}`;
        } else {
          setStory(null); 
          document.title = `Hikaye Bulunamadı | ${APP_NAME}`;
        }
      }
    };
    fetchStory();
  }, [id]);

  if (story === undefined) { 
    return (
      <>
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Hikaye yükleniyor...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!story) {
    return (
         <>
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8 text-center">
                <h1 className="text-3xl font-bold">Hikaye Bulunamadı</h1>
                <p className="text-muted-foreground mt-4">Aradığınız hikaye mevcut değil veya henüz yayınlanmamış.</p>
                <Button asChild className="mt-6"><Link href="/">Ana Sayfaya Dön</Link></Button>
            </main>
            <Footer />
        </>
    );
  }

  const paragraphs = story.content.split('\n').filter(p => p.trim() !== '');
  const capitalizedGenre = story.genre.charAt(0).toUpperCase() + story.genre.slice(1).toLowerCase();
  const subGenreLabel = story.genre && story.subGenre && SUBGENRES_MAP[story.genre]?.find(sg => sg.value === story.subGenre)?.label;

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <article className="max-w-3xl mx-auto">
          <div className="mb-6 animate-fadeIn">
            <Button variant="outline" asChild>
              <Link href={typeof window !== 'undefined' && document.referrer ? document.referrer : "/"}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Hikayelere Geri Dön
              </Link>
            </Button>
          </div>

          <header className="mb-8 animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <div className="flex flex-wrap gap-2 items-center mb-3">
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                    <Sparkles className="w-3 h-3 mr-1.5 fill-current" />
                    {capitalizedGenre}
                </Badge>
                {subGenreLabel && (
                    <Badge variant="outline" className="border-primary/50 text-primary/90 bg-primary/10">
                         <BookText className="w-3 h-3 mr-1.5" />
                        {subGenreLabel}
                    </Badge>
                )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">{story.title}</h1>
            {story.publishedAt && (
              <p className="text-sm text-muted-foreground">
                Yayınlanma tarihi: {new Date(story.publishedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </header>
          
          <div className="mb-8 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <Image
              src={story.imageUrl || `https://placehold.co/800x500.png`}
              alt={`${story.title} için illüstrasyon`}
              width={800}
              height={500}
              className="w-full h-auto rounded-xl object-cover shadow-xl"
              priority
              data-ai-hint="story main illustration"
              key={story.imageUrl} 
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
