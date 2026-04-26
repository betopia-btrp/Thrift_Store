"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User } from "@/lib/data";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("thrifthub_user");
      if (saved) {
        const userData = JSON.parse(saved);
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to Laravel backend
      // const response = await fetch("/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // For now, simulate API response based on email
      await new Promise((r) => setTimeout(r, 1000)); // Simulate network delay

      // Mock user based on email (in production, use actual API response)
      const mockUsers: Record<string, User> = {
        "alex@example.com": {
          id: "u1",
          name: "Alex Johnson",
          email: "alex@example.com",
          phone: "+14155552671",
          avatar: "https://i.pravatar.cc/150?img=12",
          location: "New York, NY",
          rating: 4.7,
          reviewCount: 23,
          joinedAt: "2024-03-15",
          isBlocked: false,
          role: "seller",
          totalListings: 12,
          totalSales: 8,
        },
        "sarah@example.com": {
          id: "u2",
          name: "Sarah Miller",
          email: "sarah@example.com",
          phone: "+14155553892",
          avatar: "https://i.pravatar.cc/150?img=47",
          location: "Los Angeles, CA",
          rating: 4.9,
          reviewCount: 41,
          joinedAt: "2023-11-02",
          isBlocked: false,
          role: "seller",
          totalListings: 27,
          totalSales: 22,
        },
      };

      const userData = mockUsers[email];
      if (!userData) {
        throw new Error("Invalid email or password");
      }

      setUser(userData);
      localStorage.setItem("thrifthub_user", JSON.stringify(userData));
      localStorage.setItem("thrifthub_token", "mock_jwt_token_" + Date.now());
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to Laravel backend
      // const response = await fetch("/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, phone, password }),
      // });
      // const data = await response.json();

      await new Promise((r) => setTimeout(r, 1200)); // Simulate network delay

      const newUser: User = {
        id: "u" + Date.now(),
        name,
        email,
        phone,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 100)}`,
        location: "Not set",
        rating: 5.0,
        reviewCount: 0,
        joinedAt: new Date().toISOString().split("T")[0],
        isBlocked: false,
        role: "buyer",
        totalListings: 0,
        totalSales: 0,
      };

      setUser(newUser);
      localStorage.setItem("thrifthub_user", JSON.stringify(newUser));
      localStorage.setItem("thrifthub_token", "mock_jwt_token_" + Date.now());
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("thrifthub_user");
    localStorage.removeItem("thrifthub_token");
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in");
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to Laravel backend
      // const response = await fetch(`/api/users/${user.id}`, {
      //   method: "PUT",
      //   headers: { 
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${localStorage.getItem("thrifthub_token")}`
      //   },
      //   body: JSON.stringify(updates),
      // });
      // const data = await response.json();

      await new Promise((r) => setTimeout(r, 800));

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("thrifthub_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
