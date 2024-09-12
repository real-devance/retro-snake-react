import getRandomInt from "../getRandomNumber";
import { BoardCoordinatesType, SnakeBodyType, GameControlKeysType, MovementDirectionType  } from "../../types/types";



export const keysMap: Map<GameControlKeysType, MovementDirectionType> = new Map([
  ["arrowup", "up"],
  ["w", "up"],

  ["arrowdown", "down"],
  ["s", "down"],

  ["arrowleft", "left"],
  ["a", "left"],

  ["arrowright", "right"],
  ["d", "right"]
]);




/**
 * Generates a valid food placement coordinate on the board that is not occupied by the snake's body and not on blocked objects.
 *
 * @param snakeBody - The current positions of the snake's body.
 * @param boardSize - The size of the board (boardSize x boardSize).
 * @param blockedObjects - Objects where food placement should not occur.
 * @returns A coordinate object with x and y properties representing the food's location.
 */
export const foodPlacement = (
  snakeBody: SnakeBodyType,
  boardSize: number,
  blockedObjects: BoardCoordinatesType[] = []
): BoardCoordinatesType => {
  // Initialize food coordinate with a random position
  let foodCoordinate: BoardCoordinatesType = {
    x: getRandomInt(0, boardSize - 1),
    y: getRandomInt(0, boardSize - 1)
  };

  // Keep generating new coordinates until a valid position is found
  const maxRetries = 100; // Prevent infinite loop in case of small board and many obstacles
  let attempts = 0;

  // Check if food overlaps with snake or blocked objects
  while (
    (snakeBody.some(cell => cell.x === foodCoordinate.x && cell.y === foodCoordinate.y) || 
    blockedObjects.some(obj => obj.x === foodCoordinate.x && obj.y === foodCoordinate.y)) && 
    attempts < maxRetries
  ) {
    // Generate new random coordinates
    foodCoordinate = {
      x: getRandomInt(0, boardSize - 1),
      y: getRandomInt(0, boardSize - 1)
    };
    attempts++;
  }

  // Return the valid food coordinate
  return foodCoordinate;
};


/**
 * Function to check if the snake has consumed the food.
 * 
 * @param snakeHead - The current position of the snake's head.
 * @param food - The current position of the food.
 * @returns boolean - Returns true if the snake's head is on the food, false otherwise.
 */
export const checkFoodConsumption = (snakeHead: BoardCoordinatesType, food: BoardCoordinatesType): boolean => {
  // Check if the snake's head coordinates match the food's coordinates
  if (snakeHead.x === food.x && snakeHead.y === food.y) {
    // Snake's head is on the food, return true
    return true;
  } else {
    // Snake's head is not on the food, return false
    return false;
  }
};



/**
 * Checks if the snake's head collides with any part of its body except itself.
 * @param snakeHead - The coordinates of the snake's head.
 * @param snakeBody - The coordinates of the snake's body, with the head as the last element.
 * @returns True if the head collides with the body; false otherwise.
 */
export const checkCollideWithItSelf = (snakeHead: BoardCoordinatesType, snakeBody: SnakeBodyType): boolean => {
  // Check if snake body has more than just the head
  return snakeBody.length > 1 && 
    // Check for collisions with body, excluding the head (last element)
    snakeBody.slice(0, -1).some(cell => cell.x === snakeHead.x && cell.y === snakeHead.y);
};



/**
 * Checks if the snake's head collides with the boundary of the board.
 * @param snakeHead - The coordinates of the snake's head.
 * @param boardSize - The size of the board (assumed to be a square).
 * @returns True if the head is out of bounds; false otherwise.
 */
export const checkCollideWithBoundary = (snakeHead: BoardCoordinatesType, boardSize: number): boolean => {
  // Check for out-of-bounds conditions
  return (
    snakeHead.x < 0 || 
    snakeHead.x >= boardSize || 
    snakeHead.y < 0 || 
    snakeHead.y >= boardSize
  );
};



