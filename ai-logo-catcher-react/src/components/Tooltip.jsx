import React from 'react';

function Tooltip({ text, visible, x, y }) {
  if (!visible) {
    return null;
  }

  const style = {
    left: `${x}px`,
    top: `${y}px`,
    position: 'fixed', // Use 'fixed' for viewport-relative positioning, or 'absolute' if parent is relative
  };

  return (
    <div 
      id="tooltip"
      className="tooltip bg-gray-800 text-white text-sm p-3 rounded-lg shadow-xl z-50 pointer-events-none transition-opacity duration-300 ease-in-out opacity-100"
      // Use 'opacity-100' when visible, and 'opacity-0' when not for transitions,
      // but conditional rendering with 'null' is simpler and often preferred unless doing CSS transitions on visibility.
      // Tailwind classes for styling:
      // - bg-gray-800: Dark background
      // - text-white: White text
      // - text-sm: Small text size
      // - p-3: Padding
      // - rounded-lg: Rounded corners
      // - shadow-xl: Large shadow for depth
      // - z-50: High z-index to be on top
      // - pointer-events-none: Tooltip should not interfere with mouse events
      // - transition-opacity duration-300 ease-in-out: For opacity transition (if not using conditional rendering)
      style={style}
    >
      {text}
    </div>
  );
}

export default Tooltip;
