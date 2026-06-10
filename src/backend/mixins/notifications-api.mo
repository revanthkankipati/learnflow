import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import TeacherTypes "../types/teachers";
import NotificationTypes "../types/notifications";
import StudentTypes "../types/students";
import NotificationLib "../lib/notifications";
import Runtime "mo:core/Runtime";
import TeacherLib "../lib/teachers";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teachers : Map.Map<Principal, TeacherTypes.Teacher>,
  students : Map.Map<Text, StudentTypes.Student>,
  notificationLogs : Map.Map<Text, NotificationTypes.NotificationLog>,
  state : { var nextNotificationId : Nat },
) {
  public shared ({ caller }) func sendParentNotification(
    studentId : Text,
    message : Text,
  ) : async NotificationTypes.SendNotificationResult {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    NotificationLib.sendParentNotification(notificationLogs, state, students, caller, studentId, message);
  };

  public query ({ caller }) func getNotificationLog(
    studentId : Text,
  ) : async [NotificationTypes.NotificationLog] {
    if (not TeacherLib.isRegisteredTeacher(teachers, caller)) Runtime.trap("Not a registered teacher");
    NotificationLib.getNotificationLog(notificationLogs, caller, studentId);
  };
};
