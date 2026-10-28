import confetti from 'canvas-confetti';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTH_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export function formatIndonesianDate(dateStr?: string, includeDay: boolean = true): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const dayName = DAY_NAMES_ID[d.getDay()];
  const day = d.getDate();
  const month = MONTH_NAMES_ID[d.getMonth()];
  const year = d.getFullYear();

  if (includeDay) {
    return `${dayName}, ${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
}

export function formatShortDate(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = MONTH_SHORT_ID[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(): string {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getRelativeDays(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Besok';
  if (diffDays === -1) return 'Kemarin';
  if (diffDays > 1) return `${diffDays} hari lagi`;
  return `Terlewat ${Math.abs(diffDays)} hari`;
}

export function calculateInternshipProgress(
  startDateStr: string,
  endDateStr: string,
  attendanceCount: number,
  targetDays: number,
  totalTasks: number,
  completedTasks: number,
  competenciesCount: number,
  completedCompetencies: number
): {
  overallPercentage: number;
  timePercentage: number;
  attendancePercentage: number;
  taskPercentage: number;
  competencyPercentage: number;
  daysRemaining: number;
  totalDurationDays: number;
} {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const now = new Date();

  const totalDurationMs = Math.max(1, end.getTime() - start.getTime());
  const elapsedMs = Math.max(0, Math.min(totalDurationMs, now.getTime() - start.getTime()));
  
  const totalDurationDays = Math.round(totalDurationMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const timePercentage = Math.min(100, Math.round((elapsedMs / totalDurationMs) * 100));
  const attendancePercentage = targetDays > 0 ? Math.min(100, Math.round((attendanceCount / targetDays) * 100)) : 0;
  const taskPercentage = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;
  const competencyPercentage = competenciesCount > 0 ? Math.min(100, Math.round((completedCompetencies / competenciesCount) * 100)) : 0;

  // Weighted overall calculation:
  // 35% Attendance, 35% Tasks & Competencies, 30% Elapsed Time
  const overall = Math.round(
    (attendancePercentage * 0.35) + 
    (((taskPercentage + competencyPercentage) / 2) * 0.35) + 
    (timePercentage * 0.30)
  );

  return {
    overallPercentage: Math.max(0, Math.min(100, overall)),
    timePercentage,
    attendancePercentage,
    taskPercentage,
    competencyPercentage,
    daysRemaining,
    totalDurationDays
  };
}

export function fireSuccessConfetti(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#881337', '#9f1239', '#be123c', '#e11d48', '#b91c1c', '#f59e0b']
    });
  } catch (e) {
    console.log('Confetti effect executed');
  }
}
