import { useQuery } from "@tanstack/react-query";
import { EmailFilterTable } from "../components/EmailFilterTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "../hooks/use-ws";

export default function FiltersPage() {
  useWebSocket('/ws');
  const { toast } = useToast();

  const { data: filters, isLoading, error } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const res = await fetch('/api/filters');
      if (!res.ok) throw new Error('Failed to fetch filters');
      return res.json();
    },
    onSettled: (data, error) => {
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load filters. Please try again."
        });
      }
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Filters</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Filter
        </Button>
      </div>
      
      <EmailFilterTable filters={filters} />
    </div>
  );
}
