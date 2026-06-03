import { useDispatch } from "react-redux";
import { singup as signupApi, login as loginApi } from "../services/auth.api";
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

    return { signup: handleSignup, login: handleLogin };
};


