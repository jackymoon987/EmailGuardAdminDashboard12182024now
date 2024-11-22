import { useQuery } from "@tanstack/react-query";
import { ApprovedSenderTable } from "../components/ApprovedSenderTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "../hooks/use-ws";

export default function FiltersPage() {
  useWebSocket('/ws');
  const { toast } = useToast();

  // Using dummy data directly from ApprovedSenderTable

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Global Approved Sender List</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Approved Sender
        </Button>
      </div>
      
      <ApprovedSenderTable />
    </div>
  );
}
