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

// TODO: add profilepicture column in users
// Edit profile feature, edit review feature, show more stats (number of posts, how many posts liked) a likes page with all the liked reviews for each user would be nice too
//Not adding a route to add anime on purpose. users shouldn't be able to do that... admin only

export default function App() {
  let current_user = 1;
  return (
    <>
      <div className="App">
        <Title />
        <Header current_user={current_user} />
        <Routes>
          <Route path="/" element={<HomePage current_user={current_user} />} />
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
