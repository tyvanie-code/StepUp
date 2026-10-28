import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  CheckSquare, 
  FileText,
  Menu as MenuIcon
} from 'lucide-react';
import { 
  NavTab, 
  StudentProfile, 
  JournalEntry, 
  AttendanceRecord, 
  TodoTask, 
  SelfReflection, 
  MentorEvaluation, 
  DocumentationPhoto, 
  CompetencyItem 
} from './types';
import { StorageService } from './services/storage';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  FirebaseDataService 
} from './services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { getTodayDateString } from './utils/helpers';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ProfileView } from './components/views/ProfileView';
import { JournalView } from './components/views/JournalView';
import { AttendanceView } from './components/views/AttendanceView';
import { ProgressView } from './components/views/ProgressView';
import { TodoView } from './components/views/TodoView';
import { ReflectionView } from './components/views/ReflectionView';
import { MentorNotesView } from './components/views/MentorNotesView';
import { GalleryView } from './components/views/GalleryView';
import { StatsView } from './components/views/StatsView';
import { ReportView } from './components/views/ReportView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  // Navigation & UI State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isQuickJournalOpen, setIsQuickJournalOpen] = useState(false);

  // Firebase Auth & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // App Data State (Initialized from LocalStorage)
  const [profile, setProfile] = useState<StudentProfile>(() => StorageService.getProfile());
  const [journals, setJournals] = useState<JournalEntry[]>(() => StorageService.getJournals());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [todos, setTodos] = useState<TodoTask[]>(() => StorageService.getTodos());
  const [reflections, setReflections] = useState<SelfReflection[]>(() => StorageService.getReflections());
  const [mentorEvaluations, setMentorEvaluations] = useState<MentorEvaluation[]>(() => StorageService.getMentorEvaluations());
  const [gallery, setGallery] = useState<DocumentationPhoto[]>(() => StorageService.getGallery());
  const [competencies, setCompetencies] = useState<CompetencyItem[]>(() => StorageService.getCompetencies());

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Firebase Auth Listener & Auto Cloud Synchronizer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          setIsSyncing(true);
          // Check if user already has data in Cloud Firestore
          const cloudProfile = await FirebaseDataService.getProfile(user.uid);
          if (cloudProfile) {
            setProfile(cloudProfile);
            StorageService.saveProfile(cloudProfile);

            // Fetch subcollections from cloud
            const [cJournals, cAtt, cTodos, cRefl, cEvals, cGallery, cComp] = await Promise.all([
              FirebaseDataService.getJournals(user.uid),
              FirebaseDataService.getAttendance(user.uid),
              FirebaseDataService.getTodos(user.uid),
              FirebaseDataService.getReflections(user.uid),
              FirebaseDataService.getEvaluations(user.uid),
              FirebaseDataService.getGallery(user.uid),
              FirebaseDataService.getCompetencies(user.uid),
            ]);

            if (cJournals.length > 0) { setJournals(cJournals); StorageService.saveJournals(cJournals); }
            if (cAtt.length > 0) { setAttendance(cAtt); StorageService.saveAttendance(cAtt); }
            if (cTodos.length > 0) { setTodos(cTodos); StorageService.saveTodos(cTodos); }
            if (cRefl.length > 0) { setReflections(cRefl); StorageService.saveReflections(cRefl); }
            if (cEvals.length > 0) { setMentorEvaluations(cEvals); StorageService.saveMentorEvaluations(cEvals); }
            if (cGallery.length > 0) { setGallery(cGallery); StorageService.saveGallery(cGallery); }
            if (cComp.length > 0) { setCompetencies(cComp); StorageService.saveCompetencies(cComp); }

            showToast(`Data logbook berhasil disinkronkan dari Cloud Firestore (${user.email})!`, 'success', 'Cloud Terhubung');
          } else {
            // First time user: seed current data to Firestore
            await FirebaseDataService.syncAllToCloud(user.uid, {
              profile,
              journals,
              attendance,
              todos,
              reflections,
              evaluations: mentorEvaluations,
              gallery,
              competencies
            });
            showToast('Data magang lokal berhasil dicadangkan ke Firebase Firestore!', 'success', 'Sinkronisasi Perdana');
          }
        } catch (err) {
          console.error('Error syncing with Firebase:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Auth Action Handlers
  const handleLoginWithGoogle = async () => {
    try {
      setIsSyncing(true);
      const user = await signInWithGoogle();
      showToast(`Selamat datang, ${user.displayName || user.email}! Akun Google berhasil terhubung.`, 'success', 'Login Berhasil');
    } catch (err) {
      console.error(err);
      showToast('Gagal login dengan Google. Silakan coba kembali.', 'error', 'Login Dibatalkan');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      showToast('Anda telah keluar dari akun Google.', 'info', 'Logout Berhasil');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSyncToCloud = async () => {
    if (!currentUser) {
      handleLoginWithGoogle();
      return;
    }
    try {
      setIsSyncing(true);
      await FirebaseDataService.syncAllToCloud(currentUser.uid, {
        profile,
        journals,
        attendance,
        todos,
        reflections,
        evaluations: mentorEvaluations,
        gallery,
        competencies
      });
      showToast('Seluruh data magang berhasil disinkronkan ke Cloud Firestore!', 'success', 'Sinkronisasi Sukses');
    } catch (err) {
      console.error('Sync error:', err);
      showToast('Terjadi kendala saat menyinkronkan data ke cloud.', 'error', 'Sinkronisasi Gagal');
    } finally {
      setIsSyncing(false);
    }
  };

  // Profile Handlers
  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    StorageService.saveProfile(updatedProfile);
    if (currentUser) {
      FirebaseDataService.saveProfile(currentUser.uid, updatedProfile).catch(console.error);
    }
    showToast('Profil siswa magang berhasil diperbarui!', 'success', 'Profil Disimpan');
  };

  // Journal Handlers
  const handleAddJournal = (entry: JournalEntry) => {
    const updated = [entry, ...journals];
    setJournals(updated);
    StorageService.saveJournals(updated);
    if (currentUser) {
      FirebaseDataService.saveJournal(currentUser.uid, entry).catch(console.error);
    }
    showToast(`Jurnal untuk tanggal ${entry.date} berhasil disimpan!`, 'success', 'Jurnal Ditambahkan');
    setIsQuickJournalOpen(false);
  };

  const handleUpdateJournal = (entry: JournalEntry) => {
    const updated = journals.map(j => j.id === entry.id ? entry : j);
    setJournals(updated);
    StorageService.saveJournals(updated);
    if (currentUser) {
      FirebaseDataService.saveJournal(currentUser.uid, entry).catch(console.error);
    }
    showToast('Perubahan catatan jurnal berhasil disimpan.', 'success', 'Jurnal Diperbarui');
  };

  const handleDeleteJournal = (id: string) => {
    const updated = journals.filter(j => j.id !== id);
    setJournals(updated);
    StorageService.saveJournals(updated);
    if (currentUser) {
      FirebaseDataService.deleteJournal(currentUser.uid, id).catch(console.error);
    }
    showToast('Catatan jurnal harian telah dihapus.', 'info', 'Dihapus');
  };

  // Attendance Handlers
  const handleSaveAttendance = (record: AttendanceRecord) => {
    const existingIndex = attendance.findIndex(a => a.date === record.date);
    let updated: AttendanceRecord[];
    if (existingIndex >= 0) {
      updated = [...attendance];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...attendance];
    }
    setAttendance(updated);
    StorageService.saveAttendance(updated);
    if (currentUser) {
      FirebaseDataService.saveAttendance(currentUser.uid, record).catch(console.error);
    }
    showToast(`Presensi tanggal ${record.date} berhasil disimpan.`, 'success', 'Presensi Berhasil');
  };

  const handleDeleteAttendance = (id: string) => {
    const updated = attendance.filter(a => a.id !== id);
    setAttendance(updated);
    StorageService.saveAttendance(updated);
    if (currentUser) {
      FirebaseDataService.deleteAttendance(currentUser.uid, id).catch(console.error);
    }
    showToast('Catatan presensi telah dihapus.', 'info', 'Dihapus');
  };

  // Todos Handlers
  const handleAddTodo = (task: TodoTask) => {
    const updated = [task, ...todos];
    setTodos(updated);
    StorageService.saveTodos(updated);
    if (currentUser) {
      FirebaseDataService.saveTodo(currentUser.uid, task).catch(console.error);
    }
    showToast('Tugas baru berhasil ditambahkan ke To-Do List!', 'success', 'Tugas Dibuat');
  };

  const handleUpdateTodo = (task: TodoTask) => {
    const updated = todos.map(t => t.id === task.id ? task : t);
    setTodos(updated);
    StorageService.saveTodos(updated);
    if (currentUser) {
      FirebaseDataService.saveTodo(currentUser.uid, task).catch(console.error);
    }
    showToast('Perubahan tugas berhasil disimpan.', 'success', 'Tugas Diperbarui');
  };

  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    StorageService.saveTodos(updated);
    if (currentUser) {
      FirebaseDataService.deleteTodo(currentUser.uid, id).catch(console.error);
    }
    showToast('Tugas magang berhasil dihapus.', 'info', 'Dihapus');
  };

  // Reflections Handlers
  const handleAddReflection = (item: SelfReflection) => {
    const updated = [item, ...reflections];
    setReflections(updated);
    StorageService.saveReflections(updated);
    if (currentUser) {
      FirebaseDataService.saveReflection(currentUser.uid, item).catch(console.error);
    }
    showToast('Catatan refleksi diri berhasil disimpan!', 'success', 'Refleksi Disimpan');
  };

  const handleUpdateReflection = (item: SelfReflection) => {
    const updated = reflections.map(r => r.id === item.id ? item : r);
    setReflections(updated);
    StorageService.saveReflections(updated);
    if (currentUser) {
      FirebaseDataService.saveReflection(currentUser.uid, item).catch(console.error);
    }
    showToast('Lembar refleksi berhasil diperbarui.', 'success', 'Refleksi Diperbarui');
  };

  const handleDeleteReflection = (id: string) => {
    const updated = reflections.filter(r => r.id !== id);
    setReflections(updated);
    StorageService.saveReflections(updated);
    if (currentUser) {
      FirebaseDataService.deleteReflection(currentUser.uid, id).catch(console.error);
    }
    showToast('Lembar refleksi telah dihapus.', 'info', 'Dihapus');
  };

  // Mentor Evaluations Handlers
  const handleAddEvaluation = (item: MentorEvaluation) => {
    const updated = [item, ...mentorEvaluations];
    setMentorEvaluations(updated);
    StorageService.saveMentorEvaluations(updated);
    if (currentUser) {
      FirebaseDataService.saveEvaluation(currentUser.uid, item).catch(console.error);
    }
    showToast('Catatan evaluasi pembimbing berhasil disimpan!', 'success', 'Evaluasi Disimpan');
  };

  const handleDeleteEvaluation = (id: string) => {
    const updated = mentorEvaluations.filter(e => e.id !== id);
    setMentorEvaluations(updated);
    StorageService.saveMentorEvaluations(updated);
    if (currentUser) {
      FirebaseDataService.deleteEvaluation(currentUser.uid, id).catch(console.error);
    }
    showToast('Catatan evaluasi telah dihapus.', 'info', 'Dihapus');
  };

  // Gallery Handlers
  const handleAddPhoto = (photo: DocumentationPhoto) => {
    const updated = [photo, ...gallery];
    setGallery(updated);
    StorageService.saveGallery(updated);
    if (currentUser) {
      FirebaseDataService.savePhoto(currentUser.uid, photo).catch(console.error);
    }
    showToast('Foto dokumentasi berhasil diunggah ke galeri!', 'success', 'Foto Tersimpan');
  };

  const handleDeletePhoto = (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    StorageService.saveGallery(updated);
    if (currentUser) {
      FirebaseDataService.deletePhoto(currentUser.uid, id).catch(console.error);
    }
    showToast('Foto dokumentasi telah dihapus.', 'info', 'Dihapus');
  };

  // Competency Handlers
  const handleToggleCompetency = (id: string) => {
    let changedItem: CompetencyItem | undefined;
    const updated = competencies.map(c => {
      if (c.id === id) {
        const nextCompleted = !c.isCompleted;
        changedItem = {
          ...c,
          isCompleted: nextCompleted,
          completedDate: nextCompleted ? getTodayDateString() : undefined
        };
        return changedItem;
      }
      return c;
    });
    setCompetencies(updated);
    StorageService.saveCompetencies(updated);
    if (currentUser && changedItem) {
      FirebaseDataService.saveCompetency(currentUser.uid, changedItem).catch(console.error);
    }
    showToast('Status kompetensi berhasil diperbarui.', 'success');
  };

  const handleAddCompetency = (item: Omit<CompetencyItem, 'id'>) => {
    const newItem: CompetencyItem = {
      ...item,
      id: `comp-${Date.now()}`
    };
    const updated = [...competencies, newItem];
    setCompetencies(updated);
    StorageService.saveCompetencies(updated);
    if (currentUser) {
      FirebaseDataService.saveCompetency(currentUser.uid, newItem).catch(console.error);
    }
    showToast('Target kompetensi baru berhasil ditambahkan.', 'success');
  };

  const handleDeleteCompetency = (id: string) => {
    const updated = competencies.filter(c => c.id !== id);
    setCompetencies(updated);
    StorageService.saveCompetencies(updated);
    if (currentUser) {
      FirebaseDataService.deleteCompetency(currentUser.uid, id).catch(console.error);
    }
    showToast('Kompetensi telah dihapus.', 'info');
  };

  // Reset / Import Handlers
  const handleResetDemo = () => {
    StorageService.resetToDemo();
    setProfile(StorageService.getProfile());
    setJournals(StorageService.getJournals());
    setAttendance(StorageService.getAttendance());
    setTodos(StorageService.getTodos());
    setReflections(StorageService.getReflections());
    setMentorEvaluations(StorageService.getMentorEvaluations());
    setGallery(StorageService.getGallery());
    setCompetencies(StorageService.getCompetencies());
    showToast('Data aplikasi berhasil dikembalikan ke contoh awal magang!', 'info', 'Reset Selesai');
  };

  const handleImportSuccess = () => {
    setProfile(StorageService.getProfile());
    setJournals(StorageService.getJournals());
    setAttendance(StorageService.getAttendance());
    setTodos(StorageService.getTodos());
    setReflections(StorageService.getReflections());
    setMentorEvaluations(StorageService.getMentorEvaluations());
    setGallery(StorageService.getGallery());
    setCompetencies(StorageService.getCompetencies());
    showToast('Seluruh data berhasil dipulihkan dari berkas cadangan!', 'success', 'Impor Sukses');
  };

  // Current today attendance
  const todayStr = getTodayDateString();
  const attendanceToday = attendance.find(a => a.date === todayStr);
  const pendingTodosCount = todos.filter(t => t.status !== 'selesai').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={isOpenMobileMenu}
          onCloseMobile={() => setIsOpenMobileMenu(false)}
          profile={profile}
          badges={{
            todosPending: pendingTodosCount,
            journalsCount: journals.length,
            hasCheckedInToday: !!attendanceToday?.checkInTime
          }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <Navbar
            currentTab={currentTab}
            onOpenMobileMenu={() => setIsOpenMobileMenu(true)}
            profile={profile}
            attendanceToday={attendanceToday}
            todos={todos}
            journals={journals}
            onNavigate={setCurrentTab}
            onOpenQuickJournalModal={() => {
              setCurrentTab('journal');
              setIsQuickJournalOpen(true);
            }}
            currentUser={currentUser}
            onLogin={handleLoginWithGoogle}
            onLogout={handleSignOut}
            isSyncing={isSyncing}
          />

          {/* Page Body View Router */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                profile={profile}
                journals={journals}
                attendance={attendance}
                todos={todos}
                competencies={competencies}
                onNavigate={setCurrentTab}
                onOpenJournalModal={() => {
                  setCurrentTab('journal');
                  setIsQuickJournalOpen(true);
                }}
                onOpenCheckInModal={() => setCurrentTab('attendance')}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                profile={profile}
                onSaveProfile={handleSaveProfile}
              />
            )}

            {currentTab === 'journal' && (
              <JournalView
                journals={journals}
                onAddJournal={handleAddJournal}
                onUpdateJournal={handleUpdateJournal}
                onDeleteJournal={handleDeleteJournal}
                isCreateOpenInitially={isQuickJournalOpen}
                onCloseCreateModal={() => setIsQuickJournalOpen(false)}
              />
            )}

            {currentTab === 'attendance' && (
              <AttendanceView
                attendanceList={attendance}
                onSaveAttendanceRecord={handleSaveAttendance}
                onDeleteAttendanceRecord={handleDeleteAttendance}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressView
                profile={profile}
                todos={todos}
                journals={journals}
                attendance={attendance}
                competencies={competencies}
                onToggleCompetency={handleToggleCompetency}
                onAddCompetency={handleAddCompetency}
                onDeleteCompetency={handleDeleteCompetency}
              />
            )}

            {currentTab === 'todo' && (
              <TodoView
                todos={todos}
                onAddTodo={handleAddTodo}
                onUpdateTodo={handleUpdateTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            )}

            {currentTab === 'reflection' && (
              <ReflectionView
                reflections={reflections}
                onAddReflection={handleAddReflection}
                onUpdateReflection={handleUpdateReflection}
                onDeleteReflection={handleDeleteReflection}
              />
            )}

            {currentTab === 'mentor' && (
              <MentorNotesView
                evaluations={mentorEvaluations}
                onAddEvaluation={handleAddEvaluation}
                onDeleteEvaluation={handleDeleteEvaluation}
                mentorNameDefault={profile.mentorName}
                supervisorNameDefault={profile.schoolSupervisorName}
              />
            )}

            {currentTab === 'gallery' && (
              <GalleryView
                photos={gallery}
                onAddPhoto={handleAddPhoto}
                onDeletePhoto={handleDeletePhoto}
              />
            )}

            {currentTab === 'stats' && (
              <StatsView
                profile={profile}
                journals={journals}
                attendance={attendance}
                todos={todos}
                competencies={competencies}
              />
            )}

            {currentTab === 'report' && (
              <ReportView
                profile={profile}
                journals={journals}
                attendance={attendance}
                reflections={reflections}
                evaluations={mentorEvaluations}
                competencies={competencies}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                profile={profile}
                onSaveProfile={handleSaveProfile}
                onResetDemo={handleResetDemo}
                onImportSuccess={handleImportSuccess}
                onNavigate={setCurrentTab}
                currentUser={currentUser}
                onLoginWithGoogle={handleLoginWithGoogle}
                onSignOut={handleSignOut}
                onSyncToCloud={handleSyncToCloud}
                isSyncing={isSyncing}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar (Instant 1-tap switching) */}
      <nav className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
        <button
          type="button"
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentTab === 'dashboard' ? 'text-rose-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-rose-900 scale-110' : 'text-slate-400'}`} />
          <span>Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('journal')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentTab === 'journal' ? 'text-rose-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${currentTab === 'journal' ? 'text-rose-900 scale-110' : 'text-slate-400'}`} />
          <span>Jurnal</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('attendance')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentTab === 'attendance' ? 'text-rose-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className={`w-4 h-4 ${currentTab === 'attendance' ? 'text-rose-900 scale-110' : 'text-slate-400'}`} />
          <span>Absensi</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('todo')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentTab === 'todo' ? 'text-rose-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className={`w-4 h-4 ${currentTab === 'todo' ? 'text-rose-900 scale-110' : 'text-slate-400'}`} />
          <span>To-Do</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('report')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentTab === 'report' ? 'text-rose-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className={`w-4 h-4 ${currentTab === 'report' ? 'text-rose-900 scale-110' : 'text-slate-400'}`} />
          <span>Laporan</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpenMobileMenu(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold text-slate-500 hover:text-rose-900 transition-all cursor-pointer"
        >
          <MenuIcon className="w-4 h-4 text-slate-400" />
          <span>Menu</span>
        </button>
      </nav>

      {/* Global Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
