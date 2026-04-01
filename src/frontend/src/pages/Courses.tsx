import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import CourseCard from "../components/CourseCard";
import { useGetAllCourses } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Web Development",
  "Data Science",
  "Design",
  "Business",
  "Mobile",
  "Cloud & DevOps",
];
const DIFFICULTIES = ["All", "beginner", "intermediate", "advanced"];

export default function Courses() {
  const { data: courses = [], isLoading } = useGetAllCourses();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    let result = [...courses];
    if (search)
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase()),
      );
    if (category !== "All")
      result = result.filter((c) => c.category === category);
    if (difficulty !== "All")
      result = result.filter(
        (c) => c.difficultyLevel?.toLowerCase() === difficulty,
      );
    if (sort === "price-asc")
      result.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc")
      result.sort((a, b) => Number(b.price) - Number(a.price));
    return result;
  }, [courses, search, category, difficulty, sort]);

  return (
    <div className="container mx-auto px-4 py-10" data-ocid="courses.page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Courses</h1>
        <p className="text-muted-foreground">
          Discover your next skill from {courses.length} available courses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white rounded-xl border border-border">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="courses.search_input"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48" data-ocid="courses.category.select">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-44" data-ocid="courses.difficulty.select">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((d) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <SelectItem key={d} value={d}>
                {d === "All"
                  ? "All Levels"
                  : d.charAt(0).toUpperCase() + d.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-44" data-ocid="courses.sort.select">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
        {(search || category !== "All" || difficulty !== "All") && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setDifficulty("All");
            }}
            data-ocid="courses.clear.button"
          >
            Clear filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-ocid="courses.loading_state"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={`skeleton-${i}`}
              className="rounded-xl bg-white h-72 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-24 bg-white rounded-2xl border border-border"
          data-ocid="courses.empty_state"
        >
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            {courses.length === 0
              ? "No courses available yet"
              : "Try adjusting your filters"}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((course, i) => (
              <motion.div
                key={course.id.toString()}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                data-ocid={`courses.item.${i + 1}`}
              >
                <CourseCard course={course} index={i} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
