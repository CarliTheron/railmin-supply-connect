import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardMetricProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function DashboardMetric({
  title,
  value,
  icon,
  trend,
  className,
}: DashboardMetricProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-industrial-600">
          {title}
        </CardTitle>
        <div className="text-industrial-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-industrial-900">{value}</div>
        {trend && (
          <p
            className={cn(
              "mt-1 text-xs",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </p>
        )}
      </CardContent>
    </Card>
  );
}