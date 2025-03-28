import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trainer } from "@/types/trainer";
import { X, Plus, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const trainerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  specialization: z.string().min(2, { message: "Specialization is required" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  hourlyRate: z.coerce
    .number()
    .positive({ message: "Hourly rate must be a positive number" }),
  isActive: z.boolean().default(true),
});

type TrainerFormValues = z.infer<typeof trainerSchema>;

interface TrainerFormProps {
  trainer?: Trainer;
  onSubmit: (
    data: TrainerFormValues & { availability: Trainer["availability"] },
  ) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const TrainerForm = ({
  trainer,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TrainerFormProps) => {
  const [availability, setAvailability] = useState<Trainer["availability"]>(
    trainer?.availability || [],
  );
  const [day, setDay] = useState("monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  // Initialize form with existing trainer data or defaults
  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerSchema),
    defaultValues: trainer
      ? {
          name: trainer.name,
          email: trainer.email,
          phone: trainer.phone,
          specialization: trainer.specialization,
          bio: trainer.bio,
          hourlyRate: trainer.hourlyRate,
          isActive: trainer.isActive,
        }
      : {
          name: "",
          email: "",
          phone: "",
          specialization: "",
          bio: "",
          hourlyRate: 50,
          isActive: true,
        },
  });

  const handleAddAvailability = () => {
    // Check if the day already exists
    const existingIndex = availability.findIndex((a) => a.day === day);

    if (existingIndex >= 0) {
      // Update existing day
      const newAvailability = [...availability];
      newAvailability[existingIndex] = { day, startTime, endTime };
      setAvailability(newAvailability);
    } else {
      // Add new day
      setAvailability([...availability, { day, startTime, endTime }]);
    }
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: TrainerFormValues) => {
    onSubmit({ ...data, availability });
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Format day for display
  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1234567890"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Strength Training"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="50.00"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>Rate per hour in USD</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Set whether this trainer is currently active
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Experienced trainer specializing in strength training and weight loss..."
                  {...field}
                  disabled={isSubmitting}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                A brief description of the trainer's experience and expertise
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Availability</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={day} onValueChange={setDay} disabled={isSubmitting}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {daysOfWeek.map((d) => (
                  <SelectItem key={d} value={d}>
                    {formatDay(d)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isSubmitting}
              />
              <span>to</span>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="button"
              onClick={handleAddAvailability}
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Time Slot
            </Button>
          </div>

          <div className="space-y-2 mt-4">
            {availability.length === 0 ? (
              <p className="text-sm text-gray-500">No availability set yet.</p>
            ) : (
              availability.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <div>
                    <span className="font-medium">{formatDay(slot.day)}</span>:{" "}
                    <span>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAvailability(index)}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
          <FormDescription>
            Set the trainer's regular weekly availability
          </FormDescription>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                {trainer ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{trainer ? "Update Trainer" : "Create Trainer"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TrainerForm;
