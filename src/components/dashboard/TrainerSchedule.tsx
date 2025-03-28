import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

interface TrainerScheduleProps {
  trainers?: TrainerWithSchedule[];
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onTrainerSelect?: (trainerId: string) => void;
}

interface TrainerWithSchedule {
  id: string;
  name: string;
  avatar?: string;
  specialization: string;
  schedule: ScheduleItem[];
}

interface ScheduleItem {
  id: string;
  className: string;
  startTime: string;
  endTime: string;
  date: Date;
  capacity: number;
  enrolled: number;
}

const TrainerSchedule = ({
  trainers = defaultTrainers,
  selectedDate = new Date(),
  onDateChange = () => {},
  onTrainerSelect = () => {},
}: TrainerScheduleProps) => {
  const today = new Date();
  const weekDays = getWeekDays(today);

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Trainer Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="schedule">Weekly View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex flex-col space-y-4">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="border rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={trainer.avatar} alt={trainer.name} />
                        <AvatarFallback>
                          {trainer.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{trainer.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {trainer.specialization}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => onTrainerSelect(trainer.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {weekDays.map((day, index) => {
                      const daySchedule = trainer.schedule.filter((item) =>
                        isSameDay(item.date, day),
                      );

                      return (
                        <div key={index} className="flex flex-col">
                          <div className="text-xs font-medium mb-1">
                            {format(day, "EEE")}
                            <div className="text-xs">{format(day, "d")}</div>
                          </div>
                          <div
                            className={cn(
                              "h-14 text-xs flex flex-col justify-center items-center rounded",
                              isSameDay(day, today)
                                ? "bg-blue-100"
                                : "bg-gray-100",
                            )}
                          >
                            {daySchedule.length > 0 ? (
                              <div className="text-xs font-medium text-green-600">
                                {daySchedule.length} classes
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500">
                                No classes
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
                className="rounded-md border"
              />
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">
                Classes on {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              <div className="space-y-2">
                {getClassesForDate(trainers, selectedDate).length > 0 ? (
                  getClassesForDate(trainers, selectedDate).map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded border"
                    >
                      <div>
                        <div className="font-medium">{classItem.className}</div>
                        <div className="text-sm text-gray-500">
                          {classItem.startTime} - {classItem.endTime}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600">
                          {classItem.enrolled}
                        </span>
                        <span className="text-gray-500">
                          /{classItem.capacity}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No classes scheduled
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper functions
function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());

  const result: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(day.getDate() + i);
    result.push(day);
  }

  return result;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function format(date: Date, formatStr: string): string {
  // Simple formatter for demo purposes
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (formatStr === "EEE") return days[date.getDay()];
  if (formatStr === "d") return date.getDate().toString();
  if (formatStr === "MMMM d, yyyy") {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  return date.toLocaleDateString();
}

function getClassesForDate(
  trainers: TrainerWithSchedule[],
  date: Date,
): ScheduleItem[] {
  return trainers.flatMap((trainer) =>
    trainer.schedule.filter((item) => isSameDay(item.date, date)),
  );
}

// Default data for preview
const defaultTrainers: TrainerWithSchedule[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    specialization: "Strength Training",
    schedule: [
      {
        id: "c1",
        className: "Power Lifting",
        startTime: "09:00",
        endTime: "10:30",
        date: new Date(),
        capacity: 12,
        enrolled: 8,
      },
      {
        id: "c2",
        className: "CrossFit Basics",
        startTime: "14:00",
        endTime: "15:30",
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        capacity: 15,
        enrolled: 10,
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    specialization: "Yoga",
    schedule: [
      {
        id: "c3",
        className: "Morning Yoga",
        startTime: "07:30",
        endTime: "08:30",
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        capacity: 20,
        enrolled: 15,
      },
      {
        id: "c4",
        className: "Advanced Yoga",
        startTime: "18:00",
        endTime: "19:30",
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        capacity: 15,
        enrolled: 12,
      },
    ],
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    specialization: "HIIT",
    schedule: [
      {
        id: "c5",
        className: "HIIT Circuit",
        startTime: "12:00",
        endTime: "13:00",
        date: new Date(),
        capacity: 18,
        enrolled: 16,
      },
    ],
  },
];

export default TrainerSchedule;
