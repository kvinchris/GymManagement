import React, { useState, useEffect } from "react";
import QuickAttendanceDialog from "./dashboard/QuickAttendanceDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import DashboardSummary from "./dashboard/DashboardSummary";
import MembershipChart from "./dashboard/MembershipChart";
import UpcomingClasses from "./dashboard/UpcomingClasses";
import ExpiringMemberships from "./dashboard/ExpiringMemberships";
import TrainerSchedule from "./dashboard/TrainerSchedule";
import AttendanceWidget from "./dashboard/AttendanceWidget";
import MemberManagement from "./members/MemberManagement";
import PackageManagement from "./packages/PackageManagement";
import TrainerManagement from "./trainers/TrainerManagement";
import ClassManagement from "./classes/ClassManagement";
import { Button } from "./ui/button";
import {
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  Users,
  Package,
  UserCog,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useToast } from "./ui/use-toast";

const Home = () => {
  const { currentUser, userRole, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    upcomingClasses: 0,
    availableTrainers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, we would fetch this data from Firebase
        // For now, we'll use mock data

        // Try to fetch real data if Firebase is connected
        try {
          const membersRef = collection(db, "members");
          const membersSnapshot = await getDocs(membersRef);
          const totalMembers = membersSnapshot.size;

          // Count active members (not expired)
          const today = new Date();
          const activeMembersQuery = query(
            membersRef,
            where("expiryDate", ">", today),
          );
          const activeMembersSnapshot = await getDocs(activeMembersQuery);
          const activeMembers = activeMembersSnapshot.size;

          // Count upcoming classes
          const classesRef = collection(db, "classes");
          const upcomingClassesQuery = query(
            classesRef,
            where("date", ">=", today),
            orderBy("date"),
          );
          const upcomingClassesSnapshot = await getDocs(upcomingClassesQuery);
          const upcomingClasses = upcomingClassesSnapshot.size;

          // Count available trainers
          const trainersRef = collection(db, "trainers");
          const availableTrainersQuery = query(
            trainersRef,
            where("isActive", "==", true),
          );
          const availableTrainersSnapshot = await getDocs(
            availableTrainersQuery,
          );
          const availableTrainers = availableTrainersSnapshot.size;

          setDashboardData({
            totalMembers,
            activeMembers,
            upcomingClasses,
            availableTrainers,
          });
        } catch (error) {
          console.error("Error fetching dashboard data from Firebase:", error);
          // Fallback to mock data
          setDashboardData({
            totalMembers: 245,
            activeMembers: 189,
            upcomingClasses: 12,
            availableTrainers: 8,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to handle navigation
  const handleNavigation = (section) => {
    setActiveSection(section);
    navigate(`/${section === "dashboard" ? "" : section}`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  // Define navigation items
  const navItems = [
    {
      name: "Dashboard",
      id: "dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Members",
      id: "members",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Packages",
      id: "packages",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Trainers",
      id: "trainers",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      name: "Classes",
      id: "classes",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Settings",
      id: "settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <DashboardSummary
              totalMembers={dashboardData.totalMembers}
              activeMembers={dashboardData.activeMembers}
              upcomingClasses={dashboardData.upcomingClasses}
              availableTrainers={dashboardData.availableTrainers}
              onQuickAttendance={() => setIsAttendanceDialogOpen(true)}
            />

            <QuickAttendanceDialog
              open={isAttendanceDialogOpen}
              onOpenChange={setIsAttendanceDialogOpen}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <MembershipChart />
              <UpcomingClasses />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <ExpiringMemberships />
              <TrainerSchedule />
            </div>

            <div className="mt-6">
              <AttendanceWidget
                onQuickAttendance={() => setIsAttendanceDialogOpen(true)}
              />
            </div>
          </>
        );
      case "members":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Member Management</h2>
            <p className="text-gray-500 mb-6">
              Manage gym members, view their details, and handle membership
              renewals.
            </p>
            <div className="mt-6">
              <MemberManagement />
            </div>
          </div>
        );
      case "packages":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Package Management</h2>
            <p className="text-gray-500 mb-6">
              Manage membership packages, pricing, and features.
            </p>
            <div className="mt-6">
              <PackageManagement />
            </div>
          </div>
        );
      case "trainers":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Trainer Management</h2>
            <p className="text-gray-500 mb-6">
              Manage gym trainers, their schedules, and classes.
            </p>
            <div className="mt-6">
              <TrainerManagement />
            </div>
          </div>
        );
      case "classes":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Class Management</h2>
            <p className="text-gray-500 mb-6">
              Manage gym classes, schedules, and assign trainers.
            </p>
            <div className="mt-6">
              <ClassManagement />
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <p className="text-gray-500 mb-6">
              This section will allow you to configure system settings.
            </p>
            <div className="p-12 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-400">
                Settings interface will be implemented here
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md z-20 fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              G
            </div>
            <span className="text-xl font-bold">GymManager</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.id)}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${activeSection === item.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <div className="mr-3">{item.icon}</div>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid || "admin"}`}
                alt="Admin"
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {currentUser?.displayName || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid || "admin"}`}
                        alt="Admin"
                      />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">
                      {userRole === "admin" ? "Admin" : "User"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
              {navItems.find((item) => item.id === activeSection)?.name ||
                "Dashboard"}
            </h1>

            {/* Render content based on active section */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
