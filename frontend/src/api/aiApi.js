import axiosInstance from "./axiosConfig";

// Using the API Gateway port 8080
const BASE_URL = `/api/ai`;

export const getAiRecommendations = async (query) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/recommend`, { query });
        return response.data;
    } catch (error) {
        throw error;
    }
};