/**
 * Checks if the snake's head collides with any obstructions on the board.
 *
 * @param snakeHead - The current position of the snake's head.
 * @param obstructedCells - An array of coordinates where obstructions are present on the board.
 * @returns A boolean indicating whether the snake's head collides with any obstruction.
 */
export const checkCollideWithObstruction = (
  snakeHead: BoardCoordinatesType,
  obstructedCells: BoardCoordinatesType[]
): boolean => {
  // Check for collision with obstructed cells
  return obstructedCells.some(cell => cell.x === snakeHead.x && cell.y === snakeHead.y);
};


/**
 * Checks if the game is over based on collisions with the boundary, itself, or obstructions.
 *
 * @param snakeHead - The current position of the snake's head.
 * @param snakeBody - The positions of the snake's body segments.
 * @param boardSize - The size of the game board.
 * @param obstructedCells - An array of coordinates where obstructions are present on the board.
 * @returns A boolean indicating whether the game is over (true) or still ongoing (false).
 */
export const checkGameOver = (
  snakeHead: BoardCoordinatesType,
  snakeBody: SnakeBodyType,
  boardSize: number,
  obstructedCells: BoardCoordinatesType[] = []
): boolean => {
  // Check for collision with boundary
  const isCollideWithBoundary = checkCollideWithBoundary(snakeHead, boardSize);
  
  // Check for collision with itself
  const isCollideWithItSelf = checkCollideWithItSelf(snakeHead, snakeBody);
  
  // Check for collision with obstructions
  const isCollideWithObstruction = checkCollideWithObstruction(snakeHead, obstructedCells);
  
  // If any collision is detected, game is over
  if (isCollideWithBoundary || isCollideWithItSelf || isCollideWithObstruction) {
    return true; // Game over
  }
  
  return false; // Game is still ongoing
};



/**
 * Checks if a new direction is valid based on the current direction.
 * The snake cannot reverse direction (e.g., moving up cannot be followed by moving down).
 *
 * @param direction - The current direction of the snake.
 * @param newDirection - The direction the snake is attempting to move towards.
 * @returns True if the new direction is valid, false otherwise.
 */
export const checkValidMove = (direction: MovementDirectionType, newDirection: MovementDirectionType): boolean => {
  // Check for reverse directions
  if (direction === "up" && newDirection === "down") return false; // Cannot move down if currently moving up
  if (direction === "down" && newDirection === "up") return false; // Cannot move up if currently moving down
  if (direction === "left" && newDirection === "right") return false; // Cannot move right if currently moving left
  if (direction === "right" && newDirection === "left") return false; // Cannot move left if currently moving right

  // If none of the reverse conditions are met, the direction change is valid
  return true;
};




/**
 * Checks if a given key is valid according to the defined keys map.
 * 
 * @param key - The key to check for validity.
 * @returns True if the key is valid; otherwise, false.
 */
export const checkValidKeys = (key: string): boolean => {
  // Check if the provided key exists in the keysMap
  return keysMap.has(key as GameControlKeysType); // Returns true if key is valid, false otherwise
};


/**
 * Converts a movement direction into board coordinates change.
 * 
 * @param direction - The direction of movement: "up", "down", "left", or "right".
 * @returns The corresponding change in board coordinates for the given direction.
 */
export const handleDirection = (direction: MovementDirectionType): BoardCoordinatesType => {
  // Use a switch statement to determine the coordinate change based on direction
  switch (direction) {
    case "up":
      // Moving up: decrease x coordinate by 1
      return { x: -1, y: 0 };

    case "down":
      // Moving down: increase x coordinate by 1
      return { x: 1, y: 0 };

    case "left":
      // Moving left: decrease y coordinate by 1
      return { x: 0, y: -1 };

    case "right":
      // Moving right: increase y coordinate by 1
      return { x: 0, y: 1 };

    default:
      // Invalid direction: return no change
      return { x: 0, y: 0 };
  }
};




/**
 * Generates a square map of borders given the start and end x coordinates, top and bottom y coordinates, and left and right y coordinates.
 * 
 * @param startX - The starting x coordinate.
 * @param endX - The ending x coordinate.
 * @param topY - The top y coordinate.
 * @param bottomY - The bottom y coordinate.
 * @param leftY - The left y coordinate.
 * @param rightY - The right y coordinate.
 * @returns An array of border coordinates.
 */
