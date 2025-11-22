"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, Check, X, Trash2, Search, Users, UserCheck, UserX, Shield } from "lucide-react";

export default function UsersPage() {
  const { getAllUsers, updateUserStatus, deleteUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    const success = updateUserStatus(userId, !currentStatus);
    if (success) {
      loadUsers();
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      const success = deleteUser(userId);
      if (success) {
        loadUsers();
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-sm text-slate-600">Manage, activate, and delete user accounts</p>
          </div>
        </div>
      </header>

      <main className="p-8">
        {/* Search and Filters */}
        <Card className="border border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Search & Filter</CardTitle>
            <CardDescription>Search users by name or email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="border-slate-200"
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadUsers}
                  className="border-slate-200"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-800">All Users</CardTitle>
                <CardDescription className="mt-1">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-slate-300" />
                          <p className="text-slate-500 font-medium">No users found</p>
                          <p className="text-sm text-slate-400">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-300">
                                <User className="w-5 h-5 text-slate-500" />
                              </div>
                            )}
                            <div>
                              <div className="text-slate-900 font-semibold">{user.name}</div>
                              <div className="text-xs text-slate-500">ID: {user.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-slate-700">{user.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              "User"
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isActive
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {user.isActive ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleToggleStatus(user.id, user.isActive)}
                              variant="outline"
                              size="sm"
                              className={
                                user.isActive
                                  ? "border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300"
                                  : "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                              }
                            >
                              {user.isActive ? (
                                <>
                                  <X className="w-4 h-4 mr-1" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                            {user.role !== "admin" && (
                              <Button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

