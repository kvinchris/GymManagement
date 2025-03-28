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
import MemberList from "./MemberList";
import MemberForm from "./MemberForm";
import MemberDetail from "./MemberDetail";
import MemberQRCode from "./MemberQRCode";
import RenewMembershipForm from "./RenewMembershipForm";
import { Member } from "@/types/member";
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

// Generate a random member ID
const generateMemberId = () => {
  const prefix = "GM";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNum}`;
};

// Mock data for members
const mockMembers: Member[] = [
  {
    id: "1",
    memberId: "GM12345",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main St, Anytown, USA",
    packageId: "pkg3",
    packageName: "Premium",
    startDate: new Date(2023, 5, 15),
    expiryDate: new Date(2023, 11, 15),
    notes: "Prefers morning workouts. Has knee issues.",
  },
  {
    id: "2",
    memberId: "GM23456",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    address: "456 Oak Ave, Somewhere, USA",
    packageId: "pkg2",
    packageName: "Standard",
    startDate: new Date(2023, 8, 1),
    expiryDate: new Date(2024, 8, 1),
    notes: "",
  },
  {
    id: "3",
    memberId: "GM34567",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1122334455",
    address: "789 Pine St, Nowhere, USA",
    packageId: "pkg1",
    packageName: "Basic",
    startDate: new Date(2023, 10, 10),
    expiryDate: new Date(2023, 11, 10),
    notes: "Interested in personal training sessions.",
  },
  {
    id: "4",
    memberId: "GM45678",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "+1567890123",
    address: "101 Maple Dr, Anywhere, USA",
    packageId: "pkg4",
    packageName: "Annual Basic",
    startDate: new Date(2023, 2, 15),
    expiryDate: new Date(2024, 2, 15),
    notes: "Attends yoga classes regularly.",
  },
];

const MemberManagement = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [view, setView] = useState<"list" | "detail" | "qrcode">("list");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  // Handle adding a new member
  const handleAddMember = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  // Handle editing a member
  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  // Handle viewing a member's details
  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setView("detail");
  };

  // Handle viewing a member's QR code
  const handleViewQRCode = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setView("qrcode");
    }
  };

  // Handle deleting a member
  const handleDeleteMember = (memberId: string) => {
    setMemberToDelete(memberId);
    setIsDeleteDialogOpen(true);
  };

  // Confirm member deletion
  const confirmDeleteMember = () => {
    if (memberToDelete) {
      setMembers(members.filter((member) => member.id !== memberToDelete));
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
      toast({
        title: "Member deleted",
        description: "The member has been successfully deleted.",
      });
    }
  };

  // Handle renewing a membership
  const handleRenewMembership = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsRenewDialogOpen(true);
    }
  };

  // Handle form submission for new/edit member
  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const selectedPackage = mockPackages.find((p) => p.id === data.packageId);

      if (!selectedPackage) {
        toast({
          title: "Error",
          description: "Selected package not found.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const startDate = new Date(data.startDate);
      const expiryDate = new Date(startDate);
      expiryDate.setDate(expiryDate.getDate() + selectedPackage.duration);

      if (selectedMember) {
        // Update existing member
        const updatedMembers = members.map((member) =>
          member.id === selectedMember.id
            ? {
                ...member,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                packageId: data.packageId,
                packageName: selectedPackage.name,
                startDate,
                expiryDate,
              }
            : member,
        );
        setMembers(updatedMembers);
        toast({
          title: "Member updated",
          description: "The member has been successfully updated.",
        });
      } else {
        // Add new member
        const newMember: Member = {
          id: Date.now().toString(),
          memberId: generateMemberId(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          packageId: data.packageId,
          packageName: selectedPackage.name,
          startDate,
          expiryDate,
          notes: "",
        };
        setMembers([...members, newMember]);
        toast({
          title: "Member added",
          description: "The new member has been successfully added.",
        });
      }

      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 1000);
  };

  // Handle renewal form submission
  const handleRenewalSubmit = (data: any) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (!selectedMember) {
        setIsSubmitting(false);
        return;
      }

      const selectedPackage = mockPackages.find((p) => p.id === data.packageId);

      if (!selectedPackage) {
        toast({
          title: "Error",
          description: "Selected package not found.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const startDate = new Date(data.startDate);
      const expiryDate = new Date(startDate);
      expiryDate.setDate(expiryDate.getDate() + selectedPackage.duration);

      // Update the member with renewed membership
      const updatedMembers = members.map((member) =>
        member.id === selectedMember.id
          ? {
              ...member,
              packageId: data.packageId,
              packageName: selectedPackage.name,
              startDate,
              expiryDate,
            }
          : member,
      );

      setMembers(updatedMembers);
      setIsRenewDialogOpen(false);
      setIsSubmitting(false);

      toast({
        title: "Membership renewed",
        description: `${selectedMember.name}'s membership has been renewed until ${expiryDate.toLocaleDateString()}.`,
      });
    }, 1000);
  };

  // Render the appropriate view
  const renderView = () => {
    switch (view) {
      case "detail":
        return selectedMember ? (
          <MemberDetail
            member={selectedMember}
            onBack={() => setView("list")}
            onEdit={handleEditMember}
            onRenewMembership={handleRenewMembership}
            onViewQRCode={handleViewQRCode}
          />
        ) : null;
      case "qrcode":
        return selectedMember ? (
          <MemberQRCode
            member={selectedMember}
            onBack={() => setView("list")}
          />
        ) : null;
      case "list":
      default:
        return (
          <MemberList
            members={members}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            onViewMember={handleViewMember}
            onRenewMembership={handleRenewMembership}
            onViewQRCode={handleViewQRCode}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderView()}

      {/* Member Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? "Edit Member" : "Add New Member"}
            </DialogTitle>
            <DialogDescription>
              {selectedMember
                ? "Update the member's information below."
                : "Fill in the details to add a new member."}
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            member={selectedMember || undefined}
            packages={mockPackages}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Renew Membership Dialog */}
      <Dialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Renew Membership</DialogTitle>
            <DialogDescription>
              Select a package and start date for the membership renewal.
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <RenewMembershipForm
              member={selectedMember}
              packages={mockPackages}
              onSubmit={handleRenewalSubmit}
              onCancel={() => setIsRenewDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          )}
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
              member and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMember}
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

export default MemberManagement;
