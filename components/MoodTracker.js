"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Moon } from 'lucide-react';

const MoodTracker = () => {
  const [entries, setEntries] = useState([]);
  
  const moods = [
    { icon: Smile, label: 'Happy', color: 'text-green-500 hover:bg-green-100' },
    { icon: Meh, label: 'Neutral', color: 'text-yellow-500 hover:bg-yellow-100' },
    { icon: Frown, label: 'Sad', color: 'text-blue-500 hover:bg-blue-100' }
  ];
  
  const times = [
    { icon: Sun, label: 'Morning', color: 'text-orange-500 hover:bg-orange-100' },
    { icon: Cloud, label: 'Afternoon', color: 'text-gray-500 hover:bg-gray-100' },
    { icon: CloudRain, label: 'Evening', color: 'text-indigo-500 hover:bg-indigo-100' },
    { icon: Moon, label: 'Night', color: 'text-purple-500 hover:bg-purple-100' }
  ];

  const addEntry = (mood, time) => {
    const now = new Date();
    setEntries([{
      mood,
      time,
      timestamp: now,
      id: now.getTime()
    }, ...entries]); // Add to start of array instead of end
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
              {moods.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  onClick={() => addEntry(label, null)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all transform hover:scale-105 bg-zinc-800 ${color}`}
                >
                  <Icon size={32} className="mb-2" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-zinc-200">What time is it?</h3>
            <div className="grid grid-cols-2 gap-4">
              {times.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  onClick={() => addEntry(null, label)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all transform hover:scale-105 bg-zinc-800 ${color}`}
                >
                  <Icon size={24} className="mb-2" />
                  <span className="text-sm font-medium">{label}</span>
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
                  {entry.mood && (
                    <span className={`font-medium ${moods.find(m => m.label === entry.mood)?.color}`}>
                      {entry.mood}
                    </span>
                  )}
                  {entry.mood && entry.time && <span className="text-zinc-500">•</span>}
                  {entry.time && (
                    <span className={`font-medium ${times.find(t => t.label === entry.time)?.color}`}>
                      {entry.time}
                    </span>
                  )}
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