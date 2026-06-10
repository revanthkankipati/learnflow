import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import TeacherTypes "../types/teachers";
import AttendanceTypes "../types/attendance";
import AttendanceLib "../lib/attendance";
import Runtime "mo:core/Runtime";
import TeacherLib "../lib/teachers";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teachers : Map.Map<Principal, TeacherTypes.Teacher>,
  records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
) {
  public query ({ caller }) func generateStudentReport(
    studentId : Text,
    startDate : Text,
    endDate : Text,
  ) : async AttendanceTypes.StudentReport {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    AttendanceLib.generateStudentReport(records, caller, studentId, startDate, endDate);
  };

  public query ({ caller }) func generateClassReport(
    classId : Text,
    startDate : Text,
    endDate : Text,
  ) : async AttendanceTypes.ClassReport {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    AttendanceLib.generateClassReport(records, caller, classId, startDate, endDate);
  };
};
