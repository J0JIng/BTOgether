import React, { useState } from 'react';
import "tailwindcss/tailwind.css";

const Input = ({ name, defaultValue, placeholder, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event); // Pass the event to the parent component if needed
  };

  return (
    <input
      type="text" // Specify input type
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      className="border p-2 w-full rounded-lg shadow-lg hover:shadow-xl"
    />
  );
};

export default Input;
