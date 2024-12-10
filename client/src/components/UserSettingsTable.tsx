import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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

export function UserSettingsTable({ settings = dummySettings }: UserSettingsTableProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: number; field: 'surveyEmail' | 'evaluatingFolder'; value: boolean }) => {
      const res = await fetch(`/api/user-settings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      if (!res.ok) throw new Error('Failed to update user settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email Address</TableHead>
          <TableHead>Survey Email</TableHead>
          <TableHead>Evaluating Folder</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {settings.map((setting) => (
          <TableRow key={setting.id}>
            <TableCell>{setting.email}</TableCell>
            <TableCell>
              <Switch
                checked={setting.surveyEmail}
                onCheckedChange={(checked) => 
                  toggleMutation.mutate({ id: setting.id, field: 'surveyEmail', value: checked })
                }
              />
            </TableCell>
            <TableCell>
              <Switch
                checked={setting.evaluatingFolder}
                onCheckedChange={(checked) => 
                  toggleMutation.mutate({ id: setting.id, field: 'evaluatingFolder', value: checked })
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
