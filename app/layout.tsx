// app/layout.tsx
'use client';

import React, { useState } from 'react';
// import type { Metadata } from 'next';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';
import './globals.css';

// export const metadata: Metadata = {
//   title: 'AUT Health Science Progress Tracker',
//   description: 'Track your academic progress at AUT Health Sciences.',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <html lang="en">
      <body className="antialiased scroll-smooth">
       
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 shadow-lg">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-white font-bold text-xl">
                Student Progress Tracker
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex space-x-2">
              <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                <Link href="/">
                  <span className="text-lg">Home</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                <Link href="/programmes">
                  <span className="text-lg">Programmes</span>
                </Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileNavOpen && (
            <div className="md:hidden bg-black/20 backdrop-blur-sm">
              <div className="flex flex-col space-y-2 p-4">
                <Button 
                  asChild 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 justify-start"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <Link href="/">
                    <span className="text-lg">Home</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 justify-start"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <Link href="/programmes">
                    <span className="text-lg">Programmes</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </nav>

        <main className="pt-16 container mx-auto px-4 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}