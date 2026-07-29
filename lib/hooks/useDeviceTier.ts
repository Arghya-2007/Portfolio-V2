'use client';

/**
 * useDeviceTier — High-End Device Optimization Pass
 *
 * Companion to useMotionPreference(). Adds a second detection layer that only
 * activates when motionPreference === 'full'. Users in 'reduced' or 'none' mode
 * are never routed through this logic — they receive the existing safe fallbacks
 * and this hook is a no-op for them.
 *
 * Tier: 'standard' | 'high'
 *
 * Detection signals (each is feature-detected individually):
 *   1. navigator.hardwareConcurrency >= 8  (logical cores — mainstream high-end threshold)
 *   2. navigator.deviceMemory >= 8         (GB — feature-detected, not all browsers expose it)
 *   3. window.devicePixelRatio >= 2        (Retina/HiDPI — users who most benefit from higher DPR)
 *   4. WebGL renderer info probe           (bonus signal — deprecated in Chrome 113+, graceful fallback)
 *
 * Scoring: 2+ signals out of the available set → 'high'; else → 'standard'.
 * The 2-signal minimum prevents a single factor (e.g., a Retina phone with 4 cores)
 * from misfiring into the high tier.
 *
 * SSR safety: always returns 'standard' during server render / pre-hydration.
 * Sets document.documentElement.dataset.tier for CSS-driven tier overrides.
 */

import { useState, useEffect } from 'react';
import { useMotionPreference } from './useReducedMotion';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DeviceTier = 'standard' | 'high';

interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
}

// ─── Centralized Render Quality Config ───────────────────────────────────────
//
// ALL tier-variant values live here. Never scatter conditional tier checks
// ad-hoc across component files — import these constants instead.
//
// Standard-tier values are the existing proven defaults (unchanged behavior).
// High-tier values are strictly additive enhancements behind the tier check.

export const RENDER_QUALITY = {
  standard: {
    /** R3F Canvas devicePixelRatio range — caps at 2 for broad GPU safety */
    canvasDpr: [1, 2] as [number, number],
    /** drei <Environment> resolution — 256 is the existing safe default */
    envMapResolution: 256 as number,
    /** next/image quality for the Hero priority background (above fold) */
    imageQualityHero: 85,
    /** next/image quality for below-fold section backgrounds */
    imageQualitySection: 75,
  },
  high: {
    /** Allow up to 3× DPR so Retina 3× displays render the model crisp */
    canvasDpr: [1, 3] as [number, number],
    /** 512 env map — noticeably sharper reflections; still GPU-safe on capable hardware */
    envMapResolution: 512 as number,
    /** Slightly higher quality for Hero bg on capable connections/displays */
    imageQualityHero: 90,
    /** Richer source fidelity for section backgrounds on HiDPI */
    imageQualitySection: 85,
  },
} as const;

// ─── WebGL Renderer Probe ─────────────────────────────────────────────────────
//
// WEBGL_debug_renderer_info was deprecated in Chrome 113+ for fingerprinting
// privacy reasons. We treat its absence as a graceful no-signal, not an error.
// This probe is a bonus confirmation signal — the 3-signal set above is already
// robust without it.

function probeWebGLRendererTier(): boolean {
  try {
    const canvas = document.createElement('canvas');
    // Prefer WebGL2; fall back to WebGL1
    const gl = (
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    ) as WebGLRenderingContext | null;

    if (!gl) return false;

    // Attempt the deprecated extension — may return null in modern Chrome
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) {
      // Extension unavailable — clean up and return no-signal
      const loseCtx = gl.getExtension('WEBGL_lose_context');
      if (loseCtx) loseCtx.loseContext();
      return false;
    }

    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
    const loseCtx = gl.getExtension('WEBGL_lose_context');
    if (loseCtx) loseCtx.loseContext();

    if (!renderer) return false;

    // Match discrete GPU / Apple Silicon keywords → high signal
    const rendererLower = renderer.toLowerCase();
    const highTierKeywords = [
      'nvidia', 'geforce', 'rtx', 'gtx', 'quadro',       // NVIDIA
      'amd', 'radeon', 'rx ',                              // AMD
      'apple m',                                            // Apple Silicon GPU
      'arc',                                                // Intel Arc (discrete)
    ];
    return highTierKeywords.some((kw) => rendererLower.includes(kw));
  } catch {
    // Any error (security policy, context creation failure, etc.) → no signal
    return false;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDeviceTier(): DeviceTier {
  // Default to 'standard' — safe for SSR and pre-hydration.
  const [tier, setTier] = useState<DeviceTier>('standard');
  const motionPreference = useMotionPreference();

  useEffect(() => {
    // Short-circuit: reduced/none motion users never enter tiering logic.
    // They get the existing 'reduced' experience — this hook is a no-op for them.
    if (motionPreference !== 'full') {
      document.documentElement.removeAttribute('data-tier');
      return;
    }

    const extNav = navigator as ExtendedNavigator;
    const signals: boolean[] = [];

    // Signal 1 — Logical CPU cores (≥8 = mainstream high-end in 2024+)
    if (navigator.hardwareConcurrency) {
      signals.push(navigator.hardwareConcurrency >= 8);
    }

    // Signal 2 — Device RAM (≥8GB; feature-detected — not all browsers expose this)
    if (typeof extNav.deviceMemory !== 'undefined') {
      signals.push(extNav.deviceMemory >= 8);
    }

    // Signal 3 — Device Pixel Ratio (≥2 = Retina/HiDPI — main beneficiary of DPR ceiling raise)
    signals.push(window.devicePixelRatio >= 2);

    // Signal 4 — WebGL GPU renderer probe (bonus, graceful fallback if extension unavailable)
    const gpuIsHighTier = probeWebGLRendererTier();
    if (gpuIsHighTier) {
      // Only push as a signal if we actually got a usable result
      signals.push(true);
    }

    // Require at least 2 high signals to reach 'high' tier.
    // Prevents a single factor (e.g., Retina phone with 4 cores) from misfiring.
    const highSignalCount = signals.filter(Boolean).length;
    const resolvedTier: DeviceTier = highSignalCount >= 2 ? 'high' : 'standard';

    // Stamp the tier on <html data-tier="..."> so CSS can drive overrides
    // without any JavaScript-driven inline style mutations.
    document.documentElement.setAttribute('data-tier', resolvedTier);

    setTier(resolvedTier);
  }, [motionPreference]);

  return tier;
}
