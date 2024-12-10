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
import { ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { User } from "@db/schema";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const [, setLocation] = useLocation();

  return (
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
        {users.map((user) => (
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
                  user.status === 'connected' ? 'default' :
                  user.status === 'disconnected' ? 'secondary' :
                  'destructive'
                }
              >
                {user.status === 'connected' ? 'Connected' :
                 user.status === 'disconnected' ? 'Disconnected' :
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
                  <DropdownMenuItem onClick={() => {
                    // Handle reconnect
                  }}>
                    Reconnect
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation(`/approved-senders/${user.id}`)}>
                    Approved sender list
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation(`/analytics/${user.id}`)}>
                    Analytics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
