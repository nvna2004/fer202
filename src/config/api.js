import axios from "axios";

const API = axios.create({
    baseURL:'http://localhost:9999',
});
//export const getBooks = () =>API.get("/books");

export const getFoods = () => API.get("/foods");
export const getCategories = () => API.get("/categories")