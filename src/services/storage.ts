import { 
  StudentProfile, 
  JournalEntry, 
  AttendanceRecord, 
  TodoTask, 
  SelfReflection, 
  MentorEvaluation, 
  DocumentationPhoto,
  CompetencyItem
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'internship_profile_v1',
  JOURNALS: 'internship_journals_v1',
  ATTENDANCE: 'internship_attendance_v1',
  TODOS: 'internship_todos_v1',
  REFLECTIONS: 'internship_reflections_v1',
  MENTOR_EVALS: 'internship_mentor_evals_v1',
  GALLERY: 'internship_gallery_v1',
  COMPETENCIES: 'internship_competencies_v1',
};

// Initial realistic sample data
export const INITIAL_PROFILE: StudentProfile = {
  id: 'std-001',
  fullName: 'Rizky Aditya Pratama',
  nisn: '0068942150',
  classGrade: 'Kelas XII RPL 1',
  major: 'Rekayasa Perangkat Lunak',
  schoolName: 'SMK Negeri 1 Jakarta',
  schoolAddress: 'Jl. Budi Utomo No. 7, Pasar Baru, Sawah Besar, Jakarta Pusat',
  schoolSupervisorName: 'Dra. Sri Wahyuni, M.Pd.',
  schoolSupervisorPhone: '0812-9876-5432',
  companyName: 'PT Inovasi Solusi Nusantara',
  companyAddress: 'Cyber 2 Tower Lt. 18, Jl. H. R. Rasuna Said, Kuningan, Jakarta Selatan',
  department: 'Divisi Web & UI/UX Development',
  mentorName: 'Hendra Wijaya, S.Kom.',
  mentorPhone: '0857-1122-3344',
  mentorEmail: 'hendra.wijaya@inovasisolusi.co.id',
  startDate: '2026-08-01',
  endDate: '2026-11-30',
  targetWorkDays: 80,
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  bio: 'Siswa antusias teknologi yang sedang menjalani Praktik Kerja Lapangan (PKL) / Magang di bidang pengembangan web front-end dan perancangan antarmuka pengguna.'
};

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'jrn-1',
    date: '2026-10-20',
    startTime: '08:30',
    endTime: '17:00',
    title: 'Implementasi Komponen Reusable & Uji Integrasi UI',
    description: 'Melakukan refactoring komponen kartu produk pada halaman katalog web internal klien. Membuat styling modular menggunakan Tailwind CSS dan menyelaraskan dengan panduan desain Figma.',
    keyLearnings: 'Memahami konsep reusable component, props drilling prevention, serta pemakaian atomic design pattern di project berskala besar.',
    obstacles: 'Sempat terjadi benturan class styling Tailwind pada mode mobile dan breakpoint tablet.',
    solutions: 'Mengkaji kembali layout grid dan menerapkan modifier responsive (sm:, md:, lg:) dengan panduan dev tools browser.',
    mood: 'semangat',
    tags: ['Tailwind CSS', 'React', 'Frontend', 'Refactoring'],
    verifiedByMentor: true,
    createdAt: '2026-10-20T17:15:00.000Z'
  },
  {
    id: 'jrn-2',
    date: '2026-10-19',
    startTime: '08:30',
    endTime: '16:45',
    title: 'Weekly Sprint Review & Pembagian Backlog Tugas',
    description: 'Mengikuti pertemuan mingguan sprint bersama tim pengembang dan project manager. Menyampaikan capaian pengerjaan form validasi minggu lalu serta menerima arahan penugasan fitur baru.',
    keyLearnings: 'Mempelajari cara kerja metodologi Scrum Agile di dunia industri, estimasi story point, dan cara berkomunikasi teknis secara efektif.',
    obstacles: 'Gugup saat mempresentasikan hasil pengerjaan di hadapan tim pengembang senior.',
    solutions: 'Mempersiapkan poin-poin presentasi terlebih dahulu dan mencatat setiap masukan yang diberikan pembimbing.',
    mood: 'senang',
    tags: ['Scrum', 'Sprint Review', 'Meeting', 'Agile'],
    verifiedByMentor: true,
    createdAt: '2026-10-19T17:00:00.000Z'
  },
  {
    id: 'jrn-3',
    date: '2026-10-16',
    startTime: '08:30',
    endTime: '17:15',
    title: 'Penerapan Validasi Form dan Penanganan Pesan Error',
    description: 'Membuat mekanisme validasi pada formulir registrasi mitra. Memastikan format email valid, konfirmasi kata sandi cocok, dan nomor telepon sesuai ketentuan.',
    keyLearnings: 'Pentingnya user feedback yang jelas pada validasi sisi klien dan perlindungan keamanan dasar sebelum request dikirim ke backend.',
    obstacles: 'Regular expression (regex) validasi format nomor telepon Indonesia sempat salah mengecek awalan +62 dan 08.',
    solutions: 'Berkonsultasi dengan Kak Hendra (mentor) dan membaca dokumentasi pola regex yang standar.',
    mood: 'senang',
    tags: ['Form Validation', 'JavaScript', 'UX'],
    verifiedByMentor: true,
    createdAt: '2026-10-16T17:20:00.000Z'
  },
  {
    id: 'jrn-4',
    date: '2026-10-15',
    startTime: '08:45',
    endTime: '17:00',
    title: 'Slicing Desain Figma ke Kode Antarmuka Web',
    description: 'Menerjemahkan wireframe dan high-fidelity mockup dari UI Designer ke dalam kode HTML dan CSS yang responsif.',
    keyLearnings: 'Memahami cara mengekspor aset vektor SVG, membaca design tokens (warna, font size, margin), dan pixel-perfect alignment.',
    obstacles: 'Font kustom tidak ter-render dengan rapi di perangkat resolusi rendah.',
    solutions: 'Mengatur font-smoothing dan memuat web font dengan fallback font sans-serif standar sistem.',
    mood: 'biasa',
    tags: ['Figma', 'Slicing', 'CSS', 'UI Design'],
    verifiedByMentor: true,
    createdAt: '2026-10-15T17:10:00.000Z'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2026-10-21',
    checkInTime: '08:15',
    checkOutTime: undefined,
    status: 'hadir',
    notes: 'Tiba tepat waktu, langsung mengikuti daily standup.',
    location: 'Kantor Pusat - Cyber 2'
  },
  {
    id: 'att-2',
    date: '2026-10-20',
    checkInTime: '08:20',
    checkOutTime: '17:05',
    status: 'hadir',
    notes: 'Bekerja onsite, menyelesaikan revisi komponen.',
    location: 'Kantor Pusat - Cyber 2'
  },
  {
    id: 'att-3',
    date: '2026-10-19',
    checkInTime: '08:25',
    checkOutTime: '17:00',
    status: 'hadir',
    notes: 'Sprint review onsite.',
    location: 'Kantor Pusat - Cyber 2'
  },
  {
    id: 'att-4',
    date: '2026-10-16',
    checkInTime: '08:28',
    checkOutTime: '17:10',
    status: 'hadir',
    notes: 'Pengerjaan fitur validasi formulir.',
    location: 'Kantor Pusat - Cyber 2'
  },
  {
    id: 'att-5',
    date: '2026-10-15',
    checkInTime: '08:30',
    checkOutTime: '17:00',
    status: 'wfh',
    notes: 'Jadwal WFH tim pengembangan sesuai rotasi.',
    location: 'Work From Home'
  },
  {
    id: 'att-6',
    date: '2026-10-14',
    checkInTime: '08:18',
    checkOutTime: '17:02',
    status: 'hadir',
    notes: 'Testing antarmuka pengguna.',
    location: 'Kantor Pusat - Cyber 2'
  },
  {
    id: 'att-7',
    date: '2026-10-13',
    checkInTime: '08:20',
    checkOutTime: '17:00',
    status: 'hadir',
    notes: 'Eksplorasi dokumentasi codebase.',
    location: 'Kantor Pusat - Cyber 2'
  },
  {
    id: 'att-8',
    date: '2026-10-12',
    checkInTime: '08:15',
    checkOutTime: '17:00',
    status: 'hadir',
    notes: 'Briefing awal pekan.',
    location: 'Kantor Pusat - Cyber 2'
  },
  {
    id: 'att-9',
    date: '2026-10-09',
    checkInTime: undefined,
    checkOutTime: undefined,
    status: 'izin',
    notes: 'Izin menghadiri gladi bersih ujian sertifikasi di sekolah (Surat terlampir).',
    location: 'SMK Negeri 1 Jakarta'
  },
  {
    id: 'att-10',
    date: '2026-10-08',
    checkInTime: '08:22',
    checkOutTime: '17:05',
    status: 'hadir',
    notes: 'Pengerjaan modul profil pengguna.',
    location: 'Kantor Pusat - Cyber 2'
  }
];

