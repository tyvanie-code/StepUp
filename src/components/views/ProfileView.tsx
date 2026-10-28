import React, { useState } from 'react';
import { 
  StudentProfile 
} from '../../types';
import { 
  Building2, 
  GraduationCap, 
  Calendar, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  Camera, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { formatIndonesianDate, formatShortDate } from '../../utils/helpers';

interface ProfileViewProps {
  profile: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
];

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSaveProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (field: keyof StudentProfile, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setValidationError('Ukuran foto maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleInputChange('avatarUrl', reader.result);
          setValidationError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.schoolName.trim() || !formData.companyName.trim()) {
      setValidationError('Nama lengkap, asal sekolah, dan tempat magang wajib diisi.');
      return;
    }
    setValidationError('');
    onSaveProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Profil Siswa Magang</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Informasi lengkap identitas peserta, institusi sekolah, dan instansi magang
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => {
              setFormData(profile);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            <span>Ubah Profil</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        )}
      </div>

      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-rose-700" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with edit option */}
          <div className="relative group shrink-0">
            <img
              src={isEditing ? formData.avatarUrl : profile.avatarUrl}
              alt={profile.fullName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-rose-100 border-2 border-rose-400/50 shadow-md"
            />
            {isEditing && (
              <label 
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/50 rounded-3xl flex flex-col items-center justify-center text-white text-[11px] font-semibold cursor-pointer backdrop-blur-xs transition-opacity"
              >
                <Camera className="w-6 h-6 mb-1 text-rose-200" />
                <span>Ganti Foto</span>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileUpload}
                />
              </label>
            )}
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-950">
                {profile.classGrade}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                NISN: {profile.nisn}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
                Status: Magang Aktif
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {profile.fullName}
            </h1>

            <p className="text-sm font-semibold text-rose-900">
              {profile.major}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl pt-1">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Avatar presets selector during edit */}
        {isEditing && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-700 mb-2">Pilih Foto Profil Cepat (Preset Avatar):</p>
            <div className="flex flex-wrap gap-3">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInputChange('avatarUrl', preset)}
                  className={`relative rounded-xl overflow-hidden ring-2 transition-all ${
                    formData.avatarUrl === preset ? 'ring-rose-800 ring-offset-2' : 'ring-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Preset ${idx + 1}`} className="w-12 h-12 object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* If editing, show the full edit form */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Data Pribadi & Sekolah */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-rose-900" />
              <h3 className="text-base font-bold text-slate-900">Identitas Siswa & Asal Sekolah</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Induk Siswa Nasional (NISN) *</label>
                <input
                  type="text"
                  required
                  value={formData.nisn}
                  onChange={(e) => handleInputChange('nisn', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kelas / Tingkat *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kelas XII RPL 1"
                  value={formData.classGrade}
                  onChange={(e) => handleInputChange('classGrade', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Program Keahlian / Jurusan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rekayasa Perangkat Lunak"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Sekolah Asal *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMK Negeri 1 Jakarta / SMA Negeri 8"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Sekolah</label>
                <input
                  type="text"
                  value={formData.schoolAddress}
                  onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Guru Pembimbing Sekolah</label>
                <input
                  type="text"
                  value={formData.schoolSupervisorName}
                  onChange={(e) => handleInputChange('schoolSupervisorName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">No. Kontak Guru Pembimbing</label>
                <input
                  type="text"
                  value={formData.schoolSupervisorPhone}
                  onChange={(e) => handleInputChange('schoolSupervisorPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Bio Singkat Siswa</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Data Instansi Magang */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-rose-900" />
              <h3 className="text-base font-bold text-slate-900">Tempat & Informasi Magang</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Perusahaan / Tempat Magang *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Inovasi Solusi Nusantara"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Divisi / Bagian Magang *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Web & UI/UX Development"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Tempat Magang</label>
                <input
                  type="text"
                  value={formData.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Pembimbing Lapangan (Mentor) *</label>
                <input
                  type="text"
                  required
                  value={formData.mentorName}
                  onChange={(e) => handleInputChange('mentorName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">No. Kontak / WhatsApp Pembimbing</label>
                <input
                  type="text"
                  value={formData.mentorPhone}
                  onChange={(e) => handleInputChange('mentorPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Pembimbing</label>
                <input
                  type="email"
                  value={formData.mentorEmail}
                  onChange={(e) => handleInputChange('mentorEmail', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Jumlah Hari Kerja Magang</label>
                <input
                  type="number"
                  min="1"
                  value={formData.targetWorkDays}
                  onChange={(e) => handleInputChange('targetWorkDays', parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Mulai Magang *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Selesai Magang *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-sm font-semibold shadow-xs shadow-rose-950/20 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Profil</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Read-only Detailed Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Asal Sekolah */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-900">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Institusi Sekolah Asal</h3>
                <p className="text-xs text-slate-500">Data sekolah dan pembimbing akademik</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 font-medium block text-xs">Nama Sekolah</span>
                <span className="font-bold text-slate-800">{profile.schoolName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs">Alamat Sekolah</span>
                <span className="text-slate-700 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  {profile.schoolAddress || '-'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 font-medium block text-xs">Guru Pembimbing</span>
                  <span className="font-semibold text-slate-800">{profile.schoolSupervisorName || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-xs">Kontak Guru</span>
                  <span className="text-slate-700 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {profile.schoolSupervisorPhone || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Tempat Magang */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-900">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Instansi Tempat Magang</h3>
                <p className="text-xs text-slate-500">Perusahaan & penempatan kerja siswa</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 font-medium block text-xs">Nama Perusahaan</span>
                <span className="font-bold text-slate-800">{profile.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs">Divisi / Unit Kerja</span>
                <span className="font-semibold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-md inline-block mt-0.5 border border-rose-200">
                  {profile.department}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs">Alamat Kantor</span>
                <span className="text-slate-700 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  {profile.companyAddress || '-'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 font-medium block text-xs">Pembimbing Lapangan</span>
                  <span className="font-semibold text-slate-800">{profile.mentorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-xs">Kontak Pembimbing</span>
                  <span className="text-slate-700 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {profile.mentorPhone || '-'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs">Email Pembimbing</span>
                <span className="text-slate-700 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile.mentorEmail || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Periode & Durasi Magang */}
          <div className="md:col-span-2 bg-gradient-to-r from-rose-50 via-white to-red-50/50 rounded-3xl border border-rose-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-900">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Periode & Ketentuan Magang</h3>
                <p className="text-xs text-slate-500">Rentang waktu pelaksanaan praktik kerja</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-rose-100">
                <span className="text-xs text-slate-400 font-medium">Tanggal Mulai</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{formatIndonesianDate(profile.startDate, true)}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-rose-100">
                <span className="text-xs text-slate-400 font-medium">Tanggal Selesai</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{formatIndonesianDate(profile.endDate, true)}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-rose-100">
                <span className="text-xs text-slate-400 font-medium">Target Hari Magang</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{profile.targetWorkDays} Hari Kerja</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
