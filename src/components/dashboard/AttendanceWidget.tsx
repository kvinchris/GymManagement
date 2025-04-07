import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDailyAttendance } from "@/services/firestore";
import { Attendance } from "@/types/firestore";
import { format } from "date-fns";
import { QrCode, UserCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AttendanceWidgetProps {
  onQuickAttendance: () => void;
}

const AttendanceWidget = ({ onQuickAttendance }: AttendanceWidgetProps) => {
  const [recentAttendance, setRecentAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const records = await getDailyAttendance(new Date());
        setRecentAttendance(records.slice(0, 5)); // Get only the 5 most recent check-ins
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleViewAll = () => {
    navigate("/attendance");
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          Today's Attendance
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onQuickAttendance}>
            <QrCode className="h-4 w-4 mr-2" />
            Check-in
          </Button>
          <Button variant="ghost" size="sm" onClick={handleViewAll}>
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="h-6 w-6 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : recentAttendance.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <UserCheck className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>No attendance records for today</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={onQuickAttendance}
            >
              Record First Check-in
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {record.memberName
                        ? record.memberName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {record.memberName || "Unknown Member"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.memberIdNumber || "No ID"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {record.checkInTime
                      ? format(record.checkInTime.toDate(), "h:mm a")
                      : "--:--"}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${record.checkInMethod === "qr" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                  >
                    {record.checkInMethod === "qr" ? "QR Scan" : "Manual"}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-2 text-center">
              <Button variant="link" onClick={handleViewAll}>
                View all attendance records
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceWidget;
