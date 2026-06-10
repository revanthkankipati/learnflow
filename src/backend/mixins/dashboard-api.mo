import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import TeacherTypes "../types/teachers";
import ClassTypes "../types/classes";
import StudentTypes "../types/students";
import AttendanceTypes "../types/attendance";
import DashboardTypes "../types/dashboard";
import DashboardLib "../lib/dashboard";
import Runtime "mo:core/Runtime";
import TeacherLib "../lib/teachers";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teachers : Map.Map<Principal, TeacherTypes.Teacher>,
  classes : Map.Map<Text, ClassTypes.Class>,
  students : Map.Map<Text, StudentTypes.Student>,
  records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
) {
  public query ({ caller }) func getDashboardStats() : async DashboardTypes.DashboardStats {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    DashboardLib.getDashboardStats(classes, students, records, caller);
  };
};
