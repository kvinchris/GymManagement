import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getDailyAttendance } from "@/services/firestore";
import { Attendance } from "@/types/firestore";

const DailyAttendanceList = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const records = await getDailyAttendance(date);
        setAttendanceRecords(records);
      } catch (err) {
        console.error("Error fetching attendance records:", err);
        setError("Failed to load attendance records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [date]);

  const filteredRecords = attendanceRecords.filter((record) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      record.memberName?.toLowerCase().includes(searchLower) ||
      record.memberIdNumber?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">{error}</div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          {searchQuery
            ? "No matching attendance records found."
            : "No attendance records for this date."}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Check-out Time</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.memberIdNumber || "N/A"}</TableCell>
                  <TableCell>{record.memberName || "Unknown"}</TableCell>
                  <TableCell>
                    {record.checkInTime
                      ? format(record.checkInTime.toDate(), "h:mm a")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {record.checkOutTime
                      ? format(record.checkOutTime.toDate(), "h:mm a")
                      : "Not checked out"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${record.checkInMethod === "qr" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                    >
                      {record.checkInMethod === "qr" ? "QR Scan" : "Manual"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DailyAttendanceList;
