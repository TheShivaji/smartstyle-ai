import { createBrowserRouter } from "react-router-dom";
import Login from "../feature/auth/pages/Login.jsx";
import Register from "../feature/auth/pages/Register.jsx";
import CreateProduct from "../feature/product/pages/CreateProduct.jsx";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <h1>Welcome to Snitch</h1>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/product/create",
    element: <CreateProduct />,
  },
]);
