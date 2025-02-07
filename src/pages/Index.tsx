import { Activity, Box, LogOut, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InventoryTable } from "@/components/InventoryTable";
import { StatusOverview } from "@/components/StatusOverview";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { TableSelector } from "@/components/TableSelector";
import { fetchInventory, fetchSuppliers, fetchWheelMotor } from "@/utils/tableData";
import { useState } from "react";

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTable, setCurrentTable] = useState<'suppliers' | 'inventory' | 'wheelmotor'>('suppliers');

  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  const { data: wheelMotor, isLoading: wheelMotorLoading } = useQuery({
    queryKey: ['wheelmotor'],
    queryFn: fetchWheelMotor,
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isLoading = suppliersLoading || inventoryLoading || wheelMotorLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getTableData = () => {
    switch (currentTable) {
      case 'inventory':
        return inventory?.map(item => ({
          id: item.itemcode,
          part_number: item.itemcode,
          description: item.itemdescription,
          total_cost: "0",
          country: null
        })) || [];
      case 'wheelmotor':
        return wheelMotor?.map(item => ({
          id: item.Item.toString(),
          part_number: item["PN#"] || "",
          description: item.Description || "",
          total_cost: "0",
          country: item.MFG
        })) || [];
      default:
        return suppliers || [];
    }
  };

  return (
    <div className="min-h-screen bg-industrial-50 p-6 animate-fade-in">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-industrial-900">
            Supply Chain Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session?.user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <TableSelector
          onTableChange={setCurrentTable}
          currentTable={currentTable}
          metrics={{
            shipments: inventory?.length || 0,
            orders: wheelMotor?.length || 0,
          }}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-industrial-800">
              {currentTable === 'inventory' ? 'Inventory' : 
               currentTable === 'wheelmotor' ? 'Wheel Motor' : 
               'Parts Overview'}
            </h2>
            <InventoryTable items={getTableData()} />
          </div>
          <div>
            <StatusOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;