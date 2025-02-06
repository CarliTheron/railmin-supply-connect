import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  // Get unique countries for filter dropdown
  const uniqueCountries = Array.from(new Set(items.map((item) => item.country).filter(Boolean)));

  // Filter items based on search term and selected country
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = !selectedCountry || item.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
  };

  const handleSave = (updatedItem: InventoryItem) => {
    // Here you would typically make an API call to update the item
    console.log("Saving updated item:", updatedItem);
    toast({
      title: "Success",
      description: "Item updated successfully",
    });
    setEditItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedCountry}
          onValueChange={setSelectedCountry}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Countries</SelectItem>
            {uniqueCountries.map((country) => (
              <SelectItem key={country} value={country || ""}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.partNumber}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.totalCost?.toFixed(2)}</TableCell>
                <TableCell>{item.country}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Part</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="partNumber">Part Number</Label>
                          <Input
                            id="partNumber"
                            defaultValue={item.partNumber}
                            onChange={(e) =>
                              setEditItem(prev => ({
                                ...prev!,
                                partNumber: e.target.value
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            defaultValue={item.description}
                            onChange={(e) =>
                              setEditItem(prev => ({
                                ...prev!,
                                description: e.target.value
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="totalCost">Total Cost</Label>
                          <Input
                            id="totalCost"
                            type="number"
                            defaultValue={item.totalCost}
                            onChange={(e) =>
                              setEditItem(prev => ({
                                ...prev!,
                                totalCost: parseFloat(e.target.value)
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            defaultValue={item.country}
                            onChange={(e) =>
                              setEditItem(prev => ({
                                ...prev!,
                                country: e.target.value
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => handleSave(editItem!)}>
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}