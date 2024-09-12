import { describe, it, expect } from 'vitest';

import { foodPlacement, checkFoodConsumption, checkCollideWithItSelf, checkValidMove, getRandomAvailableCoordinate, checkCollideWithBoundary, checkCollideWithObstruction, checkGameOver } from '../../utils/gameLogic'; // Adjust the import path as necessary
import { BoardCoordinatesType, SnakeBodyType} from "../../types/types";
import { isWithinRange } from '../utils/testUtils';


const BOARD_SIZE: number = 20;



describe('getRandomAvailableCoordinate', () => {
  // Test when there are available coordinates within bounds
  it('should return a coordinate within board bounds that is not occupied', () => {
    const boardSize = 5;
    const occupiedSpaces: BoardCoordinatesType[] = [{ x: 1, y: 1 }, { x: 2, y: 2 }];
    const result = getRandomAvailableCoordinate(boardSize, occupiedSpaces);

    if (result) {
      expect(isWithinRange(result.x, 0, boardSize)).toBe(true);
      expect(isWithinRange(result.y, 0, boardSize)).toBe(true);
      expect(occupiedSpaces).not.toContainEqual(result); // Coordinate should not be occupied
    }
  });

  // Test when all coordinates are occupied
  it('should return null if all coordinates are occupied', () => {
    const boardSize = 2;
    const occupiedSpaces: BoardCoordinatesType[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ];
    const result = getRandomAvailableCoordinate(boardSize, occupiedSpaces);
    expect(result).toBeNull(); // No available coordinates
  });

  // Test when no spaces are occupied
  it('should return a valid coordinate when no spaces are occupied', () => {
    const boardSize = 3;
    const occupiedSpaces: BoardCoordinatesType[] = [];
    const result = getRandomAvailableCoordinate(boardSize, occupiedSpaces);

    expect(result).not.toBeNull();
    if (result) {
      expect(isWithinRange(result.x, 0, boardSize)).toBe(true);
      expect(isWithinRange(result.y, 0, boardSize)).toBe(true);
    }
  });
});


describe('foodPlacement', () => {

  // Helper function to check if the coordinate is valid
  const checkCoordinate = (coord: BoardCoordinatesType, snakeBody: SnakeBodyType, blockedObjects: BoardCoordinatesType[]) => {
    expect(isWithinRange(coord.x, 0, BOARD_SIZE)).toBe(true); // Check x within range
    expect(isWithinRange(coord.y, 0, BOARD_SIZE)).toBe(true); // Check y within range
    expect(snakeBody.every(cell => cell.x !== coord.x || cell.y !== coord.y)).toBe(true); // Not overlapping snake
    expect(blockedObjects.every(obj => obj.x !== coord.x || obj.y !== coord.y)).toBe(true); // Not overlapping blocked objects
  };

  const snakeBody = [{ x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }];
  const obstruction: BoardCoordinatesType[] = [{ x: 3, y: 3 }, { x: 3, y: 4 }, { x: 2, y: 6 }];

  it('should generate valid food coordinates not overlapping with snake and blocked objects', () => {
    const food = foodPlacement(snakeBody, BOARD_SIZE, obstruction);
    checkCoordinate(food, snakeBody, obstruction);
  });

  it('should handle an empty blockedObjects array', () => {
    const food = foodPlacement(snakeBody, BOARD_SIZE, []);
    checkCoordinate(food, snakeBody, obstruction);
  });

  it('should generate valid coordinates on a crowded board', () => {
    const crowdedSnakeBody: SnakeBodyType = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 0 }));
    const crowdedObstruction: BoardCoordinatesType[] = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 1 }));
    const food = foodPlacement(crowdedSnakeBody, BOARD_SIZE, crowdedObstruction);
    checkCoordinate(food, crowdedSnakeBody, crowdedObstruction);
  });
});


