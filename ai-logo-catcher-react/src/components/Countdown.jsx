import React from 'react';

function Countdown({ countdownValue }) {
  // App.jsx's conditional rendering handles visibility.
  // The onCountdownEnd is handled by App.jsx's timer logic.
  // This component is purely presentational for the countdown value.
  
  const textClass = countdownValue === "Go!" 
    ? "text-green-400 animate-pulse" // "Go!" specific style
    : "text-white animate-ping"; // Style for numbers 3, 2, 1

  return (
    <div 
      id="countdown" 
      className="countdown fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-40"
    >
      <p className={`text-9xl font-bold ${textClass}`}>{countdownValue}</p>
    </div>
  );
}

export default Countdown;
