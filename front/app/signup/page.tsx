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
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { useToast } from "@/components/ui/toast";

export default function SignupPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as UserRole,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup, user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push("/calculator");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Convert profile picture to base64 if exists
      let profilePictureBase64: string | undefined;
      if (profilePictureFile) {
        profilePictureBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(profilePictureFile);
        });
      }

      const result = await signup(
        formData.name, 
        formData.email, 
        formData.password, 
        formData.role,
        profilePictureBase64
      );
      if (result.success) {
        // Clear any errors
        setError("");
        if (formData.role === "admin") {
          // Admin accounts auto-login - redirect to admin dashboard
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 100);
        } else {
          showToast(
            "Account created successfully! Your account is pending activation. An administrator will activate it soon.",
            "success",
            6000
          );
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } else {
        setError(result.error || "Email already registered. Please use a different email or try logging in.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
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
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Join FitHer AI and start your wellness journey
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
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-700 font-medium">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  {formData.role === "admin" 
                    ? "Admin accounts are activated immediately" 
                    : "User accounts require admin activation"}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-slate-700 font-medium">Profile Picture (Optional)</Label>
                <ProfilePictureUpload
                  currentPicture={profilePicturePreview || undefined}
                  onPictureChange={(file) => {
                    setProfilePictureFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setProfilePicturePreview(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setProfilePicturePreview(null);
                    }
                  }}
                />
              </div>

              <div className="text-sm text-slate-600">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-rose-600 hover:text-rose-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-rose-600 hover:text-rose-700">
                  Privacy Policy
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="text-rose-600 hover:text-rose-700 font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

