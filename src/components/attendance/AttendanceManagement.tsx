import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceRecord from "./AttendanceRecord";
import DailyAttendanceList from "./DailyAttendanceList";

const AttendanceManagement = () => {
  const [activeTab, setActiveTab] = useState("record");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Attendance Management
        </h1>
      </div>

      <Tabs
        defaultValue="record"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="record">Record Attendance</TabsTrigger>
          <TabsTrigger value="list">Daily Attendance</TabsTrigger>
        </TabsList>
        <TabsContent value="record" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Member Attendance</CardTitle>
              <CardDescription>
                Scan a member's QR code or enter their member ID to record
                attendance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceRecord />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance List</CardTitle>
              <CardDescription>
                View members who have checked in today or select a different
                date.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyAttendanceList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceManagement;
