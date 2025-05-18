import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 text-muted-foreground py-12 mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <Link href="/" aria-label={`${APP_NAME} Home`}>
              <Logo className="h-10 w-auto" />
            </Link>
          </div>
          
          <nav className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/categories/Adventure" className="hover:text-primary transition-colors">Categories</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            {/* Add more links if needed, e.g., About, Contact, Privacy Policy */}
          </nav>

          <p className="text-center md:text-right text-sm">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs">
          <p>Crafted with imagination and code.</p>
        </div>
      </div>
    </footer>
  );
}
