import { Batch, ClassLevel, Subject, ContentItem, ContentType, SubjectData, Student } from '../types';

const STORAGE_KEY = 'EDUVERSE_DATA_V1';

// Initial Mock Data (used if localStorage is empty)
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
  { id: 'maths-9', batchId: 'b9-aarambh', name: 'Mathematics', iconName: 'Calculator', color: 'bg-green-100', textColor: 'text-green-700', topicCount: 12 },
  { id: 'science-9', batchId: 'b9-aarambh', name: 'Science', iconName: 'FlaskConical', color: 'bg-blue-100', textColor: 'text-blue-700', topicCount: 8 },
  { id: 'maths-10', batchId: 'b10-vishwas', name: 'Mathematics', iconName: 'Calculator', color: 'bg-green-100', textColor: 'text-green-700', topicCount: 15 },
  { id: 'science-10', batchId: 'b10-vishwas', name: 'Science', iconName: 'Atom', color: 'bg-blue-100', textColor: 'text-blue-700', topicCount: 10 },
];

const INITIAL_CONTENT: SubjectData = {
  lectures: [
    { id: 'l1', type: ContentType.Lecture, title: 'Quadrilaterals L1 - Introduction', tag: 'MATHS', duration: '45 min', subjectId: 'maths-9', date: '2024-03-01', url: 'https://www.youtube.com/watch?v=example' },
    { id: 'l2', type: ContentType.Lecture, title: 'Real Numbers L1', tag: 'MATHS', duration: '50 min', subjectId: 'maths-10', date: '2024-03-02', url: 'https://www.youtube.com/watch?v=example' },
  ],
  notes: [
    { id: 'n1', type: ContentType.Note, title: 'Chapter 8 - Quadrilaterals Notes', tag: 'PDF', subjectId: 'maths-9', date: '2024-03-01', url: '#' },
  ],
  dpps: [
    { id: 'd1', type: ContentType.DPP, title: 'DPP 01 - Quadrilaterals', tag: 'QUIZ', subjectId: 'maths-9', date: '2024-03-01', url: '#' },
  ]
};

const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Rahul Sharma', email: 'rahul@example.com', batchId: 'b9-aarambh', joinDate: '2024-01-15', progress: 45, status: 'Active' },
  { id: 's2', name: 'Priya Patel', email: 'priya@example.com', batchId: 'b10-vishwas', joinDate: '2024-02-01', progress: 60, status: 'Active' },
];

// Data Store Interface
interface DataStore {
  batches: Batch[];
  subjects: Subject[];
  content: SubjectData;
  students: Student[];
}

// Load Data
const loadData = (): DataStore => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    batches: INITIAL_BATCHES,
    subjects: INITIAL_SUBJECTS,
    content: INITIAL_CONTENT,
    students: INITIAL_STUDENTS
  };
};

// Save Data
const saveData = (data: DataStore) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Initialize State
let store = loadData();

// --- Getters ---

export const getBatches = () => [...store.batches];
export const getSubjects = (batchId?: string) => {
  if (batchId) {
    return store.subjects.filter(s => s.batchId === batchId);
  }
  return [...store.subjects];
};
export const getContent = () => ({ ...store.content });
export const getStudents = () => [...store.students];

export const getBatchById = (id: string) => store.batches.find(b => b.id === id);
export const getSubjectById = (id: string) => store.subjects.find(s => s.id === id);

// --- Actions (Persist to LocalStorage) ---

export const addBatch = (batch: Batch) => {
  store.batches.push(batch);
  saveData(store);
  return batch;
};

export const updateBatch = (id: string, updates: Partial<Batch>) => {
  store.batches = store.batches.map(b => b.id === id ? { ...b, ...updates } : b);
  saveData(store);
};

export const deleteBatch = (id: string) => {
  store.batches = store.batches.filter(b => b.id !== id);
  // Cleanup related subjects
  store.subjects = store.subjects.filter(s => s.batchId !== id);
  saveData(store);
};

export const addSubject = (subject: Subject) => {
  store.subjects.push(subject);
  saveData(store);
  return subject;
};

export const updateSubject = (id: string, updates: Partial<Subject>) => {
  store.subjects = store.subjects.map(s => s.id === id ? { ...s, ...updates } : s);
  saveData(store);
};

export const deleteSubject = (id: string) => {
  store.subjects = store.subjects.filter(s => s.id !== id);
  // Cleanup related content
  store.content.lectures = store.content.lectures.filter(c => c.subjectId !== id);
  store.content.notes = store.content.notes.filter(c => c.subjectId !== id);
  store.content.dpps = store.content.dpps.filter(c => c.subjectId !== id);
  saveData(store);
};

export const addContent = (type: 'lectures' | 'notes' | 'dpps', item: ContentItem) => {
  store.content[type].push(item);

  // Automatically increment topic count for the subject
  if (item.subjectId) {
    const subject = store.subjects.find(s => s.id === item.subjectId);
    if (subject) {
      subject.topicCount = (subject.topicCount || 0) + 1;
    }
  }

  saveData(store);
  return item;
};

export const updateContent = (type: 'lectures' | 'notes' | 'dpps', id: string, updates: Partial<ContentItem>) => {
  store.content[type] = store.content[type].map(item => item.id === id ? { ...item, ...updates } : item);
  saveData(store);
};

export const deleteContent = (type: 'lectures' | 'notes' | 'dpps', id: string) => {
  // Find the item first to get its subjectId
  const itemToDelete = store.content[type].find(i => i.id === id);
  
  store.content[type] = store.content[type].filter(i => i.id !== id);

  // Automatically decrement topic count
  if (itemToDelete && itemToDelete.subjectId) {
    const subject = store.subjects.find(s => s.id === itemToDelete.subjectId);
    if (subject && subject.topicCount > 0) {
      subject.topicCount = subject.topicCount - 1;
    }
  }

  saveData(store);
};

export const updateStudentStatus = (id: string, status: 'Active' | 'Suspended') => {
  store.students = store.students.map(s => s.id === id ? { ...s, status } : s);
  saveData(store);
};

// Helper for resetting data (for debugging)
export const resetData = () => {
  localStorage.removeItem(STORAGE_KEY);
  store = loadData();
  window.location.reload();
};