const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token") && {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
});

export const api = {
  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),
  login: (data) =>
    fetch(`${BASE_URL}/auth/login`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),
  getProducts: () =>
    fetch(`${BASE_URL}/products`, { headers: getHeaders() }).then((r) => r.json()),
  addToCart: (item) =>
    fetch(`${BASE_URL}/cart/add`, { method: "POST", headers: getHeaders(), body: JSON.stringify(item) }).then((r) => r.json()),
  getCart: () =>
    fetch(`${BASE_URL}/cart`, { headers: getHeaders() }).then((r) => r.json()),
  removeFromCart: (productId) =>
    fetch(`${BASE_URL}/cart/remove/${productId}`, { method: "DELETE", headers: getHeaders() }).then((r) => r.json()),
  clearCart: () =>
    fetch(`${BASE_URL}/cart/clear`, { method: "DELETE", headers: getHeaders() }).then((r) => r.json()),
  placeOrder: () =>
    fetch(`${BASE_URL}/orders`, { method: "POST", headers: getHeaders() }).then((r) => r.json()),
  getOrders: () =>
    fetch(`${BASE_URL}/orders`, { headers: getHeaders() }).then((r) => r.json()),
};
