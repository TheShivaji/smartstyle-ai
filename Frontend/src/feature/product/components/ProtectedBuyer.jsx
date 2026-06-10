import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedBuyer({ children }) {
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const isAuthChecked = useSelector(state => state.auth.isAuthChecked);
    
    if (!isAuthChecked || loading) {
        return <Loader />;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (user.role?.toLowerCase() !== "buyer") {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
}
