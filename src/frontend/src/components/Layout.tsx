import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "@tanstack/react-router";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="text-sm text-muted-foreground font-body">
            School Attendance Management System
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              T
            </div>
            <span className="text-sm font-medium text-foreground">Teacher</span>
          </div>
        </header>
        <main className="flex-1 p-6 bg-background">
          <Outlet />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default Layout;