export const generateSquareMap = (
  startX: number,
  endX: number,
  topY: number,
  bottomY: number,
  leftY: number,
  rightY: number
): BoardCoordinatesType[] => {
  const borders: BoardCoordinatesType[] = [];

  // Generate top and bottom borders
  for (let x = startX; x <= endX; x++) {
    borders.push({ x, y: topY });    // Top border
    borders.push({ x, y: bottomY }); // Bottom border
  }

  // Generate left and right vertical sections
  for (let y = leftY; y <= rightY; y++) {
    borders.push({ x: startX, y }); // Left vertical section
    borders.push({ x: endX, y });   // Right vertical section
  }

  return borders;
};



/**
 * Generates a vertical map with specified start and end lines, and equal gaps between.
 * 
 * @param startX - The starting X coordinate
 * @param endX - The ending X coordinate
 * @param startY - The starting Y coordinate
 * @param endY - The ending Y coordinate
 * @param numberOfLines - The total number of vertical lines to generate (including start and end lines)
 * @returns An array of BoardCoordinatesType representing the vertical map
 */
export const generateVerticalMap = (
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  numberOfLines: number
): BoardCoordinatesType[] => {
  const coordinates: BoardCoordinatesType[] = [];

  // Ensure at least 2 lines (start and end)
  numberOfLines = Math.max(2, numberOfLines);

  // Calculate the gap between lines
  const gap = (endY - startY) / (numberOfLines - 1);

  // Generate vertical lines
  for (let i = 0; i < numberOfLines; i++) {
    const y = Math.round(startY + i * gap);

    // For each vertical line, add all points from startX to endX
    for (let x = startX; x <= endX; x++) {
      coordinates.push({ x, y });
    }
  }

  return coordinates;
};


/**
 * Generates a square map of borders based on the board size.
 * 
 * @param BOARD_SIZE - The size of the board (10, 20, or 30).
 * @returns An array of border coordinates.
 */
export const squareMap = (BOARD_SIZE: 10 | 20 | 30) => {
  // Calculate border padding based on board size
  const borderPadding = BOARD_SIZE / 10;
  
  // Calculate start and end x coordinates
  const startX = Math.floor(borderPadding) + 1;
  const endX = BOARD_SIZE - startX - 1;
  
  // Calculate top and bottom y coordinates
  const topY = Math.floor(borderPadding);
  const bottomY = BOARD_SIZE - Math.floor(borderPadding) - 1;
  
  // Calculate left and right y coordinates
  const leftY = Math.floor(startX + borderPadding);
  const rightY = Math.floor(endX - borderPadding);

  // Generate square map using calculated coordinates
  const result = generateSquareMap(startX, endX, topY, bottomY, leftY, rightY);

  return result;
};



/**
 * Generates a vertical map of coordinates based on the board size.
 * 
 * @param BOARD_SIZE - The size of the board (10, 20, or 30).
 * @returns An array of coordinates.
 */
export const verticalMap = (
  BOARD_SIZE: 10 | 20 | 30
): BoardCoordinatesType[] => {
  // Calculate border padding based on board size
  const borderPadding = BOARD_SIZE / 10;
  
  // Calculate start and end x coordinates
  const startX = borderPadding + 1;
  const endX = BOARD_SIZE - startX - 1;
  
  // Calculate start and end y coordinates
  const startY = borderPadding; // Starting Y (top row)
  const endY = BOARD_SIZE - borderPadding - 1; // Ending Y (bottom row)
  
  // Define the gap between rows
  const noOfLines = (BOARD_SIZE - (borderPadding*2)) / (borderPadding*2) ;
  
  // Generate vertical map using calculated coordinates and gap
  const result = generateVerticalMap(startX, endX, startY, endY, noOfLines);

  return result;
};





