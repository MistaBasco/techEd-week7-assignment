import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReviewCard from "../components/ReviewCard";
import "./AnimeDetailPage.css";

export default function AnimeDetailPage({ current_user }) {
  const { id } = useParams(); // Extract the anime id from the URL
  const [anime, setAnime] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchAnimeDetails() {
      try {
        const response = await fetch(
          `https://teched-week7-assignment.onrender.com/anime/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setAnime(data.anime);
          setReviews(data.reviews);
          setTags(data.tags);
          console.log(data.reviews);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimeDetails();
  }, [id]);

  if (loading) {
    return <p>Loading anime details...</p>;
  }

  if (!anime) {
    return <p>Anime not found.</p>;
  }

  return (
    <>
      <div className="page AnimeDetailPage">
        <div className="AnimeContainer">
          <h1 className="AnimeTitle">{anime.title}</h1>
          {/* <img src={anime.cover_image} alt={anime.title} /> */}
          <div className="AnimeCover">
            <h1>This is definitely an image!</h1>
          </div>
          <p className="spacer">{anime.synopsis}</p>
          <p className="spacer">
            <strong>Release Year:</strong> {anime.release_year}
          </p>
          <p className="spacer">
            <strong>Avg Rating:</strong> {anime.average_rating}
          </p>
          <p className="spacer">
            <strong>Genre:</strong>
            <span className="GenreLink">{anime.genre_name}</span>
          </p>
          <div className="TagWrapper">
            <strong>Tags:</strong>
            {tags.length === 0 ? (
              <p>No tags available.</p>
            ) : (
              <ul>
                {tags.map((tag) => (
                  <li key={tag.tag_id}>{tag.tag_name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="ReviewContainer">
          <h1>Reviews</h1>
          <div className="Reviews">
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.review_id}
                  review={review}
                  current_user={current_user}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
