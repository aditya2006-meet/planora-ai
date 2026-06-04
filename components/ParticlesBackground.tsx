"use client";

import Particles from "@tsparticles/react";

export default function ParticlesBackground() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: {
          enable: false,
        },

        background: {
          color: "transparent",
        },

        fpsLimit: 120,

        particles: {
          number: {
            value: 80,
          },

          color: {
            value: ["#38bdf8", "#8b5cf6", "#94a3b8"],
          },

          links: {
            enable: true,
            color: "#94a3b8",
            distance: 150,
            opacity: 0.2,
          },

          move: {
            enable: true,
            speed: 1,
          },

          opacity: {
            value: 0.5,
          },

          size: {
            value: { min: 1, max: 3 },
          },
        },

        detectRetina: true,
      }}
      className="absolute inset-0 z-0"
    />
  );
}