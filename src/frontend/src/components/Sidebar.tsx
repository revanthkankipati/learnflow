import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  LayoutDashboard,
  Monitor,
  UserCircle,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, ocid: "nav.dashboard" },
  { to: "/classes", label: "Classes", icon: BookOpen, ocid: "nav.classes" },
  { to: "/students", label: "Students", icon: Users, ocid: "nav.students" },
  {
    to: "/attendance",
    label: "Attendance",
    icon: Calendar,
    ocid: "nav.attendance",
  },
  {
    to: "/monitoring",
    label: "Monitoring",
    icon: Monitor,
    ocid: "nav.monitoring",
  },
  { to: "/reports", label: "Reports", icon: BarChart3, ocid: "nav.reports" },
  {
    to: "/notifications",
    label: "Notifications",
    icon: Bell,
    ocid: "nav.notifications",
  },
  { to: "/profile", label: "Profile", icon: UserCircle, ocid: "nav.profile" },
];

export function Sidebar() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ background: "oklch(var(--sidebar))" }}
    >
      {/* Logo */}
      <div
        className="h-16 flex items-center px-6 border-b"
        style={{ borderColor: "oklch(var(--sidebar-border))" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(var(--sidebar-primary))" }}
          >
            <Calendar
              className="w-4 h-4"
              style={{ color: "oklch(var(--sidebar-primary-foreground))" }}
            />
          </div>
          <span
            className="font-display font-bold text-sm leading-tight"
            style={{ color: "oklch(var(--sidebar-foreground))" }}
          >
            School Attendance
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.to ||
            (item.to !== "/" && currentPath.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={item.ocid}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                isActive
                  ? "text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent/50",
              )}
              style={
                isActive
                  ? {
                      background: "oklch(var(--sidebar-primary))",
                      color: "oklch(var(--sidebar-primary-foreground))",
                    }
                  : { color: "oklch(var(--sidebar-foreground) / 0.8)" }
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4 border-t"
        style={{
          borderColor: "oklch(var(--sidebar-border))",
          color: "oklch(var(--sidebar-foreground) / 0.5)",
        }}
      >
        <p className="text-xs text-center">
          © {new Date().getFullYear()}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="underline underline-offset-2 hover:opacity-80"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}
