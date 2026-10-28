import React, { useState } from 'react';
import { 
  StudentProfile, 
  TodoTask, 
  JournalEntry, 
  AttendanceRecord, 
  CompetencyItem 
} from '../../types';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Target,
  ArrowRight
} from 'lucide-react';
import { 
  calculateInternshipProgress, 
  formatShortDate, 
  getTodayDateString, 
  fireSuccessConfetti 
} from '../../utils/helpers';

interface ProgressViewProps {
  profile: StudentProfile;
  todos: TodoTask[];
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  competencies: CompetencyItem[];
  onToggleCompetency: (id: string) => void;
  onAddCompetency: (item: Omit<CompetencyItem, 'id'>) => void;
  onDeleteCompetency: (id: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  todos,
  journals,
  attendance,
  competencies,
  onToggleCompetency,
  onAddCompetency,
  onDeleteCompetency,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newCompetencyTitle, setNewCompetencyTitle] = useState('');
  const [newCompetencyCategory, setNewCompetencyCategory] = useState<'Teknis' | 'Soft Skill' | 'Administrasi'>('Teknis');
  const [isAdding, setIsAdding] = useState(false);

  const totalPresent = attendance.filter(a => a.status === 'hadir' || a.status === 'wfh').length;
  const completedTasks = todos.filter(t => t.status === 'selesai').length;
  const completedCompetencies = competencies.filter(c => c.isCompleted).length;

