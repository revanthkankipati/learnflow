import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  PlayCircle,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StarRating from "../components/StarRating";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddReview,
  useEnrollInCourse,
  useGetCourse,
  useGetCourseReviews,
  useGetMyEnrollments,
} from "../hooks/useQueries";

export default function CourseDetail() {
  const { courseId } = useParams({ from: "/courses/$courseId" });
  const { data: course, isLoading } = useGetCourse(BigInt(courseId));
  const { data: reviews = [] } = useGetCourseReviews(BigInt(courseId));
  const { data: enrollments = [] } = useGetMyEnrollments();
  const { identity } = useInternetIdentity();
  const enrollMutation = useEnrollInCourse();
  const reviewMutation = useAddReview();

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const isEnrolled = enrollments.some(
    (e) => e.courseId.toString() === courseId,
  );
  const enrollment = enrollments.find(
    (e) => e.courseId.toString() === courseId,
  );
  const isAuthenticated = !!identity;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to enroll");
      return;
    }
    try {
      await enrollMutation.mutateAsync(BigInt(courseId));
      toast.success("Enrolled successfully!");
    } catch {
      toast.error("Failed to enroll");
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to review");
      return;
    }
    try {
      await reviewMutation.mutateAsync({
        courseId: BigInt(courseId),
        rating: BigInt(rating),
        reviewText,
      });
      setReviewText("");
      toast.success("Review submitted!");
    } catch {
      toast.error("Failed to submit review");
    }
  };

  if (isLoading)
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="course_detail.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>
    );
  if (!course)
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="course_detail.error_state"
      >
        <h2 className="text-xl font-bold">Course not found</h2>
      </div>
    );

  return (
    <div data-ocid="course_detail.page">
      {/* Header */}
      <div className="hero-gradient text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-3 bg-white/20 text-white border-white/30">
              {course.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {course.title}
            </h1>
            <p className="text-white/80 mb-6">{course.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> {course.lessonIds.length}{" "}
                lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {Number(course.durationMinutes)}{" "}
                min
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" /> {course.difficultyLevel}
              </span>
              <span>By {course.instructorName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lessons */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Course Content</h2>
                {course.lessonIds.length === 0 ? (
                  <p className="text-muted-foreground">No lessons added yet</p>
                ) : (
                  <div className="space-y-2">
                    {course.lessonIds.map((lid, idx) => {
                      const isCompleted = enrollment?.completedLessons.some(
                        (cl) => cl.toString() === lid.toString(),
                      );
                      return (
                        <div
                          key={lid.toString()}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          data-ocid={`course_detail.lesson.item.${idx + 1}`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                          ) : (
                            <PlayCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                          )}
                          <span className="text-sm flex-1">
                            Lesson {idx + 1}
                          </span>
                          {isEnrolled ? (
                            <Button asChild size="sm" variant="ghost">
                              <Link
                                to="/courses/$courseId/lesson/$lessonId"
                                params={{ courseId, lessonId: lid.toString() }}
                              >
                                Watch
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {course.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Student Reviews</h2>
                {isEnrolled && (
                  <form
                    onSubmit={handleReview}
                    className="mb-6 p-4 bg-muted/40 rounded-xl"
                  >
                    <h3 className="font-semibold mb-3">Write a Review</h3>
                    <div className="mb-3">
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        size="lg"
                      />
                    </div>
                    <Textarea
                      placeholder="Share your experience..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="mb-3"
                      data-ocid="review.textarea"
                    />
                    <Button
                      type="submit"
                      disabled={reviewMutation.isPending}
                      data-ocid="review.submit_button"
                    >
                      {reviewMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Submit Review
                    </Button>
                  </form>
                )}
                {reviews.length === 0 ? (
                  <p
                    className="text-muted-foreground text-center py-8"
                    data-ocid="reviews.empty_state"
                  >
                    No reviews yet. Be the first!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review, i) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: static list
                        key={`rev-${i}`}
                        className="p-4 bg-muted/20 rounded-xl"
                        data-ocid={`reviews.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {review.student.toString().charAt(0).toUpperCase()}
                          </div>
                          <StarRating
                            value={Number(review.rating)}
                            readonly
                            size="sm"
                          />
                        </div>
                        <p className="text-sm">{review.reviewText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Number(course.price) === 0
                    ? "Free"
                    : `$${Number(course.price)}`}
                </div>
                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent font-medium">
                      <CheckCircle className="w-5 h-5" /> Enrolled
                    </div>
                    <Button
                      asChild
                      className="w-full"
                      data-ocid="course_detail.continue.button"
                    >
                      <Link
                        to={
                          course.lessonIds.length > 0
                            ? "/courses/$courseId/lesson/$lessonId"
                            : "/courses/$courseId"
                        }
                        params={
                          course.lessonIds.length > 0
                            ? {
                                courseId,
                                lessonId: course.lessonIds[0].toString(),
                              }
                            : { courseId }
                        }
                      >
                        Continue Learning
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      data-ocid="course_detail.quiz.button"
                    >
                      <Link to="/courses/$courseId/quiz" params={{ courseId }}>
                        Take Quiz
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                    data-ocid="course_detail.enroll.button"
                  >
                    {enrollMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {Number(course.price) === 0
                      ? "Enroll for Free"
                      : "Enroll Now"}
                  </Button>
                )}
                <Separator className="my-4" />
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    {course.lessonIds.length} lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {Number(course.durationMinutes)} minutes total
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    {course.difficultyLevel}
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Certificate of completion
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
