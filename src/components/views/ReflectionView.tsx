import React, { useState } from 'react';
import { 
  SelfReflection 
} from '../../types';
import { 
  Sparkles, 
  Plus, 
  Calendar, 
  Edit3, 
  Trash2, 
  X, 
  Award, 
  TrendingUp, 
  Target, 
  HeartHandshake, 
  Lightbulb, 
  CheckCircle2, 
  Quote
} from 'lucide-react';
import { formatIndonesianDate, formatShortDate, getTodayDateString, fireSuccessConfetti } from '../../utils/helpers';
import { ConfirmModal } from '../common/ConfirmModal';

interface ReflectionViewProps {
  reflections: SelfReflection[];
  onAddReflection: (reflection: SelfReflection) => void;
  onUpdateReflection: (reflection: SelfReflection) => void;
  onDeleteReflection: (id: string) => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  reflections,
  onAddReflection,
  onUpdateReflection,
  onDeleteReflection,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SelfReflection | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formPeriodTitle, setFormPeriodTitle] = useState('');
  const [formDate, setFormDate] = useState(getTodayDateString());
  const [formExperience, setFormExperience] = useState('');
  const [formSkillInput, setFormSkillInput] = useState('');
  const [formSkills, setFormSkills] = useState<string[]>([]);
  const [formChallenges, setFormChallenges] = useState('');
  const [formGrowth, setFormGrowth] = useState('');
  const [formGoals, setFormGoals] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setFormPeriodTitle(`Refleksi Periode Magang #${reflections.length + 1}`);
    setFormDate(getTodayDateString());
    setFormExperience('');
    setFormSkills(['Komunikasi Tim', 'Kemandirian Kerja']);
    setFormChallenges('');
    setFormGrowth('');
    setFormGoals('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: SelfReflection) => {
    setEditingItem(item);
    setFormPeriodTitle(item.periodTitle);
    setFormDate(item.date);
    setFormExperience(item.memorableExperience);
    setFormSkills(item.newSkills || []);
    setFormChallenges(item.mainChallenges);
    setFormGrowth(item.personalGrowth);
    setFormGoals(item.goalsToImprove);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleAddSkill = () => {
    const trimmed = formSkillInput.trim();
    if (trimmed && !formSkills.includes(trimmed)) {
      setFormSkills([...formSkills, trimmed]);
      setFormSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormSkills(formSkills.filter(s => s !== skill));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPeriodTitle.trim() || !formExperience.trim() || !formGrowth.trim()) {
      setFormError('Judul periode, pengalaman berkesan, dan perkembangan diri wajib diisi.');
      return;
    }

    if (editingItem) {
      const updated: SelfReflection = {
        ...editingItem,
        periodTitle: formPeriodTitle.trim(),
        date: formDate,
        memorableExperience: formExperience.trim(),
        newSkills: formSkills,
        mainChallenges: formChallenges.trim(),
        personalGrowth: formGrowth.trim(),
        goalsToImprove: formGoals.trim(),
      };
      onUpdateReflection(updated);
    } else {
      const newItem: SelfReflection = {
        id: `ref-${Date.now()}`,
        periodTitle: formPeriodTitle.trim(),
        date: formDate,
        memorableExperience: formExperience.trim(),
        newSkills: formSkills.length > 0 ? formSkills : ['Pengalaman Industri'],
        mainChallenges: formChallenges.trim(),
        personalGrowth: formGrowth.trim(),
        goalsToImprove: formGoals.trim(),
      };
      onAddReflection(newItem);
      fireSuccessConfetti();
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Refleksi Diri Siswa</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluasi proses belajar mandiri, transformasi diri, keterampilan baru, dan rencana peningkatan
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Refleksi Baru</span>
        </button>
      </div>

      {/* Inspirational Quote Banner (Maroon Glow) */}
      <div className="bg-gradient-to-r from-rose-50 via-red-50/60 to-rose-100/40 border border-rose-200/80 rounded-3xl p-6 relative overflow-hidden">
        <Quote className="w-20 h-20 text-rose-300/40 absolute -right-2 -bottom-2 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-800" />
            Makna Praktik Kerja Lapangan
          </span>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed italic">
            "Magang bukan sekadar menyelesaikan jam kerja, melainkan jembatan transformasi dari seorang siswa menjadi calon profesional yang berkarakter, tangguh, dan siap berkarya."
          </p>
        </div>
      </div>

      {/* Reflection Cards */}
      <div className="space-y-6">
        {reflections.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <Sparkles className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h3 className="text-base font-bold text-slate-800">Belum Ada Catatan Refleksi Diri</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Luangkan waktu sejenak untuk merenungkan apa saja perubahan positif yang kamu rasakan semenjak magang di tempat kerja.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Mulai Tulis Refleksi</span>
            </button>
          </div>
        ) : (
          reflections.map((ref) => {
            return (
              <div
                key={ref.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 hover:shadow-md transition-shadow"
              >
                {/* Header: Title, Date, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-800" />
                        {formatIndonesianDate(ref.date, true)}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                      {ref.periodTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => openEditModal(ref)}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      title="Ubah Refleksi"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(ref.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Refleksi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 5 Core Reflection Components */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Pengalaman Berkesan */}
                  <div className="md:col-span-2 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                      <Sparkles className="w-4 h-4 text-rose-800" />
                      <span>Pengalaman Paling Berkesan Selama Magang:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{ref.memorableExperience}"
                    </p>
                  </div>

                  {/* 2. Keterampilan Baru yang Diperoleh */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Keterampilan & Wawasan Baru:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ref.newSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 shadow-2xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. Tantangan yang Dihadapi */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>Tantangan Utama & Cara Menghadapinya:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {ref.mainChallenges}
                    </p>
                  </div>

                  {/* 4. Perkembangan Diri */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <TrendingUp className="w-4 h-4 text-rose-800" />
                      <span>Perkembangan & Perubahan Diri:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {ref.personalGrowth}
                    </p>
                  </div>

                  {/* 5. Hal yang Ingin Ditingkatkan */}
                  <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                      <Lightbulb className="w-4 h-4 text-rose-800" />
                      <span>Target & Hal yang Ingin Ditingkatkan:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {ref.goalsToImprove}
                    </p>
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
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-900" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingItem ? 'Ubah Refleksi Diri' : 'Tulis Lembar Refleksi Diri Baru'}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Periode Refleksi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Refleksi Tengah Periode Magang"
                    value={formPeriodTitle}
                    onChange={(e) => setFormPeriodTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
              </div>

              {/* 1. Pengalaman Berkesan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Pengalaman Paling Berkesan Selama Magang *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ceritakan momen yang paling membekas, misalnya saat berhasil menyelesaikan proyek pertama, presentasi, atau interaksi dengan tim..."
                  value={formExperience}
                  onChange={(e) => setFormExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              {/* 2. Keterampilan Baru */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Keterampilan Baru yang Diperoleh (Hard Skill / Soft Skill)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ketik skill lalu klik Tambah (contoh: Version Control Git, Stand-up Meeting)"
                    value={formSkillInput}
                    onChange={(e) => setFormSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700"
                  >
                    Tambah
                  </button>
                </div>

                {formSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-lg"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Tantangan & Solusi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Tantangan Terbesar yang Dihadapi & Solusinya
                </label>
                <textarea
                  rows={2}
                  placeholder="Kendala apa yang paling menyulitkan dan bagaimana kamu berusaha menyelesaikannya..."
                  value={formChallenges}
                  onChange={(e) => setFormChallenges(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              {/* 4. Perkembangan Diri */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. Perkembangan Diri (Sebelum vs Sesudah Magang) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Perubahan kedisiplinan, pola pikir kerja, keberanian berkomunikasi, dsb..."
                  value={formGrowth}
                  onChange={(e) => setFormGrowth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              {/* 5. Hal yang Ingin Ditingkatkan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5. Hal yang Ingin Ditingkatkan ke Depannya
                </label>
                <textarea
                  rows={2}
                  placeholder="Target perbaikan diri sebelum masa magang usai..."
                  value={formGoals}
                  onChange={(e) => setFormGoals(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
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
                  Simpan Refleksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Hapus Lembar Refleksi?"
        message="Catatan refleksi diri ini akan dihapus secara permanen."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeleteReflection(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
