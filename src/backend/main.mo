import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import TeacherTypes "types/teachers";
import ClassTypes "types/classes";
import StudentTypes "types/students";
import AttendanceTypes "types/attendance";
import NotificationTypes "types/notifications";
import DashboardTypes "types/dashboard";
import TeachersMixin "mixins/teachers-api";
import ClassesMixin "mixins/classes-api";
import StudentsMixin "mixins/students-api";
import AttendanceMixin "mixins/attendance-api";
import ReportsMixin "mixins/reports-api";
import NotificationsMixin "mixins/notifications-api";
import DashboardMixin "mixins/dashboard-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState, null);

  // Attendance system stable state
  let teachers = Map.empty<Principal, TeacherTypes.Teacher>();
  let classes = Map.empty<Text, ClassTypes.Class>();
  let students = Map.empty<Text, StudentTypes.Student>();
  let attendanceRecords = Map.empty<Text, AttendanceTypes.AttendanceRecord>();
  let notificationLogs = Map.empty<Text, NotificationTypes.NotificationLog>();

  // Shared mutable counters
  let counters = {
    var nextClassId = 1;
    var nextStudentId = 1;
    var nextAttendanceId = 1;
    var nextNotificationId = 1;
  };

  // Domain mixins
  include TeachersMixin(accessControlState, teachers);
  include ClassesMixin(accessControlState, teachers, classes, counters);
  include StudentsMixin(accessControlState, teachers, students, counters);
  include AttendanceMixin(accessControlState, teachers, attendanceRecords, counters);
  include ReportsMixin(accessControlState, teachers, attendanceRecords);
  include NotificationsMixin(accessControlState, teachers, students, notificationLogs, counters);
  include DashboardMixin(accessControlState, teachers, classes, students, attendanceRecords);
};
