import axois from "axios"

export const apiBaseURL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "/api"
console.log("Axios base URL:", apiBaseURL)

export const axiosInstance = axois.create({
    baseURL: apiBaseURL,
    withCredentials: true,
})