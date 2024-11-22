import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "../hooks/use-user";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Shield, label: "Global Approved Sender List", href: "/filters" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
];

export default function TopNav() {
  const [location] = useLocation();
  const { logout } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <div
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap",
              location === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
            onClick={() => setMobileOpen(false)}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{item.label}</span>
          </div>
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <h1 className="font-bold text-xl">Bulletproof Inbox</h1>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-7">
              <h2 className="font-bold text-lg mb-4">Bulletproof Inbox</h2>
              <nav className="flex flex-col space-y-3">
                <NavContent />
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <NavContent />
        </nav>

        {/* Logout Button - Always Visible */}
        <div className="ml-auto">
          <Button
            variant="ghost"
            className="h-9 w-9 px-0"
            onClick={() => logout({})}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
