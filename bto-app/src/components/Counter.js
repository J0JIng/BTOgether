import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../css/global.css";

/**
 * Counter component with circular display and a ring effect.
 *
 * @param {Object} props - Props passed to the Counter component.
 * @param {number} props.value - The value to be displayed in the counter.
 *
 * @returns {JSX.Element} - Returns the JSX representation of the Counter component.
 */
const Counter = ({ value }) => {
  // State variable for the counter value
  const [count, setCount] = useState(value);

  // Effect to update the counter value when it changes
  useEffect(() => {
    setCount(value);
  }, [value]);

  // Define color based on count value
  let colorClass = "";
  if (count < 1) {
    colorClass = "bg-red-400 ring-red-500";
  } else if (count > 5) {
    colorClass = "bg-green-400 ring-green-500";
  } else {
    colorClass = "bg-blue-400 ring-blue-500";
  }

  return (
    <div>
      {/* Circular display for the counter value */}
      <div
        className={`rounded-full w-28 h-28 flex items-center justify-center relative ring-8 ${colorClass}`}
      >
        {/* Counter value */}
        <span className="text-4xl text-white">{count}</span>
      </div>
    </div>
  );
};

// Prop types validation
Counter.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Counter;
