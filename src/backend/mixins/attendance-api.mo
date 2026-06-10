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
  state : { var nextAttendanceId : Nat },
) {
  public shared ({ caller }) func markAttendance(
    classId : Text,
    date : Text,
    entries : [AttendanceTypes.AttendanceEntry],
  ) : async [AttendanceTypes.AttendanceRecord] {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    AttendanceLib.markAttendance(records, state, caller, classId, date, entries);
  };

  public query ({ caller }) func getAttendanceByClassAndDate(
    classId : Text,
    date : Text,
  ) : async [AttendanceTypes.AttendanceRecord] {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    AttendanceLib.getAttendanceByClassAndDate(records, caller, classId, date);
  };

  public query ({ caller }) func getStudentAttendance(
    studentId : Text,
    startDate : Text,
    endDate : Text,
  ) : async [AttendanceTypes.AttendanceRecord] {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    AttendanceLib.getStudentAttendance(records, caller, studentId, startDate, endDate);
  };

  public shared ({ caller }) func editAttendanceRecord(
    recordId : Text,
    status : AttendanceTypes.AttendanceStatus,
    note : ?Text,
  ) : async AttendanceTypes.AttendanceRecord {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    AttendanceLib.editAttendanceRecord(records, caller, recordId, status, note);
  };
};
