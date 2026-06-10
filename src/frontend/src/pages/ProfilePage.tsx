import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateTeacherProfile,
  useTeacherProfile,
  useUpdateTeacherProfile,
} from "@/hooks/useQueries";
import { Mail, Pencil, Save, School, User, UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProfilePage() {
  const { data: profile, isLoading } = useTeacherProfile();
  const { user } = useAuth();
  const createProfile = useCreateTeacherProfile();
  const updateProfile = useUpdateTeacherProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", school: "" });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    school: "",
  });

  const isExisting = !!profile;
  const isPending = createProfile.isPending || updateProfile.isPending;

  const validate = () => {
    const errs = { name: "", email: "", school: "" };
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (!form.school.trim()) errs.school = "School name is required";
    setFormErrors(errs);
    return !errs.name && !errs.email && !errs.school;
  };

  const handleEdit = () => {
    setForm({
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      school: profile?.school ?? "",
    });
    setFormErrors({ name: "", email: "", school: "" });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (isExisting && editing) {
        await updateProfile.mutateAsync(form);
      } else {
        await createProfile.mutateAsync(form);
      }
      toast.success(isExisting ? "Profile updated" : "Profile created");
      setEditing(false);
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const handleBlur = (field: keyof typeof form) => {
    const errs = { ...formErrors };
    if (field === "name" && !form.name.trim()) errs.name = "Name is required";
    else if (field === "email") {
      if (!form.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errs.email = "Enter a valid email address";
      else errs.email = "";
    } else if (field === "school" && !form.school.trim())
      errs.school = "School name is required";
    else errs[field] = "";
    setFormErrors(errs);
  };

  const showForm = editing || (!profile && !isLoading);

  return (
    <div className="space-y-6 max-w-2xl" data-ocid="profile.page">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Teacher Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal and school information
        </p>
      </div>

      {/* Profile card */}
      {isLoading ? (
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-56" />
          </CardContent>
        </Card>
      ) : profile && !editing ? (
        <Card className="border-border" data-ocid="profile.card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-primary">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold font-display text-foreground">
                    {profile.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <School className="w-3.5 h-3.5" />
                    <span>{profile.school}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{profile.email}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleEdit}
                className="gap-2"
                data-ocid="profile.edit_button"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Create / Edit form */}
      {showForm && (
        <Card className="border-border" data-ocid="profile.form_card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-accent" />
              {isExisting ? "Edit Profile" : "Create Profile"}
            </CardTitle>
            {!isExisting && (
              <p className="text-sm text-muted-foreground mt-1">
                Complete your profile to start managing attendance.
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="pname" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="pname"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  onBlur={() => handleBlur("name")}
                  placeholder="e.g. Sarah Johnson"
                  className="pl-9"
                  data-ocid="profile.name_input"
                />
              </div>
              {formErrors.name && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="profile.name_field_error"
                >
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="pemail" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="pemail"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  onBlur={() => handleBlur("email")}
                  placeholder="teacher@school.edu"
                  className="pl-9"
                  data-ocid="profile.email_input"
                />
              </div>
              {formErrors.email && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="profile.email_field_error"
                >
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="pschool" className="text-sm font-medium">
                School / Institution
              </Label>
              <div className="relative mt-1.5">
                <School className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="pschool"
                  value={form.school}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, school: e.target.value }))
                  }
                  onBlur={() => handleBlur("school")}
                  placeholder="e.g. Riverside Academy"
                  className="pl-9"
                  data-ocid="profile.school_input"
                />
              </div>
              {formErrors.school && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="profile.school_field_error"
                >
                  {formErrors.school}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="gap-2"
                data-ocid="profile.save_button"
              >
                <Save className="w-4 h-4" />
                {isPending
                  ? "Saving..."
                  : isExisting
                    ? "Save Changes"
                    : "Create Profile"}
              </Button>
              {isExisting && (
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  data-ocid="profile.cancel_button"
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Principal / session info */}
      {user && (
        <Card className="border-border bg-muted/20">
          <CardContent className="px-5 py-4">
            <p className="text-xs text-muted-foreground font-mono break-all">
              <span className="font-semibold text-foreground">
                Logged in as:{" "}
              </span>
              {user.username} ({user.role})
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProfilePage;
