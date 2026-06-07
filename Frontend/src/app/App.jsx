import React, { useEffect } from "react";

import { AppRouter } from "./app.routes.jsx";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../feature/auth/hook/useAuth.js";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <RouterProvider router={AppRouter}/>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}
