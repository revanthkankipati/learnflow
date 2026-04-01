import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer className="bg-sidebar text-sidebar-foreground py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-6 h-6 text-accent" />
              <span
                className="font-bold text-lg"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                LearnFlow
              </span>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Empowering learners worldwide with high-quality online education.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>
                <Link
                  to="/courses"
                  className="hover:text-sidebar-foreground transition-colors"
                >
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/instructor"
                  className="hover:text-sidebar-foreground transition-colors"
                >
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-sidebar-foreground transition-colors"
                >
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Categories</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>Web Development</li>
              <li>Data Science</li>
              <li>Design</li>
              <li>Business</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-sidebar-border pt-6 text-center text-sm text-sidebar-foreground/60">
          © {year}. Built with ❤️ using{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sidebar-foreground"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
