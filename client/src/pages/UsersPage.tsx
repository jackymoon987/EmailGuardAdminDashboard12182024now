import { useEffect } from "react";
import { useUser } from "../hooks/use-user";
import { UserTable } from "../components/UserTable";
import { ApprovedSenderTable } from "../components/ApprovedSenderTable";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import type { User } from "@db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to fetch users');
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      return data;
    }
  });

  // Use useEffect for navigation with loading state handling
  useEffect(() => {
    if (!isLoading && user) {
      // Add small delay to allow server role update
      setTimeout(() => {
        if (user.role !== 'admin') {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only administrators can access this page"
          });
          setLocation('/');
        }
      }, 500);
    }
  }, [user, isLoading, setLocation, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !users) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Error Loading Users</h2>
          <p className="text-muted-foreground">{error?.message || 'Failed to load users'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="approved-senders">Approved Senders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
              <CardDescription>
                Manage user accounts and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={users} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved-senders">
          <Card>
            <CardHeader>
              <CardTitle>Approved Sender List</CardTitle>
              <CardDescription>
                Manage email senders and their survey modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApprovedSenderTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
