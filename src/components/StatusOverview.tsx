import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusItem {
  id: string;
  name: string;
  status: "Operational" | "Warning" | "Critical" | "Maintenance";
  lastUpdate: string;
}

interface StatusOverviewProps {
  items: StatusItem[];
}

export function StatusOverview({ items }: StatusOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "bg-green-100 text-green-800";
      case "Warning":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      case "Maintenance":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-industrial-800">
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-industrial-100 pb-2 last:border-0"
            >
              <div>
                <p className="font-medium text-industrial-700">{item.name}</p>
                <p className="text-sm text-industrial-500">{item.lastUpdate}</p>
              </div>
              <Badge className={cn("ml-2", getStatusColor(item.status))}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}