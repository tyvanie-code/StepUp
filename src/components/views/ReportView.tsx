import React, { useState } from 'react';
import { 
  StudentProfile, 
  JournalEntry, 
  AttendanceRecord, 
  SelfReflection, 
  MentorEvaluation, 
  CompetencyItem 
} from '../../types';
import { 
  Printer, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Award, 
  Clock, 
  Sparkles, 
  Filter, 
  Eye
} from 'lucide-react';
import { formatIndonesianDate, formatShortDate, getTodayDateString } from '../../utils/helpers';

interface ReportViewProps {
  profile: StudentProfile;
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  reflections: SelfReflection[];
  evaluations: MentorEvaluation[];
  competencies: CompetencyItem[];
}

export const ReportView: React.FC<ReportViewProps> = ({
  profile,
  journals,
  attendance,
  reflections,
  evaluations,
  competencies,
}) => {
  // Filter settings
  const [startDateFilter, setStartDateFilter] = useState(profile.startDate || '2026-08-01');
  const [endDateFilter, setEndDateFilter] = useState(profile.endDate || getTodayDateString());
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeJournals, setIncludeJournals] = useState(true);
  const [includeReflections, setIncludeReflections] = useState(true);
  const [includeEvaluations, setIncludeEvaluations] = useState(true);
  const [includeCompetencies, setIncludeCompetencies] = useState(true);

  // Filtered collections based on date range
  const filteredJournals = journals.filter(j => 
    (!startDateFilter || j.date >= startDateFilter) && 
    (!endDateFilter || j.date <= endDateFilter)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredAttendance = attendance.filter(a => 
    (!startDateFilter || a.date >= startDateFilter) && 
    (!endDateFilter || a.date <= endDateFilter)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handlePrint = () => {
    window.print();
  };

  const countPresent = filteredAttendance.filter(a => a.status === 'hadir' || a.status === 'wfh').length;
  const countIzin = filteredAttendance.filter(a => a.status === 'izin').length;
  const countSakit = filteredAttendance.filter(a => a.status === 'sakit').length;

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden during Print) */}
      <div className="no-print bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-900" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Laporan Resmi Magang</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kompilasi logbook kegiatan, rekapitulasi kehadiran, dan evaluasi dalam format dokumen resmi
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
          </div>
        </div>

        {/* Date Filter & Content Toggle */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Rentang Tanggal Laporan */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 block">Periode Tanggal Laporan:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
              <span className="text-slate-400 font-semibold">s/d</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>
          </div>

          {/* Section Toggles */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 block">Sertakan Bagian:</span>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={includeAttendance}
                  onChange={(e) => setIncludeAttendance(e.target.checked)}
                  className="rounded text-rose-900 focus:ring-rose-800"
                />
                <span>Presensi</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={includeJournals}
                  onChange={(e) => setIncludeJournals(e.target.checked)}
                  className="rounded text-rose-900 focus:ring-rose-800"
                />
                <span>Jurnal Harian</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={includeReflections}
                  onChange={(e) => setIncludeReflections(e.target.checked)}
                  className="rounded text-rose-900 focus:ring-rose-800"
                />
                <span>Refleksi</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={includeEvaluations}
                  onChange={(e) => setIncludeEvaluations(e.target.checked)}
                  className="rounded text-rose-900 focus:ring-rose-800"
                />
                <span>Catatan Pembimbing</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={includeCompetencies}
                  onChange={(e) => setIncludeCompetencies(e.target.checked)}
                  className="rounded text-rose-900 focus:ring-rose-800"
                />
                <span>Kompetensi</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 flex items-center gap-2">
          <Eye className="w-4 h-4 shrink-0 text-rose-800" />
          <span>
            Di bawah ini adalah <strong>Pratinjau Resmi Laporan</strong>. Klik <strong>"Cetak / Unduh PDF"</strong> untuk menyimpan sebagai dokumen PDF via dialog print browser (Pilih "Save as PDF" / "Simpan sebagai PDF").
          </span>
        </div>
      </div>

      {/* PRINT-READY OFFICIAL REPORT DOCUMENT */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-12 print-container print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto space-y-8 text-slate-900">
        
        {/* KOP / OFFICIAL LETTERHEAD */}
        <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
          <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-wide">
            LAPORAN PRAKTIK KERJA LAPANGAN (PKL) / MAGANG SISWA
          </h1>
          <h2 className="text-sm sm:text-base font-bold text-slate-700 uppercase">
            {profile.schoolName}
          </h2>
          <p className="text-xs text-slate-500">
            {profile.schoolAddress}
          </p>
        </div>

        {/* IDENTITAS LAPORAN */}
        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
          <div className="space-y-1.5">
            <div>
              <span className="text-slate-500 block text-xs">Nama Lengkap Siswa:</span>
              <span className="font-bold text-slate-900">{profile.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">NISN / Kelas:</span>
              <span className="font-semibold text-slate-800">{profile.nisn} • {profile.classGrade}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Program Keahlian:</span>
              <span className="font-semibold text-slate-800">{profile.major}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div>
              <span className="text-slate-500 block text-xs">Tempat Magang (Industri):</span>
              <span className="font-bold text-slate-900">{profile.companyName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Divisi / Penempatan:</span>
              <span className="font-semibold text-slate-800">{profile.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Periode Kegiatan:</span>
              <span className="font-semibold text-slate-800">
                {formatShortDate(profile.startDate)} s/d {formatShortDate(profile.endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* 1. REKAPITULASI KEHADIRAN */}
        {includeAttendance && (
          <div className="space-y-3 print-break-inside-avoid">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span>I. Rekapitulasi Presensi & Kehadiran</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                Total Terdata: {filteredAttendance.length} Hari
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Total Hadir:</span>
                <span className="text-base font-bold text-slate-900">{countPresent} Hari</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Izin:</span>
                <span className="text-base font-bold text-amber-700">{countIzin} Hari</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Sakit:</span>
                <span className="text-base font-bold text-red-700">{countSakit} Hari</span>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 mt-2">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2 border-b border-r border-slate-200">No.</th>
                  <th className="p-2 border-b border-r border-slate-200">Tanggal</th>
                  <th className="p-2 border-b border-r border-slate-200">Jam Masuk - Pulang</th>
                  <th className="p-2 border-b border-r border-slate-200">Status</th>
                  <th className="p-2 border-b border-slate-200">Keterangan / Lokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAttendance.map((rec, idx) => (
                  <tr key={rec.id} className="text-slate-800">
                    <td className="p-2 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-medium whitespace-nowrap">
                      {formatShortDate(rec.date)}
                    </td>
                    <td className="p-2 border-r border-slate-200 font-mono">
                      {rec.checkInTime || '-'} s/d {rec.checkOutTime || '-'}
                    </td>
                    <td className="p-2 border-r border-slate-200 uppercase font-semibold text-[11px]">
                      {rec.status}
                    </td>
                    <td className="p-2 text-slate-600">
                      {rec.location || '-'} {rec.notes ? `(${rec.notes})` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. JURNAL HARIAN LOGBOOK */}
        {includeJournals && (
          <div className="space-y-3 print-break-inside-avoid">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-800">
                <span>II. Catatan Logbook Jurnal Kegiatan Harian</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {filteredJournals.length} Catatan Kegiatan
              </span>
            </div>

            <div className="space-y-4">
              {filteredJournals.map((jrn, idx) => (
                <div key={jrn.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs print-break-inside-avoid">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 font-bold">
                    <span className="text-slate-900 font-bold text-sm">
                      {idx + 1}. {jrn.title}
                    </span>
                    <span className="text-slate-600 font-mono text-[11px]">
                      {formatIndonesianDate(jrn.date, true)} ({jrn.startTime} - {jrn.endTime} WIB)
                    </span>
                  </div>

                  <p className="text-slate-800 leading-relaxed">
                    <strong>Uraian Kegiatan:</strong> {jrn.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <strong>Hal yang Dipelajari:</strong> {jrn.keyLearnings || '-'}
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <strong>Kendala & Solusi:</strong> {jrn.obstacles ? `${jrn.obstacles} (Solusi: ${jrn.solutions || '-'})` : 'Tidak ada kendala'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CAPAIAN KOMPETENSI */}
        {includeCompetencies && (
          <div className="space-y-3 print-break-inside-avoid">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-800">
                <span>III. Capaian Silabus & Kompetensi Kejuruan</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {competencies.map((comp, idx) => (
                <div key={comp.id} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">{idx + 1}.</span>
                    <span className="font-medium text-slate-800">{comp.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    comp.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {comp.isCompleted ? 'Tercapai' : 'Belum'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. REFLEKSI DIRI SISWA */}
        {includeReflections && reflections.length > 0 && (
          <div className="space-y-3 print-break-inside-avoid">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-800">
                <span>IV. Lembar Refleksi Diri Siswa</span>
              </h3>
            </div>

            {reflections.map((ref) => (
              <div key={ref.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <p className="font-bold text-slate-900 text-sm">{ref.periodTitle}</p>
                <p className="italic text-slate-700">"{ref.memorableExperience}"</p>
                <p><strong>Transformasi Diri:</strong> {ref.personalGrowth}</p>
                <p><strong>Keterampilan Baru:</strong> {ref.newSkills.join(', ')}</p>
              </div>
            ))}
          </div>
        )}

        {/* 5. EVALUASI PEMBIMBING */}
        {includeEvaluations && evaluations.length > 0 && (
          <div className="space-y-3 print-break-inside-avoid">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-800">
                <span>V. Catatan & Penilaian Pembimbing</span>
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {evaluations.map((evalItem) => (
                <div key={evalItem.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{evalItem.mentorName} ({evalItem.mentorRole})</span>
                    <span className="text-amber-700">Nilai: {evalItem.rating}.0 / 5.0 ({evalItem.category})</span>
                  </div>
                  <p className="text-slate-700">"{evalItem.comments}"</p>
                  {evalItem.recommendations && (
                    <p className="text-slate-600 font-medium">Saran: {evalItem.recommendations}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEMBAR PENGESAHAN / TANDA TANGAN RESMI */}
        <div className="pt-8 border-t-2 border-slate-900 print-break-inside-avoid space-y-6">
          <p className="text-xs text-right text-slate-600">
            Ditetapkan di: Jakarta, {formatIndonesianDate(getTodayDateString(), false)}
          </p>

          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            {/* Siswa */}
            <div className="space-y-16">
              <p className="font-medium text-slate-700">Siswa Praktikan,</p>
              <div>
                <p className="font-bold underline text-slate-900">{profile.fullName}</p>
                <p className="text-[11px] text-slate-500">NISN: {profile.nisn}</p>
              </div>
            </div>

            {/* Pembimbing Industri */}
            <div className="space-y-16">
              <p className="font-medium text-slate-700">Pembimbing Lapangan (Industri),</p>
              <div>
                <p className="font-bold underline text-slate-900">{profile.mentorName}</p>
                <p className="text-[11px] text-slate-500">{profile.companyName}</p>
              </div>
            </div>

            {/* Guru Pembimbing */}
            <div className="space-y-16">
              <p className="font-medium text-slate-700">Guru Pembimbing Sekolah,</p>
              <div>
                <p className="font-bold underline text-slate-900">{profile.schoolSupervisorName || 'Dra. Sri Wahyuni, M.Pd.'}</p>
                <p className="text-[11px] text-slate-500">{profile.schoolName}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
