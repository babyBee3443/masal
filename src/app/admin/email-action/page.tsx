
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter }_from 'next/navigation';
import Link from 'next/link';
import { updateStory as dbUpdateStory, deleteStoryById as dbDeleteStoryById, getStoryById as dbGetStoryById }_from '@/lib/mock-db';
import { Button }_from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle }_from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Home }_from 'lucide-react';
import { APP_NAME }_from '@/lib/constants';
import type { Story }_from '@/lib/types';

function EmailActionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const storyId = searchParams.get('storyId');
  const task = searchParams.get('task');

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState<string | null>(null);

  useEffect(() => {
    document.title = `E-posta İşlemi | ${APP_NAME} Admin`;

    const processAction = async () => {
      if (!storyId || !task) {
        setError('Eksik parametreler. Lütfen e-postadaki bağlantıyı kontrol edin.');
        setIsLoading(false);
        return;
      }

      try {
        const storyToUpdate = await dbGetStoryById(storyId);
        if (!storyToUpdate) {
          setError(`Hikaye bulunamadı (ID: ${storyId}). Belki zaten işlenmiş veya silinmiş olabilir.`);
          setIsLoading(false);
          return;
        }
        setStoryTitle(storyToUpdate.title);

        if (task === 'approve') {
          if (storyToUpdate.status === 'awaiting_approval') {
            await dbUpdateStory(storyId, { status: 'pending' });
            setMessage(`"${storyToUpdate.title}" başlıklı hikaye başarıyla onaylandı ve yayınlanmak üzere "Bekleyenler" listesine taşındı.`);
          } else {
            setMessage(`"${storyToUpdate.title}" başlıklı hikaye zaten farklı bir durumda (${storyToUpdate.status}). İşlem yapılmadı.`);
          }
        } else if (task === 'reject') {
           if (storyToUpdate.status === 'awaiting_approval') {
            await dbDeleteStoryById(storyId);
            setMessage(`"${storyToUpdate.title}" başlıklı hikaye reddedildi ve onay kuyruğundan kaldırıldı.`);
           } else {
             setMessage(`"${storyToUpdate.title}" başlıklı hikaye zaten farklı bir durumda (${storyToUpdate.status}) veya silinmiş. Reddetme işlemi yapılmadı.`);
           }
        } else {
          setError('Geçersiz işlem türü. Lütfen e-postadaki bağlantıyı kontrol edin.');
        }
      } catch (e) {
        console.error("Error processing email action:", e);
        setError(e instanceof Error ? e.message : 'İşlem sırasında bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    processAction();
  }, [storyId, task]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">E-posta İşlemi Sonucu</CardTitle>
          {storyTitle && <CardDescription>İşlenen Hikaye: {storyTitle}</CardDescription>}
        </CardHeader>
        <CardContent className="text-center">
          {isLoading && (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">İşlem yapılıyor, lütfen bekleyin...</p>
            </div>
          )}
          {!isLoading && message && (
            <div className="flex flex-col items-center space-y-3 text-green-600">
              <CheckCircle className="h-12 w-12" />
              <p className="text-lg font-semibold">{message}</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="flex flex-col items-center space-y-3 text-destructive">
              <AlertTriangle className="h-12 w-12" />
              <p className="text-lg font-semibold">Hata!</p>
              <p>{error}</p>
            </div>
          )}
          {!isLoading && (
            <Button asChild className="mt-6">
              <Link href="/admin">
                <Home className="mr-2 h-4 w-4" /> Yönetici Paneline Dön
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
      <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {APP_NAME}
      </p>
    </div>
  );
}

export default function EmailActionPage() {
  // Suspense is required by Next.js when using useSearchParams in a page component
  return (
    <Suspense fallback={<div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="text-muted-foreground mt-2">Yükleniyor...</p></div>}>
      <EmailActionHandler />
    </Suspense>
  );
}
