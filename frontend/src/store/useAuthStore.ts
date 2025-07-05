import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { SignInForm, SignUpForm } from "../types/index.ts";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/"

interface AuthType {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => void;
  signup: (formData: SignUpForm) => void;
  logout: () => void;
  login: (FormData: SignInForm) => void;
  updateProfile: (data: UpdateProfileType) => void;
}

interface AuthUser {
  fullName: string;
  email: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileType {
  profilePic: string;
}

export const useAuthStore = create<AuthType>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checking Auth", error);

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData: SignUpForm) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      console.log("Failed to create account:", error);
      toast.error("Could not create account. Please try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Failed to logout account:", error);
      toast.error("Something went wrong");
    }
  },

  login: async (formData: SignInForm) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("Failed to login:", error);
      toast.error("Could not login. Please try again.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data: UpdateProfileType) => {
    set({isUpdatingProfile: true})

    try {
      const res = await axiosInstance.put("/auth/update-profile",data)
      set({authUser: res.data})
      toast.success("Update profile successfully")

    } catch (error) {
      console.log("Failed to update profile:", error);
      toast.error("Could not update profile. Please try again.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
