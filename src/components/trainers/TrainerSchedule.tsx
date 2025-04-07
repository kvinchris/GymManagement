import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Users,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { Trainer, TrainerClass } from "@/types/trainer";

interface TrainerScheduleProps {
  trainer: Trainer;
  classes: TrainerClass[];
  onBack: () => void;
  onAddClass: (trainerId: string) => void;
  onEditClass?: (classId: string) => void;
}

const TrainerSchedule = ({
  trainer,
  classes,
  onBack,
  onAddClass,
  onEditClass,
}: TrainerScheduleProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");

  // Group classes by date for calendar view
  const classesByDate: Record<string, TrainerClass[]> = {};
  classes.forEach((cls) => {
    const dateStr = new Date(cls.date).toISOString().split("T")[0];
    if (!classesByDate[dateStr]) {
      classesByDate[dateStr] = [];
    }
    classesByDate[dateStr].push(cls);
  });

  // Get classes for selected date
  const getClassesForDate = (date: Date | undefined) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return classesByDate[dateStr] || [];
  };

  // Sort classes by start time
  const sortedClasses = [...classes].sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Render calendar day contents
  const renderCalendarDay = (day: Date) => {
    const dateStr = day.toISOString().split("T")[0];
    const dayClasses = classesByDate[dateStr] || [];
    if (dayClasses.length === 0) return null;

    return (
      <div className="absolute bottom-0 right-0 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={() => onAddClass(trainer.id)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Schedule for {trainer.name}</CardTitle>
              <CardDescription>
                Manage trainer's classes and schedule
              </CardDescription>
            </div>
            <Tabs
              defaultValue={view}
              value={view}
              onValueChange={(v) => setView(v as "calendar" | "list")}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {view === "calendar" ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    components={{
                      DayContent: ({ day }) => (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {day.getDate()}
                          {renderCalendarDay(day)}
                        </div>
                      ),
                    }}
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="font-medium mb-4">
                    Classes on{" "}
                    {date?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="space-y-3">
                    {getClassesForDate(date).length > 0 ? (
                      getClassesForDate(date).map((cls) => (
                        <div
                          key={cls.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => onEditClass && onEditClass(cls.id)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{cls.className}</h4>
                            <Badge
                              className={
                                cls.enrolled >= cls.capacity
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {cls.enrolled}/{cls.capacity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {cls.description}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-3">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              {formatTime(cls.startTime)} -{" "}
                              {formatTime(cls.endTime)}
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {cls.location}
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-1 text-gray-500" />
                              {cls.enrolled} enrolled
                            </div>
                            {cls.price !== undefined && (
                              <div className="flex items-center text-sm">
                                <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                                {typeof cls.price === "number"
                                  ? cls.price.toFixed(2)
                                  : cls.price}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 border rounded-lg">
                        No classes scheduled for this date
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">All Scheduled Classes</h3>
                </div>
                <div className="space-y-3">
                  {sortedClasses.length > 0 ? (
                    sortedClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => onEditClass && onEditClass(cls.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{cls.className}</h4>
                          <Badge
                            className={
                              cls.enrolled >= cls.capacity
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {cls.enrolled}/{cls.capacity}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium text-blue-600 mt-1">
                          {new Date(cls.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {cls.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            {formatTime(cls.startTime)} -{" "}
                            {formatTime(cls.endTime)}
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            {cls.location}
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            {cls.enrolled} enrolled
                          </div>
                          {cls.price !== undefined && (
                            <div className="flex items-center text-sm">
                              <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                              {typeof cls.price === "number"
                                ? cls.price.toFixed(2)
                                : cls.price}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 border rounded-lg">
                      No classes scheduled
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerSchedule;
