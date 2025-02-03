import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  location: string;
  lastUpdated: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border border-industrial-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-industrial-50">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}