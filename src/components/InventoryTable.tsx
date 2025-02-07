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
  total_cost: string | null;
  country: string | null;
  itemcode?: string;
  itemdescription?: string | null;
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
    const searchField = item.itemcode || item.part_number;
    const descriptionField = item.itemdescription || item.description;
    
    const matchesSearch =
      !searchTerm ||
      searchField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (descriptionField?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
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
      let error;
      if (updatedItem.itemcode) {
        // Handle inventory table update
        const { error: invError } = await supabase
          .from('inventory')
          .update({
            itemcode: updatedItem.itemcode,
            itemdescription: updatedItem.itemdescription,
          })
          .eq('itemcode', updatedItem.id);
        error = invError;
      } else {
        // Handle suppliers table update
        const { error: suppError } = await supabase
          .from('suppliers')
          .update({
            part_number: updatedItem.part_number,
            description: updatedItem.description,
            total_cost: updatedItem.total_cost,
            country: updatedItem.country,
          })
          .eq('id', updatedItem.id);
        error = suppError;
      }

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

  // Determine if we're showing inventory or suppliers/wheelmotor data
  const isInventoryTable = items.some(item => 'itemcode' in item);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        {!isInventoryTable && (
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
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {isInventoryTable ? (
                <>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Description</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Country</TableHead>
                </>
              )}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                {isInventoryTable ? (
                  <>
                    <TableCell className="font-medium">{item.itemcode}</TableCell>
                    <TableCell>{item.itemdescription}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{item.part_number}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>${formatCost(item.total_cost)}</TableCell>
                    <TableCell>{item.country}</TableCell>
                  </>
                )}
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
                        <DialogTitle>Edit Item</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {isInventoryTable ? (
                          <>
                            <div className="grid gap-2">
                              <Label htmlFor="itemCode">Item Code</Label>
                              <Input
                                id="itemCode"
                                defaultValue={item.itemcode}
                                onChange={(e) =>
                                  setEditItem(prev => ({
                                    ...prev!,
                                    itemcode: e.target.value
                                  }))
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="itemDescription">Description</Label>
                              <Input
                                id="itemDescription"
                                defaultValue={item.itemdescription || ""}
                                onChange={(e) =>
                                  setEditItem(prev => ({
                                    ...prev!,
                                    itemdescription: e.target.value
                                  }))
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
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