import React from 'react';
import { 
  StudentProfile, 
  JournalEntry, 
  AttendanceRecord, 
  TodoTask, 
  CompetencyItem 
} from '../../types';
import { 
  BarChart3, 
  CalendarCheck, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  Smile, 
  Clock, 
  Award, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { calculateInternshipProgress } from '../../utils/helpers';

interface StatsViewProps {
  profile: StudentProfile;
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  todos: TodoTask[];
  competencies: CompetencyItem[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  profile,
  journals,
  attendance,
  todos,
  competencies,
}) => {
  const totalPresent = attendance.filter(a => a.status === 'hadir' || a.status === 'wfh').length;
  const countHadirOnsite = attendance.filter(a => a.status === 'hadir').length;
  const countWfh = attendance.filter(a => a.status === 'wfh').length;
  const countIzin = attendance.filter(a => a.status === 'izin').length;
  const countSakit = attendance.filter(a => a.status === 'sakit').length;

  const completedTasks = todos.filter(t => t.status === 'selesai').length;
  const inProgressTasks = todos.filter(t => t.status === 'sedang').length;
  const pendingTasks = todos.filter(t => t.status === 'belum').length;

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

  // Mood counts
  const moodCounts = {
    semangat: journals.filter(j => j.mood === 'semangat').length,
    senang: journals.filter(j => j.mood === 'senang').length,
    biasa: journals.filter(j => j.mood === 'biasa').length,
    lelah: journals.filter(j => j.mood === 'lelah').length,
    bingung: journals.filter(j => j.mood === 'bingung').length,
  };

  // Day of week distribution for attendance
  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const dayCounts: Record<string, number> = {
    Senin: 0,
    Selasa: 0,
    Rabu: 0,
    Kamis: 0,
    Jumat: 0
  };

  attendance.forEach(rec => {
    if (rec.status === 'hadir' || rec.status === 'wfh') {
      const d = new Date(rec.date);
      const dayIdx = d.getDay(); // 1 = Monday, 5 = Friday
      if (dayIdx >= 1 && dayIdx <= 5) {
        const name = daysOfWeek[dayIdx - 1];
        dayCounts[name] = (dayCounts[name] || 0) + 1;
      }
    }
  });

  const maxDayCount = Math.max(1, ...Object.values(dayCounts));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Statistik Kegiatan Magang</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Ringkasan analitik kehadiran kerja, kuantitas jurnal harian, dan penyelesaian tugas magang
        </p>
      </div>

      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Jumlah Hari Hadir */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Jumlah Hari Hadir</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {totalPresent} <span className="text-xs font-medium text-slate-400">hari</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <span>{countHadirOnsite} Kantor • {countWfh} WFH</span>
          </div>
        </div>

        {/* 2. Jumlah Jurnal Dibuat */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Jurnal Dibuat</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-900">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {journals.length} <span className="text-xs font-medium text-slate-400">entri</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
            <span>Rata-rata 1.0 entri/hari kerja</span>
          </div>
        </div>

        {/* 3. Jumlah Tugas Selesai */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tugas Selesai</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {completedTasks} <span className="text-xs font-medium text-slate-400">/ {todos.length}</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
            <span>{progress.taskPercentage}% tingkat penyelesaian</span>
          </div>
        </div>

        {/* 4. Rata-Rata Progress Magang */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rata-Rata Progress</span>
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-900">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {progress.overallPercentage}%
          </p>
          <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
            <span>{progress.daysRemaining} hari tersisa</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Distribusi Kehadiran per Hari Kerja (Senin - Jumat) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-rose-900" />
              <h3 className="text-base font-bold text-slate-900">Aktivitas Hari Kerja</h3>
            </div>
            <span className="text-xs text-slate-400">Hari Kerja Magang</span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-3 h-48 px-2">
            {daysOfWeek.map((day) => {
              const count = dayCounts[day] || 0;
              const heightPercent = Math.max(15, Math.round((count / maxDayCount) * 100));

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-extrabold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}x
                  </span>
                  <div className="w-full max-w-[48px] bg-rose-50 rounded-2xl overflow-hidden flex items-end transition-all h-full max-h-[140px]">
                    <div
                      className="w-full bg-gradient-to-t from-rose-950 via-rose-900 to-rose-700 rounded-2xl transition-all duration-700 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100">
            Total {totalPresent} hari kerja terlaksana dengan disiplin.
          </p>
        </div>

        {/* Chart 2: Status Distribusi Tugas Magang */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-rose-900" />
              <h3 className="text-base font-bold text-slate-900">Status Tugas (To-Do List)</h3>
            </div>
            <span className="text-xs text-slate-400">Total: {todos.length} Tugas</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* Selesai */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Selesai Dikerjakan
                </span>
                <span className="text-slate-800">{completedTasks} ({todos.length ? Math.round((completedTasks/todos.length)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${todos.length ? (completedTasks/todos.length)*100 : 0}%` }}
                />
              </div>
            </div>

            {/* Sedang Dikerjakan */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Sedang Dikerjakan (In Progress)
                </span>
                <span className="text-slate-800">{inProgressTasks} ({todos.length ? Math.round((inProgressTasks/todos.length)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-amber-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${todos.length ? (inProgressTasks/todos.length)*100 : 0}%` }}
                />
              </div>
            </div>

            {/* Belum Dikerjakan */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Belum Dikerjakan (Backlog)
                </span>
                <span className="text-slate-800">{pendingTasks} ({todos.length ? Math.round((pendingTasks/todos.length)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-slate-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${todos.length ? (pendingTasks/todos.length)*100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Kategori dominan: Development & Laporan</span>
            <span className="font-semibold text-emerald-700">Kinerja Efisien</span>
          </div>
        </div>

        {/* Chart 3: Mood & Suasana Hati Saat Magang */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-rose-800" />
              <h3 className="text-base font-bold text-slate-900">Distribusi Mood & Semangat Magang</h3>
            </div>
            <span className="text-xs text-slate-400">Total {journals.length} entri jurnal</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
              <span className="text-2xl">🔥</span>
              <p className="text-xl font-black text-rose-950">{moodCounts.semangat}</p>
              <p className="text-xs font-semibold text-rose-900">Bersemangat</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-2xl">😊</span>
              <p className="text-xl font-black text-emerald-900">{moodCounts.senang}</p>
              <p className="text-xs font-semibold text-emerald-700">Senang</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-2xl">😐</span>
              <p className="text-xl font-black text-slate-800">{moodCounts.biasa}</p>
              <p className="text-xs font-semibold text-slate-700">Biasa Saja</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
              <span className="text-2xl">😴</span>
              <p className="text-xl font-black text-purple-900">{moodCounts.lelah}</p>
              <p className="text-xs font-semibold text-purple-700">Lelah</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1 col-span-2 sm:col-span-1">
              <span className="text-2xl">🤔</span>
              <p className="text-xl font-black text-amber-900">{moodCounts.bingung}</p>
              <p className="text-xs font-semibold text-amber-700">Butuh Arahan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
