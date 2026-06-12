import { getCart, addToCart, removeItemFromCart, deleteCart, updateCartQuantity } from "../services/cart.api";
import { setCart, setLoading, setError, clearCart } from "../state/cart.slice";
import { useDispatch, useSelector } from "react-redux";

export const useCart = () => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector((state) => state.cart);

    const handleGetCart = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await getCart();
            if (response.success) {
                dispatch(setCart(response.cart));
            } else {
                dispatch(setError(response.message || "Failed to fetch cart"));
            }
            return response;
        } catch (error) {
            console.log("Error in handleGetCart hook: ", error);
            dispatch(setError(error.message || "An error occurred"));
            return error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleAddToCart = async (data) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await addToCart(data);
            if (response.success) {
                dispatch(setCart(response.cart));
            } else {
                dispatch(setError(response.message || "Failed to add to cart"));
            }
            return response;
        } catch (error) {
            console.log("Error in handleAddToCart hook: ", error);
            dispatch(setError(error.message || "An error occurred"));
            return error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRemoveItemFromCart = async (data) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await removeItemFromCart(data);
            if (response.success) {
                dispatch(setCart(response.cart));
            } else {
                dispatch(setError(response.message || "Failed to remove item"));
            }
            return response;
        } catch (error) {
            console.log("Error in handleRemoveItemFromCart hook: ", error);
            dispatch(setError(error.message || "An error occurred"));
            return error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteCart = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await deleteCart();
            if (response.success) {
                dispatch(clearCart());
            } else {
                dispatch(setError(response.message || "Failed to delete cart"));
            }
            return response;
        } catch (error) {
            console.log("Error in handleDeleteCart hook: ", error);
            dispatch(setError(error.message || "An error occurred"));
            return error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateCartQuantity = async (data) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await updateCartQuantity(data);
            if (response.success) {
                dispatch(setCart(response.cart));
            } else {
                dispatch(setError(response.message || "Failed to update quantity"));
            }
            return response;
        } catch (error) {
            console.log("Error in handleUpdateCartQuantity hook: ", error);
            dispatch(setError(error.message || "An error occurred"));
            return error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        items,
        isLoading,
        error,
        handleGetCart,
        handleAddToCart,
        handleRemoveItemFromCart,
        handleDeleteCart,
        handleUpdateCartQuantity
    };
};