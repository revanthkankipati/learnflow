import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Shield } from "lucide-react";
import React from "react";

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) {
      navigate({ to: "/dashboard" });
    }
  };

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
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold font-display text-foreground">
                School Attendance Manager
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                Sign in to access the attendance management system
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  data-ocid="login.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-ocid="login.password_input"
                />
              </div>

              {error && (
                <p
                  className="text-sm text-destructive font-medium"
                  data-ocid="login.error_state"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2 mt-2"
                size="lg"
                disabled={isLoading}
                data-ocid="login.submit_button"
              >
                <Shield className="w-4 h-4" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Demo credentials: <strong>teacher / teacher123</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
