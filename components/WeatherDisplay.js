"use client"

import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Loader } from 'lucide-react';

const WeatherDisplay = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeatherIcon = (code) => {
    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (code >= 200 && code < 300) return CloudLightning;  // Thunderstorm
    if (code >= 300 && code < 600) return CloudRain;       // Rain
    if (code >= 600 && code < 700) return CloudSnow;       // Snow
    if (code >= 700 && code < 800) return CloudFog;        // Atmosphere
    if (code === 800) return Sun;                          // Clear
    if (code > 800) return Cloud;                          // Clouds
    return Cloud;
  };

  const fetchWeather = async () => {
    try {
      // First, get user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=d2a93938047615d0b05145df75b1014d&units=imperial`
      );
      
      if (!response.ok) throw new Error('Weather data fetch failed');
      
      const data = await response.json();
      
      setWeather({
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        code: data.weather[0].id,
        description: data.weather[0].description,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh weather every 5 minutes
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-zinc-400 animate-pulse">
        <Loader className="animate-spin" size={16} />
        <span>Loading weather...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-zinc-400">
        <span>Weather unavailable</span>
      </div>
    );
  }

  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.code);

  return (
    <div className="flex items-center space-x-3 text-zinc-200">
      <div className="relative">
        <WeatherIcon 
          size={24} 
          className={`
            transition-all duration-500
            ${weather.condition === 'Clear' ? 'text-yellow-400 animate-pulse' : ''}
            ${weather.condition === 'Rain' ? 'text-blue-400' : ''}
            ${weather.condition === 'Clouds' ? 'text-gray-400' : ''}
            ${weather.condition === 'Snow' ? 'text-white' : ''}
            ${weather.condition === 'Thunderstorm' ? 'text-purple-400' : ''}
          `}
        />
        {/* Dynamic weather effects */}
        {weather.condition === 'Rain' && (
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-blue-400 w-0.5 h-0.5 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-lg font-medium">{weather.temp}°F</span>
        <span className="text-sm text-zinc-400 capitalize">{weather.description}</span>
      </div>
    </div>
  );
};

export default WeatherDisplay;