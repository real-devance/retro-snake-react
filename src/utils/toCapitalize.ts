/**
 * Capitalizes the first character of a given string.
 *
 * @param {string} str - The input string to be capitalized.
 * @returns {string} The input string with its first character capitalized.
 *
 * @example
 * const result = toCapitalize('hello');
 * console.log(result); // Output: "Hello"
 *
 * @example
 * const result = toCapitalize('');
 * console.log(result); // Output: ""
 */
export const toCapitalize = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };