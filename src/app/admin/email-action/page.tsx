
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateStory as dbUpdateStory, deleteStoryById as dbDeleteStoryById, getStoryById as dbGetStoryById } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Home } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import type { Story } from '@/lib/types';

function EmailActionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState<string | null>(null);

  useEffect(() => {
    document.title = `E-posta İşlemi | ${APP_NAME} Admin`;
    const storyIdParam = searchParams.get('storyId');
    const taskParam = searchParams.get('task');

    const processAction = async () => {
      if (!storyIdParam && !taskParam) {
        setError('Eksik parametreler. Lütfen e-postadaki bağlantıyı kontrol edin veya yönetici panelinden devam edin.');
        setIsLoading(false);
        return;
      }
      if (!storyIdParam) {
        setError('Hikaye ID parametresi eksik. Lütfen e-postadaki bağlantıyı kontrol edin.');
        setIsLoading(false);
        return;
      }
      if (!taskParam) {
        setError('İşlem (task) parametresi eksik. Lütfen e-postadaki bağlantıyı kontrol edin.');
        setIsLoading(false);
        return;
      }


      try {
        const storyToUpdate = await dbGetStoryById(storyIdParam);
        if (!storyToUpdate) {
          setError(`Hikaye bulunamadı (ID: ${storyIdParam}). Belki zaten işlenmiş veya silinmiş olabilir.`);
          setIsLoading(false);
          return;
        }
        setStoryTitle(storyToUpdate.title);

        if (taskParam === 'approve') {
          if (storyToUpdate.status === 'awaiting_approval') {
            await dbUpdateStory(storyIdParam, { status: 'pending' });
            setMessage(`"${storyToUpdate.title}" başlıklı hikaye başarıyla onaylandı ve yayınlanmak üzere "Bekleyenler" listesine taşındı.`);
          } else {
            setMessage(`"${storyToUpdate.title}" başlıklı hikaye zaten farklı bir durumda (${storyToUpdate.status}). İşlem yapılmadı.`);
          }
        } else if (taskParam === 'reject') {
           if (storyToUpdate.status === 'awaiting_approval') {
            await dbDeleteStoryById(storyIdParam);
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
  }, [searchParams]); // Depend on searchParams directly

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
  return (
    <Suspense fallback={<div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="text-muted-foreground mt-2">Yükleniyor...</p></div>}>
      <EmailActionHandler />
    </Suspense>
  );
}
