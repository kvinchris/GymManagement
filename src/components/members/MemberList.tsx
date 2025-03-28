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
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { Member } from "@/types/member";

interface MemberListProps {
  members: Member[];
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onViewMember: (member: Member) => void;
  onRenewMembership: (memberId: string) => void;
  onViewQRCode: (memberId: string) => void;
}

const MemberList = ({
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onViewMember,
  onRenewMembership,
  onViewQRCode,
}: MemberListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Function to determine membership status
  const getMembershipStatus = (expiryDate: Date) => {
    const today = new Date();
    const daysLeft = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysLeft < 0) {
      return {
        label: "Expired",
        color: "bg-red-100 text-red-800 hover:bg-red-100",
      };
    } else if (daysLeft <= 7) {
      return {
        label: "Expiring Soon",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      };
    } else {
      return {
        label: "Active",
        color: "bg-green-100 text-green-800 hover:bg-green-100",
      };
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search members..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddMember} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" /> Add Member
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const status = getMembershipStatus(member.expiryDate);
                return (
                  <TableRow key={member.id} className="hover:bg-gray-50">
                    <TableCell
                      className="font-medium cursor-pointer"
                      onClick={() => onViewMember(member)}
                    >
                      {member.memberId}
                    </TableCell>
                    <TableCell
                      onClick={() => onViewMember(member)}
                      className="cursor-pointer"
                    >
                      {member.name}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.packageName}</TableCell>
                    <TableCell>
                      {member.expiryDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
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
                            onClick={() => onViewMember(member)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEditMember(member)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewQRCode(member.id)}
                          >
                            <QrCode className="h-4 w-4 mr-2" /> View QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onRenewMembership(member.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" /> Renew
                            Membership
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onDeleteMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  {searchQuery
                    ? "No members found matching your search."
                    : "No members added yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MemberList;
