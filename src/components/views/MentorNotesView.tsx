import React, { useState } from 'react';
import { 
  MentorEvaluation 
} from '../../types';
import { 
  MessageSquareQuote, 
  Star, 
  Plus, 
  Calendar, 
  UserCheck, 
  GraduationCap, 
  Trash2, 
  Edit3, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  Award,
  Filter
} from 'lucide-react';
import { formatIndonesianDate, formatShortDate, getTodayDateString, fireSuccessConfetti } from '../../utils/helpers';
import { ConfirmModal } from '../common/ConfirmModal';

interface MentorNotesViewProps {
  evaluations: MentorEvaluation[];
  onAddEvaluation: (item: MentorEvaluation) => void;
  onDeleteEvaluation: (id: string) => void;
  mentorNameDefault: string;
  supervisorNameDefault: string;
}

const CATEGORIES = [
  'Performa Kerja',
  'Kedisiplinan',
  'Inisiatif & Kreativitas',
  'Komunikasi & Kerjasama',
  'Etika & Sikap'
] as const;

export const MentorNotesView: React.FC<MentorNotesViewProps> = ({
  evaluations,
  onAddEvaluation,
  onDeleteEvaluation,
  mentorNameDefault,
  supervisorNameDefault,
}) => {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formDate, setFormDate] = useState(getTodayDateString());
  const [formMentorName, setFormMentorName] = useState(mentorNameDefault);
  const [formMentorRole, setFormMentorRole] = useState<'Pembimbing Lapangan' | 'Guru Pembimbing Sekolah'>('Pembimbing Lapangan');
  const [formCategory, setFormCategory] = useState<'Kedisiplinan' | 'Performa Kerja' | 'Inisiatif & Kreativitas' | 'Komunikasi & Kerjasama' | 'Etika & Sikap'>('Performa Kerja');
  const [formRating, setFormRating] = useState(5);
  const [formComments, setFormComments] = useState('');
  const [formRecommendations, setFormRecommendations] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setFormDate(getTodayDateString());
    setFormMentorName(mentorNameDefault);
    setFormMentorRole('Pembimbing Lapangan');
    setFormCategory('Performa Kerja');
    setFormRating(5);
    setFormComments('');
    setFormRecommendations('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMentorName.trim() || !formComments.trim()) {
      setFormError('Nama pembimbing dan komentar evaluasi wajib diisi.');
      return;
    }

    const newEval: MentorEvaluation = {
      id: `me-${Date.now()}`,
      date: formDate,
      mentorName: formMentorName.trim(),
      mentorRole: formMentorRole,
      category: formCategory,
      rating: formRating,
      comments: formComments.trim(),
      recommendations: formRecommendations.trim()
    };

    onAddEvaluation(newEval);
    fireSuccessConfetti();
    setIsModalOpen(false);
  };

  // Filter
  const filteredList = evaluations.filter(e => {
    if (filterRole === 'all') return true;
    return e.mentorRole === filterRole;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Average Rating
  const avgRating = evaluations.length > 0
    ? (evaluations.reduce((acc, curr) => acc + curr.rating, 0) / evaluations.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Catatan & Penilaian Pembimbing</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Komentar, saran perbaikan, dan evaluasi berkala dari pembimbing industri serta guru sekolah
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Catatan Evaluasi</span>
        </button>
      </div>

      {/* Average Rating Banner (Maroon Gradient) */}
      <div className="bg-gradient-to-r from-[#38060c] via-[#540b17] to-[#250307] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold text-rose-200 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
            <Award className="w-4 h-4 text-rose-300" />
            Rata-Rata Penilaian Pembimbing
          </span>
          <h3 className="text-2xl sm:text-3xl font-black">
            Performa Sangat Memuaskan
          </h3>
          <p className="text-xs sm:text-sm text-rose-100/80 max-w-lg">
            Berdasarkan {evaluations.length} evaluasi berkala dari pihak perusahaan dan guru pendamping sekolah.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shrink-0">
          <div className="text-center">
            <div className="text-4xl font-black text-amber-300 flex items-center justify-center gap-1">
              <span>{avgRating}</span>
              <span className="text-xl text-white/60">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1 text-amber-300">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(Number(avgRating)) ? 'fill-amber-300 text-amber-300' : 'text-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterRole === 'all'
                  ? 'bg-rose-950 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semua Evaluator ({evaluations.length})
            </button>
            <button
              onClick={() => setFilterRole('Pembimbing Lapangan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterRole === 'Pembimbing Lapangan'
                  ? 'bg-rose-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Pembimbing Industri
            </button>
            <button
              onClick={() => setFilterRole('Guru Pembimbing Sekolah')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterRole === 'Guru Pembimbing Sekolah'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Guru Sekolah
            </button>
          </div>
        </div>
      </div>

      {/* Evaluations Cards List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <MessageSquareQuote className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h3 className="text-base font-bold text-slate-800">Belum Ada Catatan Evaluasi</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Simpan catatan hasil bimbingan, arahan perbaikan, atau penilaian saat sesi review mingguan.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Catatan</span>
            </button>
          </div>
        ) : (
          filteredList.map((item) => {
            const isIndustry = item.mentorRole === 'Pembimbing Lapangan';

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4 hover:border-rose-300 hover:shadow-sm transition-all"
              >
                {/* Header: Evaluator name, role, date, rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${isIndustry ? 'bg-rose-50 text-rose-900' : 'bg-red-50 text-red-900'}`}>
                      {isIndustry ? <UserCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {item.mentorName}
                        </h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isIndustry ? 'bg-rose-100 text-rose-950' : 'bg-red-100 text-red-950'
                        }`}>
                          {item.mentorRole}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Tanggal Evaluasi: {formatIndonesianDate(item.date, true)}
                      </p>
                    </div>
                  </div>

                  {/* Rating stars & Delete */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black ml-1">({item.rating}.0)</span>
                    </div>

                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Category badge */}
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    Aspek Penilaian: {item.category}
                  </span>
                </div>

                {/* Comments & Recommendations */}
                <div className="space-y-3 text-xs sm:text-sm">
                  {/* Komentar & Evaluasi */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Komentar & Catatan Evaluasi:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      "{item.comments}"
                    </p>
                  </div>

                  {/* Saran Perbaikan */}
                  {item.recommendations && (
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>Saran & Rekomendasi Peningkatan:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {item.recommendations}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-rose-900" />
                <h3 className="text-base font-bold text-slate-900">
                  Tambah Catatan & Evaluasi Pembimbing
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Peran Pembimbing *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormMentorRole('Pembimbing Lapangan');
                      setFormMentorName(mentorNameDefault);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formMentorRole === 'Pembimbing Lapangan'
                        ? 'bg-rose-50 border-rose-800 text-rose-950 ring-1 ring-rose-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Pembimbing Industri
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormMentorRole('Guru Pembimbing Sekolah');
                      setFormMentorName(supervisorNameDefault);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formMentorRole === 'Guru Pembimbing Sekolah'
                        ? 'bg-red-50 border-red-800 text-red-950 ring-1 ring-red-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Guru Sekolah
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pembimbing *</label>
                <input
                  type="text"
                  required
                  value={formMentorName}
                  onChange={(e) => setFormMentorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Evaluasi *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aspek / Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nilai / Rating (1 - 5 Bintang)</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-amber-700 ml-2">
                    {formRating} Bintang
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Komentar & Catatan Evaluasi *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Penilaian terhadap kedisiplinan, pemahaman tugas, atau sikap siswa..."
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Saran & Rekomendasi Peningkatan
                </label>
                <textarea
                  rows={2}
                  placeholder="Hal yang perlu ditingkatkan oleh siswa di minggu berikutnya..."
                  value={formRecommendations}
                  onChange={(e) => setFormRecommendations(e.target.value)}
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
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Hapus Catatan Evaluasi?"
        message="Catatan evaluasi pembimbing ini akan dihapus."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeleteEvaluation(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
