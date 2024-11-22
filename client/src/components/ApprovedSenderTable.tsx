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

const dummyData = [
  { id: 1, domain: "google.com", active: Math.random() < 0.7, dateAdded: "2024-03-15", emailsReceived: 15234 },
  { id: 2, domain: "microsoft.com", active: Math.random() < 0.7, dateAdded: "2024-02-28", emailsReceived: 12567 },
  { id: 3, domain: "apple.com", active: Math.random() < 0.7, dateAdded: "2024-03-01", emailsReceived: 8943 },
  { id: 4, domain: "amazon.com", active: Math.random() < 0.7, dateAdded: "2024-03-10", emailsReceived: 7821 },
  { id: 5, domain: "github.com", active: Math.random() < 0.7, dateAdded: "2024-02-15", emailsReceived: 6543 },
  { id: 6, domain: "linkedin.com", active: Math.random() < 0.7, dateAdded: "2024-01-20", emailsReceived: 4321 },
  { id: 7, domain: "salesforce.com", active: Math.random() < 0.7, dateAdded: "2024-03-05", emailsReceived: 3876 },
  { id: 8, domain: "dropbox.com", active: Math.random() < 0.7, dateAdded: "2024-02-10", emailsReceived: 2987 },
  { id: 9, domain: "slack.com", active: Math.random() < 0.7, dateAdded: "2024-03-12", emailsReceived: 2654 },
  { id: 10, domain: "zoom.us", active: Math.random() < 0.7, dateAdded: "2024-01-30", emailsReceived: 1987 }
];

interface ApprovedSenderTableProps {
  senders?: ApprovedSender[];
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
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {senders.map((sender) => (
          <TableRow key={sender.id}>
            <TableCell className="font-medium">{sender.domain}</TableCell>
            <TableCell>{sender.active ? 'Active' : 'Inactive'}</TableCell>
            <TableCell>{new Date(sender.dateAdded).toLocaleDateString()}</TableCell>
            <TableCell>{sender.emailsReceived.toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={sender.active ? "default" : "outline"}
                  onClick={() => toggleMutation.mutate({ id: sender.id!, active: true })}
                >
                  Approved
                </Button>
                <Button 
                  size="sm" 
                  variant={!sender.active ? "destructive" : "outline"}
                  onClick={() => toggleMutation.mutate({ id: sender.id!, active: false })}
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
