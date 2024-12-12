import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    referralEmail: "",
    accountType: "individual" as "individual" | "business"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields"
        });
        return;
      }

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save user information');
      }

      // Show success message and redirect
      toast({
        title: "Success",
        description: "Your information has been saved"
      });

      // Wait for toast to be visible then redirect
      // Use setLocation for client-side routing
      setLocation('/get-started');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save your information. Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Tell us about yourself</h1>
          <p className="text-sm text-muted-foreground mt-2">
            This info will be used to improve your experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Do you need an individual account or a business account?</h3>
              <RadioGroup
                value={formData.accountType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountType: value as "individual" | "business" }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">Business</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
                placeholder="Your first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
                placeholder="Your last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number (optional)</Label>
              <Input
                id="phoneNumber"
                type="tel"
                pattern="[0-9\-]+"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="xxx-xxx-xxxx"
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium">Did someone refer you?</h3>
              <p className="text-sm text-muted-foreground">
                Add their email address or promo code and you'll both get a month free!
              </p>
              <Input
                id="referralEmail"
                type="email"
                value={formData.referralEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, referralEmail: e.target.value }))}
                placeholder="john@email.com"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save & continue
          </Button>
        </form>
      </div>
    </div>
  );
}
