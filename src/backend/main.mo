import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import { toText } "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Course = {
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

  module Course {
    public func compareByPrice(course1 : Course, course2 : Course) : Order.Order {
      Nat.compare(course1.price, course2.price);
    };
  };

  type Lesson = {
    id : Nat;
    courseId : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    durationMinutes : Nat;
    orderIndex : Nat;
  };

  type Enrollment = {
    courseId : Nat;
    student : Principal;
    enrollmentDate : Time.Time;
    completionPercentage : Nat;
    completedLessons : [Nat];
  };

  type QuizQuestion = {
    questionText : Text;
    answerOptions : [Text];
    correctAnswerIndex : Nat;
  };

  type QuizSubmission = {
    courseId : Nat;
    student : Principal;
    answers : [Nat];
    score : Nat;
  };

  type Review = {
    courseId : Nat;
    student : Principal;
    rating : Nat;
    reviewText : Text;
  };

  type CourseInput = {
    title : Text;
    description : Text;
    category : Text;
    instructorName : Text;
    thumbnailUrl : Text;
    price : Nat;
    difficultyLevel : Text;
    durationMinutes : Nat;
    tags : [Text];
  };

  type LessonInput = {
    courseId : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    durationMinutes : Nat;
    orderIndex : Nat;
  };

  type EnrollmentInput = {
    courseId : Nat;
  };

  type QuizSubmissionInput = {
    courseId : Nat;
    answers : [Nat];
  };

  let courses = Map.empty<Nat, Course>();
  let lessons = Map.empty<Nat, Lesson>();
  let enrollments = Map.empty<(Principal, Nat), Enrollment>();
  let quizQuestions = Map.empty<Nat, [QuizQuestion]>();
  let quizSubmissions = Map.empty<(Principal, Nat), QuizSubmission>();
  let reviews = Map.empty<Nat, [Review]>();
  var nextCourseId = 1;
  var nextLessonId = 1;

  module Key {
    public func compare(key1 : (Principal, Nat), key2 : (Principal, Nat)) : Order.Order {
      switch (Principal.compare(key1.0, key2.0)) {
        case (#equal) { Nat.compare(key1.1, key2.1) };
        case (order) { order };
      };
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func getCourseInternal(courseId : Nat) : Course {
    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course does not exist") };
      case (?course) { course };
    };
  };

  func getEnrollmentInternal(student : Principal, courseId : Nat) : Enrollment {
    switch (enrollments.get((student, courseId))) {
      case (null) { Runtime.trap("Enrollment does not exist") };
      case (?enrollment) { enrollment };
    };
  };

  func calculateCompletionPercentage(course : Course, completedLessons : [Nat]) : Nat {
    if (course.lessonIds.size() == 0) {
      return 0;
    };
    (completedLessons.size() * 100) / course.lessonIds.size();
  };

  // Courses
  public shared ({ caller }) func createCourse(input : CourseInput) : async Nat {
    let courseId = nextCourseId;
    let newCourse : Course = {
      id = courseId;
      title = input.title;
      description = input.description;
      category = input.category;
      instructorName = input.instructorName;
      thumbnailUrl = input.thumbnailUrl;
      price = input.price;
      difficultyLevel = input.difficultyLevel;
      durationMinutes = input.durationMinutes;
      tags = input.tags;
      lessonIds = [];
    };
    courses.add(courseId, newCourse);
    nextCourseId += 1;
    courseId;
  };

  public query ({ caller }) func getCourse(courseId : Nat) : async Course {
    getCourseInternal(courseId);
  };

  public query ({ caller }) func getAllCourses() : async [Course] {
    courses.values().toArray();
  };

  public query ({ caller }) func getCoursesByCategory(category : Text) : async [Course] {
    courses.values().toArray().filter(
      func(course) { course.category == category }
    );
  };

  // Lessons
  public shared ({ caller }) func createLesson(input : LessonInput) : async Nat {
    let lessonId = nextLessonId;
    let newLesson : Lesson = {
      id = lessonId;
      courseId = input.courseId;
      title = input.title;
      description = input.description;
      videoUrl = input.videoUrl;
      durationMinutes = input.durationMinutes;
      orderIndex = input.orderIndex;
    };
    lessons.add(lessonId, newLesson);
    nextLessonId += 1;

    let course = getCourseInternal(input.courseId);
    let updatedLessonIds = course.lessonIds.concat([lessonId]);
    let updatedCourse = {
      course with
      lessonIds = updatedLessonIds;
    };
    courses.add(input.courseId, updatedCourse);

    lessonId;
  };

  public query ({ caller }) func getLesson(lessonId : Nat) : async Lesson {
    switch (lessons.get(lessonId)) {
      case (null) { Runtime.trap("Lesson does not exist") };
      case (?lesson) { lesson };
    };
  };

  // Enrollments
  public shared ({ caller }) func enrollInCourse(input : EnrollmentInput) : async () {
    let course = getCourseInternal(input.courseId);
    if (enrollments.containsKey((caller, input.courseId))) {
      Runtime.trap("Already enrolled in this course");
    };
    let enrollment : Enrollment = {
      courseId = input.courseId;
      student = caller;
      enrollmentDate = Time.now();
      completionPercentage = 0;
      completedLessons = [];
    };
    enrollments.add((caller, input.courseId), enrollment);
  };

  public shared ({ caller }) func markLessonComplete(courseId : Nat, lessonId : Nat) : async () {
    let course = getCourseInternal(courseId);
    let enrollment = getEnrollmentInternal(caller, courseId);
    let updatedCompletedLessons = enrollment.completedLessons.concat([lessonId]);
    let newCompletionPercentage = calculateCompletionPercentage(course, updatedCompletedLessons);
    let updatedEnrollment = {
      enrollment with
      completedLessons = updatedCompletedLessons;
      completionPercentage = newCompletionPercentage;
    };
    enrollments.add((caller, courseId), updatedEnrollment);
  };

  public query ({ caller }) func getMyEnrollments() : async [Enrollment] {
    List.fromArray<(Principal, Nat)>(
      enrollments.keys().toArray()
    ).filter(func((student, _)) { student == caller }).toArray().map(
      func((student, courseId)) {
        switch (enrollments.get((student, courseId))) {
          case (null) { Runtime.trap("Enrollment does not exist") };
          case (?enrollment) { enrollment };
        };
      }
    );
  };

  // Quizzes
  public shared ({ caller }) func addQuizQuestions(courseId : Nat, questions : [QuizQuestion]) : async () {
    quizQuestions.add(courseId, questions);
  };

  public shared ({ caller }) func submitQuiz(input : QuizSubmissionInput) : async Nat {
    let questions = switch (quizQuestions.get(input.courseId)) {
      case (null) { Runtime.trap("No quiz found for this course") };
      case (?q) { q };
    };
    var score = 0;
    for (i in Nat.range(0, Nat.min(input.answers.size(), questions.size()))) {
      if (i < questions.size()) {
        if (input.answers[i] == questions[i].correctAnswerIndex) {
          score += 1;
        };
      };
    };
    let submission : QuizSubmission = {
      courseId = input.courseId;
      student = caller;
      answers = input.answers;
      score;
    };
    quizSubmissions.add((caller, input.courseId), submission);
    score;
  };

  public query ({ caller }) func getMyQuizResults() : async [QuizSubmission] {
    List.fromArray<(Principal, Nat)>(
      quizSubmissions.keys().toArray()
    ).filter(func((student, _)) { student == caller }).toArray().map(
      func((student, courseId)) {
        switch (quizSubmissions.get((student, courseId))) {
          case (null) { Runtime.trap("Quiz submission does not exist") };
          case (?submission) { submission };
        };
      }
    );
  };

  // Reviews
  public shared ({ caller }) func addReview(courseId : Nat, rating : Nat, reviewText : Text) : async () {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let allEnrollments = enrollments.keys().toArray();
    if (
      not allEnrollments.any(
        func((student, enrolledCourseId)) {
          (student == caller) and (enrolledCourseId == courseId)
        }
      )
    ) {
      Runtime.trap("Must be enrolled in course to leave a review");
    };

    let review : Review = {
      courseId;
      student = caller;
      rating;
      reviewText;
    };
    let courseReviews = switch (reviews.get(courseId)) {
      case (null) { [] };
      case (?r) { r };
    };
    reviews.add(courseId, courseReviews.concat([review]));
  };

  public query ({ caller }) func getCourseReviews(courseId : Nat) : async [Review] {
    switch (reviews.get(courseId)) {
      case (null) { [] };
      case (?r) { r };
    };
  };

  // Example function demonstrating sorting using different comparison keys
  public query ({ caller }) func getCoursesSortedByPrice() : async [Course] {
    courses.values().toArray().sort(Course.compareByPrice);
  };
};
