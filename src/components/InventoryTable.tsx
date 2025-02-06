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
import { supabase } from "@/integrations/supabase/client";

interface InventoryItem {
  id: string;
  part_number: string;
  description: string | null;
  total_cost: string | null;  // Changed to string to match DB type
  country: string | null;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  // Get unique countries for filter dropdown
  const uniqueCountries = Array.from(new Set(items.map((item) => item.country).filter(Boolean)));

  // Filter items based on search term and selected country
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === "all" || item.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
  };

  const formatCost = (cost: string | null): string => {
    if (!cost) return "0.00";
    const numCost = parseFloat(cost);
    return isNaN(numCost) ? "0.00" : numCost.toFixed(2);
  };

  const handleSave = async (updatedItem: InventoryItem) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({
          part_number: updatedItem.part_number,
          description: updatedItem.description,
          total_cost: updatedItem.total_cost,
          country: updatedItem.country,
        })
        .eq('id', updatedItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setEditItem(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
            <SelectItem value="all">All Countries</SelectItem>
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
                <TableCell className="font-medium">{item.part_number}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${formatCost(item.total_cost)}</TableCell>
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
                            defaultValue={item.part_number}
                            onChange={(e) =>
                              setEditItem(prev => ({
                                ...prev!,
                                part_number: e.target.value
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            defaultValue={item.description || ""}
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
                            defaultValue={formatCost(item.total_cost)}
                            onChange={(e) =>
                              setEditItem(prev => ({
                                ...prev!,
                                total_cost: e.target.value
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            defaultValue={item.country || ""}
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