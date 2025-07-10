"use client";

import Link from "next/link";
import { Zap, Github, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">FileCompress </span>
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Advanced file compression tool for professionals and individuals.
          Compress files while maintaining quality.
        </p>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:contact@filecompresspro.com">
              <Mail className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="border-t w-full mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 FileCompress . All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
