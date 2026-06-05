import React from "react";

import { AppRouter } from "./app.routes.jsx";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <RouterProvider router={AppRouter}/>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}
