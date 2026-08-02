import axiosInstance from "./axiosConfig";

const BASE_URL = "http://localhost:8082/api/categories";

export const getAllCategories = () => {
    return axiosInstance.get(BASE_URL);
};

export const getCategoryById = (cid) => {
    return axiosInstance.get(`${BASE_URL}/${cid}`);
};

export const addCategory = (category) => {
    return axiosInstance.post(BASE_URL, category);
};

export const updateCategory = (cid, category) => {
    return axiosInstance.put(`${BASE_URL}/${cid}`, category);
};

export const deleteCategory = (cid) => {
    return axiosInstance.delete(`${BASE_URL}/${cid}`);
};