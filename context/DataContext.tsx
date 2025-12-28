import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Doctor, Appointment, Hospital, User, AppointmentStatus, Brand } from '../types';
import {
  subscribeToCollection,
  addDocument,
  updateDocument,
  deleteDocument,
  COLLECTIONS
} from '../services/firebase';
import { useAuth } from './AuthContext';

interface DataContextType {
  doctors: Doctor[];
  hospitals: Hospital[];
  appointments: Appointment[];
  users: User[];
  brands: Brand[];
  loading: boolean;
  addAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  addDoctor: (doc: Omit<Doctor, 'id'>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  updateDoctorSlots: (doctorId: string, slots: string[]) => Promise<void>;
  toggleDoctorStatus: (id: string) => Promise<void>;
  addBrand: (name: string) => Promise<void>;
  removeBrand: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to public collections (no auth required)
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    try {
      // Subscribe to doctors (public read)
      unsubscribes.push(
        subscribeToCollection<Doctor>(COLLECTIONS.DOCTORS, (data) => {
          setDoctors(data);
        })
      );

      // Subscribe to hospitals (public read)
      unsubscribes.push(
        subscribeToCollection<Hospital>(COLLECTIONS.HOSPITALS, (data) => {
          setHospitals(data);
        })
      );

      // Subscribe to brands (public read)
      unsubscribes.push(
        subscribeToCollection<Brand>(COLLECTIONS.BRANDS, (data) => {
          setBrands(data);
        })
      );
    } catch (error) {
      console.error('Error subscribing to public collections:', error);
    }

    // Set loading to false after a short delay (collections may be empty initially)
    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      unsubscribes.forEach(unsub => unsub());
      clearTimeout(timer);
    };
  }, []);

  // Subscribe to authenticated collections (appointments, users) - requires auth
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    try {
      // Subscribe to appointments
      unsubscribes.push(
        subscribeToCollection<Appointment>(COLLECTIONS.APPOINTMENTS, (data) => {
          setAppointments(data);
        })
      );

      // Subscribe to users
      unsubscribes.push(
        subscribeToCollection<User>(COLLECTIONS.USERS, (data) => {
          setUsers(data);
        })
      );
    } catch (error) {
      console.error('Error subscribing to authenticated collections:', error);
    }

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  const addAppointment = async (appt: Omit<Appointment, 'id' | 'status'>) => {
    try {
      console.log('Creating appointment:', appt);
      await addDocument<Omit<Appointment, 'id'>>(COLLECTIONS.APPOINTMENTS, {
        ...appt,
        status: AppointmentStatus.PENDING
      });
      console.log('✅ Appointment created successfully!');
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      throw error;
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    await updateDocument(COLLECTIONS.APPOINTMENTS, id, { status });
  };

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    await addDocument<Omit<Doctor, 'id'>>(COLLECTIONS.DOCTORS, doc);
  };

  const deleteDoctor = async (id: string) => {
    await deleteDocument(COLLECTIONS.DOCTORS, id);
  };

  const updateDoctorSlots = async (doctorId: string, slots: string[]) => {
    await updateDocument(COLLECTIONS.DOCTORS, doctorId, { availableSlots: slots });
  };

  const toggleDoctorStatus = async (id: string) => {
    const doctor = doctors.find(d => d.id === id);
    if (doctor) {
      await updateDocument(COLLECTIONS.DOCTORS, id, { isActive: !doctor.isActive });
    }
  };

  const addBrand = async (name: string) => {
    await addDocument<Omit<Brand, 'id'>>(COLLECTIONS.BRANDS, { name });
  };

  const removeBrand = async (id: string) => {
    await deleteDocument(COLLECTIONS.BRANDS, id);
  };

  return (
    <DataContext.Provider value={{
      doctors,
      hospitals,
      appointments,
      users,
      brands,
      loading,
      addAppointment,
      updateAppointmentStatus,
      addDoctor,
      deleteDoctor,
      updateDoctorSlots,
      toggleDoctorStatus,
      addBrand,
      removeBrand
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};