export const INITIAL_TODOS: TodoTask[] = [
  {
    id: 'todo-1',
    title: 'Selesaikan Fitur Filter Pencarian Katalog',
    description: 'Menambahkan query filtering kategori dan rentang harga pada antarmuka pencarian.',
    dueDate: '2026-10-22',
    priority: 'tinggi',
    status: 'sedang',
    category: 'Development',
    createdAt: '2026-10-19T09:00:00.000Z'
  },
  {
    id: 'todo-2',
    title: 'Menyusun Draft Bab 3 Laporan Magang PKL',
    description: 'Menuliskan profil divisi, diagram alur sistem yang dipelajari, dan rekap pekerjaan mingguan.',
    dueDate: '2026-10-24',
    priority: 'tinggi',
    status: 'belum',
    category: 'Laporan',
    createdAt: '2026-10-18T10:00:00.000Z'
  },
  {
    id: 'todo-3',
    title: 'Meminta Tanda Tangan Evaluasi Pembimbing Bulan Oktober',
    description: 'Konsultasi dengan Kak Hendra untuk mereview jurnal harian dan form nilai tengah magang.',
    dueDate: '2026-10-25',
    priority: 'sedang',
    status: 'sedang',
    category: 'Administrasi',
    createdAt: '2026-10-17T11:00:00.000Z'
  },
  {
    id: 'todo-4',
    title: 'Perbaiki Responsive Header di Layar Mobile',
    description: 'Hamburger menu terkadang tertutup overlay dropdown saat di klik pada iPhone SE.',
    dueDate: '2026-10-21',
    priority: 'sedang',
    status: 'selesai',
    category: 'Bug Fix',
    completedAt: '2026-10-20T16:30:00.000Z',
    createdAt: '2026-10-16T14:00:00.000Z'
  },
  {
    id: 'todo-5',
    title: 'Pelajari Dokumentasi Tailwind CSS V4 & Vite',
    description: 'Membaca changelog fitur terbaru untuk optimasi bundle aplikasi perusahaan.',
    dueDate: '2026-10-18',
    priority: 'rendah',
    status: 'selesai',
    category: 'Belajar',
    completedAt: '2026-10-18T16:00:00.000Z',
    createdAt: '2026-10-15T09:00:00.000Z'
  }
];

