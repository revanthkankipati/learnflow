// Domain types for the Student registration domain
module {
  public type Student = {
    id : Text;
    classId : Text;
    name : Text;
    rollNumber : Text;
    parentEmail : Text;
    createdAt : Int;
  };

  public type StudentInput = {
    classId : Text;
    name : Text;
    rollNumber : Text;
    parentEmail : Text;
  };
};
