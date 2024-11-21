import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "../hooks/use-user";
import { ScrollArea } from "@/components/ui/scroll-area";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Shield, label: "Filters", href: "/filters" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
];

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [location] = useLocation();
  const { logout } = useUser();

  return (
    <div
      className={cn(
        "h-screen border-r bg-card fixed md:relative z-50 transition-all duration-300",
        open ? "w-64" : "w-0 md:w-16"
      )}
    >
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-center h-12 mb-8">
            <h1 className={cn("font-bold text-xl", !open && "hidden")}>
              Bulletproof Inbox
            </h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent",
                    !open && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn("text-sm", !open && "hidden")}>
                    {item.label}
                  </span>
                </a>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-0 right-0 px-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => logout({})}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className={cn(!open && "hidden")}>Logout</span>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
