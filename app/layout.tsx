import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/components/modal-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FileCompress - Advanced File Compression Tool",
  description:
    "Compress images, documents, videos, and audio files with our advanced compression algorithms. Reduce file sizes while maintaining quality.",
  keywords:
    "file compression, image compression, document compression, video compression, audio compression, file optimizer, reduce file size",
  authors: [{ name: "Arsema & Eleni in collaboration with Zemenay Community" }],
  creator: "Arsema & Eleni",
  publisher: "Arsema & Eleni",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://file-compresser.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FileCompress - Advanced File Compression Tool",
    description:
      "Compress images, documents, videos, and audio files with our advanced compression algorithms. Reduce file sizes while maintaining quality.",
    url: "https://file-compresser.vercel.app/",
    siteName: "FileCompress",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FileCompress - File Compression Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileCompress - Advanced File Compression Tool",
    description:
      "Compress images, documents, videos, and audio files with our advanced compression algorithms.",
    images: ["/og-image.png"],
    creator: "Arsema & Eleni",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/image.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>
            {children}
            <Toaster />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
