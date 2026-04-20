import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/cart.css";

export default function CartPage({ onCartUpdate, setPage }) {
  const [cart, setCart] = useState([]);
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.getCart().then((res) => setCart(res.cart || [])); }, []);

  const remove = async (productId) => {
    const res = await api.removeFromCart(productId);
    setCart(res.cart || []); onCartUpdate((res.cart || []).length);
  };

  const placeOrder = async () => {
    setLoading(true);
    const res = await api.placeOrder();
    if (res.id) { setOrdered(true); setCart([]); onCartUpdate(0); }
    setLoading(false);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (ordered) return (
    <div className="order-success">
      <div className="success-icon">✓</div>
      <h2>Order Placed!</h2>
      <p>Your order has been confirmed.</p>
      <button className="btn-primary" style={{ width: "auto", padding: "12px 32px" }} onClick={() => setPage("orders")}>View Orders</button>
    </div>
  );

  return (
    <div className="container" style={{ padding: "32px 20px" }}>
      <h2 className="page-title">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="btn-primary" style={{ width: "auto", padding: "12px 32px" }} onClick={() => setPage("products")}>Browse Products</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product_id} className="cart-item">
                <div className="cart-item-letter">{item.name[0]}</div>
                <div className="cart-item-info"><h4>{item.name}</h4><p>Qty: {item.quantity}</p></div>
                <div className="cart-item-right">
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  <button className="btn-danger" onClick={() => remove(item.product_id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Items ({cart.length})</span><span>₹{total.toLocaleString()}</span></div>
            <div className="summary-row"><span>Delivery</span><span style={{ color: "#2ed573" }}>Free</span></div>
            <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            <button className="btn-primary" onClick={placeOrder} disabled={loading}>
              {loading ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
