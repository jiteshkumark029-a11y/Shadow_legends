import { Canvas, useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { KeyboardControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { World } from './World';
import { Enemies } from './Enemies';
import { Effects } from './Effects';
import { useGameStore } from '../store';
import * as THREE from 'three';
import { useRef } from 'react';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'attack', keys: ['Click', 'KeyE'] },
  { name: 'ability1', keys: ['Digit1'] },
  { name: 'ability2', keys: ['Digit2'] },
  { name: 'ability3', keys: ['Digit3'] },
];

function DayNightCycle() {
  const { timeOfDay, setTimeOfDay, gameState } = useGameStore();
  const lightRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame((_, delta) => {
    if (gameState === 'playing') {
      // 1 real second = 1 game hour -> 24 seconds for a full day
      setTimeOfDay((timeOfDay + delta) % 24);
    }
    
    if (lightRef.current) {
      // Calculate sun position based on time of day
      // 6 AM = 0, 12 PM = PI/2, 6 PM = PI, 12 AM = 3PI/2
      const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
      const radius = 100;
      lightRef.current.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      
      // Adjust intensity based on height
      const height = Math.sin(angle);
      lightRef.current.intensity = Math.max(0, height * 1.5);
    }
  });

  // Calculate sun position for Sky component
  const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
  const sunPos = new THREE.Vector3(
    Math.cos(angle) * 100,
    Math.sin(angle) * 100,
    0
  );

  return (
    <>
      <ambientLight intensity={Math.max(0.3, Math.sin(angle) * 0.5 + 0.3)} />
      <directionalLight 
        ref={lightRef}
        castShadow 
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
      </directionalLight>
      <Sky sunPosition={sunPos} />
    </>
  );
}

export function Game() {
  const { gameState } = useGameStore();
  
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <color attach="background" args={['#000000']} />
        
        <DayNightCycle />
        
        <Physics gravity={[0, -9.81, 0]}>
          <World />
          {gameState === 'playing' && (
            <>
              <Player />
              <Enemies />
              <Effects />
            </>
          )}
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}
