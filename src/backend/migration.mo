// Migration: replaces all e-learning state with attendance system state.
// Old actor had: courses, lessons, enrollments, quizQuestions, quizSubmissions,
// reviews (all e-learning Maps), plus nextCourseId and nextLessonId counters.
// New actor introduces entirely new domains with no data to carry over.
// All old state is consumed and discarded; new state starts fresh.
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import TeacherTypes "./types/teachers";
import ClassTypes "./types/classes";
import StudentTypes "./types/students";
import AttendanceTypes "./types/attendance";
import NotificationTypes "./types/notifications";

module {
  // ---- Old types (inline, copied from previous main.mo) ----
  type OldCourse = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    instructorName : Text;
    thumbnailUrl : Text;
    price : Nat;
    difficultyLevel : Text;
    durationMinutes : Nat;
    tags : [Text];
    lessonIds : [Nat];
  };

  type OldLesson = {
    id : Nat;
    courseId : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    durationMinutes : Nat;
    orderIndex : Nat;
  };

  type OldEnrollment = {
    courseId : Nat;
    student : Principal;
    enrollmentDate : Int;
    completionPercentage : Nat;
    completedLessons : [Nat];
  };

  type OldQuizQuestion = {
    questionText : Text;
    answerOptions : [Text];
    correctAnswerIndex : Nat;
  };

  type OldQuizSubmission = {
    courseId : Nat;
    student : Principal;
    answers : [Nat];
    score : Nat;
  };

  type OldReview = {
    courseId : Nat;
    student : Principal;
    rating : Nat;
    reviewText : Text;
  };

  module _OldKey {
    public func compare(k1 : (Principal, Nat), k2 : (Principal, Nat)) : Order.Order {
      switch (Principal.compare(k1.0, k2.0)) {
        case (#equal) { Nat.compare(k1.1, k2.1) };
        case (o) { o };
      };
    };
  };

  // ---- Old stable state snapshot ----
  type OldActor = {
    courses : Map.Map<Nat, OldCourse>;
    lessons : Map.Map<Nat, OldLesson>;
    enrollments : Map.Map<(Principal, Nat), OldEnrollment>;
    quizQuestions : Map.Map<Nat, [OldQuizQuestion]>;
    quizSubmissions : Map.Map<(Principal, Nat), OldQuizSubmission>;
    reviews : Map.Map<Nat, [OldReview]>;
    var nextCourseId : Nat;
    var nextLessonId : Nat;
  };

  // ---- New stable state snapshot ----
  // Only top-level actor Map fields are listed here.
  // The counters record is a let-binding inside the actor, not a stable field.
  type NewActor = {
    teachers : Map.Map<Principal, TeacherTypes.Teacher>;
    classes : Map.Map<Text, ClassTypes.Class>;
    students : Map.Map<Text, StudentTypes.Student>;
    attendanceRecords : Map.Map<Text, AttendanceTypes.AttendanceRecord>;
    notificationLogs : Map.Map<Text, NotificationTypes.NotificationLog>;
  };

  // All old e-learning data is intentionally discarded — no domain overlap.
  public func run(_old : OldActor) : NewActor {
    {
      teachers = Map.empty<Principal, TeacherTypes.Teacher>();
      classes = Map.empty<Text, ClassTypes.Class>();
      students = Map.empty<Text, StudentTypes.Student>();
      attendanceRecords = Map.empty<Text, AttendanceTypes.AttendanceRecord>();
      notificationLogs = Map.empty<Text, NotificationTypes.NotificationLog>();
    };
  };
};
