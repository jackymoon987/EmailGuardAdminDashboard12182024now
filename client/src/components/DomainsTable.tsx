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

type Domain = {
  id: number;
  domain: string;
  approved: boolean;
};

const dummyData: Domain[] = [
  { id: 1, domain: "@apple.com", approved: true },
  { id: 2, domain: "@google.com", approved: true },
  { id: 3, domain: "@microsoft.com", approved: true },
  { id: 4, domain: "@amazon.com", approved: false },
  { id: 5, domain: "@salesforce.com", approved: true },
  { id: 6, domain: "@facebook.com", approved: false },
  { id: 7, domain: "@netflix.com", approved: true },
  { id: 8, domain: "@adobe.com", approved: true },
  { id: 9, domain: "@twitter.com", approved: false },
  { id: 10, domain: "@linkedin.com", approved: true },
];

export function DomainsTable() {
  const [domains, setDomains] = useState(dummyData);

  const toggleApproval = (id: number) => {
    setDomains(current =>
      current.map(domain =>
        domain.id === id
          ? { ...domain, approved: !domain.approved }
          : domain
      )
    );
  };

  const deleteDomain = (id: number) => {
    setDomains(current => current.filter(domain => domain.id !== id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {domains.map((domain) => (
          <TableRow key={domain.id}>
            <TableCell>{domain.domain}</TableCell>
            <TableCell>
              <RadioGroup
                defaultValue={domain.approved ? "approved" : "blocked"}
                onValueChange={(value) => toggleApproval(domain.id)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approved" id={`approved-${domain.id}`} />
                  <Label htmlFor={`approved-${domain.id}`}>Approved</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blocked" id={`blocked-${domain.id}`} />
                  <Label htmlFor={`blocked-${domain.id}`}>Blocked</Label>
                </div>
              </RadioGroup>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteDomain(domain.id)}
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
