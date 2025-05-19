import React from 'react';
// You could install and use heroicons for sun/moon icons:
// import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const DarkModeToggle = ({ currentMode, toggleMode }) => {
  return (
    <button
      onClick={toggleMode}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
      aria-label={currentMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {currentMode === 'dark' ? (
        // Replace with MoonIcon if using icons
        <span>☀️ Light</span>
      ) : (
        // Replace with SunIcon if using icons
        <span>🌙 Dark</span>
      )}
    </button>
  );
};

export default DarkModeToggle;
