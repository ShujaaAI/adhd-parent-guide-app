import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Screen } from '../types';

interface HomeScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveScreen }) => {
  const [tip, setTip] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTip = async () => {
      setLoading(true);
      const fetchedTip = await geminiService.getTipOfTheDay();
      setTip(fetchedTip);
      setLoading(false);
    };
    fetchTip();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div className="text-center p-6 bg-teal-500 rounded-xl text-white shadow-lg">
        <h2 className="text-2xl font-bold">Welcome, Parent!</h2>
        <p className="mt-2 text-teal-100">Your daily hub for support and resources.</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">✨ Tip of the Day</h3>
        {loading ? (
          <LoadingSpinner className="my-4" />
        ) : (
          <p className="text-slate-600 leading-relaxed">{tip}</p>
        )}
      </div>
      
      <div className="bg-white p-5 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Your Daily Tools</h3>
        <ul className="space-y-3">
          <li className="flex items-center text-slate-600">
            <span className="text-xl mr-3">💊</span>
            <span>Medication Reminders</span>
          </li>
           <li className="flex items-center text-slate-600">
            <span className="text-xl mr-3">✅</span>
            <span>Daily Routine Checklist</span>
          </li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Quick Actions</h3>
        <div className="space-y-4">
            <button
                onClick={() => setActiveScreen(Screen.Tools)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-lg font-semibold"
            >
                <span className="text-2xl" aria-hidden="true">📅</span>
                <span>Manage Your Daily Tools</span>
            </button>
            <div className="grid grid-cols-3 gap-3 text-center">
                <button
                    onClick={() => setActiveScreen(Screen.Learn)}
                    className="flex flex-col items-center justify-center p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    <span className="text-2xl" aria-hidden="true">🧠</span>
                    <span className="font-semibold mt-1 text-slate-700 text-sm">Learn</span>
                </button>
                <button
                    onClick={() => setActiveScreen(Screen.Chat)}
                    className="flex flex-col items-center justify-center p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    <span className="text-2xl" aria-hidden="true">💬</span>
                    <span className="font-semibold mt-1 text-slate-700 text-sm">AI Chat</span>
                </button>
                <button
                    onClick={() => setActiveScreen(Screen.Find)}
                    className="flex flex-col items-center justify-center p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    <span className="text-2xl" aria-hidden="true">📍</span>
                    <span className="font-semibold mt-1 text-slate-700 text-sm">Find Help</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;