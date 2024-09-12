import  { useRef, useEffect, useState, useCallback } from 'react';
import { BoardCoordinatesType, SnakeBodyType } from '../../../../types/types';

interface CanvasProps {
  BOARD: string[][];
  snakeBody: SnakeBodyType;
  food: BoardCoordinatesType;
  obstructedCells?: BoardCoordinatesType[];
  snakeHeadColor?: string;
  snakeBodyColor?: string;
  foodColor?: string;
  obstructionColor?: string;
  gridLineColor?: string;
}

function CanvasBoard ({
  BOARD,
  snakeBody,
  food,
  obstructedCells = [],
  snakeHeadColor = 'lightgreen',
  snakeBodyColor = 'blue',
  foodColor = 'orange',
  obstructionColor = 'black',
  gridLineColor = 'grey'
 }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState<number>(0);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const animationFrameId = useRef<number | null>(null);

  // Simplified pixel ratio calculation
  const getPixelRatio = (): number => {
    return window.devicePixelRatio || 1;
  };

  // Update canvas size based on container size
  const updateCanvasSize = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const cols = BOARD[0].length;
      const rows = BOARD.length;

      // Calculate cell size to fit the container
      const cellSizeX = containerWidth / cols;
      const cellSizeY = containerHeight / rows;
      const newCellSize = parseFloat(Math.min(cellSizeX, cellSizeY).toFixed(4));

      setCellSize(newCellSize);
      setCanvasSize({
        width: cols * newCellSize,
        height: rows * newCellSize
      });
    }
  }, [BOARD]);

  // Main drawing function
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const pixelRatio = getPixelRatio();
        const cols = BOARD[0].length;
        const rows = BOARD.length;

        // Set canvas size with pixel ratio
        canvas.width = canvasSize.width * pixelRatio;
        canvas.height = canvasSize.height * pixelRatio;
        canvas.style.width = `${canvasSize.width}px`;
        canvas.style.height = `${canvasSize.height}px`;

        // Scale context for high DPI displays
        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.strokeStyle = gridLineColor;
        ctx.lineWidth = 1;
        for (let x = 0; x <= cols; x++) {
          ctx.beginPath();
          ctx.moveTo(x * cellSize, 0);
          ctx.lineTo(x * cellSize, rows * cellSize);
          ctx.stroke();
        }
        for (let y = 0; y <= rows; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * cellSize);
          ctx.lineTo(cols * cellSize, y * cellSize);
          ctx.stroke();
        } 

        // Draw obstructed cells
        obstructedCells.forEach(obstruct => {
          ctx.fillStyle = obstructionColor;
          const padding = cellSize * 0.1; // 10% padding
          const roundness = cellSize * 0.2; // 20% corner radius
          ctx.beginPath();
          ctx.roundRect(
            obstruct.y * cellSize + padding,
            obstruct.x * cellSize + padding,
            cellSize - 2 * padding,
            cellSize - 2 * padding,
            roundness
          );
          ctx.fill();
        });

        // Draw snake body
        snakeBody.forEach((bodyPart, index) => {
          const isHead = index === snakeBody.length - 1;
          ctx.fillStyle = isHead ? snakeHeadColor : snakeBodyColor;
          ctx.fillRect(bodyPart.y * cellSize, bodyPart.x * cellSize, cellSize, cellSize);
        });

        // Draw food
        if (food.x >= 0 && food.y >= 0 && food.x < rows && food.y < cols) {
          ctx.fillStyle = foodColor;
          ctx.beginPath();
          ctx.arc(
            food.y * cellSize + cellSize / 2,
            food.x * cellSize + cellSize / 2,
            cellSize / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }, [cellSize, snakeBody, food,canvasSize]);

  // Animation loop
  const animate = useCallback(() => {
    drawCanvas();
    animationFrameId.current = requestAnimationFrame(animate);
  }, [drawCanvas]);

  // Handle window resize
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // Start animation when cellSize is set
  useEffect(() => {
    if (cellSize > 0) {
      animate();
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate, cellSize]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block',
          margin: 'auto',
          maxWidth: '100%',
          maxHeight: '100%'
        }} 
      />
    </div>
  );
};

export default CanvasBoard;