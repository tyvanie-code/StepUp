import React, { useState } from 'react';
import { 
  DocumentationPhoto 
} from '../../types';
import { 
  Image as ImageIcon, 
  Plus, 
  Calendar, 
  Trash2, 
  Maximize2, 
  X, 
  Upload, 
  Tag, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { formatIndonesianDate, formatShortDate, getTodayDateString, fireSuccessConfetti } from '../../utils/helpers';
import { ConfirmModal } from '../common/ConfirmModal';

interface GalleryViewProps {
  photos: DocumentationPhoto[];
  onAddPhoto: (photo: DocumentationPhoto) => void;
  onDeletePhoto: (id: string) => void;
}

const CATEGORIES = [
  'Proyek',
  'Briefing & Diskusi',
  'Presentasi',
  'Kegiatan Lapangan',
  'Lainnya'
] as const;

const SAMPLE_PHOTO_PRESETS = [
  {
    title: 'Kolaborasi Desain UI',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Workspace Tim Engineer',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Sesi Diskusi Standup',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Presentasi Demo Produk',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
  }
];

export const GalleryView: React.FC<GalleryViewProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<DocumentationPhoto | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(getTodayDateString());
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<'Proyek' | 'Briefing & Diskusi' | 'Presentasi' | 'Kegiatan Lapangan' | 'Lainnya'>('Proyek');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setFormTitle('');
    setFormDate(getTodayDateString());
    setFormDescription('');
    setFormCategory('Proyek');
    setFormImageUrl(SAMPLE_PHOTO_PRESETS[0].url);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Ukuran file maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImageUrl(reader.result);
          setFormError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formImageUrl.trim()) {
      setFormError('Judul foto dan berkas gambar wajib diisi.');
      return;
    }

    const newPhoto: DocumentationPhoto = {
      id: `gal-${Date.now()}`,
      title: formTitle.trim(),
      date: formDate,
      description: formDescription.trim(),
      category: formCategory,
      imageUrl: formImageUrl
    };

    onAddPhoto(newPhoto);
    fireSuccessConfetti();
    setIsModalOpen(false);
  };

  const filteredPhotos = photos.filter(p => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Galeri Dokumentasi Magang</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Foto bukti kegiatan kerja, suasana kantor, presentasi, dan lampiran resmi laporan magang
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Foto Kegiatan</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filterCategory === 'all'
              ? 'bg-rose-950 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua Foto ({photos.length})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterCategory === cat
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <h3 className="text-base font-bold text-slate-800">Belum Ada Foto Dokumentasi</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Unggah foto saat melakukan pekerjaan, briefing tim, atau presentasi sebagai bukti otentik magangmu.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Foto Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-rose-300 hover:shadow-md transition-all group flex flex-col"
            >
              {/* Image Preview with Hover Overlay */}
              <div className="relative aspect-video sm:aspect-4/3 w-full overflow-hidden bg-slate-100">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <button
                    onClick={() => setSelectedPhoto(photo)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold backdrop-blur-xs transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Lihat Penuh</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(photo.id)}
                    className="p-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs shadow-xs transition-colors"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-950/80 text-white backdrop-blur-md uppercase tracking-wider">
                    {photo.category}
                  </span>
                </div>
              </div>

              {/* Card Content: Title, Date, Description */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatIndonesianDate(photo.date, false)}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-rose-900 transition-colors">
                    {photo.title}
                  </h4>
                  {photo.description && (
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPhoto(photo)}
                    className="text-xs font-semibold text-rose-900 hover:underline"
                  >
                    Detail Dokumentasi
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(photo.id)}
                    className="text-xs text-slate-400 hover:text-rose-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX / FULL PHOTO MODAL */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-950 uppercase">
                  {selectedPhoto.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedPhoto.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[60vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Description Footer */}
            <div className="p-5 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Tanggal Dokumentasi: {formatIndonesianDate(selectedPhoto.date, true)}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                {selectedPhoto.description || 'Tidak ada deskripsi tambahan.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD PHOTO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-900" />
                <h3 className="text-base font-bold text-slate-900">
                  Unggah Foto Kegiatan Magang
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

              {/* Image Preview & Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Berkas Gambar *</label>
                
                {formImageUrl && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-slate-200 bg-slate-100">
                    <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-rose-300 rounded-xl bg-rose-50/50 hover:bg-rose-50 text-rose-900 text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Pilih dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Atau tempel Link URL gambar..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>

                {/* Quick Presets */}
                <div className="mt-2.5">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">Preset Foto Kegiatan Cepat:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormImageUrl(preset.url)}
                        className={`text-[10px] p-1.5 rounded-lg border text-center truncate transition-all ${
                          formImageUrl === preset.url
                            ? 'border-rose-800 bg-rose-50 text-rose-950 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Foto / Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sesi Demo Hasil Slicing Web ke Pembimbing"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kegiatan *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Kegiatan</label>
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Keterangan Foto</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan singkat tentang apa yang sedang dilakukan pada dokumentasi ini..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
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
                  Simpan ke Galeri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Hapus Foto Dokumentasi?"
        message="Foto ini akan dihapus dari galeri dan tidak akan ditampilkan pada lampiran laporan."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeletePhoto(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
