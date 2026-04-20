import React, { useState } from "react";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import "./styles/global.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [page, setPage] = useState("products");
  const [cartCount, setCartCount] = useState(0);

  const onLogin = () => { setIsLoggedIn(true); setPage("products"); };
  const onLogout = () => { localStorage.removeItem("token"); setIsLoggedIn(false); setCartCount(0); };

  if (!isLoggedIn) return <AuthPage onLogin={onLogin} />;

  return (
    <div>
      <Navbar page={page} setPage={setPage} cartCount={cartCount} onLogout={onLogout} isLoggedIn={isLoggedIn} />
      {page === "products" && <ProductsPage onCartUpdate={setCartCount} />}
      {page === "cart" && <CartPage onCartUpdate={setCartCount} setPage={setPage} />}
      {page === "orders" && <OrdersPage />}
    </div>
  );
}
