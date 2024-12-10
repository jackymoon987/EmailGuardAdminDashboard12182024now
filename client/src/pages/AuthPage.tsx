import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../hooks/use-user";
import { Shield, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { InitialSetup } from "../components/InitialSetup";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (!email || !password || (!isLogin && (!firstName || !lastName))) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields",
        });
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const result = await login({ email, password, firstName: "", lastName: "" });
        if (!result.ok) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Login failed. Please try again.",
          });
          setIsLoading(false);
          return;
        }
        toast({
          title: "Success",
          description: "Login successful!",
        });
        setLocation('/');
      } else {
        // Handle new user registration
        const result = await register({ email, password, firstName, lastName });
        if (!result.ok) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Registration failed. Please try again.",
          });
          setIsLoading(false);
          return;
        }

        // Always show initial setup for new registrations
        setShowInitialSetup(true);
        
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialSetupComplete = (settings: {
    surveyEmailDefault: "yes" | "no" | "later";
    evaluatingFolderDefault: "yes" | "no" | "later";
  }) => {
    toast({
      title: "Success",
      description: "Initial setup completed successfully!",
    });
    setLocation('/');
  };

  const handleReviewSenders = () => {
    setLocation('/filters');
  };

  if (showInitialSetup) {
    return (
      <InitialSetup
        onComplete={handleInitialSetupComplete}
        onReviewSenders={handleReviewSenders}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            Bulletproof Inbox
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              {!isLogin && (
                <>
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                  />
                </>
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Logging in..." : "Registering..."}
                </>
              ) : (
                isLogin ? "Login" : "Register"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={isLoading}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
