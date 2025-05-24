import React from 'react';

function SoundToggle({ soundEnabled, setSoundEnabled }) {
  const handleToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <button 
      id="soundToggle"
      onClick={handleToggle}
      className="sound-toggle fixed bottom-4 right-4 bg-gray-700 hover:bg-gray-600 text-white font-bold p-3 rounded-full shadow-lg z-50 transition-colors duration-150 ease-in-out"
      title={soundEnabled ? "Mute Sound" : "Unmute Sound"}
    >
      {soundEnabled ? (
        // Speaker On Icon (example)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
        </svg>
      ) : (
        // Speaker Off Icon (example)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2L17 10m2 2l2 2" />
        </svg>
      )}
    </button>
  );
}

export default SoundToggle;
