import { useGameStore } from '../store';
import { CHARACTERS } from '../constants';
import { Coins, Heart, Shield, Zap, Target } from 'lucide-react';
import { MobileControls } from './MobileControls';

export function UI() {
  const { gameState } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {gameState === 'menu' && <MainMenu />}
      {gameState === 'playing' && (
        <>
          <HUD />
          <MobileControls />
        </>
      )}
      {gameState === 'gameover' && <GameOver />}
    </div>
  );
}

function MainMenu() {
  const { 
    setGameState, 
    selectedCharacter, 
    setSelectedCharacter, 
    unlockedCharacters, 
    unlockCharacter,
    coins,
    level
  } = useGameStore();

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-4xl w-full text-white max-h-[90vh] overflow-y-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Shadow Legends: Anime Battle
        </h1>
        <p className="text-center text-zinc-400 mb-8">Level {level} | {coins} Coins</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Character</h2>
            <div className="space-y-3">
              {CHARACTERS.map(char => {
                const isUnlocked = unlockedCharacters.includes(char.id);
                const isSelected = selectedCharacter === char.id;
                
                return (
                  <div 
                    key={char.id}
                    className={`p-4 rounded-xl border transition-all ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800'} ${!isUnlocked ? 'opacity-50' : 'cursor-pointer'}`}
                    onClick={() => isUnlocked && setSelectedCharacter(char.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: char.color }} />
                        <span className="font-bold">{char.name}</span>
                      </div>
                      {!isUnlocked && (
                        <button 
                          className="px-3 py-1 bg-zinc-700 rounded-lg text-sm hover:bg-zinc-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            unlockCharacter(char.id, 500);
                          }}
                        >
                          Unlock (500)
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 mt-2">{char.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Stats & Abilities</h2>
            {CHARACTERS.find(c => c.id === selectedCharacter) && (
              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Heart className="w-6 h-6 mx-auto text-red-400 mb-1" />
                    <div className="font-bold">{CHARACTERS.find(c => c.id === selectedCharacter)?.stats.hp}</div>
                  </div>
                  <div className="text-center">
                    <Zap className="w-6 h-6 mx-auto text-yellow-400 mb-1" />
                    <div className="font-bold">{CHARACTERS.find(c => c.id === selectedCharacter)?.stats.speed}</div>
                  </div>
                  <div className="text-center">
                    <Shield className="w-6 h-6 mx-auto text-blue-400 mb-1" />
                    <div className="font-bold">{CHARACTERS.find(c => c.id === selectedCharacter)?.stats.damage}</div>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-3">Abilities</h3>
                <div className="space-y-3">
                  {CHARACTERS.find(c => c.id === selectedCharacter)?.abilities.map((ab, i) => (
                    <div key={i} className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg">
                      <span className="font-medium">{ab.name}</span>
                      <span className="text-xs text-zinc-500">{ab.cooldown}s CD</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xl transition-colors shadow-lg shadow-blue-500/20"
            onClick={() => setGameState('playing')}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}

function HUD() {
  const { playerHp, maxHp, level, xp, coins, currentMission, missionProgress, missionTarget, selectedCharacter } = useGameStore();
  const character = CHARACTERS.find(c => c.id === selectedCharacter);
  
  return (
    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between pointer-events-none">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        {/* Player Stats */}
        <div className="bg-black/50 backdrop-blur p-3 md:p-4 rounded-xl border border-white/10 w-48 md:w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-white text-sm md:text-base">Level {level}</span>
            <span className="text-zinc-400 text-xs md:text-sm">{xp} / {level * 100} XP</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${(xp / (level * 100)) * 100}%` }} />
          </div>
          
          <div className="flex justify-between items-center mb-1">
            <span className="text-white flex items-center gap-1 text-sm md:text-base"><Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500" /> HP</span>
            <span className="text-white text-sm md:text-base">{Math.floor(playerHp)} / {maxHp}</span>
          </div>
          <div className="h-3 md:h-4 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all" style={{ width: `${(playerHp / maxHp) * 100}%` }} />
          </div>
        </div>
        
        {/* Mission & Coins */}
        <div className="flex flex-col items-end gap-2 md:gap-4">
          <div className="bg-black/50 backdrop-blur p-2 md:p-3 rounded-xl border border-white/10 flex items-center gap-2 text-white font-bold text-sm md:text-base">
            <Coins className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            {coins}
          </div>
          
          <div className="bg-black/50 backdrop-blur p-3 md:p-4 rounded-xl border border-white/10 w-48 md:w-64 text-right">
            <div className="flex items-center justify-end gap-2 mb-1 md:mb-2 text-blue-400">
              <Target className="w-3 h-3 md:w-4 md:h-4" />
              <span className="font-bold text-xs md:text-sm uppercase tracking-wider">Current Mission</span>
            </div>
            <p className="text-white font-medium mb-1 md:mb-2 text-sm md:text-base">{currentMission}</p>
            <div className="text-xs md:text-sm text-zinc-400">{missionProgress} / {missionTarget}</div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar - Abilities (Hidden on mobile to avoid clutter with joystick) */}
      <div className="hidden md:flex justify-center gap-4">
        <div className="bg-black/50 backdrop-blur p-2 rounded-xl border border-white/10 flex items-center gap-4 pointer-events-auto">
          <div className="w-16 h-16 bg-zinc-800 rounded-lg flex flex-col items-center justify-center border border-zinc-700 relative">
            <span className="text-xs text-zinc-500 absolute top-1 left-1">E</span>
            <span className="text-white font-bold">Attack</span>
          </div>
          {character?.abilities.map((ab, i) => (
            <div key={i} className="w-16 h-16 bg-zinc-800 rounded-lg flex flex-col items-center justify-center border border-zinc-700 relative">
              <span className="text-xs text-zinc-500 absolute top-1 left-1">{i + 1}</span>
              <span className="text-white text-xs text-center px-1">{ab.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameOver() {
  const { setGameState, setPlayerHp, maxHp } = useGameStore();
  
  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center pointer-events-auto">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">YOU DIED</h1>
        <p className="text-zinc-400 mb-8">The shadows have consumed you.</p>
        <button 
          className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          onClick={() => {
            setPlayerHp(maxHp);
            setGameState('menu');
          }}
        >
          Respawn
        </button>
      </div>
    </div>
  );
}
