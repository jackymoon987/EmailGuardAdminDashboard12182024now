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
import { ChevronDown, ArrowLeft, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Extended User type to include 'no_account' status
interface ExtendedUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  password: string;
  role: string;
  createdAt: Date | null;
  showInitialSetup: boolean | null;
  status: 'connected' | 'disconnected' | 'unauthenticated' | 'no_account';
}

interface UserTableProps {
  users: ExtendedUser[];
  setSettings?: (settings: ExtendedUser[]) => void;
}

export function UserTable({ users, setSettings }: UserTableProps) {
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ExtendedUser | null>(null);
  const { toast } = useToast();

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      setShowDeleteDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error deleting user",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  };

  // Helper function to get user status
  const getUserStatus = (user: ExtendedUser) => {
    return user.status || 'unauthenticated';
  };

  // Add dummy users for testing
  const dummyUsers: ExtendedUser[] = [
    { id: 100, email: 'newuser1@example.com', firstName: 'New', lastName: 'User1', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 101, email: 'newuser2@example.com', firstName: 'New', lastName: 'User2', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 102, email: 'newuser3@example.com', firstName: 'New', lastName: 'User3', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 103, email: 'newuser4@example.com', firstName: 'New', lastName: 'User4', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 104, email: 'newuser5@example.com', firstName: 'New', lastName: 'User5', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 105, email: 'newuser6@example.com', firstName: 'New', lastName: 'User6', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 106, email: 'newuser7@example.com', firstName: 'New', lastName: 'User7', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 107, email: 'newuser8@example.com', firstName: 'New', lastName: 'User8', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 108, email: 'newuser9@example.com', firstName: 'New', lastName: 'User9', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' },
    { id: 109, email: 'newuser10@example.com', firstName: 'New', lastName: 'User10', role: 'user', password: '', createdAt: null, showInitialSetup: null, status: 'no_account' }
  ];

  // Merge dummy users with actual users
  const allUsers = [...users, ...dummyUsers];

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
          {allUsers.map((user) => {
            const status = getUserStatus(user);
            return (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-8 w-[180px] justify-between px-2 hover:bg-accent"
                      >
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'admin' : 'user'}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-1">(click to edit)</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem 
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/users/${user.id}/role`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ role: 'user' }),
                              credentials: 'include'
                            });
                            
                            if (!response.ok) {
                              const errorText = await response.text();
                              toast({
                                variant: "destructive",
                                title: "Failed to update role",
                                description: errorText || "An error occurred while updating the role"
                              });
                              return;
                            }
                            
                            toast({
                              title: "Role updated",
                              description: "User role has been updated to user"
                            });
                            
                            // Update local state if setSettings is provided
                            if (setSettings) {
                              setSettings(prevSettings => 
                                prevSettings.map(s => 
                                  s.id === user.id ? { ...s, role: 'user' } : s
                                )
                              );
                            }
                          } catch (error) {
                            console.error('Error updating role:', error);
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: "Failed to update user role"
                            });
                          }
                        }}
                        className="justify-between"
                      >
                        User
                        {user.role === 'user' && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/users/${user.id}/role`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ role: 'admin' }),
                              credentials: 'include'
                            });
                            
                            if (!response.ok) {
                              const errorText = await response.text();
                              toast({
                                variant: "destructive",
                                title: "Failed to update role",
                                description: errorText || "An error occurred while updating the role"
                              });
                              return;
                            }
                            
                            toast({
                              title: "Role updated",
                              description: "User role has been updated to administrator"
                            });
                            
                            // Update local state if setSettings is provided
                            if (setSettings) {
                              setSettings(prevSettings => 
                                prevSettings.map(s => 
                                  s.id === user.id ? { ...s, role: 'admin' } : s
                                )
                              );
                            }
                          } catch (error) {
                            console.error('Error updating role:', error);
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: "Failed to update user role"
                            });
                          }
                        }}
                        className="justify-between"
                      >
                        Administrator
                        {user.role === 'admin' && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              onClick={() => userToDelete && handleDeleteUser(userToDelete.id)}
            >
              Yes, Delete It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}