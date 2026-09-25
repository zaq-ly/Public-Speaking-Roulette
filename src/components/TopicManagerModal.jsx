import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Search,
  BookOpen,
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function TopicManagerModal({
  isOpen,
  onClose,
  topics,
  onUpdateTopics,
  onNotify,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setErrorMsg('Teks topik tidak boleh kosong');
      return;
    }
    const newTopic = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim() || 'Umum',
    };
    onUpdateTopics([newTopic, ...topics]);
    setNewTitle('');
    setNewCategory('');
    setErrorMsg('');
    notify('Topik berhasil ditambahkan', 'success');
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
    notify('Perubahan topik disimpan', 'success');
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
      notify('Topik berhasil dihapus', 'success');
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
    notify(`Berhasil menghapus ${count} topik`, 'success');
  };

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div className="flex flex-col w-full max-w-2xl max-h-[85vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">Kelola Topik</h3>
                <p className="text-xs text-zinc-500">Total {topics.length} topik terdaftar</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form & Search Area */}
          <div className="p-6 border-b border-zinc-200 space-y-4 bg-zinc-50/70">
            <form onSubmit={handleAddTopic} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tulis topik atau pertanyaan baru..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Kategori (opsional)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full sm:w-44 px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-medium text-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </div>
              {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
            </form>

            {/* Search */}
            <div className="pt-1 text-xs">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Cari topik..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            {/* Bulk Selection Bar */}
            {topics.length > 0 && (
              <div className="flex items-center justify-between pt-1 px-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-700 font-medium">
                  <input
                    type="checkbox"
                    checked={filteredTopics.length > 0 && selectedIds.size === filteredTopics.length}
                    onChange={() => toggleSelectAll(filteredTopics)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 accent-zinc-900 cursor-pointer"
                  />
                  <span>
                    Pilih Semua ({selectedIds.size}/{filteredTopics.length})
                  </span>
                </label>

                {selectedIds.size > 0 && (
                  <button
                    onClick={() => setIsDeleteBatchConfirmOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Terpilih ({selectedIds.size})</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Topics List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
            {filteredTopics.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                <p className="text-zinc-500 text-xs">
                  {topics.length === 0
                    ? 'Daftar topik masih kosong. Tambahkan topik baru pada form di atas.'
                    : 'Tidak ada topik yang sesuai pencarian.'}
                </p>
              </div>
            ) : (
              filteredTopics.map((topic, index) => (
                <div
                  key={topic.id || index}
                  className={`p-3.5 rounded-xl border transition-colors flex items-start justify-between gap-3 overflow-hidden ${
                    selectedIds.has(topic.id)
                      ? 'border-zinc-400 bg-zinc-100/90'
                      : 'border-zinc-200 bg-zinc-50/50'
                  }`}
                >
                  {editingId === topic.id ? (
                    <div className="flex-1 space-y-2 min-w-0">
                      <textarea
                        rows={2}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none break-words [overflow-wrap:anywhere] [word-break:normal]"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Kategori"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="px-2.5 py-1 rounded bg-white border border-zinc-300 text-xs text-zinc-900"
                        />
                        <button
                          onClick={() => saveEdit(topic.id)}
                          className="px-2.5 py-1 bg-zinc-900 text-white hover:bg-zinc-800 font-medium text-xs rounded cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-zinc-500 hover:text-zinc-800 text-xs cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 flex-1 min-w-0 overflow-hidden">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(topic.id)}
                          onChange={() => toggleSelectOne(topic.id)}
                          className="w-4 h-4 mt-0.5 rounded border-zinc-300 text-zinc-900 accent-zinc-900 cursor-pointer shrink-0"
                        />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="font-mono text-zinc-400">#{index + 1}</span>
                            <span className="text-zinc-500 text-[11px] font-medium">{topic.category || 'Umum'}</span>
                          </div>
                          <p className="text-sm text-zinc-900 leading-snug break-words [overflow-wrap:anywhere] [word-break:normal]">
                            {topic.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(topic)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit topik"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(topic.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus topik"
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

      {/* Confirmation Dialogs */}
      <ConfirmModal
        isOpen={deletingId !== null}
        title="Hapus Topik Ini?"
        message="Topik ini akan dihapus permanen dari daftar roulette."
        confirmText="Hapus"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <ConfirmModal
        isOpen={isDeleteBatchConfirmOpen}
        title={`Hapus ${selectedIds.size} Topik Terpilih?`}
        message={`Sebanyak ${selectedIds.size} topik yang dipilih akan dihapus permanen dari daftar.`}
        confirmText={`Ya, Hapus (${selectedIds.size})`}
        isDanger={true}
        onConfirm={confirmDeleteBatch}
        onCancel={() => setIsDeleteBatchConfirmOpen(false)}
      />
    </>
  );
}
