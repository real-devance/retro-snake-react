import { useRef, useEffect } from "react";

// Custom hook to run a function repeatedly using Request Animation Frame (RAF)
function useRAF(
  callback: () => void, // Function to run repeatedly
  interval: number = 500, // Interval between runs (default: 500ms)
  isPaused: boolean = false, // Flag to pause the loop
  cancel: boolean = false, // Flag to cancel the loop
  clearCallback?: () => void // Optional clear callback for cleanup
) {
  // Refs to store values that persist across renders
  const lastTimeRef = useRef<number>(0); // Last time the callback ran
  const rafIdRef = useRef<number | null>(null); // Current RAF id
  const callbackRef = useRef(callback); // Latest callback function
  const clearCallbackRef = useRef(clearCallback); // Latest clear callback function

  // Update callbackRef whenever callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up RAF loop
  useEffect(() => {
    const rafLoop = (time: number) => {
      // Check if loop should run based on isPaused and cancel
      if (!isPaused && !cancel && time - lastTimeRef.current >= interval) {
        callbackRef.current(); // Run the callback
        lastTimeRef.current = time; // Update last time
      }
      // Continue the loop if not canceled
      if (!cancel) {
        rafIdRef.current = requestAnimationFrame(rafLoop);
      }
    };

    // Start the loop if not paused or canceled
    if (!isPaused && !cancel) {
      lastTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(rafLoop);
    }

    // Cleanup function to cancel RAF loop when component unmounts or canceled
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [interval, isPaused]);

  // Ensure cleanup only when component unmounts or cancel changes
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (clearCallbackRef.current) {
        clearCallbackRef.current();
      }
    };
  }, [cancel]);
}

export default useRAF;