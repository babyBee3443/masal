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
}

export function StoryCard({ story, priorityImage = false }: StoryCardProps) {
  const capitalizedGenre = story.genre.charAt(0).toUpperCase() + story.genre.slice(1).toLowerCase();
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-out transform hover-scale">
      <CardHeader className="p-0 relative">
        <Link href={`/story/${story.id}`} className="block">
          <Image
            src={story.imageUrl || `https://placehold.co/600x400.png`}
            alt={`${story.title} için görsel`}
            width={600}
            height={400}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priorityImage}
            data-ai-hint="story illustration"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent-foreground">{capitalizedGenre}</Badge>
        <CardTitle className="text-xl font-semibold mb-2 leading-tight">
          <Link href={`/story/${story.id}`} className="hover:text-primary transition-colors">
            {story.title}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {story.summary}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="p-0 text-primary hover:text-accent transition-colors">
          <Link href={`/story/${story.id}`}>
            Hikayeyi Oku <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
