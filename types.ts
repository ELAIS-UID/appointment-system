export enum UserRole {
  USER = 'USER',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  doctorId?: string; // Links to doctors collection (only for DOCTOR role)
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number; // Years
  imageUrl: string;
  isActive: boolean;
  hospitalId?: string;
  description?: string;
  availableSlots: string[]; // e.g. ["09:00 AM", "10:00 AM"]
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  badges: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  patientName: string;
  date: string; // ISO String (Date part)
  slot: string; // e.g. "09:00 AM"
  status: AppointmentStatus;
  notes?: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface MockDBState {
  users: User[];
  doctors: Doctor[];
  hospitals: Hospital[];
  appointments: Appointment[];
  brands: Brand[];
}