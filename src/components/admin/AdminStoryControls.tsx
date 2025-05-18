'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import type { Story, StoryGenre } from '@/lib/types';
import { GENRES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { publishStoryAction, deleteStoryAction, updateStoryCategoryAction, regenerateStoryImageAction } from '@/lib/actions';
import { CheckCircle, Trash2, Edit3, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface AdminStoryControlsProps {
  story: Story;
}

export function AdminStoryControls({ story: initialStory }: AdminStoryControlsProps) {
  const [story, setStory] = useState(initialStory);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publishStoryAction(story.id);
      if (result.success && result.story) {
        setStory(result.story);
        toast({ title: 'Hikaye Yayınlandı', description: `"${result.story.title}" artık yayında.` });
      } else {
        toast({ variant: 'destructive', title: 'Yayınlama Hatası', description: result.error });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteStoryAction(story.id);
      if (result.success) {
        toast({ title: 'Hikaye Silindi', description: `"${story.title}" silindi.` });
        // Here, the parent component should handle removing this card from the list
        // For now, we can disable buttons or show a deleted state.
        // This component instance will likely be unmounted by parent.
      } else {
        toast({ variant: 'destructive', title: 'Silme Hatası', description: result.error });
      }
    });
  };

  const handleCategoryChange = (newGenre: StoryGenre) => {
    startTransition(async () => {
      const result = await updateStoryCategoryAction(story.id, newGenre);
      if (result.success && result.story) {
        setStory(result.story);
        toast({ title: 'Kategori Güncellendi', description: `"${result.story.title}" hikayesinin kategorisi ${newGenre} olarak değiştirildi.` });
      } else {
        toast({ variant: 'destructive', title: 'Kategori Güncelleme Hatası', description: result.error });
      }
    });
  };

  const handleRegenerateImage = () => {
    startTransition(async () => {
      const result = await regenerateStoryImageAction(story.id, story.content);
      if (result.success && result.imageUrl) {
        setStory(prev => ({ ...prev, imageUrl: result.imageUrl! }));
        toast({ title: 'Görsel Yeniden Oluşturuldu', description: `"${story.title}" için yeni görsel oluşturuldu.` });
      } else {
        toast({ variant: 'destructive', title: 'Görsel Yeniden Oluşturma Hatası', description: result.error });
      }
    });
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }


  return (
    <Card className="w-full shadow-lg animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-2xl">{story.title}</CardTitle>
        <CardDescription>
          Durum: <span className={`font-semibold ${story.status === 'published' ? 'text-green-600' : 'text-orange-500'}`}>{story.status === 'published' ? 'Yayınlandı' : 'Beklemede'}</span>
          <span className="mx-2">|</span>
          Tür: {story.genre}
          <br />
          Oluşturulma: {formatDate(story.createdAt)}
          {story.status === 'published' && story.publishedAt && (
            <> | Yayınlanma: {formatDate(story.publishedAt)}</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Image
            src={story.imageUrl || `https://placehold.co/600x480.png`}
            alt={`${story.title} için görsel`}
            width={600}
            height={480}
            className="rounded-lg object-cover w-full aspect-[4/3] shadow-md"
            data-ai-hint="story illustration fantasy"
          />
          <Button onClick={handleRegenerateImage} disabled={isPending} className="w-full mt-4" variant="outline">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Görseli Yeniden Oluştur
          </Button>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <label htmlFor={`summary-${story.id}`} className="text-sm font-medium text-muted-foreground block mb-1">İçerik Önizleme (Özet)</label>
             <Textarea
                id={`summary-${story.id}`}
                value={story.summary}
                readOnly
                className="h-24 bg-muted/50"
              />
          </div>
           <div>
            <label htmlFor={`content-${story.id}`} className="text-sm font-medium text-muted-foreground block mb-1">Tam İçerik</label>
             <Textarea
                id={`content-${story.id}`}
                value={story.content}
                readOnly
                className="h-40 bg-muted/50"
              />
          </div>
          <div>
            <label htmlFor={`category-${story.id}`} className="text-sm font-medium text-muted-foreground block mb-1">Kategoriyi Değiştir</label>
            <Select value={story.genre} onValueChange={(value) => handleCategoryChange(value as StoryGenre)} disabled={isPending}>
              <SelectTrigger id={`category-${story.id}`} className="w-full">
                <SelectValue placeholder="Tür seçin" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-3">
        {story.status === 'pending' && (
          <Button onClick={handlePublish} disabled={isPending} className="bg-green-600 hover:bg-green-700 text-white">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Yayınla
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Sil
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bu hikayeyi silmek istediğinize emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Bu, "{story.title}" başlıklı hikayeyi kalıcı olarak silecek.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Evet, hikayeyi sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
