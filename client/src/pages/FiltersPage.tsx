import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "../hooks/use-ws";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendersTable } from "../components/SendersTable";
import { DomainsTable } from "../components/DomainsTable";
import { AddFilterModal } from "../components/AddFilterModal";
import { useState } from "react";

export default function FiltersPage() {
  useWebSocket('/ws');
  const { toast } = useToast();
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showSenderModal, setShowSenderModal] = useState(false);

  const handleAddEntries = async (entries: string[], action: 'approve' | 'block') => {
    try {
      const response = await fetch('/api/filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, action }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to add entries');
      }

      toast({
        title: "Success",
        description: `Successfully ${action}ed ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add entries"
      });
    }
  };

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
            <Button onClick={() => setShowSenderModal(true)}>
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
            <Button onClick={() => setShowDomainModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Domain
            </Button>
          </div>
          <DomainsTable />
        </TabsContent>
      </Tabs>

      <AddFilterModal
        open={showDomainModal}
        onOpenChange={setShowDomainModal}
        type="domain"
        onSubmit={handleAddEntries}
      />

      <AddFilterModal
        open={showSenderModal}
        onOpenChange={setShowSenderModal}
        type="sender"
        onSubmit={handleAddEntries}
      />
    </div>
  );
}
