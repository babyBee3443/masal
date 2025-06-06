
'use client';

import { useState, useTransition, useEffect } from 'react';
import type { StoryGenre, StorySubGenre } from '@/lib/types';
import { 
  GENRES, 
  STORY_LENGTHS, 
  STORY_COMPLEXITIES, 
  SUBGENRES_MAP,
  TARGET_AUDIENCES,
  type StoryLength, 
  type StoryComplexity,
  type TargetAudience
} from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateNewStoryAction } from '@/lib/actions';
import { getAdminRecipientEmail } from '@/lib/mock-db';
import { Sparkles, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface GenerateStorySectionProps {
  onStoryGenerated: () => void; 
}

export function GenerateStorySection({ onStoryGenerated }: GenerateStorySectionProps) {
  const [selectedGenre, setSelectedGenre] = useState<StoryGenre | undefined>(undefined);
  const [selectedSubGenre, setSelectedSubGenre] = useState<StorySubGenre | undefined>(undefined);
  const [availableSubGenres, setAvailableSubGenres] = useState<{ value: StorySubGenre; label: string }[]>([]);
  
  const [selectedLength, setSelectedLength] = useState<StoryLength | undefined>(STORY_LENGTHS[1].value);
  const [selectedComplexity, setSelectedComplexity] = useState<StoryComplexity | undefined>(STORY_COMPLEXITIES[1].value);
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<TargetAudience | undefined>(undefined);
  
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedGenre) {
      setAvailableSubGenres(SUBGENRES_MAP[selectedGenre] || []);
      setSelectedSubGenre(undefined); 
    } else {
      setAvailableSubGenres([]);
      setSelectedSubGenre(undefined);
    }
  }, [selectedGenre]);

  const handleGenerateStory = async () => {
    if (!selectedGenre) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen bir ana tür seçin.' });
      return;
    }

    startTransition(async () => {
      toast({ title: "Hikaye Oluşturuluyor...", description: "Yapay zeka yeni bir masal hazırlıyor, lütfen bekleyin."});
      
      const adminEmail = await getAdminRecipientEmail();
      
      const result = await generateNewStoryAction(
        selectedGenre, 
        selectedLength, 
        selectedComplexity, 
        selectedSubGenre,
        selectedTargetAudience,
        adminEmail || undefined
      );
      if (result.success && result.storyData) {
        toast({ title: 'Hikaye Oluşturuldu!', description: `"${result.storyData.title}" oluşturuldu ve incelenmeyi bekliyor.` });
        onStoryGenerated();
        setSelectedGenre(undefined);
        setSelectedSubGenre(undefined);
        setSelectedLength(STORY_LENGTHS[1].value);
        setSelectedComplexity(STORY_COMPLEXITIES[1].value);
        setSelectedTargetAudience(undefined);
      } else {
        toast({ variant: 'destructive', title: 'Oluşturma Başarısız', description: result.error || 'Hikaye oluşturulamadı.' });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Yeni Hikaye Oluştur</CardTitle>
        <CardDescription>Bir tür, alt tür, uzunluk, detay ve hedef kitle seçin ve yapay zekanın yeni bir masal örmesine izin verin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="genre-select" className="text-sm font-medium text-muted-foreground block mb-1">Ana Tür</Label>
            <Select value={selectedGenre} onValueChange={(value) => setSelectedGenre(value as StoryGenre)} disabled={isPending}>
              <SelectTrigger id="genre-select">
                <SelectValue placeholder="Ana tür seçin..." />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subgenre-select" className="text-sm font-medium text-muted-foreground block mb-1">Alt Tür</Label>
            <Select 
              value={selectedSubGenre} 
              onValueChange={(value) => setSelectedSubGenre(value as StorySubGenre)} 
              disabled={isPending || !selectedGenre || availableSubGenres.length === 0}
            >
              <SelectTrigger id="subgenre-select">
                <SelectValue placeholder={selectedGenre ? "Alt tür seçin (isteğe bağlı)..." : "Önce ana tür seçin..."} />
              </SelectTrigger>
              <SelectContent>
                {availableSubGenres.length > 0 ? (
                  availableSubGenres.map(sg => <SelectItem key={sg.value} value={sg.value}>{sg.label}</SelectItem>)
                ) : (
                  <SelectItem value="no-subgenre" disabled>Bu tür için alt tür yok</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="length-select" className="text-sm font-medium text-muted-foreground block mb-1">Uzunluk</Label>
            <Select value={selectedLength} onValueChange={(value) => setSelectedLength(value as StoryLength)} disabled={isPending}>
              <SelectTrigger id="length-select">
                <SelectValue placeholder="Uzunluk seçin..." />
              </SelectTrigger>
              <SelectContent>
                {STORY_LENGTHS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="complexity-select" className="text-sm font-medium text-muted-foreground block mb-1">Detay Seviyesi</Label>
            <Select value={selectedComplexity} onValueChange={(value) => setSelectedComplexity(value as StoryComplexity)} disabled={isPending}>
              <SelectTrigger id="complexity-select">
                <SelectValue placeholder="Detay seviyesi seçin..." />
              </SelectTrigger>
              <SelectContent>
                {STORY_COMPLEXITIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="target-audience-select" className="text-sm font-medium text-muted-foreground block mb-1">Hedef Kitle</Label>
            <Select 
              value={selectedTargetAudience || ""} 
              onValueChange={(value) => setSelectedTargetAudience(value === "" ? undefined : value as TargetAudience)} 
              disabled={isPending}
            >
              <SelectTrigger id="target-audience-select">
                <SelectValue placeholder="Hedef kitle seçin (isteğe bağlı)..." />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">Hedef kitle belirtme</SelectItem>  // THIS LINE IS REMOVED */}
                {TARGET_AUDIENCES.map(ta => <SelectItem key={ta.value} value={ta.value}>{ta.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          onClick={handleGenerateStory} 
          disabled={isPending || !selectedGenre} 
          className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Hikaye Oluştur
        </Button>
      </CardContent>
    </Card>
  );
}
