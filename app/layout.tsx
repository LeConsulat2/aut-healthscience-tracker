import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AUT Health Science Progress Tracker",
  description: "Track your academic progress at AUT Health Sciences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ① Navbar on every page */}
        <Navbar />

        {/* ② Responsive wrapper on every page */}
        <main className="pt-16 min-h-screen container mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
