"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Zap, Candy, Sparkles } from "lucide-react";
import { supabase, Drink } from "@/utils/supabase";

function BrewBotMascot() {
  return (
    <motion.div
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-14 h-14 drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="12"
          y="16"
          width="40"
          height="36"
          rx="10"
          fill="#78716c"
          stroke="#57534e"
          strokeWidth="2"
        />
        <rect x="6" y="6" width="10" height="10" rx="3" fill="#a8a29e" />
        <rect x="48" y="6" width="10" height="10" rx="3" fill="#a8a29e" />
        <circle cx="24" cy="30" r="7" fill="#fafaf9" />
        <circle cx="40" cy="30" r="7" fill="#fafaf9" />
        <circle cx="25" cy="29" r="3" fill="#292524" />
        <circle cx="41" cy="29" r="3" fill="#292524" />
        <circle cx="26" cy="28" r="1" fill="#fafaf9" />
        <circle cx="42" cy="28" r="1" fill="#fafaf9" />
        <ellipse cx="18" cy="36" rx="3" ry="2" fill="#d6d3d1" opacity="0.6" />
        <ellipse cx="46" cy="36" rx="3" ry="2" fill="#d6d3d1" opacity="0.6" />
        <path
          d="M26 44 C30 49, 34 49, 38 44"
          stroke="#292524"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="29" y="52" width="6" height="8" rx="2" fill="#a8a29e" />
      </svg>
    </motion.div>
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
  const [sweetness, setSweetness] = useState(5);
  const [matchedDrink, setMatchedDrink] = useState<Drink | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskBarista = async () => {
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
        throw new Error("No drinks found in the menu!");
      }

      const bestMatch = findClosestDrink(drinks, caffeineKick, sweetness);
      setMatchedDrink(bestMatch);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <div className="max-w-md mx-auto px-5 py-10">
        <header className="flex flex-col items-center gap-3 mb-12">
          <BrewBotMascot />
          <h1 className="text-4xl font-extrabold text-stone-800 tracking-tight">
            BrewBot
          </h1>
          <p className="text-stone-500 text-sm">Your personal coffee concierge</p>
        </header>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/80 p-7 mb-8 border border-stone-100">
          <p className="text-center text-stone-600 mb-10 text-lg font-medium">
            Tell me your vibe, and I&apos;ll find your perfect brew
          </p>

          <div className="space-y-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <label
                    htmlFor="caffeine"
                    className="text-stone-800 font-semibold text-lg"
                  >
                    Caffeine Kick
                  </label>
                </div>
                <span className="text-lg font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-full min-w-[3.5rem] text-center">
                  {caffeineKick}/10
                </span>
              </div>
              <div className="relative">
                <input
                  id="caffeine"
                  type="range"
                  min="1"
                  max="10"
                  value={caffeineKick}
                  onChange={(e) => setCaffeineKick(Number(e.target.value))}
                  className="w-full h-4 bg-stone-200 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-8
                    [&::-webkit-slider-thumb]:h-8
                    [&::-webkit-slider-thumb]:bg-gradient-to-br
                    [&::-webkit-slider-thumb]:from-amber-400
                    [&::-webkit-slider-thumb]:to-amber-600
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-amber-300/50
                    [&::-webkit-slider-thumb]:cursor-grab
                    [&::-webkit-slider-thumb]:active:cursor-grabbing
                    [&::-webkit-slider-thumb]:active:scale-110
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:border-4
                    [&::-webkit-slider-thumb]:border-white
                    [&::-moz-range-thumb]:w-8
                    [&::-moz-range-thumb]:h-8
                    [&::-moz-range-thumb]:bg-gradient-to-br
                    [&::-moz-range-thumb]:from-amber-400
                    [&::-moz-range-thumb]:to-amber-600
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border-4
                    [&::-moz-range-thumb]:border-white
                    [&::-moz-range-thumb]:cursor-grab
                    [&::-moz-range-thumb]:shadow-lg"
                />
              </div>
              <div className="flex justify-between text-xs text-stone-400 mt-2 px-1 font-medium">
                <span>Mellow</span>
                <span>Rocket Fuel</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center">
                    <Candy className="w-5 h-5 text-pink-500" />
                  </div>
                  <label
                    htmlFor="sweetness"
                    className="text-stone-800 font-semibold text-lg"
                  >
                    Sweetness
                  </label>
                </div>
                <span className="text-lg font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-full min-w-[3.5rem] text-center">
                  {sweetness}/10
                </span>
              </div>
              <div className="relative">
                <input
                  id="sweetness"
                  type="range"
                  min="1"
                  max="10"
                  value={sweetness}
                  onChange={(e) => setSweetness(Number(e.target.value))}
                  className="w-full h-4 bg-stone-200 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-8
                    [&::-webkit-slider-thumb]:h-8
                    [&::-webkit-slider-thumb]:bg-gradient-to-br
                    [&::-webkit-slider-thumb]:from-pink-400
                    [&::-webkit-slider-thumb]:to-pink-600
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-pink-300/50
                    [&::-webkit-slider-thumb]:cursor-grab
                    [&::-webkit-slider-thumb]:active:cursor-grabbing
                    [&::-webkit-slider-thumb]:active:scale-110
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:border-4
                    [&::-webkit-slider-thumb]:border-white
                    [&::-moz-range-thumb]:w-8
                    [&::-moz-range-thumb]:h-8
                    [&::-moz-range-thumb]:bg-gradient-to-br
                    [&::-moz-range-thumb]:from-pink-400
                    [&::-moz-range-thumb]:to-pink-600
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border-4
                    [&::-moz-range-thumb]:border-white
                    [&::-moz-range-thumb]:cursor-grab
                    [&::-moz-range-thumb]:shadow-lg"
                />
              </div>
              <div className="flex justify-between text-xs text-stone-400 mt-2 px-1 font-medium">
                <span>No Sugar</span>
                <span>Dessert Mode</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAskBarista}
            disabled={isLoading}
            className="w-full mt-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-bold py-5 px-8 rounded-full text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30"
          >
            {isLoading ? (
              <>
                <Coffee className="w-6 h-6 animate-bounce" />
                Brewing your match...
              </>
            ) : (
              <>
                <Coffee className="w-6 h-6" />
                Ask the Barista
              </>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-5 text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {matchedDrink && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-3xl shadow-xl shadow-stone-300/50 p-6 overflow-hidden border border-stone-100"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex justify-center mb-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
              </motion.div>

              <div className="text-center mb-2">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                  Your Perfect Match
                </span>
              </div>

              <h2 className="text-3xl font-extrabold text-stone-800 text-center mb-3 tracking-tight">
                {matchedDrink.name}
              </h2>

              <p className="text-stone-500 text-center mb-6 leading-relaxed">
                {matchedDrink.description}
              </p>

              <div className="bg-amber-50 border-2 border-amber-200 border-dashed rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="w-5 h-5 text-amber-700" />
                  <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                    Say This at the Counter
                  </span>
                </div>
                <p className="text-stone-800 font-semibold text-xl leading-relaxed italic">
                  &ldquo;{matchedDrink.how_to_order}&rdquo;
                </p>
              </div>

              <div className="flex justify-center gap-8 pt-4 border-t border-stone-100">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-xs text-stone-400 uppercase tracking-wide font-medium block">
                    Caffeine
                  </span>
                  <span className="text-xl font-bold text-stone-700">
                    {matchedDrink.caffeine_level}/10
                  </span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mx-auto mb-2">
                    <Candy className="w-5 h-5 text-pink-500" />
                  </div>
                  <span className="text-xs text-stone-400 uppercase tracking-wide font-medium block">
                    Sweet
                  </span>
                  <span className="text-xl font-bold text-stone-700">
                    {matchedDrink.sweetness_level}/10
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center mt-12 text-stone-400 text-sm font-medium">
          Break out of your latte rut
        </footer>
      </div>
    </div>
  );
}
