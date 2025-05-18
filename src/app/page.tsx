
'use client'; // Add 'use client' for localStorage access in getStories
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { getStories } from '@/lib/mock-db';
import type { Story, StoryGenre } from '@/lib/types';
import { StoryCard } from '@/components/site/StoryCard';
import { CategoryTabs } from '@/components/site/CategoryTabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Loader2 } from 'lucide-react'; // Added Loader2
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { APP_NAME } from '@/lib/constants';

interface HomePageProps {
  searchParams: {
    genre?: StoryGenre;
    q?: string;
  };
}

function StoriesList({ genre, query }: { genre?: StoryGenre; query?: string }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetStories = async () => {
      setIsLoading(true);
      let allStories = await getStories();
      
      allStories = allStories.filter(story => story.status === 'published');

      if (genre) {
        allStories = allStories.filter(story => story.genre === genre);
      }

      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        allStories = allStories.filter(story => 
          story.title.toLowerCase().includes(lowerCaseQuery) ||
          (story.summary && story.summary.toLowerCase().includes(lowerCaseQuery)) || // Check if summary exists
          story.content.toLowerCase().includes(lowerCaseQuery)
        );
      }
      setStories(allStories);
      setIsLoading(false);
    };

    fetchAndSetStories();
  }, [genre, query]);

  if (isLoading) {
    return <LoadingStories />;
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <Sparkles className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Hiç Hikaye Bulunamadı</h2>
        <p className="text-muted-foreground mb-6">
          Görünüşe göre şu anda kriterlerinize uyan hiçbir hikaye yok.
          { (genre || query) && " Farklı bir filtre veya arama terimi deneyin." }
        </p>
        <Button asChild variant="outline">
          <Link href="/">Filtreleri Temizle</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-fadeIn">
      {stories.map((story, index) => (
        <StoryCard key={story.id} story={story} priorityImage={index < 4} />
      ))}
    </div>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  const currentGenre = searchParams.genre;
  const searchQuery = searchParams.q;

  // This ensures that on the client, if searchParams change, the component re-renders
  // and StoriesList (which is client-side due to useEffect) re-fetches.
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [currentGenre, searchQuery]);


  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <section className="text-center py-12 md:py-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            {APP_NAME}'na Hoş Geldiniz
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Yapay zeka tarafından üretilmiş merak, gerilim ve romantizm dolu diyarlarda yolculuklara çıkın. Yeni masallar keşfinizi bekliyor.
          </p>
        </section>

        <section className="mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <form className="flex gap-2 max-w-xl mx-auto mb-8">
            <Input
              type="search"
              name="q"
              placeholder="Hikayeleri anahtar kelime ile arayın..."
              className="flex-grow text-base"
              defaultValue={searchQuery}
              aria-label="Hikaye ara"
            />
            {currentGenre && <input type="hidden" name="genre" value={currentGenre} />}
            <Button type="submit" variant="default" size="lg">
              <Search className="h-5 w-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">Ara</span>
            </Button>
          </form>
          <CategoryTabs currentGenre={currentGenre || 'Tümü'} basePath="/" />
        </section>

        {/* Suspense is less critical here if StoriesList handles its own loading state */}
        <StoriesList key={key} genre={currentGenre} query={searchQuery} />
      </main>
      <Footer />
    </>
  );
}

function LoadingStories() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-card p-4 rounded-lg shadow-md animate-pulse">
          <div className="w-full h-48 bg-muted rounded-md mb-4"></div>
          <div className="w-3/4 h-6 bg-muted rounded-md mb-2"></div>
          <div className="w-full h-4 bg-muted rounded-md mb-1"></div>
          <div className="w-full h-4 bg-muted rounded-md mb-1"></div>
          <div className="w-1/2 h-4 bg-muted rounded-md"></div>
          <div className="w-1/3 h-8 bg-muted rounded-md mt-4"></div>
        </div>
      ))}
    </div>
  );
}

    