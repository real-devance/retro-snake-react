// ScoreContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Define the type for the context value
interface ScoreContextType {
  score: number; // Current score
  setScore: React.Dispatch<React.SetStateAction<number>>; // Function to update score
  highScore: number; // High score
  handleHiScore: (value: number) => void; // Function to update high score
  clearHighScore: () => void; // Function to clear high score (NOT USED IN GAME FOR NOW)
}

// Create the context with default values
const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

// Create a provider component using a function declaration
export function ScoreProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState<number>(0); // Initialize score state
  const [storedHiScore, setStoredHiScore, removeStoredHiScore] = useLocalStorage<number>('highScore', 0); // Use localStorage to store high score
  const [highScore, setHighScore] = useState<number>(storedHiScore); // Initialize high score state

  // Update highScore and localStorage
  const handleHiScore = (value: number) => {
    setHighScore(value);
    setStoredHiScore(value);
  };

  // NOT USED IN GAME FOR NOW
  const clearHighScore = () => {
    removeStoredHiScore(); 
  };

  const value = { score, setScore, highScore, handleHiScore, clearHighScore };

  return (
    <ScoreContext.Provider value={value}>
      {children}
    </ScoreContext.Provider>
  );
}

// Custom hook to use the context
export function useScore(): ScoreContextType {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
}