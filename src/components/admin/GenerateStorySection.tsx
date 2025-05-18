'use client';

import { useState, useTransition } from 'react';
import type { StoryGenre } from '@/lib/types';
import { GENRES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateNewStoryAction } from '@/lib/actions';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateStorySectionProps {
  onStoryGenerated: () => void; // Callback to inform parent to refresh list
}

export function GenerateStorySection({ onStoryGenerated }: GenerateStorySectionProps) {
  const [selectedGenre, setSelectedGenre] = useState<StoryGenre | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateStory = () => {
    if (!selectedGenre) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a genre.' });
      return;
    }
    startTransition(async () => {
      const result = await generateNewStoryAction(selectedGenre);
      if (result.success && result.story) {
        toast({ title: 'Story Generated!', description: `"${result.story.title}" has been created and is pending review.` });
        onStoryGenerated(); // Notify parent to refresh
        setSelectedGenre(undefined); // Reset genre selection
      } else {
        toast({ variant: 'destructive', title: 'Generation Failed', description: result.error || 'Could not generate story.' });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Story</CardTitle>
        <CardDescription>Select a genre and let the AI weave a new tale.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="genre-select" className="text-sm font-medium text-muted-foreground block mb-1">Genre</label>
          <Select value={selectedGenre} onValueChange={(value) => setSelectedGenre(value as StoryGenre)} disabled={isPending}>
            <SelectTrigger id="genre-select" className="w-full md:w-1/2">
              <SelectValue placeholder="Select a genre..." />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleGenerateStory} disabled={isPending || !selectedGenre} className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate Story
        </Button>
      </CardContent>
    </Card>
  );
}
