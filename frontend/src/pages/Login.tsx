import * as React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Boxes, Eye, EyeOff, ArrowRight, Sparkles, Shield, Users, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToastNotification } from "@/components/Common/Toast";
import { cn } from "@/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToastNotification();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      addToast("success", "Welcome back!", "You have been logged in successfully.");
      navigate("/dashboard");
    } catch (error) {
      addToast("error", "Login failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Users, text: "Team collaboration" },
    { icon: Shield, text: "Secure & reliable" },
    { icon: Zap, text: "Real-time updates" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-2xl gradient-primary p-4 mb-6 shadow-lg shadow-primary/30 animate-pulse-glow">
              <Boxes className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Demo credentials */}
          <div className="rounded-2xl bg-gradient-to-br from-accent/80 via-accent/50 to-transparent border border-primary/10 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Demo Credentials</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-between text-muted-foreground">
                <span>Admin:</span>
                <code className="px-2 py-1 bg-background/80 rounded-lg text-foreground font-medium">admin@example.com</code>
              </p>
              <p className="flex items-center justify-between text-muted-foreground">
                <span>Leader:</span>
                <code className="px-2 py-1 bg-background/80 rounded-lg text-foreground font-medium">leader@example.com</code>
              </p>
              <p className="flex items-center justify-between text-muted-foreground">
                <span>Member:</span>
                <code className="px-2 py-1 bg-background/80 rounded-lg text-foreground font-medium">member@example.com</code>
              </p>
              <p className="text-xs mt-3 text-muted-foreground/70 text-center">Any password works for demo</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={cn(
                    "pl-11 h-12 rounded-xl border-2 transition-all duration-200",
                    "focus:border-primary focus:ring-4 focus:ring-primary/10",
                    errors.email ? "border-destructive" : "border-input hover:border-primary/50"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={cn(
                    "pl-11 pr-11 h-12 rounded-xl border-2 transition-all duration-200",
                    "focus:border-primary focus:ring-4 focus:ring-primary/10",
                    errors.password ? "border-destructive" : "border-input hover:border-primary/50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl gradient-primary border-0 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-sidebar relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <div className="max-w-lg space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-sidebar-foreground/80">
              <Sparkles className="h-4 w-4 text-warning" />
              Trusted by 10,000+ teams
            </div>

            <h2 className="text-4xl font-bold text-sidebar-foreground leading-tight">
              Manage your workspace{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                efficiently
              </span>
            </h2>

            <p className="text-lg text-sidebar-muted leading-relaxed">
              Collaborate with your team, track tasks, and deliver projects on time
              with our powerful workspace management platform.
            </p>

            {/* Features */}
            <div className="flex items-center justify-center gap-6 pt-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sidebar-foreground/80">
                  <div className="p-2 rounded-lg bg-white/10">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
