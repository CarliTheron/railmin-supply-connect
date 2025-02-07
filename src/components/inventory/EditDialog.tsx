import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
  onChange: (field: keyof InventoryItem, value: string) => void;
  isInventoryTable: boolean;
}

export function EditDialog({
  isOpen,
  onClose,
  item,
  onSave,
  onChange,
  isInventoryTable,
}: EditDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  onChange={(e) => onChange("itemcode", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="itemDescription">Description</Label>
                <Input
                  id="itemDescription"
                  defaultValue={item.itemdescription || ""}
                  onChange={(e) => onChange("itemdescription", e.target.value)}
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
                  onChange={(e) => onChange("part_number", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  defaultValue={item.description || ""}
                  onChange={(e) => onChange("description", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalCost">Total Cost</Label>
                <Input
                  id="totalCost"
                  type="number"
                  defaultValue={item.total_cost || "0"}
                  onChange={(e) => onChange("total_cost", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  defaultValue={item.country || ""}
                  onChange={(e) => onChange("country", e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onSave(item)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}