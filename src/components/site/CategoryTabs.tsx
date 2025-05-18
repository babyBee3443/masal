'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { GENRES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StoryGenre } from '@/lib/types';

interface CategoryTabsProps {
  currentGenre?: StoryGenre | 'All';
  basePath?: string; // e.g. "/" for homepage, "/categories" for categories page
}

export function CategoryTabs({ currentGenre = 'All', basePath = "/" }: CategoryTabsProps) {
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
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
  }

  const genresToShow: (StoryGenre | 'All')[] = ['All', ...GENRES];

  return (
    <div className="mb-8 flex flex-wrap gap-2 items-center justify-center">
      {genresToShow.map((genre) => {
        const isActive = (currentGenre === genre) || (genre === 'All' && !currentGenre);
        const href = basePath === "/categories" ? (genre === 'All' ? '/categories/Adventure' : `/categories/${genre}`) : createHref(genre === 'All' ? undefined : genre) ;
        
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
