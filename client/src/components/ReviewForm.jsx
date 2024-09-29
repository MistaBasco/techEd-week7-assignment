import "./ReviewForm.css";
import { useState, useEffect } from "react";

export default function ReviewForm({ current_user }) {
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnimeId, setSelectedAnimeId] = useState("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch(
          "https://teched-week7-assignment.onrender.com/anime"
        ); // Call the backend API to get anime list
        const data = await response.json();
        if (response.ok) {
          setAnimeList(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    }
    fetchAnime();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success states
    setError("");
    setSuccess(false);

    if (!selectedAnimeId || !rating || !reviewText) {
      setError("Please fill in all fields");
      return;
    }

    try {
      console.log(selectedAnimeId, userId, rating, reviewText);
      const response = await fetch(
        "https://teched-week7-assignment.onrender.com/reviews",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            anime_id: selectedAnimeId,
            user_id: current_user,
            rating: parseInt(rating, 10),
            review_text: reviewText,
          }),
        }
      );

      if (response.ok) {
        setSuccess(true); // Review posted successfully
        setRating("");
        setReviewText("");
        setSelectedAnimeId("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ReviewForm">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Review submitted successfully!</p>}
      <label htmlFor="anime">Select Anime:</label>
      <select
        id="anime"
        value={selectedAnimeId}
        onChange={(e) => setSelectedAnimeId(e.target.value)}
      >
        <option value="">-- Select Anime --</option>
        {animeList.map((anime) => (
          <option key={anime.anime_id} value={anime.anime_id}>
            {anime.title}
          </option>
        ))}
      </select>
      <div className="spacer">
        <label htmlFor="rating">Rating:</label>
        <input
          id="rating"
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>

      <label htmlFor="reviewText">Review:</label>
      <textarea
        id="reviewText"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}
