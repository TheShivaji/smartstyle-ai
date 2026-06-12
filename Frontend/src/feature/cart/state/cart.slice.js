import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload?.items || [];
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
});

export const { setCart, setLoading, setError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;