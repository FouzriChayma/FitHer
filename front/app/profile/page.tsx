"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { sessionsAPI } from "@/lib/api";
import { type Language } from "@/lib/i18n";
import { Lock, User, Monitor, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const [language, setLanguage] = useState<Language>("en");
  const { user, updateProfilePicture, updatePassword, updateProfile, getActiveSessions } = useAuth();
  const router = useRouter();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
      });
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      const activeSessions = await getActiveSessions();
      setSessions(activeSessions || []);
    } catch (error) {
      console.error("Error loading sessions:", error);
      setSessions([]);
    }
  };

  const handleProfilePictureChange = async (file: File | null) => {
    if (!user) return;

    setProfilePictureFile(file);
    if (file) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const success = await updateProfilePicture(user.id, base64);
        if (success) {
          setSuccess("Profile picture updated successfully!");
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error) {
        setErrors({ profilePicture: "Failed to upload image" });
      }
    } else {
      // Remove picture
      const success = await updateProfilePicture(user.id, null);
      if (success) {
        setSuccess("Profile picture removed successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrors({});
    setIsLoading(true);

    try {
      const success = await updateProfile(user.id, profileForm.name, profileForm.email);
      if (success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setErrors({ profile: "Email already exists or update failed" });
      }
    } catch (error) {
      setErrors({ profile: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrors({});

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors({ password: "New passwords do not match" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrors({ password: "New password must be at least 6 characters" });
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(
        user.id,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (result.success) {
        setSuccess("Password updated successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setErrors({ password: result.error || "Failed to update password" });
      }
    } catch (error) {
      setErrors({ password: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      await sessionsAPI.endSession(sessionId);
      await loadSessions();
      
      // If ending current session, logout
      const token = localStorage.getItem("fither-token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.sessionId === sessionId) {
            // Current session ended, logout
            await logout();
            router.push("/login");
          }
        } catch {
          // If can't decode token, just reload sessions
        }
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-purple-50/20">
        <Navbar language={language} onLanguageChange={setLanguage} />
        
        <main className="max-w-4xl mx-auto p-4 md:p-8 pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
            <p className="text-slate-600">Manage your account settings and preferences</p>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Profile Picture Section */}
          <Card className="border border-slate-200/80 shadow-sm mb-6 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg text-slate-800">Profile Picture</CardTitle>
              </div>
              <CardDescription>Upload, change, or remove your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePictureUpload
                currentPicture={user?.profilePicture}
                onPictureChange={handleProfilePictureChange}
                userId={user?.id}
              />
              {errors.profilePicture && (
                <p className="text-sm text-red-500 mt-2 text-center">{errors.profilePicture}</p>
              )}
            </CardContent>
          </Card>

          {/* Profile Information Section */}
          <Card className="border border-slate-200/80 shadow-sm mb-6 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg text-slate-800">Profile Information</CardTitle>
              </div>
              <CardDescription>Update your name and email address</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {errors.profile && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errors.profile}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
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
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Section */}
          <Card className="border border-slate-200/80 shadow-sm mb-6 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg text-slate-800">Change Password</CardTitle>
              </div>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {errors.password && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errors.password}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-700 font-medium">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    disabled={isLoading}
                    className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-700 font-medium">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    disabled={isLoading}
                    minLength={6}
                    className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                  />
                  <p className="text-xs text-slate-500">Must be at least 6 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                    className="border-slate-200 focus:border-rose-300 focus:ring-rose-200/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Sessions Section */}
          <Card className="border border-slate-200/80 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg text-slate-800">Active Sessions</CardTitle>
              </div>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No active sessions</p>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session, index) => (
                    <div
                      key={session.sessionId || index}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {new Date(session.loginTime).toLocaleDateString()} at{" "}
                            {new Date(session.loginTime).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {session.userAgent?.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.isCurrent && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Current Session
                          </span>
                        )}
                        {!session.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEndSession(session.sessionId)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            End
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}

