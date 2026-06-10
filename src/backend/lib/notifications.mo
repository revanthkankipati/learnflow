import Map "mo:core/Map";
import Principal "mo:core/Principal";
import NotificationTypes "../types/notifications";
import StudentTypes "../types/students";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

module {
  public func sendParentNotification(
    notificationLogs : Map.Map<Text, NotificationTypes.NotificationLog>,
    state : { var nextNotificationId : Nat },
    students : Map.Map<Text, StudentTypes.Student>,
    caller : Principal,
    studentId : Text,
    message : Text,
  ) : NotificationTypes.SendNotificationResult {
    let student = switch (students.get(studentId)) {
      case (?s) s;
      case null Runtime.trap("Student not found");
    };
    let id = "notif-" # state.nextNotificationId.toText();
    state.nextNotificationId += 1;
    let log : NotificationTypes.NotificationLog = {
      id;
      studentId;
      parentEmail = student.parentEmail;
      message;
      sentAt = Time.now();
      sentBy = caller;
    };
    notificationLogs.add(id, log);
    { logged = true; emailSent = false };
  };

  public func getNotificationLog(
    notificationLogs : Map.Map<Text, NotificationTypes.NotificationLog>,
    caller : Principal,
    studentId : Text,
  ) : [NotificationTypes.NotificationLog] {
    ignore caller;
    let result = List.empty<NotificationTypes.NotificationLog>();
    for ((_, log) in notificationLogs.entries()) {
      if (log.studentId == studentId) {
        result.add(log);
      };
    };
    result.toArray();
  };
};
