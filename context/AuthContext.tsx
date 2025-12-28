import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, UserRole } from '../types';
import {
  auth,
  loginWithEmail,
  signupWithEmail,
  logoutUser,
  onAuthChange,
  setDocument,
  getDocument,
  addDocument,
  COLLECTIONS
} from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, role?: UserRole, secretCode?: string) => Promise<boolean>;
  validateSecretCode: (role: UserRole, code: string) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secret codes from environment variables
const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE || 'ADMIN2024';
const DOCTOR_SECRET_CODE = import.meta.env.VITE_DOCTOR_SECRET_CODE || 'DOCTOR2024';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const userProfile = await getDocument<User>(COLLECTIONS.USERS, firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
          } else {
            // Create a basic profile if not exists
            const basicUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: UserRole.USER
            };
            setUser(basicUser);
          }
        } catch (error) {
          console.warn('Error fetching user profile:', error);
          // Use basic user info from Firebase Auth
          const basicUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            role: UserRole.USER
          };
          setUser(basicUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Validate secret code for Admin/Doctor roles
  const validateSecretCode = (role: UserRole, code: string): boolean => {
    if (role === UserRole.ADMIN) {
      return code === ADMIN_SECRET_CODE;
    }
    if (role === UserRole.DOCTOR) {
      return code === DOCTOR_SECRET_CODE;
    }
    return true; // No code needed for regular users
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      await loginWithEmail(email, password);
      return true;
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
    secretCode?: string
  ): Promise<boolean> => {
    try {
      setError(null);

      // Validate secret code for Admin/Doctor roles
      if (role === UserRole.ADMIN || role === UserRole.DOCTOR) {
        if (!secretCode) {
          setError('Secret code is required for Admin/Doctor signup');
          return false;
        }
        if (!validateSecretCode(role, secretCode)) {
          setError('Invalid secret code. Please contact administrator.');
          return false;
        }
      }

      setLoading(true);
      const result = await signupWithEmail(email, password);

      // For doctors, create a doctor profile first and link it
      let doctorId: string | undefined;
      if (role === UserRole.DOCTOR) {
        // Create doctor profile in doctors collection
        doctorId = await addDocument(COLLECTIONS.DOCTORS, {
          name,
          specialization: 'General Practitioner', // Default, can be updated later
          experience: 1,
          description: `${name} - Healthcare Professional`,
          isActive: true,
          imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`,
          availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
        });
        console.log('✅ Created doctor profile with ID:', doctorId);
      }

      // Create user profile in Firestore with the validated role
      const newUser: User = {
        id: result.user.uid,
        name,
        email,
        role,
        ...(doctorId && { doctorId }) // Link to doctor profile if created
      };

      await setDocument(COLLECTIONS.USERS, result.user.uid, newUser);
      console.log('✅ User created:', role, doctorId ? `linked to doctor: ${doctorId}` : '');
      return true;
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err: any) {
      setError('Failed to logout. Please try again.');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, signup, validateSecretCode, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Contact support.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};