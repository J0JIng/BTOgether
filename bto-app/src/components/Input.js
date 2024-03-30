import React from 'react';

const Input = ({ name, value, placeholder, onChange }) => {
  return (
    React.createElement('input', {
      name: name,
      value: value,
      placeholder: placeholder,
      onChange: onChange,
      className: 'border p-2 w-full rounded-lg shadow-lg hover:shadow-xl'
    })
  );
};

export default Input;

