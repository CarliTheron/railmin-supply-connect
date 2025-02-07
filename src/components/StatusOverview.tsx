import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface StatusItem {
  id: number;
  user_email: string;
  status: string;
  description: string | null;
  last_update: string | null;
  table_name: string | null;
}

interface StatusOverviewProps {
  items?: StatusItem[];
}

export function StatusOverview({ items: propItems }: StatusOverviewProps) {
  const { session } = useAuth();
  const currentUserEmail = session?.user?.email;

  const { data: activityItems, isLoading } = useQuery({
    queryKey: ['user-activity', currentUserEmail],
    queryFn: async () => {
      console.log('Fetching user activity for:', currentUserEmail);
      
      if (!currentUserEmail) {
        console.log('No user email found in session');
        return [];
      }

      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_email', currentUserEmail)
        .order('last_update', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching user activity:', error);
        throw error;
      }

      console.log('Fetched user activity:', data);
      return data as StatusItem[];
    },
    enabled: !!currentUserEmail,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
      case "updated":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "deleted":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-industrial-800">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">Loading activity...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-industrial-800">
          Recent Activity for {currentUserEmail}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityItems && activityItems.length > 0 ? (
            activityItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-industrial-100 pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium text-industrial-700">
                    {item.table_name} {item.description}
                  </p>
                  <p className="text-sm text-industrial-500">
                    {item.last_update ? new Date(item.last_update).toLocaleString() : 'No date'}
                  </p>
                </div>
                <Badge className={cn("ml-2", getStatusColor(item.status))}>
                  {item.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No recent activity for {currentUserEmail}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}