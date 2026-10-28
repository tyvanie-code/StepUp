import React, { useState, useEffect } from 'react';
import { 
  JournalEntry, 
  MoodType 
} from '../../types';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Smile, 
  HelpCircle, 
  Frown, 
  Meh, 
  Filter, 
  X, 
  Eye, 
  BookOpen
} from 'lucide-react';
import { formatIndonesianDate, formatShortDate, getTodayDateString, getCurrentTimeString } from '../../utils/helpers';
import { ConfirmModal } from '../common/ConfirmModal';

interface JournalViewProps {
  journals: JournalEntry[];
  onAddJournal: (journal: JournalEntry) => void;
  onUpdateJournal: (journal: JournalEntry) => void;
  onDeleteJournal: (id: string) => void;
  isCreateOpenInitially?: boolean;
  onCloseCreateModal?: () => void;
}

const MOOD_CONFIG: Record<MoodType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  semangat: { label: 'Sangat Bersemangat', icon: Sparkles, color: 'text-rose-800', bg: 'bg-rose-50 border-rose-200' },
  senang: { label: 'Senang & Produktif', icon: Smile, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  biasa: { label: 'Biasa Saja', icon: Meh, color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
  lelah: { label: 'Cukup Lelah', icon: Frown, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  bingung: { label: 'Butuh Arahan', icon: HelpCircle, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
};

export const JournalView: React.FC<JournalViewProps> = ({
  journals,
  onAddJournal,
  onUpdateJournal,
  onDeleteJournal,
  isCreateOpenInitially = false,
  onCloseCreateModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(isCreateOpenInitially);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [detailJournal, setDetailJournal] = useState<JournalEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formDate, setFormDate] = useState(getTodayDateString());
  const [formStartTime, setFormStartTime] = useState('08:30');
  const [formEndTime, setFormEndTime] = useState('17:00');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formKeyLearnings, setFormKeyLearnings] = useState('');
  const [formObstacles, setFormObstacles] = useState('');
  const [formSolutions, setFormSolutions] = useState('');
  const [formMood, setFormMood] = useState<MoodType>('semangat');
  const [formTagInput, setFormTagInput] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  // Collect all unique tags
  const allTags = Array.from(new Set(journals.flatMap(j => j.tags || [])));

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    onCloseCreateModal?.();
  };

  const openCreateModal = () => {
    setEditingJournal(null);
    setFormDate(getTodayDateString());
    setFormStartTime('08:30');
    setFormEndTime(getCurrentTimeString() > '17:00' ? getCurrentTimeString() : '17:00');
    setFormTitle('');
    setFormDescription('');
    setFormKeyLearnings('');
    setFormObstacles('');
    setFormSolutions('');
    setFormMood('semangat');
    setFormTags(['Praktik Kerja', 'Mandiri']);
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Sync when isCreateOpenInitially changes from navbar / quick action
  useEffect(() => {
    if (isCreateOpenInitially) {
      openCreateModal();
    }
  }, [isCreateOpenInitially]);

  const openEditModal = (journal: JournalEntry) => {
    setEditingJournal(journal);
    setFormDate(journal.date);
    setFormStartTime(journal.startTime);
    setFormEndTime(journal.endTime);
    setFormTitle(journal.title);
    setFormDescription(journal.description);
    setFormKeyLearnings(journal.keyLearnings);
    setFormObstacles(journal.obstacles);
    setFormSolutions(journal.solutions);
    setFormMood(journal.mood);
    setFormTags(journal.tags || []);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleAddTag = () => {
    const trimmed = formTagInput.trim();
    if (trimmed && !formTags.includes(trimmed)) {
      setFormTags([...formTags, trimmed]);
      setFormTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags(formTags.filter(t => t !== tagToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      setFormError('Judul kegiatan dan deskripsi kegiatan wajib diisi.');
      return;
    }

    if (editingJournal) {
      const updated: JournalEntry = {
        ...editingJournal,
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        title: formTitle.trim(),
        description: formDescription.trim(),
        keyLearnings: formKeyLearnings.trim(),
        obstacles: formObstacles.trim(),
        solutions: formSolutions.trim(),
        mood: formMood,
        tags: formTags
      };
      onUpdateJournal(updated);
    } else {
      const newEntry: JournalEntry = {
        id: `jrn-${Date.now()}`,
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        title: formTitle.trim(),
        description: formDescription.trim(),
        keyLearnings: formKeyLearnings.trim(),
        obstacles: formObstacles.trim(),
        solutions: formSolutions.trim(),
        mood: formMood,
        tags: formTags.length > 0 ? formTags : ['Harian'],
        verifiedByMentor: false,
        createdAt: new Date().toISOString()
      };
      onAddJournal(newEntry);
    }

    closeFormModal();
  };

  // Filter journals
  const filteredJournals = journals.filter(j => {
    const matchesSearch = 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.keyLearnings.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood = filterMood === 'all' || j.mood === filterMood;
    const matchesTag = selectedTag === 'all' || j.tags?.includes(selectedTag);

    return matchesSearch && matchesMood && matchesTag;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Jurnal Harian Magang</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Catatan aktivitas, proses belajar, kendala teknis, dan solusi selama kegiatan magang
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jurnal Harian</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul kegiatan, materi yang dipelajari, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mood Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-800"
            >
              <option value="all">Semua Mood</option>
              <option value="semangat">Bersemangat</option>
              <option value="senang">Senang & Produktif</option>
              <option value="biasa">Biasa Saja</option>
              <option value="lelah">Lelah</option>
              <option value="bingung">Butuh Arahan</option>
            </select>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-800"
            >
              <option value="all">Semua Tag</option>
              {allTags.map(t => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Journal Cards List */}
      <div className="space-y-4">
        {filteredJournals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {searchQuery || filterMood !== 'all' || selectedTag !== 'all'
                ? 'Tidak ditemukan jurnal yang cocok'
                : 'Belum Ada Catatan Jurnal Harian'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery || filterMood !== 'all' || selectedTag !== 'all'
                ? 'Coba ubah kata kunci pencarian atau reset filter untuk melihat catatan jurnal lainnya.'
                : 'Dokumentasikan setiap hari apa yang kamu kerjakan, pelajari, dan tantangan yang kamu hadapi di tempat magang.'}
            </p>
            <button
              onClick={openCreateModal}
              className="mt-5 px-5 py-2.5 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Jurnal Hari Ini</span>
            </button>
          </div>
        ) : (
          filteredJournals.map((journal) => {
            const moodInfo = MOOD_CONFIG[journal.mood] || MOOD_CONFIG.biasa;
            const MoodIcon = moodInfo.icon;

            return (
              <div
                key={journal.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all space-y-4"
              >
                {/* Header row: Date, Time, Mood, and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-950 text-xs font-bold border border-rose-200">
                      <Calendar className="w-3.5 h-3.5 text-rose-800" />
                      {formatIndonesianDate(journal.date, true)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {journal.startTime} - {journal.endTime} WIB
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${moodInfo.bg} ${moodInfo.color}`}>
                      <MoodIcon className="w-3.5 h-3.5" />
                      <span>{moodInfo.label}</span>
                    </span>
                    {journal.verifiedByMentor && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Diverifikasi
                      </span>
                    )}
                  </div>

                  {/* Actions buttons: Detail, Edit, Delete */}
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setDetailJournal(journal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-900 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Lihat Detail Lengkap"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(journal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Ubah Jurnal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(journal.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Jurnal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {journal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {journal.description}
                  </p>
                </div>

                {/* Grid Learning, Obstacles & Solutions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Hal yang Dipelajari */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950">
                      <Sparkles className="w-3.5 h-3.5 text-rose-800" />
                      <span>Hal yang Dipelajari:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {journal.keyLearnings || 'Belum diisi'}
                    </p>
                  </div>

                  {/* Kendala & Solusi */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100/80 space-y-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Kendala yang Dihadapi:</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
                        {journal.obstacles || 'Tidak ada kendala berarti'}
                      </p>
                    </div>

                    {journal.solutions && (
                      <div className="pt-1.5 border-t border-amber-200/50">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Solusi yang Dilakukan:</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
                          {journal.solutions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags Footer */}
                {journal.tags && journal.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {journal.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-900">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {editingJournal ? 'Ubah Jurnal Harian' : 'Tulis Jurnal Harian Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isi catatan aktivitas magang sesuai format standar PKL
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeFormModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup Formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Tanggal & Waktu Kegiatan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kegiatan *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai *</label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai *</label>
                  <input
                    type="time"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
              </div>

              {/* Judul Kegiatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul / Ringkasan Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Implementasi Tampilan Form & Validasi Sisi Klien"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              {/* Deskripsi Kegiatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Kegiatan Lengkap *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan secara rinci tugas apa saja yang dikerjakan, alat/software yang digunakan, serta pihak yang terlibat..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              {/* Hal yang Dipelajari */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hal yang Dipelajari (Key Learnings) *
                </label>
                <textarea
                  rows={2}
                  placeholder="Ilmu, teknologi, wawasan industri, atau soft skill baru apa yang kamu peroleh hari ini..."
                  value={formKeyLearnings}
                  onChange={(e) => setFormKeyLearnings(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              {/* Kendala & Solusi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kendala yang Dihadapi
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Kesulitan teknis, komunikasi, atau masalah yang muncul..."
                    value={formObstacles}
                    onChange={(e) => setFormObstacles(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Solusi yang Dilakukan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Langkah atau cara yang dilakukan untuk menyelesaikan kendala..."
                    value={formSolutions}
                    onChange={(e) => setFormSolutions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
              </div>

              {/* Mood Pelaksanaan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kondisi / Mood Kerja</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(MOOD_CONFIG) as MoodType[]).map((m) => {
                    const info = MOOD_CONFIG[m];
                    const Icon = info.icon;
                    const isSelected = formMood === m;

                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormMood(m)}
                        className={`flex flex-col items-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? `${info.bg} ${info.color} ring-2 ring-rose-800`
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-[11px] text-center">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags / Kategori */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label / Tag Topik</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ketik tag lalu tekan enter atau klik Tambah (contoh: React, Figma, Meeting)"
                    value={formTagInput}
                    onChange={(e) => setFormTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Tambah
                  </button>
                </div>

                {formTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-900 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-colors"
                >
                  {editingJournal ? 'Simpan Perubahan' : 'Terbitkan Jurnal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                  {formatIndonesianDate(detailJournal.date, true)}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {detailJournal.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Waktu: {detailJournal.startTime} - {detailJournal.endTime} WIB
                </p>
              </div>
              <button
                onClick={() => setDetailJournal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Deskripsi Kegiatan
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl">
                  {detailJournal.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-1">
                  Hal yang Dipelajari (Key Learnings)
                </h4>
                <p className="text-slate-700 leading-relaxed bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
                  {detailJournal.keyLearnings || '-'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider mb-1">
                    Kendala
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-amber-50/70 p-3.5 rounded-xl border border-amber-100">
                    {detailJournal.obstacles || 'Tidak ada'}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-1">
                    Solusi
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                    {detailJournal.solutions || 'Tidak ada'}
                  </p>
                </div>
              </div>

              {detailJournal.tags && detailJournal.tags.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {detailJournal.tags.map((t, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const toEdit = detailJournal;
                  setDetailJournal(null);
                  openEditModal(toEdit);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-900 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                Ubah Jurnal Ini
              </button>
              <button
                onClick={() => setDetailJournal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Hapus Jurnal Harian?"
        message="Catatan jurnal ini akan dihapus secara permanen dari logbook magangmu. Pastikan kamu tidak lagi membutuhkan data ini."
        confirmLabel="Ya, Hapus Jurnal"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeleteJournal(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
