import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Package,
  UserCog,
  Calendar,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
};

const NavItem = ({ icon, label, href, active = false }: NavItemProps) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 py-6",
          active && "bg-accent text-accent-foreground",
        )}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: <Users size={20} />,
      label: "Members",
      href: "/members",
    },
    {
      icon: <Package size={20} />,
      label: "Packages",
      href: "/packages",
    },
    {
      icon: <UserCog size={20} />,
      label: "Trainers",
      href: "/trainers",
    },
    {
      icon: <Calendar size={20} />,
      label: "Classes",
      href: "/classes",
    },
    {
      icon: <Users size={20} />,
      label: "Attendance",
      href: "/attendance",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Reports",
      href: "/reports",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="flex h-full w-[280px] flex-col bg-background border-r p-4">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <span className="text-lg font-bold text-primary-foreground">GM</span>
        </div>
        <div>
          <h1 className="text-xl font-bold">Gym Manager</h1>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex-1 space-y-1 py-2">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </div>

      <Separator className="my-4" />

      <div className="mt-auto pb-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-6 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