export const INITIAL_REFLECTIONS: SelfReflection[] = [
  {
    id: 'ref-1',
    periodTitle: 'Refleksi Tengah Periode Magang (Bulan ke-2 & ke-3)',
    date: '2026-10-18',
    memorableExperience: 'Momen paling berkesan adalah ketika kode komponen form yang saya buat berhasil di-merge ke branch staging dan digunakan dalam pengujian internal tim perusahaan tanpa bug kritis.',
    newSkills: [
      'Git collaboration (Branching, Pull Request, Code Review)',
      'Desain antarmuka responsif dengan Tailwind CSS & Figma',
      'Manajemen waktu kerja dan profesionalisme dunia industri',
      'Public speaking saat stand-up meeting harian'
    ],
    mainChallenges: 'Awalnya merasa kewalahan membaca basis kode (codebase) yang sangat besar dan menggunakan banyak library baru yang belum pernah diajarkan di sekolah.',
    personalGrowth: 'Saya menjadi jauh lebih mandiri dalam mencari pemecahan masalah (debugging), tidak mudah panik saat terjadi error, dan lebih berani bertanya kepada rekan kerja setelah mencoba mencari solusi sendiri terlebih dahulu.',
    goalsToImprove: 'Ingin memperdalam pemahaman tentang state management lanjutan, penulisan unit testing otomatis, dan menyelesaikan laporan magang lebih awal sebelum ujian sekolah.'
  }
];

