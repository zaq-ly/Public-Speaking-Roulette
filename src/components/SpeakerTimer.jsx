import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, Clock } from 'lucide-react';
import { playWarning, playCountdownTick, playTimeUp } from '../utils/sound';

export default function SpeakerTimer({
  currentTopic,
  duration = 120,
  autoStart = true,
  soundEnabled = true,
  topicKey = 0,
  isFullscreen = false,
  onBack,
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const prevTopicKey = useRef(topicKey);

  // Sync when duration setting changes from settings
  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
  }, [duration]);

  // When a new topic is triggered: reset to duration & auto-start if configured
  useEffect(() => {
    if (topicKey !== 0 && topicKey !== prevTopicKey.current) {
      prevTopicKey.current = topicKey;
      setTimeLeft(duration);
      setIsRunning(autoStart);
    }
  }, [topicKey, duration, autoStart]);

  // Timer tick interval
  useEffect(() => {
    let timerId = null;
    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playTimeUp(soundEnabled);
            return 0;
          }
          // Warning sound at 10s
          if (prev === 11) {
            playWarning(soundEnabled);
          } else if (prev <= 4 && prev > 1) {
            playCountdownTick(soundEnabled);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, soundEnabled]);

  const toggleRun = useCallback(() => setIsRunning((prev) => !prev), []);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        toggleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleRun]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const percentage = duration > 0 ? (timeLeft / duration) * 100 : 0;

  const isLowTime = timeLeft <= 10 && timeLeft > 0;
  const isTimeUp = timeLeft === 0;

  const titleLength = currentTopic?.title ? currentTopic.title.length : 0;
  const getTimerTitleTypography = () => {
    if (titleLength > 140) {
      return 'text-sm sm:text-base md:text-lg font-bold leading-relaxed';
    }
    if (titleLength > 75) {
      return 'text-base sm:text-lg md:text-xl font-extrabold leading-snug';
    }
    return isFullscreen
      ? 'text-xl sm:text-2xl md:text-3xl font-black leading-snug text-balance'
      : 'text-lg sm:text-xl md:text-2xl font-black leading-snug text-balance';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-0 animate-in fade-in duration-300">
      {/* Transparent Liquid Glass Stage Card */}
      <div className={`ios-liquid-glass w-full ${isFullscreen ? 'max-w-3xl max-h-[86vh] p-5 sm:p-8' : 'max-w-2xl max-h-[82vh] sm:max-h-[85vh] p-5 sm:p-7 md:p-8'} flex flex-col items-center gap-3 sm:gap-4 text-center overflow-y-auto [scrollbar-width:none] transition-all duration-300`}>
        {/* Topik Pembahasan Header */}
        {currentTopic && (
          <div className="relative z-10 w-full max-w-full shrink-0 flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/50 shadow-xs backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-zinc-900 max-w-full truncate shrink-0">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="shrink-0">Topik Pembahasan</span>
              {currentTopic.category && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-500 shrink-0" />
                  <span className="font-semibold text-zinc-700 truncate">{currentTopic.category}</span>
                </>
              )}
            </div>

            <div className="w-full max-h-[14vh] sm:max-h-[18vh] overflow-y-auto px-2 flex items-center justify-center [scrollbar-width:thin]">
              <h2 className={`text-zinc-950 tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] w-full max-w-xl mx-auto break-words [overflow-wrap:anywhere] [word-break:normal] my-auto ${getTimerTitleTypography()}`}>
                "{currentTopic.title}"
              </h2>
            </div>
          </div>
        )}

        {/* Liquid Divider */}
        <div className="relative z-10 w-full h-px bg-zinc-900/10 my-0.5 shrink-0" />

        {/* Timer Section */}
        <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3 w-full max-w-md shrink-0">
          {/* Big Digital Countdown */}
          <div
            className={`font-mono font-black tracking-tight select-none tabular-nums drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] leading-none transition-all duration-300 ${
              isFullscreen
                ? 'text-7xl sm:text-8xl md:text-9xl my-1 sm:my-2'
                : 'text-6xl sm:text-7xl md:text-8xl'
            } ${
              isTimeUp
                ? 'text-red-600 animate-pulse'
                : isLowTime
                ? 'text-amber-600'
                : 'text-zinc-950'
            }`}
          >
            {timeFormatted}
          </div>

          {/* Compact Sleek Progress Indicator */}
          <div className="w-full max-w-[170px] sm:max-w-[210px] flex flex-col gap-1 my-0.5 opacity-90">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500 px-1">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isTimeUp
                      ? 'bg-red-500 animate-ping'
                      : isLowTime
                      ? 'bg-amber-500 animate-pulse'
                      : isRunning
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-zinc-400'
                  }`}
                />
                {isTimeUp ? 'Waktu Habis' : isLowTime ? 'Segera Habis' : isRunning ? 'Berjalan' : 'Siap'}
              </span>
              <span className="font-mono text-zinc-600 tabular-nums">{Math.round(percentage)}%</span>
            </div>

            <div className="w-full h-1 bg-zinc-900/10 rounded-full overflow-hidden backdrop-blur-xs p-0">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isTimeUp
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                    : isLowTime
                    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-zinc-900'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Compact Controls - Subordinate to timer */}
          <div className="flex items-center gap-2.5 mt-0.5">
            <button
              onClick={toggleRun}
              className={`flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                isRunning
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              <span>{isRunning ? 'Jeda' : isTimeUp ? 'Ulangi' : 'Mulai Timer'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-zinc-800 border border-white/50 backdrop-blur-sm transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
              title="Reset Waktu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Shortcut hint */}
          <p className="text-[10px] text-zinc-500 font-medium select-none">
            Tekan <kbd className="px-1.5 py-0.5 rounded bg-white/30 border border-white/50 font-mono text-[9px] text-zinc-800 shadow-xs">Spasi</kbd> untuk Jeda / Lanjut
          </p>
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="relative z-10 pt-1 border-t border-zinc-900/10 w-full flex justify-center shrink-0">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-white/30 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Acak Topik</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
