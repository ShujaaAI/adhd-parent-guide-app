import React, { useState, useEffect } from 'react';
import { Reminder, ChecklistItem } from '../types';

const ToolsScreen: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('adhdParentPal-reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse reminders from localStorage", e);
      }
    }
    return [];
  });
  
  const [newReminder, setNewReminder] = useState({ medication: '', time: '' });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('adhdParentPal-checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse checklist from localStorage", e);
      }
    }
    return [
      { id: 1, task: 'Morning: Brush teeth', completed: false },
      { id: 2, task: 'Morning: Get dressed', completed: false },
      { id: 3, task: 'Morning: Pack backpack', completed: false },
    ];
  });
  
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('adhdParentPal-reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('adhdParentPal-checklist', JSON.stringify(checklist));
  }, [checklist]);

  const handleAddReminder = () => {
    if (newReminder.medication && newReminder.time) {
      setReminders([...reminders, { ...newReminder, id: Date.now() }]);
      setNewReminder({ medication: '', time: '' });
    }
  };

  const handleAddTask = () => {
    if (newTask) {
      setChecklist([...checklist, { id: Date.now(), task: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Medication Reminders */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Medication Reminders</h2>
        <div className="space-y-2">
          {reminders.map(r => (
            <div key={r.id} className="flex justify-between items-center bg-slate-100 p-3 rounded-lg">
              <p className="font-medium text-slate-700">{r.medication}</p>
              <p className="text-sm text-slate-500">{r.time}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input type="text" placeholder="Medication" value={newReminder.medication} onChange={e => setNewReminder({...newReminder, medication: e.target.value})} className="flex-1 p-2 border rounded-lg"/>
          <input type="time" value={newReminder.time} onChange={e => setNewReminder({...newReminder, time: e.target.value})} className="p-2 border rounded-lg"/>
          <button onClick={handleAddReminder} className="px-3 bg-teal-600 text-white rounded-lg font-bold">+</button>
        </div>
      </div>

      {/* Daily Routine Checklist */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Daily Routine Checklist</h2>
        <div className="space-y-2">
          {checklist.map(item => (
            <div key={item.id} onClick={() => toggleChecklistItem(item.id)} className="flex items-center bg-slate-100 p-3 rounded-lg cursor-pointer">
              <input type="checkbox" checked={item.completed} readOnly className="h-5 w-5 rounded text-teal-600 focus:ring-teal-500 border-gray-300"/>
              <span className={`ml-3 ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.task}</span>
            </div>
          ))}
        </div>
         <div className="flex gap-2 mt-4">
            <input type="text" placeholder="New task..." value={newTask} onChange={e => setNewTask(e.target.value)} className="flex-1 p-2 border rounded-lg"/>
            <button onClick={handleAddTask} className="px-3 bg-teal-600 text-white rounded-lg font-bold">+</button>
        </div>
      </div>
    </div>
  );
};

export default ToolsScreen;