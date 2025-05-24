// import React from 'react';

function GameHeader() {
  return (
    <div 
      id="gameHeader"
      className="game-header fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-80 p-3 shadow-lg z-30 flex justify-between items-center hidden" // Initially hidden
    >
      <div className="score text-2xl font-bold text-white">
        Score: <span id="scoreValue">0</span>
      </div>
      <img src="/images/oll.png" alt="Outskill Logo" className="header-logo w-12 h-12" />
      <div className="lives text-xl text-white">
        Lives: 
        <span id="livesContainer" className="ml-2">
          {/* Placeholder for lives icons/text - will be dynamically generated */}
          <span className="life text-red-500">●</span>
          <span className="life text-red-500">●</span>
          <span className="life text-red-500">●</span>
        </span>
      </div>
    </div>
  );
}

export default GameHeader;
