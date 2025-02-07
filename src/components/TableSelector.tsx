import { Button } from "@/components/ui/button";
import { Package, Box } from "lucide-react";

interface TableSelectorProps {
  onTableChange: (table: 'suppliers' | 'inventory' | 'wheelmotor') => void;
  currentTable: string;
  metrics: {
    shipments: number;
    orders: number;
  };
}

export function TableSelector({ onTableChange, currentTable, metrics }: TableSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Button
        variant={currentTable === 'inventory' ? 'default' : 'outline'}
        className="h-24 flex-col space-y-2"
        onClick={() => onTableChange('inventory')}
      >
        <Package className="h-5 w-5" />
        <div className="space-y-1">
          <p className="text-2xl font-bold">{metrics.shipments}</p>
          <p className="text-xs text-muted-foreground">Inventory Items</p>
        </div>
      </Button>
      <Button
        variant={currentTable === 'wheelmotor' ? 'default' : 'outline'}
        className="h-24 flex-col space-y-2"
        onClick={() => onTableChange('wheelmotor')}
      >
        <Box className="h-5 w-5" />
        <div className="space-y-1">
          <p className="text-2xl font-bold">{metrics.orders}</p>
          <p className="text-xs text-muted-foreground">Active Orders</p>
        </div>
      </Button>
    </div>
  );
}