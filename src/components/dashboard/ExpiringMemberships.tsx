import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Bell, Calendar, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  expiryDate: Date;
  packageName: string;
  daysLeft: number;
}

interface ExpiringMembershipsProps {
  members?: Member[];
  onSendNotification?: (memberId: string, method: "email" | "sms") => void;
  onRenew?: (memberId: string) => void;
}

const ExpiringMemberships = ({
  members = [
    {
      id: "M001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      packageName: "Premium",
      daysLeft: 3,
    },
    {
      id: "M002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1987654321",
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      packageName: "Standard",
      daysLeft: 5,
    },
    {
      id: "M003",
      name: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "+1122334455",
      expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      packageName: "Basic",
      daysLeft: 1,
    },
    {
      id: "M004",
      name: "Emily Wilson",
      email: "emily.w@example.com",
      phone: "+1567890123",
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      packageName: "Premium",
      daysLeft: 7,
    },
  ],
  onSendNotification = (memberId, method) => {
    console.log(`Sending ${method} notification to member ${memberId}`);
  },
  onRenew = (memberId) => {
    console.log(`Renewing membership for member ${memberId}`);
  },
}: ExpiringMembershipsProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-500" />
          Expiring Memberships
        </CardTitle>
        <CardDescription>
          Members whose memberships are expiring in the next 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{member.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {member.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.packageName}</TableCell>
                <TableCell>
                  {member.expiryDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "font-medium",
                      member.daysLeft <= 3
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : member.daysLeft <= 5
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100",
                    )}
                  >
                    {member.daysLeft} {member.daysLeft === 1 ? "day" : "days"}{" "}
                    left
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => onSendNotification(member.id, "email")}
                    >
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => onSendNotification(member.id, "sms")}
                    >
                      <Bell className="h-3.5 w-3.5 mr-1" />
                      SMS
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 px-2 text-xs bg-green-600 hover:bg-green-700"
                      onClick={() => onRenew(member.id)}
                    >
                      Renew
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpiringMemberships;
