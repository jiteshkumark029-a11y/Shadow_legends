import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Effect {
  id: number;
  position: THREE.Vector3;
  color: string;
  startTime: number;
}

export function Effects() {
  const [effects, setEffects] = useState<Effect[]>([]);

  useEffect(() => {
    const handleAttack = (e: CustomEvent) => {
      const { position } = e.detail;
      setEffects(prev => [...prev, {
        id: Date.now(),
        position: position.clone(),
        color: '#ffffff', // Could pass character color
        startTime: Date.now()
      }]);
    };
    
    window.addEventListener('player-attack', handleAttack as EventListener);
    return () => window.removeEventListener('player-attack', handleAttack as EventListener);
  }, []);

  return (
    <group>
      {effects.map(effect => (
        <AttackRing key={effect.id} data={effect} onComplete={(id) => setEffects(prev => prev.filter(e => e.id !== id))} />
      ))}
    </group>
  );
}

function AttackRing({ data, onComplete }: { data: Effect, onComplete: (id: number) => void }) {
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(1);
  
  useFrame(() => {
    const elapsed = Date.now() - data.startTime;
    if (elapsed > 300) {
      onComplete(data.id);
      return;
    }
    
    setScale(0.1 + (elapsed / 300) * 4);
    setOpacity(1 - (elapsed / 300));
  });

  return (
    <mesh position={[data.position.x, data.position.y, data.position.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[scale, scale + 0.2, 32]} />
      <meshBasicMaterial color={data.color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}
