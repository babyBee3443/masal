import Link from 'next/link';
import { ShieldCheck, Home, CalendarDays, Repeat } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { Logo } from '@/components/site/Logo';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';

export const metadata = {
  title: `Admin Paneli | ${APP_NAME}`,
  robots: 'noindex, nofollow', // Prevent indexing of admin panel
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-background to-muted/30">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <Link href="/admin" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Logo className="h-8 w-auto" />
              <span className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">{APP_NAME} Admin</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Ana Sayfa">
                  <Link href="/admin">
                    <Home />
                    <span>Ana Sayfa</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tarih Bazlı Planlama">
                  <Link href="/admin/scheduling">
                    <CalendarDays />
                    <span>Tarih Bazlı Planlama</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Haftalık Planlama">
                  <Link href="/admin/weekly-schedule">
                    <Repeat />
                    <span>Haftalık Planlama</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border mt-auto">
            <Button variant="outline" asChild className="w-full group-data-[collapsible=icon]:hidden">
              <Link href="/">Siteyi Görüntüle</Link>
            </Button>
             <Button variant="ghost" size="icon" asChild className="hidden group-data-[collapsible=icon]:flex justify-center w-full">
              <Link href="/"><Home /></Link>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-grow flex flex-col">
          <header className="bg-card/80 backdrop-blur-md shadow-sm sticky top-0 z-40 md:hidden"> {/* Only show for mobile */}
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <Logo className="h-7 w-auto" />
                <span className="text-lg font-semibold text-foreground">Admin</span>
              </Link>
              <SidebarTrigger className="md:hidden" />
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
             <div className="items-center justify-between mb-6 hidden md:flex"> {/* Only show for desktop, for trigger */}
                <div/> {/* Spacer */}
                <SidebarTrigger className="hidden md:block" />
             </div>
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
            &copy; {new Date().getFullYear()} {APP_NAME} Admin Paneli
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
