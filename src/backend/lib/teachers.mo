import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import TeacherTypes "../types/teachers";
import Runtime "mo:core/Runtime";

module {
  public func createTeacherProfile(
    teachers : Map.Map<Principal, TeacherTypes.Teacher>,
    caller : Principal,
    input : TeacherTypes.TeacherInput,
  ) : TeacherTypes.Teacher {
    let teacher : TeacherTypes.Teacher = {
      id = caller;
      name = input.name;
      email = input.email;
      school = input.school;
      createdAt = Time.now();
    };
    teachers.add(caller, teacher);
    teacher;
  };

  public func getTeacherProfile(
    teachers : Map.Map<Principal, TeacherTypes.Teacher>,
    caller : Principal,
  ) : ?TeacherTypes.Teacher {
    teachers.get(caller);
  };

  public func updateTeacherProfile(
    teachers : Map.Map<Principal, TeacherTypes.Teacher>,
    caller : Principal,
    input : TeacherTypes.TeacherInput,
  ) : TeacherTypes.Teacher {
    let existing = switch (teachers.get(caller)) {
      case (?t) t;
      case null Runtime.trap("Teacher not found");
    };
    let updated : TeacherTypes.Teacher = {
      existing with
      name = input.name;
      email = input.email;
      school = input.school;
    };
    teachers.add(caller, updated);
    updated;
  };

  public func isRegisteredTeacher(
    teachers : Map.Map<Principal, TeacherTypes.Teacher>,
    caller : Principal,
  ) : Bool {
    switch (teachers.get(caller)) {
      case (?_) true;
      case null false;
    };
  };
};
