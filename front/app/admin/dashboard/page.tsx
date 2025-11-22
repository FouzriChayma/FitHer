"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { 
  Users, UserCheck, UserX, Shield, 
  TrendingUp, Activity, Calendar, AlertCircle, ArrowRight 
} from "lucide-react";

export default function AdminDashboard() {
  const { getAllUsers } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  };

  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = users.filter((u) => !u.isActive).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const totalUsers = users.length;
  
  // Calculate statistics
  const activationRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0";
  const recentUsers = users.filter((u: any) => {
    if (!u.createdAt) return false;
    const daysDiff = (Date.now() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  }).length;
  const regularUsers = totalUsers - adminUsers;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600">User Management & System Control</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-600 font-medium uppercase tracking-wide">Total Users</CardTitle>
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold text-slate-900">{totalUsers}</div>
                  <span className="text-sm text-slate-500">users</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">All registered accounts</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-600 font-medium uppercase tracking-wide">Active Users</CardTitle>
                  <UserCheck className="w-5 h-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold text-green-600">{activeUsers}</div>
                  <span className="text-sm text-slate-500">active</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <p className="text-xs text-green-600 font-medium">{activationRate}% activation rate</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-amber-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-600 font-medium uppercase tracking-wide">Pending</CardTitle>
                  <UserX className="w-5 h-5 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold text-amber-600">{inactiveUsers}</div>
                  <span className="text-sm text-slate-500">pending</span>
                </div>
                {inactiveUsers > 0 && (
                  <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Requires action
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-600 font-medium uppercase tracking-wide">Administrators</CardTitle>
                  <Shield className="w-5 h-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold text-purple-600">{adminUsers}</div>
                  <span className="text-sm text-slate-500">admins</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">System administrators</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-600 font-medium uppercase tracking-wide">New Users (30d)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{recentUsers}</div>
                    <p className="text-xs text-slate-500">New registrations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-600 font-medium uppercase tracking-wide">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">Operational</div>
                    <p className="text-xs text-slate-500">All systems normal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-600 font-medium uppercase tracking-wide">User Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Regular Users</span>
                    <span className="font-semibold text-slate-900">{regularUsers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-600">Administrators</span>
                    <span className="font-semibold text-purple-600">{adminUsers}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all" 
                      style={{ width: `${totalUsers > 0 ? (adminUsers / totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {totalUsers > 0 ? ((adminUsers / totalUsers) * 100).toFixed(1) : "0"}% admin ratio
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border border-slate-200 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Quick Actions</CardTitle>
              <CardDescription>Manage users and view detailed information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/admin/users">
                  <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">Manage Users</h3>
                            <p className="text-sm text-slate-500">View and manage all users</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/users">
                  <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">Pending Activations</h3>
                            <p className="text-sm text-slate-500">{inactiveUsers} account{inactiveUsers !== 1 ? 's' : ''} pending</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Summary */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Summary</CardTitle>
              <CardDescription>Overview of user statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Total Users</span>
                    <span className="text-2xl font-bold text-slate-900">{totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="text-slate-600">Active Users</span>
                    <span className="text-2xl font-bold text-green-600">{activeUsers}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <span className="text-slate-600">Pending Activation</span>
                    <span className="text-2xl font-bold text-amber-600">{inactiveUsers}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <span className="text-slate-600">Administrators</span>
                    <span className="text-2xl font-bold text-purple-600">{adminUsers}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <Link href="/admin/users">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    View All Users
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  );
}

