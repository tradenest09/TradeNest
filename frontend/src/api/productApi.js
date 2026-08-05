import axiosInstance from "./axiosConfig";

const BASE_URL = "http://localhost:8082/api/products";

export const addProduct = (product) => {
    return axiosInstance.post(BASE_URL, product);
};

export const addRent = (rentDetails) => {
    return axiosInstance.post("http://localhost:8082/api/rent", rentDetails);
};

export const getRentByProduct = (pid) => {
    return axiosInstance.get(`http://localhost:8082/api/rent/product/${pid}`);
};

export const getAllProducts = () => {
    return axiosInstance.get(BASE_URL);
};

export const getProductById = (pid) => {
    return axiosInstance.get(`${BASE_URL}/${pid}`);
};

export const getProductsByCategory = (cid) => {
    return axiosInstance.get(`${BASE_URL}/category/${cid}`);
};

export const getProductsBySeller = (uid) => {
    return axiosInstance.get(`${BASE_URL}/seller/${uid}`);
};

export const getProductsByType = (type) => {
    return axiosInstance.get(`${BASE_URL}/type/${type}`);
};

export const searchProducts = (keyword) => {
    return axiosInstance.get(`${BASE_URL}/search?keyword=${keyword}`);
};

export const updateProduct = (pid, product) => {
    return axiosInstance.put(`${BASE_URL}/${pid}`, product);
};

export const deleteProduct = (pid) => {
    return axiosInstance.delete(`${BASE_URL}/${pid}`);
};

export const getTotalProducts = () => {
    return axiosInstance.get("http://localhost:8082/api/products/count");
};

export const uploadProductImage = (pid, formData) => {
    return axiosInstance.post(`${BASE_URL}/${pid}/images`, formData);
};