import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function EmailProviderPage() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Get started</h1>
        <h2 className="text-lg text-center mb-2">To get started, sign in to your email</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">Select your email provider below.</p>

        <div className="space-y-4">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex flex-col items-center">
              <img src="/gmail-icon.svg" alt="Gmail" className="w-12 h-12 mb-2" />
              <h3 className="font-medium">Gmail</h3>
              <p className="text-sm text-muted-foreground text-center">
                If your email address is provided by Google
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => {
                  // In a real app, this would initiate Google OAuth
                  // For now, simulate auth and go to company settings
                  setLocation('/company-settings');
                }}
              >
                Sign in to Google
              </Button>
              <p className="text-xs text-muted-foreground mt-2 hover:underline cursor-help">
                Why do I need to sign in?
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex flex-col items-center">
              <img src="/outlook-icon.svg" alt="Outlook" className="w-12 h-12 mb-2" />
              <h3 className="font-medium">Outlook</h3>
              <p className="text-sm text-muted-foreground text-center">
                If your email service is provided by Microsoft
                <br />(this includes Hotmail)
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => setLocation('/settings')}
              >
                Sign in to Microsoft
              </Button>
              <p className="text-xs text-muted-foreground mt-2 hover:underline cursor-help">
                Why do I need to sign in?
              </p>
            </div>
          </Card>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">Using another email provider?</span>
              <Button 
                variant="link" 
                className="text-primary text-sm p-0"
                onClick={() => window.location.href = "/join-waitlist"}
              >
                Join our waitlist
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Bulletproof currently works with Gmail and Outlook.
            </p>
          </div>
          
          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              className="text-sm text-muted-foreground"
              onClick={() => setLocation('/settings')}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
