import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/orders.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.getOrders().then(setOrders); }, []);

  const statusColor = { pending: "#f9ca24", confirmed: "#6c63ff", shipped: "#45aaf2", delivered: "#2ed573", cancelled: "#ff4757" };

  return (
    <div className="container" style={{ padding: "32px 20px" }}>
      <h2 className="page-title">Your Orders</h2>
      {orders.length === 0 ? <p style={{ color: "#888" }}>No orders yet.</p> : orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <span className="order-id">Order #{order.id}</span>
              <span className="order-total">₹{order.total.toLocaleString()}</span>
            </div>
            <span className="order-status" style={{ background: statusColor[order.status] + "22", color: statusColor[order.status] }}>
              {order.status}
            </span>
          </div>
          <div className="order-items">
            {order.items.map((item, i) => (
              <div key={i} className="order-item-row">
                <span>Product #{item.product_id}</span>
                <span>Qty: {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
