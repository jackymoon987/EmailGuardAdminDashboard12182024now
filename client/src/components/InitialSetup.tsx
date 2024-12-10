import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  const [surveyEmailDefault, setSurveyEmailDefault] = useState<DefaultValue>("yes"); // Default to "yes"
  const [evaluatingFolderDefault, setEvaluatingFolderDefault] = useState<DefaultValue>("no"); // Default to "no"

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center mb-2">
            Initial Setup
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Let's configure some default settings for your email filtering system
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Survey Email Default Setting</h3>
              <RadioGroup
                defaultValue="yes"
                value={surveyEmailDefault}
                onValueChange={(value) => setSurveyEmailDefault(value as DefaultValue)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="survey-yes" />
                  <Label htmlFor="survey-yes">Yes, turn on by default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="survey-no" />
                  <Label htmlFor="survey-no">No, keep it turned off</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="later" id="survey-later" />
                  <Label htmlFor="survey-later">Decide later</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Evaluating Folder Default Setting</h3>
              <RadioGroup
                defaultValue="no"
                value={evaluatingFolderDefault}
                onValueChange={(value) => setEvaluatingFolderDefault(value as DefaultValue)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="folder-yes" />
                  <Label htmlFor="folder-yes">Yes, turn on by default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="folder-no" />
                  <Label htmlFor="folder-no">No, keep it turned off</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="later" id="folder-later" />
                  <Label htmlFor="folder-later">Decide later</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Company-wide Approved Sender List</h3>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
