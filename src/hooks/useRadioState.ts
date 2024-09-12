import { useState, ChangeEvent } from 'react';

/**
 * Custom hook to manage the state of a radio input group.
 * It supports both string and number types for selected values.
 *
 * @template T - The type of the radio button value (either string or number).
 *
 * @param {T} initialValue - The initial selected value for the radio button group.
 *
 * @returns {[T, (event: ChangeEvent<HTMLInputElement>) => void]} -
 * A tuple with the current selected value and a change handler for updating the state.
 */
function useRadioState<T extends string | number>(initialValue: T): [T, (event: ChangeEvent<HTMLInputElement>) => void] {
  const [selectedValue, setSelectedValue] = useState<T>(initialValue);

  /**
   * Handler function to update the selected radio button value.
   * Converts the value to the appropriate type (string or number) based on the initial value's type.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event from the radio input.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Convert value based on the type of T (string or number)
    if (typeof initialValue === 'number') {
      setSelectedValue(Number(value) as T);
    } else {
      setSelectedValue(value as T);
    }
  };

  return [selectedValue, handleChange];
}

export default useRadioState;
