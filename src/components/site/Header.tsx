
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Home, LayoutGrid, Sparkles, TrendingUp, FileText, HelpCircle, Telescope, Heart, Brain, Ghost, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger
} from '@/components/ui/sheet';
import { Logo } from '@/components/site/Logo';
import { cn } from '@/lib/utils';
import { GENRES, APP_NAME } from '@/lib/constants';
import type { StoryGenre } from '@/lib/types';


const mainNavLink = { href: '/', label: 'Anasayfa', icon: Home };
const adminPanelLink = { href: '/admin', label: 'Admin Paneli', icon: BookOpen };

const GenreIcon = ({ genre, className }: { genre: StoryGenre; className?: string }) => {
  const defaultClassName = "mr-3 h-5 w-5 text-primary/80 group-hover:text-accent transition-colors duration-200";
  const iconClassName = cn(defaultClassName, className);
  switch (genre) {
    case 'Korku': return <Ghost className={iconClassName} />;
    case 'Macera': return <Telescope className={iconClassName} />;
    case 'Romantik': return <Heart className={iconClassName} />;
    case 'Bilim Kurgu': return <Sparkles className={iconClassName} />;
    case 'Fabl': return <FileText className={iconClassName} />;
    case 'Felsefi': return <Brain className={iconClassName} />;
    default: return <HelpCircle className={iconClassName} />;
  }
};


