/**
 * Returns a random integer between the given min and max values, inclusive.
 *
 * @param min - The minimum integer value.
 * @param max - The maximum integer value.
 * @returns A random integer between min and max, inclusive.
 */
const getRandomInt = (min: number, max: number): number => {
    // Ensure min is less than or equal to max
    if (min > max) {
      throw new Error('Minimum value must be less than or equal to maximum value.');
    }
  
    // Generate a random integer between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  

export default getRandomInt;
  