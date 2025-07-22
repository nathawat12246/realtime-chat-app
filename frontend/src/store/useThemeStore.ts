import { create } from "zustand";

interface ThemeType {
    theme: string;
    setTheme: (theme:string) => void
}

export const useThemeStore = create<ThemeType>((set) => ({
    theme: localStorage.getItem("chat-theme") || "light",
    setTheme: (theme: string) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    },
}))