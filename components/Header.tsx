import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-md w-full z-10">
      <div className="h-16 flex items-center justify-center px-4">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
