import axiosInstance from "./axiosConfig";

const BASE_URL = "http://localhost:8080/api/users";

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

export const getTotalUsers = () => {
    return axiosInstance.get("http://localhost:8080/api/users/count");
};

// Change Password
export const changePassword = (passwordData) => {
  return axiosInstance.put(`${BASE_URL}/change-password`, passwordData);
};
