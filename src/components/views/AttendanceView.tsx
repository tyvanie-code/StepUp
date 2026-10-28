import React, { useState, useEffect } from 'react';
import { 
  AttendanceRecord, 
  AttendanceStatus 
} from '../../types';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  FileText, 
  Home, 
  Building,
  UserX
} from 'lucide-react';
import { 
  formatIndonesianDate, 
  formatShortDate, 
  getTodayDateString, 
  getCurrentTimeString,
  fireSuccessConfetti 
} from '../../utils/helpers';
import { ConfirmModal } from '../common/ConfirmModal';

interface AttendanceViewProps {
  attendanceList: AttendanceRecord[];
  onSaveAttendanceRecord: (record: AttendanceRecord) => void;
  onDeleteAttendanceRecord: (id: string) => void;
}

const STATUS_BADGE: Record<AttendanceStatus, { label: string; bg: string; text: string; border: string }> = {
  hadir: { label: 'Hadir Onsite', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  wfh: { label: 'Work From Home (WFH)', bg: 'bg-rose-50', text: 'text-rose-900', border: 'border-rose-200' },
  izin: { label: 'Izin', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  sakit: { label: 'Sakit', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  libur: { label: 'Libur / Off', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
};

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceList,
  onSaveAttendanceRecord,
  onDeleteAttendanceRecord,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Manual modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  
  // Form modal fields
  const [formDate, setFormDate] = useState(getTodayDateString());
  const [formCheckIn, setFormCheckIn] = useState('08:30');
  const [formCheckOut, setFormCheckOut] = useState('17:00');
  const [formStatus, setFormStatus] = useState<AttendanceStatus>('hadir');
  const [formNotes, setFormNotes] = useState('');
  const [formLocation, setFormLocation] = useState('Kantor Pusat');

  // Real-time clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = getTodayDateString();
  const todayRecord = attendanceList.find(a => a.date === todayStr);

  // Quick Check-In handler
  const handleQuickCheckIn = (status: AttendanceStatus = 'hadir') => {
    const timeNow = getCurrentTimeString();
    const newRecord: AttendanceRecord = {
      id: todayRecord ? todayRecord.id : `att-${Date.now()}`,
      date: todayStr,
      checkInTime: timeNow,
      checkOutTime: todayRecord?.checkOutTime,
      status: status,
      location: status === 'wfh' ? 'Work From Home' : 'Kantor Pusat - Onsite',
      notes: todayRecord?.notes || 'Check-in mandiri via aplikasi Internship Journey.'
    };
    onSaveAttendanceRecord(newRecord);
    fireSuccessConfetti();
  };

  // Quick Check-Out handler
  const handleQuickCheckOut = () => {
    if (!todayRecord) return;
    const timeNow = getCurrentTimeString();
    const updatedRecord: AttendanceRecord = {
      ...todayRecord,
      checkOutTime: timeNow,
      notes: todayRecord.notes ? `${todayRecord.notes} (Selesai jam ${timeNow})` : `Check-out jam ${timeNow}`
    };
    onSaveAttendanceRecord(updatedRecord);
    fireSuccessConfetti();
  };

  // Open modal for new or edit
  const openManualModal = (record?: AttendanceRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormDate(record.date);
      setFormCheckIn(record.checkInTime || '');
      setFormCheckOut(record.checkOutTime || '');
      setFormStatus(record.status);
      setFormNotes(record.notes || '');
      setFormLocation(record.location || '');
    } else {
      setEditingRecord(null);
      setFormDate(todayStr);
      setFormCheckIn(getCurrentTimeString());
      setFormCheckOut('17:00');
      setFormStatus('hadir');
      setFormNotes('');
      setFormLocation('Kantor Pusat');
    }
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recordToSave: AttendanceRecord = {
      id: editingRecord ? editingRecord.id : `att-${Date.now()}`,
      date: formDate,
      checkInTime: (formStatus === 'izin' || formStatus === 'sakit' || formStatus === 'libur') ? undefined : formCheckIn,
      checkOutTime: (formStatus === 'izin' || formStatus === 'sakit' || formStatus === 'libur') ? undefined : (formCheckOut || undefined),
      status: formStatus,
      notes: formNotes.trim() || undefined,
      location: formLocation.trim() || undefined,
    };

    onSaveAttendanceRecord(recordToSave);
    setIsModalOpen(false);
  };

  // Stats calculation
  const totalDays = attendanceList.length;
  const countHadir = attendanceList.filter(a => a.status === 'hadir').length;
  const countWfh = attendanceList.filter(a => a.status === 'wfh').length;
  const countIzin = attendanceList.filter(a => a.status === 'izin').length;
  const countSakit = attendanceList.filter(a => a.status === 'sakit').length;
  const attendanceRate = totalDays > 0 ? Math.round(((countHadir + countWfh) / totalDays) * 100) : 100;

  // Filter list
  const filteredList = attendanceList
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Absensi & Presensi Magang</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pencatatan waktu kehadiran harian, jam masuk, jam pulang, dan riwayat presensi
          </p>
        </div>

        <button
          onClick={() => openManualModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Presensi Manual</span>
        </button>
      </div>

      {/* Main Clock & Check-In Card (Deep Maroon Gradient) */}
      <div className="bg-gradient-to-br from-[#38060c] via-[#540b17] to-[#250307] rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Live Digital Clock */}
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Waktu Presensi Real-Time</span>
            </div>

            <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              <span className="text-xs font-sans font-bold text-rose-300 ml-2">WIB</span>
            </div>

            <p className="text-sm font-medium text-rose-100/90 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-300" />
              {formatIndonesianDate(todayStr, true)}
            </p>

            <div className="pt-2 text-xs text-rose-200/70 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>Lokasi Kerja: Onsite Kantor / WFH Terjadwal</span>
            </div>
          </div>

          {/* Right Column: Check-in / Check-out interactive buttons */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-300" />
                Status Hari Ini ({formatShortDate(todayStr)})
              </h3>

              {todayRecord ? (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_BADGE[todayRecord.status].bg} ${STATUS_BADGE[todayRecord.status].text} ${STATUS_BADGE[todayRecord.status].border}`}>
                  {STATUS_BADGE[todayRecord.status].label}
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Belum Ada Catatan
                </span>
              )}
            </div>

            {/* Check In / Check Out Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[11px] font-medium text-rose-100/80">Jam Masuk (Check-In)</p>
                <p className="text-xl font-black text-emerald-400 mt-1">
                  {todayRecord?.checkInTime || '--:--'}
                </p>
                <span className="text-[10px] text-rose-200/60">
                  {todayRecord?.checkInTime ? 'Berhasil dicatat' : 'Belum check-in'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[11px] font-medium text-rose-100/80">Jam Pulang (Check-Out)</p>
                <p className="text-xl font-black text-rose-300 mt-1">
                  {todayRecord?.checkOutTime || '--:--'}
                </p>
                <span className="text-[10px] text-rose-200/60">
                  {todayRecord?.checkOutTime ? 'Berhasil dicatat' : 'Belum check-out'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {/* Check In Button */}
              <button
                type="button"
                onClick={() => handleQuickCheckIn('hadir')}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-emerald-950/20"
                title={todayRecord?.checkInTime ? 'Klik untuk memperbarui jam Check-In ke jam sekarang' : 'Klik untuk Check-In sekarang'}
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {todayRecord?.checkInTime 
                    ? `Perbarui Check-In (${todayRecord.checkInTime})` 
                    : 'Check In Sekarang'}
                </span>
              </button>

              {/* Check Out Button */}
              <button
                type="button"
                onClick={handleQuickCheckOut}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer ${
                  !todayRecord?.checkInTime
                    ? 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-white/10'
                    : 'bg-rose-700 hover:bg-rose-600 active:scale-98 text-white shadow-rose-950/30'
                }`}
                title="Klik untuk mencatat jam kepulangan"
              >
                <LogOut className="w-4 h-4" />
                <span>
                  {todayRecord?.checkOutTime 
                    ? `Perbarui Check-Out (${todayRecord.checkOutTime})` 
                    : 'Check Out Pulang'}
                </span>
              </button>
            </div>

            {/* Quick status & Testing controls */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-100/90 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-rose-200/70">Opsi Lain:</span>
                <button
                  type="button"
                  onClick={() => handleQuickCheckIn('wfh')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-rose-100 font-semibold cursor-pointer transition-colors"
                >
                  Presensi WFH
                </button>
                <button
                  type="button"
                  onClick={() => openManualModal()}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 font-semibold cursor-pointer transition-colors"
                >
                  Izin / Sakit
                </button>
              </div>

              {todayRecord && (
                <button
                  type="button"
                  onClick={() => onDeleteAttendanceRecord(todayRecord.id)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold cursor-pointer transition-colors"
                  title="Hapus data presensi hari ini untuk mencoba tombol Check-In dari awal"
                >
                  Reset Presensi Hari Ini
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tingkat Hadir</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{attendanceRate}%</p>
          <span className="text-[11px] text-emerald-700 font-medium">Sangat Baik</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Hadir Onsite</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{countHadir} <span className="text-xs font-normal text-slate-400">hari</span></p>
          <span className="text-[11px] text-slate-500">Di kantor</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Work From Home</span>
          <p className="text-2xl font-black text-rose-900 mt-1">{countWfh} <span className="text-xs font-normal text-slate-400">hari</span></p>
          <span className="text-[11px] text-slate-500">Remote/Daring</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Izin</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{countIzin} <span className="text-xs font-normal text-slate-400">hari</span></p>
          <span className="text-[11px] text-slate-500">Dengan surat</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Sakit</span>
          <p className="text-2xl font-black text-red-700 mt-1">{countSakit} <span className="text-xs font-normal text-slate-400">hari</span></p>
          <span className="text-[11px] text-slate-500">Surat dokter</span>
        </div>
      </div>

      {/* Attendance History Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Riwayat Catatan Absensi</h3>
            <p className="text-xs text-slate-500">Daftar kehadiran siswa yang tercatat secara kronologis</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-800"
            >
              <option value="all">Semua Status ({attendanceList.length})</option>
              <option value="hadir">Hadir Onsite ({countHadir})</option>
              <option value="wfh">WFH ({countWfh})</option>
              <option value="izin">Izin ({countIzin})</option>
              <option value="sakit">Sakit ({countSakit})</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Tanggal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Jam Masuk</th>
                <th className="py-3.5 px-4">Jam Pulang</th>
                <th className="py-3.5 px-4">Lokasi & Keterangan</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">Tidak ada riwayat absensi ditemukan</p>
                    <p className="text-xs">Catat absensi masuk hari ini untuk memulai.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((record) => {
                  const badge = STATUS_BADGE[record.status];
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 whitespace-nowrap">
                        {formatIndonesianDate(record.date, true)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {record.checkInTime || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {record.checkOutTime || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                        <span className="font-semibold text-slate-800">{record.location || '-'}</span>
                        {record.notes && (
                          <span className="text-slate-400 block truncate">{record.notes}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openManualModal(record)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-900 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Edit Absensi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(record.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-900" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingRecord ? 'Ubah Catatan Presensi' : 'Tambah Presensi Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kehadiran *</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Kehadiran *</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as AttendanceStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                >
                  <option value="hadir">Hadir Onsite (Kantor)</option>
                  <option value="wfh">Work From Home (WFH)</option>
                  <option value="izin">Izin</option>
                  <option value="sakit">Sakit</option>
                  <option value="libur">Libur / Hari Libur Nasional</option>
                </select>
              </div>

              {(formStatus === 'hadir' || formStatus === 'wfh') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jam Masuk (Check-In)</label>
                    <input
                      type="time"
                      value={formCheckIn}
                      onChange={(e) => setFormCheckIn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jam Pulang (Check-Out)</label>
                    <input
                      type="time"
                      value={formCheckOut}
                      onChange={(e) => setFormCheckOut(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Presensi</label>
                <input
                  type="text"
                  placeholder="Contoh: Kantor Cyber 2 / Rumah (WFH)"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Keterangan</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Mengikuti sesi live sprint demo, surat dokter terlampir, dsb."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
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
                  Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Hapus Catatan Presensi?"
        message="Catatan kehadiran pada tanggal ini akan dihapus dari riwayat. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeleteAttendanceRecord(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
