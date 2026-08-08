import axiosInstance from "./axiosConfig";

const BASE_URL = "http://localhost:8080/api";

export const getPurchasesByBuyer = (uid) => axiosInstance.get(`${BASE_URL}/purchases/buyer/${uid}`);
export const getPurchasesBySeller = (uid) => axiosInstance.get(`${BASE_URL}/purchases/seller/${uid}`);
export const getAllPurchases = () => axiosInstance.get(`${BASE_URL}/purchases`);
export const createPurchase = (payload) => axiosInstance.post(`${BASE_URL}/purchases`, payload);
export const cancelPurchase = (id) => axiosInstance.delete(`${BASE_URL}/purchases/${id}`);
export const getRentalsByRenter = (uid) => axiosInstance.get(`${BASE_URL}/rentals/renter/${uid}`);
export const getRentalsByOwner = (uid) => axiosInstance.get(`${BASE_URL}/rentals/owner/${uid}`);
export const getAllRentals = () => axiosInstance.get(`${BASE_URL}/rentals`);
export const createRental = (payload) => axiosInstance.post(`${BASE_URL}/rentals`, payload);
export const updateRentalStatus = (payload) => axiosInstance.put(`${BASE_URL}/rentals/status`, payload);
export const cancelRental = (id) => axiosInstance.delete(`${BASE_URL}/rentals/${id}`);
export const addPayment = (payload) => axiosInstance.post(`${BASE_URL}/payments`, payload);
export const updatePaymentStatus = (paymentId, payload) => axiosInstance.put(`${BASE_URL}/payments/${paymentId}/status`, payload);
