import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import TeacherTypes "../types/teachers";
import StudentTypes "../types/students";
import StudentLib "../lib/students";
import Runtime "mo:core/Runtime";
import TeacherLib "../lib/teachers";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teachers : Map.Map<Principal, TeacherTypes.Teacher>,
  students : Map.Map<Text, StudentTypes.Student>,
  state : { var nextStudentId : Nat },
) {
  public shared ({ caller }) func registerStudent(input : StudentTypes.StudentInput) : async StudentTypes.Student {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    StudentLib.registerStudent(students, state, caller, input);
  };

  public query ({ caller }) func getStudent(studentId : Text) : async ?StudentTypes.Student {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    StudentLib.getStudent(students, caller, studentId);
  };

  public query ({ caller }) func getClassStudents(classId : Text) : async [StudentTypes.Student] {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    StudentLib.getClassStudents(students, caller, classId);
  };

  public shared ({ caller }) func updateStudent(studentId : Text, input : StudentTypes.StudentInput) : async StudentTypes.Student {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    StudentLib.updateStudent(students, caller, studentId, input);
  };

  public shared ({ caller }) func deleteStudent(studentId : Text) : async () {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    StudentLib.deleteStudent(students, caller, studentId);
  };
};
