import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ক্রিয়েটিভ গ্যালারি — সৃজনশীল পণ্যের অনলাইন বাজার | রংপুর",
  description:
    "ক্রিয়েটিভ গ্যালারি একটি মাল্টিভেন্ডর ই-কমার্স প্ল্যাটফর্ম — যাচাইকৃত সেলারদের হস্তশিল্প, পোশাক, শিল্পকলাসহ সব পণ্য এক জায়গায়।",
  keywords: ["ক্রিয়েটিভ গ্যালারি", "ই-কমার্স", "রংপুর", "হস্তশিল্প", "মাল্টিভেন্ডর"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased bg-background text-foreground">{children}
        <Toaster />
      </body>
    </html>
  );
}
