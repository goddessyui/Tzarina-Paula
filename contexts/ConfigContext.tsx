
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SiteConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { configService } from '../services/supabaseService';

export type GlobalMode = 'logic' | 'creative';

interface GameState {
  xp: number;
  level: number;
  mode: GlobalMode;
  achievements: string[];
}

interface ConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => Promise<void>;
  isLoading: boolean;
  gameState: GameState;
  addXP: (amount: number, x?: number, y?: number) => void;
  setMode: (mode: GlobalMode) => void;
  showLevelUp: boolean;
  closeLevelUp: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('tz_game_state_v2');
    return saved ? JSON.parse(saved) : { xp: 0, level: 1, mode: 'creative', achievements: [] };
  });

  useEffect(() => {
    localStorage.setItem('tz_game_state_v2', JSON.stringify(gameState));
  }, [gameState]);

  const triggerXPEffect = (amount: number, x: number, y: number) => {
    const el = document.createElement('div');
    el.className = 'xp-pop';
    el.innerText = `+${amount} XP`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  };

  const addXP = useCallback((amount: number, x?: number, y?: number) => {
    if (x !== undefined && y !== undefined) triggerXPEffect(amount, x, y);
    
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const threshold = 100; // Simplified: 100 XP per level
      if (newXP >= threshold) {
        setShowLevelUp(true);
        return { ...prev, xp: newXP - threshold, level: prev.level + 1 };
      }
      return { ...prev, xp: newXP };
    });
  }, []);

  const setMode = (mode: GlobalMode) => setGameState(prev => ({ ...prev, mode }));

  useEffect(() => {
    const load = async () => {
      const data = await configService.get();
      setConfig(data);
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-bg', config.theme.colorBackground);
    root.style.setProperty('--color-text', config.theme.colorText);
    root.style.setProperty('--color-accent', config.theme.colorAccent);
    root.style.setProperty('--font-heading', "'Chewy', system-ui");
    root.style.setProperty('--font-body', "'Poppins', sans-serif");
  }, [config.theme]);

  const updateConfig = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    await configService.update(newConfig);
  };

  return (
    <ConfigContext.Provider value={{ 
      config, 
      updateConfig, 
      isLoading, 
      gameState, 
      addXP, 
      setMode, 
      showLevelUp, 
      closeLevelUp: () => setShowLevelUp(false) 
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};
