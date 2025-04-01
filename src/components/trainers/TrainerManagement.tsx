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
    endTime: "18:30",
    capacity: 10,
    enrolled: 9,
    location: "Functional Training Area",
    isRecurring: true,
    recurringDays: ["monday", "wednesday", "friday"],
  },
];

const TrainerManagement: React.FC = () => {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
  const [classes, setClasses] = useState<TrainerClass[]>(mockClasses);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  const [isTrainerDetailOpen, setIsTrainerDetailOpen] = useState(false);
  const [isTrainerScheduleOpen, setIsTrainerScheduleOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddTrainer = (newTrainer: Trainer) => {
    setTrainers([...trainers, { ...newTrainer, id: `${trainers.length + 1}` }]);
    setIsAddTrainerOpen(false);
    toast({
      title: "Trainer Added",
      description: `${newTrainer.name} has been added to the system.`,
    });
  };

  const handleUpdateTrainer = (updatedTrainer: Trainer) => {
    setTrainers(
      trainers.map((trainer) =>
        trainer.id === updatedTrainer.id ? updatedTrainer : trainer,
      ),
    );
    setSelectedTrainer(updatedTrainer);
    toast({
      title: "Trainer Updated",
      description: `${updatedTrainer.name}'s information has been updated.`,
    });
  };

  const handleDeleteTrainer = () => {
    if (selectedTrainer) {
      setTrainers(
        trainers.filter((trainer) => trainer.id !== selectedTrainer.id),
      );
      setClasses(classes.filter((cls) => cls.trainerId !== selectedTrainer.id));
      setIsDeleteDialogOpen(false);
      setIsTrainerDetailOpen(false);
      setSelectedTrainer(null);
      toast({
        title: "Trainer Removed",
        description: `${selectedTrainer.name} has been removed from the system.`,
      });
    }
  };

  const handleSelectTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsTrainerDetailOpen(true);
  };

  const handleViewSchedule = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsTrainerScheduleOpen(true);
  };

  const handleAddClass = (newClass: TrainerClass) => {
    setClasses([...classes, { ...newClass, id: `c${classes.length + 1}` }]);
    setIsAddClassOpen(false);
    toast({
      title: "Class Added",
      description: `${newClass.className} has been added to the schedule.`,
    });
  };

  const handleUpdateClass = (updatedClass: TrainerClass) => {
    setClasses(
      classes.map((cls) => (cls.id === updatedClass.id ? updatedClass : cls)),
    );
    toast({
      title: "Class Updated",
      description: `${updatedClass.className} has been updated.`,
    });
  };

  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter((cls) => cls.id !== classId));
    toast({
      title: "Class Removed",
      description: "The class has been removed from the schedule.",
    });
  };

  const getTrainerClasses = (trainerId: string) => {
    return classes.filter((cls) => cls.trainerId === trainerId);
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-6">Trainer Management</h1>

      <TrainerList
        trainers={trainers}
        onSelectTrainer={handleSelectTrainer}
        onViewSchedule={handleViewSchedule}
        onAddTrainer={() => setIsAddTrainerOpen(true)}
      />

      {/* Add Trainer Dialog */}
      <Dialog open={isAddTrainerOpen} onOpenChange={setIsAddTrainerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Trainer</DialogTitle>
            <DialogDescription>
              Enter the details for the new trainer below.
            </DialogDescription>
          </DialogHeader>
          <TrainerForm
            onSubmit={handleAddTrainer}
            onCancel={() => setIsAddTrainerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Trainer Detail Dialog */}
      <Dialog open={isTrainerDetailOpen} onOpenChange={setIsTrainerDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Trainer Details</DialogTitle>
          </DialogHeader>
          {selectedTrainer && (
            <TrainerDetail
              trainer={selectedTrainer}
              onUpdate={handleUpdateTrainer}
              onDelete={() => setIsDeleteDialogOpen(true)}
              onClose={() => setIsTrainerDetailOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Trainer Schedule Dialog */}
      <Dialog
        open={isTrainerScheduleOpen}
        onOpenChange={setIsTrainerScheduleOpen}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTrainer
                ? `${selectedTrainer.name}'s Schedule`
                : "Trainer Schedule"}
            </DialogTitle>
          </DialogHeader>
          {selectedTrainer && (
            <TrainerSchedule
              trainer={selectedTrainer}
              classes={getTrainerClasses(selectedTrainer.id)}
              onAddClass={() => setIsAddClassOpen(true)}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onClose={() => setIsTrainerScheduleOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Class Dialog */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Enter the details for the new class below.
            </DialogDescription>
          </DialogHeader>
          {selectedTrainer && (
            <ClassForm
              trainerId={selectedTrainer.id}
              onSubmit={handleAddClass}
              onCancel={() => setIsAddClassOpen(false)}
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
              This action will permanently delete the trainer and all associated
              classes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTrainer}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TrainerManagement;
