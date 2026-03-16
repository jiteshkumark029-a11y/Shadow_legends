import { useRef, useState } from 'react';
import { globalState } from '../globals';
import { useGameStore } from '../store';

export function MobileControls() {
  const { gameState } = useGameStore();
  const baseRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [runActive, setRunActive] = useState(false);

  if (gameState !== 'playing') return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateJoystick(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateJoystick(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    globalState.joystick.set(0, 0);
    if (stickRef.current) {
      stickRef.current.style.transform = `translate(0px, 0px)`;
    }
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const updateJoystick = (e: React.PointerEvent) => {
    if (!baseRef.current || !stickRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    
    const maxRadius = rect.width / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    
    stickRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    
    // Normalize to -1 to 1
    globalState.joystick.set(dx / maxRadius, dy / maxRadius);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden touch-none">
      {/* Joystick */}
      <div 
        className="absolute bottom-12 left-8 md:left-12 w-32 h-32 bg-white/10 rounded-full border-2 border-white/20 backdrop-blur-sm pointer-events-auto touch-none"
        ref={baseRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div 
          ref={stickRef} 
          className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/60 rounded-full -mt-6 -ml-6 shadow-lg pointer-events-none" 
        />
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-12 right-8 md:right-12 flex flex-col gap-4 pointer-events-auto touch-none">
        <div className="flex gap-4 justify-end">
          <button 
            className={`w-14 h-14 md:w-16 md:h-16 rounded-full font-bold text-white shadow-lg backdrop-blur-sm border-2 border-white/30 transition-colors ${runActive ? 'bg-blue-500/80' : 'bg-white/20'}`}
            onClick={() => {
              setRunActive(!runActive);
              globalState.isRunning = !runActive;
            }}
          >
            RUN
          </button>
          <button 
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 font-bold text-white shadow-lg backdrop-blur-sm border-2 border-white/30 active:bg-white/40"
            onPointerDown={() => globalState.isJumping = true}
            onPointerUp={() => globalState.isJumping = false}
            onPointerCancel={() => globalState.isJumping = false}
          >
            JUMP
          </button>
        </div>
        <div className="flex justify-end">
          <button 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-500/80 font-bold text-white shadow-lg backdrop-blur-sm border-2 border-red-400/50 active:bg-red-400/80"
            onPointerDown={() => globalState.isAttacking = true}
            onPointerUp={() => globalState.isAttacking = false}
            onPointerCancel={() => globalState.isAttacking = false}
          >
            ATK
          </button>
        </div>
      </div>
    </div>
  );
}
