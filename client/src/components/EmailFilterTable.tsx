import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { EmailFilter } from "@db/schema";

interface EmailFilterTableProps {
  filters: EmailFilter[];
}

export function EmailFilterTable({ filters }: EmailFilterTableProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const res = await fetch(`/api/filters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (!res.ok) throw new Error('Failed to update filter');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filters'] });
      toast({
        title: "Success",
        description: "Filter updated successfully"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update filter"
      });
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sender</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filters.map((filter) => (
          <TableRow key={filter.id}>
            <TableCell>{filter.sender}</TableCell>
            <TableCell>
              <Badge variant={filter.type === 'whitelist' ? 'default' : 'destructive'}>
                {filter.type}
              </Badge>
            </TableCell>
            <TableCell>{filter.active ? 'Active' : 'Inactive'}</TableCell>
            <TableCell>{new Date(filter.createdAt!).toLocaleDateString()}</TableCell>
            <TableCell>
              <Switch
                checked={filter.active}
                onCheckedChange={(checked) => 
                  toggleMutation.mutate({ id: filter.id!, active: checked })
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
