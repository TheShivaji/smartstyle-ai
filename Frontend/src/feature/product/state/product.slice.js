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
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { createProduct, showAllProducts, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;