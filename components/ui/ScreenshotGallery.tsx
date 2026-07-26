'use client';

import Image from 'next/image';
import GlassCard from './GlassCard';

interface ScreenshotGalleryProps {
  images: string[];
  projectName: string;
}

export default function ScreenshotGallery({ images, projectName }: ScreenshotGalleryProps) {
  if (images.length === 0) {
    return (
      <GlassCard className="mt-8 overflow-hidden rounded-xl p-0">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex aspect-video items-center justify-center bg-bg-secondary p-8 text-center">
          <div>
            <p className="font-mono text-sm text-text-muted mb-2">Screenshot pending</p>
            <p className="font-body text-xs text-text-muted">
              Visuals for <strong className="text-text-secondary">{projectName}</strong> will be added soon.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      {images.map((src, i) => (
        <GlassCard key={src} className="overflow-hidden rounded-xl p-0">
          {/* Browser-like header */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          {/* Image container */}
          <div className="relative aspect-video w-full bg-bg-secondary">
            <Image
              src={src}
              alt={`${projectName} screenshot ${i + 1}`}
              fill
              unoptimized={src.startsWith('http')} // Since we are hotlinking for now
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
