import React, { useState } from 'react';
import {
  X,
  Clock,
  Volume2,
  Check,
  CheckCircle2,
} from 'lucide-react';

export default function TimerSettingsModal({
  isOpen,
  onClose,
  timerDuration,
  onUpdateTimerDuration,
  autoStartTimer,
  onToggleAutoStartTimer,
  avoidRepeats,
  onToggleAvoidRepeats,
  soundEnabled,
  onToggleSound,
  onNotify,
}) {
  const [customSeconds, setCustomSeconds] = useState(timerDuration);

  if (!isOpen) return null;

  const notify = (message, type = 'info') => {
    if (onNotify) {
      onNotify(message, type);
    }
  };

  const handleSaveCustomDuration = (e) => {
    e.preventDefault();
    const sec = parseInt(customSeconds, 10);
    if (!isNaN(sec) && sec >= 10 && sec <= 3600) {
      onUpdateTimerDuration(sec);
      notify(`Durasi timer diatur ke ${sec} detik (${Math.floor(sec / 60)}m ${sec % 60}s)`, 'success');
    } else {
      notify('Masukkan durasi antara 10 sampai 3600 detik', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="flex flex-col w-full max-w-xl max-h-[85vh] bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Pengaturan Timer</h2>
              <p className="text-xs text-zinc-500">Atur durasi giliran dan preferensi timer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Durasi Preset */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Durasi Giliran Bicara
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Waktu default untuk setiap pembicara saat timer dimulai.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: '1 Menit', sec: 60 },
                { label: '2 Menit', sec: 120 },
                { label: '3 Menit', sec: 180 },
                { label: '5 Menit', sec: 300 },
              ].map((preset) => (
                <button
                  key={preset.sec}
                  type="button"
                  onClick={() => {
                    onUpdateTimerDuration(preset.sec);
                    setCustomSeconds(preset.sec);
                    notify(`Durasi timer diatur ke ${preset.label}`, 'success');
                  }}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    timerDuration === preset.sec
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                      : 'border-zinc-200 bg-zinc-50/70 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {timerDuration === preset.sec && <Check className="w-3.5 h-3.5" />}
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Seconds Input */}
            <form onSubmit={handleSaveCustomDuration} className="mt-4 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="3600"
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  placeholder="Atur detik kustom..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                />
                <span className="text-xs text-zinc-500 whitespace-nowrap">detik</span>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Terapkan
              </button>
            </form>
          </div>

          {/* Behavior Toggles */}
          <div className="border-t border-zinc-200 pt-5 space-y-3.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Opsi Sesi & Suara
            </label>

            {/* Auto start timer */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 cursor-pointer hover:bg-zinc-50 transition-colors">
              <div>
                <span className="text-sm font-medium text-zinc-800 block">
                  Auto-start Timer
                </span>
                <span className="text-xs text-zinc-500">
                  Mulai countdown otomatis saat memasuki halaman timer.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoStartTimer}
                onChange={(e) => {
                  onToggleAutoStartTimer(e.target.checked);
                  notify(`Auto-start ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
                }}
                className="w-4 h-4 accent-zinc-900 cursor-pointer rounded"
              />
            </label>

            {/* Avoid Repeats */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 cursor-pointer hover:bg-zinc-50 transition-colors">
              <div>
                <span className="text-sm font-medium text-zinc-800 block">
                  Hindari Pengulangan Topik
                </span>
                <span className="text-xs text-zinc-500">
                  Topik yang sudah keluar tidak akan diulang sampai semua topik habis.
                </span>
              </div>
              <input
                type="checkbox"
                checked={avoidRepeats}
                onChange={(e) => {
                  onToggleAvoidRepeats(e.target.checked);
                  notify(`Anti-pengulangan ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
                }}
                className="w-4 h-4 accent-zinc-900 cursor-pointer rounded"
              />
            </label>

            {/* Sound enabled */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 cursor-pointer hover:bg-zinc-50 transition-colors">
              <div>
                <span className="text-sm font-medium text-zinc-800 block">
                  Peringatan Suara
                </span>
                <span className="text-xs text-zinc-500">
                  Bunyikan beep peringatan 10 detik & alarm saat waktu giliran habis.
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => {
                  onToggleSound(e.target.checked);
                  notify(`Suara peringatan ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
                }}
                className="w-4 h-4 accent-zinc-900 cursor-pointer rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-200 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
