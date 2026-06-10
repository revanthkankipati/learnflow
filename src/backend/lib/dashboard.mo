import Map "mo:core/Map";
import Principal "mo:core/Principal";
import DashboardTypes "../types/dashboard";
import AttendanceTypes "../types/attendance";
import ClassTypes "../types/classes";
import StudentTypes "../types/students";
import List "mo:core/List";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Time "mo:core/Time";

module {
  public func getDashboardStats(
    classes : Map.Map<Text, ClassTypes.Class>,
    students : Map.Map<Text, StudentTypes.Student>,
    records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
    caller : Principal,
  ) : DashboardTypes.DashboardStats {
    ignore caller;

    // Today's date as YYYY-MM-DD (use integer division from Time.now() nanoseconds)
    // Time.now() is nanoseconds since epoch
    let nowNs : Int = Time.now();
    let nowSecs : Int = nowNs / 1_000_000_000;
    let daysSinceEpoch : Int = nowSecs / 86400;
    // Compute today date string via days-since-epoch
    let todayStr = intToDateString(daysSinceEpoch);

    // totalStudents
    let totalStudents : Nat = students.size();

    // todayClassStats: for each class, compute attendance % for today
    let todayClassStatsList = List.empty<DashboardTypes.ClassAttendanceStat>();
    for ((classId, cls) in classes.entries()) {
      var presentCount = 0;
      var absentCount = 0;
      for ((_, rec) in records.entries()) {
        if (rec.classId == classId and rec.date == todayStr) {
          switch (rec.status) {
            case (#Present) presentCount += 1;
            case (#Absent) absentCount += 1;
          };
        };
      };
      let total = presentCount + absentCount;
      let attendancePercent : Float = if (total == 0) 0.0 else Float.fromInt(presentCount) / Float.fromInt(total) * 100.0;
      // Count students in this class
      var classStudentCount = 0;
      for ((_, s) in students.entries()) {
        if (s.classId == classId) classStudentCount += 1;
      };
      todayClassStatsList.add({
        classId;
        className = cls.name;
        attendancePercent;
        totalStudents = classStudentCount;
      });
    };

    // weeklyTrend: daily overall % for past 7 days
    let weeklyTrendList = List.empty<DashboardTypes.WeeklyTrendPoint>();
    var dayOffset : Int = 0;
    while (dayOffset < 7) {
      let d = daysSinceEpoch - dayOffset;
      let dateStr = intToDateString(d);
      var presentCount = 0;
      var absentCount = 0;
      for ((_, rec) in records.entries()) {
        if (rec.date == dateStr) {
          switch (rec.status) {
            case (#Present) presentCount += 1;
            case (#Absent) absentCount += 1;
          };
        };
      };
      let total = presentCount + absentCount;
      let overallPercent : Float = if (total == 0) 0.0 else Float.fromInt(presentCount) / Float.fromInt(total) * 100.0;
      weeklyTrendList.add({ date = dateStr; overallPercent });
      dayOffset += 1;
    };

    // recentAbsences: last 5 absences across all classes
    let absenceList = List.empty<DashboardTypes.RecentAbsence>();
    for ((_, rec) in records.entries()) {
      switch (rec.status) {
        case (#Absent) {
          let studentName = switch (students.get(rec.studentId)) {
            case (?s) s.name;
            case null rec.studentId;
          };
          let className = switch (classes.get(rec.classId)) {
            case (?c) c.name;
            case null rec.classId;
          };
          absenceList.add({
            studentId = rec.studentId;
            studentName;
            classId = rec.classId;
            className;
            date = rec.date;
          });
        };
        case (#Present) {};
      };
    };
    // Take up to last 5 absences
    let allAbsences = absenceList.toArray();
    let totalAbsences = allAbsences.size();
    let recentCount = if (totalAbsences > 5) 5 else totalAbsences;
    let startIdx = totalAbsences - recentCount;
    var recentAbsencesList = List.empty<DashboardTypes.RecentAbsence>();
    var j = startIdx;
    while (j < totalAbsences) {
      recentAbsencesList.add(allAbsences[j]);
      j += 1;
    };

    {
      todayClassStats = todayClassStatsList.toArray();
      weeklyTrend = weeklyTrendList.toArray();
      totalStudents;
      recentAbsences = recentAbsencesList.toArray();
    };
  };

  // Helper: convert days-since-epoch (Int) to YYYY-MM-DD string
  func intToDateString(daysSinceEpoch : Int) : Text {
    // Using Gregorian calendar algorithm
    let z = daysSinceEpoch + 719468;
    var era : Int = (if (z >= 0) z else z - 146096) / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if (mp < 10) mp + 3 else mp - 9;
    let yr = if (m <= 2) y + 1 else y;
    let pad2 = func(n : Int) : Text {
      if (n < 10) "0" # n.toText() else n.toText();
    };
    yr.toText() # "-" # pad2(m) # "-" # pad2(d);
  };
};
