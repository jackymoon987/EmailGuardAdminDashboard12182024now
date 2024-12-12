import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'domain' | 'sender';
  onSubmit: (entries: string[], action: 'approve' | 'block') => void;
}

export function AddFilterModal({
  open,
  onOpenChange,
  type,
  onSubmit
}: AddFilterModalProps) {
  const [entries, setEntries] = useState("");
  const [action, setAction] = useState<'approve' | 'block'>('approve');
  const { toast } = useToast();

  const handleSubmit = () => {
    const entryList = entries
      .split('\n')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (entryList.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter at least one entry"
      });
      return;
    }

    // Validate entries based on type
    const isValid = entryList.every(entry => {
      if (type === 'domain') {
        // Allow domain format with or without @ prefix
        const domain = entry.startsWith('@') ? entry.slice(1) : entry;
        return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domain);
      } else {
        // Validate email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry);
      }
    });

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Format",
        description: type === 'domain' 
          ? "Please enter valid domains (e.g., example.com or @example.com)"
          : "Please enter valid email addresses"
      });
      return;
    }

    // Format domains to always have @ prefix
    const formattedEntries = type === 'domain'
      ? entryList.map(entry => entry.startsWith('@') ? entry : `@${entry}`)
      : entryList;

    onSubmit(formattedEntries, action);
    setEntries("");
    setAction('approve');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add {type === 'domain' ? 'Domains' : 'Senders'}</DialogTitle>
          <DialogDescription>
            Enter one {type} per line. {type === 'domain' ? 'The @ prefix is optional for domains.' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={type === 'domain' ? "@example.com\n@company.org" : "user@example.com\nuser@company.org"}
            value={entries}
            onChange={(e) => setEntries(e.target.value)}
            className="min-h-[150px]"
          />
          
          <div className="space-y-2">
            <Label>Action</Label>
            <RadioGroup
              value={action}
              onValueChange={(value) => setAction(value as 'approve' | 'block')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approve" id="approve" />
                <Label htmlFor="approve">Approve</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="block" id="block" />
                <Label htmlFor="block">Block</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add {type === 'domain' ? 'Domains' : 'Senders'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
