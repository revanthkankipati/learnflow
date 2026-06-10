import { Card, CardContent } from "@/components/ui/card";
import type { Student } from "@/types";
import { Hash, Mail } from "lucide-react";

interface StudentCardProps {
  student: Student;
  index: number;
  onClick?: () => void;
}

export function StudentCard({ student, index, onClick }: StudentCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border"
      onClick={onClick}
      data-ocid={`student.item.${index}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">
                {student.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Hash className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {student.rollNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="w-3 h-3" />
          <span className="truncate">{student.parentEmail}</span>
        </div>
      </CardContent>
    </Card>
  );
}
