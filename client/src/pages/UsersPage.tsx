import { useEffect, useState, useMemo } from "react";
import { useUser } from "../hooks/use-user";
import { UserTable } from "../components/UserTable";
import { UserSettingsTable } from "../components/UserSettingsTable";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import type { User } from "@db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersPage() {
  // 1. All state hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();
  
  // 2. Context hooks
  const { user } = useUser();
  const { toast } = useToast();

  // 3. Query hooks
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

  // 4. Effect hooks
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

  // 5. Memoized values
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        user.email.toLowerCase().includes(searchTermLower) ||
        (user.firstName?.toLowerCase() || '').includes(searchTermLower) ||
        (user.lastName?.toLowerCase() || '').includes(searchTermLower);
      const matchesStatus = statusFilter === 'all' || (user.status || 'disconnected') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  // 6. Loading and error states
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        
        <div className="flex gap-4">
          <Input
            placeholder="Search by name or email..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
              <SelectItem value="unauthenticated">Unauthenticated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">User Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserTable users={filteredUsers} />
        </TabsContent>
        <TabsContent value="settings">
          <UserSettingsTable searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
