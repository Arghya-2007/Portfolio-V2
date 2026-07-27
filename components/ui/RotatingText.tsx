'use client';

import { useState, useEffect, useRef } from 'react';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

interface RotatingTextProps {
  roles: string[];
  className?: string;
}

const gradientValues = [
  'linear-gradient(to right, #08f1deff, #06f125ff)', // cyan to blue
  'linear-gradient(to right, #efedf4ff, #dff303ff)', // violet to fuchsia
  'linear-gradient(to right, #fbbf24, #f97316)', // amber to orange
  'linear-gradient(to right, #f3e309ff, #ee0a0aff)', // emerald to teal
];

export default function RotatingText({ roles, className = '' }: RotatingTextProps) {
  const motionPreference = useMotionPreference();
  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (motionPreference === 'reduced') {
      setIsRevealed(true);
      return;
    }

    let timeout: NodeJS.Timeout;
    let isActive = true;

    const cycle = () => {
      if (!isActive) return;
      if (document.hidden) {
        timeout = setTimeout(cycle, 1000);
        return;
      }

      setIsRevealed(true);

      const currentWordLength = roles[indexRef.current].length;
      // Stagger is 40ms per char, plus 800ms base transition
      const revealDuration = (currentWordLength * 40) + 800;

      timeout = setTimeout(() => {
        if (!isActive) return;
        setIsRevealed(false);

        // Out stagger is 15ms per char, plus 800ms base transition
        const hideDuration = (currentWordLength * 15) + 800;

        timeout = setTimeout(() => {
          if (!isActive) return;
          indexRef.current = (indexRef.current + 1) % roles.length;
          setIndex(indexRef.current);

          timeout = setTimeout(cycle, 150);
        }, hideDuration);
      }, revealDuration + 3000); // Hold fully revealed word for 3s
    };

    timeout = setTimeout(cycle, 200);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [roles, motionPreference]);

  const currentGradient = gradientValues[index % gradientValues.length];
  const word = roles[index];
  const chars = word.split('');

  return (
    <span className={`inline-flex items-center perspective-[1200px] ${className}`}>
      <span className="inline-block" aria-label={word}>
        {chars.map((char, i) => {
          return (
            <span
              key={`${index}-${i}`}
              aria-hidden="true"
              className="inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.2,1,0.3,1)]"
              style={{
                backgroundImage: currentGradient,
                backgroundSize: `${chars.length * 100}% 100%`,
                backgroundPosition: `${(i / Math.max(1, chars.length - 1)) * 100}% 0`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: motionPreference === 'reduced' ? 'none' : (isRevealed ? 'blur(0px)' : 'blur(10px)'),
                opacity: motionPreference === 'reduced' ? 1 : (isRevealed ? 1 : 0),
                transform: isRevealed
                  ? 'translateY(0) scale(1) rotateX(0deg)'
                  : 'translateY(30px) scale(1.1) rotateX(-40deg)',
                transformOrigin: 'bottom center',
                transitionDelay: `${isRevealed ? i * 40 : (chars.length - 1 - i) * 15}ms`,
                whiteSpace: char === ' ' ? 'pre' : 'normal',
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
