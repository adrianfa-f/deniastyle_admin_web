import client from "./client";

export const getSalesReport = (startDate, endDate) => {
  let url = "/reports/sales";
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) url += `?${params.toString()}`;
  return client.get(url).then((res) => res.data);
};

export const getTopProducts = () =>
  client.get("/reports/top-products").then((res) => res.data);

export const getOrdersByStatus = () =>
  client.get("/reports/orders-by-status").then((res) => res.data);
