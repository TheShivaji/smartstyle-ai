import { createBrowserRouter } from "react-router-dom";
import Login from "../feature/auth/pages/Login.jsx";
import Register from "../feature/auth/pages/Register.jsx";
import CreateProduct from "../feature/product/pages/CreateProduct.jsx";
import ShowProduct from "../feature/product/pages/ShowProduct.jsx";
import Protected from "../feature/product/components/Protected.jsx";
import Unauthorized from "../feature/auth/pages/Unauthorized.jsx";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <h1>hello</h1>,
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
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/product/create",
        element: <Protected><CreateProduct /></Protected>,
      },
      {
        path: "/seller/product/show",
        element: <Protected><ShowProduct /></Protected>,
      },
    ]
  },
  {
    path: "/product/show",
    element: <ShowProduct />,
  },
]);
