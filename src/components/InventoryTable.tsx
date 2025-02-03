import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  location: string;
  lastUpdated: string;
  partNumber?: string;
  description?: string;
  totalCost?: number;
  country?: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className="rounded-md border border-industrial-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Number</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-industrial-50">
              <TableCell className="font-medium">{item.partNumber}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.totalCost}</TableCell>
              <TableCell>{item.country}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}