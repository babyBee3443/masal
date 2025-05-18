'use client'; // Make this a client component to manage local state and re-fetching

import { useEffect, useState, useTransition } from 'react';
import type { Story } from '@/lib/types';
import { getStories } from '@/lib/mock-db'; // Direct import for client-side refresh
import { AdminStoryControls } from '@/components/admin/AdminStoryControls';
import { GenerateStorySection } from '@/components/admin/GenerateStorySection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle, Inbox } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AdminPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const fetchStories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStories = await getStories();
      // Sort stories: pending first, then by creation date descending
      fetchedStories.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setStories(fetchedStories);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hikayeler yüklenemedi.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleStoryGeneratedOrUpdated = () => {
    startRefreshTransition(() => {
      fetchStories();
    });
  };
  
  const pendingStories = stories.filter(s => s.status === 'pending');
  const publishedStories = stories.filter(s => s.status === 'published');

  if (isLoading && stories.length === 0) { // Show initial loading spinner only if no stories are loaded yet
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Hikayeler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
        <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Hikayeler Yüklenirken Hata Oluştu</h2>
        <p>{error}</p>
        <button onClick={fetchStories} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Tekrar Dene
        </button>
      </div>
    );
  }
  
  const renderStoryList = (storyList: Story[], listTitle: string) => {
    if (storyList.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground bg-card p-6 rounded-lg shadow">
          <Inbox className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg">Şu anda hiç {listTitle.toLowerCase()} hikaye yok.</p>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        {storyList.map(story => (
          <AdminStoryControls key={story.id} story={story} />
        ))}
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Hikaye Yönetimi</h1>
      
      <GenerateStorySection onStoryGenerated={handleStoryGeneratedOrUpdated} />

      <Separator className="my-8" />
      
      <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-4">
        Hikaye Kuyruğu {isRefreshing && <Loader2 className="inline-block ml-2 h-6 w-6 animate-spin" />}
      </h2>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mb-6">
          <TabsTrigger value="pending">Bekleyen ({pendingStories.length})</TabsTrigger>
          <TabsTrigger value="published">Yayınlanmış ({publishedStories.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {renderStoryList(pendingStories, "Bekleyen")}
        </TabsContent>
        <TabsContent value="published">
          {renderStoryList(publishedStories, "Yayınlanmış")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
