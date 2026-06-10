import type { AttendanceEntry } from "@/backend";
import { AttendanceStatus } from "@/backend";
import { AttendanceStatusBadge } from "@/components/AttendanceStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAttendanceByClassAndDate,
  useClassStudents,
  useMarkAttendance,
  useMyClasses,
} from "@/hooks/useQueries";
import {
  Calendar,
  CheckCircle2,
  Save,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function AttendancePage() {
  const { data: classes, isLoading: classesLoading } = useMyClasses();
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(todayStr());
  const { data: students, isLoading: studentsLoading } =
    useClassStudents(selectedClass);
  const { data: existing } = useAttendanceByClassAndDate(selectedClass, date);
  const markAttendance = useMarkAttendance();
  const [statusMap, setStatusMap] = useState<
    Record<string, "Present" | "Absent">
  >({});
  const [saved, setSaved] = useState(false);

  const selectedClassInfo = classes?.find((c) => c.id === selectedClass);

  const getStatus = (studentId: string): "Present" | "Absent" => {
    if (statusMap[studentId]) return statusMap[studentId];
    const rec = existing?.find((r) => r.studentId === studentId);
    if (rec)
      return rec.status === AttendanceStatus.Present ? "Present" : "Absent";
    return "Present";
  };

  const toggle = (studentId: string) => {
    setSaved(false);
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Absent" ? "Present" : "Absent",
    }));
  };

  const handleSave = async () => {
    if (!selectedClass || !students?.length) return;
    const entries: AttendanceEntry[] = students.map((s) => ({
      studentId: s.id,
      status:
        getStatus(s.id) === "Present"
          ? AttendanceStatus.Present
          : AttendanceStatus.Absent,
      note: undefined,
    }));
    try {
      await markAttendance.mutateAsync({
        classId: selectedClass,
        date,
        entries,
      });
      toast.success("Attendance saved successfully");
      setSaved(true);
      setStatusMap({});
    } catch {
      toast.error("Failed to save attendance");
    }
  };

  const presentCount =
    students?.filter((s) => getStatus(s.id) === "Present").length ?? 0;
  const absentCount =
    students?.filter((s) => getStatus(s.id) === "Absent").length ?? 0;

  return (
    <div className="space-y-6" data-ocid="attendance.page">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Attendance Marking
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mark daily attendance for your classes
          </p>
        </div>
        {selectedClass && students && students.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              {presentCount} Present
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
              {absentCount} Absent
            </span>
          </div>
        )}
      </div>

      {/* Class + Date selectors */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" /> Select Class &amp; Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label
                htmlFor="attendance-class"
                className="text-xs font-medium text-muted-foreground block mb-1.5"
              >
                Class
              </label>
              {classesLoading ? (
                <Skeleton className="h-10" />
              ) : (
                <Select
                  value={selectedClass}
                  onValueChange={(v) => {
                    setSelectedClass(v);
                    setStatusMap({});
                    setSaved(false);
                  }}
                >
                  <SelectTrigger
                    id="attendance-class"
                    data-ocid="attendance.class_select"
                  >
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.length === 0 && (
                      <SelectItem value="__none__" disabled>
                        No classes available
                      </SelectItem>
                    )}
                    {classes?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} &mdash; {cls.section} ({cls.subject})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex-1 min-w-48">
              <label
                htmlFor="attendance-date"
                className="text-xs font-medium text-muted-foreground block mb-1.5"
              >
                Date
              </label>
              <input
                id="attendance-date"
                type="date"
                className="w-full h-10 border border-input bg-background text-foreground px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setStatusMap({});
                  setSaved(false);
                }}
                data-ocid="attendance.date_input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roster */}
      {selectedClass ? (
        <Card className="border-border" data-ocid="attendance.roster">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base">
                  {selectedClassInfo
                    ? `${selectedClassInfo.name} — ${selectedClassInfo.section}`
                    : "Student Roster"}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
              </div>
              <div className="flex items-center gap-2">
                {saved && (
                  <span
                    className="flex items-center gap-1.5 text-xs font-medium text-accent"
                    data-ocid="attendance.success_state"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={handleSave}
                  disabled={markAttendance.isPending || !students?.length}
                  data-ocid="attendance.save_button"
                >
                  <Save className="w-3.5 h-3.5" />
                  {markAttendance.isPending ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {studentsLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={`sk-att-${i + 1}`} className="h-14" />
                ))}
              </div>
            ) : !students?.length ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-center"
                data-ocid="attendance.empty_state"
              >
                <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No students in this class yet.
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Add students via the Students page.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {students.map((s, i) => {
                  const status = getStatus(s.id);
                  const isPresent = status === "Present";
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors"
                      data-ocid={`attendance.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {s.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Roll #{s.rollNumber}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggle(s.id)}
                        aria-label={`Toggle ${s.name} attendance — currently ${status}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold shrink-0"
                        style={{
                          borderColor: isPresent
                            ? "oklch(var(--accent) / 0.4)"
                            : "oklch(var(--destructive) / 0.4)",
                          background: isPresent
                            ? "oklch(var(--accent) / 0.08)"
                            : "oklch(var(--destructive) / 0.08)",
                          color: isPresent
                            ? "oklch(var(--accent))"
                            : "oklch(var(--destructive))",
                        }}
                        data-ocid={`attendance.toggle.${i + 1}`}
                      >
                        {isPresent ? (
                          <UserCheck className="w-3.5 h-3.5" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                        {status}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          {students && students.length > 0 && (
            <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {students.length} students total
              </p>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={markAttendance.isPending || !students.length}
                className="gap-1.5"
                data-ocid="attendance.submit_button"
              >
                <Save className="w-3.5 h-3.5" />
                {markAttendance.isPending ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="attendance.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-accent/60" />
          </div>
          <h3 className="text-base font-semibold font-display text-foreground">
            Select a class to begin
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Choose a class from the dropdown above and pick a date to start
            marking attendance
          </p>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;
