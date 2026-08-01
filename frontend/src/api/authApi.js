import axiosInstance from "./axiosConfig";

const BASE_URL = "http://localhost:8081/api/users";

export const login = (data) => {
  return axiosInstance.post(`${BASE_URL}/login`, data);
};

export const register = (data) => {
  return axiosInstance.post(`${BASE_URL}/register`, data);
};