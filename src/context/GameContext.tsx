import React, { createContext, useState, useContext, ReactNode } from 'react';
import { GameConfigType } from '../types/types';

// Define the type for the game config context
interface GameConfigContextType {
  gameConfig: GameConfigType; // Current game configuration
  setGameConfig: React.Dispatch<React.SetStateAction<GameConfigType>>; // Function to update game configuration
}

// Create the GameConfigContext
const GameConfigContext = createContext<GameConfigContextType | undefined>(undefined);

// Create a provider component to wrap the app with game config context
export const GameConfigProvider = ({ children }: { children: ReactNode }) => {
  // Initialize game configuration with default values
  const [gameConfig, setGameConfig] = useState<GameConfigType>({
    gameStatus: "start",
    gameMap: 'classic',
    boardSize: 10,
    initialSnakeSpeed: 200,
  });

  // Provide game configuration and update function to context
  return (
    <GameConfigContext.Provider value={{ gameConfig, setGameConfig }}>
      {children}
    </GameConfigContext.Provider>
  );
};

// Custom hook to access GameConfig context
export const useGameConfig = (): GameConfigContextType => {
  // Get the context
  const context = useContext(GameConfigContext);
  
  // Throw error if context is not provided
  if (!context) {
    throw new Error('useGameConfig must be used within a GameConfigProvider');
  }
  
  // Return the context
  return context;
};