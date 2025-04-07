import { Timestamp } from "firebase/firestore";
import { Member } from "./member";
import { Package } from "./package";
import { Trainer, TrainerClass } from "./trainer";

// Firestore data models with Timestamp instead of Date
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

export interface FirestoreClass
  extends Omit<TrainerClass, "date" | "updatedAt"> {
  date: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName?: string; // For display purposes
  memberIdNumber?: string; // The member's ID number for display
  classId?: string;
  date: Timestamp;
  checkInTime: Timestamp;
  checkOutTime?: Timestamp;
  notes?: string;
  checkInMethod: "qr" | "manual";
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

// Additional models for the gym management system
export interface GymSettings {
  id: string;
  gymName: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  logo?: string;
  currency: string;
  taxRate?: number;
  updatedAt: Timestamp;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  startDate: Timestamp;
  endDate: Timestamp;
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Equipment {
  id: string;
  name: string;
  description?: string;
  purchaseDate: Timestamp;
  lastMaintenanceDate?: Timestamp;
  nextMaintenanceDate?: Timestamp;
  status: "available" | "in-use" | "maintenance" | "out-of-order";
  location: string;
  serialNumber?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  maintenanceDate: Timestamp;
  description: string;
  cost?: number;
  performedBy: string;
  notes?: string;
  createdAt: Timestamp;
}

export interface MembershipRenewal {
  id: string;
  memberId: string;
  oldPackageId: string;
  newPackageId: string;
  renewalDate: Timestamp;
  startDate: Timestamp;
  expiryDate: Timestamp;
  amount: number;
  paymentId?: string;
  notes?: string;
  createdAt: Timestamp;
}

export interface ClassBooking {
  id: string;
  classId: string;
  memberId: string;
  bookingDate: Timestamp;
  status: "booked" | "attended" | "cancelled" | "no-show";
  cancellationReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MemberNote {
  id: string;
  memberId: string;
  note: string;
  createdBy: string;
  createdAt: Timestamp;
  isPrivate: boolean;
}

export interface TrainerAssignment {
  id: string;
  trainerId: string;
  memberId: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PrivateSession {
  id: string;
  trainerId: string;
  memberId: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
