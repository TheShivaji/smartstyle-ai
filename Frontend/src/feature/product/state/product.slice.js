import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    selectedProduct: null,
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
        updateProduct: (state, action) => {
            const index = state.products.findIndex((p) => p._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            } else {
                state.products.push(action.payload);
            }
            if (state.selectedProduct && state.selectedProduct._id === action.payload._id) {
                state.selectedProduct = action.payload;
            }
        },
        showAllProducts: (state, action) => {
            state.products = action.payload;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { createProduct, updateProduct, showAllProducts, setSelectedProduct, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;