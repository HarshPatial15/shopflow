import React from "react";
import "../styles/navbar.css";

export default function Navbar({ page, setPage, cartCount, onLogout, isLoggedIn }) {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage("products")}>ShopFlow</div>
      {isLoggedIn && (
        <div className="nav-links">
          <span onClick={() => setPage("products")} className={page === "products" ? "active" : ""}>Products</span>
          <span onClick={() => setPage("cart")} className={page === "cart" ? "active" : ""}>
            Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </span>
          <span onClick={() => setPage("orders")} className={page === "orders" ? "active" : ""}>Orders</span>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
