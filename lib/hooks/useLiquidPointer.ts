'use client';

// lib/hooks/useLiquidPointer.ts
// Generic cursor-tracking hook for liquid glass specular highlight.
// Sets --pointer-x / --pointer-y CSS custom properties on the ref element
// as percentages relative to its bounding rect.
//
// This hook is presentation-agnostic — motion gating should be applied
// at the call site, not here.

import { useRef, useCallback } from 'react';

export function useLiquidPointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--pointer-x', `${x}%`);
    ref.current.style.setProperty('--pointer-y', `${y}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.setProperty('--pointer-x', '50%');
    ref.current.style.setProperty('--pointer-y', '50%');
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
