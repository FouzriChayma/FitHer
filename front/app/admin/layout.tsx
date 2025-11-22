"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Users, Calculator, Home, LayoutDashboard, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/calculator");
      }
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white border-r border-slate-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">FitHer AI</h1>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors group"
            >
              <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <Link
              href="/calculator"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculator</span>
            </Link>
            <div className="pt-4 mt-4 border-t border-slate-800">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Front Office</span>
              </Link>
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-800">
            <div className="mb-4 p-3 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-slate-700 text-white hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
}

