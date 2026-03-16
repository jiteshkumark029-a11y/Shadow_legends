import { RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';

export function World() {
  // Generate some random trees/obstacles
  const obstacles = useMemo(() => {
    const items = [];
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      // Don't spawn too close to center
      if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;
      items.push({ x, z, scale: 1 + Math.random() * 2 });
    }
    return items;
  }, []);

  return (
    <group>
      {/* Ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[200, 1, 200]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
      </RigidBody>

      {/* Obstacles */}
      {obstacles.map((obs, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={[obs.x, obs.scale / 2, obs.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, obs.scale, 1]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {/* Leaves */}
          <mesh castShadow position={[0, obs.scale / 2 + 1, 0]}>
            <sphereGeometry args={[1.5, 8, 8]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </RigidBody>
      ))}
      
      {/* Invisible walls */}
      <RigidBody type="fixed" position={[100, 10, 0]}>
        <boxGeometry args={[1, 20, 200]} />
        <meshBasicMaterial visible={false} />
      </RigidBody>
      <RigidBody type="fixed" position={[-100, 10, 0]}>
        <boxGeometry args={[1, 20, 200]} />
        <meshBasicMaterial visible={false} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 10, 100]}>
        <boxGeometry args={[200, 20, 1]} />
        <meshBasicMaterial visible={false} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 10, -100]}>
        <boxGeometry args={[200, 20, 1]} />
        <meshBasicMaterial visible={false} />
      </RigidBody>
    </group>
  );
}
