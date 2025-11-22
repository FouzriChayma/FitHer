"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { type Language } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success && result.user) {
        // Redirect based on user role from login response
        setTimeout(() => {
          if (result.user?.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
        }, 100);
      } else {
        setError(result.error || "Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-purple-50/20">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="w-full max-w-md border border-slate-200/80 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold text-slate-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-rose-600 hover:text-rose-700">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-rose-600 hover:text-rose-700 font-medium">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

