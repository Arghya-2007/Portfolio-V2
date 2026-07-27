'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

interface RobotModelProps {
  onLoaded?: () => void;
}

export default function RobotModel({ onLoaded }: RobotModelProps) {
  const group = useRef<THREE.Group>(null);
  const motionPreference = useMotionPreference();

  // Load the GLB model
  const { scene, animations } = useGLTF('/models/robot_playground.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play the baked animation named 'Experiment'
    if (actions && actions['Experiment']) {
      actions['Experiment'].play();
    }

    // Ensure the GLTF scene doesn't have a baked-in background
    if (scene) {
      const s = scene as unknown as THREE.Scene;
      s.background = null;
      s.environment = null;
    }

    // Model is now loaded and mounted
    if (onLoaded) {
      onLoaded();
    }
  }, [actions, scene, onLoaded]);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Add a very subtle, slow floating motion to make it feel alive
    const time = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(time) * 0.1;

    // Add continuous zoom in and zoom out (breathing) animation
    const scaleMultiplier = 1 + Math.sin(time * 1) * 0.05;
    group.current.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

    // Mouse Interaction (Desktop fine-pointer only, full motion only)
    if (
      motionPreference === 'full' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      // Calculate target rotations (e.g. max ±18 degrees = Math.PI / 10)
      const targetRotationX = (state.pointer.y * Math.PI) / 10;
      const targetRotationY = (state.pointer.x * Math.PI) / 10;

      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotationX, 4, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotationY, 4, delta);
    } else {
      // Ease back to rest position
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0, 4, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0, 4, delta);
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* Scale and position can be tweaked to fit the viewport properly */}
      <primitive object={scene} scale={1.2} position={[0, -1, 0]} />
    </group>
  );
}

// Model intentionally not preloaded at the module level.
// This ensures that mobile users (who get the static fallback)
// do not download the GLB file unnecessarily.
