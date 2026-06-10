// Domain types for the Attendance marking and database management domains
module {
  public type AttendanceStatus = {
    #Present;
    #Absent;
  };

  public type AttendanceRecord = {
    id : Text;
    classId : Text;
    studentId : Text;
    date : Text; // YYYY-MM-DD
    status : AttendanceStatus;
    markedBy : Principal;
    note : ?Text;
  };

  // Used in batch mark attendance call
  public type AttendanceEntry = {
    studentId : Text;
    status : AttendanceStatus;
    note : ?Text;
  };

  public type StudentReport = {
    studentId : Text;
    startDate : Text;
    endDate : Text;
    daysPresent : Nat;
    daysAbsent : Nat;
    attendancePercent : Float;
  };

  // One entry per date in a class report
  public type DailyClassStat = {
    date : Text;
    attendancePercent : Float;
    presentCount : Nat;
    absentCount : Nat;
  };

  public type ClassReport = {
    classId : Text;
    startDate : Text;
    endDate : Text;
    dailyStats : [DailyClassStat];
  };
};
