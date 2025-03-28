import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Member } from "@/types/member";
import { Package } from "@/types/package";

const renewalSchema = z.object({
  packageId: z.string({ required_error: "Please select a membership package" }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

type RenewalFormValues = z.infer<typeof renewalSchema>;

interface RenewMembershipFormProps {
  member: Member;
  packages: Package[];
  onSubmit: (data: RenewalFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const RenewMembershipForm = ({
  member,
  packages,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RenewMembershipFormProps) => {
  // Calculate default start date (day after current expiry or today if already expired)
  const today = new Date();
  const defaultStartDate = new Date(member.expiryDate);
  if (defaultStartDate < today) {
    defaultStartDate.setTime(today.getTime());
  } else {
    defaultStartDate.setDate(defaultStartDate.getDate() + 1);
  }

  const form = useForm<RenewalFormValues>({
    resolver: zodResolver(renewalSchema),
    defaultValues: {
      packageId: member.packageId,
      startDate: defaultStartDate.toISOString().split("T")[0],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500">Member</p>
              <p className="font-medium">{member.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Member ID</p>
              <p className="font-medium">{member.memberId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Package
              </p>
              <p>{member.packageName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Expiry Date
              </p>
              <p>
                {member.expiryDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="packageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Package for Renewal</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price} / {pkg.duration} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the membership package for the renewal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>
                  The renewed membership will start from this date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                Processing...
              </>
            ) : (
              "Renew Membership"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RenewMembershipForm;
