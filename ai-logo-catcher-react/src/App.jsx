import React, { useState, useEffect, useRef } from 'react';

import StartScreen from './components/StartScreen';
import Countdown from './components/Countdown';
import GameHeader from './components/GameHeader';
import GameArea from './components/GameArea';
import Catcher from './components/Catcher';
import GameOverScreen from './components/GameOverScreen';
import SoundToggle from './components/SoundToggle';
import Tooltip from './components/Tooltip';

// Assuming gameData.js might be needed for initial settings like lives
import { gameSettings, soundFiles } from '../gameData'; // Adjust path if necessary, import soundFiles

import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(gameSettings.initialLives || 3);
  const [gameActive, setGameActive] = useState(false); // Will be true when currentScreen is 'game'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [catcherPosition, setCatcherPosition] = useState(50); // Percentage
  const [fallingItems, setFallingItems] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'countdown', 'game', 'gameOver'
  const [countdownValue, setCountdownValue] = useState(3); // Or empty string, depends on Countdown component logic
  const [tooltip, setTooltip] = useState({ text: '', visible: false, x: 0, y: 0 });
  const tooltipTimeoutRef = useRef(null); // Ref for the tooltip timeout
  const [gameSpeed, setGameSpeed] = useState(gameSettings.logoFallSpeed || 1); // Initial game speed from gameSettings
  const gameSpeedIncreaseIntervalRef = useRef(null); // Ref for game speed interval
  const [isShaking, setIsShaking] = useState(false); // State for screen shake

  // Audio Refs
  const catchSoundRef = useRef(null);
  const hitSoundRef = useRef(null);
  const gameoverSoundRef = useRef(null);
  const audioContextInitialized = useRef(false); // To ensure audio context is initialized only once by user gesture

  useEffect(() => {
    // Initialize Audio objects on component mount
    // These paths are placeholders; actual files would be in /public/sounds/
    catchSoundRef.current = new Audio(soundFiles.catch);
    hitSoundRef.current = new Audio(soundFiles.hit);
    gameoverSoundRef.current = new Audio(soundFiles.gameover);
  }, []);

  const playSound = (soundName) => {
    if (!soundEnabled || !audioContextInitialized.current) return;

    let soundToPlay;
    if (soundName === 'catch' && catchSoundRef.current) {
      soundToPlay = catchSoundRef.current;
    } else if (soundName === 'hit' && hitSoundRef.current) {
      soundToPlay = hitSoundRef.current;
    } else if (soundName === 'gameover' && gameoverSoundRef.current) {
      soundToPlay = gameoverSoundRef.current;
    }

    if (soundToPlay) {
      soundToPlay.currentTime = 0; // Rewind to start
      soundToPlay.play().catch(error => console.warn("Audio play failed for", soundName, ":", error));
    }
  };
  
  const initAudioContext = () => {
    if (!audioContextInitialized.current) {
      // Attempt to play and pause a sound to "unlock" audio on some browsers
      const sounds = [catchSoundRef.current, hitSoundRef.current, gameoverSoundRef.current];
      sounds.forEach(sound => {
        if (sound && sound.paused) {
          sound.play().then(() => sound.pause()).catch(() => {});
        }
      });
      audioContextInitialized.current = true;
      // console.log("Audio context initialized by user gesture.");
    }
  };

  // Game Speed Increase Effect
  useEffect(() => {
    if (gameActive) {
      gameSpeedIncreaseIntervalRef.current = setInterval(() => {
        setGameSpeed(prevSpeed => parseFloat((prevSpeed + (gameSettings.speedIncreaseAmount || 0.1)).toFixed(2)));
      }, gameSettings.speedIncreaseInterval || 10000); // Every 10 seconds
    } else {
      if (gameSpeedIncreaseIntervalRef.current) {
        clearInterval(gameSpeedIncreaseIntervalRef.current);
      }
    }
    return () => {
      if (gameSpeedIncreaseIntervalRef.current) {
        clearInterval(gameSpeedIncreaseIntervalRef.current);
      }
    };
  }, [gameActive]);

  // Game Over Effect
  React.useEffect(() => {
    if (lives <= 0) {
      setGameActive(false);
      setCurrentScreen('gameOver');
      playSound('gameover'); // Play game over sound
      // console.log("Game Over! Lives reached 0.");
    }
  }, [lives, soundEnabled]); // Ensure playSound is effective if soundEnabled changes

  const initializeMainGame = () => {
    // console.log('Initializing main game...');
    setScore(0);
    setLives(gameSettings.initialLives || 3);
    setFallingItems([]);
    setCatcherPosition(50);
    setGameSpeed(gameSettings.logoFallSpeed || 1); // Reset game speed
    setGameActive(true);
    setCurrentScreen('game');
  };
  
  const handleStartGame = () => {
    initAudioContext(); // Call this once after the first user gesture to enable audio
    // console.log('Starting game sequence...');
    setCurrentScreen('countdown');
    setCountdownValue(3); // Reset countdown value
    
    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      setCountdownValue(count);
      if (count === 0) {
        clearInterval(timer);
        setCountdownValue("Go!"); // Or handle "Go!" display differently
        setTimeout(() => { // Brief "Go!" display
            initializeMainGame();
        }, 500); // Show "Go!" for 0.5s
      }
    }, 1000);
  };

  const handleResetGame = () => {
    // console.log('Resetting game...');
    setScore(0);
    setLives(gameSettings.initialLives || 3);
    setFallingItems([]);
    setGameActive(false);
    setCurrentScreen('start');
    setGameSpeed(gameSettings.logoFallSpeed || 1);
    setCatcherPosition(50);
    setCountdownValue(3); // Reset for next game start
  };
  
  // These functions are passed to GameArea for collision handling
  const updateScore = (points) => {
    setScore(prevScore => prevScore + points);
  };

  const loseLife = () => {
    setLives(prevLives => prevLives - 1);
  };
  
  // Updated showTooltip function
  const showTooltip = (text, itemRect) => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    // Calculate position for the tooltip
    // Assuming itemRect is from getBoundingClientRect(), which is viewport-relative.
    // Tooltip is also fixed/absolute positioned relative to viewport or a full-screen container.
    const xPos = itemRect.left; // Position at the left of the item
    const yPos = itemRect.top - 40; // Position 40px above the item

    setTooltip({ text, x: xPos, y: yPos, visible: true });

    // Set a new timeout to hide the tooltip
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltip(prev => ({ ...prev, visible: false }));
    }, 2000); // Hide after 2 seconds
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 300); // Duration of the shake animation (must match CSS)
  };


  return (
    <div className={`game-container bg-gray-900 text-white min-h-screen md:h-[calc(100vh-40px)] flex flex-col items-center justify-center p-0 overflow-hidden relative ${isShaking ? 'shake' : ''} md:max-w-lg md:mx-auto md:shadow-xl md:rounded-lg md:mt-5`}>
      <SoundToggle soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />
      <Tooltip text={tooltip.text} visible={tooltip.visible} x={tooltip.x} y={tooltip.y} />

      {currentScreen === 'start' && (
        <StartScreen 
          onStartGame={handleStartGame} 
        />
      )}

      {currentScreen === 'countdown' && (
        <Countdown 
          countdownValue={countdownValue} 
          setCountdownValue={setCountdownValue} // If countdown logic is internal to Countdown
          onCountdownEnd={initializeMainGame} // Call initializeMainGame when countdown ends
        />
      )}

      {/* GameHeader is visible during countdown and game */}
      {(currentScreen === 'game' || currentScreen === 'countdown') && (
        <GameHeader 
          score={score} 
          lives={lives} 
        />
      )}
      
      {/* GameArea is only active and visible during 'game' screen */}
      {/* It's rendered but hidden during 'countdown' to pre-load if necessary, or could be conditional */}
      {(currentScreen === 'game' || currentScreen === 'countdown') && (
          <GameArea
            gameActive={currentScreen === 'game' && gameActive} // Only truly active when screen is 'game'
            catcherPosition={catcherPosition}
            setCatcherPosition={setCatcherPosition}
            fallingItems={fallingItems}
            setFallingItems={setFallingItems}
            gameSpeed={gameSpeed}
            setScore={updateScore} // Pass setScore for collision
            setLives={loseLife}   // Pass setLives for collision
            showTooltip={showTooltip}
            playSound={playSound} // Pass playSound to GameArea
            triggerShake={triggerShake} // Pass triggerShake to GameArea
            // Catcher is rendered within GameArea
          />
      )}

      {currentScreen === 'gameOver' && (
        <GameOverScreen 
          finalScore={score} 
          onReplay={handleResetGame} // Use handleResetGame
        />
      )}
    </div>
  );
}

export default App;
