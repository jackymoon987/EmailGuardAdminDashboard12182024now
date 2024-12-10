import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Dummy data type for user settings
type UserSetting = {
  id: number;
  email: string;
  surveyEmail: boolean;
  evaluatingFolder: boolean;
};

const dummySettings: UserSetting[] = [
  { id: 1, email: "john.doe@company.com", surveyEmail: true, evaluatingFolder: false },
  { id: 2, email: "sarah.smith@company.com", surveyEmail: false, evaluatingFolder: true },
  { id: 3, email: "michael.brown@company.com", surveyEmail: true, evaluatingFolder: true },
  { id: 4, email: "emily.wilson@company.com", surveyEmail: false, evaluatingFolder: false },
  { id: 5, email: "david.miller@company.com", surveyEmail: true, evaluatingFolder: false },
  { id: 6, email: "lisa.taylor@company.com", surveyEmail: false, evaluatingFolder: true },
  { id: 7, email: "james.anderson@company.com", surveyEmail: true, evaluatingFolder: true },
  { id: 8, email: "jessica.thomas@company.com", surveyEmail: false, evaluatingFolder: false },
  { id: 9, email: "robert.martin@company.com", surveyEmail: true, evaluatingFolder: true },
  { id: 10, email: "amanda.white@company.com", surveyEmail: false, evaluatingFolder: true }
];

interface UserSettingsTableProps {
  settings?: UserSetting[];
}

export function UserSettingsTable({ settings: initialSettings = dummySettings }: UserSettingsTableProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [settings, setSettings] = useState(initialSettings);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const toggleMutation = useMutation({
    mutationFn: async ({ ids, field, value }: { ids: number[]; field: 'surveyEmail' | 'evaluatingFolder'; value: boolean }) => {
      // For demo purposes, we'll just update the state locally
      // In a real application, this would make an API call
      return { success: true };
    },
    onSuccess: () => {
      // Update the local state to reflect the changes
      setSettings(currentSettings => 
        currentSettings.map(setting => {
          if (selectedUsers.includes(setting.id)) {
            return {
              ...setting,
              [field]: value
            };
          }
          return setting;
        })
      );
      
      toast({
        title: "Success",
        description: "User settings updated successfully"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user settings"
      });
    }
  });

  const toggleAll = (checked: boolean) => {
    setSelectedUsers(checked ? settings.map(s => s.id) : []);
  };

  const toggleUser = (userId: number, checked: boolean) => {
    setSelectedUsers(prev => 
      checked 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };

  const handleBatchToggle = (field: 'surveyEmail' | 'evaluatingFolder', value: boolean) => {
    if (selectedUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one user"
      });
      return;
    }
    toggleMutation.mutate({ ids: selectedUsers, field, value });
  };

  return (
    <div className="space-y-4">
      {selectedUsers.length > 0 && (
        <div className="flex gap-4 items-center bg-muted p-4 rounded-md">
          <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Survey Email:</span>
              <Button size="sm" onClick={() => handleBatchToggle('surveyEmail', true)}>Enable</Button>
              <Button size="sm" variant="outline" onClick={() => handleBatchToggle('surveyEmail', false)}>Disable</Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Evaluating Folder:</span>
              <Button size="sm" onClick={() => handleBatchToggle('evaluatingFolder', true)}>Enable</Button>
              <Button size="sm" variant="outline" onClick={() => handleBatchToggle('evaluatingFolder', false)}>Disable</Button>
            </div>
          </div>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedUsers.length === settings.length}
                onCheckedChange={(checked) => toggleAll(checked as boolean)}
              />
            </TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Survey Email</TableHead>
            <TableHead>Evaluating Folder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(setting.id)}
                  onCheckedChange={(checked) => toggleUser(setting.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>{setting.email}</TableCell>
              <TableCell>
                <Switch
                  checked={setting.surveyEmail}
                  onCheckedChange={(checked) => 
                    toggleMutation.mutate({ ids: [setting.id], field: 'surveyEmail', value: checked })
                  }
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={setting.evaluatingFolder}
                  onCheckedChange={(checked) => 
                    toggleMutation.mutate({ ids: [setting.id], field: 'evaluatingFolder', value: checked })
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
