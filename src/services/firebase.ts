import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider, 
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  getDocFromServer, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
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

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must specify firestoreDatabaseId from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as mandated by the skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Authentication Helpers
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error saat login Google:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error saat logout:', error);
    throw error;
  }
}

// Firestore Synchronized Cloud Service
export const FirebaseDataService = {
  // --- Profile ---
  async getProfile(userId: string): Promise<StudentProfile | null> {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        return snap.data() as StudentProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async saveProfile(userId: string, profile: StudentProfile): Promise<void> {
    const path = `users/${userId}`;
    try {
      await setDoc(doc(db, 'users', userId), {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // --- Journals ---
  async getJournals(userId: string): Promise<JournalEntry[]> {
    const path = `users/${userId}/journals`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'journals'));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as JournalEntry));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async saveJournal(userId: string, journal: JournalEntry): Promise<void> {
    const path = `users/${userId}/journals/${journal.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'journals', journal.id), journal);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteJournal(userId: string, journalId: string): Promise<void> {
    const path = `users/${userId}/journals/${journalId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'journals', journalId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Attendance ---
  async getAttendance(userId: string): Promise<AttendanceRecord[]> {
    const path = `users/${userId}/attendance`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'attendance'));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as AttendanceRecord));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async saveAttendance(userId: string, record: AttendanceRecord): Promise<void> {
    const path = `users/${userId}/attendance/${record.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'attendance', record.id), record);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteAttendance(userId: string, recordId: string): Promise<void> {
    const path = `users/${userId}/attendance/${recordId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'attendance', recordId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Todos ---
  async getTodos(userId: string): Promise<TodoTask[]> {
    const path = `users/${userId}/todos`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'todos'));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as TodoTask));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async saveTodo(userId: string, task: TodoTask): Promise<void> {
    const path = `users/${userId}/todos/${task.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'todos', task.id), task);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteTodo(userId: string, taskId: string): Promise<void> {
    const path = `users/${userId}/todos/${taskId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'todos', taskId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Reflections ---
  async getReflections(userId: string): Promise<SelfReflection[]> {
    const path = `users/${userId}/reflections`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'reflections'));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as SelfReflection));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async saveReflection(userId: string, reflection: SelfReflection): Promise<void> {
    const path = `users/${userId}/reflections/${reflection.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'reflections', reflection.id), reflection);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteReflection(userId: string, reflectionId: string): Promise<void> {
    const path = `users/${userId}/reflections/${reflectionId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'reflections', reflectionId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Mentor Evaluations ---
  async getEvaluations(userId: string): Promise<MentorEvaluation[]> {
    const path = `users/${userId}/evaluations`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'evaluations'));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as MentorEvaluation));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async saveEvaluation(userId: string, evalItem: MentorEvaluation): Promise<void> {
    const path = `users/${userId}/evaluations/${evalItem.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'evaluations', evalItem.id), evalItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteEvaluation(userId: string, evalId: string): Promise<void> {
    const path = `users/${userId}/evaluations/${evalId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'evaluations', evalId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Gallery ---
  async getGallery(userId: string): Promise<DocumentationPhoto[]> {
    const path = `users/${userId}/gallery`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'gallery'));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as DocumentationPhoto));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async savePhoto(userId: string, photo: DocumentationPhoto): Promise<void> {
    const path = `users/${userId}/gallery/${photo.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'gallery', photo.id), photo);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deletePhoto(userId: string, photoId: string): Promise<void> {
    const path = `users/${userId}/gallery/${photoId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'gallery', photoId));
    } catch (error)
      {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Competencies ---
  async getCompetencies(userId: string): Promise<CompetencyItem[]> {
    const path = `users/${userId}/competencies`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'competencies'));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as CompetencyItem));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async saveCompetency(userId: string, item: CompetencyItem): Promise<void> {
    const path = `users/${userId}/competencies/${item.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'competencies', item.id), item);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteCompetency(userId: string, competencyId: string): Promise<void> {
    const path = `users/${userId}/competencies/${competencyId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'competencies', competencyId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Initial Batch Seed to Firestore ---
  async syncAllToCloud(userId: string, data: {
    profile: StudentProfile;
    journals: JournalEntry[];
    attendance: AttendanceRecord[];
    todos: TodoTask[];
    reflections: SelfReflection[];
    evaluations: MentorEvaluation[];
    gallery: DocumentationPhoto[];
    competencies: CompetencyItem[];
  }): Promise<void> {
    await this.saveProfile(userId, data.profile);
    for (const j of data.journals) {
      await this.saveJournal(userId, j);
    }
    for (const a of data.attendance) {
      await this.saveAttendance(userId, a);
    }
    for (const t of data.todos) {
      await this.saveTodo(userId, t);
    }
    for (const r of data.reflections) {
      await this.saveReflection(userId, r);
    }
    for (const e of data.evaluations) {
      await this.saveEvaluation(userId, e);
    }
    for (const g of data.gallery) {
      await this.savePhoto(userId, g);
    }
    for (const c of data.competencies) {
      await this.saveCompetency(userId, c);
    }
  }
};