describe('checkFoodConsumption', () => {

  // Define the snake body and head
  const snakeBody = [{ x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }];
  const snakeHead = snakeBody[snakeBody.length - 1];

  // Test when the snake head is at the same position as the food
  it('should return true when the snake head is at the same position as the food', () => {
    const food = snakeHead;
    const isFood = checkFoodConsumption(snakeHead, food);
    expect(isFood).toBe(true); // Expect true if snake head and food are the same
  });

  // Test when the snake head is not at the same position as the food
  it('should return false when the snake head is not at the same position as the food', () => {
    const food = { x: 2, y: 8 };
    const isFood = checkFoodConsumption(snakeHead, food);
    expect(isFood).toBe(false); // Expect false if snake head and food are different
  });

});



describe('checkCollideWithItSelf', () => {

  // Test when the snake head collides with its body (excluding itself)
  it('should return true when the snake head collides with its body (excluding itself)', () => {
    const snakeHead = { x: 2, y: 4 };
    const snakeBody = [
      { x: 1, y: 4 },
      { x: 2, y: 4 },  // Collide Part
      { x: 3, y: 4 }
    ];
    const result = checkCollideWithItSelf(snakeHead, snakeBody);
    expect(result).toBe(true); // Expect true as head collides with the body
  });

  // Test when the snake head does not collide with its body
  it('should return false when the snake head does not collide with its body', () => {
    const snakeHead = { x: 2, y: 4 };
    const snakeBody = [
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 4 },
      { x: 2, y: 4 } // Head
    ];
    const result = checkCollideWithItSelf(snakeHead, snakeBody);
    expect(result).toBe(false); // Expect false as head does not collide with the body
  });

  // Test when there is only the head in the body
  it('should return false when there is only the head in the body', () => {
    const snakeHead = { x: 3, y: 4 };
    const snakeBody = [{ x: 3, y: 4 }]; // Only the head is present
    const result = checkCollideWithItSelf(snakeHead, snakeBody);
    expect(result).toBe(false); // Expect false as there's no body to collide with
  });

});



describe('checkCollideWithBoundary', () => {

  // Test when the snake head is within the boundaries
  it('should return false if the snake head is within the boundaries', () => {
    const snakeHead = { x: 5, y: 5 };
    const result = checkCollideWithBoundary(snakeHead, BOARD_SIZE);
    expect(result).toBe(false);  // No collision expected
  });

  // Test when the snake head is outside the left boundary
  it('should return true if the snake head is outside the left boundary', () => {
    const snakeHead = { x: -1, y: 2 };
    const result = checkCollideWithBoundary(snakeHead, BOARD_SIZE);
    expect(result).toBe(true);  // Collision expected
  });

  // Test when the snake head is outside the right boundary
  it('should return true if the snake head is outside the right boundary', () => {
    const snakeHead = { x: BOARD_SIZE, y: 5 };
    const result = checkCollideWithBoundary(snakeHead, BOARD_SIZE);
    expect(result).toBe(true);  // Collision expected
  });

  // Test when the snake head is outside the top boundary
  it('should return true if the snake head is outside the top boundary', () => {
    const snakeHead = { x: 5, y: -1 };
    const result = checkCollideWithBoundary(snakeHead, BOARD_SIZE);
    expect(result).toBe(true);  // Collision expected
  });

  // Test when the snake head is outside the bottom boundary
  it('should return true if the snake head is outside the bottom boundary', () => {
    const snakeHead = { x: 5, y: BOARD_SIZE };
    const result = checkCollideWithBoundary(snakeHead, BOARD_SIZE);
    expect(result).toBe(true);  // Collision expected
  });

});



