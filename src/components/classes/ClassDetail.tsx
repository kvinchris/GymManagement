import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Repeat,
  Edit,
  Trash2,
} from "lucide-react";
import { TrainerClass, Trainer } from "@/types/trainer";

interface ClassDetailProps {
  classData: TrainerClass;
  trainer: Trainer;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const ClassDetail = ({
  classData,
  trainer,
  onEdit,
  onDelete,
  onClose,
}: ClassDetailProps) => {
  // Format date for display
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Capitalize first letter of each word
  const capitalize = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{classData.className}</h2>
          <p className="text-gray-500">{classData.description}</p>
        </div>
        <Badge
          className={
            classData.enrolled >= classData.capacity
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }
        >
          {classData.enrolled}/{classData.capacity} Enrolled
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Class Details</h3>

          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <span>{formatDate(classData.date)}</span>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <span>
                {formatTime(classData.startTime)} -{" "}
                {formatTime(classData.endTime)}
              </span>
            </div>

            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <span>{classData.location}</span>
            </div>

            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-500" />
              <span>
                {classData.enrolled} enrolled out of {classData.capacity}{" "}
                capacity
              </span>
            </div>

            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
              <span>${classData.price.toFixed(2)} per session</span>
            </div>

            {classData.isRecurring && classData.recurringDays && (
              <div className="flex items-start">
                <Repeat className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <div>Recurring weekly on:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {classData.recurringDays.map((day) => (
                      <Badge key={day} variant="outline">
                        {capitalize(day)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Trainer Information</h3>

          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={trainer.avatar} alt={trainer.name} />
              <AvatarFallback>
                {trainer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{trainer.name}</div>
              <div className="text-sm text-gray-500">
                {trainer.specialization}
              </div>
            </div>
          </div>

          <div className="text-sm">
            <p>{trainer.bio}</p>
          </div>

          <div className="text-sm">
            <div className="font-medium mb-1">Contact:</div>
            <div>{trainer.email}</div>
            <div>{trainer.phone}</div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="default" onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" onClick={onDelete} className="gap-2">
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );
};

export default ClassDetail;
