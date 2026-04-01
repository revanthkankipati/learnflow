import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Instructor from "./pages/Instructor";
import LessonViewer from "./pages/LessonViewer";
import Quiz from "./pages/Quiz";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses",
  component: Courses,
});
const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses/$courseId",
  component: CourseDetail,
});
const lessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses/$courseId/lesson/$lessonId",
  component: LessonViewer,
});
const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses/$courseId/quiz",
  component: Quiz,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});
const instructorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/instructor",
  component: Instructor,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  coursesRoute,
  courseDetailRoute,
  lessonRoute,
  quizRoute,
  dashboardRoute,
  instructorRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
