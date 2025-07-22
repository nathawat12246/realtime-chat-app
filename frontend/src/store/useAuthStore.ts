import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { SignInForm, SignUpForm } from "../types/index.ts";
import toast from "react-hot-toast";
import { toast_text } from "../constants/index.ts"
import { io } from "socket.io-client"

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/"
const BASE_URL = "http://localhost:5001/"


interface AuthType {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[],
  socket: any,

  checkAuth: () => void;
  signup: (formData: SignUpForm) => void;
  logout: () => void;
  login: (FormData: SignInForm) => void;
  updateProfile: (data: UpdateProfileType) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileType {
  profilePic: string;
}

export const useAuthStore = create<AuthType>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
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

      get().connectSocket();
    } catch (error) {
      console.log("Failed to create account:", error);
      toast.error(toast_text.tryagain);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      
      get().disconnectSocket();
    } catch (error) {
      console.log("Failed to logout account:", error);
      toast.error(toast_text.error);
    }
  },

  login: async (formData: SignInForm) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      console.log("Failed to login:", error);
      toast.error(toast_text.tryagain);
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
      toast.error(toast_text.tryagain);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: async () => {
    const { authUser } = get()
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL,{
      query: {
        userId : authUser._id
      }
    })
    socket.connect()

    set({ socket:socket });

    socket.on("getOnlineUsers",(userIds) => {
      set({onlineUsers: userIds})
    })
  },

  disconnectSocket: async () => {
    if(get().socket?.connected) {
      get().socket.disconnect();
    }
  }
}));
