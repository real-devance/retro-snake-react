// Type for coordinates on the board
export type BoardCoordinatesType = {
  x: number; // x-coordinate
  y: number; // y-coordinate
};

// Type for the snake's body, which is an array of coordinates
export type SnakeBodyType = BoardCoordinatesType[]; // Array of coordinates

// Type for keyboard keys used in the game
export type GameControlKeysType = 
  | "arrowup" 
  | "arrowdown" 
  | "arrowright" 
  | "arrowleft" 
  | 'w' 
  | 'a' 
  | 's' 
  | 'd'; // Keyboard keys for game control

// Type for movement directions in the game
export type MovementDirectionType = 
  | "up" 
  | "down" 
  | "left" 
  | "right" 
  | ""; // Movement directions (including empty string for initial state)

// Type for game status (start, playing, end)
export type GameStatusType = 'start' | 'playing' | 'end';

// Type for obstructions on the board (array of coordinates)
export type ObstructionType = BoardCoordinatesType[];

// Type for the game map options (classic, square, vertical)
export type GameMapType = "classic" | "square" | "vertical";

// Type for the board size options (10, 20, 30)
export type BoardSizeType = 10 | 20 | 30;

// Type for the initial snake speed options (200, 160, 260)
export type SnakeSpeedType = 200 | 160 | 260;

// Interface for the game configuration, using the individual types
export interface GameConfigType {
  gameStatus: GameStatusType; 
  gameMap: GameMapType; 
  boardSize: BoardSizeType; 
  initialSnakeSpeed: SnakeSpeedType;
}