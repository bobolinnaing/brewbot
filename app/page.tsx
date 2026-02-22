"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Coffee } from "lucide-react";
import { supabase, Drink } from "@/utils/supabase";

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

function findClosestDrink(
  drinks: Drink[],
  caffeinePreference: number,
  sweetnessPreference: number
): Drink | null {
  if (drinks.length === 0) return null;

  let closestDrink = drinks[0];
  let smallestDistance = Infinity;

  for (const drink of drinks) {
    const caffeineDiff = drink.caffeine_level - caffeinePreference;
    const sweetnessDiff = drink.sweetness_level - sweetnessPreference;
    const distance = Math.sqrt(caffeineDiff ** 2 + sweetnessDiff ** 2);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestDrink = drink;
    }
  }

  return closestDrink;
}

export default function Home() {
  const [caffeineKick, setCaffeineKick] = useState(5);
  const [xyX, setXyX] = useState(50);
  const [xyY, setXyY] = useState(50);
  const [matchedDrink, setMatchedDrink] = useState<Drink | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sweetnessFromXY = Math.round((xyX / 100) * 10);
  const strengthFromXY = Math.round((1 - xyY / 100) * 10);

  const handleBrew = async () => {
    hapticHeavy();
    setIsLoading(true);
    setError(null);
    setMatchedDrink(null);

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

      const bestMatch = findClosestDrink(drinks, caffeineKick, sweetnessFromXY);
      setMatchedDrink(bestMatch);
    } catch (err) {
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
              V2.0.0
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
          <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-2 gap-4 text-[10px]">
            <div>
              <span className="text-zinc-600">SWEET LVL: </span>
              <span className="text-orange-500 font-bold">{sweetnessFromXY}/10</span>
            </div>
            <div>
              <span className="text-zinc-600">STRENGTH LVL: </span>
              <span className="text-orange-500 font-bold">{strengthFromXY}/10</span>
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
          {error && (
            <motion.div
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

          {matchedDrink && (
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

              <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)]">
                <div className="border-b border-zinc-800 pb-4 mb-4">
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                    RECOMMENDATION
                  </div>
                  <h2 className="text-2xl font-bold text-green-400 uppercase tracking-tight drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                    {matchedDrink.name}
                  </h2>
                </div>

                <div className="mb-4">
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                    DESCRIPTION
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {matchedDrink.description}
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-4">
                  <div className="text-[10px] text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Coffee className="w-3 h-3" />
                    ORDER SCRIPT
                  </div>
                  <p className="text-green-400 font-bold text-lg leading-relaxed drop-shadow-[0_0_4px_rgba(74,222,128,0.4)]">
                    &quot;{matchedDrink.how_to_order}&quot;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-700">
                    <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                      CAFFEINE
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-orange-500">
                        {matchedDrink.caffeine_level}
                      </span>
                      <span className="text-zinc-600 text-sm">/10</span>
                    </div>
                    <div className="mt-2 flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-sm ${
                            i < matchedDrink.caffeine_level
                              ? "bg-orange-500"
                              : "bg-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-700">
                    <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                      SWEETNESS
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-green-400">
                        {matchedDrink.sweetness_level}
                      </span>
                      <span className="text-zinc-600 text-sm">/10</span>
                    </div>
                    <div className="mt-2 flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-sm ${
                            i < matchedDrink.sweetness_level
                              ? "bg-green-400"
                              : "bg-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
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
