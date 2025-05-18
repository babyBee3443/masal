
'use client'; // Add 'use client' for localStorage access in getStories
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams, useSearchParams as useNextSearchParams } from 'next/navigation'; // Import Next.js hooks directly
import { getStories } from '@/lib/mock-db';
import type { Story, StoryGenre } from '@/lib/types';
import { GENRES, APP_NAME } from '@/lib/constants';
import { StoryCard } from '@/components/site/StoryCard';
import { CategoryTabs } from '@/components/site/CategoryTabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Loader2 } from 'lucide-react'; // Added Loader2
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';


// generateStaticParams might not work as expected with localStorage data source
// For a localStorage-based prototype, we can make these pages fully dynamic.
// export async function generateStaticParams() {
//   return GENRES.map(genre => ({
//     genre: genre,
//   }));
// }

// Metadata generation also relies on server-side data.
// For localStorage, title can be set client-side or be more generic.
// export async function generateMetadata({ params }: CategoryPageProps) {
//   const genre = params.genre;
//   if (!GENRES.includes(genre)) {
//     return { title: 'Kategori Bulunamadı' };
//   }
//   const capitalizedGenre = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
//   return {
//     title: `${capitalizedGenre} Hikayeleri`,
//     description: `${APP_NAME} üzerinde büyüleyici ${genre.toLowerCase()} hikayelerini keşfedin.`,
//   };
// }

function StoriesForCategory({ genre, query }: { genre: StoryGenre; query?: string }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetStories = async () => {
      setIsLoading(true);
      let allStories = await getStories();
      
      allStories = allStories.filter(story => story.status === 'published' && story.genre === genre);

      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        allStories = allStories.filter(story => 
          story.title.toLowerCase().includes(lowerCaseQuery) ||
          (story.summary && story.summary.toLowerCase().includes(lowerCaseQuery)) ||
          story.content.toLowerCase().includes(lowerCaseQuery)
        );
      }
      setStories(allStories);
      setIsLoading(false);
    };

    if (genre) { // Only fetch if genre is valid
        fetchAndSetStories();
    } else {
        setIsLoading(false); // No genre, no stories to load for this component
        setStories([]);
    }
  }, [genre, query]);


  if (isLoading) {
    return <LoadingStoriesPlaceholder />;
  }
  
  const capitalizedGenreDisplay = genre ? genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase() : "Bilinmeyen Kategori";


  if (stories.length === 0) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <Sparkles className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Hiç {capitalizedGenreDisplay} Hikayesi Bulunamadı</h2>
        <p className="text-muted-foreground mb-6">
          Görünüşe göre bu kategoride şu anda kriterlerinize uyan hiçbir hikaye yok.
          {query && " Farklı bir arama terimi deneyin, veya "}
          <Link href={`/categories/${genre}`} className="text-primary hover:underline">aramayı temizle</Link>.
        </p>
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


export default function CategoryPage() {
  const params = useParams();
  const searchParams = useNextSearchParams(); // Use the Next.js hook

  const genre = params.genre as StoryGenre; // Assuming genre is always string from params
  const searchQuery = searchParams.get('q') || undefined; // Get 'q' from searchParams

  useEffect(() => {
    if (genre) {
        const capitalizedGenre = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
        document.title = `${capitalizedGenre} Hikayeleri | ${APP_NAME}`;
    } else {
        document.title = `Kategoriler | ${APP_NAME}`;
    }
  }, [genre]);


  if (!genre || !GENRES.includes(genre)) {
    // Instead of notFound(), which is server-side, handle client-side
    // You could redirect or show a "category not found" message here.
    // For simplicity, we'll just show a message if genre is invalid.
    // A robust solution would involve checking GENRES before rendering.
     useEffect(() => {
        if (!GENRES.includes(genre)) {
            // router.push('/404') or show a specific component
            console.warn("Geçersiz kategori:", genre);
        }
    }, [genre]);

    if (!GENRES.includes(genre)) {
        return (
             <>
                <Header />
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 text-center">
                    <h1 className="text-3xl font-bold">Kategori Bulunamadı</h1>
                    <p className="text-muted-foreground mt-4">Aradığınız kategori mevcut değil.</p>
                    <Button asChild className="mt-6"><Link href="/">Ana Sayfaya Dön</Link></Button>
                </main>
                <Footer />
            </>
        )
    }
  }
  
  const capitalizedGenreDisplay = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <section className="text-center py-12 md:py-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              {capitalizedGenreDisplay}
            </span> Hikayeleri
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {genre.toLowerCase()} masallarının dünyasına dalın. Hayal gücünüzü uçurun.
          </p>
        </section>

        <section className="mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
           <form className="flex gap-2 max-w-xl mx-auto mb-8">
            <Input
              type="search"
              name="q"
              placeholder={`${capitalizedGenreDisplay} hikayelerinde ara...`}
              className="flex-grow text-base"
              defaultValue={searchQuery}
              aria-label={`${capitalizedGenreDisplay} hikayelerinde ara`}
            />
            <Button type="submit" variant="default" size="lg">
              <Search className="h-5 w-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">Ara</span>
            </Button>
          </form>
          <CategoryTabs currentGenre={genre} basePath="/categories" />
        </section>

        <StoriesForCategory genre={genre} query={searchQuery} />
      </main>
      <Footer />
    </>
  );
}

function LoadingStoriesPlaceholder() { // Renamed from LoadingStories to avoid conflict if used elsewhere
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {[...Array(4)].map((_, i) => (
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

    