/**
 * Get a random coordinate from available spaces on the board.
 * 
 * @param boardSize - Dimensions of the board [rows, columns].
 * @param occupiedSpaces - Array of coordinates that are occupied (e.g., snake body, obstructions).
 * @returns - A random available coordinate or null if no space is available.
 */
export const getRandomAvailableCoordinate = (
  boardSize: number,
  occupiedSpaces: BoardCoordinatesType[] = []
) => {
  // Generate all possible coordinates on the board
  const allCoordinates = [];
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      allCoordinates.push({ x, y });
    }
  }

  // Filter out occupied coordinates
  const availableCoordinates = allCoordinates.filter(
    (coord) => !occupiedSpaces.some(
      (occupied) => occupied.x === coord.x && occupied.y === coord.y
    )
  );

  // If no available coordinates, return null
  if (availableCoordinates.length === 0) {
    return null;
  }

  // Get a random index from available coordinates
  const randomIndex = getRandomInt(0, availableCoordinates.length - 1);
  // Return a random available coordinate
  return availableCoordinates[randomIndex];
};




/**
 * Initializes the snake and food coordinates on the board.
 * 
 * @param boardSize - The size of the board.
 * @param obstruction - An array of coordinates that are obstructed.
 * @returns An object with the initial snake and food coordinates.
 */
export const initializeSnakeAndFood = (
  boardSize: number,
  obstruction: BoardCoordinatesType[]
) => {
  // Get a random available coordinate for the snake head
  let initialSnake: BoardCoordinatesType = getRandomAvailableCoordinate(
    boardSize,
    obstruction
  ) || { x: 0, y: 0 };
  
  // Get a random available coordinate for the food
  let initialFood: BoardCoordinatesType = getRandomAvailableCoordinate(
    boardSize,
    obstruction
  ) || { x: boardSize - 1, y: boardSize - 2 };
  
  // Ensure snake head and food are not at the same coordinates
  while (
    initialSnake.x === initialFood.x &&
    initialSnake.y === initialFood.y
  ) {
    // If they are the same, generate new coordinates
    initialSnake = getRandomAvailableCoordinate(boardSize, obstruction) || {
      x: 0,
      y: 0,
    };
    initialFood = getRandomAvailableCoordinate(boardSize, obstruction) || {
      x: boardSize - 1,
      y: boardSize - 2,
    };
  }
  
  // Return the initial snake and food coordinates
  return { initialSnake, initialFood };
};




/**
 * Function to increment (decrease) the speed based on score conditions.
 *
 * @param speed - The current speed of the game. It should be greater than a predefined threshold for reduction to occur.
 * @param score - The current score of the game. It is used to determine if the speed should be reduced.
 * 
 * @returns The updated speed after reduction if conditions are met, otherwise `undefined` if no change occurs.
 * 
 * This function decreases the speed by 20 if:
 * - The current speed is greater than the minimum threshold (defined as 100).
 * - The score is greater than 0.
 * - The score is a multiple of 5.
 */
export const speedIncrement = (speed: number, score: number): number => {
  // Minimum threshold speed to prevent speed from going below a certain value
  const MIN_THRESHOLD_SPEED = 100;

  // Check if the current speed is greater than the minimum threshold,
  // the score is greater than 0, and the score is a multiple of 5
  if ((speed > MIN_THRESHOLD_SPEED) && (score > 0) && (score % 5 === 0)) {
    // If all conditions are met, decrease the speed by 20
    return speed - 20;
  }

  return speed
};





/**
 * Creates a 2D board with the given size.
 * 
 * @param boardSize - The size of the board.
 * @returns A 2D array representing the board.
 */
export const createBoard = (boardSize: number) => {
  // Initialize an empty board
  const board = [];

  // Loop through each row
  for (let row = 0; row < boardSize; row++) {
    // Initialize a new row
    const currentRow = [];

    // Loop through each column
    for (let col = 0; col < boardSize; col++) {
      // Create a unique cell identifier using row and column indices
      currentRow.push(`${row}${col}`);
    }
    // Add the row to the board
    board.push(currentRow);
  }

  // Return the completed board
  return board;
};







