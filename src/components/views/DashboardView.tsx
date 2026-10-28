import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  Calendar, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  ArrowUpRight,
  BookOpen,
  Sparkles,
  CalendarCheck,
  Award,
  CheckSquare,
  FileText,
  MessageSquareQuote,
  Image as ImageIcon,
  BarChart3,
  User,
  Settings,
  ArrowRight
} from 'lucide-react';
import { 
  StudentProfile, 
  JournalEntry, 
  AttendanceRecord, 
  TodoTask, 
  CompetencyItem,
  NavTab 
} from '../../types';
import { 
  formatIndonesianDate, 
  formatShortDate, 
  calculateInternshipProgress, 
  getTodayDateString,
  getRelativeDays
} from '../../utils/helpers';

interface DashboardViewProps {
  profile: StudentProfile;
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  todos: TodoTask[];
  competencies: CompetencyItem[];
  onNavigate: (tab: NavTab) => void;
  onOpenJournalModal: () => void;
  onOpenCheckInModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  journals,
  attendance,
  todos,
  competencies,
  onNavigate,
  onOpenJournalModal,
  onOpenCheckInModal,
}) => {
  const todayStr = getTodayDateString();
  const todayAttendance = attendance.find(a => a.date === todayStr);

  // Stats calculation
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

  const pendingTodos = todos.filter(t => t.status !== 'selesai').slice(0, 3);
  const recentJournals = [...journals]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const hasJournalToday = journals.some(j => j.date === todayStr);

  return (
    <div className="space-y-6">
      {/* 1. Hero Profile & Internship Card (Maroon Gradient) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#38060c] via-[#540b17] to-[#250307] rounded-3xl text-white shadow-xl p-6 sm:p-8">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Student Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-rose-400/30 shadow-lg border-2 border-white/20"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg text-[10px] font-bold shadow-xs">
                Aktif
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-400/20 text-rose-200 border border-rose-400/30">
                  {profile.classGrade}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10">
                  NISN: {profile.nisn}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {profile.fullName}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-rose-100/80">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-rose-300 shrink-0" />
                  {profile.schoolName}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-rose-300 shrink-0" />
                  {profile.companyName}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 w-full lg:w-72 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-rose-300" />
                Progress Magang
              </span>
              <span className="text-xl font-black text-white">{progress.overallPercentage}%</span>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 h-full rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${progress.overallPercentage}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-rose-100/90 font-medium">
              <span>{progress.daysRemaining} hari tersisa</span>
              <span>{totalPresent} dari {profile.targetWorkDays} hari kerja</span>
            </div>
          </div>
        </div>

        {/* Details Row: Division, Mentor, Period */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-rose-200/70 text-[11px] font-medium">Divisi / Bagian</p>
            <p className="font-semibold text-white mt-0.5">{profile.department}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-rose-200/70 text-[11px] font-medium">Pembimbing Lapangan</p>
            <p className="font-semibold text-white mt-0.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-rose-300" />
              {profile.mentorName}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-rose-200/70 text-[11px] font-medium">Periode Magang</p>
            <p className="font-semibold text-white mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-300" />
              {formatShortDate(profile.startDate)} — {formatShortDate(profile.endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Notification & Reminder Banners */}
      {(!hasJournalToday || !todayAttendance?.checkInTime) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!todayAttendance?.checkInTime && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950">Kamu Belum Absen Masuk</h4>
                  <p className="text-xs text-amber-800">Catat kehadiranmu hari ini sekarang.</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="px-3 py-1.5 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow-xs transition-colors shrink-0"
              >
                Absen Masuk
              </button>
            </div>
          )}

          {!hasJournalToday && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-900/10 text-rose-900 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-950">Jurnal Hari Ini Belum Terisi</h4>
                  <p className="text-xs text-rose-800">Tulis apa saja yang sudah kamu kerjakan hari ini.</p>
                </div>
              </div>
              <button
                onClick={onOpenJournalModal}
                className="px-3 py-1.5 text-xs font-bold bg-rose-900 hover:bg-rose-950 text-white rounded-xl shadow-xs transition-colors shrink-0"
              >
                Isi Jurnal
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Stat Cards Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Kehadiran */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Hadir</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {totalPresent} <span className="text-xs font-medium text-slate-400">hari</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <span>Target: {profile.targetWorkDays} hari</span>
          </p>
        </div>

        {/* Jurnal Terbuat */}
        <div 
          onClick={() => onNavigate('journal')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Jurnal Harian</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-900 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {journals.length} <span className="text-xs font-medium text-slate-400">catatan</span>
          </p>
          <p className="text-[11px] text-rose-800 font-medium mt-1">
            {journals.filter(j => j.verifiedByMentor).length} terverifikasi
          </p>
        </div>

        {/* Tugas Selesai */}
        <div 
          onClick={() => onNavigate('todo')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tugas Magang</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {completedTasks} <span className="text-xs font-medium text-slate-400">/ {todos.length}</span>
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            {todos.filter(t => t.status !== 'selesai').length} masih aktif
          </p>
        </div>

        {/* Kompetensi Dicapai */}
        <div 
          onClick={() => onNavigate('progress')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kompetensi</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-900 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {completedCompetencies} <span className="text-xs font-medium text-slate-400">/ {competencies.length}</span>
          </p>
          <p className="text-[11px] text-rose-800 font-medium mt-1">
            {Math.round((completedCompetencies / Math.max(1, competencies.length)) * 100)}% tercapai
          </p>
        </div>
      </div>

      {/* 4. Interactive Feature Grid - Direct 1-Click Access to Every Module */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-900" />
              Pusat Fitur Magang Siswa
            </h3>
            <p className="text-xs text-slate-500">
              Klik salah satu fitur di bawah untuk langsung membuka dan mengelola modul magang
            </p>
          </div>
          <span className="text-xs font-bold text-rose-900 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
            11 Fitur Siap Digunakan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'journal' as NavTab,
              title: 'Jurnal Harian',
              desc: 'Catat kegiatan harian & pembelajaran PKL',
              icon: BookOpen,
              color: 'text-rose-900',
              bg: 'bg-rose-50',
              badge: `${journals.length} catatan logbook`,
            },
            {
              id: 'attendance' as NavTab,
              title: 'Absensi Magang',
              desc: 'Check-in, check-out & rekap hadir',
              icon: Clock,
              color: 'text-emerald-700',
              bg: 'bg-emerald-50',
              badge: todayAttendance?.checkInTime ? 'Sudah Hadir' : 'Perlu Absen',
            },
            {
              id: 'progress' as NavTab,
              title: 'Progress Magang',
              desc: 'Persentase capaian & kompetensi kerja',
              icon: TrendingUp,
              color: 'text-rose-900',
              bg: 'bg-rose-50',
              badge: `${progress.overallPercentage}% tercapai`,
            },
            {
              id: 'todo' as NavTab,
              title: 'To-Do List',
              desc: 'Kelola tugas harian & tenggat waktu',
              icon: CheckSquare,
              color: 'text-amber-700',
              bg: 'bg-amber-50',
              badge: `${todos.filter(t => t.status !== 'selesai').length} tugas aktif`,
            },
            {
              id: 'report' as NavTab,
              title: 'Laporan Magang',
              desc: 'Pratinjau & unduh laporan format PDF',
              icon: FileText,
              color: 'text-rose-900',
              bg: 'bg-rose-50',
              badge: 'Siap Cetak PDF',
            },
            {
              id: 'reflection' as NavTab,
              title: 'Refleksi Diri',
              desc: 'Tulis evaluasi diri, skill & tantangan',
              icon: Sparkles,
              color: 'text-purple-700',
              bg: 'bg-purple-50',
              badge: 'Refleksi Berkala',
            },
            {
              id: 'mentor' as NavTab,
              title: 'Catatan Pembimbing',
              desc: 'Evaluasi & saran pembimbing lapangan',
              icon: MessageSquareQuote,
              color: 'text-blue-700',
              bg: 'bg-blue-50',
              badge: profile.mentorName,
            },
            {
              id: 'gallery' as NavTab,
              title: 'Galeri Foto',
              desc: 'Dokumentasi visual aktivitas magang',
              icon: ImageIcon,
              color: 'text-rose-900',
              bg: 'bg-rose-50',
              badge: 'Foto Kegiatan',
            },
            {
              id: 'stats' as NavTab,
              title: 'Statistik Magang',
              desc: 'Analisis kehadiran & performa tugas',
              icon: BarChart3,
              color: 'text-slate-700',
              bg: 'bg-slate-100',
              badge: 'Grafik & Metrik',
            },
            {
              id: 'profile' as NavTab,
              title: 'Profil Siswa',
              desc: 'Data identitas siswa & sekolah asal',
              icon: User,
              color: 'text-rose-900',
              bg: 'bg-rose-50',
              badge: profile.fullName.split(' ')[0],
            },
            {
              id: 'settings' as NavTab,
              title: 'Pengaturan',
              desc: 'Cadangkan data, ekspor atau reset',
              icon: Settings,
              color: 'text-slate-700',
              bg: 'bg-slate-100',
              badge: 'Backup / Reset',
            },
          ].map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => onNavigate(tile.id)}
                className="flex flex-col text-left p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:border-rose-300 bg-slate-50/60 hover:bg-rose-50/40 hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tile.bg} ${tile.color} group-hover:scale-110 transition-transform shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-900 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-950 transition-colors">
                  {tile.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                  {tile.desc}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-semibold text-rose-900">
                  <span className="truncate max-w-[90px]">{tile.badge}</span>
                  <span className="group-hover:underline shrink-0">Buka &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Split Section: Quick Actions & To-Do List + Recent Journals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Journals & Quick Logbook */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Jurnal Kegiatan Terbaru</h3>
              <p className="text-xs text-slate-500">Catatan aktivitas magang harian yang telah ditulis</p>
            </div>
            <button
              onClick={() => onNavigate('journal')}
              className="text-xs font-bold text-rose-900 hover:text-rose-950 flex items-center gap-1 group"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentJournals.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Belum ada jurnal harian</p>
                <p className="text-xs text-slate-500 mt-1">Mulai tulis catatan kegiatan magang pertamamu!</p>
                <button
                  onClick={onOpenJournalModal}
                  className="mt-4 px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Tulis Jurnal Baru
                </button>
              </div>
            ) : (
              recentJournals.map((journal) => (
                <div
                  key={journal.id}
                  onClick={() => onNavigate('journal')}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                          {formatShortDate(journal.date)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {journal.startTime} - {journal.endTime} WIB
                        </span>
                        {journal.verifiedByMentor && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Diverifikasi
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-900 transition-colors">
                        {journal.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {journal.description}
                      </p>
                    </div>

                    <div className="shrink-0 p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-rose-900 group-hover:bg-rose-50 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Key learnings snippet */}
                  {journal.keyLearnings && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-semibold text-slate-700">Hal Dipelajari:</span>
                      <span className="truncate">{journal.keyLearnings}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Pending Tasks & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card (Maroon Tint) */}
          <div className="bg-gradient-to-br from-rose-50 via-red-50/70 to-rose-100/50 border border-rose-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-900" />
              Aksi Cepat
            </h3>
            <p className="text-xs text-rose-800 mt-1">Akses cepat kegiatan harianmu</p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenJournalModal}
                className="flex items-center gap-2 p-3 bg-white hover:bg-rose-900 hover:text-white rounded-xl border border-rose-200 text-slate-700 text-xs font-semibold shadow-xs transition-all group"
              >
                <Plus className="w-4 h-4 text-rose-800 group-hover:text-white" />
                <span>Isi Jurnal</span>
              </button>
              <button
                onClick={() => onNavigate('attendance')}
                className="flex items-center gap-2 p-3 bg-white hover:bg-rose-900 hover:text-white rounded-xl border border-rose-200 text-slate-700 text-xs font-semibold shadow-xs transition-all group"
              >
                <Clock className="w-4 h-4 text-rose-800 group-hover:text-white" />
                <span>Absensi</span>
              </button>
              <button
                onClick={() => onNavigate('todo')}
                className="flex items-center gap-2 p-3 bg-white hover:bg-rose-900 hover:text-white rounded-xl border border-rose-200 text-slate-700 text-xs font-semibold shadow-xs transition-all group"
              >
                <CheckCircle2 className="w-4 h-4 text-rose-800 group-hover:text-white" />
                <span>Tugas Baru</span>
              </button>
              <button
                onClick={() => onNavigate('report')}
                className="flex items-center gap-2 p-3 bg-white hover:bg-rose-900 hover:text-white rounded-xl border border-rose-200 text-slate-700 text-xs font-semibold shadow-xs transition-all group"
              >
                <TrendingUp className="w-4 h-4 text-rose-800 group-hover:text-white" />
                <span>Cetak Laporan</span>
              </button>
            </div>
          </div>

          {/* Pending Tasks Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tugas yang Harus Dikerjakan</h3>
                <p className="text-xs text-slate-500">Prioritas & deadline terdekat</p>
              </div>
              <button
                onClick={() => onNavigate('todo')}
                className="text-xs font-bold text-rose-900 hover:text-rose-950"
              >
                Buka To-Do
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingTodos.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                  <p className="text-xs font-semibold text-slate-700">Tidak ada tugas tertunda!</p>
                  <p className="text-[11px]">Semua tugas sudah diselesaikan.</p>
                </div>
              ) : (
                pendingTodos.map((todo) => {
                  const relDays = getRelativeDays(todo.dueDate);
                  const isOverdue = relDays.includes('Terlewat');
                  const isToday = relDays === 'Hari ini';

                  return (
                    <div
                      key={todo.id}
                      onClick={() => onNavigate('todo')}
                      className="p-3 rounded-xl border border-slate-100 hover:border-rose-200 bg-slate-50/50 hover:bg-rose-50/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">
                          {todo.title}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                          todo.priority === 'tinggi' 
                            ? 'bg-rose-200 text-rose-900' 
                            : todo.priority === 'sedang' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {todo.priority}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{todo.category}</span>
                        <span className={`font-semibold ${
                          isOverdue 
                            ? 'text-rose-700 font-bold' 
                            : isToday 
                            ? 'text-amber-700 font-bold' 
                            : 'text-slate-600'
                        }`}>
                          {relDays}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
