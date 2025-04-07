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
import { Checkbox } from "@/components/ui/checkbox";
import { TrainerClass } from "@/types/trainer";

const classSchema = z.object({
  className: z
    .string()
    .min(2, { message: "Class name must be at least 2 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  capacity: z.coerce
    .number()
    .int()
    .positive({ message: "Capacity must be a positive integer" }),
  price: z.coerce
    .number()
    .nonnegative({ message: "Price must be a non-negative number" }),
  location: z.string().min(2, { message: "Location is required" }),
  isRecurring: z.boolean().default(false),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
  trainerClass?: TrainerClass;
  trainerId: string;
  onSubmit: (data: ClassFormValues & { recurringDays?: string[] }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const ClassForm = ({
  trainerClass,
  trainerId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ClassFormProps) => {
  const [recurringDays, setRecurringDays] = useState<string[]>(
    trainerClass?.recurringDays || [],
  );

  // Initialize form with existing class data or defaults
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: trainerClass
      ? {
          className: trainerClass.className,
          description: trainerClass.description,
          date: new Date(trainerClass.date).toISOString().split("T")[0],
          startTime: trainerClass.startTime,
          endTime: trainerClass.endTime,
          capacity: trainerClass.capacity,
          price: trainerClass.price || 0,
          location: trainerClass.location,
          isRecurring: trainerClass.isRecurring,
        }
      : {
          className: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          startTime: "09:00",
          endTime: "10:00",
          capacity: 10,
          price: 0,
          location: "Main Gym",
          isRecurring: false,
        },
  });

  const isRecurring = form.watch("isRecurring");

  const handleRecurringDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setRecurringDays([...recurringDays, day]);
    } else {
      setRecurringDays(recurringDays.filter((d) => d !== day));
    }
  };

  const handleFormSubmit = (data: ClassFormValues) => {
    onSubmit({
      ...data,
      recurringDays: data.isRecurring ? recurringDays : undefined,
    });
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
            name="className"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Yoga Basics"
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Studio 1"
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="10"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of participants
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>Class price per session</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Recurring Class</FormLabel>
                  <FormDescription>
                    Set if this class repeats weekly
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A gentle introduction to yoga poses and breathing techniques..."
                  {...field}
                  disabled={isSubmitting}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isRecurring && (
          <div className="space-y-3">
            <FormLabel>Recurring Days</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.id}
                    checked={recurringDays.includes(day.id)}
                    onCheckedChange={(checked) =>
                      handleRecurringDayChange(day.id, checked === true)
                    }
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor={day.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
            <FormDescription>
              Select the days of the week when this class repeats
            </FormDescription>
            {recurringDays.length === 0 && isRecurring && (
              <p className="text-sm text-red-500">
                Please select at least one day for a recurring class
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || (isRecurring && recurringDays.length === 0)
            }
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                {trainerClass ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{trainerClass ? "Update Class" : "Create Class"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClassForm;
