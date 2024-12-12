import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [bulkAction, setBulkAction] = useState<'approve' | 'block'>('approve');
  const [bulkDomains, setBulkDomains] = useState('');
  const [open, setOpen] = useState(false);

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

  const handleAddDomains = (domains: string, action: 'approve' | 'block') => {
    const domainList = domains.split('\n').map(domain => domain.trim()).filter(domain => domain !== '');
    domainList.forEach(domain => {
        if (action === 'approve') {
          handleApprove(domain);
        } else {
          handleBlock(domain);
        }
    })
    setOpen(false);
  }


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
      </div>

      <div className="max-w-lg p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
        <h3 className="font-semibold mb-2">Add Domains in Bulk</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Quickly add multiple domains at once.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Add Multiple Domains
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Multiple Domains</DialogTitle>
              <DialogDescription>
                Enter one domain per line. You can copy and paste multiple domains at once.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="example.com&#10;another-domain.com&#10;third-domain.com"
                value={bulkDomains}
                onChange={(e) => setBulkDomains(e.target.value)}
                className="min-h-[150px]"
              />
              <RadioGroup value={bulkAction} onValueChange={(value) => setBulkAction(value as 'approve' | 'block')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve">Approve all</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="block" id="block" />
                  <Label htmlFor="block">Block all</Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                // Handle bulk action here
                const domainList = bulkDomains.split('\n').map(domain => domain.trim()).filter(domain => domain !== '');
                domainList.forEach(domain => {
                  if (bulkAction === 'approve') {
                    handleApprove(domain);
                  } else {
                    handleBlock(domain);
                  }
                });
                toast({
                  title: "Domains " + (bulkAction === 'approve' ? 'approved' : 'blocked'),
                  description: `${domainList.length} domains have been ${bulkAction}d.`
                });
              }}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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