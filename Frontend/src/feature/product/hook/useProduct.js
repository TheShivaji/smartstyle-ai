import {createProduct, showAllProducts} from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { createProduct as createProductAction, showAllProducts as showAllProductsAction } from "../state/product.slice.js";
import { toast } from "react-toastify";
export const useProduct = () => {
    const dispatch = useDispatch();
    const handleCreateProduct = async (data) => {
        try {
            const response = await createProduct(data);
            dispatch(createProductAction(response.product));
            toast.success(response.message);
            return response;
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error(error.response?.data?.message || "Error creating product");
            return null;
        }
    };
    const handleShowAllProducts = async () => {
        try {
            const response = await showAllProducts();
            dispatch(showAllProductsAction(response.products));
            return response;
        } catch (error) {
            console.error("Error showing all products:", error);
            toast.error(error.response?.data?.message || "Error loading products");
            return null;
        }
    };
    return {
        handleCreateProduct,
        handleShowAllProducts,
    };
};