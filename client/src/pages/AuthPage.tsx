import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../hooks/use-user";
import { Shield, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
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
        const result = await login({ 
          email, 
          password,
          firstName: "",
          lastName: ""
        });
        
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
        const result = await register({ 
          email, 
          password,
          firstName: "",
          lastName: ""
        });
        
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {isLogin ? (
            <>
              <span className="text-sm text-muted-foreground">Don't have an account? </span>
              <button 
                onClick={() => { 
                  setIsLogin(false); 
                  setEmail('');
                  setPassword('');
                }} 
                className="text-sm text-primary hover:underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">Already have an account? </span>
              <button 
                onClick={() => { 
                  setIsLogin(true);
                  setEmail('');
                  setPassword('');
                }} 
                className="text-sm text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          )}
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
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              isLogin ? "Sign in" : "Create account"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to our{" "}
            <button className="text-primary hover:underline">Privacy Policy</button> and{" "}
            <button className="text-primary hover:underline">Terms of Service</button>
          </p>
        </form>
      </div>
    </div>
  );
}