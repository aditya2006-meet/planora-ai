"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons broken by webpack
const markerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #00d4ff, #9b59ff);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(155,89,255,0.3);
      border: 2px solid rgba(255,255,255,0.3);
    "></div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

export default function TripMapInner({ destination }: { destination: string }) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!destination) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data.length) { setError(true); return; }
        setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setPlaceName(data[0].display_name?.split(",")[0] || destination);
      })
      .catch(() => setError(true));
  }, [destination]);

  if (error) return null;

  if (!coords) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{
          height: 260,
          background: "rgba(0,212,255,0.04)",
          border: "1px solid rgba(0,212,255,0.1)",
        }}
      >
        <div className="flex flex-col items-center gap-2" style={{ color: "var(--text-muted)" }}>
          <span className="text-2xl">🗺️</span>
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ height: 260, border: "1px solid rgba(0,212,255,0.2)" }}
    >
      <MapContainer
        center={coords}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <ZoomControl position="bottomright" />
        <Marker position={coords} icon={markerIcon}>
          <Popup>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1a1a2e" }}>
              <strong>{placeName}</strong>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
