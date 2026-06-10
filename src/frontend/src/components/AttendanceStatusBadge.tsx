import { AttendanceStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

export function AttendanceStatusBadge({
  status,
  className,
}: AttendanceStatusBadgeProps) {
  const isPresent = status === AttendanceStatus.Present;
  return (
    <Badge
      className={className}
      variant={isPresent ? "default" : "destructive"}
      data-ocid={isPresent ? "badge.present" : "badge.absent"}
    >
      {isPresent ? "Present" : "Absent"}
    </Badge>
  );
}
