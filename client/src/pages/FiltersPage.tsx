import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "../hooks/use-ws";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendersTable } from "../components/SendersTable";
import { DomainsTable } from "../components/DomainsTable";

export default function FiltersPage() {
  useWebSocket('/ws');
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Global Approved Sender List</h1>
      </div>
      
      <Tabs defaultValue="senders">
        <TabsList>
          <TabsTrigger value="senders">Senders</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
        </TabsList>
        
        <TabsContent value="senders" className="space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search senders..."
              className="max-w-sm"
            />
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Sender
            </Button>
          </div>
          <SendersTable />
        </TabsContent>
        
        <TabsContent value="domains" className="space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search domains..."
              className="max-w-sm"
            />
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Domain
            </Button>
          </div>
          <DomainsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
