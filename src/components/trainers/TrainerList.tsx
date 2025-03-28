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
  DollarSign,
} from "lucide-react";
import { Trainer } from "@/types/trainer";

interface TrainerListProps {
  trainers: Trainer[];
  onAddTrainer: () => void;
  onEditTrainer: (trainer: Trainer) => void;
  onDeleteTrainer: (trainerId: string) => void;
  onViewTrainer: (trainer: Trainer) => void;
  onViewSchedule: (trainerId: string) => void;
}

const TrainerList = ({
  trainers,
  onAddTrainer,
  onEditTrainer,
  onDeleteTrainer,
  onViewTrainer,
  onViewSchedule,
}: TrainerListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter trainers based on search query
  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search trainers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddTrainer} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" /> Add Trainer
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainer</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => (
                <TableRow key={trainer.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={() => onViewTrainer(trainer)}
                    >
                      <Avatar>
                        <AvatarImage src={trainer.avatar} alt={trainer.name} />
                        <AvatarFallback>
                          {trainer.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{trainer.name}</div>
                        <div className="text-sm text-gray-500">
                          {trainer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{trainer.specialization}</TableCell>
                  <TableCell>{trainer.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                      {trainer.hourlyRate.toFixed(2)}/hr
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        trainer.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {trainer.isActive ? "Active" : "Inactive"}
                    </Badge>
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
                        <DropdownMenuItem
                          onClick={() => onViewTrainer(trainer)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditTrainer(trainer)}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onViewSchedule(trainer.id)}
                        >
                          <Calendar className="h-4 w-4 mr-2" /> View Schedule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDeleteTrainer(trainer.id)}
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
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  {searchQuery
                    ? "No trainers found matching your search."
                    : "No trainers added yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrainerList;
