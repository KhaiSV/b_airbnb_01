import React from "react";
import "./App.css";
import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";
import SearchPage from "./SearchPage";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <div
      //       style={{
      //         padding: "20px",
      //         backgroundColor: "#f0f0f0",
      //         border: "2px solid red",
      //         textAlign: "center",
      //       }}
      >
        {/* <h1 style={{ color: "red" }}>✅ App.jsx is working!</h1>
      <p>If you see this, App.jsx is running correctly.</p> */}
      </div>
      <Header />
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
