import React from 'react';

interface RadioSelectProps {
  name: string; // Radio group name
  value: string; // Radio button value
  displayName: string; // Label text
  selectedValue: string; // Currently selected value
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Change event handler
}


function RadioSelect({ name, value, displayName, selectedValue, onChange }: RadioSelectProps) {
  return (
    <div>
      <input
        type="radio"
        id={value} // ID for label association
        name={name} // Group name for radio buttons
        value={value} // Radio button value
        className="hidden peer" // Hide input element
        checked={value === selectedValue} // Check if this value is selected
        onChange={onChange} // Handle change events
      />
      <label
        htmlFor={value} // Associate label with input
        className="block px-2 py-1 bg-primary border-transparent border-2 rounded-md cursor-pointer peer-checked:border-accent peer-checked:opacity-80">
        <h3 className="font-primary text-lg md:text-xl text-accent tracking-wider">
          {displayName}
        </h3>
      </label>
    </div>
  );
}

export default RadioSelect;
