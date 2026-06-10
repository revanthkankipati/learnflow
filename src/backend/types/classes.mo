// Domain types for the Class management domain
module {
  public type Class = {
    id : Text;
    teacherId : Principal;
    name : Text;
    section : Text;
    subject : Text;
    createdAt : Int;
  };

  public type ClassInput = {
    name : Text;
    section : Text;
    subject : Text;
  };
};
