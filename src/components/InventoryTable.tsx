
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./inventory/SearchBar";
import { EditDialog } from "./inventory/EditDialog";
import { InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const uniqueCountries = Array.from(
    new Set(items.map((item) => item.country).filter(Boolean))
  );

  const filteredItems = items.filter((item) => {
    const searchField = item.itemcode || item.part_number;
    const descriptionField = item.itemdescription || item.description;

    const matchesSearch =
      !searchTerm ||
      searchField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (descriptionField?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesCountry =
      selectedCountry === "all" || item.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
  };

  const handleDelete = async (item: InventoryItem) => {
    try {
      let error;
      if ("itemcode" in item) {
        const { error: invError } = await supabase
          .from("inventory")
          .delete()
          .eq("itemcode", item.id);
        error = invError;
      } else if ("MFG" in item) {
        const { error: wheelError } = await supabase
          .from("wheelmotor")
          .delete()
          .eq("PN#", item.part_number);
        error = wheelError;
      } else {
        const { error: suppError } = await supabase
          .from("suppliers")
          .delete()
          .eq("id", item.id);
        error = suppError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    const newItem: InventoryItem = {
      id: "",
      part_number: "",
      description: "",
      total_cost: "",
      country: "",
      itemcode: "",
      itemdescription: "",
    };
    setEditItem(newItem);
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
        if (!updatedItem.id) {
          // Insert new inventory item
          const { error: invError } = await supabase
            .from("inventory")
            .insert({
              itemcode: updatedItem.itemcode,
              itemdescription: updatedItem.itemdescription,
            });
          error = invError;
        } else {
          // Update existing inventory item
          const { error: invError } = await supabase
            .from("inventory")
            .update({
              itemcode: updatedItem.itemcode,
              itemdescription: updatedItem.itemdescription,
            })
            .eq("itemcode", updatedItem.id);
          error = invError;
        }
      } else {
        if (!updatedItem.id) {
          // Insert new supplier item
          const { error: suppError } = await supabase
            .from("suppliers")
            .insert({
              part_number: updatedItem.part_number,
              description: updatedItem.description,
              total_cost: updatedItem.total_cost,
              country: updatedItem.country,
            });
          error = suppError;
        } else {
          // Update existing supplier item
          const { error: suppError } = await supabase
            .from("suppliers")
            .update({
              part_number: updatedItem.part_number,
              description: updatedItem.description,
              total_cost: updatedItem.total_cost,
              country: updatedItem.country,
            })
            .eq("id", updatedItem.id);
          error = suppError;
        }
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: updatedItem.id ? "Item updated successfully" : "Item added successfully",
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

  const handleEditFieldChange = (field: keyof InventoryItem, value: string) => {
    if (editItem) {
      setEditItem({ ...editItem, [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          uniqueCountries={uniqueCountries}
          showCountryFilter={true}
        />
        <Button onClick={handleAdd} className="ml-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {"itemcode" in items[0] ? (
                <>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Description</TableHead>
                </>
              ) : "MFG" in items[0] ? (
                <>
                  <TableHead>MFG</TableHead>
                  <TableHead>PN#</TableHead>
                  <TableHead>Description</TableHead>
                </>
              ) : (
                <>
                  <TableHead>part_number</TableHead>
                  <TableHead>description</TableHead>
                  <TableHead>total_cost</TableHead>
                  <TableHead>country</TableHead>
                </>
              )}
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                {"itemcode" in item ? (
                  <>
                    <TableCell className="font-medium">{item.itemcode}</TableCell>
                    <TableCell>{item.itemdescription}</TableCell>
                  </>
                ) : "MFG" in item ? (
                  <>
                    <TableCell className="font-medium">{item.MFG}</TableCell>
                    <TableCell>{item.part_number}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">
                      {item.part_number}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>${formatCost(item.total_cost)}</TableCell>
                    <TableCell>{item.country}</TableCell>
                  </>
                )}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editItem && (
        <EditDialog
          isOpen={true}
          onClose={() => setEditItem(null)}
          item={editItem}
          onSave={handleSave}
          onChange={handleEditFieldChange}
          isInventoryTable={"itemcode" in editItem}
        />
      )}
    </div>
  );
}
