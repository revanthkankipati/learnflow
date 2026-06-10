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
  useMyClasses,
} from "@/hooks/useQueries";
import {
  Clock,
  Monitor,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useState } from "react";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function MonitoringPage() {
  const { data: classes, isLoading: classesLoading } = useMyClasses();
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(todayStr());
  const { data: students, isLoading: studentsLoading } =
    useClassStudents(selectedClass);
  const { data: records, isLoading: recordsLoading } =
    useAttendanceByClassAndDate(selectedClass, date);

  const selectedClassInfo = classes?.find((c) => c.id === selectedClass);

  const statusForStudent = (studentId: string) =>
    records?.find((r) => r.studentId === studentId)?.status;

  const presentCount =
    records?.filter((r) => r.status === AttendanceStatus.Present).length ?? 0;
  const absentCount =
    records?.filter((r) => r.status === AttendanceStatus.Absent).length ?? 0;
  const totalCount = students?.length ?? 0;
  const notMarkedCount = totalCount - (presentCount + absentCount);
  const attendanceRate =
    totalCount > 0 && records && records.length > 0
      ? Math.round((presentCount / totalCount) * 100)
      : null;

  return (
    <div className="space-y-6" data-ocid="monitoring.page">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Attendance Monitoring
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and review attendance records for your classes
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label
                className="text-xs font-medium text-muted-foreground block mb-1.5"
                htmlFor="monitoring-class"
              >
                Class
              </label>
              {classesLoading ? (
                <Skeleton className="h-10" />
              ) : (
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger
                    data-ocid="monitoring.class_select"
                    id="monitoring-class"
                  >
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
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
                className="text-xs font-medium text-muted-foreground block mb-1.5"
                htmlFor="monitoring-date"
              >
                Date
              </label>
              <input
                type="date"
                className="w-full h-10 border border-input bg-background text-foreground px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="monitoring.date_input"
                id="monitoring-date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass ? (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p
                      className="text-xl font-bold font-display text-accent"
                      data-ocid="monitoring.present_count"
                    >
                      {presentCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <UserX className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <p
                      className="text-xl font-bold font-display text-destructive"
                      data-ocid="monitoring.absent_count"
                    >
                      {absentCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p
                      className="text-xl font-bold font-display text-muted-foreground"
                      data-ocid="monitoring.unmarked_count"
                    >
                      {notMarkedCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Not Marked</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p
                      className="text-xl font-bold font-display text-foreground"
                      data-ocid="monitoring.rate"
                    >
                      {attendanceRate !== null ? `${attendanceRate}%` : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Records table */}
          <Card className="border-border" data-ocid="monitoring.records_table">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base">
                  {selectedClassInfo
                    ? `${selectedClassInfo.name} — ${selectedClassInfo.section}`
                    : "Attendance Records"}
                </CardTitle>
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {studentsLoading || recordsLoading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={`sk-mon-${i + 1}`} className="h-12" />
                  ))}
                </div>
              ) : !students?.length ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="monitoring.empty_state"
                >
                  <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No students in this class.
                  </p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-6 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        #
                      </th>
                      <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Student
                      </th>
                      <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Roll No.
                      </th>
                      <th className="text-right px-6 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => {
                      const status = statusForStudent(s.id);
                      const isPresent =
                        status !== undefined
                          ? status === AttendanceStatus.Present
                          : null;
                      return (
                        <tr
                          key={s.id}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                          data-ocid={`monitoring.item.${i + 1}`}
                        >
                          <td className="px-6 py-3.5">
                            <span className="text-xs text-muted-foreground font-mono">
                              {i + 1}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium truncate max-w-[160px]">
                                {s.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-muted-foreground">
                            {s.rollNumber}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            {status !== undefined && isPresent !== null ? (
                              <AttendanceStatusBadge status={status} />
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" /> Not marked
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="monitoring.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Monitor className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-base font-semibold font-display text-foreground">
            Select a class to monitor
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Choose a class and date to view its attendance records and summary
          </p>
        </div>
      )}
    </div>
  );
}

export default MonitoringPage;
