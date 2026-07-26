'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { HalfFloatType } from 'three';
import RobotModel from './RobotModel';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

let isWebGLSupported: boolean | null = null;

function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
  if (isWebGLSupported !== null) return isWebGLSupported;
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      isWebGLSupported = true;
    } else {
      isWebGLSupported = false;
    }
  } catch {
    isWebGLSupported = false;
  }
  return isWebGLSupported;
}

/**
 * HeroScene — full-section transparent canvas.
 *
 * The canvas is absolutely positioned to cover the entire hero section
 * (same size as the <section> root element). pointer-events:none keeps
 * all text / CTAs underneath fully interactive.
 *
 * The robot is offset into the right half via its world position and the
 * camera, so it naturally sits where the right column would be.
 * No bounding box is possible because the canvas has no independent
 * background — it IS the section, just transparent.
 */
export default function HeroScene() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const motionPreference = useMotionPreference();

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  // Reduced motion / no WebGL → render nothing (hero bg image is still visible)
  if (!hasWebGL || motionPreference !== 'full') {
    return null;
  }

  return (
    /*
      absolute inset-0  → covers the full hero section (100vw × 100vh)
      pointer-events-none → clicks fall through to text / CTAs below
      z-0               → sits between the bg image (z-auto) and the
                          content layer (z-10), so text is always on top
    */
    <div
      data-hero-canvas
      className="absolute inset-0 z-[5] pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
        }}
        /*
          Keep camera centered on X so it doesn't skew perspective, 
          and push the model itself to the right using a group offset.
        */
        camera={{ position: [0, 0.5, 5], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        onCreated={({ scene, gl }) => {
          scene.background = null;
          // Clear to fully-transparent black so autoClear never paints
          // an opaque colour over the hero background.
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.5} />
        {/* Warm light from bottom left */}
        <directionalLight position={[-5, -5, 5]} intensity={1.5} color="#FF8A65" />
        {/* Cool light from top right */}
        <directionalLight position={[5, 10, 5]} intensity={2} color="#67D8F9" />
        {/* Rim light from behind */}
        <directionalLight position={[0, 5, -10]} intensity={2.5} color="#7C3AED" />

        <Environment resolution={256} background={false}>
          {/* Custom reflections using Lightformers to give a moody aesthetic */}
          <Lightformer intensity={4} color="#7C3AED" position={[0, 5, -5]} scale={[10, 2, 1]} form="rect" />
          <Lightformer intensity={2} color="#67D8F9" position={[-5, 0, -5]} scale={[2, 10, 1]} form="rect" />
          <Lightformer intensity={2} color="#FF8A65" position={[5, 0, -5]} scale={[2, 10, 1]} form="rect" />
        </Environment>

        {/* Shift the model itself to the right side of the screen */}
        <group position={[2.5, 0, 0]}>
          <RobotModel />
        </group>

        <EffectComposer enableNormalPass={false} frameBufferType={HalfFloatType}>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
