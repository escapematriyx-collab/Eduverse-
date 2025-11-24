import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  getDoc
} from 'firebase/firestore';
import { Batch, ClassLevel, Subject, ContentItem, ContentType, SubjectData, Student, AppSettings } from '../types';

//Helper to remove undefined fields which cause Firestore to crash
const cleanData = <T extends object>(data: T): T => {
  const clean = { ...data };
  Object.keys(clean).forEach((key) => {
    if ((clean as any)[key] === undefined) {
      delete (clean as any)[key];
    }
  });
  return clean;
};

// --- Initial Seed Data (Used if DB is empty) ---
const INITIAL_BATCHES: Batch[] = [
  {
    id: 'b9-aarambh',
    name: 'Aarambh Batch 2.0',
    classLevel: ClassLevel.Class9,
    originalPrice: 4500,
    discountPrice: 0, 
    description: 'Complete Foundation Course for Class 9',
    teachers: [
      'https://picsum.photos/id/64/100/100',
      'https://picsum.photos/id/65/100/100',
      'https://picsum.photos/id/91/100/100'
    ],
    gradient: 'from-blue-500 to-cyan-400',
    status: 'Active',
    studentCount: 1240
  },
  {
    id: 'b10-vishwas',
    name: 'Vishwas Batch',
    classLevel: ClassLevel.Class10,
    originalPrice: 5000,
    discountPrice: 2999,
    description: 'Target 95%+ in Boards 2025',
    teachers: [
      'https://picsum.photos/id/177/100/100',
      'https://picsum.photos/id/203/100/100',
      'https://picsum.photos/id/338/100/100'
    ],
    gradient: 'from-purple-500 to-pink-500',
    status: 'Active',
    studentCount: 850
  }
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'maths-9', batchId: 'b9-aarambh', name: 'Mathematics', iconName: 'Calculator', color: 'bg-green-100', textColor: 'text-green-700', topicCount: 1 },
  { id: 'science-9', batchId: 'b9-aarambh', name: 'Science', iconName: 'FlaskConical', color: 'bg-blue-100', textColor: 'text-blue-700', topicCount: 1 },
  { id: 'maths-10', batchId: 'b10-vishwas', name: 'Mathematics', iconName: 'Calculator', color: 'bg-green-100', textColor: 'text-green-700', topicCount: 1 },
  { id: 'science-10', batchId: 'b10-vishwas', name: 'Science', iconName: 'Atom', color: 'bg-blue-100', textColor: 'text-blue-700', topicCount: 0 },
];

const INITIAL_CONTENT: ContentItem[] = [
  { id: 'l1', type: ContentType.Lecture, title: 'Quadrilaterals L1 - Introduction', tag: 'MATHS', duration: '45 min', subjectId: 'maths-9', date: '2024-03-01', url: 'https://www.youtube.com/watch?v=example' },
  { id: 'l2', type: ContentType.Lecture, title: 'Real Numbers L1', tag: 'MATHS', duration: '50 min', subjectId: 'maths-10', date: '2024-03-02', url: 'https://www.youtube.com/watch?v=example' },
  { id: 'n1', type: ContentType.Note, title: 'Chapter 8 - Quadrilaterals Notes', tag: 'PDF', subjectId: 'maths-9', date: '2024-03-01', url: '#' },
  { id: 'd1', type: ContentType.DPP, title: 'DPP 01 - Quadrilaterals', tag: 'QUIZ', subjectId: 'maths-9', date: '2024-03-01', url: '#' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Rahul Sharma', email: 'rahul@example.com', batchId: 'b9-aarambh', joinDate: '2024-01-15', progress: 45, status: 'Active' },
  { id: 's2', name: 'Priya Patel', email: 'priya@example.com', batchId: 'b10-vishwas', joinDate: '2024-02-01', progress: 60, status: 'Active' },
];

// --- Helpers to Seed Data ---
const seedData = async () => {
  const batchSnap = await getDocs(collection(db, 'batches'));
  if (batchSnap.empty) {
    console.log("Seeding Database...");
    for (const b of INITIAL_BATCHES) await setDoc(doc(db, 'batches', b.id), cleanData(b));
    for (const s of INITIAL_SUBJECTS) await setDoc(doc(db, 'subjects', s.id), cleanData(s));
    for (const c of INITIAL_CONTENT) await setDoc(doc(db, 'content', c.id), cleanData(c));
    for (const st of INITIAL_STUDENTS) await setDoc(doc(db, 'students', st.id), cleanData(st));
    
    // Seed settings
    await setDoc(doc(db, 'settings', 'global'), { maintenanceMode: false, allowEnrollments: true });
    
    console.log("Database Seeded!");
  }
};

// --- Fetch Actions ---

export const fetchBatches = async (): Promise<Batch[]> => {
  await seedData(); // Ensure data exists
  const snapshot = await getDocs(collection(db, 'batches'));
  return snapshot.docs.map(doc => doc.data() as Batch);
};

export const fetchBatchById = async (id: string): Promise<Batch | undefined> => {
  const ref = doc(db, 'batches', id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Batch) : undefined;
};

export const fetchSubjects = async (batchId?: string): Promise<Subject[]> => {
  let q = collection(db, 'subjects');
  if (batchId) {
    const qFiltered = query(collection(db, 'subjects'), where('batchId', '==', batchId));
    const snapshot = await getDocs(qFiltered);
    return snapshot.docs.map(doc => doc.data() as Subject);
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Subject);
};

export const fetchSubjectById = async (id: string): Promise<Subject | undefined> => {
    const ref = doc(db, 'subjects', id);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Subject) : undefined;
};

