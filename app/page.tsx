"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Coffee } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { supabase, Drink, Glassware, Temperature } from "@/utils/supabase";

function SteamAnimation({ delay = 0 }: { delay?: number }) {
  return (
    <motion.path
      d="M0 0 Q2 -3 0 -6 Q-2 -9 0 -12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: [0, -8, -12], opacity: [0, 0.8, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
    />
  );
}

function DrinkSchematic({
  glassware,
  temperature,
}: {
  glassware: Glassware;
  temperature: Temperature;
}) {
  const showSteam = temperature === "Hot" || temperature === "Both";
  const showAnimatedIce = temperature === "Iced";

  const renderGlass = () => {
    switch (glassware) {
      case "mug":
        return (
          <g>
            <path
              d="M12 14 L12 52 Q12 58 18 58 L42 58 Q48 58 48 52 L48 14 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M48 20 Q58 20 58 30 Q58 40 48 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M16 14 L44 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <path
              d="M14 24 Q30 30 46 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              opacity="0.5"
            />
          </g>
        );
      case "rocks":
        return (
          <g>
            <path
              d="M14 14 L10 52 Q10 58 16 58 L44 58 Q50 58 50 52 L46 14 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M16 14 L44 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            {showAnimatedIce ? (
              <>
                <motion.rect
                  x="20"
                  y="30"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.7"
                  animate={{ y: [-1, 1, -1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.rect
                  x="30"
                  y="36"
                  width="8"
                  height="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.5"
                  animate={{ y: [1, -1, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </>
            ) : (
              <>
                <rect
                  x="20"
                  y="30"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.6"
                  transform="rotate(-8 25 35)"
                />
                <rect
                  x="30"
                  y="36"
                  width="8"
                  height="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.4"
                  transform="rotate(12 34 40)"
                />
              </>
            )}
          </g>
        );
      case "tall-iced":
        return (
          <g>
            <path
              d="M16 10 L12 54 Q12 60 18 60 L42 60 Q48 60 48 54 L44 10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M18 10 L42 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            {showAnimatedIce ? (
              <>
                <motion.rect
                  x="22"
                  y="22"
                  width="8"
                  height="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  opacity="0.6"
                  animate={{ y: [-1, 1, -1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.rect
                  x="31"
                  y="28"
                  width="7"
                  height="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  opacity="0.5"
                  animate={{ y: [1, -1, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
                <motion.rect
                  x="24"
                  y="38"
                  width="9"
                  height="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  opacity="0.4"
                  animate={{ y: [-0.5, 0.5, -0.5] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                />
              </>
            ) : (
              <>
                <rect
                  x="22"
                  y="22"
                  width="8"
                  height="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  opacity="0.5"
                  transform="rotate(-5 26 26)"
                />
                <rect
                  x="31"
                  y="28"
                  width="7"
                  height="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  opacity="0.4"
                  transform="rotate(8 34.5 31.5)"
                />
                <rect
                  x="24"
                  y="38"
                  width="9"
                  height="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  opacity="0.3"
                  transform="rotate(-3 28.5 42.5)"
                />
              </>
            )}
            <line
              x1="30"
              y1="6"
              x2="32"
              y2="48"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx="30"
              cy="6"
              r="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </g>
        );
      default:
        return (
          <g>
            <path
              d="M12 14 L12 52 Q12 58 18 58 L42 58 Q48 58 48 52 L48 14 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </g>
        );
    }
  };

  const getSteamPosition = () => {
    switch (glassware) {
      case "mug":
        return { x: 30, y: 12 };
      case "rocks":
        return { x: 30, y: 12 };
      case "tall-iced":
        return { x: 30, y: 8 };
      default:
        return { x: 30, y: 12 };
    }
  };

  const steamPos = getSteamPosition();

  return (
    <svg
      viewBox="0 0 64 64"
      className="w-full h-full text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderGlass()}
      {showSteam && (
        <g transform={`translate(${steamPos.x}, ${steamPos.y})`}>
          <g transform="translate(-6, 0)">
            <SteamAnimation delay={0} />
          </g>
          <g transform="translate(0, 0)">
            <SteamAnimation delay={0.4} />
          </g>
          <g transform="translate(6, 0)">
            <SteamAnimation delay={0.8} />
          </g>
        </g>
      )}
    </svg>
  );
}

function hapticLight() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

function hapticHeavy() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([30, 50, 30]);
  }
}

function hapticClack() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([15]);
  }
}

function TemperatureSwitch({
  value,
  onChange,
}: {
  value: "Hot" | "Iced";
  onChange: (val: "Hot" | "Iced") => void;
}) {
  const handleSwitch = (newValue: "Hot" | "Iced") => {
    if (newValue !== value) {
      hapticClack();
      onChange(newValue);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-1 border-2 border-zinc-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]">
      <div className="flex">
        <motion.button
          onClick={() => handleSwitch("Hot")}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            flex-1 py-3 px-4 rounded-lg font-mono text-sm font-bold uppercase tracking-wider
            transition-all duration-100 relative
            ${
              value === "Hot"
                ? "bg-zinc-800 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] text-orange-500"
                : "bg-transparent text-zinc-600 hover:text-zinc-500"
            }
          `}
        >
          <span
            className={`relative z-10 ${
              value === "Hot" ? "drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" : ""
            }`}
          >
            HOT
          </span>
          {value === "Hot" && (
            <motion.div
              layoutId="tempIndicator"
              className="absolute inset-0 rounded-lg border border-orange-500/30"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
        </motion.button>

        <div className="w-px bg-zinc-700 my-2" />

        <motion.button
          onClick={() => handleSwitch("Iced")}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            flex-1 py-3 px-4 rounded-lg font-mono text-sm font-bold uppercase tracking-wider
            transition-all duration-100 relative
            ${
              value === "Iced"
                ? "bg-zinc-800 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] text-cyan-400"
                : "bg-transparent text-zinc-600 hover:text-zinc-500"
            }
          `}
        >
          <span
            className={`relative z-10 ${
              value === "Iced" ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ""
            }`}
          >
            ICED
          </span>
          {value === "Iced" && (
            <motion.div
              layoutId="tempIndicator"
              className="absolute inset-0 rounded-lg border border-cyan-400/30"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}

function DrinkRadarChart({ drink }: { drink: Drink }) {
  const data = [
    { subject: "CAFFEINE", value: drink.caffeine_level, fullMark: 10 },
    { subject: "SWEET", value: drink.sweetness_level, fullMark: 10 },
    { subject: "ACIDITY", value: drink.acidity_level, fullMark: 10 },
    { subject: "BODY", value: drink.body_level, fullMark: 10 },
    { subject: "BITTER", value: drink.bitterness_level, fullMark: 10 },
  ];

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" strokeWidth={0.5} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: "#a1a1aa",
              fontSize: 9,
              fontFamily: "monospace",
            }}
            tickLine={false}
          />
          <Radar
            name="Profile"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            fill="#10b981"
            fillOpacity={0.3}
            dot={{
              r: 3,
              fill: "#10b981",
              strokeWidth: 0,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function XYPad({
  x,
  y,
  onChangeX,
  onChangeY,
}: {
  x: number;
  y: number;
  onChangeX: (val: number) => void;
  onChangeY: (val: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastHapticRef = useRef<number>(0);
  const motionX = useMotionValue(x);
  const motionY = useMotionValue(y);

  const triggerHaptic = useCallback(() => {
    const now = Date.now();
    if (now - lastHapticRef.current > 50) {
      hapticLight();
      lastHapticRef.current = now;
    }
  }, []);

  const handleInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 16;
      const innerWidth = rect.width - padding * 2;
      const innerHeight = rect.height - padding * 2;

      const relX = clientX - rect.left - padding;
      const relY = clientY - rect.top - padding;

      const newX = Math.round(Math.max(0, Math.min(100, (relX / innerWidth) * 100)));
      const newY = Math.round(Math.max(0, Math.min(100, 100 - (relY / innerHeight) * 100)));

      const oldX = Math.round(motionX.get());
      const oldY = Math.round(motionY.get());

      if (newX !== oldX || newY !== oldY) {
        triggerHaptic();
      }

      motionX.set(newX);
      motionY.set(newY);
      onChangeX(newX);
      onChangeY(newY);
    },
    [motionX, motionY, onChangeX, onChangeY, triggerHaptic]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleInteraction(e.clientX, e.clientY);

    const handleMove = (moveEvent: MouseEvent) => {
      handleInteraction(moveEvent.clientX, moveEvent.clientY);
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleInteraction(touch.clientX, touch.clientY);

    const handleMove = (moveEvent: TouchEvent) => {
      const t = moveEvent.touches[0];
      handleInteraction(t.clientX, t.clientY);
    };

    const handleEnd = () => {
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };

    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleEnd);
  };

  const reticleX = `calc(${x}% - 20px)`;
  const reticleY = `calc(${100 - y}% - 20px)`;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="relative w-full aspect-square bg-zinc-950 rounded-xl border-2 border-zinc-800 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] cursor-crosshair select-none overflow-hidden"
      style={{ touchAction: "none" }}
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="20%"
            height="20%"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="#52525b"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#52525b" strokeWidth="1" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#52525b" strokeWidth="1" />
      </svg>

      <div className="absolute top-2 left-2 text-[8px] text-zinc-600 uppercase tracking-wider">
        LIGHT
      </div>
      <div className="absolute bottom-2 left-2 text-[8px] text-zinc-600 uppercase tracking-wider">
        STRONG
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-zinc-600 uppercase tracking-wider">
        BITTER
      </div>
      <div className="absolute bottom-2 right-2 text-[8px] text-zinc-600 uppercase tracking-wider">
        SWEET
      </div>

      <div
        className="absolute p-4"
        style={{
          left: reticleX,
          top: reticleY,
          width: "40px",
          height: "40px",
        }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-md" />

          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-orange-500 bg-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.9),inset_0_0_6px_rgba(249,115,22,0.5)]" />
        </motion.div>
      </div>
    </div>
  );
}

function VerticalFader({
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => max - i);
  const percentage = ((value - min) / (max - min)) * 100;
  const lastValueRef = useRef(value);

  const handleChange = useCallback(
    (newValue: number) => {
      if (newValue !== lastValueRef.current) {
        hapticLight();
        lastValueRef.current = newValue;
      }
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <div className="flex gap-3 items-stretch">
      <div className="flex flex-col justify-between text-[10px] text-zinc-500 font-mono py-1">
        {steps.map((step) => (
          <span
            key={step}
            className={`w-4 text-right transition-colors ${
              step <= value ? "text-orange-500" : ""
            }`}
          >
            {step}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {steps.map((step) => (
          <div
            key={step}
            className={`w-3 h-2 rounded-sm transition-all ${
              step <= value
                ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                : "bg-zinc-700"
            }`}
          />
        ))}
      </div>

      <div
        className="relative w-16 bg-zinc-950 rounded-lg border-2 border-zinc-700 cursor-ns-resize select-none"
        style={{ height: "200px" }}
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const calcValue = (clientY: number) => {
            const y = clientY - rect.top;
            const pct = 1 - Math.max(0, Math.min(1, y / rect.height));
            return Math.round(min + pct * (max - min));
          };
          handleChange(calcValue(e.clientY));

          const handleMove = (moveEvent: MouseEvent) => {
            handleChange(calcValue(moveEvent.clientY));
          };
          const handleUp = () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
          };
          window.addEventListener("mousemove", handleMove);
          window.addEventListener("mouseup", handleUp);
        }}
        onTouchStart={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const calcValue = (clientY: number) => {
            const y = clientY - rect.top;
            const pct = 1 - Math.max(0, Math.min(1, y / rect.height));
            return Math.round(min + pct * (max - min));
          };
          handleChange(calcValue(e.touches[0].clientY));

          const handleMove = (moveEvent: TouchEvent) => {
            handleChange(calcValue(moveEvent.touches[0].clientY));
          };
          const handleEnd = () => {
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("touchend", handleEnd);
          };
          window.addEventListener("touchmove", handleMove, { passive: true });
          window.addEventListener("touchend", handleEnd);
        }}
      >
        <div className="absolute inset-x-2 top-2 bottom-2 bg-zinc-900 rounded">
          <div
            className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-orange-600 to-orange-400 rounded transition-all"
            style={{ height: `${percentage}%` }}
          />
        </div>

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-14 h-6 bg-zinc-300 rounded border-2 border-zinc-400 shadow-lg cursor-grab active:cursor-grabbing"
          style={{ bottom: `calc(${percentage}% - 12px)` }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 space-y-0.5">
            <div className="h-0.5 bg-zinc-500 rounded" />
            <div className="h-0.5 bg-zinc-500 rounded" />
            <div className="h-0.5 bg-zinc-500 rounded" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function hapticProcessing() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([10, 30, 10, 50]);
  }
}

function hapticComplete() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(100);
  }
}

function findClosestDrink(
  drinks: Drink[],
  targetSweetness: number,
  targetBitterness: number,
  targetBody: number,
  targetCaffeine: number
): Drink | null {
  if (drinks.length === 0) return null;

  let closestDrink = drinks[0];
  let smallestDistance = Infinity;

  for (const drink of drinks) {
    const sweetnessDiff = drink.sweetness_level - targetSweetness;
    const bitternessDiff = drink.bitterness_level - targetBitterness;
    const bodyDiff = drink.body_level - targetBody;
    const caffeineDiff = drink.caffeine_level - targetCaffeine;

    const distance = Math.sqrt(
      sweetnessDiff ** 2 +
      bitternessDiff ** 2 +
      bodyDiff ** 2 +
      caffeineDiff ** 2
    );

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestDrink = drink;
    }
  }

  return closestDrink;
}

function ProcessingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-6 shadow-[inset_0_4px_16px_rgba(0,0,0,0.8)]"
    >
      <div className="flex flex-col items-center justify-center py-8">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          className="text-green-400 font-mono text-sm uppercase tracking-wider text-center drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
        >
          PROCESSING FLAVOR PROFILE...
        </motion.div>

        <div className="mt-6 flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: ["8px", "24px", "8px"],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
              className="w-2 bg-green-400 rounded-sm shadow-[0_0_6px_rgba(74,222,128,0.6)]"
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-[10px] text-zinc-600 uppercase tracking-wider">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          >
            ANALYZING
          </motion.span>
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          >
            MATCHING
          </motion.span>
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
          >
            BREWING
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [selectedTemp, setSelectedTemp] = useState<"Hot" | "Iced">("Iced");
  const [caffeineKick, setCaffeineKick] = useState(5);
  const [xyX, setXyX] = useState(50);
  const [xyY, setXyY] = useState(50);
  const [matchedDrink, setMatchedDrink] = useState<Drink | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBrewing, setIsBrewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetSweetness = Math.round(xyX / 10);
  const targetBitterness = Math.round(10 - xyX / 10);
  const targetBody = Math.round(xyY / 10);

  const handleBrew = async () => {
    hapticHeavy();
    setIsLoading(true);
    setIsBrewing(true);
    setError(null);
    setMatchedDrink(null);

    hapticProcessing();

    try {
      const { data: drinks, error: fetchError } = await supabase
        .from("drinks")
        .select("*");

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!drinks || drinks.length === 0) {
        throw new Error("NO DRINKS IN DATABASE");
      }

      const filteredDrinks = drinks.filter(
        (drink) =>
          drink.temperature === selectedTemp || drink.temperature === "Both"
      );

      if (filteredDrinks.length === 0) {
        throw new Error(`NO ${selectedTemp.toUpperCase()} DRINKS AVAILABLE`);
      }

      const bestMatch = findClosestDrink(
        filteredDrinks,
        targetSweetness,
        targetBitterness,
        targetBody,
        caffeineKick
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      hapticComplete();
      setIsBrewing(false);
      setMatchedDrink(bestMatch);
    } catch (err) {
      setIsBrewing(false);
      setError(err instanceof Error ? err.message : "SYSTEM ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 font-mono text-zinc-100 selection:bg-orange-500 selection:text-black">
      <div className="max-w-sm mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                PWR
              </span>
            </div>
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
              V3.0.0
            </span>
          </div>

          <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
            <h1 className="text-2xl font-bold tracking-tighter text-center">
              <span className="text-zinc-100">BREW</span>
              <span className="text-orange-500">BOT</span>
            </h1>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-[0.2em] mt-1">
              Coffee Recommendation Engine
            </p>
          </div>
        </header>

        <div className="mb-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
            TEMPERATURE
          </div>
          <TemperatureSwitch value={selectedTemp} onChange={setSelectedTemp} />
        </div>

        <div className="bg-zinc-800 rounded-2xl p-5 border-2 border-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-4">
          <div className="grid grid-cols-[auto_1fr] gap-5">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                CAFFEINE LVL
              </div>
              <VerticalFader
                value={caffeineKick}
                onChange={setCaffeineKick}
                min={1}
                max={10}
              />
              <div className="mt-3 text-center">
                <span className="text-2xl font-bold text-orange-500">
                  {caffeineKick}
                </span>
                <span className="text-zinc-500 text-sm">/10</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                FLAVOR MATRIX
              </div>
              <XYPad x={xyX} y={xyY} onChangeX={setXyX} onChangeY={setXyY} />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] mb-6">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">
            XY PAD OUTPUT
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[8px] text-zinc-500 uppercase tracking-wider mb-1">
                X: SWEETNESS
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]">
                  {xyX}
                </span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-green-400 transition-all"
                    style={{ width: `${xyX}%` }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="text-[8px] text-zinc-500 uppercase tracking-wider mb-1">
                Y: STRENGTH
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]">
                  {xyY}
                </span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-green-400 transition-all"
                    style={{ width: `${xyY}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-3 gap-3 text-[10px]">
            <div>
              <span className="text-zinc-600">SWEET: </span>
              <span className="text-orange-500 font-bold">{targetSweetness}/10</span>
            </div>
            <div>
              <span className="text-zinc-600">BITTER: </span>
              <span className="text-orange-500 font-bold">{targetBitterness}/10</span>
            </div>
            <div>
              <span className="text-zinc-600">BODY: </span>
              <span className="text-orange-500 font-bold">{targetBody}/10</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleBrew}
          disabled={isLoading}
          whileTap={{ scale: 0.98, y: 2 }}
          className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-700 disabled:cursor-not-allowed text-black font-bold py-5 px-8 rounded-xl text-lg uppercase tracking-wider transition-colors shadow-[0_6px_0_0_#c2410c,0_8px_16px_rgba(0,0,0,0.4)] active:shadow-[0_2px_0_0_#c2410c] active:translate-y-1 flex items-center justify-center gap-3 border-2 border-orange-400"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Coffee className="w-6 h-6" />
              </motion.div>
              BREWING...
            </>
          ) : (
            <>
              <Coffee className="w-6 h-6" />
              BREW
            </>
          )}
        </motion.button>

        <AnimatePresence mode="wait">
          {isBrewing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6"
            >
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_6px_rgba(234,179,8,0.8)]"
                />
                PROCESSING
              </div>
              <ProcessingScreen />
            </motion.div>
          )}

          {error && !isBrewing && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 bg-zinc-950 border-2 border-red-900 rounded-xl p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]"
            >
              <div className="text-[10px] text-red-500 uppercase tracking-wider mb-1">
                ERROR
              </div>
              <div className="text-red-400 font-mono text-sm">{error}</div>
            </motion.div>
          )}

          {matchedDrink && !isBrewing && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.8, originY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-6"
            >
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse" />
                OUTPUT
              </div>

              <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-4 shadow-[inset_0_4px_16px_rgba(0,0,0,0.8)]">
                <div className="grid grid-cols-[1fr_1fr] gap-3 mb-4">
                  <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
                    <div className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1 text-center">
                      FLAVOR PROFILE
                    </div>
                    <DrinkRadarChart drink={matchedDrink} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800 flex-1 flex flex-col items-center justify-center">
                      <div className="text-[8px] text-zinc-600 uppercase tracking-widest mb-2 text-center">
                        GLASSWARE
                      </div>
                      <div className="w-16 h-16">
                        <DrinkSchematic glassware={matchedDrink.glassware || "mug"} temperature={matchedDrink.temperature || "Hot"} />
                      </div>
                      <div className="text-[9px] text-emerald-500 uppercase tracking-wider mt-2 font-bold">
                        {matchedDrink.glassware || "MUG"}
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
                      <div className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1">
                        DRINK ID
                      </div>
                      <h2 className="text-base font-bold text-green-400 uppercase tracking-tight leading-tight drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                        {matchedDrink.name}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
                    <div className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1">
                      AROMA
                    </div>
                    <p className="text-[10px] text-zinc-300 leading-relaxed">
                      {matchedDrink.aroma_profile || "—"}
                    </p>
                  </div>

                  <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
                    <div className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1">
                      METRICS
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { label: "CAF", value: matchedDrink.caffeine_level },
                        { label: "SWT", value: matchedDrink.sweetness_level },
                        { label: "ACD", value: matchedDrink.acidity_level },
                        { label: "BDY", value: matchedDrink.body_level },
                        { label: "BTR", value: matchedDrink.bitterness_level },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="text-[7px] text-zinc-600 uppercase">
                            {stat.label}
                          </div>
                          <div className="text-[10px] font-bold text-orange-500">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800 mb-4">
                  <div className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1">
                    DESCRIPTION
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    {matchedDrink.description}
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3">
                  <div className="text-[8px] text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Coffee className="w-3 h-3" />
                    ORDER SCRIPT
                  </div>
                  <p className="text-green-400 font-bold text-sm leading-relaxed drop-shadow-[0_0_4px_rgba(74,222,128,0.4)]">
                    &quot;{matchedDrink.how_to_order}&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-8 flex items-center justify-between text-[10px] text-zinc-600 uppercase tracking-wider">
          <span>BREWBOT INDUSTRIES</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
            <span>READY</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
