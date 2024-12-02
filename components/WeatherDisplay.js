"use client"

import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Loader, Wind, Droplets } from 'lucide-react';

const WeatherDisplay = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeatherIcon = (code) => {
    if (code >= 200 && code < 300) return CloudLightning;
    if (code >= 300 && code < 600) return CloudRain;
    if (code >= 600 && code < 700) return CloudSnow;
    if (code >= 700 && code < 800) return CloudFog;
    if (code === 800) return Sun;
    if (code > 800) return Cloud;
    return Cloud;
  };

  const fetchWeather = async () => {
    try {
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
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="relative group animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 backdrop-blur-lg rounded-xl -z-10" />
        <div className="px-4 py-3 rounded-xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Loader className="animate-spin w-5 h-5 text-zinc-400" />
            <span className="text-zinc-400">Loading weather...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-zinc-800/30 backdrop-blur-lg rounded-xl -z-10" />
        <div className="px-4 py-3 rounded-xl border border-red-800/30 bg-zinc-900/30 backdrop-blur-sm">
          <span className="text-zinc-400">Weather unavailable</span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.code);

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 backdrop-blur-lg rounded-xl 
                      transform group-hover:scale-105 transition-all duration-300 -z-10" />
      
      <div className="px-4 py-3 rounded-xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm
                      transform hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3">
          <WeatherIcon 
            className={`w-6 h-6 transition-all duration-500
              ${weather.condition === 'Clear' ? 'text-yellow-400 animate-pulse' : ''}
              ${weather.condition === 'Rain' ? 'text-blue-400' : ''}
              ${weather.condition === 'Clouds' ? 'text-gray-400' : ''}
              ${weather.condition === 'Snow' ? 'text-white animate-bounce' : ''}
              ${weather.condition === 'Thunderstorm' ? 'text-purple-400' : ''}
            `}
          />
          <span className="text-base text-zinc-100 font-medium capitalize">
            {weather.description}
          </span>
        </div>
        
        <div className="mt-2 flex items-center gap-4">
          <span className="text-2xl font-bold text-white">
            {weather.temp}°F
          </span>
          
          {weather.windSpeed && (
            <div className="flex items-center gap-2 text-zinc-400">
              <Wind className="w-4 h-4" />
              <span className="text-sm">{weather.windSpeed} mph</span>
            </div>
          )}
          
          {weather.humidity && (
            <div className="flex items-center gap-2 text-zinc-400">
              <Droplets className="w-4 h-4" />
              <span className="text-sm">{weather.humidity}%</span>
            </div>
          )}
        </div>

        {weather.condition === 'Rain' && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-blue-400/50 w-0.5 h-0.5 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDisplay;