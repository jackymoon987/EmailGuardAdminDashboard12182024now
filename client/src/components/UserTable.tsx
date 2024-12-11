import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { User } from "@db/schema";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const [, setLocation] = useLocation();

  // Helper function to get user status
  const getUserStatus = (user: User) => {
    return user.status || 'disconnected';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setLocation('/users')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Permission Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const status = getUserStatus(user);
            return (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      status === 'connected' ? 'default' :
                      status === 'disconnected' ? 'secondary' :
                      'destructive'
                    }
                  >
                    {status === 'connected' ? 'Connected' :
                     status === 'disconnected' ? 'Disconnected' :
                     'Unauthenticated'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Review <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      
                      <DropdownMenuItem onClick={() => setLocation(`/approved-senders/${user.id}`)}>
                        Approved sender list
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setLocation(`/analytics/${user.id}?email=${encodeURIComponent(user.email)}`);
                        window.location.reload();
                      }}>
                        Analytics
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
