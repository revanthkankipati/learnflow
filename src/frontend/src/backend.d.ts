import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TeacherInput {
    school: string;
    name: string;
    email: string;
}
export interface SendNotificationResult {
    logged: boolean;
    emailSent: boolean;
}
export interface ClassInput {
    subject: string;
    name: string;
    section: string;
}
export interface Class {
    id: string;
    subject: string;
    name: string;
    createdAt: bigint;
    section: string;
    teacherId: Principal;
}
export interface WeeklyTrendPoint {
    overallPercent: number;
    date: string;
}
export interface StudentInput {
    parentEmail: string;
    name: string;
    classId: string;
    rollNumber: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Teacher {
    id: Principal;
    school: string;
    name: string;
    createdAt: bigint;
    email: string;
}
export interface DashboardStats {
    totalStudents: bigint;
    weeklyTrend: Array<WeeklyTrendPoint>;
    recentAbsences: Array<RecentAbsence>;
    todayClassStats: Array<ClassAttendanceStat>;
}
export interface NotificationLog {
    id: string;
    parentEmail: string;
    studentId: string;
    sentAt: bigint;
    sentBy: Principal;
    message: string;
}
export interface ClassReport {
    endDate: string;
    classId: string;
    dailyStats: Array<DailyClassStat>;
    startDate: string;
}
export interface ClassAttendanceStat {
    totalStudents: bigint;
    classId: string;
    attendancePercent: number;
    className: string;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface StudentReport {
    studentId: string;
    endDate: string;
    daysAbsent: bigint;
    daysPresent: bigint;
    attendancePercent: number;
    startDate: string;
}
export interface DailyClassStat {
    date: string;
    presentCount: bigint;
    attendancePercent: number;
    absentCount: bigint;
}
export interface RecentAbsence {
    studentId: string;
    studentName: string;
    date: string;
    classId: string;
    className: string;
}
export interface AttendanceRecord {
    id: string;
    status: AttendanceStatus;
    studentId: string;
    date: string;
    note?: string;
    classId: string;
    markedBy: Principal;
}
export interface AttendanceEntry {
    status: AttendanceStatus;
    studentId: string;
    note?: string;
}
export interface Student {
    id: string;
    parentEmail: string;
    name: string;
    createdAt: bigint;
    classId: string;
    rollNumber: string;
}
export enum AttendanceStatus {
    Present = "Present",
    Absent = "Absent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClass(input: ClassInput): Promise<Class>;
    createTeacherProfile(input: TeacherInput): Promise<Teacher>;
    deleteClass(classId: string): Promise<void>;
    deleteStudent(studentId: string): Promise<void>;
    editAttendanceRecord(recordId: string, status: AttendanceStatus, note: string | null): Promise<AttendanceRecord>;
    generateClassReport(classId: string, startDate: string, endDate: string): Promise<ClassReport>;
    generateStudentReport(studentId: string, startDate: string, endDate: string): Promise<StudentReport>;
    getAttendanceByClassAndDate(classId: string, date: string): Promise<Array<AttendanceRecord>>;
    getCallerUserRole(): Promise<UserRole>;
    getClass(classId: string): Promise<Class | null>;
    getClassStudents(classId: string): Promise<Array<Student>>;
    getDashboardStats(): Promise<DashboardStats>;
    getMyClasses(): Promise<Array<Class>>;
    getNotificationLog(studentId: string): Promise<Array<NotificationLog>>;
    getStudent(studentId: string): Promise<Student | null>;
    getStudentAttendance(studentId: string, startDate: string, endDate: string): Promise<Array<AttendanceRecord>>;
    getTeacherProfile(): Promise<Teacher | null>;
    isCallerAdmin(): Promise<boolean>;
    markAttendance(classId: string, date: string, entries: Array<AttendanceEntry>): Promise<Array<AttendanceRecord>>;
    registerStudent(input: StudentInput): Promise<Student>;
    sendParentNotification(studentId: string, message: string): Promise<SendNotificationResult>;
    updateClass(classId: string, input: ClassInput): Promise<Class>;
    updateStudent(studentId: string, input: StudentInput): Promise<Student>;
    updateTeacherProfile(input: TeacherInput): Promise<Teacher>;
}
