import React, { useEffect, useRef } from 'react';
import Catcher from './Catcher';
import FallingItem from './FallingItem';
import { aiLogos, obstacleData, gameSettings } from '../gameData'; // Ensure gameSettings is imported

const CATCHER_WIDTH_PERCENT = 10; // Used for catcher movement boundary, not directly for collision rect here
const ITEM_SPAWN_INTERVAL_BASE = 2000;
const ITEM_SIZE_PX = 60; // As per subtask: items are 60x60px
const CATCHER_SIZE_PX = 80; // As per subtask: catcher is 80x80px (w-20 h-20 in Catcher.jsx)

function GameArea({ 
  gameActive, 
  catcherPosition, 
  setCatcherPosition, 
  fallingItems,
  setFallingItems,
  gameSpeed,
  setScore, // Prop from App.jsx
  setLives, // Prop from App.jsx
  playSound, // Prop from App.jsx
  showTooltip, // Prop from App.jsx
  triggerShake, // Prop from App.jsx
}) {
  const gameAreaRef = useRef(null);
  const catcherRef = useRef(null); // Ref for the Catcher component
  const isDraggingRef = useRef(false);

  // Catcher Movement Logic (useEffect from previous subtask, remains largely the same)
  useEffect(() => {
    if (!gameActive) return;
    const gameAreaElement = gameAreaRef.current;
    if (!gameAreaElement) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCatcherPosition(prev => Math.max(0 + (CATCHER_SIZE_PX / 2 / gameAreaElement.clientWidth * 100), prev - 5));
      } else if (e.key === 'ArrowRight') {
        setCatcherPosition(prev => Math.min(100 - (CATCHER_SIZE_PX / 2 / gameAreaElement.clientWidth * 100), prev + 5));
      }
    };
    const getPositionFromEvent = (clientX) => {
      const rect = gameAreaElement.getBoundingClientRect();
      let percentage = ((clientX - rect.left) / rect.width) * 100;
      const minPercent = (CATCHER_SIZE_PX / 2 / rect.width * 100);
      const maxPercent = 100 - (CATCHER_SIZE_PX / 2 / rect.width * 100);
      return Math.max(minPercent, Math.min(maxPercent, percentage));
    };
    const handleMouseDown = (e) => { if (e.button !== 0) return; isDraggingRef.current = true; setCatcherPosition(getPositionFromEvent(e.clientX)); };
    const handleMouseMove = (e) => { if (!isDraggingRef.current) return; setCatcherPosition(getPositionFromEvent(e.clientX)); };
    const handleMouseUp = (e) => { if (e.button !== 0) return; isDraggingRef.current = false; };
    const handleTouchStart = (e) => { setCatcherPosition(getPositionFromEvent(e.touches[0].clientX)); };
    const handleTouchMove = (e) => { setCatcherPosition(getPositionFromEvent(e.touches[0].clientX)); };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mouseup', handleMouseUp);
    gameAreaElement.addEventListener('mousedown', handleMouseDown);
    gameAreaElement.addEventListener('mousemove', handleMouseMove);
    gameAreaElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    gameAreaElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (gameAreaElement) {
        gameAreaElement.removeEventListener('mousedown', handleMouseDown);
        gameAreaElement.removeEventListener('mousemove', handleMouseMove);
        gameAreaElement.removeEventListener('touchstart', handleTouchStart);
        gameAreaElement.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [gameActive, setCatcherPosition]);

  // Item Spawning Logic
  useEffect(() => {
    if (!gameActive) return;
    const spawnInterval = ITEM_SPAWN_INTERVAL_BASE / gameSpeed;
    const intervalId = setInterval(() => {
      const gameAreaElement = gameAreaRef.current;
      if (!gameAreaElement) return;
      const gameAreaWidth = gameAreaElement.clientWidth;

      const isObstacle = Math.random() > 0.8; // 20% chance
      const randomLeftPercent = Math.random() * (100 - (ITEM_SIZE_PX / gameAreaWidth * 100));
      
      let newItem;
      if (isObstacle) {
        newItem = {
          id: Date.now() + Math.random(), type: 'obstacle', icon: obstacleData.src,
          top: -ITEM_SIZE_PX, left: randomLeftPercent,
          speed: (gameSettings.obstacleFallSpeed || 1.5) * gameSpeed,
        };
      } else {
        const randomLogo = aiLogos[Math.floor(Math.random() * aiLogos.length)];
        newItem = {
          id: Date.now() + Math.random(), type: 'logo', icon: randomLogo.src, points: randomLogo.points,
          tooltipText: randomLogo.tooltipText, // Add tooltipText
          top: -ITEM_SIZE_PX, left: randomLeftPercent,
          speed: (gameSettings.logoFallSpeed || 1) * gameSpeed,
        };
      }
      setFallingItems(prevItems => [...prevItems, newItem]);
    }, spawnInterval);
    return () => clearInterval(intervalId);
  }, [gameActive, gameSpeed, setFallingItems]);

  // Game Loop for Moving Items & Collision Detection
  useEffect(() => {
    if (!gameActive) return;

    let animationFrameId;
    const gameLoop = () => {
      const gameAreaElement = gameAreaRef.current;
      const catcherElement = catcherRef.current;

      if (!gameAreaElement || !catcherElement) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      const gameAreaHeight = gameAreaElement.clientHeight;
      const gameAreaWidth = gameAreaElement.clientWidth;
      const catcherRect = catcherElement.getBoundingClientRect();

      // Define catch zone (relative to gameArea top)
      const catchZoneTop = gameAreaHeight - 140;
      const catchZoneBottom = gameAreaHeight - 40;

      setFallingItems(prevItems => {
        const itemsAfterCollision = [];
        let collisionOccurred = false;

        for (const item of prevItems) {
          const newItemTop = item.top + item.speed * 2; // Update position first

          // Calculate item's bounding box
          const itemLeftPx = (item.left / 100) * gameAreaWidth;
          const itemRect = {
            top: newItemTop, // Use updated top for collision check
            bottom: newItemTop + ITEM_SIZE_PX,
            left: itemLeftPx,
            right: itemLeftPx + ITEM_SIZE_PX,
          };

          // Check collision
          const isHorizontallyAligned = itemRect.left < catcherRect.right && itemRect.right > catcherRect.left;
          const isVerticallyCatchable = itemRect.bottom > catcherRect.top && itemRect.top < catcherRect.bottom; // General vertical overlap with catcher
          const isInCatchZone = itemRect.bottom > catchZoneTop && itemRect.top < catchZoneBottom; // Item is within the specific catchable y-zone

          if (isHorizontallyAligned && isVerticallyCatchable && isInCatchZone) {
            collisionOccurred = true;
            if (item.type === 'logo') {
              setScore(prev => prev + (item.points || 10));
              playSound('catch');
              if (showTooltip && item.tooltipText) {
                // Create a rect for the tooltip relative to viewport
                const gameAreaRect = gameAreaElement.getBoundingClientRect();
                const tooltipItemRect = {
                  left: gameAreaRect.left + itemLeftPx,
                  top: gameAreaRect.top + newItemTop, // Use newItemTop for current position
                  width: ITEM_SIZE_PX,
                  height: ITEM_SIZE_PX,
                  // getBoundingClientRect provides bottom, right, x, y - adjust if needed
                  // For showTooltip, we primarily need left and top.
                };
                showTooltip(item.tooltipText, tooltipItemRect);
              }
            } else if (item.type === 'obstacle') {
              setLives(prev => prev - 1);
              playSound('hit');
              if (triggerShake) { // Check if prop is passed
                triggerShake();
              }
            }
            // Item is caught, do not add to itemsAfterCollision
          } else if (newItemTop < gameAreaHeight) {
            // Item is not caught and still on screen
            itemsAfterCollision.push({ ...item, top: newItemTop });
          } else {
            // Item is off-screen (missed)
            if (item.type === 'logo') {
              // Optional: Lose life for missed logos, if desired by game rules
              // setLives(prev => prev - 1); 
            }
            collisionOccurred = true; // To re-trigger render if item is removed
          }
        }
        // If a collision or removal happened, this new array will be different.
        // Otherwise, it's the same array with updated positions.
        return itemsAfterCollision;
      });
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameActive, gameSpeed, setFallingItems, setScore, setLives, catcherPosition]); // catcherPosition to re-evaluate catcherRect if it moves

  const visibilityClass = gameActive ? '' : 'hidden';

  return (
    <div 
      id="gameArea"
      ref={gameAreaRef}
      className={`game-area w-full h-screen relative overflow-hidden bg-gradient-to-b from-blue-400 to-purple-600 ${visibilityClass} cursor-none`}
    >
      <Catcher ref={catcherRef} catcherPosition={catcherPosition} /> {/* Pass the ref to Catcher */}
      {fallingItems.map(item => (
        <FallingItem
          key={item.id}
          id={item.id}
          type={item.type}
          icon={item.icon}
          top={item.top}
          left={item.left}
        />
      ))}
    </div>
  );
}
export default GameArea;