export const INITIAL_MENTOR_EVALS: MentorEvaluation[] = [
  {
    id: 'me-1',
    date: '2026-10-15',
    mentorName: 'Hendra Wijaya, S.Kom.',
    mentorRole: 'Pembimbing Lapangan',
    category: 'Performa Kerja',
    rating: 5,
    comments: 'Rizky menunjukkan antusiasme belajar yang sangat tinggi. Kemampuan beradaptasi dengan teknologi frontend di kantor sangat cepat. Tugas-tugas slicing dan komponen dikerjakan dengan rapi dan teliti.',
    recommendations: 'Tingkatkan pemahaman terkait struktur API error handling dan terus asah pemikiran algoritmik dalam menangani data kompleks.'
  },
  {
    id: 'me-2',
    date: '2026-10-05',
    mentorName: 'Hendra Wijaya, S.Kom.',
    mentorRole: 'Pembimbing Lapangan',
    category: 'Kedisiplinan',
    rating: 5,
    comments: 'Kehadiran selalu tepat waktu, komunikatif saat ada kendala, dan sopan dalam berinteraksi dengan seluruh anggota tim divisi web.',
    recommendations: 'Pertahankan kedisiplinan dan kebiasaan mencatat logbook harian ini hingga akhir masa magang.'
  },
  {
    id: 'me-3',
    date: '2026-09-28',
    mentorName: 'Dra. Sri Wahyuni, M.Pd.',
    mentorRole: 'Guru Pembimbing Sekolah',
    category: 'Etika & Sikap',
    rating: 5,
    comments: 'Berdasarkan kunjungan monitoring sekolah ke PT Inovasi Solusi Nusantara, pihak industri memberikan apresiasi positif terhadap etos kerja dan kesopanan ananda Rizky.',
    recommendations: 'Jangan lupa untuk mencicil pengumpulan berkas bukti lampiran jurnal harian untuk sidang laporan magang di sekolah.'
  }
];

