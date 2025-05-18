import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStories } from '@/lib/mock-db';
import type { Story, StoryGenre } from '@/lib/types';
import { GENRES } from '@/lib/constants';
import { StoryCard } from '@/components/site/StoryCard';
import { CategoryTabs } from '@/components/site/CategoryTabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

interface CategoryPageProps {
  params: { genre: StoryGenre };
  searchParams: { q?: string };
}

export async function generateStaticParams() {
  return GENRES.map(genre => ({
    genre: genre,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const genre = params.genre;
  if (!GENRES.includes(genre)) {
    return { title: 'Category Not Found' };
  }
  return {
    title: `${genre} Stories`,
    description: `Discover captivating ${genre.toLowerCase()} stories on ChronoTales.`,
  };
}

async function StoriesForCategory({ genre, query }: { genre: StoryGenre; query?: string }) {
  let stories = await getStories();
  
  stories = stories.filter(story => story.status === 'published' && story.genre === genre);

  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    stories = stories.filter(story => 
      story.title.toLowerCase().includes(lowerCaseQuery) ||
      story.summary.toLowerCase().includes(lowerCaseQuery) ||
      story.content.toLowerCase().includes(lowerCaseQuery)
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <Sparkles className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">No {genre} Stories Found</h2>
        <p className="text-muted-foreground mb-6">
          It seems there are no stories in this category matching your criteria right now.
          {query && " Try a different search term, or "}
          <Link href={`/categories/${genre}`} className="text-primary hover:underline">clear search</Link>.
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


export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { genre } = params;
  const searchQuery = searchParams.q;

  if (!GENRES.includes(genre)) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <section className="text-center py-12 md:py-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              {genre}
            </span> Stories
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive into the world of {genre.toLowerCase()} tales. Let your imagination soar.
          </p>
        </section>

        <section className="mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
           <form className="flex gap-2 max-w-xl mx-auto mb-8">
            <Input
              type="search"
              name="q"
              placeholder={`Search in ${genre} stories...`}
              className="flex-grow text-base"
              defaultValue={searchQuery}
              aria-label={`Search in ${genre} stories`}
            />
            <Button type="submit" variant="default" size="lg">
              <Search className="h-5 w-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </form>
          <CategoryTabs currentGenre={genre} basePath="/categories" />
        </section>

        <Suspense fallback={<LoadingStories />}>
          <StoriesForCategory genre={genre} query={searchQuery} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function LoadingStories() {
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
