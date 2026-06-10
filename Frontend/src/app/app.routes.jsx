import { createBrowserRouter } from "react-router-dom";
import Login from "../feature/auth/pages/Login.jsx";
import Register from "../feature/auth/pages/Register.jsx";
import CreateProduct from "../feature/product/pages/CreateProduct.jsx";
import ShowProduct from "../feature/product/pages/ShowProduct.jsx";
import ProductDetail from "../feature/product/pages/ProductDetail.jsx";
import Protected from "../feature/product/components/Protected.jsx";
import Unauthorized from "../feature/auth/pages/Unauthorized.jsx";
import Public from "../feature/product/components/Public.jsx";
import ShowAllProductForBuyer from "../feature/product/pages/ShowAllProductForBuyer.jsx";
import ProtectedBuyer from "../feature/product/components/ProtectedBuyer.jsx";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Public><Login /></Public>,
  },
  {
    path: "/login",
    element: <Public><Login /></Public>,
  },
  {
    path: "/signup",
    element: <Public><Register /></Public>,
  },
  {
    path: "/register",
    element: <Public><Register /></Public>,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/product/details/:id",
    element: <ProtectedBuyer><ProductDetail /></ProtectedBuyer>,
  },
  {
    path : "/showallproduct",
    element : <ProtectedBuyer><ShowAllProductForBuyer /></ProtectedBuyer>
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
