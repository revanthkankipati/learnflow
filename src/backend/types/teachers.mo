// Domain types for the Teacher registration domain
module {
  public type Teacher = {
    id : Principal;
    name : Text;
    email : Text;
    school : Text;
    createdAt : Int;
  };

  public type TeacherInput = {
    name : Text;
    email : Text;
    school : Text;
  };
};
