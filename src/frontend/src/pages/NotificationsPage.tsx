import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useMyClasses,
  useNotificationLog,
  useSendParentNotification,
} from "@/hooks/useQueries";
import type { NotificationLog } from "@/types";
import { Bell, Clock, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NotificationsPage() {
  const { data: classes } = useMyClasses();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [message, setMessage] = useState("");

  const { data: students } = useClassStudents(selectedClass);
  const { data: notifLog, isLoading: logLoading } =
    useNotificationLog(selectedStudent);
  const sendNotification = useSendParentNotification();

  const handleSend = async () => {
    if (!selectedStudent) {
      toast.error("Select a student");
      return;
    }
    if (!message.trim()) {
      toast.error("Enter a message");
      return;
    }
    try {
      const result = await sendNotification.mutateAsync({
        studentId: selectedStudent,
        message,
      });
      if (result.logged || result.emailSent) {
        toast.success("Notification sent to parent");
        setMessage("");
      } else {
        toast.error("Failed to send notification");
      }
    } catch {
      toast.error("Failed to send notification");
    }
  };

  const selectedStudentData = students?.find((s) => s.id === selectedStudent);

  // Type-safe log entries using contract shape
  type LogEntry = {
    id: string;
    studentId: string;
    parentEmail: string;
    message: string;
    sentAt: bigint | number;
  };

  const typedLog = (notifLog ?? []) as unknown as LogEntry[];

  function formatSentAt(sentAt: bigint | number) {
    const ms = Number(sentAt) / 1_000_000;
    return new Date(ms).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div className="space-y-6" data-ocid="notifications.page">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Parent Notifications
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compose and send messages to parents; view notification history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send notification form */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="w-4 h-4 text-accent" /> Compose Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Class</Label>
              <Select
                value={selectedClass}
                onValueChange={(v) => {
                  setSelectedClass(v);
                  setSelectedStudent("");
                }}
              >
                <SelectTrigger
                  className="mt-1"
                  data-ocid="notifications.class_select"
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
              <Label>Student</Label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
                disabled={!selectedClass}
              >
                <SelectTrigger
                  className="mt-1"
                  data-ocid="notifications.student_select"
                >
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStudentData && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-md border border-border">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  Parent:{" "}
                  <span className="text-foreground font-medium">
                    {selectedStudentData.parentEmail}
                  </span>
                </span>
              </div>
            )}

            <div>
              <Label htmlFor="notif-msg">Message</Label>
              <textarea
                id="notif-msg"
                className="mt-1 w-full border border-input bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-y"
                placeholder="e.g., Your child was absent today. Please contact the school office for more information."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                data-ocid="notifications.message_textarea"
              />
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleSend}
              disabled={
                sendNotification.isPending ||
                !selectedStudent ||
                !message.trim()
              }
              data-ocid="notifications.send_button"
            >
              <Send className="w-4 h-4" />
              {sendNotification.isPending ? "Sending..." : "Send Notification"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification history log */}
        <Card className="border-border" data-ocid="notifications.log_panel">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Notification
              History
              {typedLog.length > 0 && (
                <span className="ml-auto text-xs font-normal bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                  {typedLog.length} sent
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedStudent ? (
              <div
                className="flex flex-col items-center py-12 text-center"
                data-ocid="notifications.log.empty_state"
              >
                <Bell className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Select a student to view notification history
                </p>
              </div>
            ) : logLoading ? (
              <div className="space-y-2">
                {["sk-log-0", "sk-log-1", "sk-log-2", "sk-log-3"].map((k) => (
                  <Skeleton key={k} className="h-20" />
                ))}
              </div>
            ) : typedLog.length === 0 ? (
              <div
                className="flex flex-col items-center py-10 text-center"
                data-ocid="notifications.log.empty_state"
              >
                <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No notifications sent yet for this student.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {typedLog.map((log, i) => (
                  <div
                    key={log.id}
                    className="border border-border rounded-lg p-3 space-y-1.5 hover:bg-muted/20 transition-colors"
                    data-ocid={`notifications.log.item.${i + 1}`}
                  >
                    <p className="text-sm text-foreground leading-snug">
                      {log.message}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{log.parentEmail}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{formatSentAt(log.sentAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NotificationsPage;
