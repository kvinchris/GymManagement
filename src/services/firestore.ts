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
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Member } from "../types/member";
import { Package } from "../types/package";
import { Trainer, TrainerClass } from "../types/trainer";

// Firestore collection names
export const COLLECTIONS = {
  USERS: "users",
  MEMBERS: "members",
  PACKAGES: "packages",
  TRAINERS: "trainers",
  CLASSES: "classes",
  ATTENDANCE: "attendance",
  PAYMENTS: "payments",
};

// Data structure interfaces
export interface FirestoreMember
  extends Omit<Member, "startDate" | "expiryDate"> {
  startDate: Timestamp;
  expiryDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestorePackage extends Package {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreTrainer extends Omit<Trainer, "joinDate"> {
  joinDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreClass extends Omit<TrainerClass, "date"> {
  date: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Attendance {
  id: string;
  memberId: string;
  classId?: string;
  date: Timestamp;
  checkInTime: Timestamp;
  checkOutTime?: Timestamp;
  notes?: string;
}

export interface Payment {
  id: string;
  memberId: string;
  packageId: string;
  amount: number;
  paymentDate: Timestamp;
  paymentMethod: string;
  transactionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Helper functions to convert between Firestore and app data models
export const convertFirestoreMemberToMember = (
  data: FirestoreMember,
): Member => {
  return {
    ...data,
    startDate: data.startDate.toDate(),
    expiryDate: data.expiryDate.toDate(),
  };
};

export const convertMemberToFirestoreMember = (
  member: Member,
): Omit<FirestoreMember, "createdAt" | "updatedAt"> => {
  return {
    ...member,
    startDate: Timestamp.fromDate(member.startDate),
    expiryDate: Timestamp.fromDate(member.expiryDate),
  };
};

export const convertFirestoreTrainerToTrainer = (
  data: FirestoreTrainer,
): Trainer => {
  return {
    ...data,
    joinDate: data.joinDate.toDate(),
  };
};

export const convertTrainerToFirestoreTrainer = (
  trainer: Trainer,
): Omit<FirestoreTrainer, "createdAt" | "updatedAt"> => {
  return {
    ...trainer,
    joinDate: Timestamp.fromDate(trainer.joinDate),
  };
};

export const convertFirestoreClassToClass = (
  data: FirestoreClass,
): TrainerClass => {
  return {
    ...data,
    date: data.date.toDate(),
  };
};

export const convertClassToFirestoreClass = (
  trainerClass: TrainerClass,
): Omit<FirestoreClass, "createdAt" | "updatedAt"> => {
  return {
    ...trainerClass,
    date: Timestamp.fromDate(new Date(trainerClass.date)),
  };
};

// CRUD operations for Members
export const getMembers = async (): Promise<Member[]> => {
  try {
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const snapshot = await getDocs(membersRef);

    const members: Member[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreMember;
      members.push({
        ...convertFirestoreMemberToMember(data),
        id: doc.id,
      });
    });

    return members;
  } catch (error) {
    console.error("Error getting members:", error);
    throw error;
  }
};

export const getMemberById = async (id: string): Promise<Member | null> => {
  try {
    const memberRef = doc(db, COLLECTIONS.MEMBERS, id);
    const memberDoc = await getDoc(memberRef);

    if (memberDoc.exists()) {
      const data = memberDoc.data() as FirestoreMember;
      return {
        ...convertFirestoreMemberToMember(data),
        id: memberDoc.id,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting member:", error);
    throw error;
  }
};

export const createMember = async (
  member: Omit<Member, "id">,
): Promise<string> => {
  try {
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const firestoreMember = convertMemberToFirestoreMember(member as Member);

    const docRef = await addDoc(membersRef, {
      ...firestoreMember,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
};

export const updateMember = async (
  id: string,
  member: Partial<Member>,
): Promise<void> => {
  try {
    const memberRef = doc(db, COLLECTIONS.MEMBERS, id);

    const updateData: any = { ...member, updatedAt: serverTimestamp() };

    // Convert Date objects to Firestore Timestamps
    if (updateData.startDate) {
      updateData.startDate = Timestamp.fromDate(updateData.startDate);
    }

    if (updateData.expiryDate) {
      updateData.expiryDate = Timestamp.fromDate(updateData.expiryDate);
    }

    await updateDoc(memberRef, updateData);
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
};

export const deleteMember = async (id: string): Promise<void> => {
  try {
    const memberRef = doc(db, COLLECTIONS.MEMBERS, id);
    await deleteDoc(memberRef);
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};

// CRUD operations for Packages
export const getPackages = async (): Promise<Package[]> => {
  try {
    const packagesRef = collection(db, COLLECTIONS.PACKAGES);
    const snapshot = await getDocs(packagesRef);

    const packages: Package[] = [];
    snapshot.forEach((doc) => {
      packages.push({
        ...(doc.data() as Package),
        id: doc.id,
      });
    });

    return packages;
  } catch (error) {
    console.error("Error getting packages:", error);
    throw error;
  }
};

export const getPackageById = async (id: string): Promise<Package | null> => {
  try {
    const packageRef = doc(db, COLLECTIONS.PACKAGES, id);
    const packageDoc = await getDoc(packageRef);

    if (packageDoc.exists()) {
      return {
        ...(packageDoc.data() as Package),
        id: packageDoc.id,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting package:", error);
    throw error;
  }
};

export const createPackage = async (
  packageData: Omit<Package, "id">,
): Promise<string> => {
  try {
    const packagesRef = collection(db, COLLECTIONS.PACKAGES);
    const docRef = await addDoc(packagesRef, {
      ...packageData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};

export const updatePackage = async (
  id: string,
  packageData: Partial<Package>,
): Promise<void> => {
  try {
    const packageRef = doc(db, COLLECTIONS.PACKAGES, id);
    await updateDoc(packageRef, {
      ...packageData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating package:", error);
    throw error;
  }
};

export const deletePackage = async (id: string): Promise<void> => {
  try {
    const packageRef = doc(db, COLLECTIONS.PACKAGES, id);
    await deleteDoc(packageRef);
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
};

// CRUD operations for Trainers
export const getTrainers = async (): Promise<Trainer[]> => {
  try {
    const trainersRef = collection(db, COLLECTIONS.TRAINERS);
    const snapshot = await getDocs(trainersRef);

    const trainers: Trainer[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreTrainer;
      trainers.push({
        ...convertFirestoreTrainerToTrainer(data),
        id: doc.id,
      });
    });

    return trainers;
  } catch (error) {
    console.error("Error getting trainers:", error);
    throw error;
  }
};

export const getTrainerById = async (id: string): Promise<Trainer | null> => {
  try {
    const trainerRef = doc(db, COLLECTIONS.TRAINERS, id);
    const trainerDoc = await getDoc(trainerRef);

    if (trainerDoc.exists()) {
      const data = trainerDoc.data() as FirestoreTrainer;
      return {
        ...convertFirestoreTrainerToTrainer(data),
        id: trainerDoc.id,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting trainer:", error);
    throw error;
  }
};

export const getTrainerByUserId = async (
  userId: string,
): Promise<Trainer | null> => {
  try {
    const trainersRef = collection(db, COLLECTIONS.TRAINERS);
    const q = query(trainersRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data() as FirestoreTrainer;
      return {
        ...convertFirestoreTrainerToTrainer(data),
        id: doc.id,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting trainer by user ID:", error);
    throw error;
  }
};

export const createTrainer = async (
  trainer: Omit<Trainer, "id">,
): Promise<string> => {
  try {
    const trainersRef = collection(db, COLLECTIONS.TRAINERS);
    const firestoreTrainer = convertTrainerToFirestoreTrainer(
      trainer as Trainer,
    );

    const docRef = await addDoc(trainersRef, {
      ...firestoreTrainer,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating trainer:", error);
    throw error;
  }
};

export const updateTrainer = async (
  id: string,
  trainer: Partial<Trainer>,
): Promise<void> => {
  try {
    const trainerRef = doc(db, COLLECTIONS.TRAINERS, id);

    const updateData: any = { ...trainer, updatedAt: serverTimestamp() };

    // Convert Date objects to Firestore Timestamps
    if (updateData.joinDate) {
      updateData.joinDate = Timestamp.fromDate(updateData.joinDate);
    }

    await updateDoc(trainerRef, updateData);
  } catch (error) {
    console.error("Error updating trainer:", error);
    throw error;
  }
};

export const deleteTrainer = async (id: string): Promise<void> => {
  try {
    const trainerRef = doc(db, COLLECTIONS.TRAINERS, id);
    await deleteDoc(trainerRef);
  } catch (error) {
    console.error("Error deleting trainer:", error);
    throw error;
  }
};

// CRUD operations for Classes
export const getClasses = async (): Promise<TrainerClass[]> => {
  try {
    const classesRef = collection(db, COLLECTIONS.CLASSES);
    const snapshot = await getDocs(classesRef);

    const classes: TrainerClass[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreClass;
      classes.push({
        ...convertFirestoreClassToClass(data),
        id: doc.id,
      });
    });

    return classes;
  } catch (error) {
    console.error("Error getting classes:", error);
    throw error;
  }
};

export const getClassById = async (
  id: string,
): Promise<TrainerClass | null> => {
  try {
    const classRef = doc(db, COLLECTIONS.CLASSES, id);
    const classDoc = await getDoc(classRef);

    if (classDoc.exists()) {
      const data = classDoc.data() as FirestoreClass;
      return {
        ...convertFirestoreClassToClass(data),
        id: classDoc.id,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting class:", error);
    throw error;
  }
};

export const getClassesByTrainer = async (
  trainerId: string,
): Promise<TrainerClass[]> => {
  try {
    const classesRef = collection(db, COLLECTIONS.CLASSES);
    const q = query(classesRef, where("trainerId", "==", trainerId));
    const snapshot = await getDocs(q);

    const classes: TrainerClass[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreClass;
      classes.push({
        ...convertFirestoreClassToClass(data),
        id: doc.id,
      });
    });

    return classes;
  } catch (error) {
    console.error("Error getting classes by trainer:", error);
    throw error;
  }
};

export const getUpcomingClasses = async (
  limit?: number,
): Promise<TrainerClass[]> => {
  try {
    const classesRef = collection(db, COLLECTIONS.CLASSES);
    const today = new Date();

    let q = query(
      classesRef,
      where("date", ">=", Timestamp.fromDate(today)),
      orderBy("date"),
    );

    if (limit) {
      q = query(q, limit(limit));
    }

    const snapshot = await getDocs(q);

    const classes: TrainerClass[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreClass;
      classes.push({
        ...convertFirestoreClassToClass(data),
        id: doc.id,
      });
    });

    return classes;
  } catch (error) {
    console.error("Error getting upcoming classes:", error);
    throw error;
  }
};

export const createClass = async (
  classData: Omit<TrainerClass, "id">,
): Promise<string> => {
  try {
    const classesRef = collection(db, COLLECTIONS.CLASSES);
    const firestoreClass = convertClassToFirestoreClass(
      classData as TrainerClass,
    );

    const docRef = await addDoc(classesRef, {
      ...firestoreClass,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating class:", error);
    throw error;
  }
};

export const updateClass = async (
  id: string,
  classData: Partial<TrainerClass>,
): Promise<void> => {
  try {
    const classRef = doc(db, COLLECTIONS.CLASSES, id);

    const updateData: any = { ...classData, updatedAt: serverTimestamp() };

    // Convert Date objects to Firestore Timestamps
    if (updateData.date) {
      updateData.date = Timestamp.fromDate(new Date(updateData.date));
    }

    await updateDoc(classRef, updateData);
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

export const deleteClass = async (id: string): Promise<void> => {
  try {
    const classRef = doc(db, COLLECTIONS.CLASSES, id);
    await deleteDoc(classRef);
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

// Attendance operations
export const recordAttendance = async (
  attendance: Omit<Attendance, "id" | "checkInTime">,
): Promise<string> => {
  try {
    const attendanceRef = collection(db, COLLECTIONS.ATTENDANCE);

    // If we have a memberId but no memberName, try to fetch the member's name
    if (attendance.memberId && !attendance.memberName) {
      try {
        const memberDoc = await getDoc(
          doc(db, COLLECTIONS.MEMBERS, attendance.memberId),
        );
        if (memberDoc.exists()) {
          const memberData = memberDoc.data() as FirestoreMember;
          attendance.memberName = memberData.name;
          attendance.memberIdNumber = memberData.memberId;
        }
      } catch (memberError) {
        console.error("Error fetching member details:", memberError);
        // Continue with attendance recording even if member details fetch fails
      }
    }

    const docRef = await addDoc(attendanceRef, {
      ...attendance,
      checkInTime: serverTimestamp(),
      date: attendance.date || Timestamp.fromDate(new Date()),
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw error;
  }
};

export const updateAttendanceCheckout = async (id: string): Promise<void> => {
  try {
    const attendanceRef = doc(db, COLLECTIONS.ATTENDANCE, id);
    await updateDoc(attendanceRef, {
      checkOutTime: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating attendance checkout:", error);
    throw error;
  }
};

export const getMemberAttendance = async (
  memberId: string,
): Promise<Attendance[]> => {
  try {
    const attendanceRef = collection(db, COLLECTIONS.ATTENDANCE);
    const q = query(
      attendanceRef,
      where("memberId", "==", memberId),
      orderBy("date", "desc"),
    );

    const snapshot = await getDocs(q);

    const attendanceRecords: Attendance[] = [];
    snapshot.forEach((doc) => {
      attendanceRecords.push({
        ...(doc.data() as Attendance),
        id: doc.id,
      });
    });

    return attendanceRecords;
  } catch (error) {
    console.error("Error getting member attendance:", error);
    throw error;
  }
};

export const getDailyAttendance = async (
  date: Date = new Date(),
): Promise<Attendance[]> => {
  try {
    const attendanceRef = collection(db, COLLECTIONS.ATTENDANCE);

    // Create start and end timestamps for the given date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      attendanceRef,
      where("date", ">=", Timestamp.fromDate(startOfDay)),
      where("date", "<=", Timestamp.fromDate(endOfDay)),
      orderBy("date", "desc"),
    );

    const snapshot = await getDocs(q);

    const attendanceRecords: Attendance[] = [];
    snapshot.forEach((doc) => {
      attendanceRecords.push({
        ...(doc.data() as Attendance),
        id: doc.id,
      });
    });

    return attendanceRecords;
  } catch (error) {
    console.error("Error getting daily attendance:", error);
    throw error;
  }
};

export const getMemberByIdNumber = async (
  memberIdNumber: string,
): Promise<Member | null> => {
  try {
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const q = query(membersRef, where("memberId", "==", memberIdNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as FirestoreMember;

    return {
      ...convertFirestoreMemberToMember(data),
      id: doc.id,
    };
  } catch (error) {
    console.error("Error getting member by ID number:", error);
    throw error;
  }
};

// Payment operations
export const recordPayment = async (
  payment: Omit<Payment, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS);
    const docRef = await addDoc(paymentsRef, {
      ...payment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error recording payment:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (
  id: string,
  status: Payment["status"],
  notes?: string,
): Promise<void> => {
  try {
    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, id);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    await updateDoc(paymentRef, updateData);
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

export const getMemberPayments = async (
  memberId: string,
): Promise<Payment[]> => {
  try {
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS);
    const q = query(
      paymentsRef,
      where("memberId", "==", memberId),
      orderBy("paymentDate", "desc"),
    );

    const snapshot = await getDocs(q);

    const payments: Payment[] = [];
    snapshot.forEach((doc) => {
      payments.push({
        ...(doc.data() as Payment),
        id: doc.id,
      });
    });

    return payments;
  } catch (error) {
    console.error("Error getting member payments:", error);
    throw error;
  }
};

// Dashboard data operations
export const getDashboardData = async () => {
  try {
    // Get total members count
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const membersSnapshot = await getDocs(membersRef);
    const totalMembers = membersSnapshot.size;

    // Get active members count (not expired)
    const today = new Date();
    const activeMembersQuery = query(
      membersRef,
      where("expiryDate", ">", Timestamp.fromDate(today)),
    );
    const activeMembersSnapshot = await getDocs(activeMembersQuery);
    const activeMembers = activeMembersSnapshot.size;

    // Get upcoming classes count
    const classesRef = collection(db, COLLECTIONS.CLASSES);
    const upcomingClassesQuery = query(
      classesRef,
      where("date", ">=", Timestamp.fromDate(today)),
      orderBy("date"),
    );
    const upcomingClassesSnapshot = await getDocs(upcomingClassesQuery);
    const upcomingClasses = upcomingClassesSnapshot.size;

    // Get available trainers count
    const trainersRef = collection(db, COLLECTIONS.TRAINERS);
    const availableTrainersQuery = query(
      trainersRef,
      where("isActive", "==", true),
    );
    const availableTrainersSnapshot = await getDocs(availableTrainersQuery);
    const availableTrainers = availableTrainersSnapshot.size;

    return {
      totalMembers,
      activeMembers,
      upcomingClasses,
      availableTrainers,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// Get expiring memberships for the next 30 days
export const getExpiringMemberships = async (
  days: number = 30,
): Promise<Member[]> => {
  try {
    const membersRef = collection(db, COLLECTIONS.MEMBERS);
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const q = query(
      membersRef,
      where("expiryDate", ">", Timestamp.fromDate(today)),
      where("expiryDate", "<=", Timestamp.fromDate(futureDate)),
      orderBy("expiryDate"),
    );

    const snapshot = await getDocs(q);

    const members: Member[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreMember;
      members.push({
        ...convertFirestoreMemberToMember(data),
        id: doc.id,
      });
    });

    return members;
  } catch (error) {
    console.error("Error getting expiring memberships:", error);
    throw error;
  }
};
