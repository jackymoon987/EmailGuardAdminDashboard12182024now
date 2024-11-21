import { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mb-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
