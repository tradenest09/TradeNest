import axios from "axios";

// Using the API Gateway port 8080
const BASE_URL = "http://localhost:8080/api/ai";

export const getAiRecommendations = async (query) => {
    try {
        const response = await axios.post(`${BASE_URL}/recommend`, { query });
        return response.data;
    } catch (error) {
        throw error;
    }
};
