import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react";
import { TrainerClass, Trainer } from "@/types/trainer";

interface ClassListProps {
  classes: TrainerClass[];
  trainers: Trainer[];
  onAddClass: () => void;
  onEditClass: (cls: TrainerClass) => void;
  onDeleteClass: (classId: string) => void;
  onViewClass: (cls: TrainerClass) => void;
}

const ClassList = ({
  classes,
  trainers,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onViewClass,
}: ClassListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter classes based on search query
  const filteredClasses = classes.filter(
    (cls) =>
      cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTrainerName(cls.trainerId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Get trainer name by ID
  const getTrainerName = (trainerId: string): string => {
    const trainer = trainers.find((t) => t.id === trainerId);
    return trainer ? trainer.name : "Unknown Trainer";
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search classes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddClass} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" /> Add Class
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls) => (
                <TableRow key={cls.id} className="hover:bg-gray-50">
                  <TableCell
                    className="font-medium cursor-pointer"
                    onClick={() => onViewClass(cls)}
                  >
                    {cls.className}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            trainers.find((t) => t.id === cls.trainerId)?.avatar
                          }
                          alt={getTrainerName(cls.trainerId)}
                        />
                        <AvatarFallback>
                          {getTrainerName(cls.trainerId)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{getTrainerName(cls.trainerId)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {formatDate(cls.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {cls.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
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
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                      {cls.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewClass(cls)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditClass(cls)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDeleteClass(cls.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  {searchQuery
                    ? "No classes found matching your search."
                    : "No classes added yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClassList;
