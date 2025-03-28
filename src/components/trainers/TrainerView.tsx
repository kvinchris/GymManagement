import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Trainer, TrainerClass } from "@/types/trainer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const TrainerView = () => {
  const { currentUser, logout } = useAuth();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [classes, setClasses] = useState<TrainerClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!currentUser) return;

      try {
        // Fetch trainer profile
        const trainersRef = collection(db, "trainers");
        const q = query(trainersRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const trainerData = querySnapshot.docs[0].data() as Trainer;
          trainerData.id = querySnapshot.docs[0].id;
          setTrainer(trainerData);

          // Fetch trainer classes
          const classesRef = collection(db, "classes");
          const classesQuery = query(
            classesRef,
            where("trainerId", "==", trainerData.id),
          );
          const classesSnapshot = await getDocs(classesQuery);

          const classesData: TrainerClass[] = [];
          classesSnapshot.forEach((doc) => {
            const classData = doc.data() as TrainerClass;
            classData.id = doc.id;
            // Convert Firestore timestamp to Date
            if (classData.date && typeof classData.date !== "string") {
              classData.date = classData.date.toDate();
            }
            classesData.push(classData);
          });

          setClasses(classesData);
        } else {
          // If no trainer profile found, use mock data for demo
          setTrainer({
            id: "mock-trainer",
            name: currentUser.displayName || "Trainer",
            email: currentUser.email || "",
            phone: "+1234567890",
            specialization: "Fitness Training",
            bio: "Experienced fitness trainer specializing in strength training and cardio workouts.",
            hourlyRate: 50,
            availability: [
              { day: "monday", startTime: "09:00", endTime: "17:00" },
              { day: "wednesday", startTime: "09:00", endTime: "17:00" },
              { day: "friday", startTime: "09:00", endTime: "17:00" },
            ],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
            isActive: true,
            joinDate: new Date(),
          });

          // Mock classes data
          setClasses([
            {
              id: "class1",
              trainerId: "mock-trainer",
              className: "Morning Workout",
              description: "Start your day with an energizing workout session",
              date: new Date(new Date().setDate(new Date().getDate() + 1)),
              startTime: "08:00",
              endTime: "09:00",
              capacity: 15,
              enrolled: 10,
              location: "Main Gym Area",
              isRecurring: true,
              recurringDays: ["monday", "wednesday", "friday"],
            },
            {
              id: "class2",
              trainerId: "mock-trainer",
              className: "HIIT Training",
              description:
                "High-intensity interval training for maximum results",
              date: new Date(new Date().setDate(new Date().getDate() + 2)),
              startTime: "17:00",
              endTime: "18:00",
              capacity: 12,
              enrolled: 8,
              location: "Studio 2",
              isRecurring: false,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainerData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Filter classes based on date
  const upcomingClasses = classes
    .filter((cls) => new Date(cls.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastClasses = classes
    .filter((cls) => new Date(cls.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">
                GM
              </span>
            </div>
            <h1 className="ml-3 text-xl font-semibold">Gym Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Logged in as <span className="font-medium">{trainer?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Trainer Profile */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Trainer Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={trainer?.avatar} alt={trainer?.name} />
                    <AvatarFallback>
                      {trainer?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{trainer?.name}</h2>
                  <Badge className="mt-2">{trainer?.specialization}</Badge>
                  <div className="mt-4 text-sm text-gray-500 space-y-2 w-full">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{trainer?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>${trainer?.hourlyRate}/hour</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full">
                    <h3 className="font-medium mb-2">Availability</h3>
                    <div className="text-sm">
                      {trainer?.availability.map((slot, index) => (
                        <div
                          key={index}
                          className="flex justify-between py-1 border-b last:border-0"
                        >
                          <span className="capitalize">{slot.day}</span>
                          <span>
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class Schedule */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  My Class Schedule
                </CardTitle>
                <CardDescription>
                  View and manage your upcoming and past classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="upcoming"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
                    <TabsTrigger value="past">Past Classes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4">
                    {upcomingClasses.length > 0 ? (
                      upcomingClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-lg">
                              {cls.className}
                            </h3>
                            <Badge
                              className={
                                cls.enrolled >= cls.capacity
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {cls.enrolled}/{cls.capacity} Enrolled
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {cls.description}
                          </p>
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              {formatDate(new Date(cls.date))}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              {formatTime(cls.startTime)} -{" "}
                              {formatTime(cls.endTime)}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span>{" "}
                              {cls.location}
                            </div>
                          </div>
                          {cls.isRecurring && cls.recurringDays && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Recurring:</span>{" "}
                              {cls.recurringDays
                                .map(
                                  (day) =>
                                    day.charAt(0).toUpperCase() + day.slice(1),
                                )
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 border rounded-lg">
                        No upcoming classes scheduled
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-4">
                    {pastClasses.length > 0 ? (
                      pastClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors opacity-75"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-lg">
                              {cls.className}
                            </h3>
                            <Badge variant="outline">
                              {cls.enrolled}/{cls.capacity} Attended
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {cls.description}
                          </p>
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              {formatDate(new Date(cls.date))}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              {formatTime(cls.startTime)} -{" "}
                              {formatTime(cls.endTime)}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span>{" "}
                              {cls.location}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 border rounded-lg">
                        No past classes found
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerView;
