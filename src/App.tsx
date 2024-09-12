import Header from "./components/sections/Header";
import StartScreen from "./components/sections/StartScreen";
import GameBoard from "./components/sections/GameBoard";
import GameOverScreen from "./components/sections/GameOverScreen";
import { ScoreProvider } from "./context/ScoreContext";
import { useGameConfig } from "./context/GameContext";
import { GameStatusType } from "./types/types";

function App() {
  // Destructure the gameConfig from the GameContext hook
  const { gameConfig } = useGameConfig();

  // Function to render different components based on the game status
  const renderGameState = (value: GameStatusType) => {
    switch (value) {
      case "start":
        return <StartScreen />;  // Renders the StartScreen component when the game is in the start state

      case "playing":
        return <GameBoard />;  // Renders the GameBoard component when the game is in the playing state

      case "end":
        return <GameOverScreen />; // Renders the GameOverScreen component when the game is in the end state
        
      default:
        return <StartScreen />;  // Default case renders StartScreen component
    }
  };

  return (
    <div className="min-h-[100dvh] bg-primary grid grid-rows-[auto_1fr]">
      {/* Header component for logo */}
      <Header />

      <main className="grid gap-[3rem] place-items-center px-5">
        <div className="w-full max-w-[28rem]">
          {/* ScoreProvider to manage the score context */}
          <ScoreProvider>
            {renderGameState(gameConfig.gameStatus)}  {/* Render the component based on game status */}
          </ScoreProvider>
        </div>
      </main>
    </div>
  );
}

export default App;
