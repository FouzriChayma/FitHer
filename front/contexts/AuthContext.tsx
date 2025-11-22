"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, sessionsAPI, usersAPI } from "@/lib/api";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  profilePicture?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  signup: (name: string, email: string, password: string, role?: UserRole, profilePicture?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  getAllUsers: () => Promise<User[]>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateProfilePicture: (userId: string, pictureUrl: string | null) => Promise<boolean>;
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userId: string, name: string, email: string) => Promise<boolean>;
  getActiveSessions: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("fither-token");
        if (token) {
          const userData = await authAPI.getCurrentUser();
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem("fither-token");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("fither-token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || "Invalid email or password" };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "An error occurred. Please try again." };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "user",
    profilePicture?: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const response = await authAPI.signup(name, email, password, role, profilePicture);
      
      if (response.success) {
        // Auto-login for admins
        if (response.user && response.token) {
          localStorage.setItem("fither-token", response.token);
          setUser(response.user);
          return { success: true, user: response.user };
        }
        return { success: true };
      } else {
        return { success: false, error: response.error || "Failed to create account" };
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      return { success: false, error: error.message || "An error occurred. Please try again." };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("fither-token");
      setUser(null);
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const users = await usersAPI.getAll();
      return users || [];
    } catch (error) {
      console.error("Get users error:", error);
      return [];
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
    try {
      return await usersAPI.updateStatus(userId, isActive);
    } catch (error) {
      console.error("Update user status error:", error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      return await usersAPI.delete(userId);
    } catch (error) {
      console.error("Delete user error:", error);
      return false;
    }
  };

  const updateProfilePicture = async (userId: string, pictureUrl: string | null): Promise<boolean> => {
    try {
      const updatedUser = await usersAPI.updateProfilePicture(userId, pictureUrl);
      if (updatedUser && updatedUser.id === user?.id) {
        setUser(updatedUser);
      }
      return updatedUser !== null;
    } catch (error) {
      console.error("Update profile picture error:", error);
      return false;
    }
  };

  const updatePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      return await usersAPI.updatePassword(userId, currentPassword, newPassword);
    } catch (error: any) {
      console.error("Update password error:", error);
      return { success: false, error: "An error occurred. Please try again." };
    }
  };

  const updateProfile = async (userId: string, name: string, email: string): Promise<boolean> => {
    try {
      const updatedUser = await usersAPI.update(userId, name, email);
      if (updatedUser && updatedUser.id === user?.id) {
        setUser(updatedUser);
      }
      return updatedUser !== null;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  };

  const getActiveSessions = async (): Promise<any[]> => {
    try {
      return await sessionsAPI.getActive();
    } catch (error) {
      console.error("Get active sessions error:", error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        getAllUsers,
        updateUserStatus,
        deleteUser,
        updateProfilePicture,
        updatePassword,
        updateProfile,
        getActiveSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
