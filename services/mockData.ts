import { UserRole, Doctor, Hospital, User, Appointment, AppointmentStatus, Brand } from '../types';

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'City General Hospital',
    location: 'New York, NY',
    imageUrl: 'https://picsum.photos/400/200?random=1',
    badges: ['Trauma Center', 'Cardiology']
  },
  {
    id: 'h2',
    name: 'St. Mary’s Medical Center',
    location: 'San Francisco, CA',
    imageUrl: 'https://picsum.photos/400/200?random=2',
    badges: ['Pediatrics', 'Oncology']
  },
  {
    id: 'h3',
    name: 'Global Health Institute',
    location: 'London, UK',
    imageUrl: 'https://picsum.photos/400/200?random=3',
    badges: ['Neurology', 'Research']
  }
];

const DEFAULT_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Smith',
    specialization: 'Cardiologist',
    experience: 12,
    imageUrl: 'https://picsum.photos/200/200?random=10',
    isActive: true,
    description: 'Expert in heart rhythm disorders and preventive cardiology.',
    availableSlots: DEFAULT_SLOTS
  },
  {
    id: 'd2',
    name: 'Dr. John Doe',
    specialization: 'Pediatrician',
    experience: 8,
    imageUrl: 'https://picsum.photos/200/200?random=11',
    isActive: true,
    description: 'Compassionate care for infants, children, and adolescents.',
    availableSlots: DEFAULT_SLOTS
  },
  {
    id: 'd3',
    name: 'Dr. Emily Blunt',
    specialization: 'Neurologist',
    experience: 15,
    imageUrl: 'https://picsum.photos/200/200?random=12',
    isActive: true,
    description: 'Specializing in headache medicine and neuromuscular disorders.',
    availableSlots: DEFAULT_SLOTS
  },
  {
    id: 'd4',
    name: 'Dr. Michael Chang',
    specialization: 'Dermatologist',
    experience: 5,
    imageUrl: 'https://picsum.photos/200/200?random=13',
    isActive: true,
    description: 'Expert in medical and cosmetic dermatology.',
    availableSlots: DEFAULT_SLOTS
  },
  {
    id: 'd5',
    name: 'Dr. Lisa Ray',
    specialization: 'Orthopedic Surgeon',
    experience: 20,
    imageUrl: 'https://picsum.photos/200/200?random=14',
    isActive: false, // Hidden
    description: 'Specializing in sports injuries and joint replacement.',
    availableSlots: DEFAULT_SLOTS
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alice Johnson',
    email: 'user@health.com',
    role: UserRole.USER
  },
  {
    id: 'u2',
    name: 'Dr. Sarah Smith',
    email: 'doctor@health.com', // Linked to d1
    role: UserRole.DOCTOR
  },
  {
    id: 'u3',
    name: 'Admin User',
    email: 'admin@health.com',
    role: UserRole.ADMIN
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    userId: 'u1',
    doctorId: 'd1',
    patientName: 'Alice Johnson',
    date: new Date().toISOString().split('T')[0], // Today YYYY-MM-DD
    slot: '09:00 AM',
    status: AppointmentStatus.APPROVED
  },
  {
    id: 'a2',
    userId: 'u1',
    doctorId: 'd2',
    patientName: 'Bob Johnson (Son)',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    slot: '10:00 AM',
    status: AppointmentStatus.PENDING
  }
];

export const INITIAL_BRANDS: Brand[] = [
    { id: 'b1', name: 'Mayo Clinic' },
    { id: 'b2', name: 'Johns Hopkins' },
    { id: 'b3', name: 'Cleveland Clinic' },
    { id: 'b4', name: 'UCLA Health' },
    { id: 'b5', name: 'Mass General' },
    { id: 'b6', name: 'Cedars-Sinai' },
];