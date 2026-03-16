import * as THREE from 'three';

export const globalState = {
  playerPosition: new THREE.Vector3(),
  joystick: new THREE.Vector2(0, 0),
  isJumping: false,
  isAttacking: false,
  isRunning: false,
};