export const INITIAL_GALLERY: DocumentationPhoto[] = [
  {
    id: 'gal-1',
    title: 'Sesi Diskusi Arsitektur UI bersama Tim Frontend',
    date: '2026-10-14',
    description: 'Mendengarkan arahan dari Lead Engineer mengenai perancangan design system baru dan struktur folder aplikasi web.',
    category: 'Briefing & Diskusi',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-2',
    title: 'Workspace & Pengerjaan Komponen Web di Kantor',
    date: '2026-10-16',
    description: 'Suasana meja kerja saat melakukan penyesuaian breakpoint responsive dan code review fitur formulir registrasi.',
    category: 'Proyek',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-3',
    title: 'Presentasi Hasil Slicing Desain pada Weekly Demo',
    date: '2026-10-19',
    description: 'Mendemonstrasikan hasil implementasi halaman katalog responsif di hadapan supervisor dan Product Manager.',
    category: 'Presentasi',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-4',
    title: 'Kunjungan Guru Pembimbing Sekolah ke Industri',
    date: '2026-09-28',
    description: 'Sesi monitoring berkala bersama Ibu Sri Wahyuni dan Kak Hendra membahas capaian kompetensi magang.',
    category: 'Kegiatan Lapangan',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_COMPETENCIES: CompetencyItem[] = [
  { id: 'comp-1', title: 'Pemahaman Alur Kerja & Budaya Kerja Industri (K3)', category: 'Administrasi', isCompleted: true, completedDate: '2026-08-05' },
  { id: 'comp-2', title: 'Penggunaan Git untuk Version Control & Kolaborasi Tim', category: 'Teknis', isCompleted: true, completedDate: '2026-08-20' },
  { id: 'comp-3', title: 'Slicing Desain Figma menjadi HTML/CSS Responsif', category: 'Teknis', isCompleted: true, completedDate: '2026-09-10' },
  { id: 'comp-4', title: 'Membangun Komponen Antarmuka Reusable (Modern React)', category: 'Teknis', isCompleted: true, completedDate: '2026-10-15' },
  { id: 'comp-5', title: 'Validasi Formulir & Penanganan Error Sisi Klien', category: 'Teknis', isCompleted: true, completedDate: '2026-10-16' },
  { id: 'comp-6', title: 'Konsumsi RESTful API & Integrasi Data Asinkron', category: 'Teknis', isCompleted: false },
  { id: 'comp-7', title: 'Komunikasi Efektif & Presentasi Tugas (Sprint Standup)', category: 'Soft Skill', isCompleted: true, completedDate: '2026-09-25' },
  { id: 'comp-8', title: 'Kemampuan Pemecahan Masalah (Problem Solving & Debugging)', category: 'Soft Skill', isCompleted: true, completedDate: '2026-10-12' },
  { id: 'comp-9', title: 'Penyusunan Logbook Harian & Laporan Berkala Mandiri', category: 'Administrasi', isCompleted: true, completedDate: '2026-09-30' },
  { id: 'comp-10', title: 'Pengujian Tampilan Lintas Browser & Optimasi Performa', category: 'Teknis', isCompleted: false }
];

// LocalStorage Helper Service
export class StorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
    }
  }

  // Profile
  static getProfile(): StudentProfile {
    return this.getItem<StudentProfile>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE);
  }
  static saveProfile(profile: StudentProfile): void {
    this.setItem(STORAGE_KEYS.PROFILE, profile);
  }

  // Journals
  static getJournals(): JournalEntry[] {
    return this.getItem<JournalEntry[]>(STORAGE_KEYS.JOURNALS, INITIAL_JOURNALS);
  }
  static saveJournals(journals: JournalEntry[]): void {
    this.setItem(STORAGE_KEYS.JOURNALS, journals);
  }

  // Attendance
  static getAttendance(): AttendanceRecord[] {
    return this.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }
  static saveAttendance(records: AttendanceRecord[]): void {
    this.setItem(STORAGE_KEYS.ATTENDANCE, records);
  }

  // Todos
  static getTodos(): TodoTask[] {
    return this.getItem<TodoTask[]>(STORAGE_KEYS.TODOS, INITIAL_TODOS);
  }
  static saveTodos(todos: TodoTask[]): void {
    this.setItem(STORAGE_KEYS.TODOS, todos);
  }

  // Reflections
  static getReflections(): SelfReflection[] {
    return this.getItem<SelfReflection[]>(STORAGE_KEYS.REFLECTIONS, INITIAL_REFLECTIONS);
  }
  static saveReflections(reflections: SelfReflection[]): void {
    this.setItem(STORAGE_KEYS.REFLECTIONS, reflections);
  }

  // Mentor Evaluations
  static getMentorEvaluations(): MentorEvaluation[] {
    return this.getItem<MentorEvaluation[]>(STORAGE_KEYS.MENTOR_EVALS, INITIAL_MENTOR_EVALS);
  }
  static saveMentorEvaluations(evals: MentorEvaluation[]): void {
    this.setItem(STORAGE_KEYS.MENTOR_EVALS, evals);
  }

  // Gallery
  static getGallery(): DocumentationPhoto[] {
    return this.getItem<DocumentationPhoto[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  }
  static saveGallery(photos: DocumentationPhoto[]): void {
    this.setItem(STORAGE_KEYS.GALLERY, photos);
  }

  // Competencies
  static getCompetencies(): CompetencyItem[] {
    return this.getItem<CompetencyItem[]>(STORAGE_KEYS.COMPETENCIES, INITIAL_COMPETENCIES);
  }
  static saveCompetencies(items: CompetencyItem[]): void {
    this.setItem(STORAGE_KEYS.COMPETENCIES, items);
  }

  // Reset to default sample demo data
  static resetToDemo(): void {
    this.setItem(STORAGE_KEYS.PROFILE, INITIAL_PROFILE);
    this.setItem(STORAGE_KEYS.JOURNALS, INITIAL_JOURNALS);
    this.setItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    this.setItem(STORAGE_KEYS.TODOS, INITIAL_TODOS);
    this.setItem(STORAGE_KEYS.REFLECTIONS, INITIAL_REFLECTIONS);
    this.setItem(STORAGE_KEYS.MENTOR_EVALS, INITIAL_MENTOR_EVALS);
    this.setItem(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    this.setItem(STORAGE_KEYS.COMPETENCIES, INITIAL_COMPETENCIES);
  }

  // Export full backup as JSON
  static exportDataJSON(): string {
    const fullData = {
      profile: this.getProfile(),
      journals: this.getJournals(),
      attendance: this.getAttendance(),
      todos: this.getTodos(),
      reflections: this.getReflections(),
      mentorEvaluations: this.getMentorEvaluations(),
      gallery: this.getGallery(),
      competencies: this.getCompetencies(),
      exportedAt: new Date().toISOString(),
      appName: 'Internship Journey'
    };
    return JSON.stringify(fullData, null, 2);
  }

  // Import full backup from JSON
  static importDataJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) this.saveProfile(data.profile);
      if (data.journals) this.saveJournals(data.journals);
      if (data.attendance) this.saveAttendance(data.attendance);
      if (data.todos) this.saveTodos(data.todos);
      if (data.reflections) this.saveReflections(data.reflections);
      if (data.mentorEvaluations) this.saveMentorEvaluations(data.mentorEvaluations);
      if (data.gallery) this.saveGallery(data.gallery);
      if (data.competencies) this.saveCompetencies(data.competencies);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  }
}
