import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  History as HistoryIcon,
  BookOpen,
  Clock,
  Menu,
  X
} from 'lucide-react';
import RouletteDisplay from './components/RouletteDisplay';
import SpeakerTimer from './components/SpeakerTimer';
import TopicManagerModal from './components/TopicManagerModal';
import TimerSettingsModal from './components/TimerSettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import bgImage from './assets/bg.png';
import growthLogo from './assets/logo-growth.png';
import years31Logo from './assets/logo-31years.png';

const STORAGE_KEYS = {
  TOPICS: 'psr_topics_v2',
  HISTORY: 'psr_history_v1',
  TIMER_DURATION: 'psr_timer_duration_v1',
  AUTO_START: 'psr_auto_start_v1',
  SOUND_ENABLED: 'psr_sound_enabled_v1',
  AVOID_REPEATS: 'psr_avoid_repeats_v1',
};

export default function App() {
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOPICS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [timerDuration, setTimerDuration] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMER_DURATION);
      if (saved) return Number(saved) || 120;
    } catch (e) {}
    return 120;
  });

  const [autoStartTimer, setAutoStartTimer] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTO_START);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true;
  });

  const [avoidRepeats, setAvoidRepeats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AVOID_REPEATS);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true;
  });

  const [currentTopic, setCurrentTopic] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [topicKey, setTopicKey] = useState(0);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeView, setActiveView] = useState('roulette'); // 'roulette' | 'timer'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Non-blocking UI Toast & Confirm dialog state
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  // Selalu default & kunci ke mode terang
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMER_DURATION, String(timerDuration));
  }, [timerDuration]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTO_START, JSON.stringify(autoStartTimer));
  }, [autoStartTimer]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AVOID_REPEATS, JSON.stringify(avoidRepeats));
  }, [avoidRepeats]);

  const remainingTopics = useMemo(() => {
    if (!avoidRepeats) return topics;
    const usedIds = new Set(history.map((h) => h.id));
    return topics.filter((t) => !usedIds.has(t.id));
  }, [topics, history, avoidRepeats]);

  const handleSpin = useCallback(() => {
    if (isSpinning || topics.length === 0) return;

    let pool = remainingTopics;
    if (avoidRepeats && pool.length === 0) {
      pool = topics;
      setHistory([]);
      showToast('Semua topik sudah selesai, putaran baru dimulai', 'info');
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];

    setIsSpinning(true);

    setTimeout(() => {
      setCurrentTopic(selected);
      setIsSpinning(false);
      setHistory((prev) => [
        {
          ...selected,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    }, 2000);
  }, [isSpinning, topics, remainingTopics, avoidRepeats, showToast]);

  const handleGoToTimer = useCallback(() => {
    if (!currentTopic) return;
    setTopicKey(Date.now());
    setActiveView('timer');
  }, [currentTopic]);

  const handleResetSession = useCallback(() => {
    setConfirmDialog({
      title: 'Mulai Putaran Baru?',
      message: 'Riwayat sesi saat ini akan di-reset agar seluruh topik dapat diacak kembali.',
      confirmText: 'Reset Putaran',
      isDanger: false,
      onConfirm: () => {
        setHistory([]);
        setCurrentTopic(null);
        setConfirmDialog(null);
        showToast('Putaran sesi berhasil di-reset', 'success');
      },
    });
  }, [showToast]);

  const handleClearHistory = useCallback(() => {
    setConfirmDialog({
      title: 'Hapus Riwayat Sesi?',
      message: 'Semua daftar topik yang telah dibahas pada sesi ini akan dikosongkan.',
      confirmText: 'Hapus Riwayat',
      isDanger: true,
      onConfirm: () => {
        setHistory([]);
        setConfirmDialog(null);
        showToast('Riwayat sesi telah dikosongkan', 'success');
      },
    });
  }, [showToast]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (activeView === 'roulette') {
          handleSpin();
        }
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'm') {
        setSoundEnabled((prev) => {
          const next = !prev;
          showToast(next ? 'Suara diaktifkan' : 'Suara dimatikan', 'info');
          return next;
        });
      } else if (e.key.toLowerCase() === 'h') {
        setIsHistoryOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 't') {
        setIsTopicModalOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 's') {
        setIsTimerModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSpin, showToast, activeView]);

  return (
    <div 
      className="h-screen h-[100dvh] w-full overflow-hidden flex flex-col justify-between text-zinc-900 bg-[length:100%_100%] bg-no-repeat relative select-none"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 w-full px-10 sm:px-16 md:px-28 lg:px-40 xl:px-48 h-16 sm:h-20 flex items-center justify-between shrink-0">
        {/* Brand Logos without background */}
        <div className="flex items-center gap-3 sm:gap-4 py-2">
          <img
            src={growthLogo}
            alt="Growth Indonesia"
            className="h-9 sm:h-11 md:h-12 w-auto object-contain drop-shadow-sm"
          />
          <div className="h-6 sm:h-8 w-px bg-zinc-800/25" />
          <img
            src={years31Logo}
            alt="31 Years"
            className="h-9 sm:h-11 md:h-12 w-auto object-contain drop-shadow-sm"
          />
        </div>

        {/* Hamburger Menu without background */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-black/5 transition-all cursor-pointer text-zinc-900 hover:scale-105 active:scale-95"
          title="Menu"
        >
          <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
        </button>
      </header>

      {/* Web Title (Fixed & Static) */}
      <div className={`w-full text-center px-4 shrink-0 z-10 transition-all duration-300 ${isFullscreen ? 'mt-4 sm:mt-6 mb-1 sm:mb-2' : 'mt-2 sm:mt-3.5'}`}>
        <h1
          className={`font-black tracking-tight text-zinc-900 drop-shadow-xs transition-all duration-300 ${
            isFullscreen
              ? 'text-4xl sm:text-6xl md:text-7xl'
              : 'text-3xl sm:text-4xl md:text-5xl'
          }`}
        >
          Latihan Public Speaking
        </h1>
        <p
          className={`text-zinc-800 drop-shadow-xs transition-all duration-300 ${
            isFullscreen
              ? 'mt-1.5 text-sm sm:text-base md:text-lg font-semibold'
              : 'mt-1 sm:mt-1.5 text-sm sm:text-base font-semibold'
          }`}
        >
          Acak topik spontan dan latih kemampuan berbicara Anda
        </p>
      </div>

      {/* Main Stage */}
      <main className="flex-1 flex flex-col justify-center items-center max-w-4xl w-full mx-auto px-4 sm:px-6 pb-6 relative z-10 min-h-0">
        {activeView === 'roulette' ? (
          <RouletteDisplay
            currentTopic={currentTopic}
            topics={topics}
            remainingTopics={remainingTopics}
            onSpin={handleSpin}
            onGoToTimer={handleGoToTimer}
            onOpenSettings={() => setIsTopicModalOpen(true)}
            isSpinning={isSpinning}
            soundEnabled={soundEnabled}
            isFullscreen={isFullscreen}
          />
        ) : (
          <SpeakerTimer
            currentTopic={currentTopic}
            duration={timerDuration}
            autoStart={autoStartTimer}
            soundEnabled={soundEnabled}
            topicKey={topicKey}
            isFullscreen={isFullscreen}
            onBack={() => {
              setActiveView('roulette');
            }}
          />
        )}
      </main>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 right-0 w-80 max-w-full bg-white border-l border-zinc-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <h2 className="font-semibold text-lg text-zinc-900">Menu</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {/* Menu Item 1: Kelola Topik */}
          <button 
            onClick={() => { setIsTopicModalOpen(true); setIsSidebarOpen(false); }} 
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-zinc-50 text-left transition-colors cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-zinc-500" />
            <div>
              <div className="font-medium text-sm text-zinc-900">Kelola Topik</div>
              <div className="text-xs text-zinc-500 mt-0.5">Tambah, edit, atau hapus daftar topik ({topics.length})</div>
            </div>
          </button>

          {/* Menu Item 2: Pengaturan Timer */}
          <button 
            onClick={() => { setIsTimerModalOpen(true); setIsSidebarOpen(false); }} 
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-zinc-50 text-left transition-colors cursor-pointer"
          >
            <Clock className="w-5 h-5 text-zinc-500" />
            <div>
              <div className="font-medium text-sm text-zinc-900">Pengaturan Timer</div>
              <div className="text-xs text-zinc-500 mt-0.5">Durasi giliran ({timerDuration}s) & opsi sesi</div>
            </div>
          </button>

          {/* Menu Item 3: Riwayat Sesi */}
          <button 
            onClick={() => { setIsHistoryOpen(true); setIsSidebarOpen(false); }} 
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-zinc-50 text-left transition-colors cursor-pointer"
          >
            <HistoryIcon className="w-5 h-5 text-zinc-500" />
            <div className="flex-1">
              <div className="font-medium text-sm text-zinc-900">Riwayat Sesi</div>
              <div className="text-xs text-zinc-500 mt-0.5">Lihat topik yang sudah dibahas</div>
            </div>
            {history.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-100 text-zinc-600 font-mono">
                {history.length}
              </span>
            )}
          </button>

          <div className="my-2 border-t border-zinc-100" />

          {/* Suara Alert Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-zinc-50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-zinc-500" /> : <VolumeX className="w-5 h-5 text-zinc-500" />}
              <div className="font-medium text-sm text-zinc-900">Suara Alert</div>
            </div>
            <div className={`w-8 h-4.5 rounded-full transition-colors relative ${soundEnabled ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
              <div className={`absolute top-0.5 left-0.5 bg-white w-3.5 h-3.5 rounded-full transition-transform ${soundEnabled ? 'translate-x-3.5' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Layar Penuh Toggle */}
          <button 
            onClick={toggleFullscreen} 
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-zinc-50 text-left transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-zinc-500" /> : <Maximize2 className="w-5 h-5 text-zinc-500" />}
            <div className="font-medium text-sm text-zinc-900">
              {isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
            </div>
          </button>
        </div>
      </div>

      {/* Standalone Topic Manager Modal */}
      <TopicManagerModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        topics={topics}
        onUpdateTopics={setTopics}
        onNotify={showToast}
      />

      {/* Standalone Timer Settings Modal */}
      <TimerSettingsModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        timerDuration={timerDuration}
        onUpdateTimerDuration={setTimerDuration}
        autoStartTimer={autoStartTimer}
        onToggleAutoStartTimer={setAutoStartTimer}
        avoidRepeats={avoidRepeats}
        onToggleAvoidRepeats={setAvoidRepeats}
        soundEnabled={soundEnabled}
        onToggleSound={setSoundEnabled}
        onNotify={showToast}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        avoidRepeats={avoidRepeats}
        onToggleAvoidRepeats={setAvoidRepeats}
        totalTopicsCount={topics.length}
      />

      {/* Global Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmModal
          isOpen={true}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          isDanger={confirmDialog.isDanger}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
