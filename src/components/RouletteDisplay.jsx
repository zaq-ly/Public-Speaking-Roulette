import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, RotateCcw, Dices, Clock, Plus } from 'lucide-react';
import { playTick, playWinner } from '../utils/sound';

export default function RouletteDisplay({
  currentTopic,
  topics = [],
  remainingTopics = [],
  onSpin,
  onGoToTimer,
  onOpenSettings,
  isSpinning,
  soundEnabled,
}) {
  const [displayTitle, setDisplayTitle] = useState(
    currentTopic
      ? currentTopic.title
      : topics.length === 0
      ? "Belum ada topik pembahasan. Silakan tambahkan topik terlebih dahulu."
      : "Tekan tombol Putar Topik untuk mengacak topik."
  );
  const [displayCategory, setDisplayCategory] = useState(
    currentTopic ? currentTopic.category : "Mulai"
  );

  const prevSpinning = useRef(isSpinning);

  // When spin finishes, play winner sound and update display
  useEffect(() => {
    if (prevSpinning.current && !isSpinning && currentTopic) {
      setDisplayTitle(currentTopic.title);
      setDisplayCategory(currentTopic.category || "Topik");
      playWinner(soundEnabled);
    } else if (!isSpinning) {
      if (currentTopic) {
        setDisplayTitle(currentTopic.title);
        setDisplayCategory(currentTopic.category || "Topik");
      } else if (topics.length === 0) {
        setDisplayTitle("Belum ada topik pembahasan. Silakan tambahkan topik terlebih dahulu.");
        setDisplayCategory("Kosong");
      } else {
        setDisplayTitle("Tekan tombol Putar Topik untuk mengacak topik.");
        setDisplayCategory("Mulai");
      }
    }
    prevSpinning.current = isSpinning;
  }, [isSpinning, currentTopic, topics.length, soundEnabled]);

  // Kinetic ticker during spin
  useEffect(() => {
    if (!isSpinning) return;

    let step = 0;
    let speed = 40;
    let timeoutId = null;

    const spinStep = () => {
      step++;
      const pool = topics.length > 0 ? topics : [{ title: "Memilih...", category: "Acak" }];
      const randomIndex = Math.floor(Math.random() * pool.length);
      setDisplayTitle(pool[randomIndex].title);
      setDisplayCategory(pool[randomIndex].category || "Acak");

      playTick(soundEnabled);

      if (step < 15) {
        speed = 45;
      } else if (step < 28) {
        speed += 14;
      } else if (step < 38) {
        speed += 28;
      }

      timeoutId = setTimeout(spinStep, speed);
    };

    timeoutId = setTimeout(spinStep, speed);
    return () => clearTimeout(timeoutId);
  }, [isSpinning, topics, soundEnabled]);

  const titleLength = displayTitle ? displayTitle.length : 0;

  const getTitleTypography = () => {
    if (isSpinning) {
      return 'text-xl sm:text-2xl md:text-3xl font-black text-zinc-600 blur-[1px] leading-snug';
    }
    if (!currentTopic) {
      return 'text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 leading-relaxed text-balance';
    }
    if (titleLength > 140) {
      return 'text-base sm:text-lg md:text-xl font-bold text-zinc-950 leading-relaxed';
    }
    if (titleLength > 75) {
      return 'text-lg sm:text-xl md:text-2xl font-extrabold text-zinc-950 leading-snug';
    }
    return 'text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 leading-snug text-balance';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-0">
      {/* Transparent Liquid Glass Stage Card */}
      <div
        className={`ios-liquid-glass w-full max-w-2xl max-h-[62vh] sm:max-h-[66vh] p-6 sm:p-10 text-center transition-all duration-500 flex flex-col items-center justify-center gap-5 sm:gap-6 overflow-hidden ${
          isSpinning ? 'scale-[0.98] opacity-85' : 'scale-100 opacity-100'
        }`}
      >
        {/* Category Pill */}
        {displayCategory && (
          <div className="relative z-10 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-900 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/50 shadow-xs max-w-full truncate shrink-0">
            {displayCategory}
          </div>
        )}

        {/* Topic Title Wrapper with Max Height */}
        <div className="relative z-10 w-full max-h-[28vh] sm:max-h-[32vh] overflow-y-auto px-2 py-1 flex items-center justify-center [scrollbar-width:thin]">
          <h2
            className={`tracking-tight transition-all duration-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] w-full max-w-full break-words [overflow-wrap:anywhere] [word-break:normal] my-auto ${getTitleTypography()}`}
          >
            {currentTopic && !isSpinning ? `"${displayTitle}"` : displayTitle}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="relative z-10 mt-1 flex flex-col sm:flex-row items-center justify-center gap-3 w-full shrink-0">
          {topics.length === 0 ? (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full font-bold text-base bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Topik Sekarang</span>
            </button>
          ) : isSpinning ? (
            <button
              disabled
              className="flex items-center gap-3 px-8 py-3.5 sm:py-4 rounded-full font-bold text-base bg-white/15 text-zinc-700 border border-white/40 backdrop-blur-sm cursor-not-allowed shadow-sm"
            >
              <Dices className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              <span>Mengacak Topik...</span>
            </button>
          ) : currentTopic ? (
            <>
              <button
                onClick={onGoToTimer}
                className="group flex items-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full font-bold text-base bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Clock className="w-5 h-5" />
                <span>Siap, Mulai Timer</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onSpin}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm bg-white/20 hover:bg-white/35 text-zinc-900 border border-white/50 shadow-xs backdrop-blur-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Putar Lagi</span>
              </button>
            </>
          ) : (
            <button
              onClick={onSpin}
              className="group flex items-center gap-3 px-9 py-4 rounded-full font-bold text-base bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Dices className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" />
              <span>Putar Topik</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
