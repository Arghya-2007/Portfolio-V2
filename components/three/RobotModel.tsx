'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export default function RobotModel() {
  const group = useRef<THREE.Group>(null);

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
  }, [actions, scene]);

  useFrame((state) => {
    if (!group.current) return;

    // Add a very subtle, slow floating motion to make it feel alive
    const time = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(time) * 0.1;

    // Add continuous zoom in and zoom out (breathing) animation
    const scaleMultiplier = 1 + Math.sin(time * 1) * 0.05;
    group.current.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
  });

  return (
    <group ref={group} dispose={null}>
      {/* Scale and position can be tweaked to fit the viewport properly */}
      <primitive object={scene} scale={1.3} position={[0, -1, 0]} />
    </group>
  );
}

// Preload the model to avoid pop-in
useGLTF.preload('/models/robot_playground.glb');
