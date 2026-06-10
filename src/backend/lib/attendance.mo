import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AttendanceTypes "../types/attendance";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";

module {
  public func markAttendance(
    records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
    state : { var nextAttendanceId : Nat },
    caller : Principal,
    classId : Text,
    date : Text,
    entries : [AttendanceTypes.AttendanceEntry],
  ) : [AttendanceTypes.AttendanceRecord] {
    let result = List.empty<AttendanceTypes.AttendanceRecord>();
    for (entry in entries.vals()) {
      // Try to find an existing record for this student+class+date
      var existingId : ?Text = null;
      for ((recId, rec) in records.entries()) {
        if (rec.classId == classId and rec.studentId == entry.studentId and rec.date == date) {
          existingId := ?recId;
        };
      };
      let recordId = switch (existingId) {
        case (?eid) eid;
        case null {
          let newId = "att-" # state.nextAttendanceId.toText();
          state.nextAttendanceId += 1;
          newId;
        };
      };
      let record : AttendanceTypes.AttendanceRecord = {
        id = recordId;
        classId;
        studentId = entry.studentId;
        date;
        status = entry.status;
        markedBy = caller;
        note = entry.note;
      };
      records.add(recordId, record);
      result.add(record);
    };
    result.toArray();
  };

  public func getAttendanceByClassAndDate(
    records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
    caller : Principal,
    classId : Text,
    date : Text,
  ) : [AttendanceTypes.AttendanceRecord] {
    ignore caller;
    let result = List.empty<AttendanceTypes.AttendanceRecord>();
    for ((_, rec) in records.entries()) {
      if (rec.classId == classId and rec.date == date) {
        result.add(rec);
      };
    };
    result.toArray();
  };

  public func getStudentAttendance(
    records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
    caller : Principal,
    studentId : Text,
    startDate : Text,
    endDate : Text,
  ) : [AttendanceTypes.AttendanceRecord] {
    ignore caller;
    let result = List.empty<AttendanceTypes.AttendanceRecord>();
    for ((_, rec) in records.entries()) {
      if (rec.studentId == studentId and rec.date >= startDate and rec.date <= endDate) {
        result.add(rec);
      };
    };
    result.toArray();
  };

  public func editAttendanceRecord(
    records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
    caller : Principal,
    recordId : Text,
    status : AttendanceTypes.AttendanceStatus,
    note : ?Text,
  ) : AttendanceTypes.AttendanceRecord {
    ignore caller;
    let existing = switch (records.get(recordId)) {
      case (?r) r;
      case null Runtime.trap("Attendance record not found");
    };
    let updated : AttendanceTypes.AttendanceRecord = {
      existing with
      status;
      note;
    };
    records.add(recordId, updated);
    updated;
  };

  public func generateStudentReport(
    records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
    caller : Principal,
    studentId : Text,
    startDate : Text,
    endDate : Text,
  ) : AttendanceTypes.StudentReport {
    ignore caller;
    var daysPresent = 0;
    var daysAbsent = 0;
    for ((_, rec) in records.entries()) {
      if (rec.studentId == studentId and rec.date >= startDate and rec.date <= endDate) {
        switch (rec.status) {
          case (#Present) daysPresent += 1;
          case (#Absent) daysAbsent += 1;
        };
      };
    };
    let total = daysPresent + daysAbsent;
    let attendancePercent : Float = if (total == 0) 0.0 else Float.fromInt(daysPresent) / Float.fromInt(total) * 100.0;
    { studentId; startDate; endDate; daysPresent; daysAbsent; attendancePercent };
  };

  public func generateClassReport(
    records : Map.Map<Text, AttendanceTypes.AttendanceRecord>,
    caller : Principal,
    classId : Text,
    startDate : Text,
    endDate : Text,
  ) : AttendanceTypes.ClassReport {
    ignore caller;
    // Collect all unique dates in range for this class
    let dateSet = Map.empty<Text, Bool>();
    for ((_, rec) in records.entries()) {
      if (rec.classId == classId and rec.date >= startDate and rec.date <= endDate) {
        dateSet.add(rec.date, true);
      };
    };
    let dailyStats = List.empty<AttendanceTypes.DailyClassStat>();
    for ((date, _) in dateSet.entries()) {
      var presentCount = 0;
      var absentCount = 0;
      for ((_, rec) in records.entries()) {
        if (rec.classId == classId and rec.date == date) {
          switch (rec.status) {
            case (#Present) presentCount += 1;
            case (#Absent) absentCount += 1;
          };
        };
      };
      let total = presentCount + absentCount;
      let attendancePercent : Float = if (total == 0) 0.0 else Float.fromInt(presentCount) / Float.fromInt(total) * 100.0;
      dailyStats.add({ date; attendancePercent; presentCount; absentCount });
    };
    { classId; startDate; endDate; dailyStats = dailyStats.toArray() };
  };
};
