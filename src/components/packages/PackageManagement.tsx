import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PackageList from "./PackageList";
import PackageForm from "./PackageForm";
import PackageDetail from "./PackageDetail";
import { Package } from "@/types/package";

// Mock data for packages
const mockPackages: Package[] = [
  {
    id: "pkg1",
    name: "Basic",
    description: "Access to basic gym facilities",
    price: 29.99,
    duration: 30,
    features: ["Basic gym access", "Locker access"],
  },
  {
    id: "pkg2",
    name: "Standard",
    description: "Access to all gym facilities and group classes",
    price: 49.99,
    duration: 30,
    features: ["Full gym access", "Group classes", "Locker access"],
  },
  {
    id: "pkg3",
    name: "Premium",
    description: "Full access including personal trainer sessions",
    price: 99.99,
    duration: 30,
    features: [
      "Full gym access",
      "Group classes",
      "2 PT sessions/month",
      "Locker access",
      "Towel service",
    ],
  },
  {
    id: "pkg4",
    name: "Annual Basic",
    description: "Basic membership with annual payment",
    price: 299.99,
    duration: 365,
    features: [
      "Basic gym access",
      "Locker access",
      "20% discount on annual payment",
    ],
  },
  {
    id: "pkg5",
    name: "Annual Premium",
    description: "Premium membership with annual payment",
    price: 999.99,
    duration: 365,
    features: [
      "Full gym access",
      "Group classes",
      "24 PT sessions/year",
      "Locker access",
      "Towel service",
      "15% discount on annual payment",
    ],
  },
];

// Mock data for member counts per package
const mockMemberCounts: Record<string, number> = {
  pkg1: 45,
  pkg2: 78,
  pkg3: 32,
  pkg4: 15,
  pkg5: 8,
};

const PackageManagement = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [view, setView] = useState<"list" | "detail">("list");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  // Handle adding a new package
  const handleAddPackage = () => {
    setSelectedPackage(null);
    setIsFormOpen(true);
  };

  // Handle editing a package
  const handleEditPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsFormOpen(true);
  };

  // Handle viewing a package's details
  const handleViewPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setView("detail");
  };

  // Handle deleting a package
  const handleDeletePackage = (packageId: string) => {
    setPackageToDelete(packageId);
    setIsDeleteDialogOpen(true);
  };

  // Confirm package deletion
  const confirmDeletePackage = () => {
    if (packageToDelete) {
      setPackages(packages.filter((pkg) => pkg.id !== packageToDelete));
      setIsDeleteDialogOpen(false);
      setPackageToDelete(null);
      toast({
        title: "Package deleted",
        description: "The package has been successfully deleted.",
      });
    }
  };

  // Handle form submission for new/edit package
  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (selectedPackage) {
        // Update existing package
        const updatedPackages = packages.map((pkg) =>
          pkg.id === selectedPackage.id
            ? {
                ...pkg,
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
                features: data.features,
              }
            : pkg,
        );
        setPackages(updatedPackages);
        toast({
          title: "Package updated",
          description: "The package has been successfully updated.",
        });
      } else {
        // Add new package
        const newPackage: Package = {
          id: `pkg${Date.now()}`,
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          features: data.features,
        };
        setPackages([...packages, newPackage]);
        toast({
          title: "Package added",
          description: "The new package has been successfully added.",
        });
      }

      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 1000);
  };

  // Render the appropriate view
  const renderView = () => {
    switch (view) {
      case "detail":
        return selectedPackage ? (
          <PackageDetail
            pkg={selectedPackage}
            memberCount={mockMemberCounts[selectedPackage.id] || 0}
            onBack={() => setView("list")}
            onEdit={handleEditPackage}
          />
        ) : null;
      case "list":
      default:
        return (
          <PackageList
            packages={packages}
            onAddPackage={handleAddPackage}
            onEditPackage={handleEditPackage}
            onDeletePackage={handleDeletePackage}
            onViewPackage={handleViewPackage}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderView()}

      {/* Package Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPackage ? "Edit Package" : "Add New Package"}
            </DialogTitle>
            <DialogDescription>
              {selectedPackage
                ? "Update the package information below."
                : "Fill in the details to add a new membership package."}
            </DialogDescription>
          </DialogHeader>
          <PackageForm
            pkg={selectedPackage || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              package. Members currently using this package will not be
              affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePackage}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PackageManagement;
