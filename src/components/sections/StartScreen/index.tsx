import RadioSelect from "../../ui/RadioSelect";
import useRadioState from "../../../hooks/useRadioState";
import { useGameConfig } from "../../../context/GameContext";
import { GameMapType, BoardSizeType, SnakeSpeedType } from "../../../types/types";
import { toCapitalize } from "../../../utils/toCapitalize";

// Options for map selection, grid size, and speed
const mapOptions: GameMapType[] = ["classic", "square", "vertical"];
const gridOptions: BoardSizeType[] = [10, 20, 30];

// Using the snakeSpeedMap keys directly for speed options
const snakeSpeedMap: Record<string, SnakeSpeedType> = {
  normal: 200,
  fast: 160,
  slow: 260,
};
const speedOptions = Object.keys(snakeSpeedMap); // ['normal', 'fast', 'slow']

function StartScreen() {
  const { setGameConfig } = useGameConfig();
  
  // State and handlers for map selection
  const [selectedMap, handleMapChange] = useRadioState(mapOptions[0]);
  // State and handlers for board size selection
  const [selectedGrid, handleGridChange] = useRadioState(gridOptions[0]);
  // State and handlers for speed selection
  const [selectedSpeed, handleSpeedChange] = useRadioState(speedOptions[0]);

  // Function to handle game start with selected options
  const handleGameStart = () => {
    setGameConfig({
      gameStatus: 'playing',
      gameMap: selectedMap,
      boardSize: selectedGrid,
      initialSnakeSpeed: snakeSpeedMap[selectedSpeed],
    });
  };

  return (
    <div className="bg-secondary text-center p-4 border-2 rounded-md border-accent space-y-8">
      <h1 className="text-4xl font-primary text-accent tracking-widest">Start</h1>
      
      {/* Map Selection Options*/}
      <div className="flex items-center gap-4 flex-wrap">
        <h2 className="font-secondary text-md md:text-lg text-accent tracking-wider">Map</h2>
        {mapOptions.map((map) => (
          <RadioSelect
            key={map}
            name="map"
            value={map}
            displayName={toCapitalize(map)}  // Capitalize map option for display
            selectedValue={selectedMap}
            onChange={handleMapChange}
          />
        ))}
      </div>

      {/* Board Size Layout Options*/}
      <div className="flex items-center gap-4 flex-wrap">
        <h2 className="font-secondary text-md md:text-lg text-accent tracking-wider">Board Size</h2>
        {gridOptions.map((grid) => (
          <RadioSelect
            key={grid}
            name="grid"
            value={grid.toString()}  // Convert number to string for value
            displayName={grid.toString()}  // Display board size
            selectedValue={selectedGrid.toString()}  // Convert selectedGrid to string
            onChange={handleGridChange}
          />
        ))}
      </div>

      {/* Speed Selection Options*/}
      <div className="flex items-center gap-4 flex-wrap">
        <h2 className="font-secondary text-md md:text-lg text-accent tracking-wider">Speed</h2>
        {speedOptions.map((speed) => (
          <RadioSelect
            key={speed}
            name="speed"
            value={speed}
            displayName={toCapitalize(speed)}  // Capitalize speed option for display
            selectedValue={selectedSpeed}
            onChange={handleSpeedChange}
          />
        ))}
      </div>

      {/* Instructions */}
      <ul className="text-left text-base font-secondary tracking-wide text-accent">
        <li>Use &#11013;, &#11015;, &#11014;, &#11015; or W, A, S, D to move</li>   {/* ⬅️, ⬇️, ⬆️, ⬅️ */}
        <li>Eat &#x1F7E1; to grow</li>   {/* 🟡 */}
        <li>Dodge &#x1F9F1; walls and yourself</li> {/* 🧱 */}
      </ul>

      {/* Start Game Button */}
      <button
        onClick={handleGameStart}
        className="mt-4 px-4 py-2 bg-primary border-2 rounded-md hover:border-primary font-secondary text-accent hover:bg-accent hover:text-primary"
      >
        Start Game
      </button>
    </div>
  );
}

export default StartScreen;
