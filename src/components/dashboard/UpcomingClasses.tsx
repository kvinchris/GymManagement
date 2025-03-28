import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassType {
  id: string;
  name: string;
  time: string;
  date: string;
  trainer: {
    name: string;
    avatar?: string;
  };
  capacity: {
    total: number;
    enrolled: number;
  };
  status: "upcoming" | "in-progress" | "full";
}

interface UpcomingClassesProps {
  classes?: ClassType[];
  title?: string;
  description?: string;
}

const UpcomingClasses = ({
  classes = [
    {
      id: "1",
      name: "Morning Yoga",
      time: "06:00 - 07:00",
      date: "Today",
      trainer: {
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      capacity: {
        total: 15,
        enrolled: 12,
      },
      status: "upcoming",
    },
    {
      id: "2",
      name: "HIIT Training",
      time: "10:00 - 11:00",
      date: "Today",
      trainer: {
        name: "Mike Peterson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      },
      capacity: {
        total: 12,
        enrolled: 12,
      },
      status: "full",
    },
    {
      id: "3",
      name: "Spin Class",
      time: "17:30 - 18:30",
      date: "Today",
      trainer: {
        name: "Emma Roberts",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      capacity: {
        total: 20,
        enrolled: 15,
      },
      status: "upcoming",
    },
    {
      id: "4",
      name: "Pilates",
      time: "09:00 - 10:00",
      date: "Tomorrow",
      trainer: {
        name: "David Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
      capacity: {
        total: 15,
        enrolled: 8,
      },
      status: "upcoming",
    },
    {
      id: "5",
      name: "Zumba",
      time: "18:00 - 19:00",
      date: "Tomorrow",
      trainer: {
        name: "Lisa Wong",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      },
      capacity: {
        total: 25,
        enrolled: 20,
      },
      status: "upcoming",
    },
  ],
  title = "Upcoming Classes",
  description = "Schedule for today and tomorrow",
}: UpcomingClassesProps) => {
  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[280px]">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={classItem.trainer.avatar}
                    alt={classItem.trainer.name}
                  />
                  <AvatarFallback>
                    {classItem.trainer.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{classItem.name}</h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-3">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {classItem.capacity.enrolled}/{classItem.capacity.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge
                className={cn(
                  "ml-auto",
                  classItem.status === "upcoming" &&
                    "bg-blue-500 hover:bg-blue-600",
                  classItem.status === "in-progress" &&
                    "bg-green-500 hover:bg-green-600",
                  classItem.status === "full" &&
                    "bg-amber-500 hover:bg-amber-600",
                )}
              >
                {classItem.status === "upcoming" && "Upcoming"}
                {classItem.status === "in-progress" && "In Progress"}
                {classItem.status === "full" && "Full"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingClasses;
