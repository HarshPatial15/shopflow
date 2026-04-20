import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/products.css";

export default function ProductsPage({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState({});

  useEffect(() => { api.getProducts().then(setProducts); }, []);

  const addToCart = async (product) => {
    const res = await api.addToCart({ product_id: product.id, quantity: 1, price: product.price, name: product.name });
    if (res.cart) { setMsg({ [product.id]: "Added!" }); onCartUpdate(res.cart.length); setTimeout(() => setMsg({}), 1500); }
  };

  return (
    <div className="container" style={{ padding: "32px 20px" }}>
      <h2 className="page-title">Products</h2>
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-img">
              {p.image_url ? <img src={p.image_url} alt={p.name} /> : <div className="img-placeholder">{p.name[0]}</div>}
            </div>
            <div className="product-info">
              <span className="product-category">{p.category}</span>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="product-footer">
                <span className="product-price">₹{p.price.toLocaleString()}</span>
                <span className="product-stock">{p.stock} left</span>
              </div>
              <button className="btn-add" onClick={() => addToCart(p)}>
                {msg[p.id] ? "Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
