
'use client'; 
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams as useNextSearchParams } from 'next/navigation'; 
import { getStories } from '@/lib/mock-db';
import type { Story, StoryGenre } from '@/lib/types';
import { StoryCard } from '@/components/site/StoryCard';
import { CategoryTabs } from '@/components/site/CategoryTabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Loader2, Zap, BookOpen } from 'lucide-react'; 
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { APP_NAME } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';


function StoriesDisplay({ genre, query }: { genre?: StoryGenre; query?: string }) {
  const [allPublishedStories, setAllPublishedStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
  const [otherStories, setOtherStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchAndSetStories = async () => {
      setIsLoading(true);
      let fetchedStories = await getStories();
      
      fetchedStories = fetchedStories.filter(story => story.status === 'published');
      
      // Sort by publishedAt descending, then createdAt if publishedAt is same or missing
      fetchedStories.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return dateB - dateA;
      });

      setAllPublishedStories(fetchedStories); // Store all for potential filtering
      
      // Determine featured and other stories based on initial load (no filters yet)
      if (fetchedStories.length > 0) {
        setFeaturedStory(fetchedStories[0]);
        setOtherStories(fetchedStories.slice(1));
      } else {
        setFeaturedStory(null);
        setOtherStories([]);
      }
      setIsLoading(false);
    };

    fetchAndSetStories();
  }, []);

  useEffect(() => {
    // Apply filters when genre or query changes
    let filteredStories = [...allPublishedStories];

    if (genre) {
      filteredStories = filteredStories.filter(story => story.genre === genre);
    }

    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filteredStories = filteredStories.filter(story => 
        story.title.toLowerCase().includes(lowerCaseQuery) ||
        (story.summary && story.summary.toLowerCase().includes(lowerCaseQuery)) ||
        story.content.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // If filters are active, don't show a separate "featured" story from the filtered list in the top spot.
    // The main "featured" only makes sense for the unfiltered, latest story.
    // However, we can still show the *first* of the filtered results as "featured" if there are any.
    if (genre || query) {
      setFeaturedStory(filteredStories.length > 0 ? filteredStories[0] : null);
      setOtherStories(filteredStories.length > 0 ? filteredStories.slice(1) : []);
    } else { // No filters, use original featured/other split
      if (allPublishedStories.length > 0) {
        setFeaturedStory(allPublishedStories[0]);
        setOtherStories(allPublishedStories.slice(1));
      } else {
        setFeaturedStory(null);
        setOtherStories([]);
      }
    }

  }, [genre, query, allPublishedStories]);


  if (isLoading) {
    return <LoadingStories />;
  }

  if (!featuredStory && otherStories.length === 0) {
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
    <>
      {featuredStory && (
        <section className="mb-12 md:mb-16 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center mb-6 md:mb-8">
            <Zap className="h-7 w-7 md:h-8 md:w-8 text-primary mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Öne Çıkan Masal
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
             {/* Use large prop for the featured story card spanning 2 cols */}
            <StoryCard story={featuredStory} priorityImage large />
            <div className="md:col-span-1 bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-primary/10 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-primary mb-3">Düşler Diyarına Yolculuk</h3>
                <p className="text-muted-foreground text-sm mb-4">
                    En yeni ve en heyecan verici masalımızla tanışın! {APP_NAME}, sizi hayal gücünün sınırlarını zorlayan, yapay zeka tarafından özenle dokunmuş hikayelerle dolu bir evrene davet ediyor.
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                    Her bir hikaye, sizi farklı dünyalara götürecek, yeni karakterlerle tanıştıracak ve unutulmaz maceralar yaşatacak.
                </p>
                <Button asChild variant="default" size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-shadow">
                   <Link href={`/story/${featuredStory.id}`}>Maceraya Katıl!</Link>
                </Button>
            </div>
          </div>
        </section>
      )}

      {otherStories.length > 0 && (
        <section className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
           <div className="flex items-center mb-6 md:mb-8">
            <BookOpen className="h-7 w-7 md:h-8 md:w-8 text-primary mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Diğer Masallar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {otherStories.map((story, index) => (
              <StoryCard key={story.id} story={story} priorityImage={index < 3 && !featuredStory} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function HomePage() { 
  const searchParams = useNextSearchParams(); 
  const currentGenre = searchParams.get('genre') as StoryGenre | undefined || undefined; 
  const searchQuery = searchParams.get('q') || undefined; 

  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [currentGenre, searchQuery]);


  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-10 md:py-12 space-y-12 md:space-y-16">
        <section 
          className="text-center py-10 md:py-12 animate-fadeIn bg-card/50 backdrop-blur-sm rounded-xl shadow-xl border border-primary/10"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradientAnimation 15s ease infinite',
          }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-purple-500">
              {APP_NAME}'na Hoş Geldiniz
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Yapay zeka tarafından üretilmiş merak, gerilim ve romantizm dolu diyarlarda eşsiz yolculuklara çıkın. Her gün yeni masallar keşfinizi bekliyor, hayal gücünüzün kapılarını aralayın!
          </p>
        </section>

        <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-xl border border-primary/10">
            <form className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-2xl mx-auto mb-8">
              <Input
                type="search"
                name="q"
                placeholder="Masalları anahtar kelime ile arayın..."
                className="flex-grow text-base h-12 shadow-inner focus:shadow-outline-primary"
                defaultValue={searchQuery}
                aria-label="Hikaye ara"
              />
              {currentGenre && <input type="hidden" name="genre" value={currentGenre} />}
              <Button type="submit" variant="default" size="lg" className="h-12 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-primary to-accent">
                <Search className="h-5 w-5 mr-2" />
                <span>Ara</span>
              </Button>
            </form>
            <CategoryTabs currentGenre={currentGenre || 'Tümü'} basePath="/" />
          </div>
        </section>
        
        <Separator className="my-8 md:my-12 bg-border/50" />

        <StoriesDisplay key={key} genre={currentGenre} query={searchQuery} />
      </main>
      <Footer />
    </>
  );
}

function LoadingStories() {
  return (
    <>
      <section className="mb-12 md:mb-16">
        <div className="h-8 w-48 bg-muted rounded-md mb-6 md:mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            <div className="bg-card/70 p-4 rounded-xl shadow-lg animate-pulse md:col-span-2">
                <div className="w-full h-64 md:h-80 bg-muted rounded-md mb-4"></div>
                <div className="w-3/4 h-7 bg-muted rounded-md mb-3"></div>
                <div className="w-full h-4 bg-muted rounded-md mb-2"></div>
                <div className="w-full h-4 bg-muted rounded-md mb-2"></div>
                <div className="w-1/2 h-4 bg-muted rounded-md mb-4"></div>
                <div className="w-1/3 h-10 bg-muted rounded-md"></div>
            </div>
            <div className="bg-card/50 p-6 rounded-xl shadow-lg animate-pulse flex flex-col justify-center">
                <div className="w-3/5 h-6 bg-muted rounded-md mb-4"></div>
                <div className="w-full h-4 bg-muted rounded-md mb-2"></div>
                <div className="w-full h-4 bg-muted rounded-md mb-2"></div>
                <div className="w-4/5 h-4 bg-muted rounded-md mb-6"></div>
                <div className="w-1/2 h-12 bg-muted rounded-md"></div>
            </div>
        </div>
      </section>
      <section>
        <div className="h-8 w-40 bg-muted rounded-md mb-6 md:mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card/70 p-4 rounded-xl shadow-lg animate-pulse">
              <div className="w-full h-56 bg-muted rounded-md mb-4"></div>
              <div className="w-3/4 h-6 bg-muted rounded-md mb-2"></div>
              <div className="w-full h-4 bg-muted rounded-md mb-1"></div>
              <div className="w-full h-4 bg-muted rounded-md mb-1"></div>
              <div className="w-1/2 h-4 bg-muted rounded-md"></div>
              <div className="w-1/3 h-9 bg-muted rounded-md mt-4"></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

    