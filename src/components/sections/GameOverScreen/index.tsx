import { useScore } from '../../../context/ScoreContext';
import { useGameConfig } from '../../../context/GameContext';
import DisplayScore from '../../ui/DisplayScore';
import { RestartIcon } from '../../ui/icons';

function GameOverScreen() {
    // Get score and highScore from ScoreContext
    const { score, highScore, setScore } = useScore();
    // Get gameConfig from GameContext
    const { gameConfig, setGameConfig } = useGameConfig();

    // Handle game restart with current configuration
    const handleRestart = () => {
        setScore(0);
        setGameConfig(prevConfig => ({
            ...prevConfig,
            gameStatus: "playing"
        }));
    };

    // Handle new game with reset configuration
    const handleNewGame = () => {
        setScore(0);
        setGameConfig({
            ...gameConfig,
            gameStatus: "start",
        });
    };

    return (
        <div className="bg-secondary text-center p-4 border-2 rounded-md border-accent space-y-8">
            <h1 className="text-4xl font-primary text-accent tracking-widest">Game Over</h1>

            {/* Display current score and high score */}
            <div className="flex gap-10 justify-center text-accent">
                <DisplayScore score={score} scoreName="Score" />
                <DisplayScore score={highScore} scoreName="Hi Score" />
            </div>

            {/* Display restart and new game buttons */}
            <div className="flex justify-center gap-5">
                <button 
                    onClick={handleRestart}
                    className="w-10 fill-white border border-accent p-2 rounded"
                >
                    <RestartIcon />
                </button>

                <button 
                    onClick={handleNewGame}
                    className="w-max font-secondary text-accent text-lg md:text-xl border border-accent p-2 rounded"
                >
                    New Game
                </button>
            </div>
        </div>
    );
}

export default GameOverScreen;