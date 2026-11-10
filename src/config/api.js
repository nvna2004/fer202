import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:9999',
});

// Category APIs
export const getAllCategories = () => API.get("/categories");
export const getCategories = () => API.get("/categories");
export const getCategoryById = (id) => API.get(`/categories/${id}`);
export const addCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Food APIs
export const getAllFoods = () => API.get("/foods");
export const getFoods = () => API.get("/foods");
export const getFoodById = (id) => API.get(`/foods/${id}`);
export const getFoodsByCategoryId = (categoryId) => API.get(`/foods?categoryId=${categoryId}`);
export const addFood = (data) => API.post("/foods", data);
export const updateFood = (id, data) => API.put(`/foods/${id}`, data);
export const deleteFood = (id) => API.delete(`/foods/${id}`);

// Order APIs
export const getAllOrders = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post("/orders", data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// Coupon APIs
export const getAllCoupons = () => API.get("/coupons");
export const getCouponByCode = (code) => API.get(`/coupons?code=${code}`);

// Review APIs
export const getAllReviews = () => API.get("/reviews");
export const getReviewsByFoodId = (foodId) => API.get(`/reviews?foodId=${foodId}`);
export const addReview = (data) => API.post("/reviews", data);

// Shop Info APIs
export const getShopInfo = () => API.get("/shopInfo");

export default API;
