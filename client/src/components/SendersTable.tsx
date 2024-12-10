import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Sender = {
  id: number;
  name: string;
  email: string;
  approved: boolean;
};

const dummyData: Sender[] = [
  { id: 1, name: "John Smith", email: "john.smith@apple.com", approved: true },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@google.com", approved: false },
  { id: 3, name: "Michael Chen", email: "mchen@microsoft.com", approved: true },
  { id: 4, name: "Emma Wilson", email: "emma.wilson@amazon.com", approved: true },
  { id: 5, name: "David Brown", email: "dbrown@salesforce.com", approved: false },
  { id: 6, name: "Lisa Anderson", email: "lisa.a@facebook.com", approved: true },
  { id: 7, name: "James Taylor", email: "jtaylor@netflix.com", approved: false },
  { id: 8, name: "Anna White", email: "awhite@adobe.com", approved: true },
  { id: 9, name: "Robert Lee", email: "rlee@twitter.com", approved: true },
  { id: 10, name: "Maria Garcia", email: "mgarcia@linkedin.com", approved: false },
];

export function SendersTable() {
  const [senders, setSenders] = useState(dummyData);

  const toggleApproval = (id: number) => {
    setSenders(current =>
      current.map(sender =>
        sender.id === id
          ? { ...sender, approved: !sender.approved }
          : sender
      )
    );
  };

  const deleteSender = (id: number) => {
    setSenders(current => current.filter(sender => sender.id !== id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {senders.map((sender) => (
          <TableRow key={sender.id}>
            <TableCell>{sender.name}</TableCell>
            <TableCell>{sender.email}</TableCell>
            <TableCell>
              <RadioGroup
                defaultValue={sender.approved ? "approved" : "blocked"}
                onValueChange={(value) => toggleApproval(sender.id)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approved" id={`approved-${sender.id}`} />
                  <Label htmlFor={`approved-${sender.id}`}>Approved</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blocked" id={`blocked-${sender.id}`} />
                  <Label htmlFor={`blocked-${sender.id}`}>Blocked</Label>
                </div>
              </RadioGroup>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteSender(sender.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
