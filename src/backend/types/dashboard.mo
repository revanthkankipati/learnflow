// Domain types for the Dashboard module
module {
  public type ClassAttendanceStat = {
    classId : Text;
    className : Text;
    attendancePercent : Float;
    totalStudents : Nat;
  };

  // One data point in weekly trend (per day)
  public type WeeklyTrendPoint = {
    date : Text;
    overallPercent : Float;
  };

  public type RecentAbsence = {
    studentId : Text;
    studentName : Text;
    classId : Text;
    className : Text;
    date : Text;
  };

  public type DashboardStats = {
    todayClassStats : [ClassAttendanceStat];
    weeklyTrend : [WeeklyTrendPoint];
    totalStudents : Nat;
    recentAbsences : [RecentAbsence];
  };
};
