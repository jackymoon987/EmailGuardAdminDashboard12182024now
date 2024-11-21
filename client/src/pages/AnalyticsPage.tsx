import { useQuery } from "@tanstack/react-query";
import { AnalyticsChart } from "../components/AnalyticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useWebSocket } from "../hooks/use-ws";

export default function AnalyticsPage() {
  useWebSocket('/ws');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Filter Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics} type="activity" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blocked vs Allowed</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics} type="ratio" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
