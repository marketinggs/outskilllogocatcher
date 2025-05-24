import React from 'react';

function GameOverScreen({ finalScore, onReplay }) {
  // App.jsx's conditional rendering handles visibility, so 'hidden' class is not needed here.
  return (
    <div 
      id="gameOverScreen"
      className="game-over-screen fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center z-50 p-4"
    >
      <div className="game-over-content bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-md w-full">
        <h2 className="text-5xl font-bold text-red-500 mb-6">Game Over!</h2>
        <p className="text-2xl text-white mb-4">
          Final Score: <span id="finalScore" className="font-bold">{finalScore}</span>
        </p>
        
        <button 
          id="replayButton"
          onClick={onReplay}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-150 ease-in-out transform hover:scale-105 mb-4 w-full"
        >
          Play Again
        </button>
        
        <button 
          id="workshopButton"
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-150 ease-in-out transform hover:scale-105 mb-4 w-full" // Reduced mb-6 to mb-4
          onClick={() => window.open('https://www.outskill.com', '_blank')}
        >
          Join our 2-Day GenAI Workshop!
        </button>

        <button
          id="shareScoreButton"
          onClick={() => {
            const text = `🎮 Just scored ${finalScore} in AI Logo Catcher! Can you beat me and win a free seat in our 2-day GenAI workshop? 🚀 Play now → ${window.location.href} Tag us with your score + #AILogoChallenge`;
            if (navigator.share) {
              navigator.share({
                text: text,
              }).catch(error => console.warn('Error sharing:', error));
            } else {
              // Fallback to Twitter
              const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
              window.open(twitterUrl, '_blank');
            }
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-150 ease-in-out transform hover:scale-105 mb-6 w-full"
        >
          Share Score
        </button>
        
        {/* Original share prompt can be removed or kept if desired */}
        {/* <div className="share-prompt bg-gray-700 p-4 rounded-md">
          <p className="text-gray-300 mb-2">Enjoyed the game? Share it!</p>
          <p className="text-sm text-gray-400">
            (Social sharing functionality to be added)
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default GameOverScreen;
