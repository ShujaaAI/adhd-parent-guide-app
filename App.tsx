import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import BottomNavBar from './components/BottomNavBar';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import PlayScreen from './screens/PlayScreen';
import NourishScreen from './screens/NourishScreen';
import FindScreen from './screens/FindScreen';
import ToolsScreen from './screens/ToolsScreen';
import ChatScreen from './screens/ChatScreen';
import BlogScreen from './screens/BlogScreen';
import Header from './components/Header';
import { GoogleGenAI, Chat } from '@google/genai';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  useEffect(() => {
    // Initialize chat session
    const initChat = () => {
        try {
            const session = geminiService.getChatSession();
            setChatSession(session);
        } catch (error) {
            console.error("Failed to initialize chat session:", error);
        }
    };
    initChat();
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.Home:
        return <HomeScreen setActiveScreen={setActiveScreen} />;
      case Screen.Learn:
        return <LearnScreen />;
      case Screen.Play:
        return <PlayScreen />;
      case Screen.Nourish:
        return <NourishScreen />;
      case Screen.Find:
        return <FindScreen />;
      case Screen.Tools:
        return <ToolsScreen />;
      case Screen.Chat:
        return <ChatScreen chatSession={chatSession} />;
      case Screen.Blog:
        return <BlogScreen />;
      default:
        return <HomeScreen setActiveScreen={setActiveScreen} />;
    }
  };

  const screenTitles: { [key in Screen]: string } = {
    [Screen.Home]: "Home",
    [Screen.Learn]: "Learn & Grow",
    [Screen.Play]: "Activities & Games",
    [Screen.Nourish]: "Nutrition Guide",
    [Screen.Find]: "Find Support",
    [Screen.Tools]: "Daily Tools",
    [Screen.Chat]: "AI Assistant",
    [Screen.Blog]: "Parenting Blog",
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans max-w-md mx-auto bg-white shadow-2xl">
      <Header title={screenTitles[activeScreen]} />
      <main className="flex-1 overflow-y-auto pb-20 bg-slate-50">
        {renderScreen()}
      </main>
      <BottomNavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </div>
  );
};

export default App;