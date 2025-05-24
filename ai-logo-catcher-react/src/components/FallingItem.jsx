import React from 'react';

function FallingItem({ id, type, icon, top, left }) {
  const style = {
    top: `${top}px`,
    left: `${left}%`, // Assuming left is a percentage for responsive positioning
    backgroundImage: type === 'obstacle' || (icon && icon.startsWith('data:image')) ? `url(${icon})` : undefined,
    // If icon is a path to an SVG file, backgroundImage might not be the best way if it's an actual SVG component later
  };

  // Base classes
  let classes = "falling-item absolute w-12 h-12 bg-contain bg-no-repeat bg-center"; // Common size, adjust as needed

  // Type-specific classes (mimicking original CSS)
  if (type === 'logo') {
    classes += " rounded-full shadow-lg"; // Logos were circular with shadow
    // If icon is a path to an image file (not data URL), you might use an <img> tag instead of background-image
    // For now, assuming icon is a data URL or path for background-image
  } else if (type === 'obstacle') {
    classes += " bg-red-500 rounded-md shadow-md"; // Obstacles were red squares in original
    // If icon is a data URL (like the original), backgroundImage is fine.
    // If it's a specific SVG, it could be an inline SVG or an <img src="path/to/obstacle.svg">
  }

  return (
    <div
      key={id} // key should ideally be on the element created by map in GameArea.jsx
      className={classes}
      style={style}
      role="img" // For accessibility, if it's an image
      aria-label={type} // Basic label
    >
      {/* If not using backgroundImage for logos, an <img> tag could go here: */}
      {/* type === 'logo' && !icon.startsWith('data:image') && <img src={icon} alt={type} className="w-full h-full object-contain" /> */}
    </div>
  );
}

export default FallingItem;
