import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:9999',
});

export const getAllCategories = () => API.get("/categories");
export const getCategoryById = (id) => API.get(`/categories/${id}`);
export const addCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);
export const getFoodsByCategoryId = (categoryId) => API.get(`/foods?categoryId=${categoryId}`);
export const getAllFoods = () => API.get("/foods");
