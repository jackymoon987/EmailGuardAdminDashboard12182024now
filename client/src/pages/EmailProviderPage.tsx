import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EmailProviderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Get started</h1>
          <p className="text-muted-foreground">To get started, sign in to your email</p>
          <p className="text-sm text-muted-foreground">Select your email provider below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Button 
              variant="ghost" 
              className="w-full h-full flex flex-col items-center space-y-4"
              onClick={() => window.location.href = "/api/auth/google"}
            >
              <img src="/gmail-icon.svg" alt="Gmail" className="w-12 h-12" />
              <div className="text-center">
                <h3 className="font-medium">Gmail</h3>
                <p className="text-sm text-muted-foreground">
                  If your email address<br />is provided by Google
                </p>
              </div>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Button 
              variant="ghost" 
              className="w-full h-full flex flex-col items-center space-y-4"
              onClick={() => window.location.href = "/api/auth/microsoft"}
            >
              <img src="/outlook-icon.svg" alt="Outlook" className="w-12 h-12" />
              <div className="text-center">
                <h3 className="font-medium">Outlook</h3>
                <p className="text-sm text-muted-foreground">
                  If your email service is<br />provided by Microsoft
                </p>
                <p className="text-xs text-muted-foreground">(this includes Hotmail)</p>
              </div>
            </Button>
          </Card>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm">Using another email provider?</p>
            <Button 
              variant="link" 
              className="text-sm"
              onClick={() => window.location.href = "/join-waitlist"}
            >
              Join our waitlist
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Bulletproof currently works with Gmail and Outlook.
          </p>
        </div>
      </div>
    </div>
  );
}
