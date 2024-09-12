import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GameConfigProvider } from './context/GameContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameConfigProvider>
      <App />
    </GameConfigProvider>
  </StrictMode>,
)
