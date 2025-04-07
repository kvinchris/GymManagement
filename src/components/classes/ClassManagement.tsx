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
import ClassList from "./ClassList";
import ClassForm from "../trainers/ClassForm";
import ClassDetail from "./ClassDetail";
import { TrainerClass } from "@/types/trainer";
import { Trainer } from "@/types/trainer";

// Mock data for classes
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
    price: 15.99,
    isRecurring: true,
    recurringDays: ["monday", "wednesday", "friday"],
  },
  {
    id: "c2",
    trainerId: "2",
    className: "Morning Yoga Flow",
    description: "Energizing morning yoga to start your day right",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: "08:30",
    endTime: "09:30",
    capacity: 15,
    enrolled: 12,
    location: "Yoga Studio",
    price: 12.99,
    isRecurring: true,
    recurringDays: ["tuesday", "thursday"],
  },
  {
    id: "c3",
    trainerId: "3",
    className: "HIIT Circuit",
    description: "High-intensity interval training for maximum calorie burn",
    date: new Date(new Date().setDate(new Date().getDate())),
    startTime: "17:30",
    endTime: "18:30",
    capacity: 10,
    enrolled: 9,
    location: "Functional Training Area",
    price: 18.99,
    isRecurring: true,
    recurringDays: ["monday", "wednesday", "friday"],
  },
  {
    id: "c4",
    trainerId: "1",
    className: "Advanced Strength Training",
    description: "Intensive strength training for experienced lifters",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    startTime: "14:00",
    endTime: "15:30",
    capacity: 6,
    enrolled: 4,
    location: "Weight Room",
    price: 20.99,
    isRecurring: false,
  },
  {
    id: "c5",
    trainerId: "2",
    className: "Restorative Yoga",
    description: "Gentle yoga focusing on relaxation and recovery",
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    startTime: "11:00",
    endTime: "12:00",
    capacity: 12,
    enrolled: 8,
    location: "Yoga Studio",
    price: 14.99,
    isRecurring: true,
    recurringDays: ["saturday"],
  },
];

// Mock data for trainers
const mockTrainers: Trainer[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    specialization: "Strength Training",
    bio: "Certified personal trainer with 8 years of experience specializing in strength training and muscle building.",
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
    bio: "Yoga instructor with 5 years of experience teaching various styles including Hatha, Vinyasa, and Restorative yoga.",
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
    bio: "Fitness coach specializing in High-Intensity Interval Training (HIIT) and functional fitness.",
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
];

const ClassManagement = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<TrainerClass[]>(mockClasses);
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
  const [selectedClass, setSelectedClass] = useState<TrainerClass | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle adding a new class
  const handleAddClass = () => {
    setSelectedClass(null);
    setSelectedTrainer(null);
    setIsFormOpen(true);
  };

  // Handle editing a class
  const handleEditClass = (cls: TrainerClass) => {
    setSelectedClass(cls);
    const trainer = trainers.find((t) => t.id === cls.trainerId) || null;
    setSelectedTrainer(trainer);
    setIsFormOpen(true);
  };

  // Handle viewing a class's details
  const handleViewClass = (cls: TrainerClass) => {
    setSelectedClass(cls);
    const trainer = trainers.find((t) => t.id === cls.trainerId) || null;
    setSelectedTrainer(trainer);
    setIsDetailOpen(true);
  };

  // Handle deleting a class
  const handleDeleteClass = (classId: string) => {
    const classToDelete = classes.find((c) => c.id === classId) || null;
    setSelectedClass(classToDelete);
    setIsDeleteDialogOpen(true);
  };

  // Confirm class deletion
  const confirmDeleteClass = () => {
    if (selectedClass) {
      setClasses(classes.filter((cls) => cls.id !== selectedClass.id));
      setIsDeleteDialogOpen(false);
      setSelectedClass(null);
      toast({
        title: "Class deleted",
        description: "The class has been successfully deleted.",
      });
    }
  };

  // Handle form submission for new/edit class
  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (selectedClass) {
        // Update existing class
        const updatedClasses = classes.map((cls) =>
          cls.id === selectedClass.id
            ? {
                ...cls,
                className: data.className,
                description: data.description,
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                capacity: data.capacity,
                location: data.location,
                price: data.price,
                isRecurring: data.isRecurring,
                recurringDays: data.recurringDays,
                trainerId: data.trainerId || selectedClass.trainerId,
              }
            : cls,
        );
        setClasses(updatedClasses);
        toast({
          title: "Class updated",
          description: "The class has been successfully updated.",
        });
      } else {
        // Add new class
        const newClass: TrainerClass = {
          id: `c${Date.now()}`,
          className: data.className,
          description: data.description,
          date: new Date(data.date),
          startTime: data.startTime,
          endTime: data.endTime,
          capacity: data.capacity,
          enrolled: 0,
          location: data.location,
          price: data.price,
          isRecurring: data.isRecurring,
          recurringDays: data.recurringDays,
          trainerId: data.trainerId,
        };
        setClasses([...classes, newClass]);
        toast({
          title: "Class added",
          description: "The new class has been successfully added.",
        });
      }

      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 1000);
  };

  // Handle trainer selection
  const handleTrainerSelect = (trainerId: string) => {
    const trainer = trainers.find((t) => t.id === trainerId) || null;
    setSelectedTrainer(trainer);
  };

  return (
    <div className="space-y-6">
      <ClassList
        classes={classes}
        trainers={trainers}
        onAddClass={handleAddClass}
        onEditClass={handleEditClass}
        onDeleteClass={handleDeleteClass}
        onViewClass={handleViewClass}
      />

      {/* Class Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedClass ? "Edit Class" : "Add New Class"}
            </DialogTitle>
            <DialogDescription>
              {selectedClass
                ? "Update the class information below."
                : "Fill in the details to add a new class."}
            </DialogDescription>
          </DialogHeader>
          {selectedTrainer ? (
            <ClassForm
              trainerClass={selectedClass || undefined}
              trainerId={selectedTrainer.id}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="space-y-4">
              <div className="text-sm font-medium">
                Select a trainer for this class:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleTrainerSelect(trainer.id)}
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={trainer.avatar}
                          alt={trainer.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{trainer.name}</div>
                      <div className="text-sm text-gray-500">
                        {trainer.specialization}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Class Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Class Details</DialogTitle>
          </DialogHeader>
          {selectedClass && selectedTrainer && (
            <ClassDetail
              classData={selectedClass}
              trainer={selectedTrainer}
              onEdit={() => {
                setIsDetailOpen(false);
                setIsFormOpen(true);
              }}
              onDelete={() => {
                setIsDetailOpen(false);
                setIsDeleteDialogOpen(true);
              }}
              onClose={() => setIsDetailOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              class and remove it from the schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClass}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassManagement;