describe('checkCollideWithObstruction', () => {

  // Test when the snake head collides with an obstruction
  it('should return true if the snake head collides with an obstruction', () => {
    const snakeHead = { x: 4, y: 5 };
    const obstructedCells = [
      { x: 2, y: 3 },
      { x: 4, y: 5 }, // Collision expected here
      { x: 6, y: 7 }
    ];
    const result = checkCollideWithObstruction(snakeHead, obstructedCells);
    expect(result).toBe(true);  // Collision expected
  });

  // Test when the snake head does not collide with any obstruction
  it('should return false if the snake head does not collide with any obstruction', () => {
    const snakeHead = { x: 1, y: 1 };
    const obstructedCells = [
      { x: 2, y: 3 },
      { x: 4, y: 5 },
      { x: 6, y: 7 }
    ];
    const result = checkCollideWithObstruction(snakeHead, obstructedCells);
    expect(result).toBe(false);  // No collision expected
  });

  // Test when there are no obstructed cells
  it('should return false if there are no obstructed cells', () => {
    const snakeHead = { x: 5, y: 5 };
    const obstructedCells: BoardCoordinatesType[] = []; // No obstructions
    const result = checkCollideWithObstruction(snakeHead, obstructedCells);
    expect(result).toBe(false);  // No collision expected
  });

});



describe('checkGameOver', () => {

  // Test when the snake head collides with the boundary
  it('should return true if the snake head collides with the boundary', () => {
    const snakeHead: BoardCoordinatesType = { x: -1, y: 5 }; // Outside boundary
    const snakeBody: SnakeBodyType = [{ x: 0, y: 5 }, { x: -1, y: 5 }];
    const obstructedCells: BoardCoordinatesType[] = [];
    
    const result = checkGameOver(snakeHead, snakeBody, BOARD_SIZE, obstructedCells);
    expect(result).toBe(true); // Collision with boundary
  });

  // Test when the snake head collides with itself
  it('should return true if the snake head collides with itself', () => {
    const snakeHead: BoardCoordinatesType = { x: 5, y: 5 };
    const snakeBody: SnakeBodyType = [
      { x: 5, y: 5 }, // Head collides with itself
      { x: 4, y: 5 },
    ];
    const obstructedCells: BoardCoordinatesType[] = [];
    
    const result = checkGameOver(snakeHead, snakeBody, BOARD_SIZE, obstructedCells);
    expect(result).toBe(true); // Collision with itself
  });

  // Test when the snake head collides with an obstruction
  it('should return true if the snake head collides with an obstruction', () => {
    const snakeHead: BoardCoordinatesType = { x: 5, y: 5 };
    const snakeBody: SnakeBodyType = [{ x: 4, y: 5 }, { x: 5, y: 5 }];
    const obstructedCells: BoardCoordinatesType[] = [
      { x: 5, y: 5 }, // Head collides with obstruction
    ];
    
    const result = checkGameOver(snakeHead, snakeBody, BOARD_SIZE, obstructedCells);
    expect(result).toBe(true); // Collision with obstruction
  });

  // Test when there are no collisions
  it('should return false if the snake head is within the boundaries, does not collide with itself, and is not on an obstruction', () => {
    const snakeHead: BoardCoordinatesType = { x: 5, y: 5 };
    const snakeBody: SnakeBodyType = [
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    const obstructedCells: BoardCoordinatesType[] = [{ x: 1, y: 1 }];
    
    const result = checkGameOver(snakeHead, snakeBody, BOARD_SIZE, obstructedCells);
    expect(result).toBe(false); // No collision with boundary, self, or obstruction
  });

});



describe('checkValidMove', () => {
  // Test invalid moves where the new direction is the opposite of the current direction
  it('should return false when trying to move in the opposite direction of the current direction', () => {
    expect(checkValidMove('up', 'down')).toBe(false);
    expect(checkValidMove('down', 'up')).toBe(false);
    expect(checkValidMove('left', 'right')).toBe(false);
    expect(checkValidMove('right', 'left')).toBe(false);
  });

  // Test valid moves where the new direction is not the opposite of the current direction
  it('should return true for valid direction changes that are not opposites', () => {
    expect(checkValidMove('up', 'left')).toBe(true);
    expect(checkValidMove('up', 'right')).toBe(true);
    expect(checkValidMove('down', 'left')).toBe(true);
    expect(checkValidMove('down', 'right')).toBe(true);
    expect(checkValidMove('left', 'up')).toBe(true);
    expect(checkValidMove('left', 'down')).toBe(true);
    expect(checkValidMove('right', 'up')).toBe(true);
    expect(checkValidMove('right', 'down')).toBe(true);
  });
});
