import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Activity, Users, Calendar, Clock } from "lucide-react";

interface DashboardSummaryProps {
  totalMembers?: number;
  activeMembers?: number;
  upcomingClasses?: number;
  availableTrainers?: number;
}

const DashboardSummary = ({
  totalMembers = 245,
  activeMembers = 189,
  upcomingClasses = 12,
  availableTrainers = 8,
}: DashboardSummaryProps) => {
  const summaryCards = [
    {
      title: "Total Members",
      value: totalMembers,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      description: "Total registered gym members",
      trend: "+5% from last month",
      color: "bg-blue-50",
    },
    {
      title: "Active Memberships",
      value: activeMembers,
      icon: <Activity className="h-6 w-6 text-green-500" />,
      description: "Currently active memberships",
      trend: "+3% from last month",
      color: "bg-green-50",
    },
    {
      title: "Upcoming Classes",
      value: upcomingClasses,
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      description: "Classes scheduled this week",
      trend: "2 more than last week",
      color: "bg-purple-50",
    },
    {
      title: "Available Trainers",
      value: availableTrainers,
      icon: <Clock className="h-6 w-6 text-amber-500" />,
      description: "Trainers available today",
      trend: "Same as yesterday",
      color: "bg-amber-50",
    },
  ];

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Dashboard Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardHeader
              className={`${card.color} rounded-t-lg p-4 flex flex-row items-center justify-between`}
            >
              <CardTitle className="text-sm font-medium text-gray-700">
                {card.title}
              </CardTitle>
              <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm">
                {card.icon}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
                <p className="text-xs font-medium text-gray-600 mt-2">
                  {card.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardSummary;
