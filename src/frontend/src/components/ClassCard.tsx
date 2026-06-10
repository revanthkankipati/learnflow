import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Class } from "@/types";
import { BookOpen, Users } from "lucide-react";

interface ClassCardProps {
  cls: Class;
  index: number;
  studentCount?: number;
  onClick?: () => void;
}

export function ClassCard({
  cls,
  index,
  studentCount,
  onClick,
}: ClassCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border"
      onClick={onClick}
      data-ocid={`class.item.${index}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {cls.section}
          </Badge>
        </div>
        <h3 className="font-semibold text-foreground">{cls.name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{cls.subject}</p>
        {studentCount !== undefined && (
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{studentCount} students</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
