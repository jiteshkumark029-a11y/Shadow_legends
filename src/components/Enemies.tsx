import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { globalState } from '../globals';

interface EnemyData {
  id: number;
  position: [number, number, number];
  hp: number;
  maxHp: number;
}

export function Enemies() {
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const { gameState } = useGameStore();
  
  // Spawn enemies periodically
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const interval = setInterval(() => {
      setEnemies(prev => {
        if (prev.length >= 10) return prev; // Max 10 enemies
        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 20;
        const x = globalState.playerPosition.x + Math.cos(angle) * radius;
        const z = globalState.playerPosition.z + Math.sin(angle) * radius;
        return [...prev, { id: Date.now(), position: [x, 5, z], hp: 50, maxHp: 50 }];
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [gameState]);

  // Global attack handler
  useEffect(() => {
    const handleAttack = (e: CustomEvent) => {
      const { position, radius, damage } = e.detail;
      setEnemies(prev => prev.map(enemy => {
        const dist = new THREE.Vector3(...enemy.position).distanceTo(position);
        if (dist < radius) {
          const newHp = enemy.hp - damage;
          if (newHp <= 0) {
            useGameStore.getState().addXp(20);
            useGameStore.getState().addCoins(5);
            useGameStore.getState().updateMission(1);
            return { ...enemy, hp: 0 }; // Mark for death
          }
          return { ...enemy, hp: newHp };
        }
        return enemy;
      }).filter(e => e.hp > 0));
    };
    
    window.addEventListener('player-attack', handleAttack as EventListener);
    return () => window.removeEventListener('player-attack', handleAttack as EventListener);
  }, []);

  return (
    <group>
      {enemies.map(enemy => (
        <Enemy key={enemy.id} data={enemy} />
      ))}
    </group>
  );
}

function Enemy({ data }: { data: EnemyData }) {
  const ref = useRef<RapierRigidBody>(null);
  const { takeDamage, gameState } = useGameStore();
  const lastAttackTime = useRef(0);
  
  useFrame(() => {
    if (!ref.current || gameState !== 'playing') return;
    
    const pos = ref.current.translation();
    const target = globalState.playerPosition;
    const dir = new THREE.Vector3().subVectors(target, new THREE.Vector3(pos.x, pos.y, pos.z));
    const dist = dir.length();
    
    dir.normalize();
    
    // Move
    const velocity = ref.current.linvel();
    if (dist > 1.5) {
      ref.current.setLinvel({ x: dir.x * 3, y: velocity.y, z: dir.z * 3 }, true);
    } else {
      ref.current.setLinvel({ x: 0, y: velocity.y, z: 0 }, true);
    }
    
    // Attack
    if (dist < 2 && Date.now() - lastAttackTime.current > 2000) {
      takeDamage(10);
      lastAttackTime.current = Date.now();
    }
    
    // Update position in data for hit detection
    data.position = [pos.x, pos.y, pos.z];
  });

  return (
    <RigidBody ref={ref} colliders={false} mass={1} type="dynamic" position={data.position} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Health bar */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[1 * (data.hp / data.maxHp), 0.1]} />
        <meshBasicMaterial color="red" side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  );
}
