import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TrainerList from "./TrainerList";
import TrainerForm from "./TrainerForm";
import TrainerDetail from "./TrainerDetail";
import TrainerSchedule from "./TrainerSchedule";
import ClassForm from "./ClassForm";
import { Trainer, TrainerClass } from "@/types/trainer";

// Mock data for trainers
const mockTrainers: Trainer[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    specialization: "Strength Training",
    bio: "Certified personal trainer with 8 years of experience specializing in strength training and muscle building. Passionate about helping clients achieve their fitness goals through personalized workout plans.",
    hourlyRate: 60,
    availability: [
      { day: "monday", startTime: "09:00", endTime: "17:00" },
      { day: "wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "friday", startTime: "09:00", endTime: "17:00" },
    ],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    isActive: true,
    joinDate: new Date(2022, 3, 15),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1987654321",
    specialization: "Yoga",
    bio: "Yoga instructor with 5 years of experience teaching various styles including Hatha, Vinyasa, and Restorative yoga. Focused on helping clients improve flexibility, balance, and mental wellbeing.",
    hourlyRate: 55,
    availability: [
      { day: "tuesday", startTime: "08:00", endTime: "14:00" },
      { day: "thursday", startTime: "08:00", endTime: "14:00" },
      { day: "saturday", startTime: "10:00", endTime: "15:00" },
    ],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    isActive: true,
    joinDate: new Date(2022, 6, 10),
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "+1122334455",
    specialization: "HIIT",
    bio: "Fitness coach specializing in High-Intensity Interval Training (HIIT) and functional fitness. Helps clients maximize their workout efficiency and achieve rapid results through targeted training programs.",
    hourlyRate: 65,
    availability: [
      { day: "monday", startTime: "15:00", endTime: "20:00" },
      { day: "wednesday", startTime: "15:00", endTime: "20:00" },
      { day: "friday", startTime: "15:00", endTime: "20:00" },
    ],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    isActive: true,
    joinDate: new Date(2023, 1, 5),
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    email: "emma.r@example.com",
    phone: "+1567890123",
    specialization: "Pilates",
    bio: "Certified Pilates instructor with expertise in mat and reformer Pilates. Specializes in core strengthening, posture improvement, and rehabilitation exercises for clients of all fitness levels.",
    hourlyRate: 50,
    availability: [
      { day: "tuesday", startTime: "14:00", endTime: "20:00" },
      { day: "thursday", startTime: "14:00", endTime: "20:00" },
      { day: "saturday", startTime: "09:00", endTime: "13:00" },
    ],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    isActive: false,
    joinDate: new Date(2022, 9, 20),
  },
];

// Mock data for trainer classes
const mockClasses: TrainerClass[] = [
  {
    id: "c1",
    trainerId: "1",
    className: "Power Lifting Basics",
    description: "Introduction to proper lifting techniques and form",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: "10:00",
    endTime: "11:00",
    capacity: 8,
    enrolled: 6,
    location: "Weight Room",
    isRecurring: true,
    recurringDays: ["monday", "wednesday", "friday"],
  },
  {
    id: "c2",
    trainerId: "1",
    className: "Advanced Strength Training",
    description: "Intensive strength training for experienced lifters",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    startTime: "14:00",
    endTime: "15:30",
    capacity: 6,
    enrolled: 4,
    location: "Weight Room",
    isRecurring: false,
  },
  {
    id: "c3",
    trainerId: "2",
    className: "Morning Yoga Flow",
    description: "Energizing morning yoga to start your day right",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: "08:30",
    endTime: "09:30",
    capacity: 15,
    enrolled: 12,
    location: "Yoga Studio",
    isRecurring: true,
    recurringDays: ["tuesday", "thursday"],
  },
  {
    id: "c4",
    trainerId: "2",
    className: "Restorative Yoga",
    description: "Gentle yoga focusing on relaxation and recovery",
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    startTime: "11:00",
    endTime: "12:00",
    capacity: 12,
    enrolled: 8,
    location: "Yoga Studio",
    isRecurring: true,
    recurringDays: ["saturday"],
  },
  {
    id: "c5",
    trainerId: "3",
    className: "HIIT Circuit",
    description: "High-intensity interval training for maximum calorie burn",
    date: new Date(new Date().setDate(new Date().getDate())),
    startTime: "17:30",
