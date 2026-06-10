import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Shield } from "lucide-react";

export function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      data-ocid="login.page"
    >
      <div className="w-full max-w-md px-4">
        {/* Hero image */}
        <div className="w-full rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img
            src="/assets/generated/attendance-hero.dim_1200x600.jpg"
            alt="School Attendance Management"
            className="w-full h-40 object-cover"
          />
        </div>

        <Card className="border-border shadow-lg">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "oklch(var(--primary))" }}
              >
                <Calendar className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold font-display text-foreground">
                School Attendance Manager
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                Sign in with Internet Identity to access the attendance
                management system
              </p>
            </div>

            {/* Features list */}
            <ul className="space-y-2 mb-8">
              {[
                "Track student attendance across all classes",
                "Generate reports and monitor trends",
                "Notify parents of absences",
              ].map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "oklch(var(--accent))" }}
                  />
                  {feat}
                </li>
              ))}
            </ul>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => login()}
              disabled={isLoading}
              data-ocid="login.submit_button"
            >
              <Shield className="w-4 h-4" />
              {isLoading ? "Signing in..." : "Sign in with Internet Identity"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Secure, decentralized authentication — no password required
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
