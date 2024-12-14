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
    overrideSettings: "all" | "some";
    overrideUsers: string;
  }) => Promise<void> | void;
  onReviewSenders: () => void;
}

export function InitialSetup({ onComplete, onReviewSenders }: InitialSetupProps) {
  const [surveyEmailDefault, setSurveyEmailDefault] = useState<DefaultValue>("no");
  const [evaluatingFolderDefault, setEvaluatingFolderDefault] = useState<DefaultValue>("yes");
  const [overrideSettings, setOverrideSettings] = useState<"all" | "some">("all");
  const [overrideUsers, setOverrideUsers] = useState<string>("");

  const handleComplete = () => {
    onComplete({
      surveyEmailDefault,
      evaluatingFolderDefault,
      overrideSettings,
      overrideUsers: overrideSettings === "some" ? overrideUsers : "",
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
              Let's configure some default settings for your company
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 1: Survey Email Default Setting</h3>
                <div className="pl-4 space-y-4">
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
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 2: Evaluating Folder Default Setting</h3>
                <div className="pl-4 space-y-4">
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
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 3: Set User Override Settings</h3>
                <div className="pl-4 space-y-4">
                  <RadioGroup
                    defaultValue="all"
                    value={overrideSettings}
                    onValueChange={(value) => setOverrideSettings(value as "all" | "some")}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="override-all" />
                      <Label htmlFor="override-all">All users can override the above settings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="some" id="override-some" />
                      <Label htmlFor="override-some">Only some users can override the above settings</Label>
                    </div>
                  </RadioGroup>
                  
                  {overrideSettings === "some" && (
                    <div className="space-y-2">
                      <Label htmlFor="override-users">Enter email addresses (separated by commas)</Label>
                      <Input
                        id="override-users"
                        type="text"
                        value={overrideUsers}
                        onChange={(e) => setOverrideUsers(e.target.value)}
                        placeholder="user1@example.com, user2@example.com"
                      />
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Save the override users
                          onComplete({
                            surveyEmailDefault,
                            evaluatingFolderDefault,
                            overrideSettings,
                            overrideUsers,
                          });
                        }}
                        className="w-full mt-2"
                      >
                        Save Override Users
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 4: Add domains to your company wide Approved Sender List</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We highly recommend you take a few minutes now to approve your clients & venders. You can also block the most annoying companies that email your employees.
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
                <h3 className="text-lg font-medium">Step 5: Add Additional Administrators</h3>
                <p className="text-sm text-muted-foreground">
                  Inputting the addresses below will give them administrative permissions when they create their account. You can always change this later.
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
