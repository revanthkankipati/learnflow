import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  accentColor?: "primary" | "accent" | "destructive" | "amber";
  ocid?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  accentColor = "primary",
  ocid,
}: StatCardProps) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    destructive: "bg-destructive/10 text-destructive",
    amber: "bg-amber/10 text-amber",
  };

  const trendColorMap = {
    up: "text-accent",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="border-border" data-ocid={ocid}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              colorMap[accentColor],
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground font-display mt-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trendLabel && (
          <p
            className={cn(
              "text-xs mt-1 font-medium",
              trend ? trendColorMap[trend] : "text-muted-foreground",
            )}
          >
            {trend === "up" && "↑ "}
            {trend === "down" && "↓ "}
            {trendLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
