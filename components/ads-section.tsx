"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const fakeAds = [
  {
    title: "Cloud Storage 50% Off!",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "Get secure cloud storage for your files. Limited time offer!",
    cta: "Get Offer",
    url: "#",
  },
  {
    title: "Upgrade to Pro Tools",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    description: "Unlock advanced compression and editing features.",
    cta: "Upgrade Now",
    url: "#",
  },
  {
    title: "Free VPN Trial",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Protect your privacy online with a free VPN trial.",
    cta: "Try Free",
    url: "#",
  },
  {
    title: "Design Templates",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description: "Download beautiful templates for your next project.",
    cta: "Browse Templates",
    url: "#",
  },
];

const POPUP_INTERVAL = 15000; // 15 seconds before showing
const POPUP_DURATION = 15000; // 15 seconds visible before auto-hide

export function AdsSection() {
  const [visible, setVisible] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const showTimeout = useRef<NodeJS.Timeout | null>(null);

  // Show popup after interval
  useEffect(() => {
    if (!visible) {
      showTimeout.current = setTimeout(() => setVisible(true), POPUP_INTERVAL);
    }
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
    };
  }, [visible]);

  // Auto-hide popup after duration
  useEffect(() => {
    if (visible) {
      hideTimeout.current = setTimeout(() => {
        setVisible(false);
        setAdIndex((i) => (i + 1) % fakeAds.length);
      }, POPUP_DURATION);
    }
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    setAdIndex((i) => (i + 1) % fakeAds.length);
  };

  if (!visible) return null;

  const ad = fakeAds[adIndex];

  return (
    <div
      className="fixed top-6 right-6 z-50 animate-fade-in-up"
      style={{ minWidth: 340, maxWidth: 380 }}
    >
      <Card className="shadow-2xl border-2 border-primary/30 bg-background/95 backdrop-blur-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors text-xl font-bold px-2 py-1 rounded-full focus:outline-none"
          aria-label="Close ad"
        >
          ×
        </button>
        <CardHeader className="items-center pt-6 pb-2">
          <Image
            src={ad.image}
            alt={ad.title}
            width={64}
            height={64}
            className="rounded-lg object-cover mb-2 shadow-md"
          />
          <CardTitle className="text-lg text-center font-semibold">
            {ad.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-6">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            {ad.description}
          </p>
          <Button
            asChild
            className="w-full font-semibold shadow hover:scale-105 transition-transform duration-200"
          >
            <a href={ad.url} target="_blank" rel="noopener noreferrer">
              {ad.cta}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Add animation to globals.css:
// .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(.39,.575,.565,1.000) both; }
// @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: none; } }
