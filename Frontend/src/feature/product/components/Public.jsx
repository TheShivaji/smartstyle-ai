import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

export default function Public({ children }) {
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const isAuthChecked = useSelector(state => state.auth.isAuthChecked);

    if (!isAuthChecked || loading) {
        return <Loader />;
    }

    // If user is already authenticated, redirect them away from public auth pages
    if (user) {
        const role = user.role?.toLowerCase();
        if (role === "seller") {
            return <Navigate to="/seller/product/show" />;
        } else {
            return <Navigate to="/" />;
        }
    }

    return children;
}
