import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";

// Premium font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rick & Morty Explorer",
  description: "Explore characters with SSG, ISR and CSR search – built with Next.js 16 and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}> 
      <head />
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-card flex items-center justify-between p-4 sm:p-6 shadow-md backdrop-blur">
          <h1 className="text-2xl font-bold text-primary">Rick & Morty Explorer</h1>
          <DarkModeToggle />
        </header>
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <footer className="text-center py-4 text-sm text-gray-400">
          © {new Date().getFullYear()} Rick & Morty Explorer – Powered by Next.js
        </footer>
      </body>
    </html>
  );
}
