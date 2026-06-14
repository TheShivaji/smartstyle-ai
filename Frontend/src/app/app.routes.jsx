import { createBrowserRouter } from "react-router-dom";
import Login from "../feature/auth/pages/Login.jsx";
import Register from "../feature/auth/pages/Register.jsx";
import CreateProduct from "../feature/product/pages/CreateProduct.jsx";
import ShowProduct from "../feature/product/pages/ShowProduct.jsx";
import MangeProduct from "../feature/product/pages/MangeProduct.jsx";
import ProductDetail from "../feature/product/pages/ProductDetail.jsx";
import Protected from "../feature/product/components/Protected.jsx";
import Unauthorized from "../feature/auth/pages/Unauthorized.jsx";
import Public from "../feature/product/components/Public.jsx";
import ShowAllProductForBuyer from "../feature/product/pages/ShowAllProductForBuyer.jsx";
import ProtectedBuyer from "../feature/product/components/ProtectedBuyer.jsx";
import Cart from "../feature/cart/pages/Cart.jsx";
import NotFound from "../feature/auth/pages/NotFound.jsx";
import Checkout from "../feature/order/pages/Checkout.jsx";
import Orders from "../feature/order/pages/Orders.jsx";
import OrderDetails from "../feature/order/pages/OrderDetails.jsx";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Public>
        <Login />
      </Public>
    ),
  },
  {
    path: "/login",
    element: (
      <Public>
        <Login />
      </Public>
    ),
  },
  {
    path: "/signup",
    element: (
      <Public>
        <Register />
      </Public>
    ),
  },
  {
    path: "/register",
    element: (
      <Public>
        <Register />
      </Public>
    ),
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/product/details/:id",
    element: (
      <ProtectedBuyer>
        <ProductDetail />
      </ProtectedBuyer>
    ),
  },
  {
    path: "/showallproduct",
    element: (
      <ProtectedBuyer>
        <ShowAllProductForBuyer />
      </ProtectedBuyer>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedBuyer>
        <Cart />
      </ProtectedBuyer>
    ),
  },
  {
    path: "/checkout/:productId/:variantId",
    element: (
      <ProtectedBuyer>
        <Checkout />
      </ProtectedBuyer>
    ),
  },
  {
    path: "/my-orders",
    element: (
      <ProtectedBuyer>
        <Orders />
      </ProtectedBuyer>
    ),
  },
  {
    path: "/order-details/:orderId",
    element: (
      <ProtectedBuyer>
        <OrderDetails />
      </ProtectedBuyer>
    ),
  },

  {
    path: "/seller",
    children: [
      {
        path: "/seller/product/create",
        element: (
          <Protected>
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "/seller/product/show",
        element: (
          <Protected>
            <ShowProduct />
          </Protected>
        ),
      },
      {
        path: "/seller/product/manage/:productId",
        element: (
          <Protected>
            <MangeProduct />
          </Protected>
        ),
      },
    ],
  },
  {
    path: "/product/show",
    element: <ShowProduct />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
