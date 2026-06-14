import { checkout, getMyOrders, getOrderDetails, cancelOrder, applyCoupon } from "../services/order.api";
import { useDispatch } from "react-redux";
import { setMyOrders, setCurrentOrder, setLoading, setError, setOrderCreated, setOrderCancelled, setApplyCoupon } from "../state/order.Slice";
import { toast } from "react-toastify";

export const useOrder = () => {
    const dispatch = useDispatch();

    const handleCheckout = async (productId, variantId, shipmentAddress) => {
        dispatch(setError(null));
        dispatch(setLoading(true));
        try {
            const response = await checkout(productId, variantId, shipmentAddress);
            dispatch(setOrderCreated(true));
            return response;
        } catch (error) {
            dispatch(setOrderCreated(false));
            const errMessage = error.response?.data?.message || error.message;
            dispatch(setError(errMessage));
            toast.error(errMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGetMyOrders = async () => {
        dispatch(setError(null));
        dispatch(setLoading(true));
        try {
            const response = await getMyOrders();
            dispatch(setMyOrders(response.orders));
            return response;
        } catch (error) {
            const errMessage = error.response?.data?.message || error.message;
            dispatch(setError(errMessage));
            toast.error(errMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGetOrderDetails = async (orderId) => {
        dispatch(setError(null));
        dispatch(setLoading(true));
        try {
            const response = await getOrderDetails(orderId);
            dispatch(setCurrentOrder(response.order));
            return response;
        } catch (error) {
            const errMessage = error.response?.data?.message || error.message;
            dispatch(setError(errMessage));
            toast.error(errMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleCancelOrder = async (orderId) => {
        dispatch(setError(null));
        dispatch(setLoading(true));
        try {
            const response = await cancelOrder(orderId);
            dispatch(setOrderCancelled(true));
            return response;
        } catch (error) {
            dispatch(setOrderCancelled(false));
            const errMessage = error.response?.data?.message || error.message;
            dispatch(setError(errMessage));
            toast.error(errMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleApplyCoupon = async (couponCode) => {
        dispatch(setError(null));
        dispatch(setLoading(true));
        try {
            const response = await applyCoupon(couponCode);
            dispatch(setApplyCoupon(response.coupon));
            return response;
        } catch (error) {
            dispatch(setApplyCoupon(null));
            const errMessage = error.response?.data?.message || error.message;
            dispatch(setError(errMessage));
            toast.error(errMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleCheckout,
        handleGetMyOrders,
        handleGetOrderDetails,
        handleCancelOrder,
        handleApplyCoupon,
    };
}
