import { LucideIcon } from 'lucide-react';

export enum ClassLevel {
  All = 'All',
  Class9 = 'Class 9',
  Class10 = 'Class 10',
  Class11 = 'Class 11',
}

export interface Batch {
  id: string;
  name: string;
  classLevel: ClassLevel;
  originalPrice: number;
  discountPrice: number;
  description: string;
  teachers: string[]; // URLs to images
  gradient: string;
  bannerImage?: string; // Base64 string for uploaded banner
  status?: 'Active' | 'Inactive';
  studentCount?: number;
}

export interface Subject {
  id: string;
  name: string;
  iconName: string; // We'll map this to actual icons
  color: string;
  textColor: string;
  topicCount: number;
  batchId?: string; // Link to batch
}

export enum ContentType {
  Lecture = 'Lecture',
  Note = 'Note',
  DPP = 'DPP',
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  tag?: string;
  date?: string;
  duration?: string; // For lectures
  subjectId?: string; // Link to subject
  url?: string; // For resource link or Base64 file data
}

export interface SubjectData {
  lectures: ContentItem[];
  notes: ContentItem[];
  dpps: ContentItem[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  batchId: string;
  joinDate: string;
  progress: number;
  status: 'Active' | 'Suspended';
}