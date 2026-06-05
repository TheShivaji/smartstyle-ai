import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    loading: false,
    error: null,
}
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        createProduct: (state, action) => {
            state.products.push(action.payload);
        },
        showAllProducts: (state, action) => {
            state.products = action.payload;
        },
    },
});

export const { createProduct, showAllProducts } = productSlice.actions;
export default productSlice.reducer;