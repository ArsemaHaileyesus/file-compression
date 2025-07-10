import type { Metadata } from "next";
import { Header } from "@/components/header";
import { CompressionInterface } from "@/components/compression-interface";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Shield,
  Rocket,
  FileText,
  Image,
  Video,
  Music,
  Archive,
} from "lucide-react";
import { AdsSection } from "@/components/ads-section";

export const metadata: Metadata = {
  title: "FileCompress Pro",
  description:
    "Free online file compression tool. Compress images, documents, videos, and audio files instantly with advanced algorithms.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Compress Files with
            <span className="text-primary"> Ease</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advanced file compression tool for professionals and individuals.
            Compress images, documents, videos, and audio files while
            maintaining quality.
          </p>
        </section>

        {/* Compression Tool Section */}
        <section id="compression-tool" className="py-8">
          <CompressionInterface />
        </section>

        {/* Ads Section */}
        <AdsSection />

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for efficient file compression and
              optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Image className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Image Compression</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimize JPEG, PNG, WebP, and more with advanced algorithms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    Document Compression
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compress PDFs, Word docs, Excel files, and presentations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Video Compression</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reduce video file sizes while maintaining quality
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Music className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Audio Compression</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimize MP3, WAV, AAC, and other audio formats
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About FileCompress Pro</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to making file compression simple, fast, and
              secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <CardTitle>Fast & Efficient</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our advanced algorithms ensure quick compression without
                  compromising quality
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Secure & Private</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your files are processed securely and automatically deleted
                  after compression
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Easy to Use</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simple drag-and-drop interface with no technical knowledge
                  required
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
