import type { ClassReport, StudentReport } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClassStudents,
  useGenerateClassReport,
  useGenerateStudentReport,
  useMyClasses,
} from "@/hooks/useQueries";
import { BarChart3, CalendarDays, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ReportsPage() {
  const { data: classes } = useMyClasses();
  const [activeTab, setActiveTab] = useState<"student" | "class">("student");

  // Shared state
  const [selectedClass, setSelectedClass] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Student report state
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentReport, setStudentReport] = useState<StudentReport | null>(
    null,
  );
  const [studentDailyData, setStudentDailyData] = useState<
    { date: string; status: string }[]
  >([]);

  // Class report state
  const [classReport, setClassReport] = useState<ClassReport | null>(null);

  const { data: students, isLoading: studentsLoading } =
    useClassStudents(selectedClass);
  const generateStudentReport = useGenerateStudentReport();
  const generateClassReport = useGenerateClassReport();

  const isGenerating =
    generateStudentReport.isPending || generateClassReport.isPending;

  const handleClassChange = (v: string) => {
    setSelectedClass(v);
    setSelectedStudent("");
    setStudentReport(null);
    setClassReport(null);
    setStudentDailyData([]);
  };

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      toast.error("Select a date range");
      return;
    }
    if (!selectedClass) {
      toast.error("Select a class");
      return;
    }
    try {
      if (activeTab === "student") {
        if (!selectedStudent) {
          toast.error("Select a student");
          return;
        }
        const r = await generateStudentReport.mutateAsync({
          studentId: selectedStudent,
          startDate,
          endDate,
        });
        setStudentReport(r as StudentReport);
        setClassReport(null);
        // Build daily rows from report — backend may not return per-day rows; mock based on daysPresent/daysAbsent
        const rr = r as StudentReport & {
          dailyRecords?: { date: string; status: string }[];
        };
        setStudentDailyData(rr.dailyRecords ?? []);
      } else {
        const r = await generateClassReport.mutateAsync({
          classId: selectedClass,
          startDate,
          endDate,
        });
        setClassReport(r as ClassReport);
        setStudentReport(null);
        setStudentDailyData([]);
      }
      toast.success("Report generated");
    } catch {
      toast.error("Failed to generate report");
    }
  };

  return (
    <div className="space-y-6" data-ocid="reports.page">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Report Generation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate detailed attendance reports for students and classes
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-muted/40 rounded-lg w-fit">
        {(["student", "class"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setStudentReport(null);
              setClassReport(null);
              setStudentDailyData([]);
            }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-card shadow-sm text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`reports.tab.${tab}`}
          >
            {tab === "student" ? "Student Report" : "Class Report"}
          </button>
        ))}
      </div>

      {/* Filters card */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4 text-accent" /> Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <input
                type="date"
                className="mt-1 w-full h-10 border border-input bg-background text-foreground px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-ocid="reports.start_date"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <input
                type="date"
                className="mt-1 w-full h-10 border border-input bg-background text-foreground px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-ocid="reports.end_date"
              />
            </div>
          </div>

          <div>
            <Label>Class</Label>
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger className="mt-1" data-ocid="reports.class_select">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} — {cls.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeTab === "student" && (
            <div>
              <Label>Student</Label>
              {studentsLoading ? (
                <Skeleton className="h-10 mt-1" />
              ) : (
                <Select
                  value={selectedStudent}
                  onValueChange={setSelectedStudent}
                  disabled={!selectedClass}
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="reports.student_select"
                  >
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.rollNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <Button
            className="w-full gap-2"
            onClick={handleGenerate}
            disabled={isGenerating}
            data-ocid="reports.generate_button"
          >
            <BarChart3 className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>

      {/* Student Report Results */}
      {activeTab === "student" && studentReport && (
        <div className="space-y-4" data-ocid="reports.student_result">
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Days Present",
                value: String(studentReport.daysPresent),
                colorClass: "text-accent",
              },
              {
                label: "Days Absent",
                value: String(studentReport.daysAbsent),
                colorClass: "text-destructive",
              },
              {
                label: "Attendance %",
                value: `${Number(studentReport.attendancePercent).toFixed(1)}%`,
                colorClass: "text-foreground",
              },
              {
                label: "Total Days",
                value: String(
                  Number(studentReport.daysPresent) +
                    Number(studentReport.daysAbsent),
                ),
                colorClass: "text-muted-foreground",
              },
            ].map((item) => (
              <Card key={item.label} className="border-border">
                <CardContent className="p-4 text-center">
                  <p
                    className={`text-2xl font-bold font-display ${item.colorClass}`}
                  >
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Per-day table */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-accent" /> Daily
                Attendance Record
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {startDate} → {endDate}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentDailyData.length === 0 ? (
                <div
                  className="text-center py-8"
                  data-ocid="reports.student_daily.empty_state"
                >
                  <p className="text-sm text-muted-foreground">
                    Summary generated. Day-by-day breakdown is not available
                    from the backend for this period.
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Total: {String(studentReport.daysPresent)} present,{" "}
                    {String(studentReport.daysAbsent)} absent
                  </p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-right py-2 font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentDailyData.map((row, i) => (
                      <tr
                        key={row.date}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        data-ocid={`reports.student.day.${i + 1}`}
                      >
                        <td className="py-2.5">{row.date}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              row.status === "Present"
                                ? "bg-accent/15 text-accent"
                                : "bg-destructive/15 text-destructive"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Class Report Results */}
      {activeTab === "class" && classReport && (
        <Card className="border-border" data-ocid="reports.class_result">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-accent" /> Class Daily
              Attendance
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {startDate} → {endDate}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(classReport.dailyStats ?? []).length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-8"
                data-ocid="reports.class.empty_state"
              >
                No attendance data for this period.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-right py-2 font-medium text-muted-foreground">
                      % Present
                    </th>
                    <th className="text-right py-2 font-medium text-muted-foreground">
                      Present
                    </th>
                    <th className="text-right py-2 font-medium text-muted-foreground">
                      Absent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    classReport.dailyStats as unknown as {
                      date: string;
                      attendancePercent: number;
                      presentCount: number | bigint;
                      absentCount: number | bigint;
                    }[]
                  ).map((stat, i) => (
                    <tr
                      key={stat.date}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`reports.class.day.${i + 1}`}
                    >
                      <td className="py-2.5">{stat.date}</td>
                      <td
                        className="py-2.5 text-right font-medium"
                        style={{ color: "oklch(var(--accent))" }}
                      >
                        {Number(stat.attendancePercent).toFixed(1)}%
                      </td>
                      <td
                        className="py-2.5 text-right"
                        style={{ color: "oklch(var(--accent))" }}
                      >
                        {String(stat.presentCount)}
                      </td>
                      <td className="py-2.5 text-right text-destructive">
                        {String(stat.absentCount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty prompt */}
      {!studentReport && !classReport && (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="reports.empty_state"
        >
          <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-sm">
            Configure filters above and click Generate Report
          </p>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
