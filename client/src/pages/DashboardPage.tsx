import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserMinus, Shield } from "lucide-react";
import { useWebSocket } from "../hooks/use-ws";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  useWebSocket('/ws');
  
  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const res = await fetch('/api/filters');
      if (!res.ok) throw new Error('Failed to fetch filters');
      return res.json();
    }
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    }
  });

  const stats = {
    usersConnected: 847,
    unauthenticatedUsers: 124,
    alertsToday: 36,
    blockedEmailsMonth: 1583
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          className={cn(
            "transition-all duration-200 hover:shadow-md cursor-pointer",
            "hover:border-primary/50"
          )}
          onClick={() => setLocation('/users?status=connected')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Connected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersConnected}</div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "transition-all duration-200 hover:shadow-md cursor-pointer",
            "hover:border-primary/50"
          )}
          onClick={() => setLocation('/users?status=unauthenticated')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unauthenticated Users</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unauthenticatedUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Emails this Month</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedEmailsMonth}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
