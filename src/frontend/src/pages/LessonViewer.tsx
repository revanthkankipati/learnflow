import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  Loader2,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetCourse,
  useGetLesson,
  useGetMyEnrollments,
  useMarkLessonComplete,
} from "../hooks/useQueries";

export default function LessonViewer() {
  const { courseId, lessonId } = useParams({
    from: "/courses/$courseId/lesson/$lessonId",
  });
  const { data: course } = useGetCourse(BigInt(courseId));
  const { data: lesson, isLoading } = useGetLesson(BigInt(lessonId));
  const { data: enrollments = [] } = useGetMyEnrollments();
  const markComplete = useMarkLessonComplete();

  const enrollment = enrollments.find(
    (e) => e.courseId.toString() === courseId,
  );
  const completedLessons = enrollment?.completedLessons ?? [];
  const isCompleted = completedLessons.some((cl) => cl.toString() === lessonId);
  const lessonIds = course?.lessonIds ?? [];
  const currentIndex = lessonIds.findIndex((l) => l.toString() === lessonId);
  const prevLesson = currentIndex > 0 ? lessonIds[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessonIds.length - 1 ? lessonIds[currentIndex + 1] : null;
  const progress =
    lessonIds.length > 0
      ? Math.round((completedLessons.length / lessonIds.length) * 100)
      : 0;

  const handleMarkComplete = async () => {
    try {
      await markComplete.mutateAsync({
        courseId: BigInt(courseId),
        lessonId: BigInt(lessonId),
      });
      toast.success("Lesson marked as complete!");
    } catch {
      toast.error("Failed to mark complete");
    }
  };

  const getVideoEmbed = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return url;
  };

  return (
    <div
      className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]"
      data-ocid="lesson.page"
    >
      {/* Main Video Area */}
      <div className="flex-1 bg-gray-950">
        <div className="p-3 flex items-center gap-3 bg-gray-900 border-b border-gray-800">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white"
            data-ocid="lesson.back.button"
          >
            <Link to="/courses/$courseId" params={{ courseId }}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Course
            </Link>
          </Button>
          {course && (
            <span className="text-white/70 text-sm truncate">
              {course.title}
            </span>
          )}
        </div>

        {isLoading ? (
          <div
            className="flex items-center justify-center h-64"
            data-ocid="lesson.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : lesson ? (
          <div>
            <div className="aspect-video bg-black">
              {lesson.videoUrl ? (
                <iframe
                  src={getVideoEmbed(lesson.videoUrl) ?? ""}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={lesson.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <PlayCircle className="w-16 h-16" />
                </div>
              )}
            </div>

            <div className="p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-white/70 mb-6">{lesson.description}</p>

              <div className="flex flex-wrap items-center gap-3">
                {!isCompleted ? (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={markComplete.isPending}
                    className="bg-accent hover:bg-accent/90"
                    data-ocid="lesson.complete.button"
                  >
                    {markComplete.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Mark as Complete
                  </Button>
                ) : (
                  <span
                    className="flex items-center gap-2 text-accent font-medium"
                    data-ocid="lesson.completed.success_state"
                  >
                    <CheckCircle className="w-5 h-5" /> Completed
                  </span>
                )}

                {prevLesson && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    data-ocid="lesson.prev.button"
                  >
                    <Link
                      to="/courses/$courseId/lesson/$lessonId"
                      params={{ courseId, lessonId: prevLesson.toString() }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </Link>
                  </Button>
                )}
                {nextLesson && (
                  <Button
                    asChild
                    className="bg-primary"
                    data-ocid="lesson.next.button"
                  >
                    <Link
                      to="/courses/$courseId/lesson/$lessonId"
                      params={{ courseId, lessonId: nextLesson.toString() }}
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 border-l border-border bg-white overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold mb-2">Course Progress</h3>
          <Progress value={progress} className="progress-teal h-2 mb-1" />
          <span className="text-xs text-muted-foreground">
            {progress}% complete ({completedLessons.length}/{lessonIds.length}{" "}
            lessons)
          </span>
        </div>
        <div className="p-2">
          {lessonIds.map((lid, idx) => {
            const isCurrentLesson = lid.toString() === lessonId;
            const isDone = completedLessons.some(
              (cl) => cl.toString() === lid.toString(),
            );
            return (
              <Link
                key={lid.toString()}
                to="/courses/$courseId/lesson/$lessonId"
                params={{ courseId, lessonId: lid.toString() }}
                className={`flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${
                  isCurrentLesson
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50"
                }`}
                data-ocid={`lesson.sidebar.item.${idx + 1}`}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                ) : (
                  <PlayCircle
                    className={`w-4 h-4 shrink-0 ${isCurrentLesson ? "text-primary" : "text-muted-foreground"}`}
                  />
                )}
                <span className="text-sm">Lesson {idx + 1}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
