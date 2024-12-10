import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { ApprovedSender } from "@db/schema";

// Extended dummy data type to include the new fields
type DummySender = {
  id: number;
  domain: string;
  active: boolean;
  dateAdded: string;
  emailsReceived: number;
  surveyMode: 'Active' | 'Passive';
  evaluatingFolder: string;
};

const dummyData: DummySender[] = [
  { id: 1, domain: "google.com", active: Math.random() < 0.7, dateAdded: "2024-03-15", emailsReceived: 15234, surveyMode: "Active", evaluatingFolder: "/inbox/primary" },
  { id: 2, domain: "microsoft.com", active: Math.random() < 0.7, dateAdded: "2024-02-28", emailsReceived: 12567, surveyMode: "Passive", evaluatingFolder: "/inbox/updates" },
  { id: 3, domain: "apple.com", active: Math.random() < 0.7, dateAdded: "2024-03-01", emailsReceived: 8943, surveyMode: "Active", evaluatingFolder: "/inbox/primary" },
  { id: 4, domain: "amazon.com", active: Math.random() < 0.7, dateAdded: "2024-03-10", emailsReceived: 7821, surveyMode: "Passive", evaluatingFolder: "/inbox/promotions" },
  { id: 5, domain: "github.com", active: Math.random() < 0.7, dateAdded: "2024-02-15", emailsReceived: 6543, surveyMode: "Active", evaluatingFolder: "/inbox/updates" },
  { id: 6, domain: "linkedin.com", active: Math.random() < 0.7, dateAdded: "2024-01-20", emailsReceived: 4321, surveyMode: "Active", evaluatingFolder: "/inbox/social" },
  { id: 7, domain: "salesforce.com", active: Math.random() < 0.7, dateAdded: "2024-03-05", emailsReceived: 3876, surveyMode: "Passive", evaluatingFolder: "/inbox/primary" },
  { id: 8, domain: "dropbox.com", active: Math.random() < 0.7, dateAdded: "2024-02-10", emailsReceived: 2987, surveyMode: "Active", evaluatingFolder: "/inbox/updates" },
  { id: 9, domain: "slack.com", active: Math.random() < 0.7, dateAdded: "2024-03-12", emailsReceived: 2654, surveyMode: "Passive", evaluatingFolder: "/inbox/primary" },
  { id: 10, domain: "zoom.us", active: Math.random() < 0.7, dateAdded: "2024-01-30", emailsReceived: 1987, surveyMode: "Active", evaluatingFolder: "/inbox/updates" }
];

interface ApprovedSenderTableProps {
  senders?: DummySender[];
}

export function ApprovedSenderTable({ senders = dummyData }: ApprovedSenderTableProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const res = await fetch(`/api/approved-senders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (!res.ok) throw new Error('Failed to update sender status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-senders'] });
      toast({
        title: "Success",
        description: "Sender status updated successfully"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update sender status"
      });
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead>Emails Received</TableHead>
          <TableHead>Survey Mode</TableHead>
          <TableHead>Evaluating Folder</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {senders.map((sender) => (
          <TableRow key={sender.id}>
            <TableCell className="font-medium">{sender.domain}</TableCell>
            <TableCell>{sender.active ? 'Active' : 'Inactive'}</TableCell>
            <TableCell>{new Date(sender.dateAdded).toLocaleDateString()}</TableCell>
            <TableCell>{sender.emailsReceived.toLocaleString()}</TableCell>
            <TableCell>{sender.surveyMode}</TableCell>
            <TableCell>{sender.evaluatingFolder}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={sender.active ? "default" : "outline"}
                  onClick={() => toggleMutation.mutate({ id: sender.id, active: true })}
                >
                  Approved
                </Button>
                <Button 
                  size="sm" 
                  variant={!sender.active ? "destructive" : "outline"}
                  onClick={() => toggleMutation.mutate({ id: sender.id, active: false })}
                >
                  Blocked
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
