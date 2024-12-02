"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Moon, X, Undo, Tag, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MoodTracker = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({ mood: null, time: null, activities: [], note: '' });
  const [undoStack, setUndoStack] = useState([]);
  const [weather, setWeather] = useState({ temp: null, condition: null });
  
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

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries).map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  // Simulated weather data fetch
  useEffect(() => {
    // In a real app, you'd fetch from a weather API
    setWeather({ temp: '72°F', condition: 'Sunny' });
  }, []);

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
      weather,
      timestamp: new Date(),
      id: Date.now()
    };
    setEntries(prev => [newEntry, ...prev]);
    setUndoStack(prev => [...prev, entries]);
    setCurrentEntry({ mood: null, time: null, activities: [], note: '' });
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

  const getMoodStats = () => {
    const total = entries.length;
    if (total === 0) return null;

    const counts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([mood, count]) => ({
      mood,
      percentage: Math.round((count / total) * 100)
    }));
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-4">
      <Card className="bg-zinc-900 text-white border-zinc-800">
        <CardHeader className="border-b border-zinc-800">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">Daily Mood Tracker</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <span>{weather.temp}</span>
              <span>•</span>
              <span>{weather.condition}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Mood and Time sections remain the same */}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-zinc-200">Activities</h3>
            <div className="flex flex-wrap gap-2">
              {activities.map(({ label, color }) => (
                <button
                  key={label}
                  onClick={() => handleActivityToggle(label)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    currentEntry.activities.includes(label)
                      ? color + ' text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {entries.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-zinc-200">Mood Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getMoodStats()}>
                    <XAxis dataKey="mood" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-zinc-200">Recent Entries</h3>
              {undoStack.length > 0 && (
                <button
                  onClick={undo}
                  className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <Undo size={20} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
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
                          className={`px-2 py-0.5 rounded-full text-xs ${
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;