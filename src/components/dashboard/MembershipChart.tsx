import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MembershipChartProps {
  data?: {
    month: string;
    newSignups: number;
    renewals: number;
  }[];
  title?: string;
  description?: string;
}

const MembershipChart = ({
  data = [
    { month: "Jan", newSignups: 65, renewals: 42 },
    { month: "Feb", newSignups: 59, renewals: 55 },
    { month: "Mar", newSignups: 80, renewals: 40 },
    { month: "Apr", newSignups: 81, renewals: 65 },
    { month: "May", newSignups: 56, renewals: 70 },
    { month: "Jun", newSignups: 55, renewals: 60 },
    { month: "Jul", newSignups: 40, renewals: 45 },
  ],
  title = "Membership Trends",
  description = "Monthly overview of new sign-ups and renewals",
}: MembershipChartProps) => {
  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly" className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="newSignups"
                  name="New Sign-ups"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="renewals"
                  name="Renewals"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="quarterly" className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { quarter: "Q1", newSignups: 204, renewals: 137 },
                  { quarter: "Q2", newSignups: 192, renewals: 195 },
                  { quarter: "Q3", newSignups: 95, renewals: 105 },
                  { quarter: "Q4", newSignups: 150, renewals: 120 },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="newSignups"
                  name="New Sign-ups"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="renewals"
                  name="Renewals"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="yearly" className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { year: "2021", newSignups: 520, renewals: 380 },
                  { year: "2022", newSignups: 650, renewals: 490 },
                  { year: "2023", newSignups: 741, renewals: 557 },
                  { year: "2024", newSignups: 641, renewals: 437 },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="newSignups"
                  name="New Sign-ups"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="renewals"
                  name="Renewals"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MembershipChart;
