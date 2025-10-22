import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reserve from "./pages/Reserve";
import MyReservations from "./pages/MyReservations";
import Confirmation from "./pages/Confirmation";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      setError(e.message || "Request failed");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <section style={{
                background: "#f6f8fa",
                border: "1px solid #e1e4e8",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <button onClick={checkHealth} disabled={loading} style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid #0366d6",
                    background: loading ? "#9ec3ff" : "#2f81f7",
                    color: "white",
                    cursor: loading ? "not-allowed" : "pointer"
                  }}>
                    {loading ? "Checking..." : "Check Backend Health"}
                  </button>
                  {error && <span style={{ color: "#d73a49" }}>Error: {error}</span>}
                  {health && <code style={{ background: "#fff", padding: "4px 6px", borderRadius: 4, border: "1px solid #e1e4e8" }}>{JSON.stringify(health)}</code>}
                  {!error && !health && !loading && (
                    <span style={{ color: "#586069" }}>Click the button to test the backend at <code>/api/health</code>.</span>
                  )}
                </div>
              </section>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/my-reservations" element={<MyReservations />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
