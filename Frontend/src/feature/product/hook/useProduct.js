import {createProduct, showAllProducts , showAllProductsForBuyer, showProductById, addVariants} from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { 
    createProduct as createProductAction, 
    updateProduct as updateProductAction,
    showAllProducts as showAllProductsAction,
    setSelectedProduct as setSelectedProductAction,
    setLoading,
    setError 
} from "../state/product.slice.js";
import { toast } from "react-toastify";

export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = async (data) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await createProduct(data);
            dispatch(createProductAction(response.product));
            toast.success(response.message);
            return response;
        } catch (error) {
            console.error("Error creating product:", error);
            const errorMsg = error.response?.data?.message || "Error creating product";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleShowAllProducts = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await showAllProducts();
            dispatch(showAllProductsAction(response.products));
            return response;
        } catch (error) {
            console.error("Error showing all products:", error);
            const errorMsg = error.response?.data?.message || "Error loading products";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleShowAllProductsForBuyer = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await showAllProductsForBuyer();
            dispatch(showAllProductsAction(response.products));
            return response;
        } catch (error) {
            console.error("Error showing all products:", error);
            const errorMsg = error.response?.data?.message || "Error loading products";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleShowProductById = async (id) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await showProductById(id);
            dispatch(setSelectedProductAction(response.product));
            return response;
        } catch (error) {
            console.error("Error fetching product details:", error);
            const errorMsg = error.response?.data?.message || "Error loading product details";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleAddVariants = async (productId , newVariants) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await addVariants(productId , newVariants);
            dispatch(updateProductAction(response.product));
            toast.success(response.message);
            return response;
        } catch (error) {
            console.error("Error adding variants:", error);
            const errorMsg = error.response?.data?.message || "Error adding variants";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    return {
        handleCreateProduct,
        handleShowAllProducts,
        handleShowAllProductsForBuyer,
        handleShowProductById,
        handleAddVariants,
    };
};