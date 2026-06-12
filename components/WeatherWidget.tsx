"use client";

import { useEffect, useState } from "react";

interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: number;
}

const weatherIcon = (code: number): string => {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code <= 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 59) return "🌦️";
  if (code <= 69) return "🌧️";
  if (code <= 79) return "🌨️";
  if (code <= 84) return "🌧️";
  if (code <= 94) return "⛈️";
  return "🌩️";
};

const weatherDesc = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code <= 2) return "Partly cloudy";
  if (code <= 3) return "Overcast";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rainy";
  if (code <= 79) return "Snowy";
  if (code <= 84) return "Rain showers";
  if (code <= 94) return "Thunderstorm";
  return "Stormy";
};

export default function WeatherWidget({ destination }: { destination: string }) {
  const [weather, setWeather] = useState<WeatherDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!destination) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(false);

        // Step 1: Geocode the destination
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const geoData = await geoRes.json();
        if (!geoData.length) { setError(true); return; }

        const { lat, lon } = geoData[0];

        // Step 2: Fetch 5-day forecast from Open-Meteo (free, no key)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=5`
        );
        const weatherData = await weatherRes.json();

        const days: WeatherDay[] = weatherData.daily.time.map(
          (date: string, i: number) => ({
            date,
            maxTemp: Math.round(weatherData.daily.temperature_2m_max[i]),
            minTemp: Math.round(weatherData.daily.temperature_2m_min[i]),
            code: weatherData.daily.weathercode[i],
          })
        );

        setWeather(days);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  if (loading) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(0,212,255,0.06)",
          border: "1px solid rgba(0,212,255,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span>☁️</span>
          <span className="font-space text-sm font-semibold" style={{ color: "#00d4ff" }}>
            Weather Forecast
          </span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !weather) return null;

  const today = weather[0];

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(0,212,255,0.06)",
        border: "1px solid rgba(0,212,255,0.15)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span>☁️</span>
          <span className="font-space text-sm font-semibold" style={{ color: "#00d4ff" }}>
            Weather in {destination}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          5-day forecast
        </span>
      </div>

      {/* Today highlight */}
      <div className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: "2.5rem" }}>{weatherIcon(today.code)}</span>
        <div>
          <div className="font-space text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {today.maxTemp}°C
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {weatherDesc(today.code)} · Low {today.minTemp}°C
          </div>
        </div>
      </div>

      {/* 5-day strip */}
      <div className="grid grid-cols-5 gap-2">
        {weather.map((day, i) => {
          const date = new Date(day.date);
          const label = i === 0 ? "Today" : date.toLocaleDateString("en", { weekday: "short" });
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
              <span style={{ fontSize: "1.2rem" }}>{weatherIcon(day.code)}</span>
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {day.maxTemp}°
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {day.minTemp}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
