import { useState } from 'react';

/**
 * Custom hook to manage state with localStorage
 * @param {string} key - The key for localStorage
 * @param {T} initialValue - Initial state value
 * @returns {[T, Function, Function]} - The current state, a function to update it, and a function to remove the item
 */
const useLocalStorage = <T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>, () => void] => {
  // Retrieve the stored value or use the initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get the stored value from localStorage
      const item = window.localStorage.getItem(key);
      // If the stored value exists, parse it as JSON, otherwise use the initial value
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Log any errors reading from localStorage
      console.error(`Error reading localStorage key "${key}":`, error);
      // Fallback to the initial value if there's an error
      return initialValue;
    }
  });

  // Function to update the stored value
  const setValue = (value: T | ((prevState: T) => T)) => {
    try {
      // Allow value to be a function for the same API as useState
      const valueToStore = value instanceof Function ? (value as (prevState: T) => T)(storedValue) : value;
      // Update the state and localStorage
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Log any errors setting the localStorage value
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to remove the item from localStorage
  const remove = () => {
    try {
      // Remove the item from localStorage
      window.localStorage.removeItem(key);
      // Reset the state to the initial value after removal
      setStoredValue(initialValue);
    } catch (error) {
      // Log any errors removing the localStorage value
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Return the current state, update function, and remove function
  return [storedValue, setValue, remove];
};

export default useLocalStorage;