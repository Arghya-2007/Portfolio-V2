'use client';

import { useProgress } from '@react-three/drei';

interface HeroLoadingScreenProps {
  isVisible: boolean;
}

export default function HeroLoadingScreen({ isVisible }: HeroLoadingScreenProps) {
  const { progress } = useProgress();

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg-dark/80 backdrop-blur-md transition-opacity duration-700 ease-in-out ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="font-mono text-accent-400 text-sm tracking-widest mb-4">
        LOADING // {Math.round(progress)}%
      </div>
      <div className="w-48 h-[2px] bg-text-muted/20 overflow-hidden">
        <div
          className="h-full bg-accent-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
