import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";
import { Building2, CreditCard, UserPlus, AlertTriangle } from "lucide-react";
import { useUser } from "../hooks/use-user";

export default function AdminProfilePage() {
  const [, setLocation] = useLocation();
  const { user } = useUser();

  if (!user || user.role !== 'admin') {
    setLocation('/');
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Email address</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>
            <Badge 
              variant={
                user?.status === 'connected' ? 'default' :
                user?.status === 'disconnected' ? 'secondary' :
                'destructive'
              }
            >
              {user?.status === 'connected' ? 'Connected' :
               user?.status === 'disconnected' ? 'Disconnected' :
               'Unauthenticated'}
            </Badge>
          </div>
          <Button 
            variant="outline"
            onClick={() => setLocation(`/users?email=${encodeURIComponent(user?.email || '')}`)}
          >
            Go to account
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Settings
            </CardTitle>
            <CardDescription>
              Manage your company-wide settings and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              onClick={() => setLocation('/settings')}
            >
              Company Wide Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Current Plan</h3>
              <p className="text-sm text-muted-foreground">Enterprise Plan</p>
              <p className="text-sm text-muted-foreground">Next billing date: January 11, 2025</p>
            </div>
            <Button variant="outline">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Administrators
            </CardTitle>
            <CardDescription>
              Add more administrators to help manage the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              Invite Admin
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
