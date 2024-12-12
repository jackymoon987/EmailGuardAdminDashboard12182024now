import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ArrowLeft } from "lucide-react";
import { SendersTable } from "../components/SendersTable";
import { DomainsTable } from "../components/DomainsTable";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@db/schema";

export default function ApprovedSendersPage() {
  const { userId } = useParams();
  const [, setLocation] = useLocation();
  
  // Using dummy data for now
  const dummyUser: User = {
    id: parseInt(userId || '1'),
    email: 'new@test7.com',
    firstName: 'John',
    lastName: 'Smith',
    password: '', // Required by type but not used in UI
    role: 'user',
    status: 'connected',
    createdAt: new Date(),
    showInitialSetup: false
  };

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return dummyUser;
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
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setLocation('/users')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          Approved sender list for {user.email}
        </h1>
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
