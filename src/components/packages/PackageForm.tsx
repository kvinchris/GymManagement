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
import { Package } from "@/types/package";
import { X, Plus } from "lucide-react";

const packageSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  duration: z.coerce
    .number()
    .int()
    .positive({ message: "Duration must be a positive integer" }),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface PackageFormProps {
  pkg?: Package;
  onSubmit: (data: PackageFormValues & { features: string[] }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PackageForm = ({
  pkg,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PackageFormProps) => {
  const [features, setFeatures] = useState<string[]>(pkg?.features || []);
  const [newFeature, setNewFeature] = useState("");

  // Initialize form with existing package data or defaults
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: pkg
      ? {
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          duration: pkg.duration,
        }
      : {
          name: "",
          description: "",
          price: 0,
          duration: 30,
        },
  });

  const handleAddFeature = () => {
    if (newFeature.trim() !== "") {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleFormSubmit = (data: PackageFormValues) => {
    onSubmit({ ...data, features });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Premium Membership"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Full access to gym facilities and classes"
                    {...field}
                    disabled={isSubmitting}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="99.99"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Price in USD</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="30"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Membership duration in days</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Features</FormLabel>
            <div className="flex mt-2 mb-4">
              <Input
                placeholder="Add a feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                className="mr-2"
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                disabled={isSubmitting || !newFeature.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {features.length === 0 ? (
                <p className="text-sm text-gray-500">No features added yet.</p>
              ) : (
                features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <FormDescription className="mt-2">
              Add features included in this membership package
            </FormDescription>
          </div>
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
                {pkg ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{pkg ? "Update Package" : "Create Package"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PackageForm;
