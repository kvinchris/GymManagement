import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timestamp } from "firebase/firestore";
import { recordAttendance, getMemberByIdNumber } from "@/services/firestore";
import { CheckCircle, AlertCircle, QrCode, UserRound } from "lucide-react";

const AttendanceRecord = () => {
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberInfo, setMemberInfo] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const resetState = () => {
    setSuccess(false);
    setError(null);
    setMemberInfo(null);
  };

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (!memberId.trim()) {
      setError("Please enter a member ID");
      return;
    }

    setLoading(true);

    try {
      // Find the member by their ID number
      const member = await getMemberByIdNumber(memberId.trim());

      if (!member) {
        setError("Member not found. Please check the ID and try again.");
        setLoading(false);
        return;
      }

      // Record attendance
      await recordAttendance({
        memberId: member.id,
        memberName: member.name,
        memberIdNumber: member.memberId,
        date: Timestamp.fromDate(new Date()),
        checkInMethod: "manual",
      });

      setMemberInfo({
        name: member.name,
        id: member.memberId,
      });
      setSuccess(true);
      setMemberId("");
    } catch (err) {
      console.error("Error recording attendance:", err);
      setError("Failed to record attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // This is a placeholder for QR scanning functionality
  // In a real implementation, you would integrate with a QR scanner library
  const handleQRScan = () => {
    setError(
      "QR scanning functionality is not implemented yet. Please use manual entry.",
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="manual">
            <UserRound className="mr-2 h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="qr">
            <QrCode className="mr-2 h-4 w-4" />
            QR Scan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-6">
          <form onSubmit={handleManualEntry} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="memberId">Member ID</Label>
              <Input
                id="memberId"
                placeholder="Enter member ID (e.g., GM12345)"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Record Attendance"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="qr" className="mt-6">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg min-h-[200px]">
            <QrCode size={64} className="mb-4 text-muted-foreground" />
            <p className="text-center text-muted-foreground mb-4">
              Point your camera at the member's QR code to record attendance
            </p>
            <Button onClick={handleQRScan} variant="outline">
              Start QR Scanner
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {success && memberInfo && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">
            Attendance recorded successfully!
          </AlertTitle>
          <AlertDescription className="text-green-700">
            {memberInfo.name} (ID: {memberInfo.id}) has been checked in.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AttendanceRecord;
