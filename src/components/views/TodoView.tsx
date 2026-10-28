import React, { useState } from 'react';
import { 
  TodoTask, 
  TaskPriority, 
  TaskStatus 
} from '../../types';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  X, 
  Search, 
  Filter, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { 
  formatShortDate, 
  getRelativeDays, 
  getTodayDateString, 
  fireSuccessConfetti 
} from '../../utils/helpers';
import { ConfirmModal } from '../common/ConfirmModal';

interface TodoViewProps {
  todos: TodoTask[];
  onAddTodo: (task: TodoTask) => void;
  onUpdateTodo: (task: TodoTask) => void;
  onDeleteTodo: (id: string) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; border: string }> = {
  belum: { label: 'Belum Dikerjakan', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  sedang: { label: 'Sedang Dikerjakan', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  selesai: { label: 'Selesai', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; bg: string; text: string }> = {
  tinggi: { label: 'Prioritas Tinggi', bg: 'bg-rose-200', text: 'text-rose-950' },
  sedang: { label: 'Prioritas Sedang', bg: 'bg-amber-100', text: 'text-amber-800' },
  rendah: { label: 'Prioritas Rendah', bg: 'bg-slate-100', text: 'text-slate-700' },
};

export const TodoView: React.FC<TodoViewProps> = ({
  todos,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const [activeTab, setActiveTab] = useState<'semua' | TaskStatus>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoTask | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState(getTodayDateString());
  const [formPriority, setFormPriority] = useState<TaskPriority>('sedang');
  const [formStatus, setFormStatus] = useState<TaskStatus>('belum');
  const [formCategory, setFormCategory] = useState('Development');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingTodo(null);
    setFormTitle('');
    setFormDescription('');
    setFormDueDate(getTodayDateString());
    setFormPriority('sedang');
    setFormStatus('belum');
    setFormCategory('Development');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: TodoTask) => {
    setEditingTodo(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormDueDate(task.dueDate);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormCategory(task.category);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Judul tugas wajib diisi.');
      return;
    }

    if (editingTodo) {
      const isNowCompleted = formStatus === 'selesai' && editingTodo.status !== 'selesai';
      const updated: TodoTask = {
        ...editingTodo,
        title: formTitle.trim(),
        description: formDescription.trim(),
        dueDate: formDueDate,
        priority: formPriority,
        status: formStatus,
        category: formCategory.trim() || 'Umum',
        completedAt: formStatus === 'selesai' ? (editingTodo.completedAt || new Date().toISOString()) : undefined
      };
      onUpdateTodo(updated);
      if (isNowCompleted) fireSuccessConfetti();
    } else {
      const newTask: TodoTask = {
        id: `todo-${Date.now()}`,
        title: formTitle.trim(),
        description: formDescription.trim(),
        dueDate: formDueDate,
        priority: formPriority,
        status: formStatus,
        category: formCategory.trim() || 'Umum',
        createdAt: new Date().toISOString(),
        completedAt: formStatus === 'selesai' ? new Date().toISOString() : undefined
      };
      onAddTodo(newTask);
      if (formStatus === 'selesai') fireSuccessConfetti();
    }

    setIsModalOpen(false);
  };

  // Quick cycle status: belum -> sedang -> selesai -> belum
  const handleCycleStatus = (task: TodoTask) => {
    let nextStatus: TaskStatus = 'belum';
    if (task.status === 'belum') nextStatus = 'sedang';
    else if (task.status === 'sedang') nextStatus = 'selesai';
    else if (task.status === 'selesai') nextStatus = 'belum';

    const updated: TodoTask = {
      ...task,
      status: nextStatus,
      completedAt: nextStatus === 'selesai' ? new Date().toISOString() : undefined
    };
    onUpdateTodo(updated);
    if (nextStatus === 'selesai') fireSuccessConfetti();
  };

  // Filter tasks
  const filteredTodos = todos.filter(t => {
    const matchesTab = activeTab === 'semua' || t.status === activeTab;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;

    return matchesTab && matchesSearch && matchesPriority;
  }).sort((a, b) => {
    if (a.status === 'selesai' && b.status !== 'selesai') return 1;
    if (a.status !== 'selesai' && b.status === 'selesai') return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const countBelum = todos.filter(t => t.status === 'belum').length;
  const countSedang = todos.filter(t => t.status === 'sedang').length;
  const countSelesai = todos.filter(t => t.status === 'selesai').length;

  return (
    <div className="space-y-6">
      {/* Header & New Task button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">To-Do List Tugas Magang</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola tugas harian, sprint pekerjaan dari mentor, tenggat waktu, dan status pengerjaan
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      {/* Tabs by Status (Belum, Sedang, Selesai) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('semua')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'semua'
              ? 'bg-rose-950 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua Tugas ({todos.length})
        </button>
        <button
          onClick={() => setActiveTab('belum')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'belum'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Belum Dikerjakan</span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-200/60 text-[11px] font-extrabold">
            {countBelum}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('sedang')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'sedang'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <span>Sedang Dikerjakan</span>
          <span className="px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[11px] font-extrabold">
            {countSedang}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('selesai')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'selesai'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <span>Selesai</span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[11px] font-extrabold">
            {countSelesai}
          </span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas magang atau kategori..."
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

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-800"
          >
            <option value="all">Semua Prioritas</option>
            <option value="tinggi">Prioritas Tinggi</option>
            <option value="sedang">Prioritas Sedang</option>
            <option value="rendah">Prioritas Rendah</option>
          </select>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <CheckSquare className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada tugas ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || filterPriority !== 'all'
                ? 'Tidak ada tugas yang sesuai kriteria pencarian.'
                : 'Buat tugas baru untuk merencanakan pekerjaan magang yang diberikan oleh pembimbing.'}
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        ) : (
          filteredTodos.map((task) => {
            const relDays = getRelativeDays(task.dueDate);
            const isOverdue = relDays.includes('Terlewat') && task.status !== 'selesai';
            const isToday = relDays === 'Hari ini' && task.status !== 'selesai';
            const statusBadge = STATUS_CONFIG[task.status];
            const priorityBadge = PRIORITY_CONFIG[task.priority];

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm ${
                  task.status === 'selesai'
                    ? 'border-slate-200/60 bg-slate-50/40 opacity-90'
                    : isOverdue
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200/80 hover:border-rose-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox trigger, Title, Meta */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Status clicker */}
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(task)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        task.status === 'selesai'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : task.status === 'sedang'
                          ? 'border-2 border-amber-500 bg-amber-50 text-amber-600'
                          : 'border-2 border-slate-300 hover:border-rose-800 bg-white'
                      }`}
                      title="Klik untuk ubah status tugas"
                    >
                      {task.status === 'selesai' && <CheckCircle2 className="w-4 h-4" />}
                      {task.status === 'sedang' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                    </button>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${priorityBadge.bg} ${priorityBadge.text}`}>
                          {priorityBadge.label}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {task.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                          {statusBadge.label}
                        </span>
                      </div>

                      <h4 className={`text-sm sm:text-base font-bold text-slate-900 ${
                        task.status === 'selesai' ? 'line-through text-slate-400' : ''
                      }`}>
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Due date info */}
                      <div className="flex items-center gap-3 pt-1 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Tenggat: {formatShortDate(task.dueDate)}
                        </span>
                        <span className={`font-semibold ${
                          isOverdue ? 'text-rose-700 font-bold' : isToday ? 'text-amber-700 font-bold' : 'text-slate-500'
                        }`}>
                          ({relDays})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(task)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Ubah Status</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Edit Tugas"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Tugas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-rose-900" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingTodo ? 'Ubah Tugas Magang' : 'Tambah Tugas Magang Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-900 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tugas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Membuat Komponen Modal dan Uji Coba Responsif"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Catatan Tugas</label>
                <textarea
                  rows={3}
                  placeholder="Instruksi mentor, kriteria keberhasilan, atau file rujukan..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tenggat Waktu (Deadline) *</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Tugas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Development, Desain, Riset, Laporan"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Prioritas</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  >
                    <option value="tinggi">Prioritas Tinggi</option>
                    <option value="sedang">Prioritas Sedang</option>
                    <option value="rendah">Prioritas Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Pengerjaan</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  >
                    <option value="belum">Belum Dikerjakan</option>
                    <option value="sedang">Sedang Dikerjakan</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-colors"
                >
                  {editingTodo ? 'Simpan Perubahan' : 'Tambah Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Hapus Tugas?"
        message="Tugas ini akan dihapus dari daftar to-do list magangmu."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeleteTodo(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
