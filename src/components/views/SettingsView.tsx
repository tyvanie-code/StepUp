import React, { useState } from 'react';
import { 
  StudentProfile, 
  NavTab 
} from '../../types';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  Database, 
  User, 
  Info, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  Clock, 
  ExternalLink,
  Cloud,
  RefreshCw,
  LogIn,
  LogOut
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { ConfirmModal } from '../common/ConfirmModal';

interface SettingsViewProps {
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onResetDemo: () => void;
  onImportSuccess: () => void;
  onNavigate: (tab: NavTab) => void;
  currentUser?: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null;
  onLoginWithGoogle?: () => void;
  onSignOut?: () => void;
  onSyncToCloud?: () => void;
  isSyncing?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onSaveProfile,
  onResetDemo,
  onImportSuccess,
  onNavigate,
  currentUser,
  onLoginWithGoogle,
  onSignOut,
  onSyncToCloud,
  isSyncing = false,
}) => {
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [targetDays, setTargetDays] = useState(profile.targetWorkDays || 80);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Export JSON file
  const handleExportBackup = () => {
    const jsonStr = StorageService.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Internship_Journey_Backup_${profile.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importDataJSON(content);
      if (success) {
        setImportStatus('Data berhasil dipulihkan dari cadangan!');
        onImportSuccess();
      } else {
        setImportStatus('Gagal membaca berkas cadangan JSON. Pastikan format valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      targetWorkDays: targetDays
    });
  };

  const handleClearAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Pengaturan & Penyimpanan Data</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Konfigurasi preferensi aplikasi, cadangan data logbook (Backup/Restore), dan integrasi
        </p>
      </div>

      {importStatus && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-rose-800 shrink-0" />
            <span>{importStatus}</span>
          </div>
          <button onClick={() => setImportStatus(null)} className="text-xs font-bold text-rose-900 hover:underline">
            Tutup
          </button>
        </div>
      )}

      {/* 1. Profil & Akun Shortcut */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-100 border border-rose-300"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">{profile.fullName}</h3>
            <p className="text-xs text-slate-500">{profile.schoolName} • {profile.companyName}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-rose-900 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              {profile.department}
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
        >
          <User className="w-4 h-4 text-slate-500" />
          <span>Kelola Profil & Foto</span>
        </button>
      </div>

      {/* 2. Preferensi Target Hari Magang */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Clock className="w-5 h-5 text-rose-900" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Target Hari Kerja Magang</h3>
            <p className="text-xs text-slate-500">Jumlah hari kerja minimum yang ditentukan sekolah/instansi</p>
          </div>
        </div>

        <form onSubmit={handleSavePreferences} className="flex flex-col sm:flex-row items-end gap-3 max-w-md">
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Hari Kerja (Hari)</label>
            <input
              type="number"
              min="1"
              max="365"
              value={targetDays}
              onChange={(e) => setTargetDays(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0"
          >
            Simpan Target
          </button>
        </form>
      </div>

      {/* 3. Firebase Cloud Firestore & Autentikasi Online */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Firebase Cloud Firestore & Akun</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Online
                </span>
              </h3>
              <p className="text-xs text-slate-500">Penyimpanan awan terpusat & autentikasi Google</p>
            </div>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSyncToCloud}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron ke Cloud'}</span>
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-900 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                title="Keluar dari akun Google"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginWithGoogle}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk dengan Google</span>
            </button>
          )}
        </div>

        {/* User Status Box */}
        {currentUser ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {currentUser.displayName || 'Pengguna Terhubung'}
                </p>
                <p className="text-[11px] text-emerald-800 font-medium">
                  {currentUser.email}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Akun Terverifikasi & Sinkron
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">
              💡 Belum terhubung dengan Akun Google
            </p>
            <p className="leading-relaxed">
              Saat ini data tersimpan di penyimpanan lokal peramban Anda. Masuk dengan Akun Google untuk mengaktifkan pencadangan otomatis ke Firebase Firestore, sehingga Anda dapat mengakses logbook magang dari laptop, tablet, maupun ponsel tanpa khawatir kehilangan data.
            </p>
          </div>
        )}

        {/* Cloud Architecture Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Firebase Project ID</p>
            <p className="font-mono font-bold text-slate-800">dub-constant-001dl</p>
            <p className="text-[11px] text-emerald-700 font-medium">✓ Terverifikasi & Aktif</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Database Firestore</p>
            <p className="font-mono font-bold text-slate-800 truncate" title="ai-studio-internshipjourne-bc7fd815-953f-4e9c-b902-e589b8b10f9d">
              ai-studio-internshipjourne...
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">✓ Cloud Firestore Mode Enterprise</p>
          </div>
        </div>
      </div>

      {/* 4. Cadangan & Pemulihan (Backup & Restore JSON) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Download className="w-5 h-5 text-rose-900" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Cadangan Data (Backup & Restore)</h3>
            <p className="text-xs text-slate-500">Simpan berkas cadangan ke komputer/HP agar logbook magangmu selalu aman</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Download className="w-4 h-4 text-rose-900" />
              Unduh Cadangan Lengkap
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unduh seluruh data logbook, presensi, refleksi, dan tugas magang dalam berkas format .JSON.
            </p>
            <button
              onClick={handleExportBackup}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Berkas JSON</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-rose-900" />
              Pulihkan dari Cadangan
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unggah berkas JSON cadangan yang pernah kamu unduh sebelumnya untuk memulihkan seluruh data.
            </p>
            <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-800 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer bg-white">
              <Upload className="w-4 h-4 text-rose-900" />
              <span>Pilih Berkas Cadangan</span>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportFile}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 5. Zona Berbahaya / Reset Data */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-rose-200">
          <Trash2 className="w-5 h-5 text-rose-800" />
          <div>
            <h3 className="text-base font-bold text-rose-950">Pengelolaan Data & Reset</h3>
            <p className="text-xs text-rose-800">Kembalikan data ke contoh awal magang atau kosongkan penyimpanan</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-200">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Reset ke Data Contoh (Demo Data)</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Mengembalikan data profil, jurnal, absensi, dan to-do list ke data contoh standar SMK/SMA.
            </p>
          </div>
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-900 hover:bg-rose-50 text-xs font-bold shadow-2xs transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-200">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-rose-950">Kosongkan Seluruh Data Lokal</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Menghapus semua data yang tersimpan di browser ini. Pastikan kamu sudah mencadangkan file JSON.
            </p>
          </div>
          <button
            onClick={() => setClearConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Semua</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="Reset ke Data Contoh?"
        message="Data saat ini akan digantikan dengan data contoh awal siswa magang PT Inovasi Solusi Nusantara."
        confirmLabel="Ya, Muat Ulang Demo"
        cancelLabel="Batal"
        isDanger={false}
        onConfirm={() => {
          onResetDemo();
          setResetConfirmOpen(false);
        }}
        onCancel={() => setResetConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={clearConfirmOpen}
        title="Hapus Seluruh Data?"
        message="PERINGATAN: Semua catatan jurnal, absensi, to-do list, dan pengaturan akan dihapus bersih dari browser ini."
        confirmLabel="Hapus Permanen"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={() => {
          handleClearAll();
          setClearConfirmOpen(false);
        }}
        onCancel={() => setClearConfirmOpen(false)}
      />
    </div>
  );
};
