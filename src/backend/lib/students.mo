import Map "mo:core/Map";
import Principal "mo:core/Principal";
import StudentTypes "../types/students";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

module {
  public func registerStudent(
    students : Map.Map<Text, StudentTypes.Student>,
    state : { var nextStudentId : Nat },
    caller : Principal,
    input : StudentTypes.StudentInput,
  ) : StudentTypes.Student {
    let id = "student-" # state.nextStudentId.toText();
    state.nextStudentId += 1;
    let student : StudentTypes.Student = {
      id;
      classId = input.classId;
      name = input.name;
      rollNumber = input.rollNumber;
      parentEmail = input.parentEmail;
      createdAt = Time.now();
    };
    students.add(id, student);
    student;
  };

  public func getStudent(
    students : Map.Map<Text, StudentTypes.Student>,
    caller : Principal,
    studentId : Text,
  ) : ?StudentTypes.Student {
    ignore caller;
    students.get(studentId);
  };

  public func getClassStudents(
    students : Map.Map<Text, StudentTypes.Student>,
    caller : Principal,
    classId : Text,
  ) : [StudentTypes.Student] {
    ignore caller;
    let result = List.empty<StudentTypes.Student>();
    for ((_, s) in students.entries()) {
      if (s.classId == classId) {
        result.add(s);
      };
    };
    result.toArray();
  };

  public func updateStudent(
    students : Map.Map<Text, StudentTypes.Student>,
    caller : Principal,
    studentId : Text,
    input : StudentTypes.StudentInput,
  ) : StudentTypes.Student {
    ignore caller;
    let existing = switch (students.get(studentId)) {
      case (?s) s;
      case null Runtime.trap("Student not found");
    };
    let updated : StudentTypes.Student = {
      existing with
      classId = input.classId;
      name = input.name;
      rollNumber = input.rollNumber;
      parentEmail = input.parentEmail;
    };
    students.add(studentId, updated);
    updated;
  };

  public func deleteStudent(
    students : Map.Map<Text, StudentTypes.Student>,
    caller : Principal,
    studentId : Text,
  ) : () {
    ignore caller;
    students.remove(studentId);
  };
};
