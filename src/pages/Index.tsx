import { Activity, Box, LogOut, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardMetric } from "@/components/DashboardMetric";
import { InventoryTable } from "@/components/InventoryTable";
import { StatusOverview } from "@/components/StatusOverview";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const fetchSuppliers = async () => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

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

  const { data: suppliers, isLoading, error } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading suppliers</div>;
  }

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
              Parts Overview
            </h2>
            <InventoryTable items={suppliers || []} />
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