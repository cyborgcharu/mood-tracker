"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Moon } from 'lucide-react';

const MoodTracker = () => {
  const [entries, setEntries] = useState([]);
  
  const moods = [
    { icon: Smile, label: 'Happy', color: 'text-green-500' },
    { icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
    { icon: Frown, label: 'Sad', color: 'text-blue-500' }
  ];
  
  const times = [
    { icon: Sun, label: 'Morning', color: 'text-orange-500' },
    { icon: Cloud, label: 'Afternoon', color: 'text-gray-500' },
    { icon: CloudRain, label: 'Evening', color: 'text-indigo-500' },
    { icon: Moon, label: 'Night', color: 'text-purple-500' }
  ];

  const addEntry = (mood, time) => {
    setEntries([...entries, {
      mood,
      time,
      timestamp: new Date().toLocaleString()
    }]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Daily Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">How are you feeling?</h3>
              <div className="flex justify-around p-4 bg-gray-100 rounded-lg">
                {moods.map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    onClick={() => addEntry(label, null)}
                    className={`p-2 hover:bg-gray-200 rounded-full transition-colors ${color}`}
                  >
                    <Icon size={32} />
                    <div className="text-sm">{label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What time is it?</h3>
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-100 rounded-lg">
                {times.map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    onClick={() => addEntry(null, label)}
                    className={`p-2 hover:bg-gray-200 rounded-full transition-colors ${color}`}
                  >
                    <Icon size={24} />
                    <div className="text-sm">{label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Recent Entries</h3>
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                  <span>{entry.mood || entry.time}</span>
                  <span className="text-sm text-gray-500">{entry.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;