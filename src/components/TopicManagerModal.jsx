import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Search,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const PRESET_TOPICS = [
  { id: 'preset-1', title: 'Storytelling Efektif dalam Presentasi', category: 'Public Speaking' },
  { id: 'preset-2', title: 'Membangun Personal Branding di Era Digital', category: 'Bisnis' },
  { id: 'preset-3', title: 'Cara Mengatasi Rasa Gugup dan Blank di Panggung', category: 'Public Speaking' },
  { id: 'preset-4', title: 'Kepemimpinan yang Menginspirasi Tim', category: 'Kepemimpinan' },
  { id: 'preset-5', title: 'Manajemen Waktu: Yang Penting vs Mendesak', category: 'Produktivitas' },
  { id: 'preset-6', title: 'Pengalaman Berharga yang Mengubah Hidup', category: 'Inspirasi' },
  { id: 'preset-7', title: 'Dampak AI Terhadap Karir Masa Depan', category: 'Teknologi' },
  { id: 'preset-8', title: 'Pesan Singkat 3 Menit untuk Generasi Muda', category: 'Ice Breaking' },
];

export default function TopicManagerModal({
  isOpen,
  onClose,
  topics,
  onUpdateTopics,
  onNotify,
}) {
  const [newTitle, setNewTitle] = useState('');
  const [categoryType, setCategoryType] = useState('Umum');
  const [customCategory, setCustomCategory] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDeleteBatchConfirmOpen, setIsDeleteBatchConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const notify = (message, type = 'info') => {
    if (onNotify) {
      onNotify(message, type);
    } else {
      setErrorMsg(message);
    }
  };

  const getActiveCategory = () => {
    if (categoryType === 'custom') {
      return customCategory.trim() || 'Umum';
    }
    return categoryType;
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setErrorMsg('Tulis topik terlebih dahulu');
      return;
    }
    const newTopic = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: getActiveCategory(),
    };
    onUpdateTopics([newTopic, ...topics]);
    setNewTitle('');
    setErrorMsg('');
    notify('Topik berhasil ditambahkan', 'success');
  };

  const handleBulkAdd = () => {
    const lines = bulkText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      setErrorMsg('Masukkan minimal satu topik');
      return;
    }

    const cat = getActiveCategory();
    const newTopics = lines.map((line, idx) => ({
      id: `bulk-${Date.now()}-${idx}`,
      title: line,
      category: cat,
    }));

    onUpdateTopics([...newTopics, ...topics]);
    setBulkText('');
    setIsBulkOpen(false);
    setErrorMsg('');
    notify(`${newTopics.length} topik berhasil ditambahkan`, 'success');
  };

  const handleLoadPresets = () => {
    const freshPresets = PRESET_TOPICS.map((t, idx) => ({
      ...t,
      id: `preset-${Date.now()}-${idx}`,
    }));
    onUpdateTopics([...freshPresets, ...topics]);
    notify(`${freshPresets.length} topik rekomendasi dimuat`, 'success');
  };

  const startEdit = (topic) => {
    setEditingId(topic.id);
    setEditTitle(topic.title);
    setEditCategory(topic.category || 'Umum');
  };

  const saveEdit = (id) => {
    if (!editTitle.trim()) return;
    const updated = topics.map((t) =>
      t.id === id ? { ...t, title: editTitle.trim(), category: editCategory.trim() || 'Umum' } : t
    );
    onUpdateTopics(updated);
    setEditingId(null);
    notify('Perubahan disimpan', 'success');
  };

  const handleDeleteRequest = (id) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onUpdateTopics(topics.filter((t) => t.id !== deletingId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingId);
        return next;
      });
      setDeletingId(null);
      notify('Topik dihapus', 'success');
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = (filtered) => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((t) => t.id)));
    }
  };

  const confirmDeleteBatch = () => {
    const count = selectedIds.size;
    onUpdateTopics(topics.filter((t) => !selectedIds.has(t.id)));
    setSelectedIds(new Set());
    setIsDeleteBatchConfirmOpen(false);
    notify(`${count} topik berhasil dihapus`, 'success');
  };

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs">
        <div className="flex flex-col w-full max-w-xl max-h-[88vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">Kelola Topik</h3>
                <p className="text-xs text-zinc-500 font-medium">
                  {topics.length} topik terdaftar
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sederhana: Form Input Topik */}
          <div className="p-5 bg-zinc-50/70 border-b border-zinc-200 shrink-0 space-y-2.5">
            <form onSubmit={handleAddTopic} className="space-y-2.5">
              {/* Baris Utama: Input Topik + Tombol Tambah */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tulis topik baru..."
                  value={newTitle}
                  onChange={(e) => { setNewTitle(e.target.value); setErrorMsg(''); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 shadow-2xs"
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer shrink-0 hover:scale-[1.02] active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </div>

              {/* Baris Kedua: Pilihan Kategori Ringkas & Opsi Bulk */}
              <div className="flex items-center justify-between text-xs text-zinc-500 px-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Kategori:</span>
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-zinc-800 text-xs cursor-pointer focus:outline-none focus:border-zinc-400"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Public Speaking">Public Speaking</option>
                    <option value="Bisnis">Bisnis</option>
                    <option value="Ice Breaking">Ice Breaking</option>
                    <option value="Kepemimpinan">Kepemimpinan</option>
                    <option value="custom">+ Kategori Lain...</option>
                  </select>

                  {categoryType === 'custom' && (
                    <input
                      type="text"
                      placeholder="Nama kategori"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-28 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                      autoFocus
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsBulkOpen(!isBulkOpen)}
                  className="text-zinc-500 hover:text-zinc-900 underline cursor-pointer text-xs"
                >
                  {isBulkOpen ? 'Tutup input sekaligus' : 'Tempel banyak topik'}
                </button>
              </div>

              {errorMsg && <p className="text-xs text-red-500 font-medium px-1">{errorMsg}</p>}
            </form>

            {/* Input Sekaligus (Hanya muncul jika diklik) */}
            {isBulkOpen && (
              <div className="pt-2 border-t border-zinc-200/60 space-y-2 animate-in fade-in duration-150">
                <textarea
                  rows={3}
                  placeholder="Tempel beberapa topik di sini (1 baris = 1 topik)..."
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkOpen(false)}
                    className="px-3 py-1 rounded-lg text-xs text-zinc-500 hover:text-zinc-800 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkAdd}
                    className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Simpan Semua Topik
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Toolbar (Muncul jika ada topik) */}
          {topics.length > 0 && (
            <div className="px-5 py-2.5 border-b border-zinc-100 bg-white flex items-center justify-between gap-3 shrink-0">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Cari topik..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-zinc-600 font-medium">
                  <input
                    type="checkbox"
                    checked={filteredTopics.length > 0 && selectedIds.size === filteredTopics.length}
                    onChange={() => toggleSelectAll(filteredTopics)}
                    className="w-3.5 h-3.5 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
                  />
                  <span>Pilih Semua</span>
                </label>

                {selectedIds.size > 0 && (
                  <button
                    onClick={() => setIsDeleteBatchConfirmOpen(true)}
                    className="px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Hapus ({selectedIds.size})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Daftar Topik */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 min-h-[160px]">
            {topics.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center gap-2.5">
                <div className="p-2.5 rounded-full bg-zinc-100 text-zinc-500">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">Daftar Topik Kosong</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Tulis topik di atas atau gunakan topik rekomendasi.</p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadPresets}
                  className="mt-1 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                >
                  + Muat 8 Topik Rekomendasi
                </button>
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                Tidak ada topik yang cocok dengan "{searchTerm}".
              </div>
            ) : (
              filteredTopics.map((topic, index) => (
                <div
                  key={topic.id || index}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    selectedIds.has(topic.id)
                      ? 'border-zinc-400 bg-zinc-100/90'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  {editingId === topic.id ? (
                    <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => saveEdit(topic.id)}
                          className="px-3 py-1.5 bg-zinc-900 text-white font-semibold text-xs rounded-lg cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1.5 text-zinc-500 hover:text-zinc-800 text-xs cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(topic.id)}
                          onChange={() => toggleSelectOne(topic.id)}
                          className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="text-xs font-medium text-zinc-900 truncate">
                            {topic.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-semibold shrink-0">
                            {topic.category || 'Umum'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(topic)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(topic.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-zinc-100 flex items-center justify-between bg-white shrink-0">
            {topics.length > 0 ? (
              <button
                type="button"
                onClick={handleLoadPresets}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>+ Rekomendasi Topik</span>
              </button>
            ) : <div />}

            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Selesai
            </button>
          </div>

        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmModal
        isOpen={deletingId !== null}
        title="Hapus Topik Ini?"
        message="Topik ini akan dihapus dari daftar acak."
        confirmText="Hapus"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <ConfirmModal
        isOpen={isDeleteBatchConfirmOpen}
        title={`Hapus ${selectedIds.size} Topik?`}
        message={`Sebanyak ${selectedIds.size} topik yang dipilih akan dihapus permanen.`}
        confirmText={`Hapus (${selectedIds.size})`}
        isDanger={true}
        onConfirm={confirmDeleteBatch}
        onCancel={() => setIsDeleteBatchConfirmOpen(false)}
      />
    </>
  );
}
