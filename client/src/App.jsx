import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./pages/page.css";
import HomePage from "./pages/HomePage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import CreateReviewPage from "./pages/CreateReviewPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Title from "./components/Title";

// TODO: add profilepicture column in users
// Edit profile feature, edit review feature, show more stats (number of posts, how many posts liked) a likes page with all the liked reviews for each user would be nice too
//Not adding a route to add anime on purpose. users shouldn't be able to do that... admin only

export default function App() {
  const [current_user, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(
          "https://teched-week7-assignment.onrender.com/session",
          {
            credentials: "include", // Include session cookie
          }
        );
        const data = await response.json();

        if (response.ok) {
          setCurrentUser(data.userId); // Set the current user dynamically
        } else {
          setCurrentUser(null); // User not logged in
        }
      } catch (error) {
        console.error("Failed to fetch session", error);
        setCurrentUser(null); // Handle error by resetting the current user
      }
    }

    fetchSession();
  }, []);
  return (
    <>
      <div className="App">
        <Title />
        <Header current_user={current_user} setCurrentUser={setCurrentUser} />
        <Routes>
          <Route path="/" element={<HomePage current_user={current_user} />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/create-review" element={<CreateReviewPage />} />
          <Route path="/signup" element={<SignUpPage />} />
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
