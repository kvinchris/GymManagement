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
import { Edit, QrCode, RefreshCw, ArrowLeft } from "lucide-react";
import { Member } from "@/types/member";

interface MemberDetailProps {
  member: Member;
  onBack: () => void;
  onEdit: (member: Member) => void;
  onRenewMembership: (memberId: string) => void;
  onViewQRCode: (memberId: string) => void;
}

const MemberDetail = ({
  member,
  onBack,
  onEdit,
  onRenewMembership,
  onViewQRCode,
}: MemberDetailProps) => {
  // Calculate days left until expiry
  const today = new Date();
  const daysLeft = Math.ceil(
    (member.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Determine membership status
  const getMembershipStatus = () => {
    if (daysLeft < 0) {
      return { label: "Expired", color: "bg-red-100 text-red-800" };
    } else if (daysLeft <= 7) {
      return { label: "Expiring Soon", color: "bg-amber-100 text-amber-800" };
    } else {
      return { label: "Active", color: "bg-green-100 text-green-800" };
    }
  };

  const status = getMembershipStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Members
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onViewQRCode(member.id)}
            className="gap-2"
          >
            <QrCode className="h-4 w-4" /> View QR Code
          </Button>
          <Button onClick={() => onEdit(member)} className="gap-2">
            <Edit className="h-4 w-4" /> Edit Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{member.name}</CardTitle>
            <CardDescription>Member ID: {member.memberId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{member.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{member.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>{member.address}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Join Date</p>
                <p>
                  {member.startDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p>{member.notes || "No additional notes."}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Package</p>
              <p className="font-medium">{member.packageName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge className={status.color}>{status.label}</Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Expiry Date</p>
              <p>
                {member.expiryDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Days Remaining
              </p>
              <p className={daysLeft < 0 ? "text-red-600 font-medium" : ""}>
                {daysLeft < 0 ? "Expired" : `${daysLeft} days`}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => onRenewMembership(member.id)}
              className="w-full gap-2"
              variant={daysLeft < 0 ? "default" : "outline"}
            >
              <RefreshCw className="h-4 w-4" /> Renew Membership
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MemberDetail;
