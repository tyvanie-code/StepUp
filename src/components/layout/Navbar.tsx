import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  CheckSquare,
  FileText,
  MessageSquareQuote,
  Image as ImageIcon,
  BarChart3,
  User,
  Settings,
  Cloud,
  LogIn
} from 'lucide-react';
import { StudentProfile, AttendanceRecord, TodoTask, JournalEntry, NavTab } from '../../types';
import { formatIndonesianDate, getTodayDateString } from '../../utils/helpers';

const QUICK_NAV_TABS: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'journal', label: 'Jurnal', icon: BookOpen },
  { id: 'attendance', label: 'Absensi', icon: Clock },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'todo', label: 'To-Do', icon: CheckSquare },
  { id: 'report', label: 'Laporan', icon: FileText },
  { id: 'reflection', label: 'Refleksi', icon: Sparkles },
  { id: 'mentor', label: 'Pembimbing', icon: MessageSquareQuote },
  { id: 'gallery', label: 'Galeri', icon: ImageIcon },
  { id: 'stats', label: 'Statistik', icon: BarChart3 },
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];

interface NavbarProps {
  currentTab: NavTab;
  onOpenMobileMenu: () => void;
  profile: StudentProfile;
  attendanceToday?: AttendanceRecord;
  todos: TodoTask[];
  journals: JournalEntry[];
  onNavigate: (tab: NavTab) => void;
  onOpenQuickJournalModal: () => void;
  currentUser?: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null;
  onLogin?: () => void;
  onLogout?: () => void;
  isSyncing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobileMenu,
  profile,
  attendanceToday,
  todos,
  journals,
  onNavigate,
  onOpenQuickJournalModal,
  currentUser,
  onLogin,
  onLogout,
  isSyncing = false,
}) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const todayStr = getTodayDateString();

  // Compute dynamic smart reminders
  const reminders: { id: string; title: string; message: string; type: 'warning' | 'info' | 'success'; tab: NavTab }[] = [];

  // 1. Attendance check
  if (!attendanceToday || !attendanceToday.checkInTime) {
    reminders.push({
      id: 'rem-att-in',
      title: 'Belum Check-In Hari Ini',
      message: 'Kamu belum mencatat absensi masuk. Segera lakukan Check-In!',
      type: 'warning',
      tab: 'attendance'
    });
  } else if (!attendanceToday.checkOutTime && attendanceToday.status === 'hadir') {
    reminders.push({
      id: 'rem-att-out',
      title: 'Pengingat Check-Out',
      message: 'Ingat untuk melakukan Check-Out saat jam kerja berakhir.',
      type: 'info',
      tab: 'attendance'
    });
  }

  // 2. Journal entry for today
  const hasJournalToday = journals.some(j => j.date === todayStr);
  if (!hasJournalToday) {
    reminders.push({
      id: 'rem-jrn',
      title: 'Jurnal Harian Belum Diisi',
      message: 'Dokumentasikan apa saja kegiatan dan pembelajaranmu hari ini.',
      type: 'warning',
      tab: 'journal'
    });
  }

  // 3. Due tasks
  const pendingTodos = todos.filter(t => t.status !== 'selesai');
  const dueSoonTodos = pendingTodos.filter(t => {
    if (!t.dueDate) return false;
    const diffDays = Math.round((new Date(t.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1; // today or overdue
  });

  if (dueSoonTodos.length > 0) {
    reminders.push({
      id: 'rem-todo',
      title: `${dueSoonTodos.length} Tugas Mendekati Tenggat`,
      message: `Tugas "${dueSoonTodos[0].title}" ${dueSoonTodos.length > 1 ? `dan ${dueSoonTodos.length - 1} lainnya` : ''} perlu diselesaikan.`,
      type: 'warning',
      tab: 'todo'
    });
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotificationMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 no-print">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Today's Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-900 border border-rose-200">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {formatIndonesianDate(todayStr, true)}
              </p>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                {profile.companyName} • {profile.department}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Attendance Status, Quick Action & Notifications */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Attendance Status Pill */}
          <button
            onClick={() => onNavigate('attendance')}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              attendanceToday?.checkInTime
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${attendanceToday?.checkInTime ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {attendanceToday?.checkInTime ? (
              <span>Check-In: <strong>{attendanceToday.checkInTime}</strong></span>
            ) : (
              <span>Belum Check-In Hari Ini</span>
            )}
          </button>

          {/* Quick Add Journal Button */}
          <button
            onClick={onOpenQuickJournalModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-900 hover:bg-rose-950 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-rose-950/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tulis Jurnal</span>
            <span className="sm:hidden">Jurnal</span>
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifikasi & Pengingat"
            >
              <Bell className="w-5 h-5" />
              {reminders.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-700 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {reminders.length}
                </span>
              )}
            </button>

            {/* Dropdown Card */}
            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-800" />
                    <h4 className="text-sm font-bold text-slate-900">Notifikasi & Pengingat</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {reminders.length} aktif
                  </span>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {reminders.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">Semua Beres!</p>
                      <p className="text-[11px]">Kamu sudah menyelesaikan absensi dan jurnal hari ini.</p>
                    </div>
                  ) : (
                    reminders.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.tab);
                          setShowNotificationMenu(false);
                        }}
                        className="p-3 rounded-xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                            item.type === 'warning' ? 'text-amber-500' : 'text-rose-700'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-rose-900">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                              {item.message}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-800 shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Tips: Rutin isi jurnal setiap sore</span>
                  <button 
                    onClick={() => {
                      onNavigate('todo');
                      setShowNotificationMenu(false);
                    }}
                    className="font-semibold text-rose-800 hover:underline"
                  >
                    Lihat Semua Tugas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Firebase Cloud Sync Status / Login Button */}
          {currentUser ? (
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title={`Akun terhubung: ${currentUser.email}. Klik untuk buka Pengaturan Firebase.`}
            >
              <Cloud className={`w-3.5 h-3.5 text-emerald-600 ${isSyncing ? 'animate-pulse' : ''}`} />
              <span className="max-w-[100px] truncate">{currentUser.displayName?.split(' ')[0] || 'Cloud'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-900 text-xs font-semibold transition-all cursor-pointer"
              title="Masuk dengan Google untuk sinkronkan data ke Cloud Firebase"
            >
              <LogIn className="w-3.5 h-3.5 text-rose-800" />
              <span>Login</span>
            </button>
          )}

          {/* Student Profile avatar chip */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Buka Profil Siswa"
          >
            <img
              src={currentUser?.photoURL || profile.avatarUrl}
              alt={profile.fullName}
              className="w-8 h-8 rounded-full object-cover border border-rose-400 ring-2 ring-rose-100"
            />
          </button>
        </div>
      </div>

      {/* Horizontal Quick-Nav Feature Strip */}
      <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Menu:
        </span>
        {QUICK_NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-rose-900 text-white shadow-xs shadow-rose-950/20'
                  : 'text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-900 active:bg-rose-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
