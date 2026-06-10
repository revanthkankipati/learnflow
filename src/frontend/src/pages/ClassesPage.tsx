import type { Class } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateClass, useMyClasses } from "@/hooks/useQueries";
import { BookOpen, Plus, Users } from "lucide-react";
import { useState } from "react";

function ClassCard({ cls, index }: { cls: Class; index: number }) {
  return (
    <div
      className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
      data-ocid={`classes.item.${index}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-foreground">{cls.name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{cls.subject}</p>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" /> Section {cls.section}
        </span>
      </div>
    </div>
  );
}
import { toast } from "sonner";

export function ClassesPage() {
  const { data: classes, isLoading } = useMyClasses();
  const createClass = useCreateClass();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", section: "", subject: "" });

  const handleCreate = async () => {
    if (!form.name || !form.section || !form.subject) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await createClass.mutateAsync(form);
      toast.success("Class created successfully");
      setOpen(false);
      setForm({ name: "", section: "", subject: "" });
    } catch {
      toast.error("Failed to create class");
    }
  };

  return (
    <div className="space-y-6" data-ocid="classes.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Classes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your classes and sections
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="gap-2"
          data-ocid="classes.add_button"
        >
          <Plus className="w-4 h-4" /> Add Class
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={`sk-cls-${i + 1}`} className="h-40" />
          ))}
        </div>
      ) : !classes?.length ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="classes.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">
            No classes yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5 max-w-xs">
            Create your first class to start tracking attendance for your
            students
          </p>
          <Button
            onClick={() => setOpen(true)}
            className="gap-2"
            data-ocid="classes.empty.add_button"
          >
            <Plus className="w-4 h-4" /> Create First Class
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls, i) => (
            <ClassCard key={cls.id} cls={cls} index={i + 1} />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="classes.dialog">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="class-name">Class Name</Label>
              <Input
                id="class-name"
                placeholder="e.g., Class 5B"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="classes.name_input"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="class-section">Section</Label>
              <Input
                id="class-section"
                placeholder="e.g., B"
                value={form.section}
                onChange={(e) =>
                  setForm((f) => ({ ...f, section: e.target.value }))
                }
                data-ocid="classes.section_input"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="class-subject">Subject</Label>
              <Input
                id="class-subject"
                placeholder="e.g., Mathematics"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                data-ocid="classes.subject_input"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="classes.cancel_button"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createClass.isPending}
              data-ocid="classes.submit_button"
              type="button"
            >
              {createClass.isPending ? "Creating..." : "Create Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ClassesPage;
