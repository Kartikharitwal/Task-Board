import React from 'react';

const Header = ({ children }) => {
  return (
    <header className="bg-white shadow-md dark:bg-gray-800 dark:shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide dark:text-sky-400">
          Task Management Board
        </h1>
        {children}
      </div>
    </header>
  );
};

export default Header;
