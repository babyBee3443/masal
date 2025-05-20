import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  priorityImage?: boolean;
  large?: boolean; // Added for featured story styling
}

export function StoryCard({ story, priorityImage = false, large = false }: StoryCardProps) {
  const capitalizedGenre = story.genre.charAt(0).toUpperCase() + story.genre.slice(1).toLowerCase();
  return (
    <Card 
      className={`
        flex flex-col h-full overflow-hidden 
        bg-card/70 backdrop-blur-md 
        border border-primary/20 
        shadow-lg hover:shadow-2xl 
        transition-all duration-300 ease-out 
        group rounded-xl
        ${large ? 'col-span-1 md:col-span-2' : ''}
      `}
    >
      <CardHeader className="p-0 relative overflow-hidden">
        <Link href={`/story/${story.id}`} className="block">
          <Image
            src={story.imageUrl || \`https://placehold.co/\${large ? '800x500' : '600x400'}.png\`}
            alt={`${story.title} için görsel`}
            width={large ? 800 : 600}
            height={large ? 500 : 400}
            className={`
              w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110
              ${large ? 'h-64 md:h-80' : 'h-56'}
            `}
            priority={priorityImage}
            data-ai-hint="story illustration"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-5 md:p-6 flex-grow">
        <Badge 
          variant="secondary" 
          className="mb-3 bg-accent/80 text-accent-foreground font-semibold px-3 py-1"
        >
          {capitalizedGenre}
        </Badge>
        <CardTitle className={`font-bold mb-2 leading-tight ${large ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          <Link href={`/story/${story.id}`} className="hover:text-primary transition-colors duration-200">
            {story.title}
          </Link>
        </CardTitle>
        <p className={`text-muted-foreground text-sm ${large ? 'line-clamp-4 md:line-clamp-3' : 'line-clamp-3'}`}>
          {story.summary}
        </p>
      </CardContent>
      <CardFooter className="p-5 md:p-6 pt-0">
        <Button 
          asChild 
          variant="outline" 
          className="
            text-primary border-primary/40 hover:bg-primary/10 hover:text-accent hover:border-accent 
            transition-all duration-200 group-hover:bg-primary/5
          "
        >
          <Link href={`/story/${story.id}`}>
            Hikayeyi Oku <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
