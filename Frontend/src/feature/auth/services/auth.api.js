import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
});

export const singup = async (data) => {
    try {
        const response = await api.post("/signup", data);
        return response.data;
    } catch (error) {
        console.log("Error in signup api: ", error);
        return error.response?.data || { success: false, message: error.message || "Network Error" };
    }
};

// Also export as correctly spelled signup for future use
export const signup = singup;

export const login = async (data) => {
    try {
        const response = await api.post("/login", data);
        return response.data;
    } catch (error) {
        console.log("Error in login api: ", error);
        return error.response?.data || { success: false, message: error.message || "Network Error" };
    }
};

export const getMe = async () => {
    try {
        const response = await api.get("/me");
        return response.data;
    } catch (error) {
        console.log("Error in getMe api: ", error);
        return error.response?.data || { success: false, message: error.message || "Network Error" };
    }
};

export const logout = async () => {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        console.log("Error in logout api: ", error);
        return error.response?.data || { success: false, message: error.message || "Network Error" };
    }
};