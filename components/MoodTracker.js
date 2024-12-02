// components/MoodTracker.js
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Moon, Undo, Trash2 } from 'lucide-react';
import WeatherDisplay from './WeatherDisplay';

const MoodTracker = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({ mood: null, time: null, activities: [] });
  const [undoStack, setUndoStack] = useState([]);
  
  const moods = [
    { icon: Smile, label: 'Happy', color: 'text-green-500', ringColor: 'ring-green-500' },
    { icon: Meh, label: 'Neutral', color: 'text-yellow-500', ringColor: 'ring-yellow-500' },
    { icon: Frown, label: 'Sad', color: 'text-blue-500', ringColor: 'ring-blue-500' }
  ];
  
  const times = [
    { icon: Sun, label: 'Morning', color: 'text-orange-500', ringColor: 'ring-orange-500' },
    { icon: Cloud, label: 'Afternoon', color: 'text-gray-500', ringColor: 'ring-gray-500' },
    { icon: CloudRain, label: 'Evening', color: 'text-blue-400', ringColor: 'ring-blue-400' },
    { icon: Moon, label: 'Night', color: 'text-purple-500', ringColor: 'ring-purple-500' }
  ];

  const activities = [
    { label: 'Work', color: 'bg-blue-500' },
    { label: 'Exercise', color: 'bg-green-500' },
    { label: 'Social', color: 'bg-purple-500' },
    { label: 'Rest', color: 'bg-yellow-500' },
    { label: 'Study', color: 'bg-red-500' }
  ];

  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries).map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  const handleMoodSelect = (mood) => {
    const newEntry = { ...currentEntry, mood };
    setCurrentEntry(newEntry);
    if (newEntry.time) saveEntry(newEntry);
  };

  const handleTimeSelect = (time) => {
    const newEntry = { ...currentEntry, time };
    setCurrentEntry(newEntry);
    if (newEntry.mood) saveEntry(newEntry);
  };

  const handleActivityToggle = (activity) => {
    const newActivities = currentEntry.activities.includes(activity)
      ? currentEntry.activities.filter(a => a !== activity)
      : [...currentEntry.activities, activity];
    setCurrentEntry({ ...currentEntry, activities: newActivities });
  };

  const saveEntry = (entry) => {
    const newEntry = {
      ...entry,
      timestamp: new Date(),
      id: Date.now()
    };
    setEntries(prev => [newEntry, ...prev]);
    setUndoStack(prev => [...prev, entries]);
    setCurrentEntry({ mood: null, time: null, activities: [] });
  };

  const deleteEntry = (id) => {
    setUndoStack(prev => [...prev, entries]);
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setEntries(previousState);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
            <WeatherDisplay />
        </div>
        <Card className="w-full bg-zinc-900 text-white border-zinc-800">
            <CardHeader className="pb-4 px-6">
                <CardTitle className="text-3xl">Daily Mood Tracker</CardTitle>
            </CardHeader>

        <CardContent className="px-6 pb-6">
          <div className="flex flex-col space-y-8">
            {/* Mood and Time Selection */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">How are you feeling?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {moods.map(({ icon: Icon, label, color, ringColor }) => (
                    <button
                      key={label}
                      onClick={() => handleMoodSelect(label)}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all bg-zinc-800 
                        ${currentEntry.mood === label ? `ring-2 ring-offset-1 ring-offset-zinc-900 ${ringColor}` : 'hover:bg-zinc-700'}`}
                    >
                      <Icon size={28} className={`mb-2 ${color}`} />
                      <span className={`text-sm font-medium ${color}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-medium">What time is it?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {times.map(({ icon: Icon, label, color, ringColor }) => (
                    <button
                      key={label}
                      onClick={() => handleTimeSelect(label)}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all bg-zinc-800 
                        ${currentEntry.time === label ? `ring-2 ring-offset-1 ring-offset-zinc-900 ${ringColor}` : 'hover:bg-zinc-700'}`}
                    >
                      <Icon size={24} className={`mb-2 ${color}`} />
                      <span className={`text-sm font-medium ${color}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Activities</h3>
              <div className="flex flex-wrap gap-2">
                {activities.map(({ label, color }) => (
                  <button
                    key={label}
                    onClick={() => handleActivityToggle(label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all 
                      ${currentEntry.activities.includes(label) 
                        ? `${color} text-white` 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Entries */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">Recent Entries</h3>
                {undoStack.length > 0 && (
                  <button
                    onClick={undo}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Undo size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {entries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={moods.find(m => m.label === entry.mood)?.color}>
                          {entry.mood}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span className={times.find(t => t.label === entry.time)?.color}>
                          {entry.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-zinc-400">{formatTime(entry.timestamp)}</span>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {entry.activities.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {entry.activities.map(activity => (
                          <span
                            key={activity}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              activities.find(a => a.label === activity)?.color
                            } bg-opacity-20`}
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;