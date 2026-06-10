import Map "mo:core/Map";
import Principal "mo:core/Principal";
import ClassTypes "../types/classes";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

module {
  public func createClass(
    classes : Map.Map<Text, ClassTypes.Class>,
    state : { var nextClassId : Nat },
    caller : Principal,
    input : ClassTypes.ClassInput,
  ) : ClassTypes.Class {
    let id = "class-" # state.nextClassId.toText();
    state.nextClassId += 1;
    let cls : ClassTypes.Class = {
      id;
      teacherId = caller;
      name = input.name;
      section = input.section;
      subject = input.subject;
      createdAt = Time.now();
    };
    classes.add(id, cls);
    cls;
  };

  public func getClass(
    classes : Map.Map<Text, ClassTypes.Class>,
    classId : Text,
  ) : ?ClassTypes.Class {
    classes.get(classId);
  };

  public func getMyClasses(
    classes : Map.Map<Text, ClassTypes.Class>,
    caller : Principal,
  ) : [ClassTypes.Class] {
    let result = List.empty<ClassTypes.Class>();
    for ((_, cls) in classes.entries()) {
      if (cls.teacherId == caller) {
        result.add(cls);
      };
    };
    result.toArray();
  };

  public func updateClass(
    classes : Map.Map<Text, ClassTypes.Class>,
    caller : Principal,
    classId : Text,
    input : ClassTypes.ClassInput,
  ) : ClassTypes.Class {
    let existing = switch (classes.get(classId)) {
      case (?c) c;
      case null Runtime.trap("Class not found");
    };
    if (existing.teacherId != caller) Runtime.trap("Not authorized");
    let updated : ClassTypes.Class = {
      existing with
      name = input.name;
      section = input.section;
      subject = input.subject;
    };
    classes.add(classId, updated);
    updated;
  };

  public func deleteClass(
    classes : Map.Map<Text, ClassTypes.Class>,
    caller : Principal,
    classId : Text,
  ) : () {
    let existing = switch (classes.get(classId)) {
      case (?c) c;
      case null Runtime.trap("Class not found");
    };
    if (existing.teacherId != caller) Runtime.trap("Not authorized");
    classes.remove(classId);
  };
};
