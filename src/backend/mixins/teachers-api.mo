import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import TeacherTypes "../types/teachers";
import TeacherLib "../lib/teachers";
import Runtime "mo:core/Runtime";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teachers : Map.Map<Principal, TeacherTypes.Teacher>,
) {
  public shared ({ caller }) func createTeacherProfile(input : TeacherTypes.TeacherInput) : async TeacherTypes.Teacher {
    TeacherLib.createTeacherProfile(teachers, caller, input);
  };

  public query ({ caller }) func getTeacherProfile() : async ?TeacherTypes.Teacher {
    TeacherLib.getTeacherProfile(teachers, caller);
  };

  public shared ({ caller }) func updateTeacherProfile(input : TeacherTypes.TeacherInput) : async TeacherTypes.Teacher {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    TeacherLib.updateTeacherProfile(teachers, caller, input);
  };
};
