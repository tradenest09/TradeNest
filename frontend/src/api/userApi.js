import axiosInstance from "./axiosConfig";

const BASE_URL = "http://localhost:8081/api/users";

// Get User by ID
export const getUserById = (uid) => {
  return axiosInstance.get(`${BASE_URL}/${uid}`);
};

// Get All Users
export const getAllUsers = () => {
  return axiosInstance.get(BASE_URL);
};

// Update User
export const updateUser = (uid, userData) => {
  return axiosInstance.put(`${BASE_URL}/${uid}`, userData);
};

// Delete User
export const deleteUser = (uid) => {
  return axiosInstance.delete(`${BASE_URL}/${uid}`);
};

// Search User by Username
export const searchUser = (uname) => {
  return axiosInstance.get(`${BASE_URL}/search?uname=${uname}`);
};