import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:3000/api/product",
    withCredentials: true,
});
export const createProduct = async (data) => {
    const response = await api.post("/create", data);
    return response.data;
}

export const showAllProducts = async (data) => {
    const response = await api.get("/get-all-products", data);
    return response.data;
}

export const showAllProductsForBuyer = async (data) => {
    const response = await api.get("/get-all-products-buyer", data);
    return response.data;
}

export const showProductById = async (id) => {
    const response = await api.get(`/details/${id}`);
    return response.data;
}

export const addVariants = async(productId , newVariants) =>{
    const formData = new FormData()

    newVariants.images.forEach((image) => {
        formData.append("images", image.file);
    });
    formData.append("stock", newVariants.stock)
    formData.append("priceAmount", newVariants.price)
    formData.append("attributes", JSON.stringify(newVariants.attributes))

    const response = await api.post(`/add-variants/${productId}`, formData);
    return response.data;
}
