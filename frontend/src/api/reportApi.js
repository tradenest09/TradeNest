import axiosInstance from "./axiosConfig";

const BASE_URL = "http://localhost:8080/api/reports";

export const getAllReports = () => axiosInstance.get(BASE_URL);
export const updateReportStatus = (reportId, status) =>
  axiosInstance.put(`${BASE_URL}/${reportId}/status`, { status });
