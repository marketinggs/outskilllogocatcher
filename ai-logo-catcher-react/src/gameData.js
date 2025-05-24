// Placeholder for AI Logos and Obstacle data

export const aiLogos = [
  { name: 'OpenAI', src: 'placeholder-openai.svg', points: 10, tooltipText: 'OpenAI: Leading AI research and deployment.' },
  { name: 'Google AI', src: 'placeholder-googleai.svg', points: 10, tooltipText: 'Google AI: Advancing AI for everyone.' },
  { name: 'Microsoft AI', src: 'placeholder-microsoftai.svg', points: 10, tooltipText: 'Microsoft AI: Empowering innovation with AI.' },
  { name: 'Meta AI', src: 'placeholder-metaai.svg', points: 10, tooltipText: 'Meta AI: Building the future of connection with AI.' },
  // Add more logos as needed based on the original HTML's data URLs
];

export const obstacleData = {
  src: 'placeholder-obstacle.svg', // Actual SVG will be handled later
};

// Note: The original HTML used data URLs for SVGs.
// We will need a strategy to either convert these to files 
// or handle them as inline SVGs/components in React.
// For now, these are just placeholders.

export const soundFiles = {
  catch: '/sounds/catch.mp3',     // Placeholder
  hit: '/sounds/hit.mp3',         // Placeholder (renamed from miss)
  gameover: '/sounds/gameover.mp3', // Placeholder (renamed from gameOver)
  // background: '/sounds/background.mp3', // Background sound not in scope for this task
};

// Game settings (can be expanded)
export const gameSettings = {
  initialLives: 3,
  logoFallSpeed: 1, // Initial speed
  obstacleFallSpeed: 1.5,
  speedIncreaseInterval: 10000, // ms
  speedIncreaseAmount: 0.2,
};
