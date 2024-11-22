import { useUser } from "../hooks/use-user";
import { UserTable } from "../components/UserTable";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function UsersPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    onSettled: (data, error) => {
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Please try again."
        });
      }
    }
  });

  // Redirect non-admin users
  if (user?.role !== 'admin') {
    setLocation('/');
    return null;
  }

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
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <UserTable users={users} />
    </div>
  );
}
