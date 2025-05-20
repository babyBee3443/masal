
import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  priorityImage?: boolean;
  large?: boolean; 
}

export function StoryCard({ story, priorityImage = false, large = false }: StoryCardProps) {
  const capitalizedGenre = story.genre.charAt(0).toUpperCase() + story.genre.slice(1).toLowerCase();
  return (
    <Card
      className={`
        flex flex-col h-full overflow-hidden
        bg-card/80 backdrop-blur-sm 
        border border-border/50 
        shadow-lg hover:shadow-primary/20 hover:border-primary/40
        transition-all duration-300 ease-out
        group rounded-xl
        transform hover:-translate-y-1
        ${large ? 'md:col-span-2' : ''}
      `}
    >
      <CardHeader className="p-0 relative overflow-hidden">
        <Link href={`/story/${story.id}`} className="block rounded-t-xl overflow-hidden">
          <Image
            src={story.imageUrl || `https://placehold.co/${large ? '800x500' : '600x400'}.png`}
            alt={`${story.title} için görsel`}
            width={large ? 800 : 600}
            height={large ? 500 : 400}
            className={`
              w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105
              ${large ? 'h-64 md:h-80' : 'h-56'}
            `}
            priority={priorityImage}
            data-ai-hint="story illustration fantasy"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-5 md:p-6 flex-grow flex flex-col">
        <Badge
          variant="secondary"
          className="mb-3 bg-accent text-accent-foreground font-semibold px-3 py-1 self-start shadow-sm"
        >
          <Sparkles className="w-3 h-3 mr-1.5 fill-accent-foreground" />
          {capitalizedGenre}
        </Badge>
        <CardTitle className={`font-bold mb-3 leading-tight ${large ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
          <Link href={`/story/${story.id}`} className="hover:text-primary transition-colors duration-200 group-hover:text-primary">
            {story.title}
          </Link>
        </CardTitle>
        <p className={`text-muted-foreground text-sm flex-grow ${large ? 'line-clamp-4 md:line-clamp-3' : 'line-clamp-3'}`}>
          {story.summary}
        </p>
      </CardContent>
      <CardFooter className="p-5 md:p-6 pt-2">
        <Button
          asChild
          variant="default"
          className="
            bg-primary/90 hover:bg-primary text-primary-foreground
            shadow-md hover:shadow-lg 
            transition-all duration-200 group-hover:bg-primary w-full
          "
        >
          <Link href={`/story/${story.id}`}>
            Maceraya Katıl <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
