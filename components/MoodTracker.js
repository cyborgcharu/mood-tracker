"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Moon } from 'lucide-react';

const MoodTracker = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({ mood: null, time: null });
  
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

  const saveEntry = (entry) => {
    setEntries([{
      ...entry,
      timestamp: new Date(),
      id: Date.now()
    }, ...entries]);
    setCurrentEntry({ mood: null, time: null });
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-zinc-900 text-white border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <CardTitle className="text-3xl font-bold text-center">Daily Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-zinc-200">How are you feeling?</h3>
            <div className="grid grid-cols-3 gap-4">
              {moods.map(({ icon: Icon, label, color, ringColor }) => (
                <button
                  key={label}
                  onClick={() => handleMoodSelect(label)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all bg-zinc-800 hover:bg-zinc-700 ${
                    currentEntry.mood === label ? `ring-2 ring-offset-2 ring-offset-zinc-900 ${ringColor}` : ''
                  }`}
                >
                  <Icon size={32} className={`mb-2 ${color}`} />
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-zinc-200">What time is it?</h3>
            <div className="grid grid-cols-2 gap-4">
              {times.map(({ icon: Icon, label, color, ringColor }) => (
                <button
                  key={label}
                  onClick={() => handleTimeSelect(label)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all bg-zinc-800 hover:bg-zinc-700 ${
                    currentEntry.time === label ? `ring-2 ring-offset-2 ring-offset-zinc-900 ${ringColor}` : ''
                  }`}
                >
                  <Icon size={24} className={`mb-2 ${color}`} />
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-zinc-200">Recent Entries</h3>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div 
                key={entry.id} 
                className="p-4 bg-zinc-800 rounded-lg flex items-center justify-between hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className={moods.find(m => m.label === entry.mood)?.color}>
                    {entry.mood}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className={times.find(t => t.label === entry.time)?.color}>
                    {entry.time}
                  </span>
                </div>
                <span className="text-sm text-zinc-400">{formatTime(entry.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;