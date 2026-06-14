import {  createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState:{
        myOrders: [],
        currentOrder: null,
        loading: false,
        error: null,
        orderCreated: false,
        orderCancelled: false,
        appliedCoupon: null
    },
    reducers:{
        setMyOrders: (state, action) => {
            state.myOrders = action.payload;
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setOrderCreated: (state, action) => {
            state.orderCreated = action.payload;
        },
        setOrderCancelled: (state, action) => {
            state.orderCancelled = action.payload;
        },
        setApplyCoupon: (state, action) => {
            state.appliedCoupon = action.payload;
        }
        
    }
})

export const { setMyOrders, setCurrentOrder, setLoading, setError, setOrderCreated, setOrderCancelled, setApplyCoupon } = orderSlice.actions;
export default orderSlice.reducer