import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EmailProviderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Get started</h1>
        <h2 className="text-lg text-center mb-2">To get started, sign in to your email</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">Select your email provider below.</p>

        <div className="grid gap-4">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border rounded-lg">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8">
                  <path fill="#EA4335" d="M24 12.276c0-.816-.067-1.636-.211-2.438H12.242v4.621h6.613c-.28 1.57-1.146 2.902-2.447 3.797v3.135h3.953c2.314-2.132 3.639-5.27 3.639-9.115z"/>
                  <path fill="#4285F4" d="M12.242 24c3.305 0 6.093-1.088 8.119-2.95l-3.953-3.135c-1.094.749-2.5 1.19-4.166 1.19-3.205 0-5.92-2.16-6.89-5.07H1.317v3.235C3.38 21.128 7.505 24 12.242 24z"/>
                  <path fill="#FBBC05" d="M5.352 14.035c-.247-.736-.386-1.523-.386-2.334 0-.81.139-1.598.386-2.334V6.132H1.317C.477 7.944 0 9.916 0 12c0 2.084.477 4.056 1.317 5.868l4.035-3.833z"/>
                  <path fill="#34A853" d="M12.242 4.796c1.807 0 3.428.622 4.709 1.843l3.508-3.508C18.356 1.213 15.568 0 12.242 0 7.505 0 3.38 2.872 1.317 6.73l4.035 3.833c.97-2.912 3.685-5.07 6.89-5.07z"/>
                </svg>
              </div>
              <h3 className="font-medium">Gmail</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                If your email address is provided by Google
              </p>
              <Button 
                className="mt-4 w-full"
                variant="outline"
                onClick={() => {
                  // After Google sign in, redirect to company settings
                  window.location.href = '/company-settings';
                }}
              >
                Sign in to Google
              </Button>
              <button className="text-xs text-muted-foreground mt-2 hover:underline cursor-help">
                Why do I need to sign in?
              </button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border rounded-lg">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8">
                  <path fill="#0078D4" d="M23.812 3.932l-6.188 3.932v4.992l6.188-3.932V3.932zM10.688 12.856V7.864L4.5 3.932v4.992l6.188 3.932zM23.812 14.916l-6.188 3.932v4.992l6.188-3.932v-4.992zM10.688 23.84v-4.992L4.5 14.916v4.992l6.188 3.932z"/>
                </svg>
              </div>
              <h3 className="font-medium">Outlook</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                If your email service is provided by Microsoft
                <br />(this includes Hotmail)
              </p>
              <Button 
                className="mt-4 w-full"
                variant="outline"
              >
                Sign in to Microsoft
              </Button>
              <button className="text-xs text-muted-foreground mt-2 hover:underline cursor-help">
                Why do I need to sign in?
              </button>
            </div>
          </Card>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
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
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="ghost"
            className="text-sm text-muted-foreground"
            onClick={() => window.location.href = '/settings'}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
