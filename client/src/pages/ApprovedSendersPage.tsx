import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { SendersTable } from "../components/SendersTable";
import { DomainsTable } from "../components/DomainsTable";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@db/schema";

export default function ApprovedSendersPage() {
  const { userId } = useParams();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Approved sender list for {user.email}
      </h1>
      
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
