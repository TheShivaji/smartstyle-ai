import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/state/auth.slice";
import productReducer from "../feature/product/state/product.slice";
import cartReducer from "../feature/cart/state/cart.slice";
import orderReducer from "../feature/order/state/order.slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        order: orderReducer
    },
});

export default store;
