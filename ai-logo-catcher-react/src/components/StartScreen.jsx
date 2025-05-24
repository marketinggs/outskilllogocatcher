import React from 'react';

function StartScreen({ onStartGame }) {
  // App.jsx's conditional rendering handles visibility.
  return (
    <div className="start-screen-container fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <div className="start-screen bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-lg w-full">
        <img src="/images/oll.png" alt="Outskill Logo" className="w-32 h-32 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-6">AI Logo Catcher</h1>
        
        <div className="how-to-play bg-gray-700 p-6 rounded-md mb-8 text-left">
          <h2 className="text-2xl font-semibold text-white mb-3">How to Play:</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Move the catcher with your mouse or arrow keys.</li>
            <li>Catch the falling AI product logos to score points.</li>
            <li>Avoid the red obstacles! Each hit costs a life.</li>
            <li>The game speeds up over time.</li>
            <li>Three misses (lives lost) and it's game over.</li>
          </ul>
        </div>
        
        <button 
          id="startButton" 
          onClick={onStartGame}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-150 ease-in-out transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
