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
  }) => Promise<void> | void;
  onReviewSenders: () => void;
}

export function InitialSetup({ onComplete, onReviewSenders }: InitialSetupProps) {
  const [surveyEmailDefault, setSurveyEmailDefault] = useState<DefaultValue>("no");
  const [evaluatingFolderDefault, setEvaluatingFolderDefault] = useState<DefaultValue>("yes");

  const handleComplete = () => {
    onComplete({
      surveyEmailDefault,
      evaluatingFolderDefault,
    });
  };

  const handleReviewSenders = () => {
    onReviewSenders();
  };

  const handleEvaluatingFolderChange = (value: DefaultValue) => {
    setEvaluatingFolderDefault(value);
    if (value === "no") {
      setSurveyEmailDefault("no");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">
              Company Wide Settings
            </CardTitle>
            <p className="text-sm text-center text-muted-foreground">
              Are you setting up this account for personal use or for your business (ie- you need admin controls on employee accounts)?
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 1: Survey Email Default Setting</h3>
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
                    <Label htmlFor="survey-later">Let the user decide</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 2: Evaluating Folder Default Setting</h3>
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
                    <Label htmlFor="folder-later">Let the user decide</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 3: Approved Sender List</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how your company's approved sender list will be managed:
                </p>
                <RadioGroup
                  defaultValue="admin"
                  className="flex flex-col space-y-2 mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="sender-admin" />
                    <Label htmlFor="sender-admin">Managed by admin only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="sender-user" />
                    <Label htmlFor="sender-user">Let users manage their own lists</Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-muted-foreground mb-3">
                  Would you like to add some domains to your company wide approved sender list now?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleReviewSenders} className="flex-1">
                    Review now
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleComplete} 
                    className="flex-1"
                  >
                    Add later
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 4: Invite Your Teammates</h3>
                <p className="text-sm text-muted-foreground">
                  Would you like to add any other admins to your Bulletproof Inbox account?
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
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={handleComplete} 
            className="flex-1"
          >
            Do later
          </Button>
          <Button 
            onClick={handleComplete} 
            className="flex-1"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
