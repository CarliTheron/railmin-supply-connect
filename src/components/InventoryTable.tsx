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
import { Edit } from "lucide-react";
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

  const formatCost = (cost: string | null): string => {
    if (!cost) return "0.00";
    const numCost = parseFloat(cost);
    return isNaN(numCost) ? "0.00" : numCost.toFixed(2);
  };

  const handleSave = async (updatedItem: InventoryItem) => {
    try {
      let error;
      if (updatedItem.itemcode) {
        const { error: invError } = await supabase
          .from("inventory")
          .update({
            itemcode: updatedItem.itemcode,
            itemdescription: updatedItem.itemdescription,
          })
          .eq("itemcode", updatedItem.id);
        error = invError;
      } else {
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

  const handleEditFieldChange = (field: keyof InventoryItem, value: string) => {
    if (editItem) {
      setEditItem({ ...editItem, [field]: value });
    }
  };

  const isInventoryTable = items.some((item) => "itemcode" in item);
  const isWheelMotorTable = items.some((item) => "Item" in item);

  return (
    <div className="space-y-4">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        uniqueCountries={uniqueCountries}
        showCountryFilter={!isInventoryTable}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {isInventoryTable ? (
                <>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Description</TableHead>
                </>
              ) : isWheelMotorTable ? (
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
                ) : isWheelMotorTable ? (
                  <>
                    <TableCell className="font-medium">{item.country}</TableCell>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditDialog
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        item={editItem}
        onSave={handleSave}
        onChange={handleEditFieldChange}
        isInventoryTable={isInventoryTable}
      />
    </div>
  );
}
