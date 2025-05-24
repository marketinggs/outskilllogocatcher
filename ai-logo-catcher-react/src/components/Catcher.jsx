import React, { forwardRef } from 'react';

const Catcher = forwardRef(({ catcherPosition }, ref) => {
  // catcherPosition is a percentage (0-100) representing the desired center of the catcher.
  // The 'left' style should be this percentage.
  // 'transform: translateX(-50%)' will then shift the catcher left by half its own width,
  // effectively centering it at the catcherPosition percentage.
  const style = {
    left: `${catcherPosition}%`,
    transform: 'translateX(-50%)',
    // Ensure fixed size for collision detection if not already set by Tailwind, e.g., w-20 (80px) h-20 (80px)
    // The prompt states: "Assume items are 60x60px and catcher is 80x80px"
    // Tailwind classes: w-24 (96px) h-12 (48px) are currently in use.
    // Let's stick to the prompt's 80x80px for collision logic, but visually it might differ if class is not w-20 h-20
  };

  return (
    <div 
      ref={ref} // Forward the ref to the main div
      id="catcher"
      className="catcher absolute bottom-5 w-20 h-20 bg-blue-500 rounded-t-lg shadow-md cursor-none" // Adjusted to w-20 h-20 for 80px
      style={style}
    >
      <div className="catcher-design w-full h-full flex items-center justify-center">
        {/* Example design, can be replaced with SVG or more complex elements */}
        <div className="w-16 h-16 bg-blue-300 rounded-sm"></div> {/* Adjusted inner design too */}
      </div>
    </div>
  );
});

export default Catcher;
