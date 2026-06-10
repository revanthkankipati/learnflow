import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClassStudents,
  useDeleteStudent,
  useMyClasses,
  useRegisterStudent,
} from "@/hooks/useQueries";
import { Hash, Mail, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function StudentsPage() {
  const { data: classes } = useMyClasses();
  const [selectedClass, setSelectedClass] = useState("");
  const { data: students, isLoading } = useClassStudents(selectedClass);
  const registerStudent = useRegisterStudent();
  const deleteStudent = useDeleteStudent();
  const [open, setOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    parentEmail: "",
  });
  const [search, setSearch] = useState("");

  const filteredStudents =
    students?.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  const handleRegister = async () => {
    if (!selectedClass) {
      toast.error("Select a class first");
      return;
    }
    if (!form.name || !form.rollNumber || !form.parentEmail) {
      toast.error("Fill in all fields");
      return;
    }
    try {
      await registerStudent.mutateAsync({ classId: selectedClass, ...form });
      toast.success("Student registered successfully");
      setOpen(false);
      setForm({ name: "", rollNumber: "", parentEmail: "" });
    } catch {
      toast.error("Failed to register student");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent.mutateAsync({
        studentId: id,
        classId: selectedClass,
      });
      toast.success("Student removed");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to remove student");
    }
  };

  return (
    <div className="space-y-6" data-ocid="students.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Students
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage student registrations
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="gap-2"
          data-ocid="students.add_button"
        >
          <Plus className="w-4 h-4" /> Register Student
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium whitespace-nowrap">
            Class:
          </Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-52" data-ocid="students.class_select">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} — {cls.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedClass && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="students.search_input"
            />
          </div>
        )}
        {selectedClass && students && (
          <span className="text-sm text-muted-foreground ml-auto">
            {filteredStudents.length} student
            {filteredStudents.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      {!selectedClass ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="students.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">
            Select a class to view students
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a class from the dropdown above
          </p>
        </div>
      ) : isLoading ? (
        <Card className="border-border">
          <div className="divide-y divide-border">
            {["sk-stu-0", "sk-stu-1", "sk-stu-2", "sk-stu-3", "sk-stu-4"].map(
              (k) => (
                <div key={k} className="flex items-center gap-4 p-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-20 ml-auto" />
                </div>
              ),
            )}
          </div>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="students.no_students_state"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">
            {search
              ? "No students match your search"
              : "No students in this class"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {search
              ? "Try a different search term"
              : "Register the first student for this class"}
          </p>
          {!search && (
            <Button
              onClick={() => setOpen(true)}
              size="sm"
              data-ocid="students.empty.add_button"
            >
              Register Student
            </Button>
          )}
        </div>
      ) : (
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-8">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Roll Number
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                    Parent Email
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((s, i) => (
                  <tr
                    key={s.id}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`students.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-mono">
                        <Hash className="w-3 h-3" />
                        {s.rollNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {s.parentEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirmId(s.id)}
                        data-ocid={`students.delete_button.${i + 1}`}
                        type="button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Register Student Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="students.dialog">
          <DialogHeader>
            <DialogTitle>Register New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger
                  className="mt-1"
                  data-ocid="students.dialog.class_select"
                >
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} — {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stu-name">Student Name</Label>
              <Input
                id="stu-name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="students.name_input"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="stu-roll">Roll Number</Label>
              <Input
                id="stu-roll"
                placeholder="e.g., 5B-001"
                value={form.rollNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rollNumber: e.target.value }))
                }
                data-ocid="students.roll_input"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="stu-email">Parent Email</Label>
              <Input
                id="stu-email"
                type="email"
                placeholder="parent@example.com"
                value={form.parentEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, parentEmail: e.target.value }))
                }
                data-ocid="students.email_input"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="students.cancel_button"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              disabled={registerStudent.isPending}
              data-ocid="students.submit_button"
              type="button"
            >
              {registerStudent.isPending ? "Registering..." : "Register"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(v) => {
          if (!v) setDeleteConfirmId(null);
        }}
      >
        <AlertDialogContent data-ocid="students.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the student from this class. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="students.delete_dialog.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="students.delete_dialog.confirm_button"
            >
              {deleteStudent.isPending ? "Removing..." : "Remove Student"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default StudentsPage;
