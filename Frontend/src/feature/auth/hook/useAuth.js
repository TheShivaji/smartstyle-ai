import { useDispatch } from "react-redux";
import { singup as signupApi, login as loginApi, getMe as getMeApi, logout as logoutApi } from "../services/auth.api";
import { setUser, setError, setLoading } from "../state/auth.slice";

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleSignup = async (data) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await signupApi(data);
            if (response.success) {
                dispatch(setUser(response.user));
            } else {
                dispatch(setError(response.message || "Signup failed"));
            }
            return response;
        } catch (error) {
            const errorMsg = error.message || "An unexpected error occurred";
            dispatch(setError(errorMsg));
            return { success: false, message: errorMsg };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = async (data) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await loginApi(data);
            if (response.success) {
                dispatch(setUser(response.user));
            } else {
                dispatch(setError(response.message || "Login failed"));
            }
            return response;
        } catch (error) {
            const errorMsg = error.message || "An unexpected error occurred";
            dispatch(setError(errorMsg));
            return { success: false, message: errorMsg };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const checkAuth = async () => {
        dispatch(setLoading(true));
        try {
            const response = await getMeApi();
            if (response.success) {
                dispatch(setUser(response.user));
            } else {
                dispatch(setUser(null));
            }
            return response;
        } catch (error) {
            dispatch(setUser(null));
            return { success: false, message: error.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogout = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await logoutApi();
            if (response.success) {
                dispatch(setUser(null));
            } else {
                dispatch(setError(response.message || "Logout failed"));
            }
            return response;
        } catch (error) {
            const errorMsg = error.message || "An unexpected error occurred";
            dispatch(setError(errorMsg));
            return { success: false, message: errorMsg };
        } finally {
            dispatch(setLoading(false));
        }
    };

    return { signup: handleSignup, login: handleLogin, checkAuth, logout: handleLogout };
};


