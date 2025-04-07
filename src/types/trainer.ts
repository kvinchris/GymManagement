export interface Trainer {
  id: string;
  userId?: string; // Firebase Auth UID for the trainer
  name: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
  hourlyRate: number;
  availability: {
    day: string; // 'monday', 'tuesday', etc.
    startTime: string; // '09:00'
    endTime: string; // '17:00'
  }[];
  avatar?: string;
  isActive: boolean;
  joinDate: Date;
}

export interface TrainerClass {
  id: string;
  trainerId: string;
  className: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  location: string;
  price: number;
  isRecurring: boolean;
  recurringDays?: string[]; // ['monday', 'wednesday', 'friday']
  createdBy?: string; // Firebase Auth UID of the user who created the class
  updatedAt?: Date; // Last update timestamp
}
