import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import TeacherTypes "../types/teachers";
import ClassTypes "../types/classes";
import ClassLib "../lib/classes";
import Runtime "mo:core/Runtime";
import TeacherLib "../lib/teachers";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teachers : Map.Map<Principal, TeacherTypes.Teacher>,
  classes : Map.Map<Text, ClassTypes.Class>,
  state : { var nextClassId : Nat },
) {
  public shared ({ caller }) func createClass(input : ClassTypes.ClassInput) : async ClassTypes.Class {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    ClassLib.createClass(classes, state, caller, input);
  };

  public query ({ caller }) func getClass(classId : Text) : async ?ClassTypes.Class {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    ClassLib.getClass(classes, classId);
  };

  public query ({ caller }) func getMyClasses() : async [ClassTypes.Class] {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    ClassLib.getMyClasses(classes, caller);
  };

  public shared ({ caller }) func updateClass(classId : Text, input : ClassTypes.ClassInput) : async ClassTypes.Class {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    ClassLib.updateClass(classes, caller, classId, input);
  };

  public shared ({ caller }) func deleteClass(classId : Text) : async () {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    ClassLib.deleteClass(classes, caller, classId);
  };
};
