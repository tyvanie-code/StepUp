import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  CheckSquare, 
  FileText, 
  Sparkles, 
  MessageSquareQuote, 
  Image, 
  BarChart3, 
  User, 
  Settings,
  GraduationCap,
  ChevronRight,
  X
} from 'lucide-react';
import { NavTab, StudentProfile } from '../../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  profile: StudentProfile;
  badges?: {
    todosPending: number;
    journalsCount: number;
    hasCheckedInToday: boolean;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  profile,
  badges
}) => {
  const mainNavItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journal', label: 'Jurnal Harian', icon: BookOpen, badge: badges?.journalsCount, badgeColor: 'bg-rose-100 text-rose-900' },
    { 
      id: 'attendance', 
      label: 'Absensi', 
      icon: Clock, 
      badge: badges?.hasCheckedInToday ? '✓ Masuk' : 'Belum', 
      badgeColor: badges?.hasCheckedInToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' 
    },
    { id: 'progress', label: 'Progress Magang', icon: TrendingUp },
    { id: 'todo', label: 'To-Do List', icon: CheckSquare, badge: badges?.todosPending, badgeColor: 'bg-rose-200 text-rose-900' },
    { id: 'report', label: 'Laporan Magang', icon: FileText },
  ];

  const secondaryNavItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'reflection', label: 'Refleksi Diri', icon: Sparkles },
    { id: 'mentor', label: 'Catatan Pembimbing', icon: MessageSquareQuote },
    { id: 'gallery', label: 'Galeri Dokumentasi', icon: Image },
    { id: 'stats', label: 'Statistik Magang', icon: BarChart3 },
  ];

  const systemNavItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profil Siswa', icon: User },
    { id: 'settings', label: 'Pengaturan & Backup', icon: Settings },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const NavContent: React.FC = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <button 
          type="button"
          onClick={() => handleTabClick('dashboard')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-950 via-rose-900 to-red-800 flex items-center justify-center text-white shadow-md shadow-rose-950/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>Internship</span>
              <span className="text-rose-900">Journey</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500">Logbook & Portofolio Siswa</p>
          </div>
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List with custom scroll */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Menu Utama */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </p>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer text-left ${
                    isActive
                      ? 'bg-rose-900 text-white shadow-sm shadow-rose-950/30'
                      : 'text-slate-600 hover:bg-rose-50 hover:text-rose-950 active:bg-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-900'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dokumentasi & Evaluasi */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Dokumentasi & Nilai
          </p>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer text-left ${
                    isActive
                      ? 'bg-rose-900 text-white shadow-sm shadow-rose-950/30'
                      : 'text-slate-600 hover:bg-rose-50 hover:text-rose-950 active:bg-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-900'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Akun & Pengaturan */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Akun & Preferensi
          </p>
          <div className="space-y-1">
            {systemNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer text-left ${
                    isActive
                      ? 'bg-rose-900 text-white shadow-sm shadow-rose-950/30'
                      : 'text-slate-600 hover:bg-rose-50 hover:text-rose-950 active:bg-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-900'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini Profile Card at Bottom */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/70">
        <button
          type="button"
          onClick={() => handleTabClick('profile')}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-all text-left group border border-transparent hover:border-slate-200 hover:shadow-xs cursor-pointer"
        >
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-10 h-10 rounded-full object-cover border border-rose-300 ring-2 ring-rose-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-rose-900 transition-colors">
              {profile.fullName}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{profile.companyName}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-800 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed left, width 64) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 no-print">
        <NavContent />
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden no-print"
          onClick={onCloseMobile}
        >
          <div 
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
};
