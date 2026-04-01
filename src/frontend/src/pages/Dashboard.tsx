import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  Loader2,
  Play,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllCourses,
  useGetMyEnrollments,
  useGetMyQuizResults,
} from "../hooks/useQueries";

export default function Dashboard() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: enrollments = [], isLoading: enrLoading } =
    useGetMyEnrollments();
  const { data: quizResults = [] } = useGetMyQuizResults();
  const { data: allCourses = [] } = useGetAllCourses();

  const getCourse = (courseId: bigint) =>
    allCourses.find((c) => c.id.toString() === courseId.toString());

  if (!isAuthenticated)
    return (
      <div
        className="container mx-auto px-4 py-24 text-center"
        data-ocid="dashboard.page"
      >
        <GraduationCap className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-3">
          Sign in to see your dashboard
        </h2>
        <p className="text-muted-foreground mb-6">
          Track your progress and continue learning
        </p>
        <Button
          onClick={login}
          disabled={loginStatus === "logging-in"}
          data-ocid="dashboard.login.button"
        >
          {loginStatus === "logging-in" ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    );

  const stats = [
    { icon: BookOpen, label: "Enrolled Courses", value: enrollments.length },
    { icon: Trophy, label: "Quizzes Taken", value: quizResults.length },
    {
      icon: TrendingUp,
      label: "Avg Quiz Score",
      value:
        quizResults.length > 0
          ? `${Math.round(quizResults.reduce((s, q) => s + Number(q.score), 0) / quizResults.length)}%`
          : "—",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10" data-ocid="dashboard.page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">My Dashboard</h1>
        <p className="text-muted-foreground">Track your learning progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">My Courses</h2>
        {enrLoading ? (
          <div
            className="text-center py-12"
            data-ocid="dashboard.courses.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : enrollments.length === 0 ? (
          <div
            className="text-center py-16 bg-white rounded-2xl border border-border"
            data-ocid="dashboard.courses.empty_state"
          >
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">
              Enroll in a course to get started
            </p>
            <Button asChild data-ocid="dashboard.browse.button">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enr, i) => {
              const course = getCourse(enr.courseId);
              const progress = Number(enr.completionPercentage);
              const lessonCount = course?.lessonIds.length ?? 0;
              const completedCount = enr.completedLessons.length;
              const firstLessonId = course?.lessonIds[0];
              return (
                <motion.div
                  key={enr.courseId.toString()}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`dashboard.course.item.${i + 1}`}
                >
                  <Card className="card-hover">
                    <CardContent className="p-5">
                      <div className="mb-3">
                        <h3 className="font-semibold mb-1 line-clamp-1">
                          {course?.title ?? `Course #${enr.courseId}`}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {course?.instructorName}
                        </p>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            {completedCount}/{lessonCount} lessons
                          </span>
                          <span className="font-medium text-accent">
                            {progress}%
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          className="progress-teal h-2"
                        />
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="w-full"
                        data-ocid={`dashboard.continue.button.${i + 1}`}
                      >
                        <Link
                          to={
                            firstLessonId
                              ? "/courses/$courseId/lesson/$lessonId"
                              : "/courses/$courseId"
                          }
                          params={
                            firstLessonId
                              ? {
                                  courseId: enr.courseId.toString(),
                                  lessonId: firstLessonId.toString(),
                                }
                              : { courseId: enr.courseId.toString() }
                          }
                        >
                          <Play className="w-3 h-3 mr-1" /> Continue
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quiz Results */}
      {quizResults.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
          <div className="space-y-2">
            {quizResults.map((result, i) => {
              const course = getCourse(result.courseId);
              return (
                <Card
                  key={result.courseId.toString()}
                  data-ocid={`dashboard.quiz.item.${i + 1}`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {course?.title ?? `Course #${result.courseId}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.answers.length} questions answered
                      </p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Score: {Number(result.score)}%
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
