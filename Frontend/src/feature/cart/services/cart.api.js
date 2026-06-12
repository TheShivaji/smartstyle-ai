import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/product",
    withCredentials: true,
});

export const getCart = async () => {
    try {
        const response = await api.get("/get-cart");
        return response.data;
    } catch (error) {
        console.log("Error in getCart api: ", error);
        return error.response?.data || error.message || "Network Error";
    }
};

export const addToCart = async (data) => {
    try {
        const response = await api.post(`/add-to-cart/${data.productId}/${data.variantId}`, data.body);
        return response.data;
    } catch (error) {
        console.log("Error in addToCart api: ", error);
        return error.response?.data || error.message || "Network Error";
    }
};

export const removeItemFromCart = async (data) => {
    try {
        const response = await api.delete(`/remove-from-cart/${data.productId}/${data.variantId}`);
        return response.data;
    } catch (error) {
        console.log("Error in removeItemFromCart api: ", error);
        return error.response?.data || error.message || "Network Error";
    }
};

export const deleteCart = async () => {
    try {
        const response = await api.delete("/delete-cart");
        return response.data;
    } catch (error) {
        console.log("Error in deleteCart api: ", error);
        return error.response?.data || error.message || "Network Error";
    }
};

export const updateCartQuantity = async (data) => {
    try {
        const response = await api.put(`/update-cart-quantity/${data.productId}/${data.variantId}`, data.body);
        return response.data;
    } catch (error) {
        console.log("Error in updateCartQuantity api: ", error);
        return error.response?.data || error.message || "Network Error";
    }
};