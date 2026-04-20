import React, { useState } from "react";
import { api } from "../services/api";
import "../styles/auth.css";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (isLogin) {
        const res = await api.login({ email: form.email, password: form.password });
        if (res.access_token) { localStorage.setItem("token", res.access_token); onLogin(); }
        else setError(res.detail || "Login failed");
      } else {
        const res = await api.register(form);
        if (res.id) { setIsLogin(true); alert("Registered! Please login."); }
        else setError(res.detail || "Registration failed");
      }
    } catch { setError("Something went wrong"); }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">ShopFlow</div>
        <p className="auth-sub">{isLogin ? "Welcome back" : "Create your account"}</p>
        <div className="auth-tabs">
          <button className={isLogin ? "tab active" : "tab"} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? "tab active" : "tab"} onClick={() => setIsLogin(false)}>Register</button>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} />
        </div>
        {!isLogin && (
          <div className="form-group">
            <label>Username</label>
            <input name="username" placeholder="username" value={form.username} onChange={handle} />
          </div>
        )}
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
}
