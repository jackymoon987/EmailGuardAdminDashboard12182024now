import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Shield, AlertCircle } from "lucide-react";
import { useWebSocket } from "../hooks/use-ws";

export default function DashboardPage() {
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
    totalFilters: filters?.length || 0,
    activeFilters: filters?.filter((f: any) => f.active).length || 0,
    blockedEmails: analytics?.filter((log: any) => log.action === 'blocked').length || 0,
    alertsToday: analytics?.filter((log: any) => {
      const today = new Date();
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === today.toDateString();
    }).length || 0,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Filters</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFilters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeFilters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Emails</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedEmails}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alertsToday}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
