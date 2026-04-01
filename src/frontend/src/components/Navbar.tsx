import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/courses", search: { q: searchQ } as any });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-primary shrink-0"
          data-ocid="nav.link"
        >
          <GraduationCap className="w-7 h-7" />
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            LearnFlow
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              data-ocid="nav.search_input"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          <Link
            to="/courses"
            className="[&.active]:text-primary px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.courses.link"
          >
            Browse
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="[&.active]:text-primary px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.dashboard.link"
            >
              My Learning
            </Link>
          )}
          <Link
            to="/instructor"
            className="[&.active]:text-primary px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.instructor.link"
          >
            Teach
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              data-ocid="nav.logout.button"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={loginStatus === "logging-in"}
              data-ocid="nav.login.button"
            >
              {loginStatus === "logging-in" ? "Signing in..." : "Sign In"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-2">
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search courses..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              data-ocid="nav.mobile.search_input"
            />
          </form>
          <Link
            to="/courses"
            className="py-2 text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Browse Courses
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              My Learning
            </Link>
          )}
          <Link
            to="/instructor"
            className="py-2 text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Teach
          </Link>
        </div>
      )}
    </header>
  );
}
