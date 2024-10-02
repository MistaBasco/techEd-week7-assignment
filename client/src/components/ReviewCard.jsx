import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "/src/components/ReviewCard.css";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

export default function ReviewCard({ review, current_user, onDelete }) {
  const {
    anime_title,
    reviewer_name,
    rating,
    review_text,
    likes,
    created_at,
    anime_id,
    review_id,
    user_id,
  } = review;

  const [currentLikes, setCurrentLikes] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const formattedDate = format(new Date(created_at), "MMM dd, yyyy");

  const isAuthor = review.user_id === current_user; // Check if the logged-in user is the review author

  // Fetch the like status when the component mounts
  useEffect(() => {
    async function fetchLikeStatus() {
      if (!current_user) return; // Don't fetch if there's no current user

      try {
        const response = await fetch(
          `https://teched-week7-assignment.onrender.com/reviews/${review_id}/liked?current_user=${encodeURIComponent(
            current_user
          )}`
        );
        const data = await response.json();
        setLiked(data.liked); // Set the initial liked state based on the server response
      } catch (error) {
        console.error("Error fetching like status:", error);
      } finally {
        setLoading(false); // Set loading to false once the request completes
      }
    }

    fetchLikeStatus();
  }, [review_id, current_user]);

  // Function to handle like action
  const handleLike = () => {
    if (liked) {
      setCurrentLikes(currentLikes - 1); // Decrement likes if unliked
    } else {
      setCurrentLikes(currentLikes + 1); // Increment likes if liked
    }
    setLiked(!liked);
  };

  return (
    <div className="ReviewCard">
      <Link to={`/anime/${anime_id}`}>
        <h3>{anime_title}</h3>
      </Link>
      <div className="spacer">
        <strong>Review by:</strong>
        <Link to={`/user/${user_id}`}>
          <p>{reviewer_name}</p>
        </Link>
      </div>

      <p className="spacer">
        <strong>Rating:</strong> {rating}/10
      </p>

      <p className="spacer">{review_text}</p>

      <p className="spacer">
        <strong>Likes:</strong> {currentLikes}
      </p>

      <p className="spacer">
        <strong>Date:</strong> {formattedDate}
      </p>
      {current_user && !loading && (
        <LikeButton
          reviewId={review_id}
          current_user={current_user}
          onLike={handleLike}
          liked={liked}
        />
      )}
      {isAuthor && current_user && (
        <DeleteButton
          reviewId={review.review_id}
          current_user={current_user}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
