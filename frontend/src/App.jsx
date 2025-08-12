// App.jsx
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
import Detail from "./components/Detail"; // ✅ THÊM
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/details/:id" element={<Detail />} /> {/* ✅ THÊM ROUTE */}
        <Route path="/" element={<Home />} />
        {/* (không bắt buộc) 404: <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