  const progress = calculateInternshipProgress(
    profile.startDate,
    profile.endDate,
    totalPresent,
    profile.targetWorkDays,
    todos.length,
    completedTasks,
    competencies.length,
    completedCompetencies
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetencyTitle.trim()) return;
    onAddCompetency({
      title: newCompetencyTitle.trim(),
      category: newCompetencyCategory,
      isCompleted: false
    });
    setNewCompetencyTitle('');
    setIsAdding(false);
  };

  const handleCheck = (id: string) => {
    onToggleCompetency(id);
    fireSuccessConfetti();
  };

  const filteredCompetencies = competencies.filter(c => 
    filterCategory === 'all' || c.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Progress & Perkembangan Magang</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Akumulasi capaian tugas, durasi waktu kerja, presensi, serta penguasaan kompetensi industri
        </p>
      </div>

      {/* Hero Progress Banner (Maroon Gradient) */}
      <div className="bg-gradient-to-br from-[#38060c] via-[#540b17] to-[#250307] rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold backdrop-blur-md">
              <Award className="w-4 h-4 text-rose-300" />
              <span>Indikator Capaian Terpadu</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Progress Magang Kamu: {progress.overallPercentage}%
            </h3>

            <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl leading-relaxed">
              Dihitung berdasarkan pembobotan persentase kehadiran ({progress.attendancePercentage}%), penyelesaian tugas to-do ({progress.taskPercentage}%), penguasaan kompetensi ({progress.competencyPercentage}%), dan rentang waktu magang ({progress.timePercentage}%).
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-rose-200/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-300" />
                {progress.daysRemaining} hari tersisa hingga {formatShortDate(profile.endDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-300" />
                {totalPresent} dari target {profile.targetWorkDays} hari kerja
              </span>
            </div>
          </div>

          {/* Big Circular Ring Progress Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-36 h-36 sm:w-44 sm:h-44 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                className="text-white/15"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                className="text-rose-400 transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * progress.overallPercentage) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {progress.overallPercentage}%
              </span>
              <span className="text-[10px] uppercase font-bold text-rose-200 tracking-wider">
                Total Capaian
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Progress Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pilar 1: Kehadiran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              Kehadiran Magang
            </span>
            <span className="text-sm font-black text-emerald-700">{progress.attendancePercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress.attendancePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{totalPresent} hari hadir</span>
            <span>Target: {profile.targetWorkDays} hari</span>
          </div>
        </div>

        {/* Pilar 2: Tugas Selesai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-rose-900" />
              Penyelesaian Tugas
            </span>
            <span className="text-sm font-black text-rose-900">{progress.taskPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-rose-800 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress.taskPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{completedTasks} selesai</span>
            <span>Total: {todos.length} tugas</span>
          </div>
        </div>

        {/* Pilar 3: Penguasaan Kompetensi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-700" />
              Capaian Kompetensi
            </span>
            <span className="text-sm font-black text-amber-700">{progress.competencyPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress.competencyPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{completedCompetencies} dikuasai</span>
            <span>Dari {competencies.length} materi</span>
          </div>
        </div>

        {/* Pilar 4: Rentang Waktu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-700" />
              Durasi Waktu Kalender
            </span>
            <span className="text-sm font-black text-slate-800">{progress.timePercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-slate-700 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress.timePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{progress.daysRemaining} hari lagi</span>
            <span>Total: {progress.totalDurationDays} hari</span>
          </div>
        </div>
      </div>

      {/* Competency Checklist Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-900" />
              <h3 className="text-base font-bold text-slate-900">Daftar Kompetensi Magang (Silabus Industri)</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tandai keterampilan dan keahlian yang telah kamu kuasai selama bertugas di {profile.companyName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-800"
            >
              <option value="all">Semua Bidang</option>
              <option value="Teknis">Keahlian Teknis</option>
              <option value="Soft Skill">Soft Skill & Sikap</option>
              <option value="Administrasi">Administrasi & Budaya Kerja</option>
            </select>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-950 hover:bg-rose-100 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-rose-800" />
              <span>Tambah Target</span>
            </button>
          </div>
        </div>

        {/* Form add competency */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Contoh: Menguasai Deployment ke Cloud Run..."
              required
              value={newCompetencyTitle}
              onChange={(e) => setNewCompetencyTitle(e.target.value)}
              className="flex-1 w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
            />
            <select
              value={newCompetencyCategory}
              onChange={(e) => setNewCompetencyCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <option value="Teknis">Teknis</option>
              <option value="Soft Skill">Soft Skill</option>
              <option value="Administrasi">Administrasi</option>
            </select>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Simpan
              </button>
            </div>
          </form>
        )}

        {/* Competencies Checklist List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCompetencies.map((comp) => {
            return (
              <div
                key={comp.id}
                onClick={() => handleCheck(comp.id)}
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer group select-none ${
                  comp.isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : 'bg-white border-slate-200/80 hover:border-rose-300 hover:bg-slate-50/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  comp.isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border-2 border-slate-300 group-hover:border-rose-800 bg-white'
                }`}>
                  {comp.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      comp.category === 'Teknis'
                        ? 'bg-rose-100 text-rose-900'
                        : comp.category === 'Soft Skill'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {comp.category}
                    </span>
                    {comp.completedDate && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Tercapai: {formatShortDate(comp.completedDate)}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold mt-1 leading-snug ${
                    comp.isCompleted ? 'text-slate-700 line-through decoration-emerald-500/50' : 'text-slate-800'
                  }`}>
                    {comp.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCompetency(comp.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-600 transition-opacity"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ringkasan & Saran Evaluasi */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 space-y-3">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-900" />
          Tips & Panduan Mempertahankan Progress
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-1">
            <span className="font-bold text-slate-800">1. Konsistensi Jurnal</span>
            <p>Usahakan mencatat kegiatan setiap hari maksimal jam 17:30 WIB agar ingatan tugas masih segar.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-1">
            <span className="font-bold text-slate-800">2. Diskusikan dengan Pembimbing</span>
            <p>Minta feedback mingguan kepada mentor untuk memastikan target kompetensi sesuai dengan standar industri.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-1">
            <span className="font-bold text-slate-800">3. Siapkan Refleksi & Bukti</span>
            <p>Simpan dokumentasi foto pekerjaan untuk dilampirkan pada laporan akhir sidang magang sekolah.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
