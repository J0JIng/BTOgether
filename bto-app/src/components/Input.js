import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const Input = ({ name, defaultValue, placeholder, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event); // Pass the event to the parent component if needed
  };

  return (
    <select
      name={name}
      value={value}
      onChange={handleChange}
      className="flex items-center justify-left w-full py-2 pl-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="">Select an option</option>
      <option value="Transportation view">Transportation view</option>
      <option value="Amenities view">Amenities view</option>
    </select>
  );
};

export default Input;
