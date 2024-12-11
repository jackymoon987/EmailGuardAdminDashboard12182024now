import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { EmailStatusPieChart } from "../components/charts/EmailStatusPieChart";
import { EmailMonthlyChart } from "../components/charts/EmailMonthlyChart";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("monthly");

  const { isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    }
  });

  if (isLoadingAnalytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {window.location.search.includes('?email=') 
            ? `Approved sender list for ${decodeURIComponent(new URLSearchParams(window.location.search).get('email') || '')}`
            : 'Company wide stats'
          }
        </h1>
        <Tabs defaultValue="monthly" onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="ytd">Year to date</TabsTrigger>
            <TabsTrigger value="alltime">All time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium">Time savings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">--</div>
                  <span className="text-sm text-muted-foreground">Last 30 days</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">0h 1m</div>
                  <span className="text-sm text-muted-foreground">Last 60 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Shielded from inbox</h3>
              <EmailStatusPieChart
                data={[
                  { name: "Approved", value: 15 },
                  { name: "Evaluating", value: 4 },
                  { name: "Blocked", value: 0 }
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Month over month</h3>
              <EmailMonthlyChart
                data={[
                  { name: "Jan", approved: 4, evaluating: 1, blocked: 0 },
                  { name: "Feb", approved: 3, evaluating: 1, blocked: 1 },
                  { name: "Mar", approved: 5, evaluating: 0, blocked: 0 },
                  { name: "Apr", approved: 2, evaluating: 2, blocked: 0 },
                  { name: "May", approved: 6, evaluating: 1, blocked: 0 },
                  { name: "Jun", approved: 4, evaluating: 0, blocked: 0 },
                  { name: "Jul", approved: 3, evaluating: 1, blocked: 0 },
                  { name: "Aug", approved: 5, evaluating: 2, blocked: 0 },
                  { name: "Sep", approved: 4, evaluating: 0, blocked: 0 },
                  { name: "Oct", approved: 35, evaluating: 2, blocked: 1 },
                  { name: "Nov", approved: 12, evaluating: 1, blocked: 0 },
                  { name: "Dec", approved: 8, evaluating: 0, blocked: 0 }
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
