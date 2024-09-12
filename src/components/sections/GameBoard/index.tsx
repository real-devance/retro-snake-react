import { useEffect, useState } from "react";
import useQueue from "../../../hooks/useQueue";
import useRAF from "../../../hooks/useRAF";

import { useGameConfig } from "../../../context/GameContext";
import { useScore } from "../../../context/ScoreContext";

import {
  // Board setup
  createBoard,
  squareMap,
  verticalMap,
  
  // Game logic
  checkGameOver,
  checkFoodConsumption,
  handleDirection,
  speedIncrement,

  // Input handling
  checkValidMove,
  checkValidKeys,
  
  // Food and snake initialization
  foodPlacement,
  initializeSnakeAndFood,
  
  // Key mappings
  keysMap,
} from "../../../utils/gameLogic";

import CanvasBoard from "./Canvas";
import DisplayScore from "../../ui/DisplayScore";
import DirectionBtn from "../../ui/DirectionBtn";

import { BoardCoordinatesType, SnakeBodyType, GameControlKeysType, MovementDirectionType } from "../../../types/types";

function GameBoard()  {
 
  // Access game configurations and score from context
  const { gameConfig, setGameConfig } = useGameConfig();
  const { score, highScore, setScore, handleHiScore: setHighScore } = useScore();

  // Initialize board and obstruction maps
  const BOARD_SIZE = gameConfig.boardSize;
  const BOARD = createBoard(BOARD_SIZE);

  // Set obstruction map based on the selected game map
  const obstructionMap = () => {
    switch (gameConfig.gameMap) {
      case "classic":
        return [];    
      case "square":
        return squareMap(BOARD_SIZE);
      case "vertical":
        return verticalMap(BOARD_SIZE);
    }
  }

  // Initialize obstructions, snake, and food placement
  const obstruction: BoardCoordinatesType[] = obstructionMap();
  const { initialSnake, initialFood } = initializeSnakeAndFood(BOARD_SIZE, obstruction);

  // Queue to manage snake's body
  const { add, remove, getFirst, getLast, getAllItems, clear } = useQueue<BoardCoordinatesType>([initialSnake]);

  // State for snake body, food, direction, pause, game over, and speed
  const [snakeBody, setSnakeBody] = useState<SnakeBodyType>([initialSnake]);
  const [food, setFood] = useState<BoardCoordinatesType>(initialFood);
  const [direction, setDirection] = useState<MovementDirectionType>("");
  const [pause, setPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState<number>(gameConfig.initialSnakeSpeed);

  // Calculate and update the high score
  const handleHighScore = (): number => {
    const newHighScore = Math.max(score + 1, highScore);
    return newHighScore;
  };

  // Update game logic: move snake, handle food consumption, and check game over conditions
  const updateGame = () => {
    const currentSnakeHead = getLast();
    const currentSnakeTail = getFirst();
  
    if (currentSnakeHead && currentSnakeTail && direction) {
      const nextSnakeHead = handleDirection(direction);
      const newSnakeHead = {
        x: currentSnakeHead.x + nextSnakeHead.x,
        y: currentSnakeHead.y + nextSnakeHead.y,
      };
  
      const isFoodConsumed = checkFoodConsumption(newSnakeHead, food);
      const isGameOver = checkGameOver(newSnakeHead, snakeBody, BOARD_SIZE, obstruction);
  
      // If game over, stop the game
      if (isGameOver) {
        setGameOver(true);
        setGameConfig(prev => ({ ...prev, gameStatus: "end" }));
        return;
      }
  
      // If food is consumed, add new snake head and update food position
      if (isFoodConsumed) {
        add(newSnakeHead);
        setFood(foodPlacement(getAllItems(), BOARD_SIZE, obstruction));
        setScore(score + 1);
        setHighScore(handleHighScore());
        setSpeed((prev) => (speedIncrement(prev, score)));
      } else {
        add(newSnakeHead); // Add the new head
        remove(); // Remove the tail to move the snake
      }
  
      setSnakeBody(getAllItems()); // Update snake body state
    }
  };

  // Handle keyboard input for controlling the snake
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
  
    // Toggle pause on spacebar
    if (key === " ") {
      setPause(prevPause => !prevPause);
      return;
    }
  
    // Check for valid direction keys and update the snake's direction
    if (checkValidKeys(key)) {
      const dir = keysMap.get(key as GameControlKeysType) || direction;
  
      if (checkValidMove(direction, dir as MovementDirectionType)) {
        setDirection(dir);
      }
    }
  };
  
  // Attach and remove event listeners for keydown events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]); 

  // Use requestAnimationFrame to update the game loop at the correct speed
  useRAF(updateGame, speed, pause, gameOver, clear);

  return (
    <>
      <div className="w-full aspect-square border-4 border-accent bg-secondary">
        {/* Render the game board */}
        <CanvasBoard
          BOARD={BOARD}
          snakeBody={snakeBody}
          food={food}
          obstructedCells={obstruction}
          snakeHeadColor="#EEEDEB"
          snakeBodyColor="#FFFFFF"
          foodColor="#FFD93D"
          obstructionColor="#686D76"
          gridLineColor="1b263b"
        />
        
        {/* Score and control buttons */}
        <div className="bg-accent flex justify-between items-center px-2 py-1 border-none">
          <DisplayScore score={score} scoreName="score" />
          <button
            className="min-w-max outline-transparent align-middle px-4 py-1 border-2 border-primary rounded-md font-secondary text-lg md:text-xl"
            onClick={() => setPause(prevPause => !prevPause)}
          >
            {pause ? "Play" : "Pause"}
          </button>
          <DisplayScore score={highScore} scoreName="hi score" />
        </div>
      </div>

      {/* Direction controls */}
      <div className="mt-10">  
        <div className="grid gap-2 justify-center">
          <div className="mx-auto">
            <DirectionBtn direction="up" setDirection={setDirection} />
          </div>
          <div className="flex gap-5">
            <DirectionBtn direction="left" setDirection={setDirection} />
            <DirectionBtn direction="down" setDirection={setDirection} />
            <DirectionBtn direction="right" setDirection={setDirection} />
          </div>
        </div>
      </div>
    </>
  );
}

export default GameBoard;
