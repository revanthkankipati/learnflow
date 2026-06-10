import type {
  ClassAttendanceStat,
  RecentAbsence,
  WeeklyTrendPoint,
} from "@/backend";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats, useMyClasses } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart2,
  BookOpen,
  CalendarDays,
  CheckSquare,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

const mockStats = {
  totalStudents: 336,
  presentToday: 285,
  absentToday: 34,
  classCount: 8,
};

const mockClassStats: ClassAttendanceStat[] = [
  {
    classId: "1",
    className: "Class 5B",
    totalStudents: 54n,
    attendancePercent: 81.5,
  },
  {
    classId: "2",
    className: "Class 4B",
    totalStudents: 58n,
    attendancePercent: 82.8,
  },
  {
    classId: "3",
    className: "Class 3C",
    totalStudents: 38n,
    attendancePercent: 92.1,
  },
  {
    classId: "4",
    className: "Class 4D",
    totalStudents: 42n,
    attendancePercent: 92.9,
  },
  {
    classId: "5",
    className: "Class 5A",
    totalStudents: 23n,
    attendancePercent: 73.9,
  },
];

const mockWeeklyTrend: WeeklyTrendPoint[] = [
  { date: "2026-06-02", overallPercent: 92.4 },
  { date: "2026-06-03", overallPercent: 88.7 },
  { date: "2026-06-04", overallPercent: 90.1 },
  { date: "2026-06-05", overallPercent: 85.3 },
  { date: "2026-06-06", overallPercent: 93.2 },
];

const mockRecentAbsences: RecentAbsence[] = [
  {
    studentId: "s1",
    studentName: "Arjun Sharma",
    className: "Class 5B",
    classId: "1",
    date: "Jun 9, 2026",
  },
  {
    studentId: "s2",
    studentName: "Priya Nair",
    className: "Class 4B",
    classId: "2",
    date: "Jun 9, 2026",
  },
  {
    studentId: "s3",
    studentName: "Rohan Verma",
    className: "Class 3C",
    classId: "3",
    date: "Jun 9, 2026",
  },
  {
    studentId: "s4",
    studentName: "Meera Patel",
    className: "Class 5A",
    classId: "5",
    date: "Jun 8, 2026",
  },
];

