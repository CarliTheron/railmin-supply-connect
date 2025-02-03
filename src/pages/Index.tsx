import { Activity, Box, LogOut, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardMetric } from "@/components/DashboardMetric";
import { InventoryTable } from "@/components/InventoryTable";
import { StatusOverview } from "@/components/StatusOverview";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const mockInventoryData = [
  {
    id: "1",
    name: "Railway Track Segments",
    quantity: 250,
    status: "In Stock" as const,
    location: "Warehouse A",
    lastUpdated: "2024-04-10",
  },
  {
    id: "2",
    name: "Mining Equipment Parts",
    quantity: 15,
    status: "Low Stock" as const,
    location: "Warehouse B",
    lastUpdated: "2024-04-09",
  },
  {
    id: "3",
    name: "Safety Equipment",
    quantity: 0,
    status: "Out of Stock" as const,
    location: "Warehouse C",
    lastUpdated: "2024-04-08",
  },
];

const mockStatusData = [
  {
    id: "1",
    name: "Main Railway Line",
    status: "Operational" as const,
    lastUpdate: "5 minutes ago",
  },
  {
    id: "2",
    name: "Mining Equipment",
    status: "Warning" as const,
    lastUpdate: "15 minutes ago",
  },
  {
    id: "3",
    name: "Supply Chain Network",
    status: "Operational" as const,
    lastUpdate: "1 hour ago",
  },
];

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardMetric
            title="Total Shipments"
            value="1,234"
            icon={<Truck className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardMetric
            title="Active Orders"
            value="56"
            icon={<Box className="h-4 w-4" />}
            trend={{ value: 5, isPositive: true }}
          />
          <DashboardMetric
            title="Equipment Utilization"
            value="85%"
            icon={<Activity className="h-4 w-4" />}
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-industrial-800">
              Inventory Overview
            </h2>
            <InventoryTable items={mockInventoryData} />
          </div>
          <div>
            <StatusOverview items={mockStatusData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