export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const NavLinkItem = ({ href, label, icon: Icon, exact = false, isMobile = false }: { href: string; label: string; icon: React.ElementType; exact?: boolean; isMobile?: boolean}) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Button 
        variant="ghost" 
        asChild 
        className={cn(
          "justify-start text-base font-medium transition-colors hover:text-primary",
          isActive ? "text-primary font-semibold" : "text-foreground/70",
          isMobile ? "w-full py-3 text-lg" : "px-3 py-2 text-sm relative group/nav-link" // Added group/nav-link for desktop underline
      )}>
        <Link href={href} onClick={() => setIsMobileMenuOpen(false)}>
          <Icon className={cn("mr-2 h-5 w-5", isMobile && "h-6 w-6")} />
          {label}
          {!isMobile && ( // Underline for desktop links
            <span className={cn(
              "absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover/nav-link:scale-x-100 transition-transform duration-300 ease-out",
              isActive && "scale-x-100"
            )}></span>
          )}
        </Link>
      </Button>
    );
  };

  const CategoryLinkItem = ({ genre, isMobile = false }: { genre: StoryGenre, isMobile?: boolean }) => {
    const href = `/categories/${genre}`;
    const isActive = pathname === href;
    return (
       <Button 
        variant="ghost" 
        asChild 
        className={cn(
          "justify-start font-medium transition-colors hover:text-primary",
          isActive ? "text-primary font-semibold" : "text-foreground/70",
          isMobile ? "w-full py-2.5 text-md pl-10" : "text-sm pl-8" // Adjusted padding for desktop consistency
       )}>
        <Link href={href} onClick={() => setIsMobileMenuOpen(false)}>
          {isMobile && <GenreIcon genre={genre} className="mr-3 h-5 w-5 text-foreground/60 group-hover:text-primary" />}
          {genre}
        </Link>
      </Button>
    )
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-lg border-b border-border/20" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label={`${APP_NAME} Anasayfa`} className="z-10">
          <Logo className="h-10 w-auto transition-transform duration-300 hover:scale-105" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <NavLinkItem href={mainNavLink.href} label={mainNavLink.label} icon={Home} exact={true} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-3 py-2 relative group/nav-link",
                  pathname.startsWith('/categories') ? "text-primary font-semibold" : "text-foreground/70"
                )}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Kategoriler
                <ChevronDown className="ml-1 h-4 w-4 opacity-70 group-hover/nav-link:text-primary transition-colors" />
                 <span className={cn( // Underline for desktop links
                    "absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover/nav-link:scale-x-100 transition-transform duration-300 ease-out",
                    pathname.startsWith('/categories') && "scale-x-100"
                  )}></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[800px] p-6 bg-card/90 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-xl mt-2"
              sideOffset={15}
              align="center"
            >
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                {/* Column 1: DüşBox Kategorileri */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="text-lg font-bold text-primary px-1 pb-2 border-b border-primary/20 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-accent"/>
                    DüşBox Kategorileri
                  </DropdownMenuLabel>
                  {GENRES.map((genre) => (
                    <DropdownMenuItem key={genre} asChild className="p-0 group focus:bg-primary/10 rounded-md">
                      <Link href={`/categories/${genre}`} className="flex items-center w-full px-2.5 py-3 text-sm rounded-md text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                        <GenreIcon genre={genre} />
                        <span className="font-medium">{genre}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* Column 2: Öne Çıkan Masal */}
                <div className="space-y-3">
                  <DropdownMenuLabel className="text-lg font-bold text-primary px-1 pb-2 border-b border-primary/20 flex items-center">
                     <TrendingUp className="mr-2 h-5 w-5 text-accent"/>
                    Öne Çıkan Masal
                  </DropdownMenuLabel>
                  <div className="px-1">
                    <Link href="/story/placeholder-featured" className="group block rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-accent/50 p-2 bg-background/30 hover:bg-background/50">
                      <Image
                        src="https://placehold.co/600x400.png"
                        alt="Öne Çıkan Masal"
                        width={220}
                        height={130}
                        className="w-full h-36 object-cover rounded-md mb-3 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="fantasy landscape"
                      />
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors px-1">Efsanevi Ejderhanın Sırrı</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 px-1">Kadim dağların ardında, efsanevi bir ejderhanın koruduğu bir sır...</p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Popüler Masallar */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="text-lg font-bold text-primary px-1 pb-2 border-b border-primary/20 flex items-center">
                     <BookOpen className="mr-2 h-5 w-5 text-accent"/>
                     Popüler Masallar
                  </DropdownMenuLabel>
                  {[
                    { title: "Yıldız Tozu ve Hayaller", href: "/story/placeholder-popular-1" },
                    { title: "Unutulmuş Krallık", href: "/story/placeholder-popular-2" },
                    { title: "Denizin Altındaki Melodi", href: "/story/placeholder-popular-3" },
                    { title: "Saklı Bahçenin Şarkısı", href: "/story/placeholder-popular-4" },
                  ].map((item) => (
                    <DropdownMenuItem key={item.title} asChild className="p-0 group focus:bg-primary/10 rounded-md">
                     <Link href={item.href} className="flex items-center w-full px-2.5 py-3 text-sm rounded-md text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                        <Sparkles className="h-5 w-5 mr-3 text-primary/80 group-hover:text-accent transition-colors duration-200"/>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                   <DropdownMenuItem disabled className="px-2.5 py-2 text-xs text-muted-foreground/70">Daha fazlası yakında...</DropdownMenuItem>
                </div>
              </div>
              <DropdownMenuSeparator className="my-4 bg-primary/20" />
              <div className="text-center">
                <Button variant="outline" asChild size="sm" className="w-full text-primary hover:text-accent hover:border-accent transition-colors duration-200 py-2.5 border-primary/50 hover:bg-primary/5">
                  <Link href={`/categories/${GENRES[0]}`}>
                    Tüm Kategorileri Gör
                  </Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

           <NavLinkItem href={adminPanelLink.href} label={adminPanelLink.label} icon={BookOpen} />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Menüyü aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background/90 backdrop-blur-lg p-0 shadow-xl flex flex-col border-l border-border/30">
              <SheetHeader className="p-4 flex flex-row justify-between items-center border-b border-border/30">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo className="h-9 w-auto" />
                </Link>
                <SheetTitle className="sr-only">Ana Menü</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Menüyü kapat</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 p-4 flex-grow overflow-y-auto">
                <NavLinkItem href={mainNavLink.href} label={mainNavLink.label} icon={mainNavLink.icon} exact={true} isMobile={true}/>

                <div> {/* Wrapper for Kategoriler and its sub-items */}
                  <NavLinkItem href={`/categories/${GENRES[0]}`} label="Kategoriler" icon={LayoutGrid} isMobile={true}/>
                  <div className="flex flex-col mt-1 space-y-0.5 pl-4 border-l-2 border-primary/20 ml-3">
                    {GENRES.map(genre => <CategoryLinkItem key={genre} genre={genre} isMobile={true}/>)}
                  </div>
                </div>

                 <NavLinkItem href={adminPanelLink.href} label={adminPanelLink.label} icon={adminPanelLink.icon} isMobile={true}/>
              </nav>
               <div className="p-4 border-t border-border/30 mt-auto">
                <Button variant="outline" className="w-full text-primary hover:border-primary hover:bg-primary/5" asChild>
                    <Link href="/admin">Yönetici Paneli</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
