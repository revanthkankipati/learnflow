import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Trophy,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCourse, useSubmitQuiz } from "../hooks/useQueries";

// Static quiz data for demo since we can't fetch questions directly
const DEMO_QUESTIONS = [
  {
    questionText: "What is React?",
    answerOptions: [
      "A database",
      "A JavaScript UI library",
      "A CSS framework",
      "A server",
    ],
    correctAnswerIndex: 1,
  },
  {
    questionText: "What hook is used for side effects?",
    answerOptions: ["useState", "useRef", "useEffect", "useMemo"],
    correctAnswerIndex: 2,
  },
  {
    questionText: "What does JSX stand for?",
    answerOptions: [
      "JavaScript XML",
      "Java Syntax Extension",
      "JSON eXtension",
      "None of these",
    ],
    correctAnswerIndex: 0,
  },
];

export default function Quiz() {
  const { courseId } = useParams({ from: "/courses/$courseId/quiz" });
  const { data: course } = useGetCourse(BigInt(courseId));
  const { identity } = useInternetIdentity();
  const submitQuiz = useSubmitQuiz();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = DEMO_QUESTIONS;
  const totalQ = questions.length;
  const progress = (currentQ / totalQ) * 100;

  const handleSelectAnswer = (idx: number) => {
    if (!submitted) setSelectedAnswer(idx);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    if (currentQ < totalQ - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: number[]) => {
    if (!identity) {
      toast.error("Please sign in");
      return;
    }
    try {
      const result = await submitQuiz.mutateAsync({
        courseId: BigInt(courseId),
        answers: finalAnswers.map((a) => BigInt(a)),
      });
      setScore(Number(result));
      setSubmitted(true);
    } catch {
      // Calculate locally as fallback
      const correct = finalAnswers.filter(
        (a, i) => a === questions[i]?.correctAnswerIndex,
      ).length;
      setScore(Math.round((correct / totalQ) * 100));
      setSubmitted(true);
    }
  };

  if (submitted && score !== null)
    return (
      <div
        className="container mx-auto px-4 py-20 max-w-lg text-center"
        data-ocid="quiz.success_state"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Trophy
            className={`w-20 h-20 mx-auto mb-4 ${score >= 70 ? "text-amber-400" : "text-muted-foreground"}`}
          />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <div
            className={`text-6xl font-extrabold mb-4 ${score >= 70 ? "text-primary" : "text-destructive"}`}
          >
            {score}%
          </div>
          <p className="text-muted-foreground mb-2">
            {score >= 70
              ? "Excellent work! You passed the quiz."
              : "Keep studying and try again."}
          </p>
          <Badge
            className={
              score >= 70
                ? "bg-accent/20 text-accent border-accent/30"
                : "bg-destructive/10 text-destructive"
            }
          >
            {score >= 70 ? "PASSED" : "NEEDS IMPROVEMENT"}
          </Badge>
          <div className="flex gap-3 justify-center mt-8">
            <Button asChild variant="outline" data-ocid="quiz.back.button">
              <Link to="/courses/$courseId" params={{ courseId }}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Course
              </Link>
            </Button>
            <Button asChild data-ocid="quiz.dashboard.button">
              <Link to="/dashboard">My Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );

  const question = questions[currentQ];

  return (
    <div
      className="container mx-auto px-4 py-10 max-w-2xl"
      data-ocid="quiz.page"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{course?.title ?? "Quiz"}</h1>
          <span className="text-sm text-muted-foreground">
            {currentQ + 1} / {totalQ}
          </span>
        </div>
        <Progress value={progress} className="progress-teal h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{question.questionText}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.answerOptions.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === i
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  data-ocid={`quiz.option.item.${i + 1}`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button asChild variant="outline" data-ocid="quiz.cancel.button">
          <Link to="/courses/$courseId" params={{ courseId }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Exit
          </Link>
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null || submitQuiz.isPending}
          data-ocid="quiz.next.button"
        >
          {submitQuiz.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {currentQ < totalQ - 1 ? (
            <>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Submit Quiz"
          )}
        </Button>
      </div>
    </div>
  );
}
