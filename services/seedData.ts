import {
    addDocument,
    setDocument,
    COLLECTIONS,
    signupWithEmail,
    getCollectionCount,
    clearCollection
} from '../services/firebase';
import { UserRole, Doctor, Hospital, Brand, AppointmentStatus } from '../types';

/**
 * Seed initial data to Firestore
 * Run this once after setting up Firebase to populate collections
 * 
 * Usage: Import and call seedAllData() from browser console or a temporary button
 */

const DEFAULT_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const SEED_HOSPITALS = [
    {
        name: 'City General Hospital',
        location: 'New York, NY',
        imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop',
        badges: ['Trauma Center', 'Cardiology']
    },
    {
        name: "St. Mary's Medical Center",
        location: 'San Francisco, CA',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop',
        badges: ['Pediatrics', 'Oncology']
    },
    {
        name: 'Global Health Institute',
        location: 'London, UK',
        imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=200&fit=crop',
        badges: ['Neurology', 'Research']
    }
];

const SEED_DOCTORS = [
    {
        name: 'Dr. Sarah Smith',
        specialization: 'Cardiologist',
        experience: 12,
        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
        isActive: true,
        description: 'Expert in heart rhythm disorders and preventive cardiology.',
        availableSlots: DEFAULT_SLOTS
    },
    {
        name: 'Dr. John Doe',
        specialization: 'Pediatrician',
        experience: 8,
        imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
        isActive: true,
        description: 'Compassionate care for infants, children, and adolescents.',
        availableSlots: DEFAULT_SLOTS
    },
    {
        name: 'Dr. Emily Blunt',
        specialization: 'Neurologist',
        experience: 15,
        imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
        isActive: true,
        description: 'Specializing in headache medicine and neuromuscular disorders.',
        availableSlots: DEFAULT_SLOTS
    },
    {
        name: 'Dr. Michael Chang',
        specialization: 'Dermatologist',
        experience: 5,
        imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
        isActive: true,
        description: 'Expert in medical and cosmetic dermatology.',
        availableSlots: DEFAULT_SLOTS
    }
];

const SEED_BRANDS = [
    { name: 'Mayo Clinic' },
    { name: 'Johns Hopkins' },
    { name: 'Cleveland Clinic' },
    { name: 'UCLA Health' },
    { name: 'Mass General' },
    { name: 'Cedars-Sinai' }
];


// ============================================================
// SEED USER ACCOUNTS
// ============================================================
// Use these credentials to log in after seeding:
// 
// ADMIN:  admin@careconnect.com / Admin@123
// DOCTOR: doctor@careconnect.com / Doctor@123
// ============================================================

const ADMIN_USER = {
    name: 'Admin User',
    email: 'admin@careconnect.com',
    role: UserRole.ADMIN
};

const DOCTOR_USER = {
    name: 'Dr. Sarah Smith',
    email: 'doctor@careconnect.com',
    role: UserRole.DOCTOR
};

export const seedHospitals = async () => {
    const count = await getCollectionCount(COLLECTIONS.HOSPITALS);
    if (count > 0) {
        console.log(`ℹ️ Hospitals already exist (${count} found). Skipping...`);
        return;
    }
    console.log('Seeding hospitals...');
    for (const hospital of SEED_HOSPITALS) {
        await addDocument(COLLECTIONS.HOSPITALS, hospital);
    }
    console.log('✅ Hospitals seeded');
};

export const seedDoctors = async () => {
    const count = await getCollectionCount(COLLECTIONS.DOCTORS);
    if (count > 0) {
        console.log(`ℹ️ Doctors already exist (${count} found). Skipping...`);
        return;
    }
    console.log('Seeding doctors...');
    for (const doctor of SEED_DOCTORS) {
        await addDocument(COLLECTIONS.DOCTORS, doctor);
    }
    console.log('✅ Doctors seeded');
};

export const seedBrands = async () => {
    const count = await getCollectionCount(COLLECTIONS.BRANDS);
    if (count > 0) {
        console.log(`ℹ️ Brands already exist (${count} found). Skipping...`);
        return;
    }
    console.log('Seeding brands...');
    for (const brand of SEED_BRANDS) {
        await addDocument(COLLECTIONS.BRANDS, brand);
    }
    console.log('✅ Brands seeded');
};

