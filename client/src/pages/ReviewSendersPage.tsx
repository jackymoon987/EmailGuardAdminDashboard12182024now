import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

type EmailSender = {
  domain: string;
  numberOfEmails: number;
  lastEmail: string;
  subject: string;
};

export default function ReviewSendersPage() {
  const { toast } = useToast();
  const [remainingSenders, setRemainingSenders] = useState(8);

  // Mock data for demonstration
  const mockSenders: EmailSender[] = [
    { domain: "@thehustle.co", numberOfEmails: 1, lastEmail: "Dec 08 2024", subject: "the one store that will always be at the mall" },
    { domain: "@clouding.net", numberOfEmails: 1, lastEmail: "Dec 07 2024", subject: "backup your gmail to google sheets" },
    { domain: "@stripe.com", numberOfEmails: 1, lastEmail: "Dec 06 2024", subject: "test - new invoice..." },
    { domain: "@devlaunchers.com", numberOfEmails: 1, lastEmail: "Dec 04 2024", subject: "new domain tiers #2" },
    { domain: "@google.com", numberOfEmails: 1, lastEmail: "Dec 03 2024", subject: "security alert" }
  ];

  const { data: senders, isLoading } = useQuery<EmailSender[]>({
    queryKey: ['review-senders'],
    queryFn: async () => {
      // In a real application, this would fetch from an API
      return mockSenders;
    }
  });

  const handleApprove = (domain: string) => {
    // Here you would make an API call to approve the sender
    toast({
      title: "Sender Approved",
      description: `${domain} has been added to your approved senders list.`
    });
    setRemainingSenders(prev => Math.max(0, prev - 1));
  };

  const handleBlock = (domain: string) => {
    // Here you would make an API call to block the sender
    toast({
      title: "Sender Blocked",
      description: `${domain} has been blocked.`
    });
    setRemainingSenders(prev => Math.max(0, prev - 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Add some domains to your company wide approved sender list.</h1>
        <p className="text-sm text-muted-foreground">{senders?.[0]?.domain}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm">
            Approve the domains (websites) you want your employees to receive emails from. Block the ones your employees don't need.
            <br />
            You can also skip any domains you aren't sure about and decide on them later.
            <button className="text-primary hover:underline ml-1">Learn more</button>
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain name</TableHead>
              <TableHead>Number of emails</TableHead>
              <TableHead>Last Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {senders?.map((sender) => (
              <TableRow key={sender.domain}>
                <TableCell>{sender.domain}</TableCell>
                <TableCell>{sender.numberOfEmails}</TableCell>
                <TableCell>{sender.lastEmail}</TableCell>
                <TableCell className="max-w-md truncate">{sender.subject}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={() => handleApprove(sender.domain)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                      onClick={() => handleBlock(sender.domain)}
                    >
                      Block
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{remainingSenders} remaining</span>
          <div className="flex gap-2">
            <Button variant="outline" className="w-32">What's a domain?</Button>
            <Button 
              className="w-32"
              onClick={() => {
                window.location.href = '/company-settings';
              }}
            >
              Save preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
