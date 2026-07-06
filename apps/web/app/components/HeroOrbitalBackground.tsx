"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type OrbitalTile = {
  label: string;
  meta: string;
  tone: "core" | "mock" | "future" | "planned";
  x: number;
  y: number;
  depth: number;
};

const orbitalTiles: OrbitalTile[] = [
  { label: "TS", meta: "typed", tone: "core", x: 10, y: 16, depth: 0.9 },
  { label: "MCP", meta: "planned", tone: "planned", x: 64, y: 11, depth: 1.4 },
  { label: "API", meta: "adapter", tone: "planned", x: 82, y: 32, depth: 0.8 },
  { label: "RUST", meta: "future", tone: "future", x: 20, y: 42, depth: 1.2 },
  { label: "SOL", meta: "future", tone: "future", x: 72, y: 53, depth: 1.1 },
  { label: "x402", meta: "future", tone: "future", x: 36, y: 64, depth: 1.35 },
  { label: "AGENT", meta: "source", tone: "core", x: 8, y: 76, depth: 0.7 },
  { label: "PASS", meta: "passport", tone: "core", x: 52, y: 78, depth: 1 },
  { label: "TRIAL", meta: "mock", tone: "mock", x: 82, y: 78, depth: 1.25 },
  { label: "PROOF", meta: "future", tone: "future", x: 45, y: 26, depth: 1.5 },
  { label: "RANK", meta: "honor", tone: "mock", x: 24, y: 88, depth: 0.85 },
  { label: "SBT", meta: "future", tone: "future", x: 90, y: 12, depth: 1.55 }
];

export function HeroOrbitalBackground() {
  const [motion, setMotion] = useState({ x: 0, y: 0 });
  const frameRef = useRef<number>();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const nextX = event.clientX / window.innerWidth - 0.5;
      const nextY = event.clientY / window.innerHeight - 0.5;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        setMotion({ x: nextX, y: nextY });
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="heroOrbitalBackground"
      style={
        {
          "--orbital-x": motion.x.toFixed(3),
          "--orbital-y": motion.y.toFixed(3)
        } as CSSProperties
      }
    >
      <div className="orbitalCore">
        <span>BENCH</span>
        <strong>verify</strong>
      </div>
      <div className="orbitalGridLine horizontal" />
      <div className="orbitalGridLine vertical" />
      {orbitalTiles.map((tile) => (
        <span
          className={`orbitalTile ${tile.tone}`}
          key={tile.label}
          style={
            {
              "--tile-x": `${tile.x}%`,
              "--tile-y": `${tile.y}%`,
              "--tile-depth": tile.depth
            } as CSSProperties
          }
        >
          <strong>{tile.label}</strong>
          <small>{tile.meta}</small>
        </span>
      ))}
    </div>
  );
}