/**
 * Clear all seed data (hospitals, doctors, brands)
 * Use this to remove duplicates before re-seeding
 */
export const clearAllData = async () => {
    try {
        console.log('🗑️ Clearing all seed data...');

        console.log('Clearing hospitals...');
        await clearCollection(COLLECTIONS.HOSPITALS);

        console.log('Clearing doctors...');
        await clearCollection(COLLECTIONS.DOCTORS);

        console.log('Clearing brands...');
        await clearCollection(COLLECTIONS.BRANDS);

        console.log('✅ All seed data cleared! You can now run seedAllData() again.');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
    }
};

export const seedAllData = async () => {
    try {
        console.log('🌱 Starting data seed...');
        await seedHospitals();
        await seedDoctors();
        await seedBrands();
        console.log('🎉 Seed complete!');
        console.log('');
        console.log('📌 Next steps:');
        console.log('1. Run createAdminUser() to create admin account');
        console.log('2. Run createDoctorUser() to create doctor account');
        console.log('');
        console.log('💡 If you have duplicates, run clearAllData() first, then seedAllData()');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
};

/**
 * Create Admin user with authentication
 * Email: admin@careconnect.com
 * Password: Admin@123
 */
export const createAdminUser = async () => {
    try {
        console.log('Creating admin user...');
        const userCredential = await signupWithEmail('admin@careconnect.com', 'Admin@123');
        const uid = userCredential.user.uid;

        await setDocument(COLLECTIONS.USERS, uid, {
            id: uid,
            name: ADMIN_USER.name,
            email: ADMIN_USER.email,
            role: UserRole.ADMIN
        });

        console.log('✅ Admin user created successfully!');
        console.log('   Email: admin@careconnect.com');
        console.log('   Password: Admin@123');
        return uid;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️ Admin user already exists. Use these credentials to login:');
            console.log('   Email: admin@careconnect.com');
            console.log('   Password: Admin@123');
        } else {
            console.error('❌ Error creating admin user:', error);
        }
    }
};

/**
 * Create Doctor user with authentication
 * Email: doctor@careconnect.com
 * Password: Doctor@123
 */
export const createDoctorUser = async () => {
    try {
        console.log('Creating doctor user...');
        const userCredential = await signupWithEmail('doctor@careconnect.com', 'Doctor@123');
        const uid = userCredential.user.uid;

        // First, create a doctor profile
        console.log('Creating doctor profile...');
        const doctorId = await addDocument(COLLECTIONS.DOCTORS, {
            name: DOCTOR_USER.name,
            specialization: 'Cardiologist',
            experience: 12,
            description: 'Expert in heart rhythm disorders and preventive cardiology.',
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
            availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
        });

        // Then create user with link to doctor profile
        await setDocument(COLLECTIONS.USERS, uid, {
            id: uid,
            name: DOCTOR_USER.name,
            email: DOCTOR_USER.email,
            role: UserRole.DOCTOR,
            doctorId: doctorId // Link to doctor profile!
        });

        console.log('✅ Doctor user created successfully!');
        console.log('   Email: doctor@careconnect.com');
        console.log('   Password: Doctor@123');
        console.log('   Linked to Doctor Profile:', doctorId);
        return uid;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️ Doctor user already exists. Use these credentials to login:');
            console.log('   Email: doctor@careconnect.com');
            console.log('   Password: Doctor@123');
        } else {
            console.error('❌ Error creating doctor user:', error);
        }
    }
};

/**
 * Set a user as admin by their UID
 */
export const updateAdminUser = async (uid: string) => {
    await setDocument(COLLECTIONS.USERS, uid, {
        id: uid,
        name: ADMIN_USER.name,
        email: ADMIN_USER.email,
        role: UserRole.ADMIN
    });
    console.log('✅ User updated to ADMIN role. Please refresh the page.');
};

// Make functions available globally for browser console access
if (typeof window !== 'undefined') {
    (window as any).seedAllData = seedAllData;
    (window as any).seedHospitals = seedHospitals;
    (window as any).seedDoctors = seedDoctors;
    (window as any).seedBrands = seedBrands;
    (window as any).clearAllData = clearAllData;
    (window as any).createAdminUser = createAdminUser;
    (window as any).createDoctorUser = createDoctorUser;
    (window as any).updateAdminUser = updateAdminUser;
}

