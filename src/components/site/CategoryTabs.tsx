'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { GENRES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StoryGenre } from '@/lib/types';

interface CategoryTabsProps {
  currentGenre?: StoryGenre | 'Tümü'; // Changed 'All' to 'Tümü'
  basePath?: string; // e.g. "/" for homepage, "/categories" for categories page
}

export function CategoryTabs({ currentGenre = 'Tümü', basePath = "/" }: CategoryTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createHref = (genre?: StoryGenre) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genre) {
      params.set('genre', genre);
    } else {
      params.delete('genre');
    }
    const queryString = params.toString();
    
    // For basePath="/categories", if genre is undefined (meaning 'All'), link to a default category or main categories page.
    // Assuming default category is the first in GENRES.
    if (basePath === "/categories" && !genre) {
        return `/categories/${GENRES[0]}${queryString ? `?${queryString}` : ''}`;
    }
    if (basePath === "/categories" && genre) {
        return `${basePath}/${genre}${queryString ? `?${queryString}` : ''}`;
    }
    
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
  }

  const genresToShow: (StoryGenre | 'Tümü')[] = ['Tümü', ...GENRES];

  return (
    <div className="mb-8 flex flex-wrap gap-2 items-center justify-center">
      {genresToShow.map((genre) => {
        const isActive = (currentGenre === genre) || (genre === 'Tümü' && !currentGenre);
        
        let href = '';
        if (basePath === "/categories") {
          href = genre === 'Tümü' ? `/categories/${GENRES[0]}` : `/categories/${genre}`;
          const params = new URLSearchParams(searchParams.toString());
          params.delete('genre'); // Remove genre from query for category base path
          const queryString = params.toString();
          if (queryString) {
            href += `?${queryString}`;
          }
        } else {
          href = createHref(genre === 'Tümü' ? undefined : genre);
        }
        
        return (
          <Button
            key={genre}
            variant={isActive ? 'default' : 'outline'}
            asChild
            className={cn(
              "transition-all duration-200 ease-out shadow-sm hover:shadow-md",
              isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-card hover:bg-secondary"
            )}
          >
            <Link href={href}>
              {genre}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
