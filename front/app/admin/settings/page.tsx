"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { sessionsAPI } from "@/lib/api";
import { Shield, Lock, User, Monitor, Trash2, Mail, Calendar, AlertTriangle, Eye, EyeOff, Edit2, Save, X } from "lucide-react";

export default function AdminSettings() {
  const { user, updateProfilePicture, updatePassword, updateProfile, getActiveSessions, logout, deleteUser } = useAuth();
  const router = useRouter();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

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
        setIsEditingProfile(false);
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

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
    });
    setErrors({ profile: "" });
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
        setIsEditingPassword(false);
        setShowPassword({ current: false, new: false, confirm: false });
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
      loadSessions();
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (deleteConfirmText !== "DELETE") {
      setErrors({ delete: "Please type DELETE to confirm" });
      return;
    }

    setIsDeleting(true);
    
    try {
      // Note: The backend prevents deleting own account, so this will fail
      // But we try anyway for consistency
      const success = await deleteUser(user.id);
      if (success) {
        // Logout and redirect to home
        await logout();
        router.push("/");
      } else {
        setErrors({ delete: "Failed to delete account. You cannot delete your own account." });
      }
    } catch (error) {
      setErrors({ delete: "An error occurred. You cannot delete your own account." });
    } finally {
      setIsDeleting(false);
    }
  };

  const getAccountAge = () => {
    if (!user?.createdAt) return "Unknown";
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-600">Manage your account settings and preferences</p>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-5xl mx-auto">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Account Overview - Compact Header */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300">
                  <User className="w-8 h-8 text-slate-500" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-medium text-purple-600">Administrator</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-500">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Section */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-600" />
              <CardTitle className="text-lg text-slate-800">Profile Picture</CardTitle>
            </div>
            <CardDescription>Upload, change, or remove your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ProfilePictureUpload
              currentPicture={user.profilePicture}
              onPictureChange={handleProfilePictureChange}
              userId={user.id}
            />
            {errors.profilePicture && (
              <p className="text-sm text-red-500 mt-4 text-center">{errors.profilePicture}</p>
            )}
          </CardContent>
        </Card>

        {/* Profile Information Section */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-5 h-5 text-slate-600" />
                  <CardTitle className="text-lg text-slate-800">Profile Information</CardTitle>
                </div>
                <CardDescription>Your personal information and account details</CardDescription>
              </div>
              {!isEditingProfile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {!isEditingProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wide font-medium">Full Name</Label>
                  <p className="text-base font-semibold text-slate-900">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email Address</Label>
                  <p className="text-base font-semibold text-slate-900 break-all">{user.email}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                {errors.profile && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errors.profile}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      className="border-slate-200 focus:border-slate-300 focus:ring-slate-200/50"
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
                      className="border-slate-200 focus:border-slate-300 focus:ring-slate-200/50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEditProfile}
                    disabled={isLoading}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <CardTitle className="text-lg text-slate-800">Password</CardTitle>
                </div>
                <CardDescription>Update your account password for better security</CardDescription>
              </div>
              {!isEditingPassword && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingPassword(true);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setErrors({ password: "" });
                  }}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {!isEditingPassword ? (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Password is set</p>
                  <p className="text-xs text-slate-500">Last updated: Recently</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                {errors.password && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errors.password}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-700 font-medium">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                      disabled={isLoading}
                      className="border-slate-200 focus:border-slate-300 focus:ring-slate-200/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-700 font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        disabled={isLoading}
                        minLength={6}
                        className="border-slate-200 focus:border-slate-300 focus:ring-slate-200/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Must be at least 6 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        disabled={isLoading}
                        className="border-slate-200 focus:border-slate-300 focus:ring-slate-200/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditingPassword(false);
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      setErrors({ password: "" });
                      setShowPassword({ current: false, new: false, confirm: false });
                    }}
                    disabled={isLoading}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Active Sessions Section */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-slate-600" />
              <CardTitle className="text-lg text-slate-800">Active Sessions</CardTitle>
            </div>
            <CardDescription>Manage your active login sessions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {sessions.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No active sessions</p>
            ) : (
              <div className="space-y-4">
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
                          {new Date(session.loginTime).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(session.loginTime).toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {session.userAgent?.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.isCurrent && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Current
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
                          End Session
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border border-red-200 shadow-sm bg-red-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-lg text-red-900">Danger Zone</CardTitle>
              </div>
              <CardDescription className="text-red-700">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Delete Account</h3>
                    <p className="text-sm text-slate-600">
                      Once you delete your account, there is no going back. Please be certain.
                      All your data will be permanently removed.
                    </p>
                  </div>
                  <Trash2 className="w-6 h-6 text-red-500 flex-shrink-0" />
                </div>
                
                {!showDeleteConfirm ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete My Account
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                      <p className="text-sm text-red-900 font-medium mb-2">
                        ⚠️ Warning: This action cannot be undone!
                      </p>
                      <p className="text-xs text-red-700">
                        This will permanently delete your account and all associated data.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deleteConfirm" className="text-red-900 font-medium">
                        Type <span className="font-bold">DELETE</span> to confirm:
                      </Label>
                      <Input
                        id="deleteConfirm"
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => {
                          setDeleteConfirmText(e.target.value);
                          setErrors({ ...errors, delete: "" });
                        }}
                        placeholder="Type DELETE here"
                        className="border-red-300 focus:border-red-400 focus:ring-red-200"
                      />
                      {errors.delete && (
                        <p className="text-xs text-red-600">{errors.delete}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                          setErrors({ ...errors, delete: "" });
                        }}
                        disabled={isDeleting}
                        className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || deleteConfirmText !== "DELETE"}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account Permanently
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

