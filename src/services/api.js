import axios from 'axios';

const API_BASE = 'https://inventory-backend-zgp0.onrender.com/api'; 

export const login = (data) => axios.post(`${API_BASE}/auth/login`, data);
export const registration = (data) => axios.post(`${API_BASE}/auth/register`, data);

export const addProduct = (product) => axios.post(`${API_BASE}/products/create`, product);
export const getProducts = (category,search,barcode) => axios.get(`${API_BASE}/products/getAll?category=${category}&search=${search}&barcode=${barcode}`);
export const updateProduct = (id, data) => axios.put(`${API_BASE}/products/update/${id}`, data);
export const updateProductCategory = (id, category) => axios.patch(`${API_BASE}/products/category/${id}`, { category });
export const deleteProduct = (id) => axios.delete(`${API_BASE}/products/delete/${id}`);

export const getAllCategories = () =>axios.get(`${API_BASE}/categories/getAll`);
export const createCategory = (data) =>axios.post(`${API_BASE}/categories/create`, data);
export const updateCategory = (id,data) =>axios.put(`${API_BASE}/categories/single/${id}`,data);
export const deleteCategory = (id) =>axios.delete(`${API_BASE}/categories/delete/${id}`);
