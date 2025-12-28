import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    setDoc,
    getDoc,
    getDocs,
    Timestamp,
    DocumentData
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth helpers
export const loginWithEmail = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
    return signOut(auth);
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Firestore helpers
export const subscribeToCollection = <T extends DocumentData>(
    collectionName: string,
    callback: (data: (T & { id: string })[]) => void,
    onError?: (error: Error) => void
) => {
    const q = query(collection(db, collectionName));
    return onSnapshot(
        q,
        (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as (T & { id: string })[];
            callback(data);
        },
        (error) => {
            console.warn(`Firestore subscription error for ${collectionName}:`, error.message);
            if (onError) {
                onError(error);
            }
            // Return empty array on error instead of crashing
            callback([]);
        }
    );
};

export const addDocument = async <T extends DocumentData>(
    collectionName: string,
    data: Omit<T, 'id'>
) => {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now()
    });
    return docRef.id;
};

export const setDocument = async <T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: T
) => {
    await setDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: Timestamp.now()
    });
};

export const getDocument = async <T extends DocumentData>(
    collectionName: string,
    docId: string
): Promise<(T & { id: string }) | null> => {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
    }
    return null;
};

export const updateDocument = async (
    collectionName: string,
    docId: string,
    data: Partial<DocumentData>
) => {
    await updateDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: Timestamp.now()
    });
};

export const deleteDocument = async (collectionName: string, docId: string) => {
    await deleteDoc(doc(db, collectionName, docId));
};

// Collection names as constants
export const COLLECTIONS = {
    USERS: 'users',
    DOCTORS: 'doctors',
    HOSPITALS: 'hospitals',
    APPOINTMENTS: 'appointments',
    BRANDS: 'brands'
} as const;

// Get count of documents in a collection
export const getCollectionCount = async (collectionName: string): Promise<number> => {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.size;
};

// Clear all documents in a collection
export const clearCollection = async (collectionName: string): Promise<void> => {
    const snapshot = await getDocs(collection(db, collectionName));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
};

