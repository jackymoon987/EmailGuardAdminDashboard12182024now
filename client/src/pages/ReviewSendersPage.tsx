import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Sender {
  domain: string;
  emailCount: number;
  lastEmailDate: string;
  subject: string;
}

export default function ReviewSendersPage() {
  // Placeholder data - this would typically come from an API
  const senders: Sender[] = [
    {
      domain: "@tidnewsletter.com",
      emailCount: 1,
      lastEmailDate: "2024-12-09",
      subject: "ai/ml image generator 🎨 openai's reinforcement fine-tuning 🤖 microsoft trolls..."
    },
    {
      domain: "@thehustle.co",
      emailCount: 1,
      lastEmailDate: "2024-12-08",
      subject: "the one store that will always be at the mall"
    },
    {
      domain: "@clouding.net",
      emailCount: 1,
      lastEmailDate: "2024-12-07",
      subject: "backup your gmail to google sheets ↗️"
    },
    {
      domain: "@stripe.com",
      emailCount: 1,
      lastEmailDate: "2024-12-06",
      subject: "test - new invoice..."
    },
    {
      domain: "@devlaunchers.com",
      emailCount: 1,
      lastEmailDate: "2024-12-04",
      subject: "new domain tiers #2"
    },
    {
      domain: "@google.com",
      emailCount: 1,
      lastEmailDate: "2024-12-03",
      subject: "security alert"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Review senders</h1>
        <p className="text-muted-foreground">{window.location.hostname}@gmail.com</p>
        
        <div className="space-y-4">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4">
              <h2 className="text-lg font-medium">Add to your approved sender list</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Approve the domains (websites) you want to receive emails from. Block ones you don't.
                <br />
                You can also skip any domains you aren't sure about and decide on them later.{" "}
                <Button variant="link" className="p-0 h-auto text-sm">Learn more</Button>
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
                {senders.map((sender) => (
                  <TableRow key={sender.domain}>
                    <TableCell>{sender.domain}</TableCell>
                    <TableCell>{sender.emailCount}</TableCell>
                    <TableCell>{format(new Date(sender.lastEmailDate), 'MMM dd yyyy')}</TableCell>
                    <TableCell className="max-w-md truncate">{sender.subject}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="px-6">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="px-6">
                          Block
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button size="lg" className="px-8">
              Save preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
