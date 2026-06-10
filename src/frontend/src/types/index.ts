// Re-export all types from the generated backend bindings so pages can import from either location.
export type {
  Teacher,
  Class,
  Student,
  AttendanceEntry,
  AttendanceRecord,
  StudentReport,
  ClassReport,
  DailyClassStat,
  ClassAttendanceStat,
  WeeklyTrendPoint,
  RecentAbsence,
  DashboardStats,
  NotificationLog,
  SendNotificationResult,
  TeacherInput,
  ClassInput,
  StudentInput,
} from "@/backend";
export { AttendanceStatus } from "@/backend";