export function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: classes } = useMyClasses();
  const navigate = useNavigate();

  const totalStudents = stats
    ? Number(stats.totalStudents)
    : mockStats.totalStudents;
  const classCount = classes?.length ?? mockStats.classCount;

  const todayPresent = stats?.todayClassStats
    ? stats.todayClassStats.reduce(
        (acc, s) =>
          acc +
          Math.round((Number(s.totalStudents) * s.attendancePercent) / 100),
        0,
      )
    : mockStats.presentToday;
  const todayAbsent = stats?.todayClassStats
    ? stats.todayClassStats.reduce(
        (acc, s) =>
          acc +
          Math.round(Number(s.totalStudents) * (1 - s.attendancePercent / 100)),
        0,
      )
    : mockStats.absentToday;

  const todayTotal = todayPresent + todayAbsent;
  const attendancePct =
    todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0;

  const weeklyData: WeeklyTrendPoint[] = stats?.weeklyTrend?.length
    ? stats.weeklyTrend
    : mockWeeklyTrend;

  const recentAbsences: RecentAbsence[] = stats?.recentAbsences?.length
    ? stats.recentAbsences
    : mockRecentAbsences;

  const classStats = stats?.todayClassStats?.length
    ? stats.todayClassStats
    : mockClassStats;

  return (
    <div className="space-y-6" data-ocid="dashboard.page">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {/* Quick actions */}
        <div
          className="flex items-center gap-2"
          data-ocid="dashboard.quick_actions"
        >
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate({ to: "/attendance" })}
            data-ocid="dashboard.mark_attendance_button"
          >
            <CheckSquare className="w-4 h-4" />
            Mark Attendance
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate({ to: "/students" })}
            data-ocid="dashboard.register_student_button"
          >
            <UserPlus className="w-4 h-4" />
            Register Student
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => navigate({ to: "/reports" })}
            data-ocid="dashboard.view_reports_button"
          >
            <BarChart2 className="w-4 h-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={`sk-stat-${i + 1}`} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Students"
              value={totalStudents}
              icon={Users}
              trendLabel="Enrolled"
              trend="neutral"
              ocid="dashboard.stat.total_students"
            />
            <StatCard
              title="Present Today"
              value={todayPresent}
              icon={CheckSquare}
              accentColor="accent"
              trendLabel={`${attendancePct}% rate`}
              trend="up"
              ocid="dashboard.stat.present_today"
            />
            <StatCard
              title="Absent Today"
              value={todayAbsent}
              icon={AlertCircle}
              accentColor="destructive"
              trendLabel="Needs attention"
              trend="down"
              ocid="dashboard.stat.absent_today"
            />
            <StatCard
              title="Total Classes"
              value={classCount}
              icon={BookOpen}
              accentColor="primary"
              trendLabel="Active classes"
              trend="neutral"
              ocid="dashboard.stat.classes"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's class attendance overview */}
        <Card
          className="lg:col-span-2 border-border"
          data-ocid="dashboard.classes_table"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Today's Class Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton
                    key={`sk-cls-tbl-${i + 1}`}
                    className="h-10 w-full"
                  />
                ))}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">
                      Class
                    </th>
                    <th className="text-right py-2 font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-right py-2 font-medium text-muted-foreground">
                      Present
                    </th>
                    <th className="text-right py-2 font-medium text-muted-foreground">
                      Absent
                    </th>
                    <th className="text-right py-2 font-medium text-muted-foreground">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classStats.map((cls, i) => {
                    const total = Number(cls.totalStudents);
                    const pct = Math.round(cls.attendancePercent);
                    const present = Math.round(
                      (total * cls.attendancePercent) / 100,
                    );
                    const absent = total - present;
                    return (
                      <tr
                        key={cls.classId}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        data-ocid={`dashboard.class.item.${i + 1}`}
                      >
                        <td className="py-2.5 font-medium">{cls.className}</td>
                        <td className="py-2.5 text-right text-muted-foreground">
                          {total}
                        </td>
                        <td className="py-2.5 text-right text-accent">
                          {present}
                        </td>
                        <td className="py-2.5 text-right text-destructive">
                          {absent}
                        </td>
                        <td className="py-2.5 text-right">
                          <span
                            className={cn(
                              "text-xs font-medium px-1.5 py-0.5 rounded-full",
                              pct >= 90
                                ? "bg-accent/10 text-accent"
                                : pct >= 75
                                  ? "bg-amber/10 text-amber-600"
                                  : "bg-destructive/10 text-destructive",
                            )}
                          >
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Recent absences */}
        <Card className="border-border" data-ocid="dashboard.absences_panel">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              Recent Absences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={`sk-abs-${i + 1}`} className="h-12" />
                ))}
              </div>
            ) : recentAbsences.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-8 text-center"
                data-ocid="dashboard.absences.empty_state"
              >
                <CheckSquare className="w-8 h-8 text-accent mb-2" />
                <p className="text-sm text-muted-foreground">
                  No absences today
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAbsences.map((a, i) => (
                  <div
                    key={a.studentId}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-destructive/5 border border-destructive/10"
                    data-ocid={`dashboard.absence.item.${i + 1}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-destructive text-xs font-bold">
                        {a.studentName.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {a.studentName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.className}
                      </p>
                      <p className="text-xs text-muted-foreground">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly attendance trend */}
      <Card className="border-border" data-ocid="dashboard.weekly_trend">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Weekly Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={`sk-trend-${i + 1}`} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-right py-2 font-medium text-muted-foreground">
                      Attendance %
                    </th>
                    <th className="py-2 pl-4 w-48 text-left font-medium text-muted-foreground">
                      Visual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyData.map((point, i) => (
                    <tr
                      key={point.date}
                      className="border-b border-border/40"
                      data-ocid={`dashboard.trend.item.${i + 1}`}
                    >
                      <td className="py-2.5 text-foreground">
                        {new Date(point.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-2.5 text-right font-semibold">
                        <span
                          className={cn(
                            point.overallPercent >= 90
                              ? "text-accent"
                              : point.overallPercent >= 75
                                ? "text-amber-600"
                                : "text-destructive",
                          )}
                        >
                          {point.overallPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 pl-4">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${point.overallPercent}%`,
                              background:
                                point.overallPercent >= 90
                                  ? "oklch(var(--accent))"
                                  : point.overallPercent >= 75
                                    ? "oklch(0.78 0.17 85)"
                                    : "oklch(var(--destructive))",
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
