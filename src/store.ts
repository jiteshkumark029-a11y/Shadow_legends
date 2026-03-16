import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CHARACTERS } from './constants';

interface GameState {
  gameState: 'menu' | 'playing' | 'paused' | 'gameover';
  setGameState: (state: 'menu' | 'playing' | 'paused' | 'gameover') => void;
  
  selectedCharacter: string;
  setSelectedCharacter: (id: string) => void;
  
  coins: number;
  addCoins: (amount: number) => void;
  
  level: number;
  xp: number;
  addXp: (amount: number) => void;
  
  playerHp: number;
  maxHp: number;
  setPlayerHp: (hp: number) => void;
  setMaxHp: (hp: number) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  
  unlockedCharacters: string[];
  unlockCharacter: (id: string, cost: number) => void;
  
  timeOfDay: number; // 0 to 24
  setTimeOfDay: (time: number) => void;
  
  // Missions
  currentMission: string | null;
  missionProgress: number;
  missionTarget: number;
  setMission: (mission: string, target: number) => void;
  updateMission: (progress: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      gameState: 'menu',
      setGameState: (state) => set({ gameState: state }),
      
      selectedCharacter: 'gojo',
      setSelectedCharacter: (id) => set((state) => {
        const char = CHARACTERS.find(c => c.id === id);
        if (char) {
          return { selectedCharacter: id, maxHp: char.stats.hp, playerHp: char.stats.hp };
        }
        return { selectedCharacter: id };
      }),
      
      coins: 0,
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      level: 1,
      xp: 0,
      addXp: (amount) => set((state) => {
        let newXp = state.xp + amount;
        let newLevel = state.level;
        const xpNeeded = newLevel * 100;
        if (newXp >= xpNeeded) {
          newLevel++;
          newXp -= xpNeeded;
          // Heal on level up
          return { xp: newXp, level: newLevel, playerHp: state.maxHp };
        }
        return { xp: newXp };
      }),
      
      playerHp: 100,
      maxHp: 100,
      setPlayerHp: (hp) => set({ playerHp: hp }),
      setMaxHp: (hp) => set({ maxHp: hp }),
      takeDamage: (amount) => set((state) => {
        const newHp = Math.max(0, state.playerHp - amount);
        if (newHp === 0 && state.gameState === 'playing') {
          return { playerHp: newHp, gameState: 'gameover' };
        }
        return { playerHp: newHp };
      }),
      heal: (amount) => set((state) => ({ playerHp: Math.min(state.maxHp, state.playerHp + amount) })),
      
      unlockedCharacters: ['gojo'],
      unlockCharacter: (id, cost) => set((state) => {
        if (state.coins >= cost && !state.unlockedCharacters.includes(id)) {
          return { 
            unlockedCharacters: [...state.unlockedCharacters, id],
            coins: state.coins - cost
          };
        }
        return state;
      }),
      
      timeOfDay: 12,
      setTimeOfDay: (time) => set({ timeOfDay: time }),
      
      currentMission: 'Defeat 5 Enemies',
      missionProgress: 0,
      missionTarget: 5,
      setMission: (mission, target) => set({ currentMission: mission, missionProgress: 0, missionTarget: target }),
      updateMission: (progress) => set((state) => {
        const newProgress = state.missionProgress + progress;
        if (newProgress >= state.missionTarget) {
          // Mission complete
          return { 
            missionProgress: newProgress,
            coins: state.coins + 50,
            currentMission: 'Defeat ' + (state.missionTarget + 5) + ' Enemies',
            missionTarget: state.missionTarget + 5,
            missionProgress: 0
          };
        }
        return { missionProgress: newProgress };
      }),
    }),
    {
      name: 'shadow-legends-save',
      partialize: (state) => ({
        coins: state.coins,
        level: state.level,
        xp: state.xp,
        unlockedCharacters: state.unlockedCharacters,
        selectedCharacter: state.selectedCharacter,
      }),
    }
  )
);
