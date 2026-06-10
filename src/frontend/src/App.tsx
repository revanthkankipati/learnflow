import { Layout } from "@/components/Layout";
import { AttendancePage } from "@/pages/AttendancePage";
import { ClassesPage } from "@/pages/ClassesPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { MonitoringPage } from "@/pages/MonitoringPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ReportsPage } from "@/pages/ReportsPage";
import { StudentsPage } from "@/pages/StudentsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const queryClient = new QueryClient();

// Root route — no shell, just an outlet
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  ),
});

// Login route (unauthenticated entry point)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

// Authenticated shell route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const classesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/classes",
  component: ClassesPage,
});

const studentsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/students",
  component: StudentsPage,
});

const attendanceRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/attendance",
  component: AttendancePage,
});

const monitoringRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/monitoring",
  component: MonitoringPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/reports",
  component: ReportsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    classesRoute,
    studentsRoute,
    attendanceRoute,
    monitoringRoute,
    reportsRoute,
    notificationsRoute,
    profileRoute,
  ]),
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
