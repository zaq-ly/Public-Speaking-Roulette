import React from 'react';
import { X, Trash2 } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onClearHistory,
  avoidRepeats,
  onToggleAvoidRepeats,
  totalTopicsCount,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex flex-col w-full max-w-sm h-full bg-white border-l border-zinc-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Riwayat Sesi
            </h2>
            <p className="text-xs text-zinc-500">
              {history.length} giliran telah berjalan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 space-y-3">
          <label className="flex items-center justify-between text-xs text-zinc-700 cursor-pointer">
            <span>Hindari pengulangan topik</span>
            <input
              type="checkbox"
              checked={avoidRepeats}
              onChange={(e) => onToggleAvoidRepeats(e.target.checked)}
              className="w-4 h-4 accent-zinc-900 cursor-pointer rounded"
            />
          </label>

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-200/80">
            <span>Belum keluar:</span>
            <span className="font-mono text-zinc-800">
              {Math.max(0, totalTopicsCount - history.length)} / {totalTopicsCount}
            </span>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-xs">
              Belum ada topik yang diputar pada sesi ini.
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={item.id ? `${item.id}-${idx}` : idx}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1 overflow-hidden"
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-mono text-zinc-600">Giliran #{history.length - idx}</span>
                  <span>{item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                </div>
                <p className="text-xs text-zinc-800 leading-snug break-words [overflow-wrap:anywhere] [word-break:normal]">
                  {item.title}
                </p>
                {item.category && (
                  <span className="inline-block text-[10px] text-zinc-500">
                    {item.category}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between">
          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-red-500 hover:bg-zinc-100 text-xs transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Riwayat</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
