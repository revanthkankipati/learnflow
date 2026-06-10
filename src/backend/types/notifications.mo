// Domain types for the Parent Notification domain
module {
  public type NotificationLog = {
    id : Text;
    studentId : Text;
    parentEmail : Text;
    message : Text;
    sentAt : Int;
    sentBy : Principal;
  };

  public type SendNotificationResult = {
    logged : Bool;
    emailSent : Bool;
  };
};
