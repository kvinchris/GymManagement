import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Clock,
  DollarSign,
} from "lucide-react";
import { Trainer, TrainerClass } from "@/types/trainer";

interface TrainerDetailProps {
  trainer: Trainer;
  classes?: TrainerClass[];
  onBack: () => void;
  onEdit: (trainer: Trainer) => void;
  onViewSchedule: (trainerId: string) => void;
}

const TrainerDetail = ({
  trainer,
  classes = [],
  onBack,
  onEdit,
  onViewSchedule,
}: TrainerDetailProps) => {
  // Format day for display
  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Get upcoming classes
  const upcomingClasses = classes
    .filter((cls) => new Date(cls.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Trainers
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onViewSchedule(trainer.id)}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" /> View Schedule
          </Button>
          <Button onClick={() => onEdit(trainer)} className="gap-2">
            <Edit className="h-4 w-4" /> Edit Trainer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={trainer.avatar} alt={trainer.name} />
              <AvatarFallback className="text-lg">
                {trainer.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{trainer.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Badge className="mr-2">{trainer.specialization}</Badge>
                <Badge
                  className={
                    trainer.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {trainer.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <p>{trainer.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <p>{trainer.phone}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="font-medium">
                    ${trainer.hourlyRate.toFixed(2)}/hour
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Join Date</p>
                <p>
                  {trainer.joinDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Bio</p>
              <p className="text-gray-700">{trainer.bio}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500">
                Weekly Availability
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trainer.availability.length > 0 ? (
                  trainer.availability.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-md"
                    >
                      <Clock className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <span className="font-medium">
                          {formatDay(slot.day)}
                        </span>
                        :{" "}
                        <span>
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No availability set.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>
              Next {upcomingClasses.length} scheduled classes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{cls.className}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(cls.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm">
                      {cls.startTime} - {cls.endTime}
                    </div>
                    <Badge variant="outline">
                      {cls.enrolled}/{cls.capacity}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No upcoming classes scheduled
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => onViewSchedule(trainer.id)}
            >
              <Calendar className="h-4 w-4" /> View Full Schedule
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TrainerDetail;
