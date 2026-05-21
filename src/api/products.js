import client from "./client";

export const getProducts = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  // El backend soporta estos parámetros (ver productController)
  return client.get(`/products?${params.toString()}`).then((res) => res.data);
};

export const getProduct = (id) =>
  client.get(`/products/${id}`).then((res) => res.data);
export const createProduct = (data) =>
  client.post("/products", data).then((res) => res.data);
export const updateProduct = ({ id, ...data }) =>
  client.put(`/products/${id}`, data).then((res) => res.data);
export const deleteProduct = (id) =>
  client.delete(`/products/${id}`).then((res) => res.data);
