import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Play,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import CourseCard from "../components/CourseCard";
import { useGetAllCourses } from "../hooks/useQueries";

const CATEGORIES = [
  { name: "Web Development", icon: "💻", count: "2.3k courses" },
  { name: "Data Science", icon: "📊", count: "1.8k courses" },
  { name: "Design", icon: "🎨", count: "1.2k courses" },
  { name: "Business", icon: "📈", count: "900 courses" },
  { name: "Mobile", icon: "📱", count: "750 courses" },
  { name: "Cloud & DevOps", icon: "☁️", count: "600 courses" },
];

const STATS = [
  { icon: BookOpen, label: "Courses", value: "10,000+" },
  { icon: Users, label: "Students", value: "500K+" },
  { icon: Award, label: "Instructors", value: "2,000+" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse Courses",
    desc: "Explore thousands of courses across dozens of categories taught by world-class instructors.",
  },
  {
    step: "02",
    title: "Enroll & Learn",
    desc: "Watch HD video lessons, complete exercises, and track your progress at your own pace.",
  },
  {
    step: "03",
    title: "Get Certified",
    desc: "Complete courses and earn certificates you can share with employers and your network.",
  },
];

export default function Home() {
  const { data: courses = [], isLoading } = useGetAllCourses();
  const featured = courses.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section
        className="hero-gradient text-white relative overflow-hidden"
        data-ocid="home.section"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/assets/generated/hero-banner.dim_1400x500.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm">
              🎓 Online Learning Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Learn Without
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.8 0.18 290), oklch(0.75 0.2 185))",
                }}
              >
                {" "}
                Limits
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              Access world-class courses from expert instructors. Master new
              skills at your own pace and advance your career.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
                data-ocid="home.browse.primary_button"
              >
                <Link to="/courses">
                  Explore Courses <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10"
                data-ocid="home.demo.secondary_button"
              >
                <Link to="/courses">
                  <Play className="mr-2 w-4 h-4" /> Watch Demo
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-8 mt-12"
          >
            {STATS.map(({ icon: Icon, label, value }) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">{value}</div>
                  <div className="text-white/70 text-sm">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
            <p className="text-muted-foreground">
              Choose from hundreds of topics and start learning today
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to="/courses"
                  className="flex flex-col items-center p-4 rounded-xl bg-white border border-border hover:border-primary hover:shadow-md transition-all group text-center"
                  data-ocid="home.category.link"
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {cat.count}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
              <p className="text-muted-foreground">
                Handpicked courses by our editorial team
              </p>
            </div>
            <Button asChild variant="outline" data-ocid="home.view_all.button">
              <Link to="/courses">
                View All <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="courses.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  key={`sk-${i}`}
                  className="rounded-xl bg-white h-72 animate-pulse"
                />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div
              className="text-center py-20 bg-white rounded-2xl border border-border"
              data-ocid="courses.empty_state"
            >
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to create a course on LearnFlow
              </p>
              <Button asChild data-ocid="home.create_course.button">
                <Link to="/instructor">Create a Course</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((course, i) => (
                <motion.div
                  key={course.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`courses.item.${i + 1}`}
                >
                  <CourseCard course={course} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Start learning in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border"
              >
                <div className="text-5xl font-extrabold text-primary/20 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Join thousands of students already learning on LearnFlow
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold"
            data-ocid="home.cta.primary_button"
          >
            <Link to="/courses">
              Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
