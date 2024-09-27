// import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./pages/page.css";
import HomePage from "./pages/HomePage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import CreateReviewPage from "./pages/CreateReviewPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Title from "./components/Title";

export default function App() {
  return (
    <>
      <div className="App">
        <Title />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/create-review" element={<CreateReviewPage />} />
          <Route path="/user/:id" element={<UserDetailsPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          {/* Reroute not found to /404 */}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}
