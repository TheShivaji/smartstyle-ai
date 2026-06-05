import { createBrowserRouter } from "react-router-dom";
import Login from "../feature/auth/pages/Login.jsx";
import Register from "../feature/auth/pages/Register.jsx";
import CreateProduct from "../feature/product/pages/CreateProduct.jsx";
import ShowProduct from "../feature/product/pages/ShowProduct.jsx";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <ShowProduct />,
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
  {
    path: "/product/show",
    element: <ShowProduct />,
  },
]);
