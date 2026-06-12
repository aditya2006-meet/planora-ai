"use client";

import dynamic from "next/dynamic";

const TripMapInner = dynamic(() => import("./TripMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl flex items-center justify-center"
      style={{
        height: 260,
        background: "rgba(0,212,255,0.04)",
        border: "1px solid rgba(0,212,255,0.1)",
      }}
    >
      <div
        className="flex flex-col items-center gap-2"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="text-2xl">🗺️</span>
        <span className="text-sm">Loading map...</span>
      </div>
    </div>
  ),
});

export default function TripMap({ destination }: { destination: string }) {
  return <TripMapInner destination={destination} />;
}
