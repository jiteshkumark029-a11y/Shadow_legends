import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { CapsuleCollider, RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { CHARACTERS } from '../constants';
import { globalState } from '../globals';

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const ref = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();
  const { selectedCharacter, gameState } = useGameStore();
  const character = CHARACTERS.find(c => c.id === selectedCharacter) || CHARACTERS[0];
  const lastAttackTime = useRef(0);
  
  useFrame((state) => {
    if (!ref.current || gameState !== 'playing') return;

    const playerPos = ref.current.translation();
    
    // Fall reset (prevents black screen from falling forever)
    if (playerPos.y < -10) {
      ref.current.setTranslation({ x: 0, y: 10, z: 0 }, true);
      ref.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    const { forward, backward, left, right, jump, attack } = get();
    
    const isJumping = jump || globalState.isJumping;
    const isAttacking = attack || globalState.isAttacking;
    const isRunning = globalState.isRunning;
    
    // Combine keyboard and joystick inputs
    let moveX = Number(left) - Number(right) - globalState.joystick.x;
    let moveZ = Number(backward) - Number(forward) + globalState.joystick.y;
    
    const moveVec = new THREE.Vector2(moveX, moveZ);
    if (moveVec.length() > 1) moveVec.normalize();
    
    const speedMultiplier = isRunning ? 1.8 : 1;
    
    // Movement
    frontVector.set(0, 0, moveVec.y);
    sideVector.set(moveVec.x, 0, 0);
    direction.subVectors(frontVector, sideVector).multiplyScalar(character.stats.speed * speedMultiplier);
    
    // Apply camera rotation to movement
    const cameraEuler = state.camera.rotation.clone();
    cameraEuler.x = 0; // Keep movement horizontal
    cameraEuler.z = 0;
    direction.applyEuler(cameraEuler);
    
    const velocity = ref.current.linvel();
    
    // Update velocity
    ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);
    
    // Jump
    if (isJumping && Math.abs(velocity.y) < 0.1) {
      ref.current.setLinvel({ x: velocity.x, y: 6, z: velocity.z }, true);
    }
    
    globalState.playerPosition.set(playerPos.x, playerPos.y, playerPos.z);
    
    // Attack
    if (isAttacking && Date.now() - lastAttackTime.current > 500) {
      const event = new CustomEvent('player-attack', {
        detail: {
          position: globalState.playerPosition,
          radius: 3,
          damage: character.stats.damage
        }
      });
      window.dispatchEvent(event);
      lastAttackTime.current = Date.now();
    }
    
    // Camera follow (simple third person)
    const cameraOffset = new THREE.Vector3(0, 3, 6);
    cameraOffset.applyEuler(cameraEuler);
    
    state.camera.position.lerp(
      new THREE.Vector3(playerPos.x + cameraOffset.x, playerPos.y + cameraOffset.y, playerPos.z + cameraOffset.z),
      0.1
    );
    state.camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);
  });

  return (
    <RigidBody ref={ref} colliders={false} mass={1} type="dynamic" position={[0, 5, 0]} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color={character.color} />
      </mesh>
      {/* Direction indicator */}
      <mesh position={[0, 0.5, -0.4]}>
        <boxGeometry args={[0.4, 0.2, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
}