export const fetchContent = async (subjectId?: string): Promise<SubjectData> => {
  let snapshot;
  if (subjectId) {
      const q = query(collection(db, 'content'), where('subjectId', '==', subjectId));
      snapshot = await getDocs(q);
  } else {
      snapshot = await getDocs(collection(db, 'content'));
  }

  const items = snapshot.docs.map(doc => doc.data() as ContentItem);
  
  return {
    lectures: items.filter(i => i.type === ContentType.Lecture),
    notes: items.filter(i => i.type === ContentType.Note),
    dpps: items.filter(i => i.type === ContentType.DPP),
  };
};

export const fetchAllContentFlat = async (): Promise<ContentItem[]> => {
    const snapshot = await getDocs(collection(db, 'content'));
    return snapshot.docs.map(doc => doc.data() as ContentItem);
}

export const fetchStudents = async (): Promise<Student[]> => {
  const snapshot = await getDocs(collection(db, 'students'));
  return snapshot.docs.map(doc => doc.data() as Student);
};

export const fetchSettings = async (): Promise<AppSettings> => {
  const ref = doc(db, 'settings', 'global');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as AppSettings;
  }
  return { maintenanceMode: false, allowEnrollments: true };
};

// --- CRUD Actions ---

export const addBatch = async (batch: Batch) => {
  await setDoc(doc(db, 'batches', batch.id), cleanData(batch));
};

export const updateBatch = async (id: string, updates: Partial<Batch>) => {
  await updateDoc(doc(db, 'batches', id), cleanData(updates));
};

export const deleteBatch = async (id: string) => {
  await deleteDoc(doc(db, 'batches', id));
};

export const addSubject = async (subject: Subject) => {
  await setDoc(doc(db, 'subjects', subject.id), cleanData(subject));
};

export const updateSubject = async (id: string, updates: Partial<Subject>) => {
  await updateDoc(doc(db, 'subjects', id), cleanData(updates));
};

export const deleteSubject = async (id: string) => {
  await deleteDoc(doc(db, 'subjects', id));
};

export const addContent = async (type: 'lectures' | 'notes' | 'dpps', item: ContentItem) => {
  await setDoc(doc(db, 'content', item.id), cleanData(item));
  
  // Update Topic Count
  if (item.subjectId) {
      const subRef = doc(db, 'subjects', item.subjectId);
      const subSnap = await getDoc(subRef);
      if (subSnap.exists()) {
          const subData = subSnap.data() as Subject;
          await updateDoc(subRef, { topicCount: (subData.topicCount || 0) + 1 });
      }
  }
};

export const updateContent = async (type: 'lectures' | 'notes' | 'dpps', id: string, updates: Partial<ContentItem>) => {
  await updateDoc(doc(db, 'content', id), cleanData(updates));
};

export const deleteContent = async (type: 'lectures' | 'notes' | 'dpps', id: string) => {
    const ref = doc(db, 'content', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        const item = snap.data() as ContentItem;
        if (item.subjectId) {
             const subRef = doc(db, 'subjects', item.subjectId);
             const subSnap = await getDoc(subRef);
             if (subSnap.exists()) {
                 const subData = subSnap.data() as Subject;
                 await updateDoc(subRef, { topicCount: Math.max(0, (subData.topicCount || 0) - 1) });
             }
        }
    }
    await deleteDoc(ref);
};

export const updateStudentStatus = async (id: string, status: 'Active' | 'Suspended') => {
  await updateDoc(doc(db, 'students', id), { status });
};

export const updateSettings = async (settings: AppSettings) => {
  await setDoc(doc(db, 'settings', 'global'), cleanData(settings));
};