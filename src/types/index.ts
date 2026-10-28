export type MoodType = 'semangat' | 'senang' | 'biasa' | 'lelah' | 'bingung';

export interface StudentProfile {
  id: string;
  fullName: string;
  nisn: string;
  classGrade: string;
  major: string;
  schoolName: string;
  schoolAddress: string;
  schoolSupervisorName: string;
  schoolSupervisorPhone: string;
  companyName: string;
  companyAddress: string;
  department: string;
  mentorName: string;
  mentorPhone: string;
  mentorEmail: string;
  startDate: string;
  endDate: string;
  targetWorkDays: number;
  avatarUrl: string;
  bio: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  title: string;
  description: string;
  keyLearnings: string;
  obstacles: string;
  solutions: string;
  mood: MoodType;
  tags: string[];
  verifiedByMentor: boolean;
  createdAt: string;
}

export type AttendanceStatus = 'hadir' | 'wfh' | 'izin' | 'sakit' | 'libur';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm
  checkOutTime?: string; // HH:mm
  status: AttendanceStatus;
  notes?: string;
  location?: string;
}

export type TaskPriority = 'rendah' | 'sedang' | 'tinggi';
export type TaskStatus = 'belum' | 'sedang' | 'selesai';

export interface TodoTask {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  completedAt?: string;
  createdAt: string;
}

export interface SelfReflection {
  id: string;
  periodTitle: string; // e.g. "Refleksi Minggu ke-4" atau "Refleksi Tengah Magang"
  date: string;
  memorableExperience: string;
  newSkills: string[];
  mainChallenges: string;
  personalGrowth: string;
  goalsToImprove: string;
}

export interface MentorEvaluation {
  id: string;
  date: string;
  mentorName: string;
  mentorRole: 'Pembimbing Lapangan' | 'Guru Pembimbing Sekolah';
  category: 'Kedisiplinan' | 'Performa Kerja' | 'Inisiatif & Kreativitas' | 'Komunikasi & Kerjasama' | 'Etika & Sikap';
  rating: number; // 1 to 5
  comments: string;
  recommendations: string;
}

export interface DocumentationPhoto {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'Proyek' | 'Briefing & Diskusi' | 'Presentasi' | 'Kegiatan Lapangan' | 'Lainnya';
  imageUrl: string;
}

export interface CompetencyItem {
  id: string;
  title: string;
  category: 'Teknis' | 'Soft Skill' | 'Administrasi';
  isCompleted: boolean;
  completedDate?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'reminder';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export type NavTab = 
  | 'dashboard'
  | 'profile'
  | 'journal'
  | 'attendance'
  | 'progress'
  | 'todo'
  | 'reflection'
  | 'mentor'
  | 'gallery'
  | 'stats'
  | 'report'
  | 'settings';
