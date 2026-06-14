import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/orders",
    withCredentials: true,
})

export const checkout = async (productId, variantId, shipmentAddress) => {
    const response = await api.post(`/checkout/${productId}/${variantId}`, {
        shipmentAddress
    });
    return response.data;
}

export const getMyOrders = async () => {
    const response = await api.get("/my-orders");
    return response.data;
}

export const getOrderDetails = async (orderId) => {
    const response = await api.get(`/order-details/${orderId}`);
    return response.data;
}

export const cancelOrder = async (orderId) => {
    const response = await api.patch(`/cancel/${orderId}`);
    return response.data;
}

export const applyCoupon = async (couponCode) => {
    const response = await api.post(`/apply-coupon`, {
        code: couponCode
    });
    return response.data;
}