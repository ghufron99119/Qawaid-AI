import type { Metadata } from "next";
import { Noto_Naskh_Arabic, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Qawaid AI - Intelligent Arabic Grammar Companion",
  description: "Learn Nahwu and Sharaf with AI-powered Arabic text analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoArabic.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-5xl">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
