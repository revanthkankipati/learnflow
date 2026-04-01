import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Clock, Star, Users } from "lucide-react";
import type { Course } from "../backend";

const CATEGORY_COLORS: Record<string, string> = {
  "Web Development": "bg-blue-100 text-blue-700",
  "Data Science": "bg-green-100 text-green-700",
  Design: "bg-pink-100 text-pink-700",
  Business: "bg-amber-100 text-amber-700",
  Mobile: "bg-purple-100 text-purple-700",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-orange-100 text-orange-700",
  advanced: "bg-red-100 text-red-700",
};

const GRADIENT_THUMBS = [
  "from-indigo-500 to-violet-600",
  "from-cyan-500 to-teal-600",
  "from-purple-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-green-600",
];

interface Props {
  course: Course;
  index?: number;
}

export default function CourseCard({ course, index = 0 }: Props) {
  const price = Number(course.price);
  const duration = Number(course.durationMinutes);
  const gradient = GRADIENT_THUMBS[index % GRADIENT_THUMBS.length];
  const catColor =
    CATEGORY_COLORS[course.category] || "bg-slate-100 text-slate-700";
  const diffColor =
    DIFFICULTY_COLORS[course.difficultyLevel?.toLowerCase()] ||
    "bg-slate-100 text-slate-700";

  return (
    <Card className="card-hover overflow-hidden flex flex-col h-full">
      <Link to="/courses/$courseId" params={{ courseId: course.id.toString() }}>
        <div className="relative aspect-video overflow-hidden">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <span className="text-white/80 text-4xl font-bold">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${catColor}`}
            >
              {course.category}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className="bg-white/90 text-primary font-bold text-sm px-2 py-1 rounded-full">
              {price === 0 ? "Free" : `$${price}`}
            </span>
          </div>
        </div>
      </Link>
      <CardContent className="p-4 flex-1">
        <Link
          to="/courses/$courseId"
          params={{ courseId: course.id.toString() }}
        >
          <h3 className="font-semibold text-foreground leading-snug mb-1 hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">
          {course.instructorName}
        </p>
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i <= 4 ? "fill-amber-400 text-amber-400" : "text-muted"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{duration}m</span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${diffColor}`}
        >
          {course.difficultyLevel}
        </span>
      </CardFooter>
    </Card>
  );
}
