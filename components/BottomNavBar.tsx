import React from 'react';
import { Screen } from '../types';
import { HomeIcon, LearnIcon, PlayIcon, NourishIcon, FindIcon, ToolsIcon, ChatIcon, BlogIcon } from './icons';

interface BottomNavBarProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { screen: Screen.Home, icon: HomeIcon, label: 'Home' },
    { screen: Screen.Learn, icon: LearnIcon, label: 'Learn' },
    { screen: Screen.Play, icon: PlayIcon, label: 'Play' },
    { screen: Screen.Blog, icon: BlogIcon, label: 'Blog' },
    { screen: Screen.Nourish, icon: NourishIcon, label: 'Nourish' },
    { screen: Screen.Find, icon: FindIcon, label: 'Find' },
    { screen: Screen.Tools, icon: ToolsIcon, label: 'Tools' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => setActiveScreen(item.screen)}
            className={`flex flex-col items-center justify-center w-14 h-14 transition-all duration-200 rounded-lg ${
              activeScreen === item.screen ? 'text-teal-600' : 'text-gray-500 hover:text-teal-500'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className={`text-xs font-medium ${activeScreen === item.screen ? 'opacity-100' : 'opacity-0'} transition-opacity`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;