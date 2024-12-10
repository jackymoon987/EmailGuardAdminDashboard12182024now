import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SendersTable } from "../components/SendersTable";
import { DomainsTable } from "../components/DomainsTable";

export default function ApprovedSendersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Approved Senders</h1>
      
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
            <div className="flex-1" /> {/* Spacer */}
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
