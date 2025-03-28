import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Trainer, TrainerClass } from '../types/trainer';
import { Member } from '../types/member';
import { Package } from '../types/package';

// Trainer Services
export const getTrainers = async (): Promise<Trainer[]> => {
  try {
    const trainersRef = collection(db, 'trainers');
    const snapshot = await getDocs(trainersRef);
    
    const trainers: Trainer[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      trainers.push({
        ...data,
        id: doc.id,
        // Convert Firestore timestamp to Date
        joinDate: data.joinDate?.toDate() || new Date(),
      } as Trainer);
    });
    
    return trainers;
  } catch (error) {
    console.error('Error getting trainers:', error);
    throw error;
  }
};

export const getTrainerById = async (id: string): Promise<Trainer | null> => {
  try {
    const trainerRef = doc(db, 'trainers', id);
    const trainerDoc = await getDoc(trainerRef);
    
    if (trainerDoc.exists()) {
      const data = trainerDoc.data();
      return {
        ...data,
        id: trainerDoc.id,
        // Convert Firestore timestamp to Date
        joinDate: data.joinDate?.toDate() || new Date(),
      } as Trainer;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting trainer:', error);
    throw error;
  }
};

export const getTrainerByUserId = async (userId: string): Promise<Trainer | null> => {
  try {
    const trainersRef = collection(db, 'trainers');
    const q = query(trainersRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore timestamp to Date
        joinDate: data.joinDate?.toDate() || new Date(),
      } as Trainer;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting trainer by user ID:', error);
    throw error;
  }
};

export const createTrainer = async (trainer: Omit<Trainer, 'id'>): Promise<string> => {
  try {
    const trainersRef = collection(db, 'trainers');
    const docRef = await addDoc(trainersRef, {
      ...trainer,
      joinDate: Timestamp.fromDate(trainer.joinDate || new Date()),
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating trainer:', error);
    throw error;
  }
};

export const updateTrainer = async (id: string, trainer: Partial<Trainer>): Promise<void> => {
  try {
    const trainerRef = doc(db, 'trainers', id);
    
    // Convert Date to Firestore Timestamp if present
    const updateData = { ...trainer };
    if (updateData.joinDate) {
      updateData.joinDate = Timestamp.fromDate(updateData.joinDate);
    }
    
    await updateDoc(trainerRef, {
      ...updateData,