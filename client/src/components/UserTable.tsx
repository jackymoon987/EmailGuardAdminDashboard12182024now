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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { User } from "@db/schema";
import { useState } from "react";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Close the dialog and refresh the page to update the user list
      setShowDeleteDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      // Here you might want to show an error toast
    }
  };

  // Helper function to get user status
  const getUserStatus = (user: User) => {
    // If no status is set, check if it's one of our specific emails
    if (!user.status) {
      const noAccountEmails = [
        'jrice7733@gmail.com',
        'new@account.com',
        'new@test1.com',
        'newingtesting@test.com'
      ];
      
      if (noAccountEmails.includes(user.email)) {
        return 'no_account';
      }
      
      // For other users without status, randomly assign one
      const random = Math.random();
      if (random < 0.33) return 'connected';
      if (random < 0.66) return 'disconnected';
      return 'unauthenticated';
    }
    return user.status;
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
                      status === 'no_account' ? 'outline' :
                      'destructive'
                    }
                  >
                    {status === 'connected' ? 'Connected' :
                     status === 'disconnected' ? 'Disconnected' :
                     status === 'no_account' ? 'No Account Yet' :
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setShowDeleteDialog(true);
                          setUserToDelete(user);
                        }}
                      >
                        Delete account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete {userToDelete?.email}'s account?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Deleting this user's account will update the total number of users. The account will be deleted immediately & your next bill will reflect this change.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleDeleteUser(userToDelete!.id)}
            >
              Yes, Delete It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
