import React, { useState, useEffect } from "react";

const Timer = ({ value }) => {
  // State variables for the hours, minutes, and seconds
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [borderColor, setBorderColor] = useState("");

  // Effect to update the timer values and border color when the value changes
  useEffect(() => {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    // Update state variables
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);

    // Determine border color based on time
    if (value < 25 * 60) {
      setBorderColor("bg-green-100 ring-green-500");
    } else if (value < 50 * 60) {
      setBorderColor("bg-blue-100 ring-blue-500");
    } else {
      setBorderColor("bg-red-100 ring-red-500");
    }
  }, [value]);

  return (
    <div
      className={`w-48 p-4 bg-gray-100 rounded-lg shadow-md ring-8 ${borderColor}`}
    >
      {/* Timer display */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Hours */}
          <span className="text-3xl font-bold">
            {hours < 10 ? `0${hours}` : hours}
          </span>
          <span className="text-sm">Hours</span>
        </div>
        <span className="mx-2 text-3xl">:</span>
        <div className="flex flex-col items-center">
          {/* Minutes */}
          <span className="text-3xl font-bold">
            {minutes < 10 ? `0${minutes}` : minutes}
          </span>
          <span className="text-sm">Minutes</span>
        </div>
        <span className="mx-2 text-3xl">:</span>
        <div className="flex flex-col items-center">
          {/* Seconds */}
          <span className="text-3xl font-bold">
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
          <span className="text-sm">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
