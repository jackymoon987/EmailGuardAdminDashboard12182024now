import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../hooks/use-user";
import { Shield, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { InitialSetup } from "../components/InitialSetup";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Default to login view
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid email address",
        });
        setIsLoading(false);
        return;
      }

      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields",
        });
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const result = await login({ email, password });
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
        // For registration, we don't need firstName/lastName yet
        // That will be collected in the onboarding page
        const result = await register({ email, password });
        if (!result.ok) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Registration failed. Please try again.",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        
        // Redirect to onboarding page
        setLocation('/');
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
      <div className="w-full max-w-md space-y-8">
        <div className="text-right">
          <span className="text-sm text-muted-foreground">Already have an account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }} className="text-sm text-primary hover:underline">Sign in</a>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-semibold">Bulletproof</span>
          </div>
          <span className="text-xl font-semibold text-muted-foreground">Inbox</span>
          <p className="text-sm text-muted-foreground mt-2">
            Take control of your inbox.<br />
            Start your 30 day free trial today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          

          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {/* TODO: Implement Google Sign in */}}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or sign up with your email address
              </span>
            </div>
          </div>

          <div className="space-y-4">
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
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Continue
              </>
            ) : (
              "Continue"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a> and{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
          </p>
        </form>
      </div>
    </div>
  );
}
