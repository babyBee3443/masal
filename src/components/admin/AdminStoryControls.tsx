
'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import type { Story, StoryGenre, StorySubGenre } from '@/lib/types';
import { GENRES, SUBGENRES_MAP, STORY_LENGTHS, STORY_COMPLEXITIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { 
    publishStoryAction, 
    deleteStoryAction, 
    updateStoryCategoryAction, 
    regenerateStoryImageAction, 
    scheduleStoryPublicationAction,
    approveStoryAction 
} from '@/lib/actions';
import { updateStory as dbUpdateStory, deleteStoryById as dbDeleteStoryById } from '@/lib/mock-db';
import { CheckCircle, Trash2, RefreshCw, Loader2, CalendarClock, Edit3, ShieldCheck, BookText } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { tr } from 'date-fns/locale';
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';


interface AdminStoryControlsProps {
  story: Story;
  onStoryUpdate: () => void; 
}

export function AdminStoryControls({ story: initialStory, onStoryUpdate }: AdminStoryControlsProps) {
  const [story, setStory] = useState(initialStory);
  const [isProcessing, startTransition] = useTransition();
  const { toast } = useToast();

  const [isSchedulingDialogOpen, setIsSchedulingDialogOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    initialStory.scheduledAtDate && isValid(parseISO(initialStory.scheduledAtDate)) ? parseISO(initialStory.scheduledAtDate) : undefined
  );
  const [scheduledTime, setScheduledTime] = useState<string>(initialStory.scheduledAtTime || "10:00");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(initialStory.title);
  const [editableContent, setEditableContent] = useState(initialStory.content);

  const [selectedMainGenre, setSelectedMainGenre] = useState<StoryGenre>(initialStory.genre);
  const [selectedSubGenre, setSelectedSubGenre] = useState<StorySubGenre | undefined>(initialStory.subGenre);
  const [availableSubGenres, setAvailableSubGenres] = useState<{ value: StorySubGenre; label: string }[]>([]);

  useEffect(() => {
    setStory(initialStory);
    setScheduledDate(initialStory.scheduledAtDate && isValid(parseISO(initialStory.scheduledAtDate)) ? parseISO(initialStory.scheduledAtDate) : undefined);
    setScheduledTime(initialStory.scheduledAtTime || "10:00");
    setEditableTitle(initialStory.title);
    setEditableContent(initialStory.content);
    setSelectedMainGenre(initialStory.genre);
    setSelectedSubGenre(initialStory.subGenre);
    // Initial load of subgenres
    if (initialStory.genre && SUBGENRES_MAP[initialStory.genre]) {
      setAvailableSubGenres(SUBGENRES_MAP[initialStory.genre]);
    } else {
      setAvailableSubGenres([]);
    }
    setIsEditing(false); 
  }, [initialStory]);

  // Update available subgenres when the main genre (selectedMainGenre) changes
  useEffect(() => {
    if (selectedMainGenre && SUBGENRES_MAP[selectedMainGenre]) {
      setAvailableSubGenres(SUBGENRES_MAP[selectedMainGenre]);
      // If the current subgenre is not valid for the new main genre, reset it.
      if (selectedSubGenre && !SUBGENRES_MAP[selectedMainGenre].find(sg => sg.value === selectedSubGenre)) {
        setSelectedSubGenre(undefined); 
      }
    } else {
      setAvailableSubGenres([]);
      setSelectedSubGenre(undefined); 
    }
  }, [selectedMainGenre, selectedSubGenre]);


  const handleApprove = () => {
    startTransition(async () => {
        const actionResult = await approveStoryAction(story.id);
        if (actionResult.success && actionResult.storyDataToUpdate) {
            await dbUpdateStory(story.id, actionResult.storyDataToUpdate);
            toast({ title: 'Hikaye Onaylandı', description: `"${story.title}" onaylandı ve bekleyenler listesine taşındı.`});
            onStoryUpdate();
        } else {
            toast({ variant: 'destructive', title: 'Onaylama Hatası', description: actionResult.error });
        }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      const actionResult = await publishStoryAction(story.id);
      if (actionResult.success && actionResult.storyDataToUpdate) {
        await dbUpdateStory(story.id, actionResult.storyDataToUpdate);
        toast({ title: 'Hikaye Yayınlandı', description: `"${story.title}" artık yayında.` });
        onStoryUpdate(); 
      } else {
        toast({ variant: 'destructive', title: 'Yayınlama Hatası', description: actionResult.error });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const actionResult = await deleteStoryAction(story.id);
      if (actionResult.success && actionResult.storyIdToDelete) {
        await dbDeleteStoryById(actionResult.storyIdToDelete);
        toast({ title: 'Hikaye Silindi', description: `"${story.title}" silindi.` });
        onStoryUpdate(); 
      } else {
        toast({ variant: 'destructive', title: 'Silme Hatası', description: actionResult.error });
      }
    });
  };

  const handleMainGenreChange = (newMainGenreValue: StoryGenre) => {
    setSelectedMainGenre(newMainGenreValue);
    // When main genre changes, reset subGenre as its options will change.
    // The actual update to the story will happen when subGenre is selected or if it's left as "none".
    // We trigger an update with the new main genre and a cleared subgenre.
    // If the user then selects a subgenre, another update will occur.
    setSelectedSubGenre(undefined); 
    handleCategoryUpdate(newMainGenreValue, undefined);
  };

  const handleSubGenreChange = (newSubGenreValue: StorySubGenre | 'none') => {
    const finalSubGenre = newSubGenreValue === 'none' ? undefined : newSubGenreValue;
    setSelectedSubGenre(finalSubGenre);
    handleCategoryUpdate(selectedMainGenre, finalSubGenre);
  };
  
  const handleCategoryUpdate = (genreToUpdate: StoryGenre, subGenreToUpdate?: StorySubGenre) => {
    startTransition(async () => {
      const actionResult = await updateStoryCategoryAction(story.id, genreToUpdate, subGenreToUpdate);
      if (actionResult.success && actionResult.storyDataToUpdate) {
        await dbUpdateStory(story.id, actionResult.storyDataToUpdate); // This will update the local state via onStoryUpdate
        
        let toastMessage = `"${story.title}" hikayesinin ana türü ${genreToUpdate} olarak değiştirildi.`;
        const subGenreLabel = subGenreToUpdate && SUBGENRES_MAP[genreToUpdate]?.find(sg => sg.value === subGenreToUpdate)?.label;
        if (subGenreLabel) {
          toastMessage += ` Alt türü ${subGenreLabel} olarak ayarlandı.`;
        } else {
          toastMessage += ` Alt türü temizlendi.`;
        }
        toast({ title: 'Kategori Güncellendi', description: toastMessage });
        onStoryUpdate();
      } else {
        toast({ variant: 'destructive', title: 'Kategori Güncelleme Hatası', description: actionResult.error });
      }
    });
  };


  const handleRegenerateImage = () => {
    startTransition(async () => {
      toast({title: "Görsel Oluşturuluyor", description: "Yapay zeka yeni bir görsel hazırlıyor..."});
      const actionResult = await regenerateStoryImageAction(story.id, story.content);
      if (actionResult.success && actionResult.imageUrl && actionResult.storyIdToUpdate) {
        await dbUpdateStory(actionResult.storyIdToUpdate, { imageUrl: actionResult.imageUrl });
        toast({ title: 'Görsel Yeniden Oluşturuldu', description: `"${story.title}" için yeni görsel oluşturuldu.` });
        onStoryUpdate(); 
      } else {
        toast({ variant: 'destructive', title: 'Görsel Yeniden Oluşturma Hatası', description: actionResult.error });
      }
    });
  };

  const handleSchedulePublication = () => {
    if (!scheduledDate || !scheduledTime) {
      toast({ variant: 'destructive', title: 'Zamanlama Hatası', description: 'Lütfen geçerli bir tarih ve saat seçin.' });
      return;
    }
    const dateString = format(scheduledDate, 'yyyy-MM-dd');
    startTransition(async () => {
      const actionResult = await scheduleStoryPublicationAction(story.id, dateString, scheduledTime);
      if (actionResult.success && actionResult.storyDataToUpdate) {
        await dbUpdateStory(story.id, actionResult.storyDataToUpdate);
        toast({ title: 'Hikaye Zamanlandı', description: `"${story.title}" ${format(scheduledDate, 'dd MMMM yyyy', {locale: tr})} ${scheduledTime} için zamanlandı.`});
        setIsSchedulingDialogOpen(false);
        onStoryUpdate();
      } else {
        toast({ variant: 'destructive', title: 'Zamanlama Hatası', description: actionResult.error });
      }
    });
  };
  
  const handleSaveEdits = () => {
    startTransition(async () => {
        const updatedStory = await dbUpdateStory(story.id, { title: editableTitle, content: editableContent });
        if (updatedStory) {
            toast({ title: "Hikaye Güncellendi", description: `"${updatedStory.title}" başarıyla güncellendi.`});
            setIsEditing(false);
            onStoryUpdate(); 
        } else {
            toast({ variant: "destructive", title: "Güncelleme Başarısız", description: "Hikaye güncellenemedi."});
        }
    });
  };

  const getStatusTextAndColor = () => {
    switch(story.status) {
        case 'awaiting_approval': return { text: 'Onay Bekliyor', color: 'text-orange-500' };
        case 'pending': return { text: 'Beklemede', color: 'text-blue-500' };
        case 'published': return { text: 'Yayınlandı', color: 'text-green-600' };
        default: return { text: story.status, color: 'text-gray-500'};
    }
  };
  const statusInfo = getStatusTextAndColor();


  const formatDateDisplay = (dateString?: string, timeString?: string) => {
    if (!dateString) return 'Zamanlanmamış';
    try {
      if(!isValid(parseISO(dateString))) return 'Geçersiz Tarih Yapısı';
      const date = parseISO(dateString);
      let formatted = format(date, 'dd MMMM yyyy', { locale: tr });
      if (timeString) {
        const timeParts = timeString.split(':');
        if (timeParts.length === 2 && timeParts[0].length <= 2 && timeParts[1].length <= 2) {
            const hours = timeParts[0].padStart(2, '0');
            const minutes = timeParts[1].padStart(2, '0');
            formatted += ` ${hours}:${minutes}`;
        } else {
            formatted += ` ${timeString}`; 
        }
      }
      return formatted;
    } catch (e) {
      console.error("AdminStoryControls - Tarih formatlama hatası:", e, dateString, timeString);
      return 'Hatalı Tarih';
    }
  }
  
  const formatSimpleDate = (isoDateString?: string) => {
    if (!isoDateString) return 'N/A';
    try {
      const date = parseISO(isoDateString);
      if(!isValid(date)) return 'Geçersiz Oluşturulma Tarihi';
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: tr });
    } catch (e) {
       console.warn("AdminStoryControls - formatSimpleDate fallback parse for:", isoDateString, e);
       try {
           const parsedDate = new Date(isoDateString); 
           if(isValid(parsedDate)) {
            return format(parsedDate, 'dd MMMM yyyy, HH:mm', {locale: tr});
           }
           return 'Hatalı Oluşturulma Tarihi';
       } catch (finalError) {
            return 'Çok Hatalı Oluşturulma Tarihi';
       }
    }
  };

  const currentSubGenreLabel = story.genre && story.subGenre && SUBGENRES_MAP[story.genre]?.find(sg => sg.value === story.subGenre)?.label;


  return (
    <Card className="w-full shadow-lg animate-fadeIn">
      <CardHeader>
        {isEditing ? (
            <Input 
                value={editableTitle} 
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-2xl font-bold mb-2"
                disabled={isProcessing}
            />
        ) : (
            <CardTitle className="text-2xl">{story.title}</CardTitle>
        )}
        <CardDescription>
          Durum: <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
          <span className="mx-2">|</span>
          Ana Tür: {story.genre}
          {currentSubGenreLabel && (<><span className="mx-2">|</span> Alt Tür: <span className="font-medium text-foreground/80">{currentSubGenreLabel}</span></>)}
          <br />
          Oluşturulma: {formatSimpleDate(story.createdAt)}
          {story.status === 'published' && story.publishedAt && (
            <> | Yayınlanma: {formatSimpleDate(story.publishedAt)}</>
          )}
           {story.status === 'pending' && story.scheduledAtDate && (
            <> | Planlanan Yayın: <span className="font-semibold text-blue-600">{formatDateDisplay(story.scheduledAtDate, story.scheduledAtTime)}</span></>
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
            key={story.imageUrl} 
          />
          <Button onClick={handleRegenerateImage} disabled={isProcessing} className="w-full mt-4" variant="outline">
            {isProcessing && story.imageUrl !== initialStory.imageUrl ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Görseli Yeniden Oluştur
          </Button>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label htmlFor={`summary-${story.id}`} className="text-sm font-medium text-muted-foreground block mb-1">Özet (Otomatik)</Label>
             <Textarea
                id={`summary-${story.id}`}
                value={story.summary}
                readOnly
                className="h-24 bg-muted/50"
              />
          </div>
           <div>
            <Label htmlFor={`content-${story.id}`} className="text-sm font-medium text-muted-foreground block mb-1">Tam İçerik</Label>
             <Textarea
                id={`content-${story.id}`}
                value={isEditing ? editableContent : story.content}
                readOnly={!isEditing || isProcessing}
                onChange={isEditing ? (e) => setEditableContent(e.target.value) : undefined}
                className={`h-40 ${isEditing ? 'bg-background' : 'bg-muted/50'}`}
              />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor={`main-genre-${story.id}`} className="text-sm font-medium text-muted-foreground block mb-1">Ana Tür</Label>
                <Select 
                    value={selectedMainGenre} 
                    onValueChange={(value) => handleMainGenreChange(value as StoryGenre)} 
                    disabled={isProcessing || isEditing || story.status === 'published'}
                >
                <SelectTrigger id={`main-genre-${story.id}`} className="w-full">
                    <SelectValue placeholder="Ana tür seçin" />
                </SelectTrigger>
                <SelectContent>
                    {GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor={`sub-genre-${story.id}`} className="text-sm font-medium text-muted-foreground block mb-1">Alt Tür</Label>
                <Select
                    value={selectedSubGenre || "none"}
                    onValueChange={(value) => handleSubGenreChange(value as StorySubGenre | 'none')}
                    disabled={isProcessing || isEditing || story.status === 'published' || availableSubGenres.length === 0}
                >
                    <SelectTrigger id={`sub-genre-${story.id}`} className="w-full">
                        <SelectValue placeholder={availableSubGenres.length > 0 ? "Alt tür seçin..." : "Alt tür yok"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Alt tür yok / Temizle</SelectItem>
                        {availableSubGenres.map(sg => <SelectItem key={sg.value} value={sg.value}>{sg.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between items-center gap-2">
        <div>
        {isEditing ? (
            <div className="flex gap-2">
                <Button onClick={handleSaveEdits} disabled={isProcessing} variant="default">
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4"/>} Kaydet
                </Button>
                <Button onClick={() => { setIsEditing(false); setEditableTitle(story.title); setEditableContent(story.content);}} variant="outline" disabled={isProcessing}>
                    İptal
                </Button>
            </div>
        ) : (
             <Button onClick={() => setIsEditing(true)} variant="outline" disabled={isProcessing || story.status === 'published' || story.status === 'awaiting_approval'}>
                <Edit3 className="mr-2 h-4 w-4" /> Düzenle
            </Button>
        )}
        </div>

        <div className="flex flex-wrap justify-end space-x-3 gap-y-2">
            {story.status === 'awaiting_approval' && !isEditing && (
                <Button onClick={handleApprove} disabled={isProcessing} className="bg-green-500 hover:bg-green-600 text-white">
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                    Onayla
                </Button>
            )}
            {story.status === 'pending' && !isEditing && (
            <>
                <Button onClick={handlePublish} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Şimdi Yayınla
                </Button>
                <Dialog open={isSchedulingDialogOpen} onOpenChange={setIsSchedulingDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" disabled={isProcessing}>
                    <CalendarClock className="mr-2 h-4 w-4" />
                    {story.scheduledAtDate ? 'Zamanlamayı Düzenle' : 'Yayın Zamanla'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Hikaye Yayınını Zamanla</DialogTitle>
                    <DialogDescription>
                        "{story.title}" hikayesinin ne zaman yayınlanacağını seçin.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="schedule-date" className="text-right">
                        Tarih
                        </Label>
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={`col-span-3 justify-start text-left font-normal ${!scheduledDate && "text-muted-foreground"}`}
                            >
                            <CalendarClock className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP", {locale: tr}) : <span>Bir tarih seçin</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            initialFocus
                            locale={tr}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="schedule-time" className="text-right">
                        Saat
                        </Label>
                        <Input
                        id="schedule-time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="col-span-3"
                        />
                    </div>
                    </div>
                    <DialogFooter>
                    <DialogClose asChild><Button variant="outline">İptal</Button></DialogClose>
                    <Button onClick={handleSchedulePublication} disabled={isProcessing || !scheduledDate || !scheduledTime}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Zamanla
                    </Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>
            </>
            )}
            {!isEditing && (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
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
                        <AlertDialogCancel disabled={isProcessing}>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete} 
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={isProcessing}
                        >
                            Evet, hikayeyi sil
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
           
        </div>
      </CardFooter>
    </Card>
  );
}

    