import React from 'react';
import { Game } from '../types';

const games: Game[] = [
  { title: 'Beat the Timer', category: 'Focus', age: '5+', description: 'Set a timer for a simple task like cleaning up toys. Challenge your child to finish before it buzzes.' },
  { title: 'Red Light, Green Light', category: 'Impulse Control', age: '3+', description: 'A classic game that helps children practice stopping and starting on command.' },
  { title: 'Yoga Poses for Kids', category: 'Calming', age: '4+', description: 'Simple yoga poses like "cat-cow" or "downward dog" can help calm the nervous system.' },
  { title: 'Memory Matching Game', category: 'Focus', age: '4+', description: 'Use a deck of cards to find matching pairs, enhancing concentration and memory.' },
  { title: 'Simon Says', category: 'Impulse Control', age: '3+', description: 'This game requires active listening and controlling the impulse to act unless "Simon Says".' },
  { title: 'Deep Breathing Bubbles', category: 'Calming', age: '3+', description: 'Practice slow, deep breaths by pretending to blow giant bubbles. Inhale slowly, exhale to "blow".' },
  { title: 'Building Blocks Challenge', category: 'Focus', age: '4+', description: 'Challenge them to build a specific structure from a picture, requiring sustained attention.' },
  { title: 'Freeze Dance', category: 'Impulse Control', age: '3+', description: 'Dance when the music plays and freeze when it stops. Great for energy release and control.' },
];

const PlayScreen: React.FC = () => {
  const getCategoryColor = (category: Game['category']) => {
    switch (category) {
      case 'Focus': return 'bg-sky-100 text-sky-800';
      case 'Impulse Control': return 'bg-amber-100 text-amber-800';
      case 'Calming': return 'bg-emerald-100 text-emerald-800';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Therapeutic Games & Activities</h2>
        <p className="text-sm text-slate-500 mt-1">Fun ways to build skills and self-regulation.</p>
      </div>

      <div className="space-y-3">
        {games.map((game, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-500">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-700">{game.title}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(game.category)}`}>
                {game.category}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 mb-2">Ages: {game.age}</p>
            <p className="text-slate-600">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayScreen;
