import { get, post } from "./index";

export const getProducts = () => get("/products");
export const getCategories = () => get("/products/categories");
export const getProductsByCategory = (cat) => get("/products/category/" + cat);
export const createOrder = (data) => post("/orders", data);
export const getUserOrders = (userId) => get("/orders/user/" + userId);
export const getOrderDetail = (id) => get("/orders/" + id);