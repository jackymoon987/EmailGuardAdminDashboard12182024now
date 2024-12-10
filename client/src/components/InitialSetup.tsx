import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { useState } from "react";

type DefaultValue = "yes" | "no" | "later";

interface InitialSetupProps {
  onComplete: (settings: {
    surveyEmailDefault: DefaultValue;
    evaluatingFolderDefault: DefaultValue;
  }) => void;
  onReviewSenders: () => void;
}

export function InitialSetup({ onComplete, onReviewSenders }: InitialSetupProps) {
  const [surveyEmailDefault, setSurveyEmailDefault] = useState<DefaultValue>("no"); // Default to "no" (Turn it off)
  const [evaluatingFolderDefault, setEvaluatingFolderDefault] = useState<DefaultValue>("yes"); // Default to "yes" (Leave it on)

  const handleComplete = (reviewNow: boolean) => {
    // Save the user's preferences
    onComplete({
      surveyEmailDefault,
      evaluatingFolderDefault,
    });
    
    // If they want to review senders now, redirect them
    if (reviewNow) {
      onReviewSenders();
    }
  };

  // Handle evaluating folder change with automatic survey email update
  const handleEvaluatingFolderChange = (value: DefaultValue) => {
    setEvaluatingFolderDefault(value);
    // If turning off evaluating folder, automatically turn off survey email
    if (value === "no") {
      setSurveyEmailDefault("no");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center mb-2">
            Initial Setup for Company Settings
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Let's configure some default settings for your company
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="font-medium text-lg">Step 1: Survey Email Default Setting</h3>
              <RadioGroup
                defaultValue="no"
                value={surveyEmailDefault}
                onValueChange={(value) => setSurveyEmailDefault(value as DefaultValue)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="survey-no" />
                  <Label htmlFor="survey-no">Turn it off</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="survey-yes" />
                  <Label htmlFor="survey-yes">Leave it on</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="later" id="survey-later" />
                  <Label htmlFor="survey-later">Decide later</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-lg">Step 2: Evaluating Folder Default Setting</h3>
              <RadioGroup
                defaultValue="yes"
                value={evaluatingFolderDefault}
                onValueChange={(value) => handleEvaluatingFolderChange(value as DefaultValue)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="folder-no" />
                  <Label htmlFor="folder-no">Turn it off</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="folder-yes" />
                  <Label htmlFor="folder-yes">Leave it on</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="later" id="folder-later" />
                  <Label htmlFor="folder-later">Decide later</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-lg">Step 3: Approved Sender List</h3>
              <p className="text-sm text-muted-foreground">
                Would you like to review and configure your company's approved sender list now?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => handleComplete(true)} className="flex-1">
                  Review now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleComplete(false)} 
                  className="flex-1"
                >
                  Add later
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-lg">Step 4: Invite Your Teammates</h3>
              <p className="text-sm text-muted-foreground">
                Would you like to invite your team members to join your company's email filtering system?
              </p>
              <Input
                type="email"
                placeholder="Enter email addresses (separated by commas)"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-2xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => handleComplete(false)} 
          className="flex-1"
        >
          Do later
        </Button>
        <Button 
          onClick={() => handleComplete(true)} 
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
